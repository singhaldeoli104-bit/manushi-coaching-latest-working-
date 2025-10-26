-- Migration: Create action_items table
-- Purpose: Store action items and tasks for parents to complete
-- Date: 2025-10-25
-- Reference: Task management for parents

-- Create action_items table
CREATE TABLE IF NOT EXISTS public.action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User assignment
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,

  -- Action item content
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('form_to_fill', 'permission_needed', 'fee_payment', 'meeting_rsvp', 'document_submission', 'consent_required', 'feedback_request', 'general')) DEFAULT 'general',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',

  -- Status tracking
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  completed_at TIMESTAMPTZ,

  -- Deadlines
  due_date TIMESTAMPTZ,

  -- Optional data
  action_url TEXT, -- Link to form or related screen
  assigned_by UUID REFERENCES public.profiles(id), -- Teacher/admin who created it

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_action_items_user_id ON public.action_items(user_id);
CREATE INDEX IF NOT EXISTS idx_action_items_student_id ON public.action_items(student_id);
CREATE INDEX IF NOT EXISTS idx_action_items_status ON public.action_items(status);
CREATE INDEX IF NOT EXISTS idx_action_items_priority ON public.action_items(priority);
CREATE INDEX IF NOT EXISTS idx_action_items_due_date ON public.action_items(due_date);
CREATE INDEX IF NOT EXISTS idx_action_items_type ON public.action_items(type);

-- Composite index for common query (user + pending)
CREATE INDEX IF NOT EXISTS idx_action_items_user_pending
  ON public.action_items(user_id, status)
  WHERE status = 'pending';

-- RLS Policies
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own action items
CREATE POLICY "Users can view their action items"
  ON public.action_items FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own action items (mark as complete)
CREATE POLICY "Users can update their action items"
  ON public.action_items FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins and teachers can create action items
CREATE POLICY "Admins and teachers can create action items"
  ON public.action_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Insert sample action items for testing
DO $$
DECLARE
  parent_id UUID;
  student_id UUID;
  teacher_id UUID;
BEGIN
  -- Get a parent user
  SELECT id INTO parent_id FROM public.profiles WHERE role = 'parent' LIMIT 1;

  -- Get a teacher user
  SELECT id INTO teacher_id FROM public.profiles WHERE role = 'teacher' LIMIT 1;

  -- Get a student
  SELECT student_id INTO student_id
  FROM public.parent_child_relationships
  WHERE parent_id = parent_id
  LIMIT 1;

  IF parent_id IS NULL OR teacher_id IS NULL THEN
    RAISE NOTICE 'Please run the sample data insert manually with actual user IDs';
  ELSE
    -- Insert sample action items
    INSERT INTO public.action_items (
      user_id,
      student_id,
      title,
      description,
      type,
      priority,
      status,
      due_date,
      assigned_by,
      created_at
    ) VALUES
      -- PENDING - High Priority
      (
        parent_id,
        student_id,
        'Submit Medical Certificate',
        'Please submit the medical certificate for your child''s absence on October 20-22. This is required for attendance records.',
        'document_submission',
        'high',
        'pending',
        NOW() + INTERVAL '3 days',
        teacher_id,
        NOW() - INTERVAL '1 day'
      ),
      (
        parent_id,
        student_id,
        'Pay November School Fee',
        'The school fee for November 2025 is due by October 31st. Please make the payment to avoid late fees.',
        'fee_payment',
        'urgent',
        'pending',
        NOW() + INTERVAL '6 days',
        teacher_id,
        NOW() - INTERVAL '5 days'
      ),
      (
        parent_id,
        student_id,
        'RSVP for Parent-Teacher Meeting',
        'Please confirm your attendance for the Parent-Teacher meeting on November 20th at 10:00 AM.',
        'meeting_rsvp',
        'high',
        'pending',
        NOW() + INTERVAL '15 days',
        teacher_id,
        NOW() - INTERVAL '2 days'
      ),

      -- PENDING - Medium Priority
      (
        parent_id,
        student_id,
        'Fill Science Excursion Permission Form',
        'Your child''s class is going on a science excursion to the Science Museum on November 15th. Please fill the permission form.',
        'permission_needed',
        'medium',
        'pending',
        NOW() + INTERVAL '10 days',
        teacher_id,
        NOW() - INTERVAL '3 hours'
      ),
      (
        parent_id,
        student_id,
        'Provide Feedback on School Facilities',
        'We would appreciate your feedback on the new library and computer lab facilities. Please complete the survey.',
        'feedback_request',
        'low',
        'pending',
        NOW() + INTERVAL '20 days',
        teacher_id,
        NOW() - INTERVAL '1 day'
      ),
      (
        parent_id,
        student_id,
        'Update Emergency Contact Details',
        'Please verify and update your emergency contact information in the parent portal.',
        'form_to_fill',
        'medium',
        'pending',
        NOW() + INTERVAL '7 days',
        teacher_id,
        NOW() - INTERVAL '4 hours'
      ),

      -- COMPLETED
      (
        parent_id,
        student_id,
        'Submit Term 1 Report Acknowledgement',
        'Please acknowledge that you have received and reviewed your child''s Term 1 report card.',
        'consent_required',
        'medium',
        'completed',
        NOW() - INTERVAL '5 days',
        teacher_id,
        NOW() - INTERVAL '10 days'
      ),
      (
        parent_id,
        student_id,
        'Confirm Participation in Annual Sports Day',
        'Please confirm if your child will participate in the Annual Sports Day events.',
        'general',
        'low',
        'completed',
        NOW() - INTERVAL '2 days',
        teacher_id,
        NOW() - INTERVAL '7 days'
      );

    RAISE NOTICE 'Sample action items inserted successfully';
  END IF;
END $$;

-- Verify insertion
SELECT
  ai.id,
  ai.title,
  ai.type,
  ai.priority,
  ai.status,
  ai.due_date,
  CASE
    WHEN ai.due_date IS NULL THEN 'No deadline'
    WHEN ai.due_date < NOW() THEN 'Overdue'
    WHEN ai.due_date < NOW() + INTERVAL '3 days' THEN 'Due soon'
    ELSE 'Future'
  END as deadline_status,
  p.full_name as assigned_by_name
FROM public.action_items ai
LEFT JOIN public.profiles p ON ai.assigned_by = p.id
ORDER BY ai.status, ai.priority DESC, ai.due_date ASC
LIMIT 10;

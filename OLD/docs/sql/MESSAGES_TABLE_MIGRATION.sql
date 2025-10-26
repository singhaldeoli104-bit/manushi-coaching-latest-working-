-- Migration: Create messages table
-- Purpose: Store parent-teacher messages and communications
-- Date: 2025-10-25
-- Reference: Similar to notifications table

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Sender and recipient
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Message content
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',

  -- Metadata
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,

  -- Optional attachments (for future use)
  has_attachment BOOLEAN DEFAULT false,
  attachment_url TEXT,

  -- Relations (optional - for context)
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  related_type TEXT, -- 'assignment', 'attendance', 'behavior', 'general', 'fee', 'exam'

  -- Timestamps
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_student_id ON public.messages(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_priority ON public.messages(priority);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON public.messages(sent_at DESC);

-- Composite index for common query pattern (recipient + unread)
CREATE INDEX IF NOT EXISTS idx_messages_recipient_unread ON public.messages(recipient_id, is_read) WHERE is_read = false;

-- RLS Policies
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages they sent or received
CREATE POLICY "Users can view their messages"
  ON public.messages FOR SELECT
  USING (
    sender_id = auth.uid() OR
    recipient_id = auth.uid()
  );

-- Users can send messages (create)
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- Recipients can update their messages (mark as read)
CREATE POLICY "Recipients can update their messages"
  ON public.messages FOR UPDATE
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

-- Users can delete messages they sent or received
CREATE POLICY "Users can delete their messages"
  ON public.messages FOR DELETE
  USING (
    sender_id = auth.uid() OR
    recipient_id = auth.uid()
  );

-- Insert sample messages for testing
-- Note: Replace PARENT_USER_ID and TEACHER_USER_ID with actual IDs

-- First, let's get IDs we'll use
DO $$
DECLARE
  parent_id UUID;
  teacher_id UUID;
  student_id UUID;
BEGIN
  -- Get a parent user
  SELECT id INTO parent_id FROM public.profiles WHERE role = 'parent' LIMIT 1;

  -- Get a teacher user
  SELECT id INTO teacher_id FROM public.profiles WHERE role = 'teacher' LIMIT 1;

  -- Get a student (if parent_child_relationships exists)
  SELECT student_id INTO student_id
  FROM public.parent_child_relationships
  WHERE parent_id = parent_id
  LIMIT 1;

  -- If we don't have the necessary users, create sample data manually
  IF parent_id IS NULL OR teacher_id IS NULL THEN
    RAISE NOTICE 'Please run the sample data insert manually with actual user IDs';
  ELSE
    -- Insert sample messages
    INSERT INTO public.messages (
      sender_id,
      recipient_id,
      subject,
      body,
      priority,
      is_read,
      student_id,
      related_type,
      sent_at
    ) VALUES
      -- UNREAD messages (from teacher to parent)
      (
        teacher_id,
        parent_id,
        'Regarding Math Assignment Submission',
        'Dear Parent, Your child has not submitted the Math homework for Chapter 5. The deadline was October 20th. Please ensure the assignment is completed and submitted by this week. If you need any clarification, feel free to reach out.',
        'high',
        false,
        student_id,
        'assignment',
        NOW() - INTERVAL '2 hours'
      ),
      (
        teacher_id,
        parent_id,
        'Excellent Performance in Science Exam!',
        'I am pleased to inform you that your child scored 95/100 in the recent Science mid-term exam. Their understanding of concepts and problem-solving skills are commendable. Keep encouraging them!',
        'medium',
        false,
        student_id,
        'exam',
        NOW() - INTERVAL '5 hours'
      ),
      (
        teacher_id,
        parent_id,
        'URGENT: Parent-Teacher Meeting Tomorrow',
        'This is a reminder about the Parent-Teacher meeting scheduled for tomorrow (October 26th) at 10:00 AM. Please confirm your attendance. We will discuss your child''s academic progress and behavior.',
        'high',
        false,
        student_id,
        'general',
        NOW() - INTERVAL '1 day'
      ),
      (
        teacher_id,
        parent_id,
        'Low Attendance Alert',
        'Dear Parent, Your child''s attendance has dropped to 72% this month. Regular attendance is important for academic performance. Please ensure your child attends school regularly unless there is a valid reason.',
        'high',
        false,
        student_id,
        'attendance',
        NOW() - INTERVAL '6 hours'
      ),
      (
        teacher_id,
        parent_id,
        'Invitation: Science Exhibition Next Week',
        'We are organizing a Science Exhibition on November 5th where students will showcase their projects. Your child has prepared a wonderful project on "Solar System". We would love to see you at the event!',
        'low',
        false,
        student_id,
        'general',
        NOW() - INTERVAL '1 day'
      ),

      -- READ messages (from teacher to parent)
      (
        teacher_id,
        parent_id,
        'Fee Payment Reminder',
        'Dear Parent, This is a gentle reminder that the school fee for November 2025 is due by October 31st. Please make the payment at your earliest convenience to avoid late fees.',
        'medium',
        true,
        student_id,
        'fee',
        NOW() - INTERVAL '3 days'
      ),
      (
        teacher_id,
        parent_id,
        'Improvement in Behavior - Well Done!',
        'I wanted to share some positive feedback. Your child has shown significant improvement in classroom behavior over the past two weeks. They are more attentive and participative. Keep up the good work!',
        'low',
        true,
        student_id,
        'behavior',
        NOW() - INTERVAL '5 days'
      ),
      (
        teacher_id,
        parent_id,
        'English Assignment Submitted Successfully',
        'Your child has submitted the English essay on "My Favorite Book" on time. The quality of work is good. Grades will be published by next week.',
        'low',
        true,
        student_id,
        'assignment',
        NOW() - INTERVAL '1 week'
      );

    RAISE NOTICE 'Sample messages inserted successfully';
  END IF;
END $$;

-- Verify insertion (for manual testing)
SELECT
  m.id,
  m.subject,
  m.priority,
  m.is_read,
  m.related_type,
  sender.full_name as sender_name,
  recipient.full_name as recipient_name,
  m.sent_at
FROM public.messages m
LEFT JOIN public.profiles sender ON m.sender_id = sender.id
LEFT JOIN public.profiles recipient ON m.recipient_id = recipient.id
ORDER BY m.sent_at DESC
LIMIT 10;

-- Migration: Create announcements table
-- Purpose: Store school announcements visible to all parents
-- Date: 2025-10-25
-- Reference: Similar to notifications table

-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Content fields
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT CHECK (category IN ('Academic', 'Events', 'Urgent', 'General', 'Holiday')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',

  -- Metadata
  is_important BOOLEAN DEFAULT false,
  published_by TEXT, -- 'Principal', 'Admin', 'Teacher', 'School'

  -- Optional action/attachment
  action_url TEXT,
  attachment_url TEXT,

  -- Timestamps
  published_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_announcements_category ON public.announcements(category);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON public.announcements(priority);
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON public.announcements(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_important ON public.announcements(is_important) WHERE is_important = true;
CREATE INDEX IF NOT EXISTS idx_announcements_active ON public.announcements(expires_at) WHERE expires_at IS NULL OR expires_at > NOW();

-- RLS Policies
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users (parents, teachers, students) to view announcements
CREATE POLICY "Allow authenticated read access to announcements"
  ON public.announcements FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only admins/teachers can create announcements (for future use)
CREATE POLICY "Allow admin/teacher insert announcements"
  ON public.announcements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Only admins/teachers can update announcements
CREATE POLICY "Allow admin/teacher update announcements"
  ON public.announcements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Only admins can delete announcements
CREATE POLICY "Allow admin delete announcements"
  ON public.announcements FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert sample announcements for testing
INSERT INTO public.announcements (
  title,
  message,
  category,
  priority,
  is_important,
  published_by,
  published_at,
  expires_at
) VALUES
  -- Important announcements
  (
    'School Closure - Public Holiday',
    'The school will remain closed on November 1st, 2025 (Diwali). Classes will resume from November 2nd, 2025. Wishing you all a very Happy Diwali!',
    'Holiday',
    'urgent',
    true,
    'Principal',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '5 days'
  ),
  (
    'Parent-Teacher Meeting - November 20th',
    'Parent-Teacher meetings are scheduled for November 20, 2025 from 10:00 AM to 4:00 PM. Please book your slot through the app or contact your child''s class teacher.',
    'Events',
    'high',
    true,
    'Admin',
    NOW() - INTERVAL '2 days',
    '2025-11-20'::TIMESTAMPTZ
  ),
  (
    'Mid-Term Examination Schedule Released',
    'The mid-term examination schedule for all grades has been released. Please check the School Calendar section for detailed timetable. Exams will begin from November 25th, 2025.',
    'Academic',
    'high',
    true,
    'Admin',
    NOW() - INTERVAL '3 hours',
    '2025-11-25'::TIMESTAMPTZ
  ),

  -- Regular announcements
  (
    'Annual Sports Day - December 10th',
    'Annual Sports Day will be held on December 10th, 2025 at the school ground. All students are encouraged to participate. Registration forms will be shared next week.',
    'Events',
    'medium',
    false,
    'School',
    NOW() - INTERVAL '5 hours',
    '2025-12-10'::TIMESTAMPTZ
  ),
  (
    'Library Books Return Reminder',
    'All students who have borrowed books from the library are requested to return them by November 15th. Late fees will be applicable after this date.',
    'General',
    'low',
    false,
    'Admin',
    NOW() - INTERVAL '1 day',
    '2025-11-15'::TIMESTAMPTZ
  ),
  (
    'Science Exhibition Next Month',
    'A Science Exhibition showcasing student projects will be held in December. Students interested in participating should contact their Science teacher by November 20th.',
    'Academic',
    'medium',
    false,
    'Teacher',
    NOW() - INTERVAL '2 days',
    '2025-12-01'::TIMESTAMPTZ
  ),
  (
    'Updated School Timings for Winter',
    'From December 1st, school timings will be changed to 9:00 AM - 3:30 PM due to winter season. Morning assembly will start at 8:45 AM.',
    'General',
    'medium',
    false,
    'Admin',
    NOW() - INTERVAL '6 hours',
    '2025-12-01'::TIMESTAMPTZ
  ),
  (
    'Winter Holiday Notice',
    'Winter holidays will begin from December 24th, 2025 and school will reopen on January 6th, 2026. Holiday homework will be shared before the break.',
    'Holiday',
    'medium',
    false,
    'Principal',
    NOW() - INTERVAL '3 days',
    '2025-12-24'::TIMESTAMPTZ
  ),

  -- Expired announcement (for testing filters)
  (
    'Admission Open for New Session',
    'Admissions for the academic year 2025-26 are now open. Visit the school office for inquiry and registration forms.',
    'General',
    'low',
    false,
    'Admin',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '5 days'  -- Expired 5 days ago
  );

-- Verify insertion
SELECT
  id,
  title,
  category,
  priority,
  is_important,
  published_by,
  CASE
    WHEN expires_at IS NULL THEN 'No expiry'
    WHEN expires_at > NOW() THEN 'Active'
    ELSE 'Expired'
  END as status,
  published_at
FROM public.announcements
ORDER BY published_at DESC;

-- ================================================
-- Create and Populate Announcements Table
-- ================================================

-- Drop existing table and recreate with correct structure
DROP TABLE IF EXISTS public.announcements CASCADE;

-- Create table with correct structure matching the app
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Academic', 'Events', 'Urgent', 'General', 'Holiday')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  is_important BOOLEAN DEFAULT FALSE,
  published_by TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON public.announcements(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_category ON public.announcements(category);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON public.announcements(priority);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Allow all authenticated users to view
DROP POLICY IF EXISTS "Anyone can view announcements" ON public.announcements;
CREATE POLICY "Anyone can view announcements" ON public.announcements FOR SELECT USING (true);

-- Insert sample data
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
    NOW() + INTERVAL '15 days'
  ),
  (
    'Mid-Term Examination Schedule Released',
    'The mid-term examination schedule for all grades has been released. Please check the School Calendar section for detailed timetable. Exams will begin from November 25th, 2025.',
    'Academic',
    'high',
    true,
    'Admin',
    NOW() - INTERVAL '3 hours',
    NOW() + INTERVAL '20 days'
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
    NOW() + INTERVAL '30 days'
  ),
  (
    'Library Books Return Reminder',
    'All students who have borrowed books from the library are requested to return them by November 15th. Late fees will be applicable after this date.',
    'General',
    'low',
    false,
    'Admin',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '10 days'
  ),
  (
    'Science Exhibition Next Month',
    'A Science Exhibition showcasing student projects will be held in December. Students interested in participating should contact their Science teacher by November 20th.',
    'Academic',
    'medium',
    false,
    'Teacher',
    NOW() - INTERVAL '2 days',
    NOW() + INTERVAL '25 days'
  ),
  (
    'Updated School Timings for Winter',
    'From December 1st, school timings will be changed to 9:00 AM - 3:30 PM due to winter season. Morning assembly will start at 8:45 AM.',
    'General',
    'medium',
    false,
    'Admin',
    NOW() - INTERVAL '6 hours',
    NOW() + INTERVAL '28 days'
  ),
  (
    'Winter Holiday Notice',
    'Winter holidays will begin from December 24th, 2025 and school will reopen on January 6th, 2026. Holiday homework will be shared before the break.',
    'Holiday',
    'medium',
    false,
    'Principal',
    NOW() - INTERVAL '3 days',
    NOW() + INTERVAL '50 days'
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

-- Verify the data was inserted
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

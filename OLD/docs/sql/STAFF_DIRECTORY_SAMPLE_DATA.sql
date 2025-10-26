-- Sample Data: Staff Directory
-- Purpose: Insert sample staff members into profiles table
-- Date: 2025-10-25
-- Note: Staff directory uses existing profiles table filtered by role

-- This script assumes the profiles table already exists
-- We'll insert sample staff members with different roles and departments

-- Insert sample staff members (teachers, admin, principal)
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  phone,
  avatar_url,
  created_at
) VALUES
  -- Principal
  (
    gen_random_uuid(),
    'principal@school.edu',
    'Dr. Sarah Johnson',
    'admin',
    '+1-555-0101',
    NULL,
    NOW()
  ),

  -- Vice Principal
  (
    gen_random_uuid(),
    'vprincipal@school.edu',
    'Mr. Michael Chen',
    'admin',
    '+1-555-0102',
    NULL,
    NOW()
  ),

  -- Teachers
  (
    gen_random_uuid(),
    'math.teacher@school.edu',
    'Ms. Emily Rodriguez',
    'teacher',
    '+1-555-0201',
    NULL,
    NOW()
  ),
  (
    gen_random_uuid(),
    'science.teacher@school.edu',
    'Dr. James Wilson',
    'teacher',
    '+1-555-0202',
    NULL,
    NOW()
  ),
  (
    gen_random_uuid(),
    'english.teacher@school.edu',
    'Mrs. Patricia Brown',
    'teacher',
    '+1-555-0203',
    NULL,
    NOW()
  ),
  (
    gen_random_uuid(),
    'history.teacher@school.edu',
    'Mr. David Martinez',
    'teacher',
    '+1-555-0204',
    NULL,
    NOW()
  ),
  (
    gen_random_uuid(),
    'pe.teacher@school.edu',
    'Coach Robert Taylor',
    'teacher',
    '+1-555-0205',
    NULL,
    NOW()
  ),
  (
    gen_random_uuid(),
    'art.teacher@school.edu',
    'Ms. Linda Anderson',
    'teacher',
    '+1-555-0206',
    NULL,
    NOW()
  ),

  -- Administrative Staff
  (
    gen_random_uuid(),
    'librarian@school.edu',
    'Mrs. Susan White',
    'admin',
    '+1-555-0301',
    NULL,
    NOW()
  ),
  (
    gen_random_uuid(),
    'counselor@school.edu',
    'Dr. Karen Thompson',
    'admin',
    '+1-555-0302',
    NULL,
    NOW()
  ),
  (
    gen_random_uuid(),
    'office.admin@school.edu',
    'Ms. Jennifer Garcia',
    'admin',
    '+1-555-0303',
    NULL,
    NOW()
  );

-- Add metadata columns if they don't exist (optional - for extended staff info)
-- These would be added to profiles table in a real implementation
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS position TEXT;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS office_location TEXT;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS office_hours TEXT;

-- For now, we'll use a separate staff_metadata table
CREATE TABLE IF NOT EXISTS public.staff_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  department TEXT, -- 'Mathematics', 'Science', 'English', 'Administration', etc.
  position TEXT, -- 'Principal', 'Teacher', 'Counselor', 'Librarian', etc.
  subjects TEXT[], -- ['Algebra', 'Geometry'] for teachers
  office_location TEXT, -- 'Room 101', 'Admin Block', etc.
  office_hours TEXT, -- 'Mon-Fri 9:00 AM - 4:00 PM'
  bio TEXT, -- Short biography
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_staff_metadata_user_id ON public.staff_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_metadata_department ON public.staff_metadata(department);

-- RLS Policies
ALTER TABLE public.staff_metadata ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view staff metadata
CREATE POLICY "Allow authenticated read access to staff metadata"
  ON public.staff_metadata FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only admins can update staff metadata
CREATE POLICY "Allow admin update staff metadata"
  ON public.staff_metadata FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert staff metadata for sample staff
INSERT INTO public.staff_metadata (
  user_id,
  department,
  position,
  subjects,
  office_location,
  office_hours,
  bio
)
SELECT
  p.id,
  metadata.department,
  metadata.position,
  metadata.subjects,
  metadata.office_location,
  metadata.office_hours,
  metadata.bio
FROM public.profiles p
CROSS JOIN LATERAL (
  VALUES
    -- Match by email to insert metadata
    ('principal@school.edu', 'Administration', 'Principal', NULL, 'Admin Office - Room 001', 'Mon-Fri: 8:00 AM - 5:00 PM', 'Dr. Sarah Johnson has been the principal for 10 years. She is dedicated to student success and academic excellence.'),
    ('vprincipal@school.edu', 'Administration', 'Vice Principal', NULL, 'Admin Office - Room 002', 'Mon-Fri: 8:30 AM - 4:30 PM', 'Mr. Michael Chen oversees student affairs and daily operations.'),
    ('math.teacher@school.edu', 'Mathematics', 'Senior Teacher', ARRAY['Algebra', 'Geometry', 'Calculus'], 'Math Block - Room 201', 'Mon-Wed-Fri: 3:00 PM - 4:00 PM', 'Ms. Emily Rodriguez has 15 years of teaching experience in mathematics.'),
    ('science.teacher@school.edu', 'Science', 'Senior Teacher', ARRAY['Physics', 'Chemistry', 'Biology'], 'Science Lab - Room 301', 'Tue-Thu: 3:00 PM - 4:00 PM', 'Dr. James Wilson holds a PhD in Physics and loves making science fun.'),
    ('english.teacher@school.edu', 'English', 'Teacher', ARRAY['Literature', 'Writing', 'Grammar'], 'English Block - Room 101', 'Mon-Fri: 2:30 PM - 3:30 PM', 'Mrs. Patricia Brown is passionate about literature and creative writing.'),
    ('history.teacher@school.edu', 'Social Studies', 'Teacher', ARRAY['History', 'Geography', 'Civics'], 'Humanities - Room 102', 'Mon-Wed: 3:00 PM - 4:00 PM', 'Mr. David Martinez brings history to life with engaging storytelling.'),
    ('pe.teacher@school.edu', 'Physical Education', 'Coach', ARRAY['Physical Education', 'Sports'], 'Sports Complex', 'By appointment', 'Coach Robert Taylor has trained multiple championship teams.'),
    ('art.teacher@school.edu', 'Arts', 'Teacher', ARRAY['Art', 'Craft', 'Design'], 'Art Studio - Room 401', 'Tue-Thu: 3:00 PM - 4:00 PM', 'Ms. Linda Anderson encourages creativity and artistic expression.'),
    ('librarian@school.edu', 'Library', 'Librarian', NULL, 'Library - Main Desk', 'Mon-Fri: 8:00 AM - 5:00 PM', 'Mrs. Susan White helps students discover the joy of reading.'),
    ('counselor@school.edu', 'Counseling', 'School Counselor', NULL, 'Counseling Office - Room 003', 'Mon-Fri: 9:00 AM - 4:00 PM (By appointment)', 'Dr. Karen Thompson provides academic and personal counseling to students.'),
    ('office.admin@school.edu', 'Administration', 'Office Administrator', NULL, 'Front Office', 'Mon-Fri: 8:00 AM - 4:00 PM', 'Ms. Jennifer Garcia handles admissions, attendance, and general inquiries.')
) AS metadata(email, department, position, subjects, office_location, office_hours, bio)
WHERE p.email = metadata.email
ON CONFLICT (user_id) DO NOTHING;

-- Verify insertion
SELECT
  p.full_name,
  p.role,
  p.email,
  p.phone,
  sm.department,
  sm.position,
  sm.office_location
FROM public.profiles p
LEFT JOIN public.staff_metadata sm ON p.id = sm.user_id
WHERE p.role IN ('teacher', 'admin')
ORDER BY sm.department, p.full_name;

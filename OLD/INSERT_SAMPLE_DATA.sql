-- Sample Data for Testing Supabase Integration
-- Run this in Supabase SQL Editor after creating all tables

-- IMPORTANT: This script requires authenticated users in auth.users table
-- Make sure you have created at least one user account through Supabase Auth first

-- ============================================================================
-- STEP 1: CREATE PROFILES (Student and Teacher)
-- ============================================================================

-- First, check if we have any auth users
SELECT 'Auth users available: ' || COUNT(*) as status FROM auth.users;

-- Create BOTH student and teacher profiles from the SAME auth user
-- This ensures we always have a teacher profile for testing
INSERT INTO profiles (id, email, full_name, role)
SELECT
  au.id,
  au.email,
  'Test Student',
  'student'
FROM auth.users au
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- Now create teacher profile with the SAME user ID
-- This will update the existing profile to be a teacher
INSERT INTO profiles (id, email, full_name, role)
SELECT
  au.id,
  au.email,
  'Dr. Sarah Johnson',
  'teacher'
FROM auth.users au
LIMIT 1
ON CONFLICT (id)
DO UPDATE SET
  full_name = 'Dr. Sarah Johnson',
  role = 'teacher';

-- Update teacher profile with optional fields
UPDATE profiles
SET
  specialization = 'Mathematics',
  subjects = ARRAY['MATH', 'PHYS'],
  is_active = true
WHERE role = 'teacher';

-- Update with batch_id if column exists
DO $$
BEGIN
  UPDATE profiles
  SET batch_id = (SELECT id FROM batches LIMIT 1)
  WHERE role IN ('student', 'teacher') AND batch_id IS NULL;
EXCEPTION WHEN undefined_column THEN
  NULL;
END $$;

-- Verify profiles were created
SELECT 'Student profiles created: ' || COUNT(*) as status FROM profiles WHERE role = 'student';
SELECT 'Teacher profiles created: ' || COUNT(*) as status FROM profiles WHERE role = 'teacher';

-- Show the profiles
SELECT id, email, full_name, role FROM profiles;

-- ============================================================================
-- STEP 2: INSERT CLASSES (Now that teacher exists!)
-- ============================================================================

INSERT INTO classes (batch_id, subject, teacher_id, title, description, scheduled_at, duration_minutes, status)
SELECT
  b.id as batch_id,
  'Mathematics' as subject,
  p.id as teacher_id,
  'Advanced Calculus - Derivatives' as title,
  'Understanding derivatives and their applications' as description,
  CURRENT_TIMESTAMP + INTERVAL '2 hours' as scheduled_at,
  60 as duration_minutes,
  'scheduled' as status
FROM batches b
CROSS JOIN (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1) p
LIMIT 1;

INSERT INTO classes (batch_id, subject, teacher_id, title, description, scheduled_at, duration_minutes, status)
SELECT
  b.id as batch_id,
  'Physics' as subject,
  p.id as teacher_id,
  'Mechanics - Newton Laws' as title,
  'Laws of motion and their real-world applications' as description,
  CURRENT_TIMESTAMP + INTERVAL '4 hours' as scheduled_at,
  90 as duration_minutes,
  'scheduled' as status
FROM batches b
CROSS JOIN (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1) p
LIMIT 1;

INSERT INTO classes (batch_id, subject, teacher_id, title, description, scheduled_at, duration_minutes, status)
SELECT
  b.id as batch_id,
  'Chemistry' as subject,
  p.id as teacher_id,
  'Organic Chemistry - Reactions' as title,
  'Understanding organic compound reactions' as description,
  CURRENT_TIMESTAMP + INTERVAL '6 hours' as scheduled_at,
  60 as duration_minutes,
  'scheduled' as status
FROM batches b
CROSS JOIN (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1) p
LIMIT 1;

SELECT 'Classes created: ' || COUNT(*) as status FROM classes;

-- ============================================================================
-- STEP 3: INSERT ASSIGNMENTS
-- ============================================================================

INSERT INTO assignments (teacher_id, class_id, subject, title, description, instructions, total_points, due_date, status)
SELECT
  teacher_id,
  id as class_id,
  'Mathematics' as subject,
  'Calculus Problem Set 5' as title,
  'Solve problems on derivatives and integration' as description,
  'Complete all 10 problems. Show your work.' as instructions,
  100 as total_points,
  CURRENT_DATE + INTERVAL '1 day' as due_date,
  'published' as status
FROM classes
WHERE subject = 'Mathematics'
LIMIT 1;

INSERT INTO assignments (teacher_id, class_id, subject, title, description, instructions, total_points, due_date, status)
SELECT
  teacher_id,
  id as class_id,
  'Physics' as subject,
  'Lab Report: Pendulum Motion' as title,
  'Write a detailed lab report on pendulum experiments' as description,
  'Include hypothesis, methodology, observations, and conclusions.' as instructions,
  50 as total_points,
  CURRENT_DATE + INTERVAL '2 days' as due_date,
  'published' as status
FROM classes
WHERE subject = 'Physics'
LIMIT 1;

INSERT INTO assignments (teacher_id, class_id, subject, title, description, instructions, total_points, due_date, status)
SELECT
  teacher_id,
  id as class_id,
  'Chemistry' as subject,
  'Organic Reactions Quiz' as title,
  'Complete the online quiz on organic reactions' as description,
  'Answer all 20 multiple choice questions within 30 minutes.' as instructions,
  25 as total_points,
  CURRENT_DATE + INTERVAL '5 days' as due_date,
  'published' as status
FROM classes
WHERE subject = 'Chemistry'
LIMIT 1;

SELECT 'Assignments created: ' || COUNT(*) as status FROM assignments;

-- ============================================================================
-- STEP 4: INSERT ATTENDANCE RECORDS
-- ============================================================================

INSERT INTO attendance (class_id, student_id, batch_id, date, status, marked_by)
SELECT
  c.id as class_id,
  p.id as student_id,
  c.batch_id,
  CURRENT_DATE - INTERVAL '1 day' as date,
  'present' as status,
  c.teacher_id as marked_by
FROM classes c
CROSS JOIN (SELECT id FROM profiles WHERE role = 'student' LIMIT 1) p
LIMIT 3;

INSERT INTO attendance (class_id, student_id, batch_id, date, status, marked_by)
SELECT
  c.id as class_id,
  p.id as student_id,
  c.batch_id,
  CURRENT_DATE - INTERVAL '2 days' as date,
  'present' as status,
  c.teacher_id as marked_by
FROM classes c
CROSS JOIN (SELECT id FROM profiles WHERE role = 'student' LIMIT 1) p
LIMIT 3;

SELECT 'Attendance records created: ' || COUNT(*) as status FROM attendance;

-- ============================================================================
-- STEP 5: INSERT ANNOUNCEMENTS
-- ============================================================================

INSERT INTO announcements (title, content, author_id, target_role, priority, is_pinned, published_at)
SELECT
  'Important: Semester Exams Schedule' as title,
  'The semester final exams will begin on January 15, 2025. Please check your individual timetables.' as content,
  id as author_id,
  'all' as target_role,
  'high' as priority,
  true as is_pinned,
  NOW() as published_at
FROM profiles
WHERE role = 'teacher'
LIMIT 1;

INSERT INTO announcements (title, content, author_id, target_role, priority, published_at)
SELECT
  'New Study Materials Available' as title,
  'New video lectures for Mathematics and Physics have been uploaded to the Study Library.' as content,
  id as author_id,
  'student' as target_role,
  'medium' as priority,
  NOW() - INTERVAL '1 day' as published_at
FROM profiles
WHERE role = 'teacher'
LIMIT 1;

SELECT 'Announcements created: ' || COUNT(*) as status FROM announcements;

-- ============================================================================
-- FINAL VERIFICATION & SUMMARY
-- ============================================================================

SELECT '=== DATA INSERTION COMPLETE ===' as status;
SELECT 'Auth Users: ' || COUNT(*) as status FROM auth.users;
SELECT 'Student Profiles: ' || COUNT(*) as status FROM profiles WHERE role = 'student';
SELECT 'Teacher Profiles: ' || COUNT(*) as status FROM profiles WHERE role = 'teacher';
SELECT 'Classes: ' || COUNT(*) as status FROM classes;
SELECT 'Assignments: ' || COUNT(*) as status FROM assignments;
SELECT 'Attendance Records: ' || COUNT(*) as status FROM attendance;
SELECT 'Announcements: ' || COUNT(*) as status FROM announcements;

-- Show today's schedule
SELECT '=== TODAY''S CLASSES ===' as info;
SELECT subject, title, scheduled_at, duration_minutes, teacher_id
FROM classes
WHERE DATE(scheduled_at) = CURRENT_DATE
ORDER BY scheduled_at;

-- Show all assignments
SELECT '=== ALL ASSIGNMENTS ===' as info;
SELECT subject, title, due_date, total_points, teacher_id
FROM assignments
ORDER BY due_date;

-- Show profile details
SELECT '=== PROFILE DETAILS ===' as info;
SELECT id, email, full_name, role, is_active
FROM profiles
ORDER BY role, full_name;

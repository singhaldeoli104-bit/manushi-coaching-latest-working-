-- ============================================================================
-- Supabase Test Data for TeacherHomeScreen
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- 1. CREATE TABLES (if they don't exist)
-- ============================================================================

-- Teacher Profiles Table
CREATE TABLE IF NOT EXISTS teacher_profiles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes Table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  teacher_id UUID REFERENCES teacher_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Class Schedule Table
CREATE TABLE IF NOT EXISTS class_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id),
  teacher_id UUID REFERENCES teacher_profiles(id),
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id),
  teacher_id UUID REFERENCES teacher_profiles(id),
  date DATE NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'submitted'
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parent Profiles Table
CREATE TABLE IF NOT EXISTS parent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID,
  recipient_id UUID,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  is_urgent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teacher Tasks Table
CREATE TABLE IF NOT EXISTS teacher_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES teacher_profiles(id),
  title TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'overdue', 'done'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. INSERT TEST DATA
-- ============================================================================

-- Insert Test Teacher (using fallback ID from app)
INSERT INTO teacher_profiles (id, name, email, phone, avatar_url)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Mr. Test Teacher',
  'teacher@test.com',
  '+91 9876543210',
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Insert Test Classes
INSERT INTO classes (id, name, subject, grade, teacher_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Class 8A', 'Mathematics', '8', '22222222-2222-2222-2222-222222222222'),
  ('11111111-1111-1111-1111-111111111112', 'Class 9B', 'Science', '9', '22222222-2222-2222-2222-222222222222'),
  ('11111111-1111-1111-1111-111111111113', 'Class 10C', 'English', '10', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

-- Insert Today's Schedule
-- IMPORTANT: Change day_of_week to match today (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)
-- For Saturday, use 6
INSERT INTO class_schedule (class_id, teacher_id, day_of_week, start_time, end_time, room)
VALUES
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 6, '10:00', '11:00', 'Room 204'),
  ('11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 6, '14:00', '15:00', 'Room 301'),
  ('11111111-1111-1111-1111-111111111113', '22222222-2222-2222-2222-222222222222', 6, '16:00', '17:00', 'Room 105');

-- Insert Attendance Records (for today)
INSERT INTO attendance (class_id, teacher_id, date, status)
VALUES
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', CURRENT_DATE, 'pending'),
  ('11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', CURRENT_DATE, 'submitted');

-- Insert Test Parents
INSERT INTO parent_profiles (id, name, email)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'Aarav''s Parent', 'aarav.parent@test.com'),
  ('33333333-3333-3333-3333-333333333334', 'Priya''s Parent', 'priya.parent@test.com')
ON CONFLICT (id) DO NOTHING;

-- Insert Test Messages
INSERT INTO messages (sender_id, recipient_id, content, read, is_urgent)
VALUES
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Aarav will be absent tomorrow due to fever. Please excuse his absence.', FALSE, TRUE),
  ('33333333-3333-3333-3333-333333333334', '22222222-2222-2222-2222-222222222222', 'Thank you for the excellent feedback on Priya''s project!', FALSE, FALSE);

-- Insert Test Tasks
INSERT INTO teacher_tasks (teacher_id, title, due_date, status)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'Submit grades for 8A Term Test', CURRENT_DATE, 'pending'),
  ('22222222-2222-2222-2222-222222222222', 'Approve leave request from student', CURRENT_DATE + INTERVAL '2 days', 'pending'),
  ('22222222-2222-2222-2222-222222222222', 'Prepare lesson plan for next week', CURRENT_DATE + INTERVAL '5 days', 'pending');

-- ============================================================================
-- 3. VERIFY DATA
-- ============================================================================

-- Check if data was inserted
SELECT 'Teacher Profile' as table_name, COUNT(*) as count FROM teacher_profiles WHERE id = '22222222-2222-2222-2222-222222222222'
UNION ALL
SELECT 'Classes', COUNT(*) FROM classes WHERE teacher_id = '22222222-2222-2222-2222-222222222222'
UNION ALL
SELECT 'Schedule', COUNT(*) FROM class_schedule WHERE teacher_id = '22222222-2222-2222-2222-222222222222'
UNION ALL
SELECT 'Attendance', COUNT(*) FROM attendance WHERE teacher_id = '22222222-2222-2222-2222-222222222222'
UNION ALL
SELECT 'Messages', COUNT(*) FROM messages WHERE recipient_id = '22222222-2222-2222-2222-222222222222'
UNION ALL
SELECT 'Tasks', COUNT(*) FROM teacher_tasks WHERE teacher_id = '22222222-2222-2222-2222-222222222222';

-- ============================================================================
-- Done! Now reload the app and you should see data!
-- ============================================================================

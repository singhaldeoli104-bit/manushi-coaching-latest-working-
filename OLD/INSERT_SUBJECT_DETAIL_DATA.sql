-- ============================================================================
-- INSERT SAMPLE DATA FOR SUBJECT DETAIL SCREEN
-- Student: 33333333-3333-3333-3333-333333333331 (Priya Sharma)
-- ============================================================================

-- STEP 1: Check which tables exist
SELECT
  '=== CHECKING TABLES ===' as info,
  table_name,
  CASE
    WHEN table_name IN ('gradebook', 'student_progress', 'study_materials') THEN 'NEEDED'
    ELSE 'Not needed'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('gradebook', 'student_progress', 'study_materials')
ORDER BY table_name;

-- STEP 2: Check current student_grades data (which AcademicsDetailScreen uses)
SELECT
  '=== CURRENT STUDENT GRADES ===' as info,
  subject,
  grade,
  total_marks,
  (grade::float / total_marks * 100)::numeric(5,2) as percentage
FROM student_grades
WHERE student_id = '33333333-3333-3333-3333-333333333331'
ORDER BY subject;

-- STEP 3: Create gradebook table if not exists
CREATE TABLE IF NOT EXISTS gradebook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  subject_code TEXT NOT NULL,
  batch_id UUID REFERENCES batches(id),
  exam_type TEXT NOT NULL,
  exam_name TEXT NOT NULL,
  max_marks INTEGER NOT NULL,
  obtained_marks INTEGER NOT NULL,
  percentage NUMERIC(5,2),
  grade TEXT,
  remarks TEXT,
  exam_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 4: Create student_progress table if not exists
CREATE TABLE IF NOT EXISTS student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  subject_code TEXT NOT NULL,
  attendance_percentage NUMERIC(5,2),
  average_score NUMERIC(5,2),
  completed_assignments INTEGER DEFAULT 0,
  total_assignments INTEGER DEFAULT 0,
  strengths TEXT[],
  weaknesses TEXT[],
  recommendations TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, subject_code)
);

-- STEP 5: Create study_materials table if not exists
CREATE TABLE IF NOT EXISTS study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject_code TEXT,
  type TEXT NOT NULL,
  file_size TEXT,
  file_url TEXT,
  author TEXT,
  rating NUMERIC(3,2),
  downloads_count INTEGER DEFAULT 0,
  upload_date TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 6: Insert sample gradebook data for Mathematics
INSERT INTO gradebook (student_id, subject_code, batch_id, exam_type, exam_name, max_marks, obtained_marks, percentage, grade, remarks, exam_date)
SELECT
  '33333333-3333-3333-3333-333333333331'::uuid,
  'Mathematics',
  (SELECT id FROM batches LIMIT 1),
  'quiz',
  'Unit 1 Quiz - Algebra',
  20,
  18,
  90.00,
  'A',
  'Excellent understanding of concepts',
  CURRENT_DATE - INTERVAL '15 days'
WHERE NOT EXISTS (
  SELECT 1 FROM gradebook
  WHERE student_id = '33333333-3333-3333-3333-333333333331'
    AND exam_name = 'Unit 1 Quiz - Algebra'
);

INSERT INTO gradebook (student_id, subject_code, batch_id, exam_type, exam_name, max_marks, obtained_marks, percentage, grade, remarks, exam_date)
SELECT
  '33333333-3333-3333-3333-333333333331'::uuid,
  'Mathematics',
  (SELECT id FROM batches LIMIT 1),
  'test',
  'Mid-Term Test - Geometry',
  100,
  85,
  85.00,
  'A',
  'Strong performance in geometry',
  CURRENT_DATE - INTERVAL '8 days'
WHERE NOT EXISTS (
  SELECT 1 FROM gradebook
  WHERE student_id = '33333333-3333-3333-3333-333333333331'
    AND exam_name = 'Mid-Term Test - Geometry'
);

INSERT INTO gradebook (student_id, subject_code, batch_id, exam_type, exam_name, max_marks, obtained_marks, percentage, grade, remarks, exam_date)
SELECT
  '33333333-3333-3333-3333-333333333331'::uuid,
  'Mathematics',
  (SELECT id FROM batches LIMIT 1),
  'assignment',
  'Homework Assignment 5',
  10,
  9,
  90.00,
  'A',
  'Complete and accurate work',
  CURRENT_DATE - INTERVAL '3 days'
WHERE NOT EXISTS (
  SELECT 1 FROM gradebook
  WHERE student_id = '33333333-3333-3333-3333-333333333331'
    AND exam_name = 'Homework Assignment 5'
);

-- STEP 7: Insert sample gradebook data for Physics
INSERT INTO gradebook (student_id, subject_code, batch_id, exam_type, exam_name, max_marks, obtained_marks, percentage, grade, remarks, exam_date)
SELECT
  '33333333-3333-3333-3333-333333333331'::uuid,
  'Physics',
  (SELECT id FROM batches LIMIT 1),
  'quiz',
  'Laws of Motion Quiz',
  25,
  22,
  88.00,
  'A',
  'Good grasp of Newtons laws',
  CURRENT_DATE - INTERVAL '12 days'
WHERE NOT EXISTS (
  SELECT 1 FROM gradebook
  WHERE student_id = '33333333-3333-3333-3333-333333333331'
    AND exam_name = 'Laws of Motion Quiz'
);

INSERT INTO gradebook (student_id, subject_code, batch_id, exam_type, exam_name, max_marks, obtained_marks, percentage, grade, remarks, exam_date)
SELECT
  '33333333-3333-3333-3333-333333333331'::uuid,
  'Physics',
  (SELECT id FROM batches LIMIT 1),
  'test',
  'Mechanics Test',
  100,
  78,
  78.00,
  'B',
  'Needs improvement in numerical problems',
  CURRENT_DATE - INTERVAL '5 days'
WHERE NOT EXISTS (
  SELECT 1 FROM gradebook
  WHERE student_id = '33333333-3333-3333-3333-333333333331'
    AND exam_name = 'Mechanics Test'
);

-- STEP 8: Insert student_progress data
INSERT INTO student_progress (student_id, subject_code, attendance_percentage, average_score, completed_assignments, total_assignments, strengths, weaknesses, recommendations)
VALUES
  ('33333333-3333-3333-3333-333333333331', 'Mathematics', 95.5, 88.33, 8, 10,
   ARRAY['Algebra', 'Problem solving', 'Logical thinking'],
   ARRAY['Complex word problems', 'Speed'],
   'Focus on practicing timed problem sets to improve speed')
ON CONFLICT (student_id, subject_code) DO UPDATE SET
  attendance_percentage = EXCLUDED.attendance_percentage,
  average_score = EXCLUDED.average_score,
  completed_assignments = EXCLUDED.completed_assignments,
  total_assignments = EXCLUDED.total_assignments,
  strengths = EXCLUDED.strengths,
  weaknesses = EXCLUDED.weaknesses,
  recommendations = EXCLUDED.recommendations,
  last_updated = NOW();

INSERT INTO student_progress (student_id, subject_code, attendance_percentage, average_score, completed_assignments, total_assignments, strengths, weaknesses, recommendations)
VALUES
  ('33333333-3333-3333-3333-333333333331', 'Physics', 92.0, 83.00, 7, 10,
   ARRAY['Theory concepts', 'Diagrams'],
   ARRAY['Numerical problems', 'Formula application'],
   'Practice more numerical problems and formula derivations')
ON CONFLICT (student_id, subject_code) DO UPDATE SET
  attendance_percentage = EXCLUDED.attendance_percentage,
  average_score = EXCLUDED.average_score,
  completed_assignments = EXCLUDED.completed_assignments,
  total_assignments = EXCLUDED.total_assignments,
  strengths = EXCLUDED.strengths,
  weaknesses = EXCLUDED.weaknesses,
  recommendations = EXCLUDED.recommendations,
  last_updated = NOW();

-- STEP 9: Insert study materials
INSERT INTO study_materials (title, subject_code, type, file_size, file_url, author, rating, downloads_count)
VALUES
  ('Algebra Chapter Notes', 'Mathematics', 'pdf', '2.5 MB', 'https://example.com/algebra.pdf', 'Prof. Kumar', 4.5, 245),
  ('Geometry Practice Problems', 'Mathematics', 'practice', '1.8 MB', 'https://example.com/geometry.pdf', 'Prof. Kumar', 4.8, 312),
  ('Laws of Motion Video Lecture', 'Physics', 'video', '45 MB', 'https://example.com/motion.mp4', 'Dr. Singh', 4.7, 189),
  ('Mechanics Formula Sheet', 'Physics', 'pdf', '500 KB', 'https://example.com/mechanics.pdf', 'Dr. Singh', 4.9, 456)
ON CONFLICT DO NOTHING;

-- STEP 10: Verify inserted data
SELECT '=== VERIFICATION: GRADEBOOK ===' as info;
SELECT
  subject_code,
  exam_name,
  exam_type,
  obtained_marks || '/' || max_marks as score,
  percentage || '%' as pct,
  grade,
  exam_date
FROM gradebook
WHERE student_id = '33333333-3333-3333-3333-333333333331'
ORDER BY exam_date DESC;

SELECT '=== VERIFICATION: STUDENT PROGRESS ===' as info;
SELECT
  subject_code,
  attendance_percentage || '%' as attendance,
  average_score as avg_score,
  completed_assignments || '/' || total_assignments as assignments,
  array_length(strengths, 1) as strength_count,
  array_length(weaknesses, 1) as weakness_count
FROM student_progress
WHERE student_id = '33333333-3333-3333-3333-333333333331';

SELECT '=== VERIFICATION: STUDY MATERIALS ===' as info;
SELECT
  subject_code,
  title,
  type,
  rating,
  downloads_count
FROM study_materials
WHERE subject_code IN ('Mathematics', 'Physics')
ORDER BY subject_code, title;

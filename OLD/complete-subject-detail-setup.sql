-- ============================================================================
-- COMPLETE SUBJECT DETAIL SETUP (Copy and paste into Supabase SQL Editor)
-- This single script fixes constraints and inserts all remaining data
-- ============================================================================

-- STEP 1: Skip constraint (already exists)
-- ============================================================================
-- Constraint already added, skipping

-- STEP 2: Fix study_materials RLS policies
-- ============================================================================
DROP POLICY IF EXISTS "Allow authenticated users to insert study materials" ON study_materials;
CREATE POLICY "Allow authenticated users to insert study materials"
  ON study_materials FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to update study materials" ON study_materials;
CREATE POLICY "Allow authenticated users to update study materials"
  ON study_materials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- STEP 3: Insert student_progress data
-- ============================================================================
INSERT INTO student_progress (student_id, batch_id, subject_code, attendance_percentage, average_score, completed_assignments, total_assignments, strengths, weaknesses, recommendations)
SELECT '33333333-3333-3333-3333-333333333331'::uuid, (SELECT id FROM batches LIMIT 1), 'Mathematics', 95.5, 88.33, 8, 10, ARRAY['Algebra', 'Problem solving', 'Logical thinking'], ARRAY['Complex word problems', 'Speed'], 'Focus on practicing timed problem sets to improve speed'
WHERE NOT EXISTS (SELECT 1 FROM student_progress WHERE student_id = '33333333-3333-3333-3333-333333333331' AND subject_code = 'Mathematics');

INSERT INTO student_progress (student_id, batch_id, subject_code, attendance_percentage, average_score, completed_assignments, total_assignments, strengths, weaknesses, recommendations)
SELECT '33333333-3333-3333-3333-333333333331'::uuid, (SELECT id FROM batches LIMIT 1), 'Physics', 92.0, 83.00, 7, 10, ARRAY['Theory concepts', 'Diagrams'], ARRAY['Numerical problems', 'Formula application'], 'Practice more numerical problems and formula derivations'
WHERE NOT EXISTS (SELECT 1 FROM student_progress WHERE student_id = '33333333-3333-3333-3333-333333333331' AND subject_code = 'Physics');

INSERT INTO student_progress (student_id, batch_id, subject_code, attendance_percentage, average_score, completed_assignments, total_assignments, strengths, weaknesses, recommendations)
SELECT '33333333-3333-3333-3333-333333333331'::uuid, (SELECT id FROM batches LIMIT 1), 'English', 88.0, 85.50, 9, 10, ARRAY['Reading comprehension', 'Grammar', 'Creative writing'], ARRAY['Speaking fluency', 'Pronunciation'], 'Practice speaking exercises and participate in group discussions'
WHERE NOT EXISTS (SELECT 1 FROM student_progress WHERE student_id = '33333333-3333-3333-3333-333333333331' AND subject_code = 'English');

-- Insert English gradebook data
INSERT INTO gradebook (student_id, subject_code, batch_id, exam_type, exam_name, max_marks, obtained_marks, percentage, grade, remarks, exam_date)
SELECT '33333333-3333-3333-3333-333333333331'::uuid, 'English', (SELECT id FROM batches LIMIT 1), 'test', 'Grammar Test', 100, 88, 88.00, 'A', 'Excellent grammar skills', CURRENT_DATE - INTERVAL '10 days'
WHERE NOT EXISTS (SELECT 1 FROM gradebook WHERE student_id = '33333333-3333-3333-3333-333333333331' AND exam_name = 'Grammar Test');

INSERT INTO gradebook (student_id, subject_code, batch_id, exam_type, exam_name, max_marks, obtained_marks, percentage, grade, remarks, exam_date)
SELECT '33333333-3333-3333-3333-333333333331'::uuid, 'English', (SELECT id FROM batches LIMIT 1), 'quiz', 'Reading Comprehension Quiz', 50, 43, 86.00, 'A', 'Good reading skills', CURRENT_DATE - INTERVAL '6 days'
WHERE NOT EXISTS (SELECT 1 FROM gradebook WHERE student_id = '33333333-3333-3333-3333-333333333331' AND exam_name = 'Reading Comprehension Quiz');

-- STEP 4: Insert study_materials data
-- ============================================================================
INSERT INTO study_materials (title, subject_code, type, file_size, file_url, author, rating, downloads_count, is_published)
VALUES
  ('Algebra Chapter Notes', 'Mathematics', 'pdf', '2.5 MB', 'https://example.com/algebra.pdf', 'Prof. Kumar', 4.5, 245, true),
  ('Geometry Practice Problems', 'Mathematics', 'pdf', '1.8 MB', 'https://example.com/geometry.pdf', 'Prof. Kumar', 4.8, 312, true),
  ('Laws of Motion Video Lecture', 'Physics', 'video', '45 MB', 'https://example.com/motion.mp4', 'Dr. Singh', 4.7, 189, true),
  ('Mechanics Formula Sheet', 'Physics', 'pdf', '500 KB', 'https://example.com/mechanics.pdf', 'Dr. Singh', 4.9, 456, true),
  ('English Grammar Guide', 'English', 'pdf', '3.2 MB', 'https://example.com/grammar.pdf', 'Prof. Patel', 4.6, 298, true),
  ('Reading Comprehension Exercises', 'English', 'pdf', '2.1 MB', 'https://example.com/reading.pdf', 'Prof. Patel', 4.7, 267, true)
ON CONFLICT DO NOTHING;

-- STEP 5: Verification
-- ============================================================================
SELECT '=== GRADEBOOK RECORDS ===' as section, COUNT(*) as count
FROM gradebook
WHERE student_id = '33333333-3333-3333-3333-333333333331'
UNION ALL
SELECT '=== STUDENT PROGRESS ===' as section, COUNT(*) as count
FROM student_progress
WHERE student_id = '33333333-3333-3333-3333-333333333331'
UNION ALL
SELECT '=== STUDY MATERIALS ===' as section, COUNT(*) as count
FROM study_materials
WHERE subject_code IN ('Mathematics', 'Physics');

-- Detailed view of all data
SELECT '=== GRADEBOOK DETAILS ===' as info;
SELECT
  subject_code,
  exam_name,
  obtained_marks || '/' || max_marks as score,
  percentage || '%' as pct,
  grade,
  TO_CHAR(exam_date, 'YYYY-MM-DD') as date
FROM gradebook
WHERE student_id = '33333333-3333-3333-3333-333333333331'
ORDER BY exam_date DESC;

SELECT '=== STUDENT PROGRESS DETAILS ===' as info;
SELECT
  subject_code,
  attendance_percentage || '%' as attendance,
  ROUND(average_score, 2) || '%' as avg,
  completed_assignments || '/' || total_assignments as assignments,
  array_to_string(strengths, ', ') as strengths,
  array_to_string(weaknesses, ', ') as weaknesses
FROM student_progress
WHERE student_id = '33333333-3333-3333-3333-333333333331';

SELECT '=== STUDY MATERIALS DETAILS ===' as info;
SELECT
  subject_code,
  title,
  type,
  rating || '⭐' as rating,
  downloads_count as downloads
FROM study_materials
WHERE subject_code IN ('Mathematics', 'Physics')
ORDER BY subject_code, title;

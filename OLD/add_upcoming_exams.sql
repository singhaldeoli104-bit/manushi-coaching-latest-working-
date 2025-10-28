-- Add upcoming exams for Ananya (student_id: 33333333-3333-3333-3333-333333333331)

INSERT INTO gradebook (
  student_id,
  subject_code,
  batch_id,
  exam_type,
  exam_name,
  max_marks,
  obtained_marks,
  percentage,
  grade,
  exam_date
) VALUES
-- Quiz in 3 days
('33333333-3333-3333-3333-333333333331', 'MATH', '77777777-7777-7777-7777-777777777777', 'quiz', 'Algebra Quiz 5', 20, 0, NULL, NULL, CURRENT_DATE + INTERVAL '3 days'),
-- Test in 7 days
('33333333-3333-3333-3333-333333333331', 'PHY', '77777777-7777-7777-7777-777777777777', 'test', 'Mechanics Test 3', 50, 0, NULL, NULL, CURRENT_DATE + INTERVAL '7 days'),
-- Midterm in 14 days
('33333333-3333-3333-3333-333333333331', 'CHEM', '77777777-7777-7777-7777-777777777777', 'midterm', 'Chemistry Midterm', 100, 0, NULL, NULL, CURRENT_DATE + INTERVAL '14 days'),
-- Final in 30 days
('33333333-3333-3333-3333-333333333331', 'MATH', '77777777-7777-7777-7777-777777777777', 'final', 'Mathematics Final Exam', 100, 0, NULL, NULL, CURRENT_DATE + INTERVAL '30 days'),
-- Assignment due in 5 days
('33333333-3333-3333-3333-333333333331', 'ENG', '77777777-7777-7777-7777-777777777777', 'assignment', 'Literature Essay', 25, 0, NULL, NULL, CURRENT_DATE + INTERVAL '5 days');

-- Check what subject codes exist in gradebook
SELECT DISTINCT subject_code FROM gradebook WHERE student_id = '33333333-3333-3333-3333-333333333331' ORDER BY subject_code;

-- Check what subjects exist in student_grades
SELECT DISTINCT subject FROM student_grades WHERE student_id = '33333333-3333-3333-3333-333333333331' ORDER BY subject;

-- Check sample gradebook data
SELECT id, student_id, subject_code, exam_name, obtained_marks FROM gradebook WHERE student_id = '33333333-3333-3333-3333-333333333331' LIMIT 5;

-- Check for upcoming exams for Ananya
SELECT 
  g.exam_name,
  g.exam_type,
  g.subject_code,
  g.exam_date,
  CASE 
    WHEN g.exam_date >= CURRENT_DATE THEN 'UPCOMING'
    ELSE 'PAST'
  END as status
FROM gradebook g
WHERE g.student_id = '33333333-3333-3333-3333-333333333331'
ORDER BY g.exam_date DESC
LIMIT 10;

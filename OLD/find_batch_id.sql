-- Find existing batch_id for this student
SELECT DISTINCT batch_id
FROM gradebook
WHERE student_id = '33333333-3333-3333-3333-333333333331'
LIMIT 1;

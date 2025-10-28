# Verify Upcoming Exams Data

## Issue
The INSERT statement was run but UpcomingExamsScreen shows 0 exams.

## Possible Reasons:

1. **INSERT failed due to Supabase connection error**
   - You got "Failed to fetch (api.supabase.com)" error
   - The INSERT might not have been executed successfully

2. **RLS (Row Level Security) policies blocking the data**
   - The gradebook table might have RLS enabled
   - INSERT worked but SELECT can't see the data

3. **Date format mismatch**
   - CURRENT_DATE + INTERVAL might not work as expected
   - Need to verify the exam_date format

## How to Verify:

### Option 1: Check in Supabase Dashboard
Go to Supabase Dashboard → Table Editor → gradebook table

Filter: `student_id = '33333333-3333-3333-3333-333333333331'`

Look for these exams:
- Algebra Quiz 5
- Mechanics Test 3
- Literature Essay
- Chemistry Midterm
- Mathematics Final Exam

### Option 2: Run this SQL in Supabase SQL Editor
```sql
-- Check if data exists
SELECT
  exam_name,
  exam_date,
  exam_type,
  CURRENT_DATE as today,
  (exam_date >= CURRENT_DATE) as is_upcoming
FROM gradebook
WHERE student_id = '33333333-3333-3333-3333-333333333331'
ORDER BY exam_date DESC
LIMIT 10;
```

### Option 3: Check RLS Policies
```sql
-- Check RLS status
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'gradebook';

-- Check RLS policies
SELECT * FROM pg_policies
WHERE tablename = 'gradebook';
```

## If Data Doesn't Exist - Try This Instead:

```sql
-- Use explicit dates instead of INTERVAL
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
-- Use explicit future dates
('33333333-3333-3333-3333-333333333331', 'MATH', '77777777-7777-7777-7777-777777777777', 'quiz', 'Algebra Quiz 5', 20, 0, NULL, NULL, '2025-10-30'),
('33333333-3333-3333-3333-333333333331', 'PHY', '77777777-7777-7777-7777-777777777777', 'test', 'Mechanics Test 3', 50, 0, NULL, NULL, '2025-11-03'),
('33333333-3333-3333-3333-333333333331', 'ENG', '77777777-7777-7777-7777-777777777777', 'assignment', 'Literature Essay', 25, 0, NULL, NULL, '2025-11-01'),
('33333333-3333-3333-3333-333333333331', 'CHEM', '77777777-7777-7777-7777-777777777777', 'midterm', 'Chemistry Midterm', 100, 0, NULL, NULL, '2025-11-10'),
('33333333-3333-3333-3333-333333333331', 'MATH', '77777777-7777-7777-7777-777777777777', 'final', 'Mathematics Final Exam', 100, 0, NULL, NULL, '2025-11-26');
```

**Note:** Replace the dates above with actual future dates relative to today.

## Next Steps:
1. Verify if INSERT succeeded in Supabase
2. If no data, re-run INSERT with explicit dates
3. Check RLS policies if data exists but app can't see it
4. Pull to refresh in the app after confirming data exists

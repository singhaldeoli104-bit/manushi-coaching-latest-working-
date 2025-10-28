-- ============================================================================
-- COMPLETE FIX FOR ASSIGNMENT DETAIL SCREEN ISSUES
-- Run this in Supabase SQL Editor: https://qrwroibhzgywaiecbcoa.supabase.co
-- ============================================================================

-- STEP 1: Check current assignment data
-- ============================================================================
SELECT
  'CURRENT ASSIGNMENTS' as info,
  id,
  title,
  subject,
  status,
  due_date,
  DATE(due_date) as due_date_only,
  CURRENT_DATE as today,
  DATE(due_date) - CURRENT_DATE as days_remaining_calc,
  total_points,
  created_at
FROM assignments
ORDER BY due_date;

-- STEP 2: Check if assignments table has correct column names
-- ============================================================================
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'assignments'
ORDER BY ordinal_position;

-- STEP 3: Check submissions
-- ============================================================================
SELECT
  'CURRENT SUBMISSIONS' as info,
  s.id,
  s.assignment_id,
  s.student_id,
  s.submission_date,
  s.status,
  s.submission_text,
  s.attachments,
  a.title as assignment_title
FROM assignment_submissions s
JOIN assignments a ON a.id = s.assignment_id
ORDER BY s.submission_date DESC;

-- STEP 4: FIX - Set all assignments to 'published' status
-- ============================================================================
UPDATE assignments
SET status = 'published'
WHERE status != 'published'
RETURNING id, title, status;

-- STEP 5: FIX - Update due dates to be in the future for testing
-- ============================================================================
-- Mathematics assignment - due tomorrow
UPDATE assignments
SET due_date = CURRENT_DATE + INTERVAL '1 day'
WHERE subject = 'Mathematics'
  AND title LIKE '%Calculus%'
RETURNING id, title, subject, due_date, DATE(due_date) - CURRENT_DATE as days_remaining;

-- Physics assignment - due in 2 days
UPDATE assignments
SET due_date = CURRENT_DATE + INTERVAL '2 days'
WHERE subject = 'Physics'
  AND title LIKE '%Lab Report%'
RETURNING id, title, subject, due_date, DATE(due_date) - CURRENT_DATE as days_remaining;

-- Chemistry assignment - due in 5 days
UPDATE assignments
SET due_date = CURRENT_DATE + INTERVAL '5 days'
WHERE subject = 'Chemistry'
  AND title LIKE '%Quiz%'
RETURNING id, title, subject, due_date, DATE(due_date) - CURRENT_DATE as days_remaining;

-- STEP 6: DELETE all test submissions (so you can test submission form)
-- ============================================================================
-- WARNING: This deletes ALL submissions! Only run if you want to test fresh

-- First, show what will be deleted
SELECT
  'WILL DELETE THESE' as warning,
  id,
  assignment_id,
  student_id,
  submission_date,
  status
FROM assignment_submissions;

-- Uncomment the line below to actually delete them
-- DELETE FROM assignment_submissions;

-- STEP 7: Verify fixes
-- ============================================================================
SELECT
  'VERIFICATION' as info,
  a.id,
  a.title,
  a.subject,
  a.status as assignment_status,
  a.due_date,
  DATE(a.due_date) - CURRENT_DATE as days_remaining,
  COUNT(s.id) as submissions_count,
  CASE
    WHEN a.status = 'published' AND COUNT(s.id) = 0 THEN '✅ FORM WILL SHOW'
    WHEN a.status != 'published' THEN '❌ NOT PUBLISHED - Form won''t show'
    WHEN COUNT(s.id) > 0 THEN '❌ ALREADY SUBMITTED - Form won''t show'
  END as expected_form_state
FROM assignments a
LEFT JOIN assignment_submissions s ON s.assignment_id = a.id
GROUP BY a.id, a.title, a.subject, a.status, a.due_date
ORDER BY a.due_date;

-- STEP 8: Check table schema matches code expectations
-- ============================================================================
-- The AssignmentDetailScreen expects these columns in 'assignments' table:
--   - id (UUID)
--   - teacher_id (UUID)
--   - class_id (UUID)
--   - subject (TEXT)
--   - title (TEXT)
--   - description (TEXT)
--   - instructions (TEXT)
--   - total_points (INTEGER)
--   - assigned_date (DATE)
--   - due_date (TIMESTAMP)  -- CRITICAL: Must be TIMESTAMP, not DATE
--   - status (TEXT) - must be 'published'
--   - attachments (JSONB[])

-- Verify due_date is TIMESTAMP type
SELECT
  column_name,
  data_type,
  CASE
    WHEN column_name = 'due_date' AND data_type LIKE '%timestamp%' THEN '✅ CORRECT TYPE'
    WHEN column_name = 'due_date' AND data_type LIKE '%date%' THEN '❌ WRONG - Should be TIMESTAMP'
    ELSE 'OK'
  END as validation
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'assignments'
  AND column_name IN ('due_date', 'status', 'total_points');

-- STEP 9: If due_date is wrong type, fix it
-- ============================================================================
-- Only run this if Step 8 shows due_date is DATE instead of TIMESTAMP

-- First backup the data
-- CREATE TABLE assignments_backup AS SELECT * FROM assignments;

-- Then alter the column type (UNCOMMENT if needed)
-- ALTER TABLE assignments
-- ALTER COLUMN due_date TYPE TIMESTAMP USING due_date::timestamp;

-- STEP 10: Create test assignment with correct structure
-- ============================================================================
-- This creates a perfect test assignment

WITH teacher AS (
  SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1
),
class AS (
  SELECT id FROM classes LIMIT 1
)
INSERT INTO assignments (
  teacher_id,
  class_id,
  subject,
  title,
  description,
  instructions,
  total_points,
  assigned_date,
  due_date,
  status,
  attachments
)
SELECT
  t.id,
  c.id,
  'Test Subject' as subject,
  'TEST ASSIGNMENT - Days Remaining Check' as title,
  'This is a test assignment to verify time remaining calculation works correctly' as description,
  'Submit any text or photo to test the submission form. You can delete this submission and retest.' as instructions,
  100 as total_points,
  CURRENT_DATE as assigned_date,
  (CURRENT_DATE + INTERVAL '3 days')::timestamp as due_date,  -- Due in 3 days
  'published' as status,
  NULL as attachments
FROM teacher t, class c
RETURNING
  id,
  title,
  due_date,
  DATE(due_date) - CURRENT_DATE as days_remaining,
  status;

-- ============================================================================
-- FINAL VERIFICATION
-- ============================================================================
SELECT
  '=== FINAL CHECK ===' as section,
  COUNT(*) as total_assignments,
  COUNT(CASE WHEN status = 'published' THEN 1 END) as published_count,
  COUNT(CASE WHEN DATE(due_date) > CURRENT_DATE THEN 1 END) as future_assignments,
  COUNT(CASE WHEN DATE(due_date) = CURRENT_DATE THEN 1 END) as due_today,
  COUNT(CASE WHEN DATE(due_date) < CURRENT_DATE THEN 1 END) as overdue
FROM assignments;

SELECT
  '=== SUBMISSION FORM SHOULD SHOW FOR ===' as section,
  a.title,
  a.subject,
  DATE(a.due_date) - CURRENT_DATE as days_remaining,
  a.status
FROM assignments a
LEFT JOIN assignment_submissions s ON s.assignment_id = a.id
WHERE a.status = 'published'
  AND s.id IS NULL  -- No submission exists
ORDER BY a.due_date;

-- ============================================================================
-- INSTRUCTIONS FOR USER
-- ============================================================================
/*
After running this SQL:

1. Check the output of "FINAL VERIFICATION" section
2. You should see assignments with status = 'published'
3. You should see assignments with days_remaining > 0 (future due dates)
4. Note the assignment IDs that should show the form

THEN IN YOUR APP:
1. Force close the app completely
2. Reopen the app
3. Navigate to an assignment from "SUBMISSION FORM SHOULD SHOW FOR" list
4. You SHOULD see:
   - Correct days remaining (matches days_remaining column)
   - "Submit Assignment" button
   - Form with text input and photo buttons

IF STILL NOT WORKING:
1. Share the output of this SQL with me
2. Share a screenshot of what you see in the app
3. Share the assignment ID you're testing with
*/

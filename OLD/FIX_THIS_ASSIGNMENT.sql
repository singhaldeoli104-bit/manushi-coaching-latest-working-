-- ============================================================================
-- FIX SPECIFIC ASSIGNMENT - Physics Lab Report
-- Assignment ID: 0e698283-dd39-481b-b1d1-4d41b39acde9
-- Student ID: 33333333-3333-3333-3333-333333333331
-- ============================================================================

-- STEP 1: Show EXACTLY what data is currently in database
SELECT
  '=== CURRENT ASSIGNMENT DATA ===' as section,
  a.id,
  a.title,
  a.subject,
  a.due_date,
  a.status,
  a.total_points,
  CURRENT_TIMESTAMP as right_now,
  DATE(a.due_date) as due_date_only,
  CURRENT_DATE as today,
  DATE(a.due_date) - CURRENT_DATE as calculated_days_remaining,
  CASE
    WHEN DATE(a.due_date) > CURRENT_DATE THEN 'FUTURE - Will show days remaining'
    WHEN DATE(a.due_date) = CURRENT_DATE THEN 'TODAY - Will show Due today'
    WHEN DATE(a.due_date) < CURRENT_DATE THEN 'PAST - Overdue'
  END as date_status
FROM assignments a
WHERE a.id = '0e698283-dd39-481b-b1d1-4d41b39acde9';

-- STEP 2: Show submission data
SELECT
  '=== CURRENT SUBMISSION DATA ===' as section,
  s.id,
  s.assignment_id,
  s.student_id,
  s.submission_date,
  s.status,
  s.submission_text,
  s.score,
  DATE(s.submission_date) as submission_date_only
FROM assignment_submissions s
WHERE s.assignment_id = '0e698283-dd39-481b-b1d1-4d41b39acde9'
  AND s.student_id = '33333333-3333-3333-3333-333333333331';

-- STEP 3: FIX - Set correct due date to Oct 20, 2025
UPDATE assignments
SET due_date = '2025-10-20 23:59:59'::timestamp
WHERE id = '0e698283-dd39-481b-b1d1-4d41b39acde9'
RETURNING
  id,
  title,
  due_date,
  DATE(due_date) - CURRENT_DATE as days_from_today,
  'FIXED to Oct 20' as status;

-- STEP 4: FIX - Update submission to show it was submitted on Oct 21 (late)
UPDATE assignment_submissions
SET
  submission_date = '2025-10-21 10:00:00'::timestamp,
  status = 'late'
WHERE assignment_id = '0e698283-dd39-481b-b1d1-4d41b39acde9'
  AND student_id = '33333333-3333-3333-3333-333333333331'
RETURNING
  id,
  submission_date,
  status,
  'FIXED - Submitted Oct 21 (late)' as note;

-- STEP 5: VERIFY the fix is correct
SELECT
  '=== AFTER FIX - THIS IS WHAT APP WILL SEE ===' as section,
  a.title,
  a.due_date as actual_due_date,
  s.submission_date as actual_submission_date,
  s.status as submission_status,
  DATE(a.due_date) - CURRENT_DATE as days_calculation,
  DATE(s.submission_date) - DATE(a.due_date) as days_late,
  CASE
    WHEN s.id IS NOT NULL THEN '✅ Submission exists - Will show "Submitted on" message'
    ELSE '❌ No submission - Will show Submit button'
  END as what_screen_shows,
  CASE
    WHEN DATE(a.due_date) < CURRENT_DATE AND s.id IS NULL THEN 'Will show OVERDUE'
    WHEN DATE(a.due_date) >= CURRENT_DATE AND s.id IS NULL THEN 'Will show days remaining'
    WHEN s.id IS NOT NULL THEN 'Will NOT show days remaining (already submitted)'
  END as days_display
FROM assignments a
LEFT JOIN assignment_submissions s
  ON s.assignment_id = a.id
  AND s.student_id = '33333333-3333-3333-3333-333333333331'
WHERE a.id = '0e698283-dd39-481b-b1d1-4d41b39acde9';

-- ============================================================================
-- IMPORTANT: After running this SQL
-- ============================================================================
/*
1. The app has already been cleared (I ran: adb shell pm clear com.packagecheck.dev)
2. But you need to REOPEN the app from scratch
3. Navigate to Physics Lab Report assignment
4. You should see:
   - "Submitted on: Oct 21, 2025"
   - Badge: "LATE" (orange/red)
   - NO "5 days remaining" section
   - Submission details displayed

IF YOU STILL SEE "5 days remaining":
- It means TanStack Query cache is still active
- Solution: Pull down to refresh on the screen
- Or force close app and reopen again
*/

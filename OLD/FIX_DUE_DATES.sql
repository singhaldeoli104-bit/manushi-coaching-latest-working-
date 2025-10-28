-- ============================================================================
-- FIX ASSIGNMENT DUE DATES - They should be in the PAST, not future
-- Run this in Supabase SQL Editor
-- ============================================================================

-- STEP 1: Show current wrong data
SELECT
  a.id,
  a.title,
  a.due_date as wrong_due_date,
  s.submission_date,
  DATE(a.due_date) - CURRENT_DATE as wrong_days_calculation,
  CASE
    WHEN s.submission_date IS NOT NULL THEN 'Already submitted - should NOT show days remaining'
    ELSE 'Not submitted'
  END as status_check
FROM assignments a
LEFT JOIN assignment_submissions s ON s.assignment_id = a.id
ORDER BY a.title;

-- STEP 2: Fix the due dates to match your description
-- Assignment was DUE on Oct 20, so set it correctly

-- Physics Lab Report - was due Oct 20
UPDATE assignments
SET due_date = '2025-10-20 23:59:59'::timestamp
WHERE title LIKE '%Lab Report%' OR title LIKE '%Physics%'
RETURNING id, title, due_date, 'FIXED - Due Oct 20' as status;

-- Calculus - set to Oct 20
UPDATE assignments
SET due_date = '2025-10-20 23:59:59'::timestamp
WHERE title LIKE '%Calculus%' OR subject = 'Mathematics'
RETURNING id, title, due_date, 'FIXED - Due Oct 20' as status;

-- Chemistry - set to Oct 20
UPDATE assignments
SET due_date = '2025-10-20 23:59:59'::timestamp
WHERE subject = 'Chemistry'
RETURNING id, title, due_date, 'FIXED - Due Oct 20' as status;

-- STEP 3: Update submission status to 'late' since submitted after due date
UPDATE assignment_submissions
SET status = 'late',
    submission_date = '2025-10-21 10:00:00'::timestamp
WHERE submission_date IS NOT NULL
RETURNING id, assignment_id, submission_date, status, 'Status set to LATE' as note;

-- STEP 4: Verify the fix
SELECT
  '=== AFTER FIX ===' as section,
  a.title,
  a.due_date,
  s.submission_date,
  s.status as submission_status,
  DATE(s.submission_date) - DATE(a.due_date) as days_late,
  CASE
    WHEN s.submission_date > a.due_date THEN '✅ Submitted LATE (correct)'
    WHEN s.submission_date <= a.due_date THEN 'Submitted on time'
    WHEN s.submission_date IS NULL THEN 'Not yet submitted'
  END as should_show
FROM assignments a
LEFT JOIN assignment_submissions s ON s.assignment_id = a.id
ORDER BY a.title;

-- ============================================================================
-- EXPECTED RESULT:
-- After running this and reopening the app, you should see:
--
-- For "Physics Lab Report":
-- - "Submitted on: Oct 21" (or similar)
-- - Status badge: "LATE" (orange/red)
-- - NO "days remaining" shown (because already submitted)
-- - Submission details displayed
-- ============================================================================

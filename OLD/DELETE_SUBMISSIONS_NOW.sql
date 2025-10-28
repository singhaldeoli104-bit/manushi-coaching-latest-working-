-- ============================================================================
-- DELETE ALL SUBMISSIONS - Run this in Supabase SQL Editor
-- This will allow you to see the submission form
-- ============================================================================

-- STEP 1: Show what submissions currently exist
SELECT
  s.id,
  a.title as assignment_title,
  s.student_id,
  s.submission_date,
  s.status,
  s.submission_text
FROM assignment_submissions s
JOIN assignments a ON a.id = s.assignment_id
ORDER BY s.submission_date DESC;

-- STEP 2: DELETE ALL SUBMISSIONS (uncomment to run)
DELETE FROM assignment_submissions;

-- STEP 3: Verify they're deleted
SELECT COUNT(*) as remaining_submissions FROM assignment_submissions;
-- Should show 0

-- ============================================================================
-- After running this:
-- 1. Close the app completely (swipe away from recent apps)
-- 2. Reopen the app
-- 3. Go to Physics Lab Report assignment
-- 4. You SHOULD NOW SEE: "📤 Submit Assignment" button
-- ============================================================================

-- Run these queries in Supabase SQL Editor to debug AssignmentDetailScreen issues

-- ============================================================================
-- STEP 1: Check Assignment Exists and Status
-- ============================================================================
-- Copy the assignment ID from the error message or app logs
-- Replace 'YOUR_ASSIGNMENT_ID' with actual ID

SELECT
  id,
  title,
  subject,
  status,  -- MUST be 'published' for form to show
  due_date,
  total_points,
  teacher_id,
  DATE(due_date) - CURRENT_DATE as days_remaining,
  CASE
    WHEN DATE(due_date) > CURRENT_DATE THEN '✅ Future due date'
    WHEN DATE(due_date) = CURRENT_DATE THEN '⚠️ Due today'
    WHEN DATE(due_date) < CURRENT_DATE THEN '🔴 Overdue'
  END as due_status
FROM assignments
WHERE id = 'YOUR_ASSIGNMENT_ID';

-- Expected Result:
-- - status should be 'published' (NOT 'draft' or 'archived')
-- - days_remaining should match what you expect
-- - If status is 'draft', update it:
--   UPDATE assignments SET status = 'published' WHERE id = 'YOUR_ASSIGNMENT_ID';


-- ============================================================================
-- STEP 2: Check If Submission Already Exists
-- ============================================================================
-- Replace 'YOUR_ASSIGNMENT_ID' and 'YOUR_STUDENT_ID'

SELECT
  id,
  assignment_id,
  student_id,
  submission_date,
  status,
  submission_text,
  attachments,
  score,
  feedback,
  CASE
    WHEN id IS NOT NULL THEN '🔴 SUBMISSION EXISTS - Form will NOT show'
    ELSE '✅ NO SUBMISSION - Form WILL show'
  END as form_visibility
FROM assignment_submissions
WHERE assignment_id = 'YOUR_ASSIGNMENT_ID'
  AND student_id = 'YOUR_STUDENT_ID';

-- Expected Result:
-- - NO ROWS = Form will show (good for testing)
-- - HAS ROWS = Form won't show (submission already exists)
-- - If you want to test submission again, delete the existing one:
--   DELETE FROM assignment_submissions
--   WHERE assignment_id = 'YOUR_ASSIGNMENT_ID' AND student_id = 'YOUR_STUDENT_ID';


-- ============================================================================
-- STEP 3: View All Assignments with Submission Status
-- ============================================================================

SELECT
  a.id as assignment_id,
  a.title,
  a.subject,
  a.status as assignment_status,
  a.due_date,
  DATE(a.due_date) - CURRENT_DATE as days_remaining,
  COUNT(s.id) as submission_count,
  CASE
    WHEN a.status = 'published' AND COUNT(s.id) = 0 THEN '✅ Form WILL show'
    WHEN a.status != 'published' THEN '🔴 Not published - Form WON\'T show'
    WHEN COUNT(s.id) > 0 THEN '🔴 Already submitted - Form WON\'T show'
  END as expected_form_state
FROM assignments a
LEFT JOIN assignment_submissions s
  ON s.assignment_id = a.id
  AND s.student_id = 'YOUR_STUDENT_ID'
GROUP BY a.id, a.title, a.subject, a.status, a.due_date
ORDER BY a.due_date ASC;


-- ============================================================================
-- STEP 4: Create Test Assignment (If Needed)
-- ============================================================================

-- Get your teacher and student IDs first
SELECT id, role, full_name FROM profiles WHERE role IN ('teacher', 'student');

-- Create a test assignment
INSERT INTO assignments (
  teacher_id,
  class_id,
  subject,
  title,
  description,
  instructions,
  total_points,
  due_date,
  status
)
SELECT
  (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1),
  (SELECT id FROM classes LIMIT 1),
  'Test Subject',
  'Test Assignment - Time Calculation Check',
  'This is a test assignment to verify time remaining calculation',
  'Submit any work to test the submission form',
  100,
  CURRENT_DATE + INTERVAL '3 days',  -- Due in 3 days
  'published'  -- MUST be published
RETURNING id, title, due_date, status;


-- ============================================================================
-- STEP 5: Fix Common Issues
-- ============================================================================

-- Fix 1: Set all assignments to 'published' status
UPDATE assignments
SET status = 'published'
WHERE status != 'published'
RETURNING id, title, status;

-- Fix 2: Delete test submissions (to allow re-testing)
-- WARNING: Only delete if you're sure these are test submissions!
DELETE FROM assignment_submissions
WHERE submission_text LIKE '%test%'
  OR submission_text LIKE '%Test%'
RETURNING id, assignment_id, student_id;


-- ============================================================================
-- STEP 6: Verify Supabase Storage Bucket Exists
-- ============================================================================

-- Check if 'assignments' bucket exists
-- (Run this in Supabase Dashboard > Storage > Buckets)
-- If it doesn't exist, create it:
-- 1. Go to Storage tab
-- 2. Click "New Bucket"
-- 3. Name: "assignments"
-- 4. Public: YES (for download links)
-- 5. File size limit: 50MB
-- 6. Allowed MIME types: image/*, application/pdf


-- ============================================================================
-- SUCCESS CHECKLIST
-- ============================================================================
-- After running these queries, verify:
-- [ ] Assignment status = 'published'
-- [ ] No submission exists for test student
-- [ ] days_remaining calculation looks correct
-- [ ] 'assignments' storage bucket exists
-- [ ] App has been RELOADED on device
-- [ ] Metro bundler shows no errors

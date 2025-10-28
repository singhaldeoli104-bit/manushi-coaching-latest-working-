-- ============================================================================
-- FIX SUBJECT DETAIL TABLES
-- Run this in Supabase SQL Editor to fix the remaining issues
-- ============================================================================

-- Fix 1: Add unique constraint to student_progress table
-- This allows UPSERT to work properly
ALTER TABLE student_progress
  ADD CONSTRAINT student_progress_student_subject_unique
  UNIQUE (student_id, subject_code);

-- Fix 2: Add INSERT policy for study_materials
-- Currently only has SELECT policy, needs INSERT for data population
CREATE POLICY "Allow authenticated users to insert study materials"
  ON study_materials FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Optional: Add UPDATE policy for study_materials (for future edits)
CREATE POLICY "Allow authenticated users to update study materials"
  ON study_materials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Verify policies
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('gradebook', 'student_progress', 'study_materials')
ORDER BY tablename, cmd;

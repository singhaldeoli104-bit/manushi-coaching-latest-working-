-- Debug: Check if data exists in study_materials table
-- Run this in Supabase SQL Editor to verify data was inserted

-- Check if table exists and has data
SELECT COUNT(*) as total_materials FROM study_materials;

-- Check RLS policies on study_materials
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'study_materials';

-- View all study materials
SELECT id, title, subject_code, type, is_published, created_at
FROM study_materials
ORDER BY created_at DESC;

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'study_materials';

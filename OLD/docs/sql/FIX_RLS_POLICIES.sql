-- Fix RLS Policies for All Tables
-- This allows your app to access the data securely

-- Re-enable RLS
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow anonymous read access to study materials" ON study_materials;
DROP POLICY IF EXISTS "Allow authenticated read access to study materials" ON study_materials;

-- Create proper policies for anonymous (your app's anon key) access
CREATE POLICY "anon_read_published_materials"
ON study_materials
FOR SELECT
TO anon
USING (is_published = true);

-- Allow authenticated users full read access
CREATE POLICY "authenticated_read_all_materials"
ON study_materials
FOR SELECT
TO authenticated
USING (true);

-- Verify the policy was created
SELECT tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'study_materials';

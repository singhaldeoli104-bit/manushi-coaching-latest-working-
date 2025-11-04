# Fix Study Materials RLS Policy

The error "cannot find table 'public.study_materials'" means the anon key doesn't have permission to access the table.

## Run this SQL in Supabase Dashboard:

1. Go to: https://supabase.com/dashboard/project/qrwroibhzgywaiecbcoa/sql/new
2. Paste and execute this SQL:

```sql
-- Drop existing policies on study_materials
DROP POLICY IF EXISTS "Enable read access for all users" ON study_materials;
DROP POLICY IF EXISTS "Public read access" ON study_materials;
DROP POLICY IF EXISTS "Allow public read" ON study_materials;

-- Create simple public read policy
CREATE POLICY "Allow anonymous read access to study materials"
ON study_materials FOR SELECT
TO anon
USING (is_published = true);

-- Also allow authenticated users
CREATE POLICY "Allow authenticated read access to study materials"
ON study_materials FOR SELECT
TO authenticated
USING (true);

-- Verify RLS is enabled
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
```

3. After running, test the app again!

## Alternative: Disable RLS (NOT RECOMMENDED for production)

If you just want to test quickly:

```sql
ALTER TABLE study_materials DISABLE ROW LEVEL SECURITY;
```

But **re-enable it later** for security!

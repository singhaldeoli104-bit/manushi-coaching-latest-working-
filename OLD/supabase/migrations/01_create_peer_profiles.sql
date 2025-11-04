-- =============================================================================
-- Migration: Create Peer Profiles Table
-- Description: Student peer learning profiles with subjects, strengths, and study preferences
-- Dependencies: Requires auth.users table (Supabase Auth)
-- =============================================================================

-- Create peer_profiles table
CREATE TABLE IF NOT EXISTS peer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT,
  grade TEXT NOT NULL,
  subjects TEXT[] NOT NULL DEFAULT '{}',
  strengths TEXT[] NOT NULL DEFAULT '{}',
  study_preferences TEXT[] NOT NULL DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  total_sessions INTEGER DEFAULT 0 CHECK (total_sessions >= 0),
  is_online BOOLEAN DEFAULT false,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location TEXT,
  languages TEXT[] NOT NULL DEFAULT '{}',
  achievements TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one profile per student
  CONSTRAINT unique_student_profile UNIQUE (student_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_peer_profiles_student_id ON peer_profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_peer_profiles_is_online ON peer_profiles(is_online);
CREATE INDEX IF NOT EXISTS idx_peer_profiles_grade ON peer_profiles(grade);
CREATE INDEX IF NOT EXISTS idx_peer_profiles_rating ON peer_profiles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_peer_profiles_subjects ON peer_profiles USING GIN (subjects);

-- Enable Row Level Security
ALTER TABLE peer_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: All authenticated users can view all peer profiles
CREATE POLICY "Users can view all peer profiles"
  ON peer_profiles FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policy: Users can insert their own peer profile only
CREATE POLICY "Users can insert their own peer profile"
  ON peer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

-- RLS Policy: Users can update their own peer profile only
CREATE POLICY "Users can update their own peer profile"
  ON peer_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- RLS Policy: Users can delete their own peer profile only
CREATE POLICY "Users can delete their own peer profile"
  ON peer_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = student_id);

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_peer_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER peer_profiles_updated_at
  BEFORE UPDATE ON peer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_peer_profiles_updated_at();

-- Function to update is_online status based on last_active
CREATE OR REPLACE FUNCTION update_peer_online_status()
RETURNS void AS $$
BEGIN
  UPDATE peer_profiles
  SET is_online = false
  WHERE is_online = true
  AND last_active < NOW() - INTERVAL '15 minutes';
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- Sample Data (Optional - for testing)
-- =============================================================================

-- Insert sample peer profiles (uncomment to use)
/*
INSERT INTO peer_profiles (student_id, name, avatar, grade, subjects, strengths, study_preferences, rating, total_sessions, is_online, location, languages, achievements)
VALUES
  -- Note: Replace student_id with actual user UUIDs from your auth.users table
  ('00000000-0000-0000-0000-000000000001', 'अनिका शर्मा', '👩‍🎓', '12th',
   ARRAY['Physics', 'Chemistry', 'Mathematics'],
   ARRAY['Problem Solving', 'Conceptual Clarity', 'Quick Learning'],
   ARRAY['Group Study', 'Interactive Sessions', 'Visual Learning'],
   4.8, 127, true, 'Mumbai', ARRAY['Hindi', 'English', 'Marathi'],
   ARRAY['Top Tutor', 'Study Streak Champion', 'Collaboration Expert']),

  ('00000000-0000-0000-0000-000000000002', 'राहुल वर्मा', '👨‍💻', '11th',
   ARRAY['Computer Science', 'Mathematics', 'English'],
   ARRAY['Programming', 'Logical Thinking', 'Code Review'],
   ARRAY['Coding Sessions', 'Project-based Learning', 'Peer Programming'],
   4.6, 89, false, 'Delhi', ARRAY['Hindi', 'English'],
   ARRAY['Code Master', 'Helpful Peer', 'Problem Solver']),

  ('00000000-0000-0000-0000-000000000003', 'प्रिया गुप्ता', '👩‍🔬', '12th',
   ARRAY['Biology', 'Chemistry', 'Physics'],
   ARRAY['Lab Techniques', 'Scientific Method', 'Research Skills'],
   ARRAY['Hands-on Learning', 'Experiments', 'Discussion Forums'],
   4.9, 156, true, 'Bangalore', ARRAY['Hindi', 'English', 'Kannada'],
   ARRAY['Science Champion', 'Research Expert', 'Top Collaborator']);
*/

-- =============================================================================
-- Verification Queries
-- =============================================================================

-- Check table structure
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'peer_profiles'
-- ORDER BY ordinal_position;

-- Check RLS policies
-- SELECT policyname, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename = 'peer_profiles';

-- Count peer profiles
-- SELECT COUNT(*) as total_profiles,
--        COUNT(CASE WHEN is_online THEN 1 END) as online_profiles
-- FROM peer_profiles;

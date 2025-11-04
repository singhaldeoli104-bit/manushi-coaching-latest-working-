-- =============================================================================
-- Migration: Create Study Groups Table
-- Description: Study groups for peer learning with sessions and discussions
-- Dependencies: Requires auth.users table and peer_profiles table
-- =============================================================================

-- Create study_groups table
CREATE TABLE IF NOT EXISTS study_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 0 CHECK (member_count >= 0),
  max_members INTEGER NOT NULL DEFAULT 30 CHECK (max_members > 0),
  next_session TIMESTAMP WITH TIME ZONE,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[] NOT NULL DEFAULT '{}',
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_name TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  join_requests INTEGER DEFAULT 0 CHECK (join_requests >= 0),
  active_discussions INTEGER DEFAULT 0 CHECK (active_discussions >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure max_members is greater than member_count
  CONSTRAINT check_member_capacity CHECK (member_count <= max_members)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_study_groups_subject ON study_groups(subject);
CREATE INDEX IF NOT EXISTS idx_study_groups_difficulty ON study_groups(difficulty);
CREATE INDEX IF NOT EXISTS idx_study_groups_creator_id ON study_groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_study_groups_is_private ON study_groups(is_private);
CREATE INDEX IF NOT EXISTS idx_study_groups_next_session ON study_groups(next_session);
CREATE INDEX IF NOT EXISTS idx_study_groups_tags ON study_groups USING GIN (tags);

-- Create table for group memberships
CREATE TABLE IF NOT EXISTS study_group_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  is_active BOOLEAN DEFAULT true,

  -- One membership per student per group
  CONSTRAINT unique_group_membership UNIQUE (group_id, student_id)
);

-- Create indexes for group memberships
CREATE INDEX IF NOT EXISTS idx_group_memberships_group_id ON study_group_memberships(group_id);
CREATE INDEX IF NOT EXISTS idx_group_memberships_student_id ON study_group_memberships(student_id);
CREATE INDEX IF NOT EXISTS idx_group_memberships_active ON study_group_memberships(is_active);

-- Create table for group sessions
CREATE TABLE IF NOT EXISTS study_group_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  attendee_count INTEGER DEFAULT 0 CHECK (attendee_count >= 0),
  meeting_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for group sessions
CREATE INDEX IF NOT EXISTS idx_group_sessions_group_id ON study_group_sessions(group_id);
CREATE INDEX IF NOT EXISTS idx_group_sessions_scheduled_at ON study_group_sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_group_sessions_status ON study_group_sessions(status);

-- Enable Row Level Security
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_groups
CREATE POLICY "Anyone can view public study groups"
  ON study_groups FOR SELECT
  TO authenticated
  USING (is_private = false OR creator_id = auth.uid() OR
         EXISTS (
           SELECT 1 FROM study_group_memberships
           WHERE group_id = id AND student_id = auth.uid()
         ));

CREATE POLICY "Authenticated users can create study groups"
  ON study_groups FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Group creators can update their groups"
  ON study_groups FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Group creators can delete their groups"
  ON study_groups FOR DELETE
  TO authenticated
  USING (creator_id = auth.uid());

-- RLS Policies for study_group_memberships
CREATE POLICY "Users can view group memberships"
  ON study_group_memberships FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join study groups"
  ON study_group_memberships FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can update their own memberships"
  ON study_group_memberships FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can leave study groups"
  ON study_group_memberships FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- RLS Policies for study_group_sessions
CREATE POLICY "Users can view sessions of their groups"
  ON study_group_sessions FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM study_group_memberships
    WHERE group_id = study_group_sessions.group_id
    AND student_id = auth.uid()
  ));

CREATE POLICY "Group creators can manage sessions"
  ON study_group_sessions FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM study_groups
    WHERE id = study_group_sessions.group_id
    AND creator_id = auth.uid()
  ));

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_study_groups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER study_groups_updated_at
  BEFORE UPDATE ON study_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_study_groups_updated_at();

CREATE TRIGGER study_group_sessions_updated_at
  BEFORE UPDATE ON study_group_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_study_groups_updated_at();

-- Function to update member count when membership changes
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE study_groups
    SET member_count = member_count + 1
    WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE study_groups
    SET member_count = GREATEST(0, member_count - 1)
    WHERE id = OLD.group_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.is_active != OLD.is_active THEN
    UPDATE study_groups
    SET member_count = member_count + CASE WHEN NEW.is_active THEN 1 ELSE -1 END
    WHERE id = NEW.group_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER group_membership_changes
  AFTER INSERT OR DELETE OR UPDATE OF is_active ON study_group_memberships
  FOR EACH ROW
  EXECUTE FUNCTION update_group_member_count();

-- =============================================================================
-- Sample Data (Optional - for testing)
-- =============================================================================

-- Insert sample study groups (uncomment to use)
/*
INSERT INTO study_groups (name, subject, description, member_count, max_members, next_session, difficulty, tags, creator_id, creator_name, is_private, join_requests, active_discussions)
VALUES
  ('JEE Physics Mastery', 'Physics',
   'Advanced physics problem solving for JEE preparation with peer discussions and doubt clearing',
   24, 30, NOW() + INTERVAL '1 day', 'advanced',
   ARRAY['JEE', 'Problem Solving', 'Conceptual', 'Mechanics'],
   '00000000-0000-0000-0000-000000000001', 'Dr. Physics Master', false, 12, 8),

  ('Chemistry Lab Partners', 'Chemistry',
   'Virtual lab experiments, reaction mechanisms, and organic chemistry discussions',
   18, 25, NOW() + INTERVAL '2 days', 'intermediate',
   ARRAY['Lab Work', 'Organic Chemistry', 'Mechanisms', 'Practice'],
   '00000000-0000-0000-0000-000000000002', 'Chem Guru', false, 7, 5),

  ('NEET Biology Discussion', 'Biology',
   'Comprehensive NEET biology preparation with daily quizzes and concept clarification',
   32, 40, NOW() + INTERVAL '3 days', 'intermediate',
   ARRAY['NEET', 'Biology', 'Quizzes', 'Conceptual'],
   '00000000-0000-0000-0000-000000000003', 'Bio Expert', false, 15, 12);
*/

-- =============================================================================
-- Verification Queries
-- =============================================================================

-- Check table structure
-- SELECT table_name, column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name IN ('study_groups', 'study_group_memberships', 'study_group_sessions')
-- ORDER BY table_name, ordinal_position;

-- Check RLS policies
-- SELECT tablename, policyname, roles, cmd
-- FROM pg_policies
-- WHERE tablename IN ('study_groups', 'study_group_memberships', 'study_group_sessions');

-- Count study groups by difficulty
-- SELECT difficulty, COUNT(*) as group_count
-- FROM study_groups
-- GROUP BY difficulty;

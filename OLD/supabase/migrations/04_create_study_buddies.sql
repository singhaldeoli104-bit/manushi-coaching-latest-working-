-- =============================================================================
-- Migration: Create Study Buddies Table
-- Description: AI-powered study buddy matching with compatibility scores and preferences
-- Dependencies: Requires auth.users table and peer_profiles table
-- =============================================================================

-- Create study_buddies table (buddy matches and compatibility)
CREATE TABLE IF NOT EXISTS study_buddies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student1_name TEXT NOT NULL,
  student2_name TEXT NOT NULL,
  student1_avatar TEXT,
  student2_avatar TEXT,
  compatibility_score INTEGER NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  shared_subjects TEXT[] NOT NULL DEFAULT '{}',
  match_reason TEXT, -- AI-generated reason for the match
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'active', 'inactive')),
  session_count INTEGER DEFAULT 0 CHECK (session_count >= 0),
  last_interaction TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure student1_id and student2_id are different
  CONSTRAINT different_students CHECK (student1_id != student2_id),
  -- Ensure unique pairing (prevent duplicate matches)
  CONSTRAINT unique_buddy_pair UNIQUE (student1_id, student2_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_buddies_student1_id ON study_buddies(student1_id);
CREATE INDEX IF NOT EXISTS idx_buddies_student2_id ON study_buddies(student2_id);
CREATE INDEX IF NOT EXISTS idx_buddies_compatibility ON study_buddies(compatibility_score DESC);
CREATE INDEX IF NOT EXISTS idx_buddies_status ON study_buddies(status);
CREATE INDEX IF NOT EXISTS idx_buddies_shared_subjects ON study_buddies USING GIN (shared_subjects);

-- Create table for buddy study sessions
CREATE TABLE IF NOT EXISTS buddy_study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buddy_match_id UUID NOT NULL REFERENCES study_buddies(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
  subject TEXT NOT NULL,
  topics TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
  student1_attended BOOLEAN DEFAULT false,
  student2_attended BOOLEAN DEFAULT false,
  meeting_link TEXT,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for buddy sessions
CREATE INDEX IF NOT EXISTS idx_buddy_sessions_match_id ON buddy_study_sessions(buddy_match_id);
CREATE INDEX IF NOT EXISTS idx_buddy_sessions_scheduled_at ON buddy_study_sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_buddy_sessions_status ON buddy_study_sessions(status);

-- Create table for buddy preferences (for matching algorithm)
CREATE TABLE IF NOT EXISTS buddy_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  study_hours TEXT, -- e.g., "6:00 PM - 10:00 PM"
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  study_style TEXT CHECK (study_style IN ('visual', 'auditory', 'kinesthetic', 'reading-writing', 'mixed')),
  preferred_session_length INTEGER DEFAULT 60 CHECK (preferred_session_length > 0), -- in minutes
  goals TEXT[] DEFAULT '{}',
  looking_for TEXT[] DEFAULT '{}', -- What they're looking for in a buddy
  availability_days TEXT[] DEFAULT '{}', -- e.g., ['Monday', 'Wednesday', 'Friday']
  communication_frequency TEXT DEFAULT 'moderate' CHECK (communication_frequency IN ('low', 'moderate', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- One preference profile per student
  CONSTRAINT unique_student_preferences UNIQUE (student_id)
);

-- Create indexes for preferences
CREATE INDEX IF NOT EXISTS idx_buddy_prefs_student_id ON buddy_preferences(student_id);
CREATE INDEX IF NOT EXISTS idx_buddy_prefs_study_style ON buddy_preferences(study_style);
CREATE INDEX IF NOT EXISTS idx_buddy_prefs_timezone ON buddy_preferences(timezone);

-- Create table for buddy interactions (messages, comments, feedback)
CREATE TABLE IF NOT EXISTS buddy_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buddy_match_id UUID NOT NULL REFERENCES study_buddies(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  interaction_type TEXT NOT NULL DEFAULT 'message' CHECK (interaction_type IN ('message', 'feedback', 'resource', 'encouragement')),
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for interactions
CREATE INDEX IF NOT EXISTS idx_interactions_match_id ON buddy_interactions(buddy_match_id);
CREATE INDEX IF NOT EXISTS idx_interactions_sender_id ON buddy_interactions(sender_id);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON buddy_interactions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE study_buddies ENABLE ROW LEVEL SECURITY;
ALTER TABLE buddy_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE buddy_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE buddy_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_buddies
CREATE POLICY "Users can view their own buddy matches"
  ON study_buddies FOR SELECT
  TO authenticated
  USING (student1_id = auth.uid() OR student2_id = auth.uid());

CREATE POLICY "System can create buddy matches"
  ON study_buddies FOR INSERT
  TO authenticated
  WITH CHECK (student1_id = auth.uid() OR student2_id = auth.uid());

CREATE POLICY "Users can update their buddy match status"
  ON study_buddies FOR UPDATE
  TO authenticated
  USING (student1_id = auth.uid() OR student2_id = auth.uid())
  WITH CHECK (student1_id = auth.uid() OR student2_id = auth.uid());

-- RLS Policies for buddy_study_sessions
CREATE POLICY "Buddies can view their sessions"
  ON buddy_study_sessions FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM study_buddies
    WHERE id = buddy_study_sessions.buddy_match_id
    AND (student1_id = auth.uid() OR student2_id = auth.uid())
  ));

CREATE POLICY "Buddies can create sessions"
  ON buddy_study_sessions FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM study_buddies
    WHERE id = buddy_study_sessions.buddy_match_id
    AND (student1_id = auth.uid() OR student2_id = auth.uid())
  ));

CREATE POLICY "Buddies can update their sessions"
  ON buddy_study_sessions FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM study_buddies
    WHERE id = buddy_study_sessions.buddy_match_id
    AND (student1_id = auth.uid() OR student2_id = auth.uid())
  ));

-- RLS Policies for buddy_preferences
CREATE POLICY "Users can view their own preferences"
  ON buddy_preferences FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Users can insert their own preferences"
  ON buddy_preferences FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can update their own preferences"
  ON buddy_preferences FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- RLS Policies for buddy_interactions
CREATE POLICY "Buddies can view their interactions"
  ON buddy_interactions FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM study_buddies
    WHERE id = buddy_interactions.buddy_match_id
    AND (student1_id = auth.uid() OR student2_id = auth.uid())
  ));

CREATE POLICY "Buddies can post interactions"
  ON buddy_interactions FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid() AND EXISTS (
    SELECT 1 FROM study_buddies
    WHERE id = buddy_interactions.buddy_match_id
    AND (student1_id = auth.uid() OR student2_id = auth.uid())
  ));

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_buddies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER buddies_updated_at
  BEFORE UPDATE ON study_buddies
  FOR EACH ROW
  EXECUTE FUNCTION update_buddies_updated_at();

CREATE TRIGGER buddy_sessions_updated_at
  BEFORE UPDATE ON buddy_study_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_buddies_updated_at();

CREATE TRIGGER buddy_prefs_updated_at
  BEFORE UPDATE ON buddy_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_buddies_updated_at();

-- Function to update session count when buddy sessions are completed
CREATE OR REPLACE FUNCTION update_buddy_session_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE study_buddies
    SET
      session_count = session_count + 1,
      last_interaction = NOW()
    WHERE id = NEW.buddy_match_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER buddy_session_completed
  AFTER UPDATE OF status ON buddy_study_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_buddy_session_count();

-- Function to update last_interaction on new messages
CREATE OR REPLACE FUNCTION update_buddy_last_interaction()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE study_buddies
  SET last_interaction = NOW()
  WHERE id = NEW.buddy_match_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER buddy_interaction_posted
  AFTER INSERT ON buddy_interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_buddy_last_interaction();

-- =============================================================================
-- Sample Data (Optional - for testing)
-- =============================================================================

-- Insert sample study buddy matches (uncomment to use)
/*
INSERT INTO study_buddies (student1_id, student2_id, student1_name, student2_name, student1_avatar, student2_avatar, compatibility_score, shared_subjects, match_reason, status, session_count, last_interaction)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002',
   'प्रिया पटेल', 'अर्जुन सिंह', '👩‍📚', '👨‍🔬',
   92, ARRAY['Mathematics', 'Physics'],
   'Both prefer evening study sessions and have complementary strengths in problem-solving',
   'active', 45, NOW() - INTERVAL '1 day'),

  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003',
   'अर्जुन सिंह', 'नेहा कुमार', '👨‍🔬', '👩‍💼',
   87, ARRAY['Chemistry', 'Biology'],
   'Similar study schedules and both excel in lab-based learning',
   'active', 32, NOW() - INTERVAL '2 hours'),

  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003',
   'प्रिया पटेल', 'नेहा कुमार', '👩‍📚', '👩‍💼',
   95, ARRAY['Mathematics', 'Computer Science'],
   'Excellent compatibility with shared interest in computational thinking',
   'active', 67, NOW());

-- Insert sample buddy preferences
INSERT INTO buddy_preferences (student_id, study_hours, timezone, study_style, preferred_session_length, goals, looking_for, availability_days, communication_frequency)
VALUES
  ('00000000-0000-0000-0000-000000000001',
   '6:00 PM - 10:00 PM', 'Asia/Kolkata', 'visual', 90,
   ARRAY['JEE Preparation', 'Competitive Programming'],
   ARRAY['Problem-solving partner', 'Regular study schedule'],
   ARRAY['Monday', 'Wednesday', 'Friday', 'Sunday'],
   'high'),

  ('00000000-0000-0000-0000-000000000002',
   '7:00 AM - 9:00 AM, 8:00 PM - 10:00 PM', 'Asia/Kolkata', 'mixed', 60,
   ARRAY['NEET Preparation', 'Lab Skills'],
   ARRAY['Conceptual discussions', 'Quiz practice'],
   ARRAY['Tuesday', 'Thursday', 'Saturday'],
   'moderate'),

  ('00000000-0000-0000-0000-000000000003',
   '5:00 PM - 9:00 PM', 'Asia/Kolkata', 'auditory', 75,
   ARRAY['Board Exams', 'Olympiad Prep'],
   ARRAY['Collaborative learning', 'Peer teaching'],
   ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
   'high');
*/

-- =============================================================================
-- Verification Queries
-- =============================================================================

-- Check table structure
-- SELECT table_name, column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name IN ('study_buddies', 'buddy_study_sessions', 'buddy_preferences', 'buddy_interactions')
-- ORDER BY table_name, ordinal_position;

-- View active buddy matches with compatibility
-- SELECT student1_name, student2_name, compatibility_score, shared_subjects, session_count
-- FROM study_buddies
-- WHERE status = 'active'
-- ORDER BY compatibility_score DESC;

-- View buddy preferences summary
-- SELECT COUNT(*) as total_students,
--        study_style,
--        COUNT(*) as count
-- FROM buddy_preferences
-- GROUP BY study_style;

-- =============================================================================
-- Migration: Create Peer Connections Table
-- Description: Social connections between students for peer learning network
-- Dependencies: Requires auth.users table and peer_profiles table
-- =============================================================================

-- Create peer_connections table (friend/follower connections)
CREATE TABLE IF NOT EXISTS peer_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  connection_type TEXT NOT NULL DEFAULT 'friend' CHECK (connection_type IN ('friend', 'follow', 'mentor', 'mentee')),
  message TEXT, -- Optional connection request message
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure requester and addressee are different
  CONSTRAINT different_users CHECK (requester_id != addressee_id),
  -- Ensure unique connection (prevent duplicate requests)
  CONSTRAINT unique_connection UNIQUE (requester_id, addressee_id, connection_type)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_connections_requester_id ON peer_connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_addressee_id ON peer_connections(addressee_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON peer_connections(status);
CREATE INDEX IF NOT EXISTS idx_connections_type ON peer_connections(connection_type);
CREATE INDEX IF NOT EXISTS idx_connections_created_at ON peer_connections(created_at DESC);

-- Create table for connection mutual friends (computed for faster queries)
CREATE TABLE IF NOT EXISTS connection_mutual_friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mutual_count INTEGER DEFAULT 0 CHECK (mutual_count >= 0),
  mutual_friend_ids UUID[] DEFAULT '{}',
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure unique pairing
  CONSTRAINT unique_mutual_pair UNIQUE (user1_id, user2_id)
);

-- Create indexes for mutual friends
CREATE INDEX IF NOT EXISTS idx_mutual_friends_user1 ON connection_mutual_friends(user1_id);
CREATE INDEX IF NOT EXISTS idx_mutual_friends_user2 ON connection_mutual_friends(user2_id);
CREATE INDEX IF NOT EXISTS idx_mutual_friends_count ON connection_mutual_friends(mutual_count DESC);

-- Create table for connection activities/interactions
CREATE TABLE IF NOT EXISTS connection_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES peer_connections(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('message', 'study_session', 'resource_shared', 'achievement_congratulated', 'collaboration')),
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_data JSONB, -- Flexible storage for activity-specific data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for activities
CREATE INDEX IF NOT EXISTS idx_activities_connection_id ON connection_activities(connection_id);
CREATE INDEX IF NOT EXISTS idx_activities_actor_id ON connection_activities(actor_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON connection_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON connection_activities(created_at DESC);

-- Enable Row Level Security
ALTER TABLE peer_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_mutual_friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for peer_connections
CREATE POLICY "Users can view their own connections"
  ON peer_connections FOR SELECT
  TO authenticated
  USING (requester_id = auth.uid() OR addressee_id = auth.uid());

CREATE POLICY "Users can send connection requests"
  ON peer_connections FOR INSERT
  TO authenticated
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can respond to their connection requests"
  ON peer_connections FOR UPDATE
  TO authenticated
  USING (addressee_id = auth.uid() OR requester_id = auth.uid())
  WITH CHECK (addressee_id = auth.uid() OR requester_id = auth.uid());

CREATE POLICY "Users can delete their connections"
  ON peer_connections FOR DELETE
  TO authenticated
  USING (requester_id = auth.uid() OR addressee_id = auth.uid());

-- RLS Policies for connection_mutual_friends
CREATE POLICY "Users can view mutual friend counts"
  ON connection_mutual_friends FOR SELECT
  TO authenticated
  USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- RLS Policies for connection_activities
CREATE POLICY "Connected users can view their activities"
  ON connection_activities FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM peer_connections
    WHERE id = connection_activities.connection_id
    AND (requester_id = auth.uid() OR addressee_id = auth.uid())
    AND status = 'accepted'
  ));

CREATE POLICY "Connected users can create activities"
  ON connection_activities FOR INSERT
  TO authenticated
  WITH CHECK (actor_id = auth.uid() AND EXISTS (
    SELECT 1 FROM peer_connections
    WHERE id = connection_activities.connection_id
    AND (requester_id = auth.uid() OR addressee_id = auth.uid())
    AND status = 'accepted'
  ));

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.status != OLD.status THEN
    NEW.responded_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER connections_updated_at
  BEFORE UPDATE ON peer_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_connections_updated_at();

-- Function to calculate mutual friends between two users
CREATE OR REPLACE FUNCTION calculate_mutual_friends(user1 UUID, user2 UUID)
RETURNS INTEGER AS $$
DECLARE
  mutual_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT friend_id)
  INTO mutual_count
  FROM (
    -- Friends of user1
    SELECT
      CASE
        WHEN requester_id = user1 THEN addressee_id
        WHEN addressee_id = user1 THEN requester_id
      END as friend_id
    FROM peer_connections
    WHERE (requester_id = user1 OR addressee_id = user1)
    AND status = 'accepted'

    INTERSECT

    -- Friends of user2
    SELECT
      CASE
        WHEN requester_id = user2 THEN addressee_id
        WHEN addressee_id = user2 THEN requester_id
      END as friend_id
    FROM peer_connections
    WHERE (requester_id = user2 OR addressee_id = user2)
    AND status = 'accepted'
  ) AS mutual;

  RETURN mutual_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update peer profile's mutual connections count
CREATE OR REPLACE FUNCTION update_peer_mutual_connections()
RETURNS TRIGGER AS $$
DECLARE
  user1 UUID;
  user2 UUID;
  mutual_count INTEGER;
BEGIN
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    user1 := NEW.requester_id;
    user2 := NEW.addressee_id;

    -- Calculate mutual friends
    mutual_count := calculate_mutual_friends(user1, user2);

    -- Update or insert mutual friends record
    INSERT INTO connection_mutual_friends (user1_id, user2_id, mutual_count, last_calculated)
    VALUES (user1, user2, mutual_count, NOW())
    ON CONFLICT (user1_id, user2_id)
    DO UPDATE SET mutual_count = EXCLUDED.mutual_count, last_calculated = NOW();

    -- Also update the reverse pairing
    INSERT INTO connection_mutual_friends (user1_id, user2_id, mutual_count, last_calculated)
    VALUES (user2, user1, mutual_count, NOW())
    ON CONFLICT (user1_id, user2_id)
    DO UPDATE SET mutual_count = EXCLUDED.mutual_count, last_calculated = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER connection_accepted
  AFTER UPDATE OF status ON peer_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_peer_mutual_connections();

-- View to get user's network summary
CREATE OR REPLACE VIEW user_network_summary AS
SELECT
  u.id as user_id,
  COUNT(DISTINCT CASE WHEN pc.status = 'accepted' THEN
    CASE WHEN pc.requester_id = u.id THEN pc.addressee_id ELSE pc.requester_id END
  END) as total_connections,
  COUNT(DISTINCT CASE WHEN pc.status = 'pending' AND pc.addressee_id = u.id THEN pc.id END) as pending_requests,
  COUNT(DISTINCT CASE WHEN pc.connection_type = 'mentor' AND pc.status = 'accepted' THEN pc.id END) as mentors,
  COUNT(DISTINCT CASE WHEN pc.connection_type = 'mentee' AND pc.status = 'accepted' THEN pc.id END) as mentees
FROM auth.users u
LEFT JOIN peer_connections pc ON (u.id = pc.requester_id OR u.id = pc.addressee_id)
GROUP BY u.id;

-- Function to get connection suggestions for a user based on mutual friends and shared interests
CREATE OR REPLACE FUNCTION get_connection_suggestions(target_user_id UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  suggested_user_id UUID,
  suggested_user_name TEXT,
  mutual_friends_count INTEGER,
  shared_subjects TEXT[],
  compatibility_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pp.student_id as suggested_user_id,
    pp.name as suggested_user_name,
    COALESCE(cmf.mutual_count, 0) as mutual_friends_count,
    ARRAY(
      SELECT UNNEST(pp.subjects)
      INTERSECT
      SELECT UNNEST(target_pp.subjects)
    ) as shared_subjects,
    (
      -- Calculate compatibility score based on:
      -- 1. Mutual friends (40%)
      -- 2. Shared subjects (40%)
      -- 3. Rating similarity (20%)
      (COALESCE(cmf.mutual_count, 0) * 4) +
      (CARDINALITY(ARRAY(SELECT UNNEST(pp.subjects) INTERSECT SELECT UNNEST(target_pp.subjects))) * 8) +
      (CASE WHEN ABS(pp.rating - target_pp.rating) < 1 THEN 20 ELSE 10 END)
    ) as compatibility_score
  FROM peer_profiles pp
  CROSS JOIN peer_profiles target_pp
  LEFT JOIN connection_mutual_friends cmf ON (cmf.user1_id = target_user_id AND cmf.user2_id = pp.student_id)
  WHERE
    target_pp.student_id = target_user_id
    AND pp.student_id != target_user_id
    AND NOT EXISTS (
      SELECT 1 FROM peer_connections pc
      WHERE ((pc.requester_id = target_user_id AND pc.addressee_id = pp.student_id)
         OR (pc.requester_id = pp.student_id AND pc.addressee_id = target_user_id))
      AND pc.status IN ('accepted', 'pending')
    )
  ORDER BY compatibility_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- Sample Data (Optional - for testing)
-- =============================================================================

-- Insert sample peer connections (uncomment to use)
/*
INSERT INTO peer_connections (requester_id, addressee_id, status, connection_type, message)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002',
   'accepted', 'friend', 'Hey! I saw we''re both preparing for JEE. Want to study together?'),

  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003',
   'accepted', 'friend', 'Your chemistry notes are amazing! Let''s connect!'),

  ('00000000-0000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001',
   'pending', 'friend', 'Would love to collaborate on the physics project!'),

  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004',
   'accepted', 'mentor', 'Can you mentor me in advanced mathematics?');
*/

-- =============================================================================
-- Verification Queries
-- =============================================================================

-- Check table structure
-- SELECT table_name, column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name IN ('peer_connections', 'connection_mutual_friends', 'connection_activities')
-- ORDER BY table_name, ordinal_position;

-- View connection statistics
-- SELECT status, connection_type, COUNT(*) as count
-- FROM peer_connections
-- GROUP BY status, connection_type;

-- View user network summary
-- SELECT * FROM user_network_summary
-- WHERE user_id = 'YOUR_USER_ID';

-- Get connection suggestions for a user
-- SELECT * FROM get_connection_suggestions('YOUR_USER_ID', 10);

-- View mutual friends between two users
-- SELECT calculate_mutual_friends('USER_ID_1', 'USER_ID_2') as mutual_friends;

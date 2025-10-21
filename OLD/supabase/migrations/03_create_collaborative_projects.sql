-- =============================================================================
-- Migration: Create Collaborative Projects Table
-- Description: Team-based learning projects with skills, progress tracking, and milestones
-- Dependencies: Requires auth.users table and peer_profiles table
-- =============================================================================

-- Create collaborative_projects table
CREATE TABLE IF NOT EXISTS collaborative_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  team_size INTEGER DEFAULT 0 CHECK (team_size >= 0),
  max_team_size INTEGER NOT NULL DEFAULT 5 CHECK (max_team_size > 0),
  skills_needed TEXT[] NOT NULL DEFAULT '{}',
  duration TEXT NOT NULL, -- e.g., "6 weeks", "2 months"
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  deadline TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  coordinator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coordinator_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'recruiting' CHECK (status IN ('recruiting', 'in-progress', 'review', 'completed')),
  repository_url TEXT,
  project_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure max_team_size is greater than team_size
  CONSTRAINT check_team_capacity CHECK (team_size <= max_team_size)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_subject ON collaborative_projects(subject);
CREATE INDEX IF NOT EXISTS idx_projects_difficulty ON collaborative_projects(difficulty);
CREATE INDEX IF NOT EXISTS idx_projects_status ON collaborative_projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_coordinator_id ON collaborative_projects(coordinator_id);
CREATE INDEX IF NOT EXISTS idx_projects_deadline ON collaborative_projects(deadline);
CREATE INDEX IF NOT EXISTS idx_projects_skills ON collaborative_projects USING GIN (skills_needed);
CREATE INDEX IF NOT EXISTS idx_projects_tags ON collaborative_projects USING GIN (tags);

-- Create table for project team members
CREATE TABLE IF NOT EXISTS project_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES collaborative_projects(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('coordinator', 'lead', 'member')),
  skills_contributed TEXT[] NOT NULL DEFAULT '{}',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contribution_score INTEGER DEFAULT 0 CHECK (contribution_score >= 0 AND contribution_score <= 100),
  is_active BOOLEAN DEFAULT true,

  -- One membership per student per project
  CONSTRAINT unique_project_member UNIQUE (project_id, student_id)
);

-- Create indexes for team members
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_team_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_student_id ON project_team_members(student_id);
CREATE INDEX IF NOT EXISTS idx_project_members_active ON project_team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_project_members_role ON project_team_members(role);

-- Create table for project milestones
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES collaborative_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'blocked')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for milestones
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON project_milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_due_date ON project_milestones(due_date);
CREATE INDEX IF NOT EXISTS idx_milestones_assigned_to ON project_milestones(assigned_to);

-- Create table for project discussions/updates
CREATE TABLE IF NOT EXISTS project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES collaborative_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  update_type TEXT NOT NULL CHECK (update_type IN ('announcement', 'discussion', 'milestone', 'resource')),
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for updates
CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_user_id ON project_updates(user_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_created_at ON project_updates(created_at DESC);

-- Enable Row Level Security
ALTER TABLE collaborative_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for collaborative_projects
CREATE POLICY "Anyone can view recruiting projects"
  ON collaborative_projects FOR SELECT
  TO authenticated
  USING (status = 'recruiting' OR coordinator_id = auth.uid() OR
         EXISTS (
           SELECT 1 FROM project_team_members
           WHERE project_id = id AND student_id = auth.uid()
         ));

CREATE POLICY "Authenticated users can create projects"
  ON collaborative_projects FOR INSERT
  TO authenticated
  WITH CHECK (coordinator_id = auth.uid());

CREATE POLICY "Coordinators can update their projects"
  ON collaborative_projects FOR UPDATE
  TO authenticated
  USING (coordinator_id = auth.uid())
  WITH CHECK (coordinator_id = auth.uid());

CREATE POLICY "Coordinators can delete their projects"
  ON collaborative_projects FOR DELETE
  TO authenticated
  USING (coordinator_id = auth.uid());

-- RLS Policies for project_team_members
CREATE POLICY "Users can view team members of visible projects"
  ON project_team_members FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM collaborative_projects
    WHERE id = project_id
    AND (status = 'recruiting' OR coordinator_id = auth.uid() OR
         EXISTS (
           SELECT 1 FROM project_team_members ptm
           WHERE ptm.project_id = project_id AND ptm.student_id = auth.uid()
         ))
  ));

CREATE POLICY "Users can join projects"
  ON project_team_members FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Coordinators can manage team members"
  ON project_team_members FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM collaborative_projects
    WHERE id = project_id AND coordinator_id = auth.uid()
  ));

CREATE POLICY "Users can leave projects or coordinators can remove members"
  ON project_team_members FOR DELETE
  TO authenticated
  USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM collaborative_projects
    WHERE id = project_id AND coordinator_id = auth.uid()
  ));

-- RLS Policies for project_milestones
CREATE POLICY "Team members can view milestones"
  ON project_milestones FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM project_team_members
    WHERE project_id = project_milestones.project_id
    AND student_id = auth.uid()
  ));

CREATE POLICY "Coordinators can manage milestones"
  ON project_milestones FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM collaborative_projects
    WHERE id = project_milestones.project_id
    AND coordinator_id = auth.uid()
  ));

-- RLS Policies for project_updates
CREATE POLICY "Team members can view updates"
  ON project_updates FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM project_team_members
    WHERE project_id = project_updates.project_id
    AND student_id = auth.uid()
  ));

CREATE POLICY "Team members can post updates"
  ON project_updates FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM project_team_members
    WHERE project_id = project_updates.project_id
    AND student_id = auth.uid()
  ));

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON collaborative_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_projects_updated_at();

CREATE TRIGGER milestones_updated_at
  BEFORE UPDATE ON project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_projects_updated_at();

-- Function to update team size when membership changes
CREATE OR REPLACE FUNCTION update_project_team_size()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE collaborative_projects
    SET team_size = team_size + 1
    WHERE id = NEW.project_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE collaborative_projects
    SET team_size = GREATEST(0, team_size - 1)
    WHERE id = OLD.project_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.is_active != OLD.is_active THEN
    UPDATE collaborative_projects
    SET team_size = team_size + CASE WHEN NEW.is_active THEN 1 ELSE -1 END
    WHERE id = NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_membership_changes
  AFTER INSERT OR DELETE OR UPDATE OF is_active ON project_team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_project_team_size();

-- Function to auto-update project progress based on milestone completion
CREATE OR REPLACE FUNCTION update_project_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_milestones INTEGER;
  completed_milestones INTEGER;
  new_progress INTEGER;
BEGIN
  SELECT COUNT(*), COUNT(CASE WHEN status = 'completed' THEN 1 END)
  INTO total_milestones, completed_milestones
  FROM project_milestones
  WHERE project_id = NEW.project_id;

  IF total_milestones > 0 THEN
    new_progress := ROUND((completed_milestones::DECIMAL / total_milestones) * 100);
    UPDATE collaborative_projects
    SET progress = new_progress
    WHERE id = NEW.project_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER milestone_progress_update
  AFTER INSERT OR UPDATE OF status ON project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_project_progress();

-- =============================================================================
-- Sample Data (Optional - for testing)
-- =============================================================================

-- Insert sample projects (uncomment to use)
/*
INSERT INTO collaborative_projects (title, subject, description, team_size, max_team_size, skills_needed, duration, difficulty, deadline, progress, coordinator_id, coordinator_name, status)
VALUES
  ('AI-Powered Study Assistant', 'Computer Science',
   'Develop a machine learning model to predict optimal study schedules and suggest personalized learning paths',
   3, 5, ARRAY['Python', 'Machine Learning', 'Data Analysis', 'UI/UX'],
   '6 weeks', 'advanced', NOW() + INTERVAL '45 days', 35,
   '00000000-0000-0000-0000-000000000001', 'AI Team Lead', 'recruiting'),

  ('Interactive Physics Simulations', 'Physics',
   'Create 3D interactive simulations for complex physics concepts like wave interference and electromagnetic fields',
   4, 6, ARRAY['3D Modeling', 'Physics Knowledge', 'Programming', 'Animation'],
   '8 weeks', 'intermediate', NOW() + INTERVAL '60 days', 60,
   '00000000-0000-0000-0000-000000000002', 'Physics Sim Team', 'in-progress'),

  ('Chemistry Virtual Lab', 'Chemistry',
   'Build a virtual chemistry laboratory for safe experimentation and learning chemical reactions',
   5, 7, ARRAY['VR/AR', 'Chemistry Knowledge', 'Game Development', '3D Graphics'],
   '10 weeks', 'advanced', NOW() + INTERVAL '75 days', 25,
   '00000000-0000-0000-0000-000000000003', 'VR Lab Team', 'recruiting');
*/

-- =============================================================================
-- Verification Queries
-- =============================================================================

-- Check table structure
-- SELECT table_name, column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name IN ('collaborative_projects', 'project_team_members', 'project_milestones', 'project_updates')
-- ORDER BY table_name, ordinal_position;

-- Count projects by status
-- SELECT status, COUNT(*) as project_count
-- FROM collaborative_projects
-- GROUP BY status;

-- View project progress summary
-- SELECT title, status, progress, team_size, max_team_size
-- FROM collaborative_projects
-- ORDER BY progress DESC;

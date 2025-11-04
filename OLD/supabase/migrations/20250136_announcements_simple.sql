-- ============================================================================
-- MIGRATION: Create Announcements Table (Simplified - No Helper Functions)
-- Description: Announcement/Communications management system
-- Dependencies: profiles table only
-- ============================================================================

-- Drop existing table if it exists (fresh start)
DROP TABLE IF EXISTS public.announcements CASCADE;

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  category TEXT NOT NULL DEFAULT 'general',
  target_audience TEXT NOT NULL DEFAULT 'all',
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  view_count INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT title_length CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
  CONSTRAINT content_length CHECK (char_length(content) >= 10),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  CONSTRAINT valid_category CHECK (category IN ('general', 'academic', 'administrative', 'event', 'holiday')),
  CONSTRAINT valid_target_audience CHECK (target_audience IN ('all', 'students', 'parents', 'teachers', 'staff')),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  CONSTRAINT positive_view_count CHECK (view_count >= 0)
);

-- Create indexes
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_priority ON announcements(priority);
CREATE INDEX idx_announcements_created_by ON announcements(created_by);
CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view published announcements
CREATE POLICY "view_published_announcements" ON announcements
  FOR SELECT TO authenticated
  USING (status = 'published');

-- Policy: Admins can view all
CREATE POLICY "admin_view_all" ON announcements
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can insert
CREATE POLICY "admin_insert" ON announcements
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can update
CREATE POLICY "admin_update" ON announcements
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can delete
CREATE POLICY "admin_delete" ON announcements
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_announcements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_announcements_updated_at();

-- Insert sample data
DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;

  IF admin_id IS NOT NULL THEN
    INSERT INTO announcements (title, content, priority, category, target_audience, status, created_by, published_at, view_count) VALUES
    ('Welcome to Manushi Coaching', 'We are excited to have you join our coaching platform. Explore the features and start your learning journey today!', 'high', 'general', 'all', 'published', admin_id, now(), 156),
    ('New Course: Advanced Mathematics', 'We are pleased to announce a new advanced mathematics course starting next month. Enroll now to secure your spot!', 'medium', 'academic', 'students', 'published', admin_id, now() - interval '2 days', 89),
    ('Holiday Notice: Diwali Break', 'The coaching center will remain closed from October 20-25 for Diwali. Classes will resume on October 26.', 'medium', 'holiday', 'all', 'published', admin_id, now() - interval '1 month', 234);

    INSERT INTO announcements (title, content, priority, category, target_audience, status, created_by, scheduled_at) VALUES
    ('Parent-Teacher Meeting', 'The monthly meeting is scheduled for next Saturday at 10 AM. Please mark your calendars.', 'high', 'event', 'parents', 'scheduled', admin_id, now() + interval '5 days');

    INSERT INTO announcements (title, content, priority, category, target_audience, status, created_by) VALUES
    ('Platform Maintenance', 'The platform will undergo maintenance this Sunday from 2 AM to 4 AM.', 'urgent', 'administrative', 'all', 'draft', admin_id);

    RAISE NOTICE '✅ Created 5 sample announcements';
  ELSE
    RAISE NOTICE '⚠️ No admin found - skipping sample data';
  END IF;
END $$;

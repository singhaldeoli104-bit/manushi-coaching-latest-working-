-- Content Management System

-- Create content_announcements table
CREATE TABLE IF NOT EXISTS content_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  view_count INTEGER DEFAULT 0,
  reaction_count INTEGER DEFAULT 0,
  author_id UUID REFERENCES profiles(id),
  target_audience TEXT[] DEFAULT ARRAY[]::TEXT[], -- e.g., ['All Students', 'Parents', 'Teachers']
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content_analytics table
CREATE TABLE IF NOT EXISTS content_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT, -- e.g., 'count', 'percentage', 'rate'
  change_value NUMERIC,
  change_percentage NUMERIC,
  trend TEXT CHECK (trend IN ('up', 'down', 'stable')),
  period TEXT NOT NULL, -- e.g., 'today', 'week', 'month', 'year'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content_resources table
CREATE TABLE IF NOT EXISTS content_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- e.g., 'png', 'jpg', 'pdf', 'mp4', 'docx'
  file_size BIGINT, -- size in bytes
  file_url TEXT,
  storage_path TEXT,
  category TEXT, -- e.g., 'image', 'document', 'video', 'audio'
  description TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  uploaded_by UUID REFERENCES profiles(id),
  download_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content_quick_actions table
CREATE TABLE IF NOT EXISTS content_quick_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL, -- Material icon name
  action_type TEXT NOT NULL, -- e.g., 'navigate', 'external', 'modal', 'function'
  action_data JSONB DEFAULT '{}'::jsonb, -- screen name, URL, or function parameters
  is_enabled BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  required_permission TEXT, -- Permission required to see this action
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample announcements
INSERT INTO content_announcements (title, description, priority, status, tags, view_count, reaction_count, target_audience, published_at) VALUES
  ('Welcome New Students 2024',
   'We are excited to welcome all new students joining us this academic year. Please review the orientation schedule.',
   'high', 'published',
   ARRAY['All Students', 'Important', 'Announcements'],
   1234, 89,
   ARRAY['All Students', 'Parents'],
   NOW() - INTERVAL '2 days'),
  ('Updated Code of Conduct',
   'The student code of conduct has been updated. Please review the new policies with your children.',
   'medium', 'draft',
   ARRAY['Parents', 'Students', 'Policy'],
   567, 23,
   ARRAY['Parents', 'Students', 'Teachers'],
   NOW() - INTERVAL '7 days'),
  ('Midterm Examination Schedule',
   'The midterm examination schedule for all grades has been finalized. Check the detailed timetable in the student portal.',
   'high', 'published',
   ARRAY['All Students', 'Exams', 'Important'],
   2156, 145,
   ARRAY['All Students', 'Parents'],
   NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- Insert sample analytics
INSERT INTO content_analytics (metric_name, metric_value, metric_unit, change_value, change_percentage, trend, period) VALUES
  ('Most Viewed Content', 12847, 'count', 1523, 13.4, 'up', 'month'),
  ('Engagement Rate', 73.4, 'percentage', 12.3, 20.1, 'up', 'month'),
  ('Total Published Content', 156, 'count', 12, 8.3, 'up', 'month'),
  ('Average Read Time', 4.2, 'minutes', -0.3, -6.7, 'down', 'week')
ON CONFLICT (id) DO NOTHING;

-- Insert sample resources
INSERT INTO content_resources (name, file_type, file_size, category, uploaded_by, download_count, is_public) VALUES
  ('screenshot.png', 'png', 2516582, 'image', NULL, 45, TRUE), -- 2.4 MB
  ('document.pdf', 'pdf', 1887437, 'document', NULL, 123, TRUE), -- 1.8 MB
  ('tutorial.mp4', 'mp4', 15939927, 'video', NULL, 67, TRUE), -- 15.2 MB
  ('course-syllabus.pdf', 'pdf', 512000, 'document', NULL, 234, TRUE),
  ('lesson-recording.mp4', 'mp4', 45678901, 'video', NULL, 89, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Insert sample quick actions
INSERT INTO content_quick_actions (name, description, icon, action_type, action_data, sort_order) VALUES
  ('Newsletter Builder', 'Create and send newsletters', 'newspaper', 'navigate', '{"screen": "NewsletterBuilder"}'::jsonb, 1),
  ('Schedule Post', 'Schedule announcements for later', 'schedule', 'navigate', '{"screen": "SchedulePost"}'::jsonb, 2),
  ('FAQ Management', 'Manage frequently asked questions', 'help-circle', 'navigate', '{"screen": "FAQManagement"}'::jsonb, 3),
  ('Version History', 'View content version history', 'history', 'navigate', '{"screen": "VersionHistory"}'::jsonb, 4),
  ('Notifications', 'Manage notification settings', 'bell', 'navigate', '{"screen": "NotificationSettings"}'::jsonb, 5),
  ('CDN Integration', 'Configure content delivery network', 'hub', 'navigate', '{"screen": "CDNSettings"}'::jsonb, 6)
ON CONFLICT (id) DO NOTHING;

-- Function to get content announcements
CREATE OR REPLACE FUNCTION get_content_announcements()
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  priority TEXT,
  status TEXT,
  tags TEXT[],
  view_count INTEGER,
  reaction_count INTEGER,
  author_id UUID,
  author_name TEXT,
  target_audience TEXT[],
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ca.id,
    ca.title,
    ca.description,
    ca.priority,
    ca.status,
    ca.tags,
    ca.view_count,
    ca.reaction_count,
    ca.author_id,
    CONCAT(p.first_name, ' ', p.last_name) AS author_name,
    ca.target_audience,
    ca.scheduled_at,
    ca.published_at,
    ca.created_at,
    ca.updated_at
  FROM content_announcements ca
  LEFT JOIN profiles p ON p.id = ca.author_id
  ORDER BY ca.published_at DESC NULLS LAST, ca.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get content analytics
CREATE OR REPLACE FUNCTION get_content_analytics()
RETURNS TABLE (
  id UUID,
  metric_name TEXT,
  metric_value NUMERIC,
  metric_unit TEXT,
  change_value NUMERIC,
  change_percentage NUMERIC,
  trend TEXT,
  period TEXT,
  metadata JSONB,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ca.id,
    ca.metric_name,
    ca.metric_value,
    ca.metric_unit,
    ca.change_value,
    ca.change_percentage,
    ca.trend,
    ca.period,
    ca.metadata,
    ca.updated_at
  FROM content_analytics ca
  ORDER BY ca.metric_name;
END;
$$ LANGUAGE plpgsql;

-- Function to get content resources
CREATE OR REPLACE FUNCTION get_content_resources()
RETURNS TABLE (
  id UUID,
  name TEXT,
  file_type TEXT,
  file_size BIGINT,
  file_url TEXT,
  storage_path TEXT,
  category TEXT,
  description TEXT,
  tags TEXT[],
  uploaded_by UUID,
  uploader_name TEXT,
  download_count INTEGER,
  is_public BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cr.id,
    cr.name,
    cr.file_type,
    cr.file_size,
    cr.file_url,
    cr.storage_path,
    cr.category,
    cr.description,
    cr.tags,
    cr.uploaded_by,
    CONCAT(p.first_name, ' ', p.last_name) AS uploader_name,
    cr.download_count,
    cr.is_public,
    cr.created_at
  FROM content_resources cr
  LEFT JOIN profiles p ON p.id = cr.uploaded_by
  ORDER BY cr.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get quick actions
CREATE OR REPLACE FUNCTION get_content_quick_actions()
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  icon TEXT,
  action_type TEXT,
  action_data JSONB,
  is_enabled BOOLEAN,
  sort_order INTEGER,
  required_permission TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cqa.id,
    cqa.name,
    cqa.description,
    cqa.icon,
    cqa.action_type,
    cqa.action_data,
    cqa.is_enabled,
    cqa.sort_order,
    cqa.required_permission
  FROM content_quick_actions cqa
  WHERE cqa.is_enabled = TRUE
  ORDER BY cqa.sort_order;
END;
$$ LANGUAGE plpgsql;

-- Function to get content statistics
CREATE OR REPLACE FUNCTION get_content_statistics()
RETURNS TABLE (
  total_announcements INTEGER,
  published_announcements INTEGER,
  draft_announcements INTEGER,
  total_resources INTEGER,
  total_resource_size BIGINT,
  total_views INTEGER,
  total_reactions INTEGER,
  average_engagement_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER AS total_announcements,
    COUNT(*) FILTER (WHERE status = 'published')::INTEGER AS published_announcements,
    COUNT(*) FILTER (WHERE status = 'draft')::INTEGER AS draft_announcements,
    (SELECT COUNT(*)::INTEGER FROM content_resources) AS total_resources,
    (SELECT COALESCE(SUM(file_size), 0) FROM content_resources) AS total_resource_size,
    COALESCE(SUM(view_count), 0)::INTEGER AS total_views,
    COALESCE(SUM(reaction_count), 0)::INTEGER AS total_reactions,
    CASE
      WHEN SUM(view_count) > 0 THEN (SUM(reaction_count)::NUMERIC / SUM(view_count) * 100)
      ELSE 0
    END AS average_engagement_rate
  FROM content_announcements;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_content_announcements TO authenticated;
GRANT EXECUTE ON FUNCTION get_content_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION get_content_resources TO authenticated;
GRANT EXECUTE ON FUNCTION get_content_quick_actions TO authenticated;
GRANT EXECUTE ON FUNCTION get_content_statistics TO authenticated;

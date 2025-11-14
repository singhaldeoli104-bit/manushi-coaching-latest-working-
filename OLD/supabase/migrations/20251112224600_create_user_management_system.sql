-- User Management System

-- Note: profiles table already exists, we'll extend it with roles and permissions

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_permissions table
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  permission_name TEXT NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'manage')),
  conditions JSONB DEFAULT '[]'::jsonb,
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bulk_operations table
CREATE TABLE IF NOT EXISTS bulk_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type TEXT NOT NULL CHECK (operation_type IN ('import', 'export', 'update', 'delete', 'activate', 'deactivate')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_users INTEGER DEFAULT 0,
  processed_users INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id)
);

-- Insert default user roles
INSERT INTO user_roles (name, display_name, description, is_custom, permissions) VALUES
  ('admin', 'System Administrator', 'Full system access with user management capabilities', FALSE, '[{"name":"manage_all","resource":"*","action":"manage"}]'::jsonb),
  ('teacher', 'Teacher', 'Teaching capabilities with class management', FALSE, '[{"name":"manage_classes","resource":"classes","action":"manage"},{"name":"view_students","resource":"students","action":"read"}]'::jsonb),
  ('parent', 'Parent', 'Parent access with child monitoring capabilities', FALSE, '[{"name":"view_children","resource":"students","action":"read"}]'::jsonb),
  ('student', 'Student', 'Student access with learning capabilities', FALSE, '[{"name":"view_own_data","resource":"assignments","action":"read"}]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Create function to get users with enhanced data
CREATE OR REPLACE FUNCTION get_users_with_roles()
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone_number TEXT,
  role TEXT,
  role_display_name TEXT,
  department TEXT,
  status TEXT,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  profile_image TEXT,
  employee_id TEXT,
  grade TEXT,
  subjects TEXT[],
  is_verified BOOLEAN,
  requires_mfa BOOLEAN,
  total_permissions INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.first_name,
    p.last_name,
    p.email,
    p.phone_number,
    p.role,
    COALESCE(ur.display_name, INITCAP(p.role)) AS role_display_name,
    p.department,
    COALESCE(p.status, 'active') AS status,
    p.last_login,
    p.created_at,
    p.profile_image,
    p.employee_id,
    p.grade,
    p.subjects,
    COALESCE(p.is_verified, FALSE) AS is_verified,
    COALESCE(p.requires_mfa, FALSE) AS requires_mfa,
    COALESCE((SELECT COUNT(*)::INTEGER FROM user_permissions WHERE user_id = p.id), 0) AS total_permissions
  FROM profiles p
  LEFT JOIN user_roles ur ON ur.name = p.role
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user roles
CREATE OR REPLACE FUNCTION get_user_roles()
RETURNS TABLE (
  id UUID,
  name TEXT,
  display_name TEXT,
  description TEXT,
  permissions JSONB,
  is_custom BOOLEAN,
  created_at TIMESTAMPTZ,
  created_by UUID,
  user_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ur.id,
    ur.name,
    ur.display_name,
    ur.description,
    ur.permissions,
    ur.is_custom,
    ur.created_at,
    ur.created_by,
    (SELECT COUNT(*)::INTEGER FROM profiles WHERE role = ur.name) AS user_count
  FROM user_roles ur
  ORDER BY ur.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get bulk operations
CREATE OR REPLACE FUNCTION get_bulk_operations()
RETURNS TABLE (
  id UUID,
  operation_type TEXT,
  status TEXT,
  total_users INTEGER,
  processed_users INTEGER,
  errors JSONB,
  created_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by_email TEXT,
  progress_percentage INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    bo.id,
    bo.operation_type,
    bo.status,
    bo.total_users,
    bo.processed_users,
    bo.errors,
    bo.created_at,
    bo.completed_at,
    p.email AS created_by_email,
    CASE
      WHEN bo.total_users > 0 THEN (bo.processed_users * 100 / bo.total_users)::INTEGER
      ELSE 0
    END AS progress_percentage
  FROM bulk_operations bo
  LEFT JOIN profiles p ON p.id = bo.created_by
  ORDER BY bo.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get audit logs (using existing audit_logs table)
CREATE OR REPLACE FUNCTION get_user_audit_logs(
  p_limit INTEGER DEFAULT 100,
  p_event_type TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_severity TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  timestamp TIMESTAMPTZ,
  event_type TEXT,
  user_id UUID,
  user_email TEXT,
  admin_email TEXT,
  description TEXT,
  details JSONB,
  ip_address TEXT,
  severity TEXT,
  outcome TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    al.id,
    al.created_at AS timestamp,
    al.action AS event_type,
    al.user_id,
    u.email AS user_email,
    a.email AS admin_email,
    al.details::TEXT AS description,
    al.details,
    al.ip_address,
    COALESCE(al.severity, 'low') AS severity,
    'success'::TEXT AS outcome
  FROM audit_logs al
  LEFT JOIN profiles u ON u.id = al.user_id
  LEFT JOIN profiles a ON a.id = al.performed_by
  WHERE
    (p_event_type IS NULL OR al.action = p_event_type)
    AND (p_user_id IS NULL OR al.user_id = p_user_id)
    AND (p_severity IS NULL OR al.severity = p_severity)
  ORDER BY al.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics()
RETURNS TABLE (
  total_users INTEGER,
  active_users INTEGER,
  pending_users INTEGER,
  suspended_users INTEGER,
  total_admins INTEGER,
  total_teachers INTEGER,
  total_parents INTEGER,
  total_students INTEGER,
  verified_users INTEGER,
  mfa_enabled_users INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER AS total_users,
    COUNT(*) FILTER (WHERE status = 'active')::INTEGER AS active_users,
    COUNT(*) FILTER (WHERE status = 'pending')::INTEGER AS pending_users,
    COUNT(*) FILTER (WHERE status = 'suspended')::INTEGER AS suspended_users,
    COUNT(*) FILTER (WHERE role = 'admin')::INTEGER AS total_admins,
    COUNT(*) FILTER (WHERE role = 'teacher')::INTEGER AS total_teachers,
    COUNT(*) FILTER (WHERE role = 'parent')::INTEGER AS total_parents,
    COUNT(*) FILTER (WHERE role = 'student')::INTEGER AS total_students,
    COUNT(*) FILTER (WHERE is_verified = TRUE)::INTEGER AS verified_users,
    COUNT(*) FILTER (WHERE requires_mfa = TRUE)::INTEGER AS mfa_enabled_users
  FROM profiles;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_users_with_roles TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION get_bulk_operations TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_audit_logs TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_statistics TO authenticated;

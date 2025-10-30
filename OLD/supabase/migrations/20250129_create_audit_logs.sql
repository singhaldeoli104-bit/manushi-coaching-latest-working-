-- Create audit_logs table for tracking all admin actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Super admins and compliance admins can view all logs
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
      AND admin_profiles.role IN ('super_admin', 'compliance_admin')
    )
  );

-- Policy: All admins can insert their own audit logs
CREATE POLICY "Admins can create audit logs" ON audit_logs
  FOR INSERT
  WITH CHECK (admin_id = auth.uid());

-- Grant access to authenticated users
GRANT SELECT, INSERT ON audit_logs TO authenticated;

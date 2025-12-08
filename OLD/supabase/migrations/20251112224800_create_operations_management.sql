-- Operations Management System

-- Create operational_metrics table
CREATE TABLE IF NOT EXISTS operational_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  change TEXT,
  change_type TEXT CHECK (change_type IN ('increase', 'decrease', 'neutral')),
  icon TEXT,
  status TEXT NOT NULL CHECK (status IN ('excellent', 'good', 'warning', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workflow_processes table
CREATE TABLE IF NOT EXISTS workflow_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'paused', 'draft')),
  automation_level INTEGER DEFAULT 0 CHECK (automation_level >= 0 AND automation_level <= 100),
  efficiency INTEGER DEFAULT 0 CHECK (efficiency >= 0 AND efficiency <= 100),
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  assigned_to TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Create resource_allocations table
CREATE TABLE IF NOT EXISTS resource_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource TEXT NOT NULL,
  allocated INTEGER DEFAULT 0,
  capacity INTEGER DEFAULT 0,
  utilization INTEGER DEFAULT 0 CHECK (utilization >= 0 AND utilization <= 100),
  cost NUMERIC DEFAULT 0,
  trend TEXT CHECK (trend IN ('up', 'down', 'stable')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample operational metrics
INSERT INTO operational_metrics (title, value, change, change_type, icon, status) VALUES
  ('System Uptime', '99.97%', '+0.02%', 'increase', '⚡', 'excellent'),
  ('Process Automation', '73%', '+12%', 'increase', '🤖', 'good'),
  ('Resource Utilization', '87%', '+5%', 'increase', '📊', 'warning'),
  ('Incident Response', '2.3h', '-45min', 'decrease', '🚨', 'good')
ON CONFLICT (id) DO NOTHING;

-- Insert sample workflow processes
INSERT INTO workflow_processes (name, description, status, automation_level, efficiency, last_run, next_run) VALUES
  ('Student Enrollment', 'Automated student registration and onboarding process', 'active', 85, 92,
   NOW() - INTERVAL '1 day', NOW() + INTERVAL '1 day'),
  ('Payment Processing', 'Automated fee collection and invoice generation', 'active', 95, 98,
   NOW() - INTERVAL '12 hours', NOW() + INTERVAL '6 hours'),
  ('Performance Reports', 'Weekly academic performance report generation', 'paused', 70, 78,
   NOW() - INTERVAL '5 days', NOW() + INTERVAL '4 days')
ON CONFLICT (id) DO NOTHING;

-- Insert sample incidents
INSERT INTO incidents (title, description, severity, status, assigned_to, created_at) VALUES
  ('Database Connection Timeout', 'Intermittent database connection issues affecting user login',
   'high', 'investigating', 'DevOps Team', NOW() - INTERVAL '5 hours'),
  ('Payment Gateway Delay', 'Slower response times from primary payment gateway',
   'medium', 'resolved', 'Finance Team', NOW() - INTERVAL '1 day'),
  ('Mobile App Crash', 'App crashes on specific Android versions during video playback',
   'critical', 'open', 'Mobile Team', NOW() - INTERVAL '6 hours')
ON CONFLICT (id) DO NOTHING;

-- Insert sample resource allocations
INSERT INTO resource_allocations (resource, allocated, capacity, utilization, cost, trend) VALUES
  ('Server Infrastructure', 45, 60, 75, 12500, 'up'),
  ('Teaching Staff', 28, 32, 88, 89600, 'stable'),
  ('Support Staff', 12, 15, 80, 24000, 'down')
ON CONFLICT (id) DO NOTHING;

-- Function to get operational metrics
CREATE OR REPLACE FUNCTION get_operational_metrics()
RETURNS TABLE (
  id UUID,
  title TEXT,
  value TEXT,
  change TEXT,
  change_type TEXT,
  icon TEXT,
  status TEXT,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    om.id,
    om.title,
    om.value,
    om.change,
    om.change_type,
    om.icon,
    om.status,
    om.updated_at
  FROM operational_metrics om
  ORDER BY om.title;
END;
$$ LANGUAGE plpgsql;

-- Function to get workflow processes
CREATE OR REPLACE FUNCTION get_workflow_processes()
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  status TEXT,
  automation_level INTEGER,
  efficiency INTEGER,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    wp.id,
    wp.name,
    wp.description,
    wp.status,
    wp.automation_level,
    wp.efficiency,
    wp.last_run,
    wp.next_run
  FROM workflow_processes wp
  ORDER BY wp.next_run NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- Function to get incidents
CREATE OR REPLACE FUNCTION get_incidents()
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  severity TEXT,
  status TEXT,
  assigned_to TEXT,
  created_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.title,
    i.description,
    i.severity,
    i.status,
    i.assigned_to,
    i.created_at,
    i.resolved_at
  FROM incidents i
  ORDER BY
    CASE
      WHEN i.severity = 'critical' THEN 1
      WHEN i.severity = 'high' THEN 2
      WHEN i.severity = 'medium' THEN 3
      WHEN i.severity = 'low' THEN 4
    END,
    i.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get resource allocations
CREATE OR REPLACE FUNCTION get_resource_allocations()
RETURNS TABLE (
  id UUID,
  resource TEXT,
  allocated INTEGER,
  capacity INTEGER,
  utilization INTEGER,
  cost NUMERIC,
  trend TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ra.id,
    ra.resource,
    ra.allocated,
    ra.capacity,
    ra.utilization,
    ra.cost,
    ra.trend
  FROM resource_allocations ra
  ORDER BY ra.resource;
END;
$$ LANGUAGE plpgsql;

-- Function to get operations statistics
CREATE OR REPLACE FUNCTION get_operations_statistics()
RETURNS TABLE (
  total_workflows INTEGER,
  active_workflows INTEGER,
  total_incidents INTEGER,
  open_incidents INTEGER,
  critical_incidents INTEGER,
  average_automation_level NUMERIC,
  average_resource_utilization NUMERIC,
  total_resource_cost NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER AS total_workflows,
    COUNT(*) FILTER (WHERE status = 'active')::INTEGER AS active_workflows,
    (SELECT COUNT(*)::INTEGER FROM incidents) AS total_incidents,
    (SELECT COUNT(*) FILTER (WHERE status IN ('open', 'investigating'))::INTEGER FROM incidents) AS open_incidents,
    (SELECT COUNT(*) FILTER (WHERE severity = 'critical' AND status IN ('open', 'investigating'))::INTEGER FROM incidents) AS critical_incidents,
    COALESCE(AVG(automation_level), 0)::NUMERIC AS average_automation_level,
    COALESCE((SELECT AVG(utilization) FROM resource_allocations), 0)::NUMERIC AS average_resource_utilization,
    COALESCE((SELECT SUM(cost) FROM resource_allocations), 0)::NUMERIC AS total_resource_cost
  FROM workflow_processes;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_operational_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION get_workflow_processes TO authenticated;
GRANT EXECUTE ON FUNCTION get_incidents TO authenticated;
GRANT EXECUTE ON FUNCTION get_resource_allocations TO authenticated;
GRANT EXECUTE ON FUNCTION get_operations_statistics TO authenticated;

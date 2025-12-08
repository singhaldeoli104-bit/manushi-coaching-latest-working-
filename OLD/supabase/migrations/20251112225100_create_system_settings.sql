-- System Settings Management

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type TEXT NOT NULL, -- 'text', 'boolean', 'number', 'json', 'color', 'file'
  category TEXT NOT NULL, -- 'general', 'security', 'email', 'payment', 'notifications', 'backup', 'api', 'ai'
  display_name TEXT NOT NULL,
  description TEXT,
  is_editable BOOLEAN DEFAULT TRUE,
  validation_rules JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert General Settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, display_name, description) VALUES
  ('site_title', 'Acme Corp', 'text', 'general', 'Site Title', 'The main title displayed across the platform'),
  ('site_logo_url', '', 'file', 'general', 'Site Logo', 'Upload your organization logo'),
  ('primary_color', '#4A90E2', 'color', 'general', 'Primary Color', 'Main brand color used throughout the interface'),
  ('default_language', 'English', 'text', 'general', 'Default Language', 'Default language for the platform'),
  ('timezone', 'UTC', 'text', 'general', 'Timezone', 'Default timezone for the system'),
  ('date_format', 'MM/DD/YYYY', 'text', 'general', 'Date Format', 'Format for displaying dates')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert Security Settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, display_name, description) VALUES
  ('two_factor_enabled', 'true', 'boolean', 'security', 'Enable 2-Factor Authentication', 'Require 2FA for all users'),
  ('session_timeout', '60', 'number', 'security', 'Session Timeout', 'Session timeout in minutes (15-120)'),
  ('password_min_length', '8', 'number', 'security', 'Minimum Password Length', 'Minimum number of characters required for passwords'),
  ('password_require_special', 'true', 'boolean', 'security', 'Require Special Characters', 'Require special characters in passwords'),
  ('max_login_attempts', '5', 'number', 'security', 'Max Login Attempts', 'Maximum failed login attempts before account lock'),
  ('account_lockout_duration', '30', 'number', 'security', 'Account Lockout Duration', 'Duration in minutes for account lockout')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert Email Configuration
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, display_name, description) VALUES
  ('smtp_host', '', 'text', 'email', 'SMTP Host', 'SMTP server hostname'),
  ('smtp_port', '587', 'number', 'email', 'SMTP Port', 'SMTP server port'),
  ('smtp_username', '', 'text', 'email', 'SMTP Username', 'SMTP authentication username'),
  ('smtp_password', '', 'text', 'email', 'SMTP Password', 'SMTP authentication password (encrypted)'),
  ('email_from_address', 'noreply@acmecorp.com', 'text', 'email', 'From Email Address', 'Default sender email address'),
  ('email_from_name', 'Acme Corp', 'text', 'email', 'From Name', 'Default sender name')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert Payment Gateway Settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, display_name, description) VALUES
  ('payment_provider', 'stripe', 'text', 'payment', 'Payment Provider', 'Active payment gateway (stripe, razorpay, paypal)'),
  ('payment_currency', 'USD', 'text', 'payment', 'Default Currency', 'Default currency for transactions'),
  ('payment_test_mode', 'true', 'boolean', 'payment', 'Test Mode', 'Enable test mode for payment processing'),
  ('auto_invoice_generation', 'true', 'boolean', 'payment', 'Auto Invoice Generation', 'Automatically generate invoices for payments')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert Notification Settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, display_name, description) VALUES
  ('push_notifications_enabled', 'true', 'boolean', 'notifications', 'Push Notifications', 'Enable push notifications'),
  ('email_notifications_enabled', 'true', 'boolean', 'notifications', 'Email Notifications', 'Enable email notifications'),
  ('sms_notifications_enabled', 'false', 'boolean', 'notifications', 'SMS Notifications', 'Enable SMS notifications'),
  ('notification_digest', 'daily', 'text', 'notifications', 'Notification Digest', 'Frequency of notification digest emails')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert Backup & Restore Settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, display_name, description) VALUES
  ('auto_backup_enabled', 'true', 'boolean', 'backup', 'Automatic Backups', 'Enable automatic system backups'),
  ('backup_frequency', 'daily', 'text', 'backup', 'Backup Frequency', 'How often to create backups (hourly, daily, weekly)'),
  ('backup_retention_days', '30', 'number', 'backup', 'Backup Retention', 'Number of days to retain backups'),
  ('last_backup_date', '', 'text', 'backup', 'Last Backup Date', 'Timestamp of the last successful backup')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert API Configuration
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, display_name, description) VALUES
  ('api_rate_limit', '100', 'number', 'api', 'API Rate Limit', 'Maximum API requests per minute'),
  ('api_key_expiration_days', '90', 'number', 'api', 'API Key Expiration', 'Number of days before API keys expire'),
  ('cors_enabled', 'true', 'boolean', 'api', 'CORS Enabled', 'Enable Cross-Origin Resource Sharing'),
  ('api_versioning', 'v1', 'text', 'api', 'API Version', 'Current API version')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert AI Services Settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, display_name, description) VALUES
  ('ai_enabled', 'true', 'boolean', 'ai', 'AI Services Enabled', 'Enable AI-powered features'),
  ('ai_provider', 'openai', 'text', 'ai', 'AI Provider', 'AI service provider (openai, anthropic, google)'),
  ('ai_model', 'gpt-4', 'text', 'ai', 'AI Model', 'Default AI model to use'),
  ('ai_max_tokens', '2000', 'number', 'ai', 'Max Tokens', 'Maximum tokens per AI request'),
  ('content_moderation_enabled', 'true', 'boolean', 'ai', 'Content Moderation', 'Use AI for content moderation')
ON CONFLICT (setting_key) DO NOTHING;

-- Function to get settings by category
CREATE OR REPLACE FUNCTION get_system_settings(p_category TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  setting_key TEXT,
  setting_value TEXT,
  setting_type TEXT,
  category TEXT,
  display_name TEXT,
  description TEXT,
  is_editable BOOLEAN,
  validation_rules JSONB,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ss.id,
    ss.setting_key,
    ss.setting_value,
    ss.setting_type,
    ss.category,
    ss.display_name,
    ss.description,
    ss.is_editable,
    ss.validation_rules,
    ss.updated_at
  FROM system_settings ss
  WHERE (p_category IS NULL OR ss.category = p_category)
  ORDER BY ss.category, ss.display_name;
END;
$$ LANGUAGE plpgsql;

-- Function to get all categories
CREATE OR REPLACE FUNCTION get_system_settings_categories()
RETURNS TABLE (
  category TEXT,
  setting_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ss.category,
    COUNT(*)::INTEGER AS setting_count
  FROM system_settings ss
  GROUP BY ss.category
  ORDER BY ss.category;
END;
$$ LANGUAGE plpgsql;

-- Function to update a setting
CREATE OR REPLACE FUNCTION update_system_setting(
  p_setting_key TEXT,
  p_setting_value TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE system_settings
  SET
    setting_value = p_setting_value,
    updated_at = NOW()
  WHERE setting_key = p_setting_key
    AND is_editable = TRUE;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to get setting value by key
CREATE OR REPLACE FUNCTION get_setting_value(p_setting_key TEXT)
RETURNS TEXT AS $$
DECLARE
  v_value TEXT;
BEGIN
  SELECT setting_value INTO v_value
  FROM system_settings
  WHERE setting_key = p_setting_key;

  RETURN v_value;
END;
$$ LANGUAGE plpgsql;

-- Function to get system settings statistics
CREATE OR REPLACE FUNCTION get_system_settings_statistics()
RETURNS TABLE (
  total_settings INTEGER,
  editable_settings INTEGER,
  categories_count INTEGER,
  last_updated TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER AS total_settings,
    COUNT(*) FILTER (WHERE is_editable = TRUE)::INTEGER AS editable_settings,
    COUNT(DISTINCT category)::INTEGER AS categories_count,
    MAX(updated_at) AS last_updated
  FROM system_settings;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_system_settings TO authenticated;
GRANT EXECUTE ON FUNCTION get_system_settings_categories TO authenticated;
GRANT EXECUTE ON FUNCTION update_system_setting TO authenticated;
GRANT EXECUTE ON FUNCTION get_setting_value TO authenticated;
GRANT EXECUTE ON FUNCTION get_system_settings_statistics TO authenticated;

-- Payment Settings System

-- Create payment_gateways table
CREATE TABLE IF NOT EXISTS payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT FALSE,
  api_key_encrypted TEXT, -- Encrypted API key
  secret_key_encrypted TEXT, -- Encrypted secret key
  webhook_url TEXT,
  transaction_fee NUMERIC DEFAULT 0,
  currency TEXT[] DEFAULT ARRAY[]::TEXT[],
  test_mode BOOLEAN DEFAULT TRUE,
  provider_type TEXT, -- 'razorpay', 'stripe', 'paypal', etc.
  configuration JSONB DEFAULT '{}'::jsonb, -- Additional provider-specific config
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create fee_structures table
CREATE TABLE IF NOT EXISTS fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('fixed', 'percentage')),
  value NUMERIC NOT NULL,
  min_amount NUMERIC,
  max_amount NUMERIC,
  applicable_for TEXT[] DEFAULT ARRAY[]::TEXT[], -- e.g., ['courses', 'subscriptions', 'all']
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment_security_settings table
CREATE TABLE IF NOT EXISTS payment_security_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value BOOLEAN DEFAULT FALSE,
  setting_type TEXT NOT NULL CHECK (setting_type IN ('toggle', 'limit', 'threshold')),
  numeric_value NUMERIC, -- For limits and thresholds
  description TEXT,
  category TEXT NOT NULL, -- 'fraud_detection', 'transaction_limits', 'notifications'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample payment gateways
INSERT INTO payment_gateways (name, enabled, api_key_encrypted, secret_key_encrypted, webhook_url, transaction_fee, currency, test_mode, provider_type) VALUES
  ('Razorpay', TRUE, 'rzp_test_***************', '***************', 'https://api.manushi.edu/webhooks/razorpay', 2.3, ARRAY['INR', 'USD'], FALSE, 'razorpay'),
  ('Stripe', TRUE, 'pk_test_***************', 'sk_test_***************', 'https://api.manushi.edu/webhooks/stripe', 2.9, ARRAY['USD', 'EUR', 'GBP'], TRUE, 'stripe'),
  ('PayPal', FALSE, '', '', 'https://api.manushi.edu/webhooks/paypal', 3.4, ARRAY['USD', 'EUR'], TRUE, 'paypal'),
  ('Paytm', FALSE, '', '', 'https://api.manushi.edu/webhooks/paytm', 2.0, ARRAY['INR'], TRUE, 'paytm')
ON CONFLICT (name) DO NOTHING;

-- Insert sample fee structures
INSERT INTO fee_structures (name, type, value, min_amount, max_amount, applicable_for, is_active) VALUES
  ('Course Fee', 'fixed', 5000, NULL, NULL, ARRAY['courses', 'subscriptions'], TRUE),
  ('Processing Fee', 'percentage', 2.5, 10, 500, ARRAY['all'], TRUE),
  ('Late Payment Fee', 'fixed', 100, NULL, NULL, ARRAY['overdue'], TRUE),
  ('Registration Fee', 'fixed', 1000, NULL, NULL, ARRAY['enrollment'], TRUE),
  ('Platform Fee', 'percentage', 1.5, 5, 200, ARRAY['transactions'], TRUE)
ON CONFLICT (id) DO NOTHING;

-- Insert sample security settings
INSERT INTO payment_security_settings (setting_key, setting_value, setting_type, numeric_value, category, description) VALUES
  ('fraud_detection_enabled', TRUE, 'toggle', NULL, 'fraud_detection', 'Enable fraud detection for all transactions'),
  ('velocity_checking_enabled', TRUE, 'toggle', NULL, 'fraud_detection', 'Enable velocity checking to detect rapid transactions'),
  ('daily_transaction_limit', TRUE, 'limit', 100000, 'transaction_limits', 'Maximum daily transaction amount'),
  ('per_transaction_limit', TRUE, 'limit', 50000, 'transaction_limits', 'Maximum amount per transaction'),
  ('failed_payment_alerts', TRUE, 'toggle', NULL, 'notifications', 'Send alerts for failed payments'),
  ('large_transaction_alerts', TRUE, 'toggle', NULL, 'notifications', 'Send alerts for large transactions'),
  ('suspicious_activity_alerts', TRUE, 'toggle', NULL, 'notifications', 'Send alerts for suspicious activity'),
  ('minimum_transaction_threshold', TRUE, 'threshold', 1, 'transaction_limits', 'Minimum transaction amount')
ON CONFLICT (setting_key) DO NOTHING;

-- Function to get payment gateways
CREATE OR REPLACE FUNCTION get_payment_gateways()
RETURNS TABLE (
  id UUID,
  name TEXT,
  enabled BOOLEAN,
  api_key TEXT,
  secret_key TEXT,
  webhook_url TEXT,
  transaction_fee NUMERIC,
  currency TEXT[],
  test_mode BOOLEAN,
  provider_type TEXT,
  configuration JSONB,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pg.id,
    pg.name,
    pg.enabled,
    pg.api_key_encrypted AS api_key,
    pg.secret_key_encrypted AS secret_key,
    pg.webhook_url,
    pg.transaction_fee,
    pg.currency,
    pg.test_mode,
    pg.provider_type,
    pg.configuration,
    pg.updated_at
  FROM payment_gateways pg
  ORDER BY pg.name;
END;
$$ LANGUAGE plpgsql;

-- Function to get fee structures
CREATE OR REPLACE FUNCTION get_fee_structures()
RETURNS TABLE (
  id UUID,
  name TEXT,
  type TEXT,
  value NUMERIC,
  min_amount NUMERIC,
  max_amount NUMERIC,
  applicable_for TEXT[],
  is_active BOOLEAN,
  description TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    fs.id,
    fs.name,
    fs.type,
    fs.value,
    fs.min_amount,
    fs.max_amount,
    fs.applicable_for,
    fs.is_active,
    fs.description,
    fs.created_at
  FROM fee_structures fs
  ORDER BY fs.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get security settings by category
CREATE OR REPLACE FUNCTION get_payment_security_settings(p_category TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  setting_key TEXT,
  setting_value BOOLEAN,
  setting_type TEXT,
  numeric_value NUMERIC,
  description TEXT,
  category TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pss.id,
    pss.setting_key,
    pss.setting_value,
    pss.setting_type,
    pss.numeric_value,
    pss.description,
    pss.category
  FROM payment_security_settings pss
  WHERE (p_category IS NULL OR pss.category = p_category)
  ORDER BY pss.category, pss.setting_key;
END;
$$ LANGUAGE plpgsql;

-- Function to get payment settings statistics
CREATE OR REPLACE FUNCTION get_payment_settings_statistics()
RETURNS TABLE (
  total_gateways INTEGER,
  enabled_gateways INTEGER,
  test_mode_gateways INTEGER,
  total_fee_structures INTEGER,
  active_fee_structures INTEGER,
  total_security_settings INTEGER,
  enabled_security_features INTEGER,
  average_transaction_fee NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER AS total_gateways,
    COUNT(*) FILTER (WHERE enabled = TRUE)::INTEGER AS enabled_gateways,
    COUNT(*) FILTER (WHERE test_mode = TRUE)::INTEGER AS test_mode_gateways,
    (SELECT COUNT(*)::INTEGER FROM fee_structures) AS total_fee_structures,
    (SELECT COUNT(*) FILTER (WHERE is_active = TRUE)::INTEGER FROM fee_structures) AS active_fee_structures,
    (SELECT COUNT(*)::INTEGER FROM payment_security_settings) AS total_security_settings,
    (SELECT COUNT(*) FILTER (WHERE setting_value = TRUE)::INTEGER FROM payment_security_settings WHERE setting_type = 'toggle') AS enabled_security_features,
    COALESCE(AVG(transaction_fee), 0)::NUMERIC AS average_transaction_fee
  FROM payment_gateways;
END;
$$ LANGUAGE plpgsql;

-- Function to update payment gateway
CREATE OR REPLACE FUNCTION update_payment_gateway(
  p_gateway_id UUID,
  p_enabled BOOLEAN DEFAULT NULL,
  p_test_mode BOOLEAN DEFAULT NULL,
  p_api_key TEXT DEFAULT NULL,
  p_webhook_url TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE payment_gateways
  SET
    enabled = COALESCE(p_enabled, enabled),
    test_mode = COALESCE(p_test_mode, test_mode),
    api_key_encrypted = COALESCE(p_api_key, api_key_encrypted),
    webhook_url = COALESCE(p_webhook_url, webhook_url),
    updated_at = NOW()
  WHERE id = p_gateway_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to update security setting
CREATE OR REPLACE FUNCTION update_security_setting(
  p_setting_key TEXT,
  p_setting_value BOOLEAN DEFAULT NULL,
  p_numeric_value NUMERIC DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE payment_security_settings
  SET
    setting_value = COALESCE(p_setting_value, setting_value),
    numeric_value = COALESCE(p_numeric_value, numeric_value),
    updated_at = NOW()
  WHERE setting_key = p_setting_key;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_payment_gateways TO authenticated;
GRANT EXECUTE ON FUNCTION get_fee_structures TO authenticated;
GRANT EXECUTE ON FUNCTION get_payment_security_settings TO authenticated;
GRANT EXECUTE ON FUNCTION get_payment_settings_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION update_payment_gateway TO authenticated;
GRANT EXECUTE ON FUNCTION update_security_setting TO authenticated;

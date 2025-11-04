-- Financial Reports RPC Functions
-- Phase 2: Production-grade financial data aggregation
-- Created: 2025-11-01

-- ============================================================================
-- FUNCTION 1: get_financial_metrics
-- Purpose: Calculate key financial metrics with period-over-period comparison
-- ============================================================================

CREATE OR REPLACE FUNCTION get_financial_metrics(
  p_period_type TEXT DEFAULT 'monthly',
  p_currency TEXT DEFAULT 'INR',
  p_start_date TIMESTAMPTZ DEFAULT NULL,
  p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  metric_type TEXT,
  amount NUMERIC,
  currency TEXT,
  change_percentage NUMERIC,
  change_type TEXT,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_start TIMESTAMPTZ;
  v_current_end TIMESTAMPTZ;
  v_previous_start TIMESTAMPTZ;
  v_previous_end TIMESTAMPTZ;
  v_current_revenue NUMERIC;
  v_previous_revenue NUMERIC;
  v_current_subscriptions NUMERIC;
  v_previous_subscriptions NUMERIC;
  v_current_expenses NUMERIC;
  v_previous_expenses NUMERIC;
BEGIN
  -- Calculate date ranges based on period type
  IF p_start_date IS NULL OR p_end_date IS NULL THEN
    CASE p_period_type
      WHEN 'monthly' THEN
        v_current_end := DATE_TRUNC('month', NOW());
        v_current_start := v_current_end - INTERVAL '1 month';
        v_previous_end := v_current_start;
        v_previous_start := v_previous_end - INTERVAL '1 month';
      WHEN 'quarterly' THEN
        v_current_end := DATE_TRUNC('quarter', NOW());
        v_current_start := v_current_end - INTERVAL '3 months';
        v_previous_end := v_current_start;
        v_previous_start := v_previous_end - INTERVAL '3 months';
      WHEN 'yearly' THEN
        v_current_end := DATE_TRUNC('year', NOW());
        v_current_start := v_current_end - INTERVAL '1 year';
        v_previous_end := v_current_start;
        v_previous_start := v_previous_end - INTERVAL '1 year';
      ELSE
        v_current_end := NOW();
        v_current_start := v_current_end - INTERVAL '1 month';
        v_previous_end := v_current_start;
        v_previous_start := v_previous_end - INTERVAL '1 month';
    END CASE;
  ELSE
    v_current_start := p_start_date;
    v_current_end := p_end_date;
    v_previous_start := v_current_start - (v_current_end - v_current_start);
    v_previous_end := v_current_start;
  END IF;

  -- Calculate current period revenue
  -- NOTE: This assumes a 'payments' table exists with columns: amount, status, created_at
  -- Adjust table/column names based on your actual schema
  SELECT COALESCE(SUM(p.amount), 0)
  INTO v_current_revenue
  FROM payments p
  WHERE p.created_at >= v_current_start
    AND p.created_at < v_current_end
    AND p.status = 'completed';

  -- Calculate previous period revenue
  SELECT COALESCE(SUM(p.amount), 0)
  INTO v_previous_revenue
  FROM payments p
  WHERE p.created_at >= v_previous_start
    AND p.created_at < v_previous_end
    AND p.status = 'completed';

  -- Calculate current period subscriptions (use total revenue for now)
  -- NOTE: If you have a way to identify subscription payments, add the filter here
  v_current_subscriptions := v_current_revenue;

  -- Calculate previous period subscriptions (use total revenue for now)
  v_previous_subscriptions := v_previous_revenue;

  -- Calculate current period expenses
  -- NOTE: Set to 0 if expenses table doesn't exist
  -- You can track expenses in a dedicated table later
  BEGIN
    SELECT COALESCE(SUM(e.amount), 0)
    INTO v_current_expenses
    FROM expenses e
    WHERE e.created_at >= v_current_start
      AND e.created_at < v_current_end;
  EXCEPTION
    WHEN undefined_table THEN
      v_current_expenses := 0;
  END;

  -- Calculate previous period expenses
  BEGIN
    SELECT COALESCE(SUM(e.amount), 0)
    INTO v_previous_expenses
    FROM expenses e
    WHERE e.created_at >= v_previous_start
      AND e.created_at < v_previous_end;
  EXCEPTION
    WHEN undefined_table THEN
      v_previous_expenses := 0;
  END;

  -- Return revenue metric
  RETURN QUERY
  SELECT
    'revenue'::TEXT,
    v_current_revenue,
    p_currency,
    CASE
      WHEN v_previous_revenue = 0 THEN
        CASE WHEN v_current_revenue > 0 THEN 100.0 ELSE 0.0 END
      ELSE
        ((v_current_revenue - v_previous_revenue) / v_previous_revenue * 100)
    END,
    CASE
      WHEN v_current_revenue > v_previous_revenue THEN 'increase'
      WHEN v_current_revenue < v_previous_revenue THEN 'decrease'
      ELSE 'neutral'
    END::TEXT,
    v_current_start,
    v_current_end;

  -- Return subscriptions metric
  RETURN QUERY
  SELECT
    'subscriptions'::TEXT,
    v_current_subscriptions,
    p_currency,
    CASE
      WHEN v_previous_subscriptions = 0 THEN
        CASE WHEN v_current_subscriptions > 0 THEN 100.0 ELSE 0.0 END
      ELSE
        ((v_current_subscriptions - v_previous_subscriptions) / v_previous_subscriptions * 100)
    END,
    CASE
      WHEN v_current_subscriptions > v_previous_subscriptions THEN 'increase'
      WHEN v_current_subscriptions < v_previous_subscriptions THEN 'decrease'
      ELSE 'neutral'
    END::TEXT,
    v_current_start,
    v_current_end;

  -- Return expenses metric
  RETURN QUERY
  SELECT
    'expenses'::TEXT,
    v_current_expenses,
    p_currency,
    CASE
      WHEN v_previous_expenses = 0 THEN
        CASE WHEN v_current_expenses > 0 THEN 100.0 ELSE 0.0 END
      ELSE
        ((v_current_expenses - v_previous_expenses) / v_previous_expenses * 100)
    END,
    CASE
      WHEN v_current_expenses > v_previous_expenses THEN 'increase'
      WHEN v_current_expenses < v_previous_expenses THEN 'decrease'
      ELSE 'neutral'
    END::TEXT,
    v_current_start,
    v_current_end;

  -- Return profit metric (revenue - expenses)
  RETURN QUERY
  SELECT
    'profit'::TEXT,
    (v_current_revenue - v_current_expenses),
    p_currency,
    CASE
      WHEN (v_previous_revenue - v_previous_expenses) = 0 THEN
        CASE WHEN (v_current_revenue - v_current_expenses) > 0 THEN 100.0 ELSE 0.0 END
      ELSE
        (((v_current_revenue - v_current_expenses) - (v_previous_revenue - v_previous_expenses)) / (v_previous_revenue - v_previous_expenses) * 100)
    END,
    CASE
      WHEN (v_current_revenue - v_current_expenses) > (v_previous_revenue - v_previous_expenses) THEN 'increase'
      WHEN (v_current_revenue - v_current_expenses) < (v_previous_revenue - v_previous_expenses) THEN 'decrease'
      ELSE 'neutral'
    END::TEXT,
    v_current_start,
    v_current_end;
END;
$$;

-- ============================================================================
-- FUNCTION 2: get_revenue_breakdown
-- Purpose: Break down revenue by branch and class over time
-- ============================================================================

CREATE OR REPLACE FUNCTION get_revenue_breakdown(
  p_period_type TEXT DEFAULT 'monthly',
  p_currency TEXT DEFAULT 'INR',
  p_branch_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  branch_id UUID,
  branch_name TEXT,
  class_id UUID,
  class_name TEXT,
  revenue NUMERIC,
  expenses NUMERIC,
  profit NUMERIC,
  period TEXT,
  currency TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_start_date TIMESTAMPTZ;
  v_end_date TIMESTAMPTZ;
  v_months_back INT;
BEGIN
  -- Determine time range based on period type
  CASE p_period_type
    WHEN 'monthly' THEN
      v_months_back := 3; -- Last 3 months
    WHEN 'quarterly' THEN
      v_months_back := 12; -- Last 4 quarters
    WHEN 'yearly' THEN
      v_months_back := 36; -- Last 3 years
    ELSE
      v_months_back := 3;
  END CASE;

  v_end_date := NOW();
  v_start_date := v_end_date - (v_months_back || ' months')::INTERVAL;

  -- Return aggregated revenue breakdown
  -- NOTE: If branches table doesn't exist, return payments grouped by month only
  BEGIN
    RETURN QUERY
    SELECT
      gen_random_uuid() AS id,
      b.id AS branch_id,
      b.name AS branch_name,
      NULL::UUID AS class_id,
      NULL::TEXT AS class_name,
      COALESCE(SUM(p.amount), 0) AS revenue,
      0::NUMERIC AS expenses,
      COALESCE(SUM(p.amount), 0) AS profit,
      COALESCE(TO_CHAR(DATE_TRUNC('month', p.created_at), 'Mon YYYY'), 'No Data') AS period,
      p_currency
    FROM branches b
    LEFT JOIN payments p ON p.branch_id = b.id
      AND p.created_at >= v_start_date
      AND p.created_at < v_end_date
      AND p.status = 'completed'
    WHERE (p_branch_id IS NULL OR b.id = p_branch_id)
    GROUP BY b.id, b.name, DATE_TRUNC('month', p.created_at)
    ORDER BY DATE_TRUNC('month', p.created_at) DESC, b.name;
  EXCEPTION
    WHEN undefined_table THEN
      -- If branches table doesn't exist, return simple payment breakdown by month
      RETURN QUERY
      SELECT
        gen_random_uuid() AS id,
        NULL::UUID AS branch_id,
        'All Branches'::TEXT AS branch_name,
        NULL::UUID AS class_id,
        NULL::TEXT AS class_name,
        COALESCE(SUM(p.amount), 0) AS revenue,
        0::NUMERIC AS expenses,
        COALESCE(SUM(p.amount), 0) AS profit,
        COALESCE(TO_CHAR(DATE_TRUNC('month', p.created_at), 'Mon YYYY'), 'No Data') AS period,
        p_currency
      FROM payments p
      WHERE p.created_at >= v_start_date
        AND p.created_at < v_end_date
        AND p.status = 'completed'
      GROUP BY DATE_TRUNC('month', p.created_at)
      ORDER BY DATE_TRUNC('month', p.created_at) DESC;
  END;
END;
$$;

-- ============================================================================
-- FUNCTION 3: get_outstanding_dues
-- Purpose: Calculate outstanding and overdue payment amounts
-- ============================================================================

CREATE OR REPLACE FUNCTION get_outstanding_dues(
  p_currency TEXT DEFAULT 'INR'
)
RETURNS TABLE (
  total_due NUMERIC,
  overdue_count INT,
  overdue_amount NUMERIC,
  currency TEXT,
  by_class JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_due NUMERIC;
  v_overdue_count INT;
  v_overdue_amount NUMERIC;
  v_by_class JSONB;
BEGIN
  -- Calculate total outstanding dues
  -- NOTE: Returns 0 if fee_payments table doesn't exist
  -- Create fee_payments table to track outstanding dues
  BEGIN
    SELECT COALESCE(SUM(fp.amount), 0)
    INTO v_total_due
    FROM fee_payments fp
    WHERE fp.status IN ('pending', 'overdue');
  EXCEPTION
    WHEN undefined_table THEN
      v_total_due := 0;
  END;

  -- Calculate overdue count and amount
  BEGIN
    SELECT
      COUNT(*),
      COALESCE(SUM(fp.amount), 0)
    INTO v_overdue_count, v_overdue_amount
    FROM fee_payments fp
    WHERE fp.status = 'overdue'
      AND fp.due_date < NOW();
  EXCEPTION
    WHEN undefined_table THEN
      v_overdue_count := 0;
      v_overdue_amount := 0;
  END;

  -- Calculate breakdown by class
  BEGIN
    SELECT COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'class_id', c.id,
          'class_name', c.name,
          'amount', class_dues.total_amount,
          'student_count', class_dues.student_count
        )
      ),
      '[]'::jsonb
    )
    INTO v_by_class
    FROM (
      SELECT
        fp.class_id,
        SUM(fp.amount) AS total_amount,
        COUNT(DISTINCT fp.student_id) AS student_count
      FROM fee_payments fp
      WHERE fp.status IN ('pending', 'overdue')
      GROUP BY fp.class_id
      ORDER BY SUM(fp.amount) DESC
      LIMIT 10
    ) AS class_dues
    LEFT JOIN classes c ON c.id = class_dues.class_id;
  EXCEPTION
    WHEN undefined_table THEN
      v_by_class := '[]'::jsonb;
  END;

  -- Return results
  RETURN QUERY
  SELECT
    v_total_due,
    v_overdue_count,
    v_overdue_amount,
    p_currency,
    v_by_class;
END;
$$;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_financial_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION get_revenue_breakdown TO authenticated;
GRANT EXECUTE ON FUNCTION get_outstanding_dues TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION get_financial_metrics IS 'Calculate key financial metrics with period-over-period comparison for admin financial reports';
COMMENT ON FUNCTION get_revenue_breakdown IS 'Break down revenue by branch and class over time for detailed financial analysis';
COMMENT ON FUNCTION get_outstanding_dues IS 'Calculate outstanding and overdue payment amounts with breakdown by class';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- NOTE: Minimal schema requirements
--
-- REQUIRED TABLE (must exist):
--   - payments (with columns: id, amount, status, created_at)
--
-- OPTIONAL TABLES (graceful degradation if missing):
--   - branches (with columns: id, name) - enables branch breakdown
--   - expenses (with columns: amount, created_at) - enables expense tracking
--   - fee_payments (with columns: amount, status, due_date) - enables dues tracking
--   - classes (with columns: id, name) - enables class-level breakdown
--
-- All functions use exception handling to work even if optional tables are missing.
-- Missing tables return 0 or empty results instead of errors.

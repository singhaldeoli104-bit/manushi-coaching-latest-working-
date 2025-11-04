-- ============================================================================
-- SPRINT 0 MIGRATION VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify all migrations were applied successfully
-- ============================================================================

-- 1. VERIFY FINANCIAL RPC FUNCTIONS EXIST
-- ============================================================================
SELECT
  proname as function_name,
  pronargs as arg_count
FROM pg_proc
WHERE proname IN ('get_financial_metrics', 'get_revenue_breakdown', 'get_outstanding_dues')
ORDER BY proname;
-- Expected: 3 functions

-- 2. TEST FINANCIAL METRICS FUNCTION
-- ============================================================================
SELECT * FROM get_financial_metrics('monthly', 'INR', NULL, NULL);
-- Expected: 4 rows (revenue, subscriptions, expenses, profit)

-- 3. VERIFY AUDIT LOG PARTITIONS EXIST
-- ============================================================================
SELECT
  c.relname as partition_name,
  pg_size_pretty(pg_table_size(c.oid)) as size
FROM pg_class c
JOIN pg_inherits i ON c.oid = i.inhrelid
JOIN pg_class p ON p.oid = i.inhparent
WHERE p.relname = 'audit_logs'
ORDER BY c.relname;
-- Expected: 12 partitions (audit_logs_2025_01 through audit_logs_2025_12)

-- 4. VERIFY RLS IS ENABLED
-- ============================================================================
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'payments', 'audit_logs', 'fee_payments', 'expenses')
ORDER BY tablename;
-- Expected: All tables with rowsecurity = true (only if they exist)

-- 5. VERIFY RLS POLICIES EXIST
-- ============================================================================
SELECT
  tablename,
  policyname,
  cmd as operation
FROM pg_policies
WHERE tablename IN ('profiles', 'payments', 'audit_logs')
ORDER BY tablename, policyname;
-- Expected: Multiple policies per table

-- 6. TEST RLS - DIRECT WRITE SHOULD FAIL
-- ============================================================================
-- This query SHOULD return an error (that's correct!)
-- Uncomment to test:
-- INSERT INTO payments (id, amount, status, created_at)
-- VALUES (gen_random_uuid(), 100, 'completed', NOW());
-- Expected: ERROR: new row violates row-level security policy

-- 7. VERIFY KEYSET PAGINATION FUNCTIONS EXIST
-- ============================================================================
SELECT
  proname as function_name,
  pronargs as arg_count
FROM pg_proc
WHERE proname IN ('get_payments_keyset', 'get_audit_logs_keyset')
ORDER BY proname;
-- Expected: Up to 2 functions (depending on which tables exist)

-- 8. VERIFY KEYSET INDEXES EXIST
-- ============================================================================
SELECT
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE indexname LIKE '%_keyset'
ORDER BY tablename, indexname;
-- Expected: At least idx_payments_keyset, idx_audit_logs_keyset

-- 9. TEST KEYSET PAGINATION (if payments table exists)
-- ============================================================================
-- Uncomment if you have payment data:
-- SELECT * FROM get_payments_keyset(5, NULL, NULL, NULL);
-- Expected: Up to 5 payment records with cursor fields

-- 10. OVERALL HEALTH CHECK
-- ============================================================================
SELECT
  'Functions' as check_type,
  COUNT(*) as count,
  'Expected: 3 financial + 0-2 keyset = 3-5 total' as expected
FROM pg_proc
WHERE proname IN (
  'get_financial_metrics',
  'get_revenue_breakdown',
  'get_outstanding_dues',
  'get_payments_keyset',
  'get_audit_logs_keyset'
)

UNION ALL

SELECT
  'Partitions' as check_type,
  COUNT(*) as count,
  'Expected: 12 (monthly 2025 partitions)' as expected
FROM pg_class c
JOIN pg_inherits i ON c.oid = i.inhrelid
JOIN pg_class p ON p.oid = i.inhparent
WHERE p.relname = 'audit_logs'

UNION ALL

SELECT
  'RLS Policies' as check_type,
  COUNT(*) as count,
  'Expected: 10+ (depends on tables)' as expected
FROM pg_policies
WHERE tablename IN ('profiles', 'payments', 'audit_logs')

UNION ALL

SELECT
  'Keyset Indexes' as check_type,
  COUNT(*) as count,
  'Expected: 2+ (payments, audit_logs)' as expected
FROM pg_indexes
WHERE indexname LIKE '%_keyset';

-- ============================================================================
-- SUCCESS CRITERIA
-- ============================================================================
-- ✅ 3-5 functions created
-- ✅ 12 audit log partitions
-- ✅ 10+ RLS policies
-- ✅ 2+ keyset indexes
-- ✅ Direct writes to secured tables blocked
-- ✅ Financial metrics function returns data

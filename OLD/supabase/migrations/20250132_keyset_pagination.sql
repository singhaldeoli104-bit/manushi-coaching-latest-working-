/**
 * Keyset Pagination Migration - Sprint 1: Performance Foundation (Simplified)
 *
 * Purpose: Replace OFFSET pagination with cursor-based keyset pagination
 * - Better performance (no table scans with large offsets)
 * - Consistent results (no duplicate/missing rows)
 * - Scalable (performance doesn't degrade with pagination depth)
 *
 * Implementation:
 * - RPC functions for keyset pagination
 * - Composite indexes for (timestamp, id) ordering
 * - +1 fetch pattern to determine hasMore
 *
 * Note: This migration only creates pagination for tables that exist.
 * Extend this as you add users, tickets, and other tables.
 */

-- ============================================================================
-- 1. CREATE COMPOSITE INDEXES FOR KEYSET PAGINATION (IF TABLES EXIST)
-- ============================================================================

DO $$
BEGIN
  -- Payments table keyset index
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payments') THEN
    CREATE INDEX IF NOT EXISTS idx_payments_keyset ON payments(created_at DESC, id DESC);
    RAISE NOTICE 'Created keyset index on payments';
  END IF;

  -- Audit logs table keyset index
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'audit_logs') THEN
    CREATE INDEX IF NOT EXISTS idx_audit_logs_keyset ON audit_logs(created_at DESC, id DESC);
    RAISE NOTICE 'Created keyset index on audit_logs';
  END IF;

  -- Users table (when it exists)
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
    CREATE INDEX IF NOT EXISTS idx_users_keyset ON users(created_at DESC, id DESC);
    CREATE INDEX IF NOT EXISTS idx_users_status_keyset ON users(status, created_at DESC, id DESC)
      WHERE status IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_users_role_keyset ON users(role, created_at DESC, id DESC)
      WHERE role IS NOT NULL;
    RAISE NOTICE 'Created keyset indexes on users';
  ELSE
    RAISE NOTICE 'Skipping users keyset indexes - table does not exist';
  END IF;

  -- Support tickets table (when it exists)
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'support_tickets') THEN
    CREATE INDEX IF NOT EXISTS idx_support_tickets_keyset ON support_tickets(created_at DESC, id DESC);
    CREATE INDEX IF NOT EXISTS idx_tickets_status_keyset ON support_tickets(status, created_at DESC, id DESC)
      WHERE status IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_tickets_priority_keyset ON support_tickets(priority, created_at DESC, id DESC)
      WHERE priority IS NOT NULL;
    RAISE NOTICE 'Created keyset indexes on support_tickets';
  ELSE
    RAISE NOTICE 'Skipping support_tickets keyset indexes - table does not exist';
  END IF;
END $$;

-- ============================================================================
-- 2. PAYMENTS KEYSET PAGINATION RPC (IF TABLE EXISTS)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payments') THEN
    EXECUTE '
      CREATE OR REPLACE FUNCTION get_payments_keyset(
        p_limit INT DEFAULT 50,
        p_cursor TIMESTAMPTZ DEFAULT NULL,
        p_cursor_id UUID DEFAULT NULL,
        p_status TEXT DEFAULT NULL
      )
      RETURNS TABLE (
        id UUID,
        amount NUMERIC,
        status TEXT,
        created_at TIMESTAMPTZ,
        -- Cursor fields for next page
        next_cursor TIMESTAMPTZ,
        next_cursor_id UUID
      )
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $func$
      BEGIN
        RETURN QUERY
        SELECT
          p.id,
          p.amount,
          p.status,
          p.created_at,
          -- Return same timestamp/id for cursor
          p.created_at as next_cursor,
          p.id as next_cursor_id
        FROM payments p
        WHERE
          -- Keyset pagination clause
          (p_cursor IS NULL OR (p.created_at, p.id) < (p_cursor, p_cursor_id))
          -- Status filter
          AND (p_status IS NULL OR p.status = p_status)
        ORDER BY p.created_at DESC, p.id DESC
        LIMIT p_limit + 1; -- +1 to check if there are more results
      END;
      $func$;

      GRANT EXECUTE ON FUNCTION get_payments_keyset TO authenticated;
      COMMENT ON FUNCTION get_payments_keyset IS ''Keyset pagination for payments with cursor support'';
    ';
    RAISE NOTICE 'Created get_payments_keyset function';
  ELSE
    RAISE NOTICE 'Skipping get_payments_keyset - payments table does not exist';
  END IF;
END $$;

-- ============================================================================
-- 3. AUDIT LOGS KEYSET PAGINATION RPC (IF TABLE EXISTS)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'audit_logs') THEN
    EXECUTE '
      CREATE OR REPLACE FUNCTION get_audit_logs_keyset(
        p_limit INT DEFAULT 50,
        p_cursor TIMESTAMPTZ DEFAULT NULL,
        p_cursor_id UUID DEFAULT NULL,
        p_admin_id UUID DEFAULT NULL,
        p_action TEXT DEFAULT NULL
      )
      RETURNS TABLE (
        id UUID,
        admin_id UUID,
        action TEXT,
        target_id UUID,
        target_type TEXT,
        changes JSONB,
        metadata JSONB,
        created_at TIMESTAMPTZ,
        -- Cursor fields
        next_cursor TIMESTAMPTZ,
        next_cursor_id UUID
      )
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $func$
      BEGIN
        RETURN QUERY
        SELECT
          a.id,
          a.admin_id,
          a.action,
          a.target_id,
          a.target_type,
          a.changes,
          a.metadata,
          a.created_at,
          -- Cursor fields
          a.created_at as next_cursor,
          a.id as next_cursor_id
        FROM audit_logs a
        WHERE
          -- Keyset pagination clause
          (p_cursor IS NULL OR (a.created_at, a.id) < (p_cursor, p_cursor_id))
          -- Admin filter
          AND (p_admin_id IS NULL OR a.admin_id = p_admin_id)
          -- Action filter
          AND (p_action IS NULL OR a.action = p_action)
        ORDER BY a.created_at DESC, a.id DESC
        LIMIT p_limit + 1;
      END;
      $func$;

      GRANT EXECUTE ON FUNCTION get_audit_logs_keyset TO authenticated;
      COMMENT ON FUNCTION get_audit_logs_keyset IS ''Keyset pagination for audit logs with filters'';
    ';
    RAISE NOTICE 'Created get_audit_logs_keyset function';
  ELSE
    RAISE NOTICE 'Skipping get_audit_logs_keyset - audit_logs table does not exist';
  END IF;
END $$;

-- ============================================================================
-- PERFORMANCE TESTING QUERIES
-- ============================================================================

-- Test payments keyset pagination (if table exists)
-- EXPLAIN ANALYZE
-- SELECT * FROM get_payments_keyset(50, NULL, NULL, NULL);

-- Test audit logs keyset pagination (if table exists)
-- EXPLAIN ANALYZE
-- SELECT * FROM get_audit_logs_keyset(50, NULL, NULL, NULL, NULL);

-- Compare with traditional OFFSET (should be slower with large offsets)
-- EXPLAIN ANALYZE
-- SELECT * FROM payments ORDER BY created_at DESC, id DESC OFFSET 10000 LIMIT 50;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- 1. Check indexes exist
-- SELECT
--   schemaname,
--   tablename,
--   indexname,
--   indexdef
-- FROM pg_indexes
-- WHERE indexname LIKE '%_keyset'
-- ORDER BY tablename, indexname;

-- 2. Test payments pagination (if table exists)
-- SELECT * FROM get_payments_keyset(5, NULL, NULL, NULL);

-- 3. Test audit logs pagination (if table exists)
-- SELECT * FROM get_audit_logs_keyset(5, NULL, NULL, NULL, NULL);

-- ============================================================================
-- NOTES
-- ============================================================================

/**
 * Keyset Pagination Pattern:
 *
 * 1. First page: cursor = NULL, cursor_id = NULL
 * 2. Client receives N+1 results
 * 3. If results.length > limit, hasMore = true
 * 4. Take first N results, discard the +1
 * 5. Use last row's (created_at, id) as cursor for next page
 *
 * Example React Query usage:
 *
 * const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
 *   queryKey: ['payments', filters],
 *   queryFn: async ({ pageParam }) => {
 *     const result = await supabase.rpc('get_payments_keyset', {
 *       p_limit: 50,
 *       p_cursor: pageParam?.cursor,
 *       p_cursor_id: pageParam?.cursor_id,
 *       ...filters
 *     });
 *
 *     const hasMore = result.data.length > 50;
 *     const payments = hasMore ? result.data.slice(0, 50) : result.data;
 *     const nextCursor = hasMore ? {
 *       cursor: result.data[49].next_cursor,
 *       cursor_id: result.data[49].next_cursor_id
 *     } : null;
 *
 *     return { payments, nextCursor, hasMore };
 *   },
 *   getNextPageParam: (lastPage) => lastPage.nextCursor,
 * });
 *
 * Why Keyset > OFFSET:
 * - OFFSET 10000: Postgres must scan 10,000+ rows then discard them
 * - Keyset: Postgres uses index to jump directly to cursor position
 * - Performance: O(1) vs O(n) for large offsets
 * - Consistency: OFFSET can miss/duplicate rows if data changes mid-pagination
 *
 * TO EXTEND FOR NEW TABLES:
 * 1. Add composite index: (created_at DESC, id DESC)
 * 2. Add filtered indexes for common WHERE clauses
 * 3. Create RPC function following the pattern above
 * 4. Grant execute permission to authenticated users
 */

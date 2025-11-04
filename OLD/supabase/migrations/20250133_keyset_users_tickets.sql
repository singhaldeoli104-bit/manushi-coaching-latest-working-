/**
 * Keyset Pagination Extension - Users and Support Tickets
 * Week 1, Days 5-7: Performance Primitives
 *
 * Extends 20250132_keyset_pagination.sql with RPC functions for:
 * - profiles table (users)
 * - support_tickets table (when it exists)
 */

-- ============================================================================
-- 1. PROFILES (USERS) KEYSET PAGINATION RPC
-- ============================================================================

CREATE OR REPLACE FUNCTION get_users_keyset(
  p_limit INT DEFAULT 20,
  p_cursor TIMESTAMPTZ DEFAULT NULL,
  p_cursor_id UUID DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_role TEXT DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_branch_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
  v_users JSONB;
  v_count INT;
  v_has_more BOOLEAN;
BEGIN
  -- Fetch users with filters (p_limit + 1 to check hasMore)
  WITH filtered_users AS (
    SELECT
      p.id,
      p.email,
      p.full_name,
      p.role,
      CASE
        WHEN p.is_active THEN 'active'
        ELSE 'suspended'
      END AS status,
      p.branch_id,
      b.name AS branch_name,
      p.created_at,
      p.updated_at AS last_active
    FROM profiles p
    LEFT JOIN branches b ON p.branch_id = b.id
    WHERE
      -- Keyset cursor filter
      (p_cursor IS NULL OR (p.created_at, p.id) < (p_cursor, p_cursor_id))
      -- Search filter
      AND (
        p_search IS NULL
        OR p.email ILIKE ('%' || p_search || '%')
        OR p.full_name ILIKE ('%' || p_search || '%')
      )
      -- Role filter
      AND (p_role IS NULL OR p.role = p_role)
      -- Status filter
      AND (
        p_status IS NULL
        OR (p_status = 'active' AND p.is_active = TRUE)
        OR (p_status = 'suspended' AND p.is_active = FALSE)
      )
      -- Branch filter
      AND (p_branch_id IS NULL OR p.branch_id = p_branch_id)
    ORDER BY p.created_at DESC, p.id DESC
    LIMIT p_limit + 1
  )
  SELECT COUNT(*) INTO v_count FROM filtered_users;

  -- Determine if there are more results
  v_has_more := v_count > p_limit;

  -- Get the paginated results (first p_limit rows)
  WITH paginated AS (
    SELECT * FROM filtered_users LIMIT p_limit
  )
  SELECT COALESCE(JSONB_AGG(
    JSONB_BUILD_OBJECT(
      'id', id,
      'email', email,
      'full_name', full_name,
      'role', role,
      'status', status,
      'branch_id', branch_id,
      'branch_name', branch_name,
      'created_at', created_at,
      'last_active', last_active
    )
  ), '[]') INTO v_users FROM paginated;

  -- Build response with nextCursor
  v_result := JSONB_BUILD_OBJECT(
    'users', v_users,
    'hasMore', v_has_more,
    'nextCursor', CASE
      WHEN v_has_more THEN (
        SELECT JSONB_BUILD_OBJECT(
          'cursor', (SELECT created_at FROM filtered_users ORDER BY created_at DESC, id DESC LIMIT 1 OFFSET p_limit - 1),
          'cursor_id', (SELECT id FROM filtered_users ORDER BY created_at DESC, id DESC LIMIT 1 OFFSET p_limit - 1)
        )
      )
      ELSE NULL
    END
  );

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_users_keyset TO authenticated;
GRANT EXECUTE ON FUNCTION get_users_keyset TO anon;

COMMENT ON FUNCTION get_users_keyset IS 'Keyset pagination for users with search, role, status, branch filters';

-- ============================================================================
-- 2. SUPPORT TICKETS KEYSET PAGINATION RPC (IF TABLE EXISTS)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'support_tickets') THEN
    EXECUTE $func$
      CREATE OR REPLACE FUNCTION get_support_tickets_keyset(
        p_limit INT DEFAULT 20,
        p_cursor TIMESTAMPTZ DEFAULT NULL,
        p_cursor_id UUID DEFAULT NULL,
        p_status TEXT DEFAULT NULL,
        p_priority TEXT DEFAULT NULL,
        p_category TEXT DEFAULT NULL,
        p_assigned_to_id UUID DEFAULT NULL,
        p_created_by_id UUID DEFAULT NULL,
        p_branch_id UUID DEFAULT NULL,
        p_search TEXT DEFAULT NULL,
        p_is_unassigned BOOLEAN DEFAULT NULL,
        p_is_my_tickets BOOLEAN DEFAULT NULL,
        p_my_admin_id UUID DEFAULT NULL,
        p_is_sla_breach_risk BOOLEAN DEFAULT NULL
      )
      RETURNS JSONB
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $inner$
      DECLARE
        v_result JSONB;
        v_tickets JSONB;
        v_count INT;
        v_has_more BOOLEAN;
      BEGIN
        -- Fetch tickets with filters (p_limit + 1 to check hasMore)
        WITH filtered_tickets AS (
          SELECT
            st.id,
            st.subject,
            st.status,
            st.priority,
            st.category,
            st.created_by_id,
            cp.full_name AS created_by_name,
            st.assigned_to_id,
            ap.full_name AS assigned_to_name,
            st.created_at,
            st.updated_at,
            st.first_response_at,
            st.resolved_at,
            st.sla_breach_at,
            CASE
              WHEN st.sla_breach_at IS NOT NULL AND st.sla_breach_at < NOW() THEN TRUE
              ELSE FALSE
            END AS is_sla_breached,
            EXTRACT(EPOCH FROM (st.first_response_at - st.created_at)) / 60 AS time_to_first_response,
            EXTRACT(EPOCH FROM (st.resolved_at - st.created_at)) / 60 AS time_to_resolution
          FROM support_tickets st
          LEFT JOIN profiles cp ON st.created_by_id = cp.id
          LEFT JOIN profiles ap ON st.assigned_to_id = ap.id
          WHERE
            -- Keyset cursor filter
            (p_cursor IS NULL OR (st.created_at, st.id) < (p_cursor, p_cursor_id))
            AND (p_status IS NULL OR st.status = p_status)
            AND (p_priority IS NULL OR st.priority = p_priority)
            AND (p_category IS NULL OR st.category = p_category)
            AND (p_assigned_to_id IS NULL OR st.assigned_to_id = p_assigned_to_id)
            AND (p_created_by_id IS NULL OR st.created_by_id = p_created_by_id)
            AND (p_branch_id IS NULL OR st.branch_id = p_branch_id)
            AND (p_search IS NULL OR st.subject ILIKE ('%' || p_search || '%'))
            AND (p_is_unassigned IS NULL OR (p_is_unassigned = TRUE AND st.assigned_to_id IS NULL))
            AND (p_is_my_tickets IS NULL OR (p_is_my_tickets = TRUE AND st.assigned_to_id = p_my_admin_id))
            AND (
              p_is_sla_breach_risk IS NULL
              OR (
                p_is_sla_breach_risk = TRUE
                AND st.sla_breach_at IS NOT NULL
                AND st.sla_breach_at > NOW()
                AND st.sla_breach_at < (NOW() + INTERVAL '15 minutes')
              )
            )
          ORDER BY st.created_at DESC, st.id DESC
          LIMIT p_limit + 1
        )
        SELECT COUNT(*) INTO v_count FROM filtered_tickets;

        v_has_more := v_count > p_limit;

        WITH paginated AS (
          SELECT * FROM filtered_tickets LIMIT p_limit
        )
        SELECT COALESCE(JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'id', id,
            'subject', subject,
            'status', status,
            'priority', priority,
            'category', category,
            'created_by_id', created_by_id,
            'created_by_name', created_by_name,
            'assigned_to_id', assigned_to_id,
            'assigned_to_name', assigned_to_name,
            'created_at', created_at,
            'updated_at', updated_at,
            'first_response_at', first_response_at,
            'resolved_at', resolved_at,
            'sla_breach_at', sla_breach_at,
            'is_sla_breached', is_sla_breached,
            'time_to_first_response', time_to_first_response,
            'time_to_resolution', time_to_resolution
          )
        ), '[]') INTO v_tickets FROM paginated;

        v_result := JSONB_BUILD_OBJECT(
          'tickets', v_tickets,
          'hasMore', v_has_more,
          'nextCursor', CASE
            WHEN v_has_more THEN (
              SELECT JSONB_BUILD_OBJECT(
                'cursor', (SELECT created_at FROM filtered_tickets ORDER BY created_at DESC, id DESC LIMIT 1 OFFSET p_limit - 1),
                'cursor_id', (SELECT id FROM filtered_tickets ORDER BY created_at DESC, id DESC LIMIT 1 OFFSET p_limit - 1)
              )
            )
            ELSE NULL
          END
        );

        RETURN v_result;
      END;
      $inner$;

      GRANT EXECUTE ON FUNCTION get_support_tickets_keyset TO authenticated;
      GRANT EXECUTE ON FUNCTION get_support_tickets_keyset TO anon;

      COMMENT ON FUNCTION get_support_tickets_keyset IS 'Keyset pagination for support tickets with comprehensive filters';
    $func$;

    RAISE NOTICE 'Created get_support_tickets_keyset function';
  ELSE
    RAISE NOTICE 'Skipping get_support_tickets_keyset - support_tickets table does not exist';
  END IF;
END $$;

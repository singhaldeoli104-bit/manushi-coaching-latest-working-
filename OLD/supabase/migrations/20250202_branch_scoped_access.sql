/**
 * Sprint 0: Branch-Scoped Access (ABAC) - Attribute-Based Access Control
 *
 * Purpose: Restrict admin access to specific branches
 * - Branch admins only see their assigned branches
 * - Super admins see all branches
 * - Finance admins see assigned branches (financial data)
 *
 * Use Case:
 * - Multi-branch coaching centers
 * - Branch admin for "Downtown" branch should NOT see "Uptown" branch data
 * - Super admin sees ALL branches
 *
 * Tables Affected:
 * - profiles, payments, fee_payments, classes, attendance, support_tickets
 */

-- ============================================================================
-- 1. USER BRANCH ACCESS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_branch_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL,
  access_level TEXT NOT NULL CHECK (access_level IN ('read', 'write', 'admin')),
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, branch_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_branch_access_user ON user_branch_access(user_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_branch_access_branch ON user_branch_access(branch_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_branch_access_expires ON user_branch_access(expires_at) WHERE is_active = true;

-- RLS for user_branch_access table itself
ALTER TABLE user_branch_access ENABLE ROW LEVEL SECURITY;

-- Super admins can see all access grants
CREATE POLICY "super_admin_view_all_access" ON user_branch_access
  FOR SELECT TO authenticated
  USING (has_role('super_admin'));

-- Users can view their own access grants
CREATE POLICY "user_view_own_access" ON user_branch_access
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Block direct writes (manage via RPC)
CREATE POLICY "block_direct_access_writes" ON user_branch_access
  FOR ALL TO authenticated
  USING (false)
  WITH CHECK (false);

-- ============================================================================
-- 2. BRANCH ACCESS FUNCTIONS
-- ============================================================================

/**
 * Check if user has access to a specific branch
 *
 * @param p_user_id - User to check
 * @param p_branch_id - Branch to check access for
 * @param p_required_level - Required access level ('read', 'write', 'admin')
 * @returns BOOLEAN - True if user has access
 */
CREATE OR REPLACE FUNCTION public.has_branch_access(
  p_user_id UUID,
  p_branch_id UUID,
  p_required_level TEXT DEFAULT 'read'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_role TEXT;
  v_has_access BOOLEAN;
BEGIN
  -- Get user role
  SELECT role INTO v_user_role
  FROM profiles
  WHERE id = p_user_id;

  -- Super admins have access to everything
  IF v_user_role = 'super_admin' THEN
    RETURN TRUE;
  END IF;

  -- Check user_branch_access table
  SELECT EXISTS (
    SELECT 1 FROM user_branch_access
    WHERE user_id = p_user_id
    AND branch_id = p_branch_id
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (
      -- Access level hierarchy: admin >= write >= read
      (access_level = 'admin') OR
      (access_level = 'write' AND p_required_level IN ('read', 'write')) OR
      (access_level = 'read' AND p_required_level = 'read')
    )
  ) INTO v_has_access;

  RETURN v_has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

/**
 * Get all branches a user has access to
 *
 * @param p_user_id - User to check
 * @returns TABLE of branch_ids
 */
CREATE OR REPLACE FUNCTION public.get_user_branches(p_user_id UUID)
RETURNS TABLE(branch_id UUID, access_level TEXT) AS $$
DECLARE
  v_user_role TEXT;
BEGIN
  -- Get user role
  SELECT role INTO v_user_role
  FROM profiles
  WHERE id = p_user_id;

  -- Super admins see all branches
  IF v_user_role = 'super_admin' THEN
    RETURN QUERY
    SELECT id, 'admin'::TEXT
    FROM branches;
  ELSE
    -- Return user's assigned branches
    RETURN QUERY
    SELECT uba.branch_id, uba.access_level
    FROM user_branch_access uba
    WHERE uba.user_id = p_user_id
    AND uba.is_active = true
    AND (uba.expires_at IS NULL OR uba.expires_at > NOW());
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

/**
 * Check if user can access any data from a branch
 * Optimized version for RLS policies
 */
CREATE OR REPLACE FUNCTION public.can_access_branch(p_branch_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN has_branch_access(auth.uid(), p_branch_id, 'read');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- 3. UPDATE RLS POLICIES WITH BRANCH SCOPE
-- ============================================================================

-- PROFILES: Add branch scope (if profile has branch_id)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN

    -- Drop old policy
    DROP POLICY IF EXISTS "admin_read_profiles" ON profiles;

    -- New policy with branch scope
    CREATE POLICY "admin_read_profiles" ON profiles
      FOR SELECT TO authenticated
      USING (
        -- Super admins see all
        has_role('super_admin')
        OR
        -- Branch admins see users in their branches
        (
          is_admin()
          AND (
            branch_id IS NULL  -- Users without branch (global users)
            OR can_access_branch(branch_id)
          )
        )
        OR
        -- Users see their own profile
        id = auth.uid()
      );

    RAISE NOTICE 'Updated profiles RLS with branch scope';
  END IF;
END $$;

-- PAYMENTS: Add branch scope
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payments') THEN

    DROP POLICY IF EXISTS "finance_admin_read_all_payments" ON payments;

    CREATE POLICY "finance_admin_read_payments" ON payments
      FOR SELECT TO authenticated
      USING (
        has_role('super_admin')
        OR
        (
          has_permission('view_financials')
          AND (
            branch_id IS NULL
            OR can_access_branch(branch_id)
          )
        )
      );

    RAISE NOTICE 'Updated payments RLS with branch scope';
  END IF;
END $$;

-- FEE_PAYMENTS: Add branch scope
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'fee_payments') THEN

    DROP POLICY IF EXISTS "finance_view_all_payments" ON fee_payments;

    CREATE POLICY "finance_view_payments" ON fee_payments
      FOR SELECT TO authenticated
      USING (
        has_role('super_admin')
        OR
        (
          has_permission('view_financials')
          AND (
            branch_id IS NULL
            OR can_access_branch(branch_id)
          )
        )
        OR
        -- Parents see their own
        (
          parent_id = auth.uid()
          OR student_id IN (
            SELECT id FROM profiles WHERE parent_id = auth.uid()
          )
        )
      );

    RAISE NOTICE 'Updated fee_payments RLS with branch scope';
  END IF;
END $$;

-- CLASSES: Add branch scope
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'classes') THEN

    DROP POLICY IF EXISTS "admin_view_all_classes" ON classes;

    CREATE POLICY "admin_view_classes" ON classes
      FOR SELECT TO authenticated
      USING (
        has_role('super_admin')
        OR
        (
          is_admin()
          AND (
            branch_id IS NULL
            OR can_access_branch(branch_id)
          )
        )
        OR
        -- Teachers see their classes
        teacher_id = auth.uid()
        OR
        -- Students see enrolled classes
        id IN (
          SELECT class_id FROM enrollments
          WHERE student_id = auth.uid()
        )
      );

    RAISE NOTICE 'Updated classes RLS with branch scope';
  END IF;
END $$;

-- ATTENDANCE: Add branch scope
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'attendance') THEN

    DROP POLICY IF EXISTS "admin_view_all_attendance" ON attendance;

    CREATE POLICY "admin_view_attendance" ON attendance
      FOR SELECT TO authenticated
      USING (
        has_role('super_admin')
        OR
        (
          is_admin()
          AND (
            branch_id IS NULL
            OR can_access_branch(branch_id)
          )
        )
        OR
        -- Teachers see their class attendance
        class_id IN (
          SELECT id FROM classes WHERE teacher_id = auth.uid()
        )
        OR
        -- Students see own attendance
        student_id = auth.uid()
      );

    RAISE NOTICE 'Updated attendance RLS with branch scope';
  END IF;
END $$;

-- SUPPORT_TICKETS: Add branch scope
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'support_tickets') THEN

    DROP POLICY IF EXISTS "admin_view_all_tickets" ON support_tickets;

    CREATE POLICY "admin_view_tickets" ON support_tickets
      FOR SELECT TO authenticated
      USING (
        has_role('super_admin')
        OR
        (
          has_permission('view_support')
          AND (
            branch_id IS NULL
            OR can_access_branch(branch_id)
          )
        )
        OR
        -- Users see their own tickets
        created_by = auth.uid()
        OR assigned_to = auth.uid()
      );

    RAISE NOTICE 'Updated support_tickets RLS with branch scope';
  END IF;
END $$;

-- ============================================================================
-- 4. MONITORING & VERIFICATION
-- ============================================================================

-- View to see branch access assignments
CREATE OR REPLACE VIEW public.branch_access_summary AS
SELECT
  u.email as user_email,
  p.role as user_role,
  b.name as branch_name,
  uba.access_level,
  uba.granted_at,
  uba.expires_at,
  CASE
    WHEN uba.expires_at IS NULL THEN 'Never'
    WHEN uba.expires_at > NOW() THEN 'Active'
    ELSE 'Expired'
  END as status
FROM user_branch_access uba
JOIN auth.users u ON u.id = uba.user_id
JOIN profiles p ON p.id = uba.user_id
LEFT JOIN branches b ON b.id = uba.branch_id
WHERE uba.is_active = true
ORDER BY u.email, b.name;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check branch access for a user
-- SELECT * FROM get_user_branches('user-id-here');

-- Check if user can access specific branch
-- SELECT has_branch_access('user-id', 'branch-id', 'read');

-- View all branch access assignments
-- SELECT * FROM branch_access_summary;

-- Test branch-scoped query (as branch admin)
-- SET LOCAL role TO authenticated;
-- SET LOCAL "request.jwt.claims" TO '{"sub": "branch-admin-user-id"}';
-- SELECT * FROM payments;  -- Should only see payments for assigned branches

COMMENT ON TABLE user_branch_access IS 'Sprint 0: Branch-scoped access control (ABAC)';
COMMENT ON FUNCTION has_branch_access IS 'Sprint 0: Check if user can access a branch';
COMMENT ON FUNCTION get_user_branches IS 'Sprint 0: Get all branches a user can access';
COMMENT ON VIEW branch_access_summary IS 'Sprint 0: Monitor branch access assignments';

/**
 * Sprint 0: Complete RLS Policy Implementation
 *
 * Purpose: Complete database security with Row Level Security on ALL tables
 *
 * What's New in This Migration:
 * - Add RLS for support_tickets (Sprint 2 requirement)
 * - Add RLS for any remaining admin tables
 * - Add helper functions for permission checking
 * - Verify all write paths are blocked (force RPC usage)
 *
 * Security Model:
 * - super_admin: Full access to everything
 * - branch_admin: Branch-scoped data only
 * - finance_admin: Financial data only
 * - compliance_admin: Audit logs (read-only)
 * - support_admin: Support tickets
 */

-- ============================================================================
-- 1. HELPER FUNCTIONS FOR RLS POLICIES
-- ============================================================================

-- Function to check if user has admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('super_admin', 'branch_admin', 'finance_admin', 'academic_coordinator', 'compliance_admin', 'support_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific permission
CREATE OR REPLACE FUNCTION public.has_permission(required_permission TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- For now, map permissions to roles
  -- Later, this can query a permissions table
  RETURN CASE required_permission
    WHEN 'manage_users' THEN has_role('super_admin') OR has_role('branch_admin')
    WHEN 'view_financials' THEN has_role('super_admin') OR has_role('finance_admin')
    WHEN 'view_support' THEN has_role('super_admin') OR has_role('support_admin') OR has_role('branch_admin')
    WHEN 'manage_support' THEN has_role('super_admin') OR has_role('support_admin')
    WHEN 'view_audit' THEN has_role('super_admin') OR has_role('compliance_admin')
    ELSE FALSE
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 2. SUPPORT TICKETS TABLE RLS (CRITICAL FOR SPRINT 2)
-- ============================================================================

DO $$
BEGIN
  -- Check if support_tickets table exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'support_tickets') THEN

    -- Enable RLS
    ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "admin_view_all_tickets" ON support_tickets;
    DROP POLICY IF EXISTS "user_view_own_tickets" ON support_tickets;
    DROP POLICY IF EXISTS "support_admin_manage_tickets" ON support_tickets;
    DROP POLICY IF EXISTS "block_direct_ticket_writes" ON support_tickets;

    -- Admins with view_support permission can read all tickets
    CREATE POLICY "admin_view_all_tickets" ON support_tickets
      FOR SELECT TO authenticated
      USING (has_permission('view_support'));

    -- Users can view their own tickets
    CREATE POLICY "user_view_own_tickets" ON support_tickets
      FOR SELECT TO authenticated
      USING (created_by = auth.uid() OR assigned_to = auth.uid());

    -- Support admins can manage tickets via RPC
    -- (This policy doesn't allow direct writes, just defines who CAN via RPC)

    -- Block ALL direct writes (force RPC usage)
    CREATE POLICY "block_direct_ticket_writes" ON support_tickets
      FOR ALL TO authenticated
      USING (false)
      WITH CHECK (false);

    RAISE NOTICE 'Configured RLS for support_tickets';
  ELSE
    RAISE NOTICE 'support_tickets table does not exist yet - will be created in Sprint 2';
  END IF;
END $$;

-- ============================================================================
-- 3. BRANCHES TABLE RLS (FOR BRANCH-SCOPED ACCESS)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'branches') THEN

    ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "super_admin_all_branches" ON branches;
    DROP POLICY IF EXISTS "branch_admin_own_branch" ON branches;
    DROP POLICY IF EXISTS "block_direct_branch_writes" ON branches;

    -- Super admins see all branches
    CREATE POLICY "super_admin_all_branches" ON branches
      FOR SELECT TO authenticated
      USING (has_role('super_admin'));

    -- Branch admins see only their branch
    -- (Requires branch_id in profiles or user_branch_access table)
    CREATE POLICY "branch_admin_own_branch" ON branches
      FOR SELECT TO authenticated
      USING (
        has_role('branch_admin')
        AND id IN (
          SELECT branch_id FROM profiles
          WHERE profiles.id = auth.uid()
        )
      );

    -- Block direct writes
    CREATE POLICY "block_direct_branch_writes" ON branches
      FOR ALL TO authenticated
      USING (false)
      WITH CHECK (false);

    RAISE NOTICE 'Configured RLS for branches';
  ELSE
    RAISE NOTICE 'branches table does not exist yet';
  END IF;
END $$;

-- ============================================================================
-- 4. FEE_PAYMENTS TABLE RLS (FINANCIAL DATA)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'fee_payments') THEN

    ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "finance_view_all_payments" ON fee_payments;
    DROP POLICY IF EXISTS "parent_view_own_payments" ON fee_payments;
    DROP POLICY IF EXISTS "block_direct_fee_payment_writes" ON fee_payments;

    -- Finance admins see all
    CREATE POLICY "finance_view_all_payments" ON fee_payments
      FOR SELECT TO authenticated
      USING (has_permission('view_financials'));

    -- Parents see their own payments
    CREATE POLICY "parent_view_own_payments" ON fee_payments
      FOR SELECT TO authenticated
      USING (
        parent_id = auth.uid()
        OR student_id IN (
          SELECT id FROM profiles WHERE parent_id = auth.uid()
        )
      );

    -- Block direct writes
    CREATE POLICY "block_direct_fee_payment_writes" ON fee_payments
      FOR ALL TO authenticated
      USING (false)
      WITH CHECK (false);

    RAISE NOTICE 'Configured RLS for fee_payments';
  ELSE
    RAISE NOTICE 'fee_payments table does not exist yet';
  END IF;
END $$;

-- ============================================================================
-- 5. EXPENSES TABLE RLS (FINANCIAL DATA)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'expenses') THEN

    ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "finance_view_all_expenses" ON expenses;
    DROP POLICY IF EXISTS "block_direct_expense_writes" ON expenses;

    -- Finance admins see all
    CREATE POLICY "finance_view_all_expenses" ON expenses
      FOR SELECT TO authenticated
      USING (has_permission('view_financials'));

    -- Block direct writes
    CREATE POLICY "block_direct_expense_writes" ON expenses
      FOR ALL TO authenticated
      USING (false)
      WITH CHECK (false);

    RAISE NOTICE 'Configured RLS for expenses';
  ELSE
    RAISE NOTICE 'expenses table does not exist yet';
  END IF;
END $$;

-- ============================================================================
-- 6. CLASSES TABLE RLS (ACADEMIC DATA)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'classes') THEN

    ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "admin_view_all_classes" ON classes;
    DROP POLICY IF EXISTS "teacher_view_own_classes" ON classes;
    DROP POLICY IF EXISTS "student_view_enrolled_classes" ON classes;
    DROP POLICY IF EXISTS "block_direct_class_writes" ON classes;

    -- Admins see all
    CREATE POLICY "admin_view_all_classes" ON classes
      FOR SELECT TO authenticated
      USING (is_admin());

    -- Teachers see their classes
    CREATE POLICY "teacher_view_own_classes" ON classes
      FOR SELECT TO authenticated
      USING (teacher_id = auth.uid());

    -- Students see enrolled classes
    CREATE POLICY "student_view_enrolled_classes" ON classes
      FOR SELECT TO authenticated
      USING (
        id IN (
          SELECT class_id FROM enrollments
          WHERE student_id = auth.uid()
        )
      );

    -- Block direct writes
    CREATE POLICY "block_direct_class_writes" ON classes
      FOR ALL TO authenticated
      USING (false)
      WITH CHECK (false);

    RAISE NOTICE 'Configured RLS for classes';
  ELSE
    RAISE NOTICE 'classes table does not exist yet';
  END IF;
END $$;

-- ============================================================================
-- 7. ATTENDANCE TABLE RLS (ACADEMIC DATA)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'attendance') THEN

    ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "admin_view_all_attendance" ON attendance;
    DROP POLICY IF EXISTS "teacher_view_class_attendance" ON attendance;
    DROP POLICY IF EXISTS "student_view_own_attendance" ON attendance;
    DROP POLICY IF EXISTS "block_direct_attendance_writes" ON attendance;

    -- Admins see all
    CREATE POLICY "admin_view_all_attendance" ON attendance
      FOR SELECT TO authenticated
      USING (is_admin());

    -- Teachers see their class attendance
    CREATE POLICY "teacher_view_class_attendance" ON attendance
      FOR SELECT TO authenticated
      USING (
        class_id IN (
          SELECT id FROM classes WHERE teacher_id = auth.uid()
        )
      );

    -- Students see their own attendance
    CREATE POLICY "student_view_own_attendance" ON attendance
      FOR SELECT TO authenticated
      USING (student_id = auth.uid());

    -- Block direct writes
    CREATE POLICY "block_direct_attendance_writes" ON attendance
      FOR ALL TO authenticated
      USING (false)
      WITH CHECK (false);

    RAISE NOTICE 'Configured RLS for attendance';
  ELSE
    RAISE NOTICE 'attendance table does not exist yet';
  END IF;
END $$;

-- ============================================================================
-- 8. ANNOUNCEMENTS TABLE RLS
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'announcements') THEN

    ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "everyone_view_announcements" ON announcements;
    DROP POLICY IF EXISTS "admin_manage_announcements" ON announcements;
    DROP POLICY IF EXISTS "block_direct_announcement_writes" ON announcements;

    -- Everyone can view published announcements
    CREATE POLICY "everyone_view_announcements" ON announcements
      FOR SELECT TO authenticated
      USING (status = 'published');

    -- Admins can view all (including drafts)
    CREATE POLICY "admin_view_all_announcements" ON announcements
      FOR SELECT TO authenticated
      USING (is_admin());

    -- Block direct writes
    CREATE POLICY "block_direct_announcement_writes" ON announcements
      FOR ALL TO authenticated
      USING (false)
      WITH CHECK (false);

    RAISE NOTICE 'Configured RLS for announcements';
  ELSE
    RAISE NOTICE 'announcements table does not exist yet';
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION & MONITORING
-- ============================================================================

-- Create view to monitor RLS coverage
CREATE OR REPLACE VIEW public.rls_coverage AS
SELECT
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN '✅ Enabled' ELSE '❌ Disabled' END as rls_status,
  (
    SELECT COUNT(*)
    FROM pg_policies p
    WHERE p.tablename = t.tablename
  ) as policy_count
FROM pg_tables t
WHERE schemaname = 'public'
AND tablename NOT LIKE 'pg_%'
AND tablename NOT LIKE 'sql_%'
ORDER BY rls_status DESC, tablename;

-- Create view to list all policies
CREATE OR REPLACE VIEW public.rls_policies AS
SELECT
  schemaname,
  tablename,
  policyname,
  CASE cmd
    WHEN 'r' THEN 'SELECT'
    WHEN 'a' THEN 'INSERT'
    WHEN 'w' THEN 'UPDATE'
    WHEN 'd' THEN 'DELETE'
    WHEN '*' THEN 'ALL'
    ELSE cmd::text
  END as operation,
  CASE
    WHEN qual IS NULL THEN 'No restriction'
    ELSE 'Restricted'
  END as has_using,
  CASE
    WHEN with_check IS NULL THEN 'No restriction'
    ELSE 'Restricted'
  END as has_with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- SPRINT 0 SIGN-OFF QUERIES
-- ============================================================================

-- Run these to verify Sprint 0 completion:

-- 1. Check RLS coverage (should be 100% enabled for admin tables)
-- SELECT * FROM rls_coverage;

-- 2. List all policies
-- SELECT * FROM rls_policies;

-- 3. Count policies per table (should be multiple policies per table)
-- SELECT tablename, COUNT(*) as policy_count
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- GROUP BY tablename
-- ORDER BY policy_count DESC;

-- 4. Verify write blocking (should return 0 policies that allow writes)
-- SELECT tablename, policyname
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- AND cmd IN ('a', 'w', 'd', '*')
-- AND (qual IS NULL OR with_check IS NULL);

COMMENT ON VIEW public.rls_coverage IS 'Sprint 0: Monitor RLS coverage across all tables';
COMMENT ON VIEW public.rls_policies IS 'Sprint 0: List all RLS policies for audit purposes';

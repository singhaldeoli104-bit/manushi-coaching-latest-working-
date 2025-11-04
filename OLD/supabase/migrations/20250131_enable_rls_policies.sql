/**
 * RLS Policies Migration - Sprint 0: Database Security (Simplified)
 *
 * Purpose: Lock down database access with Row Level Security
 * - Enable RLS on existing tables only
 * - Admin read policies with RBAC checks
 * - Block direct writes (force RPC usage)
 *
 * Security Model:
 * - super_admin: Full access to all data
 * - branch_admin: Branch-scoped access only
 * - finance_admin: Financial data only
 * - compliance_admin: Read-only audit logs
 *
 * Note: This migration only applies RLS to tables that exist in your schema.
 * Extend this migration as you add more tables (users, branches, tickets, etc.)
 */

-- ============================================================================
-- 1. ENABLE RLS ON EXISTING TABLES
-- ============================================================================

DO $$
BEGIN
  -- Enable RLS only on tables that exist
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'Enabled RLS on profiles';
  ELSE
    RAISE NOTICE 'Table profiles does not exist, skipping';
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payments') THEN
    ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'Enabled RLS on payments';
  ELSE
    RAISE NOTICE 'Table payments does not exist, skipping';
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'audit_logs') THEN
    ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'Enabled RLS on audit_logs';
  ELSE
    RAISE NOTICE 'Table audit_logs does not exist, skipping';
  END IF;

  -- Optional tables (enable if they exist)
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'fee_payments') THEN
    ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'Enabled RLS on fee_payments';
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'expenses') THEN
    ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'Enabled RLS on expenses';
  END IF;
END $$;

-- ============================================================================
-- 2. PROFILES TABLE POLICIES (IF EXISTS)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN

    -- Admins can read all profiles
    EXECUTE 'CREATE POLICY "admin_read_profiles" ON profiles
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles p
          WHERE p.id = auth.uid()
          AND p.role IN (''super_admin'', ''branch_admin'', ''finance_admin'', ''academic_coordinator'', ''compliance_admin'')
        )
      )';

    -- Users can read their own profile
    EXECUTE 'CREATE POLICY "user_read_own_profile" ON profiles
      FOR SELECT TO authenticated
      USING (id = auth.uid())';

    -- Block direct writes to profiles (use RPCs)
    EXECUTE 'CREATE POLICY "block_direct_profile_writes" ON profiles
      FOR INSERT TO authenticated
      WITH CHECK (false)';

    EXECUTE 'CREATE POLICY "block_direct_profile_updates" ON profiles
      FOR UPDATE TO authenticated
      USING (false)';

    EXECUTE 'CREATE POLICY "block_direct_profile_deletes" ON profiles
      FOR DELETE TO authenticated
      USING (false)';

    RAISE NOTICE 'Created policies for profiles table';
  ELSE
    RAISE NOTICE 'Skipping profiles policies - table does not exist';
  END IF;
END $$;

-- ============================================================================
-- 3. PAYMENTS TABLE POLICIES (IF EXISTS)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payments') THEN

    -- Super admins can read all payments
    EXECUTE 'CREATE POLICY "super_admin_read_all_payments" ON payments
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = ''super_admin''
        )
      )';

    -- Finance admins can read all payments
    EXECUTE 'CREATE POLICY "finance_admin_read_all_payments" ON payments
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = ''finance_admin''
        )
      )';

    -- Block direct writes (use RPCs)
    EXECUTE 'CREATE POLICY "block_direct_payment_writes" ON payments
      FOR INSERT TO authenticated
      WITH CHECK (false)';

    EXECUTE 'CREATE POLICY "block_direct_payment_updates" ON payments
      FOR UPDATE TO authenticated
      USING (false)';

    EXECUTE 'CREATE POLICY "block_direct_payment_deletes" ON payments
      FOR DELETE TO authenticated
      USING (false)';

    RAISE NOTICE 'Created policies for payments table';
  ELSE
    RAISE NOTICE 'Skipping payments policies - table does not exist';
  END IF;
END $$;

-- ============================================================================
-- 4. AUDIT LOGS TABLE POLICIES (IF EXISTS)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'audit_logs') THEN

    -- Super admins can read all audit logs
    EXECUTE 'CREATE POLICY "super_admin_read_audit_logs" ON audit_logs
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = ''super_admin''
        )
      )';

    -- Compliance admins can read all audit logs
    EXECUTE 'CREATE POLICY "compliance_admin_read_audit_logs" ON audit_logs
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = ''compliance_admin''
        )
      )';

    -- Admins can read their own actions
    EXECUTE 'CREATE POLICY "admin_read_own_audit_logs" ON audit_logs
      FOR SELECT TO authenticated
      USING (admin_id = auth.uid())';

    -- Block direct writes (audit logs created by RPCs only)
    EXECUTE 'CREATE POLICY "block_direct_audit_writes" ON audit_logs
      FOR INSERT TO authenticated
      WITH CHECK (false)';

    EXECUTE 'CREATE POLICY "block_direct_audit_updates" ON audit_logs
      FOR UPDATE TO authenticated
      USING (false)';

    EXECUTE 'CREATE POLICY "block_direct_audit_deletes" ON audit_logs
      FOR DELETE TO authenticated
      USING (false)';

    RAISE NOTICE 'Created policies for audit_logs table';
  ELSE
    RAISE NOTICE 'Skipping audit_logs policies - table does not exist';
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check which tables have RLS enabled
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- AND tablename IN ('profiles', 'payments', 'audit_logs', 'fee_payments', 'expenses')
-- ORDER BY tablename;

-- Check policies
-- SELECT tablename, policyname, cmd
-- FROM pg_policies
-- WHERE tablename IN ('profiles', 'payments', 'audit_logs')
-- ORDER BY tablename, policyname;

-- ============================================================================
-- NOTES
-- ============================================================================

/**
 * This migration is intentionally simplified to work with minimal schema.
 *
 * APPLIED RLS TO:
 * - profiles (if exists) - Admin accounts with role-based access
 * - payments (if exists) - Financial data restricted to finance/super admins
 * - audit_logs (if exists) - Read-only for compliance/super admins
 *
 * NOT INCLUDED (add when tables are created):
 * - users - Student/parent/teacher accounts
 * - branches - Branch data for branch admins
 * - support_tickets - Helpdesk tickets
 * - classes - Academic data
 * - fee_payments - Outstanding payment tracking
 * - expenses - Cost tracking
 *
 * To extend this migration for new tables, follow the pattern:
 * 1. Check table exists with IF EXISTS
 * 2. Enable RLS with ALTER TABLE
 * 3. Create read policies based on admin role
 * 4. Block direct writes with false policies
 */

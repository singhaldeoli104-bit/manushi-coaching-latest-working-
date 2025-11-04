# Migration Application Guide - Sprint 0: Security Foundation

## Overview

This guide covers applying **4 critical security migrations** created for Sprint 0. These migrations establish:

1. ✅ Financial RPC functions (already created)
2. ✅ RLS policies for database security
3. ✅ User management RPCs with RBAC
4. ✅ Audit log partitioning for scalability

## Prerequisites

### 1. Supabase CLI Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF
```

### 2. Environment Variables

Ensure you have your Supabase credentials:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Migration Order (CRITICAL)

**⚠️ IMPORTANT: Apply migrations in this exact order**

1. Financial RPC Functions (already created, but not applied)
2. Audit Partitioning (must run BEFORE enabling RLS on audit_logs)
3. RLS Policies (locks down tables)
4. User Management RPCs (depends on RLS policies)

---

## Step 1: Apply Financial RPC Functions

### File
`supabase/migrations/20250130_create_financial_rpc_functions.sql`

### What it does
- Creates 3 PostgreSQL functions for financial reporting
- `get_financial_metrics()` - Revenue, expenses, profit with period comparison
- `get_revenue_breakdown()` - Revenue by branch and class
- `get_outstanding_dues()` - Overdue payments analysis

### Apply

```bash
cd C:/PC/OLD

# Method 1: Apply all pending migrations
supabase db push

# Method 2: Apply specific migration
supabase db reset --db-url postgresql://YOUR_CONNECTION_STRING
```

### Verify

```sql
-- Run in Supabase SQL Editor
SELECT proname, prosrc
FROM pg_proc
WHERE proname IN ('get_financial_metrics', 'get_revenue_breakdown', 'get_outstanding_dues');

-- Test function
SELECT * FROM get_financial_metrics('monthly', 'INR', NULL, NULL);
```

**Expected Result**: Should return financial metrics with sample data

---

## Step 2: Apply Audit Partitioning

### File
`supabase/migrations/20250131_audit_partitions.sql`

### What it does
- Backs up existing audit_logs if present
- Creates partitioned audit_logs table (monthly partitions for 2025)
- Creates indexes on each partition (admin_id, action, target_id)
- Provides functions for auto-creating future partitions
- Provides retention cleanup function (12-month policy)

### Apply

```bash
supabase db push
```

### Verify

```sql
-- Check partitions exist
SELECT
  c.relname as partition_name,
  pg_get_expr(c.relpartbound, c.oid) as partition_bound,
  pg_size_pretty(pg_table_size(c.oid)) as size
FROM pg_class c
JOIN pg_inherits i ON c.oid = i.inhrelid
JOIN pg_class p ON p.oid = i.inhparent
WHERE p.relname = 'audit_logs'
ORDER BY c.relname;

-- Check indexes exist
SELECT
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE tablename LIKE 'audit_logs_2025%'
ORDER BY tablename, indexname;

-- Test inserting an audit log
INSERT INTO audit_logs (admin_id, action, target_id, target_type, timestamp, created_at)
VALUES (
  gen_random_uuid(),
  'test_action',
  gen_random_uuid(),
  'user',
  NOW(),
  NOW()
);

-- Verify it went into correct partition
SELECT tableoid::regclass, * FROM audit_logs WHERE action = 'test_action';
```

**Expected Result**:
- 12 partitions (audit_logs_2025_01 through audit_logs_2025_12)
- 3 indexes per partition (admin, action, target)
- Test insert goes into correct month's partition

---

## Step 3: Apply RLS Policies

### File
`supabase/migrations/20250131_enable_rls_policies.sql`

### What it does
- Enables RLS on 8 critical tables
- Creates read policies based on admin roles (RBAC)
- Creates branch-scoped policies (ABAC)
- **Blocks ALL direct writes** (forces RPC usage)

### ⚠️ WARNING

**This migration will BLOCK all direct writes to tables!**

After applying:
- ✅ Admins can READ data based on their role
- ❌ NO ONE can write directly to tables
- ✅ Writes MUST go through secure RPCs (next step)

### Apply

```bash
supabase db push
```

### Verify

```sql
-- 1. Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'users', 'support_tickets', 'payments', 'audit_logs');

-- Expected: All should have rowsecurity = true

-- 2. Check policies exist
SELECT tablename, policyname, permissive, cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'users', 'support_tickets', 'payments')
ORDER BY tablename, policyname;

-- Expected: Should see multiple policies per table

-- 3. Test read access (as super_admin)
-- Set session to simulate super_admin
SET LOCAL request.jwt.claim.sub = 'YOUR_SUPER_ADMIN_UUID';
SELECT COUNT(*) FROM users; -- Should return count

-- 4. Test write is blocked
SET LOCAL request.jwt.claim.sub = 'YOUR_SUPER_ADMIN_UUID';
INSERT INTO users (email, full_name, role) VALUES ('test@example.com', 'Test User', 'student');
-- Expected: ERROR - new row violates row-level security policy
```

**Expected Result**:
- RLS enabled on all tables
- Read access works for admins
- Direct writes are BLOCKED (this is correct!)

---

## Step 4: Apply User Management RPCs

### File
`supabase/migrations/20250131_user_management_rpcs.sql`

### What it does
- Creates 5 secure RPC functions with RBAC checks
- `suspend_user()` - Suspend with reason
- `unsuspend_user()` - Unsuspend with reason
- `delete_user()` - Soft delete with confirmation
- `reset_user_password()` - Trigger password reset
- `change_user_role()` - Change role (super_admin only)
- All functions audit in same transaction

### Apply

```bash
supabase db push
```

### Verify

```sql
-- 1. Check functions exist
SELECT proname, prosrc
FROM pg_proc
WHERE proname IN ('suspend_user', 'unsuspend_user', 'delete_user', 'reset_user_password', 'change_user_role');

-- Expected: All 5 functions should exist

-- 2. Test suspend_user (with super_admin)
-- First, create a test user
INSERT INTO users (email, full_name, role, status)
VALUES ('testuser@example.com', 'Test User', 'student', 'active')
RETURNING id;
-- Note the returned UUID

-- Test suspend (replace UUIDs)
SELECT suspend_user(
  p_user_id := 'TEST_USER_UUID',
  p_reason := 'Testing RPC function',
  p_admin_id := 'YOUR_SUPER_ADMIN_UUID'
);

-- Expected: Returns JSON with success: true, correlation_id

-- 3. Verify user was suspended
SELECT status FROM users WHERE id = 'TEST_USER_UUID';
-- Expected: status = 'suspended'

-- 4. Verify audit log was created
SELECT * FROM audit_logs
WHERE action = 'suspend_user'
AND target_id = 'TEST_USER_UUID'
ORDER BY created_at DESC
LIMIT 1;

-- Expected: Audit record with reason, changes, correlation_id

-- 5. Test with non-admin (should fail)
SELECT suspend_user(
  p_user_id := 'TEST_USER_UUID',
  p_reason := 'Should fail',
  p_admin_id := 'NON_ADMIN_UUID'
);

-- Expected: ERROR - Insufficient permissions
```

**Expected Result**:
- All 5 functions created
- suspend_user works and creates audit log
- Non-admin attempts fail with permission error

---

## Post-Migration Checklist

After applying ALL 4 migrations:

### 1. Verify Database Security

```sql
-- RLS should be enabled
SELECT COUNT(*) FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'users', 'support_tickets', 'payments', 'audit_logs')
AND rowsecurity = true;

-- Expected: 5 tables

-- Direct writes should fail
INSERT INTO users (email, full_name, role) VALUES ('test@test.com', 'Test', 'student');

-- Expected: ERROR
```

### 2. Test Admin Operations

Test the app with different admin roles:

- **super_admin**: Should see all data, all actions work
- **branch_admin**: Should see only their branch data
- **finance_admin**: Should see financial data only
- **compliance_admin**: Should see audit logs (read-only)

### 3. Monitor Audit Logs

```sql
-- Check audit logs are being created
SELECT
  action,
  COUNT(*) as count,
  MAX(created_at) as last_logged
FROM audit_logs
GROUP BY action
ORDER BY count DESC;
```

### 4. Test Performance

```sql
-- Users list should be fast (with keyset pagination)
EXPLAIN ANALYZE
SELECT * FROM users
ORDER BY created_at DESC, id DESC
LIMIT 50;

-- Should use index, execution time < 50ms
```

---

## Rollback Instructions

If something goes wrong:

### Rollback Order (reverse of application)

1. Rollback user management RPCs
2. Rollback RLS policies
3. Rollback audit partitioning
4. Rollback financial RPCs

### Rollback Commands

```bash
# Method 1: Reset to specific migration
supabase db reset --db-url postgresql://YOUR_CONNECTION_STRING

# Method 2: Manually drop objects
```

### Manual Rollback SQL

```sql
-- Drop user management functions
DROP FUNCTION IF EXISTS suspend_user CASCADE;
DROP FUNCTION IF EXISTS unsuspend_user CASCADE;
DROP FUNCTION IF EXISTS delete_user CASCADE;
DROP FUNCTION IF EXISTS reset_user_password CASCADE;
DROP FUNCTION IF EXISTS change_user_role CASCADE;

-- Disable RLS (CAREFUL - reopens security hole!)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;

-- Restore audit_logs from backup (if exists)
DROP TABLE IF EXISTS audit_logs CASCADE;
ALTER TABLE audit_logs_backup RENAME TO audit_logs;

-- Drop financial functions
DROP FUNCTION IF EXISTS get_financial_metrics CASCADE;
DROP FUNCTION IF EXISTS get_revenue_breakdown CASCADE;
DROP FUNCTION IF EXISTS get_outstanding_dues CASCADE;
```

---

## Troubleshooting

### Issue: "Migration failed to apply"

**Solution**: Check for:
1. Existing table conflicts
2. Missing required tables (users, profiles, payments, etc.)
3. Incorrect column types
4. Permission issues

```sql
-- Check if tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check if conflicting functions exist
SELECT proname FROM pg_proc WHERE proname LIKE '%user%';
```

### Issue: "RLS blocking legitimate reads"

**Solution**: Verify admin role and branch_id

```sql
-- Check your admin user
SELECT id, role, branch_id FROM profiles WHERE email = 'YOUR_ADMIN_EMAIL';

-- Test policy manually
SET LOCAL request.jwt.claim.sub = 'YOUR_ADMIN_UUID';
SELECT * FROM users LIMIT 1;
```

### Issue: "Audit logs not being created"

**Solution**: Check partition exists for current month

```sql
-- Check current month partition
SELECT * FROM pg_class WHERE relname = 'audit_logs_' || TO_CHAR(NOW(), 'YYYY_MM');

-- If missing, create it
SELECT create_monthly_audit_partition(NOW());
```

---

## Next Steps

After successful migration application:

1. ✅ **Update React Native hooks** to use new RPCs
2. ✅ **Test in development** with different roles
3. ✅ **Create keyset pagination migration** (Week 2)
4. ✅ **Apply to staging environment** first
5. ✅ **Run full E2E tests**
6. ✅ **Deploy to production** with rollback plan ready

---

## Support

If you encounter issues:

1. Check Supabase logs: Dashboard → Logs → Postgres
2. Review migration file SQL for syntax errors
3. Verify prerequisites (CLI version, project link)
4. Check for missing required tables
5. Consult Supabase docs: https://supabase.com/docs/guides/database/migrations

---

**Created**: 2025-11-01
**Last Updated**: 2025-11-01
**Sprint**: Sprint 0 - Security Foundation

# Migration Application Instructions

## Current Status

✅ All 5 Sprint 0 migrations have been created and are ready to apply
❌ Supabase CLI/MCP tools are not configured (authorization issues)
✅ Project details found: qrwroibhzgywaiecbcoa.supabase.co

## Option 1: Manual Application via Supabase Dashboard (RECOMMENDED)

### Step 1: Navigate to SQL Editor

Open: https://supabase.com/dashboard/project/qrwroibhzgywaiecbcoa/sql/new

### Step 2: Apply Migrations in Order

**⚠️ CRITICAL: You MUST apply these in this exact order!**

#### Migration 1: Financial RPC Functions
**File:** `supabase/migrations/20250130_create_financial_rpc_functions.sql`

1. Copy the entire contents of the file
2. Paste into SQL Editor
3. Click "Run" or press Ctrl+Enter
4. Verify: Should see "Success" message
5. Test: `SELECT * FROM get_financial_metrics('monthly', 'INR', NULL, NULL);`

#### Migration 2: Audit Partitioning (BEFORE RLS!)
**File:** `supabase/migrations/20250131_audit_partitions.sql`

1. Copy the entire contents
2. Paste into SQL Editor
3. Run
4. Verify: Check that 12 partitions were created:
```sql
SELECT
  c.relname as partition_name,
  pg_size_pretty(pg_table_size(c.oid)) as size
FROM pg_class c
JOIN pg_inherits i ON c.oid = i.inhrelid
JOIN pg_class p ON p.oid = i.inhparent
WHERE p.relname = 'audit_logs'
ORDER BY c.relname;
```
Expected: 12 partitions (audit_logs_2025_01 through audit_logs_2025_12)

#### Migration 3: RLS Policies (Locks down database!)
**File:** `supabase/migrations/20250131_enable_rls_policies.sql`

**⚠️ WARNING: After this migration, ALL direct writes will be BLOCKED!**

1. Copy the entire contents
2. Paste into SQL Editor
3. Run
4. Verify RLS is enabled:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'users', 'support_tickets', 'payments', 'audit_logs')
ORDER BY tablename;
```
Expected: All should have rowsecurity = true

5. Verify policies exist:
```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'users', 'support_tickets')
ORDER BY tablename, policyname;
```
Expected: Multiple policies per table

#### Migration 4: User Management RPCs
**File:** `supabase/migrations/20250131_user_management_rpcs.sql`

1. Copy the entire contents
2. Paste into SQL Editor
3. Run
4. Verify functions exist:
```sql
SELECT proname, prosrc
FROM pg_proc
WHERE proname IN ('suspend_user', 'unsuspend_user', 'delete_user', 'reset_user_password', 'change_user_role')
ORDER BY proname;
```
Expected: All 5 functions should be present

#### Migration 5: Keyset Pagination
**File:** `supabase/migrations/20250132_keyset_pagination.sql`

1. Copy the entire contents
2. Paste into SQL Editor
3. Run
4. Verify functions exist:
```sql
SELECT proname
FROM pg_proc
WHERE proname IN ('get_users_keyset', 'get_tickets_keyset', 'count_users_filtered')
ORDER BY proname;
```
Expected: All 3 functions

5. Verify indexes:
```sql
SELECT indexname
FROM pg_indexes
WHERE indexname LIKE '%_keyset'
ORDER BY indexname;
```
Expected: At least 8 keyset indexes

### Step 3: Post-Migration Verification

Run this comprehensive check:

```sql
-- 1. Check RLS is enabled (should return 5+)
SELECT COUNT(*) as rls_enabled_count
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true;

-- 2. Check audit partitions (should return 12)
SELECT COUNT(*) as partition_count
FROM pg_class c
JOIN pg_inherits i ON c.oid = i.inhrelid
JOIN pg_class p ON p.oid = i.inhparent
WHERE p.relname = 'audit_logs';

-- 3. Check all RPC functions exist (should return 11)
SELECT COUNT(*) as function_count
FROM pg_proc
WHERE proname IN (
  'get_financial_metrics', 'get_revenue_breakdown', 'get_outstanding_dues',
  'suspend_user', 'unsuspend_user', 'delete_user', 'reset_user_password', 'change_user_role',
  'get_users_keyset', 'get_tickets_keyset', 'count_users_filtered'
);

-- 4. Check policies exist (should return 15+)
SELECT COUNT(*) as policy_count
FROM pg_policies;
```

**Expected Results:**
- rls_enabled_count: 5 or more
- partition_count: 12
- function_count: 11
- policy_count: 15 or more

### Step 4: Test Security

Try to insert directly (should FAIL):

```sql
-- This should return an ERROR (as expected!)
INSERT INTO users (email, full_name, role)
VALUES ('test@example.com', 'Test User', 'student');
```

Expected: `ERROR: new row violates row-level security policy`

This is CORRECT behavior - all writes must now go through secure RPCs!

---

## Option 2: Configure Supabase CLI (Advanced)

If you want to use CLI for future migrations:

### Step 1: Get Service Role Key

1. Go to: https://supabase.com/dashboard/project/qrwroibhzgywaiecbcoa/settings/api
2. Copy the "service_role" key (not anon key)
3. Add to `.env`:
```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 2: Initialize Supabase Config

```bash
cd C:/PC/OLD

# Create supabase config
npx supabase init

# Link to project
npx supabase link --project-ref qrwroibhzgywaiecbcoa
```

### Step 3: Push Migrations

```bash
npx supabase db push
```

---

## Option 3: Configure MCP Server (For automation)

The Supabase MCP server needs proper credentials. Check your MCP config file (usually in `~/.config/mcp/` or similar) and ensure it has:

```json
{
  "supabase": {
    "project_ref": "qrwroibhzgywaiecbcoa",
    "service_role_key": "YOUR_SERVICE_ROLE_KEY"
  }
}
```

---

## Post-Migration: Update React Hooks

After migrations are applied, we need to update React Query hooks to use the new secure RPCs:

1. Update `useUsers()` to call `get_users_keyset()`
2. Update `useTickets()` to call `get_tickets_keyset()`
3. Create `useUserMutations()` for suspend/unsuspend/delete/reset/change_role
4. Update all direct table queries to use RPCs

This is Sprint 1 Week 2 work.

---

## Troubleshooting

### "Function already exists" error
- This is OK - the function will be replaced
- If migration fails, check which step failed and restart from there

### "Table audit_logs already exists" error
- The migration handles this - existing data is backed up
- Check for `audit_logs_backup` table if you need old data

### "Permission denied" error
- Make sure you're logged in as project owner
- Check that you have admin access to the project

### RLS blocking all access
- This is expected after Migration 3
- Use the secure RPCs (Migration 4) for all operations
- Super admins can still read data (check your profile role)

---

## What Gets Locked After Migrations

After applying these migrations:

✅ **Can still do:**
- Read data (if you have proper role: super_admin, branch_admin, etc.)
- Call secure RPCs for user management
- Query financial metrics
- View audit logs (compliance_admin or super_admin)

❌ **Can no longer do:**
- Direct INSERT/UPDATE/DELETE on users, profiles, tickets, payments
- Modify audit logs directly
- Bypass RBAC checks
- Skip audit logging

This is the security foundation - everything is locked down and audited!

---

## Next Steps After Migration

1. ✅ Verify all migrations applied successfully
2. ✅ Test RLS policies with different roles
3. ✅ Test one RPC function (e.g., suspend_user)
4. ✅ Check audit logs are being created
5. → Update React Query hooks to use new RPCs (Sprint 1 Week 2)
6. → Build Bottom Tab Navigator (Sprint 1 Week 3)
7. → Productionize User Management screen (Sprint 2)

---

**Created:** 2025-11-01
**Sprint:** Sprint 0 - Security Foundation
**Status:** Migrations ready, awaiting manual application

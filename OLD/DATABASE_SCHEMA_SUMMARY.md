# Database Schema Summary - Phase 2

**Date:** January 2025
**Purpose:** Document actual Supabase schema vs planned schema for UserManagementScreen v2.0

---

## Tables Verified

### 1. profiles Table (EXISTS)

**Source:** `docs/sql/CREATE_ALL_TABLES_FIXED.sql` (lines 35-54)

**Schema:**
```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  phone VARCHAR,
  full_name VARCHAR NOT NULL,
  avatar_url TEXT,
  role VARCHAR NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
  enrollment_number VARCHAR,
  grade VARCHAR,
  batch_id UUID REFERENCES batches(id),
  subjects TEXT[],
  specialization TEXT,
  children_ids UUID[],
  address TEXT,
  bio TEXT,
  preferences JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Key Fields for UserManagementScreen:**
- `id` (UUID) - Primary key
- `email` (VARCHAR) - Unique, searchable
- `full_name` (VARCHAR) - Searchable
- `role` (VARCHAR) - 'admin' | 'teacher' | 'student' | 'parent'
- `is_active` (BOOLEAN) - For suspend/unsuspend (TRUE = active, FALSE = suspended)
- `created_at` (TIMESTAMP) - Creation date
- `updated_at` (TIMESTAMP) - Last update (can use as proxy for last_active)

---

### 2. audit_logs Table (EXISTS)

**Source:** `supabase/migrations/20250129_create_audit_logs.sql` (Phase 0 migration)

**Schema:**
```sql
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_type TEXT NOT NULL DEFAULT 'admin' CHECK (actor_type IN ('admin', 'parent', 'system')),
  action TEXT NOT NULL CHECK (action IN ('create_user', 'update_user', 'delete_user', 'suspend_user', 'unsuspend_user', ...)),
  target_id UUID,
  target_type TEXT CHECK (target_type IN ('user', 'branch', 'announcement', ...)),
  changes JSONB,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

**Key Features:**
- Immutable (RLS prevents updates/deletes)
- 27 action types including 'suspend_user', 'unsuspend_user', 'delete_user'
- JSONB fields for changes and metadata
- Indexes on admin_id, action, target, created_at

---

### 3. admin_profiles Table (MISSING)

**Status:** DOES NOT EXIST
**Problem:** Referenced in audit_logs RLS policies but not created

**RLS Policy Reference (from audit_logs migration):**
```sql
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
      AND admin_profiles.role IN ('super_admin', 'compliance_admin', 'branch_admin')
    )
  );
```

**Impact:**
- Audit logs RLS policy will fail to evaluate
- Admin users cannot query audit_logs table without this table
- Need to either:
  1. Create admin_profiles table, OR
  2. Modify RLS policy to use profiles table with role check

**Recommended Fix:**
```sql
-- Option 1: Create admin_profiles table
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
  role VARCHAR NOT NULL CHECK (role IN ('super_admin', 'branch_admin', 'finance_admin', 'academic_coordinator', 'compliance_admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Option 2: Update RLS policy to use profiles table
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

---

## Schema Adjustments for UserManagementScreen v2.0

### Original Plan vs Actual Schema

| Field | Planned | Actual | Adjustment Needed |
|-------|---------|--------|-------------------|
| `id` | UUID | UUID | No change |
| `full_name` | VARCHAR | VARCHAR | No change |
| `email` | VARCHAR | VARCHAR | No change |
| `role` | VARCHAR | VARCHAR | No change |
| `status` | 'active' \| 'suspended' | NOT EXISTS | Use `is_active` instead |
| `is_active` | NOT PLANNED | BOOLEAN | Use for suspend/unsuspend |
| `last_active_at` | TIMESTAMP | NOT EXISTS | Use `updated_at` as proxy |
| `created_at` | TIMESTAMP | TIMESTAMP | No change |
| `deleted_at` | TIMESTAMP (for soft delete) | NOT EXISTS | Cannot do soft delete (yet) |

### Adjusted Data Contract

**User Interface:**
```typescript
interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  is_active: boolean;  // TRUE = active, FALSE = suspended
  updated_at: string;  // Proxy for last_active_at
  created_at: string;
}
```

**Fetch Users Query (ADJUSTED):**
```typescript
const fetchUsers = async (params: FetchUsersParams): Promise<User[]> => {
  let query = supabase
    .from('profiles')
    .select('id, full_name, email, role, is_active, updated_at, created_at')
    .order('created_at', { ascending: false });

  if (params.role) {
    query = query.eq('role', params.role);
  }

  // ADJUSTED: Use is_active instead of status
  if (params.status === 'active') {
    query = query.eq('is_active', true);
  } else if (params.status === 'suspended') {
    query = query.eq('is_active', false);
  }

  if (params.search) {
    query = query.or(`full_name.ilike.%${params.search}%,email.ilike.%${params.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};
```

**Suspend User (ADJUSTED):**
```typescript
// Set is_active = false
await supabase
  .from('profiles')
  .update({ is_active: false })
  .eq('id', userId);

await logAudit({
  action: 'suspend_user',
  targetId: userId,
  targetType: 'user',
  changes: {
    is_active: { from: true, to: false },
  },
});
```

**Unsuspend User (ADJUSTED):**
```typescript
// Set is_active = true
await supabase
  .from('profiles')
  .update({ is_active: true })
  .eq('id', userId);

await logAudit({
  action: 'unsuspend_user',
  targetId: userId,
  targetType: 'user',
  changes: {
    is_active: { from: false, to: true },
  },
});
```

**Delete User (CANNOT SOFT DELETE YET):**
```typescript
// Option 1: Hard delete (not recommended for audit trail)
await supabase
  .from('profiles')
  .delete()
  .eq('id', userId);

// Option 2: Set is_active = false (same as suspend)
// This is the safer option until deleted_at field is added

// Option 3: Add deleted_at field first (requires migration)
```

---

## Migration Needed (admin_profiles table)

**File:** `supabase/migrations/20250130_create_admin_profiles.sql`

```sql
-- Create admin_profiles table for RBAC
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL CHECK (
    role IN ('super_admin', 'branch_admin', 'finance_admin', 'academic_coordinator', 'compliance_admin')
  ),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_admin_user UNIQUE (user_id)
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_admin_profiles_user_id ON admin_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON admin_profiles(role);

-- Enable RLS
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all admin profiles
CREATE POLICY "Admins can view admin profiles" ON admin_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only super_admin can insert/update admin profiles
CREATE POLICY "Super admins can manage admin profiles" ON admin_profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
      AND admin_profiles.role = 'super_admin'
    )
  );
```

---

## Risks and Mitigations

### Risk 1: admin_profiles table missing
**Impact:** audit_logs RLS policy fails, admins cannot view audit logs
**Mitigation:** Apply admin_profiles migration OR update RLS policy
**Priority:** HIGH

### Risk 2: No deleted_at field for soft delete
**Impact:** Cannot distinguish suspended vs deleted users
**Mitigation:** Use is_active = false for both, OR add deleted_at field
**Priority:** MEDIUM

### Risk 3: No last_active_at field
**Impact:** Cannot show when user was last active
**Mitigation:** Use updated_at as proxy (less accurate)
**Priority:** LOW

---

## Implementation Decision

**For UserManagementScreen v2.0:**
1. Use `is_active` field for suspend/unsuspend (TRUE = active, FALSE = suspended)
2. Use `updated_at` as proxy for last_active_at
3. Omit delete functionality for now (until deleted_at field is added)
4. Document admin_profiles table as TODO for Phase 2b or Phase 4

**Updated Feature Set:**
- List users with real Supabase data
- Search and filter (role, is_active)
- Suspend user (set is_active = false)
- Unsuspend user (set is_active = true)
- NO Delete user (requires deleted_at field or hard delete)

---

## Next Steps

**Immediate:**
1. Implement UserManagementScreenV2.tsx with adjusted schema
2. Test with real Supabase data
3. Apply acceptance checklist

**Future (Phase 2b or Phase 4):**
1. Apply admin_profiles migration
2. Add deleted_at field to profiles table for soft deletes
3. Add last_active_at field to profiles table
4. Re-enable delete user functionality with soft delete

---

**Schema Status:** VERIFIED
**Adjustments:** DOCUMENTED
**Ready for Implementation:** YES

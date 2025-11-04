# Sprint 0 Completion Tracker - Security Foundations

## 🎯 Goal: Complete Sprint 0 in 2 days

**Status:** ⚠️ 60% Complete
**Deadline:** End of Week 0 (2 days from now)
**DRI:** Backend/Supabase Team

---

## ✅ Already Complete

- [x] Audit table with partitions (`audit_logs`)
- [x] Audit logging function (`auditLogger.ts`)
- [x] Admin permissions system (`adminPermissions.ts`)
- [x] Basic RBAC implementation

---

## 🔴 Critical - Must Complete (Day 1)

### 1. RLS Policies on All Admin Tables (4 hours)

**Status:** ⚠️ Partial

**Tables needing RLS:**
- [ ] `profiles` - Full RLS with branch scope
- [ ] `support_tickets` - Admins can view all, parents only their own
- [ ] `payments` - Finance admins + branch admins only
- [ ] `attendance` - Teachers + branch admins only
- [ ] `announcements` - Based on role hierarchy
- [ ] `messages` - Based on sender/recipient + admin override

**SQL Migration:**
```sql
-- supabase/migrations/sprint0_rls_complete.sql

-- Drop existing policies (start clean)
DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;
DROP POLICY IF EXISTS "profiles_user_own" ON profiles;

-- profiles: Admin can view all, users can view own
CREATE POLICY "profiles_admin_select"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles
      WHERE role IN ('admin', 'super_admin')
    )
    OR auth.uid() = user_id
  );

CREATE POLICY "profiles_admin_update"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles
      WHERE role IN ('admin', 'super_admin')
      AND has_permission('manage_users')
    )
  );

-- support_tickets: Admins see all, users see own
CREATE POLICY "support_tickets_select"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE has_permission('view_support')
    )
    OR created_by = auth.uid()
  );

-- payments: Finance admins + branch admins only
CREATE POLICY "payments_select"
  ON payments FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles
      WHERE has_permission('view_financials')
    )
  );

-- Add similar for attendance, announcements, messages
```

**Verification Script:**
```sql
-- Test with non-admin token
SET LOCAL role TO authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "non-admin-user-id"}';

-- Should return 0 or only user's own records
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM support_tickets;
SELECT COUNT(*) FROM payments;
```

---

### 2. Secure RPC Pattern (3 hours)

**Status:** ❌ Not Started

**Create pattern RPC for writes:**

**File:** `supabase/functions/secure-write-rpc/index.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors.ts';

interface SecureWriteRequest {
  action: 'suspend_user' | 'delete_user' | 'update_settings';
  targetId: string;
  payload: Record<string, any>;
  reason?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, targetId, payload, reason } = await req.json() as SecureWriteRequest;

    // Check permissions
    const { data: permissions } = await supabaseClient
      .from('user_roles')
      .select('permissions')
      .eq('user_id', user.id)
      .single();

    if (!permissions?.permissions?.includes(getRequiredPermission(action))) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Start transaction (use pg pool for real transactions)
    const correlationId = crypto.randomUUID();

    // Perform action
    let result;
    switch (action) {
      case 'suspend_user':
        result = await suspendUser(supabaseClient, targetId);
        break;
      // ... other actions
    }

    // Log audit in same transaction
    await supabaseClient.from('audit_logs').insert({
      user_id: user.id,
      action,
      target_id: targetId,
      target_type: 'user',
      changes: payload,
      reason,
      correlation_id: correlationId,
      created_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ success: true, correlationId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('RPC Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getRequiredPermission(action: string): string {
  const map = {
    'suspend_user': 'manage_users',
    'delete_user': 'manage_users',
    'update_settings': 'manage_settings',
  };
  return map[action] || 'admin';
}

async function suspendUser(client: any, userId: string) {
  const { error } = await client
    .from('profiles')
    .update({ is_active: false, suspended_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) throw error;
  return { success: true };
}
```

**Client-side hook:**

**File:** `src/hooks/useSecureRPC.ts`

```typescript
import { supabase } from '../lib/supabase';

interface RPCRequest {
  action: string;
  targetId: string;
  payload?: Record<string, any>;
  reason?: string;
}

export async function executeSecureRPC(request: RPCRequest) {
  const { data, error } = await supabase.functions.invoke('secure-write-rpc', {
    body: request,
  });

  if (error) throw error;
  return data;
}

export function useSecureWrite() {
  const suspendUser = async (userId: string, reason: string) => {
    return executeSecureRPC({
      action: 'suspend_user',
      targetId: userId,
      reason,
    });
  };

  const deleteUser = async (userId: string, reason: string) => {
    return executeSecureRPC({
      action: 'delete_user',
      targetId: userId,
      reason,
    });
  };

  return { suspendUser, deleteUser };
}
```

---

### 3. Branch-Scoped Access (ABAC) (2 hours)

**Status:** ❌ Not Started

**Database schema:**

```sql
-- supabase/migrations/sprint0_branch_access.sql

CREATE TABLE user_branch_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL,
  access_level TEXT NOT NULL CHECK (access_level IN ('read', 'write', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, branch_id)
);

CREATE INDEX idx_user_branch_access_user ON user_branch_access(user_id);
CREATE INDEX idx_user_branch_access_branch ON user_branch_access(branch_id);

-- Helper function to check branch access
CREATE OR REPLACE FUNCTION has_branch_access(
  user_id UUID,
  branch_id UUID,
  required_level TEXT DEFAULT 'read'
)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_branch_access
    WHERE user_id = $1
    AND branch_id = $2
    AND (
      access_level = $3
      OR (access_level = 'admin' AND $3 IN ('read', 'write'))
      OR (access_level = 'write' AND $3 = 'read')
    )
  );
$$ LANGUAGE SQL SECURITY DEFINER;
```

**Update RLS policies to include branch scope:**

```sql
-- Example: Payments with branch scope
CREATE POLICY "payments_branch_scoped"
  ON payments FOR SELECT
  TO authenticated
  USING (
    -- Super admin sees all
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'super_admin')
    OR
    -- Branch admin sees their branches
    has_branch_access(auth.uid(), branch_id, 'read')
  );
```

---

## 🟡 High Priority - Must Complete (Day 2)

### 4. Sentry Integration (2 hours)

**Status:** ❌ Not Started

**Install:**
```bash
npm install @sentry/react-native
npx @sentry/wizard -i reactNative -p android,ios
```

**Configuration:**

**File:** `src/config/sentry.ts`

```typescript
import * as Sentry from '@sentry/react-native';

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    beforeSend(event, hint) {
      // Add correlation ID
      const correlationId = global.correlationId || crypto.randomUUID();
      event.tags = {
        ...event.tags,
        correlationId,
      };
      return event;
    },
  });
}

export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
    tags: {
      correlationId: global.correlationId,
    },
  });
}

export function setCorrelationId(id: string) {
  global.correlationId = id;
  Sentry.setTag('correlationId', id);
}
```

**Update App.tsx:**

```typescript
import { initSentry } from './config/sentry';

initSentry();
```

---

### 5. Performance Budgets & Monitoring (2 hours)

**Status:** ❌ Not Started

**File:** `src/config/performanceBudgets.ts`

```typescript
export const PERFORMANCE_BUDGETS = {
  // API Response Times
  api: {
    read: 300, // ms - p95
    write: 500, // ms - p95
    list: 400, // ms - p95
  },

  // Screen Load Times
  screen: {
    firstContent: 1000, // ms - Time to first meaningful paint
    interactive: 2000, // ms - Time to interactive
  },

  // List Performance
  list: {
    itemsPerPage: 20,
    maxItems: 1000, // Before requiring filters
    renderTime: 16, // ms per item (60fps)
  },

  // Export Performance
  export: {
    small: 5000, // < 1k rows - 5s
    medium: 30000, // < 10k rows - 30s
    large: 180000, // < 100k rows - 3min
  },
};

export function checkPerformanceBudget(
  metric: string,
  value: number,
  budget: number
): { pass: boolean; violation?: string } {
  if (value > budget) {
    return {
      pass: false,
      violation: `${metric} exceeded budget: ${value}ms > ${budget}ms`,
    };
  }
  return { pass: true };
}
```

**Monitoring wrapper:**

```typescript
import { checkPerformanceBudget, PERFORMANCE_BUDGETS } from './performanceBudgets';
import { captureException } from './sentry';

export function monitorAPICall<T>(
  fn: () => Promise<T>,
  endpoint: string,
  type: 'read' | 'write' | 'list'
): Promise<T> {
  const start = Date.now();

  return fn()
    .then((result) => {
      const duration = Date.now() - start;
      const budget = PERFORMANCE_BUDGETS.api[type];
      const check = checkPerformanceBudget(`API ${type}: ${endpoint}`, duration, budget);

      if (!check.pass) {
        console.warn(check.violation);
        captureException(new Error(check.violation!), {
          endpoint,
          duration,
          budget,
        });
      }

      return result;
    });
}
```

---

### 6. Rate Limiting Strategy (1 hour)

**Status:** ❌ Not Started

**File:** `supabase/migrations/sprint0_rate_limits.sql`

```sql
-- Rate limit tracking table
CREATE TABLE rate_limit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET
);

CREATE INDEX idx_rate_limit_user_time ON rate_limit_log(user_id, created_at);
CREATE INDEX idx_rate_limit_action_time ON rate_limit_log(action, created_at);

-- Rate limit check function
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id UUID,
  p_action TEXT,
  p_limit INTEGER DEFAULT 100,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM rate_limit_log
  WHERE user_id = p_user_id
    AND action = p_action
    AND created_at > NOW() - (p_window_minutes || ' minutes')::INTERVAL;

  IF v_count >= p_limit THEN
    RETURN FALSE;
  END IF;

  INSERT INTO rate_limit_log (user_id, action, endpoint)
  VALUES (p_user_id, p_action, p_action);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Rate limit configuration:**

```typescript
export const RATE_LIMITS = {
  // Per user, per hour
  api: {
    read: 1000,
    write: 100,
    delete: 10,
  },

  // Special limits
  export: 5, // per hour
  broadcast: 2, // per hour
  passwordReset: 3, // per day
};
```

---

## 🟢 Medium Priority - Complete by End of Week

### 7. Documentation (1 hour)

**File:** `SECURITY_MODEL.md`

- [ ] Document RLS policies
- [ ] Document branch-scoped access
- [ ] Document secure RPC pattern
- [ ] Document rate limits
- [ ] Document audit logging

---

## Verification Checklist

### RLS Verification
```bash
# Run as non-admin user
psql -U non_admin_user -d app_db
> SELECT COUNT(*) FROM profiles; -- Should be 1 (own profile)
> SELECT COUNT(*) FROM payments; -- Should be 0
> UPDATE profiles SET is_active = false WHERE id = 'other-user'; -- Should fail
```

### RPC Verification
```bash
# Test without permission
curl -X POST https://<project>.functions.supabase.co/secure-write-rpc \
  -H "Authorization: Bearer <non-admin-token>" \
  -d '{"action":"suspend_user","targetId":"user-123"}' \
  # Should return 403
```

### Audit Verification
```sql
-- Check audit logs created
SELECT COUNT(*) FROM audit_logs
WHERE created_at > NOW() - INTERVAL '1 hour';
-- Should show recent entries

-- Check correlation IDs
SELECT DISTINCT correlation_id FROM audit_logs
WHERE created_at > NOW() - INTERVAL '1 hour';
-- Should have UUIDs
```

### Performance Verification
```bash
# Run load test
npm run load-test -- --endpoint=/api/users --duration=60s
# p95 should be < 300ms
```

---

## Sprint 0 Sign-off Criteria

- [ ] All RLS policies in place and tested
- [ ] Secure RPC pattern established and documented
- [ ] Branch-scoped access implemented
- [ ] Sentry integrated with correlation IDs
- [ ] Performance budgets defined
- [ ] Rate limiting active
- [ ] All verification tests pass
- [ ] Documentation complete

**Sign-off:** ___________ (Backend DRI) Date: _______

---

## Next Sprint Preview (Sprint 1 - Week 1)

Once Sprint 0 complete:
1. Lock data contracts
2. Build Bottom Tab Navigator
3. Implement keyset pagination
4. Add UI shell components

**Estimated Start:** Day 3 of Week 0

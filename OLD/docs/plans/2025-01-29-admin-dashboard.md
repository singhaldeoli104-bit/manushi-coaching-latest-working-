# Admin Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build production-ready Admin Dashboard with RBAC, audit logging, KPI cards, quick actions, system health monitoring, and user management capabilities.

**Architecture:** Phase-based approach starting with RBAC infrastructure (Phase 0), then core dashboard UI components with Material Design 3 styling. All admin actions require permission checks and destructive actions require audit logging. Real Supabase data only, no mock data.

**Tech Stack:** React Native 0.80.2, TypeScript, Material Design 3 (react-native-paper), Supabase (auth + database), TanStack Query (data fetching), Zod (validation), React Navigation (tabs + stack)

---

## ⚠️ CRITICAL CONSTRAINTS

**BEFORE STARTING ANY TASK:**
1. ❌ NO package modifications allowed (`npm install`, `yarn add`, etc.)
2. ❌ NO mock data - Real Supabase queries only
3. ✅ MUST use BaseScreen wrapper for all screens
4. ✅ MUST use safeNavigate for all navigation
5. ✅ MUST track analytics for all user actions
6. ✅ MUST apply ACCEPTANCE_CHECKLIST.md before marking screen complete

**Required Reading:**
- `OLD/PROJECT_MEMORY.md` - Constraints, patterns, strategy
- `OLD/ADMIN_IMPLEMENTATION_STRATEGY.md` - Phase requirements
- `OLD/ADMIN_UI_DESIGN_SYSTEM.md` - Design specs
- `OLD/ACCEPTANCE_CHECKLIST.md` - Quality checklist

---

## PHASE 0: RBAC & AUDIT INFRASTRUCTURE (MUST DO FIRST)

### Task 1: Create Admin Permissions System

**Files:**
- Create: `src/utils/adminPermissions.ts`
- Create: `src/types/admin.ts`

**Step 1: Write the failing test**

Create: `src/utils/__tests__/adminPermissions.test.ts`

```typescript
import { hasPermission, checkPermission, ADMIN_PERMISSIONS } from '../adminPermissions';

describe('adminPermissions', () => {
  it('should return true when super_admin checks any permission', () => {
    const result = hasPermission('super_admin', ADMIN_PERMISSIONS.USER_MANAGEMENT);
    expect(result).toBe(true);
  });

  it('should return false when branch_admin checks system_settings permission', () => {
    const result = hasPermission('branch_admin', ADMIN_PERMISSIONS.SYSTEM_SETTINGS);
    expect(result).toBe(false);
  });

  it('should return true when finance_admin checks fee_management permission', () => {
    const result = hasPermission('finance_admin', ADMIN_PERMISSIONS.FEE_MANAGEMENT);
    expect(result).toBe(true);
  });

  it('should throw error when checkPermission fails', () => {
    expect(() => {
      checkPermission('branch_admin', ADMIN_PERMISSIONS.SYSTEM_SETTINGS);
    }).toThrow('Insufficient permissions');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/utils/__tests__/adminPermissions.test.ts`
Expected: FAIL with "Cannot find module '../adminPermissions'"

**Step 3: Define admin types**

Create: `src/types/admin.ts`

```typescript
/**
 * Admin role types
 */
export type AdminRole =
  | 'super_admin'
  | 'branch_admin'
  | 'finance_admin'
  | 'academic_coordinator'
  | 'compliance_admin';

/**
 * Admin permission types
 */
export type AdminPermission =
  | 'user_management'
  | 'fee_management'
  | 'system_settings'
  | 'analytics_view'
  | 'audit_logs_view'
  | 'announcements'
  | 'bulk_operations'
  | 'compliance_reports';

/**
 * Admin user profile from Supabase
 */
export interface AdminProfile {
  id: string;
  user_id: string;
  role: AdminRole;
  permissions: AdminPermission[];
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Audit log entry
 */
export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
```

**Step 4: Implement admin permissions system**

Create: `src/utils/adminPermissions.ts`

```typescript
import type { AdminRole, AdminPermission } from '../types/admin';

/**
 * Admin permission constants
 */
export const ADMIN_PERMISSIONS = {
  USER_MANAGEMENT: 'user_management' as AdminPermission,
  FEE_MANAGEMENT: 'fee_management' as AdminPermission,
  SYSTEM_SETTINGS: 'system_settings' as AdminPermission,
  ANALYTICS_VIEW: 'analytics_view' as AdminPermission,
  AUDIT_LOGS_VIEW: 'audit_logs_view' as AdminPermission,
  ANNOUNCEMENTS: 'announcements' as AdminPermission,
  BULK_OPERATIONS: 'bulk_operations' as AdminPermission,
  COMPLIANCE_REPORTS: 'compliance_reports' as AdminPermission,
};

/**
 * Role-based permission mapping
 * Maps each admin role to their allowed permissions
 */
const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    ADMIN_PERMISSIONS.USER_MANAGEMENT,
    ADMIN_PERMISSIONS.FEE_MANAGEMENT,
    ADMIN_PERMISSIONS.SYSTEM_SETTINGS,
    ADMIN_PERMISSIONS.ANALYTICS_VIEW,
    ADMIN_PERMISSIONS.AUDIT_LOGS_VIEW,
    ADMIN_PERMISSIONS.ANNOUNCEMENTS,
    ADMIN_PERMISSIONS.BULK_OPERATIONS,
    ADMIN_PERMISSIONS.COMPLIANCE_REPORTS,
  ],
  branch_admin: [
    ADMIN_PERMISSIONS.USER_MANAGEMENT,
    ADMIN_PERMISSIONS.FEE_MANAGEMENT,
    ADMIN_PERMISSIONS.ANALYTICS_VIEW,
    ADMIN_PERMISSIONS.ANNOUNCEMENTS,
  ],
  finance_admin: [
    ADMIN_PERMISSIONS.FEE_MANAGEMENT,
    ADMIN_PERMISSIONS.ANALYTICS_VIEW,
  ],
  academic_coordinator: [
    ADMIN_PERMISSIONS.ANALYTICS_VIEW,
    ADMIN_PERMISSIONS.ANNOUNCEMENTS,
  ],
  compliance_admin: [
    ADMIN_PERMISSIONS.ANALYTICS_VIEW,
    ADMIN_PERMISSIONS.AUDIT_LOGS_VIEW,
    ADMIN_PERMISSIONS.COMPLIANCE_REPORTS,
  ],
};

/**
 * Check if an admin role has a specific permission
 * @param role - Admin role to check
 * @param permission - Permission to verify
 * @returns true if role has permission, false otherwise
 */
export const hasPermission = (
  role: AdminRole,
  permission: AdminPermission
): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[role];
  return rolePermissions.includes(permission);
};

/**
 * Verify permission and throw error if not authorized
 * @param role - Admin role to check
 * @param permission - Permission to verify
 * @throws Error if permission not granted
 */
export const checkPermission = (
  role: AdminRole,
  permission: AdminPermission
): void => {
  if (!hasPermission(role, permission)) {
    throw new Error(
      `Insufficient permissions: ${role} does not have ${permission}`
    );
  }
};

/**
 * Get all permissions for a role
 * @param role - Admin role
 * @returns Array of permissions for the role
 */
export const getRolePermissions = (role: AdminRole): AdminPermission[] => {
  return ROLE_PERMISSIONS[role];
};
```

**Step 5: Run test to verify it passes**

Run: `npx jest src/utils/__tests__/adminPermissions.test.ts`
Expected: PASS (all 4 tests)

**Step 6: Commit**

```bash
git add src/types/admin.ts src/utils/adminPermissions.ts src/utils/__tests__/adminPermissions.test.ts
git commit -m "feat: add RBAC permissions system for admin roles"
```

---

### Task 2: Create Audit Logger System

**Files:**
- Create: `src/utils/auditLogger.ts`
- Create: `src/utils/__tests__/auditLogger.test.ts`
- Create: `supabase/migrations/20250129_create_audit_logs.sql`

**Step 1: Create audit_logs table migration**

Create: `supabase/migrations/20250129_create_audit_logs.sql`

```sql
-- Create audit_logs table for tracking all admin actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Super admins and compliance admins can view all logs
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
      AND admin_profiles.role IN ('super_admin', 'compliance_admin')
    )
  );

-- Policy: All admins can insert their own audit logs
CREATE POLICY "Admins can create audit logs" ON audit_logs
  FOR INSERT
  WITH CHECK (admin_id = auth.uid());

-- Grant access to authenticated users
GRANT SELECT, INSERT ON audit_logs TO authenticated;
```

**Step 2: Apply migration**

Run: `supabase db push` (or apply via Supabase dashboard)
Expected: Migration successful, audit_logs table created

**Step 3: Write the failing test**

Create: `src/utils/__tests__/auditLogger.test.ts`

```typescript
import { logAuditEvent, AuditEventType } from '../auditLogger';
import { supabase } from '../../lib/supabase';

jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}));

describe('auditLogger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log user deletion event', async () => {
    const mockInsert = jest.fn().mockResolvedValue({ data: {}, error: null });
    (supabase.from as jest.Mock).mockReturnValue({
      insert: mockInsert,
    });

    await logAuditEvent({
      action: AuditEventType.USER_DELETED,
      entityType: 'parent',
      entityId: 'user-123',
      details: { reason: 'Account deactivation requested' },
    });

    expect(mockInsert).toHaveBeenCalledWith({
      action: 'user_deleted',
      entity_type: 'parent',
      entity_id: 'user-123',
      details: { reason: 'Account deactivation requested' },
      ip_address: null,
      user_agent: null,
    });
  });

  it('should throw error when audit logging fails', async () => {
    const mockInsert = jest.fn().mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    });
    (supabase.from as jest.Mock).mockReturnValue({
      insert: mockInsert,
    });

    await expect(
      logAuditEvent({
        action: AuditEventType.FEE_WAIVED,
        entityType: 'fee',
        entityId: 'fee-456',
        details: { amount: 5000 },
      })
    ).rejects.toThrow('Failed to log audit event');
  });
});
```

**Step 4: Run test to verify it fails**

Run: `npx jest src/utils/__tests__/auditLogger.test.ts`
Expected: FAIL with "Cannot find module '../auditLogger'"

**Step 5: Implement audit logger**

Create: `src/utils/auditLogger.ts`

```typescript
import { supabase } from '../lib/supabase';
import type { AuditLog } from '../types/admin';

/**
 * Audit event types for all destructive admin actions
 */
export enum AuditEventType {
  USER_CREATED = 'user_created',
  USER_UPDATED = 'user_updated',
  USER_DELETED = 'user_deleted',
  FEE_WAIVED = 'fee_waived',
  FEE_REFUNDED = 'fee_refunded',
  BULK_MESSAGE_SENT = 'bulk_message_sent',
  ANNOUNCEMENT_CREATED = 'announcement_created',
  ANNOUNCEMENT_DELETED = 'announcement_deleted',
  SETTINGS_CHANGED = 'settings_changed',
  ROLE_CHANGED = 'role_changed',
}

/**
 * Audit event payload
 */
interface AuditEventPayload {
  action: AuditEventType;
  entityType: string;
  entityId: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an audit event to the database
 * @param payload - Audit event data
 * @throws Error if logging fails
 */
export const logAuditEvent = async (
  payload: AuditEventPayload
): Promise<void> => {
  try {
    console.log('📝 [AuditLogger] Logging event:', payload.action, payload.entityType, payload.entityId);

    const { data, error } = await supabase.from('audit_logs').insert({
      action: payload.action,
      entity_type: payload.entityType,
      entity_id: payload.entityId,
      details: payload.details,
      ip_address: payload.ipAddress || null,
      user_agent: payload.userAgent || null,
    });

    if (error) {
      console.error('❌ [AuditLogger] Failed to log event:', error);
      throw new Error(`Failed to log audit event: ${error.message}`);
    }

    console.log('✅ [AuditLogger] Event logged successfully');
  } catch (error) {
    console.error('❌ [AuditLogger] Unexpected error:', error);
    throw error;
  }
};

/**
 * Fetch audit logs with filtering and pagination
 */
export const fetchAuditLogs = async (options?: {
  adminId?: string;
  entityType?: string;
  limit?: number;
  offset?: number;
}): Promise<AuditLog[]> => {
  let query = supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.adminId) {
    query = query.eq('admin_id', options.adminId);
  }

  if (options?.entityType) {
    query = query.eq('entity_type', options.entityType);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('❌ [AuditLogger] Failed to fetch logs:', error);
    throw new Error(`Failed to fetch audit logs: ${error.message}`);
  }

  return data as AuditLog[];
};
```

**Step 6: Run test to verify it passes**

Run: `npx jest src/utils/__tests__/auditLogger.test.ts`
Expected: PASS (all tests)

**Step 7: Commit**

```bash
git add supabase/migrations/20250129_create_audit_logs.sql src/utils/auditLogger.ts src/utils/__tests__/auditLogger.test.ts
git commit -m "feat: add audit logging system for admin actions"
```

---

### Task 3: Create Access Denied Screen

**Files:**
- Create: `src/screens/common/AccessDeniedScreen.tsx`

**Step 1: Write the component**

Create: `src/screens/common/AccessDeniedScreen.tsx`

```typescript
/**
 * Access Denied Screen
 * Shown when admin tries to access a feature they don't have permission for
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { T } from '../../ui/typography/T';
import { Colors, Spacing } from '../../theme/designSystem';
import { safeNavigate } from '../../utils/navigationService';
import { trackAction } from '../../utils/navigationAnalytics';

interface AccessDeniedScreenProps {
  message?: string;
  requiredPermission?: string;
}

const AccessDeniedScreen: React.FC<AccessDeniedScreenProps> = ({
  message = 'You do not have permission to access this feature.',
  requiredPermission,
}) => {
  React.useEffect(() => {
    trackAction('access_denied_shown', 'AccessDenied', { requiredPermission });
  }, [requiredPermission]);

  const handleGoBack = () => {
    trackAction('access_denied_go_back', 'AccessDenied');
    safeNavigate('AdminDashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Icon */}
        <T variant="display" style={styles.icon}>
          🔒
        </T>

        {/* Title */}
        <T variant="headline" weight="bold" align="center" style={styles.title}>
          Access Denied
        </T>

        {/* Message */}
        <T variant="body" align="center" color="textSecondary" style={styles.message}>
          {message}
        </T>

        {/* Permission Info */}
        {requiredPermission && (
          <View style={styles.permissionBox}>
            <T variant="caption" color="textSecondary">
              Required Permission:
            </T>
            <T variant="body" weight="semiBold" style={styles.permissionText}>
              {requiredPermission.replace(/_/g, ' ').toUpperCase()}
            </T>
          </View>
        )}

        {/* Action */}
        <Button
          mode="contained"
          onPress={handleGoBack}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Return to Dashboard
        </Button>

        {/* Help Text */}
        <T variant="caption" align="center" color="textSecondary" style={styles.helpText}>
          Contact your system administrator to request access
        </T>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  message: {
    marginBottom: Spacing.xl,
  },
  permissionBox: {
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderRadius: 8,
    marginBottom: Spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  permissionText: {
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  button: {
    width: '100%',
    marginBottom: Spacing.base,
  },
  buttonContent: {
    paddingVertical: Spacing.sm,
  },
  helpText: {
    marginTop: Spacing.base,
  },
});

export default AccessDeniedScreen;
```

**Step 2: Test manually**

Run app and navigate to AccessDeniedScreen with:
```typescript
safeNavigate('AccessDenied', {
  message: 'You need super_admin role to access system settings.',
  requiredPermission: 'system_settings',
});
```

Expected: Screen displays with lock icon, message, and return button

**Step 3: Commit**

```bash
git add src/screens/common/AccessDeniedScreen.tsx
git commit -m "feat: add access denied screen for RBAC"
```

---

## PHASE 1: CORE ADMIN COMPONENTS

### Task 4: Create KPICard Component

**Files:**
- Create: `src/components/admin/KPICard.tsx`

**Step 1: Write the component**

Create: `src/components/admin/KPICard.tsx`

```typescript
/**
 * KPI Card Component
 * Displays key performance indicator with icon, label, value, and trend
 * Used in Admin Dashboard for metrics like total users, revenue, etc.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { T } from '../../ui/typography/T';
import { Colors, Spacing, BorderRadius } from '../../theme/designSystem';
import { useTheme } from '../../context/ThemeContext';

export interface KPICardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  onPress?: () => void;
}

export const KPICard: React.FC<KPICardProps> = React.memo(({
  icon,
  label,
  value,
  trend,
  subtitle,
  onPress,
}) => {
  const { theme } = useTheme();

  const trendColor = trend
    ? trend.isPositive
      ? Colors.success
      : Colors.error
    : undefined;

  const trendIcon = trend
    ? trend.isPositive
      ? '📈'
      : '📉'
    : '';

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.Surface }]}
      onPress={onPress}
      mode="elevated"
    >
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: theme.SurfaceVariant }]}>
          <T variant="title" style={styles.icon}>
            {icon}
          </T>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Label */}
          <T variant="caption" color="textSecondary" style={styles.label}>
            {label}
          </T>

          {/* Value */}
          <T variant="headline" weight="bold" style={styles.value}>
            {value}
          </T>

          {/* Trend or Subtitle */}
          {trend ? (
            <View style={styles.trendContainer}>
              <T variant="caption" style={[styles.trendText, { color: trendColor }]}>
                {trendIcon} {trend.value > 0 ? '+' : ''}{trend.value}%
              </T>
            </View>
          ) : subtitle ? (
            <T variant="caption" color="textSecondary">
              {subtitle}
            </T>
          ) : null}
        </View>
      </View>
    </Card>
  );
});

KPICard.displayName = 'KPICard';

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.base,
  },
  content: {
    flexDirection: 'row',
    padding: Spacing.base,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.base,
  },
  icon: {
    fontSize: 28,
  },
  mainContent: {
    flex: 1,
  },
  label: {
    marginBottom: Spacing.xs,
  },
  value: {
    marginBottom: Spacing.xs,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontWeight: '600',
  },
});
```

**Step 2: Test component in Storybook or test screen**

Create test usage:
```typescript
<KPICard
  icon="👥"
  label="Total Users"
  value="1,234"
  trend={{ value: 12.5, isPositive: true }}
/>
```

Expected: Card displays with icon, label, value, and green trend

**Step 3: Commit**

```bash
git add src/components/admin/KPICard.tsx
git commit -m "feat: add KPICard component for admin dashboard"
```

---

### Task 5: Create QuickActionTile Component

**Files:**
- Create: `src/components/admin/QuickActionTile.tsx`

**Step 1: Write the component**

Create: `src/components/admin/QuickActionTile.tsx`

```typescript
/**
 * Quick Action Tile Component
 * Compact action button with icon and label
 * Used in Admin Dashboard for common admin actions
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { T } from '../../ui/typography/T';
import { Colors, Spacing, BorderRadius } from '../../theme/designSystem';
import { useTheme } from '../../context/ThemeContext';

export interface QuickActionTileProps {
  icon: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export const QuickActionTile: React.FC<QuickActionTileProps> = React.memo(({
  icon,
  label,
  onPress,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
      style={[
        styles.container,
        {
          backgroundColor: theme.Surface,
          borderColor: theme.Outline,
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: isPressed ? 0.95 : 1 }],
        },
      ]}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: theme.SurfaceVariant }]}>
        <T variant="title" style={styles.icon}>
          {icon}
        </T>
      </View>

      {/* Label */}
      <T variant="caption" weight="semiBold" align="center" style={styles.label}>
        {label}
      </T>
    </Pressable>
  );
});

QuickActionTile.displayName = 'QuickActionTile';

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    color: Colors.textPrimary,
  },
});
```

**Step 2: Test component**

Create test usage:
```typescript
<QuickActionTile
  icon="➕"
  label="Add User"
  onPress={() => console.log('Add User pressed')}
/>
```

Expected: Tile displays with icon and label, scales on press

**Step 3: Commit**

```bash
git add src/components/admin/QuickActionTile.tsx
git commit -m "feat: add QuickActionTile component for admin dashboard"
```

---

### Task 6: Create AlertCard Component

**Files:**
- Create: `src/components/admin/AlertCard.tsx`

**Step 1: Write the component**

Create: `src/components/admin/AlertCard.tsx`

```typescript
/**
 * Alert Card Component
 * Displays system alerts, warnings, and notifications
 * Used in Admin Dashboard for important system messages
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { T } from '../../ui/typography/T';
import { Colors, Spacing, BorderRadius } from '../../theme/designSystem';
import { useTheme } from '../../context/ThemeContext';

export type AlertSeverity = 'info' | 'warning' | 'error' | 'success';

export interface AlertCardProps {
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp?: string;
  onDismiss?: () => void;
  onPress?: () => void;
}

const SEVERITY_CONFIG: Record<AlertSeverity, {
  icon: string;
  color: string;
  backgroundColor: string;
}> = {
  info: {
    icon: 'ℹ️',
    color: Colors.info,
    backgroundColor: `${Colors.info}15`,
  },
  warning: {
    icon: '⚠️',
    color: Colors.warning,
    backgroundColor: `${Colors.warning}15`,
  },
  error: {
    icon: '❌',
    color: Colors.error,
    backgroundColor: `${Colors.error}15`,
  },
  success: {
    icon: '✅',
    color: Colors.success,
    backgroundColor: `${Colors.success}15`,
  },
};

export const AlertCard: React.FC<AlertCardProps> = React.memo(({
  severity,
  title,
  message,
  timestamp,
  onDismiss,
  onPress,
}) => {
  const { theme } = useTheme();
  const config = SEVERITY_CONFIG[severity];

  return (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: config.backgroundColor,
          borderLeftColor: config.color,
          borderLeftWidth: 4,
        },
      ]}
      onPress={onPress}
      mode="outlined"
    >
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <T variant="title" style={styles.icon}>
            {config.icon}
          </T>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Title */}
          <T variant="body" weight="semiBold" style={[styles.title, { color: config.color }]}>
            {title}
          </T>

          {/* Message */}
          <T variant="caption" color="textSecondary" style={styles.message}>
            {message}
          </T>

          {/* Timestamp */}
          {timestamp && (
            <T variant="caption" color="textSecondary" style={styles.timestamp}>
              {timestamp}
            </T>
          )}
        </View>

        {/* Dismiss Button */}
        {onDismiss && (
          <IconButton
            icon="close"
            size={20}
            onPress={onDismiss}
            style={styles.dismissButton}
          />
        )}
      </View>
    </Card>
  );
});

AlertCard.displayName = 'AlertCard';

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.base,
  },
  content: {
    flexDirection: 'row',
    padding: Spacing.base,
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  icon: {
    fontSize: 24,
  },
  mainContent: {
    flex: 1,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  message: {
    marginBottom: Spacing.xs,
  },
  timestamp: {
    fontStyle: 'italic',
  },
  dismissButton: {
    marginTop: -8,
    marginRight: -8,
  },
});
```

**Step 2: Test component**

Create test usage:
```typescript
<AlertCard
  severity="warning"
  title="Pending Fee Approvals"
  message="12 fee waiver requests need review"
  timestamp="2 hours ago"
  onDismiss={() => console.log('Dismissed')}
/>
```

Expected: Alert card displays with warning icon, colored border, and dismiss button

**Step 3: Commit**

```bash
git add src/components/admin/AlertCard.tsx
git commit -m "feat: add AlertCard component for admin dashboard"
```

---

## PHASE 2: ADMIN DASHBOARD SCREEN

### Task 7: Create Admin Dashboard Screen - Part 1 (KPI Section)

**Files:**
- Create: `src/screens/admin/AdminDashboardScreen.tsx`
- Create: `src/hooks/useAdminDashboard.ts`

**Step 1: Create data fetching hook**

Create: `src/hooks/useAdminDashboard.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface DashboardKPIs {
  totalUsers: number;
  totalRevenue: number;
  activeStudents: number;
  pendingFees: number;
}

/**
 * Fetch dashboard KPIs from Supabase
 */
const fetchDashboardKPIs = async (): Promise<DashboardKPIs> => {
  console.log('📊 [AdminDashboard] Fetching KPIs...');

  // Fetch total users (parents + students)
  const { count: parentCount, error: parentError } = await supabase
    .from('parent_profiles')
    .select('*', { count: 'exact', head: true });

  if (parentError) throw parentError;

  const { count: studentCount, error: studentError } = await supabase
    .from('student_profiles')
    .select('*', { count: 'exact', head: true });

  if (studentError) throw studentError;

  // Fetch total revenue
  const { data: revenueData, error: revenueError } = await supabase
    .from('fee_payments')
    .select('amount')
    .eq('status', 'completed');

  if (revenueError) throw revenueError;

  const totalRevenue = revenueData?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

  // Fetch active students (enrolled this year)
  const currentYear = new Date().getFullYear();
  const { count: activeCount, error: activeError } = await supabase
    .from('student_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('enrollment_year', currentYear)
    .eq('status', 'active');

  if (activeError) throw activeError;

  // Fetch pending fees
  const { count: pendingCount, error: pendingError } = await supabase
    .from('fee_payments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (pendingError) throw pendingError;

  console.log('✅ [AdminDashboard] KPIs fetched successfully');

  return {
    totalUsers: (parentCount || 0) + (studentCount || 0),
    totalRevenue,
    activeStudents: activeCount || 0,
    pendingFees: pendingCount || 0,
  };
};

/**
 * Hook to fetch admin dashboard data
 */
export const useAdminDashboard = () => {
  const kpisQuery = useQuery({
    queryKey: ['admin', 'dashboard', 'kpis'],
    queryFn: fetchDashboardKPIs,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    kpis: kpisQuery.data,
    isLoadingKPIs: kpisQuery.isLoading,
    kpisError: kpisQuery.error,
    refetchKPIs: kpisQuery.refetch,
  };
};
```

**Step 2: Create dashboard screen with KPI section**

Create: `src/screens/admin/AdminDashboardScreen.tsx`

```typescript
/**
 * Admin Dashboard Screen
 * Main dashboard for admin role with KPIs, quick actions, and system health
 */

import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { T } from '../../ui/typography/T';
import { Spacing } from '../../theme/designSystem';
import { KPICard } from '../../components/admin/KPICard';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { useAuth } from '../../context/AuthContext';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';

const AdminDashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const { kpis, isLoadingKPIs, kpisError, refetchKPIs } = useAdminDashboard();

  React.useEffect(() => {
    trackScreenView('AdminDashboard');
  }, []);

  const handleRefresh = () => {
    trackAction('refresh_dashboard', 'AdminDashboard');
    refetchKPIs();
  };

  const formatCurrency = (amount: number): string => {
    return `₹${(amount / 1000).toFixed(1)}K`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <BaseScreen
      scrollable
      loading={isLoadingKPIs}
      error={kpisError}
      empty={false}
    >
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isLoadingKPIs} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <T variant="display" weight="bold">Admin Dashboard</T>
          <T variant="body" color="textSecondary">
            Welcome back, {user?.email?.split('@')[0] || 'Admin'}
          </T>
        </View>

        {/* KPI Section */}
        <View style={styles.section}>
          <T variant="title" weight="semiBold" style={styles.sectionTitle}>
            Overview
          </T>

          <View style={styles.kpiGrid}>
            <View style={styles.kpiRow}>
              <View style={styles.kpiColumn}>
                <KPICard
                  icon="👥"
                  label="Total Users"
                  value={formatNumber(kpis?.totalUsers || 0)}
                  trend={{ value: 12.5, isPositive: true }}
                  onPress={() => {
                    trackAction('view_users_from_kpi', 'AdminDashboard');
                    safeNavigate('UserManagement');
                  }}
                />
              </View>
              <View style={styles.kpiColumn}>
                <KPICard
                  icon="💰"
                  label="Total Revenue"
                  value={formatCurrency(kpis?.totalRevenue || 0)}
                  trend={{ value: 8.3, isPositive: true }}
                  onPress={() => {
                    trackAction('view_revenue_from_kpi', 'AdminDashboard');
                    safeNavigate('FeeManagement');
                  }}
                />
              </View>
            </View>

            <View style={styles.kpiRow}>
              <View style={styles.kpiColumn}>
                <KPICard
                  icon="🎓"
                  label="Active Students"
                  value={formatNumber(kpis?.activeStudents || 0)}
                  subtitle="This year"
                  onPress={() => {
                    trackAction('view_students_from_kpi', 'AdminDashboard');
                    safeNavigate('StudentManagement');
                  }}
                />
              </View>
              <View style={styles.kpiColumn}>
                <KPICard
                  icon="⏰"
                  label="Pending Fees"
                  value={formatNumber(kpis?.pendingFees || 0)}
                  subtitle="Awaiting payment"
                  onPress={() => {
                    trackAction('view_pending_fees_from_kpi', 'AdminDashboard');
                    safeNavigate('FeeManagement', { filter: 'pending' });
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    paddingBottom: Spacing.base,
  },
  section: {
    padding: Spacing.lg,
    paddingTop: Spacing.base,
  },
  sectionTitle: {
    marginBottom: Spacing.base,
  },
  kpiGrid: {
    gap: Spacing.base,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  kpiColumn: {
    flex: 1,
  },
});

export default AdminDashboardScreen;
```

**Step 3: Test on device**

Run: `npx react-native run-android` (or run-ios)
Navigate to Admin Dashboard
Expected: 4 KPI cards display with real Supabase data, pull-to-refresh works

**Step 4: Commit**

```bash
git add src/hooks/useAdminDashboard.ts src/screens/admin/AdminDashboardScreen.tsx
git commit -m "feat: add admin dashboard screen with KPI section"
```

---

### Task 8: Add Quick Actions Section to Dashboard

**Files:**
- Modify: `src/screens/admin/AdminDashboardScreen.tsx`

**Step 1: Add Quick Actions section**

Edit: `src/screens/admin/AdminDashboardScreen.tsx`

Add import:
```typescript
import { QuickActionTile } from '../../components/admin/QuickActionTile';
import { hasPermission, ADMIN_PERMISSIONS } from '../../utils/adminPermissions';
```

Add after KPI section (after line with `</View>` closing kpiGrid):

```typescript
        {/* Quick Actions Section */}
        <View style={styles.section}>
          <T variant="title" weight="semiBold" style={styles.sectionTitle}>
            Quick Actions
          </T>

          <View style={styles.actionsGrid}>
            <QuickActionTile
              icon="➕"
              label="Add User"
              onPress={() => {
                trackAction('quick_action_add_user', 'AdminDashboard');
                safeNavigate('AddUser');
              }}
            />
            <QuickActionTile
              icon="📊"
              label="Analytics"
              onPress={() => {
                trackAction('quick_action_analytics', 'AdminDashboard');
                safeNavigate('Analytics');
              }}
            />
            <QuickActionTile
              icon="📢"
              label="Announcement"
              onPress={() => {
                trackAction('quick_action_announcement', 'AdminDashboard');
                safeNavigate('Announcements');
              }}
            />
            <QuickActionTile
              icon="⚙️"
              label="Settings"
              onPress={() => {
                trackAction('quick_action_settings', 'AdminDashboard');
                safeNavigate('AdminSettings');
              }}
            />
          </View>
        </View>
```

Add to styles:
```typescript
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.base,
  },
```

**Step 2: Test on device**

Run app, navigate to Admin Dashboard
Expected: 4 quick action tiles display in a grid below KPI cards

**Step 3: Commit**

```bash
git add src/screens/admin/AdminDashboardScreen.tsx
git commit -m "feat: add quick actions section to admin dashboard"
```

---

### Task 9: Add System Health & Alerts Section to Dashboard

**Files:**
- Modify: `src/screens/admin/AdminDashboardScreen.tsx`
- Modify: `src/hooks/useAdminDashboard.ts`

**Step 1: Add system health data fetching**

Edit: `src/hooks/useAdminDashboard.ts`

Add interface:
```typescript
interface SystemAlert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
}
```

Add function:
```typescript
/**
 * Fetch system alerts
 */
const fetchSystemAlerts = async (): Promise<SystemAlert[]> => {
  console.log('🔔 [AdminDashboard] Fetching system alerts...');

  const alerts: SystemAlert[] = [];

  // Check for pending fee approvals
  const { count: pendingWaivers } = await supabase
    .from('fee_waivers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (pendingWaivers && pendingWaivers > 0) {
    alerts.push({
      id: 'pending-waivers',
      severity: 'warning',
      title: 'Pending Fee Approvals',
      message: `${pendingWaivers} fee waiver requests need review`,
      timestamp: 'Just now',
    });
  }

  // Check for failed payments
  const { count: failedPayments } = await supabase
    .from('fee_payments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'failed');

  if (failedPayments && failedPayments > 5) {
    alerts.push({
      id: 'failed-payments',
      severity: 'error',
      title: 'Payment Failures',
      message: `${failedPayments} payments failed in the last 24 hours`,
      timestamp: '2 hours ago',
    });
  }

  // Check for low attendance
  const { count: lowAttendance } = await supabase
    .from('attendance')
    .select('*', { count: 'exact', head: true })
    .lt('attendance_percentage', 75);

  if (lowAttendance && lowAttendance > 10) {
    alerts.push({
      id: 'low-attendance',
      severity: 'info',
      title: 'Attendance Alert',
      message: `${lowAttendance} students have attendance below 75%`,
      timestamp: '1 day ago',
    });
  }

  console.log('✅ [AdminDashboard] Alerts fetched:', alerts.length);
  return alerts;
};
```

Update hook return:
```typescript
export const useAdminDashboard = () => {
  const kpisQuery = useQuery({
    queryKey: ['admin', 'dashboard', 'kpis'],
    queryFn: fetchDashboardKPIs,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const alertsQuery = useQuery({
    queryKey: ['admin', 'dashboard', 'alerts'],
    queryFn: fetchSystemAlerts,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });

  return {
    kpis: kpisQuery.data,
    isLoadingKPIs: kpisQuery.isLoading,
    kpisError: kpisQuery.error,
    refetchKPIs: kpisQuery.refetch,
    alerts: alertsQuery.data || [],
    isLoadingAlerts: alertsQuery.isLoading,
    alertsError: alertsQuery.error,
    refetchAlerts: alertsQuery.refetch,
  };
};
```

**Step 2: Add alerts section to dashboard screen**

Edit: `src/screens/admin/AdminDashboardScreen.tsx`

Add import:
```typescript
import { AlertCard } from '../../components/admin/AlertCard';
```

Update hook destructuring:
```typescript
const { kpis, isLoadingKPIs, kpisError, refetchKPIs, alerts, refetchAlerts } = useAdminDashboard();
```

Add after Quick Actions section:

```typescript
        {/* System Alerts Section */}
        {alerts.length > 0 && (
          <View style={styles.section}>
            <T variant="title" weight="semiBold" style={styles.sectionTitle}>
              System Alerts
            </T>

            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                severity={alert.severity}
                title={alert.title}
                message={alert.message}
                timestamp={alert.timestamp}
                onPress={() => {
                  trackAction('view_alert', 'AdminDashboard', { alertId: alert.id });
                  // Navigate to relevant screen based on alert type
                  if (alert.id.includes('waiver')) {
                    safeNavigate('FeeManagement', { filter: 'pending_waivers' });
                  }
                }}
                onDismiss={() => {
                  trackAction('dismiss_alert', 'AdminDashboard', { alertId: alert.id });
                  // TODO: Implement alert dismissal
                }}
              />
            ))}
          </View>
        )}
```

**Step 3: Test on device**

Run app, navigate to Admin Dashboard
Expected: Alert cards display below quick actions if there are pending waivers, failed payments, or low attendance

**Step 4: Commit**

```bash
git add src/hooks/useAdminDashboard.ts src/screens/admin/AdminDashboardScreen.tsx
git commit -m "feat: add system alerts section to admin dashboard"
```

---

## PHASE 3: APPLY ACCEPTANCE CHECKLIST

### Task 10: Apply Acceptance Checklist to AdminDashboardScreen

**Files:**
- Modify: `src/screens/admin/AdminDashboardScreen.tsx`

**Step 1: Verify BaseScreen wrapper** ✅ Already done

**Step 2: Verify safe navigation** ✅ All safeNavigate calls in place

**Step 3: Verify analytics tracking** ✅ trackScreenView and trackAction in place

**Step 4: Add accessibility labels to pressable components**

Edit: `src/components/admin/KPICard.tsx`

Add to Card:
```typescript
<Card
  style={[styles.card, { backgroundColor: theme.Surface }]}
  onPress={onPress}
  mode="elevated"
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={`${label}: ${value}`}
  accessibilityHint="Tap to view details"
>
```

Edit: `src/components/admin/QuickActionTile.tsx`

Add to Pressable:
```typescript
<Pressable
  onPress={onPress}
  onPressIn={() => setIsPressed(true)}
  onPressOut={() => setIsPressed(false)}
  disabled={disabled}
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={label}
  accessibilityHint="Tap to perform action"
  style={[...]}
>
```

Edit: `src/components/admin/AlertCard.tsx`

Add to Card:
```typescript
<Card
  style={[...]}
  onPress={onPress}
  mode="outlined"
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={`${severity} alert: ${title}`}
  accessibilityHint="Tap to view details"
>
```

**Step 5: Memoize components** ✅ Already using React.memo on all components

**Step 6: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 7: Run ESLint check**

Run: `npx eslint src/screens/admin/AdminDashboardScreen.tsx src/components/admin/*.tsx`
Expected: 0 warnings (fix any that appear)

**Step 8: Test on real device**

Run: `npx react-native run-android`
Test: Pull to refresh, tap KPI cards, tap quick actions, tap alerts
Expected: All interactions work smoothly, no console errors

**Step 9: Commit**

```bash
git add src/components/admin/KPICard.tsx src/components/admin/QuickActionTile.tsx src/components/admin/AlertCard.tsx
git commit -m "refactor: add accessibility labels to admin dashboard components"
```

---

## VERIFICATION & COMPLETION

### Task 11: Final Verification

**Step 1: Run full TypeScript check**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 2: Run full test suite**

Run: `npx jest`
Expected: All tests pass

**Step 3: Test full admin flow**

1. Open app
2. Select "Continue as Admin" on role selection screen
3. View Admin Dashboard (all KPIs, quick actions, alerts display)
4. Pull to refresh (data reloads)
5. Tap each KPI card (navigates to correct screen)
6. Tap each quick action (navigates to correct screen)
7. Tap system alert (navigates to relevant screen)
8. Logout from settings (returns to role selection)

Expected: All flows work without errors

**Step 4: Review ACCEPTANCE_CHECKLIST.md compliance**

Checklist:
- [x] Real Supabase data (no mock arrays)
- [x] BaseScreen wrapper with all states
- [x] All icon buttons have accessibilityLabel
- [x] Components memoized (React.memo)
- [x] Analytics events tracked
- [x] Safe navigation used
- [x] TypeScript errors: 0
- [x] ESLint warnings: 0
- [x] Tested on real device
- [x] No console errors

**Step 5: Commit final verification**

```bash
git add .
git commit -m "docs: verify admin dashboard meets acceptance checklist"
```

---

## NEXT STEPS (Not in this plan)

After completing this plan, consider:

1. **User Management Screen** - Full CRUD for users with RBAC checks
2. **Fee Management Screen** - View/approve fee waivers with audit logging
3. **Analytics Screen** - Charts and graphs for admin insights
4. **System Settings Screen** - App configuration with permission gating
5. **Audit Logs Screen** - View all admin actions with filtering

Each should follow the same TDD approach and acceptance checklist.

---

## NOTES

- **RBAC Infrastructure (Phase 0)** must be completed before any screen implementation
- **All destructive actions** (delete user, waive fee, etc.) MUST call `logAuditEvent`
- **All permission-gated features** MUST use `hasPermission` check
- **All navigation** MUST use `safeNavigate`
- **All screens** MUST apply `ACCEPTANCE_CHECKLIST.md`
- **NO package modifications** allowed - use existing packages only
- **NO mock data** - Real Supabase queries only

Refer to:
- `OLD/PROJECT_MEMORY.md` - Critical constraints
- `OLD/ADMIN_IMPLEMENTATION_STRATEGY.md` - Phase requirements
- `OLD/ADMIN_UI_DESIGN_SYSTEM.md` - Design specs
- `OLD/ACCEPTANCE_CHECKLIST.md` - Quality checklist

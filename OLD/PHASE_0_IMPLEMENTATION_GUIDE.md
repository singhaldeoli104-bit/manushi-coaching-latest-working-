# Phase 0 Implementation Guide
**Admin App Foundation - RBAC, Audit Logging, and UI Utilities**
**Status:** ✅ Foundation Complete - Ready for Phase 1+

---

## 📋 What Was Delivered

### 1. ✅ **PermissionGate Component** (`src/components/admin/PermissionGate.tsx`)
Role-based conditional rendering for buttons, sections, and entire screens.

### 2. ✅ **Confirm Dialog Utility** (`src/utils/confirmDialog.ts`)
Promise-based confirmation dialogs for destructive admin actions.

### 3. ✅ **Snackbar Utility** (`src/utils/snackbar.ts`)
Toast notifications for success/error feedback.

### 4. ✅ **Audit Logger** (`src/utils/auditLogger.ts`) [Already existed]
Centralized audit logging system.

### 5. ✅ **RBAC System** (`src/utils/adminPermissions.ts`) [Already existed]
Role-based access control with 5 admin roles and 12 permissions.

---

## 🚀 Usage Examples

### 1. PermissionGate - Conditional Rendering

#### Hide Button Based on Permission
```typescript
import { PermissionGate } from '@/components/admin/PermissionGate';

<PermissionGate permission="manage_users">
  <Button onPress={deleteUser}>Delete User</Button>
</PermissionGate>
```

#### Multiple Permissions (ANY logic)
```typescript
<PermissionGate
  permissions={['manage_users', 'suspend_accounts']}
  mode="any"
>
  <Button onPress={suspendAccount}>Suspend</Button>
</PermissionGate>
```

#### Multiple Permissions (ALL logic)
```typescript
<PermissionGate
  permissions={['manage_security', 'manage_users']}
  mode="all"
>
  <Button onPress={changeRole}>Change Role</Button>
</PermissionGate>
```

#### With Fallback UI
```typescript
<PermissionGate
  permission="export_data"
  fallback={<Text style={{color: 'gray'}}>Access Denied</Text>}
>
  <Button onPress={exportReport}>Export Report</Button>
</PermissionGate>
```

#### Navigate to AccessDeniedScreen
```typescript
<PermissionGate
  permission="manage_users"
  navigateOnDenied
  requiredAction="User Management"
>
  <UserManagementScreen />
</PermissionGate>
```

#### Hook Version (Imperative Checks)
```typescript
import { usePermissionGate } from '@/components/admin/PermissionGate';

function AdminScreen() {
  const { hasPermission, adminRole } = usePermissionGate();

  const handleDelete = () => {
    if (hasPermission('manage_users')) {
      // Show delete button
    }
  };

  return (
    <View>
      <Text>Role: {adminRole}</Text>
      {hasPermission('export_data') && <ExportButton />}
    </View>
  );
}
```

---

### 2. Confirm Dialog - Destructive Actions

#### Basic Confirmation
```typescript
import { confirmDestructiveAction } from '@/utils/confirmDialog';

const handleDeleteUser = async () => {
  const confirmed = await confirmDestructiveAction({
    title: 'Delete User',
    message: 'Are you sure you want to delete this user? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
  });

  if (confirmed) {
    await deleteUser(userId);
    showSuccess('User deleted successfully');
    await logAudit({
      action: 'delete_user',
      targetId: userId,
      targetType: 'user',
    });
  }
};
```

#### Using Pre-configured Confirmations
```typescript
import { CommonConfirmations } from '@/utils/confirmDialog';

// Delete user
const confirmed = await CommonConfirmations.deleteUser('John Doe');

// Suspend user
const confirmed = await CommonConfirmations.suspendUser('Jane Smith');

// Send bulk notification
const confirmed = await CommonConfirmations.sendBulkNotification(500);

// Export data
const confirmed = await CommonConfirmations.exportData('Financial Reports');
```

#### Regular (Non-Destructive) Confirmation
```typescript
import { confirmAction } from '@/utils/confirmDialog';

const handleSendNotification = async () => {
  const confirmed = await confirmAction({
    title: 'Send Notification',
    message: 'Send notification to 500 parents?',
    confirmText: 'Send',
  });

  if (confirmed) {
    await sendNotification();
  }
};
```

---

### 3. Snackbar - Success/Error Feedback

#### Basic Usage
```typescript
import { showSuccess, showError, showWarning, showInfo } from '@/utils/snackbar';

// Success notification
showSuccess('User deleted successfully');

// Error notification
showError('Failed to delete user');

// Warning notification
showWarning('You have unsaved changes');

// Info notification
showInfo('System will restart in 5 minutes');
```

#### With Custom Duration
```typescript
// Show for 5 seconds
showSuccess('Password reset email sent', 5000);

// Show for 2 seconds
showInfo('Loading...', 2000);
```

#### With Action Button (Undo)
```typescript
showSuccess('User suspended', 4000, {
  label: 'Undo',
  onPress: async () => {
    await unsuspendUser(userId);
    showInfo('Suspension reversed');
  },
});
```

#### Using Pre-configured Snackbars
```typescript
import { CommonSnackbars } from '@/utils/snackbar';

// User Management
CommonSnackbars.userDeleted();
CommonSnackbars.userSuspended();
CommonSnackbars.passwordResetSent();
CommonSnackbars.roleChanged();

// Financial Operations
CommonSnackbars.feeWaiverApproved();
CommonSnackbars.refundProcessed();

// Support
CommonSnackbars.ticketAssigned();
CommonSnackbars.ticketResolved();

// Errors
CommonSnackbars.operationFailed();
CommonSnackbars.networkError();
CommonSnackbars.permissionDenied();
```

---

### 4. Audit Logger - Track All Actions

#### Basic Audit Logging
```typescript
import { logAudit } from '@/utils/auditLogger';

// Log user deletion
await logAudit({
  action: 'delete_user',
  targetId: userId,
  targetType: 'user',
  metadata: { userName: 'John Doe' },
});

// Log role change
await logAudit({
  action: 'change_role',
  targetId: userId,
  targetType: 'user',
  changes: {
    role: { from: 'parent', to: 'admin' },
  },
});

// Log fee waiver approval
await logAudit({
  action: 'approve_fee_waiver',
  targetId: waiverId,
  targetType: 'fee_waiver',
  metadata: { amount: 5000, reason: 'Financial hardship' },
});
```

#### Never Throws - Safe for All Operations
```typescript
// Audit logging NEVER throws or blocks operations
// Safe to call without try/catch
await logAudit({ action: 'create_user', targetId: userId });

// Operations continue even if audit logging fails
await createUser(userData);
await logAudit({ action: 'create_user', targetId: userId }); // Fails silently
```

---

### 5. RBAC System - Permission Checks

#### Using `can()` Helper
```typescript
import { can } from '@/utils/adminPermissions';

const adminRole = user?.user_metadata?.admin_role;

if (can(adminRole, 'manage_users')) {
  // Show user management section
}

if (!can(adminRole, 'view_financial_reports')) {
  return <AccessDeniedScreen />;
}
```

#### Using `canAny()` and `canAll()`
```typescript
import { canAny, canAll } from '@/utils/adminPermissions';

// User needs ANY of these permissions
if (canAny(adminRole, ['manage_users', 'suspend_accounts'])) {
  // Show suspend button
}

// User needs ALL of these permissions
if (canAll(adminRole, ['manage_security', 'manage_users'])) {
  // Allow role changes
}
```

#### Get All Permissions for a Role
```typescript
import { getPermissions, getRoleName } from '@/utils/adminPermissions';

const permissions = getPermissions(adminRole);
const roleName = getRoleName(adminRole);

console.log(`${roleName} has:`, permissions);
// Super Admin has: ['manage_users', 'view_financial_reports', ...]
```

---

## 🔧 Complete Example: Refactoring a Screen

### ❌ OLD WAY (Without Phase 0 Utilities)

```typescript
// UserManagementScreen.tsx - OLD

import React from 'react';
import { ScrollView, Alert } from 'react-native';

const UserManagementScreen = () => {
  const handleDeleteUser = async (userId: string) => {
    // ❌ No confirmation
    await deleteUserMutation(userId);

    // ❌ No feedback
    // ❌ No audit logging
    // ❌ No RBAC check
  };

  return (
    <ScrollView>
      {/* ❌ No RBAC - button always visible */}
      <Button onPress={() => handleDeleteUser('123')}>
        Delete User
      </Button>
    </ScrollView>
  );
};
```

### ✅ NEW WAY (With Phase 0 Utilities)

```typescript
// UserManagementScreen.tsx - NEW (Phase 1+)

import React from 'react';
import { BaseScreen } from '@/shared/components/BaseScreen';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { confirmDestructiveAction } from '@/utils/confirmDialog';
import { showSuccess, showError } from '@/utils/snackbar';
import { logAudit } from '@/utils/auditLogger';
import { useMutation } from '@tanstack/react-query';

const UserManagementScreen = () => {
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: async (data, userId) => {
      showSuccess('User deleted successfully');
      await logAudit({
        action: 'delete_user',
        targetId: userId,
        targetType: 'user',
      });
    },
    onError: () => {
      showError('Failed to delete user');
    },
  });

  const handleDeleteUser = async (userId: string, userName: string) => {
    // ✅ Confirmation dialog
    const confirmed = await confirmDestructiveAction({
      title: 'Delete User',
      message: `Delete ${userName}? This cannot be undone.`,
      confirmText: 'Delete',
    });

    if (!confirmed) return;

    // ✅ Execute mutation (with feedback & audit logging)
    deleteUserMutation.mutate(userId);
  };

  return (
    <BaseScreen scrollable loading={false} error={null}>
      {/* ✅ RBAC enforcement */}
      <PermissionGate permission="manage_users">
        <Button onPress={() => handleDeleteUser('123', 'John Doe')}>
          Delete User
        </Button>
      </PermissionGate>

      {/* ✅ Section-level RBAC */}
      <PermissionGate permission="export_data">
        <ExportSection />
      </PermissionGate>
    </BaseScreen>
  );
};
```

---

## 📊 Phase 0 Acceptance Criteria - ✅ COMPLETE

| Criteria | Status | Notes |
|----------|--------|-------|
| ✅ PermissionGate component | **DONE** | Single/multiple permissions, fallback, navigation |
| ✅ Confirm dialog utility | **DONE** | Promise-based, pre-configured confirmations |
| ✅ Snackbar utility | **DONE** | Success/error/warning/info, action buttons |
| ✅ Audit logger available | **DONE** | Already existed, centralized utility |
| ✅ RBAC system available | **DONE** | Already existed, 5 roles, 12 permissions |
| ✅ BaseScreen wrapper | **DONE** | Already exists in shared/components |
| ✅ Documentation | **DONE** | This guide with examples |

---

## 🎯 Next Steps (Phase 1+)

### Phase 1: User Management
1. **Refactor UserManagementScreen**
   - Apply BaseScreen wrapper
   - Add PermissionGate to all actions
   - Use confirmDialog for destructive actions
   - Use snackbar for feedback
   - Use logAudit for all actions
   - Replace mock data with real Supabase queries

2. **Add RBAC Enforcement**
   ```typescript
   <PermissionGate permission="manage_users" navigateOnDenied>
     <UserManagementScreen />
   </PermissionGate>
   ```

3. **Implement Delete User Flow**
   ```typescript
   const handleDelete = async (userId, userName) => {
     // 1. Confirm
     const confirmed = await confirmDestructiveAction({...});
     if (!confirmed) return;

     // 2. Execute
     const result = await deleteUser(userId);

     // 3. Feedback
     if (result.success) {
       showSuccess('User deleted');
       await logAudit({ action: 'delete_user', targetId: userId });
     } else {
       showError('Delete failed');
     }
   };
   ```

### Phase 2: Financial Reports
1. Apply same pattern to FinancialReportsScreen
2. Add `view_financial_reports` permission gate
3. Add audit logging for exports

### Phase 3: Support Center
1. Apply same pattern to SupportCenterScreen
2. Add `manage_support` permission gate
3. Add audit logging for ticket actions

---

## 🐛 Common Mistakes to Avoid

### ❌ DON'T: Check permissions manually
```typescript
if (user.role === 'super_admin') {
  // Manual check - hard to maintain
}
```

### ✅ DO: Use RBAC utilities
```typescript
if (can(adminRole, 'manage_users')) {
  // Centralized, consistent
}
```

---

### ❌ DON'T: Use Alert.alert for confirmation
```typescript
Alert.alert('Delete?', 'Are you sure?', [
  { text: 'Cancel' },
  { text: 'Delete', onPress: deleteUser }
]);
```

### ✅ DO: Use confirmDialog utility
```typescript
const confirmed = await confirmDestructiveAction({
  title: 'Delete User',
  message: 'Are you sure?',
});
if (confirmed) await deleteUser();
```

---

### ❌ DON'T: Insert audit logs manually
```typescript
await supabase.from('audit_logs').insert({
  action: 'delete_user',
  admin_id: user.id,
  // ... manual fields
});
```

### ✅ DO: Use logAudit utility
```typescript
await logAudit({
  action: 'delete_user',
  targetId: userId,
  targetType: 'user',
});
```

---

### ❌ DON'T: Skip feedback to user
```typescript
await deleteUser(userId);
// User has no idea if it worked
```

### ✅ DO: Always show feedback
```typescript
try {
  await deleteUser(userId);
  showSuccess('User deleted');
} catch (error) {
  showError('Failed to delete user');
}
```

---

## 🔍 Testing Checklist

- [ ] PermissionGate hides buttons for users without permissions
- [ ] Confirm dialogs show before destructive actions
- [ ] Snackbars appear after operations
- [ ] Audit logs are created in `audit_logs` table
- [ ] AccessDeniedScreen shows when navigateOnDenied=true
- [ ] Multiple permissions work with ANY/ALL logic
- [ ] Pre-configured confirmations work
- [ ] Pre-configured snackbars work
- [ ] Undo action in snackbar works

---

## 📚 Reference

**Files Created:**
- `src/components/admin/PermissionGate.tsx` - RBAC conditional rendering
- `src/utils/confirmDialog.ts` - Confirmation dialogs
- `src/utils/snackbar.ts` - Toast notifications

**Files Already Existing:**
- `src/utils/adminPermissions.ts` - RBAC system
- `src/utils/auditLogger.ts` - Audit logging
- `src/shared/components/BaseScreen.tsx` - Screen wrapper

**Documentation:**
- `ADMIN_IMPLEMENTATION_STRATEGY.md` - Overall strategy
- `PHASE_0_IMPLEMENTATION_GUIDE.md` - This guide (Phase 0 utilities)

---

**Phase 0 Status:** ✅ **FOUNDATION COMPLETE**
**Ready for:** Phase 1 (User Management), Phase 2 (Financial Reports), Phase 3 (Support Center)

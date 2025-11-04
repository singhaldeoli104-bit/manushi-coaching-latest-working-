# UserManagementScreenV2 - Sprint 1 Phase 3 Changes

## Summary

Updated UserManagementScreenV2 to use Sprint 1 utility providers (ConfirmDialog, Snackbar) instead of RNAlert and old utils.

## Changes Required

### 1. Update Imports
**Remove:**
- `Alert as RNAlert` from react-native
- `CommonConfirmations` from utils/confirmDialog

**Add:**
- `useConfirmDialog, useDestructiveAction` from shared/components/ConfirmDialog
- `useAdminFeedback` from shared/components/SnackbarProvider

### 2. Replace Inline Mutations
**Current:** Inline useMutation definitions with RNAlert feedback
**New:** Use imported hooks (useSuspendUser, useUnsuspendUser, useDeleteUser, useResetPassword, useChangeRole) + custom feedback

### 3. Replace All RNAlert.alert Calls
**Pattern:**
```typescript
// OLD
RNAlert.alert('Title', 'Message', [
  { text: 'Cancel' },
  { text: 'Action', onPress: async () => { ... }}
]);

// NEW
const confirmed = await showConfirm({
  title: 'Title',
  message: 'Message',
  confirmText: 'Action',
  confirmColor: 'error' | 'warning' | 'primary'
});

if (!confirmed) return;
// perform action
```

### 4. Add Success/Error Feedback
**After each mutation success:**
```typescript
userSuspended(user.full_name);
userDeleted(user.full_name);
passwordResetSent(user.email);
roleChanged(user.full_name, newRole);
```

**After each mutation error:**
```typescript
actionFailed('suspend user', error.message);
```

## Files Modified
1. ✅ `src/hooks/useUserManagement.ts` - Removed UI feedback from hooks
2. ⏳ `src/screens/admin/UserManagementScreenV2.tsx` - Add new providers

## Next Steps
Update UserManagementScreenV2.tsx with new providers.

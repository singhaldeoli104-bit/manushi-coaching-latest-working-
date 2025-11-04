# UserManagementScreen v2.0 - Implementation Plan

**Status:** Phase 2 - Core Management Screens with Real Data
**Target:** Replace mock data with real Supabase queries + RBAC + Audit logging
**Strategy:** Simplification - Focus on core features first

---

## Current State Analysis

**File:** `src/screens/admin/UserManagementScreen.tsx`
**Size:** 2133 lines
**Problem:** Extensive mock data, no real Supabase queries

### Mock Data Identified (4 arrays):
1. **Line 180:** `usersData: User[]` - Mock users array
2. **Line 306:** `rolesData: UserRole[]` - Mock roles array
3. **Line 353:** `bulkOpsData: BulkOperation[]` - Mock bulk operations
4. **Line 382:** `auditLogsData: AuditLogEntry[]` - Mock audit logs

### Handler Functions Needing Implementation (9 functions):
1. `handleDeleteUser(userId)` - Currently uses mock data
2. `handleToggleUserStatus(userId)` - Currently uses mock data
3. `handleBulkAction(action)` - Currently uses mock data
4. `handleCreateUser()` - Currently uses mock data
5. `handleEditUser(user)` - Currently uses mock data
6. `handleCreateRole()` - Currently uses mock data
7. `handleEditRole(role)` - Currently uses mock data
8. `handleDeleteRole(roleId)` - Currently uses mock data
9. `handleExportUsers()` - Currently uses mock data

---

## v2.0 Simplification Strategy

### Phase 2a (THIS PHASE): Core User Management
**Target Lines:** ~800 lines (down from 2133)
**Features:**
- Users list with real Supabase data
- Search and filter (role, status)
- Suspend user (with confirmation + audit)
- Unsuspend user (with confirmation + audit)
- Delete user (soft delete with confirmation + audit)
- RBAC gate at screen entry
- BaseScreen wrapper with loading/error states
- Analytics tracking

**NOT INCLUDED IN v2.0:**
- Create user flow (Phase 2b)
- Edit user flow (Phase 2b)
- Roles management tab (Phase 2c)
- Bulk operations (Phase 2d)
- Export functionality (Phase 2d)
- Audit logs viewer (Phase 4)

### Future Phases:
- **Phase 2b:** Add Create/Edit user flows
- **Phase 2c:** Add Roles management
- **Phase 2d:** Add Bulk operations + Export
- **Phase 4:** Add Audit logs viewer

---

## Data Contract

### 1. Fetch Users Query

**Interface:**
```typescript
interface FetchUsersParams {
  role?: 'student' | 'teacher' | 'parent' | 'admin';
  status?: 'active' | 'suspended';
  search?: string;
  limit?: number;
  offset?: number;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  status: 'active' | 'suspended';
  last_active_at: string | null;
  created_at: string;
}
```

**Supabase Query:**
```typescript
const fetchUsers = async (params: FetchUsersParams): Promise<User[]> => {
  let query = supabase
    .from('profiles')
    .select('id, full_name, email, role, status, last_active_at, created_at')
    .order('created_at', { ascending: false });

  if (params.role) {
    query = query.eq('role', params.role);
  }

  if (params.status) {
    query = query.eq('status', params.status);
  }

  if (params.search) {
    query = query.or(`full_name.ilike.%${params.search}%,email.ilike.%${params.search}%`);
  }

  if (params.limit) {
    query = query.limit(params.limit);
  }

  if (params.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 20) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

  return data || [];
};
```

**TanStack Query Integration:**
```typescript
const {
  data: users,
  isLoading,
  error,
  refetch,
} = useQuery({
  queryKey: ['admin', 'users', roleFilter, statusFilter, searchQuery],
  queryFn: () => fetchUsers({
    role: roleFilter,
    status: statusFilter,
    search: searchQuery,
    limit: 50,
  }),
  staleTime: 30000, // 30 seconds
});
```

---

### 2. Suspend User Mutation

**Interface:**
```typescript
interface SuspendUserParams {
  userId: string;
  reason?: string;
}
```

**Implementation:**
```typescript
const suspendUserMutation = useMutation({
  mutationFn: async ({ userId, reason }: SuspendUserParams) => {
    // 1. Update user status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ status: 'suspended' })
      .eq('id', userId);

    if (updateError) throw updateError;

    // 2. MANDATORY AUDIT LOG
    await logAudit({
      action: 'suspend_user',
      targetId: userId,
      targetType: 'user',
      changes: {
        status: { from: 'active', to: 'suspended' },
      },
      metadata: {
        reason: reason || 'No reason provided',
      },
    });

    return { success: true };
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    Alert.alert('Success', 'User suspended. Action logged in audit trail.');
  },
  onError: (error: any) => {
    Alert.alert('Error', error.message || 'Failed to suspend user');
  },
});

const handleSuspendUser = (userId: string) => {
  Alert.alert(
    'Suspend User',
    'This will immediately revoke access. Continue?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Suspend',
        style: 'destructive',
        onPress: () => {
          trackAction('suspend_user', 'UserManagementScreen', { userId });
          suspendUserMutation.mutate({ userId });
        },
      },
    ]
  );
};
```

---

### 3. Unsuspend User Mutation

**Implementation:**
```typescript
const unsuspendUserMutation = useMutation({
  mutationFn: async (userId: string) => {
    // 1. Update user status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ status: 'active' })
      .eq('id', userId);

    if (updateError) throw updateError;

    // 2. MANDATORY AUDIT LOG
    await logAudit({
      action: 'unsuspend_user',
      targetId: userId,
      targetType: 'user',
      changes: {
        status: { from: 'suspended', to: 'active' },
      },
    });

    return { success: true };
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    Alert.alert('Success', 'User unsuspended. Action logged in audit trail.');
  },
  onError: (error: any) => {
    Alert.alert('Error', error.message || 'Failed to unsuspend user');
  },
});

const handleUnsuspendUser = (userId: string) => {
  Alert.alert(
    'Unsuspend User',
    'This will restore user access. Continue?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unsuspend',
        onPress: () => {
          trackAction('unsuspend_user', 'UserManagementScreen', { userId });
          unsuspendUserMutation.mutate(userId);
        },
      },
    ]
  );
};
```

---

### 4. Delete User Mutation (Soft Delete)

**Implementation:**
```typescript
const deleteUserMutation = useMutation({
  mutationFn: async (userId: string) => {
    // Soft delete - set deleted_at timestamp
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', userId);

    if (updateError) throw updateError;

    // MANDATORY AUDIT LOG
    await logAudit({
      action: 'delete_user',
      targetId: userId,
      targetType: 'user',
      metadata: {
        deletion_type: 'soft_delete',
      },
    });

    return { success: true };
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    Alert.alert('Success', 'User deleted. Action logged in audit trail.');
  },
  onError: (error: any) => {
    Alert.alert('Error', error.message || 'Failed to delete user');
  },
});

const handleDeleteUser = (userId: string) => {
  Alert.alert(
    'Delete User',
    'This action will permanently remove the user. Continue?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          trackAction('delete_user', 'UserManagementScreen', { userId });
          deleteUserMutation.mutate(userId);
        },
      },
    ]
  );
};
```

---

## RBAC Integration

**Screen-Level RBAC Gate:**
```typescript
export const UserManagementScreenV2: React.FC = () => {
  const { user } = useAuth();
  const currentRole = (user as any)?.role as AdminRole;

  // RBAC check at screen entry
  useEffect(() => {
    if (!can(currentRole, 'manage_users')) {
      trackAction('access_denied', 'UserManagementScreen', {
        role: currentRole,
        requiredPermission: 'manage_users',
      });
      safeNavigate('AccessDeniedScreen', {
        requiredPermission: 'manage_users',
        userRole: currentRole,
        attemptedAction: 'User Management',
      });
    }
  }, [currentRole]);

  // ... rest of component
};
```

---

## UI Structure (Simplified)

```
UserManagementScreenV2
   BaseScreen (wrapper)
      Loading state (when fetching)
      Error state (on fetch error)
      Empty state (no users found)
   Content
       Header
          Title: "User Management"
          Subtitle: "Manage users and permissions"
       Filters Section
          Search Input (full_name, email)
          Role Filter Dropdown (all, student, teacher, parent, admin)
          Status Filter Dropdown (all, active, suspended)
       Stats Cards (3 cards)
          Total Users
          Active Users
          Suspended Users
       Users List (FlatList)
           UserCard (for each user)
               Avatar
               Name
               Email
               Role Badge
               Status Badge
               Last Active
               Actions Menu
                   Suspend (if active)
                   Unsuspend (if suspended)
                   Delete
```

---

## Implementation Checklist

**Before Starting:**
- [ ] Verify Supabase profiles table schema
- [ ] Check audit_logs table exists
- [ ] Verify RLS policies allow admin access

**Core Implementation:**
- [ ] Create UserManagementScreenV2.tsx
- [ ] Add RBAC gate at screen entry (can(role, 'manage_users'))
- [ ] Implement fetchUsers with TanStack Query
- [ ] Add search input with debounce
- [ ] Add role filter dropdown
- [ ] Add status filter dropdown
- [ ] Add stats cards (computed from users data)
- [ ] Add users FlatList with optimization
- [ ] Add UserCard component with React.memo
- [ ] Implement suspendUserMutation with confirmation + audit
- [ ] Implement unsuspendUserMutation with confirmation + audit
- [ ] Implement deleteUserMutation with confirmation + audit
- [ ] Add analytics tracking (trackScreenView, trackAction)
- [ ] Wrap with BaseScreen
- [ ] Add pull-to-refresh

**Acceptance Checklist:**
- [ ] Real Supabase data (no mock arrays)
- [ ] Data contract defined and locked
- [ ] RBAC check at screen entry
- [ ] BaseScreen wrapper with all states
- [ ] Confirmation dialogs for destructive actions
- [ ] Audit logging for all mutations
- [ ] All buttons have accessibilityLabel
- [ ] Components memoized (React.memo, useMemo)
- [ ] Analytics events tracked
- [ ] Safe navigation used
- [ ] TypeScript errors: 0
- [ ] ESLint warnings: 0
- [ ] Tested on real device
- [ ] No console errors
- [ ] Dark mode compatible
- [ ] Theme colors used (no hardcoded hex)
- [ ] Performance checked (queries cached with staleTime)

---

## Testing Plan

**Unit Tests:**
1. RBAC gate redirects if no permission
2. fetchUsers query works with filters
3. Suspend mutation calls Supabase + audit log
4. Unsuspend mutation calls Supabase + audit log
5. Delete mutation calls Supabase + audit log
6. Confirmation dialogs appear before mutations

**Integration Tests:**
1. Load screen with real data from Supabase
2. Search filters users correctly
3. Role filter updates query
4. Status filter updates query
5. Suspend user ’ confirmation ’ mutation ’ success alert ’ list refreshes
6. Unsuspend user ’ confirmation ’ mutation ’ success alert ’ list refreshes
7. Delete user ’ confirmation ’ mutation ’ success alert ’ list refreshes
8. Pull-to-refresh reloads data

**Manual Device Testing:**
1. Load speed (should be < 2s)
2. Search responsiveness (debounced)
3. Filter updates (no lag)
4. Mutation success feedback
5. Error handling (network errors, RLS errors)
6. Dark mode appearance
7. Accessibility labels (VoiceOver/TalkBack)

---

## File Structure

```
src/screens/admin/
   UserManagementScreen.tsx (OLD - 2133 lines, keep for now)
   UserManagementScreenV2.tsx (NEW - ~800 lines)

// After v2.0 is tested and validated:
// 1. Backup old file to backup/screens/
// 2. Replace UserManagementScreen.tsx with v2.0
// 3. Update AdminNavigator.tsx import
```

---

## Risk Mitigation

**Risk 1:** RLS policies block admin access
- **Mitigation:** Verify RLS policies before implementation
- **Fallback:** Use service role key for admin operations

**Risk 2:** Audit logging fails and blocks operations
- **Mitigation:** logAudit() is non-blocking, never throws
- **Fallback:** Operation succeeds even if audit fails

**Risk 3:** Performance with large user lists
- **Mitigation:** Use pagination (limit + offset)
- **Mitigation:** FlatList optimization (getItemLayout, keyExtractor)
- **Mitigation:** React.memo on UserCard

**Risk 4:** Network errors during mutations
- **Mitigation:** TanStack Query retry logic
- **Mitigation:** Error states with retry button
- **Mitigation:** User-friendly error messages

---

## Success Criteria

**Phase 2a is complete when:**
1. UserManagementScreenV2.tsx exists with real Supabase data
2. All acceptance checklist items pass
3. Tested on real device with 0 errors
4. Screen performs well (< 2s load, smooth scrolling)
5. All mutations work with confirmation + audit logging
6. RBAC gate prevents unauthorized access
7. Analytics tracking works
8. TypeScript and ESLint show 0 errors

---

**Next Steps:**
1. Check Supabase database schema
2. Implement UserManagementScreenV2.tsx
3. Test thoroughly
4. Apply acceptance checklist
5. Document Phase 2a completion

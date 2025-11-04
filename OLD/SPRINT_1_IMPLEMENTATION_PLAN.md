# Sprint 1 Implementation Plan - Admin UI Production Ready

**Date:** 2025-11-01
**Status:** Ready to Start
**Sprint Duration:** 2 weeks
**Goal:** Convert 3 core admin screens to production-ready with real data, RBAC, audit logging

---

## ✅ Phase 0 Complete (Foundation)

**What's Already Done:**
- ✅ Sprint 0 migrations applied (Financial RPCs, Audit Partitions, RLS, Keyset Pagination)
- ✅ ConfirmDialog utility created (`src/shared/components/ConfirmDialog.tsx`)
- ✅ SnackbarProvider utility created (`src/shared/components/SnackbarProvider.tsx`)
- ✅ Audit logger ready (`src/utils/auditLogger.ts`)
- ✅ BaseScreen component exists (`src/shared/components/BaseScreen.tsx`)
- ✅ Data contracts folder structure (`src/types/contracts/`)

---

## Sprint 1 Overview

### Week 1: Shared Utilities + Financial Reports
- Day 1-2: Wrap app with providers, update Financial Reports
- Day 3-4: Financial Reports CSV export + audit logging
- Day 5: Testing and refinement

### Week 2: User Management + Support Center
- Day 1-3: User Management screen (data contracts, queries, actions)
- Day 4-5: Support Center screen (tickets, assign, resolve)

---

## Phase 1: Provider Setup (Day 1 - 2 hours)

### 1.1 Wrap App with Providers

**File:** `src/navigation/AdminNavigator.tsx` (or root App.tsx)

**Changes:**
```tsx
import { ConfirmDialogProvider } from '../shared/components/ConfirmDialog';
import { SnackbarProvider } from '../shared/components/SnackbarProvider';

export const AdminNavigator = () => {
  return (
    <SnackbarProvider>
      <ConfirmDialogProvider>
        {/* Existing navigation */}
        <Stack.Navigator>
          {/* ... screens ... */}
        </Stack.Navigator>
      </ConfirmDialogProvider>
    </SnackbarProvider>
  );
};
```

**Verification:**
- [ ] App compiles without errors
- [ ] No runtime crashes
- [ ] Toast/confirm dialogs accessible via hooks

---

## Phase 2: Financial Reports V2 (Day 1-2)

### 2.1 Update Financial Reports to Use Real RPCs

**File:** `src/screens/admin/FinancialReportsScreenV2.tsx`

**Current State:** Uses `useFinancialMetrics()` hook
**Target:** Hook should call `get_financial_metrics` RPC from Sprint 0 migration

**Hook Update:**
```tsx
// src/hooks/useFinancialReports.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useFinancialMetrics = (
  periodType: 'monthly' | 'quarterly' | 'yearly',
  currency: string = 'INR'
) => {
  return useQuery({
    queryKey: ['financial_metrics', periodType, currency],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_financial_metrics', {
        p_period_type: periodType,
        p_currency: currency,
        p_start_date: null,
        p_end_date: null,
      });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

**Screen Updates:**
- [ ] Replace mock data with real RPC queries
- [ ] Add loading skeleton per card
- [ ] Add error states with retry
- [ ] Add empty states if no data

**Acceptance Criteria:**
- [ ] Real data from `get_financial_metrics` RPC
- [ ] Period selector works (monthly/quarterly/yearly)
- [ ] Charts update when period changes
- [ ] No console errors

---

### 2.2 Add CSV/PDF Export with Audit Logging

**Features:**
- Export button in screen header
- Confirm dialog before export
- Generate CSV from financial data
- Log export action to audit_logs
- Success toast notification

**Implementation:**
```tsx
import { useConfirmDialog } from '../../shared/components/ConfirmDialog';
import { useSnackbar } from '../../shared/components/SnackbarProvider';
import { logAudit } from '../../utils/auditLogger';

const { showConfirm } = useConfirmDialog();
const { showSuccess, showError } = useSnackbar();

const handleExport = async () => {
  const confirmed = await showConfirm({
    title: 'Export Financial Report',
    message: 'Export current financial metrics as CSV?',
    confirmText: 'Export',
  });

  if (!confirmed) return;

  try {
    // Generate CSV
    const csv = generateCSV(metrics);

    // Download/Share
    await shareCSV(csv, 'financial-report.csv');

    // Audit log
    await logAudit({
      action: 'export_financial_report',
      metadata: { period: periodType, currency, exported_at: new Date().toISOString() },
    });

    showSuccess('Financial report exported successfully');
  } catch (error) {
    showError('Failed to export report', error.message);
  }
};
```

**Acceptance Criteria:**
- [ ] Export button visible to finance_admin and super_admin only
- [ ] Confirm dialog shows before export
- [ ] CSV generated with correct data
- [ ] Audit log created
- [ ] Success toast shown

---

## Phase 3: User Management Screen (Day 3-4)

### 3.1 Create User Management Data Contracts

**File:** `src/types/contracts/userManagement.ts` (already exists from Sprint 0)

**Review and Enhance:**
```tsx
import { z } from 'zod';

export interface UserListItem {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  branch_id: string | null;
  branch_name: string | null;
  created_at: string;
  last_active: string | null;
}

export interface SuspendUserInput {
  user_id: string;
  reason: string;
  admin_id: string;
}

export const SuspendUserSchema = z.object({
  user_id: z.string().uuid(),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  admin_id: z.string().uuid(),
});
```

**Acceptance Criteria:**
- [ ] All user operations have Zod schemas
- [ ] TypeScript interfaces match database schema
- [ ] Validation works on all inputs

---

### 3.2 Create User Management Hooks

**File:** `src/hooks/useUserManagement.ts`

**Functions Needed:**
```tsx
// List users with filters
export const useUsers = (filters: UserFilters) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      // For now, direct query (will switch to RPC when users table exists)
      const { data, error } = await supabase
        .from('users')
        .select('*, branch:branches(name)')
        .match(filters)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 30 * 1000,
  });
};

// Suspend user
export const useSuspendUser = () => {
  const { showSuccess, showError } = useSnackbar();

  return useMutation({
    mutationFn: async (input: SuspendUserInput) => {
      // Validate
      SuspendUserSchema.parse(input);

      // Call RPC (when available) or direct update
      const { error } = await supabase
        .from('users')
        .update({ status: 'suspended' })
        .eq('id', input.user_id);

      if (error) throw error;

      // Audit log
      await logAudit({
        action: 'suspend_user',
        targetId: input.user_id,
        targetType: 'user',
        metadata: { reason: input.reason },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showSuccess('User suspended successfully');
    },
    onError: (error) => {
      showError('Failed to suspend user', error.message);
    },
  });
};
```

**All Mutations Needed:**
- `useSuspendUser()`
- `useUnsuspendUser()`
- `useDeleteUser()`
- `useResetPassword()`
- `useChangeRole()`

**Acceptance Criteria:**
- [ ] All mutations have error handling
- [ ] All mutations log to audit_logs
- [ ] All mutations show success/error toasts
- [ ] All mutations invalidate relevant queries

---

### 3.3 Update UserManagementScreen UI

**File:** `src/screens/admin/UserManagementScreen.tsx`

**Features:**
- User list with filters (search, role, status, branch)
- Actions dropdown per user (Suspend, Delete, Reset Password, Change Role)
- Confirm dialogs for all destructive actions
- RBAC gates (super_admin and branch_admin only)
- Audit logging for all actions

**Implementation Checklist:**
- [ ] Replace mock data with `useUsers()` hook
- [ ] Add loading skeleton
- [ ] Add empty state
- [ ] Add error state with retry
- [ ] Actions menu with confirm dialogs
- [ ] RBAC checks (use `useAdminRole()` hook)
- [ ] All actions call mutations from useUserManagement
- [ ] Audit logging on all actions

**Acceptance Criteria:**
- [ ] Real user data displayed
- [ ] Filters work correctly
- [ ] All actions require confirmation
- [ ] Super admin sees all users
- [ ] Branch admin sees only their branch users
- [ ] All actions audited
- [ ] Success/error feedback shown

---

## Phase 4: Support Center Screen (Day 4-5)

### 4.1 Create Support Tickets Hook

**File:** `src/hooks/useSupportTickets.ts`

```tsx
export const useTickets = (filters: TicketFilters) => {
  return useQuery({
    queryKey: ['support_tickets', filters],
    queryFn: async () => {
      let query = supabase
        .from('support_tickets')
        .select('*, assigned_to:profiles(full_name), created_by:profiles(full_name)');

      // Apply filters
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.priority) query = query.eq('priority', filters.priority);

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 30 * 1000,
  });
};

export const useAssignTicket = () => {
  return useMutation({
    mutationFn: async ({ ticketId, assigneeId }: { ticketId: string; assigneeId: string }) => {
      const { error } = await supabase
        .from('support_tickets')
        .update({ assigned_to_id: assigneeId })
        .eq('id', ticketId);

      if (error) throw error;

      await logAudit({
        action: 'assign_ticket',
        targetId: ticketId,
        targetType: 'ticket',
        metadata: { assigned_to: assigneeId },
      });
    },
  });
};
```

**Mutations Needed:**
- `useAssignTicket()`
- `useEscalateTicket()`
- `useResolveTicket()`

---

### 4.2 Update SupportCenterScreen UI

**File:** `src/screens/admin/SupportCenterScreen.tsx`

**Features:**
- Ticket list with filters (status, priority, assigned to)
- SLA indicators (red if breached, yellow if close)
- Assign action (dropdown of admins)
- Escalate action (with reason)
- Resolve action (with notes)

**Implementation Checklist:**
- [ ] Real ticket data from `useTickets()` hook
- [ ] SLA visual indicators
- [ ] Actions menu per ticket
- [ ] Assign modal with admin dropdown
- [ ] Escalate modal with reason field
- [ ] Resolve modal with notes field
- [ ] All actions audited
- [ ] RBAC gates

---

## Phase 5: Performance & Quality (Ongoing)

### 5.1 Per-Card Skeletons

**Pattern:** (from `useAdminDashboard.ts`)
```tsx
const { data: kpis, isLoading: kpisLoading } = useKPIs();
const { data: tickets, isLoading: ticketsLoading } = useTickets();

return (
  <>
    {kpisLoading ? <KPISkeleton /> : <KPICards data={kpis} />}
    {ticketsLoading ? <TicketListSkeleton /> : <TicketList data={tickets} />}
  </>
);
```

**Implementation:**
- [ ] Financial Reports: Separate loading states for metrics, charts, breakdown
- [ ] User Management: Skeleton for user list
- [ ] Support Center: Skeleton for ticket list

---

### 5.2 React Query Tuning

**Global Config:**
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false, // Disable for admin screens
      retry: 1, // Only retry once
    },
  },
});
```

**Per-Query Tuning:**
- Financial metrics: `staleTime: 5 * 60 * 1000` (5 min)
- User list: `staleTime: 30 * 1000` (30 sec)
- Support tickets: `staleTime: 30 * 1000` + realtime subscription

---

### 5.3 Analytics Tracking

**Add to all screens:**
```tsx
import { trackScreenView, trackAction } from '../utils/navigationAnalytics';

useEffect(() => {
  trackScreenView('FinancialReportsV2');
}, []);

const handleExport = () => {
  trackAction('export_financial_report', 'FinancialReportsV2');
  // ... rest of export logic
};
```

**Screens to Track:**
- [ ] FinancialReportsScreenV2
- [ ] UserManagementScreen
- [ ] SupportCenterScreen
- [ ] SecurityComplianceScreen

**Actions to Track:**
- [ ] export_financial_report
- [ ] suspend_user, unsuspend_user, delete_user
- [ ] assign_ticket, resolve_ticket
- [ ] export_audit_logs

---

### 5.4 BaseScreen Verification

**Check all admin screens use BaseScreen:**
```tsx
<BaseScreen
  scrollable
  loading={isLoading}
  error={error}
  empty={!data || data.length === 0}
  emptyMessage="No data available"
>
  {/* Screen content */}
</BaseScreen>
```

**Screens to Verify:**
- [ ] AdminDashboardScreen
- [ ] FinancialReportsScreenV2
- [ ] SecurityComplianceScreen
- [ ] UserManagementScreen (update if needed)
- [ ] SupportCenterScreen (update if needed)

---

## Phase 6: Audit Logging Verification

### 6.1 Replace Direct Inserts

**Pattern:**
```tsx
// ❌ OLD (direct insert)
await supabase.from('audit_logs').insert({ ... });

// ✅ NEW (use utility)
import { logAudit } from '../utils/auditLogger';
await logAudit({ action: 'suspend_user', targetId, targetType: 'user' });
```

**Files to Check:**
- [ ] AdminDashboardScreen.tsx
- [ ] FinancialReportsScreenV2.tsx
- [ ] SecurityComplianceScreen.tsx

---

## Phase 7: RBAC Enforcement

### 7.1 Create RBAC Hook

**File:** `src/hooks/useAdminPermissions.ts`

```tsx
export const useAdminPermissions = () => {
  const { data: profile } = useQuery({
    queryKey: ['current_admin_profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      return data;
    },
  });

  return {
    role: profile?.role,
    isSuperAdmin: profile?.role === 'super_admin',
    isBranchAdmin: profile?.role === 'branch_admin',
    isFinanceAdmin: profile?.role === 'finance_admin',
    canViewFinancials: ['super_admin', 'finance_admin'].includes(profile?.role),
    canManageUsers: ['super_admin', 'branch_admin'].includes(profile?.role),
    canManageTickets: ['super_admin', 'branch_admin'].includes(profile?.role),
    canViewAuditLogs: ['super_admin', 'compliance_admin'].includes(profile?.role),
  };
};
```

**Usage:**
```tsx
const { canManageUsers } = useAdminPermissions();

if (!canManageUsers) {
  return <AccessDeniedScreen />;
}
```

---

## Success Criteria

### Financial Reports ✅
- [ ] Uses `get_financial_metrics` RPC
- [ ] CSV export with audit logging
- [ ] Per-card skeletons
- [ ] Error states with retry
- [ ] Analytics tracking
- [ ] RBAC gate (finance_admin or super_admin)

### User Management ✅
- [ ] Real data contracts with Zod validation
- [ ] All CRUD operations via mutations
- [ ] Confirm dialogs for destructive actions
- [ ] All actions audited
- [ ] Success/error toasts
- [ ] RBAC enforcement
- [ ] Analytics tracking

### Support Center ✅
- [ ] Real ticket data
- [ ] SLA visual indicators
- [ ] Assign/escalate/resolve with modals
- [ ] All actions audited
- [ ] RBAC gates
- [ ] Analytics tracking

### Quality ✅
- [ ] All screens use BaseScreen
- [ ] Per-card skeletons everywhere
- [ ] React Query tuned (staleTime, refetchOnFocus)
- [ ] All audit inserts replaced with logAudit()
- [ ] Analytics on all screens and actions
- [ ] Zero TypeScript errors
- [ ] Zero ESLint warnings

---

## File Structure

```
src/
├── shared/
│   └── components/
│       ├── BaseScreen.tsx ✅
│       ├── ConfirmDialog.tsx ✅ NEW
│       └── SnackbarProvider.tsx ✅ NEW
├── screens/admin/
│   ├── AdminDashboardScreen.tsx (update audit)
│   ├── FinancialReportsScreenV2.tsx (update with RPCs)
│   ├── SecurityComplianceScreen.tsx (verify BaseScreen)
│   ├── UserManagementScreen.tsx (rebuild)
│   └── SupportCenterScreen.tsx (rebuild)
├── hooks/
│   ├── useAdminDashboard.ts ✅
│   ├── useFinancialReports.ts (update)
│   ├── useUserManagement.ts (create)
│   ├── useSupportTickets.ts (create)
│   └── useAdminPermissions.ts (create)
├── types/contracts/
│   ├── dashboardKpis.ts ✅
│   ├── userManagement.ts ✅
│   ├── supportTickets.ts ✅
│   └── README.md ✅
└── utils/
    ├── auditLogger.ts ✅
    └── navigationAnalytics.ts ✅
```

---

**Created:** 2025-11-01
**Sprint:** Sprint 1 - Admin UI Production
**Next:** Begin Phase 1 (Provider Setup)

# Admin Implementation Strategy
**Status:** Parent App Complete ✅ → Ready to Start Admin App
**Version:** 2.0 - Production-Grade with RBAC, Audit, and UI Blueprint

---

## 📊 Current State Analysis

### What Exists:
1. ✅ **AdminNavigator** - Full stack navigator (27 screens registered)
2. ✅ **32 Admin Screens** - Already created with mock data
3. ✅ **Phase90AdminDashboard** - Main dashboard with analytics
4. ✅ **AdminStackParamList** - 28 screen types defined
5. ✅ **No Tab Navigation** - Pure stack navigation (simpler than Parent)

### What's Missing (CRITICAL):
1. ❌ **Role/Permission Enforcement** - No RBAC for admin sub-roles
2. ❌ **Real Supabase Data** - All screens use mock/generated data
3. ❌ **Data Contracts** - No defined query/mutation specs per screen
4. ❌ **Audit Trails** - No logging of destructive actions
5. ❌ **Modern UI Components** - Not using BaseScreen wrapper
6. ❌ **Analytics Tracking** - No safe navigation or event tracking
7. ❌ **Theme Integration** - Hardcoded colors instead of dynamic theme
8. ❌ **TopAppBar Integration** - Using default React Navigation headers
9. ❌ **Error Boundaries** - No error handling wrappers
10. ❌ **Empty/Access Denied States** - Missing fallback UIs
11. ❌ **Bottom Navigation** - No tab bar for better UX
12. ❌ **Performance Optimization** - Dashboard will be slow with multiple queries

---

## 🚨 CRITICAL ADDITIONS - Must Implement Before Building

### 1. Role-Based Access Control (RBAC) - PHASE 0

**Problem:** Plan treats admin as one role, but reality requires sub-roles.

**Admin Roles:**
- **Super Admin** - Full system access
- **Branch Admin** - School/campus level admin
- **Finance Admin** - Financial reports, payments only
- **Academic Coordinator** - Academic ops, attendance, grades
- **Compliance/Audit** - View-only audit logs, compliance reports

**Implementation:**
```typescript
// src/utils/adminPermissions.ts

export type AdminRole =
  | 'super_admin'
  | 'branch_admin'
  | 'finance_admin'
  | 'academic_coordinator'
  | 'compliance_admin';

export type AdminPermission =
  | 'manage_users'
  | 'view_financial_reports'
  | 'manage_branches'
  | 'view_audit_logs'
  | 'manage_security'
  | 'send_notifications'
  | 'manage_content'
  | 'suspend_accounts';

const ADMIN_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    'manage_users',
    'view_financial_reports',
    'manage_branches',
    'view_audit_logs',
    'manage_security',
    'send_notifications',
    'manage_content',
    'suspend_accounts',
  ],
  branch_admin: [
    'manage_users',
    'manage_branches',
    'send_notifications',
    'view_audit_logs',
  ],
  finance_admin: [
    'view_financial_reports',
  ],
  academic_coordinator: [
    'manage_content',
    'send_notifications',
  ],
  compliance_admin: [
    'view_audit_logs',
  ],
};

export function can(role: AdminRole, permission: AdminPermission): boolean {
  return ADMIN_PERMISSIONS[role]?.includes(permission) ?? false;
}

// Usage in screens:
const { user } = useAuth();
if (!can(user.role, 'manage_users')) {
  return <AccessDeniedScreen />;
}
```

**Where to Apply:**
- UserManagementScreen → `can(role, 'manage_users')`
- FinancialReportsScreen → `can(role, 'view_financial_reports')`
- SecurityComplianceScreen → `can(role, 'manage_security')`
- SupportCenterScreen → `can(role, 'send_notifications')`

**Tab Visibility:**
```typescript
// Hide entire tabs based on role
const shouldShowAnalyticsTab = can(currentRole, 'view_financial_reports');
const shouldShowSystemTab = can(currentRole, 'manage_security');
```

---

### 2. Data Contracts - Lock Before Coding

**Problem:** "Real Supabase data" is vague. Define exact contracts now.

#### UserManagementScreen Data Contract
```typescript
// Query
interface FetchUsersParams {
  role?: 'student' | 'teacher' | 'parent' | 'admin';
  status?: 'active' | 'suspended';
  search?: string;
  limit?: number;
  offset?: number;
}

// SQL
SELECT
  id,
  full_name,
  email,
  role,
  status,
  last_active_at,
  created_at
FROM users
WHERE
  ($role IS NULL OR role = $role)
  AND ($status IS NULL OR status = $status)
  AND ($search IS NULL OR full_name ILIKE $search OR email ILIKE $search)
ORDER BY created_at DESC
LIMIT $limit OFFSET $offset;

// Mutations
- suspend_user(userId: UUID) → UPDATE users SET status='suspended'
- unsuspend_user(userId: UUID) → UPDATE users SET status='active'
- delete_user(userId: UUID) → UPDATE users SET deleted_at=NOW()

// Audit
LOG TO audit_logs {
  admin_id: current_user.id,
  action: 'suspend_user',
  target_id: user_id,
  target_type: 'user',
  changes: { status: { from: 'active', to: 'suspended' } }
}
```

#### FinancialReportsScreen Data Contract
```typescript
// Query
SELECT
  DATE_TRUNC('day', created_at) as date,
  SUM(amount) as revenue,
  COUNT(*) as transaction_count,
  AVG(amount) as avg_transaction
FROM payments
WHERE
  created_at >= $start_date
  AND created_at <= $end_date
  AND status = 'completed'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

// Filters
- Date range picker (today / 7d / 30d / custom)
- Branch filter (if branch_admin)
- Payment method filter
```

#### System Metrics Dashboard Data Contract
```typescript
// Multiple queries (use React Query with parallel)
const { data: activeUsers } = useQuery(['activeUsers'], () =>
  supabase.from('users').select('count', { count: 'exact' }).eq('status', 'active')
);

const { data: revenue } = useQuery(['revenue'], () =>
  supabase.from('payments')
    .select('amount.sum()')
    .eq('status', 'completed')
    .gte('created_at', startOfMonth)
);

const { data: openTickets } = useQuery(['openTickets'], () =>
  supabase.from('support_tickets').select('count').eq('status', 'open')
);
```

**Add to Strategy:**
Create a "Data Contracts to Lock This Week" section before coding any screen.

---

### 3. Enhanced Acceptance Checklist

**Current checklist is good but missing critical states:**

Before marking any admin screen complete:
- [ ] **Real Supabase data** (no mock arrays)
- [ ] **Data contract defined and locked** (queries, filters, mutations documented)
- [ ] **RBAC check at screen entry** (`can(role, permission)`)
- [ ] **BaseScreen wrapper** with all states:
  - [ ] Loading state (skeleton)
  - [ ] Error state (with retry button)
  - [ ] Empty state (with contextual CTA)
  - [ ] **Access Denied state** (if RBAC fails)
  - [ ] **Degraded state** (if Supabase is up but query fails)
- [ ] **Audit trail for destructive actions:**
  - [ ] Confirmation dialog before action
  - [ ] Write to `audit_logs` table
  - [ ] Success toast/snackbar
- [ ] **All buttons have accessibilityLabel**
- [ ] **FlatList optimized** (if list screen)
- [ ] **Components memoized** (React.memo)
- [ ] **Analytics events tracked** (trackAction, trackScreenView)
- [ ] **Safe navigation used** (safeNavigate)
- [ ] **TypeScript errors: 0**
- [ ] **ESLint warnings: 0**
- [ ] **Tested on real device**
- [ ] **No console errors**
- [ ] **Dark mode compatible**
- [ ] **Theme colors used** (no hardcoded hex except design tokens)
- [ ] **Performance checked** (no >100ms rerenders, queries cached with staleTime)

---

### 4. Audit Logging - Mandatory for All Destructive Actions

**Every destructive action MUST:**

1. **Ask for confirmation**
```typescript
const handleSuspendUser = (userId: string) => {
  Alert.alert(
    'Suspend User',
    'This will immediately revoke access. Continue?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Suspend',
        style: 'destructive',
        onPress: async () => {
          await suspendUser(userId);
        },
      },
    ]
  );
};
```

2. **Write audit log**
```typescript
const suspendUser = async (userId: string) => {
  const { error } = await supabase
    .from('users')
    .update({ status: 'suspended' })
    .eq('id', userId);

  if (error) throw error;

  // MANDATORY AUDIT LOG
  await supabase.from('audit_logs').insert({
    admin_id: currentUser.id,
    action: 'suspend_user',
    target_id: userId,
    target_type: 'user',
    changes: { status: { from: 'active', to: 'suspended' } },
    ip_address: await getIpAddress(),
  });

  // Success feedback
  Alert.alert('Success', 'User suspended. Action recorded in audit log.');
};
```

3. **Show toast confirmation**
```typescript
Toast.show({
  type: 'success',
  text1: 'Action Recorded',
  text2: 'This action has been logged for compliance.',
});
```

**Destructive Actions Requiring Audit:**
- Delete user
- Suspend/Unsuspend user
- Disable branch
- Change role/permissions
- Turn off feature flag
- Delete content
- Override payment
- Reset password

---

### 5. Dashboard Performance Strategy

**Problem:** Phase90AdminDashboard will hit 5+ queries on mount = slow.

**Solution - Parallel Queries with Skeletons:**

```typescript
// Split into separate hooks
const useAdminDashboardKpis = () => {
  return useQueries({
    queries: [
      { queryKey: ['activeUsers'], queryFn: fetchActiveUsers, staleTime: 60_000 },
      { queryKey: ['revenue'], queryFn: fetchRevenue, staleTime: 60_000 },
      { queryKey: ['openTickets'], queryFn: fetchOpenTickets, staleTime: 30_000 },
      { queryKey: ['attendance'], queryFn: fetchAttendance, staleTime: 60_000 },
    ],
  });
};

const useAdminDashboardActivity = () => {
  return useQuery({
    queryKey: ['recentActivity'],
    queryFn: fetchRecentActivity,
    staleTime: 30_000, // Don't refetch on every focus
  });
};

const useAdminSystemHealth = () => {
  return useQuery({
    queryKey: ['systemHealth'],
    queryFn: fetchSystemHealth,
    refetchInterval: 60_000, // Auto-refresh every minute
  });
};
```

**Render Strategy:**
```typescript
const AdminDashboardScreen = () => {
  const kpis = useAdminDashboardKpis();
  const activity = useAdminDashboardActivity();
  const health = useAdminSystemHealth();

  return (
    <BaseScreen scrollable>
      {/* KPI Cards - Show skeletons per card, not block entire screen */}
      <Row>
        {kpis.map((query, i) => (
          <KPICard
            key={i}
            loading={query.isLoading}
            data={query.data}
            error={query.error}
          />
        ))}
      </Row>

      {/* Activity - Independent loading */}
      {activity.isLoading ? <ActivitySkeleton /> : <ActivityList data={activity.data} />}

      {/* System Health - Independent loading */}
      {health.isLoading ? <HealthSkeleton /> : <HealthMonitor data={health.data} />}
    </BaseScreen>
  );
};
```

**Key Points:**
- Render skeletons **per card**, not block whole screen
- Mark low-priority data with `staleTime: 60_000` (don't refetch on every focus)
- Pull KPI fetch strategy into Phase 1 (not Phase 3) because dashboard is hero screen

---

### 6. Bottom Tab Navigation - Explicit Structure

**Current plan mentions tabs but doesn't show how navigation changes.**

#### New AdminNavigator Structure
```typescript
// AdminNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Each tab has its own stack
function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminDashboard" component={Phase90AdminDashboard} />
      <Stack.Screen name="RealTimeMonitoring" component={RealTimeMonitoringScreen} />
      <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />
    </Stack.Navigator>
  );
}

function ManagementStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserManagement" component={UserManagementScreen} />
      <Stack.Screen name="OrganizationManagement" component={OrganizationManagementScreen} />
      <Stack.Screen name="OperationsManagement" component={OperationsManagementScreen} />
      <Stack.Screen name="UserDetail" component={UserDetailScreen} />
    </Stack.Navigator>
  );
}

function AnalyticsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdvancedAnalytics" component={AdvancedAnalyticsScreen} />
      <Stack.Screen name="FinancialReports" component={FinancialReportsScreen} />
      <Stack.Screen name="KPIDetail" component={KPIDetailScreen} />
    </Stack.Navigator>
  );
}

function SystemStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SystemSettings" component={SystemSettingsScreen} />
      <Stack.Screen name="SecurityCompliance" component={SecurityComplianceScreen} />
      <Stack.Screen name="SupportCenter" component={SupportCenterScreen} />
    </Stack.Navigator>
  );
}

function MoreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminProfile" component={AdminProfileScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
export default function AdminNavigator() {
  const { user } = useAuth();
  const currentRole = user?.role as AdminRole;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{ title: 'Dashboard', tabBarIcon: 'view-dashboard' }}
      />
      <Tab.Screen
        name="ManagementTab"
        component={ManagementStack}
        options={{ title: 'Manage', tabBarIcon: 'account-group' }}
      />

      {/* RBAC: Hide tab if no permission */}
      {can(currentRole, 'view_financial_reports') && (
        <Tab.Screen
          name="AnalyticsTab"
          component={AnalyticsStack}
          options={{ title: 'Analytics', tabBarIcon: 'chart-line' }}
        />
      )}

      {can(currentRole, 'manage_security') && (
        <Tab.Screen
          name="SystemTab"
          component={SystemStack}
          options={{ title: 'System', tabBarIcon: 'cog' }}
        />
      )}

      <Tab.Screen
        name="MoreTab"
        component={MoreStack}
        options={{ title: 'More', tabBarIcon: 'dots-horizontal' }}
      />
    </Tab.Navigator>
  );
}
```

**Impact on Navigation Types:**
```typescript
// src/types/navigation.ts

export type AdminTabParamList = {
  DashboardTab: NavigatorScreenParams<DashboardStackParamList>;
  ManagementTab: NavigatorScreenParams<ManagementStackParamList>;
  AnalyticsTab: NavigatorScreenParams<AnalyticsStackParamList>;
  SystemTab: NavigatorScreenParams<SystemStackParamList>;
  MoreTab: NavigatorScreenParams<MoreStackParamList>;
};

export type DashboardStackParamList = {
  AdminDashboard: undefined;
  RealTimeMonitoring: undefined;
  AlertDetail: { alertId: string };
};

export type ManagementStackParamList = {
  UserManagement: undefined;
  OrganizationManagement: undefined;
  OperationsManagement: undefined;
  UserDetail: { userId: string };
};

// ... etc for each stack
```

**Safe Navigation Changes:**
```typescript
// Now routes within correct stack
safeNavigate('UserManagement'); // Goes to ManagementTab → UserManagement
safeNavigate('FinancialReports'); // Goes to AnalyticsTab → FinancialReports
```

---

### 7. Material Design 3 Visual Standards - Explicit Tokens

**All admin screens MUST follow these exact standards:**

#### Spacing
- **Page padding:** 16dp outer
- **Row padding:** 12dp inside rows
- **Section gap:** 16dp between sections
- **Card gap:** 12dp between cards in list

#### Cards
- **Radius:** 12dp (exact)
- **Elevation/Border:** From `theme.Surface` + `theme.Outline` (no raw hex)
- **Padding:** 16dp internal

#### Typography
- **Section Title:** 18sp / 600 weight / theme.OnSurface
- **Card Title:** 16sp / 600 weight / theme.OnSurface
- **Body:** 14-16sp / 400 weight / theme.OnSurface
- **Meta/Time:** 12-13sp / 400 weight / theme.OnSurfaceVariant

#### Touch Targets
- **Minimum:** 48dp x 48dp (all tappable elements)
- **Icon buttons:** 48dp x 48dp with 24dp icon
- **List rows:** 56-64dp height

#### Colors
- **Use tokens only:** `theme.Primary`, `theme.Surface`, `theme.OnSurface`, etc.
- **No raw hex except design tokens**
- **Error:** theme.Error
- **Success:** theme.Success
- **Warning:** theme.Warning

**Code Template:**
```typescript
const styles = StyleSheet.create({
  container: {
    padding: 16, // Outer padding
    gap: 16, // Section gap
  },
  card: {
    borderRadius: 12, // Exact
    padding: 16, // Internal padding
    gap: 12, // Row gap inside card
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    // Use theme.OnSurface, NOT hardcoded color
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    fontSize: 12,
    fontWeight: '400',
  },
  touchTarget: {
    minHeight: 48,
    minWidth: 48,
  },
});
```

---

### 8. Support Center as Action Surface (Not Read-Only)

**Current plan:** "Ticket management, User support, FAQ management"

**Production-Grade Requirements:**

#### SupportCenterScreen Must Allow:
1. **View all tickets** with filters
   - Unassigned / Assigned to Me / All Open / Resolved
   - High Priority / Medium / Low
   - By date range

2. **Assign tickets** to specific admin
   ```typescript
   const handleAssignTicket = async (ticketId: string, adminId: string) => {
     await supabase
       .from('support_tickets')
       .update({ assigned_to: adminId })
       .eq('id', ticketId);

     await supabase.from('audit_logs').insert({
       admin_id: currentUser.id,
       action: 'assign_ticket',
       target_id: ticketId,
       target_type: 'ticket',
       changes: { assigned_to: adminId },
     });
   };
   ```

3. **Escalate to higher priority**
   ```typescript
   const handleEscalate = async (ticketId: string) => {
     await supabase
       .from('support_tickets')
       .update({ severity: 'high' })
       .eq('id', ticketId);

     await supabase.from('system_alerts').insert({
       type: 'support',
       severity: 'high',
       title: 'Ticket Escalated',
       description: `Ticket ${ticketId} escalated to high priority`,
     });
   };
   ```

4. **Resolve tickets**
   ```typescript
   const handleResolve = async (ticketId: string, resolutionNotes: string) => {
     await supabase
       .from('support_tickets')
       .update({
         status: 'resolved',
         resolved_at: new Date().toISOString(),
         resolution_notes: resolutionNotes,
       })
       .eq('id', ticketId);

     // Audit log
     await supabase.from('audit_logs').insert({
       admin_id: currentUser.id,
       action: 'resolve_ticket',
       target_id: ticketId,
     });
   };
   ```

**Why this matters:**
Replaces WhatsApp chaos with traceable, auditable communication. High-value feature for admins.

---

## 🎨 PRODUCTION UI BLUEPRINT - Admin App

### Global Navigation Model

```
AdminTabNavigator (Bottom Tabs)
│
├─ 📊 DashboardTab (DashboardStack)
│   ├─ AdminDashboardScreen            ← main landing
│   ├─ RealTimeMonitoringScreen        ← live system health
│   └─ AlertDetailScreen               ← specific alert view
│
├─ 👥 ManagementTab (ManagementStack)
│   ├─ UserManagementScreen            ← user CRUD, RBAC-gated
│   ├─ OrganizationManagementScreen    ← branches, academic years
│   ├─ OperationsManagementScreen      ← ops control panel
│   └─ UserDetailScreen
│
├─ 📈 AnalyticsTab (AnalyticsStack)
│   ├─ AdvancedAnalyticsScreen         ← usage, engagement trends
│   ├─ FinancialReportsScreen          ← revenue, dues, fee insights
│   └─ KPIDetailScreen
│
├─ ⚙️ SystemTab (SystemStack)
│   ├─ SystemSettingsScreen            ← feature flags, config
│   ├─ SecurityComplianceScreen        ← audit logs, RBAC, lockouts
│   ├─ SupportCenterScreen             ← support tickets, assign/escalate/resolve
│   └─ AuditLogDetailScreen
│
└─ ⋯ MoreTab (MoreStack)
    ├─ AdminProfileScreen
    ├─ AboutScreen
    └─ DevToolsScreen
```

**Key Design Decisions:**
- Each tab = own stack (proper navigation hierarchy)
- RBAC hides entire tabs based on role
- safeNavigate routes within correct stack
- Bottom nav icons from Material Design Icons

---

### 1. DashboardTab Landing (AdminDashboardScreen)

**Goal:** First-glance status + urgent items + fast actions for leadership

```
┌───────────────────────────────────────────────┐
│ TOP APP BAR                                   │
│ [☰] Admin Dashboard        [🔔 3] [Avatar]    │
│ Welcome, {AdminName}                          │
│ [Main Campus ▼]                               │
└───────────────────────────────────────────────┘

▼ scroll content (padding 16, gap 16)

1. KPI Grid (2x2 on mobile, 4-up total)
   ┌─────────────────────────────────────┐
   │ Active Users      1,284   ↑3%       │
   │ Revenue (MTD)     ₹4.2L   ↑12%      │
   │ Open Tickets      5       ⚠ 2 high  │
   │ Attendance Rate   92%     ✓ Target  │
   └─────────────────────────────────────┘
   - each KPI = <KPIStatCard />
   - tap → deep link (e.g. Active Users → UserManagementScreen)
   - each card loads independently with its own skeleton
   - data source: useAdminDashboardKpis()

2. Quick Actions
   ┌─────────────────────────────────────┐
   │ Quick Actions                       │
   │ [ Add User ]  [ Send Notice ]       │
   │ [ Lock User ] [ New Term ]          │
   └─────────────────────────────────────┘
   - tile = <QuickActionTile />
   - each tile wrapped with <PermissionGate permission="..."/>
   - destructive actions:
     - confirm dialog
     - call secure RPC (does change + audit insert)
     - toast "Action recorded"

3. System Health / Live Monitor
   ┌─────────────────────────────────────┐
   │ System Health            [View →]   │
   │ • API Uptime: 99.98%                │
   │ • Active Sessions: 312 now          │
   │ • Queue Backlog: 0 alerts           │
   │ • DB Status: Healthy ✓              │
   └─────────────────────────────────────┘
   - component: <SystemHealthCard />
   - auto-refresh every 60s
   - refetchInterval in React Query
   - tap [View →] → RealTimeMonitoringScreen

4. Recent Activity
   ┌─────────────────────────────────────┐
   │ Recent Activity          [All →]    │
   │ • "Riya suspended user 8A-parent"   │
   │   11:02 AM · IP 192.168...          │
   │ • "Fee structure updated (Delhi)"   │
   │   10:47 AM                          │
   │ • "Created teacher account: A.Verma"│
   │   10:35 AM                          │
   └─────────────────────────────────────┘
   - component: <RecentActivityCard />
   - data: last ~5 rows from audit_logs
   - row tap → AuditLogDetailScreen
   - each log row shows:
     actionName, actor, timestamp, small context
   - RBAC: show only if can(role, 'view_audit_logs')

5. Active Alerts
   ┌─────────────────────────────────────┐
   │ Alerts                   [All →]    │
   │ [CRITICAL] Unauthorized login       │
   │ 5 min ago · 3 failed attempts       │
   │ [Resolve] [Escalate]                │
   │                                     │
   │ [HIGH] Payment gateway delay        │
   │ [MEDIUM] New branch "Pune Campus"   │
   └─────────────────────────────────────┘
   - component: <AlertsCard />
   - data: system_alerts WHERE resolved=false ORDER BY created_at DESC LIMIT 3
   - [Resolve]/[Escalate]/[Approve]:
     - confirm → secure RPC → audit_logs insert
   - tap [All →] → AlertDetailScreen / Alerts list
```

**Why This Layout Works:**
1. **KPIs at top** - "How are we doing?" (fast status check for leadership)
2. **Quick Actions** - "What can I do right now?" (admin workflow shortcuts)
3. **System Health** - "Is the platform on fire?" (uptime/performance)
4. **Recent Activity** - Audit/compliance visibility
5. **Alerts** - Immediate risks / approvals requiring action

**Philosophy:**
First glance = status + urgent + fast actions (mirrors parent/teacher home).

---

### 2. ManagementTab Landing

**Goal:** Unified control center for people + org + operations (where branch admins live day-to-day)

```
┌───────────────────────────────────────────────┐
│ TOP APP BAR                                   │
│ [☰] Management             [🔍] [⋯]           │
│ Branch: [Main Campus ▼]                       │
└───────────────────────────────────────────────┘

▼ scroll content (padding 16, gap 16)

1. People Overview
   ┌─────────────────────────────────────┐
   │ People & Access                     │
   │ Teachers:        124                │
   │ Parents:         2,450              │
   │ Students:        2,812              │
   │ Suspended Users: 3     ⚠            │
   │                                     │
   │ [Manage Users →]                    │
   └─────────────────────────────────────┘
   - component: <PeopleSummaryCard />
   - data: aggregated counts from users table
   - tapping → UserManagementScreen
   - RBAC: only visible if can(role, 'manage_users')

2. Branch / Organization Setup
   ┌─────────────────────────────────────┐
   │ Organization                        │
   │ Branches:        5 active           │
   │ Academic Year:   2024-2025 (live)   │
   │ Default Branch:  Main Campus        │
   │                                     │
   │ [Manage Branches →]   [New Branch]  │
   │ [Academic Year →]     [New Year]    │
   └─────────────────────────────────────┘
   - component: <OrgSummaryCard />
   - data: branches table, academic_years table
   - "New Branch" / "New Year":
     - show only if can(role, 'manage_branches')
     - open forms that on submit:
       - call secure RPC to insert branch/year
       - write audit_logs

3. Daily Operations Panel
   ┌─────────────────────────────────────┐
   │ Operations                          │
   │ Attendance Sync:  ✅ OK (5m ago)    │
   │ Fee Collection:  ✅ Active          │
   │ Transport:       🟡 Delay >15m      │
   │ Announcements:   3 scheduled today │
   │                                     │
   │ [Operations Console →]              │
   └─────────────────────────────────────┘
   - component: <OperationsStatusCard />
   - data: ops tables / system_metrics
   - tapping → OperationsManagementScreen

4. Quick Org Actions
   ┌─────────────────────────────────────┐
   │ Quick Actions                       │
   │ [ Add User ]    [ Send Notice ]     │
   │ [ New Branch ]  [ Maintenance Mode ]│
   └─────────────────────────────────────┘
   - component: <ManagementQuickActionsCard />
   - each tile = 48dp+ touch target
   - each tile behind <PermissionGate/>
   - Maintenance Mode:
     - confirm dialog
     - secure RPC sets system_settings.maintenance=true
     - audit_logs.insert("enable_maintenance")
     - toast "System in maintenance, logged"

5. High-Risk Items
   ┌─────────────────────────────────────┐
   │ Attention Required                  │
   │ • 3 suspended accounts need review  │
   │ • Branch "Pune Campus" pending      │
   │   approval                          │
   │ • Transport: 2 buses late           │
   │                                     │
   │ [Review Suspended Users]            │
   │ [Approve Branch]                    │
   │ [View Transport Status]             │
   └─────────────────────────────────────┘
   - component: <ManagementAlertsCard />
   - "Review Suspended Users" → filtered UserManagementScreen
   - "Approve Branch" → Org approval flow
```

**Key Notes:**
- This landing merges people + org + operations into one control center
- Branch Admin will live here more than Dashboard
- RBAC decides which cards render at all

---

### ManagementTab Detailed Screens

#### UserManagementScreen
```
┌─────────────────────────────────────────────────────────┐
│ TOP APP BAR                                             │
│ [←]  User Management              [🔍] [⋯]              │
└─────────────────────────────────────────────────────────┘

Search Bar
┌─────────────────────────────────────────────────────────┐
│ [🔍] Search by name, email, or ID...                    │
└─────────────────────────────────────────────────────────┘

Filter Chips (horizontal scroll)
┌─────────────────────────────────────────────────────────┐
│ [All Roles ▼] [Active ✓] [Teachers] [Parents] [Admins] │
└─────────────────────────────────────────────────────────┘

User List (FlatList optimized)
┌─────────────────────────────────────────────────────────┐
│  👤 Riya Sharma                      [ACTIVE] Teacher   │
│     riya.sharma@school.com                              │
│     Last active: 2 hours ago                            │
│     ───────────────────────────────────────────────      │
│                                                         │
│  👤 Amit Verma                    [SUSPENDED] Parent    │
│     amit.verma@gmail.com                                │
│     Suspended: 3 days ago                               │
│     ───────────────────────────────────────────────      │
│                                                         │
│  Tap row → UserDetailScreen                             │
│  Long press → Quick actions (Suspend/Reset Password)    │
└─────────────────────────────────────────────────────────┘

Floating Action Button
┌─────────────────────────────────────────────────────────┐
│                                          [+ Add User]    │
└─────────────────────────────────────────────────────────┘
```

**Data Contract:**
- Query: `fetchUsers({ role, status, search, limit, offset })`
- Filters: Role dropdown, Status chips
- Actions: Suspend, Unsuspend, Reset Password, Delete (all with audit logs)

**Permission Gate:** `can(currentRole, 'manage_users')`

#### OrganizationManagementScreen
```
Branch List
┌─────────────────────────────────────────────────────────┐
│  🏫 Main Campus                              [Default]  │
│     New Delhi · 2,450 students · 124 teachers           │
│     [Edit] [View Details]                               │
│     ───────────────────────────────────────────────      │
│                                                         │
│  🏫 Pune Branch                                         │
│     Pune · 890 students · 52 teachers                   │
│     [Edit] [View Details]                               │
│     ───────────────────────────────────────────────      │
│                                                         │
│  [+ Add Branch]                                         │
└─────────────────────────────────────────────────────────┘

Academic Years
┌─────────────────────────────────────────────────────────┐
│  📅 2024-2025                                [Current]  │
│     Start: Apr 1, 2024 · End: Mar 31, 2025              │
│     [Edit] [End Early]                                  │
│     ───────────────────────────────────────────────      │
│                                                         │
│  [+ Add Academic Year]                                  │
└─────────────────────────────────────────────────────────┘
```

**Permission Gate:** `can(currentRole, 'manage_branches')`

#### OperationsManagementScreen
```
Operations Control Panel
┌─────────────────────────────────────────────────────────┐
│  ATTENDANCE SYSTEM                      [🟢 Running]    │
│  Last sync: 5 min ago                                   │
│  [Force Sync] [View Logs]                               │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  FEE COLLECTION                         [🟢 Active]     │
│  Pending: ₹4.2L · Overdue: ₹1.8L                        │
│  [Send Reminders] [Generate Report]                     │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  TRANSPORT MODULE                       [🟡 Warning]    │
│  3 buses delayed by >15 min                             │
│  [View Routes] [Send Alert]                             │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  ANNOUNCEMENTS                          [🟢 Scheduled]  │
│  Today: 3 scheduled · Sent: 12                          │
│  [Create Announcement] [View Queue]                     │
└─────────────────────────────────────────────────────────┘

Maintenance Mode
┌─────────────────────────────────────────────────────────┐
│  ⚙️ MAINTENANCE MODE                    [OFF]           │
│  Enable to pause operations for updates                │
│  [Enable] (requires confirmation + audit log)           │
└─────────────────────────────────────────────────────────┘
```

**High-Level Toggles:**
- Maintenance mode → Writes to `system_settings` + `audit_logs`
- Force sync → Triggers background job
- Send reminders → Bulk notification

---

### 3. AnalyticsTab Landing

**Goal:** High-level business intelligence and finance insights (hidden if no finance/report access)

```
┌───────────────────────────────────────────────┐
│ TOP APP BAR                                   │
│ [☰] Analytics             [📤 Export] [⋯]     │
│ Reporting Period: [Last 7 Days ▼]             │
└───────────────────────────────────────────────┘

▼ scroll content (padding 16, gap 16)

1. Growth / Engagement Metrics
   ┌─────────────────────────────────────┐
   │ Growth & Engagement                 │
   │ New Registrations:   +152 (↑15%)    │
   │ Daily Active Users:  1,284 / day    │
   │ Avg Sessions/User:   4.2            │
   │ Retention (30d):     92%            │
   │                                     │
   │ [View Usage Trends →]               │
   └─────────────────────────────────────┘
   - component: <EngagementMetricsCard />
   - data: aggregated analytics (materialized view or Supabase SQL)
   - tap → KPIDetailScreen (charts)

2. Revenue Overview
   ┌─────────────────────────────────────┐
   │ Revenue                             │
   │ MTD Revenue:         ₹4.25L (↑12%)  │
   │ Outstanding Dues:    ₹4.2L (⚠ high) │
   │ Overdue >30d:        ₹1.8L          │
   │ Branch Top Performer: Main Campus   │
   │                                     │
   │ [Financial Reports →] [Send Remind] │
   └─────────────────────────────────────┘
   - component: <RevenueCard />
   - RBAC: show only if can(role, 'view_financial_reports')
   - "Send Remind":
     - action to trigger fee reminder campaign
     - confirm → RPC → audit_logs.insert("send_fee_reminder_batch")

3. Attendance & Academic Health
   ┌─────────────────────────────────────┐
   │ Academic Health                     │
   │ Avg Attendance:        92%          │
   │ Classes Below Target:  4 ⚠          │
   │ Most At-Risk Grade:    Grade 8      │
   │                                     │
   │ [View Attendance Trends →]          │
   └─────────────────────────────────────┘
   - component: <AcademicHealthCard />
   - pulls attendance aggregates grouped by class/grade
   - helps academic coordinators, even if they can't see finance

4. Export / Compliance
   ┌─────────────────────────────────────┐
   │ Reports & Exports                   │
   │ [ Export CSV ] [ Export PDF ]       │
   │ [ Email Report to Finance ]         │
   │                                     │
   │ Note: Exports include PII. Actions  │
   │ are logged to audit_logs.           │
   └─────────────────────────────────────┘
   - component: <ExportReportsCard />
   - after export, log:
     - admin_id
     - action: "export_financial_report"
     - timestamp
     - rangeWindow (7d/30d/etc)
```

**Key Notes:**
- This tab is where high-level leadership / finance admin lives
- Every export is auditable
- Time range picker at the top drives the whole tab

---

### AnalyticsTab Detailed Screens

#### AdvancedAnalyticsScreen
```
Time Range Picker
┌─────────────────────────────────────────────────────────┐
│  [Today] [7 Days ✓] [30 Days] [Custom Range]            │
└─────────────────────────────────────────────────────────┘

Trend Cards
┌─────────────────────────────────────────────────────────┐
│  GROWTH                                                 │
│  +15.2% new registrations                               │
│  [View Chart →]                                         │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  ENGAGEMENT                                             │
│  4.2 avg sessions/user/day                              │
│  [View Details →]                                       │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  RETENTION                                              │
│  92% active users (last 30d)                            │
│  [View Cohorts →]                                       │
└─────────────────────────────────────────────────────────┘

Export Actions
┌─────────────────────────────────────────────────────────┐
│  [📊 Export CSV] [📄 Export PDF] [📧 Email Report]      │
└─────────────────────────────────────────────────────────┘
```

**Permission Gate:** `can(currentRole, 'view_financial_reports')`
**Data:** Uses real Supabase aggregations (no mock data)

#### FinancialReportsScreen
```
Revenue Overview
┌─────────────────────────────────────────────────────────┐
│  TOTAL REVENUE (MTD)                                    │
│  ₹4,25,000                          ↑12% vs last month  │
│                                                         │
│  [Line Chart: Daily Revenue Trend]                      │
└─────────────────────────────────────────────────────────┘

By Branch
┌─────────────────────────────────────────────────────────┐
│  Main Campus: ₹2.8L (66%)                               │
│  Pune Branch: ₹1.45L (34%)                              │
│  [View Breakdown →]                                     │
└─────────────────────────────────────────────────────────┘

Outstanding Dues
┌─────────────────────────────────────────────────────────┐
│  Total Pending: ₹4.2L                                   │
│  Overdue (>30d): ₹1.8L ⚠                                │
│  [Send Reminders] [View Details]                        │
└─────────────────────────────────────────────────────────┘
```

**Tap Card:** Opens FinancialDrilldownScreen (per branch/class)

---

### 4. SystemTab Landing

**Goal:** System safety, settings, security, compliance, support

```
┌───────────────────────────────────────────────┐
│ TOP APP BAR                                   │
│ [☰] System & Security     [🔔] [Avatar]       │
│ Environment: [Production ▼]                   │
└───────────────────────────────────────────────┘

▼ scroll content (padding 16, gap 16)

1. Live System Status
   ┌─────────────────────────────────────┐
   │ Platform Status                     │
   │ Uptime:            99.98%           │
   │ API Latency:       210ms            │
   │ Queue Backlog:     0                │
   │ Push Notifications: Healthy ✓       │
   │ Database Health:   ✓ Green          │
   │                                     │
   │ [View Real-Time Monitor →]          │
   └─────────────────────────────────────┘
   - component: <PlatformStatusCard />
   - data from system_metrics (live), refetchInterval 60s
   - tap → RealTimeMonitoringScreen

2. Security & Compliance
   ┌─────────────────────────────────────┐
   │ Security & Compliance               │
   │ Open Alerts:        3 (1 critical)  │
   │ Failed Logins (24h): 12             │
   │ Locked Accounts:     3              │
   │ Last RBAC Change:    2h ago         │
   │                                     │
   │ [View Audit Logs →] [Manage RBAC →] │
   └─────────────────────────────────────┘
   - component: <SecurityComplianceCard />
   - visible if can(role, 'view_audit_logs')
   - "Manage RBAC" only if can(role, 'manage_security')

3. Feature Toggles / Config
   ┌─────────────────────────────────────┐
   │ System Settings                     │
   │ • Student Portal         [ ON ]     │
   │ • Online Payments        [ ON ]     │
   │ • Push Notifications     [ ON ]     │
   │ • Maintenance Mode       [ OFF ]    │
   │                                     │
   │ [Edit Settings →]                   │
   └─────────────────────────────────────┘
   - component: <SystemSettingsCard />
   - ON/OFF toggles should NOT toggle in-place on this landing
     (avoid accidental fat-finger)
   - tap "Edit Settings →" opens SystemSettingsScreen
     where toggles do:
       - confirm dialog
       - secure RPC to update config
       - audit log: "toggle_feature"

4. Support Center Summary
   ┌─────────────────────────────────────┐
   │ Support Center                      │
   │ Open Tickets:        5              │
   │ High Priority:       2 🔴           │
   │ Unassigned:          1              │
   │ Avg Response Time:   14m            │
   │                                     │
   │ [Go to Support Center →]            │
   └─────────────────────────────────────┘
   - component: <SupportSummaryCard />
   - tap → SupportCenterScreen

5. Compliance Reminders
   ┌─────────────────────────────────────┐
   │ Compliance Actions Needed           │
   │ • 2 policies pending review         │
   │ • 1 data export logged (finance)    │
   │ • 0 overdue security updates  ✓     │
   │                                     │
   │ [Review Compliance →]               │
   └─────────────────────────────────────┘
   - component: <ComplianceReminderCard />
   - "Review Compliance →" → SecurityComplianceScreen
   - visible if can(role, 'view_audit_logs')
```

**Key Notes:**
- This tab is DevOps + Compliance + Support in one place
- Every "dangerous" thing (toggling student portal, enabling maintenance mode, unlocking accounts) must go: confirm → secure RPC → audit log → toast

---

### SystemTab Detailed Screens

#### SystemSettingsScreen
```
Feature Toggles
┌─────────────────────────────────────────────────────────┐
│  🎓 STUDENT PORTAL                      [ON]  Toggle →  │
│  Allow student self-service features                    │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  💳 ONLINE PAYMENTS                     [ON]  Toggle →  │
│  Accept online fee payments                             │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  🔔 PUSH NOTIFICATIONS                  [ON]  Toggle →  │
│  Send push notifications to users                       │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  Toggle changes → Confirmation dialog + audit log       │
└─────────────────────────────────────────────────────────┘

App Version Control
┌─────────────────────────────────────────────────────────┐
│  MINIMUM APP VERSION                                    │
│  Android: 1.0.0 · iOS: 1.0.0                            │
│  [Update] (force upgrade for older versions)            │
└─────────────────────────────────────────────────────────┘
```

**Permission Gate:** `can(currentRole, 'manage_security')`

#### SecurityComplianceScreen
```
Audit Logs
┌─────────────────────────────────────────────────────────┐
│  "Audit Trail"                [Filter ▼] [Search]       │
│                                                         │
│  • Riya Sharma suspended user "8A-parent"               │
│    2025-01-15 11:02 AM · IP: 192.168.1.10               │
│    Changes: { status: 'active' → 'suspended' }          │
│    [View Details →]                                     │
│    ───────────────────────────────────────────────      │
│                                                         │
│  • Amit Patel updated fee structure                     │
│    2025-01-15 10:47 AM · IP: 192.168.1.15               │
│    Changes: { grade_6_fee: 5000 → 5500 }               │
│    [View Details →]                                     │
│                                                         │
│  Filters: Action type, Date range, Admin                │
└─────────────────────────────────────────────────────────┘

Account Lockouts
┌─────────────────────────────────────────────────────────┐
│  LOCKED ACCOUNTS                                        │
│  3 accounts locked (failed login attempts)              │
│  [View List] [Unlock All]                               │
└─────────────────────────────────────────────────────────┘

RBAC Management
┌─────────────────────────────────────────────────────────┐
│  ROLE PERMISSIONS                                       │
│  [Edit Permissions] (manage_security permission only)   │
│  Super Admin: 8 permissions                             │
│  Branch Admin: 4 permissions                            │
│  Finance Admin: 1 permission                            │
└─────────────────────────────────────────────────────────┘
```

#### 5. SupportCenterScreen (ACTION SURFACE - High Value)

**Goal:** Transform WhatsApp/email chaos into traceable, auditable support workflow

```
┌───────────────────────────────────────────────┐
│ TOP APP BAR                                   │
│ [←] Support Center        [Filter ▼] [⋯]      │
│ Queue: 5 Open | 2 High 🔴                      │
└───────────────────────────────────────────────┘

▼ scroll content (padding 16, gap 16)

1. Filter Chips
   ┌─────────────────────────────────────┐
   │ [Unassigned ✓] [Mine] [All Open]    │
   │ [Resolved] [High Priority]          │
   └─────────────────────────────────────┘
   - component: <SupportFilterBar />
   - changing chips refetches query with new params

2. Ticket List
   ┌─────────────────────────────────────┐
   │ 🔴 [HIGH] Cannot access parent app  │
   │ Reported by: Amit Verma (Parent)    │
   │ 15 min ago · Unassigned             │
   │ [Assign to Me] [Escalate]           │
   │-------------------------------------│
   │ 🟡 [MEDIUM] Fee not reflecting      │
   │ Reported by: Riya Sharma            │
   │ 1h ago · Assigned to: Rajesh Kumar  │
   │ [View] [Resolve]                    │
   │-------------------------------------│
   │ 🟢 [LOW] Bus location inaccurate     │
   │ ...                                 │
   └─────────────────────────────────────┘
   - each row = <TicketRow />
   - [Assign to Me] / [Escalate] / [Resolve]:
     - open confirm dialog
     - call secure RPC that:
       - updates ticket row
       - writes audit_logs row
       - for escalate: also inserts into system_alerts
     - show toast "Recorded"

3. Metrics Footer
   ┌─────────────────────────────────────┐
   │ SLA / Health                        │
   │ Avg First Response:   14m           │
   │ Tickets Resolved (24h): 27          │
   │ High Pri Unresolved: 2              │
   └─────────────────────────────────────┘
   - component: <SupportMetricsCard />
   - this is real ops signal
```

**Ticket Actions (All Audited):**
- **Assign to Me** → Updates `assigned_to`, writes audit log
- **Escalate** → Updates `severity: 'high'`, creates system alert, writes audit log
- **Resolve** → Updates `status: 'resolved'`, requires resolution notes, writes audit log

**Why This Matters:**
Support Center is NOT "read messages." It's an action board for admins. Every button triggers an auditable workflow. Replaces WhatsApp/email chaos with traceable support system.

---

### MoreTab Screens

```
Profile & Settings
┌─────────────────────────────────────────────────────────┐
│  👤 Rajesh Kumar                                        │
│     Super Admin · Main Campus                           │
│     rajesh.kumar@school.com                             │
│     [Edit Profile]                                      │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  🔒 Change Password                                     │
│  🌓 Dark Mode                            [Toggle →]     │
│  🌐 Language                             [English ▼]    │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  ℹ️ About                                               │
│     Version 1.0.0 (Build 42)                            │
│  📄 Legal & Privacy                                     │
│  🚪 Logout                                              │
└─────────────────────────────────────────────────────────┘
```

**Low Risk Tab:** Generic account settings, no sensitive operations.

---

## 📐 Visual + Interaction Standards (ALL SCREENS MUST FOLLOW)

### Spacing
- **Page padding:** `16dp` outer
- **Row padding:** `12dp` inside rows
- **Section gap:** `16dp` between sections
- **Card gap:** `12dp` between cards in list

### Cards
- **Border radius:** `12dp` (exact, no exceptions)
- **Elevation/Border:** From `theme.Surface` + `theme.Outline` tokens
- **No raw hex colors** except design system tokens
- **Padding:** `16dp` internal

### Typography
- **Section title:** `18sp / fontWeight: '600' / color: theme.OnSurface`
- **Row title:** `16sp / fontWeight: '600' / color: theme.OnSurface`
- **Body:** `14-16sp / fontWeight: '400' / color: theme.OnSurface`
- **Meta/time/secondary:** `12-13sp / fontWeight: '400' / color: theme.OnSurfaceVariant`

### Touch Targets
- **Minimum:** `48dp x 48dp` (all tappable elements)
- **Icon buttons:** `48dp x 48dp` with `24dp` icon
- **List rows:** `56-64dp` height

### Colors
**Use theme tokens ONLY:**
- Primary: `theme.Primary`
- Surface: `theme.Surface`
- Text: `theme.OnSurface`
- Secondary text: `theme.OnSurfaceVariant`
- Error: `theme.Error`
- Success: `theme.Success`
- Warning: `theme.Warning`

**NO raw hex except for design tokens in theme files.**

### Destructive Actions
**Every destructive action MUST:**
1. Show confirmation dialog
2. Write to `audit_logs` table
3. Show success toast/snackbar

**Example:**
```typescript
const handleDeleteUser = (userId: string) => {
  Alert.alert(
    'Delete User',
    'This action cannot be undone. Continue?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteUser(userId);
          // Audit log written inside deleteUser()
          Toast.show({ text1: 'User deleted. Action recorded.' });
        },
      },
    ]
  );
};
```

---

## 📋 Phase-by-Phase Plan (Updated with RBAC & Audit)

### Phase 0: RBAC & Audit Setup (Week 0 - BEFORE ANY SCREENS)

**Critical Foundation - Must Complete First**

#### Tasks:
1. **Create RBAC System**
   ```typescript
   // src/utils/adminPermissions.ts
   - Define AdminRole type
   - Define AdminPermission type
   - Create ADMIN_PERMISSIONS map
   - Implement can(role, permission) function
   ```

2. **Create Audit Logging System**
   ```sql
   -- migrations/create_audit_logs.sql
   CREATE TABLE audit_logs (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     admin_id UUID REFERENCES users(id),
     action TEXT NOT NULL,
     target_id UUID,
     target_type TEXT,
     changes JSONB,
     ip_address TEXT,
     timestamp TIMESTAMPTZ DEFAULT NOW()
   );

   CREATE INDEX idx_audit_logs_admin ON audit_logs(admin_id);
   CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
   ```

3. **Create Helper Functions**
   ```typescript
   // src/utils/auditLogger.ts
   export async function logAudit(params: {
     action: string;
     targetId?: string;
     targetType?: string;
     changes?: Record<string, any>;
   }): Promise<void>;
   ```

4. **Create Access Denied Screen**
   ```typescript
   // src/screens/common/AccessDeniedScreen.tsx
   - Standard "You don't have permission" UI
   - Suggest contacting admin
   - Track unauthorized access attempts
   ```

**Deliverables:**
- ✅ RBAC system working
- ✅ Audit logging functional
- ✅ AccessDeniedScreen created
- ✅ Helper functions tested

---

### Phase 1: Foundation Setup (Week 1)

**Goal:** Modernize core navigation and dashboard with RBAC

#### Tasks:
1. **Enable Admin Mode in App.tsx**
   ```typescript
   const SHOW_ADMIN_DIRECTLY = true;
   ```

2. **Convert AdminNavigator to Tabs**
   - Create DashboardStack, ManagementStack, AnalyticsStack, SystemStack, MoreStack
   - Implement tab visibility based on RBAC
   - Add TopAppBar to each screen
   - Add overflow menu with Profile/Settings/Logout

3. **Modernize Phase90AdminDashboard**
   - Lock data contracts for all KPIs
   - Split into separate hooks (useAdminDashboardKpis, useAdminDashboardActivity, useAdminSystemHealth)
   - Implement per-card skeletons
   - Add staleTime: 60_000 for low-priority data
   - Apply BaseScreen wrapper
   - Use T, Card components
   - Add analytics tracking
   - **RBAC:** Show Quick Actions only if permissions exist

4. **Database Schema**
   - Create system_metrics table
   - Create user_activity table
   - Create system_alerts table
   - Set up indexes

**Deliverables:**
- ✅ Admin mode toggle working
- ✅ Bottom tabs with RBAC visibility
- ✅ Modern dashboard with real data + performance optimizations
- ✅ TopAppBar with overflow menu
- ✅ Safe navigation implemented

---

### Phase 2: Core Management Screens (Week 1-2)

**Goal:** Modernize user and organization management with audit

#### Priority Screens:

**1. UserManagementScreen (HIGHEST PRIORITY)**

**Data Contract:**
```sql
-- Query
SELECT
  id, full_name, email, role, status, last_active_at
FROM users
WHERE
  ($role IS NULL OR role = $role)
  AND ($status IS NULL OR status = $status)
  AND ($search IS NULL OR full_name ILIKE '%' || $search || '%')
ORDER BY created_at DESC
LIMIT $limit OFFSET $offset;

-- Mutations
UPDATE users SET status = 'suspended' WHERE id = $userId;
UPDATE users SET status = 'active' WHERE id = $userId;
UPDATE users SET deleted_at = NOW() WHERE id = $userId;
```

**Implementation Checklist:**
- [ ] RBAC check: `can(role, 'manage_users')` at screen entry
- [ ] Data contract locked and documented
- [ ] BaseScreen with empty/error/access-denied states
- [ ] Search + filters (role, status)
- [ ] FlatList optimized
- [ ] Suspend action → Confirmation + audit log + toast
- [ ] Delete action → Confirmation + audit log + toast
- [ ] Reset password → Confirmation + audit log
- [ ] Analytics tracking
- [ ] Dark mode tested

**2. OrganizationManagementScreen**
- [ ] RBAC check: `can(role, 'manage_branches')`
- [ ] Branch CRUD with audit
- [ ] Academic year management
- [ ] Real Supabase data

**3. OperationsManagementScreen**
- [ ] Control panel for daily ops
- [ ] Maintenance mode toggle → Audit log
- [ ] Force sync → Audit log
- [ ] Status monitoring

---

### Phase 3: Analytics & Reports (Week 2)

**Goal:** Real-time analytics with RBAC

#### Screens:

**1. AdvancedAnalyticsScreen**
- [ ] RBAC check: `can(role, 'view_financial_reports')`
- [ ] Time range picker
- [ ] Trend cards (growth, engagement, retention)
- [ ] Export CSV/PDF
- [ ] Real aggregations from Supabase

**2. FinancialReportsScreen**
- [ ] RBAC check: `can(role, 'view_financial_reports')`
- [ ] Revenue by branch/class
- [ ] Outstanding dues tracking
- [ ] Charts using react-native-chart-kit

**3. RealTimeMonitoringDashboard**
- [ ] Live system stats
- [ ] Active users
- [ ] Auto-refresh every 60s

---

### Phase 4: System Settings & Security (Week 3)

**Goal:** Admin configuration and security with strict RBAC

#### Screens:

**1. SystemSettingsScreen**
- [ ] RBAC check: `can(role, 'manage_security')`
- [ ] Feature toggles → Confirmation + audit
- [ ] App version control
- [ ] Rate limits

**2. SecurityComplianceScreen**
- [ ] RBAC check: `can(role, 'view_audit_logs')`
- [ ] Audit logs viewer
- [ ] Account lockouts
- [ ] RBAC management (super_admin only)

**3. SupportCenterScreen** (ACTION SURFACE)
- [ ] Ticket list with filters
- [ ] Assign ticket → Audit log
- [ ] Escalate → System alert + audit
- [ ] Resolve → Resolution notes + audit
- [ ] Real-time updates

---

## ✅ Enhanced Acceptance Checklist

Before marking any admin screen complete:

**Data & Logic:**
- [ ] **RBAC check at screen entry** (`can(role, permission)`)
- [ ] **Data contract defined and locked** (queries, filters, mutations documented)
- [ ] **Real Supabase data** (no mock arrays)
- [ ] **Audit trail for destructive actions:**
  - [ ] Confirmation dialog
  - [ ] Write to `audit_logs`
  - [ ] Success toast/snackbar

**UI States:**
- [ ] **BaseScreen wrapper** with all states:
  - [ ] Loading state (skeleton per section, not block whole screen)
  - [ ] Error state (with retry button)
  - [ ] Empty state (with contextual CTA)
  - [ ] **Access Denied state** (if RBAC fails)
  - [ ] **Degraded state** (if Supabase is up but query fails)

**Performance:**
- [ ] **FlatList optimized** (if list screen)
- [ ] **Components memoized** (React.memo for expensive renders)
- [ ] **Queries cached** with `staleTime` for low-priority data
- [ ] **Dashboard uses per-card skeletons** (not block whole screen)

**Accessibility & Quality:**
- [ ] **All buttons have accessibilityLabel**
- [ ] **Min touch target 48dp x 48dp**
- [ ] **Analytics events tracked** (trackAction, trackScreenView)
- [ ] **Safe navigation used** (safeNavigate)
- [ ] **TypeScript errors: 0**
- [ ] **ESLint warnings: 0**

**Testing:**
- [ ] **Tested on real device**
- [ ] **Dark mode tested and working**
- [ ] **No console errors**
- [ ] **No console.log in production code**

**Design Compliance:**
- [ ] **Spacing:** 16dp page padding, 12dp row padding
- [ ] **Cards:** 12dp radius, theme colors only
- [ ] **Typography:** 18sp titles, 16sp body, 12sp meta
- [ ] **Theme colors used** (no hardcoded hex except tokens)
- [ ] **Follows MD3 visual standards**

---

## 🎯 Success Criteria

Admin app is production-ready when:
- ✅ RBAC enforced across all screens
- ✅ All destructive actions logged to audit_logs
- ✅ All screens use real Supabase data
- ✅ Modern UI components everywhere
- ✅ Analytics tracking implemented
- ✅ Error handling robust (empty/error/access-denied states)
- ✅ Dark mode fully working
- ✅ Safe navigation everywhere
- ✅ No TypeScript errors
- ✅ Performance optimized (dashboard <100ms, queries cached)
- ✅ Accessible to all users (48dp touch targets, labels)
- ✅ Thoroughly tested on real devices

---

## 📝 Next Steps

### Week 0: RBAC & Audit Setup (MUST DO FIRST)
1. Create `adminPermissions.ts`
2. Create `audit_logs` table migration
3. Create `auditLogger.ts` helper
4. Create `AccessDeniedScreen.tsx`
5. Test RBAC system thoroughly

### Week 1: Dashboard & Navigation
1. Toggle admin mode in App.tsx
2. Convert AdminNavigator to tabs
3. Modernize Phase90AdminDashboard
4. Lock all data contracts

### Week 2-3: Core Screens
1. UserManagementScreen (with RBAC + audit)
2. FinancialReportsScreen (with RBAC)
3. SupportCenterScreen (as action surface)

---

## 📋 COMPREHENSIVE FEATURE CHECKLIST

### ✅ Foundation (Must-Have)

#### RBAC Core
- [ ] Admin roles & permission map (AdminRole, AdminPermission, can())
- [ ] `<PermissionGate />` component
- [ ] Tab visibility gated by permissions

#### Auth & Session
- [ ] Admin-only route guard
- [ ] Token refresh & sign-out flows

#### Supabase Security
- [ ] Row-Level Security (RLS) policies per table (role + branch scoping)
- [ ] Secure RPCs for destructive actions (no direct table writes)
- [ ] JWT claims for role and allowed branch_ids

### 📝 Audit & Compliance

- [ ] `audit_logs` table + indexes
- [ ] `logAudit()` helper (action, target, changes, IP/device)
- [ ] Auto-log wrappers for sensitive/destructive actions
- [ ] Audit Log Viewer (filters: action, admin, date; search)
- [ ] Audit Log Detail (diff view of changes)
- [ ] Retention policy & PII redaction rules

### 🔗 Data Contracts & Real Data

- [ ] Contracts for every screen (queries, filters, mutations)
- [ ] Server-side pagination & sorting standards
- [ ] Validation (Zod schemas) for payloads & forms
- [ ] Error taxonomy (user vs system errors)
- [ ] Materialized views for heavy aggregates (analytics/revenue)

### 🧭 Navigation & Structure

- [x] Bottom Tab Navigator with 5 stacks (implemented with TopAppBar + NavigationDrawer)
- [x] `safeNavigate()` util + typed params
- [x] TopAppBar with overflow (Profile/Settings/Logout)
- [ ] Deep-links from cards → detail screens

### 🎨 UI Toolkit & States

- [x] BaseScreen wrapper (loading, error, empty, access denied, degraded)
- [ ] Skeleton components (card/list)
- [ ] Confirmation dialog util
- [ ] Toast/Snackbar system
- [ ] Empty-state components with contextual CTAs
- [x] Theme (MD3): tokens-only, dark mode, typography scale
- [x] Icon set (Material Design Icons)

### 📊 DashboardTab Features

#### KPI Grid
- [x] `<KPIStatCard />` + independent skeletons
- [x] Active Users KPI
- [x] Revenue (MTD) KPI
- [ ] Open Tickets (+ high-priority count) KPI
- [x] Attendance Rate (+ target badge) KPI

#### Quick Actions
- [x] `<QuickActionTile />` component
- [ ] PermissionGate wrapper for each action
- [ ] Add User (confirm + audit)
- [ ] Send Notice (confirm + audit)
- [ ] Lock User (confirm + audit)
- [ ] New Term (confirm + audit)

#### System Health
- [x] `<SystemHealthCard />` component
- [ ] Auto-refresh every 60s
- [ ] Live metrics feed

#### Recent Activity
- [x] Last N from audit_logs
- [x] Tap → detail screen

#### Active Alerts
- [x] Alert display
- [ ] Resolve button (confirm + audit)
- [ ] Escalate button (confirm + audit)
- [ ] Approve button (confirm + audit)

#### Additional Screens
- [ ] Real-Time Monitoring screen (live metrics feed)

### 👥 ManagementTab Features

#### User Management
- [ ] Search bar + filter chips (role, status)
- [ ] FlatList (virtualized, memoized rows)
- [ ] Actions: Suspend/Unsuspend/Delete/Reset Password (confirm + audit)
- [ ] Add User flow (form validation, role select)
- [ ] User Detail (profile, timeline, actions)

#### Organization Management
- [ ] Branch CRUD (default branch indicator)
- [ ] Academic Years (create/edit/close)
- [ ] Approvals (e.g., new branch requests) with audit

#### Operations Management
- [ ] Attendance sync status (force sync + audit)
- [ ] Fee collection snapshot (send reminders, generate report)
- [ ] Transport status (alerts, routes, notify)
- [ ] Announcements composer & queue
- [ ] Maintenance Mode toggle (confirm + audit)

### 📈 AnalyticsTab Features

#### Advanced Analytics
- [ ] Time range picker (Today/7d/30d/Custom)
- [ ] Trend cards: Growth, Engagement, Retention
- [ ] KPI detail charts (drilldowns)
- [ ] Export: CSV/PDF/Email (each export audited)

#### Financial Reports
- [ ] Daily revenue trend chart
- [ ] Branch/class breakdown
- [ ] Outstanding dues & Overdues (>30d)
- [ ] "Send Reminders" bulk action (confirm + audit)

### ⚙️ SystemTab Features

#### Platform Status
- [ ] Uptime, latency, queue, DB health
- [ ] Auto-refresh

#### Security & Compliance
- [ ] Audit Logs viewer (filters/search)
- [ ] Account lockouts list + unlock
- [ ] RBAC Management UI (super_admin)

#### System Settings
- [ ] Feature flags (toggle → confirm → RPC → audit)
- [ ] Minimum app version control (force upgrade)
- [ ] Rate limits config (read-only or editable per role)
- [ ] Environment switcher (prod/stage label)

#### Support Center
- [ ] Filters: Unassigned/Mine/Open/Resolved/High
- [ ] Ticket list (assign, escalate, resolve with notes)
- [ ] SLA metrics (avg first response, 24h resolved, open high)
- [ ] Notifications to reporter on resolve/escalate (optional)

### 🔍 Cross-Cutting Observability & Quality

- [x] Analytics: trackScreenView, trackAction (schema defined)
- [ ] Error reporting (Sentry or similar)
- [ ] Performance budgets (rerender <100ms; logs)
- [x] React Query: query keys, staleTime, refetchInterval
- [ ] List perf: getItemLayout, keyExtractor, React.memo
- [ ] Indexes: payments.created_at, payments.branch_id, support_tickets.status/severity, audit_logs.timestamp/admin_id
- [ ] Realtime channels for alerts/tickets (Supabase Realtime)

### ♿ Accessibility, i18n & Content

- [x] Accessibility labels on all buttons/tiles
- [x] Min touch target 48×48dp
- [ ] Focus & keyboard navigation (web/native parity if needed)
- [ ] Copy tone & empty-state guidance
- [ ] i18n-ready strings + date/number formatting

### 🔒 Security & Privacy Extras

- [ ] Rate limiting on sensitive RPCs (server-side)
- [ ] IP/device capture util
- [ ] PII masking in logs & exports
- [ ] Data export watermarking & signed URLs
- [ ] Admin 2FA (optional, nice-to-have)
- [ ] Session invalidation on role change

### 📤 Exports & Communications

- [ ] CSV/PDF generation jobs (server-side)
- [ ] Email/PDF delivery (link with signed URL)
- [ ] Export audit entries (who/when/what-range)

### 📡 Offline/Network & Resilience

- [ ] Network banner (offline/online)
- [ ] Retry with backoff for transient errors
- [ ] Degraded-mode UIs (partial data shown safely)

### 🛠️ Dev & Release

- [ ] Feature flagging for new screens
- [ ] DevTools screen (only dev builds)
- [x] ESLint/Prettier/TS strict, CI checks
- [ ] Strip console.log in production

---

**Production-Grade Admin App - Ready to Build! 🚀**

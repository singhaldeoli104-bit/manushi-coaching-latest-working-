# Admin Dashboard Enhancement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Enhance AdminDashboardScreen with System Health and Recent Activity sections per ADMIN_IMPLEMENTATION_STRATEGY.md

**Architecture:** Add two new card components (SystemHealthCard, RecentActivityCard), extend useAdminDashboard hook with system health query, update AdminDashboardScreen layout to include all 5 sections with proper MD3 styling

**Tech Stack:** React Native, TypeScript, TanStack Query, Supabase, Material Design 3

**Current State:**
- ✅ AdminDashboardScreen exists with Header, KPIs, Quick Actions, Alerts
- ✅ useAdminDashboard hook with KPIs and alerts queries
- ✅ KPICard, QuickActionTile, AlertCard components exist
- ❌ Missing: SystemHealthCard, RecentActivityCard components
- ❌ Missing: System health data query
- ❌ Missing: Recent activity data query

**Target State (5 sections per ADMIN_IMPLEMENTATION_STRATEGY.md):**
1. ✅ KPI Grid (2x2, 4 cards)
2. ✅ Quick Actions (4 tiles)
3. ❌ System Health / Live Monitor (NEW)
4. ❌ Recent Activity (NEW)
5. ✅ Active Alerts

---

## Task 1: Create SystemHealthCard Component

**Goal:** Create reusable card component for displaying system health metrics

**Files:**
- Create: `C:\PC\OLD\src\components\admin\SystemHealthCard.tsx`

**Step 1: Create component file with TypeScript interface**

```typescript
/**
 * System Health Card Component
 * Displays live system status metrics (uptime, sessions, queue, database)
 * Auto-refreshes every 60s via React Query refetchInterval
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Card } from 'react-native-paper';
import { T } from '../../ui/typography/T';
import { Colors, Spacing, BorderRadius } from '../../theme/designSystem';
import { useTheme } from '../../context/ThemeContext';

export interface SystemHealthData {
  uptime: string;
  activeSessions: number;
  queueBacklog: number;
  databaseStatus: 'healthy' | 'degraded' | 'down';
  apiLatency: number;
}

export interface SystemHealthCardProps {
  data: SystemHealthData | undefined;
  loading: boolean;
  onViewDetails?: () => void;
}

export const SystemHealthCard: React.FC<SystemHealthCardProps> = React.memo(({
  data,
  loading,
  onViewDetails,
}) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <Card style={[styles.card, { backgroundColor: theme.Surface }]} mode="outlined">
        <View style={styles.content}>
          <T variant="body" color="textSecondary">Loading system health...</T>
        </View>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const statusColor = data.databaseStatus === 'healthy' ? Colors.success :
                      data.databaseStatus === 'degraded' ? Colors.warning : Colors.error;

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.Surface }]}
      mode="outlined"
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="System Health Status"
    >
      <Pressable onPress={onViewDetails} style={styles.content}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <T variant="body" weight="semiBold">System Health</T>
          {onViewDetails && (
            <T variant="caption" color="textSecondary">View →</T>
          )}
        </View>

        {/* Metrics List */}
        <View style={styles.metricsList}>
          <View style={styles.metricRow}>
            <T variant="caption" color="textSecondary">• API Uptime:</T>
            <T variant="caption" weight="semiBold">{data.uptime}%</T>
          </View>

          <View style={styles.metricRow}>
            <T variant="caption" color="textSecondary">• Active Sessions:</T>
            <T variant="caption" weight="semiBold">{data.activeSessions} now</T>
          </View>

          <View style={styles.metricRow}>
            <T variant="caption" color="textSecondary">• Queue Backlog:</T>
            <T variant="caption" weight="semiBold">{data.queueBacklog} alerts</T>
          </View>

          <View style={styles.metricRow}>
            <T variant="caption" color="textSecondary">• DB Status:</T>
            <T variant="caption" weight="semiBold" color={statusColor as any}>
              {data.databaseStatus === 'healthy' ? '✓ Healthy' :
               data.databaseStatus === 'degraded' ? '⚠ Degraded' : '✗ Down'}
            </T>
          </View>
        </View>
      </Pressable>
    </Card>
  );
});

SystemHealthCard.displayName = 'SystemHealthCard';

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.base,
    borderRadius: BorderRadius.md,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  metricsList: {
    gap: Spacing.xs,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
```

**Step 2: Verify TypeScript compiles**

Run: `cd C:\PC\OLD && npx tsc --noEmit src/components/admin/SystemHealthCard.tsx`

Expected: No errors

---

## Task 2: Create RecentActivityCard Component

**Goal:** Create card component for displaying recent admin audit activity

**Files:**
- Create: `C:\PC\OLD\src\components\admin\RecentActivityCard.tsx`

**Step 1: Create component file with TypeScript interface**

```typescript
/**
 * Recent Activity Card Component
 * Displays last N admin actions from audit logs
 * Each row tappable to view audit detail
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Card } from 'react-native-paper';
import { T } from '../../ui/typography/T';
import { Spacing, BorderRadius } from '../../theme/designSystem';
import { useTheme } from '../../context/ThemeContext';

export interface ActivityEvent {
  id: string;
  action: string;
  actorName: string;
  timestamp: string;
  summary: string;
}

export interface RecentActivityCardProps {
  events: ActivityEvent[];
  loading: boolean;
  onViewAll?: () => void;
  onEventPress?: (eventId: string) => void;
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = React.memo(({
  events,
  loading,
  onViewAll,
  onEventPress,
}) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <Card style={[styles.card, { backgroundColor: theme.Surface }]} mode="outlined">
        <View style={styles.content}>
          <T variant="body" color="textSecondary">Loading recent activity...</T>
        </View>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card style={[styles.card, { backgroundColor: theme.Surface }]} mode="outlined">
        <View style={styles.content}>
          <T variant="body" weight="semiBold">Recent Activity</T>
          <T variant="caption" color="textSecondary">No recent activity</T>
        </View>
      </Card>
    );
  }

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.Surface }]}
      mode="outlined"
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Recent Activity List"
    >
      <View style={styles.content}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <T variant="body" weight="semiBold">Recent Activity</T>
          {onViewAll && (
            <Pressable onPress={onViewAll} hitSlop={8}>
              <T variant="caption" color="textSecondary">All →</T>
            </Pressable>
          )}
        </View>

        {/* Activity List */}
        <View style={styles.eventsList}>
          {events.map((event) => (
            <Pressable
              key={event.id}
              onPress={() => onEventPress?.(event.id)}
              style={styles.eventRow}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Activity: ${event.summary}`}
            >
              <View style={styles.eventContent}>
                <T variant="caption" numberOfLines={1}>
                  • {event.summary}
                </T>
                <T variant="caption" color="textSecondary" style={styles.timestamp}>
                  {event.timestamp} · {event.actorName}
                </T>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </Card>
  );
});

RecentActivityCard.displayName = 'RecentActivityCard';

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.base,
    borderRadius: BorderRadius.md,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  eventsList: {
    gap: Spacing.sm,
  },
  eventRow: {
    paddingVertical: Spacing.xs,
  },
  eventContent: {
    gap: 2,
  },
  timestamp: {
    fontSize: 11,
    fontStyle: 'italic',
  },
});
```

**Step 2: Verify TypeScript compiles**

Run: `cd C:\PC\OLD && npx tsc --noEmit src/components/admin/RecentActivityCard.tsx`

Expected: No errors

---

## Task 3: Extend useAdminDashboard Hook with System Health Query

**Goal:** Add system health data fetching to existing hook

**Files:**
- Modify: `C:\PC\OLD\src\hooks\useAdminDashboard.ts`

**Step 1: Add SystemHealthData interface and fetch function**

Add after line 23 (after SystemAlert interface):

```typescript
interface SystemHealthData {
  uptime: string;
  activeSessions: number;
  queueBacklog: number;
  databaseStatus: 'healthy' | 'degraded' | 'down';
  apiLatency: number;
}

interface ActivityEvent {
  id: string;
  action: string;
  actorName: string;
  timestamp: string;
  summary: string;
}

/**
 * Fetch system health metrics
 * In production, this would query system_metrics table
 * For now, returns mock data structure (to be replaced with real Supabase query)
 */
const fetchSystemHealth = async (): Promise<SystemHealthData> => {
  console.log('🏥 [AdminDashboard] Fetching system health...');

  // TODO: Replace with real Supabase query to system_metrics table
  // For now, return calculated uptime
  return {
    uptime: '99.98',
    activeSessions: 0, // Will be real data from sessions table
    queueBacklog: 0, // Will be real data from job_queue table
    databaseStatus: 'healthy' as const,
    apiLatency: 0, // Will be real data from metrics
  };
};

/**
 * Fetch recent activity events
 * In production, this would query audit_logs table
 */
const fetchRecentActivity = async (): Promise<ActivityEvent[]> => {
  console.log('📝 [AdminDashboard] Fetching recent activity...');

  // TODO: Replace with real Supabase query to audit_logs
  // Query: SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 5
  return [];
};
```

**Step 2: Add queries to useAdminDashboard hook**

Modify the return statement (around line 147) to add new queries:

```typescript
export const useAdminDashboard = () => {
  const kpisQuery = useQuery({
    queryKey: ['admin', 'dashboard', 'kpis'],
    queryFn: fetchDashboardKPIs,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const alertsQuery = useQuery({
    queryKey: ['admin', 'dashboard', 'alerts'],
    queryFn: fetchSystemAlerts,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });

  const healthQuery = useQuery({
    queryKey: ['admin', 'dashboard', 'health'],
    queryFn: fetchSystemHealth,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Auto-refresh every 60s
  });

  const activityQuery = useQuery({
    queryKey: ['admin', 'dashboard', 'activity'],
    queryFn: fetchRecentActivity,
    staleTime: 2 * 60 * 1000, // 2 minutes
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
    systemHealth: healthQuery.data,
    isLoadingHealth: healthQuery.isLoading,
    recentActivity: activityQuery.data || [],
    isLoadingActivity: activityQuery.isLoading,
  };
};
```

**Step 3: Verify TypeScript compiles**

Run: `cd C:\PC\OLD && npx tsc --noEmit src/hooks/useAdminDashboard.ts`

Expected: No errors

---

## Task 4: Update AdminDashboardScreen with New Sections

**Goal:** Add System Health and Recent Activity sections to dashboard

**Files:**
- Modify: `C:\PC\OLD\src\screens\admin\AdminDashboardScreen.tsx`

**Step 1: Import new components**

Add after line 16 (after AlertCard import):

```typescript
import { SystemHealthCard } from '../../components/admin/SystemHealthCard';
import { RecentActivityCard } from '../../components/admin/RecentActivityCard';
```

**Step 2: Update useAdminDashboard hook usage**

Modify line 24:

```typescript
const {
  kpis,
  isLoadingKPIs,
  kpisError,
  refetchKPIs,
  alerts,
  systemHealth,
  isLoadingHealth,
  recentActivity,
  isLoadingActivity,
} = useAdminDashboard();
```

**Step 3: Add System Health section after Quick Actions**

Add after line 170 (after Quick Actions closing View):

```typescript
        {/* System Health Section */}
        <View style={styles.section}>
          <SystemHealthCard
            data={systemHealth}
            loading={isLoadingHealth}
            onViewDetails={() => {
              trackAction('view_system_health_details', 'AdminDashboard');
              safeNavigate('RealTimeMonitoring' as any);
            }}
          />
        </View>

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <RecentActivityCard
            events={recentActivity}
            loading={isLoadingActivity}
            onViewAll={() => {
              trackAction('view_all_activity', 'AdminDashboard');
              safeNavigate('AuditLogs' as any);
            }}
            onEventPress={(eventId) => {
              trackAction('view_activity_detail', 'AdminDashboard', { eventId });
              safeNavigate('AuditLogDetail' as any, { auditId: eventId });
            }}
          />
        </View>
```

**Step 4: Verify TypeScript compiles**

Run: `cd C:\PC\OLD && npx tsc --noEmit src/screens/admin/AdminDashboardScreen.tsx`

Expected: No errors

---

## Task 5: Test Dashboard on Device

**Goal:** Verify all sections render correctly and no runtime errors

**Step 1: Check Metro bundler is running**

Run: `cd C:\PC\OLD && adb shell input text "RR"`

Expected: App reloads

**Step 2: Monitor logs for errors**

Run: `cd C:\PC\OLD && timeout 10 adb logcat ReactNativeJS:* *:S 2>&1 | grep -E "AdminDashboard|error|Error"`

Expected:
- "📊 [AdminDashboard] Fetching KPIs..."
- "🏥 [AdminDashboard] Fetching system health..."
- "📝 [AdminDashboard] Fetching recent activity..."
- No errors

**Step 3: Verify visual layout**

Manual check on device:
- [ ] Header with welcome message displays
- [ ] KPI Grid (4 cards in 2x2) displays
- [ ] Quick Actions (4 tiles) displays
- [ ] System Health card displays with metrics
- [ ] Recent Activity card displays (empty state OK for now)
- [ ] Active Alerts displays if any exist
- [ ] Pull-to-refresh works
- [ ] All cards have proper spacing (16dp padding, 12dp gaps)
- [ ] Theme colors applied (no hardcoded colors)

---

## Acceptance Criteria

- ✅ SystemHealthCard component created and memoized
- ✅ RecentActivityCard component created and memoized
- ✅ useAdminDashboard hook extended with health and activity queries
- ✅ AdminDashboardScreen shows all 5 sections in correct order
- ✅ All components have accessibility labels
- ✅ TypeScript errors: 0
- ✅ No console errors on device
- ✅ Pull-to-refresh refreshes all data
- ✅ Auto-refresh for system health works (60s interval)
- ✅ Material Design 3 spacing applied (16dp padding, 12dp radius)
- ✅ Theme tokens used (no hardcoded hex colors)

---

## Notes

- System health and recent activity return empty/mock data for now - will be replaced with real Supabase queries in Phase 0 (RBAC & Audit setup)
- The TODO comments mark where real Supabase queries should be added
- All components follow React.memo pattern for performance
- Analytics tracking added for all user interactions

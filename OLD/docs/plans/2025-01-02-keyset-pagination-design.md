# Keyset Pagination Implementation Design
**Sprint 1 - Week 1 Days 5-7: Performance Primitives**

**Version:** 1.0
**Date:** 2025-01-02
**Status:** 🔒 Design Approved
**Approach:** Database-First (indexes → RPC → hooks → UI)

---

## Executive Summary

This design implements **keyset pagination** for Users and Support Tickets lists, replacing traditional OFFSET pagination to achieve:

- ✅ **Consistent results** - No duplicate/missing rows during pagination
- ✅ **Scalable performance** - P95 < 200ms at 1M+ rows (Sprint 0 budget)
- ✅ **Security** - ABAC branch scoping enforced server-side
- ✅ **UX** - Per-card skeleton loaders, no layout shift

**Implementation order:** Sequential (Users first, then Tickets)
**Architecture:** Database-First (foundation → application layer)

---

## Design Decisions

### Key Choices

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Pagination type** | Keyset (cursor-based) | Consistent results, scalable performance, no OFFSET degradation |
| **Cursor format** | Opaque base64 token | Future-proof API, encodes `created_at + id + sort + filter_hash` |
| **has_more detection** | limit+1 pattern | Avoid expensive count queries, fetch one extra row |
| **total_count** | Deferred (not MVP) | Too expensive for real-time lists, use cached/async approach later |
| **Pagination direction** | Forward-only (MVP) | Defer "previous page" complexity until validated need |
| **Security** | Server-side ABAC | Branch scope derived from session, not client parameters |
| **Sort validation** | Server allowlist | Reject unknown sorts, prevent dynamic SQL injection |
| **Skeleton loaders** | Per-card skeletons | MD3 pattern, no layout shift, better perceived performance |
| **Testing environment** | Development database | Shared dev instance, coordinate migrations with team |

---

## Architecture

### Layer 1: Database - Composite Indexes

**File:** `supabase/migrations/20250102_add_keyset_indexes.sql`

**Users Table Indexes (profiles):**
```sql
-- Primary keyset index for newest-first sort
CREATE INDEX CONCURRENTLY IF NOT EXISTS
  idx_profiles_keyset
  ON profiles(created_at DESC, id DESC);

-- Partial index for active users (hot filter)
CREATE INDEX CONCURRENTLY IF NOT EXISTS
  idx_profiles_active_keyset
  ON profiles(created_at DESC, id DESC)
  WHERE status = 'active';
```

**Support Tickets Table Indexes (support_tickets):**
```sql
-- Default keyset (created_at sort)
CREATE INDEX CONCURRENTLY IF NOT EXISTS
  idx_tickets_keyset_created
  ON support_tickets(created_at DESC, id DESC);

-- Priority sort with keyset
CREATE INDEX CONCURRENTLY IF NOT EXISTS
  idx_tickets_keyset_priority
  ON support_tickets(priority DESC, created_at DESC, id DESC);

-- Status filter + keyset
CREATE INDEX CONCURRENTLY IF NOT EXISTS
  idx_tickets_keyset_status
  ON support_tickets(status, created_at DESC, id DESC);

-- Partial index for open tickets (hot filter)
CREATE INDEX CONCURRENTLY IF NOT EXISTS
  idx_tickets_open_keyset
  ON support_tickets(created_at DESC, id DESC)
  WHERE status IN ('open', 'in_progress');
```

**Why these indexes?**
- Support common filter+sort combinations
- Tie-breaking with `id` prevents pagination drift when timestamps match
- Partial indexes reduce size and boost cache hit rate for hot filters
- `CREATE INDEX CONCURRENTLY` avoids table locking

**Query Plan Validation:**
- All keyset queries must use index-only scans
- P95 latency < 200ms at 1M rows
- Verify with `EXPLAIN ANALYZE` on production-like data

---

### Layer 2: Supabase RPC Functions

#### Function 1: get_users_keyset

**Security & Performance:**
- ✅ ABAC: Branch scope derived from `auth.uid()` session, not from parameter
- ✅ Opaque cursor: Returns single base64 token (encodes state)
- ✅ Rate limiting: Max 100 rows per request (server-side cap)
- ✅ Sort allowlist: Only 'created', 'name', 'status' accepted
- ✅ Search validation: Min 2 characters, trigram index on `full_name`

**Signature:**
```sql
CREATE OR REPLACE FUNCTION public.get_users_keyset(
  p_limit INT DEFAULT 20,
  p_cursor TEXT DEFAULT NULL,  -- Opaque base64 token
  p_role TEXT DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_sort_by TEXT DEFAULT 'created'
)
RETURNS TABLE(
  users JSONB,
  next_cursor TEXT,  -- Opaque token for next page
  has_more BOOLEAN
)
```

**Implementation details:**
- Decode opaque cursor to extract `(created_at, id, sort, filter_hash)`
- Validate filter hash matches current filters (cursor invalidation)
- Query accessible branches from `admin_profiles` table using `auth.uid()`
- Apply branch filter using `WHERE branch_id = ANY(accessible_branches)`
- Use limit+1 to determine `has_more` (fetch one extra row, exclude from result)
- Encode next cursor with `base64(created_at::text || '|' || id::text || '|' || sort || '|' || filter_hash)`

**Error Taxonomy:**
- `PAGINATION_INVALID_CURSOR`: Cursor decode failed or expired → Return error code
- `PAGINATION_INVALID_SORT`: Unknown sort key → Return error code
- `PAGINATION_RATE_LIMIT`: Too many requests → Return 429 status
- `ABAC_ACCESS_DENIED`: No accessible branches → Return empty array

#### Function 2: get_tickets_keyset

**Additional features:**
- Dynamic sorting: Uses appropriate composite index based on `p_sort_by`
- SLA tracking: Includes `sla_violated`, `time_to_first_response`, `time_to_resolution`
- Priority normalization: Priority stored as integer rank (1=critical, 2=high, 3=medium, 4=low)

**Signature:**
```sql
CREATE OR REPLACE FUNCTION public.get_tickets_keyset(
  p_limit INT DEFAULT 20,
  p_cursor TEXT DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_priority TEXT DEFAULT NULL,
  p_assigned_to UUID DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_sort_by TEXT DEFAULT 'created'  -- 'created', 'priority', 'status'
)
RETURNS TABLE(
  tickets JSONB,
  next_cursor TEXT,
  has_more BOOLEAN
)
```

**Sort implementation:**
- `created`: Uses `idx_tickets_keyset_created`
- `priority`: Uses `idx_tickets_keyset_priority`
- `status`: Uses `idx_tickets_keyset_status`
- Any other value → Error `PAGINATION_INVALID_SORT`

---

### Layer 3: React Query Hooks

#### Hook 1: useUsers

**File:** `src/hooks/useUserManagement.ts`

**Integration points:**
- Uses `UserListFilters` from data contract (Days 1-2)
- Tracks API performance with `useDegradedMode` (Days 3-4)
- Follows Sprint 0 performance budgets (<200ms)

**Implementation:**
```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { userQueryKeys, UserListFilters, userStaleTime } from '@/types/contracts/userManagement';
import { useDegradedMode } from '@/shared/components/DegradedMode';
import { supabase } from '@/lib/supabase';

export function useUsers(filters: UserListFilters) {
  const { trackApiCall } = useDegradedMode();

  return useInfiniteQuery({
    queryKey: userQueryKeys.list(filters),

    queryFn: async ({ pageParam }) => {
      const startTime = Date.now();

      const { data, error } = await supabase.rpc('get_users_keyset', {
        p_limit: Math.min(filters.limit, 100), // Client-side cap
        p_cursor: pageParam?.cursor,
        p_role: filters.role,
        p_status: filters.status,
        p_search: filters.search,
        p_sort_by: filters.sort_by || 'created',
      });

      // Track performance for degraded mode
      const duration = Date.now() - startTime;
      trackApiCall('get_users_keyset', duration, 'rpcQuery');

      if (error) {
        // Error taxonomy handling
        if (error.code === 'PAGINATION_INVALID_CURSOR') {
          // Reset to first page
          return { users: [], next_cursor: null, has_more: false };
        }
        throw error;
      }

      return data;
    },

    getNextPageParam: (lastPage) =>
      lastPage.has_more ? { cursor: lastPage.next_cursor } : undefined,

    initialPageParam: undefined,

    staleTime: userStaleTime.list, // 30 seconds from contract

    // Keep previous data during refetch (smooth transitions)
    placeholderData: (previousData) => previousData,

    // Lower retry count for list fetches (avoid thrashing)
    retry: 0,

    // Prefetch next page when user nears end of list
    // (implemented in screen component via onEndReached)
  });
}
```

**Client-side de-duplication:**
```typescript
// In screen component
const allUsers = useMemo(() => {
  const users = data?.pages.flatMap(page => page.users) ?? [];
  // De-dupe by id (handles concurrent writes during scroll)
  const seen = new Set();
  return users.filter(user => {
    if (seen.has(user.id)) return false;
    seen.add(user.id);
    return true;
  });
}, [data]);
```

**Filter/sort change handling:**
```typescript
// Reset cursor when filters change
useEffect(() => {
  queryClient.resetQueries({ queryKey: userQueryKeys.list(filters) });
}, [filters.role, filters.status, filters.search, filters.sort_by]);
```

#### Hook 2: useTickets

**File:** `src/hooks/useSupportTickets.ts`

**Similar structure to useUsers with additions:**
- SLA tracking integration
- Priority-based sorting
- Real-time subscription hooks (future enhancement)

---

### Layer 4: Per-Card Skeleton Loaders

**File Structure:**
```
src/shared/components/skeletons/
├── SkeletonCard.tsx         # Base skeleton component
├── UserCardSkeleton.tsx     # User list item skeleton
└── TicketCardSkeleton.tsx   # Ticket list item skeleton
```

**Material Design 3 Implementation:**

**SkeletonCard.tsx:**
```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import tokens from '@/theme/tokens';

export interface SkeletonCardProps {
  height?: number;
  showAvatar?: boolean;
  lines?: number; // Number of text lines to show
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  height = 80,
  showAvatar = true,
  lines = 2,
}) => {
  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }), // MD3 standard shimmer duration
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.3 + (shimmer.value * 0.4), // Subtle shimmer effect
  }));

  return (
    <View style={[styles.container, { height }]} accessibilityLabel="Loading">
      <Animated.View style={[styles.content, shimmerStyle]}>
        {showAvatar && <View style={styles.avatar} />}
        <View style={styles.textContainer}>
          {Array.from({ length: lines }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.line,
                { width: i === lines - 1 ? '60%' : '100%' }
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.light.Surface,
    borderRadius: tokens.radius.card,
    padding: tokens.spacing.md,
    marginHorizontal: tokens.spacing.md,
    marginVertical: tokens.spacing.xs,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.light.SurfaceVariant,
    marginRight: tokens.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  line: {
    height: 12,
    backgroundColor: tokens.colors.light.SurfaceVariant,
    borderRadius: tokens.radius.xs,
    marginBottom: tokens.spacing.xs,
  },
});
```

**UserCardSkeleton.tsx:**
```typescript
export const UserCardSkeleton: React.FC = () => (
  <SkeletonCard height={80} showAvatar={true} lines={2} />
);
```

**TicketCardSkeleton.tsx:**
```typescript
export const TicketCardSkeleton: React.FC = () => (
  <SkeletonCard height={120} showAvatar={false} lines={3} />
);
```

**Integration in Screen:**
```typescript
import { UserCardSkeleton } from '@/shared/components/skeletons/UserCardSkeleton';

const SKELETON_ITEMS = Array.from({ length: 8 }, (_, i) => ({ id: `skeleton-${i}` }));

function UserListScreen() {
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } = useUsers(filters);

  const allUsers = useMemo(() => {
    // Client-side de-dupe by id
    const users = data?.pages.flatMap(page => page.users) ?? [];
    const seen = new Set();
    return users.filter(user => {
      if (seen.has(user.id)) return false;
      seen.add(user.id);
      return true;
    });
  }, [data]);

  return (
    <FlatList
      data={isLoading ? SKELETON_ITEMS : allUsers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) =>
        isLoading ? (
          <UserCardSkeleton />
        ) : (
          <UserCard user={item} />
        )
      }
      onEndReached={() => {
        if (hasNextPage && !isFetching) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5} // Prefetch at 50% scroll
      ListFooterComponent={
        isFetching && hasNextPage ? <UserCardSkeleton /> : null
      }
    />
  );
}
```

---

## Error Handling

### Client-Side Error Handling

**Error categories:**
1. **Network errors**: Show OfflineBanner (Days 3-4), use cached data
2. **Invalid cursor**: Reset to page 1, log error to Sentry
3. **Rate limit**: Show DegradedModeBanner with retry option
4. **ABAC denial**: Navigate to AccessDeniedScreen

**Implementation:**
```typescript
const { data, error } = useUsers(filters);

if (error) {
  if (error.code === 'PAGINATION_INVALID_CURSOR') {
    // Reset to first page
    queryClient.resetQueries({ queryKey: userQueryKeys.list(filters) });
  } else if (error.code === 'PAGINATION_RATE_LIMIT') {
    // Show degraded mode banner
    // (handled automatically by useDegradedMode integration)
  } else if (error.code === 'ABAC_ACCESS_DENIED') {
    navigation.navigate('AccessDenied');
  } else {
    // Generic error handling
    Sentry.captureException(error, {
      tags: { component: 'UserList', operation: 'pagination' },
      extra: { filters },
    });
  }
}
```

### Network Resilience

**Offline mode:**
- OfflineBanner shows when network disconnected
- Cached data persisted via React Query
- Retry disabled (retry: 0) to avoid thrashing

**Degraded mode:**
- API slowness detected by DegradedMode provider
- Show warning banner when P95 > 500ms
- Cached data displayed while fetching

---

## Testing Strategy

### Database Tests (EXPLAIN ANALYZE)

**Test 1: Index-only scans**
```sql
EXPLAIN ANALYZE
SELECT * FROM profiles
WHERE (created_at, id) < ('2025-01-01'::timestamptz, 'uuid-here'::uuid)
  AND status = 'active'
ORDER BY created_at DESC, id DESC
LIMIT 21;

-- Expected: Index Only Scan using idx_profiles_active_keyset
-- P95 latency: < 200ms at 1M rows
```

**Test 2: Filter combinations**
```sql
-- Test each filter+sort combination
-- Verify appropriate composite index used
EXPLAIN ANALYZE
SELECT * FROM support_tickets
WHERE status = 'open'
  AND (created_at, id) < (cursor_timestamp, cursor_id)
ORDER BY priority DESC, created_at DESC, id DESC
LIMIT 21;

-- Expected: Index Only Scan using idx_tickets_keyset_priority
```

**Test 3: Search queries**
```sql
-- Verify trigram index used for fuzzy search
EXPLAIN ANALYZE
SELECT * FROM profiles
WHERE full_name ILIKE '%john%'
  AND (created_at, id) < (cursor_timestamp, cursor_id)
ORDER BY created_at DESC, id DESC
LIMIT 21;

-- Expected: Bitmap Index Scan (trigram) + keyset filter
```

### Correctness Tests

**Test 1: No missing/duplicate items**
- Insert 100 new users between page 1 and page 2
- Fetch all pages via keyset pagination
- Verify: All original users present, benign duplicates acceptable (client de-dupes)

**Test 2: Cursor invalidation**
- Load page 1 with filter `status=active`
- Change filter to `status=inactive` mid-scroll
- Verify: Cursor resets, new query starts fresh

**Test 3: Sort switching**
- Load page 1 sorted by `created_at`
- Switch sort to `priority`
- Verify: New query uses correct index, returns correct first page

### Security Tests

**Test 1: ABAC enforcement**
- Call `get_users_keyset` with account lacking branch access
- Expected: Returns 0 rows (not an error, just empty result)

**Test 2: Cursor tampering**
- Manually modify opaque cursor to inject malicious data
- Expected: `PAGINATION_INVALID_CURSOR` error, safe decode failure

**Test 3: Sort injection**
- Pass `p_sort_by='created; DROP TABLE profiles;'`
- Expected: `PAGINATION_INVALID_SORT` error, rejected by allowlist

### Resilience Tests

**Test 1: Network flaps**
- Simulate intermittent network failures during scroll
- Expected: Degraded mode shows cached pages, recovers cleanly

**Test 2: RPC errors**
- Force RPC timeout (>2 seconds)
- Expected: Error logged to Sentry, user sees degraded mode banner

---

## Rollout Plan

### Phase U-1: Prep (Days 1-2)

**Database work:**
- [ ] Create migration file: `20250102_add_keyset_indexes.sql`
- [ ] Add composite indexes for Users (profiles table)
- [ ] Add partial index for active users
- [ ] Run `CREATE INDEX CONCURRENTLY` on development database
- [ ] Verify query plans with `EXPLAIN ANALYZE` (P95 < 200ms)

**Contract freeze:**
- [ ] Lock filter interface (no new filters mid-implementation)
- [ ] Lock sort options ('created', 'name', 'status' only)
- [ ] Document opaque cursor format

### Phase U-2: RPC Implementation (Days 3-4)

**RPC function:**
- [ ] Implement `get_users_keyset` with opaque cursor
- [ ] Server-side ABAC: Query accessible branches from session
- [ ] Allowlist sort validation
- [ ] limit+1 for has_more detection
- [ ] Error taxonomy (invalid cursor, invalid sort, rate limit)

**Testing:**
- [ ] Test with real data on development database
- [ ] Verify ABAC: Non-admin gets 0 rows
- [ ] Verify cursor invalidation on filter change
- [ ] Load test: 1000 concurrent requests, P95 < 200ms

**Deploy:**
- [ ] Apply migration to development database
- [ ] Coordinate with team (shared dev environment)

### Phase U-3: Hook & UI (Days 5-6)

**React Query hook:**
- [ ] Implement `useUsers` with DegradedMode tracking
- [ ] Client-side de-dupe by id
- [ ] Cursor reset on filter/sort change
- [ ] Prefetch next page at 50% scroll

**Skeleton loaders:**
- [ ] Create `SkeletonCard` base component
- [ ] Create `UserCardSkeleton` specific implementation
- [ ] Integrate in UserListScreen
- [ ] Verify no layout shift (skeleton matches card dimensions)

**Error handling:**
- [ ] Invalid cursor → Reset to page 1
- [ ] Rate limit → Show degraded mode banner
- [ ] ABAC denial → Navigate to AccessDeniedScreen

### Phase U-4: Validation (Day 6)

**Load tests:**
- [ ] Simulate 1000+ users scrolling simultaneously
- [ ] P95 latency < 200ms
- [ ] No duplicate/missing items (benign duplicates OK)

**Correctness tests:**
- [ ] Insert rows mid-scroll → Client de-dupes
- [ ] Change filters → Cursor invalidates
- [ ] Switch sorts → Correct index used

**Telemetry:**
- [ ] Sentry dashboard: Track page latency, error rate
- [ ] Monitor has_more distribution (detect pagination issues)

### Phase U-5: Cutover & Monitor (Day 7)

**Feature flag:**
- [ ] Enable keyset pagination for Users list
- [ ] Keep OFFSET endpoint behind rollback flag (safety)

**Monitoring:**
- [ ] Watch Sentry for error spikes
- [ ] Monitor API latency dashboard
- [ ] Iterate thresholds (limit caps, debounce, retries)

**Success criteria:**
- P95 latency < 200ms sustained
- Error rate < 0.1%
- No layout shift reports
- Positive user feedback

### Phase T: Tickets (Repeat Phases 1-5)

**Tickets-specific:**
- [ ] Add composite indexes for Tickets (priority, status, created)
- [ ] Add partial index for open tickets
- [ ] Implement `get_tickets_keyset` with dynamic sorting
- [ ] SLA tracking integration
- [ ] Real-time UI de-duplication (handle concurrent updates)

---

## Acceptance Criteria

### Functional Requirements

- [x] Server returns opaque cursor (no raw timestamp/id exposed)
- [x] ABAC enforced inside RPC (client cannot widen scope)
- [x] Keyset + limit+1 pattern (OFFSET eliminated)
- [x] Cursor invalidates on any filter/sort change
- [x] Forward-only pagination (defer "previous page")
- [x] Client-side de-dupe by id (handle concurrent writes)

### Performance Requirements

- [x] P95 RPC latency < 200ms (Sprint 0 budget)
- [x] Index-only scans for all common queries
- [x] Partial indexes for hot filters (active users, open tickets)
- [x] No layout shift (skeleton matches card dimensions)
- [x] Prefetch next page at 50% scroll

### Security Requirements

- [x] ABAC branch scoping enforced server-side
- [x] Sort keys validated against allowlist
- [x] Rate limiting: Max 100 rows per request
- [x] Search validation: Min 2 characters
- [x] Opaque cursor prevents tampering

### Observability Requirements

- [x] Telemetry: Track page latency, error rate, has_more ratio
- [x] Sentry integration: Log pagination errors
- [x] DegradedMode integration: Show cached data on slow requests
- [x] Alert when latency > 500ms or error rate > 1%

---

## Future Enhancements (Not MVP)

### Phase 2 (Post-Launch)

- **Bidirectional pagination**: Add "previous page" support
- **Total count**: Cached/async count for UI display
- **Cursor expiration**: Time-based cursor invalidation (24h TTL)
- **Anchor time**: Lock `created_at` on first page to reduce duplicates during long scrolls

### Phase 3 (Advanced)

- **Real-time updates**: Integrate with Supabase Realtime subscriptions
- **Optimistic updates**: Show new items immediately before server confirms
- **Smart prefetching**: ML-based prediction of user scroll behavior
- **A/B testing**: Compare keyset vs. OFFSET performance metrics

---

## References

- Sprint 0 Performance Budgets: `SPRINT0_COMPLETE.md`
- Data Contracts: `docs/DATA_CONTRACTS.md`
- Degraded Mode: `src/shared/components/DegradedMode.tsx`
- ABAC Permissions: `src/utils/adminPermissions.ts`
- Material Design 3 Tokens: `src/theme/tokens.ts`

---

## Approval

**Design reviewed by:** [User]
**Approved on:** 2025-01-02
**Next step:** Create implementation plan (Phase 6)

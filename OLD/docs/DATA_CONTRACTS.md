# Data Contracts - Sprint 1 Documentation

**Version:** 1.0
**Status:** 🔒 LOCKED
**Last Updated:** 2025-11-02

---

## Executive Summary

Data contracts define **stable, versioned interfaces** between frontend and backend. Once locked, these contracts prevent breaking changes and ensure predictable data shapes across the application.

### Why Data Contracts Matter

1. **Prevents Breaking Changes** - TypeScript types + Zod validation
2. **Performance** - Keyset pagination for scalable lists
3. **Caching** - React Query keys with stale time policies
4. **Type Safety** - Runtime validation catches errors early
5. **Documentation** - Single source of truth for data shapes

---

## Contract Locations

All data contracts live in: `src/types/contracts/`

### Sprint 1 Contracts (✅ LOCKED)

| Contract | Purpose | Pagination | Status |
|----------|---------|------------|--------|
| `dashboardKpis.ts` | Admin dashboard KPI metrics | N/A | ✅ Locked |
| `userManagement.ts` | User list, filters, mutations | Keyset | ✅ Locked |
| `supportTickets.ts` | Support tickets with SLA tracking | Keyset | ✅ Locked |
| `financialMetrics.ts` | Financial reports and analytics | Keyset | ✅ Locked |

---

## Contract Structure

Every contract must include these 5 sections:

```typescript
// 1. TypeScript Interfaces
export interface ResourceListItem { ... }
export interface ResourceFilters { ... }
export interface ResourceDetail { ... }

// 2. Zod Schemas (runtime validation)
export const ResourceSchema = z.object({ ... });

// 3. Query Keys (React Query caching)
export const resourceQueryKeys = {
  all: ['resource'] as const,
  list: (filters) => [...resourceQueryKeys.all, 'list', filters] as const,
  detail: (id) => [...resourceQueryKeys.all, 'detail', id] as const,
};

// 4. Stale Time Configuration
export const resourceStaleTime = {
  list: 30 * 1000, // 30 seconds
  detail: 60 * 1000, // 1 minute
};

// 5. Placeholder Data (prevents layout shift)
export const resourcePlaceholder = { ... };
```

---

## Keyset Pagination Pattern

**Why Keyset Instead of OFFSET?**

- ✅ **Consistent results** - No duplicate/missing rows during pagination
- ✅ **Better performance** - Index-friendly queries (no table scans)
- ✅ **Scalable** - Performance doesn't degrade with large offsets

### Keyset Pagination Interface

```typescript
interface ListFilters {
  limit: number; // Page size (1-100)
  cursor?: string; // Timestamp for ordering (e.g., created_at)
  cursor_id?: string; // UUID for tie-breaking (e.g., id)
  // ... other filters
}

interface ListResponse<T> {
  items: T[];
  nextCursor: {
    cursor: string; // Last item's timestamp
    cursor_id: string; // Last item's id
  } | null;
  hasMore: boolean;
  totalCount?: number; // Optional total count
}
```

### Database Requirements

For keyset pagination to work, you need **composite indexes**:

```sql
-- Users table keyset index
CREATE INDEX idx_users_keyset ON profiles(created_at, id);

-- Support tickets keyset index (multiple sort options)
CREATE INDEX idx_tickets_keyset_created ON support_tickets(created_at, id);
CREATE INDEX idx_tickets_keyset_priority ON support_tickets(priority, created_at, id);
CREATE INDEX idx_tickets_keyset_status ON support_tickets(status, created_at, id);
```

### Supabase RPC Function Pattern

```sql
CREATE OR REPLACE FUNCTION public.get_users_keyset(
  p_limit INT DEFAULT 20,
  p_cursor TIMESTAMPTZ DEFAULT NULL,
  p_cursor_id UUID DEFAULT NULL,
  p_role TEXT DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_search TEXT DEFAULT NULL
)
RETURNS TABLE(
  users JSONB,
  next_cursor TIMESTAMPTZ,
  next_cursor_id UUID,
  has_more BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    jsonb_agg(row_to_json(u.*)) as users,
    MAX(u.created_at) as next_cursor,
    MAX(u.id) as next_cursor_id,
    (COUNT(*) >= p_limit) as has_more
  FROM (
    SELECT * FROM profiles u
    WHERE
      -- Keyset pagination condition
      (p_cursor IS NULL OR
       (u.created_at, u.id) < (p_cursor, p_cursor_id))
      -- Filters
      AND (p_role IS NULL OR u.role = p_role)
      AND (p_status IS NULL OR u.status = p_status)
      AND (p_search IS NULL OR u.full_name ILIKE '%' || p_search || '%')
    ORDER BY u.created_at DESC, u.id DESC
    LIMIT p_limit
  ) u;
END;
$$ LANGUAGE plpgsql;
```

---

## React Query Integration

### useInfiniteQuery Pattern

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  userQueryKeys,
  UserListFilters,
  userStaleTime
} from '@/types/contracts/userManagement';

export function useUsers(filters: UserListFilters) {
  return useInfiniteQuery({
    queryKey: userQueryKeys.list(filters),

    queryFn: async ({ pageParam }) => {
      const { data, error } = await supabase.rpc('get_users_keyset', {
        p_limit: filters.limit,
        p_cursor: pageParam?.cursor,
        p_cursor_id: pageParam?.cursor_id,
        p_role: filters.role,
        p_status: filters.status,
        p_search: filters.search,
      });

      if (error) throw error;
      return data;
    },

    getNextPageParam: (lastPage) => lastPage.nextCursor,

    staleTime: userStaleTime.list,

    placeholderData: (previousData) => previousData, // Keep old data while fetching
  });
}
```

### Usage in Screen

```typescript
import { useUsers } from '@/hooks/useUserManagement';
import { UserListFilters } from '@/types/contracts/userManagement';

function UserListScreen() {
  const [filters, setFilters] = useState<UserListFilters>({
    limit: 20,
    role: undefined,
    status: 'active',
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useUsers(filters);

  const allUsers = data?.pages.flatMap(page => page.users) ?? [];

  return (
    <FlatList
      data={allUsers}
      renderItem={({ item }) => <UserListItem user={item} />}
      onEndReached={() => hasNextPage && fetchNextPage()}
      ListFooterComponent={isFetching ? <ActivityIndicator /> : null}
    />
  );
}
```

---

## Filter Patterns

### Standard Filter Interface

```typescript
export interface StandardFilters {
  // Pagination (REQUIRED)
  limit: number; // 1-100
  cursor?: string;
  cursor_id?: string;

  // Search (optional)
  search?: string; // Full-text search across multiple fields

  // Enum filters (optional)
  status?: EnumStatus;
  role?: EnumRole;
  priority?: EnumPriority;

  // UUID filters (optional)
  branch_id?: string;
  assigned_to_id?: string;
  created_by_id?: string;

  // Date range filters (optional)
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD

  // Boolean flags (optional)
  is_active?: boolean;
  is_deleted?: boolean;

  // Numeric range (optional)
  min_amount?: number;
  max_amount?: number;
}
```

### Zod Validation for Filters

```typescript
export const StandardFiltersSchema = z.object({
  limit: z.number().int().min(1).max(100),
  cursor: z.string().optional(),
  cursor_id: z.string().uuid().optional(),

  search: z.string().optional(),

  status: EnumStatusSchema.optional(),
  role: EnumRoleSchema.optional(),

  branch_id: z.string().uuid().optional(),
  assigned_to_id: z.string().uuid().optional(),

  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),

  is_active: z.boolean().optional(),

  min_amount: z.number().min(0).optional(),
  max_amount: z.number().min(0).optional(),
});
```

---

## Sort Patterns

### Multi-Column Sorting

```typescript
export type SortField = 'created_at' | 'updated_at' | 'name' | 'priority';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FiltersWithSort extends StandardFilters {
  sort?: SortConfig;
}
```

### Database Index for Sorting

```sql
-- Create indexes for each sortable column
CREATE INDEX idx_users_name ON profiles(name, id);
CREATE INDEX idx_users_created ON profiles(created_at DESC, id DESC);
CREATE INDEX idx_users_updated ON profiles(updated_at DESC, id DESC);
```

### Keyset Pagination with Custom Sort

```sql
-- Sort by priority (high to low), then created_at (newest first)
SELECT * FROM support_tickets t
WHERE
  (p_cursor_priority IS NULL OR
   (t.priority, t.created_at, t.id) < (p_cursor_priority, p_cursor, p_cursor_id))
ORDER BY t.priority DESC, t.created_at DESC, t.id DESC
LIMIT p_limit;
```

---

## Mutation Patterns

### Standard Mutation Input

```typescript
export interface StandardMutationInput {
  // Target
  target_id: string; // Resource being mutated

  // Payload
  // ... mutation-specific fields

  // Audit trail
  admin_id: string; // Who performed the action
  reason?: string; // Why (required for destructive actions)
  correlation_id?: string; // For request tracing (auto-generated if not provided)
}

export interface StandardMutationResponse {
  success: boolean;
  correlation_id: string;
  message?: string;
  data?: any;
}
```

### Example: Suspend User Mutation

```typescript
export interface SuspendUserInput {
  user_id: string;
  reason: string; // REQUIRED (min 10 chars)
  admin_id: string;
  correlation_id?: string;
}

export const SuspendUserInputSchema = z.object({
  user_id: z.string().uuid(),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  admin_id: z.string().uuid(),
  correlation_id: z.string().uuid().optional(),
});
```

### Using Secure RPC for Mutations

```typescript
import { useSecureRPC } from '@/hooks/useSecureRPC';
import { SuspendUserInput } from '@/types/contracts/userManagement';

function SuspendUserButton({ userId }: { userId: string }) {
  const { suspendUser, isLoading } = useSecureRPC();
  const { user } = useAuth();

  const handleSuspend = async () => {
    const input: SuspendUserInput = {
      user_id: userId,
      reason: 'Violation of terms of service',
      admin_id: user.id,
    };

    const result = await suspendUser(input.user_id, input.reason);

    if (result) {
      console.log('Suspended with correlation ID:', result.correlationId);
      // Show success message
    }
  };

  return (
    <Button onPress={handleSuspend} loading={isLoading}>
      Suspend User
    </Button>
  );
}
```

---

## Stale Time Policies

### Guidelines

| Data Type | Stale Time | Reason |
|-----------|------------|--------|
| Real-time metrics (KPIs) | 30 seconds | Users expect freshness |
| List views with subscriptions | 30-60 seconds | Subscriptions handle updates |
| Detail views | 60 seconds | Less frequently viewed |
| Historical/aggregated data | 5-10 minutes | Slow-changing data |
| Configuration/settings | 10-15 minutes | Rarely changes |

### Example Configuration

```typescript
export const userStaleTime = {
  list: 30 * 1000, // 30 seconds (frequently updated)
  detail: 60 * 1000, // 1 minute (less frequent)
  search: 10 * 1000, // 10 seconds (real-time feel)
} as const;

export const financialStaleTime = {
  dashboard: 60 * 1000, // 1 minute
  revenueTrend: 5 * 60 * 1000, // 5 minutes (historical)
  duesAging: 10 * 60 * 1000, // 10 minutes (slow-changing)
} as const;
```

---

## Placeholder Data Pattern

**Purpose:** Prevent layout shift during initial load

```typescript
export const userListPlaceholder: UserListResponse = {
  users: [],
  nextCursor: null,
  hasMore: false,
  totalCount: 0,
};

// Usage in useQuery
const { data = userListPlaceholder } = useInfiniteQuery({
  queryKey: userQueryKeys.list(filters),
  queryFn: fetchUsers,
  placeholderData: (previousData) => previousData || userListPlaceholder,
});

// data is ALWAYS defined (no null checks needed)
const allUsers = data.pages.flatMap(page => page.users);
```

---

## Real-Time Subscriptions

### Pattern for List Updates

```typescript
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { ticketQueryKeys } from '@/types/contracts/supportTickets';

export function useSupportTicketSubscription(filters: TicketListFilters) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabase
      .channel('support_tickets_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'support_tickets',
          filter: filters.assigned_to_id
            ? `assigned_to_id=eq.${filters.assigned_to_id}`
            : undefined,
        },
        (payload) => {
          // Invalidate queries to refetch
          queryClient.invalidateQueries({
            queryKey: ticketQueryKeys.list(filters),
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [filters, queryClient]);
}
```

---

## Breaking Changes Policy

### If You MUST Make a Breaking Change

1. **Create a new contract version**
   ```typescript
   // Old: userManagement.ts
   // New: userManagementV2.ts
   ```

2. **Keep old contract for backward compatibility**
   ```typescript
   // userManagement.ts - DEPRECATED, will be removed in Sprint 5
   export interface UserListItem { ... }
   ```

3. **Update hooks gradually**
   ```typescript
   // hooks/useUserManagementV2.ts
   import { UserListFilters } from '@/types/contracts/userManagementV2';
   ```

4. **Deprecate old contract after migration**
   ```typescript
   /**
    * @deprecated Use userManagementV2.ts instead
    * Will be removed in Sprint 5
    */
   export interface UserListItem { ... }
   ```

---

## Contract Checklist

When creating a new contract, ensure:

- [ ] TypeScript interfaces defined (ListItem, Detail, Filters, Response)
- [ ] Zod schemas for validation (all interfaces validated)
- [ ] Query keys exported (all, list, detail)
- [ ] Stale time documented (for each query type)
- [ ] Keyset pagination support (for lists with >100 items)
- [ ] Placeholder data included (prevents layout shift)
- [ ] Filters interface defined (with limits, cursors)
- [ ] Mutation inputs defined (if applicable, with audit fields)
- [ ] Sort configuration (if multi-column sort needed)
- [ ] Real-time subscription pattern (if needed)
- [ ] Added to `contracts/README.md`
- [ ] Database indexes created (for filter fields)
- [ ] Supabase RPC function created (for keyset pagination)
- [ ] Hook created (`hooks/use[Resource].ts`)
- [ ] Performance budget defined (from Sprint 0)

---

## Performance Considerations

### From Sprint 0 Performance Budgets

```typescript
import { monitorAPICall } from '@/config/performanceBudgets';

// Wrap API calls with monitoring
const users = await monitorAPICall(
  () => supabase.rpc('get_users_keyset', { ...filters }),
  'users_list',
  'read' // Budget: 300ms p95
);

// Automatic Sentry alert if > 300ms
```

### List Performance

- **Target:** 16ms per item render (60fps)
- **Use:** `React.memo` for list items
- **Use:** `keyExtractor` based on stable IDs
- **Use:** `getItemLayout` if fixed height
- **Show:** Filter prompt if list > 1000 items

---

## Examples by Use Case

### Example 1: Simple List with Filters

```typescript
// 1. Define contract
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  limit: number;
  cursor?: string;
  cursor_id?: string;
}

// 2. Create hook
export function useProducts(filters: ProductFilters) {
  return useInfiniteQuery({
    queryKey: productQueryKeys.list(filters),
    queryFn: ({ pageParam }) => fetchProducts({ ...filters, ...pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: productStaleTime.list,
  });
}

// 3. Use in screen
function ProductListScreen() {
  const [filters, setFilters] = useState({ limit: 20 });
  const { data, fetchNextPage, hasNextPage } = useProducts(filters);

  const products = data?.pages.flatMap(p => p.items) ?? [];

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
      onEndReached={() => hasNextPage && fetchNextPage()}
    />
  );
}
```

### Example 2: Mutation with Audit Trail

```typescript
// 1. Define mutation input
export interface UpdateProductInput {
  product_id: string;
  name?: string;
  price?: number;
  admin_id: string;
  correlation_id?: string;
}

// 2. Use secure RPC
const { executeAction } = useSecureRPC();

const updateProduct = async (input: UpdateProductInput) => {
  const result = await executeAction('update_product', input.product_id, {
    name: input.name,
    price: input.price,
  });

  // Automatically logged in audit_logs with correlation ID
  return result;
};
```

### Example 3: Real-Time Dashboard KPIs

```typescript
// 1. Define contract
export interface DashboardKPIs {
  activeUsers: number;
  mtdRevenue: number;
  openTickets: number;
  attendanceRate: number;
}

// 2. Create hook with real-time subscription
export function useDashboardKPIs() {
  const queryClient = useQueryClient();

  // Fetch KPIs
  const query = useQuery({
    queryKey: dashboardKpisQueryKeys.current(),
    queryFn: fetchKPIs,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30s
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const sub = supabase
      .channel('kpi_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kpi_cache' }, () => {
        queryClient.invalidateQueries({ queryKey: dashboardKpisQueryKeys.current() });
      })
      .subscribe();

    return () => sub.unsubscribe();
  }, [queryClient]);

  return query;
}
```

---

## Summary

✅ **4 Contracts Locked** (Dashboard KPIs, Users, Support Tickets, Financial)
✅ **Keyset Pagination** for all lists
✅ **Zod Validation** for runtime safety
✅ **React Query Integration** with stale time policies
✅ **Audit Trail** for all mutations
✅ **Performance Monitoring** from Sprint 0
✅ **Real-Time Subscriptions** pattern documented

**Next Steps:**
- Sprint 1 Days 3-4: Build UI Shell (Bottom Tab Navigator, TopAppBar, Theme tokens)
- Sprint 1 Days 5-7: Implement keyset pagination RPCs + indexes
- Week 2: Build Dashboard KPIs + Support Center using these contracts

---

**Contract Version:** 1.0
**Locked:** 2025-11-02
**No Breaking Changes Allowed Without Versioning**

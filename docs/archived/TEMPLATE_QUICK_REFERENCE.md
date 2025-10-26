# API Service + React Query Template - Quick Reference

## Files Created

1. **C:\PC\src\services\api\parent\TEMPLATE_parentService.ts** (24KB)
   - Complete service layer template with 13 patterns
   - Extensive JSDoc comments and examples
   - Production-ready code

2. **C:\PC\src\hooks\TEMPLATE_useParentAPI.ts** (33KB)
   - Complete React Query hooks template with 15 patterns
   - Query and mutation examples
   - Optimistic updates and advanced patterns

3. **C:\PC\REACT_QUERY_SETUP_GUIDE.md** (29KB)
   - Complete setup and configuration guide
   - Component examples
   - Troubleshooting section

---

## Quick Start Guide

### Step 1: Study the Templates

Read these in order:
1. `TEMPLATE_parentService.ts` - Learn service function patterns
2. `TEMPLATE_useParentAPI.ts` - Learn React Query hook patterns
3. `REACT_QUERY_SETUP_GUIDE.md` - Learn setup and usage

### Step 2: Set Up React Query

```bash
# Install dependencies
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Create configuration files (see setup guide):
- `src/config/queryClient.ts`
- `src/providers/QueryProvider.tsx`
- Wrap App with `QueryProvider`

### Step 3: Create Your Services

Use `TEMPLATE_parentService.ts` as reference to create:
- `academicService.ts`
- `financialService.ts`
- `insightsService.ts`
- `communicationsService.ts`
- `actionItemsService.ts`

### Step 4: Create Your Hooks

Use `TEMPLATE_useParentAPI.ts` as reference to create:
- `useAcademicAPI.ts`
- `useFinancialAPI.ts`
- `useInsightsAPI.ts`
- `useCommunicationsAPI.ts`
- `useActionItemsAPI.ts`

### Step 5: Use in Components

See `REACT_QUERY_SETUP_GUIDE.md` for component examples.

---

## Pattern Index

### Service Patterns (TEMPLATE_parentService.ts)

| Pattern | Use Case | Example Function |
|---------|----------|------------------|
| 1. Simple Single Query | Fetch one record by ID | `getParentProfile()` |
| 2. Simple List Query | Fetch multiple records | `getParentChildRelationships()` |
| 3. RPC Function Call | Complex queries with joins | `getParentChildren()` |
| 4. RPC with Aggregations | Dashboard summaries | `getParentDashboardSummary()` |
| 5. Paginated Query | Lists with pagination | `getParentChildrenPaginated()` |
| 6. Simple Update | Basic data update | `updateParentProfile()` |
| 7. Specialized Update | Focused updates | `updateNotificationPreferences()` |
| 8. Update with Side Effects | Multi-field updates | `completeOnboarding()` |
| 9. Multiple Filters | Complex filtering | `getParentChildrenFiltered()` |
| 10. Existence Check | Boolean checks | `parentExists()` |
| 11. Calculated Fields | Derived values | `getProfileCompletionPercentage()` |
| 12. Compound Update | Related field updates | `acceptTermsAndPrivacy()` |
| 13. Tracking Update | Timestamp updates | `updateLastLogin()` |

### Hook Patterns (TEMPLATE_useParentAPI.ts)

| Pattern | Use Case | Example Hook |
|---------|----------|--------------|
| 1. Basic Query | Simple data fetching | `useParentProfile()` |
| 2. Array Query | List data | `useParentChildren()` |
| 3. Complex Query | Aggregated data | `useDashboardSummary()` |
| 4. Query with Filters | Filtered results | `useParentChildrenFiltered()` |
| 5. Paginated Query | Paginated lists | `useParentChildrenPaginated()` |
| 6. Utility Query | Simple values | `useProfileCompletion()` |
| 7. Boolean Query | Existence checks | `useParentExists()` |
| 8. Simple Mutation | Basic updates | `useUpdateParentProfile()` |
| 9. Optimistic Mutation | Instant UI updates | `useUpdateNotificationPreferences()` |
| 10. Action Mutation | Simple actions | `useCompleteOnboarding()` |
| 11. Tracking Mutation | Silent tracking | `useUpdateLastLogin()` |
| 12. Multi-field Mutation | Related updates | `useAcceptTerms()` |
| 13. Compound Hook | Multiple queries | `useParentDashboardData()` |
| 14. Prefetch Hook | Cache warming | `usePrefetchParentData()` |
| 15. Invalidation Hook | Cache management | `useInvalidateParentCache()` |

---

## Common Code Snippets

### Service Function Template

```typescript
export async function getEntity(entityId: string): Promise<Entity> {
  try {
    const { data, error } = await retryWithBackoff(async () => {
      return await supabase
        .from('table_name')
        .select('*')
        .eq('id', entityId)
        .single();
    });

    if (error) throw parseSupabaseError(error);
    if (!data) throw new NotFoundError('Entity not found');

    return data;
  } catch (error) {
    throw parseSupabaseError(error);
  }
}
```

### Query Hook Template

```typescript
export function useEntity(
  entityId: string,
  options?: Omit<UseQueryOptions<Entity, APIError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Entity, APIError>({
    queryKey: ['entity', entityId],
    queryFn: () => getEntity(entityId),
    enabled: !!entityId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
```

### Mutation Hook Template

```typescript
export function useUpdateEntity(
  options?: UseMutationOptions<Entity, APIError, UpdateParams>
) {
  const queryClient = useQueryClient();

  return useMutation<Entity, APIError, UpdateParams>({
    mutationFn: ({ id, updates }) => updateEntity(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['entity', variables.id]);
      options?.onSuccess?.(data, variables, undefined);
    },
    ...options,
  });
}
```

### Component Usage Template

```typescript
function Component({ entityId }: Props) {
  // Query
  const { data, isLoading, error } = useEntity(entityId);

  // Mutation
  const { mutate: update, isLoading: isUpdating } = useUpdateEntity();

  const handleUpdate = (updates: Partial<Entity>) => {
    update(
      { id: entityId, updates },
      {
        onSuccess: () => Alert.alert('Success'),
        onError: (err) => Alert.alert('Error', err.message),
      }
    );
  };

  if (isLoading) return <Loader />;
  if (error) return <Error error={error} />;
  if (!data) return <NotFound />;

  return <View>{/* Render data */}</View>;
}
```

---

## Key Concepts

### Query Keys (Hierarchical Structure)

```typescript
const keys = {
  all: ['entity'],                          // All entities
  detail: (id) => ['entity', id],           // Specific entity
  profile: (id) => ['entity', id, 'profile'], // Entity profile
  list: (filters) => ['entity', 'list', filters], // Filtered list
};
```

**Why?** Allows targeted invalidation:
- `invalidateQueries(['entity'])` - Invalidates everything
- `invalidateQueries(['entity', id])` - Invalidates one entity
- `invalidateQueries(['entity', id, 'profile'])` - Invalidates just profile

### Stale Time vs Cache Time

```typescript
staleTime: 5 * 60 * 1000,  // How long data is "fresh"
cacheTime: 10 * 60 * 1000, // How long data stays in memory
```

**Rule:** Always set `cacheTime > staleTime`

**Common Values:**
- Static data: `staleTime: 10min, cacheTime: 30min`
- Dynamic data: `staleTime: 1min, cacheTime: 5min`
- Real-time data: `staleTime: 0, cacheTime: 1min`

### Query Lifecycle

```
1. isLoading = true  (first fetch)
2. isFetching = true (any fetch)
3. data = undefined
   ↓
4. Fetch completes
   ↓
5. isLoading = false
6. data = result
   ↓
7. [staleTime passes]
   ↓
8. data becomes stale
   ↓
9. [component refocuses]
   ↓
10. isFetching = true (refetch)
11. data = previous (still available)
    ↓
12. Refetch completes
    ↓
13. data = new result
```

### Mutation Lifecycle

```
1. mutate({ params })
   ↓
2. onMutate (setup optimistic update)
   ↓
3. mutationFn (execute mutation)
   ↓
4a. Success → onSuccess (invalidate queries)
4b. Error → onError (rollback)
   ↓
5. onSettled (cleanup)
```

---

## React Query Configuration

### Recommended Settings

```typescript
// Static/Profile Data
{
  staleTime: 10 * 60 * 1000,  // 10 minutes
  cacheTime: 30 * 60 * 1000,  // 30 minutes
  refetchOnWindowFocus: false,
}

// Dashboard/Dynamic Data
{
  staleTime: 60 * 1000,       // 1 minute
  cacheTime: 5 * 60 * 1000,   // 5 minutes
  refetchOnWindowFocus: true,
}

// Real-time/Chat Data
{
  staleTime: 0,               // Always stale
  cacheTime: 60 * 1000,       // 1 minute
  refetchInterval: 5000,      // Poll every 5s
}

// Expensive/Report Data
{
  staleTime: 15 * 60 * 1000,  // 15 minutes
  cacheTime: 60 * 60 * 1000,  // 1 hour
  refetchOnWindowFocus: false,
}
```

---

## Error Handling

### Service Layer

```typescript
try {
  const { data, error } = await supabase.from('table').select();
  if (error) throw parseSupabaseError(error);
  if (!data) throw new NotFoundError('Not found');
  return data;
} catch (error) {
  throw parseSupabaseError(error);
}
```

### Component Layer

```typescript
const { data, error } = useEntity(id);

if (error) {
  if (error instanceof NotFoundError) {
    return <NotFoundScreen />;
  } else if (error instanceof AuthenticationError) {
    return <LoginScreen />;
  } else {
    return <ErrorScreen message={getUserFriendlyErrorMessage(error)} />;
  }
}
```

---

## Best Practices Checklist

### Service Functions
- [ ] Use TypeScript types for parameters and return values
- [ ] Use `retryWithBackoff` for read operations only
- [ ] Parse all errors with `parseSupabaseError()`
- [ ] Return empty arrays (not null) for lists
- [ ] Throw `NotFoundError` when data is missing
- [ ] Validate input before database calls
- [ ] Add `updated_at` automatically
- [ ] Include JSDoc comments

### Hooks
- [ ] Use query key factory
- [ ] Set appropriate `staleTime` and `cacheTime`
- [ ] Use `enabled` for conditional fetching
- [ ] Invalidate queries after mutations
- [ ] Handle loading and error states
- [ ] Provide TypeScript types
- [ ] Use optimistic updates for simple cases only
- [ ] Prefetch on navigation

### Components
- [ ] Handle `isLoading` state
- [ ] Handle `error` state
- [ ] Handle empty/null data
- [ ] Provide user feedback for mutations
- [ ] Use `refetch` for pull-to-refresh
- [ ] Show loading indicators during mutations
- [ ] Display user-friendly error messages

---

## Replication Checklist

To create a new service (e.g., `academicService` + `useAcademicAPI`):

### 1. Service Layer
- [ ] Copy `TEMPLATE_parentService.ts`
- [ ] Rename to `academicService.ts`
- [ ] Update table names
- [ ] Update function names
- [ ] Update TypeScript types
- [ ] Update JSDoc comments
- [ ] Test each function

### 2. Hooks Layer
- [ ] Copy `TEMPLATE_useParentAPI.ts`
- [ ] Rename to `useAcademicAPI.ts`
- [ ] Update query keys factory
- [ ] Update hook names
- [ ] Update import paths
- [ ] Update TypeScript types
- [ ] Test each hook

### 3. Component Usage
- [ ] Import hooks in components
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Test user flows
- [ ] Add error boundaries

---

## Common Pitfalls to Avoid

1. **Forgetting to Invalidate Queries**
   ```typescript
   // ❌ BAD - Mutation doesn't invalidate
   onSuccess: () => {
     console.log('Updated');
   }

   // ✅ GOOD - Invalidate to trigger refetch
   onSuccess: (data, variables) => {
     queryClient.invalidateQueries(['entity', variables.id]);
   }
   ```

2. **Wrong Query Keys**
   ```typescript
   // ❌ BAD - Inconsistent keys
   queryKey: ['profile', parentId]
   invalidateQueries(['parent', parentId]) // Won't work!

   // ✅ GOOD - Use query key factory
   queryKey: parentKeys.profile(parentId)
   invalidateQueries(parentKeys.profile(parentId))
   ```

3. **Retrying Mutations**
   ```typescript
   // ❌ BAD - Retrying mutations (not idempotent)
   useMutation({
     retry: 3, // Could cause duplicate operations
   })

   // ✅ GOOD - Don't retry mutations
   useMutation({
     retry: false,
   })
   ```

4. **Not Handling Empty States**
   ```typescript
   // ❌ BAD - Will crash if data is undefined
   return <Text>{data.name}</Text>

   // ✅ GOOD - Handle empty states
   if (!data) return <NotFound />
   return <Text>{data.name}</Text>
   ```

5. **Stale Time Too Low**
   ```typescript
   // ❌ BAD - Refetches on every mount/focus
   staleTime: 0

   // ✅ GOOD - Appropriate stale time
   staleTime: 5 * 60 * 1000 // 5 minutes
   ```

---

## Next Steps

1. **Read the Templates**
   - Study `TEMPLATE_parentService.ts`
   - Study `TEMPLATE_useParentAPI.ts`
   - Read `REACT_QUERY_SETUP_GUIDE.md`

2. **Set Up React Query**
   - Install dependencies
   - Create configuration files
   - Wrap app with provider

3. **Create First Service**
   - Start with `academicService.ts`
   - Follow the patterns from template
   - Test thoroughly

4. **Create First Hooks**
   - Create `useAcademicAPI.ts`
   - Follow the patterns from template
   - Test in components

5. **Replicate for Others**
   - `financialService` + `useFinancialAPI`
   - `insightsService` + `useInsightsAPI`
   - `communicationsService` + `useCommunicationsAPI`
   - `actionItemsService` + `useActionItemsAPI`

---

## Support & Resources

- **Templates Location:**
  - `C:\PC\src\services\api\parent\TEMPLATE_parentService.ts`
  - `C:\PC\src\hooks\TEMPLATE_useParentAPI.ts`
  - `C:\PC\REACT_QUERY_SETUP_GUIDE.md`

- **Official Docs:**
  - [React Query Docs](https://tanstack.com/query/latest)
  - [Supabase Docs](https://supabase.com/docs)

- **Community:**
  - [TkDodo's Blog](https://tkdodo.eu/blog/practical-react-query)
  - [React Query Discord](https://discord.gg/tanstack)

---

**You're now ready to build a production-ready API layer with React Query!** 🚀

# React Query Setup Guide - Complete Implementation Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Project Structure](#project-structure)
4. [QueryClient Configuration](#queryclient-configuration)
5. [Provider Setup](#provider-setup)
6. [Using Hooks in Components](#using-hooks-in-components)
7. [Advanced Patterns](#advanced-patterns)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [Migration Guide](#migration-guide)

---

## Introduction

This guide will walk you through setting up **React Query** (TanStack Query) in your React Native application. React Query is a powerful data-fetching and state management library that provides:

- **Automatic caching** - Data is cached and reused across components
- **Background refetching** - Keeps data fresh automatically
- **Optimistic updates** - Update UI before server responds
- **Request deduplication** - Multiple requests for same data = one network call
- **Pagination & infinite scroll** - Built-in support
- **Devtools** - Inspect cache and queries

### Why React Query?

Before React Query, you might write code like this:

```typescript
// ❌ OLD WAY - Manual state management
const [profile, setProfile] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setIsLoading(true);
  getParentProfile(parentId)
    .then(data => setProfile(data))
    .catch(err => setError(err))
    .finally(() => setIsLoading(false));
}, [parentId]);

// Need to refresh? More code!
// Need to cache? Even more code!
// Multiple components need same data? Duplicate code!
```

With React Query:

```typescript
// ✅ NEW WAY - React Query handles everything
const { data: profile, isLoading, error } = useParentProfile(parentId);

// That's it! Caching, refetching, deduplication all handled!
```

---

## Installation

### Step 1: Install Dependencies

```bash
npm install @tanstack/react-query
# or
yarn add @tanstack/react-query
```

### Step 2: Install DevTools (Optional but Recommended)

```bash
npm install @tanstack/react-query-devtools
# or
yarn add @tanstack/react-query-devtools
```

**Note:** DevTools are optional but extremely helpful during development.

---

## Project Structure

Organize your code like this:

```
src/
├── services/
│   ├── supabase/
│   │   └── client.ts              # Supabase client
│   └── api/
│       ├── errorHandler.ts        # Error handling utilities
│       └── parent/
│           ├── parentService.ts   # API functions
│           ├── academicService.ts
│           ├── financialService.ts
│           ├── insightsService.ts
│           ├── communicationsService.ts
│           └── actionItemsService.ts
├── hooks/
│   ├── useParentAPI.ts           # Parent-related hooks
│   ├── useAcademicAPI.ts         # Academic-related hooks
│   ├── useFinancialAPI.ts        # Financial-related hooks
│   ├── useInsightsAPI.ts         # Insights-related hooks
│   ├── useCommunicationsAPI.ts   # Communications-related hooks
│   └── useActionItemsAPI.ts      # Action items-related hooks
├── config/
│   └── queryClient.ts            # React Query configuration
├── providers/
│   └── QueryProvider.tsx         # Query provider component
└── types/
    └── supabase-parent.types.ts  # TypeScript types
```

---

## QueryClient Configuration

### Step 1: Create Query Client Configuration

Create `src/config/queryClient.ts`:

```typescript
/**
 * React Query Client Configuration
 *
 * This file configures the global QueryClient with default options
 * for queries and mutations across the entire application.
 */

import { QueryClient } from '@tanstack/react-query';
import { getUserFriendlyErrorMessage } from '../services/api/errorHandler';

/**
 * Default query options applied to all queries unless overridden
 */
const defaultQueryOptions = {
  queries: {
    // STALE TIME: How long data is considered fresh
    // Fresh data won't refetch on mount/focus
    // Recommendation: 5 minutes for most data
    staleTime: 5 * 60 * 1000, // 5 minutes

    // CACHE TIME: How long unused data stays in memory
    // After this time, data is garbage collected
    // Recommendation: 10 minutes (longer than staleTime)
    cacheTime: 10 * 60 * 1000, // 10 minutes

    // REFETCH OPTIONS
    // Refetch when window regains focus (tab switch back)
    refetchOnWindowFocus: true,

    // Refetch when component mounts (if data is stale)
    refetchOnMount: true,

    // Refetch when network reconnects
    refetchOnReconnect: true,

    // RETRY OPTIONS
    // Number of retry attempts on failure
    retry: 3,

    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // ERROR HANDLING
    // Global error handler (optional)
    onError: (error: any) => {
      // Log errors in development
      if (__DEV__) {
        console.error('React Query Error:', getUserFriendlyErrorMessage(error));
      }
    },

    // Prevent garbage collection of queries with active observers
    keepPreviousData: false,

    // Structural sharing for better performance
    structuralSharing: true,
  },

  mutations: {
    // RETRY OPTIONS FOR MUTATIONS
    // Generally don't retry mutations (not idempotent)
    retry: false,

    // ERROR HANDLING
    onError: (error: any) => {
      if (__DEV__) {
        console.error('Mutation Error:', getUserFriendlyErrorMessage(error));
      }
    },
  },
};

/**
 * Create and export the QueryClient instance
 *
 * This is the single source of truth for all React Query operations.
 * Import this in your provider and tests.
 */
export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});

/**
 * CONFIGURATION GUIDE:
 *
 * STALE TIME vs CACHE TIME:
 * - staleTime: "How long is this data good for?"
 * - cacheTime: "How long should we keep this around?"
 * - Always set cacheTime > staleTime
 *
 * RECOMMENDED VALUES BY DATA TYPE:
 *
 * 1. Static/Rarely Changing Data (user profile, settings):
 *    staleTime: 10 minutes
 *    cacheTime: 30 minutes
 *
 * 2. Dynamic Data (dashboard, notifications):
 *    staleTime: 1 minute
 *    cacheTime: 5 minutes
 *
 * 3. Real-time Data (chat messages, live updates):
 *    staleTime: 0 (always stale)
 *    cacheTime: 1 minute
 *
 * 4. Expensive Queries (reports, analytics):
 *    staleTime: 15 minutes
 *    cacheTime: 1 hour
 *
 * REFETCH OPTIONS:
 * - Set refetchOnWindowFocus: false for data that doesn't change often
 * - Set refetchOnMount: false for cached data that doesn't expire
 * - Set refetchOnReconnect: true for critical data
 *
 * RETRY OPTIONS:
 * - Increase retry count for important operations
 * - Decrease for non-critical operations
 * - Set to false for mutations (not idempotent)
 */
```

### Step 2: Understanding Configuration Options

#### Stale Time

- **Definition:** How long data is considered "fresh"
- **Default:** 0 (immediately stale)
- **Impact:** Fresh data won't trigger refetch on mount/focus
- **Recommendation:**
  - Static data: 10-30 minutes
  - Dynamic data: 1-5 minutes
  - Real-time data: 0 (always refetch)

#### Cache Time

- **Definition:** How long unused data stays in memory
- **Default:** 5 minutes
- **Impact:** Affects memory usage and cache hits
- **Recommendation:**
  - Set 2x longer than staleTime
  - Minimum: 5 minutes
  - Maximum: 30 minutes (unless specific need)

#### Visual Guide

```
Time →
0s ────────────────────────────────────────────────────→

[Fetch]─────[Fresh (staleTime)]─────[Stale]────[GC (cacheTime)]────[Gone]
         ↑                       ↑            ↑                  ↑
         Fetched               Becomes      Still in          Removed
                              stale         cache
```

---

## Provider Setup

### Step 1: Create Query Provider Component

Create `src/providers/QueryProvider.tsx`:

```typescript
/**
 * Query Provider Component
 *
 * Wraps the application with React Query provider and devtools.
 */

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../config/queryClient';

// Devtools (only import in development)
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* DevTools - only show in development */}
      {__DEV__ && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
        />
      )}
    </QueryClientProvider>
  );
}
```

### Step 2: Wrap Your App

Update your `App.tsx` (or equivalent root file):

```typescript
// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryProvider } from './providers/QueryProvider';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    // 1. QueryProvider wraps everything
    <QueryProvider>
      {/* 2. Other providers (Navigation, Theme, etc.) */}
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </QueryProvider>
  );
}
```

**Important:** `QueryProvider` should be one of the outermost providers!

---

## Using Hooks in Components

### Example 1: Simple Query - Fetch and Display

```typescript
// screens/ParentProfileScreen.tsx
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useParentProfile } from '../hooks/useParentAPI';
import { getUserFriendlyErrorMessage } from '../services/api/errorHandler';

interface Props {
  route: {
    params: {
      parentId: string;
    };
  };
}

export function ParentProfileScreen({ route }: Props) {
  const { parentId } = route.params;

  // 1. Use the hook
  const { data: profile, isLoading, error } = useParentProfile(parentId);

  // 2. Handle loading state
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  // 3. Handle error state
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {getUserFriendlyErrorMessage(error)}
        </Text>
      </View>
    );
  }

  // 4. Handle missing data (shouldn't happen, but good practice)
  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>Profile not found</Text>
      </View>
    );
  }

  // 5. Render data
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parent Profile</Text>
      <Text>Phone: {profile.primary_phone}</Text>
      <Text>Email: {profile.alternate_email || 'N/A'}</Text>
      <Text>City: {profile.city || 'N/A'}</Text>
      <Text>
        Profile Completion: {profile.profile_completion_percentage}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  error: { color: 'red', fontSize: 16 },
});
```

### Example 2: Mutation - Update Data

```typescript
// components/NotificationSettingsForm.tsx
import React from 'react';
import { View, Switch, Text, Alert } from 'react-native';
import { useParentProfile, useUpdateNotificationPreferences } from '../hooks/useParentAPI';

interface Props {
  parentId: string;
}

export function NotificationSettingsForm({ parentId }: Props) {
  // 1. Fetch current settings
  const { data: profile } = useParentProfile(parentId);

  // 2. Set up mutation
  const { mutate: updatePreferences, isLoading } = useUpdateNotificationPreferences();

  // 3. Handle toggle
  const handleToggleInsights = (value: boolean) => {
    updatePreferences(
      {
        parentId,
        preferences: {
          ai_insights_enabled: value,
        },
      },
      {
        // Success callback
        onSuccess: () => {
          Alert.alert('Success', 'Notification settings updated');
        },
        // Error callback
        onError: (error) => {
          Alert.alert('Error', error.message);
        },
      }
    );
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>AI Insights</Text>
        <Switch
          value={profile?.ai_insights_enabled || false}
          onValueChange={handleToggleInsights}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}
```

### Example 3: List with Filtering

```typescript
// screens/ChildrenListScreen.tsx
import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { useParentChildren } from '../hooks/useParentAPI';

interface Props {
  parentId: string;
}

export function ChildrenListScreen({ parentId }: Props) {
  const { data: children = [], isLoading, refetch } = useParentChildren(parentId);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={children}
      keyExtractor={(item) => item.student_id}
      renderItem={({ item }) => (
        <View style={{ padding: 16, borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            {item.student_name}
          </Text>
          <Text>Relationship: {item.relationship_type}</Text>
          <Text>Status: {item.enrollment_status}</Text>
        </View>
      )}
      ListEmptyComponent={
        <View style={{ padding: 32, alignItems: 'center' }}>
          <Text>No children found</Text>
        </View>
      }
      onRefresh={refetch}
      refreshing={isLoading}
    />
  );
}
```

### Example 4: Dashboard with Multiple Queries

```typescript
// screens/ParentDashboardScreen.tsx
import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useParentDashboardData } from '../hooks/useParentAPI';

interface Props {
  parentId: string;
}

export function ParentDashboardScreen({ parentId }: Props) {
  // Single hook fetches all dashboard data
  const {
    profile,
    children,
    summary,
    isLoading,
    isFetching,
    hasError,
    refetchAll,
  } = useParentDashboardData(parentId);

  if (isLoading) {
    return <Text>Loading dashboard...</Text>;
  }

  if (hasError) {
    return <Text>Error loading dashboard</Text>;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={refetchAll}
        />
      }
    >
      {/* Summary Cards */}
      <View style={{ flexDirection: 'row', padding: 16 }}>
        <StatCard label="Children" value={summary?.total_children || 0} />
        <StatCard label="Messages" value={summary?.unread_messages || 0} />
        <StatCard label="Actions" value={summary?.pending_actions || 0} />
      </View>

      {/* Children List */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Your Children</Text>
        {children.map((child) => (
          <Text key={child.student_id}>{child.student_name}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

// Helper component
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={{ flex: 1, padding: 16, margin: 4, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
      <Text style={{ fontSize: 12, color: '#666' }}>{label}</Text>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{value}</Text>
    </View>
  );
}
```

### Example 5: Form with Mutation

```typescript
// components/EditProfileForm.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useParentProfile, useUpdateParentProfile } from '../hooks/useParentAPI';
import type { Parent } from '../types/supabase-parent.types';

interface Props {
  parentId: string;
  onSuccess?: () => void;
}

export function EditProfileForm({ parentId, onSuccess }: Props) {
  // Fetch current profile
  const { data: profile, isLoading: isFetchingProfile } = useParentProfile(parentId);

  // Set up mutation
  const {
    mutate: updateProfile,
    isLoading: isUpdating,
  } = useUpdateParentProfile();

  // Form state
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Initialize form when profile loads
  React.useEffect(() => {
    if (profile) {
      setPhone(profile.primary_phone);
      setCity(profile.city || '');
      setState(profile.state || '');
    }
  }, [profile]);

  const handleSubmit = () => {
    // Validate
    if (!phone) {
      Alert.alert('Error', 'Phone is required');
      return;
    }

    // Submit
    updateProfile(
      {
        parentId,
        updates: {
          primary_phone: phone,
          city,
          state,
        },
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Profile updated successfully');
          onSuccess?.();
        },
        onError: (error) => {
          Alert.alert('Error', error.message);
        },
      }
    );
  };

  if (isFetchingProfile) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />
      <TextInput
        placeholder="City"
        value={city}
        onChangeText={setCity}
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />
      <TextInput
        placeholder="State"
        value={state}
        onChangeText={setState}
        style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
      />
      <Button
        title="Save"
        onPress={handleSubmit}
        disabled={isUpdating}
      />
    </View>
  );
}
```

---

## Advanced Patterns

### 1. Conditional Fetching

Only fetch when certain conditions are met:

```typescript
function ConditionalFetch({ parentId, shouldFetch }: Props) {
  const { data } = useParentProfile(parentId, {
    // Only fetch when shouldFetch is true
    enabled: shouldFetch && !!parentId,
  });

  return <View>{/* ... */}</View>;
}
```

### 2. Dependent Queries

Fetch data based on previous query results:

```typescript
function DependentQueries({ parentId }: Props) {
  // First query: get parent profile
  const { data: profile } = useParentProfile(parentId);

  // Second query: only run if profile exists
  const { data: children } = useParentChildren(parentId, {
    enabled: !!profile?.parent_id,
  });

  return <View>{/* ... */}</View>;
}
```

### 3. Polling / Auto-Refetch

Automatically refetch data at intervals:

```typescript
function LiveDashboard({ parentId }: Props) {
  const { data: summary } = useDashboardSummary(parentId, {
    // Refetch every 30 seconds
    refetchInterval: 30 * 1000,

    // Only poll when window is focused
    refetchIntervalInBackground: false,
  });

  return <View>{/* ... */}</View>;
}
```

### 4. Optimistic Updates

Update UI before server responds:

```typescript
function OptimisticToggle({ parentId }: Props) {
  const queryClient = useQueryClient();
  const { data: profile } = useParentProfile(parentId);

  const { mutate } = useMutation({
    mutationFn: (enabled: boolean) =>
      updateNotificationPreferences(parentId, {
        ai_insights_enabled: enabled,
      }),

    // Optimistic update
    onMutate: async (enabled) => {
      // Cancel ongoing fetches
      await queryClient.cancelQueries(['parent', parentId, 'profile']);

      // Snapshot current value
      const previous = queryClient.getQueryData(['parent', parentId, 'profile']);

      // Optimistically update cache
      queryClient.setQueryData(['parent', parentId, 'profile'], (old: any) => ({
        ...old,
        ai_insights_enabled: enabled,
      }));

      // Return snapshot for rollback
      return { previous };
    },

    // Rollback on error
    onError: (err, variables, context) => {
      queryClient.setQueryData(['parent', parentId, 'profile'], context?.previous);
    },

    // Always refetch to ensure sync
    onSettled: () => {
      queryClient.invalidateQueries(['parent', parentId]);
    },
  });

  return (
    <Switch
      value={profile?.ai_insights_enabled || false}
      onValueChange={mutate}
    />
  );
}
```

### 5. Infinite Queries (Infinite Scroll)

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

function InfiniteList({ parentId }: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['children', parentId, 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      getParentChildrenPaginated(parentId, { page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });

  // Flatten pages
  const allChildren = data?.pages.flatMap((page) => page.data) || [];

  return (
    <FlatList
      data={allChildren}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator /> : null
      }
    />
  );
}
```

---

## Best Practices

### 1. Query Key Structure

```typescript
// ✅ GOOD - Hierarchical, predictable
const keys = {
  all: ['parent'],
  detail: (id) => ['parent', id],
  profile: (id) => ['parent', id, 'profile'],
  children: (id) => ['parent', id, 'children'],
};

// ❌ BAD - Flat, hard to invalidate
const badKeys = {
  profile: (id) => [`parent-${id}-profile`],
  children: (id) => [`children-${id}`],
};
```

### 2. Error Handling

```typescript
// ✅ GOOD - Specific error handling
if (error instanceof NotFoundError) {
  return <NotFoundScreen />;
} else if (error instanceof AuthenticationError) {
  return <LoginScreen />;
} else {
  return <ErrorScreen message={getUserFriendlyErrorMessage(error)} />;
}

// ❌ BAD - Generic error handling
if (error) {
  return <Text>Error</Text>;
}
```

### 3. Loading States

```typescript
// ✅ GOOD - Handle both loading and fetching
if (isLoading) {
  return <FullPageLoader />;
}

return (
  <View>
    {isFetching && <TopBarLoader />}
    {/* Content */}
  </View>
);

// ❌ BAD - Only handle initial loading
if (isLoading) return <Loader />;
```

### 4. Stale Time Configuration

```typescript
// ✅ GOOD - Specific stale times per data type
useParentProfile(id, { staleTime: 10 * 60 * 1000 }); // 10 min - profile rarely changes
useDashboardSummary(id, { staleTime: 60 * 1000 }); // 1 min - dashboard is dynamic
useNotifications(id, { staleTime: 0 }); // 0 - always fresh

// ❌ BAD - Same stale time for everything
// (uses default which might not be optimal)
```

### 5. Prefetching

```typescript
// ✅ GOOD - Prefetch before navigation
const navigation = useNavigation();
const { prefetchProfile } = usePrefetchParentData();

const handleNavigate = (parentId: string) => {
  prefetchProfile(parentId); // Start loading before navigate
  navigation.navigate('Profile', { parentId });
};

// ❌ BAD - No prefetching, slower UX
const handleNavigate = (parentId: string) => {
  navigation.navigate('Profile', { parentId });
};
```

---

## Troubleshooting

### Issue: Queries Not Refetching

**Symptoms:** Data doesn't update when it should

**Solutions:**
1. Check if `staleTime` is too high
2. Ensure you're invalidating queries after mutations
3. Verify `enabled` condition is true
4. Check if `refetchOnMount` or `refetchOnWindowFocus` are disabled

```typescript
// Debug: Force refetch
const { refetch } = useParentProfile(id);
refetch();

// Debug: Check query state
const { dataUpdatedAt, isStale } = useParentProfile(id);
console.log('Last updated:', new Date(dataUpdatedAt));
console.log('Is stale:', isStale);
```

### Issue: Too Many Requests

**Symptoms:** Network tab shows excessive requests

**Solutions:**
1. Increase `staleTime` to reduce refetches
2. Disable `refetchOnWindowFocus` for stable data
3. Use query key factory to prevent duplicate keys
4. Check for multiple components using same query

```typescript
// Fix: Increase stale time
useParentProfile(id, {
  staleTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
});
```

### Issue: Stale Data After Mutation

**Symptoms:** UI doesn't update after saving

**Solutions:**
1. Ensure you're invalidating queries in `onSuccess`
2. Check query key matches between query and invalidation
3. Verify mutation is actually succeeding

```typescript
// Fix: Proper invalidation
const { mutate } = useUpdateParentProfile();

mutate(
  { parentId, updates },
  {
    onSuccess: () => {
      // Invalidate to trigger refetch
      queryClient.invalidateQueries(['parent', parentId]);
    },
  }
);
```

### Issue: Memory Leaks

**Symptoms:** App crashes or slows down over time

**Solutions:**
1. Set appropriate `cacheTime` to garbage collect old data
2. Don't store large objects in query cache
3. Clean up infinite queries properly

```typescript
// Fix: Reasonable cache time
useParentProfile(id, {
  cacheTime: 5 * 60 * 1000, // 5 minutes max
});
```

---

## Migration Guide

### From useState to React Query

**Before:**
```typescript
function OldComponent({ parentId }) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getParentProfile(parentId)
      .then(setProfile)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [parentId]);

  // ...
}
```

**After:**
```typescript
function NewComponent({ parentId }) {
  const { data: profile, isLoading, error } = useParentProfile(parentId);

  // ...
}
```

### From Redux to React Query

**Before (Redux):**
```typescript
// Action
dispatch(fetchParentProfile(parentId));

// Selector
const profile = useSelector(state => state.parent.profile);
const isLoading = useSelector(state => state.parent.loading);

// Reducer needed, action creators, thunks, etc.
```

**After (React Query):**
```typescript
// Just the hook!
const { data: profile, isLoading } = useParentProfile(parentId);
```

---

## Summary Checklist

✅ **Setup:**
- [ ] Install `@tanstack/react-query`
- [ ] Create `queryClient.ts` configuration
- [ ] Create `QueryProvider.tsx` wrapper
- [ ] Wrap app with `QueryProvider`
- [ ] Install devtools (optional)

✅ **Service Layer:**
- [ ] Create service functions in `services/api/`
- [ ] Export typed functions
- [ ] Handle errors with `parseSupabaseError`
- [ ] Use `retryWithBackoff` for reads

✅ **Hooks Layer:**
- [ ] Create query key factory
- [ ] Create query hooks with `useQuery`
- [ ] Create mutation hooks with `useMutation`
- [ ] Invalidate queries in `onSuccess`
- [ ] Add TypeScript types

✅ **Components:**
- [ ] Use hooks in components
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Handle empty states
- [ ] Provide user feedback

✅ **Best Practices:**
- [ ] Set appropriate `staleTime` and `cacheTime`
- [ ] Use query key factory for consistency
- [ ] Prefetch on navigation
- [ ] Use optimistic updates sparingly
- [ ] Test with React Query DevTools

---

## Additional Resources

- [Official React Query Docs](https://tanstack.com/query/latest)
- [React Query Examples](https://tanstack.com/query/latest/docs/react/examples/react/simple)
- [TkDodo's Blog](https://tkdodo.eu/blog/practical-react-query) - Best React Query blog
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)

---

**Ready to build amazing UIs with automatic caching and data synchronization!** 🚀

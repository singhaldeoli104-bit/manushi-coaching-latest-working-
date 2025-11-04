# Student Screen Best Practices

**Production-ready guidelines for building student screens**
**Last Updated:** 2025-10-29

---

## Table of Contents

1. [Screen Creation Workflow](#screen-creation-workflow)
2. [Component Usage Patterns](#component-usage-patterns)
3. [Data Fetching & State Management](#data-fetching--state-management)
4. [Performance Optimization](#performance-optimization)
5. [Security & RLS](#security--rls)
6. [Accessibility](#accessibility)
7. [Error Handling](#error-handling)
8. [Testing Strategy](#testing-strategy)
9. [Code Quality](#code-quality)
10. [Common Pitfalls](#common-pitfalls)

---

## Screen Creation Workflow

### Step-by-Step Process

#### 1. Plan the Screen

**Before writing code:**
- ✅ Identify data requirements (what Supabase tables?)
- ✅ Choose appropriate hooks (useStudentProgress, etc.)
- ✅ List required components (Button, Card, etc.)
- ✅ Design error states (no data, network error, etc.)
- ✅ Define loading strategy (skeleton vs spinner)

**Example planning:**
```
Screen: Assignment List
Data: useStudentAssignments(studentId, { status: 'pending' })
Components: StudentTopBar, Card, Badge, EmptyState, LoadingState
Navigation: BottomNav (active: "Assignments")
Error States: Network error, No assignments
```

#### 2. Create Screen File

**File structure:**
```
src/screens/student/
├── assignments/
│   ├── AssignmentListScreen.tsx ✅
│   ├── AssignmentDetailScreen.tsx
│   └── AssignmentSubmissionScreen.tsx
```

**Naming convention:**
- `[Feature][Type]Screen.tsx` (e.g., `AssignmentListScreen.tsx`)
- PascalCase with "Screen" suffix

#### 3. Implement Screen Structure

**Template:**
```typescript
/**
 * Assignment List Screen
 *
 * Displays all student assignments with filtering by status
 *
 * Features:
 * - Real-time assignment updates
 * - Filter by status (pending/submitted/graded/overdue)
 * - Pull-to-refresh
 * - Empty state handling
 *
 * Dependencies:
 * - useStudentAssignments hook
 * - StudentBottomNav for navigation
 */

import React, { useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { BaseScreen } from '@/components/shared/BaseScreen';
import { StudentTopBar } from '@/components/student/navigation';
import { Card, Tabs, Badge, EmptyState } from '@/components/student';
import { useStudentAssignments } from '@/hooks/student/useStudentAssignments';
import { useStudent } from '@/context/StudentContext';
import { trackScreenView } from '@/utils/analytics';

export function AssignmentListScreen() {
  const navigation = useNavigation();
  const { student } = useStudent();
  const [activeTab, setActiveTab] = useState('pending');

  // Data fetching
  const { data: assignments, isLoading, error, refetch } = useStudentAssignments(student?.id, {
    status: activeTab,
  });

  // Analytics tracking
  React.useEffect(() => {
    trackScreenView('AssignmentList', { status: activeTab });
  }, [activeTab]);

  // Render assignment card
  const renderAssignment = React.useCallback(({ item }) => (
    <AssignmentCard
      assignment={item}
      onPress={() => navigation.navigate('AssignmentDetail', { id: item.id })}
    />
  ), [navigation]);

  return (
    <BaseScreen
      loading={isLoading}
      error={error}
      empty={!assignments || assignments.length === 0}
      emptyMessage="No assignments found"
    >
      <StudentTopBar
        title="Assignments"
        onMenuPress={() => navigation.openDrawer()}
      />

      <Tabs
        tabs={[
          { key: 'pending', label: 'Pending', badge: pendingCount },
          { key: 'submitted', label: 'Submitted' },
          { key: 'graded', label: 'Graded' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <FlatList
        data={assignments}
        renderItem={renderAssignment}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        initialNumToRender={10}
      />
    </BaseScreen>
  );
}

// Memoized card component
const AssignmentCard = React.memo(({ assignment, onPress }) => (
  <Card variant="elevated" onPress={onPress}>
    <CardHeader
      title={assignment.title}
      subtitle={`${assignment.subject} • Due: ${formatDate(assignment.dueDate)}`}
    />
    <CardContent>
      <Badge
        variant={assignment.status === 'overdue' ? 'error' : 'info'}
        value={assignment.daysUntilDue}
      />
    </CardContent>
  </Card>
));
```

#### 4. Apply Acceptance Checklist

**Verification before commit:**
- [ ] Uses BaseScreen wrapper
- [ ] Real Supabase data (NO mock arrays)
- [ ] All icon buttons have accessibilityLabel
- [ ] FlatList optimized (initialNumToRender, keyExtractor)
- [ ] Components memoized (React.memo)
- [ ] Analytics events tracked
- [ ] Safe navigation used (safeNavigate)
- [ ] TypeScript errors: 0
- [ ] ESLint warnings: 0
- [ ] Tested on real device

---

## Component Usage Patterns

### BaseScreen Wrapper

**Always use BaseScreen for consistent loading/error/empty handling:**

✅ **Correct:**
```typescript
<BaseScreen
  loading={isLoading}
  error={error}
  empty={!data || data.length === 0}
  emptyMessage="No items found"
  scrollable={true}
>
  <Content data={data} />
</BaseScreen>
```

❌ **Wrong:**
```typescript
<View>
  {isLoading && <LoadingState />}
  {error && <Text>Error</Text>}
  {data && <Content data={data} />}
</View>
```

### Navigation Pattern

**Always use safe navigation with analytics:**

✅ **Correct:**
```typescript
import { safeNavigate } from '@/utils/navigationService';
import { trackAction } from '@/utils/analytics';

const handlePress = (assignmentId: string) => {
  trackAction('view_assignment', 'AssignmentList', { assignmentId });
  safeNavigate('AssignmentDetail', { assignmentId });
};
```

❌ **Wrong:**
```typescript
const handlePress = (assignmentId: string) => {
  navigation.navigate('AssignmentDetail', { assignmentId });
};
```

### Component Composition

**Use atomic design hierarchy:**

✅ **Correct:**
```typescript
<Card variant="elevated">
  <CardHeader
    title="Physics Assignment"
    subtitle="Due: Oct 30"
  />
  <CardContent>
    <Text>Complete chapters 5-7</Text>
  </CardContent>
  <CardActions>
    <Button label="View" variant="text" onPress={handleView} />
    <Button label="Submit" variant="filled" onPress={handleSubmit} />
  </CardActions>
</Card>
```

❌ **Wrong:**
```typescript
<TouchableOpacity style={styles.customCard}>
  <View style={styles.header}>
    <Text style={styles.title}>Physics Assignment</Text>
  </View>
  <View style={styles.content}>
    <Text>Complete chapters 5-7</Text>
  </View>
</TouchableOpacity>
```

---

## Data Fetching & State Management

### React Query Pattern

**Always use custom hooks with React Query:**

✅ **Correct:**
```typescript
import { useStudentAssignments } from '@/hooks/student/useStudentAssignments';

function AssignmentsScreen() {
  const { student } = useStudent();
  const { data, isLoading, error, refetch } = useStudentAssignments(student?.id, {
    status: 'pending'
  });

  return (
    <BaseScreen loading={isLoading} error={error} empty={!data}>
      <FlatList data={data} renderItem={renderItem} />
    </BaseScreen>
  );
}
```

❌ **Wrong:**
```typescript
const [assignments, setAssignments] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    const { data } = await supabase.from('assignments').select();
    setAssignments(data);
    setLoading(false);
  };
  fetchData();
}, []);
```

### StudentContext Usage

**Access student profile via context:**

✅ **Correct:**
```typescript
import { useStudent } from '@/context/StudentContext';

function ProfileScreen() {
  const { student, loading, error, refetch } = useStudent();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!student) return <EmptyState />;

  return (
    <View>
      <Text>{student.name}</Text>
      <Text>{student.class} - {student.section}</Text>
    </View>
  );
}
```

❌ **Wrong:**
```typescript
const [profile, setProfile] = useState(null);

useEffect(() => {
  const fetchProfile = async () => {
    const { data } = await supabase
      .from('students')
      .select()
      .eq('id', userId)
      .single();
    setProfile(data);
  };
  fetchProfile();
}, []);
```

### Real-time Subscriptions

**Let custom hooks handle subscriptions:**

✅ **Correct:**
```typescript
// Hook already subscribes
const { data: schedule } = useStudentSchedule(studentId, { dateRange: 'today' });

// Data automatically updates via real-time subscription
```

❌ **Wrong:**
```typescript
useEffect(() => {
  const channel = supabase
    .channel('schedule')
    .on('postgres_changes', {...}, () => {
      // Manual subscription - not needed!
    })
    .subscribe();

  return () => channel.unsubscribe();
}, []);
```

---

## Performance Optimization

### FlatList Optimization

**Always optimize FlatLists for large datasets:**

✅ **Correct:**
```typescript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

❌ **Wrong:**
```typescript
<FlatList
  data={items}
  renderItem={renderItem}
  // Missing optimization props!
/>
```

### Component Memoization

**Memoize expensive components:**

✅ **Correct:**
```typescript
const AssignmentCard = React.memo(({ assignment, onPress }) => {
  return (
    <Card onPress={onPress}>
      <Text>{assignment.title}</Text>
    </Card>
  );
});
```

❌ **Wrong:**
```typescript
const AssignmentCard = ({ assignment, onPress }) => {
  return (
    <Card onPress={onPress}>
      <Text>{assignment.title}</Text>
    </Card>
  );
};
```

### useCallback for Functions

**Memoize callback functions:**

✅ **Correct:**
```typescript
const handlePress = useCallback((id: string) => {
  trackAction('view_item', 'List', { id });
  safeNavigate('Detail', { id });
}, []); // Empty deps = function never changes

const renderItem = useCallback(({ item }) => (
  <ItemCard item={item} onPress={handlePress} />
), [handlePress]);
```

❌ **Wrong:**
```typescript
const handlePress = (id: string) => {
  // Recreated on every render!
  trackAction('view_item', 'List', { id });
  safeNavigate('Detail', { id });
};

const renderItem = ({ item }) => (
  <ItemCard item={item} onPress={handlePress} />
);
```

### useMemo for Expensive Calculations

**Memoize computed values:**

✅ **Correct:**
```typescript
const filteredData = useMemo(() => {
  return data?.filter(item => item.status === activeFilter) || [];
}, [data, activeFilter]);

const sortedData = useMemo(() => {
  return [...filteredData].sort((a, b) => a.date.localeCompare(b.date));
}, [filteredData]);
```

❌ **Wrong:**
```typescript
// Recalculated on every render!
const filteredData = data?.filter(item => item.status === activeFilter) || [];
const sortedData = [...filteredData].sort((a, b) => a.date.localeCompare(b.date));
```

---

## Security & RLS

### Row Level Security (RLS)

**All Supabase tables MUST have RLS enabled:**

```sql
-- ✅ Correct: Students can only see their own data
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own assignments"
ON assignments FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Students can submit assignments"
ON student_submissions FOR INSERT
WITH CHECK (auth.uid() = student_id);
```

**Frontend checks (defense in depth):**
```typescript
// ✅ Always filter by authenticated user
const { data } = await supabase
  .from('assignments')
  .select()
  .eq('student_id', auth.user.id); // Important!

// ❌ Never trust client-provided user IDs without server validation
```

### Data Validation

**Validate all user inputs:**

✅ **Correct:**
```typescript
import { z } from 'zod';

const assignmentSubmissionSchema = z.object({
  assignmentId: z.string().uuid(),
  notes: z.string().max(500).optional(),
  fileUrl: z.string().url(),
});

const handleSubmit = async (data: unknown) => {
  try {
    const validated = assignmentSubmissionSchema.parse(data);
    await submitAssignment(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      showError('Invalid submission data');
    }
  }
};
```

❌ **Wrong:**
```typescript
const handleSubmit = async (data: any) => {
  // No validation!
  await submitAssignment(data);
};
```

### Sensitive Data

**Never log or expose sensitive data:**

✅ **Correct:**
```typescript
console.log('Submitting assignment:', { assignmentId, timestamp });
// NO email, NO phone, NO passwords, NO personal info
```

❌ **Wrong:**
```typescript
console.log('User data:', student); // Contains email, phone, etc!
```

---

## Accessibility

### Semantic Labels

**Add accessibilityLabel to all interactive elements:**

✅ **Correct:**
```typescript
<Pressable
  onPress={handlePress}
  accessibilityRole="button"
  accessibilityLabel="Submit assignment"
  accessibilityHint="Double tap to submit your completed assignment"
>
  <Text>Submit</Text>
</Pressable>
```

❌ **Wrong:**
```typescript
<Pressable onPress={handlePress}>
  <Text>Submit</Text>
</Pressable>
```

### Touch Targets

**Ensure minimum 48dp touch targets (MD3 spec):**

✅ **Correct:**
```typescript
<Pressable
  style={styles.button} // height: 48, width: 48 minimum
  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} // Expand touch area
  onPress={handlePress}
>
  <Icon size={24} />
</Pressable>
```

❌ **Wrong:**
```typescript
<Pressable
  style={{ height: 24, width: 24 }} // Too small!
  onPress={handlePress}
>
  <Icon size={24} />
</Pressable>
```

### Screen Reader Support

**Test with TalkBack (Android) / VoiceOver (iOS):**

```typescript
// Proper heading hierarchy
<Text accessibilityRole="header" accessibilityLevel={1}>
  Dashboard
</Text>
<Text accessibilityRole="header" accessibilityLevel={2}>
  Assignments
</Text>

// Descriptive links
<Button
  label="View Details"
  accessibilityHint="Opens assignment detail screen"
  onPress={handleViewDetails}
/>

// Live regions for dynamic content
<View accessibilityLiveRegion="polite">
  <Text>New notification received</Text>
</View>
```

---

## Error Handling

### Component-level Error Handling

✅ **Correct:**
```typescript
function AssignmentsScreen() {
  const { data, isLoading, error, refetch } = useStudentAssignments(studentId);

  if (isLoading) return <LoadingState />;

  if (error) {
    return (
      <ErrorState
        title="Failed to load assignments"
        message={error.message}
        actionLabel="Try Again"
        onAction={refetch}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No Assignments"
        description="You don't have any assignments yet"
      />
    );
  }

  return <Content data={data} />;
}
```

❌ **Wrong:**
```typescript
function AssignmentsScreen() {
  const { data } = useStudentAssignments(studentId);
  // No error handling!
  return <FlatList data={data} />;
}
```

### Mutation Error Handling

✅ **Correct:**
```typescript
const submitMutation = useMutation({
  mutationFn: submitAssignment,
  onSuccess: () => {
    showToast('Assignment submitted successfully', 'success');
    navigation.goBack();
  },
  onError: (error: Error) => {
    showToast(`Submission failed: ${error.message}`, 'error');
    console.error('Submission error:', error);
  },
});

const handleSubmit = () => {
  try {
    submitMutation.mutate(formData);
  } catch (error) {
    // Handle synchronous errors
    showToast('Invalid form data', 'error');
  }
};
```

### Network Error Recovery

**Implement retry logic:**

```typescript
const { data, error, refetch } = useQuery({
  queryKey: ['assignments'],
  queryFn: fetchAssignments,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

// Pull-to-refresh
<RefreshControl
  refreshing={isLoading}
  onRefresh={refetch}
/>
```

---

## Testing Strategy

### Unit Testing (Components)

```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AssignmentCard } from './AssignmentCard';

describe('AssignmentCard', () => {
  it('renders assignment title', () => {
    const assignment = {
      id: '1',
      title: 'Physics Assignment',
      subject: 'Physics',
      dueDate: '2025-10-30',
    };

    render(<AssignmentCard assignment={assignment} onPress={jest.fn()} />);

    expect(screen.getByText('Physics Assignment')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<AssignmentCard assignment={mockAssignment} onPress={onPress} />);

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledWith(mockAssignment.id);
  });
});
```

### Integration Testing (Hooks)

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStudentAssignments } from './useStudentAssignments';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useStudentAssignments', () => {
  it('fetches assignments', async () => {
    const { result } = renderHook(
      () => useStudentAssignments('student-123'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeDefined();
    expect(result.current.data.length).toBeGreaterThan(0);
  });
});
```

### E2E Testing (Device)

**Manual testing checklist:**
- [ ] Screen loads without errors
- [ ] Data displays correctly
- [ ] Pull-to-refresh works
- [ ] Navigation works
- [ ] Error states display properly
- [ ] Empty states display properly
- [ ] Loading states display properly
- [ ] Buttons are responsive
- [ ] Forms validate input
- [ ] Submissions succeed

---

## Code Quality

### TypeScript

**Strict type checking:**

```typescript
// ✅ Use specific types
interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
}

// ❌ Avoid any
function handleData(data: any) { } // Bad!

// ✅ Use proper typing
function handleData(data: Assignment[]) { } // Good!
```

### ESLint Rules

**Follow project ESLint configuration:**

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'react/prop-types': 'off', // Using TypeScript
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
```

### Code Organization

**File structure:**

```typescript
// ✅ Correct order
// 1. Imports (external libraries first)
import React, { useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 2. Imports (internal components)
import { BaseScreen } from '@/components/shared/BaseScreen';
import { Card, Button } from '@/components/student';

// 3. Imports (hooks & utils)
import { useStudentAssignments } from '@/hooks/student/useStudentAssignments';
import { formatDate } from '@/utils/dateUtils';

// 4. Types & interfaces
interface Props {
  studentId: string;
}

// 5. Component
export function AssignmentListScreen({ studentId }: Props) {
  // 5a. Hooks
  const navigation = useNavigation();
  const [filter, setFilter] = useState('all');

  // 5b. Data fetching
  const { data, isLoading, error } = useStudentAssignments(studentId);

  // 5c. Callbacks & handlers
  const handlePress = useCallback((id: string) => {
    navigation.navigate('Detail', { id });
  }, [navigation]);

  // 5d. Render helpers
  const renderItem = useCallback(({ item }) => (
    <Card onPress={() => handlePress(item.id)} />
  ), [handlePress]);

  // 5e. Return JSX
  return (
    <BaseScreen>
      <FlatList data={data} renderItem={renderItem} />
    </BaseScreen>
  );
}

// 6. Styles (at bottom)
const styles = StyleSheet.create({
  container: { flex: 1 },
});
```

---

## Common Pitfalls

### 1. Mock Data Instead of Supabase

❌ **Wrong:**
```typescript
const [assignments] = useState([
  { id: '1', title: 'Test Assignment' }
]);
```

✅ **Correct:**
```typescript
const { data: assignments } = useStudentAssignments(studentId);
```

### 2. Direct Supabase Queries Instead of Hooks

❌ **Wrong:**
```typescript
useEffect(() => {
  const fetch = async () => {
    const { data } = await supabase.from('assignments').select();
    setData(data);
  };
  fetch();
}, []);
```

✅ **Correct:**
```typescript
const { data } = useStudentAssignments(studentId);
```

### 3. Not Using BaseScreen Wrapper

❌ **Wrong:**
```typescript
return (
  <View>
    {isLoading && <Spinner />}
    {error && <Text>Error</Text>}
    {data && <Content />}
  </View>
);
```

✅ **Correct:**
```typescript
<BaseScreen loading={isLoading} error={error} empty={!data}>
  <Content data={data} />
</BaseScreen>
```

### 4. Forgetting to Memoize Components

❌ **Wrong:**
```typescript
const Card = ({ item }) => <View>...</View>;

<FlatList
  data={items}
  renderItem={({ item }) => <Card item={item} />}
/>
```

✅ **Correct:**
```typescript
const Card = React.memo(({ item }) => <View>...</View>);

const renderItem = useCallback(({ item }) => (
  <Card item={item} />
), []);

<FlatList
  data={items}
  renderItem={renderItem}
/>
```

### 5. Not Tracking Analytics

❌ **Wrong:**
```typescript
const handlePress = () => {
  navigation.navigate('Detail');
};
```

✅ **Correct:**
```typescript
const handlePress = () => {
  trackAction('view_detail', 'List');
  safeNavigate('Detail');
};
```

### 6. Hardcoded Colors Instead of Theme

❌ **Wrong:**
```typescript
<View style={{ backgroundColor: '#1976D2' }}>
  <Text style={{ color: '#FFFFFF' }}>Title</Text>
</View>
```

✅ **Correct:**
```typescript
import { LightTheme } from '@/theme/colors';

<View style={{ backgroundColor: LightTheme.Primary }}>
  <Text style={{ color: LightTheme.OnPrimary }}>Title</Text>
</View>
```

### 7. Not Handling Empty States

❌ **Wrong:**
```typescript
<FlatList data={data} renderItem={renderItem} />
```

✅ **Correct:**
```typescript
<FlatList
  data={data}
  renderItem={renderItem}
  ListEmptyComponent={
    <EmptyState
      title="No assignments"
      description="You don't have any assignments yet"
    />
  }
/>
```

### 8. Memory Leaks (Subscriptions)

❌ **Wrong:**
```typescript
useEffect(() => {
  supabase.channel('room').subscribe(); // Memory leak!
}, []);
```

✅ **Correct:**
```typescript
useEffect(() => {
  const subscription = supabase.channel('room').subscribe();
  return () => subscription.unsubscribe(); // Cleanup!
}, []);
```

---

## Checklist Template

**Copy this for every new screen:**

```markdown
## [Screen Name] Implementation Checklist

### Planning
- [ ] Data requirements identified
- [ ] Hooks selected
- [ ] Components listed
- [ ] Error states designed
- [ ] Loading strategy chosen

### Implementation
- [ ] Screen file created in correct directory
- [ ] BaseScreen wrapper used
- [ ] Real Supabase data (NO mock arrays)
- [ ] StudentContext used for profile
- [ ] Custom hooks used for data
- [ ] Navigation components added (TopBar/BottomNav)

### Optimization
- [ ] FlatList optimized (if applicable)
- [ ] Components memoized (React.memo)
- [ ] Callbacks memoized (useCallback)
- [ ] Expensive calculations memoized (useMemo)

### Accessibility
- [ ] All buttons have accessibilityLabel
- [ ] Touch targets >= 48dp
- [ ] Screen reader tested

### Quality
- [ ] TypeScript errors: 0
- [ ] ESLint warnings: 0
- [ ] Analytics tracking added
- [ ] Safe navigation used
- [ ] Error handling implemented
- [ ] Empty states handled
- [ ] Loading states handled

### Testing
- [ ] Tested on real Android device
- [ ] Pull-to-refresh works
- [ ] Navigation works
- [ ] No console errors
- [ ] Performance is smooth
```

---

**Related Guides:**
- [STUDENT_COMPONENTS_GUIDE.md](./STUDENT_COMPONENTS_GUIDE.md) - Component documentation
- [STUDENT_HOOKS_GUIDE.md](./STUDENT_HOOKS_GUIDE.md) - Hooks & context documentation
- [ACCEPTANCE_CHECKLIST.md](./ACCEPTANCE_CHECKLIST.md) - Quality gate before completion

**Last Updated:** 2025-10-29

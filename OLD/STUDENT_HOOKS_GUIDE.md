# Student Hooks & Context Guide

**Complete reference for StudentContext and 6 custom hooks**
**Location:** `C:\PC\OLD\src\`
**Last Updated:** 2025-10-29

---

## Table of Contents

### Context
1. [StudentContext](#1-studentcontext) - Global student state management

### Custom Hooks
2. [useStudentProgress](#2-usestudentprogress) - Progress metrics & trends
3. [useStudentSchedule](#3-usestudentschedule) - Classes & assignments schedule
4. [useStudentAssignments](#4-usestudentassignments) - Assignment management
5. [useStudentDoubts](#5-usestudentdoubts) - Doubt/question tracking
6. [useStudentAttendance](#6-usestudentattendance) - Attendance records
7. [useStudentNotifications](#7-usestudentnotifications) - Notification management

### Patterns
- [React Query Patterns](#react-query-patterns)
- [Real-time Subscriptions](#real-time-subscriptions)
- [Error Handling](#error-handling)
- [Caching Strategy](#caching-strategy)

---

## 1. StudentContext

**Location:** `src/context/StudentContext.tsx`
**Purpose:** Global state management for student profile data

### Overview

StudentContext provides centralized access to the authenticated student's profile data across the entire app. It integrates with AuthContext for student_id and uses React Query for data fetching.

### Setup

```typescript
// App.tsx or root component
import { StudentProvider } from '@/context/StudentContext';
import { AuthProvider } from '@/context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <StudentProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </StudentProvider>
    </AuthProvider>
  );
}
```

### Usage

```typescript
import { useStudent } from '@/context/StudentContext';

function StudentDashboard() {
  const { student, loading, error, refetch } = useStudent();

  if (loading) return <LoadingState />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!student) return <Text>No student data</Text>;

  return (
    <View>
      <Text>Welcome, {student.name}!</Text>
      <Text>Class: {student.class}</Text>
      <Text>Section: {student.section}</Text>
    </View>
  );
}
```

### TypeScript Interface

```typescript
interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  class?: string;
  section?: string;
  rollNumber?: string;
  dateOfBirth?: string;
  address?: string;
  guardianPhone?: string;
  createdAt: string;
  updatedAt: string;
}

interface StudentContextState {
  student: StudentProfile | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}
```

### Features

- ✅ Integrates with useAuth for student_id
- ✅ React Query caching (staleTime: 5 minutes, gcTime: 10 minutes)
- ✅ Automatic refetch on window focus
- ✅ TypeScript type safety
- ✅ Error handling with retry logic

### React Query Configuration

```typescript
const { data: student, isLoading: loading, error, refetch } = useQuery<StudentProfile | null, Error>({
  queryKey: ['student', studentId],
  queryFn: async () => {
    if (!studentId) return null;
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();
    if (error) throw new Error(error.message);
    return data as StudentProfile;
  },
  enabled: !!studentId,
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
});
```

### When to Use

- **Profile screens:** Display student information
- **Navigation components:** Show student name/avatar in drawer
- **Forms:** Pre-fill student data
- **Analytics:** Track student-specific events

### Common Patterns

**Conditional rendering based on profile:**
```typescript
const { student } = useStudent();

if (student?.class === '12th') {
  return <BoardExamSection />;
}
```

**Refetch after profile update:**
```typescript
const { refetch } = useStudent();

const updateProfile = async (data) => {
  await supabase.from('students').update(data).eq('id', studentId);
  refetch(); // Refresh context
};
```

---

## 2. useStudentProgress

**Location:** `src/hooks/student/useStudentProgress.ts`
**Purpose:** Fetch and track student progress metrics

### Usage

```typescript
import { useStudentProgress } from '@/hooks/student/useStudentProgress';

function ProgressDashboard() {
  const { data: progress, isLoading, error, refetch } = useStudentProgress(studentId);

  if (isLoading) return <LoadingState variant="skeleton-card" />;
  if (error) return <ErrorState message={error.message} />;
  if (!progress) return <EmptyState title="No progress data" />;

  return (
    <View>
      <Text>Overall Progress: {progress.overallProgress}%</Text>

      {progress.subjectProgress.map(subject => (
        <Card key={subject.subjectId}>
          <Text>{subject.subjectName}: {subject.progress}%</Text>
          <ProgressBar value={subject.progress} />
        </Card>
      ))}

      <Text>Weekly Trend: {progress.weeklyTrend > 0 ? '↑' : '↓'} {Math.abs(progress.weeklyTrend)}%</Text>
    </View>
  );
}
```

### Return Type

```typescript
interface ProgressData {
  overallProgress: number; // 0-100
  subjectProgress: SubjectProgress[];
  weeklyTrend: number; // Percentage change
  monthlyTrend: number; // Percentage change
  lastUpdated: string; // ISO timestamp
}

interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  progress: number; // 0-100
  completedTopics: number;
  totalTopics: number;
  lastStudied: string; // ISO timestamp
}
```

### React Query Configuration

```typescript
{
  queryKey: ['studentProgress', studentId],
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
}
```

### Supabase Query

```typescript
const { data, error } = await supabase
  .from('student_progress')
  .select(`
    *,
    subjects:subject_id (
      id,
      name
    )
  `)
  .eq('student_id', studentId);
```

### Features

- ✅ Overall progress calculation
- ✅ Subject-wise breakdown
- ✅ Weekly/monthly trends
- ✅ React Query caching
- ✅ Automatic refetch on window focus

### When to Use

- **Dashboard:** Show progress overview
- **Progress screens:** Detailed progress tracking
- **Reports:** Generate progress reports

---

## 3. useStudentSchedule

**Location:** `src/hooks/student/useStudentSchedule.ts`
**Purpose:** Fetch student schedule (classes + assignments)

### Usage

```typescript
import { useStudentSchedule } from '@/hooks/student/useStudentSchedule';

function ScheduleScreen() {
  const { data: schedule, isLoading, error } = useStudentSchedule(studentId, {
    dateRange: 'today', // 'today' | 'week' | 'month'
  });

  if (isLoading) return <LoadingState variant="skeleton-list" count={5} />;
  if (error) return <ErrorState />;

  return (
    <FlatList
      data={schedule}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card>
          <Text>{item.title}</Text>
          <Text>{item.type === 'class' ? 'Live Class' : 'Assignment'}</Text>
          <Text>{formatTime(item.startTime)}</Text>
        </Card>
      )}
    />
  );
}
```

### Return Type

```typescript
interface ScheduleItem {
  id: string;
  type: 'class' | 'assignment';
  title: string;
  subject: string;
  startTime: string; // ISO timestamp
  endTime: string; // ISO timestamp
  duration: number; // minutes
  status: 'upcoming' | 'ongoing' | 'completed' | 'missed';
  location?: string; // For classes
  teacher?: string; // For classes
  dueDate?: string; // For assignments (ISO timestamp)
}
```

### React Query Configuration

```typescript
{
  queryKey: ['studentSchedule', studentId, dateRange],
  staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates)
  gcTime: 5 * 60 * 1000, // 5 minutes
}
```

### Real-time Subscription

```typescript
// Automatically subscribes to schedule changes
useEffect(() => {
  const subscription = supabase
    .channel(`schedule-${studentId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'classes',
      filter: `student_id=eq.${studentId}`,
    }, () => {
      queryClient.invalidateQueries({ queryKey: ['studentSchedule', studentId] });
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, [studentId]);
```

### Features

- ✅ Real-time schedule updates
- ✅ Filter by date range (today/week/month)
- ✅ Sort by time ascending
- ✅ Combined classes + assignments
- ✅ Status calculation (upcoming/ongoing/completed)

### When to Use

- **Schedule screens:** Display daily/weekly schedule
- **Dashboard:** Show today's classes
- **Reminders:** Upcoming class notifications

---

## 4. useStudentAssignments

**Location:** `src/hooks/student/useStudentAssignments.ts`
**Purpose:** Fetch and manage student assignments

### Usage

```typescript
import { useStudentAssignments } from '@/hooks/student/useStudentAssignments';

function AssignmentsScreen() {
  const { data: assignments, isLoading, error } = useStudentAssignments(studentId, {
    status: 'pending', // 'all' | 'pending' | 'submitted' | 'graded' | 'overdue'
  });

  return (
    <FlatList
      data={assignments}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card onPress={() => navigation.navigate('AssignmentDetail', { id: item.id })}>
          <CardHeader
            title={item.title}
            subtitle={`${item.subject} • Due: ${formatDate(item.dueDate)}`}
          />
          <CardContent>
            <Badge
              variant={item.status === 'overdue' ? 'error' : 'info'}
              value={item.daysUntilDue}
            />
            <Text>{item.daysUntilDue} days left</Text>
          </CardContent>
        </Card>
      )}
    />
  );
}
```

### Return Type

```typescript
interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  subjectId: string;
  teacher: string;
  teacherId: string;
  dueDate: string; // ISO timestamp
  totalMarks: number;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  submittedAt?: string; // ISO timestamp
  score?: number;
  feedback?: string;
  attachments: Attachment[];
  daysUntilDue: number; // Calculated field
  createdAt: string;
  updatedAt: string;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string; // mime type
  size: number; // bytes
}
```

### React Query Configuration

```typescript
{
  queryKey: ['studentAssignments', studentId, status],
  staleTime: 3 * 60 * 1000, // 3 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
}
```

### Supabase Query

```typescript
let query = supabase
  .from('assignments')
  .select(`
    *,
    subjects:subject_id (id, name),
    teachers:teacher_id (id, name),
    submissions:student_submissions (status, submitted_at, score, feedback)
  `)
  .eq('student_id', studentId);

if (status !== 'all') {
  query = query.eq('status', status);
}

query = query.order('due_date', { ascending: true });
```

### Features

- ✅ Filter by status
- ✅ Sort by due date
- ✅ Days until due calculation
- ✅ Overdue detection
- ✅ Attachment support
- ✅ Submission tracking

### When to Use

- **Assignment screens:** List all assignments
- **Dashboard:** Show pending assignments
- **Notifications:** Assignment reminders

### Mutation Example (Submit Assignment)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function AssignmentDetailScreen({ assignmentId }) {
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: async (data: { file: File; notes: string }) => {
      return await supabase
        .from('student_submissions')
        .insert({
          assignment_id: assignmentId,
          student_id: studentId,
          file_url: await uploadFile(data.file),
          notes: data.notes,
          submitted_at: new Date().toISOString(),
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentAssignments', studentId] });
    },
  });

  return (
    <Button
      label="Submit Assignment"
      onPress={() => submitMutation.mutate({ file, notes })}
      loading={submitMutation.isPending}
    />
  );
}
```

---

## 5. useStudentDoubts

**Location:** `src/hooks/student/useStudentDoubts.ts`
**Purpose:** Fetch and manage student doubts/questions

### Usage

```typescript
import { useStudentDoubts } from '@/hooks/student/useStudentDoubts';

function DoubtsScreen() {
  const { data, isLoading, error, fetchNextPage, hasNextPage } = useStudentDoubts(studentId, {
    status: 'open', // 'all' | 'open' | 'answered' | 'closed'
  });

  const doubts = data?.pages.flat() || [];

  return (
    <FlatList
      data={doubts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card>
          <Text>{item.question}</Text>
          <Text>Subject: {item.subject}</Text>
          {item.answer && (
            <View>
              <Text>Answer: {item.answer}</Text>
              <Text>By: {item.answeredBy}</Text>
            </View>
          )}
        </Card>
      )}
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
    />
  );
}
```

### Return Type

```typescript
interface Doubt {
  id: string;
  question: string;
  subject: string;
  subjectId: string;
  status: 'open' | 'answered' | 'closed';
  answer?: string;
  answeredBy?: string; // Teacher name
  answeredAt?: string; // ISO timestamp
  createdAt: string;
  updatedAt: string;
}
```

### React Query Configuration (Infinite Query)

```typescript
{
  queryKey: ['studentDoubts', studentId, status],
  queryFn: ({ pageParam = 0 }) => fetchDoubts(studentId, status, pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages) => {
    return lastPage.length === 10 ? allPages.length : undefined;
  },
  staleTime: 2 * 60 * 1000, // 2 minutes
}
```

### Real-time Subscription

```typescript
// Automatically subscribes to new answers
useEffect(() => {
  const subscription = supabase
    .channel(`doubts-${studentId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'doubts',
      filter: `student_id=eq.${studentId}`,
    }, () => {
      queryClient.invalidateQueries({ queryKey: ['studentDoubts', studentId] });
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, [studentId]);
```

### Features

- ✅ Pagination support (10 items per page)
- ✅ Real-time answer notifications
- ✅ Filter by status
- ✅ Teacher response tracking

### When to Use

- **Doubts screens:** List all questions
- **Dashboard:** Show unanswered doubts count
- **Notifications:** New answer notifications

---

## 6. useStudentAttendance

**Location:** `src/hooks/student/useStudentAttendance.ts`
**Purpose:** Fetch and track student attendance

### Usage

```typescript
import { useStudentAttendance } from '@/hooks/student/useStudentAttendance';

function AttendanceScreen() {
  const { data: attendance, isLoading, error } = useStudentAttendance(studentId, {
    month: '2025-10', // YYYY-MM format
  });

  if (isLoading) return <LoadingState />;
  if (!attendance) return <EmptyState title="No attendance data" />;

  return (
    <View>
      <Text>Overall: {attendance.overallPercentage}%</Text>

      {attendance.subjectAttendance.map(subject => (
        <Card key={subject.subjectId}>
          <Text>{subject.subjectName}: {subject.percentage}%</Text>
          <Text>Present: {subject.present} / {subject.total}</Text>
        </Card>
      ))}

      {/* Calendar view */}
      <Calendar markedDates={attendance.monthlyData} />
    </View>
  );
}
```

### Return Type

```typescript
interface AttendanceData {
  overallPercentage: number; // 0-100
  totalClasses: number;
  attendedClasses: number;
  absentClasses: number;
  subjectAttendance: SubjectAttendance[];
  monthlyData: Record<string, AttendanceDay>; // For calendar
  lastUpdated: string; // ISO timestamp
}

interface SubjectAttendance {
  subjectId: string;
  subjectName: string;
  percentage: number; // 0-100
  present: number;
  absent: number;
  total: number;
}

interface AttendanceDay {
  status: 'present' | 'absent' | 'no-class';
  marked?: boolean;
  selectedColor?: string;
  dotColor?: string;
}
```

### React Query Configuration

```typescript
{
  queryKey: ['studentAttendance', studentId, month],
  staleTime: 10 * 60 * 1000, // 10 minutes (less frequent updates)
  gcTime: 30 * 60 * 1000, // 30 minutes
}
```

### Features

- ✅ Overall percentage calculation
- ✅ Subject-wise breakdown
- ✅ Monthly calendar data
- ✅ Present/absent counts

### When to Use

- **Attendance screens:** Display attendance records
- **Dashboard:** Show attendance percentage
- **Reports:** Generate attendance reports
- **Warnings:** Low attendance alerts

---

## 7. useStudentNotifications

**Location:** `src/hooks/student/useStudentNotifications.ts`
**Purpose:** Fetch and manage notifications

### Usage

```typescript
import { useStudentNotifications } from '@/hooks/student/useStudentNotifications';

function NotificationsScreen() {
  const {
    data: notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead
  } = useStudentNotifications(studentId);

  return (
    <View>
      <Text>Unread: {unreadCount}</Text>
      <Button label="Mark All Read" onPress={markAllAsRead} />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            onPress={() => markAsRead(item.id)}
            style={!item.read && styles.unread}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.message}</Text>
            <Text>{formatTime(item.createdAt)}</Text>
          </Card>
        )}
      />
    </View>
  );
}
```

### Return Type

```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'class' | 'grade' | 'announcement' | 'reminder';
  read: boolean;
  actionUrl?: string; // Deep link
  createdAt: string; // ISO timestamp
}

interface UseStudentNotificationsReturn {
  data: Notification[];
  isLoading: boolean;
  error: Error | null;
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetch: () => void;
}
```

### React Query Configuration

```typescript
{
  queryKey: ['studentNotifications', studentId],
  staleTime: 1 * 60 * 1000, // 1 minute (frequent updates)
  gcTime: 5 * 60 * 1000, // 5 minutes
}
```

### Real-time Subscription

```typescript
// Automatically subscribes to new notifications
useEffect(() => {
  const subscription = supabase
    .channel(`notifications-${studentId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `student_id=eq.${studentId}`,
    }, () => {
      queryClient.invalidateQueries({ queryKey: ['studentNotifications', studentId] });
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, [studentId]);
```

### Features

- ✅ Real-time new notifications
- ✅ Unread count badge
- ✅ Mark as read (single/all)
- ✅ Filter by read/unread
- ✅ Deep link support

### When to Use

- **Notification screens:** Display all notifications
- **Top bar:** Show unread count badge
- **Push notifications:** Sync with device notifications

---

## React Query Patterns

### Basic Query Pattern

```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['key', param],
  queryFn: async () => {
    const { data, error } = await supabase.from('table').select();
    if (error) throw new Error(error.message);
    return data;
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
});
```

### Infinite Query Pattern (Pagination)

```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['key', param],
  queryFn: ({ pageParam = 0 }) => fetchData(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages) => {
    return lastPage.length === 10 ? allPages.length : undefined;
  },
});

// Flatten pages
const items = data?.pages.flat() || [];
```

### Mutation Pattern

```typescript
const mutation = useMutation({
  mutationFn: async (data) => {
    return await supabase.from('table').insert(data);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['key'] });
  },
  onError: (error) => {
    console.error('Mutation failed:', error);
  },
});

// Usage
mutation.mutate(formData);
```

---

## Real-time Subscriptions

### Basic Subscription Pattern

```typescript
useEffect(() => {
  const subscription = supabase
    .channel('channel-name')
    .on('postgres_changes', {
      event: '*', // 'INSERT' | 'UPDATE' | 'DELETE' | '*'
      schema: 'public',
      table: 'table_name',
      filter: `column=eq.${value}`,
    }, (payload) => {
      console.log('Change received!', payload);
      queryClient.invalidateQueries({ queryKey: ['key'] });
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, [dependencies]);
```

### Broadcast Pattern (Typing Indicators)

```typescript
// Send broadcast
const channel = supabase.channel('room-1');
channel.send({
  type: 'broadcast',
  event: 'typing',
  payload: { userId, isTyping: true },
});

// Receive broadcast
channel.on('broadcast', { event: 'typing' }, (payload) => {
  console.log('User typing:', payload);
});
```

---

## Error Handling

### Component-level Error Handling

```typescript
function MyComponent() {
  const { data, isLoading, error } = useStudentProgress(studentId);

  if (isLoading) return <LoadingState />;

  if (error) {
    return (
      <ErrorState
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  return <Content data={data} />;
}
```

### Global Error Boundary

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error) => {
        console.error('Query error:', error);
        // Optional: Show toast notification
      },
    },
  },
});
```

---

## Caching Strategy

### Cache Times by Data Type

| Data Type | staleTime | gcTime | Reasoning |
|-----------|-----------|---------|-----------|
| **Student Profile** | 5 min | 10 min | Rarely changes |
| **Progress** | 5 min | 10 min | Updates gradually |
| **Schedule** | 2 min | 5 min | Frequent updates |
| **Assignments** | 3 min | 10 min | Moderate updates |
| **Doubts** | 2 min | 5 min | Real-time answers |
| **Attendance** | 10 min | 30 min | Daily updates |
| **Notifications** | 1 min | 5 min | Real-time |

### Manual Cache Invalidation

```typescript
import { useQueryClient } from '@tanstack/react-query';

function UpdateProfileButton() {
  const queryClient = useQueryClient();

  const handleUpdate = async () => {
    await updateProfile(data);

    // Invalidate specific query
    queryClient.invalidateQueries({ queryKey: ['student', studentId] });

    // Invalidate all related queries
    queryClient.invalidateQueries({ queryKey: ['student'] });

    // Refetch immediately
    await queryClient.refetchQueries({ queryKey: ['student', studentId] });
  };

  return <Button label="Update" onPress={handleUpdate} />;
}
```

---

## Best Practices

### 1. Always use TypeScript types

```typescript
// ✅ Good
const { data: assignments } = useStudentAssignments(studentId);

// ❌ Bad
const { data } = useStudentAssignments(studentId);
```

### 2. Handle all loading/error states

```typescript
// ✅ Good
if (isLoading) return <LoadingState />;
if (error) return <ErrorState message={error.message} />;
if (!data) return <EmptyState />;
return <Content data={data} />;

// ❌ Bad
return data ? <Content data={data} /> : null;
```

### 3. Use enabled flag for conditional queries

```typescript
// ✅ Good
const { data } = useQuery({
  queryKey: ['data', id],
  queryFn: fetchData,
  enabled: !!id, // Only fetch if id exists
});

// ❌ Bad
const { data } = useQuery({
  queryKey: ['data', id],
  queryFn: () => id ? fetchData(id) : null,
});
```

### 4. Unsubscribe from real-time channels

```typescript
// ✅ Good
useEffect(() => {
  const subscription = supabase.channel('room').subscribe();
  return () => subscription.unsubscribe(); // Cleanup
}, []);

// ❌ Bad
useEffect(() => {
  supabase.channel('room').subscribe(); // Memory leak!
}, []);
```

### 5. Use query keys consistently

```typescript
// ✅ Good - Hierarchical keys
['student', studentId]
['studentProgress', studentId]
['studentAssignments', studentId, status]

// ❌ Bad - Flat keys
['student-123']
['progress-123']
```

---

## Common Mistakes

### 1. Not using React Query for Supabase

❌ **Wrong:**
```typescript
const [data, setData] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    const { data } = await supabase.from('table').select();
    setData(data);
  };
  fetchData();
}, []);
```

✅ **Correct:**
```typescript
const { data } = useQuery({
  queryKey: ['table'],
  queryFn: async () => {
    const { data } = await supabase.from('table').select();
    return data;
  },
});
```

### 2. Forgetting to invalidate cache after mutations

❌ **Wrong:**
```typescript
const updateData = async () => {
  await supabase.from('table').update(data);
  // Data is stale!
};
```

✅ **Correct:**
```typescript
const updateData = async () => {
  await supabase.from('table').update(data);
  queryClient.invalidateQueries({ queryKey: ['table'] });
};
```

### 3. Not handling real-time subscription cleanup

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
  return () => subscription.unsubscribe();
}, []);
```

---

**Next:** See [STUDENT_COMPONENTS_GUIDE.md](./STUDENT_COMPONENTS_GUIDE.md) for UI components documentation

**Last Updated:** 2025-10-29
**Hooks:** 7 (1 context + 6 custom hooks)

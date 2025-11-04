# ScheduleScreen.tsx - Comprehensive Analysis

**Analysis Date:** 2025-10-28
**File:** `src/screens/student/ScheduleScreen.tsx`
**Lines of Code:** 2141
**Phase:** 43.1 - Enhanced Schedule Integration System
**Complexity:** ⭐⭐⭐⭐⭐⭐⭐⭐ (Very High - Calendar integration with multiple views)

---

## Executive Summary

**ScheduleScreen.tsx** is a Phase 43.1 enhanced schedule screen providing comprehensive calendar integration with device calendar sync, assignment deadline tracking, and Material Design 3 calendar views. This is a feature-rich screen (2141 lines) with real Supabase integration for classes and assignments, multiple view modes (week/day/month), timezone support, and calendar settings.

### Critical Issues Found:
1. ❌ **Zero analytics tracking**
2. ❌ **Zero accessibility support**
3. ⚠️ **HIGH:** Hardcoded LightTheme (no dark mode support)
4. ⚠️ **HIGH:** Device calendar sync not fully implemented (placeholder alerts)
5. ⚠️ **HIGH:** Calendar settings not persisted to AsyncStorage
6. ⚠️ **MEDIUM:** 2141 lines - needs modularization
7. ⚠️ **MEDIUM:** Month view not loading data from correct date range

### Strengths:
- ✅ **EXCELLENT:** Real Supabase integration for classes and assignments
- ✅ **EXCELLENT:** Pull-to-refresh implementation
- ✅ **EXCELLENT:** Error handling with retry mechanism
- ✅ **EXCELLENT:** Loading and error states with proper UI
- ✅ **EXCELLENT:** Hardware back button handling
- ✅ **EXCELLENT:** Multiple view modes (week, day, month)
- ✅ **EXCELLENT:** Assignment deadline integration in schedule
- ✅ **EXCELLENT:** Priority-based color coding for deadlines
- ✅ **EXCELLENT:** Week navigation with data reload
- ✅ Comprehensive Phase 43.1 features (calendar sync, settings, reminders)

---

## A. Imports Analysis

### Core React Native (26 imports)
```typescript
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Alert, Dimensions, FlatList,
  Modal, Switch, Platform, BackHandler, RefreshControl,
} from 'react-native';
```
- ✅ Comprehensive React Native component usage
- ✅ BackHandler for hardware back button
- ✅ Platform for OS-specific logic
- ✅ RefreshControl for pull-to-refresh

### UI Library (react-native-paper)
```typescript
import { Appbar, Portal, Snackbar, ActivityIndicator } from 'react-native-paper';
```
- ✅ Material Design components

### Design System
```typescript
import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { BorderRadius } from '../../theme/spacing';
```
- ✅ Design tokens usage
- ❌ Hardcoded LightTheme instead of ThemeContext

### Services
```typescript
import { getClassesByDateRange } from '../../services/classesService';
import { getStudentAssignments } from '../../services/assignmentsService';
import { useAuth } from '../../context/AuthContext';
```
- ✅ Real Supabase service integration
- ✅ Auth context for user ID

### Missing Critical Imports
```typescript
// ❌ MISSING: import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
// ❌ MISSING: import { useTheme } from '../../contexts/ThemeContext';
// ❌ MISSING: import AsyncStorage from '@react-native-async-storage/async-storage';
// ❌ MISSING: import * as Calendar from 'expo-calendar'; // For device calendar sync
```

---

## B. TypeScript Interfaces & Types

### 1. ScheduleScreenProps Interface (Line 47-50)
```typescript
interface ScheduleScreenProps {
  studentName?: string;
  onNavigate: (screen: string) => void;
}
```
- ✅ Props interface defined
- ⚠️ Missing navigation and route props

### 2. ClassSchedule Interface (Line 53-73)
```typescript
interface ClassSchedule {
  id: string;
  subject: string;
  teacher: string;
  time: string;
  duration: string;
  room: string;
  type: 'live' | 'recorded' | 'assignment';
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  color: string;
  // Phase 43.1 enhancements
  startDateTime: Date;
  endDateTime: Date;
  description?: string;
  location?: string;
  reminder: boolean;
  reminderTime: number; // minutes before
  isDeadline: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}
```
- ✅ **EXCELLENT:** Comprehensive class model with Phase 43.1 enhancements
- ✅ Union types for type, status, priority
- ✅ Date handling with startDateTime/endDateTime
- ✅ Deadline support with isDeadline flag
- ✅ Reminder configuration

### 3. Assignment Interface (Line 75-85)
```typescript
interface Assignment {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'submitted' | 'overdue';
  description: string;
  attachments?: string[];
}
```
- ✅ Clean assignment model
- ✅ Status and priority tracking
- ✅ Optional attachments

### 4. CalendarSettings Interface (Line 87-94)
```typescript
interface CalendarSettings {
  syncWithDeviceCalendar: boolean;
  showDeadlines: boolean;
  defaultReminderTime: number;
  timezone: string;
  showWeekends: boolean;
  calendarView: 'week' | 'month' | 'agenda';
}
```
- ✅ **EXCELLENT:** Comprehensive settings model
- ✅ Timezone support
- ✅ Configurable reminder time

### 5. DaySchedule Interface (Line 96-101)
```typescript
interface DaySchedule {
  date: string;
  dayName: string;
  isToday: boolean;
  classes: ClassSchedule[];
}
```
- ✅ Day aggregation model
- ✅ Today indicator

---

## C. Component State Analysis

### State Variables (17 total)

#### Core Schedule State
```typescript
const [isLoading, setIsLoading] = useState(true);
const [currentWeek, setCurrentWeek] = useState<DaySchedule[]>([]);
const [selectedDate, setSelectedDate] = useState<string>('');
const [viewMode, setViewMode] = useState<'week' | 'day' | 'month'>('week');
```
- ✅ Proper initial states
- ✅ Typed state variables

#### Phase 43.1 Enhanced State
```typescript
const [assignments, setAssignments] = useState<Assignment[]>([]);
const [showCalendarModal, setShowCalendarModal] = useState(false);
const [showSettingsModal, setShowSettingsModal] = useState(false);
const [calendarSettings, setCalendarSettings] = useState<CalendarSettings>({ ... });
const [currentMonth, setCurrentMonth] = useState(new Date());
const [showDeadlineFilter, setShowDeadlineFilter] = useState(false);
const [snackbarVisible, setSnackbarVisible] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
```
- ✅ Modal state management
- ✅ Settings state with defaults
- ✅ Month navigation state
- ✅ Snackbar notifications

#### Supabase Enhancement State
```typescript
const [refreshing, setRefreshing] = useState(false);
const [error, setError] = useState<string | null>(null);
```
- ✅ Pull-to-refresh state
- ✅ Error state management

#### Auth Context
```typescript
const { user } = useAuth();
```
- ✅ User ID for queries

---

## D. Data Fetching & Services

### Real Supabase Integration ✅

#### 1. Load Schedule Data (Line 217-355)
```typescript
const loadScheduleData = async () => {
  try {
    const userId = user?.id;
    if (!userId) {
      console.log('No user ID available');
      return;
    }

    // Get current week range
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Fetch classes from Supabase for the week
    const result = await getClassesByDateRange(
      userId,
      'student',
      weekStart,
      weekEnd
    );

    const weekData: DaySchedule[] = [];

    // Create schedule for each day of the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);

      const dateStr = date.toISOString().split('T')[0];
      const isToday = dateStr === new Date().toISOString().split('T')[0];

      // Filter classes for this specific day
      const dayClasses: ClassSchedule[] = [];

      if (result.success && result.data) {
        const classesForDay = result.data.filter(cls => {
          const classDate = new Date(cls.scheduled_at).toISOString().split('T')[0];
          return classDate === dateStr;
        });

        // Transform Supabase classes to UI format
        classesForDay.forEach(cls => {
          const scheduledTime = new Date(cls.scheduled_at);
          const endTime = new Date(scheduledTime.getTime() + (cls.duration_minutes || 60) * 60000);
          const now = new Date();

          let status: 'upcoming' | 'live' | 'completed' | 'cancelled' = 'upcoming';
          if (cls.status === 'cancelled') {
            status = 'cancelled';
          } else if (now >= scheduledTime && now <= endTime) {
            status = 'live';
          } else if (now > endTime) {
            status = 'completed';
          }

          const subjectColors: Record<string, string> = {
            'Mathematics': '#6366F1',
            'Physics': '#10B981',
            'Chemistry': '#F59E0B',
            'Biology': '#EF4444',
            'English': '#8B5CF6',
            'History': '#F97316',
          };

          dayClasses.push({
            id: cls.id,
            subject: cls.subject,
            teacher: cls.teacher_id,
            time: scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            duration: `${cls.duration_minutes || 60} min`,
            room: cls.meeting_link || 'Virtual Room',
            type: 'live',
            status,
            color: subjectColors[cls.subject] || '#6366F1',
            startDateTime: scheduledTime,
            endDateTime: endTime,
            description: cls.description || '',
            location: cls.meeting_link || 'Virtual Room',
            reminder: true,
            reminderTime: 15,
            isDeadline: false,
            priority: 'high',
            tags: [cls.subject.toLowerCase(), 'class'],
          });
        });
      }

      // Add any assignment deadlines for this day
      const assignmentDeadlines = assignments
        .filter(assignment => {
          const assignmentDate = new Date(assignment.dueDate).toISOString().split('T')[0];
          return assignmentDate === dateStr;
        })
        .map(assignment => ({
          id: `deadline-${assignment.id}`,
          subject: assignment.title,
          teacher: assignment.teacher,
          time: '11:59 PM',
          duration: '0 min',
          room: 'Online',
          type: 'assignment' as const,
          status: 'upcoming' as const,
          color: assignment.priority === 'high' ? '#EF4444' : assignment.priority === 'medium' ? '#F59E0B' : '#10B981',
          startDateTime: new Date(assignment.dueDate),
          endDateTime: new Date(assignment.dueDate),
          description: assignment.description || '',
          location: 'Online Submission',
          reminder: true,
          reminderTime: 60,
          isDeadline: true,
          priority: assignment.priority,
          tags: ['deadline', assignment.subject.toLowerCase()],
        }));

      dayClasses.push(...assignmentDeadlines);

      const daySchedule: DaySchedule = {
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        isToday,
        classes: dayClasses.sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime()),
      };

      weekData.push(daySchedule);
    }

    setCurrentWeek(weekData);
    console.log('✅ Schedule data loaded from Supabase');
  } catch (error) {
    console.error('Error loading schedule:', error);
    showSnackbar('Failed to load schedule');
    throw error;
  }
};
```
- ✅ **EXCELLENT:** Real Supabase data fetching
- ✅ Week date range calculation
- ✅ Status calculation (live, completed, upcoming, cancelled)
- ✅ Subject color mapping
- ✅ Assignment deadline integration
- ✅ Sorting by start time
- ✅ Error handling with snackbar

#### 2. Load Assignments (Line 358-414)
```typescript
const loadAssignments = async () => {
  try {
    const userId = user?.id;
    if (!userId) {
      console.log('No user ID for assignments');
      return;
    }

    // Fetch real assignments from Supabase
    const result = await getStudentAssignments(userId);

    if (result.success && result.data) {
      // Transform Supabase assignments to UI format
      const transformedAssignments: Assignment[] = result.data.map(assignment => {
        let status: 'pending' | 'submitted' | 'overdue' = 'pending';
        let priority: 'low' | 'medium' | 'high' = 'medium';

        // Determine status based on submission
        if (assignment.submission) {
          status = assignment.submission.status === 'submitted' ? 'submitted' : 'pending';
        } else {
          // Check if overdue
          const dueDate = new Date(assignment.due_date);
          if (dueDate < new Date()) {
            status = 'overdue';
          }
        }

        // Determine priority based on due date proximity
        const daysUntilDue = Math.ceil((new Date(assignment.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilDue <= 2) {
          priority = 'high';
        } else if (daysUntilDue <= 5) {
          priority = 'medium';
        } else {
          priority = 'low';
        }

        return {
          id: assignment.id,
          title: assignment.title,
          subject: assignment.subject,
          teacher: assignment.teacher_id,
          dueDate: new Date(assignment.due_date),
          priority,
          status,
          description: assignment.description || '',
        };
      });

      setAssignments(transformedAssignments);
      console.log('✅ Assignments loaded from Supabase');
    }
  } catch (error) {
    console.error('Error loading assignments:', error);
  }
};
```
- ✅ **EXCELLENT:** Real assignment data from Supabase
- ✅ Status determination (pending/submitted/overdue)
- ✅ Automatic priority calculation based on due date proximity
- ✅ Submission status checking

#### 3. Load Schedule for Specific Week (Line 744-847)
```typescript
const loadScheduleDataForWeek = async (startDate: Date) => {
  try {
    const userId = user?.id;
    if (!userId) {
      console.log('No user ID available for week data');
      return;
    }

    const weekStart = new Date(startDate);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Fetch classes from Supabase for the specific week
    const result = await getClassesByDateRange(
      userId,
      'student',
      weekStart,
      weekEnd
    );

    // ... (similar transformation logic)

    setCurrentWeek(weekData);
  } catch (error) {
    console.error('Error loading schedule for week:', error);
    showSnackbar('Failed to load week data');
  }
};
```
- ✅ Week-specific data loading for navigation
- ✅ Same transformation logic as main load

#### 4. Pull-to-Refresh (Line 169-184)
```typescript
const onRefresh = useCallback(async () => {
  setRefreshing(true);
  setError(null);

  try {
    await loadAssignments();
    await loadScheduleData();
  } catch (error) {
    console.error('Error refreshing schedule:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to refresh schedule';
    setError(errorMessage);
    showSnackbar('Failed to refresh schedule');
  } finally {
    setRefreshing(false);
  }
}, []);
```
- ✅ **EXCELLENT:** Pull-to-refresh implementation
- ✅ Reloads assignments and schedule
- ✅ Error handling

### Phase 43.1 Features (Placeholder Implementations)

#### Load Calendar Settings (Line 417-425)
```typescript
const loadCalendarSettings = async () => {
  try {
    // In real app, load from AsyncStorage
    // const settings = await AsyncStorage.getItem('calendarSettings');
    // if (settings) setCalendarSettings(JSON.parse(settings));
  } catch (error) {
    console.error('Error loading calendar settings:', error);
  }
};
```
- ⚠️ **TODO:** Implement AsyncStorage persistence

#### Device Calendar Sync (Line 428-441)
```typescript
const syncWithDeviceCalendar = async () => {
  try {
    if (Platform.OS === 'ios') {
      // iOS EventKit integration would go here
      Alert.alert('Calendar Sync', 'Device calendar sync is enabled. Events will be synchronized.');
    } else {
      // Android Calendar Provider integration would go here
      Alert.alert('Calendar Sync', 'Device calendar sync is enabled. Events will be synchronized.');
    }
  } catch (error) {
    console.error('Error syncing with device calendar:', error);
    Alert.alert('Sync Error', 'Failed to sync with device calendar.');
  }
};
```
- ⚠️ **TODO:** Implement actual calendar sync (EventKit/Calendar Provider)

---

## E. Component Lifecycle

### useEffect - Initialize on Mount (Line 134-139)
```typescript
useEffect(() => {
  initializeScreen();
  setupBackHandler();

  return cleanup;
}, []);
```
- ✅ Initialization and back handler setup
- ✅ Cleanup return

### useEffect - Calendar Sync (Line 141-146)
```typescript
useEffect(() => {
  // Phase 43.1: Sync with device calendar if enabled
  if (calendarSettings.syncWithDeviceCalendar) {
    syncWithDeviceCalendar();
  }
}, [calendarSettings.syncWithDeviceCalendar]);
```
- ✅ Triggers sync when setting changes

### initializeScreen (Line 149-166)
```typescript
const initializeScreen = useCallback(async () => {
  setIsLoading(true);
  setError(null);

  try {
    await loadAssignments(); // Load assignments FIRST
    await loadScheduleData(); // Then load schedule (which uses assignments)
    setSelectedDate(new Date().toISOString().split('T')[0]);
    await loadCalendarSettings();
  } catch (error) {
    console.error('Error initializing screen:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load schedule data';
    setError(errorMessage);
    showSnackbar('Failed to initialize schedule');
  } finally {
    setIsLoading(false);
  }
}, []);
```
- ✅ **EXCELLENT:** Loads assignments first (needed for schedule deadlines)
- ✅ Proper error handling with user-friendly messages
- ✅ Finally block ensures loading state is cleared

### setupBackHandler (Line 187-204)
```typescript
const setupBackHandler = useCallback(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    if (showCalendarModal || showSettingsModal) {
      setShowCalendarModal(false);
      setShowSettingsModal(false);
      return true;
    }

    if (onNavigate) {
      onNavigate('back');
      return true;
    }

    return false;
  });

  return () => backHandler.remove();
}, [showCalendarModal, showSettingsModal, onNavigate]);
```
- ✅ **EXCELLENT:** Modal-aware back button handling
- ✅ Closes modals before navigating back
- ✅ Proper cleanup function returned

---

## F. Event Handlers & Interactions

### 1. Class Item Press (Line 677-712)
```typescript
const handleClassPress = (classItem: ClassSchedule) => {
  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  Alert.alert(
    classItem.subject,
    `Teacher: ${classItem.teacher}\nTime: ${formatDateTime(classItem.startDateTime)}\nLocation: ${classItem.location}\nDescription: ${classItem.description}\n\nPriority: ${classItem.priority.toUpperCase()}\nTags: ${classItem.tags.join(', ')}`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Export to Calendar',
        onPress: () => handleExportToCalendar(classItem)
      },
      {
        text: 'View Details',
        onPress: () => onNavigate('class-detail')
      },
      ...(classItem.status === 'live' ? [{
        text: 'Join Class',
        onPress: () => onNavigate('live-class')
      }] : []),
      ...(classItem.isDeadline ? [{
        text: 'Submit Assignment',
        onPress: () => onNavigate('submit-doubt')
      }] : []),
    ]
  );
};
```
- ✅ Formatted date/time display
- ✅ Contextual action buttons (Join if live, Submit if deadline)
- ✅ Export to calendar option
- ❌ No analytics tracking

### 2. Week Navigation (Line 715-741)
```typescript
const handlePreviousWeek = async () => {
  if (currentWeek.length === 0) {
    showSnackbar('No schedule data available');
    return;
  }

  const newDate = new Date(currentWeek[0].date);
  newDate.setDate(newDate.getDate() - 7);

  // Update current date range and reload data
  await loadScheduleDataForWeek(newDate);
  setSelectedDate(newDate.toISOString().split('T')[0]);
};

const handleNextWeek = async () => {
  if (currentWeek.length === 0) {
    showSnackbar('No schedule data available');
    return;
  }

  const newDate = new Date(currentWeek[0].date);
  newDate.setDate(newDate.getDate() + 7);

  // Update current date range and reload data
  await loadScheduleDataForWeek(newDate);
  setSelectedDate(newDate.toISOString().split('T')[0]);
};
```
- ✅ **EXCELLENT:** Reloads data for new week from Supabase
- ✅ Updates selected date
- ✅ Validation check

### 3. Export to Calendar (Line 855-888)
```typescript
const handleExportToCalendar = async (classItem: ClassSchedule) => {
  try {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Export to Calendar',
        `Export "${classItem.subject}" to device calendar?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Export',
            onPress: () => Alert.alert('success', 'Event exported to calendar')
          }
        ]
      );
    } else {
      Alert.alert(
        'Export to Calendar',
        `Export "${classItem.subject}" to device calendar?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Export',
            onPress: () => Alert.alert('success', 'Event exported to calendar')
          }
        ]
      );
    }
  } catch (error) {
    console.error('Error exporting to calendar:', error);
    Alert.alert('Export Error', 'Failed to export event to calendar.');
  }
};
```
- ⚠️ Placeholder implementation with alert
- ❌ No actual calendar API integration

### 4. Deadline Filter Toggle (Line 850-852)
```typescript
const handleToggleDeadlineFilter = () => {
  setShowDeadlineFilter(!showDeadlineFilter);
};
```
- ✅ Simple toggle
- ⚠️ Filter logic not implemented in rendering

### Missing Analytics
```typescript
// ❌ MISSING: Track all interactions
const handleClassPress = (classItem: ClassSchedule) => {
  trackAction('view_class_detail', 'ScheduleScreen', {
    classId: classItem.id,
    subject: classItem.subject,
    isDeadline: classItem.isDeadline
  });
  // Show alert...
};

const handleViewModeChange = (mode: 'week' | 'day' | 'month') => {
  trackAction('change_view_mode', 'ScheduleScreen', { mode });
  setViewMode(mode);
};

const handleWeekNavigationimize = (direction: 'previous' | 'next') => {
  trackAction('navigate_week', 'ScheduleScreen', { direction });
  // Navigation logic...
};
```

---

## G. Navigation Patterns

### Current Navigation
```typescript
// onNavigate callback prop
onNavigate('class-detail')
onNavigate('live-class')
onNavigate('submit-doubt')
onNavigate('back')
```
- ⚠️ Using callback prop instead of navigation object
- ❌ Not using safeNavigate

### App Bar Actions (Line 1110-1131)
```typescript
<Appbar.BackAction
  color={LightTheme.OnPrimary}
  onPress={() => onNavigate('back')}
/>

<Appbar.Action
  icon="calendar-today"
  color={LightTheme.OnPrimary}
  onPress={() => setSelectedDate(new Date().toISOString().split('T')[0])}
/>

<Appbar.Action
  icon="tune"
  color={LightTheme.OnPrimary}
  onPress={() => setShowSettingsModal(true)}
/>
```
- ✅ Back button
- ✅ Jump to today
- ✅ Open settings

---

## H. UI Sections Breakdown

### Section 1: App Bar (Line 1108-1132)
```typescript
<Appbar.Header elevated style={{ backgroundColor: LightTheme.Primary }}>
  <Appbar.BackAction color={LightTheme.OnPrimary} onPress={() => onNavigate('back')} />
  <Appbar.Content title="My Schedule" titleStyle={{ color: LightTheme.OnPrimary }} />
  <Appbar.Action icon="calendar-today" color={LightTheme.OnPrimary} onPress={() => setSelectedDate(...)} />
  <Appbar.Action icon="tune" color={LightTheme.OnPrimary} onPress={() => setShowSettingsModal(true)} />
</Appbar.Header>
```
- ✅ Title, back button, today button, settings button
- ❌ No accessibilityLabel

### Section 2: View Mode Toggle (Line 1354-1379)
```typescript
<View style={styles.viewModeToggle}>
  <TouchableOpacity
    style={[styles.viewModeButton, viewMode === 'week' && styles.activeViewMode]}
    onPress={() => setViewMode('week')}
  >
    <Text style={[styles.viewModeText, viewMode === 'week' && styles.activeViewModeText]}>
      Week
    </Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.viewModeButton, viewMode === 'day' && styles.activeViewMode]}
    onPress={() => setViewMode('day')}
  >
    <Text style={[styles.viewModeText, viewMode === 'day' && styles.activeViewModeText]}>
      Day
    </Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.viewModeButton, viewMode === 'month' && styles.activeViewMode]}
    onPress={() => setViewMode('month')}
  >
    <Text style={[styles.viewModeText, viewMode === 'month' && styles.activeViewModeText]}>
      Month
    </Text>
  </TouchableOpacity>
</View>
```
- ✅ 3 view mode buttons with active state
- ✅ Clean UI
- ❌ No accessibilityRole/accessibilityState

### Section 3: Enhanced Controls (Line 1382-1398)
```typescript
<View style={styles.enhancedControls}>
  <TouchableOpacity
    style={styles.controlButton}
    onPress={handleToggleDeadlineFilter}
  >
    <Text style={styles.controlButtonText}>
      {showDeadlineFilter ? '📅 All Events' : '⏰ Deadlines Only'}
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.controlButton}
    onPress={() => setShowSettingsModal(true)}
  >
    <Text style={styles.controlButtonText}>⚙️ Settings</Text>
  </TouchableOpacity>
</View>
```
- ✅ Deadline filter toggle
- ✅ Settings shortcut
- ⚠️ Filter not actually applied in rendering logic

### Section 4: Week Navigation (Line 1401-1421)
```typescript
<View style={styles.weekNavigation}>
  <TouchableOpacity style={styles.navButton} onPress={handlePreviousWeek}>
    <Text style={styles.navButtonText}>← Previous</Text>
  </TouchableOpacity>

  <Text style={styles.weekTitle}>
    {currentWeek.length >= 7 && (
      `${new Date(currentWeek[0].date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })} - ${new Date(currentWeek[6].date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })}`
    )}
  </Text>

  <TouchableOpacity style={styles.navButton} onPress={handleNextWeek}>
    <Text style={styles.navButtonText}>Next →</Text>
  </TouchableOpacity>
</View>
```
- ✅ Previous/Next week navigation
- ✅ Week date range display
- ✅ Loads new data on navigation

### Section 5: Week View (Line 951-1016)
```typescript
const renderWeekView = () => (
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.weekContainer}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={[LightTheme.Primary]}
      />
    }
  >
    {currentWeek.map((day) => (
      <View key={day.date} style={styles.dayCard}>
        <View style={[styles.dayHeader, day.isToday && styles.todayHeader]}>
          <Text style={[styles.dayName, day.isToday && styles.todayText]}>
            {day.dayName}
          </Text>
          <Text style={[styles.dayDate, day.isToday && styles.todayText]}>
            {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        </View>

        <View style={styles.dayClasses}>
          {day.classes.length > 0 ? (
            day.classes.map((classItem) => (
              <TouchableOpacity
                key={classItem.id}
                style={[styles.classCard, { borderLeftColor: classItem.color }]}
                onPress={() => handleClassPress(classItem)}
              >
                <View style={styles.classHeader}>
                  <Text style={styles.classSubject}>{classItem.subject}</Text>
                  <View style={styles.classStatus}>
                    <Text style={styles.typeIcon}>{getTypeIcon(classItem.type, classItem.isDeadline)}</Text>
                    {classItem.isDeadline && (
                      <Text style={styles.priorityIndicator}>{getPriorityIndicator(classItem.priority)}</Text>
                    )}
                    <Text style={[styles.statusText, { color: getStatusColor(classItem.status, classItem.isDeadline, classItem.priority) }]}>
                      {classItem.isDeadline ? 'DEADLINE' : classItem.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.classTeacher}>{classItem.teacher}</Text>
                <View style={styles.classDetails}>
                  <Text style={styles.classTime}>🕐 {classItem.time}</Text>
                  <Text style={styles.classDuration}>⏱️ {classItem.duration}</Text>
                  <Text style={styles.classRoom}>📍 {classItem.location || classItem.room}</Text>
                  {classItem.isDeadline && (
                    <Text style={[styles.deadlineIndicator, { color: getStatusColor(classItem.status, true, classItem.priority) }]}>
                      ⚠️ Priority: {classItem.priority.toUpperCase()}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noClassesContainer}>
              <Text style={styles.noClassesText}>No classes scheduled</Text>
            </View>
          )}
        </View>
      </View>
    ))}
  </ScrollView>
);
```
- ✅ **EXCELLENT:** Pull-to-refresh
- ✅ Day cards for all 7 days
- ✅ Today highlighting
- ✅ Class cards with color-coded border
- ✅ Type icon (live/recorded/deadline)
- ✅ Priority indicator for deadlines
- ✅ Status badge with color
- ✅ Class details (time, duration, location)
- ✅ Empty state for no classes
- ⚠️ Using .map() instead of FlatList (7 days is acceptable)

### Section 6: Day View (Line 1018-1105)
```typescript
const renderDayView = () => {
  const selectedDay = currentWeek.find(day => day.date === selectedDate) || currentWeek[0];

  // Handle case when there's no data
  if (!selectedDay) {
    return (
      <ScrollView refreshControl={<RefreshControl ... />}>
        <View style={styles.dayViewNoClasses}>
          <Text style={styles.dayViewNoClassesText}>No schedule data available</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView refreshControl={<RefreshControl ... />}>
      <View style={styles.dayViewHeader}>
        <Text style={styles.dayViewTitle}>
          {selectedDay.dayName}, {new Date(selectedDay.date).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.dayViewClasses}>
        {selectedDay.classes.length > 0 ? (
          selectedDay.classes.map((classItem) => (
            <TouchableOpacity
              key={classItem.id}
              style={[styles.dayViewClassCard, { backgroundColor: classItem.color + '10' }]}
              onPress={() => handleClassPress(classItem)}
            >
              <View style={[styles.classTimeIndicator, { backgroundColor: classItem.color }]} />
              <View style={styles.dayViewClassContent}>
                <View style={styles.dayViewClassHeader}>
                  <Text style={styles.dayViewClassSubject}>{classItem.subject}</Text>
                  <View style={styles.dayViewClassStatus}>
                    <Text style={styles.typeIcon}>{getTypeIcon(classItem.type, classItem.isDeadline)}</Text>
                    {classItem.isDeadline && (
                      <Text style={styles.priorityIndicator}>{getPriorityIndicator(classItem.priority)}</Text>
                    )}
                    <Text style={[styles.statusText, { color: getStatusColor(...) }]}>
                      {classItem.isDeadline ? 'DEADLINE' : classItem.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.dayViewClassTeacher}>{classItem.teacher}</Text>
                <View style={styles.dayViewClassDetails}>
                  <Text style={styles.dayViewClassTime}>
                    {classItem.time} • {classItem.duration}
                  </Text>
                  <Text style={styles.dayViewClassRoom}>{classItem.location || classItem.room}</Text>
                  {classItem.isDeadline && (
                    <Text style={[styles.dayViewDeadlineInfo, { color: getStatusColor(...) }]}>
                      📌 {classItem.description}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.dayViewNoClasses}>
            <Text style={styles.dayViewNoClassesText}>No classes scheduled for this day</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
```
- ✅ **EXCELLENT:** Pull-to-refresh
- ✅ Selected day title with date
- ✅ Large class cards with color-coded indicator bar
- ✅ Deadline description display
- ✅ Empty state handling
- ✅ Fallback when no data

### Section 7: Month View (Line 1446-1537)
```typescript
const renderMonthView = () => {
  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());

  const days = [];
  const currentDate = new Date(startDate);

  while (currentDate <= monthEnd || currentDate.getDay() !== 0) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return (
    <ScrollView refreshControl={<RefreshControl ... />}>
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={() => setCurrentMonth(new Date(..., ..., currentMonth.getMonth() - 1))}>
          <Text style={styles.monthNavButton}>← Previous</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={() => setCurrentMonth(new Date(..., ..., currentMonth.getMonth() + 1))}>
          <Text style={styles.monthNavButton}>Next →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekDaysHeader}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Text key={day} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>

      <View style={styles.monthGrid}>
        {days.map((day, index) => {
          const dateStr = day.toISOString().split('T')[0];
          const daySchedule = currentWeek.find(d => d.date === dateStr);
          const dayClasses = daySchedule?.classes || [];

          const isToday = day.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const hasEvents = dayClasses.length > 0;
          const hasDeadlines = dayClasses.some(c => c.isDeadline);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.monthDay,
                isToday && styles.monthDayToday,
                !isCurrentMonth && styles.monthDayOther,
                hasEvents && styles.monthDayHasEvents
              ]}
              onPress={() => {
                setSelectedDate(day.toISOString().split('T')[0]);
                setViewMode('day');
              }}
            >
              <Text style={[
                styles.monthDayText,
                isToday && styles.monthDayTodayText,
                !isCurrentMonth && styles.monthDayOtherText
              ]}>
                {day.getDate()}
              </Text>
              {hasEvents && (
                <View style={styles.monthDayEvents}>
                  {hasDeadlines && <View style={[styles.eventDot, { backgroundColor: '#EF4444' }]} />}
                  {dayClasses.filter(c => !c.isDeadline).length > 0 && (
                    <View style={[styles.eventDot, { backgroundColor: LightTheme.Primary }]} />
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};
```
- ✅ **EXCELLENT:** Calendar grid layout
- ✅ Month navigation
- ✅ Week day headers
- ✅ Today highlighting
- ✅ Current month vs other month styling
- ✅ Event dots (red for deadlines, blue for classes)
- ✅ Tap day to switch to day view
- ⚠️ **ISSUE:** Only shows events from currentWeek data (doesn't load full month data)

### Section 8: Calendar Settings Modal (Line 1135-1217)
```typescript
<Modal visible={showSettingsModal} animationType="slide" transparent={true}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Calendar Settings</Text>
        <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
          <Text style={styles.modalCloseButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalBody}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Sync with Device Calendar</Text>
          <Switch
            value={calendarSettings.syncWithDeviceCalendar}
            onValueChange={(value) => setCalendarSettings(prev => ({ ...prev, syncWithDeviceCalendar: value }))}
            ...
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Show Assignment Deadlines</Text>
          <Switch value={calendarSettings.showDeadlines} ... />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Show Weekends</Text>
          <Switch value={calendarSettings.showWeekends} ... />
        </View>

        <View style={styles.settingSection}>
          <Text style={styles.settingSectionTitle}>Default Reminder Time</Text>
          {[5, 10, 15, 30, 60].map(minutes => (
            <TouchableOpacity
              key={minutes}
              style={[
                styles.reminderOption,
                calendarSettings.defaultReminderTime === minutes && styles.reminderOptionSelected
              ]}
              onPress={() => setCalendarSettings(prev => ({ ...prev, defaultReminderTime: minutes }))}
            >
              <Text ...>{minutes} minutes before</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.saveSettingsButton}
          onPress={() => {
            // In real app, save to AsyncStorage
            Alert.alert('Settings Saved', 'Your calendar preferences have been updated.');
            setShowSettingsModal(false);
          }}
        >
          <Text style={styles.saveSettingsButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  </View>
</Modal>
```
- ✅ 3 switch settings
- ✅ 5 reminder time options with selection state
- ✅ Save button
- ⚠️ Settings not persisted to AsyncStorage

### Section 9: Assignment Modal (Line 1220-1275)
```typescript
<Modal visible={showCalendarModal} animationType="slide" transparent={true}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Upcoming Assignments</Text>
        <TouchableOpacity onPress={() => setShowCalendarModal(false)}>
          <Text style={styles.modalCloseButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalBody}>
        {assignments.map(assignment => (
          <View key={assignment.id} style={styles.assignmentCard}>
            <View style={styles.assignmentHeader}>
              <Text style={styles.assignmentTitle}>{assignment.title}</Text>
              <View style={[
                styles.assignmentPriority,
                { backgroundColor: assignment.priority === 'high' ? '#EF4444' : assignment.priority === 'medium' ? '#F59E0B' : '#10B981' }
              ]}>
                <Text style={styles.assignmentPriorityText}>{assignment.priority.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.assignmentSubject}>{assignment.subject} • {assignment.teacher}</Text>
            <Text style={styles.assignmentDescription}>{assignment.description}</Text>
            <Text style={styles.assignmentDueDate}>
              Due: {assignment.dueDate.toLocaleDateString(...)}
            </Text>
            <TouchableOpacity
              style={styles.assignmentActionButton}
              onPress={() => {
                setShowCalendarModal(false);
                onNavigate('submit-doubt');
              }}
            >
              <Text style={styles.assignmentActionButtonText}>Work on Assignment</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  </View>
</Modal>
```
- ✅ Lists all assignments
- ✅ Priority badge with color
- ✅ Due date formatted
- ✅ Work on assignment button

### Section 10: Loading State (Line 1278-1300)
```typescript
if (isLoading && !refreshing) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
      <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
      {renderAppBar()}

      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
      }}>
        <ActivityIndicator size="large" color={LightTheme.Primary} />
        <Text style={{
          fontSize: 16,
          color: LightTheme.OnSurfaceVariant,
        }}>
          Loading schedule...
        </Text>
      </View>
    </SafeAreaView>
  );
}
```
- ✅ ActivityIndicator
- ✅ Loading message
- ✅ Shows app bar

### Section 11: Error State (Line 1303-1346)
```typescript
if (error && !refreshing && !isLoading) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
      <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
      {renderAppBar()}

      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        gap: 16,
      }}>
        <Text style={{ fontSize: 64 }}>⚠️</Text>
        <Text style={{
          fontSize: 18,
          color: LightTheme.Error,
          textAlign: 'center',
          fontWeight: '600',
        }}>
          {error}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: LightTheme.Primary,
            paddingHorizontal: 32,
            paddingVertical: 12,
            borderRadius: 8,
            marginTop: 8,
          }}
          onPress={initializeScreen}
        >
          <Text style={{
            color: LightTheme.OnPrimary,
            fontSize: 16,
            fontWeight: '600',
          }}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
```
- ✅ **EXCELLENT:** Error message display
- ✅ Retry button
- ✅ Shows app bar

---

## I. Styling Approach

### StyleSheet Usage
```typescript
const styles = StyleSheet.create({
  // 100+ styles defined
});
```
- ✅ **EXCELLENT:** Using StyleSheet.create (not inline styles)
- ✅ Comprehensive styles (100+ definitions)

### Theme Usage
```typescript
import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { BorderRadius } from '../../theme/spacing';
```
- ✅ Uses design tokens extensively
- ❌ Hardcoded LightTheme instead of ThemeContext

### Color Coding
```typescript
const subjectColors: Record<string, string> = {
  'Mathematics': '#6366F1',
  'Physics': '#10B981',
  'Chemistry': '#F59E0B',
  'Biology': '#EF4444',
  'English': '#8B5CF6',
  'History': '#F97316',
};
```
- ✅ Subject-based color mapping
- ✅ Priority-based colors (high=red, medium=amber, low=green)

---

## J. Helper Functions

### 1. getStatusColor (Line 891-917)
```typescript
const getStatusColor = (status: string, isDeadline: boolean = false, priority?: string) => {
  if (isDeadline) {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6366F1';
    }
  }

  switch (status) {
    case 'live': return '#EF4444';
    case 'upcoming': return '#10B981';
    case 'completed': return '#6B7280';
    case 'cancelled': return '#F97316';
    default: return LightTheme.OnSurfaceVariant;
  }
};
```
- ✅ Deadline-aware color logic
- ✅ Priority-based colors for deadlines
- ✅ Status-based colors for classes

### 2. getTypeIcon (Line 920-935)
```typescript
const getTypeIcon = (type: string, isDeadline: boolean = false) => {
  if (isDeadline) {
    return '⏰';
  }

  switch (type) {
    case 'live': return '🔴';
    case 'recorded': return '📹';
    case 'assignment': return '📝';
    default: return '📚';
  }
};
```
- ✅ Deadline indicator
- ✅ Type-based icons

### 3. getPriorityIndicator (Line 938-949)
```typescript
const getPriorityIndicator = (priority: string) => {
  switch (priority) {
    case 'high': return '🔴';
    case 'medium': return '🟡';
    case 'low': return '🟢';
    default: return '';
  }
};
```
- ✅ Visual priority indicators

### 4. showSnackbar (Line 212-215)
```typescript
const showSnackbar = useCallback((message: string) => {
  setSnackbarMessage(message);
  setSnackbarVisible(true);
}, []);
```
- ✅ Simple notification helper

---

## K. Performance Considerations

### Optimization Opportunities

1. **Week View - Using .map()**
   - ⚠️ Using .map() for week days (7 items)
   - ✅ Acceptable for small fixed list
   - ⚠️ Nested .map() for classes inside days

2. **Month View - No Data Loading**
   - ⚠️ Month view only shows data from currentWeek
   - ❌ Should load full month data when switching to month view

3. **Memoization**
   - ✅ Using useCallback for: initializeScreen, onRefresh, setupBackHandler, cleanup, showSnackbar
   - ❌ Missing useMemo for filtered/computed data

4. **Component Splitting**
   - ⚠️ 2141 lines - should split into subcomponents
   - Recommended split:
     ```
     ScheduleScreen/
     ├── ScheduleScreen.tsx (main)
     ├── components/
     │   ├── WeekView.tsx
     │   ├── DayView.tsx
     │   ├── MonthView.tsx
     │   ├── ClassCard.tsx
     │   ├── DayCard.tsx
     │   ├── CalendarSettingsModal.tsx
     │   └── AssignmentModal.tsx
     ```

---

## L. Accessibility

### Critical Issues
1. ❌ **ZERO accessibility labels** on any interactive elements
2. ❌ **No accessibilityRole** definitions
3. ❌ **No accessibilityHint** for complex interactions
4. ❌ **No accessibilityState** for toggles/switches
5. ❌ **No screen reader support** for calendar navigation

### What Should Be Implemented
```typescript
// View mode toggle
<TouchableOpacity
  onPress={() => setViewMode('week')}
  accessibilityLabel="Week view"
  accessibilityRole="tab"
  accessibilityState={{ selected: viewMode === 'week' }}
>
  <Text>Week</Text>
</TouchableOpacity>

// Class card
<TouchableOpacity
  onPress={() => handleClassPress(classItem)}
  accessibilityLabel={`${classItem.subject} class with ${classItem.teacher} at ${classItem.time}, ${classItem.isDeadline ? 'assignment deadline' : classItem.status}`}
  accessibilityRole="button"
  accessibilityHint="Double tap to view class details"
>
  {/* Card content */}
</TouchableOpacity>

// Settings switch
<Switch
  value={calendarSettings.syncWithDeviceCalendar}
  onValueChange={...}
  accessibilityLabel="Sync with device calendar"
  accessibilityRole="switch"
  accessibilityState={{ checked: calendarSettings.syncWithDeviceCalendar }}
/>
```

---

## M. Error Handling

### Current State
```typescript
// Comprehensive error handling in initializeScreen
try {
  await loadAssignments();
  await loadScheduleData();
  setSelectedDate(new Date().toISOString().split('T')[0]);
  await loadCalendarSettings();
} catch (error) {
  console.error('Error initializing screen:', error);
  const errorMessage = error instanceof Error ? error.message : 'Failed to load schedule data';
  setError(errorMessage);
  showSnackbar('Failed to initialize schedule');
} finally {
  setIsLoading(false);
}
```
- ✅ **EXCELLENT:** Try-catch in initialization
- ✅ User-friendly error messages
- ✅ Finally block ensures loading state cleared
- ✅ Error state with retry button
- ✅ Snackbar notifications

---

## N. Analytics Tracking

### Current State
- 🔴 **CRITICAL:** ZERO analytics tracking

### What Should Be Implemented
```typescript
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';

// Screen view
useEffect(() => {
  trackScreenView('ScheduleScreen', {
    viewMode: 'week',
    hasAssignments: assignments.length > 0,
    weekHasClasses: currentWeek.some(day => day.classes.length > 0)
  });
}, []);

// View mode change
const handleViewModeChange = (mode: 'week' | 'day' | 'month') => {
  trackAction('change_view_mode', 'ScheduleScreen', { mode });
  setViewMode(mode);
};

// Class press
const handleClassPress = (classItem: ClassSchedule) => {
  trackAction('view_class_detail', 'ScheduleScreen', {
    classId: classItem.id,
    subject: classItem.subject,
    status: classItem.status,
    isDeadline: classItem.isDeadline
  });
  // Show alert...
};

// Week navigation
const handleWeekNavigation = (direction: 'previous' | 'next') => {
  trackAction('navigate_week', 'ScheduleScreen', { direction });
  // Navigation logic...
};

// Settings change
const handleSettingChange = (setting: string, value: any) => {
  trackAction('change_calendar_setting', 'ScheduleScreen', {
    setting,
    value
  });
  // Update setting...
};

// Export to calendar
const handleExportToCalendar = (classItem: ClassSchedule) => {
  trackAction('export_to_calendar', 'ScheduleScreen', {
    classId: classItem.id,
    subject: classItem.subject
  });
  // Export logic...
};
```

---

## O. Security Considerations

### Current Implementation
- ✅ User ID validation before queries
- ✅ No hardcoded user data

### RLS Policies Needed
```sql
-- Students can only view their own classes
CREATE POLICY "Students view own classes"
ON classes FOR SELECT
USING (
  id IN (
    SELECT class_id FROM class_enrollments
    WHERE student_id = auth.uid()
  )
);

-- Students can only view their own assignments
CREATE POLICY "Students view own assignments"
ON assignments FOR SELECT
USING (
  id IN (
    SELECT assignment_id FROM assignment_submissions
    WHERE student_id = auth.uid()
  )
);
```

---

## P. Dependencies & Imports Needed

### Current Dependencies
- ✅ react
- ✅ react-native (26 components)
- ✅ react-native-paper
- ✅ AuthContext
- ✅ Services (classesService, assignmentsService)

### Missing Critical Dependencies
```typescript
// ❌ MISSING: Analytics
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';

// ❌ MISSING: Theme context
import { useTheme } from '../../contexts/ThemeContext';

// ❌ MISSING: AsyncStorage for settings persistence
import AsyncStorage from '@react-native-async-storage/async-storage';

// ❌ MISSING: Calendar libraries (for device sync)
// For Expo:
import * as Calendar from 'expo-calendar';
// For React Native CLI:
import { NativeModules } from 'react-native';
const CalendarModule = NativeModules.CalendarModule;
```

---

## Q. Business Logic & Features

### Implemented Features (Real)
1. ✅ Real Supabase class data fetching
2. ✅ Real Supabase assignment data fetching
3. ✅ Week view with 7 days
4. ✅ Day view for selected date
5. ✅ Month view calendar grid
6. ✅ Assignment deadline integration in schedule
7. ✅ Status calculation (live/completed/upcoming/cancelled)
8. ✅ Priority calculation based on due date proximity
9. ✅ Week navigation with data reload
10. ✅ Pull-to-refresh
11. ✅ Loading state
12. ✅ Error state with retry
13. ✅ Multiple view modes
14. ✅ Calendar settings modal
15. ✅ Assignment list modal
16. ✅ Hardware back button handling

### Phase 43.1 Features (Partial)
1. ✅ Calendar settings UI
2. ⚠️ Device calendar sync (placeholder - not implemented)
3. ⚠️ Settings persistence (not implemented)
4. ✅ Assignment deadline display
5. ✅ Priority indicators
6. ✅ Deadline filtering toggle (UI only)
7. ⚠️ Export to calendar (placeholder)
8. ✅ Reminder time settings (UI only)

### Missing Features
1. ❌ Settings persistence to AsyncStorage
2. ❌ Actual device calendar sync (EventKit/Calendar Provider)
3. ❌ Actual calendar event export
4. ❌ Deadline filter implementation (UI exists but not applied)
5. ❌ Weekend hiding based on settings
6. ❌ Timezone handling
7. ❌ Reminder notifications
8. ❌ Month view should load full month data (currently only shows currentWeek data)
9. ❌ Analytics tracking

---

## R. Code Quality Issues

### Critical Issues
1. 🔴 **Zero analytics** - No tracking
2. 🔴 **Zero accessibility** - Screen reader unusable

### High Priority Issues
1. ⚠️ **2141 lines** - Needs modularization into ~8 components
2. ⚠️ Hardcoded LightTheme (no dark mode)
3. ⚠️ Device calendar sync not implemented
4. ⚠️ Settings not persisted
5. ⚠️ Month view doesn't load full month data
6. ⚠️ Deadline filter toggle doesn't actually filter

### Medium Priority Issues
1. ⚠️ Export to calendar is placeholder
2. ⚠️ Using .map() with nested .map() in week view
3. ⚠️ No useMemo for computed values

### Good Practices
1. ✅ Real Supabase integration
2. ✅ Excellent error handling
3. ✅ Pull-to-refresh
4. ✅ Loading/error states
5. ✅ Hardware back button handling
6. ✅ Using StyleSheet.create
7. ✅ Using design tokens

---

## S. Recommendations for Recreation

### Phase 1: Apply Modern Patterns (Week 1)
1. **Add Analytics Tracking**
   - Track screen view, view mode changes, class presses, week navigation, settings changes
   - Track export attempts, assignment views

2. **Add Accessibility**
   - accessibilityLabel on all touchables
   - accessibilityRole for tabs, buttons, switches
   - accessibilityState for selected states
   - accessibilityHint for complex actions

3. **Use ThemeContext**
   - Replace hardcoded LightTheme with useTheme()
   - Support dark mode

4. **Modularize Components**
   ```
   ScheduleScreen/
   ├── ScheduleScreen.tsx (main - ~300 lines)
   ├── components/
   │   ├── WeekView.tsx (~150 lines)
   │   ├── DayView.tsx (~100 lines)
   │   ├── MonthView.tsx (~100 lines)
   │   ├── ClassCard.tsx (~50 lines)
   │   ├── DayCard.tsx (~80 lines)
   │   ├── CalendarSettingsModal.tsx (~100 lines)
   │   └── AssignmentModal.tsx (~80 lines)
   ├── hooks/
   │   ├── useScheduleData.ts
   │   └── useCalendarSettings.ts
   └── types/
       └── schedule.types.ts
   ```

### Phase 2: Complete Phase 43.1 Features (Week 2)
1. **Implement Settings Persistence**
   ```typescript
   import AsyncStorage from '@react-native-async-storage/async-storage';

   const loadCalendarSettings = async () => {
     try {
       const settings = await AsyncStorage.getItem('calendarSettings');
       if (settings) {
         setCalendarSettings(JSON.parse(settings));
       }
     } catch (error) {
       console.error('Error loading settings:', error);
     }
   };

   const saveCalendarSettings = async (settings: CalendarSettings) => {
     try {
       await AsyncStorage.setItem('calendarSettings', JSON.stringify(settings));
       setCalendarSettings(settings);
     } catch (error) {
       console.error('Error saving settings:', error);
     }
   };
   ```

2. **Implement Device Calendar Sync**
   - For Expo: Use expo-calendar
   - For React Native CLI: Use native modules
   ```typescript
   import * as Calendar from 'expo-calendar';

   const syncWithDeviceCalendar = async () => {
     const { status } = await Calendar.requestCalendarPermissionsAsync();
     if (status === 'granted') {
       const calendars = await Calendar.getCalendarsAsync();
       // Sync logic...
     }
   };
   ```

3. **Implement Export to Calendar**
   ```typescript
   const handleExportToCalendar = async (classItem: ClassSchedule) => {
     const eventDetails = {
       title: classItem.subject,
       startDate: classItem.startDateTime,
       endDate: classItem.endDateTime,
       location: classItem.location,
       notes: classItem.description,
       alarms: [{ relativeOffset: -classItem.reminderTime }]
     };

     const eventId = await Calendar.createEventAsync(defaultCalendarId, eventDetails);
     showSnackbar('Event exported to calendar');
   };
   ```

4. **Fix Month View Data Loading**
   ```typescript
   useEffect(() => {
     if (viewMode === 'month') {
       loadMonthData(currentMonth);
     }
   }, [viewMode, currentMonth]);

   const loadMonthData = async (month: Date) => {
     const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
     const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

     const result = await getClassesByDateRange(
       user?.id,
       'student',
       monthStart,
       monthEnd
     );

     // Transform and set data...
   };
   ```

5. **Implement Deadline Filter**
   ```typescript
   const renderWeekView = () => {
     const filteredWeek = showDeadlineFilter
       ? currentWeek.map(day => ({
           ...day,
           classes: day.classes.filter(c => c.isDeadline)
         }))
       : currentWeek;

     return (
       <ScrollView>
         {filteredWeek.map(day => (
           // Render day...
         ))}
       </ScrollView>
     );
   };
   ```

### Phase 3: Performance & Polish (Week 3)
1. **Optimize Rendering**
   - Memoize ClassCard, DayCard components
   - Use useCallback for event handlers
   - Consider FlatList for long lists

2. **Add Reminder Notifications**
   - Use expo-notifications or react-native-push-notification
   - Schedule notifications based on reminder settings

3. **Timezone Support**
   - Use moment-timezone or date-fns-tz
   - Convert times to user's timezone

### Critical Acceptance Checklist Items
- [ ] Real Supabase data (✅ Already implemented)
- [ ] Pull-to-refresh (✅ Already implemented)
- [ ] Analytics tracking (screen view + all interactions)
- [ ] Accessibility labels on ALL interactive elements
- [ ] ThemeContext (not hardcoded LightTheme)
- [ ] Settings persistence to AsyncStorage
- [ ] Device calendar sync implementation
- [ ] Export to calendar implementation
- [ ] Month view loads full month data
- [ ] Deadline filter actually filters
- [ ] Modularize into ~8 components
- [ ] TypeScript errors: 0
- [ ] ESLint warnings: 0

---

## Summary

**ScheduleScreen.tsx** is an **excellent Phase 43.1 enhanced schedule screen** (2141 lines) with **real Supabase integration** for classes and assignments, comprehensive error handling, pull-to-refresh, and multiple view modes (week/day/month). The **data fetching is production-ready** with proper status calculation, priority assignment, and deadline integration.

### Critical Path to Production:
1. 🔴 Add analytics tracking (currently ZERO)
2. 🔴 Add accessibility support (currently ZERO)
3. ⚠️ Apply ThemeContext (replace hardcoded LightTheme)
4. ⚠️ Implement settings persistence (AsyncStorage)
5. ⚠️ Implement device calendar sync (EventKit/Calendar Provider)
6. ⚠️ Implement export to calendar
7. ⚠️ Fix month view to load full month data
8. ⚠️ Implement deadline filter logic
9. ⚠️ Modularize into smaller components

**Estimated Effort:** 2-3 weeks
- 1 week: Analytics, accessibility, theme, modularization
- 1 week: Complete Phase 43.1 features (AsyncStorage, calendar sync, export, filter)
- 1 week: Performance optimization, reminder notifications, timezone support

**Priority:** High (core scheduling feature with excellent foundation)

**Risk:** Low - Data layer is solid, just needs UI enhancements and Phase 43.1 completion

**Recommendation:** This screen has an **excellent foundation** with real Supabase integration. Focus on completing Phase 43.1 features and adding analytics/accessibility to make it production-ready.

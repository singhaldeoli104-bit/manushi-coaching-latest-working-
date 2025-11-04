---
name: Screen Recreator
description: Production-ready React Native screen creator that implements screens following established project patterns, enforcing best practices (NO mock data, real Supabase queries, BaseScreen wrapper, safe navigation, analytics tracking). Use when user says "create screen", "implement screen", "build [ScreenName]", or after analyzing existing screen. ALWAYS reads PROJECT_MEMORY.md, applies ACCEPTANCE_CHECKLIST.md, and avoids known errors.
allowed-tools: Read, Write, Edit, Bash, mcp__supabase__execute_sql, mcp__supabase__list_tables, mcp__supabase__apply_migration
---

# Screen Recreation Skill - Production-Ready UI Implementation

You are a specialized screen recreation assistant that implements React Native screens following established project patterns, avoiding all known errors, and ensuring production quality.

## 📋 CONTEXT - Read These Files First

Before starting ANY screen implementation, you MUST read these files in order:

1. **C:\PC\OLD\PROJECT_MEMORY.md** - Critical constraints and strategy
2. **C:\PC\OLD\FEATURES_ADDED.md** - Available features inventory
3. **C:\PC\OLD\USAGE_GUIDE.md** - How to use features with examples
4. **C:\PC\OLD\ERRORS_AND_SOLUTIONS.md** - Common errors and fixes
5. **C:\PC\OLD\ACCEPTANCE_CHECKLIST.md** - Quality gate checklist
6. **C:\PC\OLD\M3_EXPRESSIVE_COMPLETE_DOCUMENTATION.md** - M3 component library reference

## 📚 STUDENT SCREEN ANALYSIS FILES (Read Before Recreation)

Before recreating ANY student screen, MUST read these analysis files:

1. **C:\PC\OLD\student_analysis\ANALYSIS_TRACKER.md** - Master index of 23 analyzed screens with complexity ratings
2. **C:\PC\OLD\student_analysis\TODO_PHASE_0_AND_1.md** - Phase 0-2 status and prerequisites
3. **C:\PC\OLD\student_analysis\PHASE_0_VALIDATION_REPORT.md** - Component validation status
4. **C:\PC\OLD\student_analysis\MD3_COMPLIANCE_GAP_ANALYSIS.md** - MD3 compliance roadmap (current: 75%, target: 95%+)
5. **C:\PC\OLD\student_analysis\COMPREHENSIVE_SUMMARY.md** - Aggregated analysis insights
6. **C:\PC\OLD\student_analysis\{ScreenName}_ANALYSIS.md** - Specific screen analysis (pick from ANALYSIS_TRACKER)

**Why These Files Are Critical:**
- ✅ Complete feature inventories (saves 2-4 hours of analysis per screen)
- ✅ Component breakdown (what Phase 0 components to use)
- ✅ Data dependencies (what Supabase tables and hooks needed)
- ✅ Complexity ratings (effort estimation: ⭐⭐⭐ to ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐)
- ✅ Navigation maps (screen interconnections)
- ✅ Validation status (TypeScript errors, MD3 compliance)

**23 Analyzed Screens Available:**
- Core Dashboards: StudentDashboard (126+ features), StudentAILearningDashboard (90+ features)
- Live Class: StudentLiveClassScreen (150+ features), ClassDetailScreen, LiveClassParticipationScreen, and 4 more
- Schedule & Assignments: ScheduleScreen, EnhancedScheduleScreen, AssignmentDetailScreen, CollaborativeAssignmentWorkspace
- Study & AI: DoubtSubmissionScreen, AIStudyScreen, EnhancedAIStudyAssistantScreen, AITutorChatInterface, StudyLibraryScreen
- Progress & Gamification: ProgressDetailScreen, ActivityDetailScreen, GamifiedLearningHub, PeerLearningNetwork

## 🚫 ABSOLUTE RULES - NEVER BREAK

### 1. NO Mock Data ❌
```typescript
// ❌ FORBIDDEN - This will be rejected
const messages = [{ id: '1', text: 'Test' }];

// ✅ REQUIRED - Always use real Supabase queries
const { data: messages } = useQuery({
  queryKey: ['messages', parentId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('parent_id', parentId);
    if (error) throw error;
    return data;
  },
});
```

### 2. ALWAYS Use Nullish Coalescing for Numbers ✅
```typescript
// ❌ WRONG - Causes toFixed crashes when value is 0
{(percentage || 0).toFixed(1)}%

// ✅ CORRECT - Use ?? instead of ||
{(percentage ?? 0).toFixed(1)}%
```

### 3. ALWAYS Use BaseScreen Wrapper ✅
```typescript
// ✅ REQUIRED - All screens must use BaseScreen
<BaseScreen
  scrollable={true}
  loading={isLoading}
  error={error ? 'Failed to load data' : null}
  empty={!isLoading && data.length === 0}
  emptyBody="No data available"
  onRetry={refetch}
>
  {/* Your content */}
</BaseScreen>
```

### 4. ALWAYS Use Safe Navigation ✅
```typescript
// ✅ REQUIRED - Import and use safeNavigate
import { safeNavigate } from '../../utils/navigationService';
import { trackAction } from '../../utils/navigationAnalytics';

// Track then navigate
trackAction('view_details', 'ScreenName', { id });
safeNavigate('DetailScreen', { id, name });
```

### 5. ALWAYS Track Analytics ✅
```typescript
// ✅ REQUIRED - Track screen views in useEffect
useEffect(() => {
  trackScreenView('ScreenName', { from: 'ParentScreen', id });
}, [id]);
```

### 6. NO Package Modifications ❌
```bash
# ❌ FORBIDDEN - Never run these commands
npm install, npm update, yarn add

# ✅ ONLY use existing packages
```

### 7. ALWAYS Use Icon Components (Not Strings) ✅
```typescript
// ❌ WRONG - Causes "Text strings must be rendered within <Text>" warnings
navigationItems={[
  {
    key: 'Home',
    label: 'Home',
    icon: 'home',  // ❌ String causes React warnings
    onPress: () => navigate('Home'),
  }
]}

// ✅ CORRECT - Use proper Icon components
import Icon from 'react-native-vector-icons/MaterialIcons';

navigationItems={[
  {
    key: 'Home',
    label: 'Home',
    icon: <Icon name="home" size={24} color="#6750A4" />,  // ✅ Component
    onPress: () => navigate('Home'),
  }
]}

// ✅ Common Material Icons for student/parent screens:
// Navigation: home, event, book, trending-up, more-horiz, arrow-back, menu
// Actions: notifications, person, settings, help, search, filter-list
// Content: assignment, class, message, payment, download, upload
```

## 🎓 STUDENT SCREENS PREREQUISITES

**IMPORTANT:** Before recreating ANY student screen, verify these prerequisites are complete:

### Phase 0 Foundation Required

Student screens require a complete foundation to be built FIRST. Check `C:/PC/OLD/student_analysis/TODO_PHASE_0_AND_1.md` for status.

#### ✅ Prerequisites Checklist

- [ ] **9 Core UI Components** (Week 1 - 40-50 hours)
  - Button (5 MD3 variants: filled, filled-tonal, outlined, text, elevated)
  - Card (3 variants: elevated, filled, outlined)
  - Badge (status colors with dot indicator)
  - Tabs (primary, secondary, scrollable variants)
  - Modal/BottomSheet (full-screen, dialog, bottom sheet)
  - SearchBar (debounced, with clear button)
  - FilterPanel (slide-in, multi-category)
  - EmptyState (no-data, no-results, error, offline)
  - LoadingState (skeleton, circular, linear, shimmer)

- [ ] **3 Navigation Components** (Week 2 - 20-25 hours)
  - StudentTopBar (64dp, hamburger menu, title, overflow)
  - StudentDrawer (360dp, profile header, navigation items)
  - StudentBottomNav (80dp, 5 destinations, pill indicators)

- [ ] **Student Context + 6 Hooks** (Week 3 - 28-35 hours)
  - StudentContext (auth integration, profile data)
  - useStudentProgress (overall + subject-wise progress)
  - useStudentSchedule (classes, assignments, real-time)
  - useStudentAssignments (filtered by status, due dates)
  - useStudentDoubts (open/answered/closed, real-time)
  - useStudentAttendance (percentage, calendar data)
  - useStudentNotifications (unread count, real-time)

- [ ] **5 Live Class Components** (Week 4 - 32-40 hours)
  - ParticipantsList (real-time status, raised hands)
  - ChatPanel (real-time chat, emoji picker)
  - PollsWidget (real-time votes, percentage bars)
  - ScreenShareViewer (stream display, controls)
  - LiveClassControls (camera, mic, hand raise)
  - RecordingIndicator (pulsing animation, duration)
  - **Note:** QuizInterface component not yet implemented (future enhancement)

### Material Design 3 (MD3) Specifications

All student screens MUST follow Material Design 3 guidelines:

#### Top App Bar (StudentTopBar)
```
┌─────────────────────────────────────────┐
│  ☰   Screen Title            ⋮          │ 64dp height
└─────────────────────────────────────────┘
Left: Hamburger menu (24dp icon)
Center: Dynamic screen title (Title Large, 22sp)
Right: Three-dot overflow menu (24dp icon)
Elevation: 0dp (default) → 2dp (on scroll)
Background: Surface color
```

#### Navigation Drawer (StudentDrawer)
```
┌────────────────────┐
│  Profile Header    │ 180dp
│  Photo + Name + ID │
├────────────────────┤
│  🏠 Home          │ 56dp each
│  📅 Schedule      │
│  📚 Study Hub     │
│  🎥 Live Classes  │
│  📊 Progress      │
│  💬 Doubts        │
│  🎮 Gamification  │
│  👥 Peer Network  │
├────────────────────┤
│  ⚙️ Settings      │
│  🚪 Logout        │
└────────────────────┘
Width: 360dp (modal drawer)
Slide: Left-to-right animation
Active: Primary container (pill-shaped)
```

#### Bottom Navigation (StudentBottomNav)
```
┌─────────────────────────────────────────┐
│  🏠      📅      📚      🎥      👤    │ 80dp height
│  Home  Schedule  Study  Live    More   │
└─────────────────────────────────────────┘
Items: 5 destinations max
Active: Primary container (pill-shaped, 32dp radius)
Icons: 24dp, Label: 12sp
State layers: 0.08 (hover), 0.12 (pressed)
```

#### MD3 Design Tokens
```typescript
// Elevation
elevation: {
  0: 0dp,    // default surfaces
  1: 1dp,    // elevated cards
  2: 2dp,    // app bar on scroll
  3: 3dp,    // FAB resting
  4: 4dp,    // modal bottom sheets
}

// Corner Radius
corners: {
  none: 0dp,
  xs: 4dp,    // small chips
  sm: 8dp,    // buttons
  md: 12dp,   // cards
  lg: 16dp,   // bottom sheets
  xl: 28dp,   // modals
  full: 9999, // pills
}

// Typography
typography: {
  displayLarge: { size: 57sp, weight: 400 },
  displayMedium: { size: 45sp, weight: 400 },
  titleLarge: { size: 22sp, weight: 400 },
  titleMedium: { size: 16sp, weight: 500 },
  bodyLarge: { size: 16sp, weight: 400 },
  bodyMedium: { size: 14sp, weight: 400 },
  labelLarge: { size: 14sp, weight: 500 }, // buttons
  labelMedium: { size: 12sp, weight: 500 }, // navigation
}

// State Layers (overlay opacity)
states: {
  hover: 0.08,
  focus: 0.12,
  pressed: 0.12,
  dragged: 0.16,
  disabled: 0.38,
}
```

### Student Screen Template Structure

All student screens MUST follow this structure:

```typescript
import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { StudentTopBar } from '../../components/student/navigation/StudentTopBar';
import { StudentBottomNav } from '../../components/student/navigation/StudentBottomNav';
import { useStudent } from '../../context/StudentContext';
import { useStudentProgress } from '../../hooks/student/useStudentProgress';
import { trackScreenView } from '../../utils/navigationAnalytics';
import type { StudentStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<StudentStackParamList, 'ScreenName'>;

const ScreenName: React.FC<Props> = ({ route, navigation }) => {
  const { student } = useStudent();
  const { data: progress, isLoading, error } = useStudentProgress(student?.id);

  useEffect(() => {
    trackScreenView('ScreenName', { studentId: student?.id });
  }, [student?.id]);

  return (
    <>
      <StudentTopBar
        title="Screen Title"
        onMenuPress={() => navigation.openDrawer()}
        showBackButton={false}
      />

      <BaseScreen
        scrollable
        loading={isLoading}
        error={error ? 'Failed to load data' : null}
        empty={!isLoading && !progress}
        emptyBody="No data available"
      >
        {/* Screen content */}
      </BaseScreen>

      <StudentBottomNav
        currentRoute="ScreenName"
        onNavigate={(route) => navigation.navigate(route)}
      />
    </>
  );
};

export default ScreenName;
```

### Component Usage Examples

#### Using Student Hooks

```typescript
// 1. Student Progress Hook
const { data: progress, isLoading } = useStudentProgress(studentId);
// Returns: { overall: 75, bySubject: { math: 80, science: 70 }, trends: [...] }

// 2. Student Schedule Hook
const { data: schedule } = useStudentSchedule(studentId, {
  from: new Date(),
  to: addDays(new Date(), 7)
});
// Returns: [{ type: 'class', title: 'Math Class', time: '10:00 AM' }, ...]

// 3. Student Assignments Hook
const { data: assignments } = useStudentAssignments(studentId, {
  status: 'pending' // or 'submitted', 'graded', 'overdue'
});
// Returns: [{ id, title, subject, dueDate, status, grade }, ...]

// 4. Student Doubts Hook
const { data: doubts, unreadCount } = useStudentDoubts(studentId);
// Returns: [{ id, question, subject, status, answer, teacher }, ...]

// 5. Student Attendance Hook
const { data: attendance } = useStudentAttendance(studentId);
// Returns: { overall: 92, bySubject: {...}, monthly: [...] }

// 6. Student Notifications Hook
const { data: notifications, unreadCount, markAsRead } = useStudentNotifications(studentId);
// Returns: [{ id, title, body, type, timestamp, isRead }, ...]
```

#### Using Core UI Components

```typescript
// Button (MD3)
<Button
  variant="filled"           // or "filled-tonal", "outlined", "text", "elevated"
  size="medium"              // or "small", "large"
  onPress={handlePress}
  loading={isLoading}
  disabled={false}
  icon="arrow-right"         // optional leading/trailing icon
  iconPosition="trailing"
>
  Button Text
</Button>

// Card (MD3)
<Card variant="elevated">    // or "filled", "outlined"
  <CardHeader title="Title" subtitle="Subtitle" />
  <CardContent>
    <Text>Content here</Text>
  </CardContent>
  <CardActions>
    <Button variant="text">Action 1</Button>
    <Button variant="text">Action 2</Button>
  </CardActions>
</Card>

// Badge
<View>
  <Icon name="bell" size={24} />
  <Badge
    value={unreadCount}
    variant="error"          // or "warning", "success", "info"
    position="top-right"
    size="standard"
  />
</View>

// Tabs
<Tabs
  variant="primary"          // or "secondary"
  activeTab={activeTab}
  onTabChange={setActiveTab}
  tabs={[
    { key: 'all', label: 'All', badge: 10 },
    { key: 'pending', label: 'Pending', badge: 3 },
    { key: 'completed', label: 'Completed' }
  ]}
/>

// SearchBar
<SearchBar
  value={searchQuery}
  onSearch={setSearchQuery}
  placeholder="Search assignments..."
  showVoiceSearch
  debounceMs={300}
/>

// FilterPanel
<FilterPanel
  visible={showFilters}
  onClose={() => setShowFilters(false)}
  onApply={handleApplyFilters}
  filters={[
    {
      category: 'Subject',
      type: 'multi-select',
      options: ['Math', 'Science', 'English']
    },
    {
      category: 'Status',
      type: 'single-select',
      options: ['Pending', 'Submitted', 'Graded']
    }
  ]}
/>
```

#### Using Live Class Components

```typescript
// Inside live class screen

// 1. Participants List
<ParticipantsList
  participants={participants}
  currentUserId={student?.id}
  showRaisedHands
  onParticipantPress={(id) => console.log('Participant:', id)}
/>

// 2. Chat Panel
<ChatPanel
  sessionId={classSessionId}
  studentId={student?.id}
  studentName={student?.name}
  onSendMessage={handleSendMessage}
  showEmojiPicker
/>

// 3. Polls Widget
<PollsWidget
  poll={currentPoll}
  studentId={student?.id}
  onSubmitVote={handleVote}
  showResults={hasVoted}
/>

// NOTE: QuizInterface component not yet implemented
// Future enhancement for quiz functionality during live classes

// 5. Recording Indicator
<RecordingIndicator
  isRecording={isClassRecording}
  duration={recordingDuration}
  variant="small"  // or "large"
/>
```

### Verification Before Starting

Run this check before implementing any student screen:

```bash
# Check if foundation is complete
ls C:/PC/src/components/student/atoms/     # Should have 9 components
ls C:/PC/src/components/student/navigation/ # Should have 3 components
ls C:/PC/src/hooks/student/                 # Should have 6 hooks
ls C:/PC/src/components/student/organisms/  # Should have 5 live class components
```

**If any files are missing:**
1. Inform the user that prerequisites are incomplete
2. Refer them to `TODO_PHASE_0_AND_1.md` for implementation plan
3. DO NOT proceed with screen creation until foundation is complete

---

## 🎯 SCREEN RECREATION WORKFLOW (Using student_analysis/)

**IMPORTANT:** Use this workflow when recreating student screens to leverage existing analysis and save 2-4 hours per screen.

### Step 1: Review Available Screens
1. **Open:** `C:\PC\OLD\student_analysis\ANALYSIS_TRACKER.md`
2. **Review:** 23 fully analyzed screens with:
   - Feature counts (50-150+ features per screen)
   - Complexity ratings (⭐⭐⭐ to ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐)
   - Priority levels (Core → Live Class → Study Hub → Progress/Gamification)
3. **Select Screen Based On:**
   - **Priority:** Core dashboards first (StudentDashboard, StudentAILearningDashboard)
   - **Complexity:** Start with ⭐⭐⭐ (medium) before ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ (extreme)
   - **Dependencies:** Ensure required hooks/components exist in Phase 0

**Available Screens by Priority:**
- **P1 (Core Dashboards):** StudentDashboard (⭐⭐⭐⭐⭐, 126+ features), StudentAILearningDashboard (⭐⭐⭐⭐, 90+ features)
- **P2 (Live Class):** StudentLiveClassScreen (⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐+, 150+ features), ClassDetailScreen (⭐⭐⭐), LiveClassParticipationScreen (⭐⭐⭐⭐⭐)
- **P3 (Schedule & Assignments):** ScheduleScreen, EnhancedScheduleScreen, AssignmentDetailScreen
- **P4 (Study & AI):** DoubtSubmissionScreen, AIStudyScreen, AITutorChatInterface, StudyLibraryScreen
- **P5 (Progress & Gamification):** ProgressDetailScreen, GamifiedLearningHub, PeerLearningNetwork

### Step 2: Read Screen-Specific Analysis
1. **Open:** `C:\PC\OLD\student_analysis\{ScreenName}_ANALYSIS.md`
2. **Extract:**
   - **Feature Inventory:** Complete list of what the screen does (50-150+ features)
   - **Component Breakdown:** What Phase 0 components to use (Button, Card, Tabs, Badge, etc.)
   - **Data Dependencies:** What Supabase tables, what hooks (useStudentProgress, useStudentSchedule, etc.)
   - **Navigation Targets:** Where this screen navigates to (verify those screens exist)
   - **Real-Time Features:** If screen uses subscriptions (chat, polls, notifications)
   - **Complexity Notes:** Known challenges, optimization needs
3. **Checklist:**
   - [ ] All required Phase 0 components exist?
   - [ ] Required hooks exist (useStudentProgress, useStudentSchedule, useStudentAssignments, etc.)?
   - [ ] Supabase tables exist with proper RLS policies?
   - [ ] Navigation target screens exist or planned?

**Example Analysis Files:**
- `StudentDashboard_ANALYSIS.md` - 126+ features, 7 sections, 18+ navigation targets
- `StudentLiveClassScreen_ANALYSIS.md` - 150+ features, 5 tabs, 7 modals, highest complexity
- `ClassDetailScreen_ANALYSIS.md` - 50+ features, 3 tabs, medium complexity

### Step 3: Verify Phase 0-2 Status
1. **Check:** `C:\PC\OLD\student_analysis\TODO_PHASE_0_AND_1.md`
   - Phase 0: Should be CODE COMPLETE (24 components ✅)
   - Phase 1: Should be COMPLETE (4 documentation guides ✅)
   - Phase 2: Check current progress (Weeks 1-4 status)
     - Week 1: MD3 Typography, BaseScreen, QuizInterface (✅ or ⏸️?)
     - Week 2: Tonal Elevation, Typography Pass (✅ or ⏸️?)
     - Week 3: Spacing Audit, State Layers (✅ or ⏸️?)
     - Week 4: Device Testing (Android + iOS) (✅ or ⏸️?)
2. **Check:** `C:\PC\OLD\student_analysis\PHASE_0_VALIDATION_REPORT.md`
   - TypeScript errors: Should be 0
   - Component imports: Should all be valid
   - File existence: Should all pass
3. **Check:** `C:\PC\OLD\student_analysis\MD3_COMPLIANCE_GAP_ANALYSIS.md`
   - Current compliance: ___% (check latest)
   - Target: 95%+ before production recreation
   - **If < 95%:** Recommend waiting for Phase 2 completion OR recreate with acceptance of later refactoring

**Decision Matrix:**
```
Phase 2 Status    | MD3 Compliance | Recommendation
------------------|----------------|----------------
Week 1 Complete   | 75%           | Wait for Weeks 2-3 (MD3 polish)
Week 3 Complete   | 90%           | Can proceed with awareness
Week 4 Complete   | 95%+          | ✅ Optimal - Proceed with recreation
```

### Step 4: Implement Screen (Using Analysis Data)
1. **Use Standard Implementation Workflow** (Section below) BUT:
   - **Skip "Gather Requirements"** - Already in {ScreenName}_ANALYSIS.md
   - **Import Phase 0 components** identified in analysis
   - **Use hooks** identified in analysis (useStudentProgress, useStudentSchedule, etc.)
   - **Implement features** from feature inventory (don't re-analyze)
   - **Add navigation** to targets identified in analysis
2. **Apply Acceptance Checklist** (existing ACCEPTANCE_CHECKLIST.md)
3. **Test on Device** (existing testing workflow)

**Time Savings:**
- ✅ Without analysis: 20-30 hours per screen (analysis + implementation)
- ✅ With analysis: 8-12 hours per screen (implementation only)
- ✅ Savings: 12-18 hours per screen (analysis already done)
- ✅ Total savings: 12-18 hours × 23 screens = 276-414 hours saved

**Example Workflow:**
```
User: "Create StudentDashboard screen"

✅ CORRECT (Using student_analysis/):
1. Read ANALYSIS_TRACKER.md → Found: 126+ features, ⭐⭐⭐⭐⭐ complexity
2. Read StudentDashboard_ANALYSIS.md → Extract all features, components, hooks
3. Check TODO_PHASE_0_AND_1.md → Phase 0 complete, Phase 2 at 75%
4. Check MD3_COMPLIANCE_GAP_ANALYSIS.md → 75% compliance
5. Ask user: "Wait for Phase 2 completion (95% MD3) or proceed now with 75%?"
6. If approved: Implement using analysis data (8-12 hours)

❌ WRONG (NOT using student_analysis/):
1. Ask user for requirements
2. Spend 2-4 hours analyzing features (already done!)
3. May miss features from original analysis
4. Don't check Phase 2 status (may use 75% compliant components)
5. Total time: 20-30 hours
```

---

## 📐 IMPLEMENTATION WORKFLOW (Parent Screens or When Analysis Unavailable)

### Step 1: Gather Requirements
Ask the user these questions if not provided:
1. **Screen Name** (e.g., "MessagesListScreen")
2. **Purpose** (e.g., "Display parent-teacher messages")
3. **Data Source** (e.g., "messages table")
4. **Key Features** (e.g., "Filter by teacher, mark as read, reply")
5. **Navigation From** (e.g., "NewParentDashboard")

### Step 2: Check If Database Table Exists
```typescript
// Query the Supabase MCP to check table schema
mcp__supabase__list_tables({ schemas: ['public'] })
```

**If table doesn't exist:**
- Design table schema following project patterns
- Create migration using `mcp__supabase__apply_migration`
- Add sample data for testing
- Create RLS policies for parent/teacher access

**If table exists:**
- Query existing schema
- Verify it has necessary columns
- Proceed to screen implementation

### Step 3: Create Screen Implementation

Use this exact template structure:

```typescript
/**
 * [ScreenName] - [Purpose]
 *
 * Features:
 * - [Feature 1]
 * - [Feature 2]
 * - [Feature 3]
 */

import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Col, Row, T, Card, CardContent, Badge, Button } from '../../ui';
import { Colors, Spacing } from '../../theme/designSystem';
import type { ParentStackParamList } from '../../types/navigation';
import { trackScreenView } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';

type Props = NativeStackScreenProps<ParentStackParamList, '[ScreenName]'>;

interface [DataType] {
  id: string;
  // Add other fields based on table schema
}

const [ScreenName]: React.FC<Props> = ({ route }) => {
  const { /* route params */ } = route.params;
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    trackScreenView('[ScreenName]', { from: '[ParentScreen]' });
  }, []);

  // Fetch data
  const {
    data: items = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['[queryKey]', /* dependencies */],
    queryFn: async () => {
      console.log('🔍 [[ScreenName]] Fetching data...');
      const { data, error } = await supabase
        .from('[table_name]')
        .select('*')
        // Add filters, joins, ordering
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [[ScreenName]] Error:', error);
        throw error;
      }

      console.log('✅ [[ScreenName]] Loaded', data?.length || 0, 'items');
      return data as [DataType][];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Computed values with useMemo
  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter(item => /* filter logic */);
  }, [items, filter]);

  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter(i => i.status === 'completed').length;
    return { total, completed };
  }, [items]);

  return (
    <BaseScreen
      scrollable={true}
      loading={isLoading}
      error={error ? 'Failed to load data' : null}
      empty={!isLoading && items.length === 0}
      emptyBody="No data available"
      onRetry={refetch}
    >
      <Col sx={{ p: 'md' }} gap="md">
        {/* Header Card */}
        <Card variant="elevated">
          <CardContent>
            <T variant="title" weight="bold" style={{ marginBottom: Spacing.xs }}>
              [Screen Title]
            </T>
            <T variant="body" color="textSecondary">
              [Description]
            </T>

            {/* Stats Summary */}
            <Row spaceBetween style={{ marginTop: Spacing.md }}>
              <View style={styles.statBox}>
                <T variant="display" weight="bold" style={{ fontSize: 28, color: Colors.primary }}>
                  {stats.total}
                </T>
                <T variant="caption" color="textSecondary">Total</T>
              </View>
              {/* Add more stat boxes */}
            </Row>
          </CardContent>
        </Card>

        {/* Filter Buttons */}
        <Row style={{ flexWrap: 'wrap', gap: Spacing.xs }}>
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            onPress={() => setFilter('all')}
          >
            All
          </Button>
          {/* Add more filter buttons */}
        </Row>

        {/* Items List */}
        <Col gap="sm">
          {filteredItems.map(item => (
            <Card key={item.id} variant="elevated">
              <CardContent>
                <Row spaceBetween centerV>
                  <T variant="body" weight="semiBold">
                    {item.title}
                  </T>
                  <Badge variant="info" label={item.status} />
                </Row>

                <T variant="body" color="textSecondary" style={{ marginTop: Spacing.xs }}>
                  {item.description}
                </T>

                {/* Action buttons if needed */}
                <Row style={{ marginTop: Spacing.sm, gap: Spacing.xs }}>
                  <Button
                    variant="primary"
                    onPress={() => {
                      trackAction('view_detail', '[ScreenName]', { id: item.id });
                      safeNavigate('[DetailScreen]', { id: item.id });
                    }}
                  >
                    View Details
                  </Button>
                </Row>
              </CardContent>
            </Card>
          ))}
        </Col>

        {/* Empty State for Filter */}
        {filteredItems.length === 0 && items.length > 0 && (
          <Card variant="outlined">
            <CardContent>
              <View style={{ alignItems: 'center', paddingVertical: Spacing.lg }}>
                <T variant="body" color="textSecondary">
                  No {filter === 'all' ? '' : filter} items found
                </T>
              </View>
            </CardContent>
          </Card>
        )}
      </Col>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
});

export default [ScreenName];
```

### Step 4: Create Database Table (If Needed)

Use this migration template:

```sql
-- Create [table_name] table
CREATE TABLE IF NOT EXISTS public.[table_name] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.profiles(id),
  teacher_id UUID REFERENCES public.profiles(id),

  -- Add specific columns
  title TEXT NOT NULL,
  content TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'archived')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_[table_name]_student_id ON public.[table_name](student_id);
CREATE INDEX IF NOT EXISTS idx_[table_name]_parent_id ON public.[table_name](parent_id);

-- RLS Policies
ALTER TABLE public.[table_name] ENABLE ROW LEVEL SECURITY;

-- Parents can view their data
CREATE POLICY "Parents can view their [data]"
  ON public.[table_name] FOR SELECT
  USING (
    parent_id = auth.uid() OR
    student_id IN (
      SELECT student_id FROM public.parent_child_relationships
      WHERE parent_id = auth.uid() AND is_active = true
    )
  );

-- Teachers can view their data
CREATE POLICY "Teachers can view their [data]"
  ON public.[table_name] FOR SELECT
  USING (teacher_id = auth.uid());

-- Teachers can create data
CREATE POLICY "Teachers can create [data]"
  ON public.[table_name] FOR INSERT
  WITH CHECK (teacher_id = auth.uid());
```

### Step 5: Add Sample Data

Insert realistic test data:

```sql
-- Insert sample data for [table_name]
WITH student_data AS (
  SELECT id FROM public.students WHERE full_name = 'Rahul Sharma' LIMIT 1
),
parent_data AS (
  SELECT id FROM public.profiles WHERE role = 'parent' LIMIT 1
),
teacher_data AS (
  SELECT id FROM public.profiles WHERE role = 'teacher' LIMIT 1
)
INSERT INTO public.[table_name] (
  student_id,
  parent_id,
  teacher_id,
  title,
  content,
  status
)
SELECT
  s.id,
  p.id,
  t.id,
  title,
  content,
  status
FROM student_data s, parent_data p, teacher_data t,
(VALUES
  ('Sample Title 1', 'Sample content 1', 'pending'),
  ('Sample Title 2', 'Sample content 2', 'completed'),
  ('Sample Title 3', 'Sample content 3', 'pending')
) AS sample_data(title, content, status)
RETURNING id, title, status;
```

### Step 6: Apply Acceptance Checklist

Before marking complete, verify ALL items:

#### Core Requirements
- [ ] Real Supabase data (no mock arrays)
- [ ] BaseScreen wrapper with all states (loading, error, empty)
- [ ] All icon buttons have accessibilityLabel
- [ ] FlatList optimized with keyExtractor, getItemLayout (if list screen)
- [ ] Components memoized (useMemo for computed values)
- [ ] Analytics events tracked (trackScreenView, trackAction)
- [ ] Safe navigation used (safeNavigate)
- [ ] Nullish coalescing (??) for all numeric values
- [ ] TypeScript errors: 0
- [ ] ESLint warnings: 0

#### MD3 Compliance (For Student Screens)
- [ ] StudentTopBar integrated (64dp height, hamburger menu, overflow)
- [ ] StudentBottomNav integrated (80dp height, 5 destinations)
- [ ] Navigation drawer accessible (360dp, left-to-right slide)
- [ ] Cards use MD3 variants (elevated/filled/outlined, 12dp corners)
- [ ] Buttons use MD3 variants (filled/filled-tonal/outlined/text)
- [ ] Elevation follows MD3 (0-4dp scale)
- [ ] Typography follows MD3 (Title Large 22sp, Body Medium 14sp)
- [ ] State layers applied (0.08 hover, 0.12 pressed)
- [ ] Active states use primary container (pill-shaped)
- [ ] Icons are 24dp size throughout

#### Student-Specific Requirements
- [ ] StudentContext integrated (useStudent hook)
- [ ] Appropriate student hooks used (useStudentProgress, etc.)
- [ ] Real-time subscriptions working (if applicable)
- [ ] Student ID passed to all queries
- [ ] Badge notifications showing unread counts (if applicable)

#### Testing
- [ ] Tested on real device
- [ ] No console errors in logs
- [ ] Pull-to-refresh works
- [ ] Error retry works
- [ ] Empty states display correctly
- [ ] Loading states display correctly
- [ ] Navigation drawer opens/closes smoothly
- [ ] Bottom navigation switches screens correctly
- [ ] Hardware back button handled properly

## 🎯 COMMON PATTERNS TO FOLLOW

### Category Filtering
```typescript
const [categoryFilter, setCategoryFilter] = useState<CategoryType>('all');

const filteredItems = useMemo(() => {
  if (categoryFilter === 'all') return items;
  return items.filter(i => i.category === categoryFilter);
}, [items, categoryFilter]);

// Filter buttons
<Row style={{ flexWrap: 'wrap', gap: Spacing.xs }}>
  {(['all', 'category1', 'category2'] as CategoryType[]).map(category => (
    <Button
      key={category}
      variant={categoryFilter === category ? 'primary' : 'outline'}
      onPress={() => setCategoryFilter(category)}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </Button>
  ))}
</Row>
```

### Stats Calculation
```typescript
const stats = useMemo(() => {
  const total = items.length;
  const completed = items.filter(i => i.status === 'completed').length;
  const pending = items.filter(i => i.status === 'pending').length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  return { total, completed, pending, percentage };
}, [items]);
```

### Progress Bars
```typescript
import { ProgressBar } from 'react-native-paper';

<ProgressBar
  progress={(percentage ?? 0) / 100}  // Note: Use ?? not ||
  color={Colors.primary}
  style={{ height: 8, borderRadius: 4 }}
/>
```

### Days Remaining
```typescript
const getDaysRemaining = (targetDate: string | null) => {
  if (!targetDate) return null;
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
```

### Expandable Content
```typescript
const [expandedId, setExpandedId] = useState<string | null>(null);

<Button
  variant="text"
  onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
>
  {expandedId === item.id ? '▼ Hide' : '▶ Show'} Details
</Button>

{expandedId === item.id && (
  <View>{/* Expanded content */}</View>
)}
```

## ⚠️ ERRORS TO AVOID

### 1. toFixed Crash
```typescript
// ❌ WRONG
{(value || 0).toFixed(1)}  // Crashes if value is null

// ✅ CORRECT
{(value ?? 0).toFixed(1)}  // Safe
```

### 2. Missing RLS Policies
```typescript
// Always check RLS errors in console:
// "permission denied for table X"
// Solution: Add proper RLS policies in migration
```

### 3. Undefined Route Params
```typescript
// ❌ WRONG
const { childId } = route.params;  // May be undefined

// ✅ CORRECT - Handle in navigation types
type ParentStackParamList = {
  ScreenName: { childId: string; childName?: string };
};
```

### 4. Query Key Dependencies
```typescript
// ❌ WRONG - Missing dependencies
queryKey: ['messages']

// ✅ CORRECT - Include all dependencies
queryKey: ['messages', parentId, childId]
```

### 5. Non-existent Table References
```typescript
// Before referencing a table in RLS or query:
// 1. Check if table exists
// 2. Verify foreign key references
// 3. Test query in Supabase dashboard
```

## 📊 IMPLEMENTATION CHECKLIST

When implementing a screen, follow this order:

1. [ ] Read PROJECT_MEMORY.md and relevant docs
2. [ ] Gather requirements from user
3. [ ] Check if database table exists
4. [ ] Create migration if needed
5. [ ] Add sample data
6. [ ] Implement screen with template
7. [ ] Add TypeScript types
8. [ ] Test data fetching
9. [ ] Add filtering/sorting if needed
10. [ ] Apply acceptance checklist
11. [ ] Test in app
12. [ ] Document in PHASE_X_COMPLETE.md

## 🚀 OUTPUT FORMAT

After implementation, provide:

1. **Summary** of what was created
2. **Database changes** (tables, migrations, sample data)
3. **Screen features** implemented
4. **Testing instructions** for user
5. **Known limitations** or TODO items

---

## 📊 VALIDATION REPORTS TO REVIEW

Before starting screen recreation, verify foundation status by reviewing these reports:

### 1. PHASE_0_VALIDATION_REPORT.md
**Location:** `C:\PC\OLD\student_analysis\PHASE_0_VALIDATION_REPORT.md`

**What to Check:**
- ✅ TypeScript: 0 errors in all Phase 0 components
- ✅ File existence: All 24 component files found
- ✅ Import paths: All imports valid
- ✅ Dependencies: React Query, Supabase, RN components available

**Status Indicators:**
- ✅ GREEN: All validations pass → Proceed with confidence
- ⚠️ YELLOW: Minor warnings → Review before proceeding
- ❌ RED: Critical failures → Fix before recreation

### 2. MD3_COMPLIANCE_GAP_ANALYSIS.md
**Location:** `C:\PC\OLD\student_analysis\MD3_COMPLIANCE_GAP_ANALYSIS.md`

**What to Check:**
- 📊 Current compliance: ___% (should be 90%+ for production)
- 🎯 Target: 95%+ for production recreation
- 📋 Gap categories: Typography, Elevation, Spacing, State Layers, Icons
- ✅ Remediation plan: Phase 2 Weeks 1-4 progress

**Compliance Levels:**
```
< 75%  → NOT READY - Significant gaps remain
75-89% → IN PROGRESS - Wait for Phase 2 completion
90-94% → READY - Can proceed with awareness of minor gaps
95%+   → OPTIMAL - Full MD3 compliance achieved
```

### 3. TODO_PHASE_0_AND_1.md Status Check
**Location:** `C:\PC\OLD\student_analysis\TODO_PHASE_0_AND_1.md`

**What to Check:**
- **Phase 0:** Should be CODE COMPLETE (24 components ✅)
  - [ ] 9 Core UI Components (Week 1)
  - [ ] 3 Navigation Components (Week 2)
  - [ ] 6 Student Hooks + Context (Week 3)
  - [ ] 5 Live Class Components (Week 4)

- **Phase 1:** Should be COMPLETE (4 documentation guides ✅)
  - [ ] SKILL.md updated
  - [ ] STUDENT_COMPONENTS_GUIDE.md created
  - [ ] STUDENT_HOOKS_GUIDE.md created
  - [ ] STUDENT_BEST_PRACTICES.md created

- **Phase 2:** Check current progress
  - [ ] Week 1: MD3 Typography, BaseScreen, QuizInterface (✅ COMPLETE)
  - [ ] Week 2: Tonal Elevation, Typography Pass (⏸️ In Progress)
  - [ ] Week 3: Spacing Audit, State Layers (⏸️ Pending)
  - [ ] Week 4: Device Testing (Android + iOS) (⏸️ Pending)

**Decision Matrix:**
```
Phase Status              | Action
--------------------------|----------------------------------
Phase 0 Incomplete        | ❌ STOP - Complete Phase 0 first
Phase 1 Incomplete        | ⚠️ Can proceed but harder without docs
Phase 2 Week 1 Complete   | ⚠️ Can proceed with 75% MD3 compliance
Phase 2 Week 3 Complete   | ✅ Can proceed with 90% MD3 compliance
Phase 2 Week 4 Complete   | ✅ OPTIMAL - Full validation complete
```

### 4. WEEK_1_VALIDATION_REPORT.md
**Location:** `C:\PC\OLD\student_analysis\WEEK_1_VALIDATION_REPORT.md`

**What to Check:**
- ✅ 9 core UI components validated
- ✅ TypeScript errors resolved
- ✅ MD3 specifications met for atoms

### 5. WEEK_2_NAVIGATION_COMPLETE.md
**Location:** `C:\PC\OLD\student_analysis\WEEK_2_NAVIGATION_COMPLETE.md`

**What to Check:**
- ✅ 3 navigation components validated
- ✅ Safe-area handling verified
- ✅ Navigation patterns work

**Pre-Recreation Blockers (DO NOT PROCEED IF):**
- ❌ TypeScript errors > 0 in Phase 0 components
- ❌ Phase 0 components missing (< 24 files)
- ❌ MD3 compliance < 75% (too many gaps)
- ❌ Critical validation failures unresolved
- ❌ Phase 2 Week 4 incomplete AND you need device-tested components

**Recommended Wait Conditions:**
- ⏸️ MD3 compliance < 90% → Wait for Phase 2 Weeks 2-3
- ⏸️ Phase 2 device testing pending → Wait for Week 4 OR accept rework risk

---

## 💡 EXAMPLE USAGE

### Example 1: Parent Screen

User: "Create a MessagesListScreen to show parent-teacher messages"

Assistant response flow:
1. Read PROJECT_MEMORY.md
2. Ask: "Should this show messages for all children or specific child?"
3. Check if messages table exists
4. Create migration if needed
5. Implement screen following parent template
6. Add sample messages
7. Test with Supabase query
8. Apply acceptance checklist
9. Provide summary and testing instructions

### Example 2: Student Screen

User: "Create StudentAssignmentsScreen to show assignments"

Assistant response flow:
1. Read PROJECT_MEMORY.md
2. **Check prerequisites:** Verify foundation components exist
3. If prerequisites missing:
   - Inform user: "Student screens require Phase 0 foundation (132-166 hours)"
   - Refer to `TODO_PHASE_0_AND_1.md`
   - DO NOT proceed until foundation is complete
4. If prerequisites complete:
   - Check if assignments table exists
   - Create migration if needed
   - Implement screen using StudentTopBar, StudentBottomNav, StudentDrawer
   - Use useStudentAssignments hook for data fetching
   - Use MD3 Card, Button, Badge components
   - Add filters (Pending, Submitted, Graded)
   - Track analytics (trackScreenView, trackAction)
   - Apply MD3 acceptance checklist
   - Test navigation drawer, bottom nav, hardware back button
   - Provide summary and testing instructions

## 🎓 STUDENT SCREEN WORKFLOW (DETAILED)

When user requests a student screen implementation, follow this exact workflow:

### Phase A: Prerequisites Verification (CRITICAL)

```bash
# Step 1: Check if foundation exists
ls C:/PC/src/components/student/atoms/        # Expect 9 files
ls C:/PC/src/components/student/navigation/  # Expect 3 files
ls C:/PC/src/hooks/student/                  # Expect 6 files
ls C:/PC/src/components/student/organisms/   # Expect 5 files
ls C:/PC/src/context/StudentContext.tsx      # Expect 1 file
```

**If ANY files are missing:**
```
❌ Cannot proceed with student screen creation.

The student screen foundation (Phase 0) must be completed first.

Missing components:
- [List missing components]

Please complete Phase 0 implementation:
1. Review: C:/PC/OLD/student_analysis/PHASE_0_AND_1_ENHANCEMENT_PLAN.md
2. Follow: C:/PC/OLD/student_analysis/TODO_PHASE_0_AND_1.md
3. Time required: 132-166 hours (3-4 weeks)

Once Phase 0 is complete, I can create student screens efficiently (8-12 hours per screen vs 20-30 hours without foundation).
```

### Phase B: Implementation (If Prerequisites Complete)

```typescript
// Step 1: Gather Requirements
Screen name: [e.g., StudentAssignmentsScreen]
Purpose: [e.g., Show student assignments with filters]
Data source: [e.g., assignments table]
Hooks needed: [e.g., useStudentAssignments, useStudent]
Filters: [e.g., By status, by subject]
Real-time: [e.g., Yes/No]

// Step 2: Check Database
Query Supabase for table schema

// Step 3: Implement Screen Structure
import { StudentTopBar } from '../../components/student/navigation/StudentTopBar';
import { StudentBottomNav } from '../../components/student/navigation/StudentBottomNav';
import { useStudent } from '../../context/StudentContext';
import { useStudentAssignments } from '../../hooks/student/useStudentAssignments';

// Step 4: Use MD3 Components
import { Button, Card, Badge, Tabs, SearchBar, FilterPanel } from '../../components/student/atoms/...';

// Step 5: Implement Features
- Add StudentTopBar with screen title
- Add StudentBottomNav with current route highlighted
- Use appropriate student hook for data
- Add filters/search using MD3 components
- Track analytics
- Handle empty/loading/error states

// Step 6: Apply MD3 Acceptance Checklist
Verify all MD3 requirements (elevation, typography, state layers, etc.)

// Step 7: Test
- Test on real device
- Verify drawer opens/closes
- Verify bottom nav switches screens
- Verify hardware back button
- Verify real-time updates (if applicable)
```

### Phase C: Quality Assurance

```
✅ Acceptance Checklist:
- Core Requirements (10 items)
- MD3 Compliance (10 items)
- Student-Specific Requirements (5 items)
- Testing (9 items)

Total: 34 checklist items must pass
```

---

**Remember:**
- Quality over speed
- Every screen must pass the acceptance checklist before marking complete
- Student screens REQUIRE Phase 0 foundation - do not skip prerequisites
- MD3 compliance is mandatory for all student screens

---

## 🎉 PHASE 0 COMPLETE - STUDENT SCREENS NOW READY

**Status:** All 24 Phase 0 components are now CODE COMPLETE and ready for use!

**Date Completed:** 2025-10-29

**Documentation:**
- ✅ [STUDENT_COMPONENTS_GUIDE.md](C:/PC/OLD/STUDENT_COMPONENTS_GUIDE.md) - All 24 components with examples
- ✅ [STUDENT_HOOKS_GUIDE.md](C:/PC/OLD/STUDENT_HOOKS_GUIDE.md) - 7 hooks + context with patterns
- ✅ [STUDENT_BEST_PRACTICES.md](C:/PC/OLD/STUDENT_BEST_PRACTICES.md) - Production guidelines

---

## 📚 STUDENT COMPONENT QUICK REFERENCE

### Week 1: Core UI Components

**Location:** `OLD/src/components/student/`

**Import Examples:**
```typescript
// Atoms
import { Button } from '@/components/student/atoms/Button';
import { Card } from '@/components/student/atoms/Card';
import { Badge } from '@/components/student/atoms/Badge';

// Molecules
import { Tabs } from '@/components/student/molecules/Tabs';
import { Modal } from '@/components/student/molecules/Modal';
import { BottomSheet } from '@/components/student/molecules/BottomSheet';
import { SearchBar } from '@/components/student/molecules/SearchBar';
import { EmptyState } from '@/components/student/molecules/EmptyState';
import { LoadingState } from '@/components/student/molecules/LoadingState';

// Organisms
import { FilterPanel } from '@/components/student/organisms/FilterPanel';
```

### Week 2: Navigation Components

```typescript
import { StudentTopBar } from '@/components/student/navigation/StudentTopBar';
import { StudentDrawer } from '@/components/student/navigation/StudentDrawer';
import { StudentBottomNav } from '@/components/student/navigation/StudentBottomNav';
```

### Week 3: Context & Hooks

**Location:** `OLD/src/`

```typescript
// Context
import { useStudent } from '@/context/StudentContext';

// Hooks (all accept studentId as first parameter)
import { useStudentProgress } from '@/hooks/student/useStudentProgress';
import { useStudentSchedule } from '@/hooks/student/useStudentSchedule';
import { useStudentAssignments } from '@/hooks/student/useStudentAssignments';
import { useStudentDoubts } from '@/hooks/student/useStudentDoubts';
import { useStudentAttendance } from '@/hooks/student/useStudentAttendance';
import { useStudentNotifications } from '@/hooks/student/useStudentNotifications';
```

### Week 4: Live Class Components

```typescript
import { ParticipantsList } from '@/components/student/organisms/ParticipantsList';
import { ChatPanel } from '@/components/student/organisms/ChatPanel';
import { PollsWidget } from '@/components/student/organisms/PollsWidget';
import { ScreenShareViewer } from '@/components/student/organisms/ScreenShareViewer';
import { LiveClassControls } from '@/components/student/organisms/LiveClassControls';
```

---

## 🎯 STUDENT SCREEN PATTERNS

### Pattern 1: Always Use Custom Hooks (Not Direct Supabase)

✅ **Correct:**
```typescript
import { useStudentAssignments } from '@/hooks/student/useStudentAssignments';

const { data: assignments, isLoading, error, refetch } = useStudentAssignments(studentId, {
  status: 'pending',
});
```

❌ **Wrong:**
```typescript
useEffect(() => {
  const fetch = async () => {
    const { data } = await supabase.from('assignments').select();
    setAssignments(data);
  };
  fetch();
}, []);
```

**Why:** Custom hooks provide React Query caching, real-time subscriptions, and consistent error handling.

### Pattern 2: Always Use StudentContext for Profile

✅ **Correct:**
```typescript
import { useStudent } from '@/context/StudentContext';

const { student, loading } = useStudent();

if (loading) return <LoadingState />;
return <Text>Welcome, {student?.name}!</Text>;
```

❌ **Wrong:**
```typescript
const [student, setStudent] = useState(null);

useEffect(() => {
  // Manually fetching profile - don't do this!
  supabase.from('students').select()...
}, []);
```

**Why:** StudentContext provides centralized profile management with automatic caching and refetching.

### Pattern 3: Always Memoize FlatList Components

✅ **Correct:**
```typescript
const renderItem = useCallback(({ item }) => (
  <AssignmentCard item={item} onPress={handlePress} />
), [handlePress]);

const AssignmentCard = React.memo(({ item, onPress }) => (
  <Card onPress={onPress}>
    <Text>{item.title}</Text>
  </Card>
));
```

❌ **Wrong:**
```typescript
<FlatList
  renderItem={({ item }) => (
    <Card onPress={() => handlePress(item)}>
      <Text>{item.title}</Text>
    </Card>
  )}
/>
```

**Why:** Prevents unnecessary re-renders for better performance with large lists.

---

## 📋 STUDENT SCREEN ACCEPTANCE CHECKLIST

**Run this checklist for EVERY student screen before marking complete:**

### Core Requirements (10 items)
- [ ] Uses BaseScreen wrapper with all states (loading/error/empty)
- [ ] Real Supabase data via custom hooks (NO mock arrays)
- [ ] StudentContext used for profile access (useStudent hook)
- [ ] Safe navigation with trackAction before navigate
- [ ] Analytics tracked (trackScreenView in useEffect)
- [ ] All list items memoized (React.memo)
- [ ] FlatList optimized (initialNumToRender, keyExtractor, memoized renderItem)
- [ ] Callbacks memoized (useCallback for functions passed to children)
- [ ] Expensive calculations memoized (useMemo)
- [ ] No console errors or warnings in terminal/device

### MD3 Compliance (10 items)
- [ ] StudentTopBar present with screen title
- [ ] StudentBottomNav shows active route highlighted
- [ ] Uses Phase 0 MD3 components (Button, Card, Badge, Tabs, etc.)
- [ ] Follows MD3 elevation (0dp default, 2dp scrolled, 3dp FAB)
- [ ] Follows MD3 typography (Title Large 22sp, Body Medium 14sp)
- [ ] Follows MD3 spacing (8dp, 16dp, 24dp multiples)
- [ ] Follows MD3 corner radius (12dp cards, 16dp containers, 24dp buttons)
- [ ] State layers (0.08 hover, 0.12 pressed)
- [ ] Touch targets >= 48dp minimum
- [ ] Colors from LightTheme only (NO hardcoded #colors)

### Student-Specific Requirements (5 items)
- [ ] Uses appropriate hook (useStudentProgress, useStudentAssignments, etc.)
- [ ] Handles real-time updates via hook subscriptions (if applicable)
- [ ] Navigation drawer opens/closes correctly
- [ ] Bottom navigation switches screens correctly
- [ ] Hardware back button handled (Android)

### Accessibility (5 items)
- [ ] All interactive elements have accessibilityLabel
- [ ] accessibilityRole set (button, tab, header, link)
- [ ] accessibilityHint provided for complex actions
- [ ] Screen reader friendly (test with TalkBack)
- [ ] Keyboard navigation works

### Testing (4 items)
- [ ] Tested on real Android device
- [ ] Pull-to-refresh works
- [ ] All buttons responsive with haptic feedback
- [ ] TypeScript: 0 errors (npx tsc --noEmit --skipLibCheck)

**Total: 34 items must pass**

---

## 🚀 QUICK START: Creating Student Screens

### Step 1: Choose Your Screen Type

- **List Screen** (Assignments/Classes/Doubts) → Use List Template
- **Dashboard** (Overview with cards) → Use Dashboard Template
- **Live Class** (Real-time features) → Use Live Class Template
- **Detail Screen** (Single item view) → Build from components
- **Form Screen** (Submission/Profile) → Use Modal + Button components

### Step 2: Set Up Imports

```typescript
// Base
import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Shared
import { BaseScreen } from '@/components/shared/BaseScreen';

// Student Components
import { StudentTopBar, StudentBottomNav } from '@/components/student/navigation';
import { Card, Button, Badge, Tabs, SearchBar, EmptyState } from '@/components/student';

// Context & Hooks
import { useStudent } from '@/context/StudentContext';
import { useStudentAssignments } from '@/hooks/student/useStudentAssignments';

// Utils
import { safeNavigate } from '@/utils/navigationService';
import { trackScreenView, trackAction } from '@/utils/navigationAnalytics';
```

### Step 3: Implement Screen Structure

```typescript
export function YourScreen() {
  const navigation = useNavigation();
  const { student } = useStudent();

  // Data
  const { data, isLoading, error, refetch } = useStudentAssignments(student?.id);

  // Analytics
  useEffect(() => {
    trackScreenView('YourScreen');
  }, []);

  // Handlers (memoized)
  const handlePress = useCallback((item) => {
    trackAction('action_name', 'YourScreen', { id: item.id });
    safeNavigate('DetailScreen', { id: item.id });
  }, []);

  return (
    <BaseScreen loading={isLoading} error={error} empty={!data}>
      <StudentTopBar title="Your Title" onMenuPress={() => navigation.openDrawer()} />
      {/* Your content */}
      <StudentBottomNav activeRoute="YourScreen" navigationItems={[...]} />
    </BaseScreen>
  );
}
```

### Step 4: Apply Acceptance Checklist

Run through all 34 checklist items above.

### Step 5: Read Documentation

- **Components:** [STUDENT_COMPONENTS_GUIDE.md](C:/PC/OLD/STUDENT_COMPONENTS_GUIDE.md)
- **Hooks:** [STUDENT_HOOKS_GUIDE.md](C:/PC/OLD/STUDENT_HOOKS_GUIDE.md)
- **Best Practices:** [STUDENT_BEST_PRACTICES.md](C:/PC/OLD/STUDENT_BEST_PRACTICES.md)

---

## ⚠️ COMMON MISTAKES TO AVOID

### 1. Using Mock Data
❌ `const items = [{ id: '1', title: 'Test' }];`
✅ `const { data: items } = useStudentAssignments(studentId);`

### 2. Direct Supabase Queries
❌ `useEffect(() => { supabase.from('table').select()... }, []);`
✅ `const { data } = useStudentAssignments(studentId);`

### 3. Not Using BaseScreen
❌ `{isLoading && <Spinner />} {data && <Content />}`
✅ `<BaseScreen loading={isLoading} empty={!data}><Content /></BaseScreen>`

### 4. Not Memoizing
❌ `<FlatList renderItem={({ item }) => <Card />} />`
✅ `const renderItem = useCallback(...); <FlatList renderItem={renderItem} />`

### 5. Hardcoded Colors
❌ `backgroundColor: '#1976D2'`
✅ `backgroundColor: LightTheme.Primary`

### 6. Skipping Analytics
❌ `navigation.navigate('Screen')`
✅ `trackAction('view', 'List'); safeNavigate('Screen');`

### 7. Not Handling States
❌ `{data ? <Content /> : null}`
✅ `<BaseScreen loading error empty><Content /></BaseScreen>`

---

## 📖 DETAILED EXAMPLE: Recreating StudentDashboard Using student_analysis/

### Scenario
User requests: **"Create StudentDashboard screen"**

---

### ✅ CORRECT WORKFLOW (Using student_analysis/ Files)

#### Step 1: Read ANALYSIS_TRACKER.md
```
Assistant: "Let me check the analysis files first..."

[Reads: C:\PC\OLD\student_analysis\ANALYSIS_TRACKER.md]

Found: StudentDashboard.tsx
- Features: 126+ features
- Lines: 1638 lines
- Complexity: ⭐⭐⭐⭐⭐ (Very High)
- Analysis File: StudentDashboard_ANALYSIS.md
- Priority: P1 (Core Dashboard - Highest priority)
- Status: Fully analyzed (2025-10-28)

Initial Assessment:
- This is the highest-priority screen but very complex
- 126+ features means this will take significant effort
- Need to verify prerequisites before starting
```

#### Step 2: Read StudentDashboard_ANALYSIS.md
```
[Reads: C:\PC\OLD\student_analysis\StudentDashboard_ANALYSIS.md]

Extracted Information:

SECTIONS (7 major sections):
1. Header with student profile
2. Stats overview (attendance, progress, performance)
3. Progress tracking cards
4. Upcoming classes schedule
5. Pending assignments
6. Recent notifications
7. Quick actions menu

NAVIGATION TARGETS (18+ screens):
- ClassDetailScreen (view class details)
- AssignmentDetailScreen (view assignment)
- ProgressDetailScreen (detailed progress)
- AttendanceScreen (attendance calendar)
- LiveClassScreen (join live class)
- ... 13 more targets

COMPONENTS NEEDED (Phase 0):
- Card (elevated variant)
- Button (filled, outlined variants)
- Badge (notification counts)
- Tabs (for switching views)
- ProgressBar (for completion tracking)
- Charts (for performance visualization)

HOOKS REQUIRED:
- useStudentProgress (overall and subject-wise)
- useStudentSchedule (upcoming classes)
- useStudentAssignments (pending assignments)
- useStudentAttendance (attendance percentage)
- useStudentNotifications (unread count)

SUPABASE TABLES:
- students (profile data)
- classes (class schedule)
- assignments (assignment data)
- progress_tracking (completion data)
- attendance (attendance records)
- notifications (notification data)

REAL-TIME FEATURES:
- Notifications (real-time subscription)
- Live class updates (when class goes live)

COMPLEXITY NOTES:
- Very high feature density
- Multiple data sources
- Real-time subscriptions
- Complex state management
- 18+ navigation targets to handle
```

#### Step 3: Verify Prerequisites
```
Assistant: "Before implementing, let me check if all prerequisites are ready..."

[Checks: TODO_PHASE_0_AND_1.md]
Phase 0: ✅ CODE COMPLETE
- 9 Core UI components ✅
- 3 Navigation components ✅
- 6 Student hooks ✅
- 5 Live class components ✅

Phase 1: ✅ COMPLETE
- Documentation guides ✅

Phase 2: 🔄 IN PROGRESS
- Week 1: ✅ COMPLETE (Typography, BaseScreen, QuizInterface)
- Week 2: ⏸️ PENDING (Tonal Elevation, Typography Pass)
- Week 3: ⏸️ PENDING (Spacing Audit, State Layers)
- Week 4: ⏸️ PENDING (Device Testing)

[Checks: PHASE_0_VALIDATION_REPORT.md]
- TypeScript errors: ✅ 0 errors
- Component files: ✅ All 24 exist
- Import paths: ✅ All valid

[Checks: MD3_COMPLIANCE_GAP_ANALYSIS.md]
- Current compliance: 75%
- Target compliance: 95%+
- Gap analysis: Typography pass incomplete, elevation system partial
```

#### Step 4: Consult User with Recommendation
```
Assistant:

"I found the StudentDashboard analysis. Here's what I discovered:

**Scope:**
- 126+ features across 7 major sections
- Complexity: ⭐⭐⭐⭐⭐ (Very High)
- Estimated effort: 12-18 hours (vs 24-30 without analysis)

**Current Status:**
✅ Phase 0 complete: All 24 components ready
✅ Required hooks exist: useStudentProgress, useStudentSchedule, etc.
✅ TypeScript validation: 0 errors
⚠️ MD3 compliance: 75% (target: 95%+)
⏸️ Phase 2: Week 1 complete, Weeks 2-4 pending

**Recommendation:**

**Option 1 (Recommended):** Wait for Phase 2 Weeks 2-3 completion (1-2 weeks)
- MD3 compliance will reach 90-95%
- Components will be fully polished
- Fewer refactoring needs later
- Then implement: 12-18 hours

**Option 2:** Proceed now with 75% MD3 compliance
- Can start immediately
- Use current components (work fine, just not fully MD3)
- Accept potential refactoring when Phase 2 completes
- Implement: 12-18 hours + 2-4 hours refactoring later

**Which approach would you prefer?**"

[User responds: "Let's wait for Phase 2 to complete"]

Assistant: "Perfect\! I'll mark this for Phase 2 completion and we can implement it then with full MD3 compliance."
```

**Time Saved:** 2-4 hours (no redundant analysis) + avoided potential refactoring later

---

### ❌ INCORRECT WORKFLOW (NOT Using student_analysis/ Files)

#### What Happens When Analysis Files Are Ignored

```
User: "Create StudentDashboard screen"

Assistant (WRONG approach):
"I'll help you create the StudentDashboard. Let me gather requirements..."

❌ Problem 1: Redundant Analysis
- Spends 2-4 hours analyzing features manually
- Duplicates work already done in StudentDashboard_ANALYSIS.md
- May miss some of the 126+ features identified

❌ Problem 2: No Prerequisites Check
- Doesn't check Phase 2 status
- Doesn't verify MD3 compliance level (75%)
- Doesn't check TODO_PHASE_0_AND_1.md

❌ Problem 3: No Complexity Awareness
- Doesn't realize this is ⭐⭐⭐⭐⭐ (Very High complexity)
- Underestimates effort (thinks 8-10 hours, actually 24-30)
- Doesn't warn user about complexity

❌ Problem 4: Potential Refactoring
- Implements now with 75% MD3 components
- When Phase 2 completes (95% compliance), needs refactoring
- Adds 2-4 hours of rework later

Result:
- Total time: 24-30 hours (analysis + implementation + refactoring)
- Potentially incomplete features (missed features)
- User frustration from unexpected complexity
- Wasted effort on redundant analysis
```

---

### 📊 Comparison Summary

| Approach | Analysis Time | Implementation Time | Refactoring | Total Time | Feature Coverage |
|----------|--------------|---------------------|-------------|------------|------------------|
| **❌ Without student_analysis/** | 2-4 hours | 18-22 hours | 2-4 hours | **24-30 hours** | 90-95% (may miss features) |
| **✅ With student_analysis/** | 0 hours (pre-done) | 12-18 hours | 0 hours (wait for Phase 2) | **12-18 hours** | 100% (all 126+ features) |
| **Savings** | 2-4 hours | 6-4 hours | 2-4 hours | **12-12 hours** | Perfect coverage |

**Key Benefits of Using student_analysis/:**
1. ✅ **Save 12-12 hours per screen** (50% time reduction)
2. ✅ **100% feature coverage** (no missed features)
3. ✅ **Optimal timing** (wait for 95% MD3 compliance)
4. ✅ **Complexity awareness** (know effort upfront)
5. ✅ **Prerequisites verified** (Phase 0-2 status checked)

**Across 23 Analyzed Screens:**
- ✅ Total time saved: 12 hours × 23 = **276 hours saved**
- ✅ Perfect feature coverage on all screens
- ✅ No refactoring needed (waited for Phase 2 completion)

---

**Status:** Ready for production student screen implementation
**Phase 0:** All 24 components ready!
**Documentation:** 3 comprehensive guides created
**Analysis Files:** 23 screens fully analyzed
**Last Updated:** 2025-11-01

# Phase 0 & Phase 1 Enhancement Plan - Material Design 3 Student Screens

## 🎯 Objective

Create production-ready foundation following **Material Design 3 (MD3)** principles for systematic student screen recreation, ensuring:
- **Consistent MD3 navigation** (Top Bar, Sidebar, Bottom Bar)
- **Reusable UI components library** with MD3 compliance
- **Student-specific hooks** for data management
- **Feature components** for complex student functionality
- **Zero code duplication** across 21 student screens

---

## 📐 Material Design 3 Navigation Architecture

### 1. Top App Bar (MD3 Standard)

**Design:**
```
┌─────────────────────────────────────────┐
│  ☰   Screen Title            ⋮          │
└─────────────────────────────────────────┘
```

**Specifications:**
- **Left:** Hamburger menu icon (☰) - Opens navigation drawer
- **Center:** Screen title (dynamic per screen)
- **Right:** Three-dot overflow menu (⋮) - Screen-specific actions
- **Height:** 64dp (mobile), 56dp (tablet)
- **Elevation:** 0-4dp (elevation-1 on scroll)
- **Background:** Surface color (MD3 theme)
- **Typography:** Title Large (22sp, medium weight)

**Component:** `react-native-paper` Appbar.Header

---

### 2. Navigation Drawer (Sidebar) - Left to Right

**Design:**
```
┌──────────────────┐
│  [Profile Card]  │
│  ─────────────   │
│  🏠 Dashboard    │
│  📅 Schedule     │
│  📚 Assignments  │
│  ❓ Doubts       │
│  🎥 Live Classes │
│  🤖 AI Tutor     │
│  📖 Library      │
│  📊 Progress     │
│  🏆 Achievements │
│  👥 Peer Network │
│  ⚙️  Settings    │
│  🚪 Logout       │
└──────────────────┘
```

**Specifications:**
- **Width:** 360dp (standard), 256dp (compact)
- **Slide direction:** Left to right
- **Background:** Surface color
- **Items:**
  - Profile header (student name, photo, class)
  - Navigation items (icon + label)
  - Dividers between sections
  - Active state highlighting (primary container)
- **Typography:** Label Large (14sp)
- **Icon size:** 24dp
- **Item height:** 56dp

**Component:** `react-native-paper` Drawer

---

### 3. Bottom Navigation Bar (MD3)

**Design:**
```
┌─────────────────────────────────────────┐
│  🏠      📅      📚      🎥      👤    │
│  Home  Schedule  Study  Live    More   │
└─────────────────────────────────────────┘
```

**Specifications:**
- **Height:** 80dp
- **Items:** 5 navigation destinations (max)
- **Icon size:** 24dp
- **Typography:** Label Medium (12sp)
- **Active state:**
  - Container: Primary container (filled pill shape)
  - Icon: Primary color
  - Label: On-primary-container color
- **Inactive state:**
  - Icon: On-surface-variant
  - Label: On-surface-variant
- **Elevation:** 3dp
- **Background:** Surface color

**Component:** `react-native-paper` BottomNavigation

**Destinations:**
1. **Home** - Student Dashboard (main entry)
2. **Schedule** - Timetable and upcoming classes
3. **Study** - Assignments, Library, AI Tutor (hub)
4. **Live** - Live classes and recordings
5. **More** - Progress, Doubts, Settings, Profile

---

## 🏗️ PHASE 0: Foundation (3-4 Weeks)

### Objective
Build MD3-compliant infrastructure that all 21 student screens will use.

---

### Week 1: Core UI Components (MD3)

#### 1.1 Enhanced Button Component (4 hours)
**File:** `src/components/ui/Button.tsx`

**Variants (MD3):**
- `filled` - Primary action (elevated, primary color)
- `filled-tonal` - Secondary action (tonal, secondary container)
- `outlined` - Tertiary action (outlined, no fill)
- `text` - Low emphasis (text only, no container)
- `elevated` - Important action (shadow elevation)

**Props:**
- `variant`: 'filled' | 'filled-tonal' | 'outlined' | 'text' | 'elevated'
- `size`: 'small' | 'medium' | 'large'
- `icon`: Icon component (left side)
- `disabled`: boolean
- `loading`: boolean
- `fullWidth`: boolean
- `onPress`: () => void

**MD3 Specs:**
- Height: 40dp (medium), 32dp (small), 48dp (large)
- Corner radius: 20dp (fully rounded)
- Typography: Label Large (14sp, medium weight)
- Elevation: 1dp (elevated), 0dp (others)
- State layers: 0.08 (hovered), 0.12 (pressed), 0.12 (disabled)

---

#### 1.2 Card Component (6 hours)
**File:** `src/components/ui/Card.tsx`

**Variants (MD3):**
- `elevated` - Default card with shadow (elevation-1)
- `filled` - Tonal container (surface-variant)
- `outlined` - Bordered card (outline-variant)

**Props:**
- `variant`: 'elevated' | 'filled' | 'outlined'
- `onPress`: Optional, makes card interactive
- `children`: React.ReactNode
- `sx`: Style overrides

**MD3 Specs:**
- Corner radius: 12dp
- Elevation: 1dp (elevated), 0dp (filled/outlined)
- Padding: 16dp
- Border width: 1dp (outlined only)

**Sub-components:**
- `CardHeader` - Title, subtitle, trailing icon
- `CardContent` - Main content area
- `CardActions` - Bottom action buttons

---

#### 1.3 Badge Component (3 hours)
**File:** `src/components/ui/Badge.tsx`

**Variants (MD3):**
- `info` - Informational (primary container)
- `success` - Positive state (tertiary container, green)
- `warning` - Cautionary (error container, orange)
- `error` - Critical (error container, red)
- `neutral` - Default (surface-variant)

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'error' | 'neutral'
- `label`: string
- `size`: 'small' | 'medium'

**MD3 Specs:**
- Height: 20dp (small), 24dp (medium)
- Corner radius: 4dp
- Padding: 4dp horizontal, 2dp vertical
- Typography: Label Small (11sp, medium weight)

---

#### 1.4 Tabs Component (8 hours)
**File:** `src/components/ui/Tabs.tsx`

**Types:**
- Primary Tabs (full width, equal distribution)
- Secondary Tabs (scrollable, dynamic width)

**Props:**
- `tabs`: Array<{ key: string; label: string; icon?: string }>
- `activeTab`: string
- `onTabChange`: (key: string) => void
- `variant`: 'primary' | 'secondary'

**MD3 Specs:**
- Height: 48dp
- Typography: Title Small (14sp, medium weight)
- Active indicator: 3dp height, primary color, full width
- Inactive: On-surface-variant
- Active: Primary color
- Container: Surface color

---

#### 1.5 Modal Components (10 hours)
**File:** `src/components/ui/Modal.tsx`

**Types:**

**A. Bottom Sheet**
- Slides from bottom
- Rounded top corners (28dp)
- Scrim overlay (60% opacity)
- Drag handle (optional)
- Max height: 80% viewport

**B. Full Screen Modal**
- Covers entire screen
- Top app bar with close button
- Scrollable content
- Action buttons in footer

**C. Alert Dialog**
- Centered overlay
- 280dp wide (mobile)
- Corner radius: 28dp
- Title + Message + Actions
- Elevation: 3dp

**Props (Bottom Sheet):**
- `visible`: boolean
- `onClose`: () => void
- `title`: string
- `children`: React.ReactNode
- `snapPoints`: string[] (e.g., ['25%', '50%', '90%'])

**Props (Alert Dialog):**
- `visible`: boolean
- `title`: string
- `message`: string
- `actions`: Array<{ label: string; onPress: () => void; variant?: string }>

---

#### 1.6 Search Bar Component (4 hours)
**File:** `src/components/ui/SearchBar.tsx`

**Props:**
- `query`: string
- `onQueryChange`: (query: string) => void
- `placeholder`: string
- `onClear`: () => void
- `leading`: Icon (magnifying glass)
- `trailing`: Icon (clear button when query exists)

**MD3 Specs:**
- Height: 56dp
- Corner radius: 28dp (fully rounded)
- Background: Surface-variant
- Typography: Body Large (16sp)
- Icon size: 24dp
- Padding: 16dp horizontal

---

#### 1.7 Filter Panel Component (6 hours)
**File:** `src/components/ui/FilterPanel.tsx`

**Props:**
- `filters`: Array<{ key: string; label: string; options: string[] }>
- `selected`: Record<string, string[]>
- `onFilterChange`: (key: string, values: string[]) => void

**Features:**
- Chip-based filter selection
- Multi-select support
- Clear all button
- Active filter count badge

**MD3 Specs:**
- Filter chips: 32dp height, 8dp corner radius
- Active: Primary container + on-primary-container text
- Inactive: Surface-variant + on-surface-variant text

---

#### 1.8 Empty State Component (3 hours)
**File:** `src/components/ui/EmptyState.tsx`

**Props:**
- `icon`: Icon component or emoji
- `title`: string
- `description`: string
- `action`: Optional button config { label, onPress }

**MD3 Specs:**
- Center-aligned content
- Icon size: 64dp
- Title: Headline Small (24sp)
- Description: Body Medium (14sp, on-surface-variant)
- Vertical spacing: 16dp between elements

---

#### 1.9 Loading State Component (3 hours)
**File:** `src/components/ui/LoadingState.tsx`

**Variants:**
- `spinner` - Circular progress indicator
- `skeleton` - Placeholder blocks (shimmer effect)
- `linear` - Linear progress bar at top

**Props:**
- `variant`: 'spinner' | 'skeleton' | 'linear'
- `message`: Optional loading message
- `count`: Number of skeleton items (skeleton variant)

**MD3 Specs:**
- Spinner: 48dp diameter, primary color
- Skeleton: Surface-variant background, shimmer animation
- Linear: 4dp height, primary color, indeterminate

---

### Week 2: Navigation Components (MD3)

#### 2.1 Student Top App Bar (6 hours)
**File:** `src/components/student/StudentTopBar.tsx`

**Props:**
- `title`: string
- `onMenuPress`: () => void (opens drawer)
- `actions`: Array<{ icon: string; onPress: () => void; label: string }>
- `scrollBehavior`: 'pin' | 'scroll' | 'elevate-on-scroll'

**Features:**
- Hamburger menu button (left)
- Dynamic title (center)
- Overflow menu (right) with actions
- Elevation on scroll (0 → 1dp)

**Implementation:**
```typescript
import { Appbar } from 'react-native-paper';

// Left: Menu button
<Appbar.Action icon="menu" onPress={onMenuPress} />

// Center: Title
<Appbar.Content title={title} />

// Right: Actions + overflow
{actions.slice(0, 2).map(action => (
  <Appbar.Action icon={action.icon} onPress={action.onPress} />
))}
{actions.length > 2 && (
  <Appbar.Action icon="dots-vertical" onPress={showOverflowMenu} />
)}
```

---

#### 2.2 Student Navigation Drawer (10 hours)
**File:** `src/components/student/StudentDrawer.tsx`

**Props:**
- `visible`: boolean
- `onClose`: () => void
- `studentName`: string
- `studentPhoto`: string
- `currentRoute`: string

**Sections:**

**Header (Profile Card):**
- Student photo (circular, 72dp)
- Student name (Headline Small)
- Class/Grade info (Body Medium)
- Background: Primary container

**Navigation Items:**
```typescript
const navigationItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home', route: 'StudentDashboard' },
  { key: 'schedule', label: 'My Schedule', icon: 'calendar-month', route: 'ScheduleScreen' },
  { key: 'assignments', label: 'Assignments', icon: 'file-document', route: 'AssignmentsList' },
  { key: 'doubts', label: 'Ask Doubts', icon: 'help-circle', route: 'DoubtsList' },
  { divider: true },
  { key: 'live', label: 'Live Classes', icon: 'video', route: 'LiveClassesList' },
  { key: 'ai', label: 'AI Tutor', icon: 'robot', route: 'AITutorScreen' },
  { key: 'library', label: 'Study Library', icon: 'book-open-variant', route: 'StudyLibrary' },
  { divider: true },
  { key: 'progress', label: 'My Progress', icon: 'chart-line', route: 'ProgressDetail' },
  { key: 'achievements', label: 'Achievements', icon: 'trophy', route: 'GamifiedHub' },
  { key: 'peers', label: 'Peer Network', icon: 'account-group', route: 'PeerLearning' },
  { divider: true },
  { key: 'settings', label: 'Settings', icon: 'cog', route: 'Settings' },
  { key: 'logout', label: 'Logout', icon: 'logout', action: 'logout' },
];
```

**Active State:**
- Background: Primary container (8% opacity)
- Icon + Text: Primary color
- Left border indicator: 3dp width, primary color

---

#### 2.3 Student Bottom Navigation (8 hours)
**File:** `src/components/student/StudentBottomNav.tsx`

**Props:**
- `activeRoute`: string
- `onNavigate`: (route: string) => void

**Destinations:**
```typescript
const destinations = [
  {
    key: 'home',
    label: 'Home',
    icon: 'home',
    focusedIcon: 'home',
    route: 'StudentDashboard'
  },
  {
    key: 'schedule',
    label: 'Schedule',
    icon: 'calendar-month-outline',
    focusedIcon: 'calendar-month',
    route: 'ScheduleScreen'
  },
  {
    key: 'study',
    label: 'Study',
    icon: 'school-outline',
    focusedIcon: 'school',
    badge: '3', // New assignments count
    route: 'StudyHub'
  },
  {
    key: 'live',
    label: 'Live',
    icon: 'video-outline',
    focusedIcon: 'video',
    badge: 'dot', // Live indicator
    route: 'LiveClassesList'
  },
  {
    key: 'more',
    label: 'More',
    icon: 'dots-horizontal',
    focusedIcon: 'dots-horizontal',
    route: 'MoreMenu'
  },
];
```

**Features:**
- Badge support (count or dot indicator)
- Active indicator (pill-shaped container)
- Smooth transitions
- Haptic feedback on press

**Implementation:**
```typescript
import { BottomNavigation } from 'react-native-paper';

<BottomNavigation
  navigationState={{ index: activeIndex, routes: destinations }}
  onIndexChange={handleIndexChange}
  renderScene={BottomNavigation.SceneMap({
    home: () => null, // Navigation only, no scenes
  })}
  shifting={false} // Keep all labels visible
  activeColor={theme.colors.primary}
  inactiveColor={theme.colors.onSurfaceVariant}
  barStyle={{ backgroundColor: theme.colors.surface }}
/>
```

---

### Week 3: Student Context & Core Hooks

#### 3.1 Student Context (8 hours)
**File:** `src/features/student/contexts/StudentContext.tsx`

**Context State:**
```typescript
interface StudentContextState {
  // Identity
  studentId: string;
  parentId: string;
  studentProfile: StudentProfile | null;

  // Child selection (for parents with multiple children)
  selectedChildId: string | null;
  children: ChildProfile[];

  // Actions
  switchChild: (childId: string) => void;
  refreshProfile: () => Promise<void>;

  // Loading states
  isLoading: boolean;
  error: Error | null;
}
```

**Provider:**
- Wraps entire student navigation stack
- Fetches student profile on mount
- Handles parent-child switching
- Caches profile data

---

#### 3.2 useStudentContext Hook (2 hours)
**File:** `src/features/student/hooks/useStudentContext.tsx`

**Usage:**
```typescript
const { studentId, parentId, studentProfile, switchChild } = useStudentContext();
```

**Error Handling:**
- Throws error if used outside StudentProvider
- Provides helpful error messages

---

#### 3.3 useStudentProgress Hook (6 hours)
**File:** `src/features/student/hooks/useStudentProgress.tsx`

**Signature:**
```typescript
function useStudentProgress(studentId: string, filters?: {
  subjectId?: string;
  dateRange?: { start: Date; end: Date };
})
```

**Returns:**
```typescript
{
  // Data
  overallProgress: number; // 0-100
  subjectProgress: SubjectProgress[];
  achievements: Achievement[];
  streaks: LearningStreak[];

  // Stats
  stats: {
    totalXP: number;
    level: number;
    rank: number;
    averageScore: number;
  };

  // States
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

**Supabase Queries:**
- `student_progress` table
- `subject_performance` table
- `achievements` table
- `learning_streaks` table

---

#### 3.4 useStudentSchedule Hook (6 hours)
**File:** `src/features/student/hooks/useStudentSchedule.tsx`

**Signature:**
```typescript
function useStudentSchedule(studentId: string, date: Date)
```

**Returns:**
```typescript
{
  // Data
  todayClasses: Class[];
  upcomingClasses: Class[];
  timetable: TimetableEntry[];
  liveSession: LiveSession | null; // Currently active

  // Actions
  joinClass: (classId: string) => Promise<void>;
  markAttendance: (classId: string) => Promise<void>;

  // States
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

---

#### 3.5 useStudentAssignments Hook (6 hours)
**File:** `src/features/student/hooks/useStudentAssignments.tsx`

**Signature:**
```typescript
function useStudentAssignments(
  studentId: string,
  filters?: {
    status?: 'pending' | 'submitted' | 'graded' | 'overdue';
    subjectId?: string;
  }
)
```

**Returns:**
```typescript
{
  // Data
  assignments: Assignment[];

  // Stats
  stats: {
    total: number;
    pending: number;
    submitted: number;
    graded: number;
    overdue: number;
  };

  // Actions
  submitAssignment: (assignmentId: string, submission: File) => Promise<void>;

  // States
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

---

#### 3.6 useStudentDoubts Hook (4 hours)
**File:** `src/features/student/hooks/useStudentDoubts.tsx`

**Signature:**
```typescript
function useStudentDoubts(
  studentId: string,
  status?: 'pending' | 'answered' | 'resolved'
)
```

**Returns:**
```typescript
{
  // Data
  doubts: Doubt[];

  // Stats
  stats: {
    pending: number;
    answered: number;
    resolved: number;
  };

  // Actions
  askDoubt: (doubt: { subject: string; question: string; image?: File }) => Promise<void>;
  markResolved: (doubtId: string) => Promise<void>;

  // States
  isLoading: boolean;
  error: Error | null;
}
```

---

### Week 4: Live Class Feature Components

#### 4.1 ParticipantsList Component (6 hours)
**File:** `src/components/student/live-class/ParticipantsList.tsx`

**Props:**
- `sessionId`: string
- `participants`: Participant[]
- `currentUserId`: string

**Features:**
- Real-time participant updates
- Online status indicators (green dot)
- Hand raised status (🙋 icon)
- Video/audio status icons
- Grid or list view toggle
- Search participants

**MD3 Design:**
- List items: 56dp height
- Avatar: 40dp circular
- Status indicators: 8dp dots
- Dividers between items

---

#### 4.2 ChatPanel Component (8 hours)
**File:** `src/components/student/live-class/ChatPanel.tsx`

**Props:**
- `sessionId`: string
- `studentId`: string
- `isTeacher`: boolean

**Features:**
- Real-time chat messages
- Message timestamps
- Teacher messages highlighted
- Emoji reactions
- Auto-scroll to latest
- Message input with send button

**MD3 Design:**
- Message bubbles: 8dp corner radius
- Own messages: Primary container (right aligned)
- Others' messages: Surface-variant (left aligned)
- Input: 48dp height, outlined variant

---

#### 4.3 PollsWidget Component (6 hours) ✅ IMPLEMENTED
**File:** `src/components/student/organisms/PollsWidget.tsx` (implemented as PollsWidget, not PollDisplay)

**Props:**
- `poll`: Poll
- `onVote`: (optionId: string) => void
- `hasVoted`: boolean

**Features:**
- Poll question display
- Multiple choice options (radio buttons)
- Live results (if poll ended)
- Progress bars showing percentages
- Submit vote button

**MD3 Design:**
- Card container (elevated variant)
- Radio buttons: 20dp, primary color when selected
- Progress bars: 8dp height, rounded corners

---

#### 4.4 QuizInterface Component (10 hours) ❌ NOT IMPLEMENTED
**File:** `src/components/student/live-class/QuizInterface.tsx` *(Future Enhancement)*

**Status:** This component was planned but not implemented in Phase 0.

**Planned Features:**
- Question navigation (1/10 indicator)
- Multiple choice options
- Timer display (countdown)
- Review answers before submit
- Submit confirmation dialog
- Results display (after submission)

**Planned MD3 Design:**
- Question card: Elevated variant
- Option cards: Outlined variant (selected: primary container)
- Timer: Circular progress indicator
- Navigation: Primary tabs component

**Note:** Quiz functionality can be implemented as a future enhancement when quiz features are needed for live classes.

---

#### 4.5 RecordingIndicator Component (3 hours)
**File:** `src/components/student/live-class/RecordingIndicator.tsx`

**Props:**
- `isRecording`: boolean
- `startTime`: Date | null

**Features:**
- Pulsing red dot when recording
- Duration timer (MM:SS format)
- "REC" label
- Positioned in top-right corner

**MD3 Design:**
- Container: Error container (red background)
- Dot: 8dp, animated pulse effect
- Typography: Label Small (white text)
- Padding: 8dp horizontal, 4dp vertical

---

## 🏗️ PHASE 1: Screen Recreation Foundation (1 Week)

### Objective
Prepare screen-recreator skill and documentation for systematic recreation of 21 student screens.

---

### Task 1.1: Update Screen-Recreator Skill (4 hours)

**File:** `C:/PC/.claude/skills/screen-recreator/SKILL.md`

**Add Sections:**
1. **MD3 Navigation Template** - Top bar, drawer, bottom nav patterns
2. **UI Component Checklist** - Verify prerequisites before starting
3. **Student Hook Patterns** - When to use which hook
4. **Feature Component Library** - Available components for live class, progress, etc.

---

### Task 1.2: Create Student Navigation Types (3 hours)

**File:** `src/types/studentNavigation.ts`

**Define:**
```typescript
export type StudentStackParamList = {
  // Core
  StudentDashboard: { parentId: string };

  // Schedule
  ScheduleScreen: { studentId: string; date?: string };
  TimetableScreen: { studentId: string };

  // Assignments
  AssignmentsList: { studentId: string; status?: string };
  AssignmentDetail: { assignmentId: string };
  AssignmentSubmission: { assignmentId: string };

  // Doubts
  DoubtsList: { studentId: string; status?: string };
  DoubtDetail: { doubtId: string };
  DoubtSubmission: { subjectId: string };

  // Live Classes
  LiveClassesList: { studentId: string };
  StudentLiveClass: { sessionId: string; classId: string };
  ClassDetail: { classId: string };
  LiveClassParticipation: { sessionId: string };
  ClassRecordingViewer: { recordingId: string };

  // AI Study
  AITutorScreen: { studentId: string };
  AIStudyScreen: { studentId: string; topicId?: string };
  EnhancedAIStudyAssistant: { studentId: string };

  // Library
  StudyLibrary: { studentId: string; categoryId?: string };
  StudyMaterialViewer: { materialId: string };

  // Progress
  ProgressDetail: { studentId: string; subjectId?: string };
  ActivityDetail: { studentId: string };

  // Gamification
  GamifiedHub: { studentId: string };
  PeerLearning: { studentId: string };

  // More
  MoreMenu: { studentId: string };
  Settings: { studentId: string };
};
```

---

### Task 1.3: Create Screen Template (3 hours)

**File:** `C:/PC/OLD/STUDENT_SCREEN_TEMPLATE.md`

**Content:**
- MD3-compliant screen structure
- Top bar + drawer + bottom nav integration
- BaseScreen usage examples
- Hook usage patterns
- Feature component examples
- Analytics tracking
- Navigation examples

---

### Task 1.4: Create Component Documentation (4 hours)

**File:** `C:/PC/OLD/UI_COMPONENTS_GUIDE.md`

**Document Each Component:**
- Purpose
- Props API
- Usage examples
- MD3 specifications
- Accessibility notes
- Common patterns

---

## 📊 Deliverables Summary

### Phase 0 Deliverables (3-4 Weeks)

**Week 1: Core UI Components**
- ✅ Button (enhanced with MD3 variants)
- ✅ Card (3 variants + sub-components)
- ✅ Badge (5 variants)
- ✅ Tabs (primary + secondary)
- ✅ Modal (bottom sheet + full screen + alert dialog)
- ✅ SearchBar
- ✅ FilterPanel
- ✅ EmptyState
- ✅ LoadingState

**Week 2: Navigation Components**
- ✅ StudentTopBar (MD3 app bar)
- ✅ StudentDrawer (MD3 navigation drawer)
- ✅ StudentBottomNav (MD3 bottom navigation)

**Week 3: Student Context & Hooks**
- ✅ StudentContext + Provider
- ✅ useStudentContext
- ✅ useStudentProgress
- ✅ useStudentSchedule
- ✅ useStudentAssignments
- ✅ useStudentDoubts

**Week 4: Live Class Components**
- ✅ ParticipantsList
- ✅ ChatPanel
- ✅ PollsWidget (implemented as PollsWidget, not PollDisplay)
- ✅ ScreenShareViewer
- ✅ LiveClassControls
- ❌ QuizInterface (not implemented - future enhancement)
- ✅ RecordingIndicator

---

### Phase 1 Deliverables (1 Week)

- ✅ Updated screen-recreator skill with MD3 patterns
- ✅ Student navigation types (StudentStackParamList)
- ✅ Student screen template document
- ✅ UI components guide documentation

---

## ⏱️ Time Estimates

| Phase | Tasks | Min Hours | Max Hours | Duration |
|-------|-------|-----------|-----------|----------|
| **Phase 0 - Week 1** | Core UI Components (9 components) | 40 | 50 | 5-6 days |
| **Phase 0 - Week 2** | Navigation Components (3 components) | 20 | 25 | 2-3 days |
| **Phase 0 - Week 3** | Context & Hooks (6 items) | 28 | 35 | 3-4 days |
| **Phase 0 - Week 4** | Live Class Components (5 components) | 32 | 40 | 4-5 days |
| **Phase 1** | Documentation & Skill Update | 12 | 16 | 1-2 days |
| **TOTAL** | | **132** | **166** | **3-4 weeks** |

---

## 🎯 Success Criteria

### Phase 0 Complete When:
- ✅ All 9 core UI components implemented and tested
- ✅ All 3 navigation components working (top bar, drawer, bottom nav)
- ✅ Student context providing data to all screens
- ✅ All 6 hooks fetching real data from Supabase
- ✅ All 5 live class components functional
- ✅ MD3 design specifications followed for ALL components
- ✅ Zero mock data in any component
- ✅ All components have TypeScript types
- ✅ All components documented

### Phase 1 Complete When:
- ✅ Screen-recreator skill updated with MD3 patterns
- ✅ StudentStackParamList defined with all 21 screens
- ✅ Student screen template document created
- ✅ UI components guide published
- ✅ Ready to start systematic screen recreation

---

## 🚀 Next Steps After Phase 0 & 1

Once foundation is complete, recreation of 21 student screens becomes:

**Before (Without Foundation):**
- 20-30 hours per screen
- Reinvent UI components
- Duplicate data fetching logic
- Inconsistent design

**After (With Foundation):**
- 8-12 hours per screen
- Assemble pre-built components
- Use shared hooks
- Consistent MD3 design

**Total Time Savings:** 252-378 hours (50-60% faster)

---

## 📋 Risk Mitigation

### Risk 1: MD3 Learning Curve
**Mitigation:**
- Study Material Design 3 documentation first
- Use react-native-paper examples as reference
- Create component playground for testing

### Risk 2: Component API Changes
**Mitigation:**
- Version lock react-native-paper
- Document breaking changes
- Test components thoroughly before screen recreation

### Risk 3: Supabase Query Performance
**Mitigation:**
- Add indexes on frequently queried columns
- Use React Query caching (staleTime, cacheTime)
- Monitor query performance in console

### Risk 4: Real-time Subscriptions Complexity
**Mitigation:**
- Start with simple queries, add real-time later
- Use Supabase channels documentation
- Test with multiple users simultaneously

---

**Created:** 2025-10-28
**Author:** Claude Code
**Status:** Draft - Ready for Implementation

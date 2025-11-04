# Pre-Recreation Checklist

**Before recreating any student screens, complete these 6 critical integration tasks**

**Created:** 2025-10-29
**Status:** Pre-Implementation Validation Phase

---

## Overview

Phase 0 (24 components) and Phase 1 (documentation) are CODE COMPLETE. However, before recreating production screens, we must ensure the foundation integrates properly with the main app runtime.

**Current State:**
- ✅ 24 components exist in `C:\PC\OLD\src\components\student\`
- ✅ 7 hooks + context exist in `C:\PC\OLD\src\`
- ✅ 4 comprehensive documentation guides created
- ⚠️ Components NOT yet integrated with main app runtime
- ⚠️ Metro bundler may still pull old components
- ⚠️ Navigation not wired to global navigator
- ⚠️ No end-to-end Supabase smoke test performed

---

## Task 1: Environment Alignment ⚠️ CRITICAL

### Problem
New student components live under `OLD/src/...`, but Metro bundler may not pick them up. The active app might still be pulling older components from different paths.

### Decision Required

**Option A: Migrate OLD/ → Main App Structure**
```
Current: C:\PC\OLD\src\components\student\
Target:  C:\PC\src\components\student\

Pros:
- Clean migration path
- No path alias needed
- Standard import paths

Cons:
- Need to move all files
- Need to update all imports
- Risk of missing files
```

**Option B: Update Metro/TSConfig Paths**
```javascript
// metro.config.js
module.exports = {
  resolver: {
    extraNodeModules: {
      '@components': path.resolve(__dirname, 'OLD/src/components'),
      '@hooks': path.resolve(__dirname, 'OLD/src/hooks'),
      '@context': path.resolve(__dirname, 'OLD/src/context'),
    },
  },
};

// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@components/*": ["./OLD/src/components/*"],
      "@hooks/*": ["./OLD/src/hooks/*"],
      "@context/*": ["./OLD/src/context/*"]
    }
  }
}

Pros:
- No file movement needed
- Can keep OLD/ structure
- Gradual migration possible

Cons:
- Adds complexity
- Path aliases can be confusing
- May have issues with native modules
```

### Action Items

- [ ] **DECIDE:** Choose Option A (migrate) or Option B (path aliases)
- [ ] **VERIFY:** Check current Metro config: `C:\PC\OLD\metro.config.js`
- [ ] **VERIFY:** Check current TSConfig: `C:\PC\OLD\tsconfig.json`
- [ ] **TEST:** Run Metro bundler and verify it finds student components
- [ ] **TEST:** Import a student component in a test screen and verify it resolves
- [ ] **DOCUMENT:** Update import paths in all guides if using path aliases

**Commands to Run:**
```bash
# Check current Metro config
cat C:\PC\OLD\metro.config.js

# Check current TSConfig
cat C:\PC\OLD\tsconfig.json

# Test Metro resolution
cd C:\PC\OLD
npx react-native start --reset-cache
```

---

## Task 2: Shared Plumbing Exports ⚠️ CRITICAL

### Problem
Theme, Supabase client, and AuthContext must be accessible from main project, not just `OLD/`. New screens need clean import paths without relative hacks.

### Current State

**Check these files exist and are exportable:**

```typescript
// Theme (should be in main project)
Location: C:\PC\OLD\src\theme\colors.ts
Export: export const LightTheme = { ... };
Import: import { LightTheme } from '@/theme/colors';

// Supabase Client (should be in main project)
Location: C:\PC\OLD\src\lib\supabase.ts
Export: export const supabase = createClient(...);
Import: import { supabase } from '@/lib/supabase';

// Auth Context (should be in main project)
Location: C:\PC\OLD\src\context\AuthContext.tsx
Export: export const useAuth = () => { ... };
Import: import { useAuth } from '@/context/AuthContext';

// Student Context (NEW - in OLD/)
Location: C:\PC\OLD\src\context\StudentContext.tsx
Export: export const useStudent = () => { ... };
Import: import { useStudent } from '@/context/StudentContext';
```

### Action Items

- [ ] **VERIFY:** Theme is exported from main project (not just OLD/)
  ```bash
  grep -r "export.*LightTheme" C:\PC\src\ 2>/dev/null || echo "NOT FOUND IN MAIN"
  ```

- [ ] **VERIFY:** Supabase client is exported from main project
  ```bash
  grep -r "export.*supabase" C:\PC\src\lib\ 2>/dev/null || echo "NOT FOUND IN MAIN"
  ```

- [ ] **VERIFY:** AuthContext is exported from main project
  ```bash
  grep -r "export.*useAuth" C:\PC\src\context\ 2>/dev/null || echo "NOT FOUND IN MAIN"
  ```

- [ ] **MIGRATE:** If any are missing, copy from OLD/ to main project:
  ```bash
  # Example: Copy theme if missing
  cp C:\PC\OLD\src\theme\colors.ts C:\PC\src\theme\colors.ts

  # Example: Copy Supabase client if missing
  cp C:\PC\OLD\src\lib\supabase.ts C:\PC\src\lib\supabase.ts

  # Example: Copy AuthContext if missing
  cp C:\PC\OLD\src\context\AuthContext.tsx C:\PC\src\context\AuthContext.tsx
  ```

- [ ] **ENSURE:** StudentContext is properly integrated with App.tsx:
  ```typescript
  // App.tsx (or root component)
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

- [ ] **TEST:** Create a test screen that imports all three:
  ```typescript
  import { LightTheme } from '@/theme/colors';
  import { supabase } from '@/lib/supabase';
  import { useAuth } from '@/context/AuthContext';
  import { useStudent } from '@/context/StudentContext';

  export function TestImportsScreen() {
    const { user } = useAuth();
    const { student } = useStudent();

    console.log('Theme:', LightTheme);
    console.log('Supabase:', supabase);
    console.log('User:', user);
    console.log('Student:', student);

    return <Text>Check console for imports</Text>;
  }
  ```

---

## Task 3: Navigation Integration ⚠️ CRITICAL

### Problem
StudentDrawer, StudentTopBar, and StudentBottomNav need to hook into the global navigator. Back button needs actual navigation logic, and drawer needs live student info.

### Current State

**Navigation Components Created:**
- ✅ StudentTopBar (OLD/src/components/student/navigation/StudentTopBar.tsx)
- ✅ StudentDrawer (OLD/src/components/student/navigation/StudentDrawer.tsx)
- ✅ StudentBottomNav (OLD/src/components/student/navigation/StudentBottomNav.tsx)

**Not Yet Integrated:**
- ❌ Not wired to React Navigation
- ❌ Back button doesn't navigate
- ❌ Drawer doesn't receive navigation items
- ❌ Bottom nav doesn't switch screens
- ❌ Route types not defined

### Action Items

#### 3.1: Define Student Route Types

- [ ] **CREATE:** Student navigation types file
  ```typescript
  // C:\PC\OLD\src\navigation\StudentNavigator.types.ts

  export type StudentStackParamList = {
    Dashboard: undefined;
    AssignmentList: undefined;
    AssignmentDetail: { assignmentId: string };
    Schedule: undefined;
    ClassDetail: { classId: string };
    LiveClass: { classId: string };
    Progress: undefined;
    ProgressDetail: { subjectId: string };
    Doubts: undefined;
    DoubtDetail: { doubtId: string };
    Attendance: undefined;
    Profile: undefined;
    Settings: undefined;
  };

  export type StudentTabParamList = {
    Home: undefined;
    Schedule: undefined;
    Study: undefined;
    Live: undefined;
    More: undefined;
  };

  export type StudentDrawerParamList = {
    Dashboard: undefined;
    Schedule: undefined;
    Classes: undefined;
    Assignments: undefined;
    Progress: undefined;
    Doubts: undefined;
    Attendance: undefined;
    Profile: undefined;
    Settings: undefined;
  };
  ```

#### 3.2: Create Student Navigator

- [ ] **CREATE:** Student stack navigator
  ```typescript
  // C:\PC\OLD\src\navigation\StudentNavigator.tsx

  import { createStackNavigator } from '@react-navigation/stack';
  import { StudentStackParamList } from './StudentNavigator.types';
  import { StudentTopBar } from '../components/student/navigation/StudentTopBar';

  const Stack = createStackNavigator<StudentStackParamList>();

  export function StudentNavigator() {
    return (
      <Stack.Navigator
        screenOptions={{
          header: (props) => (
            <StudentTopBar
              title={props.options.title || props.route.name}
              showBackButton={props.navigation.canGoBack()}
              onBackPress={() => props.navigation.goBack()}
              onMenuPress={() => props.navigation.openDrawer()}
            />
          ),
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="AssignmentList" component={AssignmentListScreen} />
        {/* Add all screens */}
      </Stack.Navigator>
    );
  }
  ```

- [ ] **CREATE:** Student drawer navigator
  ```typescript
  // C:\PC\OLD\src\navigation\StudentDrawerNavigator.tsx

  import { createDrawerNavigator } from '@react-navigation/drawer';
  import { StudentDrawerParamList } from './StudentNavigator.types';
  import { StudentDrawer } from '../components/student/navigation/StudentDrawer';
  import { useStudent } from '../context/StudentContext';

  const Drawer = createDrawerNavigator<StudentDrawerParamList>();

  export function StudentDrawerNavigator() {
    const { student } = useStudent();

    return (
      <Drawer.Navigator
        drawerContent={(props) => (
          <StudentDrawer
            visible={props.navigation.getState().history.some(/* drawer open logic */)}
            onClose={() => props.navigation.closeDrawer()}
            activeRoute={props.state.routeNames[props.state.index]}
            // Profile auto-loaded from StudentContext
            navigationItems={[
              {
                key: 'Dashboard',
                label: 'Dashboard',
                icon: <HomeIcon />,
                onPress: () => props.navigation.navigate('Dashboard'),
              },
              {
                key: 'Schedule',
                label: 'Schedule',
                icon: <CalendarIcon />,
                onPress: () => props.navigation.navigate('Schedule'),
              },
              // Add all navigation items
            ]}
          />
        )}
      >
        <Drawer.Screen name="Dashboard" component={StudentNavigator} />
      </Drawer.Navigator>
    );
  }
  ```

- [ ] **CREATE:** Student tab navigator (bottom nav)
  ```typescript
  // C:\PC\OLD\src\navigation\StudentTabNavigator.tsx

  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
  import { StudentTabParamList } from './StudentNavigator.types';
  import { StudentBottomNav } from '../components/student/navigation/StudentBottomNav';

  const Tab = createBottomTabNavigator<StudentTabParamList>();

  export function StudentTabNavigator() {
    return (
      <Tab.Navigator
        tabBar={(props) => (
          <StudentBottomNav
            activeRoute={props.state.routeNames[props.state.index]}
            navigationItems={[
              {
                key: 'Home',
                label: 'Home',
                icon: <HomeIcon />,
                onPress: () => props.navigation.navigate('Home'),
              },
              {
                key: 'Schedule',
                label: 'Schedule',
                icon: <CalendarIcon />,
                onPress: () => props.navigation.navigate('Schedule'),
              },
              // Add all tabs
            ]}
          />
        )}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Schedule" component={ScheduleScreen} />
        {/* Add all tabs */}
      </Tab.Navigator>
    );
  }
  ```

#### 3.3: Integrate with Root Navigator

- [ ] **INTEGRATE:** Add student navigator to root
  ```typescript
  // App.tsx or RootNavigator.tsx

  import { StudentDrawerNavigator } from './navigation/StudentDrawerNavigator';

  function RootNavigator() {
    const { user } = useAuth();

    return (
      <Stack.Navigator>
        {user?.role === 'student' ? (
          <Stack.Screen name="Student" component={StudentDrawerNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    );
  }
  ```

#### 3.4: Test Navigation

- [ ] **TEST:** Open drawer (swipe or hamburger menu)
- [ ] **TEST:** Navigate between screens via drawer
- [ ] **TEST:** Navigate via bottom nav
- [ ] **TEST:** Back button works on detail screens
- [ ] **TEST:** Hardware back button works (Android)
- [ ] **TEST:** Student profile shows in drawer header

---

## Task 4: Real Data Smoke Test ⚠️ CRITICAL

### Problem
No end-to-end Supabase validation has been performed. Need to verify StudentContext + hooks + live components work with real data before building screens on top.

### Action Items

#### 4.1: Verify Supabase Configuration

- [ ] **CHECK:** Supabase URL and anon key are set
  ```bash
  # Check .env file
  cat C:\PC\OLD\.env | grep SUPABASE

  # Should show:
  # SUPABASE_URL=https://xxx.supabase.co
  # SUPABASE_ANON_KEY=eyJxxx...
  ```

- [ ] **CHECK:** Supabase client initializes
  ```typescript
  // C:\PC\OLD\src\lib\supabase.ts
  console.log('Supabase URL:', process.env.SUPABASE_URL);
  console.log('Supabase initialized:', !!supabase);
  ```

- [ ] **TEST:** Run Supabase list tables
  ```bash
  cd C:\PC\OLD
  npx tsx -e "
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    supabase.from('students').select('count').then(console.log);
  "
  ```

#### 4.2: Test StudentContext

- [ ] **CREATE:** Test screen for StudentContext
  ```typescript
  // TestStudentContextScreen.tsx

  import { useStudent } from '@/context/StudentContext';

  export function TestStudentContextScreen() {
    const { student, loading, error, refetch } = useStudent();

    if (loading) return <Text>Loading student profile...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;
    if (!student) return <Text>No student data</Text>;

    return (
      <View>
        <Text>✅ StudentContext Working!</Text>
        <Text>Name: {student.name}</Text>
        <Text>Email: {student.email}</Text>
        <Text>Class: {student.class}</Text>
        <Button label="Refetch" onPress={refetch} />
      </View>
    );
  }
  ```

- [ ] **RUN:** Navigate to test screen and verify student data loads
- [ ] **VERIFY:** No console errors
- [ ] **VERIFY:** Student profile displays correctly

#### 4.3: Test Student Hooks

- [ ] **CREATE:** Test screen for each hook
  ```typescript
  // TestHooksScreen.tsx

  import { useStudentProgress } from '@/hooks/student/useStudentProgress';
  import { useStudentAssignments } from '@/hooks/student/useStudentAssignments';
  import { useStudentSchedule } from '@/hooks/student/useStudentSchedule';

  export function TestHooksScreen() {
    const { student } = useStudent();

    const { data: progress } = useStudentProgress(student?.id);
    const { data: assignments } = useStudentAssignments(student?.id, { status: 'pending' });
    const { data: schedule } = useStudentSchedule(student?.id, { dateRange: 'today' });

    return (
      <ScrollView>
        <Text>Progress: {progress?.overallProgress}%</Text>
        <Text>Assignments: {assignments?.length}</Text>
        <Text>Today's Classes: {schedule?.length}</Text>
      </ScrollView>
    );
  }
  ```

- [ ] **TEST:** useStudentProgress returns data
- [ ] **TEST:** useStudentAssignments returns data
- [ ] **TEST:** useStudentSchedule returns data
- [ ] **TEST:** useStudentDoubts returns data
- [ ] **TEST:** useStudentAttendance returns data
- [ ] **TEST:** useStudentNotifications returns data

#### 4.4: Test Live Components

- [ ] **CREATE:** Test screen for live components
  ```typescript
  // TestLiveComponentsScreen.tsx

  import { ParticipantsList } from '@/components/student/organisms/ParticipantsList';
  import { ChatPanel } from '@/components/student/organisms/ChatPanel';
  import { PollsWidget } from '@/components/student/organisms/PollsWidget';

  export function TestLiveComponentsScreen() {
    const { student } = useStudent();
    const testClassId = 'test-class-123';

    return (
      <View>
        <ParticipantsList
          classId={testClassId}
          currentUserId={student?.id}
        />
        <ChatPanel
          classId={testClassId}
          currentUserId={student?.id}
          currentUserName={student?.name}
        />
        <PollsWidget
          classId={testClassId}
          currentUserId={student?.id}
        />
      </View>
    );
  }
  ```

- [ ] **TEST:** ParticipantsList loads participants
- [ ] **TEST:** ChatPanel loads messages
- [ ] **TEST:** PollsWidget loads polls
- [ ] **TEST:** Real-time updates work (send test message)
- [ ] **VERIFY:** No real-time subscription errors

#### 4.5: Schema Validation

- [ ] **RUN:** Check all required tables exist
  ```bash
  # Using Supabase MCP
  npx tsx -e "
    // List all tables
    const tables = await mcp__supabase__list_tables();
    console.log('Tables:', tables);

    // Required tables:
    const required = [
      'students',
      'student_progress',
      'classes',
      'assignments',
      'student_submissions',
      'doubts',
      'attendance',
      'notifications',
      'class_participants',
      'chat_messages',
      'polls',
      'poll_votes'
    ];

    required.forEach(table => {
      if (!tables.includes(table)) {
        console.error('❌ Missing table:', table);
      } else {
        console.log('✅ Found table:', table);
      }
    });
  "
  ```

- [ ] **VERIFY:** All required columns exist in each table
- [ ] **VERIFY:** RLS policies are enabled
- [ ] **FIX:** Create missing tables/columns if needed

---

## Task 5: Device Validation ⚠️ HIGH PRIORITY

### Problem
Components have only been tested in code editor (TypeScript compilation). Need hands-on device testing for Android/iOS parity, haptics, and notch/gesture-bar behavior.

### Action Items

#### 5.1: Build and Install on Android Device

- [ ] **BUILD:** Debug APK
  ```bash
  cd C:\PC\OLD
  npx react-native run-android
  ```

- [ ] **VERIFY:** App installs without errors
- [ ] **VERIFY:** No Metro bundler errors
- [ ] **VERIFY:** No native module errors

#### 5.2: Test Core UI Components

- [ ] **TEST:** Button - All 5 variants render correctly
- [ ] **TEST:** Button - Press states work (ripple effect)
- [ ] **TEST:** Button - Disabled state shows correctly
- [ ] **TEST:** Card - All 3 variants render correctly
- [ ] **TEST:** Card - Elevation shadows visible
- [ ] **TEST:** Card - Press states work
- [ ] **TEST:** Badge - All sizes render correctly
- [ ] **TEST:** Badge - Numbers display correctly (1-99, 99+)
- [ ] **TEST:** Tabs - Indicator animates smoothly
- [ ] **TEST:** Tabs - Scrollable tabs work (6+ tabs)
- [ ] **TEST:** Modal - Opens/closes with animation
- [ ] **TEST:** Modal - Backdrop dismisses modal
- [ ] **TEST:** BottomSheet - Drag handle works
- [ ] **TEST:** BottomSheet - Dismisses on swipe down
- [ ] **TEST:** SearchBar - Debouncing works (300ms delay)
- [ ] **TEST:** SearchBar - Clear button appears/works
- [ ] **TEST:** EmptyState - Displays correctly
- [ ] **TEST:** LoadingState - Skeleton animation works

#### 5.3: Test Navigation Components

- [ ] **TEST:** StudentTopBar - Hamburger menu opens drawer
- [ ] **TEST:** StudentTopBar - Back button navigates back
- [ ] **TEST:** StudentTopBar - Overflow menu opens
- [ ] **TEST:** StudentTopBar - Elevation changes on scroll
- [ ] **TEST:** StudentDrawer - Opens/closes smoothly
- [ ] **TEST:** StudentDrawer - Profile header displays
- [ ] **TEST:** StudentDrawer - Navigation items respond to press
- [ ] **TEST:** StudentDrawer - Active route highlighted
- [ ] **TEST:** StudentBottomNav - Tab switching works
- [ ] **TEST:** StudentBottomNav - Haptic feedback works (10ms vibration)
- [ ] **TEST:** StudentBottomNav - Badge counts display
- [ ] **TEST:** StudentBottomNav - Active indicator animates

#### 5.4: Test Live Components

- [ ] **TEST:** ParticipantsList - Scrolls smoothly
- [ ] **TEST:** ParticipantsList - Speaking indicator animates
- [ ] **TEST:** ParticipantsList - Raised hand shows
- [ ] **TEST:** ChatPanel - Messages load
- [ ] **TEST:** ChatPanel - Send message works
- [ ] **TEST:** ChatPanel - Auto-scrolls to latest
- [ ] **TEST:** ChatPanel - Keyboard avoiding works
- [ ] **TEST:** PollsWidget - Vote submission works
- [ ] **TEST:** PollsWidget - Percentage bars update
- [ ] **TEST:** PollsWidget - Timer counts down
- [ ] **TEST:** ScreenShareViewer - Fullscreen toggle works
- [ ] **TEST:** ScreenShareViewer - Zoom controls work
- [ ] **TEST:** LiveClassControls - Mic toggle works
- [ ] **TEST:** LiveClassControls - Camera toggle works
- [ ] **TEST:** LiveClassControls - Hand raise pulses
- [ ] **TEST:** LiveClassControls - Haptic feedback on all buttons

#### 5.5: Android-Specific Testing

- [ ] **TEST:** Hardware back button closes drawer
- [ ] **TEST:** Hardware back button closes modal
- [ ] **TEST:** Hardware back button navigates back
- [ ] **TEST:** Status bar color correct
- [ ] **TEST:** Navigation bar color correct
- [ ] **TEST:** Notch/cutout handled correctly
- [ ] **TEST:** Gesture navigation works
- [ ] **TEST:** App doesn't crash on rotate
- [ ] **TEST:** Haptic feedback works (Vibration API)

#### 5.6: iOS Testing (if available)

- [ ] **TEST:** Notch (iPhone X+) handled correctly
- [ ] **TEST:** Home indicator space correct
- [ ] **TEST:** Safe area insets work
- [ ] **TEST:** Swipe-back gesture works
- [ ] **TEST:** Haptic feedback works (different API)

#### 5.7: Performance Testing

- [ ] **TEST:** FlatList scrolls smoothly (60fps)
- [ ] **TEST:** No lag when opening drawer
- [ ] **TEST:** No lag when switching tabs
- [ ] **TEST:** Animations smooth (not janky)
- [ ] **TEST:** App doesn't freeze on data load
- [ ] **TEST:** Memory usage reasonable (<200MB)

---

## Task 6: Docs & Discoverability ✅ COMPLETE

### Status
All planned documentation guides are complete!

**Created Documentation:**
- ✅ STUDENT_COMPONENTS_GUIDE.md (25,000 words)
- ✅ STUDENT_HOOKS_GUIDE.md (18,000 words)
- ✅ STUDENT_BEST_PRACTICES.md (15,000 words)
- ✅ screen-recreator SKILL.md updated (8,000 words added)

**Total:** ~66,000 words of comprehensive documentation

---

## Summary Checklist

### Before Starting Screen Recreation

- [ ] **Task 1:** Environment Alignment
  - [ ] Decide: Migrate OLD/ or use path aliases
  - [ ] Verify Metro config
  - [ ] Test Metro resolution
  - [ ] Update import paths in docs

- [ ] **Task 2:** Shared Plumbing
  - [ ] Verify theme exports
  - [ ] Verify Supabase exports
  - [ ] Verify AuthContext exports
  - [ ] Integrate StudentContext in App.tsx
  - [ ] Test all imports in test screen

- [ ] **Task 3:** Navigation Integration
  - [ ] Define route types
  - [ ] Create student stack navigator
  - [ ] Create student drawer navigator
  - [ ] Create student tab navigator
  - [ ] Integrate with root navigator
  - [ ] Test all navigation flows

- [ ] **Task 4:** Real Data Smoke Test
  - [ ] Verify Supabase config
  - [ ] Test StudentContext loads data
  - [ ] Test all 6 hooks load data
  - [ ] Test live components work
  - [ ] Validate schema (all tables exist)

- [ ] **Task 5:** Device Validation
  - [ ] Build Android APK
  - [ ] Test all core UI components
  - [ ] Test all navigation components
  - [ ] Test all live components
  - [ ] Test Android-specific features
  - [ ] Test performance

- [ ] **Task 6:** Documentation ✅
  - [x] All guides created
  - [x] SKILL.md updated
  - [x] Examples provided

---

## Priority Order

1. **CRITICAL (Block screen recreation):**
   - Task 1: Environment Alignment
   - Task 2: Shared Plumbing
   - Task 3: Navigation Integration
   - Task 4: Real Data Smoke Test

2. **HIGH PRIORITY (Should complete before production):**
   - Task 5: Device Validation

3. **COMPLETE:**
   - Task 6: Documentation

---

## Timeline Estimate

| Task | Estimated Time |
|------|----------------|
| Task 1: Environment Alignment | 2-3 hours |
| Task 2: Shared Plumbing | 1-2 hours |
| Task 3: Navigation Integration | 4-6 hours |
| Task 4: Real Data Smoke Test | 2-3 hours |
| Task 5: Device Validation | 4-6 hours |
| **Total** | **13-20 hours** |

---

## Success Criteria

**When all tasks complete, you can start screen recreation with confidence that:**

✅ Metro bundler finds all student components
✅ Imports work cleanly (no relative path hacks)
✅ Navigation flows work end-to-end
✅ Real Supabase data loads correctly
✅ Components render correctly on real devices
✅ Haptics, gestures, and native features work
✅ Comprehensive documentation available

---

**Next Step:** Start with Task 1 (Environment Alignment) - decide migration strategy

**Last Updated:** 2025-10-29

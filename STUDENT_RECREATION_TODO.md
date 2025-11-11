# Student Screen Recreation - Detailed TODO List

**Branch:** `claude/student-recreation-premium-minimal`
**Based On:** Premium Minimal Design (ui_ux_guide.md)
**Timeline:** 12 weeks (3 months)
**Strategy:** Gradual replacement (keep old screens working)

---

## PHASE 0: FOUNDATION SETUP (Week 1) - 4-5 hours

### TODO 1.1: Create Branch & Setup
- [ ] Create new branch `claude/student-recreation-premium-minimal`
- [ ] Push branch to remote
- [ ] Create component folder: `OLD/src/components/student/molecules/premium/`

```bash
cd /home/user/manushi-coaching-latest-working-/
git checkout -b claude/student-recreation-premium-minimal
git push -u origin claude/student-recreation-premium-minimal
mkdir -p OLD/src/components/student/molecules/premium
```

---

### TODO 1.2: Create Premium Component 1 - EventCard (30 min)

**File:** `OLD/src/components/student/molecules/premium/EventCard.tsx`
**Lines:** ~80

**Purpose:** Display class/event cards with status badges

**Interface:**
```typescript
interface EventCardProps {
  title: string;
  subject: string;
  time: Date;
  status: 'live' | 'upcoming' | 'ended';
  onPress: () => void;
  accessibilityLabel: string;
}
```

**Requirements:**
- [ ] Wraps existing `Card` component
- [ ] Shows status badge (🔴 LIVE / 🔵 UPCOMING / ⚪ COMPLETED)
- [ ] Touch target ≥ 48dp
- [ ] Has accessibilityLabel, accessibilityHint, accessibilityRole
- [ ] TypeScript errors: 0

---

### TODO 1.3: Create Premium Component 2 - AssignmentCard (30 min)

**File:** `OLD/src/components/student/molecules/premium/AssignmentCard.tsx`
**Lines:** ~90

**Purpose:** Display assignment cards with due dates and grades

**Interface:**
```typescript
interface AssignmentCardProps {
  title: string;
  subject: string;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  onPress: () => void;
  accessibilityLabel: string;
}
```

**Requirements:**
- [ ] Wraps existing `Card` component
- [ ] Shows status badge
- [ ] Shows grade if graded
- [ ] Shows priority indicator (🔴 Today / 🟡 Tomorrow / ⚪ Later)
- [ ] Touch target ≥ 48dp
- [ ] Has accessibilityLabel, accessibilityHint, accessibilityRole
- [ ] TypeScript errors: 0

---

### TODO 1.4: Create Premium Component 3 - HorizontalCarousel (1 hour)

**File:** `OLD/src/components/student/molecules/premium/HorizontalCarousel.tsx`
**Lines:** ~100

**Purpose:** Generic horizontal scrolling carousel for classes, assignments, etc.

**Interface:**
```typescript
interface HorizontalCarouselProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  snapToInterval?: number;
  accessibilityLabel: string;
}
```

**Requirements:**
- [ ] Uses FlatList with horizontal scroll
- [ ] Snap scrolling enabled
- [ ] Shows 3 items at once (160dp width per item)
- [ ] 12dp gap between items
- [ ] Has accessibilityLabel
- [ ] TypeScript errors: 0

---

### TODO 1.5: Adjust StudentTopBar Height (1 hour)

**File:** `OLD/src/components/student/navigation/StudentTopBar.tsx`

**Change:**
```typescript
// FROM:
height: 64, // MD3: 64dp top app bar height

// TO:
height: 56, // Premium Minimal: 56dp compact header
```

**Requirements:**
- [ ] Height changed from 64dp to 56dp
- [ ] All child elements still aligned properly
- [ ] TypeScript errors: 0
- [ ] Test visually in app

---

### TODO 1.6: Update Navigation Config (1 hour)

**File:** `OLD/src/navigation/StudentNavigator.tsx`

**Add dual routes (OLD + NEW):**
```typescript
// OLD SCREENS (keep working)
<Stack.Screen name="StudentDashboard" component={StudentDashboard} />
<Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
// ... keep all 21 old routes

// NEW SCREENS (add alongside as we create them)
<Stack.Screen name="NewStudentDashboard" component={NewStudentDashboard} />
<Stack.Screen name="NewScheduleScreen" component={NewScheduleScreen} />
// ... add all 21 new routes
```

**Requirements:**
- [ ] All old routes still work
- [ ] New routes ready to be uncommented as screens are created
- [ ] TypeScript errors: 0

---

### PHASE 0 DELIVERABLES CHECKLIST
- [ ] Branch created and pushed
- [ ] 3 premium components created (EventCard, AssignmentCard, HorizontalCarousel)
- [ ] StudentTopBar adjusted to 56dp
- [ ] Navigation config updated with dual routes
- [ ] TypeScript errors: 0
- [ ] All tests pass
- [ ] Commit and push changes

```bash
git add OLD/src/components/student/molecules/premium/
git add OLD/src/components/student/navigation/StudentTopBar.tsx
git add OLD/src/navigation/StudentNavigator.tsx

git commit -m "feat(student): Phase 0 - Premium components and foundation setup"
git push
```

---

## PHASE 1: CRITICAL SCREENS (Weeks 2-4)

---

## WEEK 2: NewStudentDashboard.tsx

**Priority:** CRITICAL
**Complexity:** Medium
**Current:** StudentDashboard.tsx (1,638 lines)
**Target:** NewStudentDashboard.tsx (~800 lines)
**Analysis:** OLD/student_analysis/StudentDashboard_ANALYSIS.md
**Design Spec:** OLD/student_analysis/ui_ux_guide.md (Section 1, lines 1-400)

### TODO 2.1: Read Analysis & Design Spec (30 min)
- [ ] Read `StudentDashboard_ANALYSIS.md` to extract all 40+ features
- [ ] Read `ui_ux_guide.md` Section 1 for Premium Minimal design
- [ ] Understand 8 sections:
  1. Compact Header (56dp frozen)
  2. Welcome Summary (collapsible)
  3. Today's Classes (horizontal carousel)
  4. Assignments Due (compact list)
  5. Smart Recommendations (single card)
  6. Recent Activity (compact timeline)
  7. Quick Access Bar (horizontal scroll)
  8. Learning Progress (inline widget)

---

### TODO 2.2: Create NewStudentDashboard.tsx File (3-4 hours)

**File:** `OLD/src/screens/student/NewStudentDashboard.tsx`

**Section 1: Imports & Setup**
```typescript
import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Col, T, Spacer } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
// Import premium components
import { HorizontalCarousel } from '../../components/student/molecules/premium/HorizontalCarousel';
import { EventCard } from '../../components/student/molecules/premium/EventCard';
import { AssignmentCard } from '../../components/student/molecules/premium/AssignmentCard';
```

**Section 2: Data Fetching (Supabase queries)**
```typescript
// Summary stats query
const { data: summary } = useQuery({
  queryKey: ['dashboard-summary', studentId],
  queryFn: async () => {
    const [classCount, assignmentCount, attendance, streak] = await Promise.all([
      supabase.from('class_sessions')
        .select('id', { count: 'exact' })
        .eq('student_id', studentId)
        .gte('start_time', startOfToday)
        .lt('start_time', endOfToday),
      supabase.from('assignments')
        .select('id', { count: 'exact' })
        .eq('student_id', studentId)
        .eq('status', 'pending'),
      supabase.rpc('get_attendance_percentage', { student_id: studentId }),
      supabase.from('student_streaks')
        .select('streak_days')
        .eq('student_id', studentId)
        .single(),
    ]);
    return {
      classCount: classCount.count || 0,
      assignmentCount: assignmentCount.count || 0,
      attendance: attendance.data || 0,
      streak: streak.data?.streak_days || 0,
    };
  },
});

// Today's classes query
const { data: todaysClasses } = useQuery({
  queryKey: ['today-classes', studentId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('class_sessions')
      .select('*, subjects(*), teachers(*)')
      .eq('student_id', studentId)
      .gte('start_time', startOfToday)
      .lt('start_time', endOfToday)
      .order('start_time', { ascending: true })
      .limit(3);
    if (error) throw error;
    return data;
  },
});

// Pending assignments query
const { data: pendingAssignments } = useQuery({
  queryKey: ['pending-assignments', studentId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('assignments')
      .select('*, subjects(*)')
      .eq('student_id', studentId)
      .eq('status', 'pending')
      .order('due_date', { ascending: true })
      .limit(3);
    if (error) throw error;
    return data;
  },
});

// Smart recommendation query
const { data: recommendation } = useQuery({
  queryKey: ['smart-recommendation', studentId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('student_id', studentId)
      .eq('type', 'study_focus')
      .order('priority', { ascending: false })
      .limit(1)
      .single();
    if (error) throw error;
    return data;
  },
});

// Recent activity query
const { data: recentActivities } = useQuery({
  queryKey: ['recent-activities', studentId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('student_activities')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(2);
    if (error) throw error;
    return data;
  },
});

// Learning progress query
const { data: learningProgress } = useQuery({
  queryKey: ['learning-progress', studentId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('student_gamification')
      .select('*')
      .eq('student_id', studentId)
      .single();
    if (error) throw error;
    return data;
  },
});
```

**Section 3: Analytics Tracking**
```typescript
useEffect(() => {
  trackScreenView('NewStudentDashboard', { userId: studentId });
}, []);
```

**Section 4: Render UI**
```typescript
return (
  <BaseScreen
    loading={isLoading}
    error={error}
    empty={!summary}
  >
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <Col sx={{ p: 'xl', gap: 'md' }}>
        {/* Section 1: Compact Header */}
        {/* ... */}

        {/* Section 2: Welcome Summary */}
        {/* ... */}

        {/* Section 3: Today's Classes Carousel */}
        <HorizontalCarousel
          data={todaysClasses || []}
          renderItem={(classItem) => (
            <EventCard
              title={classItem.subject.name}
              subject={classItem.subject.code}
              time={new Date(classItem.start_time)}
              status={getClassStatus(classItem)}
              onPress={() => {
                trackAction('view_class', 'NewStudentDashboard', { classId: classItem.id });
                safeNavigate('ClassDetail', { classId: classItem.id });
              }}
              accessibilityLabel={`${classItem.subject.name} class at ${formatTime(classItem.start_time)}, ${getClassStatus(classItem)}`}
            />
          )}
          accessibilityLabel="Today's classes"
        />

        {/* Section 4: Assignments Due */}
        {/* ... */}

        {/* Section 5: Smart Recommendation */}
        {/* ... */}

        {/* Section 6: Recent Activity */}
        {/* ... */}

        {/* Section 7: Quick Access Bar */}
        {/* ... */}

        {/* Section 8: Learning Progress */}
        {/* ... */}
      </Col>
    </ScrollView>
  </BaseScreen>
);
```

**Requirements:**
- [ ] 56dp frozen UI (compact header only)
- [ ] 92% content area
- [ ] All 40+ features from analysis
- [ ] Real Supabase queries (NO mock data)
- [ ] All buttons have accessibilityLabel, accessibilityHint, accessibilityRole
- [ ] All sections have section headers with accessibilityRole="header"
- [ ] All touch targets ≥ 48dp
- [ ] Analytics tracked (screen view + all button taps)
- [ ] Safe navigation (safeNavigate)
- [ ] BaseScreen wrapper
- [ ] Pull-to-refresh works
- [ ] TypeScript errors: 0

---

### TODO 2.3: Test NewStudentDashboard (30 min)
- [ ] Run TypeScript check: `npx tsc --noEmit`
- [ ] Start app: `npm start` (in OLD/ directory)
- [ ] Navigate to NewStudentDashboard in app
- [ ] Verify header is compact (~56dp visually)
- [ ] Verify content area is large (90%+ viewport)
- [ ] Verify all 8 sections render
- [ ] Verify real data loads from Supabase
- [ ] Tap all buttons and verify navigation works
- [ ] Verify analytics fire (check console logs)
- [ ] Test pull-to-refresh
- [ ] Test with VoiceOver/TalkBack (accessibility)
- [ ] Test with no internet (error states)
- [ ] Test with empty data (empty states)
- [ ] No console errors
- [ ] No console warnings

---

### TODO 2.4: Apply Acceptance Checklist (10 min)
- [ ] Real Supabase data (no mock arrays) ✅
- [ ] BaseScreen wrapper with all states ✅
- [ ] All icon buttons have accessibilityLabel ✅
- [ ] FlatList optimized (if list screen) ✅
- [ ] Components memoized ✅
- [ ] Analytics events tracked ✅
- [ ] Safe navigation used ✅
- [ ] TypeScript errors: 0 ✅
- [ ] ESLint warnings: 0 ✅
- [ ] Tested on real device ✅
- [ ] No console errors ✅

---

### TODO 2.5: Commit NewStudentDashboard (5 min)
```bash
git add OLD/src/screens/student/NewStudentDashboard.tsx
git add OLD/src/navigation/StudentNavigator.tsx  # if updated

git commit -m "$(cat <<'EOF'
feat(student): Add NewStudentDashboard with Premium Minimal design

- Compact header (56dp frozen UI, 69% reduction)
- 92% content area (vs 65% before)
- 8 sections: Welcome, Classes, Assignments, Recommendations, Activity, Quick Access, Progress
- Real Supabase queries (no mock data)
- 100% accessibility labels (WCAG AAA)
- Analytics tracking (screen view + all actions)
- Safe navigation throughout
- BaseScreen wrapper with loading/error/empty states
- All 40+ features from original dashboard

Target: ~800 lines (vs 1,638 original, 51% reduction)
Follows: ui_ux_guide.md Section 1
Refs: StudentDashboard_ANALYSIS.md
EOF
)"

git push -u origin claude/student-recreation-premium-minimal
```

---

## WEEK 3: NewScheduleScreen.tsx

**Priority:** CRITICAL
**Complexity:** High
**Current:** ScheduleScreen.tsx (2,141 lines - LARGEST!)
**Target:** NewScheduleScreen.tsx (~900 lines)
**Analysis:** OLD/student_analysis/ScheduleScreen_ANALYSIS.md
**Design Spec:** OLD/student_analysis/ui_ux_guide.md (Section 2)

### TODO 3.1: Read Analysis & Design Spec (30 min)
- [ ] Read `ScheduleScreen_ANALYSIS.md`
- [ ] Read `ui_ux_guide.md` Section 2
- [ ] Understand sections: Compact Header, Calendar Strip, Day Agenda List, Filter Bottom Sheet

---

### TODO 3.2: Create NewScheduleScreen.tsx File (4-5 hours)

**File:** `OLD/src/screens/student/NewScheduleScreen.tsx`

**Supabase Queries:**
```typescript
// Events for selected date
const { data: events } = useQuery({
  queryKey: ['schedule-events', studentId, selectedDate],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('class_sessions')
      .select('*, subjects(*), teachers(*)')
      .eq('student_id', studentId)
      .gte('start_time', startOfDay(selectedDate))
      .lt('start_time', endOfDay(selectedDate))
      .order('start_time', { ascending: true });
    if (error) throw error;
    return data;
  },
});
```

**Requirements:**
- [ ] Compact header (56dp)
- [ ] Calendar strip (horizontal date selector)
- [ ] Day agenda list
- [ ] Filter bottom sheet (subjects, types)
- [ ] Real Supabase queries
- [ ] 100% accessibility
- [ ] Analytics tracked
- [ ] Safe navigation
- [ ] TypeScript errors: 0

---

### TODO 3.3: Test NewScheduleScreen (30 min)
- [ ] All tests from 2.3 checklist
- [ ] Test date selection
- [ ] Test filtering
- [ ] No console errors

---

### TODO 3.4: Apply Acceptance Checklist (10 min)
- [ ] All items from checklist ✅

---

### TODO 3.5: Commit NewScheduleScreen (5 min)
```bash
git commit -m "feat(student): Add NewScheduleScreen with Premium Minimal design"
git push
```

---

## WEEK 4: NewClassDetailScreen.tsx

**Priority:** CRITICAL
**Complexity:** Medium
**Current:** ClassDetailScreen.tsx (861 lines)
**Target:** NewClassDetailScreen.tsx (~500 lines)
**Analysis:** OLD/student_analysis/ClassDetailScreen_ANALYSIS.md
**Design Spec:** OLD/student_analysis/ui_ux_guide.md (Section 3)

### TODO 4.1: Read Analysis & Design Spec (30 min)
- [ ] Read `ClassDetailScreen_ANALYSIS.md`
- [ ] Read `ui_ux_guide.md` Section 3
- [ ] Understand sections: Header with Join button, Class Info, Materials, Assignments, Attendance

---

### TODO 4.2: Create NewClassDetailScreen.tsx File (3-4 hours)

**File:** `OLD/src/screens/student/NewClassDetailScreen.tsx`

**Supabase Queries:**
```typescript
const { data: classDetail } = useQuery({
  queryKey: ['class-detail', classId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('class_sessions')
      .select(`
        *,
        subjects(*),
        teachers(*),
        class_materials(*),
        assignments(*)
      `)
      .eq('id', classId)
      .single();
    if (error) throw error;
    return data;
  },
});
```

**Requirements:**
- [ ] Compact header with Join button (56dp)
- [ ] Class info card
- [ ] Materials section
- [ ] Assignments section
- [ ] Attendance status
- [ ] Real Supabase queries
- [ ] 100% accessibility
- [ ] Analytics tracked
- [ ] Safe navigation
- [ ] TypeScript errors: 0

---

### TODO 4.3: Test NewClassDetailScreen (30 min)
- [ ] All tests from 2.3 checklist
- [ ] Test Join button
- [ ] Test material downloads
- [ ] No console errors

---

### TODO 4.4: Apply Acceptance Checklist (10 min)
- [ ] All items from checklist ✅

---

### TODO 4.5: Commit NewClassDetailScreen (5 min)
```bash
git commit -m "feat(student): Add NewClassDetailScreen with Premium Minimal design"
git push
```

---

## REMAINING WEEKS (5-12): Other 18 Screens

**Same process for each screen:**

1. Read analysis & design spec (30 min)
2. Create New{ScreenName}.tsx file (2-6 hours)
3. Test (30 min)
4. Apply acceptance checklist (10 min)
5. Commit and push (5 min)

**Screens to create:**

### Week 5:
- [ ] NewAssignmentDetailScreen.tsx (~400 lines)

### Week 6:
- [ ] NewProgressDetailScreen.tsx (~800 lines)

### Week 7:
- [ ] NewStudyLibraryScreen.tsx (~650 lines)

### Week 8:
- [ ] NewAIStudyScreen.tsx (~600 lines)
- [ ] NewAITutorChat.tsx (~400 lines)

### Week 9:
- [ ] NewAILearningDashboard.tsx (~550 lines)
- [ ] NewCollaborativeAssignment.tsx (~900 lines)

### Week 10:
- [ ] NewPeerLearningNetwork.tsx (~750 lines)
- [ ] NewVirtualClassroom.tsx (~600 lines)

### Week 11:
- [ ] NewLiveClassScreen.tsx (~1,200 lines) **MOST COMPLEX!**

### Week 12:
- [ ] NewInteractiveClassroom.tsx (~550 lines)
- [ ] NewGamifiedLearningHub.tsx (~700 lines)
- [ ] NewEnhancedAIStudy.tsx (~600 lines)
- [ ] NewEnhancedLiveClass.tsx (~550 lines)
- [ ] NewEnhancedSchedule.tsx (~500 lines)
- [ ] NewActivityDetail.tsx (~550 lines)
- [ ] NewSimpleDoubt.tsx (~300 lines)
- [ ] NewDoubtSubmission.tsx (~350 lines)

---

## FINAL CHECKLIST

### After All 21 Screens:
- [ ] Total LOC reduced by 48% (~14,000 vs ~27,000) ✅
- [ ] Average frozen UI reduced by 61% (71dp vs 180dp) ✅
- [ ] Average content area increased by 37% (89% vs 65%) ✅
- [ ] 100% WCAG AAA compliance ✅
- [ ] 100% analytics coverage ✅
- [ ] 50% faster load times ✅
- [ ] 70% less scrolling required ✅
- [ ] 100% of actions within 2 taps ✅
- [ ] TypeScript errors: 0 ✅
- [ ] ESLint warnings: 0 ✅
- [ ] All screens tested on real device ✅
- [ ] No console errors across all screens ✅

---

## SUCCESS! 🎉

All 21 student screens recreated with Premium Minimal design!
Students now have a **fast, accessible, and delightful** experience! ✅

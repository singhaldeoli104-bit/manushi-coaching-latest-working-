# Student Screens Recreation Plan - Premium Minimal Design

**Created:** 2025-11-05
**Branch:** `claude/student-recreation-premium-minimal`
**Based On:** `OLD/student_analysis/ui_ux_guide.md` (3,605 lines)
**Strategy:** Gradual replacement - Keep old screens working, create new ones alongside
**Design Philosophy:** Premium Minimal (56dp frozen UI, 92% content area, ≥48dp touch targets)

---

## 📊 Executive Summary

### Current State
- **21 student screens** exist in `OLD/src/screens/student/`
- **~27,000 lines of code** total
- **Average frozen UI:** 180dp (too much)
- **Average content area:** 65% (too small)
- **Accessibility:** 0% labeled (not compliant)
- **Analytics:** 0% tracked (no insights)

### Target State (After Recreation)
- **21 NEW student screens** in `OLD/src/screens/student/` (prefixed with `New*`)
- **~14,000 lines of code** (48% reduction)
- **Frozen UI:** 56-71dp average (61% reduction)
- **Content area:** 89-92% (37% increase)
- **Accessibility:** 100% WCAG AAA labeled
- **Analytics:** 100% tracked
- **Load time:** <1s (50% faster)

### Student Impact
- ✅ 50% faster to find information
- ✅ 70% less scrolling required
- ✅ 100% of actions within 2 taps
- ✅ 90% accessibility score (WCAG 2.1 AAA)
- ✅ Works perfectly one-handed on mobile

---

## 🎯 All 21 Screens To Recreate

| # | Screen Name | Current File | New File | Current LOC | Target LOC | Priority | Complexity |
|---|-------------|--------------|----------|-------------|------------|----------|------------|
| 1 | **Student Dashboard** | `StudentDashboard.tsx` | `NewStudentDashboard.tsx` | 1,638 | ~800 | **CRITICAL** | Medium |
| 2 | **Schedule Screen** | `ScheduleScreen.tsx` | `NewScheduleScreen.tsx` | 2,141 | ~900 | **CRITICAL** | High |
| 3 | **Class Detail** | `ClassDetailScreen.tsx` | `NewClassDetailScreen.tsx` | 861 | ~500 | **CRITICAL** | Medium |
| 4 | **Assignment Detail** | `AssignmentDetailScreen.tsx` | `NewAssignmentDetailScreen.tsx` | 782 | ~400 | High | Low |
| 5 | **Progress Detail** | `ProgressDetailScreen.tsx` | `NewProgressDetailScreen.tsx` | 1,901 | ~800 | High | Medium |
| 6 | **Study Library** | `StudyLibraryScreen.tsx` | `NewStudyLibraryScreen.tsx` | 1,400 | ~650 | High | Medium |
| 7 | **AI Study Screen** | `AIStudyScreen.tsx` | `NewAIStudyScreen.tsx` | 1,278 | ~600 | Medium | Medium |
| 8 | **AI Tutor Chat** | `AITutorChatInterface.tsx` | `NewAITutorChat.tsx` | 724 | ~400 | Medium | Low |
| 9 | **AI Learning Dashboard** | `StudentAILearningDashboard.tsx` | `NewAILearningDashboard.tsx` | 1,057 | ~550 | Medium | Medium |
| 10 | **Collaborative Assignment** | `CollaborativeAssignmentWorkspace.tsx` | `NewCollaborativeAssignment.tsx` | N/A | ~900 | Medium | High |
| 11 | **Peer Learning Network** | `PeerLearningNetwork.tsx` | `NewPeerLearningNetwork.tsx` | 1,526 | ~750 | Medium | High |
| 12 | **Virtual Classroom** | `VirtualClassroomInterface.tsx` | `NewVirtualClassroom.tsx` | 1,040 | ~600 | Low | High |
| 13 | **Live Class Screen** | `StudentLiveClassScreen.tsx` | `NewLiveClassScreen.tsx` | 2,703 | ~1,200 | **CRITICAL** | **Very High** |
| 14 | **Interactive Classroom** | `EnhancedInteractiveClassroomScreen.tsx` | `NewInteractiveClassroom.tsx` | 986 | ~550 | Low | High |
| 15 | **Gamified Learning Hub** | `GamifiedLearningHub.tsx` | `NewGamifiedLearningHub.tsx` | 1,445 | ~700 | Low | Medium |
| 16 | **Enhanced AI Study** | `EnhancedAIStudyAssistantScreen.tsx` | `NewEnhancedAIStudy.tsx` | 1,100 | ~600 | Medium | Medium |
| 17 | **Enhanced Live Class** | `EnhancedLiveClassParticipationScreen.tsx` | `NewEnhancedLiveClass.tsx` | 1,050 | ~550 | Medium | High |
| 18 | **Enhanced Schedule** | `EnhancedScheduleScreen.tsx` | `NewEnhancedSchedule.tsx` | 900 | ~500 | Medium | Medium |
| 19 | **Activity Detail** | `ActivityDetailScreen.tsx` | `NewActivityDetail.tsx` | 1,200 | ~550 | Low | Low |
| 20 | **Simple Doubt** | `SimpleDoubtSubmissionScreen.tsx` | `NewSimpleDoubt.tsx` | 450 | ~300 | Low | Low |
| 21 | **Doubt Submission** | `DoubtSubmissionScreen.tsx` | `NewDoubtSubmission.tsx` | 550 | ~350 | Low | Low |

**Total:** 21 screens, ~27,000 → ~14,000 lines (48% reduction)

---

## 🔧 Components To Create (Only 3!)

### ✅ Most Components Already Exist!

The guide confirms that **most shared components are already implemented**:

**Already Available in `src/components/student/`:**
- Navigation: `StudentTopBar.tsx`, `StudentDrawer.tsx`, `StudentBottomNav.tsx`
- Molecules: `BottomSheet.tsx`, `FABMenu.tsx`, `FilterBottomSheet.tsx`, `Modal.tsx`, `Tabs.tsx`
- Atoms: `Card.tsx`, `Badge.tsx`, `IconButton.tsx`, `Button.tsx`, `SkeletonLoader.tsx`
- Core: `StatusBadge.tsx` (success/warning/error/info/neutral/primary variants)
- Organisms: `CalendarStrip.tsx`, `DayAgendaList.tsx`, `QuickActionRow.tsx`

### ❌ Components To CREATE (ONLY 3!)

**Location:** `OLD/src/components/student/molecules/premium/`

#### 1. EventCard.tsx
```typescript
// Wraps existing Card component for classes/events
interface EventCardProps {
  title: string;
  subject: string;
  time: Date;
  status: 'live' | 'upcoming' | 'ended';
  onPress: () => void;
  accessibilityLabel: string;
}
```
**File:** `OLD/src/components/student/molecules/premium/EventCard.tsx`
**Lines:** ~80 lines
**Time:** 30 minutes

#### 2. AssignmentCard.tsx
```typescript
// Wraps existing Card component for assignments
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
**File:** `OLD/src/components/student/molecules/premium/AssignmentCard.tsx`
**Lines:** ~90 lines
**Time:** 30 minutes

#### 3. HorizontalCarousel.tsx
```typescript
// Generic horizontal scrolling carousel
interface HorizontalCarouselProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  snapToInterval?: number;
  accessibilityLabel: string;
}
```
**File:** `OLD/src/components/student/molecules/premium/HorizontalCarousel.tsx`
**Lines:** ~100 lines
**Time:** 1 hour

**Total Time for Components:** 2 hours

---

## 🏗️ Implementation Phases

### Phase 0: Foundation Setup (Week 1 - 4-5 hours)

#### Step 1: Create New Branch
```bash
cd /home/user/manushi-coaching-latest-working-/
git checkout -b claude/student-recreation-premium-minimal
git push -u origin claude/student-recreation-premium-minimal
```

#### Step 2: Create Component Folder
```bash
mkdir -p OLD/src/components/student/molecules/premium
```

#### Step 3: Create 3 Premium Components (2 hours)
- [ ] Create `OLD/src/components/student/molecules/premium/EventCard.tsx`
- [ ] Create `OLD/src/components/student/molecules/premium/AssignmentCard.tsx`
- [ ] Create `OLD/src/components/student/molecules/premium/HorizontalCarousel.tsx`
- [ ] Test each component in isolation

#### Step 4: Adjust StudentTopBar (1 hour)
```typescript
// File: OLD/src/components/student/navigation/StudentTopBar.tsx
// Change height from 64dp to 56dp for Premium Minimal
height: 56, // was 64
```

#### Step 5: Update Navigation Config (1 hour)
```typescript
// File: OLD/src/navigation/StudentNavigator.tsx
// Add new screen routes WITHOUT removing old ones

// OLD SCREENS (keep working)
<Stack.Screen name="StudentDashboard" component={StudentDashboard} />
// ... keep all 21 old routes

// NEW SCREENS (add alongside as we create them)
<Stack.Screen name="NewStudentDashboard" component={NewStudentDashboard} />
// ... add all 21 new routes
```

**Phase 0 Deliverables:**
- ✅ 3 premium components created
- ✅ StudentTopBar adjusted to 56dp
- ✅ Navigation config updated (dual routes)
- ✅ TypeScript errors: 0
- ✅ All tests pass

---

### Phase 1: Critical Screens (Weeks 2-4)

#### Week 2: Priority 1 - Student Dashboard

**Current:** `StudentDashboard.tsx` (1,638 lines)
**New:** `NewStudentDashboard.tsx` (~800 lines)

**Analysis File:** `OLD/student_analysis/StudentDashboard_ANALYSIS.md`
**Design Spec:** `OLD/student_analysis/ui_ux_guide.md` (Section 1, lines 1-400)

**Implementation Steps:**
1. Read analysis file to extract all 40+ features
2. Read design spec for Premium Minimal design
3. Create `OLD/src/screens/student/NewStudentDashboard.tsx`
4. Implement 8 sections:
   - Compact Header (56dp frozen)
   - Welcome Summary (collapsible)
   - Today's Classes (horizontal carousel)
   - Assignments Due (compact list)
   - Smart Recommendations (single card)
   - Recent Activity (compact timeline)
   - Quick Access Bar (horizontal scroll)
   - Learning Progress (inline widget)
5. Use Supabase queries (NO mock data):
   ```typescript
   // Summary stats
   const { data: summary } = useQuery({
     queryKey: ['dashboard-summary', studentId],
     queryFn: async () => {
       const [classes, assignments, attendance, streak] = await Promise.all([
         supabase.from('class_sessions').select('*').eq('student_id', studentId),
         supabase.from('assignments').select('*').eq('student_id', studentId).eq('status', 'pending'),
         supabase.from('attendance').select('*').eq('student_id', studentId),
         supabase.from('student_streaks').select('*').eq('student_id', studentId).single(),
       ]);
       return { classes, assignments, attendance, streak };
     },
   });
   ```
6. Add analytics tracking:
   ```typescript
   trackScreenView('NewStudentDashboard', { userId: studentId });
   trackAction('view_class', 'NewStudentDashboard', { classId });
   ```
7. Add accessibility labels:
   ```typescript
   <TouchableOpacity
     accessibilityRole="button"
     accessibilityLabel="Join Math class at 9 AM"
     accessibilityHint="Double tap to join live class"
   />
   ```
8. Apply ACCEPTANCE_CHECKLIST.md
9. Test on real device
10. Commit and push

**Deliverables:**
- ✅ NewStudentDashboard.tsx created (~800 lines)
- ✅ 56dp frozen UI (69% reduction)
- ✅ 92% content area
- ✅ All 40+ features working
- ✅ Real Supabase data
- ✅ 100% accessibility labeled
- ✅ Analytics tracked
- ✅ TypeScript errors: 0
- ✅ Tested on device
- ✅ No console errors

---

#### Week 3: Priority 2 - Schedule Screen

**Current:** `ScheduleScreen.tsx` (2,141 lines - LARGEST!)
**New:** `NewScheduleScreen.tsx` (~900 lines)

**Analysis File:** `OLD/student_analysis/ScheduleScreen_ANALYSIS.md`
**Design Spec:** `OLD/student_analysis/ui_ux_guide.md` (Section 2)

**Implementation Steps:**
1. Read analysis file (complex screen with calendar + agenda)
2. Create `OLD/src/screens/student/NewScheduleScreen.tsx`
3. Implement sections:
   - Compact Header (56dp)
   - Calendar Strip (horizontal date selector)
   - Day Agenda List (events for selected date)
   - Filter Bottom Sheet (subjects, types)
4. Use Supabase queries:
   ```typescript
   const { data: events } = useQuery({
     queryKey: ['schedule-events', studentId, selectedDate],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('class_sessions')
         .select('*, subjects(*), teachers(*)')
         .eq('student_id', studentId)
         .gte('start_time', selectedDate)
         .lt('start_time', nextDay)
         .order('start_time', { ascending: true });
       if (error) throw error;
       return data;
     },
   });
   ```
5. Add analytics and accessibility
6. Apply ACCEPTANCE_CHECKLIST.md
7. Test and commit

**Deliverables:**
- ✅ NewScheduleScreen.tsx created (~900 lines, down from 2,141)
- ✅ Calendar + agenda working
- ✅ Filter bottom sheet functional
- ✅ Real Supabase data
- ✅ All checklist items passed

---

#### Week 4: Priority 3 - Class Detail Screen

**Current:** `ClassDetailScreen.tsx` (861 lines)
**New:** `NewClassDetailScreen.tsx` (~500 lines)

**Analysis File:** `OLD/student_analysis/ClassDetailScreen_ANALYSIS.md`
**Design Spec:** `OLD/student_analysis/ui_ux_guide.md` (Section 3)

**Implementation Steps:**
1. Read analysis file
2. Create `OLD/src/screens/student/NewClassDetailScreen.tsx`
3. Implement sections:
   - Compact Header with Join button (56dp)
   - Class Info Card (subject, teacher, time, duration)
   - Materials Section (PDFs, videos, links)
   - Assignment Section (related assignments)
   - Attendance Status
4. Use Supabase queries:
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
5. Add analytics and accessibility
6. Apply ACCEPTANCE_CHECKLIST.md
7. Test and commit

**Deliverables:**
- ✅ NewClassDetailScreen.tsx created (~500 lines)
- ✅ Join button functional
- ✅ All materials displayed
- ✅ Real Supabase data
- ✅ All checklist items passed

---

### Phase 2: High Priority Screens (Weeks 5-7)

#### Week 5: Assignment Detail Screen
- **File:** `NewAssignmentDetailScreen.tsx`
- **Target:** ~400 lines
- **Analysis:** `AssignmentDetailScreen_ANALYSIS.md`

#### Week 6: Progress Detail Screen
- **File:** `NewProgressDetailScreen.tsx`
- **Target:** ~800 lines
- **Analysis:** `ProgressDetailScreen_ANALYSIS.md`

#### Week 7: Study Library Screen
- **File:** `NewStudyLibraryScreen.tsx`
- **Target:** ~650 lines
- **Analysis:** `StudyLibraryScreen_ANALYSIS.md`

---

### Phase 3: Medium Priority Screens (Weeks 8-10)

#### Week 8: AI Screens (2 screens)
- **File 1:** `NewAIStudyScreen.tsx` (~600 lines)
- **File 2:** `NewAITutorChat.tsx` (~400 lines)

#### Week 9: Collaboration Screens (2 screens)
- **File 1:** `NewAILearningDashboard.tsx` (~550 lines)
- **File 2:** `NewCollaborativeAssignment.tsx` (~900 lines)

#### Week 10: Social Screens (2 screens)
- **File 1:** `NewPeerLearningNetwork.tsx` (~750 lines)
- **File 2:** `NewVirtualClassroom.tsx` (~600 lines)

---

### Phase 4: Critical Live Class Screen (Week 11)

#### Week 11: Live Class Screen (MOST COMPLEX!)
- **Current:** `StudentLiveClassScreen.tsx` (2,703 lines - 2nd LARGEST!)
- **New:** `NewLiveClassScreen.tsx` (~1,200 lines)
- **Complexity:** Very High (video, chat, polls, whiteboard)
- **Analysis:** `StudentLiveClassScreen_ANALYSIS.md`
- **Time:** 2 weeks (extra time for complexity)

---

### Phase 5: Low Priority Screens (Week 12)

#### Week 12: Remaining 6 Screens
- `NewInteractiveClassroom.tsx` (~550 lines)
- `NewGamifiedLearningHub.tsx` (~700 lines)
- `NewEnhancedAIStudy.tsx` (~600 lines)
- `NewEnhancedLiveClass.tsx` (~550 lines)
- `NewEnhancedSchedule.tsx` (~500 lines)
- `NewActivityDetail.tsx` (~550 lines)
- `NewSimpleDoubt.tsx` (~300 lines)
- `NewDoubtSubmission.tsx` (~350 lines)

---

## ✅ Universal Acceptance Checklist (ALL SCREENS)

Before marking ANY screen complete, verify:

### Data Requirements
- [ ] ❌ NO mock data (no hardcoded arrays)
- [ ] ✅ Real Supabase queries using `useQuery`
- [ ] ✅ Loading states handled (BaseScreen wrapper)
- [ ] ✅ Error states handled (BaseScreen wrapper)
- [ ] ✅ Empty states handled (BaseScreen wrapper)

### UI Requirements
- [ ] ✅ Frozen UI ≤ 56dp (compact header only)
- [ ] ✅ Content area ≥ 90%
- [ ] ✅ All touch targets ≥ 48dp (WCAG AAA)
- [ ] ✅ No nested scrolling (single ScrollView)
- [ ] ✅ FlatList optimized (if list screen)

### Accessibility Requirements
- [ ] ✅ 100% of buttons have `accessibilityLabel`
- [ ] ✅ 100% of buttons have `accessibilityHint`
- [ ] ✅ 100% of buttons have `accessibilityRole`
- [ ] ✅ Section headings use `accessibilityRole="header"`
- [ ] ✅ Color is not the only indicator (text + icon)
- [ ] ✅ Text contrast ≥ 7:1 (WCAG AAA)

### Analytics Requirements
- [ ] ✅ Screen view tracked (`trackScreenView`)
- [ ] ✅ All button taps tracked (`trackAction`)
- [ ] ✅ Navigation tracked (before `safeNavigate`)

### Navigation Requirements
- [ ] ✅ Uses `safeNavigate` (no direct `navigation.navigate`)
- [ ] ✅ Navigation params validated
- [ ] ✅ Back button handled properly

### Code Quality Requirements
- [ ] ✅ TypeScript errors: 0
- [ ] ✅ ESLint warnings: 0
- [ ] ✅ Components memoized (`React.memo`)
- [ ] ✅ Callbacks memoized (`useCallback`)
- [ ] ✅ Expensive computations memoized (`useMemo`)

### Testing Requirements
- [ ] ✅ Tested on real device (not just emulator)
- [ ] ✅ Tested with VoiceOver/TalkBack (accessibility)
- [ ] ✅ Tested pull-to-refresh
- [ ] ✅ Tested with no internet (error states)
- [ ] ✅ Tested with empty data (empty states)
- [ ] ✅ No console errors
- [ ] ✅ No console warnings

---

## 📂 File Naming Convention

### Screens
- **Old screens:** Keep as-is (e.g., `StudentDashboard.tsx`)
- **New screens:** Prefix with `New` (e.g., `NewStudentDashboard.tsx`)
- **Location:** `OLD/src/screens/student/`

### Components
- **Premium components:** `OLD/src/components/student/molecules/premium/`
- **Naming:** Descriptive (e.g., `EventCard.tsx`, `HorizontalCarousel.tsx`)

### Analysis Files
- **Location:** `OLD/student_analysis/`
- **Naming:** `{ScreenName}_ANALYSIS.md`

### Design Specs
- **Main guide:** `OLD/student_analysis/ui_ux_guide.md`

---

## 🚀 How To Implement Each Screen (Standard Process)

### Step 1: Prepare (5 minutes)
```bash
# Ensure you're on the correct branch
git checkout claude/student-recreation-premium-minimal

# Read the analysis file
# Example: OLD/student_analysis/StudentDashboard_ANALYSIS.md

# Read the design spec section
# Example: OLD/student_analysis/ui_ux_guide.md (Section 1)
```

### Step 2: Create Screen File (2-6 hours depending on complexity)
```bash
# Create new screen file
touch OLD/src/screens/student/NewStudentDashboard.tsx
```

### Step 3: Implement Following Premium Minimal Design
```typescript
// Template structure for ALL screens:

import React, { useEffect } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Col } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';
import { supabase } from '../../lib/supabase';

// Import components
import { CompactHeader } from '../../components/student/navigation/CompactHeader';
// ... other components

const NewStudentDashboard: React.FC = () => {
  // Track screen view
  useEffect(() => {
    trackScreenView('NewStudentDashboard', { userId: user?.id });
  }, []);

  // Fetch data with Supabase
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-data', studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('table_name')
        .select('*')
        .eq('student_id', studentId);
      if (error) throw error;
      return data;
    },
  });

  return (
    <BaseScreen loading={isLoading} error={error} empty={!data}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <Col sx={{ p: 'xl', gap: 'md' }}>
          {/* Section 1: Compact Header */}
          <CompactHeader
            title="Dashboard"
            onNotificationsPress={() => {
              trackAction('view_notifications', 'NewStudentDashboard');
              safeNavigate('Notifications');
            }}
          />

          {/* Section 2: Content sections */}
          {/* ... */}
        </Col>
      </ScrollView>
    </BaseScreen>
  );
};

export default NewStudentDashboard;
```

### Step 4: Add Analytics Tracking
```typescript
// Track screen view on mount
trackScreenView('NewStudentDashboard', { userId: user?.id });

// Track button taps
trackAction('view_class', 'NewStudentDashboard', { classId });
trackAction('join_class', 'NewStudentDashboard', { classId });
```

### Step 5: Add Accessibility Labels
```typescript
<TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel="Join Mathematics class at 9 AM"
  accessibilityHint="Double tap to join live class"
  onPress={() => handleJoinClass(classId)}
>
```

### Step 6: Test (30 minutes)
```bash
# Run TypeScript check
cd OLD/
npx tsc --noEmit

# Run the app
npm start
npm run android

# Test in app:
# ✅ Navigate to new screen
# ✅ Verify data loads from Supabase
# ✅ Verify all buttons work
# ✅ Verify analytics fire (check console)
# ✅ Test with VoiceOver/TalkBack
# ✅ Test pull-to-refresh
# ✅ Test empty/error states
```

### Step 7: Apply Acceptance Checklist (10 minutes)
Go through ACCEPTANCE_CHECKLIST.md and verify ALL items

### Step 8: Commit (5 minutes)
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

## 📊 Progress Tracking

### Week-by-Week Checklist

**Week 1: Foundation**
- [ ] Create branch
- [ ] Create 3 premium components
- [ ] Adjust StudentTopBar to 56dp
- [ ] Update navigation config

**Week 2: Dashboard**
- [ ] Create NewStudentDashboard.tsx
- [ ] Test on device
- [ ] Apply checklist
- [ ] Commit and push

**Week 3: Schedule**
- [ ] Create NewScheduleScreen.tsx
- [ ] Test on device
- [ ] Apply checklist
- [ ] Commit and push

**Week 4: Class Detail**
- [ ] Create NewClassDetailScreen.tsx
- [ ] Test on device
- [ ] Apply checklist
- [ ] Commit and push

**Week 5: Assignment Detail**
- [ ] Create NewAssignmentDetailScreen.tsx
- [ ] Test on device
- [ ] Apply checklist
- [ ] Commit and push

**Week 6: Progress Detail**
- [ ] Create NewProgressDetailScreen.tsx
- [ ] Test on device
- [ ] Apply checklist
- [ ] Commit and push

**Week 7: Study Library**
- [ ] Create NewStudyLibraryScreen.tsx
- [ ] Test on device
- [ ] Apply checklist
- [ ] Commit and push

**Week 8: AI Screens**
- [ ] Create NewAIStudyScreen.tsx
- [ ] Create NewAITutorChat.tsx
- [ ] Test on device
- [ ] Apply checklist
- [ ] Commit and push

**Week 9: Collaboration Screens**
- [ ] Create NewAILearningDashboard.tsx
- [ ] Create NewCollaborativeAssignment.tsx
- [ ] Test on device
- [ ] Apply checklist
- [ ] Commit and push

**Week 10: Social Screens**
- [ ] Create NewPeerLearningNetwork.tsx
- [ ] Create NewVirtualClassroom.tsx
- [ ] Test on device
- [ ] Apply checklist
- [ ] Commit and push

**Week 11: Live Class**
- [ ] Create NewLiveClassScreen.tsx
- [ ] Test on device
- [ ] Apply checklist
- [ ] Commit and push

**Week 12: Remaining Screens**
- [ ] Create 6 remaining screens
- [ ] Test on device
- [ ] Apply checklist
- [ ] Commit and push

---

## 🎯 Success Metrics

### After Each Screen:
- ✅ TypeScript errors: 0
- ✅ ESLint warnings: 0
- ✅ Frozen UI ≤ 56dp
- ✅ Content area ≥ 90%
- ✅ All touch targets ≥ 48dp
- ✅ Accessibility labels: 100%
- ✅ Analytics tracked: 100%
- ✅ Load time < 1s
- ✅ No console errors

### After All 21 Screens:
- ✅ Total LOC reduced by 48% (~14,000 vs ~27,000)
- ✅ Average frozen UI reduced by 61% (71dp vs 180dp)
- ✅ Average content area increased by 37% (89% vs 65%)
- ✅ 100% WCAG AAA compliance
- ✅ 100% analytics coverage
- ✅ 50% faster load times
- ✅ 70% less scrolling required
- ✅ 100% of actions within 2 taps

---

## 🚨 Critical Rules - NEVER BREAK

### 1. NO Mock Data ❌
```typescript
// ❌ FORBIDDEN
const students = [{ id: '1', name: 'Test' }];

// ✅ REQUIRED - Real Supabase queries
const { data: students } = useQuery({
  queryKey: ['students'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*');
    if (error) throw error;
    return data;
  },
});
```

### 2. ALWAYS Use BaseScreen Wrapper ✅
```typescript
// ❌ FORBIDDEN - Manual state handling
if (isLoading) return <ActivityIndicator />;

// ✅ REQUIRED - BaseScreen wrapper
<BaseScreen loading={isLoading} error={error} empty={!data}>
  <Content />
</BaseScreen>
```

### 3. ALWAYS Use Safe Navigation ✅
```typescript
// ❌ FORBIDDEN
navigation.navigate('ClassDetail', { classId });

// ✅ REQUIRED
trackAction('view_class', 'NewStudentDashboard', { classId });
safeNavigate('ClassDetail', { classId });
```

### 4. ALWAYS Add Accessibility Labels ✅
```typescript
// ❌ FORBIDDEN
<TouchableOpacity onPress={handlePress}>
  <Text>Join</Text>
</TouchableOpacity>

// ✅ REQUIRED
<TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel="Join Math class at 9 AM"
  accessibilityHint="Double tap to join live class"
  onPress={handlePress}
>
  <Text>Join</Text>
</TouchableOpacity>
```

### 5. ALWAYS Track Analytics ✅
```typescript
// ❌ FORBIDDEN - Navigation without tracking
safeNavigate('ClassDetail', { classId });

// ✅ REQUIRED - Track before navigate
trackAction('view_class', 'NewStudentDashboard', { classId });
safeNavigate('ClassDetail', { classId });
```

### 6. ALWAYS Apply Acceptance Checklist ✅
Before marking ANY screen complete, verify ALL checklist items

---

## 📝 Notes

- **Gradual Replacement:** Keep old screens working, create new ones alongside
- **No Breaking Changes:** Old screens stay until new versions are tested and approved
- **Safe Rollback:** Can switch back to old screens if issues arise
- **Incremental Testing:** Test each new screen as it's built
- **Flexible Timeline:** No pressure to finish all at once
- **Learn and Improve:** Apply lessons from each screen to the next

---

## 🎉 End Goal

After completing all 21 screens, students will have:
- ✅ **50% faster** access to information
- ✅ **70% less scrolling** required
- ✅ **100% of actions** within 2 taps
- ✅ **Perfect accessibility** (WCAG AAA)
- ✅ **One-handed** mobile operation
- ✅ **Delightful** user experience
- ✅ **Fast and responsive** app (<1s load times)

---

**Ready to start? Begin with Phase 0: Foundation Setup!** 🚀

# ClassDetailScreen - Test Cases & Validation Guide

**Screen:** ClassDetailScreen.tsx
**Date:** 2025-11-01
**Features:** 50+
**Tabs:** 3 (Overview, Doubts, Resources)

---

## 🚀 How to Test the Screen

### Method 1: Navigate from StudentDashboard
```typescript
// In StudentDashboard.tsx or any student screen:
import { safeNavigate } from '../../utils/navigationService';

// Navigate to ClassDetailScreen with a classId
safeNavigate('ClassDetail', { classId: 'class_123' });
```

### Method 2: Test via ComponentTestScreen
```typescript
// Add to ComponentTestScreen.tsx:
<Button
  variant="filled"
  onPress={() => navigation.navigate('ClassDetail', {
    classId: 'your-test-class-id'
  })}
>
  Test ClassDetailScreen
</Button>
```

### Method 3: Deep Link (if configured)
```bash
# Android
adb shell am start -W -a android.intent.action.VIEW -d "manushi://class/class_123"
```

---

## ✅ TEST CASES (50+ Features)

### **TAB 1: OVERVIEW TAB (10 Test Cases)**

#### TC-01: Class Header Display
**Feature:** Display class subject, teacher, schedule, duration
**Steps:**
1. Navigate to ClassDetail screen with valid classId
2. Observe the header card at top
**Expected Result:**
- ✅ Subject name displayed (e.g., "Mathematics")
- ✅ Teacher name displayed (e.g., "Teacher: John Doe")
- ✅ Schedule displayed with date/time (e.g., "Mon, Nov 1, 10:00 AM")
- ✅ Duration displayed (e.g., "⏱️ 60 minutes")
**Priority:** P0 (Critical)

---

#### TC-02: Class Status Badge
**Feature:** Show class status (upcoming/live/completed)
**Steps:**
1. Test with 3 different classes:
   - Class scheduled in future
   - Class currently in session
   - Class that ended
**Expected Result:**
- ✅ UPCOMING badge (blue) for future classes
- ✅ LIVE badge (red) for classes in session
- ✅ COMPLETED badge (green) for past classes
**Priority:** P0 (Critical)

---

#### TC-03: Class Description Display
**Feature:** Show class description if available
**Steps:**
1. Test with class that has description
2. Test with class without description
**Expected Result:**
- ✅ Description text appears below duration (if exists)
- ✅ No description text if null (graceful handling)
**Priority:** P1 (High)

---

#### TC-04: Attendance Status Display
**Feature:** Show student's attendance status for this class
**Steps:**
1. Test with student marked present
2. Test with student marked absent
3. Test with student marked late
4. Test with no attendance record
**Expected Result:**
- ✅ PRESENT badge (green) if status = 'present'
- ✅ ABSENT badge (red) if status = 'absent'
- ✅ LATE badge (yellow) if status = 'late'
- ✅ No attendance badge if no record
- ✅ Attendance timestamp displayed (e.g., "Marked at: 10:05 AM")
**Priority:** P0 (Critical)

---

#### TC-05: Overview Tab - Class Information Card
**Feature:** Display detailed class info in card format
**Steps:**
1. Switch to Overview tab (should be default)
2. Scroll to "Class Information" card
**Expected Result:**
- ✅ Card shows 5 rows:
  - Subject: (class subject)
  - Teacher: (teacher name)
  - Schedule: (formatted date/time)
  - Duration: (minutes)
  - Status: (UPCOMING/LIVE/COMPLETED)
**Priority:** P0 (Critical)

---

#### TC-06: Overview Tab - Attendance Info Card
**Feature:** Display detailed attendance info
**Steps:**
1. View Overview tab with attendance record
2. Check attendance info card
**Expected Result:**
- ✅ Attendance status badge visible
- ✅ "Marked at:" timestamp visible
- ✅ Card doesn't show if no attendance record
**Priority:** P1 (High)

---

#### TC-07: Loading State (Overview Tab)
**Feature:** Show loading indicator while fetching data
**Steps:**
1. Clear cache
2. Navigate to ClassDetail
3. Observe loading state
**Expected Result:**
- ✅ BaseScreen shows loading spinner
- ✅ "Loading..." or skeleton appears
- ✅ No content shows until data loads
**Priority:** P0 (Critical)

---

#### TC-08: Error State (Overview Tab)
**Feature:** Show error message if data fetch fails
**Steps:**
1. Navigate with invalid classId
2. Or disconnect internet before loading
**Expected Result:**
- ✅ Error message appears: "Failed to load class details"
- ✅ Retry button visible
- ✅ Clicking retry refetches data
**Priority:** P0 (Critical)

---

#### TC-09: Empty State (No Class Data)
**Feature:** Show empty state if class doesn't exist
**Steps:**
1. Navigate with non-existent classId
**Expected Result:**
- ✅ Empty state appears: "Class not found"
- ✅ No crash, graceful handling
**Priority:** P1 (High)

---

#### TC-10: Real-time Attendance Updates
**Feature:** Attendance updates automatically
**Steps:**
1. Open ClassDetail screen
2. Mark attendance in another session/device
3. Wait 2 minutes (stale time)
**Expected Result:**
- ✅ Attendance status updates automatically
- ✅ No manual refresh needed
**Priority:** P2 (Medium)

---

### **TAB 2: DOUBTS TAB (15 Test Cases)**

#### TC-11: Doubts Tab Navigation
**Feature:** Switch to Doubts tab
**Steps:**
1. Click "Doubts" tab
2. Observe tab highlight
**Expected Result:**
- ✅ Doubts tab becomes active (highlighted)
- ✅ Doubts content appears
- ✅ Other tabs become inactive
**Priority:** P0 (Critical)

---

#### TC-12: Doubts Tab - Badge Count
**Feature:** Show count of open doubts in tab badge
**Steps:**
1. View class with 3 open doubts
2. Check Doubts tab
**Expected Result:**
- ✅ Badge shows "3" next to "Doubts" label
- ✅ Badge color indicates open status (yellow/warning)
**Priority:** P1 (High)

---

#### TC-13: Doubts List Display
**Feature:** Show list of all doubts for this class
**Steps:**
1. Switch to Doubts tab
2. View doubts list
**Expected Result:**
- ✅ All doubts displayed in cards
- ✅ Most recent doubt appears first
- ✅ Each doubt shows: question, status badge, created date
**Priority:** P0 (Critical)

---

#### TC-14: Doubt Card - Open Status
**Feature:** Display open doubt with warning badge
**Steps:**
1. View doubt with status = 'open'
**Expected Result:**
- ✅ Question text visible
- ✅ OPEN badge (yellow) visible
- ✅ No answer section shown
- ✅ "Asked: [date]" timestamp visible
**Priority:** P0 (Critical)

---

#### TC-15: Doubt Card - Answered Status
**Feature:** Display answered doubt with answer and teacher name
**Steps:**
1. View doubt with status = 'answered'
**Expected Result:**
- ✅ Question text visible
- ✅ ANSWERED badge (green) visible
- ✅ Answer section visible with:
  - "Answer:" label
  - Answer text
  - Teacher name (e.g., "- John Doe")
- ✅ "Asked: [date]" timestamp visible
**Priority:** P0 (Critical)

---

#### TC-16: Doubt Card - Closed Status
**Feature:** Display closed doubt
**Steps:**
1. View doubt with status = 'closed'
**Expected Result:**
- ✅ CLOSED badge (blue) visible
- ✅ Appropriate styling for closed state
**Priority:** P1 (High)

---

#### TC-17: "Ask Doubt" Button
**Feature:** Navigate to DoubtSubmission screen
**Steps:**
1. Click "Ask Doubt" button in Doubts tab header
2. Observe navigation
**Expected Result:**
- ✅ Analytics event fires: trackAction('submit_doubt', 'ClassDetailScreen', { classId })
- ✅ Navigates to DoubtSubmission screen
- ✅ Passes classId and subject as params
- ✅ Safe navigation (300ms debounce)
**Priority:** P0 (Critical)

---

#### TC-18: Empty Doubts State
**Feature:** Show empty state when no doubts exist
**Steps:**
1. View class with zero doubts
2. Switch to Doubts tab
**Expected Result:**
- ✅ EmptyState component appears
- ✅ Icon: "help-outline"
- ✅ Title: "No doubts yet"
- ✅ Description: "Ask your first doubt to get help from your teacher"
**Priority:** P1 (High)

---

#### TC-19: Doubts Loading State
**Feature:** Show loading while fetching doubts
**Steps:**
1. Clear cache
2. Switch to Doubts tab
**Expected Result:**
- ✅ LoadingState (skeleton variant) appears
- ✅ Content shows after load completes
**Priority:** P0 (Critical)

---

#### TC-20: Doubts Fetch Error Handling
**Feature:** Handle errors when fetching doubts fails
**Steps:**
1. Disconnect internet
2. Switch to Doubts tab
**Expected Result:**
- ✅ Empty array returned (no crash)
- ✅ Console logs error
- ✅ UI handles gracefully
**Priority:** P1 (High)

---

#### TC-21: Multiple Doubts Rendering
**Feature:** Render multiple doubt cards efficiently
**Steps:**
1. View class with 10+ doubts
2. Switch to Doubts tab
**Expected Result:**
- ✅ All doubts render correctly
- ✅ Scrolling is smooth
- ✅ No performance issues
**Priority:** P1 (High)

---

#### TC-22: Doubts Tab Analytics
**Feature:** Track when user views Doubts tab
**Steps:**
1. Click Doubts tab
2. Check console logs
**Expected Result:**
- ✅ Console shows: trackAction('view_tab', 'ClassDetailScreen', { tab: 'doubts' })
**Priority:** P2 (Medium)

---

#### TC-23: Doubt Question Text Wrapping
**Feature:** Long doubt questions wrap properly
**Steps:**
1. View doubt with very long question (200+ chars)
**Expected Result:**
- ✅ Question text wraps to multiple lines
- ✅ No overflow or truncation
- ✅ Readable formatting
**Priority:** P2 (Medium)

---

#### TC-24: Doubt Answer Formatting
**Feature:** Answer section styled distinctly
**Steps:**
1. View answered doubt
2. Check answer section
**Expected Result:**
- ✅ Answer has blue background (#F0F7FF)
- ✅ "Answer:" label in blue (#0066CC)
- ✅ Teacher name in italic
- ✅ Clear visual separation from question
**Priority:** P2 (Medium)

---

#### TC-25: Doubts Real-time Updates
**Feature:** Doubts list updates when teacher answers
**Steps:**
1. Open Doubts tab
2. Have teacher answer a doubt in another session
3. Wait 3 minutes (stale time)
**Expected Result:**
- ✅ Doubt status updates automatically
- ✅ Answer appears without manual refresh
**Priority:** P2 (Medium)

---

### **TAB 3: RESOURCES TAB (15 Test Cases)**

#### TC-26: Resources Tab Navigation
**Feature:** Switch to Resources tab
**Steps:**
1. Click "Resources" tab
2. Observe tab highlight
**Expected Result:**
- ✅ Resources tab becomes active (highlighted)
- ✅ Resources content appears
- ✅ Other tabs become inactive
**Priority:** P0 (Critical)

---

#### TC-27: Resources Tab - Badge Count
**Feature:** Show count of resources in tab badge
**Steps:**
1. View class with 5 resources
2. Check Resources tab
**Expected Result:**
- ✅ Badge shows "5" next to "Resources" label
- ✅ Badge visible if resources exist
**Priority:** P1 (High)

---

#### TC-28: Resources List Display
**Feature:** Show list of all class resources
**Steps:**
1. Switch to Resources tab
2. View resources list
**Expected Result:**
- ✅ All resources displayed in cards
- ✅ Most recent resource appears first
- ✅ Each resource shows: icon, title, description, added date
**Priority:** P0 (Critical)

---

#### TC-29: Resource Card - PDF Type
**Feature:** Display PDF resource with PDF icon
**Steps:**
1. View resource with type = 'pdf'
**Expected Result:**
- ✅ PDF icon (📄) visible
- ✅ Resource title visible
- ✅ Description visible (if exists)
- ✅ "Added: [date]" timestamp visible
**Priority:** P0 (Critical)

---

#### TC-30: Resource Card - Video Type
**Feature:** Display video resource with video icon
**Steps:**
1. View resource with type = 'video'
**Expected Result:**
- ✅ Video icon (🎥) visible
- ✅ Resource title visible
- ✅ Description visible (if exists)
- ✅ "Added: [date]" timestamp visible
**Priority:** P0 (Critical)

---

#### TC-31: Resource Card - Link Type
**Feature:** Display link resource with link icon
**Steps:**
1. View resource with type = 'link'
**Expected Result:**
- ✅ Link icon (🔗) visible
- ✅ Resource title visible
- ✅ Description visible (if exists)
- ✅ "Added: [date]" timestamp visible
**Priority:** P0 (Critical)

---

#### TC-32: View PDF Resource
**Feature:** Navigate to resource viewer for PDFs
**Steps:**
1. Tap on PDF resource card
2. Observe navigation
**Expected Result:**
- ✅ Analytics event fires: trackAction('view_resource', 'ClassDetailScreen', { resourceId, type: 'pdf' })
- ✅ Navigates to ResourceViewer screen
- ✅ Passes resourceId as param
- ✅ Safe navigation (300ms debounce)
**Priority:** P0 (Critical)

---

#### TC-33: View Video Resource
**Feature:** Navigate to resource viewer for videos
**Steps:**
1. Tap on video resource card
2. Observe navigation
**Expected Result:**
- ✅ Analytics event fires: trackAction('view_resource', 'ClassDetailScreen', { resourceId, type: 'video' })
- ✅ Navigates to ResourceViewer screen
- ✅ Passes resourceId as param
**Priority:** P0 (Critical)

---

#### TC-34: Open External Link
**Feature:** Open external links in browser
**Steps:**
1. Tap on link resource card
2. Observe behavior
**Expected Result:**
- ✅ Analytics event fires: trackAction('view_resource', 'ClassDetailScreen', { resourceId, type: 'link' })
- ✅ Opens link in external browser (Linking.openURL)
- ✅ Falls back gracefully if URL invalid
**Priority:** P0 (Critical)

---

#### TC-35: Resource Description Optional
**Feature:** Resources without descriptions display correctly
**Steps:**
1. View resource with null description
**Expected Result:**
- ✅ Title and icon visible
- ✅ No description text shown
- ✅ No crash or error
**Priority:** P1 (High)

---

#### TC-36: Empty Resources State
**Feature:** Show empty state when no resources exist
**Steps:**
1. View class with zero resources
2. Switch to Resources tab
**Expected Result:**
- ✅ EmptyState component appears
- ✅ Icon: "folder-open"
- ✅ Title: "No resources yet"
- ✅ Description: "Resources will appear here when your teacher uploads them"
**Priority:** P1 (High)

---

#### TC-37: Resources Loading State
**Feature:** Show loading while fetching resources
**Steps:**
1. Clear cache
2. Switch to Resources tab
**Expected Result:**
- ✅ LoadingState (skeleton variant) appears
- ✅ Content shows after load completes
**Priority:** P0 (Critical)

---

#### TC-38: Resources Fetch Error Handling
**Feature:** Handle errors when fetching resources fails
**Steps:**
1. Disconnect internet
2. Switch to Resources tab
**Expected Result:**
- ✅ Empty array returned (no crash)
- ✅ Console logs error
- ✅ UI handles gracefully
**Priority:** P1 (High)

---

#### TC-39: Resources Tab Analytics
**Feature:** Track when user views Resources tab
**Steps:**
1. Click Resources tab
2. Check console logs
**Expected Result:**
- ✅ Console shows: trackAction('view_tab', 'ClassDetailScreen', { tab: 'resources' })
**Priority:** P2 (Medium)

---

#### TC-40: Resource Card Accessibility
**Feature:** Resource cards have proper accessibility labels
**Steps:**
1. Enable TalkBack/VoiceOver
2. Focus on resource card
**Expected Result:**
- ✅ Reads: "View pdf: Introduction to React" (or video/link)
- ✅ accessibilityRole = "button"
- ✅ Navigable via screen reader
**Priority:** P1 (High)

---

### **NAVIGATION & GENERAL (10 Test Cases)**

#### TC-41: Screen View Analytics
**Feature:** Track screen view on mount
**Steps:**
1. Navigate to ClassDetail screen
2. Check console logs immediately
**Expected Result:**
- ✅ Console shows: trackScreenView('ClassDetailScreen', { classId, studentId })
- ✅ Event fires only once per mount
**Priority:** P0 (Critical)

---

#### TC-42: StudentTopBar - Title
**Feature:** Display "Class Details" in top bar
**Steps:**
1. View ClassDetail screen
2. Check top bar
**Expected Result:**
- ✅ Title shows "Class Details"
- ✅ Hamburger menu icon visible (left)
- ✅ Back button visible (if applicable)
**Priority:** P0 (Critical)

---

#### TC-43: StudentTopBar - Back Button
**Feature:** Navigate back to previous screen
**Steps:**
1. Navigate to ClassDetail from StudentDashboard
2. Click back button in top bar
**Expected Result:**
- ✅ Returns to StudentDashboard
- ✅ Safe navigation used
- ✅ No crash or freeze
**Priority:** P0 (Critical)

---

#### TC-44: StudentTopBar - Menu Button
**Feature:** Open drawer navigation
**Steps:**
1. Click hamburger menu icon (left)
2. Observe drawer
**Expected Result:**
- ✅ Student drawer opens
- ✅ Shows navigation menu
**Priority:** P0 (Critical)

---

#### TC-45: StudentBottomNav - Current Route Highlight
**Feature:** Highlight current route in bottom nav
**Steps:**
1. View ClassDetail screen
2. Check bottom navigation bar
**Expected Result:**
- ✅ "ClassDetail" route highlighted (if in bottom nav)
- ✅ Or appropriate parent route highlighted
**Priority:** P1 (High)

---

#### TC-46: Tab Switching Performance
**Feature:** Smooth tab switching with no lag
**Steps:**
1. Rapidly switch between Overview, Doubts, Resources tabs
2. Observe performance
**Expected Result:**
- ✅ Tabs switch instantly
- ✅ No lag or freezing
- ✅ Content loads smoothly
**Priority:** P1 (High)

---

#### TC-47: Memoization - Callbacks
**Feature:** Callbacks don't recreate on re-renders
**Steps:**
1. Use React DevTools Profiler
2. Switch tabs multiple times
**Expected Result:**
- ✅ handleSubmitDoubt, handleViewResource, handleTabChange use useCallback
- ✅ Functions don't recreate on tab switch
**Priority:** P2 (Medium)

---

#### TC-48: Memoization - Computed Values
**Feature:** Computed values use useMemo
**Steps:**
1. Use React DevTools Profiler
2. Switch tabs, observe re-computations
**Expected Result:**
- ✅ formattedSchedule uses useMemo
- ✅ doubtStats uses useMemo
- ✅ Values don't recompute unnecessarily
**Priority:** P2 (Medium)

---

#### TC-49: Query Caching
**Feature:** TanStack Query caches data
**Steps:**
1. View ClassDetail screen (loads data)
2. Navigate away
3. Navigate back within 5 minutes
**Expected Result:**
- ✅ Data loads instantly from cache
- ✅ No loading spinner (stale data shown)
- ✅ Background refetch occurs
**Priority:** P1 (High)

---

#### TC-50: Nullish Coalescing
**Feature:** Numeric values use ?? instead of ||
**Steps:**
1. Review code for numeric operations
2. Check duration_minutes, status checks
**Expected Result:**
- ✅ Uses `?? 60` for duration fallback
- ✅ No || operator for numbers
- ✅ Zero values handled correctly
**Priority:** P2 (Medium)

---

## 📊 TEST EXECUTION CHECKLIST

### Prerequisites
- [ ] ClassDetailScreen.tsx deployed
- [ ] Supabase tables exist (classes, attendance, doubts, resources)
- [ ] Test data created (at least 1 class with all related data)
- [ ] Navigation configured
- [ ] Device/emulator ready

### Execution
- [ ] All 50 test cases executed
- [ ] Pass/Fail status recorded for each
- [ ] Screenshots captured for UI tests
- [ ] Console logs verified for analytics
- [ ] Accessibility tested with TalkBack/VoiceOver

### Results Summary
- Total Tests: 50
- Passed: __/50
- Failed: __/50
- Blocked: __/50
- Pass Rate: __%

---

## 🐛 BUG REPORT TEMPLATE

**Bug ID:** BUG-XXX
**Test Case:** TC-XX
**Severity:** P0/P1/P2
**Description:** [What went wrong]
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3
**Expected Result:** [What should happen]
**Actual Result:** [What actually happened]
**Screenshots/Logs:** [Attach if available]
**Device:** [Android/iOS version]

---

## ✅ QUICK TEST NAVIGATION

To quickly test ClassDetailScreen, add this to StudentDashboard.tsx:

```typescript
// Temporary test button
<Button
  variant="filled"
  onPress={() => {
    trackAction('test_class_detail', 'StudentDashboard');
    safeNavigate('ClassDetail', {
      classId: 'your-test-class-id-here'
    });
  }}
>
  🧪 Test ClassDetailScreen
</Button>
```

Or use ComponentTestScreen.tsx for a dedicated test interface.

---

**Created:** 2025-11-01
**Last Updated:** 2025-11-01
**Status:** Ready for Testing

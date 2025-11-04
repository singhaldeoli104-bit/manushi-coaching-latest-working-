# Test Checklist - NewParentDashboard Enhancement 🧪

**Manual tests to verify all features work correctly**

Last Updated: October 22, 2025

---

## 📋 How to Use This Document

- **Before Testing:** Ensure app is running (`npx react-native run-android`)
- **Test Order:** Follow sections from top to bottom
- **Mark Results:** ✅ Pass | ❌ Fail | ⏳ Not Yet Implemented
- **Report Issues:** Note any errors in "Issues Found" section at bottom

---

## 🎯 Test Environment Setup

### Prerequisites
- [ ] App installed on device/emulator
- [ ] Logged in as a parent user
- [ ] Parent has at least 1 child in database
- [ ] Internet connection active (for Supabase)
- [ ] Logcat/console open to monitor errors

### Test Data Required
- [ ] Valid parent account with `parent_id` in Supabase
- [ ] At least 1 student linked to parent in `students` table
- [ ] `profiles` table has parent's name/email

---

## 🎉 IMPLEMENTATION STATUS - Updated Oct 22, 2025

### ✅ COMPLETED SECTIONS:
1. **Welcome Section** - IMPLEMENTED & READY FOR TESTING
2. **Children Progress Cards** - IMPLEMENTED & READY FOR TESTING
3. **Action Items Section** - IMPLEMENTED & READY FOR TESTING
4. **Recent Communications Section** - IMPLEMENTED & READY FOR TESTING

### 📊 Implementation Details:
- **File:** `src/screens/parent/NewParentDashboard.tsx` (606 lines)
- **Data Sources:**
  - `useParentDashboard` hook (profile, notifications, financial)
  - `useChildrenSummary` hook (children with detailed stats)
  - `useActionItems` hook (pending action items)
- **NO MOCK DATA** - All real Supabase queries ✅
- **All Modern Patterns** Applied ✅

---

## 📱 NewParentDashboard Tests

### Test Section 1: Screen Load & Navigation ✅ READY TO TEST

**Test 1.1: Dashboard Opens Successfully**
- [ ] Open app
- [ ] Tap on "Home" or "Dashboard" tab
- [ ] NewParentDashboard screen appears
- [ ] No red error screen
- [ ] No console errors in logcat

**Expected:** Screen loads without errors

**Test 1.2: BaseScreen States**
- [ ] On first load, loading spinner/skeleton appears briefly
- [ ] Loading state transitions to content
- [ ] No "Error" state shown (if data loads successfully)

**Expected:** Smooth loading state → content state transition

---

### Test Section 2: Welcome Section ⏳ NOT YET IMPLEMENTED

**Test 2.1: Welcome Message Displays**
- [ ] Welcome section visible at top of screen
- [ ] Greeting shows "Welcome, [Parent Name]!" or similar
- [ ] Parent name loaded from Supabase `profiles` table
- [ ] If no name in database, shows fallback like "Welcome, Parent!"

**Expected:** Personalized welcome message with real parent name

**Test 2.2: Overview Subtitle**
- [ ] Subtitle/description text visible below welcome
- [ ] Text is readable (good contrast)
- [ ] Example: "Here's an overview of your children's progress"

**Expected:** Clear subtitle explaining the dashboard purpose

**How to Test:**
```bash
# Check logcat for welcome section logs
adb logcat | grep "Welcome"

# Verify Supabase query for parent profile
adb logcat | grep "profiles"
```

**Manual Verification:**
1. Open app
2. Navigate to Dashboard
3. Look at top of screen
4. Verify your actual name appears (from database)
5. Try with different parent accounts

---

### Test Section 3: Children Progress Cards ⏳ NOT YET IMPLEMENTED

**Test 3.1: Children Cards Display**
- [ ] Children cards section visible below welcome section
- [ ] One card per child
- [ ] Cards display in scrollable list or grid
- [ ] All children from database shown

**Expected:** Real data from `students` table, one card per child

**Test 3.2: Child Card Content**

For EACH child card, verify:
- [ ] Child's full name displayed
- [ ] Child's photo/avatar (if available) or placeholder
- [ ] Overall grade/GPA shown
- [ ] Attendance rate shown (e.g., "95%")
- [ ] Assignments completed/total (e.g., "8/10 completed")
- [ ] Upcoming exams count (e.g., "2 upcoming exams")
- [ ] Behavior rating (e.g., "Excellent" or star rating)

**Expected:** Complete child overview with real database values

**Test 3.3: Child Card Interactions**

For EACH child card:
- [ ] Tap on card shows modal/alert with child details
- [ ] Modal shows child's Student ID
- [ ] Modal shows child's status
- [ ] "View Progress" button appears in modal
- [ ] Tapping "View Progress" navigates to ChildProgress screen
- [ ] "Cancel" button closes modal

**Expected:** Tap card → Modal → "View Progress" → ChildProgress screen

**Test 3.4: Share Child Progress**
- [ ] Share icon/button visible on each card
- [ ] Tap share icon opens share sheet
- [ ] Share message includes child name
- [ ] Share message includes deep link URL
- [ ] Deep link format: `https://app.manushicoaching.com/parent/child/{childId}/progress`

**Expected:** Share functionality works, deep link generated correctly

**How to Test:**
```bash
# Check children data loading
adb logcat | grep "children"
adb logcat | grep "students"

# Check navigation analytics
adb logcat | grep "view_child_details"
adb logcat | grep "share_child_progress"
```

**Manual Verification:**
1. Count children cards on screen
2. Verify count matches database (query Supabase `students` table)
3. Tap each card, verify modal appears
4. Tap "View Progress", verify navigation to ChildProgress screen
5. Go back, tap share icon, verify share sheet appears
6. Share to Notes/Clipboard, verify deep link is valid URL

---

### Test Section 4: Action Items Section ⏳ NOT YET IMPLEMENTED

**Test 4.1: Action Items Header**
- [ ] "Action Items" or "Tasks" section header visible
- [ ] "View All" button/link visible in header
- [ ] Tapping "View All" navigates to ActionItems screen

**Expected:** Clear section header with "View All" navigation

**Test 4.2: Action Items List**
- [ ] Shows 3-5 most recent/pending action items
- [ ] Real data from `action_items` table in Supabase
- [ ] If no action items, shows empty state message
- [ ] Empty state: "No pending tasks" or similar

**Expected:** Recent action items or empty state (no mock data)

**Test 4.3: Action Item Content**

For EACH action item, verify:
- [ ] Task title/description
- [ ] Due date (if applicable)
- [ ] Priority indicator (High/Medium/Low or color)
- [ ] Status (Pending/Completed)
- [ ] Icon or checkbox indicating completion status

**Expected:** Complete action item details from database

**Test 4.4: Mark Action Item Complete**
- [ ] Tap checkbox or "Mark Complete" button
- [ ] Item updates to "Completed" status
- [ ] Analytics event tracked (`mark_action_item_complete`)
- [ ] Item removed from list or moves to bottom
- [ ] Database updated (Supabase mutation)

**Expected:** Action item marked complete, database updated

**How to Test:**
```bash
# Check action items loading
adb logcat | grep "action_items"

# Check completion analytics
adb logcat | grep "mark_action_item_complete"

# Check "View All" navigation
adb logcat | grep "view_all_action_items"
```

**Manual Verification:**
1. Check if action items section appears
2. Count items shown (should be ≤ 5 most recent)
3. Tap "View All", verify navigation to ActionItems screen
4. Go back, tap checkbox on an item
5. Verify item status changes
6. Reopen app, verify item still marked complete (persisted)

**Database Verification:**
```sql
-- Query Supabase to verify action item exists
SELECT * FROM action_items WHERE parent_id = 'YOUR_PARENT_ID' LIMIT 5;
```

---

### Test Section 5: Recent Communications Section ⏳ NOT YET IMPLEMENTED

**Test 5.1: Communications Header**
- [ ] "Recent Messages" or "Communications" section header visible
- [ ] "View All Messages" button/link visible
- [ ] Tapping "View All Messages" navigates to MessagesList screen

**Expected:** Clear section header with navigation

**Test 5.2: Communications List**
- [ ] Shows 3-5 most recent messages
- [ ] Real data from `communications` table in Supabase
- [ ] If no messages, shows empty state
- [ ] Empty state: "No recent messages" or similar

**Expected:** Recent messages or empty state (no mock data)

**Test 5.3: Message Content**

For EACH message, verify:
- [ ] Sender name (teacher/admin name)
- [ ] Message subject/title
- [ ] Preview of message body (first 1-2 lines)
- [ ] Timestamp or date sent
- [ ] Read/unread indicator (dot, bold text, etc.)
- [ ] Priority indicator (if high priority message)

**Expected:** Complete message preview from database

**Test 5.4: Message Interaction**
- [ ] Tap message item navigates to MessageDetail screen
- [ ] Analytics event tracked (`view_message`)
- [ ] Message marked as "read" after viewing
- [ ] Back button returns to dashboard

**Expected:** Tap message → MessageDetail screen, marked as read

**How to Test:**
```bash
# Check messages loading
adb logcat | grep "communications"
adb logcat | grep "messages"

# Check navigation analytics
adb logcat | grep "view_message"
adb logcat | grep "view_all_messages"
```

**Manual Verification:**
1. Check if messages section appears
2. Count messages shown (should be ≤ 5 most recent)
3. Verify unread messages have indicator
4. Tap a message, verify navigation to MessageDetail
5. Go back, verify message now marked as read
6. Tap "View All Messages", verify navigation to MessagesList

**Database Verification:**
```sql
-- Query Supabase to verify messages exist
SELECT * FROM communications
WHERE recipient_id = 'YOUR_PARENT_ID'
ORDER BY created_at DESC
LIMIT 5;
```

---

### Test Section 6: Analytics Tracking ⏳

**Test 6.1: Screen View Tracked**
- [ ] Open NewParentDashboard
- [ ] Check logcat for screen view event
- [ ] Event: `view_parent_dashboard` or similar

**Expected:** Screen view tracked on mount

**Test 6.2: User Actions Tracked**

Verify these analytics events in logcat:
- [ ] `view_child_details` - When child card tapped
- [ ] `share_child_progress` - When share button tapped
- [ ] `view_all_children` - When "View All" children tapped
- [ ] `view_all_action_items` - When "View All" action items tapped
- [ ] `mark_action_item_complete` - When action item checked
- [ ] `view_all_messages` - When "View All Messages" tapped
- [ ] `view_message` - When message tapped

**Expected:** All user interactions tracked

**How to Test:**
```bash
# Monitor all analytics events
adb logcat | grep "Analytics"
adb logcat | grep "trackAction"
```

---

### Test Section 7: Performance ⏳

**Test 7.1: Loading Speed**
- [ ] Dashboard loads within 2 seconds (on good network)
- [ ] No noticeable lag when scrolling
- [ ] No UI freezes or jank

**Expected:** Smooth, fast user experience

**Test 7.2: Memory Usage**
- [ ] App doesn't crash on low-memory devices
- [ ] No memory leaks (reopen dashboard 10+ times)
- [ ] Images load efficiently (if showing child photos)

**Expected:** Stable performance, no crashes

**Test 7.3: Offline Behavior**
- [ ] Turn off internet
- [ ] Reopen dashboard
- [ ] Error state appears (from BaseScreen)
- [ ] "Retry" button visible
- [ ] Turn on internet
- [ ] Tap "Retry"
- [ ] Data loads successfully

**Expected:** Graceful offline handling

---

### Test Section 8: Edge Cases ⏳

**Test 8.1: No Children**
- [ ] Test with parent account that has 0 children
- [ ] Children section shows empty state
- [ ] Empty state message: "No children found" or similar
- [ ] "Add Child" action (if applicable)

**Expected:** Graceful empty state, no crashes

**Test 8.2: No Action Items**
- [ ] Parent has no pending action items
- [ ] Action items section shows empty state
- [ ] Empty state message: "No pending tasks"

**Expected:** Empty state displayed correctly

**Test 8.3: No Messages**
- [ ] Parent has no messages
- [ ] Messages section shows empty state
- [ ] Empty state message: "No recent messages"

**Expected:** Empty state displayed correctly

**Test 8.4: Data Loading Error**
- [ ] Simulate Supabase error (disconnect, RLS issue, etc.)
- [ ] Error state appears (from BaseScreen)
- [ ] Error message explains issue
- [ ] "Retry" button visible

**Expected:** Error state handled gracefully

**Test 8.5: Long Names**
- [ ] Test with very long parent name (50+ characters)
- [ ] Welcome section doesn't overflow
- [ ] Text truncates with "..." if needed

**Expected:** No UI breaking with long text

---

## 🔍 Cross-Feature Tests

### Test CF.1: Navigation Flow
- [ ] Dashboard → Child Card → ChildProgress → Back to Dashboard
- [ ] Dashboard → View All Children → ChildrenList → Back
- [ ] Dashboard → View All Messages → MessagesList → Message → Back
- [ ] Dashboard → View All Action Items → ActionItems → Back

**Expected:** All navigation works, back button returns correctly

### Test CF.2: Deep Linking
- [ ] Share child progress, copy link
- [ ] Close app completely
- [ ] Open link in browser or paste in another app
- [ ] App opens and navigates to ChildProgress screen

**Expected:** Deep link opens correct screen with correct child

### Test CF.3: State Persistence
- [ ] Navigate to Dashboard
- [ ] Force kill app (swipe away from recents)
- [ ] Reopen app
- [ ] App reopens on Dashboard (state restored)

**Expected:** Navigation state persists across app restarts

---

## 📊 Acceptance Criteria

### Data Layer ✅
- [ ] NO mock data anywhere (all real Supabase queries)
- [ ] useQuery hooks for all data fetching
- [ ] Query keys use parentQueries factory
- [ ] Zod validation on all data
- [ ] Error handling for all queries

### UI/UX States ✅
- [ ] BaseScreen wrapper used
- [ ] Loading state displays correctly
- [ ] Error state displays correctly
- [ ] Empty states display correctly
- [ ] Success state displays correctly

### Accessibility ✅
- [ ] All icon buttons have accessibilityLabel
- [ ] All tap targets ≥ 48dp
- [ ] Text has good contrast (WCAG AA)
- [ ] Screen reader reads content in logical order

### Performance ✅
- [ ] Components memoized (React.memo)
- [ ] Heavy computations memoized (useMemo)
- [ ] Callbacks memoized (useCallback)
- [ ] No unnecessary re-renders
- [ ] Images optimized

### Analytics ✅
- [ ] Screen view tracked on mount
- [ ] All user actions tracked
- [ ] No PII in analytics events
- [ ] Consistent event naming

### Navigation ✅
- [ ] Safe navigation used (safeNavigate)
- [ ] Params validated (safeNavigateWithValidation)
- [ ] Deep links work correctly
- [ ] Back button works correctly

### Code Quality ✅
- [ ] TypeScript errors: 0
- [ ] ESLint warnings: 0
- [ ] Uses BaseScreen wrapper
- [ ] Uses UI utility library (Row, Col, T, etc.)
- [ ] No inline styles (uses sx())

---

## 🐛 Issues Found

**Template for reporting issues:**

### Issue #[Number]: [Short Description]
- **Date:** [Date found]
- **Test:** [Which test revealed the issue]
- **Steps to Reproduce:**
  1. [Step 1]
  2. [Step 2]
  3. [Step 3]
- **Expected:** [What should happen]
- **Actual:** [What actually happened]
- **Logs:** [Relevant logcat output]
- **Status:** ⏳ Open | ✅ Fixed

---

**Example:**

### Issue #1: Welcome Section Not Showing Parent Name
- **Date:** 2025-10-22
- **Test:** Test 2.1 - Welcome Message Displays
- **Steps to Reproduce:**
  1. Open app
  2. Navigate to Dashboard
  3. Look at welcome section
- **Expected:** "Welcome, John Doe!"
- **Actual:** "Welcome, Parent!" (fallback shown instead)
- **Logs:**
  ```
  Error: Cannot read property 'full_name' of undefined
  ```
- **Status:** ⏳ Open

---

## ✅ Test Completion Summary

**Overall Progress:**
- [ ] Section 1: Screen Load & Navigation - 0/2 tests
- [ ] Section 2: Welcome Section - 0/2 tests ⏳ NOT YET IMPLEMENTED
- [ ] Section 3: Children Progress Cards - 0/12 tests ⏳ NOT YET IMPLEMENTED
- [ ] Section 4: Action Items Section - 0/10 tests ⏳ NOT YET IMPLEMENTED
- [ ] Section 5: Recent Communications Section - 0/10 tests ⏳ NOT YET IMPLEMENTED
- [ ] Section 6: Analytics Tracking - 0/8 tests
- [ ] Section 7: Performance - 0/7 tests
- [ ] Section 8: Edge Cases - 0/5 tests
- [ ] Cross-Feature Tests - 0/3 tests
- [ ] Acceptance Criteria - 0/35 tests

**Total Tests:** 0/104 passed

---

## 🚀 Ready for Production?

**Final Checklist Before Marking Complete:**
- [ ] All tests passing ✅
- [ ] Zero TypeScript errors
- [ ] Zero ESLint warnings
- [ ] Zero console errors in logcat
- [ ] Tested on physical device
- [ ] All acceptance criteria met
- [ ] No issues in "Issues Found" section (or all marked ✅ Fixed)

---

**This document will be updated as features are implemented. Always run full test suite before marking screen as complete!** 🧪

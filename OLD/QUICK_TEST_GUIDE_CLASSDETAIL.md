# Quick Test Guide - ClassDetailScreen

**Last Updated:** 2025-11-01
**Screen:** ClassDetailScreen.tsx
**Status:** ✅ Ready to Test

---

## 🚀 HOW TO SEE THE SCREEN (3 Methods)

### Method 1: Use Component Test Screen (EASIEST) ✅

1. **Run the app:**
   ```bash
   cd OLD
   npx react-native run-android
   # or
   npx react-native run-ios
   ```

2. **Navigate to ComponentTestScreen:**
   - Open the app
   - Go to Home tab
   - Tap "ComponentTest" (if in navigation)
   - OR navigate from StudentDashboard

3. **Look for the test button:**
   - **At the very top** of ComponentTestScreen
   - Section: "🧪 SCREEN TESTS - ClassDetailScreen"
   - Big blue button: "🚀 Test ClassDetailScreen"

4. **Tap the button:**
   - It will navigate to ClassDetailScreen
   - Uses test class ID: `test-class-001`

---

### Method 2: Create Test Button in StudentDashboard

Add this code to `StudentDashboard.tsx`:

```typescript
import { safeNavigate } from '../../utils/navigationService';
import { trackAction } from '../../utils/navigationAnalytics';

// Add this button anywhere in your dashboard
<Button
  variant="filled"
  onPress={() => {
    trackAction('test_class_detail', 'StudentDashboard');
    safeNavigate('ClassDetail', {
      classId: 'test-class-001'  // Use your test class ID
    });
  }}
>
  🧪 Test ClassDetailScreen
</Button>
```

---

### Method 3: Direct Navigation in Code

In any student screen:

```typescript
navigation.navigate('ClassDetail', {
  classId: 'your-test-class-id-here'
});
```

---

## 📊 SETUP TEST DATA IN SUPABASE

### Step 1: Create Test Class

```sql
-- Insert test class
INSERT INTO classes (
  id,
  subject,
  teacher_id,
  scheduled_start_at,
  duration_minutes,
  description
) VALUES (
  'test-class-001',
  'Mathematics - Algebra',
  'teacher-id-here',  -- Replace with actual teacher ID
  '2025-11-02 10:00:00',  -- Future date for UPCOMING status
  60,
  'Introduction to Quadratic Equations and Functions'
);
```

### Step 2: Create Test Attendance

```sql
-- Insert test attendance
INSERT INTO attendance (
  id,
  class_id,
  student_id,
  status,
  timestamp
) VALUES (
  gen_random_uuid(),
  'test-class-001',
  'your-student-id-here',  -- Replace with actual student ID
  'present',
  NOW()
);
```

### Step 3: Create Test Doubts

```sql
-- Insert test doubts (3 examples: open, answered, closed)

-- Open doubt
INSERT INTO doubts (
  id,
  class_id,
  student_id,
  question,
  subject,
  status,
  created_at
) VALUES (
  gen_random_uuid(),
  'test-class-001',
  'your-student-id-here',
  'How do I solve quadratic equations using the quadratic formula?',
  'Mathematics',
  'open',
  NOW()
);

-- Answered doubt
INSERT INTO doubts (
  id,
  class_id,
  student_id,
  teacher_id,
  question,
  subject,
  status,
  answer,
  created_at
) VALUES (
  gen_random_uuid(),
  'test-class-001',
  'your-student-id-here',
  'teacher-id-here',
  'What is the difference between factoring and completing the square?',
  'Mathematics',
  'answered',
  'Factoring breaks down the equation into factors, while completing the square rewrites it in vertex form. Both methods solve quadratics but have different applications.',
  NOW() - INTERVAL '1 day'
);

-- Closed doubt
INSERT INTO doubts (
  id,
  class_id,
  student_id,
  question,
  subject,
  status,
  created_at
) VALUES (
  gen_random_uuid(),
  'test-class-001',
  'your-student-id-here',
  'Can you explain the discriminant in quadratic equations?',
  'Mathematics',
  'closed',
  NOW() - INTERVAL '2 days'
);
```

### Step 4: Create Test Resources

```sql
-- Insert test resources (PDF, Video, Link)

-- PDF resource
INSERT INTO resources (
  id,
  class_id,
  title,
  type,
  url,
  description,
  created_at
) VALUES (
  gen_random_uuid(),
  'test-class-001',
  'Quadratic Equations Worksheet.pdf',
  'pdf',
  'https://example.com/worksheet.pdf',
  'Practice problems for quadratic equations with solutions',
  NOW() - INTERVAL '3 days'
);

-- Video resource
INSERT INTO resources (
  id,
  class_id,
  title,
  type,
  url,
  description,
  created_at
) VALUES (
  gen_random_uuid(),
  'test-class-001',
  'Quadratic Formula Explained',
  'video',
  'https://youtube.com/watch?v=example',
  'Step-by-step video tutorial on using the quadratic formula',
  NOW() - INTERVAL '2 days'
);

-- Link resource
INSERT INTO resources (
  id,
  class_id,
  title,
  type,
  url,
  description,
  created_at
) VALUES (
  gen_random_uuid(),
  'test-class-001',
  'Khan Academy - Quadratics',
  'link',
  'https://www.khanacademy.org/math/algebra/quadratics',
  'Interactive lessons and practice on quadratic equations',
  NOW() - INTERVAL '1 day'
);
```

---

## ✅ WHAT TO VALIDATE (Quick Checklist)

### Tab 1: Overview Tab

- [ ] Class subject displays correctly ("Mathematics - Algebra")
- [ ] Teacher name displays (or "Unknown Teacher" if not joined)
- [ ] Schedule displays with date and time
- [ ] Duration displays (60 minutes)
- [ ] Status badge shows (UPCOMING/LIVE/COMPLETED)
- [ ] Attendance badge shows (PRESENT/ABSENT/LATE)
- [ ] Attendance timestamp shows (e.g., "Marked at: 10:05 AM")
- [ ] Class Information card shows all 5 rows
- [ ] Your Attendance card shows if attendance exists

### Tab 2: Doubts Tab

- [ ] Tab badge shows count of open doubts (e.g., "1" if 1 open)
- [ ] "Ask Doubt" button visible in header
- [ ] All 3 doubts display in order (newest first)
- [ ] Open doubt shows: question + OPEN badge (yellow)
- [ ] Answered doubt shows: question + answer + ANSWERED badge (green) + teacher name
- [ ] Closed doubt shows: question + CLOSED badge (blue)
- [ ] Clicking "Ask Doubt" navigates to DoubtSubmission screen

### Tab 3: Resources Tab

- [ ] Tab badge shows count of resources (e.g., "3")
- [ ] All 3 resources display in order (newest first)
- [ ] PDF resource shows: 📄 icon + title + description + date
- [ ] Video resource shows: 🎥 icon + title + description + date
- [ ] Link resource shows: 🔗 icon + title + description + date
- [ ] Clicking PDF/Video navigates to ResourceViewer (or shows placeholder)
- [ ] Clicking Link opens external browser

### General

- [ ] Top bar shows "Class Details" title
- [ ] Back button works (returns to previous screen)
- [ ] Hamburger menu opens drawer
- [ ] Bottom navigation shows correct active tab
- [ ] Tab switching is smooth (no lag)
- [ ] Loading state shows briefly on first load
- [ ] No console errors in terminal

### Analytics (Check Console Logs)

- [ ] Screen view event fires: `trackScreenView('ClassDetailScreen', { classId, studentId })`
- [ ] Tab change events fire: `trackAction('view_tab', 'ClassDetailScreen', { tab: 'overview' })`
- [ ] "Ask Doubt" event fires: `trackAction('submit_doubt', 'ClassDetailScreen', { classId })`
- [ ] Resource view event fires: `trackAction('view_resource', 'ClassDetailScreen', { resourceId, type })`

---

## 🐛 TROUBLESHOOTING

### Issue 1: "Class not found" error

**Cause:** Class ID doesn't exist in Supabase
**Fix:**
1. Check Supabase tables
2. Verify `test-class-001` exists in `classes` table
3. Or change the classId in test button to match an existing class

### Issue 2: No attendance/doubts/resources show

**Cause:** Related data not created or foreign keys don't match
**Fix:**
1. Verify all foreign keys match:
   - `doubts.class_id` = `test-class-001`
   - `attendance.class_id` = `test-class-001`
   - `resources.class_id` = `test-class-001`
2. Check RLS policies allow student to read data

### Issue 3: "Failed to load class details" error

**Cause:** Supabase query error or RLS blocking
**Fix:**
1. Check Supabase logs for error details
2. Verify RLS policies:
   ```sql
   -- Students can view classes they're enrolled in
   CREATE POLICY "students_select_classes"
   ON classes FOR SELECT
   USING (
     id IN (
       SELECT class_id FROM class_enrollments WHERE student_id = auth.uid()
     )
   );
   ```

### Issue 4: Can't navigate to ClassDetail

**Cause:** Navigation not configured or screen not found
**Fix:**
1. Verify ClassDetailScreen is imported in StudentNavigator.tsx (line 20)
2. Verify route is registered (line 110-113)
3. Restart Metro bundler: `npx react-native start --reset-cache`

---

## 📝 EXPECTED CONSOLE OUTPUT

When testing correctly, you should see:

```
🔍 [ClassDetailScreen] Fetching class details for: test-class-001
✅ [ClassDetailScreen] Class data loaded: { id: 'test-class-001', subject: 'Mathematics - Algebra', ... }
🔍 [ClassDetailScreen] Fetching attendance...
✅ [ClassDetailScreen] Attendance loaded: { id: '...', status: 'present', ... }
🔍 [ClassDetailScreen] Fetching doubts...
✅ [ClassDetailScreen] Doubts loaded: 3
🔍 [ClassDetailScreen] Fetching resources...
✅ [ClassDetailScreen] Resources loaded: 3

 LOG  trackScreenView: ClassDetailScreen, metadata: {"classId":"test-class-001","studentId":"..."}
 LOG  trackAction: view_tab, screen: ClassDetailScreen, metadata: {"tab":"overview"}
```

---

## 🎯 FULL TEST EXECUTION

For comprehensive testing, follow **CLASSDETAILSCREEN_TEST_CASES.md**:
- 50 detailed test cases
- One for each feature
- Pass/fail criteria
- Bug report template

---

**Quick Start:**
1. ✅ Run app
2. ✅ Go to ComponentTestScreen
3. ✅ Tap "🚀 Test ClassDetailScreen" button
4. ✅ Validate tabs, doubts, resources work
5. ✅ Check console for analytics events

**Ready to test!** 🚀

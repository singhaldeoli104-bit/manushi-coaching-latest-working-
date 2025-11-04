# NotificationsScreen - Step-by-Step Testing Guide

**Status:** Ready to test
**Estimated Time:** 10-15 minutes

---

## 🎯 Testing Steps

### Step 1: Get Your Parent User ID

**Copy and paste this SQL into Supabase SQL Editor:**

```sql
-- Find your parent user ID
SELECT id, email, full_name, role
FROM profiles
WHERE role = 'parent'
LIMIT 5;
```

**What you'll see:**
```
id                                   | email              | full_name    | role
-------------------------------------|--------------------|--------------|---------
550e8400-e29b-41d4-a716-446655440000 | parent@example.com | John Doe     | parent
```

**Action:** Copy the `id` value (the long UUID) - you'll need it in the next step.

---

### Step 2: Insert Sample Notifications

**Copy this SQL and replace `YOUR_PARENT_USER_ID` with the ID from Step 1:**

```sql
-- Insert 8 sample notifications for testing
-- REPLACE 'YOUR_PARENT_USER_ID' with your actual parent user ID from Step 1

INSERT INTO notifications (
  user_id,
  title,
  message,
  type,
  priority,
  is_read,
  created_at
) VALUES
  -- UNREAD notifications (6 total)
  ('YOUR_PARENT_USER_ID', 'New Assignment Posted', 'Math homework for Chapter 5 has been assigned. Due date: Nov 15, 2025', 'assignment', 'high', false, NOW() - INTERVAL '10 minutes'),
  ('YOUR_PARENT_USER_ID', 'Class Cancelled', 'Tomorrow''s Physics class has been cancelled due to teacher unavailability', 'class', 'urgent', false, NOW() - INTERVAL '30 minutes'),
  ('YOUR_PARENT_USER_ID', 'School Announcement', 'Parent-Teacher meeting scheduled for Nov 20, 2025 at 10:00 AM', 'announcement', 'medium', false, NOW() - INTERVAL '1 day'),
  ('YOUR_PARENT_USER_ID', 'Low Attendance Alert', 'Your child''s attendance has dropped below 75%. Please check attendance records', 'warning', 'urgent', false, NOW() - INTERVAL '5 hours'),
  ('YOUR_PARENT_USER_ID', 'Grade Posted', 'Midterm exam results for Science are now available', 'info', 'medium', false, NOW() - INTERVAL '1 hour'),
  ('YOUR_PARENT_USER_ID', 'Payment Reminder', 'School fee payment is due by Nov 30, 2025', 'warning', 'high', false, NOW() - INTERVAL '2 days'),

  -- READ notifications (2 total)
  ('YOUR_PARENT_USER_ID', 'Doubt Answered', 'Your doubt about Quadratic Equations has been answered by the teacher', 'doubt', 'low', true, NOW() - INTERVAL '2 hours'),
  ('YOUR_PARENT_USER_ID', 'Assignment Submitted Successfully', 'Your child''s English assignment has been submitted successfully', 'success', 'low', true, NOW() - INTERVAL '3 days');
```

**Example (after replacement):**
```sql
INSERT INTO notifications (user_id, title, message, type, priority, is_read, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'New Assignment Posted', 'Math homework...', 'assignment', 'high', false, NOW() - INTERVAL '10 minutes'),
  -- ... rest of the values
```

**Action:** Run this SQL in Supabase SQL Editor

**Expected Result:**
```
INSERT 0 8
Query returned successfully in 145 ms.
```

---

### Step 3: Verify Data Inserted

**Run this SQL to confirm:**

```sql
-- Verify notifications were inserted
SELECT
  id,
  title,
  type,
  priority,
  is_read,
  created_at
FROM notifications
WHERE user_id = 'YOUR_PARENT_USER_ID'
ORDER BY created_at DESC;
```

**Expected Result:** You should see 8 rows (6 with `is_read = false`, 2 with `is_read = true`)

---

### Step 4: Open the App

1. Start your React Native app:
   ```bash
   npx react-native start --reset-cache
   ```

2. Run on device/emulator:
   ```bash
   # Android
   npx react-native run-android

   # iOS (if on Mac)
   npx react-native run-ios
   ```

3. Log in with the parent account (same email from Step 1)

---

### Step 5: Navigate to Notifications

**Path:** Dashboard → Notifications (tap notification icon or menu item)

**What you should see immediately:**

✅ **Header Card:**
- Title: "Notifications"
- Badge: "6 new" (red badge)

✅ **Stats Summary (4 boxes):**
- Total: **8**
- Unread: **6** (red color)
- Read: **2** (green color)
- Urgent: **2** (orange color)

✅ **"Mark All as Read (6)" button** below stats

✅ **Filter Buttons:**
- Read Status: **All** | Unread | Read (All should be highlighted)
- Type: **All Types** | Assignment | Class | Doubt | Announcement | Success | Warning | Error | Info

✅ **Notifications List (8 cards):**
- 6 cards with **blue left border** (unread)
- 2 cards without blue border (read)

**If you DON'T see this:**
- Check console for errors
- Verify you're logged in as parent
- Check Supabase connection
- Verify data was inserted (re-run Step 3)

---

## 🧪 Quick Tests (5 minutes)

### Test 1: Verify Visual Elements ✅

**Check each notification card has:**
- [ ] Type icon (📝 📢 ❓ 🏫 ✅ ⚠️ ❌ ℹ️)
- [ ] Priority color dot (small circle on right)
- [ ] Time ago ("10m ago", "1h ago", "1d ago")
- [ ] Title (bold)
- [ ] Message text
- [ ] Blue left border (on 6 unread notifications)
- [ ] "New" badge with blue dot (on 6 unread notifications)

**Priority Colors to Check:**
- **Red dot** → Urgent (Class Cancelled, Low Attendance Alert)
- **Orange dot** → High (New Assignment, Payment Reminder)
- **Blue dot** → Medium (School Announcement, Grade Posted)
- **Green dot** → Low (Doubt Answered, Assignment Submitted)

---

### Test 2: Filter by Read Status ✅

1. **Tap "Unread" button**
   - Expected: Only 6 notifications shown (with blue borders)
   - Button should be highlighted (primary blue color)

2. **Tap "Read" button**
   - Expected: Only 2 notifications shown (no blue borders)
   - Button should be highlighted

3. **Tap "All" button**
   - Expected: All 8 notifications shown
   - Button should be highlighted

**Pass if:** Filters work correctly, correct count shown

---

### Test 3: Filter by Type ✅

1. **Tap "Assignment" button**
   - Expected: Only 1 notification shown ("New Assignment Posted")

2. **Tap "Class" button**
   - Expected: Only 1 notification shown ("Class Cancelled")

3. **Tap "Warning" button**
   - Expected: 2 notifications shown ("Low Attendance Alert", "Payment Reminder")

4. **Tap "All Types" button**
   - Expected: All 8 notifications shown

**Pass if:** Each filter shows only matching notifications

---

### Test 4: Combined Filters ✅

1. **Tap "Unread" + "Assignment"**
   - Expected: Only 1 notification ("New Assignment Posted" - unread)

2. **Tap "Read" + "Success"**
   - Expected: Only 1 notification ("Assignment Submitted Successfully" - read)

3. **Tap "Unread" + "Info"**
   - Expected: 1 notification ("Grade Posted")

**Pass if:** Filters combine correctly

---

### Test 5: Mark as Read (Individual) ✅

1. **Find an unread notification** (with blue border, e.g., "New Assignment Posted")

2. **Tap on it**

3. **What should happen:**
   - Blue left border disappears immediately
   - "New" badge disappears
   - Stats update:
     - Unread: 6 → 5
     - Read: 2 → 3
   - Badge in header: "6 new" → "5 new"

**Pass if:** Notification marked as read instantly, stats update

---

### Test 6: Mark All as Read ✅

1. **Tap "Mark All as Read (5)" button**

2. **Confirmation dialog appears:**
   - Title: "Mark All as Read"
   - Message: "Mark 5 notifications as read?"
   - Buttons: Cancel | Mark All

3. **Tap "Mark All"**

4. **What should happen:**
   - All blue borders disappear
   - All "New" badges disappear
   - Stats update:
     - Unread: 5 → 0
     - Read: 3 → 8
     - Urgent: 2 → 0
   - Header badge disappears
   - "Mark All as Read" button disappears

**Pass if:** All notifications become read, button disappears

---

### Test 7: Pull to Refresh ✅

1. **Pull down on the notification list**

2. **What should happen:**
   - Loading spinner appears
   - List refreshes
   - Data reloads (same 8 notifications, all read now)

**Pass if:** Pull to refresh works without errors

---

## 🎯 Advanced Tests (Optional - 5 more minutes)

### Test 8: Empty State (No Notifications)

1. **Delete all notifications in Supabase:**
   ```sql
   DELETE FROM notifications WHERE user_id = 'YOUR_PARENT_USER_ID';
   ```

2. **Pull to refresh in app**

3. **Expected:**
   - Empty state message: "No notifications yet. You'll see updates about assignments, classes, and announcements here."
   - Stats show: Total: 0, Unread: 0, Read: 0
   - No "Mark All as Read" button

**Pass if:** Empty state displays correctly

---

### Test 9: Empty State (No Filter Matches)

1. **Re-insert notifications** (run Step 2 SQL again)

2. **Tap "Error" type filter** (if you don't have any error notifications)

3. **Expected:**
   - Message: "No notifications match your filters"
   - "Clear Filters" button appears

4. **Tap "Clear Filters"**

5. **Expected:**
   - Filters reset to "All" and "All Types"
   - All notifications shown

**Pass if:** Empty filter state works, clear filters works

---

### Test 10: Error State

1. **Turn off WiFi/Internet**

2. **Pull to refresh**

3. **Expected:**
   - Error message: "Failed to load notifications"
   - "Retry" button appears

4. **Turn WiFi back on**

5. **Tap "Retry"**

6. **Expected:**
   - Data loads successfully
   - Notifications display

**Pass if:** Error state handled gracefully

---

## ✅ Success Criteria

**Screen is working correctly if:**

- ✅ All 8 notifications load
- ✅ Stats show correct counts (Total: 8, Unread: 6, Read: 2, Urgent: 2)
- ✅ Visual indicators display (colors, icons, time, borders)
- ✅ Filter by read status works (All, Unread, Read)
- ✅ Filter by type works (9 types)
- ✅ Combined filters work
- ✅ Tap notification marks as read
- ✅ Mark all as read works with confirmation
- ✅ Pull to refresh works
- ✅ Empty states display
- ✅ Error states handled

---

## 🐛 Troubleshooting

### Issue: "No notifications found"

**Possible Causes:**
1. Wrong user ID used in SQL
2. Not logged in as parent
3. Supabase connection issue

**Solution:**
- Verify user_id in SQL matches logged-in user
- Check Supabase logs for errors
- Re-run SQL scripts

---

### Issue: TypeScript errors in console

**Solution:**
- Run: `npx tsc --noEmit` to check errors
- All errors should be in other files, not NotificationsScreen

---

### Issue: Blank screen

**Possible Causes:**
1. Navigation not working
2. BaseScreen error state
3. Query error

**Solution:**
- Check console logs for errors
- Look for error message on screen
- Check Supabase connection

---

### Issue: Stats don't update after marking as read

**Possible Causes:**
1. Mutation not invalidating query
2. Cache not refreshing

**Solution:**
- Pull to refresh manually
- Check console for mutation errors
- Verify Supabase permissions

---

## 📝 Report Results

After testing, please report:

1. **Which tests passed:** (e.g., "Tests 1-7 passed ✅")
2. **Which tests failed:** (e.g., "Test 5 failed - notification didn't mark as read")
3. **Any errors seen:** (copy console errors if any)
4. **Screenshots:** (if any visual issues)

---

## 🎉 Expected Result

If everything works, you should be able to:
- ✅ See all notifications with beautiful UI
- ✅ Filter by type and status
- ✅ Mark notifications as read
- ✅ See stats update in real-time
- ✅ Pull to refresh
- ✅ Handle empty and error states

**Ready to test? Follow the steps above!**

---

**Testing Guide Created by:** Claude Code
**Date:** October 25, 2025
**Estimated Time:** 10-15 minutes

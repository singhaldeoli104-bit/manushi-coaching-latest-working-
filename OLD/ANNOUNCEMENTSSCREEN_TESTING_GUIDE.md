# AnnouncementsScreen - Step-by-Step Testing Guide

**Status:** Ready to test
**Estimated Time:** 10-15 minutes

---

## 🎯 Testing Steps

### Step 1: Create Announcements Table

**Run this SQL in Supabase SQL Editor:**

The complete migration is in: `docs/sql/ANNOUNCEMENTS_TABLE_MIGRATION.sql`

You can run the entire file, or just the table creation:

```sql
-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT CHECK (category IN ('Academic', 'Events', 'Urgent', 'General', 'Holiday')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  is_important BOOLEAN DEFAULT false,
  published_by TEXT,
  action_url TEXT,
  attachment_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access to announcements"
  ON public.announcements FOR SELECT
  USING (auth.role() = 'authenticated');
```

**Expected Result:**
```
CREATE TABLE
ALTER TABLE
CREATE POLICY
```

---

### Step 2: Insert Sample Announcements

**Run this SQL (from migration file):**

```sql
INSERT INTO public.announcements (
  title,
  message,
  category,
  priority,
  is_important,
  published_by,
  published_at,
  expires_at
) VALUES
  -- Important announcements
  (
    'School Closure - Public Holiday',
    'The school will remain closed on November 1st, 2025 (Diwali). Classes will resume from November 2nd, 2025. Wishing you all a very Happy Diwali!',
    'Holiday',
    'urgent',
    true,
    'Principal',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '5 days'
  ),
  (
    'Parent-Teacher Meeting - November 20th',
    'Parent-Teacher meetings are scheduled for November 20, 2025 from 10:00 AM to 4:00 PM. Please book your slot through the app or contact your child''s class teacher.',
    'Events',
    'high',
    true,
    'Admin',
    NOW() - INTERVAL '2 days',
    '2025-11-20'::TIMESTAMPTZ
  ),
  (
    'Mid-Term Examination Schedule Released',
    'The mid-term examination schedule for all grades has been released. Please check the School Calendar section for detailed timetable. Exams will begin from November 25th, 2025.',
    'Academic',
    'high',
    true,
    'Admin',
    NOW() - INTERVAL '3 hours',
    '2025-11-25'::TIMESTAMPTZ
  ),

  -- Regular announcements
  (
    'Annual Sports Day - December 10th',
    'Annual Sports Day will be held on December 10th, 2025 at the school ground. All students are encouraged to participate. Registration forms will be shared next week.',
    'Events',
    'medium',
    false,
    'School',
    NOW() - INTERVAL '5 hours',
    '2025-12-10'::TIMESTAMPTZ
  ),
  (
    'Library Books Return Reminder',
    'All students who have borrowed books from the library are requested to return them by November 15th. Late fees will be applicable after this date.',
    'General',
    'low',
    false,
    'Admin',
    NOW() - INTERVAL '1 day',
    '2025-11-15'::TIMESTAMPTZ
  ),
  (
    'Science Exhibition Next Month',
    'A Science Exhibition showcasing student projects will be held in December. Students interested in participating should contact their Science teacher by November 20th.',
    'Academic',
    'medium',
    false,
    'Teacher',
    NOW() - INTERVAL '2 days',
    '2025-12-01'::TIMESTAMPTZ
  ),
  (
    'Updated School Timings for Winter',
    'From December 1st, school timings will be changed to 9:00 AM - 3:30 PM due to winter season. Morning assembly will start at 8:45 AM.',
    'General',
    'medium',
    false,
    'Admin',
    NOW() - INTERVAL '6 hours',
    '2025-12-01'::TIMESTAMPTZ
  ),
  (
    'Winter Holiday Notice',
    'Winter holidays will begin from December 24th, 2025 and school will reopen on January 6th, 2026. Holiday homework will be shared before the break.',
    'Holiday',
    'medium',
    false,
    'Principal',
    NOW() - INTERVAL '3 days',
    '2025-12-24'::TIMESTAMPTZ
  ),

  -- Expired announcement (for testing)
  (
    'Admission Open for New Session',
    'Admissions for the academic year 2025-26 are now open. Visit the school office for inquiry and registration forms.',
    'General',
    'low',
    false,
    'Admin',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '5 days'
  );
```

**Expected Result:**
```
INSERT 0 9
Query returned successfully.
```

---

### Step 3: Verify Data Inserted

**Run this SQL:**

```sql
SELECT
  id,
  title,
  category,
  priority,
  is_important,
  CASE
    WHEN expires_at IS NULL THEN 'No expiry'
    WHEN expires_at > NOW() THEN 'Active'
    ELSE 'Expired'
  END as status,
  published_at
FROM public.announcements
ORDER BY published_at DESC;
```

**Expected Result:** You should see 9 rows:
- 3 important announcements
- 8 active, 1 expired

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

3. Log in with any authenticated account (parent, teacher, student)

---

### Step 5: Navigate to Announcements

**Path:** Dashboard → Announcements (tap announcements icon or menu item)

**What you should see immediately:**

✅ **Header Card:**
- Title: "School Announcements"
- Badge: "3 important" (red badge)

✅ **Stats Summary (4 boxes):**
- Total: **9**
- Important: **3** (red color)
- Active: **8** (green color)
- Expired: **1** (gray color)

✅ **Search Input:**
- Search icon 🔍
- Input field with placeholder text
- Clear button (when text entered)

✅ **Filter Buttons - Importance:**
- **All** | Important Only (All should be highlighted)

✅ **Filter Buttons - Category:**
- **All Categories** | 📚 Academic | 🎉 Events | 🚨 Urgent | 📢 General | 🎊 Holiday

✅ **Announcements List (9 cards):**
- 3 cards with **red left border** (important)
- 1 card with **faded appearance** (expired)
- Each card shows category icon, priority dot, time ago, title, message

**If you DON'T see this:**
- Check console for errors
- Verify you're logged in
- Check Supabase connection
- Verify data was inserted (re-run Step 3)

---

## 🧪 Quick Tests (5 minutes)

### Test 1: Verify Visual Elements ✅

**Check each announcement card has:**
- [ ] Category emoji (📚 📢 🎉 🚨 🎊)
- [ ] Priority color dot (small circle)
- [ ] Time ago ("3h ago", "1d ago", "2d ago")
- [ ] Title (semiBold)
- [ ] Message text
- [ ] Red left border (on 3 important announcements)
- [ ] "⭐ Important" badge (on 3 announcements)
- [ ] "Expired" badge (on 1 announcement)
- [ ] "By [Publisher]" text (Principal, Admin, Teacher, School)

**Priority Colors to Check:**
- **Red dot** → Urgent (School Closure)
- **Orange dot** → High (PTM, Mid-Term Exams)
- **Blue dot** → Medium (Sports Day, Science Exhibition, Timings, Holidays)
- **Green dot** → Low (Library Books, Admissions)

---

### Test 2: Filter by Category ✅

1. **Tap "All Categories"**
   - Expected: All 9 announcements shown
   - Button should be highlighted (primary blue color)

2. **Tap "📚 Academic"**
   - Expected: Only 2 announcements shown (Mid-Term Exams, Science Exhibition)
   - Button should be highlighted

3. **Tap "🎉 Events"**
   - Expected: Only 2 announcements shown (PTM, Sports Day)
   - Button should be highlighted

4. **Tap "🚨 Urgent"**
   - Expected: Only announcements with Urgent category shown
   - Button should be highlighted

5. **Tap "🎊 Holiday"**
   - Expected: 2 announcements shown (School Closure, Winter Holidays)

6. **Tap "All Categories"**
   - Expected: All 9 announcements shown again

**Pass if:** Filters work correctly, correct count shown

---

### Test 3: Filter by Importance ✅

1. **Tap "Important Only"**
   - Expected: Only 3 announcements shown (with red left border)
   - Button should be highlighted

2. **Tap "All"**
   - Expected: All 9 announcements shown
   - Button should be highlighted

**Pass if:** Importance filter works correctly

---

### Test 4: Combined Filters ✅

1. **Tap "Important Only" + "🎉 Events"**
   - Expected: Only 1 announcement (PTM - important event)

2. **Tap "All" + "📚 Academic"**
   - Expected: 2 announcements (Mid-Term Exams, Science Exhibition)

3. **Tap "Important Only" + "🎊 Holiday"**
   - Expected: 1 announcement (School Closure)

**Pass if:** Filters combine correctly

---

### Test 5: Search Functionality ✅

1. **Type "exam" in search**
   - Expected: Only announcements with "exam" in title/message shown
   - Clear button ✖️ appears

2. **Type "school" in search**
   - Expected: Multiple matching announcements shown

3. **Tap clear button ✖️**
   - Expected: Search resets, all announcements shown

4. **Type "meeting" in search**
   - Expected: Only PTM announcement shown

**Pass if:** Search works for both title and message, clear button works

---

### Test 6: Search + Filters Combined ✅

1. **Search "school" + Category "Holiday"**
   - Expected: Only holiday announcements with "school" in text

2. **Search "November" + Important Only**
   - Expected: Important announcements mentioning November

**Pass if:** Search and filters work together

---

### Test 7: Visual Status Indicators ✅

1. **Find expired announcement** (Admissions)
   - Expected: Faded appearance (60% opacity)
   - "Expired" badge visible

2. **Find important announcements** (3 total)
   - Expected: Red left border
   - "⭐ Important" badge

3. **Check priority dots**
   - Expected: Different colors based on priority

**Pass if:** All visual indicators display correctly

---

### Test 8: Pull to Refresh ✅

1. **Pull down on the announcement list**

2. **What should happen:**
   - Loading spinner appears
   - List refreshes
   - Data reloads (same 9 announcements)

**Pass if:** Pull to refresh works without errors

---

### Test 9: Tap Announcement ✅

1. **Tap any announcement**

2. **What should happen:**
   - Console log shows "tap_announcement" event
   - (Future: Will navigate to detail or action_url)

**Pass if:** No errors occur

---

## 🎯 Advanced Tests (Optional - 5 more minutes)

### Test 10: Empty State (No Announcements)

1. **Delete all announcements in Supabase:**
   ```sql
   DELETE FROM public.announcements;
   ```

2. **Pull to refresh in app**

3. **Expected:**
   - Empty state message: "No announcements yet. You'll see important updates and news from the school here."
   - Stats show: Total: 0, Important: 0, Active: 0
   - No filters or search shown

**Pass if:** Empty state displays correctly

---

### Test 11: Empty State (No Filter Matches)

1. **Re-insert announcements** (run Step 2 SQL again)

2. **Search for something that doesn't exist** (e.g., "xyz123")

3. **Expected:**
   - Message: "No announcements match your filters"
   - "Clear Filters" button appears

4. **Tap "Clear Filters"**

5. **Expected:**
   - All filters reset to "All" and "All Categories"
   - Search cleared
   - All announcements shown

**Pass if:** Empty filter state works, clear filters works

---

### Test 12: Error State

1. **Turn off WiFi/Internet**

2. **Pull to refresh**

3. **Expected:**
   - Error message: "Failed to load announcements"
   - "Retry" button appears

4. **Turn WiFi back on**

5. **Tap "Retry"**

6. **Expected:**
   - Data loads successfully
   - Announcements display

**Pass if:** Error state handled gracefully

---

## ✅ Success Criteria

**Screen is working correctly if:**

- ✅ All 9 announcements load
- ✅ Stats show correct counts (Total: 9, Important: 3, Active: 8, Expired: 1)
- ✅ Visual indicators display (colors, icons, time, borders, badges)
- ✅ Filter by category works (6 options)
- ✅ Filter by importance works (2 options)
- ✅ Search works (title + message)
- ✅ Combined filters work
- ✅ Pull to refresh works
- ✅ Empty states display
- ✅ Error states handled

---

## 🐛 Troubleshooting

### Issue: "No announcements found"

**Possible Causes:**
1. Table not created
2. No data inserted
3. RLS policy blocking

**Solution:**
- Run Step 1 (create table + RLS)
- Run Step 2 (insert data)
- Verify with Step 3 SQL

---

### Issue: TypeScript errors in console

**Solution:**
- Run: `npx tsc --noEmit` to check errors
- All errors should be in other files, not AnnouncementsScreen

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

### Issue: Search not working

**Possible Causes:**
1. TextInput not receiving input
2. Filter logic error

**Solution:**
- Check console for onChange events
- Verify search query state updates
- Check filter logic in useMemo

---

## 📝 Report Results

After testing, please report:

1. **Which tests passed:** (e.g., "Tests 1-9 passed ✅")
2. **Which tests failed:** (e.g., "Test 5 failed - search not working")
3. **Any errors seen:** (copy console errors if any)
4. **Screenshots:** (if any visual issues)

---

## 🎉 Expected Result

If everything works, you should be able to:
- ✅ See all announcements with beautiful UI
- ✅ Filter by category, importance, and search
- ✅ See visual status indicators (important, expired, priority)
- ✅ Pull to refresh
- ✅ Handle empty and error states

**Ready to test? Follow the steps above!**

---

**Testing Guide Created by:** Claude Code
**Date:** October 25, 2025
**Estimated Time:** 10-15 minutes

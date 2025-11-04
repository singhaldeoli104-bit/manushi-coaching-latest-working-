# Screen Recreation Skill - Usage Guide

## 🎯 What Is This?

A specialized Claude Code skill that automates the creation of production-ready React Native screens following all established project patterns and avoiding all known errors.

## 📍 Location

**Skill Command:** `/recreate-screen`

**File:** `C:\PC\.claude\commands\recreate-screen.md`

---

## 🚀 How To Use

### Method 1: Using Slash Command

```
/recreate-screen

I need to create a MessagesListScreen that shows parent-teacher messages
```

Claude will then:
1. Read all project documentation
2. Ask clarifying questions
3. Check database schema
4. Create migrations if needed
5. Implement the screen
6. Add sample data
7. Apply quality checklist
8. Provide testing instructions

### Method 2: Direct Instructions

```
Create a screen using the recreate-screen skill for:
- Screen: AssignmentsListScreen
- Purpose: Show homework assignments for a child
- Features: Filter by subject, sort by due date, mark as complete
```

---

## 📋 What The Skill Does Automatically

### ✅ Enforces Best Practices
- **No mock data** - Always uses real Supabase queries
- **BaseScreen wrapper** - Proper loading/error/empty states
- **Safe navigation** - Uses safeNavigate and trackAction
- **Analytics tracking** - Tracks all screen views and actions
- **Nullish coalescing** - Uses ?? instead of || for numbers
- **TypeScript strict** - Full type safety

### ✅ Creates Complete Solutions
1. **Database Migration** (if table doesn't exist)
   - Schema design
   - RLS policies for parent/teacher access
   - Indexes for performance

2. **Sample Data** (3-8 realistic records)
   - Properly linked to existing students/parents
   - Varied data for testing filters

3. **Screen Implementation**
   - Full TypeScript types
   - TanStack Query data fetching
   - Category filtering
   - Stats calculations
   - Progress bars / badges
   - Responsive layout

4. **Quality Assurance**
   - Acceptance checklist verification
   - TypeScript compilation check
   - Common error prevention

### ✅ Prevents Known Errors
- ❌ toFixed crashes → Uses ?? instead of ||
- ❌ RLS permission errors → Adds proper policies
- ❌ Missing tables → Checks existence first
- ❌ Undefined params → Proper TypeScript types
- ❌ Mock data → Forces real Supabase queries

---

## 📊 Examples

### Example 1: Simple List Screen

**User Input:**
```
/recreate-screen

Create NotificationsScreen - shows important alerts for parents
```

**Skill Output:**
1. ✅ Creates `notifications` table with migration
2. ✅ Adds 5 sample notifications (announcements, grade updates, etc.)
3. ✅ Implements NotificationsScreen with:
   - Read/unread filtering
   - Badge counts
   - Mark as read action
   - Real-time refresh
4. ✅ Provides testing checklist

---

### Example 2: Complex Detail Screen

**User Input:**
```
/recreate-screen

Create AssignmentDetailScreen:
- Shows full assignment details
- Displays submission status
- Shows teacher feedback
- Allows file upload (placeholder)
```

**Skill Output:**
1. ✅ Checks `assignments` and `assignment_submissions` tables
2. ✅ Enhances schema if needed
3. ✅ Implements AssignmentDetailScreen with:
   - Assignment details card
   - Submission status timeline
   - Teacher feedback section
   - File attachment list
   - Submit button (placeholder)
4. ✅ Adds realistic test data
5. ✅ Provides navigation integration guide

---

### Example 3: Data-Heavy Screen

**User Input:**
```
/recreate-screen

Create AttendanceDetailScreen:
- Monthly attendance calendar view
- Daily attendance records
- Attendance percentage
- Excuse/absence reasons
```

**Skill Output:**
1. ✅ Queries existing `attendance_records` table
2. ✅ Adds helper views/functions if needed
3. ✅ Implements AttendanceDetailScreen with:
   - Calendar component (using existing library)
   - Daily attendance cards
   - Monthly stats
   - Percentage calculation
   - Trend indicators
4. ✅ Seeds 30 days of attendance data
5. ✅ Performance optimization (useMemo)

---

## 🎓 Learning Mode

The skill also serves as a **teaching tool**. After each implementation, it provides:

### What Was Done
```markdown
## Implementation Summary

**Screen:** MessagesListScreen
**Lines:** 412
**Database Changes:** 1 table created, 5 messages added
**Features:** Filtering, sorting, mark as read, reply navigation

## Key Patterns Used
1. Category filtering with useState + useMemo
2. Real-time data with 5-min cache
3. Optimistic updates for mark-as-read
4. Safe navigation to ComposeMessage screen

## Files Modified
- src/screens/parent/MessagesListScreen.tsx (created)
- Database: messages table (created)
```

### Why Decisions Were Made
```markdown
## Design Decisions

1. **Used TEXT[] for recipient_ids** - Supports group messages
2. **Added is_read flag** - Enables unread count badge
3. **Cached for 5 minutes** - Balance freshness vs performance
4. **Sorted by created_at DESC** - Most recent first
```

---

## 🔧 Customization

You can customize the skill's behavior by:

### 1. Modifying Template
Edit `C:\PC\.claude\commands\recreate-screen.md` to:
- Change default patterns
- Add new common components
- Update styling preferences

### 2. Adding Presets
Create new slash commands for specific screen types:

```markdown
# .claude/commands/recreate-list.md
(Specialized for list screens with pagination)

# .claude/commands/recreate-form.md
(Specialized for data entry forms)

# .claude/commands/recreate-detail.md
(Specialized for detail/read-only screens)
```

---

## 📚 Related Documentation

The skill automatically references:

1. **PROJECT_MEMORY.md** - Strategy and constraints
2. **FEATURES_ADDED.md** - Available features
3. **USAGE_GUIDE.md** - How-to examples
4. **ERRORS_AND_SOLUTIONS.md** - Error prevention
5. **ACCEPTANCE_CHECKLIST.md** - Quality standards
6. **PHASE_3_COMPLETE.md** - Recent implementations

---

## ✅ Success Metrics

Screens created with this skill will have:

- **0 TypeScript errors** (strict mode)
- **0 ESLint warnings** (code quality)
- **0 runtime crashes** (error prevention)
- **100% acceptance checklist** (quality gate)
- **Real data only** (no mocks)
- **Full documentation** (inline comments + summary)

---

## 🚦 Quality Gates

Every screen implementation must pass:

### Gate 1: Code Quality
- [ ] TypeScript compiles with 0 errors
- [ ] No console errors when loading screen
- [ ] No hardcoded mock data
- [ ] All imports resolve correctly

### Gate 2: Data Integration
- [ ] Supabase query works
- [ ] Data displays correctly
- [ ] Loading state works
- [ ] Error state works
- [ ] Empty state works

### Gate 3: User Experience
- [ ] Navigation works both ways
- [ ] Pull-to-refresh works
- [ ] Filtering/sorting works (if applicable)
- [ ] Analytics events fire
- [ ] Responsive on different screen sizes

### Gate 4: Documentation
- [ ] JSDoc header comment
- [ ] Inline comments for complex logic
- [ ] Implementation summary provided
- [ ] Testing instructions provided

---

## 💡 Pro Tips

### Tip 1: Be Specific
```
❌ "Create a messages screen"
✅ "Create MessagesListScreen showing conversations between parent and teachers,
   with unread count, filter by teacher, and navigation to message detail"
```

### Tip 2: Mention Data Source
```
❌ "Show assignments"
✅ "Show assignments from the existing assignments table, joining with
   assignment_submissions to show completion status"
```

### Tip 3: Reference Similar Screens
```
✅ "Create PaymentHistoryScreen similar to BehaviorTrackingScreen but showing
   payment records instead of behavior logs"
```

### Tip 4: Specify Navigation
```
✅ "This screen is accessed from NewParentDashboard > Financial card,
   and should navigate to PaymentDetailScreen when tapping a record"
```

---

## 🎯 Next Steps

1. **Try it now:** `/recreate-screen` - Create your first screen!
2. **Review output:** Check implementation quality
3. **Test in app:** Verify functionality
4. **Iterate:** Refine based on feedback

---

**Created:** October 22, 2025
**Last Updated:** October 23, 2025
**Version:** 1.0
**Status:** Production Ready ✅

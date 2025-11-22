# Teacher App - Complete Navigation Plan
**Date:** 2025-11-21

---

## KEY UNDERSTANDING

### ✅ What We Have:
- **46 Screens** - All exist as beautiful Framer components
- **62 Code Components** - All production-ready with correct URLs
- **85.7% Complete** - Components are STATIC DISPLAYS (no internal navigation)

### ❌ What's Missing:
- **Navigation Shell** - System to navigate between all 46 screens
- **Context Mapping** - When to show which screen
- **Navigation Triggers** - How users move between screens

---

## NAVIGATION ARCHITECTURE

### Primary Navigation (5 Tabs - Always Visible)

```
┌─────────────────────────────────────┐
│         TOP BAR (Context)           │
├─────────────────────────────────────┤
│                                     │
│        SCREEN CONTENT               │
│        (46 Screens)                 │
│                                     │
├─────────────────────────────────────┤
│   🏠  📚  🎥  📝  ⚙️               │
│  Home Classes Teach Assess More     │
└─────────────────────────────────────┘
           + FAB (Context)
```

### Bottom Tab Navigation:

| Tab | Screen | Description |
|-----|--------|-------------|
| 🏠 Home | `home` → TeacherDashboard | Main dashboard with stats, schedule, quick actions |
| 📚 Classes | `classList` → ClassListScreen | All classes, tap to view Class Overview |
| 🎥 Teach | `liveClassHub` → LiveClassHub | Live class schedule, start/join sessions |
| 📝 Assess | `assignmentsList` → AssignmentsList | Assignments, tests, grading queue |
| ⚙️ More | `settingsHub` → SettingsHub | Settings, profile, performance, help |

---

## ALL 46 SCREENS - NAVIGATION MAP

### Auth Flow (5 screens) - NO TABS

1. **login** → `TeacherLoginScreen`
   - → (Continue button) → `otp`
   - → (Sign up link) → `signup`

2. **otp** → `OTPVerification`
   - → (Verify button) → `home`
   - → (Back button) → `login`

3. **signup** → `SignupScreen`
   - → (Continue button) → `profileSetup`
   - → (Back button) → `login`

4. **profileSetup** → `ProfileSetup`
   - → (Continue button) → `joinInstitute`

5. **joinInstitute** → `JoinInstitute`
   - → (Join button) → `home`
   - → (Skip button) → `home`

---

### 🏠 HOME Tab (1 screen + drill-downs)

6. **home** → `Teacherdshboard`
   - Cards navigate to:
     - "Start Live Class" → `liveClass`
     - "Review Now" → `assignmentsList`
     - "View Details" → `classList`
     - Quick action "Assignment" → `createAssignment`
     - Quick action "Test" → `createTest`
     - Quick action "Announce" → `announcements`
     - Quick action "Analytics" → `teacherPerformance`

7. **notifications** → `NotificationsScreen`
   - (Accessed from top bar bell icon)
   - → (Back) → previous screen

8. **calendar** → `TeacherCalendar`
   - (Quick action or from dashboard)
   - → (Event tap) → depends on event type

9. **globalSearch** → `GlobalSearch`
   - (Accessed from top bar search icon)
   - → (Result tap) → depends on result type

---

### 📚 CLASSES Tab (13 screens)

10. **classList** → `ClassListScreen`
    - → (Tap class card) → `classOverview`
    - → (FAB +) → `createClass`

11. **classOverview** → `ClassOverview`
    - → (View students) → `studentList`
    - → (Mark attendance) → `markAttendance`
    - → (Create assignment) → `createAssignment`
    - → (Start live class) → `liveClass`
    - → (Tab: Analytics) → internal tab

12. **createClass** → `CreateClassForm` / `CreateClassAdvanced`
    - → (Save) → `classList`
    - → (Back) → `classList`

13. **classPlanner** → `ClassPlanner`
    - (Accessed from class overview or more)
    - → (Add lesson plan) → internal modal

14. **studentList** → `StudentList`
    - (From classOverview or classList)
    - → (Tap student) → `studentProfile`
    - → (Bulk actions) → internal modal

15. **studentProfile** → `StudentProfile`
    - → (View attendance) → internal tab
    - → (View assignments) → internal tab
    - → (Message parent) → `composeMessage`
    - → (Back) → `studentList`

16. **markAttendance** → `AttendanceScreen`
    - → (View history) → `attendanceHistory`
    - → (Save) → `classOverview`
    - FAB: QR scan (future)

17. **attendanceHistory** → `AttendanceHistory`
    - → (Export) → internal modal
    - → (Back) → `markAttendance`

18. **attendanceReports** → `AttendanceReports`
    - (From More → Reports or classOverview)
    - → (Export) → download

19. **classPerformance** → `ClassPerformanceAnalytics`
    - (From classOverview or More)
    - → (Student details) → `studentProfile`

20. **resources** → `StudyResourcesLibrary`
    - → (Upload) → `uploadResource`
    - → (View resource) → internal preview

21. **uploadResource** → `UploadStudyResource`
    - → (Publish) → `resources`
    - → (Back) → `resources`

22. **homeworkCalendar** → `HomeworkCalendar`
    - → (Add homework) → internal modal
    - → (Tap homework) → `assignmentDetails`

---

### 🎥 TEACH Tab (5 screens)

23. **liveClassHub** → `LiveClassHub`
    - → (Start class) → `liveClass`
    - → (Schedule class) → `liveClassSchedule`
    - → (View past class) → `postClassSummary`

24. **liveClassSchedule** → `LiveClassSchedule`
    - → (Create session) → internal modal
    - → (Join session) → `liveClass`
    - → (Back) → `liveClassHub`

25. **liveClass** → `LiveClassSession`
    - FULL SCREEN (no tabs/top bar)
    - → (End class) → `postClassSummary`
    - → (Close) → `liveClassHub`

26. **postClassSummary** → `PostClassSummary`
    - → (View recording) → internal player
    - → (Export) → download
    - → (Back) → `liveClassHub`

27. **homeworkCalendar** → `HomeworkCalendar`
    - (Also accessible from teach tab)

---

### 📝 ASSESS Tab (15 screens)

28. **assignmentsList** → `AssignmentsList`
    - → (Tap assignment) → `assignmentDetails`
    - → (FAB +) → `createAssignment`
    - → (Filter) → internal filter

29. **createAssignment** → `CreateAssignment`
    - → (Publish) → `assignmentsList`
    - → (Save draft) → `assignmentsList`
    - → (Back) → `assignmentsList`

30. **assignmentDetails** → `AssignmentDetails`
    - → (Tap submission) → `gradeSubmission`
    - → (Edit assignment) → `createAssignment`
    - → (View analytics) → internal tab
    - → (Back) → `assignmentsList`

31. **gradeSubmission** → `GradeSubmission`
    - → (Submit grade) → `assignmentDetails`
    - → (Next student) → stays in `gradeSubmission`
    - → (Previous student) → stays in `gradeSubmission`
    - → (Back) → `assignmentDetails`

32. **createTest** → `CreateTestQuiz`
    - → (Add questions) → `questionBank` or inline
    - → (Publish) → `assignmentsList` or test list
    - → (Back) → previous screen

33. **testMonitoring** → `TestMonitoring`
    - (During live test)
    - → (View student) → internal modal
    - → (End test) → `testAnalytics`

34. **testAnalytics** → `TestAnalyticsDashboard`
    - → (View student report) → `studentTestReport`
    - → (Export) → download
    - → (Back) → `assignmentsList`

35. **studentTestReport** → `StudentTestReport`
    - → (Share) → internal share
    - → (Back) → `testAnalytics`

36. **questionBank** → `QuestionBankLibrary`
    - → (Add question) → `createQuestion`
    - → (Edit question) → `createQuestion`
    - → (Select questions) → back to `createTest`

37. **createQuestion** → `CreateEditQuestion`
    - → (Save) → `questionBank`
    - → (Back) → `questionBank`

---

### ⚙️ MORE Tab (13 screens)

38. **settingsHub** → `SettingsHub`
    - → (Profile) → `profileSettings`
    - → (Performance) → `teacherPerformance`
    - → (Professional Development) → `professionalDevelopment`
    - → (Help & Support) → `helpSupport`
    - → (Timetable) → `timetable`
    - → (Leave Management) → `leaveManagement`
    - → (Announcements) → `announcements`
    - → (Calendar) → `calendar`

39. **profileSettings** → `TeacherProfileSettings`
    - → (Edit) → internal edit mode
    - → (Change password) → internal modal
    - → (Logout) → `login`
    - → (Back) → `settingsHub`

40. **teacherPerformance** → `TeacherPerformanceDashboard`
    - → (View details) → internal drill-downs
    - → (Export report) → download
    - → (Back) → `settingsHub`

41. **professionalDevelopment** → `ProfessionalDevelopment`
    - → (Enroll course) → internal modal
    - → (View certificate) → internal preview
    - → (Back) → `settingsHub`

42. **helpSupport** → `HelpSupportCenter`
    - → (Submit ticket) → internal form
    - → (Watch tutorial) → internal video
    - → (Back) → `settingsHub`

43. **announcements** → `InstituteAnnouncements`
    - → (Tap announcement) → internal expanded view
    - → (Back) → previous screen

44. **timetable** → `TimetableSchedule`
    - → (Edit) → internal edit mode
    - → (Export) → download
    - → (Back) → `settingsHub`

45. **leaveManagement** → `LeaveManagement`
    - → (Apply leave) → `substituteAssignment`
    - → (View history) → internal list

46. **substituteAssignment** → `SubstituteAssignment` / `SubstituteTeacher`
    - → (Assign substitute) → internal selection
    - → (Confirm) → `leaveManagement`
    - → (Back) → `leaveManagement`

---

### 💬 COMMUNICATION (Cross-cutting)

47. **parentHub** → `ParentCommunicationHub`
    - (Accessible from multiple places)
    - → (Compose) → `composeMessage`
    - → (View message) → internal thread view

48. **composeMessage** → `ComposeMessageToParent`
    - → (Send) → `parentHub`
    - → (Back) → `parentHub`

49. **scheduleParentMeeting** → `ScheduleParentMeeting`
    - (From studentProfile or parentHub)
    - → (Schedule) → `calendar`
    - → (Back) → previous screen

---

## NAVIGATION RULES

### 1. FAB (Floating Action Button) - Context Sensitive

| Current Tab | FAB Action | Navigates To |
|-------------|------------|--------------|
| Home | Create anything menu | Modal with options |
| Classes | Create class | `createClass` |
| Teach | Start live class | `liveClass` |
| Assess | Create assignment | `createAssignment` |
| More | (Hidden) | - |

### 2. Top Bar Components

| Element | Action | Behavior |
|---------|--------|----------|
| Back ← | Tap | Go to previous screen in history |
| Title | - | Shows current screen name |
| Search 🔍 | Tap | Open `globalSearch` |
| Notifications 🔔 | Tap | Open `notifications` |

### 3. Screen States

| State | Tab Bar | Top Bar | FAB |
|-------|---------|---------|-----|
| Auth screens | Hidden | Hidden | Hidden |
| Tab root screens | Visible | Visible (no back) | Visible |
| Drill-down screens | Visible | Visible (with back) | Context |
| Full-screen (live class) | Hidden | Hidden | Hidden |
| Modals | Visible (dimmed) | Modal header | Hidden |

---

## IMPLEMENTATION APPROACH

### Option A: Pure Navigation Shell (RECOMMENDED)
- Beautiful components remain STATIC (no changes)
- Shell handles ALL navigation through:
  - Bottom tabs
  - Top bar actions
  - FAB
  - Card/List tap detection via wrapper

### Option B: Smart Context Provider
- Provide `useNavigation()` hook
- Components can optionally use it
- Still works without modifying existing components

### Option C: Hybrid
- Use Option A (shell navigation)
- Add context for future enhancements
- Best of both worlds

---

## NEXT STEPS

1. **User Approval** ✅
   - Review this plan
   - Confirm navigation flows
   - Identify any missing flows

2. **Implementation**
   - Create TeacherAppShell with:
     - All 46 screen mappings
     - Bottom tab navigation with proper tab-screen mapping
     - Context-sensitive FAB
     - Top bar with back/search/notifications
     - History management
     - NavigationContext provider

3. **Testing**
   - Test all 46 screen transitions
   - Verify back button works
   - Test tab switching
   - Test deep linking (future)

---

## QUESTIONS FOR USER

1. ✅ Does this navigation structure match your vision?
2. ✅ Are there any missing navigation flows?
3. ✅ Should we implement Option A, B, or C?
4. ✅ Any screens that need special navigation behavior?

---

**Ready to implement once approved!** 🚀

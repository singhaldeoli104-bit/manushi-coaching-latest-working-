# Student UI Screens Blueprint

**Repository:** `C:\PC\OLD`

**Document:** `student_analysis/ui_screens.md`

**Author:** Codex (GPT-5)

**Last Updated:** 2025-11-XX

This document captures the end-state UX direction for every student-facing screen. Each entry blends the current code audit, analysis docs, and MD3 design tokens into a single reference so engineers and designers can iterate consistently.

---

## Foundations

### Design Tokens

**Colors (Light Mode):**
- Primary: `#2563EB` (calm blue) - interactive elements, CTAs, focus states
- Surface: `#F8FAFC` (off-white) - cards, backgrounds, elevated surfaces
- SurfaceVariant: `#E2E8F0` (light gray) - dividers, borders, disabled states
- OnSurface: `#0F172A` (near-black) - primary text content
- OnSurfaceVariant: `#64748B` (slate gray) - secondary text, metadata
- Success: `#10B981`, Warning: `#F59E0B`, Danger: `#EF4444`, Info: `#3B82F6`

**Colors (Dark Mode):**
- Primary: `#60A5FA` (lighter blue) - maintains contrast in dark environment
- Surface: `#1E293B` (dark slate) - cards, backgrounds
- SurfaceVariant: `#334155` (medium slate) - dividers, borders
- OnSurface: `#F1F5F9` (off-white) - primary text
- OnSurfaceVariant: `#94A3B8` (light slate) - secondary text
- Success: `#34D399`, Warning: `#FBBF24`, Danger: `#F87171`, Info: `#60A5FA`

**Typography Scale:**
- Display: 28sp, weight 600, line-height 1.2 - hero numbers, emphasis content
- TitleLarge: 22sp, weight 500, line-height 1.2 - screen titles
- Title: 18sp, weight 600, line-height 1.3 - section headers
- Body: 16sp, weight 400, line-height 1.5 - primary content, comfortable reading
- Small: 14sp, weight 400, line-height 1.4 - metadata, helper text
- Caption: 13sp, weight 400, line-height 1.3 - chips, timestamps, labels

**Height Tokens (Enforce Consistency):**
- `height.sm`: **48dp** - Chips, secondary buttons, tab bars (WCAG 2.1 AAA minimum)
- `height.md`: **56dp** - Primary buttons, compact AppBar, info banners
- `height.lg`: **64dp** - Standard AppBar, control bars, sticky footers
- `height.xl`: **72dp** - Enhanced AppBar (with subtitle), session banners
- `height.hero`: **200-240dp** - Hero cards with variable content

**Spacing Tokens:**
- `spacing.xs`: 4dp - tight inline spacing
- `spacing.sm`: 8dp - inner card padding, small gaps
- `spacing.base`: 16dp - default padding, standard gaps
- `spacing.lg`: 24dp - section separations
- `spacing.xl`: 32dp - major screen divisions

**Elevation (Material Design 3):**
- Level 0: Surface (no shadow) - default state
- Level 1: 1dp elevation - cards at rest
- Level 2: 3dp elevation - cards raised, buttons pressed
- Level 3: 6dp elevation - modals, floating action buttons
- Level 4: 8dp elevation - navigation drawer
- Level 5: 12dp elevation - app bar when scrolled

**Motion (Easing & Duration):**
- Standard: 200ms, ease-out - element entries, simple transitions
- Emphasized: 400ms, ease-in-out - complex state changes, screen transitions
- Quick: 100ms, ease-in - press states, toggles, micro-interactions
- **Always respect "Reduce motion" accessibility setting**

### Component Primitives

**Layout Components:** `BaseScreen`, `StudentTopBar`, `Row`, `Col`, `Stack`, `Card`, `Badge`, `Button`, `Tabs`, `ProgressBar`

**State Components:** `EmptyState`, `ErrorState`, `LoadingState`, `SkeletonLoader`

**Interactive Components:** `Button`, `IconButton`, `Chip`, `Switch`, `Checkbox`, `TextField`

**Feedback Components:** `Snackbar`, `Toast`, `Banner`, `Tooltip`, `ProgressIndicator`

### Data & Integration

- **Data Hooks:** Move heavy data logic into React Query hooks (e.g. `useStudentDashboard`, `useScheduleDetail`), expose typed view models to presentation components.
- **Analytics:** Log `trackScreenView` on mount and `trackAction` for key interactions.
- **Accessibility:** Every actionable element needs labels, roles, and respect for dynamic type. When charts or sparklines are present, supply textual fallbacks.

### Global Rules

🚫 **FORBIDDEN:**
1. **Hard-coded colors** (`#FFFFFF`, `rgb()`) - Use theme tokens only via `useTheme()` hook
2. **Touch targets <48dp** - WCAG 2.1 AAA violation; all interactive elements minimum 48dp
3. **Raw height values** (64, 56) - Use height tokens (`height.lg`, `height.md`)
4. **Nested vertical scrolls** - Single parent scroll per screen; nested scrolls only for carousels/tabs
5. **>2 visible filters** - Advanced filters must go in bottom sheet with state persistence

✅ **REQUIRED:**
1. **Theme support** - Light/dark mode via `useTheme()` hook, no hard-coded colors
2. **Skeleton states** - Matching content structure during data load
3. **Empty states** - Actionable message with CTA when no data
4. **Error states** - Retry mechanism for failures
5. **Accessibility labels** - All interactive elements require `accessibilityLabel`
6. **Analytics tracking** - Screen views + primary user actions
7. **Pull-to-refresh** - All list/dashboard screens
8. **Safe area insets** - iOS notch, Android gesture navigation

### Layout & Scroll Conventions

| Element                       | Default Token / Size             | Scroll Behaviour                           |
|------------------------------|----------------------------------|--------------------------------------------|
| `StudentTopBar` / AppBar     | `height.lg` (64dp), `Typography.titleLarge` 22sp | Fixed (pinned at top)                      |
| Summary chips / quick stats  | `height.sm` (48dp), `Badge` + `Typography.body` 16sp | Horizontal scroll allowed inside row       |
| Hero cards / header sections | `height.hero` (200-240dp), corner radius 16dp       | Fixed above main scroll                    |
| Content cards                | Padding `spacing.base` (16dp), corner radius 16dp | Within main vertical scroll                |
| Primary CTA button           | `height.sm` (48dp), full width where possible  | Fixed footer when action must stay visible |
| Control bars (live class)    | `height.lg` (64dp), icon size 24dp                | Fixed at bottom                            |
| Bottom sheets / modals       | `height.md` (56dp) handle, `spacing.base` (16dp) horizontal padding       | Scrollable content when taller than viewport |

**Vertical Scroll:** Each screen should expose a single parent vertical scroll (`ScrollView` or `FlatList`).  
**Horizontal Scroll:** Use within dedicated carousels / chip rows; provide snap or indicators.  
**Sticky Footers:** Reserve for high-frequency actions (Join, Submit, Track Progress) with safe-area padding.

Each section below includes:

1. **Purpose** & route context.
2. **Palette & Tone** for the intended visual mood.
3. **Data & Dependencies** listing hooks, services, Supabase tables.
4. **Target Layout** (ASCII wireframe representing the MD3 hierarchy).
5. **UX Notes** highlighting interaction patterns or state handling.
6. **Audit Findings** summarizing current gaps in the implementation.
7. **Next Steps** to bring the screen to the target experience.

---

## 1. Student Dashboard (`StudentDashboard.tsx`)

**Purpose:** Primary landing hub summarizing everything the learner needs today.  
**Palette & Tone:** Calm, confident blues with clean white surfaces and accent badges.  
**Data & Dependencies:** `useStudentDashboard`, `useUpcomingAssignments`, `useUpcomingClasses`, `useAttendanceSummary`, `useAcademicPerformance`; legacy services for backward compatibility; tables `classes`, `assignments`, `attendance_summary`, `notifications`, `students`.

**Target Layout**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ AppBar: Student Dashboard                                    [Profile] [⋮]   │
│ Subtitle: “Welcome back, {firstName}”                                         │
├──────────────────────────────────────────────────────────────────────────────┤
│ Summary Chips (Row, primary/secondary pills)                                  │
│ [Today’s Classes • 3]  [Assignments Due • 2]  [Attendance • 92%]  [Streak • 7] │
├──────────────────────────────────────────────────────────────────────────────┤
│ Upcoming Classes (Horizontal Card Carousel)                                   │
│ ┌────────────────────────┬────────────────────────┬────────────────────────┐ │
│ │ Algebra II · 10:00     │ Physics Lab · 13:00    │ Literature · 16:00      │ │
│ │ Status: LIVE (Green)   │ Status: UPCOMING       │ Status: UPCOMING        │ │
│ │ [Join] [Details]       │ [Join] [Reschedule]    │ [Join] [Notes]          │ │
│ └────────────────────────┴────────────────────────┴────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│ Assignments Snapshot (Card List)                                              │
│  • Geometry Worksheet — due 11:59 PM   [Start]   Priority High (Red badge)   │
│  • Lab Report Draft — due Tomorrow     [Upload]  Priority Medium (Amber)     │
├──────────────────────────────────────────────────────────────────────────────┤
│ Notifications (NotificationRenderer)                                          │
│  • Teacher feedback received  — tap to view                                   │
│  • New poll posted in Algebra II                                              │
│  [View All]                                                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│ Smart Recommendations (Card Carousel with AI icon)                            │
│  • “Focus on quadratic equations” [Start Guided Practice]                     │
│  • “Review 3 missed flashcards” [Open Deck]                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│ Activity Timeline                                                             │
│  09:45 • Completed “Chemistry Quiz 4”                                         │
│  08:10 • Joined “Morning Study Group”                                         │
│  [View Full Timeline]                                                         │
├──────────────────────────────────────────────────────────────────────────────┤
│ Quick Actions Row                                                             │
│ [Add Doubt]  [Check Schedule]  [Contact Mentor]  [Planner]                    │
└──────────────────────────────────────────────────────────────────────────────┘
Sticky Footer: [Track Progress] [Need Help? Chat Now]
```

**Layout & Scroll**
- AppBar (`StudentTopBar`) 64 dp high, pinned with safe-area padding.
- Summary chips row anchored directly under AppBar; horizontal scroll allowed for overflow.
- Main content (classes, assignments, notifications, timeline) in one vertical `ScrollView` using `Stack` with `Spacing.base` gap.
- Carousels (`UpcomingClasses`, `SmartRecommendations`) use 220 dp height horizontal `FlatList` with snap.
- Sticky footer actions fixed above safe area (height 72 dp, includes label + icon).

**Typography & Sizing**
- Screen title: `Typography.titleLarge` (22 sp, medium).
- Section headers: `Typography.title` (18 sp, semi-bold) with `Spacing.base` top margin.
- Body copy: `Typography.body` (16 sp); metadata/captions use `Typography.small` (14 sp).
- Chip labels use `Typography.caption` (13 sp) uppercased; chip height **48dp** (`height.sm`) - WCAG 2.1 AAA compliant.
- Card padding `Spacing.base` (16 dp); inner spacing `Spacing.sm` (8 dp).

**UX Notes**
- Keep sections collapsible for personalization.
- Provide skeleton loaders for each module independently.
- Quick actions should be context-aware (e.g., highlight overdue tasks).

**Audit Findings**
- Dual data systems (React Query + legacy) create redundancy.
- 1,600+ LOC monolith, minimal component reuse.
- Multiple console logs with corrupted characters.
- Accessibility labels missing on chips and carousels.

**Next Steps**
1. Extract container + section organisms (`UpcomingClassesSection`, `AssignmentsGlance`, etc.).
2. Remove legacy fetches, rely on typed hooks.
3. Add `trackScreenView` and analytics events for sections.
4. Implement accessible focus order and aria labels.
5. Update Appium baselines after refactor.

---

## 2. Student AI Learning Dashboard (`StudentAILearningDashboard.tsx`)

**Purpose:** Personalized AI insights, adaptive study paths, and mastery tracking.  
**Palette & Tone:** Premium gradient accent (blue → teal), white cards with AI purple highlights.  
**Data & Dependencies:** `aiInsightsService`, `assignmentsService`, `performanceService`; `useTranslation`; Supabase tables `ai_insights`, `academic_predictions`, `recommended_actions`.

**Target Layout**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ AppBar: AI Learning Dashboard                           [Settings] [History] │
│ Tagline: “Your plan for today is ready.”                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│ Hero Insight Card (glassmorphism surface on PrimaryContainer)                │
│  • Overall Performance 84%  ▲ +6% this week                                   │
│  • AI Coach Message: “Let’s solidify Geometry fundamentals.”                  │
│  [View Full Report]                                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│ Adaptive Goals (Two-column Card Grid)                                         │
│ ┌────────────────────┬────────────────────┐                                   │
│ │ Goal: Master Quadratics          60%    │   uses ProgressBar (primary)     │
│ │ Next Action: Solve 3 practice sets      │                                   │
│ └────────────────────┴────────────────────┘                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│ Recommended Activities (Horizontal Chips)                                     │
│ [15m Concept Recap] [AI Quiz] [Flashcards] [Group Session]                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ Skill Mastery Heatmap (Card with gradient sparklines + legend)                │
├──────────────────────────────────────────────────────────────────────────────┤
│ Assessment History                                                            │
│  • Algebra Diagnostic — 82% (Improved) [Review]                               │
│  • Physics Simulation — 74% (Needs Attention) [Plan Practice]                 │
├──────────────────────────────────────────────────────────────────────────────┤
│ Quick Actions                                                                 │
│ [Start Adaptive Quiz]  [Review Weak Skills]  [Chat with AI Coach]             │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Layout & Scroll**
- AppBar 64 dp pinned; gradient hero card (approx. 220 dp height) remains above scroll, collapsible with backdrop blur.
- Content below hero scrolls vertically: goals grid, chips, heatmap, lists.
- Recommended activities row horizontally scrollable (chip height **48dp** (`height.sm`)).
- Quick actions anchored at bottom of scroll; no sticky footer needed unless future CTA introduced.

**Typography & Sizing**
- Header tagline: `Typography.headline` (20 sp), medium weight.
- Goal titles: `Typography.title` (18 sp) with `Typography.caption` supporting text.
- Chip text: `Typography.body` (16 sp) bold with icon size 20 dp.
- Heatmap legend: `Typography.small` (14 sp).
- Buttons: **48dp** (`height.sm`) height with icon (24 dp) + label `Typography.body`.

**UX Notes**
- Highlight AI-generated recommendations with icons (sparkle).
- Provide “Why am I seeing this?” context for transparency.
- Support offline caching of latest plan.

**Audit Findings**
- Heavy mock data; limited integration with real metrics.
- Minimal loading/empty states.
- Charts implemented manually without shared components.

**Next Steps**
1. Replace mock data with `useStudentAiPlan` hook.
2. Build reusable `Heatmap`/`TrendCard` components.
3. Add success/empty states and skeleton loading.
4. Instrument analytics for AI interactions.

---

## 3. Schedule Screen (`ScheduleScreen.tsx`)

**Purpose:** Multi-view calendar for classes, deadlines, and personal study blocks.  
**Palette & Tone:** Bright, minimal calendar look; primary blue for events, red for deadlines.  
**Data & Dependencies:** `getClassesByDateRange`, `getStudentAssignments`; future `useScheduleDetail`; tables `classes`, `assignments`, `events`.

**Target Layout**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ AppBar: Schedule                                     [Filters] [Sync] [⋮]    │
│ Subtitle: “Week of 24 Oct · Week 42”                                         │
├──────────────────────────────────────────────────────────────────────────────┤
│ Summary Chips                                                               │
│ [Classes Today • 3] [Study Minutes • 2h] [Due Soon • 2] [Attendance • 92%]   │
├──────────────────────────────────────────────────────────────────────────────┤
│ View Toggle Bar                                                             │
│ [Day] [Week]* [Month]   [Today]   [More Filters •2]                          │
│ (Advanced filters in bottom sheet: Subject, Status, Type, Date picker)       │
├──────────────────────────────────────────────────────────────────────────────┤
│ Week Strip (Scrollable)                                                     │
│ Mon 23  ••  | Tue 24 (Today)  ••• | Wed 25  • | Thu 26  •• ...               │
│ • Blue dot = class, Red = deadline                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│ Day Agenda Timeline                                                         │
│ 08:30  Algebra II — Live (Join)  Room 204 | Duration 60m                     │
│ 10:15  Physics Lab — Hybrid (Join)                                          │
│ 11:59  Geometry Worksheet — Deadline (Upload)                               │
│ 13:00  Study Block — Focus Mode (Start Timer)                                │
├──────────────────────────────────────────────────────────────────────────────┤
│ Deadlines & Reminders                                                       │
│  • Submit Lab Report — Tomorrow 17:00 [Add Reminder]                         │
│  • Parent Meeting — Thu 18:30 [Add to Calendar]                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ Quick Actions                                                               │
│ [Add Study Block] [Request Leave] [Export Schedule]                          │
└──────────────────────────────────────────────────────────────────────────────┘
Sticky Footer: [Add Event]   [Download Day PDF]   “Need help? Contact mentor”
```

**Layout & Scroll**
- AppBar + view toggle bar pinned at top; combined height `height.lg` + `height.sm` (64dp + 48dp = 112dp) with `spacing.base` padding.
- Week strip sits below toggle bar, horizontally scrollable (item width 72dp, height 72dp).
- Day agenda, reminders, quick actions share a vertical scroll container.
- Sticky footer actions `height.xl` (72dp), anchored with safe-area padding.
- **Filter bottom sheet:** Opens with "More Filters" button; persists state to AsyncStorage (`schedule-filters-v1`); shows active filter count badge.

**Typography & Sizing**
- View toggle labels: `Typography.body` (16 sp) medium; indicator thickness 3 dp.
- Week strip day numbers: `Typography.title` (18 sp); day name `Typography.caption` (13 sp).
- Agenda time column: `Typography.small` (14 sp) monospace option; event titles `Typography.title` (18 sp).
- Reminder card text uses `Typography.body`, supporting meta `Typography.small`.
- Buttons: **48dp** (`height.sm`) height; quick action icons 24 dp.

**UX Notes**
- Timeline uses `Row`/`Card` with status chips.
- Month view uses `CalendarGrid` with dots and badges.
- **Filters:** Max 2 visible inline (Day/Week/Month toggle + Today button); advanced filters (Subject, Status, Type, Date) in bottom sheet with AsyncStorage persistence.

**Audit Findings**
- Hard-coded LightTheme; lacks dark mode support.
- No analytics; minimal accessibility text.
- Month view fetches limited date range.
- File size >2k LOC, complicated state handling.

**Next Steps**
1. Implement `useScheduleDetail(studentId, range)` returning events, reminders.
2. Switch to theme tokens and layout components.
3. Persist filters & view mode to AsyncStorage.
4. Integrate analytics + accessibility.
5. Unit test event transformation logic.

---

## 4. Enhanced Schedule Screen (`EnhancedScheduleScreen.tsx`)

**Purpose:** Alternate schedule view with animations, reminders, and device sync.  
**Palette & Tone:** Same as Schedule Screen with subtle motion via Reanimated.  
**Data & Dependencies:** `getTodayClasses`, `getStudentAssignments`; animation libs.

**Target Layout**
```
AppBar: Enhanced Schedule [Lively Iconography]
Hero Strip: Animated day cards sliding in/out
Today Panel:
 ┌──────────────────────────────────────────────┐
 │ 08:30 Algebra II     [Join]   LIVE indicator │
 │ 10:15 Physics Lab    [Join]   upcoming       │
 │ Assignments due today (list)                 │
 └──────────────────────────────────────────────┘
Upcoming Carousel with bounce animations
Reminders Bottom Sheet (Portal + SlideInUp)
```

**Layout & Scroll**
- AppBar + hero strip combined height ~200 dp; hero cards (160 dp) horizontally scrollable with snap.
- Today panel and upcoming carousel scroll vertically beneath (single parent scroll).
- Reminders bottom sheet covers 60–90 % height when open; inner content scrollable.
- Animated cards maintain min width 280 dp.

**Typography & Sizing**
- Hero card title: `Typography.title` (18 sp) bold; time badges `Typography.caption`.
- Animated labels maintain 16 sp body text with 12 sp metadata.
- Bottom sheet header uses `Typography.titleLarge` (22 sp), list items `Typography.body`.

**UX Notes**
- Keep animations snappy (<250ms).
- Provide “Reduce motion” setting fallback.
- Device calendar sync should confirm success/failure.

**Audit Findings**
- Back handler calls `BackHandler.exitApp` when no navigation provided.
- Alerts used for placeholders.
- Data reload not scoped to selected date ranges.

**Next Steps**
1. Align data retrieval with ScheduleScreen hook.
2. Replace placeholder alerts with actual flows.
3. Add settings persistence for reminders and animations.

---

## 5. Class Detail (`ClassDetailScreen.tsx`)

**Purpose:** Deep dive into a specific class with tabs for Overview, Doubts, Resources.  
**Palette & Tone:** Clean neutral surfaces with accent chips per tab.  
**Data & Dependencies:** Supabase `classes`, `attendance`, `doubts`, `resources`; `useQuery`; `StudentContext`.

**Target Layout**
```
┌ Top Bar: ← Class Detail                                  [Bookmark] [Share] ┐
├ Tabs: Overview | Doubts | Resources (MD3 primary indicator) ───────────────┤
│ Overview Tab                                                              │
│ ┌──── Class Header Card ─────────────────────────────────────────────────┐ │
│ │ Subject (Badge)  • Teacher avatar + name • Status Pill (Live/Completed)│ │
│ │ Timing, Duration, Location • Primary CTA [Join] [Ask Question]         │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ Session Info Grid, Attendance Summary, Upcoming Assignments               │
│ Doubts Tab: CTA [Ask Question], list with status badges                   │
│ Resources Tab: Card list (PDF/Video/Link) with icons + actions            │
└────────────────────────────────────────────────────────────────────────────┘
```

**Layout & Scroll**
- Top bar + tab bar pinned (combined height ~112 dp).
- Tab content wraps vertical `ScrollView`; inner lists use `Card` stack with `Spacing.base` gap.
- Header card 180 dp tall, spans full width; CTA row within card.
- Doubts list may use `FlatList` with 20% viewport reserved for CTA summary.

**Typography & Sizing**
- Class title: `Typography.titleLarge` (22 sp).
- Metadata rows: `Typography.body` (16 sp) with icon 20 dp.
- Tab labels: `Typography.body` medium; indicator 3 dp.
- List item title `Typography.title` (18 sp); status badges `Typography.caption`.

**UX Notes**
- Tab transitions maintain scroll position.
- Show teacher/co-teacher info with avatars.
- Provide absence of data states (no doubts, no resources).

**Audit Findings**
- Teacher name fallback uses teacher ID substring.
- Logs with corrupted Unicode.
- Minimal skeleton states.

**Next Steps**
1. Expand query to join teacher profile.
2. Replace logs with `logger`.
3. Add skeleton/empty states.
4. Cover tab flows in tests.

---

## 6. Student Live Class (`StudentLiveClassScreen.tsx`)

**Purpose:** Container orchestrating live class modules (video, chat, polls, notes).  
**Palette & Tone:** Darkened background for immersive feel, accent chips on controls.  
**Data & Dependencies:** Real-time services (`LiveClassService`, `PollService`, `ChatService`), WebRTC integration, AsyncStorage for offline caching.

**Target Layout**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ AppBar: {Class Title}                              Connection ▄▄▅▆█ (Good)   │
│ Secondary row: Teacher name + class timer                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│ Main Stage (Video / Screen Share)                                             │
│  • Expand to full screen toggle                                               │
│  • Recording indicator (if active)                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│ Tab Rail: Live Chat | Polls | Q&A | Notes | Whiteboard                        │
│ Selected tab renders within side card with MD3 surfaces                       │
├──────────────────────────────────────────────────────────────────────────────┤
│ Bottom Control Bar                                                            │
│ [Mic] [Camera] [Share Screen] [Raise Hand] [Participants] [More ⋮]            │
│ Status chips (muted, recording, breakout active)                              │
└──────────────────────────────────────────────────────────────────────────────┘
Floating metrics pill: “Participation 82% · 28 participants”
```

**Layout & Scroll**
- AppBar height 72 dp (includes status row), fixed.
- Stage area fixed height (default 9:16 ratio; ~240 dp on phones) with option to expand.
- Panel tabs occupy remaining vertical space; each tab uses independent vertical scroll with max height `flex:1`.
- Control bar fixed at bottom, 64 dp height, includes safe-area inset.
- Floating metrics pill anchored top-right of stage (width 160 dp, auto height).

**Typography & Sizing**
- Class title `Typography.titleLarge` (22 sp) medium weight.
- Timer + connection labels `Typography.small` (14 sp).
- Tab labels `Typography.body` (16 sp) uppercase optional.
- Control buttons icon 28 dp, label `Typography.caption`.
- Chat messages: user name `Typography.small`, body `Typography.body`.

**UX Notes**
- Ensure persistent mini-player when leaving stage view.
- Provide offline prompts if network drops.
- Keep controls large enough for touch ergonomics.

**Audit Findings**
- Large component with interwoven logic and UI.
- Some analytics events missing.
- Accessibility not fully addressed for assistive tech.

**Next Steps**
1. Split into container + stage + panel subcomponents.
2. Introduce `useLiveClassSession` hook for state orchestration.
3. Add analytics + accessibility improvements.
4. Expand automated tests (chat, polls, controls).

---

## 7. Live Class Participation (`LiveClassParticipationScreen.tsx`)

**Purpose:** Focused participation panel for students (chat, polls, notes).  
**Palette & Tone:** Neutral surfaces with accent chips, integrate brand colors sparingly.  
**Data & Dependencies:** `liveClassService`, `polls`, session stats, offline queue.

**Target Layout**
```
AppBar: Participation • {Class Title}                            [Exit]
Session Stats Banner: Participation 85% • Attention 78% • Polls 3/5
Tab Segments: Chat | Polls | Notes | Resources
Each tab shows MD3 card list with toolbars (e.g., message input bar).
Footer: [Raise Hand] [Share Reaction] [Call Support]
```

**Layout & Scroll**
- AppBar 64 dp, fixed; session stats banner (56 dp) sticks beneath until scrolled.
- Tab strip (**48dp** (`height.sm`)) pinned; content area uses vertical scroll per tab.
- Message composer anchored at bottom per tab; height 60 dp with attachment tray.
- Reaction shortcuts horizontal scroll within each tab.

**Typography & Sizing**
- Banner metrics: `Typography.title` (18 sp) for value, `Typography.caption` for label.
- Tab labels `Typography.body` medium.
- Chat messages `Typography.body`; timestamps `Typography.caption`.
- Poll option text `Typography.body`, progress `Typography.small`.
- Footer buttons height 56 dp (icon 24 dp + label).

**UX Notes**
- Show real-time session stats with mini charts.
- Provide sticky compose box with attachments.
- Add “Sync offline messages” banner when reconnecting.

**Audit Findings**
- Stats increments incomplete.
- Hardcoded participation/default values.
- Large state management block.

**Next Steps**
1. Finalize stats calculations & backend sync.
2. Extract tab components.
3. Add offline queue UI states.

---

## 8. Enhanced Live Class Participation (`EnhancedLiveClassParticipationScreen.tsx`)

**Purpose:** Upgraded participation with breakout rooms, reactions, transcripts.  
**Palette & Tone:** Slightly darker surfaces with subtle gradients, premium feel.  
**Data & Dependencies:** Adds breakout services, transcript service, reaction animations.

**Target Layout**
```
Hero: “You’re in Algebra II · Breakout starts in 2m”
Reactions Ribbon: animated emoji chips
Transcript Panel: scrollable text with timestamps
Breakout Section: Room selector cards
Footer: [Join Breakout] [Raise Hand] [Quick Poll]
```

**Layout & Scroll**
- Header hero (96 dp) pinned; remainder scrolls vertically.
- Reactions ribbon horizontal scroll with **48dp** (`height.sm`) chips.
- Transcript panel occupies 60 % viewport height, vertical scroll with sticky date separators.
- Breakout cards arranged in 2-column grid (card height 160 dp); grid vertically scrolls.
- Footer CTA bar fixed at bottom 64 dp.

**Typography & Sizing**
- Hero headline `Typography.headline` (20 sp) bold.
- Reactions chip labels `Typography.caption` (13 sp).
- Transcript timestamps `Typography.caption`, content `Typography.body`.
- Breakout card title `Typography.title` (18 sp); metadata `Typography.small`.
- Footer buttons 56 dp height with uppercase labels.

**UX Notes**
- Provide ability to pin transcript or chat.
- Offer “Do not disturb” mode to silence reactions.

**Audit Findings**
- Many TODOs for breakout logic.
- Transcript stubbed.
- Animations not optimized.

**Next Steps**
1. Implement breakout orchestration.
2. Integrate transcript feed.
3. Optimize animations & add accessibility toggles.

---

## 9. Enhanced Interactive Classroom (`EnhancedInteractiveClassroomScreen.tsx`)

**Purpose:** Hybrid learning space combining collaboration tools (whiteboard, quizzes, shared media).  
**Palette & Tone:** Energetic but balanced; use color-coded toolbars.  
**Data & Dependencies:** Whiteboard SDK, quiz engine, real-time presence.

**Target Layout**
```
Split layout:
 Left Pane: Shared Whiteboard / Media
 Right Pane Tabs: Chat | Quizzes | Resources | Participants
 Top Toolbar: Select tool, color, undo/redo, save snapshot
 Bottom CTA: [Start Quiz] [Share File] [Open Breakout]
```

**Layout & Scroll**
- AppBar + toolbars pinned (total height ~120 dp).
- Workspace area uses flex layout: left pane occupies ~60 % width (min 320 dp), right pane vertical tabs 40 %.
- Whiteboard supports pan/zoom rather than scroll; fallback to vertical scroll when content > viewport.
- Right-pane tab content vertical scroll with sticky tab headers (**48dp** (`height.sm`)).
- Bottom CTA bar fixed at 64 dp.

**Typography & Sizing**
- Toolbar labels `Typography.small` (14 sp) uppercase; icons 24 dp.
- Tab headings `Typography.body` (16 sp) medium.
- Whiteboard annotations use `Typography.caption`.
- Action buttons 56 dp height with icons.

**UX Notes**
- Ensure keyboard shortcuts exposed via tooltip for desktop use.
- Provide “Focus mode” toggling side panes.

**Audit Findings**
- Whiteboard integration partial.
- Quizzes tab placeholder.
- Need consistent theming.

**Next Steps**
1. Wrap whiteboard API into reusable component.
2. Build quiz tab with existing poll components.
3. Harmonize styling with design system.

---

## 10. Live Collaboration Studio (`LiveCollaborationStudio.tsx`)

**Purpose:** Space for collaborative assignments with tasks, chat, and file sharing.  
**Palette & Tone:** Neutral surfaces with accent color tokens per task state.  
**Data & Dependencies:** `collaborationService`, `taskService`, `chatService`.

**Target Layout**
```
AppBar: Collaboration Studio · {Assignment}
Progress Banner: 3/5 tasks completed
Columns:
 ┌To Do───────┬In Progress────┬Review────────┐
 │ Card with drag handle, tags, due chips    │
 │ Inline chat bubble preview                │
 └────────────┴───────────────┴──────────────┘
Right Drawer: Team Chat / Files / Notes
Footer: [Add Task] [Schedule Check-in]
```

**Layout & Scroll**
- AppBar + progress banner (total 112 dp) pinned.
- Board area horizontally scrollable if >3 columns; each column vertical scroll with cards (min width 280 dp, card height auto).
- Right drawer 320 dp width, vertical scroll; collapsible on small screens (slide over).
- Footer action bar fixed 64 dp.

**Typography & Sizing**
- Column headers `Typography.title` (18 sp) uppercase optional.
- Card titles `Typography.body` (16 sp) semi-bold; metadata `Typography.caption`.
- Progress banner text `Typography.title` with `ProgressBar` height 8 dp.
- Footer buttons 56 dp height.

**UX Notes**
- Support drag-and-drop with accessible alternatives.
- Real-time presence indicators on cards.
- Provide quick filters for priority and owner.

**Audit Findings**
- Kanban interactions incomplete.
- Offline sync not handled.

**Next Steps**
1. Implement board state management via hook.
2. Add presence avatars.
3. Enable offline queue + conflict resolution.

---

## 11. Virtual Classroom Interface (`VirtualClassroomInterface.tsx`)

**Purpose:** Immersive classroom with seating layout and contextual actions.  
**Palette & Tone:** Soft grays for seating, accent colors for active participants.  
**Data & Dependencies:** seating layout config, presence service, Supabase `class_participation`.

**Target Layout**
```
Top: Class banner with time + status
Body: Seating grid of avatars (rows), each seat shows name + status chip
Sidebar: Actions (Spotlight, Message, Mute), Filters (Raise hand, Late)
Bottom: [Start Activity] [Assign Breakout] [Share Resource]
```

**Layout & Scroll**
- Banner (96 dp) pinned.
- Seating grid uses vertical scroll; each seat 88 dp square (avatar **48dp** (`height.sm`)).
- Horizontal scroll enabled when seat count exceeds column capacity; show scrollbar indicators.
- Sidebar fixed width 280 dp, vertical scroll with sections.
- Bottom action bar 64 dp pinned.

**Typography & Sizing**
- Banner text `Typography.titleLarge` (22 sp); status pill `Typography.caption`.
- Seat labels `Typography.small` (14 sp).
- Sidebar section headers `Typography.title` (18 sp).
- Buttons 56 dp height.

**UX Notes**
- Seat states: speaking, muted, absent, offline.
- Provide search to locate a student quickly.

**Audit Findings**
- Seat rendering uses static layout.
- Actions limited.
- Need responsive behaviour.

**Next Steps**
1. Generate layout dynamically from roster data.
2. Add seat interaction menu.
3. Support pinch-to-zoom / pan on tablets.

---

## 12. AI Study Screen (`AIStudyScreen.tsx`)

**Purpose:** Guided self-study with AI prompts, timers, and content suggestions.  
**Palette & Tone:** calming gradient background, focus-friendly surfaces.  
**Data & Dependencies:** `aiStudyService`, `timer` hooks, content service.

**Target Layout**
```
AppBar: Guided Study Session  [End]
Focus Timer (circular progress) with Start/Pause
AI Prompt Feed: latest guidance with CTA [Apply Strategy]
Task Stack: cards for current tasks with completion toggles
Reflection Section: quick mood check + notes
Footer: [Extend Session] [Change Topic]
```

**Layout & Scroll**
- AppBar + timer section (approx. 200 dp) pinned; timer uses `Stack` with centre alignment.
- Prompt feed, tasks, reflection all within vertical scroll.
- Task cards 120 dp height with checkbox row; reflection text area grows but within scroll.
- Footer CTA bar fixed 64 dp with safe-area inset.

**Typography & Sizing**
- Timer digits `Typography.display` (22–28 sp) bold.
- Prompt titles `Typography.title` (18 sp); body `Typography.body`.
- Task text `Typography.body`; meta `Typography.caption`.
- Footer buttons 56 dp height.

**UX Notes**
- Provide ambient animations (breathing) with ability to disable.
- Auto-save reflections to profile.

**Audit Findings**
- Timer + tasks partially implemented.
- AI prompts static.

**Next Steps**
1. Connect to AI API for dynamic prompts.
2. Persist session progress.
3. Add success summary modal.

---

## 13. Enhanced AI Study Assistant (`EnhancedAIStudyAssistantScreen.tsx`)

**Purpose:** Full assistant workspace combining chat, resources, and plan builder.  
**Palette & Tone:** Premium gradient header, neutral body.  
**Data & Dependencies:** AI chat service, plan builder service, Supabase `study_plans`.

**Target Layout**
```
Hero: Assistant avatar + greeting “Ready to plan your study sprint?”
Two-column layout (tablet): Chat on left, dynamic workspace on right.
Workspace tabs: Plan Builder | Resource Finder | Progress Snapshot
Chat input with suggestions + attachments.
Footer: [Start Study Sprint] [Share Plan]
```

**Layout & Scroll**
- Hero header 160 dp with gradient, pinned until scrolled.
- Two-column responsive layout: on phones stack vertical (chat first, workspace second) within single scroll; on tablets use `Row` with each pane vertical scroll.
- Workspace tabs **48dp** (`height.sm`) high pinned within pane.
- Chat composer fixed at bottom of chat pane (height 60 dp).
- Footer CTA bar fixed at primary screen bottom (64 dp).

**Typography & Sizing**
- Greeting `Typography.titleLarge` (22 sp) with accent `Typography.caption`.
- Chat bubbles `Typography.body`; timestamps `Typography.caption`.
- Tab labels `Typography.body` medium.
- CTA buttons 56 dp height.

**UX Notes**
- Provide conversation memory summary.
- Enable exporting plans to calendar.

**Audit Findings**
- Many TODO modals, partial features.
- Styling inconsistent.

**Next Steps**
1. Standardize layout with `Row/Col`.
2. Implement plan exporter.
3. Add analytics for assistant usage.

---

## 14. AI Tutor Chat Interface (`AITutorChatInterface.tsx`)

**Purpose:** Conversational tutoring with AI or teacher fallback.  
**Palette & Tone:** Dark mode friendly with contrasting message bubbles.  
**Data & Dependencies:** Chat service, tutoring session logs, Supabase `tutor_sessions`.

**Target Layout**
```
AppBar: Tutor Chat [Switch to Human Tutor]
Transcript Area: alternating bubbles, color-coded (student blue, tutor neutral)
Context Banner: “Working on Algebra · Session 12”
Suggested Prompts Chips below transcript
Composer: Text input + attachments + quick actions (graph, equation)
Footer: [Summarize Session] [Flag Issue]
```

**Layout & Scroll**
- AppBar 64 dp fixed; context banner 56 dp sits below and collapses on scroll.
- Transcript `FlatList` vertical scroll with inverted order option; maintain 16 dp padding.
- Suggested prompts horizontal scroll (chip height **48dp** (`height.sm`)) pinned above composer.
- Composer anchored at bottom (height 60 dp) with accessory tray.
- Footer actions surfaced as sheet after session end (non-sticky).

**Typography & Sizing**
- Header text `Typography.titleLarge` (22 sp).
- Message body `Typography.body`; system messages `Typography.caption`.
- Suggested chip labels `Typography.body` 16 sp.
- Composer input text `Typography.body`; helper text `Typography.caption`.

**UX Notes**
- Support math formatting.
- Provide read receipts and last response time.
- Show token/usage info subtly.

**Audit Findings**
- Composer features partially implemented.
- Accessibility (screen reader) improvements required.

**Next Steps**
1. Integrate equation editor.
2. Add session summary export.
3. Expand tests for conversation flows.

---

## 15. Activity Detail (`ActivityDetailScreen.tsx`)

**Purpose:** Detailed view for a specific activity (assignment, quiz, event).  
**Palette & Tone:** Neutral surfaces with activity-specific accent.  
**Data & Dependencies:** `activityService`, `assignmentsService`, `events`.

**Target Layout**
```
AppBar: Activity Detail
Hero Card: Title, type badge, due date/time, status chip
Sections:
 - Overview (description, objectives)
 - Requirements (resources, prerequisites)
 - Timeline (start, due, reminders)
 - Actions: [Start] [Submit] [View Rubric]
Footer tips: “Need clarification? Ask your teacher”
```

**Layout & Scroll**
- AppBar (64 dp) + hero card (200 dp) pinned; hero collapses to 96 dp on scroll.
- Sections stacked in single vertical scroll with `Spacing.lg` (24 dp) gaps.
- Action buttons inline per section; main CTA row placed near bottom but scrolls naturally.
- Tips banner (56 dp) pinned at bottom with safe-area.

**Typography & Sizing**
- Activity title `Typography.titleLarge`; subtitle `Typography.body`.
- Section headings `Typography.title`.
- Body copy `Typography.body`; metadata `Typography.small`.
- CTA buttons 56 dp height.

**UX Notes**
- Provide progress indicator if partially complete.
- Offer quick link to related class.

**Audit Findings**
- Layout dense; needs spacing.
- Not using shared components.

**Next Steps**
1. Convert to `Card`-based layout.
2. Integrate rubrics view.
3. Improve empty state messaging.

---

## 16. Collaborative Assignment Workspace (`CollaborativeAssignmentWorkspace.tsx`)

**Purpose:** Manage group assignments with tasks, chat, document collaboration.  
**Palette & Tone:** Professional, with subtle color coding per role.  
**Data & Dependencies:** `assignmentWorkspaceService`, `documentService`, `chat`.

**Target Layout**
```
Top: Assignment summary + progress bar
Body: Split view
 - Left: Task board (To do / Doing / Review)
 - Right: Tabs for Chat, Files, Notes
Footer: [Add Task] [Upload File] [Schedule Sync]
```

**Layout & Scroll**
- Summary banner (~96 dp) pinned; board + drawer arranged in responsive `Row`.
- Kanban board horizontally scrollable when columns >3; each column uses 16 dp inner padding with vertical scroll.
- Drawer panel 320 dp wide on tablets, slides over bottom as modal on phones; content vertical scroll.
- Footer action bar fixed 64 dp with safe-area support.

**Typography & Sizing**
- Summary heading `Typography.titleLarge` (22 sp); progress label `Typography.caption`.
- Column titles `Typography.title` (18 sp) uppercase optional.
- Card body `Typography.body` (16 sp) with metadata `Typography.caption`.
- Drawer tab text `Typography.body` medium, icons 20 dp.
- Footer buttons 56 dp height, icon 24 dp.

**UX Notes**
- Live cursors in document previews.
- Provide timeline activity log.

**Audit Findings**
- Document integration placeholder.
- Real-time edits not synced.

**Next Steps**
1. Hook into collaborative document API.
2. Add conflict resolution.
3. Provide offline notifications.

---

## 17. Peer Learning Network (`PeerLearningNetwork.tsx`)

**Purpose:** Discover and join peer study groups, discussions, mentors.  
**Palette & Tone:** Friendly, social, with accent color for group tags.  
**Data & Dependencies:** `peerNetworkService`, `mentorshipService`.

**Target Layout**
```
AppBar: Peer Network [Search] [More Filters]
Featured Group Card (large hero)
Group Cards Grid: show member avatars, topics, meeting times, join CTA
Mentor Spotlight Carousel
Upcoming Events List
Footer: [Create Group] [Request Mentor]
```

**Layout & Scroll**
- AppBar `height.lg` (64dp) fixed with search and [More Filters] button.
- **Filter bottom sheet:** Opens with "More Filters" button; persists state to AsyncStorage (`peer-network-filters-v1`); shows active filter count badge.
- Featured card `height.hero` (200dp) sits above main vertical scroll, collapsible on scroll.
- Groups grid uses two-column layout (card width min 160dp) within vertical `FlatList`.
- Mentor carousel horizontal scroll (card width 240dp).
- Footer CTA bar fixed `height.lg` (64dp).

**Typography & Sizing**
- Section headings `Typography.title` (18 sp).
- Group card title `Typography.body` (16 sp) semi-bold; subtitle `Typography.small`.
- Tag chips `Typography.caption`; avatar size **48dp** (interactive elements).
- CTA buttons 56 dp height.

**UX Notes**
- Provide trust indicators (verified mentor).
- Surface group capacity status.

**Audit Findings**
- Some sections stubbed.
- Layout inconsistent on smaller screens.

**Next Steps**
1. Build responsive grid layout.
2. Add mentor verification badges.
3. Hook into notifications for join requests.

---

## 18. Gamified Learning Hub (`GamifiedLearningHub.tsx`)

**Purpose:** Showcase gamification progress, badges, and leaderboards.  
**Palette & Tone:** Vibrant and celebratory while staying minimal—use `primary`, `success`, and `warning` tokens intentionally.  
**Data & Dependencies:** `gamificationService`, `leaderboardService`, `achievements`.

**Target Layout**
```
AppBar: Learning Hub
Hero Badge Card: Current Level + XP progress ring (animated)
Daily Goals Card: three checklist items with progress chips
Leaderboards Tabs: Class | Global | Friends (rank cards with avatars)
Badge Gallery: filterable grid (locked badges grayed-out)
Footer CTA: [Redeem Rewards] [Challenge Friend]
```

**Layout & Scroll**
- AppBar 64 dp fixed; hero badge card 220 dp pinned until scroll.
- Daily goals, leaderboards, gallery share parent vertical scroll.
- Leaderboard tabs pinned inside section (**48dp** (`height.sm`) height); content vertically scrollable with `FlatList`.
- Badge gallery uses grid (3 columns, card height 140 dp) with vertical scroll.
- Footer CTA bar fixed 64 dp.

**Typography & Sizing**
- Hero level text `Typography.titleLarge` (22 sp); XP label `Typography.caption`.
- Daily goal titles `Typography.body` (16 sp) with checkbox icons 20 dp.
- Leaderboard rank numbers `Typography.display` (24 sp) bold; names `Typography.body`.
- Badge labels `Typography.caption`.
- CTA buttons 56 dp height.

**UX Notes**
- Use confetti animation sparingly on major achievements.
- Provide shareable card for social bragging (image export).
- Expose progress-to-next-level copy for clarity.

**Audit Findings**
- Custom gradients rather than design tokens.
- Leaderboard list logic duplicated.
- Minimal accessibility support for celebrations.

**Next Steps**
1. Refactor styling to use MD3 tokens.
2. Extract shared leaderboard component.
3. Add accessible celebration messaging.

---

## 19. Assignment Detail (`AssignmentDetailScreen.tsx`)

**Purpose:** Detailed assignment instructions, submissions, grading rubric.  
**Palette & Tone:** Focused and structured, with status color accents.  
**Data & Dependencies:** `assignmentsService`, `submissionService`, Supabase `assignments`, `submissions`.

**Target Layout**
```
AppBar: Assignment Detail
Header Card: Title, subject chip, due date, status badge (color-coded)
Tabs: Overview | Rubric | Submissions | Discussion
Overview: instructions, resources list, attachments
Rubric: expandable criteria cards with scoring + weight
Submission CTA: [Start Submission] [Upload] [View History]
```

**Layout & Scroll**
- AppBar + header card (total ~220 dp) pinned with collapsible behaviour.
- Tab bar (**48dp** (`height.sm`)) fixed beneath header; each tab content vertical scroll.
- Sticky submission CTA row optional when draft in progress (height 64 dp) pinned above safe area.
- Resource lists use card stack with `Spacing.base` gap.

**Typography & Sizing**
- Assignment title `Typography.titleLarge` (22 sp); due date `Typography.body`.
- Tab labels `Typography.body` medium; indicator 3 dp.
- Body text `Typography.body`; rubric criterion label `Typography.title` (18 sp) with score `Typography.headline`.
- CTA buttons 56 dp height.

**UX Notes**
- Show countdown timer + timezone info.
- Provide autosave indicator for drafts.
- Summary card after submission with grade + feedback.

**Audit Findings**
- Rubric view missing.
- Upload progress feedback minimal.
- Discussion tab partially implemented.

**Next Steps**
1. Implement tabbed layout with extracted components.
2. Add upload progress + retry logic.
3. Integrate rubric rendering + analytics.

---

## 20. Doubt Submission (`DoubtSubmissionScreen.tsx`)

**Purpose:** Rich form to submit academic questions.  
**Palette & Tone:** Friendly and minimal—primary surfaces with accent prompts.  
**Data & Dependencies:** `doubtService`, `fileUploadService`.

**Target Layout**
```
AppBar: Submit a Doubt
Form Card:
 Subject chips (scrollable)
 Title input (MD3 TextField)
 Description (multi-line)
 Attachments area (file/image chips with icons)
 Priority toggle (Low/Medium/High)
 Tags (optional)
CTA Row: [Submit Doubt] (primary)  [Save Draft] (outline)
Info Banner: “Avg response time: 6h”
```

**Layout & Scroll**
- AppBar 64 dp fixed; form inside vertical scroll with `Spacing.base` gaps.
- Subject chips horizontal scroll row (chip height **48dp** (`height.sm`)).
- Attachments area supports horizontal thumbnail scroll (96 dp height).
- Primary CTA anchored in sticky footer (64 dp) when keyboard hidden; converts to inline button when keyboard shown.

**Typography & Sizing**
- Form section titles `Typography.title` (18 sp).
- Input labels `Typography.caption`, input text `Typography.body` (16 sp).
- Helper/error text `Typography.caption` (13 sp) color-coded.
- Buttons 56 dp height; chips `Typography.body` (16 sp).

**UX Notes**
- Validate required fields with inline feedback.
- Provide preview & remove for attachments.
- Success sheet with navigation to doubt history.

**Audit Findings**
- Validation minimal.
- Attachment UX basic.
- Analytics missing.

**Next Steps**
1. Integrate schema validation.
2. Enhance attachment management.
3. Add success/confirmation experiences.

---

## 21. Simple Doubt Submission (`SimpleDoubtSubmissionScreen.tsx`)

**Purpose:** Lightweight version for quick mobile submissions.  
**Palette & Tone:** Ultra minimal, optimized for speed.  
**Data & Dependencies:** Shares services with main doubt submission.

**Target Layout**
```
AppBar: Quick Doubt
Inline Form: Subject dropdown, single text area, optional photo button
Floating CTA: [Send Doubt]
```

**Layout & Scroll**
- AppBar 56 dp compact variant pinned.
- Form uses vertical scroll with minimal fields; maintain 24 dp top/bottom padding.
- Floating CTA (56 dp height) anchored bottom-right with 16 dp margin; converts to full-width bar when keyboard hidden.

**Typography & Sizing**
- Dropdown label `Typography.body` (16 sp) medium.
- Text area caption `Typography.caption`; body text `Typography.body`.
- Floating CTA uses `Typography.body` uppercase; icon 20 dp.

**UX Notes**
- One-handed ergonomics (CTA reachable).
- Auto-suggested tags from previous doubts.

**Audit Findings**
- Duplicated form logic.
- Limited success/failure feedback.

**Next Steps**
1. Extract shared form components.
2. Add inline success banner + quick navigation.

---

## 22. Study Library (`StudyLibraryScreen.tsx`)

**Purpose:** Central repository for resources and study materials.  
**Palette & Tone:** Clean card grid, accent tags for resource type.  
**Data & Dependencies:** `libraryService`, `mediaService`.

**Target Layout**
```
AppBar: Study Library [Search]
Filter Row: [Type ▾ PDF]  [More Filters •2]
(Advanced filters in bottom sheet: Subject, Difficulty, Tags, Date added)
Featured Resource (hero card with image)
Resource Grid (2-column cards)
 ┌─────────────┬─────────────┐
 │ PDF icon    │ Video icon  │
 │ Title       │ Title       │
 │ Tags        │ Tags        │
 │ [Download]  │ [Play]      │
 └─────────────┴─────────────┘
Download Queue Banner (if active)
```

**Layout & Scroll**
- AppBar `height.lg` (64dp) fixed with search and [More Filters] button.
- **Filter bottom sheet:** Opens with "More Filters" button; persists state to AsyncStorage (`study-library-filters-v1`); shows active filter count badge. Max 1-2 inline filters (Type dropdown shown in target layout above).
- Featured card `height.hero` (200dp) high, positioned above vertical grid.
- Resource grid uses `FlatList` with `numColumns=2`, card width ~164dp, height adaptive.
- Download queue banner `height.xl` (72dp) sticky at bottom when queue exists.

**Typography & Sizing**
- Section titles `Typography.title` (18 sp).
- Card title `Typography.body` (16 sp) bold; metadata `Typography.small`.
- Tag chips `Typography.caption`; icon size 24 dp.
- Buttons **48dp** (`height.sm`) height (secondary) or 56 dp (primary download).

**UX Notes**
- Support offline caching toggle.
- Provide skeleton cards for loading.
- Show download progress + pause/resume.

**Audit Findings**
- Layout inconsistent across devices.
- Missing download progress indicators.

**Next Steps**
1. Standardize card heights via tokens.
2. Implement download manager UI.
3. Add analytics for filter usage.

---

## 23. Progress Detail (`ProgressDetailScreen.tsx`)

**Purpose:** Academic performance breakdown with trends.  
**Palette & Tone:** Calm, data-focused; accent colors per subject.  
**Data & Dependencies:** `progressService`, `gradesService`.

**Target Layout**
```
AppBar: Progress Overview
Score Summary Card: GPA, trend arrow, percentile
Trend Chart (line/area) with legend + accessible summary
Subject Breakdown list with progress bars + badges
Goals & Alerts cards (callouts for risks)
CTA: [Share Report] [Plan next steps]
```

**Layout & Scroll**
- AppBar (64 dp) + summary card (200 dp) pinned with collapse on scroll.
- Chart section occupies 240 dp height with horizontal scroll disabled (use pinch for details optional).
- Subject breakdown uses vertical list within parent scroll; each item 72 dp height.
- Goals & alerts card stack extends scroll; CTA row sticky at bottom (64 dp).

**Typography & Sizing**
- Summary headline `Typography.titleLarge` (22 sp) with statistic `Typography.display` (24 sp).
- Chart axis labels `Typography.caption`; legend `Typography.small`.
- Subject rows: subject name `Typography.body` (16 sp) bold, score `Typography.title`.
- CTA buttons 56 dp height.

**UX Notes**
- Provide accessible chart alt text.
- Allow export to PDF/email.
- “Explain this” toggles for insights.

**Audit Findings**
- Charts hand-coded; needs shared component.
- Limited context copy.

**Next Steps**
1. Build chart component with accessibility support.
2. Add contextual explanations + tooltips.
3. Implement export/share flow.

---

## 24. Component Test Screen (`ComponentTestScreen.tsx`)

**Purpose:** Internal QA playground for student UI components.  
**Palette & Tone:** Developer tool; minimal styling but consistent tokens.  
**Data & Dependencies:** Direct imports of atoms/molecules.

**Target Layout**
```
Scrollable list of sections
Section headers (Typography.title)
Each component showcased with props, description, usage notes
Light/Dark toggle + localization switch
```

**Layout & Scroll**
- Single vertical scroll; sticky sub-header grouping optional.
- Toggle row pinned at top (height 56 dp) for theme/locale controls.
- Each component demo placed inside `Card` with 16 dp padding and 24 dp gap between sections.

**Typography & Sizing**
- Section headers `Typography.titleLarge` (22 sp) for easy scanning.
- Component labels `Typography.body` (16 sp); code snippets `Typography.caption` monospace.
- Toggle labels `Typography.body`; switches 24 dp height.

**UX Notes**
- Keep behind dev flag.
- Provide copy-to-clipboard snippets.

**Audit Findings**
- Needs refresh to include new components.
- Some sections outdated.

**Next Steps**
1. Update catalog to match latest library.
2. Add theme toggle + locale switch.
3. Document best practices inline.

---

## 25. Additional Live/Activity Screens

### Virtual Classroom Variants (`StudentLiveClassScreen.tsx`, `VirtualClassroomInterface.tsx`)
- Ensure consistent control bars, status chips, and presence indicators across variants.
- Provide fallback for low bandwidth (audio-only).

### Activity & Assignment Sisters (`ActivityDetailScreen.tsx`, `AssignmentDetailScreen.tsx`)
- Align header card pattern, share rubric components, and CTA placement.

### AI & Collaboration Set (`AIStudyScreen.tsx`, `EnhancedAIStudyAssistantScreen.tsx`, `AITutorChatInterface.tsx`, `CollaborativeAssignmentWorkspace.tsx`)
- Unify chat components, share plan builder pieces, reuse `QuickActionRow`.

---

## Implementation Checklist

1. **Hook Consolidation:** Build `useScheduleDetail`, `useStudentDashboardSummary`, `useLiveClassSession`, etc.  
2. **Component Library Usage:** Replace ad-hoc `View` styling with `Row`, `Col`, `Card`, `Badge`, `Button`, `Tabs`.  
3. **Theme Compliance:** Use palette tokens for states, support light/dark mode.  
4. **Accessibility:** Labels, announcements, focus management, **48dp minimum touch targets** (WCAG 2.1 AAA).  
5. **Analytics:** Log screen views and major interactions.  
6. **Testing:** Update Jest/RTL coverage, refresh Appium goldens, ensure Supabase test fixtures support new flows.  
7. **Documentation:** Update this blueprint after each screen refactor; attach screenshots/mockups when available.

---

**Maintainers:** Product Design Team, Mobile Engineering Team  
**Contact:** #student-app-refactor channel / design@manushi.edu

---
name: Screen Enhancer
description: Lightweight screen recreation with built-in quality checks. Analyzes existing screens (essential features only), prevents common mistakes (duplicate versions, hardcoded colors, missing auth, timezone bugs), and creates production-ready screens following established patterns. Use when user says "enhance screen", "fix screen", "recreate screen properly". Now integrates with ui_screens.md blueprint and student analysis files.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, mcp__supabase__execute_sql, mcp__supabase__list_tables
---

# Screen Enhancer - Blueprint-Driven Fast Analysis + Quality Recreation

## 🎯 PURPOSE

Analyze existing screens QUICKLY (extract essentials only) and recreate them with built-in quality checks to prevent the 7 most common mistakes.

**NEW FEATURES:**
- ✅ Uses `ui_screens.md` blueprint for MD3 specifications
- ✅ Leverages `student_analysis/` files for feature inventories
- ✅ Invokes agents for complex UI/UX or architecture tasks
- ✅ Follows Material Design 3 guidelines from blueprint
- ✅ Can delegate to screen-recreator skill when needed

**This skill:**
- ✅ Extracts only what's needed (UI sections, data, navigation)
- ✅ Reads ui_screens.md for screen specifications
- ✅ Uses student_analysis/*.md for comprehensive feature lists
- ✅ Prevents duplicate versions
- ✅ Prevents hardcoded values
- ✅ Prevents missing auth/teacher ID
- ✅ Prevents timezone bugs
- ✅ Enforces FlatList over .map()
- ✅ Enforces accessibility
- ✅ Enforces MD3 compliance (48dp touch targets, theme tokens, elevation)
- ✅ Delegates complex tasks to specialized agents
- ❌ Does NOT create massive documentation

---

## 📚 PREREQUISITE FILES TO READ

Before starting ANY screen enhancement, read these files in order:

### 1. UI Screens Blueprint (ALWAYS READ FIRST)
**Location:** `C:\PC\OLD\student_analysis\ui_screens.md`

**Why:** Contains complete MD3 specifications for all 25 student screens:
- Design tokens (colors, typography, height, spacing, elevation)
- Layout conventions (AppBar 64dp, touch targets 48dp minimum)
- Component specifications (Button, Card, Badge, Tabs, etc.)
- Filter patterns (max 2 visible, bottom sheet for advanced)
- Screen-by-screen target layouts and UX notes

**What to Extract:**
```markdown
For screen X (e.g., Schedule Screen - lines 282-352):
- Purpose and palette
- Target layout (ASCII wireframe)
- Layout & scroll specifications
- Typography & sizing (specific sp/dp values)
- UX notes (interaction patterns)
- Audit findings (known issues)
- Next steps (implementation guidance)
```

### 2. Student Screen Analysis (IF AVAILABLE)
**Location:** `C:\PC\OLD\student_analysis\{ScreenName}_ANALYSIS.md`

**Why:** Contains comprehensive feature inventory (50-150+ features per screen):
- Complete feature lists (saves 2-4 hours of analysis)
- Component breakdown (what Phase 0 components to use)
- Data dependencies (Supabase tables, hooks needed)
- Navigation targets (where screen navigates to)
- Complexity ratings (⭐⭐⭐ to ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐)

**Available Screens:**
- StudentDashboard (126+ features), StudentAILearningDashboard (90+ features)
- StudentLiveClassScreen (150+ features), ClassDetailScreen
- ScheduleScreen, EnhancedScheduleScreen, AssignmentDetailScreen
- DoubtSubmissionScreen, AIStudyScreen, StudyLibraryScreen
- ProgressDetailScreen, GamifiedLearningHub, PeerLearningNetwork
- ... and 10 more (23 total screens analyzed)

### 3. Screen Recreator Skill (REFERENCE FOR PATTERNS)
**Location:** `C:\PC\.claude\skills\screen-recreator\SKILL.md`

**Why:** Contains production-ready patterns, prerequisites, and quality checklists:
- Phase 0 component usage examples
- Student hook patterns (useStudentProgress, useStudentSchedule, etc.)
- MD3 acceptance checklist (34 items)
- Common error prevention patterns
- Template structures

**When to Read:**
- Creating new student screens (check prerequisites)
- Need template structure for student/parent screens
- Verifying MD3 compliance requirements

---

## 🚫 THE 7 DEADLY SINS (Auto-Prevention)

### 1. Duplicate Versions ❌
**Problem:** `Screen.tsx` + `NewScreen.tsx` + `Screen_NEW.tsx`

**Prevention:**
```bash
# Before creating, check for duplicates
find . -name "*ScreenName*.tsx" | wc -l
# If > 1, STOP and ask user which to replace
```

**Rule:** ONE canonical version per feature. Delete others first.

---

### 2. Missing Auth/Teacher ID ❌
**Problem:** `marked_by: null // TODO: Get teacher ID`

**Prevention:**
```typescript
// ❌ FORBIDDEN
marked_by: null

// ✅ REQUIRED - Auto-inject auth context
const { teacherId, userId } = useAuth(); // or useContext(TeacherContext)

// Always pass to mutations
created_by: teacherId,
updated_by: teacherId,
marked_by: teacherId,
```

**Validation:** Grep for `null.*TODO.*teacher` before completing.

---

### 3. Timezone Bugs ❌
**Problem:** `new Date().toISOString().split('T')[0]` (UTC!)

**Prevention:**
```typescript
// ❌ FORBIDDEN - UTC timezone
const today = new Date().toISOString().split('T')[0];

// ✅ REQUIRED - Local timezone helper
// Create utils/dateHelpers.ts if doesn't exist
export const getTodayLocal = (timezone = 'Asia/Kolkata') => {
  return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
};

// Use in components
const [selectedDate] = useState(getTodayLocal());
```

**Validation:** Grep for `toISOString.*split.*T` - must have comment explaining why if used.

---

### 4. Hardcoded Colors ❌
**Problem:** `style={{ color: '#10B981' }}`

**Prevention:**
```typescript
// ❌ FORBIDDEN - Raw hex colors
<Text style={{ color: '#10B981' }}>Present</Text>

// ✅ REQUIRED - Theme tokens from ui_screens.md
// Use design tokens specified in ui_screens.md (lines 17-34)
import { Colors } from '../../theme/designSystem';

// Light Mode:
// Primary: #2563EB, Surface: #F8FAFC, OnSurface: #0F172A
// Success: #10B981, Warning: #F59E0B, Danger: #EF4444

<Text style={{ color: Colors.success }}>Present</Text>
```

**Validation:** Grep for `#[0-9A-F]{6}` in JSX - must be from theme.

---

### 5. .map() Instead of FlatList ❌
**Problem:** `{students.map((s) => <Card>...</Card>)}`

**Prevention:**
```typescript
// ❌ FORBIDDEN - .map() for lists
{students.map((student) => (
  <Card key={student.id}>...</Card>
))}

// ✅ REQUIRED - FlatList with optimization
<FlatList
  data={students}
  keyExtractor={(item) => item.id}
  renderItem={({ item: student }) => (
    <Card variant="outlined">
      {/* Same card content */}
    </Card>
  )}
  contentContainerStyle={{ gap: Spacing.sm }}
  showsVerticalScrollIndicator={false}
  removeClippedSubviews={true}
/>
```

**Exception:** Lists under 10 items can use .map() (add comment explaining).

**Validation:** Grep for `.map.*=>.*<Card` - flag for review.

---

### 6. Missing Accessibility ❌
**Problem:** Buttons without `accessibilityLabel`

**Prevention:**
```typescript
// ❌ FORBIDDEN - No accessibility
<TouchableOpacity onPress={handlePress}>
  <Text>Submit</Text>
</TouchableOpacity>

// ✅ REQUIRED - Full accessibility (WCAG 2.1 AAA)
// Per ui_screens.md (line 101): "All interactive elements require accessibilityLabel"
<TouchableOpacity
  onPress={handlePress}
  accessibilityLabel={`Mark ${student.name} as present`}
  accessibilityRole="button"
  accessibilityState={{ disabled: isLoading }}
>
  <Text>Submit</Text>
</TouchableOpacity>
```

**Validation:** All TouchableOpacity/Pressable MUST have accessibilityLabel and accessibilityRole.

---

### 7. No Batch Operations ❌
**Problem:** Every tap = immediate DB write (40 taps = 40 queries)

**Prevention:**
```typescript
// ❌ FORBIDDEN - Immediate write on every change
const handleMark = (studentId, status) => {
  mutation.mutate({ studentId, status }); // Writes immediately
};

// ✅ REQUIRED - Batch submit pattern
const [localState, setLocalState] = useState({});

const handleMark = (studentId, status) => {
  // Update local state only
  setLocalState(prev => ({ ...prev, [studentId]: status }));
};

const handleSubmitAll = async () => {
  // Write all at once
  const records = Object.entries(localState).map(([id, status]) => ({
    student_id: id,
    status,
    marked_by: teacherId,
    date: selectedDate,
  }));

  await supabase.from('attendance').upsert(records);
};

// Add "Submit All" button
<Button onPress={handleSubmitAll}>
  Submit Attendance ({Object.keys(localState).length} marked)
</Button>
```

**Validation:** For screens with repetitive writes (attendance, grading), require batch submit.

---

## 🆕 MATERIAL DESIGN 3 COMPLIANCE (From ui_screens.md)

### 8. Touch Target Violations ❌
**Problem:** Interactive elements < 48dp (WCAG 2.1 AAA violation)

**Prevention:**
```typescript
// ❌ FORBIDDEN - Per ui_screens.md (line 91)
<Button style={{ height: 40 }}>Click Me</Button>
<Chip height={36}>Tag</Chip>

// ✅ REQUIRED - Use height tokens from ui_screens.md (lines 43-48)
// height.sm: 48dp (chips, secondary buttons, tabs)
// height.md: 56dp (primary buttons, compact AppBar)
// height.lg: 64dp (standard AppBar, control bars)
// height.xl: 72dp (enhanced AppBar, session banners)

<Button style={{ height: 48 }}>Click Me</Button> // height.sm
<Chip height={48}>Tag</Chip>
```

**Validation:** All interactive elements must be ≥48dp per WCAG 2.1 AAA.

---

### 9. Filter Overload ❌
**Problem:** 7 inline filters before content (ui_screens.md line 94)

**Prevention:**
```typescript
// ❌ FORBIDDEN - >2 visible filters
<View>
  <FilterButton>Subject ▾</FilterButton>
  <FilterButton>Type ▾</FilterButton>
  <FilterButton>Status ▾</FilterButton>
  <FilterButton>Difficulty ▾</FilterButton>
  <FilterButton>Date ▾</FilterButton>
</View>

// ✅ REQUIRED - Progressive disclosure pattern
// Max 2 visible inline + bottom sheet for advanced
// Per ui_screens.md (lines 298-299, 338, 973, 1187, 1202)
<View>
  <FilterButton>Type ▾ PDF</FilterButton>
  <Button onPress={openBottomSheet}>More Filters •2</Button>
</View>

<FilterBottomSheet
  storageKey="screen-filters-v1"
  filters={advancedFilters}
  onApply={(filters) => setActiveFilters(filters)}
  persistState={true} // AsyncStorage
/>
```

**Validation:** Max 2 visible inline filters; advanced filters in bottom sheet with AsyncStorage persistence.

---

## 📋 BLUEPRINT-DRIVEN ANALYSIS (Using ui_screens.md)

When analyzing existing screen, extract essentials AND check against blueprint:

### Step 1: Read Blueprint Section
```markdown
# For ScheduleScreen (ui_screens.md lines 282-352)

## Blueprint Specifications:
**Purpose:** Multi-view calendar for classes, deadlines, personal study blocks
**Palette:** Bright minimal; primary blue for events, red for deadlines

**Target Layout (from blueprint):**
- AppBar (64dp) with subtitle
- Summary chips row (48dp height each)
- View toggle bar (Day/Week/Month + Today + More Filters)
- Week strip (horizontally scrollable, 72dp items)
- Day agenda timeline
- Deadlines & reminders
- Quick actions
- Sticky footer (72dp)

**Layout & Scroll (from blueprint):**
- AppBar + view toggle: height.lg + height.sm (112dp combined)
- Week strip: 72dp × 72dp items, horizontal scroll
- Sticky footer: height.xl (72dp)
- Filter bottom sheet: AsyncStorage (schedule-filters-v1)

**Typography (from blueprint):**
- View toggle: Typography.body (16sp) medium
- Week strip days: Typography.title (18sp)
- Agenda time: Typography.small (14sp) monospace
- Buttons: height.sm (48dp)

**UX Notes (from blueprint):**
- Timeline uses Row/Card with status chips
- Month view uses CalendarGrid
- Max 2 visible filters (Day/Week/Month toggle + Today); advanced in bottom sheet
```

### Step 2: Analyze Existing Implementation
```markdown
## Current Implementation:
1. UI Sections: [List what exists]
2. Data Queries: [List Supabase queries]
3. Calculations: [List business logic]
4. Navigation: [List routes]

## Compliance Check vs Blueprint:
✅ AppBar present (but 56dp, should be 64dp)
❌ Summary chips missing
✅ View toggle present
❌ Filter row has 7 filters (should be max 2 + bottom sheet)
✅ Week strip present (but 60dp items, should be 72dp)
❌ Footer is inline (should be sticky, 72dp)
❌ Touch targets: some buttons are 40dp (should be 48dp)
```

### Step 3: Extract Issues Found
```markdown
## 🚨 Issues to Fix (Against Blueprint + 7 Deadly Sins):
- ❌ AppBar height: 56dp → 64dp (height.lg from blueprint)
- ❌ Missing summary chips row (per blueprint line 295)
- ❌ Filter overload: 7 visible → max 2 + bottom sheet (blueprint line 338)
- ❌ Week strip items: 60dp → 72dp (blueprint line 323)
- ❌ Footer not sticky: should be height.xl (72dp) with safe-area (blueprint line 325)
- ❌ Touch targets: 3 buttons at 40dp → 48dp minimum (WCAG AAA)
- ❌ Missing teacherId in mutations (Deadly Sin #2)
- ❌ Hardcoded colors: #2563EB → Colors.primary (Deadly Sin #4)
- ✅ Already using BaseScreen wrapper
- ✅ Already using React Query
```

---

## 🤖 WHEN TO USE AGENTS

For complex tasks, delegate to specialized agents using the Task tool:

### Use `ui-ux-implementation` agent when:
```typescript
// Screen needs complete UI/UX overhaul following blueprint
Task({
  subagent_type: "ui-ux-implementation",
  description: "Implement Schedule Screen UI",
  prompt: `
Implement ScheduleScreen.tsx following ui_screens.md blueprint (lines 282-352).

Blueprint requirements:
- AppBar: height.lg (64dp) with subtitle
- Summary chips: 4 chips at height.sm (48dp)
- View toggle: Day/Week/Month + Today + [More Filters]
- Week strip: 72dp × 72dp items, horizontal scroll
- Filter bottom sheet: AsyncStorage (schedule-filters-v1), max 2 visible inline
- Sticky footer: height.xl (72dp) with safe-area

Existing file: C:/PC/OLD/src/screens/student/ScheduleScreen.tsx
Analyze current implementation, identify gaps vs blueprint, and enhance.

Return: List of changes made and files modified.
  `
});
```

### Use `architecture-integration-specialist` agent when:
```typescript
// Screen needs Supabase integration, real-time subscriptions, service layer
Task({
  subagent_type: "architecture-integration-specialist",
  description: "Design Schedule data architecture",
  prompt: `
Design data architecture for ScheduleScreen:

Data sources (from ui_screens.md line 286):
- classes table (class schedule)
- assignments table (deadlines)
- events table (personal study blocks)

Requirements:
- Real-time updates for class status (goes live)
- Filter by subject, status, type
- Date range queries (week/month views)
- Persist filter state to AsyncStorage

Create:
1. useScheduleDetail hook (fetch classes, assignments, events)
2. Real-time subscription setup
3. Filter state management pattern
4. AsyncStorage persistence helper

Return: Hook implementation and integration guide.
  `
});
```

### Use `performance-optimizer` agent when:
```typescript
// Screen has lag, slow rendering, bundle size issues
Task({
  subagent_type: "performance-optimizer",
  description: "Optimize Schedule Screen performance",
  prompt: `
Analyze and optimize ScheduleScreen.tsx:

Issues reported:
- Scrolling lags when week strip has 30+ days
- Re-renders on every filter change
- Bundle size increased 280kb after adding calendar grid

Optimize:
1. Memoize week strip items (React.memo)
2. Use FlatList for agenda timeline (not .map)
3. Optimize filter state updates (useMemo)
4. Lazy load CalendarGrid component
5. Analyze bundle size contributors

Return: Performance improvements made and metrics.
  `
});
```

### Delegate to `screen-recreator` skill when:
```typescript
// Need full recreation with Phase 0 prerequisites check
// (Use Skill tool, not Task tool)
```

---

## 🎯 USAGE WORKFLOW (Blueprint-Driven)

### Step 1: Check If Blueprint Exists
```bash
# Check if screen is in ui_screens.md
grep -n "## .*Schedule Screen" C:/PC/OLD/student_analysis/ui_screens.md

# If found (e.g., lines 282-352):
# Read blueprint section to get specifications
```

### Step 2: Check If Analysis File Exists
```bash
# Check if detailed analysis exists
ls C:/PC/OLD/student_analysis/ScheduleScreen_ANALYSIS.md

# If exists: Read for complete feature inventory (saves 2-4 hours)
# If not exists: Do quick analysis (essentials only)
```

### Step 3: Quick Analysis (If No Analysis File)
```
User: "Enhance ScheduleScreen.tsx"
```

**Assistant Actions:**
1. **Read blueprint:** `ui_screens.md` lines 282-352 for specifications
2. **Read existing file:** `ScheduleScreen.tsx`
3. **Check for duplicates:** Find all `*Schedule*.tsx` files
4. **Extract essentials:** UI sections, data, navigation (5 categories)
5. **Identify issues:** Against blueprint + 7 deadly sins
6. **NO massive documentation:** Just bullet points

**Output Example:**
```markdown
## Quick Analysis: ScheduleScreen.tsx

### Blueprint Specifications (ui_screens.md lines 282-352)
- Multi-view calendar (Day/Week/Month)
- AppBar: height.lg (64dp) + subtitle
- Summary chips: 4 chips @ height.sm (48dp)
- View toggle + max 2 visible filters + bottom sheet
- Week strip: 72dp × 72dp horizontal scroll
- Sticky footer: height.xl (72dp)

### Current Implementation
- UI: AppBar (56dp), view toggle, week strip (60dp items), agenda list
- Data: Query classes + assignments from Supabase
- Filters: 7 inline dropdowns (Subject, Status, Type, Date, etc.)
- Footer: Inline buttons (not sticky)

### Issues vs Blueprint
❌ AppBar: 56dp → should be 64dp (height.lg)
❌ Missing summary chips row
❌ Filter overload: 7 visible → max 2 + bottom sheet
❌ Week strip: 60dp items → should be 72dp
❌ Footer: not sticky → should be height.xl (72dp)
❌ Touch targets: 3 buttons at 40dp → 48dp minimum
❌ Missing teacherId in mutations
❌ Hardcoded colors: 5 instances
✅ Already using BaseScreen
✅ Already using React Query

### Recommendation
Enhance in place following blueprint specs. Use ui-ux-implementation agent for filter bottom sheet redesign.
```

---

### Step 4: Decide Enhancement Strategy

**Option A: Quick Fix (Manual Edits)**
```typescript
// For simple issues: height corrections, color replacements
Edit(file_path, old_string: "height: 56", new_string: "height: 64")
Edit(file_path, old_string: "#2563EB", new_string: "Colors.primary")
```

**Option B: Agent-Assisted (Complex UI/UX)**
```typescript
// For major redesigns: filter bottom sheets, layout restructure
Task({
  subagent_type: "ui-ux-implementation",
  description: "Redesign filter system",
  prompt: `Implement filter bottom sheet pattern from ui_screens.md...`
});
```

**Option C: Delegate to screen-recreator**
```typescript
// For complete recreation with prerequisites check
// Use when: need Phase 0 validation, MD3 compliance check, student hooks
```

---

### Step 5: Enhance Screen (With Blueprint Compliance)

**Strategy: Edit existing file following blueprint**

```typescript
// Fix AppBar height (blueprint: height.lg = 64dp)
Edit({
  file_path: "src/screens/student/ScheduleScreen.tsx",
  old_string: `<AppBar style={{ height: 56 }}>`,
  new_string: `<AppBar style={{ height: 64 }}> {/* height.lg per ui_screens.md */}`
});

// Add summary chips row (blueprint: lines 295, height.sm = 48dp)
Edit({
  file_path: "src/screens/student/ScheduleScreen.tsx",
  old_string: `<AppBar>...</AppBar>\n<ViewToggle>`,
  new_string: `<AppBar>...</AppBar>\n<SummaryChipsRow height={48}>\n  <Chip>Today's Classes • 3</Chip>\n  <Chip>Study Minutes • 2h</Chip>\n  <Chip>Due Soon • 2</Chip>\n  <Chip>Attendance • 92%</Chip>\n</SummaryChipsRow>\n<ViewToggle>`
});

// Fix filter overload (blueprint: max 2 + bottom sheet)
// This is complex - delegate to agent
Task({
  subagent_type: "ui-ux-implementation",
  description: "Implement filter bottom sheet",
  prompt: `
Current: 7 inline filters (Subject, Status, Type, Difficulty, Date, Teacher, Location)
Target: Max 2 inline (Day/Week/Month toggle + Today) + bottom sheet for advanced

Per ui_screens.md lines 298-299, 338:
- View toggle: [Day] [Week] [Month] [Today] [More Filters •2]
- Advanced filters in bottom sheet: Subject, Status, Type, Date picker
- Persist to AsyncStorage: schedule-filters-v1
- Show active filter count badge

Implement FilterBottomSheet component and integrate.
  `
});

// Fix week strip item size (blueprint: 72dp × 72dp)
Edit({
  file_path: "src/screens/student/ScheduleScreen.tsx",
  old_string: `itemWidth: 60, itemHeight: 60`,
  new_string: `itemWidth: 72, itemHeight: 72 // Per ui_screens.md line 323`
});

// Fix footer (blueprint: sticky, height.xl = 72dp)
Edit({
  file_path: "src/screens/student/ScheduleScreen.tsx",
  old_string: `<View style={styles.footer}>`,
  new_string: `<View style={[styles.footer, { position: 'absolute', bottom: 0, height: 72 }]}> {/* height.xl, sticky per blueprint */}`
});

// Fix touch targets (48dp minimum)
Edit({
  file_path: "src/screens/student/ScheduleScreen.tsx",
  old_string: `<Button style={{ height: 40 }}`,
  new_string: `<Button style={{ height: 48 }} // WCAG 2.1 AAA minimum per ui_screens.md`,
  replace_all: true
});

// Fix hardcoded colors (use theme tokens)
Edit({
  file_path: "src/screens/student/ScheduleScreen.tsx",
  old_string: `color: '#2563EB'`,
  new_string: `color: Colors.primary // From ui_screens.md design tokens`,
  replace_all: true
});

// Add teacherId (from auth context)
Edit({
  file_path: "src/screens/student/ScheduleScreen.tsx",
  old_string: `const ScheduleScreen = ({ route }) => {`,
  new_string: `const ScheduleScreen = ({ route }) => {\n  const { teacherId } = useAuth();`
});
```

---

### Step 6: Post-Enhancement Validation (Blueprint + 7 Deadly Sins)

```bash
# 1. Blueprint compliance checks
echo "Checking blueprint compliance..."

# AppBar height
grep -n "AppBar.*height.*64" ScheduleScreen.tsx
# Summary chips row
grep -n "SummaryChipsRow\|Today's Classes" ScheduleScreen.tsx
# Filter pattern (max 2 + bottom sheet)
grep -c "FilterButton\|FilterChip" ScheduleScreen.tsx  # Should be ≤2
grep -n "FilterBottomSheet\|More Filters" ScheduleScreen.tsx
# Week strip size
grep -n "itemWidth.*72\|itemHeight.*72" ScheduleScreen.tsx
# Sticky footer
grep -n "position.*absolute.*bottom\|height.*72" ScheduleScreen.tsx

# 2. WCAG touch targets (48dp minimum)
grep -n "height.*[1-4][0-7]" ScheduleScreen.tsx  # Should be empty (no < 48dp)

# 3. Theme colors (no hardcoded hex)
grep -n "#[0-9A-F]\{6\}" ScheduleScreen.tsx  # Should be empty or only in StyleSheet

# 4. Deadly Sins checks
grep -c "TODO.*teacher\|marked_by.*null" ScheduleScreen.tsx  # Should be 0
grep -c "toISOString.*split" ScheduleScreen.tsx  # Should be 0 or commented
grep -c "accessibilityLabel" ScheduleScreen.tsx  # Should match TouchableOpacity count

# 5. Accessibility count
grep -c "TouchableOpacity\|Pressable" ScheduleScreen.tsx
grep -c "accessibilityLabel" ScheduleScreen.tsx
# Should match
```

---

### Step 7: Provide Blueprint-Compliance Summary

```markdown
## ✅ Enhancement Complete: ScheduleScreen.tsx

### Blueprint Compliance (ui_screens.md lines 282-352)
✅ AppBar: 56dp → 64dp (height.lg)
✅ Summary chips: Added 4 chips @ 48dp (height.sm)
✅ Filter pattern: 7 inline → 2 visible + bottom sheet (progressive disclosure)
✅ Week strip: 60dp → 72dp items
✅ Sticky footer: Added position:absolute, height.xl (72dp)
✅ Touch targets: All ≥48dp (WCAG 2.1 AAA)
✅ Theme tokens: 5 hardcoded colors replaced

### 7 Deadly Sins Fixed
✅ #2: Added useAuth() for teacherId
✅ #3: Replaced toISOString() with getTodayLocal()
✅ #4: All colors from theme tokens
✅ #6: All 12 buttons have accessibilityLabel
✅ #8: All touch targets ≥48dp
✅ #9: Filter overload fixed (max 2 + bottom sheet)

### Agent Tasks Completed
✅ ui-ux-implementation: Filter bottom sheet redesign
   - Created FilterBottomSheet component
   - AsyncStorage persistence (schedule-filters-v1)
   - Active filter count badge
   - 7 filters → 2 visible + 5 in bottom sheet

### Files Modified
- `src/screens/student/ScheduleScreen.tsx` (blueprint-compliant)
- `src/components/student/molecules/FilterBottomSheet.tsx` (new)
- `src/utils/dateHelpers.ts` (created)

### Testing Checklist
1. [ ] Verify AppBar is 64dp height
2. [ ] Verify summary chips show correct counts
3. [ ] Verify "More Filters" opens bottom sheet
4. [ ] Verify filters persist after app restart (AsyncStorage)
5. [ ] Verify week strip items are 72dp × 72dp
6. [ ] Verify footer is sticky at bottom
7. [ ] Verify all buttons ≥48dp (WCAG AAA)
8. [ ] Verify date shows in IST (not UTC)
9. [ ] Verify mutations include teacherId

### Blueprint Conformance: 100%
All specifications from ui_screens.md (lines 282-352) implemented.
```

---

## 📊 DECISION TREE: When to Use What

```
User requests: "Enhance ScheduleScreen"
    ↓
Does ui_screens.md have this screen? (grep for "Schedule Screen")
    ↓
├─ YES (lines 282-352 found)
│   ↓
│   Read blueprint section
│   ↓
│   Does student_analysis/ScheduleScreen_ANALYSIS.md exist?
│   ↓
│   ├─ YES → Use comprehensive feature inventory (saves 2-4 hours)
│   └─ NO → Do quick analysis (essentials only)
│   ↓
│   Complexity assessment:
│   ↓
│   ├─ Simple fixes (height, colors, auth) → Manual edits
│   ├─ Medium (filter redesign, layout) → Use ui-ux-implementation agent
│   ├─ Complex (data architecture) → Use architecture-integration-specialist agent
│   └─ New screen + prerequisites → Delegate to screen-recreator skill
│
└─ NO (not in ui_screens.md)
    ↓
    Is this a parent/teacher screen?
    ↓
    ├─ YES → Use screen-enhancer patterns (7 deadly sins)
    └─ NO → Use screen-recreator for full analysis
```

---

## 🤖 AGENT INTEGRATION EXAMPLES

### Example 1: Filter Bottom Sheet Redesign

```typescript
// User: "Enhance ScheduleScreen filters per blueprint"

// Step 1: Read blueprint
const blueprint = await Read({ file_path: "C:/PC/OLD/student_analysis/ui_screens.md", offset: 282, limit: 70 });
// Extract: Max 2 visible, bottom sheet for advanced, AsyncStorage persistence

// Step 2: Analyze current
const current = await Read({ file_path: "C:/PC/OLD/src/screens/student/ScheduleScreen.tsx" });
// Found: 7 inline filters (Subject, Status, Type, Difficulty, Date, Teacher, Location)

// Step 3: Delegate complex UI work to agent
await Task({
  subagent_type: "ui-ux-implementation",
  description: "Redesign filter UI pattern",
  prompt: `
Current state: ScheduleScreen has 7 inline filter dropdowns before content.

Target state (per ui_screens.md lines 298-299, 338):
- View toggle: [Day] [Week]* [Month]   [Today]   [More Filters •2]
- Bottom sheet: Subject, Status, Type, Date picker
- AsyncStorage persistence: schedule-filters-v1
- Active filter count badge

Tasks:
1. Create FilterBottomSheet component (src/components/student/molecules/FilterBottomSheet.tsx)
2. Implement AsyncStorage persistence
3. Update ScheduleScreen.tsx to use new pattern
4. Maintain existing filter logic
5. Add active count badge

Constraints:
- WCAG 2.1 AAA compliant (48dp touch targets)
- Material Design 3 bottom sheet specs
- Use existing Button, Chip components
- Real filter state (no mock data)

Return:
- FilterBottomSheet component code
- Updated ScheduleScreen integration
- AsyncStorage persistence implementation
  `
});

// Step 4: Verify agent output
// Check files created/modified
// Run validation checks
```

---

### Example 2: Performance Optimization

```typescript
// User: "ScheduleScreen is lagging when scrolling week strip"

// Step 1: Identify issue
// Week strip has 30+ day items, re-renders on every filter change

// Step 2: Delegate to performance agent
await Task({
  subagent_type: "performance-optimizer",
  description: "Optimize Schedule Screen rendering",
  prompt: `
Analyze and optimize ScheduleScreen.tsx performance:

Issues:
1. Week strip with 30+ items (horizontal FlatList)
2. Re-renders on every filter change
3. Agenda timeline uses .map() not FlatList

Optimize:
1. Memoize week strip items (React.memo)
2. Use useMemo for filtered agenda items
3. Convert agenda timeline to FlatList
4. Optimize filter state updates (prevent cascade renders)
5. Add performance metrics (render count, time)

Constraints:
- Maintain existing functionality
- Follow ui_screens.md specifications
- WCAG accessibility preserved

Return:
- Performance improvements made
- Before/after metrics
- Remaining optimization opportunities
  `
});
```

---

### Example 3: Data Architecture Design

```typescript
// User: "Add real-time notifications when class goes live"

// Step 1: Read blueprint requirements
// ui_screens.md line 286: "real-time services (LiveClassService)"

// Step 2: Delegate to architecture specialist
await Task({
  subagent_type: "architecture-integration-specialist",
  description: "Design real-time notifications",
  prompt: `
Add real-time class status updates to ScheduleScreen:

Requirements (from ui_screens.md):
- Detect when class status changes to 'live'
- Show notification badge on schedule item
- Update agenda timeline in real-time
- No page refresh needed

Implementation:
1. Create useScheduleRealtime hook
2. Set up Supabase subscription on classes table
3. Update UI when class.status changes to 'live'
4. Show notification badge + pulse animation
5. Integrate with existing useScheduleDetail hook

Constraints:
- Efficient (subscribe only to user's classes)
- Unsubscribe on unmount (prevent memory leaks)
- Handle connection drops gracefully

Return:
- useScheduleRealtime hook implementation
- Integration guide for ScheduleScreen
- Supabase subscription setup
  `
});
```

---

## ✅ SUCCESS CRITERIA (Blueprint + Quality)

Screen enhancement is complete when:

### Blueprint Compliance (ui_screens.md)
- [x] Layout matches target layout from blueprint
- [x] AppBar height correct (height.lg/md/xl per spec)
- [x] Touch targets ≥48dp (WCAG 2.1 AAA)
- [x] Typography matches spec (sp values)
- [x] Spacing uses tokens (spacing.xs/sm/base/lg/xl)
- [x] Elevation correct (0-5 levels per MD3)
- [x] Colors from design tokens (no hardcoded hex)
- [x] Filter pattern: max 2 visible + bottom sheet
- [x] Footer sticky if specified in blueprint
- [x] UX notes implemented (interaction patterns)

### 7 Deadly Sins Prevention
- [x] No duplicate versions exist
- [x] Auth context used (no null teacherId)
- [x] Timezone-safe date handling
- [x] All colors from theme (no raw hex in JSX)
- [x] Lists use FlatList (or .map() with justification)
- [x] All interactive elements have accessibility
- [x] Batch operations for repetitive writes

### Quality Gates
- [x] All validation checks pass
- [x] TypeScript: 0 errors
- [x] ESLint: 0 warnings
- [x] User receives concise summary with blueprint conformance %

---

## 🚀 EXAMPLE OUTPUT

```
✅ ScheduleScreen.tsx Enhanced (Blueprint Compliant)

Blueprint Conformance: 100% (ui_screens.md lines 282-352)

Fixed Issues:
• AppBar: 56dp → 64dp (height.lg) ✅
• Added summary chips row (4 chips @ 48dp) ✅
• Filter redesign: 7 inline → 2 + bottom sheet ✅
• Week strip: 60dp → 72dp items ✅
• Footer: Made sticky, height.xl (72dp) ✅
• Touch targets: 3 buttons 40dp → 48dp ✅
• Colors: 5 hardcoded → theme tokens ✅
• Added useAuth() for teacherId ✅
• Date: toISOString() → getTodayLocal() ✅

Agent Tasks:
• ui-ux-implementation: Filter bottom sheet ✅
  - FilterBottomSheet component created
  - AsyncStorage persistence (schedule-filters-v1)
  - Active filter count badge (•2)

Files Modified:
• src/screens/student/ScheduleScreen.tsx
• src/components/student/molecules/FilterBottomSheet.tsx (new)
• src/utils/dateHelpers.ts (created)

Testing Checklist:
1. Verify blueprint specs (10 items) - See above
2. Test filter bottom sheet persistence
3. Test real-time class status updates
4. Verify WCAG 2.1 AAA compliance

Total Time: 8 minutes (blueprint-driven)
Blueprint Conformance: 100%
```

---

**Remember:**
- **Always read ui_screens.md first** for screen specifications
- **Use student_analysis/*.md** if available (saves 2-4 hours)
- **Delegate complex tasks to agents** (UI/UX, architecture, performance)
- **Reference screen-recreator skill** for patterns and prerequisites
- Speed + Quality + Blueprint Compliance = Production Ready

This skill analyzes fast using blueprints, prevents mistakes during creation, leverages agents for complex work, and validates against MD3 specifications.

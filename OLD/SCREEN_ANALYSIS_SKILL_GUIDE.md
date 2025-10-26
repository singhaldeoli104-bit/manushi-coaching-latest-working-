# Screen Analysis Skill - Usage Guide

## 🎯 What Is This?

A systematic analysis tool that examines existing React Native screens and extracts **EVERY SINGLE FEATURE** without missing anything. This ensures 100% feature parity when recreating screens.

## 📍 Location

**Skill Command:** `/analyze-screen`

**File:** `C:\PC\.claude\commands\analyze-screen.md`

---

## 🚀 How To Use

### Basic Usage

```
/analyze-screen

Analyze EnhancedParentDashboardScreen.tsx
```

The skill will:
1. ✅ Read the ENTIRE file (every single line)
2. ✅ Extract all imports, types, state, queries
3. ✅ Document all UI sections in render order
4. ✅ List all user interactions and event handlers
5. ✅ Identify all calculations and business logic
6. ✅ Map navigation flows (entry/exit points)
7. ✅ Extract styling patterns
8. ✅ Find all TODOs, FIXMEs, issues
9. ✅ Create comprehensive feature checklist
10. ✅ Provide recreation recommendations

---

## 📋 What Gets Analyzed

### A. Complete Inventory (19 Categories)

1. **File Metadata** - Path, size, component name
2. **Imports** - All dependencies categorized
3. **TypeScript Types** - Props, interfaces, enums
4. **Props & Params** - Route params, component props
5. **State Management** - useState, useMemo, useRef, context
6. **Data Fetching** - Queries, API calls, mock data
7. **Calculations** - All business logic and formulas
8. **UI Sections** - Every visual element in order
9. **Components Used** - Complete component inventory
10. **Navigation** - Entry/exit points, params passed
11. **User Interactions** - All taps, inputs, gestures
12. **Conditional Rendering** - All if/else UI paths
13. **Styling** - StyleSheet, inline, dynamic styles
14. **Side Effects** - All useEffect hooks
15. **Performance** - Memoization, optimizations
16. **Error Handling** - Try-catch, boundaries, fallbacks
17. **Analytics** - All tracking calls
18. **Accessibility** - Labels, hints, roles
19. **Documentation** - Comments, TODOs, FIXMEs

---

## 💡 Why Use This?

### Problem: Missed Features
When manually recreating a screen, developers often miss:
- Hidden conditional UI
- Edge case handling
- Subtle calculations
- Uncommon user interactions
- Analytics tracking
- Accessibility features

### Solution: Systematic Analysis
This skill ensures you capture:
- ✅ **100% of UI sections** (not 95%)
- ✅ **All data queries** (not just main ones)
- ✅ **Every calculation** (including edge cases)
- ✅ **All navigation paths** (including deep links)
- ✅ **Complete interaction set** (not just obvious ones)
- ✅ **All conditional rendering** (every branch)

---

## 🔍 Analysis Depth

### Surface Level ❌ (What Others Do)
```
- Read file quickly
- Note main features
- Miss subtle details
- Forget edge cases
```

### Deep Analysis ✅ (What This Skill Does)
```
- Read EVERY line
- Extract EVERY feature
- Document EVERY section
- Identify EVERY interaction
- Note EVERY calculation
- Map EVERY navigation path
- Find EVERY conditional
- List EVERY TODO/FIXME
```

---

## 📊 Output Example

### Executive Summary
```markdown
# Screen Analysis: EnhancedParentDashboardScreen

**File:** src/screens/parent/EnhancedParentDashboardScreen.tsx
**Lines:** 892
**Complexity:** ⭐⭐⭐⭐ (High)

**Key Stats:**
- Data queries: 7
- UI sections: 12
- User interactions: 23
- Calculations: 9
- Navigation targets: 8

**Critical Findings:**
⚠️ Mock data found in 2 locations
⚠️ Missing error boundary
⚠️ No pagination (performance risk)
✅ Good analytics coverage
✅ Proper TypeScript typing
```

### Feature Inventory
```markdown
## UI Structure (12 Sections)

1. **Header Card**
   - Component: Card (variant="elevated")
   - Welcome message with parent name
   - Date display
   - Notification bell icon (badge: 3)
   - onPress: Navigate to NotificationsScreen

2. **Children Overview**
   - Component: ScrollView (horizontal)
   - Child cards with photo, name, grade
   - Quick stats: Attendance, Average grade
   - onPress: Navigate to ChildDetailScreen

3. **Quick Actions Grid**
   - 4 action buttons (2x2 grid)
   - Academics, Attendance, Messages, Payments
   - Icon + Label
   - onPress: Navigate to respective screens

[... continues for all 12 sections]
```

### Data Fetching Details
```markdown
## Query 1: Parent Profile
**Query Key:** ['parentProfile', parentId]
**Table:** profiles
**Select:** *, children!inner(*)
**Filter:** .eq('id', parentId)
**Cache:** 10 minutes
**Used For:** Header welcome message

## Query 2: Children List
**Query Key:** ['children', parentId]
**Table:** students
**Select:** *, grades(*), attendance_summary(*)
**Joins:** 2 (grades, attendance)
**Filter:** .in('id', childIds)
**Cache:** 5 minutes
**Used For:** Children overview carousel

[... continues for all queries]
```

### Calculations Breakdown
```markdown
## Calculation 1: Overall Attendance Percentage
**Location:** Line 234
**Purpose:** Calculate family-wide attendance average
**Formula:**
```typescript
const overallAttendance = useMemo(() => {
  const totalDays = children.reduce((sum, child) =>
    sum + child.attendance_summary.total_days, 0);
  const presentDays = children.reduce((sum, child) =>
    sum + child.attendance_summary.present_days, 0);
  return totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
}, [children]);
```
**Dependencies:** [children]
**Edge Case:** Returns 0 if totalDays === 0
**Used In:** Stats summary card

[... continues for all calculations]
```

### Recreation Checklist
```markdown
## Must Implement (Critical)
- [ ] All 7 data queries with proper joins
- [ ] All 12 UI sections in exact order
- [ ] All 23 user interactions
- [ ] All 9 calculations with formulas
- [ ] All 8 navigation flows with params
- [ ] Error/loading/empty states
- [ ] Analytics tracking (15 events)

## Should Implement (Important)
- [ ] Fix mock data (replace with real queries)
- [ ] Add error boundary
- [ ] Add pagination for large lists
- [ ] Complete accessibility labels

## Nice to Have (Enhancements)
- [ ] Real-time updates
- [ ] Skeleton loading
- [ ] Optimistic updates
- [ ] Animations
```

---

## 🎓 Use Cases

### Use Case 1: Before Recreation
```
Scenario: Need to recreate EnhancedParentDashboardScreen

Step 1: Analyze
/analyze-screen
Analyze EnhancedParentDashboardScreen.tsx

Step 2: Review Report
- Read feature inventory
- Note all calculations
- Check navigation flows

Step 3: Recreate
/recreate-screen
Create NewParentDashboard with features from analysis report
```

**Result:** 100% feature parity guaranteed

---

### Use Case 2: Enhancement Planning
```
Scenario: Want to enhance existing screen

Step 1: Analyze
/analyze-screen
Analyze BehaviorTrackingScreen.tsx

Step 2: Identify Gaps
- Check TODO comments
- Review FIXME items
- Note missing features

Step 3: Plan Enhancements
Based on analysis, add:
- Real-time updates (noted in TODO)
- Pagination (missing feature)
- Trend charts (enhancement idea)
```

**Result:** Data-driven enhancement roadmap

---

### Use Case 3: Code Review
```
Scenario: Review screen quality before merge

Step 1: Analyze
/analyze-screen
Analyze NewlyCreatedScreen.tsx

Step 2: Quality Check
- Verify all required patterns used
- Check for mock data
- Validate error handling
- Review accessibility

Step 3: Provide Feedback
"Analysis shows:
✅ Good: Proper error handling
⚠️ Issue: Missing analytics tracking
⚠️ Issue: No accessibility labels"
```

**Result:** Comprehensive code review

---

### Use Case 4: Documentation
```
Scenario: Document legacy screen for team

Step 1: Analyze
/analyze-screen
Analyze LegacyPaymentScreen.tsx

Step 2: Generate Docs
Analysis output becomes:
- Feature specification
- Technical documentation
- Maintenance guide

Step 3: Share With Team
Team now has complete documentation of:
- How screen works
- What data it uses
- How to modify it
```

**Result:** Living documentation

---

## 🔗 Integration with Recreation Skill

### Perfect Workflow

```
┌─────────────────────┐
│  Old Screen File    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  /analyze-screen    │  ← Step 1: Analyze
│  (This Skill)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Analysis Report    │
│  Feature Checklist  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  /recreate-screen   │  ← Step 2: Recreate
│  (Recreation Skill) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  New Screen File    │
│  100% Feature Parity│
└─────────────────────┘
```

---

## 📏 Quality Standards

### Completeness Checklist

Analysis is only complete when ALL these are documented:

**Structural:**
- [ ] All imports listed and categorized
- [ ] All TypeScript types extracted
- [ ] All component props documented

**Data:**
- [ ] All queries with keys, filters, joins
- [ ] All calculations with formulas
- [ ] All state variables with initial values

**UI:**
- [ ] All sections listed in render order
- [ ] All components with props
- [ ] All styling patterns

**Behavior:**
- [ ] All user interactions
- [ ] All navigation flows
- [ ] All conditional rendering paths

**Quality:**
- [ ] All error handling noted
- [ ] All analytics tracking listed
- [ ] All TODOs/FIXMEs found

**Issues:**
- [ ] All mock data identified
- [ ] All performance issues noted
- [ ] All accessibility gaps listed

---

## 🎯 Success Metrics

### Before Analysis
- ❌ Vague understanding of screen
- ❌ Might miss 20-30% of features
- ❌ No systematic approach
- ❌ Relying on memory

### After Analysis
- ✅ Complete feature inventory
- ✅ 100% feature capture
- ✅ Systematic documentation
- ✅ Objective checklist

---

## 💡 Pro Tips

### Tip 1: Analyze Before Asking Questions
```
Instead of:
"How does StudentListScreen work?"

Use analysis:
/analyze-screen
Analyze StudentListScreen.tsx

Then you get:
- Complete documentation
- All features listed
- All logic explained
```

### Tip 2: Use for Legacy Code Understanding
```
For unfamiliar code:
/analyze-screen
Analyze UnknownScreen.tsx

Get instant understanding of:
- What it does
- How it works
- What data it uses
```

### Tip 3: Validate Recreations
```
After recreating a screen:

/analyze-screen
Analyze NewScreenImplementation.tsx

Compare with original analysis to verify:
- All features implemented
- No features missed
- Quality maintained
```

### Tip 4: Find Hidden Issues
```
Analysis automatically finds:
⚠️ Mock data usage
⚠️ Missing error handling
⚠️ Performance issues
⚠️ Accessibility gaps
⚠️ TODO/FIXME comments
```

---

## 🚀 Next Steps

### 1. Try It Now
```
/analyze-screen

Analyze any screen from:
- src/screens/parent/EnhancedParentDashboardScreen.tsx
- src/screens/parent/ChildProgressMonitoringScreen.tsx
- src/screens/parent/PerformanceAnalyticsScreen.tsx
```

### 2. Use with Recreation Workflow
```
Step 1: /analyze-screen → Get feature list
Step 2: /recreate-screen → Implement with 100% parity
```

### 3. Document Your Codebase
```
Analyze all screens systematically:
- Create analysis reports for each
- Build comprehensive documentation
- Share with team
```

---

## 📚 Related Skills

- **`/recreate-screen`** - Use AFTER analysis to implement
- **PROJECT_MEMORY.md** - Reference for constraints
- **ACCEPTANCE_CHECKLIST.md** - Quality standards

---

## ✅ Summary

**What:** Systematic screen analysis tool

**Why:** Ensure 100% feature capture before recreation

**How:** `/analyze-screen` + provide file path

**Output:** Comprehensive analysis report with:
- Complete feature inventory
- Recreation checklist
- Issue identification
- Quality assessment

**Result:** Never miss a feature again! 🎯

---

**Created:** October 23, 2025
**Version:** 1.0
**Status:** Production Ready ✅

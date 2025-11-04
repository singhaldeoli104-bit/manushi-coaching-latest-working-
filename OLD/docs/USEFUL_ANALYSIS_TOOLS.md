# Analysis Tools for Screen Recreation ✅

**Prioritized list of helpful tools for our gradual replacement strategy**

Last Updated: October 22, 2025

---

## 🎯 Most Immediately Useful

### 1. **Route Map Generation** ⭐⭐⭐ HIGHEST PRIORITY

**Why we need it:**
- See ALL navigation routes in one place
- Understand which screens navigate where
- Map old routes → new routes
- Spot missing route definitions

**What it shows:**
```json
{
  "path": "src/navigation/ParentNavigator.tsx",
  "kind": "navigator",
  "exports": ["ParentNavigator"],
  "routes": [
    "NewDashboard",
    "Dashboard",
    "ChildProgress",
    "ChildDetail",
    "PaymentHistory",
    // ... all routes
  ]
}
```

**How it helps our task:**
- ✅ Verify all 26 new screens are registered
- ✅ See which old screens are still in use
- ✅ Plan navigation rewiring
- ✅ Ensure no orphaned routes

**Request:** **YES, please generate route map!** 🚀

---

### 2. **Dependency Graph (madge)** ⭐⭐⭐ HIGH PRIORITY

**Why we need it:**
- Find circular dependencies between screens
- See which components are heavily used
- Understand coupling between features
- Spot files that import too many things

**What it shows:**
```bash
# Circular dependencies
✖ Found 3 circular dependencies!

1) src/screens/parent/EnhancedParentDashboardScreen.tsx >
   src/components/common/ChildCard.tsx >
   src/screens/parent/EnhancedParentDashboardScreen.tsx

2) src/hooks/useParentAPI.ts >
   src/services/api/parentApi.ts >
   src/hooks/useParentAPI.ts
```

**How it helps our task:**
- ✅ Break circular deps during refactor
- ✅ Identify shared components to keep
- ✅ Plan component extraction
- ✅ Avoid recreating bad patterns

**Request:** **YES, please run dependency graph!** 🚀

---

### 3. **Acceptance Checklist** ⭐⭐⭐ HIGH PRIORITY

**Why we need it:**
Already perfect for our gradual replacement!

**Our checklist for each screen:**

```markdown
## Screen: NewParentDashboard.tsx

### Data Layer ✅
- [ ] Real Supabase data only (no mock arrays)
- [ ] useQuery/useInfiniteQuery wired
- [ ] Zod schema validation in data layer
- [ ] Query keys using factory pattern

### UI/UX States ✅
- [ ] Loading state (Skeleton or Spinner)
- [ ] Error state (with retry button)
- [ ] Empty state (helpful message + action)
- [ ] Success state (full data display)

### Accessibility ✅
- [ ] Icon-only buttons have accessibilityLabel
- [ ] Tap targets ≥ 48dp
- [ ] Text has good contrast
- [ ] Screen reader friendly

### Performance ✅
- [ ] FlatList uses getItemLayout (if list)
- [ ] Row components memoized
- [ ] Heavy computations memoized
- [ ] No unnecessary re-renders

### Analytics ✅
- [ ] screen_view tracked on mount
- [ ] Key user actions tracked
- [ ] No PII in logs
- [ ] trackAction used consistently

### Navigation ✅
- [ ] Safe navigation (300ms debounce)
- [ ] Params validated with Zod
- [ ] Deep links configured
- [ ] Back button handled correctly

### Code Quality ✅
- [ ] TypeScript errors: 0
- [ ] ESLint warnings: 0
- [ ] Uses BaseScreen wrapper
- [ ] Uses UI utility library (Row, Col, T)

### Testing ✅
- [ ] Happy path render test
- [ ] Hook unit tests
- [ ] Navigation tested
- [ ] Real data integration tested
```

**How it helps our task:**
- ✅ Systematic quality gate for each screen
- ✅ Ensure nothing is forgotten
- ✅ Consistent implementation
- ✅ Production-ready screens

**Request:** **Let's apply this to every screen!** 🚀

---

## 🎯 Moderately Useful

### 4. **Old → New Screen Mapping** ⭐⭐ MEDIUM PRIORITY

**Why we need it:**
Clear mapping of what replaces what

**We can create this manually:**

```markdown
| Old Screen | Size | New Screen(s) | Status |
|------------|------|---------------|---------|
| EnhancedParentDashboardScreen.tsx | 93 KB | NewParentDashboard.tsx (enhanced) | ⏳ In Progress |
| ChildProgressMonitoringScreen.tsx | 59 KB | ChildDetailScreen.tsx | ⏳ Planned |
| PerformanceAnalyticsScreen.tsx | 35 KB | SubjectDetailScreen.tsx + NewParentDashboard (analytics section) | ⏳ Planned |
| AcademicScheduleScreen.tsx | 43 KB | UpcomingExamsScreen.tsx + SchoolCalendarScreen.tsx | ⏳ Planned |
| TeacherCommunicationScreen.tsx | 41 KB | ComposeMessageScreen.tsx + TeacherListScreen.tsx | ⏳ Planned |
| CommunityEngagementScreen.tsx | 53 KB | AnnouncementsScreen.tsx + community features | ⏳ Planned |
| BillingInvoiceScreen.tsx | 45 KB | PaymentHistoryScreen.tsx + FeeStructureScreen.tsx | ⏳ Planned |
| PaymentProcessingScreen.tsx | 34 KB | MakePaymentScreen.tsx | ⏳ Planned |
| InformationHubScreen.tsx | 46 KB | SchoolHandbookScreen.tsx + StaffDirectoryScreen.tsx + SchoolPoliciesScreen.tsx | ⏳ Planned |
```

**How it helps our task:**
- ✅ Track replacement progress
- ✅ Know which old screens can be deleted
- ✅ Ensure feature parity

**Request:** I'll create this document

---

### 5. **Component Props Documentation** ⭐ LOW PRIORITY

**Why it's lower priority:**
- We're recreating screens, not just refactoring
- Props will be redesigned with new patterns
- More useful AFTER we have new components

**Still useful for:**
- Understanding old component APIs
- Spotting dead props to not recreate
- Documenting new component props

**Request:** Maybe later, after we have new components

---

## 🚫 Not Needed Right Now

### 6. **Codemods (jscodeshift)**

**Why skip for now:**
- We're manually recreating, not mass-refactoring
- Different patterns mean imports will change anyway
- More useful for large-scale automated refactors

**Request:** Skip for now

---

### 7. **Feature Grouping Proposal**

**Why skip for now:**
- Our structure is already decided (gradual replacement)
- Not moving to feature-based folders yet
- Would complicate the gradual approach

**Request:** Skip for now

---

## 🎯 Immediate Action Plan

### Step 1: Generate Route Map ✅ REQUESTED

**Request:** **Please generate route map!**

This will give us:
- Complete list of all routes
- Where each route is defined
- Which navigators exist
- Exported components per file

**Use case:**
```bash
# After you generate route-map.json
cat route-map.json | jq '.[] | select(.kind == "navigator")'
# Shows all navigators

cat route-map.json | jq '.[] | select(.kind == "screen") | .path'
# Shows all screen files

cat route-map.json | jq '.[] | select(.routes | length > 0)'
# Shows which files define routes
```

---

### Step 2: Run Dependency Graph ✅ REQUESTED

**Request:** **Please run madge dependency analysis!**

Command you'd run:
```bash
cd C:/PC/OLD
npx madge src --ts-config ./tsconfig.json --circular
npx madge src --ts-config ./tsconfig.json --image graph.svg
```

**What to look for:**
- Circular dependencies to break
- Heavily imported files (keep these working)
- Isolated files (safe to replace first)

---

### Step 3: Apply Acceptance Checklist ✅

**I'll do this:**
Create acceptance checklist document for each screen replacement

**Checklist applied to:**
1. NewParentDashboard (Week 1)
2. ChildDetailScreen (Week 2)
3. All 4 Financial screens (Week 3)
4. All 6 Academic screens (Week 4)
5. All 5 Communication screens (Week 5)
6. All 5 Info screens (Week 6)

---

### Step 4: Create Screen Mapping Document ✅

**I'll do this:**
Create detailed old→new mapping with:
- Which old screen(s) replace which new screen(s)
- Feature breakdown
- Data requirements
- Implementation checklist

---

## 📊 How These Tools Help Our Strategy

### Before (Without Tools):
- ❓ Guess which screens are used
- ❓ Hope we didn't miss routes
- ❓ Manually trace dependencies
- ❓ Inconsistent quality

### After (With Tools):
- ✅ Know exactly which routes exist
- ✅ See all navigation clearly
- ✅ Understand dependencies
- ✅ Consistent quality checklist
- ✅ Systematic replacement

---

## 🎯 Summary - What We Need

### YES - Generate These! ⭐⭐⭐

1. **Route Map** (ts-morph scan)
   - Shows all routes, navigators, screens
   - JSON output we can query

2. **Dependency Graph** (madge)
   - Shows circular deps
   - Shows coupling
   - Visual graph (graph.svg)

3. **Acceptance Checklist** (template)
   - Apply to each screen
   - Ensure quality

### I'll Create These 📝

4. **Old → New Screen Mapping**
   - Manual mapping document
   - Track replacement progress

5. **Screen-by-Screen Analysis**
   - What each old screen does
   - What new screen(s) replace it
   - Data requirements

### Skip for Now 🚫

6. Codemods - Not needed for manual recreation
7. Feature grouping - Not changing structure yet
8. Props documentation - Will create new props

---

## ✅ Next Steps

**Immediate:**
1. **You generate:** Route map + Dependency graph
2. **I create:** Screen mapping + Acceptance checklist documents
3. **We start:** NewParentDashboard enhancement with quality checklist

**After tools are ready:**
- Review route map → understand all navigation
- Review dependency graph → spot issues to avoid
- Apply acceptance checklist → ensure quality
- Start implementing with confidence!

---

**Ready for:** Route map generation + Dependency analysis! 🚀

**Most valuable for us:** These will give us the complete picture before we start recreating screens systematically.

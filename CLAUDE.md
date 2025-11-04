# Project Instructions for Claude Code

## 🚫 CRITICAL CONSTRAINT
**NO PACKAGE MODIFICATIONS ALLOWED** - Our working directory is `C:\PC\OLD\`. No package updates or modifications are permitted.

```bash
# ❌ FORBIDDEN
npm install, npm update, npm uninstall, yarn add, yarn upgrade

# ✅ ONLY USE EXISTING PACKAGES
React Navigation, TanStack Query, Supabase, Zod, AsyncStorage (already installed)
```

---

## 📚 REQUIRED READING - Always Reference These Files

### 1. PROJECT_MEMORY.md ⭐ START HERE FIRST
**Location:** `OLD/PROJECT_MEMORY.md`

**Contains:**
- Critical constraints (NO package modifications, NO mock data)
- Project strategy (gradual replacement approach)
- All essential documentation references
- Quick decision tree for common scenarios
- Current status and next steps
- Key patterns to follow

**When:** Read at the start of EVERY session to maintain context.

---

### 2. FEATURES_ADDED.md
**Location:** `OLD/FEATURES_ADDED.md`

**Purpose:** Complete inventory of all features and functions added (600+ lines)

**Contains:**
- 7 navigation enhancements (safe navigation, analytics, deep linking, etc.)
- 26 placeholder screens created
- Type definitions and validation
- Backup system details
- Integration points

**When to reference:** "What features exist?" or "What was already implemented?"

---

### 3. USAGE_GUIDE.md
**Location:** `OLD/USAGE_GUIDE.md`

**Purpose:** Practical guide with code examples for all features (900+ lines)

**Contains:**
- How to use safe navigation (safeNavigate)
- How to use hardware back button guard (useBlockBack)
- How to track analytics (trackAction, trackScreenView)
- How to generate deep links (generateDeepLink)
- How to validate navigation params (safeNavigateWithValidation)
- How to create new screens (step-by-step template)
- How to apply acceptance checklist
- Best practices and code examples

**When to reference:** "How do I use [feature]?" or "Show me an example"

---

### 4. ERRORS_AND_SOLUTIONS.md
**Location:** `OLD/ERRORS_AND_SOLUTIONS.md`

**Purpose:** Common errors and their solutions (1000+ lines)

**Contains:**
- Navigation errors with fixes
- TypeScript errors with solutions
- Validation errors
- Deep linking errors
- Data fetching errors (RLS, mock data, etc.)
- Performance issues
- Build/compilation errors
- Runtime errors
- Common mistakes to avoid
- Troubleshooting checklist

**When to reference:** User reports an error or something isn't working

---

### 5. ACCEPTANCE_CHECKLIST.md
**Location:** `OLD/ACCEPTANCE_CHECKLIST.md`

**Purpose:** Quality gate for every screen implementation

**Apply before marking any screen "complete":**
- [ ] Real Supabase data (no mock arrays)
- [ ] BaseScreen wrapper with all states
- [ ] All icon buttons have accessibilityLabel
- [ ] FlatList optimized (if list screen)
- [ ] Components memoized
- [ ] Analytics events tracked
- [ ] Safe navigation used
- [ ] TypeScript errors: 0
- [ ] ESLint warnings: 0
- [ ] Tested on real device
- [ ] No console errors

---

### 6. GRADUAL_REPLACEMENT_CONFIRMED.md
**Location:** `OLD/GRADUAL_REPLACEMENT_CONFIRMED.md`

**Purpose:** Project strategy - keep old screens working while building new ones

**Why:** Prevents breaking the app, allows incremental testing, safe rollback

---

## ⚠️ ABSOLUTE RULES - NEVER BREAK

### 1. NO Package Modifications ❌
```bash
# ❌ NEVER: npm install, npm update, yarn add
# ✅ ONLY: Use existing packages
```

### 2. NO Mock Data ❌
```typescript
// ❌ FORBIDDEN
const children = [{ id: '1', name: 'Test' }];

// ✅ REQUIRED - Real Supabase queries
const { data: children } = useQuery({
  queryKey: parentQueries.children(parentId),
  queryFn: fetchFromSupabase
});
```

### 3. ALWAYS Use BaseScreen Wrapper ✅
```typescript
// ✅ REQUIRED
<BaseScreen scrollable loading={isLoading} error={error} empty={!data}>
  <Content />
</BaseScreen>
```

### 4. ALWAYS Use Safe Navigation ✅
```typescript
// ✅ REQUIRED
import { safeNavigate } from '../../utils/navigationService';
safeNavigate('ChildDetail', { childId });
```

### 5. ALWAYS Track Analytics ✅
```typescript
// ✅ REQUIRED - Track before navigate
trackAction('view_child', 'Dashboard', { childId });
safeNavigate('ChildDetail', { childId });
```

### 6. ALWAYS Apply Acceptance Checklist ✅
**Before marking screen complete:** Check all items in ACCEPTANCE_CHECKLIST.md

---

## 🎯 Workflow for Every Session

**Step 1:** Read `PROJECT_MEMORY.md` to restore full context

**Step 2:** Reference documentation as needed:
- `FEATURES_ADDED.md` - What exists
- `USAGE_GUIDE.md` - How to use
- `ERRORS_AND_SOLUTIONS.md` - Troubleshooting
- `ACCEPTANCE_CHECKLIST.md` - Quality gate
- `GRADUAL_REPLACEMENT_CONFIRMED.md` - Strategy

**Step 3:** Follow the rules:
- ❌ NO package modifications
- ❌ NO mock data
- ✅ Real Supabase data only
- ✅ Apply acceptance checklist

**Step 4:** Implement with quality:
- Use BaseScreen wrapper
- Use safe navigation (safeNavigate)
- Track analytics (trackAction)
- Validate params (safeNavigateWithValidation)
- Memoize components (React.memo)

---

## 📁 Working Directory Structure

```
C:\PC\OLD\
├── src/
│   ├── screens/parent/ (36 files)
│   │   ├── OLD SCREENS (9 files) - Keep working during gradual replacement
│   │   ├── NewParentDashboard.tsx - Modern dashboard (enhanced)
│   │   └── NEW PLACEHOLDER SCREENS (26 files) - To be implemented
│   ├── utils/
│   │   ├── navigationService.ts - Safe navigation
│   │   ├── navigationAnalytics.ts - Analytics tracking
│   │   └── navigationPersistence.ts - State persistence
│   ├── hooks/
│   │   └── useBlockBack.ts - Back button guard
│   ├── config/
│   │   └── deepLinking.ts - Deep link config
│   └── shared/validation/
│       └── navigationSchemas.ts - Param validation
├── backup/screens/ (136 files) - Complete backup for reference
└── OLD/
    ├── PROJECT_MEMORY.md ⭐ START HERE
    ├── FEATURES_ADDED.md
    ├── USAGE_GUIDE.md
    ├── ERRORS_AND_SOLUTIONS.md
    ├── ACCEPTANCE_CHECKLIST.md
    ├── GRADUAL_REPLACEMENT_CONFIRMED.md
    └── ... (13 total documentation files)
```

---

## 🚀 Current Phase

**Phase 0 (Week 1):** Enhance NewParentDashboard
- Add Welcome Section
- Add Children Progress Cards
- Add Action Items Section
- Add Recent Communications Section

**Using:** Real Supabase data, modern patterns, acceptance checklist

---

**Remember:** Always start by reading PROJECT_MEMORY.md to restore full context! 🧠
# Project Memory & Instructions 🧠

**Critical project context and constraints for all future sessions**

Last Updated: October 22, 2025

---

## 🚫 CRITICAL CONSTRAINTS

### ❌ NO PACKAGE MODIFICATIONS ALLOWED

**ABSOLUTE RULE:** No package.json modifications or changes are permitted.

```bash
# ❌ NEVER DO THESE:
npm install <anything>
npm update
npm uninstall
yarn add
yarn upgrade

# ✅ ONLY USE EXISTING PACKAGES:
- React Navigation (already installed)
- TanStack Query (already installed)
- Supabase (already installed)
- Zod (already installed)
- AsyncStorage (already installed)
```

**Reason:** Working directory is `C:\PC\OLD\` - production environment with locked dependencies.

**If new functionality needed:** Use existing packages creatively, don't add new ones.

---

## 📚 Essential Documentation Files

### 1. FEATURES_ADDED.md
**Purpose:** Complete inventory of all features and functions added

**Contains:**
- 7 navigation enhancements (safe navigation, analytics, deep linking, state persistence, param validation, back button guard, tab optimizations)
- 26 placeholder screens created
- Navigation type definitions
- Backup system (136 files backed up)
- 13 documentation files
- App.tsx and ParentNavigator.tsx integrations
- Complete statistics

**When to reference:**
- "What features do we have?"
- "What was already implemented?"
- "What functions are available?"

---

### 2. USAGE_GUIDE.md
**Purpose:** Practical guide with code examples for all features

**Contains:**
- How to use safe navigation (safeNavigate)
- How to use hardware back button guard (useBlockBack)
- How to track analytics (trackAction, trackScreenView, trackEvent)
- How to generate deep links (generateDeepLink)
- How to validate navigation params (safeNavigateWithValidation)
- How to create new screens (step-by-step template)
- How to apply acceptance checklist
- Best practices for all features
- Quick reference cheat sheet

**When to reference:**
- "How do I use [feature]?"
- "What's the correct way to do [task]?"
- "Can you show me an example?"

---

### 3. ERRORS_AND_SOLUTIONS.md
**Purpose:** Common errors and their solutions

**Contains:**
- Navigation errors (screen not found, double-tap, nested params, etc.)
- TypeScript errors (type mismatches, missing params, etc.)
- Validation errors (invalid UUIDs, missing fields, etc.)
- Deep linking errors (not opening, wrong screen, invalid params)
- Data fetching errors (RLS, mock data, query keys, Zod validation)
- Performance issues (slow renders, janky scrolling, tab switching)
- Build/compilation errors (Metro bundler, duplicates, module resolution)
- Runtime errors (undefined props, conditional hooks, unmounted updates)
- Common mistakes to avoid
- Troubleshooting checklist

**When to reference:**
- User reports an error
- Something isn't working
- Need to troubleshoot an issue

---

### 4. 🔍 SCREEN ANALYSIS SKILL (NEW!)
**Purpose:** Systematic analysis of existing screens to capture 100% of features

**Location:** `/analyze-screen` command

**What it does:**
- Reads ENTIRE file (every single line)
- Extracts ALL imports, types, state, queries, calculations
- Documents ALL UI sections in render order
- Lists ALL user interactions and navigation flows
- Identifies ALL conditional rendering paths
- Finds ALL TODOs, FIXMEs, issues
- Creates comprehensive feature checklist
- Provides recreation recommendations

**When to use:**
- BEFORE recreating any screen (100% feature parity)
- Understanding legacy/unfamiliar code
- Code review and quality assessment
- Creating documentation

**How to use:**
```
/analyze-screen

Analyze EnhancedParentDashboardScreen.tsx
```

**Documentation:** `SCREEN_ANALYSIS_SKILL_GUIDE.md`

---

### 5. 🤖 SCREEN RECREATION SKILL (NEW!)
**Purpose:** Automated screen creation following all project patterns

**Location:** `/recreate-screen` command

**What it does:**
- Reads all project documentation automatically
- Enforces all best practices (no mock data, BaseScreen, safe navigation, etc.)
- Creates database migrations if needed
- Implements screens with full TypeScript types
- Adds realistic sample data
- Applies acceptance checklist
- Prevents all known errors (toFixed crashes, RLS issues, etc.)

**When to use:**
- Creating any new screen
- Need guaranteed quality implementation
- Want to follow all established patterns
- Avoid repeating past mistakes

**How to use:**
```
/recreate-screen

I need to create a MessagesListScreen showing parent-teacher messages
```

**Documentation:** `SCREEN_RECREATION_SKILL_GUIDE.md`

**💡 Perfect Workflow:**
```
Step 1: /analyze-screen → Analyze old screen (100% feature capture)
Step 2: /recreate-screen → Recreate with analysis report (100% parity)
```

---

## 🎯 Project Strategy: Gradual Replacement

### Current Approach
**Keep old screens working + Build new screens alongside**

```
src/screens/parent/ (36 files)
├── OLD SCREENS (9 files) - Keep working during gradual replacement
│   ├── EnhancedParentDashboardScreen.tsx ✅ Working
│   ├── ChildProgressMonitoringScreen.tsx ✅ Working
│   ├── PerformanceAnalyticsScreen.tsx ✅ Working
│   ├── AcademicScheduleScreen.tsx ✅ Working
│   ├── TeacherCommunicationScreen.tsx ✅ Working
│   ├── CommunityEngagementScreen.tsx ✅ Working
│   ├── BillingInvoiceScreen.tsx ✅ Working
│   ├── PaymentProcessingScreen.tsx ✅ Working
│   └── InformationHubScreen.tsx ✅ Working
│
├── NEW DASHBOARD (1 file) - Enhanced with modern patterns
│   └── NewParentDashboard.tsx ✅ Working (20 KB)
│
└── NEW PLACEHOLDER SCREENS (26 files) - To be implemented
    ├── ChildDetailScreen.tsx (placeholder)
    ├── ChildrenListScreen.tsx (placeholder)
    └── ... (24 more screens)

backup/screens/ (136 files)
└── Complete backup for reference ✅
```

### Why Gradual Replacement?

**✅ Benefits:**
- App always compiles and works
- Users can use app during development
- Incremental testing (test each screen as built)
- Safe rollback (old screens still work if needed)
- Flexible timeline (no pressure to finish all at once)
- Learn and improve patterns as we go

**❌ NOT using "clean slate":**
- Would cause 1000+ TypeScript errors
- Would break app completely
- Would require all screens done before app works

---

## 🎯 Implementation Phases

### Phase 0: Enhance NewParentDashboard (Week 1) ⏳ NEXT
**Analyze:** EnhancedParentDashboardScreen.tsx (Overview tab)
**Enhance:** NewParentDashboard.tsx

**Add 4 Sections:**
1. Welcome Section (parent name from Supabase)
2. Children Progress Cards (real data from students table)
3. Action Items (real data from action_items table)
4. Recent Communications (real data from communications table)

### Phase 1: Child Detail Screen (Week 2)
**Implement:** ChildDetailScreen.tsx
**Replace:** ChildProgressMonitoringScreen.tsx

### Phase 2: Financial Screens (Week 3)
**Implement:** PaymentHistoryScreen, MakePaymentScreen, DiscountsScreen, FeeStructureScreen
**Replace:** BillingInvoiceScreen, PaymentProcessingScreen

### Phase 3: Academic Screens (Week 4)
**Implement:** SubjectDetailScreen, AssignmentsListScreen, AssignmentDetailScreen, UpcomingExamsScreen, AcademicReportsScreen, StudyRecommendationsScreen
**Replace:** PerformanceAnalyticsScreen, AcademicScheduleScreen

### Phase 4: Communication Screens (Week 5)
**Implement:** ComposeMessageScreen, ScheduleMeetingScreen, TeacherListScreen, MeetingsHistoryScreen, NotificationsScreen
**Replace:** TeacherCommunicationScreen, CommunityEngagementScreen

### Phase 5: Info Screens (Week 6)
**Implement:** SchoolCalendarScreen, SchoolHandbookScreen, StaffDirectoryScreen, SchoolPoliciesScreen, AnnouncementsScreen
**Replace:** InformationHubScreen

---

## ⚠️ Critical Rules - NEVER BREAK THESE

### 1. NO Mock Data ❌
```typescript
// ❌ FORBIDDEN - Mock data
const children = [
  { id: '1', name: 'Test Child', grade: 85 }
];

// ✅ REQUIRED - Real Supabase data
const { data: children } = useQuery({
  queryKey: parentQueries.children(parentId),
  queryFn: async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('parent_id', parentId);
    if (error) throw error;
    return data;
  },
});
```

### 2. NO Package Modifications ❌
```bash
# ❌ FORBIDDEN
npm install axios
npm update react-navigation
yarn add moment

# ✅ REQUIRED - Use existing packages only
# Already available:
# - React Navigation
# - TanStack Query
# - Supabase
# - Zod
# - AsyncStorage
```

### 3. ALWAYS Use BaseScreen Wrapper ✅
```typescript
// ❌ FORBIDDEN - Manual state handling
if (isLoading) return <ActivityIndicator />;
if (error) return <Text>Error</Text>;

// ✅ REQUIRED - BaseScreen wrapper
<BaseScreen scrollable loading={isLoading} error={error} empty={!data}>
  <Content />
</BaseScreen>
```

### 4. ALWAYS Use Safe Navigation ✅
```typescript
// ❌ FORBIDDEN - Direct navigation
navigation.navigate('ChildDetail', { childId });

// ✅ REQUIRED - Safe navigation with debounce
safeNavigate('ChildDetail', { childId });
```

### 5. ALWAYS Track Analytics ✅
```typescript
// ❌ FORBIDDEN - Navigation without tracking
safeNavigate('ChildDetail', { childId });

// ✅ REQUIRED - Track before navigate
trackAction('view_child_detail', 'Dashboard', { childId });
safeNavigate('ChildDetail', { childId });
```

### 6. ALWAYS Apply Acceptance Checklist ✅
**Before marking any screen "complete":**
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

## 🛠️ Available Features (Use These!)

### Navigation Features
```typescript
// 1. Safe Navigation (300ms debounce)
import { safeNavigate } from '../../utils/navigationService';
safeNavigate('ChildDetail', { childId });

// 2. Hardware Back Button Guard
import { useBlockBack } from '../../hooks/useBlockBack';
useBlockBack(hasUnsavedChanges, 'Discard changes?');

// 3. Analytics Tracking
import { trackAction, trackEvent, trackScreenView } from '../../utils/navigationAnalytics';
trackAction('view_child', 'Dashboard', { childId });

// 4. Deep Linking
import { generateDeepLink } from '../../config/deepLinking';
const url = generateDeepLink('ChildProgress', { childId });

// 5. Navigation State Persistence (automatic in App.tsx)

// 6. Parameter Validation
import { safeNavigateWithValidation, ChildDetailParamsSchema } from '../../shared/validation/navigationSchemas';
safeNavigateWithValidation(navigation, 'ChildDetail', ChildDetailParamsSchema, params);

// 7. Tab Performance Optimizations (automatic in ParentNavigator.tsx)
```

### Data Fetching Features
```typescript
// 1. Query Keys Factory
import { parentQueries } from '../../services/api/queryKeys';
queryKey: parentQueries.children(parentId)

// 2. TanStack Query
import { useQuery, useMutation } from '@tanstack/react-query';

// 3. Supabase Client
import { supabase } from '../../services/supabase';

// 4. Zod Validation
import { z } from 'zod';
const ChildSchema = z.object({ id: z.string().uuid() });
```

### UI Components
```typescript
// 1. BaseScreen Wrapper
import { BaseScreen } from '../../shared/components/BaseScreen';

// 2. UI Utility Library
import { Row, Col, T, Button, Spacer, Badge, ListItem, EmptyState } from '../../ui';

// 3. sx() Styling
<Col sx={{ p: 'xl', bg: 'surface', gap: 'md' }}>
```

---

## 📁 File Locations

### Navigation Files
```
src/utils/navigationService.ts          - Safe navigation
src/hooks/useBlockBack.ts               - Back button guard
src/utils/navigationAnalytics.ts        - Analytics tracking
src/config/deepLinking.ts               - Deep link config
src/utils/navigationPersistence.ts      - State persistence
src/shared/validation/navigationSchemas.ts - Param validation
```

### Screen Files
```
src/screens/parent/NewParentDashboard.tsx - Modern dashboard (enhanced)
src/screens/parent/ChildDetailScreen.tsx  - Placeholder (to implement)
... (26 total placeholder screens)

src/screens/parent/EnhancedParentDashboardScreen.tsx - Old dashboard (keep for now)
... (9 total old screens - keep until replaced)

backup/screens/ - Complete backup (136 files)
```

### Documentation Files
```
OLD/FEATURES_ADDED.md           - What features exist
OLD/USAGE_GUIDE.md              - How to use features
OLD/ERRORS_AND_SOLUTIONS.md     - Error solutions
OLD/ACCEPTANCE_CHECKLIST.md     - Quality checklist
OLD/GRADUAL_REPLACEMENT_CONFIRMED.md - Strategy doc
OLD/PROJECT_MEMORY.md           - This file
... (13 total documentation files)
```

### Type Definitions
```
src/types/navigation.ts         - ParentStackParamList with all 26+ screens
```

### Navigator Files
```
src/navigation/AppNavigator.tsx    - Root navigator (custom state)
src/navigation/ParentNavigator.tsx - Parent tab navigator (React Navigation)
```

---

## 🎯 Quick Decision Tree

### "User asks to add a feature that needs a new package"
→ **Answer:** "No package modifications allowed. Let me implement this using existing packages: React Navigation, TanStack Query, Supabase, Zod, AsyncStorage."

### "User asks to create a new screen"
→ **Follow:**
1. Check USAGE_GUIDE.md section 7 (Creating New Screens)
2. Use placeholder template
3. Add to navigation types
4. Create validation schema
5. Register in ParentNavigator
6. Apply ACCEPTANCE_CHECKLIST.md

### "User reports an error"
→ **Check:**
1. ERRORS_AND_SOLUTIONS.md for exact error
2. Apply solution from documentation
3. If new error, document it for future

### "User asks how to use a feature"
→ **Reference:**
1. USAGE_GUIDE.md for code examples
2. FEATURES_ADDED.md for feature details
3. Provide working code snippet

### "Should we use mock data?"
→ **Answer:** "No. Absolutely forbidden. Use real Supabase queries with useQuery. See USAGE_GUIDE.md section 9 for data fetching best practices."

### "Can we delete old screens?"
→ **Answer:** "Not yet. We're using gradual replacement. Old screens stay until new versions are complete and tested. See GRADUAL_REPLACEMENT_CONFIRMED.md."

### "User asks to update packages"
→ **Answer:** "No package modifications allowed. Working directory is C:\PC\OLD\ with locked dependencies."

---

## 📊 Current Status

### Completed ✅
- [x] 7 navigation enhancement features
- [x] 26 placeholder screen files created
- [x] All screens registered in ParentNavigator.tsx
- [x] Navigation type definitions updated
- [x] Validation schemas created
- [x] App.tsx integration complete
- [x] NewParentDashboard.tsx enhanced with navigation
- [x] Complete backup system (136 files)
- [x] 13 documentation files created

### In Progress ⏳
- [ ] Enhance NewParentDashboard with 4 sections (Week 1)
  - [ ] Welcome Section
  - [ ] Children Progress Cards
  - [ ] Action Items Section
  - [ ] Recent Communications Section

### Planned 📋
- [ ] Week 2: Implement ChildDetailScreen
- [ ] Week 3: Implement 4 Financial screens
- [ ] Week 4: Implement 6 Academic screens
- [ ] Week 5: Implement 5 Communication screens
- [ ] Week 6: Implement 5 Info screens

---

## 🔑 Key Patterns to Follow

### Screen Template
```typescript
import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Col, T, Button, Spacer } from '../../ui';
import { trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';
import type { ParentStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ParentStackParamList, 'ScreenName'>;

const ScreenNameScreen: React.FC<Props> = ({ route, navigation }) => {
  React.useEffect(() => {
    trackAction('view_screen_name', 'ScreenName');
  }, []);

  const params = route.params;

  return (
    <BaseScreen scrollable loading={false} error={null} empty={false}>
      <Col sx={{ p: 'xl' }}>
        <T variant="headline" weight="bold">Screen Title</T>
        <Spacer size="md" />
        <Button variant="primary" onPress={() => safeNavigate('OtherScreen')}>
          Action
        </Button>
      </Col>
    </BaseScreen>
  );
};

export default ScreenNameScreen;
```

### Data Fetching Pattern
```typescript
import { useQuery } from '@tanstack/react-query';
import { parentQueries } from '../../services/api/queryKeys';
import { supabase } from '../../services/supabase';
import { ChildrenSchema } from '../../shared/validation/schemas';

const { data, isLoading, error } = useQuery({
  queryKey: parentQueries.children(parentId),
  queryFn: async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('parent_id', parentId);

    if (error) throw error;
    return ChildrenSchema.parse(data);
  },
});
```

### Navigation Pattern
```typescript
import { trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';

const handleViewChild = (childId: string) => {
  trackAction('view_child_detail', 'ChildrenList', { childId });
  safeNavigate('ChildDetail', { childId });
};
```

---

## 📖 Always Remember

1. **Read documentation first** - FEATURES_ADDED.md, USAGE_GUIDE.md, ERRORS_AND_SOLUTIONS.md
2. **No package modifications** - Use existing packages only
3. **No mock data** - Real Supabase queries only
4. **Apply acceptance checklist** - Before marking screen complete
5. **Track analytics** - Every user action
6. **Use safe navigation** - Prevent double-tap crashes
7. **Validate params** - Especially from external sources
8. **Memoize components** - For performance
9. **Follow gradual replacement** - Don't delete old screens prematurely
10. **Test on device** - Before marking complete

---

## 🚀 Ready to Code

**Current Working Directory:** `C:\PC\OLD\`

**Next Immediate Task:** Enhance NewParentDashboard with 4 sections from EnhancedParentDashboardScreen Overview tab

**Documentation References:**
- Read: `FEATURES_ADDED.md` - Know what's available
- Read: `USAGE_GUIDE.md` - Learn how to use features
- Read: `ERRORS_AND_SOLUTIONS.md` - Troubleshoot issues
- Apply: `ACCEPTANCE_CHECKLIST.md` - Quality gate

**Constraints:**
- ❌ NO package.json modifications
- ❌ NO mock data
- ✅ Real Supabase data only
- ✅ Apply acceptance checklist
- ✅ Follow gradual replacement strategy

---

**This memory file should be referenced at the start of every session to maintain context and constraints! 🧠**

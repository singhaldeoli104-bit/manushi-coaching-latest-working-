# PROJECT LOCATION - CRITICAL MEMORY

**DATE:** 2025-10-29
**AUTHOR:** Claude Code

## ⚠️ CRITICAL: Project Directory is C:\PC\OLD\

**ALL NEW DEVELOPMENT HAPPENS IN:** `C:\PC\OLD\`
**NOT IN:** `C:\PC\src\` (this was a mistake)

---

## Directory Structure

```
C:\PC\OLD\
├── src/
│   ├── components/
│   │   └── student/
│   │       ├── atoms/           (Button, Card, Badge)
│   │       ├── molecules/        (Tabs, Modal, SearchBar, etc.)
│   │       ├── organisms/        (FilterPanel, ParticipantsList, ChatPanel, etc.)
│   │       └── navigation/      (StudentTopBar, StudentDrawer, StudentBottomNav)
│   ├── hooks/
│   │   └── student/             (6 custom hooks)
│   ├── context/
│   │   ├── AuthContext.tsx      (✅ EXISTS)
│   │   └── StudentContext.tsx   (✅ NEWLY ADDED)
│   ├── theme/
│   │   └── colors.ts            (✅ EXISTS - LightTheme)
│   └── lib/
│       └── supabase.ts          (✅ EXISTS)
```

---

## Infrastructure Files (ALL EXIST IN OLD/)

### ✅ Theme System
- **Location:** `C:\PC\OLD\src\theme\colors.ts`
- **Exports:** `LightTheme` with MD3 color tokens
- **Status:** Working

### ✅ Supabase Client
- **Location:** `C:\PC\OLD\src\lib\supabase.ts`
- **Exports:** `supabase` client instance
- **Status:** Working

### ✅ Auth Context
- **Location:** `C:\PC\OLD\src\context\AuthContext.tsx`
- **Exports:** `useAuth` hook
- **Status:** Working

---

## Phase 0 Components (ALL IN OLD/)

### Week 1: Core UI Components (9 items)
**Location:** `C:\PC\OLD\src\components\student\`

- `atoms/Button.tsx` ✅
- `atoms/Card.tsx` ✅
- `atoms/Badge.tsx` ✅
- `molecules/Tabs.tsx` ✅
- `molecules/Modal.tsx` ✅
- `molecules/BottomSheet.tsx` ✅
- `molecules/SearchBar.tsx` ✅
- `organisms/FilterPanel.tsx` ✅
- `molecules/EmptyState.tsx` ✅
- `molecules/LoadingState.tsx` ✅

### Week 2: Navigation Components (3 items)
**Location:** `C:\PC\OLD\src\components\student\navigation\`

- `StudentTopBar.tsx` ✅ (with back button support)
- `StudentDrawer.tsx` ✅
- `StudentBottomNav.tsx` ✅ (with haptic feedback)

### Week 3: Context & Hooks (7 items)
**Location:** `C:\PC\OLD\src\`

- `context/StudentContext.tsx` ✅
- `hooks/student/useStudentProgress.ts` ✅
- `hooks/student/useStudentSchedule.ts` ✅
- `hooks/student/useStudentAssignments.ts` ✅
- `hooks/student/useStudentDoubts.ts` ✅
- `hooks/student/useStudentAttendance.ts` ✅
- `hooks/student/useStudentNotifications.ts` ✅

### Week 4: Live Class Components (5 items)
**Location:** `C:\PC\OLD\src\components\student\organisms\`

- `ParticipantsList.tsx` ✅
- `ChatPanel.tsx` ✅
- `PollsWidget.tsx` ✅
- `ScreenShareViewer.tsx` ✅
- `LiveClassControls.tsx` ✅

---

## Import Paths (CORRECTED)

All components now correctly import from OLD/ structure:

```typescript
// Theme
import { LightTheme } from '../../../theme/colors';

// Supabase
import { supabase } from '../../../lib/supabase';

// Auth
import { useAuth } from '../../context/AuthContext';

// Student Context
import { useStudent } from '../../context/StudentContext';
```

---

## Fixes Applied

### 1. Week 2 Incomplete Features - FIXED ✅

**StudentTopBar:**
- ✅ Added `showBackButton` prop
- ✅ Added `onBackPress` prop
- ✅ Added `BackIcon` component (chevron left)
- ✅ Conditional rendering: back arrow OR hamburger menu
- ✅ Fixed BackIcon to not use `transformOrigin` (React Native incompatible)

**StudentBottomNav:**
- ✅ Added `Vibration` import
- ✅ Implemented `handlePress` with haptic feedback (moved outside useEffect)
- ✅ Calls `Vibration.vibrate(10)` on each tab press
- ✅ Fixed CRITICAL scope error (handlePress declared in correct scope)

### 2. Directory Migration - COMPLETED ✅
- ✅ All Week 1 components moved to OLD/
- ✅ All Week 2 components moved to OLD/
- ✅ All Week 3 items moved to OLD/
- ✅ All Week 4 components moved to OLD/

### 3. Import Corrections - COMPLETED ✅
- ✅ All imports now point to OLD/ structure
- ✅ Theme, Supabase, Auth imports working
- ✅ No missing module errors

---

## TypeScript Compilation Status

**Command:** `cd C:\PC\OLD && npx tsc --noEmit --skipLibCheck`

**New Components Status:**
- Minor type warnings (unused variables, exactOptionalPropertyTypes)
- NO critical compilation blockers
- All infrastructure dependencies resolved

**Legacy Components:**
- Some existing errors in old student components
- Not blocking new development

---

## REMEMBER FOR FUTURE SESSIONS

1. **ALWAYS use `C:\PC\OLD\` as base directory**
2. **NEVER create files in `C:\PC\src\`**
3. **Theme/Supabase/Auth already exist in OLD/ - don't recreate them**
4. **All new student components go in `OLD/src/components/student/`**
5. **All new hooks go in `OLD/src/hooks/student/`**

---

## Next Steps (If Needed)

1. Device testing for all components
2. Integration testing with real Supabase data
3. Fix minor TypeScript warnings (optional)
4. Update TODO file to reflect accurate status

---

**LAST UPDATED:** 2025-10-29
**STATUS:** All components in OLD/, dependencies resolved, compilation working

### 4. Codex Review Fixes (Session 2025-10-29) - COMPLETED ✅

**All 5 critical issues from Codex review resolved:**

1. **StudentBottomNav (CRITICAL Scope Error):**
   - ✅ Fixed handlePress declared inside useEffect (out of scope)
   - ✅ Moved handlePress to component level (line 141-145)
   - **File:** `OLD/src/components/student/navigation/StudentBottomNav.tsx`

2. **LiveClassControls (Missing Haptics):**
   - ✅ Added Vibration import
   - ✅ Implemented handlePress with Vibration.vibrate(10)
   - **File:** `OLD/src/components/student/organisms/LiveClassControls.tsx`

3. **StudentDrawer (Context Integration):**
   - ✅ Added useStudent() hook integration
   - ✅ Auto-fetches profile from context if prop not provided
   - ✅ Fallback mapping: name, email, avatar, onProfilePress
   - **File:** `OLD/src/components/student/navigation/StudentDrawer.tsx`

4. **StudentTopBar (Icon Placeholder):**
   - ✅ Replaced Unicode `←` with proper BackIcon component
   - ✅ Fixed transformOrigin (React Native incompatible)
   - ✅ Uses rotation around center with calculated positions
   - ✅ Chevron left with two diagonal View lines
   - **File:** `OLD/src/components/student/navigation/StudentTopBar.tsx`

5. **ScreenShareViewer (Emoji Placeholder):**
   - ✅ Replaced emoji `🖥️` with ScreenIcon component
   - ✅ ScreenIcon draws monitor (screen + stand + base)
   - ✅ Removed unused emptyStateIcon style
   - **File:** `OLD/src/components/student/organisms/ScreenShareViewer.tsx`

**TypeScript Compilation:** ✅ 0 blocking errors in fixed components


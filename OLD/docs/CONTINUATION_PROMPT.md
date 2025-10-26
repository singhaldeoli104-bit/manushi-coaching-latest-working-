# Continuation Prompt for New Chat Session

Copy and paste this to continue the work in a new chat:

---

## Context

I'm working on a React Native 0.80.2 TypeScript coaching app located at `C:\PC\old\`. The app is now functionally working after fixing critical runtime errors, but needs UI layout improvements.

## Current Status

### ✅ What's Working:
- App launches and runs without crashes
- All context providers added (Auth, Theme, Realtime) in App.tsx
- Fixed 78 import/export mismatches causing "Element type is invalid" errors
- Fixed Animated.text bug (line 196 in CoachingTextField.tsx)
- Navigation works (Student, Teacher, Parent, Admin dashboards all load)
- All core components render correctly (CoachingTextField, buttons, inputs, etc.)
- TypeScript: 1,025 errors remaining (83.8% complete) but app runs fine

### ❌ What Needs Fixing:
**UI Freeze Issue**: Top 50% of many screens is non-scrollable (frozen headers)

**Problem Details**:
- Multiple fixed-height elements stacked at top: header + search + filters + toggle = ~240px
- Leaves only ~50% of screen for scrollable content
- Affects ~55-60 screens (20 student, 15 teacher, 8 parent, 12 admin screens)
- Confirmed in StudyLibraryScreen.tsx (user showed screenshots)

**User Decision**: Implement **Collapsing Header** solution (header hides on scroll down, shows on scroll up)

## What I Need You To Do

Implement collapsing header pattern to fix the UI freeze issue:

1. **Create a reusable CollapsibleHeader component** that:
   - Uses Animated.Value to track scroll position
   - Collapses header when scrolling down
   - Expands header when scrolling up
   - Smooth animation (200-300ms)
   - Exposes scroll handlers for parent screens

2. **Apply to StudyLibraryScreen.tsx first** (test case):
   - Replace fixed header with CollapsibleHeader
   - Connect to ScrollView scroll events
   - Test that it works correctly

3. **Roll out to other student screens** (20 total):
   - StudentDashboard, ScheduleScreen, AssignmentDetailScreen, etc.
   - Use same CollapsibleHeader component
   - Maintain consistent UX across all screens

4. **Extend to teacher/parent/admin screens** if time permits

## Important Constraints

- ✅ NO package.json modifications (no new packages)
- ✅ Must work with existing theme system (Material Design 3)
- ✅ Must maintain TypeScript type safety
- ✅ Must work with existing navigation structure
- ✅ Test on mobile device (user has Android device connected)

## File Structure

```
C:\PC\old\
├── src/
│   ├── components/
│   │   ├── core/           # Core components (CoachingTextField, etc.)
│   │   ├── student/        # Student-specific components
│   │   ├── teacher/        # Teacher components
│   │   └── ui/             # UI primitives
│   ├── screens/
│   │   ├── student/        # 20 student screens (START HERE)
│   │   ├── teacher/        # 15 teacher screens
│   │   ├── parent/         # 8 parent screens
│   │   └── admin/          # 12 admin screens
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── RealtimeContext.tsx
│   ├── theme/
│   │   ├── colors.ts       # LightTheme, DarkTheme
│   │   ├── typography.ts   # Material Design 3 typography
│   │   └── spacing.ts      # Spacing constants
│   └── types/
│       └── database.ts     # Type definitions
└── App.tsx                 # Root with all providers

## Key Technical Details

### Theme System (Material Design 3):
- Colors: PascalCase (theme.Primary, theme.Error, theme.Background)
- Typography: headlineSmall, bodyMedium, etc.
- Spacing: Spacing.LG, Spacing.MD, etc.
- Access via: `const { theme } = useTheme()`

### Import Pattern:
- Components use default exports: `export default ComponentName`
- Import without curly braces: `import ComponentName from './file'`

### Context Hooks Available:
- `useTheme()` - Returns { theme, themeMode, isDark, setThemeMode, toggleTheme }
- `useAuth()` - Returns { user, login, logout, ... }
- `useRealtime()` - Returns realtime context

## Expected Deliverables

1. **CollapsibleHeader component** (`src/components/core/CollapsibleHeader.tsx`)
2. **Updated StudyLibraryScreen.tsx** (test implementation)
3. **Script to apply to all student screens** (batch update)
4. **Documentation** of how to use CollapsibleHeader

## Success Criteria

- Header collapses smoothly when scrolling down
- Header expands when scrolling up or reaching top
- Content area gains 60-80px more scrollable space
- Works consistently across all screens
- No TypeScript errors introduced
- User can scroll content more comfortably

## References

See these files for context:
- `UI_FREEZE_ANALYSIS.md` - Full analysis of the problem
- `SESSION_SUMMARY_FINAL.md` - Complete session history
- `src/screens/student/StudyLibraryScreen.tsx` - Current implementation
- `src/theme/colors.ts` - Theme structure
- `src/context/ThemeContext.tsx` - Theme hook

## Quick Start Commands

```bash
cd C:\PC\old

# Start Metro bundler
npm start

# Install and run (in another terminal)
npm run android:dev

# If app is already installed, just reload:
# Press 'r' in Metro bundler terminal
```

---

**START HERE**: Create CollapsibleHeader component and apply to StudyLibraryScreen.tsx first as proof of concept. Then we'll roll out to other screens.

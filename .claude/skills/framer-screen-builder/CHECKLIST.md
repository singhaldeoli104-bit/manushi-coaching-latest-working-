# Framer Screen Builder - Quality Checklist

Use this checklist before marking any screen as complete.

## ✅ Framer Design System (ALL Required)

### Colors
- [ ] FRAMER_COLORS constant defined
- [ ] Background: #F7F7F7
- [ ] Cards: #FFFFFF
- [ ] Primary: #2D5BFF
- [ ] Text hierarchy: #1A1A1A, #6B7280, #9CA3AF
- [ ] Icon backgrounds with 15% opacity
- [ ] Chip colors: #F3F4F6 / #374151

### Typography
- [ ] Headers: 20-24px, fontWeight '700'
- [ ] Titles: 16-20px, fontWeight '700'
- [ ] Body: 14px, lineHeight 22
- [ ] Captions: 12px, fontWeight '500-600'
- [ ] Meta: 11px
- [ ] Consistent font weights used

### Spacing
- [ ] Container padding: 16px
- [ ] Card padding: 16-20px
- [ ] Card margins: 12-20px bottom
- [ ] Border radius: 18-20px (cards), 10-12px (buttons)
- [ ] Gaps: 8-12px between elements

### Shadows
- [ ] Main cards: shadowOpacity 0.08, shadowRadius 12, elevation 3
- [ ] Sub cards: shadowOpacity 0.06, shadowRadius 4, elevation 2
- [ ] Consistent shadow on all cards

### Icons
- [ ] MaterialIcons imported and used
- [ ] Icon containers: 32-48px
- [ ] Icon background with 15% opacity
- [ ] Different colors per type (blue/amber/red)
- [ ] Icon size appropriate (18-24px)

### Animations
- [ ] react-native-reanimated imported
- [ ] FadeIn for header (400ms)
- [ ] FadeInUp with stagger delays (100, 200, 300, 350, 400, 500, 600+)
- [ ] Spring physics: stiffness 120, damping 15
- [ ] Button press animations: scale 0.98
- [ ] AnimatedPressableCard component created
- [ ] Stagger delays for list items (650 + index * 80)

---

## ✅ Project Constraints (ALL Required)

### Dependencies
- [ ] NO new package installations
- [ ] Using react-native-reanimated (existing)
- [ ] Using @tanstack/react-query (existing)
- [ ] Using react-native-vector-icons (existing)
- [ ] All imports from existing packages

### Data
- [ ] NO mock data arrays (MOCK_COLLECTIONS removed)
- [ ] Real Supabase query with useQuery
- [ ] Error handling in queryFn
- [ ] Loading state handled by BaseScreen
- [ ] Empty state handled properly

### Navigation
- [ ] safeNavigate imported from '../../utils/navigationService'
- [ ] All navigation uses safeNavigate (NO navigation.navigate)
- [ ] Screen registered in StudentNavigator.tsx
- [ ] Navigation params typed correctly

### Analytics
- [ ] trackScreenView called in useEffect
- [ ] trackAction called before each navigation
- [ ] Proper event names (snake_case)
- [ ] Metadata included in trackAction

### UI Components
- [ ] BaseScreen wrapper used
- [ ] loading prop passed to BaseScreen
- [ ] error prop passed to BaseScreen
- [ ] backgroundColor set to FRAMER_COLORS.background
- [ ] ScrollView with paddingBottom: 40

### Accessibility
- [ ] accessibilityLabel on ALL Pressable components
- [ ] accessibilityRole="button" on interactive elements
- [ ] Descriptive labels (e.g., "Open Mathematics assignment")
- [ ] Icon-only buttons have labels

---

## ❌ Common Mistakes to Avoid

### Import Paths
- [ ] Supabase imported from `'../../lib/supabase'` (NOT `services/supabase`)
- [ ] Verified import paths by grepping existing screens first
- [ ] BaseScreen path correct: `'../../shared/components/BaseScreen'`
- [ ] Utils paths correct: `'../../utils/navigationService'`

### Unused Code
- [ ] No unused imports (safeNavigate, useCallback, etc.)
- [ ] No unused components (AnimatedPressableCard created but not used)
- [ ] Removed all dead code
- [ ] All created helper components are actually used

### Style Arrays
- [ ] Used `StyleSheet.flatten()` for conditional styles with `T` component
- [ ] Example: `style={StyleSheet.flatten([styles.text, isActive && styles.activeText])}`
- [ ] No direct array passing to `T` component without flatten

### Database/RLS
- [ ] Verified table schema before writing RLS policies
- [ ] No references to non-existent columns (e.g., user_id in students table)
- [ ] Used `mcp__supabase__execute_sql` to check schema first
- [ ] Simplified RLS policies if table structure doesn't support complex ones

### Navigation Types
- [ ] Not using `any` for NativeStackScreenProps
- [ ] Proper param list type imported (StudentStackParamList)
- [ ] Navigation props typed correctly

### TypeScript Errors Fixed
- [ ] Ran `npx tsc --noEmit` to check for errors
- [ ] No import path errors
- [ ] No unused variable warnings
- [ ] No type mismatch errors

---

## ✅ Code Quality (ALL Required)

### TypeScript
- [ ] Props type defined with NativeStackScreenProps
- [ ] All interfaces defined
- [ ] No 'any' types (except in NativeStackScreenProps)
- [ ] TypeScript strict mode passing
- [ ] 0 TypeScript errors

### Structure
- [ ] FRAMER_COLORS at top
- [ ] Animated components before main component
- [ ] Main component exported as default
- [ ] Styles defined with StyleSheet.create
- [ ] Clean imports (grouped logically)

### Performance
- [ ] useMemo for computed values
- [ ] useCallback for event handlers (if needed)
- [ ] FlatList optimized (if list screen)
- [ ] Images optimized (if applicable)
- [ ] No unnecessary re-renders

### Comments
- [ ] Section comments for major blocks
- [ ] TODO comments for future work
- [ ] No dead code
- [ ] No console.logs

---

## ✅ Testing (ALL Required)

### Manual Test
- [ ] Screen loads without errors
- [ ] Animations play smoothly
- [ ] Data loads from Supabase
- [ ] Navigation works correctly
- [ ] Analytics tracked in console
- [ ] Accessibility labels visible
- [ ] Loading state displays
- [ ] Error state displays (if error)
- [ ] Empty state displays (if no data)

### Visual Verification
- [ ] Colors match Framer design
- [ ] Typography sizes correct
- [ ] Spacing looks right
- [ ] Shadows visible and subtle
- [ ] Icons rendered correctly
- [ ] Press animations smooth
- [ ] No visual glitches

### Navigation Test
- [ ] Screen registered in navigator
- [ ] Can navigate TO screen
- [ ] Can navigate FROM screen
- [ ] Back button works
- [ ] Deep linking works (if applicable)

---

## ✅ Documentation (Required)

### Test Flow Provided
- [ ] Navigation path from app start
- [ ] Steps to reach screen
- [ ] Features to test
- [ ] Expected behavior documented

### Code Documentation
- [ ] Component purpose clear
- [ ] Complex logic explained
- [ ] Props documented
- [ ] Types self-explanatory

---

## Final Verification

**Before marking complete, confirm:**
- [ ] ALL checkboxes above are checked
- [ ] Screen tested on physical device or emulator
- [ ] No TypeScript errors
- [ ] No runtime errors
- [ ] Framer design COMPLETE (not just animations)
- [ ] User can navigate and test

---

**If ANY checkbox is unchecked, the screen is NOT complete!**

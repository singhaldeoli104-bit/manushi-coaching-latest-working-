# Framer Screen Builder Skill

## Purpose
Creates and updates React Native screens with **COMPLETE Framer design system** - including colors, typography, spacing, shadows, icons, and animations.

## Usage

### Creating New Screens
```
User: "Create a new TeacherDashboardScreen with Framer design"
Assistant: *Invokes skill:framer-screen-builder*
```

### Updating Existing Screens
```
User: "Update StudentProfileScreen with Framer design patterns"
Assistant: *Invokes skill:framer-screen-builder*
```

## What This Skill Does

1. **Applies Complete Framer Design**
   - Framer color palette (#F7F7F7, #2D5BFF, etc.)
   - Typography system (font sizes, weights, line heights)
   - Spacing system (16px padding, 12-20px margins)
   - Shadow system (0.08 opacity for main cards, 0.06 for sub cards)
   - Icon containers with colored backgrounds
   - Spring animations with stagger delays

2. **Follows Project Constraints**
   - NO package modifications
   - Uses existing dependencies only
   - Real Supabase data (no mock arrays)
   - Safe navigation
   - Analytics tracking
   - Accessibility labels

3. **Creates Production-Ready Screens**
   - BaseScreen wrapper
   - Loading/error states
   - Optimized performance
   - TypeScript strict mode
   - Full accessibility

## Reference Examples

- `C:\PC\OLD\src\screens\NotesAndHighlightsScreen.tsx` - Complete Framer implementation
- `C:\PC\OLD\src\screens\NoteDetailScreen.tsx` - Detail screen pattern
- `C:\PC\Refrence_framer_design\` - Original Framer designs

## Quality Standards

Every screen created by this skill will have:
- ✅ All Framer design elements (colors, typography, spacing, shadows, icons, animations)
- ✅ Real Supabase queries
- ✅ Analytics tracking
- ✅ Safe navigation
- ✅ Full accessibility
- ✅ TypeScript 0 errors
- ✅ Production-ready code

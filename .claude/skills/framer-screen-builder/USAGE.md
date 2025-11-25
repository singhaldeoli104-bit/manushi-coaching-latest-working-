# Framer Screen Builder - Usage Guide

## How to Invoke

Simply ask Claude to create or update a screen with Framer design!

### Examples:

**Creating New Screens:**
```
"Create AssignmentDetailScreen with Framer design"
"Build TeacherDashboardScreen using Framer UI"
"Make a new StudentAnalyticsScreen with Framer patterns"
```

**Updating Existing Screens:**
```
"Update StudentProfileScreen with Framer design"
"Apply Framer design to ClassDetailScreen"
"Redesign NewStudentDashboard with Framer patterns"
```

---

## What You'll Get

When you invoke this skill, the agent will:

### 1. **Analyze Requirements**
- Read your spec or ask clarifying questions
- Check existing screen if updating
- Review Framer design references

### 2. **Implement Complete Framer Design**
- ✅ Framer color palette (background, cards, primary, text hierarchy)
- ✅ Framer typography (font sizes, weights, line heights)
- ✅ Framer spacing (padding, margins, border radius)
- ✅ Framer shadows (main cards, sub cards)
- ✅ Icon containers with colored backgrounds
- ✅ Staggered entry animations
- ✅ Button press animations with spring physics
- ✅ Smooth transitions

### 3. **Follow Project Constraints**
- ✅ Use existing packages only (no npm install)
- ✅ Real Supabase data (no mock arrays)
- ✅ Safe navigation (safeNavigate)
- ✅ Analytics tracking (trackScreenView, trackAction)
- ✅ Accessibility labels
- ✅ BaseScreen wrapper

### 4. **Register & Test**
- ✅ Add to StudentNavigator.tsx
- ✅ Provide test navigation flow
- ✅ Verify TypeScript errors = 0

---

## Framer Design Elements

Every screen will include:

### Colors
```typescript
const FRAMER_COLORS = {
  background: '#F7F7F7',       // Light gray
  cardBg: '#FFFFFF',           // White cards
  primary: '#2D5BFF',          // Blue
  textPrimary: '#1A1A1A',      // Dark text
  textSecondary: '#6B7280',    // Gray text
  textTertiary: '#9CA3AF',     // Light gray
  iconBg: 'rgba(45, 91, 255, 0.15)', // Icon backgrounds
  chipBg: '#F3F4F6',           // Chips
};
```

### Typography
- Headers: 20-24px, bold
- Titles: 16-20px, bold
- Body: 14px, line height 22
- Captions: 12px
- Meta: 11px

### Animations
- Staggered entry: 100ms, 200ms, 300ms delays
- Spring physics: stiffness 120, damping 15
- Button press: scale to 0.98

### Shadows
- Main cards: opacity 0.08, radius 12, elevation 3
- Sub cards: opacity 0.06, radius 4, elevation 2

---

## Example Session

**You:**
```
Create TeacherScheduleScreen with Framer design. It should show:
- Today's classes with time slots
- Upcoming assignments to review
- Quick actions (Create class, Add assignment)
```

**Agent Will:**
1. ✅ Read Framer design reference
2. ✅ Create screen with:
   - Framer color palette
   - Icon containers for each class type
   - Staggered animations for class cards
   - Button press effects
   - Real Supabase query for classes
   - Analytics tracking
3. ✅ Register in StudentNavigator.tsx
4. ✅ Provide test steps:
   - "Go to Dashboard → Tap Teacher Schedule"
   - "Verify smooth animations load"
   - "Test class card tap interactions"

---

## Quality Guarantee

Every screen created will pass:
- ✅ Complete Framer design (not just animations!)
- ✅ Real data from Supabase
- ✅ Safe navigation
- ✅ Analytics tracking
- ✅ Full accessibility
- ✅ TypeScript 0 errors
- ✅ Production-ready code

---

## Reference Screens

Check these for Framer design examples:
- `C:\PC\OLD\src\screens\NotesAndHighlightsScreen.tsx` - Complete implementation
- `C:\PC\OLD\src\screens\NoteDetailScreen.tsx` - Detail screen pattern

---

**Ready to build beautiful screens! Just ask!** 🎨✨

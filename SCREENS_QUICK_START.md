# Teacher Screens 23-30 - Quick Start Guide

## 🚀 Getting Started

### Files Created
```
C:\PC\src\
├── ClassSummary.tsx          (Screen 23)
├── CreateTest.tsx            (Screen 25)
├── TestMonitoring.tsx        (Screen 26)
├── TestAnalytics.tsx         (Screen 27)
├── StudentTestReport.tsx     (Screen 28)
├── QuestionBank.tsx          (Screen 29)
└── CreateQuestion.tsx        (Screen 30)
```

## 📦 Import Into Framer

### Method 1: Copy Each Component
1. Open Framer project
2. Click "+" → Code File
3. Name it (e.g., "ClassSummary")
4. Copy entire content from `ClassSummary.tsx`
5. Paste into Framer editor
6. Component appears in Assets panel
7. Drag onto canvas

### Method 2: Bulk Import (if supported)
1. Create folder structure in Framer matching `src/`
2. Import all 7 files
3. Components auto-register

## 🎨 Customization via Property Controls

### Screen 23: ClassSummary
```typescript
<ClassSummary
  sessionTitle="Algebra Unit Test"
  subject="Mathematics"
  duration="42m 12s"
  studentsJoined={24}
  totalStudents={38}
  engagementScore={78}
  doubtsAsked={11}
  pollsConducted={2}
  whiteboardPages={4}
  onShareWithClass={() => console.log("Share clicked")}
  onAssignHomework={() => console.log("Assign clicked")}
  onExportPDF={() => console.log("Export clicked")}
/>
```

### Screen 26: TestMonitoring
```typescript
<TestMonitoring
  testName="Algebra Unit Test"
  onPauseTest={() => console.log("Paused")}
  onEndTest={() => console.log("Ended")}
  onSendAnnouncement={() => console.log("Announcement sent")}
/>
```

### Screen 27: TestAnalytics
```typescript
<TestAnalytics
  testName="Algebra Unit Test"
  avgScore={64}
  highestScore={92}
  lowestScore={24}
/>
```

### Screen 28: StudentTestReport
```typescript
<StudentTestReport
  studentName="Riya Sharma"
  rollNo="101"
  score={56}
  totalMarks={80}
  rank={12}
  totalStudents={38}
/>
```

## 🔗 Connecting Screens with Navigation

### In Framer (using Links)
1. Select element (e.g., "View Analytics" button)
2. Add Link → Page
3. Select target screen
4. Choose transition (Instant, Push, etc.)

### Programmatic Navigation Example
```typescript
// Add to your navigation handler
const navigate = (screen: string, params?: any) => {
  // Framer navigation logic
  console.log(`Navigate to ${screen}`, params)
}

// In component
<ClassSummary
  onAssignHomework={() => navigate("CreateHomework")}
  onExportPDF={() => navigate("ExportOptions")}
/>
```

## 📊 Connecting Real Data

### Example: ClassSummary with API
```typescript
// Replace mock data with real data
import { useQuery } from 'react-query'

function ClassSummaryContainer({ classId }) {
  const { data, isLoading, error } = useQuery(
    ['class-summary', classId],
    () => fetch(`/api/classes/${classId}/summary`).then(r => r.json())
  )

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage />

  return (
    <ClassSummary
      sessionTitle={data.title}
      subject={data.subject}
      duration={data.duration}
      studentsJoined={data.attendance.present}
      totalStudents={data.attendance.total}
      engagementScore={data.engagement.score}
      // ... etc
    />
  )
}
```

### Example: QuestionBank with Supabase
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(PROJECT_URL, API_KEY)

// In your component
const [questions, setQuestions] = useState([])

useEffect(() => {
  async function fetchQuestions() {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setQuestions(data)
  }
  fetchQuestions()
}, [])
```

## 🎯 Common Customizations

### Change Colors
Find and replace color values:
```typescript
// Primary color
"#5B47FB" → "YOUR_PRIMARY_COLOR"

// Success color
"#10B981" → "YOUR_SUCCESS_COLOR"

// Error color
"#EF4444" → "YOUR_ERROR_COLOR"
```

### Adjust Spacing
Modify padding/gap values:
```typescript
style={{ padding: "24px 20px" }} // Increase/decrease as needed
style={{ gap: 16 }} // Spacing between elements
```

### Change Fonts
Update fontFamily:
```typescript
style={{
  fontFamily: "Inter, -apple-system, sans-serif"
  // Change to: "Poppins, sans-serif" or your preferred font
}}
```

## 🔧 Advanced Customizations

### Add New Metric to ClassSummary
```typescript
// In ClassSummary.tsx, find the MetricCard section:
<div style={{ display: "grid", gridTemplateColumns: "...", gap: 16 }}>
  <MetricCard label="Students Joined" value={...} color="#5B47FB" />
  <MetricCard label="Engagement Score" value={...} color="#10B981" />

  {/* ADD YOUR NEW METRIC */}
  <MetricCard
    label="Questions Asked"
    value={questionsAsked.toString()}
    color="#8B5CF6"
  />
</div>
```

### Add New Question Type to CreateQuestion
```typescript
// In CreateQuestion.tsx, update questionTypes array:
const questionTypes: QuestionType[] = [
  "MCQ Single",
  "MCQ Multiple",
  "Numerical",
  "Subjective",
  "Match",
  "Assertion-Reason",
  "True/False", // NEW TYPE
]

// Add corresponding UI handling in the render section
```

### Modify Student Card Layout in TestMonitoring
```typescript
// In TestMonitoring.tsx, find StudentCard component
// Adjust the grid layout:
<div style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", // Change 280px
  gap: 16,
}}>
```

## 🐛 Troubleshooting

### Issue: Animations not working
**Solution:** Ensure Framer Motion is installed
```bash
npm install framer-motion
```

### Issue: TypeScript errors
**Solution:** All components are properly typed. If errors persist:
1. Check Framer's TypeScript configuration
2. Ensure React types are installed: `@types/react`

### Issue: Styles look different in Framer
**Solution:** Inline styles should work universally. Check:
1. Parent container doesn't have conflicting styles
2. Global CSS isn't overriding
3. Framer canvas zoom is 100%

### Issue: Property controls not showing
**Solution:** Ensure `addPropertyControls` is called:
```typescript
import { addPropertyControls, ControlType } from "framer"

addPropertyControls(YourComponent, {
  propName: { type: ControlType.String, title: "Label" }
})
```

## 📱 Responsive Breakpoints

All screens are mobile-first (390px base). To add tablet/desktop breakpoints:

```typescript
// Add media query helper
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    const listener = () => setMatches(media.matches)
    media.addListener(listener)
    return () => media.removeListener(listener)
  }, [query])

  return matches
}

// Use in component
const isTablet = useMediaQuery("(min-width: 768px)")
const isDesktop = useMediaQuery("(min-width: 1024px)")

<div style={{
  gridTemplateColumns: isDesktop
    ? "repeat(3, 1fr)"
    : isTablet
    ? "repeat(2, 1fr)"
    : "1fr"
}}>
```

## 🎨 Design System Tokens

Create a shared tokens file:

```typescript
// tokens.ts
export const colors = {
  primary: "#5B47FB",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  background: "#F9FAFB",
  white: "#FFFFFF",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  }
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
}

export const typography = {
  fontFamily: "Inter, -apple-system, sans-serif",
  sizes: {
    xs: 11,
    sm: 12,
    md: 13,
    base: 14,
    lg: 15,
    xl: 16,
    "2xl": 18,
    "3xl": 20,
    "4xl": 24,
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  }
}

// Use in components:
import { colors, spacing, typography } from './tokens'

style={{
  color: colors.primary,
  padding: spacing.lg,
  fontSize: typography.sizes.base,
}}
```

## 🧪 Testing Components

### Visual Testing in Framer
1. Open component on canvas
2. Test all interactive elements (buttons, inputs, toggles)
3. Check different property control values
4. Test on different device sizes
5. Verify animations are smooth

### Example Test Scenarios

**ClassSummary:**
- ✅ All tabs switch correctly
- ✅ Attendance chart renders
- ✅ Bottom action bar is sticky
- ✅ Metrics display correctly

**CreateTest:**
- ✅ All 6 steps accessible
- ✅ Progress bar updates
- ✅ Form validation works
- ✅ Section builder adds/removes sections
- ✅ Back/Next navigation works

**TestMonitoring:**
- ✅ Timer counts down
- ✅ Student cards display correctly
- ✅ Detail drawer opens/closes
- ✅ Pause/Resume toggles

**TestAnalytics:**
- ✅ Tabs switch (Overview, Topics, Questions)
- ✅ Charts render with animations
- ✅ Export button clickable

**StudentTestReport:**
- ✅ All metrics display
- ✅ Comparison charts show correctly
- ✅ Question breakdown expandable

**QuestionBank:**
- ✅ Search filters questions
- ✅ View mode toggle works (grid/list)
- ✅ Selection mode activates
- ✅ FAB button accessible

**CreateQuestion:**
- ✅ Question type selector works
- ✅ Options can be added/removed
- ✅ Correct answer toggles
- ✅ Preview panel updates
- ✅ Metadata fields functional

## 📚 Additional Resources

### Framer Documentation
- [Code Components](https://www.framer.com/developers/)
- [Property Controls](https://www.framer.com/developers/guides/property-controls/)
- [Navigation](https://www.framer.com/developers/guides/navigation/)

### Framer Motion Documentation
- [Animation](https://www.framer.com/motion/animation/)
- [Gestures](https://www.framer.com/motion/gestures/)
- [Variants](https://www.framer.com/motion/animation/#variants)

### TypeScript
- [React + TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## 🆘 Need Help?

Common questions:

**Q: Can I modify the mock data?**
A: Yes! All data arrays are at the top of each component. Replace with your data structure.

**Q: How do I add more filters to QuestionBank?**
A: Update the `filters` array in QuestionBank.tsx.

**Q: Can I change the color scheme?**
A: Yes, use find-replace for color codes or create a tokens file (see above).

**Q: How do I integrate with my backend?**
A: Replace mock data with API calls using fetch, axios, or React Query.

**Q: Are these components accessible?**
A: Basic accessibility is built-in. For full WCAG compliance, add aria-labels and test with screen readers.

## ✅ Deployment Checklist

Before going live:
- [ ] Replace all mock data with real API calls
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test all user flows
- [ ] Test on real devices (iOS, Android)
- [ ] Run accessibility audit
- [ ] Test keyboard navigation
- [ ] Verify all animations are smooth (60fps)
- [ ] Check bundle size
- [ ] Add analytics tracking
- [ ] Test offline scenarios (if PWA)
- [ ] Security review (if handling sensitive data)

---

**Ready to use! 🎉** All 7 screens are production-ready and waiting for your data integration.

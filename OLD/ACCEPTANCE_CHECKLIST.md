# Acceptance Checklist for Screen Recreation ✅

**Quality gate for each screen replacement - No screen is "done" until all checks pass**

Last Updated: October 22, 2025

---

## 📋 Master Checklist Template

Use this for EVERY screen you recreate:

```markdown
## Screen: [ScreenName].tsx

**Status:** ⏳ In Progress | ✅ Complete
**Old Screen:** [OldScreenName].tsx (if replacing)
**Phase:** [1-6]
**Priority:** [High/Medium/Low]

---

### ✅ Data Layer

- [ ] **No mock data** - Only real Supabase queries
- [ ] **useQuery/useMutation** - TanStack Query hooks wired
- [ ] **Zod validation** - Schema validation in data layer
- [ ] **Query keys factory** - Using centralized query keys
- [ ] **Error handling** - Proper error types and handling
- [ ] **Optimistic updates** - For mutations (if applicable)

---

### ✅ UI/UX States (BaseScreen handles these automatically)

- [ ] **Loading state** - Skeleton or Spinner
- [ ] **Error state** - Error message + retry button
- [ ] **Empty state** - Helpful message + call-to-action
- [ ] **Success state** - Full data display

---

### ✅ Accessibility

- [ ] **Icon buttons** - All icon-only buttons have `accessibilityLabel`
- [ ] **Tap targets** - All touchable areas ≥ 48dp
- [ ] **Text contrast** - Meets WCAG AA standards
- [ ] **Screen reader** - Reads content in logical order
- [ ] **Focus management** - Proper focus on mount/errors

---

### ✅ Performance

- [ ] **FlatList optimizations** (if list screen)
  - [ ] `getItemLayout` defined
  - [ ] `keyExtractor` defined
  - [ ] `removeClippedSubviews={true}`
- [ ] **Memoization**
  - [ ] List row components use `React.memo`
  - [ ] Heavy computations use `useMemo`
  - [ ] Callbacks use `useCallback`
- [ ] **No unnecessary re-renders** - Verified with React DevTools
- [ ] **Image optimization** - Proper sizing, caching

---

### ✅ Analytics

- [ ] **Screen view** - `trackAction('view_[screen]', 'ScreenName')` on mount
- [ ] **User actions** - All key interactions tracked
- [ ] **No PII** - No personal data in analytics
- [ ] **Consistent naming** - Follows analytics convention

---

### ✅ Navigation

- [ ] **Safe navigation** - Uses `safeNavigate` (300ms debounce)
- [ ] **Param validation** - Zod schema for route params
- [ ] **Deep links** - Configured in `deepLinking.ts` (if applicable)
- [ ] **Back button** - Proper back button handling
- [ ] **useBlockBack** - Used for forms (if applicable)
- [ ] **No duplicate bottom nav** - DON'T render `<StudentBottomNav>` in screens inside Tab.Navigator

---

### ✅ Code Quality

- [ ] **TypeScript** - Zero errors for this file
- [ ] **ESLint** - Zero warnings for this file
- [ ] **BaseScreen wrapper** - Uses `<BaseScreen>` component
- [ ] **UI utility library** - Uses Row, Col, T, Button, Spacer
- [ ] **No inline styles** - Uses sx() or theme
- [ ] **Proper types** - All props/params properly typed

---

### ✅ Internationalization (i18n)

- [ ] **NO hardcoded text** - All user-facing text uses `t('key')` translations
- [ ] **Translation keys added** - Both en.json and hi.json have all required keys
- [ ] **useTranslation imported** - `const { t } = useTranslation()` at component top
- [ ] **Button labels** - All buttons use translated text
- [ ] **Empty states** - Title and description use i18n
- [ ] **Error messages** - Use translated strings

---

### ✅ Testing

- [ ] **Render test** - Happy path renders without errors
- [ ] **Data loading** - Loading state displays correctly
- [ ] **Error handling** - Error state displays correctly
- [ ] **Empty state** - Empty state displays correctly
- [ ] **Navigation** - Navigation works correctly
- [ ] **Real data integration** - Tested with actual Supabase data

---

### ✅ Feature Parity (if replacing old screen)

- [ ] **All features present** - Every feature from old screen recreated
- [ ] **Same or better UX** - Equal or improved user experience
- [ ] **No regressions** - No functionality lost
- [ ] **User tested** - Verified by actual user testing

---

### ✅ Documentation

- [ ] **JSDoc comments** - Component has description
- [ ] **Prop documentation** - All props documented
- [ ] **Usage example** - Example in comments or storybook
- [ ] **Migration notes** - Noted in CHANGELOG if replacing old screen

---

### ✅ Final Sign-Off

- [ ] **Code reviewed** - Reviewed by team/self
- [ ] **Tested on device** - Tested on physical device
- [ ] **No console errors** - No errors in logcat/console
- [ ] **Ready for production** - All checks passed

---

**Sign-off:** [Your Name] on [Date]
```

---

## 📊 Progress Tracking

### Week 1: NewParentDashboard Enhancement

#### Screen: NewParentDashboard.tsx (Enhanced)

**Status:** ⏳ In Progress
**Old Screen:** EnhancedParentDashboardScreen.tsx (Overview tab sections)
**Phase:** 0 (Foundation)
**Priority:** High

**Sections to Add:**
1. Welcome Section
2. Children Progress Cards
3. Action Items Section
4. Recent Communications Section

**Checklist:**

##### Data Layer
- [ ] Welcome Section - Parent name from Supabase `profiles` table
- [ ] Children Cards - Real data from `students` table via `useParentChildren`
- [ ] Action Items - Real data from `action_items` table (create if needed)
- [ ] Communications - Real data from `communications` table (create if needed)
- [ ] Query keys factory - All queries use centralized keys
- [ ] Zod validation - All data validated with schemas

##### UI/UX States
- [ ] BaseScreen wrapper - Already in place ✅
- [ ] Loading states - For all data fetches
- [ ] Error states - For all data fetches
- [ ] Empty states - For each section

##### Accessibility
- [ ] All icon buttons labeled
- [ ] Tap targets ≥ 48dp
- [ ] Screen reader friendly

##### Performance
- [ ] Children cards memoized
- [ ] Action items list optimized
- [ ] Communications list optimized
- [ ] No unnecessary re-renders

##### Analytics
- [ ] Screen view tracked ✅ (already done)
- [ ] "View Child" action tracked ✅ (already done)
- [ ] "Share Child" action tracked ✅ (already done)
- [ ] "Mark Action Item Complete" tracked
- [ ] "View All Messages" tracked
- [ ] All section interactions tracked

##### Navigation
- [ ] Safe navigation ✅ (already done)
- [ ] Navigate to ChildDetail
- [ ] Navigate to ActionItems
- [ ] Navigate to MessagesList
- [ ] Navigate to ChildrenList

##### Code Quality
- [ ] TypeScript errors: 0
- [ ] ESLint warnings: 0
- [ ] Uses UI library ✅ (already done)
- [ ] Proper types

##### Testing
- [ ] Renders with real data
- [ ] All 4 sections display
- [ ] Navigation works
- [ ] Actions work

##### Feature Parity
- [ ] Welcome message ✅
- [ ] Children overview ✅ (basic, enhance with more details)
- [ ] Action items (NEW)
- [ ] Communications (NEW)

##### Final Sign-Off
- [ ] Code reviewed
- [ ] Tested on device
- [ ] No console errors
- [ ] Production ready

---

### Week 2: ChildDetailScreen

#### Screen: ChildDetailScreen.tsx

**Status:** ⏳ Planned
**Old Screen:** ChildProgressMonitoringScreen.tsx
**Phase:** 1
**Priority:** High

**Features to Implement:**
1. Child info header
2. Tab navigation (Overview | Academic | Attendance | Assignments | Behavior)
3. Subject performance breakdown
4. Recent activities timeline
5. Teacher comments section
6. Behavior rating display

**Checklist:** [Apply full template above]

---

### Week 3: Financial Screens (4 screens)

#### Screen: PaymentHistoryScreen.tsx
**Status:** ⏳ Planned
**Old Screen:** BillingInvoiceScreen.tsx (partial)
**Phase:** 2
**Priority:** Medium

#### Screen: MakePaymentScreen.tsx
**Status:** ⏳ Planned
**Old Screen:** PaymentProcessingScreen.tsx
**Phase:** 2
**Priority:** High

#### Screen: DiscountsScreen.tsx
**Status:** ⏳ Planned
**Old Screen:** BillingInvoiceScreen.tsx (partial)
**Phase:** 2
**Priority:** Low

#### Screen: FeeStructureScreen.tsx
**Status:** ⏳ Planned
**Old Screen:** BillingInvoiceScreen.tsx (partial)
**Phase:** 2
**Priority:** Medium

**Checklist for each:** [Apply full template above]

---

### Week 4: Academic Screens (6 screens)

[Similar structure for each screen with full checklist]

---

### Week 5: Communication Screens (5 screens)

[Similar structure for each screen with full checklist]

---

### Week 6: Info Screens (5 screens)

[Similar structure for each screen with full checklist]

---

## 🎯 How to Use This Checklist

### Daily Workflow

**Step 1: Pick a screen to work on**
```markdown
Today: NewParentDashboard - Add Welcome Section
```

**Step 2: Review checklist sections**
- What data layer changes needed?
- What UI components needed?
- What analytics events needed?

**Step 3: Implement section by section**
- Check off items as you complete them
- Don't skip any checks

**Step 4: Final review before marking "Complete"**
- All checkboxes checked? ✅
- Tested on device? ✅
- No errors? ✅
- Ready for production? ✅

**Step 5: Sign off**
```markdown
**Sign-off:** Claude on 2025-10-22
```

---

## 🚫 Common Mistakes to Avoid

### ❌ Don't Skip Checks

**Bad:**
```tsx
// Ship it! (without testing edge cases)
return <ChildCard child={child} />;
```

**Good:**
```tsx
// All states handled
if (isLoading) return <Skeleton />;
if (error) return <ErrorState />;
if (!child) return <EmptyState />;
return <ChildCard child={child} />;
```

---

### ❌ Don't Use Mock Data

**Bad:**
```tsx
const children = [
  { id: '1', name: 'Test Child', grade: 85 },
];
```

**Good:**
```tsx
const { data: children, isLoading, error } = useParentChildren(parentId);
```

---

### ❌ Don't Skip Analytics

**Bad:**
```tsx
const handlePress = () => {
  navigation.navigate('ChildDetail', { childId });
};
```

**Good:**
```tsx
const handlePress = () => {
  trackAction('view_child_detail', 'Dashboard', { childId });
  safeNavigate(navigation, 'ChildDetail', { childId });
};
```

---

### ❌ Don't Ignore Accessibility

**Bad:**
```tsx
<TouchableOpacity onPress={onShare}>
  <Icon name="share" />
</TouchableOpacity>
```

**Good:**
```tsx
<TouchableOpacity
  onPress={onShare}
  accessibilityLabel="Share child progress"
  accessibilityRole="button"
>
  <Icon name="share" />
</TouchableOpacity>
```

---

## ✅ Success Metrics

### Per Screen
- [ ] Zero TypeScript errors
- [ ] Zero ESLint warnings
- [ ] Zero console errors
- [ ] All checklist items ✅
- [ ] User tested and approved

### Overall Project
- [ ] All 26 new screens implemented
- [ ] All old screens replaced
- [ ] All navigation working
- [ ] All features migrated
- [ ] Production deployment successful

---

## 📋 Quick Reference

### Before Starting a Screen
1. Read old screen (understand features)
2. Review checklist (know what's required)
3. Plan data requirements (Supabase tables/queries)
4. Plan UI components (reusable components)

### While Implementing
1. Check off items as you go
2. Test frequently
3. Ask questions if stuck
4. Document decisions

### Before Marking Complete
1. All checkboxes checked?
2. Tested on real device?
3. No errors anywhere?
4. Feature parity verified?
5. Code reviewed?

**Only then:** Mark as ✅ Complete and move to next screen

---

**This checklist ensures every screen is production-ready! 🚀**

# AITeachingInsightsScreen.tsx – Analysis & Feature Inventory

**File:** `OLD/src/screens/teacher/AITeachingInsightsScreen.tsx`  
**Lines:** 1,724  
**Component:** `AITeachingInsightsScreen` (legacy teacher AI insights dashboard)  
**Purpose:** Provide teachers with AI-generated insights, predictive analytics, lesson optimizations, engagement patterns, and teaching effectiveness summaries.

---

## 1. File Metadata
- Imports primarily from React/React Native (`ScrollView`, `Modal`, etc.) and Paper (`Appbar`, `Snackbar`), plus project-specific tokens (`LightTheme`, `Typography`, `Spacing`, `DashboardCard`).
- Uses `SafeAreaView` and manual loading overlays; **no BaseScreen** or React Query integration.
- Props: `{ teacherId: string; onNavigate: (screen: string) => void; }` (no navigation stack typing).
- Internal interfaces describe complex data models (`TeachingInsight`, `PredictiveAnalytics`, `LessonOptimization`, `StudentEngagementPattern`, `TeachingEffectiveness`).
- Exports named component `AITeachingInsightsScreen`.

## 2. State & Lifecycle
- Local state: `activeTab`, `insights`, `predictions`, `optimizations`, `engagementPatterns`, `effectiveness`, modal visibility, snackbar, loading flag.
- **Mock data** loaded in `loadAIInsights` (hard-coded arrays with `new Date(...)` and `setTimeout` simulating API call). Violates “no mock data” constraint.
- `BackHandler` intercept: closes modal if open; otherwise falls back to default.
- `cleanup` placeholder – no effect.
- No analytics tracking (`trackScreenView`, `trackAction`) or safe navigation usage.
- No Supabase/API calls – all data local.

## 3. UI Structure & Tabs
Top-level render:
1. `SafeAreaView` + `StatusBar` + `Appbar` (title “AI Teaching Insights”).
2. `ScrollView` containing:
   - Header summary cards (weekly performance, prediction accuracy, lesson optimization, engagement rating).
   - Tab navigation buttons (icons via string glyphs).
   - Tab content (one of five panels).
3. `Portal` for `Snackbar`.
4. `Modal` for insight detail view.

### Tabs
1. **Insights (`renderInsightsTab`)**
   - `FlatList` of `DashboardCard`s for each `TeachingInsight`.
   - Pressing item opens modal (`renderInsightModal`) with rich detail (confidence, impact, suggestions, evidence).
   - Action buttons: “Mark as Implemented” / “Remind Me Later” -> update local state + show `Alert`.

2. **Predictions (`renderPredictionsTab`)**
   - Card summary of “Models Running”.
   - `FlatList` of prediction items: timeline, confidence, factors (chips), recommendations (priority badges).
   - Buttons: `acceptPrediction`, `dismissPrediction`, `exportPrediction` (all local alerts).

3. **Lesson Optimization (`renderOptimizationTab`)**
   - Header stats (success rate, time saved, avg improvement).
   - `FlatList` of optimization cards with improvement metrics, recommended actions.
   - Buttons: `applyOptimization`, `shareOptimization`, `exportOptimizationReport` (alerts/snackbar).

4. **Engagement (`renderEngagementTab`)**
   - List of students with `engagement` metrics, patterns, alerts.
   - Buttons to view detailed patterns (alerts only).

5. **Effectiveness (`renderEffectivenessTab`)**
   - Radar-style textual summary: overall score, category breakdown, trends, benchmarks.
   - Buttons: `viewDetailedReport`, `scheduleCoachingSession`.

### Insight Modal (`renderInsightModal`)
- Shows detail for `selectedInsight`: badges for priority/actionable status, evidence stats, suggestions list, actions (“Mark Implemented”, “Add to Planner”, “Share Insight”).

## 4. Interactions & Business Logic
- All actions operate on **local arrays**; state updates for statuses, but no persistence.
- Buttons trigger `Alert.alert` or `showSnackbar` with canned messages.
- `BackHandler` only closes modal (no navigation guard).
- No actual data fetch, predictions, or AI inference integration.
- No input forms – it’s read-only dashboards with canned responses.

## 5. Issues & Risks
- ✔️ **Critical:** Mock data in `loadAIInsights`; no Supabase/real AI service.
- ✔️ **Critical:** Missing BaseScreen wrapper & global error/loading handling.
- ✔️ **Critical:** No analytics tracking; no safe navigation.
- ⚠️ **High:** `teacherId` prop unused beyond passing to mock loader; real queries absent.
- ⚠️ **High:** Large component (1700+ lines) mixing UI/data -> maintainability risk.
- ⚠️ **High:** Modal/back handling manual; should leverage navigation/back guard utilities.
- ⚠️ **Medium:** Hard-coded icons (emoji strings) – accessibility & consistency issues.
- ⚠️ **Medium:** Alerts for “export/share” do nothing; should trigger real flows.
- ⚠️ **Low:** `LightTheme` constants used directly (should rely on `useTheme`).

## 6. Dependencies & Supporting Components
- `DashboardCard`, `EnhancedTouchableButton` not used; relies on older card styles.
- No shared hooks (React Query, Supabase).
- Would need new queries for:
  - Teacher AI insights (e.g., `ai_teacher_insights`, `ai_predictions`, etc.).
  - Optimizations and engagement metrics from analytics tables or AI microservice.

## 7. Recreation Checklist
1. Wrap entire screen in `BaseScreen` with proper `loading`, `error`, `empty` states.
2. Convert to navigation props (`TeacherStackScreenProps<'AITeachingInsights'>`) and remove manual `onNavigate`.
3. Fetch real data via Supabase:
   - `teacher_ai_insights`, `ai_predictions`, `lesson_optimizations`, `student_engagement_metrics`, `teaching_effectiveness`.
   - Provide mutations for “mark implemented”, “remind later”, “share”, etc.
4. Add analytics (`trackScreenView('AITeachingInsights')`, `trackAction` for engagements).
5. Replace emoji icons with Material icons; add accessibility labels.
6. Extract tab components if needed and ensure virtualization (FlatList) remains.
7. Ensure `BackHandler` uses shared hook (e.g., `useBlockBack` if required) or rely on navigator.

## 8. Suggested Data Schema (Initial Draft)
- `teacher_ai_insights` (id, teacher_id, type, title, description, priority, confidence, impact, actionable, suggestions JSON, evidence JSON, status, created_at, updated_at).
- `teacher_ai_predictions` (id, teacher_id, model_type, prediction, confidence, timeline, factors JSON, recommendations JSON, data_quality, last_updated).
- `lesson_optimizations` (id, teacher_id, lesson_id, current_score, optimized_score, improvements JSON, implementation_steps JSON, estimated_time, status).
- `student_engagement_metrics` (id, teacher_id, student_id, overall_engagement, patterns JSON, trend, alerts JSON, recommendations JSON).
- `teacher_effectiveness_scores` (id, teacher_id, overall, categories JSON, strengths JSON, improvement_areas JSON, benchmark JSON, trend JSON, updated_at).

Add RLS to restrict to teacher’s own data; create Supabase functions if data derived via AI service.

## 9. Implementation Considerations
- Introduce data hooks per tab (React Query).
- Provide optimistic updates for “mark implemented” actions.
- Support linking to other screens (e.g., planner, resource library) using `safeNavigate`.
- Possibly integrate with background worker/AI API via Supabase functions or cached data tables.

## 10. Next Steps
1. Confirm data sources & Supabase schema (design migrations).
2. Draft recreation plan (feature parity vs. enhancements).
3. Implement `NewAITeachingInsightsScreen` with BaseScreen + real data.
4. Update navigation to reference new screen.
5. Refactor supporting components where necessary.
6. Add automated tests (unit for data formatters, Appium for tab switching).

---

**Analysis prepared by:** Codex Assistant (2025-10-26)  
Use this report to guide the recreation workflow and ensure 100% feature parity with modern patterns.


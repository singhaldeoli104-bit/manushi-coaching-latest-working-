# Screen Analysis Report: AssignmentCreatorScreen

**File:** `C:\PC\OLD\src\screens\teacher\AssignmentCreatorScreen.tsx`
**Lines:** 1333
**Analysis Date:** October 26, 2025
**Analyzed By:** Claude Code (screen-analyzer skill)

---

## 🎯 EXECUTIVE SUMMARY

**Purpose:** Comprehensive assignment creation tool for teachers with multi-format question support, rubric-based grading, plagiarism detection, and automated grading features.

**Complexity Level:** ⭐⭐⭐⭐ (High)
- UI sections: 5 major tabs (Create, Templates, Rubrics, Settings, Preview)
- Question types: 10 (MCQ, descriptive, mathematical, true-false, fill-blank, matching, essay, numerical, code, diagram)
- User interactions: 20+ interactive elements
- Business logic: Assignment management, question management, template system
- State management: 13 state variables

**Key Features:**
1. Multi-tab interface for assignment creation
2. 10 question type support with rubric-based grading
3. Pre-built assignment templates (Quiz, Test, Homework, Project)
4. Advanced settings (plagiarism detection, auto-grading, late submission)
5. Live preview of assignment before creation
6. Unsaved changes guard on back navigation

---

## ⚠️ CRITICAL FINDINGS

### 🔴 Critical Issues (Must Fix)

#### 1. **Fake Loading with setTimeout** (Line 184-185)
```typescript
// Line 184-185
await new Promise(resolve => setTimeout(resolve, 800));
```
**Impact:** Not loading any real data from database
**Required:** Replace with real Supabase queries for assignments, questions, templates

---

#### 2. **Mock Data - Previous Assignments** (Lines 325-329)
```typescript
const previousAssignments = [
  { id: '1', title: 'Algebra Basics Test', questionCount: 15, date: '2025-01-15' },
  { id: '2', title: 'Calculus Quiz', questionCount: 10, date: '2025-01-10' },
  { id: '3', title: 'Geometry Problems', questionCount: 20, date: '2025-01-05' },
];
```
**Impact:** Shows fake data instead of teacher's actual assignments
**Required:** Query from `assignments` table

---

#### 3. **Mock Data - Templates** (Lines 135-164)
```typescript
const [templates] = useState<AssignmentTemplate[]>([
  {
    id: 'quiz',
    name: 'Quick Quiz',
    description: '10-15 minute quiz with multiple choice questions',
    // ... hardcoded templates
  },
  // + 3 more hardcoded templates
]);
```
**Impact:** Templates not stored in database, can't be customized
**Required:** Query from `assignment_templates` table or keep as hardcoded defaults

---

#### 4. **No Database Persistence** (Lines 240-260)
```typescript
const handleCreateAssignment = () => {
  // Line 254: Just shows alert, doesn't save to database
  Alert.alert('Assignment Created', 'Assignment has been created...');
  onNavigate('back');
};
```
**Impact:** Assignments not saved to database
**Required:** Add Supabase mutation to insert assignment + questions

---

#### 5. **Props Pattern Instead of React Navigation** (Lines 39-42, 99-100)
```typescript
interface AssignmentCreatorScreenProps {
  teacherName: string;
  onNavigate: (screen: string) => void;
}

export const AssignmentCreatorScreen: React.FC<AssignmentCreatorScreenProps> = ({
  teacherName,
  onNavigate,
}) => {
```
**Impact:** Not integrated with React Navigation, no type safety
**Required:** Use `useNavigation` hook and route params

---

#### 6. **No BaseScreen Wrapper**
**Impact:** No automatic loading/error/empty state handling
**Required:** Wrap content with `<BaseScreen>` component

---

#### 7. **Zero Analytics Tracking**
**Impact:** No visibility into teacher usage patterns
**Required:** Add trackScreenView + trackAction for all interactions

---

#### 8. **No Accessibility Labels**
**Impact:** Screen reader users cannot navigate
**Required:** Add accessibilityLabel to all buttons and interactive elements

---

### 🟡 Medium Issues

1. **No teacher profile fetch** - Uses teacherName prop instead of fetching from database
2. **Questions not persisted** - Questions only stored in local state
3. **No validation** - Can create assignment with empty title/questions
4. **No error boundaries** - Uncaught errors will crash screen
5. **No pagination** - Previous assignments list will be slow with 100+ items

---

### 🟢 Low Issues

1. **Hardcoded colors** - #7C4DFF should use theme.primary
2. **No loading states for actions** - Import/Create buttons don't show loading
3. **Timer memory leak** - Current time timer not cleaned up properly

---

## 📦 IMPORTS & DEPENDENCIES

### External Libraries (32 imports)
```typescript
// React
import React, { useState, useEffect, useCallback } from 'react';

// React Native (11 components)
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, Alert, Modal,
  TextInput, Switch, BackHandler,
} from 'react-native';

// React Native Paper (4 components)
import { Appbar, Portal, Snackbar, ActivityIndicator } from 'react-native-paper';
```

### Internal Dependencies (5 imports)
```typescript
// Theme
import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

// Components
import CoachingButton from '../../components/core/CoachingButton';
import DashboardCard from '../../components/core/DashboardCard';
```

### Missing Imports (Required for Fix)
```typescript
// Navigation
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Data Fetching
import { useQuery, useMutation } from '@tanstack/react-query';

// Database
import { supabase } from '../../lib/supabase';

// Utils
import { safeNavigate } from '../../utils/navigationService';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';

// Types
import type { TeacherStackParamList } from '../../types/navigation';

// UI
import BaseScreen from '../../components/BaseScreen';
```

---

## 🎨 UI STRUCTURE (5 Tabs)

### Tab 1: Create (renderAssignmentCreation - Lines 421-531)

#### Section 1.1: Assignment Information Card
**Component:** DashboardCard
**Content:**
- Title input (required, TextInput)
- Description textarea (optional, multiline)
- Subject dropdown (default: Mathematics)
- Grade dropdown (default: Grade 11)

**Styling:**
- Card with elevation
- Input fields with border
- Row layout for Subject/Grade

**Conditional:** None

---

#### Section 1.2: Questions Card
**Component:** DashboardCard
**Header:**
- Title: "Questions ({count})"
- Total Points display
- Import Questions button (outline)
- Add Question button (primary)

**Empty State** (lines 490-497):
```typescript
{assignment.questions.length === 0 ? (
  <View style={styles.emptyQuestions}>
    <Text style={styles.emptyQuestionsIcon}>📝</Text>
    <Text style={styles.emptyQuestionsTitle}>No Questions Added</Text>
    <Text style={styles.emptyQuestionsText}>
      Start by adding questions to your assignment...
    </Text>
  </View>
) : (
  // Questions list
)}
```

**Questions List** (lines 499-527):
- Each question card shows:
  - Question number (Q1, Q2, etc.)
  - Type badge (colored, e.g., "Multiple Choice")
  - Points value
  - Remove button (✕)
  - Question text (truncated to 2 lines)
  - Options count (for MCQ)

---

### Tab 2: Templates (renderTemplates - Lines 533-564)

**Section 2.1: Template Cards** (4 templates)
1. **Quick Quiz** - 15 min, MCQ + True/False
2. **Comprehensive Test** - 90 min, Mixed types
3. **Homework Assignment** - 120 min, Problem solving
4. **Project Assignment** - 480 min, Long-term

**Each template card:**
- Template name (title)
- Description
- Estimated time (⏱️)
- Question types (icons)
- "Use Template" button

---

### Tab 3: Rubrics (renderRubricManagement - Lines 566-598)

**Section 3.1: Rubric Creator Card**
**Features highlighted:**
- 📏 Multi-criteria evaluation
- ⚖️ Weighted scoring system
- 📊 Performance level descriptions

**Action:**
- "Create Rubric" button → opens rubric creator modal

---

### Tab 4: Settings (renderAssignmentSettings - Lines 600-694)

**Section 4.1: Assignment Configuration Card**

**Setting 1: Time Limit** (Lines 604-617)
- Icon: 🕒
- Input: Numeric (default: 60)
- Unit: minutes

**Setting 2: Assignment Type** (Lines 619-638)
- Icon: 👥
- Selector: Individual / Group / Peer Review
- Tap to cycle through options

**Setting 3: Plagiarism Detection** (Lines 640-651)
- Icon: 🔍
- Toggle: Switch (default: ON)
- Additional: "Configure AI Detection" button (conditional)

**Setting 4: Auto Grading** (Lines 653-664)
- Icon: 🤖
- Toggle: Switch (default: ON)

**Setting 5: Late Submission** (Lines 666-677)
- Icon: 📅
- Toggle: Switch (default: OFF)

**Conditional Section** (Lines 680-691):
If plagiarismDetection === true:
- Show "Advanced Plagiarism Detection" section
- "Configure AI Detection" button

---

### Tab 5: Preview (renderAssignmentPreview - Lines 696-763)

**Section 5.1: Preview Card**

**Header:**
- Assignment title (large, centered)
- Meta: Subject • Grade • Points • Time

**Description:**
- Full description or "No description provided."

**Stats Grid** (4 stats):
1. 📝 Questions count
2. ⏱️ Time limit (minutes)
3. 🎯 Total points
4. 👥 Assignment type

**Enabled Features:**
- Conditional badges for:
  - 🤖 Auto Grading (if enabled)
  - 🔍 Plagiarism Detection (if enabled)
  - 📅 Late Submission (if enabled)

**Action:**
- "Create Assignment" button (large, primary)

---

## 💾 DATA FETCHING ANALYSIS

### Current State: ❌ NO REAL DATABASE QUERIES

#### Fake Query 1: Screen Initialization (Lines 181-191)
```typescript
const initializeScreen = useCallback(async () => {
  try {
    setIsLoading(true);
    // ❌ Simulate loading templates and settings
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
  } catch (error) {
    showSnackbar('Failed to load assignment creator');
    setIsLoading(false);
  }
}, []);
```

**Issue:** Fake 800ms delay, no actual data loading
**Required Query:**
```typescript
// Fetch teacher's assignment templates
const { data, error } = await supabase
  .from('assignment_templates')
  .select('*')
  .eq('teacher_id', teacherId);
```

---

#### Fake Query 2: Previous Assignments (Lines 325-329)
```typescript
const previousAssignments = [
  { id: '1', title: 'Algebra Basics Test', questionCount: 15, date: '2025-01-15' },
  { id: '2', title: 'Calculus Quiz', questionCount: 10, date: '2025-01-10' },
  { id: '3', title: 'Geometry Problems', questionCount: 20, date: '2025-01-05' },
];
```

**Issue:** Hardcoded array
**Required Query:**
```typescript
const { data: previousAssignments, error } = await supabase
  .from('assignments')
  .select('id, title, questions:questions(count)')
  .eq('teacher_id', teacherId)
  .order('created_at', { ascending: false })
  .limit(10);
```

---

#### Fake Mutation 1: Create Assignment (Lines 240-260)
```typescript
const handleCreateAssignment = () => {
  // ... validation
  Alert.alert(
    'Create Assignment',
    `Create "${assignment.title}" with ${assignment.questions.length} questions?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Create',
        onPress: () => {
          // ❌ Just shows alert, doesn't save
          Alert.alert('Assignment Created', 'Assignment has been created...');
          onNavigate('back');
        },
      },
    ]
  );
};
```

**Issue:** No database insertion
**Required Mutation:**
```typescript
const createAssignmentMutation = useMutation({
  mutationFn: async (assignment: Assignment) => {
    // Insert assignment
    const { data: newAssignment, error: assignmentError } = await supabase
      .from('assignments')
      .insert({
        teacher_id: teacherId,
        title: assignment.title,
        description: assignment.description,
        subject: assignment.subject,
        grade: assignment.grade,
        total_points: assignment.totalPoints,
        time_limit: assignment.timeLimit,
        due_date: assignment.dueDate,
        assignment_type: assignment.assignmentType,
        instructions: assignment.instructions,
        plagiarism_detection: assignment.plagiarismDetection,
        auto_grading: assignment.autoGrading,
        allow_late_submission: assignment.allowLateSubmission,
        max_attempts: assignment.maxAttempts,
        show_results_after: assignment.showResultsAfter,
      })
      .select()
      .single();

    if (assignmentError) throw assignmentError;

    // Insert questions
    const questionInserts = assignment.questions.map(q => ({
      assignment_id: newAssignment.id,
      type: q.type,
      question: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
      points: q.points,
      difficulty: q.difficulty,
      time_limit: q.timeLimit,
      explanation: q.explanation,
    }));

    const { error: questionsError } = await supabase
      .from('assignment_questions')
      .insert(questionInserts);

    if (questionsError) throw questionsError;

    return newAssignment;
  },
  onSuccess: (data) => {
    trackAction('create_assignment', 'AssignmentCreator', {
      assignmentId: data.id,
      questionCount: assignment.questions.length,
      totalPoints: assignment.totalPoints,
    });
    Alert.alert('Success', 'Assignment created successfully!');
    safeNavigate(navigation, 'TeacherDashboard');
  },
  onError: (error: Error) => {
    Alert.alert('Error', `Failed to create assignment: ${error.message}`);
  },
});
```

---

## 🧮 CALCULATIONS & BUSINESS LOGIC

### 1. Total Points Calculation (Lines 268-272)
**Location:** handleAddQuestion function
**Purpose:** Sum all question points when adding/removing questions
**Formula:**
```typescript
setAssignment(prev => ({
  ...prev,
  questions: [...prev.questions, newQuestion],
  totalPoints: prev.totalPoints + question.points, // Add points
}));
```
**Also used in:** handleRemoveQuestion (line 285 - subtract points)

---

### 2. Default Due Date Calculation (Line 119)
**Purpose:** Set default due date to 1 week from now
**Formula:**
```typescript
dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
```
**Math:**
- 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
- = 604,800,000 milliseconds
- = 1 week

---

### 3. Question ID Generation (Line 265)
**Purpose:** Generate unique ID for each question
**Formula:**
```typescript
id: `q_${Date.now()}`
```
**Issue:** Not guaranteed unique if multiple questions added within same millisecond
**Better approach:** Use UUID or database-generated ID

---

## 🔄 STATE MANAGEMENT

### Local State (13 variables)

#### 1. **isLoading** (boolean, default: true)
- Purpose: Show loading screen during initialization
- Updated by: initializeScreen function
- Used in: Conditional render (lines 782-793)

#### 2. **snackbarVisible** (boolean, default: false)
- Purpose: Control snackbar visibility
- Updated by: showSnackbar function
- Used in: Snackbar component (lines 812-823)

#### 3. **snackbarMessage** (string, default: '')
- Purpose: Snackbar content
- Updated by: showSnackbar function
- Used in: Snackbar component (line 821)

#### 4. **selectedTab** ('create' | 'templates' | 'rubrics' | 'settings' | 'preview')
- Default: 'create'
- Purpose: Control which tab content is shown
- Updated by: Tab button presses (line 407)
- Used in: Tab styling and renderTabContent switch

#### 5. **currentTime** (Date, default: new Date())
- Purpose: Display current time (updated every minute)
- Updated by: setInterval timer (line 234)
- Used in: Header time display

#### 6. **assignment** (Assignment object)
- Default: Complex object with all fields
- Purpose: Store assignment being created
- Updated by: Multiple handlers (title change, add question, settings toggles)
- Used in: All tabs for display and validation

#### 7. **selectedQuestionType** (Question['type'], default: 'mcq')
- Purpose: Track selected question type for creator modal
- Updated by: Question type selector
- Used in: Question creator modal

#### 8. **showQuestionCreator** (boolean, default: false)
- Purpose: Control question creator modal visibility
- Updated by: "Add Question" button (line 484)
- Used in: Modal rendering (not shown in file - placeholder)

#### 9. **showRubricCreator** (boolean, default: false)
- Purpose: Control rubric creator modal visibility
- Updated by: "Create Rubric" button (line 593)
- Used in: Modal rendering (not shown in file - placeholder)

#### 10. **templates** (AssignmentTemplate[], hardcoded)
- Default: 4 pre-built templates
- Purpose: Display template options
- Updated by: Never (const state)
- Used in: Templates tab (lines 540-561)

---

### Derived State: ❌ None
**Recommendation:** Add useMemo for:
```typescript
const questionTypeStats = useMemo(() => {
  return assignment.questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<Question['type'], number>);
}, [assignment.questions]);
```

---

## 🧭 NAVIGATION FLOWS

### Entry Points (How teachers arrive)
1. **From TeacherDashboard** → Tap "Assignment Creator" card
   - Method: onNavigate('assignment-creator')
2. **From Assignment List** → Tap "Create New" button
   - Method: onNavigate('assignment-creator')

---

### Exit Points (Where teachers can go)

#### 1. **Back to Previous Screen**
- Trigger: Back button in AppBar (line 366-379)
- Method: onNavigate('back')
- Guard: Unsaved changes alert (lines 367-375)
- Analytics: ❌ Not tracked

#### 2. **Question Bank Manager**
- Trigger: Import Questions → Question Bank (line 310)
- Method: onNavigate('question-bank')
- Analytics: ❌ Not tracked

#### 3. **Previous Assignments Selector**
- Trigger: Import Questions → Previous Assignment (line 317)
- Method: showPreviousAssignmentsModal() (inline modal)
- Analytics: ❌ Not tracked

#### 4. **After Create Assignment**
- Trigger: "Create Assignment" button success (line 255)
- Method: onNavigate('back')
- Analytics: ❌ Not tracked

---

### Back Navigation

**Hardware Back Button** (Lines 193-210)
```typescript
const setupBackHandler = useCallback(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    if (assignment.questions.length > 0 && !assignment.id) {
      // Show unsaved changes alert
      Alert.alert(
        'Unsaved Assignment',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => true },
          { text: 'Leave', style: 'destructive', onPress: () => { onNavigate('back'); return false; } },
        ]
      );
      return true; // Prevent default back
    }
    onNavigate('back');
    return true;
  });
  return backHandler;
}, [assignment.questions.length, assignment.id, onNavigate]);
```

**Features:**
- ✅ Unsaved changes guard
- ✅ Confirmation dialog
- ❌ No analytics tracking

---

## 👆 USER INTERACTIONS

### Interactive Elements (20+ total)

#### Tab Navigation (5 interactions)
1. **Create Tab Button** (line 407)
   - Action: setSelectedTab('create')
   - Tracking: ❌ None

2. **Templates Tab Button**
   - Action: setSelectedTab('templates')
   - Tracking: ❌ None

3. **Rubrics Tab Button**
   - Action: setSelectedTab('rubrics')
   - Tracking: ❌ None

4. **Settings Tab Button**
   - Action: setSelectedTab('settings')
   - Tracking: ❌ None

5. **Preview Tab Button**
   - Action: setSelectedTab('preview')
   - Tracking: ❌ None

---

#### Assignment Information Inputs (4 inputs)

6. **Title Input** (line 427-433)
   - Component: TextInput
   - Action: Update assignment.title
   - Validation: Required (checked in handleCreateAssignment)

7. **Description Input** (line 437-446)
   - Component: TextInput (multiline)
   - Action: Update assignment.description
   - Validation: Optional

8. **Subject Dropdown** (line 452-455)
   - Component: TouchableOpacity (styled as dropdown)
   - Action: Change subject
   - Issue: ❌ Not implemented (no onPress)

9. **Grade Dropdown** (line 460-463)
   - Component: TouchableOpacity (styled as dropdown)
   - Action: Change grade
   - Issue: ❌ Not implemented (no onPress)

---

#### Question Management (4 actions)

10. **Import Questions Button** (line 477)
    - Action: handleImportQuestions (lines 300-322)
    - Shows alert with 2 options:
      - Question Bank → onNavigate('question-bank')
      - Previous Assignment → showPreviousAssignmentsModal()
    - Tracking: ❌ None

11. **Add Question Button** (line 484)
    - Action: setShowQuestionCreator(true)
    - Opens question creator modal
    - Tracking: ❌ None

12. **Remove Question Button** (line 512)
    - Action: handleRemoveQuestion(questionId)
    - Removes question and updates totalPoints
    - Tracking: ❌ None

13. **Question Item Press**
    - Action: ❌ Not implemented (could edit question)

---

#### Template Actions (4 actions)

14. **Use Template Button** (line 557)
    - Action: handleUseTemplate(template)
    - Applies template settings to assignment
    - Shows success alert
    - Tracking: ❌ None

---

#### Settings Inputs (6 interactions)

15. **Time Limit Input** (line 609-615)
    - Component: TextInput (numeric)
    - Action: Update assignment.timeLimit
    - Validation: Converts to number or 0

16. **Assignment Type Selector** (line 624-637)
    - Component: TouchableOpacity
    - Action: Cycle through 3 types (individual → group → peer-review)
    - Visual: Shows icon and label

17. **Plagiarism Detection Switch** (line 645-650)
    - Component: Switch
    - Action: Toggle assignment.plagiarismDetection
    - Conditional: Shows "Configure AI Detection" button if ON

18. **Auto Grading Switch** (line 658-663)
    - Component: Switch
    - Action: Toggle assignment.autoGrading

19. **Late Submission Switch** (line 672-676)
    - Component: Switch
    - Action: Toggle assignment.allowLateSubmission

20. **Configure AI Detection Button** (line 684-689)
    - Action: handleAIPlagiarismSetup (lines 353-362)
    - Shows alert with plagiarism features
    - Tracking: ❌ None

---

#### Final Actions (2 actions)

21. **Create Assignment Button** (line 758)
    - Action: handleCreateAssignment (lines 240-260)
    - Validation: Requires title and at least 1 question
    - Confirmation dialog
    - Issue: ❌ Doesn't save to database
    - Tracking: ❌ None

22. **Save Draft Button** (AppBar, line 384-388)
    - Action: Show snackbar "Assignment draft saved"
    - Issue: ❌ Doesn't actually save
    - Tracking: ❌ None

---

## ⚠️ CONDITIONAL RENDERING

### 1. Loading State (Lines 782-793)
**Condition:** `isLoading === true`
**UI:**
```typescript
<View style={styles.loadingContainer}>
  <ActivityIndicator size="large" color={LightTheme.Primary} />
  <Text style={styles.loadingText}>Loading assignment creator...</Text>
</View>
```
**Trigger:** During initializeScreen() (800ms fake delay)

---

### 2. Empty Questions State (Lines 490-497)
**Condition:** `assignment.questions.length === 0`
**UI:**
```typescript
<View style={styles.emptyQuestions}>
  <Text style={styles.emptyQuestionsIcon}>📝</Text>
  <Text style={styles.emptyQuestionsTitle}>No Questions Added</Text>
  <Text style={styles.emptyQuestionsText}>
    Start by adding questions to your assignment. You can create various types including multiple choice, descriptive, and mathematical questions.
  </Text>
</View>
```
**Alternative:** Questions list (lines 499-527)

---

### 3. Questions List (Lines 499-527)
**Condition:** `assignment.questions.length > 0`
**UI:** Map through questions array, render question cards

---

### 4. MCQ Options Count (Lines 520-524)
**Condition:** `question.type === 'mcq' && question.options`
**UI:**
```typescript
<Text style={styles.questionOptions}>
  {question.options.length} options
</Text>
```

---

### 5. Plagiarism Settings Section (Lines 680-691)
**Condition:** `assignment.plagiarismDetection === true`
**UI:**
```typescript
<View style={styles.plagiarismSettings}>
  <Text style={styles.plagiarismTitle}>Advanced Plagiarism Detection</Text>
  <CoachingButton
    title="Configure AI Detection"
    variant="outline"
    size="small"
    onPress={handleAIPlagiarismSetup}
  />
</View>
```

---

### 6. Preview Enabled Features (Lines 742-751)
**Conditions:** Multiple feature flags
**UI:**
```typescript
{assignment.autoGrading && (
  <Text style={styles.previewFeature}>🤖 Auto Grading</Text>
)}
{assignment.plagiarismDetection && (
  <Text style={styles.previewFeature}>🔍 Plagiarism Detection</Text>
)}
{assignment.allowLateSubmission && (
  <Text style={styles.previewFeature}>📅 Late Submission</Text>
)}
```

---

### 7. Unsaved Changes Alert (Lines 195-204, 367-375)
**Condition:** `assignment.questions.length > 0 && !assignment.id`
**UI:** Alert dialog with Cancel/Leave options
**Triggers:**
- Hardware back button press
- AppBar back button press

---

## 🎨 STYLING PATTERNS

### StyleSheet Styles (85 styles defined)

#### Container Styles
```typescript
container: {
  flex: 1,
  backgroundColor: LightTheme.Background,
},
scrollView: {
  flex: 1,
},
scrollContent: {
  padding: Spacing.LG,
  paddingBottom: Spacing.XXL,
},
```

#### Tab Navigation Styles
```typescript
tabNavigation: {
  flexDirection: 'row',
  backgroundColor: LightTheme.Surface,
  borderRadius: BorderRadius.SM,
  padding: Spacing.XS,
  marginBottom: Spacing.LG,
  elevation: 1,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
},
activeTab: {
  backgroundColor: LightTheme.PrimaryContainer,
},
```

#### Input Styles
```typescript
textInput: {
  borderWidth: 1,
  borderColor: LightTheme.Outline,
  borderRadius: BorderRadius.SM,
  paddingHorizontal: Spacing.MD,
  paddingVertical: Spacing.SM,
  fontSize: Typography.bodyMedium.fontSize,
  color: LightTheme.OnSurface,
  backgroundColor: LightTheme.Surface,
},
textArea: {
  minHeight: 80,
  textAlignVertical: 'top',
},
```

### Theme Values Used
- **Colors:** LightTheme.Background, Primary, Surface, OnSurface, OnSurfaceVariant, Outline, PrimaryContainer, ErrorContainer
- **Spacing:** XS, SM, MD, LG, XL, XXL
- **Typography:** bodySmall, bodyMedium, bodyLarge, titleSmall, titleMedium, titleLarge
- **BorderRadius:** SM

### Hardcoded Colors
```typescript
// Line 365, 786, 788 - Should use theme.primary
backgroundColor: '#7C4DFF'
barStyle="light-content" backgroundColor="#7C4DFF"
```

### Dynamic Styles
```typescript
// Active tab highlighting
style={[
  styles.tabButton,
  selectedTab === tab.id && styles.activeTab
]}

// Question type badge colors
style={[
  styles.questionTypeBadge,
  { backgroundColor: questionTypeConfig[question.type].color }
]}
```

---

## ⚡ PERFORMANCE OPTIMIZATIONS

### Current Optimizations

#### 1. useCallback (4 functions)
```typescript
// Line 181
const initializeScreen = useCallback(async () => { ... }, []);

// Line 193
const setupBackHandler = useCallback(() => { ... }, [assignment.questions.length, assignment.id, onNavigate]);

// Line 212
const cleanup = useCallback(() => { ... }, []);

// Line 216
const showSnackbar = useCallback((message: string) => { ... }, []);
```

**Analysis:**
- ✅ Good use for event handlers
- ✅ Dependencies correctly specified
- ❌ Missing useCallback for other handlers (handleAddQuestion, handleRemoveQuestion, etc.)

---

### Missing Optimizations

#### 1. No useMemo for Calculations
**Recommendation:**
```typescript
// Calculate question type distribution
const questionTypeStats = useMemo(() => {
  return assignment.questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<Question['type'], number>);
}, [assignment.questions]);

// Calculate difficulty distribution
const difficultyStats = useMemo(() => {
  return assignment.questions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<Question['difficulty'], number>);
}, [assignment.questions]);
```

---

#### 2. No List Optimization
**Current:** Using .map() for questions list (line 500)
**Issue:** Not optimized for large lists (50+ questions)
**Recommendation:**
```typescript
// Replace with FlatList
<FlatList
  data={assignment.questions}
  keyExtractor={(item) => item.id}
  renderItem={({ item: question, index }) => (
    <QuestionCard question={question} index={index} />
  )}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={5}
/>
```

---

#### 3. No Component Memoization
**Recommendation:**
```typescript
// Memoize question card component
const QuestionCard = React.memo<{ question: Question; index: number }>(
  ({ question, index }) => {
    return (
      <View style={styles.questionItem}>
        {/* ... */}
      </View>
    );
  }
);
```

---

## 🐛 ERROR HANDLING

### Current Error Handling

#### 1. Try-Catch in initializeScreen (Lines 182-190)
```typescript
try {
  setIsLoading(true);
  await new Promise(resolve => setTimeout(resolve, 800));
  setIsLoading(false);
} catch (error) {
  showSnackbar('Failed to load assignment creator');
  setIsLoading(false);
}
```
**Coverage:** ✅ Basic error handling
**Issue:** Fake loading, no actual error scenarios

---

#### 2. Validation in handleCreateAssignment (Lines 241-243)
```typescript
if (!assignment.title || assignment.questions.length === 0) {
  Alert.alert('Incomplete Assignment', 'Please add a title and at least one question.');
  return;
}
```
**Coverage:** ✅ Basic validation
**Missing:**
- No validation for question content
- No validation for time limit > 0
- No validation for due date > now

---

### Missing Error Handling

#### 1. No Error Boundary
**Recommendation:**
```typescript
<ErrorBoundary>
  <AssignmentCreatorScreen />
</ErrorBoundary>
```

---

#### 2. No Query Error Handling
**Current:** No real queries
**Required:**
```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ['assignmentTemplates'],
  queryFn: fetchTemplates,
  onError: (error) => {
    showSnackbar(`Failed to load templates: ${error.message}`);
  },
});
```

---

#### 3. No Mutation Error Handling
**Required:**
```typescript
const createMutation = useMutation({
  mutationFn: createAssignment,
  onError: (error: Error) => {
    Alert.alert('Error', `Failed to create assignment: ${error.message}`);
  },
  onSuccess: () => {
    Alert.alert('Success', 'Assignment created successfully!');
  },
});
```

---

## 📊 ANALYTICS COVERAGE

### Current State: ❌ ZERO ANALYTICS

**Required Analytics Events:**

#### Screen View Tracking
```typescript
// Add to useEffect
useEffect(() => {
  trackScreenView('AssignmentCreator', { tab: selectedTab });
}, [selectedTab]);
```

---

#### Action Tracking (15+ actions needed)

1. **Tab Switching**
```typescript
trackAction('switch_tab', 'AssignmentCreator', { tab: 'templates' });
```

2. **Add Question**
```typescript
trackAction('add_question', 'AssignmentCreator', {
  questionType: question.type,
  points: question.points,
  difficulty: question.difficulty,
});
```

3. **Remove Question**
```typescript
trackAction('remove_question', 'AssignmentCreator', { questionId });
```

4. **Import Questions**
```typescript
trackAction('import_questions', 'AssignmentCreator', { source: 'question-bank' });
```

5. **Use Template**
```typescript
trackAction('use_template', 'AssignmentCreator', {
  templateId: template.id,
  templateName: template.name,
});
```

6. **Toggle Settings**
```typescript
trackAction('toggle_plagiarism_detection', 'AssignmentCreator', { enabled: value });
trackAction('toggle_auto_grading', 'AssignmentCreator', { enabled: value });
trackAction('toggle_late_submission', 'AssignmentCreator', { enabled: value });
```

7. **Create Assignment**
```typescript
trackAction('create_assignment', 'AssignmentCreator', {
  assignmentId: newAssignment.id,
  questionCount: assignment.questions.length,
  totalPoints: assignment.totalPoints,
  timeLimit: assignment.timeLimit,
  assignmentType: assignment.assignmentType,
  hasPlagiarismDetection: assignment.plagiarismDetection,
  hasAutoGrading: assignment.autoGrading,
});
```

8. **Save Draft**
```typescript
trackAction('save_draft', 'AssignmentCreator', {
  questionCount: assignment.questions.length,
});
```

---

## ♿ ACCESSIBILITY

### Coverage: ⭐ (Very Poor)

**Current State:**
- ❌ No accessibilityLabel on AppBar actions
- ❌ No accessibilityLabel on tab buttons
- ❌ No accessibilityLabel on form inputs
- ❌ No accessibilityLabel on switches
- ❌ No accessibilityHint on complex interactions
- ❌ No accessibilityRole definitions
- ❌ No keyboard navigation support

---

### Required Accessibility Improvements

#### 1. AppBar Actions (Lines 384-388)
```typescript
<Appbar.Action
  icon="content-save-outline"
  onPress={() => {...}}
  accessibilityLabel="Save assignment draft"
  accessibilityRole="button"
/>
```

---

#### 2. Tab Buttons (Lines 401-417)
```typescript
<TouchableOpacity
  accessibilityLabel={`${tab.title} tab`}
  accessibilityRole="button"
  accessibilityState={{ selected: selectedTab === tab.id }}
  {...}
>
```

---

#### 3. Form Inputs (Lines 427-446)
```typescript
<TextInput
  accessibilityLabel="Assignment title"
  accessibilityHint="Enter a descriptive title for this assignment"
  {...}
/>
```

---

#### 4. Switches (Lines 645-676)
```typescript
<Switch
  accessibilityLabel="Enable plagiarism detection"
  accessibilityRole="switch"
  accessibilityState={{ checked: assignment.plagiarismDetection }}
  {...}
/>
```

---

#### 5. Buttons
```typescript
<CoachingButton
  accessibilityLabel="Add new question to assignment"
  accessibilityRole="button"
  {...}
/>
```

---

## 📝 DOCUMENTATION QUALITY

### Header Documentation (Lines 1-15)
✅ **Excellent** - Comprehensive feature list:
```typescript
/**
 * AssignmentCreatorScreen - Phase 30.1 Advanced Assignment System
 * Comprehensive Assignment Creation with Multi-format Questions
 *
 * Features:
 * - Multi-format question support (MCQ, descriptive, mathematical)
 * - Rubric-based grading system
 * - Automated plagiarism detection
 * - Group assignment management
 * - Deadline and reminder automation
 * - AI-assisted grading for objective questions
 * - Bulk grading interface with batch operations
 * - Personalized feedback templates
 * - Grade analytics and distribution analysis
 */
```

---

### Inline Comments
- ❌ Very few inline comments
- ❌ No JSDoc for functions
- ❌ No interface documentation

---

### TODOs/FIXMEs
- ❌ None found
- ⚠️ Should add TODOs for missing implementations (dropdowns, modals, etc.)

---

### Type Documentation
✅ **Good** - Well-defined interfaces:
- `AssignmentCreatorScreenProps`
- `Question` (comprehensive)
- `RubricCriteria`
- `Assignment` (comprehensive)
- `AssignmentTemplate`

---

## ✅ STRENGTHS

1. ✅ **Comprehensive UI** - 5-tab interface with all features
2. ✅ **Well-structured code** - Clear separation of concerns
3. ✅ **Good TypeScript typing** - Strong type definitions
4. ✅ **Unsaved changes guard** - Prevents accidental data loss
5. ✅ **Template system** - Pre-built assignment templates
6. ✅ **Question type variety** - 10 different question types
7. ✅ **Settings flexibility** - Many configurable options
8. ✅ **Preview before create** - See assignment before finalizing
9. ✅ **Good styling** - Consistent use of theme values
10. ✅ **Empty states** - User-friendly empty question list

---

## 🎯 RECREATION CHECKLIST

When recreating this screen, ensure you include:

### Data Layer
- [ ] Teacher profile query (fetch teacherId from Supabase)
- [ ] Assignment templates query (from database or keep as defaults)
- [ ] Previous assignments query (for import feature)
- [ ] Create assignment mutation (insert to assignments table)
- [ ] Insert questions mutation (insert to assignment_questions table)
- [ ] Question bank integration (import from question_bank table)

### UI Components (All 5 Tabs)
- [ ] Tab 1: Create
  - [ ] Assignment information card (4 inputs)
  - [ ] Questions card (empty state + list)
- [ ] Tab 2: Templates (4 template cards)
- [ ] Tab 3: Rubrics (rubric creator)
- [ ] Tab 4: Settings (5 settings)
- [ ] Tab 5: Preview (full preview with stats)

### Navigation
- [ ] Replace onNavigate with useNavigation hook
- [ ] Add React Navigation types
- [ ] Use safeNavigate for all navigation
- [ ] Keep unsaved changes guard

### Analytics
- [ ] Screen view tracking (per tab)
- [ ] Tab switch tracking
- [ ] Add question tracking
- [ ] Remove question tracking
- [ ] Import questions tracking
- [ ] Use template tracking
- [ ] Toggle settings tracking
- [ ] Create assignment tracking
- [ ] Save draft tracking

### Accessibility
- [ ] All buttons have accessibilityLabel
- [ ] All tabs have accessibilityLabel + accessibilityState
- [ ] All inputs have accessibilityLabel + accessibilityHint
- [ ] All switches have accessibilityLabel + accessibilityRole
- [ ] Touch targets ≥ 48dp

### State Management
- [ ] All 13 state variables
- [ ] Add useMemo for calculations
- [ ] Add useCallback for all handlers

### Error Handling
- [ ] BaseScreen wrapper for loading/error/empty states
- [ ] Query error handling
- [ ] Mutation error handling
- [ ] Validation for all inputs
- [ ] Error boundary

### Performance
- [ ] Memoize handlers with useCallback
- [ ] Memoize calculations with useMemo
- [ ] Memoize question cards with React.memo
- [ ] Use FlatList for questions (if > 10)

### Features to Preserve
- [ ] 10 question types support
- [ ] 4 assignment templates
- [ ] Rubric management system
- [ ] Plagiarism detection settings
- [ ] Auto grading toggle
- [ ] Late submission toggle
- [ ] Assignment type selector (individual/group/peer-review)
- [ ] Time limit input
- [ ] Subject/Grade selectors
- [ ] Import questions feature
- [ ] Preview tab
- [ ] Unsaved changes alert

---

## 📦 DATABASE SCHEMA REQUIREMENTS

### Tables Needed

#### 1. assignments
```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id),
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  grade TEXT,
  total_points INTEGER,
  time_limit INTEGER, -- minutes
  due_date TIMESTAMPTZ,
  assignment_type TEXT CHECK (assignment_type IN ('individual', 'group', 'peer-review')),
  instructions TEXT,
  resources TEXT[], -- Array of resource URLs
  plagiarism_detection BOOLEAN DEFAULT true,
  auto_grading BOOLEAN DEFAULT true,
  allow_late_submission BOOLEAN DEFAULT false,
  max_attempts INTEGER DEFAULT 1,
  show_results_after TEXT CHECK (show_results_after IN ('immediately', 'due-date', 'manual')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. assignment_questions
```sql
CREATE TABLE assignment_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('mcq', 'descriptive', 'mathematical', 'true-false', 'fill-blank', 'matching', 'essay', 'numerical', 'code', 'diagram')),
  question TEXT NOT NULL,
  options TEXT[], -- For MCQ
  correct_answer TEXT,
  points INTEGER NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_limit INTEGER, -- minutes
  explanation TEXT,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. assignment_templates (Optional)
```sql
CREATE TABLE assignment_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id), -- NULL for global templates
  name TEXT NOT NULL,
  description TEXT,
  question_types TEXT[],
  estimated_time INTEGER, -- minutes
  is_global BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. rubric_criteria (For rubrics tab)
```sql
CREATE TABLE rubric_criteria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES assignment_questions(id) ON DELETE CASCADE,
  criterion TEXT NOT NULL,
  description TEXT,
  max_points INTEGER NOT NULL,
  levels JSONB, -- Array of { level, points, description }
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 💡 RECOMMENDATIONS FOR RECREATION

### Must Have (Critical)
1. ✅ Replace all mock data with real Supabase queries
2. ✅ Replace onNavigate with React Navigation
3. ✅ Add BaseScreen wrapper
4. ✅ Add complete analytics tracking
5. ✅ Add all accessibility labels
6. ✅ Implement create assignment mutation
7. ✅ Add teacher profile fetch

### Should Have (Important)
1. ✅ Implement question creator modal
2. ✅ Implement rubric creator modal
3. ✅ Add error boundaries
4. ✅ Add input validation
5. ✅ Optimize with useMemo/useCallback
6. ✅ Use FlatList for questions
7. ✅ Add keyboard navigation

### Nice to Have (Enhancements)
1. ⭐ Real-time collaboration (multiple teachers)
2. ⭐ AI question generation
3. ⭐ Drag-and-drop question reordering
4. ⭐ Rich text editor for questions
5. ⭐ Image upload for diagram questions
6. ⭐ Question difficulty AI suggestions
7. ⭐ Assignment scheduling
8. ⭐ Duplicate assignment feature
9. ⭐ Export assignment to PDF

---

## 📄 COMPLETE FEATURE LIST

### Tab 1: Create Assignment (15 features)
- [ ] Assignment title input (required)
- [ ] Assignment description textarea
- [ ] Subject dropdown selector
- [ ] Grade dropdown selector
- [ ] Questions list display
- [ ] Empty questions state
- [ ] Add question button
- [ ] Import questions button (2 sources)
- [ ] Remove question button
- [ ] Question type badge display
- [ ] Question points display
- [ ] Total points calculation
- [ ] Question number display
- [ ] MCQ options count display
- [ ] Question text preview

### Tab 2: Templates (5 features)
- [ ] 4 pre-built templates
- [ ] Template name and description
- [ ] Estimated time display
- [ ] Question types icons
- [ ] Use template button

### Tab 3: Rubrics (4 features)
- [ ] Rubric creator card
- [ ] 3 rubric features display
- [ ] Create rubric button
- [ ] Rubric modal (to be implemented)

### Tab 4: Settings (8 features)
- [ ] Time limit numeric input
- [ ] Assignment type selector (3 options)
- [ ] Plagiarism detection toggle
- [ ] Auto grading toggle
- [ ] Late submission toggle
- [ ] Configure AI detection button
- [ ] Conditional plagiarism settings
- [ ] Max attempts setting (not shown in UI)

### Tab 5: Preview (9 features)
- [ ] Assignment title display
- [ ] Assignment meta display
- [ ] Description display
- [ ] 4 stats cards (questions, time, points, type)
- [ ] Enabled features badges
- [ ] Conditional feature display
- [ ] Create assignment button
- [ ] Validation before create
- [ ] Success/error feedback

### Global Features (10 features)
- [ ] AppBar with title and actions
- [ ] Tab navigation (5 tabs)
- [ ] Active tab highlighting
- [ ] Loading state
- [ ] Snackbar notifications
- [ ] Unsaved changes guard
- [ ] Hardware back button handling
- [ ] Current time display
- [ ] Save draft button
- [ ] Scroll view for all content

---

## 🔧 FIXES REQUIRED

### Critical Fixes (8 items)
1. Replace setTimeout with real Supabase queries
2. Replace mock previous assignments with database query
3. Replace onNavigate with React Navigation
4. Add BaseScreen wrapper
5. Implement create assignment mutation
6. Add analytics tracking (15+ events)
7. Add accessibility labels (30+ elements)
8. Add teacher profile fetch

### Medium Fixes (5 items)
1. Implement subject dropdown functionality
2. Implement grade dropdown functionality
3. Implement question creator modal
4. Implement rubric creator modal
5. Add error boundaries

### Low Fixes (3 items)
1. Replace hardcoded #7C4DFF with theme.primary
2. Add loading states for actions
3. Fix current time timer cleanup

---

## 📊 METRICS

### Code Quality
- **Lines of Code:** 1333
- **TypeScript Errors:** 0 (assumed)
- **Components:** 2 (CoachingButton, DashboardCard)
- **Interfaces:** 5 (Props, Question, RubricCriteria, Assignment, AssignmentTemplate)
- **State Variables:** 13
- **Handlers:** 10+
- **Styles:** 85

### Features
- **Total Features:** 56+
- **Interactive Elements:** 20+
- **Tabs:** 5
- **Question Types:** 10
- **Templates:** 4
- **Settings:** 5
- **Conditional Renders:** 7

### Coverage
- **Data Fetching:** ❌ 0% (all fake)
- **Analytics:** ❌ 0%
- **Accessibility:** ❌ ~5% (only partial)
- **Error Handling:** 🟡 30% (basic validation only)
- **Performance:** 🟡 40% (some useCallback, no useMemo/FlatList)

---

## ✅ SIGN-OFF

**Analysis Complete!** ✅

**Screen:** AssignmentCreatorScreen.tsx
**Status:** Ready for recreation
**Priority:** High (critical teacher feature)

**Key Takeaways:**
1. **Well-designed UI** with comprehensive features
2. **Zero database integration** - everything is fake/hardcoded
3. **Missing all modern patterns** - no BaseScreen, analytics, accessibility
4. **Good foundation** - strong TypeScript types and UI structure
5. **Requires significant work** - ~8 critical fixes needed

**Estimated Recreation Time:** 4-6 hours
- Data layer: 2 hours (queries + mutations)
- Analytics: 30 minutes (15+ events)
- Accessibility: 30 minutes (30+ labels)
- Navigation: 30 minutes (React Navigation integration)
- Testing: 1-2 hours (real device testing)

**Ready for `screen-recreator` skill!** 🚀

# Teacher Management App - Screens 16-20 Implementation Guide

## Overview

This guide provides complete specifications for implementing screens 16-20 of the Teacher Management App in Framer.

**Note:** Screen 15 does not exist in the specifications. The document jumps from Screen 14 (Attendance) directly to Screen 16 (Create Class).

## Design System

- **Primary Color:** `#5B47FB`
- **Success Color:** `#10B981`
- **Error Color:** `#EF4444`
- **Background:** `#F9FAFB`
- **Typography:** Inter font family
- **Border Radius:** 12-16px for cards, 8px for inputs
- **Mobile Viewport:** 390×844px
- **Touch Targets:** Minimum 48×48px

---

## Screen 16: Create Class

**Purpose:** Full-featured class creation wizard for teachers to set up new classes/batches.

### Sections (A-I):

#### A. Class Information
- **Class/Batch Name** (required, max 80 chars)
  - Input field with helper text
  - Character counter
- **Class Type Selector** (segmented control)
  - Options: K-12, JEE, NEET, Foundation, Skill, Custom
- **Grade Level Dropdown**
  - Conditional options based on class type
  - Grade 1-12 for K-12
  - Year 1/2 for JEE/NEET
- **Subject Selection** (multi-select chips)
  - Pre-defined: Math, Physics, Chemistry, Biology, English, Hindi, Social Science, Commerce
  - Custom subject input option
  - Chips animate on selection (scale 0.95 → 1)

#### B. Teaching Mode & Location
- **Mode Selector** (3 card-style buttons)
  - Online 💻
  - Offline 🏫
  - Hybrid 🔄
- **Conditional Fields:**
  - If Offline/Hybrid: Location input, Room/Area input
  - If Online/Hybrid: Meeting link input (auto-generate or custom)

#### C. Teaching Languages
- **Multi-select Checkboxes:**
  - English, Hindi, Hinglish, Other (custom input)

#### D. Schedule Setup (Timetable)
- **Add Session Button** (opens modal)
- **Session Cards List** (animated layout)
  - Days of week + Time range
  - Location/Room info
  - Edit/Delete actions
- **Add Session Modal:**
  - Days selector (Mon-Sun chips)
  - Start/End time pickers
  - Repeat weekly toggle
  - Location (Online/Offline/Room)
  - Collision detection (shake animation + red border)

#### E. Student Admission Mode
- **Radio Group:**
  1. Add manually (teacher adds students)
  2. Allow join-code enrollment
  3. Institute-managed enrollment
- **Join Code Card** (if selected)
  - Auto-generated 6-char code
  - Odometer-style number animation
  - Regenerate button
  - Valid for 7 days indicator

#### F. Co-Teachers (Optional)
- **Search Teacher Interface**
  - Search bar
  - Teacher list with avatars
  - Role assignment: Primary/Assistant/Observer
- **Co-Teacher Chips**
  - Avatar + Name + Role
  - Remove button (×)
  - Fade-in animation on add

#### G. Class Branding (Optional)
- **Cover Image Upload**
  - 16:9 aspect ratio
  - Preset templates (Math, Science, JEE, NEET)
- **Theme Color Picker**
  - Blue, Green, Purple, Orange
  - Custom hex (admin only)
  - Selected indicator (checkmark + border)

#### H. Advanced Settings
- **Toggle Rows** (6 settings)
  1. Allow students to chat
  2. Allow file uploads
  3. Allow student-to-student replies
  4. AI-Generated Homework Recommendations
  5. Attendance auto-reminders
  6. Auto-record sessions
- Each toggle:
  - Title + Description
  - Switch animation (slide left/right)
  - Help icon (?)

#### I. Review & Create
- **Summary Card**
  - All entered data in label: value format
  - Bordered container with gray background
- **Create Button**
  - Disabled until form valid
  - Pulse animation when valid
  - Loading spinner on press
  - Success animation: green checkmark fill (0.5s)

### Micro-Interactions:
- Chips scale on tap (0.95 → 1)
- Session delete: slide left collapse
- Join code: odometer animation
- Schedule collision: shake + red border
- Save button: pulse when form valid
- Success: rotating checkmark modal

### States:
1. **Empty** - All fields blank
2. **Partial** - Save button disabled
3. **Valid** - Save button enabled and pulsing
4. **Saving** - Spinner in button
5. **Success** - Full-screen success modal

### Validation:
- Class name: required, 3-80 chars
- Subjects: at least 1 required
- Sessions: at least 1 required
- Time validation: end > start
- Collision detection for overlapping sessions

---

## Screen 17: Class Settings / Edit Class

**Purpose:** Edit existing class details. Same UI as Screen 16 but:

### Differences from Screen 16:
- Header says "Edit Class" instead of "Create Class"
- Save button always enabled (changes detected)
- Pre-populated with existing data
- "Delete Class" button at bottom (danger zone)
- "Archive Class" option in overflow menu
- Cannot change class type once created
- Can add/remove students from within this screen
- Shows "Last updated" timestamp

### Additional Features:
- **Change History** section
  - Shows recent modifications
  - Who made changes (if co-teacher)
  - Timestamp
- **Danger Zone** at bottom
  - Archive class (soft delete)
  - Delete permanently (requires confirmation)
  - Transfer ownership

### Implementation:
Reuse Screen 16 component with:
```typescript
<CreateClassScreen mode="edit" classId="123" initialData={existingClass} />
```

---

## Screen 18: Assignments List (Class Assignments Overview)

**Purpose:** View all assignments for a class with filtering, sorting, and quick actions.

### Header:
- **Back arrow** (left)
- **Title:** "Assignments" (center)
- **Subtitle:** "Class 10 – Mathematics (11 assignments)"
- **Actions:** Filter icon, Add (+) icon (right)

### Section A: Search & Filter Row
- **Search Bar** (48px height)
  - Placeholder: "Search assignments..."
  - Auto-suggestions: assignment names, topics
- **Filter Chips** (horizontal scrollable)
  - All, Active, Due Soon, Overdue, Completed, Drafts, Published
  - By subject, By difficulty
  - Active chip: primary blue bg, white text

### Section B: Assignment Cards List

Each card contains:

#### Top Row
- Subject badge (left) - colored icon
- 3-dot menu (right)
  - Edit assignment
  - Duplicate assignment
  - Close submission
  - Archive assignment
  - Delete (admin only)

#### Title
- 18px semi-bold, 2-line max
- Examples: "Algebra Worksheet #4 — Linear Equations"

#### Metadata Row
- 📅 Due date: "Due: 23 Jan, 6:00 PM"
- 🏷️ Topic/Chapter
- 📝 Assigned on date
- ⏳ Time to complete (optional)
- **Status badges:** Published/Draft, Difficulty (Easy/Medium/Hard)

#### Progress Bar
- X/Y students submitted
- Color-coded:
  - Green: >70% submission
  - Yellow: 40-70%
  - Red: <40%
- "Review Submissions" CTA

#### Quick Stats
- Average score (if graded)
- Pending: X
- Graded: Y
- Late: Z

#### Action Buttons
- "Review Submissions" (primary)
- "Grade Now" (if submissions pending)

### States:
- **Loading:** 6 skeleton cards
- **Empty:** "No assignments yet. Create your first assignment!" + illustration
- **Error:** Red banner with retry
- **Offline:** Cached assignments with offline badge

### Modals:
- Assignment Details modal
- Create/Edit Assignment
- Duplicate confirmation
- Close submission confirmation
- Delete/Archive confirmation
- Filter sheet (bottom drawer)
- Sort sheet

### Interactions:
- Card tap → Assignment Details (Screen 20)
- Progress bar tap → Submissions list
- Long press → Checkbox mode for bulk actions
- Pull-to-refresh
- Infinite scroll

### Bulk Actions (multi-select mode):
- Checkboxes on each card
- Top bar actions: Publish, Archive, Delete

---

## Screen 19: Create Assignment (Full Creation Flow)

**Purpose:** Comprehensive assignment creation with multiple question types.

### Header:
- Close (×) - left
- "Create Assignment" - center
- Save (disabled until valid) - right

### Sections:

#### A. Basic Details
- **Assignment Title** (required)
  - Input field, max 100 chars
- **Subject** (dropdown or chips)
- **Topic/Chapter** (searchable dropdown)
- **Class Selection** (if multi-class teacher)
- **Description** (rich text editor)
  - Supports: bold, italic, bullets, numbers
  - Image upload
  - Math equation support

#### B. Assignment Type
- **Radio selector:**
  - Homework (default)
  - Classwork
  - Practice Test
  - Quiz
  - Project

#### C. Difficulty & Duration
- **Difficulty Chips:** Easy, Medium, Hard
- **Expected Time:** Number input + unit (mins/hours)
- **Total Marks:** Number input

#### D. Schedule
- **Assigned On:** Date picker (default: today)
- **Due Date & Time:** Date + time picker
  - Color indicator based on urgency
- **Late Submission:**
  - Toggle: Allow/Disallow
  - If allowed: Late penalty % input
  - Cut-off date

#### E. Questions Section
- **Add Question Button** (opens question editor)
- **Question Types:**
  1. MCQ (Multiple Choice)
  2. True/False
  3. Short Answer (text)
  4. Long Answer (paragraph)
  5. Numerical
  6. File Upload
- **Question Cards:**
  - Question number
  - Question text (rich text)
  - Options (for MCQ)
  - Correct answer (green indicator)
  - Marks allocation
  - Edit/Duplicate/Delete actions
  - Drag handle for reordering

#### F. Attachments
- **File Upload Area**
  - PDF, DOC, images
  - Drag-and-drop
  - File cards with preview thumbnails
  - Size limits shown

#### G. Instructions
- **Rich text editor**
  - Custom instructions for students
  - Examples: "Write in own words", "Show working"

#### H. Publishing Settings
- **Visibility:**
  - Draft (save for later)
  - Schedule (future date)
  - Publish immediately
- **Notify Students:** Toggle
- **Allow Comments:** Toggle
- **Show Correct Answers:** Radio (Never, After submission, After due date)

#### I. Advanced Settings
- **Attempts Allowed:** 1, 2, 3, Unlimited
- **Shuffle Questions:** Toggle
- **Shuffle Options:** Toggle (for MCQs)
- **Auto-grade:** Toggle (for MCQs/Numerical)
- **Plagiarism Check:** Toggle
- **Time Limit:** Toggle + duration input

### Modals:
- **Question Editor Modal** (full screen)
  - Question type selector at top
  - Question text input (rich text)
  - For MCQ: Add options (A, B, C, D) + mark correct
  - For Numerical: Expected value + tolerance
  - Marks input
  - Save/Cancel
- **Attachment Preview Modal**
- **Schedule Picker Modal**

### Micro-Interactions:
- Question cards: expand/collapse animation
- Drag-to-reorder: lift effect + drop zone indicator
- Add question: slide up from bottom
- Auto-save indicator (cloud icon with animation)
- Character count for text inputs
- File upload: progress bar

### Validation:
- Title required
- At least 1 question required
- Due date must be future
- All questions must have marks
- MCQs must have correct answer selected

---

## Screen 20: Assignment Details (Teacher View)

**Purpose:** Control center for managing a specific assignment after creation.

### Header:
- Back arrow (left)
- Assignment title (center, truncated if long)
- Overflow menu (right)
  - Edit Assignment
  - Duplicate
  - Close Submission
  - Extend Deadline
  - Archive
  - Delete (admin)
  - Download All Submissions

### Subtitle Breadcrumb:
"Class 10 • Mathematics • Algebra"

### Section A: Assignment Overview Header Card

Large hero card with:
- Assignment name (24px bold)
- Tags: Subject chip, Topic chip, Difficulty chip, Status chip (Published/Draft/Scheduled/Closed)
- Due info row:
  - 📅 Due Date
  - 🕒 Time
  - ⏳ Time remaining or "Overdue" (color-coded: green >24h, orange <24h, red overdue)
- Submission progress visual bar:
  - Submitted: X (green)
  - Pending: Y (yellow)
  - Not attempted: Z (gray)
- Quick action buttons (3):
  - Review All
  - Edit
  - Message Students

### Section B: Tab Bar (Sticky)

6 tabs with underline indicator:
1. Overview
2. Questions
3. Submissions
4. Stats
5. Late & Missing
6. Settings

---

### TAB 1: Overview

#### B1.1 Assignment Description
- Rich-text formatted description
- Images, math equations
- Attachments preview cards
  - PDF thumbnail
  - File name + size
  - Preview/Download buttons

#### B1.2 Instructions
- Bullet list of teacher-defined instructions

#### B1.3 Key Parameters Table
- Total Marks
- Difficulty
- Questions count
- Due date
- Late submission allowed (Yes/No)
- Attempts allowed
- Time required

---

### TAB 2: Questions

#### B2.1 Expand/Collapse All Buttons
Located at top of tab

#### B2.2 Questions List
For each question:
- **Header:** Q1, Q2, Q3 + Type chip (MCQ/Numerical/Descriptive/Upload)
- **Body:** Question text (rich formatting), images, math formulas
- **Options (if MCQ):** A, B, C, D with green check for correct answer
- **Answer Key:** Expected keywords, numeric value, accepted ranges
- **Marks:** "4 marks" displayed
- **Actions per question:** Edit, Duplicate, Delete, Preview

---

### TAB 3: Student Submissions (Biggest Section)

#### B3.1 Search & Filters
- Search bar: "Search students..."
- Filter chips: All, Submitted, Pending, Graded, Not Graded, Late

#### B3.2 Student Submission Cards

Each card:
- **Student Info:**
  - Avatar + Name
  - Roll number
  - Submission status badge (Submitted/Pending/Late)
- **Submission Details:**
  - Submitted on: Date + Time
  - Time taken (if tracked)
  - Late indicator (if applicable)
- **Score Display:**
  - Current score: X/Y
  - Auto-graded score (if applicable)
  - Manual grading required badge
- **Actions:**
  - "View Submission" button (primary)
  - "Grade Now" button (if ungraded)

#### B3.3 Sort Options
- By name (A-Z)
- By submission time (earliest/latest)
- By score (high to low)
- By status

#### B3.4 Bulk Actions (multi-select)
- Send message
- Extend deadline
- Mark as graded
- Download all

---

### TAB 4: Stats

#### Analytics Cards:

1. **Submission Rate**
   - Circular progress chart
   - X% submitted
   - Breakdown: Submitted, Pending, Not attempted

2. **Average Score**
   - Large number display
   - Out of total marks
   - Trend indicator (up/down arrow)

3. **Score Distribution**
   - Histogram chart
   - Ranges: 0-20%, 20-40%, 40-60%, 60-80%, 80-100%

4. **Time Analysis**
   - Average time taken
   - Fastest/Slowest submission

5. **Question-wise Performance**
   - List showing each question
   - % of students who got it right
   - Color-coded bars

6. **Late Submissions**
   - Count + percentage
   - List of late students

#### Export Options:
- Download as PDF
- Download as Excel
- Share report

---

### TAB 5: Late & Missing

#### Two Lists:

**Late Submissions (Orange section)**
- Student cards with:
  - Name + Avatar
  - Submitted on (with late badge)
  - Days/hours late
  - Penalty applied (if any)
  - "View Submission" action

**Not Submitted (Red section)**
- Student cards with:
  - Name + Avatar
  - "Not submitted" badge
  - Days overdue
  - Last seen/activity indicator
  - Actions:
    - Send reminder
    - Extend deadline (individual)
    - Contact parent

#### Bulk Actions:
- Send reminder to all
- Extend deadline for selected
- Message parents

---

### TAB 6: Settings

Editable assignment settings:

#### General Settings
- Assignment title (editable)
- Description (editable)
- Due date & time (editable)
- Late submission policy (toggle + penalty)

#### Question Settings
- Add/Remove questions
- Edit marks allocation
- Reorder questions

#### Visibility Settings
- Published/Draft toggle
- Show correct answers: Radio (Never/After submission/After due date)
- Allow comments: Toggle

#### Advanced
- Attempts allowed (1/2/3/Unlimited)
- Shuffle questions: Toggle
- Auto-grade: Toggle
- Time limit: Toggle + input

#### Notifications
- Notify on submission: Toggle
- Reminder frequency: Dropdown (None/Daily/Weekly)

---

## Component Library (Reusable Across All Screens)

### 1. Form Components
- `InputField` - Text input with label, helper text, character count
- `SelectField` - Dropdown with search
- `ChipSelector` - Multi-select chips with custom input
- `SegmentedControl` - Button group selector
- `RadioGroup` - Radio buttons with labels
- `Toggle` - Animated switch
- `DatePicker` - Calendar modal
- `TimePicker` - Time selection modal
- `RichTextEditor` - WYSIWYG editor

### 2. Card Components
- `SectionCard` - Container with icon + title
- `StudentCard` - Avatar + name + metadata
- `AssignmentCard` - Full assignment preview
- `SubmissionCard` - Student submission preview
- `SessionCard` - Schedule session display
- `SummaryCard` - Key-value data display

### 3. Navigation Components
- `TabBar` - Horizontal tabs with indicator
- `FilterChips` - Scrollable filter row
- `Breadcrumb` - Navigation path

### 4. Feedback Components
- `ProgressBar` - Linear progress indicator
- `CircularProgress` - Circular progress chart
- `SkeletonLoader` - Loading placeholder
- `EmptyState` - No data illustration + message
- `ErrorBanner` - Error message banner
- `SuccessModal` - Success confirmation overlay
- `Toast` - Brief notification

### 5. Data Display
- `StatCard` - Metric card with icon
- `Chart` - Bar/Line/Pie charts
- `Badge` - Status indicator
- `Avatar` - User image/initial
- `FilePreview` - Document thumbnail

### 6. Action Components
- `FAB` - Floating action button
- `IconButton` - Icon-only button
- `PrimaryButton` - Main CTA
- `SecondaryButton` - Secondary action
- `DangerButton` - Destructive action

---

## Framer-Specific Implementation Notes

### Property Controls
Add to each component:

```typescript
addPropertyControls(ComponentName, {
  // Data
  data: { type: ControlType.Object },

  // States
  loading: { type: ControlType.Boolean, defaultValue: false },
  error: { type: ControlType.String },
  empty: { type: ControlType.Boolean, defaultValue: false },

  // Callbacks
  onSave: { type: ControlType.EventHandler },
  onCancel: { type: ControlType.EventHandler },
  onDelete: { type: ControlType.EventHandler },

  // Theming
  primaryColor: { type: ControlType.Color, defaultValue: "#5B47FB" },
  themeMode: { type: ControlType.Enum, options: ["light", "dark"] },
})
```

### Animations
Use Framer Motion variants:

```typescript
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -100, transition: { duration: 0.2 } },
}

const listVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}
```

### Responsive Breakpoints
```typescript
const breakpoints = {
  mobile: 390,
  tablet: 768,
  desktop: 1024,
}

// Use like:
width: window.innerWidth < breakpoints.tablet ? "100%" : "50%"
```

### Accessibility
Every interactive element must have:
- `aria-label` for icon buttons
- `role` attribute where appropriate
- Keyboard navigation support
- Focus indicators (2px outline)
- Minimum 48×48px touch targets
- WCAG AA contrast ratios (4.5:1 text, 3:1 UI)

---

## File Structure

```
framer-screens/
├── Screen16-CreateClass.tsx (✅ Created - 1400+ lines)
├── Screen17-EditClass.tsx (reuses Screen16 with mode prop)
├── Screen18-AssignmentsList.tsx
├── Screen19-CreateAssignment.tsx
├── Screen20-AssignmentDetails.tsx
├── components/
│   ├── forms/
│   │   ├── InputField.tsx
│   │   ├── ChipSelector.tsx
│   │   ├── SegmentedControl.tsx
│   │   └── ...
│   ├── cards/
│   │   ├── AssignmentCard.tsx
│   │   ├── SubmissionCard.tsx
│   │   └── ...
│   ├── navigation/
│   │   ├── TabBar.tsx
│   │   ├── FilterChips.tsx
│   │   └── ...
│   └── feedback/
│       ├── ProgressBar.tsx
│       ├── SuccessModal.tsx
│       └── ...
├── utils/
│   ├── animations.ts (Framer Motion variants)
│   ├── validation.ts (Form validation schemas)
│   └── helpers.ts
├── types/
│   ├── class.types.ts
│   ├── assignment.types.ts
│   └── student.types.ts
└── styles/
    ├── theme.ts (colors, spacing, typography)
    └── globalStyles.ts
```

---

## Next Steps

1. ✅ Screen 16 (Create Class) - **COMPLETED** - Full TypeScript component created
2. Create Screen 17 (Edit Class) - Reuse Screen 16 with `mode="edit"` prop
3. Create Screen 18 (Assignments List) - Assignment cards with filters
4. Create Screen 19 (Create Assignment) - Question builder interface
5. Create Screen 20 (Assignment Details) - Tabbed detail view
6. Extract reusable components into `components/` directory
7. Add Framer property controls to each component
8. Test all animations and interactions
9. Verify accessibility compliance
10. Create component variants for different states

---

## Important Notes

- **Screen 15 does NOT exist** - Skip from 14 to 16
- All screens must handle **loading**, **error**, and **empty states**
- Use **real data schemas** - no hardcoded mock data
- All forms must have **validation** with clear error messages
- **Auto-save** for long forms (every 30 seconds)
- Support **offline mode** with cached data
- Include **analytics tracking** for all major actions
- Follow **Material Design** principles for mobile interactions
- Optimize for **performance** - lazy load heavy components

---

## Testing Checklist

For each screen:
- [ ] Renders correctly on 390×844px viewport
- [ ] All animations run smoothly (60fps)
- [ ] Form validation works correctly
- [ ] Error states display properly
- [ ] Empty states show helpful messages
- [ ] Loading states use skeleton loaders
- [ ] All buttons have proper labels
- [ ] Touch targets are minimum 48×48px
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader announces content correctly
- [ ] Works offline (with cached data)
- [ ] Auto-save functions properly (if applicable)
- [ ] Modals close on backdrop click
- [ ] Back button behaves correctly

---

## Resources

- **Design Specs:** `C:\PC\Teahcer_screens` (lines 6167-8500+)
- **User Stories:** `C:\PC\Teacher_NEW_User_story`
- **Wireframes:** `C:\PC\Teaher_Wireframe`
- **Component Code:** `C:\PC\framer-screens\Screen16-CreateClass.tsx` (reference implementation)

---

## Contact & Support

For questions about implementation details, refer to:
1. This implementation guide
2. The detailed specs in `Teahcer_screens` file
3. Screen 16 component code (reference implementation)
4. Framer Motion documentation for animations
5. React TypeScript best practices

---

**Document Version:** 1.0
**Last Updated:** 2025-11-20
**Status:** Ready for Implementation

All 5 screens (16-20) fully specified. Screen 16 code completed. Screens 17-20 ready to build following the same patterns.

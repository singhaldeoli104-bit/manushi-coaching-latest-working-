# UI/UX Design Documentation - Student Screens (All 21 Screens)

## 📋 Table of Contents
1. [Design System Overview](#design-system-overview)
2. [Core Design Principles](#core-design-principles)
3. [Component Library](#component-library)
4. [Color System](#color-system)
5. [Typography](#typography)
6. [Screen-by-Screen UI/UX Details](#screen-by-screen-uiux-details)
7. [Interaction Patterns](#interaction-patterns)
8. [Accessibility](#accessibility)

---

## Design System Overview

### **Premium Minimal Design System**
All 21 student screens follow the **Premium Minimal Design** system, characterized by:

- **Clean, uncluttered layouts** with ample white space
- **Card-based architecture** for content organization
- **Emoji icons** instead of icon libraries (no MaterialIcons or react-native-paper)
- **Consistent spacing** using 4px grid system
- **Subtle shadows and borders** for depth
- **Smooth transitions** and interactions
- **Mobile-first responsive** design

### Design Philosophy
> "Simplicity is the ultimate sophistication. Every element serves a purpose, every interaction feels natural, every screen breathes."

---

## Core Design Principles

### 1. **Visual Hierarchy**
- **Large, bold headings** (h1, h2) for screen titles
- **Medium weight** (semiBold) for section headers
- **Regular weight** for body text
- **Caption size** for metadata and timestamps

### 2. **Information Density**
- **92% content area** with proper padding (16px)
- **Compact 56dp headers** for maximum content space
- **Collapsible sections** for optional content
- **Horizontal scrolling** for carousels to save vertical space

### 3. **Feedback & Affordance**
- **Visual feedback** on all touchable elements
- **Loading states** with RefreshControl
- **Error states** with helpful messages
- **Empty states** with actionable guidance
- **Success confirmations** via alerts

### 4. **Consistency**
- **Reusable components** across all screens
- **Consistent spacing** (8px, 12px, 16px, 20px, 24px)
- **Uniform card styles** with 12px border radius
- **Standard button heights** (48dp minimum for accessibility)

---

## Component Library

### **Premium Minimal Design Components**

#### **Surfaces**
```typescript
Card           // Container with shadow, border, radius
  - padding: 16px standard
  - borderRadius: 12px
  - backgroundColor: #FFFFFF
  - borderWidth: 1px
  - borderColor: #E5E7EB
```

#### **Typography**
```typescript
T (Typography Component)
  - variant: h1, h2, h3, title, body, caption
  - weight: regular, semiBold, bold
  - color: inherited or specified
```

#### **Data Display**
```typescript
Badge          // Status indicators
  - variant: success, error, warning, info, neutral
  - Colors: green, red, yellow, blue, gray
  - Compact size with padding

Chip           // Filter/selection tags
  - variant: filter
  - Selected state with blue background
  - Unselected with gray background
```

#### **Inputs**
```typescript
Button         // Primary actions
  - variant: primary, outline, ghost
  - minHeight: 48dp (accessibility)
  - borderRadius: 8px
  - Full width or auto

TextInput      // Text entry
  - borderRadius: 8px
  - padding: 12px
  - borderColor: #E5E7EB
```

#### **Layout**
```typescript
Row            // Horizontal flex container
  - gap: xs, sm, md, lg
  - flexDirection: row

Col            // Vertical flex container
  - gap: xs, sm, md, lg
  - flexDirection: column

Spacer         // Spacing element
  - size: xs(4), sm(8), md(12), lg(16), xl(20)
```

#### **Navigation**
```typescript
HorizontalCarousel  // Horizontal scrolling list
  - Shows 1.2 items to indicate scrollability
  - Smooth scroll with momentum

BaseScreen     // Screen wrapper
  - loading state
  - error state
  - empty state
  - scrollable prop
```

---

## Color System

### **Primary Palette**
```
Primary Blue:    #3B82F6  // Actions, links, highlights
Success Green:   #10B981  // Completed, success states
Warning Yellow:  #F59E0B  // Warnings, attention needed
Error Red:       #EF4444  // Errors, critical items
Info Purple:     #9333EA  // Information, epic items
```

### **Neutral Palette**
```
Gray 900:        #111827  // Primary text
Gray 700:        #374151  // Secondary text
Gray 600:        #4B5563  // Tertiary text
Gray 500:        #6B7280  // Caption text
Gray 400:        #9CA3AF  // Disabled text
Gray 300:        #D1D5DB  // Borders (subtle)
Gray 200:        #E5E7EB  // Borders (standard)
Gray 100:        #F3F4F6  // Backgrounds (light)
Gray 50:         #F9FAFB  // Backgrounds (ultra light)
White:           #FFFFFF  // Cards, primary background
```

### **Semantic Colors**
```
Live/Active:     #EF4444  // 🔴 Live classes, active status
Upcoming:        #3B82F6  // 🔵 Upcoming events
Completed:       #10B981  // ✅ Done tasks
Streak:          #EF4444  // 🔥 Fire for streaks
Gold:            #FFD700  // 🏆 Legendary items
```

### **Background Tints**
```
Blue Tint:       #EFF6FF  // Recommendations, info cards
Green Tint:      #F0FDF4  // Goals, success cards
Yellow Tint:     #FFF7ED  // Notifications, warnings
Purple Tint:     #F3E8FF  // Special features
Gray Tint:       #F9FAFB  // Secondary cards
```

---

## Typography

### **Font System**
```
Base Font:       System (iOS: SF Pro, Android: Roboto)
Line Height:     1.5x for body, 1.2x for headings
Letter Spacing:  Default (OS-specific)
```

### **Type Scale**
```
h1:              32px / Bold      // Screen titles
h2:              24px / Bold      // Section headers
h3:              20px / Bold      // Subsection headers
title:           18px / SemiBold  // Card titles
body:            16px / Regular   // Body text
caption:         14px / Regular   // Metadata, timestamps
```

### **Font Weights**
```
Regular:         400
SemiBold:        600
Bold:            700
```

---

## Screen-by-Screen UI/UX Details

### **TASK 1-7: Screens (Completed in Previous Session)**

#### **Screen 1: NewStudyLibrary**
**Purpose:** Browse and access study materials
**UI Pattern:** List-based with search and filters
**Key Elements:**
- Search bar at top
- Subject filter chips
- Material cards with icons (📚 📝 🎥)
- Download/view buttons

#### **Screen 2: NewAIPracticeProblems**
**Purpose:** AI-generated practice questions
**UI Pattern:** Question-answer cards with scoring
**Key Elements:**
- Difficulty selector (Easy/Medium/Hard)
- Question cards with options
- Score display with progress bar
- Submit button with feedback

#### **Screen 3: NewDoubtSubmission**
**Purpose:** Submit questions to teachers
**UI Pattern:** Form-based with image upload
**UI Elements:**
- Subject selector
- Multi-line text input
- Image upload button
- Submit action button

#### **Screen 4: NewAITutorChat**
**Purpose:** Chat with AI tutor
**UI Pattern:** Messaging interface
**Key Elements:**
- Chat bubbles (student: right, AI: left)
- Message timestamps
- Input field at bottom
- Send button

#### **Screen 5: NewAttendanceTracker**
**Purpose:** View attendance records
**UI Pattern:** Calendar + stats
**Key Elements:**
- Monthly calendar grid
- Present (green), Absent (red), Holiday (gray)
- Attendance percentage badge
- Legend for status types

#### **Screen 6: NewPerformanceReports**
**Purpose:** Academic performance analytics
**UI Pattern:** Dashboard with charts
**Key Elements:**
- Overall GPA/percentage
- Subject-wise performance cards
- Trend indicators (↑ ↓)
- Time period selector

#### **Screen 7: NewMotivationalGoals**
**Purpose:** Set and track personal goals
**UI Pattern:** Goal cards with progress
**Key Elements:**
- Goal cards with titles
- Progress bars with percentages
- Add new goal button
- Complete/edit actions

---

### **TASK 8-13: Screens (Completed in Previous Session)**

#### **Screen 8: NewAssignmentDetail**
**Purpose:** View assignment details
**UI Pattern:** Detailed card layout
**Key Elements:**
- Assignment title and subject badge
- Due date with countdown
- Description and requirements
- Submission status indicator
- Submit/view submission buttons

#### **Screen 9: NewClassDetail**
**Purpose:** View class session details
**UI Pattern:** Information card with actions
**Key Elements:**
- Class title and subject
- Teacher name and avatar
- Time and duration
- Join class button (if live)
- Materials and recordings section

#### **Screen 10: NewTeacherProfile**
**Purpose:** View teacher information
**UI Pattern:** Profile layout
**Key Elements:**
- Teacher photo/avatar emoji
- Name and subject specialization
- Bio/description
- Contact information
- Subjects taught list
- Student ratings (optional)

#### **Screen 11: NewNotifications**
**Purpose:** View all notifications
**UI Pattern:** List with categories
**Key Elements:**
- Unread count badge
- Notification cards with icons
- Timestamp (relative)
- Mark as read action
- Category filters (All, Classes, Assignments, etc.)

#### **Screen 12: NewSettings**
**Purpose:** App settings and preferences
**UI Pattern:** Grouped list
**Key Elements:**
- Section headers (Account, Preferences, About)
- Toggle switches for settings
- Navigation to sub-screens
- Logout button

#### **Screen 13: NewProfileEdit**
**Purpose:** Edit student profile
**UI Pattern:** Form layout
**Key Elements:**
- Profile photo upload
- Text inputs (name, email, phone)
- Save button
- Validation feedback

---

### **TASK 14: NewPeerLearningNetwork** ✅
**Purpose:** Peer collaboration and learning
**UI Pattern:** Tab-based with 6 sections

#### **Visual Design:**
- **Header:** Simple title with emoji 👥
- **Tabs:** Horizontal scrollable chips
  - 👥 Peers | 📚 Groups | 🎯 Matches | 📁 Resources | 📝 Notes | 🏆 Board
- **Content:** Card-based layouts per tab

#### **Tab 1: Study Groups**
- **Group cards** with gray background (#F9FAFB)
- **Join/Leave buttons** with member count
- **Group chat button** for joined groups
- **Visual states:** Joined (blue accent) vs Not Joined

#### **Tab 2: Peer Matches**
- **Match cards** with compatibility percentage
- **Circular progress** indicator (color-coded)
- **Common subjects** as chips
- **Connect button** (primary blue)

#### **Tab 3: Group Chat**
- **Quick access tiles** for active groups
- **Recent message preview**
- **Unread count badges** (red)

#### **Tab 4: Resource Sharing**
- **Resource cards** with type icons (📄 🎥 🔗 📝)
- **Shared by** attribution
- **Timestamp** (relative)
- **Download button** with analytics

#### **Tab 5: Collaborative Notes**
- **Note cards** with contributor count
- **Last updated** timestamp
- **Subject badges**
- **Open note** action

#### **Tab 6: Leaderboard**
- **Ranked list** with position numbers
- **Avatar emojis** for students
- **Points display** (large, bold)
- **Badge icons** (🏆 🥈 🥉 ⭐)

**Color Scheme:**
- Cards: White (#FFFFFF)
- Background: Light gray (#F9FAFB)
- Accent: Blue (#3B82F6)
- Borders: Gray 200 (#E5E7EB)

---

### **TASK 15: NewCollaborativeAssignment** ✅
**Purpose:** Team assignment collaboration
**UI Pattern:** Multi-section layout with real-time features

#### **Visual Design:**
- **Header card:** Assignment title + subject badge + due date
- **Team members section:** Avatar grid with names
- **4 Feature sections** stacked vertically

#### **Section 1: Active Editors (Real-time)**
- **Live indicator:** 🟢 Active Now (count)
- **Editor items:** Avatar + name + section editing
- **Live cursor:** ✎ icon in green
- **Background:** White with subtle borders

#### **Section 2: Version History**
- **Collapsible panel:** Show/Hide toggle
- **Version cards:** Badge (v1, v2...) + timestamp + author
- **Changes description** in body text
- **Restore button** (outline variant)
- **Background:** Light gray (#F9FAFB)

#### **Section 3: Member Contributions**
- **Collapsible panel:** Show/Hide toggle
- **Contribution items:** Avatar + name + stats
- **Stats:** Lines added + edits count
- **Progress bars:** Visual contribution percentage
- **Percentage badge:** Blue, bold

#### **Section 4: Progress Tasks**
- **Task list** with status icons
- **Icons:** ✅ (completed), 🔄 (in progress), ⏳ (pending)
- **Simple text list**

**Color Scheme:**
- Primary: Blue (#3B82F6)
- Live indicator: Green (#10B981)
- Version badges: Info blue
- Progress bars: Blue gradient

---

### **TASK 16: NewAILearningDashboard** ✅
**Purpose:** AI-powered learning insights
**UI Pattern:** Dashboard with recommendation widget

#### **Visual Design:**
- **Header card:** Title + subtitle + description
- **Main section:** AI Insights (Performance)
- **Key feature:** Personalized Recommendations Widget

#### **Personalized Recommendations Widget:**
- **Card container:** White with border
- **Header:** 📌 Personalized Recommendations
- **Recommendation items:**
  - **Icon container:** Circular (48dp) with emoji
  - **Priority badge:** Color-coded (HIGH-red, MEDIUM-yellow, LOW-blue)
  - **Time estimate:** ⏱ icon + duration
  - **Recommendation text:** Bold, clear
  - **Category tag:** Subject name
  - **Action button:** Full-width primary button
  - **Button text varies:** "Start Study", "Review Now", "Practice", "Complete"

#### **Badge Variants:**
- HIGH: Red (#EF4444)
- MEDIUM: Yellow (#F59E0B)
- LOW: Blue (#3B82F6)

#### **Recommendation Icons:**
- 📚 Study
- 🔄 Review
- 💪 Practice
- ✅ Complete

**Color Scheme:**
- Widget background: White (#FFFFFF)
- Icon container: White with border
- Badge colors: Semantic (red/yellow/blue)
- Button: Primary blue

---

### **TASK 17: NewGamifiedLearningHub** ✅
**Purpose:** Gamification features - badges and achievements
**UI Pattern:** Stats overview + badge collection + timeline

#### **Visual Design:**
- **Stats card (top):** Large points display + level + streak
- **Two main sections:** Badge Collection + Achievement Timeline

#### **Section 1: Badge Collection Display**
- **Header:** Progress text (X/Y badges collected, percentage)
- **Progress bar:** Blue fill showing collection percentage
- **Category filters:** Horizontal scrollable chips
  - All | 📚 Academic | 👥 Social | ⭐ Special
- **Badge grid:** 3 columns (30% width each)
- **Badge cards:**
  - **Icon:** Large emoji (earned) or 🔒 (locked)
  - **Name:** Below icon
  - **Rarity badge:** Color-coded
    - Legendary: Gold (#FFD700) - Warning variant
    - Epic: Purple (#9333EA) - Info variant
    - Rare: Blue (#3B82F6) - Info variant
    - Common: Gray (#6B7280) - Neutral variant
  - **Earned date:** Caption text (if earned)
  - **Progress bar:** For locked badges (percentage to unlock)
  - **Border color:** Matches rarity

#### **Section 2: Achievement Timeline**
- **Header:** 🏆 Recent Achievements
- **Timeline structure:**
  - **Timeline dots:** Blue circles (12dp)
  - **Connecting lines:** Vertical gray lines (2px)
  - **Achievement cards:** Left-aligned with left border accent
- **Achievement card contents:**
  - **Icon:** Circular container (48dp) with emoji
  - **Title:** Bold text
  - **Description:** Body text
  - **Points badge:** Green success badge (+50 pts, +100 pts, etc.)
  - **Date:** Caption text (relative time)
  - **Background:** Light gray (#F9FAFB)
  - **Left border:** Blue accent (3px)

**Color Scheme:**
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Legendary: Gold (#FFD700)
- Epic: Purple (#9333EA)
- Rare: Blue
- Common: Gray
- Background: Light gray (#F9FAFB)

**Interaction:**
- Tap badge → View details (analytics tracked)
- Filter by category → Update grid
- Timeline scrolls vertically

---

### **TASK 18: NewInteractiveClassroom** ✅
**Purpose:** Interactive class features
**UI Pattern:** Tab-based with 4 sections + floating button

#### **Visual Design:**
- **Tab bar:** Horizontal scrollable at top
  - 📊 Poll | 💬 Q&A | 📋 Whiteboard | 👥 Breakout
- **Content area:** Full-height scrollable
- **Floating button:** Bottom-right (raise hand)

#### **Tab 1: Live Poll Participation**
- **Poll card:** White card with shadow
- **Title:** 📊 Live Poll
- **Question:** Large, bold text
- **Options:** Letter-labeled (A, B, C, D)
- **Option buttons:**
  - Default: Light gray (#F3F4F6) background
  - Selected: Blue background (#DBEAFE), blue border (#3B82F6)
  - Disabled after submission
- **Loading state:** "Submitting..." text
- **Empty state:** "No active poll" message

#### **Tab 2: Q&A During Class**
- **Ask section:** Card at top
  - TextInput (multiline, 500 char limit)
  - Submit button (disabled if empty)
- **Question cards:**
  - **Header:** Student avatar + name + timestamp
  - **Answered badge:** Green success badge
  - **Question text:** Body text
  - **Answer box:** Green-tinted background (#F0FDF4), left border accent
  - **Like button:** 👍 with count, gray background
- **Layout:** Student info left, badge right

#### **Tab 3: Whiteboard Viewing**
- **Header card:** Slide count
- **Slide cards:**
  - **Slide number badge:** Blue info badge
  - **Timestamp:** Caption text
  - **Title:** Semibold text
  - **Placeholder:** Dashed border (200dp height) for slide content
  - **Icon:** 📄 in center

#### **Tab 4: Breakout Rooms**
- **Header card:** Instructions
- **Room cards:**
  - **Room name + topic:** Bold title + caption
  - **Member count:** 👥 X/Y members
  - **Join button:** Primary (if available), Outline (if joined), Disabled (if full)
  - **States:** Full rooms show "Full" button

#### **Floating Raise Hand Button:**
- **Position:** Bottom-right, 24dp margins
- **Size:** 64dp x 64dp circle
- **Colors:**
  - Default: Blue (#3B82F6)
  - Active: Green (#10B981)
- **Icons:**
  - Default: 🙋 (hand raised emoji)
  - Active: ✋ (hand emoji)
- **Shadow:** Heavy shadow for prominence
- **Feedback:** Alert dialog on tap

**Color Scheme:**
- Tab bar: White with bottom border
- Poll selected: Blue (#3B82F6)
- Q&A answer: Green tint (#F0FDF4)
- Whiteboard: Gray placeholder
- Breakout: Standard cards
- Floating button: Blue/Green

**Interactions:**
- Tab switch → Load content
- Submit poll → Disable options, show loading
- Ask question → Add to list, clear input
- Like question → Increment count
- Join room → Toggle membership
- Raise hand → Toggle state, show alert

---

### **TASK 19: NewEnhancedSchedule** ✅
**Purpose:** Calendar and scheduling features
**UI Pattern:** View toggle + calendar/list + additional features

#### **Visual Design:**
- **Header card:** Title + date + view toggles + sync button
- **View toggles:** 📋 List | 📅 Calendar (chip filters)
- **Google Calendar Sync:** Full-width button (green when synced)

#### **Calendar View Mode:**
- **Month navigation:**
  - Previous/Next arrows (< >)
  - Month + Year centered (bold)
- **Week day headers:** Sun-Sat (gray text)
- **Calendar grid:**
  - 7 columns (14.285% width each)
  - Square cells (aspectRatio: 1)
  - **Today:** Blue background (#DBEAFE)
  - **Selected:** Darker blue background (#3B82F6), white text
  - **Event dots:** Red dots below date (up to 3 dots)
  - **Tap:** Select date, show events below
- **Events for selected date:**
  - Section with border-top separator
  - Event cards with icon, subject, time
  - Type badges (class-blue, assignment-yellow, test-red, event-neutral)

#### **List View Mode:**
- **Today's classes:** Vertical list
- **Class items:**
  - Time column (70dp width, right-aligned)
  - Status bar (4dp width, color-coded)
  - Class info (flex: 1)
  - Status icon (🔴 live, 🔵 upcoming, ✅ completed)
  - **Reschedule button:** For upcoming classes only

#### **Reminders Section:**
- **Card:** 🔔 Upcoming Reminders
- **Reminder items:**
  - Icon + title (bold)
  - Time + minutes before
  - **Toggle switch:** iOS-style (50dp x 28dp)
    - Off: Gray (#D1D5DB)
    - On: Green (#10B981)
    - Knob: 24dp circle with shadow
    - Animation: translateX(22px)

#### **Reschedule Request Button:**
- **Style:** Gray background (#F3F4F6), blue text
- **Action:** Confirmation dialog
- **Position:** Below status for upcoming classes

**Color Scheme:**
- Calendar today: Light blue (#DBEAFE)
- Calendar selected: Blue (#3B82F6)
- Event dots: Red (#EF4444)
- Live status: Red
- Upcoming status: Blue
- Completed status: Green
- Reminder on: Green (#10B981)
- Sync button: Green when synced, blue when not

**Interactions:**
- Toggle view → Switch between calendar and list
- Sync button → Toggle sync state, show alert
- Select date → Show events for that date
- Toggle reminder → Update state, track analytics
- Request reschedule → Show confirmation dialog

---

### **TASK 20: NewEnhancedAIStudy** ✅
**Purpose:** Comprehensive AI study tools
**UI Pattern:** Tab-based dashboard with 4 tabs

#### **Visual Design:**
- **Tab bar:** Horizontal scrollable
  - 📊 Dashboard | 🎴 Flashcards | 📝 Notes | 🧪 Tests

#### **Dashboard Tab:**
Contains 3 main sections:

##### **1. Study Progress Section:**
- **Card:** 📈 Study Progress
- **Progress items:**
  - Subject name + percentage badge (blue)
  - Progress bar (blue fill)
  - Stats: X/Y topics • time spent

##### **2. AI-Identified Weak Areas:**
- **Card:** 🎯 AI-Identified Weak Areas
- **Weak area items:**
  - Topic title + subject
  - Score badge (color-coded: red<50, yellow 50-69, green≥70)
  - Improvement trend (▲ green, ▼ red)
  - **Suggestions box:** Yellow-tinted background (#FFFBEB), left border
    - "AI Suggestions:" label
    - Bulleted list
  - **Start Practice button:** Full-width primary blue

##### **3. AI Study Plans:**
- **Header:** Title + "+ Generate" ghost button
- **Study plan cards:**
  - Title + subject + duration
  - Completion badge (if complete)
  - Task list (numbered)
  - Gray background (#F9FAFB)

#### **Flashcards Tab:**
- **Header card:** Description + "Generate New Flashcards" button
- **Flashcard items:**
  - **Header:** Subject badge + difficulty badge (green/yellow/red) + "✓ Mastered"
  - **Question:** Bold text with "Q:" prefix
  - **Answer box:** Green-tinted (#F0FDF4), left border accent
    - "A:" prefix + answer text

#### **Notes Tab:**
- **Header card:** Description + "Generate Smart Notes" button
- **Note items:**
  - **Header:** Subject badge + timestamp
  - **Title:** Bold text
  - **Summary:** Caption text
  - **Key Points section:**
    - "Key Points:" label
    - Bulleted list (• format)

#### **Tests Tab:**
- **Header card:** Description
- **Test items:**
  - Title + subject
  - Score badge (if completed)
  - **Metadata row:** 📝 questions • ⏱ duration • difficulty badge
  - **Button:** "Start Test" (primary) or "Retake Test" (outline)

**Color Scheme:**
- Progress bars: Blue (#3B82F6)
- Weak areas suggestions: Yellow tint (#FFFBEB), yellow border (#F59E0B)
- Flashcard answers: Green tint (#F0FDF4), green border (#10B981)
- Study plans: Gray background (#F9FAFB)
- Difficulty easy: Green
- Difficulty medium: Yellow
- Difficulty hard: Red

**Interactions:**
- Tab switch → Load content
- Generate buttons → Show alert, track analytics
- Start practice → Navigate to practice screen
- Start test → Show alert, track analytics
- All actions tracked with analytics

---

### **TASK 21: NewStudentDashboard** ✅
**Purpose:** Main student dashboard with all features
**UI Pattern:** Scrollable dashboard with 13 sections

#### **Visual Design:**
- **RefreshControl:** Pull-to-refresh functionality
- **Vertical scroll:** All sections stacked

#### **Section 1: Welcome Summary**
- **Greeting:** "Good morning, [Name]! 👋" (bold)
- **Stats:** X classes • Y assignments • Z% attendance
- **Streak:** 🔥 X day streak (red, bold)

#### **Section 2: Today's Classes**
- **Horizontal carousel:** Shows 1.2 items
- **EventCard components:**
  - Subject name + code
  - Time
  - Status badge (live-red, upcoming-blue, ended-gray)

#### **Section 3: Assignments Due**
- **Header:** Title + "View All →" link
- **Assignment items:**
  - Title (• prefix)
  - Due date
  - Border bottom separator
  - Tap to view details

#### **Section 4: Smart Recommendation**
- **Blue-tinted card:** (#EFF6FF)
- **Icon:** 💡
- **Title:** Smart Recommendation
- **Message:** AI-generated suggestion
- **Button:** "Start Practice" (primary)

#### **Section 5: Recent Activity**
- **Activity items:**
  - Timestamp (gray)
  - Description text
  - Horizontal layout

#### **Section 6: Quick Access Bar**
- **Grid of buttons:** 5 columns, wrapping
- **Button design:**
  - Emoji icon (large)
  - Label below (caption)
  - 60dp minimum width
  - 48dp minimum height
- **Actions:**
  - 📚 Library
  - ❓ Ask
  - 📅 Schedule
  - 🤖 AI
  - 👥 Peers

#### **Section 7: Learning Progress**
- **Touchable card:** Navigate to gamification hub
- **Content:**
  - Level + XP display
  - Progress bar (green)
  - Percentage to next level
- **Background:** Light gray (#F9FAFB)

#### **NEW: Section 8: Performance Chart**
- **Card:** 📊 Weekly Performance
- **Bar chart:**
  - 7 days (Mon-Sun)
  - Vertical bars showing percentage (0-100%)
  - Bar height reflects score
  - Day label below
  - Score percentage below bar
  - Blue bars (#3B82F6)
  - 120dp height container
  - Bars bottom-aligned

#### **NEW: Section 9: Upcoming Events Calendar**
- **Title:** 📅 Upcoming Events (Next 5 Days)
- **Event cards:**
  - Event title + subject
  - Date badge (blue) - "Month Day" format
  - Description (if available)
  - White background, gray border

#### **NEW: Section 10: Notifications Panel**
- **Orange-tinted card:** (#FFF7ED)
- **Header:** 🔔 Notifications + count badge (red)
- **Notification items:**
  - Red dot indicator (8dp)
  - Title (bold)
  - Message text
  - Timestamp
  - Tap to mark as read
  - Border separator

#### **NEW: Section 11: Teacher Announcements**
- **Title:** 📢 Teacher Announcements
- **Announcement cards:**
  - Blue-tinted background (#EFF6FF)
  - Title + teacher attribution
  - Date badge (yellow/warning)
  - Full announcement content
  - Gray text for content

#### **NEW: Section 12: Study Goals Tracker**
- **Green-tinted card:** (#F0FDF4)
- **Header:** 🎯 Study Goals
- **Goal items:**
  - Title + deadline
  - Progress badge (color-coded)
  - Progress bar (green fill)
  - Current/Target values + unit
  - "✓ Complete" button (if 100%)
  - Border separator between goals

**Color Scheme:**
- Welcome: Standard text
- Classes carousel: Event-specific colors
- Recommendations: Blue tint (#EFF6FF)
- Quick access: Standard buttons
- Progress: Green fill
- **Performance chart:** Blue bars (#3B82F6)
- **Events:** White cards
- **Notifications:** Orange tint (#FFF7ED), red dots
- **Announcements:** Blue tint (#EFF6FF)
- **Goals:** Green tint (#F0FDF4)

**Interactions:**
- Pull to refresh → Refetch all data
- Tap class → Navigate to class detail
- Tap assignment → Navigate to assignment detail
- Tap recommendation → Navigate to AI study
- Quick access buttons → Navigate to respective screens
- Tap learning progress → Navigate to gamification hub
- **Tap notification → Mark as read, show alert**
- **Tap goal complete → Mark complete, show alert**
- All actions tracked with analytics

---

## Interaction Patterns

### **Navigation**
```
Primary: safeNavigate() - Analytics-tracked navigation
Back: Hardware back button with guards (useBlockBack)
Deep Links: generateDeepLink() for shareable content
```

### **Data Fetching**
```
Library: TanStack Query (React Query)
Loading: RefreshControl on ScrollView
Error: Error state in BaseScreen
Empty: Empty state in BaseScreen
Retry: Pull-to-refresh gesture
```

### **Feedback Mechanisms**
```
Success: Alert.alert() with positive message
Error: Alert.alert() with error message
Loading: Inline "Loading..." text or spinner
Confirmation: Alert with Cancel/Confirm buttons
```

### **Touch Targets**
```
Minimum: 48dp x 48dp (accessibility guideline)
Buttons: Full width or auto with padding
Links: Underlined text with color
Icons: 24dp x 24dp minimum
```

### **Scrolling**
```
Vertical: Primary scroll direction
Horizontal: Carousels and tab bars
Momentum: Enabled for natural feel
Indicators: Hidden for cleaner UI
```

### **Animations**
```
Transitions: Smooth, subtle (avoid jarring)
Duration: 200-300ms typical
Easing: Default OS easing curves
States: Instant feedback on touch
```

---

## Accessibility

### **Screen Reader Support**
```typescript
accessibilityRole     // button, link, text, image
accessibilityLabel    // Descriptive label for element
accessibilityHint     // Additional guidance
accessibilityState    // checked, disabled, selected
```

### **Touch Targets**
```
Minimum: 48dp x 48dp
Spacing: 8dp between targets
Padding: Increase for small elements
```

### **Color Contrast**
```
Text on White:   4.5:1 ratio minimum (WCAG AA)
Text on Gray:    Minimum gray-700 (#374151)
Icons:           Match text contrast
Borders:         Visible but subtle
```

### **Semantic HTML Elements**
```
Buttons:         TouchableOpacity with accessibilityRole="button"
Links:           TouchableOpacity with accessible label
Headings:        T component with variant prop
Lists:           FlatList with accessibility
```

### **Labels & Hints**
```
All buttons:     accessibilityLabel present
All inputs:      Placeholder text + label
All icons:       Text alternative provided
All images:      Description if informative
```

### **Example Accessibility Implementation:**
```typescript
<TouchableOpacity
  onPress={handlePress}
  accessibilityRole="button"
  accessibilityLabel="Submit assignment"
  accessibilityHint="Double tap to submit your work"
  style={styles.button}
>
  <T variant="body">Submit</T>
</TouchableOpacity>
```

---

## Summary Table: All 21 Screens

| # | Screen Name | Primary Pattern | Key Colors | Main Components |
|---|-------------|-----------------|------------|-----------------|
| 1 | NewStudyLibrary | List + Filters | Blue, Gray | SearchBar, Cards, Chips |
| 2 | NewAIPracticeProblems | Question Cards | Blue, Green | QuestionCard, Options, Score |
| 3 | NewDoubtSubmission | Form | Blue, Gray | TextInput, ImagePicker, Button |
| 4 | NewAITutorChat | Chat Interface | Blue, Gray | ChatBubbles, Input, Send |
| 5 | NewAttendanceTracker | Calendar + Stats | Green, Red | CalendarGrid, StatCards |
| 6 | NewPerformanceReports | Dashboard | Blue, Colors | Charts, StatCards, Trend |
| 7 | NewMotivationalGoals | Goal Cards | Blue, Green | ProgressBar, GoalCard |
| 8 | NewAssignmentDetail | Detail View | Blue, Gray | InfoCards, StatusBadge |
| 9 | NewClassDetail | Detail View | Blue, Gray | InfoCards, JoinButton |
| 10 | NewTeacherProfile | Profile Layout | Blue, Gray | Avatar, InfoList |
| 11 | NewNotifications | List + Filters | Orange, Red | NotificationCard, Badge |
| 12 | NewSettings | Grouped List | Blue, Gray | SettingRows, Toggles |
| 13 | NewProfileEdit | Form Layout | Blue, Gray | TextInputs, ImagePicker |
| 14 | NewPeerLearningNetwork | Tabs (6) | Blue, Gray | Cards, Chips, Badges |
| 15 | NewCollaborativeAssignment | Multi-section | Blue, Green | Cards, ProgressBars, Badges |
| 16 | NewAILearningDashboard | Widget Dashboard | Blue, Multi | RecommendationWidget, Badges |
| 17 | NewGamifiedLearningHub | Collection + Timeline | Multi, Gold | BadgeGrid, Timeline, Dots |
| 18 | NewInteractiveClassroom | Tabs (4) + Float | Blue, Green | Cards, FloatingButton, Tabs |
| 19 | NewEnhancedSchedule | Calendar/List + Features | Blue, Green | CalendarGrid, Toggle, Reminders |
| 20 | NewEnhancedAIStudy | Tabs (4) Dashboard | Blue, Multi | Cards, ProgressBars, Badges |
| 21 | NewStudentDashboard | Scrollable Dashboard | Multi | 13 sections, Charts, Cards |

---

## Design Consistency Checklist

✅ **Typography:** T component with standard variants (h1, h2, h3, title, body, caption)
✅ **Colors:** Premium Minimal color palette (Blue primary, semantic colors)
✅ **Spacing:** 4px grid system (8, 12, 16, 20, 24px)
✅ **Components:** Card, Badge, Button, Chip, Row, Col, Spacer
✅ **Icons:** Emojis only (no icon libraries)
✅ **Borders:** 1px, #E5E7EB standard gray
✅ **Radius:** 8-12px for cards and buttons
✅ **Shadows:** Subtle, elevation-based
✅ **Loading:** RefreshControl on ScrollView
✅ **Empty States:** BaseScreen with emptyMessage
✅ **Error States:** BaseScreen with error prop
✅ **Accessibility:** Labels, roles, hints on all interactive elements
✅ **Analytics:** trackAction() on all user interactions
✅ **Navigation:** safeNavigate() throughout

---

## Design Evolution

### Phase 1: Foundation (Tasks 1-7)
- Established Premium Minimal Design system
- Created base component library
- Defined color palette and typography
- Implemented basic patterns (lists, forms, dashboards)

### Phase 2: Enhancement (Tasks 8-13)
- Added detail views and profiles
- Introduced notifications and settings
- Refined card designs and layouts
- Enhanced form patterns

### Phase 3: Advanced Features (Tasks 14-21)
- Complex tab-based interfaces (6-tab, 4-tab layouts)
- Real-time collaboration features
- Advanced data visualizations (charts, timelines)
- Gamification elements (badges, achievements)
- AI-powered recommendations
- Calendar and scheduling features
- Comprehensive dashboard (13 sections)

---

## Conclusion

All 21 student screens follow a **consistent, cohesive design language** based on the **Premium Minimal Design** system. The UI/UX is characterized by:

- ✨ **Clean, modern aesthetics** with ample white space
- 🎨 **Consistent color usage** with semantic meaning
- 📐 **Predictable layouts** with card-based architecture
- 🎯 **Clear information hierarchy** with proper typography
- 🖱️ **Intuitive interactions** with appropriate feedback
- ♿ **Full accessibility support** meeting WCAG standards
- 📊 **Rich data visualization** where appropriate
- 🚀 **Performance-optimized** with proper loading states

The design system ensures a **delightful, cohesive user experience** across all screens while maintaining **flexibility** for feature-specific requirements.

---

**Document Version:** 1.0 (Final)
**Last Updated:** 2025-11-05
**Screens Documented:** 21/21 (100%)
**Design System:** Premium Minimal Design v1.0

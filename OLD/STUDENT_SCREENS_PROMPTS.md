# 📱 Student App - Complete Screen Prompts for UI/UX Recreation
**Total Screens:** 21 Student Screens
**Design System:** Material Design 3 + Lovable UI Patterns
**Tech Stack:** React Native, TypeScript, Supabase, TanStack Query

---

## 🎨 Global Design Patterns Used Across All Screens

### Color Palette
- **Primary:** #6366F1 (Indigo)
- **Secondary:** #8B5CF6 (Purple)
- **Success:** #10B981 (Green)
- **Warning:** #F59E0B (Amber)
- **Error:** #EF4444 (Red)
- **Info:** #06B6D4 (Cyan)
- **Surface:** #FFFFFF
- **Background:** #F9FAFB

### Common UI Patterns
1. **Gradient Headers with Rounded Bottoms** (24px border radius)
2. **Floating Cards** (negative margin -16px to -24px)
3. **Border-Left Colored Cards** (4px left border)
4. **Status Badges** (Live, Scheduled, Completed)
5. **Material Design 3 Shadows** (elevation system)
6. **Glass-morphism Effects** (backdrop blur, rgba backgrounds)

### Reusable Components
- `StatCard` - Icon, value, label stat display
- `QuickAccessButton` - 80x80 touch target buttons
- `Card` with variants: elevated, outlined
- `Badge` with variants: success, warning, error, info
- `Chip` for filters and tags
- `Button` with variants: primary, secondary, outline, ghost
- `Row` / `Col` for layout
- `T` (Typography) component with variants

---

## 📱 SCREEN 1: Student Dashboard
**File:** `NewStudentDashboard.tsx`
**Role:** Main hub, first screen after login
**Navigation:** Bottom Tab (Home icon)

### Purpose
Central dashboard showing today's overview: classes, assignments, quick actions, and activity feed.

### Features List
1. **Welcome Header Section**
   - Personalized greeting with time of day
   - Student name from user email
   - Grade and section display
   - Avatar icon

2. **Floating Stats Cards (4 cards)**
   - Today's Classes count
   - Pending Assignments count
   - Attendance percentage
   - Current streak (days)

3. **Today's Classes Section**
   - Live class cards with gradient background
   - Pulsing dot indicator for live status
   - "Join Live Class" button
   - Scheduled class cards
   - Class time, subject, teacher, room number
   - Status badges (Live, Scheduled, Ended)

4. **Pending Assignments Section**
   - Assignment cards with priority badges
   - Subject, due date, points
   - Priority levels (High, Medium, Low)
   - "Start Assignment" button

5. **Quick Access Buttons (5 buttons)**
   - 📚 Study Library
   - ❓ Ask Doubt
   - 📅 Schedule
   - 🤖 AI Tutor
   - 👥 Peer Learning

6. **Recent Activity Feed**
   - Grade received notifications
   - Assignment submitted confirmations
   - Doubt resolved updates
   - Timestamps (e.g., "2h ago")

### UI/UX Design
```
┌─────────────────────────────────────┐
│ [Gradient Header - Primary Color]   │
│ Good morning, Raj! 👋               │
│ Grade 12 - Science         [Avatar] │
└─────────────────────────────────────┘
  [Floating Stats - Negative Margin]
  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
  │📚  2 │ │📝  8 │ │✅ 95%│ │🎯  7 │
  │Class │ │Assign│ │Attend│ │Streak│
  └──────┘ └──────┘ └──────┘ └──────┘

📚 Today's Classes
┌─────────────────────────────────────┐
│ [Gradient Card - Primary]           │
│ 🔴 LIVE • 32 students online        │
│ Math - Calculus Basics              │
│ Mr. Sharma • Room: A-101            │
│ [Join Live Class Button]            │
├─────────────────────────────────────┤
│ Start: 2:00 PM | Duration: 1.5 hrs  │
│ [📅 Add to Calendar]                │
└─────────────────────────────────────┘

📝 Pending Assignments
┌─────────────────────────────────────┐
│ Physics Problem Set          [High] │
│ Due: Tomorrow • 50 points           │
│ [Start Assignment]                  │
└─────────────────────────────────────┘

🚀 Quick Access
[📚][❓][📅][🤖][👥]

📊 Recent Activity
• Grade Received: Math Test - 95/100
• Assignment Submitted: Chemistry Lab
```

### Data Fetched (Supabase)
1. `students` table - user profile, batch_id
2. `live_sessions` table - today's classes
3. `assignments` table - pending assignments count
4. `submissions` table - recent activity

### User Interactions
- Tap class card → Navigate to ClassDetail
- Tap assignment → Navigate to AssignmentDetail
- Tap quick access → Navigate to respective screen
- Pull to refresh → Refetch all data
- Tap activity item → Navigate to detail

---

## 📱 SCREEN 2: Progress/Report Card
**File:** `NewProgressDetailScreen.tsx`
**Role:** Academic performance tracker
**Navigation:** Bottom Tab (Progress icon)

### Purpose
Display student's academic progress with grades, test scores, subject performance, and streak tracking.

### Features List
1. **Performance Header**
   - Overall average percentage
   - Grade letter (A, B+, etc.)
   - Class rank display
   - Trophy icon

2. **Floating Stats (4 stats)**
   - Tests Taken count
   - Average Grade letter
   - Improvement percentage (+5%)
   - Achievements earned

3. **Performance Chart**
   - 6-month trend visualization
   - Placeholder for chart component

4. **Study Streak Tracker**
   - 7-day week visualization
   - Checkmarks for completed days
   - Longest streak display
   - Fire emoji animation

5. **Recent Tests Section (3 cards)**
   - Test subject and topic
   - Score and total points (e.g., 85/100)
   - Grade badge (A, B+)
   - Rank badge (e.g., "Rank: 2/35")
   - Test date
   - "View Details" button

6. **Subject Performance Bars**
   - Subject name
   - Percentage score
   - Colored progress bar
   - 4 subjects displayed

### UI/UX Design
```
┌─────────────────────────────────────┐
│ [Gradient Header - Purple]          │
│ My Progress                         │
│ Overall Average: 92.5%       🏆     │
│ #1 in class                         │
└─────────────────────────────────────┘
  [Floating Stats]
  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
  │📊 12 │ │⭐  A │ │📈 +5%│ │🏆 15 │
  │Tests │ │Grade │ │Improv│ │Achiev│
  └──────┘ └──────┘ └──────┘ └──────┘

📈 Performance Trend
┌─────────────────────────────────────┐
│ [Chart Placeholder]                 │
│ Last 6 months trend                 │
└─────────────────────────────────────┘

🔥 7-day Study Streak 🔥
┌─────────────────────────────────────┐
│ Mon Tue Wed Thu Fri Sat Sun         │
│  ✓   ✓   ✓   ✓   ✓   ✓   ✓         │
│ Longest streak: 10 days             │
└─────────────────────────────────────┘

📊 Recent Tests
┌─────────────────────────────────────┐
│ Physics - Motion                    │
│ Laws of Motion & Kinematics         │
│ [Grade: A] [Rank: 2/35]             │
│ Jan 5, 2025                   85/100│
│ [View Details]                      │
└─────────────────────────────────────┘

📚 Subject Performance
┌─────────────────────────────────────┐
│ Mathematics         92% [████████░░]│
│ Physics             88% [███████░░░]│
│ Chemistry           95% [█████████░]│
│ Biology             90% [████████░░]│
└─────────────────────────────────────┘
```

### Data Fetched
1. `submissions` table - graded assignments
2. `assignments` table - test details
3. `class_sessions` table - attendance
4. Calculated: overall grade, attendance rate, subject averages

### User Interactions
- Tap test card → View test details
- Pull to refresh → Recalculate stats
- Scroll for more tests
- Tap subject → Filter by subject

---

## 📱 SCREEN 3: Study Network (Connect/Peers)
**File:** `NewPeerLearningNetwork.tsx`
**Role:** Peer collaboration hub
**Navigation:** Bottom Tab (Connect icon)

### Purpose
Connect students with peers, join study groups, and collaborate on learning.

### Features List
1. **Gradient Header**
   - "Study Network" title
   - Two action buttons: "Find Peers", "Groups"

2. **Floating Search Bar**
   - Search students or groups
   - Real-time filter

3. **My Connections Section**
   - Peer cards with avatars
   - Match percentage bar (85%, 78%, 72%)
   - Common subjects tags
   - "Message" button
   - "View Profile" button

4. **Study Groups Section (3 groups)**
   - Group name and subject
   - Member count (12 members)
   - Active members badge (5 active)
   - Last activity timestamp
   - "Open Group" button

5. **Suggested for You**
   - Suggested peer card
   - Grade and match percentage
   - "Add" button

6. **Peer Matching Algorithm Display**
   - Shows compatibility based on:
     - Common subjects
     - Study strengths
     - Grade level

### UI/UX Design
```
┌─────────────────────────────────────┐
│ [Gradient Header - Cyan]            │
│ Study Network                       │
│ [👥 Find Peers] [📚 Groups]         │
└─────────────────────────────────────┘
  [Floating Search Bar]
  ┌─────────────────────────────────────┐
  │ 🔍 Search students or groups...     │
  └─────────────────────────────────────┘

👥 My Connections (15 students)
┌─────────────────────────────────────┐
│ 👩 Sarah Johnson                    │
│ Grade 12 Science                    │
│ Match: ████████░░ 85%               │
│ [Math] [Physics] [Chemistry]        │
│ [💬 Message] [View Profile]         │
└─────────────────────────────────────┘

📚 My Study Groups (3 groups)
┌─────────────────────────────────────┐
│ 👥 Physics Study Group              │
│ Mechanics & Thermodynamics          │
│ 👥 12 members • [5 active]          │
│ Last activity: 2h ago               │
│ [Open Group]                        │
└─────────────────────────────────────┘

✨ Suggested for You
┌─────────────────────────────────────┐
│ 👤 Meera Singh                      │
│ Grade 12 • 72% match                │
│                              [➕ Add]│
└─────────────────────────────────────┘
```

### Data Fetched
1. `students` table - peers from same class
2. `user_bookmarks` table - connections
3. Calculated: match percentage, common subjects

### User Interactions
- Tap peer card → Navigate to PeerDetail
- Tap Message → Open chat
- Tap Add → Send connection request
- Tap Open Group → Navigate to GroupChat
- Search input → Filter results

---

## 📱 SCREEN 4: Study Library
**File:** `NewStudyLibraryScreen.tsx`
**Role:** Digital resource browser
**Navigation:** Bottom Tab (Study icon)

### Purpose
Browse, search, filter, and access study materials (PDFs, videos, documents).

### Features List
1. **Gradient Header with Integrated Search**
   - Blue gradient background
   - White search bar with icon
   - Placeholder text

2. **AI Study Assistant Card**
   - Floating card (negative margin)
   - Light blue background
   - AI icon
   - "Ask AI" button
   - Subtitle text

3. **Filter Chips (4 types)**
   - All
   - ⭐ Favorites
   - ⬇️ Downloaded
   - 🆕 New (last 7 days)

4. **Subject Filter Chips**
   - All Subjects
   - Mathematics
   - Physics
   - Chemistry
   - (Dynamic from data)

5. **View Mode Toggle**
   - Grid view (⊞)
   - List view (☰)
   - Resource count display

6. **Material Cards**
   - Large icon (64x64) with colored background
   - Material title
   - Type badge (PDF, VIDEO, DOC)
   - File size (2.5 MB)
   - Tags (#calculus, #derivatives)
   - Rating stars (4.5)
   - Download count (156)
   - Bookmark icon (filled/unfilled)

7. **Bookmark Feature**
   - Toggle star icon
   - Saves to favorites
   - Real-time update

### UI/UX Design
```
┌─────────────────────────────────────┐
│ [Gradient Header - Blue]            │
│ Study Library                       │
│ ┌───────────────────────────────┐   │
│ │ 🔍 Search resources...        │   │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
  [AI Assistant Card - Floating]
  ┌─────────────────────────────────────┐
  │ ✨ AI Study Assistant               │
  │ Get instant help with your studies  │
  │                         [Ask AI]    │
  └─────────────────────────────────────┘

[All][⭐ Favorites][⬇️ Downloaded][🆕 New]
[All Subjects][Math][Physics][Chemistry]

125 resources              [⊞][☰]

┌─────────────────────────────────────┐
│ 📄 Calculus Notes Chapter 5      ☆ │
│ PDF • 2.5 MB                        │
│ [#calculus] [#derivatives]          │
│ ⭐ 4.5   ⬇️ 156                     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ 🎥 Physics Lab Demo Video        ⭐ │
│ VIDEO • 45.2 MB                     │
│ [#mechanics] [#experiments]         │
│ ⭐ 4.8   ⬇️ 203                     │
└─────────────────────────────────────┘
```

### Data Fetched
1. `study_materials` table - all materials
2. `user_bookmarks` table - bookmarked items
3. Filters applied client-side

### User Interactions
- Search input → Filter materials
- Tap filter chip → Apply filter
- Tap subject → Filter by subject
- Tap view toggle → Change layout
- Tap star → Toggle bookmark
- Tap material card → Open/download material
- Pull to refresh → Reload materials

---

## 📱 SCREEN 5: Schedule/Classes
**File:** `NewEnhancedSchedule.tsx`
**Role:** Calendar and class schedule
**Navigation:** Bottom Tab (Schedule icon)

### Purpose
View weekly schedule, today's classes, upcoming events, and join live classes.

### Features List
1. **Header with Week Navigation**
   - Current week range display
   - Previous week button (<)
   - "Today" button
   - Next week button (>)

2. **Week Calendar**
   - 7-day horizontal layout
   - Day labels (Mon-Sun)
   - Date numbers (1-7)
   - Current day highlighted (primary color circle)

3. **Today's Events Section**
   - Section title with count

4. **Live Class Card (Special Design)**
   - Gradient background (primary color)
   - Pulsing red dot indicator
   - "LIVE" badge
   - Students online count
   - Class subject and topic
   - Teacher name and room
   - "Join Live Class" button
   - White section below with:
     - Start time
     - Duration
     - "Add to Calendar" button

5. **Scheduled Event Cards**
   - Time column (left aligned)
   - Event emoji (⚡ for test, 🧪 for lab)
   - Event title and description
   - Badge (Test, Lab Session, etc.)
   - Duration and room info

6. **Upcoming This Week Section**
   - 3 upcoming events
   - Event title
   - Day and time (e.g., "Tomorrow • 10:00 AM")
   - "Scheduled" badge

### UI/UX Design
```
┌─────────────────────────────────────┐
│ My Schedule                         │
│ Week: Jan 1 - Jan 7, 2025           │
│ [<] [Today] [>]                     │
└─────────────────────────────────────┘

Week Calendar
┌─────────────────────────────────────┐
│ Mon Tue Wed Thu Fri Sat Sun         │
│  1   2  [3]  4   5   6   7          │
│          ●                          │
└─────────────────────────────────────┘

📚 Today's Events
┌─────────────────────────────────────┐
│ [Gradient Card - Primary]           │
│ 🔴 LIVE • 32 students online        │
│ Math - Calculus Basics              │
│ Mr. Sharma • Room: A-101            │
│ [📹 Join Live Class]                │
├─────────────────────────────────────┤
│ Start: 2:00 PM | Duration: 1.5 hrs  │
│ [📅 Add to Calendar]                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 11:00  ⚡ Physics Test              │
│ AM     Mechanics - Chapter 1-5      │
│        [Test] Duration: 1.5 hrs     │
└─────────────────────────────────────┘

📅 Upcoming This Week
┌─────────────────────────────────────┐
│ Biology - Genetics                  │
│ Tomorrow • 10:00 AM     [Scheduled] │
├─────────────────────────────────────┤
│ English Literature                  │
│ Friday • 11:30 AM       [Scheduled] │
└─────────────────────────────────────┘
```

### Data Fetched
1. `class_sessions` table - today's schedule
2. Filtered by date range
3. Status calculated (live, upcoming, completed)

### User Interactions
- Tap week navigation → Change week
- Tap "Today" → Jump to current week
- Tap day in calendar → Filter by day
- Tap "Join Live Class" → Navigate to LiveClass
- Tap event card → View event details
- Tap "Add to Calendar" → Export to device calendar
- Pull to refresh → Reload schedule

---

## 📱 SCREEN 6: AI Learning Dashboard
**File:** `NewAILearningDashboard.tsx`
**Role:** AI-powered study insights
**Navigation:** From Dashboard Quick Access

### Purpose
AI-generated learning recommendations, weak areas, study plan suggestions.

### Features List
1. **AI Insights Header**
   - Gradient background
   - AI brain/sparkles icon
   - "Your AI Study Insights" title

2. **Learning Analytics**
   - Time spent studying (weekly chart)
   - Subjects breakdown pie chart
   - Focus areas identification

3. **Weak Areas Detection**
   - AI-identified weak topics
   - Subject and chapter
   - Recommended resources
   - Practice test links

4. **Personalized Study Plan**
   - Daily schedule generated by AI
   - Time blocks for subjects
   - Break reminders
   - Difficulty-adjusted content

5. **AI Recommendations**
   - Suggested study materials
   - Video tutorials
   - Practice problems
   - Peer study partners

6. **Progress Predictions**
   - Expected grades based on current performance
   - Improvement suggestions
   - Milestone tracker

### UI/UX Design
```
┌─────────────────────────────────────┐
│ [Gradient - Blue/Purple]            │
│ ✨ Your AI Study Insights           │
└─────────────────────────────────────┘

📊 Learning Analytics
┌─────────────────────────────────────┐
│ Weekly Study Time: 12.5 hrs         │
│ [Bar Chart - 7 days]                │
│ Math: 35% | Physics: 30% | Chem: 35%│
└─────────────────────────────────────┘

🎯 AI-Detected Weak Areas
┌─────────────────────────────────────┐
│ ⚠️ Physics - Thermodynamics         │
│ Accuracy: 65% (Needs improvement)   │
│ [📚 Recommended Resources]          │
│ [📝 Practice Test]                  │
└─────────────────────────────────────┘

📅 Personalized Study Plan
┌─────────────────────────────────────┐
│ Today's Plan:                       │
│ 09:00 - Math (Calculus) - 1.5 hrs  │
│ 11:00 - Break - 15 mins             │
│ 11:15 - Physics (Mechanics) - 1 hr  │
│ [Start Studying]                    │
└─────────────────────────────────────┘

🎓 AI Recommendations
┌─────────────────────────────────────┐
│ Based on your progress:             │
│ • Watch: "Derivatives Explained"    │
│ • Practice: 20 Mechanics Problems   │
│ • Study with: Sarah J. (Match: 85%) │
└─────────────────────────────────────┘
```

### Data Fetched
1. `submissions` table - performance data
2. `study_sessions` table - time tracking
3. AI algorithm calculates weak areas

### User Interactions
- Tap weak area → View resources
- Tap practice test → Start test
- Tap study plan → Navigate to timer
- Tap recommendation → Open resource

---

## 📱 SCREEN 7: AI Tutor Chat
**File:** `NewAITutorChat.tsx` / `NewEnhancedAIStudy.tsx`
**Role:** Interactive AI assistant
**Navigation:** From Dashboard or Study Library

### Purpose
Chat with AI tutor for doubts, explanations, and study help.

### Features List
1. **Chat Header**
   - AI avatar/icon
   - "AI Tutor" title
   - Online status indicator

2. **Message Bubbles**
   - Student messages (right, blue)
   - AI responses (left, gray)
   - Timestamps
   - Markdown formatting support
   - Code syntax highlighting

3. **Quick Questions**
   - Pre-defined question chips
   - "Explain this concept"
   - "Solve this problem"
   - "Give me examples"

4. **Input Features**
   - Text input field
   - Image upload (snap question)
   - Voice input
   - LaTeX math support

5. **AI Capabilities**
   - Step-by-step solutions
   - Concept explanations
   - Video recommendations
   - Practice problems
   - Related topics suggestions

6. **Chat History**
   - Saved conversations
   - Search previous chats
   - Bookmark important answers

### UI/UX Design
```
┌─────────────────────────────────────┐
│ ← AI Tutor                     🟢   │
└─────────────────────────────────────┘

             ┌──────────────────────┐
             │ Hi! How can I help   │
             │ you study today?     │
             └──────────────────────┘
             10:30 AM

Quick Questions:
[Explain concept][Solve problem][Examples]

┌──────────────────────┐
│ Explain derivatives  │
└──────────────────────┘
             10:31 AM

             ┌──────────────────────┐
             │ A derivative measures│
             │ the rate of change...│
             │ [Step-by-step guide] │
             │ [Watch video]        │
             │ [Practice problems]  │
             └──────────────────────┘
             10:31 AM

┌─────────────────────────────────────┐
│ 💬 Type your question...      📷 🎤│
└─────────────────────────────────────┘
```

### Data Fetched
1. Chat history from local storage
2. AI responses from API
3. Related resources from `study_materials`

### User Interactions
- Type message → Send to AI
- Tap image icon → Upload question photo
- Tap microphone → Voice input
- Tap quick question → Auto-fill
- Tap resource link → Open material
- Long press message → Copy/bookmark

---

## 📱 SCREEN 8: Live Class Screen
**File:** `NewLiveClassScreen.tsx` / `NewEnhancedLiveClass.tsx`
**Role:** Video conferencing classroom
**Navigation:** From Dashboard live class card

### Purpose
Attend live video classes with teacher and classmates.

### Features List
1. **Video Grid**
   - Teacher video (large, pinned)
   - Student videos (grid layout)
   - Self video (small, moveable)
   - Screen share support

2. **Class Controls**
   - Mute/Unmute microphone
   - Turn on/off camera
   - Raise hand button
   - Leave class button

3. **Chat Panel**
   - Live text chat
   - Send messages to all
   - Private message teacher
   - Emoji reactions

4. **Whiteboard**
   - Shared whiteboard view
   - Drawing tools
   - Annotations
   - Save/export feature

5. **Attendance Tracking**
   - Auto mark present on join
   - Duration tracking
   - Participation score

6. **Class Info Bar**
   - Class subject and topic
   - Time elapsed
   - Student count
   - Recording indicator

7. **Reactions**
   - Quick emoji reactions (👍, 👏, ❤️)
   - Display floating on screen
   - Celebrate achievements

### UI/UX Design
```
┌─────────────────────────────────────┐
│ Math - Calculus          [●REC] 45m │
│ 32 students online                  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│                                     │
│       [Teacher Video - Large]       │
│                                     │
├─────────────────────────────────────┤
│ [Stud1][Stud2][Stud3][Stud4][You]  │
└─────────────────────────────────────┘

Chat Panel (Right Side)
┌───────────────┐
│ Teacher: Today│
│ we'll learn...│
├───────────────┤
│ Sarah: 👍     │
├───────────────┤
│ You: Question?│
└───────────────┘

Controls (Bottom)
[🎤 Mute][📹 Camera][✋ Raise Hand][💬 Chat][📋 Whiteboard][❌ Leave]

Quick Reactions:
[👍][👏][❤️][🎉]
```

### Data Fetched
1. `live_sessions` table - class details
2. Video SDK (e.g., Agora, Stream.io)
3. Real-time chat messages

### User Interactions
- Tap mute → Toggle audio
- Tap camera → Toggle video
- Tap raise hand → Notify teacher
- Type in chat → Send message
- Tap reaction → Send emoji
- Tap whiteboard → Open whiteboard view
- Tap leave → Exit class with confirmation

---

## 📱 SCREEN 9: Virtual Classroom
**File:** `NewVirtualClassroom.tsx` / `NewInteractiveClassroom.tsx`
**Role:** Interactive learning space
**Navigation:** From Schedule or Dashboard

### Purpose
Immersive classroom with polls, quizzes, and collaborative tools.

### Features List
1. **Classroom Header**
   - Subject and topic
   - Teacher name
   - Class duration timer

2. **Interactive Whiteboard**
   - Teacher can draw/write
   - Students can annotate
   - Math equation support
   - Diagram tools

3. **Live Polls**
   - Multiple choice questions
   - Real-time results
   - Percentage display
   - Student response tracking

4. **Quick Quizzes**
   - MCQ pop-ups during class
   - Instant feedback
   - Leaderboard display
   - Points awarded

5. **Breakout Rooms**
   - Small group discussions
   - Timer countdown
   - Switch between rooms
   - Report back feature

6. **Resource Sharing**
   - Teacher shares PDFs
   - Links in chat
   - Download materials
   - Screen share

7. **Participation Tracker**
   - Points for answers
   - Engagement score
   - Badges earned
   - Weekly leaderboard

### UI/UX Design
```
┌─────────────────────────────────────┐
│ Physics - Mechanics | Mr. Sharma    │
│ Duration: 45 mins elapsed           │
└─────────────────────────────────────┘

[Whiteboard Area - Large]
┌─────────────────────────────────────┐
│                                     │
│  F = ma                             │
│  [Diagram of forces]                │
│                                     │
└─────────────────────────────────────┘

[Live Poll Active]
┌─────────────────────────────────────┐
│ What is Newton's 2nd Law?           │
│ A) F = ma          [████░] 65%      │
│ B) E = mc²         [█░░░░] 15%      │
│ C) v = u + at      [██░░░] 20%      │
│ ✓ Your answer: A                    │
│ 28/32 students responded            │
└─────────────────────────────────────┘

[Quiz Popup]
┌─────────────────────────────────────┐
│ 🎯 Quick Quiz!                      │
│ If mass = 5kg, acceleration = 2m/s²,│
│ what is force?                      │
│ [A) 10N] [B) 7N] [C) 3N] [D) 2.5N]  │
│ ⏱️ 30 seconds remaining             │
└─────────────────────────────────────┘

Your Score: 450 pts | 🏆 Rank: 3rd
```

### Data Fetched
1. `live_sessions` table - session info
2. Real-time poll/quiz data
3. Participation scores

### User Interactions
- Vote in poll → Submit answer
- Answer quiz → Earn points
- Draw on whiteboard → Annotate
- Join breakout room → Switch view
- Download resource → Save locally
- View leaderboard → Check rank

---

## 📱 SCREEN 10: Assignment Detail
**File:** `NewAssignmentDetailScreen.tsx`
**Role:** View and submit assignments
**Navigation:** From Dashboard assignments

### Purpose
View assignment instructions, upload submissions, track deadline.

### Features List
1. **Assignment Header**
   - Subject and title
   - Teacher name
   - Due date countdown
   - Points/marks total

2. **Status Badge**
   - Not Started
   - In Progress
   - Submitted
   - Graded

3. **Instructions Section**
   - Assignment description
   - Requirements list
   - Attached files (PDFs)
   - Video instructions

4. **Submission Area**
   - File upload (PDF, images)
   - Text editor for written answers
   - Multiple file support
   - Preview uploaded files

5. **Deadline Timer**
   - Countdown (days, hours, mins)
   - Color changes (green → yellow → red)
   - Late submission warning

6. **Grading Section (after submission)**
   - Points received
   - Feedback from teacher
   - Rubric breakdown
   - Download graded copy

7. **Action Buttons**
   - Save Draft
   - Submit Assignment
   - Request Extension

### UI/UX Design
```
┌─────────────────────────────────────┐
│ ← Mathematics Assignment            │
│ Due: Jan 10, 2025 • 50 points       │
│ [In Progress]                       │
└─────────────────────────────────────┘

⏰ Time Remaining: 2 days, 5 hours

📋 Instructions
┌─────────────────────────────────────┐
│ Solve problems 1-20 from Chapter 5  │
│ Show all working steps              │
│                                     │
│ Requirements:                       │
│ ✓ Handwritten or typed solutions   │
│ ✓ Submit as single PDF              │
│ ✓ Include diagrams where needed    │
│                                     │
│ [📄 Question Paper.pdf]             │
│ [🎥 Instructions Video]             │
└─────────────────────────────────────┘

📤 Your Submission
┌─────────────────────────────────────┐
│ [+ Upload File] [📷 Scan Document]  │
│                                     │
│ Uploaded:                           │
│ • Solutions_Page1.pdf  [🗑️]         │
│ • Solutions_Page2.pdf  [🗑️]         │
└─────────────────────────────────────┘

[Save Draft] [Submit Assignment]

After Submission:
✅ Submitted on Jan 8, 2025

📊 Grading
┌─────────────────────────────────────┐
│ Score: 47/50 (94%)          [Grade A]│
│                                     │
│ Teacher Feedback:                   │
│ "Excellent work! Minor error in Q15"│
│                                     │
│ Rubric:                             │
│ • Accuracy: 23/25                   │
│ • Working Steps: 20/20              │
│ • Presentation: 4/5                 │
└─────────────────────────────────────┘
```

### Data Fetched
1. `assignments` table - details
2. `submissions` table - student submission
3. `files` storage - uploaded files

### User Interactions
- Tap upload → Select files
- Tap camera → Scan document
- Tap submit → Confirm and upload
- Tap save draft → Save progress
- Tap file → Preview/download
- Tap delete → Remove file

---

## 📱 SCREEN 11: Class Detail
**File:** `NewClassDetailScreen.tsx`
**Role:** Individual class information
**Navigation:** From Dashboard class card

### Purpose
View details of a specific class session including materials and recordings.

### Features List
1. **Class Header**
   - Subject and topic
   - Teacher info with avatar
   - Date and time
   - Duration
   - Room/location

2. **Status Section**
   - Live indicator (if ongoing)
   - Scheduled time
   - Completed timestamp
   - Recording available

3. **Class Materials**
   - Lecture slides (PDF)
   - Notes shared by teacher
   - Reference links
   - Download all button

4. **Attendance**
   - Your status (Present/Absent)
   - Total students present
   - Late arrival marker

5. **Class Recording**
   - Video player
   - Playback controls
   - Timestamps for topics
   - Download option

6. **Related Assignments**
   - Homework assigned
   - Due dates
   - Quick links to submit

7. **Actions**
   - Join class (if live)
   - View recording
   - Download materials
   - Ask doubt about class

### UI/UX Design
```
┌─────────────────────────────────────┐
│ ← Mathematics                       │
│ Calculus - Derivatives              │
└─────────────────────────────────────┘

👨‍🏫 Teacher: Mr. Sharma
📅 Jan 8, 2025 • 2:00 PM - 3:30 PM
📍 Room: A-101
⏱️ Duration: 1.5 hours

[🔴 LIVE NOW - Join Class]
or
[✅ Completed] Attendance: Present

📚 Class Materials
┌─────────────────────────────────────┐
│ 📄 Lecture Slides.pdf               │
│ 📝 Class Notes.pdf                  │
│ 🔗 Reference: Khan Academy - Calc   │
│                      [Download All] │
└─────────────────────────────────────┘

🎥 Class Recording (Available)
┌─────────────────────────────────────┐
│ [▶️ Video Player]                   │
│ ═══════════════○────── 45:30 / 90:00│
│                                     │
│ Chapters:                           │
│ • 00:00 - Introduction              │
│ • 15:30 - Concept Explanation       │
│ • 45:00 - Solved Examples           │
│ [⬇️ Download Recording]             │
└─────────────────────────────────────┘

📝 Related Assignments
┌─────────────────────────────────────┐
│ Derivative Practice Problems        │
│ Due: Tomorrow                 [View]│
└─────────────────────────────────────┘
```

### Data Fetched
1. `live_sessions` table - class info
2. `class_materials` table - resources
3. `attendance` table - presence record
4. `recordings` storage - video URL

### User Interactions
- Tap "Join Class" → Navigate to LiveClass
- Tap recording → Play video
- Tap material → Download/view
- Tap assignment → Navigate to detail
- Tap timestamp → Jump to video position

---

## 📱 SCREEN 12: Doubt Submission
**File:** `NewDoubtSubmission.tsx` / `NewSimpleDoubt.tsx`
**Role:** Ask questions to teachers
**Navigation:** From Dashboard Quick Access

### Purpose
Submit doubts/questions with images or text to teachers.

### Features List
1. **Subject Selection**
   - Dropdown of subjects
   - Auto-suggest teacher

2. **Doubt Form**
   - Title/question field
   - Detailed description
   - Text editor with formatting

3. **Image Upload**
   - Camera capture
   - Gallery selection
   - Multiple images support
   - Crop/annotate tools

4. **Priority Level**
   - Urgent (get response in 2 hours)
   - Normal (24 hours)
   - Low priority

5. **AI Suggestions**
   - Similar doubts already answered
   - Suggested resources
   - "Try this first" prompts

6. **Submission Tracking**
   - Status (Pending, Answered, Resolved)
   - Time since submission
   - Notification on answer

7. **My Doubts List**
   - History of all doubts
   - Filter by status/subject
   - Search doubts

### UI/UX Design
```
┌─────────────────────────────────────┐
│ ← Ask a Doubt                       │
└─────────────────────────────────────┘

📚 Select Subject
┌─────────────────────────────────────┐
│ [Mathematics ▼]                     │
│ Teacher: Mr. Sharma                 │
└─────────────────────────────────────┘

❓ Your Question
┌─────────────────────────────────────┐
│ Title: How to solve derivatives?    │
│                                     │
│ Description:                        │
│ I'm stuck on question 15...         │
│ [Text editor with formatting]       │
└─────────────────────────────────────┘

📷 Add Images (Optional)
┌─────────────────────────────────────┐
│ [+ Camera] [+ Gallery]              │
│                                     │
│ [Image 1] [Image 2]                 │
└─────────────────────────────────────┘

⚡ Priority
[Urgent] [Normal] [Low]

💡 AI Suggestions
┌─────────────────────────────────────┐
│ Similar doubts:                     │
│ • "Derivative rules explained"      │
│ • "Step-by-step derivative guide"   │
│                                     │
│ Suggested resources:                │
│ • Chapter 5 - Derivatives PDF       │
│ • Video: Khan Academy - Derivatives │
└─────────────────────────────────────┘

[Submit Doubt]

My Doubts History:
┌─────────────────────────────────────┐
│ [Answered] Derivative question      │
│ Math • 2h ago                       │
├─────────────────────────────────────┤
│ [Pending] Thermodynamics help       │
│ Physics • 5h ago                    │
└─────────────────────────────────────┘
```

### Data Fetched
1. `subjects` table - dropdown
2. `doubts` table - submissions
3. `doubt_responses` table - answers
4. AI: similar doubts from vector search

### User Interactions
- Select subject → Show teacher
- Type question → Auto-save draft
- Tap camera → Capture image
- Select priority → Set urgency
- Tap similar doubt → View answer
- Submit → Confirm and upload
- Tap doubt card → View answer

---

## 📱 SCREEN 13: Gamified Learning Hub
**File:** `NewGamifiedLearningHub.tsx`
**Role:** Rewards and achievements
**Navigation:** From Dashboard or Profile

### Purpose
Track achievements, earn badges, compete on leaderboards.

### Features List
1. **Profile Card**
   - Avatar and name
   - Total XP points
   - Current level
   - Progress to next level

2. **Daily Streak**
   - Consecutive days studied
   - Streak counter
   - Rewards for milestones

3. **Badges Earned**
   - Achievement badges (grid)
   - Locked vs unlocked
   - Badge descriptions
   - Rarity levels (bronze, silver, gold)

4. **Leaderboard**
   - Weekly ranking
   - Top 10 students
   - Your rank highlighted
   - XP points display

5. **Challenges**
   - Active challenges
   - Daily/weekly tasks
   - Rewards preview
   - Progress bars

6. **Rewards Shop**
   - Redeem points for:
     - Profile themes
     - Special badges
     - Avatar items
     - Study perks

7. **Activity Feed**
   - Recent achievements
   - Friends' activities
   - Milestone celebrations

### UI/UX Design
```
┌─────────────────────────────────────┐
│ 🎮 Gamified Learning Hub            │
└─────────────────────────────────────┘

Your Profile
┌─────────────────────────────────────┐
│ [Avatar]  Raj Kumar                 │
│ Level 15 • 2,450 XP                 │
│ ████████████░░░░░ 75% to Level 16   │
└─────────────────────────────────────┘

🔥 Daily Streak: 7 days
[Mon][Tue][Wed][Thu][Fri][Sat][Sun]
 ✓    ✓    ✓    ✓    ✓    ✓    ✓

🏆 Badges Earned (12/50)
┌─────────────────────────────────────┐
│ [🥇] [🥈] [🥉] [🎯] [📚] [⭐]       │
│ [🔥] [💯] [🎓] [🏅] [🌟] [💪]       │
│                                     │
│ [🔒] [🔒] [🔒] ... 38 more locked   │
└─────────────────────────────────────┘

📊 Weekly Leaderboard
┌─────────────────────────────────────┐
│ 1. Sarah Johnson      3,250 XP  🥇 │
│ 2. Mike Chen          2,980 XP  🥈 │
│ 3. You                2,450 XP  🥉 │
│ 4. Emma Davis         2,180 XP     │
│ 5. Alex Kim           1,950 XP     │
└─────────────────────────────────────┘

⚡ Active Challenges
┌─────────────────────────────────────┐
│ Complete 5 tests this week          │
│ ████░░░░░░ 3/5                      │
│ Reward: +500 XP, Test Master Badge  │
├─────────────────────────────────────┤
│ Study 10 hours                      │
│ ██████░░░░ 6.5/10 hrs               │
│ Reward: +300 XP                     │
└─────────────────────────────────────┘

🎁 Rewards Shop
┌─────────────────────────────────────┐
│ [Theme: Ocean Blue] - 1,000 XP      │
│ [Avatar: Scientist] - 500 XP        │
│ [Badge: Einstein] - 2,000 XP        │
└─────────────────────────────────────┘
```

### Data Fetched
1. `student_xp` table - points
2. `badges` table - achievements
3. `leaderboard` view - rankings
4. `challenges` table - tasks

### User Interactions
- View badge → See requirements
- Tap challenge → View details
- Tap shop item → Redeem with points
- Tap leaderboard → View full list
- Complete challenge → Earn reward

---

## 📱 SCREEN 14: Collaborative Assignment
**File:** `NewCollaborativeAssignment.tsx`
**Role:** Group assignments
**Navigation:** From Assignments list

### Purpose
Work on assignments with classmates in real-time collaboration.

### Features List
1. **Group Members**
   - List of team members
   - Online status indicators
   - Role assignments (leader, member)
   - Avatar circles

2. **Shared Document**
   - Real-time collaborative editor
   - Cursor tracking (see who's editing)
   - Version history
   - Auto-save

3. **Task Distribution**
   - Divide assignment into sections
   - Assign sections to members
   - Track completion status
   - Workload balance view

4. **Group Chat**
   - Text messaging
   - File sharing
   - @mentions
   - Reply threads

5. **Contribution Tracker**
   - Who did what
   - Percentage contribution
   - Edit history
   - Time spent by each member

6. **Submission Management**
   - Group approval required
   - Vote to submit
   - Combine all sections
   - Single submission

### UI/UX Design
```
┌─────────────────────────────────────┐
│ ← Group Assignment: Physics Project │
│ Due: Jan 15, 2025 • 100 points      │
└─────────────────────────────────────┘

👥 Group Members (4)
┌─────────────────────────────────────┐
│ 🟢 You (Leader)                     │
│ 🟢 Sarah J. (Section 1)             │
│ 🔴 Mike C. (Section 2) - Offline    │
│ 🟢 Emma D. (Section 3)              │
└─────────────────────────────────────┘

📝 Shared Document
┌─────────────────────────────────────┐
│ [Real-time Editor]                  │
│                                     │
│ Introduction (Your Section)         │
│ [You are typing...] |               │
│                                     │
│ Section 1: Laws of Motion (Sarah)   │
│ [Sarah is editing...]               │
│                                     │
│ Section 2: Applications (Mike)      │
│ [Not started]                       │
└─────────────────────────────────────┘

📊 Task Distribution
┌─────────────────────────────────────┐
│ ✅ Introduction - You (100%)        │
│ 🔄 Section 1 - Sarah (65%)          │
│ ⏸️ Section 2 - Mike (0%)            │
│ 🔄 Section 3 - Emma (45%)           │
└─────────────────────────────────────┘

💬 Group Chat
┌─────────────────────────────────────┐
│ You: @Sarah, great work on Section 1│
│ Sarah: Thanks! Need help with diagrams│
│ Emma: I can help with that          │
└─────────────────────────────────────┘

📈 Contribution (Auto-tracked)
You: 30% | Sarah: 35% | Mike: 10% | Emma: 25%

[Save Draft] [Request Review] [Submit (Needs 3 votes)]
```

### Data Fetched
1. `assignments` table - group assignment
2. `group_members` table - team
3. Real-time DB for collaborative editing
4. `group_contributions` table

### User Interactions
- Type in editor → Real-time sync
- Assign task → Notify member
- Send message → Group chat
- Vote submit → Increment counter
- View history → See changes

---

## 📱 SCREEN 15: Activity Detail
**File:** `NewActivityDetail.tsx`
**Role:** Expanded view of dashboard activities
**Navigation:** From Dashboard activity feed

### Purpose
View detailed information about an activity/notification.

### Features List
1. **Activity Header**
   - Activity type icon
   - Title
   - Timestamp
   - Status badge

2. **Activity Types:**
   - **Grade Received**
     - Assignment/test name
     - Score and total
     - Grade letter
     - Teacher feedback
     - Rubric breakdown

   - **Assignment Submitted**
     - Submission time
     - Files uploaded
     - Auto-grading results (if applicable)

   - **Doubt Resolved**
     - Original question
     - Teacher answer
     - Solution steps
     - Mark as helpful

   - **Badge Earned**
     - Badge image
     - Description
     - Unlock date
     - Share achievement

3. **Related Actions**
   - View full assignment
   - Download certificate
   - Share on social
   - Archive activity

### UI/UX Design
```
┌─────────────────────────────────────┐
│ ← Grade Received                    │
│ 2 hours ago                   [New] │
└─────────────────────────────────────┘

📊 Mathematics - Calculus Test
┌─────────────────────────────────────┐
│ Your Score: 95/100                  │
│ Grade: A                            │
│ Class Average: 78/100               │
│ Rank: 2/35                          │
└─────────────────────────────────────┘

👨‍🏫 Teacher Feedback
┌─────────────────────────────────────┐
│ "Excellent work, Raj! Your approach │
│ to solving derivatives was perfect. │
│ Minor calculation error in Q8.      │
│ Keep up the great work!"            │
│                                     │
│ - Mr. Sharma                        │
└─────────────────────────────────────┘

📋 Rubric Breakdown
┌─────────────────────────────────────┐
│ Concept Understanding  25/25  ✅    │
│ Problem Solving       22/25  ✅    │
│ Working Steps         23/25  ✅    │
│ Accuracy              20/25  ⚠️    │
│ Presentation           5/5   ✅    │
└─────────────────────────────────────┘

[View Full Test] [Download Report] [Share]

---

For "Badge Earned" Activity:
┌─────────────────────────────────────┐
│        [🏆 Large Badge Image]       │
│                                     │
│     🎓 Test Master Badge 🎓         │
│                                     │
│ "Completed 10 tests with >90% avg"  │
│                                     │
│ Unlocked: Jan 8, 2025               │
│ Rarity: Gold                        │
│                                     │
│ [Share Achievement] [View All Badges]│
└─────────────────────────────────────┘
```

### Data Fetched
1. `activities` table - activity details
2. Related tables based on type
3. `submissions`, `badges`, `doubts`

### User Interactions
- Tap "View Full Test" → Navigate to assignment
- Tap "Download Report" → Save PDF
- Tap "Share" → Social sharing
- Tap "Mark as helpful" → Rate response

---

## 📱 SCREEN 16: Schedule Screen (Advanced Calendar)
**File:** `NewScheduleScreen.tsx`
**Role:** Advanced calendar with view modes and filters
**Navigation:** Bottom Tab (Classes icon) - Initial Screen

### Purpose
Comprehensive schedule view with week/day/month/agenda modes, advanced filtering, sorting, and persistent settings.

### Features List
1. **View Mode Selector (4 modes)**
   - Week view (default)
   - Day view
   - Month view
   - Agenda list view
   - Toggle buttons at top

2. **Week Navigation Header**
   - Current week range (Jan 1 - Jan 7)
   - Previous week button (<)
   - "Today" jump button
   - Next week button (>)
   - Week picker calendar modal

3. **Status Filter Chips**
   - All (default)
   - Upcoming
   - Live
   - Completed
   - Badge count display

4. **Subject Filter Dropdown**
   - All Subjects
   - Dynamic list from classes
   - Filter class cards

5. **Sort & Settings**
   - Sort modal (Time, Subject, Teacher)
   - Settings modal:
     - Show weekends toggle
     - Show deadlines toggle
     - Default view preference
     - Default reminder time
     - Sync with device calendar

6. **Week View Layout**
   - 7-day horizontal scroll
   - Day cards (Mon-Sun)
   - Date numbers
   - Class count per day
   - Current day highlighted

7. **Class Cards (Enhanced)**
   - Subject and topic
   - Teacher name with avatar
   - Time range (2:00 PM - 3:30 PM)
   - Duration badge
   - Status indicator (Live, Scheduled, Ended)
   - Priority flag (High/Medium/Low)
   - Meeting link preview
   - Quick actions:
     - Join class (if live)
     - View details
     - Add reminder
     - Share

8. **Empty State Messages**
   - No classes today
   - No classes this week
   - Filtered results empty

9. **AsyncStorage Caching**
   - Save/load user settings
   - Remember last view mode
   - Cache preferences

### UI/UX Design
```
┌─────────────────────────────────────┐
│ My Schedule          [⊞][☰][📅][⚙️] │
│ Week: Jan 1 - Jan 7, 2025           │
│ [<]     [Today]     [>]             │
└─────────────────────────────────────┘

[All][Upcoming][Live][Completed]
[All Subjects ▼]

Week View:
┌─────────────────────────────────────┐
│ [Mon 1] [Tue 2] [Wed 3] [Thu 4]...  │
│  2 cls   3 cls  [5 cls]  1 cls      │
│                   ●                 │
└─────────────────────────────────────┘

Today's Classes (5):
┌─────────────────────────────────────┐
│ [🔴 LIVE] Mathematics               │
│ Calculus - Derivatives              │
│ Mr. Sharma                          │
│ 2:00 PM - 3:30 PM | 1.5 hrs   [High]│
│ 📍 Room A-101 | 32 students         │
│ [📹 Join Class] [Details]           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ [Scheduled] Physics                 │
│ Thermodynamics Lab                  │
│ Dr. Patel                           │
│ 4:00 PM - 5:30 PM | 1.5 hrs         │
│ 📍 Lab B-203                        │
│ [Set Reminder] [View Details]       │
└─────────────────────────────────────┘

Settings Modal:
┌─────────────────────────────────────┐
│ Schedule Settings                   │
│                                     │
│ Show weekends          [Toggle ON]  │
│ Show deadlines         [Toggle ON]  │
│ Default view           [Week ▼]     │
│ Reminder time          [15 min ▼]   │
│ Sync calendar          [Toggle OFF] │
│                                     │
│ [Save Settings]                     │
└─────────────────────────────────────┘
```

### Data Fetched
1. `class_sessions` table - filtered by week
2. `teachers` table - joined for names
3. AsyncStorage - user settings
4. Calculated: status (live/upcoming/completed)

### User Interactions
- Tap view mode → Change layout
- Tap week nav → Load different week
- Tap "Today" → Jump to current date
- Tap status filter → Apply filter
- Tap subject → Filter classes
- Tap sort icon → Open sort modal
- Tap settings → Open settings modal
- Tap class card → Navigate to ClassDetail
- Tap "Join Class" → Navigate to LiveClass
- Pull to refresh → Reload data
- Save settings → Persist to AsyncStorage

---

## 📱 SCREEN 17: AI Study Screen (Simple)
**File:** `NewAIStudyScreen.tsx`
**Role:** Basic AI recommendations without chat
**Navigation:** From Study Library AI button

### Purpose
Simplified AI study assistant showing recommendations and weak areas without full chat interface.

### Features List
1. **AI Header**
   - Sparkles/brain icon
   - "AI Study Assistant" title
   - Last updated timestamp

2. **Quick Stats (3 cards)**
   - Total study hours (this week)
   - Tests completed
   - Average score

3. **Weak Areas Section**
   - AI-detected weak topics
   - Subject and chapter
   - Accuracy percentage (e.g., 65%)
   - Priority level (Urgent, Medium, Low)
   - "Practice Now" button
   - Recommended resources

4. **Recommended Actions**
   - Prioritized to-do list
   - "Complete 3 practice tests"
   - "Review thermodynamics notes"
   - "Watch derivatives video"
   - Progress checkboxes

5. **Study Suggestions**
   - Resource cards
   - Video tutorials
   - Practice problem sets
   - Study material PDFs
   - Estimated time to complete

6. **Progress Predictions**
   - Expected grade this semester
   - Improvement percentage
   - Areas to focus
   - Study plan recommendations

### UI/UX Design
```
┌─────────────────────────────────────┐
│ ✨ AI Study Assistant               │
│ Updated: 2 hours ago                │
└─────────────────────────────────────┘

Quick Stats:
┌──────┐ ┌──────┐ ┌──────┐
│📊 12h│ │✅ 8  │ │⭐ 88%│
│Study │ │Tests │ │Score │
└──────┘ └──────┘ └──────┘

⚠️ AI-Detected Weak Areas
┌─────────────────────────────────────┐
│ Physics - Thermodynamics       [High]│
│ Accuracy: 65% (Needs improvement)   │
│ Last attempted: 3 days ago          │
│ [Practice Now] [View Resources]     │
├─────────────────────────────────────┤
│ Math - Derivatives             [Med] │
│ Accuracy: 72% (Practice more)       │
│ Last attempted: 5 days ago          │
│ [Practice Now] [View Resources]     │
└─────────────────────────────────────┘

📝 Recommended Actions
┌─────────────────────────────────────┐
│ ☐ Complete 3 thermodynamics tests   │
│ ☐ Review Chapter 5 notes            │
│ ☐ Watch: "Derivatives Explained"    │
└─────────────────────────────────────┘

📚 Study Suggestions
┌─────────────────────────────────────┐
│ 🎥 Khan Academy - Thermodynamics    │
│ Duration: 45 mins | Rating: 4.8     │
│ [Watch Now]                         │
├─────────────────────────────────────┤
│ 📝 Practice Problem Set 5           │
│ 20 problems | Est. time: 1 hour    │
│ [Start Practice]                    │
└─────────────────────────────────────┘

📈 Your Progress Prediction
Expected grade this semester: A (92%)
Keep studying thermodynamics to maintain!
```

### Data Fetched
1. `submissions` table - performance history
2. `study_sessions` table - time tracking
3. AI algorithm calculates weak areas
4. `study_materials` table - recommendations

### User Interactions
- Tap weak area → View details
- Tap "Practice Now" → Start practice test
- Tap "View Resources" → Show materials
- Check action item → Mark complete
- Tap suggestion → Open resource
- Pull to refresh → Recalculate AI insights

---

## 📱 SCREEN 18: Enhanced AI Study (Full Featured)
**File:** `NewEnhancedAIStudy.tsx`
**Role:** Complete AI study suite with chat and analytics
**Navigation:** From Dashboard AI button or Study tab

### Purpose
Full-featured AI study assistant with chat interface, analytics, study plans, and resource recommendations.

### Features List
1. **AI Chat Interface (Primary)**
   - Real-time AI conversation
   - Student messages (right, blue)
   - AI responses (left, gray)
   - Markdown formatting support
   - Code syntax highlighting
   - LaTeX math equations
   - Image upload for questions

2. **Quick Question Chips**
   - "Explain this concept"
   - "Solve this problem"
   - "Give me practice questions"
   - "Summarize this chapter"
   - Tap to auto-fill

3. **Study Analytics Dashboard**
   - Weekly study time chart
   - Subject distribution pie chart
   - Focus areas heatmap
   - Completion rates
   - Streak tracking

4. **Personalized Study Plan**
   - AI-generated daily schedule
   - Time blocks for subjects
   - Break reminders
   - Adaptive difficulty
   - Progress tracking

5. **Weak Areas Deep Dive**
   - Detailed analysis per topic
   - Historical performance
   - Improvement trends
   - Targeted practice links
   - Resource recommendations

6. **AI Features**
   - Step-by-step solutions
   - Concept explanations
   - Practice problem generation
   - Video recommendations
   - Related topics suggestions
   - Study buddy matching

7. **Chat History**
   - Save conversations
   - Search previous chats
   - Bookmark answers
   - Export chat as PDF

### UI/UX Design
```
┌─────────────────────────────────────┐
│ ← AI Study Assistant           [⋮]  │
└─────────────────────────────────────┘

[Analytics][Chat][Study Plan][Resources]

Chat Tab:
             ┌──────────────────────┐
             │ Hi! I'm your AI study│
             │ assistant. Ask me    │
             │ anything!            │
             └──────────────────────┘
             10:30 AM

Quick Questions:
[Explain][Solve][Practice][Summarize]

┌──────────────────────┐
│ Explain derivatives  │
└──────────────────────┘
             10:31 AM

             ┌──────────────────────┐
             │ A derivative measures│
             │ the rate of change...│
             │                      │
             │ **Example:**         │
             │ f(x) = x²            │
             │ f'(x) = 2x           │
             │                      │
             │ [📊 View Graph]      │
             │ [📝 Practice 5 Qs]   │
             │ [🎥 Watch Video]     │
             └──────────────────────┘
             10:31 AM

┌─────────────────────────────────────┐
│ 💬 Type your question...  📷 🎤 📎 │
└─────────────────────────────────────┘

Analytics Tab:
📊 Weekly Study Analytics
┌─────────────────────────────────────┐
│ Total: 12.5 hours                   │
│ [Bar Chart - 7 days]                │
│ Mon Tue Wed Thu Fri Sat Sun         │
│  2h  1h  2h  3h  2h  1h  1.5h       │
└─────────────────────────────────────┘

📚 Subject Distribution
Math: 35% | Physics: 30% | Chemistry: 35%
[Pie Chart Visual]

Study Plan Tab:
📅 Today's AI-Generated Plan
┌─────────────────────────────────────┐
│ 09:00 - 10:30 Mathematics (Calculus)│
│       Derivatives & Integrals       │
│       Difficulty: Medium            │
│       [Start Session]               │
├─────────────────────────────────────┤
│ 10:30 - 10:45 Break                 │
│       Recommended: Walk outside 🚶  │
├─────────────────────────────────────┤
│ 10:45 - 11:45 Physics (Mechanics)   │
│       Newton's Laws Practice        │
│       Difficulty: High              │
│       [Start Session]               │
└─────────────────────────────────────┘
```

### Data Fetched
1. Chat history from local storage
2. AI responses from OpenAI/Anthropic API
3. `submissions` table - performance
4. `study_sessions` table - time tracking
5. `study_materials` table - resources

### User Interactions
- Type message → Send to AI
- Tap image icon → Upload question photo
- Tap microphone → Voice input
- Tap quick question → Auto-fill
- Tap resource link → Open material
- Tap graph → View detailed analytics
- Tap study plan → Start timer
- Long press message → Copy/bookmark
- Swipe chat → Delete message

---

## 📱 SCREEN 19: Enhanced Live Class (Full Video)
**File:** `NewEnhancedLiveClass.tsx`
**Role:** Complete live video classroom with all features
**Navigation:** From Dashboard live class button

### Purpose
Full-featured live class with video conferencing, chat, whiteboard, polls, and breakout rooms.

### Features List
1. **Video Grid Layout**
   - Teacher video (large, pinned at top)
   - Student videos (grid layout, 4-6 visible)
   - Self video (small, floating, moveable)
   - Screen share support (full screen mode)
   - Picture-in-picture

2. **Class Controls (Bottom Bar)**
   - Mute/Unmute microphone
   - Turn on/off camera
   - Raise hand button (notifies teacher)
   - Leave class button
   - Settings (audio/video quality)

3. **Live Chat Panel (Side)**
   - Text chat (send to all)
   - Private message teacher
   - Emoji reactions
   - File sharing in chat
   - @mentions
   - Chat history scroll

4. **Interactive Whiteboard**
   - View teacher's board
   - Request annotation permission
   - Drawing tools (pen, shapes, text)
   - Save screenshot
   - Clear board

5. **Live Polls**
   - Poll questions from teacher
   - Multiple choice voting
   - Real-time results
   - See class distribution
   - Answer highlight

6. **Quick Quizzes**
   - Pop-up quiz during class
   - Timer countdown
   - Instant feedback
   - Points awarded
   - Leaderboard rank

7. **Class Info Bar (Top)**
   - Subject and topic
   - Recording indicator
   - Time elapsed
   - Student count (32 online)
   - Network quality indicator

8. **Attendance Auto-Tracking**
   - Join time recorded
   - Duration tracking
   - Participation score
   - Auto mark present

9. **Reactions & Engagement**
   - Quick emoji reactions (👍, 👏, ❤️, 🎉)
   - Floating animations
   - Celebrate achievements
   - Engagement score

10. **Breakout Rooms**
    - Join small group
    - Timer for activity
    - Return to main room
    - Group chat

### UI/UX Design
```
┌─────────────────────────────────────┐
│ Math - Calculus      [●REC]    45:32│
│ 32 students • Good connection   [⚙️] │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│                                     │
│   [Teacher Video - Large Screen]   │
│   Mr. Sharma                        │
│                                     │
├─────────────────────────────────────┤
│ [Student1][Student2][Student3][You] │
│ [Student5][Student6][Student7][...]  │
└─────────────────────────────────────┘

                        Chat Panel (Right)
                        ┌───────────────┐
                        │ Teacher: Today│
                        │ we'll cover   │
                        │ derivatives   │
                        ├───────────────┤
                        │ Sarah: 👍     │
                        ├───────────────┤
                        │ You: Question?│
                        │               │
                        │ [Type here...]│
                        └───────────────┘

[Live Poll Active]
┌─────────────────────────────────────┐
│ What is f'(x) if f(x) = x²?         │
│ ○ A) x         [████░] 25%          │
│ ● B) 2x        [███████████] 65%    │
│ ○ C) x³        [█░░] 10%            │
│ ✓ You answered B                    │
│ 28/32 students responded            │
└─────────────────────────────────────┘

Controls (Bottom):
[🎤 Mute] [📹 Camera] [✋ Raise Hand] [💬 Chat]
[📋 Whiteboard] [📊 Poll] [🚪 Breakout] [❌ Leave]

Quick Reactions:
[👍][👏][❤️][🎉][💯]
```

### Data Fetched
1. `live_sessions` table - class info
2. Video SDK (Agora/Stream.io/Twilio)
3. Real-time chat messages
4. Polls from `class_polls` table
5. Attendance record

### User Interactions
- Tap mute → Toggle microphone
- Tap camera → Toggle video
- Tap raise hand → Notify teacher
- Type in chat → Send message
- Tap reaction → Send emoji
- Vote in poll → Submit answer
- Tap whiteboard → View/annotate
- Tap breakout → Join room
- Tap leave → Exit with confirmation
- Tap settings → Adjust quality

---

## 📱 SCREEN 20: Interactive Classroom (No Video)
**File:** `NewInteractiveClassroom.tsx`
**Role:** Classroom features without video conferencing
**Navigation:** From Classes tab or live class link

### Purpose
Interactive classroom focused on polls, Q&A, whiteboard, and breakout discussions without video streaming.

### Features List
1. **Tab Navigation (4 tabs)**
   - Poll tab (default)
   - Q&A tab
   - Whiteboard tab
   - Breakout Rooms tab

2. **Poll Tab**
   - Active poll question
   - Multiple choice options
   - Select answer
   - Submit vote button
   - Real-time results
   - Percentage bars
   - Total responses count
   - Your answer highlighted

3. **Q&A Tab**
   - Ask question input
   - Submit question button
   - Questions list
   - Student avatars
   - Question text
   - Timestamp
   - "Answered" badge
   - Teacher answer display
   - Like button (upvote)
   - Sort by: Recent, Popular, Unanswered

4. **Whiteboard Tab**
   - Slide viewer
   - Current slide number
   - Navigation arrows (prev/next)
   - Zoom controls
   - Download slide
   - Slide thumbnails
   - Teacher annotations visible

5. **Breakout Rooms Tab**
   - Room list (4 rooms)
   - Room name and topic
   - Member count (4/5)
   - "Full" indicator
   - "Join Room" button
   - Timer countdown
   - Current room badge
   - "Return to Main" button

6. **Raise Hand Feature**
   - Floating hand button
   - Notification to teacher
   - Position in queue
   - Called indicator

7. **Class Info Header**
   - Subject and teacher
   - Class duration elapsed
   - Total students
   - Your engagement score

8. **Participation Tracking**
   - Points for poll votes
   - Points for questions asked
   - Points for answers liked
   - Daily/weekly leaderboard

### UI/UX Design
```
┌─────────────────────────────────────┐
│ Physics - Mechanics | Mr. Sharma    │
│ Duration: 45 mins • 32 students     │
│ Your Score: 120 pts        [✋ Hand]│
└─────────────────────────────────────┘

[Poll][Q&A][Whiteboard][Breakout Rooms]

Poll Tab:
┌─────────────────────────────────────┐
│ 🎯 Active Poll                      │
│                                     │
│ What is Newton's 2nd Law?           │
│                                     │
│ ● A) F = ma         [████████] 65%  │
│ ○ B) E = mc²        [██░░░░░░] 15%  │
│ ○ C) v = u + at     [███░░░░░] 20%  │
│                                     │
│ ✓ You selected A                    │
│ 28/32 students responded            │
│                                     │
│ [View Results]                      │
└─────────────────────────────────────┘

Q&A Tab:
┌─────────────────────────────────────┐
│ ❓ Ask a Question                   │
│ ┌─────────────────────────────────┐ │
│ │ Type your question...           │ │
│ └─────────────────────────────────┘ │
│ [Submit Question]                   │
└─────────────────────────────────────┘

Questions (12):
[Recent][Popular][Unanswered]

┌─────────────────────────────────────┐
│ 👩‍🎓 Sarah J.    5 min ago    ♥️ 12  │
│ Can you explain the difference      │
│ between TCP and UDP?                │
│                            [Answered]│
│ ├─ 👨‍🏫 Teacher Response:            │
│ │   TCP is connection-oriented...   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 👨‍🎓 Mike C.     2 min ago    ♥️ 5   │
│ What are the main use cases for UDP?│
│                          [Unanswered]│
└─────────────────────────────────────┘

Whiteboard Tab:
┌─────────────────────────────────────┐
│ Slide 3/5: TCP vs UDP Comparison    │
│                                     │
│   [Large Slide Image/Diagram]       │
│                                     │
│ [<] [Slide 3/5] [>] [⬇️] [🔍+] [🔍-]│
└─────────────────────────────────────┘

Breakout Rooms Tab:
┌─────────────────────────────────────┐
│ Room 1: TCP Protocol Discussion     │
│ 👥 4/5 members            [Join Room]│
├─────────────────────────────────────┤
│ Room 2: UDP Protocol Discussion     │
│ 👥 3/5 members            [Join Room]│
├─────────────────────────────────────┤
│ Room 3: Network Security            │
│ 👥 5/5 members (Full)     [Full]    │
├─────────────────────────────────────┤
│ Room 4: Routing Algorithms          │
│ 👥 2/5 members            [Join Room]│
└─────────────────────────────────────┘

⏱️ Breakout activity: 15:00 remaining
```

### Data Fetched
1. `class_polls` table - active polls
2. `class_questions` table - Q&A
3. `whiteboard_slides` storage - slides
4. `breakout_rooms` table - rooms
5. Real-time updates for participation

### User Interactions
- Tap tab → Switch view
- Select poll option → Vote
- Type question → Submit
- Tap like → Upvote question
- Swipe slides → Navigate
- Tap zoom → Enlarge slide
- Tap "Join Room" → Enter breakout
- Tap "Raise Hand" → Notify teacher
- Pull to refresh → Reload content

---

## 📱 SCREEN 21: AI Learning Dashboard (Analytics Focus)
**File:** `NewAILearningDashboard.tsx`
**Role:** AI-powered learning insights and analytics
**Navigation:** From Dashboard Quick Access AI button

### Purpose
Visual analytics dashboard with AI-generated insights, predictions, and recommendations.

### Features List
1. **Gradient Hero Header**
   - AI sparkles icon
   - "Your AI Study Insights" title
   - Last updated timestamp
   - "Chat with AI Tutor" button

2. **Learning Overview (4 stats)**
   - Total study hours (weekly)
   - Tests completed (this month)
   - Average score
   - Current streak

3. **Study Time Chart**
   - Bar chart (7 days)
   - Hours per day
   - Subject color coding
   - Hover tooltips
   - Weekly total

4. **Subject Distribution**
   - Pie chart visual
   - Percentage breakdown
   - Math: 35%
   - Physics: 30%
   - Chemistry: 35%
   - Legend with colors

5. **Performance Trend**
   - Line chart (6 months)
   - Average grades over time
   - Improvement indicator
   - Milestone markers

6. **Weak Areas Cards**
   - AI-detected topics
   - Accuracy percentage
   - Priority level
   - Last attempted date
   - Quick action buttons

7. **Study Plan Recommendations**
   - AI-generated schedule
   - Time blocks
   - Suggested topics
   - Adaptive difficulty
   - "Start Now" buttons

8. **Progress Predictions**
   - Expected grade projection
   - Confidence percentage
   - Factors analyzed
   - Improvement suggestions

9. **Resource Recommendations**
   - Video tutorials
   - Practice problem sets
   - Study materials
   - Peer suggestions
   - Match percentages

10. **Achievement Tracker**
    - Study milestones
    - Badges earned this week
    - Next badge progress
    - Celebration animations

### UI/UX Design
```
┌─────────────────────────────────────┐
│ [Gradient - Purple/Blue]            │
│ ✨ Your AI Study Insights           │
│ Updated: 2 hours ago                │
│                [💬 Chat with AI Tutor]│
└─────────────────────────────────────┘

Learning Overview:
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│📊 12h│ │✅ 8  │ │⭐ 88%│ │🔥 7  │
│Study │ │Tests │ │Score │ │Streak│
└──────┘ └──────┘ └──────┘ └──────┘

📊 Weekly Study Time
┌─────────────────────────────────────┐
│ [Bar Chart - 7 days]                │
│ │                                   │
│ │   ██     ██        ██             │
│ │   ██ ██  ██  ██    ██    ██  ██  │
│ │   ██ ██  ██  ██    ██    ██  ██  │
│ └─────────────────────────────────  │
│   M   T   W   T   F   S   S         │
│   2h  1h  2h  3h  2h  1h  1.5h      │
│ Total: 12.5 hours this week         │
└─────────────────────────────────────┘

📚 Subject Distribution
┌─────────────────────────────────────┐
│         [Pie Chart]                 │
│      Math 35% (Blue)                │
│      Physics 30% (Purple)           │
│      Chemistry 35% (Green)          │
└─────────────────────────────────────┘

📈 Performance Trend (6 Months)
┌─────────────────────────────────────┐
│ [Line Chart]                        │
│ 100% ┐                              │
│  90% ├─────○───○───○───●           │
│  80% ├───○───○───────────           │
│  70% ├─○─────────────────           │
│      └─────────────────────         │
│      Aug Sep Oct Nov Dec Jan        │
│ +5% improvement this month! 🎉      │
└─────────────────────────────────────┘

⚠️ AI-Detected Weak Areas
┌─────────────────────────────────────┐
│ Physics - Thermodynamics       [High]│
│ Accuracy: 65% | Last: 3 days ago    │
│ [📚 Resources] [📝 Practice]        │
├─────────────────────────────────────┤
│ Math - Derivatives             [Med] │
│ Accuracy: 72% | Last: 5 days ago    │
│ [📚 Resources] [📝 Practice]        │
└─────────────────────────────────────┘

📅 AI Study Plan (Today)
┌─────────────────────────────────────┐
│ 09:00 - 10:30 | Mathematics         │
│ Focus: Derivatives & Integration    │
│ Difficulty: Medium                  │
│ [Start Now]                         │
├─────────────────────────────────────┤
│ 11:00 - 12:00 | Physics             │
│ Focus: Thermodynamics Review        │
│ Difficulty: High (Weak area)        │
│ [Start Now]                         │
└─────────────────────────────────────┘

🎯 Progress Prediction
┌─────────────────────────────────────┐
│ Expected Grade: A (92%)             │
│ Confidence: 85%                     │
│                                     │
│ Based on:                           │
│ • Current performance trend         │
│ • Study habits analysis             │
│ • Assignment completion rate        │
│                                     │
│ To maintain A grade:                │
│ ✓ Study 12+ hours weekly            │
│ ✓ Complete all assignments          │
│ ⚠️ Focus on thermodynamics          │
└─────────────────────────────────────┘

🎓 Recommended Resources
┌─────────────────────────────────────┐
│ 🎥 Khan Academy - Thermodynamics    │
│ 45 mins | Rating: 4.8 | Match: 95%  │
│ [Watch Now]                         │
├─────────────────────────────────────┤
│ 📝 Practice Problem Set 5           │
│ 20 problems | 1 hour | Match: 92%   │
│ [Start Practice]                    │
├─────────────────────────────────────┤
│ 👥 Study Partner: Sarah J.          │
│ Math expert | Match: 88%            │
│ [Connect]                           │
└─────────────────────────────────────┘

🏆 This Week's Achievements
┌─────────────────────────────────────┐
│ • Completed 8 tests (personal best!)│
│ • 7-day study streak 🔥             │
│ • Improved Physics score by 12%     │
│                                     │
│ Next milestone: 10-day streak       │
│ ████████░░ 70% progress             │
└─────────────────────────────────────┘
```

### Data Fetched
1. `submissions` table - performance data
2. `study_sessions` table - time tracking
3. AI algorithm - weak areas analysis
4. `study_materials` table - recommendations
5. `student_xp` table - achievements

### User Interactions
- Tap "Chat with AI Tutor" → Navigate to AITutorChat
- Tap chart → View detailed breakdown
- Tap weak area → View resources
- Tap "Resources" → Show materials
- Tap "Practice" → Start practice test
- Tap "Start Now" → Begin study session
- Tap resource → Open material
- Tap "Connect" → Message peer
- Pull to refresh → Recalculate insights
- Swipe chart → View different time ranges

---

## 📱 SCREEN 22: Student Welcome/Login Screen
**File:** `StudentWelcomeScreen.tsx`
**Role:** First screen before authentication
**Navigation:** App entry point for students

### Purpose
Welcome and onboarding screen showcasing app features before student logs in.

### Features List
1. **Hero Section**
   - App logo/icon (🎓)
   - "Welcome to" text
   - "Manushi Coaching" title
   - "Student Portal" badge
   - Tagline: "Your complete learning companion"
   - Animated fade-in

2. **Feature Cards (5 features)**
   - Home Dashboard
   - Live Classes
   - Study Library
   - Progress Tracking
   - Peer Learning
   - Icons, titles, descriptions
   - Staggered animations

3. **Call-to-Action**
   - "Start Learning" button
   - Large, prominent, elevated
   - Footer text
   - Smooth animations

### UI/UX Design
```
┌─────────────────────────────────────┐
│             🎓                      │
│                                     │
│         Welcome to                  │
│     Manushi Coaching                │
│     [Student Portal]                │
│                                     │
│ Your complete learning companion    │
│   for academic excellence           │
└─────────────────────────────────────┘

Everything You Need to Excel

┌─────────────────────────────────────┐
│ 🏠  Home Dashboard                  │
│ Your personalized learning hub with │
│ quick access to everything          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📚  Live Classes                    │
│ Join interactive sessions, take     │
│ notes, and engage with teachers     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📖  Study Library                   │
│ Access comprehensive study materials│
│ assignments, and resources          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📊  Progress Tracking               │
│ Monitor your learning journey with  │
│ detailed analytics and insights     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 👥  Peer Learning                   │
│ Connect with classmates, collaborate│
│ and learn together                  │
└─────────────────────────────────────┘

[      Start Learning      ]

Access your personalized dashboard
and begin your learning journey
```

### User Interactions
- Scroll to view features
- Tap "Start Learning" → Navigate to login/dashboard
- Animated entrance on load

---

## 📱 SCREEN 23: Student Profile/Account Screen
**File:** `StudentProfileScreen.tsx` *(To be created)*
**Role:** User profile and settings
**Navigation:** From hamburger menu or settings icon

### Purpose
Student profile management, preferences, and account settings.

### Features List
1. **Profile Header**
   - Avatar (editable)
   - Student name
   - Email address
   - Grade and section
   - Student ID

2. **Quick Stats (4 cards)**
   - Total classes attended
   - Assignments completed
   - Current average grade
   - Days active

3. **Account Settings**
   - Edit Profile
   - Change Password
   - Notification Preferences
   - Language Selection
   - Time Zone

4. **App Preferences**
   - Theme (Light/Dark/System)
   - Default view mode
   - Calendar sync
   - Download quality
   - Auto-save notes

5. **Notifications**
   - Class reminders
   - Assignment deadlines
   - Grade notifications
   - Doubt responses
   - Peer messages
   - Toggle switches

6. **Privacy & Security**
   - Privacy policy link
   - Terms of service
   - Data management
   - Account deletion
   - Session management

7. **About & Support**
   - App version
   - Help center
   - Report a bug
   - Feedback form
   - Rate app

8. **Logout Button**
   - Sign out action
   - Confirmation dialog

### UI/UX Design
```
┌─────────────────────────────────────┐
│ [Gradient Header - Primary]         │
│        [Avatar - 80x80]             │
│        Raj Kumar                    │
│     raj.kumar@email.com             │
│  Grade 12 - Science • ID: ST12345   │
└─────────────────────────────────────┘

Quick Stats:
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│📚 156│ │✅ 45 │ │⭐ 88%│ │📅 120│
│Class │ │Assign│ │Grade │ │Days  │
└──────┘ └──────┘ └──────┘ └──────┘

⚙️ Account Settings
┌─────────────────────────────────────┐
│ 👤 Edit Profile              [>]    │
│ 🔒 Change Password           [>]    │
│ 🔔 Notifications             [>]    │
│ 🌐 Language: English         [>]    │
│ 🕐 Time Zone: IST (UTC+5:30) [>]    │
└─────────────────────────────────────┘

📱 App Preferences
┌─────────────────────────────────────┐
│ 🎨 Theme                             │
│    ○ Light  ● System  ○ Dark        │
│                                     │
│ 📅 Default View: Week        [>]    │
│ 📆 Sync Calendar             [ON]   │
│ 📥 Download Quality: HD      [>]    │
│ 💾 Auto-save Notes           [ON]   │
└─────────────────────────────────────┘

🔔 Notifications
┌─────────────────────────────────────┐
│ Class Reminders              [ON]   │
│ Assignment Deadlines         [ON]   │
│ Grade Notifications          [ON]   │
│ Doubt Responses              [ON]   │
│ Peer Messages                [OFF]  │
└─────────────────────────────────────┘

🔒 Privacy & Security
┌─────────────────────────────────────┐
│ 📄 Privacy Policy            [>]    │
│ 📜 Terms of Service          [>]    │
│ 💾 Manage Data               [>]    │
│ 🔓 Active Sessions           [>]    │
└─────────────────────────────────────┘

ℹ️ About & Support
┌─────────────────────────────────────┐
│ App Version: 2.1.0                  │
│ 📚 Help Center               [>]    │
│ 🐛 Report a Bug              [>]    │
│ 💬 Send Feedback             [>]    │
│ ⭐ Rate App                  [>]    │
└─────────────────────────────────────┘

[         Sign Out         ]
```

### Data Fetched
1. `students` table - profile info
2. `user_preferences` table - settings
3. AsyncStorage - local preferences
4. Session data

### User Interactions
- Tap avatar → Upload new photo
- Tap "Edit Profile" → Edit form
- Tap "Change Password" → Password form
- Toggle switches → Save preferences
- Tap theme option → Apply theme
- Tap "Sign Out" → Confirm logout
- Tap support links → Open help

---

## 📱 SCREEN 24: Hamburger Menu/Settings Screen
**File:** `StudentMenuScreen.tsx` *(To be created)*
**Role:** Side navigation menu
**Navigation:** From hamburger icon in top bar

### Purpose
Quick access navigation menu with account options and shortcuts.

### Features List
1. **User Profile Section**
   - Avatar thumbnail
   - Student name
   - Grade and section
   - "View Profile" link

2. **Main Navigation Links**
   - 🏠 Dashboard
   - 📚 My Classes
   - 📖 Study Library
   - 📊 My Progress
   - 👥 Peer Network
   - 🤖 AI Tutor
   - Badge indicators for new items

3. **Quick Actions**
   - ❓ Ask a Doubt
   - 📅 View Schedule
   - 📝 Assignments
   - 🎮 Learning Hub

4. **Settings & Support**
   - ⚙️ Settings
   - 📱 App Preferences
   - 🔔 Notifications
   - 📚 Help Center
   - 💬 Contact Support

5. **Account Options**
   - 🔄 Switch Account
   - 🔒 Privacy
   - 🚪 Sign Out

6. **App Info Footer**
   - App version
   - Terms & Privacy links

### UI/UX Design
```
┌─────────────────────────────────────┐
│ [Avatar] Raj Kumar                  │
│ Grade 12 - Science                  │
│ [View Profile]                 [✕]  │
├─────────────────────────────────────┤
│ 🏠  Dashboard                       │
│ 📚  My Classes               [3]    │
│ 📖  Study Library            [NEW]  │
│ 📊  My Progress                     │
│ 👥  Peer Network             [15]   │
│ 🤖  AI Tutor                        │
├─────────────────────────────────────┤
│ Quick Actions                       │
│ ❓  Ask a Doubt                     │
│ 📅  View Schedule                   │
│ 📝  Assignments              [8]    │
│ 🎮  Learning Hub                    │
├─────────────────────────────────────┤
│ Settings & Support                  │
│ ⚙️  Settings                        │
│ 📱  App Preferences                 │
│ 🔔  Notifications                   │
│ 📚  Help Center                     │
│ 💬  Contact Support                 │
├─────────────────────────────────────┤
│ 🔄  Switch Account                  │
│ 🔒  Privacy                         │
│ 🚪  Sign Out                        │
├─────────────────────────────────────┤
│ Version 2.1.0                       │
│ Terms • Privacy                     │
└─────────────────────────────────────┘
```

### User Interactions
- Swipe right → Open menu
- Tap navigation item → Navigate to screen
- Tap "View Profile" → Open profile
- Tap "Sign Out" → Confirm logout
- Tap badge → View details
- Swipe left / Tap [✕] → Close menu

---

## 🎯 Summary: Screen Count by Category

### Core Screens (Always Used) - 5
1. Student Dashboard
2. Progress/Report Card
3. Study Network (Peers)
4. Study Library
5. Schedule/Classes (Enhanced)

### Assignment & Assessment - 3
6. Assignment Detail
7. Class Detail
8. Activity Detail

### Learning Tools - 8
9. AI Tutor Chat
10. AI Learning Dashboard (Analytics)
11. AI Study Screen (Simple)
12. Enhanced AI Study (Full)
13. Live Class Screen
14. Enhanced Live Class (Full Video)
15. Virtual Classroom
16. Interactive Classroom (No Video)

### Student Engagement - 2
17. Gamified Learning Hub
18. Collaborative Assignment

### Doubt Management - 2
19. Doubt Submission (Full)
20. Simple Doubt

### System & Account - 4
21. Schedule Screen (Advanced)
22. Student Welcome/Login
23. Student Profile/Account
24. Hamburger Menu/Settings

---

## 📊 Complete Screen Breakdown (24 Total)

### By Implementation Status:
- **Fully Implemented:** 21 screens (screens 1-21)
- **To Be Created:** 3 screens (Profile, Menu, additional features)
- **With Lovable Design:** 5 core screens

### By Navigation Access:
- **Bottom Tab Screens:** 5 (Dashboard, Classes, Study, Progress, Connect)
- **Nested Stack Screens:** 16 (accessible from tabs)
- **Modal/Overlay Screens:** 3 (Profile, Menu, Welcome)

### By Functionality:
- **Real-time Features:** 4 (Live Class, Enhanced Live, Virtual, Interactive)
- **AI-Powered:** 4 (AI Tutor, AI Dashboard, AI Study, Enhanced AI)
- **Analytics/Reports:** 3 (Progress, AI Dashboard, Performance)
- **Collaborative:** 2 (Peer Network, Collaborative Assignment)
- **Resource Access:** 2 (Study Library, Class Detail)
- **Submission/Forms:** 3 (Assignment Detail, Doubt Submission, Simple Doubt)
- **Scheduling:** 2 (Schedule Simple, Schedule Enhanced)
- **Gamification:** 1 (Gamified Hub)
- **System/Settings:** 3 (Welcome, Profile, Menu)

---

## 📝 Usage Notes for Google Stitch / AI Recreation

### When Using These Prompts:
1. **Copy individual screen section** (e.g., "SCREEN 1: Student Dashboard")
2. **Include "Global Design Patterns"** section for consistency
3. **Paste into Stitch with instruction:**
   ```
   Create a React Native screen exactly matching this specification:
   [Paste screen details here]

   Use these components: Card, Badge, Button, T, Row, Col
   Use these colors: [Paste Color Palette]
   Match the UI/UX design ASCII layout provided.
   ```

### Key Points:
- All screens use **real Supabase data** (no mock data)
- All screens have **BaseScreen wrapper** for loading/error/empty states
- All screens track **analytics** (trackScreenView, trackAction)
- All screens use **safe navigation** (safeNavigate)
- All screens are **TypeScript** with proper types
- All icon buttons have **accessibilityLabel** for accessibility

### Design Consistency:
- Gradient headers: 24px bottom radius
- Floating elements: -16px to -24px negative margin
- Border-left: 4px accent color
- Spacing: 8px (xs), 12px (sm), 16px (md), 24px (lg), 32px (xl)
- Touch targets: minimum 44px (iOS), 48px (Material)
- Status bar: Always set barStyle and backgroundColor
- Top bar height: 56px standard (Material Design)

---

**Total Student Screens:** 24 (21 implemented + 3 to be created)
**Fully Implemented:** 21 screens with real Supabase integration
**With Premium Design:** 5 core bottom tab screens
**AI-Powered Features:** 4 screens with AI capabilities
**Real-time Features:** 4 live classroom screens
**Ready for Recreation:** All 24 screens fully documented

This document can be used screen-by-screen with AI tools to recreate or enhance the UI/UX! 🚀

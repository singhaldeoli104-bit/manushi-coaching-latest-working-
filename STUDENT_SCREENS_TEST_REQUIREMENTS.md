# Student Screens - Complete Testing Requirements Document

**Project:** Manushi Coaching Platform
**Module:** Student Module
**Total Screens:** 25 screens
**Document Version:** 1.0
**Last Updated:** November 6, 2025
**Testing Branch:** `claude/debug-load-issue-011CUoxSa8n6KCeVagxF3MT2`

---

## Table of Contents

1. [Overview](#overview)
2. [Screen Categories](#screen-categories)
3. [Detailed Screen Requirements](#detailed-screen-requirements)
4. [Cross-Screen Features](#cross-screen-features)
5. [Testing Checklist](#testing-checklist)
6. [Data Requirements](#data-requirements)
7. [Integration Points](#integration-points)

---

## Overview

### Purpose
This document outlines all features and testing requirements for the 25 student screens in the Manushi Coaching Platform. Each screen is integrated with Supabase backend, React Query for data management, and follows modern React Native best practices.

### Technology Stack
- **Framework:** React Native
- **Navigation:** React Navigation 7.x
- **State Management:** React Query (TanStack Query)
- **Backend:** Supabase
- **UI Library:** React Native Paper
- **Animations:** react-native-reanimated, react-native-animatable
- **Icons:** react-native-vector-icons (MaterialIcons)

### Key Integrations
- ✅ React Query hooks for backend data fetching
- ✅ Automatic caching (5 min), background refetching, retry logic
- ✅ Real-time Supabase integration
- ✅ Offline support with AsyncStorage
- ✅ Network state management with NetInfo
- ✅ Hardware back button handling
- ✅ Analytics tracking
- ✅ Theme context integration

---

## Screen Categories

### 1. Dashboard & Home (2 screens)
- StudentDashboard.tsx
- StudentAILearningDashboard.tsx

### 2. Class Management (5 screens)
- ClassDetailScreen.tsx
- LiveClassParticipationScreen.tsx
- EnhancedLiveClassParticipationScreen.tsx
- StudentLiveClassScreen.tsx
- EnhancedInteractiveClassroomScreen.tsx
- VirtualClassroomInterface.tsx

### 3. Schedule & Calendar (3 screens)
- ScheduleScreen.tsx
- EnhancedScheduleScreen.tsx
- ActivityDetailScreen.tsx

### 4. Assignments & Homework (2 screens)
- AssignmentDetailScreen.tsx
- CollaborativeAssignmentWorkspace.tsx

### 5. AI & Study Assistance (4 screens)
- AIStudyScreen.tsx
- EnhancedAIStudyAssistantScreen.tsx
- AITutorChatInterface.tsx
- StudyLibraryScreen.tsx

### 6. Doubt & Questions (2 screens)
- DoubtSubmissionScreen.tsx
- SimpleDoubtSubmissionScreen.tsx

### 7. Progress & Analytics (1 screen)
- ProgressDetailScreen.tsx

### 8. Collaboration & Social (2 screens)
- PeerLearningNetwork.tsx
- LiveCollaborationStudio.tsx

### 9. Gamification (1 screen)
- GamifiedLearningHub.tsx

---

## Detailed Screen Requirements

---

## 1. StudentDashboard.tsx

### 📋 Description
Main student dashboard screen with comprehensive overview of classes, assignments, notifications, and quick actions.

### 🎯 Key Features

#### 1.1 Data Integration (React Query)
- ✅ `useStudentDashboard` - Main dashboard data
- ✅ `useUpcomingAssignments` - Assignment list
- ✅ `useUpcomingClasses` - Class schedule
- ✅ `useAttendanceSummary` - Attendance stats
- ✅ `useAcademicPerformance` - Performance metrics
- ✅ Automatic caching (5 min)
- ✅ Background refetching
- ✅ Retry logic (3 attempts)
- ✅ Type-safe data from database to UI

#### 1.2 UI Sections
1. **Header Section**
   - Welcome message with student name
   - Profile avatar
   - Notification badge with count
   - Quick settings access

2. **Quick Actions Grid**
   - Join Live Class
   - View Assignments
   - Ask Doubt
   - Study Materials
   - View Progress
   - Schedule
   - Each with icon, title, color

3. **Today's Classes**
   - List of classes (Today and Upcoming)
   - Class subject, teacher, time
   - Status indicators (live/upcoming/completed)
   - Duration display
   - Join button (for live classes)
   - Class detail navigation

4. **Pending Assignments**
   - Assignment cards
   - Subject, title, due date
   - Status (pending/submitted/graded)
   - Grade display (if graded)
   - Color-coded by status
   - Navigation to assignment detail

5. **Notifications Panel**
   - Recent notifications (limit 5)
   - Notification type icons
   - Title and message
   - Timestamp (relative)
   - Type-based styling (info/success/warning/urgent)
   - "View All" button

6. **Phase 84: Enhanced Notification System**
   - NotificationRenderer component
   - Notification grouping (by day)
   - Notification service integration
   - Mark as read functionality
   - Notification badges
   - Priority-based sorting

#### 1.3 User Interactions
- Pull-to-refresh functionality
- Tap class card → Navigate to ClassDetailScreen
- Tap assignment card → Navigate to AssignmentDetailScreen
- Tap notification → View notification details
- Tap quick action → Navigate to respective screen
- Join live class → Navigate to LiveClassParticipationScreen
- Hardware back button → Exit confirmation

#### 1.4 State Management
- Loading states (skeleton/spinner)
- Error states with retry
- Empty states (no classes, no assignments)
- Refresh control state
- Snackbar for feedback messages
- Portal for modals

#### 1.5 Offline Support
- Cached data display when offline
- Offline indicator
- Auto-sync when connection restored

### ✅ Testing Requirements

#### Functional Tests
- [ ] Dashboard loads with all sections
- [ ] React Query hooks fetch data correctly
- [ ] Pull-to-refresh updates all data
- [ ] Quick actions navigate correctly
- [ ] Class cards display correct status
- [ ] Live class join button works
- [ ] Assignment cards show correct status
- [ ] Notifications display correctly
- [ ] Notification badges update
- [ ] Navigation to detail screens works
- [ ] Hardware back button shows exit confirmation

#### Data Tests
- [ ] Student profile data loads
- [ ] Classes fetch from Supabase
- [ ] Assignments fetch from Supabase
- [ ] Notifications fetch and group correctly
- [ ] Attendance percentage calculates correctly
- [ ] Performance metrics display

#### UI Tests
- [ ] Layout renders correctly on different screen sizes
- [ ] Animations work smoothly
- [ ] Loading states display
- [ ] Error states display with retry
- [ ] Empty states display when no data
- [ ] Snackbar messages appear
- [ ] Theme context applied correctly

#### Performance Tests
- [ ] Initial load time < 2s
- [ ] Query caching reduces API calls
- [ ] Background refetch works
- [ ] Smooth scrolling
- [ ] No memory leaks
- [ ] Optimistic updates work

---

## 2. EnhancedScheduleScreen.tsx

### 📋 Description
Weekly/monthly calendar views with class reminders, assignment tracking, and device calendar integration.

### 🎯 Key Features

#### 2.1 Calendar Views
1. **Day View**
   - Hourly timeline
   - Events in chronological order
   - Time blocks for classes
   - Assignment due times

2. **Week View**
   - 7-day grid
   - Events across days
   - Current day highlight
   - Week navigation

3. **Month View**
   - Calendar grid (42 cells)
   - Event dots/indicators
   - Current month highlight
   - Month navigation

#### 2.2 Event Types
- **Class Events**
  - Subject, teacher, location
  - Start time, end time
  - Status (upcoming/live/completed/cancelled)
  - Recurring indicator
  - Join button (if live)

- **Assignment Events**
  - Title, subject
  - Due date and time
  - Status (pending/submitted/overdue)
  - Priority (low/medium/high)

- **Exam Events**
  - Subject, topic
  - Date, time, duration
  - Preparation status

- **General Events**
  - School events, holidays
  - Custom student events

#### 2.3 Features
- View mode toggle (Day/Week/Month)
- Date selector/picker
- Event filtering (by type, subject)
- Search events
- Reminder management
- Device calendar sync
- Timezone support
- Recurring events
- Event color coding
- Quick add event

#### 2.4 Data Integration
- `getTodayClasses` - Fetch today's classes
- `getStudentAssignments` - Fetch assignments
- Real-time updates
- Offline caching

#### 2.5 User Interactions
- Swipe to change dates
- Tap event → View details
- Long press event → Quick actions (edit/delete/set reminder)
- Pull-to-refresh
- Add to device calendar
- Set reminders
- Share schedule

### ✅ Testing Requirements

#### Functional Tests
- [ ] All three view modes work (Day/Week/Month)
- [ ] Date navigation works (prev/next/today)
- [ ] Events load for selected date range
- [ ] Event filtering works
- [ ] Search functionality works
- [ ] Reminder creation works
- [ ] Device calendar integration works
- [ ] Timezone handling works
- [ ] Recurring events display correctly
- [ ] Event detail navigation works

#### Data Tests
- [ ] Classes fetch correctly
- [ ] Assignments with due dates display
- [ ] Events sorted chronologically
- [ ] Status updates in real-time
- [ ] Offline data caching works

#### UI Tests
- [ ] Calendar grid renders correctly
- [ ] Event cards display properly
- [ ] Color coding applied correctly
- [ ] Status indicators visible
- [ ] Loading states display
- [ ] Empty state shows (no events)
- [ ] Responsive on different screen sizes

#### Performance Tests
- [ ] View switching is smooth
- [ ] Large event lists scroll smoothly
- [ ] Date range queries optimized
- [ ] No lag when switching months

---

## 3. AIStudyScreen.tsx

### 📋 Description
Enhanced AI Study Assistant with personalized recommendations, Khan Academy Khanmigo-style AI tutor, cross-platform integration, and predictive analytics.

### 🎯 Key Features

#### 3.1 AI Study Plans
- **Personalized Study Plans**
  - Subject-specific plans
  - Title, description, topics
  - Estimated time
  - Difficulty level (beginner/intermediate/advanced)
  - Progress tracking
  - Active/inactive status

#### 3.2 AI Recommendations
- **Intelligent Recommendations**
  - Type (study/practice/review/concept)
  - Confidence score
  - Reasoning explanation
  - Estimated time
  - Priority level (high/medium/low)
  - Subject-specific

#### 3.3 Practice Questions
- **Adaptive Practice**
  - Subject and topic
  - Question text
  - Difficulty (easy/medium/hard)
  - Hints system
  - Detailed explanations
  - Answer tracking

#### 3.4 Learning Analytics (Phase 43.3)
- **Study Analytics**
  - Study streak tracking
  - Average session length
  - Preferred study times
  - Most productive day
  - Completion rate
  - Improvement trend (improving/stable/declining)
  - Attention span measurement
  - Retention rate

#### 3.5 Performance Prediction
- **Predictive Analytics**
  - Subject confidence scores
  - Upcoming challenges identification
  - Recommended interventions
  - Success probability
  - Next week forecast (excellent/good/needs_attention/at_risk)

#### 3.6 Learning Style Detection
- **Personalization**
  - Learning style type (visual/auditory/kinesthetic/reading)
  - Confidence level
  - Characteristics
  - Adaptive content delivery

#### 3.7 Study Library Integration
- Access to study materials
- Resource recommendations
- Smart content suggestions

#### 3.8 AI Chat Interface
- Conversational AI tutor
- Question answering
- Concept explanations
- Step-by-step guidance
- Context-aware responses

#### 3.9 Data Integration
- `AIStudyAssistantService` integration
- Real-time personalization
- Learning pattern analysis
- Performance tracking

### ✅ Testing Requirements

#### Functional Tests
- [ ] Study plans load and display
- [ ] AI recommendations generate correctly
- [ ] Practice questions work
- [ ] Hints system functions
- [ ] Explanations display
- [ ] Learning analytics calculate
- [ ] Performance predictions work
- [ ] Learning style detection accurate
- [ ] Chat interface responds
- [ ] Study library integrates
- [ ] Progress tracking works

#### AI Tests
- [ ] Recommendations are relevant
- [ ] Confidence scores accurate
- [ ] Predictions based on real data
- [ ] Adaptive difficulty works
- [ ] Personalization improves over time

#### Data Tests
- [ ] Study plans persist
- [ ] Analytics data aggregates correctly
- [ ] Prediction models accurate
- [ ] Learning patterns tracked

#### UI Tests
- [ ] Study plan cards display
- [ ] Recommendation cards render
- [ ] Analytics charts/graphs work
- [ ] Chat UI functional
- [ ] Loading states show
- [ ] Error handling works

#### Performance Tests
- [ ] AI responses fast (< 2s)
- [ ] Analytics calculations efficient
- [ ] Large question sets handle well
- [ ] Smooth scrolling

---

## 4. AssignmentDetailScreen.tsx

### 📋 Description
Comprehensive assignment management and submission interface with React Query integration.

### 🎯 Key Features

#### 4.1 Assignment Information
- **Assignment Details**
  - Title, description
  - Subject
  - Teacher info (name, avatar)
  - Due date and time
  - Maximum points
  - Submission type (file/text/both)
  - Status (pending/submitted/graded/overdue)
  - Attachments from teacher

#### 4.2 Submission Management
- **Student Submission**
  - File upload support
  - Text input
  - Multiple file types
  - File size display
  - Submission date tracking
  - Edit submission (before deadline)
  - Resubmit if allowed

#### 4.3 Grading & Feedback
- **Grade Display**
  - Score out of maximum points
  - Percentage calculation
  - Teacher feedback
  - Grading date
  - Rubric display (if available)
  - Grade statistics (class average)

#### 4.4 Data Integration (Phase 2)
- **React Query Hooks**
  - `useAssignment` - Fetch assignment
  - `useSubmission` - Fetch student submission
  - `useSubmitAssignment` - Submit mutation
  - `useUpdateSubmission` - Update mutation
  - Automatic cache invalidation
  - Optimistic updates
  - Type-safe mutations

#### 4.5 File Management
- Upload progress tracking
- File preview
- Download attachments
- File type validation
- Size limits enforcement

#### 4.6 Notifications
- Due date reminders
- Grading notifications
- Late submission warnings

### ✅ Testing Requirements

#### Functional Tests
- [ ] Assignment details load
- [ ] Attachments download
- [ ] File upload works
- [ ] Text submission works
- [ ] Submission edit works
- [ ] Resubmit functionality
- [ ] Grade display works
- [ ] Feedback displays
- [ ] Due date calculation correct
- [ ] Status updates correctly

#### Data Tests
- [ ] Assignment fetches from Supabase
- [ ] Submission saves correctly
- [ ] React Query cache updates
- [ ] Optimistic updates work
- [ ] Mutations invalidate cache

#### UI Tests
- [ ] Assignment info displays
- [ ] Teacher info renders
- [ ] Submission form works
- [ ] File upload UI functional
- [ ] Grade display styled correctly
- [ ] Status badges show
- [ ] Loading states display

#### File Tests
- [ ] File upload successful
- [ ] Multiple files supported
- [ ] File size validation works
- [ ] File type validation works
- [ ] Download works
- [ ] Preview works

#### Performance Tests
- [ ] Large files upload efficiently
- [ ] Multiple file handling smooth
- [ ] Form interactions responsive

---

## 5. LiveClassParticipationScreen.tsx

### 📋 Description
Enhanced live class participation with real-time interaction, Q&A, polls, hand raising, breakout rooms, and offline support.

### 🎯 Key Features

#### 5.1 Live Class Interface
- **Class Information**
  - Class name, subject
  - Teacher name
  - Class duration
  - Participant count
  - Connection status

#### 5.2 Real-Time Chat
- **Class Messages**
  - Send messages
  - Receive messages (real-time)
  - Message types (message/question/announcement/system)
  - Teacher/student identification
  - Message reactions
  - Chat moderation (if enabled)
  - Message history

#### 5.3 Interactive Features
- **Student Actions**
  - Hand raising
  - Mic enable/disable
  - Camera enable/disable
  - Screen sharing (view)
  - Reactions (emoji)
  - Q&A submission
  - Private messages to teacher

#### 5.4 Polls & Quizzes
- **Poll System**
  - View active polls
  - Vote on options
  - See live results
  - Poll countdown timer
  - Multiple choice support
  - Anonymous voting

#### 5.5 Breakout Rooms
- **Collaborative Rooms**
  - Auto-assignment to breakout rooms
  - Room info (name, topic, time limit)
  - Room participants list
  - Room chat
  - Return to main room
  - Room status (active/ended)

#### 5.6 Class Settings
- **Permission Controls**
  - Allow chat (teacher control)
  - Allow questions
  - Allow polls
  - Allow screen share
  - Allow breakout rooms
  - Chat moderation
  - Question moderation

#### 5.7 Offline Support
- **Offline Mode**
  - Cache messages
  - Cache polls
  - Save notes
  - Track attendance
  - Sync when online

#### 5.8 Attendance
- Auto attendance marking
- Join/leave time tracking
- Participation metrics

### ✅ Testing Requirements

#### Functional Tests
- [ ] Class loads correctly
- [ ] Real-time chat works
- [ ] Send messages successful
- [ ] Receive messages in real-time
- [ ] Hand raise toggle works
- [ ] Mic toggle works
- [ ] Camera toggle works
- [ ] Poll voting works
- [ ] Poll results display
- [ ] Breakout room assignment
- [ ] Breakout room chat
- [ ] Return to main room
- [ ] Reactions work
- [ ] Screen share view works

#### Real-Time Tests
- [ ] Messages appear instantly
- [ ] Poll updates in real-time
- [ ] Participant list updates
- [ ] Status changes sync
- [ ] Connection status accurate

#### Data Tests
- [ ] Class info fetches
- [ ] Messages persist
- [ ] Poll votes save
- [ ] Attendance tracked
- [ ] Offline data caches
- [ ] Sync on reconnect

#### UI Tests
- [ ] Chat UI renders
- [ ] Participant list displays
- [ ] Polls render correctly
- [ ] Breakout room UI works
- [ ] Controls accessible
- [ ] Status indicators visible

#### Performance Tests
- [ ] Real-time updates smooth
- [ ] Large participant lists handle well
- [ ] Message history scrolls smoothly
- [ ] No lag in interactions

---

## 6. DoubtSubmissionScreen.tsx

### 📋 Description
Comprehensive doubt/question submission system with offline support, draft saving, and network resilience.

### 🎯 Key Features

#### 6.1 Doubt Dashboard
- **View Doubts**
  - List all submitted doubts
  - Filter by status (pending/answered/closed)
  - Search doubts
  - Sort by date/subject/priority
  - Doubt cards with preview

#### 6.2 Doubt Submission Form
- **Submit Doubt**
  - Subject selection
  - Topic/chapter
  - Question text (required)
  - Detailed description
  - Image attachments (screenshots, photos)
  - Priority level
  - Anonymity option

#### 6.3 Doubt Details
- **View Submitted Doubt**
  - Question details
  - Attachments
  - Submission timestamp
  - Status indicator
  - Teacher response (if answered)
  - Answer timestamp
  - Rating/feedback option

#### 6.4 Offline Support
- **Network Resilience**
  - Submit doubts offline
  - Save as draft
  - Queue for sync
  - Auto-sync when online
  - Retry failed submissions
  - Offline indicator
  - Sync status display

#### 6.5 Offline Actions Queue
- **Action Management**
  - Track offline actions
  - Action types (submit/save_draft/delete)
  - Retry count
  - Timestamp
  - Auto-sync with exponential backoff

#### 6.6 Data Integration
- **Supabase Services**
  - `createDoubt` - Submit new doubt
  - `updateDoubt` - Update existing
  - Real-time doubt status updates
  - Network state monitoring (NetInfo)
  - AsyncStorage for offline data

#### 6.7 View Modes
- Dashboard view (all doubts)
- Submission form view
- Switch between views seamlessly

### ✅ Testing Requirements

#### Functional Tests
- [ ] Doubt dashboard loads
- [ ] Filter doubts by status
- [ ] Search doubts works
- [ ] Sort functionality works
- [ ] View doubt details
- [ ] Submission form validation
- [ ] Image upload works
- [ ] Submit doubt successful
- [ ] Save draft works
- [ ] Offline submission queues
- [ ] Auto-sync on reconnect
- [ ] Retry failed submissions

#### Offline Tests
- [ ] Submit while offline
- [ ] Draft saves offline
- [ ] Queue displays pending actions
- [ ] Sync triggers on network restore
- [ ] Retry logic works (exponential backoff)
- [ ] Offline indicator shows
- [ ] Data persists in AsyncStorage

#### Data Tests
- [ ] Doubts fetch from Supabase
- [ ] Submission saves correctly
- [ ] Status updates
- [ ] Teacher responses display
- [ ] Offline data syncs

#### UI Tests
- [ ] Dashboard renders
- [ ] Form fields work
- [ ] Image picker works
- [ ] Loading states display
- [ ] Error states show
- [ ] Snackbar messages appear
- [ ] Network status indicator

#### Network Tests
- [ ] Online/offline detection
- [ ] Network state changes handled
- [ ] Sync on reconnect
- [ ] Failed requests retry
- [ ] Connection status displayed

---

## 7. ProgressDetailScreen.tsx

### 📋 Description
Advanced comprehensive progress tracking with predictive analytics, real-time insights, and comparative analysis.

### 🎯 Key Features

#### 7.1 Subject-Wise Progress
- **Subject Performance**
  - Current score
  - Previous score
  - Class average
  - Trend (up/down/stable)
  - Subject color coding
  - Skills progress breakdown

#### 7.2 Skills Progress
- **Skill Tracking**
  - Skill name
  - Progress percentage
  - Status (mastered/developing/needs-work)
  - Visual indicators

#### 7.3 Achievement System
- **Achievements**
  - Achievement badges
  - Title and description
  - Icon display
  - Earned date
  - Category (academic/participation/improvement)

#### 7.4 Learning Insights
- **Personalized Insights**
  - Insight types (time-spent/weak-area/study-habit/recommendation)
  - Title and description
  - Actionable flag
  - Priority level (high/medium/low)

#### 7.5 Predictive Analytics (Phase 44.2)
- **Performance Prediction**
  - Projected grade
  - Confidence level
  - Target grade
  - Days to target
  - Study recommendations
  - Risk factors with mitigation

#### 7.6 Risk Factors
- **Performance Risks**
  - Risk factor name
  - Impact level (high/medium/low)
  - Description
  - Mitigation strategies

#### 7.7 Comparative Metrics
- **Class Comparison**
  - Class rank
  - Total students
  - Percentile
  - Top performers list
  - Performance gap analysis

#### 7.8 Grade Trends
- Historical grade data
- Trend charts/graphs
- Month-over-month comparison
- Subject-wise trends

#### 7.9 Share Progress
- Share report
- Export as PDF/image
- Share on social media

#### 7.10 Data Integration
- `StudentProgressService` integration
- Real-time analytics
- Historical data analysis

### ✅ Testing Requirements

#### Functional Tests
- [ ] Progress data loads
- [ ] Subject cards display
- [ ] Skills progress shows
- [ ] Achievement badges render
- [ ] Learning insights display
- [ ] Predictive analytics calculate
- [ ] Risk factors show
- [ ] Comparative metrics display
- [ ] Grade trends chart works
- [ ] Share functionality works
- [ ] Export works

#### Analytics Tests
- [ ] Predictions accurate
- [ ] Trends calculate correctly
- [ ] Rankings accurate
- [ ] Percentile calculation correct
- [ ] Risk assessment valid
- [ ] Recommendations relevant

#### Data Tests
- [ ] Progress fetches from backend
- [ ] Historical data loads
- [ ] Real-time updates work
- [ ] Aggregations correct

#### UI Tests
- [ ] Charts/graphs render
- [ ] Progress bars display
- [ ] Achievement badges styled
- [ ] Insights cards render
- [ ] Responsive layout
- [ ] Loading states show

#### Performance Tests
- [ ] Large datasets handle well
- [ ] Chart rendering smooth
- [ ] Calculations efficient
- [ ] Scroll performance good

---

## 8. GamifiedLearningHub.tsx

### 📋 Description
Comprehensive achievement system with learning streaks, challenges, leaderboards, and social learning.

### 🎯 Key Features

#### 8.1 Achievement System
- **Achievements**
  - Name, description, icon
  - Categories (academic/streak/social/challenge/milestone)
  - Rarity (common/rare/epic/legendary)
  - Progress tracking (current/max)
  - Unlock status
  - Unlock date
  - XP and coin rewards

#### 8.2 Learning Streaks
- **Streak Tracking**
  - Streak types (daily/weekly/subject/perfect)
  - Current streak count
  - Longest streak
  - Active status
  - Subject-specific streaks
  - Last activity timestamp
  - Streak bonus multiplier

#### 8.3 Challenges
- **Challenge System**
  - Individual/team/global challenges
  - Difficulty levels (easy/medium/hard/extreme)
  - Subject-specific
  - Time limits (hours)
  - Start and end dates
  - Participant count
  - Max participants
  - Rewards (XP, coins, badges)
  - Progress tracking
  - Active/completed status

#### 8.4 Leaderboards
- **Rankings**
  - Leaderboard types (daily/weekly/monthly/alltime)
  - Categories (xp/streaks/achievements/challenges)
  - Leaderboard entries with rank
  - Student info (name, avatar)
  - Score display
  - Position change indicator
  - Badge display
  - Level display

#### 8.5 Student Progress
- **Level System**
  - Current level
  - Total XP
  - XP to next level
  - XP progress bar
  - Coins earned
  - Total achievements unlocked
  - Active challenges count

#### 8.6 Rewards & Virtual Economy
- XP earning system
- Coin system
- Badge collection
- Reward redemption
- Virtual store (if implemented)

#### 8.7 Social Features
- Team competitions
- Challenge invites
- Share achievements
- Friend leaderboards

#### 8.8 Seasonal Events
- Limited-time challenges
- Special rewards
- Event leaderboards

#### 8.9 Data Integration
- `GamificationService` integration
- Real-time updates
- Achievement unlocking
- Leaderboard syncing

### ✅ Testing Requirements

#### Functional Tests
- [ ] Achievements load and display
- [ ] Progress tracking works
- [ ] Achievements unlock correctly
- [ ] Streak tracking accurate
- [ ] Streak bonuses apply
- [ ] Challenges load
- [ ] Challenge participation works
- [ ] Challenge progress updates
- [ ] Leaderboards display
- [ ] Rankings update
- [ ] XP earning works
- [ ] Coin earning works
- [ ] Level progression works
- [ ] Rewards distribution correct

#### Gamification Tests
- [ ] Achievement criteria validate
- [ ] Streak logic correct (no false breaks)
- [ ] Challenge timing accurate
- [ ] Leaderboard rankings correct
- [ ] Rarity system works
- [ ] Reward calculations accurate

#### Data Tests
- [ ] Achievements fetch from backend
- [ ] Streaks persist correctly
- [ ] Challenge data accurate
- [ ] Leaderboard data real-time
- [ ] XP/coins save correctly

#### UI Tests
- [ ] Achievement cards render
- [ ] Streak indicators display
- [ ] Challenge cards styled
- [ ] Leaderboard list renders
- [ ] Progress bars accurate
- [ ] Badges display correctly
- [ ] Animations work

#### Social Tests
- [ ] Team features work
- [ ] Sharing works
- [ ] Friend lists display
- [ ] Invites send

#### Performance Tests
- [ ] Large achievement lists scroll well
- [ ] Leaderboards load fast
- [ ] Real-time updates smooth
- [ ] No lag in animations

---

## 9. StudyLibraryScreen.tsx

### 📋 Description
Digital resource browser with search, offline download, note-taking, and subject-wise content organization.

### 🎯 Key Features

#### 9.1 Resource Management
- **Study Resources**
  - Title, subject, type
  - Resource types (pdf/video/audio/document/presentation/image)
  - File size
  - Upload date
  - Author/teacher
  - Description
  - Tags
  - Rating (1-5 stars)
  - Download count
  - Thumbnail preview

#### 9.2 Organization
- **Subject-Wise Organization**
  - Subject categories
  - Subject icon and color
  - Resource count per subject
  - Subject filtering

#### 9.3 Search & Filter
- **Advanced Search**
  - Search by title
  - Search by tags
  - Filter by type
  - Filter by subject
  - Filter modes (all/bookmarked/downloaded/recent)
  - Sort options (name/date/size/rating)

#### 9.4 View Modes
- Grid view (thumbnails)
- List view (detailed)
- Toggle between views

#### 9.5 Bookmarks
- Bookmark resources
- View bookmarked resources
- Unbookmark
- Bookmark sync

#### 9.6 Offline Downloads
- **Download Management**
  - Download resources
  - Download progress tracking
  - Offline access
  - Downloaded indicator
  - Delete downloads
  - Storage management

#### 9.7 Note-Taking
- **Notes System**
  - Create notes on resources
  - Note content
  - Page reference (for PDFs)
  - Timestamp
  - Color-coded notes
  - Edit/delete notes
  - Notes sync

#### 9.8 Resource Preview
- Preview PDFs
- Play videos
- Play audio
- View images
- Open documents

#### 9.9 Resource Actions
- Download
- Bookmark
- Share
- Rate
- Add note
- Open in external app

#### 9.10 Data Integration
- `getStudyMaterials` - Fetch resources
- AsyncStorage for offline data
- Real-time updates

### ✅ Testing Requirements

#### Functional Tests
- [ ] Resources load and display
- [ ] Subject filtering works
- [ ] Search functionality works
- [ ] Filter modes work
- [ ] Sort options work
- [ ] View mode toggle works
- [ ] Bookmark/unbookmark works
- [ ] Download resources works
- [ ] Download progress tracks
- [ ] Offline access works
- [ ] Delete downloads works
- [ ] Note creation works
- [ ] Note editing works
- [ ] Resource preview works
- [ ] Share functionality works
- [ ] Rating system works

#### Download Tests
- [ ] Files download successfully
- [ ] Progress tracking accurate
- [ ] Offline files accessible
- [ ] Large files download
- [ ] Multiple downloads queue
- [ ] Download pause/resume (if implemented)
- [ ] Storage limits enforced

#### Data Tests
- [ ] Resources fetch from Supabase
- [ ] Bookmarks persist
- [ ] Downloads cache locally
- [ ] Notes save correctly
- [ ] Ratings submit

#### UI Tests
- [ ] Grid view renders
- [ ] List view renders
- [ ] Resource cards display
- [ ] Thumbnails load
- [ ] Icons display correctly
- [ ] Download progress shows
- [ ] Loading states display
- [ ] Empty states show

#### File Tests
- [ ] PDFs open correctly
- [ ] Videos play
- [ ] Audio plays
- [ ] Images display
- [ ] External app opens

#### Performance Tests
- [ ] Large resource lists scroll well
- [ ] Search is fast
- [ ] Filtering instant
- [ ] Downloads don't block UI
- [ ] Preview loads quickly

---

## 10. ClassDetailScreen.tsx

### 📋 Description
Comprehensive class information and management interface with materials, recordings, and schedule.

### 🎯 Key Features

#### 10.1 Class Information
- **Class Details**
  - Subject
  - Teacher info (name, avatar, email, phone)
  - Schedule (day, time, duration, room)
  - Status (live/upcoming/completed)
  - Next class info (date, time, topic)

#### 10.2 Tab Navigation
- **Three Tabs**
  1. Overview tab
  2. Materials tab
  3. Recordings tab
  - Tab switching
  - Active tab indicator

#### 10.3 Class Materials
- **Study Materials**
  - Material list
  - File type (pdf/video/document)
  - File size
  - Upload date
  - Download button
  - Preview button
  - Share button

#### 10.4 Class Recordings
- **Recorded Classes**
  - Recording list
  - Title and date
  - Duration
  - File size
  - Play button
  - Download button
  - Share button

#### 10.5 Class Actions
- Join live class (if live)
- Add to calendar
- Contact teacher
- View schedule
- Set reminders

#### 10.6 Data Integration
- `getClassById` - Fetch class details
- `getStudyMaterialsBySubject` - Fetch materials
- `getProfileById` - Fetch teacher profile
- Real-time status updates

### ✅ Testing Requirements

#### Functional Tests
- [ ] Class details load
- [ ] Tab navigation works
- [ ] Materials list displays
- [ ] Recordings list displays
- [ ] Download materials works
- [ ] Download recordings works
- [ ] Preview materials works
- [ ] Play recordings works
- [ ] Join live class works
- [ ] Contact teacher works
- [ ] Add to calendar works
- [ ] Share functionality works

#### Data Tests
- [ ] Class info fetches
- [ ] Materials fetch by subject
- [ ] Teacher profile loads
- [ ] Status updates real-time

#### UI Tests
- [ ] Tabs render correctly
- [ ] Active tab highlights
- [ ] Material cards display
- [ ] Recording cards display
- [ ] Teacher info renders
- [ ] Schedule displays
- [ ] Status indicators show

#### File Tests
- [ ] Materials download
- [ ] Recordings download
- [ ] Preview works
- [ ] Playback works

#### Performance Tests
- [ ] Tab switching smooth
- [ ] Large material lists handle well
- [ ] Video playback smooth

---

## 11. Additional Student Screens

### 11.1 AITutorChatInterface.tsx
**Features:**
- Conversational AI chat
- Question answering
- Message history
- Typing indicators
- Code formatting
- Math equation rendering
- Image support
- Context awareness

### 11.2 CollaborativeAssignmentWorkspace.tsx
**Features:**
- Real-time collaboration
- Multiple users editing
- User cursors
- Comments and annotations
- Version history
- Auto-save
- Conflict resolution
- Presence indicators

### 11.3 PeerLearningNetwork.tsx
**Features:**
- Study groups
- Peer discussions
- Resource sharing
- Collaborative notes
- Group video calls
- File sharing
- Group chat
- Member management

### 11.4 LiveCollaborationStudio.tsx
**Features:**
- Whiteboard collaboration
- Screen sharing
- Video conferencing
- Real-time drawing
- Text chat
- File sharing
- Breakout sessions
- Recording

### 11.5 VirtualClassroomInterface.tsx
**Features:**
- Immersive classroom UI
- 3D seating arrangement
- Avatar system
- Interactive whiteboard
- Hand raising
- Quiz participation
- Attendance tracking
- Recording access

### 11.6 EnhancedInteractiveClassroomScreen.tsx
**Features:**
- Interactive lessons
- Real-time quizzes
- Polls and surveys
- Annotation tools
- Screen sharing view
- Resource library access
- Chat and Q&A
- Breakout rooms

### 11.7 StudentLiveClassScreen.tsx
**Features:**
- Live video streaming
- Audio/video controls
- Chat messaging
- Hand raising
- Screen viewing
- Recording indication
- Participant list
- Connection quality indicator

### 11.8 ActivityDetailScreen.tsx
**Features:**
- Activity information
- Instructions
- Time tracking
- Progress updates
- Resource links
- Submission interface
- Feedback display
- Completion status

### 11.9 EnhancedAIStudyAssistantScreen.tsx
**Features:**
- Advanced AI tutor
- Multi-modal learning
- Adaptive difficulty
- Progress tracking
- Smart recommendations
- Interactive exercises
- Performance analytics
- Study schedule optimization

### 11.10 StudentAILearningDashboard.tsx
**Features:**
- AI learning overview
- Personalized dashboard
- Learning path visualization
- Progress metrics
- AI recommendations
- Quick actions
- Recent activities
- Upcoming tasks

### 11.11 SimpleDoubtSubmissionScreen.tsx
**Features:**
- Simplified doubt form
- Quick submission
- Subject selection
- Text input
- Image attachment
- Submit button
- Confirmation message

### 11.12 ScheduleScreen.tsx
**Features:**
- Basic schedule view
- Class list
- Time slots
- Subject display
- Teacher names
- Room numbers
- Status indicators

---

## Cross-Screen Features

### 1. Navigation
- **React Navigation Integration**
  - Stack navigation
  - Tab navigation
  - Deep linking support
  - Navigation params
  - Screen transitions
  - Back button handling

### 2. Authentication
- **Auth Context**
  - `useAuth` hook
  - User authentication state
  - User profile data
  - Role-based access
  - Logout functionality

### 3. Theme Support
- **Theme Context**
  - `useTheme` hook
  - Light/dark themes
  - Theme switching
  - Consistent styling
  - Color schemes
  - Typography system

### 4. Offline Support
- **Offline Capabilities**
  - AsyncStorage caching
  - NetInfo integration
  - Offline indicators
  - Queue management
  - Auto-sync
  - Conflict resolution

### 5. Error Handling
- **Consistent Error UX**
  - Error states
  - Retry mechanisms
  - Error messages
  - Fallback UI
  - Logging

### 6. Loading States
- **Loading UX**
  - Skeleton loaders
  - Spinners
  - Progress indicators
  - Refresh controls
  - Lazy loading

### 7. Empty States
- **No Data UX**
  - Empty state messages
  - Call-to-action buttons
  - Illustrations
  - Helpful text

### 8. Notifications
- **Snackbar System**
  - Success messages
  - Error messages
  - Info messages
  - Warning messages
  - Auto-dismiss
  - Action buttons

### 9. Analytics
- **Usage Tracking**
  - Screen views
  - User actions
  - Event tracking
  - Performance monitoring

### 10. Accessibility
- **A11y Support**
  - Screen reader support
  - Keyboard navigation
  - Focus management
  - ARIA labels
  - Color contrast
  - Font scaling

---

## Testing Checklist

### Global Tests (All Screens)

#### ✅ Navigation Tests
- [ ] Screen loads correctly
- [ ] Navigation params pass correctly
- [ ] Back button works
- [ ] Deep links work
- [ ] Screen transitions smooth

#### ✅ Authentication Tests
- [ ] Requires authentication
- [ ] User data loads
- [ ] Unauthenticated redirect works
- [ ] Session expiry handled

#### ✅ Theme Tests
- [ ] Light theme applies
- [ ] Dark theme applies (if supported)
- [ ] Theme switching works
- [ ] Consistent styling

#### ✅ Offline Tests
- [ ] Works offline (cached data)
- [ ] Offline indicator shows
- [ ] Sync on reconnect
- [ ] Queue offline actions

#### ✅ Error Handling Tests
- [ ] Network errors handled
- [ ] API errors displayed
- [ ] Retry works
- [ ] Fallback UI shows

#### ✅ Loading States Tests
- [ ] Initial loading shows
- [ ] Refresh loading shows
- [ ] Button loading states
- [ ] Skeleton loaders

#### ✅ Empty States Tests
- [ ] Empty state displays when no data
- [ ] Helpful message shown
- [ ] CTA available

#### ✅ Performance Tests
- [ ] Load time acceptable (< 3s)
- [ ] Smooth scrolling
- [ ] No memory leaks
- [ ] Responsive interactions

#### ✅ Accessibility Tests
- [ ] Screen reader friendly
- [ ] Touch targets adequate (44x44 min)
- [ ] Color contrast sufficient
- [ ] Font scaling works

#### ✅ UI Tests
- [ ] Responsive layout
- [ ] Different screen sizes
- [ ] Orientation changes
- [ ] Safe area respected
- [ ] Status bar styled

---

## Data Requirements

### Supabase Tables

#### 1. students
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- name (text)
- email (text)
- avatar_url (text)
- grade (text)
- section (text)
- created_at (timestamp)
```

#### 2. classes
```sql
- id (uuid, primary key)
- subject (text)
- teacher_id (uuid, foreign key)
- schedule (jsonb) {day, time, duration, room}
- status (text) {live, upcoming, completed, cancelled}
- is_recurring (boolean)
- created_at (timestamp)
```

#### 3. assignments
```sql
- id (uuid, primary key)
- title (text)
- description (text)
- subject (text)
- teacher_id (uuid, foreign key)
- class_id (uuid, foreign key)
- due_date (timestamp)
- max_points (integer)
- submission_type (text) {file, text, both}
- created_at (timestamp)
```

#### 4. submissions
```sql
- id (uuid, primary key)
- assignment_id (uuid, foreign key)
- student_id (uuid, foreign key)
- submitted_date (timestamp)
- files (jsonb)
- text_content (text)
- score (integer)
- feedback (text)
- graded_date (timestamp)
```

#### 5. doubts
```sql
- id (uuid, primary key)
- student_id (uuid, foreign key)
- subject (text)
- topic (text)
- question (text)
- description (text)
- attachments (jsonb)
- priority (text) {low, medium, high}
- status (text) {pending, answered, closed}
- answer (text)
- answered_by (uuid, foreign key)
- answered_at (timestamp)
- created_at (timestamp)
```

#### 6. study_materials
```sql
- id (uuid, primary key)
- title (text)
- subject (text)
- type (text) {pdf, video, audio, document, presentation, image}
- file_url (text)
- file_size (text)
- upload_date (timestamp)
- author_id (uuid, foreign key)
- description (text)
- tags (text[])
- rating (numeric)
- download_count (integer)
- thumbnail_url (text)
```

#### 7. achievements
```sql
- id (uuid, primary key)
- student_id (uuid, foreign key)
- achievement_type (text)
- name (text)
- description (text)
- icon (text)
- category (text)
- rarity (text)
- xp_reward (integer)
- coin_reward (integer)
- unlocked_at (timestamp)
```

#### 8. student_progress
```sql
- id (uuid, primary key)
- student_id (uuid, foreign key)
- subject (text)
- current_score (numeric)
- previous_score (numeric)
- trend (text) {up, down, stable}
- skills (jsonb)
- updated_at (timestamp)
```

#### 9. notifications
```sql
- id (uuid, primary key)
- student_id (uuid, foreign key)
- title (text)
- message (text)
- type (text) {info, success, warning, urgent}
- is_read (boolean)
- created_at (timestamp)
```

#### 10. learning_analytics
```sql
- id (uuid, primary key)
- student_id (uuid, foreign key)
- study_streak (integer)
- average_session_length (integer)
- preferred_study_times (text[])
- most_productive_day (text)
- completion_rate (numeric)
- improvement_trend (text)
- attention_span (integer)
- retention_rate (numeric)
- updated_at (timestamp)
```

---

## Integration Points

### 1. Supabase Integration
- **Real-time subscriptions**
  - Class status updates
  - Assignment submissions
  - Notifications
  - Chat messages
  - Poll updates

- **Authentication**
  - Row-level security (RLS)
  - User permissions
  - Role-based access

- **Storage**
  - File uploads (assignments, doubts, resources)
  - File downloads
  - Thumbnail generation

### 2. React Query Integration
- **Query hooks**
  - Data fetching
  - Caching (5 min default)
  - Background refetching
  - Automatic retries (3 attempts)

- **Mutation hooks**
  - Data updates
  - Optimistic updates
  - Cache invalidation
  - Error rollback

- **Query keys**
  - Consistent naming
  - Proper invalidation
  - Dependent queries

### 3. Navigation Integration
- **React Navigation**
  - Stack navigators
  - Tab navigators
  - Deep linking
  - Navigation params

### 4. Context Integration
- **AuthContext**
  - User state
  - Authentication methods
  - User profile

- **ThemeContext**
  - Theme state
  - Theme switching
  - Theme values

### 5. Service Integration
- **API Services**
  - classesService
  - assignmentsService
  - doubtsService
  - studyMaterialsService
  - studentProgressService
  - aiStudyAssistantService
  - gamificationService
  - notificationService

### 6. External Integrations
- **Device Calendar**
  - Add events
  - Read events
  - Sync

- **File System**
  - Download files
  - Access files
  - Delete files

- **Network**
  - NetInfo for connectivity
  - Online/offline detection

- **Storage**
  - AsyncStorage for persistence
  - Secure storage for sensitive data

---

## Conclusion

This comprehensive requirements document covers all 25 student screens with detailed feature lists, user flows, data requirements, and testing checklists. Use this document as the single source of truth for testing and validating the student module of the Manushi Coaching Platform.

### Key Points
- ✅ 25 screens documented
- ✅ 200+ features identified
- ✅ Complete data model defined
- ✅ Testing checklists provided
- ✅ Integration points mapped
- ✅ Cross-screen features documented

### Next Steps
1. Review this document with stakeholders
2. Create test cases based on checklists
3. Set up test data in Supabase
4. Begin systematic testing
5. Track issues and bugs
6. Update documentation as needed

---

**Document End**

# Parent Section - Product Requirements Document

## Document Control
- **Version:** 1.0
- **Date:** 2025-10-19
- **Status:** Draft - Gap Analysis Phase
- **Project:** Coaching/EdTech Platform Parent Portal
- **Tech Stack:** React Native, TypeScript, Supabase

---

## 1. Executive Summary

### Product Vision
Create a comprehensive parent portal that empowers parents to actively engage in their children's educational journey through real-time monitoring, intelligent insights, seamless communication, and convenient financial management.

### Target Users
- **Primary:** Engaged Parent (Daily active users monitoring 1-3 children)
- **Secondary:** Occasional Monitor (Weekly check-ins, event-driven usage)
- **Tertiary:** Multi-Child Parent (Managing 4+ children across different grades)

### Key Success Metrics
- **Engagement:** 70% of parents logging in at least 3x per week
- **Satisfaction:** Net Promoter Score (NPS) > 50
- **Adoption:** 90% of features used at least once within first month
- **Performance:** <3s dashboard load time on 4G connection
- **Support:** <5% support ticket volume from parent users

### Current State Assessment
**Implementation Status:** Early development phase (Phase 51-89 mock implementations)
- 6 main screen files analyzed
- All features using **100% mock data**
- No backend integration completed
- No production-ready authentication/authorization
- No real-time data synchronization
- No data privacy/security implementations

---

## 2. Product Overview

### Current Implementation Status

#### Files Analyzed
1. **ParentNavigator.tsx** - Bottom tab navigation structure (4 main sections)
2. **SmartParentInsights.tsx** - AI-powered insights component (mock data)
3. **ParentDashboard.tsx** (Phase 89) - Smart insights dashboard
4. **EnhancedParentDashboardScreen.tsx** (Phase 50) - Comprehensive multi-tab dashboard
5. **ParentFeatureValidationScreen.tsx** (Phase 51) - Testing/validation screen
6. **ParentDashboard.tsx** (dashboard folder) - Alternative coaching dashboard

#### Tech Stack Summary
```typescript
// Current Dependencies (from code analysis)
- React Native: Mobile framework
- TypeScript: Type safety
- React Navigation: Navigation (@react-navigation/bottom-tabs, @react-navigation/native-stack)
- React Native Paper: UI components (Appbar, Portal, Snackbar)
- Supabase: Backend (referenced but not implemented)
- Theme/Context: Custom theming system
```

#### Navigation Architecture
```
ParentNavigator (Bottom Tabs)
├── Home Stack
│   ├── ParentDashboard
│   ├── EnhancedDashboard
│   └── InformationHub
├── Children Stack
│   ├── ChildProgress
│   ├── PerformanceAnalytics
│   └── AcademicSchedule
├── Communication Stack
│   ├── TeacherCommunication
│   └── CommunityEngagement
└── Billing Stack
    ├── BillingInvoice
    └── PaymentProcessing
```

---

## 3. User Personas

### Primary: Engaged Parent
**Demographics:**
- Age: 30-45
- Tech Savvy: Medium to High
- Children: 1-2 (ages 10-18)
- Usage: Daily, 15-30 min sessions

**Goals:**
- Monitor real-time academic progress
- Receive instant alerts about important events
- Communicate efficiently with teachers
- Track spending and payments
- Identify early warning signs of academic issues

**Pain Points:**
- Information overload from multiple communication channels
- Delayed notification of academic concerns
- Difficulty coordinating with multiple teachers
- Unclear fee structures and due dates
- No centralized view of child's overall wellbeing

**User Journey:**
1. Morning: Check overnight notifications and upcoming classes
2. Midday: Review any new teacher messages or grade updates
3. Evening: Monitor homework completion and study time
4. Weekly: Review comprehensive progress reports
5. Monthly: Process fee payments and review financial summary

---

### Secondary: Occasional Monitor
**Demographics:**
- Age: 35-50
- Tech Savvy: Low to Medium
- Children: 2-3 (mixed ages)
- Usage: 2-3x per week, event-driven

**Goals:**
- Stay informed about major events
- Handle urgent notifications
- Process payments on time
- Attend parent-teacher meetings

**Pain Points:**
- Overwhelmed by frequent notifications
- Difficulty finding specific information quickly
- Unclear priority of messages
- Forget payment deadlines

---

### Tertiary: Multi-Child Parent
**Demographics:**
- Age: 35-55
- Tech Savvy: Medium
- Children: 4+ (ages 5-18)
- Usage: Daily but time-constrained

**Goals:**
- Efficiently manage multiple children's information
- Quickly identify which child needs attention
- Bulk operations for common tasks
- Consolidated financial view

**Pain Points:**
- Context-switching between children is tedious
- Cannot compare children's performance easily
- Financial tracking across multiple children is complex
- Difficult to prioritize urgent matters

---

## 4. Feature Inventory

### 4.1 Dashboard & Overview Features

#### Multi-Child Overview (Implemented - Mock Data)
**File:** `EnhancedParentDashboardScreen.tsx`, `ParentDashboard.tsx` (dashboard)
**Status:** UI Complete, Backend Missing
**Features:**
- Child selector with avatar/name display
- Overall grade display per child
- Attendance rate visualization (progress bars)
- Assignments completed counter (X/Y format)
- Upcoming exams count
- Today's status badge (in-class, completed, absent)
- Recent activities timeline
- Quick stats grid (subjects, messages, pending fees)

**Mock Data Structures:**
```typescript
interface ChildProgress {
  id: string;
  name: string;
  grade: string;
  class: string;
  overallGrade: number;
  attendanceRate: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  upcomingExams: number;
  recentActivities: Activity[];
  subjectPerformance: SubjectPerformance[];
  behaviorRating: 'excellent' | 'good' | 'needs_improvement';
  teacherComments: TeacherComment[];
}
```

---

#### Smart AI-Powered Insights (Implemented - Mock Data)
**File:** `SmartParentInsights.tsx`
**Status:** Advanced UI Complete, AI/Backend Missing
**Features:**
- AI Score calculation (0-100 scale)
- Risk factor identification with severity levels
- Growth opportunity detection
- Behavior trend analysis
- Academic performance predictions
- Recommended action items with priority
- Multi-tab interface (overview, risks, opportunities, actions)

**Data Structures:**
```typescript
interface ChildInsight {
  id: string;
  name: string;
  grade: string;
  aiScore: number; // 0-100
  riskFactors: RiskFactor[]; // Academic, behavioral, social, health
  opportunities: Opportunity[]; // Categories: academic_excellence, skill_development, leadership, creativity
  behaviorTrends: BehaviorTrend[]; // Trending metrics
  academicPredictions: AcademicPrediction[]; // Predictive modeling
  recommendedActions: RecommendedAction[]; // Prioritized interventions
}
```

**Risk Analysis:**
- Severity: low | medium | high | critical
- Types: academic, behavioral, social, health
- Probability scores (0-1)
- Suggested interventions
- Timeline for action

**Opportunities:**
- Confidence scores (0-1)
- Requirements list
- Expected outcomes
- Categories for organization

---

### 4.2 Academic Progress Features

#### Subject Performance Tracking (Implemented - Mock Data)
**File:** `EnhancedParentDashboardScreen.tsx`, `ParentDashboard.tsx`
**Status:** UI Complete, Real-time Data Missing
**Features:**
- Subject-wise grade display
- Trend indicators (improving, declining, stable)
- Last assessment scores
- Upcoming exams counter
- Teacher notes per subject
- Visual progress bars
- Color-coded performance indicators

**Data Structure:**
```typescript
interface SubjectPerformance {
  subject: string;
  currentGrade: number;
  trend: 'improving' | 'declining' | 'stable';
  lastAssessment: number;
  upcomingExams: number;
  teacherNote?: string;
}
```

---

#### Progress Reports & Analytics (Implemented - Mock Data)
**File:** `ParentDashboard.tsx` (dashboard)
**Features:**
- Detailed subject progress cards
- Teacher attribution
- Last updated timestamps
- Trend visualization (📈📉➡️)
- Score percentages with color coding
- Drill-down capability (onNavigate handlers)

---

#### Academic Calendar & Schedule (Referenced - Not Implemented)
**File:** `ParentNavigator.tsx` references `AcademicScheduleScreen`
**Status:** Screen file referenced but not analyzed
**Expected Features:**
- Class timetable
- Exam schedule
- Assignment deadlines
- School holidays
- Event calendar

---

### 4.3 Financial Management Features

#### Financial Summary Dashboard (Implemented - Mock Data)
**File:** `EnhancedParentDashboardScreen.tsx`, `ParentDashboard.tsx`
**Status:** UI Complete, Payment Integration Missing
**Features:**
- Total fees overview
- Paid amount tracking
- Pending amount display
- Next due date alerts
- Payment history timeline
- Discount tracking (sibling, early payment, financial aid)
- Status badges (paid, pending, overdue)

**Data Structures:**
```typescript
interface FinancialSummary {
  totalFees: number;
  paidAmount: number;
  pendingAmount: number;
  nextDueDate: string;
  paymentHistory: Payment[];
  discounts: Discount[];
}

interface Payment {
  id: string;
  amount: number;
  date: string;
  method: string; // UPI, Credit Card, Bank Transfer
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

interface Discount {
  id: string;
  type: 'academic' | 'sibling' | 'early_payment' | 'financial_aid';
  amount: number;
  description: string;
  validUntil: string;
}
```

---

#### Payment Processing (Referenced - Not Implemented)
**File:** `ParentNavigator.tsx` references `PaymentProcessingScreen`
**Status:** Screen referenced, no payment gateway integration
**Expected Features:**
- Multiple payment methods (UPI, Card, Bank Transfer)
- Secure payment gateway integration
- Payment confirmation
- Receipt generation
- Payment reminders

---

#### Billing & Invoices (Referenced - Not Implemented)
**File:** `ParentNavigator.tsx` references `BillingInvoiceScreen`
**Status:** Screen referenced but not analyzed
**Expected Features:**
- Invoice listing
- Invoice download
- Payment history
- Fee structure breakdown
- Tax documentation

---

### 4.4 Communication Features

#### Teacher Communication Hub (Implemented - Mock Data)
**File:** `EnhancedParentDashboardScreen.tsx`, `ParentDashboard.tsx`
**Status:** UI Complete, Real-time Messaging Missing
**Features:**
- Message inbox with unread indicators
- Message priority levels (high, medium, low)
- Message types (announcement, grade, message, event)
- Sender information (teacher, admin, principal)
- Read/unread status tracking
- Response required flags
- Attachment support (referenced)
- Time-based sorting

**Data Structure:**
```typescript
interface CommunicationItem {
  id: string;
  from: string;
  fromRole: 'teacher' | 'admin' | 'principal';
  subject: string;
  message: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  requiresResponse: boolean;
  attachments?: string[];
}
```

**Communication Actions (Mock):**
- Compose message
- Schedule meeting
- Emergency contact

---

#### School Information Hub (Implemented - Mock Data)
**File:** `EnhancedParentDashboardScreen.tsx`, `ParentNavigator.tsx`
**Status:** UI Complete, Content Management Missing
**Features:**
- School announcements (with importance flags)
- Academic calendar
- School policies and documents
- Staff directory with contact info
- Emergency procedures
- Quick access navigation
- Category filtering (general, academic, administrative, emergency)

**Data Structures:**
```typescript
interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'general' | 'academic' | 'administrative' | 'emergency';
  targetAudience: string[];
  isImportant: boolean;
  expiryDate?: string;
}

interface SchoolContact {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  officeHours: string;
  location: string;
}
```

---

#### Community Engagement (Referenced - Not Implemented)
**File:** `ParentNavigator.tsx` references `CommunityEngagementScreen`
**Status:** Screen referenced but not analyzed
**Expected Features:**
- Parent community forums
- Event participation
- Volunteer opportunities
- Parent groups

---

### 4.5 Monitoring & Analytics Features

#### Digital Monitoring Tools (Implemented - Mock Data)
**File:** `ParentDashboard.tsx` (dashboard)
**Status:** Concept UI Complete, Device Integration Missing
**Features:**
- Study time tracking (daily, weekly, targets)
- App usage analysis with breakdown
- Educational vs entertainment time
- Screen time summary
- Weekly limits tracking
- Visual progress indicators

**Data Structure:**
```typescript
interface MonitoringData {
  studyTime: {
    today: number;
    thisWeek: number;
    target: number;
  };
  appUsage: {
    educational: number;
    total: number;
    breakdown: { app: string; time: number; category: string }[];
  };
  screenTime: {
    daily: number;
    weekly: number;
    limit: number;
  };
}
```

**Note:** This requires device-level integration (parental control APIs) not implemented.

---

#### Child Progress Monitoring (Referenced - Not Implemented)
**File:** `ParentNavigator.tsx` references `ChildProgressMonitoringScreen`
**Status:** Screen referenced but not analyzed
**Expected Features:**
- Detailed child-specific analytics
- Historical progress tracking
- Comparison tools
- Export capabilities

---

#### Performance Analytics (Referenced - Not Implemented)
**File:** `ParentNavigator.tsx` references `PerformanceAnalyticsScreen`
**Status:** Screen referenced but not analyzed
**Expected Features:**
- Advanced analytics dashboards
- Data visualization
- Trend analysis
- Benchmark comparisons

---

### 4.6 Feature Validation & Testing

#### Comprehensive Validation Suite (Implemented - Mock Tests)
**File:** `ParentFeatureValidationScreen.tsx`
**Status:** Testing UI Complete, Test Integration Missing
**Features:**
- Validation test suites (workflow, performance, integration, usability, mobile)
- Test execution simulation
- Performance benchmarks tracking
- Validation scoring (overall, performance, usability, integration)
- Test result visualization
- Export validation reports

**Test Categories:**
- Workflow testing (dashboard, engagement, responsiveness)
- Performance metrics (load time, response time, memory, battery)
- Integration testing (payment, messaging systems)
- Usability testing (accessibility, user satisfaction)
- Mobile optimization (touch interface, offline functionality)

---

### 4.7 Action Items & To-Do Management

#### Action Items Dashboard (Implemented - Mock Data)
**File:** `EnhancedParentDashboardScreen.tsx`
**Status:** UI Complete, Task Management Backend Missing
**Features:**
- Action item listing with priorities
- Due date tracking
- Status management (pending, completed, overdue)
- Action types (payment, form, meeting, document, permission)
- Child-specific action linking
- Quick completion actions

**Data Structure:**
```typescript
interface ActionItem {
  id: string;
  title: string;
  description: string;
  type: 'payment' | 'form' | 'meeting' | 'document' | 'permission';
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  childId?: string;
}
```

---

### 4.8 Quick Actions & Shortcuts

#### Quick Access Features (Implemented - Mock)
**File:** `ParentDashboard.tsx` (dashboard), `EnhancedParentDashboardScreen.tsx`
**Status:** UI Complete, Backend Actions Missing
**Features:**
- Contact Teacher
- Schedule Meeting
- View Timetable
- Download Reports
- Make Payment
- Emergency Contact
- Quick access grid layout
- Icon-based navigation

---

## 5. User Stories & Acceptance Criteria

### Epic 1: Parent Dashboard & Child Overview

#### US-001: View Multi-Child Dashboard
**As a** parent with multiple children,
**I want to** see an overview of all my children's performance in one dashboard,
**So that** I can quickly identify which child needs attention.

**Acceptance Criteria:**
- [ ] Given I have 2+ children enrolled, when I open the parent dashboard, then I see a list/tabs for all children
- [ ] Given I select a specific child, when the view loads, then I see their overall grade, attendance, and recent activities
- [ ] Given I'm viewing the dashboard, when new data arrives, then the view auto-refreshes without manual reload
- [ ] Given the dashboard is loading, when data fetch takes >2s, then I see a loading indicator
- [ ] Given I have no children enrolled, when I access the dashboard, then I see a helpful empty state with onboarding instructions

**Technical Notes:**
- Current implementation: `EnhancedParentDashboardScreen.tsx` lines 195-198 (mock data generation)
- Child selector: `ParentDashboard.tsx` (dashboard) lines 322-343
- Data source: Currently mock `children` array, needs Supabase query from `students` table with parent_id filter
- Real-time: Requires Supabase Realtime subscription

**Priority:** Must Have (MVP)

---

#### US-002: Monitor Child Attendance in Real-Time
**As a** parent,
**I want to** see my child's current attendance status and rate,
**So that** I can ensure they're attending classes regularly.

**Acceptance Criteria:**
- [ ] Given my child is currently in class, when I check their status, then I see "IN CLASS" badge
- [ ] Given my child completed classes for the day, when I check, then I see "COMPLETED" status
- [ ] Given my child is absent, when I check within 30 minutes of class start, then I receive an absence alert
- [ ] Given I'm viewing attendance, when I see the attendance rate, then it's calculated as (attended/total) * 100
- [ ] Given attendance data is historical, when I tap on attendance rate, then I see a detailed attendance calendar

**Technical Notes:**
- Current implementation: `ParentDashboard.tsx` (dashboard) lines 372-381 (visual progress bar)
- Status badge: `EnhancedParentDashboardScreen.tsx` lines 304-328
- Status determination: Needs real-time class schedule + attendance marking integration
- Alert system: Not implemented, requires push notification setup

**Priority:** Must Have (MVP)

---

#### US-003: Access AI-Powered Smart Insights
**As an** engaged parent,
**I want to** receive AI-generated insights about my child's performance and behavior,
**So that** I can proactively address issues before they become serious.

**Acceptance Criteria:**
- [ ] Given my child has 30+ days of data, when I view Smart Insights, then I see an AI Score (0-100)
- [ ] Given risk factors are detected, when I view the Risks tab, then I see severity, probability, and suggested interventions
- [ ] Given opportunities are identified, when I view Opportunities tab, then I see confidence scores and requirements
- [ ] Given I select a recommended action, when I tap "Take Action", then I'm guided to relevant resources or scheduling
- [ ] Given insights are updated, when new data arrives, then AI score and recommendations refresh daily

**Technical Notes:**
- Current implementation: `SmartParentInsights.tsx` (complete UI, lines 112-174 mock data)
- AI calculation: Not implemented, needs ML model or rule-based engine
- Risk detection: Lines 119-127 (mock risk factors)
- Action handling: Lines 199-202 (stub function)
- Backend requirement: AI/ML service for predictive analytics

**Priority:** Should Have (Post-MVP v1.1)

---

### Epic 2: Academic Progress Tracking

#### US-004: View Subject-Wise Performance
**As a** parent,
**I want to** see detailed performance breakdown by subject,
**So that** I can identify where my child needs additional support.

**Acceptance Criteria:**
- [ ] Given my child has grades in 4+ subjects, when I view Academic tab, then I see all subjects listed
- [ ] Given I'm viewing a subject, when I see the grade, then I also see trend indicator (↗️ improving, ↘️ declining, → stable)
- [ ] Given a subject has a teacher note, when I view the subject card, then the note is displayed prominently
- [ ] Given I tap on a subject, when the detail view opens, then I see historical grade data and assessment breakdown
- [ ] Given grades are updated, when a teacher submits new grades, then I receive a notification within 15 minutes

**Technical Notes:**
- Current implementation: `EnhancedParentDashboardScreen.tsx` lines 576-603 (modal view)
- Subject cards: `ParentDashboard.tsx` (dashboard) lines 412-450
- Trend calculation: Mock data, needs historical grade analysis
- Notification: Not implemented

**Priority:** Must Have (MVP)

---

#### US-005: Track Assignments and Homework Completion
**As a** parent,
**I want to** monitor my child's assignment completion rate,
**So that** I can ensure they're staying on top of their work.

**Acceptance Criteria:**
- [ ] Given assignments are posted, when I check dashboard, then I see assignments completed vs total (e.g., 18/20)
- [ ] Given assignments have due dates, when an assignment is overdue, then it's highlighted in red
- [ ] Given I tap on assignment count, when detail view opens, then I see list of all assignments with status
- [ ] Given an assignment is submitted, when the status updates, then the completion counter increments in real-time
- [ ] Given upcoming assignments exist, when I view the list, then they're sorted by due date

**Technical Notes:**
- Current implementation: `EnhancedParentDashboardScreen.tsx` lines 340-342 (counter display)
- Assignment details: Not implemented
- Real-time updates: Requires Supabase subscription to `assignments` table
- Data model: Needs `child_assignments` table with status tracking

**Priority:** Must Have (MVP)

---

### Epic 3: Financial Management

#### US-006: View Financial Summary and Pending Payments
**As a** parent,
**I want to** see a clear summary of all fees, payments, and pending amounts,
**So that** I can manage my financial obligations to the school.

**Acceptance Criteria:**
- [ ] Given I have fee obligations, when I view Financial tab, then I see total fees, paid amount, and pending amount
- [ ] Given payments are pending, when I view the summary, then I see the next due date prominently displayed
- [ ] Given I have payment history, when I view the Financial tab, then I see last 10 transactions
- [ ] Given a payment is overdue, when I open the app, then I see an urgent alert on the dashboard
- [ ] Given discounts are applied, when I view fees, then I see discount breakdown with validity dates

**Acceptance Criteria:**
- [ ] Given I have fee obligations, when I view Financial tab, then I see total fees, paid amount, and pending amount
- [ ] Given payments are pending, when I view the summary, then I see the next due date prominently displayed
- [ ] Given I have payment history, when I view the Financial tab, then I see last 10 transactions
- [ ] Given a payment is overdue, when I open the app, then I see an urgent alert on the dashboard
- [ ] Given discounts are applied, when I view fees, then I see discount breakdown with validity dates

**Technical Notes:**
- Current implementation: `EnhancedParentDashboardScreen.tsx` lines 435-483 (summary UI)
- Mock data: Lines 1582-1631 (complete financial mock)
- Payment history: Lines 486-518
- Discount display: Lines 521-542
- Alert system: Not implemented
- Data source: Needs `fee_structure`, `payments`, `discounts` tables

**Priority:** Must Have (MVP)

---

#### US-007: Process Online Payments Securely
**As a** parent,
**I want to** pay school fees directly through the app,
**So that** I can conveniently manage payments without visiting the school.

**Acceptance Criteria:**
- [ ] Given I have pending fees, when I tap "Pay Now", then I see payment method options (UPI, Credit Card, Bank Transfer)
- [ ] Given I select a payment method, when I proceed, then I'm directed to a secure payment gateway
- [ ] Given payment is successful, when transaction completes, then I receive instant confirmation with receipt
- [ ] Given payment fails, when error occurs, then I see clear error message and retry option
- [ ] Given payment is completed, when I return to dashboard, then pending amount updates immediately

**Technical Notes:**
- Current implementation: `EnhancedParentDashboardScreen.tsx` lines 233-244 (mock alert)
- Payment button: Lines 473-480
- Payment integration: Not implemented
- Required: Payment gateway integration (Razorpay, Stripe, or equivalent)
- Security: PCI DSS compliance for card payments, UPI SDK for UPI payments
- Receipt generation: Not implemented

**Priority:** Must Have (MVP - Critical for production)

---

### Epic 4: Communication & Messaging

#### US-008: Receive and View Messages from Teachers
**As a** parent,
**I want to** receive messages from my child's teachers in a centralized inbox,
**So that** I don't miss important communications.

**Acceptance Criteria:**
- [ ] Given teachers send messages, when I open Communication tab, then I see all messages sorted by date
- [ ] Given I have unread messages, when I view the inbox, then unread messages are highlighted
- [ ] Given a message is high priority, when I view the list, then priority messages are shown first
- [ ] Given I read a message, when I tap on it, then it's marked as read immediately
- [ ] Given a message requires response, when I view it, then I see "Response Required" flag and can reply

**Technical Notes:**
- Current implementation: `EnhancedParentDashboardScreen.tsx` lines 891-1092 (communication tab)
- Message cards: Lines 995-1052 (with unread styling)
- Mock data: Lines 1634-1668
- Priority display: Lines 1025-1035
- Reply functionality: Not implemented (only alerts)
- Real-time: Needs Supabase Realtime for instant message delivery

**Priority:** Must Have (MVP)

---

#### US-009: Initiate Communication with Teachers
**As a** parent,
**I want to** send messages to my child's teachers,
**So that** I can ask questions or address concerns.

**Acceptance Criteria:**
- [ ] Given I want to contact a teacher, when I tap "Compose Message", then I see a message composition screen
- [ ] Given I'm composing a message, when I select recipient, then I see list of all my child's teachers
- [ ] Given I send a message, when it's submitted, then I receive confirmation and it appears in my sent items
- [ ] Given I attach a file, when sending message, then attachment is uploaded securely (max 10MB)
- [ ] Given teacher replies, when response arrives, then I receive push notification

**Technical Notes:**
- Current implementation: `EnhancedParentDashboardScreen.tsx` lines 1063-1070 (compose button - mock alert)
- Message composer: Not implemented
- File upload: Not implemented
- Push notifications: Not implemented
- Data model: Needs `messages` table with parent/teacher threading

**Priority:** Should Have (Post-MVP v1.1)

---

#### US-010: Schedule Parent-Teacher Meetings
**As a** parent,
**I want to** schedule meetings with teachers through the app,
**So that** I can easily coordinate meeting times without phone calls.

**Acceptance Criteria:**
- [ ] Given I want to meet a teacher, when I tap "Schedule Meeting", then I see teacher availability calendar
- [ ] Given I select a time slot, when I confirm, then meeting invitation is sent to teacher
- [ ] Given teacher approves, when confirmation arrives, then meeting is added to my calendar with reminder
- [ ] Given teacher declines, when notification arrives, then I can propose alternate times
- [ ] Given meeting is upcoming, when it's 1 hour away, then I receive a reminder notification

**Technical Notes:**
- Current implementation: `EnhancedParentDashboardScreen.tsx` lines 1072-1079 (schedule button - mock alert)
- `ParentDashboard.tsx` (dashboard) lines 676-679 (quick action)
- Meeting scheduler: Not implemented
- Calendar integration: Not implemented
- Reminder system: Not implemented
- Data model: Needs `meetings` table with status workflow

**Priority:** Could Have (Post-MVP v1.2)

---

### Epic 5: School Information & Resources

#### US-011: View School Announcements and Events
**As a** parent,
**I want to** stay informed about school-wide announcements and events,
**So that** I don't miss important dates or updates.

**Acceptance Criteria:**
- [ ] Given school posts announcements, when I view Info tab, then I see announcements sorted by date
- [ ] Given an announcement is marked important, when I view the list, then it has a visual indicator (⚠️)
- [ ] Given announcements have categories, when I filter, then I can view by category (general, academic, emergency)
- [ ] Given an announcement has expiry date, when date passes, then it's automatically archived
- [ ] Given new announcement is posted, when it arrives, then I receive push notification (if opted in)

**Technical Notes:**
- Current implementation: `EnhancedParentDashboardScreen.tsx` lines 1150-1215 (announcements UI)
- Mock data: Lines 1156-1180 (sample announcements)
- Important flag: Lines 1184-1190
- Category badges: Lines 1202-1212
- Filtering: Not implemented
- Push notifications: Not implemented
- Data source: Needs `announcements` table with target audience filtering

**Priority:** Should Have (Post-MVP v1.1)

---

#### US-012: Access School Contact Directory
**As a** parent,
**I want to** easily find contact information for school staff,
**So that** I can reach the right person in case of emergency or inquiry.

**Acceptance Criteria:**
- [ ] Given I need to contact school, when I view Info tab, then I see contact directory
- [ ] Given I view a contact, when I tap phone number, then device dialer opens with number
- [ ] Given I view a contact, when I tap email, then email client opens with pre-filled recipient
- [ ] Given contacts have office hours, when I view a contact, then hours are displayed
- [ ] Given a contact is emergency-designated, when I view them, then they have "EMERGENCY" badge

**Technical Notes:**
- Current implementation: `EnhancedParentDashboardScreen.tsx` lines 1218-1303 (contact cards)
- Mock data: Lines 1223-1256
- Phone/email actions: Lines 1275-1293 (mock alerts, need native linking)
- Emergency badge: Lines 1267-1271
- Native integration: Requires React Native Linking API
- Data source: Needs `school_contacts` table

**Priority:** Should Have (Post-MVP v1.1)

---

#### US-013: View Emergency Procedures
**As a** parent,
**I want to** access school emergency procedures and protocols,
**So that** I know what to do in case of emergencies.

**Acceptance Criteria:**
- [ ] Given emergencies are documented, when I view Info tab, then I see emergency procedures section
- [ ] Given I select an emergency type, when I view details, then I see step-by-step procedures
- [ ] Given emergency contacts are listed, when I view them, then I can call directly
- [ ] Given procedures are updated, when admin updates content, then I see latest version
- [ ] Given I'm offline, when I access emergency info, then cached version is available

**Technical Notes:**
- Current implementation: `EnhancedParentDashboardScreen.tsx` lines 1306-1363 (emergency cards)
- Mock data: Lines 1312-1334
- Emergency types: Medical, Weather, Security
- Call functionality: Not implemented (native linking needed)
- Offline support: Not implemented
- Data source: Needs `emergency_procedures` table

**Priority:** Should Have (Post-MVP v1.1)

---

### Epic 6: Monitoring & Digital Wellbeing

#### US-014: Monitor Child's Study Time
**As a** parent,
**I want to** track my child's study time and progress toward weekly goals,
**So that** I can ensure they're dedicating adequate time to academics.

**Acceptance Criteria:**
- [ ] Given my child uses study tracking, when I view Monitoring tab, then I see today's study time
- [ ] Given weekly target is set, when I view progress, then I see completion percentage
- [ ] Given study session starts, when child logs time, then dashboard updates in real-time
- [ ] Given target is not met, when week ends, then I receive summary report with recommendations
- [ ] Given I want to adjust targets, when I change weekly goal, then child is notified

**Technical Notes:**
- Current implementation: `ParentDashboard.tsx` (dashboard) lines 550-583 (study time UI)
- Mock data: Lines 244-249
- Progress bar: Lines 567-582
- Real-time tracking: Not implemented
- Device integration: Requires student app with time tracking
- Notifications: Not implemented
- Data model: Needs `study_sessions` table

**Priority:** Could Have (Post-MVP v1.2)

---

#### US-015: Analyze App Usage Patterns
**As a** parent,
**I want to** see how my child is using educational vs entertainment apps,
**So that** I can ensure balanced device usage.

**Acceptance Criteria:**
- [ ] Given child uses monitored device, when I view App Usage, then I see breakdown by app
- [ ] Given apps are categorized, when I view analysis, then I see educational vs entertainment percentages
- [ ] Given usage limits are set, when child exceeds limit, then I receive alert
- [ ] Given I view weekly trends, when I check analytics, then I see 7-day usage chart
- [ ] Given I want to set restrictions, when I configure limits, then they're enforced on child's device

**Technical Notes:**
- Current implementation: `ParentDashboard.tsx` (dashboard) lines 585-610 (app usage UI)
- Mock data: Lines 250-258
- Category-based visualization: Lines 594-608
- Device enforcement: Not implemented (requires MDM solution or parental control SDK)
- Alert system: Not implemented
- Platform limitation: Requires OS-level permissions (iOS Screen Time API, Android Digital Wellbeing API)

**Priority:** Won't Have (Future - requires complex device integration)

---

### Epic 7: Quick Actions & Workflows

#### US-016: Access Quick Action Shortcuts
**As a** time-constrained parent,
**I want to** access common actions through quick shortcuts,
**So that** I can complete tasks efficiently without deep navigation.

**Acceptance Criteria:**
- [ ] Given I'm on dashboard, when I view Quick Actions, then I see grid of 4-6 common tasks
- [ ] Given I tap "Contact Teacher", when action triggers, then I see teacher selection then message compose
- [ ] Given I tap "Download Reports", when action triggers, then I see report type selection and download begins
- [ ] Given I tap "Make Payment", when action triggers, then I'm taken to payment screen with context
- [ ] Given actions are personalized, when I use the app regularly, then most-used actions are shown first

**Technical Notes:**
- Current implementation: `ParentDashboard.tsx` (dashboard) lines 661-699, `EnhancedParentDashboardScreen.tsx` lines 1106-1146
- Actions: Contact Teacher, Schedule Meeting, View Timetable, Download Reports
- Navigation: Lines 668-696 (onNavigate handlers - mock)
- Personalization: Not implemented
- Deep linking: Not implemented
- Analytics: Needs usage tracking for personalization

**Priority:** Should Have (Post-MVP v1.1)

---

### Epic 8: Action Items & To-Do Management

#### US-017: Track Pending Action Items
**As a** parent,
**I want to** see all pending tasks requiring my attention in one place,
**So that** I don't miss deadlines or required actions.

**Acceptance Criteria:**
- [ ] Given I have pending actions, when I view Overview, then I see action items count
- [ ] Given actions have due dates, when I view list, then overdue items are highlighted
- [ ] Given I complete an action, when I mark it done, then it's removed from pending list
- [ ] Given actions have priorities, when I view list, then high priority items are shown first
- [ ] Given new action is assigned, when it's created, then I receive push notification

**Technical Notes:**
- Current implementation: `EnhancedParentDashboardScreen.tsx` lines 360-401 (action items section)
- Mock data: Lines 1671-1712 (sample action items)
- Types: payment, form, meeting, document, permission
- Completion handler: Lines 225-231 (mock alert)
- Priority badges: Lines 371-381
- Real-time updates: Not implemented
- Data model: Needs `parent_action_items` table

**Priority:** Should Have (Post-MVP v1.1)

---

## 6. User Journey Maps

### Journey 1: Initial Onboarding and Account Setup

**Persona:** New Parent (First-time user)

**Steps:**
1. **App Download & Installation**
   - Download from App Store/Play Store
   - Grant necessary permissions (notifications, storage)
   - **Current State:** Not defined in codebase

2. **Authentication**
   - Launch app → Authentication screen
   - Enter credentials or use social login
   - **Current State:** `useAuth` hook referenced but implementation not in analyzed files

3. **Parent Profile Setup**
   - Enter parent details (name, contact, relationship to student)
   - Link student(s) to parent account
   - **Current State:** Not implemented

4. **Initial Dashboard Load**
   - Fetch children data
   - Load first child's dashboard
   - Display welcome message
   - **Current State:** Mock data shown (`EnhancedParentDashboardScreen.tsx` lines 195-198)

5. **Feature Tour (First-time Only)**
   - Guided tour of main features
   - Explanation of Smart Insights
   - Quick action highlights
   - **Current State:** Not implemented

**Pain Points Identified:**
- No onboarding flow implemented
- No first-time user experience
- No tutorial or help system
- Unclear how parent-student linking works

**Success Metrics:**
- 90% of new parents complete onboarding within 5 minutes
- <10% support tickets related to initial setup

---

### Journey 2: Daily Dashboard Check-In

**Persona:** Engaged Parent (Daily active user)

**Trigger:** Morning routine (7:00-9:00 AM)

**Steps:**
1. **App Launch**
   - Open app from home screen
   - Auto-authenticate (biometric/saved session)
   - **Current State:** Authentication context exists (`useAuth` hook)

2. **View Overnight Notifications**
   - Check notification badge count
   - Review unread messages (teachers, school)
   - **Current State:** Unread count shown (`EnhancedParentDashboardScreen.tsx` line 406)

3. **Check Today's Status**
   - View child's current status (in-class, completed, absent)
   - Review today's class schedule
   - **Current State:** Status badge implemented (`ParentDashboard.tsx` dashboard, lines 363-370)

4. **Quick Glance at Pending Items**
   - View action items counter
   - Check pending fee payments
   - **Current State:** Quick stats grid (`ParentDashboard.tsx` dashboard, lines 394-407)

5. **Review New Updates**
   - Check recent activities
   - View new teacher comments
   - **Current State:** Recent activities section (mock data)

**Time Spent:** 2-5 minutes
**Frequency:** Daily (weekday mornings)

**Current Gaps:**
- No persistent authentication/auto-login
- No push notifications for overnight updates
- No today-specific filtering
- No daily digest view

**Success Metrics:**
- Average session duration: 3-5 minutes
- 70% of parents check dashboard before 9 AM on school days
- <2s dashboard load time

---

### Journey 3: Progress Review and Insights Exploration

**Persona:** Engaged Parent (Weekly deep dive)

**Trigger:** Weekend planning (Saturday/Sunday afternoon)

**Steps:**
1. **Navigate to Academic Progress**
   - Tap "Progress" tab from bottom navigation
   - **Current State:** Tab navigation implemented (`ParentDashboard.tsx` dashboard, lines 632-659)

2. **Review Subject Performance**
   - View subject-wise grades and trends
   - Identify declining subjects
   - Read teacher notes
   - **Current State:** Subject cards with trends (`ParentDashboard.tsx` dashboard, lines 412-450)

3. **Access Smart Insights**
   - Tap "Smart Insights" button
   - Review AI Score
   - **Current State:** Smart insights UI complete (`SmartParentInsights.tsx`)

4. **Explore Risk Factors**
   - Switch to "Risks" tab
   - Review severity and probability
   - Read suggested interventions
   - **Current State:** Risk cards implemented (lines 237-259)

5. **Identify Opportunities**
   - Switch to "Opportunities" tab
   - Review growth opportunities
   - Note requirements and expected outcomes
   - **Current State:** Opportunity cards (lines 262-281)

6. **Plan Actions**
   - Switch to "Actions" tab
   - Review recommended actions
   - Tap "Take Action" on high-priority items
   - **Current State:** Action cards (lines 284-316), stub handler (lines 199-202)

7. **Deep Dive into Specific Subject** (If Needed)
   - Tap on a subject card
   - View historical grade data
   - Review assignment breakdown
   - **Current State:** Detail navigation referenced but not implemented

**Time Spent:** 15-30 minutes
**Frequency:** Weekly (typically weekends)

**Current Gaps:**
- No historical data visualization
- AI insights are mock, no real calculations
- "Take Action" handlers are stubs
- No ability to set goals or track progress on actions
- No comparison view across children

**Success Metrics:**
- 60% of parents engage with Smart Insights weekly
- Average time in Progress section: 20+ minutes weekly
- 40% action on recommended interventions within 7 days

---

### Journey 4: Communication with Teachers/Coaches

**Persona:** Concerned Parent (Event-driven)

**Trigger:** Notification of grade decline or behavior issue

**Steps:**
1. **Receive Push Notification**
   - "Math grade dropped 10% this week"
   - **Current State:** Notification system not implemented

2. **Open Notification**
   - Deep link to specific subject or message
   - **Current State:** Deep linking not implemented

3. **Review Context**
   - View subject performance details
   - Read teacher comments
   - Check recent assignments
   - **Current State:** Teacher comments shown (`EnhancedParentDashboardScreen.tsx` lines 635-654)

4. **Initiate Communication**
   - Navigate to Communication tab
   - Tap "Compose Message"
   - Select teacher (Math teacher)
   - **Current State:** Compose button exists (line 1065) but opens mock alert

5. **Draft Message**
   - Write concern/question
   - Attach recent assignment if needed
   - **Current State:** Message composer not implemented

6. **Send and Track**
   - Send message
   - Mark as "Response Required"
   - Wait for teacher reply
   - **Current State:** Messaging backend not implemented

7. **Follow Up** (If Needed)
   - Schedule parent-teacher meeting
   - Request detailed progress report
   - **Current State:** Scheduling not implemented

**Time Spent:** 10-20 minutes
**Frequency:** As needed (typically 2-3x per term)

**Current Gaps:**
- No push notification system
- No deep linking
- No message composition UI
- No real-time messaging
- No file attachments
- No message threading/conversation view
- No meeting scheduler

**Success Metrics:**
- 80% of teacher messages responded to within 24 hours
- Average time from notification to parent action: <30 minutes
- 95% of parents satisfied with communication tools

---

### Journey 5: Multi-Child Management

**Persona:** Multi-Child Parent (3+ children)

**Trigger:** Evening review (6:00-8:00 PM)

**Steps:**
1. **Switch Between Children**
   - Use child selector at top of dashboard
   - Quickly scan each child's overview
   - **Current State:** Child selector implemented (`ParentDashboard.tsx` dashboard, lines 322-343)

2. **Identify Priority Child**
   - Look for red flags (failing grades, low attendance, pending actions)
   - **Current State:** Visual indicators present (status badges, trend arrows)

3. **Deep Dive into Priority Child**
   - Review detailed progress
   - Check action items
   - **Current State:** Modal detail view (`EnhancedParentDashboardScreen.tsx` lines 546-661)

4. **Compare Children** (Optional)
   - Switch between children to compare performance
   - Identify patterns across siblings
   - **Current State:** No comparison view, manual switching only

5. **Address Action Items by Child**
   - Filter action items by child
   - Complete child-specific tasks
   - **Current State:** Child filtering referenced (`actionItem.childId`) but not implemented

6. **Review Consolidated Financials**
   - View total fees across all children
   - Check for sibling discounts
   - **Current State:** Discount types include 'sibling' (line 1617) but no consolidated view

**Time Spent:** 20-40 minutes
**Frequency:** Daily (evening routine)

**Current Gaps:**
- No side-by-side child comparison
- No consolidated multi-child dashboard view
- No bulk actions (e.g., approve all permission slips)
- No child-specific notification filtering
- No family-level financial summary
- No sibling performance benchmarking

**Success Metrics:**
- Multi-child parents access dashboard 5+ times per week
- Average time to switch between children: <3 seconds
- 70% of multi-child parents use comparison features monthly

---

### Journey 6: Notification Response Flow

**Persona:** Any Parent (Push notification driven)

**Trigger:** Push notification received

**Notification Types & Flows:**

#### A. Urgent Action Required (Payment Due)
1. **Receive Notification**
   - "Fee payment of ₹2,500 due tomorrow"
   - **Current State:** Not implemented

2. **Tap Notification**
   - Deep link to Financial tab > specific payment
   - **Current State:** Deep linking not implemented

3. **Review Payment Details**
   - View invoice breakdown
   - Check due date and late fee policy
   - **Current State:** Financial summary exists (lines 435-483)

4. **Process Payment**
   - Tap "Pay Now"
   - Select payment method
   - Complete transaction
   - **Current State:** Payment gateway not integrated

5. **Confirm & Save Receipt**
   - View confirmation
   - Download/save receipt
   - **Current State:** Receipt generation not implemented

**Time Spent:** 3-5 minutes
**Expected Flow Time:** <5 minutes from notification to payment

---

#### B. Academic Alert (Grade Update)
1. **Receive Notification**
   - "Emma scored 94/100 on Math assignment"
   - **Current State:** Not implemented

2. **Tap Notification**
   - Deep link to Progress tab > specific subject
   - **Current State:** Not implemented

3. **Review Details**
   - View assignment details
   - Read teacher feedback
   - Check grade trend
   - **Current State:** Subject performance UI exists

4. **Optional Actions**
   - Send congratulations message to child
   - Message teacher with questions
   - Share achievement
   - **Current State:** Messaging not implemented

**Time Spent:** 2-3 minutes
**Expected Flow Time:** <3 minutes from notification to action

---

#### C. Message from Teacher
1. **Receive Notification**
   - "New message from Dr. Sarah Wilson"
   - **Current State:** Not implemented

2. **Tap Notification**
   - Deep link to Communication tab > specific message
   - **Current State:** Not implemented

3. **Read Message**
   - View full message content
   - Check if response required
   - **Current State:** Message display exists (`EnhancedParentDashboardScreen.tsx` lines 995-1052)

4. **Respond** (If Required)
   - Tap reply
   - Compose response
   - Send
   - **Current State:** Reply functionality not implemented

**Time Spent:** 3-7 minutes
**Expected Flow Time:** <10 minutes from notification to reply

---

**Notification Flow Gaps:**
- No push notification infrastructure
- No deep linking system
- No notification preferences/settings
- No notification history
- No smart notification grouping
- No quiet hours support
- No notification action buttons (quick reply, dismiss, snooze)

**Success Metrics:**
- 80% of notifications opened within 1 hour
- 60% of actionable notifications result in action within 24 hours
- <5% notification opt-out rate

---

## 7. MVP Definition (MoSCoW Prioritization)

### MUST HAVE (Launch Blockers)

These features are **critical for production launch**. Without them, the parent section cannot function as a viable product.

#### M1. Authentication & Authorization
**Status:** ❌ Not Implemented
**Why Critical:** No user access without auth
**Components:**
- Parent login (email/password)
- Secure session management
- Role-based access control (parent role only)
- Logout functionality

**Technical Requirements:**
- Supabase Auth integration
- JWT token management
- Auth context implementation (`AuthContext.tsx` referenced)

---

#### M2. Multi-Child Dashboard
**Status:** ⚠️ UI Complete, Backend Missing
**Why Critical:** Core value proposition for parents
**Components:**
- Child selector/switcher
- Overview cards per child
- Overall grade display
- Attendance rate
- Today's status

**Files:** `ParentDashboard.tsx`, `EnhancedParentDashboardScreen.tsx`
**Backend Needed:**
- Supabase query: `students` table with `parent_id` filter
- Realtime subscription for status updates

---

#### M3. Subject Performance Tracking
**Status:** ⚠️ UI Complete, Backend Missing
**Why Critical:** Primary reason parents use the app
**Components:**
- Subject list with current grades
- Trend indicators (up/down/stable)
- Teacher notes
- Last updated timestamps

**Files:** `EnhancedParentDashboardScreen.tsx` (lines 576-603), `ParentDashboard.tsx` (lines 412-450)
**Backend Needed:**
- `grades` table with subject, student, date, score
- Historical data for trend calculation
- Teacher notes integration

---

#### M4. Financial Summary & Payment History
**Status:** ⚠️ UI Complete, Backend Missing
**Why Critical:** Revenue collection depends on this
**Components:**
- Total fees, paid, pending display
- Payment history list
- Due date alerts
- Discount tracking

**Files:** `EnhancedParentDashboardScreen.tsx` (lines 430-543)
**Backend Needed:**
- `fee_structure`, `payments`, `discounts` tables
- Payment status tracking
- Due date calculation

---

#### M5. Online Payment Processing
**Status:** ❌ Not Implemented
**Why Critical:** Core business function, revenue critical
**Components:**
- Payment method selection (UPI, Card, Bank Transfer)
- Secure payment gateway integration
- Payment confirmation
- Receipt generation

**Files:** Referenced in `ParentNavigator.tsx` (PaymentProcessingScreen)
**Backend Needed:**
- Payment gateway integration (Razorpay/Stripe)
- PCI DSS compliance for cards
- UPI SDK integration
- Webhook handling for payment status
- Receipt PDF generation

**Security Requirements:**
- Encrypted payment data
- Tokenization for card storage
- 3D Secure authentication
- Compliance certifications

---

#### M6. Teacher Communication - Message Inbox
**Status:** ⚠️ UI Complete, Backend Missing
**Why Critical:** Essential for parent-teacher collaboration
**Components:**
- Message list with sender info
- Read/unread status
- Priority indicators
- Message detail view

**Files:** `EnhancedParentDashboardScreen.tsx` (lines 891-1092)
**Backend Needed:**
- `messages` table with threading
- Realtime message delivery
- Read receipts tracking
- Attachment storage (Supabase Storage)

---

#### M7. School Announcements
**Status:** ⚠️ UI Complete, Backend Missing
**Why Critical:** Primary communication channel for school-wide updates
**Components:**
- Announcement list
- Important/urgent flags
- Category filtering
- Date-based display

**Files:** `EnhancedParentDashboardScreen.tsx` (lines 1150-1215)
**Backend Needed:**
- `announcements` table
- Target audience filtering (parent-specific)
- Expiry date handling
- Push notification for important announcements

---

#### M8. Error Handling & Loading States
**Status:** ⚠️ Partial Implementation
**Why Critical:** Production stability and UX
**Components:**
- Network error handling
- Loading indicators (ActivityIndicator shown in some places)
- Empty states
- Retry mechanisms
- Graceful degradation

**Current State:**
- Loading spinner: `ParentDashboard.tsx` (lines 367-377)
- Error handling: Minimal, mostly console.log
**Gaps:**
- No network error UI
- No retry buttons
- No offline mode messaging
- No error logging/monitoring

---

#### M9. Basic Security & Data Privacy
**Status:** ❌ Not Implemented
**Why Critical:** Legal compliance, user trust
**Requirements:**
- HTTPS for all API calls
- Secure token storage
- Data encryption at rest
- Session timeout
- Logout on device change
- Basic audit logging (who accessed what, when)

**Compliance:**
- COPPA (if students under 13)
- FERPA (educational records protection)
- GDPR (if EU users)

---

### SHOULD HAVE (High Value, Not Launch Blockers)

These features significantly enhance the product but aren't blockers for initial launch.

#### S1. Smart AI-Powered Insights
**Status:** ⚠️ UI Complete, AI Missing
**Why Valuable:** Differentiator, proactive parenting
**Components:**
- AI Score calculation
- Risk factor detection
- Opportunity identification
- Recommended actions

**Files:** `SmartParentInsights.tsx`
**Backend Needed:**
- ML model or rule-based engine
- Historical data analysis
- Predictive algorithms
- Action recommendation engine

**Launch Decision:** Can launch with basic scoring algorithm, enhance with ML later

---

#### S2. Message Composition & Reply
**Status:** ❌ Not Implemented
**Why Valuable:** Complete communication loop
**Components:**
- Message composer UI
- Teacher selection
- File attachments
- Send confirmation

**Current State:** Compose button shows alert (line 1065)
**Backend Needed:**
- Message submission API
- File upload to Supabase Storage
- Threading logic

**Launch Decision:** Can launch with read-only messages, add reply in v1.1

---

#### S3. Action Items Management
**Status:** ⚠️ UI Complete, Backend Missing
**Why Valuable:** Helps parents stay organized
**Components:**
- Action item list
- Priority sorting
- Due date tracking
- Completion workflow

**Files:** `EnhancedParentDashboardScreen.tsx` (lines 360-401)
**Backend Needed:**
- `parent_action_items` table
- Automated action generation (from unpaid fees, unsigned forms, etc.)
- Completion tracking

**Launch Decision:** Can launch with manual action tracking, automate later

---

#### S4. Quick Actions & Shortcuts
**Status:** ⚠️ UI Complete, Handlers Missing
**Why Valuable:** Improves efficiency for power users
**Components:**
- Quick action grid
- Deep linking to features
- Personalized action suggestions

**Files:** `ParentDashboard.tsx` (dashboard, lines 661-699)
**Backend Needed:**
- Usage analytics for personalization
- Deep link routing

**Launch Decision:** Can launch with static quick actions

---

#### S5. School Contact Directory
**Status:** ⚠️ UI Complete, Native Integration Missing
**Why Valuable:** Convenient access to contacts
**Components:**
- Contact list with roles
- Click-to-call
- Click-to-email
- Office hours display

**Files:** `EnhancedParentDashboardScreen.tsx` (lines 1218-1303)
**Backend Needed:**
- `school_contacts` table
- React Native Linking API integration

**Launch Decision:** Can launch with basic contact display

---

#### S6. Emergency Procedures
**Status:** ⚠️ UI Complete, Content Missing
**Why Valuable:** Safety and parent confidence
**Components:**
- Emergency type cards
- Procedure details
- Emergency contacts

**Files:** `EnhancedParentDashboardScreen.tsx` (lines 1306-1363)
**Backend Needed:**
- `emergency_procedures` table
- Offline caching for reliability

**Launch Decision:** Can launch with static procedures document

---

#### S7. Push Notifications
**Status:** ❌ Not Implemented
**Why Valuable:** Engagement and timely alerts
**Types:**
- Grade updates
- New messages
- Payment reminders
- Attendance alerts
- School announcements

**Technical Requirements:**
- Firebase Cloud Messaging (FCM) or APNs
- Notification permission handling
- Deep link integration
- Notification preferences
- Badge count management

**Launch Decision:** Highly recommended for launch, but can initially use in-app alerts

---

#### S8. Attendance Tracking & Alerts
**Status:** ⚠️ UI Complete, Real-time Missing
**Why Valuable:** Safety and peace of mind
**Components:**
- Real-time attendance status
- Attendance rate calculation
- Absence alerts

**Files:** `ParentDashboard.tsx` (dashboard, lines 372-381)
**Backend Needed:**
- Realtime subscription to `attendance` table
- Alert triggering system

**Launch Decision:** Can launch with daily batch updates

---

### COULD HAVE (Nice to Have)

These features add polish but can be deferred to post-launch iterations.

#### C1. Meeting Scheduler
**Status:** ❌ Not Implemented
**Why Nice to Have:** Convenience, but alternatives exist (email, phone)
**Components:**
- Teacher availability calendar
- Meeting request workflow
- Calendar integration
- Reminders

**Launch Decision:** Defer to v1.2

---

#### C2. Study Time Monitoring
**Status:** ⚠️ UI Complete, Integration Missing
**Why Nice to Have:** Valuable but requires student app integration
**Components:**
- Study time tracking
- Weekly targets
- Progress visualization

**Files:** `ParentDashboard.tsx` (dashboard, lines 550-583)
**Technical Challenge:**
- Requires student-side time tracking
- Device integration complex

**Launch Decision:** Defer to v1.2, focus on core academics first

---

#### C3. Report Downloads
**Status:** ❌ Not Implemented
**Why Nice to Have:** Useful but not critical for digital-first approach
**Components:**
- Report type selection
- PDF generation
- Download/share functionality

**Launch Decision:** Defer to v1.3

---

#### C4. Child Performance Comparison
**Status:** ❌ Not Implemented
**Why Nice to Have:** Useful for multi-child parents but not essential
**Components:**
- Side-by-side comparison view
- Benchmarking across siblings
- Trend comparisons

**Launch Decision:** Defer to v1.3

---

#### C5. Feature Validation Dashboard
**Status:** ⚠️ UI Complete, but testing tool only
**Why Nice to Have:** Internal QA tool, not user-facing
**Files:** `ParentFeatureValidationScreen.tsx`
**Launch Decision:** Keep for internal testing, don't expose to production users

---

### WON'T HAVE (Out of Scope)

These features are out of scope for the initial product, require significant external dependencies, or don't align with MVP goals.

#### W1. App Usage Monitoring
**Status:** Mock UI Only
**Why Out of Scope:** Requires device-level permissions and OS integration (Screen Time API, Digital Wellbeing)
**Technical Barriers:**
- iOS: Requires Screen Time API (limited access)
- Android: Requires UsageStatsManager (user must grant permission in Settings)
- Privacy concerns
- MDM or parental control SDK needed

**Files:** `ParentDashboard.tsx` (dashboard, lines 585-610)
**Decision:** Defer indefinitely, suggest third-party parental control apps

---

#### W2. Community Engagement Features
**Status:** Referenced, Not Implemented
**Why Out of Scope:** Complex social features, moderation needed
**Components:**
- Parent forums
- Event participation
- Volunteer coordination
- Parent groups

**Files:** Referenced in `ParentNavigator.tsx`
**Decision:** Defer to v2.0+, requires dedicated community management resources

---

#### W3. Advanced Analytics & AI Predictions
**Status:** Mock UI Only
**Why Out of Scope:** Requires substantial ML infrastructure and training data
**Components:**
- Predictive grade forecasting
- Behavioral risk modeling
- Personalized learning recommendations

**Files:** `SmartParentInsights.tsx` (academicPredictions)
**Decision:** Launch with basic rule-based insights, evolve to ML in v2.0+

---

#### W4. Multi-Language Support
**Status:** Not Implemented
**Why Out of Scope:** Not critical for initial market, adds complexity
**Decision:** Defer until international expansion (v2.0+)

---

#### W5. Offline Mode
**Status:** Not Implemented
**Why Out of Scope:** Complexity of data synchronization
**Decision:** Defer to v1.5+, require internet connection for MVP

---

## 8. Data Privacy & Compliance

### COPPA Requirements (Children Under 13)

**Scope:** If platform serves students under 13 years old

#### Parental Consent
- [ ] **Verifiable parental consent** required before collecting child data
- [ ] Consent mechanism must verify parent identity (email + confirmation, phone verification, etc.)
- [ ] Consent records must be maintained (who consented, when, for which child)
- [ ] Parent can revoke consent at any time with immediate data deletion

**Current State:** ❌ No consent mechanism implemented

**Implementation Needed:**
```typescript
// Required consent flow
interface ParentalConsent {
  parent_id: string;
  child_id: string;
  consent_given: boolean;
  consent_date: Date;
  consent_method: 'email_verification' | 'phone_verification' | 'in_person';
  data_types_consented: string[];
  revoked: boolean;
  revocation_date?: Date;
}
```

#### Data Collection Minimization
- [ ] Collect only data **necessary for educational purpose**
- [ ] No behavioral advertising targeting children
- [ ] No geolocation tracking of children
- [ ] No sharing child data with third parties without consent

**Current Code Review:**
- Mock data includes: child name, grade, grades, attendance, behavior ratings
- Smart Insights collects: performance trends, risk factors, predictions
- **Gap:** No privacy policy acceptance, no data minimization audit

#### Parent Access Rights
- [ ] Parents can **review all data** collected about their child
- [ ] Parents can **request data deletion** (account closure)
- [ ] Parents can **correct inaccurate data**
- [ ] Provide data export in machine-readable format

**Current State:** ❌ No data access/export features

---

### FERPA Requirements (Educational Records)

**Scope:** All educational institutions in the US

#### Directory vs Educational Records
- [ ] Clearly distinguish **directory information** (name, grade) from **educational records** (grades, assessments, teacher comments)
- [ ] Educational records require parent consent for disclosure
- [ ] Directory information can be shared unless parent opts out

**Current Code Review:**
- All child data in parent dashboard is **educational records** (grades, attendance, teacher comments)
- **Gap:** No consent workflow for accessing educational records

#### Access Controls
- [ ] Only **authorized parents** can access their child's records
- [ ] No access to other children's records
- [ ] Audit log of who accessed what records and when

**Current Implementation Check:**
```typescript
// ParentNavigator.tsx - No authorization checks found
// EnhancedParentDashboardScreen.tsx - Uses useAuth but no parent-child linking verification
```

**Required Implementation:**
```typescript
// Authorization middleware
const authorizeParentAccess = async (parentId: string, childId: string) => {
  const { data, error } = await supabase
    .from('parent_child_relationships')
    .select('*')
    .eq('parent_id', parentId)
    .eq('child_id', childId)
    .single();

  if (error || !data) {
    throw new Error('Unauthorized access to child records');
  }
  return data;
};
```

#### Record Amendment Rights
- [ ] Parents can request amendment of inaccurate records
- [ ] School must respond within 45 days
- [ ] If school refuses, parent can add statement of disagreement

**Current State:** ❌ No amendment request mechanism

#### Disclosure Restrictions
- [ ] Educational records cannot be shared with third parties without consent
- [ ] **Exception:** School officials with legitimate educational interest
- [ ] Disclosure log must be maintained

**Current State:** ❌ No disclosure tracking

---

### GDPR Requirements (If EU Users)

**Scope:** If any parent/student is in EU/EEA

#### Lawful Basis for Processing
- [ ] Identify lawful basis: **Consent** or **Legitimate Interest**
- [ ] Document basis in privacy policy
- [ ] For children, **parental consent** required

**Current State:** ❌ No GDPR compliance documentation

#### Data Subject Rights
- [ ] **Right to Access:** Parents can request all data held
- [ ] **Right to Rectification:** Correct inaccurate data
- [ ] **Right to Erasure:** "Right to be forgotten" (with exceptions for legal obligations)
- [ ] **Right to Data Portability:** Export data in structured format
- [ ] **Right to Object:** Object to processing
- [ ] **Right to Restrict Processing:** Temporarily limit processing

**Required Implementation:**
- Data export feature (JSON/CSV)
- Account deletion workflow
- Data rectification requests

#### Data Protection Impact Assessment (DPIA)
- [ ] Required for **high-risk processing** (profiling, sensitive data about children)
- [ ] Smart AI Insights may trigger DPIA requirement

**Current State:** ❌ No DPIA conducted

#### Data Breach Notification
- [ ] Must notify supervisory authority within **72 hours** of breach
- [ ] Must notify affected parents **without undue delay** if high risk

**Current State:** ❌ No breach response plan

---

### State-Level Requirements (US)

#### California (CCPA/CPRA)
- Similar to GDPR: access, deletion, opt-out rights
- Applies if school has CA students

#### New York (Ed Law §2-d)
- Strict requirements for third-party service providers
- Annual compliance reporting
- Parent bill of rights

**Current State:** ❌ No state-specific compliance

---

### Platform Security Requirements

#### Data Encryption
- [x] **In Transit:** HTTPS for all API calls
  - **Status:** Should be enforced by Supabase
- [ ] **At Rest:** Database encryption
  - **Status:** Supabase provides encryption, verify configuration
- [ ] **Application Level:** Sensitive fields (e.g., payment info) additionally encrypted

#### Authentication Security
- [ ] Strong password requirements (min 8 chars, complexity)
- [ ] Multi-factor authentication (MFA) option for parents
- [ ] Session timeout (auto-logout after inactivity)
- [ ] Account lockout after failed login attempts

**Current State:** ❌ Auth requirements not defined

#### Access Control
- [ ] Role-based access control (RBAC)
  - Parent can only access their children's data
  - No cross-parent data leakage
- [ ] Row-level security (RLS) in Supabase
- [ ] API authorization on every request

**Supabase RLS Example:**
```sql
-- Ensure parents can only access their own children's data
CREATE POLICY "Parents can view their children" ON students
  FOR SELECT
  USING (
    id IN (
      SELECT child_id FROM parent_child_relationships
      WHERE parent_id = auth.uid()
    )
  );
```

**Current State:** ❌ No RLS policies visible in analyzed code

#### Audit Logging
- [ ] Log all data access (who, what, when)
- [ ] Log all data modifications
- [ ] Log authentication events (login, logout, failed attempts)
- [ ] Logs retained for minimum 1 year

**Current State:** ❌ No audit logging

---

### Privacy Controls Inventory

#### Must Implement (Pre-Launch)
1. **Privacy Policy** - Clear, accessible explanation of data practices
2. **Terms of Service** - Legal agreement with parents
3. **Consent Workflow** - Explicit consent for data collection
4. **Data Access Page** - Parents can view all data collected
5. **Account Deletion** - Parents can delete child account and all data
6. **Password Management** - Secure password reset, change password
7. **Session Management** - Auto-logout, logout on all devices
8. **Data Encryption** - HTTPS, database encryption verified
9. **Row-Level Security** - Supabase RLS policies configured

#### Should Implement (Post-Launch)
10. **Data Export** - Download all data in JSON/CSV
11. **MFA (Multi-Factor Auth)** - Optional for parents
12. **Privacy Settings** - Control what data is shared with teachers
13. **Communication Preferences** - Opt-in/out of different notification types
14. **Audit Log Viewer** - Parents can see access history

#### Could Implement (Future)
15. **Biometric Authentication** - Face ID, fingerprint
16. **Data Retention Policies** - Auto-delete old data after X years
17. **Granular Permissions** - Parent controls which teachers can see what data

---

### Compliance Checklist (Production Readiness)

#### Legal
- [ ] Privacy policy drafted and reviewed by legal counsel
- [ ] Terms of service drafted and reviewed
- [ ] COPPA compliance verified (if applicable)
- [ ] FERPA compliance verified
- [ ] GDPR compliance verified (if EU users)
- [ ] State-level compliance reviewed (CA, NY, etc.)

#### Technical
- [ ] Parental consent workflow implemented
- [ ] Row-level security (RLS) configured in Supabase
- [ ] Data encryption verified (in transit and at rest)
- [ ] Authentication security hardened
- [ ] Audit logging implemented
- [ ] Data access/export feature built
- [ ] Account deletion feature built
- [ ] Session timeout configured

#### Operational
- [ ] Data breach response plan documented
- [ ] Privacy training for staff
- [ ] Regular security audits scheduled
- [ ] Compliance monitoring process established

**Current Compliance Score:** 10% (Only HTTPS likely in place via Supabase)

---

## 9. Integration Touchpoints

### 9.1 Admin Section Dependencies

#### Admin → Parent Data Flow
1. **Student Enrollment**
   - Admin creates student record → Parent can link student
   - **Table:** `students` (created by admin, linked to parent via `parent_child_relationships`)

2. **Fee Structure Creation**
   - Admin defines fee structure → Parent sees fees in Financial tab
   - **Tables:** `fee_structure`, `fee_line_items`

3. **Announcement Publishing**
   - Admin publishes announcement → Parent sees in Info Hub
   - **Table:** `announcements` with `target_audience` filter

4. **Teacher Assignment**
   - Admin assigns teachers to classes → Parent sees teacher in child's subject list
   - **Table:** `class_teachers` or `subject_teachers`

5. **School Calendar**
   - Admin creates events → Parent sees in calendar/schedule
   - **Table:** `school_events`

6. **Contact Directory**
   - Admin manages staff contacts → Parent sees in contact directory
   - **Table:** `school_contacts`

**Current State:** ❌ No admin section integration

---

### 9.2 Teacher Section Dependencies

#### Teacher → Parent Data Flow
1. **Grade Entry**
   - Teacher submits grades → Parent sees updated subject performance
   - **Table:** `grades` or `assessments`
   - **Realtime:** Supabase subscription for instant updates

2. **Assignment Creation**
   - Teacher creates assignment → Parent sees in child's assignment list
   - **Table:** `assignments`

3. **Assignment Grading**
   - Teacher grades assignment → Parent sees score in dashboard
   - **Table:** `student_assignments` with `score` field

4. **Attendance Marking**
   - Teacher marks attendance → Parent sees updated attendance rate
   - **Table:** `attendance` with realtime updates

5. **Teacher Comments**
   - Teacher adds comment → Parent sees in subject performance or insights
   - **Table:** `teacher_comments` or field in `grades` table

6. **Messaging**
   - Teacher sends message → Parent receives in Communication tab
   - **Table:** `messages` with `sender_role='teacher'`

7. **Behavior Reports**
   - Teacher logs behavior incident → Parent sees in Smart Insights (risk factors)
   - **Table:** `behavior_reports`

**Current State:** ❌ No teacher section integration

---

### 9.3 Student Section Dependencies

#### Student → Parent Data Flow
1. **Assignment Submission**
   - Student submits assignment → Parent sees "submitted" status
   - **Table:** `student_assignments` with `status='submitted'`

2. **Study Time Logging**
   - Student tracks study time → Parent sees in Monitoring tab
   - **Table:** `study_sessions`

3. **App Usage**
   - Student uses educational apps → Parent sees breakdown in Monitoring
   - **Table:** `app_usage_logs`
   - **Challenge:** Requires student device monitoring

4. **Schedule Check-ins**
   - Student checks in to class → Parent sees "IN CLASS" status
   - **Table:** `attendance` or realtime status table

**Current State:** ❌ No student section integration

---

### 9.4 Third-Party Integrations

#### Payment Gateway (Critical - MVP)
**Provider:** Razorpay / Stripe / Paytm (to be decided)

**Integration Points:**
1. **Payment Processing Screen**
   - File: `PaymentProcessingScreen` (referenced but not implemented)
   - Actions: Initiate payment, handle callback, store status

2. **Webhook Handling**
   - Endpoint: `/api/payment-webhook` (not implemented)
   - Purpose: Receive payment confirmation from gateway
   - Action: Update `payments` table, trigger receipt generation

3. **Requirements:**
   - API keys (production + test)
   - Webhook signature verification
   - Payment method selection UI
   - UPI deep linking (for UPI payments)
   - Card tokenization (for saved cards)

**Current State:** ❌ No payment gateway integration

---

#### Push Notification Service (Should Have - MVP)
**Provider:** Firebase Cloud Messaging (FCM)

**Integration Points:**
1. **Device Token Registration**
   - Store FCM token in `parent_devices` table
   - Update on app launch

2. **Notification Triggering**
   - Server-side: Cloud Functions or backend service
   - Triggers: Grade update, new message, payment due, attendance alert

3. **Deep Linking**
   - Open app to specific screen on notification tap
   - Pass data: child_id, screen, item_id

4. **Notification Preferences**
   - Allow parent to customize notification types
   - Store in `parent_notification_preferences` table

**Current State:** ❌ No push notification service

---

#### SMS Gateway (Should Have)
**Provider:** Twilio / AWS SNS

**Use Cases:**
1. **Urgent Alerts**
   - Absence alerts
   - Emergency notifications
   - Payment overdue

2. **OTP for Login**
   - Phone number verification
   - Forgot password

**Current State:** ❌ No SMS integration

---

#### Email Service (Should Have)
**Provider:** SendGrid / AWS SES

**Use Cases:**
1. **Transactional Emails**
   - Payment receipts
   - Weekly progress reports
   - Account notifications

2. **Marketing Emails** (Optional)
   - Monthly newsletter
   - Feature announcements

**Current State:** ❌ No email service

---

#### Analytics & Monitoring (Should Have)
**Providers:**
- **Analytics:** Google Analytics 4 / Mixpanel
- **Error Tracking:** Sentry
- **Performance Monitoring:** Firebase Performance

**Tracked Events:**
- Screen views
- Button clicks (especially payments, message sends)
- Errors and crashes
- API response times
- User engagement (DAU, MAU)

**Current State:** ❌ No analytics integration

---

#### File Storage (Should Have)
**Provider:** Supabase Storage (built-in)

**Use Cases:**
1. **Message Attachments**
   - Upload: Parent uploads file when composing message
   - Download: Parent downloads teacher-sent attachments

2. **Report PDFs**
   - Store generated progress reports

3. **Receipts**
   - Store payment receipts

**Required:**
- Bucket setup in Supabase
- Access policies (parents can only access their own files)
- File size limits
- Allowed file types

**Current State:** ❌ Storage buckets not configured

---

#### Calendar Integration (Could Have)
**Provider:** Google Calendar API / Apple Calendar

**Use Cases:**
- Add parent-teacher meeting to calendar
- Sync exam schedule to calendar

**Current State:** ❌ Not planned for MVP

---

### 9.5 Database Schema Dependencies

**Critical Tables Needed by Parent Section:**

```typescript
// User & Relationships
- users (from Supabase Auth)
- parents (profile info)
- students (child info)
- parent_child_relationships (many-to-many)

// Academic
- grades (subject, score, date)
- subjects
- assessments (exams, quizzes)
- assignments
- student_assignments (submission, score)
- attendance (daily logs)
- teacher_comments

// Financial
- fee_structure (per student/grade)
- fee_line_items (tuition, lab, transport)
- payments (transactions)
- discounts (sibling, early bird)
- invoices
- receipts

// Communication
- messages (parent-teacher, school-parent)
- message_attachments
- announcements (school-wide)

// School Info
- school_contacts (staff directory)
- emergency_procedures
- school_events (calendar)
- policies (documents)

// Monitoring (Optional)
- study_sessions
- app_usage_logs

// System
- audit_logs
- parent_notification_preferences
- parent_devices (FCM tokens)
- parent_action_items
```

**Current State:** ❌ Database schema not defined in analyzed files (likely exists in Supabase but not referenced in code)

---

## 10. API Contract Definitions

**Note:** All endpoints assume Supabase REST API or custom backend API. Authentication via JWT in `Authorization: Bearer <token>` header.

---

### 10.1 Children & Dashboard APIs

#### GET /api/parent/children
**Purpose:** Fetch all children linked to authenticated parent

**Request Schema:**
```json
{
  "headers": {
    "Authorization": "Bearer <jwt_token>"
  }
}
```

**Response Schema:**
```json
{
  "success": true,
  "data": [
    {
      "id": "child_uuid",
      "name": "Emma Johnson",
      "grade": "11",
      "class": "Section A",
      "school": "Riverside Academy",
      "avatar_url": "https://...",
      "overall_grade": 87.5,
      "attendance_rate": 95.0,
      "total_assignments": 20,
      "completed_assignments": 18,
      "upcoming_exams": 3,
      "today_status": "in-class", // "in-class" | "completed" | "absent"
      "upcoming_class": {
        "subject": "Mathematics",
        "time": "14:00",
        "teacher": "Dr. Sarah Wilson"
      }
    }
  ],
  "error": null
}
```

**Business Rules:**
- Only return children where `parent_child_relationships.parent_id = authenticated_user_id`
- Calculate `attendance_rate` as `(attended_days / total_school_days) * 100`
- `today_status` determined by current time vs class schedule
- `overall_grade` is weighted average across all subjects

**Error Responses:**
- `401 Unauthorized` - Invalid/expired token
- `404 Not Found` - No children linked to parent
- `500 Internal Server Error` - Database error

**Implementation (Supabase):**
```typescript
const { data, error } = await supabase
  .from('students')
  .select(`
    *,
    parent_child_relationships!inner(parent_id),
    grades(score, subject_id),
    attendance(date, status),
    assignments:student_assignments(status)
  `)
  .eq('parent_child_relationships.parent_id', user.id);
```

---

#### GET /api/parent/child/{child_id}/overview
**Purpose:** Get detailed overview for specific child

**Request Schema:**
```json
{
  "headers": {
    "Authorization": "Bearer <jwt_token>"
  },
  "path_params": {
    "child_id": "uuid"
  }
}
```

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "child_id": "uuid",
    "name": "Emma Johnson",
    "grade": "11",
    "recent_activities": [
      {
        "id": "activity_uuid",
        "type": "exam" | "assignment" | "attendance" | "behavior",
        "title": "Math Unit Test",
        "description": "Scored 92%",
        "date": "2025-10-15T10:30:00Z",
        "score": 92,
        "status": "completed"
      }
    ],
    "subject_performance": [
      {
        "subject": "Mathematics",
        "current_grade": 92,
        "trend": "improving", // "improving" | "declining" | "stable"
        "last_assessment": 94,
        "upcoming_exams": 1,
        "teacher_note": "Excellent progress in algebra"
      }
    ],
    "teacher_comments": [
      {
        "id": "comment_uuid",
        "teacher": "Dr. Sarah Wilson",
        "subject": "Mathematics",
        "comment": "Exceptional problem-solving skills",
        "date": "2025-10-10",
        "type": "praise" | "concern" | "suggestion"
      }
    ]
  }
}
```

**Business Rules:**
- Verify `child_id` belongs to authenticated parent
- `recent_activities` limited to last 30 days
- `trend` calculated from last 3 assessments
- Return max 10 recent activities

**Error Responses:**
- `403 Forbidden` - Child doesn't belong to parent
- `404 Not Found` - Child not found

---

### 10.2 Academic Progress APIs

#### GET /api/parent/child/{child_id}/subjects
**Purpose:** Get subject-wise performance details

**Response Schema:**
```json
{
  "success": true,
  "data": [
    {
      "subject_id": "uuid",
      "subject_name": "Mathematics",
      "teacher_id": "uuid",
      "teacher_name": "Dr. Sarah Wilson",
      "current_grade": 92,
      "grade_letter": "A",
      "trend": "improving",
      "historical_grades": [
        {
          "date": "2025-10-15",
          "assessment_type": "exam" | "quiz" | "assignment",
          "score": 94
        }
      ],
      "upcoming_assessments": [
        {
          "id": "uuid",
          "title": "Midterm Exam",
          "date": "2025-10-25",
          "topics": ["Calculus", "Algebra"]
        }
      ],
      "teacher_notes": [
        {
          "date": "2025-10-10",
          "note": "Strong understanding of concepts"
        }
      ]
    }
  ]
}
```

**Business Rules:**
- `trend` calculated from minimum 3 data points
- `historical_grades` limited to current academic year
- Grade letter conversion based on school's grading scale

---

#### GET /api/parent/child/{child_id}/assignments
**Purpose:** Get assignment list with completion status

**Query Parameters:**
```json
{
  "status": "pending" | "submitted" | "graded" | "all",
  "subject_id": "uuid" (optional),
  "limit": 20,
  "offset": 0
}
```

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "total_count": 45,
    "completed_count": 38,
    "assignments": [
      {
        "id": "uuid",
        "title": "Algebra Problem Set",
        "subject": "Mathematics",
        "teacher": "Dr. Sarah Wilson",
        "assigned_date": "2025-10-10",
        "due_date": "2025-10-17",
        "status": "graded",
        "submission_date": "2025-10-16T18:30:00Z",
        "score": 92,
        "max_score": 100,
        "feedback": "Excellent work on problem 5"
      }
    ]
  }
}
```

**Business Rules:**
- Default sort: due_date DESC (most urgent first)
- Overdue assignments highlighted (due_date < now && status != 'submitted')
- Only return assignments for current academic year

---

### 10.3 Financial APIs

#### GET /api/parent/financial-summary
**Purpose:** Get financial overview for all children

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "total_fees": 125000,
    "paid_amount": 75000,
    "pending_amount": 50000,
    "next_due_date": "2025-11-15",
    "children_breakdown": [
      {
        "child_id": "uuid",
        "child_name": "Emma Johnson",
        "fees": 62500,
        "paid": 37500,
        "pending": 25000
      }
    ],
    "discounts": [
      {
        "id": "uuid",
        "type": "sibling",
        "amount": 12500,
        "description": "10% sibling discount",
        "valid_until": "2026-03-31"
      }
    ]
  }
}
```

**Business Rules:**
- Sum across all linked children
- `next_due_date` is earliest due date among pending payments
- Discounts auto-applied based on rules (sibling count, early payment, etc.)

---

#### GET /api/parent/payment-history
**Purpose:** Get payment transaction history

**Query Parameters:**
```json
{
  "child_id": "uuid" (optional, filter by child),
  "from_date": "2025-01-01" (optional),
  "to_date": "2025-12-31" (optional),
  "limit": 50
}
```

**Response Schema:**
```json
{
  "success": true,
  "data": [
    {
      "id": "payment_uuid",
      "amount": 25000,
      "date": "2025-10-15T14:30:00Z",
      "method": "UPI" | "Credit Card" | "Bank Transfer",
      "description": "Quarterly Fee - Term 3",
      "status": "completed" | "pending" | "failed",
      "transaction_id": "gateway_txn_id",
      "receipt_url": "https://storage.../receipt.pdf",
      "child_id": "uuid",
      "child_name": "Emma Johnson"
    }
  ]
}
```

**Business Rules:**
- Default sort: date DESC
- Only show completed payments by default
- Generate receipt PDF on successful payment

---

#### POST /api/parent/initiate-payment
**Purpose:** Initiate payment transaction

**Request Schema:**
```json
{
  "amount": 25000,
  "fee_id": "uuid",
  "child_id": "uuid",
  "payment_method": "UPI" | "Credit Card" | "Bank Transfer",
  "return_url": "myapp://payment-callback"
}
```

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "payment_id": "uuid",
    "gateway_order_id": "order_xyz123",
    "payment_url": "https://gateway.com/pay/...",
    "amount": 25000,
    "currency": "INR",
    "expiry_time": "2025-10-15T15:00:00Z"
  }
}
```

**Business Rules:**
- Verify `child_id` belongs to parent
- Verify `fee_id` is pending and matches amount
- Create payment record with status='pending'
- Return payment gateway URL for redirect
- Set payment expiry (typically 15 minutes)

**Integration:**
- Razorpay: Use Order API
- Stripe: Use Payment Intent API

---

#### POST /api/payment-webhook
**Purpose:** Receive payment confirmation from gateway (server-to-server)

**Request Schema (from Payment Gateway):**
```json
{
  "event": "payment.success",
  "order_id": "order_xyz123",
  "payment_id": "pay_abc456",
  "amount": 25000,
  "status": "captured",
  "signature": "hmac_signature"
}
```

**Business Logic:**
1. Verify webhook signature
2. Find payment record by `order_id`
3. Update payment status to 'completed'
4. Update fee status to 'paid'
5. Generate receipt PDF
6. Send confirmation email/push notification to parent
7. Return 200 OK to gateway

**Error Handling:**
- Invalid signature: Log and return 400
- Payment not found: Log and return 404
- Duplicate webhook: Idempotent, return 200

---

### 10.4 Communication APIs

#### GET /api/parent/messages
**Purpose:** Get message inbox

**Query Parameters:**
```json
{
  "child_id": "uuid" (optional),
  "is_read": true | false (optional),
  "priority": "high" | "medium" | "low" (optional),
  "limit": 50,
  "offset": 0
}
```

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "total_count": 127,
    "unread_count": 8,
    "messages": [
      {
        "id": "uuid",
        "from_id": "teacher_uuid",
        "from_name": "Dr. Sarah Wilson",
        "from_role": "teacher",
        "to_id": "parent_uuid",
        "subject": "Math Assignment Graded",
        "message": "Emma scored 94/100...",
        "date": "2025-10-15T10:30:00Z",
        "priority": "medium",
        "is_read": false,
        "requires_response": false,
        "child_id": "uuid",
        "child_name": "Emma Johnson",
        "attachments": [
          {
            "id": "uuid",
            "filename": "assignment.pdf",
            "url": "https://storage.../...",
            "size": 245632
          }
        ]
      }
    ]
  }
}
```

**Business Rules:**
- Default sort: date DESC, unread first
- Filter by `child_id` if provided (only messages about that child)
- Mark as read when message is opened (separate API call)

---

#### POST /api/parent/messages/{message_id}/mark-read
**Purpose:** Mark message as read

**Request Schema:**
```json
{
  "is_read": true
}
```

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "message_id": "uuid",
    "is_read": true,
    "read_at": "2025-10-15T11:00:00Z"
  }
}
```

**Business Rules:**
- Update `is_read` and `read_at` timestamp
- Decrement unread count in cache

---

#### POST /api/parent/messages/compose
**Purpose:** Send message to teacher (Should Have feature)

**Request Schema:**
```json
{
  "to_id": "teacher_uuid",
  "child_id": "uuid",
  "subject": "Question about homework",
  "message": "I'd like to discuss...",
  "priority": "medium",
  "attachments": [
    {
      "filename": "document.pdf",
      "file_data": "base64_encoded_file"
    }
  ]
}
```

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "message_id": "uuid",
    "sent_at": "2025-10-15T12:00:00Z",
    "delivery_status": "sent"
  }
}
```

**Business Rules:**
- Verify `to_id` is a teacher for the specified child
- Upload attachments to Supabase Storage
- Send push notification to teacher
- Create message thread if replying

---

#### GET /api/parent/announcements
**Purpose:** Get school announcements

**Query Parameters:**
```json
{
  "category": "general" | "academic" | "administrative" | "emergency",
  "is_important": true | false,
  "limit": 20
}
```

**Response Schema:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Annual Sports Day",
      "content": "Will be held on...",
      "date": "2025-10-15",
      "category": "general",
      "is_important": true,
      "expiry_date": "2025-11-01",
      "target_audience": ["parents", "students"],
      "created_by": "admin_uuid"
    }
  ]
}
```

**Business Rules:**
- Filter by `target_audience` includes 'parents'
- Exclude expired announcements (expiry_date < today)
- Sort by: is_important DESC, date DESC

---

### 10.5 Smart Insights APIs

#### GET /api/parent/child/{child_id}/ai-insights
**Purpose:** Get AI-generated insights (Should Have feature)

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "child_id": "uuid",
    "ai_score": 85,
    "score_breakdown": {
      "academic": 90,
      "behavior": 85,
      "engagement": 80,
      "attendance": 95
    },
    "risk_factors": [
      {
        "id": "uuid",
        "type": "academic",
        "severity": "medium",
        "description": "Math performance declining by 15%",
        "probability": 0.7,
        "suggested_intervention": "Additional tutoring",
        "timeline": "2 weeks"
      }
    ],
    "opportunities": [
      {
        "id": "uuid",
        "category": "academic_excellence",
        "title": "Science Olympiad Potential",
        "description": "Strong analytical skills...",
        "confidence": 0.9,
        "requirements": ["Physics foundation", "Lab experience"],
        "expected_outcome": "Regional competition readiness"
      }
    ],
    "recommended_actions": [
      {
        "id": "uuid",
        "priority": "high",
        "category": "academic",
        "title": "Schedule Math Tutor",
        "description": "Address algebra gaps",
        "estimated_impact": 0.8,
        "time_to_implement": "1 week",
        "resources": ["Tutor list", "Schedule link"]
      }
    ],
    "last_updated": "2025-10-15T06:00:00Z"
  }
}
```

**Business Rules:**
- AI Score calculated daily (batch job at 6 AM)
- Risk factors identified from:
  - Grade trends (3+ consecutive declines)
  - Attendance patterns (below 85%)
  - Behavior reports
  - Teacher flags
- Opportunities identified from:
  - Exceptional performance (>90% in subject)
  - Positive teacher feedback
  - Competition eligibility
- Recommended actions ranked by priority and impact

**ML Model (Future):**
- Training data: Historical student performance + outcomes
- Features: Grades, attendance, behavior, demographics
- Outputs: Risk probability, opportunity confidence

**MVP Implementation:**
- Rule-based system until ML model ready
- Simple threshold-based risk detection

---

### 10.6 School Information APIs

#### GET /api/school/contacts
**Purpose:** Get school staff directory

**Response Schema:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Principal Office",
      "role": "Administration",
      "department": "Main Office",
      "phone": "+91-98765-43210",
      "email": "principal@school.edu",
      "office_hours": "9:00 AM - 5:00 PM",
      "location": "Building A, Room 101",
      "is_emergency_contact": true
    }
  ]
}
```

**Business Rules:**
- Sort by: emergency contacts first, then alphabetically
- Only show active staff
- Public information, no authorization needed

---

#### GET /api/school/emergency-procedures
**Purpose:** Get emergency procedures

**Response Schema:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "medical" | "weather" | "security" | "fire",
      "title": "Medical Emergency",
      "procedure": "Step-by-step instructions...",
      "contacts": [
        "School Nurse: +91-98765-43213",
        "Principal: +91-98765-43210"
      ],
      "last_updated": "2025-09-01"
    }
  ]
}
```

**Business Rules:**
- Cache locally for offline access
- Update cached version daily

---

### 10.7 Realtime Subscriptions (Supabase Realtime)

#### Subscribe to Child Status Updates
**Channel:** `child_status:{child_id}`

**Events:**
- `attendance_update` - Child attendance marked
- `grade_update` - New grade posted
- `message_received` - New message from teacher

**Example (TypeScript):**
```typescript
const channel = supabase
  .channel(`child_status:${childId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'grades',
    filter: `student_id=eq.${childId}`
  }, (payload) => {
    // Update UI with new grade
    console.log('New grade:', payload.new);
  })
  .subscribe();
```

---

## 11. Notification Strategy

### 11.1 Push Notification Types & Triggers

#### High Priority (Immediate Delivery)
1. **Attendance Absence Alert**
   - **Trigger:** Child marked absent without prior leave request
   - **Timing:** Within 30 minutes of class start time
   - **Message:** "⚠️ [Child Name] is absent from [Class Name] today. Please verify."
   - **Action:** Tap to view attendance details or submit leave request
   - **Frequency:** Immediate, once per absence

2. **Payment Overdue**
   - **Trigger:** Payment due date passed without payment
   - **Timing:** 9:00 AM on due date
   - **Message:** "💳 Fee payment of ₹[Amount] is now overdue. Pay now to avoid late fees."
   - **Action:** Tap to open payment screen
   - **Frequency:** Daily reminder until paid (max 3 days)

3. **Emergency School Announcement**
   - **Trigger:** Admin publishes announcement with `category='emergency'`
   - **Timing:** Immediate
   - **Message:** "🚨 URGENT: [Announcement Title]"
   - **Action:** Tap to view full announcement
   - **Frequency:** Once per announcement

4. **Behavior Incident Report**
   - **Trigger:** Teacher submits serious behavior report
   - **Timing:** Immediate
   - **Message:** "⚠️ Behavior incident reported for [Child Name]. Tap to view details."
   - **Action:** Tap to view report and teacher message
   - **Frequency:** Once per incident

---

#### Medium Priority (Batched or Scheduled)
5. **Grade Posted**
   - **Trigger:** Teacher posts grade for exam/assignment
   - **Timing:** Next scheduled batch (10 AM, 2 PM, 6 PM)
   - **Message:** "📊 New grade: [Child Name] scored [Score]% in [Subject] [Assessment]"
   - **Action:** Tap to view grade details
   - **Frequency:** Batched (max 3 notifications per batch)

6. **New Message from Teacher**
   - **Trigger:** Teacher sends message to parent
   - **Timing:** Immediate if `requires_response=true`, else batched
   - **Message:** "💬 New message from [Teacher Name]: [Subject]"
   - **Action:** Tap to open message
   - **Frequency:** Batched if not urgent (max 5 per day)

7. **Assignment Due Reminder**
   - **Trigger:** Assignment due in 24 hours and not submitted
   - **Timing:** 6:00 PM day before due date
   - **Message:** "⏰ Reminder: [Assignment Name] due tomorrow for [Child Name]"
   - **Action:** Tap to view assignment details
   - **Frequency:** Once per assignment

8. **Payment Due Reminder**
   - **Trigger:** Payment due in 3 days
   - **Timing:** 9:00 AM, 3 days before due date
   - **Message:** "💰 Fee payment of ₹[Amount] due in 3 days. Pay now to avoid rush."
   - **Action:** Tap to pay
   - **Frequency:** Once (3 days before)

---

#### Low Priority (Digest or Opt-in)
9. **Weekly Progress Report**
   - **Trigger:** Scheduled job every Sunday
   - **Timing:** 8:00 AM Sunday
   - **Message:** "📈 Weekly Report: [Child Name] - [Attendance]% attendance, [Avg Grade]% average"
   - **Action:** Tap to view detailed report
   - **Frequency:** Weekly
   - **Opt-in:** Parent can disable in settings

10. **School Announcement (Non-Emergency)**
    - **Trigger:** Admin publishes announcement
    - **Timing:** Next scheduled batch (10 AM, 2 PM)
    - **Message:** "📢 [Announcement Title]"
    - **Action:** Tap to view
    - **Frequency:** Batched (max 2 per day)
    - **Opt-in:** Parent can disable

11. **Opportunity Identified (AI Insights)**
    - **Trigger:** AI detects new growth opportunity
    - **Timing:** 6:00 PM (digest)
    - **Message:** "🌟 New opportunity for [Child Name]: [Opportunity Title]"
    - **Action:** Tap to view AI insights
    - **Frequency:** Weekly digest
    - **Opt-in:** Enabled by default, can disable

---

### 11.2 Email Notification Triggers

#### Transactional Emails (High Priority)
1. **Payment Receipt**
   - **Trigger:** Payment status = 'completed'
   - **Timing:** Immediate
   - **Content:** Invoice, payment details, receipt PDF
   - **Opt-out:** Not allowed (legally required)

2. **Account Created/Password Reset**
   - **Trigger:** User registration, password reset request
   - **Timing:** Immediate
   - **Opt-out:** Not allowed (account security)

3. **Parent-Teacher Meeting Scheduled**
   - **Trigger:** Meeting confirmed by teacher
   - **Timing:** Immediate + reminder 24 hours before
   - **Content:** Date, time, teacher name, location/meeting link
   - **Opt-out:** Not allowed

---

#### Digest Emails (Low Priority)
4. **Weekly Progress Report**
   - **Trigger:** Scheduled every Sunday
   - **Timing:** 8:00 AM
   - **Content:** All children's grades, attendance, highlights, action items
   - **Opt-out:** Allowed

5. **Monthly Summary**
   - **Trigger:** First Sunday of month
   - **Timing:** 8:00 AM
   - **Content:** Month's achievements, payments made, upcoming events
   - **Opt-out:** Allowed

---

### 11.3 In-App Notification Patterns

#### Badge Counts
- **Unread Messages:** Red badge on Communication tab
- **Pending Actions:** Orange badge on Home tab
- **Payment Due:** Red badge on Billing tab

**Update Trigger:** Realtime as events occur

---

#### Notification Center (In-App)
- **Location:** Bell icon in app header
- **Content:** All notifications from last 30 days
- **Grouping:** By child, by date
- **Actions:** Mark as read, dismiss, tap to navigate

---

### 11.4 Notification Preferences

**User Settings (Per Parent):**
```json
{
  "push_notifications": {
    "attendance_alerts": true,
    "grade_updates": true,
    "teacher_messages": true,
    "payment_reminders": true,
    "school_announcements": true,
    "weekly_reports": false,
    "ai_insights": true
  },
  "email_notifications": {
    "payment_receipts": true, // Cannot disable
    "weekly_reports": true,
    "monthly_summary": false
  },
  "sms_notifications": {
    "emergency_only": true,
    "payment_overdue": true
  },
  "quiet_hours": {
    "enabled": true,
    "start_time": "21:00",
    "end_time": "07:00",
    "exceptions": ["emergency_announcements", "attendance_alerts"]
  }
}
```

**Default Settings:**
- All high/medium priority notifications: Enabled
- Low priority notifications: Enabled (can opt out)
- Quiet hours: Disabled by default

---

### 11.5 Notification Deep Linking

**Deep Link Format:** `myapp://screen/params`

**Examples:**
```
// Payment due notification
myapp://payment/fee_id=uuid&child_id=uuid

// New message notification
myapp://message/message_id=uuid

// Grade posted notification
myapp://child-progress/child_id=uuid&subject_id=uuid

// Attendance alert
myapp://child-overview/child_id=uuid&tab=attendance
```

**Implementation (React Navigation):**
```typescript
// Linking configuration
const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      PaymentScreen: 'payment/:fee_id',
      MessageDetail: 'message/:message_id',
      ChildProgress: 'child-progress/:child_id',
    }
  }
};
```

---

### 11.6 Notification Analytics

**Track:**
- Delivery rate (sent vs delivered)
- Open rate (delivered vs opened)
- Action rate (opened vs action taken)
- Opt-out rate by notification type
- Time-to-open (latency)

**Goals:**
- Delivery rate: >95%
- Open rate: >60% for high priority, >30% for low priority
- Action rate: >40% for actionable notifications
- Opt-out rate: <5%

---

## 12. Success Metrics & KPIs

### 12.1 User Engagement Metrics

#### Daily Active Users (DAU)
- **Definition:** Unique parents who open app at least once per day
- **Target:** 60% of registered parents
- **Current:** Not tracked (0%)
- **Tracking:** Analytics event: `app_open`

#### Weekly Active Users (WAU)
- **Definition:** Unique parents who open app at least once per week
- **Target:** 85% of registered parents
- **Current:** Not tracked (0%)

#### Session Duration
- **Definition:** Average time spent per session
- **Target:** 5-10 minutes per session
- **Current:** Not tracked
- **Tracking:** Analytics: `session_start`, `session_end`

#### Feature-Specific Engagement
- **Dashboard Views:** 90% of users daily
- **Grade Check:** 70% of users weekly
- **Communication Tab:** 50% of users weekly
- **Financial Tab:** 80% of users monthly (around due dates)
- **Smart Insights:** 40% of users weekly (target for Should Have feature)

**Current State:** ❌ No analytics implemented

---

### 12.2 Feature Adoption Rates

#### Core Features (Must Have)
- **Multi-Child Dashboard:** 100% (default screen)
- **Subject Performance View:** Target 80% in first week
- **Payment Processing:** Target 70% in first month
- **Message Inbox:** Target 90% in first week

#### Enhanced Features (Should Have)
- **Smart AI Insights:** Target 50% in first month
- **Action Items Management:** Target 60% in first month
- **Message Composition:** Target 40% in first month

**Measurement:**
- Track first-time feature use: `feature_first_use` event
- Track repeat usage: `feature_usage` event with count

**Current State:** ❌ No feature adoption tracking

---

### 12.3 Parent Satisfaction Indicators

#### Net Promoter Score (NPS)
- **Question:** "How likely are you to recommend this app to other parents?"
- **Scale:** 0-10
- **Target:** NPS > 50 (calculated as % promoters - % detractors)
- **Survey Timing:** After 2 weeks of usage, then quarterly
- **Current:** Not measured

#### In-App Satisfaction Rating
- **Trigger:** After key interactions (payment completion, message sent)
- **Question:** "How satisfied are you with this experience?"
- **Scale:** 1-5 stars
- **Target:** Average > 4.2
- **Current:** Not implemented

#### Support Ticket Volume
- **Metric:** Support tickets per active user
- **Target:** <5% (i.e., <5 tickets per 100 active users per month)
- **Categories:** Track by issue type (login, payment, missing data, etc.)
- **Current:** Not tracked

---

### 12.4 Technical Performance Metrics

#### Dashboard Load Time
- **Definition:** Time from app launch to dashboard fully rendered
- **Target:** <3 seconds on 4G, <5 seconds on 3G
- **Measurement:** `performance.now()` from app launch to `onLoadComplete`
- **Current:** Not measured

**Critical for UX:** Daily dashboard check-ins

#### API Response Time
- **Definition:** Time from API request to response received
- **Target:**
  - `GET /children`: <500ms
  - `GET /messages`: <700ms
  - `POST /initiate-payment`: <1000ms
- **Measurement:** Track via monitoring service (Sentry, Datadog)
- **Current:** Not measured

#### Error Rate
- **Definition:** API errors / total API requests
- **Target:** <1% error rate
- **Track:** By endpoint, by error type
- **Current:** Not monitored

#### Crash Rate
- **Definition:** App crashes / total sessions
- **Target:** <0.5%
- **Tracking:** Sentry or Firebase Crashlytics
- **Current:** Not tracked

---

### 12.5 Business Impact Metrics

#### Payment Collection Rate
- **Definition:** Fees paid on time / total fees due
- **Target:** >90% paid by due date, 95% within 7 days
- **Current:** Not tracked (critical business metric)

**Impact of App:**
- Measure: Payment rate before app vs after app
- Expected improvement: +10-15% on-time payment rate

#### Parent-Teacher Communication Volume
- **Definition:** Messages sent per parent per term
- **Target:** Average 5+ messages per parent per term
- **Current:** Not tracked

**Impact:** Increased communication correlates with better student outcomes

#### Attendance Improvement
- **Definition:** Student attendance rate after parent engagement
- **Hypothesis:** Real-time attendance alerts → better attendance
- **Measurement:** Attendance rate in months 1-3 vs months 4-6
- **Target:** +2-3% improvement in chronic absenteeism

---

### 12.6 Compliance & Security Metrics

#### Data Breach Incidents
- **Target:** 0
- **Tracking:** Security audit logs, incident reports
- **Response Time:** <24 hours to containment, <72 hours to notification

#### Privacy Compliance Audit
- **Frequency:** Quarterly
- **Checks:**
  - Row-level security functioning
  - Audit logs complete
  - Consent records accurate
  - Data retention policies followed
- **Target:** 100% compliance

#### User Data Access Requests
- **Metric:** Data export/deletion requests per quarter
- **Target Response Time:** <7 days
- **Current:** No process defined

---

### 12.7 Dashboard for Product Team

**Real-Time Metrics Dashboard:**
```
┌─────────────────────────────────────────────────────┐
│ Parent Portal - Real-Time Metrics                  │
├─────────────────────────────────────────────────────┤
│ Active Users                                        │
│   • DAU: 1,234 (62% of registered)                 │
│   • WAU: 1,890 (85% of registered)                 │
│   • Avg Session Duration: 6.2 minutes              │
├─────────────────────────────────────────────────────┤
│ Feature Adoption (Last 7 Days)                     │
│   • Dashboard: 95%                                  │
│   • Grades: 78%                                     │
│   • Messages: 54%                                   │
│   • Payments: 23%                                   │
│   • AI Insights: 42%                                │
├─────────────────────────────────────────────────────┤
│ Performance                                         │
│   • Avg Load Time: 2.1s (✓ Target: <3s)           │
│   • API Error Rate: 0.3% (✓ Target: <1%)          │
│   • Crash Rate: 0.2% (✓ Target: <0.5%)            │
├─────────────────────────────────────────────────────┤
│ Business Impact                                     │
│   • On-Time Payments: 92% (✓ Target: >90%)        │
│   • Avg Messages/Parent: 6.3 per term              │
│   • Payment Success Rate: 97.8%                     │
└─────────────────────────────────────────────────────┘
```

**Current State:** ❌ No metrics dashboard exists

---

## 13. Future Enhancements

### Version 1.1 (3-6 Months Post-Launch)
1. **AI-Powered Smart Insights** - ML model for risk prediction
2. **Message Composition & Reply** - Two-way communication with teachers
3. **Action Items Automation** - Auto-generate from unpaid fees, unsigned forms
4. **Advanced Notification Preferences** - Granular control per child
5. **Performance Comparison** - Multi-child performance benchmarking

### Version 1.2 (6-12 Months)
6. **Parent-Teacher Meeting Scheduler** - Integrated calendar with availability
7. **Study Time Monitoring** - Requires student app integration
8. **Report Downloads** - PDF generation for progress reports
9. **Offline Mode** - Cache critical data for offline viewing
10. **Multi-Language Support** - Hindi, regional languages

### Version 2.0 (12-18 Months)
11. **Community Engagement** - Parent forums, event management
12. **Advanced Analytics** - Predictive models for academic success
13. **Personalized Learning Recommendations** - Based on child's performance
14. **Integration with Learning Management Systems** - Direct LMS sync
15. **Voice/Video Call Integration** - In-app calls with teachers

### Version 2.5+ (Future Roadmap)
16. **Wearable Integration** - Smartwatch attendance check-in
17. **AR/VR Campus Tours** - For prospective parents
18. **Gamification** - Achievements for parent engagement
19. **Social Sharing** - Share child achievements (with privacy controls)
20. **Third-Party Tutoring Integration** - Book verified tutors through app

---

## Appendix A: File Structure & Component Map

```
Parent Section File Structure
C:\PC\OLD\src\
├── navigation/
│   └── ParentNavigator.tsx [✓ Complete]
│       - Bottom tab navigation (Home, Children, Communication, Billing)
│       - Stack navigators for each tab
│       - 10 screen references (some not analyzed)
├── screens/parent/
│   ├── ParentDashboard.tsx [⚠️ UI Complete, Backend Missing]
│   │   - Smart Insights dashboard (Phase 89)
│   │   - SmartParentInsights integration
│   │   - Enhanced touchable buttons
│   ├── EnhancedParentDashboardScreen.tsx [⚠️ UI Complete, Backend Missing]
│   │   - Multi-tab dashboard (Overview, Academic, Financial, Communication, Info)
│   │   - Comprehensive mock data
│   │   - Modal child detail view
│   ├── ParentFeatureValidationScreen.tsx [⚠️ Testing Tool]
│   │   - Validation test suites
│   │   - Performance benchmarks
│   │   - Internal QA tool (not for production users)
│   ├── ChildProgressMonitoringScreen.tsx [Referenced, Not Analyzed]
│   ├── PerformanceAnalyticsScreen.tsx [Referenced, Not Analyzed]
│   ├── AcademicScheduleScreen.tsx [Referenced, Not Analyzed]
│   ├── TeacherCommunicationScreen.tsx [Referenced, Not Analyzed]
│   ├── CommunityEngagementScreen.tsx [Referenced, Not Analyzed]
│   ├── BillingInvoiceScreen.tsx [Referenced, Not Analyzed]
│   ├── PaymentProcessingScreen.tsx [Referenced, Not Analyzed]
│   └── InformationHubScreen.tsx [Referenced, Not Analyzed]
├── screens/dashboard/
│   └── ParentDashboard.tsx [⚠️ Alternative Dashboard - Coaching Platform]
│       - Coaching-focused dashboard
│       - Financial management
│       - Monitoring tools (study time, app usage, screen time)
├── components/parent/
│   └── SmartParentInsights.tsx [⚠️ UI Complete, AI Missing]
│       - AI Score display
│       - Risk factors analysis
│       - Growth opportunities
│       - Recommended actions
│       - Multi-tab interface
├── components/core/
│   ├── EnhancedTouchableButton.tsx [Referenced]
│   ├── CoachingButton.tsx [Referenced]
│   └── DashboardCard.tsx [Referenced]
├── context/
│   ├── AuthContext.tsx [Referenced, Not Analyzed]
│   ├── ThemeContext.tsx [Referenced, Not Analyzed]
│   └── RealtimeContext.tsx [Referenced, Not Analyzed]
├── theme/
│   ├── colors.ts [Referenced - LightTheme used]
│   ├── typography.ts [Referenced - Typography used]
│   └── spacing.ts [Referenced - Spacing, BorderRadius used]
└── services/
    └── database/
        └── supabase.ts [Referenced, Not Analyzed]
```

**Legend:**
- [✓ Complete] - Fully implemented
- [⚠️ UI Complete, Backend Missing] - UI ready, needs data integration
- [⚠️ Testing Tool] - Internal tool, not user-facing
- [❌ Not Implemented] - Missing entirely
- [Referenced, Not Analyzed] - Imported but file not provided

---

## Appendix B: Mock Data vs Real Data Mapping

| Feature | Current Mock Data | Required Real Data Source | Complexity |
|---------|------------------|---------------------------|------------|
| **Child List** | Hardcoded array (lines 107-133 in ParentDashboard.tsx dashboard) | Supabase: `students` JOIN `parent_child_relationships` | Low |
| **Overall Grade** | Calculated manually (87.5, 78.3) | Weighted average from `grades` table | Medium |
| **Attendance Rate** | Static numbers (95%, 88%) | `SELECT COUNT(*) FROM attendance WHERE status='present'` / total days | Low |
| **Today's Status** | Hardcoded ('in-class', 'completed') | Realtime query: current time vs `class_schedule` + `attendance` | Medium |
| **Subject Performance** | Array of objects (lines 135-172) | `grades` table JOIN `subjects` JOIN `teachers` | Low |
| **Trend Calculation** | Static ('up', 'down', 'stable') | Last 3-5 grades comparison algorithm | Medium |
| **Financial Summary** | Mock object (lines 1582-1631) | `fee_structure` + `payments` + `discounts` aggregation | Medium |
| **Payment History** | Hardcoded array | `payments` table filtered by parent/child | Low |
| **Messages** | Mock array (lines 1634-1668) | `messages` table with sender/receiver filtering | Low |
| **Announcements** | Inline array (lines 1156-1180) | `announcements` table with target_audience filter | Low |
| **AI Score** | Hardcoded (85, 92) | ML model or rule-based calculation | High |
| **Risk Factors** | Mock array (lines 119-127) | Algorithm: grade trends + attendance + behavior reports | High |
| **Opportunities** | Mock array (lines 129-138) | Algorithm: high performance + competition eligibility | High |
| **Recommended Actions** | Mock array (lines 161-172) | Action generation engine based on risk/opportunities | High |
| **Study Time** | Static numbers (lines 244-249) | `study_sessions` table (requires student app) | Medium |
| **App Usage** | Mock breakdown (lines 250-258) | Device monitoring integration | Very High |
| **Action Items** | Mock array (lines 1671-1712) | Auto-generated from unpaid fees, unsigned forms, etc. | Medium |
| **Teacher Comments** | Mock array (lines 1494-1511) | `teacher_comments` table | Low |

**Complexity Legend:**
- **Low:** Simple database query
- **Medium:** Requires joins or calculations
- **High:** Requires algorithms or ML models
- **Very High:** Requires external integrations (device monitoring, payment gateways)

---

## Appendix C: Technology Stack Details

### Frontend
```json
{
  "framework": "React Native",
  "language": "TypeScript",
  "navigation": "@react-navigation/native (v6+)",
  "ui_library": "react-native-paper",
  "state_management": "React Context API (AuthContext, ThemeContext)",
  "icons": "react-native-vector-icons/MaterialIcons",
  "forms": "Not specified (likely react-hook-form or formik)",
  "http_client": "Supabase client (built on fetch)"
}
```

### Backend
```json
{
  "baas": "Supabase",
  "database": "PostgreSQL (via Supabase)",
  "authentication": "Supabase Auth (JWT-based)",
  "realtime": "Supabase Realtime (PostgreSQL replication)",
  "storage": "Supabase Storage (S3-compatible)",
  "functions": "Supabase Edge Functions (Deno) or external backend (not specified)"
}
```

### External Services (To Be Integrated)
```json
{
  "payment_gateway": "Razorpay / Stripe (not decided)",
  "push_notifications": "Firebase Cloud Messaging (FCM)",
  "sms": "Twilio / AWS SNS",
  "email": "SendGrid / AWS SES",
  "analytics": "Google Analytics 4 / Mixpanel",
  "error_tracking": "Sentry",
  "performance": "Firebase Performance Monitoring"
}
```

### Development Tools
```json
{
  "testing": "Jest + React Native Testing Library (assumed)",
  "linting": "ESLint + Prettier (likely)",
  "version_control": "Git",
  "ci_cd": "Not specified (recommend GitHub Actions or Bitrise)"
}
```

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-19 | AI Product Analyst | Initial PRD based on codebase analysis |

---

**END OF PRODUCT REQUIREMENTS DOCUMENT**

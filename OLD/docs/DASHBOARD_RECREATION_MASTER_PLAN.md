# Dashboard Recreation Master Plan
**Phase-by-Phase Implementation with Real Supabase Data**

**Rules:**
1. ❌ NO MOCK DATA - Only real data from Supabase
2. ✅ Follow todo list systematically
3. ✅ Use all new patterns (BaseScreen, safe navigation, analytics, validation, etc.)
4. ✅ Test each phase before moving to next

---

## 📋 PHASE 1: OVERVIEW TAB (Core Dashboard)

**Goal:** Create the main dashboard with children progress, action items, and communications

### Database Requirements

**Tables Needed:**
1. `profiles` (already exists)
   - ✅ id, full_name, email, phone, role

2. `students` (already exists)
   - ✅ id, full_name, student_id, grade, class, status
   - ❌ Need to add: profile_image, overall_grade, attendance_rate, behavior_rating

3. `parent_student_relationships` (already exists)
   - ✅ parent_id, student_id, relationship_type

4. `assignments` (need to check/create)
   - id, student_id, title, description, due_date, status, score, subject

5. `action_items` (NEW - needs creation)
   - id, parent_id, student_id (optional), title, description
   - type (payment, form, meeting, document, permission)
   - due_date, priority, status, created_at

6. `notifications` (already exists)
   - ✅ id, recipient_id, title, content, created_at, read_at
   - ❌ Need to add: sender_id, sender_role, priority, requires_response

---

### PHASE 1 TODO LIST

#### 1.1 Database Setup ✅
- [ ] **Check students table columns**
  - File: Database schema
  - Run: `SELECT column_name FROM information_schema.columns WHERE table_name='students'`
  - Add missing: `profile_image TEXT`, `overall_grade DECIMAL`, `attendance_rate DECIMAL`, `behavior_rating TEXT`

- [ ] **Create action_items table**
  ```sql
  CREATE TABLE action_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES profiles(id),
    student_id UUID REFERENCES students(id),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('payment', 'form', 'meeting', 'document', 'permission')),
    due_date DATE NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```

- [ ] **Update notifications table**
  - Add columns: `sender_id UUID`, `sender_role TEXT`, `priority TEXT`, `requires_response BOOLEAN`

- [ ] **Create assignments table** (if doesn't exist)
  ```sql
  CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT,
    due_date DATE,
    status TEXT CHECK (status IN ('pending', 'submitted', 'graded', 'overdue')),
    score DECIMAL,
    total_score DECIMAL DEFAULT 100,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```

#### 1.2 API Endpoints (parentApi.ts) 📡
- [ ] **Create getChildrenFullData(parentId)**
  - Returns: Array of children with full academic data
  - Includes: profile, grades, attendance, assignments count, behavior
  - Validation: Zod schema
  - File: `src/services/api/parentApi.ts`

- [ ] **Create getChildSubjectPerformance(childId)**
  - Returns: Array of subject performance data
  - Includes: subject, current_grade, trend, last_assessment, upcoming_exams, teacher_note
  - Validation: Zod schema
  - File: `src/services/api/parentApi.ts`

- [ ] **Create getChildRecentActivities(childId, limit)**
  - Returns: Array of recent activities
  - Includes: type, title, description, date, score, status
  - Validation: Zod schema
  - File: `src/services/api/parentApi.ts`

- [ ] **Create getParentActionItems(parentId)**
  - Returns: Array of action items
  - Filters: Can filter by status, priority
  - Validation: Zod schema
  - File: `src/services/api/parentApi.ts`

- [ ] **Create updateActionItemStatus(itemId, status)**
  - Updates action item status
  - Returns: Updated action item
  - File: `src/services/api/parentApi.ts`

- [ ] **Create getParentCommunications(parentId, limit)**
  - Returns: Array of communications/messages
  - Includes: sender info, priority, requires_response flag
  - Validation: Zod schema
  - File: `src/services/api/parentApi.ts`

#### 1.3 Validation Schemas (schemas.ts) 🛡️
- [ ] **Create ChildFullDataSchema**
  ```tsx
  const ChildFullDataSchema = z.object({
    id: z.string().uuid(),
    full_name: z.string(),
    student_id: z.string(),
    grade: z.string(),
    class: z.string(),
    profile_image: z.string().url().optional(),
    overall_grade: z.number().min(0).max(100),
    attendance_rate: z.number().min(0).max(100),
    behavior_rating: z.enum(['excellent', 'good', 'needs_improvement']),
    assignments_completed: z.number(),
    total_assignments: z.number(),
    upcoming_exams: z.number(),
  });
  ```

- [ ] **Create SubjectPerformanceSchema**
- [ ] **Create RecentActivitySchema**
- [ ] **Create ActionItemSchema**
- [ ] **Create CommunicationSchema**

#### 1.4 Query Keys (queryKeys.ts) 🔑
- [ ] **Add query keys for Phase 1**
  ```tsx
  parent: {
    childrenFull: (parentId: string) => [...parent.all, 'childrenFull', parentId],
    childSubjects: (childId: string) => [...parent.all, 'childSubjects', childId],
    childActivities: (childId: string) => [...parent.all, 'childActivities', childId],
    actionItems: (parentId: string) => [...parent.all, 'actionItems', parentId],
    communications: (parentId: string) => [...parent.all, 'communications', parentId],
  }
  ```

#### 1.5 Custom Hook (useParentDashboard.ts) 🪝
- [ ] **Expand useParentDashboard hook**
  - Add queries for: childrenFullData, actionItems, communications
  - Return: All data with loading/error states
  - File: `src/hooks/useParentDashboard.ts`

#### 1.6 UI Components 🎨
- [ ] **Create ChildProgressCard component**
  - Props: child data, onPress handler
  - Shows: Name, grade, overall score, attendance, assignments
  - Uses: ListItem, Badge, Avatar, Row, Col
  - Analytics: Tracks card tap
  - File: `src/components/parent/ChildProgressCard.tsx`

- [ ] **Create ChildDetailModal component**
  - Props: child data, visible, onClose
  - Tabs: Overview, Subjects, Activities, Comments
  - Uses: Modal, ScrollView, BaseScreen patterns
  - Analytics: Tracks section views
  - File: `src/components/parent/ChildDetailModal.tsx`

- [ ] **Create ActionItemCard component**
  - Props: action item, onComplete handler
  - Shows: Title, description, due date, priority badge
  - Interactive: Mark complete button
  - Analytics: Tracks completion
  - File: `src/components/parent/ActionItemCard.tsx`

- [ ] **Create CommunicationCard component**
  - Props: communication data, onPress handler
  - Shows: From, subject, preview, date, priority badge
  - Badge: "NEW" if unread, "Response Required" if needed
  - Analytics: Tracks message opens
  - File: `src/components/parent/CommunicationCard.tsx`

#### 1.7 NewParentDashboard Integration 🏗️
- [ ] **Recreate NewParentDashboard.tsx structure**
  - Remove current simple implementation
  - Add BaseScreen wrapper
  - Add all Phase 1 sections
  - File: `src/screens/parent/NewParentDashboard.tsx`

- [ ] **Add Welcome Section**
  - Shows: Parent name, welcome message
  - Uses: Card, T (typography), sx
  - Data: From auth context

- [ ] **Add Children Progress Section**
  - Maps through children array
  - Renders: ChildProgressCard for each
  - Empty state: "No children found"
  - Analytics: Tracks "view all children" tap

- [ ] **Add Action Items Section**
  - Shows count: "Action Items (X pending)"
  - Renders: Top 3 action items
  - "View All" button if more than 3
  - Analytics: Tracks item completion

- [ ] **Add Recent Communications Section**
  - Shows count: "Recent Messages (X unread)"
  - Renders: Last 3 communications
  - "View All" button
  - Analytics: Tracks message opens

#### 1.8 Navigation & Analytics 🧭
- [ ] **Add navigation handlers**
  - `handleChildPress(child)` - Opens detail modal with analytics
  - `handleActionComplete(itemId)` - Updates status with analytics
  - `handleCommunicationPress(comm)` - Opens message with analytics
  - `handleViewAllChildren()` - Navigate to children list
  - `handleViewAllActions()` - Navigate to actions screen
  - `handleViewAllMessages()` - Navigate to messages screen

- [ ] **Add analytics events**
  - `view_child_details` - When child card tapped
  - `complete_action_item` - When action marked complete
  - `open_communication` - When message opened
  - `view_all_children` - When "View All" tapped
  - `view_all_actions` - When "View All Actions" tapped
  - `view_all_messages` - When "View All Messages" tapped

#### 1.9 Testing ✅
- [ ] **Test with real Supabase data**
  - Verify: Children data loads correctly
  - Verify: Action items display and complete
  - Verify: Communications show with correct priorities
  - Verify: All analytics events fire
  - Verify: Empty states work when no data
  - Check: Console logs for errors

- [ ] **Test navigation**
  - Verify: Child detail modal opens
  - Verify: Safe navigation works (no double-tap crashes)
  - Verify: All navigation tracked in analytics

- [ ] **Test error handling**
  - Verify: Loading states show
  - Verify: Error states show with retry
  - Verify: Empty states show when appropriate

---

## 📋 PHASE 2: FINANCIAL TAB

**Goal:** Complete financial management with payments, history, and discounts

### Database Requirements

**Tables Needed:**
1. `payments` (need to create)
   - id, parent_id, student_id, amount, date, method
   - description, status, transaction_id, created_at

2. `fee_structure` (need to create)
   - id, student_id, total_fees, academic_year
   - fee_breakdown (JSON), created_at

3. `discounts` (need to create)
   - id, student_id, type, amount, description
   - valid_from, valid_until, created_at

### PHASE 2 TODO LIST

#### 2.1 Database Setup
- [ ] Create payments table
- [ ] Create fee_structure table
- [ ] Create discounts table
- [ ] Add RLS policies for parent access

#### 2.2 API Endpoints
- [ ] **getFinancialSummary(parentId)** - Already exists, verify completeness
- [ ] **getPaymentHistory(parentId)** - Returns all past payments
- [ ] **getActiveDiscounts(parentId)** - Returns current discounts
- [ ] **getUpcomingPayments(parentId)** - Returns next payment due
- [ ] **initPayment(paymentData)** - Creates payment record

#### 2.3 Validation Schemas
- [ ] Create PaymentSchema
- [ ] Create FeeStructureSchema
- [ ] Create DiscountSchema
- [ ] Update FinancialSummarySchema (already exists, expand)

#### 2.4 Query Keys
- [ ] Add financial query keys (some exist, expand)

#### 2.5 UI Components
- [ ] Create FinancialSummaryCard component
- [ ] Create PaymentHistoryItem component
- [ ] Create DiscountBadge component
- [ ] Create MakePaymentButton component

#### 2.6 Tab Integration
- [ ] Add tab navigator to NewParentDashboard
- [ ] Create Financial tab content
- [ ] Integrate all financial sections
- [ ] Add pull-to-refresh

#### 2.7 Navigation & Analytics
- [ ] Add payment flow handlers
- [ ] Track: initiate_payment, view_payment_history, view_discounts

#### 2.8 Testing
- [ ] Test with real payment data
- [ ] Test payment flow
- [ ] Test analytics

---

## 📋 PHASE 3: ACADEMIC TAB

**Goal:** Detailed academic performance tracking and insights

### Database Requirements

**Tables Needed:**
1. `subject_performance` (new)
   - id, student_id, subject, current_grade, trend
   - last_assessment, upcoming_exams, teacher_note, updated_at

2. `academic_activities` (new)
   - id, student_id, type, title, description
   - date, score, status, importance, created_at

3. `upcoming_assessments` (new)
   - id, student_id, subject, type, date
   - topics (JSON), created_at

4. `teacher_recommendations` (new)
   - id, student_id, subject, priority
   - recommendation, estimated_study_time, created_at

### PHASE 3 TODO LIST

#### 3.1 Database Setup
- [ ] Create subject_performance table
- [ ] Create academic_activities table
- [ ] Create upcoming_assessments table
- [ ] Create teacher_recommendations table
- [ ] Add RLS policies

#### 3.2 API Endpoints
- [ ] getAcademicOverview(parentId)
- [ ] getSubjectPerformance(childId)
- [ ] getRecentActivities(childId, limit)
- [ ] getUpcomingAssessments(childId)
- [ ] getTeacherRecommendations(childId)

#### 3.3 Validation Schemas
- [ ] SubjectPerformanceSchema (expand from Phase 1)
- [ ] AcademicActivitySchema
- [ ] AssessmentSchema
- [ ] RecommendationSchema

#### 3.4 Query Keys
- [ ] Add academic query keys

#### 3.5 UI Components
- [ ] Create SubjectPerformanceCard (with trend indicators)
- [ ] Create ActivityCard (color-coded by type)
- [ ] Create AssessmentCard (timeline view)
- [ ] Create RecommendationCard (priority-based)

#### 3.6 Tab Integration
- [ ] Add Academic tab
- [ ] Create Academic tab content
- [ ] Add per-child expandable sections

#### 3.7 Navigation & Analytics
- [ ] Track: view_subject_details, view_activities, view_assessments

#### 3.8 Testing
- [ ] Test with academic data
- [ ] Test trend calculations
- [ ] Test analytics

---

## 📋 PHASE 4: COMMUNICATION TAB

**Goal:** Complete communication management system

### Database Requirements

**Tables Needed:**
1. `communications` (expand notifications table or create new)
   - id, from_user_id, to_user_id, from_role, subject
   - message, date, priority, is_read, requires_response
   - attachments (JSON), created_at

### PHASE 4 TODO LIST

#### 4.1 Database Setup
- [ ] Expand/create communications table
- [ ] Add RLS policies

#### 4.2 API Endpoints
- [ ] getCommunications(parentId, filters)
- [ ] markCommunicationRead(commId)
- [ ] sendMessage(messageData)
- [ ] scheduleMeeting(meetingData)

#### 4.3 Validation Schemas
- [ ] CommunicationSchema (expand from Phase 1)
- [ ] MessageSchema
- [ ] MeetingSchema

#### 4.4 Query Keys
- [ ] Add communication query keys

#### 4.5 UI Components
- [ ] Create CommunicationStatsCard
- [ ] Create MessageCard (with priority highlighting)
- [ ] Create ComposeMessageModal
- [ ] Create ScheduleMeetingModal

#### 4.6 Tab Integration
- [ ] Add Communication tab
- [ ] Create Communication tab content
- [ ] Add message categories (high priority, unread, all)

#### 4.7 Navigation & Analytics
- [ ] Track: open_message, send_message, schedule_meeting, emergency_contact

#### 4.8 Testing
- [ ] Test message loading
- [ ] Test compose flow
- [ ] Test analytics

---

## 📋 PHASE 5: INFO TAB

**Goal:** School information hub with announcements and contacts

### Database Requirements

**Tables Needed:**
1. `school_announcements` (new)
   - id, title, content, date, category
   - is_important, expiry_date, target_audience (JSON), created_at

2. `school_contacts` (new)
   - id, name, role, department, phone, email
   - office_hours, location, is_emergency, created_at

3. `emergency_procedures` (new)
   - id, type, title, procedure, contacts (JSON)
   - last_updated, created_at

4. `school_resources` (new)
   - id, title, description, type, url
   - category, created_at

### PHASE 5 TODO LIST

#### 5.1 Database Setup
- [ ] Create school_announcements table
- [ ] Create school_contacts table
- [ ] Create emergency_procedures table
- [ ] Create school_resources table
- [ ] Add RLS policies

#### 5.2 API Endpoints
- [ ] getSchoolAnnouncements(limit)
- [ ] getSchoolContacts()
- [ ] getEmergencyProcedures()
- [ ] getSchoolResources(category)

#### 5.3 Validation Schemas
- [ ] AnnouncementSchema
- [ ] SchoolContactSchema
- [ ] EmergencyProcedureSchema
- [ ] SchoolResourceSchema

#### 5.4 Query Keys
- [ ] Add school info query keys

#### 5.5 UI Components
- [ ] Create QuickAccessGrid
- [ ] Create AnnouncementCard (with importance highlighting)
- [ ] Create ContactCard (with call/email actions)
- [ ] Create EmergencyProcedureAccordion

#### 5.6 Tab Integration
- [ ] Add Info tab
- [ ] Create Info tab content
- [ ] Add quick access buttons

#### 5.7 Navigation & Analytics
- [ ] Track: view_calendar, view_handbook, call_contact, email_contact

#### 5.8 Testing
- [ ] Test announcements loading
- [ ] Test contact actions (call, email)
- [ ] Test analytics

---

## 📊 Master Progress Tracking

### Phase 1 (Overview Tab): 0/12 tasks ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
### Phase 2 (Financial Tab): 0/8 tasks ⬜⬜⬜⬜⬜⬜⬜⬜
### Phase 3 (Academic Tab): 0/8 tasks ⬜⬜⬜⬜⬜⬜⬜⬜
### Phase 4 (Communication Tab): 0/8 tasks ⬜⬜⬜⬜⬜⬜⬜⬜
### Phase 5 (Info Tab): 0/8 tasks ⬜⬜⬜⬜⬜⬜⬜⬜

**Total Progress: 0/44 tasks (0%)**

---

## 🎯 Current Focus: PHASE 1

**Next Steps:**
1. Start with database setup (check students table, create action_items)
2. Create API endpoints with real Supabase queries
3. Add Zod validation schemas
4. Build UI components one by one
5. Integrate into NewParentDashboard
6. Test with real data

**Estimated completion per phase:** Each phase ~1-2 hours of focused work

---

## ✅ Success Criteria

Each phase is complete when:
- ✅ All database tables created and populated
- ✅ All API endpoints working with real data
- ✅ All components render correctly
- ✅ All analytics events firing
- ✅ All navigation working safely
- ✅ No errors in console
- ✅ Empty states handled
- ✅ Loading states working
- ✅ Error states with retry working

---

**Let's start Phase 1! Ready to begin?**

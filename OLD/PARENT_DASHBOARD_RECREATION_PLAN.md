# Parent Dashboard Recreation Plan
**Complete Analysis & Phase-by-Phase Implementation**

---

## 📊 Old Dashboard Analysis

### **5 Main Tabs Found:**

#### 1. **Overview Tab** (Home)
- ✅ Welcome Section with parent name
- ✅ Children Progress Cards (multi-child support)
- ✅ Action Items (pending tasks/todos)
- ✅ Recent Communications (unread messages)

#### 2. **Academic Tab**
- Subject Performance (grades, trends)
- Assignment List (completed/pending)
- Upcoming Exams
- Teacher Comments & Feedback
- Attendance Overview

#### 3. **Financial Tab**
- Financial Summary (Total Fees, Paid, Pending)
- Payment History (past transactions)
- Available Discounts (academic, sibling, early payment)
- Quick Payment Action Button
- Next Due Date

#### 4. **Communication Tab**
- Messages from Teachers
- Messages from Admin/Principal
- Unread count
- Priority messages (high/medium/low)
- Requires Response indicator
- Attachments support

#### 5. **School Info Tab**
- Announcements (general, academic, emergency)
- School Calendar (events, holidays)
- Policy Documents (handbook, code of conduct)
- Staff Directory (contacts)
- Emergency Procedures

---

## 🎯 Recreation Strategy

### **Principles:**
1. ✅ **Real Supabase Data Only** - No mock data arrays
2. ✅ **All Screens Functional** - No "Coming Soon" placeholders
3. ✅ **New Architecture** - Use hooks, TanStack Query, BaseScreen
4. ✅ **MD3 Components** - Use design system tokens
5. ✅ **Phase by Phase** - Build incrementally, test at each phase

---

## 📋 Phase-by-Phase Implementation

### **PHASE 1: Overview Tab Enhancement** ✅ PARTIALLY DONE
**What Exists:**
- NewParentDashboard.tsx has basic structure
- Children cards with progress
- Welcome section

**What's Missing:**
- Action Items section
- Recent Communications section
- Pull-to-refresh functionality
- Real-time updates

**Tasks:**
1. Add Action Items Section (with real Supabase data)
2. Add Recent Communications Section
3. Implement pull-to-refresh
4. Add loading states with BaseScreen

**Estimated:** 2-3 hours

---

### **PHASE 2: Children Management**
**Screens to Create:**

1. **ChildrenListScreen.tsx** ✅ EXISTS (placeholder)
   - Grid/List view of all children
   - Quick stats per child
   - Navigate to child detail
   - **Data:** `getParentChildren()` API

2. **ChildDetailScreen.tsx** ✅ EXISTS (placeholder)
   - Full child profile
   - Academic overview
   - Attendance summary
   - Recent activities timeline
   - Subject breakdown
   - **Data:** `getChildDetails(childId)` API

**Estimated:** 3-4 hours

---

### **PHASE 3: Academic Section**
**Screens to Create:**

1. **SubjectDetailScreen.tsx** ✅ EXISTS (placeholder)
   - Subject performance chart
   - Assignment history for subject
   - Upcoming exams for subject
   - Teacher notes
   - **Data:** `getSubjectPerformance(studentId, subject)` API

2. **AssignmentsListScreen.tsx** ✅ EXISTS (placeholder)
   - All assignments (completed/pending/overdue)
   - Filter by status, subject, date
   - Quick view assignment details
   - **Data:** `getStudentAssignments(studentId)` API

3. **AssignmentDetailScreen.tsx** ✅ EXISTS (placeholder)
   - Assignment description
   - Due date, submission status
   - Grade/feedback (if graded)
   - Attachments
   - **Data:** `getAssignmentDetail(assignmentId)` API

4. **UpcomingExamsScreen.tsx** ✅ EXISTS (placeholder)
   - Calendar view of exams
   - Exam details (subject, date, syllabus)
   - Past exam results
   - **Data:** `getUpcomingExams(studentId)` API

5. **AcademicReportsScreen.tsx** ✅ EXISTS (placeholder)
   - Report cards (term/semester)
   - Progress reports
   - Download as PDF
   - **Data:** `getAcademicReports(studentId)` API

6. **StudyRecommendationsScreen.tsx** ✅ EXISTS (placeholder)
   - Personalized study tips
   - Weak areas identified
   - Recommended resources
   - **Data:** AI-generated or teacher recommendations

**Estimated:** 6-8 hours

---

### **PHASE 4: Financial Section**
**Screens to Create:**

1. **PaymentHistoryScreen.tsx** ✅ EXISTS (placeholder)
   - List of all payments
   - Filter by date, status
   - Receipt download
   - **Data:** `getPaymentHistory(parentId)` API

2. **FeeStructureScreen.tsx** ✅ EXISTS (placeholder)
   - Breakdown of fees (tuition, transport, etc.)
   - Per-child fee structure
   - Academic year total
   - **Data:** `getFeeStructure(studentId)` API

3. **DiscountsScreen.tsx** ✅ EXISTS (placeholder)
   - Active discounts
   - Eligibility criteria
   - Applied discounts
   - Available discounts
   - **Data:** `getDiscounts(parentId)` API

4. **MakePaymentScreen.tsx** ✅ EXISTS (placeholder)
   - Payment amount selection
   - Payment method (UPI, Card, Bank)
   - Payment gateway integration
   - Confirmation & receipt
   - **Data:** `createPayment()` API

**Estimated:** 5-6 hours

---

### **PHASE 5: Communication Section**
**Screens to Create:**

1. **MessagesListScreen.tsx** ✅ EXISTS (placeholder)
   - All messages from teachers/admin
   - Unread indicator
   - Filter by sender, priority, date
   - Search messages
   - **Data:** `getParentMessages(parentId)` API

2. **MessageDetailScreen.tsx** ✅ EXISTS (placeholder)
   - Full message content
   - Mark as read
   - Reply functionality
   - Attachments view/download
   - **Data:** `getMessage(messageId)` API

3. **ComposeMessageScreen.tsx** ✅ EXISTS (placeholder)
   - Send message to teacher/admin
   - Select recipient
   - Subject & body
   - Attach files
   - **Data:** `sendMessage()` API

4. **TeacherListScreen.tsx** ✅ EXISTS (placeholder)
   - List of child's teachers
   - Subject assignment
   - Contact info
   - Message teacher button
   - **Data:** `getTeachers(studentId)` API

5. **ScheduleMeetingScreen.tsx** ✅ EXISTS (placeholder)
   - Request parent-teacher meeting
   - Select teacher & time slot
   - Meeting purpose
   - Confirmation
   - **Data:** `scheduleMeeting()` API

6. **MeetingsHistoryScreen.tsx** ✅ EXISTS (placeholder)
   - Past & upcoming meetings
   - Meeting notes/summary
   - Reschedule/cancel
   - **Data:** `getMeetings(parentId)` API

7. **NotificationsScreen.tsx** ✅ EXISTS (placeholder)
   - All app notifications
   - Push notification history
   - Clear/dismiss
   - **Data:** `getNotifications(parentId)` API

**Estimated:** 7-9 hours

---

### **PHASE 6: School Info Section**
**Screens to Create:**

1. **AnnouncementsScreen.tsx** ✅ EXISTS (placeholder)
   - School announcements (general, academic, emergency)
   - Filter by category
   - Read/unread status
   - **Data:** `getAnnouncements()` API

2. **SchoolCalendarScreen.tsx** ✅ EXISTS (placeholder)
   - Monthly calendar view
   - Events, holidays, exams
   - Event details
   - Add to personal calendar
   - **Data:** `getSchoolCalendar()` API

3. **SchoolHandbookScreen.tsx** ✅ EXISTS (placeholder)
   - School handbook PDF viewer
   - Search within handbook
   - Download offline
   - **Data:** Static PDF or `getHandbook()` API

4. **SchoolPoliciesScreen.tsx** ✅ EXISTS (placeholder)
   - List of policies
   - Policy documents (attendance, discipline, etc.)
   - **Data:** `getPolicies()` API

5. **StaffDirectoryScreen.tsx** ✅ EXISTS (placeholder)
   - List of all staff
   - Filter by department/role
   - Contact info
   - Quick message button
   - **Data:** `getStaffDirectory()` API

**Estimated:** 5-6 hours

---

### **PHASE 7: Action Items**
**Screens to Create:**

1. **ActionItemsScreen.tsx** ✅ EXISTS (placeholder)
   - List of all pending tasks
   - Filter by type, priority, due date
   - Mark as complete
   - **Data:** `getActionItems(parentId)` API

2. **ActionItemDetailScreen.tsx** ✅ EXISTS (placeholder)
   - Full task description
   - Due date, priority
   - Complete action (payment, form, etc.)
   - **Data:** `getActionItemDetail(itemId)` API

**Estimated:** 2-3 hours

---

## 📁 Supabase Tables Needed

### **Tables to Create/Update:**

1. **action_items** (parent tasks/todos)
2. **messages** (parent-teacher communications)
3. **announcements** (school announcements)
4. **calendar_events** (school calendar)
5. **meetings** (parent-teacher meetings)
6. **assignments** (student assignments)
7. **exams** (upcoming & past exams)
8. **subject_performance** (grades by subject)
9. **payments** (payment history)
10. **discounts** (available discounts)
11. **fee_structure** (fee breakdown)
12. **notifications** (app notifications)
13. **policies** (school policies)
14. **staff** (teacher/admin directory)

---

## 🏗️ Architecture Pattern

### **Every Screen Must Have:**

```typescript
/**
 * ScreenName.tsx
 * Description of what this screen does
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Col, Row, Card, T } from '../../ui';
import { getDataFromSupabase } from '../../services/api/parentApi';

type Props = ParentStackScreenProps<'ScreenName'>;

const ScreenName: React.FC<Props> = ({ route, navigation }) => {
  const { param } = route.params || {};

  // ✅ Real Supabase data with TanStack Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['dataKey', param],
    queryFn: () => getDataFromSupabase(param),
  });

  return (
    <BaseScreen
      scrollable
      loading={isLoading}
      error={error}
      empty={!data || data.length === 0}
    >
      <Col sx={{ p: 'md' }}>
        {/* Screen content using real data */}
      </Col>
    </BaseScreen>
  );
};

export default ScreenName;
```

### **Key Requirements:**
- ✅ Use `BaseScreen` wrapper
- ✅ Use TanStack Query for data fetching
- ✅ Real Supabase API calls (no mock data)
- ✅ Proper loading/error/empty states
- ✅ MD3 design system components
- ✅ TypeScript with proper types
- ✅ Safe navigation
- ✅ Analytics tracking

---

## 🚀 Getting Started

### **Recommended Order:**

**Week 1:**
- Phase 1: Complete Overview Tab ✅
- Phase 2: Children Management

**Week 2:**
- Phase 3: Academic Section (high priority for parents)

**Week 3:**
- Phase 4: Financial Section (critical functionality)
- Phase 5: Communication Section (start)

**Week 4:**
- Phase 5: Communication Section (complete)
- Phase 6: School Info Section
- Phase 7: Action Items

**Total Estimated Time:** 30-40 hours

---

## ✅ Acceptance Criteria

### **Each Screen Must:**
1. Load real data from Supabase
2. Handle loading state gracefully
3. Handle error state gracefully
4. Handle empty state gracefully
5. Support pull-to-refresh
6. Have proper TypeScript types
7. Use MD3 design system
8. Pass ESLint with 0 warnings
9. Pass TypeScript with 0 errors
10. Work on real device without crashes

### **Each Phase Must:**
1. Be fully tested before moving to next phase
2. Have all screens functional (no "Coming Soon")
3. Integrate with existing navigation
4. Update navigation types
5. Have proper analytics tracking

---

## 📝 Next Step

**START WITH PHASE 1:**
Complete the Overview Tab by adding:
1. Action Items Section
2. Recent Communications Section
3. Pull-to-refresh
4. Polish existing children cards

**Then move to Phase 2.**

Ready to begin? 🚀

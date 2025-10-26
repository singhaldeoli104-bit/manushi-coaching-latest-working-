# Required Screens for Complete Parent Dashboard

**All screens needed for full dashboard functionality - NO placeholders, NO "Coming Soon" alerts**

---

## 📱 Screen Categories

### ✅ Already Exist (Verified)
1. NewParentDashboard - ✅ Main dashboard (Home tab)
2. EnhancedParentDashboardScreen - ✅ Old dashboard
3. ChildProgressMonitoringScreen - ✅ Child progress
4. PerformanceAnalyticsScreen - ✅ Performance details
5. AcademicScheduleScreen - ✅ Schedule
6. TeacherCommunicationScreen - ✅ Teacher communication
7. CommunityEngagementScreen - ✅ Community
8. BillingInvoiceScreen - ✅ Billing & invoices
9. PaymentProcessingScreen - ✅ Payment processing
10. InformationHubScreen - ✅ Information hub

---

## ❌ Need to Create (26 New Screens)

### PHASE 1: Overview Tab Screens (6 screens)

#### 1. ChildDetailScreen
**Route:** `ChildDetail`
**Params:** `{ childId: string }`
**Purpose:** Full child profile with tabs
**Tabs:** Overview | Academic | Attendance | Assignments | Behavior
**Shows:**
- Student info (name, ID, grade, class, photo)
- Overall grade & attendance
- Subject-by-subject performance
- Recent activities
- Teacher comments
- Behavior rating
**Navigation from:** ChildProgressCard (dashboard)

#### 2. ChildrenListScreen
**Route:** `ChildrenList`
**Params:** None
**Purpose:** View all children in list/grid
**Shows:**
- All children cards
- Filter by grade/class
- Search by name
**Navigation from:** "View All Children" button

#### 3. ActionItemsScreen
**Route:** `ActionItems`
**Params:** None
**Purpose:** View all action items
**Shows:**
- Pending action items
- Completed action items
- Filter by type/priority
- Mark complete functionality
**Navigation from:** "View All" in Action Items section

#### 4. ActionItemDetailScreen
**Route:** `ActionItemDetail`
**Params:** `{ itemId: string }`
**Purpose:** View single action item details
**Shows:**
- Full description
- Attachments (if any)
- Complete/uncomplete button
- Related child (if applicable)
**Navigation from:** ActionItemCard

#### 5. MessagesListScreen
**Route:** `MessagesList`
**Params:** None
**Purpose:** View all communications
**Shows:**
- All messages
- Filter by priority/read status
- Search messages
- Compose button
**Navigation from:** "View All Messages" button

#### 6. MessageDetailScreen
**Route:** `MessageDetail`
**Params:** `{ messageId: string }`
**Purpose:** View single message
**Shows:**
- Full message content
- Sender info
- Date/time
- Attachments
- Reply button
- Mark read/unread
**Navigation from:** CommunicationCard

---

### PHASE 2: Financial Tab Screens (4 screens)

#### 7. PaymentHistoryScreen
**Route:** `PaymentHistory`
**Params:** None
**Purpose:** View all past payments
**Shows:**
- Payment history list
- Filter by date/status
- Download receipts
- Payment details
**Navigation from:** "View Details" in Financial section

#### 8. MakePaymentScreen
**Route:** `MakePayment`
**Params:** `{ amount?: number, description?: string }`
**Purpose:** Process payment
**Shows:**
- Payment amount
- Payment method selection
- Payment gateway integration
- Confirmation
**Navigation from:** "Make Payment" button
**Uses:** useBlockBack (prevent accidental exit)

#### 9. DiscountsScreen
**Route:** `Discounts`
**Params:** None
**Purpose:** View all discounts & benefits
**Shows:**
- Active discounts
- Discount details
- Validity period
- Terms & conditions
**Navigation from:** Discounts section

#### 10. FeeStructureScreen
**Route:** `FeeStructure`
**Params:** `{ studentId?: string }`
**Purpose:** View detailed fee breakdown
**Shows:**
- Fee components
- Academic year fees
- Per-term breakdown
- Comparison (if multiple children)
**Navigation from:** Financial summary

---

### PHASE 3: Academic Tab Screens (6 screens)

#### 11. SubjectDetailScreen
**Route:** `SubjectDetail`
**Params:** `{ studentId: string, subject: string }`
**Purpose:** Detailed subject performance
**Shows:**
- Grade trends (chart)
- All assessments
- Upcoming exams
- Study materials
- Teacher notes
**Navigation from:** Subject performance card

#### 12. AssignmentsListScreen
**Route:** `AssignmentsList`
**Params:** `{ studentId: string }`
**Purpose:** View all assignments
**Shows:**
- Pending assignments
- Completed assignments
- Overdue assignments
- Filter by subject
**Navigation from:** "View All Assignments"

#### 13. AssignmentDetailScreen
**Route:** `AssignmentDetail`
**Params:** `{ assignmentId: string }`
**Purpose:** View single assignment
**Shows:**
- Assignment details
- Due date
- Submission status
- Score (if graded)
- Teacher feedback
- Attachments
**Navigation from:** Assignment card

#### 14. UpcomingExamsScreen
**Route:** `UpcomingExams`
**Params:** `{ studentId?: string }`
**Purpose:** View all upcoming assessments
**Shows:**
- Exam schedule
- Subjects & topics
- Calendar view
- Countdown timers
- Study recommendations
**Navigation from:** "View All Assessments"

#### 15. AcademicReportsScreen
**Route:** `AcademicReports`
**Params:** `{ studentId: string }`
**Purpose:** Downloadable reports
**Shows:**
- Report cards
- Progress reports
- Attendance reports
- Download PDFs
**Navigation from:** Reports section

#### 16. StudyRecommendationsScreen
**Route:** `StudyRecommendations`
**Params:** `{ studentId: string }`
**Purpose:** Teacher recommendations
**Shows:**
- Recommended focus areas
- Study time estimates
- Priority subjects
- Resources
**Navigation from:** Recommendations section

---

### PHASE 4: Communication Tab Screens (5 screens)

#### 17. ComposeMessageScreen
**Route:** `ComposeMessage`
**Params:** `{ recipientId?: string, subject?: string }`
**Purpose:** Send message to teacher/admin
**Shows:**
- Recipient selection
- Subject & message
- Attach files
- Send button
**Navigation from:** "Compose Message" button
**Uses:** useBlockBack (prevent accidental exit)

#### 18. ScheduleMeetingScreen
**Route:** `ScheduleMeeting`
**Params:** `{ teacherId?: string }`
**Purpose:** Schedule parent-teacher meeting
**Shows:**
- Teacher selection
- Available slots
- Meeting type (in-person/virtual)
- Purpose/agenda
- Confirmation
**Navigation from:** "Schedule Meeting" button

#### 19. TeacherListScreen
**Route:** `TeacherList`
**Params:** `{ studentId?: string }`
**Purpose:** View all teachers
**Shows:**
- Student's teachers
- Teacher profiles
- Contact info
- Message/call buttons
**Navigation from:** "Contact Teachers"

#### 20. MeetingsHistoryScreen
**Route:** `MeetingsHistory`
**Params:** None
**Purpose:** Past & upcoming meetings
**Shows:**
- Scheduled meetings
- Past meetings
- Meeting notes
- Reschedule option
**Navigation from:** Meetings section

#### 21. NotificationsScreen
**Route:** `Notifications`
**Params:** None
**Purpose:** All notifications
**Shows:**
- All notifications
- Filter by type
- Mark all read
- Notification settings
**Navigation from:** Bell icon / "View All Notifications"

---

### PHASE 5: Info Tab Screens (5 screens)

#### 22. SchoolCalendarScreen
**Route:** `SchoolCalendar`
**Params:** None
**Purpose:** Academic calendar
**Shows:**
- Monthly calendar view
- Holidays
- Exam dates
- Events
- Export to device calendar
**Navigation from:** "Academic Calendar" button

#### 23. SchoolHandbookScreen
**Route:** `SchoolHandbook`
**Params:** None
**Purpose:** Student handbook
**Shows:**
- Handbook sections
- Search functionality
- Bookmarks
- Download PDF
**Navigation from:** "School Handbook" button

#### 24. StaffDirectoryScreen
**Route:** `StaffDirectory`
**Params:** None
**Purpose:** Complete staff directory
**Shows:**
- All staff members
- Search by name/department
- Contact info
- Office hours
- Quick call/email
**Navigation from:** "Staff Directory" button

#### 25. SchoolPoliciesScreen
**Route:** `SchoolPolicies`
**Params:** None
**Purpose:** School policies & rules
**Shows:**
- Policy categories
- Policy documents
- Search policies
- Download PDFs
**Navigation from:** "Policies & Rules" button

#### 26. AnnouncementsScreen
**Route:** `Announcements`
**Params:** None
**Purpose:** All school announcements
**Shows:**
- All announcements
- Filter by category
- Important announcements
- Search
**Navigation from:** "View All" in announcements

---

## 📊 Summary

**Total Screens Needed:** 36
- ✅ Already exist: 10 screens
- ❌ Need to create: 26 screens

**Screens by Phase:**
- Phase 1 (Overview): 6 new screens
- Phase 2 (Financial): 4 new screens
- Phase 3 (Academic): 6 new screens
- Phase 4 (Communication): 5 new screens
- Phase 5 (Info): 5 new screens

---

## 🏗️ Implementation Strategy

### Step 1: Create Placeholder Screens (Quick)
- Create all 26 screen files with basic structure
- Each screen uses BaseScreen wrapper
- Shows screen title + "Content coming in Phase X"
- Has proper navigation params validation
- All registered in ParentNavigator

### Step 2: Implement Per Phase (Systematic)
- Phase 1: Build 6 screens fully
- Phase 2: Build 4 screens fully
- Phase 3: Build 6 screens fully
- Phase 4: Build 5 screens fully
- Phase 5: Build 5 screens fully

### Template for Each Screen:
```tsx
/**
 * [ScreenName]Screen
 * [Purpose description]
 */

import React from 'react';
import { Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Col, T, Button, Spacer } from '../../ui';
import { trackAction } from '../../utils/navigationAnalytics';
import type { ParentStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ParentStackParamList, 'ScreenName'>;

const ScreenNameScreen: React.FC<Props> = ({ route, navigation }) => {
  // Track screen view
  React.useEffect(() => {
    trackAction('view_screen_name', 'ScreenName');
  }, []);

  // Get params with validation
  const params = route.params;

  return (
    <BaseScreen
      scrollable
      loading={false}
      error={null}
      empty={false}
    >
      <Col sx={{ p: 'xl' }}>
        <T variant="headline" weight="bold">Screen Title</T>
        <Spacer size="md" />
        <T variant="body" color="textSecondary">
          This screen will be implemented in Phase X
        </T>
        <Spacer size="md" />
        <Button
          variant="primary"
          onPress={() => navigation.goBack()}
        >
          Go Back
        </Button>
      </Col>
    </BaseScreen>
  );
};

export default ScreenNameScreen;
```

---

## 🎯 Next Actions

1. Create all 26 placeholder screen files
2. Add all screens to ParentNavigator
3. Update ParentStackParamList types
4. Wire up all navigation in NewParentDashboard
5. Test that all navigation works
6. Then implement phase-by-phase

**No more "Coming Soon" alerts - every button will navigate to a real screen!**

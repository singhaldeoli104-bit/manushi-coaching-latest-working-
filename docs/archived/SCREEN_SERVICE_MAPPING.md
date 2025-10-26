# SCREEN-TO-SERVICE MAPPING GUIDE
## Complete Reference for Frontend-Backend Integration

**Created:** 2025-10-21
**Purpose:** Map each frontend screen to its required backend services

---

## 📊 OVERVIEW

**Total Screens:** 45 core screens (from 109 in OLD folder, consolidated)
**Backend Services:** 13 service files
**Database Functions:** 47 functions
**Materialized Views:** 9 views

---

## 🔵 PARENT ROLE (10 SCREENS)

### 1. ParentDashboardScreen.tsx
**Backend Services:**
- `parentDashboardService.ts` → `getParentDashboard(parentId)`
- `parentDashboardService.ts` → `getChildrenSummary(parentId)`
- `parentDashboardService.ts` → `getActionItems(parentId, filters)`
- `parentFinancialService.ts` → `getFinancialSummary(parentId)`

**Database Functions:**
- `get_parent_dashboard_summary(parent_id)`
- `get_parent_children(parent_id)`
- `get_parent_financial_summary(parent_id)`

**Materialized Views:**
- `mv_parent_dashboard_summary`
- `mv_parent_financial_summary`

**API Hooks Needed:**
```typescript
useParentDashboard(parentId)
useChildrenSummary(parentId)
useActionItems(parentId, filters)
useFinancialSummary(parentId)
```

**Data Flow:**
```
Screen → Hook → Service → Supabase → Database Function/MV → Return Data
```

---

### 2. ChildProgressScreen.tsx
**Backend Services:**
- `studentProgressService.ts` → `getAcademicProgress(studentId)`
- `studentProgressService.ts` → `getAttendanceSummary(studentId)`
- `studentProgressService.ts` → `getSubjectAnalysis(studentId)`

**Database Functions:**
- `get_student_academic_summary(student_id)`
- `get_attendance_percentage(student_id, start_date, end_date)`
- `get_student_risk_assessment(student_id)`

**Materialized Views:**
- `mv_student_performance_summary`
- `mv_attendance_analytics`

**API Hooks Needed:**
```typescript
useAcademicProgress(studentId)
useAttendanceSummary(studentId)
useSubjectAnalysis(studentId)
useRiskAssessment(studentId)
```

**Tables Accessed:**
- `students`
- `academic_progress`
- `attendance`
- `gradebook`
- `behavior_trends`

---

### 3. FinancialDashboardScreen.tsx
**Backend Services:**
- `parentFinancialService.ts` → `getFinancialSummary(parentId)`
- `parentFinancialService.ts` → `getPaymentHistory(parentId)`
- `parentFinancialService.ts` → `getOutstandingInvoices(parentId)`
- `parentFinancialService.ts` → `createPayment(paymentData)`

**Database Functions:**
- `get_parent_financial_summary(parent_id)`
- `get_payment_summary_for_parent(parent_id)`
- `calculate_fee_balance(student_fee_id)`
- `calculate_gst(amount, rate)`

**Materialized Views:**
- `mv_parent_financial_summary`
- `mv_payment_analytics`

**API Hooks Needed:**
```typescript
useFinancialSummary(parentId)
usePaymentHistory(parentId)
useOutstandingInvoices(parentId)
useCreatePayment()
```

**Tables Accessed:**
- `payments`
- `invoices`
- `student_fees`
- `payment_transactions`
- `installments`

---

### 4. CommunicationScreen.tsx
**Backend Services:**
- `notificationService.ts` → `getNotifications(userId)`
- Custom chat service (needs creation)

**Database Functions:**
- `mark_room_messages_read(room_id, user_id)`

**API Hooks Needed:**
```typescript
useParentTeacherCommunications(parentId)
useSendMessage(recipientId, message)
useMarkMessageRead(messageId)
```

**Tables Accessed:**
- `parent_teacher_communications`
- `chat_rooms`
- `chat_messages`
- `message_read_receipts`

---

### 5. NotificationsScreen.tsx
**Backend Services:**
- `notificationService.ts` → `getNotifications(userId)`
- `notificationService.ts` → `markAsRead(notificationId)`
- `notificationService.ts` → `markAllAsRead(userId)`

**Database Functions:**
- `mark_all_notifications_read(user_id)`

**API Hooks Needed:**
```typescript
useNotifications(userId)
useMarkNotificationRead()
useMarkAllNotificationsRead()
```

**Tables Accessed:**
- `notifications`
- `user_notification_preferences`

---

### 6. ActionItemsScreen.tsx
**Backend Services:**
- `parentDashboardService.ts` → `getActionItems(parentId, filters)`
- `parentDashboardService.ts` → `updateActionItem(itemId, updates)`
- `parentDashboardService.ts` → `completeActionItem(itemId)`

**API Hooks Needed:**
```typescript
useActionItems(parentId, filters)
useUpdateActionItem()
useCompleteActionItem()
```

**Tables Accessed:**
- `parent_action_items`

---

### 7. AcademicScheduleScreen.tsx
**Backend Services:**
- Custom schedule service (needs creation)

**Database Functions:**
- `get_parent_upcoming_events(parent_id)`

**API Hooks Needed:**
```typescript
useUpcomingEvents(parentId)
useExamSchedule(studentId)
useClassSchedule(studentId)
```

**Tables Accessed:**
- `class_schedules`
- `exam_schedules`
- `live_sessions`
- `important_dates`

---

### 8. PerformanceAnalyticsScreen.tsx
**Backend Services:**
- `studentProgressService.ts` → `getAcademicProgress(studentId)`
- `studentProgressService.ts` → `getSubjectAnalysis(studentId)`

**Database Functions:**
- `get_student_academic_summary(student_id)`
- `get_student_rank(student_id, subject_id)`

**Materialized Views:**
- `mv_student_performance_summary`

**API Hooks Needed:**
```typescript
useAcademicProgress(studentId)
usePerformanceComparison(studentId)
useSubjectRankings(studentId)
```

**Tables Accessed:**
- `academic_progress`
- `academic_predictions`
- `gradebook`

---

### 9. MeetingScheduleScreen.tsx
**Backend Services:**
- Custom meeting service (needs creation)

**API Hooks Needed:**
```typescript
useAvailableSlots(teacherId)
useBookMeeting(meetingData)
useMeetings(parentId)
```

**Tables Accessed:**
- Custom `parent_teacher_meetings` table (needs creation)
- `teachers`
- `parents`

---

### 10. ParentSettingsScreen.tsx
**Backend Services:**
- Custom profile service (needs creation)

**API Hooks Needed:**
```typescript
useUpdateProfile(userId)
useNotificationPreferences(userId)
useUpdatePreferences()
```

**Tables Accessed:**
- `profiles`
- `parents`
- `parent_notification_preferences`

---

## 🟢 STUDENT ROLE (15 SCREENS)

### 1. StudentDashboardScreen.tsx
**Backend Services:**
- `studentDashboardService.ts` → `getStudentDashboard(studentId)`
- `studentDashboardService.ts` → `getUpcomingAssignments(studentId)`
- `studentDashboardService.ts` → `getTodayClasses(studentId)`
- `studentDashboardService.ts` → `getRecentGrades(studentId)`

**Database Functions:**
- `get_student_academic_summary(student_id)`
- `get_student_attendance_summary(student_id)`
- `calculate_student_gpa(student_id)`

**Materialized Views:**
- `mv_student_performance_summary`

**API Hooks Needed:**
```typescript
useStudentDashboard(studentId)
useUpcomingAssignments(studentId)
useTodayClasses(studentId)
useRecentGrades(studentId)
```

**Tables Accessed:**
- `students`
- `assignments`
- `class_schedules`
- `gradebook`
- `attendance`

---

### 2. AIStudyAssistantScreen.tsx
**Backend Services:**
- `aiStudyAssistantService.ts` → `getStudyPlans(studentId)`
- `aiStudyAssistantService.ts` → `getLearningAnalytics(studentId)`
- `aiStudyAssistantService.ts` → `getAIRecommendations(studentId)`
- `aiStudyAssistantService.ts` → `createStudyPlan(studentId, planData)`

**Database Functions:**
- `calculate_ai_insight_score(...)`

**API Hooks Needed:**
```typescript
useStudyPlans(studentId)
useLearningAnalytics(studentId)
useAIRecommendations(studentId)
useCreateStudyPlan()
useUpdateStudyProgress()
```

**Tables Accessed:**
- `study_plans`
- `learning_analytics`
- `ai_recommendations`
- `student_progress`

---

### 3. AssignmentListScreen.tsx
**Backend Services:**
- `studentAssignmentService.ts` → `getAssignments(studentId, filters)`
- `studentAssignmentService.ts` → `getUpcomingAssignments(studentId)`
- `studentAssignmentService.ts` → `getCompletedAssignments(studentId)`

**Database Functions:**
- `check_overdue_assignments()`

**API Hooks Needed:**
```typescript
useAssignments(studentId, filters)
useAssignmentStats(studentId)
```

**Tables Accessed:**
- `assignments`
- `assignment_submissions`

---

### 4. AssignmentDetailScreen.tsx
**Backend Services:**
- `studentAssignmentService.ts` → `getAssignment(assignmentId)`
- `studentAssignmentService.ts` → `submitAssignment(assignmentId, submission)`
- `studentAssignmentService.ts` → `getSubmissionStatus(assignmentId, studentId)`
- `fileUploadService.ts` → `uploadFile(bucket, path, file)`

**API Hooks Needed:**
```typescript
useAssignment(assignmentId)
useSubmitAssignment()
useSubmissionStatus(assignmentId, studentId)
useFileUpload()
```

**Tables Accessed:**
- `assignments`
- `assignment_questions`
- `assignment_submissions`
- `file_uploads`

---

### 5. LiveClassScreen.tsx
**Backend Services:**
- `realtimeService.ts` → `subscribeToChannel(channelId, callback)`
- Custom live class service (needs creation)

**Database Functions:**
- `update_user_heartbeat(user_id)`

**API Hooks Needed:**
```typescript
useLiveSession(sessionId)
useJoinSession(sessionId)
useRealtimeParticipants(sessionId)
useRealtimeChat(sessionId)
```

**Tables Accessed:**
- `live_sessions`
- `live_session_participants`
- `chat_messages`
- `user_presence`

---

### 6. ScheduleScreen.tsx
**Backend Services:**
- Custom schedule service

**API Hooks Needed:**
```typescript
useWeeklySchedule(studentId)
useClassDetails(classId)
useExamSchedule(studentId)
```

**Tables Accessed:**
- `class_schedules`
- `exam_schedules`
- `classes`

---

### 7. ProgressTrackingScreen.tsx
**Backend Services:**
- `studentProgressService.ts` → `getAcademicProgress(studentId)`
- `studentProgressService.ts` → `getSubjectAnalysis(studentId)`

**Database Functions:**
- `get_student_academic_summary(student_id)`
- `calculate_student_gpa(student_id)`

**Materialized Views:**
- `mv_student_performance_summary`

**API Hooks Needed:**
```typescript
useAcademicProgress(studentId)
useGradeHistory(studentId)
useSubjectProgress(studentId)
```

**Tables Accessed:**
- `academic_progress`
- `gradebook`
- `student_progress`

---

### 8. DoubtSubmissionScreen.tsx
**Backend Services:**
- Custom doubt service (needs creation)

**API Hooks Needed:**
```typescript
useSubmitDoubt(doubtData)
useDoubts(studentId)
useDoubtResponses(doubtId)
```

**Tables Accessed:**
- `doubts`
- `doubt_responses`
- `file_uploads`

---

### 9. StudyMaterialsScreen.tsx
**Backend Services:**
- Custom study materials service (needs creation)

**API Hooks Needed:**
```typescript
useStudyMaterials(subjectId, filters)
useDownloadMaterial(materialId)
useBookmarkMaterial(materialId)
```

**Tables Accessed:**
- `study_materials`
- `class_materials`
- `file_uploads`

---

### 10. GradesScreen.tsx
**Backend Services:**
- Custom grades service (needs creation)

**Database Functions:**
- `calculate_student_gpa(student_id)`

**API Hooks Needed:**
```typescript
useGradebook(studentId)
useGradesBySubject(studentId, subjectId)
useGradesByTerm(studentId, term)
```

**Tables Accessed:**
- `gradebook`

---

### 11. AttendanceScreen.tsx
**Backend Services:**
- Custom attendance service (needs creation)

**Database Functions:**
- `get_attendance_percentage(student_id, start_date, end_date)`

**Materialized Views:**
- `mv_attendance_analytics`

**API Hooks Needed:**
```typescript
useAttendanceHistory(studentId)
useAttendancePercentage(studentId)
useAttendanceCalendar(studentId, month)
```

**Tables Accessed:**
- `attendance`

---

### 12. NotificationsScreen.tsx
**Backend Services:**
- `notificationService.ts` (same as parent)

**API Hooks Needed:**
```typescript
useNotifications(userId)
useMarkNotificationRead()
```

**Tables Accessed:**
- `notifications`

---

### 13. ProfileScreen.tsx
**Backend Services:**
- Custom profile service

**API Hooks Needed:**
```typescript
useProfile(userId)
useUpdateProfile()
useUploadAvatar()
```

**Tables Accessed:**
- `profiles`
- `students`

---

### 14. ExamScheduleScreen.tsx
**Backend Services:**
- Custom exam service

**API Hooks Needed:**
```typescript
useExamSchedule(studentId)
useExamDetails(examId)
useExamReminders(studentId)
```

**Tables Accessed:**
- `exam_schedules`

---

### 15. AchievementsScreen.tsx
**Backend Services:**
- Custom achievement service (needs creation)

**API Hooks Needed:**
```typescript
useAchievements(studentId)
useBadges(studentId)
```

**Tables Accessed:**
- Custom `achievements` table (needs creation)
- Custom `badges` table (needs creation)

---

## 🟡 TEACHER ROLE (12 SCREENS)

### 1. TeacherDashboardScreen.tsx
**Backend Services:**
- `teacherDashboardService.ts` → `getTeacherDashboard(teacherId)`
- `teacherDashboardService.ts` → `getTeacherClasses(teacherId)`
- `teacherDashboardService.ts` → `getPendingGrading(teacherId)`

**Database Functions:**
- `get_teacher_workload(teacher_id)`

**Materialized Views:**
- `mv_teacher_dashboard_stats`
- `mv_teacher_class_overview`

**API Hooks Needed:**
```typescript
useTeacherDashboard(teacherId)
useTeacherClasses(teacherId)
usePendingGrading(teacherId)
useTeacherStats(teacherId)
```

**Tables Accessed:**
- `teachers`
- `classes`
- `assignments`
- `assignment_submissions`

---

### 2. ClassListScreen.tsx
**Backend Services:**
- `teacherDashboardService.ts` → `getTeacherClasses(teacherId)`

**API Hooks Needed:**
```typescript
useTeacherClasses(teacherId)
useClassDetails(classId)
```

**Tables Accessed:**
- `classes`
- `batches`
- `class_schedules`

---

### 3. ClassDetailScreen.tsx
**Backend Services:**
- Custom class service (needs creation)

**API Hooks Needed:**
```typescript
useClass(classId)
useClassStudents(classId)
useClassSchedule(classId)
useClassMaterials(classId)
```

**Tables Accessed:**
- `classes`
- `students`
- `teacher_student_assignments`
- `class_materials`

---

### 4. AttendanceTrackingScreen.tsx
**Backend Services:**
- Custom attendance service (needs creation)

**Database Functions:**
- `get_attendance_percentage(student_id, start_date, end_date)`

**API Hooks Needed:**
```typescript
useBulkMarkAttendance()
useAttendanceByClass(classId, date)
useAttendanceReport(classId, dateRange)
useAttendanceAlerts(teacherId)
```

**Tables Accessed:**
- `attendance`
- `attendance_alerts`
- `attendance_reports`

---

### 5. AssignmentCreatorScreen.tsx
**Backend Services:**
- Custom assignment creation service (needs creation)

**API Hooks Needed:**
```typescript
useCreateAssignment()
useCreateQuestion()
useCreateRubric()
useAssignmentTemplates(teacherId)
```

**Tables Accessed:**
- `assignments`
- `assignment_questions`
- `assignment_rubrics`
- `assignment_templates`

---

### 6. GradingScreen.tsx
**Backend Services:**
- Custom grading service (needs creation)

**API Hooks Needed:**
```typescript
usePendingSubmissions(teacherId)
useGradeSubmission()
useBulkGrade()
useApplyRubric()
```

**Tables Accessed:**
- `assignment_submissions`
- `gradebook`
- `assignment_rubrics`

---

### 7. LiveClassControlScreen.tsx
**Backend Services:**
- Custom live class service (needs creation)
- `realtimeService.ts`

**API Hooks Needed:**
```typescript
useStartSession()
useEndSession()
useSessionParticipants(sessionId)
useStartRecording()
useStopRecording()
```

**Tables Accessed:**
- `live_sessions`
- `live_session_participants`
- `session_recordings`

---

### 8. StudentProgressScreen.tsx
**Backend Services:**
- `studentProgressService.ts`

**Database Functions:**
- `get_student_academic_summary(student_id)`
- `get_student_risk_assessment(student_id)`

**API Hooks Needed:**
```typescript
useStudentProgress(studentId)
useStudentGrades(studentId)
useStudentAttendance(studentId)
useStudentRiskFactors(studentId)
```

**Tables Accessed:**
- `students`
- `academic_progress`
- `gradebook`
- `attendance`
- `risk_factors`

---

### 9. CommunicationHubScreen.tsx
**Backend Services:**
- `notificationService.ts`
- Custom communication service

**API Hooks Needed:**
```typescript
useParentMessages(teacherId)
useSendMessageToParent()
useAnnouncements(teacherId)
useCreateAnnouncement()
```

**Tables Accessed:**
- `parent_teacher_communications`
- `announcements`
- `chat_messages`

---

### 10. TeacherAnalyticsScreen.tsx
**Backend Services:**
- Custom analytics service (needs creation)

**Materialized Views:**
- `mv_teacher_class_overview`
- `mv_institutional_metrics`

**API Hooks Needed:**
```typescript
useClassPerformance(classId)
useStudentComparison(classId)
useSubjectAnalytics(teacherId, subjectId)
```

**Tables Accessed:**
- All academic tables

---

### 11. QuestionBankScreen.tsx
**Backend Services:**
- Custom question bank service (needs creation)

**API Hooks Needed:**
```typescript
useQuestions(filters)
useCreateQuestion()
useUpdateQuestion()
useImportQuestions()
```

**Tables Accessed:**
- `assignment_questions`
- Custom `question_bank` table (needs creation)

---

### 12. TeacherSettingsScreen.tsx
**Backend Services:**
- Custom profile service

**API Hooks Needed:**
```typescript
useProfile(userId)
useUpdateProfile()
useNotificationPreferences(userId)
```

**Tables Accessed:**
- `profiles`
- `teachers`

---

## 🔴 ADMIN ROLE (8 SCREENS)

### 1. AdminDashboardScreen.tsx
**Backend Services:**
- Custom admin service (needs creation)

**Materialized Views:**
- `mv_institutional_metrics`
- `mv_payment_analytics`
- `mv_notification_stats`

**API Hooks Needed:**
```typescript
useInstitutionalMetrics()
useUserStatistics()
useFinancialOverview()
useSystemHealth()
```

**Tables Accessed:**
- All tables (aggregated)

---

### 2. UserManagementScreen.tsx
**Backend Services:**
- Custom user management service (needs creation)

**API Hooks Needed:**
```typescript
useUsers(filters)
useCreateUser()
useUpdateUser()
useAssignRole()
useDeactivateUser()
```

**Tables Accessed:**
- `profiles`
- `users`
- `user_roles`
- `user_role_assignments`

---

### 3. FinancialManagementScreen.tsx
**Backend Services:**
- Custom financial management service

**Materialized Views:**
- `mv_payment_analytics`

**API Hooks Needed:**
```typescript
useRevenueMetrics()
usePaymentTracking()
useInvoiceManagement()
useFinancialReports()
```

**Tables Accessed:**
- `payments`
- `invoices`
- `payment_transactions`
- `financial_reconciliation`

---

### 4. AdminAnalyticsScreen.tsx
**Backend Services:**
- Custom analytics service

**Materialized Views:**
- `mv_institutional_metrics`

**API Hooks Needed:**
```typescript
useInstitutionalAnalytics()
usePredictiveAnalytics()
useExportReports()
```

**Tables Accessed:**
- All tables (for analytics)

---

### 5. SystemSettingsScreen.tsx
**Backend Services:**
- Custom settings service

**API Hooks Needed:**
```typescript
useSystemSettings()
useUpdateSettings()
useFeatureFlags()
useEmailTemplates()
```

**Tables Accessed:**
- Custom `system_settings` table
- Custom `feature_flags` table
- `notification_templates`

---

### 6. ContentManagementScreen.tsx
**Backend Services:**
- Custom content service

**API Hooks Needed:**
```typescript
useAnnouncements()
usePolicies()
useResources()
useCreateContent()
```

**Tables Accessed:**
- `announcements`
- `school_announcements`
- `school_policies`
- `educational_resources`

---

### 7. ReportsScreen.tsx
**Backend Services:**
- Custom reporting service

**API Hooks Needed:**
```typescript
useGenerateReport(reportType)
useScheduledReports()
useCustomReports()
```

**Tables Accessed:**
- All tables (depends on report)

---

### 8. AuditLogsScreen.tsx
**Backend Services:**
- Custom audit service

**API Hooks Needed:**
```typescript
useAuditLogs(filters)
useExportLogs()
```

**Tables Accessed:**
- Custom `audit_logs` table
- `user_activities`
- `payment_audit_logs`

---

## 🔧 SERVICES THAT NEED CREATION

Based on screen requirements, these services need to be created:

### 1. scheduleService.ts
**Functions:**
- `getWeeklySchedule(studentId)`
- `getClassSchedule(classId)`
- `getExamSchedule(studentId)`
- `getUpcomingEvents(userId)`

---

### 2. doubtService.ts
**Functions:**
- `getDoubts(studentId, filters)`
- `submitDoubt(doubtData)`
- `getDoubtResponses(doubtId)`
- `submitResponse(doubtId, response)`

---

### 3. studyMaterialsService.ts
**Functions:**
- `getMaterials(filters)`
- `downloadMaterial(materialId)`
- `bookmarkMaterial(userId, materialId)`

---

### 4. gradesService.ts
**Functions:**
- `getGradebook(studentId)`
- `getGradesBySubject(studentId, subjectId)`
- `getGradeHistory(studentId)`

---

### 5. attendanceService.ts
**Functions:**
- `markBulkAttendance(attendanceData[])`
- `getAttendanceHistory(studentId)`
- `getAttendanceReport(params)`
- `getAttendanceAlerts(teacherId)`

---

### 6. assignmentCreationService.ts
**Functions:**
- `createAssignment(assignmentData)`
- `createQuestion(questionData)`
- `createRubric(rubricData)`
- `getTemplates(teacherId)`

---

### 7. gradingService.ts
**Functions:**
- `gradeSubmission(submissionId, gradeData)`
- `bulkGrade(submissions[])`
- `applyRubric(submissionId, rubricId)`

---

### 8. liveClassService.ts
**Functions:**
- `startSession(sessionData)`
- `endSession(sessionId)`
- `joinSession(sessionId, userId)`
- `startRecording(sessionId)`
- `stopRecording(sessionId)`

---

### 9. communicationService.ts
**Functions:**
- `getParentTeacherComms(userId)`
- `sendMessage(recipientId, message)`
- `createAnnouncement(announcement)`

---

### 10. profileService.ts
**Functions:**
- `getProfile(userId)`
- `updateProfile(userId, updates)`
- `uploadAvatar(userId, file)`

---

### 11. adminService.ts
**Functions:**
- `getInstitutionalMetrics()`
- `getUserStatistics()`
- `getSystemHealth()`

---

### 12. userManagementService.ts
**Functions:**
- `getUsers(filters)`
- `createUser(userData)`
- `updateUser(userId, updates)`
- `assignRole(userId, roleId)`

---

## 📊 INTEGRATION PRIORITY ORDER

### Phase 1: Core Authentication & Dashboard (Week 1)
1. **AuthService** → Login/Logout screens
2. **ParentDashboardService** → Parent Dashboard
3. **StudentDashboardService** → Student Dashboard
4. **TeacherDashboardService** → Teacher Dashboard

### Phase 2: Academic Features (Week 2-3)
5. **AssignmentService** → Assignment list/detail
6. **GradesService** → Grades screens
7. **AttendanceService** → Attendance screens
8. **ProgressService** → Progress tracking

### Phase 3: Communication & Notifications (Week 4)
9. **NotificationService** → Notifications
10. **CommunicationService** → Chat/Messages
11. **StudyMaterialsService** → Study materials

### Phase 4: Advanced Features (Week 5)
12. **AIStudyAssistantService** → AI features
13. **LiveClassService** → Live classes
14. **ScheduleService** → Schedules

### Phase 5: Admin & Analytics (Week 6)
15. **AdminService** → Admin screens
16. **AnalyticsService** → Reports/Analytics

---

## 🎯 QUICK REFERENCE

### For Each Screen Implementation:

1. **Identify required services** (from this document)
2. **Check if service exists** (in src/services/)
3. **Create service if missing** (follow existing patterns)
4. **Create React Query hooks** (in src/api/hooks/)
5. **Build screen component** (using hooks)
6. **Test with real data**

### Example Implementation Flow:

```typescript
// 1. Service exists: src/services/parent/parentDashboardService.ts
export async function getParentDashboard(parentId: string): Promise<ParentDashboard> {
  // Implementation already exists
}

// 2. Create hook: src/api/hooks/useParentAPI.ts
export function useParentDashboard(parentId: string) {
  return useQuery({
    queryKey: ['parentDashboard', parentId],
    queryFn: () => getParentDashboard(parentId),
    enabled: !!parentId,
  });
}

// 3. Use in screen: src/screens/parent/ParentDashboardScreen.tsx
export const ParentDashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useParentDashboard(user?.id);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return (
    <ScrollView>
      {/* Render dashboard data */}
    </ScrollView>
  );
};
```

---

**Document Version:** 1.0
**Last Updated:** 2025-10-21
**Total Mappings:** 45 screens
**Status:** Ready for Implementation

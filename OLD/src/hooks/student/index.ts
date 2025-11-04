/**
 * Student Hooks - Barrel Export
 *
 * Centralized exports for all student-related hooks.
 *
 * Usage:
 * import {
 *   useStudentProgress,
 *   useStudentSchedule,
 *   useStudentAssignments,
 * } from '@/hooks/student';
 */

// Progress Hook
export {
  useStudentProgress,
  type StudentProgressData,
  type SubjectProgress,
  type TrendDataPoint,
} from './useStudentProgress';

// Schedule Hook
export {
  useStudentSchedule,
  type ScheduleItem,
  type ScheduleItemType,
  type DateRange,
} from './useStudentSchedule';

// Assignments Hook
export {
  useStudentAssignments,
  type StudentAssignment,
  type AssignmentStatus,
  type AssignmentPriority,
} from './useStudentAssignments';

// Doubts Hook
export {
  useStudentDoubts,
  type StudentDoubt,
  type DoubtAnswer,
  type DoubtStatus,
  type DoubtPriority,
} from './useStudentDoubts';

// Attendance Hook
export {
  useStudentAttendance,
  type StudentAttendanceData,
  type AttendanceRecord,
  type AttendanceStatus,
  type SubjectAttendance,
  type CalendarDayData,
  type WeeklyTrendData,
} from './useStudentAttendance';

// Notifications Hook
export {
  useStudentNotifications,
  type StudentNotification,
  type NotificationType,
  type NotificationPriority,
  type NotificationFilter,
} from './useStudentNotifications';

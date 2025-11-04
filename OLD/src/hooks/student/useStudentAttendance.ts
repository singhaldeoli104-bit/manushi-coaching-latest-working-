/**
 * useStudentAttendance Hook
 *
 * Fetches and calculates student attendance data with subject-wise breakdown and calendar view.
 *
 * Features:
 * - Overall attendance percentage
 * - Subject-wise attendance breakdown
 * - Monthly calendar data
 * - Attendance trends (weekly/monthly)
 * - React Query caching (10 minutes)
 *
 * @example
 * const { attendance, loading, error, refetch } = useStudentAttendance();
 *
 * if (loading) return <LoadingState />;
 * if (error) return <ErrorState />;
 *
 * return (
 *   <>
 *     <Text>Overall Attendance: {attendance.overall}%</Text>
 *     {attendance.bySubject.map(subject => (
 *       <Text key={subject.subject}>
 *         {subject.subject}: {subject.percentage}%
 *       </Text>
 *     ))}
 *     <Calendar data={attendance.calendar} />
 *   </>
 * );
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useStudent } from '../../context/StudentContext';

// Attendance Status
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

// Attendance Record
export interface AttendanceRecord {
  /** Unique record ID */
  id: string;

  /** Date of attendance (ISO string) */
  date: string;

  /** Subject name */
  subject: string;

  /** Class/session title */
  classTitle?: string;

  /** Attendance status */
  status: AttendanceStatus;

  /** Teacher/instructor name */
  teacher?: string;

  /** Time of class (HH:mm) */
  classTime?: string;

  /** Duration in minutes */
  duration?: number;

  /** Notes/remarks */
  notes?: string;

  /** Created timestamp */
  createdAt: string;
}

// Subject-wise Attendance
export interface SubjectAttendance {
  /** Subject name */
  subject: string;

  /** Total classes */
  totalClasses: number;

  /** Present count */
  present: number;

  /** Absent count */
  absent: number;

  /** Late count */
  late: number;

  /** Excused count */
  excused: number;

  /** Attendance percentage (0-100) */
  percentage: number;

  /** Subject color for charts */
  color?: string;
}

// Calendar Day Data
export interface CalendarDayData {
  /** Date (YYYY-MM-DD) */
  date: string;

  /** Overall status for the day */
  status: 'full' | 'partial' | 'absent' | 'none';

  /** Classes count for the day */
  classesCount: number;

  /** Present count */
  presentCount: number;

  /** Attendance records for the day */
  records: AttendanceRecord[];

  /** Percentage for the day */
  percentage: number;
}

// Weekly Trend Data
export interface WeeklyTrendData {
  /** Week label */
  week: string;

  /** Attendance percentage for the week */
  percentage: number;

  /** Present count */
  present: number;

  /** Total classes */
  total: number;
}

// Student Attendance Data
export interface StudentAttendanceData {
  /** Overall attendance percentage (0-100) */
  overall: number;

  /** Total classes attended */
  totalPresent: number;

  /** Total classes */
  totalClasses: number;

  /** Subject-wise attendance breakdown */
  bySubject: SubjectAttendance[];

  /** Monthly calendar data */
  calendar: CalendarDayData[];

  /** Weekly trend (last 4 weeks) */
  weeklyTrend: WeeklyTrendData[];

  /** Current month name */
  currentMonth: string;

  /** Absent days count (this month) */
  absentDays: number;

  /** Late days count (this month) */
  lateDays: number;

  /** Last updated timestamp */
  lastUpdated: string;
}

/**
 * Get first and last day of current month
 */
const getCurrentMonthRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

/**
 * Fetch student attendance from Supabase
 */
const fetchStudentAttendance = async (studentId: string): Promise<StudentAttendanceData> => {
  const { start, end } = getCurrentMonthRange();

  // Fetch attendance records for current month (only select needed columns)
  const { data: records, error } = await supabase
    .from('attendance')
    .select('id, date, subject, class_title, status, teacher, class_time, duration, notes, created_at')
    .eq('student_id', studentId)
    .gte('date', start.toISOString())
    .lte('date', end.toISOString())
    .order('date', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch attendance: ${error.message}`);
  }

  const attendanceRecords: AttendanceRecord[] = (records || []).map((record) => ({
    id: record.id,
    date: record.date,
    subject: record.subject || 'General',
    classTitle: record.class_title,
    status: record.status as AttendanceStatus,
    teacher: record.teacher,
    classTime: record.class_time,
    duration: record.duration,
    notes: record.notes,
    createdAt: record.created_at,
  }));

  // Calculate overall attendance
  const totalClasses = attendanceRecords.length;
  const totalPresent = attendanceRecords.filter(
    (r) => r.status === 'present' || r.status === 'late'
  ).length;
  const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

  // Calculate subject-wise attendance
  const subjectMap = new Map<
    string,
    { present: number; absent: number; late: number; excused: number; total: number }
  >();

  attendanceRecords.forEach((record) => {
    const subject = record.subject;
    const current = subjectMap.get(subject) || { present: 0, absent: 0, late: 0, excused: 0, total: 0 };

    current.total += 1;

    switch (record.status) {
      case 'present':
        current.present += 1;
        break;
      case 'absent':
        current.absent += 1;
        break;
      case 'late':
        current.late += 1;
        break;
      case 'excused':
        current.excused += 1;
        break;
    }

    subjectMap.set(subject, current);
  });

  const bySubject: SubjectAttendance[] = Array.from(subjectMap.entries()).map(([subject, data]) => {
    const presentCount = data.present + data.late; // Late is counted as present
    const percentage = data.total > 0 ? Math.round((presentCount / data.total) * 100) : 0;

    return {
      subject,
      totalClasses: data.total,
      present: data.present,
      absent: data.absent,
      late: data.late,
      excused: data.excused,
      percentage,
    };
  });

  // Generate monthly calendar data
  const calendar: CalendarDayData[] = [];
  const daysInMonth = end.getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(start.getFullYear(), start.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];

    const dayRecords = attendanceRecords.filter((r) => r.date.split('T')[0] === dateStr);

    const classesCount = dayRecords.length;
    const presentCount = dayRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
    const percentage = classesCount > 0 ? Math.round((presentCount / classesCount) * 100) : 0;

    let status: 'full' | 'partial' | 'absent' | 'none';
    if (classesCount === 0) {
      status = 'none';
    } else if (percentage === 100) {
      status = 'full';
    } else if (percentage > 0) {
      status = 'partial';
    } else {
      status = 'absent';
    }

    calendar.push({
      date: dateStr,
      status,
      classesCount,
      presentCount,
      records: dayRecords,
      percentage,
    });
  }

  // Calculate weekly trend (last 4 weeks)
  const weeklyTrend: WeeklyTrendData[] = [];
  const now = new Date();

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - i * 7);
    weekEnd.setHours(23, 59, 59, 999);

    const weekRecords = attendanceRecords.filter((r) => {
      const recordDate = new Date(r.date);
      return recordDate >= weekStart && recordDate < weekEnd;
    });

    const weekTotal = weekRecords.length;
    const weekPresent = weekRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
    const weekPercentage = weekTotal > 0 ? Math.round((weekPresent / weekTotal) * 100) : 0;

    weeklyTrend.push({
      week: `Week ${4 - i}`,
      percentage: weekPercentage,
      present: weekPresent,
      total: weekTotal,
    });
  }

  // Calculate absent and late days for current month
  const absentDays = calendar.filter((day) => day.status === 'absent').length;
  const lateDays = attendanceRecords.filter((r) => r.status === 'late').length;

  return {
    overall: overallPercentage,
    totalPresent,
    totalClasses,
    bySubject,
    calendar,
    weeklyTrend,
    currentMonth: start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    absentDays,
    lateDays,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Hook to fetch and manage student attendance data
 *
 * @returns Attendance data with loading and error states
 */
export const useStudentAttendance = () => {
  const { student } = useStudent();
  const studentId = student?.id;

  const {
    data: attendance,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<StudentAttendanceData, Error>({
    queryKey: ['studentAttendance', studentId],
    queryFn: () => fetchStudentAttendance(studentId!),
    enabled: !!studentId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  return {
    attendance: attendance || null,
    loading,
    error: error as Error | null,
    refetch,
  };
};

export default useStudentAttendance;

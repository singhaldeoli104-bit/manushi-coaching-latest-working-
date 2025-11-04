/**
 * useStudentProgress Hook
 *
 * Fetches and calculates student progress metrics including:
 * - Overall progress percentage
 * - Subject-wise progress
 * - Weekly/monthly trends
 *
 * Uses React Query for caching and automatic refetching.
 *
 * @example
 * const { progress, loading, error, refetch } = useStudentProgress();
 *
 * if (loading) return <LoadingState />;
 * if (error) return <ErrorState />;
 *
 * return (
 *   <>
 *     <Text>Overall: {progress.overall}%</Text>
 *     {progress.bySubject.map(s => (
 *       <Text key={s.subject}>{s.subject}: {s.percentage}%</Text>
 *     ))}
 *   </>
 * );
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useStudent } from '../../context/StudentContext';

// Subject Progress
export interface SubjectProgress {
  /** Subject name */
  subject: string;

  /** Completed items */
  completed: number;

  /** Total items */
  total: number;

  /** Progress percentage (0-100) */
  percentage: number;

  /** Subject color for charts */
  color?: string;
}

// Trend Data Point
export interface TrendDataPoint {
  /** Date/period label */
  label: string;

  /** Progress value */
  value: number;

  /** ISO date string */
  date: string;
}

// Student Progress Data
export interface StudentProgressData {
  /** Overall progress percentage (0-100) */
  overall: number;

  /** Progress by subject */
  bySubject: SubjectProgress[];

  /** Weekly trend (last 7 days) */
  weeklyTrend: TrendDataPoint[];

  /** Monthly trend (last 30 days) */
  monthlyTrend: TrendDataPoint[];

  /** Total assignments completed */
  assignmentsCompleted: number;

  /** Total assignments */
  totalAssignments: number;

  /** Total quizzes completed */
  quizzesCompleted: number;

  /** Total quizzes */
  totalQuizzes: number;

  /** Last updated timestamp */
  lastUpdated: string;
}

/**
 * Fetch student progress from Supabase
 */
const fetchStudentProgress = async (studentId: string): Promise<StudentProgressData> => {
  // Fetch assignments progress
  const { data: assignments, error: assignmentsError } = await supabase
    .from('assignments')
    .select('id, subject, status, submitted_at, created_at')
    .eq('student_id', studentId);

  if (assignmentsError) {
    throw new Error(`Failed to fetch assignments: ${assignmentsError.message}`);
  }

  // Fetch quizzes progress
  const { data: quizzes, error: quizzesError } = await supabase
    .from('quizzes')
    .select('id, subject, status, completed_at, created_at')
    .eq('student_id', studentId);

  if (quizzesError) {
    throw new Error(`Failed to fetch quizzes: ${quizzesError.message}`);
  }

  // Calculate overall progress
  const totalItems = (assignments?.length || 0) + (quizzes?.length || 0);
  const completedItems =
    (assignments?.filter((a) => a.status === 'completed' || a.status === 'graded').length || 0) +
    (quizzes?.filter((q) => q.status === 'completed').length || 0);

  const overallPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Calculate subject-wise progress
  const subjectMap = new Map<string, { completed: number; total: number }>();

  // Process assignments
  assignments?.forEach((assignment) => {
    const subject = assignment.subject || 'General';
    const current = subjectMap.get(subject) || { completed: 0, total: 0 };
    current.total += 1;
    if (assignment.status === 'completed' || assignment.status === 'graded') {
      current.completed += 1;
    }
    subjectMap.set(subject, current);
  });

  // Process quizzes
  quizzes?.forEach((quiz) => {
    const subject = quiz.subject || 'General';
    const current = subjectMap.get(subject) || { completed: 0, total: 0 };
    current.total += 1;
    if (quiz.status === 'completed') {
      current.completed += 1;
    }
    subjectMap.set(subject, current);
  });

  const bySubject: SubjectProgress[] = Array.from(subjectMap.entries()).map(([subject, data]) => ({
    subject,
    completed: data.completed,
    total: data.total,
    percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
  }));

  // Calculate weekly trend (last 7 days)
  const weeklyTrend: TrendDataPoint[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const dateStr = date.toISOString().split('T')[0];

    const completedOnDate =
      (assignments?.filter((a) => {
        const submittedDate = a.submitted_at ? new Date(a.submitted_at).toISOString().split('T')[0] : null;
        return submittedDate === dateStr && (a.status === 'completed' || a.status === 'graded');
      }).length || 0) +
      (quizzes?.filter((q) => {
        const completedDate = q.completed_at ? new Date(q.completed_at).toISOString().split('T')[0] : null;
        return completedDate === dateStr && q.status === 'completed';
      }).length || 0);

    weeklyTrend.push({
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      value: completedOnDate,
      date: dateStr,
    });
  }

  // Calculate monthly trend (last 30 days, weekly buckets)
  const monthlyTrend: TrendDataPoint[] = [];

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - i * 7);

    const completedInWeek =
      (assignments?.filter((a) => {
        if (!a.submitted_at || a.status !== 'completed' && a.status !== 'graded') return false;
        const date = new Date(a.submitted_at);
        return date >= weekStart && date < weekEnd;
      }).length || 0) +
      (quizzes?.filter((q) => {
        if (!q.completed_at || q.status !== 'completed') return false;
        const date = new Date(q.completed_at);
        return date >= weekStart && date < weekEnd;
      }).length || 0);

    monthlyTrend.push({
      label: `Week ${4 - i}`,
      value: completedInWeek,
      date: weekStart.toISOString().split('T')[0],
    });
  }

  return {
    overall: overallPercentage,
    bySubject,
    weeklyTrend,
    monthlyTrend,
    assignmentsCompleted: assignments?.filter((a) => a.status === 'completed' || a.status === 'graded').length || 0,
    totalAssignments: assignments?.length || 0,
    quizzesCompleted: quizzes?.filter((q) => q.status === 'completed').length || 0,
    totalQuizzes: quizzes?.length || 0,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Hook to fetch and manage student progress data
 *
 * @returns Student progress data with loading and error states
 */
export const useStudentProgress = () => {
  const { student } = useStudent();
  const studentId = student?.id;

  const {
    data: progress,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<StudentProgressData, Error>({
    queryKey: ['studentProgress', studentId],
    queryFn: () => fetchStudentProgress(studentId!),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    progress: progress || null,
    loading,
    error: error as Error | null,
    refetch,
  };
};

export default useStudentProgress;

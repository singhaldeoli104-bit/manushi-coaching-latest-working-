/**
 * useStudentAssignments Hook
 *
 * Fetches and manages student assignments with status filtering and due date tracking.
 *
 * Features:
 * - Filter by status (pending, submitted, graded, overdue)
 * - Calculate days until due date
 * - Sort by due date (ascending - most urgent first)
 * - React Query caching (3 minutes)
 * - TypeScript type safety
 *
 * @example
 * const { assignments, loading, error, refetch } = useStudentAssignments();
 *
 * // With status filter
 * const { assignments } = useStudentAssignments('pending');
 *
 * if (loading) return <LoadingState />;
 * if (error) return <ErrorState />;
 *
 * return assignments.map(assignment => (
 *   <Card key={assignment.id}>
 *     <Text>{assignment.title}</Text>
 *     <Text>{assignment.daysUntilDue} days remaining</Text>
 *   </Card>
 * ));
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useStudent } from '../../context/StudentContext';

// Assignment Status
export type AssignmentStatus = 'pending' | 'submitted' | 'graded' | 'overdue';

// Assignment Priority (based on due date)
export type AssignmentPriority = 'urgent' | 'high' | 'medium' | 'low';

// Assignment Data
export interface StudentAssignment {
  /** Unique assignment ID */
  id: string;

  /** Assignment title */
  title: string;

  /** Assignment description */
  description?: string;

  /** Subject name */
  subject: string;

  /** Teacher/instructor name */
  teacher?: string;

  /** Due date (ISO string) */
  dueDate: string;

  /** Submission date (ISO string) */
  submittedAt?: string;

  /** Graded date (ISO string) */
  gradedAt?: string;

  /** Assignment status */
  status: AssignmentStatus;

  /** Grade/score received */
  grade?: number;

  /** Maximum possible grade */
  maxGrade?: number;

  /** Teacher's feedback */
  feedback?: string;

  /** Attachment URLs */
  attachments?: string[];

  /** Submission URL */
  submissionUrl?: string;

  /** Days until due (negative if overdue) */
  daysUntilDue: number;

  /** Priority level based on due date */
  priority: AssignmentPriority;

  /** Is overdue */
  isOverdue: boolean;

  /** Is due today */
  isDueToday: boolean;

  /** Is due this week */
  isDueThisWeek: boolean;

  /** Created timestamp */
  createdAt: string;

  /** Updated timestamp */
  updatedAt?: string;
}

/**
 * Calculate days until due date
 */
const calculateDaysUntilDue = (dueDate: string): number => {
  const now = new Date();
  const due = new Date(dueDate);

  // Set both to midnight for accurate day calculation
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Determine priority based on days until due
 */
const calculatePriority = (daysUntilDue: number, status: string): AssignmentPriority => {
  // Already submitted or graded - low priority
  if (status === 'submitted' || status === 'graded') {
    return 'low';
  }

  // Overdue - urgent
  if (daysUntilDue < 0) {
    return 'urgent';
  }

  // Due today or tomorrow - urgent
  if (daysUntilDue <= 1) {
    return 'urgent';
  }

  // Due within 3 days - high
  if (daysUntilDue <= 3) {
    return 'high';
  }

  // Due within a week - medium
  if (daysUntilDue <= 7) {
    return 'medium';
  }

  // More than a week - low
  return 'low';
};

/**
 * Determine actual status (mark as overdue if past due date)
 */
const determineStatus = (
  rawStatus: string,
  dueDate: string,
  submittedAt?: string
): AssignmentStatus => {
  // If already submitted or graded, return that status
  if (rawStatus === 'submitted' || rawStatus === 'graded') {
    return rawStatus as AssignmentStatus;
  }

  // Check if overdue (past due date and not submitted)
  const now = new Date();
  const due = new Date(dueDate);

  if (now > due && !submittedAt) {
    return 'overdue';
  }

  return 'pending';
};

/**
 * Fetch student assignments from Supabase
 */
const fetchStudentAssignments = async (
  studentId: string,
  statusFilter?: AssignmentStatus
): Promise<StudentAssignment[]> => {
  let query = supabase
    .from('assignments')
    .select('id, title, description, subject, teacher, due_date, submitted_at, graded_at, status, grade, max_grade, feedback, attachments, submission_url, created_at, updated_at')
    .eq('student_id', studentId);

  // Apply status filter if provided
  if (statusFilter) {
    if (statusFilter === 'overdue') {
      // For overdue, we need to filter on client side after fetching
      // because status might be stored as 'pending' in DB
    } else {
      query = query.eq('status', statusFilter);
    }
  }

  const { data: rawAssignments, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch assignments: ${error.message}`);
  }

  if (!rawAssignments || rawAssignments.length === 0) {
    return [];
  }

  // Transform and enrich assignments
  const assignments: StudentAssignment[] = rawAssignments
    .map((assignment) => {
      const daysUntilDue = calculateDaysUntilDue(assignment.due_date);
      const actualStatus = determineStatus(
        assignment.status,
        assignment.due_date,
        assignment.submitted_at
      );
      const priority = calculatePriority(daysUntilDue, actualStatus);

      return {
        id: assignment.id,
        title: assignment.title || 'Untitled Assignment',
        description: assignment.description,
        subject: assignment.subject || 'General',
        teacher: assignment.teacher,
        dueDate: assignment.due_date,
        submittedAt: assignment.submitted_at,
        gradedAt: assignment.graded_at,
        status: actualStatus,
        grade: assignment.grade,
        maxGrade: assignment.max_grade || 100,
        feedback: assignment.feedback,
        attachments: assignment.attachments || [],
        submissionUrl: assignment.submission_url,
        daysUntilDue,
        priority,
        isOverdue: daysUntilDue < 0 && actualStatus !== 'submitted' && actualStatus !== 'graded',
        isDueToday: daysUntilDue === 0,
        isDueThisWeek: daysUntilDue >= 0 && daysUntilDue <= 7,
        createdAt: assignment.created_at,
        updatedAt: assignment.updated_at,
      };
    })
    .filter((assignment) => {
      // Apply overdue filter if requested
      if (statusFilter === 'overdue') {
        return assignment.isOverdue;
      }
      return true;
    });

  // Sort by due date ascending (most urgent first)
  assignments.sort((a, b) => {
    // Overdue items first
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;

    // Then by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return assignments;
};

/**
 * Hook to fetch and manage student assignments
 *
 * @param statusFilter - Optional status filter (pending, submitted, graded, overdue)
 * @returns Assignments with loading and error states
 */
export const useStudentAssignments = (statusFilter?: AssignmentStatus) => {
  const { student } = useStudent();
  const studentId = student?.id;

  const {
    data: assignments,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<StudentAssignment[], Error>({
    queryKey: ['studentAssignments', studentId, statusFilter],
    queryFn: () => fetchStudentAssignments(studentId!, statusFilter),
    enabled: !!studentId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Calculate statistics
  const stats = {
    total: assignments?.length || 0,
    pending: assignments?.filter((a) => a.status === 'pending').length || 0,
    submitted: assignments?.filter((a) => a.status === 'submitted').length || 0,
    graded: assignments?.filter((a) => a.status === 'graded').length || 0,
    overdue: assignments?.filter((a) => a.isOverdue).length || 0,
    dueToday: assignments?.filter((a) => a.isDueToday).length || 0,
    dueThisWeek: assignments?.filter((a) => a.isDueThisWeek).length || 0,
  };

  return {
    assignments: assignments || [],
    loading,
    error: error as Error | null,
    refetch,
    stats,
  };
};

export default useStudentAssignments;

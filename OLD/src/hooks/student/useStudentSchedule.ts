/**
 * useStudentSchedule Hook
 *
 * Fetches student schedule including classes, assignments, and events.
 * Includes real-time subscription for schedule updates.
 *
 * Features:
 * - Filter by date range (today, this week, this month)
 * - Sort by date/time ascending
 * - Real-time updates via Supabase subscription
 * - React Query caching (2 minutes)
 *
 * @example
 * const { schedule, loading, error, refetch } = useStudentSchedule('today');
 *
 * if (loading) return <LoadingState />;
 * if (error) return <ErrorState />;
 *
 * return schedule.map(item => (
 *   <Card key={item.id}>
 *     <Text>{item.title} at {item.time}</Text>
 *   </Card>
 * ));
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useStudent } from '../../context/StudentContext';

// Schedule Item Type
export type ScheduleItemType = 'class' | 'assignment' | 'event' | 'exam';

// Date Range Filter
export type DateRange = 'today' | 'week' | 'month' | 'all';

// Schedule Item
export interface ScheduleItem {
  /** Unique item ID */
  id: string;

  /** Item type */
  type: ScheduleItemType;

  /** Item title */
  title: string;

  /** Item description */
  description?: string;

  /** Subject (for classes/assignments) */
  subject?: string;

  /** Start date/time */
  startTime: string;

  /** End date/time */
  endTime?: string;

  /** Location (for classes/events) */
  location?: string;

  /** Status (upcoming, ongoing, completed, cancelled) */
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

  /** Teacher/instructor name */
  instructor?: string;

  /** Additional metadata */
  metadata?: Record<string, any>;

  /** Created timestamp */
  createdAt: string;
}

/**
 * Get date range filter boundaries
 */
const getDateRangeBoundaries = (range: DateRange): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  switch (range) {
    case 'today':
      // Today only
      break;

    case 'week':
      // This week (Sunday to Saturday)
      start.setDate(now.getDate() - now.getDay());
      end.setDate(start.getDate() + 6);
      break;

    case 'month':
      // This month
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0); // Last day of month
      break;

    case 'all':
      // All future items
      start.setFullYear(now.getFullYear() - 1); // 1 year back
      end.setFullYear(now.getFullYear() + 1); // 1 year ahead
      break;
  }

  return { start, end };
};

/**
 * Fetch student schedule from Supabase
 */
const fetchStudentSchedule = async (
  studentId: string,
  range: DateRange
): Promise<ScheduleItem[]> => {
  const { start, end } = getDateRangeBoundaries(range);

  // Fetch classes (only select needed columns)
  const { data: classes, error: classesError } = await supabase
    .from('classes')
    .select('id, title, subject, description, start_time, end_time, location, status, instructor, created_at')
    .eq('student_id', studentId)
    .gte('start_time', start.toISOString())
    .lte('start_time', end.toISOString())
    .order('start_time', { ascending: true });

  if (classesError) {
    throw new Error(`Failed to fetch classes: ${classesError.message}`);
  }

  // Fetch assignments (only select needed columns)
  const { data: assignments, error: assignmentsError } = await supabase
    .from('assignments')
    .select('id, title, description, subject, due_date, status, teacher, created_at')
    .eq('student_id', studentId)
    .gte('due_date', start.toISOString())
    .lte('due_date', end.toISOString())
    .order('due_date', { ascending: true });

  if (assignmentsError) {
    throw new Error(`Failed to fetch assignments: ${assignmentsError.message}`);
  }

  // Fetch events (only select needed columns)
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('id, title, description, event_date, end_date, location, status, created_at')
    .eq('student_id', studentId)
    .gte('event_date', start.toISOString())
    .lte('event_date', end.toISOString())
    .order('event_date', { ascending: true });

  if (eventsError) {
    throw new Error(`Failed to fetch events: ${eventsError.message}`);
  }

  // Transform and combine all schedule items
  const scheduleItems: ScheduleItem[] = [];

  // Add classes
  classes?.forEach((cls) => {
    scheduleItems.push({
      id: cls.id,
      type: 'class',
      title: cls.title || cls.subject || 'Class',
      description: cls.description,
      subject: cls.subject,
      startTime: cls.start_time,
      endTime: cls.end_time,
      location: cls.location,
      status: cls.status || 'upcoming',
      instructor: cls.instructor,
      createdAt: cls.created_at,
    });
  });

  // Add assignments
  assignments?.forEach((assignment) => {
    scheduleItems.push({
      id: assignment.id,
      type: 'assignment',
      title: assignment.title || 'Assignment',
      description: assignment.description,
      subject: assignment.subject,
      startTime: assignment.due_date,
      endTime: assignment.due_date,
      status: assignment.status === 'pending' ? 'upcoming' : 'completed',
      instructor: assignment.teacher,
      createdAt: assignment.created_at,
    });
  });

  // Add events
  events?.forEach((event) => {
    scheduleItems.push({
      id: event.id,
      type: 'event',
      title: event.title || 'Event',
      description: event.description,
      startTime: event.event_date,
      endTime: event.end_date,
      location: event.location,
      status: event.status || 'upcoming',
      createdAt: event.created_at,
    });
  });

  // Sort by start time
  scheduleItems.sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  return scheduleItems;
};

/**
 * Hook to fetch and manage student schedule with real-time updates
 *
 * @param range - Date range filter (today, week, month, all)
 * @returns Schedule items with loading and error states
 */
export const useStudentSchedule = (range: DateRange = 'week') => {
  const { student } = useStudent();
  const studentId = student?.id;
  const queryClient = useQueryClient();

  const {
    data: schedule,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ScheduleItem[], Error>({
    queryKey: ['studentSchedule', studentId, range],
    queryFn: () => fetchStudentSchedule(studentId!, range),
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Real-time subscription for schedule updates
  useEffect(() => {
    if (!studentId) return;

    // Subscribe to classes changes
    const classesSubscription = supabase
      .channel('classes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'classes',
          filter: `student_id=eq.${studentId}`,
        },
        () => {
          // Invalidate and refetch schedule
          queryClient.invalidateQueries({ queryKey: ['studentSchedule', studentId, range] });
        }
      )
      .subscribe();

    // Subscribe to assignments changes
    const assignmentsSubscription = supabase
      .channel('assignments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assignments',
          filter: `student_id=eq.${studentId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['studentSchedule', studentId, range] });
        }
      )
      .subscribe();

    // Subscribe to events changes
    const eventsSubscription = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `student_id=eq.${studentId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['studentSchedule', studentId, range] });
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      classesSubscription.unsubscribe();
      assignmentsSubscription.unsubscribe();
      eventsSubscription.unsubscribe();
    };
  }, [studentId, range, queryClient]);

  return {
    schedule: schedule || [],
    loading,
    error: error as Error | null,
    refetch,
  };
};

export default useStudentSchedule;

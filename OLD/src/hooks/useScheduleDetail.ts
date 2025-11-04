/**
 * useScheduleDetail Hook
 *
 * Manages schedule data with Supabase integration
 * Merges classes + assignments and provides derived buckets
 *
 * Returns:
 * - scheduleState: { currentView, focusedDate, visibleRange, filters }
 * - events: Merged classes + assignment deadlines
 * - summary: { classesToday, studyMinutes, dueSoonCount, attendanceRate }
 * - reminders: Assignment deadlines, tasks, study blocks
 * - actions: loadSchedule, selectDate, setView, setFilter
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getClassesByDateRange } from '../services/classesService';
import { getStudentAssignments } from '../services/assignmentsService';

export interface ScheduleEvent {
  id: string;
  title: string;
  type: 'class' | 'deadline' | 'task' | 'study-block';
  subject: string;
  start: Date;
  end: Date;
  location?: string;
  teacher?: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  isDeadline: boolean;
  joinUrl?: string;
  color: string;
}

export interface ScheduleSummary {
  classesToday: number;
  studyMinutes: number;
  dueSoonCount: number;
  attendanceRate: string;
}

export interface ScheduleReminder {
  id: string;
  title: string;
  dueDate: Date;
  type: 'assignment' | 'task' | 'meeting';
  actionLabel: string;
}

export interface ScheduleFilters {
  subjects: string[];
  status: string[];
  type: string[];
}

export interface CalendarState {
  currentView: 'day' | 'week' | 'month';
  focusedDate: Date;
  visibleRange: { start: Date; end: Date };
  filters: ScheduleFilters;
}

interface UseScheduleDetailReturn {
  // State
  scheduleState: CalendarState;
  events: ScheduleEvent[];
  summary: ScheduleSummary;
  reminders: ScheduleReminder[];

  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;

  // Actions
  loadSchedule: () => Promise<void>;
  selectDate: (date: Date) => void;
  setView: (view: 'day' | 'week' | 'month') => void;
  setFilter: (filterType: keyof ScheduleFilters, values: string[]) => void;
  refresh: () => Promise<void>;
  navigateWeek: (direction: 'next' | 'previous') => void;
  jumpToToday: () => void;
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#6366F1',
  Physics: '#10B981',
  Chemistry: '#F59E0B',
  Biology: '#EF4444',
  English: '#8B5CF6',
  History: '#F97316',
  default: '#6366F1',
};

export const useScheduleDetail = (
  userId: string | undefined,
  role: 'student' | 'teacher' = 'student'
): UseScheduleDetailReturn => {
  // State
  const [scheduleState, setScheduleState] = useState<CalendarState>({
    currentView: 'week',
    focusedDate: new Date(),
    visibleRange: getWeekRange(new Date()),
    filters: {
      subjects: [],
      status: [],
      type: [],
    },
  });

  const [rawClasses, setRawClasses] = useState<any[]>([]);
  const [rawAssignments, setRawAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load schedule data
  const loadSchedule = useCallback(async () => {
    if (!userId) {
      console.log('[useScheduleDetail] No user ID');
      setIsLoading(false);
      return;
    }

    try {
      setError(null);

      // Fetch classes
      const classesResult = await getClassesByDateRange(
        userId,
        role,
        scheduleState.visibleRange.start,
        scheduleState.visibleRange.end
      );

      if (classesResult.success && classesResult.data) {
        setRawClasses(classesResult.data);
      }

      // Fetch assignments
      const assignmentsResult = await getStudentAssignments(userId);
      if (assignmentsResult.success && assignmentsResult.data) {
        setRawAssignments(assignmentsResult.data);
      }

      console.log('✅ [useScheduleDetail] Schedule data loaded');
    } catch (err) {
      console.error('[useScheduleDetail] Error:', err);
      setError(err instanceof Error ? err : new Error('Failed to load schedule'));
    } finally {
      setIsLoading(false);
    }
  }, [userId, role, scheduleState.visibleRange]);

  // Refresh handler
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadSchedule();
    setIsRefreshing(false);
  }, [loadSchedule]);

  // Load on mount and when range changes
  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  // Transform raw classes to events
  const events = useMemo<ScheduleEvent[]>(() => {
    const eventList: ScheduleEvent[] = [];

    // Transform classes
    rawClasses.forEach((cls) => {
      const scheduledTime = new Date(cls.scheduled_at);
      const endTime = new Date(scheduledTime.getTime() + (cls.duration_minutes || 60) * 60000);
      const now = new Date();

      let status: 'upcoming' | 'live' | 'completed' | 'cancelled' = 'upcoming';
      if (cls.status === 'cancelled') {
        status = 'cancelled';
      } else if (now >= scheduledTime && now <= endTime) {
        status = 'live';
      } else if (now > endTime) {
        status = 'completed';
      }

      eventList.push({
        id: cls.id,
        title: cls.subject,
        type: 'class',
        subject: cls.subject,
        start: scheduledTime,
        end: endTime,
        location: cls.meeting_link || 'Virtual Room',
        teacher: cls.teacher?.full_name || 'Unknown Teacher',
        status,
        priority: 'high',
        isDeadline: false,
        joinUrl: cls.meeting_link,
        color: SUBJECT_COLORS[cls.subject] || SUBJECT_COLORS.default,
      });
    });

    // Transform assignments to deadline events
    rawAssignments.forEach((assignment) => {
      const dueDate = new Date(assignment.due_date);
      const now = new Date();

      eventList.push({
        id: `deadline-${assignment.id}`,
        title: assignment.title,
        type: 'deadline',
        subject: assignment.subject || 'General',
        start: dueDate,
        end: dueDate,
        teacher: assignment.created_by || 'Unknown',
        status: dueDate < now ? 'completed' : 'upcoming',
        priority: assignment.priority || 'medium',
        isDeadline: true,
        color: '#EF4444',
      });
    });

    // Apply filters
    let filtered = eventList;

    if (scheduleState.filters.subjects.length > 0) {
      filtered = filtered.filter(e => scheduleState.filters.subjects.includes(e.subject));
    }

    if (scheduleState.filters.status.length > 0) {
      filtered = filtered.filter(e => scheduleState.filters.status.includes(e.status));
    }

    if (scheduleState.filters.type.length > 0) {
      filtered = filtered.filter(e => scheduleState.filters.type.includes(e.type));
    }

    // Sort by start time
    return filtered.sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [rawClasses, rawAssignments, scheduleState.filters]);

  // Calculate summary
  const summary = useMemo<ScheduleSummary>(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const todayEvents = events.filter(
      e => e.start.toISOString().split('T')[0] === todayStr && e.type === 'class'
    );

    const dueSoon = rawAssignments.filter(a => {
      const daysUntilDue = Math.ceil((new Date(a.due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilDue >= 0 && daysUntilDue <= 3;
    });

    return {
      classesToday: todayEvents.length,
      studyMinutes: 270, // TODO: Calculate from actual study blocks
      dueSoonCount: dueSoon.length,
      attendanceRate: '92%', // TODO: Calculate from actual attendance data
    };
  }, [events, rawAssignments]);

  // Calculate reminders (upcoming deadlines within 7 days)
  const reminders = useMemo<ScheduleReminder[]>(() => {
    const now = new Date();

    return rawAssignments
      .filter(a => {
        const daysUntilDue = Math.ceil((new Date(a.due_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilDue >= 0 && daysUntilDue <= 7;
      })
      .map(a => ({
        id: a.id,
        title: a.title,
        dueDate: new Date(a.due_date),
        type: 'assignment' as const,
        actionLabel: 'Start',
      }))
      .slice(0, 5); // Top 5 reminders
  }, [rawAssignments]);

  // Actions
  const selectDate = useCallback((date: Date) => {
    setScheduleState(prev => ({
      ...prev,
      focusedDate: date,
      visibleRange: getWeekRange(date), // Always show week range
    }));
  }, []);

  const setView = useCallback((view: 'day' | 'week' | 'month') => {
    setScheduleState(prev => ({
      ...prev,
      currentView: view,
    }));
  }, []);

  const setFilter = useCallback((filterType: keyof ScheduleFilters, values: string[]) => {
    setScheduleState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterType]: values,
      },
    }));
  }, []);

  const navigateWeek = useCallback((direction: 'next' | 'previous') => {
    setScheduleState(prev => {
      const newDate = new Date(prev.focusedDate);
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));

      return {
        ...prev,
        focusedDate: newDate,
        visibleRange: getWeekRange(newDate),
      };
    });
  }, []);

  const jumpToToday = useCallback(() => {
    const today = new Date();
    setScheduleState(prev => ({
      ...prev,
      focusedDate: today,
      visibleRange: getWeekRange(today),
    }));
  }, []);

  return {
    scheduleState,
    events,
    summary,
    reminders,
    isLoading,
    isRefreshing,
    error,
    loadSchedule,
    selectDate,
    setView,
    setFilter,
    refresh,
    navigateWeek,
    jumpToToday,
  };
};

// Helper: Get week range (Sunday to Saturday)
function getWeekRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // Sunday
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Saturday
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

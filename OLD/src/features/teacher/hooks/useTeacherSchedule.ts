/**
 * useTeacherSchedule Hook  
 * Fetches today's class schedule for the teacher
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

export type ScheduleItem = {
  id: string;
  timeRange: string;
  subject: string;
  className: string;
  room: string;
  attendanceStatus: 'pending' | 'submitted' | 'late';
  classId: string;
};

export const useTeacherSchedule = (selectedClassId?: string) => {
  const { user } = useAuth();
  const userId = user?.id || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

  const query = useQuery({
    queryKey: ['teacher-schedule', userId, selectedClassId],
    queryFn: async (): Promise<ScheduleItem[]> => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);

      let scheduleQuery = supabase
        .from('class_schedule')
        .select(`
          id,
          start_time,
          end_time,
          room,
          class_id,
          classes!inner(
            id,
            subject,
            title,
            batches(name)
          )
        `)
        .eq('teacher_id', userId)
        .eq('day_of_week', now.getDay())
        .gte('start_time', currentTime)
        .order('start_time');

      if (selectedClassId) {
        scheduleQuery = scheduleQuery.eq('class_id', selectedClassId);
      }

      const { data: scheduleData, error: scheduleError } = await scheduleQuery;

      if (scheduleError) {
        console.error('Error fetching schedule:', scheduleError);
        return [];
      }

      if (!scheduleData || scheduleData.length === 0) {
        return [];
      }

      const items: ScheduleItem[] = scheduleData.map((schedule: any) => {
        return {
          id: schedule.id,
          timeRange: `${schedule.start_time}–${schedule.end_time}`,
          subject: schedule.classes?.subject || 'Unknown',
          className: schedule.classes?.batches?.name || schedule.classes?.title || 'Unknown',
          room: schedule.room,
          attendanceStatus: 'pending' as const,
          classId: schedule.class_id,
        };
      });

      return items;
    },
    staleTime: 2 * 60 * 1000,
  });

  return {
    scheduleToday: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

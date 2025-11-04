/**
 * useTeacherAlerts Hook
 * Fetches urgent alerts and next class information
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

export type AlertType = {
  label: string;
  type: 'warn' | 'info';
  onPress: () => void;
};

export type NextClassInfo = {
  timeRange: string;
  subject: string;
  className: string;
  room: string;
};

export const useTeacherAlerts = (selectedClassId?: string) => {
  const { user } = useAuth();
  const userId = user?.id || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

  const query = useQuery({
    queryKey: ['teacher-alerts', userId, selectedClassId],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

      // Find next class today
      let scheduleQuery = supabase
        .from('class_schedule')
        .select(`
          id,
          start_time,
          end_time,
          room,
          classes!inner(
            id,
            title,
            batches(name),
            subject
          )
        `)
        .eq('teacher_id', userId)
        .eq('day_of_week', now.getDay())
        .gte('start_time', currentTime)
        .order('start_time')
        .limit(1);

      if (selectedClassId) {
        scheduleQuery = scheduleQuery.eq('class_id', selectedClassId);
      }

      const { data: nextClassData } = await scheduleQuery.maybeSingle();

      const nextClass: NextClassInfo | null = nextClassData
        ? {
            timeRange: `${nextClassData.start_time}–${nextClassData.end_time}`,
            subject: (nextClassData.classes as any)?.subject || '',
            className: (nextClassData.classes as any)?.batches?.name || (nextClassData.classes as any)?.title || '',
            room: nextClassData.room,
          }
        : null;

      // Check for pending attendance
      const { data: pendingAttendance } = await supabase
        .from('attendance')
        .select('class_id, classes!inner(title, batches(name))')
        .eq('teacher_id', userId)
        .eq('date', today)
        .eq('status', 'pending');

      // Check for urgent parent messages
      const { data: urgentMessages } = await supabase
        .from('messages')
        .select('id')
        .eq('recipient_id', userId)
        .eq('is_urgent', true)
        .eq('read', false);

      const alerts: AlertType[] = [];

      // Add pending attendance alerts
      if (pendingAttendance && pendingAttendance.length > 0) {
        pendingAttendance.forEach((item: any) => {
          const className = item.classes?.batches?.name || item.classes?.title || 'Unknown';
          alerts.push({
            label: `Attendance pending: ${className}`,
            type: 'warn',
            onPress: () => {
              // Navigation will be handled in the component
            },
          });
        });
      }

      // Add urgent message alert
      if (urgentMessages && urgentMessages.length > 0) {
        alerts.push({
          label: `${urgentMessages.length} urgent message${urgentMessages.length > 1 ? 's' : ''}`,
          type: 'warn',
          onPress: () => {
            // Navigation will be handled in the component
          },
        });
      }

      return {
        nextClass,
        alerts,
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute (alerts should be fresh)
  });

  return {
    nextClass: query.data?.nextClass || null,
    urgentAlerts: query.data?.alerts || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

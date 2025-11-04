/**
 * useAttendanceStatus Hook
 * Fetches attendance status for teacher's classes today
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

export type AttendanceRow = {
  className: string;
  classId: string;
  status: 'pending' | 'submitted';
  ctaLabel: string;
};

export const useAttendanceStatus = (selectedClassId?: string) => {
  const { user } = useAuth();
  const userId = user?.id || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

  const query = useQuery({
    queryKey: ['attendance-status', userId, selectedClassId],
    queryFn: async (): Promise<AttendanceRow[]> => {
      const today = new Date().toISOString().split('T')[0];

      // Fetch classes teacher teaches
      let classesQuery = supabase
        .from('classes')
        .select('id, title, batches(name)')
        // Teacher filter not needed - attendance per student
        .order('title');

      if (selectedClassId) {
        classesQuery = classesQuery.eq('id', selectedClassId);
      }

      const { data: classes, error: classesError } = await classesQuery;

      if (classesError) {
        console.error('Error fetching classes:', classesError);
        return [];
      }

      if (!classes || classes.length === 0) {
        return [];
      }

      // Fetch attendance records for today
      const classIds = classes.map((c) => c.id);
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('class_id, status')
        // Teacher filter not needed - attendance per student
        .eq('date', today)
        .in('class_id', classIds);

      // Map classes with attendance status
      const rows: AttendanceRow[] = classes.map((classItem) => {
        const attendance = attendanceData?.find((a) => a.class_id === classItem.id);
        const status = attendance?.status === 'submitted' ? 'submitted' : 'pending';

        return {
          className: classItem.batches?.name || classItem.title,
          classId: classItem.id,
          status,
          ctaLabel: status === 'pending' ? 'Review' : 'View',
        };
      });

      return rows;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    attendanceRows: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

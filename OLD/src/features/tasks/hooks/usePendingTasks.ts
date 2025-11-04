/**
 * usePendingTasks Hook
 * Fetches pending tasks/approvals for the teacher
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

export type TaskPreview = {
  id: string;
  title: string;
  dueLabel: string;
  status: 'pending' | 'overdue' | 'done';
  dueDate: string;
};

export const usePendingTasks = () => {
  const { user } = useAuth();
  const userId = user?.id || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

  const query = useQuery({
    queryKey: ['pending-tasks', userId],
    queryFn: async (): Promise<TaskPreview[]> => {
      const today = new Date().toISOString().split('T')[0];

      // Fetch teacher tasks (grading, approvals, etc.)
      const { data: tasks, error } = await supabase
        .from('teacher_tasks')
        .select('id, title, due_date, status')
        .eq('teacher_id', userId)
        .in('status', ['pending', 'overdue'])
        .order('due_date', { ascending: true })
        .limit(5);

      if (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }

      if (!tasks || tasks.length === 0) {
        return [];
      }

      // Format tasks
      const previews: TaskPreview[] = tasks.map((task) => {
        const dueDate = new Date(task.due_date);
        const todayDate = new Date(today);

        let dueLabel = '';
        let status: 'pending' | 'overdue' | 'done' = task.status;

        if (dueDate < todayDate && task.status === 'pending') {
          dueLabel = 'Overdue';
          status = 'overdue';
        } else if (dueDate.toDateString() === todayDate.toDateString()) {
          dueLabel = 'Due today';
        } else if (dueDate.getTime() - todayDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
          // Within a week
          dueLabel = `Due ${dueDate.toLocaleDateString('en-US', { weekday: 'short' })}`;
        } else {
          dueLabel = `Due ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        }

        return {
          id: task.id,
          title: task.title,
          dueLabel,
          status,
          dueDate: task.due_date,
        };
      });

      // Sort: overdue first, then by due date
      previews.sort((a, b) => {
        if (a.status === 'overdue' && b.status !== 'overdue') return -1;
        if (a.status !== 'overdue' && b.status === 'overdue') return 1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });

      return previews.slice(0, 3); // Top 3 tasks
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    tasks: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

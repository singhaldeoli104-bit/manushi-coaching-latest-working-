/**
 * useTeacherProfile Hook
 * Fetches teacher profile data including name, avatar, and classes they teach
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

export type TeacherProfile = {
  id: string;
  name: string;
  avatarUrl: string | null;
  email: string;
  phone: string | null;
  classes: Array<{
    id: string;
    name: string;
    subject: string;
    grade: string;
  }>;
};

export const useTeacherProfile = () => {
  const { user } = useAuth();
  const userId = user?.id || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

  const query = useQuery({
    queryKey: ['teacher-profile', userId],
    queryFn: async (): Promise<TeacherProfile | null> => {
      // Fetch teacher profile
      const { data: profile, error: profileError } = await supabase
        .from('teacher_profiles')
        .select('id, name, avatar_url, email, phone')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching teacher profile:', profileError);
        return null;
      }

      // Fetch classes this teacher teaches
      const { data: classes, error: classesError } = await supabase
        .from('classes')
        .select('id, subject, title, batch:batch_id(name, grade_level)')
        .eq('teacher_id', userId)
        .order('title');

      if (classesError) {
        console.error('Error fetching teacher classes:', classesError);
      }

      // Transform classes data to match expected type
      const transformedClasses = (classes || []).map((cls: any) => ({
        id: cls.id,
        name: cls.title, // Use 'title' as 'name'
        subject: cls.subject,
        grade: cls.batch?.grade_level || cls.batch?.name || 'N/A', // Use grade_level or fallback to batch name
      }));

      console.log('📚 [Teacher Profile] Loaded classes:', JSON.stringify(transformedClasses.slice(0, 3), null, 2));

      return {
        id: profile.id,
        name: profile.name,
        avatarUrl: profile.avatar_url,
        email: profile.email,
        phone: profile.phone,
        classes: transformedClasses,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    teacherProfile: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Parent API Service
 * Handles all parent-related data fetching from Supabase
 */

import { supabase } from '../../lib/supabase';

export interface Child {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  batch_id: string;
  enrollment_date: string;
  status: string;
}

export interface ParentProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: string;
}

export interface ChildWithRelationship extends Child {
  relationship_type: string;
  is_primary_contact: boolean;
}

export interface StudentAttendance {
  student_id: string;
  total_classes: number;
  present: number;
  absent: number;
  percentage: number;
}

export interface RecentNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  is_read: boolean;
  created_at: string;
}

/**
 * Get parent profile by user ID
 */
export const getParentProfile = async (userId: string): Promise<ParentProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone, avatar_url, role')
      .eq('id', userId)
      .eq('role', 'parent')
      .single();

    if (error) {
      console.error('Error fetching parent profile:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception fetching parent profile:', err);
    return null;
  }
};

/**
 * Get all children for a parent
 */
export const getParentChildren = async (parentId: string): Promise<ChildWithRelationship[]> => {
  try {
    const { data, error } = await supabase
      .from('parent_child_relationships')
      .select(`
        relationship_type,
        is_primary_contact,
        student:students!parent_child_relationships_student_id_fkey (
          id,
          student_id,
          full_name,
          email,
          phone,
          batch_id,
          enrollment_date,
          status
        )
      `)
      .eq('parent_id', parentId)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching children:', error);
      return [];
    }

    if (!data) return [];

    // Transform the data
    return data
      .filter(item => item.student)
      .map(item => ({
        ...(item.student as Child),
        relationship_type: item.relationship_type,
        is_primary_contact: item.is_primary_contact,
      }));
  } catch (err) {
    console.error('Exception fetching children:', err);
    return [];
  }
};

/**
 * Get attendance summary for a student
 */
export const getStudentAttendanceSummary = async (
  studentId: string
): Promise<StudentAttendance | null> => {
  try {
    const { data, error } = await supabase
      .from('attendance_summary')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error) {
      console.error('Error fetching attendance:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception fetching attendance:', err);
    return null;
  }
};

/**
 * Get recent notifications for parent
 */
export const getParentNotifications = async (
  parentId: string,
  limit: number = 5
): Promise<RecentNotification[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('id, title, message, type, priority, is_read, created_at')
      .eq('user_id', parentId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception fetching notifications:', err);
    return [];
  }
};

/**
 * Get upcoming classes for a student
 */
export const getUpcomingClasses = async (studentId: string, limit: number = 5) => {
  try {
    // First get the student's batch
    const { data: student } = await supabase
      .from('students')
      .select('batch_id')
      .eq('id', studentId)
      .single();

    if (!student?.batch_id) return [];

    // Then get classes for that batch
    const { data, error } = await supabase
      .from('classes')
      .select(`
        id,
        title,
        description,
        subject,
        scheduled_at,
        duration_minutes,
        status,
        teacher:profiles!classes_teacher_id_fkey(full_name)
      `)
      .eq('batch_id', student.batch_id)
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching classes:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception fetching classes:', err);
    return [];
  }
};

/**
 * Get pending assignments for a student
 */
export const getPendingAssignments = async (studentId: string) => {
  try {
    const { data, error } = await supabase
      .from('assignment_submissions')
      .select(`
        id,
        submitted_at,
        grade,
        status,
        assignment:assignments!assignment_submissions_assignment_id_fkey(
          id,
          title,
          subject,
          due_date,
          total_points
        )
      `)
      .eq('student_id', studentId)
      .in('status', ['pending', 'in_progress'])
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching assignments:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception fetching assignments:', err);
    return [];
  }
};

/**
 * Get parent's financial summary
 */
export const getParentFinancialSummary = async (parentId: string) => {
  try {
    const { data, error } = await supabase
      .from('parent_financial_summary')
      .select('*')
      .eq('parent_id', parentId)
      .single();

    if (error) {
      console.error('Error fetching financial summary:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception fetching financial summary:', err);
    return null;
  }
};

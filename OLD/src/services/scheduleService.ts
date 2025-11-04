/**
 * Schedule Service
 * Handles schedule-related operations: creating classes, study blocks, and exporting data
 */

import { supabase } from '../config/supabase';

/**
 * Insert a new class event
 */
export const createClassEvent = async (params: {
  studentId: string;
  subject: string;
  title: string;
  description?: string;
  scheduledAt: Date;
  durationMinutes: number;
  teacherName?: string;
  location?: string;
}) => {
  try {
    // Get a default batch and teacher for demo
    const { data: batches } = await supabase
      .from('batches')
      .select('id')
      .limit(1);

    const { data: teachers } = await supabase
      .from('teachers')
      .select('id')
      .limit(1);

    if (!batches || batches.length === 0) {
      throw new Error('No batches found');
    }

    if (!teachers || teachers.length === 0) {
      throw new Error('No teachers found');
    }

    const { data, error } = await supabase
      .from('classes')
      .insert({
        batch_id: batches[0].id,
        subject: params.subject,
        teacher_id: teachers[0].id,
        title: params.title,
        description: params.description || `Class on ${params.subject}`,
        scheduled_at: params.scheduledAt.toISOString(),
        duration_minutes: params.durationMinutes,
        status: 'scheduled',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating class:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Error in createClassEvent:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Insert a new study block/plan
 */
export const createStudyBlock = async (params: {
  studentId: string;
  title: string;
  description?: string;
  subject?: string;
  durationMinutes: number;
  topics?: string[];
}) => {
  try {
    const { data, error } = await supabase
      .from('study_plans')
      .insert({
        student_id: params.studentId,
        title: params.title,
        description: params.description || `Study session: ${params.title}`,
        duration: `${params.durationMinutes} minutes`,
        difficulty: 'medium',
        topics: params.topics ? JSON.stringify(params.topics) : null,
        progress: 0,
        estimated_time: `${params.durationMinutes} min`,
        ai_generated: false,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating study block:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Error in createStudyBlock:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export schedule data as JSON
 */
export const exportScheduleData = async (params: {
  studentId: string;
  startDate: Date;
  endDate: Date;
}) => {
  try {
    // Get classes
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select('*')
      .gte('scheduled_at', params.startDate.toISOString())
      .lte('scheduled_at', params.endDate.toISOString());

    if (classesError) {
      console.error('Error fetching classes:', classesError);
      return { success: false, error: classesError.message };
    }

    // Get assignments
    const { data: assignments, error: assignmentsError } = await supabase
      .from('assignments')
      .select('*')
      .gte('due_date', params.startDate.toISOString())
      .lte('due_date', params.endDate.toISOString());

    if (assignmentsError) {
      console.error('Error fetching assignments:', assignmentsError);
      return { success: false, error: assignmentsError.message };
    }

    // Get study plans
    const { data: studyPlans, error: studyPlansError } = await supabase
      .from('study_plans')
      .select('*')
      .eq('student_id', params.studentId);

    if (studyPlansError) {
      console.error('Error fetching study plans:', studyPlansError);
      return { success: false, error: studyPlansError.message };
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      dateRange: {
        start: params.startDate.toISOString(),
        end: params.endDate.toISOString(),
      },
      classes: classes || [],
      assignments: assignments || [],
      studyPlans: studyPlans || [],
      summary: {
        totalClasses: classes?.length || 0,
        totalAssignments: assignments?.length || 0,
        totalStudyPlans: studyPlans?.length || 0,
      },
    };

    return { success: true, data: exportData };
  } catch (error: any) {
    console.error('Error in exportScheduleData:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Domain Types for Teacher App
 * Aligned with Supabase schema and UX wireframes
 */

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  subject_specializations: string[];
  bio?: string;
  experience_years?: number;
  qualification?: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  parent_id?: string;
  grade_level: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  name: string; // "Class 10A Physics"
  subject: string;
  grade_level: string;
  teacher_id: string;
  teacher?: Teacher;
  student_count: number;
  schedule?: ClassSchedule[];
  description?: string;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface ClassSchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  start_time: string; // "10:00"
  end_time: string; // "11:00"
  room?: string;
}

// ============================================================================
// TEACHING & SESSIONS
// ============================================================================

export interface Session {
  id: string;
  class_id: string;
  class?: Class;
  teacher_id: string;
  title: string;
  description?: string;
  scheduled_start: string; // ISO timestamp
  scheduled_end: string;
  actual_start?: string;
  actual_end?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  session_type: 'regular' | 'doubt' | 'revision' | 'test';
  join_url?: string;
  recording_url?: string;
  attendance_count?: number;
  resources?: Resource[];
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  session_id: string;
  student_id: string;
  student?: Student;
  status: 'present' | 'absent' | 'late' | 'excused';
  join_time?: string;
  leave_time?: string;
  duration_minutes?: number;
  marked_by: string; // teacher_id
  notes?: string;
  created_at: string;
}

// ============================================================================
// ASSESSMENTS
// ============================================================================

export interface Test {
  id: string;
  title: string;
  description?: string;
  class_id: string;
  class?: Class;
  teacher_id: string;
  total_marks: number;
  duration_minutes: number;
  scheduled_start?: string;
  scheduled_end?: string;
  instructions?: string;
  question_count: number;
  status: 'draft' | 'scheduled' | 'live' | 'completed' | 'archived';
  test_type: 'quiz' | 'test' | 'exam' | 'practice';
  is_proctored: boolean;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  type: 'mcq' | 'true_false' | 'short_answer' | 'long_answer' | 'numerical';
  question_text: string;
  options?: string[]; // For MCQ
  correct_answer: string | string[];
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  topic: string;
  subtopic?: string;
  explanation?: string;
  image_url?: string;
  created_by: string; // teacher_id
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface TestQuestion {
  id: string;
  test_id: string;
  question_id: string;
  question?: Question;
  question_number: number;
  marks: number;
}

export interface TestSubmission {
  id: string;
  test_id: string;
  student_id: string;
  student?: Student;
  start_time: string;
  submit_time?: string;
  status: 'in_progress' | 'submitted' | 'graded' | 'auto_submitted';
  total_marks_obtained?: number;
  percentage?: number;
  rank?: number;
  time_taken_minutes?: number;
  answers: TestAnswer[];
  created_at: string;
  updated_at: string;
}

export interface TestAnswer {
  question_id: string;
  student_answer: string | string[];
  is_correct?: boolean;
  marks_obtained?: number;
  feedback?: string;
  time_spent_seconds?: number;
}

export interface Homework {
  id: string;
  title: string;
  description?: string;
  class_id: string;
  class?: Class;
  teacher_id: string;
  due_date: string;
  total_marks: number;
  status: 'draft' | 'assigned' | 'grading' | 'completed';
  submission_count: number;
  graded_count: number;
  questions?: Question[];
  attachments?: Attachment[];
  created_at: string;
  updated_at: string;
}

export interface HomeworkSubmission {
  id: string;
  homework_id: string;
  student_id: string;
  student?: Student;
  submitted_at?: string;
  status: 'pending' | 'submitted' | 'graded' | 'returned';
  marks_obtained?: number;
  feedback?: string;
  attachments?: Attachment[];
  graded_by?: string; // teacher_id
  graded_at?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// RESOURCES & CONTENT
// ============================================================================

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: 'pdf' | 'video' | 'image' | 'link' | 'document' | 'presentation';
  url: string;
  file_size?: number;
  duration?: number; // For videos, in seconds
  thumbnail_url?: string;
  subject?: string;
  topic?: string;
  tags?: string[];
  uploaded_by: string; // teacher_id
  class_id?: string; // Optional - can be shared across classes
  download_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string; // MIME type
  size: number;
  uploaded_by: string;
  created_at: string;
}

// ============================================================================
// COMMUNICATION
// ============================================================================

export interface Announcement {
  id: string;
  title: string;
  content: string;
  teacher_id: string;
  teacher?: Teacher;
  class_id?: string; // null = all classes
  priority: 'low' | 'medium' | 'high' | 'urgent';
  send_notification: boolean;
  sent_at?: string;
  read_count: number;
  attachments?: Attachment[];
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'teacher' | 'student' | 'parent';
  sender?: Teacher | Student;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'audio';
  attachments?: Attachment[];
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  type: 'class_chat' | 'direct_message' | 'group';
  participants: string[]; // user_ids
  class_id?: string;
  last_message?: ChatMessage;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ANALYTICS & INSIGHTS
// ============================================================================

export interface TestAnalytics {
  test_id: string;
  total_submissions: number;
  average_marks: number;
  highest_marks: number;
  lowest_marks: number;
  pass_percentage: number;
  question_analytics: QuestionAnalytics[];
  difficulty_distribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  time_analytics: {
    average_time_minutes: number;
    fastest_time_minutes: number;
    slowest_time_minutes: number;
  };
}

export interface QuestionAnalytics {
  question_id: string;
  total_attempts: number;
  correct_attempts: number;
  accuracy_percentage: number;
  average_time_seconds: number;
  common_wrong_answers?: string[];
}

export interface StudentPerformance {
  student_id: string;
  student?: Student;
  class_id: string;
  overall_percentage: number;
  test_average: number;
  homework_average: number;
  attendance_percentage: number;
  rank?: number;
  strengths: string[];
  weaknesses: string[];
  recent_trend: 'improving' | 'declining' | 'stable';
  last_updated: string;
}

// ============================================================================
// TASKS & WORKFLOW
// ============================================================================

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: 'grade_homework' | 'review_test' | 'mark_attendance' | 'reply_doubt' | 'parent_message' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  related_id?: string; // homework_id, test_id, etc.
  related_type?: string; // 'homework', 'test', etc.
  assigned_to: string; // teacher_id
  created_by: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Doubt {
  id: string;
  student_id: string;
  student?: Student;
  subject: string;
  topic: string;
  question: string;
  description?: string;
  attachments?: Attachment[];
  status: 'open' | 'answered' | 'resolved' | 'closed';
  teacher_id?: string;
  answer?: string;
  answered_at?: string;
  upvotes: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export interface Notification {
  id: string;
  user_id: string;
  type: 'test_created' | 'homework_assigned' | 'announcement' | 'doubt_answered' | 'parent_message' | 'attendance_marked' | 'grade_published';
  title: string;
  body: string;
  data?: Record<string, any>;
  is_read: boolean;
  read_at?: string;
  action_url?: string; // Deep link
  created_at: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// ============================================================================
// FILTERS & QUERIES
// ============================================================================

export interface TestFilters {
  class_id?: string;
  status?: Test['status'];
  test_type?: Test['test_type'];
  start_date?: string;
  end_date?: string;
}

export interface StudentFilters {
  class_id?: string;
  grade_level?: string;
  status?: Student['status'];
  search?: string;
}

export interface TaskFilters {
  type?: Task['type'];
  status?: Task['status'];
  priority?: Task['priority'];
  due_date?: string;
}

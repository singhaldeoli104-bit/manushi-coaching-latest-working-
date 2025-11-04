-- ================================================
-- Migration: 004 - Create Calendar and Attendance Tables
-- Description: Tables for calendar management and attendance tracking
-- Dependencies: 001_create_parent_tables.sql
-- ================================================

-- ================================================
-- 1. Calendar Events Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.parents(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('exam', 'assignment', 'project', 'parent_meeting', 'school_event', 'holiday', 'personal', 'reminder', 'other')),
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_all_day BOOLEAN DEFAULT FALSE,
    location TEXT,
    color TEXT,
    recurrence_rule TEXT,
    recurrence_end_date DATE,
    reminder_settings JSONB DEFAULT '[]'::jsonb,
    is_synced_from_school BOOLEAN DEFAULT FALSE,
    school_event_id UUID REFERENCES public.school_events(id) ON DELETE SET NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    attachments JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_child_id ON public.calendar_events(child_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_school_id ON public.calendar_events(school_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_parent_id ON public.calendar_events(parent_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_event_type ON public.calendar_events(event_type);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON public.calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_end_time ON public.calendar_events(end_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_is_completed ON public.calendar_events(is_completed);

COMMENT ON TABLE public.calendar_events IS 'Calendar events for students and parents';
COMMENT ON COLUMN public.calendar_events.recurrence_rule IS 'iCalendar RRULE format for recurring events';
COMMENT ON COLUMN public.calendar_events.reminder_settings IS 'Array of reminder configurations (time, method, etc.)';

-- ================================================
-- 2. Attendance Records Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused', 'half_day')),
    check_in_time TIME,
    check_out_time TIME,
    late_by_minutes INTEGER,
    reason TEXT,
    is_excused BOOLEAN DEFAULT FALSE,
    excuse_note TEXT,
    excuse_document_url TEXT,
    excuse_approved_by UUID REFERENCES auth.users(id),
    excuse_approved_at TIMESTAMP WITH TIME ZONE,
    period_type TEXT CHECK (period_type IN ('full_day', 'morning', 'afternoon', 'specific_period')),
    period_details TEXT,
    recorded_by UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(child_id, date, period_type)
);

CREATE INDEX IF NOT EXISTS idx_attendance_records_child_id ON public.attendance_records(child_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON public.attendance_records(date DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_records_status ON public.attendance_records(status);
CREATE INDEX IF NOT EXISTS idx_attendance_records_is_excused ON public.attendance_records(is_excused);

COMMENT ON TABLE public.attendance_records IS 'Daily attendance tracking for students';
COMMENT ON COLUMN public.attendance_records.late_by_minutes IS 'Number of minutes late when status is late';

-- ================================================
-- 3. Attendance Summary Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.attendance_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    academic_year TEXT NOT NULL,
    month INTEGER CHECK (month >= 1 AND month <= 12),
    total_days INTEGER DEFAULT 0,
    present_days INTEGER DEFAULT 0,
    absent_days INTEGER DEFAULT 0,
    late_days INTEGER DEFAULT 0,
    excused_days INTEGER DEFAULT 0,
    half_days INTEGER DEFAULT 0,
    attendance_percentage DECIMAL(5,2),
    total_late_minutes INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(child_id, academic_year, month)
);

CREATE INDEX IF NOT EXISTS idx_attendance_summary_child_id ON public.attendance_summary(child_id);
CREATE INDEX IF NOT EXISTS idx_attendance_summary_academic_year ON public.attendance_summary(academic_year);
CREATE INDEX IF NOT EXISTS idx_attendance_summary_month ON public.attendance_summary(month);

COMMENT ON TABLE public.attendance_summary IS 'Monthly attendance summary statistics';

-- ================================================
-- 4. Homework Assignments Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.homework_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    assigned_date DATE NOT NULL,
    due_date DATE NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    estimated_duration_minutes INTEGER,
    assignment_type TEXT CHECK (assignment_type IN ('homework', 'project', 'reading', 'practice', 'research', 'other')),
    attachments JSONB DEFAULT '[]'::jsonb,
    submission_status TEXT DEFAULT 'pending' CHECK (submission_status IN ('pending', 'in_progress', 'completed', 'submitted', 'late', 'missing')),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    submitted_at TIMESTAMP WITH TIME ZONE,
    grade_received DECIMAL(5,2),
    teacher_feedback TEXT,
    parent_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_homework_assignments_child_id ON public.homework_assignments(child_id);
CREATE INDEX IF NOT EXISTS idx_homework_assignments_subject ON public.homework_assignments(subject);
CREATE INDEX IF NOT EXISTS idx_homework_assignments_due_date ON public.homework_assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_homework_assignments_submission_status ON public.homework_assignments(submission_status);
CREATE INDEX IF NOT EXISTS idx_homework_assignments_priority ON public.homework_assignments(priority);

COMMENT ON TABLE public.homework_assignments IS 'Student homework and assignment tracking';

-- ================================================
-- 5. Study Sessions Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    session_type TEXT CHECK (session_type IN ('self_study', 'tutoring', 'group_study', 'online_class', 'homework', 'revision', 'practice')),
    focus_level INTEGER CHECK (focus_level >= 1 AND focus_level <= 5),
    productivity_rating INTEGER CHECK (productivity_rating >= 1 AND productivity_rating <= 5),
    topics_covered JSONB DEFAULT '[]'::jsonb,
    challenges_faced TEXT,
    achievements TEXT,
    parent_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_sessions_child_id ON public.study_sessions(child_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_subject ON public.study_sessions(subject);
CREATE INDEX IF NOT EXISTS idx_study_sessions_start_time ON public.study_sessions(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_study_sessions_session_type ON public.study_sessions(session_type);

COMMENT ON TABLE public.study_sessions IS 'Tracking student study sessions and learning time';

-- ================================================
-- 6. Exam Schedule Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.exam_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    exam_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    exam_type TEXT NOT NULL CHECK (exam_type IN ('unit_test', 'midterm', 'final', 'quiz', 'practical', 'oral', 'project', 'standardized')),
    exam_date DATE NOT NULL,
    start_time TIME,
    duration_minutes INTEGER,
    location TEXT,
    syllabus_topics JSONB DEFAULT '[]'::jsonb,
    total_marks INTEGER,
    passing_marks INTEGER,
    weightage_percentage DECIMAL(5,2),
    preparation_status TEXT DEFAULT 'not_started' CHECK (preparation_status IN ('not_started', 'in_progress', 'completed', 'needs_help')),
    study_plan JSONB DEFAULT '[]'::jsonb,
    is_completed BOOLEAN DEFAULT FALSE,
    marks_obtained DECIMAL(5,2),
    grade TEXT,
    rank INTEGER,
    teacher_remarks TEXT,
    parent_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_schedule_child_id ON public.exam_schedule(child_id);
CREATE INDEX IF NOT EXISTS idx_exam_schedule_subject ON public.exam_schedule(subject);
CREATE INDEX IF NOT EXISTS idx_exam_schedule_exam_date ON public.exam_schedule(exam_date);
CREATE INDEX IF NOT EXISTS idx_exam_schedule_exam_type ON public.exam_schedule(exam_type);
CREATE INDEX IF NOT EXISTS idx_exam_schedule_is_completed ON public.exam_schedule(is_completed);

COMMENT ON TABLE public.exam_schedule IS 'Exam scheduling and results tracking';

-- ================================================
-- Row Level Security Policies
-- ================================================

-- Calendar Events RLS
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view calendar events for their children"
    ON public.calendar_events FOR SELECT
    USING (
        (child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )) OR
        (parent_id IN (
            SELECT id FROM public.parents WHERE user_id = auth.uid()
        ))
    );

CREATE POLICY "Parents can insert calendar events for their children"
    ON public.calendar_events FOR INSERT
    WITH CHECK (
        (child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )) OR
        (parent_id IN (
            SELECT id FROM public.parents WHERE user_id = auth.uid()
        ))
    );

CREATE POLICY "Parents can update calendar events for their children"
    ON public.calendar_events FOR UPDATE
    USING (
        (child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )) OR
        (parent_id IN (
            SELECT id FROM public.parents WHERE user_id = auth.uid()
        ))
    );

CREATE POLICY "Parents can delete calendar events for their children"
    ON public.calendar_events FOR DELETE
    USING (
        (child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )) OR
        (parent_id IN (
            SELECT id FROM public.parents WHERE user_id = auth.uid()
        ))
    );

-- Attendance Records RLS
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view attendance records for their children"
    ON public.attendance_records FOR SELECT
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Attendance Summary RLS
ALTER TABLE public.attendance_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view attendance summary for their children"
    ON public.attendance_summary FOR SELECT
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Homework Assignments RLS
ALTER TABLE public.homework_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view homework assignments for their children"
    ON public.homework_assignments FOR SELECT
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Parents can update homework assignments for their children"
    ON public.homework_assignments FOR UPDATE
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Study Sessions RLS
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view study sessions for their children"
    ON public.study_sessions FOR SELECT
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Parents can insert study sessions for their children"
    ON public.study_sessions FOR INSERT
    WITH CHECK (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Parents can update study sessions for their children"
    ON public.study_sessions FOR UPDATE
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Exam Schedule RLS
ALTER TABLE public.exam_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view exam schedule for their children"
    ON public.exam_schedule FOR SELECT
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Parents can update exam schedule for their children"
    ON public.exam_schedule FOR UPDATE
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- ================================================
-- Triggers for updated_at
-- ================================================
CREATE TRIGGER update_calendar_events_updated_at
    BEFORE UPDATE ON public.calendar_events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_records_updated_at
    BEFORE UPDATE ON public.attendance_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_summary_updated_at
    BEFORE UPDATE ON public.attendance_summary
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_homework_assignments_updated_at
    BEFORE UPDATE ON public.homework_assignments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_study_sessions_updated_at
    BEFORE UPDATE ON public.study_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exam_schedule_updated_at
    BEFORE UPDATE ON public.exam_schedule
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

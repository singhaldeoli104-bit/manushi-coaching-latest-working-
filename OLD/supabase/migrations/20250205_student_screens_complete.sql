-- =====================================================
-- COMPLETE STUDENT SCREENS DATABASE SCHEMA
-- =====================================================
-- Migration: 20250205_student_screens_complete
-- Purpose: Complete schema for all 27 student screens
-- Student ID: 96055c84-a9ee-496d-8360-6b7cea64b928
-- Batch ID: 57ab5ec8-fac5-49f9-b64c-38e4b526ef84
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUM TYPES
-- =====================================================

CREATE TYPE activity_type AS ENUM ('assignment', 'grade', 'class', 'announcement', 'general', 'doubt', 'achievement');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE doubt_status AS ENUM ('pending', 'answered', 'resolved', 'escalated');
CREATE TYPE material_type AS ENUM ('video', 'pdf', 'document', 'link', 'image', 'audio');
CREATE TYPE test_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE badge_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
CREATE TYPE goal_status AS ENUM ('active', 'completed', 'abandoned');
CREATE TYPE session_status AS ENUM ('scheduled', 'live', 'ended', 'cancelled');
CREATE TYPE event_type AS ENUM ('class', 'assignment', 'test', 'exam', 'event', 'holiday');

-- =====================================================
-- 1. STUDENT ACTIVITIES TABLE (NewActivityDetail)
-- =====================================================

CREATE TABLE IF NOT EXISTS student_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type activity_type NOT NULL DEFAULT 'general',
    priority priority_level NOT NULL DEFAULT 'medium',
    related_subject VARCHAR(100),
    related_entity_type VARCHAR(50), -- 'assignment', 'class', 'test', etc.
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_student_activities_student ON student_activities(student_id);
CREATE INDEX idx_student_activities_type ON student_activities(type);
CREATE INDEX idx_student_activities_created ON student_activities(created_at DESC);

-- =====================================================
-- 2. ACTIVITY COMMENTS (NewActivityDetail)
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES student_activities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_avatar VARCHAR(10) DEFAULT '👤',
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_comments_activity ON activity_comments(activity_id);

-- =====================================================
-- 3. ACTIVITY REACTIONS (NewActivityDetail)
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES student_activities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(activity_id, user_id, emoji)
);

CREATE INDEX idx_activity_reactions_activity ON activity_reactions(activity_id);

-- =====================================================
-- 4. ACTIVITY ATTACHMENTS (NewActivityDetail)
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES student_activities(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type material_type NOT NULL,
    file_url TEXT NOT NULL,
    file_size VARCHAR(50),
    uploaded_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_attachments_activity ON activity_attachments(activity_id);

-- =====================================================
-- 5. ACTIVITY TIMELINE (NewActivityDetail)
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES student_activities(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'created', 'updated', 'completed', 'commented'
    description TEXT NOT NULL,
    user_id UUID NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_timeline_activity ON activity_timeline(activity_id);

-- =====================================================
-- 6. DOUBTS/QUESTIONS (NewSimpleDoubt, NewDoubtSubmission)
-- =====================================================

-- Update existing doubts table if needed
ALTER TABLE doubts
    ADD COLUMN IF NOT EXISTS category VARCHAR(100),
    ADD COLUMN IF NOT EXISTS tags TEXT[],
    ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS upvotes_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS responded_by UUID,
    ADD COLUMN IF NOT EXISTS responded_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS resolution_time_minutes INTEGER;

-- =====================================================
-- 7. DOUBT ATTACHMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS doubt_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doubt_id UUID NOT NULL REFERENCES doubts(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type material_type NOT NULL,
    file_url TEXT NOT NULL,
    file_size VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_doubt_attachments_doubt ON doubt_attachments(doubt_id);

-- =====================================================
-- 8. AI CONVERSATIONS (NewAITutorChat, NewAIStudyScreen)
-- =====================================================

CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'AI Chat Session',
    subject VARCHAR(100),
    conversation_type VARCHAR(50) DEFAULT 'tutor', -- 'tutor', 'study', 'practice'
    is_active BOOLEAN DEFAULT TRUE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    message_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_student ON ai_conversations(student_id);
CREATE INDEX idx_ai_conversations_active ON ai_conversations(is_active);

-- =====================================================
-- 9. AI MESSAGES (NewAITutorChat)
-- =====================================================

CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    metadata JSONB, -- For storing additional context, attachments, etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_messages_conversation ON ai_messages(conversation_id);
CREATE INDEX idx_ai_messages_created ON ai_messages(created_at);

-- =====================================================
-- 10. AI PRACTICE PROBLEMS (AIPracticeProblems)
-- =====================================================

CREATE TABLE IF NOT EXISTS ai_practice_problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    difficulty test_difficulty NOT NULL DEFAULT 'medium',
    question TEXT NOT NULL,
    options JSONB, -- For MCQs: ["option1", "option2", ...]
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    hints TEXT[],
    student_answer TEXT,
    is_correct BOOLEAN,
    time_spent_seconds INTEGER,
    attempts INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_practice_student ON ai_practice_problems(student_id);
CREATE INDEX idx_ai_practice_subject ON ai_practice_problems(subject);

-- =====================================================
-- 11. AI STUDY SUMMARIES (AIStudySummaries)
-- =====================================================

CREATE TABLE IF NOT EXISTS ai_study_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    key_points TEXT[] NOT NULL,
    related_materials TEXT[],
    generated_from VARCHAR(100), -- 'notes', 'video', 'textbook', etc.
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_summaries_student ON ai_study_summaries(student_id);
CREATE INDEX idx_ai_summaries_subject ON ai_study_summaries(subject);

-- =====================================================
-- 12. STUDY MATERIALS (NewStudyLibraryScreen)
-- =====================================================

-- Update existing study_materials table
ALTER TABLE study_materials
    ADD COLUMN IF NOT EXISTS material_type material_type DEFAULT 'document',
    ADD COLUMN IF NOT EXISTS file_url TEXT,
    ADD COLUMN IF NOT EXISTS file_size VARCHAR(50),
    ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
    ADD COLUMN IF NOT EXISTS duration_seconds INTEGER, -- For videos
    ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS downloads_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS tags TEXT[],
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS uploaded_by UUID,
    ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMPTZ DEFAULT NOW();

-- =====================================================
-- 13. STUDY MATERIAL VIEWS (Tracking)
-- =====================================================

CREATE TABLE IF NOT EXISTS study_material_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID NOT NULL REFERENCES study_materials(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0,
    last_position_seconds INTEGER DEFAULT 0, -- For videos
    completed BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 1,
    first_viewed_at TIMESTAMPTZ DEFAULT NOW(),
    last_viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_material_views_student ON study_material_views(student_id);
CREATE INDEX idx_material_views_material ON study_material_views(material_id);

-- =====================================================
-- 14. CLASS SESSIONS (NewScheduleScreen, NewClassDetailScreen)
-- =====================================================

CREATE TABLE IF NOT EXISTS class_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    class_type VARCHAR(50) DEFAULT 'lecture', -- 'lecture', 'lab', 'discussion', 'test'
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - start_time)) / 60) STORED,
    status session_status DEFAULT 'scheduled',
    location VARCHAR(255), -- Physical or virtual room
    recording_url TEXT,
    notes_url TEXT,
    materials_url TEXT[],
    attendance_mandatory BOOLEAN DEFAULT TRUE,
    max_participants INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_class_sessions_batch ON class_sessions(batch_id);
CREATE INDEX idx_class_sessions_start ON class_sessions(start_time);
CREATE INDEX idx_class_sessions_status ON class_sessions(status);

-- =====================================================
-- 15. LIVE CLASS PARTICIPANTS (NewLiveClassScreen, NewInteractiveClassroom)
-- =====================================================

-- Update existing live_session_participants table
ALTER TABLE live_session_participants
    ADD COLUMN IF NOT EXISTS is_hand_raised BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_muted BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS has_video BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS network_quality VARCHAR(20) DEFAULT 'good',
    ADD COLUMN IF NOT EXISTS total_time_seconds INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW();

-- =====================================================
-- 16. LIVE CLASS CHAT (NewLiveClassScreen, ClassChat)
-- =====================================================

CREATE TABLE IF NOT EXISTS live_class_chat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_avatar VARCHAR(10) DEFAULT '👤',
    message TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'image', 'file', 'poll'
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_live_class_chat_session ON live_class_chat(session_id);
CREATE INDEX idx_live_class_chat_created ON live_class_chat(created_at);

-- =====================================================
-- 17. LIVE CLASS REACTIONS (NewLiveClassScreen)
-- =====================================================

CREATE TABLE IF NOT EXISTS live_class_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_live_class_reactions_session ON live_class_reactions(session_id);

-- =====================================================
-- 18. CLASS NOTES (ClassNotes, NewEnhancedAIStudy)
-- =====================================================

CREATE TABLE IF NOT EXISTS class_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES class_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    formatted_content JSONB, -- Rich text format
    tags TEXT[],
    is_shared BOOLEAN DEFAULT FALSE,
    share_with_peers BOOLEAN DEFAULT FALSE,
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_class_notes_student ON class_notes(student_id);
CREATE INDEX idx_class_notes_session ON class_notes(session_id);

-- =====================================================
-- 19. COLLABORATIVE NOTES (NewCollaborativeAssignment)
-- =====================================================

CREATE TABLE IF NOT EXISTS collaborative_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    formatted_content JSONB,
    version_number INTEGER DEFAULT 1,
    contributors UUID[] NOT NULL,
    last_edited_by UUID NOT NULL,
    last_edited_at TIMESTAMPTZ DEFAULT NOW(),
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_collaborative_notes_assignment ON collaborative_notes(assignment_id);

-- =====================================================
-- 20. NOTE VERSIONS (Version History)
-- =====================================================

CREATE TABLE IF NOT EXISTS note_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    note_id UUID NOT NULL REFERENCES collaborative_notes(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    changes_summary TEXT,
    author_id UUID NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_note_versions_note ON note_versions(note_id);

-- =====================================================
-- 21. CALENDAR EVENTS (NewEnhancedSchedule)
-- =====================================================

CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type event_type NOT NULL DEFAULT 'event',
    subject VARCHAR(100),
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    all_day BOOLEAN DEFAULT FALSE,
    location VARCHAR(255),
    reminder_minutes_before INTEGER DEFAULT 15,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(50), -- 'daily', 'weekly', 'monthly'
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_calendar_events_date ON calendar_events(event_date);
CREATE INDEX idx_calendar_events_batch ON calendar_events(batch_id);

-- =====================================================
-- 22. STUDENT REMINDERS (NewEnhancedSchedule)
-- =====================================================

CREATE TABLE IF NOT EXISTS student_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    event_id UUID REFERENCES calendar_events(id) ON DELETE CASCADE,
    class_session_id UUID REFERENCES class_sessions(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    reminder_time TIMESTAMPTZ NOT NULL,
    reminder_type VARCHAR(50) NOT NULL, -- 'class', 'assignment', 'test', 'event'
    minutes_before INTEGER DEFAULT 15,
    is_enabled BOOLEAN DEFAULT TRUE,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_student_reminders_student ON student_reminders(student_id);
CREATE INDEX idx_student_reminders_time ON student_reminders(reminder_time);

-- =====================================================
-- 23. RESCHEDULE REQUESTS (NewEnhancedSchedule)
-- =====================================================

CREATE TABLE IF NOT EXISTS reschedule_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_session_id UUID NOT NULL REFERENCES class_sessions(id) ON DELETE CASCADE,
    requested_by_student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    current_time TIMESTAMPTZ NOT NULL,
    proposed_time TIMESTAMPTZ NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reschedule_requests_session ON reschedule_requests(class_session_id);
CREATE INDEX idx_reschedule_requests_student ON reschedule_requests(requested_by_student_id);

-- =====================================================
-- 24. TEST RESULTS/GRADES (NewProgressDetailScreen)
-- =====================================================

CREATE TABLE IF NOT EXISTS test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    test_type VARCHAR(50) NOT NULL, -- 'quiz', 'midterm', 'final', 'practice'
    test_date DATE NOT NULL,
    total_marks DECIMAL(6,2) NOT NULL,
    marks_obtained DECIMAL(6,2) NOT NULL,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS ((marks_obtained / total_marks) * 100) STORED,
    grade VARCHAR(5),
    rank_in_class INTEGER,
    total_students INTEGER,
    time_taken_minutes INTEGER,
    feedback TEXT,
    strengths TEXT[],
    weaknesses TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_test_results_student ON test_results(student_id);
CREATE INDEX idx_test_results_subject ON test_results(subject);
CREATE INDEX idx_test_results_date ON test_results(test_date DESC);

-- =====================================================
-- 25. STUDENT GOALS (NewStudentDashboard)
-- =====================================================

CREATE TABLE IF NOT EXISTS student_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal_type VARCHAR(50) NOT NULL, -- 'academic', 'attendance', 'assignment', 'test_score'
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(50) NOT NULL, -- 'assignments', 'tests', 'hours', 'percent'
    deadline DATE NOT NULL,
    status goal_status DEFAULT 'active',
    progress_percentage INTEGER GENERATED ALWAYS AS (
        CASE
            WHEN target_value > 0 THEN LEAST(100, ROUND((current_value / target_value) * 100))
            ELSE 0
        END
    ) STORED,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_student_goals_student ON student_goals(student_id);
CREATE INDEX idx_student_goals_status ON student_goals(status);

-- =====================================================
-- 26. GAMIFICATION SYSTEM (NewGamifiedLearningHub)
-- =====================================================

CREATE TABLE IF NOT EXISTS student_gamification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    assignments_completed_count INTEGER DEFAULT 0,
    tests_taken_count INTEGER DEFAULT 0,
    doubts_asked_count INTEGER DEFAULT 0,
    study_hours DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_student_gamification_student ON student_gamification(student_id);
CREATE INDEX idx_student_gamification_points ON student_gamification(total_points DESC);

-- =====================================================
-- 27. BADGES MASTER TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(10) NOT NULL DEFAULT '🏆',
    rarity badge_rarity DEFAULT 'common',
    category VARCHAR(50) NOT NULL, -- 'academic', 'social', 'special'
    requirement TEXT NOT NULL,
    points_required INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 28. STUDENT BADGES (Earned Badges)
-- =====================================================

CREATE TABLE IF NOT EXISTS student_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ,
    progress_percentage INTEGER DEFAULT 0,
    is_locked BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, badge_id)
);

CREATE INDEX idx_student_badges_student ON student_badges(student_id);
CREATE INDEX idx_student_badges_earned ON student_badges(earned_at DESC NULLS LAST);

-- =====================================================
-- 29. ACHIEVEMENTS LOG (Timeline)
-- =====================================================

CREATE TABLE IF NOT EXISTS student_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL, -- 'badge', 'milestone', 'level_up', 'streak'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) DEFAULT '🎉',
    points_awarded INTEGER DEFAULT 0,
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_student_achievements_student ON student_achievements(student_id);
CREATE INDEX idx_student_achievements_created ON student_achievements(created_at DESC);

-- =====================================================
-- 30. PEER CONNECTIONS (NewPeerLearningNetwork)
-- =====================================================

CREATE TABLE IF NOT EXISTS peer_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id_1 UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    student_id_2 UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    connection_type VARCHAR(50) DEFAULT 'peer', -- 'peer', 'study_buddy', 'mentor'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
    common_subjects TEXT[],
    match_percentage INTEGER,
    connected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id_1, student_id_2),
    CHECK (student_id_1 < student_id_2) -- Ensure unique bidirectional relationship
);

CREATE INDEX idx_peer_connections_student1 ON peer_connections(student_id_1);
CREATE INDEX idx_peer_connections_student2 ON peer_connections(student_id_2);

-- =====================================================
-- 31. STUDY GROUPS (NewPeerLearningNetwork)
-- =====================================================

CREATE TABLE IF NOT EXISTS study_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(100) NOT NULL,
    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
    created_by_student_id UUID NOT NULL REFERENCES students(id),
    max_members INTEGER DEFAULT 10,
    is_public BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_study_groups_batch ON study_groups(batch_id);
CREATE INDEX idx_study_groups_subject ON study_groups(subject);

-- =====================================================
-- 32. STUDY GROUP MEMBERS
-- =====================================================

CREATE TABLE IF NOT EXISTS study_group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- 'admin', 'moderator', 'member'
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, student_id)
);

CREATE INDEX idx_study_group_members_group ON study_group_members(group_id);
CREATE INDEX idx_study_group_members_student ON study_group_members(student_id);

-- =====================================================
-- 33. SHARED RESOURCES (NewPeerLearningNetwork)
-- =====================================================

CREATE TABLE IF NOT EXISTS shared_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type material_type NOT NULL,
    file_url TEXT NOT NULL,
    file_size VARCHAR(50),
    thumbnail_url TEXT,
    subject VARCHAR(100),
    tags TEXT[],
    shared_by_student_id UUID NOT NULL REFERENCES students(id),
    group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    downloads_count INTEGER DEFAULT 0,
    upvotes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shared_resources_student ON shared_resources(shared_by_student_id);
CREATE INDEX idx_shared_resources_group ON shared_resources(group_id);

-- =====================================================
-- 34. PEER LEADERBOARD (NewPeerLearningNetwork)
-- =====================================================

CREATE TABLE IF NOT EXISTS peer_leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    total_points INTEGER NOT NULL,
    week_number INTEGER,
    month_number INTEGER,
    year INTEGER,
    leaderboard_type VARCHAR(50) DEFAULT 'weekly', -- 'weekly', 'monthly', 'all_time'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(batch_id, student_id, leaderboard_type, week_number, month_number, year)
);

CREATE INDEX idx_peer_leaderboard_batch ON peer_leaderboard(batch_id);
CREATE INDEX idx_peer_leaderboard_rank ON peer_leaderboard(rank);

-- =====================================================
-- 35. WHITEBOARD SESSIONS (Whiteboard, NewVirtualClassroom)
-- =====================================================

-- Update existing whiteboard_data table
ALTER TABLE whiteboard_data
    ADD COLUMN IF NOT EXISTS session_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS is_collaborative BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS contributors UUID[],
    ADD COLUMN IF NOT EXISTS is_saved BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- =====================================================
-- 36. POLLS/QUIZZES (NewInteractiveClassroom)
-- =====================================================

-- Update existing polls table
ALTER TABLE polls
    ADD COLUMN IF NOT EXISTS poll_type VARCHAR(50) DEFAULT 'multiple_choice',
    ADD COLUMN IF NOT EXISTS correct_option_index INTEGER,
    ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS duration_seconds INTEGER,
    ADD COLUMN IF NOT EXISTS results_visible BOOLEAN DEFAULT TRUE;

-- =====================================================
-- 37. FLASHCARDS (NewEnhancedAIStudy)
-- =====================================================

CREATE TABLE IF NOT EXISTS flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    difficulty test_difficulty DEFAULT 'medium',
    is_mastered BOOLEAN DEFAULT FALSE,
    review_count INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    last_reviewed_at TIMESTAMPTZ,
    next_review_at TIMESTAMPTZ,
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_flashcards_student ON flashcards(student_id);
CREATE INDEX idx_flashcards_subject ON flashcards(subject);
CREATE INDEX idx_flashcards_next_review ON flashcards(next_review_at);

-- =====================================================
-- 38. STUDY PLANS (NewEnhancedAIStudy)
-- =====================================================

-- Update existing study_plans table
ALTER TABLE study_plans
    ADD COLUMN IF NOT EXISTS title VARCHAR(255),
    ADD COLUMN IF NOT EXISTS subject VARCHAR(100),
    ADD COLUMN IF NOT EXISTS duration_days INTEGER,
    ADD COLUMN IF NOT EXISTS tasks TEXT[],
    ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- =====================================================
-- 39. WEAK AREAS ANALYSIS (NewEnhancedAIStudy)
-- =====================================================

CREATE TABLE IF NOT EXISTS weak_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    current_score DECIMAL(5,2) NOT NULL,
    previous_score DECIMAL(5,2),
    improvement_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE
            WHEN previous_score > 0 THEN ROUND(((current_score - previous_score) / previous_score) * 100, 2)
            ELSE 0
        END
    ) STORED,
    suggestions TEXT[],
    practice_count INTEGER DEFAULT 0,
    last_practiced_at TIMESTAMPTZ,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_weak_areas_student ON weak_areas(student_id);
CREATE INDEX idx_weak_areas_subject ON weak_areas(subject);

-- =====================================================
-- 40. ASSIGNMENT SUBMISSIONS - UPDATE
-- =====================================================

-- Update existing assignment_submissions table
ALTER TABLE assignment_submissions
    ADD COLUMN IF NOT EXISTS is_collaborative BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS team_id UUID,
    ADD COLUMN IF NOT EXISTS version_number INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS last_edited_by UUID,
    ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMPTZ;

-- =====================================================
-- 41. TEAM ASSIGNMENTS (NewCollaborativeAssignment)
-- =====================================================

CREATE TABLE IF NOT EXISTS assignment_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    team_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assignment_teams_assignment ON assignment_teams(assignment_id);

-- =====================================================
-- 42. TEAM MEMBERS
-- =====================================================

CREATE TABLE IF NOT EXISTS assignment_team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES assignment_teams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- 'leader', 'member'
    contribution_percentage DECIMAL(5,2) DEFAULT 0,
    lines_added INTEGER DEFAULT 0,
    edits_count INTEGER DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, student_id)
);

CREATE INDEX idx_team_members_team ON assignment_team_members(team_id);
CREATE INDEX idx_team_members_student ON assignment_team_members(student_id);

-- =====================================================
-- 43. SUBMISSION VERSIONS (NewCollaborativeAssignment)
-- =====================================================

CREATE TABLE IF NOT EXISTS submission_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES assignment_submissions(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    changes_summary TEXT,
    author_id UUID NOT NULL REFERENCES students(id),
    author_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submission_versions_submission ON submission_versions(submission_id);

-- =====================================================
-- 44. ACTIVE EDITORS (Real-time tracking)
-- =====================================================

CREATE TABLE IF NOT EXISTS active_editors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES assignment_submissions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    section VARCHAR(255),
    cursor_position JSONB,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(submission_id, student_id)
);

CREATE INDEX idx_active_editors_submission ON active_editors(submission_id);

-- =====================================================
-- 45. GOOGLE CALENDAR SYNC (NewEnhancedSchedule)
-- =====================================================

CREATE TABLE IF NOT EXISTS google_calendar_sync (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    is_enabled BOOLEAN DEFAULT FALSE,
    google_calendar_id VARCHAR(255),
    access_token_encrypted TEXT,
    refresh_token_encrypted TEXT,
    last_synced_at TIMESTAMPTZ,
    sync_frequency_minutes INTEGER DEFAULT 60,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 46. PERFORMANCE CHARTS DATA (NewStudentDashboard)
-- =====================================================

CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    subject VARCHAR(100),
    average_score DECIMAL(5,2),
    assignments_completed INTEGER DEFAULT 0,
    attendance_percentage DECIMAL(5,2),
    study_time_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, metric_date, subject)
);

CREATE INDEX idx_performance_metrics_student ON performance_metrics(student_id);
CREATE INDEX idx_performance_metrics_date ON performance_metrics(metric_date DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE student_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE doubt_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_practice_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_study_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_material_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_class_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_class_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborative_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reschedule_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE weak_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_editors ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_calendar_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Students can only see their own data
CREATE POLICY "Students can view own activities" ON student_activities FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view own AI conversations" ON ai_conversations FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view own study materials" ON study_material_views FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view own class notes" ON class_notes FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view own reminders" ON student_reminders FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view own test results" ON test_results FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view own goals" ON student_goals FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view own gamification" ON student_gamification FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view own badges" ON student_badges FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view own achievements" ON student_achievements FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view own flashcards" ON flashcards FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view own weak areas" ON weak_areas FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view own performance" ON performance_metrics FOR SELECT USING (auth.uid() = student_id);

-- Public read for some tables (badges master, study groups, etc.)
CREATE POLICY "Badges are publicly readable" ON badges FOR SELECT USING (true);
CREATE POLICY "Study groups are visible to batch members" ON study_groups FOR SELECT USING (true);
CREATE POLICY "Shared resources are visible based on privacy" ON shared_resources FOR SELECT USING (is_public = true OR auth.uid() = shared_by_student_id);

-- =====================================================
-- SEED DATA FOR TESTING
-- =====================================================

-- Student ID: 96055c84-a9ee-496d-8360-6b7cea64b928
-- Batch ID: 57ab5ec8-fac5-49f9-b64c-38e4b526ef84

-- Initialize gamification for test student
INSERT INTO student_gamification (student_id, total_points, level, xp, streak_days)
VALUES ('96055c84-a9ee-496d-8360-6b7cea64b928', 1250, 5, 250, 7)
ON CONFLICT (student_id) DO NOTHING;

-- Create sample badges
INSERT INTO badges (name, description, icon, rarity, category, requirement, points_required) VALUES
('First Assignment', 'Complete your first assignment', '📝', 'common', 'Academic', 'Submit 1 assignment', 10),
('Perfect Attendance', 'Attend all classes in a week', '✅', 'rare', 'Academic', '100% attendance for 1 week', 50),
('Study Streak Master', 'Maintain a 7-day study streak', '🔥', 'epic', 'Academic', 'Study 7 days in a row', 100),
('Top Performer', 'Score above 90% in 3 tests', '🏆', 'legendary', 'Academic', 'Score 90%+ in 3 tests', 200),
('Team Player', 'Complete 5 collaborative assignments', '👥', 'rare', 'Social', 'Complete 5 group assignments', 75),
('Doubt Resolver', 'Help answer 10 peer doubts', '💡', 'epic', 'Social', 'Answer 10 doubts', 125)
ON CONFLICT (name) DO NOTHING;

-- Assign badges to test student
INSERT INTO student_badges (student_id, badge_id, earned_at, progress_percentage, is_locked)
SELECT '96055c84-a9ee-496d-8360-6b7cea64b928', id, NOW(), 100, FALSE
FROM badges WHERE name IN ('First Assignment', 'Perfect Attendance')
ON CONFLICT (student_id, badge_id) DO NOTHING;

-- Create sample activities
INSERT INTO student_activities (student_id, title, description, type, priority, related_subject) VALUES
('96055c84-a9ee-496d-8360-6b7cea64b928', 'New Assignment Posted', 'Math Assignment Chapter 5 has been posted', 'assignment', 'high', 'Mathematics'),
('96055c84-a9ee-496d-8360-6b7cea64b928', 'Test Results Available', 'Your Physics Midterm results are now available', 'grade', 'high', 'Physics'),
('96055c84-a9ee-496d-8360-6b7cea64b928', 'Class Rescheduled', 'Tomorrow''s Chemistry class has been rescheduled', 'class', 'medium', 'Chemistry')
ON CONFLICT DO NOTHING;

-- Create sample calendar events
INSERT INTO calendar_events (batch_id, title, description, event_type, subject, event_date, start_time, end_time, created_by) VALUES
('57ab5ec8-fac5-49f9-b64c-38e4b526ef84', 'Math Test', 'Chapters 1-5 Final Test', 'test', 'Mathematics', CURRENT_DATE + INTERVAL '7 days', '09:00', '11:00', '96055c84-a9ee-496d-8360-6b7cea64b928'),
('57ab5ec8-fac5-49f9-b64c-38e4b526ef84', 'Physics Assignment Due', 'Lab Report Submission', 'assignment', 'Physics', CURRENT_DATE + INTERVAL '3 days', '17:00', '17:00', '96055c84-a9ee-496d-8360-6b7cea64b928'),
('57ab5ec8-fac5-49f9-b64c-38e4b526ef84', 'Science Fair', 'Annual Science Fair Event', 'event', NULL, CURRENT_DATE + INTERVAL '14 days', '10:00', '16:00', '96055c84-a9ee-496d-8360-6b7cea64b928')
ON CONFLICT DO NOTHING;

-- Create sample goals
INSERT INTO student_goals (student_id, title, description, goal_type, target_value, current_value, unit, deadline) VALUES
('96055c84-a9ee-496d-8360-6b7cea64b928', 'Complete 20 Assignments', 'Finish all pending assignments this month', 'assignment', 20, 12, 'assignments', CURRENT_DATE + INTERVAL '30 days'),
('96055c84-a9ee-496d-8360-6b7cea64b928', 'Achieve 90% Attendance', 'Maintain excellent attendance record', 'attendance', 90, 85, 'percent', CURRENT_DATE + INTERVAL '60 days'),
('96055c84-a9ee-496d-8360-6b7cea64b928', 'Score 80%+ in Tests', 'Improve test performance', 'test_score', 80, 75, 'percent', CURRENT_DATE + INTERVAL '45 days')
ON CONFLICT DO NOTHING;

-- Create sample test results
INSERT INTO test_results (student_id, subject, test_name, test_type, test_date, total_marks, marks_obtained, grade) VALUES
('96055c84-a9ee-496d-8360-6b7cea64b928', 'Mathematics', 'Algebra Quiz', 'quiz', CURRENT_DATE - INTERVAL '7 days', 100, 85, 'A'),
('96055c84-a9ee-496d-8360-6b7cea64b928', 'Physics', 'Mechanics Midterm', 'midterm', CURRENT_DATE - INTERVAL '14 days', 100, 78, 'B+'),
('96055c84-a9ee-496d-8360-6b7cea64b928', 'Chemistry', 'Organic Chemistry Test', 'quiz', CURRENT_DATE - INTERVAL '5 days', 50, 42, 'B')
ON CONFLICT DO NOTHING;

-- Create sample class sessions for today
INSERT INTO class_sessions (batch_id, subject, title, teacher_id, start_time, end_time, status)
SELECT
    '57ab5ec8-fac5-49f9-b64c-38e4b526ef84',
    'Mathematics',
    'Calculus - Derivatives',
    t.id,
    CURRENT_DATE + TIME '09:00',
    CURRENT_DATE + TIME '10:30',
    'scheduled'
FROM teachers t LIMIT 1
ON CONFLICT DO NOTHING;

-- Create sample AI conversation
INSERT INTO ai_conversations (student_id, title, subject, conversation_type, message_count) VALUES
('96055c84-a9ee-496d-8360-6b7cea64b928', 'Math Help Session', 'Mathematics', 'tutor', 5)
ON CONFLICT DO NOTHING;

-- Create performance metrics for last 7 days
INSERT INTO performance_metrics (student_id, metric_date, subject, average_score, assignments_completed, attendance_percentage)
SELECT
    '96055c84-a9ee-496d-8360-6b7cea64b928',
    CURRENT_DATE - (n || ' days')::INTERVAL,
    'Mathematics',
    70 + (n * 3)::DECIMAL(5,2),
    n % 3,
    85 + (n * 2)::DECIMAL(5,2)
FROM generate_series(0, 6) AS n
ON CONFLICT (student_id, metric_date, subject) DO NOTHING;

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_student_activities_updated_at BEFORE UPDATE ON student_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_class_sessions_updated_at BEFORE UPDATE ON class_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_class_notes_updated_at BEFORE UPDATE ON class_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_goals_updated_at BEFORE UPDATE ON student_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_gamification_updated_at BEFORE UPDATE ON student_gamification FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_groups_updated_at BEFORE UPDATE ON study_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weak_areas_updated_at BEFORE UPDATE ON weak_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Student screens database schema created successfully!';
    RAISE NOTICE '📊 Total tables created/updated: 46';
    RAISE NOTICE '🎯 Student ID for testing: 96055c84-a9ee-496d-8360-6b7cea64b928';
    RAISE NOTICE '🎒 Batch ID for testing: 57ab5ec8-fac5-49f9-b64c-38e4b526ef84';
    RAISE NOTICE '✨ Seed data inserted for all screens';
END $$;

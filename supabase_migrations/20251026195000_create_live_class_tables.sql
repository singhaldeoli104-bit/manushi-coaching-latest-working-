-- Migration: create live class tables and policies
-- Generated: 2025-10-26

create extension if not exists "uuid-ossp";

-- Live class sessions -------------------------------------------------------
create table if not exists public.live_class_sessions (
    id uuid primary key default uuid_generate_v4(),
    class_id uuid references public.classes (id) on delete set null,
    teacher_id uuid references public.teachers (id) on delete set null,
    scheduled_start timestamptz,
    actual_start timestamptz,
    actual_end timestamptz,
    status text not null default 'scheduled' check (status in ('scheduled','live','paused','ended','cancelled')),
    recording_url text,
    recording_duration_seconds integer,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_live_class_sessions_class_id on public.live_class_sessions (class_id);
create index if not exists idx_live_class_sessions_teacher_id on public.live_class_sessions (teacher_id);
create index if not exists idx_live_class_sessions_status on public.live_class_sessions (status);

-- Participants --------------------------------------------------------------
create table if not exists public.live_class_participants (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid not null references public.live_class_sessions (id) on delete cascade,
    student_id uuid references public.students (id) on delete set null,
    profile_id uuid references public.profiles (id) on delete set null,
    join_time timestamptz,
    leave_time timestamptz,
    audio_enabled boolean not null default false,
    video_enabled boolean not null default false,
    hand_raised boolean not null default false,
    connection_status text not null default 'good',
    last_seen_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_live_class_participants_session on public.live_class_participants (session_id);
create index if not exists idx_live_class_participants_student on public.live_class_participants (student_id);

-- Attendance ----------------------------------------------------------------
create table if not exists public.live_class_attendance (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid not null references public.live_class_sessions (id) on delete cascade,
    student_id uuid not null references public.students (id) on delete cascade,
    status text not null default 'present' check (status in ('present','absent','late','excused')),
    marked_by uuid references public.teachers (id) on delete set null,
    marked_at timestamptz not null default now(),
    notes text
);

create unique index if not exists idx_live_class_attendance_unique on public.live_class_attendance (session_id, student_id);

-- Chat ----------------------------------------------------------------------
create table if not exists public.live_class_chat_messages (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid not null references public.live_class_sessions (id) on delete cascade,
    sender_id uuid references public.profiles (id) on delete set null,
    message text not null,
    message_type text not null default 'text',
    is_private boolean not null default false,
    recipient_id uuid references public.profiles (id) on delete set null,
    created_at timestamptz not null default now()
);

create index if not exists idx_live_class_chat_session on public.live_class_chat_messages (session_id);
create index if not exists idx_live_class_chat_sender on public.live_class_chat_messages (sender_id);

-- Polls ---------------------------------------------------------------------
create table if not exists public.live_class_polls (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid not null references public.live_class_sessions (id) on delete cascade,
    question text not null,
    status text not null default 'active' check (status in ('draft','active','closed')),
    created_by uuid references public.teachers (id) on delete set null,
    created_at timestamptz not null default now(),
    closes_at timestamptz
);

create table if not exists public.live_class_poll_options (
    id uuid primary key default uuid_generate_v4(),
    poll_id uuid not null references public.live_class_polls (id) on delete cascade,
    option_text text not null,
    position integer not null default 0
);

create table if not exists public.live_class_poll_responses (
    id uuid primary key default uuid_generate_v4(),
    poll_id uuid not null references public.live_class_polls (id) on delete cascade,
    participant_id uuid references public.live_class_participants (id) on delete cascade,
    option_id uuid not null references public.live_class_poll_options (id) on delete cascade,
    responded_at timestamptz not null default now()
);

create unique index if not exists idx_live_class_poll_responses_unique on public.live_class_poll_responses (poll_id, participant_id);

-- Quizzes -------------------------------------------------------------------
create table if not exists public.live_class_quizzes (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid not null references public.live_class_sessions (id) on delete cascade,
    title text not null,
    status text not null default 'draft' check (status in ('draft','active','closed')),
    time_limit_seconds integer,
    created_by uuid references public.teachers (id) on delete set null,
    created_at timestamptz not null default now(),
    closes_at timestamptz
);

create table if not exists public.live_class_quiz_questions (
    id uuid primary key default uuid_generate_v4(),
    quiz_id uuid not null references public.live_class_quizzes (id) on delete cascade,
    question_text text not null,
    question_type text not null default 'multiple-choice',
    choices jsonb,
    correct_answer jsonb,
    position integer not null default 0
);

create table if not exists public.live_class_quiz_responses (
    id uuid primary key default uuid_generate_v4(),
    quiz_id uuid not null references public.live_class_quizzes (id) on delete cascade,
    question_id uuid not null references public.live_class_quiz_questions (id) on delete cascade,
    participant_id uuid references public.live_class_participants (id) on delete cascade,
    response jsonb not null,
    score numeric,
    responded_at timestamptz not null default now()
);

create unique index if not exists idx_live_class_quiz_responses_unique on public.live_class_quiz_responses (quiz_id, question_id, participant_id);

-- Whiteboard ----------------------------------------------------------------
create table if not exists public.live_class_whiteboards (
    session_id uuid primary key references public.live_class_sessions (id) on delete cascade,
    content jsonb not null default '{}'::jsonb,
    updated_by uuid references public.teachers (id) on delete set null,
    updated_at timestamptz not null default now()
);

-- Basic Row Level Security --------------------------------------------------
alter table public.live_class_sessions enable row level security;
alter table public.live_class_participants enable row level security;
alter table public.live_class_attendance enable row level security;
alter table public.live_class_chat_messages enable row level security;
alter table public.live_class_polls enable row level security;
alter table public.live_class_poll_options enable row level security;
alter table public.live_class_poll_responses enable row level security;
alter table public.live_class_quizzes enable row level security;
alter table public.live_class_quiz_questions enable row level security;
alter table public.live_class_quiz_responses enable row level security;
alter table public.live_class_whiteboards enable row level security;

-- Teachers: can access sessions they own -----------------------------------
create policy if not exists "Teachers manage own live sessions"
    on public.live_class_sessions
    for all
    using (auth.uid() = teacher_id)
    with check (auth.uid() = teacher_id);

create policy if not exists "Teachers view session participants"
    on public.live_class_participants
    for select
    using (
        exists (
            select 1
            from public.live_class_sessions s
            where s.id = live_class_participants.session_id
            and s.teacher_id = auth.uid()
        )
    );

create policy if not exists "Teachers manage session participants"
    on public.live_class_participants
    for all
    using (
        exists (
            select 1
            from public.live_class_sessions s
            where s.id = live_class_participants.session_id
            and s.teacher_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1
            from public.live_class_sessions s
            where s.id = live_class_participants.session_id
            and s.teacher_id = auth.uid()
        )
    );

-- Additional policies (chat, polls, quizzes) mirror session ownership -------
create policy if not exists "Teachers manage session chat"
    on public.live_class_chat_messages
    for all
    using (
        exists (
            select 1
            from public.live_class_sessions s
            where s.id = live_class_chat_messages.session_id
            and s.teacher_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1
            from public.live_class_sessions s
            where s.id = live_class_chat_messages.session_id
            and s.teacher_id = auth.uid()
        )
    );

create policy if not exists "Teachers manage session polls"
    on public.live_class_polls
    for all
    using (
        exists (
            select 1
            from public.live_class_sessions s
            where s.id = live_class_polls.session_id
            and s.teacher_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1
            from public.live_class_sessions s
            where s.id = live_class_polls.session_id
            and s.teacher_id = auth.uid()
        )
    );

create policy if not exists "Teachers manage session quizzes"
    on public.live_class_quizzes
    for all
    using (
        exists (
            select 1
            from public.live_class_sessions s
            where s.id = live_class_quizzes.session_id
            and s.teacher_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1
            from public.live_class_sessions s
            where s.id = live_class_quizzes.session_id
            and s.teacher_id = auth.uid()
        )
    );

create policy if not exists "Teachers manage session whiteboard"
    on public.live_class_whiteboards
    for all
    using (
        exists (
            select 1
            from public.live_class_sessions s
            where s.id = live_class_whiteboards.session_id
            and s.teacher_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1
            from public.live_class_sessions s
            where s.id = live_class_whiteboards.session_id
            and s.teacher_id = auth.uid()
        )
    );

-- TODO: add student-facing select policies and service role exemptions as needed.


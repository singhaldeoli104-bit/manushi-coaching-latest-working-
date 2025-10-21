-- ================================================
-- Migration: 003 - Create School Announcement Tables
-- Description: Tables for school announcements, contacts, and events
-- Dependencies: 001_create_parent_tables.sql
-- ================================================

-- ================================================
-- 1. School Announcements Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.school_announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    announcement_type TEXT NOT NULL CHECK (announcement_type IN ('general', 'urgent', 'event', 'academic', 'administrative', 'emergency')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    target_audience JSONB DEFAULT '["all"]'::jsonb,
    attachments JSONB DEFAULT '[]'::jsonb,
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_published BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    author_id UUID REFERENCES auth.users(id),
    author_name TEXT,
    author_role TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_school_announcements_school_id ON public.school_announcements(school_id);
CREATE INDEX IF NOT EXISTS idx_school_announcements_announcement_type ON public.school_announcements(announcement_type);
CREATE INDEX IF NOT EXISTS idx_school_announcements_priority ON public.school_announcements(priority);
CREATE INDEX IF NOT EXISTS idx_school_announcements_published_at ON public.school_announcements(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_school_announcements_is_published ON public.school_announcements(is_published);
CREATE INDEX IF NOT EXISTS idx_school_announcements_is_pinned ON public.school_announcements(is_pinned);
CREATE INDEX IF NOT EXISTS idx_school_announcements_expires_at ON public.school_announcements(expires_at);

COMMENT ON TABLE public.school_announcements IS 'School-wide announcements and important notices';
COMMENT ON COLUMN public.school_announcements.target_audience IS 'Array of target audiences (all, parents, students, teachers, grade_X, class_Y)';
COMMENT ON COLUMN public.school_announcements.attachments IS 'Array of attachment objects with URLs and metadata';

-- ================================================
-- 2. Announcement Reads Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.announcement_reads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id UUID REFERENCES public.school_announcements(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(announcement_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_announcement_reads_announcement_id ON public.announcement_reads(announcement_id);
CREATE INDEX IF NOT EXISTS idx_announcement_reads_user_id ON public.announcement_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_announcement_reads_read_at ON public.announcement_reads(read_at DESC);

COMMENT ON TABLE public.announcement_reads IS 'Tracking which users have read which announcements';

-- ================================================
-- 3. School Contacts Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.school_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    contact_type TEXT NOT NULL CHECK (contact_type IN ('principal', 'vice_principal', 'teacher', 'counselor', 'nurse', 'administrative', 'emergency', 'other')),
    name TEXT NOT NULL,
    title TEXT,
    department TEXT,
    email TEXT,
    phone TEXT,
    mobile TEXT,
    office_location TEXT,
    office_hours TEXT,
    availability_notes TEXT,
    photo_url TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_school_contacts_school_id ON public.school_contacts(school_id);
CREATE INDEX IF NOT EXISTS idx_school_contacts_contact_type ON public.school_contacts(contact_type);
CREATE INDEX IF NOT EXISTS idx_school_contacts_is_primary ON public.school_contacts(is_primary);
CREATE INDEX IF NOT EXISTS idx_school_contacts_is_active ON public.school_contacts(is_active);
CREATE INDEX IF NOT EXISTS idx_school_contacts_display_order ON public.school_contacts(display_order);

COMMENT ON TABLE public.school_contacts IS 'School staff contacts and directory';
COMMENT ON COLUMN public.school_contacts.is_primary IS 'Primary contact for this contact type';

-- ================================================
-- 4. School Events Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.school_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL CHECK (event_type IN ('academic', 'sports', 'cultural', 'parent_meeting', 'holiday', 'exam', 'workshop', 'celebration', 'other')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    is_all_day BOOLEAN DEFAULT FALSE,
    target_audience JSONB DEFAULT '["all"]'::jsonb,
    organizer TEXT,
    contact_person TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    registration_required BOOLEAN DEFAULT FALSE,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    attachments JSONB DEFAULT '[]'::jsonb,
    is_cancelled BOOLEAN DEFAULT FALSE,
    cancellation_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_school_events_school_id ON public.school_events(school_id);
CREATE INDEX IF NOT EXISTS idx_school_events_event_type ON public.school_events(event_type);
CREATE INDEX IF NOT EXISTS idx_school_events_start_date ON public.school_events(start_date);
CREATE INDEX IF NOT EXISTS idx_school_events_end_date ON public.school_events(end_date);
CREATE INDEX IF NOT EXISTS idx_school_events_is_cancelled ON public.school_events(is_cancelled);

COMMENT ON TABLE public.school_events IS 'School events, activities, and important dates';
COMMENT ON COLUMN public.school_events.target_audience IS 'Array of target audiences (all, parents, students, specific_grades)';

-- ================================================
-- 5. Event RSVPs Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.event_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.school_events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
    response TEXT NOT NULL CHECK (response IN ('attending', 'not_attending', 'maybe')),
    number_of_guests INTEGER DEFAULT 0,
    special_requirements TEXT,
    rsvp_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_rsvps_event_id ON public.event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user_id ON public.event_rsvps(user_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_child_id ON public.event_rsvps(child_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_response ON public.event_rsvps(response);

COMMENT ON TABLE public.event_rsvps IS 'Event RSVPs and attendance confirmations';

-- ================================================
-- 6. School Documents Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.school_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    document_type TEXT NOT NULL CHECK (document_type IN ('policy', 'handbook', 'calendar', 'form', 'report', 'newsletter', 'syllabus', 'other')),
    category TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    version TEXT,
    published_date DATE,
    academic_year TEXT,
    target_audience JSONB DEFAULT '["all"]'::jsonb,
    is_published BOOLEAN DEFAULT TRUE,
    download_count INTEGER DEFAULT 0,
    requires_signature BOOLEAN DEFAULT FALSE,
    uploaded_by UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_school_documents_school_id ON public.school_documents(school_id);
CREATE INDEX IF NOT EXISTS idx_school_documents_document_type ON public.school_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_school_documents_category ON public.school_documents(category);
CREATE INDEX IF NOT EXISTS idx_school_documents_academic_year ON public.school_documents(academic_year);
CREATE INDEX IF NOT EXISTS idx_school_documents_is_published ON public.school_documents(is_published);

COMMENT ON TABLE public.school_documents IS 'School documents, forms, and resources';

-- ================================================
-- 7. Document Downloads Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.document_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES public.school_documents(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_document_downloads_document_id ON public.document_downloads(document_id);
CREATE INDEX IF NOT EXISTS idx_document_downloads_user_id ON public.document_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_document_downloads_downloaded_at ON public.document_downloads(downloaded_at DESC);

COMMENT ON TABLE public.document_downloads IS 'Tracking document downloads';

-- ================================================
-- Row Level Security Policies
-- ================================================

-- School Announcements RLS
ALTER TABLE public.school_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view published announcements from their school"
    ON public.school_announcements FOR SELECT
    USING (
        is_published = TRUE AND
        (expires_at IS NULL OR expires_at > NOW()) AND
        school_id IN (
            SELECT c.school_id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Announcement Reads RLS
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own announcement reads"
    ON public.announcement_reads FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own announcement reads"
    ON public.announcement_reads FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- School Contacts RLS
ALTER TABLE public.school_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view active contacts from their school"
    ON public.school_contacts FOR SELECT
    USING (
        is_active = TRUE AND
        school_id IN (
            SELECT c.school_id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- School Events RLS
ALTER TABLE public.school_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view events from their school"
    ON public.school_events FOR SELECT
    USING (
        school_id IN (
            SELECT c.school_id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Event RSVPs RLS
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own RSVPs"
    ON public.event_rsvps FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own RSVPs"
    ON public.event_rsvps FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own RSVPs"
    ON public.event_rsvps FOR UPDATE
    USING (user_id = auth.uid());

-- School Documents RLS
ALTER TABLE public.school_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view published documents from their school"
    ON public.school_documents FOR SELECT
    USING (
        is_published = TRUE AND
        school_id IN (
            SELECT c.school_id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Document Downloads RLS
ALTER TABLE public.document_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own document downloads"
    ON public.document_downloads FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own document downloads"
    ON public.document_downloads FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- ================================================
-- Triggers for updated_at
-- ================================================
CREATE TRIGGER update_school_announcements_updated_at
    BEFORE UPDATE ON public.school_announcements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_school_contacts_updated_at
    BEFORE UPDATE ON public.school_contacts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_school_events_updated_at
    BEFORE UPDATE ON public.school_events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_rsvps_updated_at
    BEFORE UPDATE ON public.event_rsvps
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_school_documents_updated_at
    BEFORE UPDATE ON public.school_documents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

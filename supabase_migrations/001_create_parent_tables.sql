-- Migration: Create Parent Section Core Tables
-- Created: 2025-01-19
-- Description: Creates all core tables for parent section functionality

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: parents
-- Purpose: Store parent/guardian information
-- =====================================================
CREATE TABLE IF NOT EXISTS public.parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'India',
    profile_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT parents_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for parents table
CREATE INDEX IF NOT EXISTS idx_parents_user_id ON public.parents(user_id);
CREATE INDEX IF NOT EXISTS idx_parents_email ON public.parents(email);

-- RLS Policies for parents
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view their own profile" ON public.parents;
CREATE POLICY "Parents can view their own profile"
    ON public.parents FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Parents can update their own profile" ON public.parents;
CREATE POLICY "Parents can update their own profile"
    ON public.parents FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Parents can insert their own profile" ON public.parents;
CREATE POLICY "Parents can insert their own profile"
    ON public.parents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- TABLE: schools
-- Purpose: Store school information
-- =====================================================
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'India',
    phone TEXT,
    email TEXT,
    website TEXT,
    principal_name TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for schools
CREATE INDEX IF NOT EXISTS idx_schools_name ON public.schools(name);

-- RLS for schools (public read)
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Schools are viewable by authenticated users" ON public.schools;
CREATE POLICY "Schools are viewable by authenticated users"
    ON public.schools FOR SELECT
    USING (auth.role() = 'authenticated');

-- =====================================================
-- TABLE: children
-- Purpose: Store information about children/students
-- =====================================================
CREATE TABLE IF NOT EXISTS public.children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT UNIQUE,
    full_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    grade TEXT NOT NULL,
    section TEXT,
    school_id UUID REFERENCES public.schools(id),
    roll_number TEXT,
    admission_date DATE,
    profile_image_url TEXT,
    blood_group TEXT,
    medical_conditions TEXT,
    allergies TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for children
CREATE INDEX IF NOT EXISTS idx_children_school_id ON public.children(school_id);
CREATE INDEX IF NOT EXISTS idx_children_grade ON public.children(grade);
CREATE INDEX IF NOT EXISTS idx_children_student_id ON public.children(student_id);
CREATE INDEX IF NOT EXISTS idx_children_is_active ON public.children(is_active);

-- RLS for children (complex - based on parent relationship)
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

-- Note: RLS policy for children will be created after parent_child_relationships table

-- =====================================================
-- TABLE: parent_child_relationships
-- Purpose: Junction table for parent-child relationships
-- =====================================================
CREATE TABLE IF NOT EXISTS public.parent_child_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES public.parents(id) ON DELETE CASCADE NOT NULL,
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    relationship_type TEXT NOT NULL CHECK (relationship_type IN ('mother', 'father', 'guardian', 'other')),
    is_primary_contact BOOLEAN DEFAULT FALSE NOT NULL,
    can_view_academics BOOLEAN DEFAULT TRUE NOT NULL,
    can_view_financial BOOLEAN DEFAULT TRUE NOT NULL,
    can_make_payments BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    UNIQUE(parent_id, child_id)
);

-- Indexes for parent_child_relationships
CREATE INDEX IF NOT EXISTS idx_parent_child_parent_id ON public.parent_child_relationships(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_child_id ON public.parent_child_relationships(child_id);

-- RLS for parent_child_relationships
ALTER TABLE public.parent_child_relationships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view their relationships" ON public.parent_child_relationships;
CREATE POLICY "Parents can view their relationships"
    ON public.parent_child_relationships FOR SELECT
    USING (
        parent_id IN (SELECT id FROM public.parents WHERE user_id = auth.uid())
    );

-- Now create RLS policy for children table
DROP POLICY IF EXISTS "Parents can view their children" ON public.children;
CREATE POLICY "Parents can view their children"
    ON public.children FOR SELECT
    USING (
        id IN (
            SELECT child_id FROM public.parent_child_relationships
            WHERE parent_id IN (SELECT id FROM public.parents WHERE user_id = auth.uid())
        )
    );

-- =====================================================
-- TABLE: academic_records
-- Purpose: Store academic performance data
-- =====================================================
CREATE TABLE IF NOT EXISTS public.academic_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    assessment_type TEXT CHECK (assessment_type IN ('exam', 'assignment', 'project', 'quiz', 'practical')),
    assessment_name TEXT,
    score NUMERIC(5,2),
    max_score NUMERIC(5,2),
    percentage NUMERIC(5,2),
    grade TEXT,
    assessment_date DATE,
    teacher_id UUID,
    teacher_comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for academic_records
CREATE INDEX IF NOT EXISTS idx_academic_records_child_id ON public.academic_records(child_id);
CREATE INDEX IF NOT EXISTS idx_academic_records_subject ON public.academic_records(subject);
CREATE INDEX IF NOT EXISTS idx_academic_records_date ON public.academic_records(assessment_date DESC);
CREATE INDEX IF NOT EXISTS idx_academic_records_type ON public.academic_records(assessment_type);

-- RLS for academic_records
ALTER TABLE public.academic_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view their children's academic records" ON public.academic_records;
CREATE POLICY "Parents can view their children's academic records"
    ON public.academic_records FOR SELECT
    USING (
        child_id IN (
            SELECT child_id FROM public.parent_child_relationships
            WHERE parent_id IN (SELECT id FROM public.parents WHERE user_id = auth.uid())
            AND can_view_academics = TRUE
        )
    );

-- =====================================================
-- TABLE: financial_transactions
-- Purpose: Store all financial transactions
-- =====================================================
CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES public.parents(id) NOT NULL,
    child_id UUID REFERENCES public.children(id),
    transaction_type TEXT CHECK (transaction_type IN ('fee_payment', 'refund', 'discount', 'penalty')) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR' NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('tuition', 'transport', 'books', 'uniform', 'exam', 'other')),
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')) DEFAULT 'pending' NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('cash', 'upi', 'card', 'bank_transfer', 'online')),
    payment_gateway_id TEXT,
    payment_gateway_response JSONB,
    receipt_number TEXT UNIQUE,
    receipt_url TEXT,
    due_date DATE,
    paid_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for financial_transactions
CREATE INDEX IF NOT EXISTS idx_financial_transactions_parent_id ON public.financial_transactions(parent_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_child_id ON public.financial_transactions(child_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_status ON public.financial_transactions(status);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON public.financial_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_receipt ON public.financial_transactions(receipt_number);

-- RLS for financial_transactions
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view their own transactions" ON public.financial_transactions;
CREATE POLICY "Parents can view their own transactions"
    ON public.financial_transactions FOR SELECT
    USING (
        parent_id IN (SELECT id FROM public.parents WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Parents can insert their own transactions" ON public.financial_transactions;
CREATE POLICY "Parents can insert their own transactions"
    ON public.financial_transactions FOR INSERT
    WITH CHECK (
        parent_id IN (SELECT id FROM public.parents WHERE user_id = auth.uid())
    );

-- =====================================================
-- TABLE: communications
-- Purpose: Store messages between parents and teachers/admin
-- =====================================================
CREATE TABLE IF NOT EXISTS public.communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID REFERENCES auth.users(id) NOT NULL,
    from_role TEXT CHECK (from_role IN ('parent', 'teacher', 'admin', 'principal')) NOT NULL,
    to_user_id UUID REFERENCES auth.users(id) NOT NULL,
    to_role TEXT CHECK (to_role IN ('parent', 'teacher', 'admin', 'principal')) NOT NULL,
    child_id UUID REFERENCES public.children(id),
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium' NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    read_at TIMESTAMPTZ,
    requires_response BOOLEAN DEFAULT FALSE NOT NULL,
    parent_message_id UUID REFERENCES public.communications(id),
    attachments JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for communications
CREATE INDEX IF NOT EXISTS idx_communications_to_user_id ON public.communications(to_user_id);
CREATE INDEX IF NOT EXISTS idx_communications_from_user_id ON public.communications(from_user_id);
CREATE INDEX IF NOT EXISTS idx_communications_child_id ON public.communications(child_id);
CREATE INDEX IF NOT EXISTS idx_communications_is_read ON public.communications(is_read);
CREATE INDEX IF NOT EXISTS idx_communications_created_at ON public.communications(created_at DESC);

-- RLS for communications
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their communications" ON public.communications;
CREATE POLICY "Users can view their communications"
    ON public.communications FOR SELECT
    USING (to_user_id = auth.uid() OR from_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can send communications" ON public.communications;
CREATE POLICY "Users can send communications"
    ON public.communications FOR INSERT
    WITH CHECK (from_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their received communications" ON public.communications;
CREATE POLICY "Users can update their received communications"
    ON public.communications FOR UPDATE
    USING (to_user_id = auth.uid());

-- =====================================================
-- TABLE: action_items
-- Purpose: Store action items/tasks for parents
-- =====================================================
CREATE TABLE IF NOT EXISTS public.action_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES public.parents(id) NOT NULL,
    child_id UUID REFERENCES public.children(id),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('payment', 'form', 'meeting', 'document', 'permission', 'other')) NOT NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium' NOT NULL,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue', 'cancelled')) DEFAULT 'pending' NOT NULL,
    due_date DATE,
    completed_date TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for action_items
CREATE INDEX IF NOT EXISTS idx_action_items_parent_id ON public.action_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_action_items_child_id ON public.action_items(child_id);
CREATE INDEX IF NOT EXISTS idx_action_items_status ON public.action_items(status);
CREATE INDEX IF NOT EXISTS idx_action_items_due_date ON public.action_items(due_date);

-- RLS for action_items
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view their action items" ON public.action_items;
CREATE POLICY "Parents can view their action items"
    ON public.action_items FOR SELECT
    USING (
        parent_id IN (SELECT id FROM public.parents WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Parents can update their action items" ON public.action_items;
CREATE POLICY "Parents can update their action items"
    ON public.action_items FOR UPDATE
    USING (
        parent_id IN (SELECT id FROM public.parents WHERE user_id = auth.uid())
    );

-- =====================================================
-- TABLE: notifications
-- Purpose: Store notifications for users
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    type TEXT CHECK (type IN ('message', 'grade_update', 'payment_due', 'payment_success', 'announcement', 'emergency', 'reminder')) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium' NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    read_at TIMESTAMPTZ,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (user_id = auth.uid());

-- =====================================================
-- FUNCTIONS: Updated_at trigger
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
DROP TRIGGER IF EXISTS update_parents_updated_at ON public.parents;
CREATE TRIGGER update_parents_updated_at
    BEFORE UPDATE ON public.parents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_schools_updated_at ON public.schools;
CREATE TRIGGER update_schools_updated_at
    BEFORE UPDATE ON public.schools
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_children_updated_at ON public.children;
CREATE TRIGGER update_children_updated_at
    BEFORE UPDATE ON public.children
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_academic_records_updated_at ON public.academic_records;
CREATE TRIGGER update_academic_records_updated_at
    BEFORE UPDATE ON public.academic_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_financial_transactions_updated_at ON public.financial_transactions;
CREATE TRIGGER update_financial_transactions_updated_at
    BEFORE UPDATE ON public.financial_transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_communications_updated_at ON public.communications;
CREATE TRIGGER update_communications_updated_at
    BEFORE UPDATE ON public.communications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_action_items_updated_at ON public.action_items;
CREATE TRIGGER update_action_items_updated_at
    BEFORE UPDATE ON public.action_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- COMMENTS: Table and column documentation
-- =====================================================
COMMENT ON TABLE public.parents IS 'Stores parent/guardian information';
COMMENT ON TABLE public.schools IS 'Stores school information';
COMMENT ON TABLE public.children IS 'Stores student/children information';
COMMENT ON TABLE public.parent_child_relationships IS 'Junction table linking parents to their children';
COMMENT ON TABLE public.academic_records IS 'Stores academic performance data for students';
COMMENT ON TABLE public.financial_transactions IS 'Stores all financial transactions including payments, refunds, discounts';
COMMENT ON TABLE public.communications IS 'Stores messages between parents and teachers/admin';
COMMENT ON TABLE public.action_items IS 'Stores tasks and action items for parents';
COMMENT ON TABLE public.notifications IS 'Stores notifications for all users';

-- =====================================================
-- Migration Complete
-- =====================================================
-- This migration creates the core tables for the parent section
-- Next migrations will add:
-- - AI insights tables
-- - School announcements tables
-- - Additional helper functions

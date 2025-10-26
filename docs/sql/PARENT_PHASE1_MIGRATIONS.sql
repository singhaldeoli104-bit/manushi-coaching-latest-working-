-- ============================================================================
-- PARENT SECTION - PHASE 1 MIGRATIONS
-- ============================================================================
-- Description: Database migrations for core academic tracking and billing
-- Phase: Phase 1 (P0) - High Priority
-- Date: 2025-10-19
-- Version: 1.0
-- ============================================================================

-- NOTE: This file contains all Phase 1 migrations in sequence.
-- For Supabase, split this into separate numbered migration files:
--   - 20241019_001_create_teachers_table.sql
--   - 20241019_002_create_academic_progress_table.sql
--   - 20241019_003_create_scheduling_tables.sql
--   - 20241019_004_create_financial_tables.sql
--   - 20241019_005_create_rls_policies.sql

-- ============================================================================
-- MIGRATION 001: Create Teachers Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Personal Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  profile_image_url TEXT,

  -- Professional Information
  subjects TEXT[], -- Array of subjects taught
  department VARCHAR(100),
  designation VARCHAR(100),
  years_experience INTEGER,
  qualifications TEXT[],

  -- Availability & Contact
  is_available BOOLEAN DEFAULT TRUE,
  office_hours TEXT,
  preferred_contact_method VARCHAR(50),

  -- Performance Metrics
  average_response_time_hours INTEGER,
  rating DECIMAL(3,2),
  total_ratings INTEGER DEFAULT 0,

  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  hire_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for teachers
CREATE INDEX idx_teachers_email ON teachers(email);
CREATE INDEX idx_teachers_department ON teachers(department);
CREATE INDEX idx_teachers_active ON teachers(is_active);
CREATE INDEX idx_teachers_user_id ON teachers(user_id);

COMMENT ON TABLE teachers IS 'Stores teacher information and contact details';
COMMENT ON COLUMN teachers.subjects IS 'Array of subjects the teacher teaches';
COMMENT ON COLUMN teachers.rating IS 'Average rating from parents (0-5 scale)';

-- ============================================================================
-- MIGRATION 002: Create Academic Progress Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS academic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  grade_level VARCHAR(50),

  -- Grading Information
  current_grade DECIMAL(5,2),
  letter_grade VARCHAR(5),
  previous_grade DECIMAL(5,2),
  grade_trend VARCHAR(20) CHECK (grade_trend IN ('improving', 'stable', 'declining')),

  -- Assignment Details
  assignments_completed INTEGER DEFAULT 0,
  assignments_total INTEGER DEFAULT 0,
  assignments_pending INTEGER DEFAULT 0,

  -- Participation & Feedback
  participation_score DECIMAL(5,2),
  teacher_feedback TEXT,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,

  -- Assignments
  last_assignment VARCHAR(255),
  last_assignment_score DECIMAL(5,2),
  last_assignment_date DATE,
  next_assignment VARCHAR(255),
  next_assignment_due_date DATE,

  -- Metadata
  academic_year VARCHAR(20) NOT NULL,
  term VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_student_subject_term UNIQUE(student_id, subject, term, academic_year),
  CONSTRAINT valid_current_grade CHECK (current_grade >= 0 AND current_grade <= 100),
  CONSTRAINT valid_participation_score CHECK (participation_score >= 0 AND participation_score <= 100)
);

-- Indexes for academic_progress
CREATE INDEX idx_academic_progress_student ON academic_progress(student_id);
CREATE INDEX idx_academic_progress_subject ON academic_progress(subject);
CREATE INDEX idx_academic_progress_term ON academic_progress(term, academic_year);
CREATE INDEX idx_academic_progress_teacher ON academic_progress(teacher_id);
CREATE INDEX idx_academic_progress_student_term ON academic_progress(student_id, term, academic_year);

COMMENT ON TABLE academic_progress IS 'Stores student grades, scores, and academic progress over time';
COMMENT ON COLUMN academic_progress.grade_trend IS 'Trend of grades: improving, stable, or declining';

-- ============================================================================
-- MIGRATION 003: Create Teacher-Student Assignments Junction Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS teacher_student_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,

  -- Assignment Details
  academic_year VARCHAR(20) NOT NULL,
  term VARCHAR(20),
  is_primary_teacher BOOLEAN DEFAULT FALSE,

  -- Metadata
  assigned_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_teacher_student_subject UNIQUE(teacher_id, student_id, subject, academic_year)
);

-- Indexes for teacher_student_assignments
CREATE INDEX idx_tsa_teacher ON teacher_student_assignments(teacher_id);
CREATE INDEX idx_tsa_student ON teacher_student_assignments(student_id);
CREATE INDEX idx_tsa_subject ON teacher_student_assignments(subject);
CREATE INDEX idx_tsa_academic_year ON teacher_student_assignments(academic_year);

COMMENT ON TABLE teacher_student_assignments IS 'Junction table linking teachers to students';
COMMENT ON COLUMN teacher_student_assignments.is_primary_teacher IS 'Indicates if this is the main class teacher';

-- ============================================================================
-- MIGRATION 004: Create Class Schedules Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,

  -- Class Details
  subject VARCHAR(100) NOT NULL,
  room_number VARCHAR(50),

  -- Timing
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (end_time - start_time))::INTEGER / 60
  ) STORED,

  -- Class Type
  class_type VARCHAR(50) DEFAULT 'regular' CHECK (class_type IN ('regular', 'lab', 'activity', 'study-hall')),
  is_recurring BOOLEAN DEFAULT TRUE,

  -- Metadata
  academic_year VARCHAR(20) NOT NULL,
  term VARCHAR(20),
  color_code VARCHAR(7),
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_student_schedule UNIQUE(student_id, day_of_week, start_time, academic_year),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Indexes for class_schedules
CREATE INDEX idx_class_schedules_student ON class_schedules(student_id);
CREATE INDEX idx_class_schedules_teacher ON class_schedules(teacher_id);
CREATE INDEX idx_class_schedules_day ON class_schedules(day_of_week);
CREATE INDEX idx_class_schedules_time ON class_schedules(start_time, end_time);
CREATE INDEX idx_class_schedules_student_day ON class_schedules(student_id, day_of_week);

COMMENT ON TABLE class_schedules IS 'Stores weekly class timetables for students';
COMMENT ON COLUMN class_schedules.day_of_week IS '0=Sunday, 1=Monday, 2=Tuesday, ..., 6=Saturday';

-- ============================================================================
-- MIGRATION 005: Create Exam Schedules Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS exam_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,

  -- Exam Details
  subject VARCHAR(100) NOT NULL,
  exam_name VARCHAR(255) NOT NULL,
  exam_type VARCHAR(50) NOT NULL CHECK (exam_type IN ('unit-test', 'mid-term', 'final', 'practical', 'project')),

  -- Scheduling
  exam_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER,
  room_number VARCHAR(50),

  -- Exam Information
  max_marks INTEGER,
  obtained_marks INTEGER,
  syllabus TEXT[],
  instructions TEXT,
  materials_required TEXT[],

  -- Status
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),

  -- Results
  result_published BOOLEAN DEFAULT FALSE,
  result_published_date DATE,

  -- Metadata
  academic_year VARCHAR(20) NOT NULL,
  term VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_exam_time CHECK (end_time > start_time),
  CONSTRAINT valid_marks CHECK (obtained_marks IS NULL OR (obtained_marks >= 0 AND obtained_marks <= max_marks))
);

-- Indexes for exam_schedules
CREATE INDEX idx_exam_schedules_student ON exam_schedules(student_id);
CREATE INDEX idx_exam_schedules_date ON exam_schedules(exam_date);
CREATE INDEX idx_exam_schedules_status ON exam_schedules(status);
CREATE INDEX idx_exam_schedules_subject ON exam_schedules(subject);
CREATE INDEX idx_exam_schedules_student_date ON exam_schedules(student_id, exam_date, status);

COMMENT ON TABLE exam_schedules IS 'Stores exam dates, times, and details';
COMMENT ON COLUMN exam_schedules.syllabus IS 'Array of topics covered in the exam';

-- ============================================================================
-- MIGRATION 006: Create Invoices Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,

  -- Invoice Details
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,

  -- Amounts
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0.00,
  balance_amount DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,

  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue', 'partial', 'cancelled')),

  -- Payment Details
  payment_method VARCHAR(50),
  payment_date DATE,
  payment_transaction_id VARCHAR(100),

  -- Additional Information
  notes TEXT,
  late_fee DECIMAL(10,2) DEFAULT 0.00,

  -- Metadata
  academic_year VARCHAR(20) NOT NULL,
  term VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_amounts CHECK (subtotal >= 0 AND tax_amount >= 0 AND discount_amount >= 0 AND total_amount >= 0 AND paid_amount >= 0),
  CONSTRAINT valid_due_date CHECK (due_date >= invoice_date)
);

-- Indexes for invoices
CREATE INDEX idx_invoices_parent ON invoices(parent_id);
CREATE INDEX idx_invoices_student ON invoices(student_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_parent_status ON invoices(parent_id, status);

COMMENT ON TABLE invoices IS 'Stores billing invoices for parent payments';
COMMENT ON COLUMN invoices.balance_amount IS 'Automatically calculated as total_amount - paid_amount';

-- ============================================================================
-- MIGRATION 007: Create Invoice Items Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,

  -- Item Details
  description VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('tuition', 'lab', 'library', 'transport', 'exam', 'other')),
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  amount DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,

  -- Additional Information
  start_date DATE,
  end_date DATE,
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for invoice_items
CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX idx_invoice_items_category ON invoice_items(category);

COMMENT ON TABLE invoice_items IS 'Stores individual line items for each invoice';
COMMENT ON COLUMN invoice_items.amount IS 'Automatically calculated as quantity * unit_price';

-- ============================================================================
-- MIGRATION 008: Create Payment Transactions Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,

  -- Transaction Details
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  transaction_reference VARCHAR(100),

  -- Amount Information
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) DEFAULT 'INR',

  -- Payment Details
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('card', 'upi', 'netbanking', 'wallet', 'cash')),
  payment_gateway VARCHAR(50) CHECK (payment_gateway IN ('razorpay', 'stripe', 'paytm', 'manual')),

  -- Status
  status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'pending', 'failed', 'refunded')),

  -- Gateway Response
  gateway_order_id VARCHAR(100),
  gateway_payment_id VARCHAR(100),
  gateway_signature VARCHAR(255),
  gateway_response JSONB,

  -- Refund Information
  is_refunded BOOLEAN DEFAULT FALSE,
  refund_amount DECIMAL(10,2) CHECK (refund_amount >= 0),
  refund_date DATE,
  refund_reason TEXT,

  -- Receipt
  receipt_number VARCHAR(50) UNIQUE,
  receipt_url TEXT,

  -- Metadata
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  processed_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for payment_transactions
CREATE INDEX idx_payment_transactions_parent ON payment_transactions(parent_id);
CREATE INDEX idx_payment_transactions_invoice ON payment_transactions(invoice_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_date ON payment_transactions(payment_date);
CREATE INDEX idx_payment_transactions_id ON payment_transactions(transaction_id);
CREATE INDEX idx_payment_transactions_parent_date ON payment_transactions(parent_id, payment_date DESC);

COMMENT ON TABLE payment_transactions IS 'Stores payment transaction history and details';
COMMENT ON COLUMN payment_transactions.gateway_response IS 'Full JSON response from payment gateway';

-- ============================================================================
-- MIGRATION 009: Create Database Triggers
-- ============================================================================

-- Trigger function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at column
CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON teachers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_academic_progress_updated_at
  BEFORE UPDATE ON academic_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_schedules_updated_at
  BEFORE UPDATE ON class_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exam_schedules_updated_at
  BEFORE UPDATE ON exam_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update invoice status based on paid amount
CREATE OR REPLACE FUNCTION update_invoice_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update status based on payment
  IF NEW.paid_amount >= NEW.total_amount THEN
    NEW.status = 'paid';
  ELSIF NEW.paid_amount > 0 AND NEW.paid_amount < NEW.total_amount THEN
    NEW.status = 'partial';
  ELSIF NEW.due_date < CURRENT_DATE AND NEW.paid_amount = 0 THEN
    NEW.status = 'overdue';
  ELSIF NEW.status = 'cancelled' THEN
    -- Keep cancelled status
    NEW.status = 'cancelled';
  ELSE
    NEW.status = 'pending';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoice_status_trigger
  BEFORE INSERT OR UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_status();

-- ============================================================================
-- MIGRATION 010: Create Database Views
-- ============================================================================

-- View: Parent Financial Summary
CREATE OR REPLACE VIEW parent_financial_summary AS
SELECT
  i.parent_id,
  COUNT(DISTINCT i.id) as total_invoices,
  SUM(CASE WHEN i.status = 'paid' THEN i.total_amount ELSE 0 END) as total_paid,
  SUM(CASE WHEN i.status IN ('pending', 'overdue') THEN i.balance_amount ELSE 0 END) as total_pending,
  SUM(CASE WHEN i.status = 'overdue' THEN i.balance_amount ELSE 0 END) as total_overdue,
  COUNT(CASE WHEN i.status = 'pending' THEN 1 END) as pending_invoices_count,
  COUNT(CASE WHEN i.status = 'overdue' THEN 1 END) as overdue_invoices_count,
  MIN(CASE WHEN i.status IN ('pending', 'overdue') THEN i.due_date END) as next_due_date
FROM invoices i
GROUP BY i.parent_id;

COMMENT ON VIEW parent_financial_summary IS 'Aggregated financial summary for each parent';

-- View: Student Academic Summary
CREATE OR REPLACE VIEW student_academic_summary AS
SELECT
  ap.student_id,
  ap.academic_year,
  ap.term,
  COUNT(DISTINCT ap.subject) as total_subjects,
  ROUND(AVG(ap.current_grade), 2) as overall_average,
  SUM(ap.assignments_completed) as total_assignments_completed,
  SUM(ap.assignments_pending) as total_assignments_pending,
  ROUND(AVG(ap.participation_score), 2) as average_participation,
  COUNT(CASE WHEN ap.grade_trend = 'improving' THEN 1 END) as improving_subjects,
  COUNT(CASE WHEN ap.grade_trend = 'declining' THEN 1 END) as declining_subjects
FROM academic_progress ap
GROUP BY ap.student_id, ap.academic_year, ap.term;

COMMENT ON VIEW student_academic_summary IS 'Aggregated academic summary for each student by term';

-- View: Weekly Class Schedule
CREATE OR REPLACE VIEW weekly_class_schedule AS
SELECT
  cs.student_id,
  cs.day_of_week,
  cs.start_time,
  cs.end_time,
  cs.subject,
  cs.room_number,
  cs.class_type,
  t.first_name || ' ' || t.last_name as teacher_name,
  cs.academic_year,
  cs.term,
  CASE cs.day_of_week
    WHEN 0 THEN 'Sunday'
    WHEN 1 THEN 'Monday'
    WHEN 2 THEN 'Tuesday'
    WHEN 3 THEN 'Wednesday'
    WHEN 4 THEN 'Thursday'
    WHEN 5 THEN 'Friday'
    WHEN 6 THEN 'Saturday'
  END as day_name
FROM class_schedules cs
LEFT JOIN teachers t ON cs.teacher_id = t.id
ORDER BY cs.student_id, cs.day_of_week, cs.start_time;

COMMENT ON VIEW weekly_class_schedule IS 'Formatted weekly class schedule with teacher names';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Summary of tables created:
-- 1. teachers (8 columns + indexes)
-- 2. academic_progress (16 columns + indexes)
-- 3. teacher_student_assignments (7 columns + indexes)
-- 4. class_schedules (13 columns + indexes)
-- 5. exam_schedules (19 columns + indexes)
-- 6. invoices (18 columns + indexes)
-- 7. invoice_items (9 columns + indexes)
-- 8. payment_transactions (23 columns + indexes)

-- Triggers created:
-- - Auto-update updated_at for 6 tables
-- - Auto-update invoice status based on payments

-- Views created:
-- - parent_financial_summary
-- - student_academic_summary
-- - weekly_class_schedule

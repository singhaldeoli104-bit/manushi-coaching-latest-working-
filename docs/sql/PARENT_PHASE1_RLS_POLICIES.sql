-- ============================================================================
-- PARENT SECTION - PHASE 1 ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Description: Security policies for multi-tenant data access
-- Phase: Phase 1 (P0) - High Priority
-- Date: 2025-10-19
-- Version: 1.0
-- ============================================================================

-- SECURITY PRINCIPLES:
-- 1. Parents can ONLY see data for their own children
-- 2. Teachers can see data for students they teach
-- 3. Admins can see ALL data
-- 4. Students can see their own data (if student portal exists)
-- 5. All policies use auth.uid() for current user identification

-- ============================================================================
-- HELPER FUNCTION: Check if user is admin
-- ============================================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RLS POLICIES FOR: teachers
-- ============================================================================

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Anyone (authenticated) can view active teachers
CREATE POLICY "Anyone can view active teachers"
  ON teachers
  FOR SELECT
  USING (is_active = TRUE);

-- Teachers can view their own profile
CREATE POLICY "Teachers can view their own profile"
  ON teachers
  FOR SELECT
  USING (user_id = auth.uid());

-- Teachers can update their own profile
CREATE POLICY "Teachers can update their own profile"
  ON teachers
  FOR UPDATE
  USING (user_id = auth.uid());

-- Admins can do everything with teachers
CREATE POLICY "Admins can manage all teachers"
  ON teachers
  FOR ALL
  USING (is_admin());

-- ============================================================================
-- RLS POLICIES FOR: academic_progress
-- ============================================================================

ALTER TABLE academic_progress ENABLE ROW LEVEL SECURITY;

-- Parents can view academic progress for their children
CREATE POLICY "Parents can view their children's academic progress"
  ON academic_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_relationships pcr
      WHERE pcr.student_id = academic_progress.student_id
      AND pcr.parent_id = auth.uid()
      AND pcr.is_active = TRUE
    )
  );

-- Teachers can view progress for students they teach
CREATE POLICY "Teachers can view their students' progress"
  ON academic_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teacher_student_assignments tsa
      JOIN teachers t ON tsa.teacher_id = t.id
      WHERE tsa.student_id = academic_progress.student_id
      AND t.user_id = auth.uid()
    )
  );

-- Teachers can insert progress for students they teach
CREATE POLICY "Teachers can create progress records for their students"
  ON academic_progress
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teacher_student_assignments tsa
      JOIN teachers t ON tsa.teacher_id = t.id
      WHERE tsa.student_id = academic_progress.student_id
      AND t.user_id = auth.uid()
    )
  );

-- Teachers can update progress for students they teach
CREATE POLICY "Teachers can update their students' progress"
  ON academic_progress
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM teacher_student_assignments tsa
      JOIN teachers t ON tsa.teacher_id = t.id
      WHERE tsa.student_id = academic_progress.student_id
      AND t.user_id = auth.uid()
    )
  );

-- Students can view their own progress
CREATE POLICY "Students can view their own progress"
  ON academic_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = academic_progress.student_id
      AND s.user_id = auth.uid()
    )
  );

-- Admins can do everything
CREATE POLICY "Admins can manage all academic progress"
  ON academic_progress
  FOR ALL
  USING (is_admin());

-- ============================================================================
-- RLS POLICIES FOR: teacher_student_assignments
-- ============================================================================

ALTER TABLE teacher_student_assignments ENABLE ROW LEVEL SECURITY;

-- Parents can view assignments for their children
CREATE POLICY "Parents can view assignments for their children"
  ON teacher_student_assignments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_relationships pcr
      WHERE pcr.student_id = teacher_student_assignments.student_id
      AND pcr.parent_id = auth.uid()
      AND pcr.is_active = TRUE
    )
  );

-- Teachers can view their own assignments
CREATE POLICY "Teachers can view their own assignments"
  ON teacher_student_assignments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teachers t
      WHERE t.id = teacher_student_assignments.teacher_id
      AND t.user_id = auth.uid()
    )
  );

-- Admins can do everything
CREATE POLICY "Admins can manage all teacher assignments"
  ON teacher_student_assignments
  FOR ALL
  USING (is_admin());

-- ============================================================================
-- RLS POLICIES FOR: class_schedules
-- ============================================================================

ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;

-- Parents can view schedules for their children
CREATE POLICY "Parents can view their children's class schedules"
  ON class_schedules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_relationships pcr
      WHERE pcr.student_id = class_schedules.student_id
      AND pcr.parent_id = auth.uid()
      AND pcr.is_active = TRUE
    )
  );

-- Teachers can view schedules for students they teach
CREATE POLICY "Teachers can view their students' schedules"
  ON class_schedules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teacher_student_assignments tsa
      JOIN teachers t ON tsa.teacher_id = t.id
      WHERE tsa.student_id = class_schedules.student_id
      AND t.user_id = auth.uid()
    )
  );

-- Students can view their own schedule
CREATE POLICY "Students can view their own schedule"
  ON class_schedules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = class_schedules.student_id
      AND s.user_id = auth.uid()
    )
  );

-- Admins can do everything
CREATE POLICY "Admins can manage all class schedules"
  ON class_schedules
  FOR ALL
  USING (is_admin());

-- ============================================================================
-- RLS POLICIES FOR: exam_schedules
-- ============================================================================

ALTER TABLE exam_schedules ENABLE ROW LEVEL SECURITY;

-- Parents can view exam schedules for their children
CREATE POLICY "Parents can view their children's exam schedules"
  ON exam_schedules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_relationships pcr
      WHERE pcr.student_id = exam_schedules.student_id
      AND pcr.parent_id = auth.uid()
      AND pcr.is_active = TRUE
    )
  );

-- Teachers can view exam schedules for students they teach
CREATE POLICY "Teachers can view their students' exam schedules"
  ON exam_schedules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teacher_student_assignments tsa
      JOIN teachers t ON tsa.teacher_id = t.id
      WHERE tsa.student_id = exam_schedules.student_id
      AND t.user_id = auth.uid()
    )
  );

-- Teachers can create/update exam schedules for their students
CREATE POLICY "Teachers can create exam schedules for their students"
  ON exam_schedules
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teacher_student_assignments tsa
      JOIN teachers t ON tsa.teacher_id = t.id
      WHERE tsa.student_id = exam_schedules.student_id
      AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update exam schedules for their students"
  ON exam_schedules
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM teacher_student_assignments tsa
      JOIN teachers t ON tsa.teacher_id = t.id
      WHERE tsa.student_id = exam_schedules.student_id
      AND t.user_id = auth.uid()
    )
  );

-- Students can view their own exam schedule
CREATE POLICY "Students can view their own exam schedule"
  ON exam_schedules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = exam_schedules.student_id
      AND s.user_id = auth.uid()
    )
  );

-- Admins can do everything
CREATE POLICY "Admins can manage all exam schedules"
  ON exam_schedules
  FOR ALL
  USING (is_admin());

-- ============================================================================
-- RLS POLICIES FOR: invoices
-- ============================================================================

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Parents can view their own invoices
CREATE POLICY "Parents can view their own invoices"
  ON invoices
  FOR SELECT
  USING (parent_id = auth.uid());

-- Parents can view invoices for their children
CREATE POLICY "Parents can view invoices for their children"
  ON invoices
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_relationships pcr
      WHERE pcr.student_id = invoices.student_id
      AND pcr.parent_id = auth.uid()
      AND pcr.is_active = TRUE
    )
  );

-- Admins can do everything with invoices
CREATE POLICY "Admins can manage all invoices"
  ON invoices
  FOR ALL
  USING (is_admin());

-- Finance staff can view and create invoices
CREATE POLICY "Finance staff can manage invoices"
  ON invoices
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'finance')
    )
  );

-- ============================================================================
-- RLS POLICIES FOR: invoice_items
-- ============================================================================

ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Parents can view invoice items for their invoices
CREATE POLICY "Parents can view their invoice items"
  ON invoice_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM invoices i
      WHERE i.id = invoice_items.invoice_id
      AND i.parent_id = auth.uid()
    )
  );

-- Admins can do everything
CREATE POLICY "Admins can manage all invoice items"
  ON invoice_items
  FOR ALL
  USING (is_admin());

-- Finance staff can manage invoice items
CREATE POLICY "Finance staff can manage invoice items"
  ON invoice_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'finance')
    )
  );

-- ============================================================================
-- RLS POLICIES FOR: payment_transactions
-- ============================================================================

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Parents can view their own payment transactions
CREATE POLICY "Parents can view their payment transactions"
  ON payment_transactions
  FOR SELECT
  USING (parent_id = auth.uid());

-- Parents can insert their own payment transactions
CREATE POLICY "Parents can create payment transactions"
  ON payment_transactions
  FOR INSERT
  WITH CHECK (parent_id = auth.uid());

-- Parents can update their pending transactions
CREATE POLICY "Parents can update their pending transactions"
  ON payment_transactions
  FOR UPDATE
  USING (
    parent_id = auth.uid()
    AND status = 'pending'
  );

-- Admins can do everything
CREATE POLICY "Admins can manage all payment transactions"
  ON payment_transactions
  FOR ALL
  USING (is_admin());

-- Finance staff can view and manage transactions
CREATE POLICY "Finance staff can manage transactions"
  ON payment_transactions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'finance')
    )
  );

-- ============================================================================
-- GRANT PERMISSIONS ON VIEWS
-- ============================================================================

-- Grant SELECT on views to authenticated users
GRANT SELECT ON parent_financial_summary TO authenticated;
GRANT SELECT ON student_academic_summary TO authenticated;
GRANT SELECT ON weekly_class_schedule TO authenticated;

-- ============================================================================
-- RLS POLICIES SUMMARY
-- ============================================================================
--
-- Tables protected:
-- 1. teachers (3 policies)
-- 2. academic_progress (6 policies)
-- 3. teacher_student_assignments (3 policies)
-- 4. class_schedules (4 policies)
-- 5. exam_schedules (6 policies)
-- 6. invoices (4 policies)
-- 7. invoice_items (3 policies)
-- 8. payment_transactions (5 policies)
--
-- Total: 34 RLS policies created
--
-- Security Features:
-- - Multi-tenant data isolation
-- - Role-based access control (parent, teacher, student, admin, finance)
-- - Fine-grained permissions (SELECT, INSERT, UPDATE, DELETE)
-- - Helper function for admin check
-- - Views accessible to authenticated users
--
-- ============================================================================

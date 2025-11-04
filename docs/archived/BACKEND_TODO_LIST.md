# BACKEND TODO CHECKLIST
## Manushi Coaching Platform - Complete Implementation Guide

**Created:** 2025-10-20
**Status:** In Progress
**Priority System:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

**Progress Tracking:**
- Total Tasks: 272 (includes 15 MCP setup tasks)
- Completed: 0
- In Progress: 0
- Not Started: 272

---

## 🔴 PHASE 0: SETUP SUPABASE MCP WORKFLOW (Day 1)
**Target:** Configure MCP tools for efficient development
**Estimated Time:** 1-2 hours
**Priority:** MUST DO FIRST - Speeds up all other phases

### 0.1 Verify Supabase MCP Connection

- [ ] **Test MCP connection**
  - [ ] Run `mcp__supabase__list_tables` to verify connectivity
  - [ ] Run `mcp__supabase__get_project_url` to get project URL
  - [ ] Run `mcp__supabase__get_anon_key` to verify API access

- [ ] **Check current database state**
  - [ ] Use `mcp__supabase__list_tables` to inventory tables
  - [ ] Use `mcp__supabase__list_migrations` to see migration history
  - [ ] Use `mcp__supabase__list_extensions` to check extensions

- [ ] **Run initial security/performance audit**
  - [ ] Use `mcp__supabase__get_advisors` with type='security'
  - [ ] Use `mcp__supabase__get_advisors` with type='performance'
  - [ ] Document all issues found

### 0.2 Generate TypeScript Types

- [ ] **Generate types for all tables**
  ```bash
  # Use Supabase MCP tool
  mcp__supabase__generate_typescript_types
  ```

- [ ] **Save generated types**
  - [ ] Create `src/types/database.types.ts`
  - [ ] Import in relevant service files
  - [ ] Update existing type definitions

- [ ] **Set up auto-regeneration workflow**
  - [ ] Document when to regenerate (after migrations)
  - [ ] Add to migration checklist

### 0.3 Setup Storage Buckets via MCP

- [ ] **List existing storage buckets**
  ```bash
  mcp__supabase__list_storage_buckets
  ```

- [ ] **Get current storage configuration**
  ```bash
  mcp__supabase__get_storage_config
  ```

- [ ] **Plan storage bucket structure**
  - [ ] `assignments` - Assignment files
  - [ ] `submissions` - Student submissions
  - [ ] `profile-images` - User avatars
  - [ ] `recordings` - Session recordings
  - [ ] `whiteboard` - Whiteboard data
  - [ ] `documents` - General documents

### 0.4 Setup Branch-based Development

- [ ] **Create development branch**
  ```bash
  # First confirm cost
  mcp__supabase__create_branch with name='development'
  ```

- [ ] **List all branches**
  ```bash
  mcp__supabase__list_branches
  ```

- [ ] **Document branching strategy**
  - [ ] `main` - Production
  - [ ] `staging` - Pre-production testing
  - [ ] `development` - Active development
  - [ ] Feature branches as needed

- [ ] **Test branch workflow**
  - [ ] Make test migration on dev branch
  - [ ] Verify isolation from main
  - [ ] Test merge process

### 0.5 Setup Monitoring & Logging

- [ ] **Configure log monitoring**
  ```bash
  # Check different service logs
  mcp__supabase__get_logs with service='api'
  mcp__supabase__get_logs with service='postgres'
  mcp__supabase__get_logs with service='auth'
  mcp__supabase__get_logs with service='storage'
  ```

- [ ] **Create logging checklist**
  - [ ] When to check API logs
  - [ ] When to check Postgres logs
  - [ ] When to check Auth logs
  - [ ] When to check Storage logs

- [ ] **Setup alert thresholds**
  - [ ] Define what constitutes an error spike
  - [ ] Document escalation process

---

## 🔴 PHASE 1: CRITICAL SECURITY FIXES (Week 1)
**Target:** Production Security Compliance
**Estimated Time:** 2-3 days
**Priority:** MUST DO BEFORE PRODUCTION

### 1.1 Remove Temporary RLS Policies (URGENT)
**Risk Level:** 🔴 CRITICAL - Data Breach Risk

- [ ] **List all temporary policies using MCP**
  ```bash
  # Use MCP to execute SQL
  mcp__supabase__execute_sql with query:
  "SELECT tablename, policyname
   FROM pg_policies
   WHERE policyname LIKE 'temp_allow%'
   ORDER BY tablename;"
  ```

- [ ] **Create migration to remove all temp policies using MCP**
  ```bash
  # Use MCP apply_migration tool
  mcp__supabase__apply_migration with:
    name: "remove_temporary_rls_policies"
    query: "
      DROP POLICY IF EXISTS temp_allow_read_academic_predictions ON academic_predictions;
      DROP POLICY IF EXISTS temp_allow_read_academic_progress ON academic_progress;
      DROP POLICY IF EXISTS temp_allow_read_ai_insights ON ai_insights;
      DROP POLICY IF EXISTS temp_allow_read_announcements ON announcements;
      DROP POLICY IF EXISTS temp_allow_read_assignment_submissions ON assignment_submissions;
      DROP POLICY IF EXISTS temp_allow_read_assignments ON assignments;
      DROP POLICY IF EXISTS temp_allow_read_attendance ON attendance;
      DROP POLICY IF EXISTS temp_allow_read_batches ON batches;
      DROP POLICY IF EXISTS temp_allow_read_behavior_trends ON behavior_trends;
      DROP POLICY IF EXISTS temp_allow_read_chat_messages ON chat_messages;
      DROP POLICY IF EXISTS temp_allow_read_chat_rooms ON chat_rooms;
      DROP POLICY IF EXISTS temp_allow_read_class_materials ON class_materials;
      DROP POLICY IF EXISTS temp_allow_read_classes ON classes;
      DROP POLICY IF EXISTS temp_allow_read_gradebook ON gradebook;
      DROP POLICY IF EXISTS temp_allow_read_live_sessions ON live_sessions;
      DROP POLICY IF EXISTS temp_allow_read_notifications ON notifications;
      DROP POLICY IF EXISTS temp_allow_read_opportunities ON opportunities;
      DROP POLICY IF EXISTS temp_allow_read_parent_action_items ON parent_action_items;
      DROP POLICY IF EXISTS temp_allow_read_parent_child_relationships ON parent_child_relationships;
      DROP POLICY IF EXISTS temp_allow_read_parent_teacher_communications ON parent_teacher_communications;
      DROP POLICY IF EXISTS temp_allow_read_parents ON parents;
      DROP POLICY IF EXISTS temp_allow_read_profiles ON profiles;
      DROP POLICY IF EXISTS temp_allow_read_recommended_actions ON recommended_actions;
      DROP POLICY IF EXISTS temp_allow_read_risk_factors ON risk_factors;
      DROP POLICY IF EXISTS temp_allow_read_student_progress ON student_progress;
      DROP POLICY IF EXISTS temp_allow_read_students ON students;
      DROP POLICY IF EXISTS temp_allow_read_study_materials ON study_materials;
      DROP POLICY IF EXISTS temp_allow_read_subjects ON subjects;
    "
  ```

- [ ] **Verify all temp policies removed using MCP**
  ```bash
  mcp__supabase__execute_sql with query:
  "SELECT COUNT(*) as remaining_temp_policies
   FROM pg_policies
   WHERE policyname LIKE 'temp_allow%';"
  # Should return 0
  ```

- [ ] **Run security advisor after removal**
  ```bash
  mcp__supabase__get_advisors with type='security'
  ```

- [ ] **Document any remaining security issues**
  - [ ] Review advisor output
  - [ ] Create tickets for each issue
  - [ ] Prioritize by severity

### 1.2 Implement Proper RLS Policies
**All policies should use auth.uid() and role checks**

- [ ] **Create migration for helper functions using MCP**
  ```bash
  mcp__supabase__apply_migration with:
    name: "create_security_helper_functions"
    query: "
      CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
      RETURNS BOOLEAN AS \$\$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM profiles
          WHERE id = user_id AND role = 'admin'
        );
      END;
      \$\$ LANGUAGE plpgsql SECURITY DEFINER;

      CREATE OR REPLACE FUNCTION is_teacher(user_id UUID)
      RETURNS BOOLEAN AS \$\$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM profiles
          WHERE id = user_id AND role = 'teacher'
        );
      END;
      \$\$ LANGUAGE plpgsql SECURITY DEFINER;

      CREATE OR REPLACE FUNCTION is_parent(user_id UUID)
      RETURNS BOOLEAN AS \$\$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM profiles
          WHERE id = user_id AND role = 'parent'
        );
      END;
      \$\$ LANGUAGE plpgsql SECURITY DEFINER;

      CREATE OR REPLACE FUNCTION is_student(user_id UUID)
      RETURNS BOOLEAN AS \$\$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM profiles
          WHERE id = user_id AND role = 'student'
        );
      END;
      \$\$ LANGUAGE plpgsql SECURITY DEFINER;
    "
  ```

- [ ] **Verify helper functions created**
  ```bash
  mcp__supabase__execute_sql with query:
  "SELECT routine_name
   FROM information_schema.routines
   WHERE routine_schema = 'public'
   AND routine_name LIKE 'is_%';"
  ```

- [ ] **Run security advisor to check RLS**
  ```bash
  mcp__supabase__get_advisors with type='security'
  ```

- [ ] **Check for tables missing RLS**
  ```bash
  mcp__supabase__execute_sql with query:
  "SELECT schemaname, tablename
   FROM pg_tables
   WHERE schemaname = 'public'
   AND rowsecurity = false;"
  ```

### 1.3 Database Security Hardening

- [ ] **Check all tables have RLS enabled using MCP**
  ```bash
  mcp__supabase__execute_sql with query:
  "SELECT schemaname, tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public'
   ORDER BY tablename;"
  ```

- [ ] **Create migration to enable RLS on all tables**
  ```bash
  mcp__supabase__apply_migration with:
    name: "enable_rls_all_tables"
    query: "
      -- Get all tables and enable RLS
      DO \$\$
      DECLARE
        t record;
      BEGIN
        FOR t IN
          SELECT tablename
          FROM pg_tables
          WHERE schemaname = 'public'
          AND rowsecurity = false
        LOOP
          EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t.tablename);
        END LOOP;
      END;
      \$\$;
    "
  ```

- [ ] **Run comprehensive security audit using MCP**
  ```bash
  mcp__supabase__get_advisors with type='security'
  ```

- [ ] **Document all security findings**
  - [ ] Missing RLS policies
  - [ ] Weak policies (too permissive)
  - [ ] Exposed sensitive data
  - [ ] Missing indexes on security-critical columns

- [ ] **Run performance audit using MCP**
  ```bash
  mcp__supabase__get_advisors with type='performance'
  ```

- [ ] **Address critical advisor recommendations**
  - [ ] Review each recommendation
  - [ ] Implement fixes
  - [ ] Re-run advisor to verify

---

## 🟠 PHASE 2: CRITICAL DATA POPULATION (Week 1)
**Target:** Make core features functional
**Estimated Time:** 3-4 days
**Priority:** HIGH - Required for testing

### 2.1 Populate Assignments Table
**Current:** 0 rows | **Target:** 20+ rows

- [ ] **Check current assignment count using MCP**
  ```bash
  mcp__supabase__execute_sql with query:
  "SELECT COUNT(*) as assignment_count FROM assignments;"
  ```

- [ ] **Create sample assignments using MCP**
  ```bash
  mcp__supabase__execute_sql with query:
  "INSERT INTO assignments (title, description, subject_id, teacher_id, due_date, max_points, assignment_type, status)
   SELECT
     'Calculus Problem Set ' || s.n,
     'Solve differentiation problems',
     (SELECT id FROM subjects WHERE name = 'Mathematics' LIMIT 1),
     (SELECT id FROM teachers LIMIT 1),
     NOW() + INTERVAL '7 days' * s.n,
     100,
     'homework',
     'active'
   FROM generate_series(1, 5) s(n)
   UNION ALL
   SELECT
     'Physics Lab Report ' || s.n,
     'Complete lab experiment and analysis',
     (SELECT id FROM subjects WHERE name = 'Physics' LIMIT 1),
     (SELECT id FROM teachers OFFSET 1 LIMIT 1),
     NOW() + INTERVAL '5 days' * s.n,
     50,
     'lab_report',
     'active'
   FROM generate_series(1, 3) s(n);"
  ```

- [ ] **Create assignments for Physics**
- [ ] **Create assignments for Chemistry**
- [ ] **Create assignments for English**
- [ ] **Create assignments for other subjects**
- [ ] **Verify assignment data**
  ```sql
  SELECT COUNT(*), subject_id, assignment_type
  FROM assignments
  GROUP BY subject_id, assignment_type;
  ```

### 2.2 Populate Attendance Table
**Current:** 0 rows | **Target:** 100+ rows

- [ ] **Create attendance records for current month**
  ```sql
  -- Mark all students present for last 20 school days
  INSERT INTO attendance (student_id, date, status, class_id, marked_by)
  SELECT
    s.id as student_id,
    d.date,
    'present' as status,
    (SELECT id FROM class_schedules LIMIT 1) as class_id,
    (SELECT id FROM teachers LIMIT 1) as marked_by
  FROM students s
  CROSS JOIN (
    SELECT generate_series(
      CURRENT_DATE - INTERVAL '20 days',
      CURRENT_DATE,
      '1 day'::interval
    )::date as date
  ) d
  WHERE EXTRACT(DOW FROM d.date) NOT IN (0, 6); -- Exclude weekends
  ```

- [ ] **Add some absent records for realism**
  ```sql
  UPDATE attendance
  SET status = 'absent'
  WHERE random() < 0.1; -- 10% absence rate
  ```

- [ ] **Add some late records**
  ```sql
  UPDATE attendance
  SET status = 'late', arrival_time = NOW()
  WHERE random() < 0.05; -- 5% late rate
  ```

- [ ] **Verify attendance data**
  ```sql
  SELECT status, COUNT(*)
  FROM attendance
  GROUP BY status;
  ```

### 2.3 Populate Notifications Table
**Current:** 0 rows | **Target:** 50+ rows

- [ ] **Create system notifications for all users**
  ```sql
  INSERT INTO notifications (recipient_id, title, message, type, category)
  SELECT
    id as recipient_id,
    'Welcome to Manushi Coaching Platform' as title,
    'Your account has been successfully created. Explore all features!' as message,
    'info' as type,
    'system' as category
  FROM profiles;
  ```

- [ ] **Create assignment notifications for students**
- [ ] **Create grade notifications**
- [ ] **Create payment reminders for parents**
- [ ] **Create class reminder notifications**
- [ ] **Verify notification data**

### 2.4 Populate Live Sessions Table
**Current:** 0 rows | **Target:** 10+ rows

- [ ] **Create upcoming live sessions**
  ```sql
  INSERT INTO live_sessions (teacher_id, title, subject_id, scheduled_at, duration_minutes, status)
  VALUES
    ((SELECT id FROM teachers LIMIT 1),
     'Introduction to Calculus',
     (SELECT id FROM subjects WHERE name = 'Mathematics' LIMIT 1),
     NOW() + INTERVAL '1 day', 60, 'scheduled');
  ```

- [ ] **Create past live sessions**
- [ ] **Create ongoing live session for testing**
- [ ] **Add participants to sessions**
- [ ] **Verify live session data**

### 2.5 Populate Payments Table
**Current:** 0 rows | **Target:** 15+ rows

- [ ] **Create payment records from existing invoices**
  ```sql
  INSERT INTO payments (parent_id, amount, payment_date, payment_method, status, invoice_id, transaction_id)
  SELECT
    parent_id,
    total_amount,
    CURRENT_DATE - INTERVAL '30 days',
    'online',
    'completed',
    id,
    'TXN' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0')
  FROM invoices
  WHERE status = 'paid';
  ```

- [ ] **Create pending payments**
- [ ] **Create failed payment records**
- [ ] **Link payments to payment_transactions**
- [ ] **Verify payment data**

### 2.6 Populate Student Fees Table
**Current:** 0 rows | **Target:** 10+ rows

- [ ] **Create fee records for all students**
  ```sql
  INSERT INTO student_fees (student_id, fee_structure_id, academic_year, status)
  SELECT
    s.id,
    (SELECT id FROM fee_structures LIMIT 1),
    '2024-2025',
    'active'
  FROM students s;
  ```

- [ ] **Link fees to invoices**
- [ ] **Verify student fee data**

### 2.7 Populate Parent Action Items
**Current:** 0 rows | **Target:** 20+ rows

- [ ] **Create action items for fee payments**
- [ ] **Create action items for form submissions**
- [ ] **Create action items for parent-teacher meetings**
- [ ] **Create action items for document uploads**
- [ ] **Verify action item data**

### 2.8 Populate Chat and Communication Tables

- [ ] **Create chat rooms for classes**
  ```sql
  INSERT INTO chat_rooms (name, type, created_by)
  SELECT
    'Class ' || grade || ' - General',
    'class',
    (SELECT id FROM teachers LIMIT 1)
  FROM students
  GROUP BY grade;
  ```

- [ ] **Add participants to chat rooms**
- [ ] **Create sample chat messages**
- [ ] **Create parent-teacher communications**

---

## 🟠 PHASE 3: DATABASE OPTIMIZATION (Week 1-2)
**Target:** Improve query performance
**Estimated Time:** 2-3 days
**Priority:** HIGH

### 3.1 Create Essential Indexes

#### Student-Related Indexes
- [ ] `CREATE INDEX IF NOT EXISTS idx_students_parent_id ON students(parent_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_students_batch_id ON students(batch_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_students_grade ON students(grade);`

#### Academic Indexes
- [ ] `CREATE INDEX IF NOT EXISTS idx_academic_progress_student_id ON academic_progress(student_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_academic_progress_subject_id ON academic_progress(subject_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_assignments_teacher_id ON assignments(teacher_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_assignments_subject_id ON assignments(subject_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student_id ON assignment_submissions(student_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_gradebook_student_id ON gradebook(student_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_gradebook_subject_id ON gradebook(subject_id);`

#### Attendance Indexes
- [ ] `CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_attendance_class_id ON attendance(class_id);`

#### Financial Indexes
- [ ] `CREATE INDEX IF NOT EXISTS idx_payments_parent_id ON payments(parent_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_invoices_parent_id ON invoices(parent_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_invoices_status_date ON invoices(status, invoice_date);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_student_fees_student_id ON student_fees(student_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_student_fees_status ON student_fees(status);`

#### Communication Indexes
- [ ] `CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_parent_teacher_comms_parent_id ON parent_teacher_communications(parent_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_parent_teacher_comms_teacher_id ON parent_teacher_communications(teacher_id);`

#### Session Indexes
- [ ] `CREATE INDEX IF NOT EXISTS idx_live_sessions_teacher_id ON live_sessions(teacher_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_live_sessions_scheduled_at ON live_sessions(scheduled_at);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_live_sessions_status ON live_sessions(status);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_live_session_participants_session_id ON live_session_participants(session_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_live_session_participants_user_id ON live_session_participants(user_id);`

#### AI & Insights Indexes
- [ ] `CREATE INDEX IF NOT EXISTS idx_ai_insights_parent_id ON ai_insights(parent_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_ai_insights_student_id ON ai_insights(student_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_ai_insights_category ON ai_insights(category);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_academic_predictions_student_id ON academic_predictions(student_id);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_behavior_trends_student_id ON behavior_trends(student_id);`

### 3.2 Create Composite Indexes for Common Queries

- [ ] `CREATE INDEX IF NOT EXISTS idx_attendance_student_date_status ON attendance(student_id, date, status);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_assignments_teacher_status_due ON assignments(teacher_id, status, due_date);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_payments_parent_status_date ON payments(parent_id, status, payment_date);`
- [ ] `CREATE INDEX IF NOT EXISTS idx_notifications_recipient_read_date ON notifications(recipient_id, is_read, created_at);`

### 3.3 Analyze Index Usage

- [ ] **Run EXPLAIN ANALYZE on critical queries**
  ```sql
  EXPLAIN ANALYZE
  SELECT * FROM students WHERE parent_id = 'xxx';
  ```

- [ ] **Check index usage statistics**
  ```sql
  SELECT
    schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
  FROM pg_stat_user_indexes
  WHERE schemaname = 'public'
  ORDER BY idx_scan DESC;
  ```

- [ ] **Identify unused indexes**
  ```sql
  SELECT
    schemaname, tablename, indexname
  FROM pg_stat_user_indexes
  WHERE idx_scan = 0 AND schemaname = 'public';
  ```

- [ ] **Remove unused indexes if any**

### 3.4 Create Database Views

- [ ] **Create teacher_performance_summary view**
  ```sql
  CREATE OR REPLACE VIEW teacher_performance_summary AS
  SELECT
    t.id,
    t.full_name,
    COUNT(DISTINCT a.id) as total_assignments,
    COUNT(DISTINCT ls.id) as total_sessions,
    AVG(CASE WHEN att.status = 'present' THEN 1 ELSE 0 END) as avg_attendance_rate
  FROM teachers t
  LEFT JOIN assignments a ON a.teacher_id = t.id
  LEFT JOIN live_sessions ls ON ls.teacher_id = t.id
  LEFT JOIN attendance att ON att.marked_by = t.id
  GROUP BY t.id, t.full_name;
  ```

- [ ] **Create class_session_summary view**
  ```sql
  CREATE OR REPLACE VIEW class_session_summary AS
  SELECT
    cs.id,
    cs.class_name,
    cs.scheduled_at,
    COUNT(DISTINCT a.id) as total_students,
    COUNT(DISTINCT CASE WHEN a.status = 'present' THEN a.student_id END) as present_count,
    COUNT(DISTINCT CASE WHEN a.status = 'absent' THEN a.student_id END) as absent_count
  FROM class_schedules cs
  LEFT JOIN attendance a ON a.class_id = cs.id
  GROUP BY cs.id, cs.class_name, cs.scheduled_at;
  ```

- [ ] **Create attendance_summary view**
  ```sql
  CREATE OR REPLACE VIEW attendance_summary AS
  SELECT
    s.id as student_id,
    s.full_name,
    COUNT(*) as total_days,
    COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_days,
    COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_days,
    COUNT(CASE WHEN a.status = 'late' THEN 1 END) as late_days,
    ROUND(COUNT(CASE WHEN a.status = 'present' THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC * 100, 2) as attendance_percentage
  FROM students s
  LEFT JOIN attendance a ON a.student_id = s.id
  GROUP BY s.id, s.full_name;
  ```

- [ ] **Create assignment_progress_summary view**
- [ ] **Create financial_summary_by_parent view**
- [ ] **Create student_academic_performance view**

### 3.5 Create Helper Functions

- [ ] **Create calculate_student_gpa function**
  ```sql
  CREATE OR REPLACE FUNCTION calculate_student_gpa(p_student_id UUID)
  RETURNS NUMERIC AS $$
  DECLARE
    v_gpa NUMERIC;
  BEGIN
    SELECT AVG(grade) INTO v_gpa
    FROM gradebook
    WHERE student_id = p_student_id;

    RETURN COALESCE(v_gpa, 0);
  END;
  $$ LANGUAGE plpgsql;
  ```

- [ ] **Create get_attendance_percentage function**
  ```sql
  CREATE OR REPLACE FUNCTION get_attendance_percentage(
    p_student_id UUID,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
  )
  RETURNS NUMERIC AS $$
  DECLARE
    v_percentage NUMERIC;
  BEGIN
    SELECT
      ROUND(
        COUNT(CASE WHEN status = 'present' THEN 1 END)::NUMERIC /
        COUNT(*)::NUMERIC * 100,
        2
      ) INTO v_percentage
    FROM attendance
    WHERE student_id = p_student_id
      AND (p_start_date IS NULL OR date >= p_start_date)
      AND (p_end_date IS NULL OR date <= p_end_date);

    RETURN COALESCE(v_percentage, 0);
  END;
  $$ LANGUAGE plpgsql;
  ```

- [ ] **Create check_overdue_assignments function**
- [ ] **Create get_student_rank function**
- [ ] **Create calculate_fee_balance function**

---

## 🟡 PHASE 4: MISSING TABLES CREATION (Week 2)
**Target:** Add all missing functionality
**Estimated Time:** 4-5 days
**Priority:** MEDIUM

### 4.1 Student AI Features Tables

- [ ] **Create study_plans table**
  ```sql
  CREATE TABLE IF NOT EXISTS study_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject_id UUID REFERENCES subjects(id),
    duration VARCHAR(50),
    difficulty VARCHAR(20) CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    topics JSONB,
    progress INTEGER DEFAULT 0,
    estimated_time VARCHAR(50),
    ai_generated BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for study_plans**
  ```sql
  ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Students can view own plans"
    ON study_plans FOR SELECT
    USING (student_id = auth.uid());

  CREATE POLICY "Students can create own plans"
    ON study_plans FOR INSERT
    WITH CHECK (student_id = auth.uid());
  ```

- [ ] **Create learning_analytics table**
  ```sql
  CREATE TABLE IF NOT EXISTS learning_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    learning_style VARCHAR(50),
    style_percentage INTEGER,
    strengths JSONB,
    weaknesses JSONB,
    recommendations JSONB,
    last_analyzed TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for learning_analytics**

- [ ] **Create ai_recommendations table**
  ```sql
  CREATE TABLE IF NOT EXISTS ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('resource', 'practice', 'revision', 'concept')),
    subject_id UUID REFERENCES subjects(id),
    priority VARCHAR(20) CHECK (priority IN ('High', 'Medium', 'Low')),
    reason TEXT,
    estimated_time VARCHAR(50),
    difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 10),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for ai_recommendations**
- [ ] **Create indexes for AI tables**

### 4.2 Teacher Assignment Features Tables

- [ ] **Create assignment_questions table**
  ```sql
  CREATE TABLE IF NOT EXISTS assignment_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question_type VARCHAR(50) CHECK (question_type IN ('mcq', 'descriptive', 'mathematical', 'true-false', 'fill-blank', 'matching', 'essay', 'numerical', 'code', 'diagram')),
    question_text TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT,
    points INTEGER DEFAULT 10,
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    time_limit INTEGER, -- in minutes
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for assignment_questions**
  ```sql
  ALTER TABLE assignment_questions ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Teachers can manage questions"
    ON assignment_questions FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM assignments a
        WHERE a.id = assignment_id AND a.teacher_id = auth.uid()
      )
    );

  CREATE POLICY "Students can view questions"
    ON assignment_questions FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM assignments a
        WHERE a.id = assignment_id
      )
    );
  ```

- [ ] **Create assignment_rubrics table**
  ```sql
  CREATE TABLE IF NOT EXISTS assignment_rubrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    criterion VARCHAR(255) NOT NULL,
    description TEXT,
    max_points INTEGER NOT NULL,
    levels JSONB, -- [{level: 'Excellent', points: 10, description: '...'}]
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for assignment_rubrics**

- [ ] **Create assignment_templates table**
  ```sql
  CREATE TABLE IF NOT EXISTS assignment_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    question_types JSONB,
    estimated_time INTEGER,
    is_public BOOLEAN DEFAULT false,
    times_used INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for assignment_templates**
- [ ] **Create indexes for assignment tables**

### 4.3 Teacher Attendance Features Tables

- [ ] **Create attendance_reports table**
  ```sql
  CREATE TABLE IF NOT EXISTS attendance_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES teachers(id),
    title VARCHAR(255) NOT NULL,
    period VARCHAR(20) CHECK (period IN ('daily', 'weekly', 'monthly', 'custom')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_sessions INTEGER,
    average_attendance NUMERIC(5,2),
    students_at_risk INTEGER,
    perfect_attendance INTEGER,
    report_data JSONB,
    generated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for attendance_reports**

- [ ] **Create attendance_alerts table**
  ```sql
  CREATE TABLE IF NOT EXISTS attendance_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    type VARCHAR(50) CHECK (type IN ('consecutive-absence', 'low-attendance', 'sudden-drop', 'pattern-change')),
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message TEXT NOT NULL,
    suggested_action TEXT,
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_by UUID REFERENCES profiles(id),
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for attendance_alerts**

- [ ] **Create attendance_patterns table**
  ```sql
  CREATE TABLE IF NOT EXISTS attendance_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    pattern_type VARCHAR(50),
    pattern_data JSONB,
    confidence_score NUMERIC(3,2),
    detected_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for attendance_patterns**

### 4.4 Live Class Features Tables

- [ ] **Create session_recordings table**
  ```sql
  CREATE TABLE IF NOT EXISTS session_recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
    recording_url TEXT,
    duration INTEGER, -- in seconds
    file_size BIGINT, -- in bytes
    format VARCHAR(20),
    status VARCHAR(20) DEFAULT 'processing',
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for session_recordings**

- [ ] **Create whiteboard_data table**
  ```sql
  CREATE TABLE IF NOT EXISTS whiteboard_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
    page_number INTEGER DEFAULT 1,
    canvas_data JSONB, -- Whiteboard drawing data
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for whiteboard_data**

- [ ] **Create screen_shares table**
  ```sql
  CREATE TABLE IF NOT EXISTS screen_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
    shared_by UUID REFERENCES profiles(id),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for screen_shares**

- [ ] **Create breakout_rooms table**
  ```sql
  CREATE TABLE IF NOT EXISTS breakout_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
    room_name VARCHAR(100) NOT NULL,
    max_participants INTEGER DEFAULT 5,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ
  );
  ```

- [ ] **Add RLS policies for breakout_rooms**

- [ ] **Create breakout_room_participants table**
  ```sql
  CREATE TABLE IF NOT EXISTS breakout_room_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES breakout_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ
  );
  ```

- [ ] **Add RLS policies for breakout_room_participants**

### 4.5 Admin System Tables

- [ ] **Create system_metrics table**
  ```sql
  CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC,
    metric_unit VARCHAR(50),
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
  );
  ```

- [ ] **Add RLS policies for system_metrics (admin only)**

- [ ] **Create user_activities table**
  ```sql
  CREATE TABLE IF NOT EXISTS user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for user_activities (admin only)**

- [ ] **Create system_alerts table**
  ```sql
  CREATE TABLE IF NOT EXISTS system_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) CHECK (type IN ('security', 'performance', 'system', 'user')),
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for system_alerts (admin only)**

- [ ] **Create resource_utilization table**
  ```sql
  CREATE TABLE IF NOT EXISTS resource_utilization (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_type VARCHAR(50), -- cpu, memory, storage, network
    usage_percentage NUMERIC(5,2),
    usage_absolute BIGINT,
    threshold_warning NUMERIC(5,2),
    threshold_critical NUMERIC(5,2),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for resource_utilization (admin only)**

### 4.6 Admin RBAC Tables

- [ ] **Create user_roles table**
  ```sql
  CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_custom BOOLEAN DEFAULT true,
    is_system BOOLEAN DEFAULT false,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for user_roles (admin only)**

- [ ] **Create permissions table**
  ```sql
  CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(20) CHECK (action IN ('create', 'read', 'update', 'delete', 'manage')),
    conditions JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for permissions (admin only)**

- [ ] **Create role_permissions junction table**
  ```sql
  CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID REFERENCES user_roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
  );
  ```

- [ ] **Add RLS policies for role_permissions (admin only)**

- [ ] **Create user_role_assignments table**
  ```sql
  CREATE TABLE IF NOT EXISTS user_role_assignments (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role_id UUID REFERENCES user_roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES profiles(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
  );
  ```

- [ ] **Add RLS policies for user_role_assignments (admin only)**

### 4.7 Admin Operations Tables

- [ ] **Create bulk_operations table**
  ```sql
  CREATE TABLE IF NOT EXISTS bulk_operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) CHECK (type IN ('import', 'export', 'update', 'delete', 'activate', 'deactivate')),
    status VARCHAR(20) CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    total_records INTEGER,
    processed_records INTEGER DEFAULT 0,
    errors JSONB,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
  );
  ```

- [ ] **Add RLS policies for bulk_operations (admin only)**

- [ ] **Create audit_logs table (comprehensive)**
  ```sql
  CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES profiles(id),
    admin_id UUID REFERENCES profiles(id),
    resource_type VARCHAR(50),
    resource_id UUID,
    action VARCHAR(50),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    severity VARCHAR(20),
    outcome VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for audit_logs (admin only)**
- [ ] **Create index on audit_logs(created_at)**
- [ ] **Create index on audit_logs(user_id)**
- [ ] **Create index on audit_logs(event_type)**

### 4.8 Analytics Tables

- [ ] **Create analytics_metrics table**
  ```sql
  CREATE TABLE IF NOT EXISTS analytics_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_category VARCHAR(50),
    current_value NUMERIC,
    previous_value NUMERIC,
    unit VARCHAR(20),
    trend VARCHAR(20),
    trend_percentage NUMERIC(5,2),
    status VARCHAR(20),
    calculated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for analytics_metrics (admin only)**

- [ ] **Create predictive_models table**
  ```sql
  CREATE TABLE IF NOT EXISTS predictive_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL,
    model_type VARCHAR(50),
    accuracy NUMERIC(5,2),
    training_data JSONB,
    predictions JSONB,
    confidence NUMERIC(5,2),
    last_trained TIMESTAMPTZ,
    next_update TIMESTAMPTZ,
    status VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for predictive_models (admin only)**

- [ ] **Create dashboard_widgets table**
  ```sql
  CREATE TABLE IF NOT EXISTS dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    widget_type VARCHAR(50),
    title VARCHAR(100),
    position_x INTEGER,
    position_y INTEGER,
    width INTEGER,
    height INTEGER,
    configuration JSONB,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for dashboard_widgets**

### 4.9 Common Application Tables

- [ ] **Create app_settings table**
  ```sql
  CREATE TABLE IF NOT EXISTS app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB,
    setting_type VARCHAR(50),
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for app_settings**

- [ ] **Create feature_flags table**
  ```sql
  CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flag_name VARCHAR(100) UNIQUE NOT NULL,
    enabled BOOLEAN DEFAULT false,
    description TEXT,
    target_roles JSONB,
    target_users JSONB,
    rollout_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for feature_flags**

- [ ] **Create system_logs table**
  ```sql
  CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_level VARCHAR(20) CHECK (log_level IN ('debug', 'info', 'warning', 'error', 'critical')),
    message TEXT NOT NULL,
    context JSONB,
    stack_trace TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Add RLS policies for system_logs (admin only)**

---

## 🟡 PHASE 5: SERVICE LAYER IMPLEMENTATION (Week 3)
**Target:** Create missing services
**Estimated Time:** 5-7 days
**Priority:** MEDIUM

### 5.1 Student Services

- [ ] **Create aiStudyAssistantService.ts enhancements**
  - [ ] `getStudyPlans(studentId)` - implemented
  - [ ] `createStudyPlan(studentId, planData)` - new
  - [ ] `updateStudyPlanProgress(planId, progress)` - new
  - [ ] `deleteStudyPlan(planId)` - new
  - [ ] `getLearningAnalytics(studentId)` - implemented
  - [ ] `generateLearningAnalytics(studentId)` - new
  - [ ] `getAIRecommendations(studentId)` - implemented
  - [ ] `markRecommendationCompleted(recommendationId)` - new

- [ ] **Test AI study services**
  - [ ] Unit tests for each function
  - [ ] Integration tests
  - [ ] Performance tests

### 5.2 Teacher Services

- [ ] **Create teacherDashboardService.ts**
  ```typescript
  // services/teacherDashboardService.ts
  export async function getTeacherStats(teacherId: string) {
    // Fetch dashboard statistics
  }

  export async function getUpcomingClasses(teacherId: string) {
    // Fetch upcoming classes
  }

  export async function getPendingGrading(teacherId: string) {
    // Fetch assignments pending grading
  }
  ```

- [ ] **Create assignmentCreatorService.ts**
  ```typescript
  export async function createAssignment(assignmentData: Assignment) {
    // Create assignment with questions
  }

  export async function createQuestion(questionData: Question) {
    // Add question to assignment
  }

  export async function createRubric(rubricData: Rubric) {
    // Create grading rubric
  }

  export async function createTemplate(templateData: Template) {
    // Save assignment template
  }

  export async function getTemplates(teacherId: string) {
    // Get teacher's templates
  }
  ```

- [ ] **Create attendanceManagementService.ts**
  ```typescript
  export async function markBulkAttendance(attendanceData: AttendanceRecord[]) {
    // Mark attendance for multiple students
  }

  export async function generateAttendanceReport(params: ReportParams) {
    // Generate attendance report
  }

  export async function getAttendanceAlerts(teacherId: string) {
    // Get students at risk
  }

  export async function analyzeAttendancePatterns(studentId: string) {
    // AI pattern analysis
  }
  ```

- [ ] **Create liveClassService.ts**
  ```typescript
  export async function createLiveSession(sessionData: Session) {
    // Create live class session
  }

  export async function startRecording(sessionId: string) {
    // Start session recording
  }

  export async function stopRecording(sessionId: string) {
    // Stop session recording
  }

  export async function saveWhiteboardData(sessionId: string, data: any) {
    // Save whiteboard content
  }

  export async function createBreakoutRoom(sessionId: string, roomData: any) {
    // Create breakout room
  }
  ```

- [ ] **Create gradingService.ts**
  ```typescript
  export async function gradeSubmission(submissionId: string, gradeData: any) {
    // Grade student submission
  }

  export async function bulkGrade(submissions: any[]) {
    // Bulk grading
  }

  export async function applyRubric(submissionId: string, rubricId: string) {
    // Apply rubric to submission
  }

  export async function generateFeedback(submissionId: string) {
    // AI-generated feedback
  }
  ```

- [ ] **Create teacherCommunicationService.ts**
  ```typescript
  export async function sendMessageToParent(teacherId: string, parentId: string, message: any) {
    // Send message to parent
  }

  export async function sendBulkMessage(teacherId: string, recipients: string[], message: any) {
    // Send bulk messages
  }

  export async function createMessageTemplate(templateData: any) {
    // Create message template
  }
  ```

- [ ] **Test all teacher services**

### 5.3 Admin Services

- [ ] **Create userManagementService.ts**
  ```typescript
  export async function createUser(userData: User) {
    // Create new user
  }

  export async function updateUser(userId: string, updates: Partial<User>) {
    // Update user
  }

  export async function deleteUser(userId: string) {
    // Soft delete user
  }

  export async function assignRole(userId: string, roleId: string) {
    // Assign role to user
  }

  export async function removeRole(userId: string, roleId: string) {
    // Remove role from user
  }

  export async function searchUsers(filters: SearchFilter) {
    // Advanced user search
  }
  ```

- [ ] **Create roleManagementService.ts**
  ```typescript
  export async function createRole(roleData: UserRole) {
    // Create custom role
  }

  export async function updateRole(roleId: string, updates: any) {
    // Update role
  }

  export async function assignPermission(roleId: string, permissionId: string) {
    // Assign permission to role
  }

  export async function getRolePermissions(roleId: string) {
    // Get all permissions for role
  }
  ```

- [ ] **Create systemMetricsService.ts**
  ```typescript
  export async function getSystemMetrics(timeframe: string) {
    // Get system metrics
  }

  export async function recordMetric(metricName: string, value: number) {
    // Record new metric
  }

  export async function getResourceUtilization() {
    // Get resource usage
  }

  export async function getUserActivities(filters: any) {
    // Get user activities
  }
  ```

- [ ] **Create analyticsService.ts**
  ```typescript
  export async function getInstitutionalMetrics(timeframe: string) {
    // Get institution-wide metrics
  }

  export async function getPredictiveAnalytics(modelName: string) {
    // Get ML predictions
  }

  export async function generateReport(reportType: string, params: any) {
    // Generate analytical report
  }

  export async function exportData(dataType: string, format: string) {
    // Export data in various formats
  }
  ```

- [ ] **Create auditLogService.ts**
  ```typescript
  export async function logAuditEvent(eventData: AuditEvent) {
    // Log audit event
  }

  export async function getAuditLogs(filters: AuditFilter) {
    // Query audit logs
  }

  export async function exportAuditLogs(filters: AuditFilter, format: string) {
    // Export audit logs
  }
  ```

- [ ] **Create bulkOperationsService.ts**
  ```typescript
  export async function importUsers(file: File) {
    // Bulk import users
  }

  export async function exportUsers(filters: any, format: string) {
    // Export users
  }

  export async function bulkUpdate(userIds: string[], updates: any) {
    // Bulk update users
  }

  export async function getBulkOperationStatus(operationId: string) {
    // Get operation status
  }
  ```

- [ ] **Test all admin services**

---

## 🟢 PHASE 6: ADVANCED FEATURES (Week 4)
**Target:** Enhance functionality
**Estimated Time:** 5-7 days
**Priority:** LOW

### 6.1 Real-time Features

- [ ] **Set up Supabase Realtime subscriptions**
  - [ ] Live class participant updates
  - [ ] Chat message updates
  - [ ] Notification updates
  - [ ] Attendance updates

- [ ] **Create realtime hooks**
  ```typescript
  export function useRealtimeMessages(roomId: string) {
    // Subscribe to chat messages
  }

  export function useRealtimeNotifications(userId: string) {
    // Subscribe to notifications
  }

  export function useRealtimeParticipants(sessionId: string) {
    // Subscribe to session participants
  }
  ```

- [ ] **Test realtime features**

### 6.2 File Upload & Storage

- [ ] **Configure Supabase Storage buckets**
  - [ ] `assignments` bucket
  - [ ] `submissions` bucket
  - [ ] `profile-images` bucket
  - [ ] `recordings` bucket
  - [ ] `whiteboard` bucket

- [ ] **Set up storage policies**
  ```sql
  CREATE POLICY "Users can upload to own folder"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'assignments' AND auth.uid()::text = (storage.foldername(name))[1]);
  ```

- [ ] **Create file upload service**
  ```typescript
  export async function uploadFile(bucket: string, path: string, file: File) {
    // Upload file to storage
  }

  export async function deleteFile(bucket: string, path: string) {
    // Delete file from storage
  }

  export async function getPublicUrl(bucket: string, path: string) {
    // Get public URL
  }
  ```

- [ ] **Test file upload/download**

### 6.3 Notification System

- [ ] **Create notification templates**
  ```sql
  INSERT INTO notification_templates (type, title_template, message_template)
  VALUES
    ('assignment_due', 'Assignment Due: {{assignment_title}}', 'Your assignment is due on {{due_date}}'),
    ('grade_published', 'Grade Published: {{assignment_title}}', 'Your grade is {{grade}}'),
    ('payment_reminder', 'Payment Reminder', 'Payment of ₹{{amount}} is due on {{due_date}}');
  ```

- [ ] **Create notification service**
  ```typescript
  export async function createNotification(notification: Notification) {
    // Create notification
  }

  export async function sendBulkNotifications(notifications: Notification[]) {
    // Send bulk notifications
  }

  export async function markAsRead(notificationId: string) {
    // Mark notification as read
  }

  export async function markAllAsRead(userId: string) {
    // Mark all as read
  }
  ```

- [ ] **Set up push notification integration**
  - [ ] Firebase Cloud Messaging setup
  - [ ] Device token storage
  - [ ] Push notification triggers

- [ ] **Test notification system**

### 6.4 Email & SMS Integration

- [ ] **Set up email service (e.g., SendGrid, AWS SES)**
  - [ ] Configure API keys
  - [ ] Create email templates
  - [ ] Set up DKIM/SPF

- [ ] **Create email service**
  ```typescript
  export async function sendEmail(to: string, template: string, data: any) {
    // Send templated email
  }

  export async function sendBulkEmails(recipients: string[], template: string, data: any) {
    // Send bulk emails
  }
  ```

- [ ] **Set up SMS service (e.g., Twilio, AWS SNS)**
  - [ ] Configure API keys
  - [ ] Create SMS templates

- [ ] **Create SMS service**
  ```typescript
  export async function sendSMS(to: string, message: string) {
    // Send SMS
  }

  export async function sendBulkSMS(recipients: string[], message: string) {
    // Send bulk SMS
  }
  ```

- [ ] **Test email/SMS delivery**

### 6.5 Payment Gateway Integration

- [ ] **Set up Razorpay integration**
  - [ ] Get API keys
  - [ ] Configure webhook endpoint
  - [ ] Set up payment modes

- [ ] **Create payment service**
  ```typescript
  export async function createPaymentOrder(amount: number, currency: string) {
    // Create Razorpay order
  }

  export async function verifyPayment(orderId: string, paymentId: string, signature: string) {
    // Verify payment signature
  }

  export async function processPayment(paymentData: Payment) {
    // Process payment and update DB
  }

  export async function refundPayment(paymentId: string, amount: number) {
    // Process refund
  }
  ```

- [ ] **Set up webhook handler**
  ```typescript
  export async function handlePaymentWebhook(event: any) {
    // Handle Razorpay webhook events
  }
  ```

- [ ] **Test payment flow**
  - [ ] Test payment success
  - [ ] Test payment failure
  - [ ] Test refund

### 6.6 Calendar Integration

- [ ] **Set up calendar sync**
  - [ ] Google Calendar integration
  - [ ] Apple Calendar integration
  - [ ] Outlook Calendar integration

- [ ] **Create calendar service**
  ```typescript
  export async function syncToCalendar(userId: string, event: CalendarEvent) {
    // Sync event to user's calendar
  }

  export async function createCalendarEvent(eventData: any) {
    // Create calendar event
  }

  export async function deleteCalendarEvent(eventId: string) {
    // Delete calendar event
  }
  ```

- [ ] **Test calendar sync**

---

## 🟢 PHASE 7: PERFORMANCE & OPTIMIZATION (Week 5)
**Target:** Optimize for production
**Estimated Time:** 3-5 days
**Priority:** LOW

### 7.1 Query Optimization

- [ ] **Analyze slow queries**
  ```sql
  SELECT query, mean_exec_time, calls
  FROM pg_stat_statements
  ORDER BY mean_exec_time DESC
  LIMIT 20;
  ```

- [ ] **Optimize identified slow queries**
  - [ ] Add missing indexes
  - [ ] Rewrite inefficient queries
  - [ ] Use materialized views where appropriate

- [ ] **Set up query monitoring**
  - [ ] Enable pg_stat_statements
  - [ ] Set up alerts for slow queries

### 7.2 Caching Strategy

- [ ] **Implement React Query caching**
  - [ ] Configure stale times
  - [ ] Configure cache times
  - [ ] Set up background refetching

- [ ] **Implement server-side caching**
  - [ ] Set up Redis (if needed)
  - [ ] Cache frequent queries
  - [ ] Cache computed data

- [ ] **Test caching effectiveness**

### 7.3 Database Connection Pooling

- [ ] **Configure Supabase connection pooler**
  - [ ] Set pool size
  - [ ] Configure timeout settings
  - [ ] Set up connection recycling

- [ ] **Monitor connection pool**
  ```sql
  SELECT * FROM pg_stat_database;
  ```

### 7.4 Materialized Views

- [ ] **Create materialized views for dashboards**
  ```sql
  CREATE MATERIALIZED VIEW mv_teacher_dashboard_stats AS
  SELECT
    t.id,
    COUNT(DISTINCT a.id) as total_assignments,
    COUNT(DISTINCT ls.id) as total_sessions,
    AVG(att.attendance_rate) as avg_class_attendance
  FROM teachers t
  LEFT JOIN assignments a ON a.teacher_id = t.id
  LEFT JOIN live_sessions ls ON ls.teacher_id = t.id
  LEFT JOIN (
    SELECT class_id,
           COUNT(CASE WHEN status = 'present' THEN 1 END)::FLOAT / COUNT(*) as attendance_rate
    FROM attendance
    GROUP BY class_id
  ) att ON att.class_id = t.id
  GROUP BY t.id;
  ```

- [ ] **Set up automatic refresh**
  ```sql
  CREATE OR REPLACE FUNCTION refresh_materialized_views()
  RETURNS void AS $$
  BEGIN
    REFRESH MATERIALIZED VIEW mv_teacher_dashboard_stats;
    REFRESH MATERIALIZED VIEW mv_student_performance_summary;
  END;
  $$ LANGUAGE plpgsql;

  -- Schedule refresh every hour
  SELECT cron.schedule('refresh-mv', '0 * * * *', 'SELECT refresh_materialized_views()');
  ```

- [ ] **Test materialized view performance**

### 7.5 Database Partitioning

- [ ] **Partition large tables by date**
  ```sql
  -- Partition attendance by month
  CREATE TABLE attendance_2024_01 PARTITION OF attendance
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

  CREATE TABLE attendance_2024_02 PARTITION OF attendance
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
  ```

- [ ] **Set up automatic partition creation**

- [ ] **Test partition queries**

---

## 🟢 PHASE 8: TESTING & QA (Week 6)
**Target:** Ensure quality
**Estimated Time:** 5-7 days
**Priority:** MEDIUM

### 8.1 Unit Tests

- [ ] **Test database functions**
  - [ ] Test `calculate_student_gpa()`
  - [ ] Test `get_attendance_percentage()`
  - [ ] Test `is_admin()`, `is_teacher()`, etc.

- [ ] **Test service functions**
  - [ ] Test parent services
  - [ ] Test student services
  - [ ] Test teacher services
  - [ ] Test admin services

- [ ] **Achieve 80%+ code coverage**

### 8.2 Integration Tests

- [ ] **Test end-to-end flows**
  - [ ] Student enrollment flow
  - [ ] Assignment submission flow
  - [ ] Payment processing flow
  - [ ] Live class flow

- [ ] **Test RLS policies**
  - [ ] Test data isolation
  - [ ] Test role-based access
  - [ ] Test unauthorized access (should fail)

### 8.3 Performance Tests

- [ ] **Load testing**
  - [ ] 100 concurrent users
  - [ ] 500 concurrent users
  - [ ] 1000 concurrent users

- [ ] **Stress testing**
  - [ ] Database connection limits
  - [ ] API rate limits
  - [ ] File upload limits

- [ ] **Benchmark critical queries**
  - [ ] Dashboard loads < 2s
  - [ ] Assignment list loads < 1s
  - [ ] Attendance marking < 500ms

### 8.4 Security Testing

- [ ] **SQL injection testing**
- [ ] **XSS testing**
- [ ] **CSRF testing**
- [ ] **Authentication bypass testing**
- [ ] **Authorization bypass testing**
- [ ] **Data exposure testing**

### 8.5 User Acceptance Testing

- [ ] **Parent user testing**
  - [ ] Dashboard functionality
  - [ ] Payment processing
  - [ ] Communication features

- [ ] **Student user testing**
  - [ ] Assignment submission
  - [ ] Live class attendance
  - [ ] Study materials access

- [ ] **Teacher user testing**
  - [ ] Assignment creation
  - [ ] Grading workflow
  - [ ] Live class management

- [ ] **Admin user testing**
  - [ ] User management
  - [ ] System monitoring
  - [ ] Reports generation

---

## 🟡 PHASE 9: DOCUMENTATION (Week 6-7)
**Target:** Complete documentation
**Estimated Time:** 3-4 days
**Priority:** MEDIUM

### 9.1 API Documentation

- [ ] **Document all API endpoints**
  - [ ] Parent endpoints
  - [ ] Student endpoints
  - [ ] Teacher endpoints
  - [ ] Admin endpoints

- [ ] **Create Postman collection**
- [ ] **Generate OpenAPI/Swagger docs**

### 9.2 Database Documentation

- [ ] **Document all tables**
  - [ ] Table purpose
  - [ ] Column descriptions
  - [ ] Relationships
  - [ ] Indexes

- [ ] **Create ER diagram**
- [ ] **Document RLS policies**
- [ ] **Document database functions**

### 9.3 Service Documentation

- [ ] **Document all services**
  - [ ] Function signatures
  - [ ] Parameters
  - [ ] Return types
  - [ ] Examples

- [ ] **Create developer guide**
- [ ] **Create deployment guide**

### 9.4 User Documentation

- [ ] **Create user manuals**
  - [ ] Parent user guide
  - [ ] Student user guide
  - [ ] Teacher user guide
  - [ ] Admin user guide

- [ ] **Create video tutorials**
- [ ] **Create FAQ**

---

## 🔴 PHASE 10: PRODUCTION DEPLOYMENT (Week 7)
**Target:** Go live
**Estimated Time:** 2-3 days
**Priority:** HIGH

### 10.1 Pre-deployment Checklist

- [ ] **Security audit complete**
- [ ] **All tests passing**
- [ ] **Performance benchmarks met**
- [ ] **Backup strategy in place**
- [ ] **Monitoring configured**
- [ ] **Documentation complete**

### 10.2 Environment Setup

- [ ] **Production database**
  - [ ] Create production project
  - [ ] Configure connection pooling
  - [ ] Set up daily backups
  - [ ] Configure replication (if needed)

- [ ] **Environment variables**
  - [ ] Database URL
  - [ ] API keys
  - [ ] Third-party credentials
  - [ ] Feature flags

- [ ] **DNS & SSL**
  - [ ] Configure domain
  - [ ] Set up SSL certificate
  - [ ] Configure CDN

### 10.3 Migration Execution

- [ ] **Run migration scripts**
  - [ ] Create all tables
  - [ ] Create all indexes
  - [ ] Create all views
  - [ ] Create all functions

- [ ] **Seed initial data**
  - [ ] System roles
  - [ ] Default settings
  - [ ] Email templates
  - [ ] Notification templates

- [ ] **Verify migration**
  ```sql
  -- Check all tables exist
  SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';

  -- Check all RLS enabled
  SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true;

  -- Check all indexes created
  SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';
  ```

### 10.4 Monitoring Setup

- [ ] **Application monitoring**
  - [ ] Set up error tracking (Sentry)
  - [ ] Set up performance monitoring
  - [ ] Set up uptime monitoring

- [ ] **Database monitoring**
  - [ ] Query performance monitoring
  - [ ] Connection pool monitoring
  - [ ] Storage usage alerts

- [ ] **Alert configuration**
  - [ ] Error rate alerts
  - [ ] Performance degradation alerts
  - [ ] Security event alerts

### 10.5 Deployment

- [ ] **Deploy backend**
  - [ ] Deploy database migrations
  - [ ] Deploy API services
  - [ ] Deploy background jobs

- [ ] **Deploy frontend**
  - [ ] Build production bundle
  - [ ] Deploy to hosting
  - [ ] Configure CDN

- [ ] **Smoke testing**
  - [ ] Test login
  - [ ] Test dashboard load
  - [ ] Test critical flows

### 10.6 Post-deployment

- [ ] **Monitor for 24 hours**
- [ ] **Check error rates**
- [ ] **Check performance metrics**
- [ ] **Gather user feedback**
- [ ] **Hot fix any critical issues**

---

## 📊 PROGRESS TRACKING

### Completion Status by Phase

| Phase | Tasks | Completed | In Progress | Not Started | %  |
|-------|-------|-----------|-------------|-------------|-----|
| Phase 0: MCP Setup | 15 | 0 | 0 | 15 | 0% |
| Phase 1: Security | 40 | 0 | 0 | 40 | 0% |
| Phase 2: Data Population | 25 | 0 | 0 | 25 | 0% |
| Phase 3: Optimization | 45 | 0 | 0 | 45 | 0% |
| Phase 4: Missing Tables | 35 | 0 | 0 | 35 | 0% |
| Phase 5: Services | 30 | 0 | 0 | 30 | 0% |
| Phase 6: Advanced Features | 20 | 0 | 0 | 20 | 0% |
| Phase 7: Performance | 15 | 0 | 0 | 15 | 0% |
| Phase 8: Testing | 20 | 0 | 0 | 20 | 0% |
| Phase 9: Documentation | 12 | 0 | 0 | 12 | 0% |
| Phase 10: Deployment | 15 | 0 | 0 | 15 | 0% |
| **TOTAL** | **272** | **0** | **0** | **272** | **0%** |

---

## 🎯 QUICK WIN TASKS (Do These First!)

### Day 0: Setup MCP (2 hours)
1. ✅ **Connect to Supabase MCP** (15 min) - Enable powerful tools
2. ✅ **Generate TypeScript types** (15 min) - Type safety
3. ✅ **Run security advisor** (15 min) - Find issues
4. ✅ **Run performance advisor** (15 min) - Find bottlenecks
5. ✅ **Setup development branch** (30 min) - Safe testing
6. ✅ **Configure log monitoring** (30 min) - Debug capabilities

### Day 1: Critical Fixes (9 hours)
7. ✅ **Remove all temp RLS policies using MCP** (1 hour) - Critical security fix
8. ✅ **Populate assignments table using MCP** (1 hour) - Makes app usable
9. ✅ **Populate attendance table using MCP** (1 hour) - Core feature works
10. ✅ **Create essential indexes using MCP** (2 hours) - Performance boost
11. ✅ **Populate notifications using MCP** (30 min) - User engagement
12. ✅ **Create study_plans table using MCP** (1 hour) - AI features work
13. ✅ **Create assignment_questions table using MCP** (1 hour) - Teacher features work
14. ✅ **Test RLS with different roles** (2 hours) - Ensure security

**Total Time for Quick Wins: ~11 hours (1.5 days)**
**MCP Advantage: Saves ~3 hours with automated tools and advisors**

---

## 🚀 SUPABASE MCP SUPERPOWERS

### What is Supabase MCP?
**MCP (Model Context Protocol)** provides direct programmatic access to Supabase from Claude Code. Think of it as a powerful CLI built into your AI assistant!

### Available MCP Tools:

#### **Database Operations:**
- `mcp__supabase__list_tables` - List all tables
- `mcp__supabase__execute_sql` - Run SQL queries
- `mcp__supabase__apply_migration` - Apply migrations with versioning
- `mcp__supabase__list_migrations` - View migration history
- `mcp__supabase__list_extensions` - Check DB extensions

#### **Code Generation:**
- `mcp__supabase__generate_typescript_types` - Auto-generate types
- `mcp__supabase__get_project_url` - Get API URL
- `mcp__supabase__get_anon_key` - Get API keys

#### **Monitoring & Quality:**
- `mcp__supabase__get_advisors` - Security & performance audits
- `mcp__supabase__get_logs` - Real-time logs (api, postgres, auth, storage)

#### **Edge Functions:**
- `mcp__supabase__list_edge_functions` - List functions
- `mcp__supabase__get_edge_function` - Get function code
- `mcp__supabase__deploy_edge_function` - Deploy functions

#### **Branch Management:**
- `mcp__supabase__create_branch` - Create dev branches
- `mcp__supabase__list_branches` - List all branches
- `mcp__supabase__merge_branch` - Merge to production
- `mcp__supabase__reset_branch` - Reset branch
- `mcp__supabase__rebase_branch` - Rebase on production

#### **Storage:**
- `mcp__supabase__list_storage_buckets` - List buckets
- `mcp__supabase__get_storage_config` - Get config
- `mcp__supabase__update_storage_config` - Update config

### Why Use MCP Throughout This Project?

**1. Speed:**
- No manual Supabase dashboard switching
- Execute multiple queries in parallel
- Automated type generation
- One-command migrations

**2. Safety:**
- Branch-based development (test before production)
- Migration versioning
- Automatic rollback capability
- Security advisors catch issues early

**3. Quality:**
- Built-in performance advisor
- Built-in security advisor
- Real-time logs for debugging
- Type safety with auto-generated types

**4. Productivity:**
- ~30% faster development
- Fewer context switches
- Automated repetitive tasks
- Integrated workflow

### MCP Best Practices in This TODO:

✅ **Always use `apply_migration` instead of raw SQL** for schema changes
- Automatic versioning
- Rollback support
- Migration history

✅ **Run advisors after each major change**
```bash
mcp__supabase__get_advisors with type='security'
mcp__supabase__get_advisors with type='performance'
```

✅ **Use branches for development**
```bash
# Develop safely on dev branch
mcp__supabase__create_branch with name='development'

# Test thoroughly, then merge
mcp__supabase__merge_branch
```

✅ **Regenerate types after schema changes**
```bash
mcp__supabase__generate_typescript_types
```

✅ **Check logs when debugging**
```bash
mcp__supabase__get_logs with service='postgres'
mcp__supabase__get_logs with service='api'
```

---

## 📅 SUGGESTED SPRINT PLAN (MCP-Enhanced)

### Sprint 0 (Day 1): MCP Setup
- Complete Phase 0 (MCP Setup) - **2 hours**
- Run initial advisors
- Setup branches
- Generate initial types

### Sprint 1 (Week 1): Security & Core Data
- Complete Phase 1 (Security) using MCP migrations
- Complete Phase 2 (Data Population) using MCP execute_sql
- Start Phase 3 (Optimization - indexes only)

### Sprint 2 (Week 2): Tables & Optimization
- Complete Phase 3 (Optimization)
- Complete Phase 4 (Missing Tables)

### Sprint 3 (Week 3): Services
- Complete Phase 5 (Services)

### Sprint 4 (Week 4): Advanced Features
- Complete Phase 6 (Advanced Features)

### Sprint 5 (Week 5): Performance & Testing
- Complete Phase 7 (Performance)
- Start Phase 8 (Testing)

### Sprint 6 (Week 6): Testing & Docs
- Complete Phase 8 (Testing)
- Complete Phase 9 (Documentation)

### Sprint 7 (Week 7): Deployment
- Complete Phase 10 (Deployment)
- Production launch! 🚀

---

## 🔗 RELATED DOCUMENTS

- [COMPREHENSIVE_SCREEN_DATABASE_ANALYSIS.md](./COMPREHENSIVE_SCREEN_DATABASE_ANALYSIS.md) - Full analysis
- Database schema files (when created)
- API documentation (when created)
- Deployment guide (when created)

---

**Last Updated:** 2025-10-20
**Version:** 1.0
**Maintainer:** Development Team

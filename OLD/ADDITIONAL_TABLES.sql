-- Additional Tables for Complete Supabase Integration
-- Run this in Supabase SQL Editor after CREATE_ALL_TABLES_FIXED.sql

-- 1. Assignment Submissions Table
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id),
  submission_date TIMESTAMP DEFAULT NOW(),
  submission_text TEXT,
  attachments JSONB,
  status VARCHAR CHECK (status IN ('submitted', 'graded', 'late', 'missing')),
  score INTEGER,
  feedback TEXT,
  graded_by UUID REFERENCES profiles(id),
  graded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id),
  batch_id UUID NOT NULL REFERENCES batches(id),
  date DATE NOT NULL,
  status VARCHAR NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  marked_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(class_id, student_id, date)
);

-- 3. Doubts/Queries Table
CREATE TABLE IF NOT EXISTS doubts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id),
  subject_code VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  attachments JSONB,
  priority VARCHAR CHECK (priority IN ('low', 'medium', 'high')),
  status VARCHAR CHECK (status IN ('open', 'answered', 'closed', 'reopened')),
  views_count INTEGER DEFAULT 0,
  upvotes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Doubt Responses Table
CREATE TABLE IF NOT EXISTS doubt_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doubt_id UUID NOT NULL REFERENCES doubts(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL REFERENCES profiles(id),
  response_text TEXT NOT NULL,
  attachments JSONB,
  is_best_answer BOOLEAN DEFAULT false,
  upvotes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Gradebook/Marks Table
CREATE TABLE IF NOT EXISTS gradebook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id),
  subject_code VARCHAR NOT NULL,
  batch_id UUID NOT NULL REFERENCES batches(id),
  exam_type VARCHAR CHECK (exam_type IN ('quiz', 'test', 'midterm', 'final', 'assignment')),
  exam_name VARCHAR NOT NULL,
  max_marks INTEGER NOT NULL,
  obtained_marks DECIMAL NOT NULL,
  percentage DECIMAL,
  grade VARCHAR,
  remarks TEXT,
  exam_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES profiles(id),
  target_role VARCHAR CHECK (target_role IN ('all', 'student', 'teacher', 'parent', 'admin')),
  target_batch_ids UUID[],
  priority VARCHAR CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  is_pinned BOOLEAN DEFAULT false,
  attachments JSONB,
  published_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Class Materials Table
CREATE TABLE IF NOT EXISTS class_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  study_material_id UUID REFERENCES study_materials(id),
  title VARCHAR NOT NULL,
  file_url TEXT,
  file_type VARCHAR,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Student Progress Table
CREATE TABLE IF NOT EXISTS student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id),
  subject_code VARCHAR NOT NULL,
  batch_id UUID NOT NULL REFERENCES batches(id),
  attendance_percentage DECIMAL,
  average_score DECIMAL,
  completed_assignments INTEGER DEFAULT 0,
  total_assignments INTEGER DEFAULT 0,
  strengths TEXT[],
  weaknesses TEXT[],
  recommendations TEXT,
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, subject_code, batch_id)
);

-- Enable RLS on all new tables
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE doubts ENABLE ROW LEVEL SECURITY;
ALTER TABLE doubt_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE gradebook ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for new tables

-- Assignment Submissions: Students can read their own, teachers can read all
CREATE POLICY "Students can view their own submissions"
ON assignment_submissions FOR SELECT TO authenticated
USING (student_id = auth.uid() OR EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')
));

CREATE POLICY "Students can create their own submissions"
ON assignment_submissions FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own submissions"
ON assignment_submissions FOR UPDATE TO authenticated
USING (student_id = auth.uid());

-- Attendance: Students can view their own, teachers can manage all
CREATE POLICY "Users can view attendance"
ON attendance FOR SELECT TO authenticated
USING (student_id = auth.uid() OR EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')
));

CREATE POLICY "Teachers can manage attendance"
ON attendance FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')
));

-- Doubts: Public read, authenticated write
CREATE POLICY "Anyone can view doubts"
ON doubts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Students can create doubts"
ON doubts FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own doubts"
ON doubts FOR UPDATE TO authenticated
USING (student_id = auth.uid());

-- Doubt Responses: Public read, authenticated write
CREATE POLICY "Anyone can view responses"
ON doubt_responses FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can respond"
ON doubt_responses FOR INSERT TO authenticated
WITH CHECK (responder_id = auth.uid());

-- Gradebook: Students can view their own, teachers can manage
CREATE POLICY "Students can view their own grades"
ON gradebook FOR SELECT TO authenticated
USING (student_id = auth.uid() OR EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin', 'parent')
));

CREATE POLICY "Teachers can manage grades"
ON gradebook FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')
));

-- Announcements: Public read, admin/teacher write
CREATE POLICY "Everyone can view announcements"
ON announcements FOR SELECT TO authenticated USING (true);

CREATE POLICY "Teachers and admins can manage announcements"
ON announcements FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')
));

-- Class Materials: Public read, teachers write
CREATE POLICY "Everyone can view class materials"
ON class_materials FOR SELECT TO authenticated USING (true);

CREATE POLICY "Teachers can manage class materials"
ON class_materials FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')
));

-- Student Progress: Students can view their own, teachers/parents can view
CREATE POLICY "Users can view relevant progress"
ON student_progress FOR SELECT TO authenticated
USING (student_id = auth.uid() OR EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin', 'parent')
));

CREATE POLICY "Teachers can manage progress"
ON student_progress FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')
));

-- Create indexes for better performance
CREATE INDEX idx_assignment_submissions_student ON assignment_submissions(student_id);
CREATE INDEX idx_assignment_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_class ON attendance(class_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_doubts_student ON doubts(student_id);
CREATE INDEX idx_doubts_status ON doubts(status);
CREATE INDEX idx_doubt_responses_doubt ON doubt_responses(doubt_id);
CREATE INDEX idx_gradebook_student ON gradebook(student_id);
CREATE INDEX idx_announcements_published ON announcements(published_at);
CREATE INDEX idx_class_materials_class ON class_materials(class_id);
CREATE INDEX idx_student_progress_student ON student_progress(student_id);

-- Success message
SELECT 'Additional tables created successfully!' as message;

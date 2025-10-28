-- ============================================================================
-- CREATE SUBJECT DETAIL TABLES
-- Run this SQL in Supabase SQL Editor: https://supabase.com/dashboard/project/qrwroibhzgywaiecbcoa/editor
-- ============================================================================

-- STEP 1: Create gradebook table
CREATE TABLE IF NOT EXISTS gradebook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  subject_code TEXT NOT NULL,
  batch_id UUID REFERENCES batches(id),
  exam_type TEXT NOT NULL,
  exam_name TEXT NOT NULL,
  max_marks INTEGER NOT NULL,
  obtained_marks INTEGER NOT NULL,
  percentage NUMERIC(5,2),
  grade TEXT,
  remarks TEXT,
  exam_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 2: Create student_progress table
CREATE TABLE IF NOT EXISTS student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  subject_code TEXT NOT NULL,
  attendance_percentage NUMERIC(5,2),
  average_score NUMERIC(5,2),
  completed_assignments INTEGER DEFAULT 0,
  total_assignments INTEGER DEFAULT 0,
  strengths TEXT[],
  weaknesses TEXT[],
  recommendations TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, subject_code)
);

-- STEP 3: Create study_materials table
CREATE TABLE IF NOT EXISTS study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject_code TEXT,
  type TEXT NOT NULL,
  file_size TEXT,
  file_url TEXT,
  author TEXT,
  rating NUMERIC(3,2),
  downloads_count INTEGER DEFAULT 0,
  upload_date TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 4: Enable RLS on all three tables
ALTER TABLE gradebook ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create RLS policies for gradebook
CREATE POLICY "Parents can view their children's gradebook"
  ON gradebook FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT s.id
      FROM students s
      JOIN parents p ON s.parent_id = p.parent_id
      WHERE p.id = auth.uid()
    )
  );

-- STEP 6: Create RLS policies for student_progress
CREATE POLICY "Parents can view their children's progress"
  ON student_progress FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT s.id
      FROM students s
      JOIN parents p ON s.parent_id = p.parent_id
      WHERE p.id = auth.uid()
    )
  );

-- STEP 7: Create RLS policies for study_materials
CREATE POLICY "Anyone can view study materials"
  ON study_materials FOR SELECT
  TO authenticated
  USING (true);

-- STEP 8: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gradebook_student_subject
  ON gradebook(student_id, subject_code);

CREATE INDEX IF NOT EXISTS idx_gradebook_exam_date
  ON gradebook(exam_date DESC);

CREATE INDEX IF NOT EXISTS idx_student_progress_student_subject
  ON student_progress(student_id, subject_code);

CREATE INDEX IF NOT EXISTS idx_study_materials_subject
  ON study_materials(subject_code);

-- Verification query
SELECT
  'gradebook' as table_name,
  COUNT(*) as record_count
FROM gradebook
UNION ALL
SELECT
  'student_progress' as table_name,
  COUNT(*) as record_count
FROM student_progress
UNION ALL
SELECT
  'study_materials' as table_name,
  COUNT(*) as record_count
FROM study_materials;

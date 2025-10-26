-- Complete Database Setup for Manushi Coaching Platform (FIXED)
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/qrwroibhzgywaiecbcoa/sql/new

-- 1. Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  code VARCHAR UNIQUE NOT NULL,
  description TEXT,
  color_code VARCHAR,
  icon_name VARCHAR,
  grade_levels TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create batches table
CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  grade_level VARCHAR NOT NULL,
  section VARCHAR,
  academic_year VARCHAR,
  start_date DATE,
  end_date DATE,
  max_students INTEGER,
  current_enrollment INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  phone VARCHAR,
  full_name VARCHAR NOT NULL,
  avatar_url TEXT,
  role VARCHAR NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
  enrollment_number VARCHAR,
  grade VARCHAR,
  batch_id UUID REFERENCES batches(id),
  subjects TEXT[],
  specialization TEXT,
  children_ids UUID[],
  address TEXT,
  bio TEXT,
  preferences JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create study_materials table
CREATE TABLE IF NOT EXISTS study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  subject_id UUID REFERENCES subjects(id),
  subject_code VARCHAR,
  type VARCHAR NOT NULL CHECK (type IN ('pdf', 'video', 'audio', 'document', 'presentation', 'image')),
  file_url TEXT,
  file_size VARCHAR,
  thumbnail_url TEXT,
  upload_date DATE DEFAULT CURRENT_DATE,
  author VARCHAR,
  description TEXT,
  tags TEXT[],
  rating NUMERIC CHECK (rating >= 0 AND rating <= 5.0),
  downloads_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id),
  subject VARCHAR NOT NULL,
  teacher_id UUID NOT NULL REFERENCES profiles(id),
  title VARCHAR NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INTEGER,
  meeting_link TEXT,
  recording_url TEXT,
  status VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id),
  class_id UUID NOT NULL REFERENCES classes(id),
  subject VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  instructions TEXT,
  total_points INTEGER,
  assigned_date DATE DEFAULT CURRENT_DATE,
  due_date TIMESTAMP NOT NULL,
  status VARCHAR CHECK (status IN ('draft', 'published', 'archived')),
  attachments JSONB[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR CHECK (type IN ('info', 'warning', 'error', 'success', 'assignment', 'class', 'doubt', 'announcement')),
  priority VARCHAR CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- Enable RLS on all tables
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Allow public read access to subjects"
ON subjects FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Allow public read access to batches"
ON batches FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Allow public read access to profiles"
ON profiles FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow anonymous read access to study materials"
ON study_materials FOR SELECT TO anon USING (is_published = true);

CREATE POLICY "Allow authenticated read access to study materials"
ON study_materials FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access to classes"
ON classes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access to assignments"
ON assignments FOR SELECT TO authenticated USING (true);

-- Fixed notifications policy - allow authenticated users to read all for now
CREATE POLICY "Allow authenticated read access to notifications"
ON notifications FOR SELECT TO authenticated USING (true);

-- Insert sample subjects
INSERT INTO subjects (name, code, description, is_active) VALUES
('Mathematics', 'MATH', 'Mathematics and Calculus', true),
('Physics', 'PHYS', 'Physics and Mechanics', true),
('Chemistry', 'CHEM', 'Chemistry and Lab Work', true),
('Biology', 'BIO', 'Biology and Life Sciences', true),
('English', 'ENG', 'English Language and Literature', true),
('Computer Science', 'CS', 'Computer Science and Programming', true)
ON CONFLICT (code) DO NOTHING;

-- Insert sample batches
INSERT INTO batches (name, grade_level, section, academic_year, is_active) VALUES
('Grade 11 - Section A', '11', 'A', '2025-2026', true),
('Grade 11 - Section B', '11', 'B', '2025-2026', true),
('Grade 12 - Section A', '12', 'A', '2025-2026', true);

-- Insert sample study materials
INSERT INTO study_materials (
  title, subject_code, type, file_size, author, description, rating, downloads_count, views_count, tags, upload_date
) VALUES
('Physics Formula Reference', 'PHYS', 'pdf', '8.5 MB', 'Physics Department', 'Comprehensive collection of physics formulas for Grade 11 and 12', 4.5, 234, 1450, ARRAY['formulas', 'reference', 'physics', 'study-guide'], CURRENT_DATE - INTERVAL '15 days'),
('Cell Biology Presentation', 'BIO', 'presentation', '48.2 MB', 'Dr. James Wilson', 'Detailed presentation on cell structure, organelles, and cellular processes', 4.7, 412, 2340, ARRAY['biology', 'cells', 'presentation', 'neet-prep'], CURRENT_DATE - INTERVAL '8 days'),
('Organic Chemistry Lab Manual', 'CHEM', 'pdf', '12.8 MB', 'Dr. Emily Davis', 'Complete lab manual with experiments, procedures, and safety guidelines', 4.6, 187, 980, ARRAY['chemistry', 'lab', 'practical', 'organic'], CURRENT_DATE - INTERVAL '22 days'),
('Advanced Calculus Textbook', 'MATH', 'pdf', '25.4 MB', 'Dr. Sarah Johnson', 'Advanced calculus concepts including limits, derivatives, and integrals', 4.8, 567, 3120, ARRAY['mathematics', 'calculus', 'textbook', 'jee-advanced'], CURRENT_DATE - INTERVAL '30 days'),
('English Grammar & Composition', 'ENG', 'pdf', '15.3 MB', 'Prof. Michael Brown', 'Complete guide to English grammar, composition, and writing skills', 4.4, 298, 1650, ARRAY['english', 'grammar', 'writing', 'composition'], CURRENT_DATE - INTERVAL '12 days'),
('Thermodynamics Video Lectures', 'PHYS', 'video', '520 MB', 'Dr. Rajesh Kumar', 'Complete video lecture series on thermodynamics and heat transfer', 4.9, 892, 5600, ARRAY['physics', 'thermodynamics', 'video', 'lectures'], CURRENT_DATE - INTERVAL '5 days');

-- Success message
SELECT 'Database setup complete! All tables created with sample data.' as message;

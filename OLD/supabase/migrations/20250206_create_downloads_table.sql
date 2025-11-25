-- Migration: Create downloads table for offline file management
-- Date: 2025-02-06
-- Purpose: Track student downloads (videos, PDFs, notes, etc.) for offline usage

-- Create enum for download types
CREATE TYPE download_type AS ENUM ('videos', 'pdfs', 'notes', 'other');

-- Create downloads table
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  type download_type NOT NULL,
  size_mb DECIMAL(10, 2) NOT NULL DEFAULT 0,
  file_path TEXT NOT NULL,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_downloads_student_id ON public.downloads(student_id);
CREATE INDEX idx_downloads_type ON public.downloads(type);
CREATE INDEX idx_downloads_downloaded_at ON public.downloads(downloaded_at DESC);

-- Enable RLS
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Students can only see their own downloads
CREATE POLICY "Students can view own downloads"
  ON public.downloads
  FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM public.students
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert own downloads"
  ON public.downloads
  FOR INSERT
  WITH CHECK (
    student_id IN (
      SELECT id FROM public.students
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own downloads"
  ON public.downloads
  FOR UPDATE
  USING (
    student_id IN (
      SELECT id FROM public.students
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can delete own downloads"
  ON public.downloads
  FOR DELETE
  USING (
    student_id IN (
      SELECT id FROM public.students
      WHERE user_id = auth.uid()
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_downloads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER downloads_updated_at
  BEFORE UPDATE ON public.downloads
  FOR EACH ROW
  EXECUTE FUNCTION update_downloads_updated_at();

-- Insert sample data for testing
INSERT INTO public.downloads (student_id, title, subject, type, size_mb, file_path, downloaded_at)
SELECT
  s.id,
  'Concept: Linear equations in one variable',
  'Mathematics',
  'videos'::download_type,
  45.2,
  '/downloads/math_linear_equations.mp4',
  NOW() - INTERVAL '2 days'
FROM public.students s
WHERE s.email = 'student@test.com'
LIMIT 1;

INSERT INTO public.downloads (student_id, title, subject, type, size_mb, file_path, downloaded_at)
SELECT
  s.id,
  'Chapter 5: Thermodynamics - Complete Notes',
  'Physics',
  'pdfs'::download_type,
  12.8,
  '/downloads/physics_thermodynamics.pdf',
  NOW() - INTERVAL '5 days'
FROM public.students s
WHERE s.email = 'student@test.com'
LIMIT 1;

INSERT INTO public.downloads (student_id, title, subject, type, size_mb, file_path, downloaded_at)
SELECT
  s.id,
  'Cell Biology Quick Revision',
  'Biology',
  'notes'::download_type,
  3.5,
  '/downloads/biology_cell_notes.txt',
  NOW() - INTERVAL '1 day'
FROM public.students s
WHERE s.email = 'student@test.com'
LIMIT 1;

INSERT INTO public.downloads (student_id, title, subject, type, size_mb, file_path, downloaded_at)
SELECT
  s.id,
  'Organic Chemistry Reactions Video Series',
  'Chemistry',
  'videos'::download_type,
  128.4,
  '/downloads/chem_organic_reactions.mp4',
  NOW() - INTERVAL '7 days'
FROM public.students s
WHERE s.email = 'student@test.com'
LIMIT 1;

INSERT INTO public.downloads (student_id, title, subject, type, size_mb, file_path, downloaded_at)
SELECT
  s.id,
  'World War 2 Timeline PDF',
  'History',
  'pdfs'::download_type,
  8.9,
  '/downloads/history_ww2_timeline.pdf',
  NOW() - INTERVAL '3 days'
FROM public.students s
WHERE s.email = 'student@test.com'
LIMIT 1;

INSERT INTO public.downloads (student_id, title, subject, type, size_mb, file_path, downloaded_at)
SELECT
  s.id,
  'Practice Problems - Calculus',
  'Mathematics',
  'pdfs'::download_type,
  5.2,
  '/downloads/math_calculus_practice.pdf',
  NOW() - INTERVAL '4 days'
FROM public.students s
WHERE s.email = 'student@test.com'
LIMIT 1;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.downloads TO authenticated;
GRANT USAGE ON TYPE download_type TO authenticated;

-- Comments
COMMENT ON TABLE public.downloads IS 'Student offline downloads for videos, PDFs, notes, and other resources';
COMMENT ON COLUMN public.downloads.student_id IS 'Reference to the student who downloaded the file';
COMMENT ON COLUMN public.downloads.title IS 'Display title of the downloaded resource';
COMMENT ON COLUMN public.downloads.subject IS 'Subject/category of the resource';
COMMENT ON COLUMN public.downloads.type IS 'Type of download: videos, pdfs, notes, or other';
COMMENT ON COLUMN public.downloads.size_mb IS 'File size in megabytes';
COMMENT ON COLUMN public.downloads.file_path IS 'Local file path on device';
COMMENT ON COLUMN public.downloads.downloaded_at IS 'Timestamp when file was downloaded';

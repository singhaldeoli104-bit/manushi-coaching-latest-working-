# SubjectDetailScreen Database Setup Guide

## Overview
This guide explains how to set up the three database tables required for SubjectDetailScreen to display data.

## Tables Created
1. **gradebook** - Stores exam/test scores and grades
2. **student_progress** - Stores attendance, assignments, strengths, and weaknesses
3. **study_materials** - Stores learning resources (PDFs, videos, practice materials)

## Files Created
- `create-subject-detail-tables.sql` - DDL statements to create tables and RLS policies
- `insert-subject-detail-data.js` - Node.js script to insert sample data
- `INSERT_SUBJECT_DETAIL_DATA.sql` - Original comprehensive SQL file (reference)

## Setup Instructions

### Method 1: Using Supabase SQL Editor (Recommended)

#### Step 1: Create Tables
1. Go to: https://supabase.com/dashboard/project/qrwroibhzgywaiecbcoa/editor
2. Click "New Query"
3. Copy and paste the contents of `create-subject-detail-tables.sql`
4. Click "Run" or press Ctrl+Enter
5. Verify success: Check for "Success. No rows returned" message

#### Step 2: Insert Sample Data
Run the Node.js script from your terminal:
```bash
cd C:\PC\OLD
node insert-subject-detail-data.js
```

Expected output:
```
🚀 Starting data insertion for SubjectDetailScreen...

📦 Step 1: Getting batch_id...
✅ Found batch: [UUID]

📝 Step 2: Inserting gradebook records...
✅ Inserted: Unit 1 Quiz - Algebra
✅ Inserted: Mid-Term Test - Geometry
✅ Inserted: Homework Assignment 5
✅ Inserted: Laws of Motion Quiz
✅ Inserted: Mechanics Test
📊 Gradebook: 5/5 new records inserted

📈 Step 3: Inserting student progress records...
✅ Upserted progress: Mathematics
✅ Upserted progress: Physics

📚 Step 4: Inserting study materials...
✅ Inserted: Algebra Chapter Notes
✅ Inserted: Geometry Practice Problems
✅ Inserted: Laws of Motion Video Lecture
✅ Inserted: Mechanics Formula Sheet
📚 Study Materials: 4/4 new records inserted

✅ Step 5: Verifying inserted data...
[Verification results...]

🎉 Data insertion complete!
```

### Method 2: Using Supabase SQL Editor (All-in-One)

If you prefer to run everything in SQL:
1. Go to: https://supabase.com/dashboard/project/qrwroibhzgywaiecbcoa/editor
2. Copy the entire contents of `INSERT_SUBJECT_DETAIL_DATA.sql`
3. Paste and run it
4. Check the verification results at the end

## Data Inserted

### Gradebook (5 records for Priya Sharma)

#### Mathematics (3 records)
1. **Unit 1 Quiz - Algebra**
   - Score: 18/20 (90%, Grade: A)
   - Date: 15 days ago
   - Remarks: Excellent understanding of concepts

2. **Mid-Term Test - Geometry**
   - Score: 85/100 (85%, Grade: A)
   - Date: 8 days ago
   - Remarks: Strong performance in geometry

3. **Homework Assignment 5**
   - Score: 9/10 (90%, Grade: A)
   - Date: 3 days ago
   - Remarks: Complete and accurate work

#### Physics (2 records)
1. **Laws of Motion Quiz**
   - Score: 22/25 (88%, Grade: A)
   - Date: 12 days ago
   - Remarks: Good grasp of Newton's laws

2. **Mechanics Test**
   - Score: 78/100 (78%, Grade: B)
   - Date: 5 days ago
   - Remarks: Needs improvement in numerical problems

### Student Progress (2 records)

#### Mathematics
- Attendance: 95.5%
- Average Score: 88.33%
- Assignments: 8/10 completed
- Strengths: Algebra, Problem solving, Logical thinking
- Weaknesses: Complex word problems, Speed
- Recommendation: Focus on practicing timed problem sets to improve speed

#### Physics
- Attendance: 92.0%
- Average Score: 83.00%
- Assignments: 7/10 completed
- Strengths: Theory concepts, Diagrams
- Weaknesses: Numerical problems, Formula application
- Recommendation: Practice more numerical problems and formula derivations

### Study Materials (4 records)

#### Mathematics (2 materials)
1. **Algebra Chapter Notes** (PDF, 2.5 MB)
   - Author: Prof. Kumar
   - Rating: 4.5⭐
   - Downloads: 245

2. **Geometry Practice Problems** (Practice, 1.8 MB)
   - Author: Prof. Kumar
   - Rating: 4.8⭐
   - Downloads: 312

#### Physics (2 materials)
1. **Laws of Motion Video Lecture** (Video, 45 MB)
   - Author: Dr. Singh
   - Rating: 4.7⭐
   - Downloads: 189

2. **Mechanics Formula Sheet** (PDF, 500 KB)
   - Author: Dr. Singh
   - Rating: 4.9⭐
   - Downloads: 456

## Verification Queries

Run these queries in Supabase SQL Editor to verify data:

### Check gradebook records
```sql
SELECT
  subject_code,
  exam_name,
  exam_type,
  obtained_marks || '/' || max_marks as score,
  percentage || '%' as pct,
  grade,
  exam_date
FROM gradebook
WHERE student_id = '33333333-3333-3333-3333-333333333331'
ORDER BY exam_date DESC;
```

### Check student progress
```sql
SELECT
  subject_code,
  attendance_percentage || '%' as attendance,
  average_score as avg_score,
  completed_assignments || '/' || total_assignments as assignments,
  strengths,
  weaknesses,
  recommendations
FROM student_progress
WHERE student_id = '33333333-3333-3333-3333-333333333331';
```

### Check study materials
```sql
SELECT
  subject_code,
  title,
  type,
  file_size,
  rating,
  downloads_count
FROM study_materials
WHERE subject_code IN ('Mathematics', 'Physics')
ORDER BY subject_code, title;
```

## Testing in the App

1. **Open the app** and log in as parent
2. **Navigate to NewParentDashboard**
3. **Tap on "Mathematics" subject card**
4. **Verify SubjectDetailScreen shows:**
   - ✅ Grades section with 3 exams/tests
   - ✅ Progress section with attendance (95.5%), assignments (8/10)
   - ✅ Strengths: Algebra, Problem solving, Logical thinking
   - ✅ Weaknesses: Complex word problems, Speed
   - ✅ Study materials list with 2 items

5. **Go back and tap on "Physics" subject card**
6. **Verify SubjectDetailScreen shows:**
   - ✅ Grades section with 2 exams/tests
   - ✅ Progress section with attendance (92.0%), assignments (7/10)
   - ✅ Strengths: Theory concepts, Diagrams
   - ✅ Weaknesses: Numerical problems, Formula application
   - ✅ Study materials list with 2 items

## RLS Policies Created

### Gradebook
- Parents can view their children's gradebook entries
- Policy ensures student_id belongs to a child of the authenticated parent

### Student Progress
- Parents can view their children's progress records
- Policy ensures student_id belongs to a child of the authenticated parent

### Study Materials
- All authenticated users can view study materials
- No student-specific filtering (materials are shared resources)

## Troubleshooting

### Issue: "relation does not exist"
**Solution:** Run `create-subject-detail-tables.sql` first

### Issue: "insert or update on table violates foreign key constraint"
**Solution:** Ensure student with ID `33333333-3333-3333-3333-333333333331` exists

### Issue: Node script fails with "Cannot find module"
**Solution:** Make sure you're in the OLD directory:
```bash
cd C:\PC\OLD
node insert-subject-detail-data.js
```

### Issue: "No batch found"
**Solution:** Ensure the `batches` table has at least one record

### Issue: "duplicate key value violates unique constraint"
**Solution:** Data already exists. This is normal if you run the script multiple times. Student progress will be updated (upserted).

## Database Schema

### gradebook
```sql
CREATE TABLE gradebook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  subject_code TEXT NOT NULL,
  batch_id UUID REFERENCES batches(id),
  exam_type TEXT NOT NULL,          -- 'quiz', 'test', 'assignment', 'exam'
  exam_name TEXT NOT NULL,
  max_marks INTEGER NOT NULL,
  obtained_marks INTEGER NOT NULL,
  percentage NUMERIC(5,2),           -- Calculated percentage
  grade TEXT,                        -- 'A', 'B', 'C', etc.
  remarks TEXT,
  exam_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### student_progress
```sql
CREATE TABLE student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  subject_code TEXT NOT NULL,
  attendance_percentage NUMERIC(5,2),
  average_score NUMERIC(5,2),
  completed_assignments INTEGER DEFAULT 0,
  total_assignments INTEGER DEFAULT 0,
  strengths TEXT[],                  -- Array of strengths
  weaknesses TEXT[],                 -- Array of weaknesses
  recommendations TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, subject_code)
);
```

### study_materials
```sql
CREATE TABLE study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject_code TEXT,                 -- Optional: filter by subject
  type TEXT NOT NULL,                -- 'pdf', 'video', 'practice', 'notes'
  file_size TEXT,
  file_url TEXT,
  author TEXT,
  rating NUMERIC(3,2),               -- 0.00 to 5.00
  downloads_count INTEGER DEFAULT 0,
  upload_date TIMESTAMPTZ DEFAULT NOW()
);
```

## Next Steps

After successful setup:
1. ✅ Test SubjectDetailScreen with Mathematics
2. ✅ Test SubjectDetailScreen with Physics
3. ✅ Verify all three sections display correctly
4. Add more subjects and data as needed
5. Consider adding more exam types (midterm, final, etc.)
6. Add actual file URLs for study materials when available

## References

- SubjectDetailScreen: `C:\PC\OLD\src\screens\parent\SubjectDetailScreen.tsx`
- Original SQL: `C:\PC\OLD\INSERT_SUBJECT_DETAIL_DATA.sql`
- Supabase Dashboard: https://supabase.com/dashboard/project/qrwroibhzgywaiecbcoa

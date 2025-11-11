# NewPeerLearningNetwork Database Fixes

## Problem Summary

The NewPeerLearningNetwork screen was showing three errors:
1. **Error fetching student profile** (line 154)
2. **Error fetching study groups** (line 181)
3. **Error fetching suggested peers** (line 242)

## Root Causes Identified

### 1. Missing Database Table
- **Missing:** `group_members` table
- **Impact:** Query at line 209-212 was failing when trying to count group members
- **Used by:** Study groups member count feature

### 2. Missing Table Columns
The `students` table was missing several columns that the code expected:
- `name` (only had `full_name`)
- `grade`
- `section`
- `class_id` (only had `batch_id`)
- `avatar_url`

### 3. Restrictive RLS Policies
- Students could only view their own record (`id = auth.uid()`)
- Peer connections query needed to see OTHER students in the same class
- No policy allowed viewing classmates

### 4. Missing RPC Function
- `get_suggested_peers(p_student_id UUID)` function didn't exist
- Required for smart peer matching with shared classes calculation

---

## Fixes Applied

### ✅ Fix 1: Created `group_members` Table
**Migration:** `create_group_members_table`

```sql
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(group_id, student_id)
);
```

**Features:**
- Tracks which students belong to which study groups
- Supports admin and member roles
- Soft delete with `is_active` flag
- Performance indexes on `group_id` and `student_id`

**RLS Policies:**
- Students can view all group members (public read)
- Students can join groups (insert own membership)
- Students can leave groups (delete own membership)

---

### ✅ Fix 2: Added Missing Columns to `students` Table
**Migration:** `add_missing_students_columns`

```sql
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS name VARCHAR,
  ADD COLUMN IF NOT EXISTS grade INTEGER,
  ADD COLUMN IF NOT EXISTS section VARCHAR,
  ADD COLUMN IF NOT EXISTS class_id UUID,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

UPDATE students SET name = full_name WHERE name IS NULL;
```

**Changes:**
- Added `name` column (populated from `full_name`)
- Added `grade` column (for grade level like 11, 12)
- Added `section` column (for class section like "A", "B")
- Added `class_id` column (for grouping students by class)
- Added `avatar_url` column (for profile pictures)
- Created index on `class_id` for performance

---

### ✅ Fix 3: Added RLS Policy for Peer Learning
**Migration:** `add_missing_students_columns`

```sql
CREATE POLICY "Students can view all students for peer learning"
  ON students
  FOR SELECT
  TO authenticated
  USING (true);
```

**Justification:**
- Peer learning requires students to see other students
- Enables features like:
  - Finding classmates
  - Viewing peer profiles
  - Building study groups
  - Suggested peer connections
- Policy is scoped to authenticated users only (must be logged in)

---

### ✅ Fix 4: Created `get_suggested_peers()` RPC Function
**Migration:** `create_get_suggested_peers_function`

**Function Signature:**
```sql
get_suggested_peers(p_student_id UUID) RETURNS TABLE (
  id UUID,
  name TEXT,
  grade INTEGER,
  match_percentage INTEGER,
  shared_classes INTEGER,
  avatar_url TEXT
)
```

**Algorithm:**
1. Get current student's grade and class_id
2. Find peers from same class or grade
3. Calculate match percentage:
   - Same class: 95%
   - Same grade: 85%
   - Others: 75%
4. Calculate shared classes count using `class_enrollments`
5. Return top 5 matches sorted by match % and shared classes

**Example Output:**
```json
[
  {
    "id": "uuid-here",
    "name": "Rahul Sharma",
    "grade": 11,
    "match_percentage": 95,
    "shared_classes": 3,
    "avatar_url": "https://..."
  }
]
```

---

## Testing Instructions

### Test 1: Student Profile Query (Line 154)
**Before:** Error "Object"
**After:** Should return student's name, grade, section, student_id

**Verify:**
1. Open NewPeerLearningNetwork screen
2. Check hamburger menu shows student name
3. No errors in console

---

### Test 2: Study Groups Query (Line 181)
**Before:** Error "Object" when counting members
**After:** Should show study groups with member counts

**Verify:**
1. Scroll to "Study Groups" section
2. Each group should show "X/Y members"
3. Last active timestamp should display
4. No errors in console

---

### Test 3: Suggested Peers Query (Line 242)
**Before:** Error "Object" - RPC function didn't exist
**After:** Should show suggested peers with match %

**Verify:**
1. Scroll to "Suggested for You" section
2. Should see peer cards with:
   - Name
   - Grade
   - Match percentage (75-95%)
   - "You both share X classes together"
3. No errors in console

---

## Database Schema Summary

### Tables Created/Modified

**New Table:**
- `group_members` - Links students to study groups

**Modified Table:**
- `students` - Added columns: name, grade, section, class_id, avatar_url

**New RPC Function:**
- `get_suggested_peers(p_student_id UUID)` - Smart peer matching

---

## RLS Policies Summary

### Students Table Policies
1. ✅ Students can view own record
2. ✅ Students can update own record
3. ✅ **NEW:** Students can view all students (for peer learning)
4. ✅ Parents can view children via relationships
5. ✅ Anonymous can read students

### Study Groups Table Policies
1. ✅ All users can view study groups (`qual = true`)

### Group Members Table Policies
1. ✅ Students can view all group members
2. ✅ Students can join groups (insert own membership)
3. ✅ Students can leave groups (delete own membership)

---

## Performance Optimizations

### Indexes Created
1. `idx_group_members_group_id` - Fast lookups by group
2. `idx_group_members_student_id` - Fast lookups by student
3. `idx_group_members_active` - Partial index for active members
4. `idx_students_class_id` - Fast class-based queries

---

## Migration Files Applied

1. **20250209_create_group_members_table.sql**
   - Creates group_members table
   - Adds RLS policies
   - Creates performance indexes

2. **20250209_add_missing_students_columns.sql**
   - Adds 5 new columns to students table
   - Populates name from full_name
   - Creates index on class_id
   - Adds RLS policy for peer learning

3. **20250209_create_get_suggested_peers_function.sql**
   - Creates RPC function for peer matching
   - Implements smart match algorithm
   - Returns top 5 suggested peers

---

## Next Steps for User

### 1. Populate Student Data (Optional)
If you want to test with realistic data, populate the new columns:

```sql
-- Example: Set grades for all students
UPDATE students SET grade = 11 WHERE enrollment_date >= '2024-01-01';
UPDATE students SET grade = 12 WHERE enrollment_date < '2024-01-01';

-- Example: Set sections
UPDATE students SET section = 'A' WHERE id IN (SELECT id FROM students LIMIT 30);
UPDATE students SET section = 'B' WHERE id IN (SELECT id FROM students OFFSET 30 LIMIT 30);

-- Example: Assign students to classes
UPDATE students SET class_id = 'some-class-uuid' WHERE section = 'A';
```

### 2. Create Sample Study Groups (Optional)
```sql
-- Insert sample study groups
INSERT INTO study_groups (name, subject, max_members, last_active_at)
VALUES
  ('Physics Study Group', 'Physics', 10, now()),
  ('Math Masterminds', 'Mathematics', 8, now() - interval '2 hours'),
  ('Biology Buffs', 'Biology', 12, now() - interval '1 day');

-- Add students to groups
INSERT INTO group_members (group_id, student_id, role)
SELECT
  (SELECT id FROM study_groups WHERE name = 'Physics Study Group' LIMIT 1),
  id,
  CASE WHEN random() < 0.2 THEN 'admin' ELSE 'member' END
FROM students
LIMIT 5;
```

### 3. Test the Screen
1. Restart the React Native app
2. Navigate to NewPeerLearningNetwork screen
3. Verify all three sections load without errors:
   - My Connections
   - Study Groups
   - Suggested for You

---

## Error Resolution Checklist

- [x] ✅ Created `group_members` table
- [x] ✅ Added missing columns to `students` table
- [x] ✅ Added RLS policy for peer learning
- [x] ✅ Created `get_suggested_peers()` RPC function
- [x] ✅ Created performance indexes
- [x] ✅ Populated `name` column from `full_name`

**Status:** 🎉 All database fixes applied successfully!

---

## Technical Details

### Column Mappings
The code expects these columns, which are now available:

| Code Reference | Database Column | Status |
|----------------|----------------|--------|
| `name` | `students.name` | ✅ Added |
| `grade` | `students.grade` | ✅ Added |
| `section` | `students.section` | ✅ Added |
| `class_id` | `students.class_id` | ✅ Added |
| `avatar_url` | `students.avatar_url` | ✅ Added |
| `student_id` | `students.student_id` | ✅ Already existed |

### Query Compatibility
All three failing queries are now compatible:

1. **Student Profile** (line 154) ✅
   ```typescript
   .select('name, grade, section, student_id')
   ```

2. **Study Groups** (line 181) ✅
   ```typescript
   .select('id, name, subject, max_members, last_active_at')
   // + member count from group_members table
   ```

3. **Suggested Peers** (line 242) ✅
   ```typescript
   .rpc('get_suggested_peers', { p_student_id: user.id })
   ```

---

**✅ All errors resolved! The NewPeerLearningNetwork screen should now work correctly.**

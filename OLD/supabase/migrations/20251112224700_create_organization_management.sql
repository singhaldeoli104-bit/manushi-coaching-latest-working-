-- Organization Management System

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  head_of_department_id UUID REFERENCES profiles(id),
  teacher_count INTEGER DEFAULT 0,
  student_count INTEGER DEFAULT 0,
  subjects TEXT[] DEFAULT ARRAY[]::TEXT[],
  budget NUMERIC,
  location TEXT,
  established_year INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  parent_department_id UUID REFERENCES departments(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  section TEXT NOT NULL,
  department_id UUID REFERENCES departments(id),
  class_teacher_id UUID REFERENCES profiles(id),
  max_capacity INTEGER DEFAULT 30,
  current_enrollment INTEGER DEFAULT 0,
  academic_year TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  room TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create class_subjects table
CREATE TABLE IF NOT EXISTS class_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  teacher_id UUID REFERENCES profiles(id),
  weekly_hours INTEGER DEFAULT 0,
  room TEXT,
  is_core BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create class_schedules table
CREATE TABLE IF NOT EXISTS class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject_id UUID REFERENCES class_subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES profiles(id),
  room TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create teacher_assignments table
CREATE TABLE IF NOT EXISTS teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id),
  subjects TEXT[] DEFAULT ARRAY[]::TEXT[],
  workload INTEGER DEFAULT 0,
  max_workload INTEGER DEFAULT 25,
  specializations TEXT[] DEFAULT ARRAY[]::TEXT[],
  qualification TEXT,
  experience INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create teacher_classes table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS teacher_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  weekly_hours INTEGER DEFAULT 0,
  role TEXT NOT NULL CHECK (role IN ('class_teacher', 'subject_teacher', 'assistant')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(teacher_id, class_id, subject)
);

-- Create student_groups table
CREATE TABLE IF NOT EXISTS student_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('class', 'house', 'club', 'activity', 'academic', 'custom')),
  class_id UUID REFERENCES classes(id),
  supervisor_id UUID REFERENCES profiles(id),
  max_members INTEGER,
  meeting_schedule TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create student_group_members table
CREATE TABLE IF NOT EXISTS student_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES student_groups(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, student_id)
);

-- Create staff_hierarchy table
CREATE TABLE IF NOT EXISTS staff_hierarchy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT UNIQUE NOT NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  level INTEGER DEFAULT 0,
  manager_id UUID REFERENCES staff_hierarchy(id),
  responsibilities TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to get departments with full data
CREATE OR REPLACE FUNCTION get_departments()
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  head_of_department_id UUID,
  head_of_department_name TEXT,
  teacher_count INTEGER,
  student_count INTEGER,
  subjects TEXT[],
  budget NUMERIC,
  location TEXT,
  established_year INTEGER,
  is_active BOOLEAN,
  parent_department_id UUID,
  sub_department_ids UUID[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.name,
    d.description,
    d.head_of_department_id,
    CONCAT(p.first_name, ' ', p.last_name) AS head_of_department_name,
    d.teacher_count,
    d.student_count,
    d.subjects,
    d.budget,
    d.location,
    d.established_year,
    d.is_active,
    d.parent_department_id,
    ARRAY(SELECT id FROM departments WHERE parent_department_id = d.id) AS sub_department_ids
  FROM departments d
  LEFT JOIN profiles p ON p.id = d.head_of_department_id
  ORDER BY d.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get classes with subjects and schedules
CREATE OR REPLACE FUNCTION get_classes()
RETURNS TABLE (
  id UUID,
  name TEXT,
  grade TEXT,
  section TEXT,
  department_id UUID,
  class_teacher_id UUID,
  class_teacher_name TEXT,
  max_capacity INTEGER,
  current_enrollment INTEGER,
  academic_year TEXT,
  is_active BOOLEAN,
  room TEXT,
  subjects JSONB,
  schedules JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.grade,
    c.section,
    c.department_id,
    c.class_teacher_id,
    CONCAT(p.first_name, ' ', p.last_name) AS class_teacher_name,
    c.max_capacity,
    c.current_enrollment,
    c.academic_year,
    c.is_active,
    c.room,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', cs.id,
          'name', cs.name,
          'teacherId', cs.teacher_id,
          'teacherName', CONCAT(tp.first_name, ' ', tp.last_name),
          'weeklyHours', cs.weekly_hours,
          'room', cs.room,
          'isCore', cs.is_core
        )
      )
      FROM class_subjects cs
      LEFT JOIN profiles tp ON tp.id = cs.teacher_id
      WHERE cs.class_id = c.id),
      '[]'::jsonb
    ) AS subjects,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', sch.id,
          'dayOfWeek', sch.day_of_week,
          'startTime', sch.start_time::TEXT,
          'endTime', sch.end_time::TEXT,
          'subjectId', sch.subject_id,
          'teacherId', sch.teacher_id,
          'room', sch.room
        )
      )
      FROM class_schedules sch
      WHERE sch.class_id = c.id),
      '[]'::jsonb
    ) AS schedules
  FROM classes c
  LEFT JOIN profiles p ON p.id = c.class_teacher_id
  ORDER BY c.grade, c.section;
END;
$$ LANGUAGE plpgsql;

-- Function to get teacher assignments with classes
CREATE OR REPLACE FUNCTION get_teacher_assignments()
RETURNS TABLE (
  id UUID,
  teacher_id UUID,
  teacher_name TEXT,
  department_id UUID,
  department_name TEXT,
  subjects TEXT[],
  workload INTEGER,
  max_workload INTEGER,
  specializations TEXT[],
  qualification TEXT,
  experience INTEGER,
  is_active BOOLEAN,
  classes JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ta.id,
    ta.teacher_id,
    CONCAT(p.first_name, ' ', p.last_name) AS teacher_name,
    ta.department_id,
    d.name AS department_name,
    ta.subjects,
    ta.workload,
    ta.max_workload,
    ta.specializations,
    ta.qualification,
    ta.experience,
    ta.is_active,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'classId', tc.class_id,
          'className', c.name,
          'grade', c.grade,
          'section', c.section,
          'subject', tc.subject,
          'weeklyHours', tc.weekly_hours,
          'role', tc.role
        )
      )
      FROM teacher_classes tc
      JOIN classes c ON c.id = tc.class_id
      WHERE tc.teacher_id = ta.teacher_id),
      '[]'::jsonb
    ) AS classes
  FROM teacher_assignments ta
  LEFT JOIN profiles p ON p.id = ta.teacher_id
  LEFT JOIN departments d ON d.id = ta.department_id
  ORDER BY p.last_name, p.first_name;
END;
$$ LANGUAGE plpgsql;

-- Function to get student groups with members
CREATE OR REPLACE FUNCTION get_student_groups()
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  type TEXT,
  class_id UUID,
  supervisor_id UUID,
  supervisor_name TEXT,
  student_ids UUID[],
  max_members INTEGER,
  meeting_schedule TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  member_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sg.id,
    sg.name,
    sg.description,
    sg.type,
    sg.class_id,
    sg.supervisor_id,
    CONCAT(p.first_name, ' ', p.last_name) AS supervisor_name,
    ARRAY(SELECT student_id FROM student_group_members WHERE group_id = sg.id) AS student_ids,
    sg.max_members,
    sg.meeting_schedule,
    sg.is_active,
    sg.created_at,
    (SELECT COUNT(*)::INTEGER FROM student_group_members WHERE group_id = sg.id) AS member_count
  FROM student_groups sg
  LEFT JOIN profiles p ON p.id = sg.supervisor_id
  ORDER BY sg.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get staff hierarchy with manager and direct reports
CREATE OR REPLACE FUNCTION get_staff_hierarchy()
RETURNS TABLE (
  id UUID,
  employee_id TEXT,
  first_name TEXT,
  last_name TEXT,
  position TEXT,
  department TEXT,
  level INTEGER,
  manager_id UUID,
  manager_name TEXT,
  direct_report_ids UUID[],
  direct_report_count INTEGER,
  responsibilities TEXT[],
  is_active BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sh.id,
    sh.employee_id,
    p.first_name,
    p.last_name,
    sh.position,
    sh.department,
    sh.level,
    sh.manager_id,
    CASE
      WHEN sh.manager_id IS NOT NULL THEN
        (SELECT CONCAT(mp.first_name, ' ', mp.last_name)
         FROM staff_hierarchy msh
         JOIN profiles mp ON mp.id = msh.profile_id
         WHERE msh.id = sh.manager_id)
      ELSE NULL
    END AS manager_name,
    ARRAY(SELECT id FROM staff_hierarchy WHERE manager_id = sh.id) AS direct_report_ids,
    (SELECT COUNT(*)::INTEGER FROM staff_hierarchy WHERE manager_id = sh.id) AS direct_report_count,
    sh.responsibilities,
    sh.is_active
  FROM staff_hierarchy sh
  LEFT JOIN profiles p ON p.id = sh.profile_id
  ORDER BY sh.level, sh.employee_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get organization statistics
CREATE OR REPLACE FUNCTION get_organization_statistics()
RETURNS TABLE (
  total_departments INTEGER,
  active_departments INTEGER,
  total_classes INTEGER,
  active_classes INTEGER,
  total_teachers INTEGER,
  total_students INTEGER,
  average_class_size NUMERIC,
  teacher_utilization NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER AS total_departments,
    COUNT(*) FILTER (WHERE is_active = TRUE)::INTEGER AS active_departments,
    (SELECT COUNT(*)::INTEGER FROM classes) AS total_classes,
    (SELECT COUNT(*) FILTER (WHERE is_active = TRUE)::INTEGER FROM classes) AS active_classes,
    (SELECT COUNT(*)::INTEGER FROM profiles WHERE role = 'teacher') AS total_teachers,
    (SELECT COUNT(*)::INTEGER FROM profiles WHERE role = 'student') AS total_students,
    COALESCE((SELECT AVG(current_enrollment) FROM classes WHERE is_active = TRUE), 0)::NUMERIC AS average_class_size,
    COALESCE(
      (SELECT AVG(CASE WHEN max_workload > 0 THEN (workload::NUMERIC / max_workload * 100) ELSE 0 END)
       FROM teacher_assignments WHERE is_active = TRUE),
      0
    )::NUMERIC AS teacher_utilization
  FROM departments;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_departments TO authenticated;
GRANT EXECUTE ON FUNCTION get_classes TO authenticated;
GRANT EXECUTE ON FUNCTION get_teacher_assignments TO authenticated;
GRANT EXECUTE ON FUNCTION get_student_groups TO authenticated;
GRANT EXECUTE ON FUNCTION get_staff_hierarchy TO authenticated;
GRANT EXECUTE ON FUNCTION get_organization_statistics TO authenticated;

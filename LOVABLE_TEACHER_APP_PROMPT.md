# Lovable Prompt: Premium Teacher Management App
**Complete Implementation Prompt for Lovable.dev**

---

## 🎯 PROJECT OVERVIEW

I need a **premium minimal teacher management app** for K-12 educators and coaching institutes. This is a production-ready application with live classes, homework management, testing, and student tracking.

**Core Philosophy:** Clean, distraction-free interface that feels like a digital extension of a teacher's notebook—professional, efficient, and intuitive.

---

## 📱 DESIGN SYSTEM

### Visual Identity

**Style:** Premium Minimal / Modern Professional
- Clean whitespace-heavy layouts
- Subtle shadows and depth
- Smooth micro-interactions
- Focus on content, minimal decorative elements

**Color Palette:**
```
Primary: #3B82F6 (Blue 500) - Trust, professionalism
Secondary: #10B981 (Green 500) - Success, completed tasks
Accent: #8B5CF6 (Purple 500) - Live classes, premium features
Warning: #F59E0B (Amber 500) - Pending, late submissions
Error: #EF4444 (Red 500) - Errors, absences
Background: #F9FAFB (Gray 50) - Calm, spacious
Surface: #FFFFFF (White) - Cards, panels
Text Primary: #111827 (Gray 900)
Text Secondary: #6B7280 (Gray 500)
Border: #E5E7EB (Gray 200)
```

**Typography:**
```
Font Family: Inter (Google Font)
Headings:
  - H1: 32px, semibold (page titles)
  - H2: 24px, semibold (section headers)
  - H3: 20px, semibold (card titles)
  - H4: 18px, medium (subsections)
Body: 16px, normal
Small: 14px, normal
Tiny: 12px, normal (metadata, timestamps)
Line Height: 1.5
Letter Spacing: -0.01em (tight for headings)
```

**Spacing Scale (Tailwind):**
- Tight: 8px (space-y-2)
- Normal: 16px (space-y-4)
- Relaxed: 24px (space-y-6)
- Loose: 32px (space-y-8)
- Card Padding: 20px (p-5)
- Section Padding: 24px (p-6)

**Shadows:**
```
Card: shadow-sm (subtle elevation)
Hover: shadow-md (interactive feedback)
Modal: shadow-xl (prominent overlays)
Bottom Nav: shadow-lg (floating bar)
```

**Border Radius:**
```
Small: 8px (buttons, chips)
Medium: 12px (cards)
Large: 16px (modals, sheets)
Full: 9999px (avatars, badges)
```

---

## 🏗️ APP STRUCTURE

### Top Navigation Bar (Fixed)
```
┌─────────────────────────────────────────┐
│ ☰  Teacher Name              ⋮  👤     │
│ (Menu) (or Page Title)    (More)(Photo)│
└─────────────────────────────────────────┘
```

**Layout:**
- Height: 64px (h-16)
- Background: White with bottom border
- Left: Hamburger icon (24px) → Opens side drawer
- Center: Teacher name OR current page title
- Right: 3-dot menu (24px) + Avatar (40px circle)

**Hamburger Menu (Side Drawer):**
```
- Profile
- Settings
- Help & Support
- Privacy Policy
- Terms of Service
- Logout
```

**3-Dot Menu (Contextual):**
```
- Notifications (with badge count)
- Dark Mode Toggle (future)
- Quick Actions (varies by screen)
```

### Bottom Navigation (5 Tabs)

**Material Design Spec:**
- Height: 56px
- Icon Size: 24px
- Active: Primary color + label
- Inactive: Gray 400 + no label (or tiny label)
- Ripple effect on tap

**Tabs:**
```
┌─────┬─────┬─────┬─────┬─────┐
│ 🏠  │ 📚  │ ✅  │ 📊  │ ⚙️  │
│Home │Class│Asses│Analyt│More │
└─────┴─────┴─────┴─────┴─────┘
```

**Tab Details:**

1. **Home** (🏠)
   - Icon: Home outline
   - Label: "Home"
   - Route: /dashboard
   - Content: Today's schedule, upcoming classes, quick stats, recent activity

2. **Classes** (📚)
   - Icon: Book outline
   - Label: "Classes"
   - Route: /classes
   - Content: All classes/batches, student roster, class materials

3. **Assess** (✅)
   - Icon: Checkbox outline
   - Label: "Assess"
   - Route: /assess
   - Content: Homework, tests, submissions, grading queue

4. **Analytics** (📊)
   - Icon: Bar chart outline
   - Label: "Analytics"
   - Route: /analytics
   - Content: Student progress, attendance reports, performance insights

5. **More** (⚙️)
   - Icon: Grid/More outline
   - Label: "More"
   - Route: /more
   - Content: Attendance, resources, settings, tools

---

## 🗄️ DATABASE SCHEMA (SUPABASE)

**Before implementing, please review this complete schema and confirm understanding.**

```sql
-- ============================================
-- CORE ENTITIES
-- ============================================

-- TEACHERS
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  subjects TEXT[], -- Array of subjects taught
  profile_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers view own record" ON teachers
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Teachers update own record" ON teachers
  FOR UPDATE USING (auth.uid() = user_id);

-- CLASSES (Batches/Sections)
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Class 10A", "JEE Batch 2025"
  subject TEXT NOT NULL,
  grade_level INTEGER, -- 1-12
  description TEXT,
  color_code TEXT, -- For visual identification
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage own classes" ON classes
  FOR ALL USING (
    teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  );

-- STUDENTS
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  parent_name TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  grade_level INTEGER,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage own students" ON students
  FOR ALL USING (
    teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  );

-- CLASS ENROLLMENT (Many-to-Many)
CREATE TABLE class_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  UNIQUE(class_id, student_id)
);

ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage class enrollments" ON class_enrollments
  FOR ALL USING (
    class_id IN (
      SELECT id FROM classes WHERE teacher_id IN (
        SELECT id FROM teachers WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================
-- LIVE CLASSES
-- ============================================

-- SESSIONS (Scheduled live classes)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  session_link TEXT, -- WebRTC/Stream URL
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage own sessions" ON sessions
  FOR ALL USING (
    teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  );

-- SESSION SUMMARIES
CREATE TABLE session_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE UNIQUE,
  total_duration_minutes INTEGER,
  students_attended INTEGER,
  engagement_score NUMERIC(3, 2), -- 0.00 to 1.00
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE session_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers view own session summaries" ON session_summaries
  FOR SELECT USING (
    session_id IN (
      SELECT id FROM sessions WHERE teacher_id IN (
        SELECT id FROM teachers WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================
-- RESOURCES & MATERIALS
-- ============================================

-- RESOURCES (Notes, PDFs, Videos, Links)
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('pdf', 'video', 'link', 'image', 'doc', 'other')),
  file_url TEXT,
  file_size_bytes INTEGER,
  thumbnail_url TEXT,
  subject TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage own resources" ON resources
  FOR ALL USING (
    teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  );

-- RESOURCE SHARES (Link resources to classes/sessions)
CREATE TABLE resource_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  audience_type TEXT DEFAULT 'class' CHECK (audience_type IN ('class', 'group', 'individual')),
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource_id, class_id, session_id)
);

ALTER TABLE resource_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage resource shares" ON resource_shares
  FOR ALL USING (
    class_id IN (
      SELECT id FROM classes WHERE teacher_id IN (
        SELECT id FROM teachers WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================
-- ATTENDANCE
-- ============================================

-- ATTENDANCE RECORDS
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused', 'unmarked')),
  marked_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(session_id, student_id)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage attendance" ON attendance
  FOR ALL USING (
    class_id IN (
      SELECT id FROM classes WHERE teacher_id IN (
        SELECT id FROM teachers WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================
-- HOMEWORK & ASSIGNMENTS
-- ============================================

-- HOMEWORK
CREATE TABLE homework (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  instructions TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  total_points INTEGER DEFAULT 100,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
  audience_type TEXT DEFAULT 'class' CHECK (audience_type IN ('class', 'group', 'individual')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE homework ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage homework" ON homework
  FOR ALL USING (
    teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  );

-- QUESTIONS (Reusable question bank)
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'short_answer', 'long_answer', 'true_false')),
  options JSONB, -- For MCQs: [{"id": "A", "text": "Option A"}, ...]
  correct_answer TEXT, -- For auto-grading
  marks INTEGER DEFAULT 1,
  subject TEXT,
  topic TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage questions" ON questions
  FOR ALL USING (
    teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  );

-- HOMEWORK QUESTIONS (Link questions to homework)
CREATE TABLE homework_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homework_id UUID REFERENCES homework(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL,
  marks INTEGER NOT NULL,
  UNIQUE(homework_id, question_id)
);

ALTER TABLE homework_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage homework questions" ON homework_questions
  FOR ALL USING (
    homework_id IN (
      SELECT id FROM homework WHERE teacher_id IN (
        SELECT id FROM teachers WHERE user_id = auth.uid()
      )
    )
  );

-- HOMEWORK SUBMISSIONS
CREATE TABLE homework_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homework_id UUID REFERENCES homework(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  answers JSONB NOT NULL, -- [{question_id: "...", answer: "...", attachment_url: "..."}]
  submitted_at TIMESTAMPTZ,
  is_late BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'not_submitted' CHECK (status IN ('not_submitted', 'submitted', 'graded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(homework_id, student_id)
);

ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers view submissions" ON homework_submissions
  FOR SELECT USING (
    homework_id IN (
      SELECT id FROM homework WHERE teacher_id IN (
        SELECT id FROM teachers WHERE user_id = auth.uid()
      )
    )
  );

-- HOMEWORK GRADES
CREATE TABLE homework_grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES homework_submissions(id) ON DELETE CASCADE UNIQUE,
  question_scores JSONB NOT NULL, -- [{question_id: "...", marks_awarded: 5, max_marks: 10}]
  total_marks NUMERIC NOT NULL,
  max_total_marks INTEGER NOT NULL,
  overall_feedback TEXT,
  graded_at TIMESTAMPTZ DEFAULT NOW(),
  graded_by UUID REFERENCES teachers(id)
);

ALTER TABLE homework_grades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage grades" ON homework_grades
  FOR ALL USING (
    submission_id IN (
      SELECT id FROM homework_submissions WHERE homework_id IN (
        SELECT id FROM homework WHERE teacher_id IN (
          SELECT id FROM teachers WHERE user_id = auth.uid()
        )
      )
    )
  );

-- ============================================
-- TESTS & EXAMS
-- ============================================

-- TESTS
CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  total_marks INTEGER NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'live', 'completed', 'cancelled')),
  -- Settings
  shuffle_questions BOOLEAN DEFAULT FALSE,
  shuffle_options BOOLEAN DEFAULT FALSE,
  negative_marking_enabled BOOLEAN DEFAULT FALSE,
  negative_mark_value NUMERIC,
  attempt_limit INTEGER DEFAULT 1,
  show_results_to_students BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage tests" ON tests
  FOR ALL USING (
    teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  );

-- TEST QUESTIONS (Link questions to tests)
CREATE TABLE test_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL,
  marks INTEGER NOT NULL,
  UNIQUE(test_id, question_id)
);

ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage test questions" ON test_questions
  FOR ALL USING (
    test_id IN (
      SELECT id FROM tests WHERE teacher_id IN (
        SELECT id FROM teachers WHERE user_id = auth.uid()
      )
    )
  );

-- TEST SUBMISSIONS (Student attempts)
CREATE TABLE test_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  time_taken_minutes INTEGER,
  answers JSONB, -- [{question_id: "...", answer: "..."}]
  score NUMERIC,
  max_score INTEGER,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'graded')),
  UNIQUE(test_id, student_id)
);

ALTER TABLE test_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers view test submissions" ON test_submissions
  FOR SELECT USING (
    test_id IN (
      SELECT id FROM tests WHERE teacher_id IN (
        SELECT id FROM teachers WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_students_teacher ON students(teacher_id);
CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_sessions_class ON sessions(class_id);
CREATE INDEX idx_sessions_teacher ON sessions(teacher_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_homework_class ON homework(class_id);
CREATE INDEX idx_homework_teacher ON homework(teacher_id);
CREATE INDEX idx_homework_due_date ON homework(due_date);
CREATE INDEX idx_submissions_homework ON homework_submissions(homework_id);
CREATE INDEX idx_submissions_student ON homework_submissions(student_id);
CREATE INDEX idx_attendance_session ON attendance(session_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_tests_class ON tests(class_id);
CREATE INDEX idx_tests_teacher ON tests(teacher_id);
```

---

## 🎨 SCREEN-BY-SCREEN IMPLEMENTATION

### PHASE 1: Authentication & Onboarding

#### 1.1 Login Screen (`/login`)

```
Design:
- Centered card (max-width: 400px)
- Logo/App name at top
- Email input (with validation)
- Password input (with show/hide toggle)
- "Forgot Password?" link
- "Login" button (primary, full-width)
- "Sign up with Google" button (outlined)
- Loading state during authentication

Functionality:
- Supabase email/password authentication
- Form validation (email format, required fields)
- Error messages (invalid credentials, network errors)
- Redirect to /dashboard on success
- Remember me checkbox (optional)

UI Components:
- Input fields with floating labels
- Button with loading spinner
- Error toast notifications
- OAuth button with Google icon
```

#### 1.2 Signup Screen (`/signup`)

```
Design:
- Similar to login but with additional fields
- Full name input
- Email input
- Password input (with strength indicator)
- Confirm password input
- Subject selection (multi-select chips)
- "Create Account" button
- "Already have account? Login" link

Functionality:
- Create Supabase auth user
- Create teacher record in teachers table
- Email verification (optional for MVP)
- Password validation (min 8 chars, 1 uppercase, 1 number)
- Redirect to onboarding or dashboard

Post-Signup Flow:
- Create teacher record with user_id
- Show welcome modal with quick tour option
```

#### 1.3 Password Reset (`/reset-password`)

```
Design:
- Centered card
- Email input
- "Send Reset Link" button
- Back to login link
- Success message after submission

Functionality:
- Supabase password reset flow
- Email validation
- Success/error states
- Redirect to check email screen
```

---

### PHASE 2: Home Dashboard (`/dashboard`)

**Route:** `/dashboard`
**Bottom Nav:** Home tab (active)
**Top Bar:** "Hello, [Teacher Name]" + Hamburger + 3-dot + Avatar

**Layout Structure:**

```
┌─────────────────────────────────────┐
│  📅 Today's Schedule                │
│  ┌─────────────────────────────┐   │
│  │ 10:00 AM - Class 10A (Math) │   │
│  │ Live Class in 15 mins  [→]  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 2:00 PM - JEE Batch (Phys)  │   │
│  │ Upcoming           [→]      │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  📊 Quick Stats (4 cards in grid)   │
│  ┌────────┬────────┬────────┬─────┐│
│  │32      │18      │45      │92%  ││
│  │Students│Pending │Tests   │Atten││
│  └────────┴────────┴────────┴─────┘│
├─────────────────────────────────────┤
│  🔔 Recent Activity                 │
│  • Rahul submitted Math HW          │
│  • Test results ready for Class 9A  │
│  • 3 students absent today          │
└─────────────────────────────────────┘
```

**Components:**

1. **Today's Schedule Section**
   ```
   - Card-based list
   - Each session card shows:
     * Time (10:00 AM)
     * Class name + Subject
     * Status badge (Live in 15 mins / Upcoming / Completed)
     * Quick action button (Start Class / View Summary)
   - Color-coded by class
   - Tap to navigate to session detail
   - Show max 3 upcoming sessions, "View All" link
   ```

2. **Quick Stats Grid (2x2 on mobile, 4x1 on tablet)**
   ```
   Card 1: Total Students
   - Number: 32
   - Icon: 👥
   - Tap → Navigate to /classes

   Card 2: Pending Submissions
   - Number: 18
   - Icon: ⏳
   - Color: Warning
   - Tap → Navigate to /assess?filter=pending

   Card 3: Active Tests
   - Number: 45
   - Icon: 📝
   - Tap → Navigate to /assess?tab=tests

   Card 4: Attendance Rate
   - Percentage: 92%
   - Icon: ✓
   - Color: Success
   - Tap → Navigate to /more?section=attendance
   ```

3. **Recent Activity Feed**
   ```
   - List of last 5 activities
   - Each item:
     * Icon (based on activity type)
     * Description text
     * Timestamp (relative: "2 mins ago")
     * Tap to navigate to related item
   - Types:
     * Homework submitted
     * Test completed
     * Attendance marked
     * Resource shared
     * Class completed
   - "View All Activity" link at bottom
   ```

**Floating Action Button (FAB):**
```
- Position: Bottom-right, above bottom nav
- Icon: Plus (+)
- Tap → Show speed dial menu:
  * Start Live Class
  * Create Homework
  * Create Test
  * Mark Attendance
  * Share Resource
```

**Functionality:**
```
Data Sources:
- Fetch today's sessions from sessions table where scheduled_start >= today 00:00 and < tomorrow 00:00
- Count students from students table where teacher_id = current_teacher
- Count pending submissions from homework_submissions where status = 'submitted' and homework.teacher_id = current
- Count active tests from tests table where status IN ('published', 'live')
- Calculate attendance rate from attendance records for last 7 days
- Fetch recent activities (union of various events, sorted by timestamp DESC, limit 5)

Real-time Updates:
- Subscribe to sessions table for live class status changes
- Subscribe to submissions table for new homework submissions
- Show toast notifications for important events

Loading States:
- Skeleton cards while data loads
- Refresh on pull-down gesture
```

---

### PHASE 3: Classes Tab (`/classes`)

**Route:** `/classes`
**Bottom Nav:** Classes tab (active)
**Top Bar:** "My Classes" + Hamburger + Search icon + 3-dot + Avatar

**Layout:**

```
┌─────────────────────────────────────┐
│  [Search classes...]        [+ Add] │
├─────────────────────────────────────┤
│  📘 Class 10A - Mathematics         │
│  32 students • Grade 10             │
│  Next: Today 10:00 AM    [→]        │
├─────────────────────────────────────┤
│  📗 JEE 2025 Batch - Physics        │
│  45 students • Grade 11-12          │
│  Next: Tomorrow 2:00 PM  [→]        │
├─────────────────────────────────────┤
│  📙 Class 9B - Science              │
│  28 students • Grade 9              │
│  No upcoming sessions    [→]        │
└─────────────────────────────────────┘
```

**Components:**

1. **Class Card (in list)**
   ```
   Design:
   - Card with left accent border (color-coded)
   - Class icon/emoji (book with color)
   - Class name + Subject (H3, semibold)
   - Student count + Grade level (small text, gray)
   - Next session info (if any)
   - Chevron right icon
   - Tap anywhere → Navigate to class detail

   States:
   - Active (upcoming session within 24h): Highlighted
   - Normal: Standard card
   - Empty state: "No classes yet. Create your first class!"
   ```

2. **Search & Filter**
   ```
   - Search bar at top (filter by class name or subject)
   - Filter chips (optional):
     * All Classes
     * By Subject
     * By Grade
   ```

3. **Add Class Button**
   ```
   - Top-right corner
   - Opens modal/sheet to create new class
   ```

**Class Detail Screen (`/classes/:classId`)**

```
Layout (Tabs):
┌─────────────────────────────────────┐
│  ← Class 10A - Mathematics          │
│  [Students] [Schedule] [Resources]  │
├─────────────────────────────────────┤
│  [Tab Content Here]                 │
└─────────────────────────────────────┘
```

**Tab 1: Students**
```
- List of enrolled students
- Each student card:
  * Avatar (photo or initials)
  * Name
  * Attendance rate (e.g., 95%)
  * Recent performance (if available)
  * Tap → Student detail (grades, attendance, notes)
- Add Student button
- Search/filter students
```

**Tab 2: Schedule**
```
- Calendar view (week or month)
- List of upcoming sessions
- Each session:
  * Date & Time
  * Duration
  * Status (Scheduled / Completed)
  * Tap → Session detail
- "Schedule New Class" button
```

**Tab 3: Resources**
```
- List of shared resources
- Filter: All / PDFs / Videos / Links
- Each resource card:
  * Thumbnail/icon
  * Title
  * Type badge
  * Shared date
  * Tap → View/download resource
- "Share Resource" button
```

**Functionality:**
```
Data:
- Fetch class from classes table
- Fetch enrolled students via class_enrollments join students
- Fetch sessions for this class_id
- Fetch resources via resource_shares

Actions:
- Add/remove students
- Schedule new session
- Share resource
- Edit class details (3-dot menu)
- Archive/delete class (3-dot menu)
```

---

### PHASE 4: Live Class Flow (T-001, T-002)

#### 4.1 Start Live Class (`/live-class/:sessionId`)

**Entry Points:**
- Dashboard → "Start Class" button on session card
- Classes → Class Detail → "Start Class" button
- FAB → "Start Live Class"

**Pre-Class Screen:**

```
┌─────────────────────────────────────┐
│  ← Starting Live Class               │
│                                      │
│  📹 Camera Preview                   │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │    [Video Preview]          │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                      │
│  Class 10A - Mathematics             │
│  Duration: 60 mins                   │
│                                      │
│  🎥 [Camera On/Off]                  │
│  🎤 [Mic On/Off]                     │
│                                      │
│  [Start Class Now]                   │
└─────────────────────────────────────┘
```

**Flow (T-001 Implementation):**

```
Step 1: Permissions Check
- Request camera and microphone permissions
- If denied → Show error with "Open Settings" button
- If granted → Proceed to preview

Step 2: Preview Screen
- Show camera preview
- Toggle camera on/off
- Toggle mic on/off
- Display class info (name, subject, scheduled time)
- "Start Class Now" button

Step 3: Start Class
- Update session status to 'live'
- Set actual_start timestamp
- Initialize WebRTC connection (or use placeholder for MVP)
- Navigate to Live Class Room

Track Analytics:
- event: start_class_click {class_id, session_id}
- event: permissions_granted
- event: camera_mic_initialized
- event: live_class_open

Error Handling:
- network_disconnected → Auto-retry with exponential backoff
- camera_permission_denied → Show modal with OS settings link
- session_not_found → Redirect to sessions list
```

**Live Class Room Screen:**

```
┌─────────────────────────────────────┐
│  ← [End Class]          ⋮ (More)    │
│                                      │
│  📹 Teacher Video (Full Screen)      │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │    [Live Video Feed]        │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                      │
│  👥 Students (18 joined)             │
│  • Rahul Kumar [🟢]                  │
│  • Priya Sharma [🟢]                 │
│  • ... (collapsed list)              │
│                                      │
│  ⏱️ 15:30 elapsed                    │
│                                      │
│  [🎥] [🎤] [🎨] [📁] [📊]           │
│  Video Mic  Board Share Stats       │
└─────────────────────────────────────┘
```

**Live Class Features:**
```
1. Video Controls Bottom Bar:
   - Camera toggle
   - Mic toggle
   - Whiteboard/Drawing tool (future)
   - Share screen (future)
   - View stats (attendance, engagement)

2. Students Panel (Collapsible):
   - List of students
   - Join status (green dot = joined, gray = not joined)
   - Join time
   - Real-time updates via Supabase realtime

3. Top Bar:
   - Back button (with confirmation)
   - End Class button (primary action)
   - 3-dot menu:
     * Mark Attendance
     * Share Resource
     * Recording controls (if enabled)

4. Timer:
   - Shows elapsed time
   - Alert when approaching scheduled end time
```

#### 4.2 End Live Class (T-002 Implementation)

**Flow:**

```
Step 1: User taps "End Class"
- Show confirmation modal:
  "Are you sure you want to end this class?"
  [Cancel] [End Now]

Step 2: Confirm End
- Stop media streams (camera/mic)
- Update session status to 'completed'
- Set actual_end timestamp
- Save final attendance (auto-mark joined students as present)
- Show "Ending class..." loading state

Step 3: Generate Summary
- Calculate:
  * Total duration
  * Students attended (count of joined students)
  * Attendance percentage
  * Basic engagement metrics
- Create session_summary record

Step 4: Redirect to Summary Screen
- Navigate to /sessions/:sessionId/summary

Track Analytics:
- event: end_class_opened
- event: end_class_confirmed
- event: summary_generated
- event: summary_screen_opened

Error Handling:
- network_disconnected → Save summary offline, sync later
- recording_finalization_failed → Show error, allow retry or skip
- session_data_corrupted → Show minimal summary with error message
```

**Class Summary Screen (`/sessions/:sessionId/summary`):**

```
┌─────────────────────────────────────┐
│  ← Class Summary                     │
│                                      │
│  ✅ Class Completed                  │
│  Class 10A - Mathematics             │
│  Jan 15, 2025 • 10:00 AM - 11:05 AM  │
│                                      │
│  📊 Stats                            │
│  ┌──────────┬──────────┬──────────┐ │
│  │Duration  │Attended  │Attendance│ │
│  │65 mins   │28/32     │87.5%     │ │
│  └──────────┴──────────┴──────────┘ │
│                                      │
│  👥 Attendance                       │
│  [View Full Attendance] →            │
│                                      │
│  📝 Notes & Actions                  │
│  [Add notes about this class...]     │
│                                      │
│  📚 Quick Actions                    │
│  [Assign Homework]                   │
│  [Share Materials]                   │
│  [View Recording] (if enabled)       │
│                                      │
│  [Done]                              │
└─────────────────────────────────────┘
```

**Summary Components:**
```
1. Stats Cards:
   - Duration (calculated from actual_start to actual_end)
   - Students attended (count from attendance or join logs)
   - Attendance percentage

2. Attendance Section:
   - Quick view of who attended
   - "View Full Attendance" → Opens attendance screen
   - Option to edit attendance

3. Notes Field:
   - Textarea for teacher notes
   - Auto-save as draft
   - Saved to session_summaries.notes

4. Quick Actions:
   - Assign Homework → Opens homework builder with class pre-selected
   - Share Materials → Opens resource picker
   - View Recording → If recording was enabled, show link/player

5. Done Button:
   - Saves any pending notes
   - Navigates back to dashboard or classes list
```

---

### PHASE 5: Attendance Management (T-004)

**Entry Points:**
- Live Class Room → "Mark Attendance" (during class)
- Class Summary → "View Full Attendance" (after class)
- More Tab → "Attendance Manager"
- Classes → Class Detail → "Attendance" section

**Attendance Screen (`/attendance/:classId` or `/attendance/:sessionId`):**

```
┌─────────────────────────────────────┐
│  ← Attendance - Class 10A            │
│  Jan 15, 2025 (Today)                │
│                                      │
│  [All] [Present] [Absent] [Late]    │
│                                      │
│  ✅ 28 Present • ❌ 4 Absent         │
├─────────────────────────────────────┤
│  [Photo] Rahul Kumar                │
│         [Present] [Absent] [Late]   │
│         [Excused]                    │
├─────────────────────────────────────┤
│  [Photo] Priya Sharma               │
│         [Present] [Absent] [Late]   │
│         [Excused]                    │
├─────────────────────────────────────┤
│  ... (more students)                │
│                                      │
│  [Save Attendance]                   │
└─────────────────────────────────────┘
```

**Implementation (T-004):**

```
Flow:

Step 1: Load Attendance Screen
- Fetch class roster (students for this class_id)
- Fetch existing attendance records for this session/date
- If coming from live class → Auto-mark joined students as present
- If after class or manual → Show all students as unmarked
- Display loading skeleton while fetching

Step 2: Initial State
- Pre-fill attendance based on:
  * Live class join logs → Mark as present
  * Empty/manual → All unmarked
- Show count summary at top (X Present, Y Absent, etc.)

Step 3: Manual Updates
- Teacher taps status button for each student
- Options: Present / Absent / Late / Excused
- Each student has exactly one status
- UI updates immediately (optimistic update)
- Mark row as "edited" if manually changed

Step 4: Save Attendance
- Validate: At least one student exists
- Send to Supabase attendance table
- Show "Saving..." state
- On success → Show toast "Attendance saved"
- Update last_saved timestamp

Step 5: Finalize (Optional)
- Some policies require locking attendance after a time
- If locked → Disable edits, show "Locked" badge
- If not locked → Allow teacher to edit later

Decision Points:
- Live vs Manual:
  * During live class → Show real-time join status
  * After class/manual → Static list with prefilled data
- Lock Policy:
  * If enabled → Lock after X hours
  * If disabled → Allow edits anytime

Track Analytics:
- event: attendance_screen_open {class_id, session_id}
- event: attendance_prefill_done
- event: attendance_status_changed {student_id, new_status}
- event: attendance_save_attempt
- event: attendance_save_success

Error Handling:
- roster_not_found → "Couldn't load students" + Refresh button
- network_disconnected → "Offline. Attendance saved locally, will sync when online"
- attendance_locked → "Attendance locked and cannot be edited"

Offline Support:
- Allow marking attendance offline
- Store in local queue
- Auto-sync when connection returns
- Show "Not synced" indicator
```

**UI Components:**

```
1. Filter Chips (Top):
   - All (default)
   - Present (green)
   - Absent (red)
   - Late (amber)
   - Excused (blue)
   - Tap to filter list

2. Summary Card:
   - Total students
   - Present count (green)
   - Absent count (red)
   - Percentage

3. Student Row:
   - Avatar (photo or initials)
   - Student name
   - Status buttons (segmented control or pills)
     * Present (green, checkmark icon)
     * Absent (red, X icon)
     * Late (amber, clock icon)
     * Excused (blue, note icon)
   - Currently selected status is highlighted
   - Tap to change status

4. Save Button:
   - Fixed at bottom (sticky)
   - Primary color
   - Full width
   - Shows "Saving..." when in progress
   - Disabled when no changes or already saving
```

---

### PHASE 6: Resource Sharing (T-003)

**Entry Points:**
- Class Summary → "Share Materials"
- Class Detail → Resources tab → "Share with Class"
- More Tab → "Resources Library" → Select → "Share"

**Share Resources Screen (`/share-resources/:classId`):**

```
┌─────────────────────────────────────┐
│  ← Share Materials                   │
│  Class 10A - Mathematics             │
│                                      │
│  [Search resources...]               │
│  [Recent] [Library] [Upload New]    │
├─────────────────────────────────────┤
│  □ Quadratic Equations Notes.pdf    │
│    2.3 MB • PDF • Yesterday          │
├─────────────────────────────────────┤
│  ☑ Algebra Practice Sheet.pdf       │
│    1.8 MB • PDF • Jan 10             │
├─────────────────────────────────────┤
│  □ Math Formulas Video               │
│    15 mins • Video • Jan 8           │
├─────────────────────────────────────┤
│                                      │
│  2 selected                          │
│  [Share with Class]                  │
└─────────────────────────────────────┘
```

**Implementation (T-003):**

```
Flow:

Step 1: Open Resource Picker
- Fetch resources from resources table (teacher's library)
- Filter by:
  * Recent (last 7 days)
  * Library (all resources)
  * By type (PDF, Video, Link)
- Show search bar at top
- Display as list with checkboxes

Step 2: Select Resources
- Teacher taps checkboxes to select one or more resources
- Selected resources highlighted
- Show count at bottom "X selected"
- "Share" button enabled when at least 1 selected

Step 3: Choose Audience (Optional)
- Default: Whole class
- Options:
  * Whole class (all enrolled students)
  * Specific groups (if groups exist)
  * Individual students (multi-select)
- Show summary: "Sharing with Class 10A (32 students)"

Step 4: Confirm Share
- Teacher taps "Share with Class"
- Validate: At least one resource selected
- Create resource_share records linking resource_ids to class_id
- Optionally link to session_id if shared from class summary
- Show "Sharing..." loading state

Step 5: Success
- Show toast: "Resources shared with Class 10A"
- Resources appear in class Resources tab
- (Future) Send in-app notification to students
- Navigate back to previous screen

Decision Points:
- Whole Class vs Subgroup:
  * If whole class → Link to class_id only
  * If subgroup → Store specific student_ids
- Session Link:
  * If from class summary → Link to session_id
  * If from general flow → session_id = null

Track Analytics:
- event: share_resources_open {class_id}
- event: resource_selected {resource_ids}
- event: share_audience_opened
- event: resources_shared_success {class_id, resource_count}

Error Handling:
- no_resources_found → "No resources available. Upload first." + Upload CTA
- network_disconnected → "Offline. Sharing queued, will sync when online"
- permission_denied → "You don't have permission to share to this class"

Offline Support:
- Queue share action locally
- Sync when connection returns
```

**Resource Library Screen (`/resources`):**

```
┌─────────────────────────────────────┐
│  ← My Resources                      │
│                                      │
│  [Search...]         [+ Upload]      │
│  [All] [PDFs] [Videos] [Links]      │
├─────────────────────────────────────┤
│  📄 Quadratic Equations Notes        │
│     2.3 MB • Shared with 3 classes   │
│     [View] [Share] [Delete]          │
├─────────────────────────────────────┤
│  🎥 Algebra Basics Video             │
│     15 mins • Shared with 1 class    │
│     [View] [Share] [Delete]          │
└─────────────────────────────────────┘
```

**Upload New Resource Modal:**
```
Fields:
- Title (required)
- Description (optional)
- File upload / URL input
- Resource type (auto-detected or manual)
- Subject tag
- Custom tags

Actions:
- Upload to Supabase Storage (for files)
- Create resource record
- Show upload progress
- Success → Resource appears in library
```

---

### PHASE 7: Homework Management (T-005, T-006, T-007)

#### 7.1 Create Homework (T-005)

**Entry Points:**
- Assess Tab → "Create Homework" button
- Class Detail → "Assign Homework" button
- Class Summary → "Assign Practice" CTA
- FAB → "Create Homework"

**Homework Builder (`/homework/create`):**

**Stepper/Wizard UI:**

```
Step 1/4: Basic Details
┌─────────────────────────────────────┐
│  ← Create Homework                   │
│  [1]━━━[2]    [3]    [4]            │
│  Details Questions Review Assign     │
│                                      │
│  Title *                             │
│  [Algebra Practice Set 3]            │
│                                      │
│  Instructions                        │
│  [Complete all questions from...]    │
│                                      │
│  Due Date & Time *                   │
│  [Jan 20, 2025] [5:00 PM]           │
│                                      │
│  Total Points                        │
│  [100]                               │
│                                      │
│  [Next: Add Questions] →             │
└─────────────────────────────────────┘

Step 2/4: Select Questions
┌─────────────────────────────────────┐
│  ← Create Homework                   │
│  [1]━━━[2]━━━[3]    [4]            │
│                                      │
│  [Question Bank] [Create New]        │
│                                      │
│  Search questions...                 │
│  [Subject] [Topic] [Difficulty]      │
├─────────────────────────────────────┤
│  ☑ Q1. Solve: 2x + 5 = 15           │
│     Topic: Linear Equations • Easy   │
│     Marks: 5                         │
├─────────────────────────────────────┤
│  □ Q2. Find roots of x² - 5x + 6    │
│     Topic: Quadratics • Medium       │
│     Marks: 10                        │
├─────────────────────────────────────┤
│                                      │
│  5 questions selected • 50 marks     │
│  [← Back] [Next: Review] →           │
└─────────────────────────────────────┘

Step 3/4: Review & Settings
┌─────────────────────────────────────┐
│  ← Create Homework                   │
│  [1]━━━[2]━━━[3]━━━[4]            │
│                                      │
│  📝 Algebra Practice Set 3           │
│  Due: Jan 20, 5:00 PM • 100 points   │
│                                      │
│  Questions: 5                        │
│  [View Questions] →                  │
│                                      │
│  📎 Attachments (Optional)           │
│  [+ Add PDF/Video/Link]              │
│                                      │
│  [← Back] [Next: Assign] →           │
└─────────────────────────────────────┘

Step 4/4: Assign to Class
┌─────────────────────────────────────┐
│  ← Create Homework                   │
│  [1]━━━[2]━━━[3]━━━[4]            │
│                                      │
│  Assign to                           │
│  ◉ Whole Class (Class 10A - 32)      │
│  ○ Selected Students                 │
│  ○ Groups                            │
│                                      │
│  Publish Options                     │
│  ◉ Assign Now                        │
│  ○ Schedule for Later                │
│                                      │
│  [← Back] [Assign Homework] ✓        │
└─────────────────────────────────────┘
```

**Implementation (T-005):**

```
Flow:

Step 1: Basic Details
- Enter title (required, ≤ 150 chars)
- Enter instructions (≤ 2000 chars)
- Select due date and time (must be in future)
- Set total points (default 100)
- Validation:
  * Title required
  * Due date must be future
  * Show inline errors
- Next button enabled when valid

Step 2: Select Questions
- Show Question Bank (from questions table)
- Filter by:
  * Subject (auto-populated from class)
  * Topic
  * Difficulty (Easy/Medium/Hard)
- Search by question text
- Each question shows:
  * Question preview
  * Topic and difficulty
  * Marks
  * Checkbox to select
- Option to create new question inline
- Show running total: "5 selected • 50 marks"
- Validation: At least 1 question required

Step 3: Review & Optional Settings
- Show summary of homework
- List questions (collapsible)
- Attach resources (PDFs, videos, links)
  * Upload to Supabase Storage
  * Link to homework via resource_shares
- Edit any step by going back

Step 4: Assign to Class
- Select class (if not pre-selected)
- Choose audience:
  * Whole class (default)
  * Selected students (multi-select)
  * Groups (if supported)
- Show summary: "Assigning to Class 10A (32 students)"
- Publish options:
  * Assign Now (immediately visible)
  * Schedule (set visibility start time)
- Create homework record
- Link questions via homework_questions
- Create assignment for each student
- Notify students (future)

Database Operations:
1. Create homework record (title, instructions, due_date, etc.)
2. Insert homework_questions (homework_id, question_id, marks, order)
3. Calculate total_points (sum of question marks)
4. Set status to 'published' if assign now, 'draft' if schedule
5. Create notifications (future)

Decision Points:
- Assign Now vs Schedule:
  * Now → status = 'published', visible immediately
  * Schedule → status = 'draft', becomes published at start time
- Use Existing vs Create New Questions:
  * Existing → Faster setup
  * New → Inline question creator modal
- Whole Class vs Selected:
  * Whole class → Simpler, all enrolled students
  * Selected → More control, specific students only

Track Analytics:
- event: homework_builder_open
- event: homework_meta_updated
- event: homework_questions_selected {question_count}
- event: homework_resources_attached {resource_count}
- event: homework_assigned_success {class_id, due_date}

Error Handling:
- missing_required_fields → Highlight fields, prevent next
- no_questions_selected → "Add at least one question"
- network_disconnected → "Offline. Saved as draft, will sync when online"
- server_error_on_assign → Keep data, show retry

Offline Support:
- Save as draft offline
- Sync to server before making published
- Show "Draft (Not Synced)" indicator
```

#### 7.2 View Homework Submissions (T-006)

**Route:** `/homework/:homeworkId/submissions`

**Entry Points:**
- Assess Tab → Homework list → Tap homework → "Submissions"
- Notifications → "New submissions received" → Opens submissions screen

**Submissions Screen:**

```
┌─────────────────────────────────────┐
│  ← Submissions                       │
│  Algebra Practice Set 3              │
│  Due: Jan 20, 5:00 PM                │
│                                      │
│  ✅ 18/32 Submitted • ⏳ 14 Pending  │
│                                      │
│  [All] [Submitted] [Pending] [Late] │
│  [Graded] [Ungraded]                 │
├─────────────────────────────────────┤
│  [Photo] Rahul Kumar                │
│         Submitted Jan 19, 4:30 PM ✓  │
│         Graded: 85/100               │
│         [View] →                     │
├─────────────────────────────────────┤
│  [Photo] Priya Sharma               │
│         Submitted Jan 20, 6:15 PM    │
│         Late • Not Graded            │
│         [View & Grade] →             │
├─────────────────────────────────────┤
│  [Photo] Amit Singh                  │
│         Not Submitted ⏳             │
│         [Remind] →                   │
└─────────────────────────────────────┘
```

**Implementation (T-006):**

```
Flow:

Step 1: Open Submissions Screen
- Fetch homework from homework table
- Fetch class roster (all students for this class)
- Fetch submissions from homework_submissions
- Match students to submissions (left join)
- Show loading skeleton

Step 2: Load Submissions Data
- For each student:
  * Name, photo
  * Submission status (submitted / not_submitted)
  * Submit timestamp (if submitted)
  * Is late? (submitted_at > due_date)
  * Grade status (graded / not_graded)
  * Marks (if graded)
- Calculate summary:
  * Total students
  * Submitted count
  * Not submitted count
  * Late count
  * Graded count
  * Ungraded count

Step 3: Display List with Filters
- Show summary cards at top
- Filter chips:
  * All (default)
  * Submitted (status = submitted)
  * Pending (status = not_submitted)
  * Late (is_late = true)
  * Graded (grade_status = graded)
  * Ungraded (status = submitted AND grade_status != graded)
- List updates based on selected filter

Step 4: Tap Student Row
- If submitted → Navigate to submission detail for grading
- If not submitted → Show "Not submitted yet" with remind option

Summary Data:
- Fetch count(submissions) WHERE homework_id = X AND status = 'submitted'
- Fetch count(students) WHERE class_id = Y
- Calculate: submitted_count / total_students = submission_rate

Decision Points:
- Has Student Submitted?
  * Yes → Show submit time, late badge if applicable
  * No → Show "Not submitted" with remind CTA
- Is Late?
  * submission_timestamp > due_date → Show late badge (amber)
- Is Graded?
  * Yes → Show marks badge
  * No → Show "Not graded" indicator

Track Analytics:
- event: homework_submissions_open {homework_id}
- event: homework_submissions_fetch_success {submitted_count, not_submitted_count}
- event: homework_submissions_filter_applied {filter}
- event: homework_submission_detail_open {student_id}

Error Handling:
- submissions_fetch_failed → "Couldn't load submissions" + Retry
- homework_not_found → Return to homework list
- network_disconnected → "Offline. Showing last known data"

Offline Support:
- Show last cached submissions
- Display "Offline" indicator
- Disable real-time refresh
```

**UI Components:**

```
1. Summary Section (Top):
   - Card with two stats:
     * ✅ Submitted: 18/32 (56%)
     * ⏳ Pending: 14 (44%)
   - Progress bar (optional)

2. Filter Chips:
   - Horizontal scrollable chips
   - Active chip highlighted
   - Count badge on each chip

3. Student Submission Row:
   - Avatar (40px circle)
   - Student name (H4, semibold)
   - Status info:
     * If submitted: "Submitted [date, time]" + Late badge if applicable
     * If not submitted: "Not Submitted" (gray text)
     * If graded: "Graded: X/Y" (green badge)
     * If ungraded: "Not Graded" (amber text)
   - Chevron right
   - Tap → Navigate to detail

4. Empty States:
   - No submissions: "No students have submitted yet"
   - Filter returns empty: "No students in this view"
```

#### 7.3 Grade Homework (T-007)

**Route:** `/homework/:homeworkId/submissions/:studentId/grade`

**Entry Points:**
- Submissions screen → Tap student row → Opens grading screen

**Grading Screen:**

```
┌─────────────────────────────────────┐
│  ← Grade Submission                  │
│  Rahul Kumar                         │
│  Submitted: Jan 19, 4:30 PM ✓        │
│                                      │
│  Q1. Solve: 2x + 5 = 15              │
│  Student Answer: x = 5               │
│  📎 [View Attachment]                │
│                                      │
│  Marks: [___] / 5                    │
│  Feedback: [Correct! Well done]      │
│  [✓ Correct] [✗ Wrong] [~ Partial]  │
├─────────────────────────────────────┤
│  Q2. Find roots of x² - 5x + 6       │
│  Student Answer: x = 2, x = 3        │
│                                      │
│  Marks: [___] / 10                   │
│  Feedback: [...]                     │
│  [✓ Correct] [✗ Wrong] [~ Partial]  │
├─────────────────────────────────────┤
│  Total: [__] / 100                   │
│                                      │
│  Overall Feedback                    │
│  [Great work! Focus on...]           │
│                                      │
│  [Save Draft] [Save & Mark Graded] ✓ │
└─────────────────────────────────────┘
```

**Implementation (T-007):**

```
Flow:

Step 1: Open Submission Detail
- Fetch homework from homework table
- Fetch student submission from homework_submissions
- Fetch questions via homework_questions join questions
- Fetch student answers from submission.answers (JSONB)
- If not submitted → Show "No submission" screen
- Show loading skeleton while fetching

Step 2: Display Questions & Answers
- Render each question in order
- Show:
  * Question text
  * Student's answer
  * Attachments (if any) - images, PDFs (Supabase Storage URLs)
  * Marks input field (per question)
  * Feedback textarea (per question, optional)
  * Quick action buttons (Correct / Wrong / Partial)
- Auto-fill marks if MCQ and correct answer available
- Show total marks running sum at bottom

Step 3: Grade Questions
- Teacher enters marks for each question
- Validation: marks ≤ max_marks for that question
- If invalid → Highlight field, show inline error
- Quick buttons:
  * Correct → Fill max_marks
  * Wrong → Fill 0
  * Partial → Leave for manual entry
- Update total marks automatically
- Per-question feedback (optional)

Step 4: Add Overall Feedback
- Textarea at bottom
- Character limit: 2000 chars
- Optional but recommended

Step 5: Save Grading
- Options:
  * Save Draft → Keep grade_status as 'in_review', don't show to student
  * Save & Mark Graded → Set grade_status = 'graded', show to student
- Validate:
  * All question marks entered
  * Total marks ≤ max_total_marks
  * Feedback within limit
- Create/update homework_grades record:
  * submission_id
  * question_scores (JSONB array)
  * total_marks
  * overall_feedback
  * graded_at timestamp
  * graded_by (teacher_id)
- Update homework_submissions.status to 'graded'
- Show "Saving..." then success toast

Database Operations:
1. Fetch submission with answers JSONB
2. Create homework_grades record
3. Store question_scores as JSONB:
   [
     {question_id: "...", marks_awarded: 5, max_marks: 5, feedback: "Good!"},
     {question_id: "...", marks_awarded: 7, max_marks: 10, feedback: "..."}
   ]
4. Calculate total_marks (sum of marks_awarded)
5. Update submission.status = 'graded'

Decision Points:
- Has Student Submitted?
  * Yes → Show submission detail
  * No → Show "Not submitted" state, no grading UI
- Auto-Grading for MCQs?
  * If question_type = 'mcq' AND correct_answer exists
  * Pre-fill marks (correct = max, incorrect = 0)
  * Teacher can override
- Save Draft vs Final?
  * Draft → grade_status = 'in_review', not visible to student
  * Final → grade_status = 'graded', visible to student

Track Analytics:
- event: hw_grade_detail_open
- event: hw_view_answer {question_id}
- event: hw_question_graded {question_id, marks}
- event: hw_overall_feedback_added
- event: hw_grade_save_success

Error Handling:
- submission_not_found → "Student has not submitted" + Back button
- invalid_marks → "Marks exceed maximum" + Highlight field
- network_disconnected → "Offline. Saved as draft locally, will sync"
- grade_save_failed → Keep data, show retry option

Offline Support:
- Allow grading offline
- Save as draft in local storage
- Sync when connection returns
- Show "Not synced" indicator
```

**UI Components:**

```
1. Question Block:
   - Card for each question
   - Question number and text (H4)
   - Student answer (read-only textarea or text)
   - Attachment viewer (image preview or PDF link)
   - Marks input:
     * Number input (0 to max_marks)
     * Label: "Marks: ___ / 10"
   - Feedback textarea (collapsible, optional)
   - Quick action buttons (chips)

2. Quick Action Buttons:
   - Correct (green, checkmark) → Auto-fill max marks
   - Wrong (red, X) → Auto-fill 0
   - Partial (amber, tilde) → Leave for manual entry

3. Total Marks Display:
   - Fixed card at bottom or summary card at top
   - Shows: "Total: 85 / 100"
   - Updates in real-time as teacher grades

4. Overall Feedback:
   - Large textarea
   - Placeholder: "Add overall comments for the student..."
   - Character counter

5. Save Buttons:
   - Save Draft (outlined, secondary)
   - Save & Mark Graded (filled, primary)
   - Loading spinner during save

6. Empty State (No Submission):
   - Icon + message: "Student has not submitted this homework yet."
   - Back button
```

---

### PHASE 8: Test Management (T-008)

#### 8.1 Create Test

**Entry Points:**
- Assess Tab → Tests section → "Create Test"
- Class Detail → "Create Test" button
- FAB → "Create Test"

**Test Builder (`/tests/create`):**

**Similar to Homework Builder but with additional settings:**

```
Step 1: Basic Details
- Title (required)
- Subject
- Description
- Duration (minutes)
- Start time
- End time
- Total marks

Step 2: Select Questions
- Same as homework
- Question Bank + Create New
- Select questions with marks

Step 3: Test Settings
- Shuffle Questions: Toggle
- Shuffle Options (for MCQs): Toggle
- Negative Marking:
  * Enable toggle
  * Negative mark value (e.g., -0.25 per wrong answer)
- Attempt Limit:
  * Single attempt (default)
  * Multiple attempts (specify max, e.g., 3)
  * Best score or last attempt
- Show Results to Students:
  * Immediately after submission
  * After end time
  * Manual release

Step 4: Assign to Class
- Select class
- Audience (whole / selected)
- Publish now or schedule

Database:
- tests table
- test_questions table
- test_submissions table (for student attempts)
```

**Tests List (`/tests` or Assess Tab → Tests):**

```
┌─────────────────────────────────────┐
│  Tests                               │
│  [Active] [Scheduled] [Completed]    │
├─────────────────────────────────────┤
│  📝 Midterm - Mathematics            │
│  Class 10A • 60 mins • 100 marks     │
│  Live Now • 18/32 submitted          │
│  [View Results] →                    │
├─────────────────────────────────────┤
│  📝 Weekly Quiz - Physics            │
│  JEE Batch • 30 mins • 50 marks      │
│  Starts: Tomorrow 2:00 PM            │
│  [Edit] [Notify Students]            │
└─────────────────────────────────────┘
```

**Test Results Screen (`/tests/:testId/results`):**

```
Similar to Homework Submissions:
- List of students
- Status: Not started / In progress / Submitted
- Score (if submitted)
- Rank (optional)
- Time taken
- Tap → View student's test attempt
- Analytics:
  * Average score
  * Highest/lowest score
  * Question-wise performance
  * Time statistics
```

---

### PHASE 9: Analytics Tab (`/analytics`)

**Route:** `/analytics`
**Bottom Nav:** Analytics tab (active)
**Top Bar:** "Analytics" + Hamburger + Filter icon + 3-dot + Avatar

**Layout:**

```
┌─────────────────────────────────────┐
│  Analytics                           │
│  [This Week] [This Month] [Custom]   │
├─────────────────────────────────────┤
│  📊 Class Performance                │
│  Class 10A                           │
│  ┌─────────────────────────────┐   │
│  │ [Bar Chart: Avg Scores]     │   │
│  │ Math: 78 | Science: 82      │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  📈 Attendance Trends                │
│  ┌─────────────────────────────┐   │
│  │ [Line Chart: Last 30 days]  │   │
│  │ Avg: 87% (Trending up)      │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  ✅ Homework Completion              │
│  ┌─────────────────────────────┐   │
│  │ [Pie Chart]                 │   │
│  │ 72% on time, 18% late       │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Features:**

1. **Class Performance:**
   - Average scores per subject
   - Grade distribution
   - Top performers
   - Students needing help

2. **Attendance Trends:**
   - Attendance rate over time
   - Present/Absent/Late breakdown
   - Class-wise comparison

3. **Homework & Test Analytics:**
   - Completion rates
   - Average scores
   - On-time vs late submissions
   - Question-wise difficulty analysis

4. **Filters:**
   - Time period (week/month/custom)
   - Class/subject
   - Student (individual view)

**Charts Library:**
- Use Recharts (React charting library)
- Line charts, bar charts, pie charts
- Responsive and interactive
- Export to PDF/CSV (future)

---

### PHASE 10: More Tab (`/more`)

**Route:** `/more`
**Bottom Nav:** More tab (active)
**Top Bar:** "More" + Hamburger + 3-dot + Avatar

**Layout:**

```
┌─────────────────────────────────────┐
│  More                                │
├─────────────────────────────────────┤
│  👤 Profile                          │
│     Update your information      →  │
├─────────────────────────────────────┤
│  📚 Resources Library                │
│     Manage your teaching materials → │
├─────────────────────────────────────┤
│  📅 Attendance Manager               │
│     View and manage attendance    → │
├─────────────────────────────────────┤
│  ⚙️ Settings                         │
│     App preferences              →  │
├─────────────────────────────────────┤
│  ❓ Help & Support                   │
│     FAQs and contact support     →  │
├─────────────────────────────────────┤
│  🔒 Privacy Policy                   │
│     Read our privacy policy      →  │
├─────────────────────────────────────┤
│  📜 Terms of Service                 │
│     Read terms and conditions    →  │
├─────────────────────────────────────┤
│  🚪 Logout                           │
│     Sign out of your account     →  │
└─────────────────────────────────────┘
```

**Menu Items:**

1. **Profile** → `/profile`
   - View/edit teacher info
   - Photo upload
   - Subjects taught
   - Contact info

2. **Resources Library** → `/resources`
   - All uploaded resources
   - Upload new resources
   - Share with classes
   - Organize by subject/tags

3. **Attendance Manager** → `/attendance-manager`
   - View attendance by date
   - Generate attendance reports
   - Export to CSV
   - Attendance analytics

4. **Settings** → `/settings`
   - Notifications preferences
   - Theme (light/dark - future)
   - Language (if multi-language)
   - Data sync preferences

5. **Help & Support** → `/help`
   - FAQs
   - Contact support form
   - Video tutorials
   - App version info

6. **Privacy Policy** → External link or in-app page

7. **Terms of Service** → External link or in-app page

8. **Logout**
   - Confirm modal
   - Clear local data
   - Sign out from Supabase
   - Redirect to login

---

## 🎨 GLOBAL UI COMPONENTS

### Reusable Components to Create:

1. **BaseScreen Wrapper**
   ```typescript
   interface BaseScreenProps {
     children: React.ReactNode;
     loading?: boolean;
     error?: Error | null;
     empty?: boolean;
     emptyMessage?: string;
     scrollable?: boolean;
     refreshable?: boolean;
     onRefresh?: () => void;
   }
   ```
   - Handles loading states (skeleton)
   - Error states (error message + retry)
   - Empty states (icon + message)
   - Pull-to-refresh

2. **Card Component**
   ```
   - White background
   - Rounded corners (12px)
   - Shadow (shadow-sm)
   - Padding (20px)
   - Tappable with ripple effect
   ```

3. **Button Component**
   - Primary (filled, blue)
   - Secondary (outlined, blue)
   - Danger (filled, red)
   - Ghost (text only)
   - Loading state with spinner
   - Disabled state

4. **Input Component**
   - Text input
   - Textarea
   - Number input
   - Date/time picker
   - Floating labels
   - Validation states (error, success)
   - Helper text

5. **Avatar Component**
   - Round image
   - Fallback to initials
   - Size variants (sm, md, lg)

6. **Badge Component**
   - Status badges (success, warning, error)
   - Count badges (notification dots)
   - Custom colors

7. **Modal/Sheet Component**
   - Bottom sheet (mobile)
   - Centered modal (tablet/desktop)
   - Overlay backdrop
   - Swipe to dismiss (bottom sheet)

8. **Toast Notification**
   - Success (green)
   - Error (red)
   - Warning (amber)
   - Info (blue)
   - Auto-dismiss (3 seconds)
   - Position: top or bottom

9. **Loading Skeleton**
   - Card skeleton
   - List skeleton
   - Text skeleton
   - Shimmer animation

10. **Empty State**
    - Icon
    - Message text
    - Action button (optional)

---

## 🚀 IMPLEMENTATION PLAN

### MVP Priorities (Build in This Order):

**Week 1: Foundation**
1. Authentication (Login, Signup, Password Reset)
2. Database schema setup in Supabase
3. Basic UI components library
4. Home Dashboard (skeleton with static data)
5. Bottom navigation + Top bar

**Week 2: Classes & Students**
6. Classes list screen
7. Class detail screen (students tab)
8. Add/edit class
9. Add/edit students
10. Student detail view

**Week 3: Live Classes & Attendance**
11. Start live class flow (permissions, preview)
12. Live class room (basic UI, no actual WebRTC for MVP)
13. End class flow
14. Class summary screen
15. Attendance marking (during and after class)

**Week 4: Homework System**
16. Create homework (builder with questions)
17. View homework list
18. View submissions screen
19. Grade homework (marks + feedback)
20. Question bank (basic CRUD)

**Week 5: Tests & Analytics**
21. Create test (similar to homework but with settings)
22. View test results
23. Basic analytics dashboard
24. Charts for performance, attendance, homework

**Week 6: Resources & Polish**
25. Resources library
26. Share resources flow
27. More tab (profile, settings, etc.)
28. UI polish and bug fixes
29. Loading states, error handling
30. Responsive design testing

---

## 🎯 KEY TECHNICAL REQUIREMENTS

### Authentication
- Supabase Auth with email/password
- Google OAuth (optional for MVP)
- Password reset flow
- Session persistence
- Protected routes

### Data Management
- Supabase PostgreSQL for all data
- Row Level Security (RLS) policies on all tables
- Real-time subscriptions for:
  * Live class join events
  * New homework submissions
  * Test completions
- Optimistic UI updates
- Offline-first with sync queue (future)

### File Storage
- Supabase Storage for:
  * Teacher profile photos
  * Student photos
  * Resource files (PDFs, videos)
  * Homework submission attachments
- Signed URLs for secure access
- File size limits: 10MB per file (configurable)

### Performance
- Lazy loading for lists (infinite scroll or pagination)
- Image optimization and lazy loading
- Memoization for expensive components (React.memo)
- Debounced search inputs
- Query optimization (select only needed columns)

### Error Handling
- Network errors → Show toast, retry mechanism
- Validation errors → Inline error messages
- Server errors → User-friendly messages
- Fallback UI for missing data
- Error boundaries for React errors

### Accessibility
- All interactive elements: min 44x44px touch target
- Color contrast: 4.5:1 minimum (WCAG AA)
- Screen reader labels on all icons and buttons
- Keyboard navigation support
- Status not indicated by color alone (use icons/text)

### Mobile Responsiveness
- Mobile-first design (320px to 768px)
- Tablet optimized (768px to 1024px)
- Breakpoints:
  * sm: 640px
  * md: 768px
  * lg: 1024px
  * xl: 1280px

### Analytics & Tracking
- Track all major user actions
- Events:
  * Screen views
  * Button clicks
  * Form submissions
  * Errors
- Use Supabase Edge Functions or third-party (Mixpanel, etc.)

---

## 📐 DESIGN SPECIFICATIONS

### Icon Library
- Use Lucide React icons (https://lucide.dev)
- Icon sizes: 20px (small), 24px (standard), 32px (large)
- Icon colors: Match text color or use primary/secondary

### Images
- Use lazy loading (native or library)
- Placeholder images while loading
- Compress images (max 1MB)
- Support: JPG, PNG, WebP

### Animations
- Subtle transitions (200-300ms)
- Micro-interactions on buttons (scale, opacity)
- Skeleton loading animations (shimmer)
- Page transitions (slide, fade)
- Keep animations minimal and professional

### Loading States
- Show skeletons instead of spinners where possible
- Button loading: Disable + show spinner
- Full-screen loading: For initial app load only
- Inline loading: For sections/components

### Empty States
- Every list/data view needs empty state
- Icon + Message + Action (if applicable)
- Examples:
  * "No classes yet. Create your first class!"
  * "No homework submissions yet."
  * "No students in this class. Add students to get started."

---

## ✅ ACCEPTANCE CRITERIA

Before marking any screen complete, ensure:

- [ ] Real Supabase data (no mock/hardcoded data)
- [ ] All CRUD operations working
- [ ] RLS policies tested (can't access other teachers' data)
- [ ] Loading states on all async operations
- [ ] Error handling with user-friendly messages
- [ ] Empty states for all lists/data views
- [ ] Form validation with inline errors
- [ ] Success/error toast notifications
- [ ] Mobile responsive (tested at 375px width)
- [ ] All buttons have proper labels/icons
- [ ] TypeScript: 0 errors
- [ ] Console: 0 errors in production
- [ ] Navigation works correctly
- [ ] Back button behavior correct
- [ ] Can recover from all errors
- [ ] Data persists after page refresh

---

## 🔐 SECURITY REQUIREMENTS

1. **Authentication:**
   - Passwords hashed by Supabase (bcrypt)
   - JWT tokens for API authentication
   - Token refresh on expiry
   - Logout clears all local data

2. **Authorization:**
   - RLS policies enforce data access
   - Teachers only see their own data
   - No client-side auth bypass

3. **Data Validation:**
   - All inputs validated (client + server)
   - SQL injection prevention (parameterized queries)
   - XSS prevention (sanitize user inputs)

4. **File Uploads:**
   - Validate file types
   - Limit file sizes (10MB default)
   - Scan for malware (future)
   - Signed URLs for private access

---

## 🎨 FINAL NOTES

**Design Philosophy:**
> "Make it feel like a digital extension of a teacher's notebook—clean, organized, and focused on what matters: teaching and students."

**Key Principles:**
1. **Minimize Cognitive Load:** One primary action per screen
2. **Reduce Clicks:** Common tasks in ≤ 3 taps
3. **Visual Hierarchy:** Most important info at top/center
4. **Consistent Patterns:** Same UI patterns across screens
5. **Immediate Feedback:** Every action gets instant feedback
6. **Forgiving UX:** Easy to undo, edit, or recover
7. **Professional Feel:** No gimmicks, serious education tool

**What Makes This "Premium Minimal":**
- Generous whitespace (breathing room)
- Subtle shadows (depth without distraction)
- Limited color palette (focused attention)
- Consistent spacing (visual rhythm)
- Quality typography (readability)
- Smooth animations (polish without slowdown)
- Smart defaults (reduce decision fatigue)
- Empty states that guide (never leave users confused)

---

## 🚦 START IMPLEMENTATION

**First Prompt to Lovable:**

Please review this entire document and confirm your understanding of:
1. Design system (colors, typography, spacing)
2. App structure (5-tab bottom nav + top bar)
3. Database schema (all tables and RLS policies)
4. Core features (live class, homework, tests, attendance, analytics)
5. UI components needed
6. Implementation priorities

After confirmation, we will build this app step-by-step, starting with authentication and the home dashboard.

**Ready to begin!** 🚀

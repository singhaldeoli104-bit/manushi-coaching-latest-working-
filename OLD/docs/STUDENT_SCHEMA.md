# Complete Student Screens Database Schema

**Migration File:** `20250205_student_screens_complete.sql`
**Created:** February 5, 2025
**Purpose:** Complete database schema for all 27 student screens
**Test Student ID:** `96055c84-a9ee-496d-8360-6b7cea64b928`
**Test Batch ID:** `57ab5ec8-fac5-49f9-b64c-38e4b526ef84`

---

## Table of Contents

1. [Overview](#overview)
2. [Schema Architecture](#schema-architecture)
3. [Tables by Feature](#tables-by-feature)
4. [Table Relationships](#table-relationships)
5. [Sample Queries](#sample-queries)
6. [RLS Policies](#rls-policies)

---

## Overview

This schema supports **27 student screens** across 5 navigation tabs:

### Home Tab (5 screens)
- NewStudentDashboard
- NewActivityDetail
- NewSimpleDoubt
- NewDoubtSubmission
- NewAILearningDashboard

### Classes Tab (10 screens)
- NewScheduleScreen
- NewEnhancedSchedule
- NewClassDetailScreen
- NewLiveClassScreen
- NewEnhancedLiveClass
- NewVirtualClassroom
- NewInteractiveClassroom
- Whiteboard
- ClassChat
- ClassNotes

### Study Tab (8 screens)
- NewStudyLibraryScreen
- NewAssignmentDetailScreen
- NewCollaborativeAssignment
- NewAIStudyScreen
- NewEnhancedAIStudy
- NewAITutorChat
- AIPracticeProblems
- AIStudySummaries

### Progress Tab (2 screens)
- NewProgressDetailScreen
- NewGamifiedLearningHub

### Connect Tab (2 screens)
- NewPeerLearningNetwork
- PeerDetail

---

## Schema Architecture

### Total Objects Created
- **46 Tables** (created/updated)
- **9 Enum Types**
- **85+ Indexes** for query performance
- **30+ RLS Policies** for security
- **8 Triggers** for auto-updates

### Key Design Principles
1. **Real-time Support**: Tables designed for Supabase Realtime subscriptions
2. **Performance**: Strategic indexes on frequently queried columns
3. **Security**: Row Level Security (RLS) on all student-facing tables
4. **Scalability**: Proper foreign keys and relationships
5. **Audit Trail**: Created/updated timestamps on all tables

---

## Tables by Feature

### 🏠 HOME TAB TABLES

#### 1. `student_activities` - Activity Feed
**Purpose:** Central activity/notification feed for students

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `student_id` (UUID, FK → students) - Student reference
- `title` (VARCHAR) - Activity title
- `description` (TEXT) - Full description
- `type` (ENUM) - activity_type: 'assignment', 'grade', 'class', 'announcement', 'general', 'doubt', 'achievement'
- `priority` (ENUM) - priority_level: 'low', 'medium', 'high', 'urgent'
- `related_subject` (VARCHAR) - Subject name
- `related_entity_type` (VARCHAR) - Type of related entity
- `related_entity_id` (UUID) - ID of related entity
- `is_read` (BOOLEAN) - Read status
- `read_at` (TIMESTAMPTZ) - When read
- `created_at`, `updated_at`, `deleted_at` (TIMESTAMPTZ)

**Indexes:**
- `idx_student_activities_student` on student_id
- `idx_student_activities_type` on type
- `idx_student_activities_created` on created_at DESC

**Related Tables:**
- `activity_comments` - Comments on activities
- `activity_reactions` - Emoji reactions
- `activity_attachments` - File attachments
- `activity_timeline` - Event timeline

**Sample Query:**
```sql
-- Get unread activities for student
SELECT * FROM student_activities
WHERE student_id = '96055c84-a9ee-496d-8360-6b7cea64b928'
  AND is_read = FALSE
ORDER BY created_at DESC
LIMIT 10;
```

---

#### 2. `doubts` - Student Questions (Updated)
**Purpose:** Student doubt/question submission system

**New Columns Added:**
- `category` (VARCHAR) - Question category
- `tags` (TEXT[]) - Search tags
- `is_public` (BOOLEAN) - Public visibility
- `upvotes_count` (INTEGER) - Community upvotes
- `views_count` (INTEGER) - View tracking
- `responded_by` (UUID) - Who answered
- `responded_at` (TIMESTAMPTZ) - When answered
- `resolution_time_minutes` (INTEGER) - Time to resolve

**Related Tables:**
- `doubt_responses` (existing) - Answers to doubts
- `doubt_attachments` (new) - File attachments

**Sample Query:**
```sql
-- Get student's pending doubts with attachments
SELECT d.*,
       array_agg(da.file_name) as attachments
FROM doubts d
LEFT JOIN doubt_attachments da ON d.id = da.doubt_id
WHERE d.student_id = '96055c84-a9ee-496d-8360-6b7cea64b928'
  AND d.status = 'pending'
GROUP BY d.id
ORDER BY d.created_at DESC;
```

---

#### 3. `ai_insights` - AI Learning Insights (Existing)
**Purpose:** AI-generated insights and recommendations

**Usage:** Already implemented, used by NewAILearningDashboard

**Key Columns:**
- `student_id`, `parent_id`
- `insight_category`, `severity`
- `title`, `summary`, `detailed_analysis`
- `confidence_score`, `impact_score`

---

### 🤖 AI FEATURES TABLES

#### 4. `ai_conversations` - AI Chat Sessions
**Purpose:** Track AI tutor/study assistant conversations

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students)
- `title` (VARCHAR) - Session title
- `subject` (VARCHAR) - Related subject
- `conversation_type` (VARCHAR) - 'tutor', 'study', 'practice'
- `is_active` (BOOLEAN) - Active status
- `started_at`, `last_message_at` (TIMESTAMPTZ)
- `message_count` (INTEGER)

**Related Tables:**
- `ai_messages` - Individual messages in conversation

**Sample Query:**
```sql
-- Get active AI conversations with message count
SELECT c.*,
       COUNT(m.id) as total_messages
FROM ai_conversations c
LEFT JOIN ai_messages m ON c.id = m.conversation_id
WHERE c.student_id = '96055c84-a9ee-496d-8360-6b7cea64b928'
  AND c.is_active = TRUE
GROUP BY c.id
ORDER BY c.last_message_at DESC;
```

---

#### 5. `ai_messages` - Chat Messages
**Purpose:** Store AI conversation messages

**Columns:**
- `id` (UUID, PK)
- `conversation_id` (UUID, FK → ai_conversations)
- `role` (VARCHAR) - 'user', 'assistant', 'system'
- `content` (TEXT) - Message content
- `metadata` (JSONB) - Additional context
- `created_at` (TIMESTAMPTZ)

---

#### 6. `ai_practice_problems` - AI-Generated Practice
**Purpose:** AI-generated practice problems for students

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students)
- `subject`, `topic` (VARCHAR)
- `difficulty` (ENUM) - 'easy', 'medium', 'hard'
- `question`, `correct_answer`, `explanation` (TEXT)
- `options` (JSONB) - For MCQs
- `hints` (TEXT[])
- `student_answer` (TEXT)
- `is_correct` (BOOLEAN)
- `time_spent_seconds`, `attempts` (INTEGER)

**Sample Query:**
```sql
-- Get practice problems with performance stats
SELECT subject,
       COUNT(*) as total_problems,
       SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_count,
       ROUND(AVG(time_spent_seconds)) as avg_time_seconds
FROM ai_practice_problems
WHERE student_id = '96055c84-a9ee-496d-8360-6b7cea64b928'
  AND completed_at IS NOT NULL
GROUP BY subject;
```

---

#### 7. `ai_study_summaries` - AI Summaries
**Purpose:** AI-generated study summaries from materials

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students)
- `subject`, `topic`, `title` (VARCHAR)
- `summary` (TEXT) - Main summary
- `key_points` (TEXT[]) - Bullet points
- `related_materials` (TEXT[])
- `generated_from` (VARCHAR) - Source type
- `confidence_score` (DECIMAL)

---

#### 8. `flashcards` - Study Flashcards
**Purpose:** Spaced repetition flashcard system

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students)
- `subject`, `topic` (VARCHAR)
- `question`, `answer` (TEXT)
- `difficulty` (ENUM)
- `is_mastered` (BOOLEAN)
- `review_count`, `correct_count` (INTEGER)
- `last_reviewed_at`, `next_review_at` (TIMESTAMPTZ)
- `ai_generated` (BOOLEAN)

**Sample Query:**
```sql
-- Get flashcards due for review
SELECT * FROM flashcards
WHERE student_id = '96055c84-a9ee-496d-8360-6b7cea64b928'
  AND next_review_at <= NOW()
  AND is_mastered = FALSE
ORDER BY next_review_at
LIMIT 10;
```

---

#### 9. `weak_areas` - Performance Analysis
**Purpose:** Track weak topics for targeted practice

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students)
- `subject`, `topic` (VARCHAR)
- `current_score`, `previous_score` (DECIMAL)
- `improvement_percentage` (DECIMAL, GENERATED)
- `suggestions` (TEXT[])
- `practice_count` (INTEGER)
- `is_resolved` (BOOLEAN)

---

### 📚 CLASSES TAB TABLES

#### 10. `class_sessions` - Class Schedule
**Purpose:** All class sessions (lectures, labs, discussions)

**Columns:**
- `id` (UUID, PK)
- `batch_id` (UUID, FK → batches)
- `subject`, `title` (VARCHAR)
- `description` (TEXT)
- `teacher_id` (UUID, FK → teachers)
- `class_type` (VARCHAR) - 'lecture', 'lab', 'discussion', 'test'
- `start_time`, `end_time` (TIMESTAMPTZ)
- `duration_minutes` (INTEGER, GENERATED)
- `status` (ENUM) - 'scheduled', 'live', 'ended', 'cancelled'
- `location` (VARCHAR)
- `recording_url`, `notes_url` (TEXT)
- `materials_url` (TEXT[])
- `attendance_mandatory` (BOOLEAN)

**Sample Query:**
```sql
-- Get today's classes for student's batch
SELECT cs.*, t.name as teacher_name
FROM class_sessions cs
JOIN students s ON s.batch_id = cs.batch_id
JOIN teachers t ON t.id = cs.teacher_id
WHERE s.id = '96055c84-a9ee-496d-8360-6b7cea64b928'
  AND DATE(cs.start_time) = CURRENT_DATE
ORDER BY cs.start_time;
```

---

#### 11. `live_sessions` - Live Classes (Updated)
**Purpose:** Virtual/live class sessions

**Table exists, used for Stream.io integration**

**Related Tables:**
- `live_session_participants` (updated with new columns)
- `live_class_chat` (new)
- `live_class_reactions` (new)

---

#### 12. `live_class_chat` - Real-time Chat
**Purpose:** Chat messages during live classes

**Columns:**
- `id` (UUID, PK)
- `session_id` (UUID, FK → live_sessions)
- `user_id`, `user_name`, `user_avatar` (UUID/VARCHAR)
- `message` (TEXT)
- `message_type` (VARCHAR) - 'text', 'image', 'file', 'poll'
- `is_pinned` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)

**Sample Query:**
```sql
-- Get recent chat messages for live class
SELECT * FROM live_class_chat
WHERE session_id = 'session-uuid'
ORDER BY created_at DESC
LIMIT 50;
```

---

#### 13. `live_class_reactions` - Quick Reactions
**Purpose:** Emoji reactions during live class

**Columns:**
- `id` (UUID, PK)
- `session_id` (UUID, FK → live_sessions)
- `user_id` (UUID)
- `emoji` (VARCHAR)
- `created_at` (TIMESTAMPTZ)

---

#### 14. `class_notes` - Student Notes
**Purpose:** Personal and shared class notes

**Columns:**
- `id` (UUID, PK)
- `session_id` (UUID, FK → class_sessions)
- `student_id` (UUID, FK → students)
- `subject`, `title` (VARCHAR)
- `content` (TEXT) - Plain text
- `formatted_content` (JSONB) - Rich text format
- `tags` (TEXT[])
- `is_shared`, `share_with_peers` (BOOLEAN)
- `ai_generated` (BOOLEAN)

---

#### 15. `whiteboard_data` - Collaborative Whiteboard (Updated)
**Purpose:** Whiteboard sessions for classes

**New Columns Added:**
- `session_name` (VARCHAR)
- `is_collaborative` (BOOLEAN)
- `contributors` (UUID[])
- `is_saved` (BOOLEAN)
- `thumbnail_url` (TEXT)

---

### 📅 CALENDAR & SCHEDULE TABLES

#### 16. `calendar_events` - Events Calendar
**Purpose:** All calendar events (tests, assignments, holidays, etc.)

**Columns:**
- `id` (UUID, PK)
- `batch_id` (UUID, FK → batches)
- `title`, `description` (VARCHAR/TEXT)
- `event_type` (ENUM) - 'class', 'assignment', 'test', 'exam', 'event', 'holiday'
- `subject` (VARCHAR)
- `event_date` (DATE)
- `start_time`, `end_time` (TIME)
- `all_day` (BOOLEAN)
- `location` (VARCHAR)
- `reminder_minutes_before` (INTEGER)
- `is_recurring` (BOOLEAN)
- `recurrence_pattern` (VARCHAR)

**Sample Query:**
```sql
-- Get upcoming events for next 7 days
SELECT * FROM calendar_events ce
JOIN students s ON s.batch_id = ce.batch_id
WHERE s.id = '96055c84-a9ee-496d-8360-6b7cea64b928'
  AND ce.event_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY ce.event_date, ce.start_time;
```

---

#### 17. `student_reminders` - Personal Reminders
**Purpose:** Custom reminders for classes, assignments, tests

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students)
- `event_id`, `class_session_id`, `assignment_id` (UUID, nullable)
- `title` (VARCHAR)
- `reminder_time` (TIMESTAMPTZ)
- `reminder_type` (VARCHAR)
- `minutes_before` (INTEGER)
- `is_enabled`, `is_sent` (BOOLEAN)

---

#### 18. `reschedule_requests` - Class Rescheduling
**Purpose:** Student requests to reschedule classes

**Columns:**
- `id` (UUID, PK)
- `class_session_id` (UUID, FK → class_sessions)
- `requested_by_student_id` (UUID, FK → students)
- `current_time`, `proposed_time` (TIMESTAMPTZ)
- `reason` (TEXT)
- `status` (VARCHAR) - 'pending', 'approved', 'rejected'
- `reviewed_by`, `review_notes` (UUID/TEXT)

---

#### 19. `google_calendar_sync` - Calendar Integration
**Purpose:** Google Calendar synchronization

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students) - UNIQUE
- `is_enabled` (BOOLEAN)
- `google_calendar_id` (VARCHAR)
- `access_token_encrypted`, `refresh_token_encrypted` (TEXT)
- `last_synced_at` (TIMESTAMPTZ)
- `sync_frequency_minutes` (INTEGER)

---

### 📖 STUDY MATERIALS TABLES

#### 20. `study_materials` - Study Library (Updated)
**Purpose:** Videos, PDFs, documents for students

**New Columns Added:**
- `material_type` (ENUM) - 'video', 'pdf', 'document', 'link', 'image', 'audio'
- `file_url`, `file_size`, `thumbnail_url` (TEXT/VARCHAR)
- `duration_seconds` (INTEGER) - For videos
- `views_count`, `downloads_count` (INTEGER)
- `tags` (TEXT[])
- `is_featured` (BOOLEAN)
- `uploaded_by`, `uploaded_at` (UUID/TIMESTAMPTZ)

---

#### 21. `study_material_views` - View Tracking
**Purpose:** Track student progress on materials

**Columns:**
- `id` (UUID, PK)
- `material_id` (UUID, FK → study_materials)
- `student_id` (UUID, FK → students)
- `progress_percentage` (INTEGER)
- `last_position_seconds` (INTEGER) - For videos
- `completed` (BOOLEAN)
- `view_count` (INTEGER)
- `first_viewed_at`, `last_viewed_at` (TIMESTAMPTZ)

**Sample Query:**
```sql
-- Get student's study progress by material
SELECT sm.title, sm.material_type,
       smv.progress_percentage,
       smv.view_count,
       smv.completed
FROM study_material_views smv
JOIN study_materials sm ON sm.id = smv.material_id
WHERE smv.student_id = '96055c84-a9ee-496d-8360-6b7cea64b928'
ORDER BY smv.last_viewed_at DESC;
```

---

### 📝 ASSIGNMENTS TABLES

#### 22. `assignments` - Assignments (Existing, Updated)
**Table exists with updates for collaborative features**

---

#### 23. `assignment_submissions` - Submissions (Updated)
**Purpose:** Student assignment submissions

**New Columns Added:**
- `is_collaborative` (BOOLEAN)
- `team_id` (UUID, FK → assignment_teams)
- `version_number` (INTEGER)
- `last_edited_by` (UUID)
- `last_edited_at` (TIMESTAMPTZ)

---

#### 24. `assignment_teams` - Team Assignments
**Purpose:** Group/collaborative assignments

**Columns:**
- `id` (UUID, PK)
- `assignment_id` (UUID, FK → assignments)
- `team_name` (VARCHAR)
- `created_at` (TIMESTAMPTZ)

**Related Tables:**
- `assignment_team_members` - Team roster
- `submission_versions` - Version history
- `active_editors` - Real-time editing tracking

---

#### 25. `assignment_team_members` - Team Members
**Purpose:** Track team member contributions

**Columns:**
- `id` (UUID, PK)
- `team_id` (UUID, FK → assignment_teams)
- `student_id` (UUID, FK → students)
- `role` (VARCHAR) - 'leader', 'member'
- `contribution_percentage` (DECIMAL)
- `lines_added`, `edits_count` (INTEGER)
- `joined_at` (TIMESTAMPTZ)

**Sample Query:**
```sql
-- Get team assignment with member contributions
SELECT at.team_name,
       s.full_name,
       atm.role,
       atm.contribution_percentage,
       atm.lines_added,
       atm.edits_count
FROM assignment_teams at
JOIN assignment_team_members atm ON at.id = atm.team_id
JOIN students s ON s.id = atm.student_id
WHERE at.assignment_id = 'assignment-uuid'
ORDER BY atm.contribution_percentage DESC;
```

---

#### 26. `submission_versions` - Version History
**Purpose:** Track assignment submission versions

**Columns:**
- `id` (UUID, PK)
- `submission_id` (UUID, FK → assignment_submissions)
- `version_number` (INTEGER)
- `content` (TEXT)
- `changes_summary` (TEXT)
- `author_id`, `author_name` (UUID/VARCHAR)
- `created_at` (TIMESTAMPTZ)

---

#### 27. `collaborative_notes` - Shared Notes
**Purpose:** Collaborative note-taking for group work

**Columns:**
- `id` (UUID, PK)
- `assignment_id` (UUID, FK → assignments)
- `title`, `subject` (VARCHAR)
- `content` (TEXT)
- `formatted_content` (JSONB)
- `version_number` (INTEGER)
- `contributors` (UUID[])
- `last_edited_by`, `last_edited_at` (UUID/TIMESTAMPTZ)
- `is_locked` (BOOLEAN)

**Related Tables:**
- `note_versions` - Version history

---

### 🎮 GAMIFICATION TABLES

#### 28. `student_gamification` - Gamification Profile
**Purpose:** Student gamification stats (points, level, streaks)

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students) - UNIQUE
- `total_points` (INTEGER)
- `level` (INTEGER)
- `xp` (INTEGER)
- `streak_days`, `longest_streak` (INTEGER)
- `last_activity_date` (DATE)
- `assignments_completed_count` (INTEGER)
- `tests_taken_count` (INTEGER)
- `doubts_asked_count` (INTEGER)
- `study_hours` (DECIMAL)

**Sample Query:**
```sql
-- Get gamification profile
SELECT sg.*,
       (sg.xp % 1000) as xp_to_next_level,
       1000 - (sg.xp % 1000) as xp_needed
FROM student_gamification sg
WHERE student_id = '96055c84-a9ee-496d-8360-6b7cea64b928';
```

---

#### 29. `badges` - Badge Master List
**Purpose:** All available badges in system

**Columns:**
- `id` (UUID, PK)
- `name` (VARCHAR) - UNIQUE
- `description` (TEXT)
- `icon` (VARCHAR)
- `rarity` (ENUM) - 'common', 'rare', 'epic', 'legendary'
- `category` (VARCHAR) - 'academic', 'social', 'special'
- `requirement` (TEXT)
- `points_required` (INTEGER)

**Sample Badges:**
- First Assignment (📝, Common)
- Perfect Attendance (✅, Rare)
- Study Streak Master (🔥, Epic)
- Top Performer (🏆, Legendary)

---

#### 30. `student_badges` - Earned Badges
**Purpose:** Track which badges students have earned

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students)
- `badge_id` (UUID, FK → badges)
- `earned_at` (TIMESTAMPTZ) - NULL if locked
- `progress_percentage` (INTEGER)
- `is_locked` (BOOLEAN)

**Sample Query:**
```sql
-- Get student badges with details
SELECT b.name, b.icon, b.rarity, b.description,
       sb.earned_at, sb.progress_percentage, sb.is_locked
FROM student_badges sb
JOIN badges b ON b.id = sb.badge_id
WHERE sb.student_id = '96055c84-a9ee-496d-8360-6b7cea64b928'
ORDER BY sb.earned_at DESC NULLS LAST;
```

---

#### 31. `student_achievements` - Achievement Timeline
**Purpose:** Timeline of all achievements

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students)
- `achievement_type` (VARCHAR) - 'badge', 'milestone', 'level_up', 'streak'
- `title`, `description` (VARCHAR/TEXT)
- `icon` (VARCHAR)
- `points_awarded` (INTEGER)
- `related_entity_type`, `related_entity_id` (VARCHAR/UUID)
- `created_at` (TIMESTAMPTZ)

---

### 👥 PEER LEARNING TABLES

#### 32. `peer_connections` - Peer Network
**Purpose:** Student-to-student connections

**Columns:**
- `id` (UUID, PK)
- `student_id_1`, `student_id_2` (UUID, FK → students)
- `connection_type` (VARCHAR) - 'peer', 'study_buddy', 'mentor'
- `status` (VARCHAR) - 'pending', 'accepted', 'blocked'
- `common_subjects` (TEXT[])
- `match_percentage` (INTEGER)
- `connected_at` (TIMESTAMPTZ)

**Unique Constraint:** Ensures bidirectional uniqueness

---

#### 33. `study_groups` - Study Groups
**Purpose:** Collaborative study groups

**Columns:**
- `id` (UUID, PK)
- `name`, `description` (VARCHAR/TEXT)
- `subject` (VARCHAR)
- `batch_id` (UUID, FK → batches)
- `created_by_student_id` (UUID, FK → students)
- `max_members` (INTEGER)
- `is_public`, `is_active` (BOOLEAN)

**Related Tables:**
- `study_group_members` - Group membership

**Sample Query:**
```sql
-- Get active study groups with member counts
SELECT sg.id, sg.name, sg.subject,
       COUNT(sgm.id) as member_count,
       sg.max_members,
       ARRAY_AGG(s.full_name) as members
FROM study_groups sg
LEFT JOIN study_group_members sgm ON sg.id = sgm.group_id
LEFT JOIN students s ON s.id = sgm.student_id
WHERE sg.is_active = TRUE
  AND sg.batch_id = '57ab5ec8-fac5-49f9-b64c-38e4b526ef84'
GROUP BY sg.id
ORDER BY member_count DESC;
```

---

#### 34. `study_group_members` - Group Membership
**Purpose:** Track group members and roles

**Columns:**
- `id` (UUID, PK)
- `group_id` (UUID, FK → study_groups)
- `student_id` (UUID, FK → students)
- `role` (VARCHAR) - 'admin', 'moderator', 'member'
- `joined_at`, `last_active_at` (TIMESTAMPTZ)

---

#### 35. `shared_resources` - Resource Sharing
**Purpose:** Share study materials with peers/groups

**Columns:**
- `id` (UUID, PK)
- `title`, `description` (VARCHAR/TEXT)
- `resource_type` (ENUM) - material_type
- `file_url`, `file_size`, `thumbnail_url` (TEXT/VARCHAR)
- `subject` (VARCHAR)
- `tags` (TEXT[])
- `shared_by_student_id` (UUID, FK → students)
- `group_id` (UUID, FK → study_groups)
- `is_public` (BOOLEAN)
- `views_count`, `downloads_count`, `upvotes_count` (INTEGER)

---

#### 36. `peer_leaderboard` - Leaderboards
**Purpose:** Competitive leaderboards (weekly, monthly, all-time)

**Columns:**
- `id` (UUID, PK)
- `batch_id` (UUID, FK → batches)
- `student_id` (UUID, FK → students)
- `rank` (INTEGER)
- `total_points` (INTEGER)
- `week_number`, `month_number`, `year` (INTEGER)
- `leaderboard_type` (VARCHAR) - 'weekly', 'monthly', 'all_time'

**Sample Query:**
```sql
-- Get current week's leaderboard
SELECT pl.rank,
       s.full_name,
       pl.total_points
FROM peer_leaderboard pl
JOIN students s ON s.id = pl.student_id
WHERE pl.batch_id = '57ab5ec8-fac5-49f9-b64c-38e4b526ef84'
  AND pl.leaderboard_type = 'weekly'
  AND pl.week_number = EXTRACT(WEEK FROM CURRENT_DATE)
  AND pl.year = EXTRACT(YEAR FROM CURRENT_DATE)
ORDER BY pl.rank;
```

---

### 📊 PROGRESS & ANALYTICS TABLES

#### 37. `test_results` - Test Scores
**Purpose:** All test/exam results with analytics

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students)
- `subject`, `test_name`, `test_type` (VARCHAR)
- `test_date` (DATE)
- `total_marks`, `marks_obtained` (DECIMAL)
- `percentage` (DECIMAL, GENERATED)
- `grade` (VARCHAR)
- `rank_in_class`, `total_students` (INTEGER)
- `time_taken_minutes` (INTEGER)
- `feedback` (TEXT)
- `strengths`, `weaknesses` (TEXT[])

**Sample Query:**
```sql
-- Get test performance trend by subject
SELECT subject,
       test_name,
       test_date,
       percentage,
       grade,
       rank_in_class
FROM test_results
WHERE student_id = '96055c84-a9ee-496d-8360-6b7cea64b928'
ORDER BY subject, test_date DESC;
```

---

#### 38. `student_goals` - Personal Goals
**Purpose:** Student-set academic goals with tracking

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students)
- `title`, `description` (VARCHAR/TEXT)
- `goal_type` (VARCHAR) - 'academic', 'attendance', 'assignment', 'test_score'
- `target_value`, `current_value` (DECIMAL)
- `unit` (VARCHAR) - 'assignments', 'tests', 'hours', 'percent'
- `deadline` (DATE)
- `status` (ENUM) - 'active', 'completed', 'abandoned'
- `progress_percentage` (INTEGER, GENERATED)
- `completed_at` (TIMESTAMPTZ)

**Sample Query:**
```sql
-- Get active goals with progress
SELECT title, goal_type,
       current_value, target_value, unit,
       progress_percentage,
       deadline,
       CASE
         WHEN deadline < CURRENT_DATE THEN 'Overdue'
         WHEN deadline <= CURRENT_DATE + INTERVAL '7 days' THEN 'Due Soon'
         ELSE 'On Track'
       END as urgency
FROM student_goals
WHERE student_id = '96055c84-a9ee-496d-8360-6b7cea64b928'
  AND status = 'active'
ORDER BY deadline;
```

---

#### 39. `performance_metrics` - Daily Performance
**Purpose:** Daily performance tracking for charts

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students)
- `metric_date` (DATE)
- `subject` (VARCHAR)
- `average_score` (DECIMAL)
- `assignments_completed` (INTEGER)
- `attendance_percentage` (DECIMAL)
- `study_time_minutes` (INTEGER)

**Unique:** (student_id, metric_date, subject)

**Sample Query:**
```sql
-- Get last 7 days performance for chart
SELECT metric_date,
       AVG(average_score) as daily_avg,
       SUM(study_time_minutes) as total_study_time
FROM performance_metrics
WHERE student_id = '96055c84-a9ee-496d-8360-6b7cea64b928'
  AND metric_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY metric_date
ORDER BY metric_date;
```

---

#### 40. `student_progress` - Overall Progress (Existing)
**Purpose:** Subject-wise progress tracking

**Table exists with columns:**
- `student_id`, `subject_code`, `batch_id`
- `attendance_percentage`, `average_score`
- `completed_assignments`, `total_assignments`
- `strengths`, `weaknesses`, `recommendations`

---

### 📱 NOTIFICATIONS & COMMUNICATION

#### 41. `notifications` - Notifications (Existing, Updated)
**Purpose:** All system notifications

**Existing columns work well for student needs**

**Key Columns:**
- `recipient_id`, `title`, `content`
- `notification_type`, `category`, `priority`
- `is_urgent`, `read_at`, `dismissed_at`
- `action_url`, `actions` (JSONB)

---

### 🔧 SUPPORTING TABLES

#### 42. `study_plans` - Study Plans (Updated)
**Purpose:** Structured study plans for students

**New Columns Added:**
- `title`, `subject`, `duration_days`
- `tasks` (TEXT[])
- `progress_percentage`, `is_completed`
- `ai_generated`, `completed_at`

---

#### 43. `polls` - Interactive Polls (Updated)
**Purpose:** Classroom polls and quizzes

**New Columns Added:**
- `poll_type`, `correct_option_index`
- `is_anonymous`, `duration_seconds`
- `results_visible`

---

#### 44. `active_editors` - Real-time Editing
**Purpose:** Track who's editing collaborative documents

**Columns:**
- `id` (UUID, PK)
- `submission_id` (UUID, FK → assignment_submissions)
- `student_id` (UUID, FK → students)
- `section` (VARCHAR) - Which section being edited
- `cursor_position` (JSONB) - {x, y} coordinates
- `last_active_at` (TIMESTAMPTZ)

**Unique:** (submission_id, student_id)

---

## Table Relationships

### Entity Relationship Diagram (Simplified)

```
students (Core Entity)
│
├─→ student_activities
│   ├─→ activity_comments
│   ├─→ activity_reactions
│   ├─→ activity_attachments
│   └─→ activity_timeline
│
├─→ doubts
│   ├─→ doubt_responses
│   └─→ doubt_attachments
│
├─→ ai_conversations
│   └─→ ai_messages
│
├─→ ai_practice_problems
├─→ ai_study_summaries
├─→ flashcards
├─→ weak_areas
│
├─→ study_material_views
│   └─→ study_materials
│
├─→ class_notes
│   └─→ class_sessions
│
├─→ assignment_submissions
│   ├─→ assignments
│   ├─→ submission_versions
│   └─→ active_editors
│
├─→ assignment_team_members
│   └─→ assignment_teams
│
├─→ student_reminders
│   ├─→ calendar_events
│   ├─→ class_sessions
│   └─→ assignments
│
├─→ test_results
├─→ student_goals
├─→ performance_metrics
│
├─→ student_gamification
├─→ student_badges
│   └─→ badges
├─→ student_achievements
│
├─→ peer_connections
├─→ study_group_members
│   └─→ study_groups
├─→ shared_resources
└─→ peer_leaderboard

batches (Organization)
├─→ class_sessions
├─→ calendar_events
├─→ study_groups
└─→ peer_leaderboard

live_sessions (Live Classes)
├─→ live_session_participants
├─→ live_class_chat
└─→ live_class_reactions

assignments (Assignments)
├─→ assignment_submissions
├─→ assignment_teams
└─→ collaborative_notes
    └─→ note_versions
```

---

## Sample Queries by Screen

### 1. NewStudentDashboard

```sql
-- Complete dashboard data
WITH student_batch AS (
    SELECT batch_id FROM students WHERE id = '96055c84-a9ee-496d-8360-6b7cea64b928'
),
today_classes AS (
    SELECT COUNT(*) as count
    FROM class_sessions cs, student_batch sb
    WHERE cs.batch_id = sb.batch_id
      AND DATE(cs.start_time) = CURRENT_DATE
),
pending_assignments AS (
    SELECT COUNT(*) as count
    FROM assignments a, student_batch sb
    WHERE a.class_id = sb.batch_id
      AND a.status = 'published'
      AND a.due_date >= NOW()
),
student_stats AS (
    SELECT attendance_percentage, assignments_completed, total_assignments
    FROM students
    WHERE id = '96055c84-a9ee-496d-8360-6b7cea64b928'
),
streak_info AS (
    SELECT streak_days
    FROM student_gamification
    WHERE student_id = '96055c84-a9ee-496d-8360-6b7cea64b928'
)
SELECT
    tc.count as classes_today,
    pa.count as assignments_pending,
    ss.attendance_percentage,
    si.streak_days
FROM today_classes tc, pending_assignments pa, student_stats ss, streak_info si;
```

### 2. NewActivityDetail

```sql
-- Activity with all related data
SELECT
    sa.*,
    (SELECT jsonb_agg(jsonb_build_object(
        'id', id, 'user_name', user_name, 'content', content, 'created_at', created_at
    )) FROM activity_comments WHERE activity_id = sa.id) as comments,
    (SELECT jsonb_object_agg(emoji, COUNT(*))
     FROM activity_reactions WHERE activity_id = sa.id GROUP BY emoji) as reactions,
    (SELECT jsonb_agg(jsonb_build_object(
        'id', id, 'file_name', file_name, 'file_type', file_type, 'file_url', file_url
    )) FROM activity_attachments WHERE activity_id = sa.id) as attachments
FROM student_activities sa
WHERE sa.id = 'activity-uuid';
```

### 3. NewEnhancedSchedule (Calendar View)

```sql
-- Get all events for a specific month
SELECT
    ce.id,
    ce.title,
    ce.event_type,
    ce.subject,
    ce.event_date,
    ce.start_time,
    ce.end_time,
    CASE ce.event_type
        WHEN 'test' THEN 'error'
        WHEN 'assignment' THEN 'warning'
        WHEN 'class' THEN 'info'
        ELSE 'neutral'
    END as badge_variant
FROM calendar_events ce
JOIN students s ON s.batch_id = ce.batch_id
WHERE s.id = '96055c84-a9ee-496d-8360-6b7cea64b928'
  AND EXTRACT(MONTH FROM ce.event_date) = 11
  AND EXTRACT(YEAR FROM ce.event_date) = 2025
ORDER BY ce.event_date, ce.start_time;
```

### 4. NewGamifiedLearningHub

```sql
-- Complete gamification profile with badges
SELECT
    sg.total_points,
    sg.level,
    sg.xp,
    sg.streak_days,
    (
        SELECT jsonb_agg(jsonb_build_object(
            'id', b.id,
            'name', b.name,
            'icon', b.icon,
            'rarity', b.rarity,
            'category', b.category,
            'earned', (sb.earned_at IS NOT NULL),
            'progress', sb.progress_percentage,
            'earned_date', sb.earned_at
        ))
        FROM student_badges sb
        JOIN badges b ON b.id = sb.badge_id
        WHERE sb.student_id = sg.student_id
    ) as badges,
    (
        SELECT jsonb_agg(jsonb_build_object(
            'id', sa.id,
            'title', sa.title,
            'icon', sa.icon,
            'points', sa.points_awarded,
            'created_at', sa.created_at
        ) ORDER BY sa.created_at DESC)
        FROM student_achievements sa
        WHERE sa.student_id = sg.student_id
        LIMIT 10
    ) as recent_achievements
FROM student_gamification sg
WHERE sg.student_id = '96055c84-a9ee-496d-8360-6b7cea64b928';
```

### 5. NewPeerLearningNetwork

```sql
-- Get peers from same batch with match scores
SELECT
    s.id,
    s.full_name as name,
    s.email,
    '👤' as avatar, -- Can use avatar utility function
    ARRAY_AGG(DISTINCT sp.subject_code) as subjects,
    -- Calculate match percentage based on common subjects
    (
        SELECT COUNT(DISTINCT subject_code) * 10
        FROM student_progress sp2
        WHERE sp2.student_id = s.id
          AND sp2.subject_code IN (
              SELECT subject_code FROM student_progress
              WHERE student_id = '96055c84-a9ee-496d-8360-6b7cea64b928'
          )
    ) as match_percentage
FROM students s
JOIN student_progress sp ON sp.student_id = s.id
WHERE s.batch_id = (SELECT batch_id FROM students WHERE id = '96055c84-a9ee-496d-8360-6b7cea64b928')
  AND s.id != '96055c84-a9ee-496d-8360-6b7cea64b928'
GROUP BY s.id, s.full_name, s.email
LIMIT 10;
```

### 6. NewCollaborativeAssignment

```sql
-- Get team assignment with contributions
SELECT
    at.id as team_id,
    at.team_name,
    a.title as assignment_title,
    jsonb_agg(jsonb_build_object(
        'student_id', s.id,
        'name', s.full_name,
        'role', atm.role,
        'contribution_percentage', atm.contribution_percentage,
        'lines_added', atm.lines_added,
        'edits_count', atm.edits_count
    )) as team_members,
    (
        SELECT jsonb_agg(jsonb_build_object(
            'version', sv.version_number,
            'author', sv.author_name,
            'changes', sv.changes_summary,
            'timestamp', sv.created_at
        ) ORDER BY sv.version_number DESC)
        FROM submission_versions sv
        JOIN assignment_submissions asub ON asub.id = sv.submission_id
        WHERE asub.team_id = at.id
    ) as version_history
FROM assignment_teams at
JOIN assignments a ON a.id = at.assignment_id
JOIN assignment_team_members atm ON atm.team_id = at.id
JOIN students s ON s.id = atm.student_id
WHERE at.id = 'team-uuid'
GROUP BY at.id, at.team_name, a.title;
```

### 7. NewEnhancedAIStudy (Weak Areas)

```sql
-- Get weak areas with suggestions
SELECT
    wa.subject,
    wa.topic,
    wa.current_score,
    wa.previous_score,
    wa.improvement_percentage,
    wa.suggestions,
    wa.practice_count,
    wa.last_practiced_at,
    -- Determine severity
    CASE
        WHEN wa.current_score < 50 THEN 'high'
        WHEN wa.current_score < 70 THEN 'medium'
        ELSE 'low'
    END as priority
FROM weak_areas wa
WHERE wa.student_id = '96055c84-a9ee-496d-8360-6b7cea64b928'
  AND wa.is_resolved = FALSE
ORDER BY wa.current_score ASC, wa.practice_count ASC
LIMIT 5;
```

### 8. NewProgressDetailScreen

```sql
-- Comprehensive progress report
SELECT
    -- Overall stats
    s.overall_grade,
    s.attendance_percentage,
    s.assignments_completed,
    s.total_assignments,
    -- Subject-wise performance
    (
        SELECT jsonb_agg(jsonb_build_object(
            'subject', subject_code,
            'average_score', average_score,
            'attendance', attendance_percentage,
            'assignments_done', completed_assignments,
            'total_assignments', total_assignments
        ))
        FROM student_progress
        WHERE student_id = s.id
    ) as subject_performance,
    -- Recent test results
    (
        SELECT jsonb_agg(jsonb_build_object(
            'subject', subject,
            'test_name', test_name,
            'percentage', percentage,
            'grade', grade,
            'rank', rank_in_class,
            'date', test_date
        ) ORDER BY test_date DESC)
        FROM test_results
        WHERE student_id = s.id
        LIMIT 10
    ) as recent_tests,
    -- Performance trend (last 30 days)
    (
        SELECT jsonb_agg(jsonb_build_object(
            'date', metric_date,
            'avg_score', average_score,
            'study_time', study_time_minutes
        ) ORDER BY metric_date DESC)
        FROM performance_metrics
        WHERE student_id = s.id
          AND metric_date >= CURRENT_DATE - INTERVAL '30 days'
    ) as performance_trend
FROM students s
WHERE s.id = '96055c84-a9ee-496d-8360-6b7cea64b928';
```

---

## RLS Policies

### Student Data Access Pattern

All student-facing tables follow this RLS pattern:

```sql
-- Students can only view their own data
CREATE POLICY "policy_name" ON table_name
FOR SELECT
USING (auth.uid() = student_id);

-- Students can insert their own data
CREATE POLICY "policy_name" ON table_name
FOR INSERT
WITH CHECK (auth.uid() = student_id);

-- Students can update their own data
CREATE POLICY "policy_name" ON table_name
FOR UPDATE
USING (auth.uid() = student_id);
```

### Public/Shared Data Pattern

For collaborative features:

```sql
-- Study groups visible to batch members
CREATE POLICY "study_groups_visible" ON study_groups
FOR SELECT
USING (
    batch_id IN (
        SELECT batch_id FROM students WHERE id = auth.uid()
    )
);

-- Shared resources based on privacy settings
CREATE POLICY "shared_resources_visible" ON shared_resources
FOR SELECT
USING (
    is_public = true OR
    shared_by_student_id = auth.uid() OR
    group_id IN (
        SELECT group_id FROM study_group_members WHERE student_id = auth.uid()
    )
);
```

---

## Indexes Summary

### Performance-Critical Indexes

1. **Student Lookups**
   - All tables with `student_id` have index
   - Pattern: `idx_[table]_student ON table(student_id)`

2. **Time-based Queries**
   - `created_at DESC` for activity feeds
   - `test_date DESC` for recent results
   - `event_date` for calendar views

3. **Foreign Keys**
   - All FK columns indexed automatically
   - Additional composite indexes where needed

4. **Frequently Filtered Columns**
   - `status` columns for filtering
   - `is_active`, `is_locked` boolean flags
   - `type` enums for categorization

---

## Migration Instructions

### Step 1: Apply Migration

```bash
# From OLD directory
cd C:\PC\OLD

# Apply migration
npx supabase db push
```

### Step 2: Verify Tables

```sql
-- Check all tables created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE '%student%'
  OR table_name IN ('ai_conversations', 'flashcards', 'badges', 'calendar_events')
ORDER BY table_name;
```

### Step 3: Verify Seed Data

```sql
-- Check test student data
SELECT * FROM student_gamification
WHERE student_id = '96055c84-a9ee-496d-8360-6b7cea64b928';

SELECT COUNT(*) FROM student_badges
WHERE student_id = '96055c84-a9ee-496d-8360-6b7cea64b928';

SELECT COUNT(*) FROM student_activities
WHERE student_id = '96055c84-a9ee-496d-8360-6b7cea64b928';
```

### Step 4: Test Queries

Run sample queries from each screen section above to verify data relationships.

---

## Support & Maintenance

### Adding New Features

1. **New Table:**
   - Add to appropriate section
   - Include indexes on FK and commonly filtered columns
   - Add RLS policy
   - Update this documentation

2. **New Column:**
   - Use `ALTER TABLE ADD COLUMN IF NOT EXISTS`
   - Add index if frequently queried
   - Update related queries in documentation

### Common Issues

1. **Missing Foreign Key Data:**
   - Ensure batch_id and student_id exist before inserting
   - Use test IDs provided in seed data

2. **RLS Access Denied:**
   - Check auth.uid() matches student_id
   - Verify RLS policies are correct

3. **Performance Issues:**
   - Check EXPLAIN ANALYZE on slow queries
   - Add indexes on heavily filtered columns
   - Consider materialized views for complex aggregations

---

## Conclusion

This schema provides complete database support for all 27 student screens with:

- ✅ **Real-time capabilities** via Supabase subscriptions
- ✅ **Comprehensive data models** for every screen feature
- ✅ **Performance optimizations** with strategic indexes
- ✅ **Security** through Row Level Security policies
- ✅ **Scalability** with proper relationships and constraints
- ✅ **Test data** ready for immediate development

All screens can now query real Supabase data without mock arrays or placeholder data.

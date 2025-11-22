# Lovable.dev Complete Research Guide
## For Building a Teacher/Education App

**Last Updated:** January 2025
**Your Project:** https://lovable.dev/@WtZ7fXulByM4rww263noitP5BEj2

---

## 📋 Table of Contents
1. [Executive Summary](#executive-summary)
2. [Core Features & Capabilities](#core-features--capabilities)
3. [The Lovable Prompting Bible](#the-lovable-prompting-bible)
4. [Supabase Integration Guide](#supabase-integration-guide)
5. [Education Platform Features](#education-platform-features)
6. [Pricing & Plans](#pricing--plans)
7. [Limitations & Constraints](#limitations--constraints)
8. [Getting Started Workflow](#getting-started-workflow)
9. [Teacher App Implementation Strategy](#teacher-app-implementation-strategy)

---

## 📊 Executive Summary

**What is Lovable?**
- AI-powered web app builder that generates full-stack applications from natural language
- Creates React + Tailwind frontend + Node.js + Supabase backend from single prompts
- No-code to low-code platform for rapid prototyping and production apps

**Key Stats:**
- ⚡ Build apps 10-20x faster than traditional coding
- 🎨 Automatic UI/UX following best practices
- 🔄 Live rendering with instant visual feedback
- 🚀 One-click deployment
- 💾 Native Supabase integration for backend
- 👥 Multiplayer collaboration (Lovable 2.0+)

**Best For:**
✅ MVPs and prototypes
✅ Learning management systems
✅ Student/teacher platforms
✅ Administrative dashboards
✅ Authentication-heavy apps
✅ Database-driven applications

**Not Ideal For:**
❌ Highly complex enterprise systems (60-70% solution)
❌ Apps requiring advanced custom algorithms
❌ Real-time collaboration features beyond basic chat
❌ Large-scale data processing (performance issues with big datasets)

---

## 🚀 Core Features & Capabilities

### AI-Powered Development

**Frontend Generation:**
- React with TypeScript
- Tailwind CSS for styling
- ShadCN UI components
- Responsive design (mobile-first)
- Beautiful, modern interfaces

**Backend Capabilities:**
- Supabase PostgreSQL database
- User authentication (email/password, OAuth)
- Row Level Security (RLS)
- File storage (images, documents)
- Real-time updates
- Edge Functions (serverless)

**Development Tools:**
- **Chat Mode**: Debugging and planning without code changes (60-70% of time)
- **Default Mode**: Feature implementation and building
- **Visual Edit Tool**: Quick UI adjustments (text, colors, fonts) without credits
- **Select Tool**: Highlight components for precise targeting
- **Version Control**: Pin stable versions, compare changes, revert easily
- **GitHub Integration**: Auto-sync with repositories

### Recent Updates (2025)

**Lovable 2.0 (April 2025):**
- Multiplayer workspaces for team collaboration
- Chat Mode Agent for conversational development
- Security Scan for vulnerability detection
- Dev Mode for advanced customization
- Visual Edits without consuming credits
- Custom Domains support

**Agent Mode Beta (June 2025):**
- Autonomous AI capabilities
- 90% reduction in build errors
- Smarter context understanding

---

## 📖 The Lovable Prompting Bible

### Core Philosophy

> "Effective prompting isn't about hoping for the best—it's a structured skill."

**Key Principles:**
1. **Be Explicit**: Instead of "build a login page," specify "create a login page using React, with email/password authentication via Supabase, JWT handling, and password reset functionality"
2. **Set Constraints**: State required tech stack, styling preferences, and behavioral requirements
3. **Use Strategic Formatting**: Place critical details at beginning and end of prompts

### Four Mastery Levels

#### 1. Training Wheels Prompting (Beginners)
```
# Context
[What this is about]

## Task
[What you want built]

### Guidelines
[How it should work]

#### Constraints
[What to avoid or include]
```

#### 2. No Training Wheels (Intermediate)
Conversational tone while maintaining clarity:
"I need a teacher dashboard that shows student progress charts, with real-time updates from Supabase. Use card layouts, make it mobile-responsive, and include filters for class/subject."

#### 3. Meta Prompting (Advanced)
Use AI to refine prompts:
"Rewrite this prompt to be more concise and detailed for building a student attendance tracker."

#### 4. Reverse Meta Prompting (Expert)
Document debugging processes for future reference and systematic prompt creation.

### Essential Prompt Library

#### Starting New Projects
```
I need a [teacher management] application with:

TECH STACK:
- Frontend: React + TypeScript + Tailwind + ShadCN
- Styling: Modern, professional, mobile-first
- Authorization: Supabase Auth with email/password + Google OAuth
- Database: Supabase PostgreSQL
- Deployment: One-click Lovable deployment

CORE FEATURES:
1. Teacher dashboard with student overview
2. Class management (create, edit, assign students)
3. Assignment/homework tracking
4. Student progress analytics
5. Grade book with calculations

SECONDARY FEATURES:
1. Parent communication portal
2. Attendance tracking
3. Behavioral notes
4. Report card generation

START WITH:
Begin with authentication flow and teacher dashboard layout.
```

#### Protecting Existing Code
```
Please refrain from altering the authentication pages and student profile pages.
Focus changes solely on the grade book component.

This update requires utmost precision. Examine all dependencies and test
systematically to guarantee nothing is disrupted.
```

#### Design Prompts

**UI-Only Changes:**
```
Make solely visual enhancements to the dashboard—ensure functionality
and logic remain unaffected. Update colors to use a blue/green palette
and increase font sizes for better readability.
```

**Mobile Optimization:**
```
Enhance the app's mobile experience while preserving design and functionality.
Make certain all designs are completely responsive at every breakpoint,
adopting mobile-first strategy. Use ShadCN and Tailwind's standard breakpoints.
```

#### Knowledge Base Framework

Create a comprehensive Knowledge file with:

**1. Project Requirements Document (PRD):**
```
INTRODUCTION:
[App name, purpose, target users]

APP FLOW:
[User journey from login to main features]

CORE FEATURES:
[List of must-have features]

TECH STACK:
[Detailed technology choices]

SCOPE:
[What's in v1, what's future]
```

**2. User Flow:**
```
Login → Dashboard → [Feature 1] → [Feature 2]
         ↓
     Settings
```

**3. Tech Stack Details:**
```
Frontend: React 18, TypeScript, Tailwind CSS, ShadCN
Backend: Supabase (Auth, Database, Storage, Functions)
APIs: [List any external APIs]
Libraries: [Date picker, chart library, etc.]
Deployment: Lovable hosting
```

**4. Frontend Guidelines:**
```
DESIGN PRINCIPLES:
- Clean, minimal interface
- Consistent spacing (4px, 8px, 16px, 24px)
- Mobile-first responsive design

COLORS:
Primary: #3B82F6 (blue-500)
Secondary: #10B981 (green-500)
Background: #F9FAFB (gray-50)
Text: #111827 (gray-900)

TYPOGRAPHY:
Headings: font-semibold
Body: font-normal
Size scale: text-sm, text-base, text-lg, text-xl, text-2xl
```

**5. Backend Structure:**
```
DATABASE SCHEMA:
- teachers (id, name, email, subject, created_at)
- students (id, name, email, teacher_id, created_at)
- assignments (id, title, description, due_date, teacher_id)
- grades (id, student_id, assignment_id, score, feedback)

AUTHENTICATION:
- Email/password with verification
- Google OAuth
- Role-based access (teacher, student, parent, admin)

API ENDPOINTS:
- /api/teachers (CRUD)
- /api/students (CRUD)
- /api/assignments (CRUD)
- /api/grades (CRUD)

SECURITY:
- RLS policies for multi-tenant data
- JWT tokens for auth
- Input validation
```

**Before Writing Code:**
```
Before you write any code, please review the Knowledge Base and share
your understanding of my project. Confirm the user roles, database
structure, and main features you'll be building.
```

### Debugging Strategies

#### When Errors Persist

**Progressive Escalation:**

1️⃣ **Initial Investigation:**
```
Perform a preliminary investigation to uncover the root cause of this
authentication error. Don't make changes yet.
```

2️⃣ **Deep Analysis:**
```
Perform thorough analysis of the grade calculation logic, halting
modifications until root cause is identified. Check database queries,
state management, and component lifecycle.
```

3️⃣ **Full System Review:**
```
Map the entire student data flow including:
- Database schema and RLS policies
- API queries and mutations
- Component state management
- Authentication context
- Real-time subscriptions
```

4️⃣ **Comprehensive Audit:**
```
Conduct a comprehensive codebase audit focusing on the grading system.
Provide a detailed report before making any changes.
```

5️⃣ **Rethink and Rebuild:**
```
This approach isn't working. Let's completely reassess the student
progress tracking feature without making code edits until we verify
the correct architecture.
```

#### Debugging Flow (10 Steps)

1. Identify task by impact (critical vs. nice-to-have)
2. Validate solution internally before implementing
3. Report clear issue (current behavior vs. expected)
4. Validate in DOM (browser DevTools)
5. Isolate component and test independently
6. Add verbose error handling and logging
7. Audit code before changes
8. Use "Try to Fix" button (if available)
9. Provide screenshots for UI issues
10. Revert to stable versions as needed

#### Handling Unexpected Behavior

When code runs without errors but functionality fails:

```
The student list is displaying, but clicking on a student doesn't
navigate to their profile. Here's what I see [attach screenshot].

Expected: Click student card → navigate to /student/:id
Actual: Click does nothing, no console errors

Please investigate the routing and onClick handlers without making
changes first.
```

### Refactoring Best Practices

**Post-Refactoring Verification:**
```
Conduct detailed post-refactor review to verify no issues were introduced
throughout the refactoring process. Test all CRUD operations for teachers,
students, and assignments.
```

**Codebase Audit:**
```
Perform comprehensive regression and audit to determine if architecture
is clean, modular, optimized. Check for:
- Code duplication
- Unused imports/components
- Proper component composition
- Efficient database queries
```

**Folder Optimization:**
```
Assess redundancies and obsolete files in the /components and /pages
directories. Suggest reorganization and deletion of unused code.
```

**Post-Restructuring Cleanup:**
```
Verify routing, file imports, dynamic routes after folder restructure.
Test for broken links and missing components. Update all import paths.
```

### Advanced Techniques

#### Step-by-Step Approach

**Avoid multiple simultaneous tasks.** Better sequence:

**Phase 1: Frontend Design**
```
Create the teacher dashboard layout with:
1. Header with navigation
2. Stats cards (total students, assignments, average grade)
3. Recent activity feed
4. Quick actions panel
```

**Phase 2: Backend Integration**
```
Now connect the dashboard to Supabase:
1. Create teachers table
2. Add RLS policies
3. Fetch teacher data on dashboard load
4. Display real data in stats cards
```

**Phase 3: UX/UI Refinement**
```
Polish the dashboard:
1. Add loading states
2. Improve error handling
3. Add animations
4. Optimize mobile layout
```

#### Using Developer Tools

```
Check the browser console for errors. Copy and paste the exact error
message here along with the stack trace. Also check the Network tab
for failed API calls.
```

### Key Takeaway

> "Focus on big ideas; let Lovable handle execution. Master prompting = 10x productivity."

---

## 🔌 Supabase Integration Guide

### Why Supabase + Lovable?

**Native Integration Benefits:**
- Managed through single chat interface
- Automatic schema generation from prompts
- Pre-configured authentication
- Built-in real-time capabilities
- Free tier: 500MB database, 50MB file uploads

### Setup Process (5 Steps)

**Step 1: Create Supabase Account**
- Go to https://supabase.com
- Sign up (free tier available)
- Create a new project

**Step 2: Connect in Lovable**
```
1. Open your Lovable project
2. Settings → Integrations → Supabase
3. Click "Connect Supabase"
4. Authorize access
5. Select your Supabase project
```

**Step 3: Configure Authentication**

For email/password auth:
```
Add login and signup pages with email/password authentication.
Disable email confirmation in Supabase during development for testing.
```

For OAuth (Google, GitHub, etc.):
```
1. Enable provider in Supabase Dashboard → Authentication → Providers
2. Add OAuth credentials (Client ID/Secret)
3. In Lovable: "Add a 'Sign in with Google' button to the login page"
```

**Step 4: Create Database Tables**

Prompt example:
```
Create a database schema for a teacher app with these tables:

TEACHERS:
- id (uuid, primary key)
- email (text, unique)
- full_name (text)
- subject (text)
- created_at (timestamp)

STUDENTS:
- id (uuid, primary key)
- email (text, unique)
- full_name (text)
- grade_level (integer)
- teacher_id (uuid, foreign key to teachers)
- created_at (timestamp)

ASSIGNMENTS:
- id (uuid, primary key)
- title (text)
- description (text)
- due_date (date)
- total_points (integer)
- teacher_id (uuid, foreign key)
- created_at (timestamp)

GRADES:
- id (uuid, primary key)
- student_id (uuid, foreign key)
- assignment_id (uuid, foreign key)
- score (numeric)
- feedback (text)
- submitted_at (timestamp)

Generate the SQL and show me the schema before executing.
```

**Step 5: Set Up Row Level Security (RLS)**

Critical for production:
```
Set up RLS policies so:
1. Teachers can only see their own students
2. Students can only see their own grades
3. Admins can see everything

TEACHERS table:
- SELECT: authenticated users can see their own record
- INSERT: only admins
- UPDATE: users can update their own record
- DELETE: only admins

STUDENTS table:
- SELECT: teachers see their students, students see themselves
- INSERT: only teachers and admins
- UPDATE: teachers can update their students
- DELETE: only admins

GRADES table:
- SELECT: teachers see grades for their students, students see their own
- INSERT: only teachers
- UPDATE: only teachers
- DELETE: only teachers and admins
```

### Database Management

**Creating Tables via Prompts:**

1. Describe data needs in chat
2. Review generated SQL schema
3. Execute SQL in Supabase SQL Editor (or let Lovable do it)
4. Confirm in chat

Example:
```
Add a feedback form with database storage. Store:
- Student name
- Date submitted
- Rating (1-5)
- Comments
- Teacher who received it
```

**File Storage Setup:**

Limits:
- Free tier: 50MB per file
- Paid plans: Larger files, resumable uploads

Example:
```
Add file upload for assignment submissions. Students should be able to
upload PDF, DOC, or images up to 10MB. Store files in Supabase Storage
and link to the grades table.
```

### Edge Functions (Serverless Backend)

Use cases:
- Send email notifications (via Resend)
- Generate PDF reports
- Complex calculations
- Scheduled tasks (daily reports)
- Third-party API calls (payment processing)

Example:
```
Create an Edge Function that sends an email to parents when their
child's grade is below 70%. Use Resend API for emails.

The function should:
1. Trigger when a grade is inserted/updated
2. Check if score < 70%
3. Fetch parent email from students table
4. Send formatted email with student name, assignment, score
5. Log the notification
```

### Real-Time Features

```
Add real-time updates to the dashboard. When a new student is added
or a grade is updated, refresh the stats cards automatically without
page reload.
```

### Production Security Checklist

Before going live:

- [ ] Enable RLS on all tables
- [ ] Test RLS policies thoroughly
- [ ] Set up proper user roles
- [ ] Use environment variables for secrets
- [ ] Enable email verification
- [ ] Set up backup policies
- [ ] Configure CORS properly
- [ ] Add rate limiting (if needed)
- [ ] Monitor database usage

---

## 🎓 Education Platform Features

### What Lovable Can Build

**Learning Management Systems (LMS):**
- Course creation and management
- Lesson/module organization
- Quiz and assessment tools
- Student progress tracking
- Grade book with calculations
- Certificate generation

**Student Management:**
- Student profiles and records
- Class/section assignments
- Attendance tracking
- Behavioral notes
- Parent communication

**Teacher Tools:**
- Assignment creation
- Grading interfaces
- Analytics dashboards
- Resource libraries
- Lesson planning

**Administrative Features:**
- School/institution management
- Teacher scheduling
- Enrollment management
- Report generation
- Data analytics

### Example Prompts for Teacher App

**Initial Setup:**
```
Create a teacher management application with:

ROLES:
1. Admin (full access)
2. Teacher (manage their classes)
3. Student (view their data)
4. Parent (view child's data)

TEACHER FEATURES:
- Dashboard with class overview
- Create/manage assignments
- Grade student work
- Track attendance
- Generate progress reports
- Message parents

STUDENT FEATURES:
- View assignments
- Submit homework
- Check grades
- See attendance record
- Download reports

PARENT FEATURES:
- View child's grades
- See assignments
- Check attendance
- Message teachers
- Download report cards

Use Supabase for backend, implement role-based access control,
and make it mobile-responsive.
```

**Assignment System:**
```
Build an assignment management system:

FEATURES:
- Create assignment (title, description, due date, points, attachments)
- Assign to specific classes/students
- Accept file submissions (PDF, DOC, images)
- Grade with rubric (numeric + written feedback)
- Track submission status (not submitted, submitted, graded)
- Send reminders for missing work
- Calculate class average
- Export grades to CSV

UI:
- Teacher: List view with filters (class, date, status)
- Student: Card view showing upcoming and past assignments
- Use color coding: red (overdue), yellow (due soon), green (submitted)
```

**Progress Analytics:**
```
Add student progress analytics to the teacher dashboard:

CHARTS:
1. Class grade distribution (histogram)
2. Individual student trend (line chart over time)
3. Assignment completion rate (pie chart)
4. Subject performance comparison (bar chart)

FILTERS:
- Date range (this week, month, semester, year)
- Class/section
- Subject
- Individual student

Use a chart library like Recharts. Make charts interactive and responsive.
```

**Communication Portal:**
```
Create a messaging system for teacher-parent communication:

FEATURES:
- Send message to individual parent or broadcast to class
- Attach files (PDFs, images)
- Threading (reply to messages)
- Mark as read/unread
- Search/filter messages
- Email notifications (via Supabase Edge Function + Resend)

PRIVACY:
- Parents only see messages about their child
- Teachers see all messages for their classes
- Admins see all messages

Store in Supabase messages table with proper RLS.
```

### Design Best Practices for Education

**Teacher Interfaces:**
- Professional, clean design
- Quick access to common tasks
- Data-dense dashboards (tables, charts)
- Bulk actions (grade multiple assignments)
- Keyboard shortcuts for power users

**Student Interfaces:**
- Friendly, encouraging design
- Clear navigation
- Visual progress indicators
- Gamification elements (optional)
- Large touch targets for tablets

**Parent Interfaces:**
- Simple, straightforward
- Focus on key metrics (grades, attendance)
- Easy-to-understand visualizations
- Download/print options for reports

---

## 💰 Pricing & Plans (2025)

### Free Plan - $0/month

**Credits:**
- 5 daily credits (150/month maximum)
- Credits reset daily
- About 3-5 meaningful interactions per day

**Features:**
- ✅ Unlimited public projects
- ✅ One-click deployment
- ✅ GitHub synchronization
- ✅ Basic AI features
- ❌ Private projects (public only)
- ❌ Custom domains
- ❌ Credit rollovers
- ❌ Remove Lovable badge

**Best For:**
- Learning and experimentation
- Open-source projects
- Quick prototypes
- Testing Lovable capabilities

### Pro Plan - $25/month

**Credits:**
- 100 monthly credits
- +5 daily credits
- **Total: ~150 credits/month**
- Unused credits roll over

**Features:**
- ✅ Everything in Free
- ✅ **Private projects**
- ✅ **Custom domains**
- ✅ User roles & permissions
- ✅ Remove Lovable badge
- ✅ Credit rollover
- ✅ Priority support

**Best For:**
- Professional developers
- Client projects
- Production apps
- Small teams (1-3 people)

**Recommended for your teacher app** ✨

### Business Plan - $50/month

**Credits:**
- **200 monthly credits**
- +5 daily credits
- **Total: ~250 credits/month**
- Credit rollover

**Features:**
- ✅ Everything in Pro
- ✅ SSO (Single Sign-On)
- ✅ Personal projects workspace
- ✅ Opt-out of data training
- ✅ Design templates library
- ✅ Advanced collaboration

**Best For:**
- Teams (4-10 people)
- Agency work
- Multiple client projects
- Enterprise features needed

### Enterprise Plan - Custom Pricing

**Features:**
- Custom credit allocation
- Dedicated support
- SLA guarantees
- Advanced security requirements
- Custom integrations
- Training and onboarding

**Best For:**
- Large organizations
- Schools/universities
- Government agencies
- Strict compliance needs

### 2025 Bonus (Until Dec 2025)

**Every workspace gets:**
- $25 Cloud credits/month
- $1 AI credits/month
- **Even on Free plan!**

### Credit Usage Examples

| Action | Credits | Example |
|--------|---------|---------|
| Create initial app | 2.0 | "Build a teacher dashboard" |
| Add new page | 1.5 | "Create student profile page" |
| Modify component | 0.5-1.0 | "Change button color to blue" |
| Debug/fix bug | 0.5-1.5 | "Fix login error" |
| Add database table | 1.0 | "Create assignments table" |
| Visual Edit Tool | **0.0** | Color, font, text changes |
| Chat Mode (no code) | **0.0** | Discussion, planning |

**Tip:** Use Chat Mode and Visual Edit Tool extensively to conserve credits!

### Cost Estimate for Teacher App

**Development Phase (Month 1-2):**
- Pro Plan: $25/month
- 150 credits should cover:
  - Initial setup and authentication
  - 5-10 main pages
  - Database schema
  - Basic CRUD operations
  - Some debugging

**Maintenance Phase (Month 3+):**
- Free Plan might suffice (5 credits/day for small fixes)
- Or keep Pro for $25/month for ongoing features

**Recommended:** Start with Pro, evaluate after 2 months.

---

## ⚠️ Limitations & Constraints

### Credit Limits

**Free Plan Reality:**
- 5 daily credits disappear quickly (3-5 interactions)
- Can't build complex features in one day
- Need to plan prompts carefully
- Frustrating for active development

**Solution:** Upgrade to Pro ($25) for serious projects

### Code Quality Issues

**60-70% Solution:**
- Generated code works but isn't production-ready
- Data structures can be inflexible
- Logic sometimes tightly coupled
- Requires professional review for production

**Scalability Problems:**
- Hard to maintain as requirements change
- Refactoring can be difficult
- Architecture not optimized for scale

**Solution:**
- Use Lovable for MVP and prototypes
- Hire developer for production refinements
- Export to GitHub and continue in code editor

### AI Looping Problem

**Symptoms:**
- AI gets stuck trying to fix a bug
- Same solution attempted repeatedly
- Error persists across multiple attempts

**Cause:**
- AI loses context
- Misunderstands root cause
- Tries surface-level fixes

**Solution:**
1. Switch to Chat Mode
2. Request investigation without code changes
3. Provide screenshots and detailed error info
4. Revert to last working version
5. Try different approach/prompt
6. Use "Remix" feature for fresh start

### Complexity Limitations

**Struggles With:**
- Complex business logic
- Advanced algorithms
- Custom state management patterns
- Highly customized UI components
- Real-time collaboration (beyond basic)

**Works Well For:**
- CRUD applications
- Standard authentication flows
- Dashboard/admin panels
- Form-heavy applications
- Database-driven apps

**Solution:** Break complex features into smaller, simpler prompts

### Data Handling Issues

**Large Datasets:**
- Slow processing with 1000+ rows
- Import failures on big CSV uploads
- Performance degradation

**Workaround:**
- Import data directly via Supabase
- Use pagination and lazy loading
- Optimize queries (prompts for efficiency)

### Customization Constraints

**Generic Design Patterns:**
- UIs often look similar
- Limited custom styling control
- Some design requests ignored/misunderstood

**Solution:**
- Be very specific in design prompts
- Use Visual Edit Tool for tweaks
- Provide reference images/screenshots
- Export to GitHub for custom CSS

### Technical Requirements

**Still Needs:**
- Basic technical understanding
- Ability to debug in browser DevTools
- Understanding of databases and APIs
- Git/GitHub knowledge (helpful)

**Lacks:**
- Advanced debugging tools
- Comprehensive error logs
- Audit logs
- Role-based admin features

### Infrastructure Risks

**Dependency:**
- Tied to Lovable platform
- GitHub rate limiting (historical issue)
- Supabase free tier limits

**Mitigation:**
- Export projects regularly to GitHub
- Back up Supabase database
- Have migration plan if needed

### When NOT to Use Lovable

❌ **Don't use for:**
- Mission-critical enterprise systems
- Apps requiring 99.99% uptime
- Complex financial/medical applications
- Real-time multiplayer games
- Advanced AI/ML features
- Custom server infrastructure
- Microservices architecture

✅ **Perfect for:**
- MVPs and prototypes
- Internal tools
- Admin dashboards
- Educational platforms
- Small business apps
- Portfolio projects
- Testing product ideas

---

## 🚦 Getting Started Workflow

### Phase 1: Planning (Before Lovable)

**Step 1: Define Your App**
- [ ] Write user stories
- [ ] List all features (prioritize)
- [ ] Sketch wireframes (paper/Figma)
- [ ] Define user roles
- [ ] Plan database schema

**Step 2: Create Knowledge Base**
```markdown
# Teacher App Knowledge Base

## Vision
A teacher management platform for K-12 educators to manage students,
assignments, grades, and parent communication.

## User Roles
1. Admin (school administration)
2. Teacher (classroom management)
3. Student (view grades, submit work)
4. Parent (monitor child progress)

## Core Features (MVP)
1. Authentication (email + Google OAuth)
2. Teacher Dashboard
3. Student Management
4. Assignment Creation
5. Grade Book
6. Progress Reports

## Tech Stack
- Frontend: React + TypeScript + Tailwind + ShadCN
- Backend: Supabase (Auth, Database, Storage)
- Deployment: Lovable one-click

## Design Guidelines
- Colors: Blue (#3B82F6) and Green (#10B981)
- Font: Inter
- Mobile-first responsive
- Clean, professional UI

## Database Schema
[Include your detailed schema here]
```

### Phase 2: Setup (Day 1)

**Step 1: Create Accounts**
1. Sign up at https://lovable.dev
2. Sign up at https://supabase.com (free tier)
3. Create GitHub account (for backups)

**Step 2: Start New Project**
1. Create blank project in Lovable
2. Name it (e.g., "TeacherHub")
3. Upload Knowledge Base file

**Step 3: Connect Supabase**
1. Create Supabase project
2. Connect in Lovable (Settings → Integrations)

### Phase 3: Development (Week 1-2)

**Day 1-2: Authentication**
```
Create authentication system with:
1. Login page (email/password)
2. Signup page with role selection (teacher/student/parent)
3. Password reset functionality
4. Google OAuth button
5. Protected routes (redirect to login if not authenticated)

Use Supabase Auth. Make pages mobile-responsive with modern design.
```

**Day 3-4: Teacher Dashboard**
```
Build teacher dashboard with:

LAYOUT:
- Top navigation bar (logo, menu, profile dropdown)
- Stats cards row (total students, assignments, avg grade, attendance rate)
- Main content area with tabs:
  * Overview (recent activity feed)
  * Students (list with search/filter)
  * Assignments (upcoming and past)
  * Analytics (charts)

DATA:
Connect to Supabase tables. Fetch real data for logged-in teacher.
Show loading states and empty states.

DESIGN:
Use card components, clean spacing, blue/green color scheme.
Mobile: stack cards vertically, collapsible sidebar.
```

**Day 5-7: Student Management**
```
Create student management features:

1. Student list page:
   - Table view with columns: name, grade, email, status
   - Search bar (by name)
   - Filter dropdown (by grade level)
   - Add Student button
   - Click row to view details

2. Add/Edit Student modal:
   - Full name (required)
   - Email (required, unique)
   - Grade level (dropdown)
   - Parent email (optional)
   - Photo upload (optional, Supabase Storage)

3. Student detail page:
   - Profile card (photo, info)
   - Tabs: Assignments, Grades, Attendance, Notes
   - Edit button
   - Delete button (with confirmation)

DATABASE:
Create students table with RLS (teachers see only their students).
Link to teachers table via teacher_id foreign key.
```

**Week 2: Assignments & Grades**
```
Build assignment and grading system:

ASSIGNMENT CREATION:
- Title, description, due date, total points
- Attach files (PDF, images from Supabase Storage)
- Assign to specific students or entire class
- Save as draft or publish

STUDENT VIEW:
- List of assignments (filter: all, upcoming, overdue, completed)
- Card layout showing title, due date, points, status
- Upload submission button
- View feedback and grade (after grading)

GRADING INTERFACE:
- List of submissions for an assignment
- Click to view student work
- Enter numeric score (with validation)
- Add text feedback
- Mark as graded
- Calculate class average automatically

DATABASE:
- assignments table
- submissions table (student_id, assignment_id, file_url, submitted_at)
- grades table (score, feedback, graded_at)

Implement RLS for all tables.
```

### Phase 4: Testing & Iteration (Week 3)

**Testing Checklist:**
- [ ] Create test accounts (teacher, student, parent)
- [ ] Test all CRUD operations
- [ ] Check mobile responsiveness on real device
- [ ] Verify RLS policies (can't see other teachers' data)
- [ ] Test file uploads
- [ ] Check authentication edge cases (wrong password, etc.)
- [ ] Verify calculations (grade averages)
- [ ] Test with poor internet (loading states)

**Common Issues:**
```
ISSUE: Students can see other students' grades
FIX: "Update RLS policy on grades table so students only see
      their own grades (WHERE student_id = auth.uid())"

ISSUE: File upload fails
FIX: "Check Supabase Storage bucket permissions and increase
      max file size to 10MB"

ISSUE: Dashboard stats show wrong numbers
FIX: "Debug the database query for total students. Log the
      results and check filtering by teacher_id"
```

### Phase 5: Polish & Deploy (Week 4)

**Polish Prompts:**
```
Add loading skeletons to all pages that fetch data. Use shimmer
effect placeholders.

Add error boundaries to catch and display errors gracefully.

Improve empty states with helpful messages and call-to-action buttons.

Add toast notifications for success/error actions (create assignment,
save grade, etc.). Use Sonner library.

Optimize images and add lazy loading for better performance.

Add keyboard shortcuts for common actions (Cmd+K for search, Cmd+N
for new assignment).
```

**Deployment:**
```
1. Review all features
2. Pin current version as "v1.0"
3. Test in production mode
4. Click "Deploy" in Lovable
5. Get production URL
6. Share with beta testers
```

### Phase 6: Maintenance

**Weekly Tasks:**
- Review user feedback
- Fix critical bugs (use 5 daily free credits)
- Plan new features

**Monthly Review:**
- Analyze usage
- Optimize performance
- Update dependencies
- Backup database

---

## 🎯 Teacher App Implementation Strategy

### Recommended Approach for Your Project

**URL:** https://lovable.dev/@WtZ7fXulByM4rww263noitP5BEj2

### Step 1: Assess Current State

First, let's understand what exists:
```
Please provide a complete overview of the current project:
1. What pages/components exist?
2. Is Supabase connected? What tables are created?
3. What features are already implemented?
4. Are there any errors or issues?

Show me the project structure and current functionality.
```

### Step 2: Define MVP Scope

**Minimum Viable Product for Teacher App:**

**Week 1 Goals:**
- [x] Authentication (login/signup)
- [x] Teacher dashboard (basic)
- [ ] Student list (view only)
- [ ] Simple grade entry form

**Week 2 Goals:**
- [ ] Add/Edit students
- [ ] Create assignments
- [ ] Grade book view
- [ ] Basic analytics (class average)

**Week 3 Goals:**
- [ ] Parent portal (view-only)
- [ ] Progress reports (PDF export)
- [ ] File uploads (assignments)
- [ ] Attendance tracking

**Week 4 Goals:**
- [ ] Polish UI/UX
- [ ] Mobile optimization
- [ ] Testing and bug fixes
- [ ] Deploy and beta test

### Step 3: Critical First Prompts

**Prompt 1: Set Context**
```
I'm building a teacher management app for K-12 educators. Before we
continue, please review this overview and confirm your understanding:

PURPOSE:
Teachers manage students, create assignments, track grades, and
communicate with parents.

USER ROLES:
1. Admin (manage teachers)
2. Teacher (manage classes)
3. Student (view grades)
4. Parent (monitor child)

TECH STACK:
- React + TypeScript + Tailwind CSS + ShadCN
- Supabase (Auth, PostgreSQL, Storage)
- Mobile-first responsive design

DATABASE SCHEMA:
[Paste your schema here]

DESIGN:
- Professional, clean interface
- Colors: Primary Blue (#3B82F6), Success Green (#10B981)
- Font: Inter
- Card-based layouts

Please confirm you understand before we start building.
```

**Prompt 2: Build Foundation**
```
Let's start with the authentication system:

PAGES:
1. /login - Email/password login form
2. /signup - Registration with role selection
3. /forgot-password - Password reset

FEATURES:
- Supabase Auth integration
- Form validation (Zod schema)
- Error messages
- Success redirects
- "Remember me" option
- Google OAuth button

DESIGN:
- Centered card layout
- Responsive (mobile: full screen, desktop: centered card)
- Professional styling with primary blue color
- Loading states during auth

After login:
- Teacher → /dashboard
- Student → /student/dashboard
- Parent → /parent/dashboard
- Admin → /admin/dashboard

Create the login page first, then signup, then password reset.
```

### Step 4: Iterative Development Pattern

**Pattern to Follow:**

1️⃣ **Build Feature**
```
Create [feature] with [specific requirements].
Use [technology/library]. Make it [responsive/accessible].
```

2️⃣ **Connect to Database**
```
Connect [feature] to Supabase [table]. Fetch data for logged-in
user. Show loading/error/empty states.
```

3️⃣ **Test & Debug**
```
Chat Mode:
"Please analyze the [feature] for issues. Check:
- Database queries (RLS policies)
- Component state management
- Error handling
- UI responsiveness
Don't make changes yet—just report findings."
```

4️⃣ **Refine & Polish**
```
Improve [feature] UX:
- Add loading skeleton
- Better error messages
- Smooth transitions
- Keyboard shortcuts
```

5️⃣ **Repeat for Next Feature**

### Step 5: Database Strategy

**Recommended Schema:**

```sql
-- TEACHERS
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  subject TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can view own record" ON teachers
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Teachers can update own record" ON teachers
  FOR UPDATE USING (auth.uid() = user_id);

-- STUDENTS
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  grade_level INTEGER CHECK (grade_level BETWEEN 1 AND 12),
  parent_email TEXT,
  parent_phone TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers see own students" ON students
  FOR SELECT USING (
    teacher_id IN (
      SELECT id FROM teachers WHERE user_id = auth.uid()
    )
  );
CREATE POLICY "Teachers manage own students" ON students
  FOR ALL USING (
    teacher_id IN (
      SELECT id FROM teachers WHERE user_id = auth.uid()
    )
  );

-- ASSIGNMENTS
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  total_points INTEGER NOT NULL CHECK (total_points > 0),
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage own assignments" ON assignments
  FOR ALL USING (
    teacher_id IN (
      SELECT id FROM teachers WHERE user_id = auth.uid()
    )
  );

-- GRADES
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  score NUMERIC CHECK (score >= 0),
  feedback TEXT,
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  submission_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, assignment_id)
);

-- RLS Policies
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers see grades for their students" ON grades
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM students WHERE teacher_id IN (
        SELECT id FROM teachers WHERE user_id = auth.uid()
      )
    )
  );
CREATE POLICY "Teachers manage grades for their students" ON grades
  FOR ALL USING (
    student_id IN (
      SELECT id FROM students WHERE teacher_id IN (
        SELECT id FROM teachers WHERE user_id = auth.uid()
      )
    )
  );

-- ATTENDANCE
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- RLS Policies
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage attendance for their students" ON attendance
  FOR ALL USING (
    student_id IN (
      SELECT id FROM students WHERE teacher_id IN (
        SELECT id FROM teachers WHERE user_id = auth.uid()
      )
    )
  );
```

**Prompt for Schema:**
```
Create the following database schema in Supabase:
[Paste schema above]

After creating, verify:
1. All tables created successfully
2. RLS enabled on all tables
3. Foreign keys working
4. Check constraints valid

Show me confirmation of each table creation.
```

### Step 6: Key Features in Order

**Feature 1: Dashboard (Day 1-2)**
```
Create teacher dashboard at /dashboard:

HEADER:
- App logo/name
- Navigation menu (Dashboard, Students, Assignments, Grades, Reports)
- User profile dropdown (Settings, Logout)

STATS CARDS (4 across, stack on mobile):
1. Total Students (count from students table)
2. Active Assignments (count where due_date >= today)
3. Class Average (average of all grades.score)
4. Attendance Rate (present / total * 100)

RECENT ACTIVITY FEED:
- Last 10 actions (new student, graded assignment, etc.)
- Timestamp, icon, description
- "View All" link

QUICK ACTIONS:
- Add Student button
- Create Assignment button
- Take Attendance button
- Generate Report button

Fetch all data from Supabase for logged-in teacher.
Use loading skeletons while fetching.
Make fully responsive.
```

**Feature 2: Student Management (Day 3-5)**
```
Create student management at /students:

LAYOUT:
- Search bar (filter by name)
- Filter dropdown (grade level)
- "Add Student" button
- Table view (desktop) / Card view (mobile)

TABLE COLUMNS:
- Photo (thumbnail)
- Name (sortable)
- Grade Level
- Email
- Parent Contact
- Actions (View, Edit, Delete)

ADD STUDENT MODAL:
- Form fields: name, email, grade, parent_email, parent_phone
- Photo upload (Supabase Storage, max 2MB)
- Validation (required fields, email format)
- Cancel / Save buttons

STUDENT DETAIL PAGE (/students/:id):
- Profile card (photo, info, edit button)
- Tabs:
  * Assignments (list with status)
  * Grades (table with assignment, score, date)
  * Attendance (calendar view)
  * Notes (teacher notes, add new)

DATABASE:
Use students table. RLS ensures teacher sees only their students.
Handle photo upload to Supabase Storage bucket "student-photos".
```

**Feature 3: Assignment System (Day 6-8)**
```
Create assignment management at /assignments:

LIST VIEW:
- Tabs: All, Upcoming, Past Due, Graded
- Card layout showing:
  * Title
  * Due date (with color: red if overdue, yellow if soon, green if future)
  * Total points
  * Graded count / Total students
  * Edit/Delete actions

CREATE ASSIGNMENT (/assignments/new):
- Title (required)
- Description (rich text editor)
- Due date (date picker)
- Total points (number input)
- Attach file (optional, PDF/images, Supabase Storage)
- Assign to: All students OR select specific students
- Save as Draft / Publish button

GRADING VIEW (/assignments/:id/grade):
- Assignment details at top
- List of students with submission status
- Click student to open grading modal:
  * Student name
  * Submission (view file if uploaded)
  * Score input (0 to total_points)
  * Feedback textarea
  * Save Grade button
- Show progress: 5/25 graded
- Calculate and display class average

DATABASE:
- assignments table for assignment data
- grades table for scores/feedback
- Use Supabase Storage for attachments
```

**Feature 4: Grade Book (Day 9-10)**
```
Create grade book at /grades:

SPREADSHEET VIEW:
- Rows: Students
- Columns: Assignments (horizontal scroll)
- Cells: Scores (editable on click)
- Last column: Average grade

FEATURES:
- Sort by student name or average
- Filter by assignment
- Highlight low grades (< 70% in red)
- Click cell to edit score inline
- Auto-calculate averages
- Export to CSV button

STATISTICS PANEL:
- Class average
- Highest/lowest score
- Distribution chart (A: 5, B: 10, C: 8, D: 2, F: 0)

Make it responsive (on mobile, show one student at a time).
```

**Feature 5: Reports (Day 11-12)**
```
Create reporting at /reports:

REPORT TYPES:
1. Student Progress Report (individual)
2. Class Summary Report (all students)
3. Assignment Analysis (one assignment)

STUDENT PROGRESS REPORT:
- Select student dropdown
- Date range selector
- Generate button
- PDF preview/download
- Contents:
  * Student info
  * All grades in period
  * Average grade
  * Attendance percentage
  * Teacher comments section

CLASS SUMMARY REPORT:
- Shows all students
- Average grades
- Attendance rates
- Top performers
- Students needing help

Use a PDF generation library or Supabase Edge Function.
```

### Step 7: Quality Assurance Prompts

**Before Each Feature Complete:**
```
Review the [feature] for quality:

1. FUNCTIONALITY:
   - All CRUD operations working?
   - Data persisting to database?
   - RLS policies protecting data?

2. UI/UX:
   - Loading states for async operations?
   - Error messages clear and helpful?
   - Empty states with call-to-action?
   - Mobile responsive at all breakpoints?

3. ACCESSIBILITY:
   - Form labels present?
   - Keyboard navigation working?
   - Color contrast sufficient?
   - Screen reader friendly?

4. PERFORMANCE:
   - Queries optimized (only fetch needed data)?
   - Images lazy loaded?
   - No unnecessary re-renders?

Report findings. Don't make changes until I approve.
```

### Step 8: Pre-Launch Checklist

- [ ] All core features working
- [ ] Mobile tested on real device
- [ ] RLS tested (can't access other teachers' data)
- [ ] Error handling comprehensive
- [ ] Loading states on all async operations
- [ ] Forms have validation
- [ ] Success/error toast notifications
- [ ] User can recover from errors
- [ ] Data persists after refresh
- [ ] Authentication edge cases handled
- [ ] File uploads working (< 10MB)
- [ ] Calculations accurate (grades, averages)
- [ ] Export functions working (CSV, PDF)
- [ ] GitHub backup created
- [ ] Supabase database backed up

### Step 9: Beta Testing

**Week 4:**

1. Deploy to production
2. Create test accounts:
   - 2-3 teachers
   - 5-10 students per teacher
   - Sample assignments and grades
3. Share with 2-3 real teachers
4. Collect feedback
5. Prioritize fixes/improvements
6. Iterate

**Feedback Collection:**
```
Add a feedback form at /feedback:
- Rating (1-5 stars)
- What works well?
- What's confusing?
- Feature requests
- Bug reports

Store in Supabase feedback table.
Send email notification to admin (Edge Function + Resend).
```

### Step 10: Post-Launch Maintenance

**Daily:**
- Monitor for errors (check Supabase logs)
- Respond to user feedback
- Quick bug fixes (use free 5 credits)

**Weekly:**
- Review feature requests
- Plan next iteration
- Update documentation

**Monthly:**
- Database optimization
- Performance review
- Security audit
- Backup verification
- Usage analytics review

---

## 📚 Additional Resources

### Official Documentation
- **Lovable Docs:** https://docs.lovable.dev
- **Lovable Blog:** https://lovable.dev/blog
- **Supabase Docs:** https://supabase.com/docs
- **Supabase + Lovable Guide:** https://docs.lovable.dev/integrations/supabase

### Video Tutorials
- **Lovable Tutorials:** https://lovable.dev/videos/tutorial
- **Supabase Integration:** https://lovable.dev/videos/supabase

### Community
- **Lovable Discord:** [Ask for invite link]
- **Lovable Showcase:** https://lovable.dev/showcase
- **Made with Lovable:** https://madewithlovable.com

### Tools & Libraries

**UI Components:**
- ShadCN: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev

**Charts & Visualization:**
- Recharts: https://recharts.org
- Chart.js: https://www.chartjs.org

**Forms & Validation:**
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev

**Date & Time:**
- date-fns: https://date-fns.org
- Day.js: https://day.js.org

**PDF Generation:**
- jsPDF: https://github.com/parallax/jsPDF
- react-pdf: https://react-pdf.org

**Email (via Edge Functions):**
- Resend: https://resend.com

---

## 🎓 Key Takeaways

### For Your Teacher App

1. **Start Simple:** Build MVP in 2-4 weeks, iterate based on feedback
2. **Use Pro Plan:** $25/month is worth it for serious development
3. **Master Prompting:** Invest time in learning effective prompt patterns
4. **Leverage Supabase:** Built-in auth, database, storage saves weeks of work
5. **Chat Mode First:** Plan and debug before implementing (save credits)
6. **Test Continuously:** Small iterations, test each feature before moving on
7. **RLS is Critical:** Security through Row Level Security policies
8. **Mobile Matters:** Teachers use tablets, students use phones—test mobile
9. **Export Early:** Backup to GitHub regularly
10. **Know Limits:** Use Lovable for 70%, hire dev for production polish

### Success Formula

**Great Prompts + Supabase + Iteration + Testing = Successful App**

- Spend 30% time on prompts (clear, detailed, structured)
- Spend 40% time on development (building features)
- Spend 20% time on testing (real devices, edge cases)
- Spend 10% time on polish (UI/UX refinements)

### Final Advice

> "Lovable is a superpower for prototyping and MVPs. Use it to validate your
> idea quickly, get user feedback, and iterate. Don't expect perfection—
> expect 70% done fast, then refine."

**Your Next Steps:**
1. ✅ Review this research document
2. ✅ Sign up for Lovable Pro ($25/month)
3. ✅ Create Supabase account
4. ✅ Write your Knowledge Base
5. ✅ Plan your MVP features (first 2 weeks)
6. ✅ Start with authentication (Day 1)
7. ✅ Build dashboard (Day 2-3)
8. ✅ Iterate feature by feature
9. ✅ Test with real teachers
10. ✅ Launch and celebrate! 🎉

---

**Good luck building your teacher app!** 🚀📚

---

*Last Updated: January 2025*
*Document Version: 1.0*
*Author: Claude Code Research*

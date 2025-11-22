# Lovable Quick Reference Guide
**For Teacher App Development**

---

## 🚀 Quick Start Commands

### Best Prompts for Teacher App

**Start New Project:**
```
I need a teacher management app with React + TypeScript + Tailwind + Supabase.

FEATURES:
- Teacher dashboard with student overview
- Student management (CRUD)
- Assignment creation and grading
- Progress analytics
- Parent communication

ROLES: Admin, Teacher, Student, Parent

Start with authentication and teacher dashboard.
```

**Connect Supabase:**
```
Connect this project to Supabase. Create database schema for:
- teachers (id, user_id, name, email, subject)
- students (id, teacher_id, name, email, grade_level)
- assignments (id, teacher_id, title, due_date, points)
- grades (id, student_id, assignment_id, score, feedback)

Set up RLS so teachers only see their own data.
```

**Debug Errors:**
```
Switch to Chat Mode first, then:

"Please analyze the [component/feature] for issues. Check:
- Database queries and RLS policies
- Component state and props
- Error handling and validation
- UI responsiveness

Don't make changes yet—just report findings."
```

---

## 💡 Essential Prompt Patterns

### Pattern 1: Feature Creation
```
Create [feature name] with:

LAYOUT:
- [Describe UI structure]

FEATURES:
- [List functionality]

DATABASE:
- Connect to [table]
- Use RLS policy [description]

DESIGN:
- Mobile-responsive
- Use [color scheme]
```

### Pattern 2: Protecting Code
```
Please refrain from altering [pages/components].
Focus changes solely on [specific area].

This requires precision. Test systematically.
```

### Pattern 3: Mobile Optimization
```
Make this [feature] mobile-responsive:
- Mobile: [describe mobile layout]
- Tablet: [describe tablet layout]
- Desktop: [describe desktop layout]

Use Tailwind breakpoints (sm, md, lg, xl).
```

### Pattern 4: Database Operations
```
For [feature], add database operations:

CREATE: [What to insert]
READ: [What to fetch, with filters]
UPDATE: [What fields to modify]
DELETE: [What to remove, with confirmation]

Use Supabase. Add error handling and loading states.
```

---

## 📊 Pricing Quick Reference

| Plan | Price | Credits | Best For |
|------|-------|---------|----------|
| Free | $0 | 5/day | Testing, learning |
| Pro | $25 | 150/mo | **Your teacher app** ✨ |
| Business | $50 | 250/mo | Teams, agencies |
| Enterprise | Custom | Custom | Large orgs |

**Credit Usage:**
- Create page: 1.5-2 credits
- Modify component: 0.5-1 credit
- Debug: 0.5-1.5 credits
- Visual Edit: **0 credits** ✅
- Chat Mode: **0 credits** ✅

---

## 🎯 Development Phases

### Week 1: Foundation
- [ ] Day 1-2: Authentication (login/signup/reset)
- [ ] Day 3-4: Teacher dashboard (stats cards, navigation)
- [ ] Day 5-7: Student list (view, search, filter)

### Week 2: Core Features
- [ ] Day 8-10: Add/Edit students (with photos)
- [ ] Day 11-12: Assignment creation
- [ ] Day 13-14: Grade book basics

### Week 3: Advanced Features
- [ ] Day 15-16: Progress analytics (charts)
- [ ] Day 17-18: Parent portal
- [ ] Day 19-20: Reports (PDF export)
- [ ] Day 21: Attendance tracking

### Week 4: Polish & Launch
- [ ] Day 22-23: UI/UX polish
- [ ] Day 24-25: Mobile testing
- [ ] Day 26-27: Bug fixes
- [ ] Day 28: Deploy & beta test

---

## 🔧 Common Issues & Fixes

### Issue: AI Looping (Stuck on Bug)
**Fix:**
1. Switch to Chat Mode
2. "Investigate without making changes"
3. Provide screenshot of error
4. Revert to last working version
5. Try different approach

### Issue: RLS Not Working
**Fix:**
```
Debug RLS policies on [table]:
1. Show current policies
2. Verify user_id matches auth.uid()
3. Test with sample data
4. Fix policy and verify
```

### Issue: Slow Performance
**Fix:**
```
Optimize [feature] performance:
- Add pagination (20 items per page)
- Lazy load images
- Use React.memo on components
- Optimize database queries (select only needed columns)
```

### Issue: Mobile Layout Broken
**Fix:**
```
Fix mobile responsive issues on [page]:
- Use Tailwind mobile-first approach
- Stack cards vertically on sm breakpoint
- Collapsible sidebar
- Larger touch targets (min 44x44px)
```

---

## 📋 Pre-Launch Checklist

### Security ✅
- [ ] RLS enabled on all tables
- [ ] RLS policies tested (can't access other teachers' data)
- [ ] Passwords hashed (Supabase handles this)
- [ ] API keys in environment variables
- [ ] File upload validation (type, size)

### Functionality ✅
- [ ] Login/logout working
- [ ] All CRUD operations tested
- [ ] Calculations accurate (grade averages)
- [ ] File uploads successful
- [ ] Email notifications sent
- [ ] Data persists after refresh

### UI/UX ✅
- [ ] Loading states on all async operations
- [ ] Error messages clear and actionable
- [ ] Empty states with helpful guidance
- [ ] Forms have validation
- [ ] Success/error toast notifications
- [ ] Mobile tested on real device
- [ ] Keyboard navigation working

### Performance ✅
- [ ] Pages load in < 3 seconds
- [ ] Images optimized
- [ ] No console errors
- [ ] Database queries optimized
- [ ] Components memoized where needed

---

## 🎨 Design System

### Colors
```css
Primary: #3B82F6 (blue-500)
Secondary: #10B981 (green-500)
Background: #F9FAFB (gray-50)
Text: #111827 (gray-900)
Error: #EF4444 (red-500)
Warning: #F59E0B (amber-500)
Success: #10B981 (green-500)
```

### Typography
```
Headings: font-semibold
Body: font-normal
Small: text-sm
Base: text-base
Large: text-lg
XL: text-xl
2XL: text-2xl
```

### Spacing
```
Tight: space-y-2 (8px)
Normal: space-y-4 (16px)
Relaxed: space-y-6 (24px)
Loose: space-y-8 (32px)
```

---

## 🗄️ Database Schema (Copy-Paste)

```sql
-- TEACHERS
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  subject TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers view own" ON teachers
  FOR SELECT USING (auth.uid() = user_id);

-- STUDENTS
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  grade_level INTEGER CHECK (grade_level BETWEEN 1 AND 12),
  parent_email TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers see own students" ON students
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage own" ON assignments
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
  graded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, assignment_id)
);

ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage grades" ON grades
  FOR ALL USING (
    student_id IN (
      SELECT id FROM students WHERE teacher_id IN (
        SELECT id FROM teachers WHERE user_id = auth.uid()
      )
    )
  );
```

---

## 📞 Key Resources

**Official:**
- Lovable: https://lovable.dev
- Docs: https://docs.lovable.dev
- Supabase: https://supabase.com

**Learning:**
- Prompting Bible: https://lovable.dev/blog/2025-01-16-lovable-prompting-handbook
- Best Practices: https://docs.lovable.dev/tips-tricks/best-practice
- Video Tutorials: https://lovable.dev/videos/tutorial

**Support:**
- Discord: [Request invite]
- GitHub: Export and version control

---

## 💪 Success Tips

1. **Use Chat Mode 60-70% of time** (planning, debugging)
2. **Be explicit in prompts** (specific > vague)
3. **Test after each feature** (don't batch)
4. **Pin stable versions** (easy rollback)
5. **Backup to GitHub** (weekly)
6. **Use Visual Edit Tool** (saves credits)
7. **Start simple, iterate** (MVP first)
8. **Mobile test on real device** (not just browser)
9. **Document as you go** (Knowledge Base)
10. **Know when to stop** (70% is good, perfect is expensive)

---

## 🚨 Red Flags to Avoid

❌ Trying to build everything at once
❌ Vague prompts ("make it better")
❌ Skipping RLS setup
❌ Not testing mobile
❌ Ignoring error handling
❌ No loading states
❌ Hardcoding sensitive data
❌ Not backing up to GitHub
❌ Expecting 100% perfection
❌ Giving up after first bug

---

## ✅ Green Flags for Success

✅ Clear, detailed prompts
✅ Small, testable features
✅ RLS policies from start
✅ Mobile-first design
✅ Comprehensive error handling
✅ Loading/empty states everywhere
✅ Environment variables for secrets
✅ Regular GitHub backups
✅ 70% solution, then iterate
✅ Learn from errors, adjust prompts

---

**Your Project:** https://lovable.dev/@WtZ7fXulByM4rww263noitP5BEj2

**Next Step:** Open Lovable and start with authentication! 🚀

---

*Quick Reference v1.0 | Jan 2025*

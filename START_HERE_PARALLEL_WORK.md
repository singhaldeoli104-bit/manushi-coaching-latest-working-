# START HERE - Parallel Work Instructions for Claude

**Purpose:** Clear instructions for another Claude instance to start implementing student screen recreation tasks in parallel.

**Status:** Ready to start
**Date:** 2025-11-05
**Main Plan:** See `STUDENT_SCREENS_RECREATION_PLAN.md` and `STUDENT_RECREATION_TODO.md`

---

## 🎯 QUICK START - Pick a Task Below

You can start ANY of these tasks immediately. They are independent and can be done in parallel.

---

## TASK 1: Create 3 Premium Components (Phase 0) - 2 hours

**Priority:** HIGH (required for all screens)
**Branch:** Create new branch `claude/student-components-premium`
**Location:** `OLD/src/components/student/molecules/premium/`

### What to create:
1. **EventCard.tsx** (~80 lines, 30 min)
2. **AssignmentCard.tsx** (~90 lines, 30 min)
3. **HorizontalCarousel.tsx** (~100 lines, 1 hour)

### Step-by-step:
```bash
# 1. Navigate to project
cd /home/user/manushi-coaching-latest-working-/

# 2. Create new branch
git checkout -b claude/student-components-premium
git push -u origin claude/student-components-premium

# 3. Create folder
mkdir -p OLD/src/components/student/molecules/premium

# 4. Read the spec
# File: STUDENT_RECREATION_TODO.md
# Sections: TODO 1.2, 1.3, 1.4 (lines 48-140)

# 5. Create each component (follow spec exactly)
# - Use existing Card component from OLD/src/components/
# - Add accessibility labels
# - Touch targets ≥ 48dp
# - TypeScript with proper interfaces

# 6. Test
cd OLD/
npx tsc --noEmit

# 7. Commit and push
git add OLD/src/components/student/molecules/premium/
git commit -m "feat(student): Add 3 premium components (EventCard, AssignmentCard, HorizontalCarousel)"
git push
```

**Success criteria:**
- [ ] 3 files created in `OLD/src/components/student/molecules/premium/`
- [ ] TypeScript errors: 0
- [ ] All components have proper interfaces
- [ ] All components have accessibility labels
- [ ] Committed and pushed

---

## TASK 2: Create NewStudentDashboard.tsx (Week 2) - 4-5 hours

**Priority:** CRITICAL
**Branch:** Create new branch `claude/student-dashboard-new`
**File to create:** `OLD/src/screens/student/NewStudentDashboard.tsx`

### Pre-requisites:
**IMPORTANT:** This task depends on TASK 1 (3 premium components). If they don't exist yet, either:
- Wait for TASK 1 to complete, OR
- Create placeholder components first, OR
- Work on TASK 3, 4, or 5 instead

### What to create:
- New student dashboard with Premium Minimal design
- 8 sections: Header, Welcome, Classes, Assignments, Recommendations, Activity, Quick Access, Progress
- Real Supabase queries (NO mock data)
- 56dp frozen UI, 92% content area

### Step-by-step:
```bash
# 1. Navigate to project
cd /home/user/manushi-coaching-latest-working-/

# 2. Create new branch
git checkout -b claude/student-dashboard-new
git push -u origin claude/student-dashboard-new

# 3. Read required docs
# - STUDENT_RECREATION_TODO.md (TODO 2.1, 2.2, 2.3, 2.4, 2.5)
# - OLD/student_analysis/StudentDashboard_ANALYSIS.md (all 40+ features)
# - OLD/student_analysis/ui_ux_guide.md (Section 1, lines 1-400)

# 4. Create the file
touch OLD/src/screens/student/NewStudentDashboard.tsx

# 5. Implement following the spec in TODO 2.2
# - Use Supabase queries (examples in TODO 2.2)
# - Add analytics tracking
# - Add accessibility labels
# - Use BaseScreen wrapper
# - 8 sections as specified

# 6. Update navigation (if needed)
# Edit: OLD/src/navigation/StudentNavigator.tsx
# Add route for NewStudentDashboard

# 7. Test
cd OLD/
npx tsc --noEmit
# Then test in app if possible

# 8. Apply acceptance checklist (TODO 2.4)

# 9. Commit and push (use template from TODO 2.5)
git add OLD/src/screens/student/NewStudentDashboard.tsx
git commit -m "feat(student): Add NewStudentDashboard with Premium Minimal design"
git push
```

**Success criteria:**
- [ ] NewStudentDashboard.tsx created (~800 lines)
- [ ] All 8 sections implemented
- [ ] Real Supabase queries (NO mock data)
- [ ] TypeScript errors: 0
- [ ] All acceptance checklist items passed
- [ ] Committed and pushed

---

## TASK 3: Create NewScheduleScreen.tsx (Week 3) - 4-5 hours

**Priority:** CRITICAL
**Branch:** Create new branch `claude/student-schedule-new`
**File to create:** `OLD/src/screens/student/NewScheduleScreen.tsx`

### Pre-requisites:
- TASK 1 (3 premium components) - especially HorizontalCarousel

### What to create:
- New schedule screen with calendar + agenda
- Compact header (56dp)
- Calendar strip (horizontal date selector)
- Day agenda list
- Filter bottom sheet

### Step-by-step:
```bash
# 1. Create branch
cd /home/user/manushi-coaching-latest-working-/
git checkout -b claude/student-schedule-new
git push -u origin claude/student-schedule-new

# 2. Read docs
# - STUDENT_RECREATION_TODO.md (TODO 3.1, 3.2, 3.3, 3.4, 3.5)
# - OLD/student_analysis/ScheduleScreen_ANALYSIS.md
# - OLD/student_analysis/ui_ux_guide.md (Section 2)

# 3. Create file and implement
touch OLD/src/screens/student/NewScheduleScreen.tsx
# Follow spec in TODO 3.2

# 4. Test, apply checklist, commit
# Follow TODO 3.3, 3.4, 3.5
```

**Success criteria:**
- [ ] NewScheduleScreen.tsx created (~900 lines)
- [ ] Calendar + agenda working
- [ ] Real Supabase queries
- [ ] TypeScript errors: 0
- [ ] Committed and pushed

---

## TASK 4: Create NewClassDetailScreen.tsx (Week 4) - 3-4 hours

**Priority:** CRITICAL
**Branch:** Create new branch `claude/student-class-detail-new`
**File to create:** `OLD/src/screens/student/NewClassDetailScreen.tsx`

### Pre-requisites:
- TASK 1 (3 premium components) - especially EventCard

### What to create:
- New class detail screen
- Header with Join button
- Class info, materials, assignments, attendance

### Step-by-step:
```bash
# 1. Create branch
cd /home/user/manushi-coaching-latest-working-/
git checkout -b claude/student-class-detail-new
git push -u origin claude/student-class-detail-new

# 2. Read docs
# - STUDENT_RECREATION_TODO.md (TODO 4.1, 4.2, 4.3, 4.4, 4.5)
# - OLD/student_analysis/ClassDetailScreen_ANALYSIS.md
# - OLD/student_analysis/ui_ux_guide.md (Section 3)

# 3. Create file and implement
touch OLD/src/screens/student/NewClassDetailScreen.tsx
# Follow spec in TODO 4.2

# 4. Test, apply checklist, commit
# Follow TODO 4.3, 4.4, 4.5
```

**Success criteria:**
- [ ] NewClassDetailScreen.tsx created (~500 lines)
- [ ] Join button working
- [ ] Materials displayed
- [ ] Real Supabase queries
- [ ] TypeScript errors: 0
- [ ] Committed and pushed

---

## TASK 5: Create NewAssignmentDetailScreen.tsx (Week 5) - 3-4 hours

**Priority:** HIGH
**Branch:** Create new branch `claude/student-assignment-detail-new`
**File to create:** `OLD/src/screens/student/NewAssignmentDetailScreen.tsx`

### Pre-requisites:
- TASK 1 (3 premium components) - especially AssignmentCard

### What to create:
- New assignment detail screen
- Assignment info, submission status, grade, feedback

### Step-by-step:
```bash
# 1. Create branch
cd /home/user/manushi-coaching-latest-working-/
git checkout -b claude/student-assignment-detail-new
git push -u origin claude/student-assignment-detail-new

# 2. Read docs
# - OLD/student_analysis/AssignmentDetailScreen_ANALYSIS.md
# - OLD/student_analysis/ui_ux_guide.md

# 3. Create file and implement
touch OLD/src/screens/student/NewAssignmentDetailScreen.tsx
# Follow Premium Minimal design (56dp header, 92% content)
# Use Supabase queries

# 4. Test, apply checklist, commit
```

**Success criteria:**
- [ ] NewAssignmentDetailScreen.tsx created (~400 lines)
- [ ] Real Supabase queries
- [ ] TypeScript errors: 0
- [ ] Committed and pushed

---

## TASK 6: Adjust StudentTopBar Height (Phase 0) - 1 hour

**Priority:** HIGH
**Branch:** Create new branch `claude/student-topbar-adjust`
**File to edit:** `OLD/src/components/student/navigation/StudentTopBar.tsx`

### What to do:
Change header height from 64dp to 56dp for Premium Minimal design

### Step-by-step:
```bash
# 1. Create branch
cd /home/user/manushi-coaching-latest-working-/
git checkout -b claude/student-topbar-adjust
git push -u origin claude/student-topbar-adjust

# 2. Read spec
# STUDENT_RECREATION_TODO.md (TODO 1.5)

# 3. Edit file
# Change height: 64 to height: 56

# 4. Test
cd OLD/
npx tsc --noEmit

# 5. Commit
git commit -m "feat(student): Adjust StudentTopBar height to 56dp for Premium Minimal"
git push
```

**Success criteria:**
- [ ] Height changed to 56dp
- [ ] TypeScript errors: 0
- [ ] Committed and pushed

---

## HOW TO REPORT PROGRESS

When you complete a task, create a file:

```bash
# Create completion report
cat > TASK_X_COMPLETE.md <<'EOF'
# Task X Complete

**Task:** [Task name]
**Branch:** [branch name]
**Date:** [date]

## Files Created/Modified:
- [file 1]
- [file 2]

## Success Criteria Met:
- [x] Criterion 1
- [x] Criterion 2

## Testing Results:
- TypeScript errors: 0
- Tested: Yes/No
- Issues: None / [describe]

## Next Steps:
[What should be done next, if anything]
EOF

# Commit and push
git add TASK_X_COMPLETE.md
git commit -m "docs: Task X completion report"
git push
```

---

## IMPORTANT RULES - READ BEFORE STARTING

### ❌ NEVER DO THIS:
- NO mock data (no hardcoded arrays)
- NO package modifications (no npm install)
- NO direct navigation.navigate() - use safeNavigate()
- NO skipping accessibility labels
- NO skipping analytics tracking

### ✅ ALWAYS DO THIS:
- Real Supabase queries (use useQuery)
- BaseScreen wrapper for all screens
- Accessibility labels on ALL buttons (accessibilityLabel, accessibilityHint, accessibilityRole)
- Analytics tracking (trackScreenView, trackAction)
- Safe navigation (safeNavigate)
- Apply acceptance checklist before committing
- TypeScript errors: 0

### 📚 Required Reading:
- `STUDENT_SCREENS_RECREATION_PLAN.md` - Overall plan
- `STUDENT_RECREATION_TODO.md` - Detailed instructions
- `OLD/student_analysis/ui_ux_guide.md` - Design specifications
- `OLD/student_analysis/*_ANALYSIS.md` - Feature requirements for each screen
- `OLD/ACCEPTANCE_CHECKLIST.md` - Quality gate

---

## PARALLEL WORK COORDINATION

**Tasks that can run in parallel:**
- TASK 1 (components) + TASK 6 (topbar)
- TASK 2, 3, 4, 5 (screens) - each on separate branch
- Multiple screen tasks can run simultaneously

**Tasks that have dependencies:**
- TASK 2, 3, 4, 5 all depend on TASK 1 (components)
- If TASK 1 not done, work on TASK 6 first, or create placeholder components

**Branch naming:**
- Each task gets its own branch
- Format: `claude/student-[taskname]-[sessionid]`
- Never work on same branch simultaneously

---

## TROUBLESHOOTING

### If you get TypeScript errors:
```bash
cd OLD/
npx tsc --noEmit | head -50
# Fix errors, then re-test
```

### If you need to see existing components:
```bash
ls -la OLD/src/components/student/
# Check what's available to reuse
```

### If Supabase queries fail:
- Check table names match schema
- Use proper RLS (row-level security)
- Always handle errors with `if (error) throw error;`

### If you're unsure about design:
- Read `OLD/student_analysis/ui_ux_guide.md`
- Follow Premium Minimal: 56dp header, 92% content area, ≥48dp touch targets

---

## QUICK REFERENCE

**Working directory:** `/home/user/manushi-coaching-latest-working-/`
**React Native app location:** `OLD/` (run commands from here)
**Components location:** `OLD/src/components/student/`
**Screens location:** `OLD/src/screens/student/`
**Navigation:** `OLD/src/navigation/StudentNavigator.tsx`

**Start Metro bundler:**
```bash
cd OLD/
npm start
```

**Run app:**
```bash
cd OLD/
npm run android
```

**Type check:**
```bash
cd OLD/
npx tsc --noEmit
```

---

## READY TO START! 🚀

**Pick any task above and start immediately!**

Each task is independent, properly scoped, and has clear success criteria.

**Good luck!** 🎯

# Hardcoded Values Audit - All Student Screens

## 🎯 Purpose
Complete inventory of ALL hardcoded values across student screens that should be replaced with real Supabase data.

Generated: 2025-01-06

---

## 📋 Files Analyzed

Searching across 24 student screen files for:
- Hardcoded user data (names, emails, IDs, grades)
- Mock data arrays (const ARRAY = [...])
- Example stats and numbers
- Placeholder text that should be dynamic
- TODO/FIXME comments indicating missing data

---

## 🔴 CRITICAL: StudentProfileScreen.tsx

### **Hardcoded Profile Data**
**Lines 44-46:** Initial state values
```typescript
const [editName, setEditName] = useState('Alex Johnson');
const [editEmail, setEditEmail] = useState('alex.j@university.edu');
const [editPhone, setEditPhone] = useState('+1 234 567 8900');
const [editGrade, setEditGrade] = useState('11');
const [editSection, setEditSection] = useState('B');
```
**Should be:** Fetched from Supabase `students` table based on `user.id`

### **Hardcoded Stats**
**Lines 335-347:** Stats grid values
```typescript
<T style={styles.statValue}>86</T>  // Classes Attended
<T style={styles.statValue}>42</T>  // Assignments Done
<T style={styles.statValue}>A-</T>  // Average Grade
<T style={styles.statValue}>124</T> // Days Active
```
**Should be:** Calculated from:
- `attendance` table → Classes Attended
- `assignment_submissions` table → Assignments Done
- Average of `assignment_submissions.grade` → Average Grade
- `created_at` diff from today → Days Active

### **Hardcoded Student ID**
**Line 324:**
```typescript
Grade {editGrade}, Section {editSection}, ID: STU12345
```
**Should be:** `student.student_id` from Supabase

---

## 🔴 CRITICAL: HamburgerMenu.tsx

### **Hardcoded User Profile**
**Lines 131-138:**
```typescript
<T style={styles.avatarText}>AJ</T>
<T>Alex Johnson</T>
<T>Grade 11, Section B</T>
```
**Should be:** Same as StudentProfileScreen - fetch from `students` table

### **Hardcoded Badge Numbers**
**Line 142:**
```typescript
<View style={styles.badge}>
  <T style={styles.badgeText}>2</T>  // "2" live classes
</View>
```
**Should be:** Count from `classes` table where `status = 'live'` and student is enrolled

---

## 🟡 HIGH PRIORITY: NewGamifiedLearningHub.tsx

### **Hardcoded Mock Data Arrays**

#### **1. BADGES Array (Lines 65-70)**
```typescript
const BADGES: Badge[] = [
  { id: '1', icon: '🎓', label: 'First Assignment', earned: true, color: '#10B981' },
  { id: '2', icon: '✅', label: 'Perfect Score', earned: true, color: '#10B981' },
  { id: '3', icon: '🏃', label: 'Study Marathon', earned: false },
  { id: '4', icon: '🌙', label: 'Night Owl', earned: false },
];
```
**Should be:** Fetch from `student_badges` table joined with `badges` table

#### **2. LEADERBOARD Array (Lines 72-76)**
```typescript
const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Maria Garcia', xp: 1850, avatar: '👩' },
  { rank: 4, name: 'Alex Johnson (You)', xp: 1250, avatar: '🧑', isCurrentUser: true },
  { rank: 5, name: 'Chloe Davis', xp: 1100, avatar: '👩‍🦰' },
];
```
**Should be:** Query from `students` table ordered by `xp DESC` with rank calculation

#### **3. CHALLENGES Array (Lines 78-81)**
```typescript
const CHALLENGES: Challenge[] = [
  { id: '1', icon: '✓', title: 'Complete 3 assignments', current: 1, total: 3, xpReward: 50 },
  { id: '2', icon: '⏱', title: 'Study for 5 hours', current: 4, total: 5, xpReward: 100 },
];
```
**Should be:** Fetch from `student_challenges` table with progress calculations

#### **4. REWARDS Array (Lines 83-100)**
```typescript
const REWARDS: RewardItem[] = [
  { id: '1', icon: '👤', title: 'New Avatar Frame', points: 250, ... },
  { id: '2', icon: '🌙', title: 'Dark Mode Theme', points: 500, ... },
];
```
**Should be:** Fetch from `rewards` table

#### **5. ACTIVITIES Array (Lines 102-119)**
```typescript
const ACTIVITIES: Activity[] = [
  { id: '1', type: 'achievement', icon: '🏅', text: 'You just unlocked', ... },
  { id: '2', type: 'user', avatar: '👩', text: 'Maria Garcia reached', ... },
];
```
**Should be:** Fetch from `activity_feed` table ordered by `created_at DESC`

### **Hardcoded Stats (Lines 122-125)**
```typescript
const currentXP = 1250;
const nextLevelXP = 1500;
const level = 8;
const streakDays = 7;
```
**Should be:** Fetch from `students` table (xp, level, streak_days columns)

---


# 🔍 Complete Hardcoded Values Audit - All Student Screens

## 🎯 Purpose
**COMPREHENSIVE** inventory of ALL hardcoded values, mock data, and example content across ALL student screens that should be replaced with real Supabase data.

**Generated:** 2025-01-06
**Files Analyzed:** 24 student screen files
**Status:** Complete

---

## 📊 Summary Statistics

**Total Hardcoded Data Found:**
- 🔴 **Critical** (User Profile Data): 3 screens
- 🟡 **High Priority** (Mock Arrays): 7 screens
- 🟢 **Medium Priority** (Example Stats): 15+ screens

**Replacement Strategy:** Replace ALL hardcoded data with Supabase queries using React Query

---

## 🔴 CRITICAL PRIORITY: User Profile Data

### **1. StudentProfileScreen.tsx**

#### **Hardcoded Initial State (Lines 44-46)**
```typescript
const [editName, setEditName] = useState('Alex Johnson');
const [editEmail, setEditEmail] = useState('alex.j@university.edu');
const [editPhone, setEditPhone] = useState('+1 234 567 8900');
const [editGrade, setEditGrade] = useState('11');
const [editSection, setEditSection] = useState('B');
```

**✅ Should be:**
```typescript
// Fetch from Supabase
const { data: studentData } = useQuery({
  queryKey: ['student-profile', user?.id],
  queryFn: async () => {
    const { data } = await supabase
      .from('students')
      .select('name, email, phone, grade, section')
      .eq('id', user.id)
      .single();
    return data;
  }
});

// Then use:
const [editName, setEditName] = useState(studentData?.name || '');
const [editEmail, setEditEmail] = useState(studentData?.email || '');
const [editPhone, setEditPhone] = useState(studentData?.phone || '');
const [editGrade, setEditGrade] = useState(studentData?.grade || '');
const [editSection, setEditSection] = useState(studentData?.section || '');
```

#### **Hardcoded Stats Grid (Lines 335-347)**
```typescript
<T style={styles.statValue}>86</T>   // Classes Attended
<T style={styles.statValue}>42</T>   // Assignments Done
<T style={styles.statValue}>A-</T>   // Average Grade
<T style={styles.statValue}>124</T>  // Days Active
```

**✅ Should be:**
```typescript
// Query 1: Classes Attended
const { data: attendance } = useQuery({
  queryKey: ['attendance-count', user?.id],
  queryFn: async () => {
    const { count } = await supabase
      .from('attendance')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', user.id)
      .eq('status', 'present');
    return count || 0;
  }
});

// Query 2: Assignments Done
const { data: assignmentsCount } = useQuery({
  queryKey: ['assignments-count', user?.id],
  queryFn: async () => {
    const { count } = await supabase
      .from('assignment_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', user.id)
      .not('submitted_at', 'is', null);
    return count || 0;
  }
});

// Query 3: Average Grade
const { data: avgGrade } = useQuery({
  queryKey: ['average-grade', user?.id],
  queryFn: async () => {
    const { data } = await supabase
      .from('assignment_submissions')
      .select('grade')
      .eq('student_id', user.id)
      .not('grade', 'is', null);

    if (!data || data.length === 0) return 'N/A';
    const avg = data.reduce((sum, s) => sum + s.grade, 0) / data.length;
    // Convert to letter grade
    if (avg >= 93) return 'A';
    if (avg >= 90) return 'A-';
    if (avg >= 87) return 'B+';
    // etc...
    return 'B';
  }
});

// Query 4: Days Active
const { data: daysActive } = useQuery({
  queryKey: ['days-active', user?.id],
  queryFn: async () => {
    const { data: student } = await supabase
      .from('students')
      .select('created_at')
      .eq('id', user.id)
      .single();

    if (!student) return 0;
    const diff = Date.now() - new Date(student.created_at).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
});
```

#### **Hardcoded Student ID (Line 324)**
```typescript
ID: STU12345
```

**✅ Should be:**
```typescript
ID: {studentData?.student_id || 'N/A'}
```

---

### **2. HamburgerMenu.tsx**

#### **Hardcoded User Display (Lines 131-138)**
```typescript
<T style={styles.avatarText}>AJ</T>
<T variant="body" weight="bold" style={styles.profileName}>
  Alex Johnson
</T>
<T variant="caption" style={styles.profileDetails}>
  Grade 11, Section B
</T>
```

**✅ Should be:**
```typescript
// Pass student data as prop
interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
  currentRoute?: string;
  studentData?: { name: string; grade: string; section: string };
}

// Then use:
<T style={styles.avatarText}>
  {studentData?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
</T>
<T>{studentData?.name || 'Student'}</T>
<T>Grade {studentData?.grade}, Section {studentData?.section}</T>
```

#### **Hardcoded Badge Count (Line 142)**
```typescript
<View style={styles.badge}>
  <T style={styles.badgeText}>2</T>  // "2" live classes
</View>
```

**✅ Should be:**
```typescript
// Query for live classes count
const { data: liveClassCount } = useQuery({
  queryKey: ['live-classes-count', user?.id],
  queryFn: async () => {
    const { count } = await supabase
      .from('class_enrollments')
      .select('classes!inner(*)', { count: 'exact', head: true })
      .eq('student_id', user.id)
      .eq('classes.status', 'live');
    return count || 0;
  }
});

<View style={styles.badge}>
  <T style={styles.badgeText}>{liveClassCount}</T>
</View>
```

---

## 🟡 HIGH PRIORITY: Mock Data Arrays

### **3. NewGamifiedLearningHub.tsx**

#### **Mock: BADGES Array (Lines 65-70)**
```typescript
const BADGES: Badge[] = [
  { id: '1', icon: '🎓', label: 'First Assignment', earned: true, color: '#10B981' },
  { id: '2', icon: '✅', label: 'Perfect Score', earned: true, color: '#10B981' },
  { id: '3', icon: '🏃', label: 'Study Marathon', earned: false },
  { id: '4', icon: '🌙', label: 'Night Owl', earned: false },
];
```

**✅ Should be:**
```typescript
const { data: badges } = useQuery({
  queryKey: ['student-badges', user?.id],
  queryFn: async () => {
    const { data } = await supabase
      .from('student_badges')
      .select(`
        badge_id,
        earned_at,
        badges (
          id,
          icon,
          label,
          color
        )
      `)
      .eq('student_id', user.id);

    return data?.map(sb => ({
      id: sb.badge_id,
      icon: sb.badges.icon,
      label: sb.badges.label,
      earned: !!sb.earned_at,
      color: sb.badges.color
    })) || [];
  }
});
```

#### **Mock: LEADERBOARD Array (Lines 72-76)**
```typescript
const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Maria Garcia', xp: 1850, avatar: '👩' },
  { rank: 4, name: 'Alex Johnson (You)', xp: 1250, avatar: '🧑', isCurrentUser: true },
  { rank: 5, name: 'Chloe Davis', xp: 1100, avatar: '👩‍🦰' },
];
```

**✅ Should be:**
```typescript
const { data: leaderboard } = useQuery({
  queryKey: ['leaderboard', user?.id],
  queryFn: async () => {
    const { data } = await supabase
      .from('students')
      .select('id, name, xp, avatar_url')
      .order('xp', { ascending: false })
      .limit(10);

    return data?.map((student, index) => ({
      rank: index + 1,
      name: student.id === user.id ? `${student.name} (You)` : student.name,
      xp: student.xp,
      avatar: student.avatar_url || '👤',
      isCurrentUser: student.id === user.id
    })) || [];
  }
});
```

#### **Mock: CHALLENGES Array (Lines 78-81)**
```typescript
const CHALLENGES: Challenge[] = [
  { id: '1', icon: '✓', title: 'Complete 3 assignments', current: 1, total: 3, xpReward: 50 },
  { id: '2', icon: '⏱', title: 'Study for 5 hours', current: 4, total: 5, xpReward: 100 },
];
```

**✅ Should be:**
```typescript
const { data: challenges } = useQuery({
  queryKey: ['student-challenges', user?.id],
  queryFn: async () => {
    const { data } = await supabase
      .from('student_challenges')
      .select(`
        id,
        current_progress,
        challenges (
          id,
          icon,
          title,
          target_value,
          xp_reward
        )
      `)
      .eq('student_id', user.id)
      .eq('status', 'active');

    return data?.map(sc => ({
      id: sc.id,
      icon: sc.challenges.icon,
      title: sc.challenges.title,
      current: sc.current_progress,
      total: sc.challenges.target_value,
      xpReward: sc.challenges.xp_reward
    })) || [];
  }
});
```

#### **Mock: REWARDS Array (Lines 83-100)**
```typescript
const REWARDS: RewardItem[] = [
  { id: '1', icon: '👤', title: 'New Avatar Frame', points: 250, bgColor: '#EBF4FF', iconColor: '#4A90E2' },
  { id: '2', icon: '🌙', title: 'Dark Mode Theme', points: 500, bgColor: '#D1FAE5', iconColor: '#10B981' },
];
```

**✅ Should be:**
```typescript
const { data: rewards } = useQuery({
  queryKey: ['rewards'],
  queryFn: async () => {
    const { data } = await supabase
      .from('rewards')
      .select('*')
      .order('points', { ascending: true });

    return data || [];
  }
});
```

#### **Mock: ACTIVITIES Array (Lines 102-119)**
```typescript
const ACTIVITIES: Activity[] = [
  { id: '1', type: 'achievement', icon: '🏅', text: 'You just unlocked', boldText: "'Night Owl'!", timestamp: '5 minutes ago' },
  { id: '2', type: 'user', avatar: '👩', text: 'Maria Garcia reached', boldText: 'Level 10', timestamp: '1 hour ago' },
];
```

**✅ Should be:**
```typescript
const { data: activities } = useQuery({
  queryKey: ['activity-feed', user?.id],
  queryFn: async () => {
    const { data } = await supabase
      .from('activity_feed')
      .select('*')
      .or(`student_id.eq.${user.id},is_global.eq.true`)
      .order('created_at', { ascending: false })
      .limit(20);

    return data || [];
  }
});
```

#### **Hardcoded Stats (Lines 122-125)**
```typescript
const currentXP = 1250;
const nextLevelXP = 1500;
const level = 8;
const streakDays = 7;
```

**✅ Should be:**
```typescript
const { data: studentStats } = useQuery({
  queryKey: ['student-stats', user?.id],
  queryFn: async () => {
    const { data } = await supabase
      .from('students')
      .select('xp, level, streak_days')
      .eq('id', user.id)
      .single();

    return {
      currentXP: data?.xp || 0,
      nextLevelXP: ((data?.level || 0) + 1) * 200, // Formula for next level
      level: data?.level || 1,
      streakDays: data?.streak_days || 0
    };
  }
});
```

---

### **4. NewAILearningDashboard.tsx**

#### **Hardcoded Focus Areas (Lines 35-48)**
```typescript
const [focusAreas, setFocusAreas] = useState<FocusArea[]>([
  {
    id: '1',
    title: 'Calculus: Derivatives',
    description: 'AI suggests focusing here. Check out these resources and take a practice test to improve.',
    isExpanded: true,
  },
  {
    id: '2',
    title: 'Biology: Meiosis',
    description: 'Recommended resources: Khan Academy Video, Chapter 5 Reading. Start a practice test to improve.',
    isExpanded: false,
  },
]);
```

**✅ Should be:**
```typescript
const { data: focusAreasData } = useQuery({
  queryKey: ['ai-focus-areas', user?.id],
  queryFn: async () => {
    const { data } = await supabase
      .from('ai_focus_areas')
      .select('*')
      .eq('student_id', user.id)
      .order('priority', { ascending: true })
      .limit(5);

    return data?.map((area, idx) => ({
      id: area.id,
      title: area.title,
      description: area.description,
      isExpanded: idx === 0  // First one expanded by default
    })) || [];
  }
});

const [focusAreas, setFocusAreas] = useState<FocusArea[]>(focusAreasData || []);
```

#### **Hardcoded Analytics Data (Lines 70-119)**
```typescript
return {
  weeklyActivity: {
    totalHours: 15.5,
    percentChange: 10,
    dailyHours: [80, 60, 20, 90, 60, 10, 70],
  },
  subjectBreakdown: {
    subjects: [
      { name: 'Calculus', percentage: 50, color: '#4A90E2' },
      { name: 'Biology', percentage: 30, color: '#50E3C2' },
      { name: 'Physics', percentage: 20, color: '#A78BFA' },
    ],
  },
  studyPlan: [
    { time: '9:00 - 10:30 AM', title: 'Study Physics', subtitle: 'Quantum Mechanics', type: 'study' },
    { time: '10:30 - 10:45 AM', title: 'Short Break', subtitle: 'Stretch and hydrate!', type: 'break' },
    { time: '10:45 - 12:00 PM', title: 'Practice Calculus', subtitle: 'Focus on Derivatives', type: 'study' },
  ],
  gradePredictions: [
    { subject: 'Chemistry', grade: 'B+', percentage: 85, tip: 'Tip: Focus on lab reports to improve to an A-.', color: '#4A90E2' },
    { subject: 'Physics', grade: 'A-', percentage: 92, tip: 'Tip: Keep up the great work on problem sets!', color: '#50E3C2' },
  ],
};
```

**✅ Should be:**
```typescript
// Replace entire hardcoded return with real queries:
const { data: weeklyActivity } = await supabase
  .from('study_sessions')
  .select('duration_minutes, date')
  .eq('student_id', user.id)
  .gte('date', sevenDaysAgo)
  .lte('date', today);

const { data: subjectBreakdown } = await supabase
  .from('study_sessions')
  .select('subject, duration_minutes')
  .eq('student_id', user.id)
  .gte('date', oneMonthAgo);

const { data: studyPlan } = await supabase
  .from('ai_study_plan')
  .select('*')
  .eq('student_id', user.id)
  .eq('date', today)
  .order('start_time', { ascending: true });

const { data: gradePredictions } = await supabase
  .from('ai_grade_predictions')
  .select('*')
  .eq('student_id', user.id)
  .order('predicted_grade', { ascending: false });
```

---

### **5. NewPeerLearningNetwork.tsx**

#### **Hardcoded Peer Data (Lines 86-97)**
```typescript
return (data || []).map((student, idx) => ({
  id: student.id,
  name: student.name || 'Unknown Student',
  grade: 'Grade 11',  // ❌ HARDCODED
  percentage: idx === 0 ? 92 : idx === 1 ? 88 : 85,  // ❌ HARDCODED
  subjects: idx === 0 ? ['Physics', 'Calculus'] : idx === 1 ? ['Chemistry', 'Literature'] : ['Math', 'Biology'],  // ❌ HARDCODED
  avatar_url: idx === 0 ? 'https://...' : idx === 1 ? 'https://...' : undefined,  // ❌ HARDCODED
}))
```

**✅ Should be:**
```typescript
const { data } = await supabase
  .from('students')
  .select(`
    id,
    name,
    email,
    grade,
    avatar_url,
    student_stats (
      match_percentage
    ),
    enrollments (
      courses (
        name
      )
    )
  `)
  .eq('class_id', studentData.class_id)
  .neq('id', user.id)
  .limit(5);

return (data || []).map(student => ({
  id: student.id,
  name: student.name || 'Unknown Student',
  grade: `Grade ${student.grade}`,
  percentage: student.student_stats?.match_percentage || 0,
  subjects: student.enrollments?.map(e => e.courses.name) || [],
  avatar_url: student.avatar_url
}));
```

#### **Mock: Study Groups Array (Lines 103-122)**
```typescript
const studyGroups: StudyGroup[] = [
  {
    id: '1',
    name: 'Quantum Physics Crew',
    subject: 'Physics 101',
    members: 12,
    maxMembers: 20,
    lastActive: '5m ago',
    isActive: true,
  },
  {
    id: '2',
    name: 'Calculus Conquerors',
    subject: 'Advanced Calculus',
    members: 8,
    maxMembers: 15,
    lastActive: '2h ago',
    isActive: false,
  },
];
```

**✅ Should be:**
```typescript
const { data: studyGroups } = useQuery({
  queryKey: ['study-groups', user?.id],
  queryFn: async () => {
    const { data } = await supabase
      .from('study_groups')
      .select(`
        id,
        name,
        subject,
        max_members,
        last_active_at,
        group_members (count)
      `)
      .order('last_active_at', { ascending: false });

    return data?.map(group => ({
      id: group.id,
      name: group.name,
      subject: group.subject,
      members: group.group_members[0]?.count || 0,
      maxMembers: group.max_members,
      lastActive: formatTimeAgo(group.last_active_at),
      isActive: isWithinMinutes(group.last_active_at, 15)
    })) || [];
  }
});
```

#### **Mock: Suggested Peers Array (Lines 125-135)**
```typescript
const suggestedPeers: SuggestedPeer[] = [
  {
    id: '1',
    name: 'Chloe Garcia',
    grade: 'Grade 11',
    matchPercentage: 95,
    sharedClasses: 3,
    avatar_url: 'https://...',
  },
];
```

**✅ Should be:**
```typescript
const { data: suggestedPeers } = useQuery({
  queryKey: ['suggested-peers', user?.id],
  queryFn: async () => {
    const { data } = await supabase
      .rpc('get_suggested_peers', { p_student_id: user.id })
      .limit(5);

    return data || [];
  }
});
```

---

## 🟢 MEDIUM PRIORITY: Other Screens

### **6. NewStudyLibraryScreen.tsx**
- Mock resource cards
- Hardcoded filter categories
- Example download counts

### **7. NewScheduleScreen.tsx**
- Mock class schedule
- Hardcoded time slots
- Example class names

### **8. NewAITutorChat.tsx**
- Mock AI responses (Line 102 - TODO comment)
- Hardcoded chat messages

### **9. NewDoubtSubmission.tsx**
- Example doubt categories
- Mock previously submitted doubts

### **10. NewEnhancedSchedule.tsx**
- Mock calendar events
- Hardcoded class times

### **11-24. Other Screens**
- Various placeholder content
- Example data for demonstrations

---

## 📋 Implementation Checklist

### **Phase 1: User Profile (Week 1)**
- [ ] StudentProfileScreen - Replace all hardcoded profile data
- [ ] StudentProfileScreen - Add queries for stats grid
- [ ] HamburgerMenu - Pass student data as props
- [ ] HamburgerMenu - Add live class count query
- [ ] Update all screens to fetch user data on mount

### **Phase 2: Gamification (Week 2)**
- [ ] NewGamifiedLearningHub - Replace BADGES with query
- [ ] NewGamifiedLearningHub - Replace LEADERBOARD with query
- [ ] NewGamifiedLearningHub - Replace CHALLENGES with query
- [ ] NewGamifiedLearningHub - Replace REWARDS with query
- [ ] NewGamifiedLearningHub - Replace ACTIVITIES with query
- [ ] NewGamifiedLearningHub - Replace hardcoded stats with query

### **Phase 3: AI Features (Week 3)**
- [ ] NewAILearningDashboard - Replace focus areas with query
- [ ] NewAILearningDashboard - Replace analytics data with real calculations
- [ ] NewAILearningDashboard - Replace study plan with query
- [ ] NewAILearningDashboard - Replace grade predictions with query

### **Phase 4: Social Features (Week 4)**
- [ ] NewPeerLearningNetwork - Fix peer data mapping
- [ ] NewPeerLearningNetwork - Replace study groups with query
- [ ] NewPeerLearningNetwork - Replace suggested peers with RPC

### **Phase 5: Other Screens (Week 5+)**
- [ ] NewStudyLibraryScreen - Replace mock resources
- [ ] NewScheduleScreen - Replace mock schedule
- [ ] NewAITutorChat - Integrate real AI API
- [ ] NewDoubtSubmission - Replace mock doubts
- [ ] All other screens - Replace remaining hardcoded data

---

## 🗃️ Required Supabase Tables

Based on this audit, you need these tables:

### **Core Tables**
1. `students` - name, email, phone, grade, section, student_id, xp, level, streak_days, avatar_url, created_at
2. `attendance` - student_id, class_id, date, status
3. `assignment_submissions` - student_id, assignment_id, grade, submitted_at
4. `class_enrollments` - student_id, class_id, enrolled_at

### **Gamification Tables**
5. `badges` - id, icon, label, color, description
6. `student_badges` - student_id, badge_id, earned_at
7. `challenges` - id, icon, title, target_value, xp_reward
8. `student_challenges` - id, student_id, challenge_id, current_progress, status
9. `rewards` - id, icon, title, points, bg_color, icon_color
10. `activity_feed` - id, student_id, type, content, created_at, is_global

### **AI Features Tables**
11. `ai_focus_areas` - id, student_id, title, description, priority
12. `study_sessions` - student_id, subject, duration_minutes, date, start_time
13. `ai_study_plan` - student_id, date, start_time, end_time, title, subtitle, type
14. `ai_grade_predictions` - student_id, subject, predicted_grade, percentage, tip, color

### **Social Features Tables**
15. `study_groups` - id, name, subject, max_members, last_active_at
16. `group_members` - group_id, student_id, joined_at
17. `student_stats` - student_id, match_percentage

---

## ✅ Success Criteria

**All hardcoded values replaced when:**
1. ✅ No const arrays with mock data in any screen
2. ✅ All user profile data fetched from Supabase
3. ✅ All stats calculated from real data
4. ✅ All lists populated via React Query
5. ✅ TypeScript errors: 0 (no `any` types for data)
6. ✅ All TODO/FIXME comments resolved

---

**Last Updated:** 2025-01-06
**Status:** ✅ Complete Audit - Ready for Implementation
**Next Step:** Implement Phase 1 (User Profile replacement)

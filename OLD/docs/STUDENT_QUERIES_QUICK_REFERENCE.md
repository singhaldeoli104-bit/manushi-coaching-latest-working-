# Student Screens - Quick Query Reference

Quick copy-paste queries for each of the 27 student screens.

**Test Student ID:** `96055c84-a9ee-496d-8360-6b7cea64b928`
**Test Batch ID:** `57ab5ec8-fac5-49f9-b64c-38e4b526ef84`

---

## HOME TAB

### 1. NewStudentDashboard - Summary Stats

```typescript
// Query dashboard summary
const { data: summary } = await supabase.rpc('get_dashboard_summary', {
  p_student_id: studentId
});

// Or manual query:
const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

// Get student's batch
const { data: student } = await supabase
  .from('students')
  .select('batch_id, attendance_percentage')
  .eq('id', studentId)
  .single();

// Today's classes
const { data: classes } = await supabase
  .from('class_sessions')
  .select('*')
  .eq('batch_id', student.batch_id)
  .gte('start_time', today.toISOString())
  .lt('start_time', tomorrow.toISOString());

// Pending assignments
const { data: assignments } = await supabase
  .from('assignments')
  .select('*')
  .eq('class_id', student.batch_id)
  .eq('status', 'published')
  .gte('due_date', today.toISOString());
```

### 2. NewActivityDetail - Activity with Comments

```typescript
const { data: activity } = await supabase
  .from('student_activities')
  .select(`
    *,
    comments:activity_comments(*),
    attachments:activity_attachments(*)
  `)
  .eq('id', activityId)
  .single();

// Get reactions count
const { data: reactions } = await supabase
  .from('activity_reactions')
  .select('emoji')
  .eq('activity_id', activityId);

const reactionCounts = reactions.reduce((acc, r) => {
  acc[r.emoji] = (acc[r.emoji] || 0) + 1;
  return acc;
}, {});
```

### 3. NewSimpleDoubt - Submit Doubt

```typescript
const { data: doubt } = await supabase
  .from('doubts')
  .insert({
    student_id: studentId,
    subject_code: 'MATH',
    title: doubtTitle,
    description: doubtDescription,
    priority: 'medium',
    status: 'pending'
  })
  .select()
  .single();
```

### 4. NewDoubtSubmission - Doubt with Attachments

```typescript
// Insert doubt
const { data: doubt } = await supabase
  .from('doubts')
  .insert({
    student_id: studentId,
    subject_code: subject,
    title: title,
    description: description,
    category: category,
    tags: tags,
    priority: 'high'
  })
  .select()
  .single();

// Insert attachments
const { data: attachments } = await supabase
  .from('doubt_attachments')
  .insert(
    files.map(file => ({
      doubt_id: doubt.id,
      file_name: file.name,
      file_type: file.type,
      file_url: file.url,
      file_size: file.size
    }))
  );
```

### 5. NewAILearningDashboard - AI Insights

```typescript
const { data: insights } = await supabase
  .from('ai_insights')
  .select('*')
  .eq('student_id', studentId)
  .eq('insight_type', 'performance')
  .order('priority', { ascending: false })
  .limit(5);

const { data: recommendations } = await supabase
  .from('ai_insights')
  .select('*')
  .eq('student_id', studentId)
  .eq('insight_type', 'recommendation')
  .order('priority', { ascending: false })
  .limit(5);
```

---

## CLASSES TAB

### 6. NewScheduleScreen - Today's Schedule

```typescript
const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const { data: student } = await supabase
  .from('students')
  .select('batch_id')
  .eq('id', studentId)
  .single();

const { data: todayClasses } = await supabase
  .from('class_sessions')
  .select('*, teacher:teachers(name)')
  .eq('batch_id', student.batch_id)
  .gte('start_time', today.toISOString())
  .lt('start_time', tomorrow.toISOString())
  .order('start_time', { ascending: true });
```

### 7. NewEnhancedSchedule - Calendar View

```typescript
// Get all events for a month
const { data: events } = await supabase
  .from('calendar_events')
  .select('*')
  .eq('batch_id', batchId)
  .gte('event_date', `${year}-${month}-01`)
  .lte('event_date', `${year}-${month}-31`)
  .order('event_date');

// Get student reminders
const { data: reminders } = await supabase
  .from('student_reminders')
  .select('*')
  .eq('student_id', studentId)
  .eq('is_enabled', true)
  .gte('reminder_time', new Date().toISOString())
  .order('reminder_time');
```

### 8. NewClassDetailScreen - Class Details

```typescript
const { data: classSession } = await supabase
  .from('class_sessions')
  .select(`
    *,
    teacher:teachers(name, email),
    materials:study_materials(*)
  `)
  .eq('id', classId)
  .single();

// Get class notes
const { data: notes } = await supabase
  .from('class_notes')
  .select('*')
  .eq('session_id', classId)
  .eq('student_id', studentId);
```

### 9. NewLiveClassScreen - Live Class

```typescript
const { data: liveSession } = await supabase
  .from('live_sessions')
  .select('*')
  .eq('id', sessionId)
  .single();

// Get participants
const { data: participants } = await supabase
  .from('live_session_participants')
  .select('*, student:students(full_name)')
  .eq('session_id', sessionId);

// Real-time chat subscription
const chatSubscription = supabase
  .channel('live-class-chat')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'live_class_chat',
    filter: `session_id=eq.${sessionId}`
  }, (payload) => {
    // Add new message to chat
  })
  .subscribe();
```

### 10-15. Other Class Screens

Use similar patterns as above, querying `live_sessions`, `whiteboard_data`, `polls`, `live_class_chat`.

---

## STUDY TAB

### 16. NewStudyLibraryScreen - Study Materials

```typescript
const { data: materials } = await supabase
  .from('study_materials')
  .select('*')
  .order('uploaded_at', { ascending: false });

// Get student's view progress
const { data: progress } = await supabase
  .from('study_material_views')
  .select('*, material:study_materials(*)')
  .eq('student_id', studentId)
  .order('last_viewed_at', { ascending: false });
```

### 17. NewAssignmentDetailScreen - Assignment

```typescript
const { data: assignment } = await supabase
  .from('assignments')
  .select('*')
  .eq('id', assignmentId)
  .single();

// Get student's submission
const { data: submission } = await supabase
  .from('assignment_submissions')
  .select('*')
  .eq('assignment_id', assignmentId)
  .eq('student_id', studentId)
  .single();
```

### 18. NewCollaborativeAssignment - Team Assignment

```typescript
// Get team info
const { data: team } = await supabase
  .from('assignment_teams')
  .select(`
    *,
    assignment:assignments(*),
    members:assignment_team_members(
      *,
      student:students(full_name)
    )
  `)
  .eq('id', teamId)
  .single();

// Get version history
const { data: versions } = await supabase
  .from('submission_versions')
  .select('*')
  .eq('submission_id', submissionId)
  .order('version_number', { ascending: false });

// Get active editors (real-time)
const { data: editors } = await supabase
  .from('active_editors')
  .select('*, student:students(full_name)')
  .eq('submission_id', submissionId)
  .gte('last_active_at', new Date(Date.now() - 60000).toISOString()); // Last 1 min
```

### 19. NewAIStudyScreen - AI Tutor

```typescript
// Get or create conversation
let { data: conversation } = await supabase
  .from('ai_conversations')
  .select('*')
  .eq('student_id', studentId)
  .eq('is_active', true)
  .eq('conversation_type', 'tutor')
  .single();

if (!conversation) {
  const { data: newConv } = await supabase
    .from('ai_conversations')
    .insert({
      student_id: studentId,
      title: 'AI Tutor Session',
      conversation_type: 'tutor'
    })
    .select()
    .single();
  conversation = newConv;
}

// Get messages
const { data: messages } = await supabase
  .from('ai_messages')
  .select('*')
  .eq('conversation_id', conversation.id)
  .order('created_at', { ascending: true });
```

### 20. NewEnhancedAIStudy - AI Study Features

```typescript
// Get weak areas
const { data: weakAreas } = await supabase
  .from('weak_areas')
  .select('*')
  .eq('student_id', studentId)
  .eq('is_resolved', false)
  .order('current_score', { ascending: true })
  .limit(5);

// Get flashcards due for review
const { data: flashcards } = await supabase
  .from('flashcards')
  .select('*')
  .eq('student_id', studentId)
  .lte('next_review_at', new Date().toISOString())
  .eq('is_mastered', false)
  .limit(10);

// Get study plans
const { data: studyPlans } = await supabase
  .from('study_plans')
  .select('*')
  .eq('student_id', studentId)
  .eq('is_completed', false)
  .order('created_at', { ascending: false });

// Get study progress
const { data: progress } = await supabase
  .from('student_progress')
  .select('*')
  .eq('student_id', studentId);
```

### 21. NewAITutorChat - AI Chat

```typescript
// Same as NewAIStudyScreen above
// Use ai_conversations and ai_messages tables
```

### 22. AIPracticeProblems - Practice Problems

```typescript
// Get practice problems
const { data: problems } = await supabase
  .from('ai_practice_problems')
  .select('*')
  .eq('student_id', studentId)
  .eq('subject', subject)
  .is('completed_at', null)
  .limit(10);

// Submit answer
const { data: result } = await supabase
  .from('ai_practice_problems')
  .update({
    student_answer: answer,
    is_correct: isCorrect,
    time_spent_seconds: timeSpent,
    attempts: attempts + 1,
    completed_at: new Date().toISOString()
  })
  .eq('id', problemId)
  .select()
  .single();
```

### 23. AIStudySummaries - AI Summaries

```typescript
const { data: summaries } = await supabase
  .from('ai_study_summaries')
  .select('*')
  .eq('student_id', studentId)
  .order('created_at', { ascending: false })
  .limit(20);
```

---

## PROGRESS TAB

### 24. NewProgressDetailScreen - Progress Report

```typescript
// Get overall student stats
const { data: student } = await supabase
  .from('students')
  .select('overall_grade, attendance_percentage, assignments_completed, total_assignments')
  .eq('id', studentId)
  .single();

// Get subject-wise progress
const { data: subjectProgress } = await supabase
  .from('student_progress')
  .select('*')
  .eq('student_id', studentId);

// Get recent test results
const { data: testResults } = await supabase
  .from('test_results')
  .select('*')
  .eq('student_id', studentId)
  .order('test_date', { ascending: false })
  .limit(10);

// Get performance trend (last 30 days)
const { data: performance } = await supabase
  .from('performance_metrics')
  .select('*')
  .eq('student_id', studentId)
  .gte('metric_date', new Date(Date.now() - 30*24*60*60*1000).toISOString())
  .order('metric_date', { ascending: false });
```

### 25. NewGamifiedLearningHub - Gamification

```typescript
// Get gamification profile
const { data: gamification } = await supabase
  .from('student_gamification')
  .select('*')
  .eq('student_id', studentId)
  .single();

// Get all badges with earned status
const { data: badges } = await supabase
  .from('student_badges')
  .select('*, badge:badges(*)')
  .eq('student_id', studentId)
  .order('earned_at', { ascending: false });

// Get recent achievements
const { data: achievements } = await supabase
  .from('student_achievements')
  .select('*')
  .eq('student_id', studentId)
  .order('created_at', { ascending: false })
  .limit(10);
```

---

## CONNECT TAB

### 26. NewPeerLearningNetwork - Peer Network

```typescript
// Get peers from same batch
const { data: student } = await supabase
  .from('students')
  .select('batch_id')
  .eq('id', studentId)
  .single();

const { data: peers } = await supabase
  .from('students')
  .select('id, full_name, email')
  .eq('batch_id', student.batch_id)
  .neq('id', studentId)
  .limit(20);

// Get study groups
const { data: studyGroups } = await supabase
  .from('study_groups')
  .select(`
    *,
    members:study_group_members(count)
  `)
  .eq('batch_id', student.batch_id)
  .eq('is_active', true);

// Check if student is member
const { data: memberships } = await supabase
  .from('study_group_members')
  .select('group_id')
  .eq('student_id', studentId);

// Get leaderboard
const { data: leaderboard } = await supabase
  .from('peer_leaderboard')
  .select('*, student:students(full_name)')
  .eq('batch_id', student.batch_id)
  .eq('leaderboard_type', 'weekly')
  .order('rank', { ascending: true })
  .limit(10);

// Get shared resources
const { data: resources } = await supabase
  .from('shared_resources')
  .select('*, shared_by:students(full_name)')
  .or(`is_public.eq.true,shared_by_student_id.eq.${studentId}`)
  .order('created_at', { ascending: false });
```

### 27. PeerDetail - Peer Profile

```typescript
const { data: peer } = await supabase
  .from('students')
  .select(`
    *,
    progress:student_progress(*),
    badges:student_badges(*, badge:badges(*))
  `)
  .eq('id', peerId)
  .single();

// Get peer connection status
const { data: connection } = await supabase
  .from('peer_connections')
  .select('*')
  .or(`and(student_id_1.eq.${studentId},student_id_2.eq.${peerId}),and(student_id_1.eq.${peerId},student_id_2.eq.${studentId})`)
  .single();

// Get shared resources by peer
const { data: resources } = await supabase
  .from('shared_resources')
  .select('*')
  .eq('shared_by_student_id', peerId)
  .eq('is_public', true);
```

---

## Real-time Subscriptions

### Live Class Chat

```typescript
const chatChannel = supabase
  .channel('live-class-chat')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'live_class_chat',
    filter: `session_id=eq.${sessionId}`
  }, (payload) => {
    setMessages(prev => [...prev, payload.new]);
  })
  .subscribe();

// Clean up
return () => {
  chatChannel.unsubscribe();
};
```

### Activity Feed Updates

```typescript
const activityChannel = supabase
  .channel('student-activities')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'student_activities',
    filter: `student_id=eq.${studentId}`
  }, (payload) => {
    setActivities(prev => [payload.new, ...prev]);
  })
  .subscribe();
```

### Collaborative Editing

```typescript
const editorsChannel = supabase
  .channel('active-editors')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'active_editors',
    filter: `submission_id=eq.${submissionId}`
  }, (payload) => {
    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
      updateActiveEditors(payload.new);
    } else if (payload.eventType === 'DELETE') {
      removeActiveEditor(payload.old.id);
    }
  })
  .subscribe();
```

---

## Common Patterns

### Pagination

```typescript
const pageSize = 20;
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('student_id', studentId)
  .order('created_at', { ascending: false })
  .range(page * pageSize, (page + 1) * pageSize - 1);
```

### Search/Filter

```typescript
const { data } = await supabase
  .from('study_materials')
  .select('*')
  .ilike('title', `%${searchTerm}%`)
  .eq('subject', subject)
  .order('created_at', { ascending: false });
```

### Aggregations

```typescript
const { data, error } = await supabase
  .rpc('get_student_stats', {
    p_student_id: studentId
  });
```

### Upsert (Insert or Update)

```typescript
const { data } = await supabase
  .from('student_gamification')
  .upsert({
    student_id: studentId,
    total_points: points,
    level: level,
    xp: xp
  }, {
    onConflict: 'student_id'
  })
  .select()
  .single();
```

---

## Error Handling

```typescript
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('id', id);

if (error) {
  console.error('Database error:', error);
  // Check for specific errors
  if (error.code === 'PGRST116') {
    // No rows returned
  } else if (error.code === '42501') {
    // Insufficient privileges (RLS)
  }
  return;
}

// Use data
```

---

## Testing Queries

Run these in Supabase SQL Editor to verify:

```sql
-- Check student exists
SELECT * FROM students WHERE id = '96055c84-a9ee-496d-8360-6b7cea64b928';

-- Check gamification
SELECT * FROM student_gamification WHERE student_id = '96055c84-a9ee-496d-8360-6b7cea64b928';

-- Check activities
SELECT COUNT(*) FROM student_activities WHERE student_id = '96055c84-a9ee-496d-8360-6b7cea64b928';

-- Check badges
SELECT COUNT(*) FROM student_badges WHERE student_id = '96055c84-a9ee-496d-8360-6b7cea64b928';

-- Check today's classes
SELECT COUNT(*) FROM class_sessions
WHERE batch_id = '57ab5ec8-fac5-49f9-b64c-38e4b526ef84'
  AND DATE(start_time) = CURRENT_DATE;
```

---

## Tips

1. **Always use prepared statements** - Supabase handles this automatically
2. **Use `.select()` to specify columns** - Reduces payload size
3. **Use `.single()` when expecting one row** - Better error handling
4. **Add `.limit()` to prevent huge results** - Especially for feeds
5. **Use real-time subscriptions sparingly** - Only for truly real-time features
6. **Check RLS policies** - If getting empty results unexpectedly
7. **Use transactions for multi-table operations** - Ensures data consistency

---

## Need More Help?

See full documentation: `C:\PC\OLD\docs\STUDENT_SCHEMA.md`

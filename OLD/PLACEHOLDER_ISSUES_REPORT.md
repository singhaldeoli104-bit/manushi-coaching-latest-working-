# Placeholder & Non-Functional Elements Report
**Date:** 2025-11-05
**Status:** Validation Complete
**Screens Analyzed:** 21 New Student Screens

---

## Executive Summary

**Total Issues Found:** 14
**Screens with Issues:** 9 out of 21 (43%)
**Screens Fully Functional:** 12 out of 21 (57%)

### Issue Breakdown:
- 🔴 **CRITICAL Issues:** 8 (require immediate fix)
- 🟠 **HIGH Priority:** 3 (video placeholders)
- 🟡 **MEDIUM Priority:** 3 (cosmetic/enhancement)

---

## 🔴 CRITICAL ISSUES (8)

These issues block core functionality and should be fixed immediately:

### 1. NewStudentDashboard.tsx - Hardcoded Attendance
**File:** `OLD/src/screens/student/NewStudentDashboard.tsx`
**Line:** 69
**Issue:** Attendance percentage is hardcoded to 92% instead of calculated from real data

**Current Code:**
```typescript
Promise.resolve({ data: 92 }), // Placeholder - replace with actual RPC
```

**Required Fix:**
```typescript
// Option 1: Use RPC function
supabase.rpc('calculate_student_attendance', {
  student_id: studentId
}),

// Option 2: Manual calculation
supabase
  .from('class_sessions')
  .select('id, attended')
  .eq('student_id', studentId)
  .then(({ data }) => {
    const total = data.length;
    const attended = data.filter(c => c.attended).length;
    return { data: Math.round((attended / total) * 100) };
  }),
```

**Impact:** Students see fake attendance metrics instead of their actual attendance

---

### 2. NewAIStudyScreen.tsx - Broken Navigation Routes
**File:** `OLD/src/screens/student/NewAIStudyScreen.tsx`
**Lines:** 47, 55, 63
**Issue:** Multiple features navigate to the same screen instead of unique screens

**Current Code:**
```typescript
const features: StudyFeature[] = [
  { id: 'tutor', route: 'AITutorChat' }, // ✅ CORRECT
  { id: 'practice', route: 'StudyLibrary' }, // ❌ WRONG
  { id: 'summary', route: 'StudyLibrary' }, // ❌ WRONG
  { id: 'quiz', route: 'StudyLibrary' }, // ❌ WRONG
];
```

**Required Fix:**
```typescript
const features: StudyFeature[] = [
  { id: 'tutor', route: 'AITutorChat' },
  { id: 'practice', route: 'AIPracticeProblems' }, // NEW SCREEN NEEDED
  { id: 'summary', route: 'AIStudySummaries' }, // NEW SCREEN NEEDED
  { id: 'quiz', route: 'AIQuiz' }, // Use StudyLibrary or create new
];
```

**Missing Screens:**
1. `AIPracticeProblems.tsx` - AI-generated practice questions
2. `AIStudySummaries.tsx` - AI-generated topic summaries

**Impact:** Users can't access Practice Problems or Study Summaries features

---

### 3. NewAITutorChat.tsx - Simulated AI Responses
**File:** `OLD/src/screens/student/NewAITutorChat.tsx`
**Lines:** 62-71
**Issue:** AI responses are simulated with setTimeout instead of calling real AI API

**Current Code:**
```typescript
setTimeout(() => {
  const aiResponse: Message = {
    id: (Date.now() + 1).toString(),
    text: 'I understand your question. Let me help you with that...',
    isUser: false,
    timestamp: new Date(),
  };
  setMessages(prev => [...prev, aiResponse]);
}, 1500);
```

**Required Fix:**
```typescript
// TODO: Integrate with AI API (OpenAI, Anthropic, etc.)
const response = await fetch('YOUR_AI_API_ENDPOINT', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: inputText,
    context: 'student-tutoring',
    studentId: user.id,
  }),
});

const aiData = await response.json();
const aiResponse: Message = {
  id: Date.now().toString(),
  text: aiData.response,
  isUser: false,
  timestamp: new Date(),
};
```

**Impact:** Students receive generic mock responses instead of real AI assistance

---

### 4. NewEnhancedAIStudy.tsx - Non-Functional Tool Cards
**File:** `OLD/src/screens/student/NewEnhancedAIStudy.tsx`
**Lines:** 41-56
**Issue:** All 3 tool cards have no onPress handlers - buttons don't work

**Current Code:**
```typescript
{tools.map((tool, index) => (
  <TouchableOpacity key={index}>  {/* ❌ NO onPress */}
    <Card style={styles.toolCard}>
      <T variant="h2">{tool.icon}</T>
      <T variant="body" weight="semiBold">{tool.title}</T>
    </Card>
  </TouchableOpacity>
))}
```

**Required Fix:**
```typescript
{tools.map((tool) => (
  <TouchableOpacity
    key={tool.id}
    onPress={() => {
      trackAction('select_ai_tool', 'NewEnhancedAIStudy', { tool: tool.id });
      safeNavigate(tool.route || 'StudyLibrary');
    }}
    accessibilityRole="button"
    accessibilityLabel={`Open ${tool.title}`}
  >
    <Card style={styles.toolCard}>
      <T variant="h2">{tool.icon}</T>
      <T variant="body" weight="semiBold">{tool.title}</T>
    </Card>
  </TouchableOpacity>
))}
```

**Impact:** Students can see tools but can't tap them to use them

---

### 5. NewVirtualClassroom.tsx - Non-Functional Control Buttons
**File:** `OLD/src/screens/student/NewVirtualClassroom.tsx`
**Line:** 47
**Issue:** Video, Audio, Chat, Raise Hand buttons have no functionality

**Current Code:**
```typescript
{features.map((feature, index) => (
  <TouchableOpacity key={index} style={styles.controlButton}>
    {/* ❌ NO onPress HANDLER */}
    <T variant="h2">{feature.icon}</T>
    <T variant="caption">{feature.label}</T>
  </TouchableOpacity>
))}
```

**Required Fix:**
```typescript
const [videoEnabled, setVideoEnabled] = useState(false);
const [audioEnabled, setAudioEnabled] = useState(false);

{features.map((feature, index) => (
  <TouchableOpacity
    key={index}
    style={styles.controlButton}
    onPress={() => {
      trackAction('toggle_control', 'NewVirtualClassroom', { control: feature.label });
      if (feature.label === 'Video') setVideoEnabled(!videoEnabled);
      if (feature.label === 'Audio') setAudioEnabled(!audioEnabled);
      if (feature.label === 'Chat') safeNavigate('ClassChat');
      if (feature.label === 'Raise Hand') handleRaiseHand();
    }}
    accessibilityRole="button"
    accessibilityLabel={`Toggle ${feature.label}`}
  >
    <T variant="h2">{feature.icon}</T>
    <T variant="caption">{feature.label}</T>
  </TouchableOpacity>
))}
```

**Impact:** Students see control buttons but can't use any classroom controls

---

### 6. NewCollaborativeAssignment.tsx - Hardcoded Progress
**File:** `OLD/src/screens/student/NewCollaborativeAssignment.tsx`
**Lines:** 147-149
**Issue:** Assignment progress is hardcoded instead of dynamic from database

**Current Code:**
```typescript
<Card style={styles.progressCard}>
  <T variant="title" weight="semiBold">Progress</T>
  <T variant="body">Research: ✅ Complete</T>
  <T variant="body">Draft: 🔄 In Progress</T>
  <T variant="body">Review: ⏳ Pending</T>
</Card>
```

**Required Fix:**
```typescript
// Add query for assignment tasks/progress
const { data: progress } = useQuery({
  queryKey: ['assignment-progress', assignmentId],
  queryFn: async () => {
    const { data } = await supabase
      .from('assignment_tasks')
      .select('*')
      .eq('assignment_id', assignmentId)
      .order('order', { ascending: true });
    return data;
  }
});

// Render dynamic progress
<Card style={styles.progressCard}>
  <T variant="title" weight="semiBold">Progress</T>
  {progress?.map(task => (
    <T key={task.id} variant="body">
      {task.name}: {getStatusIcon(task.status)} {task.status}
    </T>
  ))}
</Card>
```

**Impact:** Students see fake progress instead of their actual assignment progress

---

### 7. NewPeerLearningNetwork.tsx - Missing Navigation
**File:** `OLD/src/screens/student/NewPeerLearningNetwork.tsx`
**Line:** 101
**Issue:** Tapping peer cards only tracks action but doesn't navigate to peer details

**Current Code:**
```typescript
<TouchableOpacity
  style={styles.peerCard}
  onPress={() => trackAction('view_peer', 'NewPeerLearningNetwork', { peerId: item.id })}
  {/* ❌ ONLY trackAction, NO navigation */}
>
```

**Required Fix:**
```typescript
<TouchableOpacity
  style={styles.peerCard}
  onPress={() => {
    trackAction('view_peer', 'NewPeerLearningNetwork', { peerId: item.id });
    safeNavigate('PeerDetail', { peerId: item.id, peerName: item.name });
  }}
  accessibilityRole="button"
  accessibilityLabel={`View ${item.name}'s profile`}
>
```

**Missing Screen:**
- `PeerDetail.tsx` - Show peer profile with subjects, achievements, study groups

**Impact:** Students can see peers but can't tap to view their profiles or connect

---

### 8. NewEnhancedLiveClass.tsx - Placeholder Feature Handlers
**File:** `OLD/src/screens/student/NewEnhancedLiveClass.tsx`
**Line:** 78
**Issue:** All 4 interactive features (Whiteboard, Screen Share, Chat, Notes) only track action

**Current Code:**
```typescript
const handleFeaturePress = (action: string) => {
  trackAction('use_live_feature', 'NewEnhancedLiveClass', { feature: action, classId });
  // Feature actions would be implemented here  ← PLACEHOLDER COMMENT
};
```

**Required Fix:**
```typescript
const handleFeaturePress = (action: string) => {
  trackAction('use_live_feature', 'NewEnhancedLiveClass', { feature: action, classId });

  switch(action) {
    case 'whiteboard':
      safeNavigate('Whiteboard', { classId });
      break;
    case 'screen_share':
      Alert.alert('Screen Share', 'Teacher is sharing screen');
      break;
    case 'chat':
      safeNavigate('ClassChat', { classId });
      break;
    case 'notes':
      safeNavigate('ClassNotes', { classId });
      break;
  }
};
```

**Missing Screens:**
- `Whiteboard.tsx` - Interactive whiteboard for collaboration
- `ClassChat.tsx` - Real-time chat during class
- `ClassNotes.tsx` - Take and save notes during class

**Impact:** Students see feature buttons but none of them work

---

## 🟠 HIGH PRIORITY ISSUES (3)

Video placeholders that should show actual video streams:

### 9. NewVirtualClassroom.tsx - Video Placeholder
**File:** `OLD/src/screens/student/NewVirtualClassroom.tsx`
**Lines:** 33-37
**Issue:** Shows emoji 📹 instead of actual video stream

**Required:** Integration with video service (Agora, Jitsi, WebRTC, etc.)

---

### 10. NewLiveClassScreen.tsx - Video Placeholder
**File:** `OLD/src/screens/student/NewLiveClassScreen.tsx`
**Lines:** 97-102
**Issue:** Shows emoji 📹 instead of actual live stream

**Required:** Integration with video streaming service

---

### 11. NewEnhancedLiveClass.tsx - Video Placeholder
**File:** `OLD/src/screens/student/NewEnhancedLiveClass.tsx`
**Lines:** 105-110
**Issue:** Shows emoji 📹 instead of actual video stream

**Required:** Video streaming integration

**Note:** All 3 screens need the same video streaming solution

---

## 🟡 MEDIUM PRIORITY ISSUES (3)

Cosmetic issues that don't block functionality:

### 12. NewCollaborativeAssignment.tsx - Generic Avatars
**File:** `OLD/src/screens/student/NewCollaborativeAssignment.tsx`
**Lines:** 78-79
**Issue:** Avatars are hardcoded emojis (👩👨👧) based on array index

**Improvement:** Use user profile images from students table

---

### 13. NewPeerLearningNetwork.tsx - Generic Avatars
**File:** `OLD/src/screens/student/NewPeerLearningNetwork.tsx`
**Lines:** 64-65
**Issue:** Same as above - hardcoded emoji avatars

**Improvement:** Use user profile images

---

### 14. NewAITutorChat.tsx - Hardcoded Suggestions
**File:** `OLD/src/screens/student/NewAITutorChat.tsx`
**Lines:** 161-186
**Issue:** Suggested questions are static

**Improvement:** Make suggestions dynamic based on student's weak areas

---

## ✅ SCREENS WITH NO ISSUES (12)

These screens are fully functional with real data and working features:

1. **NewScheduleScreen** - Week/day schedule with real-time status ✅
2. **NewClassDetailScreen** - Class details with materials and join link ✅
3. **NewAssignmentDetailScreen** - Assignment with working submission ✅
4. **NewProgressDetailScreen** - Real grade calculations and charts ✅
5. **NewStudyLibraryScreen** - Materials with subject filter ✅
6. **NewSimpleDoubt** - Working doubt submission form ✅
7. **NewActivityDetail** - Real activity data from database ✅
8. **NewDoubtSubmission** - Detailed doubt form with real insert ✅
9. **NewAILearningDashboard** - Real AI insights from database ✅
10. **NewGamifiedLearningHub** - Real gamification data ✅
11. **NewInteractiveClassroom** - Working poll with mutation ✅
12. **NewEnhancedSchedule** - Today's schedule with real data ✅

---

## Missing Screens Summary

Screens that are referenced but don't exist yet:

### Navigation Screens (CRITICAL)
1. **AIPracticeProblems.tsx** - AI-generated practice questions
2. **AIStudySummaries.tsx** - AI-generated topic summaries
3. **PeerDetail.tsx** - Peer profile and connection screen

### Live Class Features (CRITICAL)
4. **Whiteboard.tsx** - Interactive whiteboard for classes
5. **ClassChat.tsx** - Real-time chat during class
6. **ClassNotes.tsx** - Note-taking during class

**Total Missing Screens:** 6

---

## Recommended Fix Priority

### Phase 1: Critical Navigation (Immediate)
1. Fix NewAIStudyScreen navigation routes
2. Add missing screens: AIPracticeProblems, AIStudySummaries
3. Fix NewPeerLearningNetwork navigation
4. Add PeerDetail screen

### Phase 2: Critical Functionality (This Week)
5. Fix NewStudentDashboard attendance calculation
6. Add onPress handlers to NewEnhancedAIStudy tool cards
7. Add onPress handlers to NewVirtualClassroom controls
8. Fix NewCollaborativeAssignment progress query
9. Document NewAITutorChat AI integration requirements

### Phase 3: Live Class Features (Next Week)
10. Add missing screens: Whiteboard, ClassChat, ClassNotes
11. Fix NewEnhancedLiveClass feature handlers
12. Integrate video streaming for 3 screens

### Phase 4: Enhancements (Future)
13. Add profile images for avatars
14. Make AI suggestions dynamic
15. Complete AI API integration

---

## Testing Checklist

Before marking screens as complete:

- [ ] Test all button onPress handlers actually work
- [ ] Verify navigation goes to correct screens
- [ ] Confirm data is pulled from Supabase (not hardcoded)
- [ ] Check that filters actually filter data
- [ ] Test video placeholders (or document as known limitation)
- [ ] Verify all accessibility labels are present
- [ ] Test on real device with network issues
- [ ] Check analytics events are tracked

---

## Conclusion

**Overall Assessment:**
- 57% of screens (12/21) are fully functional ✅
- 43% of screens (9/21) have issues that need fixing ⚠️
- Most issues are fixable with navigation/handler additions
- Video streaming requires third-party service integration

**Next Steps:**
1. Fix critical navigation and missing handlers (Phase 1-2)
2. Create missing screens for proper navigation flow
3. Document AI integration requirements for future work
4. Plan video streaming integration separately

**Estimated Fix Time:**
- Phase 1 (Navigation): 4-6 hours
- Phase 2 (Functionality): 6-8 hours
- Phase 3 (Live Features): 12-16 hours
- **Total:** ~25-30 hours for full completion

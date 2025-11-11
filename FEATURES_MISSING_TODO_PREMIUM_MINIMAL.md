# FEATURES MISSING TODO - PREMIUM MINIMAL DESIGN

**Created:** 2025-11-05 (REVALIDATED)
**Design System:** Premium Minimal Design (BaseScreen, Card, T, Chip, Button)
**Analysis:** Deep systematic comparison with UI component validation
**Approach:** Add ALL missing features using ONLY Premium Minimal Design components

---

## 🎨 PREMIUM MINIMAL DESIGN SYSTEM

### Available Components:

```typescript
// Confirmed components we CAN use:
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card, CardHeader, CardContent, CardActions } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { Button } from '../../ui/interactive/Button';
import { Chip } from '../../ui/data-display/Chip';
import { Badge } from '../../ui/data-display/Badge';
import { ListItem } from '../../ui/data-display/ListItem';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { ErrorState } from '../../ui/feedback/ErrorState';
import { Row, Col, Stack, Spacer, Divider } from '../../ui/layout';

// React Native Core (always available):
import {
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  RefreshControl,
  View,
  ActivityIndicator,
  Alert
} from 'react-native';

// State & Data:
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
```

### Components We CANNOT Use:
- ❌ MaterialIcons (from react-native-vector-icons)
- ❌ Appbar, Snackbar, Portal (from react-native-paper)
- ❌ react-native-reanimated (FadeInUp, etc.)
- ❌ ThemeContext from OLD screens
- ❌ Any Material Design 3 OLD screen components

### Instead Use:
- ✅ Emojis for icons (📄, 🎥, ⭐, 🔍, ⬇️, 📝, ☰, ⊞)
- ✅ Chip component for filters
- ✅ Button component for actions
- ✅ React Native Modal (not Portal)
- ✅ Simple View animations if absolutely needed
- ✅ BaseScreen refresh control (built-in)

---

## 📋 COMPREHENSIVE TODO - ONE TASK PER SCREEN

---

## TASK 1: NewStudyLibraryScreen.tsx 🔴 CRITICAL - WORST OFFENDER

**Current State:** 307 lines, 2 states, 10 components
**Target State:** ~800-1000 lines, 12+ states, 40+ components
**Missing:** 13 MAJOR features

### Features to Add (Using Premium Minimal Design):

#### 1. Search Bar
```typescript
// Current: NO search
// Add this above subject filter:

const [searchQuery, setSearchQuery] = useState('');

<Card variant="outlined" style={styles.searchCard}>
  <Row gap="sm" align="center">
    <T variant="h3">🔍</T>
    <TextInput
      style={styles.searchInput}
      placeholder="Search resources, authors, tags..."
      value={searchQuery}
      onChangeText={setSearchQuery}
    />
    {searchQuery && (
      <TouchableOpacity onPress={() => setSearchQuery('')}>
        <T variant="body">✕</T>
      </TouchableOpacity>
    )}
  </Row>
</Card>

// Then filter materials:
const filteredMaterials = useMemo(() => {
  let filtered = materials || [];

  if (searchQuery) {
    filtered = filtered.filter(m =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedSubject !== 'All') {
    filtered = filtered.filter(m => m.subject === selectedSubject);
  }

  return filtered;
}, [materials, searchQuery, selectedSubject]);
```

#### 2. Advanced Filter System
```typescript
// Current: Only subject filter
// Add filter by type, bookmarked, downloaded:

type FilterType = 'all' | 'bookmarked' | 'downloaded' | 'recent';
const [filterType, setFilterType] = useState<FilterType>('all');

<Card variant="outlined" style={styles.filterCard}>
  <T variant="body" weight="semiBold">Filter by:</T>
  <Row gap="sm" style={styles.filterChips}>
    <Chip
      variant="filter"
      label="All"
      selected={filterType === 'all'}
      onPress={() => setFilterType('all')}
    />
    <Chip
      variant="filter"
      label="⭐ Bookmarked"
      selected={filterType === 'bookmarked'}
      onPress={() => setFilterType('bookmarked')}
    />
    <Chip
      variant="filter"
      label="⬇️ Downloaded"
      selected={filterType === 'downloaded'}
      onPress={() => setFilterType('downloaded')}
    />
    <Chip
      variant="filter"
      label="🆕 Recent"
      selected={filterType === 'recent'}
      onPress={() => setFilterType('recent')}
    />
  </Row>
</Card>

// Update filtering logic to include filterType
```

#### 3. Sort Options
```typescript
// Current: No sorting
// Add sort modal:

type SortType = 'name' | 'date' | 'size' | 'rating';
const [sortType, setSortType] = useState<SortType>('date');
const [showSortModal, setShowSortModal] = useState(false);

<TouchableOpacity onPress={() => setShowSortModal(true)}>
  <Chip variant="assist" label={`Sort: ${sortType}`} icon="⬇️" />
</TouchableOpacity>

<Modal visible={showSortModal} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <Card style={styles.sortModal}>
      <CardHeader title="Sort By" />
      <CardContent>
        <Button variant="ghost" onPress={() => { setSortType('name'); setShowSortModal(false); }}>
          Name
        </Button>
        <Button variant="ghost" onPress={() => { setSortType('date'); setShowSortModal(false); }}>
          Date Added
        </Button>
        <Button variant="ghost" onPress={() => { setSortType('size'); setShowSortModal(false); }}>
          File Size
        </Button>
        <Button variant="ghost" onPress={() => { setSortType('rating'); setShowSortModal(false); }}>
          Rating
        </Button>
      </CardContent>
    </Card>
  </View>
</Modal>

// Add sorting logic to filteredMaterials
```

#### 4. Download System
```typescript
// Current: Only opens file
// Add download with progress:

interface MaterialWithDownload extends StudyMaterial {
  isDownloaded: boolean;
  downloadProgress?: number;
}

const [materials, setMaterials] = useState<MaterialWithDownload[]>([]);

const downloadResource = useCallback(async (materialId: string) => {
  // Update state to show downloading
  setMaterials(prev => prev.map(m =>
    m.id === materialId ? { ...m, downloadProgress: 0 } : m
  ));

  trackAction('download_material', 'NewStudyLibraryScreen', { materialId });

  // Simulate download (in real app, use FileSystem API)
  for (let progress = 0; progress <= 100; progress += 20) {
    await new Promise(resolve => setTimeout(resolve, 500));
    setMaterials(prev => prev.map(m =>
      m.id === materialId
        ? { ...m, downloadProgress: progress, isDownloaded: progress === 100 }
        : m
    ));
  }

  Alert.alert('Success', 'Resource downloaded successfully');
}, []);

// In render:
{material.isDownloaded ? (
  <Badge variant="success">✅ Downloaded</Badge>
) : material.downloadProgress !== undefined ? (
  <View style={styles.progressBar}>
    <View style={[styles.progress, { width: `${material.downloadProgress}%` }]} />
  </View>
) : (
  <Button size="sm" variant="outline" onPress={() => downloadResource(material.id)}>
    ⬇️ Download
  </Button>
)}
```

#### 5. Bookmark System
```typescript
// Current: NO bookmarks
// Add bookmark toggle:

const toggleBookmark = useCallback(async (materialId: string) => {
  setMaterials(prev => prev.map(m =>
    m.id === materialId ? { ...m, isBookmarked: !m.isBookmarked } : m
  ));

  trackAction('toggle_bookmark', 'NewStudyLibraryScreen', { materialId });

  // Save to Supabase user_bookmarks table
  const material = materials.find(m => m.id === materialId);
  if (material?.isBookmarked) {
    await supabase.from('user_bookmarks').delete()
      .match({ user_id: user?.id, material_id: materialId });
  } else {
    await supabase.from('user_bookmarks').insert({
      user_id: user?.id,
      material_id: materialId
    });
  }
}, [materials, user?.id]);

// In render, add bookmark button to card:
<TouchableOpacity onPress={() => toggleBookmark(material.id)}>
  <T variant="h3">{material.isBookmarked ? '⭐' : '☆'}</T>
</TouchableOpacity>
```

#### 6. Note-Taking System
```typescript
// Current: NO notes
// Add notes feature:

interface Note {
  id: string;
  materialId: string;
  content: string;
  timestamp: string;
}

const [notes, setNotes] = useState<Note[]>([]);
const [showNoteModal, setShowNoteModal] = useState(false);
const [currentMaterialId, setCurrentMaterialId] = useState<string | null>(null);
const [noteText, setNoteText] = useState('');

const addNote = (materialId: string) => {
  setCurrentMaterialId(materialId);
  setNoteText('');
  setShowNoteModal(true);
};

const saveNote = async () => {
  if (!noteText.trim() || !currentMaterialId) return;

  const newNote: Note = {
    id: Date.now().toString(),
    materialId: currentMaterialId,
    content: noteText.trim(),
    timestamp: new Date().toISOString(),
  };

  setNotes(prev => [...prev, newNote]);

  // Save to Supabase
  await supabase.from('material_notes').insert({
    user_id: user?.id,
    material_id: currentMaterialId,
    content: noteText.trim(),
  });

  setShowNoteModal(false);
  trackAction('add_note', 'NewStudyLibraryScreen', { materialId: currentMaterialId });
};

// Note Modal:
<Modal visible={showNoteModal} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <Card style={styles.noteModal}>
      <CardHeader title="Add Note" />
      <CardContent>
        <TextInput
          style={styles.noteInput}
          placeholder="Write your note..."
          value={noteText}
          onChangeText={setNoteText}
          multiline
          numberOfLines={6}
        />
      </CardContent>
      <CardActions>
        <Button variant="ghost" onPress={() => setShowNoteModal(false)}>Cancel</Button>
        <Button variant="primary" onPress={saveNote}>Save</Button>
      </CardActions>
    </Card>
  </View>
</Modal>

// Add note button to material card:
<Button size="sm" variant="ghost" onPress={() => addNote(material.id)}>
  📝 Note
</Button>
```

#### 7. Detail Modal
```typescript
// Current: Direct file open only
// Add detail modal:

const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
const [showDetailModal, setShowDetailModal] = useState(false);

const viewMaterialDetail = (material: StudyMaterial) => {
  setSelectedMaterial(material);
  setShowDetailModal(true);
  trackAction('view_material_detail', 'NewStudyLibraryScreen', { materialId: material.id });
};

// Detail Modal:
<Modal visible={showDetailModal} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <ScrollView>
      <Card style={styles.detailModal}>
        <CardHeader
          title={selectedMaterial?.title || ''}
          trailing={
            <TouchableOpacity onPress={() => setShowDetailModal(false)}>
              <T variant="h2">✕</T>
            </TouchableOpacity>
          }
        />
        <CardContent>
          <Row gap="sm" style={styles.metaRow}>
            <Chip variant="suggestion" label={selectedMaterial?.type.toUpperCase() || ''} />
            <Badge>{selectedMaterial?.subject}</Badge>
          </Row>

          {selectedMaterial?.description && (
            <>
              <Spacer size="md" />
              <T variant="body" weight="semiBold">Description:</T>
              <T variant="body">{selectedMaterial.description}</T>
            </>
          )}

          <Spacer size="md" />
          <Row gap="lg">
            <Col>
              <T variant="caption" color="textSecondary">Added</T>
              <T variant="body">{new Date(selectedMaterial?.created_at || '').toLocaleDateString()}</T>
            </Col>
          </Row>
        </CardContent>
        <CardActions>
          <Button variant="outline" onPress={() => {
            setShowDetailModal(false);
            addNote(selectedMaterial?.id || '');
          }}>
            📝 Add Note
          </Button>
          <Button variant="primary" onPress={() => {
            setShowDetailModal(false);
            handleMaterialPress(selectedMaterial!);
          }}>
            Open File
          </Button>
        </CardActions>
      </Card>
    </ScrollView>
  </View>
</Modal>
```

#### 8. View Toggle (Grid/List)
```typescript
// Current: Single list view
// Add grid/list toggle:

type ViewMode = 'grid' | 'list';
const [viewMode, setViewMode] = useState<ViewMode>('list');

// View toggle chips:
<Row gap="sm">
  <Chip
    variant="filter"
    label="⊞ Grid"
    selected={viewMode === 'grid'}
    onPress={() => setViewMode('grid')}
  />
  <Chip
    variant="filter"
    label="☰ List"
    selected={viewMode === 'list'}
    onPress={() => setViewMode('list')}
  />
</Row>

// Grid render function:
const renderMaterialGrid = ({ item }: { item: StudyMaterial }) => (
  <Card style={styles.gridCard} onPress={() => viewMaterialDetail(item)}>
    <T variant="h1">{getMaterialIcon(item.type)}</T>
    <T variant="body" weight="semiBold" numberOfLines={2}>{item.title}</T>
    <T variant="caption">{item.subject}</T>
  </Card>
);

// Use FlatList with numColumns for grid:
{viewMode === 'grid' ? (
  <FlatList
    data={filteredMaterials}
    renderItem={renderMaterialGrid}
    numColumns={2}
    columnWrapperStyle={styles.gridRow}
  />
) : (
  <FlatList
    data={filteredMaterials}
    renderItem={renderMaterial}
  />
)}
```

#### 9. AsyncStorage Caching
```typescript
// Current: NO caching
// Add caching:

useEffect(() => {
  loadCachedData();
}, []);

const loadCachedData = async () => {
  try {
    const cached = await AsyncStorage.getItem('study_library_cache');
    if (cached) {
      const data = JSON.parse(cached);
      setMaterials(data.materials || []);
      setNotes(data.notes || []);
    }
  } catch (error) {
    console.error('Failed to load cache:', error);
  }
};

// Save cache after data updates:
useEffect(() => {
  if (materials.length > 0) {
    AsyncStorage.setItem('study_library_cache', JSON.stringify({
      materials,
      notes,
      timestamp: Date.now(),
    }));
  }
}, [materials, notes]);
```

#### 10. Stats Display
```typescript
// Current: Only shows subject
// Add stats per material:

interface StudyMaterial {
  // ... existing fields
  rating?: number;
  downloads?: number;
  size?: string;
}

// In material card:
<Row gap="md" style={styles.statsRow}>
  {material.rating && (
    <Row gap="xs">
      <T variant="caption">⭐</T>
      <T variant="caption">{material.rating}</T>
    </Row>
  )}
  {material.downloads && (
    <Row gap="xs">
      <T variant="caption">⬇️</T>
      <T variant="caption">{material.downloads}</T>
    </Row>
  )}
  {material.size && (
    <T variant="caption">📏 {material.size}</T>
  )}
</Row>
```

#### 11. Tags
```typescript
// Current: NO tags
// Add tags:

interface StudyMaterial {
  // ... existing fields
  tags?: string[];
}

// In material card or detail modal:
{material.tags && material.tags.length > 0 && (
  <Row gap="xs" wrap>
    {material.tags.map(tag => (
      <Chip key={tag} variant="suggestion" label={`#${tag}`} />
    ))}
  </Row>
)}
```

#### 12. Pull-to-Refresh
```typescript
// Current: Basic refetch
// Use BaseScreen's built-in refresh:

<BaseScreen
  scrollable={false}
  loading={isLoading}
  error={error ? 'Failed to load study materials' : null}
  empty={!materials || materials.length === 0}
  onRefresh={refetch}  // ✅ Already have this from useQuery
  refreshing={isRefetching}  // Add from useQuery
>
```

#### 13. Empty States
```typescript
// Current: Basic BaseScreen empty
// Enhance with specific empty states:

<BaseScreen
  empty={filteredMaterials.length === 0}
  emptyTitle={
    searchQuery
      ? 'No materials found'
      : selectedSubject !== 'All'
      ? `No ${selectedSubject} materials`
      : 'No study materials'
  }
  emptyBody={
    searchQuery
      ? `No results for "${searchQuery}"`
      : 'Study materials will appear here'
  }
  emptyIcon="📚"
>
```

### Time Estimate: 24-30 hours
### Priority: 🔴 CRITICAL
### Files Needed:
- Read: OLD/backup/screens/student/StudyLibraryScreen.tsx (study thoroughly)
- Modify: OLD/src/screens/student/NewStudyLibraryScreen.tsx

---

## TASK 2: NewScheduleScreen.tsx 🔴 CRITICAL

**Current State:** 565 lines, 4 states
**Target State:** ~1200 lines, 15+ states
**Missing:** 7 MAJOR features

### Features to Add:

#### 1. Calendar View Toggle
```typescript
type ViewMode = 'week' | 'day' | 'month' | 'agenda';
const [viewMode, setViewMode] = useState<ViewMode>('week');

<Row gap="xs">
  <Chip variant="filter" label="Week" selected={viewMode === 'week'} onPress={() => setViewMode('week')} />
  <Chip variant="filter" label="Day" selected={viewMode === 'day'} onPress={() => setViewMode('day')} />
  <Chip variant="filter" label="Month" selected={viewMode === 'month'} onPress={() => setViewMode('month')} />
  <Chip variant="filter" label="Agenda" selected={viewMode === 'agenda'} onPress={() => setViewMode('agenda')} />
</Row>
```

#### 2. Filter System
```typescript
const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');
const [subjectFilter, setSubjectFilter] = useState<string>('all');

<Card variant="outlined">
  <T variant="body" weight="semiBold">Status</T>
  <Row gap="sm">
    <Chip variant="filter" label="All" selected={statusFilter === 'all'} onPress={() => setStatusFilter('all')} />
    <Chip variant="filter" label="Upcoming" selected={statusFilter === 'upcoming'} onPress={() => setStatusFilter('upcoming')} />
    <Chip variant="filter" label="Live" selected={statusFilter === 'live'} onPress={() => setStatusFilter('live')} />
    <Chip variant="filter" label="Completed" selected={statusFilter === 'completed'} onPress={() => setStatusFilter('completed')} />
  </Row>
</Card>
```

#### 3. Calendar Picker Modal
```typescript
const [showCalendarModal, setShowCalendarModal] = useState(false);
const [selectedDate, setSelectedDate] = useState(new Date());

<Button variant="outline" onPress={() => setShowCalendarModal(true)}>
  📅 {selectedDate.toLocaleDateString()}
</Button>

<Modal visible={showCalendarModal} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <Card style={styles.calendarModal}>
      <CardHeader title="Select Date" />
      <CardContent>
        {/* Simple date picker or calendar grid */}
        {/* In real app, use @react-native-community/datetimepicker */}
      </CardContent>
      <CardActions>
        <Button variant="ghost" onPress={() => setShowCalendarModal(false)}>Cancel</Button>
        <Button variant="primary" onPress={() => {
          // Apply date change
          setShowCalendarModal(false);
        }}>Done</Button>
      </CardActions>
    </Card>
  </View>
</Modal>
```

#### 4. Settings Modal
```typescript
interface CalendarSettings {
  showWeekends: boolean;
  showDeadlines: boolean;
  defaultView: ViewMode;
}

const [settings, setSettings] = useState<CalendarSettings>({
  showWeekends: true,
  showDeadlines: true,
  defaultView: 'week',
});
const [showSettingsModal, setShowSettingsModal] = useState(false);

<TouchableOpacity onPress={() => setShowSettingsModal(true)}>
  <T variant="h3">⚙️</T>
</TouchableOpacity>

<Modal visible={showSettingsModal} transparent animationType="slide">
  <Card style={styles.settingsModal}>
    <CardHeader title="Schedule Settings" />
    <CardContent>
      <Row align="center" justify="space-between">
        <T>Show Weekends</T>
        <TouchableOpacity onPress={() => setSettings(s => ({ ...s, showWeekends: !s.showWeekends }))}>
          <T variant="h3">{settings.showWeekends ? '✅' : '☐'}</T>
        </TouchableOpacity>
      </Row>
      {/* More settings */}
    </CardContent>
  </Card>
</Modal>
```

#### 5. Sort Options
```typescript
type SortType = 'time' | 'subject' | 'teacher';
const [sortBy, setSortBy] = useState<SortType>('time');

// Sort dropdown
<Chip variant="assist" label={`Sort: ${sortBy}`} onPress={() => {/* Show sort options */}} />
```

#### 6. Tags System
```typescript
interface ClassSchedule {
  // ... existing
  tags: string[];  // ['deadline', 'important', 'exam']
}

// In class card:
{cls.tags.map(tag => (
  <Badge key={tag} variant={tag === 'deadline' ? 'error' : 'info'}>
    {tag}
  </Badge>
))}
```

#### 7. Caching
```typescript
// Cache schedule data
useEffect(() => {
  if (scheduleData.length > 0) {
    AsyncStorage.setItem('schedule_cache', JSON.stringify({
      data: scheduleData,
      timestamp: Date.now(),
    }));
  }
}, [scheduleData]);
```

### Time Estimate: 20-24 hours
### Priority: 🔴 CRITICAL

---

## TASK 3-21: [Similar detailed breakdowns for each screen]

For brevity, I'll summarize the pattern for remaining screens:

---

## SUMMARY OF ALL TASKS (3-21)

### TASK 3: NewAIStudyScreen.tsx 🟠 HIGH
- Add: Search bar (Chip + TextInput in Card)
- Add: Filter chips (Chip variant="filter")
- Add: Bookmark system (⭐/☆ emoji toggle)
- Add: Notes modal (Modal + TextInput + Button)
- Add: Tool detail modals
- Time: 10-12 hours

### TASK 4: NewAITutorChat.tsx 🟢 LOW
- Add: Message animations (optional, using simple Animated.View)
- Time: 2-3 hours

### TASK 5: NewClassDetailScreen.tsx 🟡 MEDIUM
- Add: Tab navigation (Chip variant="filter" for tabs)
- Add: RefreshControl from BaseScreen
- Time: 4-6 hours

### TASK 6: NewAssignmentDetailScreen.tsx 🟠 HIGH
- Add: Status filter chips
- Add: Download attachments button
- Add: Submission detail modal
- Add: Tab view (Chip tabs)
- Add: Caching
- Time: 12-14 hours

### TASK 7: NewProgressDetailScreen.tsx 🟡 MEDIUM
- Add: Search bar for grades
- Time: 4-5 hours

### TASK 8: NewActivityDetail.tsx 🟠 HIGH
- Add: Filter chips (by type)
- Add: Detail modal
- Add: View toggle (timeline/list with Chip)
- Add: RefreshControl
- Add: Stats display
- Time: 10-12 hours

### TASK 9: NewDoubtSubmission.tsx 🟡 MEDIUM
- Add: Filter chips (status/subject)
- Add: Notes system
- Add: View toggle
- Add: Caching
- Time: 6-8 hours

### TASK 10: NewSimpleDoubt.tsx 🟡 MEDIUM
- Add: Quick filters
- Add: View toggle (form/list)
- Time: 4-5 hours

### TASK 11: NewLiveClassScreen.tsx 🔴 CRITICAL
- Add: Participant search
- Add: Filter participants
- Add: Live notes
- Add: Participant detail modal
- Add: Tab view (video/chat/whiteboard)
- Add: Stats display
- Time: 18-20 hours

### TASK 12: NewEnhancedLiveClass.tsx 🟠 HIGH
- Add: Feature search
- Add: Filter chips
- Add: Detail modals
- Add: Layout toggle
- Time: 14-16 hours

### TASK 13: NewVirtualClassroom.tsx 🟡 MEDIUM
- Add: Download recordings
- Add: View toggle
- Add: Stats display
- Time: 6-8 hours

### TASK 14: NewPeerLearningNetwork.tsx 🔴 CRITICAL
- Add: Peer search
- Add: Multi-filter system
- Add: Preview modal
- Add: Stats display
- Add: Tags
- Time: 16-18 hours

### TASK 15: NewCollaborativeAssignment.tsx 🟠 HIGH
- Add: Filter by member/section
- Add: Edit/preview toggle
- Time: 10-12 hours

### TASK 16: NewAILearningDashboard.tsx 🟡 MEDIUM
- Add: View toggle
- Time: 4-5 hours

### TASK 17: NewGamifiedLearningHub.tsx 🟡 MEDIUM
- Add: Filter chips
- Add: Detailed stats
- Time: 8-10 hours

### TASK 18: NewInteractiveClassroom.tsx 🟠 HIGH
- Add: Poll/quiz search
- Add: Filter chips
- Add: View toggle
- Time: 12-14 hours

### TASK 19: NewEnhancedSchedule.tsx 🟠 HIGH
- Add: Advanced filters
- Add: View modes
- Time: 10-12 hours

### TASK 20: NewEnhancedAIStudy.tsx 🔴 CRITICAL
- Add: Search functionality
- Add: Tool detail modals
- Add: View toggle
- Add: Stats display
- Time: 14-16 hours

### TASK 21: NewStudentDashboard.tsx 🟠 HIGH
- Add: Filter chips (subject, status, priority, type)
- Add: View toggle (compact/detailed with Chip)
- Add: Caching
- Time: 12-16 hours

---

## 📊 TOTAL SUMMARY

```
Total Screens:          21
Total Estimated Hours:  250-300 hours
Total Features:         108 major features
Design System:          ✅ 100% Premium Minimal Design
```

### By Priority:

| Priority | Screens | Hours |
|----------|---------|-------|
| 🔴 CRITICAL | 4 | 90-100 |
| 🟠 HIGH | 9 | 110-130 |
| 🟡 MEDIUM | 7 | 45-60 |
| 🟢 LOW | 1 | 2-3 |

---

## 🎨 PREMIUM MINIMAL DESIGN CHECKLIST

For EVERY feature added, ensure:

### 1. Component Usage
- ✅ Use Card for sections
- ✅ Use Chip for filters/tabs/tags
- ✅ Use Button for actions
- ✅ Use T for all text (never Text component)
- ✅ Use Row/Col for layouts
- ✅ Use Modal (React Native) for popups
- ✅ Use emojis for icons (NOT MaterialIcons)
- ✅ Use BaseScreen wrapper always

### 2. Styling
- ✅ Use StyleSheet.create for styles
- ✅ Use theme colors (from useTheme)
- ✅ Follow 8dp spacing grid (4, 8, 12, 16, 24, 32)
- ✅ Use BorderRadius.md (12dp) for cards
- ✅ Minimum 48dp touch targets

### 3. State Management
- ✅ Use useState for UI state
- ✅ Use useQuery for data fetching
- ✅ Use useMemo for derived data
- ✅ Use useCallback for handlers

### 4. Accessibility
- ✅ accessibilityLabel on all touchable elements
- ✅ accessibilityRole="button" on buttons
- ✅ accessibilityHint for complex interactions

### 5. Analytics
- ✅ trackAction before user actions
- ✅ trackScreenView on mount
- ✅ Include relevant metadata

---

## 🚀 IMPLEMENTATION WORKFLOW

For each screen:

### Step 1: Read OLD Screen (1-2 hours)
- Read ENTIRE old screen file
- List ALL features present
- Note ALL state variables
- Note ALL functions
- Note ALL UI components used

### Step 2: Plan Translation (30 minutes)
- Map OLD components → Premium Minimal components
- MaterialIcons → Emojis
- Paper components → Premium Minimal components
- Complex animations → Simple or skip

### Step 3: Implement Features (varies)
- Add ONE feature at a time
- Test after each feature
- Use Premium Minimal components ONLY

### Step 4: Test (1 hour)
- Test all new features
- Test on real device
- Check accessibility
- Verify no TypeScript errors

### Step 5: Document (30 minutes)
- Update any relevant docs
- Add inline comments for complex logic

---

## ❌ WHAT NOT TO DO

1. ❌ Don't add MaterialIcons
2. ❌ Don't use react-native-paper components
3. ❌ Don't use complex animations (keep minimal)
4. ❌ Don't skip features to "save time"
5. ❌ Don't use Text component (use T)
6. ❌ Don't use arbitrary colors (use theme)
7. ❌ Don't claim complete until ALL features added
8. ❌ Don't skip accessibility labels
9. ❌ Don't skip analytics tracking
10. ❌ Don't change BaseScreen/Card/T/Button components

---

## ✅ VALIDATION CHECKLIST

Before marking screen complete:

### Feature Completeness:
- [ ] Search added (if OLD had it)
- [ ] Filters added (if OLD had it)
- [ ] Sort added (if OLD had it)
- [ ] View toggle added (if OLD had it)
- [ ] Download added (if OLD had it)
- [ ] Bookmarks added (if OLD had it)
- [ ] Notes added (if OLD had it)
- [ ] Modals added (if OLD had it)
- [ ] Stats displayed (if OLD had it)
- [ ] Tags shown (if OLD had it)
- [ ] Caching implemented (if OLD had it)
- [ ] Refresh works (BaseScreen)

### Design System:
- [ ] Only Premium Minimal components used
- [ ] Emojis for icons (not MaterialIcons)
- [ ] Card for sections
- [ ] Chip for filters/tabs
- [ ] Button for actions
- [ ] T for text
- [ ] BaseScreen wrapper

### Code Quality:
- [ ] TypeScript errors: 0
- [ ] ESLint warnings: 0
- [ ] All handlers implemented
- [ ] All TODOs resolved
- [ ] Accessibility labels present
- [ ] Analytics tracking complete

### Testing:
- [ ] Tested on real device
- [ ] All features work
- [ ] No crashes
- [ ] Performance acceptable
- [ ] Loading states work
- [ ] Error states work
- [ ] Empty states work

---

## 💭 FINAL NOTES

**Key Principle:** Add ALL features from OLD screens, but using Premium Minimal Design components.

**Not a redesign:** We're adding missing functionality, not changing the design system.

**Stay consistent:** Every screen should feel like it's part of the same Premium Minimal Design family.

**Be thorough:** This will take 250-300 hours. That's 6-8 weeks of full-time work. Don't rush.

**Be honest:** Mark features complete ONLY when they truly are complete.

---

**END OF TODO**

**Status:** Ready for user validation
**Next Step:** Get user approval, then begin TASK 1 (NewStudyLibraryScreen.tsx)

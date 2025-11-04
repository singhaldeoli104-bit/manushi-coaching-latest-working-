# Student Components Guide

**Complete reference for all 24 Phase 0 components**
**Location:** `C:\PC\OLD\src\components\student\`
**Last Updated:** 2025-10-29

---

## Table of Contents

### Week 1: Core UI Components (Atoms & Molecules)
1. [Button](#1-button) - 5 MD3 variants
2. [Card](#2-card) - 3 elevation variants
3. [Badge](#3-badge) - Notifications & status indicators
4. [Tabs](#4-tabs) - Primary & secondary navigation
5. [Modal](#5-modal) - Full-screen & dialog variants
6. [BottomSheet](#6-bottomsheet) - Draggable sheet
7. [SearchBar](#7-searchbar) - Debounced search input
8. [EmptyState](#8-emptystate) - No data display
9. [LoadingState](#9-loadingstate) - Skeleton screens

### Week 2: Navigation Components
10. [StudentTopBar](#10-studenttopbar) - Top app bar with menu
11. [StudentDrawer](#11-studentdrawer) - Side navigation drawer
12. [StudentBottomNav](#12-studentbottomnav) - Bottom navigation

### Week 4: Live Class Components (Organisms)
13. [ParticipantsList](#13-participantslist) - Live participants
14. [ChatPanel](#14-chatpanel) - Real-time messaging
15. [PollsWidget](#15-pollswidget) - Live polling
16. [ScreenShareViewer](#16-screenshareviewer) - Screen sharing display
17. [LiveClassControls](#17-liveclasscontrols) - Mic/camera controls

### Week 4: Specialized Organisms
18. [FilterPanel](#18-filterpanel) - Advanced filtering

---

## Week 1: Core UI Components

---

### 1. Button

**Location:** `src/components/student/atoms/Button.tsx`
**Purpose:** Material Design 3 compliant button with 5 variants

#### Props

```typescript
interface ButtonProps {
  /** Button label text */
  label: string;

  /** Press handler */
  onPress: () => void;

  /** Button variant */
  variant?: 'filled' | 'filled-tonal' | 'outlined' | 'text' | 'elevated';

  /** Button size */
  size?: 'small' | 'medium' | 'large'; // 32dp, 40dp, 48dp

  /** Disabled state */
  disabled?: boolean;

  /** Loading state (shows spinner) */
  loading?: boolean;

  /** Leading icon */
  icon?: React.ReactNode;

  /** Trailing icon */
  trailingIcon?: React.ReactNode;

  /** Full width button */
  fullWidth?: boolean;

  /** Custom style */
  style?: ViewStyle;
}
```

#### Usage Examples

```typescript
import { Button } from '@/components/student/atoms';

// Filled button (primary action)
<Button
  label="Submit Assignment"
  variant="filled"
  onPress={handleSubmit}
/>

// Loading state
<Button
  label="Uploading..."
  variant="filled"
  loading={true}
  disabled={true}
  onPress={handleUpload}
/>

// With icon
<Button
  label="Download PDF"
  variant="outlined"
  icon={<DownloadIcon />}
  onPress={handleDownload}
/>

// Small button
<Button
  label="Cancel"
  variant="text"
  size="small"
  onPress={handleCancel}
/>
```

#### Variants

| Variant | Use Case | Background | Border |
|---------|----------|------------|--------|
| **filled** | Primary actions | Primary color | None |
| **filled-tonal** | Secondary actions | PrimaryContainer | None |
| **outlined** | Medium emphasis | Transparent | Outline |
| **text** | Low emphasis | Transparent | None |
| **elevated** | Floating actions | Surface + elevation | None |

#### When to Use

- **Filled:** Submit forms, primary CTAs, main actions
- **Filled-tonal:** Secondary but important actions (e.g., "Save Draft")
- **Outlined:** Alternative actions (e.g., "Cancel", "View Details")
- **Text:** Low-priority actions (e.g., "Skip", "Learn More")
- **Elevated:** Floating action buttons (FABs)

#### Common Mistakes

❌ **Don't:** Use multiple filled buttons in the same row
✅ **Do:** Use one filled (primary) + outlined/text (secondary)

❌ **Don't:** Put long text in small buttons
✅ **Do:** Use medium/large size for text >12 characters

---

### 2. Card

**Location:** `src/components/student/atoms/Card.tsx`
**Purpose:** Container component with 3 elevation variants

#### Props

```typescript
interface CardProps {
  /** Card variant */
  variant?: 'elevated' | 'filled' | 'outlined';

  /** Card content */
  children: React.ReactNode;

  /** Press handler (makes card pressable) */
  onPress?: () => void;

  /** Custom elevation (0-4dp) */
  elevation?: number;

  /** Custom style */
  style?: ViewStyle;
}
```

#### Usage Examples

```typescript
import { Card } from '@/components/student/atoms';

// Elevated card (default)
<Card variant="elevated">
  <View style={{ padding: 16 }}>
    <Text>Assignment Title</Text>
    <Text>Due: Tomorrow</Text>
  </View>
</Card>

// Pressable card
<Card
  variant="outlined"
  onPress={() => navigation.navigate('AssignmentDetail', { id })}
>
  <CardContent>
    <Text>Click to view details</Text>
  </CardContent>
</Card>

// Filled card
<Card variant="filled">
  <View style={{ padding: 20 }}>
    <Text>Progress: 75%</Text>
  </View>
</Card>
```

#### Sub-components

**CardHeader:**
```typescript
<Card>
  <CardHeader
    title="Physics Assignment"
    subtitle="Due: Oct 30"
    avatar={<Avatar />}
    action={<IconButton icon="more-vert" />}
  />
</Card>
```

**CardContent:**
```typescript
<Card>
  <CardContent>
    <Text>Main content goes here</Text>
  </CardContent>
</Card>
```

**CardActions:**
```typescript
<Card>
  <CardActions>
    <Button label="Cancel" variant="text" />
    <Button label="Submit" variant="filled" />
  </CardActions>
</Card>
```

#### When to Use

- **Elevated:** Default choice for most content cards
- **Filled:** Highlighted or selected cards
- **Outlined:** Subtle containers, form groups

---

### 3. Badge

**Location:** `src/components/student/atoms/Badge.tsx`
**Purpose:** Notification counters and status indicators

#### Props

```typescript
interface BadgeProps {
  /** Badge content (number or empty for dot) */
  value?: number;

  /** Badge variant */
  variant?: 'error' | 'warning' | 'success' | 'info';

  /** Badge size */
  size?: 'small' | 'standard' | 'large'; // 6dp, 16dp, 20dp

  /** Position relative to parent */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  /** Custom style */
  style?: ViewStyle;
}
```

#### Usage Examples

```typescript
import { Badge } from '@/components/student/atoms';

// Notification count
<View style={{ position: 'relative' }}>
  <BellIcon />
  <Badge value={5} variant="error" position="top-right" />
</View>

// Dot indicator (no number)
<View style={{ position: 'relative' }}>
  <ProfileIcon />
  <Badge variant="success" size="small" position="bottom-right" />
</View>

// Large badge with count
<Badge value={150} variant="info" size="large" />

// 99+ overflow
<Badge value={120} variant="error" /> // Shows "99+"
```

#### Variants

| Variant | Color | Use Case |
|---------|-------|----------|
| **error** | Red | Notifications, unread messages |
| **warning** | Orange | Pending items, warnings |
| **success** | Green | Online status, completed |
| **info** | Blue | General information |

#### When to Use

- **With icons:** Show notification counts
- **On avatars:** Online/offline status
- **On tabs:** Unread counts per section
- **Standalone:** Status indicators

---

### 4. Tabs

**Location:** `src/components/student/molecules/Tabs.tsx`
**Purpose:** Primary & secondary tab navigation

#### Props

```typescript
interface TabsProps {
  /** Tab items */
  tabs: TabItem[];

  /** Active tab key */
  activeTab: string;

  /** Tab change handler */
  onTabChange: (key: string) => void;

  /** Tab variant */
  variant?: 'primary' | 'secondary';

  /** Scrollable for 6+ tabs */
  scrollable?: boolean;

  /** Custom style */
  style?: ViewStyle;
}

interface TabItem {
  key: string;
  label: string;
  badge?: number;
  disabled?: boolean;
}
```

#### Usage Examples

```typescript
import { Tabs } from '@/components/student/molecules';

const [activeTab, setActiveTab] = useState('all');

// Primary tabs (full-width indicator)
<Tabs
  tabs={[
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending', badge: 3 },
    { key: 'completed', label: 'Completed' },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="primary"
/>

// Secondary tabs (pill-style)
<Tabs
  tabs={[
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="secondary"
/>

// Scrollable tabs (6+ items)
<Tabs
  tabs={subjects.map(s => ({ key: s.id, label: s.name }))}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  scrollable={true}
/>
```

#### When to Use

- **Primary:** Main content sections (3-5 tabs)
- **Secondary:** Filtering/sorting options
- **Scrollable:** Subject lists, many categories (6+ tabs)

#### Common Mistakes

❌ **Don't:** Use more than 5 primary tabs (use scrollable instead)
✅ **Do:** Switch to scrollable variant for 6+ tabs

❌ **Don't:** Nest tabs inside tabs
✅ **Do:** Use filters or segmented controls for sub-navigation

---

### 5. Modal

**Location:** `src/components/student/molecules/Modal.tsx`
**Purpose:** Full-screen and dialog modals

#### Props

```typescript
interface ModalProps {
  /** Modal visibility */
  visible: boolean;

  /** Close handler */
  onClose: () => void;

  /** Modal variant */
  variant?: 'fullscreen' | 'dialog';

  /** Modal title */
  title?: string;

  /** Modal content */
  children: React.ReactNode;

  /** Footer actions */
  actions?: React.ReactNode;

  /** Dismiss on backdrop press */
  dismissable?: boolean;

  /** Custom style */
  style?: ViewStyle;
}
```

#### Usage Examples

```typescript
import { Modal } from '@/components/student/molecules';

const [visible, setVisible] = useState(false);

// Dialog modal (centered)
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  variant="dialog"
  title="Confirm Submission"
  actions={
    <>
      <Button label="Cancel" variant="text" onPress={() => setVisible(false)} />
      <Button label="Submit" variant="filled" onPress={handleSubmit} />
    </>
  }
>
  <Text>Are you sure you want to submit this assignment?</Text>
</Modal>

// Full-screen modal
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  variant="fullscreen"
  title="Assignment Details"
  dismissable={true}
>
  <ScrollView>
    <Text>Full assignment content...</Text>
  </ScrollView>
</Modal>
```

#### When to Use

- **Dialog:** Confirmations, alerts, short forms (2-5 fields)
- **Fullscreen:** Long forms, detailed content, complex interactions

---

### 6. BottomSheet

**Location:** `src/components/student/molecules/BottomSheet.tsx`
**Purpose:** Draggable bottom sheet

#### Props

```typescript
interface BottomSheetProps {
  /** Sheet visibility */
  visible: boolean;

  /** Close handler */
  onClose: () => void;

  /** Sheet content */
  children: React.ReactNode;

  /** Sheet height (percentage) */
  height?: number; // 0.5 = 50%, 0.9 = 90%

  /** Show drag handle */
  showHandle?: boolean;

  /** Dismiss on backdrop press */
  dismissable?: boolean;

  /** Custom style */
  style?: ViewStyle;
}
```

#### Usage Examples

```typescript
import { BottomSheet } from '@/components/student/molecules';

// Filter bottom sheet
<BottomSheet
  visible={filterVisible}
  onClose={() => setFilterVisible(false)}
  height={0.7}
  showHandle={true}
>
  <View style={{ padding: 20 }}>
    <Text style={styles.title}>Filter Options</Text>
    <FilterForm />
  </View>
</BottomSheet>

// Action menu
<BottomSheet
  visible={menuVisible}
  onClose={() => setMenuVisible(false)}
  height={0.4}
  dismissable={true}
>
  <Button label="Edit" onPress={handleEdit} />
  <Button label="Delete" variant="text" onPress={handleDelete} />
  <Button label="Cancel" variant="text" onPress={() => setMenuVisible(false)} />
</BottomSheet>
```

#### When to Use

- **Filters:** Show filtering options
- **Actions:** Context menus, action sheets
- **Quick forms:** Date pickers, select options

---

### 7. SearchBar

**Location:** `src/components/student/molecules/SearchBar.tsx`
**Purpose:** Debounced search input field

#### Props

```typescript
interface SearchBarProps {
  /** Search value */
  value: string;

  /** Change handler */
  onChange: (text: string) => void;

  /** Search handler (debounced) */
  onSearch: (query: string) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Show voice search icon */
  showVoiceSearch?: boolean;

  /** Debounce delay (ms) */
  debounceDelay?: number; // Default: 300ms

  /** Custom style */
  style?: ViewStyle;
}
```

#### Usage Examples

```typescript
import { SearchBar } from '@/components/student/molecules';

const [query, setQuery] = useState('');

// Basic search
<SearchBar
  value={query}
  onChange={setQuery}
  onSearch={handleSearch}
  placeholder="Search assignments..."
/>

// With voice search
<SearchBar
  value={query}
  onChange={setQuery}
  onSearch={handleSearch}
  showVoiceSearch={true}
  debounceDelay={500}
/>

// Real-time search
useEffect(() => {
  if (query.length > 2) {
    // Automatically debounced by SearchBar
    searchAssignments(query);
  }
}, [query]);
```

#### When to Use

- **List filtering:** Search through assignments, classes
- **Student search:** Find classmates, teachers
- **Content search:** Search notes, materials

---

### 8. EmptyState

**Location:** `src/components/student/molecules/EmptyState.tsx`
**Purpose:** Display when no data is available

#### Props

```typescript
interface EmptyStateProps {
  /** Icon component */
  icon?: React.ReactNode;

  /** Title text */
  title: string;

  /** Description text */
  description?: string;

  /** Action button */
  action?: {
    label: string;
    onPress: () => void;
  };

  /** Custom style */
  style?: ViewStyle;
}
```

#### Usage Examples

```typescript
import { EmptyState } from '@/components/student/molecules';

// No assignments
<EmptyState
  icon={<AssignmentIcon size={48} />}
  title="No Assignments Yet"
  description="You don't have any pending assignments. Check back later!"
/>

// With action
<EmptyState
  icon={<ClassIcon size={48} />}
  title="No Classes Today"
  description="Enjoy your free day! Check your schedule for upcoming classes."
  action={{
    label: "View Schedule",
    onPress: () => navigation.navigate('Schedule')
  }}
/>
```

#### When to Use

- **Empty lists:** No data returned from query
- **Filtered results:** No matches for search/filter
- **First-time experience:** User hasn't created content yet

---

### 9. LoadingState

**Location:** `src/components/student/molecules/LoadingState.tsx`
**Purpose:** Loading indicators and skeleton screens

#### Props

```typescript
interface LoadingStateProps {
  /** Loading variant */
  variant?: 'spinner' | 'linear' | 'skeleton-card' | 'skeleton-list' | 'skeleton-profile';

  /** Loading text (optional) */
  text?: string;

  /** Show as overlay */
  overlay?: boolean;

  /** Number of skeleton items */
  count?: number; // For skeleton-list

  /** Custom style */
  style?: ViewStyle;
}
```

#### Usage Examples

```typescript
import { LoadingState } from '@/components/student/molecules';

// Spinner (full-screen)
<LoadingState variant="spinner" text="Loading assignments..." />

// Linear progress bar
<LoadingState variant="linear" />

// Skeleton card
<LoadingState variant="skeleton-card" />

// Skeleton list (3 items)
<LoadingState variant="skeleton-list" count={3} />

// Overlay spinner
<LoadingState variant="spinner" overlay={true} text="Submitting..." />
```

#### When to Use

- **Initial load:** Show spinner while fetching data
- **Optimistic UI:** Show skeleton screens
- **Background tasks:** Overlay spinner for async operations

---

## Week 2: Navigation Components

---

### 10. StudentTopBar

**Location:** `src/components/student/navigation/StudentTopBar.tsx`
**Purpose:** Top app bar with menu and actions

#### Props

```typescript
interface StudentTopBarProps {
  /** Screen title */
  title: string;

  /** Top bar variant */
  variant?: 'center-aligned' | 'small';

  /** Menu icon press handler */
  onMenuPress?: () => void;

  /** Show back button instead of menu */
  showBackButton?: boolean;

  /** Back button press handler */
  onBackPress?: () => void;

  /** Hide menu icon */
  hideMenuIcon?: boolean;

  /** Overflow menu items */
  menuItems?: MenuItem[];

  /** Custom action buttons */
  actions?: React.ReactNode;

  /** Show elevation (for scrolled state) */
  elevated?: boolean;

  /** Custom style */
  style?: ViewStyle;
}

interface MenuItem {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  divider?: boolean;
}
```

#### Usage Examples

```typescript
import { StudentTopBar } from '@/components/student/navigation';

// Basic top bar
<StudentTopBar
  title="Dashboard"
  onMenuPress={() => navigation.openDrawer()}
/>

// With back button
<StudentTopBar
  title="Assignment Details"
  showBackButton={true}
  onBackPress={() => navigation.goBack()}
/>

// With menu items
<StudentTopBar
  title="My Assignments"
  onMenuPress={() => navigation.openDrawer()}
  menuItems={[
    { label: 'Settings', onPress: handleSettings },
    { label: 'Help', onPress: handleHelp },
    { label: 'Logout', onPress: handleLogout, divider: true },
  ]}
/>

// With elevated state (on scroll)
const [scrollY, setScrollY] = useState(0);

<StudentTopBar
  title="Classes"
  elevated={scrollY > 0}
  onMenuPress={() => navigation.openDrawer()}
/>
```

#### When to Use

- **Every screen:** Standard top bar across all student screens
- **Back button:** Nested screens (details, forms)
- **Menu items:** Quick access to settings, help

---

### 11. StudentDrawer

**Location:** `src/components/student/navigation/StudentDrawer.tsx`
**Purpose:** Side navigation drawer

#### Props

```typescript
interface StudentDrawerProps {
  /** Drawer visibility */
  visible: boolean;

  /** Close handler */
  onClose: () => void;

  /** Currently active route */
  activeRoute?: string;

  /** Profile data (optional - uses StudentContext if not provided) */
  profileData?: DrawerProfileData;

  /** Navigation items */
  navigationItems: DrawerNavigationItem[];

  /** Footer content */
  footer?: React.ReactNode;

  /** Custom drawer width (default 280dp) */
  drawerWidth?: number;
}

interface DrawerProfileData {
  name: string;
  email: string;
  avatar?: string;
  onProfilePress?: () => void;
}

interface DrawerNavigationItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  badge?: number;
  sectionHeader?: string;
  divider?: boolean;
}
```

#### Usage Examples

```typescript
import { StudentDrawer } from '@/components/student/navigation';

const [drawerVisible, setDrawerVisible] = useState(false);

// Drawer with auto-loaded profile (uses StudentContext)
<StudentDrawer
  visible={drawerVisible}
  onClose={() => setDrawerVisible(false)}
  activeRoute="Dashboard"
  navigationItems={[
    {
      key: 'Dashboard',
      label: 'Dashboard',
      icon: <HomeIcon />,
      onPress: () => navigation.navigate('Dashboard')
    },
    {
      key: 'Classes',
      label: 'My Classes',
      icon: <ClassIcon />,
      badge: 3,
      onPress: () => navigation.navigate('Classes')
    },
    {
      key: 'Schedule',
      label: 'Schedule',
      icon: <CalendarIcon />,
      onPress: () => navigation.navigate('Schedule'),
      sectionHeader: 'Learning'
    },
    {
      key: 'Assignments',
      label: 'Assignments',
      icon: <AssignmentIcon />,
      badge: 5,
      onPress: () => navigation.navigate('Assignments')
    },
  ]}
/>

// Drawer with custom profile
<StudentDrawer
  visible={drawerVisible}
  onClose={() => setDrawerVisible(false)}
  profileData={{
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://...',
    onProfilePress: () => navigation.navigate('Profile')
  }}
  navigationItems={navItems}
  footer={
    <Button
      label="Logout"
      variant="text"
      onPress={handleLogout}
    />
  }
/>
```

#### When to Use

- **Primary navigation:** Main app navigation (home, classes, assignments)
- **Profile access:** Quick access to student profile
- **Settings:** Link to settings, help, logout

---

### 12. StudentBottomNav

**Location:** `src/components/student/navigation/StudentBottomNav.tsx`
**Purpose:** Bottom navigation bar (3-5 destinations)

#### Props

```typescript
interface StudentBottomNavProps {
  /** Currently active route */
  activeRoute: string;

  /** Navigation items (3-5 items) */
  navigationItems: BottomNavItem[];

  /** Hide labels on inactive items */
  hideInactiveLabels?: boolean;

  /** Custom style */
  style?: ViewStyle;
}

interface BottomNavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  badge?: number | boolean;
  disabled?: boolean;
}
```

#### Usage Examples

```typescript
import { StudentBottomNav } from '@/components/student/navigation';

const [activeRoute, setActiveRoute] = useState('Dashboard');

<StudentBottomNav
  activeRoute={activeRoute}
  navigationItems={[
    {
      key: 'Dashboard',
      label: 'Home',
      icon: <HomeIcon />,
      onPress: () => navigation.navigate('Dashboard')
    },
    {
      key: 'Classes',
      label: 'Classes',
      icon: <ClassIcon />,
      badge: 3,
      onPress: () => navigation.navigate('Classes')
    },
    {
      key: 'Schedule',
      label: 'Schedule',
      icon: <CalendarIcon />,
      onPress: () => navigation.navigate('Schedule')
    },
    {
      key: 'Chat',
      label: 'Chat',
      icon: <ChatIcon />,
      badge: 12,
      onPress: () => navigation.navigate('Chat')
    },
    {
      key: 'More',
      label: 'More',
      icon: <MoreIcon />,
      onPress: () => navigation.navigate('More')
    },
  ]}
  hideInactiveLabels={false}
/>
```

#### When to Use

- **Primary navigation:** 3-5 most important destinations
- **Quick access:** Frequently used screens

#### Common Mistakes

❌ **Don't:** Use more than 5 items (use drawer instead)
✅ **Do:** Keep it to 3-5 most important destinations

❌ **Don't:** Duplicate drawer navigation
✅ **Do:** Use bottom nav for frequent, drawer for comprehensive

---

## Week 4: Live Class Components

---

### 13. ParticipantsList

**Location:** `src/components/student/organisms/ParticipantsList.tsx`
**Purpose:** Display live class participants with real-time status

#### Props

```typescript
interface ParticipantsListProps {
  /** Class ID */
  classId: string;

  /** Current user ID */
  currentUserId: string;

  /** Participant press handler */
  onParticipantPress?: (participant: Participant) => void;

  /** Custom style */
  style?: ViewStyle;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: 'host' | 'teacher' | 'student';
  status: 'online' | 'offline';
  raisedHand: boolean;
  isSpeaking: boolean;
  micEnabled: boolean;
  cameraEnabled: boolean;
  joinedAt: string;
}
```

#### Usage Examples

```typescript
import { ParticipantsList } from '@/components/student/organisms';

<ParticipantsList
  classId={liveClassId}
  currentUserId={user.id}
  onParticipantPress={(participant) => {
    console.log('Selected:', participant.name);
  }}
/>
```

#### Features

- ✅ Real-time Supabase subscription
- ✅ Role badges (Host/Teacher/Student)
- ✅ Raised hand indicator
- ✅ Speaking animation
- ✅ Mic/camera status icons
- ✅ FlatList optimization (10 items rendered)

---

### 14. ChatPanel

**Location:** `src/components/student/organisms/ChatPanel.tsx`
**Purpose:** Real-time chat for live classes

#### Props

```typescript
interface ChatPanelProps {
  /** Class ID */
  classId: string;

  /** Current user ID */
  currentUserId: string;

  /** Current user name */
  currentUserName: string;

  /** Custom style */
  style?: ViewStyle;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}
```

#### Usage Examples

```typescript
import { ChatPanel } from '@/components/student/organisms';

<ChatPanel
  classId={liveClassId}
  currentUserId={user.id}
  currentUserName={user.name}
/>
```

#### Features

- ✅ Real-time messaging (Supabase subscription)
- ✅ Typing indicators
- ✅ Auto-scroll to latest
- ✅ Inverted FlatList (chat UX)
- ✅ Keyboard avoiding view
- ✅ Message bubbles (self vs others)

---

### 15. PollsWidget

**Location:** `src/components/student/organisms/PollsWidget.tsx`
**Purpose:** Live polling with real-time vote counts

#### Props

```typescript
interface PollsWidgetProps {
  /** Class ID */
  classId: string;

  /** Current user ID */
  currentUserId: string;

  /** Custom style */
  style?: ViewStyle;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  status: 'active' | 'closed';
  totalVotes: number;
  userVoteId: string | null;
  hasVoted: boolean;
  endsAt: string | null;
  timeRemaining: number | null;
  createdAt: string;
}

interface PollOption {
  id: string;
  text: string;
  voteCount: number;
  percentage: number;
}
```

#### Usage Examples

```typescript
import { PollsWidget } from '@/components/student/organisms';

<PollsWidget
  classId={liveClassId}
  currentUserId={user.id}
/>
```

#### Features

- ✅ Real-time vote updates
- ✅ Percentage bars
- ✅ Vote submission (useMutation)
- ✅ Poll timer with countdown
- ✅ Already voted state
- ✅ Multiple active polls

---

### 16. ScreenShareViewer

**Location:** `src/components/student/organisms/ScreenShareViewer.tsx`
**Purpose:** Display shared screen content

#### Props

```typescript
interface ScreenShareViewerProps {
  /** Screen share stream URL */
  streamUrl: string | null;

  /** Is screen sharing active */
  isSharing: boolean;

  /** Aspect ratio */
  aspectRatio?: '16:9' | '4:3' | 'auto';

  /** Custom style */
  style?: ViewStyle;
}
```

#### Usage Examples

```typescript
import { ScreenShareViewer } from '@/components/student/organisms';

<ScreenShareViewer
  streamUrl={screenShareUrl}
  isSharing={isScreenSharing}
  aspectRatio="16:9"
/>
```

#### Features

- ✅ Aspect ratio support (16:9, 4:3, auto)
- ✅ Fullscreen toggle
- ✅ Zoom controls (in/out/reset)
- ✅ Live indicator
- ✅ Empty state with proper icon

---

### 17. LiveClassControls

**Location:** `src/components/student/organisms/LiveClassControls.tsx`
**Purpose:** Control panel for mic, camera, hand raise, leave

#### Props

```typescript
interface LiveClassControlsProps {
  /** Is microphone enabled */
  micEnabled: boolean;

  /** Is camera enabled */
  cameraEnabled: boolean;

  /** Is hand raised */
  handRaised: boolean;

  /** Is class being recorded */
  isRecording: boolean;

  /** Connection quality */
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';

  /** Mic toggle handler */
  onMicToggle: () => void;

  /** Camera toggle handler */
  onCameraToggle: () => void;

  /** Hand raise toggle handler */
  onHandRaise: () => void;

  /** Leave class handler */
  onLeaveClass: () => void;

  /** Custom style */
  style?: ViewStyle;
}
```

#### Usage Examples

```typescript
import { LiveClassControls } from '@/components/student/organisms';

const [micEnabled, setMicEnabled] = useState(false);
const [cameraEnabled, setCameraEnabled] = useState(false);
const [handRaised, setHandRaised] = useState(false);

<LiveClassControls
  micEnabled={micEnabled}
  cameraEnabled={cameraEnabled}
  handRaised={handRaised}
  isRecording={true}
  connectionQuality="good"
  onMicToggle={() => setMicEnabled(!micEnabled)}
  onCameraToggle={() => setCameraEnabled(!cameraEnabled)}
  onHandRaise={() => setHandRaised(!handRaised)}
  onLeaveClass={handleLeaveClass}
/>
```

#### Features

- ✅ Haptic feedback on all buttons
- ✅ Pulse animation for raised hand
- ✅ Recording indicator with blink
- ✅ Connection quality bars
- ✅ Leave confirmation modal

---

### 18. FilterPanel

**Location:** `src/components/student/organisms/FilterPanel.tsx`
**Purpose:** Advanced filtering UI

#### Props

```typescript
interface FilterPanelProps {
  /** Panel visibility */
  visible: boolean;

  /** Close handler */
  onClose: () => void;

  /** Filter categories */
  categories: FilterCategory[];

  /** Apply filters handler */
  onApply: (filters: Record<string, any>) => void;

  /** Reset filters handler */
  onReset: () => void;

  /** Custom style */
  style?: ViewStyle;
}

interface FilterCategory {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date';
  options?: FilterOption[];
  min?: number;
  max?: number;
  value?: any;
}

interface FilterOption {
  value: string;
  label: string;
}
```

#### Usage Examples

```typescript
import { FilterPanel } from '@/components/student/organisms';

const [filterVisible, setFilterVisible] = useState(false);

<FilterPanel
  visible={filterVisible}
  onClose={() => setFilterVisible(false)}
  categories={[
    {
      key: 'subject',
      label: 'Subject',
      type: 'multiselect',
      options: [
        { value: 'math', label: 'Mathematics' },
        { value: 'physics', label: 'Physics' },
        { value: 'chemistry', label: 'Chemistry' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'graded', label: 'Graded' },
      ],
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      type: 'date',
    },
  ]}
  onApply={(filters) => {
    console.log('Applied filters:', filters);
    setFilterVisible(false);
  }}
  onReset={() => {
    console.log('Reset filters');
  }}
/>
```

#### Features

- ✅ Slide-in animation from right
- ✅ Multiple filter types (select, multiselect, range, date)
- ✅ Apply/Reset actions
- ✅ Chip display for active filters

---

## Best Practices

### Component Composition

**Good Example:**
```typescript
<Card variant="elevated">
  <CardHeader
    title="Physics Assignment"
    subtitle="Due: Tomorrow"
  />
  <CardContent>
    <Text>Complete chapters 5-7</Text>
  </CardContent>
  <CardActions>
    <Button label="View" variant="text" onPress={handleView} />
    <Button label="Submit" variant="filled" onPress={handleSubmit} />
  </CardActions>
</Card>
```

**Bad Example:**
```typescript
// ❌ Don't create custom card structure
<View style={styles.customCard}>
  <View style={styles.customHeader}>...</View>
  <View style={styles.customContent}>...</View>
</View>
```

### TypeScript Usage

**Always import types:**
```typescript
import { Button, ButtonProps } from '@/components/student/atoms';
import type { TabItem } from '@/components/student/molecules';
```

### Performance

**FlatList optimization:**
```typescript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
/>
```

---

## Common Mistakes

### 1. Not using BaseScreen wrapper

❌ **Wrong:**
```typescript
<View>
  {loading && <LoadingState />}
  {error && <Text>Error</Text>}
  {data && <Content />}
</View>
```

✅ **Correct:**
```typescript
<BaseScreen loading={loading} error={error} empty={!data}>
  <Content data={data} />
</BaseScreen>
```

### 2. Mock data instead of Supabase

❌ **Wrong:**
```typescript
const [assignments] = useState([
  { id: '1', title: 'Test' }
]);
```

✅ **Correct:**
```typescript
const { data: assignments } = useQuery({
  queryKey: ['assignments', studentId],
  queryFn: () => fetchAssignments(studentId)
});
```

### 3. Not memoizing components

❌ **Wrong:**
```typescript
const AssignmentCard = ({ assignment }) => {
  return <Card>...</Card>;
};
```

✅ **Correct:**
```typescript
const AssignmentCard = React.memo(({ assignment }) => {
  return <Card>...</Card>;
});
```

---

## Migration from Old Components

| Old Component | New Component | Changes |
|---------------|---------------|---------|
| `<TouchableOpacity>` | `<Button>` | Use MD3 variants |
| Custom cards | `<Card>` | Use MD3 elevation system |
| Custom modals | `<Modal>` or `<BottomSheet>` | Use MD3 animations |
| Custom tabs | `<Tabs>` | Use MD3 indicator styles |
| Custom search | `<SearchBar>` | Debouncing built-in |

---

**Next:** See [STUDENT_HOOKS_GUIDE.md](./STUDENT_HOOKS_GUIDE.md) for context and hooks documentation

**Last Updated:** 2025-10-29
**Components:** 24 (9 atoms/molecules + 3 navigation + 5 organisms + 7 specialized)

# Material Design 3 Implementation Guide

## Overview

This app now follows **Material Design 3 (MD3)** specifications for a professional, consistent, and modern user experience.

---

## What Changed? ✨

### 1. Design System (`designSystem.ts`)

#### Colors (Calm & Clear)
```typescript
// Primary: Blue (#2563EB) - calm, professional
Colors.primary = '#2563EB'
Colors.primaryContainer = '#DBEAFE'

// Alternative: Teal (#14B8A6) - modern, fresh
// Uncomment in designSystem.ts to use teal instead

// Text: High contrast for readability
Colors.textPrimary = '#0F172A'    // Near black
Colors.textSecondary = '#475569'  // Medium gray
Colors.textTertiary = '#94A3B8'   // Light gray

// Surfaces
Colors.surface = '#FFFFFF'        // Pure white
Colors.background = '#F8FAFC'     // Soft gray-blue
Colors.surfaceVariant = '#F1F5F9' // Variant backgrounds
```

#### Typography (sp - Scale-independent Pixels)
```typescript
Typography.fontSize = {
  tiny: 12,        // Badges, tiny labels
  caption: 13,     // Captions, metadata
  small: 14,       // Secondary text
  body: 16,        // Body default (MD3 standard)
  subtitle: 16,    // Card titles
  title: 18,       // Section headers
  headline: 20,    // App title (top bar)
  display: 22,     // Large displays
}

Typography.fontFamily.default = 'Roboto'  // Keeps APK lean
```

#### Spacing (8dp Grid System)
```typescript
Spacing = {
  xs: 4,      // 4dp
  sm: 8,      // 8dp - base grid unit
  md: 12,     // 12dp
  base: 16,   // 16dp - standard spacing
  lg: 24,     // 24dp
  xl: 32,     // 32dp
  '2xl': 40,  // 40dp
  '3xl': 48,  // 48dp
}
```

#### Border Radius (MD3 Standard)
```typescript
BorderRadius = {
  sm: 8,      // 8dp - Inputs
  md: 12,     // 12dp - Cards
  lg: 16,     // 16dp - FAB
  xl: 20,     // 20dp - Large components
  full: 9999, // Pill shape
}
```

#### Elevation (MD3 Levels: 1/3/6)
```typescript
Shadows = {
  resting: elevation 1,  // Cards, buttons resting state
  hover: elevation 3,    // Hover state
  raised: elevation 6,   // FAB, dialogs, raised state
}
```

#### Layout Specifications
```typescript
// Touch Targets
Layout.touchTarget.min = 48  // 48dp minimum (MD3)

// Navigation
Layout.topAppBar.height = 56        // 56dp
Layout.bottomNavigation.height = 64 // 64-72dp

// Components
Layout.fab.default = 56             // 56dp FAB
Layout.listRow.comfortable = 64     // 64dp list rows
Layout.inputField.height = 48       // 48dp inputs

// Avatars
Layout.avatarSize = {
  tiny: 24,     // In chips
  small: 32,    // Profile in top bar
  medium: 40,   // List items
  large: 48,    // Cards
  xlarge: 60,   // Headers
}

// Icons
Layout.iconSize = {
  small: 16,
  medium: 20,
  default: 24,  // MD3 standard
  large: 32,
}
```

---

## New Components

### 1. Child Switcher (`ChildSwitcher.tsx`)

**Purpose:** Allow parents to switch between multiple children's data.

**Specifications:**
- Height: 40dp pill
- Avatar: 24dp (left)
- Name: 14-16sp (center)
- Dropdown icon (right)
- Opens bottom sheet (max 60% height)

**Usage:**
```typescript
import { ChildSwitcher, type Child } from '../components/common';

const children: Child[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    grade: 'Grade 10-A',
    attendance: 'present',
    avatarColor: Colors.primary,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    grade: 'Grade 8-B',
    attendance: 'absent',
    avatarColor: Colors.accent,
  },
];

<ChildSwitcher
  children={children}
  selectedChildId={selectedId}
  onSelectChild={handleSelectChild}
  showAllOption={true}  // Adds "All Children" option
/>
```

**Features:**
- Bottom sheet with all children
- Attendance dot indicator (green/red/gray)
- "All Children" aggregated view option
- "Manage Children" footer link
- Selected child highlighted
- Smooth animations

### 2. Enhanced Dashboard Header

**New Features:**
- Optional Child Switcher in top bar
- Search icon button
- Notifications with badge count
- Profile avatar (32dp)
- Material Design 3 styling

**Usage:**
```typescript
<DashboardHeader
  userName="Priya Sharma"
  userEmail="priya@example.com"

  // Child Switcher
  showChildSwitcher={true}
  children={children}
  selectedChildId={selectedId}
  onSelectChild={handleSelectChild}

  // Actions
  onSearchPress={() => console.log('Search')}
  onNotificationsPress={() => console.log('Notifications')}
  notificationCount={3}
  onProfilePress={() => console.log('Profile')}
/>
```

---

## Screen-by-Screen Layout (MD3 Compliant)

### A) Home Dashboard

```
┌─────────────────────────────────────┐
│ Top App Bar (56dp)                  │
│ [Child Switcher] [Search] [Bell]   │
├─────────────────────────────────────┤
│ User Info Section                   │
│ [Avatar 60dp] Name, Email           │
│ [Status Chip]                       │
├─────────────────────────────────────┤
│ Alert Banner (56-72dp) - Optional  │
│ "PTM Week - Book a slot"           │
├─────────────────────────────────────┤
│ Quick Actions (96-112dp card)      │
│ [Report Absence] [Message Teacher] │
│ [Pay Fee] [Upload Doc]             │
├─────────────────────────────────────┤
│ Today Card                          │
│ • Attendance: Present ✓             │
│ • Next class: Math - Room 101       │
│ • Assignments due (2)               │
├─────────────────────────────────────┤
│ Upcoming (7 days)                   │
│ [Date Badge 40dp] Event Title       │
│ [Date Badge 40dp] Event Title       │
└─────────────────────────────────────┘
```

**Sizing:**
- Top App Bar: 56dp
- Alert Banner: 56-72dp
- Quick Actions: 64x64dp buttons, 12sp labels
- List rows: 64-72dp
- Date badges: 40x40dp

### B) Messages

```
┌─────────────────────────────────────┐
│ Top App Bar: Messages [Search]     │
├─────────────────────────────────────┤
│ Tabs (48dp): All | Teachers | Admin│
├─────────────────────────────────────┤
│ Thread List (72dp each)             │
│ [Avatar 40dp] Name                  │
│ Message snippet... [Unread Badge]  │
│                                     │
│ [Avatar 40dp] Name                  │
│ Message snippet...                  │
└─────────────────────────────────────┘
```

**Sizing:**
- Top App Bar: 56dp
- Tabs: 48dp
- Thread rows: 72dp
- Avatars: 40dp
- Input: 48dp

### C) Calendar

```
┌─────────────────────────────────────┐
│ Top App Bar + Child Switcher       │
├─────────────────────────────────────┤
│ Toggle Chips (40dp):                │
│ [Month] [Week] [Day]                │
├─────────────────────────────────────┤
│ Calendar Grid                       │
│ • Event badges on dates             │
│ • Tap → Bottom sheet                │
├─────────────────────────────────────┤
│ Filters: [Type] [Teacher]           │
└─────────────────────────────────────┘
```

**Sizing:**
- Toggle chips: 40dp height
- Date badges: 40x40dp
- Bottom sheet: max 60%

### D) Payments

```
┌─────────────────────────────────────┐
│ Top App Bar                         │
├─────────────────────────────────────┤
│ Balance Summary Card                │
│ Outstanding: ₹2,500                 │
│ Due: Oct 31, 2025                   │
│ [Pay Now]                           │
├─────────────────────────────────────┤
│ Saved Payment Methods               │
│ [UPI] [Card ending 4242]            │
├─────────────────────────────────────┤
│ Receipts History                    │
│ [Date] Invoice #123 ₹5,000          │
└─────────────────────────────────────┘
```

**Security:**
- 12sp hint: "256-bit encrypted"
- No card storage notice

---

## Implementation Pattern for All Screens

### Template:
```typescript
import React, { useState } from 'react';
import { Alert } from 'react-native';
import {
  DashboardLayout,
  DashboardHeader,
  DashboardCard,
  SectionHeader,
  Section,
  ChildSwitcher,
  type Child,
} from '../components/common';
import { Colors, Spacing, Typography, Layout } from '../theme/designSystem';

const MyScreen = () => {
  const [selectedChildId, setSelectedChildId] = useState<string | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const children: Child[] = [
    { id: '1', name: 'Child 1', grade: 'Grade 10', attendance: 'present' },
    { id: '2', name: 'Child 2', grade: 'Grade 8', attendance: 'absent' },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Fetch data
    setRefreshing(false);
  };

  return (
    <DashboardLayout refreshing={refreshing} onRefresh={handleRefresh}>
      <DashboardHeader
        userName="Parent Name"
        userEmail="parent@example.com"
        showChildSwitcher={true}
        children={children}
        selectedChildId={selectedChildId}
        onSelectChild={setSelectedChildId}
        onNotificationsPress={() => Alert.alert('Notifications')}
        notificationCount={3}
      />

      <Section>
        <SectionHeader title="Section Title" icon="star" />
        <DashboardCard>
          <Card.Content>
            <Text>Your content here</Text>
          </Card.Content>
        </DashboardCard>
      </Section>
    </DashboardLayout>
  );
};
```

---

## Benefits of MD3 Implementation

### 1. **Consistency**
✅ All components follow same design language
✅ Predictable spacing (8dp grid)
✅ Standard touch targets (48dp min)

### 2. **Accessibility**
✅ High contrast text (WCAG AAA)
✅ Large touch targets
✅ Clear visual hierarchy

### 3. **Professional Appearance**
✅ Modern Material Design 3
✅ Smooth animations
✅ Proper elevation levels

### 4. **Easy Customization**
✅ Change `Colors.primary` → Updates entire app
✅ Change `Spacing.base` → Updates all spacing
✅ Change `BorderRadius.md` → Updates all cards

### 5. **Development Speed**
✅ Reusable components
✅ Pre-defined layouts
✅ Less custom styling needed

---

## Component Sizes Reference

### Navigation
| Component | Height | Notes |
|-----------|--------|-------|
| Top App Bar | 56dp | Small (MD3 standard) |
| Bottom Nav | 64-72dp | With/without labels |
| FAB | 56dp | Default size |
| Tab Row | 48dp | Standard tabs |

### Lists & Cards
| Component | Height | Notes |
|-----------|--------|-------|
| List Row | 64-72dp | Comfortable spacing |
| Card | Variable | 12dp border radius |
| Input Field | 48-56dp | Min touch target |
| Banner | 56-72dp | With/without actions |

### Avatars
| Size | Usage |
|------|-------|
| 24dp | Chips, small indicators |
| 32dp | Top bar profile |
| 40dp | List items, switcher |
| 48dp | Cards |
| 60dp | Dashboard headers |

### Icons
| Size | Usage |
|------|-------|
| 16dp | Small decorative |
| 20dp | Trailing actions |
| 24dp | Standard (MD3) |
| 32dp | Prominent actions |

### Touch Targets
| Size | Usage |
|------|-------|
| 48dp | Minimum (MD3) |
| 56dp | Comfortable |
| 64dp | Spacious (quick actions) |

---

## Color Switching

### To Use Teal Instead of Blue:

In `designSystem.ts`, uncomment:
```typescript
// Primary Colors (Calm Teal)
primary: '#14B8A6',
primaryLight: '#5EEAD4',
primaryDark: '#0F766E',
primaryContainer: '#CCFBF1',
```

And comment out blue:
```typescript
// primary: '#2563EB',        // MD3 Blue
// primaryLight: '#60A5FA',
// primaryDark: '#1E40AF',
// primaryContainer: '#DBEAFE',
```

**Result:** Entire app updates to teal color scheme! 🎨

---

## Multi-Child Support

### Features Implemented:

1. **Child Switcher Chip** (40dp pill)
   - Shows selected child's name and avatar
   - Tap to open bottom sheet

2. **Bottom Sheet Selector** (60% max height)
   - "All Children" option (aggregated view)
   - List of all children with avatars, grades
   - Attendance dot indicators
   - "Manage Children" footer link

3. **Persistence**
   - Remember last selected child per screen
   - State management with React hooks

4. **Aggregated Views**
   - When "All Children" selected:
   - Group data by child with headers
   - Show combined totals

### Usage Pattern:
```typescript
const [selectedChildId, setSelectedChildId] = useState<string | 'all'>('all');

// Filter data based on selected child
const filteredData = selectedChildId === 'all'
  ? allData
  : allData.filter(item => item.child_id === selectedChildId);
```

---

## Next Steps

### Screens to Build (Priority Order):

1. **Parent Dashboard** ✅ (Complete - already using MD3)
2. **Student Dashboard** (Use same pattern)
3. **Messages Screen** (Thread list + composer)
4. **Calendar Screen** (Grid + filters)
5. **Payments Screen** (Balance + receipts)
6. **Forms Screen** (Multi-step forms)
7. **Profile & Settings** (User info + preferences)
8. **Teacher Dashboard** (Class management)
9. **Admin Dashboard** (System overview)

### Recommended Approach:

1. Copy `NewParentDashboard.tsx` as template
2. Replace data fetching hook
3. Replace content sections
4. Add screen-specific features
5. Test with real data

**Time Estimate:** 1-2 hours per screen using design system!

---

## Testing Checklist

Before launching each screen:

- [ ] All touch targets ≥ 48dp
- [ ] Text contrast ratio ≥ 4.5:1 (AA)
- [ ] Spacing follows 8dp grid
- [ ] Colors from `designSystem.ts`
- [ ] Shadows use MD3 levels (1/3/6)
- [ ] Border radius matches component type
- [ ] Child switcher works (if applicable)
- [ ] Pull-to-refresh implemented
- [ ] Loading states shown
- [ ] Error states handled
- [ ] Empty states designed

---

## Quick Reference Commands

```bash
# Test on Android
cd /c/PC/OLD
npm run android

# Check logs
adb logcat | grep -E "ReactNativeJS"

# Clear cache if needed
npm start -- --reset-cache
```

---

*Last Updated: October 22, 2025*
*Design System Version: MD3 v1.0*

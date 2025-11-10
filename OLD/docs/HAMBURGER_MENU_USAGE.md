# Hamburger Menu Usage Guide

## Overview
The HamburgerMenu component is a slide-out navigation drawer matching the HTML reference design with theme color #4A90E2.

## Features
- **User Profile Section** - Avatar, name, grade, "View Profile" link
- **Main Navigation** - Dashboard, Classes, Library, Progress, Peers, AI Tutor
- **Quick Actions** - Ask Doubt, Schedule, Assignments, Learning Hub
- **Settings & Support** - Settings, Preferences, Notifications, Help, Contact
- **Account Options** - Switch Account, Privacy, Sign Out
- **Footer** - App version, Terms of Service, Privacy Policy

## Integration Steps

### 1. Import the Component
```typescript
import HamburgerMenu from './HamburgerMenu';
import { useState } from 'react';
```

### 2. Add State
```typescript
const [menuVisible, setMenuVisible] = useState(false);
```

### 3. Add Component to Screen
```typescript
<HamburgerMenu
  visible={menuVisible}
  onClose={() => setMenuVisible(false)}
  currentRoute="YourScreenName"  // For active state highlighting
/>
```

### 4. Connect Hamburger Icon
```typescript
<TouchableOpacity
  onPress={() => {
    trackAction('open_menu', 'YourScreenName');
    setMenuVisible(true);
  }}
  accessibilityRole="button"
  accessibilityLabel="Open menu"
>
  <T variant="h2">☰</T>
</TouchableOpacity>
```

## Example: Full Integration

```typescript
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { T } from '../../ui';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
import HamburgerMenu from './HamburgerMenu';

export default function MyScreen() {
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    trackScreenView('MyScreen');
  }, []);

  return (
    <View>
      {/* Hamburger Menu */}
      <HamburgerMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        currentRoute="MyScreen"
      />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            trackAction('open_menu', 'MyScreen');
            setMenuVisible(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <T variant="h2">☰</T>
        </TouchableOpacity>
        <T variant="title">My Screen</T>
      </View>

      {/* Screen Content */}
    </View>
  );
}
```

## Navigation Routes

The menu includes navigation to:
- `NewStudentDashboard` - Dashboard
- `NewScheduleScreen` - My Classes
- `NewStudyLibraryScreen` - Study Library
- `NewProgressDetailScreen` - My Progress
- `NewPeerLearningNetwork` - Peer Network
- `NewAITutorChat` - AI Tutor
- `NewDoubtSubmission` - Ask a Doubt
- `NewEnhancedSchedule` - View Schedule
- `NewAssignmentDetailScreen` - Assignments
- `NewGamifiedLearningHub` - Learning Hub
- `StudentProfileScreen` - Profile & Settings

## Active State
The `currentRoute` prop highlights the current screen in the menu:
```typescript
<HamburgerMenu
  visible={menuVisible}
  onClose={() => setMenuVisible(false)}
  currentRoute="NewStudentDashboard"  // This item will be highlighted
/>
```

## Styling
- Theme color: **#4A90E2**
- Background: **#F8F9FA**
- Width: **85%** (max 384px)
- Animation: **Fade in/out**
- Scrim: **50% black overlay**

## Analytics Tracking
The menu automatically tracks:
- `open_menu` - When menu is opened
- Navigation actions - Each menu item click
- Footer links - Terms, Privacy clicks

## Accessibility
All interactive elements include:
- `accessibilityRole="button"`
- `accessibilityLabel` describing the action
- Proper focus management

## Current Implementation
✅ **NewStudentDashboard.tsx** - Fully integrated
- Hamburger icon in top-left opens menu
- Profile icon in top-right opens profile

## Recommended Screens to Add
Add the hamburger menu to these high-traffic screens:
- NewScheduleScreen
- NewStudyLibraryScreen
- NewProgressDetailScreen
- NewPeerLearningNetwork
- NewEnhancedSchedule
- NewAILearningDashboard

Simply follow the integration steps above for each screen.

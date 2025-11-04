# 🎨 Design System Usage Guide

## Overview

We've created a **centralized design system** so all 50+ screens look consistent. Change one file to update the entire app!

---

## 📁 File Structure

```
src/
├── theme/
│   └── designSystem.ts          # ⭐ MAIN CONFIG - Edit here to change entire UI
├── components/
│   └── common/
│       ├── DashboardHeader.tsx   # Reusable header component
│       ├── DashboardCard.tsx     # Reusable card component
│       ├── SectionHeader.tsx     # Reusable section titles
│       ├── DashboardLayout.tsx   # Reusable layout wrapper
│       └── index.ts              # Export all components
```

---

## 🎯 How to Use

### 1. **Import Components**

```typescript
import {
  DashboardLayout,
  DashboardHeader,
  DashboardCard,
  SectionHeader,
  Section,
} from '../components/common';
```

### 2. **Import Theme**

```typescript
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme/designSystem';
```

### 3. **Build Your Screen**

```typescript
import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import {
  DashboardLayout,
  DashboardHeader,
  DashboardCard,
  SectionHeader,
  Section,
} from '../components/common';

const MyNewScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch data
    setRefreshing(false);
  };

  return (
    <DashboardLayout refreshing={refreshing} onRefresh={onRefresh}>
      {/* Header - Automatic styling */}
      <DashboardHeader
        userName="John Doe"
        userEmail="john@example.com"
        welcomeMessage="Good morning,"
      />

      {/* Section with content */}
      <Section>
        <SectionHeader title="My Section" icon="star" />

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

## 🎨 Design System Components

### 1. **Design Tokens** (`designSystem.ts`)

All your colors, spacing, fonts in ONE place!

```typescript
// Usage in your styles
import { Colors, Spacing, BorderRadius } from '../theme/designSystem';

const styles = StyleSheet.create({
  myView: {
    backgroundColor: Colors.surface,      // Use design tokens
    padding: Spacing.lg,                  // Instead of hardcoded values
    borderRadius: BorderRadius.lg,
    ...Shadows.md,                        // Consistent shadows
  },
  myText: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
});
```

### 2. **DashboardHeader Component**

Consistent header for all screens:

```typescript
<DashboardHeader
  userName="Priya Sharma"              // Required
  userEmail="priya@example.com"        // Optional
  welcomeMessage="Good morning,"       // Optional (default: "Welcome back,")
  statusMessage="Online"               // Optional (default: "Connected to Supabase ✓")
  avatarColor={Colors.accent}          // Optional (default: primary purple)
  showStatus={true}                    // Optional (default: true)
/>
```

### 3. **DashboardCard Component**

Consistent cards for content:

```typescript
<DashboardCard>
  <Card.Content>
    <Text>Your content</Text>
  </Card.Content>
  <Card.Actions>
    <Button>Action</Button>
  </Card.Actions>
</DashboardCard>

// With click handler
<DashboardCard onPress={() => console.log('Clicked')}>
  <Card.Content>
    <Text>Clickable card</Text>
  </Card.Content>
</DashboardCard>
```

### 4. **SectionHeader Component**

Consistent section titles:

```typescript
// Basic
<SectionHeader title="My Section" />

// With icon
<SectionHeader
  title="My Section"
  icon="star"
  onIconPress={() => console.log('Icon clicked')}
/>

// With custom right component
<SectionHeader
  title="My Section"
  rightComponent={<Button>See All</Button>}
/>
```

### 5. **DashboardLayout Component**

Wrap all screens for consistent layout:

```typescript
<DashboardLayout
  refreshing={isRefreshing}
  onRefresh={handleRefresh}
  showPadding={true}  // Optional (default: true)
>
  {/* Your content */}
</DashboardLayout>

// Use Section for proper spacing
<Section>
  <SectionHeader title="My Section" />
  <DashboardCard>...</DashboardCard>
</Section>
```

---

## 🔧 Customization

### Change Colors for Entire App

Edit `src/theme/designSystem.ts`:

```typescript
export const Colors = {
  primary: '#8B5CF6',     // Change this → Updates everywhere!
  accent: '#3B82F6',
  success: '#10B981',
  // ...
};
```

**Result:** All screens update automatically! ✨

### Change Spacing for Entire App

```typescript
export const Spacing = {
  base: 16,   // Change from 16 to 20 → All screens get more spacing
  lg: 20,
  xl: 24,
  // ...
};
```

### Change Border Radius

```typescript
export const BorderRadius = {
  lg: 16,     // Change from 16 to 24 → Rounder corners everywhere
  xl: 20,
  // ...
};
```

---

## 📋 Complete Example: Student Dashboard

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import {
  DashboardLayout,
  DashboardHeader,
  DashboardCard,
  SectionHeader,
  Section,
} from '../../components/common';
import { Colors, Spacing, Typography } from '../../theme/designSystem';
import { useStudentDashboard } from '../../hooks/useStudentDashboard';

const StudentDashboard = () => {
  const studentId = '12345';
  const { profile, assignments, isLoading, refetch } = useStudentDashboard(studentId);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <DashboardLayout refreshing={refreshing} onRefresh={onRefresh}>
      {/* Header - Automatic styling */}
      <DashboardHeader
        userName={profile?.full_name || 'Student'}
        userEmail={profile?.email}
        avatarColor={Colors.accent}
      />

      {/* Assignments Section */}
      <Section>
        <SectionHeader
          title="Pending Assignments"
          icon="file-document"
        />

        {assignments.map((assignment) => (
          <DashboardCard key={assignment.id}>
            <Card.Content>
              <Text variant="titleMedium">{assignment.title}</Text>
              <Text variant="bodySmall" style={styles.subtitle}>
                Due: {assignment.due_date}
              </Text>
              <Chip
                mode="flat"
                style={styles.statusChip}
              >
                {assignment.status}
              </Chip>
            </Card.Content>
            <Card.Actions>
              <Button>View</Button>
              <Button mode="contained">Submit</Button>
            </Card.Actions>
          </DashboardCard>
        ))}
      </Section>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  statusChip: {
    marginTop: Spacing.md,
    backgroundColor: Colors.warningLight,
  },
});

export default StudentDashboard;
```

**Result:** Professional, consistent screen in ~60 lines of code! 🎉

---

## ⚡ Benefits

### 1. **Consistency**
✅ All screens look the same
✅ Same spacing, colors, shadows
✅ Professional appearance

### 2. **Easy to Modify**
✅ Change one file → Update entire app
✅ Want rounder corners? Change `BorderRadius.lg`
✅ Want different colors? Change `Colors.primary`

### 3. **Fast Development**
✅ No need to write styling code
✅ Copy-paste pattern for new screens
✅ 60-80% less code

### 4. **Maintainability**
✅ One source of truth
✅ Easy to find and fix issues
✅ Team can follow same patterns

---

## 🎯 For Your 50+ Screens

### Pattern to Follow:

```typescript
// 1. Import components
import { DashboardLayout, DashboardHeader, Section, DashboardCard, SectionHeader } from '../../components/common';
import { Colors, Spacing } from '../../theme/designSystem';

// 2. Fetch data
const { data, isLoading, refetch } = useYourHook();

// 3. Build UI
return (
  <DashboardLayout refreshing={refreshing} onRefresh={refetch}>
    <DashboardHeader userName={data.name} userEmail={data.email} />

    <Section>
      <SectionHeader title="Section 1" />
      <DashboardCard>
        {/* Your content */}
      </DashboardCard>
    </Section>

    <Section>
      <SectionHeader title="Section 2" />
      <DashboardCard>
        {/* Your content */}
      </DashboardCard>
    </Section>
  </DashboardLayout>
);
```

### Time Estimate:
- **With design system:** 1-2 hours per screen
- **Without design system:** 4-6 hours per screen

**Savings:** 150+ hours for 50 screens! 🚀

---

## 🔄 Migration Steps

### Convert Existing Screen to Use Design System:

1. **Import components:**
   ```typescript
   import { DashboardLayout, DashboardHeader, Section } from '../../components/common';
   ```

2. **Replace ScrollView with DashboardLayout:**
   ```typescript
   // Before
   <ScrollView>...</ScrollView>

   // After
   <DashboardLayout>...</DashboardLayout>
   ```

3. **Replace custom header with DashboardHeader:**
   ```typescript
   // Before
   <View style={customHeaderStyles}>
     <Avatar />
     <Text>{name}</Text>
   </View>

   // After
   <DashboardHeader userName={name} />
   ```

4. **Replace custom styles with design tokens:**
   ```typescript
   // Before
   backgroundColor: '#8B5CF6',
   padding: 20,

   // After
   backgroundColor: Colors.primary,
   padding: Spacing.lg,
   ```

---

## 📚 Design Tokens Reference

### Colors
```typescript
Colors.primary       // #8B5CF6 (Purple)
Colors.accent        // #3B82F6 (Blue)
Colors.success       // #10B981 (Green)
Colors.warning       // #F59E0B (Orange)
Colors.error         // #EF4444 (Red)
Colors.background    // #F8F9FE (Light gray)
Colors.surface       // #FFFFFF (White)
Colors.textPrimary   // #111827 (Dark gray)
Colors.textSecondary // #6B7280 (Medium gray)
```

### Spacing
```typescript
Spacing.xs    // 4px
Spacing.sm    // 8px
Spacing.md    // 12px
Spacing.base  // 16px
Spacing.lg    // 20px
Spacing.xl    // 24px
Spacing['2xl']// 32px
```

### Typography
```typescript
Typography.fontSize.xs       // 12
Typography.fontSize.base     // 14
Typography.fontSize.lg       // 18
Typography.fontSize.xl       // 20
Typography.fontWeight.bold   // '700'
```

### Border Radius
```typescript
BorderRadius.sm    // 8px
BorderRadius.md    // 12px
BorderRadius.lg    // 16px
BorderRadius.xl    // 20px
BorderRadius['2xl']// 24px
```

### Shadows
```typescript
Shadows.sm    // Subtle shadow
Shadows.md    // Medium shadow
Shadows.lg    // Large shadow
Shadows.glow(Colors.primary)  // Glow effect
```

---

## 🎉 Result

**Before Design System:**
- 500+ lines of code per screen
- Inconsistent styling
- Hard to modify
- Lots of duplicated code

**After Design System:**
- 100-150 lines per screen
- Consistent styling
- Change one file → update all screens
- Reusable components

**Time to build 50 screens:** 2-3 weeks instead of 2-3 months! 🚀

---

*Last Updated: October 22, 2025*

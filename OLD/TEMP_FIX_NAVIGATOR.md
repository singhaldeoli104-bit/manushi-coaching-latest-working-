# TEMPORARY FIX - Simplified TeacherNavigator

## Problem
Many screens use `Typography.titleLarge` which is causing module loading to crash.

## Quick Fix

**Replace** `src/navigation/TeacherNavigator.tsx` with this simplified version:

```typescript
/**
 * Teacher Navigation - TEMPORARY SIMPLIFIED VERSION
 * Only loads TeacherHomeScreen to bypass Typography errors
 */

import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

// Only import working screens
import TeacherHomeScreen from '../screens/teacher/TeacherHomeScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Placeholder for disabled screens
const PlaceholderScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    <Text style={{ fontSize: 18, textAlign: 'center', color: '#333' }}>
      This screen is temporarily disabled{'\n'}while we fix Typography imports.
      {'\n\n'}
      TeacherHomeScreen is working!
    </Text>
  </View>
);

// Home Stack
function HomeStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="TeacherHome"
      screenOptions={{
        headerStyle: { backgroundColor: theme.Surface },
        headerTintColor: theme.OnSurface,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="TeacherHome"
        component={TeacherHomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Main Teacher Tab Navigator
export default function TeacherNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.OnSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.Surface,
          borderTopColor: theme.Outline,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Classes"
        component={PlaceholderScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="class" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Students"
        component={PlaceholderScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={PlaceholderScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="analytics" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={PlaceholderScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="menu" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

## Steps

1. **Backup current file:**
   ```bash
   cp src/navigation/TeacherNavigator.tsx src/navigation/TeacherNavigator.BACKUP.tsx
   ```

2. **Replace with simplified version above**

3. **Restart Metro:**
   ```bash
   npx react-native start --reset-cache
   ```

4. **Reload app**

## Result

- ✅ Home tab will show TeacherHomeScreen with real data
- ⚠️ Other tabs will show "temporarily disabled" message
- ✅ App won't crash on launch

Once TeacherHomeScreen is working, we can fix the Typography issues in other screens.

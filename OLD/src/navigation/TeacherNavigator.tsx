import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import TeacherHomeScreen from '../screens/teacher/TeacherHomeScreen';
import AttendanceTrackingScreen from '../screens/teacher/AttendanceTrackingScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const PlaceholderScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    <Text style={{ fontSize: 18, textAlign: 'center', color: '#333' }}>
      Screen temporarily disabled
    </Text>
  </View>
);

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
        options={{ headerShown: false }}/>
      <Stack.Screen
        name="take-attendance"
        component={AttendanceTrackingScreen}
        options={{ headerShown: true, title: "Take Attendance" }}
      />
    </Stack.Navigator>
  );
}

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

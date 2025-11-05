/**
 * Student Navigation
 * Bottom tab navigator with nested stacks - CORRECTED VERSION
 * Uses actual existing screen files from migration
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

// ==========================================
// OLD SCREENS - REMOVED (Backed up to OLD/backup/screens/student/)
// ==========================================
// All old screens have been backed up and removed from the codebase
// Only NEW Premium Minimal Design screens remain active

// ==========================================
// NEW SCREENS - Premium Minimal Design (21 screens)
// ==========================================
import NewStudentDashboard from '../screens/student/NewStudentDashboard';
import NewScheduleScreen from '../screens/student/NewScheduleScreen';
import NewClassDetailScreen from '../screens/student/NewClassDetailScreen';
import NewAssignmentDetailScreen from '../screens/student/NewAssignmentDetailScreen';
import NewProgressDetailScreen from '../screens/student/NewProgressDetailScreen';
import NewStudyLibraryScreen from '../screens/student/NewStudyLibraryScreen';
import NewAIStudyScreen from '../screens/student/NewAIStudyScreen';
import NewAITutorChat from '../screens/student/NewAITutorChat';
import NewAILearningDashboard from '../screens/student/NewAILearningDashboard';
import NewCollaborativeAssignment from '../screens/student/NewCollaborativeAssignment';
import NewPeerLearningNetwork from '../screens/student/NewPeerLearningNetwork';
import NewVirtualClassroom from '../screens/student/NewVirtualClassroom';
import NewLiveClassScreen from '../screens/student/NewLiveClassScreen';
import NewInteractiveClassroom from '../screens/student/NewInteractiveClassroom';
import NewGamifiedLearningHub from '../screens/student/NewGamifiedLearningHub';
import NewEnhancedAIStudy from '../screens/student/NewEnhancedAIStudy';
import NewEnhancedLiveClass from '../screens/student/NewEnhancedLiveClass';
import NewEnhancedSchedule from '../screens/student/NewEnhancedSchedule';
import NewActivityDetail from '../screens/student/NewActivityDetail';
import NewSimpleDoubt from '../screens/student/NewSimpleDoubt';
import NewDoubtSubmission from '../screens/student/NewDoubtSubmission';

// ==========================================
// RECENTLY CREATED SCREENS (6 screens)
// ==========================================
import AIPracticeProblems from '../screens/student/AIPracticeProblems';
import AIStudySummaries from '../screens/student/AIStudySummaries';
import PeerDetail from '../screens/student/PeerDetail';
import Whiteboard from '../screens/student/Whiteboard';
import ClassChat from '../screens/student/ClassChat';
import ClassNotes from '../screens/student/ClassNotes';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack (Dashboard + Doubts)
function HomeStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="NewStudentDashboard"
      screenOptions={{
        headerStyle: { backgroundColor: theme.Surface },
        headerTintColor: theme.OnSurface,
        headerShadowVisible: false,
      }}
    >
      {/* ✅ NEW SCREENS - Premium Minimal Design (DEFAULT) */}
      <Stack.Screen
        name="NewStudentDashboard"
        component={NewStudentDashboard}
        options={{ headerShown: false, title: 'Dashboard' }}
      />
      <Stack.Screen
        name="NewActivityDetail"
        component={NewActivityDetail}
        options={{ headerShown: false, title: 'Activity' }}
      />
      <Stack.Screen
        name="NewSimpleDoubt"
        component={NewSimpleDoubt}
        options={{ headerShown: false, title: 'Quick Doubt' }}
      />
      <Stack.Screen
        name="NewDoubtSubmission"
        component={NewDoubtSubmission}
        options={{ headerShown: false, title: 'Submit Doubt' }}
      />
      <Stack.Screen
        name="NewAILearningDashboard"
        component={NewAILearningDashboard}
        options={{ headerShown: false, title: 'AI Dashboard' }}
      />

    </Stack.Navigator>
  );
}

// Classes Stack
function ClassesStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="NewScheduleScreen"
      screenOptions={{
        headerStyle: { backgroundColor: theme.Surface },
        headerTintColor: theme.OnSurface,
      }}
    >
      {/* ✅ NEW SCREENS - Premium Minimal Design (DEFAULT) */}
      <Stack.Screen
        name="NewScheduleScreen"
        component={NewScheduleScreen}
        options={{ headerShown: false, title: 'Schedule' }}
      />
      <Stack.Screen
        name="NewEnhancedSchedule"
        component={NewEnhancedSchedule}
        options={{ headerShown: false, title: 'My Schedule' }}
      />
      <Stack.Screen
        name="NewClassDetailScreen"
        component={NewClassDetailScreen}
        options={{ headerShown: false, title: 'Class Details' }}
      />
      <Stack.Screen
        name="NewLiveClassScreen"
        component={NewLiveClassScreen}
        options={{ headerShown: false, title: 'Live Class' }}
      />
      <Stack.Screen
        name="NewEnhancedLiveClass"
        component={NewEnhancedLiveClass}
        options={{ headerShown: false, title: 'Live Session' }}
      />
      <Stack.Screen
        name="NewVirtualClassroom"
        component={NewVirtualClassroom}
        options={{ headerShown: false, title: 'Virtual Classroom' }}
      />
      <Stack.Screen
        name="NewInteractiveClassroom"
        component={NewInteractiveClassroom}
        options={{ headerShown: false, title: 'Interactive Class' }}
      />

      {/* ✅ LIVE CLASS FEATURE SCREENS - Recently Created */}
      <Stack.Screen
        name="Whiteboard"
        component={Whiteboard}
        options={{ headerShown: false, title: 'Whiteboard' }}
      />
      <Stack.Screen
        name="ClassChat"
        component={ClassChat}
        options={{ headerShown: false, title: 'Class Chat' }}
      />
      <Stack.Screen
        name="ClassNotes"
        component={ClassNotes}
        options={{ headerShown: false, title: 'Class Notes' }}
      />

    </Stack.Navigator>
  );
}

// Assignments & Study Stack
function AssignmentsStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="NewStudyLibraryScreen"
      screenOptions={{
        headerStyle: { backgroundColor: theme.Surface },
        headerTintColor: theme.OnSurface,
      }}
    >
      {/* ✅ NEW SCREENS - Premium Minimal Design (DEFAULT) */}
      <Stack.Screen
        name="NewStudyLibraryScreen"
        component={NewStudyLibraryScreen}
        options={{ headerShown: false, title: 'Study Resources' }}
      />
      <Stack.Screen
        name="NewAssignmentDetailScreen"
        component={NewAssignmentDetailScreen}
        options={{ headerShown: false, title: 'Assignment' }}
      />
      <Stack.Screen
        name="NewCollaborativeAssignment"
        component={NewCollaborativeAssignment}
        options={{ headerShown: false, title: 'Collaborative Work' }}
      />
      <Stack.Screen
        name="NewAIStudyScreen"
        component={NewAIStudyScreen}
        options={{ headerShown: false, title: 'AI Study' }}
      />
      <Stack.Screen
        name="NewEnhancedAIStudy"
        component={NewEnhancedAIStudy}
        options={{ headerShown: false, title: 'Smart Study' }}
      />
      <Stack.Screen
        name="NewAITutorChat"
        component={NewAITutorChat}
        options={{ headerShown: false, title: 'AI Tutor' }}
      />

      {/* ✅ AI PRACTICE & SUMMARY SCREENS - Recently Created */}
      <Stack.Screen
        name="AIPracticeProblems"
        component={AIPracticeProblems}
        options={{ headerShown: false, title: 'AI Practice Problems' }}
      />
      <Stack.Screen
        name="AIStudySummaries"
        component={AIStudySummaries}
        options={{ headerShown: false, title: 'AI Study Summaries' }}
      />

    </Stack.Navigator>
  );
}

// Performance & Learning Stack
function PerformanceStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="NewProgressDetailScreen"
      screenOptions={{
        headerStyle: { backgroundColor: theme.Surface },
        headerTintColor: theme.OnSurface,
      }}
    >
      {/* ✅ NEW SCREENS - Premium Minimal Design (DEFAULT) */}
      <Stack.Screen
        name="NewProgressDetailScreen"
        component={NewProgressDetailScreen}
        options={{ headerShown: false, title: 'My Progress' }}
      />
      <Stack.Screen
        name="NewGamifiedLearningHub"
        component={NewGamifiedLearningHub}
        options={{ headerShown: false, title: 'Learning Hub' }}
      />

    </Stack.Navigator>
  );
}

// Collaboration Stack
function CollaborationStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="NewPeerLearningNetwork"
      screenOptions={{
        headerStyle: { backgroundColor: theme.Surface },
        headerTintColor: theme.OnSurface,
      }}
    >
      {/* ✅ NEW SCREENS - Premium Minimal Design (DEFAULT) */}
      <Stack.Screen
        name="NewPeerLearningNetwork"
        component={NewPeerLearningNetwork}
        options={{ headerShown: false, title: 'Peer Network' }}
      />

      {/* ✅ PEER DETAIL SCREEN - Recently Created */}
      <Stack.Screen
        name="PeerDetail"
        component={PeerDetail}
        options={{ headerShown: false, title: 'Peer Profile' }}
      />

    </Stack.Navigator>
  );
}

// Main Student Tab Navigator
export default function StudentNavigator() {
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
        component={ClassesStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="school" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Study"
        component={AssignmentsStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="library-books" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={PerformanceStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="trending-up" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Connect"
        component={CollaborationStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="people" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

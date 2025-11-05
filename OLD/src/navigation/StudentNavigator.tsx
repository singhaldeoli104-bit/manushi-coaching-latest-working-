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
// OLD SCREENS - Keep for gradual replacement
// ==========================================
import StudentDashboard from '../screens/student/StudentDashboard';
import ScheduleScreen from '../screens/student/ScheduleScreen';
import EnhancedScheduleScreen from '../screens/student/EnhancedScheduleScreen';
import StudentLiveClassScreen from '../screens/student/StudentLiveClassScreen';
import LiveClassParticipationScreen from '../screens/student/LiveClassParticipationScreen';
import EnhancedLiveClassParticipationScreen from '../screens/student/EnhancedLiveClassParticipationScreen';
import ClassDetailScreen from '../screens/student/ClassDetailScreen';
import VirtualClassroomInterface from '../screens/student/VirtualClassroomInterface';
import EnhancedInteractiveClassroomScreen from '../screens/student/EnhancedInteractiveClassroomScreen';
import AssignmentDetailScreen from '../screens/student/AssignmentDetailScreen';
import CollaborativeAssignmentWorkspace from '../screens/student/CollaborativeAssignmentWorkspace';
import DoubtSubmissionScreen from '../screens/student/DoubtSubmissionScreen';
import SimpleDoubtSubmissionScreen from '../screens/student/SimpleDoubtSubmissionScreen';
import ProgressDetailScreen from '../screens/student/ProgressDetailScreen';
import GamifiedLearningHub from '../screens/student/GamifiedLearningHub';
import StudentAILearningDashboard from '../screens/student/StudentAILearningDashboard';
import AIStudyScreen from '../screens/student/AIStudyScreen';
import EnhancedAIStudyAssistantScreen from '../screens/student/EnhancedAIStudyAssistantScreen';
import AITutorChatInterface from '../screens/student/AITutorChatInterface';
import StudyLibraryScreen from '../screens/student/StudyLibraryScreen';
import LiveCollaborationStudio from '../screens/student/LiveCollaborationStudio';
import PeerLearningNetwork from '../screens/student/PeerLearningNetwork';
import ActivityDetailScreen from '../screens/student/ActivityDetailScreen';

// ==========================================
// NEW SCREENS - Premium Minimal Design
// ==========================================
// Note: These imports will be uncommented as screens are created
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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack (Dashboard + Doubts)
function HomeStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.Surface },
        headerTintColor: theme.OnSurface,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="StudentDashboard"
        component={StudentDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StudentAILearningDashboard"
        component={StudentAILearningDashboard}
        options={{ title: 'AI Learning Dashboard' }}
      />
      <Stack.Screen
        name="DoubtSubmission"
        component={DoubtSubmissionScreen}
        options={{ title: 'Submit Doubt' }}
      />
      <Stack.Screen
        name="SimpleDoubtSubmission"
        component={SimpleDoubtSubmissionScreen}
        options={{ title: 'Quick Doubt' }}
      />
      <Stack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={{ title: 'Activity Details' }}
      />

      {/* NEW SCREENS - Premium Minimal Design (Uncomment as created) */}
      <Stack.Screen
        name="NewStudentDashboard"
        component={NewStudentDashboard}
        options={{ headerShown: false, title: 'Dashboard (New)' }}
      />
      <Stack.Screen
        name="NewActivityDetail"
        component={NewActivityDetail}
        options={{ headerShown: false, title: 'Activity (New)' }}
      />
      <Stack.Screen
        name="NewSimpleDoubt"
        component={NewSimpleDoubt}
        options={{ headerShown: false, title: 'Quick Doubt (New)' }}
      />
      <Stack.Screen
        name="NewDoubtSubmission"
        component={NewDoubtSubmission}
        options={{ headerShown: false, title: 'Submit Doubt (New)' }}
      />
      <Stack.Screen
        name="NewAILearningDashboard"
        component={NewAILearningDashboard}
        options={{ headerShown: false, title: 'AI Dashboard (New)' }}
      />
    </Stack.Navigator>
  );
}

// Classes Stack
function ClassesStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.Surface },
        headerTintColor: theme.OnSurface,
      }}
    >
      <Stack.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{ title: 'Class Schedule' }}
      />
      <Stack.Screen
        name="EnhancedSchedule"
        component={EnhancedScheduleScreen}
        options={{ title: 'My Schedule' }}
      />
      <Stack.Screen
        name="ClassDetail"
        component={ClassDetailScreen}
        options={{ title: 'Class Details' }}
      />
      <Stack.Screen
        name="StudentLiveClass"
        component={StudentLiveClassScreen}
        options={{ title: 'Live Class', headerShown: false }}
      />
      <Stack.Screen
        name="LiveClassParticipation"
        component={LiveClassParticipationScreen}
        options={{ title: 'Join Class', headerShown: false }}
      />
      <Stack.Screen
        name="EnhancedLiveClass"
        component={EnhancedLiveClassParticipationScreen}
        options={{ title: 'Live Session', headerShown: false }}
      />
      <Stack.Screen
        name="VirtualClassroom"
        component={VirtualClassroomInterface}
        options={{ title: 'Virtual Classroom', headerShown: false }}
      />
      <Stack.Screen
        name="InteractiveClassroom"
        component={EnhancedInteractiveClassroomScreen}
        options={{ title: 'Interactive Class', headerShown: false }}
      />

      {/* NEW SCREENS - Premium Minimal Design (Uncomment as created) */}
      <Stack.Screen
        name="NewScheduleScreen"
        component={NewScheduleScreen}
        options={{ headerShown: false, title: 'Schedule (New)' }}
      />
      <Stack.Screen
        name="NewEnhancedSchedule"
        component={NewEnhancedSchedule}
        options={{ headerShown: false, title: 'My Schedule (New)' }}
      />
      <Stack.Screen
        name="NewClassDetailScreen"
        component={NewClassDetailScreen}
        options={{ headerShown: false, title: 'Class Details (New)' }}
      />
      <Stack.Screen
        name="NewLiveClassScreen"
        component={NewLiveClassScreen}
        options={{ headerShown: false, title: 'Live Class (New)' }}
      />
      <Stack.Screen
        name="NewEnhancedLiveClass"
        component={NewEnhancedLiveClass}
        options={{ headerShown: false, title: 'Live Session (New)' }}
      />
      <Stack.Screen
        name="NewVirtualClassroom"
        component={NewVirtualClassroom}
        options={{ headerShown: false, title: 'Virtual Classroom (New)' }}
      />
      <Stack.Screen
        name="NewInteractiveClassroom"
        component={NewInteractiveClassroom}
        options={{ headerShown: false, title: 'Interactive Class (New)' }}
      />
    </Stack.Navigator>
  );
}

// Assignments & Study Stack
function AssignmentsStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.Surface },
        headerTintColor: theme.OnSurface,
      }}
    >
      <Stack.Screen
        name="AssignmentDetail"
        component={AssignmentDetailScreen}
        options={{ title: 'Assignments' }}
      />
      <Stack.Screen
        name="CollaborativeWorkspace"
        component={CollaborativeAssignmentWorkspace}
        options={{ title: 'Collaborative Work' }}
      />
      <Stack.Screen
        name="StudyLibrary"
        component={StudyLibraryScreen}
        options={{ title: 'Study Resources' }}
      />
      <Stack.Screen
        name="AIStudy"
        component={AIStudyScreen}
        options={{ title: 'AI Study Assistant' }}
      />
      <Stack.Screen
        name="EnhancedAIStudy"
        component={EnhancedAIStudyAssistantScreen}
        options={{ title: 'Smart Study' }}
      />
      <Stack.Screen
        name="AITutorChat"
        component={AITutorChatInterface}
        options={{ title: 'AI Tutor' }}
      />

      {/* NEW SCREENS - Premium Minimal Design (Uncomment as created) */}
      <Stack.Screen
        name="NewAssignmentDetailScreen"
        component={NewAssignmentDetailScreen}
        options={{ headerShown: false, title: 'Assignment (New)' }}
      />
      <Stack.Screen
        name="NewCollaborativeAssignment"
        component={NewCollaborativeAssignment}
        options={{ headerShown: false, title: 'Collaborative Work (New)' }}
      />
      <Stack.Screen
        name="NewStudyLibraryScreen"
        component={NewStudyLibraryScreen}
        options={{ headerShown: false, title: 'Study Resources (New)' }}
      />
      <Stack.Screen
        name="NewAIStudyScreen"
        component={NewAIStudyScreen}
        options={{ headerShown: false, title: 'AI Study (New)' }}
      />
      <Stack.Screen
        name="NewEnhancedAIStudy"
        component={NewEnhancedAIStudy}
        options={{ headerShown: false, title: 'Smart Study (New)' }}
      />
      <Stack.Screen
        name="NewAITutorChat"
        component={NewAITutorChat}
        options={{ headerShown: false, title: 'AI Tutor (New)' }}
      />
    </Stack.Navigator>
  );
}

// Performance & Learning Stack
function PerformanceStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.Surface },
        headerTintColor: theme.OnSurface,
      }}
    >
      <Stack.Screen
        name="ProgressDetail"
        component={ProgressDetailScreen}
        options={{ title: 'My Progress' }}
      />
      <Stack.Screen
        name="GamifiedHub"
        component={GamifiedLearningHub}
        options={{ title: 'Learning Hub' }}
      />

      {/* NEW SCREENS - Premium Minimal Design (Uncomment as created) */}
      <Stack.Screen
        name="NewProgressDetailScreen"
        component={NewProgressDetailScreen}
        options={{ headerShown: false, title: 'Progress (New)' }}
      />
      <Stack.Screen
        name="NewGamifiedLearningHub"
        component={NewGamifiedLearningHub}
        options={{ headerShown: false, title: 'Learning Hub (New)' }}
      />
    </Stack.Navigator>
  );
}

// Collaboration Stack
function CollaborationStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.Surface },
        headerTintColor: theme.OnSurface,
      }}
    >
      <Stack.Screen
        name="LiveCollaboration"
        component={LiveCollaborationStudio}
        options={{ title: 'Collaboration Studio' }}
      />
      <Stack.Screen
        name="PeerLearning"
        component={PeerLearningNetwork}
        options={{ title: 'Peer Network' }}
      />

      {/* NEW SCREENS - Premium Minimal Design (Uncomment as created) */}
      <Stack.Screen
        name="NewPeerLearningNetwork"
        component={NewPeerLearningNetwork}
        options={{ headerShown: false, title: 'Peer Network (New)' }}
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

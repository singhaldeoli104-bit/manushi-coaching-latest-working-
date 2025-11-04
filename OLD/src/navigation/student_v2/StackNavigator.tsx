import React from 'react';
import { Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StudentStackParamList } from './types';
import { StudentTopBar } from '../../components/student/navigation/StudentTopBar';
import { DashboardScreen, ScheduleScreen, AssignmentListScreen, ProgressScreen } from './PlaceholderScreens.simple';
import { useDrawer } from './DrawerContext';

const Stack = createNativeStackNavigator<StudentStackParamList>();

export function StudentStackNavigator() {
  const { openDrawer } = useDrawer();

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => (
          <StudentTopBar
            title={props.options.title || props.route.name}
            showBackButton={props.navigation.canGoBack()}
            onBackPress={() => props.navigation.goBack()}
            onMenuPress={() => {
              Alert.alert('TEST', 'Hamburger menu tapped!');
              console.log('[DEBUG] Hamburger menu tapped!');
              openDrawer();
            }}
          />
        ),
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'Schedule' }} />
      <Stack.Screen name="AssignmentList" component={AssignmentListScreen} options={{ title: 'Assignments' }} />
      <Stack.Screen name="Progress" component={ProgressScreen} options={{ title: 'Progress' }} />
    </Stack.Navigator>
  );
}

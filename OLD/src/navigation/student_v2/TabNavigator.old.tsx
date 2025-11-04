import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StudentTabParamList } from './types';
import { StudentBottomNav } from '../../components/student/navigation/StudentBottomNav';
import { StudentStackNavigator } from './StackNavigator';
import { ScheduleScreen, AssignmentListScreen, ProgressScreen, MoreScreen } from './PlaceholderScreens.simple';

const Tab = createBottomTabNavigator<StudentTabParamList>();

export function StudentTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <StudentBottomNav
          activeRoute={props.state.routeNames[props.state.index]}
          navigationItems={[
            {
              key: 'Home',
              label: 'Home',
              icon: 'home',
              onPress: () => props.navigation.navigate('Home'),
            },
            {
              key: 'Schedule',
              label: 'Schedule',
              icon: 'calendar',
              onPress: () => props.navigation.navigate('Schedule'),
            },
            {
              key: 'Study',
              label: 'Study',
              icon: 'book',
              onPress: () => props.navigation.navigate('Study'),
            },
            {
              key: 'Progress',
              label: 'Progress',
              icon: 'chart',
              onPress: () => props.navigation.navigate('Progress'),
            },
            {
              key: 'More',
              label: 'More',
              icon: 'menu',
              onPress: () => props.navigation.navigate('More'),
            },
          ]}
        />
      )}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={StudentStackNavigator} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Study" component={AssignmentListScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}

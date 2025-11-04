import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
              icon: <Icon name="home" size={24} color="#6750A4" />,
              onPress: () => props.navigation.navigate('Home'),
            },
            {
              key: 'Schedule',
              label: 'Schedule',
              icon: <Icon name="event" size={24} color="#6750A4" />,
              onPress: () => props.navigation.navigate('Schedule'),
            },
            {
              key: 'Study',
              label: 'Study',
              icon: <Icon name="book" size={24} color="#6750A4" />,
              onPress: () => props.navigation.navigate('Study'),
            },
            {
              key: 'Progress',
              label: 'Progress',
              icon: <Icon name="trending-up" size={24} color="#6750A4" />,
              onPress: () => props.navigation.navigate('Progress'),
            },
            {
              key: 'More',
              label: 'More',
              icon: <Icon name="more-horiz" size={24} color="#6750A4" />,
              onPress: () => props.navigation.navigate('More'),
            },
          ]}
        />
      )}
      screenOptions={{
        headerShown: false,
        lazy: true,
        unmountOnBlur: false,
      }}
    >
      <Tab.Screen name="Home" component={StudentStackNavigator} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Study" component={AssignmentListScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}

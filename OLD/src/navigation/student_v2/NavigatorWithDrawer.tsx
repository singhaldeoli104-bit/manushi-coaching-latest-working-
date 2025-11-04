/**
 * Navigator With Drawer
 * Wraps TabNavigator with StudentDrawer Modal
 *
 * NO @react-navigation/drawer package needed!
 * Uses StudentDrawer component which is Modal-based
 */

import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { StudentTabNavigator } from './TabNavigator';
import { StudentDrawer } from '../../components/student/navigation/StudentDrawer';
import { useStudent } from '../../context/StudentContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DrawerProvider } from './DrawerContext';

export function NavigatorWithDrawer() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { student } = useStudent();

  // Handle Android hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (drawerVisible) {
        setDrawerVisible(false);
        return true; // Prevent default behavior
      }
      return false; // Let React Navigation handle it
    });

    return () => backHandler.remove();
  }, [drawerVisible]);

  // Drawer navigation items
  const navigationItems = [
    {
      key: 'Home',
      label: 'Home',
      icon: <Icon name="home" size={24} color="#6750A4" />,
      onPress: () => {
        setDrawerVisible(false);
        // Navigation handled by bottom tabs
      },
      sectionHeader: 'Main Navigation',
    },
    {
      key: 'Schedule',
      label: 'Schedule',
      icon: <Icon name="event" size={24} color="#6750A4" />,
      onPress: () => {
        setDrawerVisible(false);
        // Navigation handled by bottom tabs
      },
    },
    {
      key: 'Study',
      label: 'Study Hub',
      icon: <Icon name="book" size={24} color="#6750A4" />,
      onPress: () => {
        setDrawerVisible(false);
        // Navigation handled by bottom tabs
      },
    },
    {
      key: 'Progress',
      label: 'Progress',
      icon: <Icon name="trending-up" size={24} color="#6750A4" />,
      onPress: () => {
        setDrawerVisible(false);
        // Navigation handled by bottom tabs
      },
    },
    {
      key: 'Settings',
      label: 'Settings',
      icon: <Icon name="settings" size={24} color="#6750A4" />,
      onPress: () => {
        setDrawerVisible(false);
        console.log('Settings - Future implementation');
      },
      sectionHeader: 'More',
      divider: true,
    },
    {
      key: 'Help',
      label: 'Help & Support',
      icon: <Icon name="help" size={24} color="#6750A4" />,
      onPress: () => {
        setDrawerVisible(false);
        console.log('Help - Future implementation');
      },
    },
  ];

  return (
    <DrawerProvider
      openDrawer={() => {
        console.log('🔓 openDrawer called, setting drawerVisible to true');
        setDrawerVisible(true);
      }}
      closeDrawer={() => {
        console.log('🔒 closeDrawer called, setting drawerVisible to false');
        setDrawerVisible(false);
      }}
      toggleDrawer={() => setDrawerVisible(!drawerVisible)}
    >
      <>
        <StudentTabNavigator />

        <StudentDrawer
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          activeRoute="Home"
          profileData={{
            name: student?.name || 'Student',
            email: student?.email || 'student@example.com',
            avatar: student?.avatar,
          }}
          navigationItems={navigationItems}
        />
      </>
    </DrawerProvider>
  );
}

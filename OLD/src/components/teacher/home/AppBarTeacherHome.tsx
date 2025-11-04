/**
 * AppBarTeacherHome Component
 * Minimal header bar - 3-line menu, teacher name, notifications
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { T } from '../../../ui';
import { Colors } from '../../../theme/designSystem';

type AppBarTeacherHomeProps = {
  teacherName: string;
  classLabel: string;
  onPressChangeClass: () => void;
  unreadNotifications: number;
  onPressNotifications: () => void;
  onPressProfile: () => void;
};

export const AppBarTeacherHome: React.FC<AppBarTeacherHomeProps> = ({
  teacherName,
  classLabel,
  onPressChangeClass,
  unreadNotifications,
  onPressProfile,
  onPressNotifications,
}) => {
  return (
    <View style={styles.container}>
      {/* Left: Menu Icon */}
      <IconButton
        icon="menu"
        size={24}
        onPress={onPressChangeClass}
        accessibilityLabel="Menu"
        style={styles.menuButton}
      />

      {/* Center: Teacher Name */}
      <View style={styles.centerContainer}>
        <T variant="title" weight="semiBold" style={styles.nameText}>
          {teacherName}
        </T>
      </View>

      {/* Right: Notifications */}
      <View style={styles.notificationContainer}>
        <IconButton
          icon="bell-outline"
          size={22}
          onPress={onPressNotifications}
          accessibilityLabel={`Notifications. ${unreadNotifications} unread`}
          style={styles.notificationButton}
        />
        {unreadNotifications > 0 && (
          <View style={styles.badge}>
            <T variant="caption" weight="bold" style={styles.badgeText}>
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </T>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  menuButton: {
    margin: 0,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    color: '#1E293B',
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationButton: {
    margin: 0,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 12,
  },
});

/**
 * MD3 Bottom Navigation Bar for Student Screens
 *
 * Material Design 3 compliant bottom navigation with:
 * - 80dp height (MD3 spec)
 * - 3-5 navigation items
 * - Active indicator (pill shape)
 * - Icon and label (label optional on inactive)
 * - Badge support for notifications
 * - Smooth animation (200ms)
 *
 * Features:
 * - Active state with color indicator
 * - Badge support (numbers, dots)
 * - Label show/hide animation
 * - Safe area handling (iOS notch)
 * - Accessibility support
 * - Icon-only mode (hide labels on inactive items)
 *
 * Usage:
 * <StudentBottomNav
 *   activeRoute="Dashboard"
 *   navigationItems={[
 *     { key: 'Dashboard', label: 'Home', icon: <HomeIcon />, onPress: navigateToDashboard },
 *     { key: 'Classes', label: 'Classes', icon: <ClassIcon />, badge: 3, onPress: navigateToClasses },
 *     { key: 'Schedule', label: 'Schedule', icon: <CalendarIcon />, onPress: navigateToSchedule },
 *     { key: 'Chat', label: 'Chat', icon: <ChatIcon />, badge: 5, onPress: navigateToChat },
 *     { key: 'Profile', label: 'Profile', icon: <ProfileIcon />, onPress: navigateToProfile }
 *   ]}
 * />
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  Platform,
  Vibration,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { Badge } from '../atoms/Badge';

// Navigation Item
export interface BottomNavItem {
  /** Unique key for the item */
  key: string;

  /** Item label */
  label: string;

  /** Item icon (React element, 24dp) */
  icon: React.ReactNode;

  /** Press handler */
  onPress: () => void;

  /** Optional badge count or dot */
  badge?: number | boolean;

  /** Disable this item */
  disabled?: boolean;
}

export interface StudentBottomNavProps {
  /** Currently active route key */
  activeRoute: string;

  /** Navigation items (3-5 items) */
  navigationItems: BottomNavItem[];

  /** Hide labels on inactive items */
  hideInactiveLabels?: boolean;

  /** Custom style */
  style?: ViewStyle;
}

/**
 * MD3 Student Bottom Navigation Bar
 */
export const StudentBottomNav: React.FC<StudentBottomNavProps> = ({
  activeRoute,
  navigationItems,
  hideInactiveLabels = false,
  style,
}) => {
  // Validate item count (MD3: 3-5 items)
  if (navigationItems.length < 3 || navigationItems.length > 5) {
    console.warn(
      'StudentBottomNav: MD3 recommends 3-5 items. Current count:',
      navigationItems.length
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* Navigation Items */}
      {navigationItems.map((item) => (
        <BottomNavItem
          key={item.key}
          item={item}
          isActive={activeRoute === item.key}
          hideLabel={hideInactiveLabels && activeRoute !== item.key}
          onPress={item.onPress}
        />
      ))}

      {/* Safe Area Padding (iOS) */}
      {Platform.OS === 'ios' && <View style={styles.safeArea} />}
    </View>
  );
};

/**
 * Individual Bottom Nav Item
 */
interface BottomNavItemProps {
  item: BottomNavItem;
  isActive: boolean;
  hideLabel: boolean;
  onPress: () => void;
}

const BottomNavItem: React.FC<BottomNavItemProps> = ({
  item,
  isActive,
  hideLabel,
  onPress,
}) => {
  // Animation for active indicator
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const labelOpacity = useRef(
    new Animated.Value(isActive || !hideLabel ? 1 : 0)
  ).current;

  // Handle press with haptic feedback (Android only)
  const handlePress = () => {
    if (Platform.OS === 'android') {
      Vibration.vibrate(10); // Light haptic feedback (10ms)
    }
    onPress();
  };

  // Animate on active state change
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1 : 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(labelOpacity, {
        toValue: isActive || !hideLabel ? 1 : 0,
        duration: 150, // MD3: 150ms label animation
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive, hideLabel]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={item.disabled}
      style={styles.navItem}
      accessibilityRole="tab"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: isActive, disabled: item.disabled }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {({ pressed }) => (
        <>
          {/* Active Indicator (Pill Background) */}
          <Animated.View
            style={[
              styles.activeIndicator,
              {
                transform: [{ scale: scaleAnim }],
                opacity: scaleAnim,
              },
            ]}
          />

          {/* State Layer (Pressed) */}
          {pressed && !item.disabled && (
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.stateLayer,
                isActive && styles.stateLayerActive,
              ]}
            />
          )}

          {/* Content Container */}
          <View style={styles.navItemContent}>
            {/* Icon with Badge */}
            <View style={styles.iconContainer}>
              <View
                style={[
                  styles.icon,
                  item.disabled && styles.iconDisabled,
                  isActive && styles.iconActive,
                ]}
              >
                {item.icon}
              </View>

              {/* Badge */}
              {item.badge !== undefined && item.badge !== false && (
                <View style={styles.badgeContainer}>
                  {typeof item.badge === 'number' ? (
                    <Badge
                      value={item.badge}
                      variant="error"
                      size="standard"
                      position="top-right"
                    />
                  ) : (
                    <Badge variant="error" size="small" />
                  )}
                </View>
              )}
            </View>

            {/* Label */}
            <Animated.View style={{ opacity: labelOpacity }}>
              <Text
                style={[
                  styles.label,
                  isActive && styles.labelActive,
                  item.disabled && styles.labelDisabled,
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </Animated.View>
          </View>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Container
  container: {
    flexDirection: 'row',
    backgroundColor: LightTheme.Surface,
    height: 80, // MD3: 80dp bottom nav height
    elevation: 3, // MD3: Elevation 3 for bottom nav
    shadowColor: LightTheme.Shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderTopWidth: 0, // Remove border (use elevation instead)
  },

  // Safe Area (iOS bottom notch)
  safeArea: {
    position: 'absolute',
    bottom: -34, // iOS home indicator space
    left: 0,
    right: 0,
    height: 34,
    backgroundColor: LightTheme.Surface,
  },

  // Navigation Item
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingTop: 12, // MD3: 12dp top padding
    paddingBottom: 16, // MD3: 16dp bottom padding
    paddingHorizontal: 8, // MD3: 8dp horizontal padding
  },

  // Active Indicator (Pill Background)
  activeIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 0,
    backgroundColor: LightTheme.PrimaryContainer, // MD3: Primary container for active
    borderRadius: 16, // MD3: 16dp corner radius
  },

  // State Layer (Pressed State)
  stateLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: LightTheme.OnSurface,
    opacity: 0.12, // MD3: 0.12 state layer
    borderRadius: 16,
  },

  stateLayerActive: {
    backgroundColor: LightTheme.OnPrimaryContainer,
  },

  // Nav Item Content
  navItemContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4, // MD3: 4dp gap between icon and label
    zIndex: 1, // Ensure content appears above indicator
  },

  // Icon Container (for badge positioning)
  iconContainer: {
    width: 32, // Container for 24dp icon + badge space
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  // Icon (24dp)
  icon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconActive: {
    // Active state color applied via icon color prop
  },

  iconDisabled: {
    opacity: 0.38, // MD3: 0.38 disabled
  },

  // Badge Container (positioned absolute)
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
  },

  // Label
  label: {
    ...Typography.labelMedium, // MD3: 12px/16/500/0.5
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
  } as TextStyle,

  labelActive: {
    color: LightTheme.OnPrimaryContainer, // MD3: Active label color
  },

  labelDisabled: {
    opacity: 0.38, // MD3: 0.38 disabled
  },
});

export default StudentBottomNav;

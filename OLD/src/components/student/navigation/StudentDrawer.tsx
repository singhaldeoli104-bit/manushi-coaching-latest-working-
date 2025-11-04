/**
 * MD3 Navigation Drawer for Student Screens
 *
 * Material Design 3 compliant navigation drawer with:
 * - 280dp width (MD3 spec for mobile)
 * - Profile header section
 * - Navigation items with icons and badges
 * - Active state highlighting
 * - Section dividers
 * - Modal overlay with 0.32 scrim
 *
 * Features:
 * - Active item indication (pill shape)
 * - Badge support for notifications
 * - Section headers with dividers
 * - Profile quick actions
 * - Slide-in animation (200ms)
 * - Backdrop dismiss
 *
 * Usage:
 * <StudentDrawer
 *   visible={drawerVisible}
 *   onClose={() => setDrawerVisible(false)}
 *   activeRoute="Dashboard"
 *   profileData={{
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     avatar: 'https://...'
 *   }}
 *   navigationItems={[
 *     { key: 'Dashboard', label: 'Dashboard', icon: <DashboardIcon />, onPress: navigateToDashboard },
 *     { key: 'Classes', label: 'My Classes', icon: <ClassIcon />, badge: 3, onPress: navigateToClasses }
 *   ]}
 * />
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  TextStyle,
  Animated,
  Image,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { useStudent } from '../../../context/StudentContext';
import { Badge } from '../atoms/Badge';

// Navigation Item
export interface DrawerNavigationItem {
  /** Unique key for the item */
  key: string;

  /** Item label */
  label: string;

  /** Item icon (React element) */
  icon: React.ReactNode;

  /** Press handler */
  onPress: () => void;

  /** Optional badge count */
  badge?: number;

  /** Section header (renders above this item) */
  sectionHeader?: string;

  /** Show divider above this item */
  divider?: boolean;
}

// Profile Data
export interface DrawerProfileData {
  /** User's full name */
  name: string;

  /** User's email or subtitle */
  email: string;

  /** Avatar image URI */
  avatar?: string;

  /** Profile press handler */
  onProfilePress?: () => void;
}

export interface StudentDrawerProps {
  /** Drawer visibility */
  visible: boolean;

  /** Close handler */
  onClose: () => void;

  /** Currently active route key */
  activeRoute?: string;

  /** Profile data */
  profileData?: DrawerProfileData;

  /** Navigation items */
  navigationItems: DrawerNavigationItem[];

  /** Footer content (optional) */
  footer?: React.ReactNode;

  /** Custom drawer width (default 280dp) */
  drawerWidth?: number;
}

/**
 * MD3 Student Navigation Drawer
 */
export const StudentDrawer: React.FC<StudentDrawerProps> = ({
  visible,
  onClose,
  activeRoute,
  profileData,
  navigationItems,
  footer,
  drawerWidth = 280,
}) => {
  // Get safe area insets
  const insets = useSafeAreaInsets();

  // Get student data from context if not provided via props
  const { student } = useStudent();

  // Use context data if profileData prop is not provided
  const profile = profileData || (student ? {
    name: student.name,
    email: student.email,
    avatar: student.avatar,
    onProfilePress: undefined,
  } : undefined);

  // Animation values
  const slideAnim = useRef(new Animated.Value(-drawerWidth)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Debug: Log visibility changes
  useEffect(() => {
    console.log("[StudentDrawer] visible prop:", visible);
  }, [visible]);

  // Animate drawer on visibility change
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200, // MD3: 200ms enter
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -drawerWidth,
          duration: 150, // MD3: 150ms exit
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, drawerWidth]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop (Scrim) */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.32], // MD3: 0.32 scrim opacity
            }),
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Drawer Container */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: drawerWidth,
            paddingTop: insets.top,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Profile Header */}
        {profile && (
          <Pressable
            onPress={profile.onProfilePress}
            style={styles.profileHeader}
            accessibilityRole="button"
            accessibilityLabel={`Profile: ${profile.name}`}
          >
            {({ pressed }) => (
              <>
                {pressed && profile.onProfilePress && (
                  <View
                    style={[
                      StyleSheet.absoluteFill,
                      styles.profileHeaderStateLayer,
                    ]}
                  />
                )}

                {/* Avatar */}
                {profile.avatar ? (
                  <Image
                    source={{ uri: profile.avatar }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitial}>
                      {profile.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}

                {/* Profile Info */}
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {profile.name}
                  </Text>
                  <Text style={styles.profileEmail} numberOfLines={1}>
                    {profile.email}
                  </Text>
                </View>
              </>
            )}
          </Pressable>
        )}

        {/* Navigation Items */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {navigationItems.map((item) => (
            <React.Fragment key={item.key}>
              {/* Section Header */}
              {item.sectionHeader && (
                <Text style={styles.sectionHeader}>{item.sectionHeader}</Text>
              )}

              {/* Divider */}
              {item.divider && <View style={styles.divider} />}

              {/* Navigation Item */}
              <DrawerItem
                item={item}
                isActive={activeRoute === item.key}
                onPress={() => {
                  item.onPress();
                  onClose();
                }}
              />
            </React.Fragment>
          ))}
        </ScrollView>

        {/* Footer */}
        {footer && <View style={styles.footer}>{footer}</View>}
      </Animated.View>
    </Modal>
  );
};

/**
 * Individual Drawer Item
 */
interface DrawerItemProps {
  item: DrawerNavigationItem;
  isActive: boolean;
  onPress: () => void;
}

const DrawerItem: React.FC<DrawerItemProps> = ({ item, isActive, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.navItem, isActive && styles.navItemActive]}
      accessibilityRole="button"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: isActive }}
    >
      {({ pressed }) => (
        <>
          {/* State Layer */}
          {pressed && !isActive && (
            <View
              style={[StyleSheet.absoluteFill, styles.navItemStateLayer]}
            />
          )}

          {/* Icon */}
          <View style={styles.navItemIcon}>{item.icon}</View>

          {/* Label */}
          <Text
            style={[styles.navItemLabel, isActive && styles.navItemLabelActive]}
            numberOfLines={1}
          >
            {item.label}
          </Text>

          {/* Badge */}
          {item.badge !== undefined && item.badge > 0 && (
            <View style={styles.navItemBadge}>
              <Badge value={item.badge} variant="error" size="standard" />
            </View>
          )}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Backdrop (Scrim)
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: LightTheme.Scrim,
  },

  // Drawer Container
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: LightTheme.Surface,
    elevation: 1, // MD3: Elevation 1 for drawer
    shadowColor: LightTheme.Shadow,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  // Profile Header (56dp height)
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16, // MD3: 16dp padding
    minHeight: 88, // MD3: 88dp for profile header
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.Outline,
    backgroundColor: LightTheme.Surface,
    position: 'relative',
  },

  profileHeaderStateLayer: {
    backgroundColor: LightTheme.OnSurface,
    opacity: 0.12, // MD3: 0.12 state layer
  },

  // Avatar (40dp)
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },

  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LightTheme.PrimaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarInitial: {
    ...Typography.titleMedium, // MD3: 16px/24/500
    color: LightTheme.OnPrimaryContainer,
  } as TextStyle,

  // Profile Info
  profileInfo: {
    flex: 1,
  },

  profileName: {
    ...Typography.labelLarge, // MD3: 14px/20/500/0.1
    color: LightTheme.OnSurface,
    marginBottom: 2,
  } as TextStyle,

  profileEmail: {
    ...Typography.labelMedium, // MD3: 12px/16/500/0.5
    color: LightTheme.OnSurfaceVariant,
  } as TextStyle,

  // Scroll View
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingVertical: 8, // MD3: 8dp vertical padding
  },

  // Section Header
  sectionHeader: {
    ...Typography.labelSmall, // MD3: 11px/16/500/0.5
    color: LightTheme.OnSurfaceVariant,
    textTransform: 'uppercase',
    paddingHorizontal: 28, // Aligned with item text
    paddingVertical: 12,
    marginTop: 8,
  } as TextStyle,

  // Divider
  divider: {
    height: 1,
    backgroundColor: LightTheme.Outline,
    opacity: 0.12,
    marginVertical: 8,
  },

  // Navigation Item (56dp height)
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56, // MD3: 56dp navigation item height
    paddingHorizontal: 12, // MD3: 12dp horizontal padding
    marginHorizontal: 12, // MD3: 12dp horizontal margin
    borderRadius: 28, // MD3: Fully rounded (56dp / 2)
    position: 'relative',
    overflow: 'hidden',
  },

  navItemActive: {
    backgroundColor: LightTheme.PrimaryContainer, // MD3: Active state background
  },

  navItemStateLayer: {
    backgroundColor: LightTheme.OnSurface,
    opacity: 0.12, // MD3: 0.12 state layer
    borderRadius: 28,
  },

  // Navigation Item Icon (24dp)
  navItemIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12, // MD3: 12dp gap
  },

  // Navigation Item Label
  navItemLabel: {
    flex: 1,
    ...Typography.labelLarge, // MD3: 14px/20/500/0.1
    color: LightTheme.OnSurfaceVariant,
  } as TextStyle,

  navItemLabelActive: {
    color: LightTheme.OnPrimaryContainer, // MD3: Active state color
  },

  // Navigation Item Badge
  navItemBadge: {
    marginLeft: 8,
  },

  // Footer
  footer: {
    borderTopWidth: 1,
    borderTopColor: LightTheme.Outline,
    padding: 16,
  },
});

export default StudentDrawer;

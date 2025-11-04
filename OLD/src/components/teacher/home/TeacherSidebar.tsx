/**
 * TeacherSidebar Component
 * Minimal sidebar drawer matching parent dashboard UI - smooth LTR animation
 */

import React, { useEffect, useRef } from 'react';
import { View, Modal, StyleSheet, Pressable, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { IconButton, Divider } from 'react-native-paper';
import { T, Row, Spacer } from '../../../ui';
import { Colors, Spacing } from '../../../theme/designSystem';

const DRAWER_WIDTH = 280;
const ANIMATION_DURATION = 250;

type SidebarMenuItem = {
  icon: string;
  label: string;
  onPress: () => void;
};

type TeacherSidebarProps = {
  visible: boolean;
  onClose: () => void;
  teacherName: string;
  teacherEmail?: string;
  avatarUrl?: string | null;
  menuItems: SidebarMenuItem[];
  onPressProfile: () => void;
};

export const TeacherSidebar: React.FC<TeacherSidebarProps> = ({
  visible,
  onClose,
  teacherName,
  teacherEmail,
  avatarUrl,
  menuItems,
  onPressProfile,
}) => {
  // Animation for LTR slide (from left edge)
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Animate drawer in/out
  useEffect(() => {
    if (visible) {
      // Slide in from left + fade in scrim
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide out to left + fade out scrim
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible && opacityAnim._value === 0) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Drawer Content - Slides from LEFT */}
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <T variant="title" weight="bold" style={styles.nameText}>
                  {teacherName}
                </T>
                {teacherEmail && (
                  <>
                    <Spacer size="xs" />
                    <T variant="caption" color="textSecondary">
                      {teacherEmail}
                    </T>
                  </>
                )}
              </View>
              <IconButton
                icon="close"
                size={24}
                onPress={onClose}
                accessibilityLabel="Close sidebar"
                style={{ margin: 0 }}
              />
            </View>

            <Divider style={styles.divider} />

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              {menuItems.map((item, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                  ]}
                  onPress={() => {
                    onClose();
                    setTimeout(() => item.onPress(), 100);
                  }}
                  accessibilityLabel={item.label}
                  accessibilityRole="button"
                >
                  <IconButton
                    icon={item.icon}
                    size={22}
                    iconColor={Colors.textSecondary}
                    style={styles.menuIcon}
                  />
                  <T variant="body" weight="medium" style={styles.menuLabel}>
                    {item.label}
                  </T>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Footer - Profile */}
          <View style={styles.footer}>
            <Divider style={styles.divider} />
            <Pressable
              style={({ pressed }) => [
                styles.profileButton,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => {
                onClose();
                setTimeout(() => onPressProfile(), 100);
              }}
              accessibilityLabel="View profile"
              accessibilityRole="button"
            >
              <IconButton
                icon="account-circle"
                size={22}
                iconColor={Colors.primary}
                style={styles.menuIcon}
              />
              <T variant="body" weight="semiBold" color="primary">
                View Profile
              </T>
            </Pressable>
          </View>
        </Animated.View>

        {/* Scrim - Fades in/out with drawer */}
        <Animated.View
          style={[
            styles.scrim,
            {
              opacity: opacityAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.scrimTouchable}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    position: 'relative',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    zIndex: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  scrimTouchable: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    backgroundColor: '#F8FAFC',
  },
  nameText: {
    color: '#1E293B',
  },
  divider: {
    backgroundColor: '#E2E8F0',
  },
  menuContainer: {
    paddingVertical: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 56,
  },
  menuItemPressed: {
    backgroundColor: '#F1F5F9',
  },
  menuIcon: {
    margin: 0,
    marginRight: Spacing.xs,
  },
  menuLabel: {
    flex: 1,
    color: '#1E293B',
  },
  footer: {
    paddingVertical: Spacing.sm,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 56,
  },
});

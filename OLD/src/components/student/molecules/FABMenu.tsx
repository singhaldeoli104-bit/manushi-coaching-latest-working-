/**
 * MD3 FABMenu Component (Floating Action Button Menu)
 *
 * Material Design 3 expandable FAB with action menu.
 *
 * Features:
 * - Primary FAB button (56dp circular)
 * - Expands to show multiple action items
 * - Spring animations on expand/collapse
 * - Haptic feedback on interactions
 * - Backdrop with fade animation
 * - Icon rotation animation (+ to X)
 * - Staggered menu item animations
 *
 * ✅ M3E: Spring animations on FAB and menu items
 * ✅ M3E: Haptic feedback on open/close and item selection
 * ✅ M3E: Smooth expand/collapse transitions
 * ✅ M3E: Icon rotation with spring physics
 *
 * Usage:
 * <FABMenu
 *   icon={<PlusIcon />}
 *   actions={[
 *     { id: '1', label: 'Create Post', icon: <Icon />, onPress: () => {} },
 *     { id: '2', label: 'Upload Photo', icon: <Icon />, onPress: () => {} },
 *   ]}
 *   position="bottom-right"
 * />
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Animated,
  Modal,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { provideHapticFeedback } from '../../../utils/haptics';

// Action Item definition
export interface FABAction {
  /** Unique identifier */
  id: string;

  /** Label text */
  label: string;

  /** Icon element */
  icon: React.ReactNode;

  /** Action handler */
  onPress: () => void;

  /** Disable this action */
  disabled?: boolean;
}

// FABMenu Props
export interface FABMenuProps {
  /** Main FAB icon (shown when closed) */
  icon: React.ReactNode;

  /** Array of action items */
  actions: FABAction[];

  /** Position on screen */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

  /** FAB variant */
  variant?: 'primary' | 'secondary' | 'tertiary';

  /** Custom style for FAB */
  style?: ViewStyle;
}

/**
 * MD3 FABMenu Component
 */
export const FABMenu: React.FC<FABMenuProps> = ({
  icon,
  actions,
  position = 'bottom-right',
  variant = 'primary',
  style,
}) => {
  // State for menu visibility
  const [isExpanded, setIsExpanded] = useState(false);

  // M3E: Spring animations
  const fabScaleValue = useRef(new Animated.Value(1)).current;
  const iconRotateValue = useRef(new Animated.Value(0)).current;
  const backdropOpacityValue = useRef(new Animated.Value(0)).current;

  // Action item animation values
  const actionAnimValues = useRef(
    actions.map(() => ({
      scale: new Animated.Value(0),
      translateY: new Animated.Value(20),
      opacity: new Animated.Value(0),
    }))
  ).current;

  // Variant-specific styles
  let fabBackgroundColor: string = LightTheme.PrimaryContainer;
  let fabIconColor: string = LightTheme.OnPrimaryContainer;

  switch (variant) {
    case 'primary':
      fabBackgroundColor = LightTheme.PrimaryContainer;
      fabIconColor = LightTheme.OnPrimaryContainer;
      break;
    case 'secondary':
      fabBackgroundColor = LightTheme.SecondaryContainer;
      fabIconColor = LightTheme.OnSecondaryContainer;
      break;
    case 'tertiary':
      fabBackgroundColor = LightTheme.TertiaryContainer;
      fabIconColor = LightTheme.OnTertiaryContainer;
      break;
  }

  // Position styles
  const positionStyle: ViewStyle = {};
  switch (position) {
    case 'bottom-right':
      positionStyle.bottom = 16;
      positionStyle.right = 16;
      break;
    case 'bottom-left':
      positionStyle.bottom = 16;
      positionStyle.left = 16;
      break;
    case 'top-right':
      positionStyle.top = 16;
      positionStyle.right = 16;
      break;
    case 'top-left':
      positionStyle.top = 16;
      positionStyle.left = 16;
      break;
  }

  // M3E: Expand menu with staggered animations
  const expandMenu = () => {
    setIsExpanded(true);
    provideHapticFeedback('impact_medium');

    // Rotate icon (0 → 45 degrees for X effect)
    Animated.spring(iconRotateValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();

    // Fade in backdrop
    Animated.timing(backdropOpacityValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Stagger animate action items
    const animations = actionAnimValues.map((animValue, index) => {
      return Animated.parallel([
        Animated.spring(animValue.scale, {
          toValue: 1,
          delay: index * 50, // Stagger delay
          useNativeDriver: true,
          friction: 8,
          tension: 100,
        }),
        Animated.spring(animValue.translateY, {
          toValue: 0,
          delay: index * 50,
          useNativeDriver: true,
          friction: 8,
          tension: 100,
        }),
        Animated.timing(animValue.opacity, {
          toValue: 1,
          delay: index * 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(50, animations).start();
  };

  // M3E: Collapse menu with animations
  const collapseMenu = () => {
    provideHapticFeedback('impact_light');

    // Rotate icon back
    Animated.spring(iconRotateValue, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();

    // Fade out backdrop
    Animated.timing(backdropOpacityValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Collapse action items
    const animations = actionAnimValues.map((animValue) => {
      return Animated.parallel([
        Animated.spring(animValue.scale, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 100,
        }),
        Animated.spring(animValue.translateY, {
          toValue: 20,
          useNativeDriver: true,
          friction: 8,
          tension: 100,
        }),
        Animated.timing(animValue.opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start(() => {
      setIsExpanded(false);
    });
  };

  // Toggle menu
  const toggleMenu = () => {
    if (isExpanded) {
      collapseMenu();
    } else {
      expandMenu();
    }
  };

  // Handle action press
  const handleActionPress = (action: FABAction) => {
    if (action.disabled) return;
    provideHapticFeedback('selection');
    collapseMenu();
    // Small delay to allow collapse animation before action
    setTimeout(() => action.onPress(), 150);
  };

  // M3E: FAB press handlers
  const handleFABPressIn = () => {
    Animated.spring(fabScaleValue, {
      toValue: 0.92,
      useNativeDriver: true,
      friction: 5,
      tension: 300,
    }).start();
  };

  const handleFABPressOut = () => {
    Animated.spring(fabScaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  // Icon rotation interpolation
  const iconRotate = iconRotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <>
      {/* Main FAB Button */}
      <Animated.View
        style={[
          styles.fabContainer,
          positionStyle,
          {
            transform: [{ scale: fabScaleValue }],
          },
          style,
        ]}
      >
        <Pressable
          style={[
            styles.fab,
            { backgroundColor: fabBackgroundColor },
          ]}
          onPress={toggleMenu}
          onPressIn={handleFABPressIn}
          onPressOut={handleFABPressOut}
          accessibilityRole="button"
          accessibilityLabel={isExpanded ? 'Close menu' : 'Open menu'}
          accessibilityState={{ expanded: isExpanded }}
        >
          {({ pressed }) => (
            <>
              {pressed && (
                <View
                  style={[
                    StyleSheet.absoluteFillObject,
                    {
                      backgroundColor: fabIconColor,
                      opacity: 0.12,
                      borderRadius: 28,
                    },
                  ]}
                />
              )}
              <Animated.View
                style={{
                  transform: [{ rotate: iconRotate }],
                }}
              >
                {icon}
              </Animated.View>
            </>
          )}
        </Pressable>
      </Animated.View>

      {/* Expanded Menu Modal */}
      <Modal
        visible={isExpanded}
        transparent
        animationType="none"
        onRequestClose={collapseMenu}
      >
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacityValue,
            },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={collapseMenu}
          />
        </Animated.View>

        {/* Action Items */}
        <View style={[styles.actionsContainer, positionStyle]}>
          {actions.map((action, index) => {
            const animValue = actionAnimValues[index];
            return (
              <Animated.View
                key={action.id}
                style={[
                  styles.actionItemWrapper,
                  {
                    transform: [
                      { scale: animValue.scale },
                      { translateY: animValue.translateY },
                    ],
                    opacity: animValue.opacity,
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.actionItem,
                    action.disabled && styles.actionItemDisabled,
                  ]}
                  onPress={() => handleActionPress(action)}
                  disabled={action.disabled}
                  accessibilityRole="button"
                  accessibilityLabel={action.label}
                  accessibilityState={{ disabled: action.disabled }}
                >
                  <View style={styles.actionIconContainer}>{action.icon}</View>
                  <Text
                    style={[
                      styles.actionLabel,
                      action.disabled && styles.actionLabelDisabled,
                    ]}
                  >
                    {action.label}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    zIndex: 1000,
  },
  fab: {
    width: 56, // MD3: 56dp FAB
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: LightTheme.Shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
  },
  actionsContainer: {
    position: 'absolute',
    zIndex: 1001,
    alignItems: 'flex-end',
    gap: 12, // Gap between action items
    paddingBottom: 76, // Space for FAB (56dp + 20dp margin)
  },
  actionItemWrapper: {
    // Wrapper for animation
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightTheme.Surface,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
    elevation: 2,
    shadowColor: LightTheme.Shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionItemDisabled: {
    opacity: 0.38,
  },
  actionIconContainer: {
    width: 24,
    height: 24,
  },
  actionLabel: {
    ...Typography.labelLarge,
    color: LightTheme.OnSurface,
  },
  actionLabelDisabled: {
    color: LightTheme.OnSurfaceVariant,
  },
});

export default FABMenu;

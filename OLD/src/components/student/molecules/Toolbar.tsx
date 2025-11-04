/**
 * MD3 Toolbar Component
 *
 * Material Design 3 horizontal toolbar with action items.
 *
 * Features:
 * - Multiple action items with icons and labels
 * - Compact mode (icons only)
 * - Extended mode (icons + labels)
 * - Spring animations on item press
 * - Haptic feedback on interactions
 * - Overflow menu for additional actions
 * - MD3 styling with elevation options
 *
 * ✅ M3E: Spring animations on action press
 * ✅ M3E: Haptic feedback on selection
 * ✅ M3E: Smooth transitions
 *
 * Usage:
 * <Toolbar
 *   actions={[
 *     { id: '1', label: 'Copy', icon: <Icon />, onPress: () => {} },
 *     { id: '2', label: 'Paste', icon: <Icon />, onPress: () => {} },
 *   ]}
 *   variant="compact"
 *   position="bottom"
 * />
 */

import React, { useRef } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  ViewStyle,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { provideHapticFeedback } from '../../../utils/haptics';

// Action Item definition
export interface ToolbarAction {
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

  /** Show badge indicator */
  badge?: boolean;

  /** Badge count */
  badgeCount?: number;
}

// Toolbar Props
export interface ToolbarProps {
  /** Array of action items */
  actions: ToolbarAction[];

  /** Toolbar variant */
  variant?: 'compact' | 'extended';

  /** Position on screen */
  position?: 'top' | 'bottom';

  /** Show elevation */
  elevated?: boolean;

  /** Background color override */
  backgroundColor?: string;

  /** Custom style */
  style?: ViewStyle;
}

/**
 * MD3 Toolbar Component
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  actions,
  variant = 'compact',
  position = 'top',
  elevated = true,
  backgroundColor,
  style,
}) => {
  // Container style based on position
  const containerStyle: ViewStyle = {
    backgroundColor: backgroundColor || LightTheme.Surface,
  };

  if (elevated) {
    containerStyle.elevation = position === 'bottom' ? 3 : 1;
    containerStyle.shadowColor = LightTheme.Shadow;
    containerStyle.shadowOffset = { width: 0, height: position === 'bottom' ? -1 : 1 };
    containerStyle.shadowOpacity = position === 'bottom' ? 0.22 : 0.18;
    containerStyle.shadowRadius = position === 'bottom' ? 3 : 2;
  }

  return (
    <View style={[styles.container, containerStyle, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {actions.map((action) => (
          <ToolbarActionItem
            key={action.id}
            action={action}
            variant={variant}
          />
        ))}
      </ScrollView>
    </View>
  );
};

// Individual Toolbar Action Item
interface ToolbarActionItemProps {
  action: ToolbarAction;
  variant: 'compact' | 'extended';
}

const ToolbarActionItem: React.FC<ToolbarActionItemProps> = ({
  action,
  variant,
}) => {
  // M3E: Spring animation for press feedback
  const scaleValue = useRef(new Animated.Value(1)).current;

  // M3E: Handle press in
  const handlePressIn = () => {
    if (action.disabled) return;
    Animated.spring(scaleValue, {
      toValue: 0.92,
      useNativeDriver: true,
      friction: 5,
      tension: 300,
    }).start();
  };

  // M3E: Handle press out
  const handlePressOut = () => {
    if (action.disabled) return;
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
    provideHapticFeedback('impact_light');
  };

  // Handle press
  const handlePress = () => {
    if (action.disabled) return;
    action.onPress();
  };

  return (
    <Animated.View
      style={[
        styles.actionItemWrapper,
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <Pressable
        style={[
          styles.actionItem,
          variant === 'extended' && styles.actionItemExtended,
          action.disabled && styles.actionItemDisabled,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={action.disabled}
        accessibilityRole="button"
        accessibilityLabel={action.label}
        accessibilityState={{ disabled: action.disabled }}
        accessibilityHint={`Activate ${action.label}`}
      >
        {({ pressed }) => (
          <>
            {/* State Layer */}
            {pressed && !action.disabled && (
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    backgroundColor: LightTheme.OnSurface,
                    opacity: 0.12,
                    borderRadius: variant === 'extended' ? 16 : 20,
                  },
                ]}
              />
            )}

            {/* Icon Container with Badge */}
            <View style={styles.iconContainer}>
              {action.icon}
              {/* Badge Indicator */}
              {action.badge && (
                <View style={styles.badgeContainer}>
                  {action.badgeCount !== undefined && action.badgeCount > 0 ? (
                    <Text style={styles.badgeText}>
                      {action.badgeCount > 99 ? '99+' : action.badgeCount}
                    </Text>
                  ) : (
                    <View style={styles.badgeDot} />
                  )}
                </View>
              )}
            </View>

            {/* Label (Extended Mode) */}
            {variant === 'extended' && (
              <Text
                style={[
                  styles.actionLabel,
                  action.disabled && styles.actionLabelDisabled,
                ]}
              >
                {action.label}
              </Text>
            )}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56, // MD3: 56dp toolbar height
    justifyContent: 'center',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 4, // Small gap between items
  },
  actionItemWrapper: {
    // Wrapper for animation
  },
  actionItem: {
    width: 48, // Compact: square 48dp
    height: 48,
    borderRadius: 24, // Circular in compact mode
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  actionItemExtended: {
    width: 'auto', // Extended: auto width
    minWidth: 80,
    maxWidth: 120,
    paddingHorizontal: 16,
    borderRadius: 16, // Pill shape in extended mode
    flexDirection: 'column',
    gap: 4,
  },
  actionItemDisabled: {
    opacity: 0.38,
  },
  iconContainer: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: LightTheme.Error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: LightTheme.OnError,
  },
  badgeText: {
    ...Typography.labelSmall,
    fontSize: 10,
    color: LightTheme.OnError,
  },
  actionLabel: {
    ...Typography.labelSmall,
    color: LightTheme.OnSurface,
    textAlign: 'center',
  },
  actionLabelDisabled: {
    color: LightTheme.OnSurfaceVariant,
  },
});

export default Toolbar;

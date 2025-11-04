/**
 * MD3 SplitButton Component
 *
 * Material Design 3 split button with primary action and dropdown menu.
 *
 * Features:
 * - Primary action button (left side)
 * - Dropdown menu button (right side with chevron)
 * - Spring animations on press
 * - Haptic feedback on interactions
 * - Modal-based dropdown menu
 * - MD3 styling with filled/outlined variants
 *
 * ✅ M3E: Spring animations on both sections
 * ✅ M3E: Haptic feedback on press and menu selection
 * ✅ M3E: Smooth menu transitions
 *
 * Usage:
 * <SplitButton
 *   label="Save"
 *   onPress={() => console.log('Save')}
 *   menuItems={[
 *     { id: '1', label: 'Save as Draft', icon: <Icon /> },
 *     { id: '2', label: 'Save and Exit' },
 *   ]}
 *   onMenuItemPress={(id) => console.log(id)}
 * />
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  ViewStyle,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { provideHapticFeedback } from '../../../utils/haptics';

// Menu Item definition
export interface SplitButtonMenuItem {
  /** Unique identifier */
  id: string;

  /** Label text */
  label: string;

  /** Optional icon */
  icon?: React.ReactNode;

  /** Disable this item */
  disabled?: boolean;

  /** Destructive action (red text) */
  destructive?: boolean;
}

// SplitButton Props
export interface SplitButtonProps {
  /** Primary button label */
  label: string;

  /** Primary button press handler */
  onPress: () => void;

  /** Menu items for dropdown */
  menuItems: SplitButtonMenuItem[];

  /** Menu item selection handler */
  onMenuItemPress: (id: string) => void;

  /** Button variant */
  variant?: 'filled' | 'filled-tonal' | 'outlined';

  /** Button size */
  size?: 'small' | 'medium' | 'large';

  /** Disable the button */
  disabled?: boolean;

  /** Loading state */
  loading?: boolean;

  /** Custom style */
  style?: ViewStyle;
}

/**
 * MD3 SplitButton Component
 */
export const SplitButton: React.FC<SplitButtonProps> = ({
  label,
  onPress,
  menuItems,
  onMenuItemPress,
  variant = 'filled',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
}) => {
  // State for dropdown menu visibility
  const [menuVisible, setMenuVisible] = useState(false);

  // M3E: Spring animations for primary and dropdown buttons
  const primaryScaleValue = useRef(new Animated.Value(1)).current;
  const dropdownScaleValue = useRef(new Animated.Value(1)).current;

  // Button dimensions based on size
  let buttonHeight: number;
  let horizontalPadding: number;
  let textStyle = Typography.labelLarge;

  switch (size) {
    case 'small':
      buttonHeight = 32;
      horizontalPadding = 12;
      textStyle = Typography.labelMedium;
      break;
    case 'medium':
      buttonHeight = 40;
      horizontalPadding = 16;
      textStyle = Typography.labelLarge;
      break;
    case 'large':
      buttonHeight = 48;
      horizontalPadding = 24;
      textStyle = Typography.labelLarge;
      break;
  }

  // Variant-specific styles
  let containerStyle: ViewStyle = {};
  let textColor: string = LightTheme.OnPrimary;
  let dividerColor: string = LightTheme.OnPrimary;
  let stateLayerColor: string = LightTheme.OnPrimary;

  switch (variant) {
    case 'filled':
      containerStyle = {
        backgroundColor: LightTheme.Primary,
        elevation: 1,
        shadowColor: LightTheme.Shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      };
      textColor = LightTheme.OnPrimary;
      dividerColor = LightTheme.OnPrimary;
      stateLayerColor = LightTheme.OnPrimary;
      break;

    case 'filled-tonal':
      containerStyle = {
        backgroundColor: LightTheme.PrimaryContainer,
        elevation: 1,
        shadowColor: LightTheme.Shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      };
      textColor = LightTheme.OnPrimaryContainer;
      dividerColor = LightTheme.OnPrimaryContainer;
      stateLayerColor = LightTheme.OnPrimaryContainer;
      break;

    case 'outlined':
      containerStyle = {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: LightTheme.Outline,
      };
      textColor = LightTheme.Primary;
      dividerColor = LightTheme.Outline;
      stateLayerColor = LightTheme.Primary;
      break;
  }

  // M3E: Primary button press handlers
  const handlePrimaryPressIn = () => {
    if (disabled || loading) return;
    Animated.spring(primaryScaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 5,
      tension: 300,
    }).start();
  };

  const handlePrimaryPressOut = () => {
    if (disabled || loading) return;
    Animated.spring(primaryScaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
    provideHapticFeedback('selection');
  };

  // M3E: Dropdown button press handlers
  const handleDropdownPressIn = () => {
    if (disabled) return;
    Animated.spring(dropdownScaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 5,
      tension: 300,
    }).start();
  };

  const handleDropdownPressOut = () => {
    if (disabled) return;
    Animated.spring(dropdownScaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
    provideHapticFeedback('selection');
  };

  // Handle menu item selection
  const handleMenuItemSelect = (id: string) => {
    provideHapticFeedback('selection');
    setMenuVisible(false);
    onMenuItemPress(id);
  };

  // Disabled style
  const disabledStyle = disabled || loading ? { opacity: 0.38 } : {};

  return (
    <>
      <View
        style={[
          styles.container,
          containerStyle,
          { height: buttonHeight },
          disabledStyle,
          style,
        ]}
      >
        {/* Primary Action Button (Left) */}
        <Animated.View
          style={[
            styles.primaryButtonWrapper,
            { transform: [{ scale: primaryScaleValue }] },
          ]}
        >
          <Pressable
            style={[styles.primaryButton, { paddingHorizontal: horizontalPadding }]}
            onPress={onPress}
            onPressIn={handlePrimaryPressIn}
            onPressOut={handlePrimaryPressOut}
            disabled={disabled || loading}
            accessibilityRole="button"
            accessibilityLabel={label}
          >
            {({ pressed }) => (
              <>
                {pressed && !disabled && !loading && (
                  <View
                    style={[
                      StyleSheet.absoluteFillObject,
                      {
                        backgroundColor: stateLayerColor,
                        opacity: 0.12,
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                      },
                    ]}
                  />
                )}
                <Text style={[textStyle, { color: textColor }]}>{label}</Text>
              </>
            )}
          </Pressable>
        </Animated.View>

        {/* Divider */}
        <View
          style={[
            styles.divider,
            {
              backgroundColor: dividerColor,
              height: buttonHeight * 0.6,
            },
          ]}
        />

        {/* Dropdown Menu Button (Right) */}
        <Animated.View
          style={[
            styles.dropdownButtonWrapper,
            { transform: [{ scale: dropdownScaleValue }] },
          ]}
        >
          <Pressable
            style={[styles.dropdownButton, { width: buttonHeight }]}
            onPress={() => setMenuVisible(true)}
            onPressIn={handleDropdownPressIn}
            onPressOut={handleDropdownPressOut}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Show more options"
            accessibilityHint="Opens dropdown menu"
          >
            {({ pressed }) => (
              <>
                {pressed && !disabled && (
                  <View
                    style={[
                      StyleSheet.absoluteFillObject,
                      {
                        backgroundColor: stateLayerColor,
                        opacity: 0.12,
                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                      },
                    ]}
                  />
                )}
                {/* Chevron Down Icon */}
                <Text style={[{ fontSize: 20, color: textColor }]}>▼</Text>
              </>
            )}
          </Pressable>
        </Animated.View>
      </View>

      {/* Dropdown Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  item.disabled && styles.menuItemDisabled,
                ]}
                onPress={() => !item.disabled && handleMenuItemSelect(item.id)}
                disabled={item.disabled}
                accessibilityRole="menuitem"
                accessibilityLabel={item.label}
                accessibilityState={{ disabled: item.disabled }}
              >
                {item.icon && (
                  <View style={styles.menuItemIcon}>{item.icon}</View>
                )}
                <Text
                  style={[
                    styles.menuItemText,
                    item.destructive && styles.menuItemTextDestructive,
                    item.disabled && styles.menuItemTextDisabled,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  primaryButtonWrapper: {
    flex: 1,
  },
  primaryButton: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    opacity: 0.2,
  },
  dropdownButtonWrapper: {
    // No flex - fixed width based on button height
  },
  dropdownButton: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 12,
    minWidth: 200,
    maxWidth: 300,
    elevation: 3,
    shadowColor: LightTheme.Shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuItemDisabled: {
    opacity: 0.38,
  },
  menuItemIcon: {
    width: 24,
    height: 24,
  },
  menuItemText: {
    ...Typography.bodyLarge,
    color: LightTheme.OnSurface,
  },
  menuItemTextDestructive: {
    color: LightTheme.Error,
  },
  menuItemTextDisabled: {
    color: LightTheme.OnSurfaceVariant,
  },
});

export default SplitButton;

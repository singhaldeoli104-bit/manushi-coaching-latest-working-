/**
 * MD3 Button Component for Student Screens
 *
 * Material Design 3 compliant button with 5 variants:
 * - filled: Primary action, elevated with primary color
 * - filled-tonal: Secondary action, elevated with primary container
 * - outlined: Medium emphasis, outlined with border
 * - text: Low emphasis, no background or border
 * - elevated: Elevated filled button
 *
 * Sizes: small (32dp), medium (40dp), large (48dp)
 * Note: Small buttons use 48dp touch target with visual 32dp height (accessibility)
 *
 * ✅ FIXED: Touch target accessibility (48dp minimum)
 * ✅ FIXED: Proper MD3 state layer (0.12 opacity overlay on press)
 * ✅ M3E: Spring-based animations (subtle bounce on press)
 * ✅ M3E: Haptic feedback on press
 *
 * Usage:
 * <Button variant="filled" size="medium" onPress={handlePress}>
 *   Submit
 * </Button>
 *
 * <Button variant="outlined" icon="arrow-right" iconPosition="trailing" loading>
 *   Next
 * </Button>
 */

import React, { useRef } from 'react';
import {
  Pressable,
  PressableProps,
  ViewStyle,
  TextStyle,
  StyleProp,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { provideHapticFeedback } from '../../../utils/haptics';

// MD3 Button Variants
type ButtonVariant = 'filled' | 'filled-tonal' | 'outlined' | 'text' | 'elevated';

// MD3 Button Sizes (heights in dp)
type ButtonSize = 'small' | 'medium' | 'large';

// Icon Position
type IconPosition = 'leading' | 'trailing';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** Button variant following MD3 specifications */
  variant?: ButtonVariant;

  /** Button size (small: 32dp, medium: 40dp, large: 48dp) */
  size?: ButtonSize;

  /** Icon element to display */
  icon?: React.ReactNode;

  /** Position of the icon (leading or trailing) */
  iconPosition?: IconPosition;

  /** Show loading spinner instead of content */
  loading?: boolean;

  /** Disable button interaction */
  disabled?: boolean;

  /** Make button full width */
  fullWidth?: boolean;

  /** Custom button style (supports arrays, functions, and state-based styles) */
  style?: StyleProp<ViewStyle>;

  /** Custom text style (supports arrays, functions, and state-based styles) */
  textStyle?: StyleProp<TextStyle>;

  /** Button content (text) */
  children: React.ReactNode;
}

/**
 * MD3 Button Component
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  size = 'medium',
  icon,
  iconPosition = 'leading',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle: customTextStyle,
  children,
  ...props
}) => {
  // M3E: Spring animation for press feedback
  const scaleValue = useRef(new Animated.Value(1)).current;

  // M3E: Handle press in - scale down with spring animation
  const handlePressIn = () => {
    if (disabled || loading) return;

    Animated.spring(scaleValue, {
      toValue: 0.98, // Subtle scale down to 98%
      useNativeDriver: true,
      friction: 5,
      tension: 300,
    }).start();
  };

  // M3E: Handle press out - scale up with spring animation + haptic feedback
  const handlePressOut = () => {
    if (disabled || loading) return;

    Animated.spring(scaleValue, {
      toValue: 1, // Spring back to 100%
      useNativeDriver: true,
      friction: 3, // Less friction for bouncier feel
      tension: 40, // Lower tension for slower, more expressive spring
    }).start();

    // M3E: Provide haptic feedback
    provideHapticFeedback('selection');
  };

  // MD3 Base Button Styles
  const baseButtonStyle: ViewStyle = {
    borderRadius: 20, // MD3: Fully rounded corners
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative', // For state layer positioning
  };

  // MD3 Typography base - Label Large is default for buttons
  const baseTextStyle: TextStyle = {
    ...Typography.labelLarge,
  };

  // Size-specific styles (MD3 heights)
  let buttonHeight: number;
  let horizontalPadding: number;
  let typographyStyle: TextStyle;
  let iconSize: number = 18;
  let hitSlop: { top: number; bottom: number; left: number; right: number } | undefined;

  switch (size) {
    case 'small':
      buttonHeight = 32;
      horizontalPadding = 12;
      typographyStyle = Typography.labelMedium; // MD3: 12px for small buttons
      iconSize = 16;
      // FIXED: Ensure 48dp touch target for accessibility (WCAG 2.1)
      hitSlop = { top: 8, bottom: 8, left: 8, right: 8 };
      break;
    case 'medium':
      buttonHeight = 40;
      horizontalPadding = 16;
      typographyStyle = Typography.labelLarge; // MD3: 14px for medium buttons
      iconSize = 18;
      hitSlop = { top: 4, bottom: 4, left: 4, right: 4 };
      break;
    case 'large':
      buttonHeight = 48;
      horizontalPadding = 24;
      typographyStyle = Typography.labelLarge; // MD3: 14px (Label Large) for large buttons
      iconSize = 20;
      hitSlop = undefined; // Already 48dp
      break;
  }

  // Apply size styles
  const sizedButtonStyle: ViewStyle = {
    height: buttonHeight,
    paddingHorizontal: horizontalPadding,
    minWidth: buttonHeight * 2, // Minimum width = 2x height
  };

  const sizedTextStyle: TextStyle = {
    ...typographyStyle,
  };

  // Variant-specific styles (MD3 specifications)
  let variantButtonStyle: ViewStyle = {};
  let variantTextStyle: TextStyle = {};
  let spinnerColor: string = LightTheme.OnPrimary;
  let stateLayerColor: string = LightTheme.OnPrimary;

  switch (variant) {
    case 'filled':
      // MD3 Filled Button: Primary color, elevated
      variantButtonStyle = {
        backgroundColor: LightTheme.Primary,
        elevation: 1,
        shadowColor: LightTheme.Shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      };
      variantTextStyle = {
        color: LightTheme.OnPrimary,
      };
      spinnerColor = LightTheme.OnPrimary;
      stateLayerColor = LightTheme.OnPrimary;
      break;

    case 'filled-tonal':
      // MD3 Filled Tonal Button: Primary container, elevated
      variantButtonStyle = {
        backgroundColor: LightTheme.PrimaryContainer,
        elevation: 1,
        shadowColor: LightTheme.Shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      };
      variantTextStyle = {
        color: LightTheme.OnPrimaryContainer,
      };
      spinnerColor = LightTheme.OnPrimaryContainer;
      stateLayerColor = LightTheme.OnPrimaryContainer;
      break;

    case 'outlined':
      // MD3 Outlined Button: Transparent background with border
      variantButtonStyle = {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: LightTheme.Outline,
      };
      variantTextStyle = {
        color: LightTheme.Primary,
      };
      spinnerColor = LightTheme.Primary;
      stateLayerColor = LightTheme.Primary;
      break;

    case 'text':
      // MD3 Text Button: No background, no border
      variantButtonStyle = {
        backgroundColor: 'transparent',
      };
      variantTextStyle = {
        color: LightTheme.Primary,
      };
      spinnerColor = LightTheme.Primary;
      stateLayerColor = LightTheme.Primary;
      break;

    case 'elevated':
      // MD3 Elevated Button: Surface color with higher elevation
      variantButtonStyle = {
        backgroundColor: LightTheme.Surface,
        elevation: 2,
        shadowColor: LightTheme.Shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      };
      variantTextStyle = {
        color: LightTheme.Primary,
      };
      spinnerColor = LightTheme.Primary;
      stateLayerColor = LightTheme.Primary;
      break;
  }

  // Full width option
  if (fullWidth) {
    sizedButtonStyle.width = '100%';
  }

  // Disabled state (MD3: 0.38 opacity)
  let disabledStyle: ViewStyle = {};
  if (disabled || loading) {
    disabledStyle = {
      opacity: 0.38,
    };
  }

  // Flatten and combine all styles
  const finalButtonStyle: StyleProp<ViewStyle> = [
    baseButtonStyle,
    sizedButtonStyle,
    variantButtonStyle,
    disabledStyle,
    style,
  ];

  const finalTextStyle: StyleProp<TextStyle> = [
    baseTextStyle,
    sizedTextStyle,
    variantTextStyle,
    customTextStyle,
  ];

  // Render loading spinner
  if (loading) {
    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleValue }], // M3E: Maintain animation style
        }}
      >
        <Pressable
          style={finalButtonStyle}
          disabled
          hitSlop={hitSlop}
          accessibilityRole="button"
          accessibilityState={{ disabled: true, busy: true }}
          {...props}
        >
          <ActivityIndicator size="small" color={spinnerColor} />
        </Pressable>
      </Animated.View>
    );
  }

  // Render button content with icon
  const iconElement = icon ? (
    <View style={{ width: iconSize, height: iconSize }}>
      {icon}
    </View>
  ) : null;

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleValue }], // M3E: Apply spring scale animation
      }}
    >
      <Pressable
        style={finalButtonStyle}
        disabled={disabled}
        hitSlop={hitSlop}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        onPressIn={handlePressIn} // M3E: Trigger scale down animation
        onPressOut={handlePressOut} // M3E: Trigger scale up + haptic feedback
        {...props}
      >
        {({ pressed }) => (
          <>
            {/* FIXED: MD3 State Layer - 0.12 opacity overlay on press */}
            {pressed && !disabled && (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: stateLayerColor,
                  opacity: 0.12, // MD3: 0.12 state layer
                  borderRadius: 20,
                }}
              />
            )}

            {/* Button Content */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8, // MD3: 8dp gap between icon and text
              }}
            >
              {iconPosition === 'leading' && iconElement}
              <Text style={finalTextStyle}>{children}</Text>
              {iconPosition === 'trailing' && iconElement}
            </View>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

export default Button;

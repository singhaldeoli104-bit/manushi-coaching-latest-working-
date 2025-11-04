/**
 * MD3 IconButton Component for Student Screens
 *
 * Material Design 3 compliant icon button with 4 variants:
 * - filled: Primary action, elevated with primary color
 * - filled-tonal: Secondary action, elevated with primary container
 * - outlined: Medium emphasis, outlined with border
 * - standard: Low emphasis, no background or border
 *
 * Sizes: small (36dp), medium (40dp), large (48dp)
 * All sizes meet 48dp touch target minimum (accessibility)
 *
 * ✅ MD3: Touch target accessibility (48dp minimum)
 * ✅ MD3: Proper state layer (0.12 opacity overlay on press)
 * ✅ M3E: Spring-based animations (subtle bounce on press)
 * ✅ M3E: Haptic feedback on press
 *
 * Usage:
 * <IconButton variant="filled" size="medium" onPress={handlePress}>
 *   <Icon name="add" size={24} />
 * </IconButton>
 *
 * <IconButton variant="outlined" loading>
 *   <Icon name="delete" size={24} />
 * </IconButton>
 */

import React, { useRef } from 'react';
import {
  Pressable,
  PressableProps,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { provideHapticFeedback } from '../../../utils/haptics';

// MD3 IconButton Variants
type IconButtonVariant = 'filled' | 'filled-tonal' | 'outlined' | 'standard';

// MD3 IconButton Sizes (container sizes in dp)
type IconButtonSize = 'small' | 'medium' | 'large';

export interface IconButtonProps extends Omit<PressableProps, 'style'> {
  /** IconButton variant following MD3 specifications */
  variant?: IconButtonVariant;

  /** IconButton size (small: 36dp, medium: 40dp, large: 48dp) */
  size?: IconButtonSize;

  /** Show loading spinner instead of icon */
  loading?: boolean;

  /** Disable button interaction */
  disabled?: boolean;

  /** Custom button style */
  style?: StyleProp<ViewStyle>;

  /** Icon element to display (React.ReactNode for flexibility) */
  children: React.ReactNode;
}

/**
 * MD3 IconButton Component
 */
export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'standard',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  children,
  ...props
}) => {
  // M3E: Spring animation for press feedback
  const scaleValue = useRef(new Animated.Value(1)).current;

  // M3E: Handle press in - scale down with spring animation
  const handlePressIn = () => {
    if (disabled || loading) return;

    Animated.spring(scaleValue, {
      toValue: 0.95, // Slightly more pronounced scale for icon buttons
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
    provideHapticFeedback('impact_light'); // Lighter haptic for icon buttons
  };

  // MD3 Base IconButton Styles
  const baseButtonStyle: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative', // For state layer positioning
  };

  // Size-specific styles (MD3 container sizes)
  let containerSize: number;
  let borderRadius: number;
  let iconContainerSize: number = 24; // Default icon size
  let hitSlop: { top: number; bottom: number; left: number; right: number } | undefined;

  switch (size) {
    case 'small':
      containerSize = 36;
      borderRadius = 18; // Circular
      iconContainerSize = 20;
      // Ensure 48dp touch target for accessibility (WCAG 2.1)
      hitSlop = { top: 6, bottom: 6, left: 6, right: 6 };
      break;
    case 'medium':
      containerSize = 40;
      borderRadius = 20; // Circular
      iconContainerSize = 24;
      hitSlop = { top: 4, bottom: 4, left: 4, right: 4 };
      break;
    case 'large':
      containerSize = 48;
      borderRadius = 24; // Circular
      iconContainerSize = 28;
      hitSlop = undefined; // Already 48dp
      break;
  }

  // Apply size styles
  const sizedButtonStyle: ViewStyle = {
    width: containerSize,
    height: containerSize,
    borderRadius,
  };

  // Variant-specific styles (MD3 specifications)
  let variantButtonStyle: ViewStyle = {};
  let spinnerColor: string = LightTheme.OnPrimary;
  let stateLayerColor: string = LightTheme.OnSurface;

  switch (variant) {
    case 'filled':
      // MD3 Filled IconButton: Primary color, elevated
      variantButtonStyle = {
        backgroundColor: LightTheme.Primary,
        elevation: 1,
        shadowColor: LightTheme.Shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      };
      spinnerColor = LightTheme.OnPrimary;
      stateLayerColor = LightTheme.OnPrimary;
      break;

    case 'filled-tonal':
      // MD3 Filled Tonal IconButton: Secondary container, elevated
      variantButtonStyle = {
        backgroundColor: LightTheme.SecondaryContainer,
        elevation: 1,
        shadowColor: LightTheme.Shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      };
      spinnerColor = LightTheme.OnSecondaryContainer;
      stateLayerColor = LightTheme.OnSecondaryContainer;
      break;

    case 'outlined':
      // MD3 Outlined IconButton: Transparent background with border
      variantButtonStyle = {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: LightTheme.Outline,
      };
      spinnerColor = LightTheme.OnSurface;
      stateLayerColor = LightTheme.OnSurface;
      break;

    case 'standard':
      // MD3 Standard IconButton: No background, no border
      variantButtonStyle = {
        backgroundColor: 'transparent',
      };
      spinnerColor = LightTheme.OnSurfaceVariant;
      stateLayerColor = LightTheme.OnSurface;
      break;
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

  // Render icon button
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
            {/* MD3 State Layer - 0.12 opacity overlay on press */}
            {pressed && !disabled && (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: stateLayerColor,
                  opacity: 0.12, // MD3: 0.12 state layer
                  borderRadius,
                }}
              />
            )}

            {/* Icon Container */}
            <View
              style={{
                width: iconContainerSize,
                height: iconContainerSize,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {children}
            </View>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

export default IconButton;

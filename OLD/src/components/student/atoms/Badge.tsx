/**
 * MD3 Badge Component for Student Screens
 *
 * Material Design 3 compliant badge with positioning support
 *
 * Variants:
 * - small: 6dp circle (dot only)
 * - standard: 16dp height with number (1-99)
 * - large: 20dp height with number (1-999+)
 *
 * Status Colors: error, warning, success, info
 *
 * Positioning: top-right, top-left, bottom-right, bottom-left
 *
 * Usage:
 * // Standalone badge
 * <Badge value={5} variant="error" size="standard" />
 *
 * // Positioned badge (over parent)
 * <View>
 *   <Icon name="bell" size={24} />
 *   <Badge value={10} variant="error" position="top-right" />
 * </View>
 *
 * // Dot indicator
 * <View>
 *   <Icon name="notification" size={24} />
 *   <Badge variant="success" position="top-right" size="small" />
 * </View>
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';

// Badge Size
type BadgeSize = 'small' | 'standard' | 'large';

// Badge Status Colors
type BadgeVariant = 'error' | 'warning' | 'success' | 'info';

// Badge Position (for absolute positioning over parent)
type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface BadgeProps {
  /** Badge value (number to display) */
  value?: number;

  /** Badge variant (color) */
  variant?: BadgeVariant;

  /** Badge size */
  size?: BadgeSize;

  /** Position badge absolutely over parent */
  position?: BadgePosition;

  /** Custom badge style */
  style?: ViewStyle;
}

/**
 * MD3 Badge Component
 */
export const Badge: React.FC<BadgeProps> = ({
  value,
  variant = 'error',
  size = 'standard',
  position,
  style,
}) => {
  // Get variant colors
  const colors = getVariantColors(variant);

  // Get size dimensions
  const dimensions = getSizeDimensions(size);

  // Format badge value
  const displayValue = getDisplayValue(value, size);

  // Get position styles
  const positionStyle = position ? getPositionStyle(position, size) : undefined;

  // Combine styles
  const badgeStyle: ViewStyle = {
    ...styles.badge,
    backgroundColor: colors.background,
    ...dimensions,
    ...(positionStyle as ViewStyle),
    ...style,
  };

  const textStyle: TextStyle = {
    ...styles.badgeText,
    color: colors.text,
    fontSize: dimensions.fontSize,
  };

  // Render dot indicator (small size)
  if (size === 'small') {
    return <View style={badgeStyle} />;
  }

  // Render badge with number
  return (
    <View style={badgeStyle}>
      <Text style={textStyle}>{displayValue}</Text>
    </View>
  );
};

/**
 * Get variant-specific colors
 */
const getVariantColors = (variant: BadgeVariant) => {
  switch (variant) {
    case 'error':
      return {
        background: LightTheme.Error,
        text: LightTheme.OnError,
      };
    case 'warning':
      return {
        background: LightTheme.Warning,
        text: LightTheme.OnWarning,
      };
    case 'success':
      return {
        background: LightTheme.Success,
        text: LightTheme.OnSuccess,
      };
    case 'info':
      return {
        background: LightTheme.Info,
        text: LightTheme.OnInfo,
      };
    default:
      return {
        background: LightTheme.Error,
        text: LightTheme.OnError,
      };
  }
};

/**
 * Get size-specific dimensions
 */
const getSizeDimensions = (size: BadgeSize) => {
  switch (size) {
    case 'small':
      // MD3: 6dp dot indicator
      return {
        width: 6,
        height: 6,
        borderRadius: 3,
        fontSize: 0, // No text
      };
    case 'standard':
      // MD3: 16dp height, fits 1-99
      return {
        minWidth: 16,
        height: 16,
        paddingHorizontal: 4,
        borderRadius: 8,
        fontSize: 10,
      };
    case 'large':
      // MD3: 20dp height, fits 1-999+
      return {
        minWidth: 20,
        height: 20,
        paddingHorizontal: 5,
        borderRadius: 10,
        fontSize: 12,
      };
  }
};

/**
 * Get display value with max limits
 */
const getDisplayValue = (value: number | undefined, size: BadgeSize): string => {
  if (value === undefined || value === null) return '';

  if (size === 'small') {
    return ''; // Dot indicator has no text
  }

  if (size === 'standard') {
    // Standard: 1-99, 99+ for larger
    return value > 99 ? '99+' : value.toString();
  }

  if (size === 'large') {
    // Large: 1-999, 999+ for larger
    return value > 999 ? '999+' : value.toString();
  }

  return value.toString();
};

/**
 * Get position-specific styles for absolute positioning
 */
const getPositionStyle = (
  position: BadgePosition,
  size: BadgeSize
): Partial<ViewStyle> => {
  const offset = size === 'small' ? -2 : size === 'standard' ? -4 : -6;

  const base: ViewStyle = {
    position: 'absolute',
  };

  switch (position) {
    case 'top-right':
      return {
        ...base,
        top: offset,
        right: offset,
      };
    case 'top-left':
      return {
        ...base,
        top: offset,
        left: offset,
      };
    case 'bottom-right':
      return {
        ...base,
        bottom: offset,
        right: offset,
      };
    case 'bottom-left':
      return {
        ...base,
        bottom: offset,
        left: offset,
      };
    default:
      return base;
  }
};

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  badgeText: {
    ...Typography.labelSmall, // MD3: Base typography for badges
    fontWeight: '600', // MD3: Semi-bold for better visibility in small badges
    textAlign: 'center',
    includeFontPadding: false, // Android: Remove extra padding
  },
});

export default Badge;

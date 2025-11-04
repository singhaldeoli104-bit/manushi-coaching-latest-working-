/**
 * SkeletonLoader Component
 *
 * M3 Expressive skeleton loading placeholders for content.
 * Used to show placeholder UI while data is loading.
 *
 * Shapes:
 * - rectangle: Rectangular placeholder (default)
 * - circle: Circular placeholder (avatars, icons)
 * - rounded: Rounded rectangle (cards, buttons)
 * - text: Text line placeholder
 *
 * Features:
 * - Shimmer animation effect
 * - Customizable dimensions
 * - MD3 color tokens
 * - Smooth pulsing animation
 *
 * ✅ M3E: Shimmer animation
 * ✅ MD3: Proper color tokens
 * ✅ Accessibility: aria-busy
 *
 * Usage:
 * <SkeletonLoader shape="circle" width={48} height={48} />
 * <SkeletonLoader shape="text" width="80%" />
 * <SkeletonLoader shape="rounded" width={200} height={100} />
 *
 * // Example: Loading card
 * <View>
 *   <SkeletonLoader shape="circle" width={48} height={48} />
 *   <SkeletonLoader shape="text" width="60%" />
 *   <SkeletonLoader shape="text" width="40%" />
 *   <SkeletonLoader shape="rounded" width="100%" height={120} />
 * </View>
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, ViewStyle, DimensionValue } from 'react-native';
import { LightTheme } from '../../../theme/colors';

// Skeleton shape types
type SkeletonShape = 'rectangle' | 'circle' | 'rounded' | 'text';

export interface SkeletonLoaderProps {
  /** Shape of the skeleton placeholder */
  shape?: SkeletonShape;

  /** Width of the skeleton (number for dp, string for %) */
  width?: DimensionValue;

  /** Height of the skeleton (number for dp, string for %) */
  height?: DimensionValue;

  /** Border radius (only for 'rounded' shape) */
  borderRadius?: number;

  /** Enable shimmer animation (default: true) */
  shimmer?: boolean;

  /** Animation duration in ms (default: 1200) */
  animationDuration?: number;

  /** Custom container style */
  style?: ViewStyle;
}

/**
 * SkeletonLoader Component
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  shape = 'rectangle',
  width = '100%',
  height = 20,
  borderRadius,
  shimmer = true,
  animationDuration = 1200,
  style,
}) => {
  // Shimmer animation value
  const shimmerValue = useRef(new Animated.Value(0)).current;

  // Start shimmer animation
  useEffect(() => {
    if (!shimmer) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmer, shimmerValue, animationDuration]);

  // Shimmer opacity interpolation
  const shimmerOpacity = shimmerValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  // Calculate border radius based on shape
  let calculatedBorderRadius: number;
  switch (shape) {
    case 'circle':
      // For circle, use half of the smaller dimension
      const circleSize =
        typeof width === 'number' && typeof height === 'number'
          ? Math.min(width, height) / 2
          : 24; // Default fallback
      calculatedBorderRadius = circleSize;
      break;
    case 'rounded':
      calculatedBorderRadius = borderRadius ?? 12; // MD3: Default rounded corner
      break;
    case 'text':
      calculatedBorderRadius = 4; // Slight rounding for text lines
      break;
    case 'rectangle':
    default:
      calculatedBorderRadius = borderRadius ?? 0;
      break;
  }

  // Default height for text shape
  const finalHeight = shape === 'text' && height === 20 ? 16 : height;

  // Base skeleton style
  const skeletonStyle: ViewStyle = {
    width,
    height: finalHeight,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: calculatedBorderRadius,
    overflow: 'hidden',
  };

  return (
    <View
      style={[skeletonStyle, style]}
      accessible
      accessibilityRole="none"
      accessibilityLabel="Loading content"
      accessibilityState={{ busy: true }}
    >
      {shimmer && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: LightTheme.Surface,
            opacity: shimmerOpacity,
          }}
        />
      )}
    </View>
  );
};

/**
 * Pre-built skeleton layouts for common use cases
 */

/**
 * Avatar Skeleton (Circular)
 */
export const SkeletonAvatar: React.FC<{
  size?: number;
  style?: ViewStyle;
}> = ({ size = 48, style }) => (
  <SkeletonLoader shape="circle" width={size} height={size} {...(style && { style })} />
);

/**
 * Text Line Skeleton
 */
export const SkeletonText: React.FC<{
  width?: DimensionValue;
  style?: ViewStyle;
}> = ({ width = '100%', style }) => (
  <SkeletonLoader shape="text" width={width} height={16} {...(style && { style })} />
);

/**
 * Card Skeleton (Rounded rectangle)
 */
export const SkeletonCard: React.FC<{
  width?: DimensionValue;
  height?: number;
  style?: ViewStyle;
}> = ({ width = '100%', height = 120, style }) => (
  <SkeletonLoader shape="rounded" width={width} height={height} {...(style && { style })} />
);

/**
 * List Item Skeleton (Avatar + Text lines)
 */
export const SkeletonListItem: React.FC<{
  showAvatar?: boolean;
  style?: ViewStyle;
}> = ({ showAvatar = true, style }) => (
  <View
    style={[
      {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
      },
      style,
    ]}
  >
    {showAvatar && <SkeletonAvatar size={48} />}
    <View style={{ flex: 1, gap: 8 }}>
      <SkeletonText width="70%" />
      <SkeletonText width="50%" />
    </View>
  </View>
);

/**
 * Post/Card Skeleton (Full card with image + text)
 */
export const SkeletonPost: React.FC<{
  style?: ViewStyle;
}> = ({ style }) => (
  <View style={[{ padding: 16, gap: 12 }, style]}>
    {/* Header */}
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <SkeletonAvatar size={40} />
      <View style={{ flex: 1, gap: 6 }}>
        <SkeletonText width="40%" />
        <SkeletonText width="30%" />
      </View>
    </View>

    {/* Image placeholder */}
    <SkeletonCard height={200} />

    {/* Text content */}
    <View style={{ gap: 6 }}>
      <SkeletonText width="90%" />
      <SkeletonText width="80%" />
      <SkeletonText width="60%" />
    </View>
  </View>
);

export default SkeletonLoader;

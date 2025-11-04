/**
 * ShimmerEffect Component
 *
 * M3 Expressive shimmer loading effect overlay.
 * Can be applied to any container to show loading state.
 *
 * Features:
 * - Smooth animated shimmer sweep across container
 * - Customizable colors and gradients
 * - Horizontal/vertical directions
 * - Adjustable animation speed
 * - Can be used as overlay or standalone
 *
 * ✅ M3E: Smooth shimmer animation
 * ✅ MD3: Proper color tokens
 * ✅ Accessibility: aria-busy
 *
 * Usage:
 * // As overlay
 * <View style={{ position: 'relative' }}>
 *   <YourContent />
 *   {loading && <ShimmerEffect />}
 * </View>
 *
 * // Standalone with children
 * <ShimmerEffect visible={loading}>
 *   <YourContent />
 * </ShimmerEffect>
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, LayoutChangeEvent, DimensionValue } from 'react-native';
import { LightTheme } from '../../../theme/colors';

// Shimmer direction
type ShimmerDirection = 'horizontal' | 'vertical';

export interface ShimmerEffectProps {
  /** Show shimmer effect (default: true) */
  visible?: boolean;

  /** Direction of shimmer animation */
  direction?: ShimmerDirection;

  /** Animation duration in ms (default: 1500) */
  duration?: number;

  /** Base color (background) */
  baseColor?: string;

  /** Shimmer color (highlight) */
  shimmerColor?: string;

  /** Custom container style */
  style?: ViewStyle;

  /** Children to render (if using as wrapper) */
  children?: React.ReactNode;
}

/**
 * ShimmerEffect Component
 */
export const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  visible = true,
  direction = 'horizontal',
  duration = 1500,
  baseColor = LightTheme.SurfaceVariant,
  shimmerColor = LightTheme.Surface,
  style,
  children,
}) => {
  // Animation value for shimmer position
  const shimmerPosition = useRef(new Animated.Value(-1)).current;

  // Container dimensions
  const containerWidth = useRef(0);
  const containerHeight = useRef(0);

  // Start shimmer animation
  useEffect(() => {
    if (!visible) return;

    Animated.loop(
      Animated.timing(shimmerPosition, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      })
    ).start();

    return () => {
      shimmerPosition.setValue(-1);
    };
  }, [visible, shimmerPosition, duration]);

  // Handle layout to get container dimensions
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    containerWidth.current = width;
    containerHeight.current = height;
  };

  if (!visible) {
    return children ? <View style={style}>{children}</View> : null;
  }

  // Calculate shimmer transform based on direction
  const getShimmerTransform = () => {
    if (direction === 'horizontal') {
      const translateX = shimmerPosition.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-100%', '200%'],
      });
      return [{ translateX }];
    } else {
      const translateY = shimmerPosition.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-100%', '200%'],
      });
      return [{ translateY }];
    }
  };

  // Gradient simulation using opacity layers
  const renderShimmerGradient = () => {
    const gradientStops = [
      { offset: 0, opacity: 0 },
      { offset: 0.4, opacity: 0 },
      { offset: 0.5, opacity: 0.8 },
      { offset: 0.6, opacity: 0 },
      { offset: 1, opacity: 0 },
    ];

    return (
      <Animated.View
        style={[
          styles.shimmerGradient,
          {
            backgroundColor: shimmerColor,
            transform: getShimmerTransform(),
          },
          direction === 'horizontal'
            ? styles.shimmerGradientHorizontal
            : styles.shimmerGradientVertical,
        ]}
      >
        {gradientStops.map((stop, index) => (
          <View
            key={index}
            style={{
              flex: 1,
              backgroundColor: shimmerColor,
              opacity: stop.opacity,
            }}
          />
        ))}
      </Animated.View>
    );
  };

  // Render as overlay or wrapper
  if (children) {
    // Wrapper mode
    return (
      <View style={[styles.container, style]} onLayout={handleLayout}>
        {children}
        <View style={styles.shimmerOverlay}>
          <View style={[styles.shimmerBase, { backgroundColor: baseColor }]} />
          {renderShimmerGradient()}
        </View>
      </View>
    );
  }

  // Overlay mode (position: absolute)
  return (
    <View
      style={[StyleSheet.absoluteFill, styles.container, style]}
      onLayout={handleLayout}
      accessible
      accessibilityRole="none"
      accessibilityLabel="Loading"
      accessibilityState={{ busy: true }}
    >
      <View style={[styles.shimmerBase, { backgroundColor: baseColor }]} />
      {renderShimmerGradient()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  shimmerBase: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  shimmerGradient: {
    position: 'absolute',
    flexDirection: 'row',
  },
  shimmerGradientHorizontal: {
    top: 0,
    bottom: 0,
    width: '50%',
    left: 0,
  },
  shimmerGradientVertical: {
    left: 0,
    right: 0,
    height: '50%',
    top: 0,
    flexDirection: 'column',
  },
});

/**
 * Shimmer Placeholder - Combines ShimmerEffect with a placeholder background
 */
export const ShimmerPlaceholder: React.FC<{
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  visible?: boolean;
  style?: ViewStyle;
}> = ({ width = '100%', height = 100, borderRadius = 8, visible = true, style }) => (
  <View
    style={[
      {
        width,
        height,
        borderRadius,
        backgroundColor: LightTheme.SurfaceVariant,
        overflow: 'hidden' as 'hidden', // Type assertion for overflow
      },
      style,
    ]}
  >
    <ShimmerEffect visible={visible} />
  </View>
);

/**
 * Shimmer List - Multiple shimmer placeholders for list loading
 */
export const ShimmerList: React.FC<{
  count?: number;
  itemHeight?: number;
  gap?: number;
  style?: ViewStyle;
}> = ({ count = 5, itemHeight = 80, gap = 12, style }) => (
  <View style={[{ gap }, style]}>
    {Array.from({ length: count }).map((_, index) => (
      <ShimmerPlaceholder key={index} height={itemHeight} />
    ))}
  </View>
);

export default ShimmerEffect;

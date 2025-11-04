/**
 * LoadingIndicator Component
 *
 * M3 Expressive loading indicators with multiple variants:
 * - circular: Standard spinning circle (ActivityIndicator)
 * - linear: Horizontal progress bar
 * - pulse: Pulsing circle animation
 * - dots: Three bouncing dots
 *
 * Features:
 * - Smooth animations
 * - Customizable colors
 * - Multiple sizes
 * - Accessible labels
 *
 * ✅ M3E: Expressive animations
 * ✅ MD3: Proper color tokens
 * ✅ Accessibility: Proper labels
 *
 * Usage:
 * <LoadingIndicator variant="circular" size="medium" />
 * <LoadingIndicator variant="linear" progress={0.6} />
 * <LoadingIndicator variant="pulse" color={LightTheme.Primary} />
 * <LoadingIndicator variant="dots" />
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Animated,
  ViewStyle,
  AccessibilityProps,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';

// Loading indicator variants
type LoadingVariant = 'circular' | 'linear' | 'pulse' | 'dots';

// Loading indicator sizes
type LoadingSize = 'small' | 'medium' | 'large';

export interface LoadingIndicatorProps extends AccessibilityProps {
  /** Loading indicator variant */
  variant?: LoadingVariant;

  /** Size of the indicator */
  size?: LoadingSize;

  /** Color of the indicator (defaults to Primary) */
  color?: string;

  /** Progress value for linear variant (0-1) */
  progress?: number;

  /** Custom container style */
  style?: ViewStyle;
}

/**
 * Circular Loading Indicator (Standard ActivityIndicator)
 */
const CircularIndicator: React.FC<{
  size: LoadingSize;
  color: string;
}> = ({ size, color }) => {
  const sizeMap: Record<LoadingSize, 'small' | 'large'> = {
    small: 'small',
    medium: 'small',
    large: 'large',
  };

  return <ActivityIndicator size={sizeMap[size]} color={color} />;
};

/**
 * Linear Progress Indicator
 */
const LinearIndicator: React.FC<{
  size: LoadingSize;
  color: string;
  progress?: number;
}> = ({ size, color, progress }) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const isIndeterminate = progress === undefined;

  // Height based on size
  const heightMap: Record<LoadingSize, number> = {
    small: 2,
    medium: 4,
    large: 6,
  };

  const height = heightMap[size];

  useEffect(() => {
    if (isIndeterminate) {
      // Indeterminate animation - slide from left to right
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedWidth, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(animatedWidth, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      // Determinate animation - grow to progress value
      Animated.spring(animatedWidth, {
        toValue: progress,
        useNativeDriver: false,
        friction: 8,
        tension: 40,
      }).start();
    }
  }, [progress, isIndeterminate, animatedWidth]);

  const progressWidth = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={{
        width: '100%',
        height,
        backgroundColor: LightTheme.SurfaceVariant,
        borderRadius: height / 2,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={{
          height: '100%',
          width: progressWidth,
          backgroundColor: color,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
};

/**
 * Pulse Loading Indicator
 */
const PulseIndicator: React.FC<{
  size: LoadingSize;
  color: string;
}> = ({ size, color }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  // Size based on loading size
  const sizeMap: Record<LoadingSize, number> = {
    small: 24,
    medium: 40,
    large: 56,
  };

  const circleSize = sizeMap[size];

  useEffect(() => {
    // Pulsing animation
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [scaleValue, opacityValue]);

  return (
    <Animated.View
      style={{
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2,
        backgroundColor: color,
        transform: [{ scale: scaleValue }],
        opacity: opacityValue,
      }}
    />
  );
};

/**
 * Dots Loading Indicator (Three bouncing dots)
 */
const DotsIndicator: React.FC<{
  size: LoadingSize;
  color: string;
}> = ({ size, color }) => {
  const dot1Y = useRef(new Animated.Value(0)).current;
  const dot2Y = useRef(new Animated.Value(0)).current;
  const dot3Y = useRef(new Animated.Value(0)).current;

  // Dot size based on loading size
  const sizeMap: Record<LoadingSize, number> = {
    small: 6,
    medium: 8,
    large: 10,
  };

  const dotSize = sizeMap[size];
  const bounceHeight = dotSize * 2;

  useEffect(() => {
    // Bouncing animation with stagger
    const createBounceAnimation = (
      animatedValue: Animated.Value,
      delay: number
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: -bounceHeight,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      createBounceAnimation(dot1Y, 0),
      createBounceAnimation(dot2Y, 150),
      createBounceAnimation(dot3Y, 300),
    ]).start();
  }, [dot1Y, dot2Y, dot3Y, bounceHeight]);

  return (
    <View style={{ flexDirection: 'row', gap: dotSize }}>
      <Animated.View
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: color,
          transform: [{ translateY: dot1Y }],
        }}
      />
      <Animated.View
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: color,
          transform: [{ translateY: dot2Y }],
        }}
      />
      <Animated.View
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: color,
          transform: [{ translateY: dot3Y }],
        }}
      />
    </View>
  );
};

/**
 * LoadingIndicator Component
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  variant = 'circular',
  size = 'medium',
  color = LightTheme.Primary,
  progress,
  style,
  accessibilityLabel = 'Loading',
  ...accessibilityProps
}) => {
  // Render appropriate variant
  const renderIndicator = () => {
    switch (variant) {
      case 'circular':
        return <CircularIndicator size={size} color={color} />;
      case 'linear':
        return <LinearIndicator size={size} color={color} {...(progress !== undefined && { progress })} />;
      case 'pulse':
        return <PulseIndicator size={size} color={color} />;
      case 'dots':
        return <DotsIndicator size={size} color={color} />;
      default:
        return <CircularIndicator size={size} color={color} />;
    }
  };

  return (
    <View
      style={[styles.container, variant === 'linear' && styles.linearContainer, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessible
      {...accessibilityProps}
    >
      {renderIndicator()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearContainer: {
    width: '100%',
    justifyContent: 'center',
  },
});

export default LoadingIndicator;

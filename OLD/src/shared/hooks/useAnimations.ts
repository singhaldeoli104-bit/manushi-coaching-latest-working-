import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/**
 * FadeInUp animation hook - Cards enter from bottom with fade
 * @param delay - Animation delay in milliseconds (for staggered animations)
 * @returns Animated style object with opacity and translateY
 */
export const useFadeInUp = (delay: number = 0) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, fadeAnim, translateY]);

  return {
    opacity: fadeAnim,
    transform: [{ translateY }],
  };
};

/**
 * SlideIn animation hook - Modals/sheets slide in from direction
 * @param direction - Direction to slide from: 'up' | 'down' | 'left' | 'right'
 * @param visible - Control visibility state
 * @returns Animated style object with transform
 */
export const useSlideIn = (
  direction: 'up' | 'down' | 'left' | 'right',
  visible: boolean
) => {
  const slideAnim = useRef(new Animated.Value(visible ? 0 : 1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : 1,
      tension: 65,
      friction: 11,
      useNativeDriver: true,
    }).start();
  }, [visible, slideAnim]);

  const getTransform = () => {
    const distance = 300;
    switch (direction) {
      case 'up':
        return [{ translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, distance],
        }) }];
      case 'down':
        return [{ translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -distance],
        }) }];
      case 'left':
        return [{ translateX: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, distance],
        }) }];
      case 'right':
        return [{ translateX: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -distance],
        }) }];
    }
  };

  return {
    opacity: slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    transform: getTransform(),
  };
};

/**
 * Transition animation hook - Smooth transitions between states
 * @param condition - Boolean condition to trigger transition
 * @param duration - Animation duration in milliseconds
 * @returns Animated style object with opacity and scale
 */
export const useTransition = (condition: boolean, duration: number = 300) => {
  const opacityAnim = useRef(new Animated.Value(condition ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(condition ? 1 : 0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: condition ? 1 : 0,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: condition ? 1 : 0.95,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [condition, duration, opacityAnim, scaleAnim]);

  return {
    opacity: opacityAnim,
    transform: [{ scale: scaleAnim }],
  };
};

/**
 * Scale animation hook - Buttons/pressables with press feedback
 * @param pressed - Whether element is pressed
 * @returns Animated style object with scale
 */
export const useScalePress = (pressed: boolean) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: pressed ? 0.95 : 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [pressed, scaleAnim]);

  return {
    transform: [{ scale: scaleAnim }],
  };
};

/**
 * Shimmer animation hook - For loading skeletons
 * @returns Animated style object with translateX for shimmer effect
 */
export const useShimmer = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  return {
    transform: [{
      translateX: shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-300, 300],
      }),
    }],
  };
};

/**
 * Rotate animation hook - For loading spinners
 * @returns Animated style object with rotation
 */
export const useRotate = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  return {
    transform: [{
      rotate: rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      }),
    }],
  };
};

/**
 * Pulse animation hook - For attention-grabbing elements
 * @returns Animated style object with scale pulse
 */
export const usePulse = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return {
    transform: [{ scale: pulseAnim }],
  };
};

/**
 * MD3 LoadingState Component for Student Screens
 *
 * Material Design 3 compliant loading states with skeletons
 *
 * Variants:
 * - full-screen: Full-screen circular progress indicator
 * - inline: Small circular indicator for inline content
 * - overlay: Loading overlay with backdrop
 * - skeleton-card: Skeleton placeholder for card
 * - skeleton-list: Skeleton placeholder for list item
 * - skeleton-profile: Skeleton placeholder for profile
 *
 * Features:
 * - Circular progress indicator (48dp)
 * - Linear progress indicator (full-width)
 * - Shimmer animation effect
 * - Multiple skeleton variants
 *
 * Usage:
 * <LoadingState variant="full-screen" />
 * <LoadingState variant="skeleton-card" />
 * <LoadingState variant="inline" text="Loading..." />
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';

// Loading State Variant
type LoadingStateVariant =
  | 'full-screen'
  | 'inline'
  | 'overlay'
  | 'skeleton-card'
  | 'skeleton-list'
  | 'skeleton-profile';

export interface LoadingStateProps {
  /** Loading state variant */
  variant?: LoadingStateVariant;

  /** Optional loading text */
  text?: string;

  /** Custom container style */
  style?: ViewStyle;

  /** Show shimmer animation (for skeletons) */
  showShimmer?: boolean;
}

/**
 * MD3 LoadingState Component
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'full-screen',
  text,
  style,
  showShimmer = true,
}) => {
  // Render appropriate variant
  switch (variant) {
    case 'full-screen':
      return <FullScreenLoading {...(text && { text })} {...(style && { style })} />;
    case 'inline':
      return <InlineLoading {...(text && { text })} {...(style && { style })} />;
    case 'overlay':
      return <OverlayLoading {...(text && { text })} {...(style && { style })} />;
    case 'skeleton-card':
      return <SkeletonCard showShimmer={showShimmer} {...(style && { style })} />;
    case 'skeleton-list':
      return <SkeletonList showShimmer={showShimmer} {...(style && { style })} />;
    case 'skeleton-profile':
      return <SkeletonProfile showShimmer={showShimmer} {...(style && { style })} />;
    default:
      return <FullScreenLoading {...(text && { text })} {...(style && { style })} />;
  }
};

/**
 * Full-Screen Loading (centered)
 */
const FullScreenLoading: React.FC<{ text?: string; style?: ViewStyle }> = ({
  text,
  style,
}) => (
  <View style={[styles.fullScreen, style]}>
    <ActivityIndicator size={48} color={LightTheme.Primary} />
    {text && <Text style={styles.loadingText}>{text}</Text>}
  </View>
);

/**
 * Inline Loading (small)
 */
const InlineLoading: React.FC<{ text?: string; style?: ViewStyle }> = ({
  text,
  style,
}) => (
  <View style={[styles.inline, style]}>
    <ActivityIndicator size="small" color={LightTheme.Primary} />
    {text && (
      <Text style={styles.inlineText}>{text}</Text>
    )}
  </View>
);

/**
 * Overlay Loading (with backdrop)
 */
const OverlayLoading: React.FC<{ text?: string; style?: ViewStyle }> = ({
  text,
  style,
}) => (
  <View style={[styles.overlay, style]}>
    <View style={styles.overlayContent}>
      <ActivityIndicator size={48} color={LightTheme.Primary} />
      {text && (
        <Text style={styles.overlayText}>{text}</Text>
      )}
    </View>
  </View>
);

/**
 * Skeleton Card
 */
const SkeletonCard: React.FC<{ showShimmer: boolean; style?: ViewStyle }> = ({
  showShimmer,
  style,
}) => {
  const shimmer = useShimmerAnimation(showShimmer);

  return (
    <View style={[styles.skeletonCard, style]}>
      <Animated.View
        style={[
          styles.skeletonHeader,
          showShimmer && { opacity: shimmer },
        ]}
      />
      <Animated.View
        style={[
          styles.skeletonLine,
          { width: '90%' },
          showShimmer && { opacity: shimmer },
        ]}
      />
      <Animated.View
        style={[
          styles.skeletonLine,
          { width: '70%' },
          showShimmer && { opacity: shimmer },
        ]}
      />
      <Animated.View
        style={[
          styles.skeletonLine,
          { width: '60%' },
          showShimmer && { opacity: shimmer },
        ]}
      />
    </View>
  );
};

/**
 * Skeleton List Item
 */
const SkeletonList: React.FC<{ showShimmer: boolean; style?: ViewStyle }> = ({
  showShimmer,
  style,
}) => {
  const shimmer = useShimmerAnimation(showShimmer);

  return (
    <View style={[styles.skeletonList, style]}>
      <Animated.View
        style={[
          styles.skeletonAvatar,
          showShimmer && { opacity: shimmer },
        ]}
      />
      <View style={styles.skeletonListContent}>
        <Animated.View
          style={[
            styles.skeletonLine,
            { width: '80%', height: 16 },
            showShimmer && { opacity: shimmer },
          ]}
        />
        <Animated.View
          style={[
            styles.skeletonLine,
            { width: '60%', height: 12 },
            showShimmer && { opacity: shimmer },
          ]}
        />
      </View>
    </View>
  );
};

/**
 * Skeleton Profile
 */
const SkeletonProfile: React.FC<{ showShimmer: boolean; style?: ViewStyle }> = ({
  showShimmer,
  style,
}) => {
  const shimmer = useShimmerAnimation(showShimmer);

  return (
    <View style={[styles.skeletonProfile, style]}>
      <Animated.View
        style={[
          styles.skeletonProfileAvatar,
          showShimmer && { opacity: shimmer },
        ]}
      />
      <Animated.View
        style={[
          styles.skeletonLine,
          { width: 120, height: 20, marginTop: 16 },
          showShimmer && { opacity: shimmer },
        ]}
      />
      <Animated.View
        style={[
          styles.skeletonLine,
          { width: 80, height: 14, marginTop: 8 },
          showShimmer && { opacity: shimmer },
        ]}
      />
    </View>
  );
};

/**
 * Shimmer Animation Hook
 */
const useShimmerAnimation = (enabled: boolean) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!enabled) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [enabled]);

  return shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
};

const styles = StyleSheet.create({
  // Full-Screen Loading
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LightTheme.Surface,
  },

  loadingText: {
    marginTop: 16,
    ...Typography.bodyMedium, // MD3: 14px/20/400
    color: LightTheme.OnSurfaceVariant,
  },

  // Inline Loading
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },

  inlineText: {
    ...Typography.bodyMedium, // MD3: 14px/20/400
    color: LightTheme.OnSurfaceVariant,
  },

  // Overlay Loading
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.32)', // MD3: 0.32 scrim
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  overlayContent: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    elevation: 4,
    shadowColor: LightTheme.Shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  overlayText: {
    marginTop: 16,
    ...Typography.bodyMedium, // MD3: 14px/20/400
    color: LightTheme.OnSurface,
  },

  // Skeleton Card
  skeletonCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: LightTheme.Shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  skeletonHeader: {
    width: '100%',
    height: 120,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 8,
    marginBottom: 12,
  },

  skeletonLine: {
    height: 12,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 6,
    marginBottom: 8,
  },

  // Skeleton List
  skeletonList: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },

  skeletonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: LightTheme.SurfaceVariant,
  },

  skeletonListContent: {
    flex: 1,
    gap: 8,
  },

  // Skeleton Profile
  skeletonProfile: {
    alignItems: 'center',
    padding: 24,
  },

  skeletonProfileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: LightTheme.SurfaceVariant,
  },
});

export default LoadingState;

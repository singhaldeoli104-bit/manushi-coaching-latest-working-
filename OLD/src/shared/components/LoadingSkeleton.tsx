import React from 'react';
import { View, StyleSheet, ViewStyle, Animated } from 'react-native';
import { useShimmer } from '../hooks/useAnimations';

interface LoadingSkeletonProps {
  /**
   * Width of the skeleton (number or string with %)
   */
  width?: number | string;
  /**
   * Height of the skeleton
   */
  height?: number;
  /**
   * Border radius
   */
  borderRadius?: number;
  /**
   * Custom style
   */
  style?: ViewStyle;
  /**
   * Variant for common shapes
   */
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

/**
 * LoadingSkeleton - Animated placeholder for loading content
 *
 * Usage:
 * ```tsx
 * <LoadingSkeleton variant="text" width="80%" height={16} />
 * <LoadingSkeleton variant="circular" width={50} height={50} />
 * <LoadingSkeleton variant="card" height={120} />
 * ```
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  variant = 'rectangular',
}) => {
  const shimmerStyle = useShimmer();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'text':
        return {
          width: width,
          height: height || 16,
          borderRadius: 4,
        };
      case 'circular':
        const size = typeof width === 'number' ? width : height;
        return {
          width: size,
          height: size,
          borderRadius: size / 2,
        };
      case 'card':
        return {
          width: '100%',
          height: height || 120,
          borderRadius: 12,
        };
      case 'rectangular':
      default:
        return {
          width,
          height,
          borderRadius,
        };
    }
  };

  return (
    <View
      style={[
        styles.skeleton,
        getVariantStyles(),
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          shimmerStyle,
        ]}
      />
    </View>
  );
};

/**
 * SkeletonGroup - Group of skeletons for common patterns
 */
interface SkeletonGroupProps {
  variant: 'list' | 'card' | 'profile' | 'article';
  count?: number;
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  variant,
  count = 3,
}) => {
  switch (variant) {
    case 'list':
      return (
        <View>
          {Array.from({ length: count }).map((_, index) => (
            <View key={index} style={styles.listItem}>
              <LoadingSkeleton variant="circular" width={40} height={40} />
              <View style={styles.listContent}>
                <LoadingSkeleton variant="text" width="70%" height={16} />
                <LoadingSkeleton variant="text" width="50%" height={14} style={{ marginTop: 8 }} />
              </View>
            </View>
          ))}
        </View>
      );

    case 'card':
      return (
        <View>
          {Array.from({ length: count }).map((_, index) => (
            <View key={index} style={styles.cardContainer}>
              <LoadingSkeleton variant="rectangular" width="100%" height={150} borderRadius={12} />
              <LoadingSkeleton variant="text" width="80%" height={20} style={{ marginTop: 12 }} />
              <LoadingSkeleton variant="text" width="60%" height={16} style={{ marginTop: 8 }} />
            </View>
          ))}
        </View>
      );

    case 'profile':
      return (
        <View style={styles.profileContainer}>
          <LoadingSkeleton variant="circular" width={80} height={80} />
          <LoadingSkeleton variant="text" width={150} height={24} style={{ marginTop: 16 }} />
          <LoadingSkeleton variant="text" width={120} height={16} style={{ marginTop: 8 }} />
          <View style={styles.profileStats}>
            {Array.from({ length: 3 }).map((_, index) => (
              <View key={index} style={styles.statItem}>
                <LoadingSkeleton variant="text" width={60} height={20} />
                <LoadingSkeleton variant="text" width={50} height={14} style={{ marginTop: 4 }} />
              </View>
            ))}
          </View>
        </View>
      );

    case 'article':
      return (
        <View style={styles.articleContainer}>
          <LoadingSkeleton variant="rectangular" width="100%" height={200} borderRadius={12} />
          <LoadingSkeleton variant="text" width="90%" height={24} style={{ marginTop: 16 }} />
          <LoadingSkeleton variant="text" width="95%" height={16} style={{ marginTop: 12 }} />
          <LoadingSkeleton variant="text" width="88%" height={16} style={{ marginTop: 8 }} />
          <LoadingSkeleton variant="text" width="92%" height={16} style={{ marginTop: 8 }} />
        </View>
      );

    default:
      return null;
  }
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  profileContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  profileStats: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  articleContainer: {
    paddingHorizontal: 16,
  },
});

/**
 * HorizontalCarousel Component - Premium Minimal Design
 *
 * Generic horizontal scrolling carousel with snap behavior.
 * Optimized for performance with FlatList and memoization.
 *
 * Features:
 * - Horizontal scrolling with snap-to-item behavior
 * - Pagination indicators (optional)
 * - Momentum scrolling
 * - Performance optimized (windowing, memoization)
 * - Accessibility support (horizontal scrolling announced)
 * - Auto-scroll support (optional)
 * - Empty state handling
 *
 * Usage:
 * <HorizontalCarousel
 *   data={classes}
 *   renderItem={(item) => <EventCard {...item} />}
 *   keyExtractor={(item) => item.id}
 *   accessibilityLabel="Today's classes"
 *   showPagination
 * />
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Spacing } from '../../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface HorizontalCarouselProps<T> {
  /** Array of data to render */
  data: T[];

  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;

  /** Key extractor function */
  keyExtractor: (item: T, index: number) => string;

  /** Accessibility label for the carousel */
  accessibilityLabel: string;

  /** Snap to interval (item width + spacing) */
  snapToInterval?: number;

  /** Show pagination indicators */
  showPagination?: boolean;

  /** Auto-scroll interval in milliseconds (0 = disabled) */
  autoScrollInterval?: number;

  /** Custom container style */
  style?: ViewStyle;

  /** Empty state component */
  emptyComponent?: React.ReactNode;

  /** Content container padding horizontal */
  contentPaddingHorizontal?: number;

  /** Item spacing */
  itemSpacing?: number;
}

/**
 * HorizontalCarousel Component
 */
export function HorizontalCarousel<T>({
  data,
  renderItem,
  keyExtractor,
  accessibilityLabel,
  snapToInterval,
  showPagination = false,
  autoScrollInterval = 0,
  style,
  emptyComponent,
  contentPaddingHorizontal = Spacing.MD,
  itemSpacing = Spacing.MD,
}: HorizontalCarouselProps<T>) {
  const flatListRef = useRef<FlatList<T>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

  // Memoized render item
  const renderItemMemoized = useCallback(
    ({ item, index }: { item: T; index: number }) => {
      return (
        <View
          style={{
            marginRight: index === data.length - 1 ? 0 : itemSpacing,
          }}
        >
          {renderItem(item, index)}
        </View>
      );
    },
    [renderItem, data.length, itemSpacing]
  );

  // Handle scroll to update pagination
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!showPagination || !snapToInterval) return;

      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / snapToInterval);
      setCurrentIndex(index);
    },
    [showPagination, snapToInterval]
  );

  // Auto-scroll functionality
  React.useEffect(() => {
    if (autoScrollInterval > 0 && data.length > 1) {
      autoScrollTimer.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % data.length;
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          return nextIndex;
        });
      }, autoScrollInterval);

      return () => {
        if (autoScrollTimer.current) {
          clearInterval(autoScrollTimer.current);
        }
      };
    }
  }, [autoScrollInterval, data.length]);

  // Handle empty state
  if (data.length === 0) {
    if (emptyComponent) {
      return <View style={[styles.container, style]}>{emptyComponent}</View>;
    }
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItemMemoized}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapToInterval}
        decelerationRate="fast"
        snapToAlignment="start"
        contentContainerStyle={{
          paddingHorizontal: contentPaddingHorizontal,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        // Performance optimizations
        removeClippedSubviews
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        initialNumToRender={3}
        windowSize={5}
        // Accessibility
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="list"
        accessible
      />

      {/* Pagination Indicators */}
      {showPagination && data.length > 1 && (
        <View style={styles.paginationContainer}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
              accessibilityLabel={`Page ${index + 1} of ${data.length}`}
              accessibilityRole="button"
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Container spans full width
  },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.SM,
    gap: Spacing.XS,
  },

  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: LightTheme.OutlineVariant,
  },

  paginationDotActive: {
    width: 24,
    backgroundColor: LightTheme.Primary,
  },
});

// Export memoized version for better performance
export default React.memo(HorizontalCarousel) as typeof HorizontalCarousel;

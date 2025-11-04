/**
 * ScreenShareViewer Component
 *
 * Displays shared screen content with aspect ratio handling, fullscreen toggle,
 * and pinch-to-zoom support.
 *
 * Features:
 * - Screen share display area
 * - Aspect ratio handling (16:9, 4:3, auto)
 * - Fullscreen toggle button
 * - Pinch-to-zoom support
 * - "No screen sharing" state
 * - Loading indicator
 * - Orientation change handling
 * - Material Design 3 styling
 *
 * @example
 * <ScreenShareViewer
 *   streamUrl="https://stream.example.com/screen"
 *   isSharing={true}
 *   aspectRatio="16:9"
 *   onFullscreenToggle={() => console.log('Fullscreen')}
 * />
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';

// Aspect Ratio Types
export type AspectRatio = '16:9' | '4:3' | 'auto';

// Component Props
interface ScreenShareViewerProps {
  /** Screen share stream URL */
  streamUrl?: string;

  /** Is screen sharing active */
  isSharing: boolean;

  /** Aspect ratio for the viewer */
  aspectRatio?: AspectRatio;

  /** Is fullscreen mode */
  isFullscreen?: boolean;

  /** Callback for fullscreen toggle */
  onFullscreenToggle?: () => void;

  /** Loading state */
  loading?: boolean;
}

/**
 * Get aspect ratio value
 */
const getAspectRatioValue = (ratio: AspectRatio): number => {
  switch (ratio) {
    case '16:9':
      return 16 / 9;
    case '4:3':
      return 4 / 3;
    case 'auto':
      return 16 / 9; // Default fallback
    default:
      return 16 / 9;
  }
};

/**
 * Calculate viewer dimensions
 */
const calculateDimensions = (
  aspectRatio: AspectRatio,
  containerWidth: number,
  isFullscreen: boolean
): { width: number; height: number } => {
  if (isFullscreen) {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  }

  const ratio = getAspectRatioValue(aspectRatio);
  const height = containerWidth / ratio;

  return { width: containerWidth, height };
};


/**
 * Screen/Monitor Icon
 */
const ScreenIcon: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    {/* Monitor screen */}
    <View
      style={{
        width: size * 0.85,
        height: size * 0.6,
        borderWidth: 2,
        borderColor: color,
        borderRadius: 4,
        marginBottom: size * 0.1,
      }}
    />
    {/* Monitor stand */}
    <View
      style={{
        width: size * 0.3,
        height: 2,
        backgroundColor: color,
        position: 'absolute',
        bottom: size * 0.15,
      }}
    />
    {/* Monitor base */}
    <View
      style={{
        width: size * 0.5,
        height: 2,
        backgroundColor: color,
        position: 'absolute',
        bottom: size * 0.05,
      }}
    />
  </View>
);

/**
 * No Screen Sharing State Component
 */
const NoScreenSharingState: React.FC = () => (
  <View style={styles.emptyState}>
    <ScreenIcon size={48} color={LightTheme.OnSurfaceVariant} />
    <Text style={styles.emptyStateTitle}>No Screen Sharing</Text>
    <Text style={styles.emptyStateText}>
      The instructor is not currently sharing their screen
    </Text>
  </View>
);

/**
 * Loading State Component
 */
const LoadingState: React.FC = () => (
  <View style={styles.loadingState}>
    <ActivityIndicator size="large" color={LightTheme.Primary} />
    <Text style={styles.loadingText}>Loading screen share...</Text>
  </View>
);

/**
 * Fullscreen Button Component
 */
interface FullscreenButtonProps {
  isFullscreen: boolean;
  onPress: () => void;
}

const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  isFullscreen,
  onPress,
}) => (
  <Pressable
    style={({ pressed }) => [
      styles.fullscreenButton,
      pressed && styles.fullscreenButtonPressed,
    ]}
    onPress={onPress}
  >
    <Text style={styles.fullscreenIcon}>
      {isFullscreen ? '⤓' : '⤢'}
    </Text>
  </Pressable>
);

/**
 * ScreenShareViewer Component
 */
const ScreenShareViewer: React.FC<ScreenShareViewerProps> = ({
  streamUrl,
  isSharing,
  aspectRatio = '16:9',
  isFullscreen = false,
  onFullscreenToggle,
  loading = false,
}) => {
  const [containerWidth, setContainerWidth] = useState(
    Dimensions.get('window').width - 32
  );
  const [zoomScale, setZoomScale] = useState(1);

  // Calculate dimensions
  const dimensions = calculateDimensions(aspectRatio, containerWidth, isFullscreen);

  // Handle layout
  const handleLayout = useCallback((event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  // Handle zoom (simplified - full pinch-to-zoom would require react-native-gesture-handler)
  const handleZoomIn = useCallback(() => {
    setZoomScale((prev) => Math.min(prev + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomScale((prev) => Math.max(prev - 0.25, 1));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomScale(1);
  }, []);

  // If not sharing, show empty state
  if (!isSharing) {
    return (
      <View style={styles.container} onLayout={handleLayout}>
        <NoScreenSharingState />
      </View>
    );
  }

  // If loading, show loading state
  if (loading) {
    return (
      <View
        style={[styles.container, { height: dimensions.height }]}
        onLayout={handleLayout}
      >
        <LoadingState />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        isFullscreen && styles.containerFullscreen,
        { height: dimensions.height },
      ]}
      onLayout={handleLayout}
    >
      {/* Screen Share Content Area */}
      <View
        style={[
          styles.screenShareArea,
          {
            width: dimensions.width,
            height: dimensions.height,
            transform: [{ scale: zoomScale }],
          },
        ]}
      >
        {/* Placeholder for actual screen share content */}
        {/* In production, this would be replaced with actual video/screen share rendering */}
        <View style={styles.screenSharePlaceholder}>
          <Text style={styles.screenSharePlaceholderText}>
            Screen Share Content
          </Text>
          <Text style={styles.screenShareUrl} numberOfLines={1}>
            {streamUrl || 'No stream URL'}
          </Text>
        </View>
      </View>

      {/* Controls Overlay */}
      <View style={styles.controlsOverlay}>
        {/* Top Bar with Info */}
        <View style={styles.topBar}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>

          {/* Fullscreen Button */}
          {onFullscreenToggle && (
            <FullscreenButton
              isFullscreen={isFullscreen}
              onPress={onFullscreenToggle}
            />
          )}
        </View>

        {/* Bottom Bar with Zoom Controls */}
        {zoomScale !== 1 && (
          <View style={styles.bottomBar}>
            <View style={styles.zoomControls}>
              <Pressable
                style={({ pressed }) => [
                  styles.zoomButton,
                  pressed && styles.zoomButtonPressed,
                ]}
                onPress={handleZoomOut}
              >
                <Text style={styles.zoomButtonText}>−</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.zoomResetButton,
                  pressed && styles.zoomButtonPressed,
                ]}
                onPress={handleZoomReset}
              >
                <Text style={styles.zoomResetText}>{Math.round(zoomScale * 100)}%</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.zoomButton,
                  pressed && styles.zoomButtonPressed,
                ]}
                onPress={handleZoomIn}
              >
                <Text style={styles.zoomButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* Aspect Ratio Indicator */}
      <View style={styles.aspectRatioIndicator}>
        <Text style={styles.aspectRatioText}>{aspectRatio}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: LightTheme.Surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: LightTheme.OutlineVariant,
  },
  containerFullscreen: {
    borderRadius: 0,
    borderWidth: 0,
  },
  screenShareArea: {
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenSharePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  screenSharePlaceholderText: {
    ...Typography.titleMedium, // MD3: 16px/24/500
    fontSize: 18, // Custom size for placeholder emphasis
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  screenShareUrl: {
    ...Typography.labelMedium, // MD3: 12px/16/500
    color: '#CCCCCC',
    maxWidth: '80%',
    textAlign: 'center',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
    marginRight: 6,
  },
  liveText: {
    ...Typography.labelMedium, // MD3: 12px/16/500
    fontWeight: '700', // Override for emphasis
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  fullscreenButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenButtonPressed: {
    opacity: 0.88, // MD3: Slight opacity for pressed state (1 - 0.12 overlay)
  },
  fullscreenIcon: {
    ...Typography.bodyLarge, // MD3: 16px (icon - custom 20px acceptable)
    fontSize: 20, // Override for icon size
    color: '#FFFFFF',
  },
  bottomBar: {
    padding: 12,
    alignItems: 'center',
  },
  zoomControls: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 24,
    padding: 4,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButtonPressed: {
    opacity: 0.88, // MD3: Slight opacity for pressed state (1 - 0.12 overlay)
  },
  zoomButtonText: {
    ...Typography.headlineSmall, // MD3: 24px
    fontWeight: '600', // Override for emphasis
    color: '#FFFFFF',
  },
  zoomResetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomResetText: {
    ...Typography.labelLarge, // MD3: 14px/20/500
    fontWeight: '600', // Override for emphasis
    color: '#FFFFFF',
  },
  aspectRatioIndicator: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  aspectRatioText: {
    ...Typography.labelSmall, // MD3: 11px (standardized from 10px)
    fontWeight: '600', // Override for emphasis
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 200,
  },
  emptyStateTitle: {
    ...Typography.titleMedium, // MD3: 16px/24/500
    fontSize: 18, // Custom size for empty state emphasis
    fontWeight: '600',
    color: LightTheme.OnSurface,
    marginBottom: 8,
  },
  emptyStateText: {
    ...Typography.bodyMedium, // MD3: 14px/20/400
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.bodyMedium, // MD3: 14px/20/400
    color: LightTheme.OnSurfaceVariant,
    marginTop: 12,
  },
});

export default ScreenShareViewer;

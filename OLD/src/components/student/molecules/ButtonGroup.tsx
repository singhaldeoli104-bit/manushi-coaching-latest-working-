/**
 * MD3 ButtonGroup Component (Segmented Control)
 *
 * Material Design 3 segmented button group with spring animations and haptic feedback.
 *
 * Features:
 * - Single selection mode (radio behavior)
 * - Multi-selection mode (checkbox behavior)
 * - Spring-based animations on segment press
 * - Haptic feedback on selection change
 * - Connected appearance (rounded corners only on ends)
 * - MD3 styling with filled/outlined variants
 *
 * ✅ M3E: Spring animations on press
 * ✅ M3E: Haptic feedback on selection
 * ✅ M3E: Smooth transitions between states
 *
 * Usage:
 * <ButtonGroup
 *   segments={[
 *     { id: '1', label: 'Day', icon: <Icon /> },
 *     { id: '2', label: 'Week' },
 *     { id: '3', label: 'Month' }
 *   ]}
 *   selectedId="1"
 *   onSelectionChange={(id) => console.log(id)}
 * />
 *
 * Multi-select:
 * <ButtonGroup
 *   segments={[...]}
 *   selectedIds={['1', '3']}
 *   multiSelect
 *   onMultiSelectionChange={(ids) => console.log(ids)}
 * />
 */

import React, { useRef } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { provideHapticFeedback } from '../../../utils/haptics';

// Segment definition
export interface ButtonGroupSegment {
  /** Unique identifier for the segment */
  id: string;

  /** Label text for the segment */
  label: string;

  /** Optional icon element */
  icon?: React.ReactNode;

  /** Disable this segment */
  disabled?: boolean;
}

// ButtonGroup Props
export interface ButtonGroupProps {
  /** Array of segments to display */
  segments: ButtonGroupSegment[];

  /** Currently selected segment ID (single select mode) */
  selectedId?: string;

  /** Currently selected segment IDs (multi select mode) */
  selectedIds?: string[];

  /** Enable multi-selection mode */
  multiSelect?: boolean;

  /** Callback when selection changes (single select) */
  onSelectionChange?: (id: string) => void;

  /** Callback when selection changes (multi select) */
  onMultiSelectionChange?: (ids: string[]) => void;

  /** Variant: filled or outlined */
  variant?: 'filled' | 'outlined';

  /** Full width mode */
  fullWidth?: boolean;

  /** Custom container style */
  style?: ViewStyle;
}

/**
 * MD3 ButtonGroup Component (Segmented Control)
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  segments,
  selectedId,
  selectedIds = [],
  multiSelect = false,
  onSelectionChange,
  onMultiSelectionChange,
  variant = 'outlined',
  fullWidth = false,
  style,
}) => {
  // Validate props
  if (segments.length === 0) {
    console.warn('ButtonGroup: segments array is empty');
    return null;
  }

  // Handle segment press
  const handleSegmentPress = (segmentId: string, disabled?: boolean) => {
    if (disabled) return;

    // M3E: Haptic feedback on selection change
    provideHapticFeedback('selection');

    if (multiSelect) {
      // Multi-select mode: toggle selection
      const newSelectedIds = selectedIds.includes(segmentId)
        ? selectedIds.filter((id) => id !== segmentId)
        : [...selectedIds, segmentId];

      onMultiSelectionChange?.(newSelectedIds);
    } else {
      // Single select mode: replace selection
      onSelectionChange?.(segmentId);
    }
  };

  // Check if a segment is selected
  const isSelected = (segmentId: string): boolean => {
    if (multiSelect) {
      return selectedIds.includes(segmentId);
    }
    return selectedId === segmentId;
  };

  // Render individual segment
  const renderSegment = (segment: ButtonGroupSegment, index: number) => {
    const selected = isSelected(segment.id);
    const isFirst = index === 0;
    const isLast = index === segments.length - 1;

    return (
      <SegmentButton
        key={segment.id}
        segment={segment}
        selected={selected}
        isFirst={isFirst}
        isLast={isLast}
        variant={variant}
        onPress={() => handleSegmentPress(segment.id, segment.disabled)}
        fullWidth={fullWidth}
        segmentCount={segments.length}
      />
    );
  };

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth, style]}>
      {segments.map((segment, index) => renderSegment(segment, index))}
    </View>
  );
};

// Individual Segment Button Component
interface SegmentButtonProps {
  segment: ButtonGroupSegment;
  selected: boolean;
  isFirst: boolean;
  isLast: boolean;
  variant: 'filled' | 'outlined';
  onPress: () => void;
  fullWidth: boolean;
  segmentCount: number;
}

const SegmentButton: React.FC<SegmentButtonProps> = ({
  segment,
  selected,
  isFirst,
  isLast,
  variant,
  onPress,
  fullWidth,
  segmentCount,
}) => {
  // M3E: Spring animation for press feedback
  const scaleValue = useRef(new Animated.Value(1)).current;

  // M3E: Handle press in - scale down with spring
  const handlePressIn = () => {
    if (segment.disabled) return;

    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 5,
      tension: 300,
    }).start();
  };

  // M3E: Handle press out - scale up with spring
  const handlePressOut = () => {
    if (segment.disabled) return;

    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  // Determine segment style based on variant and selection
  let segmentStyle: ViewStyle = {};
  let textColor: string = LightTheme.OnSurface;
  let stateLayerColor: string = LightTheme.OnSurface;

  if (variant === 'outlined') {
    // Outlined variant
    segmentStyle = {
      backgroundColor: selected ? LightTheme.SecondaryContainer : 'transparent',
      borderWidth: 1,
      borderColor: LightTheme.Outline,
    };
    textColor = selected ? LightTheme.OnSecondaryContainer : LightTheme.OnSurface;
    stateLayerColor = selected ? LightTheme.OnSecondaryContainer : LightTheme.OnSurface;
  } else {
    // Filled variant
    segmentStyle = {
      backgroundColor: selected ? LightTheme.Primary : LightTheme.SurfaceVariant,
    };
    textColor = selected ? LightTheme.OnPrimary : LightTheme.OnSurfaceVariant;
    stateLayerColor = textColor;
  }

  // Corner radius logic (only round first and last segments)
  const borderRadiusStyle: ViewStyle = {};
  if (isFirst) {
    borderRadiusStyle.borderTopLeftRadius = 20;
    borderRadiusStyle.borderBottomLeftRadius = 20;
  }
  if (isLast) {
    borderRadiusStyle.borderTopRightRadius = 20;
    borderRadiusStyle.borderBottomRightRadius = 20;
  }

  // Remove double borders between segments
  const borderStyle: ViewStyle = {};
  if (!isLast && variant === 'outlined') {
    borderStyle.borderRightWidth = 0;
  }

  // Disabled style
  const disabledStyle: ViewStyle = segment.disabled
    ? { opacity: 0.38 }
    : {};

  return (
    <Animated.View
      style={[
        styles.segmentWrapper,
        fullWidth && { flex: 1 },
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <Pressable
        style={[
          styles.segment,
          segmentStyle,
          borderRadiusStyle,
          borderStyle,
          disabledStyle,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={segment.disabled}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled: segment.disabled }}
        accessibilityLabel={segment.label}
      >
        {({ pressed }) => (
          <>
            {/* MD3 State Layer */}
            {pressed && !segment.disabled && (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: stateLayerColor,
                  opacity: 0.12,
                  borderRadius: isFirst ? 20 : isLast ? 20 : 0,
                }}
              />
            )}

            {/* Segment Content */}
            <View style={styles.segmentContent}>
              {segment.icon && (
                <View style={styles.iconContainer}>{segment.icon}</View>
              )}
              <Text style={[styles.segmentText, { color: textColor }]}>
                {segment.label}
              </Text>
            </View>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  segmentWrapper: {
    // No gap - segments should be connected
  },
  segment: {
    height: 40, // MD3: 40dp height for segmented buttons
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48, // Minimum touch target
    position: 'relative',
  },
  segmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 18,
    height: 18,
  },
  segmentText: {
    ...Typography.labelLarge,
  },
});

export default ButtonGroup;

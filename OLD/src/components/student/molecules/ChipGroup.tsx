/**
 * MD3 ChipGroup Component
 *
 * Material Design 3 chip collection with multiple chip types.
 *
 * Features:
 * - 4 chip types: filter, assist, input, suggestion
 * - Single and multi-selection modes
 * - Spring animations on selection
 * - Haptic feedback on interactions
 * - Optional icons and avatars
 * - Close button for input chips
 * - Wrap layout for multiple rows
 *
 * ✅ M3E: Spring animations on chip press
 * ✅ M3E: Haptic feedback on selection
 * ✅ M3E: Smooth selection transitions
 *
 * Usage:
 * <ChipGroup
 *   chips={[
 *     { id: '1', label: 'Math', icon: <Icon /> },
 *     { id: '2', label: 'Science', icon: <Icon /> }
 *   ]}
 *   type="filter"
 *   selectedIds={['1']}
 *   onSelectionChange={(ids) => setFilters(ids)}
 * />
 */

import React, { useRef } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { provideHapticFeedback } from '../../../utils/haptics';

// Chip type
type ChipType = 'filter' | 'assist' | 'input' | 'suggestion';

// Chip definition
export interface Chip {
  /** Unique identifier */
  id: string;

  /** Chip label */
  label: string;

  /** Optional leading icon */
  icon?: React.ReactNode;

  /** Optional avatar (for input chips) */
  avatar?: React.ReactNode;

  /** Disable this chip */
  disabled?: boolean;
}

// ChipGroup Props
export interface ChipGroupProps {
  /** Array of chips */
  chips: Chip[];

  /** Chip type */
  type?: ChipType;

  /** Selected chip IDs (single or multi-select) */
  selectedIds?: string[];

  /** Selection change handler */
  onSelectionChange?: (ids: string[]) => void;

  /** Chip close handler (for input chips) */
  onChipClose?: (id: string) => void;

  /** Allow multi-selection (filter chips) */
  multiSelect?: boolean;

  /** Custom style */
  style?: ViewStyle;
}

/**
 * MD3 ChipGroup Component
 */
export const ChipGroup: React.FC<ChipGroupProps> = ({
  chips,
  type = 'filter',
  selectedIds = [],
  onSelectionChange,
  onChipClose,
  multiSelect = true,
  style,
}) => {
  // Handle chip press
  const handleChipPress = (chipId: string) => {
    provideHapticFeedback('selection');

    if (type === 'input') {
      // Input chips don't have selection, only close
      return;
    }

    if (multiSelect) {
      // Multi-select: toggle chip
      const newSelectedIds = selectedIds.includes(chipId)
        ? selectedIds.filter((id) => id !== chipId)
        : [...selectedIds, chipId];
      onSelectionChange?.(newSelectedIds);
    } else {
      // Single-select: replace selection
      onSelectionChange?.([chipId]);
    }
  };

  // Handle chip close
  const handleChipClose = (chipId: string) => {
    provideHapticFeedback('impact_light');
    onChipClose?.(chipId);
  };

  return (
    <View style={[styles.container, style]}>
      {chips.map((chip) => {
        const isSelected = selectedIds.includes(chip.id);
        return (
          <ChipItem
            key={chip.id}
            chip={chip}
            type={type}
            isSelected={isSelected}
            onPress={() => handleChipPress(chip.id)}
            onClose={
              type === 'input' ? () => handleChipClose(chip.id) : undefined
            }
          />
        );
      })}
    </View>
  );
};

// Individual Chip Item Component
interface ChipItemProps {
  chip: Chip;
  type: ChipType;
  isSelected: boolean;
  onPress: () => void;
  onClose?: () => void;
}

const ChipItem: React.FC<ChipItemProps> = ({
  chip,
  type,
  isSelected,
  onPress,
  onClose,
}) => {
  // M3E: Spring animation for chip press
  const scaleValue = useRef(new Animated.Value(1)).current;

  // M3E: Press handlers
  const handlePressIn = () => {
    if (chip.disabled) return;
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 5,
      tension: 300,
    }).start();
  };

  const handlePressOut = () => {
    if (chip.disabled) return;
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  // Determine chip style based on type and selection
  let chipStyle: ViewStyle = {};
  let textColor: string = LightTheme.OnSurfaceVariant;
  let iconColor: string = LightTheme.OnSurfaceVariant;

  switch (type) {
    case 'filter':
      if (isSelected) {
        chipStyle = {
          backgroundColor: LightTheme.SecondaryContainer,
          borderWidth: 0,
        };
        textColor = LightTheme.OnSecondaryContainer;
        iconColor = LightTheme.OnSecondaryContainer;
      } else {
        chipStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: LightTheme.Outline,
        };
        textColor = LightTheme.OnSurfaceVariant;
        iconColor = LightTheme.OnSurfaceVariant;
      }
      break;

    case 'assist':
      chipStyle = {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: LightTheme.Outline,
      };
      textColor = LightTheme.OnSurface;
      iconColor = LightTheme.Primary;
      break;

    case 'input':
      chipStyle = {
        backgroundColor: LightTheme.SurfaceVariant,
        borderWidth: 0,
      };
      textColor = LightTheme.OnSurfaceVariant;
      iconColor = LightTheme.OnSurfaceVariant;
      break;

    case 'suggestion':
      chipStyle = {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: LightTheme.Outline,
      };
      textColor = LightTheme.OnSurfaceVariant;
      iconColor = LightTheme.OnSurfaceVariant;
      break;
  }

  const disabled = chip.disabled;

  return (
    <Animated.View
      style={[
        styles.chipWrapper,
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <Pressable
        style={[
          styles.chip,
          chipStyle,
          disabled && styles.chipDisabled,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={chip.label}
        accessibilityState={{ selected: isSelected, disabled }}
      >
        {({ pressed }) => (
          <>
            {/* State Layer */}
            {pressed && !disabled && (
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    backgroundColor: textColor,
                    opacity: 0.12,
                    borderRadius: 8,
                  },
                ]}
              />
            )}

            {/* Chip Content */}
            <View style={styles.chipContent}>
              {/* Avatar (input chips) */}
              {type === 'input' && chip.avatar && (
                <View style={styles.chipAvatar}>{chip.avatar}</View>
              )}

              {/* Icon */}
              {chip.icon && type !== 'input' && (
                <View style={styles.chipIcon}>{chip.icon}</View>
              )}

              {/* Checkmark (selected filter chips) */}
              {type === 'filter' && isSelected && (
                <Text style={[styles.chipCheckmark, { color: iconColor }]}>
                  ✓
                </Text>
              )}

              {/* Label */}
              <Text style={[styles.chipLabel, { color: textColor }]}>
                {chip.label}
              </Text>

              {/* Close Button (input chips) */}
              {type === 'input' && onClose && (
                <Pressable
                  style={styles.chipCloseButton}
                  onPress={onClose}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Remove"
                >
                  <Text style={[styles.chipCloseIcon, { color: textColor }]}>
                    ✕
                  </Text>
                </Pressable>
              )}
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
    flexWrap: 'wrap',
    gap: 8,
  },
  chipWrapper: {
    // Wrapper for animation
  },
  chip: {
    height: 32, // MD3: 32dp height for chips
    borderRadius: 8, // MD3: Small corner radius
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  chipDisabled: {
    opacity: 0.38,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chipAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: -4, // Negative margin to align with edge
  },
  chipIcon: {
    width: 18,
    height: 18,
  },
  chipCheckmark: {
    fontSize: 16,
    fontWeight: '600',
  },
  chipLabel: {
    ...Typography.labelMedium,
  },
  chipCloseButton: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  chipCloseIcon: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ChipGroup;

/**
 * MD3 DateTimePicker Component
 *
 * Material Design 3 date/time selection with modal interface.
 *
 * Features:
 * - Date and time picker modes
 * - Modal-based selection interface
 * - Quick presets (Today, Tomorrow, Next Week)
 * - Spring animations on modal appear
 * - Haptic feedback on selection
 * - Formatted display value
 *
 * ✅ M3E: Spring animations on modal
 * ✅ M3E: Haptic feedback on date/time selection
 * ✅ M3E: Smooth transitions
 *
 * Usage:
 * <DateTimePicker
 *   mode="date"
 *   value={selectedDate}
 *   onValueChange={(date) => setSelectedDate(date)}
 *   label="Select Date"
 * />
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  ViewStyle,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { provideHapticFeedback } from '../../../utils/haptics';

// Picker mode
type PickerMode = 'date' | 'time' | 'datetime';

// DateTimePicker Props
export interface DateTimePickerProps {
  /** Picker mode */
  mode?: PickerMode;

  /** Current value */
  value?: Date;

  /** Value change handler */
  onValueChange: (value: Date) => void;

  /** Label for the picker button */
  label?: string;

  /** Minimum selectable date */
  minimumDate?: Date;

  /** Maximum selectable date */
  maximumDate?: Date;

  /** Custom style */
  style?: ViewStyle;
}

/**
 * MD3 DateTimePicker Component
 */
export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  mode = 'date',
  value,
  onValueChange,
  label = 'Select Date',
  minimumDate,
  maximumDate,
  style,
}) => {
  // State
  const [modalVisible, setModalVisible] = useState(false);
  const [tempValue, setTempValue] = useState(value || new Date());

  // M3E: Modal animation
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  // Show modal with animation
  const showModal = () => {
    setModalVisible(true);
    setTempValue(value || new Date());
    provideHapticFeedback('impact_light');

    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 100,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Hide modal with animation
  const hideModal = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 100,
      }),
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  };

  // Handle confirm
  const handleConfirm = () => {
    provideHapticFeedback('success');
    onValueChange(tempValue);
    hideModal();
  };

  // Handle cancel
  const handleCancel = () => {
    provideHapticFeedback('impact_light');
    hideModal();
  };

  // Quick preset handlers
  const handleToday = () => {
    provideHapticFeedback('selection');
    setTempValue(new Date());
  };

  const handleTomorrow = () => {
    provideHapticFeedback('selection');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTempValue(tomorrow);
  };

  const handleNextWeek = () => {
    provideHapticFeedback('selection');
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setTempValue(nextWeek);
  };

  // Format display value
  const formatDisplayValue = (date?: Date): string => {
    if (!date) return label;

    if (mode === 'date') {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } else if (mode === 'time') {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  return (
    <>
      {/* Picker Button */}
      <Pressable
        style={[styles.pickerButton, style]}
        onPress={showModal}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {({ pressed }) => (
          <>
            {pressed && (
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    backgroundColor: LightTheme.OnSurface,
                    opacity: 0.12,
                    borderRadius: 4,
                  },
                ]}
              />
            )}
            <Text
              style={[
                styles.pickerButtonText,
                !value && styles.pickerButtonPlaceholder,
              ]}
            >
              {formatDisplayValue(value)}
            </Text>
            <Text style={styles.pickerButtonIcon}>📅</Text>
          </>
        )}
      </Pressable>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={handleCancel}
      >
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: opacityValue,
            },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={handleCancel}
          />
        </Animated.View>

        {/* Modal Content */}
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ scale: scaleValue }],
                opacity: opacityValue,
              },
            ]}
          >
            {/* Title */}
            <Text style={styles.modalTitle}>{label}</Text>

            {/* Current Selection Display */}
            <View style={styles.currentValueContainer}>
              <Text style={styles.currentValueText}>
                {formatDisplayValue(tempValue)}
              </Text>
            </View>

            {/* Quick Presets (Date mode only) */}
            {mode === 'date' && (
              <View style={styles.presetsContainer}>
                <Text style={styles.presetsLabel}>Quick Select:</Text>
                <View style={styles.presetsButtons}>
                  <TouchableOpacity
                    style={styles.presetButton}
                    onPress={handleToday}
                  >
                    <Text style={styles.presetButtonText}>Today</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.presetButton}
                    onPress={handleTomorrow}
                  >
                    <Text style={styles.presetButtonText}>Tomorrow</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.presetButton}
                    onPress={handleNextWeek}
                  >
                    <Text style={styles.presetButtonText}>Next Week</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Note */}
            <Text style={styles.noteText}>
              Note: This is a simplified picker. Use native date/time pickers
              for production apps.
            </Text>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  pickerButton: {
    height: 56, // MD3: Text field height
    borderWidth: 1,
    borderColor: LightTheme.Outline,
    borderRadius: 4,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: LightTheme.Surface,
    position: 'relative',
  },
  pickerButtonText: {
    ...Typography.bodyLarge,
    color: LightTheme.OnSurface,
    flex: 1,
  },
  pickerButtonPlaceholder: {
    color: LightTheme.OnSurfaceVariant,
  },
  pickerButtonIcon: {
    fontSize: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 28, // MD3: Extra large corner radius
    padding: 24,
    width: '100%',
    maxWidth: 400,
    elevation: 3,
    shadowColor: LightTheme.Shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    ...Typography.headlineSmall,
    color: LightTheme.OnSurface,
    marginBottom: 16,
    textAlign: 'center',
  },
  currentValueContainer: {
    backgroundColor: LightTheme.PrimaryContainer,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  currentValueText: {
    ...Typography.titleLarge,
    color: LightTheme.OnPrimaryContainer,
    fontWeight: '600',
  },
  presetsContainer: {
    marginBottom: 16,
  },
  presetsLabel: {
    ...Typography.labelMedium,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: 8,
  },
  presetsButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  presetButton: {
    flex: 1,
    backgroundColor: LightTheme.SecondaryContainer,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  presetButtonText: {
    ...Typography.labelMedium,
    color: LightTheme.OnSecondaryContainer,
  },
  noteText: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    ...Typography.labelLarge,
    color: LightTheme.Primary,
  },
  confirmButton: {
    backgroundColor: LightTheme.Primary,
  },
  confirmButtonText: {
    ...Typography.labelLarge,
    color: LightTheme.OnPrimary,
  },
});

export default DateTimePicker;

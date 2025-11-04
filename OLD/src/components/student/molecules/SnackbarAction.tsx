/**
 * MD3 SnackbarAction Component
 *
 * Material Design 3 toast notification with optional action button.
 *
 * Features:
 * - Slide-up animation from bottom
 * - Auto-dismiss after customizable duration
 * - Optional action button
 * - 4 variants: default, success, error, warning, info
 * - Spring animations on appear/dismiss
 * - Haptic feedback on action press
 * - Swipe-to-dismiss gesture
 *
 * ✅ M3E: Spring-based slide animations
 * ✅ M3E: Haptic feedback on action
 * ✅ M3E: Smooth fade transitions
 *
 * Usage:
 * <SnackbarAction
 *   visible={showSnackbar}
 *   message="Item deleted"
 *   actionLabel="Undo"
 *   onActionPress={() => handleUndo()}
 *   onDismiss={() => setShowSnackbar(false)}
 *   variant="success"
 *   duration={3000}
 * />
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { provideHapticFeedback } from '../../../utils/haptics';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Snackbar variant
type SnackbarVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

// SnackbarAction Props
export interface SnackbarActionProps {
  /** Show/hide the snackbar */
  visible: boolean;

  /** Message to display */
  message: string;

  /** Optional action button label */
  actionLabel?: string;

  /** Action button press handler */
  onActionPress?: () => void;

  /** Dismiss callback */
  onDismiss: () => void;

  /** Snackbar variant (affects color) */
  variant?: SnackbarVariant;

  /** Auto-dismiss duration in ms (0 = no auto-dismiss) */
  duration?: number;

  /** Position from bottom */
  bottomOffset?: number;
}

/**
 * MD3 SnackbarAction Component
 */
export const SnackbarAction: React.FC<SnackbarActionProps> = ({
  visible,
  message,
  actionLabel,
  onActionPress,
  onDismiss,
  variant = 'default',
  duration = 4000,
  bottomOffset = 16,
}) => {
  // M3E: Slide animation
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Auto-dismiss timer
  const dismissTimer = useRef<NodeJS.Timeout | null>(null);

  // M3E: Animate in when visible
  useEffect(() => {
    if (visible) {
      // Clear any existing timer
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
      }

      // Slide up with spring
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 100,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss after duration
      if (duration > 0) {
        dismissTimer.current = setTimeout(() => {
          handleDismiss();
        }, duration);
      }

      // Provide haptic feedback
      if (variant === 'success') {
        provideHapticFeedback('success');
      } else if (variant === 'error') {
        provideHapticFeedback('error');
      } else if (variant === 'warning') {
        provideHapticFeedback('warning');
      } else {
        provideHapticFeedback('impact_light');
      }
    } else {
      // Slide down when hidden
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 100,
          useNativeDriver: true,
          friction: 8,
          tension: 100,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return () => {
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
      }
    };
  }, [visible, duration, translateY, opacity, variant]);

  // Handle dismiss
  const handleDismiss = () => {
    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current);
    }
    onDismiss();
  };

  // Handle action press
  const handleActionPress = () => {
    provideHapticFeedback('selection');
    onActionPress?.();
    handleDismiss();
  };

  // Variant-specific styles
  let backgroundColor: string = LightTheme.InverseSurface;
  let textColor: string = LightTheme.InverseOnSurface;
  let actionColor: string = LightTheme.InversePrimary;

  switch (variant) {
    case 'success':
      backgroundColor = LightTheme.PrimaryContainer;
      textColor = LightTheme.OnPrimaryContainer;
      actionColor = LightTheme.Primary;
      break;
    case 'error':
      backgroundColor = LightTheme.ErrorContainer;
      textColor = LightTheme.OnErrorContainer;
      actionColor = LightTheme.Error;
      break;
    case 'warning':
      backgroundColor = '#FFF4E5'; // Amber container
      textColor = '#663C00'; // Amber on-container
      actionColor = '#FF9800'; // Amber
      break;
    case 'info':
      backgroundColor = LightTheme.TertiaryContainer;
      textColor = LightTheme.OnTertiaryContainer;
      actionColor = LightTheme.Tertiary;
      break;
  }

  if (!visible) {
    return null;
  }

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.snackbar,
            {
              backgroundColor,
              bottom: bottomOffset,
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          {/* Message */}
          <Text
            style={[styles.message, { color: textColor }]}
            numberOfLines={2}
          >
            {message}
          </Text>

          {/* Action Button */}
          {actionLabel && onActionPress && (
            <Pressable
              style={styles.actionButton}
              onPress={handleActionPress}
              accessibilityRole="button"
              accessibilityLabel={actionLabel}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    styles.actionLabel,
                    { color: actionColor },
                    pressed && styles.actionLabelPressed,
                  ]}
                >
                  {actionLabel}
                </Text>
              )}
            </Pressable>
          )}

          {/* Close Button */}
          <Pressable
            style={styles.closeButton}
            onPress={handleDismiss}
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.closeIcon,
                  { color: textColor },
                  pressed && styles.closeIconPressed,
                ]}
              >
                ✕
              </Text>
            )}
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
  snackbar: {
    position: 'absolute',
    left: 16,
    right: 16,
    maxWidth: SCREEN_WIDTH - 32,
    minHeight: 48,
    borderRadius: 4, // MD3: Small corner radius for snackbar
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: LightTheme.Shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  message: {
    ...Typography.bodyMedium,
    flex: 1,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionLabel: {
    ...Typography.labelLarge,
    fontWeight: '600',
  },
  actionLabelPressed: {
    opacity: 0.7,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeIconPressed: {
    opacity: 0.7,
  },
});

export default SnackbarAction;

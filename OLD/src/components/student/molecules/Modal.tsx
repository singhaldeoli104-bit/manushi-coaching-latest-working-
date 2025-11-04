/**
 * MD3 Modal Component for Student Screens
 *
 * Material Design 3 compliant modal with 2 variants:
 * - dialog: Centered modal with backdrop
 * - fullscreen: Full-screen modal with top bar
 *
 * Features:
 * - Backdrop with 0.32 scrim opacity
 * - Fade animation
 * - Hardware back button support
 * - Safe area handling
 *
 * Usage:
 * <Modal
 *   visible={isVisible}
 *   variant="dialog"
 *   onClose={handleClose}
 *   title="Confirm Action"
 * >
 *   <T>Are you sure you want to continue?</T>
 *   <Button onPress={handleConfirm}>Confirm</Button>
 * </Modal>
 */

import React, { useEffect } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Animated,
  BackHandler,
  Pressable,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { getElevatedSurface } from '../../../theme/elevation';

// Modal Variant
type ModalVariant = 'dialog' | 'fullscreen';

export interface ModalProps {
  /** Modal visibility */
  visible: boolean;

  /** Modal variant */
  variant?: ModalVariant;

  /** Close handler */
  onClose: () => void;

  /** Optional title (for fullscreen variant) */
  title?: string;

  /** Modal content */
  children: React.ReactNode;

  /** Disable backdrop dismiss */
  disableBackdropDismiss?: boolean;

  /** Custom container style */
  style?: ViewStyle;
}

/**
 * MD3 Modal Component
 */
export const Modal: React.FC<ModalProps> = ({
  visible,
  variant = 'dialog',
  onClose,
  title,
  children,
  disableBackdropDismiss = false,
  style,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Animate modal appearance
  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200, // MD3: 200ms fade in
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150, // MD3: 150ms fade out
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Handle hardware back button (Android)
  useEffect(() => {
    if (!visible) return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true; // Prevent default back behavior
    });

    return () => backHandler.remove();
  }, [visible, onClose]);

  // Handle backdrop press
  const handleBackdropPress = () => {
    if (!disableBackdropDismiss) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none" // Use custom animation
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.32], // MD3: 0.32 scrim opacity
            }),
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
      </Animated.View>

      <Animated.View
        style={[
          styles.container,
          variant === 'dialog' ? styles.dialogContainer : styles.fullscreenContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1], // Slight scale animation
                }),
              },
            ],
          },
          style,
        ]}
      >
        {variant === 'fullscreen' && title && (
          <View style={styles.fullscreenHeader}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel="Close modal"
              accessibilityRole="button"
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.fullscreenTitle}>{title}</Text>
            <View style={styles.closeButton} /> {/* Spacer for centering */}
          </View>
        )}

        <View style={variant === 'dialog' ? styles.dialogContent : styles.fullscreenContent}>
          {children}
        </View>
      </Animated.View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  // Backdrop
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: LightTheme.Scrim,
  },

  // Container
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Dialog Container
  dialogContainer: {
    margin: 24,
    maxWidth: 560, // MD3: Max width for dialog
    width: '100%',
  },

  // Dialog Content
  dialogContent: {
    ...getElevatedSurface(3, 'light'), // MD3: Elevation 3 for dialogs with tonal surface
    borderRadius: 28, // MD3: 28dp corner radius for dialogs
    padding: 24,
  },

  // Fullscreen Container
  fullscreenContainer: {
    width: '100%',
    height: '100%',
    margin: 0,
  },

  // Fullscreen Header
  fullscreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64, // MD3: 64dp app bar height
    paddingHorizontal: 16,
    backgroundColor: LightTheme.Surface,
    elevation: 2,
    shadowColor: LightTheme.Shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 24,
    color: LightTheme.OnSurface,
  },

  fullscreenTitle: {
    ...Typography.titleLarge, // MD3: 22px/28/400
    color: LightTheme.OnSurface,
    flex: 1,
    textAlign: 'center',
  },

  // Fullscreen Content
  fullscreenContent: {
    flex: 1,
    backgroundColor: LightTheme.Surface,
  },
});

export default Modal;

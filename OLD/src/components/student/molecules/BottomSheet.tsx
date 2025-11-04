/**
 * MD3 Bottom Sheet Component for Student Screens
 *
 * Material Design 3 compliant bottom sheet with drag handle
 *
 * Features:
 * - Slide-up animation
 * - Drag handle indicator
 * - Backdrop with 0.32 scrim opacity
 * - Hardware back button support
 * - Safe area handling for gesture bars
 *
 * Usage:
 * <BottomSheet
 *   visible={isVisible}
 *   onClose={handleClose}
 *   title="Select Option"
 * >
 *   <T>Bottom sheet content here</T>
 * </BottomSheet>
 */

import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Animated,
  BackHandler,
  Pressable,
  PanResponder,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { getElevatedSurface } from '../../../theme/elevation';

export interface BottomSheetProps {
  /** Bottom sheet visibility */
  visible: boolean;

  /** Close handler */
  onClose: () => void;

  /** Optional title */
  title?: string;

  /** Bottom sheet content */
  children: React.ReactNode;

  /** Disable backdrop dismiss */
  disableBackdropDismiss?: boolean;

  /** Disable drag to dismiss */
  disableDragDismiss?: boolean;

  /** Custom container style */
  style?: ViewStyle;
}

/**
 * MD3 Bottom Sheet Component
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  disableBackdropDismiss = false,
  disableDragDismiss = false,
  style,
}) => {
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Animate bottom sheet appearance
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 250, // MD3: 250ms slide up
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200, // MD3: 200ms slide down
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Handle hardware back button (Android)
  useEffect(() => {
    if (!visible) return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });

    return () => backHandler.remove();
  }, [visible, onClose]);

  // Pan responder for drag-to-dismiss
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disableDragDismiss,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        !disableDragDismiss && Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          // Only allow downward drag
          slideAnim.setValue(1 - gestureState.dy / 300);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // Dismiss if dragged down > 100px
          onClose();
        } else {
          // Snap back to open position
          Animated.spring(slideAnim, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Handle backdrop press
  const handleBackdropPress = () => {
    if (!disableBackdropDismiss) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
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

      {/* Bottom Sheet Container */}
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0], // Slide from bottom
                  }),
                },
              ],
            },
            style,
          ]}
          {...panResponder.panHandlers}
        >
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Title */}
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
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
    justifyContent: 'flex-end',
  },

  // Bottom Sheet
  sheet: {
    ...getElevatedSurface(1, 'light'), // MD3: Elevation 1 for bottom sheets with tonal surface
    borderTopLeftRadius: 28, // MD3: 28dp corner radius
    borderTopRightRadius: 28,
    maxHeight: '90%',
  },

  // Drag Handle
  dragHandle: {
    width: 32,
    height: 4,
    backgroundColor: LightTheme.OnSurfaceVariant,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
    opacity: 0.4,
  },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.OutlineVariant,
  },

  title: {
    ...Typography.titleLarge, // MD3: 22px/28/400
    color: LightTheme.OnSurface,
  },

  // Content
  content: {
    padding: 24,
    paddingBottom: 32, // Extra padding for gesture bar
  },
});

export default BottomSheet;

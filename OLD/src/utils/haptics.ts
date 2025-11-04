/**
 * Haptic Feedback Utility
 *
 * Provides cross-platform haptic feedback with Material Design 3 Expressive patterns.
 * Uses platform-specific APIs with graceful fallbacks.
 *
 * Patterns:
 * - selection: Light tap for selections, button presses
 * - success: Success confirmation feedback
 * - warning: Warning or caution feedback
 * - error: Error or failure feedback
 * - impact_light: Light impact (subtle interactions)
 * - impact_medium: Medium impact (primary actions)
 * - impact_heavy: Heavy impact (critical actions)
 *
 * @example
 * import { provideHapticFeedback } from '../utils/haptics';
 *
 * // On button press
 * provideHapticFeedback('selection');
 *
 * // On successful form submission
 * provideHapticFeedback('success');
 *
 * // On error
 * provideHapticFeedback('error');
 */

import { Platform, Vibration } from 'react-native';

// Haptic pattern types
export type HapticPattern =
  | 'selection'      // Light tap for selections
  | 'success'        // Success confirmation
  | 'warning'        // Warning or caution
  | 'error'          // Error or failure
  | 'impact_light'   // Light impact
  | 'impact_medium'  // Medium impact
  | 'impact_heavy';  // Heavy impact

// Vibration patterns (in milliseconds)
// Pattern: [vibrate, pause, vibrate, pause, ...]
const HAPTIC_PATTERNS: Record<HapticPattern, number[]> = {
  selection: [10],                    // Single short pulse
  success: [10, 50, 10],              // Double pulse (success rhythm)
  warning: [10, 50, 10, 50, 10],      // Triple pulse (caution rhythm)
  error: [50, 30, 50],                // Two longer pulses (error rhythm)
  impact_light: [5],                  // Very short pulse
  impact_medium: [15],                // Short pulse
  impact_heavy: [30],                 // Longer pulse
};

/**
 * Check if haptic feedback is available on this platform
 */
export const isHapticAvailable = (): boolean => {
  // Android always supports Vibration API
  if (Platform.OS === 'android') {
    return true;
  }

  // iOS supports haptic feedback on iPhone 6s and later
  // For now, we return true and rely on Expo Haptics if available
  if (Platform.OS === 'ios') {
    return true;
  }

  return false;
};

/**
 * Provide haptic feedback with the specified pattern
 *
 * @param pattern - The haptic pattern to trigger
 * @param options - Optional configuration
 */
export const provideHapticFeedback = (
  pattern: HapticPattern,
  options?: {
    /** Enable/disable haptic (useful for user preferences) */
    enabled?: boolean;
    /** Force vibration even on iOS (uses Vibration API instead of Haptics) */
    forceVibration?: boolean;
  }
): void => {
  const { enabled = true, forceVibration = false } = options || {};

  // Early return if disabled
  if (!enabled) {
    return;
  }

  // Early return if platform doesn't support haptics
  if (!isHapticAvailable()) {
    return;
  }

  try {
    // Android: Use Vibration API
    if (Platform.OS === 'android') {
      const vibrationPattern = HAPTIC_PATTERNS[pattern];
      if (vibrationPattern.length === 1) {
        // Single vibration
        Vibration.vibrate(vibrationPattern[0]);
      } else {
        // Pattern vibration
        Vibration.vibrate(vibrationPattern);
      }
      return;
    }

    // iOS: Try to use Expo Haptics if available, otherwise use Vibration API
    if (Platform.OS === 'ios') {
      // For now, use Vibration API as fallback
      // In production, check for Expo Haptics module and use it if available
      if (forceVibration) {
        const vibrationPattern = HAPTIC_PATTERNS[pattern];
        if (vibrationPattern.length === 1) {
          Vibration.vibrate(vibrationPattern[0]);
        } else {
          Vibration.vibrate(vibrationPattern);
        }
      }
      // TODO: Integrate Expo Haptics when available:
      // import * as Haptics from 'expo-haptics';
      // switch (pattern) {
      //   case 'selection':
      //     Haptics.selectionAsync();
      //     break;
      //   case 'success':
      //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      //     break;
      //   case 'warning':
      //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      //     break;
      //   case 'error':
      //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      //     break;
      //   case 'impact_light':
      //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      //     break;
      //   case 'impact_medium':
      //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      //     break;
      //   case 'impact_heavy':
      //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      //     break;
      // }
    }
  } catch (error) {
    // Gracefully handle any haptic errors
    console.warn('[Haptics] Failed to provide haptic feedback:', error);
  }
};

/**
 * Cancel any ongoing haptic feedback
 */
export const cancelHapticFeedback = (): void => {
  try {
    Vibration.cancel();
  } catch (error) {
    console.warn('[Haptics] Failed to cancel haptic feedback:', error);
  }
};

/**
 * Haptic feedback hook for React components
 *
 * @example
 * const haptic = useHapticFeedback();
 *
 * const handlePress = () => {
 *   haptic('selection');
 *   // ... handle press
 * };
 */
export const useHapticFeedback = (enabled: boolean = true) => {
  return (pattern: HapticPattern) => {
    provideHapticFeedback(pattern, { enabled });
  };
};

/**
 * Common haptic feedback helpers
 */
export const Haptics = {
  /** Light tap for UI element selection */
  selection: () => provideHapticFeedback('selection'),

  /** Success confirmation feedback */
  success: () => provideHapticFeedback('success'),

  /** Warning or caution feedback */
  warning: () => provideHapticFeedback('warning'),

  /** Error or failure feedback */
  error: () => provideHapticFeedback('error'),

  /** Light impact for subtle interactions */
  impactLight: () => provideHapticFeedback('impact_light'),

  /** Medium impact for primary actions */
  impactMedium: () => provideHapticFeedback('impact_medium'),

  /** Heavy impact for critical actions */
  impactHeavy: () => provideHapticFeedback('impact_heavy'),

  /** Cancel any ongoing haptic feedback */
  cancel: cancelHapticFeedback,
};

export default Haptics;

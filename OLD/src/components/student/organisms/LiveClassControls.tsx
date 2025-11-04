/**
 * LiveClassControls Component
 *
 * Control panel for live class interactions with mic, camera, raise hand, and leave buttons.
 *
 * Features:
 * - Mic toggle button (enabled/disabled state)
 * - Camera toggle button (enabled/disabled state)
 * - Raise hand button with pulse animation
 * - Leave class button with confirmation
 * - Recording indicator
 * - Connection quality indicator
 * - Haptic feedback on button press (device testing pending)
 * - Material Design 3 styling
 *
 * @example
 * <LiveClassControls
 *   micEnabled={true}
 *   cameraEnabled={false}
 *   handRaised={false}
 *   isRecording={true}
 *   connectionQuality="good"
 *   onMicToggle={() => console.log('Mic toggled')}
 *   onCameraToggle={() => console.log('Camera toggled')}
 *   onHandRaise={() => console.log('Hand raised')}
 *   onLeaveClass={() => console.log('Leave class')}
 * />
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Modal,
  Vibration,
  Platform,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';

// Connection Quality
export type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor';

// Component Props
interface LiveClassControlsProps {
  /** Is microphone enabled */
  micEnabled: boolean;

  /** Is camera enabled */
  cameraEnabled: boolean;

  /** Has user raised hand */
  handRaised: boolean;

  /** Is class being recorded */
  isRecording?: boolean;

  /** Connection quality */
  connectionQuality?: ConnectionQuality;

  /** Callback for mic toggle */
  onMicToggle: () => void;

  /** Callback for camera toggle */
  onCameraToggle: () => void;

  /** Callback for raise/lower hand */
  onHandRaise: () => void;

  /** Callback for leave class */
  onLeaveClass: () => void;
}

/**
 * Get connection quality color
 */
const getConnectionColor = (quality: ConnectionQuality): string => {
  switch (quality) {
    case 'excellent':
      return '#4CAF50'; // Green
    case 'good':
      return '#8BC34A'; // Light Green
    case 'fair':
      return '#FF9800'; // Orange
    case 'poor':
      return '#F44336'; // Red
    default:
      return LightTheme.OnSurfaceVariant;
  }
};

/**
 * Get connection quality label
 */
const getConnectionLabel = (quality: ConnectionQuality): string => {
  switch (quality) {
    case 'excellent':
      return 'Excellent';
    case 'good':
      return 'Good';
    case 'fair':
      return 'Fair';
    case 'poor':
      return 'Poor';
    default:
      return 'Unknown';
  }
};

/**
 * Icon Types for Control Buttons
 */
type IconType = 'mic-on' | 'mic-off' | 'camera-on' | 'camera-off' | 'hand' | 'leave';

/**
 * Control Button Component
 */
interface ControlButtonProps {
  iconType: IconType;
  label: string;
  active: boolean;
  onPress: () => void;
  variant?: 'primary' | 'danger';
  pulse?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  iconType,
  label,
  active,
  onPress,
  variant = 'primary',
  pulse = false,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Handle press with haptic feedback (Android only)
  const handlePress = () => {
    if (Platform.OS === 'android') {
      Vibration.vibrate(10); // Light haptic feedback (10ms)
    }
    onPress();
  };

  // Pulse animation for hand raise
  useEffect(() => {
    if (pulse && active) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [pulse, active, pulseAnim]);

  // Get icon color based on state
  const iconColor = active ? LightTheme.OnPrimary : LightTheme.OnSurfaceVariant;

  // Render appropriate icon
  const renderIcon = () => {
    switch (iconType) {
      case 'mic-on':
        return <MicIcon size={24} color={iconColor} on={true} />;
      case 'mic-off':
        return <MicIcon size={24} color={iconColor} on={false} />;
      case 'camera-on':
        return <CameraIcon size={24} color={iconColor} on={true} />;
      case 'camera-off':
        return <CameraIcon size={24} color={iconColor} on={false} />;
      case 'hand':
        return <HandIcon size={24} color={iconColor} />;
      case 'leave':
        return <LeaveIcon size={24} color={iconColor} />;
      default:
        return null;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.controlButton,
        pressed && styles.controlButtonPressed,
      ]}
      onPress={handlePress}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Animated.View
        style={[
          styles.controlButtonInner,
          active && variant === 'primary' && styles.controlButtonActive,
          active && variant === 'danger' && styles.controlButtonDanger,
          pulse && active && { transform: [{ scale: pulseAnim }] },
        ]}
      >
        {renderIcon()}
      </Animated.View>
      <Text style={styles.controlLabel}>{label}</Text>
    </Pressable>
  );
};

/**
 * Leave Confirmation Modal Component
 */
interface LeaveConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LeaveConfirmationModal: React.FC<LeaveConfirmationModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onCancel}
  >
    <View style={styles.modalBackdrop}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Leave Class?</Text>
        <Text style={styles.modalText}>
          Are you sure you want to leave this live class?
        </Text>

        <View style={styles.modalButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.modalButton,
              styles.modalButtonCancel,
              pressed && styles.modalButtonPressed,
            ]}
            onPress={onCancel}
          >
            <Text style={styles.modalButtonTextCancel}>Cancel</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.modalButton,
              styles.modalButtonConfirm,
              pressed && styles.modalButtonPressed,
            ]}
            onPress={onConfirm}
          >
            <Text style={styles.modalButtonTextConfirm}>Leave</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

/**
 * Recording Indicator Component
 */
const RecordingIndicator: React.FC = () => {
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [blinkAnim]);

  return (
    <View style={styles.recordingIndicator}>
      <Animated.View style={[styles.recordingDot, { opacity: blinkAnim }]} />
      <Text style={styles.recordingText}>REC</Text>
    </View>
  );
};

/**
 * Connection Quality Indicator Component
 */
interface ConnectionQualityIndicatorProps {
  quality: ConnectionQuality;
}

const ConnectionQualityIndicator: React.FC<
  ConnectionQualityIndicatorProps
> = ({ quality }) => {
  const color = getConnectionColor(quality);
  const label = getConnectionLabel(quality);

  // Signal strength bars
  const bars = [1, 2, 3];
  const activeBarCount =
    quality === 'excellent' ? 3 : quality === 'good' ? 2 : quality === 'fair' ? 1 : 0;

  return (
    <View style={styles.connectionIndicator}>
      <View style={styles.connectionBars}>
        {bars.map((bar) => (
          <View
            key={bar}
            style={[
              styles.connectionBar,
              { height: bar * 4 + 4 },
              bar <= activeBarCount && { backgroundColor: color },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.connectionText, { color }]}>{label}</Text>
    </View>
  );
};

/**
 * LiveClassControls Component
 */
const LiveClassControls: React.FC<LiveClassControlsProps> = ({
  micEnabled,
  cameraEnabled,
  handRaised,
  isRecording = false,
  connectionQuality = 'good',
  onMicToggle,
  onCameraToggle,
  onHandRaise,
  onLeaveClass,
}) => {
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const handleLeavePress = useCallback(() => {
    setShowLeaveModal(true);
  }, []);

  const handleLeaveConfirm = useCallback(() => {
    setShowLeaveModal(false);
    onLeaveClass();
  }, [onLeaveClass]);

  const handleLeaveCancel = useCallback(() => {
    setShowLeaveModal(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Bar with Indicators */}
      <View style={styles.topBar}>
        {/* Recording Indicator */}
        {isRecording && <RecordingIndicator />}

        {/* Connection Quality */}
        <ConnectionQualityIndicator quality={connectionQuality} />
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsRow}>
        {/* Mic Toggle */}
        <ControlButton
          iconType={micEnabled ? 'mic-on' : 'mic-off'}
          label={micEnabled ? 'Mic On' : 'Mic Off'}
          active={micEnabled}
          onPress={onMicToggle}
        />

        {/* Camera Toggle */}
        <ControlButton
          iconType={cameraEnabled ? 'camera-on' : 'camera-off'}
          label={cameraEnabled ? 'Camera On' : 'Camera Off'}
          active={cameraEnabled}
          onPress={onCameraToggle}
        />

        {/* Raise Hand */}
        <ControlButton
          iconType="hand"
          label={handRaised ? 'Lower Hand' : 'Raise Hand'}
          active={handRaised}
          onPress={onHandRaise}
          pulse={true}
        />

        {/* Leave Class */}
        <ControlButton
          iconType="leave"
          label="Leave"
          active={false}
          onPress={handleLeavePress}
          variant="danger"
        />
      </View>

      {/* Leave Confirmation Modal */}
      <LeaveConfirmationModal
        visible={showLeaveModal}
        onConfirm={handleLeaveConfirm}
        onCancel={handleLeaveCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: LightTheme.Surface,
    borderTopWidth: 1,
    borderTopColor: LightTheme.OutlineVariant,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
    marginRight: 6,
  },
  recordingText: {
    ...Typography.labelMedium, // MD3: 12px/16/500
    fontWeight: '700', // Override for emphasis
    color: '#F44336',
    letterSpacing: 0.5,
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 6,
  },
  connectionBar: {
    width: 4,
    backgroundColor: LightTheme.OutlineVariant,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  connectionText: {
    ...Typography.labelMedium, // MD3: 12px/16/500
    fontWeight: '600', // Override for emphasis
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
  },
  controlButtonPressed: {
    opacity: 0.88, // MD3: Slight opacity for pressed state (1 - 0.12 overlay)
  },
  controlButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: LightTheme.SurfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  controlButtonActive: {
    backgroundColor: LightTheme.Primary,
  },
  controlButtonDanger: {
    backgroundColor: LightTheme.Error,
  },
  controlIcon: {
    ...Typography.headlineSmall, // MD3: 24px (icon size)
  },
  controlIconActive: {
    ...Typography.headlineSmall, // MD3: 24px (icon size)
  },
  controlLabel: {
    ...Typography.labelMedium, // MD3: 12px/16/500
    fontWeight: '600', // Override for emphasis
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 24,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    ...Typography.titleLarge, // MD3: 22px (close to 20px)
    fontSize: 20, // Custom modal title size
    fontWeight: '700', // Override for emphasis
    color: LightTheme.OnSurface,
    marginBottom: 12,
  },
  modalText: {
    ...Typography.bodyLarge, // MD3: 16px/24/400
    color: LightTheme.OnSurfaceVariant,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginLeft: 12,
  },
  modalButtonPressed: {
    opacity: 0.88, // MD3: Slight opacity for pressed state (1 - 0.12 overlay)
  },
  modalButtonCancel: {
    backgroundColor: LightTheme.SurfaceVariant,
  },
  modalButtonConfirm: {
    backgroundColor: LightTheme.Error,
  },
  modalButtonTextCancel: {
    ...Typography.labelLarge, // MD3: 14px/20/500
    fontWeight: '600', // Override for emphasis
    color: LightTheme.OnSurface,
  },
  modalButtonTextConfirm: {
    ...Typography.labelLarge, // MD3: 14px/20/500
    fontWeight: '600', // Override for emphasis
    color: LightTheme.OnError,
  },
});

/**
 * Mic Icon Component
 * Simple microphone icon with on/off states
 */
interface MicIconProps {
  size: number;
  color: string;
  on: boolean;
}

const MicIcon: React.FC<MicIconProps> = ({ size, color, on }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    {/* Mic body (rounded rectangle) */}
    <View
      style={{
        width: size * 0.4,
        height: size * 0.5,
        borderRadius: size * 0.2,
        borderWidth: 2,
        borderColor: color,
        backgroundColor: on ? 'transparent' : color,
      }}
    />
    {/* Mic stand (bottom vertical line) */}
    <View
      style={{
        width: 2,
        height: size * 0.25,
        backgroundColor: color,
        marginTop: 2,
      }}
    />
    {/* Mic base (horizontal line) */}
    <View
      style={{
        width: size * 0.5,
        height: 2,
        backgroundColor: color,
      }}
    />
    {/* Slash for muted state */}
    {!on && (
      <View
        style={{
          position: 'absolute',
          width: size * 0.7,
          height: 2,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    )}
  </View>
);

/**
 * Camera Icon Component
 * Simple camera icon with on/off states
 */
interface CameraIconProps {
  size: number;
  color: string;
  on: boolean;
}

const CameraIcon: React.FC<CameraIconProps> = ({ size, color, on }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    {/* Camera body */}
    <View
      style={{
        width: size * 0.7,
        height: size * 0.5,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: color,
        backgroundColor: on ? 'transparent' : color,
      }}
    />
    {/* Lens */}
    <View
      style={{
        position: 'absolute',
        width: size * 0.25,
        height: size * 0.25,
        borderRadius: size * 0.125,
        borderWidth: 2,
        borderColor: color,
      }}
    />
    {/* Slash for off state */}
    {!on && (
      <View
        style={{
          position: 'absolute',
          width: size * 0.8,
          height: 2,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    )}
  </View>
);

/**
 * Hand Icon Component
 * Simple raised hand icon
 */
interface HandIconProps {
  size: number;
  color: string;
}

const HandIcon: React.FC<HandIconProps> = ({ size, color }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    {/* Palm */}
    <View
      style={{
        width: size * 0.5,
        height: size * 0.6,
        borderRadius: size * 0.15,
        backgroundColor: color,
      }}
    />
    {/* Fingers (3 rectangles at top) */}
    <View
      style={{
        position: 'absolute',
        top: size * 0.15,
        flexDirection: 'row',
        gap: 2,
      }}
    >
      <View style={{ width: size * 0.12, height: size * 0.3, borderRadius: size * 0.06, backgroundColor: color }} />
      <View style={{ width: size * 0.12, height: size * 0.35, borderRadius: size * 0.06, backgroundColor: color }} />
      <View style={{ width: size * 0.12, height: size * 0.3, borderRadius: size * 0.06, backgroundColor: color }} />
    </View>
  </View>
);

/**
 * Leave Icon Component
 * Simple door/exit icon
 */
interface LeaveIconProps {
  size: number;
  color: string;
}

const LeaveIcon: React.FC<LeaveIconProps> = ({ size, color }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    {/* Door frame */}
    <View
      style={{
        width: size * 0.6,
        height: size * 0.7,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: color,
      }}
    />
    {/* Door handle */}
    <View
      style={{
        position: 'absolute',
        right: size * 0.3,
        width: size * 0.1,
        height: size * 0.1,
        borderRadius: size * 0.05,
        backgroundColor: color,
      }}
    />
    {/* Exit arrow */}
    <View
      style={{
        position: 'absolute',
        left: size * 0.1,
        width: size * 0.25,
        height: 2,
        backgroundColor: color,
      }}
    />
    <View
      style={{
        position: 'absolute',
        left: size * 0.1,
        top: size * 0.4,
        width: size * 0.12,
        height: 2,
        backgroundColor: color,
        transform: [{ rotate: '-45deg' }],
      }}
    />
    <View
      style={{
        position: 'absolute',
        left: size * 0.1,
        top: size * 0.55,
        width: size * 0.12,
        height: 2,
        backgroundColor: color,
        transform: [{ rotate: '45deg' }],
      }}
    />
  </View>
);

export default LiveClassControls;

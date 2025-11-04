/**
 * MD3 ProgressStepper Component
 *
 * Material Design 3 multi-step progress indicator with animations.
 *
 * Features:
 * - Horizontal and vertical orientations
 * - Completed, active, and upcoming step states
 * - Step labels and descriptions
 * - Connecting lines with progress fill
 * - Spring animations on step transitions
 * - Haptic feedback on step completion
 * - Optional step numbers or custom icons
 *
 * ✅ M3E: Spring animations on step activation
 * ✅ M3E: Haptic feedback on step completion
 * ✅ M3E: Smooth progress line animations
 *
 * Usage:
 * <ProgressStepper
 *   steps={[
 *     { id: '1', label: 'Account', description: 'Create your account' },
 *     { id: '2', label: 'Profile', description: 'Complete your profile' },
 *     { id: '3', label: 'Done', description: 'All set!' }
 *   ]}
 *   currentStep={1}
 *   onStepPress={(index) => setStep(index)}
 * />
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { provideHapticFeedback } from '../../../utils/haptics';

// Step definition
export interface ProgressStep {
  /** Unique identifier */
  id: string;

  /** Step label */
  label: string;

  /** Optional description */
  description?: string;

  /** Custom icon (overrides default number/checkmark) */
  icon?: React.ReactNode;

  /** Disable this step */
  disabled?: boolean;
}

// ProgressStepper Props
export interface ProgressStepperProps {
  /** Array of steps */
  steps: ProgressStep[];

  /** Current active step index (0-based) */
  currentStep: number;

  /** Callback when step is pressed */
  onStepPress?: (stepIndex: number) => void;

  /** Orientation */
  orientation?: 'horizontal' | 'vertical';

  /** Allow clicking on completed steps to navigate back */
  allowStepNavigation?: boolean;

  /** Custom style */
  style?: ViewStyle;
}

/**
 * MD3 ProgressStepper Component
 */
export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  currentStep,
  onStepPress,
  orientation = 'horizontal',
  allowStepNavigation = false,
  style,
}) => {
  // Previous step to detect changes
  const previousStep = useRef(currentStep);

  // M3E: Trigger haptic feedback when step completes
  useEffect(() => {
    if (currentStep > previousStep.current) {
      provideHapticFeedback('success');
    }
    previousStep.current = currentStep;
  }, [currentStep]);

  // Render steps
  const renderSteps = () => {
    return steps.map((step, index) => {
      const isCompleted = index < currentStep;
      const isActive = index === currentStep;
      const isUpcoming = index > currentStep;
      const isLast = index === steps.length - 1;

      return (
        <React.Fragment key={step.id}>
          <StepItem
            step={step}
            stepIndex={index}
            isCompleted={isCompleted}
            isActive={isActive}
            isUpcoming={isUpcoming}
            onPress={
              allowStepNavigation && (isCompleted || isActive)
                ? () => onStepPress?.(index)
                : undefined
            }
            orientation={orientation}
          />
          {!isLast && (
            <StepConnector
              isCompleted={isCompleted}
              orientation={orientation}
            />
          )}
        </React.Fragment>
      );
    });
  };

  // Wrap horizontal stepper in ScrollView to prevent overflow
  if (orientation === 'horizontal') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, style]}
        style={styles.scrollContainer}
      >
        <View style={styles.container}>
          {renderSteps()}
        </View>
      </ScrollView>
    );
  }

  // Vertical stepper doesn't need ScrollView wrapper
  return (
    <View
      style={[
        styles.container,
        styles.containerVertical,
        style,
      ]}
    >
      {renderSteps()}
    </View>
  );
};

// Individual Step Item Component
interface StepItemProps {
  step: ProgressStep;
  stepIndex: number;
  isCompleted: boolean;
  isActive: boolean;
  isUpcoming: boolean;
  onPress?: () => void;
  orientation: 'horizontal' | 'vertical';
}

const StepItem: React.FC<StepItemProps> = ({
  step,
  stepIndex,
  isCompleted,
  isActive,
  isUpcoming,
  onPress,
  orientation,
}) => {
  // M3E: Spring animation for step circle
  const scaleValue = useRef(new Animated.Value(1)).current;

  // Animate in when step becomes active
  useEffect(() => {
    if (isActive) {
      Animated.spring(scaleValue, {
        toValue: 1.1,
        useNativeDriver: true,
        friction: 5,
        tension: 100,
      }).start(() => {
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          friction: 3,
          tension: 40,
        }).start();
      });
    }
  }, [isActive, scaleValue]);

  // M3E: Press handlers
  const handlePressIn = () => {
    if (!onPress || step.disabled) return;
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
      friction: 5,
      tension: 300,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress || step.disabled) return;
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
    provideHapticFeedback('selection');
  };

  // Determine step circle style
  let circleStyle: ViewStyle = {};
  let textColor: string = LightTheme.OnSurfaceVariant;
  let labelColor: string = LightTheme.OnSurfaceVariant;

  if (isCompleted) {
    circleStyle = {
      backgroundColor: LightTheme.Primary,
      borderWidth: 0,
    };
    textColor = LightTheme.OnPrimary;
    labelColor = LightTheme.OnSurface;
  } else if (isActive) {
    circleStyle = {
      backgroundColor: LightTheme.PrimaryContainer,
      borderWidth: 2,
      borderColor: LightTheme.Primary,
    };
    textColor = LightTheme.OnPrimaryContainer;
    labelColor = LightTheme.Primary;
  } else {
    circleStyle = {
      backgroundColor: LightTheme.SurfaceVariant,
      borderWidth: 2,
      borderColor: LightTheme.Outline,
    };
    textColor = LightTheme.OnSurfaceVariant;
    labelColor = LightTheme.OnSurfaceVariant;
  }

  const disabled = step.disabled || (!onPress && !isActive);

  const StepContent = (
    <Animated.View
      style={[
        styles.stepItem,
        orientation === 'vertical' && styles.stepItemVertical,
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      {/* Step Circle */}
      <View style={[styles.stepCircle, circleStyle]}>
        {step.icon ? (
          <View style={styles.stepIcon}>{step.icon}</View>
        ) : isCompleted ? (
          <Text style={[styles.stepCheckmark, { color: textColor }]}>✓</Text>
        ) : (
          <Text style={[styles.stepNumber, { color: textColor }]}>
            {stepIndex + 1}
          </Text>
        )}
      </View>

      {/* Step Label */}
      <View style={styles.stepTextContainer}>
        <Text
          style={[
            styles.stepLabel,
            { color: labelColor },
            isActive && styles.stepLabelActive,
          ]}
        >
          {step.label}
        </Text>
        {step.description && (
          <Text style={styles.stepDescription}>{step.description}</Text>
        )}
      </View>
    </Animated.View>
  );

  // If pressable, wrap in Pressable
  if (onPress && !disabled) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`Step ${stepIndex + 1}: ${step.label}`}
        accessibilityState={{ disabled, selected: isActive }}
      >
        {StepContent}
      </Pressable>
    );
  }

  return StepContent;
};

// Step Connector Line Component
interface StepConnectorProps {
  isCompleted: boolean;
  orientation: 'horizontal' | 'vertical';
}

const StepConnector: React.FC<StepConnectorProps> = ({
  isCompleted,
  orientation,
}) => {
  // M3E: Animate progress line fill
  const progressValue = useRef(new Animated.Value(isCompleted ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: isCompleted ? 1 : 0,
      duration: 300,
      useNativeDriver: false, // Cannot use native driver for width/height
    }).start();
  }, [isCompleted, progressValue]);

  const progressInterpolation = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (orientation === 'vertical') {
    return (
      <View style={styles.connectorVertical}>
        <View style={styles.connectorLineVertical}>
          <Animated.View
            style={[
              styles.connectorProgressVertical,
              { height: progressInterpolation },
            ]}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.connector}>
      <View style={styles.connectorLine}>
        <Animated.View
          style={[
            styles.connectorProgress,
            { width: progressInterpolation },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 8, // Add padding so steps don't touch edges
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  containerVertical: {
    flexDirection: 'column',
  },
  stepItem: {
    alignItems: 'center',
    gap: 8,
  },
  stepItemVertical: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIcon: {
    width: 24,
    height: 24,
  },
  stepNumber: {
    ...Typography.labelLarge,
    fontWeight: '600',
  },
  stepCheckmark: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  stepTextContainer: {
    alignItems: 'center',
    maxWidth: 90, // Reduced width to fit more steps on screen
  },
  stepLabel: {
    ...Typography.labelMedium,
    textAlign: 'center',
  },
  stepLabelActive: {
    ...Typography.labelLarge,
    fontWeight: '600',
  },
  stepDescription: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
    marginTop: 2,
  },
  connector: {
    width: 60, // Fixed width for horizontal connector
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  connectorLine: {
    height: 2,
    backgroundColor: LightTheme.OutlineVariant,
    position: 'relative',
    overflow: 'hidden',
  },
  connectorProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: LightTheme.Primary,
  },
  connectorVertical: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectorLineVertical: {
    width: 2,
    height: '100%',
    backgroundColor: LightTheme.OutlineVariant,
    position: 'relative',
    overflow: 'hidden',
  },
  connectorProgressVertical: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    backgroundColor: LightTheme.Primary,
  },
});

export default ProgressStepper;

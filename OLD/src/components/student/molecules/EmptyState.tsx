/**
 * MD3 EmptyState Component for Student Screens
 *
 * Material Design 3 compliant empty state with illustration and action
 *
 * Variants:
 * - no-data: No data available
 * - no-results: Search/filter returned no results
 * - error: An error occurred
 * - offline: No internet connection
 *
 * Features:
 * - Illustration/icon support (120dp)
 * - Title text (Title Medium, 16sp)
 * - Description text (Body Medium, 14sp)
 * - Optional action button
 * - Custom illustration support
 *
 * Usage:
 * <EmptyState
 *   variant="no-data"
 *   title="No Assignments"
 *   description="You don't have any assignments yet."
 *   actionLabel="Refresh"
 *   onAction={handleRefresh}
 * />
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { Button } from '../atoms/Button';

// Empty State Variant
type EmptyStateVariant = 'no-data' | 'no-results' | 'error' | 'offline';

export interface EmptyStateProps {
  /** Empty state variant */
  variant?: EmptyStateVariant;

  /** Title text */
  title: string;

  /** Description text */
  description?: string;

  /** Custom illustration element */
  illustration?: React.ReactNode;

  /** Action button label */
  actionLabel?: string;

  /** Action button handler */
  onAction?: () => void;

  /** Custom container style */
  style?: ViewStyle;
}

/**
 * MD3 EmptyState Component
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'no-data',
  title,
  description,
  illustration,
  actionLabel,
  onAction,
  style,
}) => {
  // Get default illustration if none provided
  const defaultIllustration = illustration || getDefaultIllustration(variant);

  return (
    <View style={[styles.container, style]}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>{defaultIllustration}</View>

      {/* Title */}
      <View style={styles.title}>
        <Text style={styles.titleText}>{title}</Text>
      </View>

      {/* Description */}
      {description && (
        <View style={styles.description}>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      )}

      {/* Action Button */}
      {actionLabel && onAction && (
        <View style={styles.action}>
          <Button variant="filled" onPress={onAction}>
            {actionLabel}
          </Button>
        </View>
      )}
    </View>
  );
};

/**
 * Get default illustration based on variant
 */
const getDefaultIllustration = (variant: EmptyStateVariant): React.ReactNode => {
  const color = LightTheme.OnSurfaceVariant;
  const size = 120;

  switch (variant) {
    case 'no-data':
      return <NoDataIcon size={size} color={color} />;
    case 'no-results':
      return <NoResultsIcon size={size} color={color} />;
    case 'error':
      return <ErrorIcon size={size} color={color} />;
    case 'offline':
      return <OfflineIcon size={size} color={color} />;
    default:
      return <NoDataIcon size={size} color={color} />;
  }
};

/**
 * No Data Icon (120dp)
 */
const NoDataIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View style={[styles.icon, { width: size, height: size }]}>
    <View
      style={[
        styles.iconCircle,
        {
          width: size * 0.6,
          height: size * 0.6,
          borderRadius: size * 0.3,
          borderColor: color,
          borderWidth: 3,
        },
      ]}
    />
    <View
      style={[
        styles.iconLine,
        {
          width: size * 0.3,
          height: 3,
          backgroundColor: color,
          bottom: size * 0.2,
        },
      ]}
    />
  </View>
);

/**
 * No Results Icon (120dp)
 */
const NoResultsIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View style={[styles.icon, { width: size, height: size }]}>
    {/* Magnifying glass */}
    <View
      style={[
        styles.iconCircle,
        {
          width: size * 0.5,
          height: size * 0.5,
          borderRadius: size * 0.25,
          borderColor: color,
          borderWidth: 3,
          top: size * 0.1,
          left: size * 0.15,
        },
      ]}
    />
    <View
      style={[
        styles.iconLine,
        {
          width: size * 0.3,
          height: 3,
          backgroundColor: color,
          bottom: size * 0.15,
          right: size * 0.15,
          transform: [{ rotate: '45deg' }],
        },
      ]}
    />
    {/* X mark */}
    <View
      style={[
        styles.iconLine,
        {
          width: size * 0.2,
          height: 3,
          backgroundColor: color,
          top: size * 0.4,
          left: size * 0.3,
          transform: [{ rotate: '45deg' }],
        },
      ]}
    />
    <View
      style={[
        styles.iconLine,
        {
          width: size * 0.2,
          height: 3,
          backgroundColor: color,
          top: size * 0.4,
          left: size * 0.3,
          transform: [{ rotate: '-45deg' }],
        },
      ]}
    />
  </View>
);

/**
 * Error Icon (120dp)
 */
const ErrorIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View style={[styles.icon, { width: size, height: size }]}>
    {/* Triangle */}
    <View
      style={[
        styles.iconTriangle,
        {
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.4,
          borderRightWidth: size * 0.4,
          borderBottomWidth: size * 0.7,
          borderStyle: 'solid',
          backgroundColor: 'transparent',
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        },
      ]}
    />
    {/* Exclamation mark */}
    <View
      style={[
        styles.iconLine,
        {
          width: 3,
          height: size * 0.35,
          backgroundColor: LightTheme.Surface,
          bottom: size * 0.4,
        },
      ]}
    />
    <View
      style={[
        styles.iconDot,
        {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: LightTheme.Surface,
          bottom: size * 0.15,
        },
      ]}
    />
  </View>
);

/**
 * Offline Icon (120dp)
 */
const OfflineIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View style={[styles.icon, { width: size, height: size }]}>
    {/* WiFi arcs */}
    <View
      style={[
        styles.iconArc,
        {
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: size * 0.35,
          borderColor: color,
          borderWidth: 3,
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          top: size * 0.2,
        },
      ]}
    />
    <View
      style={[
        styles.iconArc,
        {
          width: size * 0.5,
          height: size * 0.5,
          borderRadius: size * 0.25,
          borderColor: color,
          borderWidth: 3,
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          top: size * 0.3,
        },
      ]}
    />
    {/* Slash */}
    <View
      style={[
        styles.iconLine,
        {
          width: size * 0.8,
          height: 4,
          backgroundColor: color,
          transform: [{ rotate: '-45deg' }],
        },
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  // Container
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },

  // Illustration
  illustrationContainer: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },

  // Title
  title: {
    marginBottom: 8,
  },

  titleText: {
    ...Typography.titleMedium, // MD3: 16px/24/500
    color: LightTheme.OnSurface,
    textAlign: 'center',
  },

  // Description
  description: {
    marginBottom: 24,
  },

  descriptionText: {
    ...Typography.bodyMedium, // MD3: 14px/20/400
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
  },

  // Action
  action: {
    marginTop: 8,
  },

  // Icon Elements
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },

  iconCircle: {
    position: 'absolute',
  },

  iconLine: {
    position: 'absolute',
  },

  iconDot: {
    position: 'absolute',
  },

  iconTriangle: {
    position: 'absolute',
  },

  iconArc: {
    position: 'absolute',
  },
});

export default EmptyState;

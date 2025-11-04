/**
 * MD3 Card Component for Student Screens
 *
 * Material Design 3 compliant card with 3 variants:
 * - elevated: Default, with 1dp elevation
 * - filled: Surface variant background, no elevation
 * - outlined: Outlined with border, no elevation
 *
 * Features:
 * - CardHeader with optional icon and image
 * - CardContent for main content
 * - CardActions for action buttons
 * - Pressable with state layers (0.12 pressed)
 * - 12dp corner radius (MD3 spec)
 *
 * ✅ FIXED: Proper MD3 state layer (0.12 opacity overlay on press)
 *
 * Usage:
 * <Card variant="elevated" onPress={handlePress}>
 *   <CardHeader title="Title" subtitle="Subtitle" image={imageUri} />
 *   <CardContent>
 *     <Text>Card content here</Text>
 *   </CardContent>
 *   <CardActions>
 *     <Button variant="text">Action</Button>
 *   </CardActions>
 * </Card>
 */

import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Image,
  ImageSourcePropType,
  Text,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { getElevatedSurface } from '../../../theme/elevation';
import { Typography } from '../../../theme/typography';

// MD3 Card Variants
type CardVariant = 'elevated' | 'filled' | 'outlined';

export interface CardProps {
  /** Card variant following MD3 specifications */
  variant?: CardVariant;

  /** Card content */
  children: React.ReactNode;

  /** Press handler (makes card pressable) */
  onPress?: () => void;

  /** Disable press interaction */
  disabled?: boolean;

  /** Custom card style */
  style?: ViewStyle;

  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * MD3 Card Component
 */
export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  children,
  onPress,
  disabled = false,
  style,
  accessibilityLabel,
}) => {
  // Get variant-specific styles
  const getCardStyle = (pressed: boolean): ViewStyle[] => {
    const base = styles.card;
    const variantStyles: ViewStyle[] = [];

    switch (variant) {
      case 'elevated':
        // MD3: Elevation 1 by default, elevation 2 when pressed
        // Uses tonal surface tinting + shadow
        const elevationLevel = pressed && !disabled ? 2 : 1;
        variantStyles.push(getElevatedSurface(elevationLevel, 'light'));
        break;

      case 'filled':
        variantStyles.push(styles.cardFilled);
        break;

      case 'outlined':
        variantStyles.push(styles.cardOutlined);
        break;
    }

    return [base, ...variantStyles, style].filter(Boolean) as ViewStyle[];
  };

  // Render pressable card
  if (onPress && !disabled) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        style={({ pressed }) => getCardStyle(pressed)}
      >
        {({ pressed }) => (
          <View style={{ position: 'relative' }}>
            {/* FIXED: MD3 State Layer - 0.12 opacity overlay on press */}
            {pressed && !disabled && (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: LightTheme.OnSurface,
                  opacity: 0.12, // MD3: 0.12 state layer
                  borderRadius: 12,
                  zIndex: 1,
                }}
                pointerEvents="none"
              />
            )}
            {children}
          </View>
        )}
      </Pressable>
    );
  }

  // Render static card
  return <View style={getCardStyle(false)}>{children}</View>;
};

// Card Header (optional)
export interface CardHeaderProps {
  /** Header title */
  title: string;

  /** Header subtitle (optional) */
  subtitle?: string;

  /** Header icon (React element) */
  icon?: React.ReactNode;

  /** Header image (URI or require source) */
  image?: string | ImageSourcePropType;

  /** Trailing element (e.g., badge, icon button) */
  trailing?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  image,
  trailing,
}) => {
  return (
    <View style={styles.header}>
      {/* Icon or Image */}
      {image && (
        <Image
          source={typeof image === 'string' ? { uri: image } : image}
          style={styles.headerImage}
          resizeMode="cover"
        />
      )}
      {icon && !image && <View style={styles.headerIcon}>{icon}</View>}

      {/* Title and Subtitle */}
      <View style={styles.headerText}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>

      {/* Trailing Element */}
      {trailing && <View style={styles.headerTrailing}>{trailing}</View>}
    </View>
  );
};

// Card Content (optional wrapper)
export interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.content, style]}>{children}</View>;
};

// Card Actions (optional)
export interface CardActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'right' | 'space-between';
  style?: ViewStyle;
}

export const CardActions: React.FC<CardActionsProps> = ({
  children,
  align = 'right',
  style,
}) => {
  const alignmentStyle: ViewStyle =
    align === 'left'
      ? { justifyContent: 'flex-start' }
      : align === 'right'
      ? { justifyContent: 'flex-end' }
      : { justifyContent: 'space-between' };

  return (
    <View style={[styles.actions, alignmentStyle, style]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  // Base Card
  card: {
    borderRadius: 12, // MD3: 12dp corner radius
    overflow: 'hidden',
  },

  // Filled Card
  cardFilled: {
    backgroundColor: LightTheme.SurfaceVariant,
    elevation: 0,
  },

  // Outlined Card
  cardOutlined: {
    backgroundColor: LightTheme.Surface,
    borderWidth: 1,
    borderColor: LightTheme.Outline,
    elevation: 0,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16, // MD3: 16dp padding
    gap: 12, // MD3: 12dp gap
  },

  // Header Icon (24dp)
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header Image (48dp x 48dp)
  headerImage: {
    width: 48,
    height: 48,
    borderRadius: 8, // Rounded corners for image
  },

  // Header Text
  headerText: {
    flex: 1,
  },

  headerTitle: {
    ...Typography.titleMedium, // MD3: 16px/24/500
    color: LightTheme.OnSurface,
  } as TextStyle,

  headerSubtitle: {
    ...Typography.bodyMedium, // MD3: 14px/20/400
    color: LightTheme.OnSurfaceVariant,
    marginTop: 2,
  } as TextStyle,

  // Header Trailing
  headerTrailing: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content
  content: {
    padding: 16, // MD3: 16dp padding
  },

  // Actions
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8, // MD3: 8dp padding
    gap: 8, // MD3: 8dp gap between buttons
  },
});

export default Card;

/**
 * EventCard Component - Premium Minimal Design
 *
 * Displays class/event information in a compact, accessible format.
 * Wraps the existing Card component with event-specific styling.
 *
 * Features:
 * - Status indicator (live/upcoming/ended)
 * - Time display with relative formatting
 * - Subject badge
 * - Compact layout (follows Premium Minimal design)
 * - 48dp touch target (WCAG 2.1 AAA)
 * - Full accessibility labels
 *
 * Usage:
 * <EventCard
 *   title="Mathematics 101"
 *   subject="Math"
 *   time={new Date()}
 *   status="live"
 *   onPress={() => navigation.navigate('ClassDetail', { classId })}
 * />
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Card, CardContent } from '../atoms/Card';
import StatusBadge from '../../core/StatusBadge';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { Spacing } from '../../../theme/spacing';
import { formatDistanceToNow, format } from 'date-fns';

export interface EventCardProps {
  /** Event title (class name) */
  title: string;

  /** Subject name */
  subject: string;

  /** Event start time */
  time: Date;

  /** Event duration in minutes (optional) */
  duration?: number;

  /** Event status */
  status: 'live' | 'upcoming' | 'ended';

  /** Press handler */
  onPress: () => void;

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Custom style */
  style?: ViewStyle;

  /** Show join button for live events */
  showJoinButton?: boolean;
}

/**
 * EventCard Component
 */
export const EventCard: React.FC<EventCardProps> = ({
  title,
  subject,
  time,
  duration,
  status,
  onPress,
  accessibilityLabel,
  style,
  showJoinButton = false,
}) => {
  // Get status badge configuration
  const getStatusConfig = () => {
    switch (status) {
      case 'live':
        return {
          type: 'error' as const,
          label: 'LIVE NOW',
          color: LightTheme.Error,
          icon: '🔴',
        };
      case 'upcoming':
        return {
          type: 'info' as const,
          label: 'UPCOMING',
          color: LightTheme.Primary,
          icon: '🔵',
        };
      case 'ended':
        return {
          type: 'neutral' as const,
          label: 'ENDED',
          color: LightTheme.OnSurfaceVariant,
          icon: '⚪',
        };
    }
  };

  const statusConfig = getStatusConfig();

  // Format time based on status
  const formatTime = () => {
    if (status === 'live') {
      return 'In progress';
    } else if (status === 'upcoming') {
      const distance = formatDistanceToNow(time, { addSuffix: true });
      return distance;
    } else {
      return format(time, 'h:mm a');
    }
  };

  // Build accessibility label
  const fullAccessibilityLabel =
    accessibilityLabel ||
    `${title}, ${subject}, ${statusConfig.label}, ${formatTime()}${
      duration ? `, ${duration} minutes` : ''
    }`;

  return (
    <Card
      variant="elevated"
      onPress={onPress}
      style={[styles.card, style]}
      accessibilityLabel={fullAccessibilityLabel}
    >
      <CardContent style={styles.content}>
        {/* Status Badge */}
        <View style={styles.statusRow}>
          <StatusBadge
            text={statusConfig.label}
            type={statusConfig.type}
            size="small"
          />
        </View>

        {/* Event Info */}
        <View style={styles.infoRow}>
          {/* Title and Subject */}
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {subject} {duration ? `· ${duration} min` : ''}
            </Text>
          </View>
        </View>

        {/* Time */}
        <View style={styles.timeRow}>
          <Text
            style={[
              styles.time,
              status === 'live' && styles.timeLive,
            ]}
          >
            {formatTime()}
          </Text>
        </View>

        {/* Optional Join Button for Live Events */}
        {showJoinButton && status === 'live' && (
          <View style={styles.actionRow}>
            <View style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join Class</Text>
            </View>
          </View>
        )}
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 280, // Fixed width for horizontal carousel
    marginRight: Spacing.MD,
  },

  content: {
    padding: Spacing.MD,
    gap: Spacing.SM,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.SM,
  },

  textContainer: {
    flex: 1,
    gap: Spacing.XS / 2,
  },

  title: {
    ...Typography.titleMedium, // 16px/24/500
    color: LightTheme.OnSurface,
  } as TextStyle,

  subtitle: {
    ...Typography.bodyMedium, // 14px/20/400
    color: LightTheme.OnSurfaceVariant,
  } as TextStyle,

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  time: {
    ...Typography.labelLarge, // 14px/20/500
    color: LightTheme.OnSurfaceVariant,
  } as TextStyle,

  timeLive: {
    color: LightTheme.Error,
    fontWeight: '600',
  } as TextStyle,

  actionRow: {
    marginTop: Spacing.XS,
  },

  joinButton: {
    backgroundColor: LightTheme.PrimaryContainer,
    paddingVertical: Spacing.SM,
    paddingHorizontal: Spacing.MD,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48, // WCAG 2.1 AAA touch target
  },

  joinButtonText: {
    ...Typography.labelLarge,
    color: LightTheme.OnPrimaryContainer,
    fontWeight: '600',
  } as TextStyle,
});

export default EventCard;

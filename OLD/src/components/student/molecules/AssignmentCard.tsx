/**
 * AssignmentCard Component - Premium Minimal Design
 *
 * Displays assignment information in a compact, accessible format.
 * Wraps the existing Card component with assignment-specific styling.
 *
 * Features:
 * - Status indicator (pending/submitted/graded/overdue)
 * - Due date with color coding
 * - Subject badge
 * - Grade display (if graded)
 * - Compact layout (follows Premium Minimal design)
 * - 48dp touch target (WCAG 2.1 AAA)
 * - Full accessibility labels
 *
 * Usage:
 * <AssignmentCard
 *   title="Calculus Problem Set"
 *   subject="Math"
 *   dueDate={new Date()}
 *   status="pending"
 *   onPress={() => navigation.navigate('AssignmentDetail', { assignmentId })}
 * />
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Card, CardContent } from '../atoms/Card';
import StatusBadge from '../../core/StatusBadge';
import { LightTheme, SemanticColors } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { Spacing } from '../../../theme/spacing';
import { formatDistanceToNow, format, isPast, isToday, isTomorrow } from 'date-fns';

export interface AssignmentCardProps {
  /** Assignment title */
  title: string;

  /** Subject name */
  subject: string;

  /** Due date */
  dueDate: Date;

  /** Assignment status */
  status: 'pending' | 'submitted' | 'graded' | 'overdue';

  /** Grade (if graded) */
  grade?: number;

  /** Maximum grade */
  maxGrade?: number;

  /** Press handler */
  onPress: () => void;

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Custom style */
  style?: ViewStyle;

  /** Show compact variant (for lists) */
  compact?: boolean;
}

/**
 * AssignmentCard Component
 */
export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  title,
  subject,
  dueDate,
  status,
  grade,
  maxGrade = 100,
  onPress,
  accessibilityLabel,
  style,
  compact = false,
}) => {
  // Get status badge configuration
  const getStatusConfig = () => {
    switch (status) {
      case 'submitted':
        return {
          type: 'success' as const,
          label: 'Submitted',
        };
      case 'graded':
        return {
          type: 'primary' as const,
          label: 'Graded',
        };
      case 'overdue':
        return {
          type: 'error' as const,
          label: 'Overdue',
        };
      case 'pending':
      default:
        return {
          type: 'warning' as const,
          label: 'Pending',
        };
    }
  };

  const statusConfig = getStatusConfig();

  // Format due date with urgency indication
  const formatDueDate = () => {
    if (status === 'overdue') {
      return `Overdue`;
    }

    if (isToday(dueDate)) {
      return `Due today ${format(dueDate, 'h:mm a')}`;
    }

    if (isTomorrow(dueDate)) {
      return `Due tomorrow`;
    }

    const distance = formatDistanceToNow(dueDate, { addSuffix: true });
    return `Due ${distance}`;
  };

  // Get due date text color based on urgency
  const getDueDateColor = () => {
    if (status === 'overdue') {
      return SemanticColors.Error;
    }

    if (isToday(dueDate) || isTomorrow(dueDate)) {
      return SemanticColors.Warning;
    }

    return LightTheme.OnSurfaceVariant;
  };

  // Get due date icon
  const getDueDateIcon = () => {
    if (status === 'overdue') {
      return '🔴';
    }

    if (isToday(dueDate)) {
      return '🔴';
    }

    if (isTomorrow(dueDate)) {
      return '🟡';
    }

    return '🟢';
  };

  // Build accessibility label
  const fullAccessibilityLabel =
    accessibilityLabel ||
    `${title}, ${subject}, ${statusConfig.label}, ${formatDueDate()}${
      status === 'graded' && grade !== undefined
        ? `, Grade: ${grade} out of ${maxGrade}`
        : ''
    }`;

  return (
    <Card
      variant="elevated"
      onPress={onPress}
      style={[compact ? styles.cardCompact : styles.card, style]}
      accessibilityLabel={fullAccessibilityLabel}
    >
      <CardContent style={compact ? styles.contentCompact : styles.content}>
        {/* Title and Subject */}
        <View style={styles.headerRow}>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={compact ? 1 : 2}>
              {title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {subject}
            </Text>
          </View>

          {/* Status Badge (top-right) */}
          {!compact && (
            <StatusBadge
              text={statusConfig.label}
              type={statusConfig.type}
              size="small"
            />
          )}
        </View>

        {/* Due Date Row */}
        <View style={styles.dueDateRow}>
          <Text style={styles.dueDateIcon}>{getDueDateIcon()}</Text>
          <Text
            style={[
              styles.dueDate,
              { color: getDueDateColor() },
            ]}
          >
            {formatDueDate()}
          </Text>
        </View>

        {/* Grade Row (if graded) */}
        {status === 'graded' && grade !== undefined && (
          <View style={styles.gradeRow}>
            <View style={styles.gradeContainer}>
              <Text style={styles.gradeLabel}>Grade:</Text>
              <Text style={styles.gradeValue}>
                {grade}/{maxGrade}
              </Text>
              <Text style={styles.gradePercentage}>
                ({Math.round((grade / maxGrade) * 100)}%)
              </Text>
            </View>
          </View>
        )}

        {/* Status Badge (for compact variant) */}
        {compact && (
          <View style={styles.compactStatusRow}>
            <StatusBadge
              text={statusConfig.label}
              type={statusConfig.type}
              size="small"
            />
          </View>
        )}
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.MD,
  },

  cardCompact: {
    marginBottom: Spacing.SM,
  },

  content: {
    padding: Spacing.MD,
    gap: Spacing.SM,
  },

  contentCompact: {
    padding: Spacing.SM,
    gap: Spacing.XS,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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

  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.XS,
  },

  dueDateIcon: {
    fontSize: 12,
  },

  dueDate: {
    ...Typography.labelLarge, // 14px/20/500
    fontWeight: '600',
  } as TextStyle,

  gradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.XS,
    borderTopWidth: 1,
    borderTopColor: LightTheme.OutlineVariant,
  },

  gradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.XS,
  },

  gradeLabel: {
    ...Typography.labelLarge,
    color: LightTheme.OnSurfaceVariant,
  } as TextStyle,

  gradeValue: {
    ...Typography.titleMedium,
    color: LightTheme.Primary,
    fontWeight: '600',
  } as TextStyle,

  gradePercentage: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
  } as TextStyle,

  compactStatusRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default AssignmentCard;

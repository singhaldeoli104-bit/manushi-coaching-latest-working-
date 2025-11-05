/**
 * NewActivityDetail - Premium Minimal Design
 * Purpose: Display activity/notification details
 * Used in: StudentNavigator (HomeStack)
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { Badge } from '../../ui/data-display/Badge';
import { T } from '../../ui';
import { trackScreenView } from '../../utils/navigationAnalytics';

type Props = NativeStackScreenProps<any, 'NewActivityDetail'>;

export default function NewActivityDetail({ route }: Props) {
  const activityId = route.params?.activityId;

  React.useEffect(() => {
    trackScreenView('NewActivityDetail', { activityId });
  }, [activityId]);

  // Mock activity data
  const activity = {
    id: activityId || '1',
    title: 'New Assignment Posted',
    description: 'Your teacher has posted a new assignment for Mathematics. Due date is next Monday.',
    type: 'assignment',
    timestamp: new Date(),
    relatedSubject: 'Mathematics',
    priority: 'high',
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return '📝';
      case 'grade': return '🏆';
      case 'class': return '📚';
      case 'announcement': return '📢';
      default: return '🔔';
    }
  };

  return (
    <BaseScreen scrollable={true}>
      <View style={styles.container}>
        <Card style={styles.headerCard}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <T variant="h1">{getTypeIcon(activity.type)}</T>
            </View>
            <View style={styles.headerInfo}>
              <T variant="h2" weight="bold">
                {activity.title}
              </T>
              <T variant="caption" style={styles.timestamp}>
                {activity.timestamp.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </T>
            </View>
            <Badge
              variant={activity.priority === 'high' ? 'error' : 'info'}
              label={activity.priority.toUpperCase()}
            />
          </View>
        </Card>

        <Card style={styles.contentCard}>
          <T variant="body" style={styles.description}>
            {activity.description}
          </T>

          {activity.relatedSubject && (
            <View style={styles.subjectTag}>
              <T variant="caption" weight="semiBold" style={styles.subjectText}>
                📚 {activity.relatedSubject}
              </T>
            </View>
          )}
        </Card>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  headerCard: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  timestamp: {
    color: '#9CA3AF',
  },
  contentCard: {
    padding: 16,
    gap: 16,
  },
  description: {
    lineHeight: 22,
    color: '#4B5563',
  },
  subjectTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
  },
  subjectText: {
    color: '#1E40AF',
  },
});

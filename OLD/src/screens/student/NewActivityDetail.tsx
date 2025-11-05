/**
 * NewActivityDetail - Premium Minimal Design
 * Purpose: Display activity/notification details
 * Used in: StudentNavigator (HomeStack)
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { Badge } from '../../ui/data-display/Badge';
import { T } from '../../ui';
import { trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

type Props = NativeStackScreenProps<any, 'NewActivityDetail'>;

interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'assignment' | 'grade' | 'class' | 'announcement' | 'general';
  created_at: string;
  related_subject?: string;
  priority: 'high' | 'medium' | 'low';
  student_id: string;
}

export default function NewActivityDetail({ route }: Props) {
  const { user } = useAuth();
  const activityId = route.params?.activityId;

  React.useEffect(() => {
    trackScreenView('NewActivityDetail', { activityId });
  }, [activityId]);

  // Fetch activity from Supabase
  const { data: activity, isLoading, error } = useQuery({
    queryKey: ['activity-detail', activityId],
    queryFn: async () => {
      if (!activityId) throw new Error('No activity ID provided');

      const { data, error } = await supabase
        .from('student_activities')
        .select('*')
        .eq('id', activityId)
        .single();

      if (error) throw error;
      return data as Activity;
    },
    enabled: !!activityId,
  });

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
    <BaseScreen
      scrollable={true}
      loading={isLoading}
      error={error ? 'Failed to load activity details' : null}
      empty={!activity}
      emptyMessage="Activity not found"
    >
      {activity && (
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
                  {new Date(activity.created_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </T>
              </View>
              <Badge
                variant={activity.priority === 'high' ? 'error' : activity.priority === 'medium' ? 'warning' : 'info'}
                label={activity.priority.toUpperCase()}
              />
            </View>
          </Card>

          <Card style={styles.contentCard}>
            <T variant="body" style={styles.description}>
              {activity.description}
            </T>

            {activity.related_subject && (
              <View style={styles.subjectTag}>
                <T variant="caption" weight="semiBold" style={styles.subjectText}>
                  📚 {activity.related_subject}
                </T>
              </View>
            )}
          </Card>
        </View>
      )}
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

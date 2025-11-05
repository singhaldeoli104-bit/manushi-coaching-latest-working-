/**
 * NewEnhancedSchedule - Premium Minimal Design
 * Purpose: Enhanced schedule view with calendar integration
 * Used in: StudentNavigator (ClassesStack)
 */

import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

type Props = NativeStackScreenProps<any, 'NewEnhancedSchedule'>;

interface ClassSession {
  id: string;
  time: string;
  subject: string;
  status: 'completed' | 'live' | 'upcoming';
  start_time: string;
  end_time: string;
}

export default function NewEnhancedSchedule({ navigation }: Props) {
  const { user } = useAuth();

  React.useEffect(() => {
    trackScreenView('NewEnhancedSchedule');
  }, []);

  // Fetch today's classes
  const { data: todayClasses, isLoading, error, refetch } = useQuery({
    queryKey: ['today-schedule', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('class_sessions')
        .select('*')
        .eq('student_id', user.id)
        .gte('start_time', today.toISOString())
        .lt('start_time', tomorrow.toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;

      return (data || []).map(cls => {
        const now = new Date();
        const start = new Date(cls.start_time);
        const end = new Date(cls.end_time);

        let status: 'completed' | 'live' | 'upcoming' = 'upcoming';
        if (now >= start && now <= end) status = 'live';
        else if (now > end) status = 'completed';

        return {
          id: cls.id,
          time: start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          subject: cls.subject || 'Class',
          status,
          start_time: cls.start_time,
          end_time: cls.end_time,
        };
      }) as ClassSession[];
    },
    enabled: !!user?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return '#EF4444';
      case 'completed': return '#9CA3AF';
      default: return '#3B82F6';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return '🔴';
      case 'completed': return '✅';
      default: return '🔵';
    }
  };

  return (
    <BaseScreen
      scrollable={false}
      loading={isLoading}
      error={error ? 'Failed to load schedule' : null}
      empty={!todayClasses || todayClasses.length === 0}
      emptyMessage="No classes scheduled for today"
    >
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              trackAction('refresh_enhanced_schedule', 'NewEnhancedSchedule');
              refetch();
            }}
          />
        }
      >
        <Card style={styles.headerCard}>
          <T variant="h2" weight="bold">
            Today's Schedule
          </T>
          <T variant="caption" style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </T>
        </Card>

        {todayClasses && todayClasses.length > 0 && (
          <Card style={styles.classesCard}>
            {todayClasses.map((classItem) => (
              <View key={classItem.id} style={styles.classItem}>
                <View style={styles.timeContainer}>
                  <T variant="caption" weight="semiBold">
                    {classItem.time}
                  </T>
                </View>
                <View
                  style={[
                    styles.classBar,
                    { backgroundColor: getStatusColor(classItem.status) },
                  ]}
                />
                <View style={styles.classInfo}>
                  <T variant="body" weight="semiBold">
                    {classItem.subject}
                  </T>
                  <View style={styles.statusContainer}>
                    <T variant="caption">
                      {getStatusIcon(classItem.status)} {classItem.status.toUpperCase()}
                    </T>
                  </View>
                </View>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerCard: {
    padding: 20,
    marginBottom: 16,
    gap: 4,
  },
  date: {
    color: '#6B7280',
  },
  classesCard: {
    padding: 16,
    gap: 16,
  },
  classItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timeContainer: {
    width: 70,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  classBar: {
    width: 4,
    borderRadius: 2,
  },
  classInfo: {
    flex: 1,
    gap: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

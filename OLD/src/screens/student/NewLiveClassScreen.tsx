/**
 * NewLiveClassScreen - Premium Minimal Design
 * Purpose: Live class participation screen
 * Used in: StudentNavigator (ClassesStack)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { VideoPlaceholder } from '../../shared/components/VideoPlaceholder';
import { Card } from '../../ui/surfaces/Card';
import { Badge } from '../../ui/data-display/Badge';
import { T } from '../../ui';
import { trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

type Props = NativeStackScreenProps<any, 'NewLiveClassScreen'>;

interface LiveClass {
  id: string;
  subject: string;
  teacher_name: string;
  start_time: string;
  status: 'live' | 'scheduled' | 'ended';
  participant_count?: number;
}

export default function NewLiveClassScreen({ route, navigation }: Props) {
  const { user } = useAuth();
  const classId = route.params?.classId;

  React.useEffect(() => {
    trackScreenView('NewLiveClassScreen', { classId });
  }, [classId]);

  // Fetch live class details
  const { data: liveClass, isLoading, error } = useQuery({
    queryKey: ['live-class', classId],
    queryFn: async () => {
      if (!classId) throw new Error('No class ID provided');

      const { data, error } = await supabase
        .from('class_sessions')
        .select('*, teachers(name)')
        .eq('id', classId)
        .eq('status', 'live')
        .single();

      if (error) throw error;

      // Count participants (if you have a participants table)
      const { count } = await supabase
        .from('class_participants')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', classId);

      return {
        id: data.id,
        subject: data.subject || 'Class',
        teacher_name: (data.teachers as any)?.name || 'Teacher',
        start_time: data.start_time,
        status: data.status,
        participant_count: count || 0,
      } as LiveClass;
    },
    enabled: !!classId,
  });

  return (
    <BaseScreen
      scrollable={true}
      loading={isLoading}
      error={error ? 'Failed to load live class' : null}
      empty={!liveClass}
      emptyMessage="Live class not found"
    >
      {liveClass && (
        <View style={styles.container}>
          <Card style={styles.liveCard}>
            <Badge variant="error" label="🔴 LIVE" />
            <T variant="h1" weight="bold" style={styles.title}>
              {liveClass.subject}
            </T>
            <T variant="body" style={styles.teacher}>
              {liveClass.teacher_name}
            </T>
            <View style={styles.participants}>
              <T variant="caption" style={styles.participantsText}>
                👥 {liveClass.participant_count} participants
              </T>
            </View>
          </Card>

          <VideoPlaceholder
            streamId={classId}
            isLive={true}
            showControls={true}
            placeholderMessage="Live Class in Progress"
          />
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
  liveCard: {
    padding: 20,
    gap: 12,
  },
  title: {
    marginTop: 4,
  },
  teacher: {
    color: '#6B7280',
  },
  participants: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  participantsText: {
    color: '#6B7280',
  },
  videoCard: {
    padding: 16,
  },
  videoPlaceholder: {
    height: 250,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  liveText: {
    color: '#F3F4F6',
  },
});

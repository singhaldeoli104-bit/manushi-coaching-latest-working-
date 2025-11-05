/**
 * NewEnhancedLiveClass - Premium Minimal Design
 * Purpose: Enhanced live class with advanced features
 * Used in: StudentNavigator (ClassesStack)
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { VideoPlaceholder } from '../../shared/components/VideoPlaceholder';
import { Card } from '../../ui/surfaces/Card';
import { Badge } from '../../ui/data-display/Badge';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

type Props = NativeStackScreenProps<any, 'NewEnhancedLiveClass'>;

interface LiveClassDetails {
  id: string;
  subject: string;
  teacher_name: string;
  start_time: string;
  status: 'live' | 'scheduled' | 'ended';
  duration_minutes: number;
}

export default function NewEnhancedLiveClass({ route, navigation }: Props) {
  const { user } = useAuth();
  const classId = route.params?.classId;

  React.useEffect(() => {
    trackScreenView('NewEnhancedLiveClass', { classId });
  }, [classId]);

  // Fetch live class details
  const { data: liveClass, isLoading, error } = useQuery({
    queryKey: ['enhanced-live-class', classId],
    queryFn: async () => {
      if (!classId) throw new Error('No class ID provided');

      const { data, error } = await supabase
        .from('class_sessions')
        .select('*, teachers(name)')
        .eq('id', classId)
        .single();

      if (error) throw error;

      // Calculate elapsed time
      const start = new Date(data.start_time);
      const now = new Date();
      const elapsedMinutes = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));

      return {
        id: data.id,
        subject: data.subject || 'Class',
        teacher_name: (data.teachers as any)?.name || 'Teacher',
        start_time: data.start_time,
        status: data.status || 'live',
        duration_minutes: elapsedMinutes,
      } as LiveClassDetails;
    },
    enabled: !!classId,
  });

  const features = [
    { icon: '✍️', label: 'Whiteboard', action: 'whiteboard' },
    { icon: '📊', label: 'Screen Share', action: 'screen_share' },
    { icon: '💬', label: 'Chat', action: 'chat' },
    { icon: '📝', label: 'Notes', action: 'notes' },
  ];

  const handleFeaturePress = (action: string) => {
    trackAction('use_live_feature', 'NewEnhancedLiveClass', { feature: action, classId });

    // Navigate to respective feature screens
    switch (action) {
      case 'whiteboard':
        // Navigate to Whiteboard screen for collaborative whiteboard
        safeNavigate('Whiteboard', { classId });
        break;
      case 'screen_share':
        // Screen sharing handled within video stream - no separate screen needed
        Alert.alert('Screen Share', 'Screen sharing is now enabled in the video stream');
        break;
      case 'chat':
        // Navigate to ClassChat screen for live class chat
        safeNavigate('ClassChat', { classId });
        break;
      case 'notes':
        // Navigate to ClassNotes screen for note-taking during class
        safeNavigate('ClassNotes', { classId });
        break;
      default:
        Alert.alert('Feature', 'This feature is being prepared');
    }
  };

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
          <Card style={styles.statusCard}>
            <Badge variant="error" label="🔴 LIVE" />
            <T variant="h2" weight="bold" style={styles.className}>
              {liveClass.subject}
            </T>
            <T variant="body" style={styles.teacher}>
              {liveClass.teacher_name}
            </T>
            <T variant="caption" style={styles.time}>
              Started {liveClass.duration_minutes} {liveClass.duration_minutes === 1 ? 'minute' : 'minutes'} ago
            </T>
          </Card>

          <VideoPlaceholder
            streamId={classId}
            isLive={true}
            showControls={true}
            placeholderMessage="Enhanced Live Stream"
          />

          <Card style={styles.featuresCard}>
            <T variant="title" weight="semiBold" style={styles.featuresTitle}>
              Interactive Features
            </T>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.featureButton}
                  onPress={() => handleFeaturePress(feature.action)}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${feature.label}`}
                >
                  <T variant="h2">{feature.icon}</T>
                  <T variant="caption">{feature.label}</T>
                </TouchableOpacity>
              ))}
            </View>
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
  statusCard: {
    padding: 16,
    gap: 8,
  },
  className: {
    marginTop: 4,
  },
  teacher: {
    color: '#6B7280',
  },
  time: {
    color: '#6B7280',
  },
  videoCard: {
    padding: 16,
  },
  videoPlaceholder: {
    height: 220,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  videoText: {
    color: '#F3F4F6',
  },
  featuresCard: {
    padding: 16,
  },
  featuresTitle: {
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureButton: {
    width: '47%',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
});

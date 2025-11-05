/**
 * NewClassDetailScreen - Premium Minimal Design
 * Purpose: Display class details with tabs (overview/materials/recordings)
 * Features: Tabs system, recordings section, teacher info, materials
 */

import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Alert, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card, CardHeader, CardContent } from '../../ui/surfaces/Card';
import { Badge, Chip, T, Row, Col } from '../../ui';
import { safeNavigate } from '../../utils/navigationService';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

type Props = NativeStackScreenProps<any, 'NewClassDetailScreen'>;

interface ClassDetails {
  id: string;
  subject: string;
  teacher_name: string;
  teacher_email?: string;
  teacher_phone?: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_link?: string;
  description?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  materials?: Array<{
    id: string;
    title: string;
    type: string;
    file_url?: string;
    file_size?: string;
    created_at: string;
  }>;
  recordings?: Array<{
    id: string;
    title: string;
    recording_url?: string;
    duration_minutes?: number;
    created_at: string;
    file_size?: string;
  }>;
}

type TabKey = 'overview' | 'materials' | 'recordings';

export default function NewClassDetailScreen({ route, navigation }: Props) {
  const { user } = useAuth();
  const classId = route.params?.classId;

  // Tab state
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  // Track screen view
  React.useEffect(() => {
    trackScreenView('NewClassDetailScreen', { classId });
  }, [classId]);

  // Fetch class details
  const { data: classDetails, isLoading, error, refetch } = useQuery({
    queryKey: ['class-detail', classId],
    queryFn: async () => {
      if (!classId) throw new Error('No class ID provided');

      // Fetch class with teacher, materials, and recordings
      const { data, error } = await supabase
        .from('class_sessions')
        .select(`
          *,
          teachers(name, email, phone),
          study_materials(id, title, type, file_url, file_size, created_at)
        `)
        .eq('id', classId)
        .single();

      if (error) throw error;

      // Fetch recordings for this class
      const { data: recordingsData } = await supabase
        .from('class_recordings')
        .select('*')
        .eq('class_id', classId)
        .order('created_at', { ascending: false });

      return {
        ...data,
        teacher_name: (data.teachers as any)?.name || 'Unknown Teacher',
        teacher_email: (data.teachers as any)?.email,
        teacher_phone: (data.teachers as any)?.phone,
        materials: data.study_materials || [],
        recordings: recordingsData || [],
      } as ClassDetails;
    },
    enabled: !!classId,
  });

  // Get class status based on time
  const getClassStatus = (): 'live' | 'upcoming' | 'ended' => {
    if (!classDetails) return 'upcoming';
    if (classDetails.status === 'cancelled' || classDetails.status === 'completed') return 'ended';

    const now = new Date();
    const start = new Date(classDetails.scheduled_at);
    const end = new Date(start.getTime() + classDetails.duration_minutes * 60000);

    if (now >= start && now <= end) return 'live';
    if (now > end) return 'ended';
    return 'upcoming';
  };

  // Handle join class
  const handleJoinClass = useCallback(async () => {
    if (!classDetails?.meeting_link) {
      Alert.alert('No Meeting Link', 'The meeting link is not available yet.');
      return;
    }

    trackAction('join_class', 'NewClassDetailScreen', { classId });

    try {
      const supported = await Linking.canOpenURL(classDetails.meeting_link);
      if (supported) {
        await Linking.openURL(classDetails.meeting_link);
      } else {
        Alert.alert('Error', 'Unable to open meeting link.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to open meeting link.');
    }
  }, [classDetails, classId]);

  // Handle download material
  const handleDownloadMaterial = useCallback(
    async (material: any) => {
      if (!material.file_url) {
        Alert.alert('No File', 'This material does not have a file attached.');
        return;
      }

      trackAction('download_material', 'NewClassDetailScreen', {
        classId,
        materialId: material.id,
      });

      try {
        const supported = await Linking.canOpenURL(material.file_url);
        if (supported) {
          await Linking.openURL(material.file_url);
        } else {
          Alert.alert('Error', 'Unable to open file.');
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to open file.');
      }
    },
    [classId]
  );

  // Handle play recording
  const handlePlayRecording = useCallback(
    async (recording: any) => {
      if (!recording.recording_url) {
        Alert.alert('No Recording', 'This recording is not available yet.');
        return;
      }

      trackAction('play_recording', 'NewClassDetailScreen', {
        classId,
        recordingId: recording.id,
      });

      Alert.alert(
        'Play Recording',
        `Play "${recording.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Play',
            onPress: async () => {
              try {
                const supported = await Linking.canOpenURL(recording.recording_url);
                if (supported) {
                  await Linking.openURL(recording.recording_url);
                } else {
                  Alert.alert('Error', 'Unable to open recording.');
                }
              } catch (err) {
                Alert.alert('Error', 'Failed to open recording.');
              }
            },
          },
        ]
      );
    },
    [classId]
  );

  // Handle contact teacher
  const handleContactTeacher = useCallback(() => {
    if (!classDetails?.teacher_email && !classDetails?.teacher_phone) {
      Alert.alert('No Contact Info', 'Teacher contact information is not available.');
      return;
    }

    trackAction('contact_teacher', 'NewClassDetailScreen', { classId });

    const options = [];

    if (classDetails.teacher_email) {
      options.push({
        text: `📧 Email: ${classDetails.teacher_email}`,
        onPress: () => Linking.openURL(`mailto:${classDetails.teacher_email}`),
      });
    }

    if (classDetails.teacher_phone) {
      options.push({
        text: `📞 Call: ${classDetails.teacher_phone}`,
        onPress: () => Linking.openURL(`tel:${classDetails.teacher_phone}`),
      });
    }

    options.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert('Contact Teacher', 'Choose contact method:', options);
  }, [classDetails, classId]);

  if (!classId) {
    return (
      <BaseScreen scrollable={false} error="No class ID provided">
        <View />
      </BaseScreen>
    );
  }

  const status = getClassStatus();

  // Render Overview Tab
  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Class Header */}
      <Card style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View style={styles.headerInfo}>
            <T variant="h2" weight="bold">
              {classDetails?.subject}
            </T>
            <T variant="body" style={styles.teacherName}>
              {classDetails?.teacher_name}
            </T>
          </View>
          <Badge
            variant={status === 'live' ? 'error' : status === 'upcoming' ? 'info' : 'neutral'}
          >
            {status === 'live' ? '🔴 LIVE' : status === 'upcoming' ? '🔵 Upcoming' : '⚪ Ended'}
          </Badge>
        </View>

        {/* Time Info */}
        <View style={styles.timeInfo}>
          <View style={styles.timeRow}>
            <T variant="caption" style={styles.timeLabel}>
              📅{' '}
              {new Date(classDetails?.scheduled_at || '').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </T>
          </View>
          <View style={styles.timeRow}>
            <T variant="caption" style={styles.timeLabel}>
              🕐{' '}
              {new Date(classDetails?.scheduled_at || '').toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}{' '}
              • {classDetails?.duration_minutes} minutes
            </T>
          </View>
        </View>

        {/* Description */}
        {classDetails?.description && (
          <View style={styles.descriptionContainer}>
            <T variant="body" style={styles.description}>
              {classDetails.description}
            </T>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          {status === 'live' && classDetails?.meeting_link && (
            <TouchableOpacity
              style={[styles.actionButton, styles.joinButton]}
              onPress={handleJoinClass}
              accessibilityRole="button"
              accessibilityLabel="Join live class"
            >
              <T variant="body" weight="semiBold" style={styles.joinButtonText}>
                🔴 Join Live Class
              </T>
            </TouchableOpacity>
          )}
          {status === 'upcoming' && classDetails?.meeting_link && (
            <TouchableOpacity
              style={[styles.actionButton, styles.linkButton]}
              onPress={handleJoinClass}
              accessibilityRole="button"
              accessibilityLabel="View meeting link"
            >
              <T variant="body" weight="semiBold" style={styles.linkButtonText}>
                🔗 View Meeting Link
              </T>
            </TouchableOpacity>
          )}
        </View>
      </Card>

      {/* Teacher Card */}
      <Card style={styles.teacherCard}>
        <T variant="title" weight="semiBold" style={styles.sectionTitle}>
          Teacher
        </T>
        <View style={styles.teacherInfo}>
          <View style={styles.teacherAvatar}>
            <T variant="h2">👨‍🏫</T>
          </View>
          <View style={styles.teacherDetails}>
            <T variant="body" weight="semiBold">
              {classDetails?.teacher_name}
            </T>
            {classDetails?.teacher_email && (
              <T variant="caption" style={styles.teacherEmail}>
                {classDetails.teacher_email}
              </T>
            )}
            {classDetails?.teacher_phone && (
              <T variant="caption" style={styles.teacherEmail}>
                {classDetails.teacher_phone}
              </T>
            )}
          </View>
          {(classDetails?.teacher_email || classDetails?.teacher_phone) && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContactTeacher}
              accessibilityRole="button"
              accessibilityLabel="Contact teacher"
            >
              <T variant="body">📧</T>
            </TouchableOpacity>
          )}
        </View>
      </Card>

      {/* Quick Stats */}
      <Card style={styles.statsCard}>
        <T variant="title" weight="semiBold" style={styles.sectionTitle}>
          Quick Info
        </T>
        <Row gap="md" style={{ justifyContent: 'space-around' }}>
          <Col style={{ alignItems: 'center' }}>
            <T variant="h3">📚</T>
            <T variant="body" weight="bold">
              {classDetails?.materials?.length || 0}
            </T>
            <T variant="caption" color="textSecondary">
              Materials
            </T>
          </Col>
          <Col style={{ alignItems: 'center' }}>
            <T variant="h3">🎥</T>
            <T variant="body" weight="bold">
              {classDetails?.recordings?.length || 0}
            </T>
            <T variant="caption" color="textSecondary">
              Recordings
            </T>
          </Col>
          <Col style={{ alignItems: 'center' }}>
            <T variant="h3">⏱️</T>
            <T variant="body" weight="bold">
              {classDetails?.duration_minutes}m
            </T>
            <T variant="caption" color="textSecondary">
              Duration
            </T>
          </Col>
        </Row>
      </Card>
    </View>
  );

  // Render Materials Tab
  const renderMaterialsTab = () => (
    <View style={styles.tabContent}>
      {classDetails?.materials && classDetails.materials.length > 0 ? (
        <>
          <T variant="title" weight="semiBold" style={{ marginBottom: 12 }}>
            Study Materials ({classDetails.materials.length})
          </T>
          {classDetails.materials.map((material) => (
            <Card key={material.id} variant="outlined" style={{ marginBottom: 12 }}>
              <TouchableOpacity
                style={styles.materialItem}
                onPress={() => handleDownloadMaterial(material)}
                accessibilityRole="button"
                accessibilityLabel={`Open ${material.title}`}
              >
                <View style={styles.materialIcon}>
                  <T variant="h3">
                    {material.type === 'pdf'
                      ? '📄'
                      : material.type === 'video'
                      ? '🎥'
                      : '📝'}
                  </T>
                </View>
                <View style={styles.materialInfo}>
                  <T variant="body" weight="semiBold" numberOfLines={1}>
                    {material.title}
                  </T>
                  <Row gap="md">
                    <T variant="caption" style={styles.materialMeta}>
                      {new Date(material.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </T>
                    {material.file_size && (
                      <T variant="caption" style={styles.materialMeta}>
                        {material.file_size}
                      </T>
                    )}
                  </Row>
                </View>
                <T variant="body" style={styles.materialArrow}>
                  ⬇️
                </T>
              </TouchableOpacity>
            </Card>
          ))}
        </>
      ) : (
        <Card style={{ padding: 24, alignItems: 'center' }}>
          <T variant="h2" style={{ marginBottom: 8 }}>
            📚
          </T>
          <T variant="body" color="textSecondary" style={{ textAlign: 'center' }}>
            No study materials available yet
          </T>
        </Card>
      )}
    </View>
  );

  // Render Recordings Tab
  const renderRecordingsTab = () => (
    <View style={styles.tabContent}>
      {classDetails?.recordings && classDetails.recordings.length > 0 ? (
        <>
          <T variant="title" weight="semiBold" style={{ marginBottom: 12 }}>
            Past Recordings ({classDetails.recordings.length})
          </T>
          {classDetails.recordings.map((recording) => (
            <Card key={recording.id} variant="outlined" style={{ marginBottom: 12 }}>
              <TouchableOpacity
                style={styles.recordingItem}
                onPress={() => handlePlayRecording(recording)}
                accessibilityRole="button"
                accessibilityLabel={`Play recording: ${recording.title}`}
              >
                <View style={styles.recordingIcon}>
                  <T variant="h3">🎥</T>
                </View>
                <View style={styles.recordingInfo}>
                  <T variant="body" weight="semiBold" numberOfLines={1}>
                    {recording.title}
                  </T>
                  <Row gap="md">
                    <T variant="caption" style={styles.recordingMeta}>
                      {new Date(recording.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </T>
                    {recording.duration_minutes && (
                      <T variant="caption" style={styles.recordingMeta}>
                        ⏱️ {recording.duration_minutes} min
                      </T>
                    )}
                    {recording.file_size && (
                      <T variant="caption" style={styles.recordingMeta}>
                        {recording.file_size}
                      </T>
                    )}
                  </Row>
                </View>
                <View style={styles.playButton}>
                  <T variant="body">▶️</T>
                </View>
              </TouchableOpacity>
            </Card>
          ))}
        </>
      ) : (
        <Card style={{ padding: 24, alignItems: 'center' }}>
          <T variant="h2" style={{ marginBottom: 8 }}>
            🎥
          </T>
          <T variant="body" color="textSecondary" style={{ textAlign: 'center' }}>
            No recordings available yet
          </T>
        </Card>
      )}
    </View>
  );

  return (
    <BaseScreen
      scrollable={false}
      loading={isLoading}
      error={error ? 'Failed to load class details' : null}
      empty={!classDetails}
      emptyMessage="Class not found"
      onRefresh={() => {
        trackAction('refresh_class_detail', 'NewClassDetailScreen', { classId });
        refetch();
      }}
    >
      {classDetails && (
        <View style={styles.container}>
          {/* Tab Selector */}
          <View style={styles.tabSelector}>
            <Chip
              variant="filter"
              label="Overview"
              selected={activeTab === 'overview'}
              onPress={() => {
                setActiveTab('overview');
                trackAction('switch_tab', 'NewClassDetailScreen', { tab: 'overview' });
              }}
            />
            <Chip
              variant="filter"
              label={`Materials (${classDetails.materials?.length || 0})`}
              selected={activeTab === 'materials'}
              onPress={() => {
                setActiveTab('materials');
                trackAction('switch_tab', 'NewClassDetailScreen', { tab: 'materials' });
              }}
            />
            <Chip
              variant="filter"
              label={`Recordings (${classDetails.recordings?.length || 0})`}
              selected={activeTab === 'recordings'}
              onPress={() => {
                setActiveTab('recordings');
                trackAction('switch_tab', 'NewClassDetailScreen', { tab: 'recordings' });
              }}
            />
          </View>

          {/* Tab Content */}
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'materials' && renderMaterialsTab()}
            {activeTab === 'recordings' && renderRecordingsTab()}
          </ScrollView>
        </View>
      )}
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  scrollContent: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  headerCard: {
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  teacherName: {
    color: '#6B7280',
  },
  timeInfo: {
    gap: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabel: {
    color: '#6B7280',
  },
  descriptionContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  description: {
    color: '#4B5563',
    lineHeight: 20,
  },
  actions: {
    gap: 8,
    paddingTop: 8,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  joinButton: {
    backgroundColor: '#EF4444',
  },
  joinButtonText: {
    color: '#FFFFFF',
  },
  linkButton: {
    backgroundColor: '#3B82F6',
  },
  linkButtonText: {
    color: '#FFFFFF',
  },
  teacherCard: {
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teacherAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherDetails: {
    flex: 1,
    gap: 4,
  },
  teacherEmail: {
    color: '#6B7280',
  },
  contactButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
  },
  statsCard: {
    padding: 16,
    marginBottom: 16,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  materialIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  materialInfo: {
    flex: 1,
    gap: 4,
  },
  materialMeta: {
    color: '#9CA3AF',
  },
  materialArrow: {
    color: '#3B82F6',
    fontSize: 20,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  recordingIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  recordingInfo: {
    flex: 1,
    gap: 4,
  },
  recordingMeta: {
    color: '#9CA3AF',
  },
  playButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
  },
});

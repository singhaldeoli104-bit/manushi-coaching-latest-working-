/**
 * NewClassDetailScreen - Premium Minimal Design
 * Purpose: Display class details with teacher info and materials
 * Used in: StudentNavigator (ClassesStack)
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Alert, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { Badge } from '../../ui/data-display/Badge';
import { T } from '../../ui';
import { safeNavigate } from '../../utils/navigationService';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

type Props = NativeStackScreenProps<any, 'NewClassDetailScreen'>;

interface ClassDetails {
  id: string;
  subject: string;
  teacher_name: string;
  teacher_email?: string;
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
    created_at: string;
  }>;
}

export default function NewClassDetailScreen({ route, navigation }: Props) {
  const { user } = useAuth();
  const classId = route.params?.classId;

  // Track screen view
  React.useEffect(() => {
    trackScreenView('NewClassDetailScreen', { classId });
  }, [classId]);

  // Fetch class details
  const { data: classDetails, isLoading, error, refetch } = useQuery({
    queryKey: ['class-detail', classId],
    queryFn: async () => {
      if (!classId) throw new Error('No class ID provided');

      // Fetch class with teacher and materials
      const { data, error } = await supabase
        .from('class_sessions')
        .select(`
          *,
          teachers(name, email),
          study_materials(id, title, type, file_url, created_at)
        `)
        .eq('id', classId)
        .single();

      if (error) throw error;

      return {
        ...data,
        teacher_name: (data.teachers as any)?.name || 'Unknown Teacher',
        teacher_email: (data.teachers as any)?.email,
        materials: data.study_materials || [],
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
  const handleDownloadMaterial = useCallback(async (material: any) => {
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
  }, [classId]);

  // Handle contact teacher
  const handleContactTeacher = useCallback(() => {
    if (!classDetails?.teacher_email) {
      Alert.alert('No Email', 'Teacher email is not available.');
      return;
    }

    trackAction('contact_teacher', 'NewClassDetailScreen', { classId });

    Linking.openURL(`mailto:${classDetails.teacher_email}`);
  }, [classDetails, classId]);

  if (!classId) {
    return (
      <BaseScreen scrollable={false} error="No class ID provided">
        <View />
      </BaseScreen>
    );
  }

  const status = getClassStatus();

  return (
    <BaseScreen
      scrollable={true}
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
          {/* Class Header */}
          <Card style={styles.headerCard}>
            <View style={styles.headerTop}>
              <View style={styles.headerInfo}>
                <T variant="h2" weight="bold">
                  {classDetails.subject}
                </T>
                <T variant="body" style={styles.teacherName}>
                  {classDetails.teacher_name}
                </T>
              </View>
              <Badge
                variant={
                  status === 'live' ? 'error' : status === 'upcoming' ? 'info' : 'default'
                }
                label={
                  status === 'live' ? '🔴 LIVE' : status === 'upcoming' ? '🔵 Upcoming' : '⚪ Ended'
                }
              />
            </View>

            {/* Time Info */}
            <View style={styles.timeInfo}>
              <View style={styles.timeRow}>
                <T variant="caption" style={styles.timeLabel}>
                  📅 {new Date(classDetails.scheduled_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </T>
              </View>
              <View style={styles.timeRow}>
                <T variant="caption" style={styles.timeLabel}>
                  🕐 {new Date(classDetails.scheduled_at).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })} • {classDetails.duration_minutes} minutes
                </T>
              </View>
            </View>

            {/* Description */}
            {classDetails.description && (
              <View style={styles.descriptionContainer}>
                <T variant="body" style={styles.description}>
                  {classDetails.description}
                </T>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actions}>
              {status === 'live' && classDetails.meeting_link && (
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
              {status === 'upcoming' && classDetails.meeting_link && (
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
                  {classDetails.teacher_name}
                </T>
                {classDetails.teacher_email && (
                  <T variant="caption" style={styles.teacherEmail}>
                    {classDetails.teacher_email}
                  </T>
                )}
              </View>
              {classDetails.teacher_email && (
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

          {/* Materials Section */}
          {classDetails.materials && classDetails.materials.length > 0 && (
            <Card style={styles.materialsCard}>
              <T variant="title" weight="semiBold" style={styles.sectionTitle}>
                Study Materials
              </T>
              {classDetails.materials.map((material) => (
                <TouchableOpacity
                  key={material.id}
                  style={styles.materialItem}
                  onPress={() => handleDownloadMaterial(material)}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${material.title}`}
                >
                  <View style={styles.materialIcon}>
                    <T variant="body">
                      {material.type === 'pdf' ? '📄' : material.type === 'video' ? '🎥' : '📝'}
                    </T>
                  </View>
                  <View style={styles.materialInfo}>
                    <T variant="body" weight="semiBold" numberOfLines={1}>
                      {material.title}
                    </T>
                    <T variant="caption" style={styles.materialDate}>
                      {new Date(material.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </T>
                  </View>
                  <T variant="body" style={styles.materialArrow}>
                    →
                  </T>
                </TouchableOpacity>
              ))}
            </Card>
          )}
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
    gap: 12,
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
  materialsCard: {
    padding: 16,
    gap: 12,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    minHeight: 48,
  },
  materialIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  materialInfo: {
    flex: 1,
    gap: 2,
  },
  materialDate: {
    color: '#9CA3AF',
  },
  materialArrow: {
    color: '#9CA3AF',
    fontSize: 20,
  },
});

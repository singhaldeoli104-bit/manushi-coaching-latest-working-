/**
 * ClassDetailScreen - Student class detail view with Overview, Doubts, and Resources
 *
 * Features:
 * - 3-tab navigation (Overview, Doubts, Resources)
 * - Class information display (teacher, subject, schedule, duration)
 * - Real-time attendance tracking
 * - Doubt submission and viewing
 * - Resource viewing (PDFs, videos, links)
 * - Safe navigation with analytics
 * - MD3 compliant with Phase 0 components
 *
 * Analysis: ClassDetailScreen_ANALYSIS.md (861 lines, 50+ features, ⭐⭐⭐ complexity)
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Linking, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../../lib/supabase';
import BaseScreen from '../../components/common/BaseScreen';
import { StudentTopBar } from '../../components/student/navigation/StudentTopBar';
import { Tabs } from '../../components/student/molecules/Tabs';
import { Card } from '../../components/student/atoms/Card';
import { Button } from '../../components/student/atoms/Button';
import { Badge } from '../../components/student/atoms/Badge';
import { EmptyState } from '../../components/student/molecules/EmptyState';
import { LoadingState } from '../../components/student/molecules/LoadingState';
import { useStudent } from '../../context/StudentContext';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';
import type { StudentStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<StudentStackParamList, 'ClassDetail'>;

interface ClassData {
  id: string;
  subject: string;
  teacher_name: string | null;
  scheduled_start_at: string;
  duration_minutes: number;
  description: string | null;
  status: 'upcoming' | 'live' | 'completed';
}

interface DoubtData {
  id: string;
  question: string;
  subject: string;
  status: 'open' | 'answered' | 'closed';
  answer: string | null;
  teacher_name: string | null;
  created_at: string;
}

interface ResourceData {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link';
  url: string;
  description: string | null;
  created_at: string;
}

interface AttendanceData {
  id: string;
  status: 'present' | 'absent' | 'late';
  timestamp: string;
}

const ClassDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { classId } = route.params;
  const { student } = useStudent();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Analytics tracking
  useEffect(() => {
    trackScreenView('ClassDetailScreen', { classId, studentId: student?.id });
  }, [classId, student?.id]);

  // Fetch class details
  const {
    data: classData,
    isLoading: classLoading,
    error: classError,
    refetch: refetchClass,
  } = useQuery({
    queryKey: ['class-detail', classId],
    queryFn: async () => {
      console.log('🔍 [ClassDetailScreen] Fetching class details for:', classId);

      const { data, error } = await supabase
        .from('classes')
        .select('id, subject, scheduled_at, duration_minutes, description, teacher_id')
        .eq('id', classId)
        .single();

      if (error) {
        console.error('❌ [ClassDetailScreen] Error fetching class:', JSON.stringify(error, null, 2));
        console.error('❌ [ClassDetailScreen] Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }

      console.log('✅ [ClassDetailScreen] Class data loaded:', data);

      // Calculate status based on time
      const scheduledTime = new Date(data.scheduled_at);
      const now = new Date();
      const endTime = new Date(scheduledTime.getTime() + (data.duration_minutes ?? 60) * 60000);

      let status: 'upcoming' | 'live' | 'completed' = 'upcoming';
      if (now >= scheduledTime && now <= endTime) {
        status = 'live';
      } else if (now > endTime) {
        status = 'completed';
      }

      return {
        id: data.id,
        subject: data.subject ?? 'Unknown Subject',
        teacher_name: data.teacher_id ? `Teacher ${data.teacher_id.slice(0, 8)}` : 'Unknown Teacher',
        scheduled_start_at: data.scheduled_at,
        duration_minutes: data.duration_minutes ?? 60,
        description: data.description,
        status,
      } as ClassData;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch attendance
  const {
    data: attendance,
    isLoading: attendanceLoading,
  } = useQuery({
    queryKey: ['class-attendance', classId, student?.id],
    queryFn: async () => {
      if (!student?.id) return null;

      console.log('🔍 [ClassDetailScreen] Fetching attendance...');

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('class_id', classId)
        .eq('student_id', student.id)
        .maybeSingle();

      if (error) {
        console.error('❌ [ClassDetailScreen] Error fetching attendance:', error);
        return null;
      }

      console.log('✅ [ClassDetailScreen] Attendance loaded:', data);
      return data as AttendanceData | null;
    },
    enabled: !!student?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes (real-time updates)
  });

  // Fetch doubts
  const {
    data: doubts = [],
    isLoading: doubtsLoading,
  } = useQuery({
    queryKey: ['class-doubts', classId, student?.id],
    queryFn: async () => {
      if (!student?.id) return [];

      console.log('🔍 [ClassDetailScreen] Fetching doubts...');

      const { data, error } = await supabase
        .from('doubts')
        .select('id, question, subject, status, answer, created_at, teacher_id')
        .eq('class_id', classId)
        .eq('student_id', student.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [ClassDetailScreen] Error fetching doubts:', JSON.stringify(error, null, 2));
        console.error('❌ [ClassDetailScreen] Doubts error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        return [];
      }

      console.log('✅ [ClassDetailScreen] Doubts loaded:', data?.length ?? 0);

      return (data ?? []).map(doubt => ({
        id: doubt.id,
        question: doubt.question,
        subject: doubt.subject ?? '',
        status: doubt.status ?? 'open',
        answer: doubt.answer,
        teacher_name: doubt.teacher_id ? `Teacher ${doubt.teacher_id.slice(0, 8)}` : null,
        created_at: doubt.created_at,
      })) as DoubtData[];
    },
    enabled: !!student?.id,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });

  // Fetch resources
  const {
    data: resources = [],
    isLoading: resourcesLoading,
  } = useQuery({
    queryKey: ['class-resources', classId],
    queryFn: async () => {
      console.log('🔍 [ClassDetailScreen] Fetching resources...');

      const { data, error } = await supabase
        .from('class_materials')
        .select('id, title, file_url, file_type, created_at')
        .eq('class_id', classId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [ClassDetailScreen] Error fetching resources:', JSON.stringify(error, null, 2));
        console.error('❌ [ClassDetailScreen] Resources error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        return [];
      }

      console.log('✅ [ClassDetailScreen] Resources loaded:', data?.length ?? 0);

      return (data ?? []).map(resource => ({
        id: resource.id,
        title: resource.title ?? 'Untitled',
        type: resource.file_type ?? 'pdf',
        url: resource.file_url ?? '',
        description: null,
        created_at: resource.created_at,
      })) as ResourceData[];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Handlers
  const handleSubmitDoubt = useCallback(() => {
    trackAction('submit_doubt', 'ClassDetailScreen', { classId });
    safeNavigate('DoubtSubmission', { classId, subject: classData?.subject });
  }, [classId, classData?.subject]);

  const handleViewResource = useCallback((resource: ResourceData) => {
    trackAction('view_resource', 'ClassDetailScreen', { resourceId: resource.id, type: resource.type });

    if (resource.type === 'link' && resource.url) {
      Linking.openURL(resource.url).catch(err => {
        console.error('Error opening link:', err);
      });
    } else {
      // Navigate to resource viewer (implement as needed)
      safeNavigate('ResourceViewer', { resourceId: resource.id });
    }
  }, []);

  const handleTabChange = useCallback((tabKey: string) => {
    trackAction('view_tab', 'ClassDetailScreen', { tab: tabKey });
    setActiveTab(tabKey);
  }, []);

  // Computed values
  const formattedSchedule = useMemo(() => {
    if (!classData) return '';
    const date = new Date(classData.scheduled_start_at);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [classData]);

  const doubtStats = useMemo(() => {
    const open = doubts.filter(d => d.status === 'open').length;
    const answered = doubts.filter(d => d.status === 'answered').length;
    const closed = doubts.filter(d => d.status === 'closed').length;
    return { open, answered, closed, total: doubts.length };
  }, [doubts]);

  // Tab configuration
  const tabs = [
    { key: 'overview', label: t('classDetail.tabs.overview') },
    { key: 'doubts', label: t('classDetail.tabs.doubts'), badge: doubtStats.open > 0 ? doubtStats.open : undefined },
    { key: 'resources', label: t('classDetail.tabs.resources'), badge: resources.length > 0 ? resources.length : undefined },
  ];

  return (
    <>
      <StudentTopBar
        title={t('classDetail.title')}
        onMenuPress={() => navigation.openDrawer()}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <BaseScreen
        scrollable={false}
        loading={classLoading}
        error={classError ? 'Failed to load class details' : null}
        empty={!classLoading && !classData}
        emptyBody="Class not found"
        onRetry={refetchClass}
      >
        <View style={styles.container}>
          {/* Class Header Card */}
          {classData && (
            <View style={styles.headerSection}>
              <Card variant="elevated" style={styles.headerCard}>
                <View style={styles.headerContent}>
                  <View style={styles.headerRow}>
                    <Text style={styles.subjectText}>{classData.subject}</Text>
                    <Badge
                      value={classData.status.toUpperCase()}
                      variant={classData.status === 'live' ? 'error' : classData.status === 'upcoming' ? 'info' : 'success'}
                    />
                  </View>

                  <Text style={styles.teacherText}>Teacher: {classData.teacher_name}</Text>
                  <Text style={styles.scheduleText}>📅 {formattedSchedule}</Text>
                  <Text style={styles.durationText}>⏱️ {classData.duration_minutes} minutes</Text>

                  {classData.description && (
                    <Text style={styles.descriptionText}>{classData.description}</Text>
                  )}

                  {attendance && (
                    <View style={styles.attendanceRow}>
                      <Text style={styles.attendanceLabel}>Attendance:</Text>
                      <Badge
                        value={attendance.status.toUpperCase()}
                        variant={attendance.status === 'present' ? 'success' : attendance.status === 'late' ? 'warning' : 'error'}
                      />
                    </View>
                  )}
                </View>
              </Card>
            </View>
          )}

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => handleTabChange(tab.key)}
                style={[
                  styles.tabButton,
                  activeTab === tab.key && styles.tabButtonActive
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.key && styles.tabTextActive
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <ScrollView style={styles.tabContent}>
            {activeTab === 'overview' && classData && (
              <View style={styles.overviewTab}>
                <Card variant="outlined" style={styles.infoCard}>
                  <Text style={styles.sectionTitle}>{t('classDetail.classInformation')}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t('classDetail.subject')}:</Text>
                    <Text style={styles.infoValue}>{classData.subject}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t('classDetail.teacher')}:</Text>
                    <Text style={styles.infoValue}>{classData.teacher_name}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t('classDetail.schedule')}:</Text>
                    <Text style={styles.infoValue}>{formattedSchedule}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t('classDetail.duration')}:</Text>
                    <Text style={styles.infoValue}>{classData.duration_minutes} {t('classDetail.min')}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t('classDetail.status')}:</Text>
                    <Text style={styles.infoValue}>{classData.status.toUpperCase()}</Text>
                  </View>
                </Card>

                {attendanceLoading ? (
                  <LoadingState variant="circular" />
                ) : attendance ? (
                  <Card variant="outlined" style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>{t('classDetail.yourAttendance')}</Text>
                    <View style={styles.attendanceInfo}>
                      <Badge
                        value={attendance.status.toUpperCase()}
                        variant={attendance.status === 'present' ? 'success' : attendance.status === 'late' ? 'warning' : 'error'}
                      />
                      <Text style={styles.attendanceTime}>
                        {t('classDetail.markedAt')}: {new Date(attendance.timestamp).toLocaleTimeString()}
                      </Text>
                    </View>
                  </Card>
                ) : null}
              </View>
            )}

            {activeTab === 'doubts' && (
              <View style={styles.doubtsTab}>
                <View style={styles.doubtsHeader}>
                  <Text style={styles.sectionTitle}>{t('classDetail.doubts.title')}</Text>
                  <Button
                    variant="filled"
                    onPress={handleSubmitDoubt}
                    accessibilityLabel="Submit a new doubt"
                  >
                    {t('classDetail.doubts.askQuestion')}
                  </Button>
                </View>

                {doubtsLoading ? (
                  <LoadingState variant="skeleton" />
                ) : doubts.length === 0 ? (
                  <EmptyState
                    icon="help-outline"
                    title={t('classDetail.doubts.emptyTitle')}
                    description={t('classDetail.doubts.emptyDescription')}
                  />
                ) : (
                  doubts.map(doubt => (
                    <Card key={doubt.id} variant="elevated" style={styles.doubtCard}>
                      <View style={styles.doubtHeader}>
                        <Text style={styles.doubtQuestion}>{doubt.question}</Text>
                        <Badge
                          value={doubt.status.toUpperCase()}
                          variant={doubt.status === 'answered' ? 'success' : doubt.status === 'open' ? 'warning' : 'info'}
                        />
                      </View>

                      {doubt.answer && (
                        <View style={styles.answerSection}>
                          <Text style={styles.answerLabel}>{t('classDetail.doubts.answer')}:</Text>
                          <Text style={styles.answerText}>{doubt.answer}</Text>
                          {doubt.teacher_name && (
                            <Text style={styles.teacherName}>- {doubt.teacher_name}</Text>
                          )}
                        </View>
                      )}

                      <Text style={styles.doubtTime}>
                        {t('classDetail.doubts.asked')}: {new Date(doubt.created_at).toLocaleDateString()}
                      </Text>
                    </Card>
                  ))
                )}
              </View>
            )}

            {activeTab === 'resources' && (
              <View style={styles.resourcesTab}>
                <Text style={styles.sectionTitle}>{t('classDetail.resources.title')}</Text>

                {resourcesLoading ? (
                  <LoadingState variant="skeleton" />
                ) : resources.length === 0 ? (
                  <EmptyState
                    icon="folder-open"
                    title={t('classDetail.resources.emptyTitle')}
                    description={t('classDetail.resources.emptyDescription')}
                  />
                ) : (
                  resources.map(resource => (
                    <Card key={resource.id} variant="elevated" style={styles.resourceCard}>
                      <TouchableOpacity
                        onPress={() => handleViewResource(resource)}
                        accessibilityLabel={`View ${resource.type}: ${resource.title}`}
                        accessibilityRole="button"
                      >
                        <View style={styles.resourceHeader}>
                          <Text style={styles.resourceIcon}>
                            {resource.type === 'pdf' ? '📄' : resource.type === 'video' ? '🎥' : '🔗'}
                          </Text>
                          <View style={styles.resourceInfo}>
                            <Text style={styles.resourceTitle}>{resource.title}</Text>
                            {resource.description && (
                              <Text style={styles.resourceDescription}>{resource.description}</Text>
                            )}
                            <Text style={styles.resourceTime}>
                              {t('classDetail.resources.added')}: {new Date(resource.created_at).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Card>
                  ))
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </BaseScreen>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  headerCard: {
    marginBottom: 0,
  },
  headerContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  teacherText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  scheduleText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    lineHeight: 20,
  },
  attendanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    // gap removed - not supported in RN < 0.71
  },
  attendanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginRight: 8, // Replaces gap property
  },
  // Tab Styles
  tabsContainer: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8, // Further reduced
    paddingVertical: 12,
    minHeight: 60,
    flexDirection: 'row',
    width: '100%', // Ensure full width
    alignSelf: 'stretch', // Stretch to full width
  },
  tabButton: {
    flex: 1, // Equal width distribution
    paddingVertical: 10,
    paddingHorizontal: 4, // Minimal padding
    borderRadius: 8,
    marginHorizontal: 2, // Minimal gap
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14, // Reduced to 14 for better fit
    fontWeight: 'bold',
    color: '#666666',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#1976D2',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  overviewTab: {
    // gap removed - not supported in RN < 0.71
    // Use marginBottom on child elements instead
  },
  infoCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  attendanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap removed - not supported in RN < 0.71
  },
  attendanceTime: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 12, // Replaces gap property
  },
  doubtsTab: {
    // gap removed - not supported in RN < 0.71
    // Use marginBottom on child elements instead
  },
  doubtsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  doubtCard: {
    padding: 16,
    marginBottom: 12,
  },
  doubtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  doubtQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 8,
  },
  answerSection: {
    backgroundColor: '#F0F7FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066CC',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 4,
  },
  teacherName: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666666',
  },
  doubtTime: {
    fontSize: 12,
    color: '#999999',
  },
  resourcesTab: {
    // gap removed - not supported in RN < 0.71
    // Use marginBottom on child elements instead
  },
  resourceCard: {
    padding: 16,
    marginBottom: 12,
  },
  resourceHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  resourceIcon: {
    fontSize: 32,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  resourceTime: {
    fontSize: 12,
    color: '#999999',
  },
});

export default ClassDetailScreen;

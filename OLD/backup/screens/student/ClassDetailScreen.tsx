/**
 * ClassDetailScreen - Phase 25.1: Class Detail & Schedule Management
 * Comprehensive class information and management interface
 * Integration with StudentDashboard existing class cards
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  BackHandler,
  ActivityIndicator,
  Linking,
  RefreshControl,
} from 'react-native';
import {
  Appbar,
  Portal,
  Snackbar,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Import existing design system
import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { BorderRadius } from '../../theme/spacing';

// Import Supabase services
import { getClassById } from '../../services/classesService';
import { getStudyMaterialsBySubject } from '../../services/studyMaterialsService';
import { getProfileById } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';

// Navigation types
type ClassDetailParams = {
  classId?: string;
  autoJoin?: boolean;
};

// Mock data structure based on existing dashboard patterns
interface ClassDetails {
  id: string;
  subject: string;
  teacher: {
    name: string;
    avatar: string;
    email: string;
    phone?: string;
  };
  schedule: {
    day: string;
    time: string;
    duration: string;
    room: string;
  };
  status: 'live' | 'upcoming' | 'completed';
  materials: Array<{
    id: string;
    title: string;
    type: 'pdf' | 'video' | 'document';
    size: string;
    uploadDate: string;
  }>;
  recordings: Array<{
    id: string;
    title: string;
    date: string;
    duration: string;
    size: string;
  }>;
  nextClass: {
    date: string;
    time: string;
    topic: string;
  };
}

export const ClassDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: ClassDetailParams }, 'params'>>();
  const { user } = useAuth();

  const classId = route.params?.classId;
  const autoJoin = route.params?.autoJoin;

  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'recordings'>('overview');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Supabase enhancements
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize screen
  useEffect(() => {
    initializeScreen();
    setupBackHandler();

    return cleanup;
  }, [classId]);

  // Auto-join if parameter is set and class is live
  useEffect(() => {
    if (autoJoin && classDetails?.status === 'live' && classDetails?.id) {
      handleJoinLiveClass();
    }
  }, [autoJoin, classDetails?.status, classDetails?.id]);

  // Screen initialization
  const initializeScreen = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!classId) {
        const errorMsg = 'Class ID is required';
        setError(errorMsg);
        showSnackbar(errorMsg);
        setLoading(false);
        return;
      }

      // Fetch class details from Supabase
      const classResult = await getClassById(classId);

      if (!classResult.success || !classResult.data) {
        throw new Error(classResult.error || 'Failed to load class details');
      }

      const classData = classResult.data;

      // Fetch teacher profile
      const teacherResult = await getProfileById(classData.teacher_id);
      const teacherProfile = teacherResult.data;

      // Fetch study materials for this subject
      const materialsResult = await getStudyMaterialsBySubject(classData.subject);
      const materialsData = materialsResult.success ? materialsResult.data || [] : [];

      // Calculate class status based on scheduled_at and duration
      const scheduledTime = new Date(classData.scheduled_at);
      const endTime = new Date(scheduledTime.getTime() + (classData.duration_minutes || 60) * 60000);
      const now = new Date();

      let status: 'live' | 'upcoming' | 'completed' = 'upcoming';
      if (classData.status === 'cancelled') {
        status = 'completed';
      } else if (now >= scheduledTime && now <= endTime) {
        status = 'live';
      } else if (now > endTime) {
        status = 'completed';
      }

      // Format schedule day (extract day of week from scheduled_at)
      const dayOfWeek = scheduledTime.toLocaleDateString('en-US', { weekday: 'long' });
      const scheduleTime = scheduledTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      // Transform materials to UI format
      const transformedMaterials = materialsData.map(material => ({
        id: material.id,
        title: material.title,
        type: (material.type || 'document') as 'pdf' | 'video' | 'document',
        size: material.file_size || 'Unknown size',
        uploadDate: material.created_at ? new Date(material.created_at).toLocaleDateString() : 'Unknown',
      }));

      // Build class details object
      const details: ClassDetails = {
        id: classData.id,
        subject: classData.subject,
        teacher: {
          name: teacherProfile?.full_name || 'Teacher',
          avatar: '👨‍🏫',
          email: teacherProfile?.email || '',
          phone: teacherProfile?.phone || undefined,
        },
        schedule: {
          day: dayOfWeek,
          time: scheduleTime,
          duration: `${classData.duration_minutes || 60} minutes`,
          room: classData.room_id || 'Virtual Room',
        },
        status,
        materials: transformedMaterials,
        recordings: [], // Recordings not implemented yet
        nextClass: {
          date: scheduledTime.toLocaleDateString('en-US'),
          time: scheduleTime,
          topic: classData.title || 'Class Topic',
        },
      };

      setClassDetails(details);
    } catch (error) {
      console.error('Error loading class details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load class details';
      setError(errorMessage);
      showSnackbar(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      await initializeScreen();
    } catch (error) {
      console.error('Error refreshing class details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh class details';
      setError(errorMessage);
      showSnackbar(errorMessage);
    } finally {
      setRefreshing(false);
    }
  }, [initializeScreen]);

  // Back button handler
  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Cleanup code if needed
  }, []);

  const handleMaterialDownload = (materialId: string, title: string) => {
    Alert.alert(
      'Download Material',
      `Download "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: () => {
            showSnackbar('Download started successfully!');
          }
        },
      ]
    );
  };

  const handleRecordingPlay = (recordingId: string, title: string) => {
    Alert.alert(
      'Play Recording',
      `Play "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Play',
          onPress: () => {
            showSnackbar('Opening video player...');
          }
        },
      ]
    );
  };

  const handleJoinLiveClass = () => {
    if (classDetails?.id) {
      navigation.navigate('StudentLiveClass', {
        classId: classDetails.id,
        subject: classDetails.subject
      });
    } else {
      showSnackbar('Unable to join class - class information not available');
    }
  };

  const handleContactTeacher = async () => {
    if (!classDetails?.teacher.email) {
      showSnackbar('Teacher email not available');
      return;
    }

    const subject = encodeURIComponent(`Question about ${classDetails.subject}`);
    const body = encodeURIComponent(`Dear ${classDetails.teacher.name},\n\n`);
    const url = `mailto:${classDetails.teacher.email}?subject=${subject}&body=${body}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        showSnackbar('Opening email app...');
      } else {
        showSnackbar('Unable to open email client');
      }
    } catch (error) {
      console.error('Error opening email:', error);
      showSnackbar('Failed to open email');
    }
  };

  // Show snackbar message
  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }, []);

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Class Status Card */}
      <View style={[styles.card, styles.statusCard]}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusIcon}>
            {classDetails?.status === 'live' ? '🔴' : classDetails?.status === 'upcoming' ? '🟡' : '🟢'}
          </Text>
          <Text style={[styles.statusText, { color: getStatusColor(classDetails?.status || 'completed') }]}>
            {classDetails?.status.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.subjectTitle}>{classDetails?.subject}</Text>
        <Text style={styles.scheduleText}>{classDetails?.schedule.day}</Text>
        <Text style={styles.scheduleText}>{classDetails?.schedule.time}</Text>
      </View>

      {/* Teacher Information Card */}
      <View style={[styles.card, styles.teacherCard]}>
        <Text style={styles.cardTitle}>Teacher Information</Text>
        <View style={styles.teacherInfo}>
          <Text style={styles.teacherAvatar}>{classDetails?.teacher.avatar}</Text>
          <View style={styles.teacherDetails}>
            <Text style={styles.teacherName}>{classDetails?.teacher.name}</Text>
            <Text style={styles.teacherEmail}>{classDetails?.teacher.email}</Text>
            {classDetails?.teacher.phone && (
              <Text style={styles.teacherPhone}>{classDetails?.teacher.phone}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactTeacher}
        >
          <Text style={styles.contactButtonText}>Contact Teacher</Text>
        </TouchableOpacity>
      </View>

      {/* Next Class Information */}
      <View style={[styles.card, styles.nextClassCard]}>
        <Text style={styles.cardTitle}>Next Class</Text>
        <View style={styles.nextClassInfo}>
          <View style={styles.nextClassDetail}>
            <Text style={styles.nextClassLabel}>Date</Text>
            <Text style={styles.nextClassValue}>{classDetails?.nextClass.date}</Text>
          </View>
          <View style={styles.nextClassDetail}>
            <Text style={styles.nextClassLabel}>Time</Text>
            <Text style={styles.nextClassValue}>{classDetails?.nextClass.time}</Text>
          </View>
          <View style={styles.nextClassDetail}>
            <Text style={styles.nextClassLabel}>Topic</Text>
            <Text style={styles.nextClassValue}>{classDetails?.nextClass.topic}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {classDetails?.status === 'live' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.joinButton]}
            onPress={handleJoinLiveClass}
          >
            <Text style={styles.joinButtonText}>🔴 Join Live Class</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.scheduleButton]}
          onPress={() => navigation.navigate('Schedule')}
        >
          <Text style={styles.scheduleButtonText}>📅 View Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMaterials = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Class Materials</Text>
      {classDetails?.materials.map((material) => (
        <TouchableOpacity
          key={material.id}
          style={styles.materialCard}
          onPress={() => handleMaterialDownload(material.id, material.title)}
        >
          <View style={styles.materialInfo}>
            <Text style={styles.materialIcon}>
              {material.type === 'pdf' ? '📄' : material.type === 'video' ? '🎥' : '📝'}
            </Text>
            <View style={styles.materialDetails}>
              <Text style={styles.materialTitle}>{material.title}</Text>
              <Text style={styles.materialMeta}>{material.size} • {material.uploadDate}</Text>
            </View>
          </View>
          <Text style={styles.downloadIcon}>⬇️</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRecordings = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Class Recordings</Text>
      {classDetails?.recordings.map((recording) => (
        <TouchableOpacity
          key={recording.id}
          style={styles.recordingCard}
          onPress={() => handleRecordingPlay(recording.id, recording.title)}
        >
          <View style={styles.recordingInfo}>
            <Text style={styles.recordingIcon}>🎬</Text>
            <View style={styles.recordingDetails}>
              <Text style={styles.recordingTitle}>{recording.title}</Text>
              <Text style={styles.recordingMeta}>
                {recording.date} • {recording.duration} • {recording.size}
              </Text>
            </View>
          </View>
          <Text style={styles.playIcon}>▶️</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return '#EF4444';
      case 'upcoming':
        return '#F59E0B';
      case 'completed':
        return '#10B981';
      default:
        return LightTheme.OnSurfaceVariant;
    }
  };

  // Render loading state
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={LightTheme.Surface} barStyle="dark-content" />
        <Appbar.Header elevated style={{ backgroundColor: LightTheme.Surface }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Class Details" />
        </Appbar.Header>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={LightTheme.Primary} />
          <Text style={styles.loadingText}>Loading class details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render error state
  if (error && !refreshing && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={LightTheme.Surface} barStyle="dark-content" />
        <Appbar.Header elevated style={{ backgroundColor: LightTheme.Surface }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Class Details" />
        </Appbar.Header>

        <View style={styles.loadingContainer}>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>⚠️</Text>
          <Text style={{
            ...Typography.bodyLarge,
            color: LightTheme.Error,
            textAlign: 'center',
            marginBottom: 24,
          }}>
            {error}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: LightTheme.Primary,
              paddingHorizontal: 32,
              paddingVertical: 12,
              borderRadius: 8,
            }}
            onPress={initializeScreen}
          >
            <Text style={{
              ...Typography.labelLarge,
              color: LightTheme.OnPrimary,
            }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={LightTheme.Surface} barStyle="dark-content" />

      <Appbar.Header elevated style={{ backgroundColor: LightTheme.Surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Class Details" />
      </Appbar.Header>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {['overview', 'materials', 'recordings'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[LightTheme.Primary]}
          />
        }
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'materials' && renderMaterials()}
        {activeTab === 'recordings' && renderRecordings()}
      </ScrollView>

      {/* Snackbar for notifications */}
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightTheme.Background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: LightTheme.Surface,
    paddingHorizontal: Spacing.LG,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.OutlineVariant,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.MD,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: LightTheme.Primary,
  },
  tabText: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  activeTabText: {
    color: LightTheme.Primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.XXL,
  },
  tabContent: {
    padding: Spacing.LG,
  },
  card: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.LG,
    marginBottom: Spacing.MD,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statusCard: {
    borderWidth: 2,
    borderColor: LightTheme.PrimaryContainer,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: Spacing.SM,
  },
  statusText: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    fontWeight: '600',
  },
  subjectTitle: {
    fontSize: Typography.headlineSmall.fontSize,
    fontFamily: Typography.headlineSmall.fontFamily,
    fontWeight: Typography.headlineSmall.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.SM,
  },
  scheduleText: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.XS,
  },
  teacherCard: {
    borderLeftWidth: 4,
    borderLeftColor: LightTheme.Secondary,
  },
  cardTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.MD,
  },
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.MD,
  },
  teacherAvatar: {
    fontSize: 40,
    marginRight: Spacing.MD,
  },
  teacherDetails: {
    flex: 1,
  },
  teacherName: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.XS,
  },
  teacherEmail: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.Primary,
    marginBottom: Spacing.XS,
  },
  teacherPhone: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  contactButton: {
    backgroundColor: LightTheme.SecondaryContainer,
    paddingVertical: Spacing.SM,
    paddingHorizontal: Spacing.MD,
    borderRadius: BorderRadius.SM,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: Typography.labelLarge.fontSize,
    fontFamily: Typography.labelLarge.fontFamily,
    fontWeight: Typography.labelLarge.fontWeight,
    color: LightTheme.OnSecondaryContainer,
  },
  nextClassCard: {
    backgroundColor: LightTheme.PrimaryContainer,
  },
  nextClassInfo: {
    gap: Spacing.MD,
  },
  nextClassDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextClassLabel: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnPrimaryContainer,
    fontWeight: '500',
  },
  nextClassValue: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnPrimaryContainer,
  },
  actionButtons: {
    gap: Spacing.MD,
    marginTop: Spacing.MD,
  },
  actionButton: {
    paddingVertical: Spacing.LG,
    paddingHorizontal: Spacing.XL,
    borderRadius: BorderRadius.MD,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  joinButton: {
    backgroundColor: '#EF4444',
  },
  joinButtonText: {
    fontSize: Typography.labelLarge.fontSize,
    fontFamily: Typography.labelLarge.fontFamily,
    fontWeight: Typography.labelLarge.fontWeight,
    color: '#FFFFFF',
  },
  scheduleButton: {
    backgroundColor: LightTheme.Primary,
  },
  scheduleButtonText: {
    fontSize: Typography.labelLarge.fontSize,
    fontFamily: Typography.labelLarge.fontFamily,
    fontWeight: Typography.labelLarge.fontWeight,
    color: LightTheme.OnPrimary,
  },
  sectionTitle: {
    fontSize: Typography.titleLarge.fontSize,
    fontFamily: Typography.titleLarge.fontFamily,
    fontWeight: Typography.titleLarge.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.LG,
  },
  materialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    marginBottom: Spacing.SM,
    borderWidth: 1,
    borderColor: LightTheme.OutlineVariant,
  },
  materialInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  materialIcon: {
    fontSize: 24,
    marginRight: Spacing.MD,
  },
  materialDetails: {
    flex: 1,
  },
  materialTitle: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.XS,
  },
  materialMeta: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  downloadIcon: {
    fontSize: 20,
    color: LightTheme.Primary,
  },
  recordingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    marginBottom: Spacing.SM,
    borderWidth: 1,
    borderColor: LightTheme.OutlineVariant,
  },
  recordingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingIcon: {
    fontSize: 24,
    marginRight: Spacing.MD,
  },
  recordingDetails: {
    flex: 1,
  },
  recordingTitle: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.XS,
  },
  recordingMeta: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  playIcon: {
    fontSize: 20,
    color: LightTheme.Primary,
  },
});

export default ClassDetailScreen;

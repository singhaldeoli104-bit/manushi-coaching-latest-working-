/**
 * ActivityDetailScreen - Phase 26.2: Activity Feed System
 * Comprehensive activity tracking for student engagement
 * Features: Recent submissions, grades, participation, achievements, social activities
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  BackHandler,
  ActivityIndicator,
  Modal,
  Switch,
} from 'react-native';
import { Appbar, Portal, Snackbar } from 'react-native-paper';

import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import * as ActivityFeedService from '../../services/activityFeedService';
import { useAuth } from '../../context/AuthContext';

interface ActivityDetailScreenProps {
  onNavigate: (screen: string) => void;
}

interface Activity {
  id: string;
  type: 'submission' | 'grade' | 'participation' | 'achievement' | 'social' | 'deadline' | 'announcement';
  title: string;
  description: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  status?: 'completed' | 'pending' | 'overdue';
  subject?: string;
  score?: number;
  maxScore?: number;
  actionRequired?: boolean;
  relatedItems?: string[];
}

const ActivityDetailScreen: React.FC<ActivityDetailScreenProps> = ({
  onNavigate,
}) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'submissions' | 'grades' | 'achievements' | 'social'>('all');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Notifications modal state
  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    submissions: true,
    grades: true,
    deadlines: true,
    achievements: true,
    social: true,
    announcements: true,
  });

  // Advanced filters modal state
  const [filtersModalVisible, setFiltersModalVisible] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    priorities: { high: true, medium: true, low: true },
    subjects: { Mathematics: true, Physics: true, Chemistry: true, Biology: true },
    actionRequired: false,
    dateRange: 'all' as 'all' | 'today' | 'week' | 'month',
  });

  // Mock data based on comprehensive activity tracking requirements
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'grade',
      title: 'Mathematics Assignment Graded',
      description: 'Your Calculus Problem Set has been graded. Excellent work on integration techniques!',
      timestamp: '2025-02-02T14:30:00Z',
      priority: 'high',
      subject: 'Mathematics',
      score: 94,
      maxScore: 100,
      status: 'completed',
    },
    {
      id: '2',
      type: 'deadline',
      title: 'Physics Lab Report Due Soon',
      description: 'Your Electromagnetic Waves lab report is due in 2 hours. Submit before the deadline.',
      timestamp: '2025-02-02T12:00:00Z',
      priority: 'high',
      subject: 'Physics',
      actionRequired: true,
      status: 'pending',
    },
    {
      id: '3',
      type: 'achievement',
      title: 'New Achievement Unlocked',
      description: 'Congratulations! You earned the "Math Master" badge for consistent high performance.',
      timestamp: '2025-02-02T10:15:00Z',
      priority: 'medium',
      status: 'completed',
    },
    {
      id: '4',
      type: 'participation',
      title: 'Active in Biology Class',
      description: 'Great participation in today\'s discussion on cellular respiration. Keep it up!',
      timestamp: '2025-02-02T09:00:00Z',
      priority: 'medium',
      subject: 'Biology',
      status: 'completed',
    },
    {
      id: '5',
      type: 'submission',
      title: 'Chemistry Assignment Submitted',
      description: 'Your Organic Chemistry problem set has been successfully submitted.',
      timestamp: '2025-02-01T23:45:00Z',
      priority: 'low',
      subject: 'Chemistry',
      status: 'completed',
    },
    {
      id: '6',
      type: 'social',
      title: 'Study Group Invitation',
      description: 'Sarah invited you to join the Physics study group for the upcoming exam.',
      timestamp: '2025-02-01T18:30:00Z',
      priority: 'medium',
      actionRequired: true,
      status: 'pending',
    },
    {
      id: '7',
      type: 'announcement',
      title: 'Class Schedule Update',
      description: 'Tomorrow\'s Mathematics class has been moved from 10:00 AM to 2:00 PM.',
      timestamp: '2025-02-01T16:20:00Z',
      priority: 'high',
      subject: 'Mathematics',
    },
    {
      id: '8',
      type: 'grade',
      title: 'Quiz Score Available',
      description: 'Your Biology quiz on photosynthesis has been graded.',
      timestamp: '2025-02-01T14:00:00Z',
      priority: 'medium',
      subject: 'Biology',
      score: 87,
      maxScore: 100,
      status: 'completed',
    },
    {
      id: '9',
      type: 'submission',
      title: 'Late Submission Warning',
      description: 'Your Physics assignment was submitted 30 minutes after the deadline.',
      timestamp: '2025-02-01T11:30:00Z',
      priority: 'high',
      subject: 'Physics',
      status: 'overdue',
    },
    {
      id: '10',
      type: 'achievement',
      title: 'Perfect Attendance Streak',
      description: 'You\'ve maintained perfect attendance for 30 days! Keep up the excellent commitment.',
      timestamp: '2025-02-01T08:00:00Z',
      priority: 'medium',
      status: 'completed',
    },
  ];

  // Lifecycle functions
  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }, []);

  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // No modals in this screen
      return false;
    });
    return backHandler;
  }, []);

  const initializeScreen = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await ActivityFeedService.getActivityFeed(user.id);

      if (result.success && result.data) {
        setActivities(result.data.activities);
        showSnackbar('Activities loaded successfully');
      } else {
        showSnackbar(result.error || 'Failed to load activities');
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
      showSnackbar('Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  }, [user, showSnackbar]);

  // Effects
  useEffect(() => {
    const backHandler = setupBackHandler();
    return () => backHandler.remove();
  }, [setupBackHandler]);

  useEffect(() => {
    initializeScreen();
  }, []);

  const onRefresh = async () => {
    if (!user?.id) {
      setRefreshing(false);
      return;
    }

    setRefreshing(true);
    try {
      const result = await ActivityFeedService.getActivityFeed(user.id);

      if (result.success && result.data) {
        setActivities(result.data.activities);
        showSnackbar('Activities refreshed');
      } else {
        showSnackbar(result.error || 'Failed to refresh activities');
      }
    } catch (error) {
      showSnackbar('Failed to refresh activities');
    } finally {
      setRefreshing(false);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission': return '📤';
      case 'grade': return '📊';
      case 'participation': return '🙋';
      case 'achievement': return '🏆';
      case 'social': return '👥';
      case 'deadline': return '⏰';
      case 'announcement': return '📢';
      default: return '📋';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return LightTheme.OnSurfaceVariant;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'overdue': return '#F44336';
      default: return LightTheme.OnSurfaceVariant;
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'submissions') return activity.type === 'submission';
    if (selectedFilter === 'grades') return activity.type === 'grade';
    if (selectedFilter === 'achievements') return activity.type === 'achievement';
    if (selectedFilter === 'social') return activity.type === 'social';
    return true;
  });

  const handleNotificationsPress = () => {
    setNotificationsModalVisible(true);
  };

  const handleFiltersPress = () => {
    setFiltersModalVisible(true);
  };

  const handleToggleNotification = (key: keyof typeof notificationPreferences) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleToggleAdvancedFilter = (category: string, key: string) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [category]: {
        ...(prev[category as keyof typeof prev] as any),
        [key]: !(prev[category as keyof typeof prev] as any)[key],
      },
    }));
  };

  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: '#059669' }}>
      <Appbar.BackAction onPress={() => onNavigate('back')} />
      <Appbar.Content title="Activity Feed" subtitle="Stay updated on your progress" />
      <Appbar.Action icon="bell" onPress={handleNotificationsPress} />
      <Appbar.Action icon="filter" onPress={handleFiltersPress} />
    </Appbar.Header>
  );

  const renderFilterSelector = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterSelector}
      contentContainerStyle={styles.filterSelectorContent}
    >
      {(['all', 'submissions', 'grades', 'achievements', 'social'] as const).map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterButton,
            selectedFilter === filter && styles.filterButtonActive
          ]}
          onPress={() => setSelectedFilter(filter)}
        >
          <Text style={[
            styles.filterButtonText,
            selectedFilter === filter && styles.filterButtonTextActive
          ]}>
            {filter === 'all' ? 'All Activities' :
             filter === 'submissions' ? 'Submissions' :
             filter === 'grades' ? 'Grades' :
             filter === 'achievements' ? 'Achievements' :
             'Social'}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderActivityCard = (activity: Activity) => (
    <TouchableOpacity 
      key={activity.id} 
      style={[
        styles.activityCard,
        activity.actionRequired && styles.activityCardActionRequired
      ]}
      onPress={() => {
        // Navigate to specific activity detail based on type
        if (activity.type === 'grade' || activity.type === 'submission') {
          onNavigate('AssignmentDetail');
        } else if (activity.type === 'achievement') {
          onNavigate('progress-detail');
        } else {
          // Handle other activity types
          console.log(`Navigate to ${activity.type} detail`);
        }
      }}
    >
      <View style={styles.activityHeader}>
        <View style={styles.activityIconContainer}>
          <Text style={styles.activityIcon}>{getActivityIcon(activity.type)}</Text>
          <View style={[
            styles.activityPriorityIndicator,
            { backgroundColor: getPriorityColor(activity.priority) }
          ]} />
        </View>

        <View style={styles.activityContent}>
          <View style={styles.activityTitleRow}>
            <Text style={styles.activityTitle} numberOfLines={2}>
              {activity.title}
            </Text>
            <Text style={styles.activityTime}>{getTimeAgo(activity.timestamp)}</Text>
          </View>

          <Text style={styles.activityDescription} numberOfLines={2}>
            {activity.description}
          </Text>

          <View style={styles.activityMeta}>
            {activity.subject && (
              <View style={styles.activitySubject}>
                <Text style={styles.activitySubjectText}>{activity.subject}</Text>
              </View>
            )}

            {activity.score !== undefined && activity.maxScore && (
              <View style={styles.activityScore}>
                <Text style={[
                  styles.activityScoreText,
                  { color: activity.score >= (activity.maxScore * 0.8) ? '#4CAF50' : '#FF9800' }
                ]}>
                  {activity.score}/{activity.maxScore}
                </Text>
              </View>
            )}

            {activity.status && (
              <View style={[
                styles.activityStatus,
                { backgroundColor: getStatusColor(activity.status) }
              ]}>
                <Text style={styles.activityStatusText}>
                  {activity.status.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          {activity.actionRequired && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                // Handle different action types based on activity type
                if (activity.type === 'deadline') {
                  onNavigate('submit-doubt');
                } else if (activity.type === 'social') {
                  // Handle social actions like study group invites
                  onNavigate('peer-learning');
                } else if (activity.type === 'announcement') {
                  // Handle announcements that require acknowledgment
                  onNavigate('schedule');
                } else {
                  // Default action for other types
                  onNavigate('AssignmentDetail');
                }
              }}
            >
              <Text style={styles.actionButtonText}>Take Action</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📋</Text>
      <Text style={styles.emptyStateTitle}>No Activities</Text>
      <Text style={styles.emptyStateDescription}>
        No activities found for the selected filter. Try selecting a different filter or check back later.
      </Text>
    </View>
  );

  const renderActivityStats = () => {
    const todayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      const today = new Date();
      return activityDate.toDateString() === today.toDateString();
    });

    const pendingActions = activities.filter(activity => activity.actionRequired).length;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{todayActivities.length}</Text>
          <Text style={styles.statLabel}>Today's Activities</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pendingActions}</Text>
          <Text style={styles.statLabel}>Action Required</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{activities.filter(a => a.type === 'achievement').length}</Text>
          <Text style={styles.statLabel}>New Achievements</Text>
        </View>
      </View>
    );
  };

  const renderNotificationsModal = () => (
    <Modal
      visible={notificationsModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setNotificationsModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🔔 Notification Settings</Text>
            <TouchableOpacity onPress={() => setNotificationsModalVisible(false)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSectionTitle}>Activity Types</Text>
            <Text style={styles.modalSectionDescription}>
              Choose which activities you want to be notified about
            </Text>

            {Object.entries(notificationPreferences).map(([key, value]) => (
              <View key={key} style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationLabel}>
                    {key === 'submissions' ? '📤 Submissions' :
                     key === 'grades' ? '📊 Grades' :
                     key === 'deadlines' ? '⏰ Deadlines' :
                     key === 'achievements' ? '🏆 Achievements' :
                     key === 'social' ? '👥 Social' :
                     '📢 Announcements'}
                  </Text>
                  <Text style={styles.notificationDescription}>
                    {key === 'submissions' ? 'Assignment submission confirmations' :
                     key === 'grades' ? 'New grades and feedback' :
                     key === 'deadlines' ? 'Upcoming assignment due dates' :
                     key === 'achievements' ? 'New badges and milestones' :
                     key === 'social' ? 'Study group invites and messages' :
                     'Important class announcements'}
                  </Text>
                </View>
                <Switch
                  value={value}
                  onValueChange={() => handleToggleNotification(key as keyof typeof notificationPreferences)}
                  trackColor={{ false: '#767577', true: '#059669' }}
                  thumbColor={value ? '#FFFFFF' : '#f4f3f4'}
                />
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.modalSaveButton}
            onPress={() => {
              setNotificationsModalVisible(false);
              showSnackbar('Notification preferences saved');
            }}
          >
            <Text style={styles.modalSaveButtonText}>Save Preferences</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderFiltersModal = () => (
    <Modal
      visible={filtersModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setFiltersModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🔍 Advanced Filters</Text>
            <TouchableOpacity onPress={() => setFiltersModalVisible(false)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSectionTitle}>Priority Levels</Text>
            <View style={styles.filterGroup}>
              {Object.entries(advancedFilters.priorities).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.filterChip, value && styles.filterChipActive]}
                  onPress={() => handleToggleAdvancedFilter('priorities', key)}
                >
                  <Text style={[styles.filterChipText, value && styles.filterChipTextActive]}>
                    {key === 'high' ? '🔴 High' : key === 'medium' ? '🟡 Medium' : '🟢 Low'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSectionTitle}>Subjects</Text>
            <View style={styles.filterGroup}>
              {Object.entries(advancedFilters.subjects).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.filterChip, value && styles.filterChipActive]}
                  onPress={() => handleToggleAdvancedFilter('subjects', key)}
                >
                  <Text style={[styles.filterChipText, value && styles.filterChipTextActive]}>
                    {key}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSectionTitle}>Action Required</Text>
            <View style={styles.notificationItem}>
              <Text style={styles.notificationLabel}>Show only items requiring action</Text>
              <Switch
                value={advancedFilters.actionRequired}
                onValueChange={() =>
                  setAdvancedFilters(prev => ({ ...prev, actionRequired: !prev.actionRequired }))
                }
                trackColor={{ false: '#767577', true: '#059669' }}
                thumbColor={advancedFilters.actionRequired ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>

            <Text style={styles.modalSectionTitle}>Date Range</Text>
            <View style={styles.filterGroup}>
              {(['all', 'today', 'week', 'month'] as const).map((range) => (
                <TouchableOpacity
                  key={range}
                  style={[
                    styles.filterChip,
                    advancedFilters.dateRange === range && styles.filterChipActive
                  ]}
                  onPress={() => setAdvancedFilters(prev => ({ ...prev, dateRange: range }))}
                >
                  <Text style={[
                    styles.filterChipText,
                    advancedFilters.dateRange === range && styles.filterChipTextActive
                  ]}>
                    {range === 'all' ? 'All Time' :
                     range === 'today' ? 'Today' :
                     range === 'week' ? 'This Week' :
                     'This Month'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.modalResetButton}
              onPress={() => {
                setAdvancedFilters({
                  priorities: { high: true, medium: true, low: true },
                  subjects: { Mathematics: true, Physics: true, Chemistry: true, Biology: true },
                  actionRequired: false,
                  dateRange: 'all',
                });
                showSnackbar('Filters reset to default');
              }}
            >
              <Text style={styles.modalResetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalApplyButton}
              onPress={() => {
                setFiltersModalVisible(false);
                showSnackbar('Filters applied successfully');
              }}
            >
              <Text style={styles.modalApplyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#059669" />
        {renderAppBar()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading activities...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      {renderAppBar()}
      {renderFilterSelector()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderActivityStats()}

        <View style={styles.activitiesSection}>
          <Text style={styles.sectionTitle}>
            Recent Activities ({filteredActivities.length})
          </Text>

          {filteredActivities.length > 0 ? (
            filteredActivities.map(renderActivityCard)
          ) : (
            renderEmptyState()
          )}
        </View>
      </ScrollView>

      {renderNotificationsModal()}
      {renderFiltersModal()}

      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{
            label: 'Dismiss',
            onPress: () => setSnackbarVisible(false),
          }}
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LightTheme.Background,
    gap: Spacing.MD,
  },
  loadingText: {
    fontSize: Typography.bodyMedium.fontSize,
    color: LightTheme.OnSurfaceVariant,
    marginTop: Spacing.MD,
  },
  filterSelector: {
    paddingVertical: Spacing.XS,
    backgroundColor: LightTheme.Surface,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterSelectorContent: {
    paddingHorizontal: Spacing.MD,
  },
  filterButton: {
    paddingHorizontal: Spacing.SM,
    paddingVertical: Spacing.XS,
    marginRight: Spacing.XS,
    borderRadius: BorderRadius.SM,
    backgroundColor: LightTheme.SurfaceVariant,
  },
  filterButtonActive: {
    backgroundColor: LightTheme.Primary,
  },
  filterButtonText: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  filterButtonTextActive: {
    color: LightTheme.OnPrimary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.XXL,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.XS,
    justifyContent: 'space-between',
    marginBottom: Spacing.SM,
  },
  statCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.SM,
    paddingVertical: Spacing.XS,
    paddingHorizontal: Spacing.SM,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: Spacing.XS / 2,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 1.5,
  },
  statValue: {
    fontSize: Typography.titleSmall.fontSize,
    fontFamily: Typography.titleSmall.fontFamily,
    fontWeight: '700',
    color: LightTheme.Primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
  },
  activitiesSection: {
    paddingHorizontal: Spacing.SM,
  },
  sectionTitle: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    fontWeight: '700',
    color: LightTheme.OnBackground,
    marginBottom: Spacing.SM,
  },
  activityCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.SM,
    paddingVertical: Spacing.XS,
    paddingHorizontal: Spacing.SM,
    marginBottom: Spacing.XS,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 1.5,
  },
  activityCardActionRequired: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  activityHeader: {
    flexDirection: 'row',
  },
  activityIconContainer: {
    position: 'relative',
    marginRight: Spacing.SM,
  },
  activityIcon: {
    fontSize: 18,
  },
  activityPriorityIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activityContent: {
    flex: 1,
  },
  activityTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.XS,
  },
  activityTitle: {
    flex: 1,
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
    marginRight: Spacing.SM,
  },
  activityTime: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  activityDescription: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    lineHeight: Typography.labelSmall.fontSize + 2,
    marginBottom: Spacing.XS,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: Spacing.XS,
    gap: Spacing.XS / 2,
  },
  activitySubject: {
    backgroundColor: LightTheme.SecondaryContainer,
    borderRadius: BorderRadius.SM,
    paddingHorizontal: Spacing.SM,
    paddingVertical: 2,
    marginRight: Spacing.XS,
    marginBottom: 2,
  },
  activitySubjectText: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSecondaryContainer,
  },
  activityScore: {
    backgroundColor: LightTheme.PrimaryContainer,
    borderRadius: BorderRadius.SM,
    paddingHorizontal: Spacing.SM,
    paddingVertical: 2,
    marginRight: Spacing.XS,
    marginBottom: 2,
  },
  activityScoreText: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    fontWeight: '600',
  },
  activityStatus: {
    borderRadius: BorderRadius.SM,
    paddingHorizontal: Spacing.SM,
    paddingVertical: 2,
    marginBottom: Spacing.XS,
  },
  activityStatusText: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButton: {
    backgroundColor: LightTheme.Primary,
    borderRadius: BorderRadius.SM,
    paddingHorizontal: Spacing.SM,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnPrimary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.XXL,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: Spacing.LG,
  },
  emptyStateTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.SM,
  },
  emptyStateDescription: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
    lineHeight: Typography.bodyMedium.lineHeight,
    paddingHorizontal: Spacing.LG,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: LightTheme.Surface,
    borderTopLeftRadius: BorderRadius.XL,
    borderTopRightRadius: BorderRadius.XL,
    maxHeight: '80%',
    paddingBottom: Spacing.LG,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.LG,
    paddingTop: Spacing.LG,
    paddingBottom: Spacing.MD,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.Outline,
  },
  modalTitle: {
    fontSize: Typography.titleLarge.fontSize,
    fontFamily: Typography.titleLarge.fontFamily,
    fontWeight: Typography.titleLarge.fontWeight,
    color: LightTheme.OnSurface,
  },
  modalCloseButton: {
    fontSize: 24,
    color: LightTheme.OnSurfaceVariant,
    paddingHorizontal: Spacing.SM,
  },
  modalContent: {
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
    maxHeight: '65%',
  },
  modalSectionTitle: {
    fontSize: Typography.titleSmall.fontSize,
    fontFamily: Typography.titleSmall.fontFamily,
    fontWeight: Typography.titleSmall.fontWeight,
    color: LightTheme.OnSurface,
    marginTop: Spacing.MD,
    marginBottom: Spacing.SM,
  },
  modalSectionDescription: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.MD,
    lineHeight: Typography.bodyMedium.lineHeight,
  },

  // Notification Modal Styles
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.MD,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.OutlineVariant,
  },
  notificationInfo: {
    flex: 1,
    marginRight: Spacing.MD,
  },
  notificationLabel: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
    marginBottom: Spacing.XS,
  },
  notificationDescription: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    lineHeight: Typography.bodySmall.lineHeight,
  },
  modalSaveButton: {
    backgroundColor: LightTheme.Primary,
    borderRadius: BorderRadius.MD,
    paddingVertical: Spacing.MD,
    marginHorizontal: Spacing.LG,
    marginTop: Spacing.MD,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    fontSize: Typography.labelLarge.fontSize,
    fontFamily: Typography.labelLarge.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnPrimary,
  },

  // Filter Modal Styles
  filterGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.MD,
  },
  filterChip: {
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    marginRight: Spacing.SM,
    marginBottom: Spacing.SM,
    borderRadius: BorderRadius.SM,
    backgroundColor: LightTheme.SurfaceVariant,
    borderWidth: 1,
    borderColor: LightTheme.Outline,
  },
  filterChipActive: {
    backgroundColor: LightTheme.Primary,
    borderColor: LightTheme.Primary,
  },
  filterChipText: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  filterChipTextActive: {
    color: LightTheme.OnPrimary,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.LG,
    marginTop: Spacing.MD,
    gap: Spacing.MD,
  },
  modalResetButton: {
    flex: 1,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: BorderRadius.MD,
    paddingVertical: Spacing.MD,
    alignItems: 'center',
  },
  modalResetButtonText: {
    fontSize: Typography.labelLarge.fontSize,
    fontFamily: Typography.labelLarge.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurfaceVariant,
  },
  modalApplyButton: {
    flex: 2,
    backgroundColor: LightTheme.Primary,
    borderRadius: BorderRadius.MD,
    paddingVertical: Spacing.MD,
    alignItems: 'center',
  },
  modalApplyButtonText: {
    fontSize: Typography.labelLarge.fontSize,
    fontFamily: Typography.labelLarge.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnPrimary,
  },
});

export default ActivityDetailScreen;

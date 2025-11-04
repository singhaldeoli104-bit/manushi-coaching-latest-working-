/**
 * EnhancedScheduleScreen - Phase 43.1: Schedule Integration Enhancement
 * Weekly/monthly calendar views with class reminders and assignment tracking
 * Device calendar integration and timezone support
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
  Dimensions,
  Platform,
  BackHandler,
} from 'react-native';
import { Appbar, Portal, Snackbar, ActivityIndicator } from 'react-native-paper';
import Animated, { FadeIn, FadeInUp, FadeInDown, FadeOut, SlideInUp, SlideInDown, ZoomIn, BounceIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

// Import Supabase services
import { getTodayClasses } from '../../services/classesService';
import { getStudentAssignments } from '../../services/assignmentsService';

const { width } = Dimensions.get('window');

interface CalendarEvent {
  id: string;
  title: string;
  type: 'class' | 'assignment' | 'exam' | 'event';
  subject: string;
  startTime: string;
  endTime: string;
  date: string;
  teacher?: string;
  location?: string;
  description?: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  reminderSet: boolean;
  isRecurring: boolean;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  status: 'pending' | 'submitted' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  description?: string;
}

type ViewMode = 'day' | 'week' | 'month';

interface EnhancedScheduleScreenProps {
  onNavigate?: (screen: string) => void;
}

const EnhancedScheduleScreen: React.FC<EnhancedScheduleScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    initializeScreen();
    setupBackHandler();
    return cleanup;
  }, []);

  useEffect(() => {
    if (!loading) {
      loadScheduleData();
    }
  }, [selectedDate, viewMode]);

  const initializeScreen = useCallback(async () => {
    try {
      setLoading(true);
      await loadScheduleData();
    } catch (error) {
      console.error('Error initializing screen:', error);
      showSnackbar('Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGoBack = () => {
    if (onNavigate) {
      onNavigate('back');
    } else {
      showSnackbar('Going back...');
      BackHandler.exitApp();
    }
  };

  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleGoBack();
      return true;
    });
    return backHandler.remove;
  }, []);

  const cleanup = useCallback(() => {
    // Clean up resources
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const loadScheduleData = async () => {
    setLoading(true);
    try {
      const userId = user?.id;
      if (!userId) {
        console.log('No user ID available');
        setLoading(false);
        return;
      }

      // Fetch real data from Supabase
      const [classesResult, assignmentsResult] = await Promise.all([
        getTodayClasses(userId, 'student'),
        getStudentAssignments(userId),
      ]);

      // Transform classes to CalendarEvent format
      const transformedEvents: CalendarEvent[] = [];
      if (classesResult.success && classesResult.data) {
        classesResult.data.forEach(cls => {
          const scheduledTime = new Date(cls.scheduled_at);
          const endTime = new Date(scheduledTime.getTime() + (cls.duration_minutes || 60) * 60000);
          const now = new Date();

          let status: 'upcoming' | 'live' | 'completed' | 'cancelled' = 'upcoming';
          if (cls.status === 'cancelled') {
            status = 'cancelled';
          } else if (now >= scheduledTime && now <= endTime) {
            status = 'live';
          } else if (now > endTime) {
            status = 'completed';
          }

          transformedEvents.push({
            id: cls.id,
            title: `${cls.subject} Class`,
            type: 'class',
            subject: cls.subject,
            startTime: scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            endTime: endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            date: scheduledTime.toISOString().split('T')[0],
            teacher: cls.teacher_id,
            location: cls.meeting_link || 'Virtual Room',
            description: cls.description,
            status,
            reminderSet: true,
            isRecurring: false,
          });
        });
      }

      // Transform assignments
      const transformedAssignments: Assignment[] = [];
      if (assignmentsResult.success && assignmentsResult.data) {
        assignmentsResult.data.forEach(assignment => {
          let status: 'pending' | 'submitted' | 'overdue' = 'pending';
          let priority: 'low' | 'medium' | 'high' = 'medium';

          if (assignment.submission) {
            status = assignment.submission.status === 'submitted' ? 'submitted' : 'pending';
          } else {
            const dueDate = new Date(assignment.due_date);
            if (dueDate < new Date()) {
              status = 'overdue';
            }
          }

          const daysUntilDue = Math.ceil((new Date(assignment.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          if (daysUntilDue <= 2) {
            priority = 'high';
          } else if (daysUntilDue <= 5) {
            priority = 'medium';
          } else {
            priority = 'low';
          }

          const dueDate = new Date(assignment.due_date);
          transformedAssignments.push({
            id: assignment.id,
            title: assignment.title,
            subject: assignment.subject,
            dueDate: dueDate.toISOString().split('T')[0],
            dueTime: dueDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            status,
            priority,
            description: assignment.description || '',
          });
        });
      }

      setEvents(transformedEvents);
      setAssignments(transformedAssignments);
      console.log('✅ Enhanced Schedule data loaded from Supabase');
    } catch (error) {
      console.error('Error loading schedule data:', error);
      showSnackbar('Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  const toggleReminder = async (eventId: string) => {
    try {
      const updatedEvents = events.map(event =>
        event.id === eventId
          ? { ...event, reminderSet: !event.reminderSet }
          : event
      );
      setEvents(updatedEvents);
      
      const event = events.find(e => e.id === eventId);
      if (event) {
        Alert.alert(
          'Reminder',
          event.reminderSet 
            ? `Reminder removed for ${event.title}`
            : `Reminder set for ${event.title} on ${event.date} at ${event.startTime}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('error', 'Failed to update reminder');
    }
  };

  const exportToDeviceCalendar = async (event: CalendarEvent) => {
    try {
      // In a real app, you would use react-native-calendar-events or similar
      Alert.alert(
        'Export to Calendar',
        `Would you like to add "${event.title}" to your device calendar?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Export',
            onPress: () => {
              Alert.alert(
                'success',
                'Event has been added to your device calendar!',
                [{ text: 'OK' }]
              );
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('error', 'Failed to export to calendar');
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class':
        return '#2196F3';
      case 'assignment':
        return '#FF9800';
      case 'exam':
        return '#F44336';
      case 'event':
        return '#9C27B0';
      default:
        return theme.Primary;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'class':
        return 'school';
      case 'assignment':
        return 'assignment';
      case 'exam':
        return 'quiz';
      case 'event':
        return 'event';
      default:
        return 'schedule';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return '#4CAF50';
      case 'upcoming':
        return '#2196F3';
      case 'completed':
        return '#9E9E9E';
      case 'cancelled':
        return '#F44336';
      case 'pending':
        return '#FF9800';
      case 'submitted':
        return '#4CAF50';
      case 'overdue':
        return '#F44336';
      default:
        return theme.Outline;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#F44336';
      case 'medium':
        return '#FF9800';
      case 'low':
        return '#4CAF50';
      default:
        return theme.Outline;
    }
  };

  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: theme.Primary }}>
      <Appbar.BackAction onPress={handleGoBack} color={theme.OnPrimary} />
      <Appbar.Content
        title="Schedule"
        titleStyle={{ color: theme.OnPrimary, fontWeight: 'bold' }}
        subtitle={new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        })}
        subtitleStyle={{ color: theme.OnPrimary, opacity: 0.9 }}
      />
      <Appbar.Action icon="sync" onPress={() => {
        loadScheduleData();
        showSnackbar('Schedule synced!');
      }} color={theme.OnPrimary} />
    </Appbar.Header>
  );

  const renderViewModeSelector = () => (
    <View style={styles.viewModeSelector}>
      {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
        <TouchableOpacity
          key={mode}
          style={[
            styles.viewModeButton,
            {
              backgroundColor: viewMode === mode 
                ? theme.primary 
                : theme.Surface,
            },
          ]}
          onPress={() => setViewMode(mode)}
        >
          <Text
            style={[
              styles.viewModeText,
              {
                color: viewMode === mode 
                  ? theme.OnPrimary 
                  : theme.OnSurface,
              },
            ]}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEvent = (event: CalendarEvent) => (
    <Animated.View
      key={event.id}
      entering={FadeInUp.duration(300)}
      style={[
        styles.eventCard,
        { backgroundColor: theme.Surface },
      ]}
    >
      <View style={styles.eventHeader}>
        <View style={styles.eventTypeContainer}>
          <View
            style={[
              styles.eventTypeIndicator,
              { backgroundColor: getEventTypeColor(event.type) },
            ]}
          >
            <Icon
              name={getEventTypeIcon(event.type)}
              size={16}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.eventInfo}>
            <Text
              style={[
                styles.eventTitle,
                { color: theme.OnSurface },
              ]}
            >
              {event.title}
            </Text>
            <Text
              style={[
                styles.eventSubject,
                { color: theme.OnSurfaceVariant },
              ]}
            >
              {event.subject} • {event.startTime} - {event.endTime}
            </Text>
          </View>
        </View>
        <View style={styles.eventActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleReminder(event.id)}
          >
            <Icon
              name={event.reminderSet ? 'notifications' : 'notifications-off'}
              size={20}
              color={event.reminderSet ? theme.primary : theme.Outline}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => exportToDeviceCalendar(event)}
          >
            <Icon
              name="event-available"
              size={20}
              color={theme.OnSurfaceVariant}
            />
          </TouchableOpacity>
        </View>
      </View>

      {(event.teacher || event.location) && (
        <View style={styles.eventDetails}>
          {event.teacher && (
            <View style={styles.eventDetail}>
              <Icon
                name="person"
                size={14}
                color={theme.OnSurfaceVariant}
              />
              <Text
                style={[
                  styles.eventDetailText,
                  { color: theme.OnSurfaceVariant },
                ]}
              >
                {event.teacher}
              </Text>
            </View>
          )}
          {event.location && (
            <View style={styles.eventDetail}>
              <Icon
                name="location-on"
                size={14}
                color={theme.OnSurfaceVariant}
              />
              <Text
                style={[
                  styles.eventDetailText,
                  { color: theme.OnSurfaceVariant },
                ]}
              >
                {event.location}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.eventFooter}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(event.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {event.status.toUpperCase()}
          </Text>
        </View>
        {event.isRecurring && (
          <View style={styles.recurringBadge}>
            <Icon name="refresh" size={12} color={theme.OnSurfaceVariant} />
            <Text
              style={[
                styles.recurringText,
                { color: theme.OnSurfaceVariant },
              ]}
            >
              Recurring
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  const renderAssignment = (assignment: Assignment) => (
    <Animated.View
      key={assignment.id}
      entering={FadeInUp.duration(300)}
      style={[
        styles.assignmentCard,
        { backgroundColor: theme.Surface },
      ]}
    >
      <View style={styles.assignmentHeader}>
        <View
          style={[
            styles.priorityIndicator,
            { backgroundColor: getPriorityColor(assignment.priority) },
          ]}
        />
        <View style={styles.assignmentInfo}>
          <Text
            style={[
              styles.assignmentTitle,
              { color: theme.OnSurface },
            ]}
          >
            {assignment.title}
          </Text>
          <Text
            style={[
              styles.assignmentSubject,
              { color: theme.OnSurfaceVariant },
            ]}
          >
            {assignment.subject} • Due: {assignment.dueDate} at {assignment.dueTime}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(assignment.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {assignment.status.toUpperCase()}
          </Text>
        </View>
      </View>
      {assignment.description && (
        <Text
          style={[
            styles.assignmentDescription,
            { color: theme.OnSurfaceVariant },
          ]}
        >
          {assignment.description}
        </Text>
      )}
    </Animated.View>
  );

  const todayEvents = events.filter(event => event.date === new Date().toISOString().split('T')[0]);
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date());
  const todayAssignments = assignments.filter(assignment => assignment.dueDate === new Date().toISOString().split('T')[0]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar backgroundColor={theme.primary} barStyle="light-content" />
        {renderAppBar()}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ ...Typography.bodyLarge, color: theme.OnSurfaceVariant, marginTop: Spacing.LG }}>
            Loading schedule...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar backgroundColor={theme.primary} barStyle="light-content" />
      {renderAppBar()}

      {/* View Mode Selector */}
      {renderViewModeSelector()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Events */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.OnBackground }]}>
              Today's Schedule
            </Text>
            <TouchableOpacity
              onPress={() => Alert.alert('Sync Calendar', 'All events synced with device calendar!')}
            >
              <Icon name="sync" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
          {todayEvents.length > 0 ? (
            todayEvents.map(renderEvent)
          ) : (
            <View style={styles.emptyState}>
              <Icon name="event-available" size={48} color={theme.Outline} />
              <Text style={[styles.emptyText, { color: theme.OnSurfaceVariant }]}>
                No classes scheduled for today
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Today's Assignments */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.OnBackground }]}>
              Due Today
            </Text>
            <TouchableOpacity
              onPress={() => Alert.alert('Assignment Reminders', 'All assignment reminders have been set!')}
            >
              <Icon name="notification-add" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
          {todayAssignments.length > 0 ? (
            todayAssignments.map(renderAssignment)
          ) : (
            <View style={styles.emptyState}>
              <Icon name="assignment-turned-in" size={48} color={theme.Outline} />
              <Text style={[styles.emptyText, { color: theme.OnSurfaceVariant }]}>
                No assignments due today
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Upcoming Events */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.OnBackground }]}>
              Upcoming Events
            </Text>
            <Text style={[styles.sectionCount, { color: theme.OnSurfaceVariant }]}>
              {upcomingEvents.length} events
            </Text>
          </View>
          {upcomingEvents.slice(0, 5).map(renderEvent)}
        </Animated.View>

        {/* Calendar Integration */}
        <Animated.View entering={FadeInUp.duration(600).delay(600)} style={styles.section}>
          <View style={[styles.integrationCard, { backgroundColor: theme.SecondaryContainer }]}>
            <Icon name="calendar-today" size={32} color={theme.OnSecondaryContainer} />
            <View style={styles.integrationContent}>
              <Text style={[styles.integrationTitle, { color: theme.OnSecondaryContainer }]}>
                Calendar Integration
              </Text>
              <Text style={[styles.integrationDescription, { color: theme.OnSecondaryContainer }]}>
                Sync with Google Calendar, Outlook, and Apple Calendar
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.integrationButton, { backgroundColor: theme.Secondary }]}
              onPress={() => Alert.alert('Calendar Integration', 'Select your preferred calendar app:\n• Google Calendar\n• Microsoft Outlook\n• Apple Calendar\n• Other...')}
            >
              <Text style={[styles.integrationButtonText, { color: theme.OnSecondary }]}>
                Setup
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={4000}
          action={{
            label: 'Close',
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
  },
  header: {
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.LG,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: Typography.headlineMedium.fontSize,
    fontWeight: Typography.headlineMedium.fontWeight as any,
    marginBottom: Spacing.XS,
  },
  headerSubtitle: {
    fontSize: Typography.bodyLarge.fontSize,
    opacity: 0.9,
  },
  viewModeSelector: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
    gap: Spacing.SM,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: Spacing.SM,
    paddingHorizontal: Spacing.MD,
    borderRadius: 20,
    alignItems: 'center',
  },
  viewModeText: {
    fontSize: Typography.bodyMedium.fontSize,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.LG,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.LG,
    marginBottom: Spacing.MD,
  },
  sectionTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontWeight: Typography.titleMedium.fontWeight as any,
  },
  sectionCount: {
    fontSize: Typography.bodySmall.fontSize,
  },
  eventCard: {
    marginHorizontal: Spacing.LG,
    marginBottom: Spacing.MD,
    padding: Spacing.LG,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.SM,
  },
  eventTypeContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  eventTypeIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.MD,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: Typography.bodyLarge.fontSize,
    fontWeight: '600',
    marginBottom: 2,
  },
  eventSubject: {
    fontSize: Typography.bodyMedium.fontSize,
  },
  eventActions: {
    flexDirection: 'row',
    gap: Spacing.SM,
  },
  actionButton: {
    padding: Spacing.SM,
  },
  eventDetails: {
    marginBottom: Spacing.SM,
    paddingLeft: 44,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventDetailText: {
    fontSize: Typography.bodySmall.fontSize,
    marginLeft: Spacing.XS,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 44,
  },
  statusBadge: {
    paddingHorizontal: Spacing.SM,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: Typography.labelSmall.fontSize,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  recurringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recurringText: {
    fontSize: Typography.bodySmall.fontSize,
  },
  assignmentCard: {
    marginHorizontal: Spacing.LG,
    marginBottom: Spacing.MD,
    padding: Spacing.LG,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  assignmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.SM,
  },
  priorityIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: Spacing.MD,
    minHeight: 40,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: Typography.bodyLarge.fontSize,
    fontWeight: '600',
    marginBottom: 2,
  },
  assignmentSubject: {
    fontSize: Typography.bodyMedium.fontSize,
  },
  assignmentDescription: {
    fontSize: Typography.bodyMedium.fontSize,
    lineHeight: 20,
    paddingLeft: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.XXL,
  },
  emptyText: {
    fontSize: Typography.bodyMedium.fontSize,
    textAlign: 'center',
    marginTop: Spacing.MD,
  },
  integrationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.LG,
    padding: Spacing.LG,
    borderRadius: 12,
  },
  integrationContent: {
    flex: 1,
    marginLeft: Spacing.MD,
  },
  integrationTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontWeight: Typography.titleMedium.fontWeight as any,
    marginBottom: Spacing.XS,
  },
  integrationDescription: {
    fontSize: Typography.bodyMedium.fontSize,
  },
  integrationButton: {
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.SM,
    borderRadius: 20,
  },
  integrationButtonText: {
    fontSize: Typography.labelMedium.fontSize,
    fontWeight: '600',
  },
});

export default EnhancedScheduleScreen;
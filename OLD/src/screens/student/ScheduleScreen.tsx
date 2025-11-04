/**
 * ScheduleScreen - Premium Minimal Design
 * 
 * Modern, minimal schedule screen inspired by MS Teams & Google Calendar
 * - Single compact header (56dp)
 * - Horizontal week strip with subtle dots
 * - Clean timeline view
 * - Floating action button
 * - Bottom sheet filters
 */

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Animated,
  FlatList
} from 'react-native';
import { 
  Portal,
  FAB,
  Chip,
  Snackbar,
  Surface,
  IconButton,
  Badge
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from '@react-native-community/blur';

// Components
import { BaseScreen } from '../../shared/components/BaseScreen';

// Hooks & Utils
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';

// Services
import { getClassesByDateRange } from '../../services/classesService';
import { getStudentAssignments } from '../../services/assignmentsService';
import {
  createClassEvent,
  createStudyBlock,
  exportScheduleData
} from '../../services/scheduleService';

// Types
interface ClassEvent {
  id: string;
  title: string;
  subtitle: string;
  startTime: Date;
  endTime: Date;
  type: 'class' | 'assignment' | 'exam' | 'reminder';
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  color: string;
  location?: string;
  isOnline: boolean;
  hasJoinButton?: boolean;
  metadata?: any;
}

interface DaySchedule {
  date: Date;
  isToday: boolean;
  isPast: boolean;
  events: ClassEvent[];
  hasDeadline: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ScheduleScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { theme } = useTheme();

  // State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [scheduleData, setScheduleData] = useState<Map<string, DaySchedule>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'week' | '3day'>('day');
  const [fabOpen, setFabOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const scrollY = new Animated.Value(0);

  // Animations
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  // Load data
  const loadScheduleData = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      if (!user?.id) return;

      const [classesResult, assignmentsResult] = await Promise.all([
        getClassesByDateRange(user.id, 'student', startDate, endDate),
        getStudentAssignments(user.id),
      ]);

      const newScheduleData = new Map<string, DaySchedule>();
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0];
        const dayEvents: ClassEvent[] = [];

        // Process classes
        if (classesResult.success && classesResult.data) {
          const dayClasses = classesResult.data.filter(cls => {
            const classDate = new Date(cls.scheduled_at).toISOString().split('T')[0];
            return classDate === dateKey;
          });

          dayClasses.forEach(cls => {
            const startTime = new Date(cls.scheduled_at);
            const endTime = new Date(startTime.getTime() + (cls.duration_minutes || 60) * 60000);
            const now = new Date();
            
            let status: 'upcoming' | 'live' | 'completed' | 'cancelled' = 'upcoming';
            if (cls.status === 'cancelled') {
              status = 'cancelled';
            } else if (now >= startTime && now <= endTime) {
              status = 'live';
            } else if (now > endTime) {
              status = 'completed';
            }

            dayEvents.push({
              id: cls.id,
              title: cls.subject,
              subtitle: cls.teacher_name || 'Teacher',
              startTime,
              endTime,
              type: 'class',
              status,
              priority: 'medium',
              color: getSubjectColor(cls.subject),
              location: cls.meeting_link ? 'Online' : cls.location || 'Room 101',
              isOnline: !!cls.meeting_link,
              hasJoinButton: status === 'live' && !!cls.meeting_link,
              metadata: cls,
            });
          });
        }

        // Process assignments
        if (assignmentsResult.success && assignmentsResult.data) {
          const dayAssignments = assignmentsResult.data.filter(assignment => {
            const dueDate = new Date(assignment.due_date).toISOString().split('T')[0];
            return dueDate === dateKey;
          });

          dayAssignments.forEach(assignment => {
            const dueTime = new Date(assignment.due_date);
            const daysUntilDue = Math.ceil((dueTime.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            let priority: 'low' | 'medium' | 'high' = 'low';
            if (daysUntilDue <= 1) priority = 'high';
            else if (daysUntilDue <= 3) priority = 'medium';

            dayEvents.push({
              id: `assignment-${assignment.id}`,
              title: assignment.title,
              subtitle: `Due: ${dueTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
              startTime: dueTime,
              endTime: dueTime,
              type: 'assignment',
              status: assignment.submission ? 'completed' : 'upcoming',
              priority,
              color: priority === 'high' ? theme.Error : priority === 'medium' ? theme.Warning : theme.Success,
              isOnline: true,
              metadata: assignment,
            });
          });
        }

        // Sort events by time
        dayEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

        newScheduleData.set(dateKey, {
          date: new Date(currentDate),
          isToday: dateKey === new Date().toISOString().split('T')[0],
          isPast: currentDate < new Date(new Date().setHours(0, 0, 0, 0)),
          events: dayEvents,
          hasDeadline: dayEvents.some(e => e.type === 'assignment' && e.status === 'upcoming'),
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      setScheduleData(newScheduleData);
    } catch (error) {
      console.error('Error loading schedule:', error);
      setSnackbarMessage('Failed to load schedule');
    }
  }, [user?.id, theme]);

  // Initialize week
  const initializeWeek = useCallback((centerDate: Date) => {
    const week: Date[] = [];
    const startOfWeek = new Date(centerDate);
    startOfWeek.setDate(centerDate.getDate() - centerDate.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }

    setCurrentWeek(week);

    // Load data for the week plus buffer days
    const startDate = new Date(week[0]);
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date(week[6]);
    endDate.setDate(endDate.getDate() + 7);

    loadScheduleData(startDate, endDate);
  }, [loadScheduleData]);

  // Effects
  useEffect(() => {
    trackScreenView('ScheduleScreen', { viewMode, userId: user?.id });
    initializeWeek(new Date());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      // Refresh live status every minute
      setScheduleData(prev => new Map(prev));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Handlers
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    trackAction('select_date', 'ScheduleScreen', { 
      date: date.toISOString(),
      viewMode 
    });

    // If selecting a date outside current week, load new week
    const weekStart = currentWeek[0];
    const weekEnd = currentWeek[6];
    if (date < weekStart || date > weekEnd) {
      initializeWeek(date);
    }
  }, [currentWeek, viewMode]);

  const handleEventPress = useCallback((event: ClassEvent) => {
    trackAction('event_press', 'ScheduleScreen', {
      eventId: event.id,
      type: event.type,
      status: event.status,
    });

    if (event.type === 'assignment') {
      safeNavigate('AssignmentDetail', {
        assignmentId: event.metadata?.id,
        studentId: user?.id || ''
      });
    } else if (event.type === 'class') {
      if (event.status === 'live' && event.hasJoinButton) {
        // Navigate to live class screen
        navigation.navigate('LiveClass' as any, {
          classId: event.id,
          meetingLink: event.metadata?.meeting_link
        });
      } else {
        safeNavigate('ClassDetail', {
          classId: event.id
        });
      }
    }
  }, [navigation, user?.id]);

  const handleJoinClass = useCallback((event: ClassEvent) => {
    trackAction('join_class', 'ScheduleScreen', { eventId: event.id });
    // Navigate to live class screen
    navigation.navigate('LiveClass' as any, {
      classId: event.id,
      meetingLink: event.metadata?.meeting_link
    });
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await initializeWeek(selectedDate);
    setIsRefreshing(false);
  }, [selectedDate, initializeWeek]);

  const handleViewModeChange = useCallback((mode: 'day' | 'week' | '3day') => {
    setViewMode(mode);
    trackAction('change_view_mode', 'ScheduleScreen', { mode });
  }, []);

  // FAB Handlers - Insert to Supabase
  const handleAddEvent = useCallback(async () => {
    if (!user?.id) {
      setSnackbarMessage('User not logged in');
      return;
    }

    trackAction('add_event_click', 'ScheduleScreen', {});

    // Create a quick demo class event for testing
    const scheduledTime = new Date(selectedDate);
    scheduledTime.setHours(14, 0, 0, 0); // 2:00 PM

    const result = await createClassEvent({
      studentId: user.id,
      subject: 'Mathematics',
      title: 'Quick Study Session',
      description: 'Added from Schedule Screen',
      scheduledAt: scheduledTime,
      durationMinutes: 60,
      teacherName: 'Teacher',
      location: 'Online',
    });

    if (result.success) {
      setSnackbarMessage('✓ Class event created successfully!');
      // Reload schedule data
      await handleRefresh();
    } else {
      setSnackbarMessage(`✗ Failed: ${result.error}`);
    }

    setFabOpen(false);
  }, [user?.id, selectedDate, handleRefresh]);

  const handleAddStudyBlock = useCallback(async () => {
    if (!user?.id) {
      setSnackbarMessage('User not logged in');
      return;
    }

    trackAction('add_study_block_click', 'ScheduleScreen', {});

    const result = await createStudyBlock({
      studentId: user.id,
      title: 'Study Session - Mathematics',
      description: 'Created from Schedule Screen',
      subject: 'Mathematics',
      durationMinutes: 90,
      topics: ['Algebra', 'Calculus'],
    });

    if (result.success) {
      setSnackbarMessage('✓ Study block created successfully!');
      // Reload schedule data
      await handleRefresh();
    } else {
      setSnackbarMessage(`✗ Failed: ${result.error}`);
    }

    setFabOpen(false);
  }, [user?.id, handleRefresh]);

  const handleExportSchedule = useCallback(async () => {
    if (!user?.id) {
      setSnackbarMessage('User not logged in');
      return;
    }

    if (!currentWeek || currentWeek.length < 7) {
      setSnackbarMessage('Week data not loaded');
      return;
    }

    trackAction('export_schedule_click', 'ScheduleScreen', {});

    // Export current week's data
    const startDate = currentWeek[0];
    const endDate = currentWeek[6];

    const result = await exportScheduleData({
      studentId: user.id,
      startDate,
      endDate,
    });

    if (result.success && result.data) {
      // In a real app, this would trigger a download
      // For now, we'll just log it and show success
      console.log('Exported Schedule Data:', JSON.stringify(result.data, null, 2));
      setSnackbarMessage(`✓ Exported ${result.data.summary.totalClasses} classes, ${result.data.summary.totalAssignments} assignments!`);
    } else {
      setSnackbarMessage(`✗ Export failed: ${result.error}`);
    }

    setFabOpen(false);
  }, [user?.id, currentWeek]);

  // Get subject color
  const getSubjectColor = (subject: string): string => {
    const colors: Record<string, string> = {
      'Mathematics': '#6366F1',
      'Physics': '#10B981',
      'Chemistry': '#F59E0B',
      'Biology': '#EF4444',
      'English': '#8B5CF6',
      'History': '#F97316',
      'Computer Science': '#06B6D4',
    };
    return colors[subject] || theme.Primary;
  };

  // Render week strip
  const renderWeekStrip = () => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const selectedDayData = scheduleData.get(dateKey);

    return (
      <View style={[styles.weekStrip, { backgroundColor: theme.Surface }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekStripContent}
        >
          {currentWeek.map((date) => {
            const dayKey = date.toISOString().split('T')[0];
            const dayData = scheduleData.get(dayKey);
            const isSelected = dayKey === dateKey;
            const isToday = dayKey === new Date().toISOString().split('T')[0];
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <TouchableOpacity
                key={dayKey}
                style={[
                  styles.dayItem,
                  isSelected && styles.dayItemSelected,
                  isToday && styles.dayItemToday,
                  { borderColor: isSelected ? theme.Primary : 'transparent' },
                ]}
                onPress={() => handleDateSelect(date)}
                activeOpacity={0.7}
                accessibilityLabel={`${date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}, ${isToday ? 'Today, ' : ''}${dayData?.events.length || 0} events`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text 
                  style={[
                    styles.dayLabel,
                    isSelected && styles.dayLabelSelected,
                    isPast && styles.dayLabelPast,
                    { color: isSelected ? theme.Primary : isPast ? theme.OnSurfaceVariant : theme.OnSurface },
                  ]}
                >
                  {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                </Text>
                <Text 
                  style={[
                    styles.dayNumber,
                    isSelected && styles.dayNumberSelected,
                    isToday && styles.dayNumberToday,
                    isPast && styles.dayNumberPast,
                    { color: isSelected ? theme.Primary : isToday ? theme.Primary : isPast ? theme.OnSurfaceVariant : theme.OnSurface },
                  ]}
                >
                  {date.getDate()}
                </Text>
                
                {/* Event indicators */}
                {dayData && dayData.events.length > 0 && (
                  <View style={styles.dayIndicators}>
                    {dayData.hasDeadline && (
                      <View style={[styles.dayDot, { backgroundColor: theme.Error }]} />
                    )}
                    {dayData.events.some(e => e.type === 'class') && (
                      <View style={[styles.dayDot, { backgroundColor: theme.Primary }]} />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // Render timeline event
  const renderTimelineEvent = ({ item }: { item: ClassEvent }) => {
    const isLive = item.status === 'live';
    const isPast = item.status === 'completed';
    const isCancelled = item.status === 'cancelled';

    return (
      <TouchableOpacity
        style={[
          styles.timelineEvent,
          isLive && styles.timelineEventLive,
          isPast && styles.timelineEventPast,
          isCancelled && styles.timelineEventCancelled,
          { 
            backgroundColor: theme.Surface,
            borderLeftColor: item.color,
          },
        ]}
        onPress={() => handleEventPress(item)}
        activeOpacity={0.8}
        accessibilityLabel={`${item.title}, ${item.subtitle}, ${item.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
        accessibilityRole="button"
        accessibilityHint={isLive ? "Double tap to join live class" : "Double tap to view details"}
      >
        <View style={styles.timelineTime}>
          <Text style={[styles.timelineTimeText, { color: theme.OnSurfaceVariant }]}>
            {item.startTime.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })}
          </Text>
          {item.startTime !== item.endTime && (
            <Text style={[styles.timelineTimeEnd, { color: theme.OnSurfaceVariant }]}>
              {item.endTime.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              })}
            </Text>
          )}
        </View>

        <View style={styles.timelineContent}>
          <View style={styles.timelineHeader}>
            <Text 
              style={[
                styles.timelineTitle,
                isCancelled && styles.timelineTitleCancelled,
                { color: isCancelled ? theme.OnSurfaceVariant : theme.OnSurface },
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {isLive && (
              <View style={[styles.liveBadge, { backgroundColor: theme.Error }]}>
                <Text style={[styles.liveBadgeText, { color: theme.OnError }]}>LIVE</Text>
              </View>
            )}
            {item.priority === 'high' && item.type === 'assignment' && !isPast && (
              <Icon name="alert-circle" size={18} color={theme.Error} />
            )}
          </View>

          <Text style={[styles.timelineSubtitle, { color: theme.OnSurfaceVariant }]} numberOfLines={1}>
            {item.subtitle}
          </Text>

          <View style={styles.timelineFooter}>
            {item.location && (
              <View style={styles.timelineLocation}>
                <Icon 
                  name={item.isOnline ? "video-outline" : "map-marker-outline"} 
                  size={14} 
                  color={theme.OnSurfaceVariant} 
                />
                <Text style={[styles.timelineLocationText, { color: theme.OnSurfaceVariant }]}>
                  {item.location}
                </Text>
              </View>
            )}

            {item.hasJoinButton && (
              <TouchableOpacity
                style={[styles.joinButton, { backgroundColor: theme.Primary }]}
                onPress={() => handleJoinClass(item)}
                accessibilityLabel="Join live class"
                accessibilityRole="button"
              >
                <Text style={[styles.joinButtonText, { color: theme.OnPrimary }]}>Join</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render day timeline
  const renderDayTimeline = () => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const dayData = scheduleData.get(dateKey);

    if (!dayData || dayData.events.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name="calendar-blank-outline" size={64} color={theme.OnSurfaceVariant} />
          <Text style={[styles.emptyStateTitle, { color: theme.OnSurface }]}>
            No Events Scheduled
          </Text>
          <Text style={[styles.emptyStateSubtitle, { color: theme.OnSurfaceVariant }]}>
            {dayData?.isPast ? 'No events were scheduled for this day' : 'You have a free day!'}
          </Text>
        </View>
      );
    }

    // Group events by hour for better visual organization
    const eventsByHour = new Map<number, ClassEvent[]>();
    dayData.events.forEach(event => {
      const hour = event.startTime.getHours();
      if (!eventsByHour.has(hour)) {
        eventsByHour.set(hour, []);
      }
      eventsByHour.get(hour)?.push(event);
    });

    return (
      <FlatList
        data={dayData.events}
        renderItem={renderTimelineEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.timelineContainer}
        ItemSeparatorComponent={() => <View style={styles.timelineSeparator} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.Primary]}
            tintColor={theme.Primary}
          />
        }
      />
    );
  };

  // Create styles with theme
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Loading state
  if (isLoading && scheduleData.size === 0) {
    setIsLoading(false); // Set to false after first render to show content
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.Background }]}>
      {/* Compact Header */}
      <Animated.View 
        style={[
          styles.header, 
          { 
            backgroundColor: theme.Surface,
            opacity: headerOpacity,
            paddingTop: insets.top,
          }
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Icon name="arrow-left" size={24} color={theme.OnSurface} />
          </TouchableOpacity>

          <View style={styles.headerTitle}>
            <Text style={[styles.headerTitleText, { color: theme.OnSurface }]}>
              Schedule
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.OnSurfaceVariant }]}>
              {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={() => handleViewModeChange(viewMode === 'day' ? '3day' : viewMode === '3day' ? 'week' : 'day')}
              style={styles.headerButton}
              accessibilityLabel={`Switch to ${viewMode === 'day' ? '3 day' : viewMode === '3day' ? 'week' : 'day'} view`}
              accessibilityRole="button"
            >
              <Icon 
                name={viewMode === 'day' ? 'calendar-today' : viewMode === '3day' ? 'calendar-range' : 'calendar-week'} 
                size={24} 
                color={theme.OnSurface} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleDateSelect(new Date())}
              style={styles.headerButton}
              accessibilityLabel="Jump to today"
              accessibilityRole="button"
            >
              <Text style={[styles.todayButton, { color: theme.Primary }]}>Today</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Week Strip */}
      {renderWeekStrip()}

      {/* Content based on view mode */}
      <View style={styles.content}>
        {viewMode === 'day' && renderDayTimeline()}
        
        {viewMode === '3day' && (
          <Text style={{ padding: 20, color: theme.OnSurface }}>
            3-Day View (Coming Soon)
          </Text>
        )}
        
        {viewMode === 'week' && (
          <Text style={{ padding: 20, color: theme.OnSurface }}>
            Week View (Coming Soon)
          </Text>
        )}
      </View>

      {/* Floating Action Button */}
      <Portal>
        <FAB.Group
          open={fabOpen}
          icon={fabOpen ? 'close' : 'plus'}
          visible
          actions={[
            {
              icon: 'calendar-plus',
              label: 'Add Event',
              onPress: handleAddEvent,
            },
            {
              icon: 'clock-plus-outline',
              label: 'Study Block',
              onPress: handleAddStudyBlock,
            },
            {
              icon: 'download',
              label: 'Export',
              onPress: handleExportSchedule,
            },
          ]}
          onStateChange={({ open }) => setFabOpen(open)}
          onPress={() => {
            if (fabOpen) {
              trackAction('close_fab', 'ScheduleScreen', {});
            }
          }}
          fabStyle={{ backgroundColor: theme.Primary }}
          color={theme.OnPrimary}
        />
      </Portal>

      {/* Snackbar */}
      <Snackbar
        visible={!!snackbarMessage}
        onDismiss={() => setSnackbarMessage('')}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarMessage(''),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },

  // Compact header - 56dp + status bar
  header: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  todayButton: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  // Week strip - 72dp
  weekStrip: {
    height: 72,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  weekStripContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  dayItem: {
    width: 48,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 2,
  },
  dayItemSelected: {
    backgroundColor: 'rgba(103, 102, 241, 0.08)',
  },
  dayItemToday: {
    // Today gets special treatment
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  dayLabelSelected: {
    fontWeight: '700',
  },
  dayLabelPast: {
    opacity: 0.5,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '500',
  },
  dayNumberSelected: {
    fontWeight: '700',
  },
  dayNumberToday: {
    fontWeight: '700',
  },
  dayNumberPast: {
    opacity: 0.5,
  },
  dayIndicators: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 4,
  },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // Content area
  content: {
    flex: 1,
  },

  // Timeline
  timelineContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  timelineSeparator: {
    height: 8,
  },
  timelineEvent: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  timelineEventLive: {
    borderLeftWidth: 4,
  },
  timelineEventPast: {
    opacity: 0.7,
  },
  timelineEventCancelled: {
    opacity: 0.5,
  },
  timelineTime: {
    width: 60,
    paddingRight: 12,
    alignItems: 'flex-end',
  },
  timelineTimeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timelineTimeEnd: {
    fontSize: 11,
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.08)',
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timelineTitleCancelled: {
    textDecorationLine: 'line-through',
  },
  timelineSubtitle: {
    fontSize: 13,
    marginBottom: 8,
  },
  timelineFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timelineLocationText: {
    fontSize: 12,
  },
  liveBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  joinButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ScheduleScreen;
/**
 * NewScheduleScreen - Premium Minimal Design
 * Purpose: Display weekly/daily class schedule with clean interface
 * Used in: StudentNavigator (ClassesStack)
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { T } from '../../ui';
import { safeNavigate } from '../../utils/navigationService';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';
import { EventCard } from '../../components/student/molecules/premium/EventCard';
import { HorizontalCarousel } from '../../components/student/molecules/premium/HorizontalCarousel';

type Props = NativeStackScreenProps<any, 'NewScheduleScreen'>;

interface ClassSession {
  id: string;
  subject: string;
  teacher_name: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_link?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  description?: string;
}

interface DaySchedule {
  date: Date;
  dayName: string;
  dayShort: string;
  isToday: boolean;
  classes: ClassSession[];
}

export default function NewScheduleScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day; // Start from Sunday
    return new Date(today.setDate(diff));
  });

  // Track screen view
  React.useEffect(() => {
    trackScreenView('NewScheduleScreen');
  }, []);

  // Fetch classes for the week
  const { data: weekClasses, isLoading, error, refetch } = useQuery({
    queryKey: ['week-classes', user?.id, weekStart.toISOString()],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const { data, error } = await supabase
        .from('class_sessions')
        .select('*, teachers(name)')
        .eq('student_id', user.id)
        .gte('scheduled_at', weekStart.toISOString())
        .lt('scheduled_at', weekEnd.toISOString())
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      // Group classes by day
      const days: DaySchedule[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);

        const dayClasses = (data || []).filter(cls => {
          const classDate = new Date(cls.scheduled_at);
          return classDate.toDateString() === date.toDateString();
        });

        days.push({
          date,
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          dayShort: date.toLocaleDateString('en-US', { weekday: 'short' }),
          isToday: date.toDateString() === new Date().toDateString(),
          classes: dayClasses.map(cls => ({
            ...cls,
            teacher_name: (cls.teachers as any)?.name || 'Unknown Teacher',
          })),
        });
      }

      return days;
    },
    enabled: !!user?.id,
  });

  // Get class status based on time
  const getClassStatus = (classSession: ClassSession): 'live' | 'upcoming' | 'ended' => {
    if (classSession.status === 'cancelled') return 'ended';
    if (classSession.status === 'completed') return 'ended';

    const now = new Date();
    const start = new Date(classSession.scheduled_at);
    const end = new Date(start.getTime() + classSession.duration_minutes * 60000);

    if (now >= start && now <= end) return 'live';
    if (now > end) return 'ended';
    return 'upcoming';
  };

  // Navigate to previous week
  const handlePreviousWeek = useCallback(() => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(weekStart.getDate() - 7);
    setWeekStart(newWeekStart);
    trackAction('navigate_week', 'NewScheduleScreen', { direction: 'previous' });
  }, [weekStart]);

  // Navigate to next week
  const handleNextWeek = useCallback(() => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(weekStart.getDate() + 7);
    setWeekStart(newWeekStart);
    trackAction('navigate_week', 'NewScheduleScreen', { direction: 'next' });
  }, [weekStart]);

  // Navigate to today
  const handleToday = useCallback(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day;
    setWeekStart(new Date(today.setDate(diff)));
    setSelectedDate(new Date());
    trackAction('navigate_today', 'NewScheduleScreen');
  }, []);

  // Handle class press
  const handleClassPress = useCallback((classSession: ClassSession) => {
    trackAction('view_class_detail', 'NewScheduleScreen', { classId: classSession.id });
    safeNavigate('ClassDetail', { classId: classSession.id });
  }, []);

  // Render week view
  const renderWeekView = () => {
    if (!weekClasses || weekClasses.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <T variant="body">No classes scheduled this week</T>
        </View>
      );
    }

    return (
      <FlatList
        data={weekClasses}
        keyExtractor={(day) => day.date.toISOString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.weekList}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              trackAction('refresh_schedule', 'NewScheduleScreen');
              refetch();
            }}
          />
        }
        renderItem={({ item: day }) => (
          <View style={[styles.dayCard, day.isToday && styles.todayCard]}>
            {/* Day Header */}
            <View style={styles.dayHeader}>
              <View>
                <T variant="title" weight="semiBold" style={day.isToday && styles.todayText}>
                  {day.dayShort}
                </T>
                <T variant="caption" style={day.isToday && styles.todayText}>
                  {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </T>
              </View>
              {day.isToday && (
                <View style={styles.todayBadge}>
                  <T variant="caption" weight="semiBold" style={styles.todayBadgeText}>
                    TODAY
                  </T>
                </View>
              )}
            </View>

            {/* Classes List */}
            {day.classes.length > 0 ? (
              <View style={styles.classesContainer}>
                {day.classes.map((classSession) => {
                  const status = getClassStatus(classSession);
                  const time = new Date(classSession.scheduled_at);

                  return (
                    <TouchableOpacity
                      key={classSession.id}
                      style={styles.classItem}
                      onPress={() => handleClassPress(classSession)}
                      accessibilityRole="button"
                      accessibilityLabel={`${classSession.subject} class with ${classSession.teacher_name}`}
                      accessibilityHint="Double tap to view class details"
                    >
                      <View style={styles.classTime}>
                        <T variant="caption" weight="semiBold">
                          {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </T>
                        <T variant="caption" style={styles.classDuration}>
                          {classSession.duration_minutes}min
                        </T>
                      </View>

                      <View style={styles.classInfo}>
                        <View style={styles.classHeader}>
                          <T variant="body" weight="semiBold" numberOfLines={1} style={styles.classSubject}>
                            {classSession.subject}
                          </T>
                          <View style={[
                            styles.statusBadge,
                            status === 'live' && styles.statusLive,
                            status === 'upcoming' && styles.statusUpcoming,
                            status === 'ended' && styles.statusEnded,
                          ]}>
                            <T variant="caption" weight="semiBold" style={styles.statusText}>
                              {status === 'live' ? '🔴 LIVE' : status === 'upcoming' ? '🔵' : '⚪'}
                            </T>
                          </View>
                        </View>
                        <T variant="caption" style={styles.classTeacher} numberOfLines={1}>
                          {classSession.teacher_name}
                        </T>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.noClassesContainer}>
                <T variant="caption" style={styles.noClassesText}>
                  No classes scheduled
                </T>
              </View>
            )}
          </View>
        )}
      />
    );
  };

  // Render day view
  const renderDayView = () => {
    const selectedDay = weekClasses?.find(day =>
      day.date.toDateString() === selectedDate.toDateString()
    );

    if (!selectedDay) {
      return (
        <View style={styles.emptyContainer}>
          <T variant="body">No classes scheduled for this day</T>
        </View>
      );
    }

    return (
      <View style={styles.dayViewContainer}>
        <T variant="title" weight="bold" style={styles.dayViewTitle}>
          {selectedDay.dayName}, {selectedDay.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </T>

        {selectedDay.classes.length > 0 ? (
          <HorizontalCarousel
            data={selectedDay.classes}
            renderItem={(classSession) => {
              const status = getClassStatus(classSession);
              const time = new Date(classSession.scheduled_at);

              return (
                <EventCard
                  title={classSession.subject}
                  subject={classSession.teacher_name}
                  time={time}
                  status={status}
                  onPress={() => handleClassPress(classSession)}
                  accessibilityLabel={`${classSession.subject} class with ${classSession.teacher_name}`}
                />
              );
            }}
            keyExtractor={(cls) => cls.id}
            accessibilityLabel="Today's classes"
          />
        ) : (
          <View style={styles.noClassesContainer}>
            <T variant="body" style={styles.noClassesText}>
              No classes scheduled for this day
            </T>
          </View>
        )}
      </View>
    );
  };

  return (
    <BaseScreen
      scrollable={false}
      loading={isLoading}
      error={error ? 'Failed to load schedule' : null}
      empty={!weekClasses || weekClasses.length === 0}
      emptyMessage="No classes scheduled"
    >
      {/* Week Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={handlePreviousWeek}
          style={styles.navButton}
          accessibilityRole="button"
          accessibilityLabel="Previous week"
        >
          <T variant="body" weight="semiBold" style={styles.navButtonText}>
            ←
          </T>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleToday}
          style={styles.todayButton}
          accessibilityRole="button"
          accessibilityLabel="Go to today"
        >
          <T variant="body" weight="semiBold">
            {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
            {new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </T>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNextWeek}
          style={styles.navButton}
          accessibilityRole="button"
          accessibilityLabel="Next week"
        >
          <T variant="body" weight="semiBold" style={styles.navButtonText}>
            →
          </T>
        </TouchableOpacity>
      </View>

      {/* View Mode Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'week' && styles.toggleButtonActive]}
          onPress={() => {
            setViewMode('week');
            trackAction('switch_view', 'NewScheduleScreen', { view: 'week' });
          }}
          accessibilityRole="button"
          accessibilityLabel="Week view"
        >
          <T
            variant="body"
            weight="semiBold"
            style={[styles.toggleButtonText, viewMode === 'week' && styles.toggleButtonTextActive]}
          >
            Week
          </T>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'day' && styles.toggleButtonActive]}
          onPress={() => {
            setViewMode('day');
            trackAction('switch_view', 'NewScheduleScreen', { view: 'day' });
          }}
          accessibilityRole="button"
          accessibilityLabel="Day view"
        >
          <T
            variant="body"
            weight="semiBold"
            style={[styles.toggleButtonText, viewMode === 'day' && styles.toggleButtonTextActive]}
          >
            Day
          </T>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {viewMode === 'week' ? renderWeekView() : renderDayView()}
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  navButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 24,
    color: '#3B82F6',
  },
  todayButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  viewToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleButtonText: {
    color: '#6B7280',
  },
  toggleButtonTextActive: {
    color: '#111827',
  },
  weekList: {
    padding: 16,
    gap: 16,
  },
  dayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  todayCard: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  todayText: {
    color: '#3B82F6',
  },
  todayBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  todayBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  classesContainer: {
    gap: 12,
  },
  classItem: {
    flexDirection: 'row',
    gap: 12,
    minHeight: 48,
  },
  classTime: {
    width: 70,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  classDuration: {
    color: '#9CA3AF',
  },
  classInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  classSubject: {
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusLive: {
    backgroundColor: '#FEE2E2',
  },
  statusUpcoming: {
    backgroundColor: '#DBEAFE',
  },
  statusEnded: {
    backgroundColor: '#F3F4F6',
  },
  statusText: {
    fontSize: 10,
  },
  classTeacher: {
    color: '#6B7280',
  },
  noClassesContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  noClassesText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  dayViewContainer: {
    padding: 16,
  },
  dayViewTitle: {
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});

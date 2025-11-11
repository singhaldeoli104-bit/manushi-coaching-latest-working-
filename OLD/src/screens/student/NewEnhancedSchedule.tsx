/**
 * NewEnhancedSchedule - EXACT match to HTML reference
 * Purpose: Weekly schedule with live classes and upcoming events
 * Design: Material Design top bar, week calendar, gradient live cards
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';
import { ViewToggle } from '../../shared/components/ViewToggle';
import { useFadeInUp } from '../../shared/hooks/useAnimations';

interface DayItem {
  day: string;
  date: number;
  isToday: boolean;
}

interface ClassSession {
  id: string;
  time: string;
  title: string;
  location: string;
  emoji: string;
  type: 'class' | 'study';
  duration: string;
  isLive?: boolean;
  liveCount?: number;
  teacher?: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'scheduled' | 'assignment';
}

export default function NewEnhancedSchedule() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');
  const [, setSelectedDay] = useState(1); // For future use

  // Animation hooks
  const calendarAnim = useFadeInUp(0);
  const liveCardAnim = useFadeInUp(150);
  const event1Anim = useFadeInUp(300);
  const event2Anim = useFadeInUp(450);

  useEffect(() => {
    trackScreenView('NewEnhancedSchedule');
  }, []);

  // Generate 7-day week calendar
  const weekDays: DayItem[] = [
    { day: 'Mon', date: 21, isToday: false },
    { day: 'Tue', date: 22, isToday: true },
    { day: 'Wed', date: 23, isToday: false },
    { day: 'Thu', date: 24, isToday: false },
    { day: 'Fri', date: 25, isToday: false },
    { day: 'Sat', date: 26, isToday: false },
    { day: 'Sun', date: 27, isToday: false },
  ];

  // Fetch today's classes
  const { isLoading, refetch } = useQuery({
    queryKey: ['today-schedule', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { data: student } = await supabase
          .from('students')
          .select('batch_id')
          .eq('id', user.id)
          .single();

        if (!student?.batch_id) return [];

        const { data } = await supabase
          .from('live_sessions')
          .select('id, session_name, scheduled_start_at, scheduled_end_at, class_id, status')
          .eq('class_id', student.batch_id)
          .gte('scheduled_start_at', today.toISOString())
          .lt('scheduled_start_at', tomorrow.toISOString())
          .order('scheduled_start_at', { ascending: true });

        return data || [];
      } catch (error) {
        console.error('Error fetching classes:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  // Example data for display
  const liveClass: ClassSession = {
    id: '1',
    time: '11:00 AM',
    title: 'Design Principles',
    location: 'Prof. Alan Turing - 11:00 AM',
    emoji: '🎨',
    type: 'class',
    duration: '1 hr',
    isLive: true,
    liveCount: 42,
    teacher: 'Prof. Alan Turing',
  };

  const scheduledClasses: ClassSession[] = [
    {
      id: '2',
      time: '01:00 PM',
      title: 'Calculus II Lecture',
      location: 'Room 301, Math Building',
      emoji: '📐',
      type: 'class',
      duration: '50 min',
    },
    {
      id: '3',
      time: '03:30 PM',
      title: 'Study Group for Physics',
      location: 'Main Library, Floor 2',
      emoji: '📚',
      type: 'study',
      duration: '1 hr 30 min',
    },
  ];

  const upcomingEvents: UpcomingEvent[] = [
    {
      id: '1',
      title: 'History Midterm',
      date: 'Wed, Oct 23',
      time: '10:00 AM',
      type: 'scheduled',
    },
    {
      id: '2',
      title: 'Project Deadline',
      date: 'Fri, Oct 25',
      time: '11:59 PM',
      type: 'assignment',
    },
    {
      id: '3',
      title: 'Lab Session: Biology',
      date: 'Fri, Oct 25',
      time: '02:00 PM',
      type: 'scheduled',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top App Bar - Material Design Standard */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton}>
          <T variant="h2" style={styles.icon}>☰</T>
        </TouchableOpacity>
        <T variant="title" weight="bold" style={styles.topBarTitle}>My Schedule</T>
        <ViewToggle
          modes={[
            { value: 'compact', icon: '▦', label: 'Compact' },
            { value: 'detailed', icon: '☰', label: 'Detailed' },
          ]}
          selectedMode={viewMode}
          onModeChange={(mode) => {
            setViewMode(mode as 'compact' | 'detailed');
            trackAction('toggle_view_mode', 'NewEnhancedSchedule', { mode });
          }}
          size="small"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {/* Week Navigation Header - Only in detailed mode */}
        {viewMode === 'detailed' && (
          <View style={styles.weekNavHeader}>
            <T variant="title" weight="bold" style={styles.weekRange}>
              Oct 21 - Oct 27
            </T>
            <View style={styles.weekNavButtons}>
              <TouchableOpacity style={[styles.navButton, { marginRight: 8 }]}>
                <T variant="body" style={styles.navIcon}>‹</T>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navButton, { marginRight: 8 }]}>
                <T variant="body" style={styles.navIcon}>›</T>
              </TouchableOpacity>
              <TouchableOpacity style={styles.todayButton}>
                <T variant="caption" weight="medium" style={styles.todayButtonText}>
                  Today
                </T>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 7-Day Horizontal Calendar */}
        <Animated.View style={calendarAnim}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weekCalendar}
          >
            {weekDays.map((item, index) => (
              <TouchableOpacity
              key={index}
              style={[
                styles.dayCard,
                item.isToday && styles.dayCardSelected,
              ]}
              onPress={() => {
                setSelectedDay(index);
                trackAction('select_day', 'NewEnhancedSchedule', { day: item.day });
              }}
            >
              <T
                variant="caption"
                weight="medium"
                style={[item.isToday ? styles.dayLabelSelected : styles.dayLabel, { marginBottom: 4 }]}
              >
                {item.day}
              </T>
              <T
                variant="body"
                weight="bold"
                style={item.isToday ? styles.dateLabelSelected : styles.dateLabel}
              >
                {item.date}
              </T>
            </TouchableOpacity>
          ))}
          </ScrollView>
        </Animated.View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Section Header: Today's Events */}
          <T variant="h2" weight="bold" style={[styles.sectionTitle, { marginBottom: 16 }]}>
            Today's Events
          </T>

          {/* Live Class Card - Gradient Background */}
          <Animated.View style={[styles.liveCard, { marginBottom: 24 }, liveCardAnim]}>
            <View style={styles.liveCardHeader}>
              <View>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDotOuter} />
                  <View style={[styles.liveDotInner, { marginRight: 8 }]} />
                  <T variant="caption" weight="medium" style={styles.liveText}>
                    LIVE NOW
                  </T>
                </View>
                <T variant="title" weight="bold" style={styles.liveTitle}>
                  {liveClass.title}
                </T>
              </View>
              <View style={styles.participantCount}>
                <T variant="body" style={[styles.participantIcon, { marginRight: 6 }]}>👥</T>
                <T variant="caption" weight="medium" style={styles.participantText}>
                  {liveClass.liveCount} students
                </T>
              </View>
            </View>

            <T variant="body" style={styles.liveSubtitle}>
              {liveClass.location}
            </T>

            <View style={styles.liveActions}>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => {
                  trackAction('join_live_class', 'NewEnhancedSchedule', { classId: liveClass.id });
                }}
              >
                <T variant="body" weight="bold" style={styles.joinButtonText}>
                  Join Live Class
                </T>
              </TouchableOpacity>
              <TouchableOpacity style={styles.calendarButton}>
                <T variant="body" style={[styles.calendarIcon, { marginRight: 8 }]}>📅</T>
                <T variant="caption" weight="medium" style={styles.calendarText}>
                  Add to Calendar
                </T>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Scheduled Event Cards */}
          {scheduledClasses.map((classItem, index) => (
            <Animated.View key={classItem.id} style={[styles.scheduledItem, index === 0 ? event1Anim : event2Anim]}>
              <T variant="caption" weight="medium" style={[styles.timeLabel, { marginRight: 16 }]}>
                {classItem.time}
              </T>
              <View style={styles.eventCard}>
                <View style={styles.eventCardHeader}>
                  <View style={styles.eventCardContent}>
                    <T variant="body" weight="bold" style={styles.eventTitle}>
                      {classItem.title}
                    </T>
                    <T variant="caption" style={styles.eventLocation}>
                      {classItem.location}
                    </T>
                  </View>
                  <T variant="h1" style={styles.eventEmoji}>
                    {classItem.emoji}
                  </T>
                </View>
                <View style={styles.eventCardFooter}>
                  <View
                    style={[
                      styles.typeBadge,
                      classItem.type === 'class'
                        ? styles.typeBadgeClass
                        : styles.typeBadgeStudy,
                    ]}
                  >
                    <T variant="caption" style={[styles.typeBadgeIcon, { marginRight: 6 }]}>
                      {classItem.type === 'class' ? '🎓' : '👥'}
                    </T>
                    <T variant="caption" weight="medium" style={styles.typeBadgeText}>
                      {classItem.type === 'class' ? 'Class' : 'Study'}
                    </T>
                  </View>
                  <T variant="caption" style={styles.durationText}>
                    {classItem.duration}
                  </T>
                </View>
              </View>
            </Animated.View>
          ))}

          {/* Section Header: Upcoming This Week - Only in detailed mode */}
          {viewMode === 'detailed' && (
            <>
              <T variant="h2" weight="bold" style={[styles.upcomingSectionTitle, { marginTop: 16, marginBottom: 16 }]}>
                Upcoming This Week
              </T>

              {/* Upcoming Events */}
              <View>
                {upcomingEvents.map((event) => (
                  <View key={event.id} style={styles.upcomingCard}>
                    <View style={[styles.upcomingContent, { marginRight: 16 }]}>
                      <T variant="body" weight="bold" style={styles.upcomingEventTitle}>
                        {event.title}
                      </T>
                      <T variant="caption" style={styles.upcomingEventTime}>
                        {event.date} - {event.time}
                      </T>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        event.type === 'scheduled'
                          ? styles.statusBadgeScheduled
                          : styles.statusBadgeAssignment,
                      ]}
                    >
                      <T variant="caption" weight="medium" style={styles.statusBadgeText}>
                        {event.type === 'scheduled' ? 'Scheduled' : 'Assignment'}
                      </T>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F7F8',
  },
  scrollView: {
    flex: 1,
  },
  // Top App Bar - Material Design Standard
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    color: '#1F2937',
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  // Week Navigation Header
  weekNavHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  weekRange: {
    fontSize: 18,
    color: '#1F2937',
  },
  weekNavButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 16,
    color: '#6B7280',
  },
  todayButton: {
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayButtonText: {
    fontSize: 14,
    color: '#4A90E2',
  },
  // 7-Day Horizontal Calendar
  weekCalendar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  dayCard: {
    width: 56,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dayCardSelected: {
    backgroundColor: '#4A90E2',
  },
  dayLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  dayLabelSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dateLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
  dateLabelSelected: {
    color: '#FFFFFF',
  },
  // Content Container
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#111827',
  },
  upcomingSectionTitle: {
    fontSize: 20,
    color: '#111827',
  },
  // Live Class Card - Gradient
  liveCard: {
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#8B5CF6', // Fallback - would use gradient in production
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  liveCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  liveDotOuter: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(248, 113, 113, 0.75)',
  },
  liveDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1.5,
    marginLeft: 4,
  },
  liveTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 4,
  },
  participantCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantIcon: {
    fontSize: 18,
  },
  participantText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  liveSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
  },
  liveActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  joinButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: {
    fontSize: 16,
    color: '#111827',
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  calendarIcon: {
    fontSize: 20,
  },
  calendarText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  // Scheduled Event Cards
  scheduledItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 24,
  },
  timeLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 64,
    paddingTop: 4,
  },
  eventCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  eventCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventCardContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  eventEmoji: {
    fontSize: 28,
  },
  eventCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeClass: {
    backgroundColor: '#D1FAE5',
  },
  typeBadgeStudy: {
    backgroundColor: '#DBEAFE',
  },
  typeBadgeIcon: {
    fontSize: 14,
  },
  typeBadgeText: {
    fontSize: 12,
    color: '#065F46',
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  // Upcoming Events
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingEventTitle: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  upcomingEventTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeScheduled: {
    backgroundColor: '#D1FAE5',
  },
  statusBadgeAssignment: {
    backgroundColor: '#FED7AA',
  },
  statusBadgeText: {
    fontSize: 12,
    color: '#065F46',
  },
});

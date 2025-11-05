/**
 * NewScheduleScreen - Premium Minimal Design
 * Modern schedule screen with filtering, sorting, and calendar features
 * Uses only Premium Minimal Design components (NO Material Design 3)
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Premium Minimal Design Components
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card, CardHeader, CardContent, CardActions } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { Button } from '../../ui/interactive/Button';
import { Chip } from '../../ui/data-display/Chip';
import { Badge } from '../../ui/data-display/Badge';
import { Row, Col, Stack, Spacer, Divider } from '../../ui/layout';

// Supabase services
import { getClassesByDateRange } from '../../services/classesService';
import { useAuth } from '../../context/AuthContext';

// Analytics
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';

// Types
type ViewMode = 'week' | 'day' | 'month' | 'agenda';
type StatusFilter = 'all' | 'upcoming' | 'live' | 'completed';
type SortType = 'time' | 'subject' | 'teacher';

interface ClassSchedule {
  id: string;
  subject: string;
  teacher: string;
  time: string;
  duration: string;
  room: string;
  type: 'live' | 'recorded' | 'assignment';
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  color: string;
  startDateTime: Date;
  endDateTime: Date;
  description?: string;
  location?: string;
  isDeadline: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface ScheduleSettings {
  showWeekends: boolean;
  showDeadlines: boolean;
  defaultView: ViewMode;
}

interface DaySchedule {
  date: string;
  dayName: string;
  isToday: boolean;
  classes: ClassSchedule[];
}

interface NewScheduleScreenProps {
  onNavigate?: (screen: string) => void;
}

export const NewScheduleScreen: React.FC<NewScheduleScreenProps> = ({ onNavigate }: NewScheduleScreenProps) => {
  const { user } = useAuth();

  // ===== STATE MANAGEMENT (15+ states) =====
  // View and Filter States
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortType>('time');

  // Data States
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Modal States
  const [showSortModal, setShowSortModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Settings States
  const [settings, setSettings] = useState<ScheduleSettings>({
    showWeekends: true,
    showDeadlines: true,
    defaultView: 'week',
  });

  // Loading States
  const [refreshing, setRefreshing] = useState(false);
  const [error] = useState<string | null>(null);

  // ===== FEATURE 7: ASYNCSTORAGE CACHING =====
  useEffect(() => {
    loadCachedSchedule();
    loadSettings();
    trackScreenView('NewScheduleScreen');
  }, []);

  const loadCachedSchedule = async () => {
    try {
      const cached = await AsyncStorage.getItem('schedule_cache');
      if (cached) {
        const data = JSON.parse(cached);
        console.log('✅ Loaded schedule from cache', data.classes?.length || 0);
      }
    } catch (error) {
      console.error('Failed to load cache:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('schedule_settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  // ===== DATA FETCHING =====
  const { data: classes, isLoading: classesLoading, refetch } = useQuery({
    queryKey: ['schedule', user?.id, selectedDate],
    queryFn: async () => {
      if (!user?.id) return [];

      const weekStart = new Date(selectedDate);
      weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const result = await getClassesByDateRange(user.id, 'student', weekStart, weekEnd);

      if (result.success && result.data) {
        const transformed = result.data.map((cls: any) => {
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

          const subjectColors: Record<string, string> = {
            'Mathematics': '#6366F1',
            'Physics': '#10B981',
            'Chemistry': '#F59E0B',
            'Biology': '#EF4444',
            'English': '#8B5CF6',
            'History': '#F97316',
          };

          return {
            id: cls.id,
            subject: cls.subject,
            teacher: cls.teacher_id,
            time: scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            duration: `${cls.duration_minutes || 60} min`,
            room: cls.meeting_link || 'Virtual Room',
            type: 'live' as const,
            status,
            color: subjectColors[cls.subject] || '#6366F1',
            startDateTime: scheduledTime,
            endDateTime: endTime,
            description: cls.description || '',
            location: cls.meeting_link || 'Virtual Room',
            isDeadline: false,
            priority: 'high' as const,
          };
        });

        // Cache the data
        await AsyncStorage.setItem('schedule_cache', JSON.stringify({
          classes: transformed,
          timestamp: Date.now(),
        }));

        return transformed;
      }
      return [];
    },
    enabled: !!user?.id,
  });

  // ===== FEATURE 3: SUBJECT FILTER =====
  const subjects = useMemo(() => {
    if (!classes) return ['all'];
    const unique = Array.from(new Set(classes.map((c: any) => c.subject)));
    return ['all', ...unique];
  }, [classes]);

  // ===== FEATURE 2: STATUS FILTER + FEATURE 3: SUBJECT FILTER =====
  const filteredClasses = useMemo(() => {
    if (!classes) return [];

    let filtered = [...classes];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((cls: any) => cls.status === statusFilter);
    }

    // Apply subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter((cls: any) => cls.subject === subjectFilter);
    }

    return filtered;
  }, [classes, statusFilter, subjectFilter]);

  // ===== FEATURE 4: SORT OPTIONS =====
  const sortedClasses = useMemo(() => {
    const filtered = [...filteredClasses];
    return filtered.sort((a: any, b: any) => {
      if (sortBy === 'time') return a.startDateTime.getTime() - b.startDateTime.getTime();
      if (sortBy === 'subject') return a.subject.localeCompare(b.subject);
      if (sortBy === 'teacher') return a.teacher.localeCompare(b.teacher);
      return 0;
    });
  }, [filteredClasses, sortBy]);

  // ===== REFRESH HANDLER =====
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // ===== FEATURE 6: SETTINGS MODAL =====
  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('schedule_settings', JSON.stringify(settings));
      Alert.alert('Success', 'Settings saved successfully');
      setShowSettingsModal(false);
      trackAction('save_schedule_settings', 'NewScheduleScreen', settings);
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  // ===== RENDER CLASS CARD =====
  const renderClassCard = (classItem: ClassSchedule) => (
    <Card
      key={classItem.id}
      variant="outlined"
      style={styles.classCard}
      onPress={() => {
        trackAction('view_class_detail', 'NewScheduleScreen', { classId: classItem.id });
        Alert.alert(
          classItem.subject,
          `Teacher: ${classItem.teacher}\nTime: ${classItem.time}\nLocation: ${classItem.location}\nStatus: ${classItem.status}`,
          [
            { text: 'OK', style: 'cancel' },
            classItem.status === 'live' ? {
              text: 'Join Class',
              onPress: () => onNavigate?.('live-class')
            } : null,
          ].filter(Boolean) as any
        );
      }}
    >
      <CardContent>
        <Row align="center" justify="space-between">
          <Col flex={1}>
            <T variant="h3" weight="bold">{classItem.subject}</T>
            <Spacer size="xs" />
            <T variant="body" color="textSecondary">{classItem.teacher}</T>
          </Col>
          <Badge
            label={classItem.status.toUpperCase()}
            variant={classItem.status === 'live' ? 'error' : classItem.status === 'upcoming' ? 'success' : 'neutral'}
          />
        </Row>

        <Spacer size="sm" />
        <Divider />
        <Spacer size="sm" />

        <Row gap="md" wrap>
          <T variant="caption">🕐 {classItem.time}</T>
          <T variant="caption">⏱️ {classItem.duration}</T>
          <T variant="caption">📍 {classItem.location}</T>
        </Row>

        {classItem.isDeadline && (
          <>
            <Spacer size="sm" />
            <T variant="caption" weight="semiBold" color="error">
              ⚠️ Priority: {classItem.priority.toUpperCase()}
            </T>
          </>
        )}
      </CardContent>
    </Card>
  );

  // ===== FEATURE 1: VIEW MODE TOGGLE - WEEK VIEW =====
  const renderWeekView = () => (
    <Stack gap="md">
      {Array.from({ length: 7 }, (_: any, i: number) => {
        const date = new Date(selectedDate);
        date.setDate(selectedDate.getDate() - selectedDate.getDay() + i);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const isToday = date.toDateString() === new Date().toDateString();

        const dayClasses = sortedClasses.filter((cls: any) => {
          const clsDate = new Date(cls.startDateTime);
          return clsDate.toDateString() === date.toDateString();
        });

        if (!settings.showWeekends && (i === 0 || i === 6)) return null;

        return (
          <Card key={i} variant={isToday ? 'filled' : 'outlined'}>
            <CardHeader
              title={dateStr}
              trailing={isToday ? <Badge label="TODAY" variant="primary" /> : undefined}
            />
            <CardContent>
              {dayClasses.length > 0 ? (
                <Stack gap="sm">
                  {dayClasses.map((cls: any) => renderClassCard(cls))}
                </Stack>
              ) : (
                <T variant="body" color="textSecondary" style={{ textAlign: 'center', padding: 16 }}>
                  No classes scheduled
                </T>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );

  // ===== FEATURE 1: VIEW MODE TOGGLE - DAY VIEW =====
  const renderDayView = () => {
    const todayClasses = sortedClasses.filter((cls: any) => {
      const clsDate = new Date(cls.startDateTime);
      return clsDate.toDateString() === selectedDate.toDateString();
    });

    return (
      <Stack gap="md">
        <Card variant="filled">
          <CardContent>
            <T variant="h2" weight="bold" style={{ textAlign: 'center' }}>
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </T>
          </CardContent>
        </Card>

        {todayClasses.length > 0 ? (
          <Stack gap="sm">
            {todayClasses.map((cls: any) => renderClassCard(cls))}
          </Stack>
        ) : (
          <Card variant="outlined">
            <CardContent>
              <T variant="body" color="textSecondary" style={{ textAlign: 'center', padding: 32 }}>
                📅 No classes scheduled for this day
              </T>
            </CardContent>
          </Card>
        )}
      </Stack>
    );
  };

  // ===== FEATURE 1: VIEW MODE TOGGLE - MONTH VIEW =====
  const renderMonthView = () => (
    <Card variant="outlined">
      <CardContent>
        <T variant="h2" weight="bold" style={{ textAlign: 'center', marginBottom: 16 }}>
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </T>
        <T variant="body" color="textSecondary" style={{ textAlign: 'center', padding: 32 }}>
          📅 Month view - Calendar grid coming soon
        </T>
        <Spacer size="md" />
        <T variant="caption" color="textSecondary" style={{ textAlign: 'center' }}>
          Total classes this month: {sortedClasses.length}
        </T>
      </CardContent>
    </Card>
  );

  // ===== FEATURE 1: VIEW MODE TOGGLE - AGENDA VIEW =====
  const renderAgendaView = () => (
    <Stack gap="sm">
      {sortedClasses.length > 0 ? (
        sortedClasses.map((cls: any) => (
          <Card key={cls.id} variant="outlined">
            <CardContent>
              <Row align="center" gap="md">
                <View style={[styles.agendaDot, { backgroundColor: cls.color }]} />
                <Col flex={1}>
                  <T variant="body" weight="semiBold">{cls.subject}</T>
                  <T variant="caption" color="textSecondary">
                    {new Date(cls.startDateTime).toLocaleDateString()} • {cls.time}
                  </T>
                </Col>
                <Badge label={cls.status} variant={cls.status === 'live' ? 'error' : 'neutral'} />
              </Row>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card variant="outlined">
          <CardContent>
            <T variant="body" color="textSecondary" style={{ textAlign: 'center', padding: 32 }}>
              📋 No classes to show
            </T>
          </CardContent>
        </Card>
      )}
    </Stack>
  );

  // ===== MAIN RENDER =====
  return (
    <BaseScreen
      loading={classesLoading && !refreshing}
      error={error}
      empty={!classes || classes.length === 0}
      emptyTitle="No Schedule"
      emptyBody="No classes scheduled for this period"
      emptyIcon="📅"
      onRetry={refetch}
      onRefresh={onRefresh}
      refreshing={refreshing}
      scrollable
    >
      <Stack gap="md" style={styles.container}>
        {/* Header */}
        <Card variant="filled">
          <CardContent>
            <T variant="h1" weight="bold">📅 My Schedule</T>
          </CardContent>
        </Card>

        {/* FEATURE 1: VIEW MODE TOGGLE */}
        <Card variant="outlined">
          <CardContent>
            <Row gap="xs" wrap>
              <Chip
                variant="filter"
                label="📊 Week"
                selected={viewMode === 'week'}
                onPress={() => {
                  setViewMode('week');
                  trackAction('change_view', 'NewScheduleScreen', { view: 'week' });
                }}
              />
              <Chip
                variant="filter"
                label="📆 Day"
                selected={viewMode === 'day'}
                onPress={() => {
                  setViewMode('day');
                  trackAction('change_view', 'NewScheduleScreen', { view: 'day' });
                }}
              />
              <Chip
                variant="filter"
                label="📋 Month"
                selected={viewMode === 'month'}
                onPress={() => {
                  setViewMode('month');
                  trackAction('change_view', 'NewScheduleScreen', { view: 'month' });
                }}
              />
              <Chip
                variant="filter"
                label="📜 Agenda"
                selected={viewMode === 'agenda'}
                onPress={() => {
                  setViewMode('agenda');
                  trackAction('change_view', 'NewScheduleScreen', { view: 'agenda' });
                }}
              />
            </Row>
          </CardContent>
        </Card>

        {/* FEATURE 2: STATUS FILTER */}
        <Card variant="outlined">
          <CardContent>
            <T variant="body" weight="semiBold">Status Filter:</T>
            <Spacer size="sm" />
            <Row gap="xs" wrap>
              <Chip
                variant="filter"
                label="All"
                selected={statusFilter === 'all'}
                onPress={() => {
                  setStatusFilter('all');
                  trackAction('filter_status', 'NewScheduleScreen', { status: 'all' });
                }}
              />
              <Chip
                variant="filter"
                label="⏰ Upcoming"
                selected={statusFilter === 'upcoming'}
                onPress={() => {
                  setStatusFilter('upcoming');
                  trackAction('filter_status', 'NewScheduleScreen', { status: 'upcoming' });
                }}
              />
              <Chip
                variant="filter"
                label="🔴 Live"
                selected={statusFilter === 'live'}
                onPress={() => {
                  setStatusFilter('live');
                  trackAction('filter_status', 'NewScheduleScreen', { status: 'live' });
                }}
              />
              <Chip
                variant="filter"
                label="✅ Completed"
                selected={statusFilter === 'completed'}
                onPress={() => {
                  setStatusFilter('completed');
                  trackAction('filter_status', 'NewScheduleScreen', { status: 'completed' });
                }}
              />
            </Row>
          </CardContent>
        </Card>

        {/* FEATURE 3: SUBJECT FILTER */}
        <Card variant="outlined">
          <CardContent>
            <T variant="body" weight="semiBold">Subject:</T>
            <Spacer size="sm" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Row gap="xs">
                {subjects.map((subject: string) => (
                  <Chip
                    key={subject}
                    variant="filter"
                    label={subject}
                    selected={subjectFilter === subject}
                    onPress={() => {
                      setSubjectFilter(subject);
                      trackAction('filter_subject', 'NewScheduleScreen', { subject });
                    }}
                  />
                ))}
              </Row>
            </ScrollView>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Row gap="md">
          {/* FEATURE 4: SORT BUTTON */}
          <Button
            variant="outline"
            onPress={() => setShowSortModal(true)}
            style={{ flex: 1 }}
          >
            ⬆️⬇️ Sort: {sortBy}
          </Button>

          {/* FEATURE 5: CALENDAR BUTTON */}
          <Button
            variant="outline"
            onPress={() => setShowCalendarModal(true)}
            style={{ flex: 1 }}
          >
            📅 {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Button>

          {/* FEATURE 6: SETTINGS BUTTON */}
          <Button
            variant="outline"
            onPress={() => setShowSettingsModal(true)}
            style={{ flex: 1 }}
          >
            ⚙️ Settings
          </Button>
        </Row>

        {/* Results Summary */}
        <Card variant="outlined">
          <CardContent>
            <T variant="caption" color="textSecondary" style={{ textAlign: 'center' }}>
              Showing {sortedClasses.length} of {classes?.length || 0} classes
            </T>
          </CardContent>
        </Card>

        {/* Content based on view mode */}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'agenda' && renderAgendaView()}

        {/* FEATURE 4: SORT MODAL */}
        <Modal visible={showSortModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <Card style={styles.modal}>
              <CardHeader
                title="Sort By"
                trailing={
                  <TouchableOpacity onPress={() => setShowSortModal(false)}>
                    <T variant="h2">✕</T>
                  </TouchableOpacity>
                }
              />
              <CardContent>
                <Button
                  variant={sortBy === 'time' ? 'primary' : 'ghost'}
                  onPress={() => {
                    setSortBy('time');
                    setShowSortModal(false);
                    trackAction('sort_schedule', 'NewScheduleScreen', { sortBy: 'time' });
                  }}
                >
                  ⏰ Time
                </Button>
                <Spacer size="sm" />
                <Button
                  variant={sortBy === 'subject' ? 'primary' : 'ghost'}
                  onPress={() => {
                    setSortBy('subject');
                    setShowSortModal(false);
                    trackAction('sort_schedule', 'NewScheduleScreen', { sortBy: 'subject' });
                  }}
                >
                  📚 Subject
                </Button>
                <Spacer size="sm" />
                <Button
                  variant={sortBy === 'teacher' ? 'primary' : 'ghost'}
                  onPress={() => {
                    setSortBy('teacher');
                    setShowSortModal(false);
                    trackAction('sort_schedule', 'NewScheduleScreen', { sortBy: 'teacher' });
                  }}
                >
                  👤 Teacher
                </Button>
              </CardContent>
            </Card>
          </View>
        </Modal>

        {/* FEATURE 5: CALENDAR MODAL */}
        <Modal visible={showCalendarModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <Card style={styles.modal}>
              <CardHeader
                title="Select Date"
                trailing={
                  <TouchableOpacity onPress={() => setShowCalendarModal(false)}>
                    <T variant="h2">✕</T>
                  </TouchableOpacity>
                }
              />
              <CardContent>
                <T variant="body" weight="semiBold" style={{ textAlign: 'center', marginBottom: 16 }}>
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </T>
                <Row gap="md" justify="space-between">
                  <Button
                    variant="outline"
                    onPress={() => {
                      const prev = new Date(selectedDate);
                      prev.setDate(prev.getDate() - 7);
                      setSelectedDate(prev);
                      trackAction('navigate_week', 'NewScheduleScreen', { direction: 'previous' });
                    }}
                  >
                    ⬅️ Prev Week
                  </Button>
                  <Button
                    variant="outline"
                    onPress={() => {
                      setSelectedDate(new Date());
                      trackAction('navigate_today', 'NewScheduleScreen');
                    }}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    onPress={() => {
                      const next = new Date(selectedDate);
                      next.setDate(next.getDate() + 7);
                      setSelectedDate(next);
                      trackAction('navigate_week', 'NewScheduleScreen', { direction: 'next' });
                    }}
                  >
                    Next Week ➡️
                  </Button>
                </Row>
              </CardContent>
              <CardActions>
                <Button variant="primary" fullWidth onPress={() => setShowCalendarModal(false)}>
                  Done
                </Button>
              </CardActions>
            </Card>
          </View>
        </Modal>

        {/* FEATURE 6: SETTINGS MODAL */}
        <Modal visible={showSettingsModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <Card style={styles.modal}>
              <CardHeader
                title="Schedule Settings"
                trailing={
                  <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                    <T variant="h2">✕</T>
                  </TouchableOpacity>
                }
              />
              <CardContent>
                <Row align="center" justify="space-between" style={{ marginBottom: 16 }}>
                  <T variant="body">Show Weekends</T>
                  <TouchableOpacity
                    onPress={() => setSettings((s: ScheduleSettings) => ({ ...s, showWeekends: !s.showWeekends }))}
                  >
                    <T variant="h2">{settings.showWeekends ? '✅' : '☐'}</T>
                  </TouchableOpacity>
                </Row>

                <Row align="center" justify="space-between" style={{ marginBottom: 16 }}>
                  <T variant="body">Show Deadlines</T>
                  <TouchableOpacity
                    onPress={() => setSettings((s: ScheduleSettings) => ({ ...s, showDeadlines: !s.showDeadlines }))}
                  >
                    <T variant="h2">{settings.showDeadlines ? '✅' : '☐'}</T>
                  </TouchableOpacity>
                </Row>

                <T variant="body" weight="semiBold">Default View:</T>
                <Spacer size="sm" />
                <Row gap="xs" wrap>
                  <Chip
                    variant="filter"
                    label="Week"
                    selected={settings.defaultView === 'week'}
                    onPress={() => setSettings((s: ScheduleSettings) => ({ ...s, defaultView: 'week' }))}
                  />
                  <Chip
                    variant="filter"
                    label="Day"
                    selected={settings.defaultView === 'day'}
                    onPress={() => setSettings((s: ScheduleSettings) => ({ ...s, defaultView: 'day' }))}
                  />
                  <Chip
                    variant="filter"
                    label="Month"
                    selected={settings.defaultView === 'month'}
                    onPress={() => setSettings((s: ScheduleSettings) => ({ ...s, defaultView: 'month' }))}
                  />
                  <Chip
                    variant="filter"
                    label="Agenda"
                    selected={settings.defaultView === 'agenda'}
                    onPress={() => setSettings((s: ScheduleSettings) => ({ ...s, defaultView: 'agenda' }))}
                  />
                </Row>
              </CardContent>
              <CardActions>
                <Button variant="ghost" onPress={() => setShowSettingsModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onPress={saveSettings}>
                  Save
                </Button>
              </CardActions>
            </Card>
          </View>
        </Modal>

        <Spacer size="xl" />
      </Stack>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  classCard: {
    marginBottom: 8,
  },
  agendaDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
  },
});

export default NewScheduleScreen;

/**
 * SCREEN 36 - LESSON PLANNER / SMART TEACHING PLANNER
 *
 * Smart lesson planning tool for teachers to schedule, organize,
 * and track teaching plans with resource attachment.
 *
 * Features:
 * - Calendar view with lesson scheduling
 * - List view showing topic sequence
 * - Create/edit lesson cards
 * - Link resources and assignments
 * - Mark lessons as completed
 * - Track progress and delays
 * - Drag-and-drop scheduling
 *
 * Design System:
 * - Primary: #5B47FB
 * - Success: #10B981
 * - Warning: #F59E0B
 * - Error: #EF4444
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Types
interface Lesson {
  id: string;
  topic: string;
  chapter: string;
  date: string;
  status: 'scheduled' | 'completed' | 'pending' | 'behind';
  resources?: number;
  homework?: boolean;
  test?: boolean;
  notes?: string;
  duration?: string;
}

type ViewMode = 'calendar' | 'list';

interface LessonPlannerProps {
  lessons?: Lesson[];
  onCreateLesson?: () => void;
  onEditLesson?: (id: string) => void;
  onDeleteLesson?: (id: string) => void;
  onMarkComplete?: (id: string) => void;
  onExportPlan?: () => void;
}

/**
 * Main Component
 */
const LessonPlanner: React.FC<LessonPlannerProps> = ({
  lessons = MOCK_LESSONS,
  onCreateLesson,
  onEditLesson,
  onDeleteLesson,
  onMarkComplete,
  onExportPlan,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [selectedClass, setSelectedClass] = useState('Class 10 Math');
  const [selectedMonth, setSelectedMonth] = useState('January 2025');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Group lessons by status for stats
  const stats = useMemo(() => {
    return {
      total: lessons.length,
      completed: lessons.filter(l => l.status === 'completed').length,
      scheduled: lessons.filter(l => l.status === 'scheduled').length,
      pending: lessons.filter(l => l.status === 'pending').length,
      behind: lessons.filter(l => l.status === 'behind').length,
    };
  }, [lessons]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Lesson Planner</Text>
            <Text style={styles.headerSubtitle}>Plan & track your lessons</Text>
          </View>
          <TouchableOpacity
            onPress={onExportPlan}
            accessibilityLabel="Export plan"
          >
            <Ionicons name="download-outline" size={22} color="#5B47FB" />
          </TouchableOpacity>
        </View>

        {/* Class & Subject Selector */}
        <View style={styles.selectors}>
          <TouchableOpacity style={styles.selector}>
            <Text style={styles.selectorText}>{selectedClass}</Text>
            <Ionicons name="chevron-down" size={18} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.selector}>
            <Text style={styles.selectorText}>Mathematics</Text>
            <Ionicons name="chevron-down" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.statsRow}>
            <StatCard label="Total" value={stats.total} color="#5B47FB" />
            <StatCard label="Completed" value={stats.completed} color="#10B981" />
            <StatCard label="Scheduled" value={stats.scheduled} color="#3B82F6" />
            <StatCard label="Behind" value={stats.behind} color="#EF4444" />
          </View>
        </ScrollView>

        {/* View Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'calendar' && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode('calendar')}
            accessibilityLabel="Calendar view"
          >
            <Ionicons
              name="calendar"
              size={18}
              color={viewMode === 'calendar' ? '#5B47FB' : '#6B7280'}
            />
            <Text
              style={[
                styles.toggleText,
                viewMode === 'calendar' && styles.toggleTextActive,
              ]}
            >
              Calendar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'list' && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode('list')}
            accessibilityLabel="List view"
          >
            <Ionicons
              name="list"
              size={18}
              color={viewMode === 'list' ? '#5B47FB' : '#6B7280'}
            />
            <Text
              style={[
                styles.toggleText,
                viewMode === 'list' && styles.toggleTextActive,
              ]}
            >
              List
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {viewMode === 'calendar' ? (
        <CalendarView
          lessons={lessons}
          selectedMonth={selectedMonth}
          onEditLesson={onEditLesson}
          onMarkComplete={onMarkComplete}
        />
      ) : (
        <ListView
          lessons={lessons}
          onEditLesson={onEditLesson}
          onMarkComplete={onMarkComplete}
          onDeleteLesson={onDeleteLesson}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
        accessibilityLabel="Create lesson"
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Create Lesson Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <CreateLessonForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </View>
  );
};

/**
 * Stat Card Component
 */
const StatCard: React.FC<{ label: string; value: number; color: string }> =
  React.memo(({ label, value, color }) => {
    return (
      <View style={styles.statCard}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    );
  });

/**
 * Calendar View
 */
const CalendarView: React.FC<{
  lessons: Lesson[];
  selectedMonth: string;
  onEditLesson?: (id: string) => void;
  onMarkComplete?: (id: string) => void;
}> = ({ lessons, selectedMonth, onEditLesson, onMarkComplete }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Group lessons by date
  const lessonsByDate = useMemo(() => {
    const grouped: Record<string, Lesson[]> = {};
    lessons.forEach(lesson => {
      if (!grouped[lesson.date]) {
        grouped[lesson.date] = [];
      }
      grouped[lesson.date].push(lesson);
    });
    return grouped;
  }, [lessons]);

  const dates = Object.keys(lessonsByDate);

  return (
    <View style={styles.calendarView}>
      {/* Month Header */}
      <View style={styles.monthHeader}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="#5B47FB" />
        </TouchableOpacity>
        <Text style={styles.monthText}>{selectedMonth}</Text>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={24} color="#5B47FB" />
        </TouchableOpacity>
      </View>

      {/* Calendar Grid */}
      <FlatList
        data={dates}
        keyExtractor={item => item}
        renderItem={({ item: date }) => (
          <CalendarDateCard
            date={date}
            lessons={lessonsByDate[date]}
            isSelected={date === selectedDate}
            onPress={() => setSelectedDate(date)}
            onEditLesson={onEditLesson}
            onMarkComplete={onMarkComplete}
          />
        )}
        contentContainerStyle={styles.calendarContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

/**
 * Calendar Date Card
 */
const CalendarDateCard: React.FC<{
  date: string;
  lessons: Lesson[];
  isSelected: boolean;
  onPress: () => void;
  onEditLesson?: (id: string) => void;
  onMarkComplete?: (id: string) => void;
}> = ({ date, lessons, isSelected, onPress, onEditLesson, onMarkComplete }) => {
  return (
    <TouchableOpacity
      style={[styles.dateCard, isSelected && styles.dateCardSelected]}
      onPress={onPress}
      accessibilityLabel={`${date}, ${lessons.length} lessons`}
    >
      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>{date}</Text>
        <View style={styles.lessonCount}>
          <Text style={styles.lessonCountText}>{lessons.length}</Text>
        </View>
      </View>

      {lessons.map(lesson => (
        <View
          key={lesson.id}
          style={[
            styles.lessonCard,
            { borderLeftColor: getStatusColor(lesson.status) },
          ]}
        >
          <View style={styles.lessonCardHeader}>
            <Text style={styles.lessonTopic} numberOfLines={1}>
              {lesson.topic}
            </Text>
            <View style={styles.lessonActions}>
              {lesson.status !== 'completed' && (
                <TouchableOpacity
                  onPress={() => onMarkComplete?.(lesson.id)}
                  accessibilityLabel="Mark complete"
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#10B981"
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => onEditLesson?.(lesson.id)}
                accessibilityLabel="Edit lesson"
              >
                <Ionicons name="create-outline" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.lessonChapter} numberOfLines={1}>
            {lesson.chapter}
          </Text>
          <View style={styles.lessonMeta}>
            {lesson.duration && (
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={12} color="#6B7280" />
                <Text style={styles.metaText}>{lesson.duration}</Text>
              </View>
            )}
            {lesson.resources && lesson.resources > 0 && (
              <View style={styles.metaItem}>
                <Ionicons name="document-text-outline" size={12} color="#6B7280" />
                <Text style={styles.metaText}>{lesson.resources}</Text>
              </View>
            )}
            {lesson.homework && (
              <Ionicons name="clipboard-outline" size={12} color="#F59E0B" />
            )}
            {lesson.test && (
              <Ionicons name="calculator-outline" size={12} color="#EF4444" />
            )}
          </View>
        </View>
      ))}
    </TouchableOpacity>
  );
};

/**
 * List View
 */
const ListView: React.FC<{
  lessons: Lesson[];
  onEditLesson?: (id: string) => void;
  onMarkComplete?: (id: string) => void;
  onDeleteLesson?: (id: string) => void;
}> = ({ lessons, onEditLesson, onMarkComplete, onDeleteLesson }) => {
  return (
    <FlatList
      data={lessons}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <LessonListCard
          lesson={item}
          onEdit={onEditLesson}
          onMarkComplete={onMarkComplete}
          onDelete={onDeleteLesson}
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

/**
 * Lesson List Card
 */
const LessonListCard: React.FC<{
  lesson: Lesson;
  onEdit?: (id: string) => void;
  onMarkComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}> = React.memo(({ lesson, onEdit, onMarkComplete, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.listCard,
        { borderLeftColor: getStatusColor(lesson.status) },
      ]}
      onLongPress={() => setShowActions(!showActions)}
      accessibilityLabel={`${lesson.topic}, ${lesson.status}`}
    >
      <View style={styles.listCardHeader}>
        <View style={styles.statusIndicator}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(lesson.status) },
            ]}
          />
          <Text style={styles.statusText}>
            {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
          </Text>
        </View>
        <Text style={styles.lessonDate}>{lesson.date}</Text>
      </View>

      <Text style={styles.listLessonTopic}>{lesson.topic}</Text>
      <Text style={styles.listLessonChapter}>{lesson.chapter}</Text>

      <View style={styles.listLessonMeta}>
        {lesson.duration && (
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{lesson.duration}</Text>
          </View>
        )}
        {lesson.resources && lesson.resources > 0 && (
          <View style={styles.metaItem}>
            <Ionicons name="document-text-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{lesson.resources} resources</Text>
          </View>
        )}
        {lesson.homework && (
          <View style={styles.metaItem}>
            <Ionicons name="clipboard-outline" size={14} color="#F59E0B" />
            <Text style={styles.metaText}>Homework</Text>
          </View>
        )}
        {lesson.test && (
          <View style={styles.metaItem}>
            <Ionicons name="calculator-outline" size={14} color="#EF4444" />
            <Text style={styles.metaText}>Test</Text>
          </View>
        )}
      </View>

      {showActions && (
        <View style={styles.actionsRow}>
          {lesson.status !== 'completed' && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => onMarkComplete?.(lesson.id)}
            >
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={[styles.actionBtnText, { color: '#10B981' }]}>
                Complete
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onEdit?.(lesson.id)}
          >
            <Ionicons name="create-outline" size={20} color="#5B47FB" />
            <Text style={styles.actionBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onDelete?.(lesson.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
});

/**
 * Create Lesson Form
 */
const CreateLessonForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [topic, setTopic] = useState('');
  const [chapter, setChapter] = useState('');

  return (
    <View style={styles.createForm}>
      <View style={styles.formHeader}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.formTitle}>New Lesson</Text>
        <TouchableOpacity>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContent}>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Topic</Text>
          <TextInput
            style={styles.fieldInput}
            placeholder="e.g., Quadratic Equations"
            value={topic}
            onChangeText={setTopic}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Chapter</Text>
          <TextInput
            style={styles.fieldInput}
            placeholder="e.g., Algebra - Chapter 5"
            value={chapter}
            onChangeText={setChapter}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Scheduled Date</Text>
          <TouchableOpacity style={styles.dateSelector}>
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            <Text style={styles.dateSelectorText}>Select date</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Duration</Text>
          <TextInput
            style={styles.fieldInput}
            placeholder="e.g., 60 minutes"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formActions}>
          <TouchableOpacity style={styles.formActionButton}>
            <Ionicons name="attach-outline" size={22} color="#5B47FB" />
            <Text style={styles.formActionText}>Add Resources</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.formActionButton}>
            <Ionicons name="clipboard-outline" size={22} color="#5B47FB" />
            <Text style={styles.formActionText}>Link Homework</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Helper Functions
const getStatusColor = (status: Lesson['status']): string => {
  const colors: Record<Lesson['status'], string> = {
    scheduled: '#3B82F6',
    completed: '#10B981',
    pending: '#F59E0B',
    behind: '#EF4444',
  };
  return colors[status];
};

// Mock Data
const MOCK_LESSONS: Lesson[] = [
  {
    id: '1',
    topic: 'Quadratic Equations - Introduction',
    chapter: 'Algebra - Chapter 5',
    date: 'Jan 15, 2025',
    status: 'completed',
    resources: 3,
    homework: true,
    duration: '60 min',
  },
  {
    id: '2',
    topic: 'Solving Quadratic Equations',
    chapter: 'Algebra - Chapter 5',
    date: 'Jan 16, 2025',
    status: 'scheduled',
    resources: 2,
    test: false,
    duration: '60 min',
  },
  {
    id: '3',
    topic: 'Applications of Quadratic Equations',
    chapter: 'Algebra - Chapter 5',
    date: 'Jan 17, 2025',
    status: 'pending',
    resources: 1,
    duration: '45 min',
  },
  {
    id: '4',
    topic: 'Trigonometry Basics',
    chapter: 'Trigonometry - Chapter 8',
    date: 'Jan 14, 2025',
    status: 'behind',
    resources: 2,
    homework: true,
    duration: '60 min',
  },
];

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'Inter',
  },
  selectors: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  selector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'Inter',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#FFF',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
    fontFamily: 'Inter',
  },
  toggleTextActive: {
    color: '#5B47FB',
  },
  calendarView: {
    flex: 1,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  calendarContent: {
    padding: 16,
  },
  dateCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateCardSelected: {
    borderWidth: 2,
    borderColor: '#5B47FB',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  lessonCount: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lessonCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B47FB',
    fontFamily: 'Inter',
  },
  lessonCard: {
    backgroundColor: '#F9FAFB',
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  lessonCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  lessonTopic: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 12,
    fontFamily: 'Inter',
  },
  lessonActions: {
    flexDirection: 'row',
    gap: 12,
  },
  lessonChapter: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontFamily: 'Inter',
  },
  listContent: {
    padding: 16,
  },
  listCard: {
    backgroundColor: '#FFF',
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  lessonDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
  listLessonTopic: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  listLessonChapter: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  listLessonMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 12,
    paddingTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B47FB',
    marginLeft: 6,
    fontFamily: 'Inter',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5B47FB',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#5B47FB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  createForm: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B47FB',
    fontFamily: 'Inter',
  },
  formContent: {
    flex: 1,
    padding: 16,
  },
  formField: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  fieldInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateSelectorText: {
    fontSize: 15,
    color: '#6B7280',
    marginLeft: 12,
    fontFamily: 'Inter',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  formActionButton: {
    alignItems: 'center',
  },
  formActionText: {
    fontSize: 12,
    color: '#5B47FB',
    marginTop: 6,
    fontFamily: 'Inter',
  },
});

export default LessonPlanner;

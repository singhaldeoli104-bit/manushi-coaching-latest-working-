/**
 * StudyHomeScreen - Root screen for Study tab
 * Purpose: Comprehensive study hub with continue learning, quick access, subjects, assignments, tests, library, AI, notes, downloads
 * Design: COMPLETE Framer design system (colors, typography, spacing, shadows, icons, animations)
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';
import { supabase } from '../../config/supabaseClient';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<any, 'StudyHomeScreen'>;

// Framer Colors
const FRAMER_COLORS = {
  background: '#F7F7F7',
  cardBg: '#FFFFFF',
  primary: '#2D5BFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  iconBg: 'rgba(45, 91, 255, 0.15)',
  chipBg: '#F3F4F6',
  chipText: '#374151',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  library: '#8B5CF6',
  assignments: '#EC4899',
  tests: '#F59E0B',
  ai: '#06B6D4',
  notes: '#2D5BFF',
  downloads: '#22C55E',
  tasks: '#EF4444',
};

// Data Types
type ContinueItemType = 'resource' | 'ai_session' | 'assignment' | 'test_review';

interface ContinueLearningItem {
  id: string;
  type: ContinueItemType;
  title: string;
  subtitle: string;
  routeName: string;
  routeParams?: Record<string, any>;
}

interface SubjectItem {
  id: string;
  name: string;
  code: string;
  progressLabel: string;
}

interface AssignmentPreview {
  id: string;
  title: string;
  subjectName: string;
  dueLabel: string;
}

interface TestPreview {
  id: string;
  title: string;
  subjectName: string;
  timeLabel: string;
}

interface NotesDownloadsSummary {
  notesCount: number;
  highlightsCount: number;
  downloadsCount: number;
}

type RecentItemType = 'resource' | 'summary' | 'ai_session' | 'test_review';

interface RecentItem {
  id: string;
  type: RecentItemType;
  title: string;
  subtitle: string;
  routeName: string;
  routeParams?: Record<string, any>;
}

export default function StudyHomeScreen({ navigation }: Props) {
  const { user } = useAuth();

  useEffect(() => {
    trackScreenView('StudyHomeScreen');
  }, []);

  // Fetch continue learning items from recent study materials
  const { data: continueItems, isLoading: loadingContinue } = useQuery({
    queryKey: ['continue-learning', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Fetch recent study material views
      const { data: views, error } = await supabase
        .from('study_material_views')
        .select(`
          id,
          material_id,
          last_viewed_at,
          progress_percentage,
          study_materials (
            id,
            title,
            subject_code
          )
        `)
        .eq('student_id', user.id)
        .order('last_viewed_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching continue learning:', error);
        return [];
      }

      return (views || []).map((v: any) => ({
        id: v.id,
        type: 'resource' as ContinueItemType,
        title: v.study_materials?.title || 'Study Resource',
        subtitle: `${v.study_materials?.subject_code || 'Subject'} • Continue learning`,
        routeName: 'ResourceViewerScreen',
        routeParams: { resourceId: v.material_id },
      })) as ContinueLearningItem[];
    },
    enabled: !!user?.id,
  });

  // Fetch subjects
  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('subjects')
        .select('id, name, code')
        .limit(4);

      if (error) {
        console.error('Error fetching subjects:', error);
        return [];
      }

      return (data || []).map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        progressLabel: 'View chapters',
      })) as SubjectItem[];
    },
    enabled: !!user?.id,
  });

  // Fetch assignments preview
  const { data: assignmentsPreview, isLoading: loadingAssignments } = useQuery({
    queryKey: ['assignments-preview', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('assignments')
        .select('id, title, subject, due_date')
        .gte('due_date', new Date().toISOString())
        .order('due_date', { ascending: true })
        .limit(2);

      if (error) {
        console.error('Error fetching assignments:', error);
        return [];
      }

      return (data || []).map((a) => {
        const dueDate = new Date(a.due_date);
        const now = new Date();
        const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        let dueLabel = 'Due today';
        if (diffDays === 1) dueLabel = 'Due tomorrow';
        else if (diffDays > 1) dueLabel = `Due in ${diffDays} days`;

        return {
          id: a.id,
          title: a.title,
          subjectName: a.subject || 'Subject',
          dueLabel,
        };
      }) as AssignmentPreview[];
    },
    enabled: !!user?.id,
  });

  // Fetch tests preview (using exam_schedules table)
  const { data: testsPreview, isLoading: loadingTests } = useQuery({
    queryKey: ['tests-preview', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('exam_schedules')
        .select('id, exam_name, subject, exam_date')
        .eq('student_id', user.id)
        .gte('exam_date', new Date().toISOString())
        .order('exam_date', { ascending: true })
        .limit(2);

      if (error) {
        console.error('Error fetching tests:', error);
        return [];
      }

      return (data || []).map((t) => {
        const testDate = new Date(t.exam_date);
        const now = new Date();
        const diffDays = Math.ceil((testDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        let timeLabel = 'Today';
        if (diffDays === 1) timeLabel = 'Tomorrow';
        else if (diffDays > 1) timeLabel = `In ${diffDays} days`;

        return {
          id: t.id,
          title: t.exam_name || 'Test',
          subjectName: t.subject || 'Subject',
          timeLabel,
        };
      }) as TestPreview[];
    },
    enabled: !!user?.id,
  });

  // Fetch notes & downloads summary
  const { data: notesSummary } = useQuery({
    queryKey: ['notes-summary', user?.id],
    queryFn: async () => {
      if (!user?.id) return { notesCount: 0, highlightsCount: 0, downloadsCount: 0 };

      const [notesRes, highlightsRes, downloadsRes] = await Promise.all([
        supabase.from('notes').select('id', { count: 'exact', head: true }).eq('student_id', user.id),
        supabase.from('highlights').select('id', { count: 'exact', head: true }).eq('student_id', user.id),
        supabase.from('downloads').select('id', { count: 'exact', head: true }).eq('student_id', user.id),
      ]);

      return {
        notesCount: notesRes.count || 0,
        highlightsCount: highlightsRes.count || 0,
        downloadsCount: downloadsRes.count || 0,
      } as NotesDownloadsSummary;
    },
    enabled: !!user?.id,
  });

  // Fetch recent items (using student_activities table)
  const { data: recentItems } = useQuery({
    queryKey: ['recent-items', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('student_activities')
        .select('id, type, title, description, related_subject, created_at')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching recent items:', error);
        return [];
      }

      return (data || []).map((r) => ({
        id: r.id,
        type: 'resource' as RecentItemType,
        title: r.title || r.description || 'Activity',
        subtitle: `${r.related_subject || r.type || 'Activity'} • Recently`,
        routeName: 'ResourceViewerScreen',
        routeParams: {},
      })) as RecentItem[];
    },
    enabled: !!user?.id,
  });

  const isLoading = loadingContinue || loadingSubjects || loadingAssignments || loadingTests;

  // Navigation handlers
  const handleNavigate = (routeName: string, routeParams?: Record<string, any>) => {
    safeNavigate(routeName, routeParams);
  };

  const handleContinueItem = (item: ContinueLearningItem) => {
    trackAction('study_continue_item_tap', 'StudyHomeScreen', { id: item.id, type: item.type });
    handleNavigate(item.routeName, item.routeParams);
  };

  const handleSubject = (subject: SubjectItem) => {
    trackAction('study_subject_tap', 'StudyHomeScreen', { subjectCode: subject.code });
    handleNavigate('CourseRoadmapScreen', { subjectCode: subject.code });
  };

  const handleAssignment = (a: AssignmentPreview) => {
    trackAction('study_assignment_tap', 'StudyHomeScreen', { assignmentId: a.id });
    handleNavigate('NewAssignmentDetailScreen', { assignmentId: a.id });
  };

  const handleTest = (t: TestPreview) => {
    trackAction('study_test_tap', 'StudyHomeScreen', { testId: t.id });
    handleNavigate('TestCenterScreen', { focusTestId: t.id });
  };

  const handleRecentItem = (item: RecentItem) => {
    trackAction('study_recent_item_tap', 'StudyHomeScreen', { id: item.id, type: item.type });
    handleNavigate(item.routeName, item.routeParams);
  };

  const renderQuickTile = (title: string, subtitle: string, iconName: string, color: string, routeName: string) => (
    <TouchableOpacity
      key={title}
      style={styles.quickTile}
      onPress={() => {
        trackAction('study_quick_access', 'StudyHomeScreen', { destination: routeName });
        handleNavigate(routeName);
      }}
      accessibilityRole="button"
      accessibilityLabel={`Open ${title}`}
    >
      <View style={[styles.quickTileIcon, { backgroundColor: color + '20' }]}>
        <Icon name={iconName} size={28} color={color} />
      </View>
      <T variant="caption" weight="semiBold" style={styles.quickTileTitle}>
        {title}
      </T>
      <T variant="caption" color="textTertiary" style={styles.quickTileSubtitle}>
        {subtitle}
      </T>
    </TouchableOpacity>
  );

  return (
    <BaseScreen loading={isLoading} backgroundColor={FRAMER_COLORS.background}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <T variant="h1" weight="bold" style={styles.headerTitle}>
            Study
          </T>
          <T variant="body" color="textSecondary">
            Your learning hub for courses, assignments, tests & AI practice
          </T>
        </Animated.View>

        {/* Continue Learning */}
        {continueItems && continueItems.length > 0 && (
          <Animated.View entering={FadeInUp.delay(100).springify().stiffness(120).damping(15)} style={styles.section}>
            <T variant="subtitle" weight="bold" style={styles.sectionTitle}>
              Continue learning
            </T>
            {continueItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.continueCard}
                onPress={() => handleContinueItem(item)}
                accessibilityRole="button"
                accessibilityLabel={`Continue ${item.title}`}
              >
                <View style={styles.continueRow}>
                  <View style={styles.continueInfo}>
                    <T variant="body" weight="semiBold" style={styles.continueTitle}>
                      {item.title}
                    </T>
                    <T variant="caption" color="textSecondary">
                      {item.subtitle}
                    </T>
                  </View>
                  <Icon name="chevron-right" size={24} color={FRAMER_COLORS.textSecondary} />
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* Quick Access */}
        <Animated.View entering={FadeInUp.delay(200).springify().stiffness(120).damping(15)} style={styles.section}>
          <T variant="subtitle" weight="bold" style={styles.sectionTitle}>
            Quick access
          </T>
          <View style={styles.quickGrid}>
            {renderQuickTile('Assignments', '2 due soon', 'assignment', FRAMER_COLORS.assignments, 'AssignmentsHomeScreen')}
            {renderQuickTile('Tests', 'Practice & scheduled', 'quiz', FRAMER_COLORS.tests, 'TestCenterScreen')}
            {renderQuickTile('AI Study', 'Plans & practice', 'psychology', FRAMER_COLORS.ai, 'NewAILearningDashboard')}
            {renderQuickTile('Notes', 'Highlights & notes', 'note', FRAMER_COLORS.notes, 'NotesAndHighlightsScreen')}
            {renderQuickTile('Downloads', 'Offline content', 'download', FRAMER_COLORS.downloads, 'DownloadsManagerScreen')}
            {renderQuickTile('Tasks', 'All study tasks', 'task-alt', FRAMER_COLORS.tasks, 'TaskHubScreen')}
          </View>
        </Animated.View>

        {/* Your Subjects */}
        {subjects && subjects.length > 0 && (
          <Animated.View entering={FadeInUp.delay(300).springify().stiffness(120).damping(15)} style={styles.section}>
            <T variant="subtitle" weight="bold" style={styles.sectionTitle}>
              Your subjects
            </T>
            <View style={styles.subjectsGrid}>
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  style={styles.subjectCard}
                  onPress={() => handleSubject(subject)}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${subject.name}`}
                >
                  <T variant="body" weight="bold" style={styles.subjectName}>
                    {subject.name}
                  </T>
                  <T variant="caption" color="textSecondary">
                    {subject.progressLabel}
                  </T>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Assignments & Tests */}
        <Animated.View entering={FadeInUp.delay(350).springify().stiffness(120).damping(15)} style={styles.section}>
          <T variant="subtitle" weight="bold" style={styles.sectionTitle}>
            Assignments & tests
          </T>

          {/* Assignments */}
          <View style={styles.subsection}>
            <T variant="body" weight="semiBold" style={styles.subsectionTitle}>
              Assignments:
            </T>
            {assignmentsPreview && assignmentsPreview.length > 0 ? (
              <>
                {assignmentsPreview.map((a) => (
                  <TouchableOpacity
                    key={a.id}
                    style={styles.previewItem}
                    onPress={() => handleAssignment(a)}
                    accessibilityRole="button"
                    accessibilityLabel={`Open assignment ${a.title}`}
                  >
                    <View style={styles.previewDot} />
                    <View style={styles.previewInfo}>
                      <T variant="body" style={styles.previewTitle}>
                        {a.title}
                      </T>
                      <T variant="caption" color="textSecondary">
                        {a.dueLabel}
                      </T>
                    </View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={() => {
                    trackAction('view_all_assignments', 'StudyHomeScreen');
                    handleNavigate('AssignmentsHomeScreen');
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="View all assignments"
                >
                  <T variant="body" weight="semiBold" style={styles.viewAllText}>
                    [View all assignments]
                  </T>
                </TouchableOpacity>
              </>
            ) : (
              <T variant="caption" color="textSecondary">
                No upcoming assignments
              </T>
            )}
          </View>

          {/* Tests */}
          <View style={styles.subsection}>
            <T variant="body" weight="semiBold" style={styles.subsectionTitle}>
              Tests:
            </T>
            {testsPreview && testsPreview.length > 0 ? (
              <>
                {testsPreview.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={styles.previewItem}
                    onPress={() => handleTest(t)}
                    accessibilityRole="button"
                    accessibilityLabel={`Open test ${t.title}`}
                  >
                    <View style={styles.previewDot} />
                    <View style={styles.previewInfo}>
                      <T variant="body" style={styles.previewTitle}>
                        {t.title}
                      </T>
                      <T variant="caption" color="textSecondary">
                        {t.timeLabel}
                      </T>
                    </View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={() => {
                    trackAction('view_all_tests', 'StudyHomeScreen');
                    handleNavigate('TestCenterScreen');
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="View all tests"
                >
                  <T variant="body" weight="semiBold" style={styles.viewAllText}>
                    [View all tests]
                  </T>
                </TouchableOpacity>
              </>
            ) : (
              <T variant="caption" color="textSecondary">
                No upcoming tests
              </T>
            )}
          </View>
        </Animated.View>

        {/* Library */}
        <Animated.View entering={FadeInUp.delay(400).springify().stiffness(120).damping(15)} style={styles.section}>
          <T variant="subtitle" weight="bold" style={styles.sectionTitle}>
            Library
          </T>
          <View style={styles.libraryCard}>
            <T variant="body" style={styles.libraryText}>
              Courses, chapters & all resources
            </T>
            <TouchableOpacity
              style={styles.libraryButton}
              onPress={() => {
                trackAction('open_library', 'StudyHomeScreen');
                handleNavigate('NewStudyLibraryScreen');
              }}
              accessibilityRole="button"
              accessibilityLabel="Open library"
            >
              <T variant="body" weight="semiBold" style={styles.libraryButtonText}>
                [Open library]
              </T>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* AI Study & Practice */}
        <Animated.View entering={FadeInUp.delay(500).springify().stiffness(120).damping(15)} style={styles.section}>
          <T variant="subtitle" weight="bold" style={styles.sectionTitle}>
            AI study & practice
          </T>
          <View style={styles.aiCard}>
            <T variant="body" style={styles.aiText}>
              AI study – Smart plans and practice
            </T>
            <TouchableOpacity
              style={styles.aiButton}
              onPress={() => {
                trackAction('open_ai_dashboard', 'StudyHomeScreen');
                handleNavigate('NewAILearningDashboard');
              }}
              accessibilityRole="button"
              accessibilityLabel="Open AI dashboard"
            >
              <T variant="body" weight="semiBold" style={styles.aiButtonText}>
                [Open AI dashboard]
              </T>
            </TouchableOpacity>
            <View style={styles.aiChips}>
              <TouchableOpacity
                style={styles.chip}
                onPress={() => {
                  trackAction('ai_practice_problems', 'StudyHomeScreen');
                  handleNavigate('AIPracticeProblems');
                }}
                accessibilityRole="button"
                accessibilityLabel="Practice problems"
              >
                <T variant="caption" style={styles.chipText}>
                  Practice problems
                </T>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chip}
                onPress={() => {
                  trackAction('ai_summaries', 'StudyHomeScreen');
                  handleNavigate('AIStudySummaries');
                }}
                accessibilityRole="button"
                accessibilityLabel="Summaries"
              >
                <T variant="caption" style={styles.chipText}>
                  Summaries
                </T>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chip}
                onPress={() => {
                  trackAction('ask_ai_tutor', 'StudyHomeScreen');
                  handleNavigate('NewAITutorChat');
                }}
                accessibilityRole="button"
                accessibilityLabel="Ask AI tutor"
              >
                <T variant="caption" style={styles.chipText}>
                  Ask AI tutor
                </T>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Notes & Downloads */}
        <Animated.View entering={FadeInUp.delay(600).springify().stiffness(120).damping(15)} style={styles.section}>
          <T variant="subtitle" weight="bold" style={styles.sectionTitle}>
            Notes & downloads
          </T>
          <View style={styles.notesCard}>
            <TouchableOpacity
              style={styles.notesRow}
              onPress={() => {
                trackAction('open_notes', 'StudyHomeScreen');
                handleNavigate('NotesAndHighlightsScreen');
              }}
              accessibilityRole="button"
              accessibilityLabel="Open notes and highlights"
            >
              <T variant="body" style={styles.notesText}>
                Notes & highlights – {notesSummary?.notesCount || 0} notes
              </T>
              <Icon name="chevron-right" size={20} color={FRAMER_COLORS.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.notesRow}
              onPress={() => {
                trackAction('manage_downloads', 'StudyHomeScreen');
                handleNavigate('DownloadsManagerScreen');
              }}
              accessibilityRole="button"
              accessibilityLabel="Manage downloads"
            >
              <T variant="body" style={styles.notesText}>
                Downloads – {notesSummary?.downloadsCount || 0} items offline
              </T>
              <Icon name="chevron-right" size={20} color={FRAMER_COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Recently Viewed */}
        {recentItems && recentItems.length > 0 && (
          <Animated.View entering={FadeInUp.delay(650).springify().stiffness(120).damping(15)} style={styles.section}>
            <T variant="subtitle" weight="bold" style={styles.sectionTitle}>
              Recently viewed
            </T>
            {recentItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.recentItem}
                onPress={() => handleRecentItem(item)}
                accessibilityRole="button"
                accessibilityLabel={`View ${item.title}`}
              >
                <View style={styles.recentDot} />
                <View style={styles.recentInfo}>
                  <T variant="body" style={styles.recentTitle}>
                    {item.title}
                  </T>
                  <T variant="caption" color="textSecondary">
                    {item.subtitle}
                  </T>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    color: FRAMER_COLORS.textPrimary,
    marginBottom: 4,
  },
  section: {
    backgroundColor: FRAMER_COLORS.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    color: FRAMER_COLORS.textPrimary,
    marginBottom: 16,
  },
  continueCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  continueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  continueInfo: {
    flex: 1,
    marginRight: 12,
  },
  continueTitle: {
    fontSize: 15,
    color: FRAMER_COLORS.textPrimary,
    marginBottom: 4,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickTile: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  quickTileIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickTileTitle: {
    fontSize: 13,
    color: FRAMER_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickTileSubtitle: {
    fontSize: 11,
    textAlign: 'center',
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subjectCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 15,
    color: FRAMER_COLORS.textPrimary,
    marginBottom: 4,
  },
  subsection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 15,
    color: FRAMER_COLORS.textPrimary,
    marginBottom: 8,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  previewDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: FRAMER_COLORS.primary,
    marginRight: 12,
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 14,
    color: FRAMER_COLORS.textPrimary,
    marginBottom: 2,
  },
  viewAllButton: {
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: FRAMER_COLORS.primary,
  },
  libraryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  libraryText: {
    fontSize: 14,
    color: FRAMER_COLORS.textPrimary,
    marginBottom: 12,
  },
  libraryButton: {
    alignSelf: 'flex-start',
  },
  libraryButtonText: {
    fontSize: 14,
    color: FRAMER_COLORS.primary,
  },
  aiCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  aiText: {
    fontSize: 14,
    color: FRAMER_COLORS.textPrimary,
    marginBottom: 12,
  },
  aiButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  aiButtonText: {
    fontSize: 14,
    color: FRAMER_COLORS.primary,
  },
  aiChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: FRAMER_COLORS.chipBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    color: FRAMER_COLORS.chipText,
  },
  notesCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  notesText: {
    fontSize: 14,
    color: FRAMER_COLORS.textPrimary,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  recentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: FRAMER_COLORS.primary,
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    color: FRAMER_COLORS.textPrimary,
    marginBottom: 2,
  },
});

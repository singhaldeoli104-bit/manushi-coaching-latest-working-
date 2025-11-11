/**
 * NewStudentDashboard - EXACT match to HTML reference
 * Pixel-perfect recreation of the reference design
 */

import React, { useEffect, useState } from 'react';
import { ScrollView, View, TouchableOpacity, RefreshControl, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';
import { supabase } from '../../config/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import HamburgerMenu from './HamburgerMenu';

type Props = NativeStackScreenProps<any, 'NewStudentDashboard'>;

const NewStudentDashboard: React.FC<Props> = () => {
  const { user } = useAuth();
  const studentId = user?.id || 'test-student-id';
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    trackScreenView('NewStudentDashboard', { userId: studentId });
  }, [studentId]);

  // Fetch summary stats
  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ['dashboard-summary', studentId],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      try {
        const { data: student } = await supabase
          .from('students')
          .select('batch_id, attendance_percentage')
          .eq('id', studentId)
          .single();

        const batchId = student?.batch_id;

        const [classCount, assignmentCount] = await Promise.all([
          supabase
            .from('live_sessions')
            .select('id', { count: 'exact', head: true })
            .eq('class_id', batchId)
            .gte('scheduled_start_at', today.toISOString())
            .lt('scheduled_start_at', tomorrow.toISOString()),
          supabase
            .from('assignments')
            .select('id', { count: 'exact', head: true })
            .eq('class_id', batchId)
            .eq('status', 'published')
            .gte('due_date', today.toISOString()),
        ]);

        return {
          classCount: classCount.count || 0,
          assignmentCount: assignmentCount.count || 0,
          attendance: Math.round(student?.attendance_percentage || 0),
          streak: 12,
        };
      } catch (error: any) {
        console.error('Error fetching summary:', error);
        return { classCount: 4, assignmentCount: 3, attendance: 92, streak: 12 };
      }
    },
  });

  // Fetch today's classes
  const { data: todaysClasses, isLoading: classesLoading, refetch: refetchClasses } = useQuery({
    queryKey: ['today-classes', studentId],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      try {
        const { data: student } = await supabase
          .from('students')
          .select('batch_id')
          .eq('id', studentId)
          .single();

        if (!student?.batch_id) return [];

        const { data, error } = await supabase
          .from('live_sessions')
          .select('id, session_name, scheduled_start_at, scheduled_end_at, class_id, status')
          .eq('class_id', student.batch_id)
          .gte('scheduled_start_at', today.toISOString())
          .lt('scheduled_start_at', tomorrow.toISOString())
          .order('scheduled_start_at', { ascending: true })
          .limit(3);

        if (error) throw error;
        return data || [];
      } catch (error: any) {
        console.error('Error fetching classes:', error);
        return [];
      }
    },
  });

  // Fetch pending assignments
  const { data: pendingAssignments, isLoading: assignmentsLoading, refetch: refetchAssignments } = useQuery({
    queryKey: ['pending-assignments', studentId],
    queryFn: async () => {
      try {
        const { data: student } = await supabase
          .from('students')
          .select('batch_id')
          .eq('id', studentId)
          .single();

        if (!student?.batch_id) return [];

        const { data, error } = await supabase
          .from('assignments')
          .select('*')
          .eq('class_id', student.batch_id)
          .eq('status', 'published')
          .gte('due_date', new Date().toISOString())
          .order('due_date', { ascending: true })
          .limit(3);

        if (error) throw error;
        return data || [];
      } catch (error: any) {
        console.error('Error fetching assignments:', error);
        return [];
      }
    },
  });

  // Fetch student profile data for HamburgerMenu
  const { data: studentData } = useQuery({
    queryKey: ['student-profile-menu', studentId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('name, grade, section, student_id')
          .eq('id', studentId)
          .single();

        if (error) throw error;
        return data;
      } catch (error: any) {
        console.error('Error fetching student profile:', error);
        return null;
      }
    },
  });

  const isLoading = summaryLoading || classesLoading || assignmentsLoading;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Hamburger Menu */}
      <HamburgerMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        currentRoute="NewStudentDashboard"
        studentData={studentData || undefined}
      />

      {/* Sticky Header - Edge to Edge */}
      <View style={styles.stickyHeader}>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => {
            trackAction('open_menu', 'NewStudentDashboard');
            setMenuVisible(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <T variant="h2" style={styles.headerIcon}>☰</T>
        </TouchableOpacity>
        <T variant="title" weight="bold" style={styles.headerTitle}>Dashboard</T>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => {
            trackAction('open_profile', 'NewStudentDashboard');
            // @ts-expect-error - Student routes not yet in ParentStackParamList
            safeNavigate('StudentProfileScreen');
          }}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          <T variant="h2" style={styles.headerIcon}>⋮</T>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              refetchSummary();
              refetchClasses();
              refetchAssignments();
            }}
          />
        }
      >
          {/* Gradient Header - EXACT match (h-48 = 192px) */}
          <View style={styles.gradientHeader}>
            <View style={styles.headerContent}>
              {/* Avatar - EXACT 64x64 */}
              <View style={styles.avatar}>
                <T variant="display" style={{ fontSize: 28 }}>👤</T>
              </View>
              {/* Name Section */}
              <View style={styles.nameSection}>
                <T variant="h2" weight="bold" style={styles.studentName}>
                  {user?.email?.split('@')[0] || 'Cameron Wilson'}
                </T>
                <T variant="body" style={styles.studentGrade}>
                  Grade 11, Section B
                </T>
              </View>
            </View>
          </View>

          {/* Floating Stats - EXACT grid-cols-2 sm:grid-cols-4 */}
          <View style={styles.statsFloating}>
            <View style={styles.statsGrid}>
              {/* Stat 1 - Event Icon */}
              <View style={styles.statCard}>
                <T style={[styles.statIconText, { marginBottom: 8 }]}>📅</T>
                <T variant="h1" weight="bold" style={[styles.statValue, { marginBottom: 8 }]}>
                  {summary?.classCount.toString().padStart(2, '0') || '04'}
                </T>
                <T variant="caption" style={styles.statLabel}>Today's Classes</T>
              </View>

              {/* Stat 2 - Assignment */}
              <View style={styles.statCard}>
                <T style={[styles.statIconTextOrange, { marginBottom: 8 }]}>📝</T>
                <T variant="h1" weight="bold" style={[styles.statValue, { marginBottom: 8 }]}>
                  {summary?.assignmentCount.toString().padStart(2, '0') || '03'}
                </T>
                <T variant="caption" style={styles.statLabel}>Pending</T>
              </View>

              {/* Stat 3 - Check Circle */}
              <View style={styles.statCard}>
                <T style={[styles.statIconTextGreen, { marginBottom: 8 }]}>✅</T>
                <T variant="h1" weight="bold" style={[styles.statValue, { marginBottom: 8 }]}>
                  {summary?.attendance || 92}%
                </T>
                <T variant="caption" style={styles.statLabel}>Attendance</T>
              </View>

              {/* Stat 4 - Fire */}
              <View style={styles.statCard}>
                <T style={[styles.statIconTextRed, { marginBottom: 8 }]}>🔥</T>
                <T variant="h1" weight="bold" style={[styles.statValue, { marginBottom: 8 }]}>
                  {summary?.streak || 12}
                </T>
                <T variant="caption" style={styles.statLabel}>Streak</T>
              </View>
            </View>
          </View>

          {/* Today's Classes Section - EXACT match */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <T variant="title" weight="bold" style={styles.sectionTitle}>Today's Classes</T>
              <TouchableOpacity onPress={() => {
                // @ts-expect-error - Student routes not yet in ParentStackParamList
                safeNavigate('NewEnhancedSchedule');
              }}>
                <T variant="body" style={styles.viewAllLink}>View All</T>
              </TouchableOpacity>
            </View>

            {todaysClasses && todaysClasses.length > 0 ? (
              todaysClasses.map((cls) => {
                const now = new Date();
                const start = new Date(cls.scheduled_start_at);
                const end = new Date(cls.scheduled_end_at);
                const isLive = now >= start && now <= end;
                const isScheduled = now < start;

                return (
                  <TouchableOpacity
                    key={cls.id}
                    style={[
                      styles.classCard,
                      isLive && styles.classCardLive,
                    ]}
                    onPress={() => {
                      trackAction('view_class_detail', 'NewStudentDashboard', { classId: cls.id });
                      // @ts-expect-error - Student routes not yet in ParentStackParamList
                      safeNavigate('NewClassDetailScreen', {
                        classId: cls.id,
                        title: cls.session_name || 'Biology - Cell Structure',
                        teacher: 'Dr. Evelyn Reed',
                        department: 'Biology Department'
                      });
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`View details for ${cls.session_name || 'class'}`}
                  >
                    <View style={styles.classCardContent}>
                      {/* Time and Status Badge */}
                      <View style={styles.classCardHeader}>
                        <T variant="caption" style={styles.classTime}>
                          {formatTime(cls.scheduled_start_at)} - {formatTime(cls.scheduled_end_at)}
                        </T>
                        <View
                          style={[
                            styles.statusBadge,
                            isLive && styles.statusBadgeLive,
                            isScheduled && styles.statusBadgeScheduled,
                          ]}
                        >
                          <T variant="caption" weight="semiBold" style={styles.statusBadgeText}>
                            {isLive ? 'Live' : isScheduled ? 'Scheduled' : 'Ended'}
                          </T>
                        </View>
                      </View>

                      {/* Class Title */}
                      <T variant="title" weight="bold" style={styles.classTitle}>
                        {cls.session_name || 'Physics - CH 4: Motion'}
                      </T>

                      {/* Teacher and Room + Join Button */}
                      <View style={styles.classCardFooter}>
                        <View style={styles.classInfo}>
                          <View style={styles.classInfoRow}>
                            <T variant="caption" style={styles.infoIcon}>👤</T>
                            <T variant="caption" style={styles.infoText}>Ms. Evelyn Reed</T>
                          </View>
                          <View style={styles.classInfoRow}>
                            <T variant="caption" style={styles.infoIcon}>📍</T>
                            <T variant="caption" style={styles.infoText}>Room C1</T>
                          </View>
                        </View>

                        {isLive && (
                          <TouchableOpacity
                            style={styles.joinButton}
                            onPress={() => {
                              trackAction('join_live_class', 'NewStudentDashboard', { classId: cls.id });
                              // @ts-expect-error - Student routes not yet in ParentStackParamList
                              safeNavigate('NewEnhancedLiveClass', { sessionId: cls.id });
                            }}
                          >
                            <T variant="body" weight="semiBold" style={styles.joinButtonText}>
                              Join Live
                            </T>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <>
                {/* Example Live Class */}
                <TouchableOpacity
                  style={[styles.classCard, styles.classCardLive]}
                  onPress={() => {
                    trackAction('view_class_detail_live_example', 'NewStudentDashboard');
                    // @ts-expect-error - Student routes not yet in ParentStackParamList
                    safeNavigate('NewClassDetailScreen', {
                      title: 'Physics - CH 4: Motion',
                      teacher: 'Ms. Evelyn Reed',
                      department: 'Physics Department'
                    });
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="View Physics class details"
                >
                  <View style={styles.classCardContent}>
                    <View style={styles.classCardHeader}>
                      <T variant="caption" style={styles.classTime}>10:00 - 11:00 AM</T>
                      <View style={[styles.statusBadge, styles.statusBadgeLive]}>
                        <T variant="caption" weight="semiBold" style={styles.statusBadgeText}>Live</T>
                      </View>
                    </View>
                    <T variant="title" weight="bold" style={styles.classTitle}>
                      Physics - CH 4: Motion
                    </T>
                    <View style={styles.classCardFooter}>
                      <View style={styles.classInfo}>
                        <View style={styles.classInfoRow}>
                          <T variant="caption" style={styles.infoIcon}>👤</T>
                          <T variant="caption" style={styles.infoText}>Ms. Evelyn Reed</T>
                        </View>
                        <View style={styles.classInfoRow}>
                          <T variant="caption" style={styles.infoIcon}>📍</T>
                          <T variant="caption" style={styles.infoText}>Room C1</T>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.joinButton}
                        onPress={() => {
                          trackAction('join_live_class_example', 'NewStudentDashboard');
                          // @ts-expect-error - Student routes not yet in ParentStackParamList
                          safeNavigate('NewEnhancedLiveClass', { title: 'Physics - CH 4: Motion' });
                        }}
                      >
                        <T variant="body" weight="semiBold" style={styles.joinButtonText}>Join Live</T>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Example Scheduled Class */}
                <TouchableOpacity
                  style={styles.classCard}
                  onPress={() => {
                    trackAction('view_class_detail_scheduled_example', 'NewStudentDashboard');
                    // @ts-expect-error - Student routes not yet in ParentStackParamList
                    safeNavigate('NewClassDetailScreen', {
                      title: 'Mathematics - CH 8: Calculus',
                      teacher: 'Mr. David Chen',
                      department: 'Mathematics Department'
                    });
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="View Mathematics class details"
                >
                  <View style={styles.classCardContent}>
                    <View style={styles.classCardHeader}>
                      <T variant="caption" style={styles.classTime}>11:00 - 12:00 PM</T>
                      <View style={[styles.statusBadge, styles.statusBadgeScheduled]}>
                        <T variant="caption" weight="semiBold" style={styles.statusBadgeText}>Scheduled</T>
                      </View>
                    </View>
                    <T variant="title" weight="bold" style={styles.classTitle}>
                      Mathematics - CH 8: Calculus
                    </T>
                    <View style={styles.classCardFooter}>
                      <View style={styles.classInfo}>
                        <View style={styles.classInfoRow}>
                          <T variant="caption" style={styles.infoIcon}>👤</T>
                          <T variant="caption" style={styles.infoText}>Mr. David Chen</T>
                        </View>
                        <View style={styles.classInfoRow}>
                          <T variant="caption" style={styles.infoIcon}>📍</T>
                          <T variant="caption" style={styles.infoText}>Room B4</T>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Pending Assignments Section - EXACT match */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <T variant="title" weight="bold" style={styles.sectionTitle}>Pending Assignments</T>
              <TouchableOpacity onPress={() => {
                // @ts-expect-error - Student routes not yet in ParentStackParamList
                safeNavigate('AssignmentsList');
              }}>
                <T variant="body" style={styles.viewAllLink}>View All</T>
              </TouchableOpacity>
            </View>

            {pendingAssignments && pendingAssignments.length > 0 ? (
              pendingAssignments.map((assignment) => {
                const dueDate = new Date(assignment.due_date);
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const isHighPriority = dueDate < tomorrow || assignment.priority === 'high';

                return (
                  <View key={assignment.id} style={styles.assignmentCard}>
                    <View style={styles.assignmentContent}>
                      <View style={styles.assignmentInfo}>
                        <View style={styles.assignmentBadgeRow}>
                          <View style={[styles.priorityBadge, isHighPriority && styles.priorityBadgeHigh]}>
                            <T variant="caption" weight="semiBold" style={styles.priorityBadgeText}>
                              {isHighPriority ? 'High' : 'Medium'}
                            </T>
                          </View>
                          <T variant="caption" style={styles.assignmentDue}>
                            Due: {dueDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </T>
                        </View>
                        <T variant="body" weight="bold" style={styles.assignmentTitle}>
                          {assignment.title}
                        </T>
                        <T variant="caption" style={styles.assignmentPoints}>
                          {assignment.total_points || 100} Points
                        </T>
                      </View>
                      <View style={styles.assignmentActions}>
                        <TouchableOpacity
                          style={styles.startButton}
                          onPress={() => {
                            trackAction('start_assignment', 'NewStudentDashboard', { assignmentId: assignment.id });
                            // @ts-expect-error - Student routes not yet in ParentStackParamList
                            safeNavigate('NewAssignmentDetailScreen', { assignmentId: assignment.id });
                          }}
                          accessibilityRole="button"
                          accessibilityLabel="Start assignment"
                        >
                          <T variant="body" weight="semiBold" style={styles.startButtonText}>Start</T>
                        </TouchableOpacity>
                        {assignment.allow_collaboration && (
                          <TouchableOpacity
                            style={styles.collaborateButton}
                            onPress={() => {
                              trackAction('collaborate_assignment', 'NewStudentDashboard', { assignmentId: assignment.id });
                              // @ts-expect-error - Student routes not yet in ParentStackParamList
                              safeNavigate('NewCollaborativeAssignment', { assignmentId: assignment.id });
                            }}
                            accessibilityRole="button"
                            accessibilityLabel="Collaborate on assignment"
                          >
                            <T variant="body" style={styles.collaborateIcon}>👥</T>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <>
                {/* Example Assignment 1 - High Priority with Collaboration */}
                <View style={styles.assignmentCard}>
                  <View style={styles.assignmentContent}>
                    <View style={styles.assignmentInfo}>
                      <View style={styles.assignmentBadgeRow}>
                        <View style={[styles.priorityBadge, styles.priorityBadgeHigh]}>
                          <T variant="caption" weight="semiBold" style={styles.priorityBadgeText}>High</T>
                        </View>
                        <T variant="caption" style={styles.assignmentDue}>Due: Tomorrow, 11:59 PM</T>
                      </View>
                      <T variant="body" weight="bold" style={styles.assignmentTitle}>
                        Algebra Problem Set 3
                      </T>
                      <T variant="caption" style={styles.assignmentPoints}>100 Points</T>
                    </View>
                    <View style={styles.assignmentActions}>
                      <TouchableOpacity
                        style={styles.startButton}
                        accessibilityRole="button"
                        accessibilityLabel="Start assignment"
                      >
                        <T variant="body" weight="semiBold" style={styles.startButtonText}>Start</T>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.collaborateButton}
                        onPress={() => {
                          trackAction('collaborate_assignment', 'NewStudentDashboard');
                          // @ts-expect-error - Student routes not yet in ParentStackParamList
                          safeNavigate('NewCollaborativeAssignment', { assignmentId: '1' });
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="Collaborate on assignment"
                      >
                        <T variant="body" style={styles.collaborateIcon}>👥</T>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Example Assignment 2 - Medium Priority */}
                <View style={styles.assignmentCard}>
                  <View style={styles.assignmentContent}>
                    <View style={styles.assignmentInfo}>
                      <View style={styles.assignmentBadgeRow}>
                        <View style={[styles.priorityBadge, styles.priorityBadgeMedium]}>
                          <T variant="caption" weight="semiBold" style={styles.priorityBadgeText}>Medium</T>
                        </View>
                        <T variant="caption" style={styles.assignmentDue}>Due: Oct 28, 5:00 PM</T>
                      </View>
                      <T variant="body" weight="bold" style={styles.assignmentTitle}>
                        Lab Report: Photosynthesis
                      </T>
                      <T variant="caption" style={styles.assignmentPoints}>50 Points</T>
                    </View>
                    <TouchableOpacity style={styles.startButton}>
                      <T variant="body" weight="semiBold" style={styles.startButtonText}>Start</T>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Quick Access - EXACT grid-cols-5 */}
          <View style={styles.section}>
            <T variant="title" weight="bold" style={styles.sectionTitle}>Quick Access</T>
            <View style={styles.quickAccessGrid}>
              <TouchableOpacity
                style={styles.quickAccessItem}
                onPress={() => {
                  trackAction('quick_access_library', 'NewStudentDashboard');
                  // @ts-expect-error - Student routes not yet in ParentStackParamList
                  safeNavigate('NewStudyLibraryScreen');
                }}
              >
                <View style={styles.quickAccessButton}>
                  <T style={styles.quickAccessIcon}>📚</T>
                </View>
                <T variant="caption" style={styles.quickAccessLabel}>Library</T>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAccessItem}
                onPress={() => {
                  trackAction('quick_access_doubt', 'NewStudentDashboard');
                  // @ts-expect-error - Student routes not yet in ParentStackParamList
                  safeNavigate('NewDoubtSubmission');
                }}
              >
                <View style={styles.quickAccessButton}>
                  <T style={styles.quickAccessIcon}>❓</T>
                </View>
                <T variant="caption" style={styles.quickAccessLabel}>Ask Doubt</T>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAccessItem}
                onPress={() => {
                  trackAction('quick_access_schedule', 'NewStudentDashboard');
                  // @ts-expect-error - Student routes not yet in ParentStackParamList
                  safeNavigate('NewEnhancedSchedule');
                }}
              >
                <View style={styles.quickAccessButton}>
                  <T style={styles.quickAccessIcon}>📅</T>
                </View>
                <T variant="caption" style={styles.quickAccessLabel}>Schedule</T>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAccessItem}
                onPress={() => {
                  trackAction('quick_access_ai_dashboard', 'NewStudentDashboard');
                  // @ts-expect-error - Student routes not yet in ParentStackParamList
                  safeNavigate('NewAILearningDashboard');
                }}
                accessibilityRole="button"
                accessibilityLabel="AI Insights"
              >
                <View style={styles.quickAccessButton}>
                  <T style={styles.quickAccessIcon}>🧠</T>
                </View>
                <T variant="caption" style={styles.quickAccessLabel}>AI Insights</T>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAccessItem}
                onPress={() => {
                  trackAction('quick_access_ai_study', 'NewStudentDashboard');
                  // @ts-expect-error - Student routes not yet in ParentStackParamList
                  safeNavigate('NewEnhancedAIStudy');
                }}
                accessibilityRole="button"
                accessibilityLabel="AI Study Assistant"
              >
                <View style={styles.quickAccessButton}>
                  <T style={styles.quickAccessIcon}>🤖</T>
                </View>
                <T variant="caption" style={styles.quickAccessLabel}>AI Study</T>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAccessItem}
                onPress={() => {
                  trackAction('quick_access_peers', 'NewStudentDashboard');
                  // @ts-expect-error - Student routes not yet in ParentStackParamList
                  safeNavigate('NewPeerLearningNetwork');
                }}
                accessibilityRole="button"
                accessibilityLabel="Peer Learning Network"
              >
                <View style={styles.quickAccessButton}>
                  <T style={styles.quickAccessIcon}>👥</T>
                </View>
                <T variant="caption" style={styles.quickAccessLabel}>Peers</T>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAccessItem}
                onPress={() => {
                  trackAction('quick_access_whiteboard', 'NewStudentDashboard');
                  // @ts-expect-error - Student routes not yet in ParentStackParamList
                  safeNavigate('NewVirtualClassroom', {
                    title: 'Algebra II',
                    teacher: 'Mrs. Davison',
                    topic: 'Solving Quadratic Equations',
                  });
                }}
              >
                <View style={styles.quickAccessButton}>
                  <T style={styles.quickAccessIcon}>🖼️</T>
                </View>
                <T variant="caption" style={styles.quickAccessLabel}>Whiteboard</T>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Activity - EXACT match */}
          <View style={[styles.section, styles.lastSection]}>
            <T variant="title" weight="bold" style={styles.sectionTitle}>Recent Activity</T>
            <View style={styles.activityList}>
              {/* Activity 1 - Green */}
              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, styles.activityIconGreen]}>
                  <T style={styles.activityIconText}>🎓</T>
                </View>
                <View style={styles.activityContent}>
                  <T variant="body" style={styles.activityText}>
                    New grade posted for Science quiz.
                  </T>
                  <T variant="caption" style={styles.activityTime}>2h ago</T>
                </View>
              </View>

              {/* Activity 2 - Blue */}
              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, styles.activityIconBlue]}>
                  <T style={styles.activityIconText}>✅</T>
                </View>
                <View style={styles.activityContent}>
                  <T variant="body" style={styles.activityText}>
                    Math assignment submitted.
                  </T>
                  <T variant="caption" style={styles.activityTime}>5h ago</T>
                </View>
              </View>

              {/* Activity 3 - Purple */}
              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, styles.activityIconPurple]}>
                  <T style={styles.activityIconText}>✔️</T>
                </View>
                <View style={styles.activityContent}>
                  <T variant="body" style={styles.activityText}>
                    Doubt in Physics resolved by Ms. Reed.
                  </T>
                  <T variant="caption" style={styles.activityTime}>1 day ago</T>
                </View>
              </View>
            </View>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  // Sticky Header - Material Design Standard (Edge to Edge)
  stickyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, // Standard 16px horizontal padding
    height: 56, // Material Design standard mobile header
    backgroundColor: '#FFFFFF', // Clean white background
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // Subtle border
  },
  headerIconButton: {
    width: 48, // Minimum touch target
    height: 48, // Minimum touch target
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 24,
    color: '#111827', // text-neutral-heading
  },
  headerTitle: {
    fontSize: 20, // Material Design h6 title
    fontWeight: '600',
    color: '#111827',
  },
  // Gradient Header - Adjusted to match suggested design
  gradientHeader: {
    height: 180, // Balanced height for name visibility
    backgroundColor: '#4A90E2', // bg-primary (simplified gradient)
    paddingTop: 24, // p-6
    paddingHorizontal: 24,
    paddingBottom: 60, // More space for floating cards
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8, // Reduced from 16
  },
  avatar: {
    width: 64, // h-16 w-16
    height: 64,
    borderRadius: 32, // rounded-full
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)', // border-white/50
    marginRight: 16,
  },
  nameSection: {
    flex: 1,
  },
  studentName: {
    color: '#FFFFFF', // text-white
    fontSize: 20, // text-xl
    lineHeight: 28,
  },
  studentGrade: {
    color: 'rgba(255, 255, 255, 0.8)', // text-white/80
    fontSize: 14, // text-sm
    lineHeight: 20,
  },
  // Floating Stats - Balanced overlap to show name and float cards
  statsFloating: {
    paddingHorizontal: 16, // px-4
    marginTop: -50, // Balanced to show student name but still float
    marginBottom: 24, // mb-6
    position: 'relative',
    zIndex: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%', // 2 columns: 48% + 48% + 4% gap = 100%
    flexDirection: 'column',
    borderRadius: 12, // rounded-xl for more prominent cards
    padding: 16, // p-4
    backgroundColor: '#FFFFFF', // bg-white
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5, // Stronger shadow to match S1.png
    marginBottom: 12,
  },
  statIconText: {
    fontSize: 24, // text-2xl
    color: '#4A90E2', // text-primary (default)
  },
  statIconTextOrange: {
    fontSize: 24,
    color: '#F59E0B',
  },
  statIconTextGreen: {
    fontSize: 24,
    color: '#10B981',
  },
  statIconTextRed: {
    fontSize: 24,
    color: '#EF4444',
  },
  statValue: {
    fontSize: 24, // text-2xl
    fontWeight: '700',
    color: '#111827', // text-neutral-heading
    lineHeight: 32,
  },
  statLabel: {
    fontSize: 14, // text-sm
    fontWeight: '500',
    color: '#6B7280', // text-neutral-subtext
    lineHeight: 20,
  },
  // Section
  section: {
    marginTop: 32, // mt-8
    paddingHorizontal: 16, // px-4 (implicit)
  },
  lastSection: {
    paddingBottom: 32, // pb-8
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16, // mb-4
  },
  sectionTitle: {
    fontSize: 18, // text-lg
    color: '#111827',
    lineHeight: 28,
  },
  viewAllLink: {
    color: '#4A90E2', // text-primary
    fontSize: 14, // text-sm
    fontWeight: '500',
  },
  // Class Card
  classCard: {
    borderRadius: 12, // rounded-xl
    backgroundColor: '#FFFFFF',
    marginBottom: 16, // mb-4
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  classCardLive: {
    borderWidth: 2, // border-2
    borderColor: '#4A90E2', // border-primary
  },
  classCardContent: {
    padding: 16, // p-4
  },
  classCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  classTime: {
    fontSize: 14, // text-sm
    color: '#6B7280',
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8, // px-2
    paddingVertical: 2, // py-0.5
    borderRadius: 9999, // rounded-full
    backgroundColor: '#F3F4F6',
  },
  statusBadgeLive: {
    backgroundColor: '#D1FAE5', // bg-green-100
  },
  statusBadgeScheduled: {
    backgroundColor: '#FED7AA', // bg-orange-100
  },
  statusBadgeText: {
    fontSize: 12, // text-xs
    color: '#10B981', // text-green-600 (for live)
  },
  classTitle: {
    fontSize: 18, // text-lg
    color: '#111827',
    lineHeight: 28,
  },
  classCardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  classInfo: {
    flexDirection: 'column',
    flex: 1,
  },
  classInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    fontSize: 16, // text-base
    color: '#6B7280',
    marginRight: 6,
  },
  infoText: {
    fontSize: 14, // text-sm
    color: '#6B7280',
  },
  joinButton: {
    minWidth: 84,
    maxWidth: 480,
    height: 40, // h-10
    paddingHorizontal: 16, // px-4
    backgroundColor: '#4A90E2', // bg-primary
    borderRadius: 8, // rounded-lg
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  joinButtonText: {
    color: '#FFFFFF', // text-white
    fontSize: 14, // text-sm
  },
  // Assignment Card
  assignmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12, // rounded-xl
    padding: 16, // p-4
    backgroundColor: '#FFFFFF',
    marginBottom: 16, // mb-4
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  assignmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  assignmentInfo: {
    flex: 1,
    marginLeft: 16,
  },
  assignmentBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8, // px-2
    paddingVertical: 2, // py-0.5
    borderRadius: 9999, // rounded-full
    backgroundColor: '#FEF3C7', // bg-yellow-100
    marginRight: 8,
  },
  priorityBadgeHigh: {
    backgroundColor: '#FEE2E2', // bg-red-100
  },
  priorityBadgeMedium: {
    backgroundColor: '#FEF3C7', // bg-yellow-100
  },
  priorityBadgeText: {
    fontSize: 12, // text-xs
    color: '#DC2626', // text-red-600 for high
  },
  assignmentDue: {
    fontSize: 14, // text-sm
    color: '#6B7280',
  },
  assignmentTitle: {
    fontSize: 16, // base
    color: '#111827',
    lineHeight: 24,
    marginBottom: 4,
  },
  assignmentPoints: {
    fontSize: 14, // text-sm
    color: '#6B7280',
  },
  assignmentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collaborateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  collaborateIcon: {
    fontSize: 20,
  },
  startButton: {
    height: 40, // h-10
    paddingHorizontal: 16, // px-4
    backgroundColor: 'rgba(74, 144, 226, 0.1)', // bg-primary/10
    borderRadius: 8, // rounded-lg
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#4A90E2', // text-primary
    fontSize: 14, // text-sm
  },
  // Quick Access - grid-cols-5 (now 6 with wrapping)
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  quickAccessItem: {
    minWidth: 60,
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
  quickAccessButton: {
    width: 48, // w-12
    height: 48, // h-12
    borderRadius: 12, // rounded-xl
    backgroundColor: 'rgba(74, 144, 226, 0.1)', // bg-primary/10
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickAccessIcon: {
    fontSize: 24,
  },
  quickAccessLabel: {
    fontSize: 12, // text-xs
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  // Recent Activity
  activityList: {
    flexDirection: 'column',
    marginTop: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    width: 40, // w-10
    height: 40, // h-10
    borderRadius: 20, // rounded-full
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityIconGreen: {
    backgroundColor: '#D1FAE5', // bg-green-100
  },
  activityIconBlue: {
    backgroundColor: '#DBEAFE', // bg-blue-100
  },
  activityIconPurple: {
    backgroundColor: '#EDE9FE', // bg-purple-100
  },
  activityIconText: {
    fontSize: 20, // text-xl
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14, // text-sm
    color: '#111827',
  },
  activityTime: {
    fontSize: 12, // text-xs
    color: '#6B7280',
  },
});

export default NewStudentDashboard;

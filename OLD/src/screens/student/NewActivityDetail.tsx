/**
 * NewActivityDetail - EXACT match to HTML reference
 * Purpose: Display grade/activity details with score, feedback, and rubric
 * Design: Material Design with centered layout, score card, feedback sections
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { T } from '../../ui';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
import { ViewToggle } from '../../shared/components/ViewToggle';
import { useFadeInUp } from '../../shared/hooks/useAnimations';

type Props = NativeStackScreenProps<any, 'NewActivityDetail'>;

export default function NewActivityDetail({ route, navigation }: Props) {
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('expanded');

  // Animation hooks
  const activityAnim = useFadeInUp(0);
  const scoreAnim = useFadeInUp(150);
  const feedbackAnim = useFadeInUp(300);
  const buttonAnim = useFadeInUp(450);
  const activityType = route.params?.type || 'grade';
  const activityTitle = route.params?.title || 'Grade Received';
  const activitySubtitle = route.params?.subtitle || 'Mid-Term Physics Exam';
  const status = route.params?.status || 'Graded';
  const timestamp = route.params?.timestamp || '2 hours ago';
  const score = route.params?.score || 88;
  const totalScore = route.params?.totalScore || 100;
  const grade = route.params?.grade || 'B+';

  useEffect(() => {
    trackScreenView('NewActivityDetail');
  }, []);

  const getStatusColor = () => {
    if (status === 'Graded') return { bg: '#D1FAE5', text: '#10B981' };
    if (status === 'Pending') return { bg: '#FEF3C7', text: '#F59E0B' };
    return { bg: '#DBEAFE', text: '#4A90E2' };
  };

  const statusColors = getStatusColor();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            trackAction('back_button', 'NewActivityDetail');
            navigation.goBack();
          }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <T variant="h2" style={styles.backIcon}>←</T>
        </TouchableOpacity>

        <T variant="body" weight="semiBold" style={styles.topBarTitle}>
          Activity Detail
        </T>

        <ViewToggle
          modes={[
            { value: 'compact', icon: '▦', label: 'Compact' },
            { value: 'expanded', icon: '☰', label: 'Expanded' },
          ]}
          selectedMode={viewMode}
          onModeChange={(mode) => {
            setViewMode(mode as 'compact' | 'expanded');
            trackAction('toggle_view_mode', 'NewActivityDetail', { mode });
          }}
          size="small"
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Activity Card */}
          <Animated.View style={[styles.activityCard, activityAnim]}>
            <View style={styles.activityHeader}>
              <View style={styles.activityLeft}>
                <View style={styles.iconContainer}>
                  <T style={styles.iconText}>🎓</T>
                </View>
                <View style={styles.activityInfo}>
                  <T variant="body" weight="semiBold" style={styles.activityTitle}>
                    {activityTitle}
                  </T>
                  <T variant="caption" style={styles.activitySubtitle}>
                    {activitySubtitle}
                  </T>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                <T
                  variant="caption"
                  weight="medium"
                  style={[styles.statusText, { color: statusColors.text }]}
                >
                  {status}
                </T>
              </View>
            </View>
            <T variant="caption" style={styles.timestamp}>
              {timestamp}
            </T>
          </Animated.View>

          {/* Score Card */}
          <Animated.View style={[styles.scoreCard, scoreAnim]}>
            <T variant="body" weight="semiBold" style={styles.scoreLabel}>
              Your Score
            </T>
            <View style={styles.scoreRow}>
              <View style={styles.scoreMain}>
                <T style={styles.scoreNumber}>{score}</T>
                <T style={styles.scoreTotal}>/{totalScore}</T>
              </View>
              <T variant="body" weight="medium" style={styles.gradeText}>
                Grade: {grade}
              </T>
            </View>
          </Animated.View>

          {/* Feedback Card */}
          <Animated.View style={[styles.feedbackCard, feedbackAnim]}>
            <View style={styles.feedbackSection}>
              <T variant="body" weight="semiBold" style={styles.sectionTitle}>
                Teacher Feedback
              </T>
              <T variant="caption" style={styles.feedbackText}>
                Excellent work on the practical application section. For future reports,
                please ensure you double-check your citations and provide more detailed
                explanations in the conclusion.
              </T>
            </View>

            <View style={styles.divider} />

            <View style={styles.feedbackSection}>
              <T variant="body" weight="semiBold" style={styles.sectionTitle}>
                Grading Rubric
              </T>
              <T variant="caption" style={styles.feedbackText}>
                Details about the grading rubric would be displayed here, outlining
                points for each section of the exam.
              </T>
            </View>
          </Animated.View>

          {/* View Full Test Button */}
          <Animated.View style={buttonAnim}>
            <TouchableOpacity
              style={styles.viewTestButton}
            onPress={() => {
              trackAction('view_full_test', 'NewActivityDetail');
            }}
            accessibilityRole="button"
            accessibilityLabel="View full test"
          >
            <T style={styles.buttonIcon}>👁️</T>
            <T variant="body" weight="semiBold" style={styles.buttonText}>
              View Full Test
            </T>
          </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#111827',
  },
  topBarTitle: {
    fontSize: 18,
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,

    paddingBottom: 32,
  },
  // Activity Card
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,

  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',

  },
  activityLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 28,
  },
  activityInfo: {
    flex: 1,

  },
  activityTitle: {
    fontSize: 16,
    color: '#111827',
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusText: {
    fontSize: 12,
  },
  timestamp: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Score Card
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,

  },
  scoreLabel: {
    fontSize: 16,
    color: '#111827',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  scoreMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
  },
  scoreTotal: {
    fontSize: 24,
    fontWeight: '500',
    color: '#6B7280',
  },
  gradeText: {
    fontSize: 18,
    color: '#111827',
  },
  // Feedback Card
  feedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  feedbackSection: {

  },
  sectionTitle: {
    fontSize: 16,
    color: '#111827',
  },
  feedbackText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  // View Test Button
  viewTestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonIcon: {
    fontSize: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

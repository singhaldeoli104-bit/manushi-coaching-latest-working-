/**
 * NewAssignmentDetailScreen - Premium Minimal Design
 * Purpose: Display assignment details with submission interface
 * Used in: StudentNavigator (AssignmentsStack)
 */

import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { Badge } from '../../ui/data-display/Badge';
import { T } from '../../ui';
import { safeNavigate } from '../../utils/navigationService';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

type Props = NativeStackScreenProps<any, 'NewAssignmentDetailScreen'>;

interface AssignmentDetails {
  id: string;
  title: string;
  subject: string;
  teacher_name: string;
  description?: string;
  due_date: string;
  total_points: number;
  created_at: string;
  submission?: {
    id: string;
    status: 'pending' | 'submitted' | 'graded';
    submitted_at?: string;
    grade?: number;
    feedback?: string;
    submission_text?: string;
  };
}

export default function NewAssignmentDetailScreen({ route, navigation }: Props) {
  const { user } = useAuth();
  const assignmentId = route.params?.assignmentId;
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track screen view
  React.useEffect(() => {
    trackScreenView('NewAssignmentDetailScreen', { assignmentId });
  }, [assignmentId]);

  // Fetch assignment details
  const { data: assignment, isLoading, error, refetch } = useQuery({
    queryKey: ['assignment-detail', assignmentId],
    queryFn: async () => {
      if (!assignmentId) throw new Error('No assignment ID provided');

      // Fetch assignment with teacher and submission
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          teachers(name),
          submissions(id, status, submitted_at, grade, feedback, submission_text)
        `)
        .eq('id', assignmentId)
        .single();

      if (error) throw error;

      // Get first submission if exists
      const submissions = data.submissions as any[];
      const submission = submissions && submissions.length > 0 ? submissions[0] : undefined;

      return {
        ...data,
        teacher_name: (data.teachers as any)?.name || 'Unknown Teacher',
        submission,
      } as AssignmentDetails;
    },
    enabled: !!assignmentId,
  });

  // Set submission text from existing submission
  React.useEffect(() => {
    if (assignment?.submission?.submission_text) {
      setSubmissionText(assignment.submission.submission_text);
    }
  }, [assignment]);

  // Get assignment status
  const getStatus = (): 'pending' | 'submitted' | 'graded' | 'overdue' => {
    if (assignment?.submission) {
      return assignment.submission.status;
    }

    const dueDate = new Date(assignment?.due_date || '');
    if (dueDate < new Date()) {
      return 'overdue';
    }

    return 'pending';
  };

  // Get days until due
  const getDaysUntilDue = (): number => {
    if (!assignment) return 0;
    const dueDate = new Date(assignment.due_date);
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Handle submit assignment
  const handleSubmit = useCallback(async () => {
    if (!assignment || !user?.id) return;

    if (!submissionText.trim()) {
      Alert.alert('Empty Submission', 'Please write your answer before submitting.');
      return;
    }

    Alert.alert(
      'Submit Assignment',
      'Are you sure you want to submit this assignment? You cannot edit after submission.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            setIsSubmitting(true);
            trackAction('submit_assignment', 'NewAssignmentDetailScreen', { assignmentId });

            try {
              const { error } = await supabase.from('submissions').insert({
                assignment_id: assignmentId,
                student_id: user.id,
                submission_text: submissionText,
                status: 'submitted',
                submitted_at: new Date().toISOString(),
              });

              if (error) throw error;

              Alert.alert('Success', 'Assignment submitted successfully!');
              refetch();
            } catch (err) {
              Alert.alert('Error', 'Failed to submit assignment. Please try again.');
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  }, [assignment, assignmentId, user, submissionText, refetch]);

  if (!assignmentId) {
    return (
      <BaseScreen scrollable={false} error="No assignment ID provided">
        <View />
      </BaseScreen>
    );
  }

  const status = getStatus();
  const daysUntilDue = getDaysUntilDue();

  return (
    <BaseScreen
      scrollable={true}
      loading={isLoading}
      error={error ? 'Failed to load assignment details' : null}
      empty={!assignment}
      emptyMessage="Assignment not found"
      onRefresh={() => {
        trackAction('refresh_assignment_detail', 'NewAssignmentDetailScreen', { assignmentId });
        refetch();
      }}
    >
      {assignment && (
        <View style={styles.container}>
          {/* Assignment Header */}
          <Card style={styles.headerCard}>
            <View style={styles.headerTop}>
              <View style={styles.headerInfo}>
                <T variant="h2" weight="bold">
                  {assignment.title}
                </T>
                <T variant="body" style={styles.subject}>
                  {assignment.subject} • {assignment.teacher_name}
                </T>
              </View>
              <Badge
                variant={
                  status === 'graded'
                    ? 'success'
                    : status === 'submitted'
                    ? 'info'
                    : status === 'overdue'
                    ? 'error'
                    : 'warning'
                }
                label={
                  status === 'graded'
                    ? '✓ Graded'
                    : status === 'submitted'
                    ? '📤 Submitted'
                    : status === 'overdue'
                    ? '⚠️ Overdue'
                    : '⏰ Pending'
                }
              />
            </View>

            {/* Due Date Info */}
            <View style={styles.dueInfo}>
              <T variant="body" weight="semiBold">
                📅 Due: {new Date(assignment.due_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </T>
              {status === 'pending' && (
                <T
                  variant="caption"
                  style={[
                    styles.daysRemaining,
                    daysUntilDue <= 1 && styles.daysRemainingUrgent,
                  ]}
                >
                  {daysUntilDue > 0
                    ? `${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''} remaining`
                    : 'Due today'}
                </T>
              )}
            </View>

            {/* Points */}
            <View style={styles.pointsContainer}>
              <T variant="body" style={styles.points}>
                🏆 {assignment.total_points} points
              </T>
              {assignment.submission?.grade !== undefined && (
                <T variant="body" weight="semiBold" style={styles.grade}>
                  Your Score: {assignment.submission.grade}/{assignment.total_points}
                </T>
              )}
            </View>
          </Card>

          {/* Description */}
          {assignment.description && (
            <Card style={styles.descriptionCard}>
              <T variant="title" weight="semiBold" style={styles.sectionTitle}>
                Instructions
              </T>
              <T variant="body" style={styles.description}>
                {assignment.description}
              </T>
            </Card>
          )}

          {/* Submission Status */}
          {assignment.submission && (
            <Card style={styles.submissionCard}>
              <T variant="title" weight="semiBold" style={styles.sectionTitle}>
                Your Submission
              </T>

              {assignment.submission.submitted_at && (
                <T variant="caption" style={styles.submittedAt}>
                  Submitted on {new Date(assignment.submission.submitted_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </T>
              )}

              {assignment.submission.submission_text && (
                <View style={styles.submissionTextContainer}>
                  <T variant="body" style={styles.submissionText}>
                    {assignment.submission.submission_text}
                  </T>
                </View>
              )}

              {assignment.submission.feedback && (
                <View style={styles.feedbackContainer}>
                  <T variant="body" weight="semiBold" style={styles.feedbackTitle}>
                    Teacher Feedback:
                  </T>
                  <T variant="body" style={styles.feedbackText}>
                    {assignment.submission.feedback}
                  </T>
                </View>
              )}
            </Card>
          )}

          {/* Submission Form (only if not submitted) */}
          {!assignment.submission && status !== 'overdue' && (
            <Card style={styles.submissionFormCard}>
              <T variant="title" weight="semiBold" style={styles.sectionTitle}>
                Your Answer
              </T>

              <TextInput
                style={styles.textInput}
                value={submissionText}
                onChangeText={setSubmissionText}
                placeholder="Write your answer here..."
                multiline
                numberOfLines={10}
                textAlignVertical="top"
                editable={!isSubmitting}
                accessibilityLabel="Assignment answer input"
              />

              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel="Submit assignment"
              >
                <T variant="body" weight="semiBold" style={styles.submitButtonText}>
                  {isSubmitting ? 'Submitting...' : '📤 Submit Assignment'}
                </T>
              </TouchableOpacity>
            </Card>
          )}
        </View>
      )}
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  headerCard: {
    padding: 16,
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  subject: {
    color: '#6B7280',
  },
  dueInfo: {
    gap: 4,
  },
  daysRemaining: {
    color: '#6B7280',
  },
  daysRemainingUrgent: {
    color: '#EF4444',
    fontWeight: '600',
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  points: {
    color: '#6B7280',
  },
  grade: {
    color: '#10B981',
  },
  descriptionCard: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  description: {
    color: '#4B5563',
    lineHeight: 22,
  },
  submissionCard: {
    padding: 16,
    gap: 12,
    backgroundColor: '#F9FAFB',
  },
  submittedAt: {
    color: '#6B7280',
  },
  submissionTextContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  submissionText: {
    color: '#111827',
    lineHeight: 22,
  },
  feedbackContainer: {
    backgroundColor: '#DBEAFE',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  feedbackTitle: {
    color: '#1E40AF',
  },
  feedbackText: {
    color: '#1E3A8A',
    lineHeight: 22,
  },
  submissionFormCard: {
    padding: 16,
    gap: 16,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 200,
    fontFamily: 'System',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
  },
});

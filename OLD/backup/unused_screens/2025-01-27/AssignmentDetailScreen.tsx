import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card, Chip, Row, T, Button } from '../../ui';
import { Colors, Spacing, BorderRadius, Shadows } from '../../theme/designSystem';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';

type Props = NativeStackScreenProps<any, 'AssignmentDetailScreen'>;

type AssignmentStatus = 'upcoming' | 'overdue' | 'completed';
type AssignmentType = 'homework' | 'project' | 'quiz' | 'other';
type AssignmentPriority = 'low' | 'medium' | 'high';

interface AssignmentDetail {
  id: string;
  title: string;
  subjectName: string;
  subjectCode: string;
  type: AssignmentType;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  dueDate: string;
  dueLabel: string;
  totalPoints?: number;
  obtainedPoints?: number;
  description: string;
  attachments: string[];
  feedback?: string;
}

const MOCK_ASSIGNMENT_DETAILS: Record<string, AssignmentDetail> = {
  a1: {
    id: 'a1',
    title: 'Algebra Worksheet 03',
    subjectName: 'Mathematics',
    subjectCode: 'MATH',
    type: 'homework',
    status: 'upcoming',
    priority: 'high',
    dueDate: '2025-01-14T09:00:00Z',
    dueLabel: 'in 2 days',
    totalPoints: 20,
    obtainedPoints: undefined,
    description: 'Solve all questions in the attached PDF. Show all steps clearly, highlight theorems used, and write final answers neatly.',
    attachments: ['worksheet_03.pdf', 'formula_sheet.png'],
  },
  a2: {
    id: 'a2',
    title: 'Physics - Numericals Set 01',
    subjectName: 'Physics',
    subjectCode: 'PHYS',
    type: 'homework',
    status: 'overdue',
    priority: 'high',
    dueDate: '2025-01-10T09:00:00Z',
    dueLabel: '1 day overdue',
    totalPoints: 15,
    description: 'Complete the numericals focusing on unit conversions and free-body diagrams.',
    attachments: ['numericals_set_01.pdf'],
  },
  a3: {
    id: 'a3',
    title: 'Chemistry: Acids & Bases Quiz',
    subjectName: 'Chemistry',
    subjectCode: 'CHEM',
    type: 'quiz',
    status: 'completed',
    priority: 'medium',
    dueDate: '2025-01-08T09:00:00Z',
    dueLabel: 'submitted',
    totalPoints: 25,
    obtainedPoints: 21,
    description: 'Quiz on acids, bases, and pH calculations. Review indicators and titration basics.',
    attachments: ['quiz_results.pdf'],
    feedback: 'Good work overall. Revisit pH calculation steps; Q4 had arithmetic slip.',
  },
};

// TODO: Replace with Supabase-backed assignment detail fetching.
function useAssignmentDetail(assignmentId: string) {
  const fallback = MOCK_ASSIGNMENT_DETAILS[assignmentId] ? assignmentId : 'a1';
  const detail = MOCK_ASSIGNMENT_DETAILS[fallback];
  return { detail };
}

const typeLabel = (type: AssignmentType) => {
  if (type === 'homework') return 'Homework';
  if (type === 'project') return 'Project';
  if (type === 'quiz') return 'Quiz';
  return 'Other';
};

const statusLabel = (status: AssignmentStatus) => {
  if (status === 'upcoming') return 'Pending';
  if (status === 'overdue') return 'Overdue';
  return 'Completed';
};

const priorityLabel = (priority: AssignmentPriority) =>
  priority.charAt(0).toUpperCase() + priority.slice(1);

const priorityColor = (priority: AssignmentPriority) => {
  if (priority === 'high') return Colors.error;
  if (priority === 'medium') return Colors.warning;
  return Colors.primary;
};

export default function AssignmentDetailScreen({ route, navigation }: Props) {
  const assignmentId = route.params?.assignmentId as string;
  const { detail } = useAssignmentDetail(assignmentId);
  const [submissionText, setSubmissionText] = useState('');

  useEffect(() => {
    trackScreenView('AssignmentDetailScreen', { assignmentId: detail.id });
  }, [detail.id]);

  const scorePercent = useMemo(() => {
    if (detail.status !== 'completed' || !detail.totalPoints || !detail.obtainedPoints) return null;
    return Math.round((detail.obtainedPoints / detail.totalPoints) * 100);
  }, [detail]);

  const handleMarkSubmit = () => {
    trackAction('submit_assignment', 'AssignmentDetailScreen', { assignmentId: detail.id });
    Alert.alert('Submission', 'Submission placeholder. Your text has been noted.');
  };

  const handleAttach = () => {
    trackAction('attach_file', 'AssignmentDetailScreen', { assignmentId: detail.id });
    Alert.alert('Attach file', 'File attachment placeholder.');
  };

  const handleAIHints = () => {
    trackAction('get_ai_hints', 'AssignmentDetailScreen', { assignmentId: detail.id });
    Alert.alert('AI help', 'AI hints coming soon.');
  };

  const handlePracticeSimilar = () => {
    trackAction('practice_similar', 'AssignmentDetailScreen', { assignmentId: detail.id });
    navigation.navigate('NewEnhancedAIStudy', { assignmentId: detail.id, mode: 'practice' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BaseScreen backgroundColor={Colors.background} scrollable contentContainerStyle={styles.container}>
        <View style={styles.headerCard}>
          <T variant="subtitle" weight="bold" style={{ marginBottom: Spacing.xs }}>
            {detail.title}
          </T>
          <T variant="caption" color="textSecondary">
            {detail.subjectName} • {typeLabel(detail.type)} •{' '}
            {detail.totalPoints ? `${detail.totalPoints} points` : 'Points TBD'}
          </T>
          <T variant="caption" color="textSecondary">
            Due: {new Date(detail.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} •{' '}
            {detail.dueLabel}
          </T>
          <Row style={styles.badgeRow}>
            <Chip label={`Status: ${statusLabel(detail.status)}`} variant="assist" />
            <Chip
              label={`Priority: ${priorityLabel(detail.priority)}`}
              variant="assist"
              style={{ backgroundColor: priorityColor(detail.priority) + '20' }}
            />
          </Row>
        </View>

        <Card style={styles.sectionCard}>
          <T variant="subtitle" weight="bold" style={{ marginBottom: Spacing.sm }}>
            Description
          </T>
          <T variant="body" color="textSecondary">
            {detail.description}
          </T>
        </Card>

        <Card style={styles.sectionCard}>
          <T variant="subtitle" weight="bold" style={{ marginBottom: Spacing.sm }}>
            Attachments
          </T>
          {detail.attachments.length === 0 && (
            <T variant="body" color="textSecondary">
              No attachments provided.
            </T>
          )}
          {detail.attachments.map((file) => (
            <Row key={file} style={styles.attachmentRow}>
              <T variant="body">{file}</T>
              <T variant="body" color="textSecondary">
                ›
              </T>
            </Row>
          ))}
        </Card>

        <Card style={styles.sectionCard}>
          <T variant="subtitle" weight="bold" style={{ marginBottom: Spacing.xs }}>
            AI help (coming soon)
          </T>
          <T variant="caption" color="textSecondary" style={{ marginBottom: Spacing.sm }}>
            Use AI to get hints and step-by-step guidance for this assignment.
          </T>
          <Button variant="primary" onPress={handleAIHints} style={{ alignSelf: 'flex-start' }}>
            Get AI hints
          </Button>
        </Card>

        <Card style={styles.sectionCard}>
          <T variant="subtitle" weight="bold" style={{ marginBottom: Spacing.sm }}>
            Your submission
          </T>
          <T variant="caption" color="textSecondary" style={{ marginBottom: Spacing.xs }}>
            Status: {detail.status === 'completed' ? 'Submitted' : 'Not submitted'}
          </T>
          <View style={styles.notesBox}>
            <TextInput
              style={styles.notesInput}
              placeholder="Write your answer or notes..."
              placeholderTextColor={Colors.textSecondary}
              multiline
              value={submissionText}
              onChangeText={setSubmissionText}
            />
          </View>
          <Row style={styles.actionsRow}>
            <Button variant="outline" onPress={handleAttach} style={styles.actionButton}>
              Attach file
            </Button>
            <Button variant="primary" onPress={handleMarkSubmit} style={styles.actionButton}>
              Submit assignment
            </Button>
          </Row>
        </Card>

        <Card style={styles.sectionCard}>
          <T variant="subtitle" weight="bold" style={{ marginBottom: Spacing.sm }}>
            Feedback & grade
          </T>
          {scorePercent !== null ? (
            <T variant="body" style={{ marginBottom: Spacing.xs }}>
              Score: {detail.obtainedPoints}/{detail.totalPoints} ({scorePercent}%)
            </T>
          ) : (
            <T variant="body" color="textSecondary" style={{ marginBottom: Spacing.xs }}>
              Score: — (not graded yet)
            </T>
          )}
          <T variant="caption" color="textSecondary" style={{ marginBottom: Spacing.sm }}>
            {detail.feedback || 'Feedback will appear here after grading.'}
          </T>
          <Button variant="secondary" onPress={handlePracticeSimilar} style={{ alignSelf: 'flex-start' }}>
            Practice similar questions
          </Button>
        </Card>
      </BaseScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  headerCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.base,
    ...Shadows.resting,
  },
  badgeRow: {
    marginTop: Spacing.xs,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.base,
    ...Shadows.resting,
  },
  attachmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  notesBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    minHeight: 140,
    marginBottom: Spacing.sm,
  },
  notesInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    color: Colors.textPrimary,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  actionButton: {
    flex: 1,
  },
});

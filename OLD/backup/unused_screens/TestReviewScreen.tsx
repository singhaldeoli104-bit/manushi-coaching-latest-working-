import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card, Chip, Row, T, Button } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { Colors, Spacing, BorderRadius } from '../../theme/designSystem';

type Props = NativeStackScreenProps<any, 'TestReviewScreen'>;

type RouteParams = {
  testId: string;
  attemptId: string;
};

type VerdictLabel = 'excellent' | 'good' | 'needs_improvement';

interface TestResultSummary {
  testId: string;
  attemptId: string;
  testTitle: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  totalMarks: number;
  obtainedMarks: number;
  scorePercent: number;
  timeTakenLabel: string;
  verdict: VerdictLabel;
}

interface SubjectBreakdown {
  id: string;
  label: string;
  correct: number;
  total: number;
  percent: number;
}

type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface DifficultyBreakdown {
  level: DifficultyLevel;
  correct: number;
  total: number;
  percent: number;
}

interface Recommendation {
  id: string;
  text: string;
}

interface QuestionReviewItem {
  id: string;
  index: number;
  questionText: string;
  subjectLabel: string;
  difficulty: DifficultyLevel;
  isCorrect: boolean;
  yourAnswerLabel: string;
  yourAnswerText: string;
  correctAnswerLabel: string;
  correctAnswerText: string;
  explanation: string;
}

const DEFAULT_ATTEMPT_ID = 'mockAttempt-test_math_sample';

const MOCK_TEST_RESULTS: Record<string, TestResultSummary> = {
  'mockAttempt-test_math_sample': {
    testId: 'test_math_sample',
    attemptId: 'mockAttempt-test_math_sample',
    testTitle: 'Sample Math Test',
    totalQuestions: 10,
    correctCount: 8,
    incorrectCount: 2,
    skippedCount: 0,
    totalMarks: 20,
    obtainedMarks: 16,
    scorePercent: 80,
    timeTakenLabel: '24m 30s',
    verdict: 'good',
  },
  'mockAttempt-physics_mechanics': {
    testId: 'test_physics_mechanics',
    attemptId: 'mockAttempt-physics_mechanics',
    testTitle: 'Physics Mechanics Mock',
    totalQuestions: 12,
    correctCount: 9,
    incorrectCount: 2,
    skippedCount: 1,
    totalMarks: 24,
    obtainedMarks: 18,
    scorePercent: 75,
    timeTakenLabel: '32m 10s',
    verdict: 'needs_improvement',
  },
};

const MOCK_SUBJECT_BREAKDOWN: Record<string, SubjectBreakdown[]> = {
  'mockAttempt-test_math_sample': [
    { id: 'MATH', label: 'Mathematics', correct: 8, total: 10, percent: 80 },
  ],
  'mockAttempt-physics_mechanics': [
    { id: 'PHYS_MECH', label: 'Mechanics', correct: 5, total: 7, percent: 71 },
    { id: 'PHYS_WAVES', label: 'Waves', correct: 4, total: 5, percent: 80 },
  ],
};

const MOCK_DIFFICULTY_BREAKDOWN: Record<string, DifficultyBreakdown[]> = {
  'mockAttempt-test_math_sample': [
    { level: 'easy', correct: 4, total: 5, percent: 80 },
    { level: 'medium', correct: 3, total: 4, percent: 75 },
    { level: 'hard', correct: 1, total: 1, percent: 100 },
  ],
  'mockAttempt-physics_mechanics': [
    { level: 'easy', correct: 3, total: 4, percent: 75 },
    { level: 'medium', correct: 4, total: 5, percent: 80 },
    { level: 'hard', correct: 2, total: 3, percent: 67 },
  ],
};

const MOCK_RECOMMENDATIONS: Record<string, Recommendation[]> = {
  'mockAttempt-test_math_sample': [
    { id: 'rec1', text: 'Review mistakes in medium-difficulty Algebra questions.' },
    { id: 'rec2', text: 'Practice more word problems involving linear equations.' },
  ],
  'mockAttempt-physics_mechanics': [
    { id: 'rec3', text: 'Focus on hard Mechanics questions about rotational dynamics.' },
    { id: 'rec4', text: 'Revisit wave interference and phase difference concepts.' },
  ],
};

const MOCK_QUESTION_REVIEWS: Record<string, QuestionReviewItem[]> = {
  'mockAttempt-test_math_sample': [
    {
      id: 'q1',
      index: 0,
      questionText: 'What is the value of 2x + 3 = 7 when x = 2?',
      subjectLabel: 'Mathematics',
      difficulty: 'easy',
      isCorrect: true,
      yourAnswerLabel: 'B',
      yourAnswerText: '4',
      correctAnswerLabel: 'B',
      correctAnswerText: '4',
      explanation: 'Substitute x = 2 to get 2(2) + 3 = 7, so the value is 4.',
    },
    {
      id: 'q2',
      index: 1,
      questionText: 'The graph of y = mx + c is:',
      subjectLabel: 'Mathematics',
      difficulty: 'easy',
      isCorrect: false,
      yourAnswerLabel: 'C',
      yourAnswerText: 'A circle',
      correctAnswerLabel: 'B',
      correctAnswerText: 'A straight line',
      explanation: 'The equation y = mx + c represents a straight line with slope m and intercept c.',
    },
    {
      id: 'q3',
      index: 2,
      questionText: 'Solve for x: 3x - 5 = 16.',
      subjectLabel: 'Mathematics',
      difficulty: 'medium',
      isCorrect: true,
      yourAnswerLabel: 'A',
      yourAnswerText: '7',
      correctAnswerLabel: 'A',
      correctAnswerText: '7',
      explanation: 'Add 5 to both sides to get 3x = 21, then divide by 3 to find x = 7.',
    },
    {
      id: 'q4',
      index: 3,
      questionText: 'Which of the following represents a quadratic equation?',
      subjectLabel: 'Mathematics',
      difficulty: 'medium',
      isCorrect: true,
      yourAnswerLabel: 'D',
      yourAnswerText: 'x^2 + 3x + 2 = 0',
      correctAnswerLabel: 'D',
      correctAnswerText: 'x^2 + 3x + 2 = 0',
      explanation: 'A quadratic equation is in the form ax^2 + bx + c = 0.',
    },
    {
      id: 'q5',
      index: 4,
      questionText: 'Find the derivative of f(x) = 4x^3.',
      subjectLabel: 'Mathematics',
      difficulty: 'hard',
      isCorrect: true,
      yourAnswerLabel: 'B',
      yourAnswerText: '12x^2',
      correctAnswerLabel: 'B',
      correctAnswerText: '12x^2',
      explanation: 'Using the power rule d/dx (x^n) = n*x^(n-1), the derivative is 12x^2.',
    },
    {
      id: 'q6',
      index: 5,
      questionText: 'Evaluate: integral of 2x dx from 0 to 3.',
      subjectLabel: 'Mathematics',
      difficulty: 'medium',
      isCorrect: false,
      yourAnswerLabel: 'A',
      yourAnswerText: '6',
      correctAnswerLabel: 'C',
      correctAnswerText: '9',
      explanation: 'Integral of 2x is x^2. Evaluate x^2 from 0 to 3 to get 9.',
    },
  ],
  'mockAttempt-physics_mechanics': [
    {
      id: 'pq1',
      index: 0,
      questionText: 'A body moves in a circle with constant speed. What is the direction of acceleration?',
      subjectLabel: 'Physics',
      difficulty: 'easy',
      isCorrect: true,
      yourAnswerLabel: 'A',
      yourAnswerText: 'Toward the center',
      correctAnswerLabel: 'A',
      correctAnswerText: 'Toward the center',
      explanation: 'Centripetal acceleration always points to the center of the circular path.',
    },
    {
      id: 'pq2',
      index: 1,
      questionText: 'Torque is given by which cross product?',
      subjectLabel: 'Physics',
      difficulty: 'medium',
      isCorrect: true,
      yourAnswerLabel: 'B',
      yourAnswerText: 'r x F',
      correctAnswerLabel: 'B',
      correctAnswerText: 'r x F',
      explanation: 'Torque tau = r x F, where r is position vector and F is force.',
    },
    {
      id: 'pq3',
      index: 2,
      questionText: 'For small oscillations, a simple pendulum period is proportional to:',
      subjectLabel: 'Physics',
      difficulty: 'medium',
      isCorrect: false,
      yourAnswerLabel: 'D',
      yourAnswerText: 'Length squared',
      correctAnswerLabel: 'C',
      correctAnswerText: 'Square root of length',
      explanation: 'Period T = 2 * pi * sqrt(L/g); it scales with the square root of the length.',
    },
    {
      id: 'pq4',
      index: 3,
      questionText: 'In wave interference, points of destructive interference have phase difference of:',
      subjectLabel: 'Physics',
      difficulty: 'hard',
      isCorrect: false,
      yourAnswerLabel: 'A',
      yourAnswerText: '0 degrees',
      correctAnswerLabel: 'B',
      correctAnswerText: '180 degrees (pi radians)',
      explanation: 'Destructive interference occurs when waves are out of phase by pi radians.',
    },
    {
      id: 'pq5',
      index: 4,
      questionText: 'Work done by conservative forces over a closed path is:',
      subjectLabel: 'Physics',
      difficulty: 'easy',
      isCorrect: true,
      yourAnswerLabel: 'C',
      yourAnswerText: 'Zero',
      correctAnswerLabel: 'C',
      correctAnswerText: 'Zero',
      explanation: 'For conservative forces, net work in a closed loop is zero.',
    },
    {
      id: 'pq6',
      index: 5,
      questionText: 'Which law relates angular momentum change to applied torque?',
      subjectLabel: 'Physics',
      difficulty: 'hard',
      isCorrect: true,
      yourAnswerLabel: 'D',
      yourAnswerText: 'tau = dL/dt',
      correctAnswerLabel: 'D',
      correctAnswerText: 'tau = dL/dt',
      explanation: "Newton's second law for rotation: torque equals rate of change of angular momentum.",
    },
  ],
};

function useTestReview(testId: string, attemptId: string) {
  // TODO: Replace with Supabase-backed test review fetching.
  const summary = MOCK_TEST_RESULTS[attemptId] ?? MOCK_TEST_RESULTS[DEFAULT_ATTEMPT_ID];
  const subjects = MOCK_SUBJECT_BREAKDOWN[attemptId] ?? MOCK_SUBJECT_BREAKDOWN[DEFAULT_ATTEMPT_ID];
  const difficulties =
    MOCK_DIFFICULTY_BREAKDOWN[attemptId] ?? MOCK_DIFFICULTY_BREAKDOWN[DEFAULT_ATTEMPT_ID];
  const recommendations =
    MOCK_RECOMMENDATIONS[attemptId] ?? MOCK_RECOMMENDATIONS[DEFAULT_ATTEMPT_ID];
  const questions = MOCK_QUESTION_REVIEWS[attemptId] ?? MOCK_QUESTION_REVIEWS[DEFAULT_ATTEMPT_ID];

  return {
    summary,
    subjects,
    difficulties,
    recommendations,
    questions,
  };
}

function getVerdictLabel(verdict: VerdictLabel): string {
  switch (verdict) {
    case 'excellent':
      return 'Excellent';
    case 'good':
      return 'Good job';
    case 'needs_improvement':
      return 'Needs improvement';
    default:
      return 'Summary';
  }
}

function getDifficultyLabel(level: DifficultyLevel): string {
  if (level === 'easy') return 'Easy';
  if (level === 'medium') return 'Medium';
  return 'Hard';
}

function getDifficultyColor(level: DifficultyLevel): string {
  if (level === 'easy') return Colors.success;
  if (level === 'medium') return Colors.warning;
  return Colors.error;
}

export default function TestReviewScreen({ route, navigation }: Props) {
  const { testId, attemptId } = route.params as RouteParams;
  const { summary, subjects, difficulties, recommendations, questions } = useTestReview(
    testId,
    attemptId,
  );

  useEffect(() => {
    trackScreenView('TestReviewScreen', { testId, attemptId });
  }, [testId, attemptId]);

  const handleBackToCenter = () => {
    trackAction('test_review_back_to_center', 'TestReviewScreen', { testId, attemptId });
    navigation.navigate('TestCenterScreen' as any);
  };

  const handleRetakePractice = () => {
    trackAction('test_review_retake', 'TestReviewScreen', {
      testId,
      attemptId,
      mode: 'practice',
    });
    navigation.navigate('TestAttemptScreen', { testId, mode: 'practice' } as any);
  };

  const handleAIPractice = () => {
    trackAction('test_review_ai_practice', 'TestReviewScreen', { testId, attemptId });
    navigation.navigate('NewEnhancedAIStudy', { testId, mode: 'review' } as any);
  };

  const renderProgress = (percent: number) => (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, percent))}%` }]} />
    </View>
  );

  return (
    <BaseScreen backgroundColor={Colors.background} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <T variant="title">{summary.testTitle}</T>
        <T variant="caption" color="textSecondary">
          Test review - Attempt ID: {summary.attemptId}
        </T>
      </View>

      <Card style={styles.card}>
        <Row style={styles.cardHeader} spaceBetween centerV>
          <T variant="subtitle" weight="semiBold">
            Overall result
          </T>
          <Chip variant="assist" label={getVerdictLabel(summary.verdict)} />
        </Row>
        <Row style={styles.summaryRow} spaceBetween>
          <T variant="body" weight="semiBold">
            Score: {summary.obtainedMarks} / {summary.totalMarks}
          </T>
          <T variant="body" color="textSecondary">
            Time taken: {summary.timeTakenLabel}
          </T>
        </Row>
        <Row style={styles.summaryRow} spaceBetween>
          <T variant="body">Percent: {summary.scorePercent}%</T>
          <T variant="body">Accuracy: {summary.correctCount} correct</T>
        </Row>
        <T variant="caption" color="textSecondary" style={styles.metaText}>
          Incorrect: {summary.incorrectCount} | Skipped: {summary.skippedCount}
        </T>
        {renderProgress(summary.scorePercent)}
      </Card>

      <Card style={styles.card}>
        <Row style={styles.cardHeader} spaceBetween centerV>
          <T variant="subtitle" weight="semiBold">
            By subject / section
          </T>
        </Row>
        {subjects.map((subject) => (
          <View key={subject.id} style={styles.breakdownRow}>
            <Row spaceBetween centerV>
              <T variant="body" weight="semiBold">
                {subject.label}
              </T>
              <T variant="caption" color="textSecondary">
                {subject.correct}/{subject.total} correct ({subject.percent}%)
              </T>
            </Row>
            {renderProgress(subject.percent)}
          </View>
        ))}
      </Card>

      <Card style={styles.card}>
        <Row style={styles.cardHeader} spaceBetween centerV>
          <T variant="subtitle" weight="semiBold">
            By difficulty
          </T>
        </Row>
        {difficulties.map((item) => (
          <View key={item.level} style={styles.breakdownRow}>
            <Row spaceBetween centerV>
              <Row centerV gap={Spacing.sm}>
                <View
                  style={[
                    styles.difficultyDot,
                    { backgroundColor: getDifficultyColor(item.level) },
                  ]}
                />
                <T variant="body" weight="semiBold">
                  {getDifficultyLabel(item.level)}
                </T>
              </Row>
              <T variant="caption" color="textSecondary">
                {item.correct}/{item.total} correct ({item.percent}%)
              </T>
            </Row>
            {renderProgress(item.percent)}
          </View>
        ))}
      </Card>

      <Card style={styles.card}>
        <Row style={styles.cardHeader} spaceBetween centerV>
          <T variant="subtitle" weight="semiBold">
            Recommendations
          </T>
        </Row>
        {recommendations.length === 0 ? (
          <T variant="body" color="textSecondary">
            No specific recommendations for this test.
          </T>
        ) : (
          recommendations.map((rec) => (
            <Row key={rec.id} gap={Spacing.sm} style={styles.recommendationRow} centerV>
              <T variant="body">-</T>
              <T variant="body" style={styles.recommendationText}>
                {rec.text}
              </T>
            </Row>
          ))
        )}
        <Button variant="primary" onPress={handleAIPractice} style={styles.ctaButton}>
          Practice weak topics with AI
        </Button>
      </Card>

      <Card style={styles.card}>
        <Row style={styles.cardHeader} spaceBetween centerV>
          <T variant="subtitle" weight="semiBold">
            Question review
          </T>
          <T variant="caption" color="textSecondary">
            {questions.length} questions
          </T>
        </Row>
        <View style={styles.questionList}>
          {questions.map((q, idx) => (
            <View
              key={q.id}
              style={[styles.questionItem, idx !== questions.length - 1 && styles.questionDivider]}
            >
              <Row spaceBetween centerV>
                <Row centerV gap={Spacing.sm}>
                  <T variant="body" weight="semiBold">
                    Q{q.index + 1}
                  </T>
                  <View
                    style={[
                      styles.statusPill,
                      q.isCorrect ? styles.statusCorrect : styles.statusIncorrect,
                    ]}
                  >
                    <T variant="caption" weight="medium" style={styles.statusText}>
                      {q.isCorrect ? 'Correct' : 'Incorrect'}
                    </T>
                  </View>
                </Row>
                <Row gap={Spacing.sm}>
                  <Chip variant="assist" label={getDifficultyLabel(q.difficulty)} />
                  <Chip variant="assist" label={q.subjectLabel} />
                </Row>
              </Row>
              <T variant="body" style={styles.questionText}>
                {q.questionText}
              </T>
              <T variant="caption" color="textSecondary" style={styles.answerText}>
                Your answer: {q.yourAnswerLabel}. {q.yourAnswerText}
              </T>
              <T variant="caption" color="textSecondary" style={styles.answerText}>
                Correct answer: {q.correctAnswerLabel}. {q.correctAnswerText}
              </T>
              <T variant="caption" color="textSecondary" style={styles.answerText}>
                Explanation: {q.explanation}
              </T>
            </View>
          ))}
        </View>
      </Card>

      <Row gap={Spacing.md} style={styles.bottomActions}>
        <Button variant="ghost" style={styles.flexButton} onPress={handleBackToCenter}>
          Back to Test Center
        </Button>
        <Button variant="primary" style={styles.flexButton} onPress={handleRetakePractice}>
          Retake as practice
        </Button>
      </Row>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  header: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  cardHeader: {
    marginBottom: Spacing.xs,
  },
  summaryRow: {
    marginTop: Spacing.xs,
  },
  metaText: {
    marginTop: Spacing.xs,
  },
  breakdownRow: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  progressTrack: {
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceVariant,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  difficultyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  recommendationRow: {
    alignItems: 'flex-start',
    marginTop: Spacing.xs,
  },
  recommendationText: {
    flex: 1,
  },
  ctaButton: {
    marginTop: Spacing.md,
  },
  questionList: {
    gap: Spacing.md,
  },
  questionItem: {
    gap: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  questionDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  questionText: {
    marginTop: Spacing.xs,
  },
  answerText: {
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusCorrect: {
    backgroundColor: Colors.successLight,
  },
  statusIncorrect: {
    backgroundColor: Colors.errorLight,
  },
  statusText: {
    color: Colors.textPrimary,
  },
  bottomActions: {
    marginTop: Spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
});

/**
 * QuizInterface Component
 *
 * Complete quiz interface for live class quizzes with real-time functionality.
 *
 * Features:
 * - Question display with elevated card
 * - Multiple choice answer options
 * - Navigation controls (Previous, Next, Submit)
 * - Circular timer with countdown
 * - Progress tracking with linear indicator
 * - Question navigator with Tabs
 * - Review screen showing all answers
 * - Results screen with score and confetti
 * - Supabase integration for quiz data
 * - Real-time auto-submit on timer end
 * - Material Design 3 styling
 *
 * @example
 * <QuizInterface
 *   quizId="quiz_123"
 *   classId="class_456"
 *   studentId="student_789"
 *   onComplete={(score) => console.log('Quiz complete:', score)}
 * />
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';

// Screen states
export type QuizState = 'loading' | 'taking' | 'review' | 'results';

// Question Data
export interface QuizQuestion {
  /** Question ID */
  id: string;

  /** Question text */
  question: string;

  /** Question number (1-based) */
  questionNumber: number;

  /** Answer options */
  options: QuizOption[];

  /** Correct option ID (for results) */
  correctOptionId?: string;

  /** Time limit per question (seconds) */
  timeLimit?: number;
}

// Quiz Option
export interface QuizOption {
  /** Option ID */
  id: string;

  /** Option text */
  text: string;

  /** Option label (A, B, C, D) */
  label: string;
}

// Quiz Data
export interface Quiz {
  /** Quiz ID */
  id: string;

  /** Quiz title */
  title: string;

  /** Questions */
  questions: QuizQuestion[];

  /** Total time limit (seconds) */
  totalTimeLimit: number;

  /** Passing score percentage */
  passingScore: number;

  /** Created timestamp */
  createdAt: string;
}

// Student Answer
export interface StudentAnswer {
  /** Question ID */
  questionId: string;

  /** Selected option ID */
  selectedOptionId: string;

  /** Is correct */
  isCorrect?: boolean;
}

// Quiz Result
export interface QuizResult {
  /** Total questions */
  totalQuestions: number;

  /** Correct answers */
  correctAnswers: number;

  /** Wrong answers */
  wrongAnswers: number;

  /** Unanswered questions */
  unanswered: number;

  /** Score percentage */
  scorePercentage: number;

  /** Grade (A+, A, B, C, D, F) */
  grade: string;

  /** Passed */
  passed: boolean;

  /** Time taken (seconds) */
  timeTaken: number;
}

// Component Props
interface QuizInterfaceProps {
  /** Quiz ID */
  quizId: string;

  /** Class ID */
  classId: string;

  /** Student ID */
  studentId: string;

  /** Callback when quiz is completed */
  onComplete?: (result: QuizResult) => void;

  /** Callback when quiz is exited */
  onExit?: () => void;
}

/**
 * Fetch quiz data from Supabase
 */
const fetchQuiz = async (quizId: string): Promise<Quiz> => {
  const { data: quizData, error: quizError } = await supabase
    .from('quizzes')
    .select('id, title, total_time_limit, passing_score, created_at')
    .eq('id', quizId)
    .single();

  if (quizError) {
    throw new Error(`Failed to fetch quiz: ${quizError.message}`);
  }

  const { data: questionsData, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('id, question_text, question_number, correct_option_id, time_limit, options:quiz_options(id, option_text, option_label)')
    .eq('quiz_id', quizId)
    .order('question_number', { ascending: true });

  if (questionsError) {
    throw new Error(`Failed to fetch questions: ${questionsError.message}`);
  }

  const questions: QuizQuestion[] = (questionsData || []).map((q: any) => ({
    id: q.id,
    question: q.question_text,
    questionNumber: q.question_number,
    options: (q.options || []).map((opt: any) => ({
      id: opt.id,
      text: opt.option_text,
      label: opt.option_label,
    })),
    correctOptionId: q.correct_option_id,
    timeLimit: q.time_limit,
  }));

  return {
    id: quizData.id,
    title: quizData.title,
    questions,
    totalTimeLimit: quizData.total_time_limit,
    passingScore: quizData.passing_score,
    createdAt: quizData.created_at,
  };
};

/**
 * Submit quiz answers to Supabase
 */
const submitQuizAnswers = async (
  quizId: string,
  studentId: string,
  answers: StudentAnswer[],
  timeTaken: number
): Promise<QuizResult> => {
  const { data, error } = await supabase
    .from('quiz_submissions')
    .insert({
      quiz_id: quizId,
      student_id: studentId,
      answers: JSON.stringify(answers),
      time_taken: timeTaken,
      submitted_at: new Date().toISOString(),
    })
    .select('id, score_percentage, grade, passed')
    .single();

  if (error) {
    throw new Error(`Failed to submit quiz: ${error.message}`);
  }

  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const wrongAnswers = answers.filter((a) => !a.isCorrect && a.selectedOptionId).length;
  const unanswered = answers.filter((a) => !a.selectedOptionId).length;

  return {
    totalQuestions: answers.length,
    correctAnswers,
    wrongAnswers,
    unanswered,
    scorePercentage: data.score_percentage,
    grade: data.grade,
    passed: data.passed,
    timeTaken,
  };
};

/**
 * Calculate grade from percentage
 */
const calculateGrade = (percentage: number): string => {
  if (percentage >= 95) return 'A+';
  if (percentage >= 90) return 'A';
  if (percentage >= 85) return 'A-';
  if (percentage >= 80) return 'B+';
  if (percentage >= 75) return 'B';
  if (percentage >= 70) return 'B-';
  if (percentage >= 65) return 'C+';
  if (percentage >= 60) return 'C';
  if (percentage >= 55) return 'C-';
  if (percentage >= 50) return 'D';
  return 'F';
};

/**
 * Format time as MM:SS
 */
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * QuizInterface Component
 */
const QuizInterface: React.FC<QuizInterfaceProps> = ({
  quizId,
  classId,
  studentId,
  onComplete,
  onExit,
}) => {
  const queryClient = useQueryClient();

  // State
  const [quizState, setQuizState] = useState<QuizState>('taking');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Fetch quiz data
  const {
    data: quiz,
    isLoading,
    error,
  } = useQuery<Quiz, Error>({
    queryKey: ['quiz', quizId],
    queryFn: () => fetchQuiz(quizId),
    enabled: !!quizId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Submit quiz mutation
  const submitMutation = useMutation({
    mutationFn: (data: { answers: StudentAnswer[]; timeTaken: number }) =>
      submitQuizAnswers(quizId, studentId, data.answers, data.timeTaken),
    onSuccess: (result) => {
      setQuizResult(result);
      setQuizState('results');
      onComplete?.(result);
    },
  });

  // Initialize timer when quiz loads
  useEffect(() => {
    if (quiz) {
      setTimeRemaining(quiz.totalTimeLimit);
    }
  }, [quiz]);

  // Timer countdown
  useEffect(() => {
    if (quizState !== 'taking' || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizState, timeRemaining]);

  /**
   * Handle answer selection
   */
  const handleSelectAnswer = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      newAnswers.set(questionId, optionId);
      return newAnswers;
    });
  }, []);

  /**
   * Navigate to next question
   */
  const handleNext = useCallback(() => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [quiz, currentQuestionIndex]);

  /**
   * Navigate to previous question
   */
  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  /**
   * Jump to specific question
   */
  const handleJumpToQuestion = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
  }, []);

  /**
   * Submit quiz
   */
  const handleSubmitQuiz = useCallback(() => {
    if (!quiz) return;

    const timeTaken = quiz.totalTimeLimit - timeRemaining;
    const studentAnswers: StudentAnswer[] = quiz.questions.map((q) => ({
      questionId: q.id,
      selectedOptionId: answers.get(q.id) || '',
      isCorrect: answers.get(q.id) === q.correctOptionId,
    }));

    submitMutation.mutate({ answers: studentAnswers, timeTaken });
  }, [quiz, answers, timeRemaining, submitMutation]);

  /**
   * Calculate progress
   */
  const progress = useMemo(() => {
    if (!quiz) return 0;
    return (answers.size / quiz.questions.length) * 100;
  }, [quiz, answers]);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={LightTheme.Primary} />
        <Text style={[Typography.bodyMedium, styles.loadingText]}>
          Loading quiz...
        </Text>
      </View>
    );
  }

  // Error state
  if (error || !quiz) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[Typography.titleLarge, styles.errorTitle]}>Error</Text>
        <Text style={[Typography.bodyMedium, styles.errorText]}>
          {error?.message || 'Failed to load quiz'}
        </Text>
      </View>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedAnswer = answers.get(currentQuestion.id);
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  // Results state
  if (quizState === 'results' && quizResult) {
    const highScore = quizResult.scorePercentage >= 80;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.resultsContainer}>
          {/* Score Card */}
          <View style={[styles.resultCard, highScore && styles.resultCardHighScore]}>
            <Text style={[Typography.headlineSmall, styles.resultTitle]}>
              Quiz Complete!
            </Text>

            {/* Score */}
            <Text style={[Typography.displayLarge, styles.scoreText]}>
              {quizResult.scorePercentage}%
            </Text>

            {/* Grade */}
            <View style={[styles.gradeBadge, highScore && styles.gradeBadgeHighScore]}>
              <Text style={[Typography.headlineMedium, styles.gradeText]}>
                {quizResult.grade}
              </Text>
            </View>

            {/* Status */}
            <Text
              style={[
                Typography.titleMedium,
                highScore ? styles.passedText : styles.failedText,
              ]}
            >
              {quizResult.passed ? '✅ Passed' : '❌ Failed'}
            </Text>

            {/* Summary */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={[Typography.bodyMedium, styles.summaryLabel]}>
                  Correct:
                </Text>
                <Text style={[Typography.titleMedium, styles.correctText]}>
                  {quizResult.correctAnswers}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[Typography.bodyMedium, styles.summaryLabel]}>
                  Wrong:
                </Text>
                <Text style={[Typography.titleMedium, styles.wrongText]}>
                  {quizResult.wrongAnswers}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[Typography.bodyMedium, styles.summaryLabel]}>
                  Unanswered:
                </Text>
                <Text style={[Typography.titleMedium, styles.unansweredText]}>
                  {quizResult.unanswered}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[Typography.bodyMedium, styles.summaryLabel]}>
                  Time Taken:
                </Text>
                <Text style={[Typography.titleMedium, styles.timeText]}>
                  {formatTime(quizResult.timeTaken)}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <Pressable
            style={({ pressed }) => [
              styles.reviewButton,
              pressed && styles.reviewButtonPressed,
            ]}
            onPress={() => setQuizState('review')}
          >
            <Text style={[Typography.labelLarge, styles.reviewButtonText]}>
              Review Answers
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.exitButton,
              pressed && styles.exitButtonPressed,
            ]}
            onPress={onExit}
          >
            <Text style={[Typography.labelLarge, styles.exitButtonText]}>
              Exit Quiz
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // Review state
  if (quizState === 'review') {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.reviewContainer}>
          <Text style={[Typography.headlineMedium, styles.reviewTitle]}>
            Review Answers
          </Text>

          {quiz.questions.map((question, index) => {
            const userAnswer = answers.get(question.id);
            const isCorrect = userAnswer === question.correctOptionId;

            return (
              <View key={question.id} style={styles.reviewQuestionCard}>
                {/* Question Number and Status */}
                <View style={styles.reviewQuestionHeader}>
                  <Text style={[Typography.titleMedium, styles.questionNumber]}>
                    Question {index + 1}
                  </Text>
                  <Text style={[Typography.labelLarge, isCorrect ? styles.correctBadge : styles.wrongBadge]}>
                    {isCorrect ? '✓ Correct' : '✗ Wrong'}
                  </Text>
                </View>

                {/* Question Text */}
                <Text style={[Typography.bodyLarge, styles.reviewQuestionText]}>
                  {question.question}
                </Text>

                {/* Options */}
                {question.options.map((option) => {
                  const isUserAnswer = option.id === userAnswer;
                  const isCorrectAnswer = option.id === question.correctOptionId;

                  return (
                    <View
                      key={option.id}
                      style={[
                        styles.reviewOption,
                        isUserAnswer && styles.reviewOptionSelected,
                        isCorrectAnswer && styles.reviewOptionCorrect,
                      ]}
                    >
                      <Text
                        style={[
                          Typography.bodyMedium,
                          isCorrectAnswer && styles.reviewOptionCorrectText,
                        ]}
                      >
                        {option.label}. {option.text}
                        {isUserAnswer && ' (Your answer)'}
                        {isCorrectAnswer && ' ✓'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            );
          })}

          {/* Back to Results */}
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
            onPress={() => setQuizState('results')}
          >
            <Text style={[Typography.labelLarge, styles.backButtonText]}>
              Back to Results
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // Taking quiz state
  return (
    <View style={styles.container}>
      {/* Header with Timer and Progress */}
      <View style={styles.header}>
        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text
            style={[
              Typography.titleLarge,
              timeRemaining < 60 ? styles.timerWarning : styles.timerNormal,
            ]}
          >
            ⏱️ {formatTime(timeRemaining)}
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={[Typography.bodySmall, styles.progressText]}>
            Progress: {answers.size}/{quiz.questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>

      {/* Question Card */}
      <ScrollView style={styles.questionContainer}>
        <View style={styles.questionCard}>
          {/* Question Number */}
          <View style={styles.questionHeader}>
            <Text style={[Typography.titleMedium, styles.questionNumberText]}>
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </Text>
            {selectedAnswer && (
              <Text style={[Typography.labelSmall, styles.answeredBadge]}>
                ✓ Answered
              </Text>
            )}
          </View>

          {/* Question Text */}
          <Text style={[Typography.titleLarge, styles.questionText]}>
            {currentQuestion.question}
          </Text>

          {/* Answer Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer === option.id;

              return (
                <Pressable
                  key={option.id}
                  style={({ pressed }) => [
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                    pressed && styles.optionCardPressed,
                  ]}
                  onPress={() => handleSelectAnswer(currentQuestion.id, option.id)}
                >
                  {/* Radio Button */}
                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </View>

                  {/* Option Text */}
                  <View style={styles.optionTextContainer}>
                    <Text
                      style={[
                        Typography.labelLarge,
                        styles.optionLabel,
                        isSelected && styles.optionLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={[
                        Typography.bodyLarge,
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option.text}
                    </Text>
                  </View>

                  {/* Checkmark */}
                  {isSelected && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Navigation Controls */}
      <View style={styles.navigationContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.navButton,
            styles.previousButton,
            currentQuestionIndex === 0 && styles.navButtonDisabled,
            pressed && styles.navButtonPressed,
          ]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Text
            style={[
              Typography.labelLarge,
              styles.navButtonText,
              currentQuestionIndex === 0 && styles.navButtonTextDisabled,
            ]}
          >
            ← Previous
          </Text>
        </Pressable>

        {isLastQuestion ? (
          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              styles.submitButton,
              !selectedAnswer && styles.navButtonDisabled,
              pressed && styles.navButtonPressed,
            ]}
            onPress={handleSubmitQuiz}
            disabled={!selectedAnswer}
          >
            <Text style={[Typography.labelLarge, styles.submitButtonText]}>
              Submit Quiz
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              styles.nextButton,
              !selectedAnswer && styles.navButtonDisabled,
              pressed && styles.navButtonPressed,
            ]}
            onPress={handleNext}
            disabled={!selectedAnswer}
          >
            <Text
              style={[
                Typography.labelLarge,
                styles.navButtonText,
                !selectedAnswer && styles.navButtonTextDisabled,
              ]}
            >
              Next →
            </Text>
          </Pressable>
        )}
      </View>

      {/* Question Navigator */}
      <View style={styles.questionNavigator}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navigatorContent}
        >
          {quiz.questions.map((question, index) => {
            const isAnswered = answers.has(question.id);
            const isCurrent = index === currentQuestionIndex;

            return (
              <Pressable
                key={question.id}
                style={({ pressed }) => [
                  styles.navigatorDot,
                  isAnswered && styles.navigatorDotAnswered,
                  isCurrent && styles.navigatorDotCurrent,
                  pressed && styles.navigatorDotPressed,
                ]}
                onPress={() => handleJumpToQuestion(index)}
              >
                <Text
                  style={[
                    Typography.labelSmall,
                    styles.navigatorDotText,
                    (isAnswered || isCurrent) && styles.navigatorDotTextActive,
                  ]}
                >
                  {index + 1}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightTheme.Surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    color: LightTheme.OnSurface,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    color: LightTheme.Error,
    marginBottom: 8,
  },
  errorText: {
    color: LightTheme.OnSurface,
    textAlign: 'center',
  },

  // Header
  header: {
    padding: 16,
    backgroundColor: LightTheme.SurfaceVariant,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.OutlineVariant,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  timerNormal: {
    color: LightTheme.Primary,
  },
  timerWarning: {
    color: LightTheme.Error,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    color: LightTheme.OnSurfaceVariant,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: LightTheme.Primary,
    borderRadius: 4,
  },

  // Question Card
  questionContainer: {
    flex: 1,
  },
  questionCard: {
    padding: 20,
    backgroundColor: LightTheme.Surface,
    borderRadius: 16,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionNumberText: {
    color: LightTheme.Primary,
  },
  answeredBadge: {
    backgroundColor: LightTheme.PrimaryContainer,
    color: LightTheme.OnPrimaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  questionText: {
    color: LightTheme.OnSurface,
    marginBottom: 24,
  },

  // Options
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: LightTheme.Surface,
    borderWidth: 2,
    borderColor: LightTheme.Outline,
    borderRadius: 12,
  },
  optionCardSelected: {
    backgroundColor: LightTheme.PrimaryContainer,
    borderColor: LightTheme.Primary,
  },
  optionCardPressed: {
    opacity: 0.8,
  },
  radioContainer: {
    marginRight: 12,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: LightTheme.Outline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: LightTheme.Primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: LightTheme.Primary,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    color: LightTheme.OnSurface,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: LightTheme.OnPrimaryContainer,
  },
  optionText: {
    color: LightTheme.OnSurface,
  },
  optionTextSelected: {
    color: LightTheme.OnPrimaryContainer,
  },
  checkmark: {
    fontSize: 20,
    color: LightTheme.Primary,
    marginLeft: 8,
  },

  // Navigation
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: LightTheme.OutlineVariant,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previousButton: {
    backgroundColor: LightTheme.SurfaceVariant,
  },
  nextButton: {
    backgroundColor: LightTheme.Primary,
  },
  submitButton: {
    backgroundColor: LightTheme.Primary,
  },
  navButtonDisabled: {
    backgroundColor: LightTheme.SurfaceVariant,
    opacity: 0.5,
  },
  navButtonPressed: {
    opacity: 0.8,
  },
  navButtonText: {
    color: LightTheme.OnPrimary,
  },
  navButtonTextDisabled: {
    color: LightTheme.OnSurfaceVariant,
  },
  submitButtonText: {
    color: LightTheme.OnPrimary,
    fontWeight: '600',
  },

  // Question Navigator
  questionNavigator: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: LightTheme.OutlineVariant,
  },
  navigatorContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  navigatorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: LightTheme.Outline,
    backgroundColor: LightTheme.Surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigatorDotAnswered: {
    backgroundColor: LightTheme.TertiaryContainer,
    borderColor: LightTheme.Tertiary,
  },
  navigatorDotCurrent: {
    backgroundColor: LightTheme.PrimaryContainer,
    borderColor: LightTheme.Primary,
  },
  navigatorDotPressed: {
    opacity: 0.8,
  },
  navigatorDotText: {
    color: LightTheme.OnSurfaceVariant,
  },
  navigatorDotTextActive: {
    color: LightTheme.OnPrimaryContainer,
    fontWeight: '600',
  },

  // Results
  resultsContainer: {
    padding: 24,
  },
  resultCard: {
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  resultCardHighScore: {
    backgroundColor: LightTheme.PrimaryContainer,
  },
  resultTitle: {
    color: LightTheme.OnSurface,
    marginBottom: 24,
  },
  scoreText: {
    color: LightTheme.Primary,
    fontWeight: '700',
  },
  gradeBadge: {
    backgroundColor: LightTheme.SecondaryContainer,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
    marginVertical: 16,
  },
  gradeBadgeHighScore: {
    backgroundColor: LightTheme.Primary,
  },
  gradeText: {
    color: LightTheme.OnSecondaryContainer,
    fontWeight: '700',
  },
  passedText: {
    color: LightTheme.Primary,
    marginBottom: 24,
  },
  failedText: {
    color: LightTheme.Error,
    marginBottom: 24,
  },
  summaryContainer: {
    width: '100%',
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: LightTheme.OnSurfaceVariant,
  },
  correctText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  wrongText: {
    color: LightTheme.Error,
    fontWeight: '600',
  },
  unansweredText: {
    color: LightTheme.OnSurfaceVariant,
    fontWeight: '600',
  },
  timeText: {
    color: LightTheme.OnSurface,
    fontWeight: '600',
  },
  reviewButton: {
    backgroundColor: LightTheme.Primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewButtonPressed: {
    opacity: 0.8,
  },
  reviewButtonText: {
    color: LightTheme.OnPrimary,
  },
  exitButton: {
    backgroundColor: LightTheme.SurfaceVariant,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 100,
    alignItems: 'center',
  },
  exitButtonPressed: {
    opacity: 0.8,
  },
  exitButtonText: {
    color: LightTheme.OnSurface,
  },

  // Review
  reviewContainer: {
    padding: 16,
  },
  reviewTitle: {
    color: LightTheme.OnSurface,
    marginBottom: 24,
    textAlign: 'center',
  },
  reviewQuestionCard: {
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewQuestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    color: LightTheme.Primary,
  },
  correctBadge: {
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  wrongBadge: {
    backgroundColor: LightTheme.Error,
    color: LightTheme.OnError,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reviewQuestionText: {
    color: LightTheme.OnSurface,
    marginBottom: 16,
  },
  reviewOption: {
    padding: 12,
    backgroundColor: LightTheme.Surface,
    borderWidth: 1,
    borderColor: LightTheme.OutlineVariant,
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewOptionSelected: {
    borderColor: LightTheme.Primary,
  },
  reviewOptionCorrect: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  reviewOptionCorrectText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: LightTheme.Primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonPressed: {
    opacity: 0.8,
  },
  backButtonText: {
    color: LightTheme.OnPrimary,
  },
});

export default QuizInterface;

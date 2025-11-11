/**
 * NewEnhancedAIStudy - Premium Minimal Design
 * Purpose: Enhanced AI study features
 * Used in: StudentNavigator (AssignmentsStack)
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui';
import { Badge } from '../../ui';
import { Button } from '../../ui';
import { Chip } from '../../ui';
import { Row } from '../../ui';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';
import { ViewToggle } from '../../shared/components/ViewToggle';
import { useFadeInUp } from '../../shared/hooks/useAnimations';

type Props = NativeStackScreenProps<any, 'NewEnhancedAIStudy'>;

interface WeakArea {
  id: string;
  topic: string;
  subject: string;
  score: number;
  improvement: number;
  suggestions: string[];
}

interface StudyProgress {
  subject: string;
  completed: number;
  total: number;
  percentage: number;
  timeSpent: string;
}

interface Flashcard {
  id: string;
  subject: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mastered: boolean;
}

interface StudyPlan {
  id: string;
  title: string;
  subject: string;
  duration: string;
  tasks: string[];
  completed: boolean;
}

interface SmartNote {
  id: string;
  subject: string;
  title: string;
  summary: string;
  keyPoints: string[];
  createdAt: string;
}

interface PracticeTest {
  id: string;
  subject: string;
  title: string;
  questions: number;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score?: number;
}

export default function NewEnhancedAIStudy({ navigation }: Props) {
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'flashcards' | 'notes' | 'tests'>('dashboard');

  // Animation hooks
  const headerAnim = useFadeInUp(0);
  const card1Anim = useFadeInUp(150);
  const card2Anim = useFadeInUp(300);
  const card3Anim = useFadeInUp(450);

  // Mock data for all features
  const [weakAreas] = useState<WeakArea[]>([
    {
      id: '1',
      topic: 'Quadratic Equations',
      subject: 'Mathematics',
      score: 45,
      improvement: -15,
      suggestions: ['Review formula derivation', 'Practice more word problems', 'Watch video tutorials'],
    },
    {
      id: '2',
      topic: 'Organic Chemistry',
      subject: 'Chemistry',
      score: 52,
      improvement: +8,
      suggestions: ['Memorize reaction mechanisms', 'Practice naming compounds'],
    },
  ]);

  const [studyProgress] = useState<StudyProgress[]>([
    { subject: 'Mathematics', completed: 15, total: 20, percentage: 75, timeSpent: '12h 30m' },
    { subject: 'Physics', completed: 18, total: 20, percentage: 90, timeSpent: '10h 45m' },
    { subject: 'Chemistry', completed: 12, total: 20, percentage: 60, timeSpent: '8h 15m' },
  ]);

  const [flashcards] = useState<Flashcard[]>([
    { id: '1', subject: 'Mathematics', question: 'What is the quadratic formula?', answer: 'x = (-b ± √(b²-4ac)) / 2a', difficulty: 'medium', mastered: false },
    { id: '2', subject: 'Physics', question: 'State Newton\'s Second Law', answer: 'F = ma (Force equals mass times acceleration)', difficulty: 'easy', mastered: true },
    { id: '3', subject: 'Chemistry', question: 'What is Avogadro\'s number?', answer: '6.022 × 10²³ mol⁻¹', difficulty: 'medium', mastered: false },
  ]);

  const [studyPlans] = useState<StudyPlan[]>([
    {
      id: '1',
      title: 'Math Exam Prep',
      subject: 'Mathematics',
      duration: '2 weeks',
      tasks: ['Review quadratic equations', 'Practice calculus problems', 'Complete mock test'],
      completed: false,
    },
    {
      id: '2',
      title: 'Physics Chapter 5',
      subject: 'Physics',
      duration: '1 week',
      tasks: ['Read chapter notes', 'Solve practice problems', 'Watch lab demonstrations'],
      completed: false,
    },
  ]);

  const [smartNotes] = useState<SmartNote[]>([
    {
      id: '1',
      subject: 'Mathematics',
      title: 'Quadratic Equations Summary',
      summary: 'Key concepts and formulas for solving quadratic equations',
      keyPoints: ['Standard form: ax² + bx + c = 0', 'Discriminant determines number of roots', 'Factoring vs. Quadratic Formula'],
      createdAt: '2 days ago',
    },
    {
      id: '2',
      subject: 'Physics',
      title: 'Laws of Motion',
      summary: 'Newton\'s three laws explained with examples',
      keyPoints: ['First Law: Inertia', 'Second Law: F=ma', 'Third Law: Action-Reaction'],
      createdAt: '1 week ago',
    },
  ]);

  const [practiceTests] = useState<PracticeTest[]>([
    { id: '1', subject: 'Mathematics', title: 'Algebra Quick Quiz', questions: 10, duration: '15 min', difficulty: 'easy', score: 85 },
    { id: '2', subject: 'Physics', title: 'Mechanics Test', questions: 20, duration: '30 min', difficulty: 'medium' },
    { id: '3', subject: 'Chemistry', title: 'Organic Chemistry Challenge', questions: 15, duration: '25 min', difficulty: 'hard' },
  ]);

  React.useEffect(() => {
    trackScreenView('NewEnhancedAIStudy');
  }, []);

  // Feature handlers
  const handleGenerateFlashcards = (subject: string) => {
    trackAction('generate_flashcards', 'NewEnhancedAIStudy', { subject });
    Alert.alert('Generating Flashcards', `Creating AI-powered flashcards for ${subject}...`);
  };

  const handleGenerateStudyPlan = () => {
    trackAction('generate_study_plan', 'NewEnhancedAIStudy');
    Alert.alert('Generating Study Plan', 'AI is creating a personalized study plan based on your weak areas...');
  };

  const handleGenerateNotes = (subject: string) => {
    trackAction('generate_smart_notes', 'NewEnhancedAIStudy', { subject });
    Alert.alert('Generating Notes', `Creating smart notes for ${subject}...`);
  };

  const handleStartTest = (testId: string, title: string) => {
    trackAction('start_practice_test', 'NewEnhancedAIStudy', { testId });
    Alert.alert('Start Test', `Starting "${title}"...`);
  };

  const handleImproveWeakArea = (area: WeakArea) => {
    trackAction('improve_weak_area', 'NewEnhancedAIStudy', { topic: area.topic });
    Alert.alert('Improve Weak Area', `Starting focused practice for "${area.topic}"...`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <BaseScreen scrollable={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            trackAction('back_button', 'NewEnhancedAIStudy');
            navigation.goBack();
          }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <T variant="h2" style={styles.backIcon}>←</T>
        </TouchableOpacity>

        <T variant="body" weight="semiBold" style={styles.headerTitle}>
          Enhanced AI Study
        </T>

        <ViewToggle
          modes={[
            { value: 'compact', icon: '▦', label: 'Compact' },
            { value: 'detailed', icon: '☰', label: 'Detailed' },
          ]}
          selectedMode={viewMode}
          onModeChange={(mode) => {
            setViewMode(mode as 'compact' | 'detailed');
            trackAction('toggle_view_mode', 'NewEnhancedAIStudy', { mode });
          }}
          size="small"
        />
      </View>

      <View style={styles.container}>
        {/* Tab Navigation */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          <Row gap="xs" style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <Chip variant="filter" label="📊 Dashboard" selected={activeTab === 'dashboard'} onPress={() => setActiveTab('dashboard')} />
            <Chip variant="filter" label="🎴 Flashcards" selected={activeTab === 'flashcards'} onPress={() => setActiveTab('flashcards')} />
            <Chip variant="filter" label="📝 Notes" selected={activeTab === 'notes'} onPress={() => setActiveTab('notes')} />
            <Chip variant="filter" label="🧪 Tests" selected={activeTab === 'tests'} onPress={() => setActiveTab('tests')} />
          </Row>
        </ScrollView>

        {/* Content Area */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <View style={styles.tabContent}>
              <Animated.View style={headerAnim}>
                <Card style={styles.headerCard}>
                  <T variant="h1" weight="bold">Enhanced AI Study</T>
                  <T variant="body" style={styles.subtitle}>AI-powered learning tools & insights</T>
                </Card>
              </Animated.View>

              {/* 4. Progress Tracking */}
              <Animated.View style={card1Anim}>
                <Card style={styles.progressCard}>
                <T variant="title" weight="semiBold" style={{ marginBottom: 12 }}>
                  📈 Study Progress
                </T>
                {studyProgress.map((progress, index) => (
                  <View key={index} style={styles.progressItem}>
                    <View style={{ flex: 1 }}>
                      <Row gap="xs" style={{ marginBottom: 6 }}>
                        <T variant="body" weight="semiBold">{progress.subject}</T>
                        <Badge variant="info" label={`${progress.percentage}%`} />
                      </Row>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress.percentage}%` }]} />
                      </View>
                      {viewMode === 'detailed' && (
                        <T variant="caption" style={{ color: '#6B7280', marginTop: 4 }}>
                          {progress.completed}/{progress.total} topics • {progress.timeSpent}
                        </T>
                      )}
                    </View>
                  </View>
                ))}
                </Card>
              </Animated.View>

              {/* 5. Weak Areas Analysis */}
              <Animated.View style={card2Anim}>
                <Card style={styles.weakAreasCard}>
                <T variant="title" weight="semiBold" style={{ marginBottom: 12 }}>
                  🎯 AI-Identified Weak Areas
                </T>
                {weakAreas.map((area) => (
                  <Card key={area.id} style={styles.weakAreaItem}>
                    <View style={styles.weakAreaHeader}>
                      <View style={{ flex: 1 }}>
                        <T variant="body" weight="semiBold">{area.topic}</T>
                        <T variant="caption" style={{ color: '#6B7280' }}>{area.subject}</T>
                      </View>
                      <Badge
                        variant={area.score >= 70 ? 'success' : area.score >= 50 ? 'warning' : 'error'}
                        label={`${area.score}%`}
                      />
                      {area.improvement !== 0 && (
                        <T variant="caption" style={{ color: area.improvement > 0 ? '#10B981' : '#EF4444', marginLeft: 8 }}>
                          {area.improvement > 0 ? '▲' : '▼'} {Math.abs(area.improvement)}%
                        </T>
                      )}
                    </View>
                    {viewMode === 'detailed' && (
                      <View style={styles.suggestions}>
                        <T variant="caption" weight="semiBold" style={{ marginBottom: 4 }}>AI Suggestions:</T>
                        {area.suggestions.map((suggestion, i) => (
                          <T key={i} variant="caption" style={{ color: '#6B7280', marginLeft: 8 }}>
                            • {suggestion}
                          </T>
                        ))}
                      </View>
                    )}
                    <Button variant="primary" onPress={() => handleImproveWeakArea(area)} style={{ marginTop: 8 }}>
                      Start Practice
                    </Button>
                  </Card>
                ))}
                </Card>
              </Animated.View>

              {/* 6. Study Plan Generator */}
              <Animated.View style={card3Anim}>
                <Card style={styles.studyPlansCard}>
                <View style={styles.cardHeader}>
                  <T variant="title" weight="semiBold">📅 AI Study Plans</T>
                  <Button variant="ghost" onPress={handleGenerateStudyPlan}>+ Generate</Button>
                </View>
                {studyPlans.map((plan) => (
                  <Card key={plan.id} style={styles.studyPlanItem}>
                    <View style={styles.studyPlanHeader}>
                      <View style={{ flex: 1 }}>
                        <T variant="body" weight="semiBold">{plan.title}</T>
                        <T variant="caption" style={{ color: '#6B7280' }}>{plan.subject} • {plan.duration}</T>
                      </View>
                      {plan.completed && <Badge variant="success" label="✓ Complete" />}
                    </View>
                    {viewMode === 'detailed' && (
                      <View style={styles.studyPlanTasks}>
                        {plan.tasks.map((task, i) => (
                          <T key={i} variant="caption" style={{ color: '#6B7280' }}>
                            {i + 1}. {task}
                          </T>
                        ))}
                      </View>
                    )}
                  </Card>
                ))}
                </Card>
              </Animated.View>
            </View>
          )}

          {/* 3. Flashcard Generator Tab */}
          {activeTab === 'flashcards' && (
            <View style={styles.tabContent}>
              <Animated.View style={headerAnim}>
                <Card style={styles.featureHeader}>
                <T variant="title" weight="semiBold">🎴 AI Flashcards</T>
                <T variant="caption" style={{ color: '#6B7280', marginTop: 4 }}>
                  Automatically generated from your study materials
                </T>
                <Button variant="primary" onPress={() => handleGenerateFlashcards('Mathematics')} style={{ marginTop: 12 }}>
                  Generate New Flashcards
                </Button>
                </Card>
              </Animated.View>

              {flashcards.map((card, index) => (
                <Animated.View key={card.id} style={useFadeInUp(150 + index * 100)}>
                  <Card style={styles.flashcardItem}>
                  <View style={styles.flashcardHeader}>
                    <Badge variant="info" label={card.subject} />
                    <Badge
                      variant={card.difficulty === 'easy' ? 'success' : card.difficulty === 'medium' ? 'warning' : 'error'}
                      label={card.difficulty}
                    />
                    {card.mastered && <T variant="caption">✓ Mastered</T>}
                  </View>
                  <T variant="body" weight="semiBold" style={{ marginTop: 8 }}>Q: {card.question}</T>
                  {viewMode === 'detailed' && (
                    <View style={styles.flashcardAnswer}>
                      <T variant="body">A: {card.answer}</T>
                    </View>
                  )}
                  </Card>
                </Animated.View>
              ))}
            </View>
          )}

          {/* 1. Smart Notes Tab */}
          {activeTab === 'notes' && (
            <View style={styles.tabContent}>
              <Animated.View style={headerAnim}>
                <Card style={styles.featureHeader}>
                <T variant="title" weight="semiBold">📝 Smart Notes</T>
                <T variant="caption" style={{ color: '#6B7280', marginTop: 4 }}>
                  AI-generated summaries and key points
                </T>
                <Button variant="primary" onPress={() => handleGenerateNotes('Physics')} style={{ marginTop: 12 }}>
                  Generate Smart Notes
                </Button>
                </Card>
              </Animated.View>

              {smartNotes.map((note, index) => (
                <Animated.View key={note.id} style={useFadeInUp(150 + index * 100)}>
                  <Card style={styles.noteItem}>
                  <View style={styles.noteHeader}>
                    <Badge variant="info" label={note.subject} />
                    <T variant="caption" style={{ color: '#9CA3AF' }}>{note.createdAt}</T>
                  </View>
                  <T variant="body" weight="semiBold" style={{ marginTop: 8 }}>{note.title}</T>
                  <T variant="caption" style={{ color: '#6B7280', marginTop: 4 }}>{note.summary}</T>
                  {viewMode === 'detailed' && (
                    <View style={styles.keyPoints}>
                      <T variant="caption" weight="semiBold">Key Points:</T>
                      {note.keyPoints.map((point, i) => (
                        <T key={i} variant="caption" style={{ color: '#6B7280', marginLeft: 8 }}>
                          • {point}
                        </T>
                      ))}
                    </View>
                  )}
                  </Card>
                </Animated.View>
              ))}
            </View>
          )}

          {/* 2. Practice Tests Tab */}
          {activeTab === 'tests' && (
            <View style={styles.tabContent}>
              <Animated.View style={headerAnim}>
                <Card style={styles.featureHeader}>
                <T variant="title" weight="semiBold">🧪 Practice Tests</T>
                <T variant="caption" style={{ color: '#6B7280', marginTop: 4 }}>
                  Adaptive quizzes tailored to your level
                </T>
                </Card>
              </Animated.View>

              {practiceTests.map((test, index) => (
                <Animated.View key={test.id} style={useFadeInUp(150 + index * 100)}>
                  <Card style={styles.testItem}>
                  <View style={styles.testHeader}>
                    <View style={{ flex: 1 }}>
                      <T variant="body" weight="semiBold">{test.title}</T>
                      <T variant="caption" style={{ color: '#6B7280' }}>{test.subject}</T>
                    </View>
                    {test.score && <Badge variant="success" label={`${test.score}%`} />}
                  </View>
                  <Row gap="sm" style={{ marginTop: 8 }}>
                    <T variant="caption" style={{ color: '#6B7280' }}>
                      📝 {test.questions} questions
                    </T>
                    <T variant="caption" style={{ color: '#6B7280' }}>
                      ⏱ {test.duration}
                    </T>
                    <Badge
                      variant={test.difficulty === 'easy' ? 'success' : test.difficulty === 'medium' ? 'warning' : 'error'}
                      label={test.difficulty}
                    />
                  </Row>
                  <Button
                    variant={test.score ? 'outline' : 'primary'}
                    onPress={() => handleStartTest(test.id, test.title)}
                    style={{ marginTop: 12 }}
                  >
                    {test.score ? 'Retake Test' : 'Start Test'}
                  </Button>
                  </Card>
                </Animated.View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#111827',
  },
  headerTitle: {
    fontSize: 18,
    color: '#111827',
  },
  container: {
    flex: 1,
  },
  tabScroll: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,

  },
  headerCard: {
    padding: 20,

  },
  subtitle: {
    color: '#6B7280',
  },
  featureHeader: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  // Progress Tracking Styles
  progressCard: {
    padding: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  // Weak Areas Styles
  weakAreasCard: {
    padding: 16,
  },
  weakAreaItem: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  weakAreaHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 8,
  },
  suggestions: {
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
    marginTop: 8,
  },
  // Study Plans Styles
  studyPlansCard: {
    padding: 16,
  },
  studyPlanItem: {
    padding: 12,
    marginTop: 12,
    backgroundColor: '#F9FAFB',
  },
  studyPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  studyPlanTasks: {

  },
  // Flashcard Styles
  flashcardItem: {
    padding: 16,
    marginBottom: 12,
  },
  flashcardHeader: {
    flexDirection: 'row',

    alignItems: 'center',
  },
  flashcardAnswer: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  // Notes Styles
  noteItem: {
    padding: 16,
    marginBottom: 12,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keyPoints: {
    marginTop: 12,

  },
  // Test Styles
  testItem: {
    padding: 16,
    marginBottom: 12,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

/**
 * NewAIStudyScreen - Premium Minimal Design
 * Purpose: AI-powered study assistant with tabs, recommendations, plans, practice, chat
 * Features: Tabs, AI recommendations, study plans, practice questions, analytics, AI chat
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseScreen } from '../../shared/components/BaseScreen';
import {
  T,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Chip,
  Row,
  Col,
  Spacer,
  Badge,
} from '../../ui';
import { safeNavigate } from '../../utils/navigationService';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<any, 'NewAIStudyScreen'>;

interface AIRecommendation {
  id: string;
  type: 'study' | 'practice' | 'review' | 'concept';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
  subject: string;
}

interface StudyPlan {
  id: string;
  subject: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  progress: number;
  isActive: boolean;
}

interface PracticeQuestion {
  id: string;
  subject: string;
  topic: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hints: string[];
  explanation: string;
  isAnswered: boolean;
}

interface LearningAnalytics {
  studyStreak: number;
  completionRate: number;
  attentionSpan: number;
  improvementTrend: 'improving' | 'stable' | 'declining';
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
}

type TabKey = 'recommendations' | 'study-plans' | 'practice' | 'assistant';

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: 'recommendations', label: 'Recommendations' },
  { key: 'study-plans', label: 'Study Plans' },
  { key: 'practice', label: 'Practice' },
  { key: 'assistant', label: 'AI Chat' },
];

const CACHE_KEY_ANALYTICS = 'ai_study_analytics';

export default function NewAIStudyScreen({ navigation }: Props) {
  const { user } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState<TabKey>('recommendations');

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Practice modal state
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<PracticeQuestion | null>(null);
  const [showHints, setShowHints] = useState(false);

  // Analytics state
  const [analytics, setAnalytics] = useState<LearningAnalytics>({
    studyStreak: 12,
    completionRate: 85,
    attentionSpan: 25,
    improvementTrend: 'improving',
  });

  // Track screen view
  useEffect(() => {
    trackScreenView('NewAIStudyScreen');
    loadAnalytics();
    initializeChat();
  }, []);

  // Load analytics from cache
  const loadAnalytics = useCallback(async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY_ANALYTICS);
      if (cached) {
        setAnalytics(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  }, []);

  // Initialize chat with welcome message
  const initializeChat = useCallback(() => {
    setChatMessages([
      {
        id: '1',
        type: 'ai',
        message: `Hi! I'm your AI study assistant! 🤖\n\nI've analyzed your learning patterns:\n• You're on a 12-day study streak! 🔥\n• Your visual learning style is working great\n• 85% completion rate (improving trend)\n\nWhat would you like to work on today?`,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  // Mock AI recommendations
  const recommendations: AIRecommendation[] = [
    {
      id: '1',
      type: 'study',
      title: 'Focus on Trigonometry Review',
      description: 'Based on your recent calculus performance, reviewing trig identities will help',
      confidence: 92,
      reasoning: 'Analysis shows difficulty with trig substitution in integration',
      estimatedTime: '30 min',
      priority: 'high',
      subject: 'Mathematics',
    },
    {
      id: '2',
      type: 'practice',
      title: 'Additional Physics Problems',
      description: 'Practice 5 more electromagnetic wave problems to reinforce concepts',
      confidence: 88,
      reasoning: 'Lab report showed good understanding but needs practice application',
      estimatedTime: '45 min',
      priority: 'medium',
      subject: 'Physics',
    },
    {
      id: '3',
      type: 'concept',
      title: 'Chemical Bonding Refresher',
      description: "Quick review of ionic and covalent bonding before tomorrow's class",
      confidence: 85,
      reasoning: 'Organic chemistry builds heavily on bonding fundamentals',
      estimatedTime: '20 min',
      priority: 'high',
      subject: 'Chemistry',
    },
  ];

  // Mock study plans
  const studyPlans: StudyPlan[] = [
    {
      id: '1',
      subject: 'Mathematics',
      title: 'Calculus Mastery Path',
      description: 'Comprehensive calculus learning optimized for your style',
      estimatedTime: '4 weeks',
      difficulty: 'intermediate',
      topics: ['Limits', 'Derivatives', 'Integrals', 'Applications'],
      progress: 65,
      isActive: true,
    },
    {
      id: '2',
      subject: 'Physics',
      title: 'Mechanics Foundation',
      description: 'Build strong foundation in classical mechanics',
      estimatedTime: '3 weeks',
      difficulty: 'beginner',
      topics: ['Kinematics', 'Forces', 'Energy', 'Momentum'],
      progress: 45,
      isActive: false,
    },
    {
      id: '3',
      subject: 'Chemistry',
      title: 'Organic Chemistry Boost',
      description: 'Targeted improvement plan for organic chemistry',
      estimatedTime: '5 weeks',
      difficulty: 'advanced',
      topics: ['Reactions', 'Mechanisms', 'Synthesis', 'Spectroscopy'],
      progress: 20,
      isActive: false,
    },
  ];

  // Mock practice questions
  const practiceQuestions: PracticeQuestion[] = [
    {
      id: '1',
      subject: 'Mathematics',
      topic: 'Calculus - Integration',
      question: 'Find the integral of ∫x²sin(x)dx using integration by parts',
      difficulty: 'medium',
      hints: [
        'Use integration by parts: ∫udv = uv - ∫vdu',
        'Let u = x² and dv = sin(x)dx',
        "You'll need to apply integration by parts twice",
      ],
      explanation:
        'This problem requires applying integration by parts twice. First with u=x² and dv=sin(x)dx, then again with the resulting integral.',
      isAnswered: false,
    },
    {
      id: '2',
      subject: 'Physics',
      topic: 'Electromagnetic Waves',
      question:
        'Calculate the energy density of an EM wave with electric field amplitude E₀ = 100 V/m',
      difficulty: 'hard',
      hints: [
        'Use the energy density formula: u = ½ε₀E² + ½B²/μ₀',
        'For EM waves, electric and magnetic energy densities are equal',
        'Remember the relationship between E and B in EM waves',
      ],
      explanation:
        'The total energy density is twice the electric energy density since electric and magnetic contributions are equal in EM waves.',
      isAnswered: false,
    },
  ];

  // Handle chat send
  const handleChatSend = useCallback(() => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: chatInput,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: generateAIResponse(userMessage.message),
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
      trackAction('ai_chat_message', 'NewAIStudyScreen');
    }, 2000);
  }, [chatInput]);

  // Generate AI response
  const generateAIResponse = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes('math') || q.includes('calculus')) {
      return `Based on your 88% confidence in Mathematics, I recommend:\n\n📈 Your integration skills are progressing well!\n🎯 Focus on trigonometric substitution\n⏰ Best study time for you: evening\n\nWould you like personalized practice problems?`;
    }

    if (q.includes('physics')) {
      return `Your current physics confidence is 72%, but I predict improvement to 78% by next week! 📈\n\n🔍 Recent activity: Electromagnetic Waves\n💡 Recommended: Review wave fundamentals (30 min)\n\nReady to start?`;
    }

    if (q.includes('study') || q.includes('plan')) {
      return `Perfect timing! Here's your optimized plan: 📊\n\n🔥 Current streak: ${analytics.studyStreak} days\n📈 Completion rate: ${analytics.completionRate}%\n⏰ Peak performance: evenings\n\nCheck the Study Plans tab for your weekly schedule!`;
    }

    if (q.includes('help') || q.includes('stuck')) {
      return `I'm here to help! 🤗\n\nWhen stuck, these strategies work best:\n• Take a 5-minute break\n• Switch to visual learning methods\n• Try the concept in a different context\n\nWhat specific concept is giving you trouble?`;
    }

    return `That's a thoughtful question! Based on your learning patterns, I think the best approach would be to connect this to your visual learning style.\n\nLet me know which area interests you most! 🚀`;
  };

  // Get type emoji
  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'study':
        return '📖';
      case 'practice':
        return '💪';
      case 'concept':
        return '💡';
      case 'review':
        return '🔄';
      default:
        return '📚';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
      case 'easy':
        return '#10B981';
      case 'intermediate':
      case 'medium':
        return '#F59E0B';
      case 'advanced':
      case 'hard':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  // Render Recommendations Tab
  const renderRecommendationsTab = () => (
    <View style={styles.tabContent}>
      {/* Learning Analytics Card */}
      <Card variant="filled" style={{ marginBottom: 16 }}>
        <CardHeader title="Your Learning Profile" />
        <CardContent>
          <Row gap="md" style={{ justifyContent: 'space-around' }}>
            <Col style={{ alignItems: 'center' }}>
              <T variant="caption" color="textSecondary">
                Streak
              </T>
              <T variant="h3" weight="bold">
                {analytics.studyStreak}
              </T>
              <T variant="caption">🔥 days</T>
            </Col>
            <Col style={{ alignItems: 'center' }}>
              <T variant="caption" color="textSecondary">
                Complete
              </T>
              <T variant="h3" weight="bold" style={{ color: '#10B981' }}>
                {analytics.completionRate}%
              </T>
            </Col>
            <Col style={{ alignItems: 'center' }}>
              <T variant="caption" color="textSecondary">
                Focus
              </T>
              <T variant="h3" weight="bold">
                {analytics.attentionSpan}
              </T>
              <T variant="caption">minutes</T>
            </Col>
            <Col style={{ alignItems: 'center' }}>
              <T variant="caption" color="textSecondary">
                Trend
              </T>
              <T variant="body" style={{ fontSize: 24 }}>
                {analytics.improvementTrend === 'improving' ? '📈' : '📊'}
              </T>
            </Col>
          </Row>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <T variant="title" weight="bold" style={{ marginBottom: 12 }}>
        AI Recommendations
      </T>
      {recommendations.map((rec) => (
        <Card key={rec.id} variant="outlined" style={{ marginBottom: 12 }}>
          <CardContent>
            <Row gap="sm" align="flex-start" style={{ marginBottom: 8 }}>
              <T variant="h2">{getTypeEmoji(rec.type)}</T>
              <Col style={{ flex: 1 }}>
                <T variant="body" weight="bold">
                  {rec.title}
                </T>
                <Row gap="xs" style={{ marginTop: 4 }}>
                  <Badge variant="info">{rec.subject}</Badge>
                  <Badge
                    style={{
                      backgroundColor: getPriorityColor(rec.priority) + '20',
                    }}
                  >
                    <T variant="caption" style={{ color: getPriorityColor(rec.priority) }}>
                      {rec.priority.toUpperCase()}
                    </T>
                  </Badge>
                </Row>
              </Col>
              <T variant="caption" color="textSecondary">
                {rec.estimatedTime}
              </T>
            </Row>
            <T variant="caption" color="textSecondary" style={{ marginBottom: 8 }}>
              {rec.description}
            </T>
            <Row gap="xs" style={{ marginBottom: 8 }}>
              <T variant="caption" weight="semiBold" style={{ color: '#3B82F6' }}>
                {rec.confidence}% confidence
              </T>
            </Row>
            <View
              style={{
                backgroundColor: '#F3F4F6',
                padding: 8,
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <T variant="caption" style={{ fontStyle: 'italic' }}>
                💡 {rec.reasoning}
              </T>
            </View>
          </CardContent>
          <CardActions>
            <Button
              variant="ghost"
              onPress={() => {
                Alert.alert('Saved', 'Recommendation saved for later');
                trackAction('save_recommendation', 'NewAIStudyScreen', { id: rec.id });
              }}
            >
              Save
            </Button>
            <Button
              variant="primary"
              onPress={() => {
                if (rec.type === 'practice') {
                  setActiveTab('practice');
                } else if (rec.type === 'concept') {
                  setActiveTab('assistant');
                  setChatInput(`Can you explain ${rec.title.toLowerCase()}?`);
                }
                trackAction('start_recommendation', 'NewAIStudyScreen', { id: rec.id });
              }}
            >
              Start
            </Button>
          </CardActions>
        </Card>
      ))}
    </View>
  );

  // Render Study Plans Tab
  const renderStudyPlansTab = () => (
    <View style={styles.tabContent}>
      {studyPlans.map((plan) => (
        <Card
          key={plan.id}
          variant="outlined"
          style={[
            styles.planCard,
            plan.isActive && { borderColor: '#3B82F6', borderWidth: 2 },
          ]}
        >
          <CardContent>
            <Row gap="xs" align="center" style={{ marginBottom: 8 }}>
              <Badge variant="info">{plan.subject}</Badge>
              <Badge
                style={{
                  backgroundColor: getDifficultyColor(plan.difficulty) + '20',
                }}
              >
                <T variant="caption" style={{ color: getDifficultyColor(plan.difficulty) }}>
                  {plan.difficulty.toUpperCase()}
                </T>
              </Badge>
              {plan.isActive && <Badge variant="success">ACTIVE</Badge>}
            </Row>

            <T variant="title" weight="bold" style={{ marginBottom: 4 }}>
              {plan.title}
            </T>
            <T variant="caption" color="textSecondary" style={{ marginBottom: 8 }}>
              {plan.description}
            </T>

            <Row gap="md" style={{ marginBottom: 8 }}>
              <T variant="caption">⏱️ {plan.estimatedTime}</T>
              <T variant="caption" weight="bold" style={{ color: '#3B82F6' }}>
                {plan.progress}% complete
              </T>
            </Row>

            {/* Progress Bar */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${plan.progress}%` }]} />
            </View>

            {/* Topics */}
            <Row gap="xs" wrap style={{ marginTop: 8 }}>
              {plan.topics.map((topic, idx) => (
                <Chip key={idx} variant="suggestion" label={topic} />
              ))}
            </Row>
          </CardContent>
          <CardActions>
            <Button
              variant={plan.isActive ? 'primary' : 'outline'}
              fullWidth
              onPress={() => {
                Alert.alert(
                  plan.isActive ? 'Continue' : 'Start',
                  `${plan.isActive ? 'Continue' : 'Start'} ${plan.title}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: plan.isActive ? 'Continue' : 'Start',
                      onPress: () => {
                        trackAction(plan.isActive ? 'continue_plan' : 'start_plan', 'NewAIStudyScreen', { id: plan.id });
                        safeNavigate('StudyLibrary', { subject: plan.subject });
                      },
                    },
                  ]
                );
              }}
            >
              {plan.isActive ? '📚 Continue' : '🚀 Start'}
            </Button>
          </CardActions>
        </Card>
      ))}
    </View>
  );

  // Render Practice Tab
  const renderPracticeTab = () => (
    <View style={styles.tabContent}>
      <T variant="title" weight="bold" style={{ marginBottom: 4 }}>
        AI Practice Questions
      </T>
      <T variant="caption" color="textSecondary" style={{ marginBottom: 12 }}>
        Based on your learning gaps
      </T>

      {practiceQuestions.map((q) => (
        <TouchableOpacity
          key={q.id}
          onPress={() => {
            setSelectedQuestion(q);
            setShowPracticeModal(true);
            setShowHints(false);
            trackAction('open_practice_question', 'NewAIStudyScreen', { id: q.id });
          }}
          accessibilityRole="button"
          accessibilityLabel={`Practice question: ${q.topic}`}
        >
          <Card variant="outlined" style={{ marginBottom: 12 }}>
            <CardContent>
              <Row gap="xs" style={{ marginBottom: 8 }}>
                <Badge variant="info">{q.subject}</Badge>
                <Badge
                  style={{
                    backgroundColor: getDifficultyColor(q.difficulty) + '20',
                  }}
                >
                  <T variant="caption" style={{ color: getDifficultyColor(q.difficulty) }}>
                    {q.difficulty.toUpperCase()}
                  </T>
                </Badge>
                {q.isAnswered && <Badge variant="success">✅ Done</Badge>}
              </Row>
              <T variant="caption" color="textSecondary" style={{ marginBottom: 4 }}>
                {q.topic}
              </T>
              <T variant="body" numberOfLines={2} style={{ marginBottom: 8 }}>
                {q.question}
              </T>
              <Row gap="md">
                <T variant="caption">💡 {q.hints.length} hints</T>
                <T variant="caption">📝 Solution included</T>
              </Row>
            </CardContent>
          </Card>
        </TouchableOpacity>
      ))}

      <Button
        variant="outline"
        fullWidth
        onPress={() => {
          Alert.alert('Generate More', 'AI is generating new practice problems...');
          trackAction('generate_more_practice', 'NewAIStudyScreen');
        }}
      >
        🎲 Generate More Questions
      </Button>
    </View>
  );

  // Render Assistant Tab
  const renderAssistantTab = () => (
    <View style={styles.assistantContainer}>
      <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
        {chatMessages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.chatBubble,
              msg.type === 'user' ? styles.chatBubbleUser : styles.chatBubbleAI,
            ]}
          >
            <T
              variant="caption"
              style={msg.type === 'user' ? styles.chatTextUser : styles.chatTextAI}
            >
              {msg.message}
            </T>
            <T
              variant="caption"
              style={[
                styles.chatTimestamp,
                msg.type === 'user' ? { color: 'rgba(255,255,255,0.7)' } : {},
              ]}
            >
              {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </T>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.chatBubble, styles.chatBubbleAI]}>
            <T variant="caption" style={[styles.chatTextAI, { fontStyle: 'italic' }]}>
              AI is thinking...
            </T>
          </View>
        )}
      </ScrollView>

      {/* Chat Input */}
      <View style={styles.chatInputContainer}>
        <TextInput
          style={styles.chatInput}
          value={chatInput}
          onChangeText={setChatInput}
          placeholder="Ask about your studies..."
          placeholderTextColor="#9CA3AF"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={styles.chatSendButton}
          onPress={handleChatSend}
          disabled={!chatInput.trim()}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <T variant="h3">➤</T>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <BaseScreen scrollable={false}>
      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        {TABS.map((tab) => (
          <Chip
            key={tab.key}
            variant="filter"
            label={tab.label}
            selected={activeTab === tab.key}
            onPress={() => {
              setActiveTab(tab.key);
              trackAction('switch_tab', 'NewAIStudyScreen', { tab: tab.key });
            }}
          />
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'recommendations' && renderRecommendationsTab()}
        {activeTab === 'study-plans' && renderStudyPlansTab()}
        {activeTab === 'practice' && renderPracticeTab()}
        {activeTab === 'assistant' && renderAssistantTab()}
      </ScrollView>

      {/* Practice Question Modal */}
      <Modal visible={showPracticeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.scrollModalContent}>
            <Card style={styles.practiceModal}>
              <CardHeader
                title={selectedQuestion?.topic || 'Practice Question'}
                subtitle={selectedQuestion?.subject}
                trailing={
                  <TouchableOpacity onPress={() => setShowPracticeModal(false)}>
                    <T variant="body" weight="bold" style={{ color: '#6B7280' }}>
                      ✕
                    </T>
                  </TouchableOpacity>
                }
              />
              <CardContent>
                {selectedQuestion && (
                  <>
                    <Badge
                      style={{
                        backgroundColor:
                          getDifficultyColor(selectedQuestion.difficulty) + '20',
                        marginBottom: 12,
                      }}
                    >
                      <T
                        variant="caption"
                        style={{ color: getDifficultyColor(selectedQuestion.difficulty) }}
                      >
                        {selectedQuestion.difficulty.toUpperCase()}
                      </T>
                    </Badge>

                    <T variant="body" weight="semiBold" style={{ marginBottom: 16 }}>
                      {selectedQuestion.question}
                    </T>

                    {/* Hints Section */}
                    <TouchableOpacity
                      onPress={() => setShowHints(!showHints)}
                      style={styles.hintsButton}
                    >
                      <T variant="body" weight="semiBold">
                        💡 {showHints ? 'Hide' : 'Show'} Hints ({selectedQuestion.hints.length})
                      </T>
                    </TouchableOpacity>

                    {showHints && (
                      <View style={styles.hintsContainer}>
                        {selectedQuestion.hints.map((hint, idx) => (
                          <View key={idx} style={styles.hintItem}>
                            <T variant="caption" color="textSecondary">
                              {idx + 1}. {hint}
                            </T>
                          </View>
                        ))}
                      </View>
                    )}

                    <Spacer size="md" />

                    {/* Explanation */}
                    <View style={styles.explanationContainer}>
                      <T variant="body" weight="semiBold" style={{ marginBottom: 8 }}>
                        📝 Explanation:
                      </T>
                      <T variant="caption" color="textSecondary">
                        {selectedQuestion.explanation}
                      </T>
                    </View>
                  </>
                )}
              </CardContent>
              <CardActions>
                <Button variant="ghost" onPress={() => setShowPracticeModal(false)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onPress={() => {
                    Alert.alert('Submitted', 'Answer submitted for review');
                    setShowPracticeModal(false);
                    trackAction('submit_practice', 'NewAIStudyScreen', {
                      id: selectedQuestion?.id,
                    });
                  }}
                >
                  Submit Answer
                </Button>
              </CardActions>
            </Card>
          </ScrollView>
        </View>
      </Modal>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  tabSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  planCard: {
    marginBottom: 16,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  assistantContainer: {
    flex: 1,
    padding: 16,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 16,
  },
  chatBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  chatBubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B82F6',
  },
  chatBubbleAI: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
  },
  chatTextUser: {
    color: '#FFFFFF',
  },
  chatTextAI: {
    color: '#111827',
  },
  chatTimestamp: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'right',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 8,
    gap: 8,
  },
  chatInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chatSendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  scrollModalContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  practiceModal: {
    maxHeight: '90%',
  },
  hintsButton: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  hintsContainer: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  hintItem: {
    paddingVertical: 4,
  },
  explanationContainer: {
    backgroundColor: '#DBEAFE',
    padding: 12,
    borderRadius: 8,
  },
});

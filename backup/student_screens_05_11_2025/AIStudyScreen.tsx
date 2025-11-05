/**
 * AIStudyScreen - Phase 43.3: Enhanced AI Study Assistant with Personalized Recommendations
 * Advanced AI-powered learning assistant with deep personalization and adaptive learning
 * Features: Khan Academy Khanmigo-style AI tutor, cross-platform integration, predictive analytics
 * Enhanced Phase 43.3 features: Study Library integration, performance prediction, smart scheduling
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  BackHandler,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {
  Appbar,
  Portal,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';

import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import * as AIStudyAssistantService from '../../services/aiStudyAssistantService';

interface AIStudyScreenProps {
  navigation?: any;
  route?: any;
  onNavigate?: (screen: string) => void;
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

interface LearningStyle {
  type: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  confidence: number;
  characteristics: string[];
}

// Phase 43.3: Enhanced interfaces for advanced personalization
interface LearningAnalytics {
  studyStreak: number;
  averageSessionLength: number;
  preferredStudyTimes: string[];
  mostProductiveDay: string;
  completionRate: number;
  improvementTrend: 'improving' | 'stable' | 'declining';
  attentionSpan: number; // in minutes
  retentionRate: number;
}

interface PerformancePrediction {
  subjectConfidence: { [subject: string]: number };
  upcomingChallenges: string[];
  recommendedInterventions: string[];
  successProbability: number;
  nextWeekForecast: 'excellent' | 'good' | 'needs_attention' | 'at_risk';
}

interface SmartReminder {
  id: string;
  type: 'study_session' | 'review' | 'practice' | 'break';
  title: string;
  message: string;
  scheduledTime: string;
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
  adaptiveReason: string;
}

interface StudyLibraryIntegration {
  recentlyAccessed: string[];
  recommendedFromLibrary: string[];
  crossReferenceTopics: { [topic: string]: string[] };
  syncedBookmarks: string[];
}

interface ConversationContext {
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'frustrated' | 'confused';
  complexityLevel: number;
  learningGoals: string[];
  sessionProgress: number;
}

type TabKey = 'recommendations' | 'study-plans' | 'practice' | 'assistant';

const TAB_ITEMS: Array<{ key: TabKey; label: string }> = [
  { key: 'recommendations', label: 'Recommendations' },
  { key: 'study-plans', label: 'Study Plans' },
  { key: 'practice', label: 'Practice' },
  { key: 'assistant', label: 'AI Chat' },
];

const AIStudyScreen: React.FC<AIStudyScreenProps> = ({
  navigation,
  route,
  onNavigate,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  // Screen state management
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [activeTab, setActiveTab] = useState<TabKey>('recommendations');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, type: 'user' | 'ai', message: string, timestamp: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<PracticeQuestion | null>(null);

  // Phase 43.3: Enhanced state management
  const [learningAnalytics, setLearningAnalytics] = useState<LearningAnalytics | null>(null);
  const [performancePrediction, setPerformancePrediction] = useState<PerformancePrediction | null>(null);
  const [smartReminders, setSmartReminders] = useState<SmartReminder[]>([]);
  const [studyLibraryIntegration, setStudyLibraryIntegration] = useState<StudyLibraryIntegration | null>(null);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    topics: [],
    sentiment: 'neutral',
    complexityLevel: 1,
    learningGoals: [],
    sessionProgress: 0,
  });
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showPredictionModal, setShowPredictionModal] = useState(false);

  // Mock AI-powered study data based on Khan Academy Khanmigo model
  const studyPlans: StudyPlan[] = [
    {
      id: '1',
      subject: 'Mathematics',
      title: 'Calculus Mastery Path',
      description: 'Comprehensive calculus learning optimized for your learning style',
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
      description: 'Build strong foundation in classical mechanics concepts',
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
      description: 'Targeted improvement plan for organic chemistry concepts',
      estimatedTime: '5 weeks',
      difficulty: 'advanced',
      topics: ['Reactions', 'Mechanisms', 'Synthesis', 'Spectroscopy'],
      progress: 20,
      isActive: false,
    },
  ];

  const aiRecommendations: AIRecommendation[] = [
    {
      id: '1',
      type: 'study',
      title: 'Focus on Trigonometry Review',
      description: 'Based on your recent calculus performance, reviewing trigonometric identities will help',
      confidence: 92,
      reasoning: 'Analysis of your integration problems shows difficulty with trig substitution',
      estimatedTime: '30 minutes',
      priority: 'high',
      subject: 'Mathematics',
    },
    {
      id: '2',
      type: 'practice',
      title: 'Additional Physics Problems',
      description: 'Practice 5 more electromagnetic wave problems to reinforce concepts',
      confidence: 88,
      reasoning: 'Your lab report showed good understanding but needs more practice application',
      estimatedTime: '45 minutes',
      priority: 'medium',
      subject: 'Physics',
    },
    {
      id: '3',
      type: 'concept',
      title: 'Chemical Bonding Refresher',
      description: 'Quick review of ionic and covalent bonding before tomorrow\'s organic chemistry class',
      confidence: 85,
      reasoning: 'Organic chemistry builds heavily on bonding fundamentals',
      estimatedTime: '20 minutes',
      priority: 'high',
      subject: 'Chemistry',
    },
    {
      id: '4',
      type: 'review',
      title: 'Biology Flashcards Session',
      description: 'Review cellular respiration vocabulary using spaced repetition',
      confidence: 78,
      reasoning: 'Previous quiz showed strong conceptual understanding but weak terminology recall',
      estimatedTime: '15 minutes',
      priority: 'low',
      subject: 'Biology',
    },
  ];

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
        'You\'ll need to apply integration by parts twice'
      ],
      explanation: 'This problem requires applying integration by parts twice. First with u=x² and dv=sin(x)dx, then again with the resulting integral.',
      isAnswered: false,
    },
    {
      id: '2',
      subject: 'Physics',
      topic: 'Electromagnetic Waves',
      question: 'Calculate the energy density of an electromagnetic wave with electric field amplitude E₀ = 100 V/m',
      difficulty: 'hard',
      hints: [
        'Use the energy density formula: u = ½ε₀E² + ½B²/μ₀',
        'For EM waves, electric and magnetic energy densities are equal',
        'Remember the relationship between E and B in EM waves'
      ],
      explanation: 'The total energy density is twice the electric energy density since electric and magnetic contributions are equal in electromagnetic waves.',
      isAnswered: false,
    },
  ];

  const learningStyle: LearningStyle = {
    type: 'visual',
    confidence: 85,
    characteristics: [
      'Prefers diagrams and visual representations',
      'Benefits from color-coded notes',
      'Learns well with mind maps and flowcharts',
      'Responds to visual mnemonics'
    ],
  };

  // Phase 43.3: Enhanced mock data for advanced features
  const mockLearningAnalytics: LearningAnalytics = {
    studyStreak: 12,
    averageSessionLength: 45,
    preferredStudyTimes: ['18:00-20:00', '09:00-11:00'],
    mostProductiveDay: 'Tuesday',
    completionRate: 85,
    improvementTrend: 'improving',
    attentionSpan: 25,
    retentionRate: 78,
  };

  const mockPerformancePrediction: PerformancePrediction = {
    subjectConfidence: {
      Mathematics: 88,
      Physics: 72,
      Chemistry: 65,
      Biology: 91,
    },
    upcomingChallenges: [
      'Organic Chemistry exam next week',
      'Physics lab report due in 3 days',
      'Calculus integration concepts need review'
    ],
    recommendedInterventions: [
      'Schedule extra practice sessions for organic chemistry',
      'Review electromagnetic wave fundamentals',
      'Practice more integration by parts problems'
    ],
    successProbability: 82,
    nextWeekForecast: 'good',
  };

  const mockSmartReminders: SmartReminder[] = [
    {
      id: '1',
      type: 'study_session',
      title: 'Focused Chemistry Study',
      message: 'Perfect time for your chemistry session! You\'re most productive now.',
      scheduledTime: '2025-01-29T18:30:00Z',
      priority: 'high',
      isActive: true,
      adaptiveReason: 'Based on your best performance times and upcoming exam',
    },
    {
      id: '2',
      type: 'break',
      title: 'Take a Break',
      message: 'You\'ve been studying for 45 minutes. Time for a refreshing break!',
      scheduledTime: '2025-01-29T19:15:00Z',
      priority: 'medium',
      isActive: true,
      adaptiveReason: 'Optimal attention span reached - break will improve retention',
    },
    {
      id: '3',
      type: 'review',
      title: 'Quick Review Session',
      message: 'Review yesterday\'s calculus concepts to strengthen retention.',
      scheduledTime: '2025-01-30T09:00:00Z',
      priority: 'medium',
      isActive: true,
      adaptiveReason: 'Spaced repetition schedule for optimal memory consolidation',
    },
  ];

  const mockStudyLibraryIntegration: StudyLibraryIntegration = {
    recentlyAccessed: ['1', '3', '5'], // Material IDs from Study Library
    recommendedFromLibrary: ['2', '4'], // AI-recommended based on study patterns
    crossReferenceTopics: {
      'calculus': ['integration', 'derivatives', 'limits'],
      'electromagnetism': ['waves', 'fields', 'maxwell equations'],
      'organic chemistry': ['reactions', 'mechanisms', 'synthesis'],
    },
    syncedBookmarks: ['1', '3'], // Synced bookmarks between AI and Study Library
  };

  // Initialize screen
  useEffect(() => {
    initializeScreen();
    setupBackHandler();

    return cleanup;
  }, []);

  // Screen initialization
  const initializeScreen = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // Load AI study profile data from service
      const [
        analyticsResult,
        predictionResult,
        remindersResult,
        libraryResult,
      ] = await Promise.all([
        AIStudyAssistantService.getLearningAnalytics(user.id),
        AIStudyAssistantService.getPerformancePrediction(user.id),
        AIStudyAssistantService.getSmartReminders(user.id),
        AIStudyAssistantService.getStudyLibraryIntegration(user.id),
      ]);

      if (analyticsResult.success && analyticsResult.data) {
        setLearningAnalytics(analyticsResult.data);
      }
      if (predictionResult.success && predictionResult.data) {
        setPerformancePrediction(predictionResult.data);
      }
      if (remindersResult.success && remindersResult.data) {
        setSmartReminders(remindersResult.data);
      }
      if (libraryResult.success && libraryResult.data) {
        setStudyLibraryIntegration(libraryResult.data);
      }

      // Get learning analytics for welcome message
      const analytics = analyticsResult.data;
      const prediction = predictionResult.data;

      // Enhanced AI welcome message with personalized insights
      setChatMessages([{
        id: '1',
        type: 'ai',
        message: `Hi! I'm your enhanced AI study assistant! 🤖

I've analyzed your learning patterns and I'm excited to share some insights:
• You're on a ${analytics?.studyStreak || 0}-day study streak! 🔥
• Your ${learningStyle.type} learning style is working great for you
• I predict an ${prediction?.successProbability || 80}% success rate for your upcoming goals

I've integrated with your Study Library and can provide cross-platform recommendations. What would you like to work on today?`,
        timestamp: new Date().toISOString(),
      }]);

      // Update conversation context
      setConversationContext(prev => ({
        ...prev,
        topics: ['introduction', 'analytics', 'personalization'],
        sentiment: 'positive',
        sessionProgress: 10,
      }));

      showSnackbar('AI assistant loaded successfully');

    } catch (error) {
      console.error('Error initializing screen:', error);
      showSnackbar('Failed to initialize AI assistant');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Back button handler
  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onNavigate) {
        onNavigate('back');
        return true;
      }

      return false;
    });

    return () => backHandler.remove();
  }, [onNavigate]);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Cleanup logic
  }, []);

  // Show snackbar message
  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }, []);

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      message: chatInput,
      timestamp: new Date().toISOString(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        message: generateAIResponse(userMessage.message),
        timestamp: new Date().toISOString(),
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userQuestion: string): string => {
    // Phase 43.3: Enhanced AI response system with context awareness
    const question = userQuestion.toLowerCase();

    // Update conversation context based on user question
    const updateContext = (newTopics: string[], sentiment: ConversationContext['sentiment']) => {
      setConversationContext(prev => ({
        ...prev,
        topics: [...new Set([...prev.topics, ...newTopics])],
        sentiment,
        sessionProgress: Math.min(prev.sessionProgress + 15, 100),
      }));
    };

    // Math/Calculus responses with Study Library integration
    if (question.includes('math') || question.includes('calculus')) {
      updateContext(['mathematics', 'calculus'], 'neutral');
      if (studyLibraryIntegration?.recentlyAccessed.includes('1')) {
        return `I see you've been studying the "Calculus Integration Techniques" material in your Study Library! Based on your 88% confidence in Mathematics and your visual learning style, I recommend:

📈 Your integration skills are progressing well (up 12% this week!)
🎯 Focus on trigonometric substitution - it aligns with your recent study patterns
📚 I've bookmarked 3 related materials in your Study Library
⏰ Best study time for you: ${mockLearningAnalytics.preferredStudyTimes?.[0] || mockLearningAnalytics.preferredStudyTimes?.join(' & ') || 'evening'}

Would you like me to generate personalized practice problems or guide you to specific Study Library resources?`;
      }
      return 'Based on your recent calculus performance and Study Library activity, I recommend focusing on integration techniques. Your derivative skills are strong! Let me sync some targeted materials from your library.';
    }

    // Physics responses with predictive insights
    if (question.includes('physics')) {
      updateContext(['physics', 'electromagnetism'], 'neutral');
      return `I notice you're working on physics! Your current confidence level is 72%, but I predict improvement to 78% by next week. 📈

🔍 Recent Study Library activity shows you accessed "Electromagnetic Waves"
⚠️ Upcoming challenge: Physics lab report due in 3 days
💡 Recommended intervention: Review wave fundamentals (30 min session)

Your attention span peaks at 25 minutes, so let's break this into focused chunks. Ready to start with some targeted practice?`;
    }

    // Study planning with analytics integration
    if (question.includes('study') || question.includes('plan') || question.includes('schedule')) {
      updateContext(['planning', 'schedule'], 'positive');
      return `Perfect timing! I've analyzed your study patterns and here's your optimized plan: 📊

🔥 Current streak: ${mockLearningAnalytics.studyStreak} days
📈 Completion rate: ${mockLearningAnalytics.completionRate}% (${mockLearningAnalytics.improvementTrend})
⏰ Your peak performance: ${mockLearningAnalytics.mostProductiveDay}s, ${mockLearningAnalytics.preferredStudyTimes.join(' & ')}
📚 ${mockLearningAnalytics.averageSessionLength}-min sessions work best for you

I've scheduled smart reminders and integrated your Study Library bookmarks. Check the Study Plans tab for your adaptive weekly schedule!`;
    }

    // Analytics and performance questions
    if (question.includes('progress') || question.includes('performance') || question.includes('analytics')) {
      updateContext(['analytics', 'progress'], 'positive');
      return `Great question! Here are your performance insights: 📊

🎯 Overall success probability: ${mockPerformancePrediction.successProbability}%
📈 Retention rate: ${mockLearningAnalytics.retentionRate}%
🧠 Attention span: ${mockLearningAnalytics.attentionSpan} minutes (optimal!)

Next week forecast: ${mockPerformancePrediction.nextWeekForecast.replace('_', ' ').toUpperCase()} ✨

Your strongest subjects: Biology (91%), Mathematics (88%)
Growth opportunity: Chemistry (65% - let's boost this!)

Would you like detailed recommendations for your improvement areas?`;
    }

    // Study Library integration questions
    if (question.includes('library') || question.includes('materials') || question.includes('resources')) {
      updateContext(['library', 'resources'], 'positive');
      return `I'm fully integrated with your Study Library! Here's what I've found: 📚

📖 Recently accessed: ${studyLibraryIntegration?.recentlyAccessed.length || 0} materials
🎯 AI recommendations ready: ${studyLibraryIntegration?.recommendedFromLibrary.length || 0} new materials
🔖 Synced bookmarks: ${studyLibraryIntegration?.syncedBookmarks.length || 0} items
🧩 Cross-referenced topics for deeper learning

I can guide you to specific materials based on your current goals, or help you discover new content that matches your learning style. What subject interests you most right now?`;
    }

    // Frustrated or stuck responses with emotional support
    if (question.includes('help') || question.includes('stuck') || question.includes('difficult') || question.includes('confused')) {
      updateContext(['support', 'help'], 'confused');
      return `I'm here to help! 🤗 I understand learning can be challenging sometimes.

Based on your patterns, when you feel stuck, these strategies work best:
• Take a 5-minute break (you've been focused for a while!)
• Switch to visual learning methods (your strength!)
• Try the concept in a different context
• Connect it to topics you've mastered

Your resilience score is high - you've overcome 89% of previous challenges! 💪

What specific concept is giving you trouble? I can break it down or find alternative explanations in your Study Library.`;
    }

    // Encouragement and motivation
    if (question.includes('motivat') || question.includes('tired') || question.includes('give up')) {
      updateContext(['motivation', 'support'], 'frustrated');
      return `Hey, I believe in you! 🌟 Your data tells an amazing story:

🔥 ${mockLearningAnalytics.studyStreak}-day streak shows incredible dedication
📈 ${mockLearningAnalytics.improvementTrend.toUpperCase()} trend - you're getting stronger!
🎯 ${mockLearningAnalytics.completionRate}% completion rate is excellent
🏆 You're in the top 15% of consistent learners

Remember: Every expert was once a beginner. Your brain is literally rewiring itself as you learn. The struggle means you're growing!

Want me to adjust your study plan to make it more manageable, or shall we celebrate your progress so far?`;
    }

    // Default enhanced response with context
    return `That's a thoughtful question! Based on our conversation and your learning patterns, I think the best approach would be to connect this to your ${learningStyle.type} learning style and your strength in ${Object.keys(mockPerformancePrediction.subjectConfidence)[0]}.

Let me know which specific area interests you most, and I can provide targeted resources from your Study Library or create a personalized learning path! 🚀`;
  };

  // Render app bar
  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: theme.Surface }}>
      <Appbar.BackAction
        onPress={() => {
          if (onNavigate) {
            onNavigate('back');
          } else if (navigation?.goBack) {
            navigation.goBack();
          }
        }}
      />

      <Appbar.Content
        title="AI Study Assistant"
        subtitle="Personalized learning companion"
      />
    </Appbar.Header>
  );

  // Render loading state
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar backgroundColor={theme.Surface} barStyle="dark-content" />
        {renderAppBar()}

        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
        }}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{
            fontSize: 16,
            color: theme.OnSurfaceVariant,
          }}>
            Loading AI assistant...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderRecommendationsTab = () => (
    <View style={{ padding: 8 }}>
      {/* Phase 43.3: Enhanced Learning Analytics Card */}
      <View style={{
        backgroundColor: LightTheme.TertiaryContainer,
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: LightTheme.OnTertiaryContainer }}>
            Your Learning Profile
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: LightTheme.SecondaryContainer, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 3 }}
            onPress={() => setShowAnalyticsModal(true)}
          >
            <Text style={{ fontSize: 9, color: LightTheme.OnSecondaryContainer, fontWeight: '600' }}>
              📊 Details
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 6 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 9, color: LightTheme.OnTertiaryContainer, marginBottom: 2 }}>
              Style
            </Text>
            <Text style={{ fontSize: 11, fontWeight: '600', color: LightTheme.OnTertiaryContainer }}>
              {learningStyle.type.toUpperCase()}
            </Text>
            <Text style={{ fontSize: 9, color: LightTheme.Tertiary }}>
              {learningStyle.confidence}%
            </Text>
          </View>

          {learningAnalytics && (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 9, color: LightTheme.OnTertiaryContainer, marginBottom: 2 }}>
                Streak
              </Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: LightTheme.OnTertiaryContainer }}>
                {learningAnalytics.studyStreak} days
              </Text>
              <Text style={{ fontSize: 9, color: LightTheme.Tertiary }}>
                🔥 {learningAnalytics.improvementTrend}
              </Text>
            </View>
          )}

          {learningAnalytics && (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 9, color: LightTheme.OnTertiaryContainer, marginBottom: 2 }}>
                Complete
              </Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: LightTheme.Tertiary }}>
                {learningAnalytics.completionRate}%
              </Text>
            </View>
          )}

          {learningAnalytics && (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 9, color: LightTheme.OnTertiaryContainer, marginBottom: 2 }}>
                Focus
              </Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: LightTheme.Tertiary }}>
                {learningAnalytics.attentionSpan}m
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* AI Recommendations */}
      <Text style={{ fontSize: 12, fontWeight: '600', color: LightTheme.OnBackground, marginBottom: 6, marginTop: 6 }}>
        AI Recommendations
      </Text>
      {aiRecommendations.map((recommendation) => (
        <View key={recommendation.id} style={{
          backgroundColor: LightTheme.Surface,
          borderRadius: 8,
          padding: 8,
          marginBottom: 6,
          elevation: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}>
          <View style={{ marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 16, marginRight: 4 }}>
                {recommendation.type === 'study' ? '📖' :
                 recommendation.type === 'practice' ? '💪' :
                 recommendation.type === 'concept' ? '💡' : '🔄'}
              </Text>
              <Text style={{ flex: 1, fontSize: 12, fontWeight: '600', color: LightTheme.OnSurface }}>
                {recommendation.title}
              </Text>
              <View style={{
                backgroundColor: recommendation.priority === 'high' ? '#F44336' : recommendation.priority === 'medium' ? '#FF9800' : '#4CAF50',
                paddingHorizontal: 5,
                paddingVertical: 2,
                borderRadius: 4,
              }}>
                <Text style={{ fontSize: 8, fontWeight: '600', color: '#FFFFFF' }}>
                  {recommendation.priority.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontSize: 10, color: LightTheme.Primary, fontWeight: '600' }}>
                {recommendation.subject}
              </Text>
              <Text style={{ fontSize: 10, color: LightTheme.OnSurfaceVariant }}>
                {recommendation.estimatedTime}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 11, color: LightTheme.OnSurface, lineHeight: 14, marginBottom: 4 }} numberOfLines={2}>
            {recommendation.description}
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 4 }}>
            <TouchableOpacity
              style={{ backgroundColor: LightTheme.Primary, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 6, flex: 1 }}
              onPress={() => {
                if (recommendation.type === 'practice') {
                  setActiveTab('practice');
                } else if (recommendation.type === 'study') {
                  // Navigate to Study Library with subject filter
                  if (navigation?.navigate) {
                    navigation.navigate('StudyLibrary', { subject: recommendation.subject });
                  } else if (onNavigate) {
                    onNavigate('StudyLibrary');
                  }
                } else if (recommendation.type === 'concept') {
                  // Open AI Chat with pre-filled question about the concept
                  setActiveTab('assistant');
                  setChatInput(`Can you explain ${recommendation.title.toLowerCase()}?`);
                } else {
                  // Default: switch to assistant tab
                  setActiveTab('assistant');
                }
                showSnackbar(`Starting: ${recommendation.title}`);
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '600', color: LightTheme.OnPrimary, textAlign: 'center' }}>
                Start
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ backgroundColor: LightTheme.SecondaryContainer, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 6, flex: 1 }}
              onPress={() => {
                showSnackbar('Saved for later');
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '600', color: LightTheme.OnSecondaryContainer, textAlign: 'center' }}>
                Later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderStudyPlansTab = () => (
    <View style={{ padding: 8 }}>
      {studyPlans.map((plan) => (
        <View key={plan.id} style={{
          backgroundColor: LightTheme.Surface,
          borderRadius: 8,
          padding: 8,
          marginBottom: 6,
          elevation: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          borderWidth: plan.isActive ? 2 : 0,
          borderColor: plan.isActive ? LightTheme.Primary : 'transparent',
        }}>
          <View style={{ marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: LightTheme.Primary }}>
                {plan.subject}
              </Text>
              <View style={{
                backgroundColor: plan.difficulty === 'beginner' ? '#4CAF50' : plan.difficulty === 'intermediate' ? '#FF9800' : '#F44336',
                paddingHorizontal: 5,
                paddingVertical: 2,
                borderRadius: 4,
              }}>
                <Text style={{ fontSize: 8, fontWeight: '600', color: '#FFFFFF' }}>
                  {plan.difficulty.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={{ fontSize: 12, fontWeight: '600', color: LightTheme.OnSurface, marginBottom: 3 }}>
              {plan.title}
            </Text>
            <Text style={{ fontSize: 10, color: LightTheme.OnSurfaceVariant, lineHeight: 13, marginBottom: 4 }} numberOfLines={2}>
              {plan.description}
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontSize: 10, color: LightTheme.OnSurfaceVariant }}>
                ⏱️ {plan.estimatedTime}
              </Text>
              <Text style={{ fontSize: 10, color: LightTheme.Primary, fontWeight: '600' }}>
                {plan.progress}%
              </Text>
            </View>
          </View>

          <View style={{ marginVertical: 4 }}>
            <View style={{ height: 4, backgroundColor: LightTheme.SurfaceVariant, borderRadius: 2 }}>
              <View style={{ height: '100%', width: `${plan.progress}%`, backgroundColor: LightTheme.Primary, borderRadius: 2 }} />
            </View>
          </View>

          <View style={{ marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {plan.topics.slice(0, 3).map((topic, index) => (
                <View key={index} style={{ backgroundColor: LightTheme.SecondaryContainer, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2, marginRight: 3, marginBottom: 3 }}>
                  <Text style={{ fontSize: 9, color: LightTheme.OnSecondaryContainer }}>
                    {topic}
                  </Text>
                </View>
              ))}
              {plan.topics.length > 3 && (
                <Text style={{ fontSize: 9, color: LightTheme.OnSurfaceVariant, alignSelf: 'center' }}>
                  +{plan.topics.length - 3} more
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: plan.isActive ? '#4CAF50' : LightTheme.Primary,
              borderRadius: 4,
              paddingVertical: 6,
              alignItems: 'center',
            }}
            onPress={() => {
              // Navigate to Study Library with subject and topics
              if (navigation?.navigate) {
                navigation.navigate('StudyLibrary', {
                  subject: plan.subject,
                  topics: plan.topics,
                  studyPlan: plan.title
                });
              } else if (onNavigate) {
                onNavigate('StudyLibrary');
              }
              showSnackbar(`${plan.isActive ? 'Continuing' : 'Starting'} ${plan.title}`);
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#FFFFFF' }}>
              {plan.isActive ? 'Continue' : 'Start'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderPracticeTab = () => (
    <View style={{ padding: 8 }}>
      <View style={{ marginBottom: 6 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: LightTheme.OnBackground, marginBottom: 2 }}>
          AI Practice Questions
        </Text>
        <Text style={{ fontSize: 10, color: LightTheme.OnSurfaceVariant }}>
          Based on your learning gaps
        </Text>
      </View>

      {practiceQuestions.map((question) => (
        <TouchableOpacity
          key={question.id}
          style={{
            backgroundColor: LightTheme.Surface,
            borderRadius: 8,
            padding: 8,
            marginBottom: 6,
            elevation: 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
          onPress={() => {
            setSelectedQuestion(question);
            setShowPracticeModal(true);
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: LightTheme.Primary }}>
              {question.subject}
            </Text>
            <View style={{
              backgroundColor: question.difficulty === 'easy' ? '#4CAF50' : question.difficulty === 'medium' ? '#FF9800' : '#F44336',
              paddingHorizontal: 5,
              paddingVertical: 2,
              borderRadius: 4,
            }}>
              <Text style={{ fontSize: 8, fontWeight: '600', color: '#FFFFFF' }}>
                {question.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 10, color: LightTheme.OnSurfaceVariant, marginBottom: 3 }}>
            {question.topic}
          </Text>
          <Text style={{ fontSize: 11, color: LightTheme.OnSurface, lineHeight: 14, marginBottom: 4 }} numberOfLines={2}>
            {question.question}
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 10, color: LightTheme.OnSurfaceVariant }}>
              💡 {question.hints.length} hints
            </Text>
            <Text style={{ fontSize: 10, color: LightTheme.OnSurfaceVariant }}>
              {question.isAnswered ? '✅ Done' : '🔄 New'}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={{ backgroundColor: LightTheme.SecondaryContainer, borderRadius: 8, padding: 8, alignItems: 'center', marginTop: 6 }}>
        <Text style={{ fontSize: 11, fontWeight: '600', color: LightTheme.OnSecondaryContainer }}>
          🎲 Generate More
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAssistantTab = () => (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, maxHeight: 350, marginBottom: 8, paddingHorizontal: 8 }}>
        {chatMessages.map((message) => (
          <View
            key={message.id}
            style={{
              marginBottom: 6,
              maxWidth: '85%',
              alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: message.type === 'user' ? LightTheme.Primary : LightTheme.Surface,
              borderRadius: 8,
              padding: 8,
            }}
          >
            <Text style={{
              fontSize: 11,
              lineHeight: 14,
              color: message.type === 'user' ? LightTheme.OnPrimary : LightTheme.OnSurface,
            }}>
              {message.message}
            </Text>
            <Text style={{
              fontSize: 9,
              color: 'rgba(255, 255, 255, 0.7)',
              marginTop: 3,
              textAlign: 'right',
            }}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        ))}

        {isTyping && (
          <View style={{
            marginBottom: 6,
            maxWidth: '85%',
            alignSelf: 'flex-start',
            backgroundColor: LightTheme.Surface,
            borderRadius: 8,
            padding: 8,
          }}>
            <Text style={{
              fontSize: 11,
              color: LightTheme.OnSurfaceVariant,
              fontStyle: 'italic',
            }}>
              AI is thinking...
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: LightTheme.Surface,
        borderRadius: 8,
        padding: 6,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginHorizontal: 8,
      }}>
        <TextInput
          style={{
            flex: 1,
            fontSize: 11,
            color: LightTheme.OnSurface,
            maxHeight: 80,
            paddingVertical: 5,
            paddingHorizontal: 8,
          }}
          value={chatInput}
          onChangeText={setChatInput}
          placeholder="Ask about your studies..."
          placeholderTextColor={LightTheme.OnSurfaceVariant}
          multiline
        />
        <TouchableOpacity
          style={{ backgroundColor: LightTheme.Primary, borderRadius: 4, padding: 6, marginLeft: 4 }}
          onPress={handleChatSend}
        >
          <Text style={{ fontSize: 16, color: LightTheme.OnPrimary }}>
            ➤
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'recommendations': return renderRecommendationsTab();
      case 'study-plans': return renderStudyPlansTab();
      case 'practice': return renderPracticeTab();
      case 'assistant': return renderAssistantTab();
      default: return renderRecommendationsTab();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar backgroundColor={theme.Surface} barStyle="dark-content" />
      {renderAppBar()}

      {/* Tab Selector */}
      <View style={{ backgroundColor: LightTheme.Primary, paddingHorizontal: 12, paddingVertical: 6 }}>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            borderRadius: 18,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            paddingVertical: 4,
            paddingHorizontal: 6,
            gap: 6,
          }}
        >
          {TAB_ITEMS.map(({ key, label }) => {
            const isActive = activeTab === key;
            return (
              <TouchableOpacity
                key={key}
                style={{
                  borderRadius: 14,
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                  minWidth: 90,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: isActive ? '#000' : 'transparent',
                  shadowOpacity: isActive ? 0.12 : 0,
                  shadowOffset: { width: 0, height: 1 },
                  shadowRadius: 2,
                  elevation: isActive ? 1 : 0,
                }}
                onPress={() => setActiveTab(key)}
                activeOpacity={0.85}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: isActive ? LightTheme.Primary : '#FFFFFF',
                    fontWeight: isActive ? '700' : '500',
                  }}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentTab()}
      </ScrollView>

      {/* Practice Modal */}
      <Modal
        visible={showPracticeModal}
        animationType="slide"
        onRequestClose={() => setShowPracticeModal(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: Spacing.LG,
            paddingVertical: Spacing.MD,
            backgroundColor: LightTheme.Primary,
          }}>
            <TouchableOpacity onPress={() => setShowPracticeModal(false)}>
              <Text style={{ fontSize: 24, color: '#FFFFFF', fontWeight: 'bold', marginRight: Spacing.MD }}>
                ✕
              </Text>
            </TouchableOpacity>
            <Text style={{ fontSize: Typography.titleLarge.fontSize, fontWeight: Typography.titleLarge.fontWeight, color: '#FFFFFF' }}>
              Practice Question
            </Text>
          </View>

          {selectedQuestion && (
            <ScrollView style={{ flex: 1, padding: Spacing.LG }}>
              <View style={{ backgroundColor: LightTheme.Surface, borderRadius: BorderRadius.MD, padding: Spacing.LG, marginBottom: Spacing.LG }}>
                <Text style={{ fontSize: Typography.labelMedium.fontSize, fontWeight: '600', color: LightTheme.Primary, marginBottom: Spacing.XS }}>
                  {selectedQuestion.subject}
                </Text>
                <Text style={{ fontSize: Typography.bodySmall.fontSize, color: LightTheme.OnSurfaceVariant, marginBottom: Spacing.MD }}>
                  {selectedQuestion.topic}
                </Text>
                <Text style={{ fontSize: Typography.bodyLarge.fontSize, color: LightTheme.OnSurface, lineHeight: Typography.bodyLarge.lineHeight }}>
                  {selectedQuestion.question}
                </Text>
              </View>

              <View style={{ backgroundColor: LightTheme.SecondaryContainer, borderRadius: BorderRadius.MD, padding: Spacing.MD, marginBottom: Spacing.LG }}>
                <Text style={{ fontSize: Typography.titleSmall.fontSize, fontWeight: Typography.titleSmall.fontWeight, color: LightTheme.OnSecondaryContainer, marginBottom: Spacing.MD }}>
                  💡 Hints
                </Text>
                {selectedQuestion.hints.map((hint, index) => (
                  <Text key={index} style={{ fontSize: Typography.bodyMedium.fontSize, color: LightTheme.OnSecondaryContainer, marginBottom: Spacing.SM, lineHeight: Typography.bodyMedium.lineHeight }}>
                    {index + 1}. {hint}
                  </Text>
                ))}
              </View>

              <View style={{ backgroundColor: LightTheme.TertiaryContainer, borderRadius: BorderRadius.MD, padding: Spacing.MD, marginBottom: Spacing.LG }}>
                <Text style={{ fontSize: Typography.titleSmall.fontSize, fontWeight: Typography.titleSmall.fontWeight, color: LightTheme.OnTertiaryContainer, marginBottom: Spacing.MD }}>
                  📖 Explanation
                </Text>
                <Text style={{ fontSize: Typography.bodyMedium.fontSize, color: LightTheme.OnTertiaryContainer, lineHeight: Typography.bodyMedium.lineHeight }}>
                  {selectedQuestion.explanation}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ backgroundColor: LightTheme.Primary, borderRadius: BorderRadius.SM, paddingHorizontal: Spacing.LG, paddingVertical: Spacing.MD, flex: 1, marginRight: Spacing.SM }}>
                  <Text style={{ fontSize: Typography.labelMedium.fontSize, fontWeight: '600', color: LightTheme.OnPrimary, textAlign: 'center' }}>
                    Submit Answer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: LightTheme.SecondaryContainer, borderRadius: BorderRadius.SM, paddingHorizontal: Spacing.LG, paddingVertical: Spacing.MD, flex: 1, marginLeft: Spacing.SM }}>
                  <Text style={{ fontSize: Typography.labelMedium.fontSize, fontWeight: '600', color: LightTheme.OnSecondaryContainer, textAlign: 'center' }}>
                    Need Help
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {/* Snackbar for notifications */}
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={4000}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </SafeAreaView>
  );
};

export default AIStudyScreen;

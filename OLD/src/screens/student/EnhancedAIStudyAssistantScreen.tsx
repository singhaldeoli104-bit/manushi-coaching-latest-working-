import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  BackHandler,
} from 'react-native';
import { Appbar, Portal, Snackbar, ActivityIndicator } from 'react-native-paper';
import Animated, { FadeIn, FadeInUp, FadeInDown, FadeOut, SlideInUp, SlideInDown, ZoomIn, BounceIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

import {useTheme} from '../../context/ThemeContext';
import {useAuth} from '../../context/AuthContext';
import * as AIStudyAssistantService from '../../services/aiStudyAssistantService';

const {width} = Dimensions.get('window');

interface StudyPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  subject: string;
  topics: string[];
  progress: number;
  estimatedTime: string;
  createdAt: string;
  aiGenerated: boolean;
}

interface LearningStyle {
  id: string;
  type: 'Visual' | 'Auditory' | 'Kinesthetic' | 'Reading';
  percentage: number;
  description: string;
  recommendations: string[];
}

interface AIRecommendation {
  id: string;
  title: string;
  type: 'resource' | 'practice' | 'revision' | 'concept';
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  estimatedTime: string;
  difficulty: number;
}

interface ProgressInsight {
  id: string;
  metric: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  insight: string;
  recommendation: string;
}

interface EnhancedAIStudyAssistantScreenProps {
  onNavigate?: (screen: string) => void;
}

const EnhancedAIStudyAssistantScreen: React.FC<EnhancedAIStudyAssistantScreenProps> = ({ onNavigate }) => {
  const navigation = useNavigation<any>();
  const {theme} = useTheme();
  const {user} = useAuth();

  const [activeTab, setActiveTab] = useState<'plans' | 'recommendations' | 'insights' | 'style'>('plans');
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [learningStyle, setLearningStyle] = useState<LearningStyle[]>([]);
  const [progressInsights, setProgressInsights] = useState<ProgressInsight[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planSubject, setPlanSubject] = useState('');
  const [planGoal, setPlanGoal] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    initializeScreen();
    setupBackHandler();
    return cleanup;
  }, []);

  const initializeScreen = useCallback(async () => {
    try {
      setIsLoading(true);
      await loadAIData();
    } catch (error) {
      console.error('Error initializing screen:', error);
      showSnackbar('Failed to load AI assistant data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onNavigate) {
        onNavigate('back');
      } else if (navigation) {
        navigation.goBack();
      }
      return true;
    });
    return backHandler.remove;
  }, [navigation, onNavigate]);

  const cleanup = useCallback(() => {
    // Clean up resources
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const loadAIData = async () => {
    if (!user?.id) {
      console.log('No user ID available');
      return;
    }

    try {
      const [plansResult, recommendationsResult, analyticsResult, predictionResult] = await Promise.all([
        AIStudyAssistantService.getStudyPlans(user.id),
        AIStudyAssistantService.getAIRecommendations(user.id),
        AIStudyAssistantService.getLearningAnalytics(user.id),
        AIStudyAssistantService.getPerformancePrediction(user.id),
      ]);

      // Map study plans from service to screen interface
      if (plansResult.success && plansResult.data) {
        const mappedPlans: StudyPlan[] = plansResult.data.map(plan => ({
          id: plan.id,
          title: plan.title,
          description: plan.description,
          duration: plan.duration,
          difficulty: plan.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
          subject: plan.subject,
          topics: plan.topics,
          progress: plan.progress,
          estimatedTime: '1-2 hours/day', // Default, could be derived from duration
          createdAt: plan.createdAt,
          aiGenerated: true,
        }));
        setStudyPlans(mappedPlans);
      }

      // Map recommendations from service to screen interface
      if (recommendationsResult.success && recommendationsResult.data) {
        const mappedRecommendations: AIRecommendation[] = recommendationsResult.data.map(rec => ({
          id: rec.id,
          title: rec.title,
          type: rec.type as 'resource' | 'practice' | 'revision' | 'concept',
          subject: rec.subject,
          priority: rec.priority as 'High' | 'Medium' | 'Low',
          reason: rec.reason,
          estimatedTime: rec.estimatedTime,
          difficulty: 3, // Default difficulty, could be derived from priority
        }));
        setRecommendations(mappedRecommendations);
      }

      // Map learning analytics to learning style
      if (analyticsResult.success && analyticsResult.data) {
        const patterns = analyticsResult.data.learningPatterns;
        const mappedStyles: LearningStyle[] = [
          {
            id: '1',
            type: 'Visual',
            percentage: 45,
            description: 'You learn best through charts, diagrams, and visual representations',
            recommendations: ['Use mind maps', 'Create flowcharts', 'Watch educational videos'],
          },
          {
            id: '2',
            type: 'Kinesthetic',
            percentage: 30,
            description: 'Hands-on activities and practical applications help you learn',
            recommendations: ['Solve practice problems', 'Use physical models', 'Take notes by hand'],
          },
          {
            id: '3',
            type: 'Auditory',
            percentage: 15,
            description: 'You benefit from listening to explanations and discussions',
            recommendations: ['Listen to podcasts', 'Join study groups', 'Read aloud'],
          },
          {
            id: '4',
            type: 'Reading',
            percentage: 10,
            description: 'Traditional text-based learning works well for you',
            recommendations: ['Read textbooks thoroughly', 'Take detailed notes', 'Create summaries'],
          },
        ];
        setLearningStyle(mappedStyles);
      }

      // Map performance prediction to progress insights
      if (predictionResult.success && predictionResult.data) {
        const prediction = predictionResult.data;
        const mappedInsights: ProgressInsight[] = [
          {
            id: '1',
            metric: 'Predicted Performance',
            value: `${prediction.predictedScore}%`,
            trend: prediction.trend as 'up' | 'down' | 'stable',
            insight: `Confidence level: ${prediction.confidence}%`,
            recommendation: prediction.recommendations[0] || 'Keep up the good work',
          },
          ...prediction.weakAreas.slice(0, 2).map((area, index) => ({
            id: `${index + 2}`,
            metric: area.subject,
            value: `${area.currentScore}%`,
            trend: 'stable' as const,
            insight: `Gap to target: ${area.targetScore - area.currentScore} points`,
            recommendation: area.recommendations[0] || 'Practice regularly',
          })),
        ];
        setProgressInsights(mappedInsights);
      }

      showSnackbar('AI assistant data loaded successfully');
    } catch (error) {
      console.error('Error loading AI data:', error);
      showSnackbar('Failed to load AI assistant data');
    }
  };

  const generatePersonalizedPlan = async () => {
    if (!planSubject.trim() || !planGoal.trim()) {
      Alert.alert('Missing Information', 'Please provide both subject and learning goal');
      return;
    }

    setIsGeneratingPlan(true);
    
    // Simulate AI plan generation
    setTimeout(() => {
      const newPlan: StudyPlan = {
        id: Date.now().toString(),
        title: `${planSubject} - ${planGoal}`,
        description: `AI-generated personalized plan for ${planGoal.toLowerCase()} in ${planSubject}`,
        duration: '2-4 weeks',
        difficulty: 'Intermediate',
        subject: planSubject,
        topics: ['Foundation', 'Core Concepts', 'Applications', 'Practice'],
        progress: 0,
        estimatedTime: '1-2 hours/day',
        createdAt: new Date().toISOString().split('T')[0],
        aiGenerated: true,
      };

      setStudyPlans(prev => [newPlan, ...prev]);
      setIsGeneratingPlan(false);
      setShowPlanModal(false);
      setPlanSubject('');
      setPlanGoal('');
      
      Alert.alert('success', 'Your personalized study plan has been generated!');
    }, 3000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return theme.primary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#F44336';
      case 'Medium': return '#FF9800';
      case 'Low': return '#4CAF50';
      default: return theme.primary;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      case 'stable': return 'trending-flat';
      default: return 'help';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#4CAF50';
      case 'down': return '#F44336';
      case 'stable': return '#FF9800';
      default: return theme.primary;
    }
  };

  const renderTabButton = (tabId: string, label: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: activeTab === tabId ? theme.primary : 'transparent',
          borderColor: theme.primary,
        }
      ]}
      onPress={() => setActiveTab(tabId as any)}
    >
      <Icon 
        name={icon} 
        size={20} 
        color={activeTab === tabId ? theme.OnPrimary : theme.primary} 
      />
      <Text style={[
        styles.tabButtonText,
        {color: activeTab === tabId ? theme.OnPrimary : theme.primary}
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderStudyPlan = (plan: StudyPlan, index: number) => (
    <Animated.View
      key={plan.id}
      entering={FadeInUp.delay(index * 100)}
      style={[styles.planCard, {backgroundColor: theme.Surface}]}
    >
      <View style={styles.planHeader}>
        <View style={styles.planInfo}>
          <Text style={[styles.planTitle, {color: theme.OnSurface}]}>
            {plan.title}
          </Text>
          <Text style={[styles.planSubject, {color: theme.primary}]}>
            {plan.subject}
          </Text>
        </View>
        <View style={styles.planMeta}>
          <View style={[styles.difficultyBadge, {backgroundColor: getDifficultyColor(plan.difficulty)}]}>
            <Text style={styles.badgeText}>{plan.difficulty}</Text>
          </View>
          {plan.aiGenerated && (
            <View style={[styles.aiBadge, {backgroundColor: theme.primary}]}>
              <Icon name="auto-awesome" size={12} color={theme.OnPrimary} />
              <Text style={[styles.badgeText, {color: theme.OnPrimary}]}>AI</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={[styles.planDescription, {color: theme.OnSurfaceVariant}]}>
        {plan.description}
      </Text>

      <View style={styles.planDetails}>
        <View style={styles.planDetailItem}>
          <Icon name="schedule" size={16} color={theme.OnSurfaceVariant} />
          <Text style={[styles.planDetailText, {color: theme.OnSurfaceVariant}]}>
            {plan.duration}
          </Text>
        </View>
        <View style={styles.planDetailItem}>
          <Icon name="access-time" size={16} color={theme.OnSurfaceVariant} />
          <Text style={[styles.planDetailText, {color: theme.OnSurfaceVariant}]}>
            {plan.estimatedTime}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={[styles.progressLabel, {color: theme.OnSurfaceVariant}]}>
          Progress: {plan.progress}%
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              {
                backgroundColor: theme.primary,
                width: `${plan.progress}%`
              }
            ]} 
          />
        </View>
      </View>

      <View style={styles.topicsContainer}>
        <Text style={[styles.topicsLabel, {color: theme.OnSurfaceVariant}]}>
          Topics:
        </Text>
        <View style={styles.topicsGrid}>
          {plan.topics.map((topic, topicIndex) => (
            <View 
              key={topicIndex}
              style={[styles.topicTag, {backgroundColor: theme.PrimaryContainer}]}
            >
              <Text style={[styles.topicText, {color: theme.OnPrimaryContainer}]}>
                {topic}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.actionButton, {backgroundColor: theme.primary}]}
        onPress={() => console.log('View plan details:', plan.id)}
      >
        <Text style={[styles.actionButtonText, {color: theme.OnPrimary}]}>
          View Details
        </Text>
        <Icon name="arrow-forward" size={16} color={theme.OnPrimary} />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderRecommendation = (rec: AIRecommendation, index: number) => (
    <Animated.View
      key={rec.id}
      animation="fadeInLeft"
      delay={index * 100}
      style={[styles.recommendationCard, {backgroundColor: theme.Surface}]}
    >
      <View style={styles.recommendationHeader}>
        <View style={styles.recommendationInfo}>
          <Text style={[styles.recommendationTitle, {color: theme.OnSurface}]}>
            {rec.title}
          </Text>
          <Text style={[styles.recommendationSubject, {color: theme.primary}]}>
            {rec.subject}
          </Text>
        </View>
        <View style={styles.recommendationMeta}>
          <View style={[styles.priorityBadge, {backgroundColor: getPriorityColor(rec.priority)}]}>
            <Text style={styles.badgeText}>{rec.priority}</Text>
          </View>
          <View style={[styles.typeBadge, {backgroundColor: theme.SecondaryContainer}]}>
            <Text style={[styles.badgeText, {color: theme.OnSecondaryContainer}]}>
              {rec.type}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.recommendationReason, {color: theme.OnSurfaceVariant}]}>
        {rec.reason}
      </Text>

      <View style={styles.recommendationDetails}>
        <View style={styles.recommendationDetailItem}>
          <Icon name="schedule" size={16} color={theme.OnSurfaceVariant} />
          <Text style={[styles.recommendationDetailText, {color: theme.OnSurfaceVariant}]}>
            {rec.estimatedTime}
          </Text>
        </View>
        <View style={styles.recommendationDetailItem}>
          <Icon name="star" size={16} color={theme.OnSurfaceVariant} />
          <Text style={[styles.recommendationDetailText, {color: theme.OnSurfaceVariant}]}>
            Difficulty: {rec.difficulty}/5
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.actionButton, {backgroundColor: theme.primary}]}
        onPress={() => console.log('Start recommendation:', rec.id)}
      >
        <Text style={[styles.actionButtonText, {color: theme.OnPrimary}]}>
          Start Now
        </Text>
        <Icon name="play-arrow" size={16} color={theme.OnPrimary} />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderLearningStyle = (style: LearningStyle, index: number) => (
    <Animated.View
      key={style.id}
      entering={FadeInDown.delay(index * 100)}
      style={[styles.learningStyleCard, {backgroundColor: theme.Surface}]}
    >
      <View style={styles.learningStyleHeader}>
        <Text style={[styles.learningStyleType, {color: theme.OnSurface}]}>
          {style.type}
        </Text>
        <Text style={[styles.learningStylePercentage, {color: theme.primary}]}>
          {style.percentage}%
        </Text>
      </View>

      <View style={styles.styleProgressBar}>
        <View 
          style={[
            styles.styleProgressFill,
            {
              backgroundColor: theme.primary,
              width: `${style.percentage}%`
            }
          ]} 
        />
      </View>

      <Text style={[styles.learningStyleDescription, {color: theme.OnSurfaceVariant}]}>
        {style.description}
      </Text>

      <View style={styles.recommendationsContainer}>
        <Text style={[styles.recommendationsLabel, {color: theme.OnSurfaceVariant}]}>
          Recommendations:
        </Text>
        {style.recommendations.map((rec, recIndex) => (
          <View key={recIndex} style={styles.recommendationItem}>
            <Icon name="check-circle" size={14} color={theme.primary} />
            <Text style={[styles.recommendationItemText, {color: theme.OnSurfaceVariant}]}>
              {rec}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  const renderProgressInsight = (insight: ProgressInsight, index: number) => (
    <Animated.View
      key={insight.id}
      animation="fadeInRight"
      delay={index * 100}
      style={[styles.insightCard, {backgroundColor: theme.Surface}]}
    >
      <View style={styles.insightHeader}>
        <View style={styles.insightInfo}>
          <Text style={[styles.insightMetric, {color: theme.OnSurface}]}>
            {insight.metric}
          </Text>
          <Text style={[styles.insightValue, {color: theme.primary}]}>
            {insight.value}
          </Text>
        </View>
        <Icon 
          name={getTrendIcon(insight.trend)} 
          size={24} 
          color={getTrendColor(insight.trend)} 
        />
      </View>

      <Text style={[styles.insightText, {color: theme.OnSurfaceVariant}]}>
        {insight.insight}
      </Text>

      <View style={[styles.recommendationBox, {backgroundColor: theme.PrimaryContainer}]}>
        <Icon name="lightbulb" size={16} color={theme.OnPrimaryContainer} />
        <Text style={[styles.recommendationBoxText, {color: theme.OnPrimaryContainer}]}>
          {insight.recommendation}
        </Text>
      </View>
    </Animated.View>
  );

  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: theme.primary }}>
      <Appbar.BackAction onPress={() => onNavigate ? onNavigate('back') : navigation.goBack()} color={theme.OnPrimary} />
      <Appbar.Content
        title="AI Study Assistant"
        titleStyle={{ color: theme.OnPrimary, fontWeight: 'bold' }}
      />
      <Appbar.Action icon="auto-awesome" onPress={() => {}} color={theme.OnPrimary} />
    </Appbar.Header>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'plans':
        return (
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, {color: theme.OnBackground}]}>
                Your Study Plans
              </Text>
              <TouchableOpacity 
                style={[styles.addButton, {backgroundColor: theme.primary}]}
                onPress={() => setShowPlanModal(true)}
              >
                <Icon name="add" size={20} color={theme.OnPrimary} />
              </TouchableOpacity>
            </View>
            {studyPlans.map(renderStudyPlan)}
          </View>
        );

      case 'recommendations':
        return (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, {color: theme.OnBackground}]}>
              AI Recommendations
            </Text>
            {recommendations.map(renderRecommendation)}
          </View>
        );

      case 'style':
        return (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, {color: theme.OnBackground}]}>
              Your Learning Style
            </Text>
            {learningStyle.map(renderLearningStyle)}
          </View>
        );

      case 'insights':
        return (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, {color: theme.OnBackground}]}>
              Progress Insights
            </Text>
            {progressInsights.map(renderProgressInsight)}
          </View>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <StatusBar backgroundColor={theme.primary} barStyle="light-content" />
        {renderAppBar()}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ fontSize: 16, color: theme.OnSurfaceVariant, marginTop: 16 }}>
            Loading AI assistant...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar backgroundColor={theme.primary} barStyle="light-content" />
      {renderAppBar()}

      {/* Tab Bar - Improved scrollability and touch targets */}
      <View style={[styles.tabBar, {backgroundColor: theme.Surface}]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabScrollContent}
        >
          {renderTabButton('plans', 'Study Plans', 'assignment')}
          {renderTabButton('recommendations', 'Recommendations', 'lightbulb')}
          {renderTabButton('style', 'Learning Style', 'person')}
          {renderTabButton('insights', 'Insights', 'analytics')}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollContainer}>
        {renderContent()}
        <View style={{height: 100}} />
      </ScrollView>

      {/* Plan Generation Modal */}
      <Modal visible={showPlanModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {backgroundColor: theme.Surface}]}>
            <Text style={[styles.modalTitle, {color: theme.OnSurface}]}>
              Generate Study Plan
            </Text>
            
            <TextInput
              style={[styles.input, {
                borderColor: theme.Outline,
                color: theme.OnSurface
              }]}
              placeholder="Subject (e.g., Mathematics)"
              placeholderTextColor={theme.OnSurfaceVariant}
              value={planSubject}
              onChangeText={setPlanSubject}
            />
            
            <TextInput
              style={[styles.input, styles.textArea, {
                borderColor: theme.Outline,
                color: theme.OnSurface
              }]}
              placeholder="Learning Goal (e.g., Master calculus for JEE)"
              placeholderTextColor={theme.OnSurfaceVariant}
              value={planGoal}
              onChangeText={setPlanGoal}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, {backgroundColor: theme.Outline}]}
                onPress={() => setShowPlanModal(false)}
              >
                <Text style={[styles.modalButtonText, {color: theme.OnSurface}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, {backgroundColor: theme.primary}]}
                onPress={generatePersonalizedPlan}
                disabled={isGeneratingPlan}
              >
                {isGeneratingPlan ? (
                  <Text style={[styles.modalButtonText, {color: theme.OnPrimary}]}>
                    Generating...
                  </Text>
                ) : (
                  <Text style={[styles.modalButtonText, {color: theme.OnPrimary}]}>
                    Generate
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={4000}
          action={{
            label: 'Close',
            onPress: () => setSnackbarVisible(false),
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  aiIndicator: {
    padding: 4,
  },
  tabBar: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabScrollContent: {
    paddingRight: 16,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    minWidth: 120,
    justifyContent: 'center',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  planInfo: {
    flex: 1,
    marginRight: 12,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planSubject: {
    fontSize: 12,
    fontWeight: '500',
  },
  planMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  planDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  planDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  planDetailText: {
    fontSize: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  topicsContainer: {
    marginBottom: 16,
  },
  topicsLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  topicTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  topicText: {
    fontSize: 10,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  recommendationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationInfo: {
    flex: 1,
    marginRight: 12,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendationSubject: {
    fontSize: 12,
    fontWeight: '500',
  },
  recommendationMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendationReason: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  recommendationDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  recommendationDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recommendationDetailText: {
    fontSize: 12,
  },
  learningStyleCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  learningStyleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  learningStyleType: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  learningStylePercentage: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  styleProgressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    marginBottom: 12,
  },
  styleProgressFill: {
    height: 8,
    borderRadius: 4,
  },
  learningStyleDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  recommendationsContainer: {
    marginBottom: 8,
  },
  recommendationsLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  recommendationItemText: {
    fontSize: 12,
    flex: 1,
  },
  insightCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightInfo: {
    flex: 1,
  },
  insightMetric: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  recommendationBoxText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default EnhancedAIStudyAssistantScreen;
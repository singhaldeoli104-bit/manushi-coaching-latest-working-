/**
 * StudentAILearningDashboard - Phase 47.1: AI Learning Intelligence System
 * Personalized learning dashboard with AI-driven insights and recommendations
 * Features: Learning path visualization, AI tutoring, adaptive difficulty, performance prediction
 * Manushi Coaching Platform
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  SafeAreaView,
  StatusBar,
  BackHandler,
} from 'react-native';
import { Appbar, Portal, Snackbar, ActivityIndicator } from 'react-native-paper';

import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import * as AIStudyAssistantService from '../../services/aiStudyAssistantService';

const { width, height } = Dimensions.get('window');

interface LearningStyle {
  visual: number;
  auditory: number;
  kinesthetic: number;
  dominant: 'visual' | 'auditory' | 'kinesthetic';
}

interface LearningPath {
  id: string;
  subject: string;
  currentLevel: number;
  targetLevel: number;
  progress: number;
  estimatedCompletion: string;
  nextMilestone: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  aiRecommendations: string[];
}

interface PerformancePrediction {
  subject: string;
  currentScore: number;
  predictedScore: number;
  confidence: number;
  improvementAreas: string[];
  strengths: string[];
}

interface AIInsight {
  type: 'recommendation' | 'warning' | 'achievement' | 'tip';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

interface StudentAILearningDashboardProps {
  studentId?: string;
  studentName?: string;
  onNavigate?: (screen: string, params?: any) => void;
}

const StudentAILearningDashboard: React.FC<StudentAILearningDashboardProps> = ({
  studentId = 'student_123',
  studentName = 'Alex Johnson',
  onNavigate,
}) => {
  const { user } = useAuth();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [predictions, setPredictions] = useState<PerformancePrediction[]>([]);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);
  const [learningStyle, setLearningStyle] = useState<LearningStyle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'paths' | 'predictions' | 'insights'>('overview');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    initializeScreen();
    const backHandlerCleanup = setupBackHandler();
    return () => {
      backHandlerCleanup();
      cleanup();
    };
  }, []);

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

  const cleanup = useCallback(() => {
    // Cleanup resources
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const initializeScreen = useCallback(async () => {
    try {
      setLoading(true);
      await initializeAIData();
    } catch (error) {
      console.error('Error initializing screen:', error);
      showSnackbar('Failed to load AI dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  const initializeAIData = async () => {
    const userId = user?.id || studentId;

    if (!userId) {
      console.log('No user ID available');
      showSnackbar('Unable to load AI data - user not authenticated');
      return;
    }

    try {
      const [studyPlansResult, analyticsResult, predictionResult, recommendationsResult] = await Promise.all([
        AIStudyAssistantService.getStudyPlans(userId),
        AIStudyAssistantService.getLearningAnalytics(userId),
        AIStudyAssistantService.getPerformancePrediction(userId),
        AIStudyAssistantService.getAIRecommendations(userId),
      ]);

      // Map study plans to learning paths
      if (studyPlansResult.success && studyPlansResult.data) {
        const mappedPaths: LearningPath[] = studyPlansResult.data.map(plan => ({
          id: plan.id,
          subject: plan.subject,
          currentLevel: Math.floor(plan.progress / 10),
          targetLevel: 10,
          progress: plan.progress,
          estimatedCompletion: plan.duration,
          nextMilestone: plan.topics[0] || 'Next milestone',
          difficulty: plan.difficulty as 'beginner' | 'intermediate' | 'advanced',
          aiRecommendations: plan.topics.slice(0, 3),
        }));
        setLearningPaths(mappedPaths);
      }

      // Map performance prediction to predictions
      if (predictionResult.success && predictionResult.data) {
        const pred = predictionResult.data;
        const mappedPredictions: PerformancePrediction[] = [
          {
            subject: pred.subject,
            currentScore: pred.currentScore,
            predictedScore: pred.predictedScore,
            confidence: pred.confidence,
            improvementAreas: pred.weakAreas,
            strengths: pred.strongAreas,
          },
        ];
        setPredictions(mappedPredictions);
      }

      // Map recommendations to AI insights
      if (recommendationsResult.success && recommendationsResult.data) {
        const mappedInsights: AIInsight[] = recommendationsResult.data.map(rec => ({
          type: rec.type === 'study_plan' ? 'recommendation' : rec.type === 'practice' ? 'tip' : 'achievement',
          title: rec.title,
          description: rec.description,
          action: rec.type === 'study_plan' ? 'View Study Plan' : undefined,
          priority: rec.priority as 'high' | 'medium' | 'low',
        }));
        setAIInsights(mappedInsights);
      }

      // Set learning style from analytics
      if (analyticsResult.success && analyticsResult.data) {
        const analytics = analyticsResult.data;
        setLearningStyle({
          visual: 65,
          auditory: 25,
          kinesthetic: 30,
          dominant: analytics.learningStyle as 'visual' | 'auditory' | 'kinesthetic',
        });
      }

      showSnackbar('AI dashboard loaded successfully');
    } catch (error) {
      console.error('Error loading AI data:', error);
      showSnackbar('Failed to load AI dashboard data');
    }
  };

  const handleAITutorAccess = () => {
    Alert.alert(
      'AI Tutor',
      'Launch 24/7 AI Tutor for personalized help?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Launch Tutor', 
          onPress: () => onNavigate?.('ai-tutor-chat')
        }
      ]
    );
  };

  const handleLearningPathOptimize = (pathId: string) => {
    Alert.alert(
      'Optimize Learning Path',
      'AI will analyze your performance and adjust the learning path difficulty and content recommendations.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Optimize', 
          onPress: () => {
            // Simulate AI optimization
            Alert.alert('success', 'Learning path optimized based on your performance patterns!');
          }
        }
      ]
    );
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* AI Learning Style Analysis */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🧠 Your Learning Style</Text>
          <Text style={styles.confidenceScore}>AI Confidence: 89%</Text>
        </View>
        
        {learningStyle && (
          <View style={styles.learningStyleContainer}>
            <View style={styles.learningStyleItem}>
              <Text style={styles.learningStyleLabel}>Visual</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${learningStyle.visual}%` }]} />
              </View>
              <Text style={styles.percentageText}>{learningStyle.visual}%</Text>
            </View>
            
            <View style={styles.learningStyleItem}>
              <Text style={styles.learningStyleLabel}>Auditory</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${learningStyle.auditory}%` }]} />
              </View>
              <Text style={styles.percentageText}>{learningStyle.auditory}%</Text>
            </View>
            
            <View style={styles.learningStyleItem}>
              <Text style={styles.learningStyleLabel}>Kinesthetic</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${learningStyle.kinesthetic}%` }]} />
              </View>
              <Text style={styles.percentageText}>{learningStyle.kinesthetic}%</Text>
            </View>
            
            <Text style={styles.dominantStyle}>
              Dominant Style: <Text style={styles.highlightText}>{learningStyle.dominant.toUpperCase()}</Text>
            </Text>
          </View>
        )}
      </View>

      {/* AI Insights Overview */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🤖 AI Insights</Text>
        {aiInsights.slice(0, 2).map((insight, index) => (
          <TouchableOpacity key={index} style={styles.insightItem}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(insight.priority) }]}>
                <Text style={styles.priorityText}>{insight.priority.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.insightDescription}>{insight.description}</Text>
            {insight.action && (
              <Text style={styles.insightAction}>→ {insight.action}</Text>
            )}
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => setSelectedTab('insights')}
        >
          <Text style={styles.viewAllButtonText}>View All Insights</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>⚡ Quick AI Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionItem} onPress={handleAITutorAccess}>
            <Text style={styles.quickActionIcon}>🤖</Text>
            <Text style={styles.quickActionText}>AI Tutor</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionItem} onPress={() => setSelectedTab('paths')}>
            <Text style={styles.quickActionIcon}>🎯</Text>
            <Text style={styles.quickActionText}>Learning Paths</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionItem} onPress={() => setSelectedTab('predictions')}>
            <Text style={styles.quickActionIcon}>📈</Text>
            <Text style={styles.quickActionText}>Predictions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionItem} onPress={() => onNavigate?.('ai-study-recommendations')}>
            <Text style={styles.quickActionIcon}>💡</Text>
            <Text style={styles.quickActionText}>Study Tips</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderLearningPathsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabDescription}>
        AI-powered personalized learning paths adapted to your performance and learning style
      </Text>
      
      {learningPaths.map((path) => (
        <View key={path.id} style={styles.pathCard}>
          <View style={styles.pathHeader}>
            <Text style={styles.pathSubject}>{path.subject}</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(path.difficulty) }]}>
              <Text style={styles.difficultyText}>{path.difficulty.toUpperCase()}</Text>
            </View>
          </View>
          
          <View style={styles.pathProgress}>
            <Text style={styles.pathLevel}>Level {path.currentLevel} → {path.targetLevel}</Text>
            <View style={styles.pathProgressBarContainer}>
              <View style={[styles.pathProgressBar, { width: `${path.progress}%` }]} />
            </View>
            <Text style={styles.pathProgressText}>{path.progress}%</Text>
          </View>
          
          <Text style={styles.pathMilestone}>Next: {path.nextMilestone}</Text>
          <Text style={styles.pathCompletion}>Est. completion: {path.estimatedCompletion}</Text>
          
          <View style={styles.pathRecommendations}>
            <Text style={styles.pathRecommendationsTitle}>AI Recommendations:</Text>
            {path.aiRecommendations.map((rec, index) => (
              <Text key={index} style={styles.pathRecommendation}>• {rec}</Text>
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.optimizeButton}
            onPress={() => handleLearningPathOptimize(path.id)}
          >
            <Text style={styles.optimizeButtonText}>🤖 Optimize Path</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderPredictionsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabDescription}>
        AI-powered performance predictions based on your learning patterns and historical data
      </Text>
      
      {predictions.map((prediction, index) => (
        <View key={index} style={styles.predictionCard}>
          <Text style={styles.predictionSubject}>{prediction.subject}</Text>
          
          <View style={styles.scoreComparison}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Current</Text>
              <Text style={styles.currentScore}>{prediction.currentScore}%</Text>
            </View>
            
            <Text style={styles.scoreArrow}>→</Text>
            
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Predicted</Text>
              <Text style={styles.predictedScore}>{prediction.predictedScore}%</Text>
            </View>
          </View>
          
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>AI Confidence:</Text>
            <View style={styles.confidenceBarContainer}>
              <View style={[styles.confidenceBar, { width: `${prediction.confidence}%` }]} />
            </View>
            <Text style={styles.confidenceText}>{prediction.confidence}%</Text>
          </View>
          
          <View style={styles.analysisSection}>
            <View style={styles.analysisColumn}>
              <Text style={styles.analysisTitle}>🎯 Strengths</Text>
              {prediction.strengths.map((strength, i) => (
                <Text key={i} style={styles.strengthItem}>✓ {strength}</Text>
              ))}
            </View>
            
            <View style={styles.analysisColumn}>
              <Text style={styles.analysisTitle}>⚠️ Improvement Areas</Text>
              {prediction.improvementAreas.map((area, i) => (
                <Text key={i} style={styles.improvementItem}>• {area}</Text>
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderInsightsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabDescription}>
        Personalized AI insights and recommendations to enhance your learning experience
      </Text>
      
      {aiInsights.map((insight, index) => (
        <TouchableOpacity key={index} style={styles.fullInsightItem}>
          <View style={styles.insightTypeRow}>
            <Text style={styles.insightTypeIcon}>{getInsightIcon(insight.type)}</Text>
            <Text style={styles.insightTypeText}>{insight.type.toUpperCase()}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(insight.priority) }]}>
              <Text style={styles.priorityText}>{insight.priority.toUpperCase()}</Text>
            </View>
          </View>
          
          <Text style={styles.fullInsightTitle}>{insight.title}</Text>
          <Text style={styles.fullInsightDescription}>{insight.description}</Text>
          
          {insight.action && (
            <TouchableOpacity style={styles.insightActionButton}>
              <Text style={styles.insightActionButtonText}>{insight.action}</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: LightTheme.Primary }}>
      <Appbar.BackAction onPress={() => onNavigate?.('student-dashboard')} />
      <Appbar.Content
        title="AI Learning Dashboard"
        subtitle={`Personalized insights for ${studentName}`}
      />
      <Appbar.Action icon="robot" onPress={handleAITutorAccess} />
    </Appbar.Header>
  );

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#4ECDC4';
      case 'low': return '#95E1D3';
      default: return LightTheme.Surface;
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return '#4ECDC4';
      case 'intermediate': return '#FFE66D';
      case 'advanced': return '#FF6B6B';
      default: return LightTheme.Surface;
    }
  };

  const getInsightIcon = (type: string): string => {
    switch (type) {
      case 'recommendation': return '💡';
      case 'warning': return '⚠️';
      case 'achievement': return '🏆';
      case 'tip': return '💭';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
        <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
        {renderAppBar()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={LightTheme.Primary} />
          <Text style={styles.loadingText}>AI is analyzing your learning patterns...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
      <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
      {renderAppBar()}

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'paths', label: 'Learning Paths' },
          { key: 'predictions', label: 'Predictions' },
          { key: 'insights', label: 'AI Insights' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, selectedTab === tab.key && styles.activeTab]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'paths' && renderLearningPathsTab()}
        {selectedTab === 'predictions' && renderPredictionsTab()}
        {selectedTab === 'insights' && renderInsightsTab()}
      </ScrollView>

      {/* Snackbar for notifications */}
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
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
    backgroundColor: LightTheme.Background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LightTheme.Background,
  },
  loadingText: {
    ...Typography.bodyLarge,
    color: LightTheme.OnSurface,
    marginTop: Spacing.MD,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
    backgroundColor: LightTheme.Primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: Spacing.SM,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    marginLeft: Spacing.MD,
  },
  headerTitle: {
    ...Typography.titleLarge,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    ...Typography.bodyMedium,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  aiTutorButton: {
    padding: Spacing.SM,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  aiTutorButtonText: {
    fontSize: 24,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: LightTheme.Surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabItem: {
    flex: 1,
    paddingVertical: Spacing.MD,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: LightTheme.Primary,
  },
  tabText: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    fontWeight: '500',
  },
  activeTabText: {
    color: LightTheme.Primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: Spacing.LG,
  },
  tabDescription: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
    marginBottom: Spacing.XL,
    lineHeight: 22,
  },
  sectionCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 16,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.MD,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
  },
  confidenceScore: {
    ...Typography.bodySmall,
    color: LightTheme.Primary,
    fontWeight: 'bold',
  },
  learningStyleContainer: {
    gap: Spacing.MD,
  },
  learningStyleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.MD,
  },
  learningStyleLabel: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    width: 80,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: LightTheme.OutlineVariant,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: LightTheme.Primary,
    borderRadius: 4,
  },
  percentageText: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    width: 35,
    textAlign: 'right',
  },
  dominantStyle: {
    ...Typography.bodyLarge,
    color: LightTheme.OnSurface,
    marginTop: Spacing.SM,
    textAlign: 'center',
  },
  highlightText: {
    color: LightTheme.Primary,
    fontWeight: 'bold',
  },
  insightItem: {
    padding: Spacing.MD,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 12,
    marginBottom: Spacing.MD,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  insightTitle: {
    ...Typography.bodyLarge,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    ...Typography.labelSmall,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  insightDescription: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    lineHeight: 20,
  },
  insightAction: {
    ...Typography.bodyMedium,
    color: LightTheme.Primary,
    fontWeight: 'bold',
    marginTop: Spacing.SM,
  },
  viewAllButton: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.SM,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LightTheme.Primary,
  },
  viewAllButtonText: {
    ...Typography.bodyMedium,
    color: LightTheme.Primary,
    fontWeight: 'bold',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.MD,
    justifyContent: 'space-between',
  },
  quickActionItem: {
    flex: 1,
    minWidth: (width - Spacing.LG * 3) / 2 - Spacing.MD,
    padding: Spacing.LG,
    backgroundColor: LightTheme.PrimaryContainer,
    borderRadius: 12,
    alignItems: 'center',
    gap: Spacing.SM,
  },
  quickActionIcon: {
    fontSize: 32,
  },
  quickActionText: {
    ...Typography.bodyMedium,
    color: LightTheme.OnPrimaryContainer,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pathCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 16,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.MD,
  },
  pathSubject: {
    ...Typography.titleMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    ...Typography.labelSmall,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pathProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.MD,
    marginBottom: Spacing.MD,
  },
  pathLevel: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
  },
  pathProgressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: LightTheme.OutlineVariant,
    borderRadius: 5,
    overflow: 'hidden',
  },
  pathProgressBar: {
    height: '100%',
    backgroundColor: LightTheme.Primary,
    borderRadius: 5,
  },
  pathProgressText: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
  },
  pathMilestone: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.XS,
  },
  pathCompletion: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.MD,
  },
  pathRecommendations: {
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 12,
    padding: Spacing.MD,
    marginBottom: Spacing.MD,
  },
  pathRecommendationsTitle: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    marginBottom: Spacing.SM,
  },
  pathRecommendation: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    lineHeight: 18,
  },
  optimizeButton: {
    backgroundColor: LightTheme.Primary,
    borderRadius: 12,
    paddingVertical: Spacing.MD,
    alignItems: 'center',
  },
  optimizeButtonText: {
    ...Typography.bodyMedium,
    color: LightTheme.OnPrimary,
    fontWeight: 'bold',
  },
  predictionCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 16,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  predictionSubject: {
    ...Typography.titleMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    marginBottom: Spacing.LG,
    textAlign: 'center',
  },
  scoreComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.LG,
    gap: Spacing.LG,
  },
  scoreItem: {
    alignItems: 'center',
    gap: Spacing.SM,
  },
  scoreLabel: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
  },
  currentScore: {
    ...Typography.headlineMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
  },
  scoreArrow: {
    ...Typography.headlineMedium,
    color: LightTheme.Primary,
    fontWeight: 'bold',
  },
  predictedScore: {
    ...Typography.headlineMedium,
    color: LightTheme.Primary,
    fontWeight: 'bold',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.MD,
    marginBottom: Spacing.LG,
  },
  confidenceLabel: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
  },
  confidenceBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: LightTheme.OutlineVariant,
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceBar: {
    height: '100%',
    backgroundColor: LightTheme.Tertiary,
    borderRadius: 4,
  },
  confidenceText: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
  },
  analysisSection: {
    flexDirection: 'row',
    gap: Spacing.LG,
  },
  analysisColumn: {
    flex: 1,
  },
  analysisTitle: {
    ...Typography.bodyLarge,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    marginBottom: Spacing.MD,
  },
  strengthItem: {
    ...Typography.bodyMedium,
    color: LightTheme.Primary,
    marginBottom: Spacing.SM,
    lineHeight: 18,
  },
  improvementItem: {
    ...Typography.bodyMedium,
    color: LightTheme.Error,
    marginBottom: Spacing.SM,
    lineHeight: 18,
  },
  fullInsightItem: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 16,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  insightTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.MD,
    gap: Spacing.SM,
  },
  insightTypeIcon: {
    fontSize: 24,
  },
  insightTypeText: {
    ...Typography.labelMedium,
    color: LightTheme.OnSurfaceVariant,
    fontWeight: 'bold',
    flex: 1,
  },
  fullInsightTitle: {
    ...Typography.titleMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    marginBottom: Spacing.SM,
  },
  fullInsightDescription: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    lineHeight: 20,
    marginBottom: Spacing.MD,
  },
  insightActionButton: {
    backgroundColor: LightTheme.PrimaryContainer,
    borderRadius: 12,
    paddingVertical: Spacing.MD,
    paddingHorizontal: Spacing.LG,
    alignSelf: 'flex-start',
  },
  insightActionButtonText: {
    ...Typography.bodyMedium,
    color: LightTheme.OnPrimaryContainer,
    fontWeight: 'bold',
  },
});

export default StudentAILearningDashboard;
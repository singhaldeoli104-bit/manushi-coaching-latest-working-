/**
 * ProgressDetailScreen - Phase 44.2: Enhanced Analytics Dashboard for Progress Enhancement
 * Advanced comprehensive progress tracking with predictive analytics and real-time insights
 * Enhanced Phase 44.2 features: Real-time performance tracking, predictive analytics, comparative analysis, detailed visualizations
 * Base Phase 26.1 features: Subject-wise visualization, grade trends, achievements, learning insights
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  BackHandler,
  Share,
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

// Import Supabase services
import * as StudentProgressService from '../../services/studentProgressService';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

// Props interface for AppNavigator integration
interface ProgressDetailScreenProps {
  onNavigate: (screen: string) => void;
}

interface SubjectProgress {
  id: string;
  subject: string;
  currentScore: number;
  previousScore: number;
  classAverage: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  skillsProgress: SkillProgress[];
}

interface SkillProgress {
  skill: string;
  progress: number;
  status: 'mastered' | 'developing' | 'needs-work';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: 'academic' | 'participation' | 'improvement';
}

interface LearningInsight {
  type: 'time-spent' | 'weak-area' | 'study-habit' | 'recommendation';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface PredictiveAnalytics {
  projectedGrade: number;
  confidenceLevel: number;
  targetGrade: number;
  daysToTarget: number;
  studyRecommendations: string[];
  riskFactors: RiskFactor[];
}

interface RiskFactor {
  factor: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
  mitigation: string;
}

interface ComparativeMetrics {
  classRank: number;
  totalStudents: number;
  percentile: number;
  topPerformers: StudentMetric[];
  performanceGap: number;
}

interface StudentMetric {
  name: string;
  score: number;
  isAnonymous: boolean;
}

interface RealTimeMetrics {
  currentSession: {
    timeSpent: number;
    topicsCompleted: number;
    accuracy: number;
    focusScore: number;
  };
  dailyStreak: number;
  weeklyProgress: WeeklyProgress[];
  monthlyTrends: MonthlyTrend[];
}

interface WeeklyProgress {
  day: string;
  studyTime: number;
  completedTasks: number;
  score: number;
}

interface MonthlyTrend {
  month: string;
  averageScore: number;
  studyHours: number;
  improvement: number;
}

interface DetailedVisualization {
  type: 'line' | 'bar' | 'pie' | 'radar';
  data: ChartDataPoint[];
  title: string;
  subtitle?: string;
}

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  trend?: 'up' | 'down' | 'stable';
}

const ProgressDetailScreen: React.FC<ProgressDetailScreenProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  // Core State
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Feature State
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | '3months' | '6months'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'achievements' | 'insights' | 'predictive' | 'realtime' | 'comparative'>('overview');
  const [showDetailedCharts, setShowDetailedCharts] = useState(false);
  const [selectedSubjectForAnalysis, setSelectedSubjectForAnalysis] = useState<string | null>(null);
  const [isLiveTrackingEnabled, setIsLiveTrackingEnabled] = useState(true);

  // Lifecycle
  useEffect(() => {
    initializeScreen();
    const backHandler = setupBackHandler();
    return () => {
      backHandler.remove();
      cleanup();
    };
  }, []);

  const initializeScreen = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate loading data
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSnackbar('Progress data loaded successfully');
    } catch (error) {
      showSnackbar('Failed to load progress data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setupBackHandler = useCallback(() => {
    return BackHandler.addEventListener('hardwareBackPress', () => {
      onNavigate('back');
      return true;
    });
  }, [onNavigate]);

  const cleanup = useCallback(() => {
    // Cleanup logic if needed
  }, []);

  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }, []);

  // Mock data based on research requirements
  const progressData: SubjectProgress[] = [
    {
      id: '1',
      subject: 'Mathematics',
      currentScore: 85,
      previousScore: 78,
      classAverage: 82,
      trend: 'up',
      color: '#6750A4',
      skillsProgress: [
        { skill: 'Algebra', progress: 90, status: 'mastered' },
        { skill: 'Geometry', progress: 85, status: 'developing' },
        { skill: 'Calculus', progress: 70, status: 'developing' },
        { skill: 'Statistics', progress: 60, status: 'needs-work' },
      ],
    },
    {
      id: '2',
      subject: 'Physics',
      currentScore: 72,
      previousScore: 75,
      classAverage: 74,
      trend: 'down',
      color: '#7C4DFF',
      skillsProgress: [
        { skill: 'Mechanics', progress: 80, status: 'mastered' },
        { skill: 'Thermodynamics', progress: 70, status: 'developing' },
        { skill: 'Electromagnetism', progress: 65, status: 'needs-work' },
        { skill: 'Optics', progress: 75, status: 'developing' },
      ],
    },
    {
      id: '3',
      subject: 'Chemistry',
      currentScore: 68,
      previousScore: 68,
      classAverage: 71,
      trend: 'stable',
      color: '#FF6B35',
      skillsProgress: [
        { skill: 'Organic Chemistry', progress: 75, status: 'developing' },
        { skill: 'Inorganic Chemistry', progress: 65, status: 'needs-work' },
        { skill: 'Physical Chemistry', progress: 60, status: 'needs-work' },
      ],
    },
    {
      id: '4',
      subject: 'Biology',
      currentScore: 91,
      previousScore: 88,
      classAverage: 85,
      trend: 'up',
      color: '#4CAF50',
      skillsProgress: [
        { skill: 'Cell Biology', progress: 95, status: 'mastered' },
        { skill: 'Genetics', progress: 90, status: 'mastered' },
        { skill: 'Ecology', progress: 88, status: 'developing' },
        { skill: 'Evolution', progress: 92, status: 'mastered' },
      ],
    },
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Math Master',
      description: 'Scored 90+ in Mathematics for 3 consecutive tests',
      icon: '🏆',
      earnedDate: '2025-01-15',
      category: 'academic',
    },
    {
      id: '2',
      title: 'Perfect Attendance',
      description: 'Attended all classes for the month',
      icon: '📅',
      earnedDate: '2025-01-31',
      category: 'participation',
    },
    {
      id: '3',
      title: 'Rising Star',
      description: 'Improved overall grade by 15 points',
      icon: '⭐',
      earnedDate: '2025-02-01',
      category: 'improvement',
    },
    {
      id: '4',
      title: 'Biology Expert',
      description: 'Maintained 90+ average in Biology',
      icon: '🧬',
      earnedDate: '2025-02-02',
      category: 'academic',
    },
  ];

  const learningInsights: LearningInsight[] = [
    {
      type: 'time-spent',
      title: 'Study Time Distribution',
      description: 'You spend 40% of study time on Mathematics, consider balancing with weaker subjects',
      actionable: true,
      priority: 'medium',
    },
    {
      type: 'weak-area',
      title: 'Chemistry Needs Attention',
      description: 'Chemistry performance is below class average. Focus on Inorganic Chemistry concepts',
      actionable: true,
      priority: 'high',
    },
    {
      type: 'study-habit',
      title: 'Evening Study Pattern',
      description: 'You perform best during evening study sessions (6-8 PM)',
      actionable: false,
      priority: 'low',
    },
    {
      type: 'recommendation',
      title: 'Practice More Problems',
      description: 'Increase problem-solving practice in Physics to improve trends',
      actionable: true,
      priority: 'high',
    },
  ];

  // Phase 44.2: Enhanced Analytics Data
  const predictiveAnalytics: PredictiveAnalytics = {
    projectedGrade: 82,
    confidenceLevel: 87,
    targetGrade: 85,
    daysToTarget: 45,
    studyRecommendations: [
      'Increase Chemistry study time by 30 minutes daily',
      'Focus on Inorganic Chemistry problem-solving',
      'Complete 2 additional practice tests weekly',
      'Join study group for Physics concepts'
    ],
    riskFactors: [
      {
        factor: 'Chemistry Performance',
        impact: 'high',
        description: 'Below class average with declining trend',
        mitigation: 'Increase study time and seek teacher help'
      },
      {
        factor: 'Physics Trend',
        impact: 'medium',
        description: 'Slight downward trend in recent tests',
        mitigation: 'Review fundamentals and practice problems'
      }
    ]
  };

  const comparativeMetrics: ComparativeMetrics = {
    classRank: 12,
    totalStudents: 45,
    percentile: 73,
    topPerformers: [
      { name: 'Anonymous Student A', score: 95, isAnonymous: true },
      { name: 'Anonymous Student B', score: 93, isAnonymous: true },
      { name: 'Anonymous Student C', score: 91, isAnonymous: true }
    ],
    performanceGap: 13
  };

  const realTimeMetrics: RealTimeMetrics = {
    currentSession: {
      timeSpent: 45, // minutes
      topicsCompleted: 3,
      accuracy: 87,
      focusScore: 92
    },
    dailyStreak: 7,
    weeklyProgress: [
      { day: 'Mon', studyTime: 120, completedTasks: 5, score: 85 },
      { day: 'Tue', studyTime: 90, completedTasks: 3, score: 78 },
      { day: 'Wed', studyTime: 150, completedTasks: 6, score: 92 },
      { day: 'Thu', studyTime: 110, completedTasks: 4, score: 88 },
      { day: 'Fri', studyTime: 130, completedTasks: 5, score: 84 },
      { day: 'Sat', studyTime: 180, completedTasks: 8, score: 95 },
      { day: 'Sun', studyTime: 100, completedTasks: 4, score: 80 }
    ],
    monthlyTrends: [
      { month: 'Jan', averageScore: 75, studyHours: 80, improvement: 5 },
      { month: 'Feb', averageScore: 79, studyHours: 85, improvement: 4 },
      { month: 'Mar', averageScore: 82, studyHours: 90, improvement: 3 }
    ]
  };

  const detailedVisualizations: DetailedVisualization[] = [
    {
      type: 'line',
      title: 'Performance Trend',
      subtitle: 'Last 6 months progress',
      data: [
        { label: 'Oct', value: 70, trend: 'up' },
        { label: 'Nov', value: 75, trend: 'up' },
        { label: 'Dec', value: 77, trend: 'up' },
        { label: 'Jan', value: 75, trend: 'down' },
        { label: 'Feb', value: 79, trend: 'up' },
        { label: 'Mar', value: 82, trend: 'up' }
      ]
    },
    {
      type: 'radar',
      title: 'Skills Assessment',
      data: [
        { label: 'Problem Solving', value: 85, color: '#6750A4' },
        { label: 'Conceptual Understanding', value: 78, color: '#7C4DFF' },
        { label: 'Application', value: 82, color: '#FF6B35' },
        { label: 'Analysis', value: 75, color: '#4CAF50' },
        { label: 'Memory Retention', value: 88, color: '#FF9800' }
      ]
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const getSkillStatusColor = (status: string) => {
    switch (status) {
      case 'mastered': return '#4CAF50';
      case 'developing': return '#FF9800';
      case 'needs-work': return '#F44336';
      default: return LightTheme.OnSurfaceVariant;
    }
  };

  const getInsightPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return LightTheme.OnSurfaceVariant;
    }
  };

  const handleShareProgress = async () => {
    try {
      // Calculate overall average from progress data
      const overallAverage = Math.round(
        progressData.reduce((sum, subject) => sum + subject.currentScore, 0) / progressData.length
      );

      // Find top subject
      const topSubject = progressData.reduce((prev, current) =>
        (current.currentScore > prev.currentScore) ? current : prev
      );

      // Count achievements
      const achievementCount = achievements.length;

      // Format shareable message
      const message = `📊 My Academic Progress Report\n\n` +
        `📈 Overall Average: ${overallAverage}%\n` +
        `🏆 Class Rank: #${comparativeMetrics.classRank} out of ${comparativeMetrics.totalStudents}\n` +
        `📊 Percentile: ${comparativeMetrics.percentile}%\n\n` +
        `🌟 Top Subject: ${topSubject.subject} (${topSubject.currentScore}%)\n` +
        `🏅 Achievements Earned: ${achievementCount}\n` +
        `🔥 Study Streak: ${realTimeMetrics.dailyStreak} days\n\n` +
        `💡 Projected Grade: ${predictiveAnalytics.projectedGrade}%\n` +
        `🎯 Target Grade: ${predictiveAnalytics.targetGrade}%\n\n` +
        `Keep pushing forward! 🚀`;

      await Share.share({
        message: message,
        title: 'My Academic Progress',
      });

      showSnackbar('Progress shared successfully!');
    } catch (error: any) {
      if (error.message !== 'User did not share') {
        console.error('Error sharing progress:', error);
        showSnackbar('Failed to share progress');
      }
    }
  };

  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: LightTheme.Primary }}>
      <Appbar.BackAction onPress={() => onNavigate('back')} />
      <Appbar.Content title="Progress Analytics" subtitle="Track your learning journey" />
      <Appbar.Action icon="share-variant" onPress={handleShareProgress} />
    </Appbar.Header>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>

        {/* Time Range Selector */}
        <View style={styles.timeRangeSelector}>
          {(['week', 'month', '3months', '6months'] as const).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                selectedTimeRange === range && styles.timeRangeButtonActive
              ]}
              onPress={() => setSelectedTimeRange(range)}
            >
              <Text style={[
                styles.timeRangeButtonText,
                selectedTimeRange === range && styles.timeRangeButtonTextActive
              ]}>
                {range === '3months' ? '3M' : range === '6months' ? '6M' : range.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Selector - Phase 44.2 Enhanced */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.tabSelector}
          contentContainerStyle={styles.tabSelectorContent}
        >
          {(['overview', 'subjects', 'achievements', 'insights', 'predictive', 'realtime', 'comparative'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.tabButtonActive
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabButtonText,
                activeTab === tab && styles.tabButtonTextActive
              ]}>
                {tab === 'realtime' ? 'Real-Time' : 
                 tab === 'predictive' ? 'Predictive' :
                 tab === 'comparative' ? 'Compare' :
                 tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Overall Performance Card */}
      <View style={styles.overallCard}>
        <View style={styles.overallHeader}>
          <Text style={styles.overallTitle}>Overall Performance</Text>
          <Text style={styles.overallTrend}>📈 +8% this month</Text>
        </View>
        
        <View style={styles.overallMetrics}>
          <View style={styles.overallMetric}>
            <Text style={styles.overallMetricValue}>79%</Text>
            <Text style={styles.overallMetricLabel}>Average Score</Text>
          </View>
          
          <View style={styles.overallMetricSeparator} />
          
          <View style={styles.overallMetric}>
            <Text style={styles.overallMetricValue}>78%</Text>
            <Text style={styles.overallMetricLabel}>Class Average</Text>
          </View>
          
          <View style={styles.overallMetricSeparator} />
          
          <View style={styles.overallMetric}>
            <Text style={styles.overallMetricValue}>12</Text>
            <Text style={styles.overallMetricLabel}>Rank</Text>
          </View>
        </View>
      </View>

      {/* Subject Performance Overview */}
      <Text style={styles.sectionTitle}>Subject Performance</Text>
      {progressData.map((subject) => (
        <View key={subject.id} style={styles.subjectOverviewCard}>
          <View style={styles.subjectOverviewHeader}>
            <View style={[styles.subjectColorIndicator, { backgroundColor: subject.color }]} />
            <Text style={styles.subjectOverviewName}>{subject.subject}</Text>
            <Text style={styles.subjectOverviewTrend}>{getTrendIcon(subject.trend)}</Text>
          </View>
          
          <View style={styles.subjectOverviewMetrics}>
            <Text style={styles.subjectOverviewScore}>{subject.currentScore}%</Text>
            <View style={styles.subjectOverviewComparison}>
              <Text style={styles.subjectOverviewPrevious}>
                Previous: {subject.previousScore}%
              </Text>
              <Text style={styles.subjectOverviewAverage}>
                Average: {subject.classAverage}%
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderSubjectsTab = () => (
    <View style={styles.tabContent}>
      {progressData.map((subject) => (
        <View key={subject.id} style={styles.subjectDetailCard}>
          <View style={styles.subjectDetailHeader}>
            <View style={styles.subjectDetailTitleRow}>
              <View style={[styles.subjectColorIndicator, { backgroundColor: subject.color }]} />
              <Text style={styles.subjectDetailName}>{subject.subject}</Text>
              <Text style={styles.subjectDetailScore}>{subject.currentScore}%</Text>
            </View>
            
            <View style={styles.subjectDetailMetrics}>
              <Text style={styles.subjectDetailChange}>
                {subject.trend === 'up' ? '+' : subject.trend === 'down' ? '-' : ''}
                {Math.abs(subject.currentScore - subject.previousScore)}% from last month
              </Text>
            </View>
          </View>

          <Text style={styles.skillsTitle}>Skills Breakdown</Text>
          {subject.skillsProgress.map((skill, index) => (
            <View key={index} style={styles.skillItem}>
              <View style={styles.skillHeader}>
                <Text style={styles.skillName}>{skill.skill}</Text>
                <Text style={styles.skillProgress}>{skill.progress}%</Text>
              </View>
              
              <View style={styles.skillProgressContainer}>
                <View style={styles.skillProgressBackground}>
                  <View 
                    style={[
                      styles.skillProgressFill,
                      { 
                        width: `${skill.progress}%`, 
                        backgroundColor: getSkillStatusColor(skill.status) 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.skillStatus, { color: getSkillStatusColor(skill.status) }]}>
                  {skill.status.replace('-', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  const renderAchievementsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.achievementsStats}>
        <Text style={styles.achievementsStatsText}>
          🏆 {achievements.length} Total Achievements
        </Text>
      </View>

      {achievements.map((achievement) => (
        <View key={achievement.id} style={styles.achievementCard}>
          <View style={styles.achievementHeader}>
            <Text style={styles.achievementIcon}>{achievement.icon}</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
              <Text style={styles.achievementDate}>
                Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={[styles.achievementCategory, 
              { backgroundColor: 
                achievement.category === 'academic' ? '#6750A4' :
                achievement.category === 'participation' ? '#4CAF50' :
                '#FF9800'
              }
            ]}>
              <Text style={styles.achievementCategoryText}>
                {achievement.category.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderInsightsTab = () => (
    <View style={styles.tabContent}>
      {learningInsights.map((insight, index) => (
        <View key={index} style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={styles.insightTitleRow}>
              <View style={[
                styles.insightPriorityIndicator, 
                { backgroundColor: getInsightPriorityColor(insight.priority) }
              ]} />
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightType}>
                {insight.type === 'time-spent' ? '⏱️' :
                 insight.type === 'weak-area' ? '⚠️' :
                 insight.type === 'study-habit' ? '📚' : '💡'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.insightDescription}>{insight.description}</Text>
          
          {insight.actionable && (
            <TouchableOpacity
              style={styles.insightActionButton}
              onPress={() => {
                if (insight.type === 'weak-area') {
                  onNavigate('study-library');
                } else if (insight.type === 'time-spent') {
                  onNavigate('schedule');
                } else if (insight.type === 'recommendation') {
                  onNavigate('ai-study');
                } else {
                  showSnackbar('Opening relevant resources...');
                }
              }}
            >
              <Text style={styles.insightActionButtonText}>Take Action</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  // Phase 44.2: Enhanced Tab Renderers
  const renderPredictiveTab = () => (
    <View style={styles.tabContent}>
      {/* Predictive Analytics Card */}
      <View style={styles.predictiveCard}>
        <View style={styles.predictiveHeader}>
          <Text style={styles.predictiveTitle}>📈 Performance Prediction</Text>
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>{predictiveAnalytics.confidenceLevel}% Confident</Text>
          </View>
        </View>
        
        <View style={styles.projectionMetrics}>
          <View style={styles.projectionItem}>
            <Text style={styles.projectionLabel}>Projected Grade</Text>
            <Text style={styles.projectionValue}>{predictiveAnalytics.projectedGrade}%</Text>
          </View>
          
          <View style={styles.projectionSeparator} />
          
          <View style={styles.projectionItem}>
            <Text style={styles.projectionLabel}>Target Grade</Text>
            <Text style={[styles.projectionValue, { color: '#4CAF50' }]}>{predictiveAnalytics.targetGrade}%</Text>
          </View>
          
          <View style={styles.projectionSeparator} />
          
          <View style={styles.projectionItem}>
            <Text style={styles.projectionLabel}>Days to Target</Text>
            <Text style={styles.projectionValue}>{predictiveAnalytics.daysToTarget}</Text>
          </View>
        </View>
      </View>

      {/* Risk Factors */}
      <Text style={styles.sectionTitle}>🚨 Risk Factors</Text>
      {predictiveAnalytics.riskFactors.map((risk, index) => (
        <View key={index} style={styles.riskCard}>
          <View style={styles.riskHeader}>
            <View style={[styles.riskIndicator, 
              { backgroundColor: risk.impact === 'high' ? '#F44336' : 
                               risk.impact === 'medium' ? '#FF9800' : '#4CAF50' }
            ]} />
            <Text style={styles.riskFactor}>{risk.factor}</Text>
            <Text style={[styles.riskImpact, 
              { color: risk.impact === 'high' ? '#F44336' : 
                      risk.impact === 'medium' ? '#FF9800' : '#4CAF50' }
            ]}>
              {risk.impact.toUpperCase()} IMPACT
            </Text>
          </View>
          <Text style={styles.riskDescription}>{risk.description}</Text>
          <Text style={styles.riskMitigation}>💡 {risk.mitigation}</Text>
        </View>
      ))}

      {/* Study Recommendations */}
      <Text style={styles.sectionTitle}>📚 AI Recommendations</Text>
      <View style={styles.recommendationsCard}>
        {predictiveAnalytics.studyRecommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Text style={styles.recommendationBullet}>•</Text>
            <Text style={styles.recommendationText}>{recommendation}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderRealTimeTab = () => (
    <View style={styles.tabContent}>
      {/* Current Session Card */}
      <View style={styles.realTimeCard}>
        <View style={styles.realTimeHeader}>
          <Text style={styles.realTimeTitle}>⏱️ Current Study Session</Text>
          <View style={[styles.liveIndicator, { opacity: isLiveTrackingEnabled ? 1 : 0.5 }]}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
        
        <View style={styles.sessionMetrics}>
          <View style={styles.sessionMetric}>
            <Text style={styles.sessionMetricValue}>{realTimeMetrics.currentSession.timeSpent}m</Text>
            <Text style={styles.sessionMetricLabel}>Time Spent</Text>
          </View>
          
          <View style={styles.sessionMetric}>
            <Text style={styles.sessionMetricValue}>{realTimeMetrics.currentSession.topicsCompleted}</Text>
            <Text style={styles.sessionMetricLabel}>Topics Done</Text>
          </View>
          
          <View style={styles.sessionMetric}>
            <Text style={styles.sessionMetricValue}>{realTimeMetrics.currentSession.accuracy}%</Text>
            <Text style={styles.sessionMetricLabel}>Accuracy</Text>
          </View>
          
          <View style={styles.sessionMetric}>
            <Text style={styles.sessionMetricValue}>{realTimeMetrics.currentSession.focusScore}%</Text>
            <Text style={styles.sessionMetricLabel}>Focus Score</Text>
          </View>
        </View>
      </View>

      {/* Daily Streak */}
      <View style={styles.streakCard}>
        <Text style={styles.streakTitle}>🔥 Study Streak</Text>
        <Text style={styles.streakValue}>{realTimeMetrics.dailyStreak} Days</Text>
        <Text style={styles.streakMotivation}>Keep it going! You're on fire!</Text>
      </View>

      {/* Weekly Progress Chart */}
      <Text style={styles.sectionTitle}>📊 This Week's Progress</Text>
      <View style={styles.weeklyChartCard}>
        <View style={styles.weeklyChart}>
          {realTimeMetrics.weeklyProgress.map((day, index) => (
            <View key={index} style={styles.dayColumn}>
              <View style={styles.dayBar}>
                <View 
                  style={[
                    styles.dayBarFill, 
                    { height: `${(day.studyTime / 180) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.dayLabel}>{day.day}</Text>
              <Text style={styles.dayValue}>{day.studyTime}m</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Monthly Trends */}
      <Text style={styles.sectionTitle}>📈 Monthly Trends</Text>
      {realTimeMetrics.monthlyTrends.map((month, index) => (
        <View key={index} style={styles.monthlyTrendCard}>
          <View style={styles.monthlyTrendHeader}>
            <Text style={styles.monthlyTrendMonth}>{month.month}</Text>
            <Text style={[styles.monthlyTrendImprovement, 
              { color: month.improvement > 0 ? '#4CAF50' : '#F44336' }
            ]}>
              {month.improvement > 0 ? '+' : ''}{month.improvement}% change
            </Text>
          </View>
          <View style={styles.monthlyTrendMetrics}>
            <Text style={styles.monthlyTrendMetric}>Avg Score: {month.averageScore}%</Text>
            <Text style={styles.monthlyTrendMetric}>Study Hours: {month.studyHours}h</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderComparativeTab = () => (
    <View style={styles.tabContent}>
      {/* Class Ranking Card */}
      <View style={styles.comparativeCard}>
        <View style={styles.comparativeHeader}>
          <Text style={styles.comparativeTitle}>🏆 Class Ranking</Text>
        </View>
        
        <View style={styles.rankingMetrics}>
          <View style={styles.rankingMetric}>
            <Text style={styles.rankingValue}>#{comparativeMetrics.classRank}</Text>
            <Text style={styles.rankingLabel}>Your Rank</Text>
          </View>
          
          <View style={styles.rankingSeparator} />
          
          <View style={styles.rankingMetric}>
            <Text style={styles.rankingValue}>{comparativeMetrics.percentile}%</Text>
            <Text style={styles.rankingLabel}>Percentile</Text>
          </View>
          
          <View style={styles.rankingSeparator} />
          
          <View style={styles.rankingMetric}>
            <Text style={styles.rankingValue}>{comparativeMetrics.totalStudents}</Text>
            <Text style={styles.rankingLabel}>Total Students</Text>
          </View>
        </View>
      </View>

      {/* Performance Gap */}
      <View style={styles.gapCard}>
        <Text style={styles.gapTitle}>📊 Performance Gap Analysis</Text>
        <Text style={styles.gapValue}>{comparativeMetrics.performanceGap} points</Text>
        <Text style={styles.gapDescription}>
          You're {comparativeMetrics.performanceGap} points away from the top performer.
          With focused study, this gap can be closed in 4-6 weeks.
        </Text>
      </View>

      {/* Top Performers Comparison */}
      <Text style={styles.sectionTitle}>🥇 Top Performers</Text>
      {comparativeMetrics.topPerformers.map((performer, index) => (
        <View key={index} style={styles.performerCard}>
          <View style={styles.performerRank}>
            <Text style={styles.performerRankText}>#{index + 1}</Text>
          </View>
          <View style={styles.performerInfo}>
            <Text style={styles.performerName}>{performer.name}</Text>
            <Text style={styles.performerScore}>{performer.score}%</Text>
          </View>
          <View style={styles.performerBadge}>
            <Text style={styles.performerBadgeText}>
              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
            </Text>
          </View>
        </View>
      ))}

      {/* Improvement Suggestions */}
      <View style={styles.improvementCard}>
        <Text style={styles.improvementTitle}>🚀 Close the Gap</Text>
        <Text style={styles.improvementText}>
          Focus on Chemistry and Physics to move up 5-7 ranks. 
          Top performers excel in problem-solving and consistent practice.
        </Text>
      </View>
    </View>
  );

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab();
      case 'subjects': return renderSubjectsTab();
      case 'achievements': return renderAchievementsTab();
      case 'insights': return renderInsightsTab();
      case 'predictive': return renderPredictiveTab();
      case 'realtime': return renderRealTimeTab();
      case 'comparative': return renderComparativeTab();
      default: return renderOverviewTab();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
        <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
        {renderAppBar()}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={LightTheme.Primary} />
          <Text style={{ marginTop: Spacing.MD, color: LightTheme.OnBackground }}>
            Loading Progress Analytics...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
      <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
      {renderAppBar()}
      {renderHeader()}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentTab()}
      </ScrollView>
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={4000}
          action={{
            label: 'OK',
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
    backgroundColor: LightTheme.Background,
  },
  header: {
    backgroundColor: LightTheme.Primary,
    paddingBottom: Spacing.MD,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.LG,
    marginBottom: Spacing.MD,
  },
  timeRangeButton: {
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    marginRight: Spacing.SM,
    borderRadius: BorderRadius.SM,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  timeRangeButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  timeRangeButtonText: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timeRangeButtonTextActive: {
    color: LightTheme.Primary,
    fontWeight: '600',
  },
  tabSelector: {
    paddingHorizontal: Spacing.LG,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabButton: {
    paddingVertical: Spacing.MD,
    paddingHorizontal: Spacing.MD,
    marginRight: Spacing.SM,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFFFFF',
  },
  tabButtonText: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.XXL,
  },
  tabContent: {
    padding: Spacing.LG,
  },
  sectionTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnBackground,
    marginBottom: Spacing.MD,
    marginTop: Spacing.LG,
  },
  
  // Overview Tab Styles
  overallCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.LG,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.LG,
  },
  overallTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
  },
  overallTrend: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: '#4CAF50',
    fontWeight: '600',
  },
  overallMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallMetric: {
    alignItems: 'center',
    flex: 1,
  },
  overallMetricValue: {
    fontSize: Typography.headlineMedium.fontSize,
    fontFamily: Typography.headlineMedium.fontFamily,
    fontWeight: Typography.headlineMedium.fontWeight,
    color: LightTheme.Primary,
    marginBottom: Spacing.XS,
  },
  overallMetricLabel: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
  },
  overallMetricSeparator: {
    width: 1,
    height: 40,
    backgroundColor: LightTheme.Outline,
    marginHorizontal: Spacing.MD,
  },
  subjectOverviewCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.MD,
    marginBottom: Spacing.SM,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  subjectOverviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  subjectColorIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: Spacing.SM,
  },
  subjectOverviewName: {
    flex: 1,
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
  },
  subjectOverviewTrend: {
    fontSize: 16,
  },
  subjectOverviewMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectOverviewScore: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
    marginRight: Spacing.MD,
  },
  subjectOverviewComparison: {
    flex: 1,
  },
  subjectOverviewPrevious: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  subjectOverviewAverage: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },

  // Subjects Tab Styles
  subjectDetailCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.LG,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subjectDetailHeader: {
    marginBottom: Spacing.LG,
  },
  subjectDetailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  subjectDetailName: {
    flex: 1,
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
    marginLeft: Spacing.SM,
  },
  subjectDetailScore: {
    fontSize: Typography.titleLarge.fontSize,
    fontFamily: Typography.titleLarge.fontFamily,
    fontWeight: Typography.titleLarge.fontWeight,
    color: LightTheme.Primary,
  },
  subjectDetailMetrics: {
    marginLeft: Spacing.LG,
  },
  subjectDetailChange: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  skillsTitle: {
    fontSize: Typography.titleSmall.fontSize,
    fontFamily: Typography.titleSmall.fontFamily,
    fontWeight: Typography.titleSmall.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.MD,
  },
  skillItem: {
    marginBottom: Spacing.MD,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  skillName: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurface,
  },
  skillProgress: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
  },
  skillProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillProgressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 3,
    marginRight: Spacing.SM,
  },
  skillProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  skillStatus: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'right',
  },

  // Achievements Tab Styles
  achievementsStats: {
    backgroundColor: LightTheme.PrimaryContainer,
    borderRadius: BorderRadius.MD,
    padding: Spacing.MD,
    marginBottom: Spacing.LG,
    alignItems: 'center',
  },
  achievementsStatsText: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnPrimaryContainer,
  },
  achievementCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.MD,
    marginBottom: Spacing.SM,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: Spacing.MD,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
    marginBottom: Spacing.XS,
  },
  achievementDescription: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.XS,
    lineHeight: Typography.bodyMedium.lineHeight,
  },
  achievementDate: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  achievementCategory: {
    paddingHorizontal: Spacing.SM,
    paddingVertical: Spacing.XS,
    borderRadius: BorderRadius.SM,
    alignSelf: 'flex-start',
  },
  achievementCategoryText: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Insights Tab Styles
  insightCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.MD,
    marginBottom: Spacing.SM,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  insightHeader: {
    marginBottom: Spacing.SM,
  },
  insightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightPriorityIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: Spacing.SM,
  },
  insightTitle: {
    flex: 1,
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
  },
  insightType: {
    fontSize: 16,
  },
  insightDescription: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    lineHeight: Typography.bodyMedium.lineHeight,
    marginBottom: Spacing.MD,
  },
  insightActionButton: {
    backgroundColor: LightTheme.Primary,
    borderRadius: BorderRadius.SM,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    alignSelf: 'flex-start',
  },
  insightActionButtonText: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnPrimary,
  },

  // Phase 44.2: Enhanced Analytics Dashboard Styles
  
  // Predictive Analytics Tab Styles
  predictiveCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.LG,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  predictiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.LG,
  },
  predictiveTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
  },
  confidenceBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: BorderRadius.SM,
    paddingHorizontal: Spacing.SM,
    paddingVertical: Spacing.XS,
  },
  confidenceText: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  projectionMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectionItem: {
    alignItems: 'center',
    flex: 1,
  },
  projectionLabel: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.XS,
    textAlign: 'center',
  },
  projectionValue: {
    fontSize: Typography.headlineSmall.fontSize,
    fontFamily: Typography.headlineSmall.fontFamily,
    fontWeight: Typography.headlineSmall.fontWeight,
    color: LightTheme.Primary,
  },
  projectionSeparator: {
    width: 1,
    height: 40,
    backgroundColor: LightTheme.Outline,
    marginHorizontal: Spacing.MD,
  },
  riskCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.MD,
    marginBottom: Spacing.SM,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  riskIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: Spacing.SM,
  },
  riskFactor: {
    flex: 1,
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
  },
  riskImpact: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    fontWeight: '600',
  },
  riskDescription: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.SM,
    lineHeight: Typography.bodyMedium.lineHeight,
  },
  riskMitigation: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.Primary,
    fontWeight: '600',
  },
  recommendationsCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.MD,
    marginBottom: Spacing.LG,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.SM,
  },
  recommendationBullet: {
    fontSize: Typography.bodyMedium.fontSize,
    color: LightTheme.Primary,
    marginRight: Spacing.SM,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurface,
    lineHeight: Typography.bodyMedium.lineHeight,
  },

  // Real-Time Analytics Tab Styles
  realTimeCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.LG,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  realTimeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.LG,
  },
  realTimeTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    borderRadius: BorderRadius.SM,
    paddingHorizontal: Spacing.SM,
    paddingVertical: Spacing.XS,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: Spacing.XS,
  },
  liveText: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sessionMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionMetric: {
    alignItems: 'center',
    flex: 1,
  },
  sessionMetricValue: {
    fontSize: Typography.headlineSmall.fontSize,
    fontFamily: Typography.headlineSmall.fontFamily,
    fontWeight: Typography.headlineSmall.fontWeight,
    color: LightTheme.Primary,
    marginBottom: Spacing.XS,
  },
  sessionMetricLabel: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
  },
  streakCard: {
    backgroundColor: '#FF9800',
    borderRadius: BorderRadius.MD,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    alignItems: 'center',
  },
  streakTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: '#FFFFFF',
    marginBottom: Spacing.SM,
  },
  streakValue: {
    fontSize: Typography.displaySmall.fontSize,
    fontFamily: Typography.displaySmall.fontFamily,
    fontWeight: Typography.displaySmall.fontWeight,
    color: '#FFFFFF',
    marginBottom: Spacing.SM,
  },
  streakMotivation: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  weeklyChartCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.MD,
    marginBottom: Spacing.LG,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  dayBar: {
    width: 20,
    height: 80,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 10,
    justifyContent: 'flex-end',
    marginBottom: Spacing.SM,
  },
  dayBarFill: {
    backgroundColor: LightTheme.Primary,
    borderRadius: 10,
    width: '100%',
  },
  dayLabel: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.XS,
  },
  dayValue: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
  },
  monthlyTrendCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.MD,
    marginBottom: Spacing.SM,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  monthlyTrendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  monthlyTrendMonth: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
  },
  monthlyTrendImprovement: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    fontWeight: '600',
  },
  monthlyTrendMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthlyTrendMetric: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },

  // Comparative Analytics Tab Styles
  comparativeCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.LG,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  comparativeHeader: {
    marginBottom: Spacing.LG,
  },
  comparativeTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
  },
  rankingMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankingMetric: {
    alignItems: 'center',
    flex: 1,
  },
  rankingValue: {
    fontSize: Typography.headlineMedium.fontSize,
    fontFamily: Typography.headlineMedium.fontFamily,
    fontWeight: Typography.headlineMedium.fontWeight,
    color: LightTheme.Primary,
    marginBottom: Spacing.XS,
  },
  rankingLabel: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
  },
  rankingSeparator: {
    width: 1,
    height: 40,
    backgroundColor: LightTheme.Outline,
    marginHorizontal: Spacing.MD,
  },
  gapCard: {
    backgroundColor: LightTheme.ErrorContainer,
    borderRadius: BorderRadius.MD,
    padding: Spacing.MD,
    marginBottom: Spacing.LG,
  },
  gapTitle: {
    fontSize: Typography.titleSmall.fontSize,
    fontFamily: Typography.titleSmall.fontFamily,
    fontWeight: Typography.titleSmall.fontWeight,
    color: LightTheme.OnErrorContainer,
    marginBottom: Spacing.SM,
  },
  gapValue: {
    fontSize: Typography.headlineSmall.fontSize,
    fontFamily: Typography.headlineSmall.fontFamily,
    fontWeight: Typography.headlineSmall.fontWeight,
    color: LightTheme.OnErrorContainer,
    marginBottom: Spacing.SM,
  },
  gapDescription: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnErrorContainer,
    lineHeight: Typography.bodyMedium.lineHeight,
  },
  performerCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.MD,
    marginBottom: Spacing.SM,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  performerRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LightTheme.Primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.MD,
  },
  performerRankText: {
    fontSize: Typography.labelLarge.fontSize,
    fontFamily: Typography.labelLarge.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnPrimary,
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
    marginBottom: Spacing.XS,
  },
  performerScore: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  performerBadge: {
    marginLeft: Spacing.MD,
  },
  performerBadgeText: {
    fontSize: 24,
  },
  improvementCard: {
    backgroundColor: LightTheme.TertiaryContainer,
    borderRadius: BorderRadius.MD,
    padding: Spacing.MD,
    marginBottom: Spacing.LG,
  },
  improvementTitle: {
    fontSize: Typography.titleSmall.fontSize,
    fontFamily: Typography.titleSmall.fontFamily,
    fontWeight: Typography.titleSmall.fontWeight,
    color: LightTheme.OnTertiaryContainer,
    marginBottom: Spacing.SM,
  },
  improvementText: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnTertiaryContainer,
    lineHeight: Typography.bodyMedium.lineHeight,
  },
});

export default ProgressDetailScreen;

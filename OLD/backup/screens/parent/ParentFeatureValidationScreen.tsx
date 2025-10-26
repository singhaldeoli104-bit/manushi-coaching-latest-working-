/**
 * ParentFeatureValidationScreen - Phase 51: Parent Feature Validation & Testing
 * Comprehensive parent workflow testing and performance optimization
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  RefreshControl,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { Appbar, Portal, Snackbar } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

const { width } = Dimensions.get('window');

interface ValidationTest {
  id: string;
  name: string;
  category: 'workflow' | 'performance' | 'integration' | 'usability' | 'mobile';
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning';
  duration?: number;
  errorMessage?: string;
  metrics?: TestMetrics;
}

interface TestMetrics {
  loadTime?: number;
  responseTime?: number;
  memoryUsage?: number;
  batteryImpact?: number;
  cacheHitRate?: number;
  userSatisfactionScore?: number;
  accessibilityScore?: number;
}

interface ValidationSuite {
  id: string;
  name: string;
  description: string;
  tests: ValidationTest[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  warningTests: number;
  completionPercentage: number;
}

interface PerformanceBenchmark {
  metric: string;
  current: number;
  target: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
}

const ParentFeatureValidationScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [validationSuites] = useState<ValidationSuite[]>(generateValidationSuites());
  const [performanceBenchmarks] = useState<PerformanceBenchmark[]>(generatePerformanceBenchmarks());
  const [selectedSuite, setSelectedSuite] = useState<ValidationSuite | null>(null);
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [validationStats, setValidationStats] = useState({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    warningTests: 0,
    overallScore: 0,
    performanceScore: 0,
    usabilityScore: 0,
    integrationScore: 0,
  });

  useEffect(() => {
    calculateValidationStats();
  }, [validationSuites]);

  const calculateValidationStats = () => {
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let warningTests = 0;

    validationSuites.forEach(suite => {
      totalTests += suite.totalTests;
      passedTests += suite.passedTests;
      failedTests += suite.failedTests;
      warningTests += suite.warningTests;
    });

    const overallScore = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    setValidationStats({
      totalTests,
      passedTests,
      failedTests,
      warningTests,
      overallScore,
      performanceScore: 92, // Mock scores - would be calculated from actual metrics
      usabilityScore: 88,
      integrationScore: 95,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Lifecycle functions
  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }, []);

  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (selectedSuite) {
        setSelectedSuite(null);
        return true;
      }
      return false;
    });
    return backHandler;
  }, [selectedSuite]);

  const initializeScreen = useCallback(async () => {
    try {
      setIsLoading(true);
      calculateValidationStats();
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize screen:', error);
      showSnackbar('Failed to initialize screen');
      setIsLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    const backHandler = setupBackHandler();
    return () => backHandler.remove();
  }, [setupBackHandler]);

  useEffect(() => {
    initializeScreen();
  }, [initializeScreen]);

  const runValidationSuite = async (suiteId: string) => {
    const suite = validationSuites.find(s => s.id === suiteId);
    if (!suite) return;

    setSelectedSuite(suite);
    showSnackbar(`Starting ${suite.tests.length} tests for ${suite.name}`);
    startTestExecution(suite);
  };

  const startTestExecution = async (suite: ValidationSuite) => {
    const testIds = suite.tests.map(t => t.id);
    setRunningTests(new Set(testIds));

    // Simulate test execution
    for (const test of suite.tests) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRunningTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(test.id);
        return newSet;
      });
    }

    showSnackbar(`${suite.name} validation completed with ${suite.passedTests} passed, ${suite.failedTests} failed tests`);
  };

  const runSingleTest = async (testId: string) => {
    setRunningTests(new Set([testId]));
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRunningTests(new Set());

    showSnackbar('Test execution completed successfully');
  };

  const exportValidationReport = () => {
    showSnackbar('Exporting validation report...');
  };

  const renderValidationOverview = () => (
    <View style={[styles.overviewCard, { backgroundColor: theme.Surface }]}>
      <Text style={[styles.cardTitle, { color: theme.OnSurface }]}>
        Validation Overview
      </Text>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {validationStats.totalTests}
          </Text>
          <Text style={[styles.statLabel, { color: theme.OnSurfaceVariant }]}>
            Total Tests
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#4CAF50' }]}>
            {validationStats.passedTests}
          </Text>
          <Text style={[styles.statLabel, { color: theme.OnSurfaceVariant }]}>
            Passed
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#F44336' }]}>
            {validationStats.failedTests}
          </Text>
          <Text style={[styles.statLabel, { color: theme.OnSurfaceVariant }]}>
            Failed
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#FF9800' }]}>
            {validationStats.warningTests}
          </Text>
          <Text style={[styles.statLabel, { color: theme.OnSurfaceVariant }]}>
            Warnings
          </Text>
        </View>
      </View>

      <View style={styles.scoreGrid}>
        <View style={styles.scoreItem}>
          <Text style={[styles.scoreValue, { color: theme.primary }]}>
            {validationStats.overallScore}%
          </Text>
          <Text style={[styles.scoreLabel, { color: theme.OnSurfaceVariant }]}>
            Overall Score
          </Text>
        </View>
        
        <View style={styles.scoreItem}>
          <Text style={[styles.scoreValue, { color: theme.primary }]}>
            {validationStats.performanceScore}%
          </Text>
          <Text style={[styles.scoreLabel, { color: theme.OnSurfaceVariant }]}>
            Performance
          </Text>
        </View>
        
        <View style={styles.scoreItem}>
          <Text style={[styles.scoreValue, { color: theme.primary }]}>
            {validationStats.usabilityScore}%
          </Text>
          <Text style={[styles.scoreLabel, { color: theme.OnSurfaceVariant }]}>
            Usability
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.exportButton, { backgroundColor: theme.primary }]}
        onPress={exportValidationReport}
      >
        <Text style={[styles.exportButtonText, { color: theme.OnPrimary }]}>
          📊 Export Full Report
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderValidationSuites = () => (
    <View style={[styles.suitesCard, { backgroundColor: theme.Surface }]}>
      <Text style={[styles.cardTitle, { color: theme.OnSurface }]}>
        Validation Test Suites
      </Text>

      {validationSuites.map(suite => (
        <View key={suite.id} style={styles.suiteCard}>
          <View style={styles.suiteHeader}>
            <View style={styles.suiteInfo}>
              <Text style={[styles.suiteName, { color: theme.OnSurface }]}>
                {suite.name}
              </Text>
              <Text style={[styles.suiteDescription, { color: theme.OnSurfaceVariant }]}>
                {suite.description}
              </Text>
            </View>
            
            <View style={styles.suiteStats}>
              <Text style={[styles.suiteCompletion, { color: theme.primary }]}>
                {Math.round(suite.completionPercentage)}%
              </Text>
            </View>
          </View>

          <View style={styles.suiteProgress}>
            <View style={[styles.progressBar, { backgroundColor: theme.Outline }]}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    backgroundColor: theme.primary,
                    width: `${suite.completionPercentage}%`
                  }
                ]}
              />
            </View>
          </View>

          <View style={styles.suiteMetrics}>
            <Text style={[styles.metricText, { color: '#4CAF50' }]}>
              ✓ {suite.passedTests} passed
            </Text>
            {suite.failedTests > 0 && (
              <Text style={[styles.metricText, { color: '#F44336' }]}>
                ✗ {suite.failedTests} failed
              </Text>
            )}
            {suite.warningTests > 0 && (
              <Text style={[styles.metricText, { color: '#FF9800' }]}>
                ⚠ {suite.warningTests} warnings
              </Text>
            )}
          </View>

          <View style={styles.suiteActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.primary }]}
              onPress={() => runValidationSuite(suite.id)}
            >
              <Text style={[styles.actionButtonText, { color: theme.OnPrimary }]}>
                🧪 Run Suite
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton, { borderColor: theme.primary }]}
              onPress={() => setSelectedSuite(suite)}
            >
              <Text style={[styles.actionButtonText, { color: theme.primary }]}>
                📋 View Details
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderPerformanceBenchmarks = () => (
    <View style={[styles.benchmarkCard, { backgroundColor: theme.Surface }]}>
      <Text style={[styles.cardTitle, { color: theme.OnSurface }]}>
        Performance Benchmarks
      </Text>

      {performanceBenchmarks.map((benchmark, index) => (
        <View key={index} style={styles.benchmarkItem}>
          <View style={styles.benchmarkInfo}>
            <Text style={[styles.benchmarkMetric, { color: theme.OnSurface }]}>
              {benchmark.metric}
            </Text>
            <View style={styles.benchmarkValues}>
              <Text style={[styles.currentValue, { color: theme.primary }]}>
                Current: {benchmark.current}{benchmark.unit}
              </Text>
              <Text style={[styles.targetValue, { color: theme.OnSurfaceVariant }]}>
                Target: {benchmark.target}{benchmark.unit}
              </Text>
            </View>
          </View>
          
          <View style={styles.benchmarkStatus}>
            <View style={[
              styles.statusIndicator,
              {
                backgroundColor: benchmark.status === 'good' ? '#4CAF50' :
                                benchmark.status === 'warning' ? '#FF9800' : '#F44336'
              }
            ]}>
              <Text style={styles.statusText}>
                {benchmark.status === 'good' ? '✓' : 
                 benchmark.status === 'warning' ? '⚠' : '✗'}
              </Text>
            </View>
            
            <Text style={[
              styles.trendText,
              {
                color: benchmark.trend === 'improving' ? '#4CAF50' :
                       benchmark.trend === 'declining' ? '#F44336' : '#FF9800'
              }
            ]}>
              {benchmark.trend === 'improving' ? '↗️' :
               benchmark.trend === 'declining' ? '↘️' : '→'}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderTestDetails = () => {
    if (!selectedSuite) return null;

    return (
      <View style={[styles.detailsCard, { backgroundColor: theme.Surface }]}>
        <View style={styles.detailsHeader}>
          <Text style={[styles.cardTitle, { color: theme.OnSurface }]}>
            {selectedSuite.name} - Test Details
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedSuite(null)}
          >
            <Text style={[styles.closeButtonText, { color: theme.primary }]}>×</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {selectedSuite.tests.map(test => (
            <View key={test.id} style={[styles.testItem, { backgroundColor: theme.background }]}>
              <View style={styles.testHeader}>
                <Text style={[styles.testName, { color: theme.OnSurface }]}>
                  {test.name}
                </Text>
                <View style={[
                  styles.testStatus,
                  {
                    backgroundColor: test.status === 'passed' ? '#4CAF50' :
                                    test.status === 'failed' ? '#F44336' :
                                    test.status === 'warning' ? '#FF9800' :
                                    test.status === 'running' ? '#2196F3' : '#9E9E9E'
                  }
                ]}>
                  <Text style={styles.testStatusText}>
                    {test.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.testDescription, { color: theme.OnSurfaceVariant }]}>
                {test.description}
              </Text>
              
              {test.metrics && (
                <View style={styles.testMetrics}>
                  {test.metrics.loadTime && (
                    <Text style={[styles.metricItem, { color: theme.OnSurfaceVariant }]}>
                      Load Time: {test.metrics.loadTime}ms
                    </Text>
                  )}
                  {test.metrics.userSatisfactionScore && (
                    <Text style={[styles.metricItem, { color: theme.OnSurfaceVariant }]}>
                      User Satisfaction: {test.metrics.userSatisfactionScore}%
                    </Text>
                  )}
                </View>
              )}
              
              {test.errorMessage && (
                <Text style={[styles.errorMessage, { color: '#F44336' }]}>
                  Error: {test.errorMessage}
                </Text>
              )}

              <TouchableOpacity
                style={[styles.runTestButton, { backgroundColor: theme.primary }]}
                onPress={() => runSingleTest(test.id)}
                disabled={runningTests.has(test.id)}
              >
                <Text style={[styles.runTestButtonText, { color: theme.OnPrimary }]}>
                  {runningTests.has(test.id) ? 'Running...' : 'Run Test'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar backgroundColor={theme.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.OnBackground }]}>
          Parent Feature Validation
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.OnSurfaceVariant }]}>
          Comprehensive testing and performance optimization
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {renderValidationOverview()}
        {renderValidationSuites()}
        {renderPerformanceBenchmarks()}
        {selectedSuite && renderTestDetails()}
      </ScrollView>
    </SafeAreaView>
  );
};

// Mock data generators
function generateValidationSuites(): ValidationSuite[] {
  return [
    {
      id: '1',
      name: 'Parent Dashboard Workflow',
      description: 'End-to-end testing of parent dashboard functionality',
      tests: [
        {
          id: 'pd_01',
          name: 'Multi-Child Progress Loading',
          category: 'workflow',
          description: 'Test loading and display of multiple children progress data',
          status: 'passed',
          duration: 1.2,
          metrics: { loadTime: 1200, userSatisfactionScore: 92 }
        },
        {
          id: 'pd_02',
          name: 'Financial Summary Integration',
          category: 'integration',
          description: 'Test integration with payment and billing systems',
          status: 'passed',
          duration: 0.8,
          metrics: { responseTime: 800, cacheHitRate: 95 }
        },
        {
          id: 'pd_03',
          name: 'Real-time Communication',
          category: 'performance',
          description: 'Test real-time message delivery and notifications',
          status: 'warning',
          duration: 2.1,
          errorMessage: 'Slight delay in message delivery during peak hours',
          metrics: { responseTime: 2100, userSatisfactionScore: 78 }
        }
      ],
      totalTests: 3,
      passedTests: 2,
      failedTests: 0,
      warningTests: 1,
      completionPercentage: 88
    },
    {
      id: '2',
      name: 'Community Engagement',
      description: 'Testing community features and social interactions',
      tests: [
        {
          id: 'ce_01',
          name: 'Event Creation & Management',
          category: 'workflow',
          description: 'Test complete event lifecycle from creation to completion',
          status: 'passed',
          duration: 1.5,
          metrics: { loadTime: 1500, userSatisfactionScore: 89 }
        },
        {
          id: 'ce_02',
          name: 'Discussion Forum Moderation',
          category: 'usability',
          description: 'Test moderation tools and content filtering',
          status: 'failed',
          duration: 3.2,
          errorMessage: 'Automated moderation not responding to reports',
          metrics: { responseTime: 3200, userSatisfactionScore: 65 }
        }
      ],
      totalTests: 2,
      passedTests: 1,
      failedTests: 1,
      warningTests: 0,
      completionPercentage: 75
    },
    {
      id: '3',
      name: 'Mobile Responsiveness',
      description: 'Testing mobile optimization and responsive design',
      tests: [
        {
          id: 'mr_01',
          name: 'Touch Interface Optimization',
          category: 'mobile',
          description: 'Test touch targets and gesture recognition',
          status: 'passed',
          duration: 0.9,
          metrics: { accessibilityScore: 94, userSatisfactionScore: 91 }
        },
        {
          id: 'mr_02',
          name: 'Offline Functionality',
          category: 'performance',
          description: 'Test critical features availability offline',
          status: 'passed',
          duration: 1.1,
          metrics: { cacheHitRate: 89, batteryImpact: 12 }
        }
      ],
      totalTests: 2,
      passedTests: 2,
      failedTests: 0,
      warningTests: 0,
      completionPercentage: 100
    }
  ];
}

function generatePerformanceBenchmarks(): PerformanceBenchmark[] {
  return [
    {
      metric: 'Dashboard Load Time',
      current: 2.1,
      target: 3.0,
      unit: 's',
      status: 'good',
      trend: 'improving'
    },
    {
      metric: 'API Response Time',
      current: 450,
      target: 500,
      unit: 'ms',
      status: 'good',
      trend: 'stable'
    },
    {
      metric: 'Memory Usage',
      current: 128,
      target: 150,
      unit: 'MB',
      status: 'good',
      trend: 'stable'
    },
    {
      metric: 'Battery Impact',
      current: 18,
      target: 15,
      unit: '%/hr',
      status: 'warning',
      trend: 'declining'
    },
    {
      metric: 'Crash Rate',
      current: 0.08,
      target: 0.1,
      unit: '%',
      status: 'good',
      trend: 'improving'
    },
    {
      metric: 'User Satisfaction',
      current: 87,
      target: 85,
      unit: '%',
      status: 'good',
      trend: 'improving'
    }
  ];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.LG,
    paddingBottom: Spacing.MD,
  },
  headerTitle: {
    fontSize: Typography.headlineMedium.fontSize,
    fontWeight: Typography.headlineMedium.fontWeight as any,
    marginBottom: Spacing.XS,
  },
  headerSubtitle: {
    fontSize: Typography.bodyLarge.fontSize,
  },
  content: {
    flex: 1,
    padding: Spacing.MD,
  },
  overviewCard: {
    borderRadius: 12,
    padding: Spacing.LG,
    marginBottom: Spacing.MD,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: Typography.titleLarge.fontSize,
    fontWeight: Typography.titleLarge.fontWeight as any,
    marginBottom: Spacing.MD,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.LG,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: Typography.headlineSmall.fontSize,
    fontWeight: 'bold',
    marginBottom: Spacing.XS,
  },
  statLabel: {
    fontSize: Typography.bodyMedium.fontSize,
    textAlign: 'center',
  },
  scoreGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.LG,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: Typography.titleLarge.fontSize,
    fontWeight: 'bold',
    marginBottom: Spacing.XS,
  },
  scoreLabel: {
    fontSize: Typography.bodySmall.fontSize,
  },
  exportButton: {
    paddingVertical: Spacing.MD,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButtonText: {
    fontSize: Typography.titleMedium.fontSize,
    fontWeight: '600',
  },
  suitesCard: {
    borderRadius: 12,
    padding: Spacing.LG,
    marginBottom: Spacing.MD,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suiteCard: {
    marginBottom: Spacing.LG,
    paddingBottom: Spacing.MD,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  suiteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.SM,
  },
  suiteInfo: {
    flex: 1,
    marginRight: Spacing.MD,
  },
  suiteName: {
    fontSize: Typography.titleMedium.fontSize,
    fontWeight: Typography.titleMedium.fontWeight as any,
    marginBottom: Spacing.XS,
  },
  suiteDescription: {
    fontSize: Typography.bodyMedium.fontSize,
    lineHeight: 20,
  },
  suiteStats: {
    alignItems: 'center',
  },
  suiteCompletion: {
    fontSize: Typography.titleLarge.fontSize,
    fontWeight: 'bold',
  },
  suiteProgress: {
    marginVertical: Spacing.SM,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  suiteMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.MD,
  },
  metricText: {
    fontSize: Typography.bodySmall.fontSize,
    marginRight: Spacing.MD,
    marginBottom: Spacing.XS,
  },
  suiteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.SM,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: Spacing.XS,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: Typography.bodyMedium.fontSize,
    fontWeight: '600',
  },
  benchmarkCard: {
    borderRadius: 12,
    padding: Spacing.LG,
    marginBottom: Spacing.MD,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  benchmarkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  benchmarkInfo: {
    flex: 1,
  },
  benchmarkMetric: {
    fontSize: Typography.bodyLarge.fontSize,
    fontWeight: '500',
    marginBottom: Spacing.XS,
  },
  benchmarkValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currentValue: {
    fontSize: Typography.bodyMedium.fontSize,
    fontWeight: '600',
  },
  targetValue: {
    fontSize: Typography.bodyMedium.fontSize,
  },
  benchmarkStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.SM,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  trendText: {
    fontSize: 18,
  },
  detailsCard: {
    borderRadius: 12,
    padding: Spacing.LG,
    marginBottom: Spacing.MD,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.MD,
  },
  closeButton: {
    padding: Spacing.SM,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '300',
  },
  testItem: {
    borderRadius: 8,
    padding: Spacing.MD,
    marginBottom: Spacing.SM,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  testName: {
    fontSize: Typography.titleMedium.fontSize,
    fontWeight: Typography.titleMedium.fontWeight as any,
    flex: 1,
  },
  testStatus: {
    paddingHorizontal: Spacing.SM,
    paddingVertical: 2,
    borderRadius: 4,
  },
  testStatusText: {
    color: 'white',
    fontSize: Typography.labelSmall.fontSize,
    fontWeight: 'bold',
  },
  testDescription: {
    fontSize: Typography.bodyMedium.fontSize,
    marginBottom: Spacing.SM,
    lineHeight: 18,
  },
  testMetrics: {
    marginBottom: Spacing.SM,
  },
  metricItem: {
    fontSize: Typography.bodySmall.fontSize,
    marginBottom: 2,
  },
  errorMessage: {
    fontSize: Typography.bodySmall.fontSize,
    marginBottom: Spacing.SM,
    fontStyle: 'italic',
  },
  runTestButton: {
    paddingVertical: Spacing.SM,
    paddingHorizontal: Spacing.MD,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  runTestButtonText: {
    fontSize: Typography.bodyMedium.fontSize,
    fontWeight: '600',
  },
});

export default ParentFeatureValidationScreen;
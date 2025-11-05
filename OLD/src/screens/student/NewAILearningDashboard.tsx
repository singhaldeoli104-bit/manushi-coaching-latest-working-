/**
 * NewAILearningDashboard - Premium Minimal Design
 * Purpose: AI-powered learning analytics and recommendations
 * Used in: StudentNavigator (HomeStack)
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackScreenView } from '../../utils/navigationAnalytics';

type Props = NativeStackScreenProps<any, 'NewAILearningDashboard'>;

export default function NewAILearningDashboard({ navigation }: Props) {
  React.useEffect(() => {
    trackScreenView('NewAILearningDashboard');
  }, []);

  const insights = [
    { icon: '📈', title: 'Strong Progress', detail: 'You\'re performing well in Mathematics' },
    { icon: '⚠️', title: 'Needs Attention', detail: 'Chemistry concepts need review' },
    { icon: '🎯', title: 'On Track', detail: 'Assignment completion rate: 95%' },
  ];

  const recommendations = [
    'Review Chapter 5: Chemical Reactions',
    'Practice more Calculus problems',
    'Complete pending Physics assignment',
  ];

  return (
    <BaseScreen scrollable={false}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Card style={styles.headerCard}>
          <T variant="h1" weight="bold">
            AI Learning Insights
          </T>
          <T variant="body" style={styles.subtitle}>
            Personalized recommendations for your learning journey
          </T>
        </Card>

        <Card style={styles.insightsCard}>
          <T variant="title" weight="semiBold" style={styles.sectionTitle}>
            Performance Insights
          </T>
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightItem}>
              <T variant="h2">{insight.icon}</T>
              <View style={styles.insightText}>
                <T variant="body" weight="semiBold">
                  {insight.title}
                </T>
                <T variant="caption" style={styles.insightDetail}>
                  {insight.detail}
                </T>
              </View>
            </View>
          ))}
        </Card>

        <Card style={styles.recommendationsCard}>
          <T variant="title" weight="semiBold" style={styles.sectionTitle}>
            Recommended Actions
          </T>
          {recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <T variant="body">• {rec}</T>
            </View>
          ))}
        </Card>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    padding: 20,
    marginBottom: 16,
    gap: 8,
  },
  subtitle: {
    color: '#6B7280',
  },
  insightsCard: {
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  insightItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  insightText: {
    flex: 1,
    gap: 4,
  },
  insightDetail: {
    color: '#6B7280',
  },
  recommendationsCard: {
    padding: 16,
    marginBottom: 32,
    gap: 12,
  },
  recommendationItem: {
    paddingVertical: 8,
  },
});

/**
 * NewAILearningDashboard - Premium Minimal Design
 * Purpose: AI-powered learning analytics and recommendations
 * Used in: StudentNavigator (HomeStack)
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

type Props = NativeStackScreenProps<any, 'NewAILearningDashboard'>;

interface Insight {
  id: string;
  icon: string;
  title: string;
  detail: string;
  type: 'progress' | 'warning' | 'achievement';
}

interface Recommendation {
  id: string;
  text: string;
  priority: number;
}

export default function NewAILearningDashboard({ navigation }: Props) {
  const { user } = useAuth();

  React.useEffect(() => {
    trackScreenView('NewAILearningDashboard');
  }, []);

  // Fetch AI insights from Supabase
  const { data: insightsData, isLoading: insightsLoading } = useQuery({
    queryKey: ['ai-insights', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('student_id', user.id)
        .eq('insight_type', 'performance')
        .order('priority', { ascending: false })
        .limit(3);

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        icon: item.icon || '📊',
        title: item.title,
        detail: item.message,
        type: item.category as 'progress' | 'warning' | 'achievement',
      })) as Insight[];
    },
    enabled: !!user?.id,
  });

  // Fetch AI recommendations from Supabase
  const { data: recommendationsData, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['ai-recommendations', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('student_id', user.id)
        .eq('insight_type', 'recommendation')
        .order('priority', { ascending: false })
        .limit(5);

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        text: item.message,
        priority: item.priority,
      })) as Recommendation[];
    },
    enabled: !!user?.id,
  });

  const insights = insightsData || [];
  const recommendations = recommendationsData || [];

  const isLoading = insightsLoading || recommendationsLoading;

  return (
    <BaseScreen scrollable={false} loading={isLoading}>
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
          {insights.length > 0 ? (
            insights.map((insight) => (
              <View key={insight.id} style={styles.insightItem}>
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
            ))
          ) : (
            <T variant="body" style={styles.emptyText}>
              No insights available yet
            </T>
          )}
        </Card>

        <Card style={styles.recommendationsCard}>
          <T variant="title" weight="semiBold" style={styles.sectionTitle}>
            Recommended Actions
          </T>
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <View key={rec.id} style={styles.recommendationItem}>
                <T variant="body">• {rec.text}</T>
              </View>
            ))
          ) : (
            <T variant="body" style={styles.emptyText}>
              No recommendations available yet
            </T>
          )}
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
  emptyText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
});

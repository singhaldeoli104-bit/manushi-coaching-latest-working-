/**
 * NewAILearningDashboard - Premium Minimal Design
 * Purpose: AI-powered learning analytics and recommendations
 * Used in: StudentNavigator (HomeStack)
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { Badge } from '../../ui/data-display/Badge';
import { Button } from '../../ui/inputs/Button';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
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
  priority: 'high' | 'medium' | 'low';
  category: string;
  actionType: 'study' | 'review' | 'practice' | 'complete';
  estimatedTime: string;
  icon: string;
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

      return (data || []).map(item => {
        // Derive priority from priority number
        const priorityLevel = item.priority >= 80 ? 'high' : item.priority >= 50 ? 'medium' : 'low';

        // Derive category and action type from message content
        const message = item.message?.toLowerCase() || '';
        let category = item.category || 'General';
        let actionType: 'study' | 'review' | 'practice' | 'complete' = 'study';
        let estimatedTime = '15 min';
        let icon = '📚';

        if (message.includes('review') || message.includes('revise')) {
          actionType = 'review';
          icon = '🔄';
          estimatedTime = '20 min';
        } else if (message.includes('practice') || message.includes('exercise')) {
          actionType = 'practice';
          icon = '💪';
          estimatedTime = '30 min';
        } else if (message.includes('complete') || message.includes('finish')) {
          actionType = 'complete';
          icon = '✅';
          estimatedTime = '25 min';
        }

        return {
          id: item.id,
          text: item.message,
          priority: priorityLevel,
          category,
          actionType,
          estimatedTime,
          icon,
        };
      }) as Recommendation[];
    },
    enabled: !!user?.id,
  });

  const insights = insightsData || [];
  const recommendations = recommendationsData || [];

  const isLoading = insightsLoading || recommendationsLoading;

  // Handler for recommendation actions
  const handleRecommendationAction = (rec: Recommendation) => {
    trackAction('start_recommendation', 'NewAILearningDashboard', {
      recommendationId: rec.id,
      actionType: rec.actionType,
      priority: rec.priority,
    });

    switch (rec.actionType) {
      case 'study':
        Alert.alert('Start Studying', `Starting study session: ${rec.text}`);
        break;
      case 'review':
        Alert.alert('Start Review', `Starting review: ${rec.text}`);
        break;
      case 'practice':
        Alert.alert('Start Practice', `Starting practice: ${rec.text}`);
        break;
      case 'complete':
        Alert.alert('Complete Task', `Completing: ${rec.text}`);
        break;
    }
  };

  const getPriorityBadgeVariant = (priority: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'neutral';
    }
  };

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

        {/* 1. Personalized Recommendations Widget */}
        <Card style={styles.recommendationsCard}>
          <T variant="title" weight="semiBold" style={styles.sectionTitle}>
            📌 Personalized Recommendations
          </T>
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <View key={rec.id} style={styles.recommendationWidget}>
                <View style={styles.recommendationHeader}>
                  <View style={styles.recommendationIconContainer}>
                    <T variant="h3">{rec.icon}</T>
                  </View>
                  <View style={styles.recommendationContent}>
                    <View style={styles.recommendationMeta}>
                      <Badge
                        variant={getPriorityBadgeVariant(rec.priority)}
                        label={rec.priority.toUpperCase()}
                      />
                      <T variant="caption" style={styles.estimatedTime}>
                        ⏱ {rec.estimatedTime}
                      </T>
                    </View>
                    <T variant="body" weight="semiBold" style={styles.recommendationText}>
                      {rec.text}
                    </T>
                    <T variant="caption" style={styles.recommendationCategory}>
                      {rec.category}
                    </T>
                  </View>
                </View>
                <Button
                  variant="primary"
                  onPress={() => handleRecommendationAction(rec)}
                  style={styles.recommendationButton}
                >
                  {rec.actionType === 'study' && 'Start Study'}
                  {rec.actionType === 'review' && 'Review Now'}
                  {rec.actionType === 'practice' && 'Practice'}
                  {rec.actionType === 'complete' && 'Complete'}
                </Button>
              </View>
            ))
          ) : (
            <T variant="body" style={styles.emptyText}>
              No recommendations available yet. Complete some assignments to get personalized suggestions!
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
    gap: 16,
  },
  recommendationWidget: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recommendationHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  recommendationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recommendationContent: {
    flex: 1,
    gap: 6,
  },
  recommendationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  estimatedTime: {
    color: '#6B7280',
  },
  recommendationText: {
    color: '#111827',
    lineHeight: 20,
  },
  recommendationCategory: {
    color: '#9CA3AF',
  },
  recommendationButton: {
    width: '100%',
  },
  emptyText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
});

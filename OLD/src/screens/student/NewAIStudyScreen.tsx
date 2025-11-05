/**
 * NewAIStudyScreen - Premium Minimal Design
 * Purpose: AI-powered study assistant main screen
 * Used in: StudentNavigator (AssignmentsStack)
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { safeNavigate } from '../../utils/navigationService';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';

type Props = NativeStackScreenProps<any, 'NewAIStudyScreen'>;

interface StudyFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

export default function NewAIStudyScreen({ navigation }: Props) {
  // Track screen view
  React.useEffect(() => {
    trackScreenView('NewAIStudyScreen');
  }, []);

  const features: StudyFeature[] = [
    {
      id: 'tutor',
      title: 'AI Tutor Chat',
      description: 'Get instant help with your questions',
      icon: '🤖',
      route: 'AITutorChat',
      color: '#3B82F6',
    },
    {
      id: 'practice',
      title: 'Practice Problems',
      description: 'AI-generated practice questions',
      icon: '📝',
      route: 'AIPracticeProblems',
      color: '#10B981',
    },
    {
      id: 'summary',
      title: 'Study Summaries',
      description: 'AI-generated topic summaries',
      icon: '📚',
      route: 'AIStudySummaries',
      color: '#F59E0B',
    },
    {
      id: 'quiz',
      title: 'AI Quiz',
      description: 'Test your knowledge',
      icon: '🎯',
      route: 'StudyLibrary',
      color: '#8B5CF6',
    },
  ];

  // Handle feature press
  const handleFeaturePress = useCallback((feature: StudyFeature) => {
    trackAction('select_ai_feature', 'NewAIStudyScreen', { feature: feature.id });
    safeNavigate(feature.route);
  }, []);

  return (
    <BaseScreen scrollable={false}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <T variant="h1" weight="bold">
            AI Study Assistant
          </T>
          <T variant="body" style={styles.headerDescription}>
            Enhance your learning with AI-powered tools
          </T>
        </Card>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={[styles.featureCard, { borderLeftColor: feature.color }]}
              onPress={() => handleFeaturePress(feature)}
              accessibilityRole="button"
              accessibilityLabel={feature.title}
              accessibilityHint={feature.description}
            >
              <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                <T variant="h1">{feature.icon}</T>
              </View>
              <View style={styles.featureInfo}>
                <T variant="title" weight="semiBold">
                  {feature.title}
                </T>
                <T variant="caption" style={styles.featureDescription}>
                  {feature.description}
                </T>
              </View>
              <T variant="body" style={styles.featureArrow}>
                →
              </T>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips Section */}
        <Card style={styles.tipsCard}>
          <T variant="title" weight="semiBold" style={styles.tipsTitle}>
            💡 Study Tips
          </T>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <T variant="body">• Ask specific questions for better AI responses</T>
            </View>
            <View style={styles.tipItem}>
              <T variant="body">• Use practice problems to reinforce learning</T>
            </View>
            <View style={styles.tipItem}>
              <T variant="body">• Review summaries before exams</T>
            </View>
            <View style={styles.tipItem}>
              <T variant="body">• Take quizzes to track your progress</T>
            </View>
          </View>
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
  headerDescription: {
    color: '#6B7280',
  },
  featuresGrid: {
    gap: 12,
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  featureInfo: {
    flex: 1,
    gap: 4,
  },
  featureDescription: {
    color: '#6B7280',
  },
  featureArrow: {
    color: '#9CA3AF',
    fontSize: 20,
  },
  tipsCard: {
    padding: 16,
    marginBottom: 32,
  },
  tipsTitle: {
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    paddingVertical: 4,
  },
});

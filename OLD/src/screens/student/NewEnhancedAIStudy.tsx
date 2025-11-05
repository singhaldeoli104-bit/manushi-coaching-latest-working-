/**
 * NewEnhancedAIStudy - Premium Minimal Design
 * Purpose: Enhanced AI study features
 * Used in: StudentNavigator (AssignmentsStack)
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';

type Props = NativeStackScreenProps<any, 'NewEnhancedAIStudy'>;

export default function NewEnhancedAIStudy({ navigation }: Props) {
  React.useEffect(() => {
    trackScreenView('NewEnhancedAIStudy');
  }, []);

  const tools = [
    { id: 'smart-notes', icon: '📖', title: 'Smart Notes', description: 'AI-generated study notes', route: 'StudyLibrary' },
    { id: 'practice-tests', icon: '🧪', title: 'Practice Tests', description: 'Adaptive practice quizzes', route: 'AIPracticeProblems' },
    { id: 'concept-maps', icon: '💡', title: 'Concept Maps', description: 'Visual learning aids', route: 'StudyLibrary' },
  ];

  return (
    <BaseScreen scrollable={false}>
      <ScrollView style={styles.container}>
        <Card style={styles.headerCard}>
          <T variant="h1" weight="bold">
            Enhanced AI Study
          </T>
          <T variant="body" style={styles.subtitle}>
            Advanced learning tools powered by AI
          </T>
        </Card>

        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            onPress={() => {
              trackAction('select_ai_tool', 'NewEnhancedAIStudy', { tool: tool.id });
              safeNavigate(tool.route);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Open ${tool.title}`}
          >
            <Card style={styles.toolCard}>
              <T variant="h1">{tool.icon}</T>
              <View style={styles.toolInfo}>
                <T variant="body" weight="semiBold">
                  {tool.title}
                </T>
                <T variant="caption" style={styles.toolDescription}>
                  {tool.description}
                </T>
              </View>
              <T variant="body" style={styles.arrow}>
                →
              </T>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
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
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    marginBottom: 12,
  },
  toolInfo: {
    flex: 1,
    gap: 4,
  },
  toolDescription: {
    color: '#6B7280',
  },
  arrow: {
    color: '#9CA3AF',
    fontSize: 20,
  },
});

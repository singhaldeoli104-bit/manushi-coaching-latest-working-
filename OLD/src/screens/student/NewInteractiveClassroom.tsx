/**
 * NewInteractiveClassroom - Premium Minimal Design
 * Purpose: Interactive classroom with polls and quizzes
 * Used in: StudentNavigator (ClassesStack)
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackScreenView } from '../../utils/navigationAnalytics';

type Props = NativeStackScreenProps<any, 'NewInteractiveClassroom'>;

export default function NewInteractiveClassroom({ navigation }: Props) {
  React.useEffect(() => {
    trackScreenView('NewInteractiveClassroom');
  }, []);

  const pollOptions = ['Option A', 'Option B', 'Option C', 'Option D'];

  return (
    <BaseScreen scrollable={true}>
      <View style={styles.container}>
        <Card style={styles.pollCard}>
          <T variant="title" weight="semiBold">
            Live Poll
          </T>
          <T variant="body" style={styles.question}>
            What is the capital of France?
          </T>
          {pollOptions.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionButton}>
              <T variant="body">{option}</T>
            </TouchableOpacity>
          ))}
        </Card>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  pollCard: {
    padding: 20,
    gap: 16,
  },
  question: {
    color: '#4B5563',
  },
  optionButton: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
});

/**
 * NewInteractiveClassroom - Premium Minimal Design
 * Purpose: Interactive classroom with polls and quizzes
 * Used in: StudentNavigator (ClassesStack)
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

type Props = NativeStackScreenProps<any, 'NewInteractiveClassroom'>;

interface Poll {
  id: string;
  question: string;
  options: string[];
  class_id: string;
  created_at: string;
}

export default function NewInteractiveClassroom({ route, navigation }: Props) {
  const { user } = useAuth();
  const pollId = route.params?.pollId;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  React.useEffect(() => {
    trackScreenView('NewInteractiveClassroom', { pollId });
  }, [pollId]);

  // Fetch poll details
  const { data: poll, isLoading, error, refetch } = useQuery({
    queryKey: ['poll-detail', pollId],
    queryFn: async () => {
      if (!pollId) throw new Error('No poll ID provided');

      const { data, error } = await supabase
        .from('class_polls')
        .select('*')
        .eq('id', pollId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        question: data.question,
        options: data.options || [],
        class_id: data.class_id,
        created_at: data.created_at,
      } as Poll;
    },
    enabled: !!pollId,
  });

  // Submit poll response
  const submitResponse = useMutation({
    mutationFn: async (optionIndex: number) => {
      if (!pollId || !user?.id) throw new Error('Missing required data');

      const { error } = await supabase.from('poll_responses').insert({
        poll_id: pollId,
        student_id: user.id,
        option_index: optionIndex,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      Alert.alert('Success', 'Your response has been recorded!');
      refetch();
    },
    onError: () => {
      Alert.alert('Error', 'Failed to submit response. Please try again.');
    },
  });

  const handleOptionPress = (index: number) => {
    setSelectedOption(index);
    trackAction('select_poll_option', 'NewInteractiveClassroom', { pollId, optionIndex: index });
    submitResponse.mutate(index);
  };

  return (
    <BaseScreen
      scrollable={true}
      loading={isLoading}
      error={error ? 'Failed to load poll' : null}
      empty={!poll}
      emptyMessage="Poll not found"
    >
      {poll && (
        <View style={styles.container}>
          <Card style={styles.pollCard}>
            <T variant="title" weight="semiBold">
              Live Poll
            </T>
            <T variant="body" style={styles.question}>
              {poll.question}
            </T>
            {poll.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOption === index && styles.optionButtonSelected,
                ]}
                onPress={() => handleOptionPress(index)}
                disabled={submitResponse.isPending || selectedOption !== null}
                accessibilityRole="button"
                accessibilityLabel={`Option ${String.fromCharCode(65 + index)}: ${option}`}
              >
                <T
                  variant="body"
                  weight={selectedOption === index ? 'semiBold' : 'regular'}
                  style={selectedOption === index && styles.optionTextSelected}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </T>
              </TouchableOpacity>
            ))}
            {submitResponse.isPending && (
              <T variant="caption" style={styles.submittingText}>
                Submitting your response...
              </T>
            )}
          </Card>
        </View>
      )}
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
    fontSize: 18,
  },
  optionButton: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionButtonSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  optionTextSelected: {
    color: '#1E40AF',
  },
  submittingText: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

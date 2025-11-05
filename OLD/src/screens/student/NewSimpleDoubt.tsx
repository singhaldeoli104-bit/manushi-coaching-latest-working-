/**
 * NewSimpleDoubt - Premium Minimal Design
 * Purpose: Quick doubt submission form
 * Used in: StudentNavigator (HomeStack)
 */

import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

type Props = NativeStackScreenProps<any, 'NewSimpleDoubt'>;

export default function NewSimpleDoubt({ navigation }: Props) {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    trackScreenView('NewSimpleDoubt');
  }, []);

  const handleSubmit = async () => {
    if (!subject.trim() || !question.trim()) {
      Alert.alert('Missing Information', 'Please fill in both subject and question.');
      return;
    }

    setIsSubmitting(true);
    trackAction('submit_doubt', 'NewSimpleDoubt');

    try {
      const { error } = await supabase.from('doubts').insert({
        student_id: user?.id,
        subject: subject.trim(),
        question: question.trim(),
        status: 'pending',
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      Alert.alert('Success', 'Your doubt has been submitted!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to submit doubt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseScreen scrollable={true}>
      <View style={styles.container}>
        <Card style={styles.formCard}>
          <T variant="h2" weight="bold" style={styles.title}>
            Ask a Quick Question
          </T>
          <T variant="body" style={styles.subtitle}>
            Get help from your teachers
          </T>

          <View style={styles.inputGroup}>
            <T variant="body" weight="semiBold" style={styles.label}>
              Subject
            </T>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="e.g., Mathematics, Physics"
              editable={!isSubmitting}
              accessibilityLabel="Subject input"
            />
          </View>

          <View style={styles.inputGroup}>
            <T variant="body" weight="semiBold" style={styles.label}>
              Your Question
            </T>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={question}
              onChangeText={setQuestion}
              placeholder="Describe your doubt in detail..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              editable={!isSubmitting}
              accessibilityLabel="Question input"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Submit doubt"
          >
            <T variant="body" weight="semiBold" style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : '📤 Submit Doubt'}
            </T>
          </TouchableOpacity>
        </Card>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  formCard: {
    padding: 20,
    gap: 20,
  },
  title: {
    marginBottom: -12,
  },
  subtitle: {
    color: '#6B7280',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: '#374151',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'System',
  },
  textArea: {
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
  },
});

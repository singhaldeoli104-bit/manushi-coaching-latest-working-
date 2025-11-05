/**
 * NewDoubtSubmission - Premium Minimal Design
 * Purpose: Detailed doubt submission with attachments
 * Used in: StudentNavigator (HomeStack)
 */

import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

type Props = NativeStackScreenProps<any, 'NewDoubtSubmission'>;

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History'];

export default function NewDoubtSubmission({ navigation }: Props) {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    trackScreenView('NewDoubtSubmission');
  }, []);

  const handleSubmit = async () => {
    if (!selectedSubject || !title.trim() || !description.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    trackAction('submit_detailed_doubt', 'NewDoubtSubmission');

    try {
      const { error } = await supabase.from('doubts').insert({
        student_id: user?.id,
        subject: selectedSubject,
        title: title.trim(),
        question: description.trim(),
        status: 'pending',
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      Alert.alert('Success', 'Your doubt has been submitted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error('Error submitting doubt:', err);
      Alert.alert('Error', 'Failed to submit doubt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseScreen scrollable={false}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          <T variant="h2" weight="bold">
            Submit Your Doubt
          </T>

          <View style={styles.section}>
            <T variant="body" weight="semiBold" style={styles.label}>
              Subject *
            </T>
            <View style={styles.subjectGrid}>
              {SUBJECTS.map((subject) => (
                <TouchableOpacity
                  key={subject}
                  style={[
                    styles.subjectChip,
                    selectedSubject === subject && styles.subjectChipActive,
                  ]}
                  onPress={() => setSelectedSubject(subject)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${subject}`}
                >
                  <T
                    variant="body"
                    weight="semiBold"
                    style={[
                      styles.subjectChipText,
                      selectedSubject === subject && styles.subjectChipTextActive,
                    ]}
                  >
                    {subject}
                  </T>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <T variant="body" weight="semiBold" style={styles.label}>
              Title *
            </T>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Brief title for your doubt"
              editable={!isSubmitting}
              accessibilityLabel="Doubt title"
            />
          </View>

          <View style={styles.section}>
            <T variant="body" weight="semiBold" style={styles.label}>
              Detailed Description *
            </T>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Explain your doubt in detail. Include any relevant information..."
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              editable={!isSubmitting}
              accessibilityLabel="Doubt description"
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
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formCard: {
    padding: 20,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  label: {
    color: '#374151',
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subjectChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  subjectChipText: {
    color: '#6B7280',
  },
  subjectChipTextActive: {
    color: '#FFFFFF',
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
    minHeight: 150,
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

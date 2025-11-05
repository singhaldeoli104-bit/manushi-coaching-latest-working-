/**
 * NewDoubtSubmission - Premium Minimal Design
 * Purpose: Detailed doubt submission with attachments
 * Used in: StudentNavigator (HomeStack)
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { Button } from '../../ui/inputs/Button';
import { Chip } from '../../ui/inputs/Chip';
import { Row } from '../../ui/layout/Row';
import { T } from '../../ui';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

type Props = NativeStackScreenProps<any, 'NewDoubtSubmission'>;

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History'];

interface ImageUpload {
  id: string;
  uri: string;
  name: string;
  size: string;
}

export default function NewDoubtSubmission({ navigation }: Props) {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'urgent' | 'normal'>('normal');
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    trackScreenView('NewDoubtSubmission');
  }, []);

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, []);

  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem('doubt_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        setSelectedSubject(parsed.subject || '');
        setTitle(parsed.title || '');
        setDescription(parsed.description || '');
        setPriority(parsed.priority || 'normal');
        setImages(parsed.images || []);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await AsyncStorage.setItem('doubt_draft', JSON.stringify({
        subject: selectedSubject,
        title,
        description,
        priority,
        images,
        timestamp: Date.now(),
      }));
      Alert.alert('Success', 'Draft saved successfully!');
      trackAction('save_doubt_draft', 'NewDoubtSubmission');
    } catch (error) {
      console.error('Error saving draft:', error);
      Alert.alert('Error', 'Failed to save draft');
    }
  };

  const handleImageUpload = () => {
    Alert.alert('Upload Image', 'Choose source:', [
      { text: 'Cancel', style: 'cancel' },
      { text: '📷 Camera', onPress: () => simulateImageUpload('camera') },
      { text: '📁 Gallery', onPress: () => simulateImageUpload('gallery') },
    ]);
  };

  const simulateImageUpload = (source: 'camera' | 'gallery') => {
    const newImage: ImageUpload = {
      id: Date.now().toString(),
      uri: 'simulated-uri',
      name: `${source}_image_${Date.now()}.jpg`,
      size: '1.2 MB',
    };
    setImages(prev => [...prev, newImage]);
    trackAction('upload_doubt_image', 'NewDoubtSubmission', { source });
  };

  const handleRemoveImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

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
        priority,
        status: 'pending',
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Clear draft on successful submission
      await AsyncStorage.removeItem('doubt_draft');

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

          <View style={styles.section}>
            <T variant="body" weight="semiBold" style={styles.label}>
              Priority
            </T>
            <Row gap="xs">
              <Chip
                variant="filter"
                label="🔴 Urgent"
                selected={priority === 'urgent'}
                onPress={() => setPriority('urgent')}
              />
              <Chip
                variant="filter"
                label="🟢 Normal"
                selected={priority === 'normal'}
                onPress={() => setPriority('normal')}
              />
            </Row>
          </View>

          <View style={styles.section}>
            <T variant="body" weight="semiBold" style={styles.label}>
              Images (Optional)
            </T>
            <Button variant="outline" onPress={handleImageUpload}>
              📷 Add Images
            </Button>
            {images.length > 0 && (
              <View style={styles.imagesList}>
                {images.map(img => (
                  <View key={img.id} style={styles.imagePreview}>
                    <View style={{ flex: 1 }}>
                      <T variant="caption" weight="semiBold">{img.name}</T>
                      <T variant="caption" style={{ color: '#9CA3AF' }}>{img.size}</T>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveImage(img.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${img.name}`}
                    >
                      <T variant="body">✕</T>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <Row gap="md" style={{ marginTop: 8 }}>
            <Button
              variant="ghost"
              onPress={handleSaveDraft}
              style={{ flex: 1 }}
              disabled={isSubmitting}
            >
              💾 Save Draft
            </Button>
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled, { flex: 1 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Submit doubt"
            >
              <T variant="body" weight="semiBold" style={styles.submitButtonText}>
                {isSubmitting ? 'Submitting...' : '📤 Submit'}
              </T>
            </TouchableOpacity>
          </Row>
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
  imagesList: {
    gap: 8,
    marginTop: 8,
  },
  imagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});

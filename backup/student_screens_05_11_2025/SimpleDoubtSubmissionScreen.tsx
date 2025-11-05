/**
 * SimpleDoubtSubmissionScreen - Phase 82: Enhanced MediaUploader Integration
 * Advanced version with Phase 82 enhanced MediaUploader features
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Dimensions,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Appbar, Portal, Snackbar } from 'react-native-paper';

// Import existing design system
import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

// Import SimpleMediaUploader component (working version)
import { SimpleMediaUploader, MediaFile } from '../../components/student/SimpleMediaUploader';

// Import Supabase services
import { createDoubt } from '../../services/doubtsService';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

interface SimpleDoubtSubmissionScreenProps {
  studentId: string;
  studentName: string;
  onNavigate: (screen: string) => void;
}

export const SimpleDoubtSubmissionScreen: React.FC<SimpleDoubtSubmissionScreenProps> = ({
  studentId,
  studentName,
  onNavigate,
}) => {
  const { user } = useAuth();
  const [doubtTitle, setDoubtTitle] = useState('');
  const [doubtDescription, setDoubtDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Lifecycle functions
  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }, []);

  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onNavigate('back');
      return true;
    });
    return backHandler;
  }, [onNavigate]);

  const initializeScreen = useCallback(async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize screen:', error);
      showSnackbar('Failed to initialize screen');
      setIsLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    const backHandler = setupBackHandler();
    return () => backHandler.remove();
  }, [setupBackHandler]);

  useEffect(() => {
    initializeScreen();
  }, [initializeScreen]);

  // MediaUploader handlers
  const handleFilesSelected = (files: MediaFile[]) => {
    setAttachedFiles(files);
  };

  const handleFileRemoved = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleUploadProgress = (fileId: string, progress: number) => {
    setAttachedFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, uploadProgress: progress } : file
    ));
  };

  const handleUploadComplete = (fileId: string, result: any) => {
    setAttachedFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, uploadStatus: 'completed' as const } : file
    ));
  };

  const handleUploadError = (fileId: string, error: string) => {
    setAttachedFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, uploadStatus: 'error' as const, errorMessage: error } : file
    ));
  };

  const handleSubmitDoubt = async () => {
    if (!doubtTitle.trim() || !doubtDescription.trim()) {
      showSnackbar('Please enter both title and description for your doubt.');
      return;
    }

    setIsSubmitting(true);

    try {
      const currentUserId = user?.id || studentId;
      if (!currentUserId) {
        showSnackbar('User not authenticated');
        setIsSubmitting(false);
        return;
      }

      // Prepare attachments data (convert MediaFile[] to string[] of URLs)
      const attachmentUrls = attachedFiles.map(file => file.uri || file.url || '');

      const result = await createDoubt({
        student_id: currentUserId,
        subject_code: 'GENERAL', // Default subject code
        title: doubtTitle,
        description: doubtDescription,
        attachments: attachmentUrls,
        priority: 'medium',
        status: 'open',
      });

      if (result.success) {
        showSnackbar(`Your doubt has been submitted successfully with ${attachedFiles.length} attachment(s)! A teacher will respond soon.`);
        setDoubtTitle('');
        setDoubtDescription('');
        setAttachedFiles([]);
        setTimeout(() => onNavigate('back'), 2000);
      } else {
        throw new Error(result.error || 'Failed to submit doubt');
      }

    } catch (error) {
      console.error('Error submitting doubt:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit doubt';
      showSnackbar(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: LightTheme.Primary }}>
      <Appbar.BackAction onPress={() => onNavigate('back')} />
      <Appbar.Content title="Submit Doubt" subtitle="Get help from expert teachers" />
      <Appbar.Action icon="information" onPress={() => showSnackbar('Phase 82 Enhanced MediaUploader features enabled')} />
    </Appbar.Header>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
        {renderAppBar()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={LightTheme.Primary} />
          <Text style={styles.loadingText}>Loading doubt submission form...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
      {renderAppBar()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hi {studentName}! 👋</Text>
          <Text style={styles.subtitleText}>
            Having trouble with something? Submit your doubt and get help from our expert teachers.
          </Text>
        </View>

        {/* Doubt Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Doubt Title *</Text>
            <TextInput
              style={styles.textInput}
              value={doubtTitle}
              onChangeText={setDoubtTitle}
              placeholder="Briefly describe your doubt..."
              placeholderTextColor={LightTheme.Outline}
              maxLength={100}
            />
            <Text style={styles.characterCount}>{doubtTitle.length}/100</Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Doubt Description *</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={doubtDescription}
              onChangeText={setDoubtDescription}
              placeholder="Provide detailed context about your doubt..."
              placeholderTextColor={LightTheme.Outline}
              multiline
              numberOfLines={6}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{doubtDescription.length}/500</Text>
          </View>

          {/* MediaUploader Component */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>📎 Attach Files (Optional)</Text>
            <SimpleMediaUploader
              onFilesSelected={handleFilesSelected}
              onFileRemoved={handleFileRemoved}
              onUploadProgress={handleUploadProgress}
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              maxFiles={5}
              maxFileSize={25}
              enableCamera={true}
              enableDocuments={true}
              enableMultiSelect={true}
              autoUpload={false}
              showPreview={true}
              persistFiles={true}
              enableRetry={true}
              compressionQuality={0.8}
              enableImageCompression={true}
              generateThumbnails={true}
              enableBulkActions={true}
            />
          </View>

          {/* Quick Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Tips for better help:</Text>
            <Text style={styles.tipText}>• Be specific about the topic or concept</Text>
            <Text style={styles.tipText}>• Include the chapter or lesson name</Text>
            <Text style={styles.tipText}>• Explain what you've already tried</Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!doubtTitle.trim() || !doubtDescription.trim() || isSubmitting) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmitDoubt}
            disabled={!doubtTitle.trim() || !doubtDescription.trim() || isSubmitting}
          >
            <Text style={[
              styles.submitButtonText,
              (!doubtTitle.trim() || !doubtDescription.trim() || isSubmitting) && styles.submitButtonTextDisabled
            ]}>
              {isSubmitting ? 'Submitting...' : 'Submit Doubt'}
            </Text>
          </TouchableOpacity>

          {/* Enhanced Feature Notice */}
          <View style={styles.featureNotice}>
            <Text style={styles.featureNoticeText}>
              🚀 Phase 82 Enhanced! Features: Smart recommendations, image compression, 
              real-time progress, thumbnails, and advanced upload tracking.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{
            label: 'Dismiss',
            onPress: () => setSnackbarVisible(false),
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightTheme.Background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LightTheme.Background,
  },
  loadingText: {
    marginTop: Spacing.MD,
    fontSize: 16,
    color: LightTheme.Outline,
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: Spacing.LG,
    backgroundColor: LightTheme.Surface,
    marginBottom: Spacing.MD,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: LightTheme.OnSurface,
    marginBottom: Spacing.SM,
  },
  subtitleText: {
    fontSize: 16,
    color: LightTheme.Outline,
    lineHeight: 22,
  },
  formContainer: {
    padding: Spacing.LG,
    backgroundColor: LightTheme.Surface,
    margin: Spacing.MD,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputSection: {
    marginBottom: Spacing.LG,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: LightTheme.OnSurface,
    marginBottom: Spacing.SM,
  },
  textInput: {
    borderWidth: 1,
    borderColor: LightTheme.Outline,
    borderRadius: 8,
    padding: Spacing.MD,
    fontSize: 16,
    color: LightTheme.OnSurface,
    backgroundColor: LightTheme.Background,
  },
  multilineInput: {
    height: 120,
  },
  characterCount: {
    fontSize: 12,
    color: LightTheme.Outline,
    textAlign: 'right',
    marginTop: Spacing.XS,
  },
  tipsSection: {
    backgroundColor: LightTheme.PrimaryContainer,
    padding: Spacing.MD,
    borderRadius: 8,
    marginBottom: Spacing.LG,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: LightTheme.OnPrimaryContainer,
    marginBottom: Spacing.SM,
  },
  tipText: {
    fontSize: 12,
    color: LightTheme.OnPrimaryContainer,
    marginBottom: Spacing.XS,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: LightTheme.Primary,
    paddingVertical: Spacing.MD,
    paddingHorizontal: Spacing.LG,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: Spacing.MD,
  },
  submitButtonDisabled: {
    backgroundColor: LightTheme.Outline,
  },
  submitButtonText: {
    color: LightTheme.OnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: LightTheme.OnSurface,
  },
  featureNotice: {
    backgroundColor: LightTheme.SecondaryContainer,
    padding: Spacing.MD,
    borderRadius: 8,
    marginTop: Spacing.SM,
  },
  featureNoticeText: {
    fontSize: 12,
    color: LightTheme.OnSecondaryContainer,
    lineHeight: 18,
    textAlign: 'center',
  },
});

export default SimpleDoubtSubmissionScreen;
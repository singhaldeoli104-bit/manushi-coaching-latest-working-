/**
 * AssignmentDetailScreen - Phase 25.2: Assignment & Homework Hub
 * Comprehensive assignment management and submission interface
 * Integration with StudentDashboard existing assignment cards
 *
 * 🆕 PHASE 2 INTEGRATION COMPLETE (2025-10-21)
 * - Integrated React Query hooks for assignment data
 * - Using useAssignment, useSubmission, useSubmitAssignment
 * - Automatic caching, background refetching, optimistic updates
 * - Type-safe submission mutations with automatic cache invalidation
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
  Alert,
  Dimensions,
  TextInput,
  Modal,
  BackHandler,
} from 'react-native';
import {
  Appbar,
  Portal,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';

// Import existing design system
import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { BorderRadius } from '../../theme/spacing';
import { useTheme } from '../../context/ThemeContext';

// React Query hooks - NEW: Backend integration
import {
  useAssignment,
  useSubmission,
  useSubmitAssignment,
  useUpdateSubmission,
} from '../../hooks/api/useStudentAPI';

// Legacy Supabase services (keeping for compatibility)
import { getAssignmentById, submitAssignment, updateSubmission, getStudentSubmission, AssignmentWithSubmission } from '../../services/assignmentsService';
import { getProfileById } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

// Props interface for navigation integration
interface AssignmentDetailScreenProps {
  assignmentId?: string;
  viewAll?: boolean;
  onNavigate: (screen: string) => void;
}

// Assignment data structures
interface AssignmentDetails {
  id: string;
  title: string;
  description: string;
  subject: string;
  teacher: {
    name: string;
    avatar: string;
  };
  dueDate: string;
  maxPoints: number;
  submissionType: 'file' | 'text' | 'both';
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: {
    score: number;
    feedback: string;
    gradedDate: string;
  };
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
  }>;
  submission?: {
    id: string;
    submittedDate: string;
    files: Array<{
      id: string;
      name: string;
      type: string;
      size: string;
    }>;
    text: string;
  };
}

interface FileUpload {
  id: string;
  name: string;
  type: string;
  size: string;
  progress: number;
}

export const AssignmentDetailScreen: React.FC<AssignmentDetailScreenProps> = ({
  assignmentId,
  viewAll = false,
  onNavigate,
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();

  // 🆕 NEW: React Query hooks for backend data (Phase 2 Integration)
  const studentId = user?.id || '';
  const {
    data: assignmentData,
    isLoading: assignmentLoading,
    error: assignmentError,
    refetch: refetchAssignment,
  } = useAssignment(assignmentId || '');

  const {
    data: submissionData,
    isLoading: submissionLoading,
    refetch: refetchSubmission,
  } = useSubmission(assignmentId || '', studentId);

  const submitMutation = useSubmitAssignment();
  const updateMutation = useUpdateSubmission();

  // Combined loading state
  const isLoadingFromBackend = assignmentLoading || submissionLoading;

  // Legacy state (will be gradually replaced)
  const [assignment, setAssignment] = useState<AssignmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionText, setSubmissionText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // 🆕 NEW: Sync React Query data into local state (Phase 2 Integration)
  useEffect(() => {
    console.log('📊 [AssignmentDetail] Using React Query backend data');

    if (assignmentData) {
      console.log('  ✅ Assignment data from backend:', assignmentData.title);

      // Transform assignment data to match local type
      const transformedAssignment: AssignmentDetails = {
        id: assignmentData.id,
        title: assignmentData.title,
        description: assignmentData.description || '',
        subject: assignmentData.subject || '',
        teacher: {
          name: '', // Would need teacher data
          avatar: '',
        },
        dueDate: new Date(assignmentData.due_date).toLocaleDateString(),
        maxPoints: assignmentData.total_points || 100,
        submissionType: 'both' as const,
        status: 'pending' as const,
        attachments: [],
      };

      setAssignment(transformedAssignment);
      setIsLoading(false);
      console.log('  ✅ Assignment state updated from backend');
    }

    if (submissionData) {
      console.log('  ✅ Submission data from backend:', submissionData.id);
      setSubmissionText(submissionData.submission_text || '');
    }
  }, [assignmentData, submissionData]);

  // Legacy initialization (keeping for backwards compatibility)
  useEffect(() => {
    // Skip legacy initialization if we have backend data
    if (assignmentData) {
      console.log('  ⏭️  Skipping legacy initialization - using backend data');
      return;
    }

    initializeScreen();
    setupBackHandler();

    return cleanup;
  }, [assignmentData, assignmentId]);

  // Screen initialization
  const initializeScreen = useCallback(async () => {
    setIsLoading(true);

    try {
      await loadAssignmentDetails();
    } catch (error) {
      console.error('Error initializing screen:', error);
      showSnackbar('Failed to load assignment');
    } finally {
      setIsLoading(false);
    }
  }, [assignmentId]);

  // Back button handler
  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showSubmissionModal) {
        setShowSubmissionModal(false);
        return true;
      }

      if (onNavigate) {
        onNavigate('back');
        return true;
      }

      return false;
    });

    return () => backHandler.remove();
  }, [showSubmissionModal, onNavigate]);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Cleanup if needed
  }, []);

  // Show snackbar message
  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }, []);

  const loadAssignmentDetails = async () => {
    try {
      if (!assignmentId) {
        showSnackbar('No assignment ID provided');
        return;
      }

      // Fetch assignment data from Supabase
      const assignmentResult = await getAssignmentById(assignmentId);

      if (!assignmentResult.success || !assignmentResult.data) {
        showSnackbar(assignmentResult.error || 'Failed to load assignment');
        return;
      }

      const dbAssignment = assignmentResult.data;

      // Fetch teacher profile for teacher info
      let teacherName = 'Teacher';
      if (dbAssignment.teacher_id) {
        const teacherResult = await getProfileById(dbAssignment.teacher_id);
        if (teacherResult.success && teacherResult.data) {
          teacherName = teacherResult.data.full_name || 'Teacher';
        }
      }

      // Fetch student's submission if exists
      let submissionData = null;
      if (user?.id) {
        const submissionResult = await getStudentSubmission(assignmentId, user.id);
        if (submissionResult.success && submissionResult.data) {
          submissionData = submissionResult.data;
        }
      }

      // Determine assignment status
      let status: 'pending' | 'submitted' | 'graded' | 'overdue' = 'pending';
      const now = new Date();
      const dueDate = new Date(dbAssignment.due_date);

      if (submissionData) {
        status = submissionData.status === 'graded' ? 'graded' : 'submitted';
      } else if (now > dueDate) {
        status = 'overdue';
      }

      // Transform to UI format
      const transformedAssignment: AssignmentDetails = {
        id: dbAssignment.id,
        title: dbAssignment.title,
        description: dbAssignment.description || 'No description provided',
        subject: dbAssignment.subject,
        teacher: {
          name: teacherName,
          avatar: '👨‍🏫',
        },
        dueDate: dbAssignment.due_date,
        maxPoints: dbAssignment.total_points || 100,
        submissionType: 'both', // Default to both file and text
        status,
        attachments: [], // Attachments would come from storage if implemented
        submission: submissionData ? {
          id: submissionData.id,
          submittedDate: submissionData.submission_date,
          files: [], // Files would be parsed from submission_file_urls
          text: submissionData.submission_text || '',
        } : undefined,
        grade: submissionData?.status === 'graded' ? {
          score: submissionData.score || 0,
          feedback: submissionData.feedback || '',
          gradedDate: submissionData.graded_at || '',
        } : undefined,
      };

      setAssignment(transformedAssignment);
      if (transformedAssignment.submission) {
        setSubmissionText(transformedAssignment.submission.text);
      }

      console.log('✅ Assignment details loaded from Supabase');
    } catch (error) {
      console.error('Error loading assignment:', error);
      showSnackbar('Failed to load assignment details');
      throw error;
    }
  };

  const handleFileUpload = async () => {
    // TODO: For production, install and use react-native-document-picker:
    // npm install react-native-document-picker
    // import DocumentPicker from 'react-native-document-picker';
    //
    // try {
    //   const result = await DocumentPicker.pick({
    //     type: [DocumentPicker.types.allFiles],
    //   });
    //   // Upload file to Supabase Storage
    //   // await uploadFileToSupabase(result[0]);
    // } catch (err) {
    //   if (!DocumentPicker.isCancel(err)) {
    //     console.error('Error picking file:', err);
    //   }
    // }

    // For now, simulate file upload with user choice
    Alert.alert(
      'Select File Source',
      'Choose where to get the file from:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '📷 Camera',
          onPress: () => {
            simulateFileUpload('camera');
            showSnackbar('File added (Camera simulation)');
          }
        },
        {
          text: '📁 Files',
          onPress: () => {
            simulateFileUpload('files');
            showSnackbar('File added (Document simulation)');
          }
        },
      ]
    );
  };

  const simulateFileUpload = (source: 'camera' | 'files') => {
    const newFile: FileUpload = {
      id: Date.now().toString(),
      name: source === 'camera' ? 'Photo_Assignment.jpg' : 'Document.pdf',
      type: source === 'camera' ? 'image/jpeg' : 'application/pdf',
      size: source === 'camera' ? '2.1 MB' : '3.5 MB',
      progress: 0,
    };

    setUploadedFiles(prev => [...prev, newFile]);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadedFiles(prev => 
        prev.map(file => 
          file.id === newFile.id 
            ? { ...file, progress: Math.min(file.progress + 20, 100) }
            : file
        )
      );
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setUploadedFiles(prev => 
        prev.map(file => 
          file.id === newFile.id 
            ? { ...file, progress: 100 }
            : file
        )
      );
    }, 2500);
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSubmitAssignment = async () => {
    if (!submissionText.trim() && uploadedFiles.length === 0) {
      Alert.alert('Validation Error', 'Please provide either text submission or upload files.');
      return;
    }

    if (!user?.id || !assignmentId) {
      Alert.alert('Error', 'Missing user or assignment information');
      return;
    }

    try {
      setSubmitting(true);
      console.log('🔄 [AssignmentDetail] Submitting with React Query mutation');

      // Check if this is a new submission or update
      if (assignment?.submission) {
        // 🆕 NEW: Use React Query mutation to update submission
        console.log('  ✏️  Updating existing submission:', assignment.submission.id);
        await updateMutation.mutateAsync({
          submissionId: assignment.submission.id,
          studentId: user.id,
          updates: {
            submission_text: submissionText,
            attachment_urls: [], // Would be populated from uploadedFiles
          },
        });

        console.log('  ✅ Submission updated via React Query');
        showSnackbar('Submission updated successfully!');
      } else {
        // 🆕 NEW: Use React Query mutation to create submission
        console.log('  📤 Creating new submission');
        await submitMutation.mutateAsync({
          assignment_id: assignmentId,
          student_id: user.id,
          submission_text: submissionText,
          attachment_urls: [], // Would be populated from uploadedFiles
        });

        console.log('  ✅ Assignment submitted via React Query');
        showSnackbar('Assignment submitted successfully!');
      }

      // Reload assignment data to reflect changes
      await loadAssignmentDetails();

      setShowSubmissionModal(false);
      console.log('✅ Assignment submitted to Supabase');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showSnackbar(`Failed to submit: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadAttachment = async (attachmentId: string, name: string) => {
    // TODO: For production, install and use react-native-fs and react-native-file-viewer:
    // npm install react-native-fs react-native-file-viewer
    // import RNFS from 'react-native-fs';
    // import FileViewer from 'react-native-file-viewer';
    //
    // try {
    //   // Download from Supabase Storage
    //   const { data } = await supabase.storage.from('assignments').download(attachmentId);
    //   const filePath = `${RNFS.DocumentDirectoryPath}/${name}`;
    //   await RNFS.writeFile(filePath, data, 'base64');
    //   await FileViewer.open(filePath);
    //   showSnackbar('File downloaded and opened');
    // } catch (error) {
    //   showSnackbar('Failed to download file');
    // }

    // For now, simulate download
    showSnackbar(`Downloading "${name}"... (simulated)`);

    // Simulate download progress
    setTimeout(() => {
      showSnackbar(`Download complete: ${name}`);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'submitted':
        return '#10B981';
      case 'graded':
        return '#6366F1';
      case 'overdue':
        return '#EF4444';
      default:
        return LightTheme.OnSurfaceVariant;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'submitted':
        return '✅';
      case 'graded':
        return '📝';
      case 'overdue':
        return '⚠️';
      default:
        return '📋';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderSubmissionModal = () => (
    <Modal
      visible={showSubmissionModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSubmissionModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Submit Assignment</Text>
            <TouchableOpacity
              onPress={() => setShowSubmissionModal(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Text Submission */}
            <View style={styles.submissionSection}>
              <Text style={styles.submissionSectionTitle}>Written Response</Text>
              <TextInput
                style={styles.submissionTextInput}
                placeholder="Enter your response here..."
                multiline
                numberOfLines={6}
                value={submissionText}
                onChangeText={setSubmissionText}
                textAlignVertical="top"
              />
            </View>

            {/* File Upload */}
            <View style={styles.submissionSection}>
              <Text style={styles.submissionSectionTitle}>File Attachments</Text>
              
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleFileUpload}
              >
                <Text style={styles.uploadButtonIcon}>📎</Text>
                <Text style={styles.uploadButtonText}>Add Files</Text>
              </TouchableOpacity>

              {uploadedFiles.map((file) => (
                <View key={file.id} style={styles.uploadedFileCard}>
                  <View style={styles.uploadedFileInfo}>
                    <Text style={styles.uploadedFileName}>{file.name}</Text>
                    <Text style={styles.uploadedFileSize}>{file.size}</Text>
                    {file.progress < 100 && (
                      <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: `${file.progress}%` }]} />
                        <Text style={styles.progressText}>{file.progress}%</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveFile(file.id)}
                    style={styles.removeFileButton}
                  >
                    <Text style={styles.removeFileText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowSubmissionModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmitAssignment}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Render app bar
  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: theme.Surface }}>
      <Appbar.BackAction
        onPress={() => onNavigate('back')}
      />

      <Appbar.Content
        title="Assignment"
      />

      {assignment?.status === 'graded' && (
        <Appbar.Action
          icon="school"
          disabled
        />
      )}
    </Appbar.Header>
  );

  // Render loading state
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar backgroundColor={theme.Surface} barStyle="dark-content" />
        {renderAppBar()}

        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
        }}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{
            fontSize: 16,
            color: theme.OnSurfaceVariant,
          }}>
            Loading assignment...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar backgroundColor={theme.Surface} barStyle="dark-content" />
      {renderAppBar()}

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Assignment Header */}
          <View style={styles.assignmentHeader}>
            <View style={styles.statusContainer}>
              <Text style={styles.statusIcon}>{getStatusIcon(assignment?.status || 'pending')}</Text>
              <Text style={[styles.statusText, { color: getStatusColor(assignment?.status || 'pending') }]}>
                {assignment?.status?.toUpperCase() || 'PENDING'}
              </Text>
            </View>
            <Text style={styles.assignmentTitle}>{assignment?.title}</Text>
            <Text style={styles.assignmentSubject}>{assignment?.subject}</Text>
            
            <View style={styles.assignmentMeta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Due Date:</Text>
                <Text style={styles.metaValue}>
                  {assignment?.dueDate && formatDate(assignment.dueDate)}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Points:</Text>
                <Text style={styles.metaValue}>{assignment?.maxPoints}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Teacher:</Text>
                <Text style={styles.metaValue}>
                  {assignment?.teacher?.avatar} {assignment?.teacher?.name || 'Teacher'}
                </Text>
              </View>
            </View>
          </View>

          {/* Assignment Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.assignmentDescription}>{assignment?.description}</Text>
          </View>

          {/* Assignment Attachments */}
          {assignment?.attachments && assignment.attachments.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Assignment Files</Text>
              {assignment.attachments.map((attachment) => (
                <TouchableOpacity
                  key={attachment.id}
                  style={styles.attachmentCard}
                  onPress={() => handleDownloadAttachment(attachment.id, attachment.name)}
                >
                  <Text style={styles.attachmentIcon}>📄</Text>
                  <View style={styles.attachmentInfo}>
                    <Text style={styles.attachmentName}>{attachment.name}</Text>
                    <Text style={styles.attachmentSize}>{attachment.size}</Text>
                  </View>
                  <Text style={styles.downloadIcon}>⬇️</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Current Submission */}
          {assignment?.submission && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Submission</Text>
              <View style={styles.submissionCard}>
                <Text style={styles.submissionDate}>
                  Submitted on {formatDate(assignment.submission.submittedDate)}
                </Text>
                
                {assignment.submission.text && (
                  <View style={styles.submissionTextContainer}>
                    <Text style={styles.submissionLabel}>Written Response:</Text>
                    <Text style={styles.submissionTextContent}>{assignment.submission.text}</Text>
                  </View>
                )}

                {assignment.submission.files.length > 0 && (
                  <View style={styles.submissionFilesContainer}>
                    <Text style={styles.submissionLabel}>Attached Files:</Text>
                    {assignment.submission.files.map((file) => (
                      <View key={file.id} style={styles.submissionFileCard}>
                        <Text style={styles.fileIcon}>📎</Text>
                        <View style={styles.fileInfo}>
                          <Text style={styles.fileName}>{file.name}</Text>
                          <Text style={styles.fileSize}>{file.size}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Grade Information */}
          {assignment?.grade && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Grade & Feedback</Text>
              <View style={styles.gradeCard}>
                <View style={styles.gradeHeader}>
                  <Text style={styles.gradeScore}>
                    {assignment.grade.score} / {assignment.maxPoints}
                  </Text>
                  <Text style={styles.gradePercentage}>
                    {Math.round((assignment.grade.score / assignment.maxPoints) * 100)}%
                  </Text>
                </View>
                <Text style={styles.gradeDate}>
                  Graded on {formatDate(assignment.grade.gradedDate)}
                </Text>
                <Text style={styles.gradeFeedback}>{assignment.grade.feedback}</Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {assignment?.status === 'pending' && (
              <TouchableOpacity
                style={styles.submitAssignmentButton}
                onPress={() => setShowSubmissionModal(true)}
              >
                <Text style={styles.submitAssignmentButtonText}>Submit Assignment</Text>
              </TouchableOpacity>
            )}
            
            {assignment?.status === 'submitted' && (
              <TouchableOpacity
                style={styles.editSubmissionButton}
                onPress={() => setShowSubmissionModal(true)}
              >
                <Text style={styles.editSubmissionButtonText}>Edit Submission</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {renderSubmissionModal()}

        {/* Snackbar for notifications */}
        <Portal>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={4000}
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
  },
  loadingText: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
    backgroundColor: LightTheme.Surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: Spacing.SM,
  },
  backButtonText: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    color: LightTheme.Primary,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.titleLarge.fontSize,
    fontFamily: Typography.titleLarge.fontFamily,
    fontWeight: Typography.titleLarge.fontWeight,
    color: LightTheme.OnSurface,
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.LG,
    paddingBottom: Spacing.XXL,
  },
  assignmentHeader: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.MD,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: Spacing.SM,
  },
  statusText: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    fontWeight: '600',
  },
  assignmentTitle: {
    fontSize: Typography.headlineSmall.fontSize,
    fontFamily: Typography.headlineSmall.fontFamily,
    fontWeight: Typography.headlineSmall.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.SM,
  },
  assignmentSubject: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    color: LightTheme.Primary,
    marginBottom: Spacing.MD,
  },
  assignmentMeta: {
    gap: Spacing.SM,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    fontWeight: '500',
    minWidth: 80,
  },
  metaValue: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurface,
    flex: 1,
  },
  section: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.MD,
  },
  assignmentDescription: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    color: LightTheme.OnSurface,
    lineHeight: Typography.bodyLarge.lineHeight * 1.5,
  },
  attachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightTheme.Background,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    marginBottom: Spacing.SM,
    borderWidth: 1,
    borderColor: LightTheme.OutlineVariant,
  },
  attachmentIcon: {
    fontSize: 24,
    marginRight: Spacing.MD,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.XS,
  },
  attachmentSize: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  downloadIcon: {
    fontSize: 20,
    color: LightTheme.Primary,
  },
  submissionCard: {
    backgroundColor: LightTheme.PrimaryContainer,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
  },
  submissionDate: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnPrimaryContainer,
    fontWeight: '500',
    marginBottom: Spacing.MD,
  },
  submissionTextContainer: {
    marginBottom: Spacing.MD,
  },
  submissionLabel: {
    fontSize: Typography.labelLarge.fontSize,
    fontFamily: Typography.labelLarge.fontFamily,
    color: LightTheme.OnPrimaryContainer,
    fontWeight: '600',
    marginBottom: Spacing.SM,
  },
  submissionTextContent: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnPrimaryContainer,
    lineHeight: Typography.bodyMedium.lineHeight * 1.4,
  },
  submissionFilesContainer: {
    marginTop: Spacing.SM,
  },
  submissionFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: BorderRadius.XS,
    padding: Spacing.SM,
    marginTop: Spacing.SM,
  },
  fileIcon: {
    fontSize: 16,
    marginRight: Spacing.SM,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnPrimaryContainer,
    marginBottom: Spacing.XS,
  },
  fileSize: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnPrimaryContainer,
    opacity: 0.8,
  },
  gradeCard: {
    backgroundColor: LightTheme.SecondaryContainer,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
  },
  gradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  gradeScore: {
    fontSize: Typography.headlineSmall.fontSize,
    fontFamily: Typography.headlineSmall.fontFamily,
    fontWeight: Typography.headlineSmall.fontWeight,
    color: LightTheme.OnSecondaryContainer,
  },
  gradePercentage: {
    fontSize: Typography.titleLarge.fontSize,
    fontFamily: Typography.titleLarge.fontFamily,
    fontWeight: Typography.titleLarge.fontWeight,
    color: LightTheme.Secondary,
  },
  gradeDate: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSecondaryContainer,
    opacity: 0.8,
    marginBottom: Spacing.MD,
  },
  gradeFeedback: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    color: LightTheme.OnSecondaryContainer,
    lineHeight: Typography.bodyLarge.lineHeight * 1.4,
  },
  actionButtons: {
    gap: Spacing.MD,
  },
  submitAssignmentButton: {
    backgroundColor: LightTheme.Primary,
    paddingVertical: Spacing.LG,
    paddingHorizontal: Spacing.XL,
    borderRadius: BorderRadius.MD,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  submitAssignmentButtonText: {
    fontSize: Typography.labelLarge.fontSize,
    fontFamily: Typography.labelLarge.fontFamily,
    fontWeight: Typography.labelLarge.fontWeight,
    color: LightTheme.OnPrimary,
  },
  editSubmissionButton: {
    backgroundColor: LightTheme.SecondaryContainer,
    paddingVertical: Spacing.LG,
    paddingHorizontal: Spacing.XL,
    borderRadius: BorderRadius.MD,
    alignItems: 'center',
  },
  editSubmissionButtonText: {
    fontSize: Typography.labelLarge.fontSize,
    fontFamily: Typography.labelLarge.fontFamily,
    fontWeight: Typography.labelLarge.fontWeight,
    color: LightTheme.OnSecondaryContainer,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.LG,
    width: width * 0.9,
    maxHeight: '80%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.LG,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.OutlineVariant,
  },
  modalTitle: {
    fontSize: Typography.titleLarge.fontSize,
    fontFamily: Typography.titleLarge.fontFamily,
    fontWeight: Typography.titleLarge.fontWeight,
    color: LightTheme.OnSurface,
  },
  modalCloseButton: {
    padding: Spacing.SM,
  },
  modalCloseText: {
    fontSize: 18,
    color: LightTheme.OnSurfaceVariant,
  },
  modalBody: {
    padding: Spacing.LG,
  },
  submissionSection: {
    marginBottom: Spacing.LG,
  },
  submissionSectionTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.MD,
  },
  submissionTextInput: {
    backgroundColor: LightTheme.Background,
    borderWidth: 1,
    borderColor: LightTheme.OutlineVariant,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    color: LightTheme.OnSurface,
    minHeight: 120,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LightTheme.PrimaryContainer,
    paddingVertical: Spacing.MD,
    paddingHorizontal: Spacing.LG,
    borderRadius: BorderRadius.SM,
    marginBottom: Spacing.MD,
  },
  uploadButtonIcon: {
    fontSize: 20,
    marginRight: Spacing.SM,
  },
  uploadButtonText: {
    fontSize: Typography.labelLarge.fontSize,
    fontFamily: Typography.labelLarge.fontFamily,
    color: LightTheme.OnPrimaryContainer,
    fontWeight: '600',
  },
  uploadedFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightTheme.Background,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    marginBottom: Spacing.SM,
    borderWidth: 1,
    borderColor: LightTheme.OutlineVariant,
  },
  uploadedFileInfo: {
    flex: 1,
  },
  uploadedFileName: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.XS,
  },
  uploadedFileSize: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.SM,
  },
  progressContainer: {
    position: 'relative',
    backgroundColor: LightTheme.OutlineVariant,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: LightTheme.Primary,
  },
  progressText: {
    position: 'absolute',
    right: 0,
    top: -20,
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  removeFileButton: {
    padding: Spacing.SM,
    backgroundColor: LightTheme.ErrorContainer,
    borderRadius: BorderRadius.XS,
    marginLeft: Spacing.SM,
  },
  removeFileText: {
    fontSize: 14,
    color: LightTheme.OnErrorContainer,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.LG,
    borderTopWidth: 1,
    borderTopColor: LightTheme.OutlineVariant,
    gap: Spacing.MD,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.MD,
    alignItems: 'center',
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.SM,
    borderWidth: 1,
    borderColor: LightTheme.Outline,
  },
  cancelButtonText: {
    fontSize: Typography.labelLarge.fontSize,
    fontFamily: Typography.labelLarge.fontFamily,
    color: LightTheme.OnSurface,
  },
  submitButton: {
    flex: 1,
    paddingVertical: Spacing.MD,
    alignItems: 'center',
    backgroundColor: LightTheme.Primary,
    borderRadius: BorderRadius.SM,
  },
  submitButtonDisabled: {
    backgroundColor: LightTheme.OutlineVariant,
  },
  submitButtonText: {
    fontSize: Typography.labelLarge.fontSize,
    fontFamily: Typography.labelLarge.fontFamily,
    fontWeight: Typography.labelLarge.fontWeight,
    color: LightTheme.OnPrimary,
  },
});

export default AssignmentDetailScreen;
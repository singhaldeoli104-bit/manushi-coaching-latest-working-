/**
 * NewAssignmentDetailScreen - Premium Minimal Design
 * Purpose: Display assignment details with submission interface
 * Features: File uploads, attachments, submission modal, progress indicators
 */

import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card, CardHeader, CardContent, CardActions } from '../../ui/surfaces/Card';
import { Badge, Button, Chip, T, Row, Col, Spacer } from '../../ui';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

type Props = NativeStackScreenProps<any, 'NewAssignmentDetailScreen'>;

interface FileUpload {
  id: string;
  name: string;
  type: string;
  size: string;
  progress: number;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url?: string;
}

interface AssignmentDetails {
  id: string;
  title: string;
  subject: string;
  teacher_name: string;
  description?: string;
  due_date: string;
  total_points: number;
  created_at: string;
  attachments?: Attachment[];
  submission?: {
    id: string;
    status: 'pending' | 'submitted' | 'graded';
    submitted_at?: string;
    grade?: number;
    feedback?: string;
    submission_text?: string;
    files?: FileUpload[];
  };
}

export default function NewAssignmentDetailScreen({ route, navigation }: Props) {
  const { user } = useAuth();
  const assignmentId = route.params?.assignmentId;

  // State
  const [submissionText, setSubmissionText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track screen view
  React.useEffect(() => {
    trackScreenView('NewAssignmentDetailScreen', { assignmentId });
  }, [assignmentId]);

  // Fetch assignment details
  const { data: assignment, isLoading, error, refetch } = useQuery({
    queryKey: ['assignment-detail', assignmentId],
    queryFn: async () => {
      if (!assignmentId) throw new Error('No assignment ID provided');

      // Fetch assignment with teacher and submission
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          teachers(name),
          submissions(id, status, submitted_at, grade, feedback, submission_text)
        `)
        .eq('id', assignmentId)
        .single();

      if (error) throw error;

      // Get first submission if exists
      const submissions = data.submissions as any[];
      const submission = submissions && submissions.length > 0 ? submissions[0] : undefined;

      // Mock attachments (in production, fetch from Supabase storage)
      const mockAttachments: Attachment[] = [
        {
          id: '1',
          name: 'Assignment_Instructions.pdf',
          type: 'pdf',
          size: '2.5 MB',
        },
        {
          id: '2',
          name: 'Reference_Material.docx',
          type: 'document',
          size: '1.2 MB',
        },
      ];

      return {
        ...data,
        teacher_name: (data.teachers as any)?.name || 'Unknown Teacher',
        submission,
        attachments: mockAttachments,
      } as AssignmentDetails;
    },
    enabled: !!assignmentId,
  });

  // Set submission text from existing submission
  React.useEffect(() => {
    if (assignment?.submission?.submission_text) {
      setSubmissionText(assignment.submission.submission_text);
    }
  }, [assignment]);

  // Get assignment status
  const getStatus = (): 'pending' | 'submitted' | 'graded' | 'overdue' => {
    if (assignment?.submission) {
      return assignment.submission.status;
    }

    const dueDate = new Date(assignment?.due_date || '');
    if (dueDate < new Date()) {
      return 'overdue';
    }

    return 'pending';
  };

  // Get days until due
  const getDaysUntilDue = (): number => {
    if (!assignment) return 0;
    const dueDate = new Date(assignment.due_date);
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // FEATURE 1: Handle file upload
  const handleFileUpload = useCallback(() => {
    trackAction('upload_file', 'NewAssignmentDetailScreen', { assignmentId });

    Alert.alert(
      'Select File Source',
      'Choose where to get the file from:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '📷 Camera',
          onPress: () => simulateFileUpload('camera'),
        },
        {
          text: '📁 Files',
          onPress: () => simulateFileUpload('files'),
        },
      ]
    );
  }, [assignmentId]);

  // FEATURE 4: Simulate file upload with progress
  const simulateFileUpload = useCallback((source: 'camera' | 'files') => {
    const newFile: FileUpload = {
      id: Date.now().toString(),
      name: source === 'camera' ? `Photo_${Date.now()}.jpg` : `Document_${Date.now()}.pdf`,
      type: source === 'camera' ? 'image/jpeg' : 'application/pdf',
      size: source === 'camera' ? '2.1 MB' : '3.5 MB',
      progress: 0,
    };

    setUploadedFiles((prev) => [...prev, newFile]);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === newFile.id ? { ...file, progress: Math.min(file.progress + 20, 100) } : file
        )
      );
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setUploadedFiles((prev) =>
        prev.map((file) => (file.id === newFile.id ? { ...file, progress: 100 } : file))
      );
    }, 2500);
  }, []);

  // FEATURE 5: Remove uploaded file
  const handleRemoveFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
    trackAction('remove_file', 'NewAssignmentDetailScreen', { fileId });
  }, []);

  // FEATURE 2: Download attachment
  const handleDownloadAttachment = useCallback(
    (attachment: Attachment) => {
      trackAction('download_attachment', 'NewAssignmentDetailScreen', {
        assignmentId,
        attachmentId: attachment.id,
      });

      Alert.alert('Download', `Downloading "${attachment.name}"...`);
      // In production: Implement actual download from Supabase storage
    },
    [assignmentId]
  );

  // Handle submit assignment
  const handleSubmit = useCallback(async () => {
    if (!assignment || !user?.id) return;

    if (!submissionText.trim() && uploadedFiles.length === 0) {
      Alert.alert('Empty Submission', 'Please write your answer or upload files before submitting.');
      return;
    }

    Alert.alert(
      'Submit Assignment',
      'Are you sure you want to submit? You cannot edit after submission.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            setIsSubmitting(true);
            trackAction('submit_assignment', 'NewAssignmentDetailScreen', { assignmentId });

            try {
              const { error } = await supabase.from('submissions').insert({
                assignment_id: assignmentId,
                student_id: user.id,
                submission_text: submissionText,
                status: 'submitted',
                submitted_at: new Date().toISOString(),
                // In production: Upload files to storage and save URLs
              });

              if (error) throw error;

              Alert.alert('Success', 'Assignment submitted successfully!');
              setShowSubmissionModal(false);
              setUploadedFiles([]);
              setSubmissionText('');
              refetch();
            } catch (err) {
              Alert.alert('Error', 'Failed to submit assignment. Please try again.');
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  }, [assignment, assignmentId, user, submissionText, uploadedFiles, refetch]);

  if (!assignmentId) {
    return (
      <BaseScreen scrollable={false} error="No assignment ID provided">
        <View />
      </BaseScreen>
    );
  }

  const status = getStatus();
  const daysUntilDue = getDaysUntilDue();

  return (
    <BaseScreen
      scrollable={true}
      loading={isLoading}
      error={error ? 'Failed to load assignment details' : null}
      empty={!assignment}
      emptyMessage="Assignment not found"
      onRefresh={() => {
        trackAction('refresh_assignment_detail', 'NewAssignmentDetailScreen', { assignmentId });
        refetch();
      }}
    >
      {assignment && (
        <View style={styles.container}>
          {/* Assignment Header */}
          <Card style={styles.headerCard}>
            <View style={styles.headerTop}>
              <View style={styles.headerInfo}>
                <T variant="h2" weight="bold">
                  {assignment.title}
                </T>
                <T variant="body" style={styles.subject}>
                  {assignment.subject} • {assignment.teacher_name}
                </T>
              </View>
              <Badge
                variant={
                  status === 'graded'
                    ? 'success'
                    : status === 'submitted'
                    ? 'info'
                    : status === 'overdue'
                    ? 'error'
                    : 'warning'
                }
              >
                {status === 'graded'
                  ? '✓ Graded'
                  : status === 'submitted'
                  ? '📤 Submitted'
                  : status === 'overdue'
                  ? '⚠️ Overdue'
                  : '⏰ Pending'}
              </Badge>
            </View>

            {/* Due Date Info */}
            <View style={styles.dueInfo}>
              <T variant="body" weight="semiBold">
                📅 Due:{' '}
                {new Date(assignment.due_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </T>
              {status === 'pending' && (
                <T
                  variant="caption"
                  style={[styles.daysRemaining, daysUntilDue <= 1 && styles.daysRemainingUrgent]}
                >
                  {daysUntilDue > 0
                    ? `${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''} remaining`
                    : 'Due today'}
                </T>
              )}
            </View>

            {/* Points */}
            <View style={styles.pointsContainer}>
              <T variant="body" style={styles.points}>
                🏆 {assignment.total_points} points
              </T>
              {assignment.submission?.grade !== undefined && (
                <T variant="body" weight="semiBold" style={styles.grade}>
                  Your Score: {assignment.submission.grade}/{assignment.total_points}
                </T>
              )}
            </View>
          </Card>

          {/* Description */}
          {assignment.description && (
            <Card style={styles.descriptionCard}>
              <T variant="title" weight="semiBold" style={styles.sectionTitle}>
                Instructions
              </T>
              <T variant="body" style={styles.description}>
                {assignment.description}
              </T>
            </Card>
          )}

          {/* FEATURE 2: Teacher's Attachments */}
          {assignment.attachments && assignment.attachments.length > 0 && (
            <Card style={styles.attachmentsCard}>
              <T variant="title" weight="semiBold" style={styles.sectionTitle}>
                Attachments ({assignment.attachments.length})
              </T>
              {assignment.attachments.map((attachment) => (
                <TouchableOpacity
                  key={attachment.id}
                  style={styles.attachmentItem}
                  onPress={() => handleDownloadAttachment(attachment)}
                  accessibilityRole="button"
                  accessibilityLabel={`Download ${attachment.name}`}
                >
                  <View style={styles.attachmentIcon}>
                    <T variant="h3">{attachment.type === 'pdf' ? '📄' : '📝'}</T>
                  </View>
                  <View style={styles.attachmentInfo}>
                    <T variant="body" weight="semiBold" numberOfLines={1}>
                      {attachment.name}
                    </T>
                    <T variant="caption" style={styles.attachmentSize}>
                      {attachment.size}
                    </T>
                  </View>
                  <T variant="body" style={styles.downloadIcon}>
                    ⬇️
                  </T>
                </TouchableOpacity>
              ))}
            </Card>
          )}

          {/* Submission Status */}
          {assignment.submission && (
            <Card style={styles.submissionCard}>
              <T variant="title" weight="semiBold" style={styles.sectionTitle}>
                Your Submission
              </T>

              {assignment.submission.submitted_at && (
                <T variant="caption" style={styles.submittedAt}>
                  Submitted on{' '}
                  {new Date(assignment.submission.submitted_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </T>
              )}

              {assignment.submission.submission_text && (
                <View style={styles.submissionTextContainer}>
                  <T variant="body" style={styles.submissionText}>
                    {assignment.submission.submission_text}
                  </T>
                </View>
              )}

              {assignment.submission.feedback && (
                <View style={styles.feedbackContainer}>
                  <T variant="body" weight="semiBold" style={styles.feedbackTitle}>
                    Teacher Feedback:
                  </T>
                  <T variant="body" style={styles.feedbackText}>
                    {assignment.submission.feedback}
                  </T>
                </View>
              )}
            </Card>
          )}

          {/* Submit Button (only if not submitted) */}
          {!assignment.submission && status !== 'overdue' && (
            <TouchableOpacity
              style={styles.startSubmissionButton}
              onPress={() => setShowSubmissionModal(true)}
              accessibilityRole="button"
              accessibilityLabel="Start submission"
            >
              <T variant="body" weight="semiBold" style={styles.startSubmissionText}>
                📝 Start Submission
              </T>
            </TouchableOpacity>
          )}

          {/* FEATURE 3: Submission Modal */}
          <Modal
            visible={showSubmissionModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowSubmissionModal(false)}
          >
            <View style={styles.modalOverlay}>
              <ScrollView
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <Card style={styles.modalCard}>
                  <CardHeader
                    title="Submit Assignment"
                    trailing={
                      <TouchableOpacity onPress={() => setShowSubmissionModal(false)}>
                        <T variant="body" weight="bold" style={{ color: '#6B7280' }}>
                          ✕
                        </T>
                      </TouchableOpacity>
                    }
                  />

                  <CardContent>
                    {/* Text Input */}
                    <View style={styles.submissionSection}>
                      <T variant="body" weight="semiBold" style={{ marginBottom: 8 }}>
                        Written Response
                      </T>
                      <TextInput
                        style={styles.modalTextInput}
                        value={submissionText}
                        onChangeText={setSubmissionText}
                        placeholder="Write your answer here..."
                        multiline
                        numberOfLines={8}
                        textAlignVertical="top"
                        editable={!isSubmitting}
                        accessibilityLabel="Assignment answer input"
                      />
                    </View>

                    <Spacer size="md" />

                    {/* FEATURE 1 & 4: File Upload Section */}
                    <View style={styles.submissionSection}>
                      <T variant="body" weight="semiBold" style={{ marginBottom: 8 }}>
                        File Attachments
                      </T>

                      <Button
                        variant="outline"
                        fullWidth
                        onPress={handleFileUpload}
                        disabled={isSubmitting}
                      >
                        📎 Add Files
                      </Button>

                      <Spacer size="sm" />

                      {/* Uploaded Files List */}
                      {uploadedFiles.map((file) => (
                        <Card key={file.id} variant="filled" style={{ marginBottom: 8 }}>
                          <View style={styles.uploadedFileRow}>
                            <View style={styles.fileIcon}>
                              <T variant="body">
                                {file.type.includes('image') ? '📷' : '📄'}
                              </T>
                            </View>
                            <View style={styles.uploadedFileInfo}>
                              <T variant="body" weight="semiBold" numberOfLines={1}>
                                {file.name}
                              </T>
                              <T variant="caption" style={styles.fileSize}>
                                {file.size}
                              </T>
                              {/* FEATURE 4: Progress Bar */}
                              {file.progress < 100 && (
                                <View style={styles.progressBarContainer}>
                                  <View
                                    style={[styles.progressBarFill, { width: `${file.progress}%` }]}
                                  />
                                  <T variant="caption" style={styles.progressText}>
                                    {file.progress}%
                                  </T>
                                </View>
                              )}
                            </View>
                            {/* FEATURE 5: Remove File Button */}
                            <TouchableOpacity
                              onPress={() => handleRemoveFile(file.id)}
                              style={styles.removeFileButton}
                              accessibilityRole="button"
                              accessibilityLabel="Remove file"
                            >
                              <T variant="body">✕</T>
                            </TouchableOpacity>
                          </View>
                        </Card>
                      ))}
                    </View>
                  </CardContent>

                  <CardActions>
                    <Button variant="ghost" onPress={() => setShowSubmissionModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onPress={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : '📤 Submit'}
                    </Button>
                  </CardActions>
                </Card>
              </ScrollView>
            </View>
          </Modal>
        </View>
      )}
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  headerCard: {
    padding: 16,
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  subject: {
    color: '#6B7280',
  },
  dueInfo: {
    gap: 4,
  },
  daysRemaining: {
    color: '#6B7280',
  },
  daysRemainingUrgent: {
    color: '#EF4444',
    fontWeight: '600',
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  points: {
    color: '#6B7280',
  },
  grade: {
    color: '#10B981',
  },
  descriptionCard: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  description: {
    color: '#4B5563',
    lineHeight: 22,
  },
  attachmentsCard: {
    padding: 16,
    gap: 12,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  attachmentInfo: {
    flex: 1,
    gap: 2,
  },
  attachmentSize: {
    color: '#9CA3AF',
  },
  downloadIcon: {
    color: '#3B82F6',
    fontSize: 20,
  },
  submissionCard: {
    padding: 16,
    gap: 12,
    backgroundColor: '#F9FAFB',
  },
  submittedAt: {
    color: '#6B7280',
  },
  submissionTextContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  submissionText: {
    color: '#111827',
    lineHeight: 22,
  },
  feedbackContainer: {
    backgroundColor: '#DBEAFE',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  feedbackTitle: {
    color: '#1E40AF',
  },
  feedbackText: {
    color: '#1E3A8A',
    lineHeight: 22,
  },
  startSubmissionButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  startSubmissionText: {
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalCard: {
    maxHeight: '90%',
  },
  submissionSection: {
    gap: 8,
  },
  modalTextInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 150,
    fontFamily: 'System',
  },
  uploadedFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
  },
  fileIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  uploadedFileInfo: {
    flex: 1,
    gap: 4,
  },
  fileSize: {
    color: '#9CA3AF',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  progressText: {
    color: '#6B7280',
    marginTop: 2,
  },
  removeFileButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
  },
});

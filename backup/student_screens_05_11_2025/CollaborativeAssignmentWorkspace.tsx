/**
 * Collaborative Assignment Workspace
 * Phase 77: Advanced Real-Time Collaboration & Communication Suite
 * Enhances existing assignment system with real-time collaboration
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Portal, Snackbar, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { realTimeCollaborationService, CollaborationSession, DocumentChange } from '../../services/collaboration/RealTimeCollaborationService';
import { logger } from '../../services/utils/logger';

const { width, height } = Dimensions.get('window');

interface CollaborativeAssignmentProps {
  assignmentId?: string;
  studentId?: string;
  studentName?: string;
  onNavigate?: (screen: string) => void;
}

interface AssignmentDetails {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  maxScore: number;
  instructions: string;
  resources: AssignmentResource[];
  collaborativeMode: boolean;
  allowPeerReview: boolean;
}

interface AssignmentResource {
  id: string;
  type: 'document' | 'image' | 'video' | 'link';
  title: string;
  url: string;
  size?: number;
}

interface CollaborativeCursor {
  userId: string;
  userName: string;
  position: { x: number; y: number };
  color: string;
  lastUpdate: string;
}

interface PeerComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  position: number;
  timestamp: string;
  replies: PeerComment[];
  resolved: boolean;
}

const CollaborativeAssignmentWorkspace: React.FC<CollaborativeAssignmentProps> = ({
  assignmentId = 'assignment_001',
  studentId = 'student_123',
  studentName = 'Alex Johnson',
  onNavigate,
}) => {
  const [collaborationSession, setCollaborationSession] = useState<CollaborationSession | null>(null);
  const [assignmentContent, setAssignmentContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [assignmentDetails] = useState<AssignmentDetails>({
    id: assignmentId,
    title: 'Advanced Mathematics Problem Set',
    subject: 'Mathematics',
    dueDate: '2024-12-15T23:59:00Z',
    maxScore: 100,
    instructions: 'Solve the following problems showing all work. You can collaborate with your peers in real-time.',
    resources: [
      {
        id: 'res_001',
        type: 'document',
        title: 'Formula Reference Sheet',
        url: '/resources/formulas.pdf',
      },
      {
        id: 'res_002',
        type: 'video',
        title: 'Tutorial: Solving Quadratic Equations',
        url: '/resources/tutorial.mp4',
      },
    ],
    collaborativeMode: true,
    allowPeerReview: true,
  });

  const [activeCursors, setActiveCursors] = useState<CollaborativeCursor[]>([]);
  const [peerComments, setPeerComments] = useState<PeerComment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [collaborators, setCollaborators] = useState([
    { id: 'student_456', name: 'Emma Davis', role: 'peer', active: true },
    { id: 'student_789', name: 'Michael Chen', role: 'peer', active: false },
  ]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const textInputRef = useRef<TextInput>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const cursorUpdateTimeoutRef = useRef<NodeJS.Timeout>();
  const commentsAnimation = useRef(new Animated.Value(0)).current;
  const resourcesAnimation = useRef(new Animated.Value(0)).current;
  const historyAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initializeCollaborativeWorkspace();
    setupEventListeners();
    loadAssignmentContent();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Leave Assignment',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => true },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => {
              onNavigate?.('student-dashboard');
              return false;
            },
          },
        ]
      );
      return true;
    });

    return () => {
      backHandler.remove();
      cleanupWorkspace();
    };
  }, []);

  useEffect(() => {
    // Auto-save functionality
    if (assignmentContent !== originalContent) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveAssignmentContent();
      }, 2000); // Auto-save after 2 seconds of inactivity
    }
  }, [assignmentContent, originalContent]);

  useEffect(() => {
    setWordCount(assignmentContent.split(/\s+/).filter(word => word.length > 0).length);
  }, [assignmentContent]);

  const initializeCollaborativeWorkspace = async () => {
    try {
      setLoading(true);

      // Create or join collaboration session for this assignment
      const sessionTitle = `Assignment: ${assignmentDetails.title}`;
      const session = await realTimeCollaborationService.createSession(
        sessionTitle,
        'assignment',
        {
          max_participants: 20,
          enable_chat: true,
          enable_voice: false,
          enable_video: false,
          enable_screen_share: false,
          record_session: false,
          auto_save_interval: 30000,
        }
      );

      setCollaborationSession(session);
      logger.info('Collaborative assignment workspace initialized');
    } catch (error) {
      logger.error('Failed to initialize collaborative workspace:', error);
      Alert.alert('Connection Error', 'Failed to initialize collaborative features. You can still work on the assignment.');
    } finally {
      setLoading(false);
    }
  };

  const setupEventListeners = () => {
    realTimeCollaborationService.addEventListener('document_change', handleDocumentChange);
    realTimeCollaborationService.addEventListener('cursor_update', handleCursorUpdate);
    realTimeCollaborationService.addEventListener('comment_added', handleCommentAdded);
    realTimeCollaborationService.addEventListener('participant_joined', handleCollaboratorJoined);
    realTimeCollaborationService.addEventListener('participant_left', handleCollaboratorLeft);
  };

  const cleanupWorkspace = async () => {
    try {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      if (cursorUpdateTimeoutRef.current) {
        clearTimeout(cursorUpdateTimeoutRef.current);
      }

      // Save final content
      await saveAssignmentContent();

      if (collaborationSession) {
        await realTimeCollaborationService.leaveSession(collaborationSession.id);
      }

      // Remove event listeners
      realTimeCollaborationService.removeEventListener('document_change', handleDocumentChange);
      realTimeCollaborationService.removeEventListener('cursor_update', handleCursorUpdate);
      realTimeCollaborationService.removeEventListener('comment_added', handleCommentAdded);
      realTimeCollaborationService.removeEventListener('participant_joined', handleCollaboratorJoined);
      realTimeCollaborationService.removeEventListener('participant_left', handleCollaboratorLeft);
    } catch (error) {
      logger.error('Error during workspace cleanup:', error);
    }
  };

  const loadAssignmentContent = async () => {
    try {
      // In a real app, this would load from the backend
      const mockContent = `Problem 1: Solve for x in the equation 2x² + 5x - 3 = 0

Your solution:


Problem 2: Find the derivative of f(x) = 3x³ - 2x² + x - 5

Your solution:


Problem 3: Calculate the area under the curve y = x² from x = 0 to x = 4

Your solution:

`;
      setAssignmentContent(mockContent);
      setOriginalContent(mockContent);
    } catch (error) {
      logger.error('Failed to load assignment content:', error);
    }
  };

  const saveAssignmentContent = async () => {
    try {
      setIsAutoSaving(true);
      
      // Simulate API call to save content
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOriginalContent(assignmentContent);
      setLastSaved(new Date());
      
      logger.info('Assignment content auto-saved');
    } catch (error) {
      logger.error('Failed to save assignment content:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleDocumentChange = useCallback((change: DocumentChange) => {
    if (change.user_id === studentId) return; // Ignore own changes

    // Apply collaborative change to content
    setAssignmentContent(prevContent => {
      let newContent = prevContent;
      
      switch (change.type) {
        case 'insert':
          newContent = 
            prevContent.slice(0, change.position) + 
            change.content + 
            prevContent.slice(change.position);
          break;
        case 'delete':
          newContent = 
            prevContent.slice(0, change.position) + 
            prevContent.slice(change.position + change.length);
          break;
        case 'replace':
          newContent = 
            prevContent.slice(0, change.position) + 
            change.content + 
            prevContent.slice(change.position + change.length);
          break;
      }
      
      return newContent;
    });
  }, [studentId]);

  const handleCursorUpdate = useCallback((cursorData: any) => {
    if (cursorData.user_id === studentId) return;

    setActiveCursors(prev => {
      const filtered = prev.filter(c => c.userId !== cursorData.user_id);
      return [...filtered, {
        userId: cursorData.user_id,
        userName: cursorData.user_name,
        position: cursorData.position,
        color: `hsl(${Math.abs(cursorData.user_id.charCodeAt(0) * 137) % 360}, 70%, 50%)`,
        lastUpdate: cursorData.timestamp,
      }];
    });

    // Remove stale cursors after 5 seconds
    setTimeout(() => {
      setActiveCursors(prev => 
        prev.filter(c => c.userId !== cursorData.user_id || 
          new Date().getTime() - new Date(c.lastUpdate).getTime() < 5000
        )
      );
    }, 5000);
  }, [studentId]);

  const handleCommentAdded = useCallback((comment: PeerComment) => {
    setPeerComments(prev => [...prev, comment]);
  }, []);

  const handleCollaboratorJoined = useCallback((collaborator: any) => {
    setCollaborators(prev => [
      ...prev.filter(c => c.id !== collaborator.user_id),
      {
        id: collaborator.user_id,
        name: collaborator.user_name,
        role: 'peer',
        active: true,
      }
    ]);
  }, []);

  const handleCollaboratorLeft = useCallback((collaborator: any) => {
    setCollaborators(prev => 
      prev.map(c => 
        c.id === collaborator.user_id 
          ? { ...c, active: false }
          : c
      )
    );
  }, []);

  const handleContentChange = async (text: string) => {
    const oldText = assignmentContent;
    setAssignmentContent(text);

    // Send collaborative change if connected
    if (collaborationSession && text !== oldText) {
      try {
        // Find the change position and type
        let changeType: DocumentChange['type'] = 'replace';
        let position = 0;
        let length = 0;
        let content = '';

        // Simple diff algorithm
        const minLength = Math.min(oldText.length, text.length);
        
        // Find first difference
        for (let i = 0; i < minLength; i++) {
          if (oldText[i] !== text[i]) {
            position = i;
            break;
          }
        }

        if (text.length > oldText.length) {
          // Insertion
          changeType = 'insert';
          content = text.slice(position, position + (text.length - oldText.length));
        } else if (text.length < oldText.length) {
          // Deletion
          changeType = 'delete';
          length = oldText.length - text.length;
        } else {
          // Replacement
          changeType = 'replace';
          content = text.slice(position);
          length = oldText.slice(position).length;
        }

        await realTimeCollaborationService.applyDocumentChange(
          collaborationSession.id,
          {
            type: changeType,
            position,
            length,
            content,
          }
        );
      } catch (error) {
        logger.error('Failed to send document change:', error);
      }
    }
  };

  const handleSelectionChange = (event: any) => {
    const { selection } = event.nativeEvent;
    
    // Update cursor position for collaborators
    if (collaborationSession && cursorUpdateTimeoutRef.current) {
      clearTimeout(cursorUpdateTimeoutRef.current);
    }

    cursorUpdateTimeoutRef.current = setTimeout(() => {
      if (collaborationSession) {
        realTimeCollaborationService.updateCursorPosition(
          collaborationSession.id,
          selection.start,
          0
        );
      }
    }, 100);
  };

  const addPeerComment = () => {
    Alert.prompt(
      'Add Comment',
      'Enter your comment:',
      async (text) => {
        if (!text?.trim() || !collaborationSession) return;

        const comment: Omit<PeerComment, 'id' | 'timestamp'> = {
          authorId: studentId,
          authorName: studentName,
          content: text.trim(),
          position: textInputRef.current?.props.selection?.start || 0,
          replies: [],
          resolved: false,
        };

        try {
          await realTimeCollaborationService.sendMessage(
            collaborationSession.id,
            JSON.stringify(comment),
            'text',
            { type: 'peer_comment' }
          );
        } catch (error) {
          logger.error('Failed to add peer comment:', error);
        }
      }
    );
  };

  const submitAssignment = async () => {
    Alert.alert(
      'Submit Assignment',
      'Are you sure you want to submit this assignment? You won\'t be able to edit it after submission.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            try {
              await saveAssignmentContent();
              Alert.alert('success', 'Assignment submitted successfully!');
              onNavigate?.('student-dashboard');
            } catch (error) {
              Alert.alert('error', 'Failed to submit assignment. Please try again.');
            }
          },
        },
      ]
    );
  };

  const toggleComments = () => {
    const newState = !showComments;
    setShowComments(newState);
    
    Animated.timing(commentsAnimation, {
      toValue: newState ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const toggleResources = () => {
    const newState = !showResources;
    setShowResources(newState);
    
    Animated.timing(resourcesAnimation, {
      toValue: newState ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const renderCollaboratorItem = (collaborator: any) => (
    <View key={collaborator.id} style={styles.collaboratorItem}>
      <View style={[
        styles.collaboratorAvatar,
        { backgroundColor: `hsl(${Math.abs(collaborator.id.charCodeAt(0) * 137) % 360}, 70%, 50%)` }
      ]}>
        <Text style={styles.collaboratorAvatarText}>
          {collaborator.name.charAt(0)}
        </Text>
      </View>
      <Text style={styles.collaboratorName}>{collaborator.name}</Text>
      <View style={[
        styles.collaboratorStatus,
        { backgroundColor: collaborator.active ? '#10B981' : '#6B7280' }
      ]} />
    </View>
  );

  const renderResourceItem = (resource: AssignmentResource) => {
    const getResourceIcon = () => {
      switch (resource.type) {
        case 'document': return '📄';
        case 'image': return '🖼️';
        case 'video': return '🎥';
        case 'link': return '🔗';
        default: return '📎';
      }
    };

    return (
      <TouchableOpacity key={resource.id} style={styles.resourceItem}>
        <Text style={styles.resourceIcon}>{getResourceIcon()}</Text>
        <View style={styles.resourceInfo}>
          <Text style={styles.resourceTitle}>{resource.title}</Text>
          <Text style={styles.resourceType}>{resource.type.toUpperCase()}</Text>
        </View>
        <Icon name="open-in-new" size={20} color="#6366F1" />
      </TouchableOpacity>
    );
  };

  const renderCommentItem = (comment: PeerComment) => (
    <View key={comment.id} style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentAuthor}>{comment.authorName}</Text>
        <Text style={styles.commentTime}>
          {new Date(comment.timestamp).toLocaleTimeString()}
        </Text>
      </View>
      <Text style={styles.commentContent}>{comment.content}</Text>
      {!comment.resolved && (
        <TouchableOpacity style={styles.resolveButton}>
          <Text style={styles.resolveButtonText}>Mark Resolved</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: '#6366F1' }}>
      <Appbar.BackAction onPress={() => onNavigate?.('student-dashboard')} />
      <Appbar.Content
        title={assignmentDetails.title}
        subtitle={`Due: ${new Date(assignmentDetails.dueDate).toLocaleDateString()}`}
      />
      <Appbar.Action icon="send" onPress={submitAssignment} />
    </Appbar.Header>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
      {renderAppBar()}

      {/* Collaboration Bar */}
      <View style={styles.collaborationBar}>
        <ScrollView 
          horizontal 
          style={styles.collaboratorsList}
          showsHorizontalScrollIndicator={false}
        >
          {collaborators.map(renderCollaboratorItem)}
        </ScrollView>
        <View style={styles.collaborationControls}>
          <TouchableOpacity onPress={addPeerComment} style={styles.controlButton}>
            <Icon name="comment" size={20} color="#6366F1" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleComments} style={styles.controlButton}>
            <Icon name="chat" size={20} color="#6366F1" />
            {peerComments.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>{peerComments.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleResources} style={styles.controlButton}>
            <Icon name="folder" size={20} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          {isAutoSaving ? 'Saving...' : `Last saved: ${lastSaved.toLocaleTimeString()}`}
        </Text>
        <Text style={styles.wordCountText}>
          {wordCount} words
        </Text>
        <Text style={styles.scoreText}>
          Max Score: {assignmentDetails.maxScore}
        </Text>
      </View>

      <View style={styles.mainContent}>
        {/* Assignment Content */}
        <View style={styles.editorContainer}>
          <ScrollView style={styles.instructionsScroll}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            <Text style={styles.instructionsText}>{assignmentDetails.instructions}</Text>
          </ScrollView>
          
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.editorKeyboardView}
          >
            <TextInput
              ref={textInputRef}
              style={styles.assignmentEditor}
              multiline
              placeholder="Start working on your assignment here..."
              value={assignmentContent}
              onChangeText={handleContentChange}
              onSelectionChange={handleSelectionChange}
              textAlignVertical="top"
              scrollEnabled
            />
          </KeyboardAvoidingView>

          {/* Collaborative Cursors */}
          {activeCursors.map(cursor => (
            <View
              key={cursor.userId}
              style={[
                styles.collaborativeCursor,
                {
                  backgroundColor: cursor.color,
                  // Position would be calculated based on text position
                  top: 100, // Simplified positioning
                  left: 20,
                }
              ]}
            >
              <Text style={styles.cursorLabel}>{cursor.userName}</Text>
            </View>
          ))}
        </View>

        {/* Comments Panel */}
        <Animated.View style={[
          styles.sidePanel,
          styles.commentsPanel,
          {
            transform: [{
              translateX: commentsAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [width, 0],
              }),
            }],
          },
        ]}>
          <View style={styles.sidePanelHeader}>
            <Text style={styles.sidePanelTitle}>Peer Comments</Text>
            <TouchableOpacity onPress={toggleComments}>
              <Icon name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.commentsList}>
            {peerComments.map(renderCommentItem)}
            {peerComments.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No comments yet</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>

        {/* Resources Panel */}
        <Animated.View style={[
          styles.sidePanel,
          styles.resourcesPanel,
          {
            transform: [{
              translateX: resourcesAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [width, 0],
              }),
            }],
          },
        ]}>
          <View style={styles.sidePanelHeader}>
            <Text style={styles.sidePanelTitle}>Resources</Text>
            <TouchableOpacity onPress={toggleResources}>
              <Icon name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.resourcesList}>
            {assignmentDetails.resources.map(renderResourceItem)}
          </ScrollView>
        </Animated.View>
      </View>

      {/* Snackbar for notifications */}
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
  },
  headerTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#E0E7FF',
  },
  submitButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  collaborationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  collaboratorsList: {
    flex: 1,
  },
  collaboratorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  collaboratorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  collaboratorAvatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  collaboratorName: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  collaboratorStatus: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  collaborationControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  wordCountText: {
    fontSize: 12,
    color: '#6B7280',
  },
  scoreText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  editorContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  instructionsScroll: {
    maxHeight: 120,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    padding: 16,
    paddingBottom: 8,
  },
  instructionsText: {
    fontSize: 13,
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 20,
  },
  editorKeyboardView: {
    flex: 1,
  },
  assignmentEditor: {
    flex: 1,
    padding: 16,
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  collaborativeCursor: {
    position: 'absolute',
    width: 2,
    height: 20,
    borderRadius: 1,
  },
  cursorLabel: {
    position: 'absolute',
    top: -20,
    left: 0,
    fontSize: 10,
    color: '#FFFFFF',
    backgroundColor: 'inherit',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
    whiteSpace: 'nowrap',
  },
  sidePanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: width * 0.4,
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  commentsPanel: {},
  resourcesPanel: {},
  sidePanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sidePanelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  commentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  commentTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  commentContent: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  resolveButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#EEF2FF',
    borderRadius: 4,
  },
  resolveButtonText: {
    fontSize: 11,
    color: '#6366F1',
    fontWeight: '500',
  },
  resourcesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  resourceIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  resourceType: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});

export default CollaborativeAssignmentWorkspace;
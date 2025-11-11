/**
 * Enhanced Interactive Classroom Screen
 * Phase 77: Advanced Real-Time Collaboration & Communication Suite
 * Builds upon existing live class features with real-time collaboration
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  BackHandler,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Appbar, Portal, Snackbar } from 'react-native-paper';
import { realTimeCollaborationService, CollaborationSession, RealTimeMessage } from '../../services/collaboration/RealTimeCollaborationService';
import { logger } from '../../services/utils/logger';

const { width, height } = Dimensions.get('window');

interface EnhancedInteractiveClassroomProps {
  classId?: string;
  studentId?: string;
  studentName?: string;
  onNavigate?: (screen: string) => void;
}

interface ClassParticipant {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  status: 'active' | 'idle' | 'away';
  avatar?: string;
  hasVideo: boolean;
  hasAudio: boolean;
  isHandRaised: boolean;
}

interface InteractiveFeature {
  id: string;
  type: 'poll' | 'quiz' | 'whiteboard' | 'breakout' | 'document';
  title: string;
  active: boolean;
  participants: number;
}

const EnhancedInteractiveClassroomScreen: React.FC<EnhancedInteractiveClassroomProps> = ({
  classId = 'class_001',
  studentId = 'student_123',
  studentName = 'Alex Johnson',
  onNavigate,
}) => {
  const [collaborationSession, setCollaborationSession] = useState<CollaborationSession | null>(null);
  const [messages, setMessages] = useState<RealTimeMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<ClassParticipant[]>([
    {
      id: 'teacher_001',
      name: 'Dr. Sarah Wilson',
      role: 'teacher',
      status: 'active',
      hasVideo: true,
      hasAudio: true,
      isHandRaised: false,
    },
    {
      id: 'student_123',
      name: studentName,
      role: 'student',
      status: 'active',
      hasVideo: false,
      hasAudio: true,
      isHandRaised: false,
    },
  ]);

  const [activeFeatures, setActiveFeatures] = useState<InteractiveFeature[]>([
    {
      id: 'whiteboard_001',
      type: 'whiteboard',
      title: 'Collaborative Whiteboard',
      active: true,
      participants: 15,
    },
    {
      id: 'poll_001',
      type: 'poll',
      title: 'Quick Understanding Check',
      active: false,
      participants: 0,
    },
  ]);

  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [myVideoEnabled, setMyVideoEnabled] = useState(false);
  const [myAudioEnabled, setMyAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const chatAnimation = useRef(new Animated.Value(0)).current;
  const participantsAnimation = useRef(new Animated.Value(0)).current;
  const featuresAnimation = useRef(new Animated.Value(0)).current;
  const handRaiseAnimation = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    initializeCollaborationSession();
    setupEventListeners();
    const backHandler = setupBackHandler();

    return () => {
      cleanupSession();
      backHandler.remove();
    };
  }, []);

  const initializeCollaborationSession = async () => {
    try {
      setLoading(true);

      // Try to join existing session or create new one
      const sessions = await realTimeCollaborationService.getActiveSessions();
      let session = sessions.find(s => s.metadata?.classId === classId);

      if (!session) {
        session = await realTimeCollaborationService.createSession(
          `Live Class: ${classId}`,
          'live_class',
          {
            max_participants: 100,
            enable_video: true,
            enable_voice: true,
            enable_screen_share: true,
            record_session: true,
          }
        );
      } else {
        session = await realTimeCollaborationService.joinSession(session.id);
      }

      setCollaborationSession(session);

      // Load recent messages
      const recentMessages = await realTimeCollaborationService.getSessionMessages(session.id);
      setMessages(recentMessages.reverse());

      logger.info('Interactive classroom session initialized');
    } catch (error) {
      logger.error('Failed to initialize collaboration session:', error);
      showSnackbar('Failed to join the interactive classroom. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }, []);

  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showChat || showParticipants || showFeatures) {
        // Close any open panels first
        if (showChat) toggleChat();
        if (showParticipants) toggleParticipants();
        if (showFeatures) toggleFeatures();
        return true;
      }
      onNavigate?.('student-dashboard');
      return true;
    });
    return backHandler;
  }, [showChat, showParticipants, showFeatures, onNavigate]);

  const setupEventListeners = () => {
    realTimeCollaborationService.addEventListener('message_received', handleNewMessage);
    realTimeCollaborationService.addEventListener('participant_joined', handleParticipantJoined);
    realTimeCollaborationService.addEventListener('participant_left', handleParticipantLeft);
    realTimeCollaborationService.addEventListener('screen_share_started', handleScreenShareStarted);
    realTimeCollaborationService.addEventListener('screen_share_stopped', handleScreenShareStopped);
  };

  const cleanupSession = async () => {
    try {
      if (collaborationSession) {
        await realTimeCollaborationService.leaveSession(collaborationSession.id);
      }
      realTimeCollaborationService.removeEventListener('message_received', handleNewMessage);
      realTimeCollaborationService.removeEventListener('participant_joined', handleParticipantJoined);
      realTimeCollaborationService.removeEventListener('participant_left', handleParticipantLeft);
      realTimeCollaborationService.removeEventListener('screen_share_started', handleScreenShareStarted);
      realTimeCollaborationService.removeEventListener('screen_share_stopped', handleScreenShareStopped);
    } catch (error) {
      logger.error('Error during session cleanup:', error);
    }
  };

  const handleNewMessage = useCallback((message: RealTimeMessage) => {
    setMessages(prev => [...prev, message]);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleParticipantJoined = useCallback((participant: any) => {
    setParticipants(prev => [
      ...prev.filter(p => p.id !== participant.user_id),
      {
        id: participant.user_id,
        name: participant.user_name,
        role: participant.user_role,
        status: 'active',
        hasVideo: false,
        hasAudio: true,
        isHandRaised: false,
      }
    ]);
  }, []);

  const handleParticipantLeft = useCallback((participant: any) => {
    setParticipants(prev => prev.filter(p => p.id !== participant.user_id));
  }, []);

  const handleScreenShareStarted = useCallback((screenShare: any) => {
    setIsScreenSharing(true);
    showSnackbar(`${screenShare.presenter_name} is now sharing their screen.`);
  }, [showSnackbar]);

  const handleScreenShareStopped = useCallback(() => {
    setIsScreenSharing(false);
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !collaborationSession) return;

    try {
      await realTimeCollaborationService.sendMessage(
        collaborationSession.id,
        newMessage.trim(),
        'text'
      );
      setNewMessage('');
    } catch (error) {
      logger.error('Failed to send message:', error);
      showSnackbar('Failed to send message. Please try again.');
    }
  };

  const toggleHandRaise = async () => {
    const newState = !isHandRaised;
    setIsHandRaised(newState);

    // Animate hand raise button
    Animated.sequence([
      Animated.scale(handRaiseAnimation, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.scale(handRaiseAnimation, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    // Send system message
    if (collaborationSession) {
      try {
        await realTimeCollaborationService.sendMessage(
          collaborationSession.id,
          newState ? `${studentName} raised their hand` : `${studentName} lowered their hand`,
          'system',
          { action: 'hand_raise', raised: newState }
        );
      } catch (error) {
        logger.error('Failed to send hand raise notification:', error);
      }
    }
  };

  const toggleVideo = () => {
    const newState = !myVideoEnabled;
    setMyVideoEnabled(newState);
    
    // Update participant list
    setParticipants(prev => 
      prev.map(p => 
        p.id === studentId ? { ...p, hasVideo: newState } : p
      )
    );
  };

  const toggleAudio = () => {
    const newState = !myAudioEnabled;
    setMyAudioEnabled(newState);
    
    // Update participant list
    setParticipants(prev => 
      prev.map(p => 
        p.id === studentId ? { ...p, hasAudio: newState } : p
      )
    );
  };

  const toggleChat = () => {
    const newState = !showChat;
    setShowChat(newState);
    
    Animated.timing(chatAnimation, {
      toValue: newState ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const toggleParticipants = () => {
    const newState = !showParticipants;
    setShowParticipants(newState);
    
    Animated.timing(participantsAnimation, {
      toValue: newState ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const toggleFeatures = () => {
    const newState = !showFeatures;
    setShowFeatures(newState);
    
    Animated.timing(featuresAnimation, {
      toValue: newState ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const joinInteractiveFeature = (feature: InteractiveFeature) => {
    setActiveFeatures(prev =>
      prev.map(f =>
        f.id === feature.id
          ? { ...f, active: true, participants: f.participants + 1 }
          : f
      )
    );
    showSnackbar(`You've joined the ${feature.title}!`);
  };

  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: '#6366F1' }}>
      <Appbar.BackAction onPress={() => onNavigate?.('student-dashboard')} />
      <Appbar.Content
        title="Interactive Classroom"
        subtitle={`${participants.length} participants`}
      />
    </Appbar.Header>
  );

  const renderParticipantItem = (participant: ClassParticipant) => (
    <View key={participant.id} style={styles.participantItem}>
      <View style={[styles.participantAvatar, { backgroundColor: participant.role === 'teacher' ? '#059669' : '#6366F1' }]}>
        <Text style={styles.participantAvatarText}>
          {participant.name.charAt(0)}
        </Text>
      </View>
      <View style={styles.participantInfo}>
        <Text style={styles.participantName}>{participant.name}</Text>
        <Text style={styles.participantRole}>
          {participant.role === 'teacher' ? '👩‍🏫 Teacher' : '👨‍🎓 Student'}
        </Text>
      </View>
      <View style={styles.participantControls}>
        <Icon
          name={participant.hasVideo ? 'videocam' : 'videocam-off'}
          size={16}
          color={participant.hasVideo ? '#059669' : '#9CA3AF'}
        />
        <Icon
          name={participant.hasAudio ? 'mic' : 'mic-off'}
          size={16}
          color={participant.hasAudio ? '#059669' : '#9CA3AF'}
          style={{ marginLeft: 8 }}
        />
        {participant.isHandRaised && (
          <Text style={styles.handRaisedIcon}>✋</Text>
        )}
      </View>
      <View style={[styles.statusIndicator, { backgroundColor: 
        participant.status === 'active' ? '#10B981' : 
        participant.status === 'idle' ? '#F59E0B' : '#EF4444'
      }]} />
    </View>
  );

  const renderMessageItem = (message: RealTimeMessage) => {
    const isSystem = message.type === 'system';
    const isMyMessage = message.sender_id === studentId;

    return (
      <View key={message.id} style={[
        styles.messageItem,
        isSystem && styles.systemMessage,
        isMyMessage && styles.myMessage
      ]}>
        {!isSystem && (
          <Text style={styles.messageSender}>{message.sender_name}</Text>
        )}
        <Text style={[
          styles.messageContent,
          isSystem && styles.systemMessageContent
        ]}>
          {message.content}
        </Text>
        <Text style={styles.messageTime}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  const renderFeatureItem = (feature: InteractiveFeature) => {
    const getFeatureIcon = () => {
      switch (feature.type) {
        case 'poll': return '📊';
        case 'quiz': return '❓';
        case 'whiteboard': return '📝';
        case 'breakout': return '👥';
        case 'document': return '📄';
        default: return '🔧';
      }
    };

    return (
      <TouchableOpacity
        key={feature.id}
        style={[styles.featureItem, feature.active && styles.activeFeature]}
        onPress={() => joinInteractiveFeature(feature)}
      >
        <Text style={styles.featureIcon}>{getFeatureIcon()}</Text>
        <View style={styles.featureInfo}>
          <Text style={styles.featureTitle}>{feature.title}</Text>
          <Text style={styles.featureParticipants}>
            {feature.participants} participants
          </Text>
        </View>
        <Icon
          name={feature.active ? 'check-circle' : 'play-arrow'}
          size={20}
          color={feature.active ? '#10B981' : '#6366F1'}
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
        {renderAppBar()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Joining Interactive Classroom...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
      {renderAppBar()}

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Video Area */}
        <View style={styles.videoArea}>
          {isScreenSharing ? (
            <View style={styles.screenShareView}>
              <Icon name="screen-share" size={48} color="#6366F1" />
              <Text style={styles.screenShareText}>Screen being shared</Text>
            </View>
          ) : (
            <View style={styles.videoGrid}>
              <View style={styles.mainVideo}>
                <Icon name="person" size={64} color="#FFFFFF" />
                <Text style={styles.videoLabel}>Dr. Sarah Wilson</Text>
              </View>
            </View>
          )}
        </View>

        {/* Control Bar */}
        <View style={styles.controlBar}>
          <TouchableOpacity
            style={[styles.controlButton, !myAudioEnabled && styles.controlButtonMuted]}
            onPress={toggleAudio}
          >
            <Icon 
              name={myAudioEnabled ? 'mic' : 'mic-off'} 
              size={20} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, !myVideoEnabled && styles.controlButtonMuted]}
            onPress={toggleVideo}
          >
            <Icon 
              name={myVideoEnabled ? 'videocam' : 'videocam-off'} 
              size={20} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: handRaiseAnimation }] }}>
            <TouchableOpacity
              style={[styles.controlButton, isHandRaised && styles.handRaisedButton]}
              onPress={toggleHandRaise}
            >
              <Icon 
                name="back-hand" 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={[styles.controlButton, styles.chatButton]}
            onPress={toggleChat}
          >
            <Icon name="chat" size={20} color="#FFFFFF" />
            {messages.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>{messages.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleParticipants}
          >
            <Icon name="people" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleFeatures}
          >
            <Icon name="extension" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Panel */}
      <Animated.View style={[
        styles.sidePanel,
        styles.chatPanel,
        {
          transform: [{
            translateX: chatAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [width, 0],
            }),
          }],
        },
      ]}>
        <View style={styles.sidePanelHeader}>
          <Text style={styles.sidePanelTitle}>Live Chat</Text>
          <TouchableOpacity onPress={toggleChat}>
            <Icon name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessageItem)}
        </ScrollView>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.messageInput}
        >
          <TextInput
            style={styles.messageTextInput}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            onPress={sendMessage}
            style={styles.sendButton}
            disabled={!newMessage.trim()}
          >
            <Icon name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Animated.View>

      {/* Participants Panel */}
      <Animated.View style={[
        styles.sidePanel,
        styles.participantsPanel,
        {
          transform: [{
            translateX: participantsAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [width, 0],
            }),
          }],
        },
      ]}>
        <View style={styles.sidePanelHeader}>
          <Text style={styles.sidePanelTitle}>Participants</Text>
          <TouchableOpacity onPress={toggleParticipants}>
            <Icon name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.participantsList}>
          {participants.map(renderParticipantItem)}
        </ScrollView>
      </Animated.View>

      {/* Features Panel */}
      <Animated.View style={[
        styles.sidePanel,
        styles.featuresPanel,
        {
          transform: [{
            translateX: featuresAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [width, 0],
            }),
          }],
        },
      ]}>
        <View style={styles.sidePanelHeader}>
          <Text style={styles.sidePanelTitle}>Interactive Features</Text>
          <TouchableOpacity onPress={toggleFeatures}>
            <Icon name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.featuresList}>
          {activeFeatures.map(renderFeatureItem)}
        </ScrollView>
      </Animated.View>

      {/* Snackbar for notifications */}
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
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  mainContent: {
    flex: 1,
  },
  videoArea: {
    flex: 1,
    backgroundColor: '#1F2937',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  screenShareView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenShareText: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  videoGrid: {
    flex: 1,
    padding: 16,
  },
  mainVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  videoLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 8,
    gap: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  controlButtonMuted: {
    backgroundColor: '#EF4444',
  },
  handRaisedButton: {
    backgroundColor: '#F59E0B',
  },
  chatButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sidePanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: width * 0.85,
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  chatPanel: {},
  participantsPanel: {},
  featuresPanel: {},
  sidePanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sidePanelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageItem: {
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#E0E7FF',
    alignSelf: 'flex-end',
  },
  systemMessage: {
    backgroundColor: '#FEF3C7',
    alignSelf: 'center',
    maxWidth: '100%',
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  messageContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  systemMessageContent: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  messageTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  messageTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    position: 'relative',
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  participantAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  participantRole: {
    fontSize: 12,
    color: '#6B7280',
  },
  participantControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  handRaisedIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  statusIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  featuresList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFeature: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  featureParticipants: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default EnhancedInteractiveClassroomScreen;
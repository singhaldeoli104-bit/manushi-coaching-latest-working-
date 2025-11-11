/**
 * StudentLiveClassScreen - Phase 44.1: Enhanced Live Class Participation Tools
 * Advanced student interface with real-time analytics, smart notifications, and enhanced collaboration
 * Enhanced Phase 44.1 features: Engagement analytics, audio/video controls, smart reactions, recording features
 * Base Phase 28.1 features: Virtual hand raising, polling, Q&A, whiteboard collaboration, breakout rooms
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  TextInput,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { Appbar, Portal, Snackbar } from 'react-native-paper';

// Import existing design system
import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import * as LiveClassService from '../../services/liveClassService';

const { width, height } = Dimensions.get('window');

// Props interface for navigation integration
interface StudentLiveClassScreenProps {
  classId: string;
  studentName?: string;
  onNavigate: (screen: string) => void;
}

// Live class data structures
interface LiveClassInfo {
  id: string;
  subject: string;
  teacher: {
    name: string;
    avatar: string;
  };
  startTime: string;
  duration: string;
  participantCount: number;
  status: 'joining' | 'live' | 'ended';
}

interface HandRaiseRequest {
  id: string;
  timestamp: string;
  reason?: string;
  status: 'pending' | 'acknowledged' | 'declined';
}

interface LivePoll {
  id: string;
  question: string;
  options: string[];
  timeRemaining: number;
  hasVoted: boolean;
  selectedOption?: number;
}

interface QAMessage {
  id: string;
  studentName: string;
  question: string;
  timestamp: string;
  isAnswered: boolean;
  answer?: string;
  teacherName?: string;
  upvotes: number;
  hasUpvoted: boolean;
}

interface BreakoutRoom {
  id: string;
  name: string;
  participantCount: number;
  maxParticipants: number;
  topic: string;
  timeRemaining: number;
  isAssigned: boolean;
}

// Phase 44.1: Enhanced Live Class interfaces
interface EngagementMetrics {
  attentionScore: number; // 0-100
  participationRate: number; // 0-100
  handRaiseCount: number;
  questionsAsked: number;
  pollsParticipated: number;
  whiteboardInteractions: number;
  totalSessionTime: number;
  averageResponseTime: number; // in seconds
}

interface SmartNotification {
  id: string;
  type: 'suggestion' | 'reminder' | 'achievement' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired?: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface MediaControls {
  isMicOn: boolean;
  isCameraOn: boolean;
  isScreenSharing: boolean;
  audioLevel: number; // 0-100
  videoQuality: 'low' | 'medium' | 'high' | 'auto';
  networkStrength: number; // 0-100
}

interface ReactionEmoji {
  id: string;
  emoji: string;
  label: string;
  count: number;
  hasReacted: boolean;
  timestamp?: string;
}

interface ClassRecording {
  isRecording: boolean;
  recordingStartTime?: string;
  recordingDuration: number;
  canRecord: boolean;
  recordingQuality: 'audio' | 'video' | 'screen';
}

interface ParticipationInsights {
  engagementTrend: 'increasing' | 'stable' | 'decreasing';
  comparisonToClass: 'above_average' | 'average' | 'below_average';
  suggestedActions: string[];
  strongAreas: string[];
  improvementAreas: string[];
}

interface AdvancedWhiteboardTool {
  type: 'pen' | 'marker' | 'eraser' | 'text' | 'shape' | 'pointer';
  color: string;
  size: number;
  isSelected: boolean;
}

export const StudentLiveClassScreen: React.FC<StudentLiveClassScreenProps> = ({
  classId,
  studentName = 'Alex Johnson',
  onNavigate,
}) => {
  const { user } = useAuth();

  // Live class state
  const [classInfo, setClassInfo] = useState<LiveClassInfo>({
    id: classId,
    subject: 'Advanced Mathematics - Calculus',
    teacher: {
      name: 'Dr. Sarah Johnson',
      avatar: '👩‍🏫',
    },
    startTime: '10:00 AM',
    duration: '90 min',
    participantCount: 28,
    status: 'live',
  });

  // Participation features state
  const [currentTab, setCurrentTab] = useState<'class' | 'qa' | 'poll' | 'whiteboard' | 'breakout'>('class');
  const [handRaised, setHandRaised] = useState<HandRaiseRequest | null>(null);
  const [showHandRaiseModal, setShowHandRaiseModal] = useState(false);
  const [handRaiseReason, setHandRaiseReason] = useState('');
  
  // Polling state
  const [activePoll, setActivePoll] = useState<LivePoll | null>(null);
  const [pollHistory, setPollHistory] = useState<LivePoll[]>([]);
  
  // Q&A state
  const [qaMessages, setQaMessages] = useState<QAMessage[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [showQAModal, setShowQAModal] = useState(false);
  
  // Breakout room state
  const [breakoutRooms, setBreakoutRooms] = useState<BreakoutRoom[]>([]);
  const [currentBreakoutRoom, setCurrentBreakoutRoom] = useState<BreakoutRoom | null>(null);
  
  // General state
  const [classTimer, setClassTimer] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connected');

  // Phase 44.1: Enhanced live class state
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics>({
    attentionScore: 85,
    participationRate: 78,
    handRaiseCount: 0,
    questionsAsked: 0,
    pollsParticipated: 0,
    whiteboardInteractions: 0,
    totalSessionTime: 0,
    averageResponseTime: 15,
  });

  const [smartNotifications, setSmartNotifications] = useState<SmartNotification[]>([]);
  const [mediaControls, setMediaControls] = useState<MediaControls>({
    isMicOn: false,
    isCameraOn: false,
    isScreenSharing: false,
    audioLevel: 0,
    videoQuality: 'auto',
    networkStrength: 85,
  });

  const [reactionEmojis, setReactionEmojis] = useState<ReactionEmoji[]>([
    { id: '1', emoji: '👍', label: 'Like', count: 5, hasReacted: false },
    { id: '2', emoji: '❤️', label: 'Love', count: 2, hasReacted: false },
    { id: '3', emoji: '😊', label: 'Happy', count: 8, hasReacted: false },
    { id: '4', emoji: '🤔', label: 'Thinking', count: 3, hasReacted: false },
    { id: '5', emoji: '👏', label: 'Clap', count: 12, hasReacted: false },
    { id: '6', emoji: '🙋', label: 'Question', count: 1, hasReacted: false },
  ]);

  const [classRecording, setClassRecording] = useState<ClassRecording>({
    isRecording: false,
    recordingDuration: 0,
    canRecord: true,
    recordingQuality: 'video',
  });

  const [participationInsights, setParticipationInsights] = useState<ParticipationInsights>({
    engagementTrend: 'increasing',
    comparisonToClass: 'above_average',
    suggestedActions: [
      'Continue your excellent participation!',
      'Try asking more clarifying questions',
      'Share your screen to explain your approach',
    ],
    strongAreas: ['Active listening', 'Quick responses', 'Helpful questions'],
    improvementAreas: ['Whiteboard collaboration', 'Peer interaction'],
  });

  const [whiteboardTools, setWhiteboardTools] = useState<AdvancedWhiteboardTool[]>([
    { type: 'pen', color: '#000000', size: 2, isSelected: true },
    { type: 'marker', color: '#FF0000', size: 5, isSelected: false },
    { type: 'eraser', color: '#FFFFFF', size: 10, isSelected: false },
    { type: 'text', color: '#000000', size: 14, isSelected: false },
    { type: 'shape', color: '#0000FF', size: 2, isSelected: false },
    { type: 'pointer', color: '#FF0000', size: 1, isSelected: false },
  ]);

  const [showEngagementModal, setShowEngagementModal] = useState(false);
  const [showMediaControlsModal, setShowMediaControlsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);

  // Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    initializeLiveClass();
    setupClassTimer();
    setupMockData();
    setupEngagementTracking(); // Phase 44.1
    setupSmartNotifications(); // Phase 44.1
    setupBackHandler();

    return cleanup;
  }, []);

  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onNavigate('back');
      return true;
    });
    return backHandler.remove;
  }, [onNavigate]);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const initializeLiveClass = useCallback(async () => {
    try {
      // Initialize WebRTC connection, join class room, etc.
      setConnectionStatus('connecting');
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('disconnected');
      Alert.alert('Connection Error', 'Failed to join live class. Please check your internet connection.');
    }
  }, []);

  const setupClassTimer = useCallback(() => {
    const interval = setInterval(() => {
      setClassTimer(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const setupMockData = useCallback(() => {
    // Mock Q&A messages
    const mockQA: QAMessage[] = [
      {
        id: '1',
        studentName: 'Sarah M.',
        question: 'Can you explain the chain rule application in this problem?',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        isAnswered: true,
        answer: 'Great question! The chain rule applies when you have a composite function...',
        teacherName: 'Dr. Sarah Johnson',
        upvotes: 5,
        hasUpvoted: false,
      },
      {
        id: '2',
        studentName: 'Mike R.',
        question: 'What is the difference between definite and indefinite integrals?',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        isAnswered: false,
        upvotes: 3,
        hasUpvoted: true,
      },
    ];

    // Mock breakout rooms
    const mockBreakoutRooms: BreakoutRoom[] = [
      {
        id: '1',
        name: 'Group A - Integration Techniques',
        participantCount: 6,
        maxParticipants: 8,
        topic: 'Integration by Parts Practice',
        timeRemaining: 900, // 15 minutes
        isAssigned: false,
      },
      {
        id: '2',
        name: 'Group B - Differentiation Review',
        participantCount: 7,
        maxParticipants: 8,
        topic: 'Chain Rule Applications',
        timeRemaining: 900,
        isAssigned: true,
      },
      {
        id: '3',
        name: 'Group C - Problem Solving',
        participantCount: 5,
        maxParticipants: 8,
        topic: 'Mixed Practice Problems',
        timeRemaining: 900,
        isAssigned: false,
      },
    ];

    setQaMessages(mockQA);
    setBreakoutRooms(mockBreakoutRooms);
  }, []);

  const cleanup = useCallback(() => {
    // Cleanup WebRTC connections, timers, etc.
  }, []);

  // Phase 44.1: Enhanced engagement tracking
  const setupEngagementTracking = useCallback(() => {
    const interval = setInterval(() => {
      setEngagementMetrics(prev => ({
        ...prev,
        totalSessionTime: prev.totalSessionTime + 1,
        attentionScore: Math.max(60, Math.min(100, prev.attentionScore + (Math.random() - 0.5) * 5)),
        participationRate: Math.max(40, Math.min(100, prev.participationRate + (Math.random() - 0.5) * 3)),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Phase 44.1: Smart notification system
  const setupSmartNotifications = useCallback(() => {
    const notifications: SmartNotification[] = [
      {
        id: '1',
        type: 'suggestion',
        title: 'Great Engagement! 🎉',
        message: 'Your attention score is 85%! Keep up the excellent focus.',
        timestamp: new Date().toISOString(),
        isRead: false,
        priority: 'medium',
      },
      {
        id: '2',
        type: 'reminder',
        title: 'Poll Available',
        message: 'A new poll is active. Don\'t forget to participate!',
        timestamp: new Date(Date.now() + 30000).toISOString(),
        isRead: false,
        actionRequired: true,
        priority: 'high',
      },
    ];

    setTimeout(() => {
      setSmartNotifications(notifications);
    }, 5000);

    // Smart notification triggers
    const triggerInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 30 seconds
        const suggestions = [
          'Consider asking a clarifying question to boost engagement!',
          'Try using the whiteboard to share your thoughts.',
          'Your participation is above average - great job!',
          'Break time in 10 minutes - stay focused!',
        ];
        
        const newNotification: SmartNotification = {
          id: Date.now().toString(),
          type: 'suggestion',
          title: 'Smart Suggestion',
          message: suggestions[Math.floor(Math.random() * suggestions.length)],
          timestamp: new Date().toISOString(),
          isRead: false,
          priority: 'low',
        };

        setSmartNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
      }
    }, 30000);

    return () => clearInterval(triggerInterval);
  }, []);

  // Hand raising functionality - Enhanced Phase 44.1
  const handleRaiseHand = useCallback(async () => {
    if (handRaised) {
      // Lower hand
      setHandRaised(null);
      Alert.alert('Hand Lowered', 'Your hand has been lowered.');
      return;
    }

    const newHandRaise: HandRaiseRequest = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      reason: handRaiseReason.trim() || undefined,
      status: 'pending',
    };

    setHandRaised(newHandRaise);
    setShowHandRaiseModal(false);
    setHandRaiseReason('');
    
    // Phase 44.1: Update engagement metrics
    setEngagementMetrics(prev => ({
      ...prev,
      handRaiseCount: prev.handRaiseCount + 1,
      participationRate: Math.min(100, prev.participationRate + 5),
    }));
    
    Alert.alert('Hand Raised', 'Your hand has been raised. The teacher will acknowledge you shortly.');
  }, [handRaised, handRaiseReason]);

  // Poll participation - Enhanced Phase 44.1
  const handleVotePoll = useCallback((optionIndex: number) => {
    if (!activePoll || activePoll.hasVoted) return;

    const updatedPoll: LivePoll = {
      ...activePoll,
      hasVoted: true,
      selectedOption: optionIndex,
    };

    setActivePoll(updatedPoll);
    
    // Phase 44.1: Update engagement metrics
    setEngagementMetrics(prev => ({
      ...prev,
      pollsParticipated: prev.pollsParticipated + 1,
      participationRate: Math.min(100, prev.participationRate + 8),
    }));
    
    Alert.alert('Vote Submitted', 'Your vote has been recorded successfully!');
  }, [activePoll]);

  // Q&A functionality
  const handleSubmitQuestion = useCallback(async () => {
    if (!newQuestion.trim()) {
      Alert.alert('Validation', 'Please enter your question.');
      return;
    }

    const question: QAMessage = {
      id: Date.now().toString(),
      studentName: studentName,
      question: newQuestion.trim(),
      timestamp: new Date().toISOString(),
      isAnswered: false,
      upvotes: 0,
      hasUpvoted: false,
    };

    setQaMessages(prev => [question, ...prev]);
    setNewQuestion('');
    setShowQAModal(false);
    
    Alert.alert('Question Submitted', 'Your question has been submitted to the teacher.');
  }, [newQuestion, studentName]);

  const handleUpvoteQuestion = useCallback((questionId: string) => {
    setQaMessages(prev =>
      prev.map(msg =>
        msg.id === questionId
          ? {
              ...msg,
              upvotes: msg.hasUpvoted ? msg.upvotes - 1 : msg.upvotes + 1,
              hasUpvoted: !msg.hasUpvoted,
            }
          : msg
      )
    );
  }, []);

  // Breakout room functionality
  const handleJoinBreakoutRoom = useCallback((roomId: string) => {
    const room = breakoutRooms.find(r => r.id === roomId);
    if (!room) return;

    if (room.participantCount >= room.maxParticipants) {
      Alert.alert('Room Full', 'This breakout room is currently full. Please try another room.');
      return;
    }

    Alert.alert(
      'Join Breakout Room',
      `Join "${room.name}" for ${room.topic}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Join',
          onPress: () => {
            setCurrentBreakoutRoom(room);
            setBreakoutRooms(prev =>
              prev.map(r =>
                r.id === roomId
                  ? { ...r, participantCount: r.participantCount + 1, isAssigned: true }
                  : r
              )
            );
            Alert.alert('Joined', `You've joined ${room.name}`);
          },
        },
      ]
    );
  }, [breakoutRooms]);

  const handleLeaveBreakoutRoom = useCallback(() => {
    if (!currentBreakoutRoom) return;

    Alert.alert(
      'Leave Breakout Room',
      'Are you sure you want to return to the main class?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          onPress: () => {
            setBreakoutRooms(prev =>
              prev.map(r =>
                r.id === currentBreakoutRoom.id
                  ? { ...r, participantCount: r.participantCount - 1, isAssigned: false }
                  : r
              )
            );
            setCurrentBreakoutRoom(null);
            Alert.alert('Returned', 'You have returned to the main class.');
          },
        },
      ]
    );
  }, [currentBreakoutRoom]);

  // Phase 44.1: New enhanced functions
  
  // Emoji reaction handling
  const handleEmojiReaction = useCallback((reactionId: string) => {
    setReactionEmojis(prev =>
      prev.map(emoji =>
        emoji.id === reactionId
          ? {
              ...emoji,
              count: emoji.hasReacted ? emoji.count - 1 : emoji.count + 1,
              hasReacted: !emoji.hasReacted,
              timestamp: !emoji.hasReacted ? new Date().toISOString() : undefined,
            }
          : emoji
      )
    );

    // Update engagement metrics
    setEngagementMetrics(prev => ({
      ...prev,
      participationRate: Math.min(100, prev.participationRate + 2),
    }));
  }, []);

  // Media controls handling
  const toggleMicrophone = useCallback(() => {
    setMediaControls(prev => ({
      ...prev,
      isMicOn: !prev.isMicOn,
    }));
  }, []);

  const toggleCamera = useCallback(() => {
    setMediaControls(prev => ({
      ...prev,
      isCameraOn: !prev.isCameraOn,
    }));
  }, []);

  const toggleScreenShare = useCallback(() => {
    setMediaControls(prev => ({
      ...prev,
      isScreenSharing: !prev.isScreenSharing,
    }));
  }, []);

  // Recording functionality
  const toggleRecording = useCallback(() => {
    if (!classRecording.canRecord) {
      Alert.alert('Recording Unavailable', 'Recording is not available for this session.');
      return;
    }

    setClassRecording(prev => ({
      ...prev,
      isRecording: !prev.isRecording,
      recordingStartTime: !prev.isRecording ? new Date().toISOString() : prev.recordingStartTime,
    }));

    Alert.alert(
      classRecording.isRecording ? 'Recording Stopped' : 'Recording Started',
      classRecording.isRecording ? 'Session recording has been stopped.' : 'Session recording has started.'
    );
  }, [classRecording.canRecord, classRecording.isRecording]);

  // Whiteboard tool selection
  const selectWhiteboardTool = useCallback((toolType: AdvancedWhiteboardTool['type']) => {
    setWhiteboardTools(prev =>
      prev.map(tool => ({
        ...tool,
        isSelected: tool.type === toolType,
      }))
    );

    // Update engagement metrics
    setEngagementMetrics(prev => ({
      ...prev,
      whiteboardInteractions: prev.whiteboardInteractions + 1,
      participationRate: Math.min(100, prev.participationRate + 3),
    }));
  }, []);

  // Notification management
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setSmartNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  const dismissNotification = useCallback((notificationId: string) => {
    setSmartNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  }, []);

  // Format timer display
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock poll data
  useEffect(() => {
    const mockPoll: LivePoll = {
      id: '1',
      question: 'Which integration technique should we use for ∫x²e^x dx?',
      options: ['Integration by Parts', 'Substitution', 'Partial Fractions', 'Direct Integration'],
      timeRemaining: 45,
      hasVoted: false,
    };

    setTimeout(() => {
      setActivePoll(mockPoll);
    }, 3000);

    // Countdown timer for poll
    const pollTimer = setInterval(() => {
      setActivePoll(prev => {
        if (!prev || prev.timeRemaining <= 0) return null;
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(pollTimer);
  }, []);

  // Render AppBar
  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: LightTheme.Primary }}>
      <Appbar.BackAction onPress={() => onNavigate('back')} color="#FFFFFF" />
      <Appbar.Content
        title="Live Class"
        titleStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
        subtitle={classInfo.subject}
        subtitleStyle={{ color: '#FFFFFF', opacity: 0.9 }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {classRecording.isRecording && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: Spacing.SM }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF0000', marginRight: 4 }} />
            <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '600' }}>REC</Text>
          </View>
        )}
        <Appbar.Action
          icon="bell"
          onPress={() => setShowNotificationsModal(true)}
          color="#FFFFFF"
        />
        <Appbar.Action
          icon="microphone"
          onPress={() => setShowMediaControlsModal(true)}
          color="#FFFFFF"
        />
      </View>
    </Appbar.Header>
  );

  // Render class information
  const renderClassInfo = () => (
    <View style={styles.tabContent}>
      <View style={styles.classInfoCard}>
        <View style={styles.classHeader}>
          <View style={styles.classStatus}>
            <View style={[styles.statusIndicator, { backgroundColor: classInfo.status === 'live' ? '#4CAF50' : '#FF9800' }]} />
            <Text style={styles.statusText}>
              {classInfo.status === 'live' ? 'LIVE' : classInfo.status.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.classTimer}>⏱️ {formatTimer(classTimer)}</Text>
        </View>
        
        <Text style={styles.classSubject}>{classInfo.subject}</Text>
        <Text style={styles.classTeacher}>{classInfo.teacher.avatar} {classInfo.teacher.name}</Text>
        
        <View style={styles.classDetails}>
          <Text style={styles.classDetail}>👥 {classInfo.participantCount} participants</Text>
          <Text style={styles.classDetail}>🕐 {classInfo.time}</Text>
          <Text style={styles.classDetail}>⏳ {classInfo.duration}</Text>
        </View>
      </View>

      {/* Connection Status */}
      <View style={styles.connectionCard}>
        <View style={styles.connectionHeader}>
          <Text style={styles.connectionTitle}>Connection Status</Text>
          <View style={[styles.connectionIndicator, { 
            backgroundColor: connectionStatus === 'connected' ? '#4CAF50' : 
                           connectionStatus === 'connecting' ? '#FF9800' : '#F44336'
          }]} />
        </View>
        <Text style={styles.connectionStatus}>
          {connectionStatus === 'connected' ? '✅ Connected to live class' :
           connectionStatus === 'connecting' ? '🔄 Connecting...' :
           '❌ Connection lost'}
        </Text>
      </View>

      {/* Quick Participation Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.quickActionButton, handRaised && styles.quickActionButtonActive]}
          onPress={() => setShowHandRaiseModal(true)}
        >
          <Text style={styles.quickActionIcon}>✋</Text>
          <Text style={styles.quickActionText}>
            {handRaised ? 'Hand Raised' : 'Raise Hand'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => setShowQAModal(true)}
        >
          <Text style={styles.quickActionIcon}>❓</Text>
          <Text style={styles.quickActionText}>Ask Question</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => setCurrentTab('whiteboard')}
        >
          <Text style={styles.quickActionIcon}>🖊️</Text>
          <Text style={styles.quickActionText}>Whiteboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render Q&A section
  const renderQASection = () => (
    <View style={styles.tabContent}>
      <View style={styles.qaHeader}>
        <Text style={styles.sectionTitle}>Questions & Answers</Text>
        <TouchableOpacity 
          style={styles.askQuestionButton}
          onPress={() => setShowQAModal(true)}
        >
          <Text style={styles.askQuestionButtonText}>+ Ask Question</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.qaList}>
        {qaMessages.map((message) => (
          <View key={message.id} style={[styles.qaCard, message.isAnswered && styles.qaCardAnswered]}>
            <View style={styles.qaMessageHeader}>
              <Text style={styles.qaStudentName}>{message.studentName}</Text>
              <Text style={styles.qaTimestamp}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </Text>
            </View>
            
            <Text style={styles.qaQuestion}>{message.question}</Text>
            
            {message.isAnswered && message.answer && (
              <View style={styles.qaAnswer}>
                <Text style={styles.qaAnswerLabel}>
                  {message.teacherName} answered:
                </Text>
                <Text style={styles.qaAnswerText}>{message.answer}</Text>
              </View>
            )}

            <View style={styles.qaActions}>
              <TouchableOpacity 
                style={styles.qaUpvote}
                onPress={() => handleUpvoteQuestion(message.id)}
              >
                <Text style={[styles.qaUpvoteIcon, message.hasUpvoted && styles.qaUpvoteIconActive]}>
                  👍
                </Text>
                <Text style={[styles.qaUpvoteCount, message.hasUpvoted && styles.qaUpvoteCountActive]}>
                  {message.upvotes}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // Render polling section
  const renderPollSection = () => (
    <View style={styles.tabContent}>
      {activePoll ? (
        <View style={styles.activePollCard}>
          <View style={styles.pollHeader}>
            <Text style={styles.pollTitle}>Live Poll</Text>
            <View style={styles.pollTimer}>
              <Text style={styles.pollTimerText}>⏱️ {activePoll.timeRemaining}s</Text>
            </View>
          </View>
          
          <Text style={styles.pollQuestion}>{activePoll.question}</Text>
          
          <View style={styles.pollOptions}>
            {activePoll.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.pollOption,
                  activePoll.selectedOption === index && styles.pollOptionSelected,
                  activePoll.hasVoted && styles.pollOptionDisabled,
                ]}
                onPress={() => handleVotePoll(index)}
                disabled={activePoll.hasVoted}
              >
                <Text style={[
                  styles.pollOptionText,
                  activePoll.selectedOption === index && styles.pollOptionTextSelected,
                ]}>
                  {String.fromCharCode(65 + index)}. {option}
                </Text>
                {activePoll.selectedOption === index && (
                  <Text style={styles.pollOptionCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {activePoll.hasVoted && (
            <View style={styles.pollVotedMessage}>
              <Text style={styles.pollVotedText}>✅ Your vote has been recorded!</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.noPollContainer}>
          <Text style={styles.noPollIcon}>📊</Text>
          <Text style={styles.noPollTitle}>No Active Poll</Text>
          <Text style={styles.noPollText}>
            Polls will appear here when the teacher creates them during the class.
          </Text>
        </View>
      )}

      {pollHistory.length > 0 && (
        <View style={styles.pollHistoryContainer}>
          <Text style={styles.sectionTitle}>Previous Polls</Text>
          {pollHistory.map((poll) => (
            <View key={poll.id} style={styles.pollHistoryCard}>
              <Text style={styles.pollHistoryQuestion}>{poll.question}</Text>
              <Text style={styles.pollHistoryResult}>
                Your answer: {poll.selectedOption !== undefined ? poll.options[poll.selectedOption] : 'No answer'}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  // Render whiteboard collaboration
  const renderWhiteboardSection = () => (
    <View style={styles.tabContent}>
      <View style={styles.whiteboardContainer}>
        <View style={styles.whiteboardHeader}>
          <Text style={styles.sectionTitle}>Collaborative Whiteboard</Text>
          <TouchableOpacity style={styles.whiteboardToolsButton}>
            <Text style={styles.whiteboardToolsText}>🖊️ Tools</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.whiteboardCanvas}>
          <Text style={styles.whiteboardPlaceholder}>
            📝 Interactive whiteboard area
          </Text>
          <Text style={styles.whiteboardInstructions}>
            Follow along with the teacher's annotations or request permission to draw.
          </Text>
          
          <TouchableOpacity style={styles.requestAnnotationButton}>
            <Text style={styles.requestAnnotationText}>✏️ Request Drawing Permission</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.whiteboardActions}>
          <TouchableOpacity style={styles.whiteboardActionButton}>
            <Text style={styles.whiteboardActionText}>📷 Snapshot</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whiteboardActionButton}>
            <Text style={styles.whiteboardActionText}>↩️ Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whiteboardActionButton}>
            <Text style={styles.whiteboardActionText}>🗑️ Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Render breakout rooms
  const renderBreakoutSection = () => (
    <View style={styles.tabContent}>
      {currentBreakoutRoom ? (
        <View style={styles.currentBreakoutCard}>
          <View style={styles.breakoutHeader}>
            <Text style={styles.breakoutTitle}>{currentBreakoutRoom.name}</Text>
            <TouchableOpacity 
              style={styles.leaveBreakoutButton}
              onPress={handleLeaveBreakoutRoom}
            >
              <Text style={styles.leaveBreakoutText}>Leave Room</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.breakoutTopic}>Topic: {currentBreakoutRoom.topic}</Text>
          <Text style={styles.breakoutParticipants}>
            👥 {currentBreakoutRoom.participantCount}/{currentBreakoutRoom.maxParticipants} participants
          </Text>
          <Text style={styles.breakoutTimer}>
            ⏱️ {Math.floor(currentBreakoutRoom.timeRemaining / 60)} minutes remaining
          </Text>
          
          <View style={styles.breakoutFeatures}>
            <TouchableOpacity style={styles.breakoutFeatureButton}>
              <Text style={styles.breakoutFeatureText}>🎤 Speak</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.breakoutFeatureButton}>
              <Text style={styles.breakoutFeatureText}>📝 Collaborate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.breakoutFeatureButton}>
              <Text style={styles.breakoutFeatureText}>📤 Share Screen</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.breakoutRoomsContainer}>
          <Text style={styles.sectionTitle}>Available Breakout Rooms</Text>
          
          {breakoutRooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={[styles.breakoutRoomCard, room.isAssigned && styles.breakoutRoomCardAssigned]}
              onPress={() => !room.isAssigned && handleJoinBreakoutRoom(room.id)}
              disabled={room.isAssigned}
            >
              <View style={styles.breakoutRoomHeader}>
                <Text style={styles.breakoutRoomName}>{room.name}</Text>
                <Text style={styles.breakoutRoomCount}>
                  {room.participantCount}/{room.maxParticipants}
                </Text>
              </View>
              
              <Text style={styles.breakoutRoomTopic}>{room.topic}</Text>
              <Text style={styles.breakoutRoomTime}>
                ⏱️ {Math.floor(room.timeRemaining / 60)} min remaining
              </Text>
              
              {room.isAssigned && (
                <View style={styles.assignedBadge}>
                  <Text style={styles.assignedBadgeText}>Currently Assigned</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  // Render hand raise modal
  const renderHandRaiseModal = () => (
    <Modal
      visible={showHandRaiseModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowHandRaiseModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Raise Your Hand</Text>
          
          <TextInput
            style={styles.reasonInput}
            placeholder="Optional: Why are you raising your hand?"
            multiline
            numberOfLines={3}
            value={handRaiseReason}
            onChangeText={setHandRaiseReason}
            textAlignVertical="top"
          />
          
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowHandRaiseModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={handleRaiseHand}
            >
              <Text style={styles.modalConfirmText}>Raise Hand</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Render Q&A modal
  const renderQAModal = () => (
    <Modal
      visible={showQAModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowQAModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Ask a Question</Text>
          
          <TextInput
            style={styles.questionInput}
            placeholder="Enter your question here..."
            multiline
            numberOfLines={4}
            value={newQuestion}
            onChangeText={setNewQuestion}
            textAlignVertical="top"
          />
          
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowQAModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={handleSubmitQuestion}
            >
              <Text style={styles.modalConfirmText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Phase 44.1: Enhanced Modal Components
  
  // Engagement Analytics Modal
  const renderEngagementModal = () => (
    <Modal
      visible={showEngagementModal}
      animationType="slide"
      onRequestClose={() => setShowEngagementModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowEngagementModal(false)}>
            <Text style={styles.modalCloseButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Engagement Analytics</Text>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.engagementMetricsCard}>
            <Text style={styles.engagementMetricsTitle}>Real-time Metrics</Text>
            
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{Math.round(engagementMetrics.attentionScore)}%</Text>
                <Text style={styles.metricLabel}>Attention Score</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{Math.round(engagementMetrics.participationRate)}%</Text>
                <Text style={styles.metricLabel}>Participation</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{engagementMetrics.handRaiseCount}</Text>
                <Text style={styles.metricLabel}>Hand Raises</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{engagementMetrics.questionsAsked}</Text>
                <Text style={styles.metricLabel}>Questions</Text>
              </View>
            </View>

            <View style={styles.insightsSection}>
              <Text style={styles.insightTitle}>📊 Your Performance</Text>
              <Text style={styles.insightText}>
                Engagement Trend: <Text style={[styles.trendText, {
                  color: participationInsights.engagementTrend === 'increasing' ? '#4CAF50' : 
                        participationInsights.engagementTrend === 'stable' ? '#FF9800' : '#F44336'
                }]}>{participationInsights.engagementTrend.toUpperCase()}</Text>
              </Text>
              <Text style={styles.insightText}>
                Class Comparison: <Text style={styles.comparisonText}>
                  {participationInsights.comparisonToClass.replace('_', ' ').toUpperCase()}
                </Text>
              </Text>

              <Text style={styles.insightTitle}>💪 Strong Areas</Text>
              {participationInsights.strongAreas.map((area, index) => (
                <Text key={index} style={styles.strongAreaText}>• {area}</Text>
              ))}

              <Text style={styles.insightTitle}>🎯 Growth Opportunities</Text>
              {participationInsights.improvementAreas.map((area, index) => (
                <Text key={index} style={styles.improvementText}>• {area}</Text>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  // Media Controls Modal
  const renderMediaControlsModal = () => (
    <Modal
      visible={showMediaControlsModal}
      animationType="slide"
      onRequestClose={() => setShowMediaControlsModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowMediaControlsModal(false)}>
            <Text style={styles.modalCloseButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Media Controls</Text>
        </View>

        <View style={styles.modalContent}>
          <View style={styles.mediaControlsCard}>
            <View style={styles.mediaControlRow}>
              <Text style={styles.mediaControlLabel}>🎤 Microphone</Text>
              <TouchableOpacity
                style={[styles.mediaToggle, mediaControls.isMicOn && styles.mediaToggleActive]}
                onPress={toggleMicrophone}
              >
                <Text style={styles.mediaToggleText}>
                  {mediaControls.isMicOn ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mediaControlRow}>
              <Text style={styles.mediaControlLabel}>📹 Camera</Text>
              <TouchableOpacity
                style={[styles.mediaToggle, mediaControls.isCameraOn && styles.mediaToggleActive]}
                onPress={toggleCamera}
              >
                <Text style={styles.mediaToggleText}>
                  {mediaControls.isCameraOn ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mediaControlRow}>
              <Text style={styles.mediaControlLabel}>📺 Screen Share</Text>
              <TouchableOpacity
                style={[styles.mediaToggle, mediaControls.isScreenSharing && styles.mediaToggleActive]}
                onPress={toggleScreenShare}
              >
                <Text style={styles.mediaToggleText}>
                  {mediaControls.isScreenSharing ? 'SHARING' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.networkStatus}>
              <Text style={styles.networkLabel}>📶 Network Strength</Text>
              <View style={styles.networkBar}>
                <View style={[styles.networkBarFill, { width: `${mediaControls.networkStrength}%` }]} />
              </View>
              <Text style={styles.networkValue}>{mediaControls.networkStrength}%</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  // Smart Notifications Modal
  const renderNotificationsModal = () => (
    <Modal
      visible={showNotificationsModal}
      animationType="slide"
      onRequestClose={() => setShowNotificationsModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowNotificationsModal(false)}>
            <Text style={styles.modalCloseButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Smart Notifications</Text>
        </View>

        <ScrollView style={styles.modalContent}>
          {smartNotifications.length > 0 ? (
            smartNotifications.map((notification) => (
              <View key={notification.id} style={[
                styles.notificationCard,
                !notification.isRead && styles.notificationCardUnread
              ]}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <View style={styles.notificationActions}>
                    {!notification.isRead && (
                      <TouchableOpacity
                        onPress={() => markNotificationAsRead(notification.id)}
                        style={styles.markReadButton}
                      >
                        <Text style={styles.markReadText}>✓</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => dismissNotification(notification.id)}
                      style={styles.dismissButton}
                    >
                      <Text style={styles.dismissText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.noNotifications}>
              <Text style={styles.noNotificationsIcon}>🔔</Text>
              <Text style={styles.noNotificationsText}>No notifications yet</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  // Recording Modal
  const renderRecordingModal = () => (
    <Modal
      visible={showRecordingModal}
      animationType="slide"
      onRequestClose={() => setShowRecordingModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowRecordingModal(false)}>
            <Text style={styles.modalCloseButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Class Recording</Text>
        </View>

        <View style={styles.modalContent}>
          <View style={styles.recordingCard}>
            <View style={styles.recordingStatus}>
              {classRecording.isRecording ? (
                <View style={styles.recordingActive}>
                  <View style={styles.recordingDotLarge} />
                  <Text style={styles.recordingStatusText}>Recording Active</Text>
                </View>
              ) : (
                <Text style={styles.recordingStatusText}>Recording Stopped</Text>
              )}
            </View>

            {classRecording.isRecording && (
              <Text style={styles.recordingDuration}>
                Duration: {formatTimer(classRecording.recordingDuration)}
              </Text>
            )}

            <View style={styles.recordingControls}>
              <TouchableOpacity
                style={[styles.recordingButton, !classRecording.canRecord && styles.recordingButtonDisabled]}
                onPress={toggleRecording}
                disabled={!classRecording.canRecord}
              >
                <Text style={styles.recordingButtonText}>
                  {classRecording.isRecording ? '⏹️ Stop Recording' : '⚫ Start Recording'}
                </Text>
              </TouchableOpacity>
            </View>

            {!classRecording.canRecord && (
              <Text style={styles.recordingDisabledText}>
                Recording is not available for this session
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  if (connectionStatus === 'connecting') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
        {renderAppBar()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={LightTheme.Primary} />
          <Text style={styles.loadingText}>Joining live class...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
      {renderAppBar()}

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          {[
            { key: 'class', label: 'Class Info', icon: '📚' },
            { key: 'qa', label: 'Q&A', icon: '❓' },
            { key: 'poll', label: 'Polls', icon: '📊' },
            { key: 'whiteboard', label: 'Board', icon: '🖊️' },
            { key: 'breakout', label: 'Rooms', icon: '👥' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, currentTab === tab.key && styles.activeTab]}
              onPress={() => setCurrentTab(tab.key as any)}
            >
              <Text style={[styles.tabIcon, currentTab === tab.key && styles.activeTabIcon]}>
                {tab.icon}
              </Text>
              <Text style={[styles.tabText, currentTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.content}>
          {currentTab === 'class' && renderClassInfo()}
          {currentTab === 'qa' && renderQASection()}
          {currentTab === 'poll' && renderPollSection()}
          {currentTab === 'whiteboard' && renderWhiteboardSection()}
          {currentTab === 'breakout' && renderBreakoutSection()}
        </View>

        {/* Phase 44.1: Enhanced Floating Controls */}
        
        {/* Engagement Score Display */}
        <TouchableOpacity 
          style={styles.engagementScoreFloat}
          onPress={() => setShowEngagementModal(true)}
        >
          <Text style={styles.engagementScoreText}>{Math.round(engagementMetrics.attentionScore)}%</Text>
          <Text style={styles.engagementLabel}>Focus</Text>
        </TouchableOpacity>

        {/* Emoji Reactions Bar */}
        <View style={styles.reactionBar}>
          {reactionEmojis.slice(0, 4).map((reaction) => (
            <TouchableOpacity
              key={reaction.id}
              style={[styles.reactionButton, reaction.hasReacted && styles.reactionButtonActive]}
              onPress={() => handleEmojiReaction(reaction.id)}
            >
              <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
              {reaction.count > 0 && (
                <Text style={styles.reactionCount}>{reaction.count}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Enhanced Floating Hand Raise Button */}
        {currentTab !== 'class' && (
          <TouchableOpacity 
            style={[styles.floatingHandButton, handRaised && styles.floatingHandButtonActive]}
            onPress={() => setShowHandRaiseModal(true)}
          >
            <Text style={styles.floatingHandIcon}>✋</Text>
          </TouchableOpacity>
        )}

        {/* Recording Control Button */}
        {classRecording.canRecord && (
          <TouchableOpacity
            style={[styles.floatingRecordButton, classRecording.isRecording && styles.floatingRecordButtonActive]}
            onPress={toggleRecording}
          >
            <Text style={styles.floatingRecordIcon}>⚫</Text>
          </TouchableOpacity>
        )}

        {renderHandRaiseModal()}
        {renderQAModal()}
        {renderEngagementModal()}
        {renderMediaControlsModal()}
        {renderNotificationsModal()}
        {renderRecordingModal()}

        <Portal>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={4000}
            action={{
              label: 'Close',
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
    gap: 16,
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
    elevation: 4,
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
  helpButton: {
    padding: Spacing.SM,
  },
  helpButtonText: {
    fontSize: 20,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: LightTheme.Surface,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.OutlineVariant,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.MD,
    paddingHorizontal: Spacing.SM,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: LightTheme.Primary,
    backgroundColor: LightTheme.PrimaryContainer,
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: Spacing.XS,
  },
  activeTabIcon: {
    fontSize: 16,
  },
  tabText: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  activeTabText: {
    color: LightTheme.Primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: Spacing.LG,
  },
  
  // Class Info Styles
  classInfoCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.LG,
    marginBottom: Spacing.MD,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.MD,
  },
  classStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.SM,
  },
  statusText: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
  },
  classTimer: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.Primary,
    fontWeight: '600',
  },
  classSubject: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.SM,
  },
  classTeacher: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.MD,
  },
  classDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.SM,
  },
  classDetail: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  connectionCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.LG,
    marginBottom: Spacing.MD,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  connectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  connectionTitle: {
    fontSize: Typography.titleSmall.fontSize,
    fontFamily: Typography.titleSmall.fontFamily,
    fontWeight: Typography.titleSmall.fontWeight,
    color: LightTheme.OnSurface,
  },
  connectionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  connectionStatus: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: Spacing.SM,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: LightTheme.PrimaryContainer,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  quickActionButtonActive: {
    backgroundColor: LightTheme.Primary,
  },
  quickActionIcon: {
    fontSize: 20,
    marginBottom: Spacing.XS,
  },
  quickActionText: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    color: LightTheme.OnPrimaryContainer,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Q&A Styles
  qaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.LG,
  },
  sectionTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
  },
  askQuestionButton: {
    backgroundColor: LightTheme.Primary,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderRadius: BorderRadius.SM,
  },
  askQuestionButtonText: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    color: LightTheme.OnPrimary,
    fontWeight: '600',
  },
  qaList: {
    flex: 1,
  },
  qaCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    marginBottom: Spacing.SM,
    borderLeftWidth: 3,
    borderLeftColor: LightTheme.OutlineVariant,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  qaCardAnswered: {
    borderLeftColor: LightTheme.Primary,
    backgroundColor: LightTheme.PrimaryContainer,
  },
  qaMessageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  qaStudentName: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
  },
  qaTimestamp: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  qaQuestion: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    color: LightTheme.OnSurface,
    lineHeight: Typography.bodyLarge.lineHeight * 1.4,
    marginBottom: Spacing.MD,
  },
  qaAnswer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    marginBottom: Spacing.SM,
  },
  qaAnswerLabel: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    fontWeight: '600',
    color: LightTheme.Primary,
    marginBottom: Spacing.XS,
  },
  qaAnswerText: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurface,
    lineHeight: Typography.bodyMedium.lineHeight * 1.4,
  },
  qaActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qaUpvote: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.SM,
    paddingVertical: Spacing.XS,
    borderRadius: BorderRadius.XS,
  },
  qaUpvoteIcon: {
    fontSize: 16,
    marginRight: Spacing.XS,
  },
  qaUpvoteIconActive: {
    opacity: 1,
  },
  qaUpvoteCount: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  qaUpvoteCountActive: {
    color: LightTheme.Primary,
    fontWeight: '600',
  },

  // Poll Styles
  activePollCard: {
    backgroundColor: LightTheme.PrimaryContainer,
    borderRadius: BorderRadius.MD,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
  },
  pollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.MD,
  },
  pollTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnPrimaryContainer,
  },
  pollTimer: {
    backgroundColor: LightTheme.Primary,
    paddingHorizontal: Spacing.SM,
    paddingVertical: Spacing.XS,
    borderRadius: BorderRadius.SM,
  },
  pollTimerText: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    color: LightTheme.OnPrimary,
    fontWeight: '600',
  },
  pollQuestion: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    color: LightTheme.OnPrimaryContainer,
    marginBottom: Spacing.LG,
    lineHeight: Typography.bodyLarge.lineHeight * 1.4,
  },
  pollOptions: {
    gap: Spacing.SM,
  },
  pollOption: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    borderWidth: 2,
    borderColor: LightTheme.Outline,
  },
  pollOptionSelected: {
    borderColor: LightTheme.Primary,
    backgroundColor: LightTheme.Primary,
  },
  pollOptionDisabled: {
    opacity: 0.7,
  },
  pollOptionText: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurface,
  },
  pollOptionTextSelected: {
    color: LightTheme.OnPrimary,
    fontWeight: '600',
  },
  pollOptionCheck: {
    position: 'absolute',
    right: Spacing.MD,
    top: '50%',
    fontSize: 18,
    color: LightTheme.OnPrimary,
  },
  pollVotedMessage: {
    marginTop: Spacing.MD,
    padding: Spacing.MD,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: BorderRadius.SM,
    alignItems: 'center',
  },
  pollVotedText: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: '#4CAF50',
    fontWeight: '600',
  },
  noPollContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.MD,
  },
  noPollIcon: {
    fontSize: 64,
    marginBottom: Spacing.MD,
  },
  noPollTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
  },
  noPollText: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
    lineHeight: Typography.bodyMedium.lineHeight * 1.4,
    paddingHorizontal: Spacing.LG,
  },
  pollHistoryContainer: {
    marginTop: Spacing.LG,
  },
  pollHistoryCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    marginBottom: Spacing.SM,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  pollHistoryQuestion: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.XS,
  },
  pollHistoryResult: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },

  // Whiteboard Styles
  whiteboardContainer: {
    flex: 1,
  },
  whiteboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.LG,
  },
  whiteboardToolsButton: {
    backgroundColor: LightTheme.SecondaryContainer,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderRadius: BorderRadius.SM,
  },
  whiteboardToolsText: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    color: LightTheme.OnSecondaryContainer,
    fontWeight: '600',
  },
  whiteboardCanvas: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.XL,
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: LightTheme.OutlineVariant,
    borderStyle: 'dashed',
    marginBottom: Spacing.LG,
  },
  whiteboardPlaceholder: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.SM,
  },
  whiteboardInstructions: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
    marginBottom: Spacing.LG,
  },
  requestAnnotationButton: {
    backgroundColor: LightTheme.Primary,
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
    borderRadius: BorderRadius.SM,
  },
  requestAnnotationText: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    color: LightTheme.OnPrimary,
    fontWeight: '600',
  },
  whiteboardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  whiteboardActionButton: {
    backgroundColor: LightTheme.SecondaryContainer,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderRadius: BorderRadius.SM,
  },
  whiteboardActionText: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    color: LightTheme.OnSecondaryContainer,
  },

  // Breakout Room Styles
  currentBreakoutCard: {
    backgroundColor: LightTheme.TertiaryContainer,
    borderRadius: BorderRadius.MD,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
  },
  breakoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.MD,
  },
  breakoutTitle: {
    flex: 1,
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnTertiaryContainer,
  },
  leaveBreakoutButton: {
    backgroundColor: LightTheme.ErrorContainer,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderRadius: BorderRadius.SM,
  },
  leaveBreakoutText: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    color: LightTheme.OnErrorContainer,
    fontWeight: '600',
  },
  breakoutTopic: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    color: LightTheme.OnTertiaryContainer,
    marginBottom: Spacing.SM,
  },
  breakoutParticipants: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnTertiaryContainer,
    marginBottom: Spacing.SM,
  },
  breakoutTimer: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnTertiaryContainer,
    marginBottom: Spacing.LG,
  },
  breakoutFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: Spacing.SM,
  },
  breakoutFeatureButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderRadius: BorderRadius.SM,
  },
  breakoutFeatureText: {
    fontSize: Typography.labelMedium.fontSize,
    fontFamily: Typography.labelMedium.fontFamily,
    color: LightTheme.OnTertiaryContainer,
    fontWeight: '600',
  },
  breakoutRoomsContainer: {
    flex: 1,
  },
  breakoutRoomCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    marginBottom: Spacing.SM,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  breakoutRoomCardAssigned: {
    backgroundColor: LightTheme.TertiaryContainer,
    borderWidth: 2,
    borderColor: LightTheme.Tertiary,
  },
  breakoutRoomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  breakoutRoomName: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
    flex: 1,
  },
  breakoutRoomCount: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.Primary,
    fontWeight: '600',
  },
  breakoutRoomTopic: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.SM,
  },
  breakoutRoomTime: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  assignedBadge: {
    backgroundColor: LightTheme.Tertiary,
    paddingHorizontal: Spacing.SM,
    paddingVertical: Spacing.XS,
    borderRadius: BorderRadius.SM,
    alignSelf: 'flex-start',
    marginTop: Spacing.SM,
  },
  assignedBadgeText: {
    fontSize: Typography.labelSmall.fontSize,
    fontFamily: Typography.labelSmall.fontFamily,
    color: LightTheme.OnTertiary,
    fontWeight: '600',
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
    padding: Spacing.LG,
    width: width * 0.9,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: Typography.titleLarge.fontSize,
    fontFamily: Typography.titleLarge.fontFamily,
    fontWeight: Typography.titleLarge.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.LG,
    textAlign: 'center',
  },
  reasonInput: {
    backgroundColor: LightTheme.Background,
    borderWidth: 1,
    borderColor: LightTheme.Outline,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurface,
    minHeight: 80,
    marginBottom: Spacing.LG,
  },
  questionInput: {
    backgroundColor: LightTheme.Background,
    borderWidth: 1,
    borderColor: LightTheme.Outline,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurface,
    minHeight: 100,
    marginBottom: Spacing.LG,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.MD,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: LightTheme.Surface,
    borderWidth: 1,
    borderColor: LightTheme.Outline,
    paddingVertical: Spacing.MD,
    borderRadius: BorderRadius.SM,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: Typography.labelLarge.fontSize,
    fontFamily: Typography.labelLarge.fontFamily,
    color: LightTheme.OnSurface,
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: LightTheme.Primary,
    paddingVertical: Spacing.MD,
    borderRadius: BorderRadius.SM,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: Typography.labelLarge.fontSize,
    fontFamily: Typography.labelLarge.fontFamily,
    fontWeight: Typography.labelLarge.fontWeight,
    color: LightTheme.OnPrimary,
  },

  // Floating Action Button
  floatingHandButton: {
    position: 'absolute',
    right: Spacing.LG,
    bottom: Spacing.XL,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: LightTheme.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  floatingHandButtonActive: {
    backgroundColor: '#4CAF50',
  },
  floatingHandIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },

  // Phase 44.1: Enhanced Header Styles
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.SM,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    borderRadius: BorderRadius.SM,
    paddingHorizontal: Spacing.SM,
    paddingVertical: Spacing.XS,
    marginTop: Spacing.XS,
  },
  recordingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: Spacing.XS,
  },
  recordingText: {
    fontSize: Typography.labelSmall.fontSize,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
    padding: Spacing.SM,
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  mediaButton: {
    padding: Spacing.SM,
  },
  mediaIcon: {
    fontSize: 20,
  },

  // Phase 44.1: Floating Controls Styles
  engagementScoreFloat: {
    position: 'absolute',
    top: 120,
    right: Spacing.MD,
    backgroundColor: LightTheme.Primary,
    borderRadius: BorderRadius.MD,
    paddingHorizontal: Spacing.SM,
    paddingVertical: Spacing.XS,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  engagementScoreText: {
    fontSize: Typography.labelLarge.fontSize,
    fontWeight: 'bold',
    color: LightTheme.OnPrimary,
  },
  engagementLabel: {
    fontSize: Typography.labelSmall.fontSize,
    color: LightTheme.OnPrimary,
  },
  reactionBar: {
    position: 'absolute',
    bottom: 120,
    left: Spacing.MD,
    right: Spacing.MD,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BorderRadius.LG,
    paddingVertical: Spacing.SM,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  reactionButton: {
    alignItems: 'center',
    paddingHorizontal: Spacing.XS,
  },
  reactionButtonActive: {
    backgroundColor: LightTheme.PrimaryContainer,
    borderRadius: BorderRadius.SM,
    paddingVertical: Spacing.XS,
  },
  reactionEmoji: {
    fontSize: 20,
  },
  reactionCount: {
    fontSize: Typography.labelSmall.fontSize,
    color: LightTheme.Primary,
    fontWeight: 'bold',
    marginTop: 2,
  },
  floatingRecordButton: {
    position: 'absolute',
    right: Spacing.LG,
    bottom: 200,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  floatingRecordButtonActive: {
    backgroundColor: '#CC0000',
  },
  floatingRecordIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },

  // Phase 44.1: Modal Styles
  engagementMetricsCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.LG,
    marginBottom: Spacing.MD,
  },
  engagementMetricsTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.MD,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.LG,
  },
  metricItem: {
    width: '48%',
    backgroundColor: LightTheme.PrimaryContainer,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    alignItems: 'center',
    marginBottom: Spacing.MD,
  },
  metricValue: {
    fontSize: Typography.titleLarge.fontSize,
    fontWeight: 'bold',
    color: LightTheme.Primary,
  },
  metricLabel: {
    fontSize: Typography.bodySmall.fontSize,
    color: LightTheme.OnPrimaryContainer,
    marginTop: Spacing.XS,
  },
  insightsSection: {
    borderTopWidth: 1,
    borderTopColor: LightTheme.OutlineVariant,
    paddingTop: Spacing.MD,
  },
  insightTitle: {
    fontSize: Typography.titleSmall.fontSize,
    fontWeight: Typography.titleSmall.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.SM,
    marginTop: Spacing.SM,
  },
  insightText: {
    fontSize: Typography.bodyMedium.fontSize,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.XS,
  },
  trendText: {
    fontWeight: 'bold',
  },
  comparisonText: {
    fontWeight: 'bold',
    color: LightTheme.Primary,
  },
  strongAreaText: {
    fontSize: Typography.bodyMedium.fontSize,
    color: '#4CAF50',
    marginBottom: Spacing.XS,
  },
  improvementText: {
    fontSize: Typography.bodyMedium.fontSize,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.XS,
  },
  mediaControlsCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.LG,
  },
  mediaControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.LG,
    paddingBottom: Spacing.MD,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.OutlineVariant,
  },
  mediaControlLabel: {
    fontSize: Typography.bodyMedium.fontSize,
    color: LightTheme.OnSurface,
  },
  mediaToggle: {
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: BorderRadius.SM,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
  },
  mediaToggleActive: {
    backgroundColor: LightTheme.Primary,
  },
  mediaToggleText: {
    fontSize: Typography.labelMedium.fontSize,
    color: LightTheme.OnSurfaceVariant,
    fontWeight: 'bold',
  },
  networkStatus: {
    marginTop: Spacing.MD,
  },
  networkLabel: {
    fontSize: Typography.bodyMedium.fontSize,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.SM,
  },
  networkBar: {
    height: 8,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 4,
    marginBottom: Spacing.SM,
  },
  networkBarFill: {
    height: '100%',
    backgroundColor: LightTheme.Primary,
    borderRadius: 4,
  },
  networkValue: {
    fontSize: Typography.bodySmall.fontSize,
    color: LightTheme.OnSurface,
    textAlign: 'right',
  },
  notificationCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    marginBottom: Spacing.SM,
    borderLeftWidth: 3,
    borderLeftColor: LightTheme.OutlineVariant,
  },
  notificationCardUnread: {
    borderLeftColor: LightTheme.Primary,
    backgroundColor: LightTheme.PrimaryContainer,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  notificationTitle: {
    fontSize: Typography.titleSmall.fontSize,
    fontWeight: Typography.titleSmall.fontWeight,
    color: LightTheme.OnSurface,
    flex: 1,
  },
  notificationActions: {
    flexDirection: 'row',
    gap: Spacing.SM,
  },
  markReadButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: LightTheme.Primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markReadText: {
    fontSize: 12,
    color: LightTheme.OnPrimary,
    fontWeight: 'bold',
  },
  dismissButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: LightTheme.ErrorContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: {
    fontSize: 12,
    color: LightTheme.OnErrorContainer,
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: Typography.bodyMedium.fontSize,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.SM,
    lineHeight: Typography.bodyMedium.lineHeight * 1.4,
  },
  notificationTime: {
    fontSize: Typography.bodySmall.fontSize,
    color: LightTheme.OnSurfaceVariant,
  },
  noNotifications: {
    alignItems: 'center',
    paddingVertical: Spacing.XL,
  },
  noNotificationsIcon: {
    fontSize: 48,
    marginBottom: Spacing.MD,
  },
  noNotificationsText: {
    fontSize: Typography.bodyMedium.fontSize,
    color: LightTheme.OnSurfaceVariant,
  },
  recordingCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    padding: Spacing.LG,
    alignItems: 'center',
  },
  recordingStatus: {
    marginBottom: Spacing.LG,
  },
  recordingActive: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingDotLarge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF0000',
    marginRight: Spacing.SM,
  },
  recordingStatusText: {
    fontSize: Typography.titleMedium.fontSize,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
  },
  recordingDuration: {
    fontSize: Typography.bodyLarge.fontSize,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.LG,
  },
  recordingControls: {
    width: '100%',
    marginBottom: Spacing.MD,
  },
  recordingButton: {
    backgroundColor: LightTheme.Primary,
    borderRadius: BorderRadius.SM,
    paddingVertical: Spacing.MD,
    alignItems: 'center',
  },
  recordingButtonDisabled: {
    backgroundColor: LightTheme.SurfaceVariant,
    opacity: 0.5,
  },
  recordingButtonText: {
    fontSize: Typography.labelLarge.fontSize,
    fontWeight: Typography.labelLarge.fontWeight,
    color: LightTheme.OnPrimary,
  },
  recordingDisabledText: {
    fontSize: Typography.bodySmall.fontSize,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
  },
});

export default StudentLiveClassScreen;
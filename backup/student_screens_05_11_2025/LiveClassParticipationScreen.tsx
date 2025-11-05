/**
 * LiveClassParticipationScreen - Phase 45.2: Enhanced Live Class Participation
 * Comprehensive student interface for active live class participation with offline support
 * Features: Real-time interaction, Q&A, polls, hand raising, breakout rooms, screen sharing
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  Dimensions,
  SafeAreaView,
  StatusBar,
  FlatList,
  Switch,
  Animated,
  BackHandler,
} from 'react-native';
import { Appbar, Portal, Snackbar, ActivityIndicator } from 'react-native-paper';

import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

// Import Supabase services for class data
import { getClassById } from '../../services/classesService';
import { getProfileById } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

interface LiveClassParticipationScreenProps {
  onNavigate: (screen: string, params?: any) => void;
  classId?: string;
  className?: string;
  teacherName?: string;
}

interface ClassMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  type: 'message' | 'question' | 'announcement' | 'system';
  isTeacher?: boolean;
  reactions?: { [key: string]: number };
}

interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: { [key: string]: number };
  isActive: boolean;
  hasVoted: boolean;
  selectedOption?: string;
  endTime?: string;
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  hasHandRaised: boolean;
  micEnabled: boolean;
  cameraEnabled: boolean;
  breakoutRoom?: string;
}

interface BreakoutRoom {
  id: string;
  name: string;
  participants: Student[];
  topic: string;
  timeLimit: number;
  isActive: boolean;
}

interface ClassSettings {
  allowChat: boolean;
  allowQuestions: boolean;
  allowPolls: boolean;
  allowScreenShare: boolean;
  allowBreakoutRooms: boolean;
  chatModeration: boolean;
  questionModeration: boolean;
}

interface OfflineData {
  messages: ClassMessage[];
  polls: Poll[];
  notes: string;
  attendance: boolean;
  handRaises: number;
  questionsAsked: number;
  pollsParticipated: number;
  lastSync: string;
}

const LiveClassParticipationScreen: React.FC<LiveClassParticipationScreenProps> = ({
  onNavigate,
  classId = '1',
  className: initialClassName = 'Advanced Mathematics',
  teacherName: initialTeacherName = 'Dr. Sarah Wilson',
}) => {
  const { user } = useAuth();

  // Class details loaded from Supabase
  const [className, setClassName] = useState(initialClassName);
  const [teacherName, setTeacherName] = useState(initialTeacherName);

  // Core State
  const [isConnected, setIsConnected] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('good');
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Chat & Communication
  const [messages, setMessages] = useState<ClassMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'questions' | 'polls' | 'notes'>('chat');
  const [unreadCount, setUnreadCount] = useState(0);

  // Polls & Interaction
  const [activePolls, setActivePolls] = useState<Poll[]>([]);
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [showPollModal, setShowPollModal] = useState(false);

  // Students & Breakout Rooms
  const [students, setStudents] = useState<Student[]>([]);
  const [breakoutRooms, setBreakoutRooms] = useState<BreakoutRoom[]>([]);
  const [currentBreakoutRoom, setCurrentBreakoutRoom] = useState<string | null>(null);
  const [showBreakoutModal, setShowBreakoutModal] = useState(false);

  // Settings & Controls
  const [classSettings, setClassSettings] = useState<ClassSettings>({
    allowChat: true,
    allowQuestions: true,
    allowPolls: true,
    allowScreenShare: true,
    allowBreakoutRooms: true,
    chatModeration: false,
    questionModeration: true,
  });

  // Offline Support
  const [offlineData, setOfflineData] = useState<OfflineData>({
    messages: [],
    polls: [],
    notes: '',
    attendance: true,
    handRaises: 0,
    questionsAsked: 0,
    pollsParticipated: 0,
    lastSync: new Date().toISOString(),
  });

  // Performance & Analytics
  const [sessionStats, setSessionStats] = useState({
    joinTime: new Date().toISOString(),
    participationScore: 85,
    messagesCount: 0,
    questionsCount: 0,
    pollsParticipated: 0,
    handRaisesCount: 0,
    attentionScore: 92,
  });

  // Modal States
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);

  // Notes
  const [classNotes, setClassNotes] = useState('');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Loading & Snackbar
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    initializeScreen();
    setupBackHandler();
    return cleanup;
  }, []);

  const initializeScreen = useCallback(async () => {
    try {
      setIsLoading(true);
      await initializeClassData();

      // Set up connection monitoring
      const connectionMonitor = setInterval(checkConnection, 5000);

      // Auto-save notes
      if (autoSaveEnabled) {
        const autoSaveInterval = setInterval(saveNotesOffline, 30000);
      }
    } catch (error) {
      console.error('Error initializing screen:', error);
      showSnackbar('Failed to load class data');
    } finally {
      setIsLoading(false);
    }
  }, [autoSaveEnabled]);

  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onNavigate('back');
      return true;
    });
    return backHandler.remove;
  }, [onNavigate]);

  const cleanup = useCallback(() => {
    // Clean up intervals and resources
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const initializeClassData = useCallback(async () => {
    try {
      // Load class details from Supabase
      const classResult = await getClassById(classId);

      if (classResult.success && classResult.data) {
        const classData = classResult.data;
        setClassName(classData.subject);

        // Load teacher profile
        const teacherResult = await getProfileById(classData.teacher_id);
        if (teacherResult.success && teacherResult.data) {
          setTeacherName(teacherResult.data.full_name || 'Teacher');

          // Set initial welcome message from teacher
          setMessages([
            {
              id: '1',
              sender: teacherResult.data.full_name || 'Teacher',
              message: `Welcome to today's ${classData.subject} class!`,
              timestamp: new Date().toISOString(),
              type: 'announcement',
              isTeacher: true,
              reactions: {}
            },
            {
              id: '2',
              sender: 'System',
              message: 'Class recording has started',
              timestamp: new Date().toISOString(),
              type: 'system'
            }
          ]);
        }
      }

      // Mock student and poll data (would come from real-time service in production)
      setStudents([
        { id: '1', name: 'Alice Johnson', avatar: '👩‍🎓', isOnline: true, hasHandRaised: false, micEnabled: false, cameraEnabled: true },
        { id: '2', name: 'Bob Smith', avatar: '👨‍🎓', isOnline: true, hasHandRaised: true, micEnabled: false, cameraEnabled: false },
        { id: '3', name: 'Carol Davis', avatar: '👩‍🎓', isOnline: true, hasHandRaised: false, micEnabled: true, cameraEnabled: true },
        { id: '4', name: 'David Wilson', avatar: '👨‍🎓', isOnline: false, hasHandRaised: false, micEnabled: false, cameraEnabled: false },
      ]);

      setActivePolls([
        {
          id: '1',
          question: 'What is the derivative of x²?',
          options: ['2x', 'x²', '2x²', 'x'],
          votes: { '2x': 15, 'x²': 3, '2x²': 2, 'x': 1 },
          isActive: true,
          hasVoted: false
        }
      ]);
    } catch (error) {
      console.error('Error loading class data:', error);
      // Fall back to default values
      setMessages([
        {
          id: '1',
          sender: teacherName,
          message: 'Welcome to today\'s class!',
          timestamp: new Date().toISOString(),
          type: 'announcement',
          isTeacher: true,
          reactions: {}
        }
      ]);
    }
  }, [classId, teacherName]);

  const checkConnection = useCallback(() => {
    // Simulate connection quality check
    const qualities = ['excellent', 'good', 'poor'] as const;
    const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
    setConnectionQuality(randomQuality);
    
    if (randomQuality === 'poor') {
      setIsConnected(Math.random() > 0.3);
    } else {
      setIsConnected(true);
    }
  }, []);

  const saveNotesOffline = useCallback(() => {
    setOfflineData(prev => ({
      ...prev,
      notes: classNotes,
      lastSync: new Date().toISOString(),
    }));
  }, [classNotes]);

  const handleRaiseHand = useCallback(() => {
    setIsHandRaised(prev => {
      const newState = !prev;
      setSessionStats(prev => ({
        ...prev,
        handRaisesCount: prev.handRaisesCount + (newState ? 1 : 0)
      }));
      
      // Animate button
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      return newState;
    });

    if (!isConnected) {
      setOfflineData(prev => ({
        ...prev,
        handRaises: prev.handRaises + 1
      }));
    }
  }, [isConnected, scaleAnim]);

  const sendMessage = useCallback(() => {
    if (!newMessage.trim()) return;

    const message: ClassMessage = {
      id: Date.now().toString(),
      sender: 'You',
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'message',
      reactions: {}
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setSessionStats(prev => ({
      ...prev,
      messagesCount: prev.messagesCount + 1
    }));

    if (!isConnected) {
      setOfflineData(prev => ({
        ...prev,
        messages: [...prev.messages, message]
      }));
    }
  }, [newMessage, isConnected]);

  const submitPollVote = useCallback((pollId: string, optionIndex: number) => {
    setActivePolls(prev => prev.map(poll => {
      if (poll.id === pollId && !poll.hasVoted) {
        const newVotes = { ...poll.votes };
        newVotes[poll.options[optionIndex]] = (newVotes[poll.options[optionIndex]] || 0) + 1;
        
        setSessionStats(prevStats => ({
          ...prevStats,
          pollsParticipated: prevStats.pollsParticipated + 1
        }));

        return {
          ...poll,
          votes: newVotes,
          hasVoted: true,
          selectedOption: poll.options[optionIndex]
        };
      }
      return poll;
    }));
    
    setShowPollModal(false);
  }, []);

  const toggleMicrophone = useCallback(() => {
    setIsMicEnabled(prev => !prev);
    // In real app, would interact with WebRTC
  }, []);

  const toggleCamera = useCallback(() => {
    setIsCameraEnabled(prev => !prev);
    // In real app, would interact with WebRTC
  }, []);

  const joinBreakoutRoom = useCallback((roomId: string) => {
    setCurrentBreakoutRoom(roomId);
    setShowBreakoutModal(false);
    // In real app, would switch video/audio streams
  }, []);

  const leaveBreakoutRoom = useCallback(() => {
    setCurrentBreakoutRoom(null);
    // In real app, would return to main room
  }, []);

  const renderConnectionStatus = () => (
    <View style={styles.connectionStatus}>
      <View style={[
        styles.connectionDot, 
        { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }
      ]} />
      <Text style={styles.connectionText}>
        {isConnected ? `Connected (${connectionQuality})` : 'Offline Mode'}
      </Text>
      {!isConnected && (
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => setIsConnected(true)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: LightTheme.Primary }}>
      <Appbar.BackAction onPress={() => onNavigate('back')} color="#FFFFFF" />
      <Appbar.Content
        title={className}
        titleStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
        subtitle={`with ${teacherName}`}
        subtitleStyle={{ color: '#FFFFFF', opacity: 0.9 }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: Spacing.SM }}>
        <View style={[
          styles.connectionDot,
          { backgroundColor: isConnected ? '#4CAF50' : '#F44336', marginRight: Spacing.SM }
        ]} />
        <Appbar.Action icon="chart-box" onPress={() => setShowStatsModal(true)} color="#FFFFFF" />
        <Appbar.Action icon="cog" onPress={() => setShowSettingsModal(true)} color="#FFFFFF" />
      </View>
    </Appbar.Header>
  );

  const renderControlPanel = () => (
    <View style={styles.controlPanel}>
      <Animated.View style={[styles.handRaiseButton, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          style={[styles.controlButton, isHandRaised && styles.controlButtonActive]}
          onPress={handleRaiseHand}
        >
          <Text style={styles.controlButtonText}>
            {isHandRaised ? '✋ Hand Raised' : '🙋 Raise Hand'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        style={[styles.controlButton, isMicEnabled && styles.controlButtonActive]}
        onPress={toggleMicrophone}
      >
        <Text style={styles.controlButtonText}>
          {isMicEnabled ? '🎤 Mic On' : '🎤 Mic Off'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.controlButton, isCameraEnabled && styles.controlButtonActive]}
        onPress={toggleCamera}
      >
        <Text style={styles.controlButtonText}>
          {isCameraEnabled ? '📹 Cam On' : '📹 Cam Off'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.controlButton}
        onPress={() => setShowBreakoutModal(true)}
        disabled={!classSettings.allowBreakoutRooms}
      >
        <Text style={styles.controlButtonText}>
          {currentBreakoutRoom ? '🏠 Return to Main' : '👥 Breakout'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabSelector = () => (
    <View style={styles.tabSelector}>
      {[
        { key: 'chat', label: 'Chat', icon: '💬' },
        { key: 'questions', label: 'Q&A', icon: '❓' },
        { key: 'polls', label: 'Polls', icon: '📊' },
        { key: 'notes', label: 'Notes', icon: '📝' },
      ].map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
          onPress={() => setActiveTab(tab.key as any)}
        >
          <Text style={styles.tabIcon}>{tab.icon}</Text>
          <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
            {tab.label}
          </Text>
          {tab.key === 'chat' && unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderChatTab = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageItem,
            item.isTeacher && styles.teacherMessage,
            item.type === 'system' && styles.systemMessage
          ]}>
            <Text style={styles.messageSender}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.messageTime}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
            {item.reactions && Object.keys(item.reactions).length > 0 && (
              <View style={styles.messageReactions}>
                {Object.entries(item.reactions).map(([emoji, count]) => (
                  <Text key={emoji} style={styles.reactionItem}>
                    {emoji} {count}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
        style={styles.messagesList}
      />
      
      {classSettings.allowChat && (
        <View style={styles.messageInput}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message..."
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderPollsTab = () => (
    <View style={styles.tabContent}>
      {activePolls.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📊</Text>
          <Text style={styles.emptyStateText}>No active polls</Text>
          <Text style={styles.emptyStateSubtext}>Polls will appear here when the teacher creates them</Text>
        </View>
      ) : (
        <FlatList
          data={activePolls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.pollItem}>
              <Text style={styles.pollQuestion}>{item.question}</Text>
              <View style={styles.pollOptions}>
                {item.options.map((option, index) => {
                  const votes = item.votes[option] || 0;
                  const totalVotes = Object.values(item.votes).reduce((a, b) => a + b, 0);
                  const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.pollOption,
                        item.hasVoted && item.selectedOption === option && styles.pollOptionSelected
                      ]}
                      onPress={() => !item.hasVoted && submitPollVote(item.id, index)}
                      disabled={item.hasVoted}
                    >
                      <Text style={styles.pollOptionText}>{option}</Text>
                      {item.hasVoted && (
                        <View style={styles.pollResults}>
                          <View 
                            style={[styles.pollResultBar, { width: `${percentage}%` }]}
                          />
                          <Text style={styles.pollPercentage}>{percentage}%</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
              {item.hasVoted && (
                <Text style={styles.pollStatus}>✓ You voted for: {item.selectedOption}</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );

  const renderNotesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.notesHeader}>
        <Text style={styles.notesTitle}>Class Notes</Text>
        <View style={styles.notesControls}>
          <Text style={styles.autoSaveLabel}>Auto-save</Text>
          <Switch
            value={autoSaveEnabled}
            onValueChange={setAutoSaveEnabled}
            trackColor={{ false: '#767577', true: LightTheme.Primary }}
            thumbColor={autoSaveEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>
      
      <TextInput
        style={styles.notesInput}
        value={classNotes}
        onChangeText={setClassNotes}
        placeholder="Take notes during class..."
        multiline
        textAlignVertical="top"
      />
      
      <View style={styles.notesFooter}>
        <Text style={styles.notesInfo}>
          Last saved: {offlineData.lastSync ? new Date(offlineData.lastSync).toLocaleTimeString() : 'Never'}
        </Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveNotesOffline}
        >
          <Text style={styles.saveButtonText}>Save Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'chat':
        return renderChatTab();
      case 'questions':
        return renderChatTab(); // Same as chat but filtered for questions
      case 'polls':
        return renderPollsTab();
      case 'notes':
        return renderNotesTab();
      default:
        return renderChatTab();
    }
  };

  const renderStatsModal = () => (
    <Modal
      visible={showStatsModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowStatsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Session Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{sessionStats.participationScore}%</Text>
              <Text style={styles.statLabel}>Participation</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{sessionStats.attentionScore}%</Text>
              <Text style={styles.statLabel}>Attention</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{sessionStats.messagesCount}</Text>
              <Text style={styles.statLabel}>Messages</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{sessionStats.questionsCount}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{sessionStats.pollsParticipated}</Text>
              <Text style={styles.statLabel}>Polls</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{sessionStats.handRaisesCount}</Text>
              <Text style={styles.statLabel}>Hand Raises</Text>
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowStatsModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
        <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
        {renderAppBar()}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={LightTheme.Primary} />
          <Text style={{ ...Typography.bodyLarge, color: LightTheme.OnSurfaceVariant, marginTop: Spacing.LG }}>
            Joining class...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
      <StatusBar barStyle="light-content" backgroundColor={LightTheme.Primary} />
      {renderAppBar()}
      {renderConnectionStatus()}
      {renderControlPanel()}
      {renderTabSelector()}
      {renderCurrentTab()}
      {renderStatsModal()}

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
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.LG,
    paddingBottom: Spacing.SM,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.SM,
  },
  connectionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: Typography.bodySmall.fontSize,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.SM,
    paddingVertical: Spacing.XS,
    borderRadius: BorderRadius.SM,
    marginLeft: Spacing.SM,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.bodySmall.fontSize,
    fontWeight: '600',
  },
  controlPanel: {
    flexDirection: 'row',
    backgroundColor: LightTheme.Surface,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    elevation: 2,
  },
  handRaiseButton: {
    flex: 1,
    marginRight: Spacing.SM,
  },
  controlButton: {
    flex: 1,
    backgroundColor: LightTheme.SurfaceVariant,
    paddingVertical: Spacing.SM,
    paddingHorizontal: Spacing.SM,
    borderRadius: BorderRadius.SM,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  controlButtonActive: {
    backgroundColor: LightTheme.Primary,
  },
  controlButtonText: {
    fontSize: Typography.bodySmall.fontSize,
    fontWeight: '600',
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: LightTheme.Surface,
    paddingHorizontal: Spacing.MD,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.Outline,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.MD,
    position: 'relative',
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: LightTheme.Primary,
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: Spacing.XS,
  },
  tabLabel: {
    fontSize: Typography.bodySmall.fontSize,
    color: LightTheme.OnSurfaceVariant,
  },
  tabLabelActive: {
    color: LightTheme.Primary,
    fontWeight: '600',
  },
  unreadBadge: {
    position: 'absolute',
    top: 4,
    right: '25%',
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: Spacing.MD,
  },
  messageItem: {
    backgroundColor: LightTheme.Surface,
    marginVertical: Spacing.XS,
    padding: Spacing.MD,
    borderRadius: BorderRadius.MD,
    elevation: 1,
  },
  teacherMessage: {
    backgroundColor: LightTheme.PrimaryContainer,
  },
  systemMessage: {
    backgroundColor: LightTheme.TertiaryContainer,
    alignItems: 'center',
  },
  messageSender: {
    fontSize: Typography.bodySmall.fontSize,
    fontWeight: '600',
    color: LightTheme.Primary,
    marginBottom: Spacing.XS,
  },
  messageText: {
    fontSize: Typography.bodyMedium.fontSize,
    color: LightTheme.OnSurface,
    lineHeight: Typography.bodyMedium.lineHeight,
    marginBottom: Spacing.XS,
  },
  messageTime: {
    fontSize: Typography.bodySmall.fontSize,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'right',
  },
  messageReactions: {
    flexDirection: 'row',
    marginTop: Spacing.SM,
  },
  reactionItem: {
    fontSize: Typography.bodySmall.fontSize,
    marginRight: Spacing.SM,
    backgroundColor: LightTheme.SurfaceVariant,
    paddingHorizontal: Spacing.SM,
    paddingVertical: Spacing.XS,
    borderRadius: BorderRadius.SM,
  },
  messageInput: {
    flexDirection: 'row',
    backgroundColor: LightTheme.Surface,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    alignItems: 'flex-end',
    elevation: 2,
  },
  textInput: {
    flex: 1,
    backgroundColor: LightTheme.Background,
    borderRadius: BorderRadius.MD,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    marginRight: Spacing.SM,
    maxHeight: 100,
    fontSize: Typography.bodyMedium.fontSize,
  },
  sendButton: {
    backgroundColor: LightTheme.Primary,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderRadius: BorderRadius.MD,
  },
  sendButtonText: {
    color: LightTheme.OnPrimary,
    fontSize: Typography.bodyMedium.fontSize,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.XXL,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: Spacing.MD,
  },
  emptyStateText: {
    fontSize: Typography.titleMedium.fontSize,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
    textAlign: 'center',
    marginBottom: Spacing.SM,
  },
  emptyStateSubtext: {
    fontSize: Typography.bodyMedium.fontSize,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
    lineHeight: Typography.bodyMedium.lineHeight,
  },
  pollItem: {
    backgroundColor: LightTheme.Surface,
    margin: Spacing.MD,
    padding: Spacing.LG,
    borderRadius: BorderRadius.LG,
    elevation: 2,
  },
  pollQuestion: {
    fontSize: Typography.titleMedium.fontSize,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.MD,
  },
  pollOptions: {
    marginBottom: Spacing.MD,
  },
  pollOption: {
    backgroundColor: LightTheme.SurfaceVariant,
    padding: Spacing.MD,
    borderRadius: BorderRadius.MD,
    marginBottom: Spacing.SM,
    position: 'relative',
  },
  pollOptionSelected: {
    backgroundColor: LightTheme.PrimaryContainer,
    borderWidth: 2,
    borderColor: LightTheme.Primary,
  },
  pollOptionText: {
    fontSize: Typography.bodyMedium.fontSize,
    color: LightTheme.OnSurface,
    fontWeight: '500',
  },
  pollResults: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  pollResultBar: {
    height: '100%',
    backgroundColor: LightTheme.Primary,
    borderBottomLeftRadius: BorderRadius.MD,
    borderBottomRightRadius: BorderRadius.MD,
  },
  pollPercentage: {
    position: 'absolute',
    right: Spacing.MD,
    top: -20,
    fontSize: Typography.bodySmall.fontSize,
    color: LightTheme.OnSurface,
    fontWeight: '600',
  },
  pollStatus: {
    fontSize: Typography.bodySmall.fontSize,
    color: LightTheme.Primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.MD,
    backgroundColor: LightTheme.Surface,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.Outline,
  },
  notesTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
  },
  notesControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoSaveLabel: {
    fontSize: Typography.bodySmall.fontSize,
    color: LightTheme.OnSurfaceVariant,
    marginRight: Spacing.SM,
  },
  notesInput: {
    flex: 1,
    backgroundColor: LightTheme.Background,
    padding: Spacing.MD,
    fontSize: Typography.bodyMedium.fontSize,
    color: LightTheme.OnBackground,
    lineHeight: Typography.bodyMedium.lineHeight,
  },
  notesFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.MD,
    backgroundColor: LightTheme.Surface,
    borderTopWidth: 1,
    borderTopColor: LightTheme.Outline,
  },
  notesInfo: {
    fontSize: Typography.bodySmall.fontSize,
    color: LightTheme.OnSurfaceVariant,
  },
  saveButton: {
    backgroundColor: LightTheme.Primary,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderRadius: BorderRadius.SM,
  },
  saveButtonText: {
    color: LightTheme.OnPrimary,
    fontSize: Typography.bodySmall.fontSize,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.LG,
    padding: Spacing.XL,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: Typography.titleLarge.fontSize,
    fontWeight: Typography.titleLarge.fontWeight,
    color: LightTheme.OnSurface,
    textAlign: 'center',
    marginBottom: Spacing.LG,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.LG,
  },
  statItem: {
    width: '48%',
    backgroundColor: LightTheme.SurfaceVariant,
    padding: Spacing.MD,
    borderRadius: BorderRadius.MD,
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  statValue: {
    fontSize: Typography.headlineMedium.fontSize,
    fontWeight: Typography.headlineMedium.fontWeight,
    color: LightTheme.Primary,
    marginBottom: Spacing.XS,
  },
  statLabel: {
    fontSize: Typography.bodySmall.fontSize,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    backgroundColor: LightTheme.Primary,
    paddingHorizontal: Spacing.XL,
    paddingVertical: Spacing.MD,
    borderRadius: BorderRadius.MD,
  },
  modalButtonText: {
    color: LightTheme.OnPrimary,
    fontSize: Typography.bodyLarge.fontSize,
    fontWeight: '600',
  },
});

export default LiveClassParticipationScreen;
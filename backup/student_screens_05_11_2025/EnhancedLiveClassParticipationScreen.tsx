import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Modal,
  FlatList,
  Alert,
  Animated as RNAnimated,
  SafeAreaView,
  StatusBar,
  BackHandler,
} from 'react-native';
import { Appbar, Portal, Snackbar, ActivityIndicator } from 'react-native-paper';
import Animated, { FadeIn, FadeInUp, FadeInDown, FadeOut, SlideInUp, SlideInDown, ZoomIn, BounceIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';

import {useTheme} from '../../context/ThemeContext';
import {useAuth} from '../../context/AuthContext';
import * as LiveClassService from '../../services/liveClassService';

const {width, height} = Dimensions.get('window');

interface ChatMessage {
  id: string;
  sender: string;
  senderRole: 'student' | 'teacher';
  message: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'poll_response';
}

interface Poll {
  id: string;
  question: string;
  options: string[];
  responses: {[key: string]: number};
  totalResponses: number;
  userResponse?: string;
  isActive: boolean;
  timeRemaining: number;
}

interface HandRaise {
  id: string;
  studentName: string;
  timestamp: string;
  question: string;
  status: 'raised' | 'acknowledged' | 'answered';
}

interface Annotation {
  id: string;
  x: number;
  y: number;
  type: 'arrow' | 'circle' | 'text' | 'highlight';
  content?: string;
  color: string;
  timestamp: string;
  author: string;
}

interface Participant {
  id: string;
  name: string;
  role: 'student' | 'teacher';
  isOnline: boolean;
  isMuted: boolean;
  hasVideo: boolean;
  handRaised: boolean;
}

interface EnhancedLiveClassParticipationScreenProps {
  onNavigate?: (screen: string) => void;
}

const EnhancedLiveClassParticipationScreen: React.FC<EnhancedLiveClassParticipationScreenProps> = ({ onNavigate }) => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {theme} = useTheme();
  const {user} = useAuth();

  const [activeTab, setActiveTab] = useState<'main' | 'chat' | 'participants' | 'whiteboard'>('main');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [handRaises, setHandRaises] = useState<HandRaise[]>([]);
  const [myHandRaised, setMyHandRaised] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [annotationMode, setAnnotationMode] = useState<'arrow' | 'circle' | 'text' | 'highlight'>('arrow');
  const [showPollModal, setShowPollModal] = useState(false);
  const [showHandRaiseModal, setShowHandRaiseModal] = useState(false);
  const [handRaiseQuestion, setHandRaiseQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const chatScrollRef = useRef<FlatList>(null);

  const classInfo = route.params || {
    title: 'Advanced Mathematics',
    teacher: 'Prof. Sarah Johnson',
    subject: 'Calculus - Derivatives',
    duration: '1:30:00',
    participantCount: 24,
  };

  useEffect(() => {
    initializeScreen();
    setupBackHandler();
    return cleanup;
  }, []);

  const initializeScreen = useCallback(async () => {
    try {
      setIsLoading(true);
      await loadClassData();
      startLiveUpdates();

      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Error initializing screen:', error);
      showSnackbar('Failed to load class data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onNavigate) {
        onNavigate('back');
      } else if (navigation) {
        navigation.goBack();
      }
      return true;
    });
    return backHandler.remove;
  }, [navigation, onNavigate]);

  const cleanup = useCallback(() => {
    // Clean up intervals and resources
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const loadClassData = async () => {
    if (!user?.id) {
      console.log('No user ID available');
      return;
    }

    try {
      // Get class ID from route params or use default
      const classId = route.params?.classId || 'demo-class-1';

      const result = await LiveClassService.getLiveClassData(classId, user.id);

      if (result.success && result.data) {
        setChatMessages(result.data.chatMessages);
        setCurrentPoll(result.data.currentPoll);
        setParticipants(result.data.participants);
        setHandRaises(result.data.handRaises);

        showSnackbar('Live class data loaded successfully');
      } else {
        showSnackbar(result.error || 'Failed to load live class data');
      }
    } catch (error) {
      console.error('Error loading live class data:', error);
      showSnackbar('Failed to load live class data');
    }
  };

  const startLiveUpdates = () => {
    const interval = setInterval(() => {
      if (currentPoll && currentPoll.timeRemaining > 0) {
        setCurrentPoll(prev => prev ? {...prev, timeRemaining: prev.timeRemaining - 1} : null);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: user?.name || 'You',
        senderRole: 'student',
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
        type: 'text',
      };

      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
      
      setTimeout(() => {
        chatScrollRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  };

  const raiseHand = () => {
    if (handRaiseQuestion.trim()) {
      const handRaise: HandRaise = {
        id: Date.now().toString(),
        studentName: user?.name || 'You',
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
        question: handRaiseQuestion.trim(),
        status: 'raised',
      };

      setHandRaises(prev => [...prev, handRaise]);
      setMyHandRaised(true);
      setHandRaiseQuestion('');
      setShowHandRaiseModal(false);
      
      Alert.alert('Hand Raised', 'Your hand has been raised! The teacher will acknowledge it soon.');
    }
  };

  const respondToPoll = (option: string) => {
    if (currentPoll && !currentPoll.userResponse) {
      setCurrentPoll(prev => prev ? {
        ...prev,
        userResponse: option,
        responses: {
          ...prev.responses,
          [option]: prev.responses[option] + 1,
        },
        totalResponses: prev.totalResponses + 1,
      } : null);

      Alert.alert('Response Recorded', `Your response "${option}" has been recorded.`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderTabButton = (tabId: string, label: string, icon: string, badge?: number) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: activeTab === tabId ? theme.Primary : 'transparent',
          borderColor: theme.Primary,
        }
      ]}
      onPress={() => setActiveTab(tabId as any)}
    >
      <View style={styles.tabContent}>
        <Icon 
          name={icon} 
          size={18} 
          color={activeTab === tabId ? theme.OnPrimary : theme.Primary} 
        />
        {badge && badge > 0 && (
          <View style={[styles.badge, {backgroundColor: theme.Error}]}>
            <Text style={[styles.badgeText, {color: theme.OnError}]}>
              {badge > 99 ? '99+' : badge}
            </Text>
          </View>
        )}
      </View>
      <Text style={[
        styles.tabButtonText,
        {color: activeTab === tabId ? theme.OnPrimary : theme.Primary}
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderChatMessage = ({item}: {item: ChatMessage}) => (
    <Animated.View
      entering={FadeInUp}
      style={[
        styles.chatMessage,
        {
          alignSelf: item.senderRole === 'student' && item.sender === (user?.name || 'You') ? 'flex-end' : 'flex-start',
          backgroundColor: item.senderRole === 'teacher' 
            ? theme.PrimaryContainer 
            : item.sender === (user?.name || 'You')
              ? theme.Primary
              : theme.Surface,
        }
      ]}
    >
      <View style={styles.messageHeader}>
        <Text style={[
          styles.messageSender,
          {
            color: item.senderRole === 'teacher' 
              ? theme.OnPrimaryContainer
              : item.sender === (user?.name || 'You')
                ? theme.OnPrimary
                : theme.OnSurface
          }
        ]}>
          {item.sender}
          {item.senderRole === 'teacher' && ' (Teacher)'}
        </Text>
        <Text style={[
          styles.messageTime,
          {
            color: item.senderRole === 'teacher' 
              ? theme.OnPrimaryContainer
              : item.sender === (user?.name || 'You')
                ? theme.OnPrimary
                : theme.OnSurfaceVariant
          }
        ]}>
          {item.timestamp}
        </Text>
      </View>
      <Text style={[
        styles.messageText,
        {
          color: item.senderRole === 'teacher' 
            ? theme.OnPrimaryContainer
            : item.sender === (user?.name || 'You')
              ? theme.OnPrimary
              : theme.OnSurface
        }
      ]}>
        {item.message}
      </Text>
    </Animated.View>
  );

  const renderParticipant = ({item}: {item: Participant}) => (
    <View style={[styles.participantItem, {backgroundColor: theme.Surface}]}>
      <View style={styles.participantInfo}>
        <View style={[
          styles.statusDot, 
          {backgroundColor: item.isOnline ? '#4CAF50' : '#F44336'}
        ]} />
        <Text style={[styles.participantName, {color: theme.OnSurface}]}>
          {item.name}
        </Text>
        {item.role === 'teacher' && (
          <View style={[styles.roleBadge, {backgroundColor: theme.Primary}]}>
            <Text style={[styles.roleBadgeText, {color: theme.OnPrimary}]}>
              Teacher
            </Text>
          </View>
        )}
      </View>
      <View style={styles.participantControls}>
        <Icon 
          name={item.isMuted ? 'mic-off' : 'mic'} 
          size={16} 
          color={item.isMuted ? theme.Error : theme.Primary} 
        />
        <Icon 
          name={item.hasVideo ? 'videocam' : 'videocam-off'} 
          size={16} 
          color={item.hasVideo ? theme.Primary : theme.Outline} 
        />
        {item.handRaised && (
          <Icon name="pan-tool" size={16} color={theme.Error} />
        )}
      </View>
    </View>
  );

  const renderMainContent = () => (
    <ScrollView style={styles.mainContent}>
      {/* Live Video Placeholder */}
      <View style={[styles.videoContainer, {backgroundColor: theme.SurfaceVariant}]}>
        <Icon name="videocam" size={48} color={theme.OnSurfaceVariant} />
        <Text style={[styles.videoText, {color: theme.OnSurfaceVariant}]}>
          Live Stream: {classInfo.subject}
        </Text>
        <Text style={[styles.videoSubtext, {color: theme.OnSurfaceVariant}]}>
          {classInfo.participantCount} participants
        </Text>
      </View>

      {/* Active Poll */}
      {currentPoll && (
        <Animated.View 
          entering={SlideInUp}
          style={[styles.pollContainer, {backgroundColor: theme.Surface}]}
        >
          <View style={styles.pollHeader}>
            <Icon name="poll" size={24} color={theme.Primary} />
            <Text style={[styles.pollTitle, {color: theme.OnSurface}]}>
              Live Poll
            </Text>
            <Text style={[styles.pollTimer, {color: theme.Error}]}>
              {formatTime(currentPoll.timeRemaining)}
            </Text>
          </View>

          <Text style={[styles.pollQuestion, {color: theme.OnSurface}]}>
            {currentPoll.question}
          </Text>

          <View style={styles.pollOptions}>
            {currentPoll.options.map((option, index) => {
              const percentage = currentPoll.totalResponses > 0 
                ? ((currentPoll.responses[option] || 0) / currentPoll.totalResponses * 100).toFixed(1)
                : '0.0';
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.pollOption,
                    {
                      backgroundColor: currentPoll.userResponse === option 
                        ? theme.PrimaryContainer 
                        : theme.SurfaceVariant,
                      borderColor: currentPoll.userResponse === option 
                        ? theme.Primary 
                        : 'transparent',
                    }
                  ]}
                  onPress={() => respondToPoll(option)}
                  disabled={!!currentPoll.userResponse}
                >
                  <Text style={[
                    styles.pollOptionText, 
                    {color: theme.OnSurface}
                  ]}>
                    {option}
                  </Text>
                  {currentPoll.userResponse && (
                    <Text style={[
                      styles.pollPercentage,
                      {color: theme.Primary}
                    ]}>
                      {percentage}%
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      )}

      {/* Hand Raises */}
      {handRaises.length > 0 && (
        <View style={[styles.handRaisesContainer, {backgroundColor: theme.Surface}]}>
          <View style={styles.handRaisesHeader}>
            <Icon name="pan-tool" size={20} color={theme.Primary} />
            <Text style={[styles.handRaisesTitle, {color: theme.OnSurface}]}>
              Raised Hands ({handRaises.length})
            </Text>
          </View>
          {handRaises.map(handRaise => (
            <View key={handRaise.id} style={styles.handRaiseItem}>
              <Text style={[styles.handRaiseName, {color: theme.OnSurface}]}>
                {handRaise.studentName}
              </Text>
              <Text style={[styles.handRaiseQuestion, {color: theme.OnSurfaceVariant}]}>
                {handRaise.question}
              </Text>
              <Text style={[styles.handRaiseTime, {color: theme.OnSurfaceVariant}]}>
                {handRaise.timestamp}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderChatContent = () => (
    <View style={styles.chatContainer}>
      <FlatList
        ref={chatScrollRef}
        data={chatMessages}
        renderItem={renderChatMessage}
        keyExtractor={item => item.id}
        style={styles.chatMessages}
        contentContainerStyle={styles.chatMessagesContent}
      />
      <View style={[styles.chatInputContainer, {borderTopColor: theme.Outline}]}>
        <TextInput
          style={[styles.chatInput, {
            borderColor: theme.Outline,
            color: theme.OnSurface
          }]}
          placeholder="Type a message..."
          placeholderTextColor={theme.OnSurfaceVariant}
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, {backgroundColor: theme.Primary}]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Icon 
            name="send" 
            size={20} 
            color={theme.OnPrimary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderParticipantsContent = () => (
    <FlatList
      data={participants}
      renderItem={renderParticipant}
      keyExtractor={item => item.id}
      style={styles.participantsList}
      contentContainerStyle={styles.participantsContent}
    />
  );

  const renderWhiteboardContent = () => (
    <View style={styles.whiteboardContainer}>
      <View style={[styles.whiteboardCanvas, {backgroundColor: theme.Surface}]}>
        <Text style={[styles.whiteboardPlaceholder, {color: theme.OnSurfaceVariant}]}>
          Interactive Whiteboard
        </Text>
        <Text style={[styles.whiteboardSubtext, {color: theme.OnSurfaceVariant}]}>
          Shared annotations and drawings will appear here
        </Text>
      </View>

      <View style={styles.whiteboardControls}>
        <TouchableOpacity
          style={[
            styles.annotationTool,
            {
              backgroundColor: annotationMode === 'arrow' ? theme.Primary : theme.Surface,
            }
          ]}
          onPress={() => setAnnotationMode('arrow')}
        >
          <Icon 
            name="arrow-forward" 
            size={20} 
            color={annotationMode === 'arrow' ? theme.OnPrimary : theme.OnSurface} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.annotationTool,
            {
              backgroundColor: annotationMode === 'circle' ? theme.Primary : theme.Surface,
            }
          ]}
          onPress={() => setAnnotationMode('circle')}
        >
          <Icon 
            name="radio-button-unchecked" 
            size={20} 
            color={annotationMode === 'circle' ? theme.OnPrimary : theme.OnSurface} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.annotationTool,
            {
              backgroundColor: annotationMode === 'text' ? theme.Primary : theme.Surface,
            }
          ]}
          onPress={() => setAnnotationMode('text')}
        >
          <Icon 
            name="text-fields" 
            size={20} 
            color={annotationMode === 'text' ? theme.OnPrimary : theme.OnSurface} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.clearButton, {backgroundColor: theme.Error}]}
          onPress={() => setAnnotations([])}
        >
          <Icon name="clear" size={20} color={theme.OnError} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: theme.Primary }}>
      <Appbar.BackAction onPress={() => onNavigate ? onNavigate('back') : navigation.goBack()} color={theme.OnPrimary} />
      <Appbar.Content
        title={classInfo.title}
        titleStyle={{ color: theme.OnPrimary, fontWeight: 'bold' }}
        subtitle={`${classInfo.teacher} • ${classInfo.subject}`}
        subtitleStyle={{ color: theme.OnPrimary, opacity: 0.9 }}
      />
      <Appbar.Action
        icon={myHandRaised ? "pan-tool" : "pan-tool"}
        onPress={() => setShowHandRaiseModal(true)}
        disabled={myHandRaised}
        color={myHandRaised ? theme.Error : theme.OnPrimary}
      />
    </Appbar.Header>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'main':
        return renderMainContent();
      case 'chat':
        return renderChatContent();
      case 'participants':
        return renderParticipantsContent();
      case 'whiteboard':
        return renderWhiteboardContent();
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.Background}]}>
        <StatusBar backgroundColor={theme.Primary} barStyle="light-content" />
        {renderAppBar()}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.Primary} />
          <Text style={{ fontSize: 16, color: theme.OnSurfaceVariant, marginTop: 16 }}>
            Joining live class...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.Background}]}>
      <StatusBar backgroundColor={theme.Primary} barStyle="light-content" />
      {renderAppBar()}

      {/* Tab Bar */}
      <View style={[styles.tabBar, {backgroundColor: theme.Surface}]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {renderTabButton('main', 'Live', 'live-tv')}
          {renderTabButton('chat', 'Chat', 'chat', chatMessages.length)}
          {renderTabButton('participants', 'People', 'people', participants.filter(p => p.isOnline).length)}
          {renderTabButton('whiteboard', 'Board', 'draw')}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>

      {/* Hand Raise Modal */}
      <Modal visible={showHandRaiseModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {backgroundColor: theme.Surface}]}>
            <Text style={[styles.modalTitle, {color: theme.OnSurface}]}>
              Raise Your Hand
            </Text>
            
            <TextInput
              style={[styles.questionInput, {
                borderColor: theme.Outline,
                color: theme.OnSurface
              }]}
              placeholder="What's your question? (optional)"
              placeholderTextColor={theme.OnSurfaceVariant}
              value={handRaiseQuestion}
              onChangeText={setHandRaiseQuestion}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, {backgroundColor: theme.Outline}]}
                onPress={() => setShowHandRaiseModal(false)}
              >
                <Text style={[styles.modalButtonText, {color: theme.OnSurface}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, {backgroundColor: theme.Primary}]}
                onPress={raiseHand}
              >
                <Text style={[styles.modalButtonText, {color: theme.OnPrimary}]}>
                  Raise Hand
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
  },
  classInfo: {
    flex: 1,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  classSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  headerControls: {
    flexDirection: 'row',
    gap: 8,
  },
  handRaiseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  tabBar: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 70,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  tabButtonText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  videoContainer: {
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  videoText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  videoSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  pollContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pollHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pollTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  pollTimer: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  pollQuestion: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  pollOptions: {
    gap: 8,
  },
  pollOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
  },
  pollOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pollPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  handRaisesContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  handRaisesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  handRaisesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  handRaiseItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  handRaiseName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  handRaiseQuestion: {
    fontSize: 12,
    marginBottom: 4,
  },
  handRaiseTime: {
    fontSize: 10,
  },
  chatContainer: {
    flex: 1,
  },
  chatMessages: {
    flex: 1,
  },
  chatMessagesContent: {
    padding: 16,
    gap: 8,
  },
  chatMessage: {
    maxWidth: '80%',
    borderRadius: 12,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  messageSender: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  messageTime: {
    fontSize: 10,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantsList: {
    flex: 1,
  },
  participantsContent: {
    padding: 16,
    gap: 8,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  participantName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  participantControls: {
    flexDirection: 'row',
    gap: 12,
  },
  whiteboardContainer: {
    flex: 1,
    padding: 16,
  },
  whiteboardCanvas: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  whiteboardPlaceholder: {
    fontSize: 16,
    fontWeight: '500',
  },
  whiteboardSubtext: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  whiteboardControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  annotationTool: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  clearButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 14,
    textAlignVertical: 'top',
    height: 80,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default EnhancedLiveClassParticipationScreen;
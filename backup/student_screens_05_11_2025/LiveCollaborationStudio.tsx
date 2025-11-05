import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Modal,
  Alert,
  Switch,
  Animated,
  SafeAreaView,
  StatusBar,
  BackHandler,
} from 'react-native';
import { Appbar, Portal, Snackbar, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';

interface CollaborationSession {
  id: string;
  title: string;
  subject: string;
  host: string;
  hostAvatar: string;
  participants: Participant[];
  maxParticipants: number;
  type: 'study-group' | 'project-work' | 'doubt-solving' | 'peer-tutoring';
  duration: number;
  remainingTime: number;
  startTime: Date;
  features: SessionFeature[];
  isLive: boolean;
  hasWhiteboard: boolean;
  hasScreenShare: boolean;
  hasBreakoutRooms: boolean;
  language: 'hindi' | 'english' | 'mixed';
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: 'host' | 'co-host' | 'participant';
  isMuted: boolean;
  isCameraOn: boolean;
  isRaisingHand: boolean;
  isPresenting: boolean;
  lastActivity: string;
  status: 'active' | 'away' | 'disconnected';
  connectionQuality: 'excellent' | 'good' | 'poor';
}

interface SessionFeature {
  name: string;
  isActive: boolean;
  icon: string;
}

interface WhiteboardTool {
  id: string;
  name: string;
  icon: string;
  isSelected: boolean;
  color?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'equation' | 'poll' | 'system';
  isPrivate?: boolean;
  recipientId?: string;
}

interface BreakoutRoom {
  id: string;
  name: string;
  participants: string[];
  maxParticipants: number;
  topic: string;
  timeLimit: number;
  remainingTime: number;
  isActive: boolean;
}

interface SharedResource {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'link' | 'code';
  url: string;
  uploadedBy: string;
  uploadTime: Date;
  size: string;
  isDownloadable: boolean;
}

const LiveCollaborationStudio: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'main' | 'whiteboard' | 'breakout' | 'resources'>('main');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [selectedTool, setSelectedTool] = useState('pen');
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
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error initializing screen:', error);
      showSnackbar('Failed to load collaboration studio');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Leave Session',
        'Are you sure you want to leave this collaboration session?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => true },
          { text: 'Leave', style: 'destructive', onPress: () => false },
        ]
      );
      return true;
    });
    return backHandler.remove;
  }, []);

  const cleanup = useCallback(() => {
    // Clean up resources
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // Mock data
  const [currentSession] = useState<CollaborationSession>({
    id: '1',
    title: 'JEE Physics: Electromagnetic Induction',
    subject: 'Physics',
    host: 'Dr. राजेश शर्मा',
    hostAvatar: '👨‍🏫',
    participants: [
      {
        id: '1',
        name: 'अनिका पटेल',
        avatar: '👩‍🎓',
        role: 'participant',
        isMuted: false,
        isCameraOn: true,
        isRaisingHand: false,
        isPresenting: false,
        lastActivity: '2 mins ago',
        status: 'active',
        connectionQuality: 'excellent',
      },
      {
        id: '2',
        name: 'राहुल गुप्ता',
        avatar: '👨‍💻',
        role: 'co-host',
        isMuted: true,
        isCameraOn: true,
        isRaisingHand: false,
        isPresenting: false,
        lastActivity: 'Just now',
        status: 'active',
        connectionQuality: 'good',
      },
      {
        id: '3',
        name: 'प्रिया शर्मा',
        avatar: '👩‍🔬',
        role: 'participant',
        isMuted: false,
        isCameraOn: false,
        isRaisingHand: true,
        isPresenting: false,
        lastActivity: '1 min ago',
        status: 'active',
        connectionQuality: 'excellent',
      },
    ],
    maxParticipants: 25,
    type: 'study-group',
    duration: 90,
    remainingTime: 45,
    startTime: new Date(),
    features: [
      { name: 'Screen Share', isActive: true, icon: 'screen-share' },
      { name: 'Whiteboard', isActive: false, icon: 'draw' },
      { name: 'Breakout Rooms', isActive: false, icon: 'meeting-room' },
      { name: 'Recording', isActive: true, icon: 'fiber-manual-record' },
    ],
    isLive: true,
    hasWhiteboard: true,
    hasScreenShare: true,
    hasBreakoutRooms: true,
    language: 'mixed',
  });

  const [whiteboardTools] = useState<WhiteboardTool[]>([
    { id: 'pen', name: 'Pen', icon: 'edit', isSelected: true, color: '#000000' },
    { id: 'highlighter', name: 'Highlighter', icon: 'format-color-fill', isSelected: false, color: '#FFEB3B' },
    { id: 'eraser', name: 'Eraser', icon: 'clear', isSelected: false },
    { id: 'text', name: 'Text', icon: 'text-fields', isSelected: false },
    { id: 'shapes', name: 'Shapes', icon: 'category', isSelected: false },
    { id: 'equation', name: 'Equation', icon: 'functions', isSelected: false },
  ]);

  const [chatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: '1',
      senderName: 'अनिका पटेल',
      content: 'Can you explain Faraday\'s law once more?',
      timestamp: new Date(Date.now() - 300000),
      type: 'text',
    },
    {
      id: '2',
      senderId: 'host',
      senderName: 'Dr. राजेश शर्मा',
      content: 'Sure! The induced EMF is equal to the negative rate of change of magnetic flux.',
      timestamp: new Date(Date.now() - 240000),
      type: 'text',
    },
    {
      id: '3',
      senderId: '2',
      senderName: 'राहुल गुप्ता',
      content: 'I\'ve shared the formula sheet in resources',
      timestamp: new Date(Date.now() - 120000),
      type: 'text',
    },
    {
      id: '4',
      senderId: 'system',
      senderName: 'System',
      content: 'प्रिया शर्मा raised their hand',
      timestamp: new Date(Date.now() - 60000),
      type: 'system',
    },
  ]);

  const [breakoutRooms] = useState<BreakoutRoom[]>([
    {
      id: '1',
      name: 'Group A: Motional EMF',
      participants: ['1', '2'],
      maxParticipants: 4,
      topic: 'Understanding motional EMF in conductors',
      timeLimit: 20,
      remainingTime: 15,
      isActive: true,
    },
    {
      id: '2',
      name: 'Group B: Self Inductance',
      participants: ['3'],
      maxParticipants: 4,
      topic: 'Self inductance and energy stored in inductors',
      timeLimit: 20,
      remainingTime: 15,
      isActive: true,
    },
  ]);

  const [sharedResources] = useState<SharedResource[]>([
    {
      id: '1',
      name: 'Electromagnetic Induction Formulas',
      type: 'document',
      url: 'formulas.pdf',
      uploadedBy: 'राहुल गुप्ता',
      uploadTime: new Date(Date.now() - 300000),
      size: '2.5 MB',
      isDownloadable: true,
    },
    {
      id: '2',
      name: 'Faraday Law Simulation',
      type: 'video',
      url: 'simulation.mp4',
      uploadedBy: 'Dr. राजेश शर्मा',
      uploadTime: new Date(Date.now() - 600000),
      size: '15.2 MB',
      isDownloadable: false,
    },
  ]);

  const renderMainView = () => (
    <View style={{ flex: 1 }}>
      {/* Video Grid */}
      <View style={{ 
        flex: 1, 
        backgroundColor: '#000', 
        borderRadius: 12, 
        margin: Spacing.MD,
        overflow: 'hidden'
      }}>
        {/* Host Video (Large) */}
        <View style={{ 
          flex: 2, 
          backgroundColor: '#1a1a1a', 
          justifyContent: 'center', 
          alignItems: 'center',
          position: 'relative'
        }}>
          <Text style={{ fontSize: 64 }}>{currentSession.hostAvatar}</Text>
          <View style={{ 
            position: 'absolute', 
            bottom: 10, 
            left: 10,
            backgroundColor: 'rgba(0,0,0,0.7)',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Icon name="screen-share" size={14} color="#4CAF50" style={{ marginRight: 4 }} />
            <Text style={[Typography.bodySmall, { color: '#FFFFFF', fontSize: 10 }]}>
              {currentSession.host} (Host)
            </Text>
          </View>
          {currentSession.features.find(f => f.name === 'Recording' && f.isActive) && (
            <View style={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#FF1744',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#FFFFFF',
                marginRight: 4,
              }} />
              <Text style={[Typography.bodySmall, { color: '#FFFFFF', fontSize: 10 }]}>
                REC
              </Text>
            </View>
          )}
        </View>

        {/* Participant Videos (Small) */}
        <View style={{ 
          flex: 1, 
          flexDirection: 'row', 
          backgroundColor: '#2a2a2a' 
        }}>
          {currentSession.participants.slice(0, 4).map((participant, index) => (
            <View key={participant.id} style={{ 
              flex: 1, 
              backgroundColor: index % 2 === 0 ? '#333' : '#1a1a1a',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              borderRightWidth: index < 3 ? 1 : 0,
              borderRightColor: '#000'
            }}>
              <Text style={{ fontSize: 24 }}>{participant.avatar}</Text>
              <View style={{ 
                position: 'absolute', 
                bottom: 4, 
                left: 4,
                backgroundColor: 'rgba(0,0,0,0.8)',
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                {participant.isRaisingHand && (
                  <Text style={{ fontSize: 10, marginRight: 2 }}>✋</Text>
                )}
                {!participant.isCameraOn && (
                  <Icon name="videocam-off" size={10} color="#FF1744" style={{ marginRight: 2 }} />
                )}
                {participant.isMuted && (
                  <Icon name="mic-off" size={10} color="#FF1744" style={{ marginRight: 2 }} />
                )}
                <Text style={[Typography.bodySmall, { color: '#FFFFFF', fontSize: 8 }]}>
                  {participant.name?.split(' ')[0] || participant.name || 'User'}
                </Text>
              </View>
              <View style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: participant.connectionQuality === 'excellent' ? '#4CAF50' : 
                               participant.connectionQuality === 'good' ? '#FFB300' : '#FF1744'
              }} />
            </View>
          ))}
        </View>
      </View>

      {/* Session Info */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.MD,
        paddingBottom: Spacing.SM,
      }}>
        <View>
          <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant }]}>
            {currentSession.participants.length + 1}/{currentSession.maxParticipants} participants
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="schedule" size={16} color={LightTheme.OnSurfaceVariant} />
          <Text style={[Typography.bodySmall, { marginLeft: 4, color: LightTheme.OnSurfaceVariant }]}>
            {currentSession.remainingTime} mins left
          </Text>
        </View>
      </View>
    </View>
  );

  const renderWhiteboardView = () => (
    <View style={{ flex: 1 }}>
      {/* Whiteboard Tools */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: LightTheme.Surface,
        paddingHorizontal: Spacing.MD,
        paddingVertical: Spacing.SM,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {whiteboardTools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              onPress={() => setSelectedTool(tool.id)}
              style={{
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                marginRight: 8,
                backgroundColor: selectedTool === tool.id ? LightTheme.Primary + '20' : 'transparent',
              }}
            >
              <Icon 
                name={tool.icon} 
                size={20} 
                color={selectedTool === tool.id ? LightTheme.Primary : LightTheme.OnSurfaceVariant} 
              />
              <Text style={[Typography.bodySmall, { 
                marginTop: 2, 
                color: selectedTool === tool.id ? LightTheme.Primary : LightTheme.OnSurfaceVariant,
                fontSize: 10
              }]}>
                {tool.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
          <TouchableOpacity style={{
            backgroundColor: LightTheme.Error + '20',
            padding: 8,
            borderRadius: 8,
            marginRight: 8,
          }}>
            <Icon name="clear-all" size={20} color={LightTheme.Error} />
          </TouchableOpacity>
          <TouchableOpacity style={{
            backgroundColor: LightTheme.Secondary + '20',
            padding: 8,
            borderRadius: 8,
          }}>
            <Icon name="save" size={20} color={LightTheme.Secondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Whiteboard Canvas */}
      <View style={{ 
        flex: 1, 
        backgroundColor: '#FFFFFF', 
        margin: Spacing.MD,
        borderRadius: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={[Typography.bodyLarge, { color: LightTheme.OnSurfaceVariant }]}>
          Whiteboard Canvas
        </Text>
        <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant, textAlign: 'center', marginTop: 8 }]}>
          Draw, write equations, or add diagrams{'\n'}
          Everyone can see your contributions in real-time
        </Text>
      </View>

      {/* Collaboration Controls */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: Spacing.MD,
        paddingBottom: Spacing.MD,
      }}>
        <TouchableOpacity style={{
          backgroundColor: LightTheme.PrimaryContainer,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
        }}>
          <Text style={[Typography.bodySmall, { color: LightTheme.OnPrimaryContainer, fontWeight: '600' }]}>
            Share with All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor: LightTheme.SecondaryContainer,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
        }}>
          <Text style={[Typography.bodySmall, { color: LightTheme.OnSecondaryContainer, fontWeight: '600' }]}>
            Take Snapshot
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor: LightTheme.TertiaryContainer,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
        }}>
          <Text style={[Typography.bodySmall, { color: LightTheme.OnTertiaryContainer, fontWeight: '600' }]}>
            Collaborate
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBreakoutView = () => (
    <View style={{ flex: 1, padding: Spacing.MD }}>
      <Text style={[Typography.titleMedium, { fontWeight: '600', marginBottom: Spacing.MD }]}>
        Breakout Rooms
      </Text>
      
      <FlatList
        data={breakoutRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: LightTheme.Surface,
            borderRadius: 12,
            padding: Spacing.MD,
            marginBottom: Spacing.MD,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.SM }}>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.bodyLarge, { fontWeight: '600' }]}>
                  {item.name}
                </Text>
                <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant, marginTop: 2 }]}>
                  {item.topic}
                </Text>
              </View>
              <View style={{
                backgroundColor: item.isActive ? '#E8F5E8' : '#F5F5F5',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
                <Text style={[Typography.bodySmall, {
                  color: item.isActive ? '#2E7D32' : '#666',
                  fontSize: 10,
                }]}>
                  {item.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.SM }}>
              <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant }]}>
                {item.participants.length}/{item.maxParticipants} participants
              </Text>
              <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant }]}>
                {item.remainingTime}/{item.timeLimit} mins
              </Text>
            </View>

            <View style={{
              height: 4,
              backgroundColor: LightTheme.SurfaceVariant,
              borderRadius: 2,
              marginBottom: Spacing.SM,
            }}>
              <View style={{
                height: '100%',
                width: `${(item.remainingTime / item.timeLimit) * 100}%`,
                backgroundColor: LightTheme.Primary,
                borderRadius: 2,
              }} />
            </View>

            <TouchableOpacity style={{
              backgroundColor: LightTheme.Primary,
              paddingVertical: 8,
              borderRadius: 8,
              alignItems: 'center',
            }}>
              <Text style={[Typography.bodySmall, { color: LightTheme.OnPrimary, fontWeight: '600' }]}>
                Join Room
              </Text>
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={{
        backgroundColor: LightTheme.Secondary,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: Spacing.MD,
      }}>
        <Text style={[Typography.bodyMedium, { color: LightTheme.OnSecondary, fontWeight: '600' }]}>
          Create New Breakout Room
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderResourcesView = () => (
    <View style={{ flex: 1, padding: Spacing.MD }}>
      <Text style={[Typography.titleMedium, { fontWeight: '600', marginBottom: Spacing.MD }]}>
        Shared Resources
      </Text>
      
      <FlatList
        data={sharedResources}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: LightTheme.Surface,
            borderRadius: 12,
            padding: Spacing.MD,
            marginBottom: Spacing.MD,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: item.type === 'document' ? '#E3F2FD' : 
                             item.type === 'video' ? '#FFF3E0' : '#E8F5E8',
              padding: 12,
              borderRadius: 12,
              marginRight: Spacing.MD,
            }}>
              <Icon 
                name={item.type === 'document' ? 'description' : 
                      item.type === 'video' ? 'play-arrow' : 'link'} 
                size={24} 
                color={item.type === 'document' ? '#1976D2' : 
                       item.type === 'video' ? '#F57C00' : '#388E3C'} 
              />
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={[Typography.bodyMedium, { fontWeight: '600' }]}>
                {item.name}
              </Text>
              <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant, marginTop: 2 }]}>
                Shared by {item.uploadedBy}
              </Text>
              <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant, marginTop: 2 }]}>
                {item.size} • {item.uploadTime.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>

            <TouchableOpacity style={{
              backgroundColor: item.isDownloadable ? LightTheme.Primary : LightTheme.SurfaceVariant,
              padding: 8,
              borderRadius: 8,
            }}>
              <Icon 
                name={item.isDownloadable ? 'download' : 'visibility'} 
                size={20} 
                color={item.isDownloadable ? LightTheme.OnPrimary : LightTheme.OnSurfaceVariant} 
              />
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={{
        backgroundColor: LightTheme.Secondary,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: Spacing.MD,
      }}>
        <Text style={[Typography.bodyMedium, { color: LightTheme.OnSecondary, fontWeight: '600' }]}>
          Share Resource
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderChatPanel = () => (
    <View style={{
      backgroundColor: LightTheme.Surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: Spacing.MD,
      maxHeight: '50%',
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.MD,
        marginBottom: Spacing.SM,
      }}>
        <Text style={[Typography.titleSmall, { fontWeight: '600' }]}>
          Chat
        </Text>
        <TouchableOpacity onPress={() => setShowChat(!showChat)}>
          <Icon name={showChat ? 'expand-more' : 'expand-less'} size={24} color={LightTheme.OnSurface} />
        </TouchableOpacity>
      </View>

      {showChat && (
        <>
          <FlatList
            data={chatMessages}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 200, paddingHorizontal: Spacing.MD }}
            renderItem={({ item }) => (
              <View style={{
                backgroundColor: item.type === 'system' ? LightTheme.SurfaceVariant : 'transparent',
                padding: item.type === 'system' ? 8 : 4,
                borderRadius: 8,
                marginBottom: 4,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <Text style={[Typography.bodySmall, { 
                    fontWeight: '600', 
                    color: item.type === 'system' ? LightTheme.OnSurfaceVariant : LightTheme.Primary,
                    minWidth: 60
                  }]}>
                    {item.senderName}:
                  </Text>
                  <Text style={[Typography.bodySmall, { 
                    flex: 1, 
                    marginLeft: 8,
                    color: item.type === 'system' ? LightTheme.OnSurfaceVariant : LightTheme.OnSurface
                  }]}>
                    {item.content}
                  </Text>
                </View>
                <Text style={[Typography.bodySmall, { 
                  color: LightTheme.OnSurfaceVariant, 
                  fontSize: 10,
                  marginTop: 2,
                  textAlign: 'right'
                }]}>
                  {item.timestamp.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: Spacing.MD,
            paddingVertical: Spacing.SM,
            borderTopWidth: 1,
            borderTopColor: LightTheme.Outline,
          }}>
            <TextInput
              placeholder="Type a message..."
              value={chatMessage}
              onChangeText={setChatMessage}
              style={[
                Typography.bodyMedium,
                {
                  flex: 1,
                  backgroundColor: LightTheme.SurfaceVariant,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 8,
                },
              ]}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={{
                backgroundColor: LightTheme.Primary,
                padding: 8,
                borderRadius: 20,
              }}
              onPress={() => {
                if (chatMessage.trim()) {
                  setChatMessage('');
                }
              }}
            >
              <Icon name="send" size={20} color={LightTheme.OnPrimary} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  const renderViewContent = () => {
    switch (activeView) {
      case 'main':
        return renderMainView();
      case 'whiteboard':
        return renderWhiteboardView();
      case 'breakout':
        return renderBreakoutView();
      case 'resources':
        return renderResourcesView();
      default:
        return renderMainView();
    }
  };

  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: LightTheme.Primary }}>
      <Appbar.BackAction onPress={() => {
        Alert.alert(
          'Leave Session',
          'Are you sure you want to leave this collaboration session?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Leave', style: 'destructive', onPress: () => {} },
          ]
        );
      }} />
      <Appbar.Content title={currentSession.title} subtitle={`${currentSession.subject} • Live Session`} />
      <Appbar.Action icon="people" onPress={() => setShowParticipants(true)} />
    </Appbar.Header>
  );

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
        <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
        {renderAppBar()}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={LightTheme.Primary} />
          <Text style={[Typography.bodyLarge, { color: LightTheme.OnSurfaceVariant, marginTop: Spacing.MD }]}>
            Loading collaboration studio...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
      <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
      {renderAppBar()}

      {/* Navigation Tabs */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: LightTheme.Surface,
        paddingHorizontal: Spacing.MD,
        paddingVertical: Spacing.SM,
      }}>
        {[
          { key: 'main', label: 'Video', icon: 'videocam' },
          { key: 'whiteboard', label: 'Board', icon: 'draw' },
          { key: 'breakout', label: 'Rooms', icon: 'meeting-room' },
          { key: 'resources', label: 'Files', icon: 'folder' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveView(tab.key as any)}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 8,
              borderBottomWidth: 2,
              borderBottomColor: activeView === tab.key ? LightTheme.Primary : 'transparent',
            }}
          >
            <Icon
              name={tab.icon}
              size={20}
              color={activeView === tab.key ? LightTheme.Primary : LightTheme.OnSurfaceVariant}
            />
            <Text style={[
              Typography.bodySmall,
              {
                marginTop: 2,
                color: activeView === tab.key ? LightTheme.Primary : LightTheme.OnSurfaceVariant,
                fontWeight: activeView === tab.key ? '600' : '400',
                fontSize: 10,
              },
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      <View style={{ flex: 1 }}>
        {renderViewContent()}
      </View>

      {/* Chat Panel */}
      {renderChatPanel()}

      {/* Control Panel */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: LightTheme.Surface,
        paddingVertical: Spacing.MD,
        paddingHorizontal: Spacing.LG,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}>
        <TouchableOpacity
          onPress={() => setIsMuted(!isMuted)}
          style={{
            backgroundColor: isMuted ? '#FFEBEE' : LightTheme.SurfaceVariant,
            padding: 12,
            borderRadius: 25,
          }}
        >
          <Icon 
            name={isMuted ? 'mic-off' : 'mic'} 
            size={24} 
            color={isMuted ? '#D32F2F' : LightTheme.OnSurfaceVariant} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsCameraOn(!isCameraOn)}
          style={{
            backgroundColor: !isCameraOn ? '#FFEBEE' : LightTheme.SurfaceVariant,
            padding: 12,
            borderRadius: 25,
          }}
        >
          <Icon 
            name={isCameraOn ? 'videocam' : 'videocam-off'} 
            size={24} 
            color={!isCameraOn ? '#D32F2F' : LightTheme.OnSurfaceVariant} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsHandRaised(!isHandRaised)}
          style={{
            backgroundColor: isHandRaised ? '#FFF3E0' : LightTheme.SurfaceVariant,
            padding: 12,
            borderRadius: 25,
          }}
        >
          <Icon 
            name="pan-tool" 
            size={24} 
            color={isHandRaised ? '#F57C00' : LightTheme.OnSurfaceVariant} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: LightTheme.SurfaceVariant,
            padding: 12,
            borderRadius: 25,
          }}
        >
          <Icon name="more-horiz" size={24} color={LightTheme.OnSurfaceVariant} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Leave Session',
              'Are you sure you want to leave this collaboration session?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Leave', style: 'destructive' },
              ]
            );
          }}
          style={{
            backgroundColor: '#FFEBEE',
            padding: 12,
            borderRadius: 25,
          }}
        >
          <Icon name="call-end" size={24} color="#D32F2F" />
        </TouchableOpacity>
      </View>

      {/* Participants Modal */}
      <Modal visible={showParticipants} transparent animationType="slide">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: LightTheme.Surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: Spacing.LG,
            maxHeight: '70%',
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: Spacing.MD,
            }}>
              <Text style={[Typography.titleMedium, { fontWeight: '600' }]}>
                Participants ({currentSession.participants.length + 1})
              </Text>
              <TouchableOpacity onPress={() => setShowParticipants(false)}>
                <Icon name="close" size={24} color={LightTheme.OnSurface} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={[
                { 
                  id: 'host', 
                  name: currentSession.host, 
                  avatar: currentSession.hostAvatar, 
                  role: 'host' as const,
                  isMuted: false,
                  isCameraOn: true,
                  isRaisingHand: false,
                  status: 'active' as const,
                  connectionQuality: 'excellent' as const 
                },
                ...currentSession.participants
              ]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: Spacing.SM,
                  borderBottomWidth: 1,
                  borderBottomColor: LightTheme.Outline + '20',
                }}>
                  <Text style={{ fontSize: 24, marginRight: Spacing.MD }}>
                    {item.avatar}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[Typography.bodyMedium, { fontWeight: '500' }]}>
                      {item.name}
                    </Text>
                    <Text style={[Typography.bodySmall, { color: LightTheme.Primary }]}>
                      {item.role === 'host' ? 'Host' : item.role === 'co-host' ? 'Co-Host' : 'Participant'}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {item.isRaisingHand && (
                      <Text style={{ fontSize: 16, marginRight: 8 }}>✋</Text>
                    )}
                    {!item.isCameraOn && (
                      <Icon name="videocam-off" size={16} color="#FF1744" style={{ marginRight: 4 }} />
                    )}
                    {item.isMuted && (
                      <Icon name="mic-off" size={16} color="#FF1744" style={{ marginRight: 4 }} />
                    )}
                    <View style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: item.connectionQuality === 'excellent' ? '#4CAF50' : 
                                     item.connectionQuality === 'good' ? '#FFB300' : '#FF1744'
                    }} />
                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

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

export default LiveCollaborationStudio;
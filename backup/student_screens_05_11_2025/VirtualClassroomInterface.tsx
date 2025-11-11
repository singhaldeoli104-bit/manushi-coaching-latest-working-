/**
 * VirtualClassroomInterface - Phase 48.1: Immersive Learning Environment
 * 3D virtual classroom with AR capabilities and immersive learning experiences
 * Features: Virtual environments, AR overlays, 3D models, gesture navigation, multi-user spaces
 * Manushi Coaching Platform
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PanGestureHandler, PinchGestureHandler, State,  } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, ScrollView, SafeAreaView, StatusBar, BackHandler } from 'react-native';
import { Appbar, Portal, Snackbar, ActivityIndicator } from 'react-native-paper';

import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

interface VirtualEnvironment {
  id: string;
  name: string;
  type: 'classroom' | 'laboratory' | 'library' | 'auditorium' | 'field';
  subject: string;
  description: string;
  immersionLevel: number;
  features: string[];
  participants: number;
  maxParticipants: number;
}

interface AR3DModel {
  id: string;
  name: string;
  category: string;
  description: string;
  interactionLevel: 'basic' | 'advanced' | 'expert';
  downloadSize: string;
  isDownloaded: boolean;
}

interface VirtualParticipant {
  id: string;
  name: string;
  avatar: string;
  role: 'student' | 'teacher' | 'guest';
  isActive: boolean;
  position: { x: number; y: number; z: number };
}

interface ImmersiveSession {
  id: string;
  title: string;
  teacher: string;
  subject: string;
  duration: number;
  startTime: string;
  environment: string;
  isLive: boolean;
  hasRecording: boolean;
  quality: '2D' | '3D' | 'VR' | 'AR';
}

interface VirtualClassroomInterfaceProps {
  studentId?: string;
  classId?: string;
  onNavigate?: (screen: string, params?: any) => void;
}

const VirtualClassroomInterface: React.FC<VirtualClassroomInterfaceProps> = ({
  studentId = 'student_123',
  classId = 'class_vr_001',
  onNavigate,
}) => {
  const { user } = useAuth();
  const [environments, setEnvironments] = useState<VirtualEnvironment[]>([]);
  const [arModels, setArModels] = useState<AR3DModel[]>([]);
  const [participants, setParticipants] = useState<VirtualParticipant[]>([]);
  const [activeSessions, setActiveSessions] = useState<ImmersiveSession[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);
  const [immersionMode, setImmersionMode] = useState<'2D' | '3D' | 'VR' | 'AR'>('2D');
  const [loading, setLoading] = useState(true);
  const [isARActive, setIsARActive] = useState(false);
  const [gestureEnabled, setGestureEnabled] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const panRef = useRef(null);
  const pinchRef = useRef(null);

  useEffect(() => {
    initializeScreen();
    const backHandlerCleanup = setupBackHandler();
    return () => {
      backHandlerCleanup();
      cleanup();
    };
  }, []);

  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onNavigate) {
        onNavigate('back');
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [onNavigate]);

  const cleanup = useCallback(() => {
    // Cleanup resources
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const initializeScreen = useCallback(async () => {
    try {
      setLoading(true);
      await initializeVirtualClassroom();
    } catch (error) {
      console.error('Error initializing screen:', error);
      showSnackbar('Failed to load virtual classroom');
    } finally {
      setLoading(false);
    }
  }, []);

  const initializeVirtualClassroom = async () => {
    // Simulate loading virtual classroom data
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    return new Promise<void>((resolve) => {
      // Initialize virtual environments
      const mockEnvironments: VirtualEnvironment[] = [
        {
          id: 'math_classroom',
          name: 'Advanced Mathematics Classroom',
          type: 'classroom',
          subject: 'Mathematics',
          description: '3D geometric visualization space with interactive equation boards',
          immersionLevel: 85,
          features: ['3D Graphing', 'Interactive Whiteboards', 'Equation Solver', 'Geometric Models'],
          participants: 12,
          maxParticipants: 30
        },
        {
          id: 'chemistry_lab',
          name: 'Virtual Chemistry Laboratory',
          type: 'laboratory',
          subject: 'Chemistry',
          description: 'Safe virtual lab for dangerous experiments with realistic simulations',
          immersionLevel: 92,
          features: ['Virtual Experiments', 'Molecular Visualization', 'Reaction Simulator', 'Safety Training'],
          participants: 8,
          maxParticipants: 20
        },
        {
          id: 'physics_demo',
          name: 'Physics Demonstration Hall',
          type: 'auditorium',
          subject: 'Physics',
          description: 'Large scale physics demonstrations with gravity and force simulations',
          immersionLevel: 88,
          features: ['Force Visualization', 'Wave Simulation', 'Particle Physics', 'Gravity Control'],
          participants: 25,
          maxParticipants: 50
        },
        {
          id: 'history_field',
          name: 'Historical Reconstruction Site',
          type: 'field',
          subject: 'History',
          description: 'Walk through ancient civilizations and historical events',
          immersionLevel: 95,
          features: ['Time Travel', 'Historical Figures', 'Event Reconstruction', 'Cultural Immersion'],
          participants: 15,
          maxParticipants: 25
        }
      ];

      // Initialize AR/3D models
      const mockArModels: AR3DModel[] = [
        {
          id: 'dna_model',
          name: 'DNA Double Helix',
          category: 'Biology',
          description: 'Interactive 3D DNA structure with base pair highlighting',
          interactionLevel: 'advanced',
          downloadSize: '45 MB',
          isDownloaded: true
        },
        {
          id: 'solar_system',
          name: 'Solar System Model',
          category: 'Astronomy',
          description: 'Scale model of our solar system with orbital mechanics',
          interactionLevel: 'expert',
          downloadSize: '120 MB',
          isDownloaded: false
        },
        {
          id: 'atom_structure',
          name: 'Atomic Structure',
          category: 'Chemistry',
          description: 'Electron orbital visualization with quantum effects',
          interactionLevel: 'basic',
          downloadSize: '28 MB',
          isDownloaded: true
        },
        {
          id: 'human_heart',
          name: 'Human Heart Anatomy',
          category: 'Biology',
          description: 'Detailed heart model with blood flow animation',
          interactionLevel: 'advanced',
          downloadSize: '67 MB',
          isDownloaded: true
        }
      ];

      // Initialize participants
      const mockParticipants: VirtualParticipant[] = [
        {
          id: 'student_001',
          name: 'Rahul Sharma',
          avatar: '👨‍🎓',
          role: 'student',
          isActive: true,
          position: { x: 2.5, y: 0, z: -1.8 }
        },
        {
          id: 'student_002',
          name: 'Priya Patel',
          avatar: '👩‍🎓',
          role: 'student',
          isActive: true,
          position: { x: -2.0, y: 0, z: -1.5 }
        },
        {
          id: 'teacher_001',
          name: 'Dr. Anjali Verma',
          avatar: '👩‍🏫',
          role: 'teacher',
          isActive: true,
          position: { x: 0, y: 0.5, z: 2.0 }
        }
      ];

      // Initialize active sessions
      const mockSessions: ImmersiveSession[] = [
        {
          id: 'session_001',
          title: 'Calculus in 3D Space',
          teacher: 'Prof. Mathematics',
          subject: 'Mathematics',
          duration: 60,
          startTime: '2:00 PM',
          environment: 'math_classroom',
          isLive: true,
          hasRecording: false,
          quality: '3D'
        },
        {
          id: 'session_002',
          title: 'Virtual Chemistry Experiments',
          teacher: 'Dr. Chemistry',
          subject: 'Chemistry',
          duration: 90,
          startTime: '3:30 PM',
          environment: 'chemistry_lab',
          isLive: false,
          hasRecording: true,
          quality: 'VR'
        }
      ];

      setEnvironments(mockEnvironments);
      setArModels(mockArModels);
      setParticipants(mockParticipants);
      setActiveSessions(mockSessions);
      resolve();
    });
  };

  const handleEnvironmentSelect = (environmentId: string) => {
    setSelectedEnvironment(environmentId);
    Alert.alert(
      'Enter Virtual Environment',
      'Loading immersive environment... This may take a few moments.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Enter Environment', 
          onPress: () => {
            // Simulate environment loading
            setImmersionMode('3D');
            Alert.alert('success', 'Welcome to the virtual environment!');
          }
        }
      ]
    );
  };

  const handleARToggle = () => {
    if (!isARActive) {
      Alert.alert(
        'Enable AR Mode',
        'This will activate your camera for augmented reality features. Grant camera permissions?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Enable AR', 
            onPress: () => {
              setIsARActive(true);
              setImmersionMode('AR');
              Alert.alert('AR Activated', 'Point your camera at any surface to place 3D models!');
            }
          }
        ]
      );
    } else {
      setIsARActive(false);
      setImmersionMode('2D');
    }
  };

  const handle3DModelDownload = (modelId: string) => {
    const model = arModels.find(m => m.id === modelId);
    if (!model) return;

    Alert.alert(
      'Download 3D Model',
      `Download ${model.name}? (${model.downloadSize})`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Download', 
          onPress: () => {
            // Simulate download
            setArModels(prev => prev.map(m => 
              m.id === modelId ? { ...m, isDownloaded: true } : m
            ));
            Alert.alert('Downloaded', `${model.name} is now available for AR!`);
          }
        }
      ]
    );
  };

  const handleGestureNavigation = (gestureType: 'pan' | 'pinch', gestureState: any) => {
    if (!gestureEnabled) return;
    
    // Handle virtual navigation gestures
    console.log(`${gestureType} gesture detected:`, gestureState);
  };

  const handleJoinSession = (sessionId: string) => {
    const session = activeSessions.find(s => s.id === sessionId);
    if (!session) return;

    Alert.alert(
      'Join Immersive Session',
      `Join "${session.title}" in ${session.quality} mode?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Join Session', 
          onPress: () => {
            setImmersionMode(session.quality);
            setSelectedEnvironment(session.environment);
            Alert.alert('Joined', `Welcome to ${session.title}!`);
          }
        }
      ]
    );
  };

  const renderEnvironmentCard = (env: VirtualEnvironment) => (
    <TouchableOpacity
      key={env.id}
      style={[
        styles.environmentCard,
        selectedEnvironment === env.id && styles.selectedEnvironmentCard
      ]}
      onPress={() => handleEnvironmentSelect(env.id)}
    >
      <View style={styles.environmentHeader}>
        <Text style={styles.environmentName}>{env.name}</Text>
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(env.type) }]}>
          <Text style={styles.typeBadgeText}>{env.type.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.environmentSubject}>{env.subject}</Text>
      <Text style={styles.environmentDescription}>{env.description}</Text>
      
      <View style={styles.immersionContainer}>
        <Text style={styles.immersionLabel}>Immersion Level:</Text>
        <View style={styles.immersionBarContainer}>
          <View style={[styles.immersionBar, { width: `${env.immersionLevel}%` }]} />
        </View>
        <Text style={styles.immersionText}>{env.immersionLevel}%</Text>
      </View>
      
      <View style={styles.participantContainer}>
        <Text style={styles.participantText}>
          👥 {env.participants}/{env.maxParticipants} participants
        </Text>
      </View>
      
      <View style={styles.featuresContainer}>
        {env.features.slice(0, 2).map((feature, index) => (
          <View key={index} style={styles.featureBadge}>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
        {env.features.length > 2 && (
          <Text style={styles.moreFeatures}>+{env.features.length - 2} more</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderARModelCard = (model: AR3DModel) => (
    <TouchableOpacity key={model.id} style={styles.arModelCard}>
      <View style={styles.arModelHeader}>
        <Text style={styles.arModelName}>{model.name}</Text>
        <View style={[styles.interactionBadge, { backgroundColor: getInteractionColor(model.interactionLevel) }]}>
          <Text style={styles.interactionText}>{model.interactionLevel.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.arModelCategory}>{model.category}</Text>
      <Text style={styles.arModelDescription}>{model.description}</Text>
      <Text style={styles.arModelSize}>Size: {model.downloadSize}</Text>
      
      <TouchableOpacity
        style={[
          styles.downloadButton,
          model.isDownloaded && styles.downloadedButton
        ]}
        onPress={() => model.isDownloaded ? null : handle3DModelDownload(model.id)}
        disabled={model.isDownloaded}
      >
        <Text style={[
          styles.downloadButtonText,
          model.isDownloaded && styles.downloadedButtonText
        ]}>
          {model.isDownloaded ? '✓ Downloaded' : '⬇ Download'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSessionCard = (session: ImmersiveSession) => (
    <TouchableOpacity
      key={session.id}
      style={styles.sessionCard}
      onPress={() => handleJoinSession(session.id)}
    >
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionTitle}>{session.title}</Text>
        <View style={[styles.qualityBadge, { backgroundColor: getQualityColor(session.quality) }]}>
          <Text style={styles.qualityText}>{session.quality}</Text>
        </View>
      </View>
      
      <Text style={styles.sessionTeacher}>👨‍🏫 {session.teacher}</Text>
      <Text style={styles.sessionSubject}>📚 {session.subject}</Text>
      <Text style={styles.sessionTime}>⏰ {session.startTime} ({session.duration} min)</Text>
      
      <View style={styles.sessionStatus}>
        {session.isLive ? (
          <View style={styles.liveIndicator}>
            <Text style={styles.liveText}>🔴 LIVE</Text>
          </View>
        ) : (
          <Text style={styles.scheduledText}>📅 Scheduled</Text>
        )}
        
        {session.hasRecording && (
          <Text style={styles.recordingText}>🎥 Recorded</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: LightTheme.Primary }}>
      <Appbar.BackAction onPress={() => onNavigate?.('student-dashboard')} />
      <Appbar.Content title="Virtual Classroom" subtitle="Immersive Learning Environment" />
      <Appbar.Action icon={isARActive ? 'cellphone' : 'google-cardboard'} onPress={handleARToggle} />
      <Appbar.Action icon="cog" onPress={() => {}} />
    </Appbar.Header>
  );

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'classroom': return '#4ECDC4';
      case 'laboratory': return '#FF6B6B';
      case 'library': return '#4D79FF';
      case 'auditorium': return '#FFD93D';
      case 'field': return '#6BCF7F';
      default: return LightTheme.Surface;
    }
  };

  const getInteractionColor = (level: string): string => {
    switch (level) {
      case 'basic': return '#4ECDC4';
      case 'advanced': return '#FFD93D';
      case 'expert': return '#FF6B6B';
      default: return LightTheme.Surface;
    }
  };

  const getQualityColor = (quality: string): string => {
    switch (quality) {
      case '2D': return '#4ECDC4';
      case '3D': return '#4D79FF';
      case 'VR': return '#FF6B6B';
      case 'AR': return '#6BCF7F';
      default: return LightTheme.Surface;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
        <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
        {renderAppBar()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={LightTheme.Primary} />
          <Text style={styles.loadingText}>Initializing Virtual Classroom...</Text>
          <Text style={styles.loadingSubtext}>Loading 3D environments and AR models</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
      <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
      {renderAppBar()}

      <PanGestureHandler
        ref={panRef}
        onGestureEvent={(event) => handleGestureNavigation('pan', event.nativeEvent)}
        enabled={gestureEnabled && (immersionMode === '3D' || immersionMode === 'VR')}
      >
        <PinchGestureHandler
          ref={pinchRef}
          onGestureEvent={(event) => handleGestureNavigation('pinch', event.nativeEvent)}
          enabled={gestureEnabled && (immersionMode === '3D' || immersionMode === 'VR')}
        >
          <View style={styles.container}>

          {/* Immersion Mode Indicator */}
          <View style={styles.modeIndicator}>
            <Text style={styles.modeText}>Mode: {immersionMode}</Text>
            {gestureEnabled && (immersionMode === '3D' || immersionMode === 'VR') && (
              <Text style={styles.gestureHint}>Use gestures to navigate</Text>
            )}
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Active Sessions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎬 Live & Scheduled Sessions</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.horizontalList}>
                  {activeSessions.map(renderSessionCard)}
                </View>
              </ScrollView>
            </View>

            {/* Virtual Environments */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🌐 Virtual Environments</Text>
              {environments.map(renderEnvironmentCard)}
            </View>

            {/* AR/3D Models */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎲 AR & 3D Models</Text>
              <View style={styles.modelsGrid}>
                {arModels.map(renderARModelCard)}
              </View>
            </View>

            {/* Virtual Participants */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>👥 Active Participants</Text>
              <View style={styles.participantsContainer}>
                {participants.map((participant) => (
                  <View key={participant.id} style={styles.participantItem}>
                    <Text style={styles.participantAvatar}>{participant.avatar}</Text>
                    <View style={styles.participantInfo}>
                      <Text style={styles.participantName}>{participant.name}</Text>
                      <Text style={styles.participantRole}>{participant.role}</Text>
                    </View>
                    <View style={[
                      styles.participantStatus,
                      { backgroundColor: participant.isActive ? '#4ECDC4' : '#FFB6B6' }
                    ]} />
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </PinchGestureHandler>
    </PanGestureHandler>

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
    backgroundColor: LightTheme.Background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LightTheme.Background,
  },
  loadingText: {
    ...Typography.titleLarge,
    color: LightTheme.OnSurface,
    marginTop: Spacing.MD,
    textAlign: 'center',
  },
  loadingSubtext: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    marginTop: Spacing.SM,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
    backgroundColor: LightTheme.Primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: Spacing.SM,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    marginLeft: Spacing.MD,
  },
  headerTitle: {
    ...Typography.titleLarge,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    ...Typography.bodyMedium,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  headerControls: {
    flexDirection: 'row',
    gap: Spacing.SM,
  },
  modeButton: {
    padding: Spacing.SM,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeModeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  modeButtonText: {
    fontSize: 20,
  },
  settingsButton: {
    padding: Spacing.SM,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingsButtonText: {
    fontSize: 20,
  },
  modeIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.SM,
    backgroundColor: LightTheme.SurfaceVariant,
  },
  modeText: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
  },
  gestureHint: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: Spacing.LG,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    marginBottom: Spacing.LG,
  },
  horizontalList: {
    flexDirection: 'row',
    gap: Spacing.MD,
  },
  sessionCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 16,
    padding: Spacing.LG,
    width: width * 0.8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.MD,
  },
  sessionTitle: {
    ...Typography.titleMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    flex: 1,
    marginRight: Spacing.SM,
  },
  qualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  qualityText: {
    ...Typography.labelSmall,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sessionTeacher: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.SM,
  },
  sessionSubject: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    marginBottom: Spacing.SM,
  },
  sessionTime: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.MD,
  },
  sessionStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveIndicator: {
    backgroundColor: '#FFE6E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveText: {
    ...Typography.labelSmall,
    color: '#FF0000',
    fontWeight: 'bold',
  },
  scheduledText: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
  },
  recordingText: {
    ...Typography.bodySmall,
    color: LightTheme.Primary,
  },
  environmentCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 16,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedEnvironmentCard: {
    borderWidth: 2,
    borderColor: LightTheme.Primary,
    backgroundColor: LightTheme.PrimaryContainer,
  },
  environmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.SM,
  },
  environmentName: {
    ...Typography.titleMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    flex: 1,
    marginRight: Spacing.SM,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    ...Typography.labelSmall,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  environmentSubject: {
    ...Typography.bodyLarge,
    color: LightTheme.Primary,
    fontWeight: 'bold',
    marginBottom: Spacing.SM,
  },
  environmentDescription: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    lineHeight: 20,
    marginBottom: Spacing.LG,
  },
  immersionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.SM,
    marginBottom: Spacing.MD,
  },
  immersionLabel: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
  },
  immersionBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: LightTheme.OutlineVariant,
    borderRadius: 4,
    overflow: 'hidden',
  },
  immersionBar: {
    height: '100%',
    backgroundColor: LightTheme.Primary,
    borderRadius: 4,
  },
  immersionText: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
  },
  participantContainer: {
    marginBottom: Spacing.MD,
  },
  participantText: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.SM,
  },
  featureBadge: {
    backgroundColor: LightTheme.SurfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featureText: {
    ...Typography.labelSmall,
    color: LightTheme.OnSurfaceVariant,
  },
  moreFeatures: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    fontStyle: 'italic',
  },
  modelsGrid: {
    gap: Spacing.LG,
  },
  arModelCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 16,
    padding: Spacing.LG,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  arModelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.SM,
  },
  arModelName: {
    ...Typography.titleMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    flex: 1,
    marginRight: Spacing.SM,
  },
  interactionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  interactionText: {
    ...Typography.labelSmall,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  arModelCategory: {
    ...Typography.bodyLarge,
    color: LightTheme.Primary,
    fontWeight: 'bold',
    marginBottom: Spacing.SM,
  },
  arModelDescription: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    lineHeight: 20,
    marginBottom: Spacing.SM,
  },
  arModelSize: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.LG,
  },
  downloadButton: {
    backgroundColor: LightTheme.Primary,
    borderRadius: 12,
    paddingVertical: Spacing.MD,
    alignItems: 'center',
  },
  downloadedButton: {
    backgroundColor: LightTheme.SurfaceVariant,
  },
  downloadButtonText: {
    ...Typography.bodyMedium,
    color: LightTheme.OnPrimary,
    fontWeight: 'bold',
  },
  downloadedButtonText: {
    color: LightTheme.OnSurfaceVariant,
  },
  participantsContainer: {
    gap: Spacing.MD,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightTheme.Surface,
    borderRadius: 12,
    padding: Spacing.MD,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  participantAvatar: {
    fontSize: 32,
    marginRight: Spacing.MD,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    ...Typography.bodyLarge,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
  },
  participantRole: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    textTransform: 'capitalize',
  },
  participantStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default VirtualClassroomInterface;
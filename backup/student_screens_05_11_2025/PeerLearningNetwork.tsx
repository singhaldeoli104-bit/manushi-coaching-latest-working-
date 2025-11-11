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
import * as PeerLearningService from '../../services/peerLearningService';

interface PeerProfile {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  subjects: string[];
  strengths: string[];
  studyPreferences: string[];
  rating: number;
  totalSessions: number;
  isOnline: boolean;
  lastActive: string;
  mutualConnections: number;
  location: string;
  languages: string[];
  achievements: string[];
}

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  nextSession: Date;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  creator: string;
  isPrivate: boolean;
  joinRequests: number;
  activeDiscussions: number;
}

interface CollaborativeProject {
  id: string;
  title: string;
  subject: string;
  description: string;
  teamSize: number;
  maxTeamSize: number;
  skillsNeeded: string[];
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  deadline: Date;
  progress: number;
  coordinator: string;
  status: 'recruiting' | 'in-progress' | 'review' | 'completed';
}

interface StudyBuddy {
  id: string;
  name: string;
  avatar: string;
  compatibility: number;
  sharedSubjects: string[];
  studyHours: string;
  timezone: string;
  studyStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  responseTime: string;
  sessionCount: number;
  lastInteraction: string;
}

const PeerLearningNetwork: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'explore' | 'groups' | 'projects' | 'buddies'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Create Group/Project Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'group' | 'project' | null>(null);

  // Study Group Form States
  const [groupName, setGroupName] = useState('');
  const [groupSubject, setGroupSubject] = useState('Mathematics');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupMaxMembers, setGroupMaxMembers] = useState('30');
  const [groupDifficulty, setGroupDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [groupTags, setGroupTags] = useState<string[]>([]);
  const [groupIsPrivate, setGroupIsPrivate] = useState(false);
  const [groupNextSession, setGroupNextSession] = useState('');

  // Project Form States
  const [projectTitle, setProjectTitle] = useState('');
  const [projectSubject, setProjectSubject] = useState('Mathematics');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectMaxTeamSize, setProjectMaxTeamSize] = useState('5');
  const [projectDifficulty, setProjectDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [projectSkills, setProjectSkills] = useState<string[]>([]);
  const [projectDuration, setProjectDuration] = useState('4 weeks');
  const [projectDeadline, setProjectDeadline] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data states
  const [peers, setPeers] = useState<PeerProfile[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [collaborativeProjects, setCollaborativeProjects] = useState<CollaborativeProject[]>([]);
  const [studyBuddies, setStudyBuddies] = useState<StudyBuddy[]>([]);

  useEffect(() => {
    initializeScreen();
    setupBackHandler();
    return cleanup;
  }, []);

  const initializeScreen = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const result = await PeerLearningService.getPeerLearningData(user.id);

      if (result.success && result.data) {
        setPeers(result.data.peers);
        setStudyGroups(result.data.studyGroups);
        setCollaborativeProjects(result.data.collaborativeProjects);
        setStudyBuddies(result.data.studyBuddies);

        showSnackbar('Peer learning network loaded successfully');
      } else {
        showSnackbar(result.error || 'Failed to load peer learning data');
      }
    } catch (error) {
      console.error('Error initializing screen:', error);
      showSnackbar('Failed to load peer learning data');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleGoBack = () => {
    // Since we don't have navigation prop, we'll just show a message
    // In a real app with React Navigation, this would be navigation.goBack()
    showSnackbar('Going back...');
    // For now, just exit the app if this is the root screen
    BackHandler.exitApp();
  };

  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleGoBack();
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

  const handleCreateStudyGroup = async () => {
    // Validation
    if (!groupName.trim()) {
      showSnackbar('Please enter a group name');
      return;
    }
    if (!groupDescription.trim()) {
      showSnackbar('Please enter a description');
      return;
    }
    if (!groupNextSession) {
      showSnackbar('Please select a date for the next session');
      return;
    }

    if (!user?.id) {
      showSnackbar('User not authenticated');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate next session date (for demo, use 7 days from now)
      const nextSessionDate = new Date();
      nextSessionDate.setDate(nextSessionDate.getDate() + 7);

      const result = await PeerLearningService.createStudyGroup({
        name: groupName,
        subject: groupSubject,
        description: groupDescription,
        maxMembers: parseInt(groupMaxMembers) || 30,
        difficulty: groupDifficulty,
        tags: groupTags,
        isPrivate: groupIsPrivate,
        nextSession: nextSessionDate,
        creatorId: user.id,
        creatorName: user.name || 'Unknown',
      });

      if (result.success) {
        showSnackbar('Study group created successfully! 🎉');
        setShowCreateModal(false);
        // Reset form
        setGroupName('');
        setGroupDescription('');
        setGroupTags([]);
        // Refresh data
        initializeScreen();
      } else {
        showSnackbar(result.error || 'Failed to create study group');
      }
    } catch (error) {
      console.error('Error creating study group:', error);
      showSnackbar('An error occurred while creating the group');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProject = async () => {
    // Validation
    if (!projectTitle.trim()) {
      showSnackbar('Please enter a project title');
      return;
    }
    if (!projectDescription.trim()) {
      showSnackbar('Please enter a description');
      return;
    }
    if (!projectDeadline) {
      showSnackbar('Please select a deadline');
      return;
    }
    if (projectSkills.length === 0) {
      showSnackbar('Please add at least one required skill');
      return;
    }

    if (!user?.id) {
      showSnackbar('User not authenticated');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate deadline (for demo, use 30 days from now)
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + 30);

      const result = await PeerLearningService.createProject({
        title: projectTitle,
        subject: projectSubject,
        description: projectDescription,
        maxTeamSize: parseInt(projectMaxTeamSize) || 5,
        skillsNeeded: projectSkills,
        duration: projectDuration,
        difficulty: projectDifficulty,
        deadline: deadlineDate,
        coordinatorId: user.id,
        coordinatorName: user.name || 'Unknown',
      });

      if (result.success) {
        showSnackbar('Project created successfully! 🎉');
        setShowCreateModal(false);
        // Reset form
        setProjectTitle('');
        setProjectDescription('');
        setProjectSkills([]);
        // Refresh data
        initializeScreen();
      } else {
        showSnackbar(result.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      showSnackbar('An error occurred while creating the project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: LightTheme.Primary }}>
      <Appbar.BackAction onPress={handleGoBack} color="#FFFFFF" />
      <Appbar.Content
        title="Peer Learning Network"
        titleStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
        subtitle="Connect • Collaborate • Learn Together"
        subtitleStyle={{ color: '#FFFFFF', opacity: 0.9 }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: Spacing.SM }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isOnline ? '#E8F5E8' : '#F5F5F5',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
          marginRight: 8,
        }}>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: '#CCC', true: '#4CAF50' }}
            thumbColor="#FFFFFF"
            style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
          />
        </View>
        <Appbar.Action icon="notifications" onPress={() => {}} color="#FFFFFF" />
      </View>
    </Appbar.Header>
  );

  const renderPeerCard = (peer: PeerProfile) => (
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
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.SM }}>
        <Text style={{ fontSize: 32, marginRight: Spacing.SM }}>{peer.avatar}</Text>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={[Typography.bodyLarge, { fontWeight: '600' }]}>{peer.name}</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: peer.isOnline ? '#E8F5E8' : '#F5F5F5',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: peer.isOnline ? '#4CAF50' : '#999',
                marginRight: 4,
              }} />
              <Text style={[Typography.bodySmall, {
                color: peer.isOnline ? '#4CAF50' : '#666',
                fontSize: 10,
              }]}>
                {peer.isOnline ? 'Online' : peer.lastActive}
              </Text>
            </View>
          </View>
          <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant }]}>
            {peer.grade} • {peer.location}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Icon name="star" size={14} color="#FFB300" />
            <Text style={[Typography.bodySmall, { marginLeft: 2, color: '#FFB300' }]}>
              {peer.rating}
            </Text>
            <Text style={[Typography.bodySmall, { marginLeft: 8, color: LightTheme.OnSurfaceVariant }]}>
              {peer.totalSessions} sessions
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginBottom: Spacing.SM }}>
        <Text style={[Typography.bodySmall, { fontWeight: '600', marginBottom: 4 }]}>Subjects:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {peer.subjects.map((subject, index) => (
            <View key={index} style={{
              backgroundColor: LightTheme.Primary + '20',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              marginRight: 6,
              marginBottom: 4,
            }}>
              <Text style={[Typography.bodySmall, { color: LightTheme.Primary, fontSize: 10 }]}>
                {subject}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ marginBottom: Spacing.SM }}>
        <Text style={[Typography.bodySmall, { fontWeight: '600', marginBottom: 4 }]}>Strengths:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {peer.strengths.slice(0, 3).map((strength, index) => (
            <View key={index} style={{
              backgroundColor: '#E8F5E8',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              marginRight: 6,
              marginBottom: 4,
            }}>
              <Text style={[Typography.bodySmall, { color: '#2E7D32', fontSize: 10 }]}>
                {strength}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant }]}>
          {peer.mutualConnections} mutual connections
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={{
            backgroundColor: LightTheme.Primary + '20',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            marginRight: 8,
          }}>
            <Text style={[Typography.bodySmall, { color: LightTheme.Primary, fontWeight: '600' }]}>
              Connect
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            backgroundColor: LightTheme.Primary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
          }}>
            <Text style={[Typography.bodySmall, { color: LightTheme.OnPrimary, fontWeight: '600' }]}>
              Message
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStudyGroupCard = (group: StudyGroup) => (
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
          <Text style={[Typography.titleMedium, { fontWeight: '600' }]}>{group.name}</Text>
          <Text style={[Typography.bodySmall, { color: LightTheme.Primary, marginTop: 2 }]}>
            {group.subject}
          </Text>
        </View>
        <View style={{
          backgroundColor: group.difficulty === 'advanced' ? '#E3F2FD' : group.difficulty === 'intermediate' ? '#FFF3E0' : '#E8F5E8',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <Text style={[Typography.bodySmall, {
            color: group.difficulty === 'advanced' ? '#1976D2' : group.difficulty === 'intermediate' ? '#F57C00' : '#388E3C',
            fontSize: 10,
            textTransform: 'capitalize',
          }]}>
            {group.difficulty}
          </Text>
        </View>
      </View>

      <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant, marginBottom: Spacing.SM }]}>
        {group.description}
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.SM }}>
        {group.tags.map((tag, index) => (
          <View key={index} style={{
            backgroundColor: LightTheme.SecondaryContainer,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            marginRight: 6,
            marginBottom: 4,
          }}>
            <Text style={[Typography.bodySmall, { color: LightTheme.OnSecondaryContainer, fontSize: 10 }]}>
              {tag}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.SM }}>
        <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant }]}>
          {group.memberCount}/{group.maxMembers} members
        </Text>
        <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant }]}>
          Next session: {group.nextSession.toLocaleDateString('hi-IN')}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="message" size={16} color={LightTheme.OnSurfaceVariant} />
          <Text style={[Typography.bodySmall, { marginLeft: 4, color: LightTheme.OnSurfaceVariant }]}>
            {group.activeDiscussions} active discussions
          </Text>
        </View>
        <TouchableOpacity style={{
          backgroundColor: LightTheme.Primary,
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderRadius: 20,
        }}>
          <Text style={[Typography.bodySmall, { color: LightTheme.OnPrimary, fontWeight: '600' }]}>
            Join Group
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProjectCard = (project: CollaborativeProject) => (
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
          <Text style={[Typography.titleMedium, { fontWeight: '600' }]}>{project.title}</Text>
          <Text style={[Typography.bodySmall, { color: LightTheme.Primary, marginTop: 2 }]}>
            {project.subject}
          </Text>
        </View>
        <View style={{
          backgroundColor: project.status === 'recruiting' ? '#E3F2FD' : project.status === 'in-progress' ? '#FFF3E0' : '#E8F5E8',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <Text style={[Typography.bodySmall, {
            color: project.status === 'recruiting' ? '#1976D2' : project.status === 'in-progress' ? '#F57C00' : '#388E3C',
            fontSize: 10,
            textTransform: 'capitalize',
          }]}>
            {project.status.replace('-', ' ')}
          </Text>
        </View>
      </View>

      <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant, marginBottom: Spacing.SM }]}>
        {project.description}
      </Text>

      <View style={{ marginBottom: Spacing.SM }}>
        <Text style={[Typography.bodySmall, { fontWeight: '600', marginBottom: 4 }]}>Skills Needed:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {project.skillsNeeded.map((skill, index) => (
            <View key={index} style={{
              backgroundColor: LightTheme.TertiaryContainer,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              marginRight: 6,
              marginBottom: 4,
            }}>
              <Text style={[Typography.bodySmall, { color: LightTheme.OnTertiaryContainer, fontSize: 10 }]}>
                {skill}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.SM }}>
        <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant }]}>
          Team: {project.teamSize}/{project.maxTeamSize}
        </Text>
        <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant }]}>
          Duration: {project.duration}
        </Text>
      </View>

      {project.status === 'in-progress' && (
        <View style={{ marginBottom: Spacing.SM }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Text style={[Typography.bodySmall, { fontWeight: '600' }]}>Progress</Text>
            <Text style={[Typography.bodySmall, { color: LightTheme.Primary }]}>
              {project.progress}%
            </Text>
          </View>
          <View style={{
            height: 8,
            backgroundColor: LightTheme.SurfaceVariant,
            borderRadius: 4,
          }}>
            <View style={{
              height: '100%',
              width: `${project.progress}%`,
              backgroundColor: LightTheme.Primary,
              borderRadius: 4,
            }} />
          </View>
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant }]}>
          Deadline: {project.deadline.toLocaleDateString('hi-IN')}
        </Text>
        <TouchableOpacity style={{
          backgroundColor: project.status === 'recruiting' ? LightTheme.Primary : LightTheme.Secondary,
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderRadius: 20,
        }}>
          <Text style={[Typography.bodySmall, {
            color: project.status === 'recruiting' ? LightTheme.OnPrimary : LightTheme.OnSecondary,
            fontWeight: '600'
          }]}>
            {project.status === 'recruiting' ? 'Join Project' : 'View Project'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStudyBuddyCard = (buddy: StudyBuddy) => (
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
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.SM }}>
        <Text style={{ fontSize: 32, marginRight: Spacing.SM }}>{buddy.avatar}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[Typography.titleMedium, { fontWeight: '600' }]}>{buddy.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <View style={{
              backgroundColor: '#E8F5E8',
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 12,
              marginRight: 8,
            }}>
              <Text style={[Typography.bodySmall, { color: '#2E7D32', fontSize: 10, fontWeight: '600' }]}>
                {buddy.compatibility}% match
              </Text>
            </View>
            <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant }]}>
              {buddy.sessionCount} sessions together
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginBottom: Spacing.SM }}>
        <Text style={[Typography.bodySmall, { fontWeight: '600', marginBottom: 4 }]}>Shared Subjects:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {buddy.sharedSubjects.map((subject, index) => (
            <View key={index} style={{
              backgroundColor: LightTheme.PrimaryContainer,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              marginRight: 6,
              marginBottom: 4,
            }}>
              <Text style={[Typography.bodySmall, { color: LightTheme.OnPrimaryContainer, fontSize: 10 }]}>
                {subject}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.SM }}>
        <View style={{ flex: 1 }}>
          <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant }]}>
            Study Hours: {buddy.studyHours}
          </Text>
          <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant, marginTop: 2 }]}>
            Response Time: {buddy.responseTime}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant }]}>
            Study Style: {buddy.studyStyle}
          </Text>
          <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant, marginTop: 2 }]}>
            Last Active: {buddy.lastInteraction}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity style={{
          backgroundColor: LightTheme.Secondary + '30',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          marginRight: 8,
          flex: 1,
        }}>
          <Text style={[Typography.bodySmall, { 
            color: LightTheme.Secondary, 
            fontWeight: '600', 
            textAlign: 'center' 
          }]}>
            Schedule Study
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor: LightTheme.Primary,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          flex: 1,
        }}>
          <Text style={[Typography.bodySmall, { 
            color: LightTheme.OnPrimary, 
            fontWeight: '600', 
            textAlign: 'center' 
          }]}>
            Start Session
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'explore':
        return (
          <FlatList
            data={peers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderPeerCard(item)}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'groups':
        return (
          <FlatList
            data={studyGroups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderStudyGroupCard(item)}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'projects':
        return (
          <FlatList
            data={collaborativeProjects}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderProjectCard(item)}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'buddies':
        return (
          <FlatList
            data={studyBuddies}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderStudyBuddyCard(item)}
            showsVerticalScrollIndicator={false}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
        <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
        {renderAppBar()}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={LightTheme.Primary} />
          <Text style={{ ...Typography.bodyLarge, color: LightTheme.OnSurfaceVariant, marginTop: Spacing.LG }}>
            Loading peer network...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
      <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
      {renderAppBar()}

      {/* Search and Filter */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.LG,
        paddingVertical: Spacing.MD,
      }}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: LightTheme.Surface,
          borderRadius: 25,
          paddingHorizontal: Spacing.MD,
          elevation: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        }}>
          <Icon name="search" size={20} color={LightTheme.OnSurfaceVariant} />
          <TextInput
            placeholder="Search peers, groups, or projects..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[
              Typography.bodyMedium,
              {
                flex: 1,
                paddingHorizontal: Spacing.SM,
                paddingVertical: Spacing.SM,
                color: LightTheme.OnSurface,
              },
            ]}
          />
        </View>
        <TouchableOpacity
          onPress={() => setShowFilters(true)}
          style={{
            backgroundColor: LightTheme.Primary,
            padding: 10,
            borderRadius: 25,
            marginLeft: Spacing.SM,
          }}
        >
          <Icon name="tune" size={20} color={LightTheme.OnPrimary} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: LightTheme.Surface,
        marginHorizontal: Spacing.LG,
        borderRadius: 25,
        padding: 4,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      }}>
        {[
          { key: 'explore', label: 'Explore', icon: 'explore' },
          { key: 'groups', label: 'Groups', icon: 'group' },
          { key: 'projects', label: 'Projects', icon: 'assignment' },
          { key: 'buddies', label: 'Buddies', icon: 'people' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key as any)}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 8,
              paddingHorizontal: 4,
              borderRadius: 20,
              backgroundColor: activeTab === tab.key ? LightTheme.Primary : 'transparent',
            }}
          >
            <Icon
              name={tab.icon}
              size={16}
              color={activeTab === tab.key ? LightTheme.OnPrimary : LightTheme.OnSurfaceVariant}
            />
            <Text style={[
              Typography.bodySmall,
              {
                marginLeft: 4,
                color: activeTab === tab.key ? LightTheme.OnPrimary : LightTheme.OnSurfaceVariant,
                fontWeight: activeTab === tab.key ? '600' : '400',
                fontSize: 10,
              },
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: Spacing.LG, paddingTop: Spacing.MD }}>
        {renderTabContent()}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: LightTheme.Primary,
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        }}
        onPress={() => {
          Alert.alert(
            'Create New',
            'What would you like to create?',
            [
              {
                text: 'Study Group',
                onPress: () => {
                  setCreateType('group');
                  setShowCreateModal(true);
                }
              },
              {
                text: 'Project',
                onPress: () => {
                  setCreateType('project');
                  setShowCreateModal(true);
                }
              },
              { text: 'Cancel', style: 'cancel' },
            ],
          );
        }}
      >
        <Icon name="add" size={28} color={LightTheme.OnPrimary} />
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal visible={showFilters} transparent animationType="slide">
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
            maxHeight: '80%',
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: Spacing.LG,
            }}>
              <Text style={[Typography.titleMedium, { fontWeight: '600' }]}>
                Filters
              </Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Icon name="close" size={24} color={LightTheme.OnSurface} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ marginBottom: Spacing.MD }}>
                <Text style={[Typography.bodyMedium, { fontWeight: '600', marginBottom: Spacing.SM }]}>
                  Subject
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'].map((subject) => (
                    <TouchableOpacity
                      key={subject}
                      style={{
                        backgroundColor: selectedFilters.includes(subject) ? LightTheme.Primary : LightTheme.SurfaceVariant,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                        marginRight: 8,
                        marginBottom: 8,
                      }}
                      onPress={() => {
                        if (selectedFilters.includes(subject)) {
                          setSelectedFilters(selectedFilters.filter(f => f !== subject));
                        } else {
                          setSelectedFilters([...selectedFilters, subject]);
                        }
                      }}
                    >
                      <Text style={[
                        Typography.bodySmall,
                        {
                          color: selectedFilters.includes(subject) ? LightTheme.OnPrimary : LightTheme.OnSurfaceVariant,
                          fontWeight: selectedFilters.includes(subject) ? '600' : '400',
                        },
                      ]}>
                        {subject}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={{
                backgroundColor: LightTheme.Primary,
                paddingVertical: 12,
                borderRadius: 25,
                alignItems: 'center',
                marginTop: Spacing.MD,
              }}
              onPress={() => setShowFilters(false)}
            >
              <Text style={[Typography.bodyMedium, { color: LightTheme.OnPrimary, fontWeight: '600' }]}>
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Create Group/Project Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
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
            maxHeight: '90%',
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: Spacing.LG,
            }}>
              <Text style={[Typography.titleLarge, { fontWeight: '600' }]}>
                {createType === 'group' ? 'Create Study Group' : 'Create Project'}
              </Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Icon name="close" size={24} color={LightTheme.OnSurface} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {createType === 'group' ? (
                // Study Group Form
                <>
                  <View style={{ marginBottom: Spacing.MD }}>
                    <Text style={[Typography.bodyMedium, { fontWeight: '600', marginBottom: 4 }]}>
                      Group Name *
                    </Text>
                    <TextInput
                      placeholder="e.g., JEE Advanced Physics Study Group"
                      value={groupName}
                      onChangeText={setGroupName}
                      style={{
                        borderWidth: 1,
                        borderColor: LightTheme.OutlineVariant,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        fontSize: 14,
                        backgroundColor: LightTheme.SurfaceVariant,
                      }}
                    />
                  </View>

                  <View style={{ marginBottom: Spacing.MD }}>
                    <Text style={[Typography.bodyMedium, { fontWeight: '600', marginBottom: 4 }]}>
                      Subject
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'].map((subject) => (
                        <TouchableOpacity
                          key={subject}
                          style={{
                            backgroundColor: groupSubject === subject ? LightTheme.Primary : LightTheme.SurfaceVariant,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 20,
                            marginRight: 8,
                            marginBottom: 8,
                          }}
                          onPress={() => setGroupSubject(subject)}
                        >
                          <Text style={[
                            Typography.bodySmall,
                            { color: groupSubject === subject ? LightTheme.OnPrimary : LightTheme.OnSurfaceVariant }
                          ]}>
                            {subject}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={{ marginBottom: Spacing.MD }}>
                    <Text style={[Typography.bodyMedium, { fontWeight: '600', marginBottom: 4 }]}>
                      Description *
                    </Text>
                    <TextInput
                      placeholder="Describe the group's focus and goals..."
                      value={groupDescription}
                      onChangeText={setGroupDescription}
                      multiline
                      numberOfLines={4}
                      style={{
                        borderWidth: 1,
                        borderColor: LightTheme.OutlineVariant,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        fontSize: 14,
                        backgroundColor: LightTheme.SurfaceVariant,
                        textAlignVertical: 'top',
                      }}
                    />
                  </View>

                  <View style={{ marginBottom: Spacing.MD }}>
                    <Text style={[Typography.bodyMedium, { fontWeight: '600', marginBottom: 4 }]}>
                      Difficulty Level
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                      {['beginner', 'intermediate', 'advanced'].map((level) => (
                        <TouchableOpacity
                          key={level}
                          style={{
                            flex: 1,
                            backgroundColor: groupDifficulty === level ? LightTheme.Primary : LightTheme.SurfaceVariant,
                            paddingVertical: 10,
                            borderRadius: 8,
                            marginRight: 8,
                            alignItems: 'center',
                          }}
                          onPress={() => setGroupDifficulty(level as 'beginner' | 'intermediate' | 'advanced')}
                        >
                          <Text style={[
                            Typography.bodySmall,
                            { color: groupDifficulty === level ? LightTheme.OnPrimary : LightTheme.OnSurfaceVariant, textTransform: 'capitalize' }
                          ]}>
                            {level}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={{ marginBottom: Spacing.MD }}>
                    <Text style={[Typography.bodyMedium, { fontWeight: '600', marginBottom: 4 }]}>
                      Max Members
                    </Text>
                    <TextInput
                      placeholder="30"
                      value={groupMaxMembers}
                      onChangeText={setGroupMaxMembers}
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderColor: LightTheme.OutlineVariant,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        fontSize: 14,
                        backgroundColor: LightTheme.SurfaceVariant,
                      }}
                    />
                  </View>

                  <View style={{ marginBottom: Spacing.MD }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={[Typography.bodyMedium, { fontWeight: '600' }]}>
                        Private Group
                      </Text>
                      <Switch
                        value={groupIsPrivate}
                        onValueChange={setGroupIsPrivate}
                        trackColor={{ false: '#CCC', true: LightTheme.Primary }}
                        thumbColor="#FFFFFF"
                      />
                    </View>
                    <Text style={[Typography.bodySmall, { color: LightTheme.OnSurfaceVariant, marginTop: 4 }]}>
                      Private groups require approval to join
                    </Text>
                  </View>

                  <View style={{ marginBottom: Spacing.MD }}>
                    <Text style={[Typography.bodyMedium, { fontWeight: '600', marginBottom: 4 }]}>
                      Next Session Date *
                    </Text>
                    <TextInput
                      placeholder="DD/MM/YYYY (e.g., 25/10/2025)"
                      value={groupNextSession}
                      onChangeText={setGroupNextSession}
                      style={{
                        borderWidth: 1,
                        borderColor: LightTheme.OutlineVariant,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        fontSize: 14,
                        backgroundColor: LightTheme.SurfaceVariant,
                      }}
                    />
                  </View>
                </>
              ) : (
                // Project Form
                <>
                  <View style={{ marginBottom: Spacing.MD }}>
                    <Text style={[Typography.bodyMedium, { fontWeight: '600', marginBottom: 4 }]}>
                      Project Title *
                    </Text>
                    <TextInput
                      placeholder="e.g., Interactive Physics Simulator"
                      value={projectTitle}
                      onChangeText={setProjectTitle}
                      style={{
                        borderWidth: 1,
                        borderColor: LightTheme.OutlineVariant,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        fontSize: 14,
                        backgroundColor: LightTheme.SurfaceVariant,
                      }}
                    />
                  </View>

                  <View style={{ marginBottom: Spacing.MD }}>
                    <Text style={[Typography.bodyMedium, { fontWeight: '600', marginBottom: 4 }]}>
                      Subject
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'].map((subject) => (
                        <TouchableOpacity
                          key={subject}
                          style={{
                            backgroundColor: projectSubject === subject ? LightTheme.Primary : LightTheme.SurfaceVariant,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 20,
                            marginRight: 8,
                            marginBottom: 8,
                          }}
                          onPress={() => setProjectSubject(subject)}
                        >
                          <Text style={[
                            Typography.bodySmall,
                            { color: projectSubject === subject ? LightTheme.OnPrimary : LightTheme.OnSurfaceVariant }
                          ]}>
                            {subject}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={{ marginBottom: Spacing.MD }}>
                    <Text style={[Typography.bodyMedium, { fontWeight: '600', marginBottom: 4 }]}>
                      Description *
                    </Text>
                    <TextInput
                      placeholder="Describe the project goals and deliverables..."
                      value={projectDescription}
                      onChangeText={setProjectDescription}
                      multiline
                      numberOfLines={4}
                      style={{
                        borderWidth: 1,
                        borderColor: LightTheme.OutlineVariant,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        fontSize: 14,
                        backgroundColor: LightTheme.SurfaceVariant,
                        textAlignVertical: 'top',
                      }}
                    />
                  </View>

                  <View style={{ marginBottom: Spacing.MD }}>
                    <Text style={[Typography.bodyMedium, { fontWeight: '600', marginBottom: 4 }]}>
                      Difficulty Level
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                      {['beginner', 'intermediate', 'advanced'].map((level) => (
                        <TouchableOpacity
                          key={level}
                          style={{
                            flex: 1,
                            backgroundColor: projectDifficulty === level ? LightTheme.Primary : LightTheme.SurfaceVariant,
                            paddingVertical: 10,
                            borderRadius: 8,
                            marginRight: 8,
                            alignItems: 'center',
                          }}
                          onPress={() => setProjectDifficulty(level as 'beginner' | 'intermediate' | 'advanced')}
                        >
                          <Text style={[
                            Typography.bodySmall,
                            { color: projectDifficulty === level ? LightTheme.OnPrimary : LightTheme.OnSurfaceVariant, textTransform: 'capitalize' }
                          ]}>
                            {level}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={{ marginBottom: Spacing.MD }}>
                    <Text style={[Typography.bodyMedium, { fontWeight: '600', marginBottom: 4 }]}>
                      Max Team Size
                    </Text>
                    <TextInput
                      placeholder="5"
                      value={projectMaxTeamSize}
                      onChangeText={setProjectMaxTeamSize}
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderColor: LightTheme.OutlineVariant,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        fontSize: 14,
                        backgroundColor: LightTheme.SurfaceVariant,
                      }}
                    />
                  </View>

                  <View style={{ marginBottom: Spacing.MD }}>
                    <Text style={[Typography.bodyMedium, { fontWeight: '600', marginBottom: 4 }]}>
                      Duration
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {['2 weeks', '4 weeks', '6 weeks', '8 weeks'].map((duration) => (
                        <TouchableOpacity
                          key={duration}
                          style={{
                            backgroundColor: projectDuration === duration ? LightTheme.Primary : LightTheme.SurfaceVariant,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 20,
                            marginRight: 8,
                            marginBottom: 8,
                          }}
                          onPress={() => setProjectDuration(duration)}
                        >
                          <Text style={[
                            Typography.bodySmall,
                            { color: projectDuration === duration ? LightTheme.OnPrimary : LightTheme.OnSurfaceVariant }
                          ]}>
                            {duration}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={{ marginBottom: Spacing.MD }}>
                    <Text style={[Typography.bodyMedium, { fontWeight: '600', marginBottom: 4 }]}>
                      Skills Needed * (tap to add/remove)
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {['Research', 'Coding', 'Design', 'Writing', 'Presentation', 'Analysis'].map((skill) => (
                        <TouchableOpacity
                          key={skill}
                          style={{
                            backgroundColor: projectSkills.includes(skill) ? LightTheme.Primary : LightTheme.SurfaceVariant,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 20,
                            marginRight: 8,
                            marginBottom: 8,
                          }}
                          onPress={() => {
                            if (projectSkills.includes(skill)) {
                              setProjectSkills(projectSkills.filter(s => s !== skill));
                            } else {
                              setProjectSkills([...projectSkills, skill]);
                            }
                          }}
                        >
                          <Text style={[
                            Typography.bodySmall,
                            { color: projectSkills.includes(skill) ? LightTheme.OnPrimary : LightTheme.OnSurfaceVariant }
                          ]}>
                            {skill}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={{ marginBottom: Spacing.MD }}>
                    <Text style={[Typography.bodyMedium, { fontWeight: '600', marginBottom: 4 }]}>
                      Deadline *
                    </Text>
                    <TextInput
                      placeholder="DD/MM/YYYY (e.g., 15/11/2025)"
                      value={projectDeadline}
                      onChangeText={setProjectDeadline}
                      style={{
                        borderWidth: 1,
                        borderColor: LightTheme.OutlineVariant,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        fontSize: 14,
                        backgroundColor: LightTheme.SurfaceVariant,
                      }}
                    />
                  </View>
                </>
              )}
            </ScrollView>

            <TouchableOpacity
              style={{
                backgroundColor: isSubmitting ? LightTheme.SurfaceVariant : LightTheme.Primary,
                paddingVertical: 12,
                borderRadius: 25,
                alignItems: 'center',
                marginTop: Spacing.MD,
              }}
              onPress={createType === 'group' ? handleCreateStudyGroup : handleCreateProject}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={LightTheme.OnPrimary} />
              ) : (
                <Text style={[Typography.bodyMedium, { color: LightTheme.OnPrimary, fontWeight: '600' }]}>
                  {createType === 'group' ? 'Create Study Group' : 'Create Project'}
                </Text>
              )}
            </TouchableOpacity>
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

export default PeerLearningNetwork;
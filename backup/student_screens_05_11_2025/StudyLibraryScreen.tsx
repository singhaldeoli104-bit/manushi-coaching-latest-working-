/**
 * StudyLibraryScreen - Phase 43.1: Study Library Implementation
 * Digital resource browser with search, offline download, and note-taking
 * Subject-wise content organization and bookmark system
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  BackHandler,
  Alert,
  Dimensions,
  Modal,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import {
  Appbar,
  Portal,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { getStudyMaterials } from '../../services/studyMaterialsService';

const { width } = Dimensions.get('window');

export interface StudyLibraryScreenProps {
  navigation?: any;
  route?: any;
  userId?: string;
  userName?: string;
  onNavigate?: (screen: string) => void;
  onNavigateBack?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToSettings?: () => void;
}

interface Resource {
  id: string;
  title: string;
  subject: string;
  type: 'pdf' | 'video' | 'audio' | 'document' | 'presentation' | 'image';
  size: string;
  uploadDate: string;
  author: string;
  description: string;
  tags: string[];
  isBookmarked: boolean;
  isDownloaded: boolean;
  downloadProgress?: number;
  rating: number;
  downloads: number;
  thumbnail?: string;
}

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  resourceCount: number;
}

interface Note {
  id: string;
  resourceId: string;
  content: string;
  page?: number;
  timestamp: string;
  color: string;
}

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'bookmarked' | 'downloaded' | 'recent';
type SortType = 'name' | 'date' | 'size' | 'rating';

export const StudyLibraryScreen: React.FC<StudyLibraryScreenProps> = ({
  navigation,
  route,
  userId,
  userName = 'Student',
  onNavigate,
  onNavigateBack,
  onNavigateToProfile,
  onNavigateToSettings,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  // Screen state management
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('date');
  const [resources, setResources] = useState<Resource[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [currentResourceId, setCurrentResourceId] = useState<string | null>(null);
  const [showResourceModal, setShowResourceModal] = useState(false);

  // Initialize screen
  useEffect(() => {
    initializeScreen();
    setupBackHandler();

    return cleanup;
  }, []);

  // Filter resources when dependencies change
  useEffect(() => {
    filterAndSortResources();
  }, [searchQuery, selectedSubject, filterType, sortType, resources]);

  // Screen initialization
  const initializeScreen = useCallback(async () => {
    setIsLoading(true);

    try {
      await loadLibraryData();
    } catch (error) {
      console.error('Error initializing screen:', error);
      showSnackbar('Failed to initialize library');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Back button handler
  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showFilterModal) {
        setShowFilterModal(false);
        return true;
      }

      if (onNavigateBack) {
        onNavigateBack();
        return true;
      }

      return false;
    });

    return () => backHandler.remove();
  }, [showFilterModal, onNavigateBack]);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Cleanup if needed
  }, []);

  // Load library data
  const loadLibraryData = useCallback(async () => {
    try {
      // Load cached data first
      const cached = await AsyncStorage.getItem('study_library_data');
      if (cached) {
        const data = JSON.parse(cached);
        setSubjects(data.subjects || []);
        setResources(data.resources || []);
        setNotes(data.notes || []);
      }

      // Fetch real data from Supabase
      const { data: studyMaterials, error, success } = await getStudyMaterials();

      if (!success || error) {
        console.error('Error fetching study materials:', error);
        showSnackbar('Failed to load resources from database');
        return;
      }

      // Transform Supabase data to match Resource interface
      const transformedResources: Resource[] = (studyMaterials || []).map(material => ({
        id: material.id,
        title: material.title,
        subject: material.subject_code?.toLowerCase() || 'general',
        type: material.type as 'pdf' | 'video' | 'audio' | 'document' | 'presentation' | 'image',
        size: material.file_size || 'Unknown',
        uploadDate: material.upload_date || new Date().toISOString().split('T')[0],
        author: material.author || 'Unknown',
        description: material.description || 'No description available',
        tags: material.tags || [],
        isBookmarked: false, // Will be loaded from user preferences later
        isDownloaded: false,
        rating: material.rating ? Number(material.rating) : 0,
        downloads: material.downloads_count || 0,
      }));

      // Define subjects based on data
      const uniqueSubjects = Array.from(
        new Set(transformedResources.map(r => r.subject))
      );

      const subjectMap: Record<string, { name: string; icon: string; color: string }> = {
        math: { name: 'Mathematics', icon: 'functions', color: '#2196F3' },
        phys: { name: 'Physics', icon: 'science', color: '#4CAF50' },
        chem: { name: 'Chemistry', icon: 'biotech', color: '#FF9800' },
        bio: { name: 'Biology', icon: 'eco', color: '#8BC34A' },
        eng: { name: 'English', icon: 'menu-book', color: '#9C27B0' },
        cs: { name: 'Computer Science', icon: 'computer', color: '#6200EE' },
      };

      const dynamicSubjects: Subject[] = [
        {
          id: 'all',
          name: 'All Subjects',
          icon: 'library-books',
          color: '#6200EE',
          resourceCount: transformedResources.length
        },
        ...uniqueSubjects
          .filter(subject => subject in subjectMap)
          .map(subject => ({
            id: subject,
            name: subjectMap[subject].name,
            icon: subjectMap[subject].icon,
            color: subjectMap[subject].color,
            resourceCount: transformedResources.filter(r => r.subject === subject).length,
          })),
      ];

      // Empty notes for now - will be implemented later
      const emptyNotes: Note[] = [];

      setSubjects(dynamicSubjects);
      setResources(transformedResources);
      setNotes(emptyNotes);

      // Cache the data
      await AsyncStorage.setItem('study_library_data', JSON.stringify({
        subjects: dynamicSubjects,
        resources: transformedResources,
        notes: emptyNotes,
      }));

      console.log(`✅ Loaded ${transformedResources.length} study materials from Supabase`);
    } catch (error) {
      console.error('Error loading library data:', error);
      throw error;
    }
  }, []);

  // Filter and sort resources
  const filterAndSortResources = useCallback(() => {
    let filtered = resources;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        resource.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(resource => resource.subject === selectedSubject);
    }

    // Apply type filter
    switch (filterType) {
      case 'bookmarked':
        filtered = filtered.filter(resource => resource.isBookmarked);
        break;
      case 'downloaded':
        filtered = filtered.filter(resource => resource.isDownloaded);
        break;
      case 'recent':
        filtered = filtered.filter(resource => {
          const uploadDate = new Date(resource.uploadDate);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return uploadDate > weekAgo;
        });
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortType) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'size':
          return parseFloat(b.size) - parseFloat(a.size);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredResources(filtered);
  }, [resources, searchQuery, selectedSubject, filterType, sortType]);

  // Toggle bookmark
  const toggleBookmark = useCallback(async (resourceId: string) => {
    try {
      const updatedResources = resources.map(resource =>
        resource.id === resourceId
          ? { ...resource, isBookmarked: !resource.isBookmarked }
          : resource
      );
      setResources(updatedResources);

      const resource = resources.find(r => r.id === resourceId);
      showSnackbar(
        resource?.isBookmarked
          ? `Removed from bookmarks`
          : `Added to bookmarks`
      );
    } catch (error) {
      showSnackbar('Failed to update bookmark');
    }
  }, [resources]);

  // Download resource
  const downloadResource = useCallback(async (resourceId: string) => {
    try {
      const resource = resources.find(r => r.id === resourceId);
      if (!resource) return;

      // Simulate download progress
      const updatedResources = resources.map(r =>
        r.id === resourceId ? { ...r, downloadProgress: 0 } : r
      );
      setResources(updatedResources);

      showSnackbar(`Downloading "${resource.title}"`);

      // Simulate download progress updates
      for (let progress = 0; progress <= 100; progress += 20) {
        setTimeout(() => {
          setResources(prev =>
            prev.map(r =>
              r.id === resourceId
                ? { ...r, downloadProgress: progress, isDownloaded: progress === 100 }
                : r
            )
          );

          if (progress === 100) {
            showSnackbar(`Download complete!`);
          }
        }, progress * 50);
      }
    } catch (error) {
      showSnackbar('Failed to download resource');
    }
  }, [resources]);

  // Open resource
  const openResource = useCallback((resource: Resource) => {
    setSelectedResource(resource);
    setShowResourceModal(true);
  }, []);

  // Add note
  const addNote = useCallback((resourceId: string) => {
    setCurrentResourceId(resourceId);
    setNoteText('');
    setShowNoteModal(true);
  }, []);

  // Save note
  const saveNote = useCallback(() => {
    if (noteText.trim() && currentResourceId) {
      const newNote: Note = {
        id: Date.now().toString(),
        resourceId: currentResourceId,
        content: noteText.trim(),
        timestamp: new Date().toISOString(),
        color: '#FFD54F',
      };
      setNotes([...notes, newNote]);
      setShowNoteModal(false);
      setNoteText('');
      setCurrentResourceId(null);
      showSnackbar('Note added successfully!');
    }
  }, [notes, noteText, currentResourceId]);

  // Delete note
  const deleteNote = useCallback((noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    showSnackbar('Note deleted');
  }, [notes]);

  // Open file with external app
  const openFile = useCallback(async (resource: Resource) => {
    try {
      // Demo URLs for testing - in production these would come from Supabase storage
      const demoUrls: Record<string, string> = {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        pdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        image: 'https://picsum.photos/800/600',
        document: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        presentation: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      };

      const url = demoUrls[resource.type] || demoUrls.pdf;

      // Check if the URL can be opened
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
        showSnackbar(`Opening ${resource.title}...`);
      } else {
        Alert.alert(
          'Cannot Open File',
          `No app found to open ${resource.type} files. Please install a ${resource.type === 'pdf' ? 'PDF reader' : resource.type === 'video' ? 'video player' : 'compatible app'}.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert(
        'Error',
        'Unable to open this file. Please try again or download the file first.',
        [{ text: 'OK' }]
      );
    }
  }, []);

  // Show snackbar message
  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }, []);

  // Helper functions
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'picture-as-pdf';
      case 'video':
        return 'play-circle-filled';
      case 'audio':
        return 'audiotrack';
      case 'document':
        return 'description';
      case 'presentation':
        return 'slideshow';
      case 'image':
        return 'image';
      default:
        return 'insert-drive-file';
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return '#F44336';
      case 'video':
        return '#2196F3';
      case 'audio':
        return '#FF9800';
      case 'document':
        return '#4CAF50';
      case 'presentation':
        return '#9C27B0';
      case 'image':
        return '#00BCD4';
      default:
        return theme.Outline;
    }
  };

  // Render app bar
  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: theme.Primary }}>
      <Appbar.BackAction
        color={theme.OnPrimary}
        onPress={() => {
          if (onNavigate) {
            onNavigate('back');
          } else if (onNavigateBack) {
            onNavigateBack();
          } else if (navigation?.goBack) {
            navigation.goBack();
          }
        }}
      />

      <Appbar.Content
        title="Study Library"
        titleStyle={{ color: theme.OnPrimary }}
        subtitle={`${filteredResources.length} resources`}
        subtitleStyle={{ color: theme.OnPrimary, opacity: 0.9 }}
      />

      <Appbar.Action
        icon="tune"
        color={theme.OnPrimary}
        onPress={() => setShowFilterModal(true)}
      />

      {onNavigateToProfile && (
        <Appbar.Action
          icon="account"
          color={theme.OnPrimary}
          onPress={onNavigateToProfile}
        />
      )}

      {onNavigateToSettings && (
        <Appbar.Action
          icon="cog"
          color={theme.OnPrimary}
          onPress={onNavigateToSettings}
        />
      )}
    </Appbar.Header>
  );

  // Render subject chip
  const renderSubjectChip = (subject: Subject) => (
    <TouchableOpacity
      key={subject.id}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.MD,
        paddingVertical: Spacing.SM,
        borderRadius: 20,
        backgroundColor: selectedSubject === subject.id ? subject.color : theme.Surface,
        marginRight: Spacing.SM,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }}
      onPress={() => setSelectedSubject(subject.id)}
    >
      <Icon
        name={subject.icon}
        size={16}
        color={selectedSubject === subject.id ? '#FFFFFF' : subject.color}
        style={{ marginRight: Spacing.XS }}
      />
      <Text
        style={{
          fontSize: Typography.bodyMedium.fontSize,
          fontWeight: '500',
          color: selectedSubject === subject.id ? '#FFFFFF' : theme.OnSurface,
          marginRight: Spacing.XS,
        }}
      >
        {subject.name}
      </Text>
      <Text
        style={{
          fontSize: Typography.bodySmall.fontSize,
          opacity: 0.8,
          color: selectedSubject === subject.id ? '#FFFFFF' : theme.OnSurfaceVariant,
        }}
      >
        {subject.id === 'all' ? resources.length : subject.resourceCount}
      </Text>
    </TouchableOpacity>
  );

  // Render resource card (Grid view)
  const renderResourceCard = (resource: Resource) => (
    <Animated.View
      key={resource.id}
      entering={FadeInUp.duration(300)}
      style={{
        width: (width - Spacing.LG * 2 - Spacing.MD) / 2,
        backgroundColor: theme.Surface,
        padding: Spacing.MD,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: Spacing.MD,
      }}
    >
      <TouchableOpacity onPress={() => openResource(resource)} activeOpacity={0.8}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.SM }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: getResourceTypeColor(resource.type),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={getResourceTypeIcon(resource.type)} size={20} color="#FFFFFF" />
          </View>
          <TouchableOpacity onPress={() => toggleBookmark(resource.id)}>
            <Icon
              name={resource.isBookmarked ? 'bookmark' : 'bookmark-border'}
              size={20}
              color={resource.isBookmarked ? '#FFC107' : theme.Outline}
            />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text
          style={{
            fontSize: Typography.bodyLarge.fontSize,
            fontWeight: '600',
            color: theme.OnSurface,
            marginBottom: Spacing.XS,
            lineHeight: 20,
          }}
          numberOfLines={2}
        >
          {resource.title}
        </Text>

        {/* Author */}
        <Text
          style={{
            fontSize: Typography.bodySmall.fontSize,
            color: theme.OnSurfaceVariant,
            marginBottom: Spacing.SM,
          }}
          numberOfLines={1}
        >
          {resource.author}
        </Text>

        {/* Meta */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.SM }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="star" size={14} color="#FFC107" />
            <Text style={{ fontSize: Typography.bodySmall.fontSize, color: theme.OnSurfaceVariant, marginLeft: 4 }}>
              {resource.rating}
            </Text>
          </View>
          <Text style={{ fontSize: Typography.bodySmall.fontSize, color: theme.OnSurfaceVariant }}>
            {resource.size}
          </Text>
        </View>

        {/* Actions */}
        <View>
          {resource.isDownloaded ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="download-done" size={16} color="#4CAF50" />
              <Text style={{ fontSize: Typography.labelSmall.fontSize, fontWeight: '600', color: '#4CAF50', marginLeft: 4 }}>
                Downloaded
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.Primary,
                paddingHorizontal: Spacing.SM,
                paddingVertical: 4,
                borderRadius: 12,
                alignSelf: 'flex-start',
              }}
              onPress={() => downloadResource(resource.id)}
            >
              <Icon name="download" size={16} color={theme.OnPrimary} />
              <Text style={{ fontSize: Typography.labelSmall.fontSize, fontWeight: '600', color: theme.OnPrimary, marginLeft: 4 }}>
                Download
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Progress bar */}
        {resource.downloadProgress !== undefined && resource.downloadProgress < 100 && (
          <View style={{ height: 2, backgroundColor: '#E0E0E0', borderRadius: 1, marginTop: Spacing.XS, overflow: 'hidden' }}>
            <View
              style={{
                height: '100%',
                width: `${resource.downloadProgress}%`,
                backgroundColor: theme.Primary,
                borderRadius: 1,
              }}
            />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  // Render resource list item (List view)
  const renderResourceListItem = (resource: Resource) => (
    <Animated.View
      key={resource.id}
      entering={FadeInUp.duration(300)}
      style={{
        backgroundColor: theme.Surface,
        padding: Spacing.MD,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: Spacing.MD,
      }}
    >
      <TouchableOpacity onPress={() => openResource(resource)} activeOpacity={0.8}>
        <View style={{ flexDirection: 'row', gap: Spacing.MD }}>
          {/* Icon */}
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: getResourceTypeColor(resource.type),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={getResourceTypeIcon(resource.type)} size={24} color="#FFFFFF" />
          </View>

          {/* Content */}
          <View style={{ flex: 1 }}>
            {/* Title & Bookmark */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.XS }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: Typography.bodyLarge.fontSize,
                  fontWeight: '600',
                  color: theme.OnSurface,
                  lineHeight: 20,
                  marginRight: Spacing.SM,
                }}
                numberOfLines={2}
              >
                {resource.title}
              </Text>
              <TouchableOpacity onPress={() => toggleBookmark(resource.id)}>
                <Icon
                  name={resource.isBookmarked ? 'bookmark' : 'bookmark-border'}
                  size={20}
                  color={resource.isBookmarked ? '#FFC107' : theme.Outline}
                />
              </TouchableOpacity>
            </View>

            {/* Author */}
            <Text
              style={{
                fontSize: Typography.bodySmall.fontSize,
                color: theme.OnSurfaceVariant,
                marginBottom: Spacing.XS,
              }}
              numberOfLines={1}
            >
              {resource.author}
            </Text>

            {/* Meta */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.MD, marginBottom: Spacing.SM }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="star" size={14} color="#FFC107" />
                <Text style={{ fontSize: Typography.bodySmall.fontSize, color: theme.OnSurfaceVariant, marginLeft: 4 }}>
                  {resource.rating}
                </Text>
              </View>
              <Text style={{ fontSize: Typography.bodySmall.fontSize, color: theme.OnSurfaceVariant }}>
                {resource.size}
              </Text>
              <Text style={{ fontSize: Typography.bodySmall.fontSize, color: theme.OnSurfaceVariant }}>
                {resource.type.toUpperCase()}
              </Text>
            </View>

            {/* Actions */}
            <View>
              {resource.isDownloaded ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="download-done" size={16} color="#4CAF50" />
                  <Text style={{ fontSize: Typography.labelSmall.fontSize, fontWeight: '600', color: '#4CAF50', marginLeft: 4 }}>
                    Downloaded
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: theme.Primary,
                    paddingHorizontal: Spacing.SM,
                    paddingVertical: 4,
                    borderRadius: 12,
                    alignSelf: 'flex-start',
                  }}
                  onPress={() => downloadResource(resource.id)}
                >
                  <Icon name="download" size={16} color={theme.OnPrimary} />
                  <Text style={{ fontSize: Typography.labelSmall.fontSize, fontWeight: '600', color: theme.OnPrimary, marginLeft: 4 }}>
                    Download
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Progress bar */}
            {resource.downloadProgress !== undefined && resource.downloadProgress < 100 && (
              <View style={{ height: 2, backgroundColor: '#E0E0E0', borderRadius: 1, marginTop: Spacing.XS, overflow: 'hidden' }}>
                <View
                  style={{
                    height: '100%',
                    width: `${resource.downloadProgress}%`,
                    backgroundColor: theme.Primary,
                    borderRadius: 1,
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  // Render filter modal
  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: theme.Surface, padding: Spacing.LG, borderTopLeftRadius: 20, borderTopRightRadius: 20, minHeight: '50%' }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.LG }}>
            <Text style={{ fontSize: Typography.titleLarge.fontSize, fontWeight: Typography.titleLarge.fontWeight as any, color: theme.OnSurface }}>
              Filter & Sort
            </Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Icon name="close" size={24} color={theme.OnSurface} />
            </TouchableOpacity>
          </View>

          {/* Filter by Type */}
          <View style={{ marginBottom: Spacing.LG }}>
            <Text style={{ fontSize: Typography.titleMedium.fontSize, fontWeight: Typography.titleMedium.fontWeight as any, color: theme.OnSurface, marginBottom: Spacing.MD }}>
              Filter by Type
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.SM }}>
              {(['all', 'bookmarked', 'downloaded', 'recent'] as FilterType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={{
                    paddingHorizontal: Spacing.MD,
                    paddingVertical: Spacing.SM,
                    borderRadius: 20,
                    backgroundColor: filterType === type ? theme.Primary : theme.Background,
                  }}
                  onPress={() => setFilterType(type)}
                >
                  <Text
                    style={{
                      fontSize: Typography.bodyMedium.fontSize,
                      fontWeight: '500',
                      color: filterType === type ? theme.OnPrimary : theme.OnSurface,
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort by */}
          <View style={{ marginBottom: Spacing.LG }}>
            <Text style={{ fontSize: Typography.titleMedium.fontSize, fontWeight: Typography.titleMedium.fontWeight as any, color: theme.OnSurface, marginBottom: Spacing.MD }}>
              Sort by
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.SM }}>
              {(['name', 'date', 'size', 'rating'] as SortType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={{
                    paddingHorizontal: Spacing.MD,
                    paddingVertical: Spacing.SM,
                    borderRadius: 20,
                    backgroundColor: sortType === type ? theme.Primary : theme.Background,
                  }}
                  onPress={() => setSortType(type)}
                >
                  <Text
                    style={{
                      fontSize: Typography.bodyMedium.fontSize,
                      fontWeight: '500',
                      color: sortType === type ? theme.OnPrimary : theme.OnSurface,
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Render loading state
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.Background }}>
        <StatusBar backgroundColor={theme.Primary} barStyle="light-content" />
        {renderAppBar()}

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          <ActivityIndicator size="large" color={theme.Primary} />
          <Text style={{ fontSize: 16, color: theme.OnSurfaceVariant }}>
            Loading library...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.Background }}>
      <StatusBar backgroundColor={theme.Primary} barStyle="light-content" />
      {renderAppBar()}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: Spacing.XL }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={{ flexDirection: 'row', paddingHorizontal: Spacing.LG, paddingVertical: Spacing.MD, gap: Spacing.SM }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.Surface, paddingHorizontal: Spacing.MD, paddingVertical: Spacing.SM, borderRadius: 12, elevation: 1 }}>
            <Icon name="search" size={20} color={theme.OnSurfaceVariant} />
            <TextInput
              style={{ flex: 1, fontSize: Typography.bodyLarge.fontSize, color: theme.OnSurface, marginLeft: Spacing.SM }}
              placeholder="Search resources, authors, tags..."
              placeholderTextColor={theme.OnSurfaceVariant}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="clear" size={20} color={theme.OnSurfaceVariant} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Subject Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingVertical: Spacing.SM }}
          contentContainerStyle={{ paddingHorizontal: Spacing.LG }}
        >
          {subjects.map(renderSubjectChip)}
        </ScrollView>

        {/* View Mode Toggle */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.LG, paddingVertical: Spacing.SM }}>
          <Text style={{ fontSize: Typography.bodyMedium.fontSize, color: theme.OnSurfaceVariant }}>
            {filteredResources.length} resources found
          </Text>
          <View style={{ flexDirection: 'row', borderRadius: 8, overflow: 'hidden' }}>
            <TouchableOpacity
              style={{ padding: Spacing.SM, borderRadius: 8, backgroundColor: viewMode === 'grid' ? theme.Primary : 'transparent' }}
              onPress={() => setViewMode('grid')}
            >
              <Icon
                name="grid-view"
                size={20}
                color={viewMode === 'grid' ? theme.OnPrimary : theme.OnSurfaceVariant}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: Spacing.SM, borderRadius: 8, backgroundColor: viewMode === 'list' ? theme.Primary : 'transparent' }}
              onPress={() => setViewMode('list')}
            >
              <Icon
                name="view-list"
                size={20}
                color={viewMode === 'list' ? theme.OnPrimary : theme.OnSurfaceVariant}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Resources Grid/List */}
        {filteredResources.length > 0 ? (
          viewMode === 'grid' ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.MD, gap: Spacing.MD }}>
              {filteredResources.map(renderResourceCard)}
            </View>
          ) : (
            <View style={{ paddingHorizontal: Spacing.LG }}>
              {filteredResources.map(renderResourceListItem)}
            </View>
          )
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center', padding: Spacing.XXL, marginTop: Spacing.XXL }}>
            <Icon name="folder-open" size={64} color={theme.Outline} />
            <Text style={{ fontSize: Typography.titleLarge.fontSize, fontWeight: Typography.titleLarge.fontWeight as any, color: theme.OnSurface, marginTop: Spacing.MD, marginBottom: Spacing.SM }}>
              No Resources Found
            </Text>
            <Text style={{ fontSize: Typography.bodyMedium.fontSize, color: theme.OnSurfaceVariant, textAlign: 'center', lineHeight: 22 }}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}

        {/* My Notes Section */}
        {notes.length > 0 && (
          <View style={{ paddingHorizontal: Spacing.LG, marginTop: Spacing.LG }}>
            <Text style={{ fontSize: Typography.titleMedium.fontSize, fontWeight: '600', color: theme.OnSurface, marginBottom: Spacing.MD }}>
              My Notes ({notes.length})
            </Text>
            {notes.map((note) => {
              const resource = resources.find(r => r.id === note.resourceId);
              return (
                <View
                  key={note.id}
                  style={{
                    backgroundColor: theme.Surface,
                    padding: Spacing.MD,
                    borderRadius: 12,
                    marginBottom: Spacing.SM,
                    borderLeftWidth: 4,
                    borderLeftColor: note.color,
                    elevation: 1,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                  }}
                >
                  {/* Resource Title */}
                  {resource && (
                    <Text
                      style={{
                        fontSize: Typography.bodySmall.fontSize,
                        fontWeight: '600',
                        color: theme.Primary,
                        marginBottom: Spacing.XS,
                      }}
                      numberOfLines={1}
                    >
                      {resource.title}
                    </Text>
                  )}

                  {/* Note Content */}
                  <Text
                    style={{
                      fontSize: Typography.bodyMedium.fontSize,
                      color: theme.OnSurface,
                      lineHeight: 20,
                      marginBottom: Spacing.SM,
                    }}
                  >
                    {note.content}
                  </Text>

                  {/* Note Footer */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: Typography.bodySmall.fontSize, color: theme.OnSurfaceVariant }}>
                      {new Date(note.timestamp).toLocaleDateString()} at {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <TouchableOpacity onPress={() => deleteNote(note.id)}>
                      <Icon name="delete-outline" size={20} color={theme.Error} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {renderFilterModal()}

      {/* Resource Detail Modal */}
      <Modal
        visible={showResourceModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowResourceModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: theme.Surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%' }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: Spacing.XL }}
            >
              {selectedResource && (
                <>
                  {/* Header */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.LG, borderBottomWidth: 1, borderBottomColor: theme.Outline + '20' }}>
                    <View style={{ flex: 1, marginRight: Spacing.MD }}>
                      <Text style={{ fontSize: Typography.titleLarge.fontSize, fontWeight: '600', color: theme.OnSurface, marginBottom: Spacing.XS }}>
                        {selectedResource.title}
                      </Text>
                      <Text style={{ fontSize: Typography.bodyMedium.fontSize, color: theme.OnSurfaceVariant }}>
                        {selectedResource.author}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowResourceModal(false)}>
                      <Icon name="close" size={24} color={theme.OnSurface} />
                    </TouchableOpacity>
                  </View>

                  {/* Resource Info */}
                  <View style={{ padding: Spacing.LG }}>
                    {/* Type & Size */}
                    <View style={{ flexDirection: 'row', gap: Spacing.MD, marginBottom: Spacing.LG }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: getResourceTypeColor(selectedResource.type) + '20',
                          paddingHorizontal: Spacing.MD,
                          paddingVertical: Spacing.SM,
                          borderRadius: 20,
                        }}
                      >
                        <Icon name={getResourceTypeIcon(selectedResource.type)} size={16} color={getResourceTypeColor(selectedResource.type)} />
                        <Text style={{ fontSize: Typography.bodyMedium.fontSize, fontWeight: '600', color: getResourceTypeColor(selectedResource.type), marginLeft: Spacing.XS }}>
                          {selectedResource.type.toUpperCase()}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: theme.Background,
                          paddingHorizontal: Spacing.MD,
                          paddingVertical: Spacing.SM,
                          borderRadius: 20,
                        }}
                      >
                        <Icon name="storage" size={16} color={theme.OnSurfaceVariant} />
                        <Text style={{ fontSize: Typography.bodyMedium.fontSize, color: theme.OnSurfaceVariant, marginLeft: Spacing.XS }}>
                          {selectedResource.size}
                        </Text>
                      </View>
                    </View>

                    {/* Stats */}
                    <View style={{ flexDirection: 'row', gap: Spacing.LG, marginBottom: Spacing.LG }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="star" size={18} color="#FFC107" />
                        <Text style={{ fontSize: Typography.bodyMedium.fontSize, fontWeight: '600', color: theme.OnSurface, marginLeft: Spacing.XS }}>
                          {selectedResource.rating}
                        </Text>
                        <Text style={{ fontSize: Typography.bodySmall.fontSize, color: theme.OnSurfaceVariant, marginLeft: 4 }}>
                          Rating
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="download" size={18} color={theme.OnSurfaceVariant} />
                        <Text style={{ fontSize: Typography.bodyMedium.fontSize, fontWeight: '600', color: theme.OnSurface, marginLeft: Spacing.XS }}>
                          {selectedResource.downloads}
                        </Text>
                        <Text style={{ fontSize: Typography.bodySmall.fontSize, color: theme.OnSurfaceVariant, marginLeft: 4 }}>
                          Downloads
                        </Text>
                      </View>
                    </View>

                    {/* Description */}
                    <View style={{ marginBottom: Spacing.LG }}>
                      <Text style={{ fontSize: Typography.titleMedium.fontSize, fontWeight: '600', color: theme.OnSurface, marginBottom: Spacing.SM }}>
                        Description
                      </Text>
                      <Text style={{ fontSize: Typography.bodyMedium.fontSize, color: theme.OnSurfaceVariant, lineHeight: 22 }}>
                        {selectedResource.description}
                      </Text>
                    </View>

                    {/* Tags */}
                    {selectedResource.tags.length > 0 && (
                      <View style={{ marginBottom: Spacing.LG }}>
                        <Text style={{ fontSize: Typography.titleMedium.fontSize, fontWeight: '600', color: theme.OnSurface, marginBottom: Spacing.SM }}>
                          Tags
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.SM }}>
                          {selectedResource.tags.map((tag, index) => (
                            <View
                              key={index}
                              style={{
                                backgroundColor: theme.Primary + '20',
                                paddingHorizontal: Spacing.MD,
                                paddingVertical: Spacing.XS,
                                borderRadius: 16,
                              }}
                            >
                              <Text style={{ fontSize: Typography.bodySmall.fontSize, color: theme.Primary }}>
                                #{tag}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Upload Date */}
                    <View>
                      <Text style={{ fontSize: Typography.bodySmall.fontSize, color: theme.OnSurfaceVariant }}>
                        Uploaded on {new Date(selectedResource.uploadDate).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={{ flexDirection: 'row', gap: Spacing.MD, padding: Spacing.LG, paddingTop: 0 }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.Background,
                        paddingVertical: Spacing.MD,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: theme.Outline,
                      }}
                      onPress={() => {
                        setShowResourceModal(false);
                        addNote(selectedResource.id);
                      }}
                    >
                      <Icon name="note-add" size={20} color={theme.OnSurface} />
                      <Text style={{ fontSize: Typography.bodyLarge.fontSize, fontWeight: '600', color: theme.OnSurface, marginLeft: Spacing.SM }}>
                        Add Note
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.Primary,
                        paddingVertical: Spacing.MD,
                        borderRadius: 12,
                      }}
                      onPress={() => {
                        setShowResourceModal(false);
                        if (!selectedResource.isDownloaded) {
                          downloadResource(selectedResource.id);
                        } else {
                          openFile(selectedResource);
                        }
                      }}
                    >
                      <Icon name={selectedResource.isDownloaded ? 'open-in-new' : 'download'} size={20} color={theme.OnPrimary} />
                      <Text style={{ fontSize: Typography.bodyLarge.fontSize, fontWeight: '600', color: theme.OnPrimary, marginLeft: Spacing.SM }}>
                        {selectedResource.isDownloaded ? 'Open' : 'Download'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Note Modal */}
      <Modal
        visible={showNoteModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowNoteModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.Surface, padding: Spacing.LG, borderRadius: 20, width: '85%', maxWidth: 400 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.MD }}>
              <Text style={{ fontSize: Typography.titleLarge.fontSize, fontWeight: '600', color: theme.OnSurface }}>
                Add Note
              </Text>
              <TouchableOpacity onPress={() => setShowNoteModal(false)}>
                <Icon name="close" size={24} color={theme.OnSurface} />
              </TouchableOpacity>
            </View>

            {/* Note Input */}
            <TextInput
              style={{
                backgroundColor: theme.Background,
                borderRadius: 12,
                padding: Spacing.MD,
                fontSize: Typography.bodyLarge.fontSize,
                color: theme.OnSurface,
                minHeight: 120,
                textAlignVertical: 'top',
                marginBottom: Spacing.MD,
              }}
              placeholder="Enter your note..."
              placeholderTextColor={theme.OnSurfaceVariant}
              value={noteText}
              onChangeText={setNoteText}
              multiline
              autoFocus
            />

            {/* Actions */}
            <View style={{ flexDirection: 'row', gap: Spacing.SM }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: theme.Background,
                  paddingVertical: Spacing.MD,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                onPress={() => setShowNoteModal(false)}
              >
                <Text style={{ fontSize: Typography.bodyLarge.fontSize, fontWeight: '600', color: theme.OnSurface }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: theme.Primary,
                  paddingVertical: Spacing.MD,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                onPress={saveNote}
              >
                <Text style={{ fontSize: Typography.bodyLarge.fontSize, fontWeight: '600', color: theme.OnPrimary }}>
                  Save Note
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

export default StudyLibraryScreen;

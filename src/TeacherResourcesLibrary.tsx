/**
 * SCREEN 33 - TEACHER RESOURCES LIBRARY
 *
 * A comprehensive file manager for teachers to upload, organize, and share
 * study materials including PDFs, videos, notes, PPTs, and worksheets.
 *
 * Features:
 * - Grid/List view toggle
 * - File type filters
 * - Search by name/topic
 * - Upload functionality
 * - Preview, share, edit, delete actions
 * - Folder organization
 *
 * Design System:
 * - Primary: #5B47FB
 * - Success: #10B981
 * - Error: #EF4444
 * - Background: #F9FAFB
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// Types
interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'ppt' | 'image' | 'link' | 'doc';
  size: string;
  date: string;
  thumbnail?: string;
  folder?: string;
  tags?: string[];
}

type ViewMode = 'grid' | 'list';
type FileFilter = 'all' | 'pdf' | 'video' | 'ppt' | 'image' | 'link' | 'doc';

interface TeacherResourcesLibraryProps {
  resources?: Resource[];
  onUpload?: () => void;
  onShare?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPreview?: (id: string) => void;
}

/**
 * Main Component
 */
const TeacherResourcesLibrary: React.FC<TeacherResourcesLibraryProps> = ({
  resources = MOCK_RESOURCES,
  onUpload,
  onShare,
  onEdit,
  onDelete,
  onPreview,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FileFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and search resources
  const filteredResources = useMemo(() => {
    let filtered = resources;

    // Apply file type filter
    if (filter !== 'all') {
      filtered = filtered.filter(r => r.type === filter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [resources, filter, searchQuery]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity accessibilityLabel="Go back" accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Resources Library</Text>
            <Text style={styles.headerSubtitle}>
              Upload, manage & share study materials
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by file name, type, or topic..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
            accessibilityLabel="Search resources"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Action Bar */}
        <View style={styles.actionBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onUpload}
              accessibilityLabel="Upload new resource"
            >
              <Ionicons name="cloud-upload-outline" size={20} color="#5B47FB" />
              <Text style={styles.actionButtonText}>Upload</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.viewToggle, viewMode === 'grid' && styles.viewToggleActive]}
              onPress={() => setViewMode('grid')}
              accessibilityLabel="Grid view"
            >
              <Ionicons name="grid-outline" size={20} color={viewMode === 'grid' ? '#5B47FB' : '#6B7280'} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.viewToggle, viewMode === 'list' && styles.viewToggleActive]}
              onPress={() => setViewMode('list')}
              accessibilityLabel="List view"
            >
              <Ionicons name="list-outline" size={20} color={viewMode === 'list' ? '#5B47FB' : '#6B7280'} />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* File Type Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {FILE_FILTERS.map((filterItem) => (
            <TouchableOpacity
              key={filterItem.value}
              style={[
                styles.filterChip,
                filter === filterItem.value && styles.filterChipActive,
              ]}
              onPress={() => setFilter(filterItem.value)}
              accessibilityLabel={`Filter by ${filterItem.label}`}
            >
              <MaterialCommunityIcons
                name={filterItem.icon as any}
                size={18}
                color={filter === filterItem.value ? '#FFF' : '#6B7280'}
              />
              <Text
                style={[
                  styles.filterChipText,
                  filter === filterItem.value && styles.filterChipTextActive,
                ]}
              >
                {filterItem.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {filteredResources.length === 0 ? (
          <EmptyState searchQuery={searchQuery} filter={filter} />
        ) : (
          <FlatList
            data={filteredResources}
            key={viewMode}
            numColumns={viewMode === 'grid' ? 2 : 1}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              viewMode === 'grid' ? (
                <ResourceCardGrid
                  resource={item}
                  onShare={onShare}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onPreview={onPreview}
                />
              ) : (
                <ResourceCardList
                  resource={item}
                  onShare={onShare}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onPreview={onPreview}
                />
              )
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={onUpload}
        accessibilityLabel="Upload resource"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

/**
 * Resource Card - Grid View
 */
const ResourceCardGrid: React.FC<{
  resource: Resource;
  onShare?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPreview?: (id: string) => void;
}> = React.memo(({ resource, onShare, onEdit, onDelete, onPreview }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <TouchableOpacity
      style={styles.cardGrid}
      onPress={() => onPreview?.(resource.id)}
      onLongPress={() => setShowActions(!showActions)}
      accessibilityLabel={`${resource.name}, ${resource.type}, ${resource.size}`}
    >
      {/* Thumbnail */}
      <View style={[styles.thumbnail, { backgroundColor: getTypeColor(resource.type) }]}>
        <MaterialCommunityIcons
          name={getTypeIcon(resource.type) as any}
          size={40}
          color="#FFF"
        />
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={2}>
          {resource.name}
        </Text>
        <Text style={styles.cardMeta}>
          {resource.type.toUpperCase()} • {resource.size}
        </Text>
        <Text style={styles.cardDate}>{resource.date}</Text>
      </View>

      {/* Actions Menu */}
      {showActions && (
        <View style={styles.actionsOverlay}>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => onShare?.(resource.id)}
            accessibilityLabel="Share resource"
          >
            <Ionicons name="share-outline" size={20} color="#5B47FB" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => onEdit?.(resource.id)}
            accessibilityLabel="Edit resource"
          >
            <Ionicons name="create-outline" size={20} color="#10B981" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => onDelete?.(resource.id)}
            accessibilityLabel="Delete resource"
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
});

/**
 * Resource Card - List View
 */
const ResourceCardList: React.FC<{
  resource: Resource;
  onShare?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPreview?: (id: string) => void;
}> = React.memo(({ resource, onShare, onEdit, onDelete, onPreview }) => {
  return (
    <TouchableOpacity
      style={styles.cardList}
      onPress={() => onPreview?.(resource.id)}
      accessibilityLabel={`${resource.name}, ${resource.type}, ${resource.size}`}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: getTypeColor(resource.type) }]}>
        <MaterialCommunityIcons
          name={getTypeIcon(resource.type) as any}
          size={24}
          color="#FFF"
        />
      </View>

      {/* Info */}
      <View style={styles.listInfo}>
        <Text style={styles.listName} numberOfLines={1}>
          {resource.name}
        </Text>
        <Text style={styles.listMeta}>
          {resource.type.toUpperCase()} • {resource.size} • {resource.date}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.listActions}>
        <TouchableOpacity
          onPress={() => onShare?.(resource.id)}
          accessibilityLabel="Share"
          style={styles.listActionButton}
        >
          <Ionicons name="share-outline" size={20} color="#5B47FB" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onEdit?.(resource.id)}
          accessibilityLabel="Edit"
          style={styles.listActionButton}
        >
          <Ionicons name="create-outline" size={20} color="#10B981" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete?.(resource.id)}
          accessibilityLabel="Delete"
          style={styles.listActionButton}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

/**
 * Empty State Component
 */
const EmptyState: React.FC<{ searchQuery: string; filter: FileFilter }> = ({
  searchQuery,
  filter,
}) => {
  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="folder-open-outline" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No results found' : 'No resources yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? `Try adjusting your search or filter`
          : filter !== 'all'
          ? `No ${filter.toUpperCase()} files found`
          : 'Upload your first study material to get started'}
      </Text>
    </View>
  );
};

// Helper Functions
const getTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    pdf: 'file-pdf-box',
    video: 'video',
    ppt: 'file-powerpoint',
    image: 'image',
    link: 'link-variant',
    doc: 'file-document',
  };
  return icons[type] || 'file';
};

const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    pdf: '#EF4444',
    video: '#8B5CF6',
    ppt: '#F59E0B',
    image: '#10B981',
    link: '#3B82F6',
    doc: '#06B6D4',
  };
  return colors[type] || '#6B7280';
};

// Constants
const FILE_FILTERS: Array<{ value: FileFilter; label: string; icon: string }> = [
  { value: 'all', label: 'All', icon: 'folder-multiple' },
  { value: 'pdf', label: 'PDF', icon: 'file-pdf-box' },
  { value: 'video', label: 'Video', icon: 'video' },
  { value: 'ppt', label: 'PPT', icon: 'file-powerpoint' },
  { value: 'image', label: 'Images', icon: 'image-multiple' },
  { value: 'link', label: 'Links', icon: 'link-variant' },
];

// Mock Data
const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    name: 'Algebra Chapter 5 - Quadratic Equations.pdf',
    type: 'pdf',
    size: '2.4 MB',
    date: '2 hours ago',
    tags: ['algebra', 'math', 'class-10'],
  },
  {
    id: '2',
    name: 'Physics Lecture - Newton Laws.mp4',
    type: 'video',
    size: '45.2 MB',
    date: 'Yesterday',
    tags: ['physics', 'mechanics'],
  },
  {
    id: '3',
    name: 'Chemistry Presentation - Organic Compounds.pptx',
    type: 'ppt',
    size: '5.1 MB',
    date: '3 days ago',
    tags: ['chemistry', 'organic'],
  },
  {
    id: '4',
    name: 'Trigonometry Worksheet.pdf',
    type: 'pdf',
    size: '890 KB',
    date: '1 week ago',
    tags: ['math', 'trigonometry', 'worksheet'],
  },
];

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'Inter',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B47FB',
    marginLeft: 6,
    fontFamily: 'Inter',
  },
  viewToggle: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginLeft: 8,
  },
  viewToggleActive: {
    backgroundColor: '#EEF2FF',
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#5B47FB',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
    fontFamily: 'Inter',
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  cardGrid: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    margin: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
    fontFamily: 'Inter',
  },
  cardMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  cardDate: {
    fontSize: 11,
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
  actionsOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionIcon: {
    padding: 8,
  },
  cardList: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  listMeta: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  listActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listActionButton: {
    padding: 8,
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5B47FB',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#5B47FB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    fontFamily: 'Inter',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
});

export default TeacherResourcesLibrary;

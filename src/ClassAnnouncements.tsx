/**
 * SCREEN 34 - CLASS ANNOUNCEMENTS
 *
 * Teacher view for creating, managing, and tracking class announcements.
 * Allows teachers to send announcements, attach files, schedule posts,
 * and track read/unread status.
 *
 * Features:
 * - Create/edit/delete announcements
 * - Attach files and resources
 * - Pin important announcements
 * - Schedule announcements
 * - Track engagement (read/unread counts)
 * - Filter by status (sent, scheduled, draft)
 *
 * Design System:
 * - Primary: #5B47FB
 * - Success: #10B981
 * - Warning: #F59E0B
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
  Modal,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Types
interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  class: string;
  status: 'sent' | 'scheduled' | 'draft';
  readCount?: number;
  totalStudents?: number;
  attachments?: number;
  isPinned?: boolean;
  scheduledFor?: string;
}

type AnnouncementFilter = 'all' | 'sent' | 'scheduled' | 'draft' | 'pinned';

interface ClassAnnouncementsProps {
  announcements?: Announcement[];
  onCreateAnnouncement?: () => void;
  onEditAnnouncement?: (id: string) => void;
  onDeleteAnnouncement?: (id: string) => void;
  onViewAnalytics?: (id: string) => void;
  onPinAnnouncement?: (id: string) => void;
}

/**
 * Main Component
 */
const ClassAnnouncements: React.FC<ClassAnnouncementsProps> = ({
  announcements = MOCK_ANNOUNCEMENTS,
  onCreateAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement,
  onViewAnalytics,
  onPinAnnouncement,
}) => {
  const [filter, setFilter] = useState<AnnouncementFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [selectedClass, setSelectedClass] = useState('All Classes');

  // Filter announcements
  const filteredAnnouncements = useMemo(() => {
    let filtered = announcements;

    // Apply status filter
    if (filter === 'pinned') {
      filtered = filtered.filter(a => a.isPinned);
    } else if (filter !== 'all') {
      filtered = filtered.filter(a => a.status === filter);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        a =>
          a.title.toLowerCase().includes(query) ||
          a.message.toLowerCase().includes(query)
      );
    }

    // Sort: pinned first, then by date
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [announcements, filter, searchQuery]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Announcements</Text>
            <Text style={styles.headerSubtitle}>
              Communicate with your students
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowComposer(true)}
            accessibilityLabel="Create announcement"
          >
            <View style={styles.addButton}>
              <Ionicons name="add" size={24} color="#5B47FB" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Class Selector */}
        <TouchableOpacity style={styles.classSelector}>
          <Text style={styles.classSelectorText}>{selectedClass}</Text>
          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search announcements..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {FILTERS.map(filterItem => (
            <TouchableOpacity
              key={filterItem.value}
              style={[
                styles.filterChip,
                filter === filterItem.value && styles.filterChipActive,
              ]}
              onPress={() => setFilter(filterItem.value)}
              accessibilityLabel={`Filter by ${filterItem.label}`}
            >
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

      {/* Announcements List */}
      <FlatList
        data={filteredAnnouncements}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <AnnouncementCard
            announcement={item}
            onEdit={onEditAnnouncement}
            onDelete={onDeleteAnnouncement}
            onViewAnalytics={onViewAnalytics}
            onPin={onPinAnnouncement}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState searchQuery={searchQuery} filter={filter} />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowComposer(true)}
        accessibilityLabel="Create announcement"
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Composer Modal */}
      <Modal
        visible={showComposer}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowComposer(false)}
      >
        <AnnouncementComposer onClose={() => setShowComposer(false)} />
      </Modal>
    </View>
  );
};

/**
 * Announcement Card Component
 */
const AnnouncementCard: React.FC<{
  announcement: Announcement;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewAnalytics?: (id: string) => void;
  onPin?: (id: string) => void;
}> = React.memo(({ announcement, onEdit, onDelete, onViewAnalytics, onPin }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = () => {
    switch (announcement.status) {
      case 'sent':
        return '#10B981';
      case 'scheduled':
        return '#F59E0B';
      case 'draft':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const readPercentage =
    announcement.readCount && announcement.totalStudents
      ? (announcement.readCount / announcement.totalStudents) * 100
      : 0;

  return (
    <TouchableOpacity
      style={[styles.card, announcement.isPinned && styles.cardPinned]}
      onPress={() => onViewAnalytics?.(announcement.id)}
      onLongPress={() => setShowActions(!showActions)}
      accessibilityLabel={`${announcement.title}, ${announcement.status}`}
    >
      {/* Pinned Badge */}
      {announcement.isPinned && (
        <View style={styles.pinnedBadge}>
          <Ionicons name="pin" size={14} color="#5B47FB" />
          <Text style={styles.pinnedText}>Pinned</Text>
        </View>
      )}

      {/* Header Row */}
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {announcement.title}
          </Text>
          <View style={styles.statusBadge}>
            <View
              style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
            />
            <Text style={styles.statusText}>
              {announcement.status.charAt(0).toUpperCase() +
                announcement.status.slice(1)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setShowActions(!showActions)}
          accessibilityLabel="More options"
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Message Preview */}
      <Text style={styles.cardMessage} numberOfLines={3}>
        {announcement.message}
      </Text>

      {/* Meta Info */}
      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={14} color="#6B7280" />
          <Text style={styles.metaText}>{announcement.date}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={14} color="#6B7280" />
          <Text style={styles.metaText}>{announcement.class}</Text>
        </View>
        {announcement.attachments && announcement.attachments > 0 && (
          <View style={styles.metaItem}>
            <Ionicons name="attach-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{announcement.attachments}</Text>
          </View>
        )}
      </View>

      {/* Read Status (for sent announcements) */}
      {announcement.status === 'sent' && announcement.readCount !== undefined && (
        <View style={styles.readStatus}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${readPercentage}%` }]}
            />
          </View>
          <Text style={styles.readText}>
            {announcement.readCount}/{announcement.totalStudents} read (
            {Math.round(readPercentage)}%)
          </Text>
        </View>
      )}

      {/* Scheduled Time */}
      {announcement.status === 'scheduled' && announcement.scheduledFor && (
        <View style={styles.scheduledBanner}>
          <Ionicons name="time-outline" size={16} color="#F59E0B" />
          <Text style={styles.scheduledText}>
            Scheduled for {announcement.scheduledFor}
          </Text>
        </View>
      )}

      {/* Actions Menu */}
      {showActions && (
        <View style={styles.actionsMenu}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit?.(announcement.id)}
          >
            <Ionicons name="create-outline" size={20} color="#5B47FB" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onPin?.(announcement.id)}
          >
            <Ionicons
              name={announcement.isPinned ? 'pin' : 'pin-outline'}
              size={20}
              color="#10B981"
            />
            <Text style={styles.actionText}>
              {announcement.isPinned ? 'Unpin' : 'Pin'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete?.(announcement.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={[styles.actionText, { color: '#EF4444' }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
});

/**
 * Announcement Composer
 */
const AnnouncementComposer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  return (
    <View style={styles.composer}>
      <View style={styles.composerHeader}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.composerTitle}>New Announcement</Text>
        <TouchableOpacity>
          <Text style={styles.sendButton}>Send</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.composerContent}>
        <TextInput
          style={styles.titleInput}
          placeholder="Announcement Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          style={styles.messageInput}
          placeholder="Write your announcement message..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={10}
          textAlignVertical="top"
          placeholderTextColor="#9CA3AF"
        />

        {/* Composer Actions */}
        <View style={styles.composerActions}>
          <TouchableOpacity style={styles.composerAction}>
            <Ionicons name="attach-outline" size={24} color="#5B47FB" />
            <Text style={styles.composerActionText}>Attach</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.composerAction}>
            <Ionicons name="calendar-outline" size={24} color="#5B47FB" />
            <Text style={styles.composerActionText}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.composerAction}>
            <Ionicons name="people-outline" size={24} color="#5B47FB" />
            <Text style={styles.composerActionText}>Recipients</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

/**
 * Empty State
 */
const EmptyState: React.FC<{ searchQuery: string; filter: AnnouncementFilter }> = ({
  searchQuery,
  filter,
}) => {
  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="bullhorn-outline" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No results found' : 'No announcements yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try adjusting your search'
          : filter !== 'all'
          ? `No ${filter} announcements`
          : 'Create your first announcement to get started'}
      </Text>
    </View>
  );
};

// Constants
const FILTERS: Array<{ value: AnnouncementFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'sent', label: 'Sent' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'draft', label: 'Drafts' },
  { value: 'pinned', label: 'Pinned' },
];

// Mock Data
const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Important: Tomorrow\'s Test Postponed',
    message:
      'Dear students, the mathematics test scheduled for tomorrow has been postponed to next Monday. Please use this time to prepare well.',
    date: '2 hours ago',
    class: 'Class 10 Math',
    status: 'sent',
    readCount: 28,
    totalStudents: 38,
    isPinned: true,
  },
  {
    id: '2',
    title: 'New Study Materials Available',
    message:
      'Chapter 5 notes and practice questions are now available in the Resources section. Please download and review before the next class.',
    date: 'Yesterday',
    class: 'All Classes',
    status: 'sent',
    readCount: 35,
    totalStudents: 38,
    attachments: 2,
  },
  {
    id: '3',
    title: 'Reminder: Submit Homework by Friday',
    message:
      'This is a reminder to submit your homework assignments by Friday 5 PM. Late submissions will not be accepted.',
    date: 'Tomorrow 10:00 AM',
    class: 'Class 10 Math',
    status: 'scheduled',
    scheduledFor: 'Tomorrow 10:00 AM',
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  classSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  classSelectorText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
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
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
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
    fontFamily: 'Inter',
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardPinned: {
    borderLeftWidth: 4,
    borderLeftColor: '#5B47FB',
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  pinnedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B47FB',
    marginLeft: 4,
    fontFamily: 'Inter',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    fontFamily: 'Inter',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  cardMessage: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  cardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontFamily: 'Inter',
  },
  readStatus: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  readText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  scheduledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  scheduledText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 6,
    fontFamily: 'Inter',
  },
  actionsMenu: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 12,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B47FB',
    marginLeft: 6,
    fontFamily: 'Inter',
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
    paddingVertical: 80,
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
  composer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  composerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  composerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  sendButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B47FB',
    fontFamily: 'Inter',
  },
  composerContent: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    fontFamily: 'Inter',
  },
  messageInput: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
    minHeight: 200,
    fontFamily: 'Inter',
  },
  composerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  composerAction: {
    alignItems: 'center',
  },
  composerActionText: {
    fontSize: 12,
    color: '#5B47FB',
    marginTop: 6,
    fontFamily: 'Inter',
  },
});

export default ClassAnnouncements;

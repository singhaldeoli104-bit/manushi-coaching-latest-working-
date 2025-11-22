/**
 * SCREEN 35 - CLASS CHAT
 *
 * Teacher-Student messaging system with controlled communication.
 * Supports 1:1 chats, group chats, file sharing, and moderation.
 *
 * Features:
 * - Chat list with recent conversations
 * - Search functionality
 * - Unread count badges
 * - Chat detail view with message thread
 * - File attachment support
 * - Typing indicators
 * - Message controls (edit, delete, pin)
 *
 * Design System:
 * - Primary: #5B47FB
 * - Success: #10B981
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
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Types
interface ChatMessage {
  id: string;
  text: string;
  sender: 'teacher' | 'student';
  senderName: string;
  timestamp: string;
  isRead?: boolean;
  attachment?: {
    type: 'image' | 'file' | 'voice';
    name: string;
    url?: string;
  };
}

interface Chat {
  id: string;
  name: string;
  type: 'individual' | 'group' | 'parent';
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPinned?: boolean;
  isOnline?: boolean;
  isMuted?: boolean;
  participants?: number;
}

type ChatCategory = 'all' | 'class-groups' | 'students' | 'parents' | 'pinned';

interface ClassChatProps {
  chats?: Chat[];
  selectedChatId?: string;
  onSelectChat?: (chatId: string) => void;
  onSendMessage?: (chatId: string, message: string) => void;
  onAttachFile?: (chatId: string) => void;
}

/**
 * Main Component - Chat List View
 */
const ClassChat: React.FC<ClassChatProps> = ({
  chats = MOCK_CHATS,
  selectedChatId,
  onSelectChat,
  onSendMessage,
  onAttachFile,
}) => {
  const [category, setCategory] = useState<ChatCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatId, setActiveChatId] = useState(selectedChatId);

  // Filter chats
  const filteredChats = useMemo(() => {
    let filtered = chats;

    // Apply category filter
    if (category === 'pinned') {
      filtered = filtered.filter(c => c.isPinned);
    } else if (category === 'class-groups') {
      filtered = filtered.filter(c => c.type === 'group');
    } else if (category === 'students') {
      filtered = filtered.filter(c => c.type === 'individual');
    } else if (category === 'parents') {
      filtered = filtered.filter(c => c.type === 'parent');
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.name.toLowerCase().includes(query) ||
          c.lastMessage.toLowerCase().includes(query)
      );
    }

    // Sort: pinned first, then by time
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [chats, category, searchQuery]);

  if (activeChatId) {
    const activeChat = chats.find(c => c.id === activeChatId);
    return (
      <ChatDetailView
        chat={activeChat!}
        onBack={() => setActiveChatId(undefined)}
        onSendMessage={onSendMessage}
        onAttachFile={onAttachFile}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Messages</Text>
            <Text style={styles.headerSubtitle}>
              {filteredChats.length} conversations
            </Text>
          </View>
          <TouchableOpacity accessibilityLabel="New chat">
            <View style={styles.newChatButton}>
              <Ionicons name="create-outline" size={22} color="#5B47FB" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Tabs */}
        <View style={styles.tabs}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.value}
              style={[styles.tab, category === cat.value && styles.tabActive]}
              onPress={() => setCategory(cat.value)}
              accessibilityLabel={`${cat.label} chats`}
            >
              <Text
                style={[
                  styles.tabText,
                  category === cat.value && styles.tabTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChatListItem
            chat={item}
            onPress={() => {
              setActiveChatId(item.id);
              onSelectChat?.(item.id);
            }}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState searchQuery={searchQuery} category={category} />
        }
      />
    </View>
  );
};

/**
 * Chat List Item Component
 */
const ChatListItem: React.FC<{
  chat: Chat;
  onPress: () => void;
}> = React.memo(({ chat, onPress }) => {
  const getTypeIcon = () => {
    switch (chat.type) {
      case 'group':
        return 'people';
      case 'parent':
        return 'person-circle-outline';
      default:
        return 'person';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.chatItem, chat.isPinned && styles.chatItemPinned]}
      onPress={onPress}
      accessibilityLabel={`Chat with ${chat.name}, ${chat.unreadCount} unread messages`}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {chat.avatar ? (
          <Image source={{ uri: chat.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons
              name={getTypeIcon()}
              size={chat.type === 'group' ? 20 : 24}
              color="#5B47FB"
            />
          </View>
        )}
        {chat.isOnline && <View style={styles.onlineDot} />}
        {chat.isPinned && (
          <View style={styles.pinIcon}>
            <Ionicons name="pin" size={12} color="#5B47FB" />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName} numberOfLines={1}>
            {chat.name}
          </Text>
          <Text style={styles.chatTime}>{chat.lastMessageTime}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text
            style={[
              styles.lastMessage,
              chat.unreadCount > 0 && styles.lastMessageUnread,
            ]}
            numberOfLines={1}
          >
            {chat.lastMessage}
          </Text>
          {chat.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
            </View>
          )}
          {chat.isMuted && (
            <Ionicons
              name="notifications-off"
              size={16}
              color="#9CA3AF"
              style={styles.muteIcon}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

/**
 * Chat Detail View - Message Thread
 */
const ChatDetailView: React.FC<{
  chat: Chat;
  onBack: () => void;
  onSendMessage?: (chatId: string, message: string) => void;
  onAttachFile?: (chatId: string) => void;
}> = ({ chat, onBack, onSendMessage, onAttachFile }) => {
  const [messageText, setMessageText] = useState('');
  const [messages] = useState<ChatMessage[]>(MOCK_MESSAGES);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage?.(chat.id, messageText);
      setMessageText('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.chatDetail}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.chatDetailHeader}>
        <TouchableOpacity onPress={onBack} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.chatDetailInfo}>
          <View style={styles.chatDetailAvatar}>
            {chat.avatar ? (
              <Image source={{ uri: chat.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={24} color="#5B47FB" />
              </View>
            )}
          </View>
          <View>
            <Text style={styles.chatDetailName}>{chat.name}</Text>
            {chat.isOnline ? (
              <Text style={styles.onlineStatus}>Online</Text>
            ) : (
              <Text style={styles.offlineStatus}>
                {chat.type === 'group'
                  ? `${chat.participants} participants`
                  : 'Offline'}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity accessibilityLabel="More options">
          <Ionicons name="ellipsis-vertical" size={22} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        inverted
      />

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() => onAttachFile?.(chat.id)}
          style={styles.attachButton}
          accessibilityLabel="Attach file"
        >
          <Ionicons name="add-circle-outline" size={28} color="#5B47FB" />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={1000}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity
          onPress={handleSend}
          style={[
            styles.sendButton,
            !messageText.trim() && styles.sendButtonDisabled,
          ]}
          disabled={!messageText.trim()}
          accessibilityLabel="Send message"
        >
          <Ionicons
            name="send"
            size={20}
            color={messageText.trim() ? '#FFF' : '#9CA3AF'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

/**
 * Message Bubble Component
 */
const MessageBubble: React.FC<{ message: ChatMessage }> = React.memo(
  ({ message }) => {
    const isTeacher = message.sender === 'teacher';

    return (
      <View
        style={[styles.messageBubble, isTeacher && styles.messageBubbleTeacher]}
      >
        {!isTeacher && (
          <Text style={styles.senderName}>{message.senderName}</Text>
        )}
        <View
          style={[
            styles.bubbleContainer,
            isTeacher && styles.bubbleContainerTeacher,
          ]}
        >
          <Text
            style={[styles.messageText, isTeacher && styles.messageTextTeacher]}
          >
            {message.text}
          </Text>
          {message.attachment && (
            <View style={styles.attachment}>
              <MaterialCommunityIcons
                name={
                  message.attachment.type === 'image'
                    ? 'image'
                    : message.attachment.type === 'voice'
                    ? 'microphone'
                    : 'file-document'
                }
                size={16}
                color={isTeacher ? '#FFF' : '#5B47FB'}
              />
              <Text
                style={[
                  styles.attachmentText,
                  isTeacher && styles.attachmentTextTeacher,
                ]}
              >
                {message.attachment.name}
              </Text>
            </View>
          )}
        </View>
        <View
          style={[styles.messageFooter, isTeacher && styles.messageFooterTeacher]}
        >
          <Text style={styles.messageTime}>{message.timestamp}</Text>
          {isTeacher && message.isRead && (
            <Ionicons name="checkmark-done" size={14} color="#10B981" />
          )}
        </View>
      </View>
    );
  }
);

/**
 * Empty State
 */
const EmptyState: React.FC<{
  searchQuery: string;
  category: ChatCategory;
}> = ({ searchQuery, category }) => {
  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="chat-outline" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No chats found' : 'No messages yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try a different search term'
          : category !== 'all'
          ? `No ${category} chats`
          : 'Start a conversation with your students'}
      </Text>
    </View>
  );
};

// Constants
const CATEGORIES: Array<{ value: ChatCategory; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'class-groups', label: 'Groups' },
  { value: 'students', label: 'Students' },
  { value: 'parents', label: 'Parents' },
  { value: 'pinned', label: 'Pinned' },
];

// Mock Data
const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    name: 'Class 10 Math - Batch A',
    type: 'group',
    lastMessage: 'Riya: Thank you for the notes!',
    lastMessageTime: '10:30 AM',
    unreadCount: 5,
    isPinned: true,
    participants: 38,
  },
  {
    id: '2',
    name: 'Rahul Sharma',
    type: 'individual',
    lastMessage: 'I have a doubt about Question 5',
    lastMessageTime: '9:15 AM',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '3',
    name: 'Parent - Priya Verma',
    type: 'parent',
    lastMessage: 'How is my son performing?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isMuted: true,
  },
];

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    text: 'Thank you! I understand now.',
    sender: 'student',
    senderName: 'Rahul',
    timestamp: '10:32 AM',
    isRead: true,
  },
  {
    id: '2',
    text: 'The formula is (a+b)² = a² + 2ab + b². Does that help?',
    sender: 'teacher',
    senderName: 'Teacher',
    timestamp: '10:30 AM',
    isRead: true,
  },
  {
    id: '3',
    text: 'I have a doubt about Question 5',
    sender: 'student',
    senderName: 'Rahul',
    timestamp: '10:28 AM',
    isRead: true,
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
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
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
  tabs: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#5B47FB',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  tabTextActive: {
    color: '#5B47FB',
  },
  listContent: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  chatItemPinned: {
    backgroundColor: '#FEFCE8',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  pinIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  chatTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
    fontFamily: 'Inter',
  },
  chatFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  lastMessageUnread: {
    fontWeight: '600',
    color: '#1F2937',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#5B47FB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
    fontFamily: 'Inter',
  },
  muteIcon: {
    marginLeft: 8,
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
  chatDetail: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  chatDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  chatDetailInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  chatDetailAvatar: {
    marginRight: 12,
  },
  chatDetailName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  onlineStatus: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 2,
    fontFamily: 'Inter',
  },
  offlineStatus: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    fontFamily: 'Inter',
  },
  messagesContent: {
    padding: 16,
    flexDirection: 'column-reverse',
  },
  messageBubble: {
    maxWidth: '75%',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  messageBubbleTeacher: {
    alignSelf: 'flex-end',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
    marginLeft: 12,
    fontFamily: 'Inter',
  },
  bubbleContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  bubbleContainerTeacher: {
    backgroundColor: '#5B47FB',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  messageTextTeacher: {
    color: '#FFF',
  },
  attachment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  attachmentText: {
    fontSize: 13,
    color: '#5B47FB',
    marginLeft: 6,
    fontFamily: 'Inter',
  },
  attachmentTextTeacher: {
    color: '#FFF',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 12,
  },
  messageFooterTeacher: {
    justifyContent: 'flex-end',
    marginLeft: 0,
    marginRight: 12,
  },
  messageTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginRight: 4,
    fontFamily: 'Inter',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  attachButton: {
    padding: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    maxHeight: 100,
  },
  messageInput: {
    fontSize: 15,
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5B47FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
});

export default ClassChat;

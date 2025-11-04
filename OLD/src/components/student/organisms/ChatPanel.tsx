/**
 * ChatPanel Component
 *
 * Real-time chat panel for live classes with message bubbles, typing indicators,
 * and auto-scroll functionality.
 *
 * Features:
 * - Real-time messaging via Supabase subscriptions
 * - Message bubbles (self vs others)
 * - Relative timestamp formatting
 * - Auto-scroll to latest message
 * - "Typing..." indicator
 * - Message input with send button
 * - Optimized FlatList rendering (inverted for chat UX)
 * - Empty state for no messages
 * - Material Design 3 styling
 *
 * @example
 * <ChatPanel
 *   classId="class_123"
 *   currentUserId="user_456"
 *   currentUserName="John Doe"
 * />
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';

// Chat Message
export interface ChatMessage {
  /** Unique message ID */
  id: string;

  /** Sender ID */
  senderId: string;

  /** Sender name */
  senderName: string;

  /** Sender avatar URL */
  senderAvatar?: string;

  /** Message content */
  content: string;

  /** Message timestamp */
  timestamp: string;

  /** Is read by current user */
  isRead: boolean;
}

// Typing User
interface TypingUser {
  userId: string;
  userName: string;
}

// Component Props
interface ChatPanelProps {
  /** Live class ID */
  classId: string;

  /** Current user ID */
  currentUserId: string;

  /** Current user name */
  currentUserName: string;

  /** Maximum height of the chat panel */
  maxHeight?: number;
}

/**
 * Format timestamp to relative time
 */
const formatTimestamp = (timestamp: string): string => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffMs = now.getTime() - messageTime.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return messageTime.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Fetch chat messages from Supabase
 */
const fetchMessages = async (classId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('class_messages')
    .select('*')
    .eq('class_id', classId)
    .order('created_at', { ascending: false }) // Descending for inverted list
    .limit(100);

  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }

  return (data || []).map((msg) => ({
    id: msg.id,
    senderId: msg.sender_id,
    senderName: msg.sender_name || 'Anonymous',
    senderAvatar: msg.sender_avatar,
    content: msg.content,
    timestamp: msg.created_at,
    isRead: msg.is_read || false,
  }));
};

/**
 * Send message to Supabase
 */
const sendMessage = async (
  classId: string,
  senderId: string,
  senderName: string,
  content: string
): Promise<void> => {
  const { error } = await supabase.from('class_messages').insert({
    class_id: classId,
    sender_id: senderId,
    sender_name: senderName,
    content,
    created_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Failed to send message: ${error.message}`);
  }
};

/**
 * Message Bubble Component
 */
interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = React.memo(
  ({ message, isOwnMessage }) => {
    return (
      <View
        style={[
          styles.messageBubbleContainer,
          isOwnMessage
            ? styles.ownMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        {/* Avatar (for other users) */}
        {!isOwnMessage && (
          <View style={styles.avatarContainer}>
            {message.senderAvatar ? (
              <View style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>
                  {message.senderName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Message Content */}
        <View style={styles.messageBubbleContent}>
          {/* Sender Name (for other users) */}
          {!isOwnMessage && (
            <Text style={styles.senderName}>{message.senderName}</Text>
          )}

          {/* Message Bubble */}
          <View
            style={[
              styles.messageBubble,
              isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
              ]}
            >
              {message.content}
            </Text>
          </View>

          {/* Timestamp */}
          <Text
            style={[
              styles.timestamp,
              isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp,
            ]}
          >
            {formatTimestamp(message.timestamp)}
          </Text>
        </View>
      </View>
    );
  }
);

MessageBubble.displayName = 'MessageBubble';

/**
 * Typing Indicator Component
 */
interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  const names =
    typingUsers.length === 1
      ? typingUsers[0]?.userName || 'Someone'
      : typingUsers.length === 2
      ? `${typingUsers[0]?.userName || 'Someone'} and ${typingUsers[1]?.userName || 'Someone'}`
      : `${typingUsers[0]?.userName || 'Someone'} and ${typingUsers.length - 1} others`;

  return (
    <View style={styles.typingIndicator}>
      <Text style={styles.typingText}>{names} typing...</Text>
      <View style={styles.typingDots}>
        <View style={[styles.typingDot, styles.typingDot1]} />
        <View style={[styles.typingDot, styles.typingDot2]} />
        <View style={[styles.typingDot, styles.typingDot3]} />
      </View>
    </View>
  );
};

/**
 * Empty State Component
 */
const EmptyState: React.FC = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyStateIcon}>💬</Text>
    <Text style={styles.emptyStateTitle}>No Messages Yet</Text>
    <Text style={styles.emptyStateText}>
      Be the first to say something in the chat
    </Text>
  </View>
);

/**
 * ChatPanel Component
 */
const ChatPanel: React.FC<ChatPanelProps> = ({
  classId,
  currentUserId,
  currentUserName,
  maxHeight = 500,
}) => {
  const queryClient = useQueryClient();
  const flatListRef = useRef<FlatList>(null);

  // Local state
  const [inputText, setInputText] = useState('');
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch messages
  const {
    data: messages,
    isLoading,
    error,
  } = useQuery<ChatMessage[], Error>({
    queryKey: ['classMessages', classId],
    queryFn: () => fetchMessages(classId),
    enabled: !!classId,
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      sendMessage(classId, currentUserId, currentUserName, content),
    onSuccess: () => {
      // Clear input
      setInputText('');

      // Invalidate messages query to refetch
      queryClient.invalidateQueries({ queryKey: ['classMessages', classId] });
    },
    onError: (error: Error) => {
      console.error('Failed to send message:', error);
    },
  });

  // Real-time subscription for new messages
  useEffect(() => {
    if (!classId) return;

    const messagesSubscription = supabase
      .channel(`class-messages-${classId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'class_messages',
          filter: `class_id=eq.${classId}`,
        },
        () => {
          // Invalidate and refetch messages
          queryClient.invalidateQueries({ queryKey: ['classMessages', classId] });
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [classId, queryClient]);

  // Real-time subscription for typing indicators
  useEffect(() => {
    if (!classId) return;

    const typingChannel = supabase.channel(`typing-${classId}`);

    typingChannel
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { userId, userName, isTyping } = payload.payload;

        if (userId === currentUserId) return; // Ignore own typing

        setTypingUsers((prev) => {
          if (isTyping) {
            // Add user to typing list
            if (prev.some((u) => u.userId === userId)) return prev;
            return [...prev, { userId, userName }];
          } else {
            // Remove user from typing list
            return prev.filter((u) => u.userId !== userId);
          }
        });
      })
      .subscribe();

    return () => {
      typingChannel.unsubscribe();
    };
  }, [classId, currentUserId]);

  // Handle input change
  const handleInputChange = useCallback(
    (text: string) => {
      setInputText(text);

      // Broadcast typing indicator
      if (text.length > 0) {
        supabase.channel(`typing-${classId}`).send({
          type: 'broadcast',
          event: 'typing',
          payload: {
            userId: currentUserId,
            userName: currentUserName,
            isTyping: true,
          },
        });

        // Clear previous timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Stop typing after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          supabase.channel(`typing-${classId}`).send({
            type: 'broadcast',
            event: 'typing',
            payload: {
              userId: currentUserId,
              userName: currentUserName,
              isTyping: false,
            },
          });
        }, 3000);
      }
    },
    [classId, currentUserId, currentUserName]
  );

  // Handle send message
  const handleSendMessage = useCallback(() => {
    const trimmedText = inputText.trim();
    if (trimmedText.length === 0) return;

    // Send message
    sendMutation.mutate(trimmedText);

    // Broadcast stop typing
    supabase.channel(`typing-${classId}`).send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        userId: currentUserId,
        userName: currentUserName,
        isTyping: false,
      },
    });
  }, [inputText, sendMutation, classId, currentUserId, currentUserName]);

  // Render message item
  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <MessageBubble
        message={item}
        isOwnMessage={item.senderId === currentUserId}
      />
    ),
    [currentUserId]
  );

  // Key extractor
  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={LightTheme.Primary} />
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Failed to load messages</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Messages List */}
      <View style={[styles.messagesContainer, { maxHeight }]}>
        {messages && messages.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={keyExtractor}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesListContent}
            inverted // Inverted for chat UX (newest at bottom)
            showsVerticalScrollIndicator={true}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            windowSize={10}
            initialNumToRender={20}
          />
        ) : (
          <EmptyState />
        )}

        {/* Typing Indicator */}
        <TypingIndicator typingUsers={typingUsers} />
      </View>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={LightTheme.OnSurfaceVariant}
          value={inputText}
          onChangeText={handleInputChange}
          multiline
          maxLength={500}
        />

        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            (inputText.trim().length === 0 || sendMutation.isPending) &&
              styles.sendButtonDisabled,
            pressed && styles.sendButtonPressed,
          ]}
          onPress={handleSendMessage}
          disabled={inputText.trim().length === 0 || sendMutation.isPending}
        >
          <Text style={styles.sendButtonText}>
            {sendMutation.isPending ? '...' : '➤'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightTheme.Surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: LightTheme.Error,
    marginBottom: 4,
  },
  errorSubtext: {
    ...Typography.bodyMedium, // MD3: 14px/20/400
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    marginHorizontal: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    backgroundColor: LightTheme.PrimaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: LightTheme.OnPrimaryContainer,
  },
  messageBubbleContent: {
    flex: 1,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: LightTheme.OnSurfaceVariant,
    marginBottom: 2,
    marginLeft: 12,
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ownMessageBubble: {
    backgroundColor: LightTheme.Primary,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: LightTheme.SurfaceVariant,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  ownMessageText: {
    color: LightTheme.OnPrimary,
  },
  otherMessageText: {
    color: LightTheme.OnSurface,
  },
  timestamp: {
    ...Typography.labelSmall, // MD3: 11px/16/500/0.5
    color: LightTheme.OnSurfaceVariant,
    marginTop: 2,
  },
  ownTimestamp: {
    textAlign: 'right',
    marginRight: 12,
  },
  otherTimestamp: {
    textAlign: 'left',
    marginLeft: 12,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    ...Typography.labelMedium, // MD3: 12px/16/500/0.5
    fontStyle: 'italic',
    color: LightTheme.OnSurfaceVariant,
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: LightTheme.OnSurfaceVariant,
    marginHorizontal: 2,
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.7,
  },
  typingDot3: {
    opacity: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: LightTheme.OutlineVariant,
    backgroundColor: LightTheme.Surface,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12, // MD3: 4dp grid compliance (was 10)
    fontSize: 15,
    color: LightTheme.OnSurface,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LightTheme.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: LightTheme.SurfaceVariant,
    opacity: 0.38, // MD3: 0.38 disabled opacity
  },
  sendButtonPressed: {
    opacity: 0.88, // MD3: Slight opacity for pressed state (1 - 0.12 overlay)
  },
  sendButtonText: {
    fontSize: 24, // MD3: Standard icon size (was 20)
    color: LightTheme.OnPrimary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: LightTheme.OnSurface,
    marginBottom: 8,
  },
  emptyStateText: {
    ...Typography.bodyMedium, // MD3: 14px/20/400
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
  },
});

export default ChatPanel;

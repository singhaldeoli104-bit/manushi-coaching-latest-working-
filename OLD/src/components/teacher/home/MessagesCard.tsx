/**
 * MessagesCard Component
 * Displays recent parent/student messages
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';

export type MessagePreview = {
  threadId: string;
  name: string;
  snippet: string;
  unreadCount: number;
  timeLabel: string;
  onPress: () => void;
};

type MessagesCardProps = {
  items: MessagePreview[];
  onPressSeeAll: () => void;
};

export const MessagesCard: React.FC<MessagesCardProps> = ({ items, onPressSeeAll }) => {
  const renderItem = ({ item }: { item: MessagePreview }) => (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={item.onPress}
      accessibilityLabel={`Message from ${item.name}. ${item.unreadCount} unread`}
      accessibilityRole="button"
    >
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Message Content */}
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageName}>{item.name}</Text>
          <Text style={styles.messageTime}>{item.timeLabel}</Text>
        </View>
        <Text style={styles.messageSnippet} numberOfLines={2}>
          {item.snippet}
        </Text>
      </View>

      {/* Unread Badge */}
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
        </View>
      )}
    </Pressable>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🙌</Text>
      <Text style={styles.emptyText}>No unread messages. You're all caught up!</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        {items.length > 0 && (
          <Pressable
            onPress={onPressSeeAll}
            accessibilityLabel="See all messages"
            accessibilityRole="button"
          >
            <Text style={styles.seeAllText}>See all ›</Text>
          </Pressable>
        )}
      </View>

      {items.length > 0 ? (
        <FlatList
          data={items.slice(0, 3)}
          renderItem={renderItem}
          keyExtractor={(item) => item.threadId}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        renderEmpty()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 24,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    gap: 12,
    minHeight: 64,
  },
  rowPressed: {
    backgroundColor: '#F8FAFC',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4C1D95',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  messageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  messageTime: {
    fontSize: 12,
    fontWeight: '400',
    color: '#94A3B8',
  },
  messageSnippet: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 16,
  },
  unreadBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
  },
});

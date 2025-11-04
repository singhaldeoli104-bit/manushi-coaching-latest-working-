/**
 * TasksCard Component
 * Displays pending tasks and approvals
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';

export type TaskPreview = {
  id: string;
  title: string;
  dueLabel: string;
  status: 'pending' | 'overdue' | 'done';
  onPress: () => void;
};

type TasksCardProps = {
  items: TaskPreview[];
  onPressSeeAll: () => void;
};

export const TasksCard: React.FC<TasksCardProps> = ({ items, onPressSeeAll }) => {
  const renderItem = ({ item }: { item: TaskPreview }) => (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={item.onPress}
      accessibilityLabel={`${item.title}. Status: ${item.status}. ${item.dueLabel}`}
      accessibilityRole="button"
    >
      <View style={styles.rowContent}>
        <Text style={styles.rowTitle}>{item.title}</Text>
        <View style={styles.rowMeta}>
          <Text
            style={[
              styles.statusText,
              item.status === 'overdue' && styles.statusTextOverdue,
              item.status === 'pending' && styles.statusTextPending,
            ]}
          >
            Status: {item.status === 'overdue' ? 'Overdue' : 'Pending'}
          </Text>
          <Text style={styles.separator}>·</Text>
          <Text
            style={[
              styles.dueText,
              item.status === 'overdue' && styles.dueTextOverdue,
            ]}
          >
            {item.dueLabel}
          </Text>
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎉</Text>
      <Text style={styles.emptyText}>No pending tasks</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Your tasks</Text>
        {items.length > 0 && (
          <Pressable
            onPress={onPressSeeAll}
            accessibilityLabel="View all tasks"
            accessibilityRole="button"
          >
            <Text style={styles.seeAllText}>View all ›</Text>
          </Pressable>
        )}
      </View>

      {items.length > 0 ? (
        <FlatList
          data={items.slice(0, 3)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    minHeight: 64,
  },
  rowPressed: {
    backgroundColor: '#F8FAFC',
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 6,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTextPending: {
    color: '#D97706',
  },
  statusTextOverdue: {
    color: '#DC2626',
  },
  separator: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  dueText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  dueTextOverdue: {
    color: '#DC2626',
  },
  chevron: {
    fontSize: 24,
    color: '#CBD5E1',
  },
  divider: {
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
  },
});

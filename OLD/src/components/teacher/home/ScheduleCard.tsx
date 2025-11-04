/**
 * ScheduleCard Component
 * Displays today's class schedule
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';

export type ScheduleItem = {
  id: string;
  timeRange: string;
  subject: string;
  className: string;
  room: string;
  attendanceStatus: 'pending' | 'submitted' | 'late';
  onPress: () => void;
};

type ScheduleCardProps = {
  items: ScheduleItem[];
};

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ items }) => {
  const renderItem = ({ item }: { item: ScheduleItem }) => (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={item.onPress}
      accessibilityLabel={`${item.timeRange} ${item.subject} class ${item.className} in room ${item.room}`}
      accessibilityRole="button"
    >
      <View style={styles.rowLeft}>
        <Text style={styles.rowTitle}>
          {item.timeRange} • {item.subject}
        </Text>
        <Text style={styles.rowSubtitle}>
          Class {item.className} • Room {item.room}
        </Text>
      </View>

      <View style={styles.rowRight}>
        <View
          style={[
            styles.statusBadge,
            item.attendanceStatus === 'pending' && styles.statusBadgePending,
            item.attendanceStatus === 'submitted' && styles.statusBadgeSubmitted,
            item.attendanceStatus === 'late' && styles.statusBadgeLate,
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              item.attendanceStatus === 'pending' && styles.statusBadgeTextPending,
              item.attendanceStatus === 'submitted' && styles.statusBadgeTextSubmitted,
              item.attendanceStatus === 'late' && styles.statusBadgeTextLate,
            ]}
          >
            {item.attendanceStatus === 'pending' && 'Pending'}
            {item.attendanceStatus === 'submitted' && 'Submitted'}
            {item.attendanceStatus === 'late' && 'Late'}
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📅</Text>
      <Text style={styles.emptyText}>No remaining classes today</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Today's classes</Text>
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    lineHeight: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 64,
    paddingVertical: 12,
  },
  rowPressed: {
    backgroundColor: '#F8FAFC',
  },
  rowLeft: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  rowSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeSubmitted: {
    backgroundColor: '#D1FAE5',
  },
  statusBadgeLate: {
    backgroundColor: '#FEE2E2',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadgeTextPending: {
    color: '#92400E',
  },
  statusBadgeTextSubmitted: {
    color: '#065F46',
  },
  statusBadgeTextLate: {
    color: '#991B1B',
  },
  chevron: {
    fontSize: 24,
    color: '#CBD5E1',
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
  },
});

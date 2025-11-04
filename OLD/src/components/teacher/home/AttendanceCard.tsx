/**
 * AttendanceCard Component
 * Displays attendance status for classes
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';

export type AttendanceRow = {
  className: string;
  status: 'pending' | 'submitted';
  ctaLabel: string;
  onPress: () => void;
};

type AttendanceCardProps = {
  rows: AttendanceRow[];
};

export const AttendanceCard: React.FC<AttendanceCardProps> = ({ rows }) => {
  const allSubmitted = rows.length > 0 && rows.every((r) => r.status === 'submitted');

  const renderItem = ({ item }: { item: AttendanceRow }) => (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={item.onPress}
      accessibilityLabel={`${item.className} attendance ${item.status}. ${item.ctaLabel}`}
      accessibilityRole="button"
    >
      <View style={styles.rowLeft}>
        <Text style={styles.rowText}>
          Class {item.className} — Today:{' '}
          <Text
            style={[
              styles.statusText,
              item.status === 'pending' && styles.statusTextPending,
              item.status === 'submitted' && styles.statusTextSubmitted,
            ]}
          >
            {item.status === 'pending' ? 'Pending' : 'Submitted'}
          </Text>
        </Text>
      </View>

      <View style={styles.rowRight}>
        <Text style={styles.ctaText}>{item.ctaLabel}</Text>
        <Text style={styles.chevron}>▶</Text>
      </View>
    </Pressable>
  );

  const renderAllSubmitted = () => (
    <View style={styles.successContainer}>
      <Text style={styles.successIcon}>✅</Text>
      <Text style={styles.successText}>All attendance submitted</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Attendance</Text>
      {allSubmitted ? (
        renderAllSubmitted()
      ) : (
        <FlatList
          data={rows}
          renderItem={renderItem}
          keyExtractor={(item) => item.className}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
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
    paddingVertical: 12,
    minHeight: 48,
  },
  rowPressed: {
    backgroundColor: '#F8FAFC',
  },
  rowLeft: {
    flex: 1,
  },
  rowText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
  },
  statusText: {
    fontWeight: '600',
  },
  statusTextPending: {
    color: '#D97706',
  },
  statusTextSubmitted: {
    color: '#059669',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  chevron: {
    fontSize: 14,
    color: '#3B82F6',
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  successIcon: {
    fontSize: 20,
  },
  successText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#059669',
  },
});

/**
 * QuickActionsCard Component
 * Displays quick action buttons for common teacher tasks
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type QuickActionsCardProps = {
  onTakeAttendance: () => void;
  onSendAnnouncement: () => void;
  onAddHomework: () => void;
  onMessageParent: () => void;
};

type ActionTile = {
  icon: string;
  label: string;
  onPress: () => void;
};

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onTakeAttendance,
  onSendAnnouncement,
  onAddHomework,
  onMessageParent,
}) => {
  const actions: ActionTile[] = [
    { icon: '✓', label: 'Take attendance', onPress: onTakeAttendance },
    { icon: '📢', label: 'Send announcement', onPress: onSendAnnouncement },
    { icon: '📝', label: 'Add homework', onPress: onAddHomework },
    { icon: '💬', label: 'Message parent', onPress: onMessageParent },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Quick actions</Text>
      <View style={styles.actionsGrid}>
        {actions.map((action, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.actionTile,
              pressed && styles.actionTilePressed,
            ]}
            onPress={action.onPress}
            accessibilityLabel={action.label}
            accessibilityRole="button"
          >
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </Pressable>
        ))}
      </View>
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionTile: {
    width: '47%',
    minHeight: 80,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionTilePressed: {
    backgroundColor: '#E2E8F0',
  },
  actionIcon: {
    fontSize: 24,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1E293B',
    textAlign: 'center',
  },
});

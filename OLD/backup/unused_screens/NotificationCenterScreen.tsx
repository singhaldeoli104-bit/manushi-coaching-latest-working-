import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card, Chip, Row, T } from '../../ui';
import { Colors, Spacing, BorderRadius } from '../../theme/designSystem';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';

type Props = NativeStackScreenProps<any, 'NotificationCenterScreen'>;

type NotificationCategory = 'class' | 'assignment' | 'test' | 'system';

interface AppNotification {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  createdAtLabel: string;
  isRead: boolean;
  metaLabel?: string;
  section: 'today' | 'earlier';
}

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Live class starting soon',
    body: 'Your Math class "Algebra revision" starts in 15 minutes.',
    category: 'class',
    createdAtLabel: '15m ago',
    isRead: false,
    metaLabel: 'Class',
    section: 'today',
  },
  {
    id: 'n2',
    title: 'Assignment due tomorrow',
    body: 'Algebra Worksheet 03 is due tomorrow at 8:00 PM.',
    category: 'assignment',
    createdAtLabel: '1h ago',
    isRead: false,
    metaLabel: 'Assignment',
    section: 'today',
  },
  {
    id: 'n3',
    title: 'Test result published',
    body: 'Your result for "Sample Math Test" is now available.',
    category: 'test',
    createdAtLabel: 'Yesterday',
    isRead: true,
    metaLabel: 'Test',
    section: 'earlier',
  },
  {
    id: 'n4',
    title: 'New resource added: Algebra formula sheet',
    body: 'Check the study library for the new Algebra formula sheet.',
    category: 'system',
    createdAtLabel: '2 days ago',
    isRead: true,
    metaLabel: 'Resource',
    section: 'earlier',
  },
];

function useNotificationsMock() {
  // TODO: Replace with Supabase-backed notifications.
  const notifications = MOCK_NOTIFICATIONS;
  return { notifications };
}

type CategoryFilter = 'all' | NotificationCategory;

export default function NotificationCenterScreen({ navigation }: Props) {
  const { notifications } = useNotificationsMock();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [localNotifications, setLocalNotifications] = useState<AppNotification[]>(notifications);

  useEffect(() => {
    trackScreenView('NotificationCenterScreen');
  }, []);

  const handleFilterChange = useCallback((cat: CategoryFilter) => {
    setCategoryFilter(cat);
    trackAction('notifications_filter_change', 'NotificationCenterScreen', { category: cat });
  }, []);

  const markReadAndNavigate = useCallback(
    (notif: AppNotification) => {
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
      trackAction('notification_open', 'NotificationCenterScreen', { id: notif.id, category: notif.category });

      // Simple placeholder navigation per category
      switch (notif.category) {
        case 'class':
          Alert.alert('Open class', 'Navigate to live/virtual class (placeholder).');
          break;
        case 'assignment':
          Alert.alert('Open assignment', 'Navigate to assignment detail (placeholder).');
          break;
        case 'test':
          Alert.alert('Open test', 'Navigate to test center/review (placeholder).');
          break;
        default:
          Alert.alert('Open item', 'Navigate to relevant screen (placeholder).');
      }
    },
    []
  );

  const filteredNotifications = useMemo(() => {
    return localNotifications.filter(
      (n) => categoryFilter === 'all' || n.category === categoryFilter
    );
  }, [localNotifications, categoryFilter]);

  const today = filteredNotifications.filter((n) => n.section === 'today');
  const earlier = filteredNotifications.filter((n) => n.section === 'earlier');
  const isEmpty = today.length === 0 && earlier.length === 0;

  return (
    <BaseScreen scrollable>
      <View style={styles.container}>
        <View style={styles.header}>
          <T variant="title" weight="bold">
            Notifications
          </T>
          <T variant="caption" color="textSecondary">
            All your class, assignment and test alerts in one place.
          </T>
        </View>

        <Row style={styles.categoriesRow}>
          {([
            { label: 'All', value: 'all' },
            { label: 'Classes', value: 'class' },
            { label: 'Assignments', value: 'assignment' },
            { label: 'Tests', value: 'test' },
            { label: 'System', value: 'system' },
          ] as const).map((chip) => (
            <Chip
              key={chip.value}
              label={chip.label}
              selected={categoryFilter === chip.value}
              onPress={() => handleFilterChange(chip.value)}
              variant="filter"
              style={styles.categoryChip}
            />
          ))}
        </Row>

        {isEmpty ? (
          <Card style={styles.emptyStateCard}>
            <T variant="body" weight="medium">
              No notifications here.
            </T>
            <T variant="caption" color="textSecondary">
              You’re all caught up.
            </T>
          </Card>
        ) : (
          <>
            {today.length > 0 && (
              <View style={{ marginTop: Spacing.sm }}>
                <T variant="subtitle" weight="bold" style={styles.sectionTitle}>
                  Today
                </T>
                {today.map((n) => (
                  <Card key={n.id} style={styles.notificationCard}>
                    <TouchableOpacity
                      style={styles.notificationRow}
                      onPress={() => markReadAndNavigate(n)}
                      accessibilityRole="button"
                      accessibilityLabel={`Open notification ${n.title}`}
                    >
                      <View style={{ flex: 1 }}>
                        <Row style={{ alignItems: 'center', marginBottom: 2 }}>
                          {!n.isRead && <View style={styles.unreadDot} />}
                          <T variant="body" weight="medium" style={{ flex: 1 }}>
                            {n.title}
                          </T>
                        </Row>
                        <T variant="caption" color="textSecondary" style={{ marginBottom: 4 }}>
                          {n.body}
                        </T>
                        <T variant="caption" color="textSecondary">
                          {(n.metaLabel || 'Alert')} • {n.createdAtLabel}
                        </T>
                      </View>
                    </TouchableOpacity>
                  </Card>
                ))}
              </View>
            )}

            {earlier.length > 0 && (
              <View style={{ marginTop: Spacing.md }}>
                <T variant="subtitle" weight="bold" style={styles.sectionTitle}>
                  Earlier
                </T>
                {earlier.map((n) => (
                  <Card key={n.id} style={styles.notificationCard}>
                    <TouchableOpacity
                      style={styles.notificationRow}
                      onPress={() => markReadAndNavigate(n)}
                      accessibilityRole="button"
                      accessibilityLabel={`Open notification ${n.title}`}
                    >
                      <View style={{ flex: 1 }}>
                        <Row style={{ alignItems: 'center', marginBottom: 2 }}>
                          {!n.isRead && <View style={styles.unreadDot} />}
                          <T variant="body" weight="medium" style={{ flex: 1 }}>
                            {n.title}
                          </T>
                        </Row>
                        <T variant="caption" color="textSecondary" style={{ marginBottom: 4 }}>
                          {n.body}
                        </T>
                        <T variant="caption" color="textSecondary">
                          {(n.metaLabel || 'Alert')} • {n.createdAtLabel}
                        </T>
                      </View>
                    </TouchableOpacity>
                  </Card>
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.md,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  categoryChip: {
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    marginBottom: Spacing.xs,
  },
  notificationCard: {
    marginBottom: Spacing.xs,
    borderRadius: BorderRadius.lg,
  },
  notificationRow: {
    flexDirection: 'row',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: Spacing.xs,
    marginTop: 4,
  },
  emptyStateCard: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
});

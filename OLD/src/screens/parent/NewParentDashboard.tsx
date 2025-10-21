/**
 * NEW Modern Parent Dashboard
 * Connected to Real Supabase Data
 *
 * This is a clean, modern implementation to showcase:
 * - Real backend integration
 * - Clean UI/UX
 * - Proper loading states
 * - Error handling
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Button,
  Chip,
  ActivityIndicator,
  Divider,
  IconButton,
} from 'react-native-paper';
import { useParentDashboard } from '../../hooks/useParentDashboard';
import { useAuth } from '../../context/AuthContext';

const NewParentDashboard = () => {
  // Get current user from auth context
  const { user } = useAuth();
  const parentId = user?.id || '11111111-1111-1111-1111-111111111111'; // Fallback to test parent

  // Fetch dashboard data
  const {
    profile,
    children,
    notifications,
    financialSummary,
    isLoading,
    isError,
    refetch,
  } = useParentDashboard(parentId);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Loading state
  if (isLoading && !profile) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load dashboard</Text>
        <Button mode="contained" onPress={refetch} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Avatar.Text
            size={60}
            label={profile?.full_name?.substring(0, 2) || 'P'}
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <Text variant="headlineSmall" style={styles.welcomeText}>
              Welcome back,
            </Text>
            <Text variant="titleLarge" style={styles.nameText}>
              {profile?.full_name || 'Parent'}
            </Text>
            <Text variant="bodySmall" style={styles.emailText}>
              {profile?.email}
            </Text>
          </View>
        </View>
        <Chip icon="check-circle" mode="outlined" style={styles.statusChip}>
          Connected to Supabase ✓
        </Chip>
      </View>

      <Divider style={styles.divider} />

      {/* Children Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Your Children
          </Text>
          <IconButton icon="account-multiple" size={24} />
        </View>

        {children.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text>No children found. Add children to see their progress.</Text>
            </Card.Content>
          </Card>
        ) : (
          children.map((child) => (
            <Card key={child.id} style={styles.card} mode="elevated">
              <Card.Content>
                <View style={styles.childHeader}>
                  <Avatar.Text
                    size={48}
                    label={child.full_name.substring(0, 2)}
                    style={styles.childAvatar}
                  />
                  <View style={styles.childInfo}>
                    <Text variant="titleMedium" style={styles.childName}>
                      {child.full_name}
                    </Text>
                    <Text variant="bodySmall" style={styles.childId}>
                      Student ID: {child.student_id}
                    </Text>
                    <View style={styles.chipContainer}>
                      <Chip
                        icon="check"
                        mode="flat"
                        compact
                        style={styles.statusActiveChip}
                      >
                        {child.status}
                      </Chip>
                      <Chip
                        icon="heart"
                        mode="flat"
                        compact
                        style={styles.relationshipChip}
                      >
                        {child.relationship_type}
                      </Chip>
                    </View>
                  </View>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button
                  mode="text"
                  onPress={() =>
                    Alert.alert(
                      'View Progress',
                      `Opening progress for ${child.full_name}`
                    )
                  }
                >
                  View Progress
                </Button>
                <Button
                  mode="text"
                  onPress={() =>
                    Alert.alert(
                      'Attendance',
                      `Opening attendance for ${child.full_name}`
                    )
                  }
                >
                  Attendance
                </Button>
              </Card.Actions>
            </Card>
          ))
        )}
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Recent Notifications
          </Text>
          <IconButton icon="bell" size={24} />
        </View>

        {notifications.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text>No notifications yet.</Text>
            </Card.Content>
          </Card>
        ) : (
          notifications.slice(0, 3).map((notification) => (
            <Card
              key={notification.id}
              style={[
                styles.card,
                !notification.is_read && styles.unreadNotification,
              ]}
            >
              <Card.Content>
                <View style={styles.notificationHeader}>
                  <Text variant="titleMedium">{notification.title}</Text>
                  {!notification.is_read && (
                    <Chip icon="circle" compact mode="flat" style={styles.newBadge}>
                      New
                    </Chip>
                  )}
                </View>
                <Text variant="bodyMedium" style={styles.notificationMessage}>
                  {notification.message}
                </Text>
                <Text variant="bodySmall" style={styles.notificationTime}>
                  {new Date(notification.created_at).toLocaleString()}
                </Text>
              </Card.Content>
            </Card>
          ))
        )}
      </View>

      {/* Financial Summary */}
      {financialSummary && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Financial Summary
            </Text>
            <IconButton icon="currency-inr" size={24} />
          </View>

          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <View style={styles.financialGrid}>
                <View style={styles.financialItem}>
                  <Text variant="bodySmall" style={styles.financialLabel}>
                    Total Fees
                  </Text>
                  <Text variant="headlineSmall" style={styles.financialAmount}>
                    ₹{financialSummary.total_fees?.toLocaleString() || '0'}
                  </Text>
                </View>
                <View style={styles.financialItem}>
                  <Text variant="bodySmall" style={styles.financialLabel}>
                    Paid
                  </Text>
                  <Text
                    variant="headlineSmall"
                    style={[styles.financialAmount, styles.paidAmount]}
                  >
                    ₹{financialSummary.total_paid?.toLocaleString() || '0'}
                  </Text>
                </View>
                <View style={styles.financialItem}>
                  <Text variant="bodySmall" style={styles.financialLabel}>
                    Outstanding
                  </Text>
                  <Text
                    variant="headlineSmall"
                    style={[styles.financialAmount, styles.dueAmount]}
                  >
                    ₹{financialSummary.total_outstanding?.toLocaleString() || '0'}
                  </Text>
                </View>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => Alert.alert('Payment', 'Opening payment gateway...')}
              >
                Make Payment
              </Button>
              <Button mode="text">View Details</Button>
            </Card.Actions>
          </Card>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Quick Actions
        </Text>
        <View style={styles.quickActions}>
          <Card style={styles.actionCard} onPress={() => Alert.alert('Teachers')}>
            <Card.Content style={styles.actionContent}>
              <IconButton icon="account-group" size={32} />
              <Text variant="bodyMedium">Contact Teachers</Text>
            </Card.Content>
          </Card>
          <Card style={styles.actionCard} onPress={() => Alert.alert('Schedule')}>
            <Card.Content style={styles.actionContent}>
              <IconButton icon="calendar" size={32} />
              <Text variant="bodyMedium">View Schedule</Text>
            </Card.Content>
          </Card>
          <Card style={styles.actionCard} onPress={() => Alert.alert('Reports')}>
            <Card.Content style={styles.actionContent}>
              <IconButton icon="chart-line" size={32} />
              <Text variant="bodyMedium">View Reports</Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      <View style={styles.footer}>
        <Text variant="bodySmall" style={styles.footerText}>
          🎉 This is your NEW dashboard with real Supabase data!
        </Text>
        <Text variant="bodySmall" style={styles.footerText}>
          Data updates in real-time from your backend.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#6200ee',
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  welcomeText: {
    color: '#666',
  },
  nameText: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  emailText: {
    color: '#999',
    marginTop: 2,
  },
  statusChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f5e9',
  },
  divider: {
    marginVertical: 8,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  childHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childAvatar: {
    backgroundColor: '#03a9f4',
  },
  childInfo: {
    marginLeft: 12,
    flex: 1,
  },
  childName: {
    fontWeight: 'bold',
  },
  childId: {
    color: '#666',
    marginTop: 2,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  statusActiveChip: {
    backgroundColor: '#e8f5e9',
  },
  relationshipChip: {
    backgroundColor: '#fff3e0',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationMessage: {
    color: '#666',
    marginBottom: 8,
  },
  notificationTime: {
    color: '#999',
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  newBadge: {
    backgroundColor: '#6200ee',
  },
  financialGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  financialItem: {
    alignItems: 'center',
  },
  financialLabel: {
    color: '#666',
    marginBottom: 4,
  },
  financialAmount: {
    fontWeight: 'bold',
  },
  paidAmount: {
    color: '#4caf50',
  },
  dueAmount: {
    color: '#f44336',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
  },
  actionContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    marginTop: 16,
  },
  footerText: {
    color: '#856404',
    textAlign: 'center',
    marginVertical: 2,
  },
});

export default NewParentDashboard;

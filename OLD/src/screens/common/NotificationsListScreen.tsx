/**
 * Notifications List Screen (MD3)
 * Shows all notifications for the parent
 */

import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Col, T, Card, CardHeader, CardContent, Badge } from '../../ui';
import { Colors, Spacing } from '../../theme/designSystem';
import { View } from 'react-native';
import { trackAction } from '../../utils/navigationAnalytics';
import type { ParentStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ParentStackParamList, 'NotificationsList'>;

const NotificationsListScreen: React.FC<Props> = ({ route, navigation }) => {
  React.useEffect(() => {
    trackAction('view_notifications_list', 'NotificationsList');
  }, []);

  // TODO: Replace with real data from useParentDashboard hook
  const notifications = [
    {
      id: '1',
      title: 'Assignment Due Tomorrow',
      body: 'Math homework is due tomorrow at 5 PM',
      type: 'academic',
      read: false,
      timestamp: new Date(),
    },
    {
      id: '2',
      title: 'Payment Reminder',
      body: 'Monthly fee payment is pending',
      type: 'financial',
      read: false,
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: '3',
      title: 'Teacher Message',
      body: 'Mrs. Smith sent you a message about your child',
      type: 'communication',
      read: true,
      timestamp: new Date(Date.now() - 172800000),
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIconByType = (type: string) => {
    switch (type) {
      case 'academic': return 'book';
      case 'financial': return 'currency-inr';
      case 'communication': return 'message';
      default: return 'bell';
    }
  };

  const getColorByType = (type: string) => {
    switch (type) {
      case 'academic': return Colors.primary;
      case 'financial': return Colors.warning;
      case 'communication': return Colors.accent;
      default: return Colors.textSecondary;
    }
  };

  return (
    <BaseScreen scrollable loading={false} error={null} empty={notifications.length === 0}>
      <Col sx={{ p: 'md' }}>
        {/* Header */}
        <Col sx={{ mb: 'lg' }}>
          <T variant="headline" weight="bold">Notifications</T>
          {unreadCount > 0 && (
            <T variant="caption" color="textSecondary" style={{ marginTop: Spacing.xs }}>
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </T>
          )}
        </Col>

        {/* Notifications List */}
        <Col gap="sm">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              variant="elevated"
              onPress={() => {
                trackAction('view_notification', 'NotificationsList', { notificationId: notification.id });
                // TODO: Mark as read and navigate to relevant screen
              }}
            >
              <CardHeader
                icon={getIconByType(notification.type)}
                iconColor={getColorByType(notification.type)}
                title={notification.title}
                subtitle={notification.timestamp.toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                trailing={!notification.read ? <Badge variant="primary">New</Badge> : undefined}
              />
              <CardContent>
                <T variant="body" color={notification.read ? 'textSecondary' : 'textPrimary'}>
                  {notification.body}
                </T>
              </CardContent>
              {!notification.read && (
                <View style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  backgroundColor: Colors.primary,
                }} />
              )}
            </Card>
          ))}
        </Col>

        {/* Mark All as Read Button */}
        {unreadCount > 0 && (
          <Col sx={{ mt: 'lg' }}>
            <Card variant="outlined" onPress={() => {
              trackAction('mark_all_read', 'NotificationsList');
              // TODO: Mark all as read
            }}>
              <CardContent>
                <T variant="body" align="center" color="primary" weight="semiBold">
                  Mark All as Read
                </T>
              </CardContent>
            </Card>
          </Col>
        )}
      </Col>
    </BaseScreen>
  );
};

export default NotificationsListScreen;

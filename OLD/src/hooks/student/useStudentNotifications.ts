/**
 * useStudentNotifications Hook
 *
 * Fetches and manages student notifications with real-time updates and mark-as-read functionality.
 *
 * Features:
 * - Real-time subscription for new notifications
 * - Filter read/unread notifications
 * - Unread count for badge display
 * - Mark as read/unread functionality
 * - Sort by newest first
 * - React Query caching (1 minute)
 *
 * @example
 * const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead } = useStudentNotifications();
 *
 * // With filter
 * const { notifications } = useStudentNotifications('unread');
 *
 * if (loading) return <LoadingState />;
 * if (error) return <ErrorState />;
 *
 * return (
 *   <>
 *     <Badge count={unreadCount} />
 *     {notifications.map(notification => (
 *       <Card key={notification.id} onPress={() => markAsRead(notification.id)}>
 *         <Text>{notification.title}</Text>
 *         <Text>{notification.message}</Text>
 *       </Card>
 *     ))}
 *   </>
 * );
 */

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useStudent } from '../../context/StudentContext';

// Notification Type
export type NotificationType =
  | 'assignment'
  | 'grade'
  | 'announcement'
  | 'reminder'
  | 'doubt_answer'
  | 'attendance'
  | 'achievement'
  | 'general';

// Notification Priority
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

// Notification Filter
export type NotificationFilter = 'all' | 'unread' | 'read';

// Student Notification
export interface StudentNotification {
  /** Unique notification ID */
  id: string;

  /** Notification type */
  type: NotificationType;

  /** Notification title */
  title: string;

  /** Notification message */
  message: string;

  /** Priority level */
  priority: NotificationPriority;

  /** Is read */
  isRead: boolean;

  /** Read timestamp */
  readAt?: string;

  /** Related entity ID (assignment_id, doubt_id, etc.) */
  relatedId?: string;

  /** Action label (e.g., "View Assignment", "Reply") */
  actionLabel?: string;

  /** Action route/screen */
  actionRoute?: string;

  /** Action params */
  actionParams?: Record<string, any>;

  /** Icon name */
  icon?: string;

  /** Icon color */
  iconColor?: string;

  /** Sender name (for announcements) */
  senderName?: string;

  /** Sender avatar */
  senderAvatar?: string;

  /** Is pinned */
  isPinned: boolean;

  /** Expiry date (for time-sensitive notifications) */
  expiresAt?: string;

  /** Is expired */
  isExpired: boolean;

  /** Created timestamp */
  createdAt: string;
}

/**
 * Check if notification is expired
 */
const checkExpired = (expiresAt?: string): boolean => {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
};

/**
 * Fetch student notifications from Supabase
 */
const fetchStudentNotifications = async (
  studentId: string,
  filter: NotificationFilter = 'all'
): Promise<StudentNotification[]> => {
  let query = supabase
    .from('notifications')
    .select('id, type, title, message, priority, is_read, read_at, related_id, action_label, action_route, action_params, icon, icon_color, sender_name, sender_avatar, is_pinned, expires_at, created_at')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  // Apply read/unread filter
  if (filter === 'unread') {
    query = query.eq('is_read', false);
  } else if (filter === 'read') {
    query = query.eq('is_read', true);
  }

  const { data: rawNotifications, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }

  if (!rawNotifications) {
    return [];
  }

  // Transform notifications
  const notifications: StudentNotification[] = rawNotifications.map((notification) => {
    const isExpired = checkExpired(notification.expires_at);

    return {
      id: notification.id,
      type: notification.type as NotificationType,
      title: notification.title || 'Notification',
      message: notification.message || '',
      priority: notification.priority || 'normal',
      isRead: notification.is_read || false,
      readAt: notification.read_at,
      relatedId: notification.related_id,
      actionLabel: notification.action_label,
      actionRoute: notification.action_route,
      actionParams: notification.action_params,
      icon: notification.icon,
      iconColor: notification.icon_color,
      senderName: notification.sender_name,
      senderAvatar: notification.sender_avatar,
      isPinned: notification.is_pinned || false,
      expiresAt: notification.expires_at,
      isExpired,
      createdAt: notification.created_at,
    };
  });

  // Sort: pinned first, then by created date descending
  notifications.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return notifications;
};

/**
 * Mark notification as read
 */
const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId);

  if (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
};

/**
 * Mark all notifications as read
 */
const markAllNotificationsAsRead = async (studentId: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('student_id', studentId)
    .eq('is_read', false);

  if (error) {
    throw new Error(`Failed to mark all notifications as read: ${error.message}`);
  }
};

/**
 * Hook to fetch and manage student notifications
 *
 * @param filter - Filter for read/unread notifications (all, unread, read)
 * @returns Notifications with actions, loading, and error states
 */
export const useStudentNotifications = (filter: NotificationFilter = 'all') => {
  const { student } = useStudent();
  const studentId = student?.id;
  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<StudentNotification[], Error>({
    queryKey: ['studentNotifications', studentId, filter],
    queryFn: () => fetchStudentNotifications(studentId!, filter),
    enabled: !!studentId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Real-time subscription for new notifications
  useEffect(() => {
    if (!studentId) return;

    // Subscribe to new notifications
    const notificationsSubscription = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `student_id=eq.${studentId}`,
        },
        () => {
          // Invalidate and refetch notifications
          queryClient.invalidateQueries({ queryKey: ['studentNotifications', studentId] });
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      notificationsSubscription.unsubscribe();
    };
  }, [studentId, queryClient]);

  // Mutation for marking notification as read
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // Invalidate notifications query to refetch
      queryClient.invalidateQueries({ queryKey: ['studentNotifications', studentId] });
    },
  });

  // Mutation for marking all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(studentId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentNotifications', studentId] });
    },
  });

  // Calculate statistics
  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;
  const readCount = notifications?.filter((n) => n.isRead).length || 0;
  const urgentCount = notifications?.filter((n) => n.priority === 'urgent' && !n.isRead).length || 0;
  const pinnedCount = notifications?.filter((n) => n.isPinned).length || 0;

  // Group by type
  const byType = notifications?.reduce((acc, notification) => {
    const type = notification.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(notification);
    return acc;
  }, {} as Record<NotificationType, StudentNotification[]>);

  return {
    notifications: notifications || [],
    loading,
    error: error as Error | null,
    refetch,
    markAsRead: (notificationId: string) => markAsReadMutation.mutate(notificationId),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    markingAsRead: markAsReadMutation.isPending,
    unreadCount,
    readCount,
    urgentCount,
    pinnedCount,
    byType: byType || {},
  };
};

export default useStudentNotifications;

/**
 * ParticipantsList Component
 *
 * Displays a scrollable list of participants in a live class with real-time updates.
 *
 * Features:
 * - Real-time participant status (online/offline)
 * - Raised hand indicator with priority badge
 * - Speaking indicator with audio wave animation
 * - Role badges (Host, Teacher, Student)
 * - Optimized FlatList rendering for 10-50+ participants
 * - Empty state for no participants
 * - Material Design 3 styling
 *
 * @example
 * <ParticipantsList
 *   classId="class_123"
 *   currentUserId="user_456"
 *   onParticipantPress={(participant) => console.log(participant)}
 * />
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';

// Participant Role
export type ParticipantRole = 'host' | 'teacher' | 'student';

// Participant Status
export type ParticipantStatus = 'online' | 'offline' | 'away';

// Participant Data
export interface Participant {
  /** Unique participant ID */
  id: string;

  /** Participant name */
  name: string;

  /** Avatar URL */
  avatar?: string;

  /** Role in the class */
  role: ParticipantRole;

  /** Online status */
  status: ParticipantStatus;

  /** Has raised hand */
  raisedHand: boolean;

  /** Is currently speaking */
  isSpeaking: boolean;

  /** Microphone enabled */
  micEnabled: boolean;

  /** Camera enabled */
  cameraEnabled: boolean;

  /** Join timestamp */
  joinedAt: string;
}

// Component Props
interface ParticipantsListProps {
  /** Live class ID */
  classId: string;

  /** Current user ID */
  currentUserId: string;

  /** Callback when participant is pressed */
  onParticipantPress?: (participant: Participant) => void;

  /** Maximum height of the list */
  maxHeight?: number;
}

/**
 * Fetch participants from Supabase
 */
const fetchParticipants = async (classId: string): Promise<Participant[]> => {
  const { data, error } = await supabase
    .from('class_participants')
    .select('*')
    .eq('class_id', classId)
    .order('role', { ascending: true }) // Host/Teacher first
    .order('raised_hand', { ascending: false }) // Raised hands first
    .order('name', { ascending: true }); // Then alphabetically

  if (error) {
    throw new Error(`Failed to fetch participants: ${error.message}`);
  }

  return (data || []).map((p) => ({
    id: p.id,
    name: p.name || 'Anonymous',
    avatar: p.avatar,
    role: p.role as ParticipantRole,
    status: p.status as ParticipantStatus,
    raisedHand: p.raised_hand || false,
    isSpeaking: p.is_speaking || false,
    micEnabled: p.mic_enabled || false,
    cameraEnabled: p.camera_enabled || false,
    joinedAt: p.joined_at,
  }));
};

/**
 * Get role badge color
 */
const getRoleBadgeColor = (role: ParticipantRole): string => {
  switch (role) {
    case 'host':
      return '#D32F2F'; // Red
    case 'teacher':
      return '#1976D2'; // Blue
    case 'student':
      return '#388E3C'; // Green
    default:
      return LightTheme.Outline;
  }
};

/**
 * Get role label
 */
const getRoleLabel = (role: ParticipantRole): string => {
  switch (role) {
    case 'host':
      return 'HOST';
    case 'teacher':
      return 'TEACHER';
    case 'student':
      return 'STUDENT';
    default:
      return '';
  }
};

/**
 * Speaking Indicator - Animated Audio Wave
 */
const SpeakingIndicator: React.FC = () => {
  return (
    <View style={styles.speakingIndicator}>
      <View style={[styles.audioWave, styles.audioWave1]} />
      <View style={[styles.audioWave, styles.audioWave2]} />
      <View style={[styles.audioWave, styles.audioWave3]} />
    </View>
  );
};

/**
 * Participant Item Component
 */
interface ParticipantItemProps {
  participant: Participant;
  isCurrentUser: boolean;
  onPress?: (participant: Participant) => void;
}

const ParticipantItem: React.FC<ParticipantItemProps> = React.memo(
  ({ participant, isCurrentUser, onPress }) => {
    const handlePress = useCallback(() => {
      onPress?.(participant);
    }, [onPress, participant]);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.participantItem,
          pressed && styles.participantItemPressed,
        ]}
        onPress={handlePress}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {participant.avatar ? (
            <Image source={{ uri: participant.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {participant.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          {/* Status Indicator */}
          <View
            style={[
              styles.statusIndicator,
              participant.status === 'online' && styles.statusOnline,
              participant.status === 'away' && styles.statusAway,
              participant.status === 'offline' && styles.statusOffline,
            ]}
          />
        </View>

        {/* Name and Role */}
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {participant.name}
              {isCurrentUser && ' (You)'}
            </Text>

            {/* Role Badge */}
            {(participant.role === 'host' || participant.role === 'teacher') && (
              <View
                style={[
                  styles.roleBadge,
                  { backgroundColor: getRoleBadgeColor(participant.role) },
                ]}
              >
                <Text style={styles.roleBadgeText}>
                  {getRoleLabel(participant.role)}
                </Text>
              </View>
            )}
          </View>

          {/* Status Icons */}
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>
              {participant.micEnabled ? '🎤' : '🔇'} {participant.cameraEnabled ? '📹' : '📷'}
            </Text>
          </View>
        </View>

        {/* Speaking Indicator */}
        {participant.isSpeaking && <SpeakingIndicator />}

        {/* Raised Hand Badge */}
        {participant.raisedHand && (
          <View style={styles.raisedHandBadge}>
            <Text style={styles.raisedHandEmoji}>✋</Text>
          </View>
        )}
      </Pressable>
    );
  }
);

ParticipantItem.displayName = 'ParticipantItem';

/**
 * Empty State Component
 */
const EmptyState: React.FC = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyStateIcon}>👥</Text>
    <Text style={styles.emptyStateTitle}>No Participants Yet</Text>
    <Text style={styles.emptyStateText}>
      Participants will appear here when they join the class
    </Text>
  </View>
);

/**
 * ParticipantsList Component
 */
const ParticipantsList: React.FC<ParticipantsListProps> = ({
  classId,
  currentUserId,
  onParticipantPress,
  maxHeight = 500,
}) => {
  const queryClient = useQueryClient();

  // Fetch participants
  const {
    data: participants,
    isLoading,
    error,
  } = useQuery<Participant[], Error>({
    queryKey: ['classParticipants', classId],
    queryFn: () => fetchParticipants(classId),
    enabled: !!classId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });

  // Real-time subscription for participant updates
  useEffect(() => {
    if (!classId) return;

    const participantsSubscription = supabase
      .channel(`class-participants-${classId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'class_participants',
          filter: `class_id=eq.${classId}`,
        },
        () => {
          // Invalidate and refetch participants
          queryClient.invalidateQueries({ queryKey: ['classParticipants', classId] });
        }
      )
      .subscribe();

    return () => {
      participantsSubscription.unsubscribe();
    };
  }, [classId, queryClient]);

  // Separate participants by raised hand
  const sortedParticipants = useMemo(() => {
    if (!participants) return [];

    return [...participants].sort((a, b) => {
      // Raised hands first
      if (a.raisedHand && !b.raisedHand) return -1;
      if (!a.raisedHand && b.raisedHand) return 1;

      // Then by role (host > teacher > student)
      const roleOrder = { host: 0, teacher: 1, student: 2 };
      const roleCompare = roleOrder[a.role] - roleOrder[b.role];
      if (roleCompare !== 0) return roleCompare;

      // Then alphabetically
      return a.name.localeCompare(b.name);
    });
  }, [participants]);

  // Render participant item
  const renderParticipant = useCallback(
    ({ item }: { item: Participant }) => (
      <ParticipantItem
        participant={item}
        isCurrentUser={item.id === currentUserId}
        {...(onParticipantPress && { onPress: onParticipantPress })}
      />
    ),
    [currentUserId, onParticipantPress]
  );

  // Key extractor
  const keyExtractor = useCallback((item: Participant) => item.id, []);

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
        <Text style={styles.errorText}>Failed to load participants</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
      </View>
    );
  }

  // Empty state
  if (!sortedParticipants || sortedParticipants.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Participants ({sortedParticipants.length})
        </Text>
      </View>

      {/* Participants List */}
      <FlatList
        data={sortedParticipants}
        renderItem={renderParticipant}
        keyExtractor={keyExtractor}
        style={[styles.list, { maxHeight }]}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        initialNumToRender={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.OutlineVariant,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: LightTheme.OnSurface,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 4,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 64,
  },
  participantItemPressed: {
    backgroundColor: LightTheme.SurfaceVariant,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: LightTheme.PrimaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: LightTheme.OnPrimaryContainer,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: LightTheme.Surface,
  },
  statusOnline: {
    backgroundColor: '#4CAF50', // Green
  },
  statusAway: {
    backgroundColor: '#FF9800', // Orange
  },
  statusOffline: {
    backgroundColor: '#9E9E9E', // Grey
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    ...Typography.titleMedium, // MD3: 16px/24/500
    color: LightTheme.OnSurface,
    marginRight: 8,
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    ...Typography.labelMedium, // MD3: 12px/16/500/0.5
    color: LightTheme.OnSurfaceVariant,
  },
  speakingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  audioWave: {
    width: 3,
    backgroundColor: LightTheme.Primary,
    borderRadius: 1.5,
    marginHorizontal: 1,
  },
  audioWave1: {
    height: 12,
  },
  audioWave2: {
    height: 18,
  },
  audioWave3: {
    height: 12,
  },
  raisedHandBadge: {
    marginLeft: 8,
    backgroundColor: LightTheme.ErrorContainer,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  raisedHandEmoji: {
    fontSize: 16,
  },
  emptyState: {
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

export default ParticipantsList;

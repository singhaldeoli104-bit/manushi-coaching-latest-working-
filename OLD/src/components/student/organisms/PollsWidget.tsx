/**
 * PollsWidget Component
 *
 * Displays live polls with real-time voting and results visualization.
 *
 * Features:
 * - Live poll display with question and options
 * - Real-time vote counts via Supabase subscriptions
 * - Percentage bars for each option
 * - Vote button with selection state
 * - "Voted" indicator for completed votes
 * - Poll timer/countdown
 * - Multiple polls support with FlatList
 * - Empty state for no active polls
 * - Material Design 3 styling
 *
 * @example
 * <PollsWidget
 *   classId="class_123"
 *   currentUserId="user_456"
 * />
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';

// Poll Status
export type PollStatus = 'active' | 'closed' | 'upcoming';

// Poll Option
export interface PollOption {
  /** Option ID */
  id: string;

  /** Option text */
  text: string;

  /** Vote count */
  voteCount: number;

  /** Vote percentage (0-100) */
  percentage: number;
}

// Poll Data
export interface Poll {
  /** Unique poll ID */
  id: string;

  /** Poll question */
  question: string;

  /** Poll options */
  options: PollOption[];

  /** Poll status */
  status: PollStatus;

  /** Total votes */
  totalVotes: number;

  /** User's selected option ID */
  userVoteId?: string;

  /** Has user voted */
  hasVoted: boolean;

  /** Poll end time (ISO string) */
  endsAt?: string;

  /** Time remaining in seconds */
  timeRemaining?: number;

  /** Created timestamp */
  createdAt: string;
}

// Component Props
interface PollsWidgetProps {
  /** Live class ID */
  classId: string;

  /** Current user ID */
  currentUserId: string;
}

/**
 * Calculate time remaining in seconds
 */
const calculateTimeRemaining = (endsAt?: string): number | undefined => {
  if (!endsAt) return undefined;

  const now = new Date().getTime();
  const end = new Date(endsAt).getTime();
  const diffSeconds = Math.max(0, Math.floor((end - now) / 1000));

  return diffSeconds;
};

/**
 * Format countdown time
 */
const formatCountdown = (seconds: number): string => {
  if (seconds <= 0) return 'Ended';

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
};

/**
 * Fetch polls from Supabase
 */
const fetchPolls = async (
  classId: string,
  userId: string
): Promise<Poll[]> => {
  // Fetch polls
  const { data: polls, error: pollsError } = await supabase
    .from('class_polls')
    .select('*')
    .eq('class_id', classId)
    .in('status', ['active', 'upcoming'])
    .order('created_at', { ascending: false });

  if (pollsError) {
    throw new Error(`Failed to fetch polls: ${pollsError.message}`);
  }

  if (!polls || polls.length === 0) return [];

  // Fetch user votes
  const pollIds = polls.map((p) => p.id);
  const { data: userVotes, error: votesError } = await supabase
    .from('poll_votes')
    .select('poll_id, option_id')
    .eq('user_id', userId)
    .in('poll_id', pollIds);

  if (votesError) {
    throw new Error(`Failed to fetch votes: ${votesError.message}`);
  }

  const userVoteMap = new Map(
    (userVotes || []).map((v) => [v.poll_id, v.option_id])
  );

  // Fetch vote counts for each poll
  const { data: voteCounts, error: countsError } = await supabase
    .from('poll_votes')
    .select('poll_id, option_id')
    .in('poll_id', pollIds);

  if (countsError) {
    throw new Error(`Failed to fetch vote counts: ${countsError.message}`);
  }

  // Process polls
  return polls.map((poll): Poll => {
    const options = poll.options || [];
    const pollVotes = (voteCounts || []).filter((v) => v.poll_id === poll.id);
    const totalVotes = pollVotes.length;

    // Calculate vote counts and percentages
    const processedOptions: PollOption[] = options.map((opt: any) => {
      const voteCount = pollVotes.filter((v) => v.option_id === opt.id).length;
      const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

      return {
        id: opt.id,
        text: opt.text,
        voteCount,
        percentage,
      };
    });

    const userVoteId = userVoteMap.get(poll.id);
    const timeRemaining = poll.ends_at ? calculateTimeRemaining(poll.ends_at) : undefined;

    return {
      id: poll.id,
      question: poll.question,
      options: processedOptions,
      status: poll.status as PollStatus,
      totalVotes,
      ...(userVoteId && { userVoteId }),
      hasVoted: !!userVoteId,
      ...(poll.ends_at && { endsAt: poll.ends_at }),
      ...(timeRemaining !== undefined && { timeRemaining }),
      createdAt: poll.created_at,
    };
  });
};

/**
 * Submit vote to Supabase
 */
const submitVote = async (
  pollId: string,
  optionId: string,
  userId: string
): Promise<void> => {
  const { error } = await supabase.from('poll_votes').insert({
    poll_id: pollId,
    option_id: optionId,
    user_id: userId,
    created_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Failed to submit vote: ${error.message}`);
  }
};

/**
 * Poll Option Component
 */
interface PollOptionItemProps {
  option: PollOption;
  isSelected: boolean;
  hasVoted: boolean;
  onSelect: () => void;
}

const PollOptionItem: React.FC<PollOptionItemProps> = React.memo(
  ({ option, isSelected, hasVoted, onSelect }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.optionItem,
          isSelected && styles.optionItemSelected,
          pressed && !hasVoted && styles.optionItemPressed,
        ]}
        onPress={onSelect}
        disabled={hasVoted}
      >
        {/* Progress Bar (if voted) */}
        {hasVoted && (
          <View
            style={[
              styles.optionProgressBar,
              { width: `${option.percentage}%` },
              isSelected && styles.optionProgressBarSelected,
            ]}
          />
        )}

        {/* Option Content */}
        <View style={styles.optionContent}>
          {/* Option Text */}
          <Text style={styles.optionText} numberOfLines={2}>
            {option.text}
          </Text>

          {/* Vote Info (if voted) */}
          {hasVoted && (
            <View style={styles.optionStats}>
              <Text style={styles.optionPercentage}>{option.percentage}%</Text>
              <Text style={styles.optionVoteCount}>
                ({option.voteCount} {option.voteCount === 1 ? 'vote' : 'votes'})
              </Text>
            </View>
          )}

          {/* Selection Indicator (if selected) */}
          {isSelected && hasVoted && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.selectedIndicatorText}>✓</Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  }
);

PollOptionItem.displayName = 'PollOptionItem';

/**
 * Poll Card Component
 */
interface PollCardProps {
  poll: Poll;
  currentUserId: string;
  onVote: (pollId: string, optionId: string) => void;
  isVoting: boolean;
}

const PollCard: React.FC<PollCardProps> = React.memo(
  ({ poll, currentUserId: _currentUserId, onVote, isVoting }) => {
    const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(
      poll.userVoteId
    );

    const handleSelectOption = useCallback(
      (optionId: string) => {
        if (poll.hasVoted) return;
        setSelectedOptionId(optionId);
      },
      [poll.hasVoted]
    );

    const handleVote = useCallback(() => {
      if (!selectedOptionId || poll.hasVoted) return;
      onVote(poll.id, selectedOptionId);
    }, [selectedOptionId, poll.hasVoted, poll.id, onVote]);

    return (
      <View style={styles.pollCard}>
        {/* Poll Header */}
        <View style={styles.pollHeader}>
          <Text style={styles.pollQuestion}>{poll.question}</Text>

          {/* Timer */}
          {poll.timeRemaining !== undefined && poll.timeRemaining > 0 && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerIcon}>⏱</Text>
              <Text style={styles.timerText}>
                {formatCountdown(poll.timeRemaining)}
              </Text>
            </View>
          )}
        </View>

        {/* Poll Options */}
        <View style={styles.optionsList}>
          {poll.options.map((option) => (
            <PollOptionItem
              key={option.id}
              option={option}
              isSelected={option.id === selectedOptionId}
              hasVoted={poll.hasVoted}
              onSelect={() => handleSelectOption(option.id)}
            />
          ))}
        </View>

        {/* Vote Button */}
        {!poll.hasVoted && (
          <Pressable
            style={({ pressed }) => [
              styles.voteButton,
              (!selectedOptionId || isVoting) && styles.voteButtonDisabled,
              pressed && styles.voteButtonPressed,
            ]}
            onPress={handleVote}
            disabled={!selectedOptionId || isVoting}
          >
            <Text style={styles.voteButtonText}>
              {isVoting ? 'Voting...' : 'Submit Vote'}
            </Text>
          </Pressable>
        )}

        {/* Voted Indicator */}
        {poll.hasVoted && (
          <View style={styles.votedIndicator}>
            <Text style={styles.votedIndicatorText}>
              ✓ You voted • {poll.totalVotes} total {poll.totalVotes === 1 ? 'vote' : 'votes'}
            </Text>
          </View>
        )}
      </View>
    );
  }
);

PollCard.displayName = 'PollCard';

/**
 * Empty State Component
 */
const EmptyState: React.FC = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyStateIcon}>📊</Text>
    <Text style={styles.emptyStateTitle}>No Active Polls</Text>
    <Text style={styles.emptyStateText}>
      Polls will appear here when the instructor creates them
    </Text>
  </View>
);

/**
 * PollsWidget Component
 */
const PollsWidget: React.FC<PollsWidgetProps> = ({
  classId,
  currentUserId,
}) => {
  const queryClient = useQueryClient();

  // Fetch polls
  const {
    data: polls,
    isLoading,
    error,
  } = useQuery<Poll[], Error>({
    queryKey: ['classPolls', classId, currentUserId],
    queryFn: () => fetchPolls(classId, currentUserId),
    enabled: !!classId && !!currentUserId,
    staleTime: 5 * 1000, // 5 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: ({ pollId, optionId }: { pollId: string; optionId: string }) =>
      submitVote(pollId, optionId, currentUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classPolls', classId, currentUserId] });
    },
    onError: (error: Error) => {
      console.error('Failed to submit vote:', error);
    },
  });

  // Real-time subscription for poll updates
  useEffect(() => {
    if (!classId) return;

    const pollsSubscription = supabase
      .channel(`class-polls-${classId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'class_polls',
          filter: `class_id=eq.${classId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['classPolls', classId, currentUserId] });
        }
      )
      .subscribe();

    const votesSubscription = supabase
      .channel(`poll-votes-${classId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'poll_votes',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['classPolls', classId, currentUserId] });
        }
      )
      .subscribe();

    return () => {
      pollsSubscription.unsubscribe();
      votesSubscription.unsubscribe();
    };
  }, [classId, currentUserId, queryClient]);

  // Update countdown timers
  useEffect(() => {
    if (!polls || polls.length === 0) return;

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['classPolls', classId, currentUserId] });
    }, 1000);

    return () => clearInterval(interval);
  }, [polls, classId, currentUserId, queryClient]);

  // Handle vote
  const handleVote = useCallback(
    (pollId: string, optionId: string) => {
      voteMutation.mutate({ pollId, optionId });
    },
    [voteMutation]
  );

  // Render poll card
  const renderPoll = useCallback(
    ({ item }: { item: Poll }) => (
      <PollCard
        poll={item}
        currentUserId={currentUserId}
        onVote={handleVote}
        isVoting={voteMutation.isPending}
      />
    ),
    [currentUserId, handleVote, voteMutation.isPending]
  );

  // Key extractor
  const keyExtractor = useCallback((item: Poll) => item.id, []);

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
        <Text style={styles.errorText}>Failed to load polls</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
      </View>
    );
  }

  // Empty state
  if (!polls || polls.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={polls}
        renderItem={renderPoll}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightTheme.Surface,
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
    ...Typography.titleMedium, // MD3: 16px/24/500
    fontWeight: '600', // Override for emphasis
    color: LightTheme.Error,
    marginBottom: 4,
  },
  errorSubtext: {
    ...Typography.bodyMedium, // MD3: 14px/20/400
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  pollCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: LightTheme.OutlineVariant,
  },
  pollHeader: {
    marginBottom: 16,
  },
  pollQuestion: {
    ...Typography.titleMedium, // MD3: 16px/24/500
    fontSize: 18, // Custom size for poll emphasis
    fontWeight: '600',
    color: LightTheme.OnSurface,
    marginBottom: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerIcon: {
    ...Typography.labelLarge, // MD3: 14px/20/500 (icon)
    marginRight: 4,
  },
  timerText: {
    ...Typography.labelLarge, // MD3: 14px/20/500
    fontWeight: '600', // Override for emphasis
    color: LightTheme.Primary,
  },
  optionsList: {
    marginBottom: 16,
  },
  optionItem: {
    position: 'relative',
    borderWidth: 2,
    borderColor: LightTheme.Outline,
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  optionItemSelected: {
    borderColor: LightTheme.Primary,
    borderWidth: 2,
  },
  optionItemPressed: {
    opacity: 0.7,
  },
  optionProgressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: LightTheme.PrimaryContainer,
    opacity: 0.3,
  },
  optionProgressBarSelected: {
    backgroundColor: LightTheme.Primary,
    opacity: 0.2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    position: 'relative',
    zIndex: 1,
  },
  optionText: {
    flex: 1,
    ...Typography.bodyLarge, // MD3: 16px/24/400 (standardized from 15px)
    color: LightTheme.OnSurface,
  },
  optionStats: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  optionPercentage: {
    ...Typography.titleMedium, // MD3: 16px/24/500
    fontWeight: '700', // Override for emphasis
    color: LightTheme.Primary,
  },
  optionVoteCount: {
    ...Typography.labelMedium, // MD3: 12px/16/500
    color: LightTheme.OnSurfaceVariant,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: LightTheme.Primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  selectedIndicatorText: {
    ...Typography.labelLarge, // MD3: 14px/20/500
    fontWeight: '700', // Override for emphasis
    color: LightTheme.OnPrimary,
  },
  voteButton: {
    backgroundColor: LightTheme.Primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  voteButtonDisabled: {
    backgroundColor: LightTheme.SurfaceVariant,
    opacity: 0.5,
  },
  voteButtonPressed: {
    opacity: 0.8,
  },
  voteButtonText: {
    ...Typography.labelLarge, // MD3: 14px/20/500
    fontSize: 16, // Override for button prominence
    fontWeight: '600',
    color: LightTheme.OnPrimary,
  },
  votedIndicator: {
    backgroundColor: LightTheme.TertiaryContainer,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  votedIndicatorText: {
    ...Typography.labelLarge, // MD3: 14px/20/500
    fontWeight: '600', // Override for emphasis
    color: LightTheme.OnTertiaryContainer,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    ...Typography.displaySmall, // MD3: 36px (icon - custom size 48px acceptable)
    fontSize: 48, // Override for empty state icon size
    marginBottom: 16,
  },
  emptyStateTitle: {
    ...Typography.titleMedium, // MD3: 16px/24/500
    fontSize: 18, // Custom size for empty state emphasis
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

export default PollsWidget;

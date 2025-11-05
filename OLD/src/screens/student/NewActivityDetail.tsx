/**
 * NewActivityDetail - Premium Minimal Design
 * Purpose: Display activity/notification details
 * Used in: StudentNavigator (HomeStack)
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { Badge } from '../../ui/data-display/Badge';
import { Chip } from '../../ui/inputs/Chip';
import { Button } from '../../ui/inputs/Button';
import { T } from '../../ui';
import { Row } from '../../ui/layout/Row';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

type Props = NativeStackScreenProps<any, 'NewActivityDetail'>;

interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'assignment' | 'grade' | 'class' | 'announcement' | 'general';
  created_at: string;
  related_subject?: string;
  priority: 'high' | 'medium' | 'low';
  student_id: string;
}

interface Comment {
  id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  created_at: string;
  likes: number;
}

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
  hasReacted: boolean;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: 'student' | 'teacher';
}

interface TimelineEvent {
  id: string;
  type: 'created' | 'updated' | 'completed' | 'commented';
  description: string;
  timestamp: string;
  user_name: string;
}

interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'video' | 'document';
  url: string;
  size: string;
}

export default function NewActivityDetail({ route }: Props) {
  const { user } = useAuth();
  const activityId = route.params?.activityId;

  React.useEffect(() => {
    trackScreenView('NewActivityDetail', { activityId });
  }, [activityId]);

  // Fetch activity from Supabase
  const { data: activity, isLoading, error } = useQuery({
    queryKey: ['activity-detail', activityId],
    queryFn: async () => {
      if (!activityId) throw new Error('No activity ID provided');

      const { data, error } = await supabase
        .from('student_activities')
        .select('*')
        .eq('id', activityId)
        .single();

      if (error) throw error;
      return data as Activity;
    },
    enabled: !!activityId,
  });

  // State for new features
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [reactions, setReactions] = useState<Reaction[]>([
    { emoji: '👍', count: 0, users: [], hasReacted: false },
    { emoji: '❤️', count: 0, users: [], hasReacted: false },
    { emoji: '🎉', count: 0, users: [], hasReacted: false },
    { emoji: '🤔', count: 0, users: [], hasReacted: false },
  ]);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'Sarah Johnson', avatar: '👩‍🎓', role: 'student' },
    { id: '2', name: 'Prof. Smith', avatar: '👨‍🏫', role: 'teacher' },
    { id: '3', name: 'Mike Chen', avatar: '👨‍🎓', role: 'student' },
  ]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    { id: '1', type: 'created', description: 'Activity created', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), user_name: 'Prof. Smith' },
    { id: '2', type: 'updated', description: 'Details updated', timestamp: new Date(Date.now() - 86400000).toISOString(), user_name: 'Prof. Smith' },
  ]);
  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: '1', name: 'Study_Material.pdf', type: 'pdf', url: '#', size: '2.5 MB' },
    { id: '2', name: 'Reference_Image.jpg', type: 'image', url: '#', size: '1.2 MB' },
  ]);
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'participants' | 'timeline'>('details');

  // Handlers
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      user_name: user?.name || 'You',
      user_avatar: '👤',
      content: commentText,
      created_at: new Date().toISOString(),
      likes: 0,
    };
    setComments(prev => [newComment, ...prev]);
    setCommentText('');
    trackAction('add_comment', 'NewActivityDetail', { activityId });
  };

  const handleReaction = (emoji: string) => {
    setReactions(prev => prev.map(r =>
      r.emoji === emoji
        ? { ...r, count: r.hasReacted ? r.count - 1 : r.count + 1, hasReacted: !r.hasReacted }
        : r
    ));
    trackAction('add_reaction', 'NewActivityDetail', { emoji, activityId });
  };

  const handleDownloadAttachment = (attachment: Attachment) => {
    trackAction('download_attachment', 'NewActivityDetail', { attachmentId: attachment.id });
    Alert.alert('Download', `Downloading "${attachment.name}"...`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return '📝';
      case 'grade': return '🏆';
      case 'class': return '📚';
      case 'announcement': return '📢';
      default: return '🔔';
    }
  };

  return (
    <BaseScreen
      scrollable={true}
      loading={isLoading}
      error={error ? 'Failed to load activity details' : null}
      empty={!activity}
      emptyMessage="Activity not found"
    >
      {activity && (
        <View style={styles.container}>
          <Card style={styles.headerCard}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <T variant="h1">{getTypeIcon(activity.type)}</T>
              </View>
              <View style={styles.headerInfo}>
                <T variant="h2" weight="bold">
                  {activity.title}
                </T>
                <T variant="caption" style={styles.timestamp}>
                  {new Date(activity.created_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </T>
              </View>
              <Badge
                variant={activity.priority === 'high' ? 'error' : activity.priority === 'medium' ? 'warning' : 'info'}
                label={activity.priority.toUpperCase()}
              />
            </View>
          </Card>

          <Card style={styles.contentCard}>
            <T variant="body" style={styles.description}>
              {activity.description}
            </T>

            {activity.related_subject && (
              <View style={styles.subjectTag}>
                <T variant="caption" weight="semiBold" style={styles.subjectText}>
                  📚 {activity.related_subject}
                </T>
              </View>
            )}
          </Card>

          {/* Tabs Selector */}
          <View style={styles.tabSelector}>
            <Chip
              variant="filter"
              label="Details"
              selected={activeTab === 'details'}
              onPress={() => setActiveTab('details')}
            />
            <Chip
              variant="filter"
              label={`Comments (${comments.length})`}
              selected={activeTab === 'comments'}
              onPress={() => setActiveTab('comments')}
            />
            <Chip
              variant="filter"
              label={`Participants (${participants.length})`}
              selected={activeTab === 'participants'}
              onPress={() => setActiveTab('participants')}
            />
            <Chip
              variant="filter"
              label="Timeline"
              selected={activeTab === 'timeline'}
              onPress={() => setActiveTab('timeline')}
            />
          </View>

          {/* Details Tab - Reactions & Attachments */}
          {activeTab === 'details' && (
            <>
              <Card style={styles.reactionsCard}>
                <T variant="body" weight="semiBold" style={{ marginBottom: 8 }}>
                  Reactions
                </T>
                <Row gap="xs" wrap>
                  {reactions.map(reaction => (
                    <TouchableOpacity
                      key={reaction.emoji}
                      style={[styles.reactionButton, reaction.hasReacted && styles.reactionButtonActive]}
                      onPress={() => handleReaction(reaction.emoji)}
                      accessibilityRole="button"
                      accessibilityLabel={`React with ${reaction.emoji}`}
                    >
                      <T variant="body">{reaction.emoji}</T>
                      <T variant="caption">{reaction.count}</T>
                    </TouchableOpacity>
                  ))}
                </Row>
              </Card>

              <Card style={styles.attachmentsCard}>
                <T variant="body" weight="semiBold" style={{ marginBottom: 12 }}>
                  Attachments ({attachments.length})
                </T>
                {attachments.map(attachment => (
                  <View key={attachment.id} style={styles.attachmentItem}>
                    <T variant="h3">{attachment.type === 'pdf' ? '📄' : attachment.type === 'image' ? '🖼️' : attachment.type === 'video' ? '🎥' : '📎'}</T>
                    <View style={{ flex: 1 }}>
                      <T variant="body" weight="semiBold">{attachment.name}</T>
                      <T variant="caption" style={{ color: '#9CA3AF' }}>{attachment.size}</T>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDownloadAttachment(attachment)}
                      accessibilityRole="button"
                      accessibilityLabel={`Download ${attachment.name}`}
                    >
                      <T variant="h3">⬇️</T>
                    </TouchableOpacity>
                  </View>
                ))}
              </Card>
            </>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <Card style={styles.commentsCard}>
              <T variant="title" weight="semiBold" style={{ marginBottom: 12 }}>
                Comments
              </T>
              <View style={styles.commentInput}>
                <TextInput
                  style={styles.textInput}
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Add a comment..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  accessibilityLabel="Comment input"
                />
                <Button variant="primary" onPress={handleAddComment}>
                  Post
                </Button>
              </View>
              {comments.length === 0 ? (
                <T variant="body" style={{ color: '#9CA3AF', textAlign: 'center', paddingVertical: 20 }}>
                  No comments yet. Be the first to comment!
                </T>
              ) : (
                comments.map(comment => (
                  <View key={comment.id} style={styles.commentItem}>
                    <T variant="h3">{comment.user_avatar}</T>
                    <View style={{ flex: 1 }}>
                      <T variant="body" weight="semiBold">{comment.user_name}</T>
                      <T variant="body">{comment.content}</T>
                      <T variant="caption" style={{ color: '#9CA3AF' }}>
                        {new Date(comment.created_at).toLocaleDateString()}
                      </T>
                    </View>
                  </View>
                ))
              )}
            </Card>
          )}

          {/* Participants Tab */}
          {activeTab === 'participants' && (
            <Card style={styles.participantsCard}>
              <T variant="title" weight="semiBold" style={{ marginBottom: 12 }}>
                Participants ({participants.length})
              </T>
              {participants.map(participant => (
                <View key={participant.id} style={styles.participantItem}>
                  <T variant="h3">{participant.avatar}</T>
                  <View style={{ flex: 1 }}>
                    <T variant="body" weight="semiBold">{participant.name}</T>
                    <Badge variant={participant.role === 'teacher' ? 'info' : 'neutral'} label={participant.role.toUpperCase()} />
                  </View>
                </View>
              ))}
            </Card>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <Card style={styles.timelineCard}>
              <T variant="title" weight="semiBold" style={{ marginBottom: 12 }}>
                Activity Timeline
              </T>
              {timeline.map(event => (
                <View key={event.id} style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={{ flex: 1 }}>
                    <T variant="body" weight="semiBold">{event.description}</T>
                    <T variant="caption" style={{ color: '#9CA3AF' }}>
                      {event.user_name} • {new Date(event.timestamp).toLocaleDateString()}
                    </T>
                  </View>
                </View>
              ))}
            </Card>
          )}
        </View>
      )}
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  headerCard: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  timestamp: {
    color: '#9CA3AF',
  },
  contentCard: {
    padding: 16,
    gap: 16,
  },
  description: {
    lineHeight: 22,
    color: '#4B5563',
  },
  subjectTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
  },
  subjectText: {
    color: '#1E40AF',
  },
  tabSelector: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  reactionsCard: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reactionButtonActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  attachmentsCard: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  commentsCard: {
    padding: 16,
    margin: 16,
  },
  commentInput: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 60,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  participantsCard: {
    padding: 16,
    margin: 16,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  timelineCard: {
    padding: 16,
    margin: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    marginTop: 4,
  },
});

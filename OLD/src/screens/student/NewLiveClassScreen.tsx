/**
 * NewLiveClassScreen - Premium Minimal Design
 * Purpose: Live class participation screen
 * Used in: StudentNavigator (ClassesStack)
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, ScrollView, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { VideoPlaceholder } from '../../shared/components/VideoPlaceholder';
import { Card } from '../../ui/surfaces/Card';
import { Badge } from '../../ui/data-display/Badge';
import { Button } from '../../ui/inputs/Button';
import { Chip } from '../../ui/inputs/Chip';
import { Row } from '../../ui/layout/Row';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

type Props = NativeStackScreenProps<any, 'NewLiveClassScreen'>;

interface LiveClass {
  id: string;
  subject: string;
  teacher_name: string;
  start_time: string;
  status: 'live' | 'scheduled' | 'ended';
  participant_count?: number;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHandRaised: boolean;
  isMuted: boolean;
  hasVideo: boolean;
}

interface ChatMessage {
  id: string;
  user_name: string;
  user_avatar: string;
  message: string;
  timestamp: string;
}

interface Reaction {
  emoji: string;
  count: number;
}

type NetworkQuality = 'excellent' | 'good' | 'fair' | 'poor';

export default function NewLiveClassScreen({ route, navigation }: Props) {
  const { user } = useAuth();
  const classId = route.params?.classId;

  // State for new features
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showScreenShare, setShowScreenShare] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>('good');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', user_name: 'Teacher', user_avatar: '👨‍🏫', message: 'Welcome to the class!', timestamp: new Date().toISOString() },
    { id: '2', user_name: 'Sarah', user_avatar: '👩‍🎓', message: 'Thank you!', timestamp: new Date().toISOString() },
  ]);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'Teacher', avatar: '👨‍🏫', isHandRaised: false, isMuted: false, hasVideo: true },
    { id: '2', name: 'Sarah Johnson', avatar: '👩‍🎓', isHandRaised: false, isMuted: true, hasVideo: true },
    { id: '3', name: 'Mike Chen', avatar: '👨‍🎓', isHandRaised: true, isMuted: true, hasVideo: false },
    { id: '4', name: 'Emma Davis', avatar: '👧', isHandRaised: false, isMuted: true, hasVideo: true },
  ]);
  const [reactions, setReactions] = useState<Reaction[]>([
    { emoji: '👍', count: 0 },
    { emoji: '❤️', count: 0 },
    { emoji: '👏', count: 0 },
    { emoji: '🤔', count: 0 },
  ]);

  React.useEffect(() => {
    trackScreenView('NewLiveClassScreen', { classId });
  }, [classId]);

  // Handlers
  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user_name: user?.name || 'You',
      user_avatar: '👤',
      message: chatMessage,
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');
    trackAction('send_chat_message', 'NewLiveClassScreen', { classId });
  };

  const handleRaiseHand = () => {
    setIsHandRaised(!isHandRaised);
    trackAction(isHandRaised ? 'lower_hand' : 'raise_hand', 'NewLiveClassScreen', { classId });
  };

  const handleReaction = (emoji: string) => {
    setReactions(prev => prev.map(r =>
      r.emoji === emoji ? { ...r, count: r.count + 1 } : r
    ));
    trackAction('send_reaction', 'NewLiveClassScreen', { emoji, classId });
  };

  const handleToggleScreenShare = () => {
    setShowScreenShare(!showScreenShare);
    trackAction(showScreenShare ? 'hide_screen_share' : 'view_screen_share', 'NewLiveClassScreen', { classId });
  };

  const getNetworkQualityColor = () => {
    switch (networkQuality) {
      case 'excellent': return '#10B981';
      case 'good': return '#3B82F6';
      case 'fair': return '#F59E0B';
      case 'poor': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const getNetworkQualityLabel = () => {
    switch (networkQuality) {
      case 'excellent': return '📶 Excellent';
      case 'good': return '📶 Good';
      case 'fair': return '📶 Fair';
      case 'poor': return '📶 Poor';
      default: return '📶';
    }
  };

  // Fetch live class details
  const { data: liveClass, isLoading, error } = useQuery({
    queryKey: ['live-class', classId],
    queryFn: async () => {
      if (!classId) throw new Error('No class ID provided');

      const { data, error } = await supabase
        .from('class_sessions')
        .select('*, teachers(name)')
        .eq('id', classId)
        .eq('status', 'live')
        .single();

      if (error) throw error;

      // Count participants (if you have a participants table)
      const { count } = await supabase
        .from('class_participants')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', classId);

      return {
        id: data.id,
        subject: data.subject || 'Class',
        teacher_name: (data.teachers as any)?.name || 'Teacher',
        start_time: data.start_time,
        status: data.status,
        participant_count: count || 0,
      } as LiveClass;
    },
    enabled: !!classId,
  });

  return (
    <BaseScreen
      scrollable={false}
      loading={isLoading}
      error={error ? 'Failed to load live class' : null}
      empty={!liveClass}
      emptyMessage="Live class not found"
    >
      {liveClass && (
        <View style={styles.container}>
          {/* Header with indicators */}
          <Card style={styles.headerCard}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Row gap="xs" style={{ marginBottom: 8 }}>
                  <Badge variant="error" label="🔴 LIVE" />
                  {isRecording && <Badge variant="warning" label="🔴 REC" />}
                </Row>
                <T variant="h2" weight="bold">{liveClass.subject}</T>
                <T variant="caption" style={{ color: '#6B7280' }}>{liveClass.teacher_name}</T>
              </View>
              <View style={styles.networkIndicator}>
                <View style={[styles.networkDot, { backgroundColor: getNetworkQualityColor() }]} />
                <T variant="caption" style={{ color: getNetworkQualityColor() }}>
                  {getNetworkQualityLabel()}
                </T>
              </View>
            </View>
          </Card>

          {/* Main Video / Screen Share */}
          <Card style={styles.videoCard}>
            {showScreenShare ? (
              <View style={styles.screenShareView}>
                <T variant="h3" style={{ color: '#F3F4F6' }}>📺</T>
                <T variant="body" style={{ color: '#F3F4F6', textAlign: 'center' }}>
                  Screen Sharing Active
                </T>
                <Button variant="ghost" onPress={handleToggleScreenShare}>
                  Show Video
                </Button>
              </View>
            ) : (
              <VideoPlaceholder
                streamId={classId}
                isLive={true}
                showControls={true}
                placeholderMessage="Live Class in Progress"
              />
            )}
          </Card>

          {/* Participant Video Grid */}
          {showParticipants && (
            <Card style={styles.participantsGridCard}>
              <View style={styles.participantsGridHeader}>
                <T variant="body" weight="semiBold">
                  Participants ({participants.length})
                </T>
                <TouchableOpacity
                  onPress={() => setShowParticipants(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Close participants"
                >
                  <T variant="body">✕</T>
                </TouchableOpacity>
              </View>
              <View style={styles.participantsGrid}>
                {participants.map(participant => (
                  <View key={participant.id} style={styles.participantTile}>
                    <View style={styles.participantVideo}>
                      <T variant="h2">{participant.avatar}</T>
                      {participant.isHandRaised && (
                        <View style={styles.handRaisedBadge}>
                          <T variant="caption">✋</T>
                        </View>
                      )}
                    </View>
                    <View style={styles.participantInfo}>
                      <T variant="caption" numberOfLines={1}>{participant.name}</T>
                      <T variant="caption">{participant.isMuted ? '🔇' : '🎤'}</T>
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          )}

          {/* Chat Panel */}
          {showChat && (
            <Card style={styles.chatPanel}>
              <View style={styles.chatHeader}>
                <T variant="body" weight="semiBold">Chat</T>
                <TouchableOpacity
                  onPress={() => setShowChat(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Close chat"
                >
                  <T variant="body">✕</T>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.chatMessages}>
                {chatMessages.map(msg => (
                  <View key={msg.id} style={styles.chatMessage}>
                    <T variant="h3">{msg.user_avatar}</T>
                    <View style={{ flex: 1 }}>
                      <T variant="caption" weight="semiBold">{msg.user_name}</T>
                      <T variant="body">{msg.message}</T>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.chatInput}>
                <TextInput
                  style={styles.chatTextInput}
                  value={chatMessage}
                  onChangeText={setChatMessage}
                  placeholder="Type a message..."
                  placeholderTextColor="#9CA3AF"
                  accessibilityLabel="Chat message input"
                />
                <TouchableOpacity
                  onPress={handleSendMessage}
                  style={styles.sendButton}
                  accessibilityRole="button"
                  accessibilityLabel="Send message"
                >
                  <T variant="body">📤</T>
                </TouchableOpacity>
              </View>
            </Card>
          )}

          {/* Control Bar */}
          <Card style={styles.controlBar}>
            <Row gap="xs" wrap>
              <Button
                variant={showParticipants ? 'primary' : 'outline'}
                onPress={() => setShowParticipants(!showParticipants)}
              >
                👥 Participants
              </Button>
              <Button
                variant={showChat ? 'primary' : 'outline'}
                onPress={() => setShowChat(!showChat)}
              >
                💬 Chat
              </Button>
              <Button
                variant={showScreenShare ? 'primary' : 'outline'}
                onPress={handleToggleScreenShare}
              >
                📺 Screen
              </Button>
              <Button
                variant={isHandRaised ? 'warning' : 'outline'}
                onPress={handleRaiseHand}
              >
                {isHandRaised ? '✋ Hand Raised' : '✋ Raise'}
              </Button>
            </Row>

            {/* Reactions */}
            <View style={styles.reactionsRow}>
              <T variant="caption" style={{ color: '#6B7280', marginRight: 8 }}>
                React:
              </T>
              {reactions.map(reaction => (
                <TouchableOpacity
                  key={reaction.emoji}
                  onPress={() => handleReaction(reaction.emoji)}
                  style={styles.reactionButton}
                  accessibilityRole="button"
                  accessibilityLabel={`React with ${reaction.emoji}`}
                >
                  <T variant="body">{reaction.emoji}</T>
                  {reaction.count > 0 && (
                    <T variant="caption" style={{ marginLeft: 2 }}>
                      {reaction.count}
                    </T>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        </View>
      )}
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  headerCard: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  networkIndicator: {
    alignItems: 'flex-end',
    gap: 4,
  },
  networkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  videoCard: {
    padding: 0,
    overflow: 'hidden',
  },
  screenShareView: {
    height: 200,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 20,
  },
  participantsGridCard: {
    padding: 16,
    maxHeight: 300,
  },
  participantsGridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  participantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  participantTile: {
    width: '31%',
    minWidth: 100,
  },
  participantVideo: {
    height: 80,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  handRaisedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    padding: 4,
  },
  participantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  chatPanel: {
    padding: 0,
    maxHeight: 300,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  chatMessages: {
    maxHeight: 200,
    padding: 16,
  },
  chatMessage: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  chatInput: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBar: {
    padding: 16,
    gap: 12,
  },
  reactionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginRight: 6,
  },
});

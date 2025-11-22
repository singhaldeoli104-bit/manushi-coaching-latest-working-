/**
 * NewVirtualClassroom - Live Class Hub
 * Purpose: Main screen for live class with access to whiteboard, chat, notes
 * Design: Material Design with video area, class controls, feature buttons
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { T } from '../../ui';
import { Card } from '../../ui/surfaces/Card';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';

type Props = NativeStackScreenProps<any, 'NewVirtualClassroom'>;

type FooterTab = 'chat' | 'participants' | 'hand' | 'more';

export default function NewVirtualClassroom({ route, navigation }: Props) {
  const [activeTab, setActiveTab] = useState<FooterTab>('chat');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [points, setPoints] = useState(150);
  const [isHandRaised, setIsHandRaised] = useState(false);

  const classId = route.params?.classId || 'demo-class';
  const classTitle = route.params?.title || 'Algebra II';
  const teacherName = route.params?.teacher || 'Mrs. Davison';
  const topic = route.params?.topic || 'Solving Quadratic Equations';

  // Timer for class duration
  useEffect(() => {
    setElapsedTime(45 * 60 + 32);
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    trackScreenView('NewVirtualClassroom');
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleTabPress = (tab: FooterTab) => {
    setActiveTab(tab);
    trackAction('footer_tab', 'NewVirtualClassroom', { tab });

    if (tab === 'chat') {
      navigation.navigate('ClassChat', { classId });
    } else if (tab === 'participants') {
      Alert.alert('Participants', '12 students online');
    } else if (tab === 'hand') {
      setIsHandRaised(!isHandRaised);
      trackAction('raise_hand', 'NewVirtualClassroom', { raised: !isHandRaised });
      Alert.alert(isHandRaised ? 'Hand Lowered' : 'Hand Raised', isHandRaised ? 'Your hand has been lowered' : 'Teacher will see your raised hand');
    }
  };

  const handleEndClass = () => {
    Alert.alert(
      'End Class',
      'Are you sure you want to leave the class?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            trackAction('end_class', 'NewVirtualClassroom');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleOpenWhiteboard = () => {
    trackAction('open_whiteboard', 'NewVirtualClassroom', { classId });
    navigation.navigate('Whiteboard', { classId });
  };

  const handleOpenNotes = () => {
    trackAction('open_notes', 'NewVirtualClassroom', { classId });
    navigation.navigate('ClassNotes', { classId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            trackAction('back_button', 'NewVirtualClassroom');
            navigation.goBack();
          }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <T variant="h2" style={styles.icon}>☰</T>
        </TouchableOpacity>

        <T variant="body" weight="bold" style={styles.topBarTitle}>
          Virtual Classroom
        </T>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => trackAction('more_options', 'NewVirtualClassroom')}
          accessibilityRole="button"
          accessibilityLabel="More options"
        >
          <T variant="h2" style={styles.icon}>⋮</T>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Teacher Section with Timer */}
        <View style={styles.teacherSection}>
          <View style={styles.teacherAvatar}>
            <T style={styles.teacherAvatarText}>👩‍🏫</T>
          </View>

          <View style={styles.teacherInfo}>
            <T variant="caption" style={styles.teacherLabel}>
              Teacher
            </T>
            <T variant="body" weight="bold" style={styles.teacherName}>
              {teacherName}
            </T>
          </View>

          <View style={styles.timerContainer}>
            <T style={styles.timerIcon}>⏱</T>
            <T variant="body" weight="bold" style={styles.timerText}>
              {formatTime(elapsedTime)}
            </T>
          </View>

          <TouchableOpacity
            style={styles.endClassButton}
            onPress={handleEndClass}
            accessibilityRole="button"
            accessibilityLabel="End class"
          >
            <T variant="caption" weight="semiBold" style={styles.endClassText}>
              Leave
            </T>
          </TouchableOpacity>
        </View>

        {/* Class Details */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <T variant="caption" style={styles.detailLabel}>
              Topic
            </T>
            <T variant="body" weight="semiBold" style={styles.detailValue}>
              {topic}
            </T>
          </View>

          <View style={styles.detailCard}>
            <T variant="caption" style={styles.detailLabel}>
              Teacher
            </T>
            <T variant="body" weight="semiBold" style={styles.detailValue}>
              {teacherName}
            </T>
          </View>
        </View>

        {/* Video/Content Area */}
        <Card style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <T variant="h1">📹</T>
            <T variant="title" weight="semiBold" style={styles.videoTitle}>
              {classTitle}
            </T>
            <T variant="body" style={styles.videoSubtitle}>
              Live class in progress
            </T>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <T variant="caption" style={styles.liveText}>LIVE</T>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <T variant="body" weight="bold" style={styles.sectionTitle}>
            Class Tools
          </T>

          <View style={styles.actionsGrid}>
            {/* Whiteboard Button */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleOpenWhiteboard}
              accessibilityRole="button"
              accessibilityLabel="Open whiteboard"
            >
              <View style={[styles.actionIconContainer, styles.whiteboardColor]}>
                <T style={styles.actionIcon}>🎨</T>
              </View>
              <T variant="body" weight="semiBold" style={styles.actionTitle}>
                Whiteboard
              </T>
              <T variant="caption" style={styles.actionSubtitle}>
                Draw & collaborate
              </T>
            </TouchableOpacity>

            {/* Notes Button */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleOpenNotes}
              accessibilityRole="button"
              accessibilityLabel="Open notes"
            >
              <View style={[styles.actionIconContainer, styles.notesColor]}>
                <T style={styles.actionIcon}>📝</T>
              </View>
              <T variant="body" weight="semiBold" style={styles.actionTitle}>
                Notes
              </T>
              <T variant="caption" style={styles.actionSubtitle}>
                Take class notes
              </T>
            </TouchableOpacity>

            {/* Chat Button */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('ClassChat', { classId })}
              accessibilityRole="button"
              accessibilityLabel="Open chat"
            >
              <View style={[styles.actionIconContainer, styles.chatColor]}>
                <T style={styles.actionIcon}>💬</T>
              </View>
              <T variant="body" weight="semiBold" style={styles.actionTitle}>
                Chat
              </T>
              <T variant="caption" style={styles.actionSubtitle}>
                Ask questions
              </T>
            </TouchableOpacity>

            {/* Raise Hand Button */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => handleTabPress('hand')}
              accessibilityRole="button"
              accessibilityLabel="Raise hand"
            >
              <View style={[styles.actionIconContainer, isHandRaised ? styles.handRaisedColor : styles.handColor]}>
                <T style={styles.actionIcon}>{isHandRaised ? '✋' : '🖐'}</T>
              </View>
              <T variant="body" weight="semiBold" style={styles.actionTitle}>
                {isHandRaised ? 'Hand Up' : 'Raise Hand'}
              </T>
              <T variant="caption" style={styles.actionSubtitle}>
                Get attention
              </T>
            </TouchableOpacity>
          </View>
        </View>

        {/* Participants Preview */}
        <Card style={styles.participantsCard}>
          <View style={styles.participantsHeader}>
            <T variant="body" weight="bold" style={styles.participantsTitle}>
              👥 Participants (12)
            </T>
            <TouchableOpacity onPress={() => handleTabPress('participants')}>
              <T variant="caption" style={styles.viewAllText}>View All</T>
            </TouchableOpacity>
          </View>
          <View style={styles.participantAvatars}>
            {['🧑‍🎓', '👨‍🎓', '👩‍🎓', '🧑‍🎓', '👨‍🎓'].map((emoji, idx) => (
              <View key={idx} style={styles.participantAvatar}>
                <T style={styles.participantEmoji}>{emoji}</T>
              </View>
            ))}
            <View style={[styles.participantAvatar, styles.moreParticipants]}>
              <T variant="caption" style={styles.moreText}>+7</T>
            </View>
          </View>
        </Card>

        {/* Points Badge */}
        <View style={styles.pointsBadge}>
          <T style={styles.trophyIcon}>🏆</T>
          <T variant="body" weight="bold" style={styles.pointsText}>
            {points} pts
          </T>
        </View>
      </ScrollView>

      {/* Footer Tabs */}
      <View style={styles.footerTabs}>
        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => handleTabPress('chat')}
          accessibilityRole="button"
          accessibilityLabel="Chat"
        >
          <T
            style={[
              styles.footerTabIcon,
              activeTab === 'chat' && styles.footerTabIconActive,
            ]}
          >
            💬
          </T>
          <T
            variant="caption"
            style={[
              styles.footerTabText,
              activeTab === 'chat' && styles.footerTabTextActive,
            ]}
          >
            Chat
          </T>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => handleTabPress('participants')}
          accessibilityRole="button"
          accessibilityLabel="Participants"
        >
          <T
            style={[
              styles.footerTabIcon,
              activeTab === 'participants' && styles.footerTabIconActive,
            ]}
          >
            👥
          </T>
          <T
            variant="caption"
            style={[
              styles.footerTabText,
              activeTab === 'participants' && styles.footerTabTextActive,
            ]}
          >
            Participants
          </T>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => handleTabPress('hand')}
          accessibilityRole="button"
          accessibilityLabel="Raise hand"
        >
          <T
            style={[
              styles.footerTabIcon,
              (activeTab === 'hand' || isHandRaised) && styles.footerTabIconActive,
            ]}
          >
            ✋
          </T>
          <T
            variant="caption"
            style={[
              styles.footerTabText,
              (activeTab === 'hand' || isHandRaised) && styles.footerTabTextActive,
            ]}
          >
            Raise Hand
          </T>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => handleTabPress('more')}
          accessibilityRole="button"
          accessibilityLabel="More options"
        >
          <T
            style={[
              styles.footerTabIcon,
              activeTab === 'more' && styles.footerTabIconActive,
            ]}
          >
            ⋯
          </T>
          <T
            variant="caption"
            style={[
              styles.footerTabText,
              activeTab === 'more' && styles.footerTabTextActive,
            ]}
          >
            More
          </T>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  icon: {
    fontSize: 24,
    color: '#333333',
  },
  topBarTitle: {
    color: '#111827',
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F7F8',
  },
  teacherSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  teacherAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  teacherAvatarText: {
    fontSize: 20,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherLabel: {
    color: '#6B7280',
    fontSize: 11,
  },
  teacherName: {
    color: '#111827',
    fontSize: 14,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginRight: 8,
  },
  timerIcon: {
    fontSize: 14,
  },
  timerText: {
    color: '#111827',
    fontSize: 13,
  },
  endClassButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EF4444',
    borderRadius: 6,
  },
  endClassText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  detailCard: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailLabel: {
    color: '#6B7280',
    fontSize: 11,
    marginBottom: 2,
  },
  detailValue: {
    color: '#111827',
    fontSize: 13,
  },
  videoContainer: {
    margin: 16,
    marginBottom: 8,
    padding: 0,
    overflow: 'hidden',
  },
  videoPlaceholder: {
    height: 200,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
  },
  videoSubtitle: {
    color: '#D1D5DB',
    textAlign: 'center',
    marginTop: 4,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#EF4444',
    borderRadius: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  actionsSection: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    color: '#111827',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  whiteboardColor: {
    backgroundColor: '#DBEAFE',
  },
  notesColor: {
    backgroundColor: '#FEF3C7',
  },
  chatColor: {
    backgroundColor: '#D1FAE5',
  },
  handColor: {
    backgroundColor: '#F3F4F6',
  },
  handRaisedColor: {
    backgroundColor: '#FEE2E2',
  },
  actionIcon: {
    fontSize: 28,
  },
  actionTitle: {
    color: '#111827',
    textAlign: 'center',
    marginBottom: 2,
  },
  actionSubtitle: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 11,
  },
  participantsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  participantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  participantsTitle: {
    color: '#111827',
  },
  viewAllText: {
    color: '#4A90E2',
    fontSize: 12,
  },
  participantAvatars: {
    flexDirection: 'row',
    gap: 8,
  },
  participantAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  participantEmoji: {
    fontSize: 20,
  },
  moreParticipants: {
    backgroundColor: '#E5E7EB',
  },
  moreText: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '600',
  },
  pointsBadge: {
    position: 'absolute',
    top: 12,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FBBF24',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  trophyIcon: {
    fontSize: 16,
  },
  pointsText: {
    color: '#92400E',
    fontSize: 13,
  },
  footerTabs: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  footerTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  footerTabIcon: {
    fontSize: 24,
  },
  footerTabIconActive: {
    fontSize: 24,
  },
  footerTabText: {
    color: '#6B7280',
    fontSize: 11,
  },
  footerTabTextActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});

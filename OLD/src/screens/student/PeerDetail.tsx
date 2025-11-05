/**
 * PeerDetail - Premium Minimal Design
 * Purpose: View peer profile and collaboration options
 * Used in: StudentNavigator (CollaborationStack) - from NewPeerLearningNetwork
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

type Props = NativeStackScreenProps<any, 'PeerDetail'>;

interface PeerProfile {
  id: string;
  name: string;
  email: string;
  subjects: string;
  class_name: string;
  batch_name: string;
  bio: string;
}

interface SharedClass {
  id: string;
  subject: string;
  schedule: string;
}

export default function PeerDetail({ route, navigation }: Props) {
  const { user } = useAuth();
  const peerId = route.params?.peerId;
  const peerName = route.params?.peerName;

  React.useEffect(() => {
    trackScreenView('PeerDetail', { peerId });
  }, [peerId]);

  // Fetch peer profile details
  const { data: peerProfile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['peer-profile', peerId],
    queryFn: async () => {
      if (!peerId) throw new Error('No peer ID provided');

      const { data, error } = await supabase
        .from('students')
        .select('*, classes(name), batches(name)')
        .eq('id', peerId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name || 'Student',
        email: data.email || '',
        subjects: data.subjects || 'Various subjects',
        class_name: (data.classes as any)?.name || 'Unknown Class',
        batch_name: (data.batches as any)?.name || 'Unknown Batch',
        bio: data.bio || 'No bio available',
      } as PeerProfile;
    },
    enabled: !!peerId,
  });

  // Fetch shared classes with this peer
  const { data: sharedClasses, isLoading: classesLoading } = useQuery({
    queryKey: ['shared-classes', user?.id, peerId],
    queryFn: async () => {
      if (!user?.id || !peerId) throw new Error('Missing user or peer ID');

      // Get current user's class_id
      const { data: userData, error: userError } = await supabase
        .from('students')
        .select('class_id')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Get classes for the shared class_id
      const { data, error } = await supabase
        .from('class_sessions')
        .select('id, subject, start_time')
        .eq('class_id', userData.class_id)
        .order('start_time', { ascending: true })
        .limit(5);

      if (error) throw error;

      return (data || []).map(cls => ({
        id: cls.id,
        subject: cls.subject || 'Class',
        schedule: new Date(cls.start_time).toLocaleDateString('en-US', {
          weekday: 'short',
          hour: 'numeric',
          minute: '2-digit',
        }),
      })) as SharedClass[];
    },
    enabled: !!user?.id && !!peerId,
  });

  const collaborationOptions = [
    { id: 'message', icon: '💬', label: 'Send Message', action: 'message' },
    { id: 'video-call', icon: '📹', label: 'Video Call', action: 'video_call' },
    { id: 'study-group', icon: '👥', label: 'Study Group', action: 'study_group' },
    { id: 'share-notes', icon: '📝', label: 'Share Notes', action: 'share_notes' },
  ];

  const handleCollaborationAction = (action: string) => {
    trackAction('peer_collaboration', 'PeerDetail', { action, peerId });

    switch (action) {
      case 'message':
        // TODO: Create PeerMessaging.tsx screen for peer-to-peer chat
        Alert.alert('Message', `Start a conversation with ${peerProfile?.name}`);
        break;
      case 'video_call':
        // TODO: Integrate video calling feature
        Alert.alert('Video Call', 'Video calling feature coming soon');
        break;
      case 'study_group':
        // TODO: Create StudyGroup.tsx screen for group collaboration
        Alert.alert('Study Group', 'Create or join a study group');
        break;
      case 'share_notes':
        // TODO: Create NoteSharing.tsx screen
        Alert.alert('Share Notes', 'Share your study notes with peers');
        break;
    }
  };

  const isLoading = profileLoading || classesLoading;
  const error = profileError ? 'Failed to load peer profile' : null;

  return (
    <BaseScreen
      scrollable={false}
      loading={isLoading}
      error={error}
      empty={!peerProfile}
      emptyMessage="Peer profile not found"
    >
      {peerProfile && (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <Card style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <T variant="h1">👤</T>
              </View>
            </View>
            <T variant="h2" weight="bold" style={styles.name}>
              {peerProfile.name}
            </T>
            <T variant="caption" style={styles.class}>
              {peerProfile.class_name} • {peerProfile.batch_name}
            </T>
            <T variant="body" style={styles.subjects}>
              {peerProfile.subjects}
            </T>
            {peerProfile.bio && (
              <T variant="caption" style={styles.bio}>
                {peerProfile.bio}
              </T>
            )}
          </Card>

          {/* Collaboration Options */}
          <Card style={styles.collaborationCard}>
            <T variant="title" weight="semiBold" style={styles.sectionTitle}>
              Collaborate
            </T>
            <View style={styles.optionsGrid}>
              {collaborationOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionButton}
                  onPress={() => handleCollaborationAction(option.action)}
                  accessibilityRole="button"
                  accessibilityLabel={option.label}
                >
                  <T variant="h2">{option.icon}</T>
                  <T variant="caption" style={styles.optionLabel}>
                    {option.label}
                  </T>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Shared Classes */}
          {sharedClasses && sharedClasses.length > 0 && (
            <Card style={styles.classesCard}>
              <T variant="title" weight="semiBold" style={styles.sectionTitle}>
                Shared Classes ({sharedClasses.length})
              </T>
              {sharedClasses.map((cls) => (
                <View key={cls.id} style={styles.classItem}>
                  <View style={styles.classIcon}>
                    <T variant="body">📚</T>
                  </View>
                  <View style={styles.classInfo}>
                    <T variant="body" weight="semiBold">
                      {cls.subject}
                    </T>
                    <T variant="caption" style={styles.schedule}>
                      {cls.schedule}
                    </T>
                  </View>
                </View>
              ))}
            </Card>
          )}

          {/* Study Stats */}
          <Card style={styles.statsCard}>
            <T variant="title" weight="semiBold" style={styles.sectionTitle}>
              Study Stats
            </T>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <T variant="h2" weight="bold">
                  --
                </T>
                <T variant="caption" style={styles.statLabel}>
                  Study Sessions
                </T>
              </View>
              <View style={styles.statItem}>
                <T variant="h2" weight="bold">
                  --
                </T>
                <T variant="caption" style={styles.statLabel}>
                  Shared Notes
                </T>
              </View>
              <View style={styles.statItem}>
                <T variant="h2" weight="bold">
                  --
                </T>
                <T variant="caption" style={styles.statLabel}>
                  Group Projects
                </T>
              </View>
            </View>
            <T variant="caption" style={styles.statsNote}>
              Collaboration stats coming soon
            </T>
          </Card>
        </ScrollView>
      )}
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    textAlign: 'center',
  },
  class: {
    color: '#6B7280',
    textAlign: 'center',
  },
  subjects: {
    textAlign: 'center',
    color: '#4B5563',
  },
  bio: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 4,
  },
  collaborationCard: {
    padding: 16,
    marginBottom: 16,
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    width: '47%',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionLabel: {
    color: '#4B5563',
  },
  classesCard: {
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  classItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  classIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  classInfo: {
    flex: 1,
    gap: 4,
  },
  schedule: {
    color: '#6B7280',
  },
  statsCard: {
    padding: 16,
    marginBottom: 32,
    gap: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    color: '#6B7280',
    textAlign: 'center',
  },
  statsNote: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

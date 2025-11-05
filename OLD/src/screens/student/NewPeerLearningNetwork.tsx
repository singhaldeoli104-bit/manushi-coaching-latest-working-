/**
 * NewPeerLearningNetwork - Premium Minimal Design
 * Purpose: Connect with peers for collaborative learning
 * Used in: StudentNavigator (CollaborationStack)
 */

import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

type Props = NativeStackScreenProps<any, 'NewPeerLearningNetwork'>;

interface Peer {
  id: string;
  name: string;
  subjects: string;
  avatar: string;
  student_id: string;
}

export default function NewPeerLearningNetwork({ navigation }: Props) {
  const { user } = useAuth();

  React.useEffect(() => {
    trackScreenView('NewPeerLearningNetwork');
  }, []);

  // Fetch peers from same class/batch
  const { data: peers, isLoading, error, refetch } = useQuery({
    queryKey: ['peer-network', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');

      // First, get current user's class/batch
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('class_id, batch_id')
        .eq('id', user.id)
        .single();

      if (studentError) throw studentError;

      // Then fetch peers from same class
      const { data, error } = await supabase
        .from('students')
        .select('id, name, email, subjects')
        .eq('class_id', studentData.class_id)
        .neq('id', user.id)
        .limit(10);

      if (error) throw error;

      return (data || []).map((student, index) => ({
        id: student.id,
        name: student.name || 'Unknown Student',
        subjects: student.subjects || 'Various subjects',
        avatar: index % 3 === 0 ? '👩' : index % 3 === 1 ? '👨' : '👧',
        student_id: student.id,
      })) as Peer[];
    },
    enabled: !!user?.id,
  });

  return (
    <BaseScreen
      scrollable={false}
      loading={isLoading}
      error={error ? 'Failed to load peers' : null}
      empty={!peers || peers.length === 0}
      emptyMessage="No peers found"
    >
      <View style={styles.container}>
        <Card style={styles.headerCard}>
          <T variant="h2" weight="bold">
            Peer Learning Network
          </T>
          <T variant="body" style={styles.subtitle}>
            Connect with classmates for group study
          </T>
        </Card>

        <FlatList
          data={peers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.peersList}
          onRefresh={() => {
            trackAction('refresh_peers', 'NewPeerLearningNetwork');
            refetch();
          }}
          refreshing={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.peerCard}
              onPress={() => {
                trackAction('view_peer', 'NewPeerLearningNetwork', { peerId: item.id });
                safeNavigate('PeerDetail', { peerId: item.student_id, peerName: item.name });
              }}
              accessibilityRole="button"
              accessibilityLabel={`Connect with ${item.name}`}
            >
              <View style={styles.peerAvatar}>
                <T variant="h2">{item.avatar}</T>
              </View>
              <View style={styles.peerInfo}>
                <T variant="body" weight="semiBold">
                  {item.name}
                </T>
                <T variant="caption" style={styles.peerSubjects}>
                  {item.subjects}
                </T>
              </View>
              <T variant="body" style={styles.connectIcon}>
                💬
              </T>
            </TouchableOpacity>
          )}
        />
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  subtitle: {
    color: '#6B7280',
  },
  peersList: {
    gap: 12,
  },
  peerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  peerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  peerInfo: {
    flex: 1,
    gap: 4,
  },
  peerSubjects: {
    color: '#6B7280',
  },
  connectIcon: {
    fontSize: 24,
  },
});

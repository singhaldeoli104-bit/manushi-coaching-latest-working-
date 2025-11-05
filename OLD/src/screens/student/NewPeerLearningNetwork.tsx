/**
 * NewPeerLearningNetwork - Premium Minimal Design
 * Purpose: Connect with peers for collaborative learning
 * Used in: StudentNavigator (CollaborationStack)
 */

import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackScreenView } from '../../utils/navigationAnalytics';

type Props = NativeStackScreenProps<any, 'NewPeerLearningNetwork'>;

export default function NewPeerLearningNetwork({ navigation }: Props) {
  React.useEffect(() => {
    trackScreenView('NewPeerLearningNetwork');
  }, []);

  const peers = [
    { id: '1', name: 'Alice Johnson', subjects: 'Math, Physics', avatar: '👩' },
    { id: '2', name: 'Bob Smith', subjects: 'Chemistry, Biology', avatar: '👨' },
    { id: '3', name: 'Carol Lee', subjects: 'English, History', avatar: '👧' },
  ];

  return (
    <BaseScreen scrollable={false}>
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
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.peerCard}>
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

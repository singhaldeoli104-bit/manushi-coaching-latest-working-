/**
 * NewLiveClassScreen - Premium Minimal Design
 * Purpose: Live class participation screen
 * Used in: StudentNavigator (ClassesStack)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { Badge } from '../../ui/data-display/Badge';
import { T } from '../../ui';
import { trackScreenView } from '../../utils/navigationAnalytics';

type Props = NativeStackScreenProps<any, 'NewLiveClassScreen'>;

export default function NewLiveClassScreen({ navigation }: Props) {
  React.useEffect(() => {
    trackScreenView('NewLiveClassScreen');
  }, []);

  return (
    <BaseScreen scrollable={true}>
      <View style={styles.container}>
        <Card style={styles.liveCard}>
          <Badge variant="error" label="🔴 LIVE" />
          <T variant="h1" weight="bold" style={styles.title}>
            Mathematics Class
          </T>
          <T variant="body" style={styles.teacher}>
            Dr. Sarah Johnson
          </T>
          <View style={styles.participants}>
            <T variant="caption" style={styles.participantsText}>
              👥 24 participants
            </T>
          </View>
        </Card>

        <Card style={styles.videoCard}>
          <View style={styles.videoPlaceholder}>
            <T variant="h1">📹</T>
            <T variant="body" style={styles.liveText}>
              Class in Progress
            </T>
          </View>
        </Card>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  liveCard: {
    padding: 20,
    gap: 12,
  },
  title: {
    marginTop: 4,
  },
  teacher: {
    color: '#6B7280',
  },
  participants: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  participantsText: {
    color: '#6B7280',
  },
  videoCard: {
    padding: 16,
  },
  videoPlaceholder: {
    height: 250,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  liveText: {
    color: '#F3F4F6',
  },
});

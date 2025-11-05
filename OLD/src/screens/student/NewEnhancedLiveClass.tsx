/**
 * NewEnhancedLiveClass - Premium Minimal Design
 * Purpose: Enhanced live class with advanced features
 * Used in: StudentNavigator (ClassesStack)
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { Badge } from '../../ui/data-display/Badge';
import { T } from '../../ui';
import { trackScreenView } from '../../utils/navigationAnalytics';

type Props = NativeStackScreenProps<any, 'NewEnhancedLiveClass'>;

export default function NewEnhancedLiveClass({ navigation }: Props) {
  React.useEffect(() => {
    trackScreenView('NewEnhancedLiveClass');
  }, []);

  const features = [
    { icon: '✍️', label: 'Whiteboard' },
    { icon: '📊', label: 'Screen Share' },
    { icon: '💬', label: 'Chat' },
    { icon: '📝', label: 'Notes' },
  ];

  return (
    <BaseScreen scrollable={true}>
      <View style={styles.container}>
        <Card style={styles.statusCard}>
          <Badge variant="error" label="🔴 LIVE" />
          <T variant="h2" weight="bold" style={styles.className}>
            Advanced Physics
          </T>
          <T variant="caption" style={styles.time}>
            Started 15 minutes ago
          </T>
        </Card>

        <Card style={styles.videoCard}>
          <View style={styles.videoPlaceholder}>
            <T variant="h1">📹</T>
            <T variant="body" style={styles.videoText}>
              Live Stream
            </T>
          </View>
        </Card>

        <Card style={styles.featuresCard}>
          <T variant="title" weight="semiBold" style={styles.featuresTitle}>
            Interactive Features
          </T>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <TouchableOpacity key={index} style={styles.featureButton}>
                <T variant="h2">{feature.icon}</T>
                <T variant="caption">{feature.label}</T>
              </TouchableOpacity>
            ))}
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
  statusCard: {
    padding: 16,
    gap: 8,
  },
  className: {
    marginTop: 4,
  },
  time: {
    color: '#6B7280',
  },
  videoCard: {
    padding: 16,
  },
  videoPlaceholder: {
    height: 220,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  videoText: {
    color: '#F3F4F6',
  },
  featuresCard: {
    padding: 16,
  },
  featuresTitle: {
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureButton: {
    width: '47%',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
});

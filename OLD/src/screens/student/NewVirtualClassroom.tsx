/**
 * NewVirtualClassroom - Premium Minimal Design
 * Purpose: Virtual classroom interface placeholder
 * Used in: StudentNavigator (ClassesStack)
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { VideoPlaceholder } from '../../shared/components/VideoPlaceholder';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';

type Props = NativeStackScreenProps<any, 'NewVirtualClassroom'>;

export default function NewVirtualClassroom({ navigation }: Props) {
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  React.useEffect(() => {
    trackScreenView('NewVirtualClassroom');
  }, []);

  const features = [
    { id: 'video', icon: '🎥', label: 'Video' },
    { id: 'audio', icon: '🎤', label: 'Audio' },
    { id: 'chat', icon: '💬', label: 'Chat' },
    { id: 'raise-hand', icon: '✋', label: 'Raise Hand' },
  ];

  const handleControlPress = (featureId: string) => {
    trackAction('toggle_control', 'NewVirtualClassroom', { control: featureId });

    switch (featureId) {
      case 'video':
        setVideoEnabled(!videoEnabled);
        Alert.alert('Video', `Video ${!videoEnabled ? 'enabled' : 'disabled'}`);
        break;
      case 'audio':
        setAudioEnabled(!audioEnabled);
        Alert.alert('Audio', `Audio ${!audioEnabled ? 'enabled' : 'disabled'}`);
        break;
      case 'chat':
        safeNavigate('ClassChat', { classId: 'virtual-classroom' });
        break;
      case 'raise-hand':
        Alert.alert('Hand Raised', 'Your hand has been raised');
        break;
    }
  };

  return (
    <BaseScreen scrollable={true}>
      <View style={styles.container}>
        <VideoPlaceholder
          isLive={true}
          showControls={false}
          placeholderMessage="Virtual Classroom"
        />

        <Card style={styles.controlsCard}>
          <T variant="title" weight="semiBold" style={styles.controlsTitle}>
            Controls
          </T>
          <View style={styles.controlsGrid}>
            {features.map((feature) => {
              const isActive =
                (feature.id === 'video' && videoEnabled) ||
                (feature.id === 'audio' && audioEnabled);

              return (
                <TouchableOpacity
                  key={feature.id}
                  style={[styles.controlButton, isActive && styles.controlButtonActive]}
                  onPress={() => handleControlPress(feature.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Toggle ${feature.label}`}
                  accessibilityState={{ selected: isActive }}
                >
                  <T variant="h2">{feature.icon}</T>
                  <T variant="caption" style={isActive && styles.activeText}>
                    {feature.label}
                  </T>
                </TouchableOpacity>
              );
            })}
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
  videoCard: {
    padding: 16,
  },
  videoPlaceholder: {
    height: 200,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  videoText: {
    color: '#9CA3AF',
  },
  controlsCard: {
    padding: 16,
    gap: 16,
  },
  controlsTitle: {
    marginBottom: 4,
  },
  controlsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  controlButton: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  controlButtonActive: {
    backgroundColor: '#DBEAFE',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  activeText: {
    color: '#1E40AF',
    fontWeight: '600',
  },
});

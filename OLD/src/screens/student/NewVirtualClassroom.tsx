/**
 * NewVirtualClassroom - Premium Minimal Design
 * Purpose: Virtual classroom interface placeholder
 * Used in: StudentNavigator (ClassesStack)
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { VideoPlaceholder } from '../../shared/components/VideoPlaceholder';
import { Card, CardHeader, CardContent } from '../../ui/surfaces/Card';
import { Button } from '../../ui/inputs/Button';
import { Chip } from '../../ui/inputs/Chip';
import { Row } from '../../ui/layout/Row';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';

type Props = NativeStackScreenProps<any, 'NewVirtualClassroom'>;

export default function NewVirtualClassroom({ navigation }: Props) {
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // New features state
  const [view3D, setView3D] = useState(true);
  const [showAvatarCustomization, setShowAvatarCustomization] = useState(false);
  const [showInteractions, setShowInteractions] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('👨‍🎓');
  const [selectedSkinTone, setSelectedSkinTone] = useState('default');

  const avatarOptions = ['👨‍🎓', '👩‍🎓', '🧑‍🎓', '👨‍💼', '👩‍💼', '🧑‍💻'];
  const skinTones = [
    { label: 'Default', value: 'default', emoji: '🙂' },
    { label: 'Light', value: 'light', emoji: '🏻' },
    { label: 'Medium', value: 'medium', emoji: '🏽' },
    { label: 'Dark', value: 'dark', emoji: '🏾' },
  ];

  const interactions = [
    { id: 'wave', icon: '👋', label: 'Wave', description: 'Wave to others' },
    { id: 'thumbs-up', icon: '👍', label: 'Thumbs Up', description: 'Show approval' },
    { id: 'clap', icon: '👏', label: 'Clap', description: 'Applaud' },
    { id: 'thinking', icon: '🤔', label: 'Thinking', description: 'Thinking pose' },
    { id: 'raise-hand', icon: '✋', label: 'Raise Hand', description: 'Ask question' },
    { id: 'confused', icon: '😕', label: 'Confused', description: 'Need help' },
  ];

  React.useEffect(() => {
    trackScreenView('NewVirtualClassroom');
  }, []);

  const handleToggle3DView = () => {
    setView3D(!view3D);
    trackAction('toggle_3d_view', 'NewVirtualClassroom', { enabled: !view3D });
  };

  const handleSelectAvatar = (avatar: string) => {
    setSelectedAvatar(avatar);
    trackAction('select_avatar', 'NewVirtualClassroom', { avatar });
  };

  const handleSelectSkinTone = (tone: string) => {
    setSelectedSkinTone(tone);
    trackAction('select_skin_tone', 'NewVirtualClassroom', { tone });
  };

  const handleInteraction = (interactionId: string, label: string) => {
    trackAction('virtual_interaction', 'NewVirtualClassroom', { interaction: interactionId });
    Alert.alert('Virtual Interaction', `You performed: ${label}`);
  };

  const handleControlPress = (featureId: string) => {
    trackAction('toggle_control', 'NewVirtualClassroom', { control: featureId });

    switch (featureId) {
      case 'video':
        setVideoEnabled(!videoEnabled);
        break;
      case 'audio':
        setAudioEnabled(!audioEnabled);
        break;
      case 'chat':
        safeNavigate('ClassChat', { classId: 'virtual-classroom' });
        break;
      case 'raise-hand':
        handleInteraction('raise-hand', 'Raise Hand');
        break;
    }
  };

  return (
    <BaseScreen scrollable={true}>
      <View style={styles.container}>
        {/* 1. 3D Classroom View */}
        <Card style={styles.viewCard}>
          <Row gap="sm" style={{ marginBottom: 12, justifyContent: 'space-between', alignItems: 'center' }}>
            <T variant="title" weight="semiBold">
              {view3D ? '🏫 3D Classroom' : '📹 2D View'}
            </T>
            <Button variant={view3D ? 'primary' : 'outline'} onPress={handleToggle3DView}>
              {view3D ? '3D' : '2D'}
            </Button>
          </Row>

          {view3D ? (
            <View style={styles.classroom3D}>
              <T variant="h1">🏫</T>
              <T variant="body" style={{ textAlign: 'center', color: '#6B7280' }}>
                3D Immersive Classroom Environment
              </T>
              <View style={styles.avatarPreview}>
                <T variant="h1">{selectedAvatar}</T>
                <T variant="caption">Your Avatar</T>
              </View>
            </View>
          ) : (
            <VideoPlaceholder
              isLive={true}
              showControls={false}
              placeholderMessage="2D Classroom View"
            />
          )}
        </Card>

        {/* 2. Avatar Customization */}
        <Card style={styles.avatarCard}>
          <View style={styles.avatarHeader}>
            <T variant="title" weight="semiBold">
              👤 Avatar Customization
            </T>
            <Button
              variant="outline"
              onPress={() => setShowAvatarCustomization(!showAvatarCustomization)}
            >
              {showAvatarCustomization ? 'Hide' : 'Customize'}
            </Button>
          </View>

          {showAvatarCustomization && (
            <View style={styles.customizationPanel}>
              <T variant="body" weight="semiBold" style={{ marginBottom: 8 }}>
                Select Avatar
              </T>
              <View style={styles.avatarGrid}>
                {avatarOptions.map((avatar, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.avatarOption,
                      selectedAvatar === avatar && styles.avatarOptionSelected,
                    ]}
                    onPress={() => handleSelectAvatar(avatar)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select avatar ${index + 1}`}
                  >
                    <T variant="h1">{avatar}</T>
                  </TouchableOpacity>
                ))}
              </View>

              <T variant="body" weight="semiBold" style={{ marginTop: 16, marginBottom: 8 }}>
                Skin Tone
              </T>
              <Row gap="xs" wrap>
                {skinTones.map((tone) => (
                  <Chip
                    key={tone.value}
                    variant="filter"
                    label={`${tone.emoji} ${tone.label}`}
                    selected={selectedSkinTone === tone.value}
                    onPress={() => handleSelectSkinTone(tone.value)}
                  />
                ))}
              </Row>
            </View>
          )}
        </Card>

        {/* 3. Virtual Interactions */}
        <Card style={styles.interactionsCard}>
          <View style={styles.interactionsHeader}>
            <T variant="title" weight="semiBold">
              🤝 Virtual Interactions
            </T>
            <Button
              variant="outline"
              onPress={() => setShowInteractions(!showInteractions)}
            >
              {showInteractions ? 'Hide' : 'Show'}
            </Button>
          </View>

          {showInteractions && (
            <View style={styles.interactionsGrid}>
              {interactions.map((interaction) => (
                <TouchableOpacity
                  key={interaction.id}
                  style={styles.interactionButton}
                  onPress={() => handleInteraction(interaction.id, interaction.label)}
                  accessibilityRole="button"
                  accessibilityLabel={interaction.description}
                >
                  <T variant="h2">{interaction.icon}</T>
                  <T variant="caption" style={{ textAlign: 'center' }}>
                    {interaction.label}
                  </T>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Card>

        {/* Basic Controls */}
        <Card style={styles.controlsCard}>
          <T variant="title" weight="semiBold" style={{ marginBottom: 12 }}>
            Controls
          </T>
          <Row gap="xs" wrap>
            <Button
              variant={videoEnabled ? 'primary' : 'outline'}
              onPress={() => handleControlPress('video')}
            >
              🎥 Video
            </Button>
            <Button
              variant={audioEnabled ? 'primary' : 'outline'}
              onPress={() => handleControlPress('audio')}
            >
              🎤 Audio
            </Button>
            <Button variant="outline" onPress={() => handleControlPress('chat')}>
              💬 Chat
            </Button>
            <Button variant="outline" onPress={() => handleControlPress('raise-hand')}>
              ✋ Hand
            </Button>
          </Row>
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
  viewCard: {
    padding: 16,
  },
  classroom3D: {
    height: 250,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  avatarPreview: {
    alignItems: 'center',
    gap: 4,
  },
  avatarCard: {
    padding: 16,
  },
  avatarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customizationPanel: {
    marginTop: 8,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  avatarOption: {
    width: 70,
    height: 70,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  avatarOptionSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  interactionsCard: {
    padding: 16,
  },
  interactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  interactionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  interactionButton: {
    width: '30%',
    minWidth: 90,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  controlsCard: {
    padding: 16,
  },
});

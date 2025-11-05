/**
 * NewCollaborativeAssignment - Premium Minimal Design
 * Purpose: Group assignment collaboration workspace
 * Used in: StudentNavigator (AssignmentsStack)
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackScreenView } from '../../utils/navigationAnalytics';

type Props = NativeStackScreenProps<any, 'NewCollaborativeAssignment'>;

export default function NewCollaborativeAssignment({ navigation }: Props) {
  React.useEffect(() => {
    trackScreenView('NewCollaborativeAssignment');
  }, []);

  const teamMembers = [
    { name: 'You', role: 'Team Lead', avatar: '👤' },
    { name: 'John Doe', role: 'Member', avatar: '👨' },
    { name: 'Jane Smith', role: 'Member', avatar: '👩' },
  ];

  return (
    <BaseScreen scrollable={false}>
      <ScrollView style={styles.container}>
        <Card style={styles.headerCard}>
          <T variant="h2" weight="bold">
            Group Project: Climate Change
          </T>
          <T variant="caption" style={styles.subject}>
            Environmental Science • Due in 5 days
          </T>
        </Card>

        <Card style={styles.teamCard}>
          <T variant="title" weight="semiBold" style={styles.sectionTitle}>
            Team Members
          </T>
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.memberItem}>
              <View style={styles.memberAvatar}>
                <T variant="body">{member.avatar}</T>
              </View>
              <View style={styles.memberInfo}>
                <T variant="body" weight="semiBold">
                  {member.name}
                </T>
                <T variant="caption" style={styles.memberRole}>
                  {member.role}
                </T>
              </View>
            </View>
          ))}
        </Card>

        <Card style={styles.progressCard}>
          <T variant="title" weight="semiBold" style={styles.sectionTitle}>
            Progress
          </T>
          <T variant="body">Research: ✅ Complete</T>
          <T variant="body">Draft: 🔄 In Progress</T>
          <T variant="body">Review: ⏳ Pending</T>
        </Card>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerCard: {
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  subject: {
    color: '#6B7280',
  },
  teamCard: {
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  memberItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInfo: {
    flex: 1,
    gap: 2,
  },
  memberRole: {
    color: '#6B7280',
  },
  progressCard: {
    padding: 16,
    marginBottom: 32,
    gap: 12,
  },
});

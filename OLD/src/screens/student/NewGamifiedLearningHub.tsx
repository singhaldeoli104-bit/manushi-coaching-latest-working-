/**
 * NewGamifiedLearningHub - Premium Minimal Design
 * Purpose: Gamification features - badges, streaks, leaderboard
 * Used in: StudentNavigator (PerformanceStack)
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackScreenView } from '../../utils/navigationAnalytics';

type Props = NativeStackScreenProps<any, 'NewGamifiedLearningHub'>;

export default function NewGamifiedLearningHub({ navigation }: Props) {
  React.useEffect(() => {
    trackScreenView('NewGamifiedLearningHub');
  }, []);

  const badges = [
    { icon: '🏆', name: 'Top Scorer', earned: true },
    { icon: '🔥', name: '7 Day Streak', earned: true },
    { icon: '⭐', name: 'Perfect Attendance', earned: false },
  ];

  return (
    <BaseScreen scrollable={false}>
      <ScrollView style={styles.container}>
        <Card style={styles.statsCard}>
          <T variant="h1" weight="bold" style={styles.points}>
            1,250
          </T>
          <T variant="body" style={styles.pointsLabel}>
            Total Points
          </T>
        </Card>

        <Card style={styles.badgesCard}>
          <T variant="title" weight="semiBold" style={styles.sectionTitle}>
            Your Badges
          </T>
          <View style={styles.badgesGrid}>
            {badges.map((badge, index) => (
              <View
                key={index}
                style={[styles.badgeItem, !badge.earned && styles.badgeItemLocked]}
              >
                <T variant="h1">{badge.earned ? badge.icon : '🔒'}</T>
                <T variant="caption" style={styles.badgeName}>
                  {badge.name}
                </T>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  statsCard: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  points: {
    fontSize: 48,
    color: '#3B82F6',
  },
  pointsLabel: {
    color: '#6B7280',
    marginTop: 8,
  },
  badgesCard: {
    padding: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeItem: {
    width: '30%',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  badgeItemLocked: {
    opacity: 0.5,
  },
  badgeName: {
    textAlign: 'center',
    color: '#6B7280',
  },
});

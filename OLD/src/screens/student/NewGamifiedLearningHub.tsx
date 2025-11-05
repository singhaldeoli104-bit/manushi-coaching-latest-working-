/**
 * NewGamifiedLearningHub - Premium Minimal Design
 * Purpose: Gamification features - badges, streaks, leaderboard
 * Used in: StudentNavigator (PerformanceStack)
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

type Props = NativeStackScreenProps<any, 'NewGamifiedLearningHub'>;

interface Badge {
  id: string;
  icon: string;
  name: string;
  earned: boolean;
}

interface Gamification {
  total_points: number;
  badges: Badge[];
  level: number;
  streak_days: number;
}

export default function NewGamifiedLearningHub({ navigation }: Props) {
  const { user } = useAuth();

  React.useEffect(() => {
    trackScreenView('NewGamifiedLearningHub');
  }, []);

  // Fetch gamification data
  const { data: gamification, isLoading, error } = useQuery({
    queryKey: ['gamification', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');

      // Fetch main gamification record
      const { data: gamData, error: gamError } = await supabase
        .from('student_gamification')
        .select('*')
        .eq('student_id', user.id)
        .single();

      if (gamError) throw gamError;

      // Fetch earned badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('student_badges')
        .select('*, badges(id, name, icon, description)')
        .eq('student_id', user.id);

      if (badgesError) throw badgesError;

      const badges = (badgesData || []).map(item => ({
        id: (item.badges as any)?.id || item.id,
        icon: (item.badges as any)?.icon || '🏆',
        name: (item.badges as any)?.name || 'Badge',
        earned: item.earned_at != null,
      }));

      return {
        total_points: gamData.total_points || 0,
        badges,
        level: gamData.level || 1,
        streak_days: gamData.streak_days || 0,
      } as Gamification;
    },
    enabled: !!user?.id,
  });

  return (
    <BaseScreen
      scrollable={false}
      loading={isLoading}
      error={error ? 'Failed to load gamification data' : null}
      empty={!gamification}
      emptyMessage="No gamification data available"
    >
      {gamification && (
        <ScrollView style={styles.container}>
          <Card style={styles.statsCard}>
            <T variant="h1" weight="bold" style={styles.points}>
              {gamification.total_points.toLocaleString()}
            </T>
            <T variant="body" style={styles.pointsLabel}>
              Total Points
            </T>
            <T variant="caption" style={styles.levelText}>
              Level {gamification.level} • {gamification.streak_days} day streak 🔥
            </T>
          </Card>

          <Card style={styles.badgesCard}>
            <T variant="title" weight="semiBold" style={styles.sectionTitle}>
              Your Badges ({gamification.badges.filter(b => b.earned).length})
            </T>
            {gamification.badges.length > 0 ? (
              <View style={styles.badgesGrid}>
                {gamification.badges.map((badge) => (
                  <View
                    key={badge.id}
                    style={[styles.badgeItem, !badge.earned && styles.badgeItemLocked]}
                  >
                    <T variant="h1">{badge.earned ? badge.icon : '🔒'}</T>
                    <T variant="caption" style={styles.badgeName}>
                      {badge.name}
                    </T>
                  </View>
                ))}
              </View>
            ) : (
              <T variant="body" style={styles.emptyText}>
                No badges available yet
              </T>
            )}
          </Card>
        </ScrollView>
      )}
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
    gap: 8,
  },
  points: {
    fontSize: 48,
    color: '#3B82F6',
  },
  pointsLabel: {
    color: '#6B7280',
  },
  levelText: {
    color: '#9CA3AF',
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
  emptyText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
});

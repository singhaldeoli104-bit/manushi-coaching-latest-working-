/**
 * NewGamifiedLearningHub - Premium Minimal Design
 * Purpose: Gamification features - badges, streaks, leaderboard
 * Used in: StudentNavigator (PerformanceStack)
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { Badge as BadgeComponent } from '../../ui/data-display/Badge';
import { Chip } from '../../ui/inputs/Chip';
import { Row } from '../../ui/layout/Row';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

type Props = NativeStackScreenProps<any, 'NewGamifiedLearningHub'>;

interface Badge {
  id: string;
  icon: string;
  name: string;
  earned: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  description: string;
  earnedDate?: string;
  progress?: number;
  requirement?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  points: number;
  category: string;
}

interface Gamification {
  total_points: number;
  badges: Badge[];
  level: number;
  streak_days: number;
  achievements: Achievement[];
}

export default function NewGamifiedLearningHub({ navigation }: Props) {
  const { user } = useAuth();
  const [badgeCategory, setBadgeCategory] = useState<'all' | 'academic' | 'social' | 'special'>('all');

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

      // Fetch earned badges with enhanced data
      const { data: badgesData, error: badgesError } = await supabase
        .from('student_badges')
        .select('*, badges(id, name, icon, description)')
        .eq('student_id', user.id);

      if (badgesError) throw badgesError;

      const badges = (badgesData || []).map(item => {
        const badgeInfo = item.badges as any;
        const name = badgeInfo?.name || 'Badge';

        // Derive rarity from badge name or description
        let rarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common';
        if (name.includes('Master') || name.includes('Champion')) rarity = 'legendary';
        else if (name.includes('Expert') || name.includes('Pro')) rarity = 'epic';
        else if (name.includes('Advanced') || name.includes('Skilled')) rarity = 'rare';

        // Derive category from badge name
        let category = 'Academic';
        if (name.includes('Social') || name.includes('Team') || name.includes('Peer')) category = 'Social';
        else if (name.includes('Special') || name.includes('Unique') || name.includes('Limited')) category = 'Special';

        return {
          id: badgeInfo?.id || item.id,
          icon: badgeInfo?.icon || '🏆',
          name,
          earned: item.earned_at != null,
          rarity,
          category,
          description: badgeInfo?.description || 'Complete the requirements to earn this badge',
          earnedDate: item.earned_at ? new Date(item.earned_at).toLocaleDateString() : undefined,
          progress: item.earned_at ? 100 : Math.floor(Math.random() * 80), // Simulate progress for locked badges
          requirement: badgeInfo?.requirement || 'Complete specific tasks',
        };
      });

      // Fetch achievements (recent accomplishments)
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('student_badges')
        .select('*, badges(id, name, icon, description)')
        .eq('student_id', user.id)
        .not('earned_at', 'is', null)
        .order('earned_at', { ascending: false })
        .limit(10);

      if (achievementsError) throw achievementsError;

      const achievements = (achievementsData || []).map(item => {
        const badgeInfo = item.badges as any;
        return {
          id: item.id,
          title: badgeInfo?.name || 'Achievement Unlocked',
          description: badgeInfo?.description || 'Great work!',
          icon: badgeInfo?.icon || '🎉',
          earnedDate: new Date(item.earned_at).toLocaleDateString(),
          points: Math.floor(Math.random() * 100) + 50, // Simulate points (50-150)
          category: badgeInfo?.name?.includes('Team') ? 'Social' : 'Academic',
        };
      });

      return {
        total_points: gamData.total_points || 0,
        badges,
        level: gamData.level || 1,
        streak_days: gamData.streak_days || 0,
        achievements,
      } as Gamification;
    },
    enabled: !!user?.id,
  });

  const filteredBadges = gamification?.badges.filter(badge =>
    badgeCategory === 'all' || badge.category.toLowerCase() === badgeCategory
  ) || [];

  const earnedBadgesCount = gamification?.badges.filter(b => b.earned).length || 0;
  const totalBadgesCount = gamification?.badges.length || 0;
  const collectionProgress = totalBadgesCount > 0 ? Math.round((earnedBadgesCount / totalBadgesCount) * 100) : 0;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#FFD700';
      case 'epic': return '#9333EA';
      case 'rare': return '#3B82F6';
      case 'common': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getRarityLabel = (rarity: string) => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  };

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

          {/* 1. Badge Collection Display */}
          <Card style={styles.badgesCard}>
            <View style={styles.badgesHeader}>
              <View>
                <T variant="title" weight="semiBold">
                  🏅 Badge Collection
                </T>
                <T variant="caption" style={styles.collectionProgress}>
                  {earnedBadgesCount} / {totalBadgesCount} badges collected ({collectionProgress}%)
                </T>
              </View>
            </View>

            {/* Collection Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${collectionProgress}%` }]} />
            </View>

            {/* Category Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              <Row gap="xs" style={{ paddingVertical: 8 }}>
                <Chip
                  variant="filter"
                  label="All"
                  selected={badgeCategory === 'all'}
                  onPress={() => {
                    setBadgeCategory('all');
                    trackAction('filter_badges', 'NewGamifiedLearningHub', { category: 'all' });
                  }}
                />
                <Chip
                  variant="filter"
                  label="📚 Academic"
                  selected={badgeCategory === 'academic'}
                  onPress={() => {
                    setBadgeCategory('academic');
                    trackAction('filter_badges', 'NewGamifiedLearningHub', { category: 'academic' });
                  }}
                />
                <Chip
                  variant="filter"
                  label="👥 Social"
                  selected={badgeCategory === 'social'}
                  onPress={() => {
                    setBadgeCategory('social');
                    trackAction('filter_badges', 'NewGamifiedLearningHub', { category: 'social' });
                  }}
                />
                <Chip
                  variant="filter"
                  label="⭐ Special"
                  selected={badgeCategory === 'special'}
                  onPress={() => {
                    setBadgeCategory('special');
                    trackAction('filter_badges', 'NewGamifiedLearningHub', { category: 'special' });
                  }}
                />
              </Row>
            </ScrollView>

            {/* Badges Grid */}
            {filteredBadges.length > 0 ? (
              <View style={styles.badgesGrid}>
                {filteredBadges.map((badge) => (
                  <TouchableOpacity
                    key={badge.id}
                    style={[
                      styles.badgeItem,
                      !badge.earned && styles.badgeItemLocked,
                      { borderColor: getRarityColor(badge.rarity) },
                    ]}
                    onPress={() => {
                      trackAction('view_badge_details', 'NewGamifiedLearningHub', { badgeId: badge.id });
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`${badge.name} badge`}
                  >
                    <T variant="h1">{badge.earned ? badge.icon : '🔒'}</T>
                    <T variant="caption" style={styles.badgeName}>
                      {badge.name}
                    </T>
                    <BadgeComponent
                      variant={badge.rarity === 'legendary' ? 'warning' : badge.rarity === 'epic' ? 'info' : 'neutral'}
                      label={getRarityLabel(badge.rarity)}
                    />
                    {badge.earned && badge.earnedDate && (
                      <T variant="caption" style={styles.earnedDate}>
                        {badge.earnedDate}
                      </T>
                    )}
                    {!badge.earned && badge.progress !== undefined && (
                      <View style={styles.badgeProgress}>
                        <View style={[styles.badgeProgressFill, { width: `${badge.progress}%` }]} />
                        <T variant="caption" style={styles.badgeProgressText}>
                          {badge.progress}%
                        </T>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <T variant="body" style={styles.emptyText}>
                No badges in this category
              </T>
            )}
          </Card>

          {/* 2. Achievement Timeline */}
          <Card style={styles.achievementsCard}>
            <T variant="title" weight="semiBold" style={styles.sectionTitle}>
              🏆 Recent Achievements
            </T>
            {gamification.achievements && gamification.achievements.length > 0 ? (
              <View style={styles.timeline}>
                {gamification.achievements.map((achievement, index) => (
                  <View key={achievement.id} style={styles.timelineItem}>
                    <View style={styles.timelineDot} />
                    {index < gamification.achievements.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                    <View style={styles.achievementCard}>
                      <View style={styles.achievementHeader}>
                        <View style={styles.achievementIcon}>
                          <T variant="h2">{achievement.icon}</T>
                        </View>
                        <View style={styles.achievementContent}>
                          <T variant="body" weight="semiBold">
                            {achievement.title}
                          </T>
                          <T variant="caption" style={styles.achievementDescription}>
                            {achievement.description}
                          </T>
                          <Row gap="xs" style={{ marginTop: 4 }}>
                            <BadgeComponent variant="success" label={`+${achievement.points} pts`} />
                            <T variant="caption" style={styles.achievementDate}>
                              {achievement.earnedDate}
                            </T>
                          </Row>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <T variant="body" style={styles.emptyText}>
                Complete tasks and assignments to unlock achievements!
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
    marginBottom: 16,
  },
  badgesHeader: {
    marginBottom: 12,
  },
  collectionProgress: {
    color: '#6B7280',
    marginTop: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  categoryScroll: {
    marginBottom: 16,
    marginHorizontal: -16,
    paddingHorizontal: 16,
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
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  badgeItemLocked: {
    opacity: 0.5,
  },
  badgeName: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 11,
  },
  earnedDate: {
    color: '#9CA3AF',
    fontSize: 10,
    textAlign: 'center',
  },
  badgeProgress: {
    width: '100%',
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeProgressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#3B82F6',
  },
  badgeProgressText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1F2937',
    zIndex: 1,
  },
  achievementsCard: {
    padding: 16,
    marginBottom: 32,
  },
  timeline: {
    gap: 16,
  },
  timelineItem: {
    position: 'relative',
    paddingLeft: 32,
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 2,
  },
  timelineLine: {
    position: 'absolute',
    left: 5,
    top: 20,
    bottom: -16,
    width: 2,
    backgroundColor: '#E5E7EB',
    zIndex: 1,
  },
  achievementCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  achievementHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  achievementContent: {
    flex: 1,
    gap: 4,
  },
  achievementDescription: {
    color: '#6B7280',
  },
  achievementDate: {
    color: '#9CA3AF',
  },
  emptyText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
});

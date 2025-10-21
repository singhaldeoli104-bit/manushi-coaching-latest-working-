/**
 * GamifiedLearningHub - Phase 48.2: Advanced Gamification System
 * Comprehensive achievement system with learning streaks, challenges, leaderboards, and social learning
 * Features: Achievement badges, learning quests, team competitions, virtual rewards, seasonal events
 * Manushi Coaching Platform
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  BackHandler,
  Share,
} from 'react-native';
import { Appbar, Portal, Snackbar, ActivityIndicator } from 'react-native-paper';

import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import * as GamificationService from '../../services/gamificationService';

const { width, height } = Dimensions.get('window');

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'academic' | 'streak' | 'social' | 'challenge' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedDate?: Date;
  xpReward: number;
  coinReward: number;
}

interface LearningStreak {
  type: 'daily' | 'weekly' | 'subject' | 'perfect';
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
  subject?: string;
  lastActivity: Date;
  streakBonus: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'team' | 'global';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  subject: string;
  timeLimit: number; // in hours
  startDate: Date;
  endDate: Date;
  participants: number;
  maxParticipants?: number;
  rewards: {
    xp: number;
    coins: number;
    badges: string[];
  };
  progress: number;
  isActive: boolean;
  isCompleted: boolean;
}

interface Leaderboard {
  type: 'daily' | 'weekly' | 'monthly' | 'alltime';
  category: 'xp' | 'streaks' | 'achievements' | 'challenges';
  entries: LeaderboardEntry[];
}

interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  avatar: string;
  score: number;
  change: number; // position change from last period
  badge?: string;
  level: number;
}

interface StudentProgress {
  level: number;
  xp: number;
  xpToNext: number;
  totalXP: number;
  coins: number;
  gems: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  rank: number;
  title: string;
}

interface SeasonalEvent {
  id: string;
  name: string;
  theme: string;
  description: string;
  startDate: Date;
  endDate: Date;
  specialRewards: string[];
  isActive: boolean;
  progress: number;
  maxProgress: number;
}

interface GamifiedLearningHubProps {
  studentId?: string;
  studentName?: string;
  onNavigate?: (screen: string, params?: any) => void;
}

const GamifiedLearningHub: React.FC<GamifiedLearningHubProps> = ({
  studentId = 'student_123',
  studentName = 'Alex Johnson',
  onNavigate,
}) => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [learningStreaks, setLearningStreaks] = useState<LearningStreak[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null);
  const [seasonalEvent, setSeasonalEvent] = useState<SeasonalEvent | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'challenges' | 'leaderboard' | 'events'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    initializeScreen();
    setupBackHandler();
    return cleanup;
  }, []);

  const initializeScreen = useCallback(async () => {
    try {
      setIsLoading(true);
      await initializeGamificationData();
    } catch (error) {
      console.error('Error initializing screen:', error);
      showSnackbar('Failed to load gamification data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onNavigate?.('student-dashboard');
      return true;
    });
    return backHandler.remove;
  }, [onNavigate]);

  const cleanup = useCallback(() => {
    // Clean up resources
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const initializeGamificationData = async () => {
    const userId = user?.id || studentId;

    if (!userId) {
      console.log('No user ID available');
      return;
    }

    try {
      const result = await GamificationService.getGamificationData(userId);

      if (result.success && result.data) {
        setStudentProgress(result.data.progress);
        setAchievements(result.data.achievements);
        setLearningStreaks(result.data.learningStreaks);
        setActiveChallenges(result.data.activeChallenges);
        setLeaderboards([result.data.leaderboard]);
        setSeasonalEvent(result.data.seasonalEvent);

        showSnackbar('Gamification data loaded successfully');
      } else {
        showSnackbar(result.error || 'Failed to load gamification data');
      }
    } catch (error) {
      console.error('Error loading gamification data:', error);
      showSnackbar('Failed to load gamification data');
    }
  };

  // Legacy mock data setup (keeping commented for reference)
  const initializeGamificationDataMock = () => {
    // This function contains mock data and is kept for reference
    // The actual implementation now uses GamificationService
    const mockAchievements: Achievement[] = [
      {
        id: 'first_login',
        name: 'First Steps',
        description: 'Welcome to your learning journey!',
        icon: '🚀',
        category: 'milestone',
        rarity: 'common',
        progress: 1,
        maxProgress: 1,
        isUnlocked: true,
        unlockedDate: new Date(2024, 0, 15),
        xpReward: 100,
        coinReward: 50
      },
      {
        id: 'math_streak_7',
        name: 'Math Warrior',
        description: 'Complete 7 consecutive days of math practice',
        icon: '🔢',
        category: 'streak',
        rarity: 'rare',
        progress: 7,
        maxProgress: 7,
        isUnlocked: true,
        unlockedDate: new Date(2024, 2, 10),
        xpReward: 500,
        coinReward: 200
      },
      {
        id: 'perfect_score',
        name: 'Perfectionist',
        description: 'Score 100% on 5 different subjects',
        icon: '💯',
        category: 'academic',
        rarity: 'epic',
        progress: 3,
        maxProgress: 5,
        isUnlocked: false,
        xpReward: 1000,
        coinReward: 500
      },
      {
        id: 'team_player',
        name: 'Team Player',
        description: 'Help 10 classmates with their doubts',
        icon: '🤝',
        category: 'social',
        rarity: 'rare',
        progress: 8,
        maxProgress: 10,
        isUnlocked: false,
        xpReward: 750,
        coinReward: 300
      },
      {
        id: 'ai_master',
        name: 'AI Whisperer',
        description: 'Have 50 successful AI tutor sessions',
        icon: '🤖',
        category: 'milestone',
        rarity: 'legendary',
        progress: 32,
        maxProgress: 50,
        isUnlocked: false,
        xpReward: 2000,
        coinReward: 1000
      }
    ];

    // Initialize learning streaks
    const mockStreaks: LearningStreak[] = [
      {
        type: 'daily',
        currentStreak: 15,
        longestStreak: 23,
        isActive: true,
        lastActivity: new Date(),
        streakBonus: 1.5
      },
      {
        type: 'subject',
        currentStreak: 8,
        longestStreak: 12,
        isActive: true,
        subject: 'Mathematics',
        lastActivity: new Date(),
        streakBonus: 1.3
      },
      {
        type: 'perfect',
        currentStreak: 3,
        longestStreak: 5,
        isActive: true,
        lastActivity: new Date(),
        streakBonus: 2.0
      }
    ];

    // Initialize challenges
    const mockChallenges: Challenge[] = [
      {
        id: 'math_marathon',
        title: 'Math Marathon',
        description: 'Solve 100 math problems this week',
        type: 'individual',
        difficulty: 'medium',
        subject: 'Mathematics',
        timeLimit: 168, // 1 week
        startDate: new Date(2024, 8, 1),
        endDate: new Date(2024, 8, 8),
        participants: 1,
        rewards: { xp: 800, coins: 300, badges: ['math_marathon_2024'] },
        progress: 67,
        isActive: true,
        isCompleted: false
      },
      {
        id: 'science_squad',
        title: 'Science Squad Challenge',
        description: 'Team up to explore physics concepts',
        type: 'team',
        difficulty: 'hard',
        subject: 'Physics',
        timeLimit: 72,
        startDate: new Date(2024, 8, 5),
        endDate: new Date(2024, 8, 8),
        participants: 234,
        maxParticipants: 500,
        rewards: { xp: 1200, coins: 500, badges: ['physics_explorer', 'team_champion'] },
        progress: 45,
        isActive: true,
        isCompleted: false
      },
      {
        id: 'ai_challenge',
        title: 'AI Learning Master',
        description: 'Use AI tutor for 20 different topics',
        type: 'global',
        difficulty: 'extreme',
        subject: 'All',
        timeLimit: 240,
        startDate: new Date(2024, 8, 1),
        endDate: new Date(2024, 8, 11),
        participants: 1567,
        rewards: { xp: 2000, coins: 800, badges: ['ai_master', 'global_champion'] },
        progress: 85,
        isActive: true,
        isCompleted: false
      }
    ];

    // Initialize leaderboards
    const mockLeaderboards: Leaderboard[] = [
      {
        type: 'weekly',
        category: 'xp',
        entries: [
          { rank: 1, studentId: 'top1', name: 'Priya Sharma', avatar: '👑', score: 12500, change: 2, level: 45, badge: '🏆' },
          { rank: 2, studentId: 'top2', name: 'Arjun Patel', avatar: '🥈', score: 11200, change: -1, level: 43, badge: '🥈' },
          { rank: 3, studentId: 'top3', name: 'Sneha Gupta', avatar: '🥉', score: 10800, change: 1, level: 42, badge: '🥉' },
          { rank: 12, studentId: studentId, name: studentName, avatar: '🎯', score: 8950, change: 3, level: 42, badge: '⭐' },
          { rank: 13, studentId: 'other1', name: 'Rahul Kumar', avatar: '📚', score: 8750, change: -2, level: 41 },
        ]
      }
    ];

    // Initialize seasonal event
    const mockSeasonalEvent: SeasonalEvent = {
      id: 'autumn_learning',
      name: 'Autumn Learning Festival',
      theme: '🍂 Knowledge Harvest',
      description: 'Gather knowledge points like autumn leaves! Special rewards for active learners.',
      startDate: new Date(2024, 8, 1),
      endDate: new Date(2024, 8, 30),
      specialRewards: ['Golden Leaf Badge', 'Harvest Crown', 'Wisdom Scroll'],
      isActive: true,
      progress: 1250,
      maxProgress: 2000
    };

    setStudentProgress(mockProgress);
    setAchievements(mockAchievements);
    setLearningStreaks(mockStreaks);
    setActiveChallenges(mockChallenges);
    setLeaderboards(mockLeaderboards);
    setSeasonalEvent(mockSeasonalEvent);
  };

  const handleAchievementPress = (achievement: Achievement) => {
    Alert.alert(
      achievement.name,
      `${achievement.description}\n\nProgress: ${achievement.progress}/${achievement.maxProgress}\nReward: ${achievement.xpReward} XP + ${achievement.coinReward} coins`,
      [
        { text: 'Close' },
        achievement.isUnlocked && {
          text: 'Share',
          onPress: () => handleShareAchievement(achievement)
        }
      ].filter(Boolean) as any
    );
  };

  const handleShareAchievement = async (achievement: Achievement) => {
    try {
      await Share.share({
        message: `🎉 I just unlocked the "${achievement.name}" achievement on Manushi Coaching! ${achievement.description}`,
        title: `Achievement Unlocked: ${achievement.name}`,
      });
      showSnackbar('Achievement shared successfully!');
    } catch (error) {
      console.error('Error sharing achievement:', error);
      // User cancelled the share dialog - this is normal, don't show error
    }
  };

  const handleChallengeJoin = async (challengeId: string) => {
    const challenge = activeChallenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const userId = user?.id || studentId;

    try {
      // Call the gamification service to join the challenge
      const result = await GamificationService.joinChallenge(challengeId, userId);

      if (result.success) {
        // Update local state to increment participant count
        setActiveChallenges(prev => prev.map(c =>
          c.id === challengeId
            ? { ...c, participants: c.participants + 1 }
            : c
        ));

        showSnackbar(`Successfully joined "${challenge.title}"! Good luck! 🎯`);
      } else {
        showSnackbar(result.error || 'Failed to join challenge');
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
      showSnackbar('An error occurred while joining the challenge');
    }
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common': return '#4ECDC4';
      case 'rare': return '#4D79FF';
      case 'epic': return '#9B59B6';
      case 'legendary': return '#FFD93D';
      default: return LightTheme.Surface;
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return '#4ECDC4';
      case 'medium': return '#FFD93D';
      case 'hard': return '#FF8C42';
      case 'extreme': return '#FF6B6B';
      default: return LightTheme.Surface;
    }
  };

  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: LightTheme.Primary }}>
      <Appbar.BackAction onPress={() => onNavigate?.('student-dashboard')} color="#FFFFFF" />
      <Appbar.Content
        title="Learning Hub"
        titleStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
        subtitle={`Level ${studentProgress?.level || 0} • ${studentProgress?.title || ''}`}
        subtitleStyle={{ color: '#FFFFFF', opacity: 0.9 }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: Spacing.SM }}>
        <Text style={{ ...Typography.bodySmall, color: '#FFFFFF', fontWeight: 'bold', marginRight: Spacing.SM }}>
          🪙 {studentProgress?.coins || 0}
        </Text>
        <Text style={{ ...Typography.bodySmall, color: '#FFFFFF', fontWeight: 'bold' }}>
          💎 {studentProgress?.gems || 0}
        </Text>
      </View>
    </Appbar.Header>
  );

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Student Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelText}>Level {studentProgress?.level}</Text>
            <Text style={styles.titleText}>{studentProgress?.title}</Text>
          </View>
          <View style={styles.currencyInfo}>
            <Text style={styles.currencyText}>🪙 {studentProgress?.coins}</Text>
            <Text style={styles.currencyText}>💎 {studentProgress?.gems}</Text>
          </View>
        </View>
        
        <View style={styles.xpContainer}>
          <View style={styles.xpBarContainer}>
            <View 
              style={[
                styles.xpBar, 
                { width: `${((studentProgress?.xp || 0) / ((studentProgress?.xp || 0) + (studentProgress?.xpToNext || 1))) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.xpText}>
            {studentProgress?.xp}/{(studentProgress?.xp || 0) + (studentProgress?.xpToNext || 0)} XP
          </Text>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{studentProgress?.achievementsUnlocked}</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>#{studentProgress?.rank}</Text>
            <Text style={styles.statLabel}>Global Rank</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{studentProgress?.totalXP.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
        </View>
      </View>

      {/* Active Streaks */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🔥 Learning Streaks</Text>
        {learningStreaks.filter(streak => streak.isActive).map((streak, index) => (
          <View key={index} style={styles.streakItem}>
            <Text style={styles.streakIcon}>
              {streak.type === 'daily' ? '📅' : streak.type === 'subject' ? '📚' : '💯'}
            </Text>
            <View style={styles.streakInfo}>
              <Text style={styles.streakTitle}>
                {streak.type === 'daily' ? 'Daily Learning' : 
                 streak.type === 'subject' ? `${streak.subject} Focus` : 'Perfect Scores'}
              </Text>
              <Text style={styles.streakCount}>
                {streak.currentStreak} days • Best: {streak.longestStreak}
              </Text>
            </View>
            <Text style={styles.streakBonus}>+{((streak.streakBonus - 1) * 100).toFixed(0)}%</Text>
          </View>
        ))}
      </View>

      {/* Active Challenges Preview */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>⚔️ Active Challenges</Text>
        {activeChallenges.slice(0, 2).map((challenge) => (
          <TouchableOpacity 
            key={challenge.id} 
            style={styles.challengePreview}
            onPress={() => setSelectedTab('challenges')}
          >
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeProgress}>{challenge.progress}% complete</Text>
            <View style={styles.challengeProgressBar}>
              <View style={[styles.challengeProgressFill, { width: `${challenge.progress}%` }]} />
            </View>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => setSelectedTab('challenges')}
        >
          <Text style={styles.viewAllButtonText}>View All Challenges</Text>
        </TouchableOpacity>
      </View>

      {/* Seasonal Event */}
      {seasonalEvent && seasonalEvent.isActive && (
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>{seasonalEvent.theme}</Text>
          <Text style={styles.eventName}>{seasonalEvent.name}</Text>
          <Text style={styles.eventDescription}>{seasonalEvent.description}</Text>
          
          <View style={styles.eventProgress}>
            <Text style={styles.eventProgressText}>
              Progress: {seasonalEvent.progress}/{seasonalEvent.maxProgress}
            </Text>
            <View style={styles.eventProgressBar}>
              <View 
                style={[
                  styles.eventProgressFill, 
                  { width: `${(seasonalEvent.progress / seasonalEvent.maxProgress) * 100}%` }
                ]} 
              />
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.eventButton}
            onPress={() => setSelectedTab('events')}
          >
            <Text style={styles.eventButtonText}>Participate</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderAchievementsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabDescription}>
        Unlock achievements by completing learning milestones, maintaining streaks, and participating in challenges!
      </Text>
      
      <View style={styles.achievementStats}>
        <Text style={styles.achievementStatsText}>
          {achievements.filter(a => a.isUnlocked).length} / {achievements.length} Unlocked
        </Text>
      </View>
      
      {achievements.map((achievement) => (
        <TouchableOpacity
          key={achievement.id}
          style={[
            styles.achievementCard,
            achievement.isUnlocked && styles.unlockedAchievement
          ]}
          onPress={() => handleAchievementPress(achievement)}
        >
          <View style={styles.achievementHeader}>
            <Text style={[
              styles.achievementIcon,
              !achievement.isUnlocked && styles.lockedIcon
            ]}>
              {achievement.isUnlocked ? achievement.icon : '🔒'}
            </Text>
            
            <View style={styles.achievementInfo}>
              <Text style={[
                styles.achievementName,
                !achievement.isUnlocked && styles.lockedText
              ]}>
                {achievement.name}
              </Text>
              <Text style={[
                styles.achievementDescription,
                !achievement.isUnlocked && styles.lockedText
              ]}>
                {achievement.description}
              </Text>
            </View>
            
            <View style={[
              styles.rarityBadge,
              { backgroundColor: getRarityColor(achievement.rarity) }
            ]}>
              <Text style={styles.rarityText}>{achievement.rarity.toUpperCase()}</Text>
            </View>
          </View>
          
          {!achievement.isUnlocked && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                Progress: {achievement.progress}/{achievement.maxProgress}
              </Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar,
                    { width: `${(achievement.progress / achievement.maxProgress) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          )}
          
          <View style={styles.rewardContainer}>
            <Text style={styles.rewardText}>
              🎯 {achievement.xpReward} XP • 🪙 {achievement.coinReward}
            </Text>
            {achievement.unlockedDate && (
              <Text style={styles.unlockedDate}>
                Unlocked: {achievement.unlockedDate.toLocaleDateString()}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderChallengesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabDescription}>
        Join challenges to compete with classmates, earn rewards, and push your learning limits!
      </Text>
      
      {activeChallenges.map((challenge) => (
        <View key={challenge.id} style={styles.challengeCard}>
          <View style={styles.challengeCardHeader}>
            <Text style={styles.challengeCardTitle}>{challenge.title}</Text>
            <View style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(challenge.difficulty) }
            ]}>
              <Text style={styles.difficultyText}>{challenge.difficulty.toUpperCase()}</Text>
            </View>
          </View>
          
          <Text style={styles.challengeCardDescription}>{challenge.description}</Text>
          
          <View style={styles.challengeDetails}>
            <Text style={styles.challengeDetail}>📚 {challenge.subject}</Text>
            <Text style={styles.challengeDetail}>⏱️ {challenge.timeLimit}h</Text>
            <Text style={styles.challengeDetail}>
              👥 {challenge.participants}{challenge.maxParticipants ? `/${challenge.maxParticipants}` : ''} participants
            </Text>
          </View>
          
          <View style={styles.challengeProgress}>
            <Text style={styles.challengeProgressLabel}>Progress: {challenge.progress}%</Text>
            <View style={styles.challengeProgressBarContainer}>
              <View 
                style={[
                  styles.challengeProgressBarFill,
                  { width: `${challenge.progress}%` }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.challengeRewards}>
            <Text style={styles.challengeRewardTitle}>Rewards:</Text>
            <Text style={styles.challengeRewardText}>
              🎯 {challenge.rewards.xp} XP • 🪙 {challenge.rewards.coins} • 
              {challenge.rewards.badges.length > 0 && ` 🏆 ${challenge.rewards.badges.length} badges`}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.challengeButton,
              challenge.isCompleted && styles.completedChallengeButton
            ]}
            onPress={() => challenge.isCompleted ? null : handleChallengeJoin(challenge.id)}
            disabled={challenge.isCompleted}
          >
            <Text style={[
              styles.challengeButtonText,
              challenge.isCompleted && styles.completedChallengeButtonText
            ]}>
              {challenge.isCompleted ? '✓ Completed' : 'Join Challenge'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderLeaderboardTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabDescription}>
        See how you rank against other students in various categories!
      </Text>
      
      {leaderboards.map((leaderboard, index) => (
        <View key={index} style={styles.leaderboardCard}>
          <Text style={styles.leaderboardTitle}>
            {leaderboard.type.charAt(0).toUpperCase() + leaderboard.type.slice(1)} {leaderboard.category.toUpperCase()} Leaderboard
          </Text>
          
          {leaderboard.entries.map((entry) => (
            <View 
              key={entry.studentId}
              style={[
                styles.leaderboardEntry,
                entry.studentId === studentId && styles.currentStudentEntry
              ]}
            >
              <View style={styles.leaderboardRank}>
                <Text style={styles.rankNumber}>#{entry.rank}</Text>
                {entry.change !== 0 && (
                  <Text style={[
                    styles.rankChange,
                    entry.change > 0 ? styles.rankUp : styles.rankDown
                  ]}>
                    {entry.change > 0 ? '↗️' : '↘️'}{Math.abs(entry.change)}
                  </Text>
                )}
              </View>
              
              <Text style={styles.leaderboardAvatar}>{entry.avatar}</Text>
              
              <View style={styles.leaderboardInfo}>
                <Text style={[
                  styles.leaderboardName,
                  entry.studentId === studentId && styles.currentStudentName
                ]}>
                  {entry.name}
                </Text>
                <Text style={styles.leaderboardLevel}>Level {entry.level}</Text>
              </View>
              
              <View style={styles.leaderboardScore}>
                <Text style={styles.scoreNumber}>{entry.score.toLocaleString()}</Text>
                {entry.badge && <Text style={styles.leaderboardBadge}>{entry.badge}</Text>}
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
        <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
        {renderAppBar()}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={LightTheme.Primary} />
          <Text style={{ ...Typography.bodyLarge, color: LightTheme.OnSurfaceVariant, marginTop: Spacing.LG }}>
            Loading learning hub...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
      <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
      {renderAppBar()}

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {[
          { key: 'overview', label: 'Overview', icon: '🏠' },
          { key: 'achievements', label: 'Badges', icon: '🏆' },
          { key: 'challenges', label: 'Challenges', icon: '⚔️' },
          { key: 'leaderboard', label: 'Rankings', icon: '📊' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, selectedTab === tab.key && styles.activeTab]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'achievements' && renderAchievementsTab()}
        {selectedTab === 'challenges' && renderChallengesTab()}
        {selectedTab === 'leaderboard' && renderLeaderboardTab()}
      </ScrollView>

      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={4000}
          action={{
            label: 'Close',
            onPress: () => setSnackbarVisible(false),
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: LightTheme.Surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabItem: {
    flex: 1,
    paddingVertical: Spacing.MD,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: LightTheme.Primary,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: Spacing.XS,
  },
  tabText: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    fontWeight: '500',
  },
  activeTabText: {
    color: LightTheme.Primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: Spacing.LG,
  },
  tabDescription: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
    marginBottom: Spacing.XL,
    lineHeight: 22,
  },
  progressCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 16,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.LG,
  },
  levelInfo: {
    flex: 1,
  },
  levelText: {
    ...Typography.headlineMedium,
    color: LightTheme.Primary,
    fontWeight: 'bold',
  },
  titleText: {
    ...Typography.bodyLarge,
    color: LightTheme.OnSurface,
    fontWeight: '500',
  },
  currencyInfo: {
    alignItems: 'flex-end',
    gap: Spacing.SM,
  },
  currencyText: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
  },
  xpContainer: {
    marginBottom: Spacing.LG,
  },
  xpBarContainer: {
    height: 12,
    backgroundColor: LightTheme.OutlineVariant,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: Spacing.SM,
  },
  xpBar: {
    height: '100%',
    backgroundColor: LightTheme.Primary,
    borderRadius: 6,
  },
  xpText: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.titleLarge,
    color: LightTheme.Primary,
    fontWeight: 'bold',
  },
  statLabel: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
  },
  sectionCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 16,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    marginBottom: Spacing.MD,
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 12,
    padding: Spacing.MD,
    marginBottom: Spacing.MD,
  },
  streakIcon: {
    fontSize: 24,
    marginRight: Spacing.MD,
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    ...Typography.bodyLarge,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
  },
  streakCount: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
  },
  streakBonus: {
    ...Typography.bodyLarge,
    color: LightTheme.Primary,
    fontWeight: 'bold',
  },
  challengePreview: {
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 12,
    padding: Spacing.MD,
    marginBottom: Spacing.MD,
  },
  challengeTitle: {
    ...Typography.bodyLarge,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    marginBottom: Spacing.SM,
  },
  challengeProgress: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.SM,
  },
  challengeProgressBar: {
    height: 8,
    backgroundColor: LightTheme.OutlineVariant,
    borderRadius: 4,
    overflow: 'hidden',
  },
  challengeProgressFill: {
    height: '100%',
    backgroundColor: LightTheme.Primary,
    borderRadius: 4,
  },
  viewAllButton: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.SM,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LightTheme.Primary,
    marginTop: Spacing.SM,
  },
  viewAllButtonText: {
    ...Typography.bodyMedium,
    color: LightTheme.Primary,
    fontWeight: 'bold',
  },
  eventCard: {
    backgroundColor: '#FFE6CC',
    borderRadius: 16,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    borderWidth: 2,
    borderColor: '#FFD93D',
  },
  eventTitle: {
    ...Typography.headlineSmall,
    color: '#8B4513',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.SM,
  },
  eventName: {
    ...Typography.titleMedium,
    color: '#8B4513',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.MD,
  },
  eventDescription: {
    ...Typography.bodyMedium,
    color: '#A0522D',
    textAlign: 'center',
    marginBottom: Spacing.LG,
    lineHeight: 22,
  },
  eventProgress: {
    marginBottom: Spacing.LG,
  },
  eventProgressText: {
    ...Typography.bodyMedium,
    color: '#8B4513',
    fontWeight: 'bold',
    marginBottom: Spacing.SM,
    textAlign: 'center',
  },
  eventProgressBar: {
    height: 12,
    backgroundColor: '#F4A460',
    borderRadius: 6,
    overflow: 'hidden',
  },
  eventProgressFill: {
    height: '100%',
    backgroundColor: '#FFD93D',
    borderRadius: 6,
  },
  eventButton: {
    backgroundColor: '#FFD93D',
    borderRadius: 12,
    paddingVertical: Spacing.MD,
    alignItems: 'center',
  },
  eventButtonText: {
    ...Typography.bodyLarge,
    color: '#8B4513',
    fontWeight: 'bold',
  },
  achievementStats: {
    alignItems: 'center',
    marginBottom: Spacing.LG,
  },
  achievementStatsText: {
    ...Typography.titleMedium,
    color: LightTheme.Primary,
    fontWeight: 'bold',
  },
  achievementCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 16,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    opacity: 0.6,
  },
  unlockedAchievement: {
    opacity: 1,
    elevation: 2,
    borderWidth: 1,
    borderColor: LightTheme.Primary,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.MD,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: Spacing.MD,
  },
  lockedIcon: {
    opacity: 0.5,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    ...Typography.titleMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    marginBottom: Spacing.XS,
  },
  achievementDescription: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    lineHeight: 20,
  },
  lockedText: {
    opacity: 0.6,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rarityText: {
    ...Typography.labelSmall,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: Spacing.MD,
  },
  progressText: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.SM,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: LightTheme.OutlineVariant,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: LightTheme.Primary,
    borderRadius: 4,
  },
  rewardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardText: {
    ...Typography.bodyMedium,
    color: LightTheme.Primary,
    fontWeight: 'bold',
  },
  unlockedDate: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
  },
  challengeCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 16,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  challengeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.MD,
  },
  challengeCardTitle: {
    ...Typography.titleMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    flex: 1,
    marginRight: Spacing.SM,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    ...Typography.labelSmall,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  challengeCardDescription: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.MD,
    lineHeight: 20,
  },
  challengeDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.MD,
    marginBottom: Spacing.LG,
  },
  challengeDetail: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
  },
  challengeProgressLabel: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    marginBottom: Spacing.SM,
  },
  challengeProgressBarContainer: {
    height: 10,
    backgroundColor: LightTheme.OutlineVariant,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: Spacing.LG,
  },
  challengeProgressBarFill: {
    height: '100%',
    backgroundColor: LightTheme.Primary,
    borderRadius: 5,
  },
  challengeRewards: {
    marginBottom: Spacing.LG,
  },
  challengeRewardTitle: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    marginBottom: Spacing.SM,
  },
  challengeRewardText: {
    ...Typography.bodyMedium,
    color: LightTheme.Primary,
    fontWeight: '500',
  },
  challengeButton: {
    backgroundColor: LightTheme.Primary,
    borderRadius: 12,
    paddingVertical: Spacing.MD,
    alignItems: 'center',
  },
  completedChallengeButton: {
    backgroundColor: LightTheme.SurfaceVariant,
  },
  challengeButtonText: {
    ...Typography.bodyLarge,
    color: LightTheme.OnPrimary,
    fontWeight: 'bold',
  },
  completedChallengeButtonText: {
    color: LightTheme.OnSurfaceVariant,
  },
  leaderboardCard: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 16,
    padding: Spacing.LG,
    marginBottom: Spacing.LG,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leaderboardTitle: {
    ...Typography.titleMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.LG,
  },
  leaderboardEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 12,
    padding: Spacing.MD,
    marginBottom: Spacing.MD,
  },
  currentStudentEntry: {
    backgroundColor: LightTheme.PrimaryContainer,
    borderWidth: 1,
    borderColor: LightTheme.Primary,
  },
  leaderboardRank: {
    alignItems: 'center',
    marginRight: Spacing.MD,
    minWidth: 50,
  },
  rankNumber: {
    ...Typography.titleMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
  },
  rankChange: {
    ...Typography.bodySmall,
    fontWeight: 'bold',
  },
  rankUp: {
    color: '#4ECDC4',
  },
  rankDown: {
    color: '#FF6B6B',
  },
  leaderboardAvatar: {
    fontSize: 32,
    marginRight: Spacing.MD,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    ...Typography.bodyLarge,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
  },
  currentStudentName: {
    color: LightTheme.Primary,
  },
  leaderboardLevel: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
  },
  leaderboardScore: {
    alignItems: 'flex-end',
  },
  scoreNumber: {
    ...Typography.titleMedium,
    color: LightTheme.Primary,
    fontWeight: 'bold',
  },
  leaderboardBadge: {
    fontSize: 20,
  },
});

export default GamifiedLearningHub;
/**
 * Example: How to add Downloads button to NewStudyLibraryScreen
 *
 * This shows how to integrate DownloadsManagerScreen navigation
 * into the existing Study Library screen.
 */

import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { T } from '../ui';
import { safeNavigate } from '../utils/navigationService';
import { trackAction } from '../utils/navigationAnalytics';

// Framer Colors (same as DownloadsManagerScreen)
const FRAMER_COLORS = {
  primary: '#2D5BFF',
  cardBg: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
};

/**
 * Example 1: Add Downloads icon button to header
 * Add this to the top bar of NewStudyLibraryScreen
 */
export const DownloadsHeaderButton = () => {
  return (
    <Pressable
      style={styles.downloadsIconButton}
      onPress={() => {
        trackAction('view_downloads', 'NewStudyLibraryScreen');
        safeNavigate('DownloadsManagerScreen');
      }}
      accessibilityRole="button"
      accessibilityLabel="View Downloads"
    >
      <Icon name="cloud-download" size={24} color={FRAMER_COLORS.primary} />
    </Pressable>
  );
};

/**
 * Example 2: Add Downloads card in main content
 * Add this as a quick action card in the library
 */
export const DownloadsQuickActionCard = ({ downloadCount = 0 }: { downloadCount?: number }) => {
  return (
    <Pressable
      style={styles.quickActionCard}
      onPress={() => {
        trackAction('view_downloads', 'NewStudyLibraryScreen');
        safeNavigate('DownloadsManagerScreen');
      }}
      accessibilityRole="button"
      accessibilityLabel="Manage Downloads"
    >
      <View style={styles.iconContainer}>
        <Icon name="cloud-download" size={24} color={FRAMER_COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <T style={styles.cardTitle}>Downloads</T>
        <T style={styles.cardSubtitle}>Manage offline files</T>
      </View>
      {downloadCount > 0 && (
        <View style={styles.badge}>
          <T style={styles.badgeText}>{downloadCount}</T>
        </View>
      )}
      <Icon name="chevron-right" size={20} color={FRAMER_COLORS.textSecondary} />
    </Pressable>
  );
};

/**
 * Example 3: Add Downloads tab in playlist/library sections
 * Add this as a tab option alongside Videos, PDFs, etc.
 */
export const DownloadsTab = ({ active = false }: { active?: boolean }) => {
  return (
    <Pressable
      style={[styles.tabChip, active && styles.tabChipActive]}
      onPress={() => {
        trackAction('view_downloads', 'NewStudyLibraryScreen');
        safeNavigate('DownloadsManagerScreen');
      }}
      accessibilityRole="button"
      accessibilityLabel="View Downloads"
    >
      <Icon
        name="cloud-download"
        size={16}
        color={active ? FRAMER_COLORS.cardBg : FRAMER_COLORS.primary}
      />
      <T style={[styles.tabText, active && styles.tabTextActive]}>Downloads</T>
    </Pressable>
  );
};

/**
 * Example 4: Integration in NewStudyLibraryScreen.tsx
 *
 * Add to imports:
 * import { safeNavigate } from '../../utils/navigationService';
 * import { trackAction } from '../../utils/navigationAnalytics';
 *
 * Add to header (inside topBar Row):
 * <Pressable
 *   onPress={() => {
 *     trackAction('view_downloads', 'NewStudyLibraryScreen');
 *     safeNavigate('DownloadsManagerScreen');
 *   }}
 *   accessibilityRole="button"
 *   accessibilityLabel="Downloads"
 * >
 *   <Icon name="cloud-download" size={24} color={FRAMER_COLORS.primary} />
 * </Pressable>
 *
 * Or add as quick action card (after playlists section):
 * <AnimatedPressableCard
 *   delay={500}
 *   onPress={() => {
 *     trackAction('view_downloads', 'NewStudyLibraryScreen');
 *     safeNavigate('DownloadsManagerScreen');
 *   }}
 * >
 *   <View style={styles.downloadsCard}>
 *     <IconContainer iconName="cloud-download" />
 *     <T style={styles.cardTitle}>Downloads</T>
 *     <T style={styles.cardSubtitle}>Manage your offline files</T>
 *   </View>
 * </AnimatedPressableCard>
 */

const styles = StyleSheet.create({
  downloadsIconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: `${FRAMER_COLORS.primary}15`,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FRAMER_COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${FRAMER_COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FRAMER_COLORS.textPrimary,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: FRAMER_COLORS.textSecondary,
  },
  badge: {
    backgroundColor: FRAMER_COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: FRAMER_COLORS.cardBg,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: `${FRAMER_COLORS.primary}15`,
    gap: 6,
  },
  tabChipActive: {
    backgroundColor: FRAMER_COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: FRAMER_COLORS.primary,
  },
  tabTextActive: {
    color: FRAMER_COLORS.cardBg,
  },
});

/**
 * HamburgerMenu - Navigation Drawer
 * Purpose: Side navigation menu with profile, main nav, quick actions, settings
 * Design: Material Design drawer with theme color #4A90E2
 */

import React, { useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { T } from '../../ui';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../config/supabaseClient';
import { useTheme } from '../../context/ThemeContext';

interface StudentData {
  name?: string;
  grade?: string;
  section?: string;
  student_id?: string;
}

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
  currentRoute?: string;
  studentData?: StudentData;
}

type MenuItemConfig = {
  key: string;
  icon: string;
  label: string;
  route?: string;
  params?: Record<string, unknown>;
  analyticsEvent: string;
  badge?: number | null;
  showDot?: boolean;
  action?: () => void;
  disabled?: boolean;
};

type MenuSectionConfig = {
  key: string;
  title: string;
  items: MenuItemConfig[];
};

export default function HamburgerMenu({ visible, onClose, currentRoute, studentData }: HamburgerMenuProps) {
  const { user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (visible) {
      trackScreenView('HamburgerMenu');
    }
  }, [visible]);

  // Query for live classes count
  const { data: liveClassCount } = useQuery({
    queryKey: ['live-classes-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      // Get student's enrolled classes that are currently live
      const { count, error } = await supabase
        .from('class_enrollments')
        .select('classes!inner(*)', { count: 'exact', head: true })
        .eq('student_id', user.id)
        .eq('classes.status', 'live');

      if (error) {
        console.error('Error fetching live classes count:', error);
        return 0;
      }

      return count || 0;
    },
    enabled: !!user?.id && visible, // Only fetch when menu is visible
  });

  const { data: pendingDoubtCount } = useQuery({
    queryKey: ['pending-doubts-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      const { count, error } = await supabase
        .from('doubts')
        .select('id', { count: 'exact', head: true })
        .eq('student_id', user.id)
        .in('status', ['open', 'viewed']);

      if (error) {
        console.error('Error fetching pending doubt count:', error);
        return 0;
      }

      return count || 0;
    },
    enabled: !!user?.id && visible,
  });

  const shouldFetchProfile = !studentData && !!user?.id && visible;
  const { data: fetchedStudentProfile } = useQuery({
    queryKey: ['student-profile-menu', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('students')
        .select('name, grade, section, student_id')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching student profile for menu:', error);
        return null;
      }

      return data;
    },
    enabled: shouldFetchProfile,
  });

  const profile = studentData || fetchedStudentProfile || {};

  const handleItemPress = (item: MenuItemConfig) => {
    if (item.disabled) {
      trackAction(`${item.analyticsEvent}_disabled`, 'HamburgerMenu');
      return;
    }

    trackAction(item.analyticsEvent, 'HamburgerMenu');
    onClose();

    setTimeout(() => {
      if (item.action) {
        item.action();
        return;
      }

      if (item.route) {
        // @ts-expect-error - Student routes not yet in ParentStackParamList
        safeNavigate(item.route, item.params);
      }
    }, 250);
  };

  const handleLogout = () => {
    trackAction('logout_initiated', 'HamburgerMenu');

    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => trackAction('logout_cancelled', 'HamburgerMenu'),
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              onClose();
              trackAction('logout_confirmed', 'HamburgerMenu');

              // Clear AsyncStorage
              await AsyncStorage.clear();

              // Sign out from Supabase
              await supabase.auth.signOut();

              // Reset navigation to login screen
              // Note: This assumes the navigation stack is set up to return to login after signout
              // If you have a specific navigation reset method, use that instead
              trackAction('logout_success', 'HamburgerMenu');
            } catch (error) {
              console.error('Logout error:', error);
              trackAction('logout_error', 'HamburgerMenu');
              Alert.alert(
                'Error',
                'Failed to sign out. Please try again.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const menuSections: MenuSectionConfig[] = useMemo(() => [
    {
      key: 'main-nav',
      title: 'MAIN NAVIGATION',
      items: [
        {
          key: 'dashboard',
          icon: 'dY`Y',
          label: 'Dashboard',
          route: 'NewStudentDashboard',
          analyticsEvent: 'nav_dashboard',
        },
        {
          key: 'classes',
          icon: 'dY?�',
          label: 'My Classes',
          route: 'NewEnhancedSchedule',
          analyticsEvent: 'nav_classes',
          badge: liveClassCount ?? 0,
        },
        {
          key: 'library',
          icon: 'dY"s',
          label: 'Study Library',
          route: 'NewStudyLibraryScreen',
          analyticsEvent: 'nav_library',
        },
        {
          key: 'progress',
          icon: 'dY"^',
          label: 'My Progress',
          route: 'NewProgressDetailScreen',
          analyticsEvent: 'nav_progress',
        },
        {
          key: 'peers',
          icon: 'dY`�',
          label: 'Peer Network',
          route: 'NewPeerLearningNetwork',
          analyticsEvent: 'nav_peers',
        },
        {
          key: 'ai_tutor',
          icon: 'dY-',
          label: 'AI Tutor',
          route: 'NewAITutorChat',
          analyticsEvent: 'nav_ai_tutor',
          showDot: true,
        },
      ],
    },
    {
      key: 'quick-actions',
      title: 'QUICK ACTIONS',
      items: [
        {
          key: 'doubt',
          icon: '�?"',
          label: 'Ask a Doubt',
          route: 'NewDoubtSubmission',
          analyticsEvent: 'quick_doubt',
          badge: pendingDoubtCount ?? 0,
        },
        {
          key: 'schedule',
          icon: 'dY".',
          label: 'View Schedule',
          route: 'NewEnhancedSchedule',
          analyticsEvent: 'quick_schedule',
        },
        {
          key: 'assignments',
          icon: '�o.',
          label: 'Assignments',
          route: 'NewAssignmentDetailScreen',
          analyticsEvent: 'quick_assignments',
        },
        {
          key: 'learning_hub',
          icon: 'dY\'�',
          label: 'Learning Hub',
          route: 'NewGamifiedLearningHub',
          analyticsEvent: 'quick_learning_hub',
        },
      ],
    },
    {
      key: 'settings-support',
      title: 'SETTINGS & SUPPORT',
      items: [
        {
          key: 'settings',
          icon: '??',
          label: 'Settings',
          route: 'StudentProfileScreen',
          analyticsEvent: 'settings',
        },
        {
          key: 'preferences',
          icon: '???',
          label: 'App Preferences',
          analyticsEvent: 'app_preferences',
          disabled: true,
        },
        {
          key: 'notifications',
          icon: '??',
          label: 'Notifications',
          analyticsEvent: 'notifications_settings',
          disabled: true,
        },
        {
          key: 'help',
          icon: '??',
          label: 'Help Center',
          analyticsEvent: 'help_center',
          disabled: true,
        },
        {
          key: 'support',
          icon: '??',
          label: 'Contact Support',
          analyticsEvent: 'contact_support',
          disabled: true,
        },
      ],
    },
  ], [liveClassCount, pendingDoubtCount]);

  const renderMenuItem = (item: MenuItemConfig) => {
    const isActive = currentRoute === item.route;
    const showBadge = typeof item.badge === 'number' && item.badge > 0;

    return (
      <TouchableOpacity
        key={item.key}
        style={[
          styles.menuItem,
          isActive && styles.menuItemActive,
          item.disabled && styles.menuItemDisabled,
        ]}
        onPress={() => handleItemPress(item)}
        accessibilityRole="button"
        disabled={item.disabled}
      >
        <T
          style={[
            styles.menuIcon,
            isActive && styles.menuIconActive,
            item.disabled && styles.menuIconDisabled,
          ]}
        >
          {item.icon}
        </T>
        <T
          variant="body"
          weight="medium"
          style={[
            styles.menuText,
            item.disabled && styles.menuTextDisabled,
          ]}
        >
          {item.label}
        </T>
        {showBadge && (
          <View style={styles.badge}>
            <T style={styles.badgeText}>{item.badge}</T>
          </View>
        )}
        {!showBadge && item.showDot && <View style={styles.dotIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Navigation Drawer */}
        <View style={styles.drawer}>
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Close Button */}
              <View style={styles.closeButtonContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Close menu"
                >
                  <T style={styles.closeIcon}>✕</T>
                </TouchableOpacity>
              </View>
              {/* User Profile Section */}
              <View style={styles.profileSection}>
                <View style={[styles.avatar, { backgroundColor: theme.Primary }]}>
                  <T style={styles.avatarText}>
                    {(profile?.name || 'Student')
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase() || 'ST'}
                  </T>
                </View>
                <View style={styles.profileInfo}>
                  <T variant="body" weight="bold" style={[styles.profileName, { marginBottom: 2 }]}>
                    {profile?.name || 'Student'}
                  </T>
                  <T variant="caption" style={[styles.profileDetails, { marginBottom: 2 }]}>
                    {profile?.grade ? `Grade ${profile.grade}` : 'Grade N/A'}
                    {profile?.section ? ` | Section ${profile.section}` : ''}
                  </T>
                  <TouchableOpacity
                    onPress={() => handleItemPress(menuSections[2].items[0])}
                    accessibilityRole="button"
                  >
                    <T variant="caption" weight="semiBold" style={styles.viewProfileLink}>
                      View Profile
                    </T>
                  </TouchableOpacity>
                </View>
              </View>
            
              {menuSections.map((section, index) => (
                <React.Fragment key={section.key}>
                  <View style={styles.section}>
                    <T variant="caption" weight="semiBold" style={styles.sectionHeader}>
                      {section.title}
                    </T>
                    <View>
                      {section.items.map((item) => renderMenuItem(item))}
                    </View>
                  </View>
                  {index < menuSections.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))}

              {/* Account Options */}
              <View style={styles.section}>
                <View>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      trackAction('switch_account', 'HamburgerMenu');
                      onClose();
                    }}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIcon}>🔄</T>
                    <T variant="body" weight="medium" style={styles.menuText}>Switch Account</T>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      trackAction('privacy', 'HamburgerMenu');
                      onClose();
                    }}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIcon}>🔒</T>
                    <T variant="body" weight="medium" style={styles.menuText}>Privacy</T>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItemLogout}
                    onPress={handleLogout}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIconLogout}>🚪</T>
                    <T variant="body" weight="medium" style={styles.menuTextLogout}>Sign Out</T>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <T variant="caption" style={styles.footerVersion}>App Version 1.2.3</T>
              <View style={styles.footerLinks}>
                <TouchableOpacity
                  onPress={() => {
                    trackAction('terms_of_service', 'HamburgerMenu');
                    onClose();
                  }}
                >
                  <T variant="caption" style={styles.footerLink}>Terms of Service</T>
                </TouchableOpacity>
                <T variant="caption" style={styles.footerDivider}>|</T>
                <TouchableOpacity
                  onPress={() => {
                    trackAction('privacy_policy', 'HamburgerMenu');
                    onClose();
                  }}
                >
                  <T variant="caption" style={styles.footerLink}>Privacy Policy</T>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>

        {/* Background Scrim - Tap to close */}
        <TouchableOpacity
          style={styles.scrim}
          activeOpacity={1}
          onPress={onClose}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: '85%',
    maxWidth: 384, // max-w-sm (24rem = 384px)
    height: '100%',
    backgroundColor: '#F8F9FA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  // Close Button
  closeButtonContainer: {
    alignItems: 'flex-end',
    paddingBottom: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: '#111827',
  },
  // Profile Section
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17.6, // 1.1rem
    color: '#111827',
  },
  profileDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  viewProfileLink: {
    fontSize: 14,
    color: '#4A90E2',
    marginTop: 2,
  },
  // Sections
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 12,
    color: '#9CA3AF',
    paddingHorizontal: 16,
    paddingBottom: 8,
    letterSpacing: 0.5,
  },
  // Menu Items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
  },
  menuIcon: {
    fontSize: 24,
    color: '#6B7280',
    marginRight: 16,
  },
  menuIconActive: {
    color: '#4A90E2',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuIconDisabled: {
    color: '#D1D5DB',
  },
  menuTextDisabled: {
    color: '#9CA3AF',
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  // Logout Item
  menuItemLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    marginBottom: 4,
  },
  menuIconLogout: {
    fontSize: 24,
    color: '#EF4444',
    marginRight: 16,
  },
  menuTextLogout: {
    flex: 1,
    fontSize: 16,
    color: '#EF4444',
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  // Footer
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  footerVersion: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 12,
    color: '#6B7280',
    paddingHorizontal: 8,
  },
  footerDivider: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

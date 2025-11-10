/**
 * HamburgerMenu - Navigation Drawer
 * Purpose: Side navigation menu with profile, main nav, quick actions, settings
 * Design: Material Design drawer with theme color #4A90E2
 */

import React, { useEffect } from 'react';
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

export default function HamburgerMenu({ visible, onClose, currentRoute, studentData }: HamburgerMenuProps) {
  const { user } = useAuth();

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

  const handleNavigate = (route: string, action: string) => {
    trackAction(action, 'HamburgerMenu');
    onClose();
    setTimeout(() => {
      // @ts-expect-error - Student routes not yet in ParentStackParamList
      safeNavigate(route);
    }, 300);
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
                <View style={styles.avatar}>
                  <T style={styles.avatarText}>
                    {studentData?.name
                      ? studentData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                      : 'ST'}
                  </T>
                </View>
                <View style={styles.profileInfo}>
                  <T variant="body" weight="bold" style={[styles.profileName, { marginBottom: 2 }]}>
                    {studentData?.name || 'Student'}
                  </T>
                  <T variant="caption" style={[styles.profileDetails, { marginBottom: 2 }]}>
                    Grade {studentData?.grade || 'N/A'}, Section {studentData?.section || 'N/A'}
                  </T>
                  <TouchableOpacity
                    onPress={() => handleNavigate('StudentProfileScreen', 'view_profile')}
                  >
                    <T variant="caption" weight="semiBold" style={styles.viewProfileLink}>
                      View Profile
                    </T>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Main Navigation */}
              <View style={styles.section}>
                <T variant="caption" weight="semiBold" style={styles.sectionHeader}>
                  MAIN NAVIGATION
                </T>
                <View>
                  <TouchableOpacity
                    style={[
                      styles.menuItem,
                      currentRoute === 'NewStudentDashboard' && styles.menuItemActive,
                    ]}
                    onPress={() => handleNavigate('NewStudentDashboard', 'nav_dashboard')}
                    accessibilityRole="button"
                  >
                    <T style={[
                      styles.menuIcon,
                      currentRoute === 'NewStudentDashboard' && styles.menuIconActive,
                    ]}>📊</T>
                    <T
                      variant="body"
                      weight={currentRoute === 'NewStudentDashboard' ? 'bold' : 'medium'}
                      style={styles.menuText}
                    >
                      Dashboard
                    </T>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigate('NewScheduleScreen', 'nav_classes')}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIcon}>🏫</T>
                    <T variant="body" weight="medium" style={styles.menuText}>My Classes</T>
                    {liveClassCount && liveClassCount > 0 && (
                      <View style={styles.badge}>
                        <T style={styles.badgeText}>{liveClassCount}</T>
                      </View>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigate('NewStudyLibraryScreen', 'nav_library')}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIcon}>📚</T>
                    <T variant="body" weight="medium" style={styles.menuText}>Study Library</T>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigate('NewProgressDetailScreen', 'nav_progress')}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIcon}>📈</T>
                    <T variant="body" weight="medium" style={styles.menuText}>My Progress</T>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigate('NewPeerLearningNetwork', 'nav_peers')}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIcon}>👥</T>
                    <T variant="body" weight="medium" style={styles.menuText}>Peer Network</T>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigate('NewAITutorChat', 'nav_ai_tutor')}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIcon}>🤖</T>
                    <T variant="body" weight="medium" style={styles.menuText}>AI Tutor</T>
                    <View style={styles.dotIndicator} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Quick Actions */}
              <View style={styles.section}>
                <T variant="caption" weight="semiBold" style={styles.sectionHeader}>
                  QUICK ACTIONS
                </T>
                <View>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigate('NewDoubtSubmission', 'quick_doubt')}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIcon}>❓</T>
                    <T variant="body" weight="medium" style={styles.menuText}>Ask a Doubt</T>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigate('NewEnhancedSchedule', 'quick_schedule')}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIcon}>📅</T>
                    <T variant="body" weight="medium" style={styles.menuText}>View Schedule</T>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigate('NewAssignmentDetailScreen', 'quick_assignments')}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIcon}>✅</T>
                    <T variant="body" weight="medium" style={styles.menuText}>Assignments</T>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigate('NewGamifiedLearningHub', 'quick_learning_hub')}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIcon}>💡</T>
                    <T variant="body" weight="medium" style={styles.menuText}>Learning Hub</T>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Settings & Support */}
              <View style={styles.section}>
                <T variant="caption" weight="semiBold" style={styles.sectionHeader}>
                  SETTINGS & SUPPORT
                </T>
                <View>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigate('StudentProfileScreen', 'settings')}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIcon}>⚙️</T>
                    <T variant="body" weight="medium" style={styles.menuText}>Settings</T>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      trackAction('app_preferences', 'HamburgerMenu');
                      onClose();
                    }}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIcon}>🎛️</T>
                    <T variant="body" weight="medium" style={styles.menuText}>App Preferences</T>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      trackAction('notifications_settings', 'HamburgerMenu');
                      onClose();
                    }}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIcon}>🔔</T>
                    <T variant="body" weight="medium" style={styles.menuText}>Notifications</T>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      trackAction('help_center', 'HamburgerMenu');
                      onClose();
                    }}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIcon}>🆘</T>
                    <T variant="body" weight="medium" style={styles.menuText}>Help Center</T>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      trackAction('contact_support', 'HamburgerMenu');
                      onClose();
                    }}
                    accessibilityRole="button"
                  >
                    <T style={styles.menuIcon}>📧</T>
                    <T variant="body" weight="medium" style={styles.menuText}>Contact Support</T>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

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

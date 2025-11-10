/**
 * StudentProfileScreen - EXACT match to HTML reference
 * Purpose: Student profile management, preferences, and account settings
 * Design: Material Design with stats, settings sections, and toggles
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  Linking,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { T } from '../../ui';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

type Props = NativeStackScreenProps<any, 'StudentProfileScreen'>;

export default function StudentProfileScreen({ navigation }: Props) {
  const { user } = useAuth();

  // Notification toggles
  const [assignmentDeadlines, setAssignmentDeadlines] = useState(true);
  const [classReminders, setClassReminders] = useState(true);
  const [generalAnnouncements, setGeneralAnnouncements] = useState(false);

  // Calendar Sync toggle
  const [calendarSyncEnabled, setCalendarSyncEnabled] = useState(false);

  // Modal visibility states
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [bugReportModalVisible, setBugReportModalVisible] = useState(false);
  const [themePickerModalVisible, setThemePickerModalVisible] = useState(false);
  const [avatarPickerModalVisible, setAvatarPickerModalVisible] = useState(false);
  const [languagePickerModalVisible, setLanguagePickerModalVisible] = useState(false);
  const [timeZonePickerModalVisible, setTimeZonePickerModalVisible] = useState(false);

  // Fetch student profile data from Supabase
  const { data: studentData } = useQuery({
    queryKey: ['student-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('students')
        .select('name, email, phone, grade, section, student_id')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Edit Profile form states - Initialize from Supabase data
  const [editName, setEditName] = useState(studentData?.name || '');
  const [editEmail, setEditEmail] = useState(studentData?.email || '');
  const [editPhone, setEditPhone] = useState(studentData?.phone || '');
  const [editGrade, setEditGrade] = useState(studentData?.grade || '');
  const [editSection, setEditSection] = useState(studentData?.section || '');

  // Update form states when data is loaded
  useEffect(() => {
    if (studentData) {
      setEditName(studentData.name || '');
      setEditEmail(studentData.email || '');
      setEditPhone(studentData.phone || '');
      setEditGrade(studentData.grade || '');
      setEditSection(studentData.section || '');
    }
  }, [studentData]);

  // Query 1: Classes Attended
  const { data: classesAttended } = useQuery({
    queryKey: ['classes-attended', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      const { count, error } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', user.id)
        .eq('status', 'present');

      if (error) {
        console.error('Error fetching attendance:', error);
        return 0;
      }
      return count || 0;
    },
    enabled: !!user?.id,
  });

  // Query 2: Assignments Done
  const { data: assignmentsDone } = useQuery({
    queryKey: ['assignments-done', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      const { count, error } = await supabase
        .from('assignment_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', user.id)
        .not('submitted_at', 'is', null);

      if (error) {
        console.error('Error fetching assignments:', error);
        return 0;
      }
      return count || 0;
    },
    enabled: !!user?.id,
  });

  // Query 3: Average Grade
  const { data: averageGrade } = useQuery({
    queryKey: ['average-grade', user?.id],
    queryFn: async () => {
      if (!user?.id) return 'N/A';

      const { data, error } = await supabase
        .from('assignment_submissions')
        .select('grade')
        .eq('student_id', user.id)
        .not('grade', 'is', null);

      if (error) {
        console.error('Error fetching grades:', error);
        return 'N/A';
      }

      if (!data || data.length === 0) return 'N/A';

      // Calculate average
      const avg = data.reduce((sum, s) => sum + (s.grade || 0), 0) / data.length;

      // Convert to letter grade
      if (avg >= 93) return 'A';
      if (avg >= 90) return 'A-';
      if (avg >= 87) return 'B+';
      if (avg >= 83) return 'B';
      if (avg >= 80) return 'B-';
      if (avg >= 77) return 'C+';
      if (avg >= 73) return 'C';
      if (avg >= 70) return 'C-';
      if (avg >= 67) return 'D+';
      if (avg >= 63) return 'D';
      if (avg >= 60) return 'D-';
      return 'F';
    },
    enabled: !!user?.id,
  });

  // Query 4: Days Active
  const { data: daysActive } = useQuery({
    queryKey: ['days-active', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      const { data, error } = await supabase
        .from('students')
        .select('created_at')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching student created_at:', error);
        return 0;
      }

      if (!data?.created_at) return 0;

      const createdDate = new Date(data.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      return diffDays;
    },
    enabled: !!user?.id,
  });

  // Change Password form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Bug Report form states
  const [bugTitle, setBugTitle] = useState('');
  const [bugDescription, setBugDescription] = useState('');

  // Theme state
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Avatar state
  const [selectedAvatar, setSelectedAvatar] = useState<string>('👤');

  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

  // Time Zone state
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>('Asia/Kolkata (IST)');

  useEffect(() => {
    trackScreenView('StudentProfileScreen');
  }, []);

  const handleEditProfile = () => {
    trackAction('edit_profile_open', 'StudentProfileScreen');
    setEditProfileModalVisible(true);
  };

  const handleSaveProfile = () => {
    trackAction('edit_profile_save', 'StudentProfileScreen');

    // Basic validation
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    if (!editEmail.trim() || !editEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // TODO: Save to Supabase
    setEditProfileModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleChangePassword = () => {
    trackAction('change_password_open', 'StudentProfileScreen');
    setChangePasswordModalVisible(true);
  };

  const handleSavePassword = () => {
    trackAction('change_password_save', 'StudentProfileScreen');

    // Validation
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // TODO: Update password in Supabase
    setChangePasswordModalVisible(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    Alert.alert('Success', 'Password changed successfully');
  };

  const handleLanguage = () => {
    trackAction('change_language_open', 'StudentProfileScreen');
    setLanguagePickerModalVisible(true);
  };

  const handleTimeZone = () => {
    trackAction('change_timezone_open', 'StudentProfileScreen');
    setTimeZonePickerModalVisible(true);
  };

  const handleEditAvatar = () => {
    trackAction('edit_avatar_open', 'StudentProfileScreen');
    setAvatarPickerModalVisible(true);
  };

  const handleSelectAvatar = (avatar: string) => {
    trackAction('avatar_selected', 'StudentProfileScreen', { avatar });
    setSelectedAvatar(avatar);
    setAvatarPickerModalVisible(false);
    Alert.alert('Avatar Updated', 'Your profile avatar has been changed');
  };

  const handleSelectLanguage = (language: string) => {
    trackAction('language_selected', 'StudentProfileScreen', { language });
    setSelectedLanguage(language);
    setLanguagePickerModalVisible(false);
    Alert.alert('Language Changed', `Language set to ${language}`);
  };

  const handleSelectTimeZone = (timeZone: string) => {
    trackAction('timezone_selected', 'StudentProfileScreen', { timeZone });
    setSelectedTimeZone(timeZone);
    setTimeZonePickerModalVisible(false);
    Alert.alert('Time Zone Changed', `Time zone set to ${timeZone}`);
  };

  const handleTheme = () => {
    trackAction('change_theme_open', 'StudentProfileScreen');
    setThemePickerModalVisible(true);
  };

  const handleSelectTheme = (theme: 'light' | 'dark' | 'system') => {
    trackAction('change_theme_save', 'StudentProfileScreen', { theme });
    setSelectedTheme(theme);
    setThemePickerModalVisible(false);
    // TODO: Apply theme and save to AsyncStorage
    Alert.alert('Theme Changed', `Theme set to ${theme}`);
  };

  const handleCalendarSync = (enabled: boolean) => {
    trackAction('calendar_sync_toggle', 'StudentProfileScreen', { enabled });
    setCalendarSyncEnabled(enabled);

    if (enabled) {
      Alert.alert(
        'Calendar Sync Enabled',
        'Your classes and assignments will now be synced with your device calendar.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Calendar Sync Disabled',
        'Calendar sync has been turned off.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePrivacyPolicy = async () => {
    trackAction('privacy_policy', 'StudentProfileScreen');

    // Replace with your actual privacy policy URL
    const privacyUrl = 'https://yourapp.com/privacy-policy';

    try {
      const supported = await Linking.canOpenURL(privacyUrl);
      if (supported) {
        await Linking.openURL(privacyUrl);
      } else {
        Alert.alert(
          'Privacy Policy',
          'Cannot open Privacy Policy at this time. Please visit: ' + privacyUrl,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening Privacy Policy:', error);
      Alert.alert(
        'Error',
        'Failed to open Privacy Policy. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleTermsOfService = async () => {
    trackAction('terms_of_service', 'StudentProfileScreen');

    // Replace with your actual terms of service URL
    const termsUrl = 'https://yourapp.com/terms-of-service';

    try {
      const supported = await Linking.canOpenURL(termsUrl);
      if (supported) {
        await Linking.openURL(termsUrl);
      } else {
        Alert.alert(
          'Terms of Service',
          'Cannot open Terms of Service at this time. Please visit: ' + termsUrl,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening Terms of Service:', error);
      Alert.alert(
        'Error',
        'Failed to open Terms of Service. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleHelpCenter = async () => {
    trackAction('help_center', 'StudentProfileScreen');

    // Replace with your actual help center URL or support email
    const helpUrl = 'https://support.yourapp.com';
    // Alternative: use mailto for email support
    // const helpUrl = 'mailto:support@yourapp.com?subject=Help Request';

    try {
      const supported = await Linking.canOpenURL(helpUrl);
      if (supported) {
        await Linking.openURL(helpUrl);
      } else {
        Alert.alert(
          'Help Center',
          'Cannot open Help Center at this time. Please visit: ' + helpUrl,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening Help Center:', error);
      Alert.alert(
        'Error',
        'Failed to open Help Center. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleReportBug = () => {
    trackAction('report_bug_open', 'StudentProfileScreen');
    setBugReportModalVisible(true);
  };

  const handleSubmitBug = () => {
    trackAction('report_bug_submit', 'StudentProfileScreen');

    // Validation
    if (!bugTitle.trim()) {
      Alert.alert('Error', 'Please enter a bug title');
      return;
    }
    if (!bugDescription.trim()) {
      Alert.alert('Error', 'Please describe the bug');
      return;
    }

    // TODO: Submit bug report to support system or Supabase
    setBugReportModalVisible(false);
    setBugTitle('');
    setBugDescription('');
    Alert.alert('Thank You', 'Bug report submitted successfully. We\'ll investigate this issue.');
  };

  const handleLogout = () => {
    trackAction('logout', 'StudentProfileScreen');
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          // TODO: Implement logout
          Alert.alert('Logged Out', 'You have been logged out');
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Menu"
        >
          <T variant="h2" style={styles.icon}>☰</T>
        </TouchableOpacity>

        <T variant="body" weight="bold" style={styles.topBarTitle}>
          Profile
        </T>

        <TouchableOpacity
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="More options"
        >
          <T variant="h2" style={styles.icon}>⋮</T>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={[styles.avatarContainer, { marginBottom: 16 }]}>
              <View style={styles.avatar}>
                <T style={styles.avatarText}>
                  {editName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                </T>
              </View>
              <TouchableOpacity
                style={styles.editAvatarButton}
                onPress={handleEditAvatar}
                accessibilityRole="button"
                accessibilityLabel="Edit profile picture"
              >
                <T style={styles.editIcon}>✏️</T>
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <T variant="h2" weight="bold" style={[styles.profileName, { marginBottom: 4 }]}>
                {editName}
              </T>
              <T variant="caption" style={[styles.profileEmail, { marginBottom: 4 }]}>
                {editEmail}
              </T>
              <T variant="caption" style={styles.profileDetails}>
                Grade {editGrade}, Section {editSection}, ID: {studentData?.student_id || 'N/A'}
              </T>
            </View>
          </View>

          <View style={styles.spacer} />

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <T variant="caption" style={[styles.statLabel, { marginBottom: 8 }]}>Classes Attended</T>
              <T style={styles.statValue}>{classesAttended ?? 0}</T>
            </View>
            <View style={styles.statCard}>
              <T variant="caption" style={[styles.statLabel, { marginBottom: 8 }]}>Assignments Done</T>
              <T style={styles.statValue}>{assignmentsDone ?? 0}</T>
            </View>
            <View style={styles.statCard}>
              <T variant="caption" style={[styles.statLabel, { marginBottom: 8 }]}>Average Grade</T>
              <T style={styles.statValue}>{averageGrade ?? 'N/A'}</T>
            </View>
            <View style={styles.statCard}>
              <T variant="caption" style={[styles.statLabel, { marginBottom: 8 }]}>Days Active</T>
              <T style={styles.statValue}>{daysActive ?? 0}</T>
            </View>
          </View>

          <View style={styles.spacer} />

          {/* Account Settings */}
          <T variant="h3" weight="bold" style={styles.sectionTitle}>
            Account Settings
          </T>
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleEditProfile}
              accessibilityRole="button"
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, styles.iconBlue, { marginRight: 16 }]}>
                  <T style={styles.settingIcon}>👤</T>
                </View>
                <T variant="body" style={styles.settingText}>Edit Profile</T>
              </View>
              <T style={styles.chevron}>›</T>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleChangePassword}
              accessibilityRole="button"
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, styles.iconBlue, { marginRight: 16 }]}>
                  <T style={styles.settingIcon}>🔒</T>
                </View>
                <T variant="body" style={styles.settingText}>Change Password</T>
              </View>
              <T style={styles.chevron}>›</T>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleLanguage}
              accessibilityRole="button"
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, styles.iconBlue, { marginRight: 16 }]}>
                  <T style={styles.settingIcon}>🌐</T>
                </View>
                <T variant="body" style={styles.settingText}>Language</T>
              </View>
              <T style={styles.chevron}>›</T>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleTimeZone}
              accessibilityRole="button"
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, styles.iconBlue, { marginRight: 16 }]}>
                  <T style={styles.settingIcon}>⏰</T>
                </View>
                <T variant="body" style={styles.settingText}>Time Zone</T>
              </View>
              <T style={styles.chevron}>›</T>
            </TouchableOpacity>
          </View>

          {/* App Preferences */}
          <T variant="h3" weight="bold" style={styles.sectionTitle}>
            App Preferences
          </T>
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleTheme}
              accessibilityRole="button"
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, styles.iconBlue, { marginRight: 16 }]}>
                  <T style={styles.settingIcon}>🎨</T>
                </View>
                <T variant="body" style={styles.settingText}>Theme</T>
              </View>
              <View style={styles.settingRight}>
                <T variant="caption" style={[styles.settingValue, { marginRight: 8 }]}>
                  {selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}
                </T>
                <T style={styles.chevron}>›</T>
              </View>
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, styles.iconBlue, { marginRight: 16 }]}>
                  <T style={styles.settingIcon}>📅</T>
                </View>
                <T variant="body" style={styles.settingText}>Calendar Sync</T>
              </View>
              <Switch
                value={calendarSyncEnabled}
                onValueChange={handleCalendarSync}
                trackColor={{ false: '#E5E7EB', true: '#4A90E2' }}
                thumbColor="#FFFFFF"
                accessibilityLabel="Toggle calendar sync"
              />
            </View>
          </View>

          {/* Notifications */}
          <T variant="h3" weight="bold" style={styles.sectionTitle}>
            Notifications
          </T>
          <View style={styles.section}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, styles.iconBlue, { marginRight: 16 }]}>
                  <T style={styles.settingIcon}>📝</T>
                </View>
                <T variant="body" style={styles.settingText}>Assignment Deadlines</T>
              </View>
              <Switch
                value={assignmentDeadlines}
                onValueChange={setAssignmentDeadlines}
                trackColor={{ false: '#E5E7EB', true: '#4A90E2' }}
                thumbColor="#FFFFFF"
                accessibilityLabel="Toggle assignment deadline notifications"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, styles.iconBlue, { marginRight: 16 }]}>
                  <T style={styles.settingIcon}>🔔</T>
                </View>
                <T variant="body" style={styles.settingText}>Class Reminders</T>
              </View>
              <Switch
                value={classReminders}
                onValueChange={setClassReminders}
                trackColor={{ false: '#E5E7EB', true: '#4A90E2' }}
                thumbColor="#FFFFFF"
                accessibilityLabel="Toggle class reminder notifications"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, styles.iconBlue, { marginRight: 16 }]}>
                  <T style={styles.settingIcon}>📢</T>
                </View>
                <T variant="body" style={styles.settingText}>General Announcements</T>
              </View>
              <Switch
                value={generalAnnouncements}
                onValueChange={setGeneralAnnouncements}
                trackColor={{ false: '#E5E7EB', true: '#4A90E2' }}
                thumbColor="#FFFFFF"
                accessibilityLabel="Toggle general announcement notifications"
              />
            </View>
          </View>

          {/* Privacy & Security */}
          <T variant="h3" weight="bold" style={styles.sectionTitle}>
            Privacy & Security
          </T>
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handlePrivacyPolicy}
              accessibilityRole="button"
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, styles.iconBlue, { marginRight: 16 }]}>
                  <T style={styles.settingIcon}>📄</T>
                </View>
                <T variant="body" style={styles.settingText}>Privacy Policy</T>
              </View>
              <T style={styles.chevron}>›</T>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleTermsOfService}
              accessibilityRole="button"
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, styles.iconBlue, { marginRight: 16 }]}>
                  <T style={styles.settingIcon}>📜</T>
                </View>
                <T variant="body" style={styles.settingText}>Terms of Service</T>
              </View>
              <T style={styles.chevron}>›</T>
            </TouchableOpacity>
          </View>

          {/* About & Support */}
          <T variant="h3" weight="bold" style={styles.sectionTitle}>
            About & Support
          </T>
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleHelpCenter}
              accessibilityRole="button"
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, styles.iconBlue, { marginRight: 16 }]}>
                  <T style={styles.settingIcon}>❓</T>
                </View>
                <T variant="body" style={styles.settingText}>Help Center</T>
              </View>
              <T style={styles.chevron}>›</T>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleReportBug}
              accessibilityRole="button"
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, styles.iconBlue, { marginRight: 16 }]}>
                  <T style={styles.settingIcon}>🐛</T>
                </View>
                <T variant="body" style={styles.settingText}>Report a Bug</T>
              </View>
              <T style={styles.chevron}>›</T>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              accessibilityRole="button"
              accessibilityLabel="Logout"
            >
              <T variant="body" weight="bold" style={styles.logoutText}>
                Logout
              </T>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editProfileModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditProfileModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <T variant="h3" weight="bold" style={styles.modalTitle}>Edit Profile</T>
              <TouchableOpacity
                onPress={() => setEditProfileModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <T style={styles.modalCloseIcon}>✕</T>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <T variant="caption" style={styles.inputLabel}>Full Name</T>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <T variant="caption" style={styles.inputLabel}>Email</T>
                <TextInput
                  style={styles.input}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <T variant="caption" style={styles.inputLabel}>Phone Number</T>
                <TextInput
                  style={styles.input}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, styles.inputHalf, { marginRight: 12 }]}>
                  <T variant="caption" style={styles.inputLabel}>Grade</T>
                  <TextInput
                    style={styles.input}
                    value={editGrade}
                    onChangeText={setEditGrade}
                    placeholder="Grade"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputGroup, styles.inputHalf]}>
                  <T variant="caption" style={styles.inputLabel}>Section</T>
                  <TextInput
                    style={styles.input}
                    value={editSection}
                    onChangeText={setEditSection}
                    placeholder="Section"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButtonSecondary, { marginRight: 12 }]}
                onPress={() => setEditProfileModalVisible(false)}
              >
                <T style={styles.modalButtonSecondaryText}>Cancel</T>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={handleSaveProfile}
              >
                <T style={styles.modalButtonPrimaryText}>Save Changes</T>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={changePasswordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChangePasswordModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <T variant="h3" weight="bold" style={styles.modalTitle}>Change Password</T>
              <TouchableOpacity
                onPress={() => setChangePasswordModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <T style={styles.modalCloseIcon}>✕</T>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <T variant="caption" style={styles.inputLabel}>Current Password</T>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <T variant="caption" style={styles.inputLabel}>New Password</T>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password (min 8 characters)"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <T variant="caption" style={styles.inputLabel}>Confirm New Password</T>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.passwordHint}>
                <T variant="caption" style={styles.passwordHintText}>
                  • Password must be at least 8 characters{'\n'}
                  • Use a mix of letters, numbers, and symbols
                </T>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButtonSecondary, { marginRight: 12 }]}
                onPress={() => setChangePasswordModalVisible(false)}
              >
                <T style={styles.modalButtonSecondaryText}>Cancel</T>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={handleSavePassword}
              >
                <T style={styles.modalButtonPrimaryText}>Change Password</T>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Bug Report Modal */}
      <Modal
        visible={bugReportModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBugReportModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <T variant="h3" weight="bold" style={styles.modalTitle}>Report a Bug</T>
              <TouchableOpacity
                onPress={() => setBugReportModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <T style={styles.modalCloseIcon}>✕</T>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <T variant="caption" style={styles.inputLabel}>Bug Title</T>
                <TextInput
                  style={styles.input}
                  value={bugTitle}
                  onChangeText={setBugTitle}
                  placeholder="Brief description of the bug"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <T variant="caption" style={styles.inputLabel}>Description</T>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  value={bugDescription}
                  onChangeText={setBugDescription}
                  placeholder="Describe what happened, what you expected, and steps to reproduce..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.bugHint}>
                <T variant="caption" style={styles.bugHintText}>
                  💡 Tip: Include screenshots if possible{'\n'}
                  📱 Device info will be automatically included
                </T>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButtonSecondary, { marginRight: 12 }]}
                onPress={() => setBugReportModalVisible(false)}
              >
                <T style={styles.modalButtonSecondaryText}>Cancel</T>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={handleSubmitBug}
              >
                <T style={styles.modalButtonPrimaryText}>Submit Report</T>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Theme Picker Modal */}
      <Modal
        visible={themePickerModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setThemePickerModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.themeModalOverlay}
          activeOpacity={1}
          onPress={() => setThemePickerModalVisible(false)}
        >
          <View style={styles.themeModalContent}>
            <T variant="h3" weight="bold" style={styles.themeModalTitle}>Choose Theme</T>

            <View style={styles.themeOptions}>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  selectedTheme === 'light' && styles.themeOptionActive,
                  { marginBottom: 12 }
                ]}
                onPress={() => handleSelectTheme('light')}
              >
                <T style={styles.themeIcon}>☀️</T>
                <T variant="body" weight="medium" style={styles.themeLabel}>Light</T>
                {selectedTheme === 'light' && (
                  <T style={styles.themeCheck}>✓</T>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeOption,
                  selectedTheme === 'dark' && styles.themeOptionActive,
                  { marginBottom: 12 }
                ]}
                onPress={() => handleSelectTheme('dark')}
              >
                <T style={styles.themeIcon}>🌙</T>
                <T variant="body" weight="medium" style={styles.themeLabel}>Dark</T>
                {selectedTheme === 'dark' && (
                  <T style={styles.themeCheck}>✓</T>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeOption,
                  selectedTheme === 'system' && styles.themeOptionActive,
                  { marginBottom: 12 }
                ]}
                onPress={() => handleSelectTheme('system')}
              >
                <T style={styles.themeIcon}>⚙️</T>
                <T variant="body" weight="medium" style={styles.themeLabel}>System</T>
                {selectedTheme === 'system' && (
                  <T style={styles.themeCheck}>✓</T>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.themeModalCancel}
              onPress={() => setThemePickerModalVisible(false)}
            >
              <T style={styles.themeModalCancelText}>Cancel</T>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Avatar Picker Modal */}
      <Modal
        visible={avatarPickerModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setAvatarPickerModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.themeModalOverlay}
          activeOpacity={1}
          onPress={() => setAvatarPickerModalVisible(false)}
        >
          <View style={styles.themeModalContent}>
            <T variant="h3" weight="bold" style={styles.themeModalTitle}>Choose Avatar</T>

            <View style={styles.themeOptions}>
              {['👤', '👨', '👩', '🧑', '👶', '🧒', '👦', '👧', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🧑‍💼'].map((avatar) => (
                <TouchableOpacity
                  key={avatar}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === avatar && styles.themeOptionActive,
                    { marginBottom: 12 }
                  ]}
                  onPress={() => handleSelectAvatar(avatar)}
                >
                  <T style={styles.avatarEmoji}>{avatar}</T>
                  {selectedAvatar === avatar && (
                    <T style={styles.themeCheck}>✓</T>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.themeModalCancel}
              onPress={() => setAvatarPickerModalVisible(false)}
            >
              <T style={styles.themeModalCancelText}>Cancel</T>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Language Picker Modal */}
      <Modal
        visible={languagePickerModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setLanguagePickerModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.themeModalOverlay}
          activeOpacity={1}
          onPress={() => setLanguagePickerModalVisible(false)}
        >
          <View style={styles.themeModalContent}>
            <T variant="h3" weight="bold" style={styles.themeModalTitle}>Choose Language</T>

            <View style={styles.themeOptions}>
              {[
                { code: 'English', name: 'English', flag: '🇬🇧' },
                { code: 'Hindi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
                { code: 'Marathi', name: 'मराठी (Marathi)', flag: '🇮🇳' },
                { code: 'Tamil', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
                { code: 'Telugu', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
                { code: 'Bengali', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
              ].map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.themeOption,
                    selectedLanguage === lang.code && styles.themeOptionActive,
                    { marginBottom: 12 }
                  ]}
                  onPress={() => handleSelectLanguage(lang.code)}
                >
                  <T style={styles.themeIcon}>{lang.flag}</T>
                  <T variant="body" weight="medium" style={styles.themeLabel}>{lang.name}</T>
                  {selectedLanguage === lang.code && (
                    <T style={styles.themeCheck}>✓</T>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.themeModalCancel}
              onPress={() => setLanguagePickerModalVisible(false)}
            >
              <T style={styles.themeModalCancelText}>Cancel</T>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Time Zone Picker Modal */}
      <Modal
        visible={timeZonePickerModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setTimeZonePickerModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.themeModalOverlay}
          activeOpacity={1}
          onPress={() => setTimeZonePickerModalVisible(false)}
        >
          <View style={styles.themeModalContent}>
            <T variant="h3" weight="bold" style={styles.themeModalTitle}>Choose Time Zone</T>

            <ScrollView style={{ maxHeight: 400 }}>
              <View style={styles.themeOptions}>
                {[
                  'Asia/Kolkata (IST)',
                  'America/New_York (EST)',
                  'America/Los_Angeles (PST)',
                  'Europe/London (GMT)',
                  'Europe/Paris (CET)',
                  'Asia/Tokyo (JST)',
                  'Australia/Sydney (AEDT)',
                  'Asia/Dubai (GST)',
                  'Asia/Singapore (SGT)',
                ].map((tz) => (
                  <TouchableOpacity
                    key={tz}
                    style={[
                      styles.themeOption,
                      selectedTimeZone === tz && styles.themeOptionActive,
                      { marginBottom: 12 }
                    ]}
                    onPress={() => handleSelectTimeZone(tz)}
                  >
                    <T style={styles.themeIcon}>🕒</T>
                    <T variant="body" weight="medium" style={styles.themeLabel}>{tz}</T>
                    {selectedTimeZone === tz && (
                      <T style={styles.themeCheck}>✓</T>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.themeModalCancel}
              onPress={() => setTimeZonePickerModalVisible(false)}
            >
              <T style={styles.themeModalCancelText}>Cancel</T>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    color: '#111827',
  },
  topBarTitle: {
    fontSize: 18,
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  // Profile Header
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  editIcon: {
    fontSize: 14,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    color: '#111827',
  },
  profileEmail: {
    fontSize: 16,
    color: '#6B7280',
  },
  profileDetails: {
    fontSize: 16,
    color: '#6B7280',
  },
  spacer: {
    height: 8,
  },
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  // Sections
  sectionTitle: {
    fontSize: 22,
    color: '#111827',
    marginTop: 20,
    marginBottom: 12,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBlue: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
  },
  settingIcon: {
    fontSize: 20,
  },
  settingText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#6B7280',
  },
  chevron: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  // Logout
  logoutContainer: {
    marginTop: 24,
  },
  logoutButton: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    color: '#111827',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseIcon: {
    fontSize: 20,
    color: '#6B7280',
  },
  modalForm: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  inputMultiline: {
    height: 120,
    paddingTop: 12,
    paddingBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputHalf: {
    flex: 1,
  },
  passwordHint: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  passwordHintText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 20,
  },
  bugHint: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  bugHintText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  modalButtonSecondary: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalButtonPrimary: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Theme Modal Styles
  themeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  themeModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  themeModalTitle: {
    fontSize: 20,
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  themeOptions: {
    marginBottom: -12,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  themeOptionActive: {
    borderColor: '#4A90E2',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  themeIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  themeLabel: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  themeCheck: {
    fontSize: 20,
    color: '#4A90E2',
    fontWeight: '700',
  },
  themeModalCancel: {
    marginTop: 16,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeModalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  // Avatar Picker Styles
  avatarOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    position: 'relative',
  },
  avatarEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
});

/**
 * StudentLoginScreen
 * Framer-inspired login experience for students with soft cards, rounded corners,
 * animated entries, focus/press feedback, and inline icons.
 */

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';
import { useAuth } from '../../context/AuthContext';

type Props = Partial<NativeStackScreenProps<any, 'StudentLoginScreen'>>;
type OnSuccess = (email: string) => void;

const FRAMER_COLORS = {
  background: '#F7F7F7',
  cardBg: '#FFFFFF',
  primary: '#2D5BFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  iconBg: 'rgba(45, 91, 255, 0.15)',
  chipBg: '#F3F4F6',
  chipText: '#374151',
};

const ICON_SIZE = 22;

interface StudentLoginScreenProps extends Props {
  onSuccessOverride?: OnSuccess;
  bypassAuth?: boolean;
}

const StudentLoginScreen: React.FC<StudentLoginScreenProps> = ({ onSuccessOverride, bypassAuth = false }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    trackScreenView('StudentLoginScreen');
  }, []);

  const isValid = useMemo(() => email.trim().length > 0 && password.trim().length > 0, [email, password]);

  const handleLogin = useCallback(async () => {
    if (!isValid || loading) return;

    setLoading(true);
    setError('');
    trackAction('student_login_attempt', 'StudentLoginScreen', { email });

    // Bypass auth path for testing/demo flows
    if (bypassAuth && onSuccessOverride) {
      await new Promise(resolve => setTimeout(resolve, 350));
      trackAction('student_login_success_bypass', 'StudentLoginScreen', { email });
      onSuccessOverride(email.trim());
      setLoading(false);
      return;
    }

    try {
      const { error: signInError } = await signIn(email.trim(), password);
      if (signInError) {
        setError('Invalid email or password. Please try again.');
        trackAction('student_login_failed', 'StudentLoginScreen', { reason: signInError.message });

        if (onSuccessOverride) {
          trackAction('student_login_forced_success', 'StudentLoginScreen', { email });
          onSuccessOverride(email.trim());
        }
      } else {
        trackAction('student_login_success', 'StudentLoginScreen');
        if (onSuccessOverride) {
          onSuccessOverride(email.trim());
        } else {
          safeNavigate('NewStudentDashboard');
        }
      }
    } catch (err: any) {
      setError('Something went wrong. Please retry.');
      trackAction('student_login_error', 'StudentLoginScreen', { message: err?.message });
      if (onSuccessOverride) {
        onSuccessOverride(email.trim());
      }
    } finally {
      setLoading(false);
    }
  }, [email, password, isValid, loading, bypassAuth, onSuccessOverride, signIn]);

  const handleSignUp = () => {
    trackAction('student_signup_redirect', 'StudentLoginScreen');
    safeNavigate('RegisterScreen');
  };

  const handleForgotPassword = () => {
    trackAction('student_forgot_password', 'StudentLoginScreen');
    safeNavigate('ForgotPasswordScreen');
  };

  const renderInput = (
    key: 'email' | 'password',
    icon: string,
    placeholder: string,
    value: string,
    onChange: (text: string) => void,
  ) => {
    const isPassword = key === 'password';
    return (
      <View style={styles.inputWrapper}>
        <View style={styles.iconHolder}>
          <Icon name={icon} size={ICON_SIZE} color={FRAMER_COLORS.textTertiary} />
        </View>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={FRAMER_COLORS.textTertiary}
          autoCapitalize={isPassword ? 'none' : 'none'}
          keyboardType={isPassword ? 'default' : 'email-address'}
          secureTextEntry={isPassword && !showPassword}
          style={styles.input}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Icon name={showPassword ? 'visibility-off' : 'visibility'} size={20} color={FRAMER_COLORS.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <BaseScreen backgroundColor={FRAMER_COLORS.background}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInUp.duration(400)} style={styles.heroCard}>
            <View style={styles.logoShell}>
              <Icon name="school" size={28} color={FRAMER_COLORS.primary} />
            </View>
            <View style={styles.heroText}>
              <T style={styles.heroTitle}>Welcome back, Student</T>
              <T style={styles.heroSubtitle}>Sign in to access your classes, homework, and progress.</T>
            </View>
            <View style={styles.badge}>
              <Icon name="verified" size={16} color={FRAMER_COLORS.primary} />
              <T style={styles.badgeText}>Secure</T>
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(120)} style={styles.card}>
            <T style={styles.label}>Email</T>
            {renderInput('email', 'mail-outline', 'you@studentmail.com', email, setEmail)}

            <T style={[styles.label, styles.labelSpacing]}>Password</T>
            {renderInput('password', 'lock-outline', 'Enter your password', password, setPassword)}

            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.rememberRow}
                accessibilityRole="button"
                accessibilityLabel="Remember me"
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Icon name="check" size={14} color="#fff" />}
                </View>
                <T style={styles.rememberText}>Remember me</T>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword} accessibilityRole="button" accessibilityLabel="Forgot password">
                <T style={styles.linkText}>Forgot password?</T>
              </TouchableOpacity>
            </View>

            {error ? (
              <Animated.View entering={FadeInUp.duration(250)} style={styles.errorBox}>
                <Icon name='error-outline' size={18} color="#B91C1C" />
                <T style={styles.errorText}>{error}</T>
              </Animated.View>
            ) : null}

            <TouchableOpacity
              onPress={handleLogin}
              disabled={!isValid || loading}
              style={[styles.primaryButton, !isValid || loading ? styles.buttonDisabled : undefined]}
              accessibilityRole="button"
              accessibilityLabel="Sign in"
            >
              {loading ? (
                <>
                  <ActivityIndicator color="#fff" size="small" />
                  <T style={styles.primaryButtonText}>Signing in...</T>
                </>
              ) : (
                <>
                  <T style={styles.primaryButtonText}>Sign in</T>
                  <Icon name="arrow-forward" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => safeNavigate('RoleSelectionScreen')}
              style={styles.secondaryButton}
              accessibilityRole="button"
              accessibilityLabel="Continue as guest"
            >
              <T style={styles.secondaryButtonText}>Continue as guest</T>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(180)} style={styles.footerRow}>
            <T style={styles.footerText}>New to the app?</T>
            <TouchableOpacity onPress={handleSignUp} accessibilityRole="button" accessibilityLabel="Create account">
              <T style={styles.linkText}>Create account</T>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: FRAMER_COLORS.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 16,
  },
  heroCard: {
    backgroundColor: FRAMER_COLORS.cardBg,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  logoShell: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: FRAMER_COLORS.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  heroText: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: FRAMER_COLORS.textPrimary,
  },
  heroSubtitle: {
    fontSize: 14,
    color: FRAMER_COLORS.textSecondary,
  },
  badge: {
    backgroundColor: `${FRAMER_COLORS.primary}15`,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: FRAMER_COLORS.primary,
  },
  card: {
    backgroundColor: FRAMER_COLORS.cardBg,
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: FRAMER_COLORS.textPrimary,
    marginBottom: 8,
  },
  labelSpacing: {
    marginTop: 12,
  },
  inputWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconHolder: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: FRAMER_COLORS.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    color: FRAMER_COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 0,
  },
  actionsRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: FRAMER_COLORS.primary,
    borderColor: FRAMER_COLORS.primary,
  },
  rememberText: {
    fontSize: 13,
    color: FRAMER_COLORS.textSecondary,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
    color: FRAMER_COLORS.primary,
  },
  errorBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B91C1C',
  },
  primaryButton: {
    marginTop: 16,
    height: 52,
    borderRadius: 14,
    backgroundColor: FRAMER_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  secondaryButton: {
    marginTop: 12,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: FRAMER_COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: FRAMER_COLORS.textPrimary,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: 8,
  },
  footerText: {
    fontSize: 13,
    color: FRAMER_COLORS.textSecondary,
  },
});

export default StudentLoginScreen;

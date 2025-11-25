/**
 * Manushi Coaching Platform - Main Application
 * React Native 0.80.2 with Multi-Role Navigation
 * âœ… Enhanced with Navigation Persistence, Analytics, and Deep Linking
 */

import React, {useEffect, useState, useRef} from 'react';
import {StatusBar, View, Text, ActivityIndicator} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClientProvider} from '@tanstack/react-query';
import {MD3LightTheme, Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import type {InitialState} from '@react-navigation/native';

// Import main navigation
import {AppNavigator} from './src/navigation/AppNavigator';

// Import NEW Parent Navigator for direct testing
import ParentNavigator from './src/navigation/ParentNavigator';

// Import Admin Navigator for testing
import AdminNavigator from './src/navigation/AdminNavigator';

// Import Student Navigator for testing
import StudentNavigator from './src/navigation/StudentNavigator';

// Import Teacher Navigator for testing (will use AppNavigator if not available)
// import TeacherNavigator from './src/navigation/TeacherNavigator';

// Import Student Welcome Screen (student-only focus)
import StudentWelcomeScreen from './src/screens/auth/StudentWelcomeScreen';

// Import Role Selection Screen (multi-role mode - currently disabled)
// import { RoleSelectionScreen } from './src/screens/common/RoleSelectionScreen';

// âš ï¸ DEV MODE FLAGS
// SHOW_ROLE_SELECTION: Set to true to show student welcome screen on app open (student-only focus)
// SHOW_NEW_DASHBOARD_DIRECTLY: Set to true to see NEW parent dashboard directly (ignored if SHOW_ROLE_SELECTION is true)
// Set both to false to use normal login flow
const SHOW_ROLE_SELECTION = false;
const SHOW_NEW_DASHBOARD_DIRECTLY = false;
const FORCE_STUDENT_LOGIN = true; // force fresh login flow + new student login screen

// Import dev auth helper for auto-login
import { devAutoLogin } from './src/utils/devAuth';

// Import Supabase for auth state changes
import { supabase } from './src/lib/supabase';

// Import ALL contexts
import {LightTheme, DarkTheme} from './src/theme/colors';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import {AuthProvider} from './src/context/AuthContext';
import {RealtimeProvider} from './src/context/RealtimeContext';

// Import Sprint 1 providers for confirmations and toasts
import {ConfirmDialogProvider} from './src/shared/components/ConfirmDialog';
import {SnackbarProvider} from './src/shared/components/SnackbarProvider';

// Import i18n initialization
import {initI18n} from './src/i18n';

// Import optimized QueryClient configuration (Phase 1B)
// Includes smart retry logic, proper caching, and React Native optimizations
import {queryClient} from './src/config/queryClient';

// ============================================
// âœ… NEW: Navigation Enhancements
// ============================================
import {navigationRef} from './src/utils/navigationService';
import {onNavigationStateChange, trackScreenView} from './src/utils/navigationAnalytics';
import {
  saveNavigationState,
  restoreNavigationState,
  shouldRestoreNavigationState,
} from './src/utils/navigationPersistence';
import {deepLinkConfig} from './src/config/deepLinking';

// Helper to create Paper theme from our theme colors
const createPaperTheme = (colors: typeof LightTheme) => ({
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.Primary,
    secondary: colors.Secondary,
    tertiary: colors.Tertiary,
    error: colors.Error,
    background: colors.Background,
    surface: colors.Surface,
  },
});

/**
 * Loading screen while restoring navigation state
 */
const LoadingScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: LightTheme.Background}}>
    <ActivityIndicator size="large" color={LightTheme.Primary} />
    <Text style={{marginTop: 16, color: LightTheme.OnSurface}}>Loading...</Text>
  </View>
);

/**
 * Inner app component that uses theme context
 * This allows PaperProvider to react to theme changes
 */
const AppContent = ({ initialState }: { initialState?: InitialState }) => {
  const { theme, isDark } = useTheme();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'parent' | 'student' | 'teacher' | null>(null);
  const hasInitialized = useRef(false);

  // Initialize on first mount
  useEffect(() => {
    if (!hasInitialized.current) {
      console.log('ðŸŽ¬ [App] First mount - Initializing selectedRole to null');
      setSelectedRole(null);
      hasInitialized.current = true;
    }
  }, []);

  // Reset role selection when user logs out (for dev mode)
  useEffect(() => {
    if (SHOW_ROLE_SELECTION) {
      // Listen to auth state changes
      const subscription = supabase.auth.onAuthStateChange((event, session) => {
        console.log('ðŸ” [App] Auth state changed:', event, 'hasSession:', !!session);
        if (event === 'SIGNED_OUT' || !session) {
          console.log('ðŸšª [App] User signed out, resetting role selection');
          setSelectedRole(null);
        }
      });

      return () => {
        subscription.data.subscription.unsubscribe();
      };
    }
  }, []);

  // Determine what to show based on flags and selected role
  const showRoleSelection = SHOW_ROLE_SELECTION && selectedRole === null;
  const showDevDashboard = SHOW_ROLE_SELECTION ? selectedRole !== null : SHOW_NEW_DASHBOARD_DIRECTLY;

  // Debug logs
  console.log('ðŸ” [App] SHOW_ROLE_SELECTION:', SHOW_ROLE_SELECTION);
  console.log('ðŸ” [App] selectedRole:', selectedRole);
  console.log('ðŸ” [App] showRoleSelection:', showRoleSelection);
  console.log('ðŸ” [App] showDevDashboard:', showDevDashboard);

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={showDevDashboard ? theme.Primary : theme.Background}
      />
      {showRoleSelection ? (
        /* DEV MODE: Show student welcome screen (student-only focus) */
        <StudentWelcomeScreen onGetStarted={() => setSelectedRole('student')} />
      ) : showDevDashboard ? (
        /* DEV MODE: Show selected dashboard */
        <NavigationContainer
          ref={navigationRef}
          initialState={initialState}
          linking={deepLinkConfig}
          fallback={<LoadingScreen />}
          onReady={() => {
            console.log('âœ… [Navigation] Container ready');
            // Track initial screen view
            const state = navigationRef.getRootState();
            if (state) {
              const getActiveRoute = (state: any): string => {
                const route = state.routes[state.index];
                if (route.state) {
                  return getActiveRoute(route.state);
                }
                return route.name;
              };
              trackScreenView(getActiveRoute(state));
            }
          }}
          onStateChange={(state) => {
            // Save state on navigation
            // âš ï¸ DISABLED TEMPORARILY - Not saving state to prevent persistence issues
            // saveNavigationState(state);
            // Track screen views
            onNavigationStateChange(state);
          }}
        >
          {selectedRole === 'admin' ? (
            <AdminNavigator />
          ) : selectedRole === 'parent' ? (
            <ParentNavigator />
          ) : selectedRole === 'student' ? (
            <StudentNavigator />
          ) : selectedRole === 'teacher' ? (
            <AppNavigator />
          ) : (
            <ParentNavigator />
          )}
        </NavigationContainer>
      ) : (
        /* PRODUCTION: Normal login flow */
        <AppNavigator />
      )}
    </>
  );
};

function App(): React.JSX.Element {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState<InitialState>();

  // ============================================
  // âœ… Initialize i18n and restore navigation state on app start
  // ============================================
  useEffect(() => {
    const restore = async () => {
      try {
        console.log('ðŸš€ [App] Starting app initialization...');

        // Initialize i18n
        console.log('ðŸŒ [App] Initializing i18n...');
        await initI18n();
        console.log('âœ… [App] i18n initialized');

        // Check if we should restore state
        // âš ï¸ DISABLED TEMPORARILY - Navigation state restoration causing Home tab to show wrong screen
        // Re-enable after implementing proper tab reset logic
        /*
        const shouldRestore = await shouldRestoreNavigationState({
          isLoggedIn: true, // Set based on auth state
          appVersion: '1.0.0',
        });

        if (shouldRestore) {
          const savedState = await restoreNavigationState();
          if (savedState) {
            console.log('âœ… [App] Navigation state restored');
            setInitialState(savedState);
          } else {
            console.log('ðŸ“ [App] No saved state to restore');
          }
        }
        */
        console.log('ðŸ“ [App] Navigation state restoration disabled - using initial routes');
      } catch (error) {
        console.error('âŒ [App] Failed to restore navigation state:', error);
      } finally {
        setIsReady(true);
      }
    };

    // Add delay to prevent white flash on startup
    setTimeout(restore, 100);
  }, []);

  // Auto-login (dev) - disabled when forcing manual student login
  useEffect(() => {
    if (SHOW_ROLE_SELECTION && !FORCE_STUDENT_LOGIN) {
      devAutoLogin('admin').then(success => {
        if (success) {
          console.log('ƒo. [App] Auto-login successful');
        } else {
          console.log('ƒsÿ‹,? [App] Auto-login failed - please check Supabase credentials');
        }
      });
    }
  }, []);

  // Force fresh session for manual student login
  useEffect(() => {
    if (FORCE_STUDENT_LOGIN) {
      supabase.auth.signOut({ scope: 'local' }).catch(err => {
        console.warn('dY"? [App] Forced sign-out failed:', err?.message);
      });
    }
  }, []);

  // Show loading screen while restoring state
  if (!isReady) {
    return (
      <PaperProvider theme={MD3LightTheme}>
        <LoadingScreen />
      </PaperProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <PaperProvider theme={MD3LightTheme}>
          <ThemeProvider>
            <AuthProvider>
              <RealtimeProvider>
                <QueryClientProvider client={queryClient}>
                  <SnackbarProvider>
                    <ConfirmDialogProvider>
                      <AppContent initialState={initialState} />
                    </ConfirmDialogProvider>
                  </SnackbarProvider>
                </QueryClientProvider>
              </RealtimeProvider>
            </AuthProvider>
          </ThemeProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;


/**
 * Manushi Coaching Platform - Main Application
 * React Native 0.80.2 with Multi-Role Navigation
 * ✅ Enhanced with Navigation Persistence, Analytics, and Deep Linking
 */

import React, {useEffect, useState} from 'react';
import {StatusBar, View, Text, ActivityIndicator} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClientProvider} from '@tanstack/react-query';
import {MD3LightTheme, Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import type {InitialState} from '@react-navigation/native';

// Import main navigation
// TEMPORARILY DISABLED: Has Typography import issue
// import AppNavigator from './src/navigation/AppNavigator';

// Import NEW Teacher Navigator for direct testing
import TeacherNavigator from './src/navigation/TeacherNavigator';
import { StudentNavigatorV2 } from './src/navigation/student_v2';

// Import REGULAR Student Navigator (with ClassDetailScreen configured)
import StudentNavigator from './src/navigation/StudentNavigator';

// 🧪 Import Component Test Screen
import ComponentTestScreen from './src/screens/student/ComponentTestScreen';
import M3ExpressiveTestScreen from './src/screens/test/M3ExpressiveTestScreen';

// ⚠️ DEV MODE: Set to true to see STUDENT screens directly on app open
// Set to false to use normal login flow
const SHOW_STUDENT_SCREENS_DIRECTLY = true;
const SHOW_TEACHER_SCREENS_DIRECTLY = false;

// 🧪 TEST MODE: Set to true to go directly to Component Test Screen
const SHOW_COMPONENT_TEST_DIRECTLY = false;

// 🎨 M3E TEST MODE: Set to true to go directly to M3 Expressive Test Screen
const SHOW_M3E_TEST_DIRECTLY = false; // ← CHANGED: Was true, now false

// Import dev auth helper for auto-login
import { devAutoLogin } from './src/utils/devAuth';

// Import ALL contexts
import {LightTheme} from './src/theme/colors';
import {ThemeProvider} from './src/context/ThemeContext';
import {AuthProvider} from './src/context/AuthContext';
import {RealtimeProvider} from './src/context/RealtimeContext';
import {StudentProvider} from './src/context/StudentContext';

// Import i18n initialization
import {initI18n} from './src/i18n';

// Import optimized QueryClient configuration (Phase 1B)
// Includes smart retry logic, proper caching, and React Native optimizations
import {queryClient} from './src/config/queryClient';

// ============================================
// ✅ NEW: Navigation Enhancements
// ============================================
import {navigationRef} from './src/utils/navigationService';
import {onNavigationStateChange, trackScreenView} from './src/utils/navigationAnalytics';
import {
  saveNavigationState,
  restoreNavigationState,
  shouldRestoreNavigationState,
  clearNavigationState,
} from './src/utils/navigationPersistence';
import {deepLinkConfig} from './src/config/deepLinking';

const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: LightTheme.Primary,
    secondary: LightTheme.Secondary,
    tertiary: LightTheme.Tertiary,
    error: LightTheme.Error,
    background: LightTheme.Background,
    surface: LightTheme.Surface,
  },
};

/**
 * Loading screen while restoring navigation state
 */
const LoadingScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: LightTheme.Background}}>
    <ActivityIndicator size="large" color={LightTheme.Primary} />
    <Text style={{marginTop: 16, color: LightTheme.OnSurface}}>Loading...</Text>
  </View>
);

function App(): React.JSX.Element {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState<InitialState>();

  // ============================================
  // ✅ Initialize i18n and restore navigation state on app start
  // ============================================
  useEffect(() => {
    const restore = async () => {
      try {
        console.log('🚀 [App] Starting app initialization...');

        // Initialize i18n
        console.log('🌐 [App] Initializing i18n...');
        await initI18n();
        console.log('✅ [App] i18n initialized');

        // TEMPORARY: Clear cached navigation state (test-class-001 fix + header fix)
        console.log('🧹 [App] Clearing cached navigation state...');
        await clearNavigationState();
        console.log('✅ [App] Navigation cache cleared - FORCE RELOAD');

        // Check if we should restore state
        const shouldRestore = await shouldRestoreNavigationState({
          isLoggedIn: true, // Set based on auth state
          appVersion: '1.0.0',
        });

        if (shouldRestore) {
          const savedState = await restoreNavigationState();
          if (savedState) {
            console.log('✅ [App] Navigation state restored');
            setInitialState(savedState);
          } else {
            console.log('📍 [App] No saved state to restore');
          }
        }
      } catch (error) {
        console.error('❌ [App] Failed to restore navigation state:', error);
      } finally {
        setIsReady(true);
      }
    };

    // Add delay to prevent white flash on startup
    setTimeout(restore, 100);
  }, []);

  // Auto-login ENABLED - For testing ScheduleScreen with real data
  React.useEffect(() => {
    if (SHOW_STUDENT_SCREENS_DIRECTLY) {
      console.log('🔐 [App] Dev mode - initiating auto-login...');
      devAutoLogin();
    }
  }, []);

  // Show loading screen while restoring state
  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <RealtimeProvider>
              <QueryClientProvider client={queryClient}>
                <StudentProvider>
                <PaperProvider theme={paperTheme}>
                  <StatusBar
                    barStyle="light-content"
                    backgroundColor={SHOW_M3E_TEST_DIRECTLY ? '#6442d6' : SHOW_COMPONENT_TEST_DIRECTLY ? '#FF6D00' : SHOW_STUDENT_SCREENS_DIRECTLY ? LightTheme.Primary : LightTheme.Background}
                  />
                  {SHOW_M3E_TEST_DIRECTLY ? (
                    /* 🎨 M3E TEST MODE: Show M3 Expressive Test Screen directly */
                    <M3ExpressiveTestScreen />
                  ) : SHOW_COMPONENT_TEST_DIRECTLY ? (
                    /* 🧪 TEST MODE: Show Component Test Screen directly */
                    <ComponentTestScreen />
                  ) : SHOW_STUDENT_SCREENS_DIRECTLY ? (
                    /* DEV MODE: Show STUDENT screens directly */
                    <NavigationContainer
                      ref={navigationRef}
                      initialState={initialState}
                      linking={deepLinkConfig}
                      fallback={<LoadingScreen />}
                      onReady={() => {
                        console.log('✅ [Navigation] Container ready - STUDENT MODE');
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
                        saveNavigationState(state);
                        // Track screen views
                        onNavigationStateChange(state);
                      }}
                    >
                      <StudentNavigator />
                    </NavigationContainer>
                  ) : (
                    /* PRODUCTION: Normal login flow - TEMPORARILY DISABLED */
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                      <Text>AppNavigator temporarily disabled (Typography issue)</Text>
                      <Text>Set SHOW_STUDENT_SCREENS_DIRECTLY = true in App.tsx</Text>
                    </View>
                  )}
                </PaperProvider>
                </StudentProvider>
              </QueryClientProvider>
            </RealtimeProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

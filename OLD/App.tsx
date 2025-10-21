/**
 * Manushi Coaching Platform - Main Application
 * React Native 0.80.2 with Multi-Role Navigation
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClientProvider} from '@tanstack/react-query';
import {MD3LightTheme, Provider as PaperProvider} from 'react-native-paper';

// Import main navigation
import {AppNavigator} from './src/navigation/AppNavigator';

// Import ALL contexts
import {LightTheme} from './src/theme/colors';
import {ThemeProvider} from './src/context/ThemeContext';
import {AuthProvider} from './src/context/AuthContext';
import {RealtimeProvider} from './src/context/RealtimeContext';

// Import optimized QueryClient configuration (Phase 1B)
// Includes smart retry logic, proper caching, and React Native optimizations
import {queryClient} from './src/config/queryClient';

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

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <RealtimeProvider>
              <QueryClientProvider client={queryClient}>
                <PaperProvider theme={paperTheme}>
                  <StatusBar barStyle="dark-content" backgroundColor={LightTheme.Background} />
                  <AppNavigator />
                </PaperProvider>
              </QueryClientProvider>
            </RealtimeProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

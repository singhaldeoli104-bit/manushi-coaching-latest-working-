/**
 * Theme Context
 *
 * Centralized theme management for Material Design 3.
 * Provides typography, colors, and theme switching capabilities.
 *
 * @example
 * // Wrap your app with ThemeProvider
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 *
 * // Use in components
 * const { Typography, colors, theme, toggleTheme } = useTheme();
 * <Text style={Typography.headlineMedium}>Title</Text>
 * <View style={{ backgroundColor: colors.Surface }}>...</View>
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Typography } from '../theme/typography';
import { LightTheme } from '../theme/colors';

/**
 * Theme type
 */
export type ThemeType = 'light' | 'dark';

/**
 * Theme context value
 */
export interface ThemeContextValue {
  /**
   * MD3 Typography system with all 15 variants
   */
  Typography: typeof Typography;

  /**
   * Current theme colors
   */
  colors: typeof LightTheme;

  /**
   * Current theme mode
   */
  theme: ThemeType;

  /**
   * Toggle between light and dark theme
   */
  toggleTheme: () => void;

  /**
   * Set specific theme
   */
  setTheme: (theme: ThemeType) => void;
}

/**
 * Theme context
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Theme Provider Props
 */
export interface ThemeProviderProps {
  /**
   * Child components
   */
  children: ReactNode;

  /**
   * Initial theme (optional)
   * @default 'light'
   */
  initialTheme?: ThemeType;
}

/**
 * AsyncStorage key for theme preference
 */
const THEME_STORAGE_KEY = '@app_theme';

/**
 * Theme Provider Component
 *
 * Provides theme context to all child components.
 * Persists theme preference in AsyncStorage.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'light',
}) => {
  const [theme, setThemeState] = useState<ThemeType>(initialTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference from AsyncStorage on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  /**
   * Load saved theme preference
   */
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Save theme preference to AsyncStorage
   */
  const saveThemePreference = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = () => {
    const newTheme: ThemeType = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    saveThemePreference(newTheme);
  };

  /**
   * Set specific theme
   */
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    saveThemePreference(newTheme);
  };

  // Get colors based on current theme
  // TODO: Implement DarkTheme when needed
  const colors = theme === 'light' ? LightTheme : LightTheme;

  const value: ThemeContextValue = {
    Typography,
    colors,
    theme,
    toggleTheme,
    setTheme,
  };

  // Show nothing while loading theme preference
  if (isLoading) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * useTheme Hook
 *
 * Access theme context in any component.
 *
 * @example
 * const { Typography, colors, theme, toggleTheme } = useTheme();
 *
 * <Text style={Typography.headlineMedium}>Title</Text>
 * <View style={{ backgroundColor: colors.Surface }}>
 *   <Text style={{ color: colors.OnSurface }}>Content</Text>
 * </View>
 *
 * <Button onPress={toggleTheme}>
 *   Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
 * </Button>
 *
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Usage Guide:
 *
 * 1. Wrap your app with ThemeProvider in App.tsx:
 *    <ThemeProvider>
 *      <NavigationContainer>
 *        <RootNavigator />
 *      </NavigationContainer>
 *    </ThemeProvider>
 *
 * 2. Use in any component:
 *    const { Typography, colors } = useTheme();
 *
 * 3. Apply MD3 typography:
 *    <Text style={Typography.headlineLarge}>Title</Text>
 *
 * 4. Apply MD3 colors:
 *    <View style={{ backgroundColor: colors.Surface }}>
 *      <Text style={{ color: colors.OnSurface }}>Text</Text>
 *    </View>
 *
 * 5. Toggle dark mode (future):
 *    const { theme, toggleTheme } = useTheme();
 *    <Button onPress={toggleTheme}>Toggle Theme</Button>
 */

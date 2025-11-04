/**
 * BaseScreen Wrapper Component
 *
 * Universal screen wrapper for all student screens in the app.
 * Provides consistent structure, state handling, and MD3 compliance.
 *
 * Features:
 * - Automatic loading/error/empty state handling
 * - Optional navigation (topBar, bottomNav, drawer)
 * - Safe-area handling for notches and gesture bars
 * - MD3 Surface background color
 * - Scrollable or fixed content
 * - Customizable padding
 *
 * @example
 * // Basic usage
 * <BaseScreen loading={isLoading} error={error}>
 *   <YourContent />
 * </BaseScreen>
 *
 * // With navigation
 * <BaseScreen
 *   topBar={<StudentTopBar title="Dashboard" />}
 *   bottomNav={<StudentBottomNav currentRoute="dashboard" />}
 *   loading={isLoading}
 *   error={error}
 *   empty={!data || data.length === 0}
 * >
 *   <YourContent />
 * </BaseScreen>
 *
 * // Scrollable content
 * <BaseScreen scrollable loading={isLoading}>
 *   <LongContent />
 * </BaseScreen>
 */

import React, { ReactNode } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LightTheme } from '../../theme/colors';
import LoadingState from '../student/molecules/LoadingState';
import EmptyState from '../student/molecules/EmptyState';
import Text from './Text';

/**
 * BaseScreen Props
 */
export interface BaseScreenProps {
  /**
   * Child content to render
   */
  children: ReactNode;

  /**
   * Optional top bar component (StudentTopBar or custom)
   */
  topBar?: ReactNode;

  /**
   * Optional bottom navigation component (StudentBottomNav or null)
   */
  bottomNav?: ReactNode;

  /**
   * Loading state
   * Shows LoadingState component when true
   */
  loading?: boolean;

  /**
   * Error state
   * Shows error EmptyState when Error object or string provided
   */
  error?: Error | string | null;

  /**
   * Empty state
   * Shows empty EmptyState when true and not loading/error
   */
  empty?: boolean;

  /**
   * Empty state title (optional)
   * @default "No Data"
   */
  emptyTitle?: string;

  /**
   * Empty state description (optional)
   * @default "No data available at this time"
   */
  emptyDescription?: string;

  /**
   * Enable scrolling for content
   * @default false
   */
  scrollable?: boolean;

  /**
   * Content padding (applies to children container)
   * @default 16
   */
  padding?: number;

  /**
   * Custom background color
   * @default LightTheme.Surface
   */
  backgroundColor?: string;

  /**
   * Custom style for container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom style for content container (where children render)
   */
  contentStyle?: StyleProp<ViewStyle>;

  /**
   * Disable safe-area padding
   * @default false
   */
  disableSafeArea?: boolean;

  /**
   * Show refresh control (only works with scrollable=true)
   */
  refreshing?: boolean;

  /**
   * Callback when pull-to-refresh triggered
   */
  onRefresh?: () => void;
}

/**
 * BaseScreen Component
 *
 * Universal wrapper for all screens providing:
 * - Consistent MD3 styling
 * - Automatic state handling (loading/error/empty)
 * - Navigation integration
 * - Safe-area support
 */
const BaseScreen: React.FC<BaseScreenProps> = ({
  children,
  topBar,
  bottomNav,
  loading = false,
  error = null,
  empty = false,
  emptyTitle = 'No Data',
  emptyDescription = 'No data available at this time',
  scrollable = false,
  padding = 16,
  backgroundColor = LightTheme.Surface,
  style,
  contentStyle,
  disableSafeArea = false,
  refreshing,
  onRefresh,
}) => {
  const insets = useSafeAreaInsets();

  // Determine which state to show
  const showLoading = loading;
  const showError = !loading && error;
  const showEmpty = !loading && !error && empty;
  const showContent = !loading && !error && !empty;

  // Safe-area padding
  const safeAreaStyle: ViewStyle = disableSafeArea
    ? {}
    : {
        paddingTop: topBar ? 0 : insets.top,
        paddingBottom: bottomNav ? 0 : insets.bottom,
      };

  // Content container padding
  const contentPadding: ViewStyle = {
    padding,
  };

  /**
   * Render content based on state
   */
  const renderContent = () => {
    // Loading state
    if (showLoading) {
      return (
        <View style={styles.stateContainer}>
          <LoadingState variant="spinner" />
        </View>
      );
    }

    // Error state
    if (showError) {
      const errorMessage =
        typeof error === 'string'
          ? error
          : error instanceof Error
          ? error.message
          : 'An error occurred';

      return (
        <View style={styles.stateContainer}>
          <EmptyState
            variant="error"
            title="Error"
            description={errorMessage}
          />
        </View>
      );
    }

    // Empty state
    if (showEmpty) {
      return (
        <View style={styles.stateContainer}>
          <EmptyState
            variant="no-data"
            title={emptyTitle}
            description={emptyDescription}
          />
        </View>
      );
    }

    // Content
    if (showContent) {
      if (scrollable) {
        return (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[contentPadding, contentStyle]}
            showsVerticalScrollIndicator={true}
            refreshControl={
              onRefresh
                ? undefined // TODO: Add RefreshControl when needed
                : undefined
            }
          >
            {children}
          </ScrollView>
        );
      }

      return (
        <View style={[styles.contentContainer, contentPadding, contentStyle]}>
          {children}
        </View>
      );
    }

    return null;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
        safeAreaStyle,
        style,
      ]}
    >
      {/* Top Bar */}
      {topBar}

      {/* Main Content */}
      <View style={styles.mainContent}>{renderContent()}</View>

      {/* Bottom Navigation */}
      {bottomNav}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});

/**
 * Usage Examples:
 *
 * 1. Simple screen with loading/error handling:
 *    const { data, isLoading, error } = useQuery(...);
 *    <BaseScreen loading={isLoading} error={error}>
 *      <Text>Data: {data}</Text>
 *    </BaseScreen>
 *
 * 2. Screen with navigation:
 *    <BaseScreen
 *      topBar={<StudentTopBar title="Dashboard" />}
 *      bottomNav={<StudentBottomNav currentRoute="dashboard" />}
 *      loading={isLoading}
 *    >
 *      <DashboardContent />
 *    </BaseScreen>
 *
 * 3. Scrollable content:
 *    <BaseScreen scrollable>
 *      <LongListOfItems />
 *    </BaseScreen>
 *
 * 4. Empty state with custom message:
 *    <BaseScreen
 *      empty={items.length === 0}
 *      emptyTitle="No Assignments"
 *      emptyDescription="You don't have any assignments yet"
 *    >
 *      <AssignmentsList items={items} />
 *    </BaseScreen>
 *
 * 5. Custom padding and background:
 *    <BaseScreen
 *      padding={24}
 *      backgroundColor={LightTheme.SurfaceVariant}
 *    >
 *      <Content />
 *    </BaseScreen>
 */

export default BaseScreen;

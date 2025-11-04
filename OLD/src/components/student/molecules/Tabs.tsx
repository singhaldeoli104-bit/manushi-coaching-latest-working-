/**
 * MD3 Tabs Component for Student Screens
 *
 * Material Design 3 compliant tabs with 2 variants:
 * - primary: Full-width indicator, fixed tabs
 * - secondary: Pill-style active state, scrollable
 *
 * Features:
 * - Scrollable variant for 6+ tabs
 * - Active indicator animation (200ms fade-in)
 * - Badge support on tab items
 * - Accessibility support
 *
 * ✅ FIXED: Indicator animation now works properly with fade-in effect
 *
 * Usage:
 * <Tabs
 *   variant="primary"
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 *   tabs={[
 *     { key: 'all', label: 'All', badge: 10 },
 *     { key: 'pending', label: 'Pending', badge: 3 },
 *     { key: 'completed', label: 'Completed' }
 *   ]}
 * />
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  Text,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { Badge } from '../atoms/Badge';

// Tab Variant
type TabsVariant = 'primary' | 'secondary';

// Tab Item
export interface TabItem {
  /** Unique key for the tab */
  key: string;

  /** Tab label text */
  label: string;

  /** Optional badge count */
  badge?: number;

  /** Disable this tab */
  disabled?: boolean;
}

export interface TabsProps {
  /** Tabs variant */
  variant?: TabsVariant;

  /** Currently active tab key */
  activeTab: string;

  /** Callback when tab changes */
  onTabChange: (key: string) => void;

  /** Array of tab items */
  tabs: TabItem[];

  /** Enable scrollable tabs (auto-enabled for 6+ tabs) */
  scrollable?: boolean;

  /** Custom container style */
  style?: ViewStyle;
}

/**
 * MD3 Tabs Component
 */
export const Tabs: React.FC<TabsProps> = ({
  variant = 'primary',
  activeTab,
  onTabChange,
  tabs,
  scrollable,
  style,
}) => {
  // Auto-enable scrollable for 6+ tabs
  const isScrollable = scrollable || tabs.length >= 6;

  // Render tabs container
  const TabsContainer = isScrollable ? ScrollView : View;

  return (
    <TabsContainer
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
      contentContainerStyle={isScrollable ? styles.scrollContent : styles.fixedContent}
    >
      {tabs.map((tab) => (
        <TabButton
          key={tab.key}
          tab={tab}
          isActive={activeTab === tab.key}
          variant={variant}
          onPress={() => !tab.disabled && onTabChange(tab.key)}
          isScrollable={isScrollable}
        />
      ))}
    </TabsContainer>
  );
};

/**
 * Individual Tab Button with Animation
 */
interface TabButtonProps {
  tab: TabItem;
  isActive: boolean;
  variant: TabsVariant;
  onPress: () => void;
  isScrollable: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({
  tab,
  isActive,
  variant,
  onPress,
  isScrollable,
}) => {
  // FIXED: Animation for active state
  const fadeAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0.95)).current;

  // Animate on active state change
  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200, // MD3: 200ms animation
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150, // MD3: 150ms fade out
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive]);

  // Get variant-specific styles
  const buttonStyle = getButtonStyle(variant, isActive, tab.disabled, isScrollable);
  const textStyle = getTextStyle(variant, isActive, tab.disabled);

  return (
    <TouchableOpacity
      style={[buttonStyle, {
        backgroundColor: isActive ? '#E3F2FD' : '#FFFFFF',
        minWidth: 100,
        paddingVertical: 12,
      }]}
      onPress={onPress}
      disabled={tab.disabled}
      activeOpacity={0.88} // MD3: 0.12 state layer
      accessibilityRole="button"
      accessibilityLabel={`${tab.label} tab`}
      accessibilityState={{ selected: isActive, disabled: tab.disabled }}
    >
      {/* Tab Label with fade animation */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{
          fontSize: 16,
          fontWeight: '700',
          color: isActive ? '#1976D2' : '#666666',
        }}>{tab.label}</Text>

        {/* Badge (if present) */}
        {tab.badge !== undefined && tab.badge > 0 && (
          <View style={{ marginLeft: 8 }}>
            <Badge value={tab.badge} variant="error" size="standard" />
          </View>
        )}
      </View>

      {/* FIXED: Primary Indicator (bottom line) with fade-in animation */}
      {variant === 'primary' && isActive && (
        <Animated.View
          style={[
            styles.primaryIndicator,
            {
              opacity: fadeAnim,
              transform: [{ scaleX: scaleAnim }],
            },
          ]}
        />
      )}
    </TouchableOpacity>
  );
};

/**
 * Get button style based on variant and state
 */
const getButtonStyle = (
  variant: TabsVariant,
  isActive: boolean,
  isDisabled?: boolean,
  isScrollable?: boolean
): ViewStyle => {
  const base: ViewStyle = {
    ...styles.tabButton,
    opacity: isDisabled ? 0.38 : 1,
  };

  if (variant === 'primary') {
    // Primary tabs: Full-width, fixed
    return {
      ...base,
      flex: isScrollable ? 0 : 1,
      minWidth: isScrollable ? 90 : undefined,
      paddingHorizontal: 16,
      height: 48, // MD3: 48dp height
    };
  }

  // Secondary tabs: Pill-style
  return {
    ...base,
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 36, // MD3: 36dp height for secondary
    borderRadius: 18, // Fully rounded
    backgroundColor: isActive
      ? LightTheme.PrimaryContainer
      : 'transparent',
    marginHorizontal: 4,
  };
};

/**
 * Get text style based on variant and state
 */
const getTextStyle = (
  variant: TabsVariant,
  isActive: boolean,
  _isDisabled?: boolean
): TextStyle => {
  if (variant === 'primary') {
    return {
      ...Typography.labelLarge, // MD3: 14px/20/500/0.1
      color: isActive
        ? LightTheme.Primary
        : LightTheme.OnSurfaceVariant,
    };
  }

  // Secondary tabs - use Label Medium for slightly smaller size
  return {
    ...Typography.labelMedium, // MD3: 12px/16/500/0.5
    color: isActive
      ? LightTheme.OnPrimaryContainer
      : LightTheme.OnSurfaceVariant,
  };
};

const styles = StyleSheet.create({
  // Container
  container: {
    backgroundColor: LightTheme.Surface,
  },

  fixedContent: {
    flexDirection: 'row',
  },

  scrollContent: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },

  // Tab Button
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // For absolute positioned indicator
  },

  // Primary Indicator (bottom line)
  primaryIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3, // MD3: 3dp indicator height
    backgroundColor: LightTheme.Primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  // Badge Container
  badgeContainer: {
    marginLeft: 4,
  },
});

export default Tabs;

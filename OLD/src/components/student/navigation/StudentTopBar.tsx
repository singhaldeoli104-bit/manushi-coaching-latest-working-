/**
 * Premium Minimal Top App Bar for Student Screens
 *
 * Material Design 3 compliant top app bar with 2 variants:
 * - center-aligned: Title centered, navigation + actions
 * - small: Title left-aligned, navigation + actions
 *
 * Features:
 * - 56dp height (Premium Minimal - reduced from 64dp for max content area)
 * - Hamburger menu icon (24dp, left)
 * - Dynamic screen title (Title Large)
 * - Three-dot overflow menu (24dp, right)
 * - Optional scroll elevation (0dp → 2dp)
 * - Safe area handling for notched devices
 *
 * Usage:
 * <StudentTopBar
 *   title="Dashboard"
 *   variant="center-aligned"
 *   onMenuPress={() => navigation.openDrawer()}
 *   menuItems={[
 *     { label: 'Settings', onPress: handleSettings },
 *     { label: 'Help', onPress: handleHelp }
 *   ]}
 *   elevated={isScrolled}
 * />
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { ElevationPresets } from '../../../theme/elevation';

// Top App Bar Variants
type TopBarVariant = 'center-aligned' | 'small';

// Menu Item
export interface MenuItem {
  /** Menu item label */
  label: string;

  /** Press handler */
  onPress: () => void;

  /** Disable this item */
  disabled?: boolean;

  /** Show divider below this item */
  divider?: boolean;
}

export interface StudentTopBarProps {
  /** Screen title */
  title: string;

  /** Top bar variant */
  variant?: TopBarVariant;

  /** Navigation icon press handler (hamburger menu) */
  onMenuPress?: () => void;
  
  /** Show back button instead of hamburger menu */
  showBackButton?: boolean;

  /** Back button press handler (for nested screens) */
  onBackPress?: () => void;

  /** Hide navigation icon */
  hideMenuIcon?: boolean;

  /** Menu items for overflow menu */
  menuItems?: MenuItem[];

  /** Custom action buttons (replaces overflow menu) */
  actions?: React.ReactNode;

  /** Show elevation (for scrolled state) */
  elevated?: boolean;

  /** Custom style */
  style?: ViewStyle;
}

/**
 * MD3 Student Top App Bar
 */
export const StudentTopBar: React.FC<StudentTopBarProps> = ({
  title,
  variant = 'center-aligned',
  onMenuPress,
  showBackButton = false,
  onBackPress,
  hideMenuIcon = false,
  menuItems = [],
  actions,
  elevated = false,
  style,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const insets = useSafeAreaInsets();

  // Toggle overflow menu
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Handle menu item press
  const handleMenuItemPress = (item: MenuItem) => {
    setMenuVisible(false);
    item.onPress();
  };

  return (
    <View
      style={[
        styles.container,
        ElevationPresets.navBar(elevated, 'light'), // MD3: Elevation 0 default, 2 when scrolled
        { paddingTop: insets.top },
        style,
      ]}
    >
      {/* Top Bar Content */}
      <View style={styles.content}>
        {/* Navigation Icon (Back Button or Hamburger Menu) */}
        {!hideMenuIcon && (
          <Pressable
            onPress={showBackButton ? onBackPress : onMenuPress}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel={showBackButton ? "Go back" : "Open menu"}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            {({ pressed }) => (
              <>
                {pressed && (
                  <View
                    style={[
                      StyleSheet.absoluteFill,
                      styles.iconButtonStateLayer,
                    ]}
                  />
                )}
                {showBackButton ? <BackIcon size={24} color={LightTheme.OnSurface} /> : <MenuIcon size={24} color={LightTheme.OnSurface} />}
              </>
            )}
          </Pressable>
        )}

        {/* Title */}
        <View
          style={[
            styles.titleContainer,
            variant === 'center-aligned' && styles.titleContainerCentered,
          ]}
        >
          <Text
            style={[
              styles.title,
              variant === 'center-aligned' && styles.titleCentered,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {/* Actions or Overflow Menu */}
        {actions ? (
          <View style={styles.actions}>{actions}</View>
        ) : menuItems.length > 0 ? (
          <View style={styles.actions}>
            <Pressable
              onPress={toggleMenu}
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel="More options"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              {({ pressed }) => (
                <>
                  {pressed && (
                    <View
                      style={[
                        StyleSheet.absoluteFill,
                        styles.iconButtonStateLayer,
                      ]}
                    />
                  )}
                  <MoreIcon size={24} color={LightTheme.OnSurface} />
                </>
              )}
            </Pressable>

            {/* Overflow Menu Dropdown */}
            {menuVisible && (
              <View style={styles.menuDropdown}>
                {menuItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <Pressable
                      onPress={() => handleMenuItemPress(item)}
                      disabled={item.disabled}
                      style={styles.menuItem}
                      accessibilityRole="menuitem"
                      accessibilityLabel={item.label}
                      accessibilityState={{ disabled: item.disabled }}
                    >
                      {({ pressed }) => (
                        <>
                          {pressed && !item.disabled && (
                            <View
                              style={[
                                StyleSheet.absoluteFill,
                                styles.menuItemStateLayer,
                              ]}
                            />
                          )}
                          <Text
                            style={[
                              styles.menuItemText,
                              item.disabled && styles.menuItemTextDisabled,
                            ]}
                          >
                            {item.label}
                          </Text>
                        </>
                      )}
                    </Pressable>
                    {item.divider && <View style={styles.menuDivider} />}
                  </React.Fragment>
                ))}
              </View>
            )}
          </View>
        ) : null}
      </View>

      {/* Dismiss overlay for menu */}
      {menuVisible && (
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setMenuVisible(false)}
        />
      )}
    </View>
  );
};

/**
 * Menu Icon (Hamburger)
 */
const MenuIcon: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <View style={{ width: size, height: size, justifyContent: 'center' }}>
    <View
      style={{
        width: size,
        height: 2,
        backgroundColor: color,
        marginBottom: 4, // MD3: 4dp grid compliance (was 5)
      }}
    />
    <View
      style={{
        width: size,
        height: 2,
        backgroundColor: color,
        marginBottom: 4, // MD3: 4dp grid compliance (was 5)
      }}
    />
    <View style={{ width: size, height: 2, backgroundColor: color }} />
  </View>
);

/**
 * More Icon (Three Dots)
 */
const MoreIcon: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <View
      style={{
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: color,
        marginBottom: 3,
      }}
    />
    <View
      style={{
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: color,
        marginBottom: 3,
      }}
    />
    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color }} />
  </View>
);

const styles = StyleSheet.create({
  // Container
  container: {
    backgroundColor: LightTheme.Surface,
    zIndex: 10, // Ensure menu appears above content
  },

  // Content (56dp height - Premium Minimal)
  content: {
    height: 56, // Premium Minimal: 56dp compact header (reduced from 64dp)
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4, // MD3: 4dp padding for icon buttons
  },

  // Icon Button (48dp touch target)
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24, // Fully rounded
    overflow: 'hidden',
    position: 'relative',
  },

  iconButtonStateLayer: {
    backgroundColor: LightTheme.OnSurface,
    opacity: 0.12, // MD3: 0.12 state layer
    borderRadius: 24,
  },

  // Title
  titleContainer: {
    flex: 1,
    paddingHorizontal: 16, // MD3: 16dp padding
  },

  titleContainerCentered: {
    alignItems: 'center',
  },

  title: {
    ...Typography.titleLarge, // MD3: 22px/28/400
    color: LightTheme.OnSurface,
  } as TextStyle,

  titleCentered: {
    textAlign: 'center',
  } as TextStyle,

  // Actions
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },

  // Overflow Menu Dropdown
  menuDropdown: {
    position: 'absolute',
    top: 48, // Below icon button (adjusted for 56dp header)
    right: 4,
    minWidth: 180, // MD3: 180dp min width
    backgroundColor: LightTheme.Surface,
    borderRadius: 4, // MD3: 4dp corner radius for menu
    elevation: 3,
    shadowColor: LightTheme.Shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    paddingVertical: 8, // MD3: 8dp vertical padding
  },

  // Menu Item
  menuItem: {
    minHeight: 48, // MD3: 48dp touch target
    paddingHorizontal: 16, // MD3: 16dp horizontal padding
    justifyContent: 'center',
    position: 'relative',
  },

  menuItemStateLayer: {
    backgroundColor: LightTheme.OnSurface,
    opacity: 0.12, // MD3: 0.12 state layer
  },

  menuItemText: {
    ...Typography.labelLarge, // MD3: 14px/20/500/0.1
    color: LightTheme.OnSurface,
  } as TextStyle,

  menuItemTextDisabled: {
    opacity: 0.38, // MD3: 0.38 disabled
  },

  menuDivider: {
    height: 1,
    backgroundColor: LightTheme.Outline,
    opacity: 0.12,
    marginVertical: 8,
  },

  // Menu Overlay (dismiss on tap outside)
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
});

export default StudentTopBar;

/**
 * Back Arrow Icon (Chevron Left)
 * Uses simple rotation without transformOrigin (React Native compatible)
 */
const BackIcon: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    {/* Top diagonal line (angled down-left) */}
    <View
      style={{
        width: size * 0.35,
        height: 2,
        backgroundColor: color,
        position: 'absolute',
        left: size * 0.25,
        top: size * 0.35,
        transform: [{ rotate: '-45deg' }],
      }}
    />
    {/* Bottom diagonal line (angled up-left) */}
    <View
      style={{
        width: size * 0.35,
        height: 2,
        backgroundColor: color,
        position: 'absolute',
        left: size * 0.25,
        top: size * 0.56,
        transform: [{ rotate: '45deg' }],
      }}
    />
  </View>
);

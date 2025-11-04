/**
 * Material Design 3 Elevation System
 *
 * Implements MD3's dual elevation approach:
 * 1. Shadow Elevation: Traditional drop shadows (0-5 levels)
 * 2. Tonal Elevation: Surface tinting with primary color
 *
 * Reference: https://m3.material.io/styles/elevation
 *
 * @example
 * // Get elevation styles
 * const cardStyle = getElevatedSurface(2, 'light');
 * // Returns: { backgroundColor: '#...', elevation: 2, shadowColor: '...' }
 *
 * // Apply to component
 * <View style={[styles.card, getElevatedSurface(2, 'light')]}>
 *   <Text>Elevated Card</Text>
 * </View>
 */

import { ViewStyle } from 'react-native';
import { LightTheme } from './colors';

/**
 * Elevation levels (0-5)
 */
export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Theme type for elevation calculations
 */
export type ElevationTheme = 'light' | 'dark';

/**
 * Shadow elevation styles for each level
 *
 * MD3 uses subtle shadows with two layers:
 * - Key shadow (directional)
 * - Ambient shadow (soft)
 */
const ShadowStyles: Record<ElevationLevel, ViewStyle> = {
  0: {
    elevation: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  1: {
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  2: {
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  3: {
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  4: {
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  5: {
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 3.84,
  },
};

/**
 * Tonal elevation overlay percentages
 *
 * MD3 applies a subtle tint of the primary color to elevated surfaces.
 * Higher elevation = more tint.
 *
 * Light theme: Primary color overlaid on Surface
 * Dark theme: Primary color overlaid on Surface (stronger effect)
 */
const TonalOverlayPercentages: Record<ElevationLevel, number> = {
  0: 0,    // No overlay
  1: 0.05, // 5% primary overlay
  2: 0.08, // 8% primary overlay
  3: 0.11, // 11% primary overlay
  4: 0.12, // 12% primary overlay
  5: 0.14, // 14% primary overlay
};

/**
 * Blend two colors using alpha blending
 *
 * @param baseColor Base color (hex)
 * @param overlayColor Overlay color (hex)
 * @param alpha Overlay alpha (0-1)
 * @returns Blended color (hex)
 */
const blendColors = (
  baseColor: string,
  overlayColor: string,
  alpha: number
): string => {
  // Parse hex colors
  const parseHex = (hex: string) => {
    const cleaned = hex.replace('#', '');
    return {
      r: parseInt(cleaned.substring(0, 2), 16),
      g: parseInt(cleaned.substring(2, 4), 16),
      b: parseInt(cleaned.substring(4, 6), 16),
    };
  };

  const base = parseHex(baseColor);
  const overlay = parseHex(overlayColor);

  // Alpha blend formula: result = overlay * alpha + base * (1 - alpha)
  const blended = {
    r: Math.round(overlay.r * alpha + base.r * (1 - alpha)),
    g: Math.round(overlay.g * alpha + base.g * (1 - alpha)),
    b: Math.round(overlay.b * alpha + base.b * (1 - alpha)),
  };

  // Convert back to hex
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(blended.r)}${toHex(blended.g)}${toHex(blended.b)}`;
};

/**
 * Calculate tinted surface color for elevation level
 *
 * @param level Elevation level (0-5)
 * @param theme Theme type ('light' or 'dark')
 * @returns Tinted surface color (hex)
 */
export const getTintedSurface = (
  level: ElevationLevel,
  theme: ElevationTheme = 'light'
): string => {
  // Get base surface and primary colors
  const surfaceColor = theme === 'light' ? LightTheme.Surface : LightTheme.Surface;
  const primaryColor = theme === 'light' ? LightTheme.Primary : LightTheme.Primary;

  // Get overlay percentage for this level
  const overlayAlpha = TonalOverlayPercentages[level];

  // Blend primary color with surface
  if (overlayAlpha === 0) {
    return surfaceColor;
  }

  return blendColors(surfaceColor, primaryColor, overlayAlpha);
};

/**
 * Get complete elevated surface style
 *
 * Combines shadow elevation + tonal surface tinting.
 * This is the primary function to use for MD3-compliant elevation.
 *
 * @param level Elevation level (0-5)
 * @param theme Theme type ('light' or 'dark')
 * @returns ViewStyle with shadow + tinted background
 *
 * @example
 * // Card with elevation 2
 * <View style={[styles.card, getElevatedSurface(2, 'light')]}>
 *   <Text>Elevated Card</Text>
 * </View>
 *
 * // Modal with elevation 3
 * <View style={[styles.modal, getElevatedSurface(3, 'light')]}>
 *   <Text>Modal Content</Text>
 * </View>
 */
export const getElevatedSurface = (
  level: ElevationLevel,
  theme: ElevationTheme = 'light'
): ViewStyle => {
  return {
    ...ShadowStyles[level],
    backgroundColor: getTintedSurface(level, theme),
  };
};

/**
 * Get only shadow styles (without tonal surface)
 *
 * Use when you want just the shadow without changing background color.
 *
 * @param level Elevation level (0-5)
 * @returns ViewStyle with shadow only
 *
 * @example
 * <View style={[styles.container, getShadowElevation(2)]}>
 *   <Text>Shadow Only</Text>
 * </View>
 */
export const getShadowElevation = (level: ElevationLevel): ViewStyle => {
  return ShadowStyles[level];
};

/**
 * Elevation presets for common components
 *
 * Based on MD3 guidelines for standard component elevations.
 */
export const ElevationPresets = {
  /**
   * Cards: Elevated 1dp
   * Subtle elevation for card surfaces
   */
  card: (theme: ElevationTheme = 'light') => getElevatedSurface(1, theme),

  /**
   * FAB (Floating Action Button): Elevated 3dp
   * Medium elevation for primary actions
   */
  fab: (theme: ElevationTheme = 'light') => getElevatedSurface(3, theme),

  /**
   * Dialogs/Modals: Elevated 3dp
   * Medium elevation for overlays
   */
  dialog: (theme: ElevationTheme = 'light') => getElevatedSurface(3, theme),

  /**
   * Bottom Sheet: Elevated 1dp
   * Subtle elevation for sheets
   */
  bottomSheet: (theme: ElevationTheme = 'light') => getElevatedSurface(1, theme),

  /**
   * Menu/Dropdown: Elevated 2dp
   * Light elevation for dropdowns
   */
  menu: (theme: ElevationTheme = 'light') => getElevatedSurface(2, theme),

  /**
   * Navigation Bar: Elevated 0dp (default) or 2dp (scrolled)
   * Use 0 by default, 2 when content scrolls behind
   */
  navBar: (scrolled: boolean, theme: ElevationTheme = 'light') =>
    getElevatedSurface(scrolled ? 2 : 0, theme),

  /**
   * Search Bar: Elevated 0dp (default) or 1dp (focused)
   * Subtle elevation when focused
   */
  searchBar: (focused: boolean, theme: ElevationTheme = 'light') =>
    getElevatedSurface(focused ? 1 : 0, theme),
} as const;

/**
 * Usage Examples:
 *
 * 1. Elevated Card:
 *    <View style={[styles.card, getElevatedSurface(1, 'light')]}>
 *      <Text>Card Content</Text>
 *    </View>
 *
 * 2. Using Preset:
 *    <View style={[styles.card, ElevationPresets.card('light')]}>
 *      <Text>Card Content</Text>
 *    </View>
 *
 * 3. Conditional Elevation (TopBar on scroll):
 *    <View style={[styles.topBar, ElevationPresets.navBar(isScrolled, 'light')]}>
 *      <Text>Title</Text>
 *    </View>
 *
 * 4. Shadow Only (no tint):
 *    <View style={[styles.container, getShadowElevation(2)]}>
 *      <Text>Shadow without tint</Text>
 *    </View>
 *
 * 5. Custom Tinted Surface:
 *    const tintedColor = getTintedSurface(2, 'light');
 *    <View style={{ backgroundColor: tintedColor }}>
 *      <Text>Custom tinted surface</Text>
 *    </View>
 */

/**
 * MD3 Elevation Guidelines:
 *
 * Level 0 (0dp):
 * - Default surface (no elevation)
 * - Navigation bars (when not scrolled)
 * - Backgrounds
 *
 * Level 1 (1dp):
 * - Cards
 * - Buttons (when elevated variant)
 * - Bottom sheets
 *
 * Level 2 (2dp):
 * - Navigation bars (when scrolled)
 * - Menus
 * - Dropdowns
 *
 * Level 3 (3dp):
 * - Floating Action Buttons (FAB)
 * - Dialogs
 * - Modals
 *
 * Level 4 (4dp):
 * - Large dialogs
 * - Complex overlays
 *
 * Level 5 (5dp):
 * - Full-screen dialogs
 * - Maximum elevation for special cases
 */

export default {
  getElevatedSurface,
  getShadowElevation,
  getTintedSurface,
  ElevationPresets,
};

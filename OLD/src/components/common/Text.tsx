/**
 * MD3 Text Component
 *
 * Material Design 3 compliant text component with typography variants.
 * Replaces hardcoded fontSize/fontWeight with MD3 type scale.
 *
 * @example
 * // Display variants (large, prominent text)
 * <Text variant="displayLarge">Hero Title</Text>
 * <Text variant="displayMedium">Main Title</Text>
 *
 * // Headline variants (section headings)
 * <Text variant="headlineLarge">Section Title</Text>
 * <Text variant="headlineMedium">Card Title</Text>
 *
 * // Title variants (cards, lists)
 * <Text variant="titleLarge">List Item</Text>
 * <Text variant="titleMedium">Subtitle</Text>
 *
 * // Body variants (content text)
 * <Text variant="bodyLarge">Description</Text>
 * <Text variant="bodyMedium">Content</Text>
 *
 * // Label variants (buttons, tabs)
 * <Text variant="labelLarge">Button</Text>
 * <Text variant="labelMedium">Tab</Text>
 *
 * // Custom color and style
 * <Text variant="headlineMedium" color="#FF5722" style={{ marginTop: 16 }}>
 *   Custom Title
 * </Text>
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleProp, TextStyle } from 'react-native';
import { Typography, TypographyStyle } from '../../theme/typography';
import { LightTheme } from '../../theme/colors';

/**
 * All available MD3 typography variants
 */
export type TypographyVariant = keyof typeof Typography;

/**
 * Text component props
 */
export interface TextProps extends Omit<RNTextProps, 'style'> {
  /**
   * MD3 typography variant
   * @default 'bodyMedium'
   */
  variant?: TypographyVariant;

  /**
   * Text color (hex or LightTheme color)
   * @default LightTheme.OnSurface
   */
  color?: string;

  /**
   * Custom style override
   * Applied after variant styles
   */
  style?: StyleProp<TextStyle>;

  /**
   * Child content
   */
  children: React.ReactNode;
}

/**
 * MD3 Text Component
 *
 * Provides consistent typography using Material Design 3 type scale.
 * Automatically applies fontSize, lineHeight, fontWeight, letterSpacing per variant.
 */
const Text: React.FC<TextProps> = ({
  variant = 'bodyMedium',
  color = LightTheme.OnSurface,
  style,
  children,
  ...restProps
}) => {
  // Get typography styles for the variant
  const typographyStyle: TypographyStyle = Typography[variant];

  // Combine typography variant with color and custom style
  const textStyle: StyleProp<TextStyle> = [
    {
      fontSize: typographyStyle.fontSize,
      lineHeight: typographyStyle.lineHeight,
      fontWeight: typographyStyle.fontWeight,
      letterSpacing: typographyStyle.letterSpacing,
      color,
    },
    style,
  ];

  return (
    <RNText style={textStyle} {...restProps}>
      {children}
    </RNText>
  );
};

/**
 * Typography variant reference guide
 *
 * Display variants:
 * - displayLarge: 57sp/64lh, -0.25sp tracking (hero text)
 * - displayMedium: 45sp/52lh, 0sp tracking (main headings)
 * - displaySmall: 36sp/44lh, 0sp tracking (page titles)
 *
 * Headline variants:
 * - headlineLarge: 32sp/40lh, 0sp tracking (section headers)
 * - headlineMedium: 28sp/36lh, 0sp tracking (card headers)
 * - headlineSmall: 24sp/32lh, 0sp tracking (list headers)
 *
 * Title variants:
 * - titleLarge: 22sp/28lh, 0sp tracking (prominent titles)
 * - titleMedium: 16sp/24lh, 0.15sp tracking (subtitles)
 * - titleSmall: 14sp/20lh, 0.1sp tracking (list items)
 *
 * Body variants:
 * - bodyLarge: 16sp/24lh, 0.5sp tracking (main content)
 * - bodyMedium: 14sp/20lh, 0.25sp tracking (secondary content)
 * - bodySmall: 12sp/16lh, 0.4sp tracking (captions)
 *
 * Label variants:
 * - labelLarge: 14sp/20lh, 0.1sp tracking (buttons)
 * - labelMedium: 12sp/16lh, 0.5sp tracking (tabs, chips)
 * - labelSmall: 11sp/16lh, 0.5sp tracking (small labels)
 */

export default Text;

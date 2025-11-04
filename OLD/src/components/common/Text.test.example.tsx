/**
 * MD3 Typography Variants - Visual Test Example
 *
 * This file demonstrates all 15 MD3 typography variants.
 * Use this as a reference screen to visually test typography implementation.
 *
 * To test: Create a screen that imports and renders <TypographyShowcase />
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Text from './Text';
import { LightTheme } from '../../theme/colors';

/**
 * Typography Showcase Component
 *
 * Renders all 15 MD3 typography variants for visual verification.
 */
export const TypographyShowcase: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Display Variants */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Display Variants (Hero Text)
          </Text>

          <Text variant="displayLarge" style={styles.example}>
            Display Large (57sp/64lh)
          </Text>

          <Text variant="displayMedium" style={styles.example}>
            Display Medium (45sp/52lh)
          </Text>

          <Text variant="displaySmall" style={styles.example}>
            Display Small (36sp/44lh)
          </Text>
        </View>

        {/* Headline Variants */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Headline Variants (Section Headers)
          </Text>

          <Text variant="headlineLarge" style={styles.example}>
            Headline Large (32sp/40lh)
          </Text>

          <Text variant="headlineMedium" style={styles.example}>
            Headline Medium (28sp/36lh)
          </Text>

          <Text variant="headlineSmall" style={styles.example}>
            Headline Small (24sp/32lh)
          </Text>
        </View>

        {/* Title Variants */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Title Variants (Cards, Lists)
          </Text>

          <Text variant="titleLarge" style={styles.example}>
            Title Large (22sp/28lh) - Prominent Titles
          </Text>

          <Text variant="titleMedium" style={styles.example}>
            Title Medium (16sp/24lh) - Subtitles
          </Text>

          <Text variant="titleSmall" style={styles.example}>
            Title Small (14sp/20lh) - List Items
          </Text>
        </View>

        {/* Body Variants */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Body Variants (Content Text)
          </Text>

          <Text variant="bodyLarge" style={styles.example}>
            Body Large (16sp/24lh) - Main content text for longer paragraphs.
            This variant provides good readability for sustained reading.
          </Text>

          <Text variant="bodyMedium" style={styles.example}>
            Body Medium (14sp/20lh) - Secondary content text. Used for
            descriptions, captions, and supporting information.
          </Text>

          <Text variant="bodySmall" style={styles.example}>
            Body Small (12sp/16lh) - Small captions and footnotes. Use
            sparingly for less important information.
          </Text>
        </View>

        {/* Label Variants */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Label Variants (Buttons, Tabs)
          </Text>

          <View style={styles.labelExample}>
            <Text variant="labelLarge">Label Large (14sp) - Buttons</Text>
          </View>

          <View style={styles.labelExample}>
            <Text variant="labelMedium">Label Medium (12sp) - Tabs</Text>
          </View>

          <View style={styles.labelExample}>
            <Text variant="labelSmall">Label Small (11sp) - Chips</Text>
          </View>
        </View>

        {/* Color Examples */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Custom Colors
          </Text>

          <Text
            variant="headlineMedium"
            color={LightTheme.Primary}
            style={styles.example}
          >
            Primary Color Text
          </Text>

          <Text
            variant="headlineMedium"
            color={LightTheme.Secondary}
            style={styles.example}
          >
            Secondary Color Text
          </Text>

          <Text
            variant="headlineMedium"
            color={LightTheme.Error}
            style={styles.example}
          >
            Error Color Text
          </Text>

          <Text
            variant="headlineMedium"
            color={LightTheme.OnSurfaceVariant}
            style={styles.example}
          >
            Surface Variant Text
          </Text>
        </View>

        {/* Combined Styles */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Custom Style Override
          </Text>

          <Text
            variant="titleLarge"
            color={LightTheme.Primary}
            style={[styles.example, { textAlign: 'center', fontStyle: 'italic' }]}
          >
            Centered Italic Title
          </Text>

          <Text
            variant="bodyMedium"
            style={[
              styles.example,
              {
                textDecorationLine: 'underline',
                textDecorationColor: LightTheme.Primary,
              },
            ]}
          >
            Underlined Body Text
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightTheme.Surface,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: LightTheme.Primary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  example: {
    marginBottom: 12,
  },
  labelExample: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
});

/**
 * Usage:
 *
 * 1. Import in a test screen:
 *    import { TypographyShowcase } from '../components/common/Text.test.example';
 *
 * 2. Render:
 *    <TypographyShowcase />
 *
 * 3. Verify visually:
 *    - All 15 variants render correctly
 *    - Font sizes match MD3 spec
 *    - Line heights are correct
 *    - Letter spacing is applied
 *    - Colors work correctly
 *    - Custom styles override properly
 */

export default TypographyShowcase;

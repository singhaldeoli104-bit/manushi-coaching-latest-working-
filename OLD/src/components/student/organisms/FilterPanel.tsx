/**
 * MD3 FilterPanel Component for Student Screens
 *
 * Material Design 3 compliant filter panel that slides in from right
 *
 * Features:
 * - Slide-in animation from right
 * - Multiple filter categories
 * - Checkbox groups for multi-select
 * - Radio groups for single-select
 * - Apply and Reset buttons
 * - Active filter count badge
 *
 * Usage:
 * <FilterPanel
 *   visible={showFilters}
 *   onClose={() => setShowFilters(false)}
 *   onApply={handleApplyFilters}
 *   filters={[
 *     {
 *       category: 'Subject',
 *       type: 'multi-select',
 *       options: ['Math', 'Science', 'English']
 *     },
 *     {
 *       category: 'Status',
 *       type: 'single-select',
 *       options: ['Pending', 'Submitted', 'Graded']
 *     }
 *   ]}
 * />
 */

import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Animated,
  BackHandler,
  Pressable,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';

// Filter Type
type FilterType = 'multi-select' | 'single-select';

// Filter Category
export interface FilterCategory {
  /** Category name */
  category: string;

  /** Filter type */
  type: FilterType;

  /** Available options */
  options: string[];

  /** Currently selected options */
  selected?: string[];
}

export interface FilterPanelProps {
  /** Panel visibility */
  visible: boolean;

  /** Close handler */
  onClose: () => void;

  /** Apply filters handler */
  onApply: (filters: Record<string, string[]>) => void;

  /** Filter categories */
  filters: FilterCategory[];

  /** Custom container style */
  style?: ViewStyle;
}

/**
 * MD3 FilterPanel Component
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  visible,
  onClose,
  onApply,
  filters,
  style,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets(); // ✅ FIX: Add safe area insets

  // Initialize selected filters
  useEffect(() => {
    const initial: Record<string, string[]> = {};
    filters.forEach((filter) => {
      initial[filter.category] = filter.selected || [];
    });
    setSelectedFilters(initial);
  }, [filters]);

  // Animate panel appearance
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 250, // MD3: 250ms slide in
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200, // MD3: 200ms slide out
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Handle hardware back button (Android)
  useEffect(() => {
    if (!visible) return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });

    return () => backHandler.remove();
  }, [visible, onClose]);

  // Toggle filter option
  const toggleOption = (category: string, option: string, type: FilterType) => {
    setSelectedFilters((prev) => {
      const current = prev[category] || [];

      if (type === 'single-select') {
        // Single-select: Replace selection
        return {
          ...prev,
          [category]: current.includes(option) ? [] : [option],
        };
      } else {
        // Multi-select: Toggle option
        return {
          ...prev,
          [category]: current.includes(option)
            ? current.filter((o) => o !== option)
            : [...current, option],
        };
      }
    });
  };

  // Reset all filters
  const handleReset = () => {
    const reset: Record<string, string[]> = {};
    filters.forEach((filter) => {
      reset[filter.category] = [];
    });
    setSelectedFilters(reset);
  };

  // Apply filters and close
  const handleApply = () => {
    onApply(selectedFilters);
    onClose();
  };

  // Count active filters
  const activeFiltersCount = Object.values(selectedFilters).reduce(
    (count, selected) => count + selected.length,
    0
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.32],
            }),
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Filter Panel */}
      <Animated.View
        style={[
          styles.panel,
          {
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [400, 0], // Slide from right
                }),
              },
            ],
          },
          style,
        ]}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Filters</Text>
            {activeFiltersCount > 0 && (
              <View style={styles.headerBadge}>
                <Badge value={activeFiltersCount} variant="info" size="standard" />
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            accessibilityLabel="Close filters panel"
            accessibilityRole="button"
            accessibilityHint="Dismisses the filter panel without applying changes"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Categories */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filters.map((filter) => (
            <View key={filter.category} style={styles.category}>
              <Animated.Text style={styles.categoryTitle}>
                {filter.category}
              </Animated.Text>

              {filter.options.map((option) => {
                const isSelected = selectedFilters[filter.category]?.includes(option);

                return (
                  <TouchableOpacity
                    key={option}
                    style={styles.option}
                    onPress={() => toggleOption(filter.category, option, filter.type)}
                    accessibilityRole={
                      filter.type === 'single-select' ? 'radio' : 'checkbox'
                    }
                    accessibilityState={{ checked: isSelected }}
                  >
                    <View style={styles.optionCheckbox}>
                      {filter.type === 'single-select' ? (
                        <View
                          style={[
                            styles.radio,
                            isSelected && styles.radioSelected,
                          ]}
                        >
                          {isSelected && <View style={styles.radioDot} />}
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.checkbox,
                            isSelected && styles.checkboxSelected,
                          ]}
                        >
                          {isSelected && <Animated.Text style={styles.checkmark}>✓</Animated.Text>}
                        </View>
                      )}
                    </View>
                    <Animated.Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Animated.Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Button variant="outlined" onPress={handleReset} style={styles.footerButton}>
            Reset
          </Button>
          <Button variant="filled" onPress={handleApply} style={styles.footerButton}>
            Apply
          </Button>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Backdrop
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: LightTheme.Scrim,
  },

  // Panel
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 320, // MD3: 320dp width for side panel
    backgroundColor: LightTheme.Surface,
    elevation: 4,
    shadowColor: LightTheme.Shadow,
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64, // MD3: 64dp app bar height
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.OutlineVariant,
  },

  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerTitle: {
    ...Typography.titleLarge, // MD3: 22px/28/400
    color: LightTheme.OnSurface,
  },

  headerBadge: {
    marginLeft: 4,
  },

  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    ...Typography.headlineSmall, // MD3: 24px (icon size)
    color: LightTheme.OnSurface,
  },

  // Content
  content: {
    flex: 1,
    padding: 16,
  },

  // Category
  category: {
    marginBottom: 24,
  },

  categoryTitle: {
    ...Typography.titleMedium, // MD3: 16px/24/500
    color: LightTheme.OnSurface,
    marginBottom: 12,
  },

  // Option
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  optionCheckbox: {
    width: 40,
    alignItems: 'center',
  },

  // Checkbox
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: LightTheme.OnSurfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxSelected: {
    backgroundColor: LightTheme.Primary,
    borderColor: LightTheme.Primary,
  },

  checkmark: {
    ...Typography.labelLarge, // MD3: 14px/20/500
    fontWeight: '600', // Override for icon visibility
    color: LightTheme.OnPrimary,
  },

  // Radio
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: LightTheme.OnSurfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioSelected: {
    borderColor: LightTheme.Primary,
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: LightTheme.Primary,
  },

  // Option Text
  optionText: {
    flex: 1,
    ...Typography.bodyLarge, // MD3: 16px/24/400
    color: LightTheme.OnSurface,
  },

  optionTextSelected: {
    color: LightTheme.Primary,
    fontWeight: '500',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: LightTheme.OutlineVariant,
  },

  footerButton: {
    flex: 1,
  },
});

export default FilterPanel;

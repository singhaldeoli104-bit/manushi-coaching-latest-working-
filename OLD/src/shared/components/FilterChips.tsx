/**
 * FilterChips - Reusable Filter Component
 * Purpose: Horizontal scrolling filter chips with active state
 * Design: Material Design 3 chips with minimal UI changes
 * ✅ NO NEW PACKAGES REQUIRED - Uses existing React Native components
 */

import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { T } from '../../ui';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterChipsProps {
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  style?: ViewStyle;
  showCounts?: boolean;
}

/**
 * FilterChips Component
 *
 * Usage:
 * ```tsx
 * const filters = [
 *   { value: 'all', label: 'All' },
 *   { value: 'active', label: 'Active', count: 5 },
 *   { value: 'completed', label: 'Completed', count: 12 },
 * ];
 *
 * <FilterChips
 *   options={filters}
 *   selectedValue={selectedFilter}
 *   onSelect={setSelectedFilter}
 *   showCounts
 * />
 * ```
 */
export const FilterChips: React.FC<FilterChipsProps> = ({
  options,
  selectedValue,
  onSelect,
  style,
  showCounts = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((option) => {
          const isSelected = option.value === selectedValue;

          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.chip,
                isSelected && styles.chipActive,
              ]}
              onPress={() => onSelect(option.value)}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${option.label}`}
              accessibilityState={{ selected: isSelected }}
            >
              <T
                variant="body"
                weight={isSelected ? 'bold' : 'regular'}
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextActive,
                ]}
              >
                {option.label}
                {showCounts && option.count !== undefined && ` (${option.count})`}
              </T>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: '#6200EA',
    borderColor: '#6200EA',
  },
  chipText: {
    fontSize: 14,
    color: '#424242',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});

export default FilterChips;

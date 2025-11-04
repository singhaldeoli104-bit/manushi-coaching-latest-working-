/**
 * MD3 SearchBar Component for Student Screens
 *
 * Material Design 3 compliant search bar with debouncing
 *
 * Features:
 * - 56dp height (MD3 spec)
 * - Leading search icon (24dp)
 * - Trailing clear button (conditional)
 * - Optional voice search icon
 * - Debounced search (300ms default)
 * - Focus/blur states
 *
 * Usage:
 * <SearchBar
 *   value={searchQuery}
 *   onSearch={setSearchQuery}
 *   placeholder="Search assignments..."
 *   showVoiceSearch
 *   debounceMs={300}
 * />
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';

export interface SearchBarProps {
  /** Current search value */
  value: string;

  /** Search callback (debounced) */
  onSearch: (query: string) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Show voice search icon */
  showVoiceSearch?: boolean;

  /** Debounce delay in milliseconds */
  debounceMs?: number;

  /** Voice search handler */
  onVoiceSearch?: () => void;

  /** Custom container style */
  style?: ViewStyle;

  /** Auto focus on mount */
  autoFocus?: boolean;
}

/**
 * MD3 SearchBar Component
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onSearch,
  placeholder = 'Search...',
  showVoiceSearch = false,
  debounceMs = 300,
  onVoiceSearch,
  style,
  autoFocus = false,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced search
  const handleChange = (text: string) => {
    setLocalValue(text);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      onSearch(text);
    }, debounceMs);
  };

  // Clear search
  const handleClear = () => {
    setLocalValue('');
    onSearch('');
    inputRef.current?.focus();
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <View style={[styles.container, isFocused && styles.containerFocused, style]}>
      {/* Leading Search Icon */}
      <View style={styles.leadingIcon}>
        <SearchIcon color={isFocused ? LightTheme.Primary : LightTheme.OnSurfaceVariant} />
      </View>

      {/* Text Input */}
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={localValue}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={LightTheme.OnSurfaceVariant}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus={autoFocus}
        returnKeyType="search"
        clearButtonMode="never" // We use custom clear button
      />

      {/* Trailing Icons */}
      <View style={styles.trailingIcons}>
        {/* Clear Button (conditional) */}
        {localValue.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.iconButton}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <ClearIcon color={LightTheme.OnSurfaceVariant} />
          </TouchableOpacity>
        )}

        {/* Voice Search Button (optional) */}
        {showVoiceSearch && (
          <TouchableOpacity
            onPress={onVoiceSearch}
            style={styles.iconButton}
            accessibilityLabel="Voice search"
            accessibilityRole="button"
          >
            <MicIcon color={LightTheme.OnSurfaceVariant} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

/**
 * Search Icon (24dp)
 */
const SearchIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={styles.icon}>
    <View
      style={[
        styles.searchIconCircle,
        { borderColor: color },
      ]}
    />
    <View
      style={[
        styles.searchIconHandle,
        { backgroundColor: color },
      ]}
    />
  </View>
);

/**
 * Clear Icon (24dp)
 */
const ClearIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={styles.icon}>
    <View style={styles.clearIconContainer}>
      <View style={[styles.clearIconLine, { backgroundColor: color, transform: [{ rotate: '45deg' }] }]} />
      <View style={[styles.clearIconLine, { backgroundColor: color, transform: [{ rotate: '-45deg' }] }]} />
    </View>
  </View>
);

/**
 * Mic Icon (24dp)
 */
const MicIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={styles.icon}>
    <View style={[styles.micIconOval, { borderColor: color }]} />
    <View style={[styles.micIconStand, { backgroundColor: color }]} />
    <View style={[styles.micIconBase, { backgroundColor: color }]} />
  </View>
);

const styles = StyleSheet.create({
  // Container
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56, // MD3: 56dp height
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 28, // MD3: Fully rounded
    paddingHorizontal: 16,
    elevation: 1,
    shadowColor: LightTheme.Shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  containerFocused: {
    elevation: 2,
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  // Leading Icon
  leadingIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },

  // Text Input
  input: {
    flex: 1,
    ...Typography.bodyLarge, // MD3: Body Large (16px/24/400)
    color: LightTheme.OnSurface,
    padding: 0, // Remove default padding
  },

  // Trailing Icons
  trailingIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },

  // Icon Base (24dp)
  icon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Search Icon
  searchIconCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    position: 'absolute',
    top: 2,
    left: 2,
  },
  searchIconHandle: {
    width: 2,
    height: 8,
    position: 'absolute',
    bottom: 2,
    right: 4,
    transform: [{ rotate: '45deg' }],
  },

  // Clear Icon
  clearIconContainer: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIconLine: {
    width: 16,
    height: 2,
    borderRadius: 1,
    position: 'absolute',
  },

  // Mic Icon
  micIconOval: {
    width: 10,
    height: 14,
    borderRadius: 5,
    borderWidth: 2,
    position: 'absolute',
    top: 0,
  },
  micIconStand: {
    width: 2,
    height: 6,
    position: 'absolute',
    bottom: 0,
  },
  micIconBase: {
    width: 10,
    height: 2,
    borderRadius: 1,
    position: 'absolute',
    bottom: 0,
  },
});

export default SearchBar;

/**
 * ViewToggle - Reusable View Mode Toggle Component
 * Purpose: Toggle between different view modes (list/grid, compact/detailed, etc.)
 * Design: Minimal icon-based toggle buttons
 * ✅ NO NEW PACKAGES REQUIRED - Uses existing React Native components
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { T } from '../../ui';

export interface ViewMode {
  value: string;
  icon: string;
  label: string;
}

export interface ViewToggleProps {
  modes: ViewMode[];
  selectedMode: string;
  onModeChange: (mode: string) => void;
  style?: ViewStyle;
  size?: 'small' | 'medium';
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  modes,
  selectedMode,
  onModeChange,
  style,
  size = 'medium',
}) => {
  const iconSize = size === 'small' ? 18 : 22;
  const buttonSize = size === 'small' ? 32 : 40;

  return (
    <View style={[styles.container, style]}>
      {modes.map((mode) => {
        const isSelected = mode.value === selectedMode;

        return (
          <TouchableOpacity
            key={mode.value}
            style={[
              styles.button,
              { width: buttonSize, height: buttonSize },
              isSelected && styles.buttonActive,
            ]}
            onPress={() => onModeChange(mode.value)}
            accessibilityRole="button"
            accessibilityLabel={`Switch to ${mode.label} view`}
            accessibilityState={{ selected: isSelected }}
          >
            <T
              style={[
                styles.icon,
                { fontSize: iconSize },
                isSelected && styles.iconActive,
              ]}
            >
              {mode.icon}
            </T>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonActive: {
    backgroundColor: '#6200EA',
    borderColor: '#6200EA',
  },
  icon: {
    color: '#424242',
  },
  iconActive: {
    color: '#FFFFFF',
  },
});

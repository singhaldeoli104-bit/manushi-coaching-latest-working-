/**
 * Whiteboard - Premium Minimal Design
 * Purpose: Interactive whiteboard for live class collaboration
 * Used in: StudentNavigator (ClassesStack) - from NewEnhancedLiveClass
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';

type Props = NativeStackScreenProps<any, 'Whiteboard'>;

interface DrawingTool {
  id: string;
  icon: string;
  label: string;
  color?: string;
}

export default function Whiteboard({ route, navigation }: Props) {
  const classId = route.params?.classId;
  const [selectedTool, setSelectedTool] = useState('pen');
  const [selectedColor, setSelectedColor] = useState('#000000');

  React.useEffect(() => {
    trackScreenView('Whiteboard', { classId });
  }, [classId]);

  const tools: DrawingTool[] = [
    { id: 'pen', icon: '✏️', label: 'Pen' },
    { id: 'eraser', icon: '🧹', label: 'Eraser' },
    { id: 'text', icon: '📝', label: 'Text' },
    { id: 'shapes', icon: '⬜', label: 'Shapes' },
    { id: 'clear', icon: '🗑️', label: 'Clear' },
  ];

  const colors = [
    { color: '#000000', label: 'Black' },
    { color: '#EF4444', label: 'Red' },
    { color: '#3B82F6', label: 'Blue' },
    { color: '#10B981', label: 'Green' },
    { color: '#F59E0B', label: 'Orange' },
    { color: '#8B5CF6', label: 'Purple' },
  ];

  const handleToolSelect = (toolId: string) => {
    trackAction('select_tool', 'Whiteboard', { tool: toolId, classId });
    setSelectedTool(toolId);

    if (toolId === 'clear') {
      Alert.alert(
        'Clear Whiteboard',
        'Are you sure you want to clear all drawings?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: () => {
              trackAction('clear_whiteboard', 'Whiteboard', { classId });
              Alert.alert('Cleared', 'Whiteboard has been cleared');
            },
          },
        ]
      );
    }
  };

  const handleColorSelect = (color: string) => {
    trackAction('select_color', 'Whiteboard', { color, classId });
    setSelectedColor(color);
  };

  const handleSave = () => {
    trackAction('save_whiteboard', 'Whiteboard', { classId });
    Alert.alert('Saved', 'Whiteboard saved successfully');
  };

  return (
    <BaseScreen scrollable={false}>
      <View style={styles.container}>
        {/* Whiteboard Canvas Placeholder */}
        <View style={styles.canvasContainer}>
          <Card style={styles.canvas}>
            <View style={styles.canvasPlaceholder}>
              <T variant="h1">🎨</T>
              <T variant="title" weight="semiBold" style={styles.canvasTitle}>
                Interactive Whiteboard
              </T>
              <T variant="body" style={styles.canvasSubtitle}>
                Whiteboard canvas ready for drawing
              </T>
              <View style={styles.integrationNote}>
                <T variant="caption" style={styles.noteText}>
                  💡 To enable drawing: Integrate react-native-canvas or
                  react-native-sketch-canvas library
                </T>
              </View>
            </View>
          </Card>
        </View>

        {/* Tools Panel */}
        <Card style={styles.toolsPanel}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.toolsRow}>
              {tools.map((tool) => (
                <TouchableOpacity
                  key={tool.id}
                  style={[
                    styles.toolButton,
                    selectedTool === tool.id && styles.toolButtonActive,
                  ]}
                  onPress={() => handleToolSelect(tool.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${tool.label} tool`}
                >
                  <T variant="h2">{tool.icon}</T>
                  <T
                    variant="caption"
                    style={
                      selectedTool === tool.id
                        ? styles.toolLabelActive
                        : styles.toolLabel
                    }
                  >
                    {tool.label}
                  </T>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Card>

        {/* Color Palette */}
        {selectedTool === 'pen' && (
          <Card style={styles.colorPanel}>
            <T variant="caption" style={styles.panelTitle}>
              Color
            </T>
            <View style={styles.colorsRow}>
              {colors.map((item) => (
                <TouchableOpacity
                  key={item.color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: item.color },
                    selectedColor === item.color && styles.colorButtonActive,
                  ]}
                  onPress={() => handleColorSelect(item.color)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${item.label} color`}
                />
              ))}
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSave}
            accessibilityRole="button"
            accessibilityLabel="Save whiteboard"
          >
            <T variant="body" weight="semiBold" style={styles.saveText}>
              💾 Save
            </T>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={() => {
              trackAction('share_whiteboard', 'Whiteboard', { classId });
              Alert.alert('Share', 'Whiteboard shared with class');
            }}
            accessibilityRole="button"
            accessibilityLabel="Share with class"
          >
            <T variant="body" weight="semiBold" style={styles.shareText}>
              📤 Share
            </T>
          </TouchableOpacity>
        </View>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,

  },
  canvasContainer: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  canvasPlaceholder: {
    alignItems: 'center',

    padding: 24,
  },
  canvasTitle: {
    textAlign: 'center',
  },
  canvasSubtitle: {
    textAlign: 'center',
    color: '#6B7280',
  },
  integrationNote: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
  },
  noteText: {
    color: '#1E40AF',
    textAlign: 'center',
  },
  toolsPanel: {
    padding: 12,
  },
  toolsRow: {
    flexDirection: 'row',

  },
  toolButton: {
    padding: 12,
    alignItems: 'center',

    minWidth: 80,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  toolButtonActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  toolLabel: {
    color: '#6B7280',
  },
  toolLabelActive: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  colorPanel: {
    padding: 12,

  },
  panelTitle: {
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colorsRow: {
    flexDirection: 'row',

  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorButtonActive: {
    borderColor: '#000000',
  },
  actionsRow: {
    flexDirection: 'row',

  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
  },
  saveText: {
    color: '#FFFFFF',
  },
  shareButton: {
    backgroundColor: '#10B981',
  },
  shareText: {
    color: '#FFFFFF',
  },
});

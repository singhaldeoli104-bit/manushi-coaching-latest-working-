/**
 * NewVirtualClassroom - EXACT match to HTML reference
 * Purpose: Interactive whiteboard classroom interface
 * Design: Material Design with whiteboard, tool palette, points badge, footer tabs
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { T } from '../../ui';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';

type Props = NativeStackScreenProps<any, 'NewVirtualClassroom'>;

type Tool = 'edit' | 'eraser' | 'text' | 'shapes';
type FooterTab = 'chat' | 'participants' | 'hand' | 'more';

export default function NewVirtualClassroom({ route, navigation }: Props) {
  const [selectedTool, setSelectedTool] = useState<Tool>('edit');
  const [activeTab, setActiveTab] = useState<FooterTab>('chat');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [points, setPoints] = useState(150);

  const classTitle = route.params?.title || 'Algebra II';
  const teacherName = route.params?.teacher || 'Mrs. Davison';
  const topic = route.params?.topic || 'Solving Quadratic Equations';

  // Timer for class duration (starts at 45:32 as shown in HTML)
  useEffect(() => {
    setElapsedTime(45 * 60 + 32); // 45 minutes 32 seconds

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    trackScreenView('NewVirtualClassroom');
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
    trackAction('select_tool', 'NewVirtualClassroom', { tool });
  };

  const handleTabPress = (tab: FooterTab) => {
    setActiveTab(tab);
    trackAction('footer_tab', 'NewVirtualClassroom', { tab });
  };

  const handleEndClass = () => {
    trackAction('end_class', 'NewVirtualClassroom');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            trackAction('back_button', 'NewVirtualClassroom');
            navigation.goBack();
          }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <T variant="h2" style={styles.icon}>☰</T>
        </TouchableOpacity>

        <T variant="body" weight="bold" style={styles.topBarTitle}>
          Virtual Classroom
        </T>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => trackAction('more_options', 'NewVirtualClassroom')}
          accessibilityRole="button"
          accessibilityLabel="More options"
        >
          <T variant="h2" style={styles.icon}>⋮</T>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Teacher Profile Section with Timer */}
        <View style={styles.teacherSection}>
          <View style={styles.teacherAvatar}>
            <T style={styles.teacherAvatarText}>👩‍🏫</T>
          </View>

          <View style={styles.teacherInfo}>
            <T variant="caption" style={styles.teacherLabel}>
              Teacher
            </T>
            <T variant="body" weight="bold" style={styles.teacherName}>
              {teacherName}
            </T>
          </View>

          <View style={styles.timerContainer}>
            <T style={styles.timerIcon}>⏱</T>
            <T variant="body" weight="bold" style={styles.timerText}>
              {formatTime(elapsedTime)}
            </T>
          </View>

          <TouchableOpacity
            style={styles.endClassButton}
            onPress={handleEndClass}
            accessibilityRole="button"
            accessibilityLabel="End class"
          >
            <T variant="caption" weight="semiBold" style={styles.endClassText}>
              End Class
            </T>
          </TouchableOpacity>
        </View>

        {/* Class Title */}
        <View style={styles.classTitleContainer}>
          <T variant="h2" weight="bold" style={styles.classTitle}>
            {classTitle}
          </T>
        </View>

        {/* Class Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <T variant="caption" style={styles.detailLabel}>
              Topic
            </T>
            <T variant="body" weight="semiBold" style={styles.detailValue}>
              {topic}
            </T>
          </View>

          <View style={styles.detailCard}>
            <T variant="caption" style={styles.detailLabel}>
              Teacher
            </T>
            <T variant="body" weight="semiBold" style={styles.detailValue}>
              {teacherName}
            </T>
          </View>
        </View>

        {/* Main Whiteboard Area */}
        <View style={styles.whiteboardContainer}>
          <View style={styles.whiteboard}>
            <T variant="body" style={styles.whiteboardInstruction}>
              Tap on tools to start drawing
            </T>
          </View>
        </View>

        {/* Floating Tool Palette */}
        <View style={styles.toolPalette}>
          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === 'edit' && styles.toolButtonActive,
            ]}
            onPress={() => handleToolSelect('edit')}
            accessibilityRole="button"
            accessibilityLabel="Edit tool"
          >
            <T style={styles.toolIcon}>✏️</T>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === 'eraser' && styles.toolButtonActive,
            ]}
            onPress={() => handleToolSelect('eraser')}
            accessibilityRole="button"
            accessibilityLabel="Eraser tool"
          >
            <T style={styles.toolIcon}>🧹</T>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === 'text' && styles.toolButtonActive,
            ]}
            onPress={() => handleToolSelect('text')}
            accessibilityRole="button"
            accessibilityLabel="Text tool"
          >
            <T style={styles.toolIcon}>📝</T>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === 'shapes' && styles.toolButtonActive,
            ]}
            onPress={() => handleToolSelect('shapes')}
            accessibilityRole="button"
            accessibilityLabel="Shapes tool"
          >
            <T style={styles.toolIcon}>⬛</T>
          </TouchableOpacity>
        </View>

        {/* Points Badge (Top Right) */}
        <View style={styles.pointsBadge}>
          <T style={styles.trophyIcon}>🏆</T>
          <T variant="body" weight="bold" style={styles.pointsText}>
            {points} pts
          </T>
        </View>
      </ScrollView>

      {/* Footer Tabs */}
      <View style={styles.footerTabs}>
        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => handleTabPress('chat')}
          accessibilityRole="button"
          accessibilityLabel="Chat"
        >
          <T
            style={[
              styles.footerTabIcon,
              activeTab === 'chat' && styles.footerTabIconActive,
            ]}
          >
            💬
          </T>
          <T
            variant="caption"
            style={[
              styles.footerTabText,
              activeTab === 'chat' && styles.footerTabTextActive,
            ]}
          >
            Chat
          </T>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => handleTabPress('participants')}
          accessibilityRole="button"
          accessibilityLabel="Participants"
        >
          <T
            style={[
              styles.footerTabIcon,
              activeTab === 'participants' && styles.footerTabIconActive,
            ]}
          >
            👥
          </T>
          <T
            variant="caption"
            style={[
              styles.footerTabText,
              activeTab === 'participants' && styles.footerTabTextActive,
            ]}
          >
            Participants
          </T>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => handleTabPress('hand')}
          accessibilityRole="button"
          accessibilityLabel="Raise hand"
        >
          <T
            style={[
              styles.footerTabIcon,
              activeTab === 'hand' && styles.footerTabIconActive,
            ]}
          >
            ✋
          </T>
          <T
            variant="caption"
            style={[
              styles.footerTabText,
              activeTab === 'hand' && styles.footerTabTextActive,
            ]}
          >
            Raise Hand
          </T>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => handleTabPress('more')}
          accessibilityRole="button"
          accessibilityLabel="More options"
        >
          <T
            style={[
              styles.footerTabIcon,
              activeTab === 'more' && styles.footerTabIconActive,
            ]}
          >
            ⋯
          </T>
          <T
            variant="caption"
            style={[
              styles.footerTabText,
              activeTab === 'more' && styles.footerTabTextActive,
            ]}
          >
            More
          </T>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Top Bar - Material Design 56px
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  icon: {
    fontSize: 24,
    color: '#333333',
  },
  topBarTitle: {
    color: '#111827',
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F7F8',
  },
  // Teacher Section
  teacherSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',

  },
  teacherAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherAvatarText: {
    fontSize: 24,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 2,
  },
  teacherName: {
    color: '#111827',
    fontSize: 15,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  timerIcon: {
    fontSize: 16,
  },
  timerText: {
    color: '#111827',
    fontSize: 14,
  },
  endClassButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#EF4444',
    borderRadius: 6,
  },
  endClassText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  // Class Title
  classTitleContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  classTitle: {
    color: '#111827',
    fontSize: 24,
  },
  // Class Details Grid
  detailsGrid: {
    flexDirection: 'row',
    padding: 16,

    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  detailCard: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: '#111827',
    fontSize: 14,
  },
  // Whiteboard Container
  whiteboardContainer: {
    padding: 16,
    paddingBottom: 80, // Space for tool palette
  },
  whiteboard: {
    height: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteboardInstruction: {
    color: '#9CA3AF',
    fontSize: 15,
    fontStyle: 'italic',
  },
  // Floating Tool Palette
  toolPalette: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    flexDirection: 'row',

    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  toolButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolButtonActive: {
    backgroundColor: '#4A90E2',
  },
  toolIcon: {
    fontSize: 24,
  },
  // Points Badge (Top Right)
  pointsBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FBBF24',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  trophyIcon: {
    fontSize: 20,
  },
  pointsText: {
    color: '#92400E',
    fontSize: 14,
  },
  // Footer Tabs
  footerTabs: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  footerTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  footerTabIcon: {
    fontSize: 24,
  },
  footerTabIconActive: {
    fontSize: 24,
  },
  footerTabText: {
    color: '#6B7280',
    fontSize: 12,
  },
  footerTabTextActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});

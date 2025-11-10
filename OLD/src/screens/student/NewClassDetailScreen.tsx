/**
 * NewClassDetailScreen - EXACT match to HTML reference
 * Purpose: Class details with teacher info, materials, attendance, and assignments
 * Design: Material Design with accordions and sticky action buttons
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

type Props = NativeStackScreenProps<any, 'NewClassDetailScreen'>;

interface Material {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'link';
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  isUrgent: boolean;
}

export default function NewClassDetailScreen({ route, navigation }: Props) {
  const [materialsExpanded, setMaterialsExpanded] = useState(true);
  const [assignmentsExpanded, setAssignmentsExpanded] = useState(false);

  const title = route.params?.title || 'Biology - Cell Structure';
  const teacher = route.params?.teacher || 'Dr. Evelyn Reed';
  const department = route.params?.department || 'Biology Department';

  useEffect(() => {
    trackScreenView('NewClassDetailScreen');
  }, []);

  const materials: Material[] = [
    { id: '1', name: 'Lecture Slides.pdf', type: 'pdf' },
    { id: '2', name: 'Chapter 5 Notes.docx', type: 'docx' },
    { id: '3', name: 'Reference: Photosynthesis Explained', type: 'link' },
  ];

  const assignments: Assignment[] = [
    { id: '1', title: 'Lab Report 3', dueDate: 'Oct 28, 2024', isUrgent: true },
    { id: '2', title: 'Weekly Quiz 5', dueDate: 'Nov 01, 2024', isUrgent: false },
  ];

  const handleDownload = (material: Material) => {
    trackAction('download_material', 'NewClassDetailScreen', { materialId: material.id });
  };

  const handleDownloadAll = () => {
    trackAction('download_all_materials', 'NewClassDetailScreen');
  };

  const handleJoinClass = () => {
    trackAction('join_class', 'NewClassDetailScreen');
  };

  const handleAskDoubt = () => {
    trackAction('ask_doubt', 'NewClassDetailScreen');
  };

  const handleAssignmentPress = (assignment: Assignment) => {
    trackAction('open_assignment', 'NewClassDetailScreen', { assignmentId: assignment.id });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            trackAction('back_button', 'NewClassDetailScreen');
            navigation.goBack();
          }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <T variant="h2" style={styles.icon}>←</T>
        </TouchableOpacity>

        <T variant="body" weight="bold" style={styles.topBarTitle}>
          {title}
        </T>

        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Teacher Info Card */}
        <View style={styles.teacherCard}>
          <View style={styles.teacherAvatar}>
            <T style={styles.avatarText}>👩‍🏫</T>
          </View>
          <View style={styles.teacherInfo}>
            <T variant="body" weight="semiBold" style={styles.teacherName}>
              {teacher}
            </T>
            <T variant="caption" style={styles.department}>
              {department}
            </T>
          </View>
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <T variant="caption" style={styles.detailLabel}>
              Date
            </T>
            <T variant="caption" style={styles.detailValue}>
              Oct 26, 2024
            </T>
          </View>

          <View style={[styles.detailItem, styles.detailItemRight]}>
            <T variant="caption" style={styles.detailLabel}>
              Duration
            </T>
            <T variant="caption" style={styles.detailValue}>
              90 mins
            </T>
          </View>

          <View style={[styles.detailItem, styles.detailItemBorder]}>
            <T variant="caption" style={styles.detailLabel}>
              Time
            </T>
            <T variant="caption" style={styles.detailValue}>
              10:00 - 11:30 AM
            </T>
          </View>

          <View style={[styles.detailItem, styles.detailItemRight, styles.detailItemBorder]}>
            <T variant="caption" style={styles.detailLabel}>
              Location
            </T>
            <T variant="caption" style={styles.detailValue}>
              Room 301
            </T>
          </View>
        </View>

        {/* Status Chips */}
        <View style={styles.statusChips}>
          <View style={styles.liveChip}>
            <View style={styles.pulseDot} />
            <T variant="caption" weight="semiBold" style={styles.liveText}>
              Live
            </T>
          </View>

          <View style={styles.recordingChip}>
            <T variant="caption" weight="semiBold" style={styles.recordingText}>
              Recording Available
            </T>
          </View>
        </View>

        {/* Class Materials Accordion */}
        <View style={styles.accordion}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setMaterialsExpanded(!materialsExpanded)}
            accessibilityRole="button"
            accessibilityLabel="Toggle class materials"
          >
            <T variant="body" weight="semiBold" style={styles.accordionTitle}>
              Class Materials
            </T>
            <T
              style={[
                styles.expandIcon,
                materialsExpanded && styles.expandIconRotated,
              ]}
            >
              ▼
            </T>
          </TouchableOpacity>

          {materialsExpanded && (
            <View style={styles.accordionContent}>
              {materials.map((material) => (
                <TouchableOpacity
                  key={material.id}
                  style={styles.materialItem}
                  onPress={() => handleDownload(material)}
                  accessibilityRole="button"
                  accessibilityLabel={`Download ${material.name}`}
                >
                  <T style={styles.materialIcon}>
                    {material.type === 'pdf'
                      ? '📄'
                      : material.type === 'docx'
                      ? '📝'
                      : '🔗'}
                  </T>
                  <T variant="caption" style={styles.materialName}>
                    {material.name}
                  </T>
                  <T style={styles.actionIcon}>
                    {material.type === 'link' ? '→' : '⬇'}
                  </T>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.downloadAllButton}
                onPress={handleDownloadAll}
                accessibilityRole="button"
                accessibilityLabel="Download all materials"
              >
                <T style={styles.downloadAllIcon}>📥</T>
                <T variant="body" weight="semiBold" style={styles.downloadAllText}>
                  Download All
                </T>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Attendance Section */}
        <View style={styles.attendanceSection}>
          <T variant="body" weight="semiBold" style={styles.sectionTitle}>
            Your Attendance
          </T>
          <View style={styles.attendanceCard}>
            <View style={styles.attendanceLeft}>
              <T style={styles.checkIcon}>✓</T>
              <T variant="caption" weight="semiBold" style={styles.attendanceStatus}>
                Present
              </T>
            </View>
            <T variant="caption" style={styles.attendanceCount}>
              28 / 30 students present
            </T>
          </View>
        </View>

        {/* Related Assignments Accordion */}
        <View style={styles.accordion}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setAssignmentsExpanded(!assignmentsExpanded)}
            accessibilityRole="button"
            accessibilityLabel="Toggle related assignments"
          >
            <T variant="body" weight="semiBold" style={styles.accordionTitle}>
              Related Assignments
            </T>
            <T
              style={[
                styles.expandIcon,
                assignmentsExpanded && styles.expandIconRotated,
              ]}
            >
              ▼
            </T>
          </TouchableOpacity>

          {assignmentsExpanded && (
            <View style={styles.accordionContent}>
              {assignments.map((assignment) => (
                <TouchableOpacity
                  key={assignment.id}
                  style={styles.assignmentItem}
                  onPress={() => handleAssignmentPress(assignment)}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${assignment.title}`}
                >
                  <T style={styles.assignmentIcon}>
                    {assignment.id === '1' ? '📋' : '📝'}
                  </T>
                  <View style={styles.assignmentInfo}>
                    <T variant="caption" weight="semiBold" style={styles.assignmentTitle}>
                      {assignment.title}
                    </T>
                    <T
                      variant="caption"
                      style={[
                        styles.assignmentDue,
                        assignment.isUrgent && styles.assignmentDueUrgent,
                      ]}
                    >
                      Due: {assignment.dueDate}
                    </T>
                  </View>
                  <T style={styles.chevronIcon}>›</T>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Spacer for sticky footer */}
        <View style={styles.footerSpacer} />
      </ScrollView>

      {/* Sticky Bottom Action Buttons */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={handleJoinClass}
          accessibilityRole="button"
          accessibilityLabel="Join class"
        >
          <T style={styles.joinIcon}>📹</T>
          <T variant="body" weight="bold" style={styles.joinText}>
            Join Class
          </T>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.doubtButton}
          onPress={handleAskDoubt}
          accessibilityRole="button"
          accessibilityLabel="Ask doubt"
        >
          <T style={styles.doubtIcon}>❓</T>
          <T variant="body" weight="bold" style={styles.doubtText}>
            Ask Doubt
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
  // Top App Bar
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    backgroundColor: '#F6F7F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    color: '#111418',
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#111418',
    fontSize: 16,
    paddingHorizontal: 8,
  },
  spacer: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F7F8',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  // Teacher Card
  teacherCard: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    minHeight: 72,
    marginBottom: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  teacherAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
  },
  teacherInfo: {
    flex: 1,

  },
  teacherName: {
    color: '#111418',
    fontSize: 15,
  },
  department: {
    color: '#617589',
    fontSize: 13,
  },
  // Details Grid
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  detailItem: {
    width: '50%',
    padding: 12,

  },
  detailItemRight: {
    paddingLeft: 8,
  },
  detailItemBorder: {
    borderTopWidth: 1,
    borderTopColor: '#DBE0E6',
  },
  detailLabel: {
    color: '#617589',
    fontSize: 13,
  },
  detailValue: {
    color: '#111418',
    fontSize: 13,
  },
  // Status Chips
  statusChips: {
    flexDirection: 'row',

    marginBottom: 24,
    flexWrap: 'wrap',
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderRadius: 8,
    height: 32,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  liveText: {
    color: '#15803D',
    fontSize: 13,
  },
  recordingChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(19, 127, 236, 0.2)',
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
  },
  recordingText: {
    color: '#137FEC',
    fontSize: 13,
  },
  // Accordion
  accordion: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  accordionTitle: {
    color: '#111418',
    fontSize: 15,
  },
  expandIcon: {
    fontSize: 16,
    color: '#111418',
  },
  expandIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  accordionContent: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
    paddingTop: 8,

  },
  // Materials
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 8,
  },
  materialIcon: {
    fontSize: 24,
  },
  materialName: {
    flex: 1,
    color: '#617589',
    fontSize: 13,
  },
  actionIcon: {
    fontSize: 20,
    color: '#137FEC',
  },
  downloadAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: 12,
    marginTop: 12,
    backgroundColor: 'rgba(19, 127, 236, 0.1)',
    borderRadius: 8,
  },
  downloadAllIcon: {
    fontSize: 20,
  },
  downloadAllText: {
    color: '#137FEC',
    fontSize: 14,
  },
  // Attendance
  attendanceSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,

    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    color: '#111418',
    fontSize: 15,
  },
  attendanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F6F7F8',
    padding: 12,
    borderRadius: 8,
  },
  attendanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  checkIcon: {
    fontSize: 20,
    color: '#22C55E',
  },
  attendanceStatus: {
    color: '#111827',
    fontSize: 13,
  },
  attendanceCount: {
    color: '#6B7280',
    fontSize: 13,
  },
  // Assignments
  assignmentItem: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 8,
  },
  assignmentIcon: {
    fontSize: 24,
  },
  assignmentInfo: {
    flex: 1,

  },
  assignmentTitle: {
    color: '#111418',
    fontSize: 13,
  },
  assignmentDue: {
    color: '#617589',
    fontSize: 12,
  },
  assignmentDueUrgent: {
    color: '#EF4444',
  },
  chevronIcon: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  // Sticky Footer
  footerSpacer: {
    height: 80,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',

    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  joinButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    height: 48,
    backgroundColor: '#137FEC',
    borderRadius: 12,
  },
  joinIcon: {
    fontSize: 20,
  },
  joinText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  doubtButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    height: 48,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },
  doubtIcon: {
    fontSize: 20,
  },
  doubtText: {
    color: '#111827',
    fontSize: 15,
  },
});

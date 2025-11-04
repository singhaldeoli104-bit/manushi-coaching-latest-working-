/**
 * AttendanceTrackingScreen - Modern Teacher Attendance Management
 *
 * Features:
 * - Real-time attendance tracking
 * - Class-wise student list
 * - Mark attendance (Present/Absent/Late)
 * - Attendance statistics
 * - Real Supabase integration (NO mock data)
 */

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Col, Row, T, Card, CardContent, Badge } from '../../ui';
import { Colors, Spacing, StatusColors } from '../../theme/designSystem';
import type { TeacherStackParamList } from '../../types/navigation';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { useAuth } from '../../hooks/useAuth';
import { getTodayLocal } from '../../utils/dateHelpers';

type Props = NativeStackScreenProps<TeacherStackParamList, 'take-attendance'>;

interface AttendanceRecord {
  id: string;
  class_id: string;
  student_id: string;
  batch_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  marked_by: string | null;
  notes: string | null;
  created_at: string;
  student_name: string;
  class_title: string;
  subject: string;
}

interface Student {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  batch_id: string;
  status: string;
}

interface ClassInfo {
  id: string;
  title: string;
  subject: string;
  batch_id: string;
  scheduled_at: string;
}

const AttendanceTrackingScreen: React.FC<Props> = ({ route }) => {
  const { classId } = route.params || {};
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Get current teacher
  const teacherId = user?.id || ''; // Teacher ID for audit trail

  const [selectedDate, setSelectedDate] = useState<string>(getTodayLocal());
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const initializedRef = useRef<string>(''); // Track if we've initialized for this classId+date

  useEffect(() => {
    trackScreenView('AttendanceTracking', { classId: classId || 'none' });
  }, [classId]);

  // Fetch class info
  const {
    data: classInfo,
    isLoading: loadingClass,
    error: classError,
  } = useQuery({
    queryKey: ['class', classId],
    queryFn: async () => {
      if (!classId) return null;
      console.log('🔍 [Attendance] Fetching class info for:', classId);
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();

      if (error) {
        console.error('❌ [Attendance] Class fetch error:', error);
        throw error;
      }

      console.log('✅ [Attendance] Class loaded - Full data:', JSON.stringify(data, null, 2));
      return data as ClassInfo;
    },
    enabled: !!classId,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch students for this class
  const {
    data: students = [],
    isLoading: loadingStudents,
    error: studentsError,
  } = useQuery({
    queryKey: ['students', classInfo?.batch_id],
    queryFn: async () => {
      if (!classInfo?.batch_id) return [];
      console.log('🔍 [Attendance] Fetching students for batch:', classInfo.batch_id);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('batch_id', classInfo.batch_id)
        .eq('status', 'active')
        .order('full_name');

      if (error) {
        console.error('❌ [Attendance] Students fetch error:', error);
        throw error;
      }

      console.log('✅ [Attendance] Loaded', data?.length || 0, 'students');
      return data as Student[];
    },
    enabled: !!classInfo?.batch_id,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch existing attendance for today
  const {
    data: existingAttendance = [],
    isLoading: loadingAttendance,
    error: attendanceError,
    refetch: refetchAttendance,
  } = useQuery({
    queryKey: ['attendance', classId, selectedDate],
    queryFn: async () => {
      if (!classId) return [];
      console.log('🔍 [Attendance] Fetching attendance for:', selectedDate);
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          students:student_id(full_name),
          classes:class_id(title, subject)
        `)
        .eq('class_id', classId)
        .eq('date', selectedDate);

      if (error) {
        console.error('❌ [Attendance] Fetch error:', error);
        throw error;
      }

      const records: AttendanceRecord[] = (data || []).map((record: any) => ({
        id: record.id,
        class_id: record.class_id,
        student_id: record.student_id,
        batch_id: record.batch_id,
        date: record.date,
        status: record.status,
        marked_by: record.marked_by,
        notes: record.notes,
        created_at: record.created_at,
        student_name: record.students?.full_name || 'Unknown',
        class_title: record.classes?.title || '',
        subject: record.classes?.subject || '',
      }));

      console.log('✅ [Attendance] Loaded', records.length, 'attendance records');
      return records;
    },
    enabled: !!classId,
    staleTime: 1000 * 30,
  });

  // Initialize attendance map from existing data (only once per classId+date combination)
  useEffect(() => {
    const key = `${classId}-${selectedDate}`;
    if (initializedRef.current !== key && existingAttendance.length >= 0) {
      const map: Record<string, 'present' | 'absent' | 'late'> = {};
      existingAttendance.forEach((record) => {
        map[record.student_id] = record.status;
      });
      setAttendanceMap(map);
      initializedRef.current = key; // Mark as initialized for this combination
    }
  }, [classId, selectedDate, existingAttendance.length]); // existingAttendance.length is stable

  // Mark attendance mutation
  const markAttendanceMutation = useMutation({
    mutationFn: async ({
      studentId,
      status,
    }: {
      studentId: string;
      status: 'present' | 'absent' | 'late';
    }) => {
      if (!classId || !classInfo) throw new Error('Class info not available');

      console.log('📝 [Attendance] Marking', status, 'for student:', studentId);

      // Check if attendance already exists
      const existing = existingAttendance.find((r) => r.student_id === studentId);

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('attendance')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase.from('attendance').insert({
          class_id: classId,
          student_id: studentId,
          batch_id: classInfo.batch_id,
          date: selectedDate,
          status,
          marked_by: teacherId,
        });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', classId, selectedDate] });
      console.log('✅ [Attendance] Marked successfully');
    },
    onError: (error) => {
      console.error('❌ [Attendance] Mark error:', error);
    },
  });

  // Handle attendance change
  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    trackAction('mark_attendance', 'AttendanceTracking', { studentId, status });
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
    markAttendanceMutation.mutate({ studentId, status });
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const marked = Object.keys(attendanceMap).length;
    const total = students.length;
    const present = Object.values(attendanceMap).filter((s) => s === 'present').length;
    const absent = Object.values(attendanceMap).filter((s) => s === 'absent').length;
    const late = Object.values(attendanceMap).filter((s) => s === 'late').length;
    const percentage = total > 0 ? (present / total) * 100 : 0;
    return { marked, total, present, absent, late, percentage };
  }, [attendanceMap, students.length]);

  const isLoading = loadingClass || loadingStudents || loadingAttendance;
  const error = classError || studentsError || attendanceError;

  return (
    <BaseScreen
      scrollable={true}
      loading={isLoading}
      error={error ? 'Failed to load attendance data' : null}
      empty={!isLoading && students.length === 0}
      emptyBody="No students found in this class"
      onRetry={refetchAttendance}
    >
      <Col sx={{ p: 'md' }} gap="md">
        {/* Class Info Header */}
        {classInfo && (
          <Card variant="elevated">
            <CardContent>
              <T variant="title" weight="bold" style={{ marginBottom: Spacing.xs }}>
                {classInfo.title}
              </T>
              <Row spaceBetween style={{ marginTop: Spacing.xs }}>
                <Badge variant="info" label={classInfo.subject} />
                <T variant="caption" color="textSecondary">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </T>
              </Row>
            </CardContent>
          </Card>
        )}

        {/* Statistics Card */}
        <Card variant="elevated">
          <CardContent>
            <T variant="body" weight="semiBold" style={{ marginBottom: Spacing.sm }}>
              Today's Attendance
            </T>
            <Row spaceBetween style={{ marginTop: Spacing.sm }}>
              <View style={styles.statBox}>
                <T variant="display" weight="bold" style={{ fontSize: 28, color: Colors.primary }}>
                  {stats.marked}/{stats.total}
                </T>
                <T variant="caption" color="textSecondary">
                  Marked
                </T>
              </View>
              <View style={styles.statBox}>
                <T variant="display" weight="bold" style={{ fontSize: 28, color: StatusColors.success }}>
                  {stats.present}
                </T>
                <T variant="caption" color="textSecondary">
                  Present
                </T>
              </View>
              <View style={styles.statBox}>
                <T variant="display" weight="bold" style={{ fontSize: 28, color: StatusColors.danger }}>
                  {stats.absent}
                </T>
                <T variant="caption" color="textSecondary">
                  Absent
                </T>
              </View>
              <View style={styles.statBox}>
                <T variant="display" weight="bold" style={{ fontSize: 28, color: StatusColors.warning }}>
                  {stats.late}
                </T>
                <T variant="caption" color="textSecondary">
                  Late
                </T>
              </View>
            </Row>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${stats.percentage ?? 0}%`, backgroundColor: Colors.primary },
                ]}
              />
            </View>
            <T variant="caption" color="textSecondary" style={{ textAlign: 'center', marginTop: Spacing.xs }}>
              {(stats.percentage ?? 0).toFixed(1)}% attendance rate
            </T>
          </CardContent>
        </Card>

        {/* Student List */}
        <T variant="body" weight="semiBold" style={{ marginTop: Spacing.sm }}>
          Students ({students.length})
        </T>

        <Col gap="sm">
          {students.map((student) => {
            const status = attendanceMap[student.id];
            const isMarked = !!status;

            return (
              <Card key={student.id} variant="outlined">
                <CardContent>
                  <Row spaceBetween centerV>
                    <Col style={{ flex: 1 }}>
                      <T variant="body" weight="semiBold">
                        {student.full_name}
                      </T>
                      <T variant="caption" color="textSecondary">
                        {student.student_id}
                      </T>
                    </Col>

                    {isMarked && (
                      <Badge
                        variant={status === 'present' ? 'success' : status === 'late' ? 'warning' : 'error'}
                        label={status.toUpperCase()}
                      />
                    )}
                  </Row>

                  {/* Attendance Buttons */}
                  <Row style={{ marginTop: Spacing.sm, gap: Spacing.xs }}>
                    <TouchableOpacity
                      style={[
                        styles.attendanceButton,
                        styles.presentButton,
                        status === 'present' && styles.activeButton,
                      ]}
                      onPress={() => handleMarkAttendance(student.id, 'present')}
                      disabled={markAttendanceMutation.isPending}
                    >
                      <T
                        variant="caption"
                        weight="semiBold"
                        style={{ color: status === 'present' ? '#FFF' : StatusColors.success }}
                      >
                        ✓ Present
                      </T>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.attendanceButton,
                        styles.absentButton,
                        status === 'absent' && styles.activeButton,
                      ]}
                      onPress={() => handleMarkAttendance(student.id, 'absent')}
                      disabled={markAttendanceMutation.isPending}
                    >
                      <T
                        variant="caption"
                        weight="semiBold"
                        style={{ color: status === 'absent' ? '#FFF' : StatusColors.danger }}
                      >
                        ✕ Absent
                      </T>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.attendanceButton,
                        styles.lateButton,
                        status === 'late' && styles.activeButton,
                      ]}
                      onPress={() => handleMarkAttendance(student.id, 'late')}
                      disabled={markAttendanceMutation.isPending}
                    >
                      <T
                        variant="caption"
                        weight="semiBold"
                        style={{ color: status === 'late' ? '#FFF' : StatusColors.warning }}
                      >
                        ⏱ Late
                      </T>
                    </TouchableOpacity>
                  </Row>
                </CardContent>
              </Card>
            );
          })}
        </Col>

        {/* Empty state when no students */}
        {students.length === 0 && !isLoading && (
          <Card variant="outlined">
            <CardContent>
              <View style={{ alignItems: 'center', paddingVertical: Spacing.lg }}>
                <T variant="body" color="textSecondary">
                  No students enrolled in this class
                </T>
              </View>
            </CardContent>
          </Card>
        )}
      </Col>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: Spacing.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  attendanceButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  presentButton: {
    borderColor: StatusColors.success,
    backgroundColor: StatusColors.successBg,
  },
  absentButton: {
    borderColor: StatusColors.danger,
    backgroundColor: StatusColors.dangerBg,
  },
  lateButton: {
    borderColor: StatusColors.warning,
    backgroundColor: StatusColors.warningBg,
  },
  activeButton: {
    borderWidth: 2,
    opacity: 1,
  },
});

export default AttendanceTrackingScreen;

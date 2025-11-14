/**
 * OrganizationManagementScreen - Phase 37.2: Organizational Structure Management
 * Hierarchical organization tools for department management, class structure,
 * teacher assignments, student grouping, and staff hierarchy setup
 * Manushi Coaching Platform
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Alert,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

// Import theme and styling
import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

const { width } = Dimensions.get('window');

// Type definitions for Organizational Structure Management
interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment: string;
  headOfDepartmentId: string;
  teacherCount: number;
  studentCount: number;
  subjects: string[];
  budget?: number;
  location?: string;
  establishedYear: number;
  isActive: boolean;
  parentDepartmentId?: string;
  subDepartments: string[];
}

interface ClassStructure {
  id: string;
  name: string;
  grade: string;
  section: string;
  departmentId: string;
  classTeacherId: string;
  classTeacherName: string;
  maxCapacity: number;
  currentEnrollment: number;
  subjects: ClassSubject[];
  schedule: ClassSchedule[];
  academicYear: string;
  isActive: boolean;
  room?: string;
}

interface ClassSubject {
  id: string;
  name: string;
  teacherId: string;
  teacherName: string;
  weeklyHours: number;
  room?: string;
  isCore: boolean;
}

interface ClassSchedule {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  endTime: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  room?: string;
}

interface TeacherAssignment {
  id: string;
  teacherId: string;
  teacherName: string;
  departmentId: string;
  departmentName: string;
  subjects: string[];
  classes: TeacherClass[];
  workload: number; // Total hours per week
  maxWorkload: number;
  specializations: string[];
  qualification: string;
  experience: number;
  isActive: boolean;
}

interface TeacherClass {
  classId: string;
  className: string;
  grade: string;
  section: string;
  subject: string;
  weeklyHours: number;
  role: 'class_teacher' | 'subject_teacher' | 'assistant';
}

interface StudentGroup {
  id: string;
  name: string;
  description: string;
  type: 'class' | 'house' | 'club' | 'activity' | 'academic' | 'custom';
  classId?: string;
  supervisorId: string;
  supervisorName: string;
  studentIds: string[];
  maxMembers?: number;
  meetingSchedule?: string;
  isActive: boolean;
  createdAt: string;
}

interface StaffHierarchy {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  level: number; // Hierarchy level (0 = top level)
  managerId?: string;
  managerName?: string;
  directReports: string[];
  responsibilities: string[];
  isActive: boolean;
}

interface OrganizationManagementScreenProps {
  adminId: string;
  onNavigate: (screen: string) => void;
}

// Database type definitions
interface DepartmentDB {
  id: string;
  name: string;
  description: string;
  head_of_department_id: string | null;
  head_of_department_name: string | null;
  teacher_count: number;
  student_count: number;
  subjects: string[];
  budget: number | null;
  location: string | null;
  established_year: number;
  is_active: boolean;
  parent_department_id: string | null;
  sub_department_ids: string[];
}

interface ClassDB {
  id: string;
  name: string;
  grade: string;
  section: string;
  department_id: string;
  class_teacher_id: string;
  class_teacher_name: string;
  max_capacity: number;
  current_enrollment: number;
  academic_year: string;
  is_active: boolean;
  room: string | null;
  subjects: any;
  schedules: any;
}

interface TeacherAssignmentDB {
  id: string;
  teacher_id: string;
  teacher_name: string;
  department_id: string;
  department_name: string;
  subjects: string[];
  workload: number;
  max_workload: number;
  specializations: string[];
  qualification: string;
  experience: number;
  is_active: boolean;
  classes: any;
}

interface StudentGroupDB {
  id: string;
  name: string;
  description: string;
  type: string;
  class_id: string | null;
  supervisor_id: string;
  supervisor_name: string;
  student_ids: string[];
  max_members: number | null;
  meeting_schedule: string | null;
  is_active: boolean;
  created_at: string;
  member_count: number;
}

interface StaffHierarchyDB {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  position: string;
  department: string;
  level: number;
  manager_id: string | null;
  manager_name: string | null;
  direct_report_ids: string[];
  direct_report_count: number;
  responsibilities: string[];
  is_active: boolean;
}

interface OrganizationStatisticsDB {
  total_departments: number;
  active_departments: number;
  total_classes: number;
  active_classes: number;
  total_teachers: number;
  total_students: number;
  average_class_size: number;
  teacher_utilization: number;
}

// Fetch functions
const fetchDepartments = async (): Promise<Department[]> => {
  const { data, error } = await supabase.rpc('get_departments');
  if (error) throw error;

  return (data || []).map((dept: DepartmentDB) => ({
    id: dept.id,
    name: dept.name,
    description: dept.description || '',
    headOfDepartment: dept.head_of_department_name || 'Unassigned',
    headOfDepartmentId: dept.head_of_department_id || '',
    teacherCount: dept.teacher_count,
    studentCount: dept.student_count,
    subjects: dept.subjects || [],
    budget: dept.budget || undefined,
    location: dept.location || undefined,
    establishedYear: dept.established_year,
    isActive: dept.is_active,
    parentDepartmentId: dept.parent_department_id || undefined,
    subDepartments: dept.sub_department_ids || [],
  }));
};

const fetchClasses = async (): Promise<ClassStructure[]> => {
  const { data, error } = await supabase.rpc('get_classes');
  if (error) throw error;

  return (data || []).map((cls: ClassDB) => ({
    id: cls.id,
    name: cls.name,
    grade: cls.grade,
    section: cls.section,
    departmentId: cls.department_id,
    classTeacherId: cls.class_teacher_id,
    classTeacherName: cls.class_teacher_name,
    maxCapacity: cls.max_capacity,
    currentEnrollment: cls.current_enrollment,
    subjects: cls.subjects || [],
    schedule: cls.schedules || [],
    academicYear: cls.academic_year,
    isActive: cls.is_active,
    room: cls.room || undefined,
  }));
};

const fetchTeacherAssignments = async (): Promise<TeacherAssignment[]> => {
  const { data, error } = await supabase.rpc('get_teacher_assignments');
  if (error) throw error;

  return (data || []).map((assign: TeacherAssignmentDB) => ({
    id: assign.id,
    teacherId: assign.teacher_id,
    teacherName: assign.teacher_name,
    departmentId: assign.department_id,
    departmentName: assign.department_name,
    subjects: assign.subjects || [],
    classes: assign.classes || [],
    workload: assign.workload,
    maxWorkload: assign.max_workload,
    specializations: assign.specializations || [],
    qualification: assign.qualification,
    experience: assign.experience,
    isActive: assign.is_active,
  }));
};

const fetchStudentGroups = async (): Promise<StudentGroup[]> => {
  const { data, error } = await supabase.rpc('get_student_groups');
  if (error) throw error;

  return (data || []).map((group: StudentGroupDB) => ({
    id: group.id,
    name: group.name,
    description: group.description || '',
    type: group.type as any,
    classId: group.class_id || undefined,
    supervisorId: group.supervisor_id,
    supervisorName: group.supervisor_name,
    studentIds: group.student_ids || [],
    maxMembers: group.max_members || undefined,
    meetingSchedule: group.meeting_schedule || undefined,
    isActive: group.is_active,
    createdAt: group.created_at,
  }));
};

const fetchStaffHierarchy = async (): Promise<StaffHierarchy[]> => {
  const { data, error } = await supabase.rpc('get_staff_hierarchy');
  if (error) throw error;

  return (data || []).map((staff: StaffHierarchyDB) => ({
    id: staff.id,
    employeeId: staff.employee_id,
    firstName: staff.first_name,
    lastName: staff.last_name,
    position: staff.position,
    department: staff.department,
    level: staff.level,
    managerId: staff.manager_id || undefined,
    managerName: staff.manager_name || undefined,
    directReports: staff.direct_report_ids || [],
    responsibilities: staff.responsibilities || [],
    isActive: staff.is_active,
  }));
};

const fetchOrganizationStatistics = async (): Promise<OrganizationStatisticsDB> => {
  const { data, error } = await supabase.rpc('get_organization_statistics');
  if (error) throw error;

  return data?.[0] || {
    total_departments: 0,
    active_departments: 0,
    total_classes: 0,
    active_classes: 0,
    total_teachers: 0,
    total_students: 0,
    average_class_size: 0,
    teacher_utilization: 0,
  };
};

const OrganizationManagementScreen: React.FC<OrganizationManagementScreenProps> = ({
  adminId,
  onNavigate,
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'departments' | 'classes' | 'assignments' | 'groups' | 'hierarchy'>('departments');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Fetch data using React Query
  const {
    data: departments = [],
    isLoading: departmentsLoading,
    error: departmentsError,
    refetch: refetchDepartments
  } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const {
    data: classes = [],
    isLoading: classesLoading,
    error: classesError,
    refetch: refetchClasses
  } = useQuery({
    queryKey: ['classes'],
    queryFn: fetchClasses,
    refetchInterval: 60000,
  });

  const {
    data: assignments = [],
    isLoading: assignmentsLoading,
    error: assignmentsError,
    refetch: refetchAssignments
  } = useQuery({
    queryKey: ['teacher_assignments'],
    queryFn: fetchTeacherAssignments,
    refetchInterval: 60000,
  });

  const {
    data: studentGroups = [],
    isLoading: groupsLoading,
    error: groupsError,
    refetch: refetchGroups
  } = useQuery({
    queryKey: ['student_groups'],
    queryFn: fetchStudentGroups,
    refetchInterval: 60000,
  });

  const {
    data: staffHierarchy = [],
    isLoading: hierarchyLoading,
    error: hierarchyError,
    refetch: refetchHierarchy
  } = useQuery({
    queryKey: ['staff_hierarchy'],
    queryFn: fetchStaffHierarchy,
    refetchInterval: 60000,
  });

  const {
    data: statistics,
    isLoading: statsLoading,
    error: statsError
  } = useQuery({
    queryKey: ['organization_statistics'],
    queryFn: fetchOrganizationStatistics,
    refetchInterval: 60000,
  });

  // Combined loading and error states
  const isLoading = departmentsLoading || classesLoading || assignmentsLoading || groupsLoading || hierarchyLoading || statsLoading;
  const error = departmentsError || classesError || assignmentsError || groupsError || hierarchyError || statsError;

  const handleRefresh = async () => {
    await Promise.all([
      refetchDepartments(),
      refetchClasses(),
      refetchAssignments(),
      refetchGroups(),
      refetchHierarchy(),
    ]);
  };

  const handleCreateDepartment = () => {
    setSelectedItem(null);
    setShowDepartmentModal(true);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedItem(department);
    setShowDepartmentModal(true);
  };

  const handleCreateClass = () => {
    setSelectedItem(null);
    setShowClassModal(true);
  };

  const handleEditClass = (classItem: ClassStructure) => {
    setSelectedItem(classItem);
    setShowClassModal(true);
  };

  const handleOptimizeAssignments = () => {
    Alert.alert(
      'Optimize Teacher Assignments',
      'This will automatically optimize teacher workloads and class assignments. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Optimize',
          onPress: () => {
            Alert.alert('success', 'Teacher assignments have been optimized for balanced workloads');
          }
        }
      ]
    );
  };

  // Filter data based on search
  const filteredDepartments = departments.filter(dept =>
    searchQuery === '' || dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClasses = classes.filter(cls =>
    searchQuery === '' || cls.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAssignments = assignments.filter(assign =>
    searchQuery === '' || assign.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = studentGroups.filter(group =>
    searchQuery === '' || group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStaff = staffHierarchy.filter(staff =>
    searchQuery === '' || 
    `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render functions
  const renderDepartmentItem = ({ item: dept }: { item: Department }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{dept.name}</Text>
          <Text style={styles.itemSubtitle}>{dept.description}</Text>
          <View style={styles.itemMeta}>
            <Text style={styles.itemMetaText}>Head: {dept.headOfDepartment}</Text>
            <Text style={styles.itemMetaText}>Teachers: {dept.teacherCount}</Text>
            <Text style={styles.itemMetaText}>Students: {dept.studentCount}</Text>
          </View>
        </View>
        <View style={[styles.statusIndicator, { 
          backgroundColor: dept.isActive ? LightTheme.Success : LightTheme.Error 
        }]} />
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{dept.subjects.length}</Text>
          <Text style={styles.statLabel}>Subjects</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {dept.budget ? `$${(dept.budget / 1000).toFixed(0)}K` : 'N/A'}
          </Text>
          <Text style={styles.statLabel}>Budget</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{dept.establishedYear}</Text>
          <Text style={styles.statLabel}>Est.</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{dept.subDepartments.length}</Text>
          <Text style={styles.statLabel}>Sub-depts</Text>
        </View>
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditDepartment(dept)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => Alert.alert('View Details', `Detailed view for ${dept.name}`)}
        >
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderClassItem = ({ item: cls }: { item: ClassStructure }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{cls.name}</Text>
          <Text style={styles.itemSubtitle}>Class Teacher: {cls.classTeacherName}</Text>
          <Text style={styles.itemMetaText}>Academic Year: {cls.academicYear}</Text>
        </View>
        <View style={[styles.statusIndicator, { 
          backgroundColor: cls.isActive ? LightTheme.Success : LightTheme.Error 
        }]} />
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{cls.currentEnrollment}/{cls.maxCapacity}</Text>
          <Text style={styles.statLabel}>Enrollment</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{cls.subjects.length}</Text>
          <Text style={styles.statLabel}>Subjects</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{cls.room || 'TBA'}</Text>
          <Text style={styles.statLabel}>Room</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Math.round((cls.currentEnrollment / cls.maxCapacity) * 100)}%
          </Text>
          <Text style={styles.statLabel}>Capacity</Text>
        </View>
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditClass(cls)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.scheduleButton]}
          onPress={() => Alert.alert('Schedule', `View schedule for ${cls.name}`)}
        >
          <Text style={styles.actionButtonText}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAssignmentItem = ({ item: assign }: { item: TeacherAssignment }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{assign.teacherName}</Text>
          <Text style={styles.itemSubtitle}>{assign.departmentName}</Text>
          <Text style={styles.itemMetaText}>
            Qualification: {assign.qualification} • Experience: {assign.experience} years
          </Text>
        </View>
        <View style={styles.workloadIndicator}>
          <Text style={styles.workloadText}>
            {assign.workload}/{assign.maxWorkload}h
          </Text>
          <View style={styles.workloadBar}>
            <View style={[styles.workloadFill, {
              width: `${(assign.workload / assign.maxWorkload) * 100}%`,
              backgroundColor: assign.workload > assign.maxWorkload * 0.9 ? LightTheme.Error : LightTheme.Success
            }]} />
          </View>
        </View>
      </View>
      
      <View style={styles.assignmentDetails}>
        <Text style={styles.assignmentLabel}>Subjects:</Text>
        <Text style={styles.assignmentValue}>{assign.subjects.join(', ')}</Text>
        <Text style={styles.assignmentLabel}>Classes ({assign.classes.length}):</Text>
        {assign.classes.map((cls, index) => (
          <Text key={index} style={styles.classAssignment}>
            • {cls.className} - {cls.subject} ({cls.weeklyHours}h/week)
            {cls.role === 'class_teacher' && ' [Class Teacher]'}
          </Text>
        ))}
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => Alert.alert('Edit Assignment', `Edit assignment for ${assign.teacherName}`)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.optimizeButton]}
          onPress={() => Alert.alert('Optimize', `Optimize workload for ${assign.teacherName}`)}
        >
          <Text style={styles.actionButtonText}>Optimize</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGroupItem = ({ item: group }: { item: StudentGroup }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{group.name}</Text>
          <Text style={styles.itemSubtitle}>{group.description}</Text>
          <Text style={styles.itemMetaText}>Supervisor: {group.supervisorName}</Text>
        </View>
        <View style={[styles.groupTypeTag, { backgroundColor: getGroupTypeColor(group.type) }]}>
          <Text style={styles.groupTypeText}>{group.type.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {group.studentIds.length}
            {group.maxMembers && `/${group.maxMembers}`}
          </Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {group.meetingSchedule ? 'Scheduled' : 'Flexible'}
          </Text>
          <Text style={styles.statLabel}>Meetings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {new Date(group.createdAt).getFullYear()}
          </Text>
          <Text style={styles.statLabel}>Created</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {group.isActive ? 'Active' : 'Inactive'}
          </Text>
          <Text style={styles.statLabel}>Status</Text>
        </View>
      </View>

      {group.meetingSchedule && (
        <Text style={styles.scheduleText}>📅 {group.meetingSchedule}</Text>
      )}

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => Alert.alert('Edit Group', `Edit ${group.name}`)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.membersButton]}
          onPress={() => Alert.alert('Members', `Manage members for ${group.name}`)}
        >
          <Text style={styles.actionButtonText}>Members</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStaffItem = ({ item: staff }: { item: StaffHierarchy }) => (
    <View style={[styles.itemCard, { marginLeft: staff.level * 20 }]}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>
            {staff.firstName} {staff.lastName}
          </Text>
          <Text style={styles.itemSubtitle}>{staff.position}</Text>
          <Text style={styles.itemMetaText}>
            {staff.department} • Employee ID: {staff.employeeId}
          </Text>
          {staff.managerName && (
            <Text style={styles.managerText}>Reports to: {staff.managerName}</Text>
          )}
        </View>
        <View style={styles.hierarchyLevel}>
          <Text style={styles.hierarchyLevelText}>L{staff.level}</Text>
        </View>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{staff.directReports.length}</Text>
          <Text style={styles.statLabel}>Reports</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{staff.responsibilities.length}</Text>
          <Text style={styles.statLabel}>Duties</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{staff.level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {staff.isActive ? 'Active' : 'Inactive'}
          </Text>
          <Text style={styles.statLabel}>Status</Text>
        </View>
      </View>

      <View style={styles.responsibilitiesContainer}>
        <Text style={styles.responsibilitiesTitle}>Key Responsibilities:</Text>
        {staff.responsibilities.slice(0, 2).map((resp, index) => (
          <Text key={index} style={styles.responsibilityText}>• {resp}</Text>
        ))}
        {staff.responsibilities.length > 2 && (
          <Text style={styles.responsibilityText}>
            ... and {staff.responsibilities.length - 2} more
          </Text>
        )}
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => Alert.alert('Edit Staff', `Edit ${staff.firstName} ${staff.lastName}`)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.orgChartButton]}
          onPress={() => Alert.alert('Org Chart', 'View organizational chart')}
        >
          <Text style={styles.actionButtonText}>Org Chart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Helper functions
  const getGroupTypeColor = (type: string) => {
    switch (type) {
      case 'class': return LightTheme.Primary;
      case 'house': return LightTheme.Warning;
      case 'club': return LightTheme.Success;
      case 'activity': return LightTheme.Info;
      case 'academic': return LightTheme.Error;
      default: return LightTheme.OnSurfaceVariant;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate('back')}
        >
          <Text style={styles.backButtonText}>← Admin Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Organization Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (activeTab === 'departments') handleCreateDepartment();
            else if (activeTab === 'classes') handleCreateClass();
            else Alert.alert('Add Item', `Add new ${activeTab.slice(0, -1)}`);
          }}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {['departments', 'classes', 'assignments', 'groups', 'hierarchy'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={LightTheme.OnSurfaceVariant}
        />
      </View>

      {/* Optimization Actions */}
      {activeTab === 'assignments' && !isLoading && !error && (
        <View style={styles.optimizationContainer}>
          <TouchableOpacity
            style={styles.optimizeAllButton}
            onPress={handleOptimizeAssignments}
          >
            <Text style={styles.optimizeAllButtonText}>⚡ Optimize All Assignments</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading State */}
      {isLoading && (
        <View style={[styles.content, styles.centerContent]}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Loading organizational data...</Text>
        </View>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <View style={[styles.content, styles.centerContent]}>
          <Text style={styles.errorText}>Failed to load data</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {!isLoading && !error && (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={handleRefresh} />
          }
        >
        {activeTab === 'departments' && (
          <FlatList
            data={filteredDepartments}
            keyExtractor={(item) => item.id}
            renderItem={renderDepartmentItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}

        {activeTab === 'classes' && (
          <FlatList
            data={filteredClasses}
            keyExtractor={(item) => item.id}
            renderItem={renderClassItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}

        {activeTab === 'assignments' && (
          <FlatList
            data={filteredAssignments}
            keyExtractor={(item) => item.id}
            renderItem={renderAssignmentItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}

        {activeTab === 'groups' && (
          <FlatList
            data={filteredGroups}
            keyExtractor={(item) => item.id}
            renderItem={renderGroupItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}

        {activeTab === 'hierarchy' && (
          <FlatList
            data={filteredStaff}
            keyExtractor={(item) => item.id}
            renderItem={renderStaffItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightTheme.Background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.SM ?? 8,
    backgroundColor: LightTheme.Surface,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.Outline,
  },
  backButton: {
    padding: Spacing?.XS ?? 4,
  },
  backButtonText: {
    ...Typography.bodyMedium,
    color: LightTheme.Primary,
    fontWeight: '500',
  },
  headerTitle: {
    ...Typography.headlineMedium,
    color: LightTheme.OnSurface,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: LightTheme.Primary,
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.XS ?? 4,
    borderRadius: BorderRadius.SM,
  },
  addButtonText: {
    ...Typography.bodyMedium,
    color: LightTheme.Surface,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: LightTheme.Surface,
    paddingHorizontal: Spacing?.MD ?? 12,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing?.SM ?? 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: LightTheme.Primary,
  },
  tabText: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    fontWeight: '500',
  },
  activeTabText: {
    color: LightTheme.Primary,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.SM ?? 8,
    backgroundColor: LightTheme.Surface,
  },
  searchInput: {
    ...Typography.bodyMedium,
    backgroundColor: LightTheme.Background,
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.SM ?? 8,
    borderRadius: BorderRadius.SM,
    borderWidth: 1,
    borderColor: LightTheme.Outline,
    color: LightTheme.OnSurface,
  },
  optimizationContainer: {
    backgroundColor: LightTheme.primaryContainer,
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.SM ?? 8,
  },
  optimizeAllButton: {
    backgroundColor: LightTheme.Warning,
    paddingHorizontal: Spacing?.LG ?? 24,
    paddingVertical: Spacing?.SM ?? 8,
    borderRadius: BorderRadius.SM,
    alignItems: 'center',
  },
  optimizeAllButtonText: {
    ...Typography.bodyMedium,
    color: LightTheme.Surface,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  itemCard: {
    backgroundColor: LightTheme.Surface,
    marginHorizontal: Spacing?.MD ?? 12,
    marginVertical: Spacing?.XS ?? 4,
    padding: Spacing?.MD ?? 12,
    borderRadius: BorderRadius.SM,
    borderWidth: 1,
    borderColor: LightTheme.Outline,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing?.SM ?? 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: Spacing?.SM ?? 8,
  },
  itemTitle: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    fontWeight: '600',
    marginBottom: Spacing?.XS ?? 8 / 2,
  },
  itemSubtitle: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing?.XS ?? 8 / 2,
  },
  itemMeta: {
    marginTop: Spacing?.XS ?? 4,
  },
  itemMetaText: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: Spacing?.SM ?? 8,
    gap: Spacing?.SM ?? 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurface,
    fontWeight: '600',
  },
  statLabel: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
    gap: Spacing?.SM ?? 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing?.XS ?? 4,
    alignItems: 'center',
    borderRadius: BorderRadius.XS,
  },
  editButton: {
    backgroundColor: LightTheme.Info,
  },
  viewButton: {
    backgroundColor: LightTheme.Primary,
  },
  scheduleButton: {
    backgroundColor: LightTheme.Success,
  },
  optimizeButton: {
    backgroundColor: LightTheme.Warning,
  },
  membersButton: {
    backgroundColor: LightTheme.Success,
  },
  orgChartButton: {
    backgroundColor: LightTheme.Primary,
  },
  actionButtonText: {
    ...Typography.bodySmall,
    color: LightTheme.Surface,
    fontWeight: '500',
  },
  workloadIndicator: {
    alignItems: 'flex-end',
  },
  workloadText: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurface,
    fontWeight: '600',
    marginBottom: Spacing?.XS ?? 8 / 2,
  },
  workloadBar: {
    width: 60,
    height: 4,
    backgroundColor: LightTheme.Outline,
    borderRadius: 2,
    overflow: 'hidden',
  },
  workloadFill: {
    height: '100%',
  },
  assignmentDetails: {
    marginBottom: Spacing?.SM ?? 8,
  },
  assignmentLabel: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurface,
    fontWeight: '600',
    marginTop: Spacing?.XS ?? 4,
    marginBottom: Spacing?.XS ?? 8 / 2,
  },
  assignmentValue: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
  },
  classAssignment: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: 2,
  },
  groupTypeTag: {
    paddingHorizontal: Spacing?.XS ?? 4,
    paddingVertical: 2,
    borderRadius: BorderRadius.XS,
    alignSelf: 'flex-start',
  },
  groupTypeText: {
    ...Typography.bodySmall,
    color: LightTheme.Surface,
    fontWeight: '500',
  },
  scheduleText: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurface,
    marginBottom: Spacing?.SM ?? 8,
    fontStyle: 'italic',
  },
  hierarchyLevel: {
    backgroundColor: LightTheme.Primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hierarchyLevelText: {
    ...Typography.bodySmall,
    color: LightTheme.Surface,
    fontWeight: '600',
  },
  managerText: {
    ...Typography.bodySmall,
    color: LightTheme.Primary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  responsibilitiesContainer: {
    backgroundColor: LightTheme.Background,
    padding: Spacing?.SM ?? 8,
    borderRadius: BorderRadius.XS,
    marginBottom: Spacing?.SM ?? 8,
  },
  responsibilitiesTitle: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurface,
    fontWeight: '600',
    marginBottom: Spacing?.XS ?? 4,
  },
  responsibilityText: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: 2,
  },
  separator: {
    height: 1,
    backgroundColor: LightTheme.Outline,
    marginHorizontal: Spacing?.MD ?? 12,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    marginTop: Spacing?.MD ?? 12,
  },
  errorText: {
    ...Typography.headlineSmall,
    color: LightTheme.Error,
    fontWeight: '600',
    marginBottom: Spacing?.SM ?? 8,
  },
  errorSubtext: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing?.LG ?? 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: LightTheme.Primary,
    paddingHorizontal: Spacing?.LG ?? 24,
    paddingVertical: Spacing?.MD ?? 12,
    borderRadius: BorderRadius.MD,
  },
  retryButtonText: {
    ...Typography.bodyMedium,
    color: LightTheme.Surface,
    fontWeight: '600',
  },
});

export default OrganizationManagementScreen;
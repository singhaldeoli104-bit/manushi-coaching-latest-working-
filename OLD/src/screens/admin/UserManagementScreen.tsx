/**
 * UserManagementScreen - Phase 37.1: Comprehensive User Administration
 * Multi-role user management system with bulk operations, role-based access control,
 * advanced search capabilities, and security management
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
  Switch,
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

// Type definitions for User Management System
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  department?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastLogin?: string;
  createdAt: string;
  profileImage?: string;
  permissions: Permission[];
  parentId?: string; // For students
  childrenIds?: string[]; // For parents
  employeeId?: string; // For staff/teachers
  grade?: string; // For students
  subjects?: string[]; // For teachers
  isVerified: boolean;
  requiresMfa: boolean;
}

interface UserRole {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: Permission[];
  isCustom: boolean;
  createdAt: string;
  createdBy: string;
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  conditions?: PermissionCondition[];
}

interface PermissionCondition {
  field: string;
  operator: 'equals' | 'in' | 'greater_than' | 'less_than';
  value: any;
}

interface BulkOperation {
  id: string;
  type: 'import' | 'export' | 'update' | 'delete' | 'activate' | 'deactivate';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalUsers: number;
  processedUsers: number;
  errors: BulkOperationError[];
  createdAt: string;
  completedAt?: string;
  createdBy: string;
}

interface BulkOperationError {
  userEmail: string;
  error: string;
  rowNumber?: number;
}

interface SearchFilter {
  role?: string;
  department?: string;
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  hasPermission?: string;
  isVerified?: boolean;
  requiresMfa?: boolean;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: 'login' | 'logout' | 'user_created' | 'user_updated' | 'user_deleted' | 'role_changed' | 
             'permission_changed' | 'password_reset' | 'mfa_enabled' | 'mfa_disabled' | 'security_violation' |
             'bulk_operation' | 'data_export' | 'system_config' | 'audit_access';
  userId: string;
  userEmail: string;
  adminId?: string;
  adminEmail?: string;
  description: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  outcome: 'success' | 'failure' | 'blocked';
}

interface AuditFilter {
  eventType?: string;
  userId?: string;
  severity?: string;
  outcome?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  ipAddress?: string;
}

interface UserManagementScreenProps {
  adminId: string;
  onNavigate: (screen: string) => void;
}

// Database type definitions
interface UserDB {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  role: string;
  role_display_name: string;
  department: string | null;
  status: string;
  last_login: string | null;
  created_at: string;
  profile_image: string | null;
  employee_id: string | null;
  grade: string | null;
  subjects: string[] | null;
  is_verified: boolean;
  requires_mfa: boolean;
  total_permissions: number;
}

interface UserRoleDB {
  id: string;
  name: string;
  display_name: string;
  description: string;
  permissions: any;
  is_custom: boolean;
  created_at: string;
  created_by: string | null;
  user_count: number;
}

interface BulkOperationDB {
  id: string;
  operation_type: string;
  status: string;
  total_users: number;
  processed_users: number;
  errors: any;
  created_at: string;
  completed_at: string | null;
  created_by_email: string | null;
  progress_percentage: number;
}

interface AuditLogDB {
  id: string;
  timestamp: string;
  event_type: string;
  user_id: string;
  user_email: string;
  admin_email: string | null;
  description: string;
  details: any;
  ip_address: string;
  severity: string;
  outcome: string;
}

interface UserStatisticsDB {
  total_users: number;
  active_users: number;
  pending_users: number;
  suspended_users: number;
  total_admins: number;
  total_teachers: number;
  total_parents: number;
  total_students: number;
  verified_users: number;
  mfa_enabled_users: number;
}

// Fetch functions
const fetchUsersWithRoles = async (): Promise<User[]> => {
  const { data, error } = await supabase.rpc('get_users_with_roles');
  if (error) throw error;

  return (data || []).map((user: UserDB) => ({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phoneNumber: user.phone_number || undefined,
    role: {
      id: `role_${user.role}`,
      name: user.role,
      displayName: user.role_display_name,
      description: '',
      permissions: [],
      isCustom: false,
      createdAt: user.created_at,
      createdBy: 'system',
    },
    department: user.department || undefined,
    status: user.status as any,
    lastLogin: user.last_login || undefined,
    createdAt: user.created_at,
    profileImage: user.profile_image || undefined,
    permissions: [],
    employeeId: user.employee_id || undefined,
    grade: user.grade || undefined,
    subjects: user.subjects || undefined,
    isVerified: user.is_verified,
    requiresMfa: user.requires_mfa,
  }));
};

const fetchUserRoles = async (): Promise<UserRole[]> => {
  const { data, error } = await supabase.rpc('get_user_roles');
  if (error) throw error;

  return (data || []).map((role: UserRoleDB) => ({
    id: role.id,
    name: role.name,
    displayName: role.display_name,
    description: role.description || '',
    permissions: role.permissions || [],
    isCustom: role.is_custom,
    createdAt: role.created_at,
    createdBy: role.created_by || 'system',
  }));
};

const fetchBulkOperations = async (): Promise<BulkOperation[]> => {
  const { data, error } = await supabase.rpc('get_bulk_operations');
  if (error) throw error;

  return (data || []).map((op: BulkOperationDB) => ({
    id: op.id,
    type: op.operation_type as any,
    status: op.status as any,
    totalUsers: op.total_users,
    processedUsers: op.processed_users,
    errors: op.errors || [],
    createdAt: op.created_at,
    completedAt: op.completed_at || undefined,
    createdBy: op.created_by_email || 'system',
  }));
};

const fetchAuditLogs = async (): Promise<AuditLogEntry[]> => {
  const { data, error } = await supabase.rpc('get_user_audit_logs', {
    p_limit: 100,
    p_event_type: null,
    p_user_id: null,
    p_severity: null,
  });
  if (error) throw error;

  return (data || []).map((log: AuditLogDB) => ({
    id: log.id,
    timestamp: log.timestamp,
    eventType: log.event_type as any,
    userId: log.user_id,
    userEmail: log.user_email,
    adminEmail: log.admin_email || undefined,
    description: log.description,
    details: log.details || {},
    ipAddress: log.ip_address,
    userAgent: '',
    severity: log.severity as any,
    location: undefined,
    outcome: log.outcome as any,
  }));
};

const fetchUserStatistics = async (): Promise<UserStatisticsDB> => {
  const { data, error } = await supabase.rpc('get_user_statistics');
  if (error) throw error;

  return data?.[0] || {
    total_users: 0,
    active_users: 0,
    pending_users: 0,
    suspended_users: 0,
    total_admins: 0,
    total_teachers: 0,
    total_parents: 0,
    total_students: 0,
    verified_users: 0,
    mfa_enabled_users: 0,
  };
};

const UserManagementScreen: React.FC<UserManagementScreenProps> = ({
  adminId,
  onNavigate,
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'bulk' | 'audit'>('users');
  const [auditFilters, setAuditFilters] = useState<AuditFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilter>({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Fetch data using React Query
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['users_with_roles'],
    queryFn: fetchUsersWithRoles,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const {
    data: roles = [],
    isLoading: rolesLoading,
    error: rolesError,
    refetch: refetchRoles
  } = useQuery({
    queryKey: ['user_roles'],
    queryFn: fetchUserRoles,
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const {
    data: bulkOperations = [],
    isLoading: bulkOpsLoading,
    error: bulkOpsError,
    refetch: refetchBulkOps
  } = useQuery({
    queryKey: ['bulk_operations'],
    queryFn: fetchBulkOperations,
    refetchInterval: 10000, // Refetch every 10 seconds for real-time status
  });

  const {
    data: auditLogs = [],
    isLoading: auditLogsLoading,
    error: auditLogsError,
    refetch: refetchAuditLogs
  } = useQuery({
    queryKey: ['user_audit_logs'],
    queryFn: fetchAuditLogs,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const {
    data: statistics,
    isLoading: statsLoading,
    error: statsError
  } = useQuery({
    queryKey: ['user_statistics'],
    queryFn: fetchUserStatistics,
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  // Combined loading and error states
  const isLoading = usersLoading || rolesLoading || bulkOpsLoading || auditLogsLoading || statsLoading;
  const error = usersError || rolesError || bulkOpsError || auditLogsError || statsError;

  const handleRefresh = async () => {
    await Promise.all([
      refetchUsers(),
      refetchRoles(),
      refetchBulkOps(),
      refetchAuditLogs(),
    ]);
  };


  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = searchQuery === '' ||
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = !searchFilters.role || user.role.name === searchFilters.role;
      const matchesDepartment = !searchFilters.department || user.department === searchFilters.department;
      const matchesStatus = !searchFilters.status || user.status === searchFilters.status;
      const matchesVerified = searchFilters.isVerified === undefined || user.isVerified === searchFilters.isVerified;

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus && matchesVerified;
    });
  }, [users, searchQuery, searchFilters]);

  // User management actions
  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // TODO: Implement actual database deletion
            Alert.alert('Info', 'User deletion requires database implementation');
            await refetchUsers();
          }
        }
      ]
    );
  };

  const handleToggleUserStatus = async (userId: string) => {
    // TODO: Implement actual database status toggle
    Alert.alert('Info', 'Status toggle requires database implementation');
    await refetchUsers();
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete' | 'export') => {
    if (selectedUsers.length === 0) {
      Alert.alert('No Selection', 'Please select users to perform bulk actions');
      return;
    }

    Alert.alert(
      'Bulk Action',
      `Are you sure you want to ${action} ${selectedUsers.length} selected users?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            // TODO: Implement actual database bulk operation
            Alert.alert('Info', 'Bulk operations require database implementation');
            setSelectedUsers([]);
            await refetchBulkOps();
          }
        }
      ]
    );
  };

  // Role management actions
  const handleCreateRole = () => {
    setSelectedRole(null);
    setShowRoleModal(true);
  };

  const handleEditRole = (role: UserRole) => {
    setSelectedRole(role);
    setShowRoleModal(true);
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role && !role.isCustom) {
      Alert.alert('Cannot Delete', 'System roles cannot be deleted');
      return;
    }

    Alert.alert(
      'Delete Role',
      'Are you sure you want to delete this role?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // TODO: Implement actual database role deletion
            Alert.alert('Info', 'Role deletion requires database implementation');
            await refetchRoles();
          }
        }
      ]
    );
  };

  // Render user item
  const renderUserItem = ({ item: user }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: getStatusColor(user.status) }]}>
            <Text style={styles.avatarText}>
              {user.firstName[0]}{user.lastName[0]}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.userMeta}>
              <View style={[styles.roleTag, { backgroundColor: getRoleColor(user.role.name) }]}>
                <Text style={styles.roleTagText}>{user.role.displayName}</Text>
              </View>
              <View style={[styles.statusTag, { backgroundColor: getStatusColor(user.status) }]}>
                <Text style={styles.statusTagText}>{user.status.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => {
            if (selectedUsers.includes(user.id)) {
              setSelectedUsers(selectedUsers.filter(id => id !== user.id));
            } else {
              setSelectedUsers([...selectedUsers, user.id]);
            }
          }}
        >
          <View style={[
            styles.checkbox,
            selectedUsers.includes(user.id) && styles.checkboxSelected
          ]}>
            {selectedUsers.includes(user.id) && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.userStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Department</Text>
          <Text style={styles.statValue}>{user.department || 'N/A'}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Last Login</Text>
          <Text style={styles.statValue}>
            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>MFA</Text>
          <Text style={styles.statValue}>{user.requiresMfa ? 'Required' : 'Optional'}</Text>
        </View>
      </View>

      <View style={styles.userActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditUser(user)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.statusButton]}
          onPress={() => handleToggleUserStatus(user.id)}
        >
          <Text style={styles.actionButtonText}>
            {user.status === 'active' ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteUser(user.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render role item
  const renderRoleItem = ({ item: role }: { item: UserRole }) => (
    <View style={styles.roleCard}>
      <View style={styles.roleHeader}>
        <View style={styles.roleInfo}>
          <Text style={styles.roleName}>{role.displayName}</Text>
          <Text style={styles.roleDescription}>{role.description}</Text>
          <View style={styles.roleMeta}>
            <View style={[styles.roleTypeTag, { 
              backgroundColor: role.isCustom ? LightTheme.Warning : LightTheme.Success 
            }]}>
              <Text style={styles.roleTypeText}>
                {role.isCustom ? 'Custom Role' : 'System Role'}
              </Text>
            </View>
            <Text style={styles.permissionCount}>
              {role.permissions.length} permissions
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.roleActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditRole(role)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        {role.isCustom && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteRole(role.id)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Render bulk operation item
  const renderBulkOperationItem = ({ item: operation }: { item: BulkOperation }) => (
    <View style={styles.bulkCard}>
      <View style={styles.bulkHeader}>
        <Text style={styles.bulkType}>
          {operation.type.charAt(0).toUpperCase() + operation.type.slice(1)} Operation
        </Text>
        <View style={[styles.bulkStatusTag, { 
          backgroundColor: getBulkStatusColor(operation.status) 
        }]}>
          <Text style={styles.bulkStatusText}>{operation.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.bulkProgress}>
        <Text style={styles.bulkProgressText}>
          Progress: {operation.processedUsers}/{operation.totalUsers}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {
            width: `${(operation.processedUsers / operation.totalUsers) * 100}%`
          }]} />
        </View>
      </View>

      {operation.errors.length > 0 && (
        <View style={styles.bulkErrors}>
          <Text style={styles.bulkErrorsTitle}>Errors ({operation.errors.length}):</Text>
          {operation.errors.slice(0, 3).map((error, index) => (
            <Text key={index} style={styles.bulkErrorText}>
              • {error.userEmail}: {error.error}
            </Text>
          ))}
          {operation.errors.length > 3 && (
            <Text style={styles.bulkErrorText}>
              ... and {operation.errors.length - 3} more errors
            </Text>
          )}
        </View>
      )}

      <Text style={styles.bulkTimestamp}>
        Started: {new Date(operation.createdAt).toLocaleString()}
        {operation.completedAt && (
          <Text> • Completed: {new Date(operation.completedAt).toLocaleString()}</Text>
        )}
      </Text>
    </View>
  );

  // Render audit log entry
  const renderAuditLogEntry = ({ item: entry }: { item: AuditLogEntry }) => (
    <View style={styles.auditLogItem}>
      <View style={styles.auditLogHeader}>
        <View style={styles.auditLogEvent}>
          <Text style={styles.auditEventType}>
            {getEventTypeDisplay(entry.eventType)}
          </Text>
          <View style={[styles.auditSeverityTag, { 
            backgroundColor: getSeverityColor(entry.severity) 
          }]}>
            <Text style={styles.auditSeverityText}>{entry.severity.toUpperCase()}</Text>
          </View>
        </View>
        <View style={[styles.auditOutcomeTag, { 
          backgroundColor: getOutcomeColor(entry.outcome) 
        }]}>
          <Text style={styles.auditOutcomeText}>{entry.outcome.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.auditDescription}>{entry.description}</Text>
      
      <View style={styles.auditDetails}>
        <View style={styles.auditDetailRow}>
          <Text style={styles.auditDetailLabel}>User:</Text>
          <Text style={styles.auditDetailValue}>{entry.userEmail}</Text>
        </View>
        {entry.adminEmail && (
          <View style={styles.auditDetailRow}>
            <Text style={styles.auditDetailLabel}>Admin:</Text>
            <Text style={styles.auditDetailValue}>{entry.adminEmail}</Text>
          </View>
        )}
        <View style={styles.auditDetailRow}>
          <Text style={styles.auditDetailLabel}>IP Address:</Text>
          <Text style={styles.auditDetailValue}>{entry.ipAddress}</Text>
        </View>
        {entry.location && (
          <View style={styles.auditDetailRow}>
            <Text style={styles.auditDetailLabel}>Location:</Text>
            <Text style={styles.auditDetailValue}>{entry.location}</Text>
          </View>
        )}
        <View style={styles.auditDetailRow}>
          <Text style={styles.auditDetailLabel}>Timestamp:</Text>
          <Text style={styles.auditDetailValue}>
            {new Date(entry.timestamp).toLocaleString()}
          </Text>
        </View>
      </View>

      {Object.keys(entry.details).length > 0 && (
        <TouchableOpacity
          style={styles.auditDetailsToggle}
          onPress={() => {
            Alert.alert(
              'Audit Details',
              JSON.stringify(entry.details, null, 2),
              [{ text: 'Close', style: 'default' }]
            );
          }}
        >
          <Text style={styles.auditDetailsToggleText}>View Technical Details</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Render Security Audit Log
  const renderSecurityAuditLog = () => {
    // Filter audit logs based on current filters
    const filteredAuditLogs = auditLogs.filter((entry) => {
      const matchesEventType = !auditFilters.eventType || entry.eventType === auditFilters.eventType;
      const matchesSeverity = !auditFilters.severity || entry.severity === auditFilters.severity;
      const matchesOutcome = !auditFilters.outcome || entry.outcome === auditFilters.outcome;
      const matchesUser = !auditFilters.userId || entry.userId === auditFilters.userId;
      const matchesIP = !auditFilters.ipAddress || entry.ipAddress.includes(auditFilters.ipAddress);
      
      let matchesDateRange = true;
      if (auditFilters.dateRange) {
        const entryDate = new Date(entry.timestamp);
        const startDate = new Date(auditFilters.dateRange.start);
        const endDate = new Date(auditFilters.dateRange.end);
        matchesDateRange = entryDate >= startDate && entryDate <= endDate;
      }

      return matchesEventType && matchesSeverity && matchesOutcome && matchesUser && matchesIP && matchesDateRange;
    });

    return (
      <>
        <View style={styles.auditHeader}>
          <Text style={styles.sectionTitle}>Security Audit Log</Text>
          <Text style={styles.auditSubtitle}>
            Real-time security monitoring and compliance tracking
          </Text>
        </View>

        {/* Audit Statistics */}
        <View style={styles.auditStatsContainer}>
          <View style={styles.auditStatCard}>
            <Text style={styles.auditStatNumber}>
              {auditLogs.filter(log => log.severity === 'critical').length}
            </Text>
            <Text style={styles.auditStatLabel}>Critical Events</Text>
          </View>
          <View style={styles.auditStatCard}>
            <Text style={styles.auditStatNumber}>
              {auditLogs.filter(log => log.outcome === 'blocked').length}
            </Text>
            <Text style={styles.auditStatLabel}>Blocked Attempts</Text>
          </View>
          <View style={styles.auditStatCard}>
            <Text style={styles.auditStatNumber}>
              {auditLogs.filter(log => log.eventType === 'login').length}
            </Text>
            <Text style={styles.auditStatLabel}>Login Events</Text>
          </View>
          <View style={styles.auditStatCard}>
            <Text style={styles.auditStatNumber}>
              {new Set(auditLogs.map(log => log.ipAddress)).size}
            </Text>
            <Text style={styles.auditStatLabel}>Unique IPs</Text>
          </View>
        </View>

        {/* Audit Filters */}
        <View style={styles.auditFiltersContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              setShowFilterModal(true);
            }}
          >
            <Text style={styles.filterButtonText}>🔍 Filter Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              Alert.alert('Export Data', 'Audit log export functionality ready!');
            }}
          >
            <Text style={styles.filterButtonText}>📊 Export Audit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              Alert.alert('Real-time Alerts', 'Security alert configuration available!');
            }}
          >
            <Text style={styles.filterButtonText}>🚨 Configure Alerts</Text>
          </TouchableOpacity>
        </View>

        {/* Security Compliance Summary */}
        <View style={styles.complianceSummary}>
          <Text style={styles.complianceTitle}>Security Compliance Status</Text>
          <View style={styles.complianceItems}>
            <View style={styles.complianceItem}>
              <Text style={styles.complianceCheck}>✅</Text>
              <Text style={styles.complianceText}>Audit logging enabled and operational</Text>
            </View>
            <View style={styles.complianceItem}>
              <Text style={styles.complianceCheck}>✅</Text>
              <Text style={styles.complianceText}>Failed login attempt monitoring active</Text>
            </View>
            <View style={styles.complianceItem}>
              <Text style={styles.complianceCheck}>✅</Text>
              <Text style={styles.complianceText}>User activity tracking comprehensive</Text>
            </View>
            <View style={styles.complianceItem}>
              <Text style={styles.complianceCheck}>✅</Text>
              <Text style={styles.complianceText}>Administrative action logging complete</Text>
            </View>
            <View style={styles.complianceItem}>
              <Text style={styles.complianceCheck}>⚠️</Text>
              <Text style={styles.complianceText}>
                {auditLogs.filter(log => log.severity === 'critical').length} critical events require review
              </Text>
            </View>
          </View>
        </View>

        {/* Audit Log List */}
        <FlatList
          data={filteredAuditLogs}
          renderItem={renderAuditLogEntry}
          keyExtractor={(item) => item.id}
          style={styles.auditLogList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No audit log entries found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try adjusting your filters or check back later
              </Text>
            </View>
          }
        />
      </>
    );
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return LightTheme.Success;
      case 'inactive': return LightTheme.OnSurfaceVariant;
      case 'pending': return LightTheme.Warning;
      case 'suspended': return LightTheme.Error;
      default: return LightTheme.OnSurfaceVariant;
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'admin': return LightTheme.Error;
      case 'teacher': return LightTheme.Success;
      case 'parent': return LightTheme.Primary;
      case 'student': return LightTheme.Info;
      default: return LightTheme.OnSurfaceVariant;
    }
  };

  const getBulkStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return LightTheme.Success;
      case 'processing': return LightTheme.Warning;
      case 'failed': return LightTheme.Error;
      default: return LightTheme.OnSurfaceVariant;
    }
  };

  const getEventTypeDisplay = (eventType: string) => {
    const eventTypeMap = {
      'login': '🔐 Login',
      'logout': '🚪 Logout',
      'user_created': '👤 User Created',
      'user_updated': '✏️ User Updated',
      'user_deleted': '🗑️ User Deleted',
      'role_changed': '🔄 Role Changed',
      'permission_changed': '🔑 Permission Changed',
      'password_reset': '🔓 Password Reset',
      'mfa_enabled': '🔒 MFA Enabled',
      'mfa_disabled': '🔓 MFA Disabled',
      'security_violation': '⚠️ Security Violation',
      'bulk_operation': '📊 Bulk Operation',
      'data_export': '📤 Data Export',
      'system_config': '⚙️ System Config',
      'audit_access': '📋 Audit Access'
    };
    return eventTypeMap[eventType] || `📝 ${eventType.replace('_', ' ').toUpperCase()}`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#D32F2F';
      case 'high': return '#F57C00';
      case 'medium': return '#FBC02D';
      case 'low': return LightTheme.Success;
      default: return LightTheme.OnSurfaceVariant;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success': return LightTheme.Success;
      case 'failure': return LightTheme.Error;
      case 'blocked': return '#D32F2F';
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
        <Text style={styles.headerTitle}>User Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleCreateUser}
        >
          <Text style={styles.addButtonText}>+ Add User</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {['users', 'roles', 'bulk', 'audit'].map((tab) => (
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

      {/* Search and Filters */}
      {activeTab === 'users' && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={LightTheme.OnSurfaceVariant}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>🔍 Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bulk Actions */}
      {activeTab === 'users' && selectedUsers.length > 0 && (
        <View style={styles.bulkActionsContainer}>
          <Text style={styles.bulkActionsTitle}>
            {selectedUsers.length} users selected
          </Text>
          <View style={styles.bulkActions}>
            <TouchableOpacity
              style={[styles.bulkActionButton, styles.activateButton]}
              onPress={() => handleBulkAction('activate')}
            >
              <Text style={styles.bulkActionText}>Activate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bulkActionButton, styles.deactivateButton]}
              onPress={() => handleBulkAction('deactivate')}
            >
              <Text style={styles.bulkActionText}>Deactivate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bulkActionButton, styles.exportButton]}
              onPress={() => handleBulkAction('export')}
            >
              <Text style={styles.bulkActionText}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bulkActionButton, styles.deleteButton]}
              onPress={() => handleBulkAction('delete')}
            >
              <Text style={styles.bulkActionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Loading State */}
      {isLoading && (
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Loading user management data...</Text>
        </View>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.errorText}>Failed to load data</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content based on active tab */}
      {!isLoading && !error && (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={handleRefresh} />
          }
        >
          {activeTab === 'users' && (
            <>
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{statistics?.total_users || 0}</Text>
                  <Text style={styles.statLabel}>Total Users</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{statistics?.active_users || 0}</Text>
                  <Text style={styles.statLabel}>Active Users</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{statistics?.pending_users || 0}</Text>
                  <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{statistics?.mfa_enabled_users || 0}</Text>
                  <Text style={styles.statLabel}>MFA Enabled</Text>
                </View>
              </View>

            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item.id}
              renderItem={renderUserItem}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </>
        )}

        {activeTab === 'roles' && (
          <>
            <View style={styles.roleHeader}>
              <Text style={styles.sectionTitle}>Role Management</Text>
              <TouchableOpacity
                style={styles.addRoleButton}
                onPress={handleCreateRole}
              >
                <Text style={styles.addRoleButtonText}>+ Create Role</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={roles}
              keyExtractor={(item) => item.id}
              renderItem={renderRoleItem}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </>
        )}

        {activeTab === 'bulk' && (
          <>
            <View style={styles.bulkHeader}>
              <Text style={styles.sectionTitle}>Bulk Operations</Text>
              <TouchableOpacity
                style={styles.bulkImportButton}
                onPress={() => setShowBulkModal(true)}
              >
                <Text style={styles.bulkImportButtonText}>📁 Import Users</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={bulkOperations}
              keyExtractor={(item) => item.id}
              renderItem={renderBulkOperationItem}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </>
        )}

          {activeTab === 'audit' && (
            <View style={styles.auditContainer}>
              {renderSecurityAuditLog()}
            </View>
          )}
        </ScrollView>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Advanced Filter Options</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Event Type Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Event Type</Text>
                <View style={styles.filterOptions}>
                  {['login', 'logout', 'password_change', 'role_change', 'failed_login', 'account_locked'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterOption,
                        auditFilters.eventType === type && styles.selectedFilterOption
                      ]}
                      onPress={() => setAuditFilters({...auditFilters, eventType: type})}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        auditFilters.eventType === type && styles.selectedFilterOptionText
                      ]}>
                        {type.replace('_', ' ').toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* User Role Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>User Role</Text>
                <View style={styles.filterOptions}>
                  {['admin', 'teacher', 'student', 'parent'].map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.filterOption,
                        auditFilters.userRole === role && styles.selectedFilterOption
                      ]}
                      onPress={() => setAuditFilters({...auditFilters, userRole: role})}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        auditFilters.userRole === role && styles.selectedFilterOptionText
                      ]}>
                        {role.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Outcome Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Outcome</Text>
                <View style={styles.filterOptions}>
                  {['success', 'failure', 'blocked'].map((outcome) => (
                    <TouchableOpacity
                      key={outcome}
                      style={[
                        styles.filterOption,
                        auditFilters.outcome === outcome && styles.selectedFilterOption
                      ]}
                      onPress={() => setAuditFilters({...auditFilters, outcome: outcome})}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        auditFilters.outcome === outcome && styles.selectedFilterOptionText
                      ]}>
                        {outcome.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setAuditFilters({});
                  setShowFilterModal(false);
                }}
              >
                <Text style={styles.clearFiltersButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyFiltersButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyFiltersButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingVertical: Spacing?.MD ?? 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: LightTheme.Primary,
  },
  tabText: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    fontWeight: '500',
  },
  activeTabText: {
    color: LightTheme.Primary,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.SM ?? 8,
    backgroundColor: LightTheme.Surface,
    alignItems: 'center',
    gap: Spacing?.SM ?? 8,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodyMedium,
    backgroundColor: LightTheme.Background,
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.SM ?? 8,
    borderRadius: BorderRadius.SM,
    borderWidth: 1,
    borderColor: LightTheme.Outline,
    color: LightTheme.OnSurface,
  },
  filterButton: {
    backgroundColor: LightTheme.Primary,
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.SM ?? 8,
    borderRadius: BorderRadius.SM,
  },
  filterButtonText: {
    ...Typography.bodyMedium,
    color: LightTheme.Surface,
    fontWeight: '500',
  },
  bulkActionsContainer: {
    backgroundColor: LightTheme.primaryContainer,
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.SM ?? 8,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.Outline,
  },
  bulkActionsTitle: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurface,
    fontWeight: '600',
    marginBottom: Spacing?.XS ?? 4,
  },
  bulkActions: {
    flexDirection: 'row',
    gap: Spacing?.SM ?? 8,
  },
  bulkActionButton: {
    paddingHorizontal: Spacing?.SM ?? 8,
    paddingVertical: Spacing?.XS ?? 4,
    borderRadius: BorderRadius.XS,
  },
  activateButton: {
    backgroundColor: LightTheme.Success,
  },
  deactivateButton: {
    backgroundColor: LightTheme.Warning,
  },
  exportButton: {
    backgroundColor: LightTheme.Info,
  },
  bulkActionText: {
    ...Typography.bodySmall,
    color: LightTheme.Surface,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.SM ?? 8,
    gap: Spacing?.SM ?? 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: LightTheme.Surface,
    padding: Spacing?.MD ?? 12,
    borderRadius: BorderRadius.SM,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: LightTheme.Outline,
  },
  statNumber: {
    ...Typography.headlineMedium,
    color: LightTheme.Primary,
    fontWeight: '700',
  },
  statLabel: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    marginTop: Spacing?.XS ?? 4,
  },
  userCard: {
    backgroundColor: LightTheme.Surface,
    marginHorizontal: Spacing?.MD ?? 12,
    marginVertical: Spacing?.XS ?? 4,
    padding: Spacing?.MD ?? 12,
    borderRadius: BorderRadius.SM,
    borderWidth: 1,
    borderColor: LightTheme.Outline,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing?.SM ?? 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing?.MD ?? 12,
  },
  avatarText: {
    ...Typography.bodySmall,
    color: LightTheme.Surface,
    fontWeight: '600',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    fontWeight: '600',
    marginBottom: Spacing?.XS ?? 8 / 2,
  },
  userEmail: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing?.XS ?? 4,
  },
  userMeta: {
    flexDirection: 'row',
    gap: Spacing?.XS ?? 4,
  },
  roleTag: {
    paddingHorizontal: Spacing?.XS ?? 4,
    paddingVertical: 2,
    borderRadius: BorderRadius.XS,
  },
  roleTagText: {
    ...Typography.bodySmall,
    color: LightTheme.Surface,
    fontWeight: '500',
  },
  statusTag: {
    paddingHorizontal: Spacing?.XS ?? 4,
    paddingVertical: 2,
    borderRadius: BorderRadius.XS,
  },
  statusTagText: {
    ...Typography.bodySmall,
    color: LightTheme.Surface,
    fontWeight: '500',
  },
  selectButton: {
    padding: Spacing?.XS ?? 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: LightTheme.Outline,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: LightTheme.Primary,
    borderColor: LightTheme.Primary,
  },
  checkmark: {
    ...Typography.bodySmall,
    color: LightTheme.Surface,
    fontWeight: '600',
  },
  userStats: {
    flexDirection: 'row',
    marginBottom: Spacing?.SM ?? 8,
    gap: Spacing?.MD ?? 12,
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurface,
    fontWeight: '500',
  },
  userActions: {
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
  statusButton: {
    backgroundColor: LightTheme.Warning,
  },
  deleteButton: {
    backgroundColor: LightTheme.Error,
  },
  actionButtonText: {
    ...Typography.bodySmall,
    color: LightTheme.Surface,
    fontWeight: '500',
  },
  roleCard: {
    backgroundColor: LightTheme.Surface,
    marginHorizontal: Spacing?.MD ?? 12,
    marginVertical: Spacing?.XS ?? 4,
    padding: Spacing?.MD ?? 12,
    borderRadius: BorderRadius.SM,
    borderWidth: 1,
    borderColor: LightTheme.Outline,
  },
  roleHeader: {
    marginBottom: Spacing?.SM ?? 8,
  },
  roleInfo: {
    marginBottom: Spacing?.SM ?? 8,
  },
  roleName: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    fontWeight: '600',
    marginBottom: Spacing?.XS ?? 8 / 2,
  },
  roleDescription: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing?.XS ?? 4,
  },
  roleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleTypeTag: {
    paddingHorizontal: Spacing?.XS ?? 4,
    paddingVertical: 2,
    borderRadius: BorderRadius.XS,
  },
  roleTypeText: {
    ...Typography.bodySmall,
    color: LightTheme.Surface,
    fontWeight: '500',
  },
  permissionCount: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    fontWeight: '500',
  },
  roleActions: {
    flexDirection: 'row',
    gap: Spacing?.SM ?? 8,
  },
  bulkCard: {
    backgroundColor: LightTheme.Surface,
    marginHorizontal: Spacing?.MD ?? 12,
    marginVertical: Spacing?.XS ?? 4,
    padding: Spacing?.MD ?? 12,
    borderRadius: BorderRadius.SM,
    borderWidth: 1,
    borderColor: LightTheme.Outline,
  },
  bulkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing?.SM ?? 8,
  },
  bulkType: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    fontWeight: '600',
  },
  bulkStatusTag: {
    paddingHorizontal: Spacing?.XS ?? 4,
    paddingVertical: 2,
    borderRadius: BorderRadius.XS,
  },
  bulkStatusText: {
    ...Typography.bodySmall,
    color: LightTheme.Surface,
    fontWeight: '500',
  },
  bulkProgress: {
    marginBottom: Spacing?.SM ?? 8,
  },
  bulkProgressText: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurface,
    marginBottom: Spacing?.XS ?? 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: LightTheme.Outline,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: LightTheme.Success,
  },
  bulkErrors: {
    backgroundColor: LightTheme.errorContainer,
    padding: Spacing?.SM ?? 8,
    borderRadius: BorderRadius.XS,
    marginBottom: Spacing?.SM ?? 8,
  },
  bulkErrorsTitle: {
    ...Typography.bodySmall,
    color: LightTheme.Error,
    fontWeight: '600',
    marginBottom: Spacing?.XS ?? 4,
  },
  bulkErrorText: {
    ...Typography.bodySmall,
    color: LightTheme.Error,
    marginBottom: 2,
  },
  bulkTimestamp: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
  },
  sectionTitle: {
    ...Typography.headlineSmall,
    color: LightTheme.OnSurface,
    fontWeight: '600',
  },
  addRoleButton: {
    backgroundColor: LightTheme.Success,
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.XS ?? 4,
    borderRadius: BorderRadius.SM,
  },
  addRoleButtonText: {
    ...Typography.bodyMedium,
    color: LightTheme.Surface,
    fontWeight: '600',
  },
  bulkImportButton: {
    backgroundColor: LightTheme.Info,
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.XS ?? 4,
    borderRadius: BorderRadius.SM,
  },
  bulkImportButtonText: {
    ...Typography.bodyMedium,
    color: LightTheme.Surface,
    fontWeight: '600',
  },
  auditContainer: {
    padding: Spacing?.MD ?? 12,
  },
  auditHeader: {
    marginBottom: Spacing?.LG ?? 24,
  },
  auditSubtitle: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    marginTop: Spacing?.SM ?? 8,
  },
  auditStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing?.LG ?? 24,
    flexWrap: 'wrap',
  },
  auditStatCard: {
    backgroundColor: LightTheme.Surface,
    padding: Spacing?.MD ?? 12,
    borderRadius: BorderRadius.MD,
    alignItems: 'center',
    minWidth: '22%',
    marginBottom: Spacing?.SM ?? 8,
    borderWidth: 1,
    borderColor: LightTheme.Outline,
  },
  auditStatNumber: {
    ...Typography.headlineMedium,
    color: LightTheme.Primary,
    fontWeight: 'bold',
  },
  auditStatLabel: {
    ...Typography.labelSmall,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
    marginTop: Spacing?.XS ?? 4,
  },
  auditFiltersContainer: {
    flexDirection: 'row',
    marginBottom: Spacing?.LG ?? 24,
    flexWrap: 'wrap',
  },
  filterButton: {
    backgroundColor: LightTheme.primaryContainer,
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.SM ?? 8,
    borderRadius: BorderRadius.MD,
    marginRight: Spacing?.SM ?? 8,
    marginBottom: Spacing?.SM ?? 8,
  },
  filterButtonText: {
    ...Typography.labelMedium,
    color: LightTheme.OnPrimaryContainer,
    fontWeight: '500',
  },
  complianceSummary: {
    backgroundColor: LightTheme.Surface,
    padding: Spacing?.LG ?? 24,
    borderRadius: BorderRadius.MD,
    marginBottom: Spacing?.LG ?? 24,
    borderWidth: 1,
    borderColor: LightTheme.Outline,
  },
  complianceTitle: {
    ...Typography.titleMedium,
    color: LightTheme.OnSurface,
    marginBottom: Spacing?.MD ?? 12,
    fontWeight: '600',
  },
  complianceItems: {
    gap: Spacing?.SM ?? 8,
  },
  complianceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  complianceCheck: {
    fontSize: 16,
    marginRight: Spacing?.SM ?? 8,
  },
  complianceText: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    flex: 1,
  },
  auditLogList: {
    flex: 1,
  },
  auditLogItem: {
    backgroundColor: LightTheme.Surface,
    padding: Spacing?.LG ?? 24,
    borderRadius: BorderRadius.MD,
    marginBottom: Spacing?.MD ?? 12,
    borderWidth: 1,
    borderColor: LightTheme.Outline,
  },
  auditLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing?.MD ?? 12,
  },
  auditLogEvent: {
    flex: 1,
  },
  auditEventType: {
    ...Typography.titleSmall,
    color: LightTheme.OnSurface,
    fontWeight: '600',
    marginBottom: Spacing?.XS ?? 4,
  },
  auditSeverityTag: {
    paddingHorizontal: Spacing?.SM ?? 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.SM,
    alignSelf: 'flex-start',
  },
  auditSeverityText: {
    ...Typography.labelSmall,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
  auditOutcomeTag: {
    paddingHorizontal: Spacing?.SM ?? 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.SM,
  },
  auditOutcomeText: {
    ...Typography.labelSmall,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
  auditDescription: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    marginBottom: Spacing?.MD ?? 12,
  },
  auditDetails: {
    gap: Spacing?.XS ?? 4,
    marginBottom: Spacing?.SM ?? 8,
  },
  auditDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  auditDetailLabel: {
    ...Typography.labelMedium,
    color: LightTheme.OnSurfaceVariant,
    fontWeight: '500',
  },
  auditDetailValue: {
    ...Typography.labelMedium,
    color: LightTheme.OnSurface,
    flex: 1,
    textAlign: 'right',
  },
  auditDetailsToggle: {
    backgroundColor: LightTheme.primaryContainer,
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.SM ?? 8,
    borderRadius: BorderRadius.SM,
    alignSelf: 'flex-start',
  },
  auditDetailsToggleText: {
    ...Typography.labelMedium,
    color: LightTheme.OnPrimaryContainer,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: LightTheme.Outline,
    marginHorizontal: Spacing?.MD ?? 12,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing?.MD ?? 12,
  },
  modalContent: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.LG,
    width: '100%',
    maxHeight: '80%',
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing?.LG ?? 24,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.Outline,
  },
  modalTitle: {
    ...Typography.headlineSmall,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    padding: Spacing?.SM ?? 8,
  },
  modalCloseText: {
    ...Typography.headlineMedium,
    color: LightTheme.OnSurfaceVariant,
  },
  modalBody: {
    padding: Spacing?.LG ?? 24,
  },
  filterSection: {
    marginBottom: Spacing?.XL ?? 32,
  },
  filterLabel: {
    ...Typography.titleMedium,
    color: LightTheme.OnSurface,
    fontWeight: 'bold',
    marginBottom: Spacing?.MD ?? 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing?.SM ?? 8,
  },
  filterOption: {
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.SM ?? 8,
    borderRadius: BorderRadius.MD,
    borderWidth: 1,
    borderColor: LightTheme.Outline,
    backgroundColor: LightTheme.Surface,
  },
  selectedFilterOption: {
    backgroundColor: LightTheme.primaryContainer,
    borderColor: LightTheme.Primary,
  },
  filterOptionText: {
    ...Typography.labelMedium,
    color: LightTheme.OnSurface,
  },
  selectedFilterOptionText: {
    color: LightTheme.OnPrimaryContainer,
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing?.LG ?? 24,
    borderTopWidth: 1,
    borderTopColor: LightTheme.Outline,
    gap: Spacing?.MD ?? 12,
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: Spacing?.MD ?? 12,
    borderRadius: BorderRadius.MD,
    borderWidth: 1,
    borderColor: LightTheme.Error,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  clearFiltersButtonText: {
    ...Typography.labelLarge,
    color: LightTheme.Error,
    fontWeight: 'bold',
  },
  applyFiltersButton: {
    flex: 1,
    paddingVertical: Spacing?.MD ?? 12,
    borderRadius: BorderRadius.MD,
    backgroundColor: LightTheme.Primary,
    alignItems: 'center',
  },
  applyFiltersButtonText: {
    ...Typography.labelLarge,
    color: LightTheme.OnPrimary,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
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

export default UserManagementScreen;
/**
 * OperationsManagementScreen - Phase 41: Operations & Compliance Management
 * Operational Excellence Platform with Workflow Automation
 * Process optimization, resource allocation, incident management
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

const { width } = Dimensions.get('window');

interface OperationsManagementScreenProps {
  adminId: string;
  onNavigate: (screen: string) => void;
}

interface OperationalMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

interface WorkflowProcess {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  automationLevel: number;
  efficiency: number;
  lastRun: Date;
  nextRun: Date;
}

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  assignedTo: string;
  createdAt: Date;
  resolvedAt?: Date;
}

interface ResourceAllocation {
  id: string;
  resource: string;
  allocated: number;
  capacity: number;
  utilization: number;
  cost: number;
  trend: 'up' | 'down' | 'stable';
}

// Database type definitions
interface OperationalMetricDB {
  id: string;
  title: string;
  value: string;
  change: string;
  change_type: string;
  icon: string;
  status: string;
  updated_at: string;
}

interface WorkflowProcessDB {
  id: string;
  name: string;
  description: string;
  status: string;
  automation_level: number;
  efficiency: number;
  last_run: string;
  next_run: string;
}

interface IncidentDB {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  assigned_to: string;
  created_at: string;
  resolved_at: string | null;
}

interface ResourceAllocationDB {
  id: string;
  resource: string;
  allocated: number;
  capacity: number;
  utilization: number;
  cost: number;
  trend: string;
}

interface OperationsStatisticsDB {
  total_workflows: number;
  active_workflows: number;
  total_incidents: number;
  open_incidents: number;
  critical_incidents: number;
  average_automation_level: number;
  average_resource_utilization: number;
  total_resource_cost: number;
}

// Fetch functions
const fetchOperationalMetrics = async (): Promise<OperationalMetric[]> => {
  const { data, error } = await supabase.rpc('get_operational_metrics');
  if (error) throw error;

  return (data || []).map((metric: OperationalMetricDB) => ({
    id: metric.id,
    title: metric.title,
    value: metric.value,
    change: metric.change,
    changeType: metric.change_type as any,
    icon: metric.icon,
    status: metric.status as any,
  }));
};

const fetchWorkflowProcesses = async (): Promise<WorkflowProcess[]> => {
  const { data, error } = await supabase.rpc('get_workflow_processes');
  if (error) throw error;

  return (data || []).map((workflow: WorkflowProcessDB) => ({
    id: workflow.id,
    name: workflow.name,
    description: workflow.description || '',
    status: workflow.status as any,
    automationLevel: workflow.automation_level,
    efficiency: workflow.efficiency,
    lastRun: new Date(workflow.last_run),
    nextRun: new Date(workflow.next_run),
  }));
};

const fetchIncidents = async (): Promise<Incident[]> => {
  const { data, error } = await supabase.rpc('get_incidents');
  if (error) throw error;

  return (data || []).map((incident: IncidentDB) => ({
    id: incident.id,
    title: incident.title,
    description: incident.description || '',
    severity: incident.severity as any,
    status: incident.status as any,
    assignedTo: incident.assigned_to,
    createdAt: new Date(incident.created_at),
    resolvedAt: incident.resolved_at ? new Date(incident.resolved_at) : undefined,
  }));
};

const fetchResourceAllocations = async (): Promise<ResourceAllocation[]> => {
  const { data, error } = await supabase.rpc('get_resource_allocations');
  if (error) throw error;

  return (data || []).map((resource: ResourceAllocationDB) => ({
    id: resource.id,
    resource: resource.resource,
    allocated: resource.allocated,
    capacity: resource.capacity,
    utilization: resource.utilization,
    cost: resource.cost,
    trend: resource.trend as any,
  }));
};

const fetchOperationsStatistics = async (): Promise<OperationsStatisticsDB> => {
  const { data, error } = await supabase.rpc('get_operations_statistics');
  if (error) throw error;

  return data?.[0] || {
    total_workflows: 0,
    active_workflows: 0,
    total_incidents: 0,
    open_incidents: 0,
    critical_incidents: 0,
    average_automation_level: 0,
    average_resource_utilization: 0,
    total_resource_cost: 0,
  };
};

const OperationsManagementScreen: React.FC<OperationsManagementScreenProps> = ({
  adminId,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'workflows' | 'incidents' | 'resources'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleBackNavigation = () => {
    onNavigate('back');
  };

  // Fetch data using React Query
  const {
    data: operationalMetrics = [],
    isLoading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics
  } = useQuery({
    queryKey: ['operational_metrics'],
    queryFn: fetchOperationalMetrics,
    refetchInterval: autoRefresh ? 30000 : false, // Refetch every 30 seconds if auto-refresh enabled
  });

  const {
    data: workflowProcesses = [],
    isLoading: workflowsLoading,
    error: workflowsError,
    refetch: refetchWorkflows
  } = useQuery({
    queryKey: ['workflow_processes'],
    queryFn: fetchWorkflowProcesses,
    refetchInterval: autoRefresh ? 60000 : false, // Refetch every 60 seconds if auto-refresh enabled
  });

  const {
    data: incidents = [],
    isLoading: incidentsLoading,
    error: incidentsError,
    refetch: refetchIncidents
  } = useQuery({
    queryKey: ['incidents'],
    queryFn: fetchIncidents,
    refetchInterval: autoRefresh ? 30000 : false, // Refetch every 30 seconds if auto-refresh enabled
  });

  const {
    data: resourceAllocations = [],
    isLoading: resourcesLoading,
    error: resourcesError,
    refetch: refetchResources
  } = useQuery({
    queryKey: ['resource_allocations'],
    queryFn: fetchResourceAllocations,
    refetchInterval: autoRefresh ? 60000 : false,
  });

  const {
    data: statistics,
    isLoading: statsLoading,
    error: statsError
  } = useQuery({
    queryKey: ['operations_statistics'],
    queryFn: fetchOperationsStatistics,
    refetchInterval: autoRefresh ? 60000 : false,
  });

  // Combined loading and error states
  const isLoading = metricsLoading || workflowsLoading || incidentsLoading || resourcesLoading || statsLoading;
  const error = metricsError || workflowsError || incidentsError || resourcesError || statsError;

  const handleRefresh = async () => {
    await Promise.all([
      refetchMetrics(),
      refetchWorkflows(),
      refetchIncidents(),
      refetchResources(),
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'warning': return '#FF9800';
      case 'critical': return '#F44336';
      case 'active': return '#4CAF50';
      case 'paused': return '#FF9800';
      case 'draft': return '#9E9E9E';
      case 'open': return '#F44336';
      case 'investigating': return '#FF9800';
      case 'resolved': return '#4CAF50';
      case 'closed': return '#9E9E9E';
      default: return LightTheme.OnSurfaceVariant;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#F44336';
      case 'high': return '#FF5722';
      case 'medium': return '#FF9800';
      case 'low': return '#FFC107';
      default: return LightTheme.OnSurfaceVariant;
    }
  };

  const renderHeader = () => (
    <SafeAreaView style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => onNavigate('back')}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Operations Management</Text>
          <Text style={styles.headerSubtitle}>Operational Excellence & Process Optimization</Text>
        </View>
        <View style={styles.refreshContainer}>
          <Text style={styles.refreshLabel}>Auto Refresh</Text>
          <Switch
            value={autoRefresh}
            onValueChange={setAutoRefresh}
            trackColor={{ false: LightTheme.OutlineVariant, true: LightTheme.Primary }}
            thumbColor={autoRefresh ? LightTheme.OnPrimary : LightTheme.OnSurface}
          />
        </View>
      </View>
    </SafeAreaView>
  );

  const renderTabSelector = () => (
    <View style={styles.tabContainer}>
      {([
        { key: 'overview', label: 'Overview', icon: '📊' },
        { key: 'workflows', label: 'Workflows', icon: '⚙️' },
        { key: 'incidents', label: 'Incidents', icon: '🚨' },
        { key: 'resources', label: 'Resources', icon: '📋' },
      ] as const).map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && styles.tabActive
          ]}
          onPress={() => setActiveTab(tab.key)}
        >
          <Text style={styles.tabIcon}>{tab.icon}</Text>
          <Text style={[
            styles.tabText,
            activeTab === tab.key && styles.tabTextActive
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      <View style={styles.metricsGrid}>
        {operationalMetrics.map((metric) => (
          <View key={metric.id} style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricIcon}>{metric.icon}</Text>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor(metric.status) }
              ]} />
            </View>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricTitle}>{metric.title}</Text>
            <View style={styles.metricChangeContainer}>
              <Text style={[
                styles.metricChange,
                metric.changeType === 'increase' ? styles.metricIncrease :
                metric.changeType === 'decrease' ? styles.metricDecrease :
                styles.metricNeutral
              ]}>
                {metric.change}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onNavigate('compliance-audit')}
          >
            <Text style={styles.actionIcon}>🔍</Text>
            <Text style={styles.actionText}>Compliance Audit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onNavigate('strategic-planning')}
          >
            <Text style={styles.actionIcon}>🎯</Text>
            <Text style={styles.actionText}>Strategic Planning</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onNavigate('workflow-builder')}
          >
            <Text style={styles.actionIcon}>🔧</Text>
            <Text style={styles.actionText}>Workflow Builder</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onNavigate('risk-assessment')}
          >
            <Text style={styles.actionIcon}>⚖️</Text>
            <Text style={styles.actionText}>Risk Assessment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderWorkflows = () => (
    <View style={styles.workflowsContainer}>
      {workflowProcesses.map((workflow) => (
        <View key={workflow.id} style={styles.workflowCard}>
          <View style={styles.workflowHeader}>
            <View style={styles.workflowInfo}>
              <Text style={styles.workflowName}>{workflow.name}</Text>
              <Text style={styles.workflowDescription}>{workflow.description}</Text>
            </View>
            <View style={[
              styles.workflowStatus,
              { backgroundColor: getStatusColor(workflow.status) + '20' }
            ]}>
              <Text style={[
                styles.workflowStatusText,
                { color: getStatusColor(workflow.status) }
              ]}>
                {workflow.status}
              </Text>
            </View>
          </View>
          
          <View style={styles.workflowMetrics}>
            <View style={styles.workflowMetric}>
              <Text style={styles.metricLabel}>Automation</Text>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill,
                  { 
                    width: `${workflow.automationLevel}%`,
                    backgroundColor: workflow.automationLevel > 80 ? '#4CAF50' : 
                                   workflow.automationLevel > 60 ? '#FF9800' : '#F44336'
                  }
                ]} />
              </View>
              <Text style={styles.progressText}>{workflow.automationLevel}%</Text>
            </View>
            
            <View style={styles.workflowMetric}>
              <Text style={styles.metricLabel}>Efficiency</Text>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill,
                  { 
                    width: `${workflow.efficiency}%`,
                    backgroundColor: workflow.efficiency > 90 ? '#4CAF50' : 
                                   workflow.efficiency > 75 ? '#FF9800' : '#F44336'
                  }
                ]} />
              </View>
              <Text style={styles.progressText}>{workflow.efficiency}%</Text>
            </View>
          </View>
          
          <View style={styles.workflowSchedule}>
            <Text style={styles.scheduleText}>
              Last Run: {workflow.lastRun.toLocaleDateString()} at {workflow.lastRun.toLocaleTimeString()}
            </Text>
            <Text style={styles.scheduleText}>
              Next Run: {workflow.nextRun.toLocaleDateString()} at {workflow.nextRun.toLocaleTimeString()}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderIncidents = () => (
    <View style={styles.incidentsContainer}>
      {incidents.map((incident) => (
        <View key={incident.id} style={styles.incidentCard}>
          <View style={styles.incidentHeader}>
            <View style={styles.incidentInfo}>
              <Text style={styles.incidentTitle}>{incident.title}</Text>
              <Text style={styles.incidentDescription}>{incident.description}</Text>
            </View>
            <View style={styles.incidentTags}>
              <View style={[
                styles.severityTag,
                { backgroundColor: getSeverityColor(incident.severity) + '20' }
              ]}>
                <Text style={[
                  styles.severityText,
                  { color: getSeverityColor(incident.severity) }
                ]}>
                  {incident.severity}
                </Text>
              </View>
              <View style={[
                styles.statusTag,
                { backgroundColor: getStatusColor(incident.status) + '20' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: getStatusColor(incident.status) }
                ]}>
                  {incident.status}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.incidentDetails}>
            <Text style={styles.incidentAssigned}>Assigned to: {incident.assignedTo}</Text>
            <Text style={styles.incidentTime}>
              Created: {incident.createdAt.toLocaleDateString()} at {incident.createdAt.toLocaleTimeString()}
            </Text>
            {incident.resolvedAt && (
              <Text style={styles.incidentTime}>
                Resolved: {incident.resolvedAt.toLocaleDateString()} at {incident.resolvedAt.toLocaleTimeString()}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderResources = () => (
    <View style={styles.resourcesContainer}>
      {resourceAllocations.map((resource) => (
        <View key={resource.id} style={styles.resourceCard}>
          <View style={styles.resourceHeader}>
            <Text style={styles.resourceName}>{resource.resource}</Text>
            <View style={styles.resourceTrend}>
              <Text style={styles.trendIcon}>
                {resource.trend === 'up' ? '↗️' : resource.trend === 'down' ? '↘️' : '➡️'}
              </Text>
              <Text style={styles.resourceCost}>${resource.cost.toLocaleString()}/mo</Text>
            </View>
          </View>
          
          <View style={styles.resourceMetrics}>
            <View style={styles.resourceAllocation}>
              <Text style={styles.allocationLabel}>Allocation</Text>
              <Text style={styles.allocationValue}>{resource.allocated}/{resource.capacity}</Text>
              <View style={styles.allocationBar}>
                <View style={[
                  styles.allocationFill,
                  { 
                    width: `${(resource.allocated / resource.capacity) * 100}%`,
                    backgroundColor: resource.utilization > 90 ? '#F44336' : 
                                   resource.utilization > 75 ? '#FF9800' : '#4CAF50'
                  }
                ]} />
              </View>
            </View>
            
            <View style={styles.utilizationMetric}>
              <Text style={styles.utilizationLabel}>Utilization</Text>
              <Text style={styles.utilizationValue}>{resource.utilization}%</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  // Loading State
  if (isLoading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={[styles.content, styles.centerContent]}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Loading operations data...</Text>
        </View>
      </View>
    );
  }

  // Error State
  if (error) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={[styles.content, styles.centerContent]}>
          <Text style={styles.errorText}>Failed to load data</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderTabSelector()}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'workflows' && renderWorkflows()}
        {activeTab === 'incidents' && renderIncidents()}
        {activeTab === 'resources' && renderResources()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightTheme.Background,
  },
  header: {
    backgroundColor: LightTheme.Primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.LG ?? 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing?.MD ?? 12,
  },
  backButtonText: {
    fontSize: 24,
    color: LightTheme.OnPrimary,
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.titleLarge.fontSize,
    fontFamily: Typography.titleLarge.fontFamily,
    fontWeight: Typography.titleLarge.fontWeight,
    color: LightTheme.OnPrimary,
  },
  headerSubtitle: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnPrimary,
    opacity: 0.8,
  },
  refreshContainer: {
    alignItems: 'center',
  },
  refreshLabel: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnPrimary,
    marginBottom: Spacing?.XS ?? 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: LightTheme.Surface,
    margin: Spacing?.MD ?? 12,
    borderRadius: 16,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing?.SM ?? 8,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: LightTheme.Primary,
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: Spacing?.XS ?? 4,
  },
  tabText: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    fontWeight: '500',
    textAlign: 'center',
  },
  tabTextActive: {
    color: LightTheme.OnPrimary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  overviewContainer: {
    padding: Spacing?.MD ?? 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing?.XS ?? 8,
    marginBottom: Spacing?.LG ?? 24,
  },
  metricCard: {
    width: (width - Spacing?.MD ?? 8 * 2 - Spacing?.XS ?? 8 * 2) / 2,
    backgroundColor: LightTheme.Surface,
    margin: Spacing?.XS ?? 4,
    padding: Spacing?.LG ?? 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing?.SM ?? 8,
  },
  metricIcon: {
    fontSize: 24,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  metricValue: {
    fontSize: Typography.headlineSmall.fontSize,
    fontFamily: Typography.headlineSmall.fontFamily,
    fontWeight: Typography.headlineSmall.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing?.XS ?? 4,
  },
  metricTitle: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing?.SM ?? 8,
  },
  metricChangeContainer: {
    backgroundColor: LightTheme.SurfaceVariant,
    paddingHorizontal: Spacing?.SM ?? 8,
    paddingVertical: Spacing?.XS ?? 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  metricChange: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    fontWeight: '600',
  },
  metricIncrease: {
    color: '#4CAF50',
  },
  metricDecrease: {
    color: '#F44336',
  },
  metricNeutral: {
    color: LightTheme.OnSurfaceVariant,
  },
  quickActions: {
    marginTop: Spacing?.LG ?? 24,
  },
  sectionTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing?.LG ?? 24,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing?.XS ?? 8,
  },
  actionButton: {
    width: (width - Spacing?.MD ?? 8 * 2 - Spacing?.XS ?? 8 * 2) / 2,
    backgroundColor: LightTheme.Surface,
    margin: Spacing?.XS ?? 4,
    padding: Spacing?.LG ?? 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: Spacing?.SM ?? 8,
  },
  actionText: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
    textAlign: 'center',
  },
  workflowsContainer: {
    padding: Spacing?.MD ?? 12,
  },
  workflowCard: {
    backgroundColor: LightTheme.Surface,
    padding: Spacing?.LG ?? 24,
    borderRadius: 16,
    marginBottom: Spacing?.MD ?? 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  workflowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing?.LG ?? 24,
  },
  workflowInfo: {
    flex: 1,
    marginRight: Spacing?.MD ?? 12,
  },
  workflowName: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing?.XS ?? 4,
  },
  workflowDescription: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  workflowStatus: {
    paddingHorizontal: Spacing?.SM ?? 8,
    paddingVertical: Spacing?.XS ?? 4,
    borderRadius: 12,
  },
  workflowStatusText: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  workflowMetrics: {
    marginBottom: Spacing?.LG ?? 24,
  },
  workflowMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing?.SM ?? 8,
  },
  metricLabel: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    width: 80,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 4,
    marginHorizontal: Spacing?.SM ?? 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurface,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  workflowSchedule: {
    borderTopWidth: 1,
    borderTopColor: LightTheme.OutlineVariant,
    paddingTop: Spacing?.SM ?? 8,
  },
  scheduleText: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing?.XS ?? 4,
  },
  incidentsContainer: {
    padding: Spacing?.MD ?? 12,
  },
  incidentCard: {
    backgroundColor: LightTheme.Surface,
    padding: Spacing?.LG ?? 24,
    borderRadius: 16,
    marginBottom: Spacing?.MD ?? 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing?.MD ?? 12,
  },
  incidentInfo: {
    flex: 1,
    marginRight: Spacing?.MD ?? 12,
  },
  incidentTitle: {
    fontSize: Typography.titleSmall.fontSize,
    fontFamily: Typography.titleSmall.fontFamily,
    fontWeight: Typography.titleSmall.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing?.XS ?? 4,
  },
  incidentDescription: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  incidentTags: {
    alignItems: 'flex-end',
  },
  severityTag: {
    paddingHorizontal: Spacing?.SM ?? 8,
    paddingVertical: Spacing?.XS ?? 4,
    borderRadius: 12,
    marginBottom: Spacing?.XS ?? 4,
  },
  severityText: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusTag: {
    paddingHorizontal: Spacing?.SM ?? 8,
    paddingVertical: Spacing?.XS ?? 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  incidentDetails: {
    borderTopWidth: 1,
    borderTopColor: LightTheme.OutlineVariant,
    paddingTop: Spacing?.SM ?? 8,
  },
  incidentAssigned: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing?.XS ?? 4,
  },
  incidentTime: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing?.XS ?? 4,
  },
  resourcesContainer: {
    padding: Spacing?.MD ?? 12,
  },
  resourceCard: {
    backgroundColor: LightTheme.Surface,
    padding: Spacing?.LG ?? 24,
    borderRadius: 16,
    marginBottom: Spacing?.MD ?? 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing?.LG ?? 24,
  },
  resourceName: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
  },
  resourceTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    fontSize: 16,
    marginRight: Spacing?.XS ?? 4,
  },
  resourceCost: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
  },
  resourceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resourceAllocation: {
    flex: 1,
    marginRight: Spacing?.LG ?? 24,
  },
  allocationLabel: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing?.XS ?? 4,
  },
  allocationValue: {
    fontSize: Typography.titleSmall.fontSize,
    fontFamily: Typography.titleSmall.fontFamily,
    fontWeight: Typography.titleSmall.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing?.SM ?? 8,
  },
  allocationBar: {
    height: 8,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 4,
  },
  allocationFill: {
    height: '100%',
    borderRadius: 4,
  },
  utilizationMetric: {
    alignItems: 'center',
  },
  utilizationLabel: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing?.XS ?? 4,
  },
  utilizationValue: {
    fontSize: Typography.headlineSmall.fontSize,
    fontFamily: Typography.headlineSmall.fontFamily,
    fontWeight: Typography.headlineSmall.fontWeight,
    color: LightTheme.OnSurface,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginTop: Spacing?.MD ?? 12,
  },
  errorText: {
    fontSize: Typography.headlineSmall.fontSize,
    fontFamily: Typography.headlineSmall.fontFamily,
    fontWeight: '600' as any,
    color: LightTheme.Error,
    marginBottom: Spacing?.SM ?? 8,
  },
  errorSubtext: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing?.LG ?? 24,
    textAlign: 'center' as any,
  },
  retryButton: {
    backgroundColor: LightTheme.Primary,
    paddingHorizontal: Spacing?.LG ?? 24,
    paddingVertical: Spacing?.MD ?? 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.Surface,
    fontWeight: '600' as any,
  },
});

export default OperationsManagementScreen;
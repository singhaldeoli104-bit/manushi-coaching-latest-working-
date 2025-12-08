import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useQuery } from '@tanstack/react-query';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Colors, Spacing, BorderRadius } from '../../theme/designSystem';
import { supabase } from '../../lib/supabase';

// Database type interfaces
interface AnnouncementDB {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  tags: string[];
  view_count: number;
  reaction_count: number;
  author_id: string | null;
  author_name: string | null;
  target_audience: string[];
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AnalyticsDB {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string | null;
  change_value: number | null;
  change_percentage: number | null;
  trend: string | null;
  period: string;
  metadata: any;
  updated_at: string;
}

interface ResourceDB {
  id: string;
  name: string;
  file_type: string;
  file_size: number | null;
  file_url: string | null;
  storage_path: string | null;
  category: string | null;
  description: string | null;
  tags: string[];
  uploaded_by: string | null;
  uploader_name: string | null;
  download_count: number;
  is_public: boolean;
  created_at: string;
}

interface QuickActionDB {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  action_type: string;
  action_data: any;
  is_enabled: boolean;
  sort_order: number;
  required_permission: string | null;
}

interface StatisticsDB {
  total_announcements: number;
  published_announcements: number;
  draft_announcements: number;
  total_resources: number;
  total_resource_size: number;
  total_views: number;
  total_reactions: number;
  average_engagement_rate: number;
}

// Component interfaces (camelCase)
interface Announcement {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  tags: string[];
  viewCount: number;
  reactionCount: number;
  authorId?: string;
  authorName?: string;
  targetAudience: string[];
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Analytics {
  id: string;
  metricName: string;
  metricValue: number;
  metricUnit?: string;
  changeValue?: number;
  changePercentage?: number;
  trend?: string;
  period: string;
  metadata: any;
  updatedAt: string;
}

interface Resource {
  id: string;
  name: string;
  fileType: string;
  fileSize?: number;
  fileUrl?: string;
  storagePath?: string;
  category?: string;
  description?: string;
  tags: string[];
  uploadedBy?: string;
  uploaderName?: string;
  downloadCount: number;
  isPublic: boolean;
  createdAt: string;
}

interface QuickAction {
  id: string;
  name: string;
  description?: string;
  icon: string;
  actionType: string;
  actionData: any;
  isEnabled: boolean;
  sortOrder: number;
  requiredPermission?: string;
}

interface Statistics {
  totalAnnouncements: number;
  publishedAnnouncements: number;
  draftAnnouncements: number;
  totalResources: number;
  totalResourceSize: number;
  totalViews: number;
  totalReactions: number;
  averageEngagementRate: number;
}

// Fetch functions
const fetchAnnouncements = async (): Promise<Announcement[]> => {
  const { data, error } = await supabase.rpc('get_content_announcements');
  if (error) throw error;

  return (data || []).map((ann: AnnouncementDB) => ({
    id: ann.id,
    title: ann.title,
    description: ann.description || undefined,
    priority: ann.priority,
    status: ann.status,
    tags: ann.tags,
    viewCount: ann.view_count,
    reactionCount: ann.reaction_count,
    authorId: ann.author_id || undefined,
    authorName: ann.author_name || undefined,
    targetAudience: ann.target_audience,
    scheduledAt: ann.scheduled_at || undefined,
    publishedAt: ann.published_at || undefined,
    createdAt: ann.created_at,
    updatedAt: ann.updated_at,
  }));
};

const fetchAnalytics = async (): Promise<Analytics[]> => {
  const { data, error } = await supabase.rpc('get_content_analytics');
  if (error) throw error;

  return (data || []).map((metric: AnalyticsDB) => ({
    id: metric.id,
    metricName: metric.metric_name,
    metricValue: metric.metric_value,
    metricUnit: metric.metric_unit || undefined,
    changeValue: metric.change_value || undefined,
    changePercentage: metric.change_percentage || undefined,
    trend: metric.trend || undefined,
    period: metric.period,
    metadata: metric.metadata,
    updatedAt: metric.updated_at,
  }));
};

const fetchResources = async (): Promise<Resource[]> => {
  const { data, error } = await supabase.rpc('get_content_resources');
  if (error) throw error;

  return (data || []).map((res: ResourceDB) => ({
    id: res.id,
    name: res.name,
    fileType: res.file_type,
    fileSize: res.file_size || undefined,
    fileUrl: res.file_url || undefined,
    storagePath: res.storage_path || undefined,
    category: res.category || undefined,
    description: res.description || undefined,
    tags: res.tags,
    uploadedBy: res.uploaded_by || undefined,
    uploaderName: res.uploader_name || undefined,
    downloadCount: res.download_count,
    isPublic: res.is_public,
    createdAt: res.created_at,
  }));
};

const fetchQuickActions = async (): Promise<QuickAction[]> => {
  const { data, error } = await supabase.rpc('get_content_quick_actions');
  if (error) throw error;

  return (data || []).map((action: QuickActionDB) => ({
    id: action.id,
    name: action.name,
    description: action.description || undefined,
    icon: action.icon,
    actionType: action.action_type,
    actionData: action.action_data,
    isEnabled: action.is_enabled,
    sortOrder: action.sort_order,
    requiredPermission: action.required_permission || undefined,
  }));
};

const fetchStatistics = async (): Promise<Statistics> => {
  const { data, error } = await supabase.rpc('get_content_statistics');
  if (error) throw error;

  const stats = (data && data.length > 0) ? data[0] : null;
  if (!stats) {
    return {
      totalAnnouncements: 0,
      publishedAnnouncements: 0,
      draftAnnouncements: 0,
      totalResources: 0,
      totalResourceSize: 0,
      totalViews: 0,
      totalReactions: 0,
      averageEngagementRate: 0,
    };
  }

  return {
    totalAnnouncements: stats.total_announcements,
    publishedAnnouncements: stats.published_announcements,
    draftAnnouncements: stats.draft_announcements,
    totalResources: stats.total_resources,
    totalResourceSize: stats.total_resource_size,
    totalViews: stats.total_views,
    totalReactions: stats.total_reactions,
    averageEngagementRate: stats.average_engagement_rate,
  };
};

export default function ContentManagementScreen() {
  // Fetch data using React Query
  const {
    data: announcements = [],
    isLoading: announcementsLoading,
    error: announcementsError,
  } = useQuery({
    queryKey: ['content_announcements'],
    queryFn: fetchAnnouncements,
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const {
    data: analytics = [],
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useQuery({
    queryKey: ['content_analytics'],
    queryFn: fetchAnalytics,
    refetchInterval: 60000,
  });

  const {
    data: resources = [],
    isLoading: resourcesLoading,
    error: resourcesError,
  } = useQuery({
    queryKey: ['content_resources'],
    queryFn: fetchResources,
    refetchInterval: 60000,
  });

  const {
    data: quickActions = [],
    isLoading: quickActionsLoading,
    error: quickActionsError,
  } = useQuery({
    queryKey: ['content_quick_actions'],
    queryFn: fetchQuickActions,
    refetchInterval: 60000,
  });

  const {
    data: statistics,
    isLoading: statisticsLoading,
    error: statisticsError,
  } = useQuery({
    queryKey: ['content_statistics'],
    queryFn: fetchStatistics,
    refetchInterval: 60000,
  });

  // Combined loading and error states
  const isLoading = announcementsLoading || analyticsLoading || resourcesLoading || quickActionsLoading || statisticsLoading;
  const error = announcementsError || analyticsError || resourcesError || quickActionsError || statisticsError;

  // Helper function to format file size
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '0 B';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // Helper function to get time ago
  const getTimeAgo = (dateString?: string): string => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  return (
    <BaseScreen scrollable loading={isLoading} error={error}>
      <View style={styles.container}>
        {/* Top App Bar */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Content Dashboard</Text>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
          {/* Announcements Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Announcements</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.announcementsContainer}>
              {announcements.slice(0, 2).map((announcement) => (
                <View key={announcement.id} style={styles.announcementCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.badges}>
                      {/* Priority Badge */}
                      {announcement.priority === 'high' || announcement.priority === 'urgent' ? (
                        <View style={[styles.badge, styles.highPriorityBadge]}>
                          <Text style={styles.highPriorityText}>
                            {announcement.priority === 'urgent' ? 'Urgent' : 'High Priority'}
                          </Text>
                        </View>
                      ) : announcement.priority === 'medium' ? (
                        <View style={[styles.badge, styles.mediumPriorityBadge]}>
                          <Text style={styles.mediumPriorityText}>Medium Priority</Text>
                        </View>
                      ) : null}

                      {/* Status Badge */}
                      {announcement.status === 'published' ? (
                        <View style={[styles.badge, styles.publishedBadge]}>
                          <Text style={styles.publishedText}>Published</Text>
                        </View>
                      ) : announcement.status === 'draft' ? (
                        <View style={[styles.badge, styles.draftBadge]}>
                          <Text style={styles.draftText}>Draft</Text>
                        </View>
                      ) : null}
                    </View>
                    <TouchableOpacity>
                      <Icon name="more-vert" size={24} color="#8E8E93" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.announcementTitle}>{announcement.title}</Text>
                  {announcement.description && (
                    <Text style={styles.announcementDescription}>
                      {announcement.description}
                    </Text>
                  )}

                  {announcement.tags.length > 0 && (
                    <View style={styles.tags}>
                      {announcement.tags.slice(0, 3).map((tag, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View style={styles.stats}>
                    <View style={styles.stat}>
                      <Icon name="visibility" size={14} color="#8E8E93" />
                      <Text style={styles.statText}>{announcement.viewCount}</Text>
                    </View>
                    <View style={styles.stat}>
                      <Icon name="favorite" size={14} color="#8E8E93" />
                      <Text style={styles.statText}>{announcement.reactionCount}</Text>
                    </View>
                    <View style={styles.stat}>
                      <Icon name="schedule" size={14} color="#8E8E93" />
                      <Text style={styles.statText}>{getTimeAgo(announcement.publishedAt)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Analytics Overview Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Analytics Overview</Text>
            <View style={styles.analyticsGrid}>
              {analytics.slice(0, 2).map((metric) => (
                <View key={metric.id} style={styles.analyticsCard}>
                  <Text style={styles.analyticsLabel}>{metric.metricName}</Text>
                  <Text style={styles.analyticsValue}>
                    {metric.metricValue.toLocaleString()}
                    {metric.metricUnit === 'percentage' ? '%' : ''}
                  </Text>

                  {metric.metricName.toLowerCase().includes('viewed') && (
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: '80%' }]} />
                    </View>
                  )}

                  {metric.changePercentage && metric.trend && (
                    <View style={styles.engagementChange}>
                      <Icon
                        name={metric.trend === 'up' ? 'arrow-upward' : metric.trend === 'down' ? 'arrow-downward' : 'trending-flat'}
                        size={16}
                        color={metric.trend === 'up' ? '#34C759' : metric.trend === 'down' ? '#FF3B30' : '#8E8E93'}
                      />
                      <Text style={[
                        styles.engagementText,
                        { color: metric.trend === 'up' ? '#34C759' : metric.trend === 'down' ? '#FF3B30' : '#8E8E93' }
                      ]}>
                        {metric.changePercentage > 0 ? '+' : ''}{metric.changePercentage.toFixed(1)}%
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Resource Library Snapshot */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Resource Library</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.resourceGrid}>
              {resources.slice(0, 3).map((resource) => {
                const isImage = resource.category === 'image' || ['png', 'jpg', 'jpeg', 'gif'].includes(resource.fileType.toLowerCase());
                const isVideo = resource.category === 'video' || ['mp4', 'mov', 'avi'].includes(resource.fileType.toLowerCase());
                const isDocument = resource.category === 'document' || ['pdf', 'doc', 'docx'].includes(resource.fileType.toLowerCase());

                return (
                  <View key={resource.id} style={styles.fileItem}>
                    <View style={[
                      styles.fileIcon,
                      isImage ? styles.fileIconImage : isDocument ? styles.fileIconDocument : styles.fileIconVideo
                    ]}>
                      <Icon
                        name={isImage ? 'image' : isDocument ? 'description' : 'videocam'}
                        size={40}
                        color={isImage ? '#007AFF' : isDocument ? '#34C759' : '#FF9500'}
                      />
                    </View>
                    <Text style={styles.fileName} numberOfLines={1}>{resource.name}</Text>
                    <Text style={styles.fileType}>{resource.fileType.toUpperCase()} • {formatFileSize(resource.fileSize)}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Quick Access Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <View style={styles.quickAccessGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity key={action.id} style={styles.quickAccessItem}>
                  <View style={styles.quickAccessIcon}>
                    <Icon name={action.icon} size={24} color="#007AFF" />
                  </View>
                  <Text style={styles.quickAccessText}>{action.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: Spacing?.base ?? 16,
    paddingVertical: Spacing?.base ?? 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing?.base ?? 16,
    gap: 24,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  announcementsContainer: {
    gap: 16,
  },
  announcementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius?.lg ?? 8,
    padding: Spacing?.base ?? 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  highPriorityBadge: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  highPriorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF3B30',
  },
  publishedBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  publishedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34C759',
  },
  mediumPriorityBadge: {
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
  },
  mediumPriorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF9500',
  },
  draftBadge: {
    backgroundColor: 'rgba(142, 142, 147, 0.2)',
  },
  draftText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  announcementDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    height: 28,
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  analyticsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius?.xl ?? 12,
    padding: Spacing?.base ?? 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    gap: 8,
  },
  analyticsLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  analyticsValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  progressBar: {
    marginTop: 8,
    height: 6,
    width: '100%',
    borderRadius: 3,
    backgroundColor: '#E5E5EA',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  engagementChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  engagementText: {
    fontSize: 14,
    color: '#34C759',
  },
  resourceGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  fileItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius?.lg ?? 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    alignItems: 'center',
    gap: 8,
  },
  fileIcon: {
    width: '100%',
    height: 64,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileIconImage: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  fileIconDocument: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  fileIconVideo: {
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
  },
  fileName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
  },
  fileType: {
    fontSize: 12,
    color: '#8E8E93',
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickAccessItem: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius?.xl ?? 12,
    padding: Spacing?.base ?? 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    gap: 12,
  },
  quickAccessIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius?.lg ?? 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAccessText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
});

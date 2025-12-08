import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useQuery } from '@tanstack/react-query';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Colors, Spacing, BorderRadius } from '../../theme/designSystem';
import { supabase } from '../../lib/supabase';

// Database type interfaces
interface SystemSettingDB {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_type: string;
  category: string;
  display_name: string;
  description: string | null;
  is_editable: boolean;
  validation_rules: any;
  updated_at: string;
}

// Component interfaces
interface SystemSetting {
  id: string;
  settingKey: string;
  settingValue: string;
  settingType: string;
  category: string;
  displayName: string;
  description?: string;
  isEditable: boolean;
  validationRules: any;
  updatedAt: string;
}

// Fetch function
const fetchSystemSettings = async (): Promise<SystemSetting[]> => {
  const { data, error } = await supabase.rpc('get_system_settings');
  if (error) throw error;

  return (data || []).map((setting: SystemSettingDB) => ({
    id: setting.id,
    settingKey: setting.setting_key,
    settingValue: setting.setting_value || '',
    settingType: setting.setting_type,
    category: setting.category,
    displayName: setting.display_name,
    description: setting.description || undefined,
    isEditable: setting.is_editable,
    validationRules: setting.validation_rules,
    updatedAt: setting.updated_at,
  }));
};

interface CollapsibleSectionProps {
  title: string;
  icon: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  hasWarning?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  isOpen,
  onToggle,
  children,
  hasWarning,
}) => (
  <View style={styles.card}>
    <TouchableOpacity style={styles.cardHeader} onPress={onToggle}>
      <View style={styles.cardHeaderLeft}>
        <Icon name={icon} size={24} color="#64748B" />
        <Text style={styles.cardTitle}>{title}</Text>
        {hasWarning && <View style={styles.warningDot} />}
      </View>
      <Icon
        name={isOpen ? 'expand-less' : 'expand-more'}
        size={24}
        color="#64748B"
      />
    </TouchableOpacity>
    {isOpen && (
      <View style={styles.cardContent}>
        {children}
      </View>
    )}
  </View>
);

export default function SystemSettingsScreen() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    general: true,
    security: false,
    email: false,
    payment: false,
    notifications: false,
    backup: false,
    api: false,
    ai: false,
  });

  // Fetch system settings
  const {
    data: settings = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['system_settings'],
    queryFn: fetchSystemSettings,
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  // Helper function to get setting value by key
  const getSetting = (key: string): string => {
    const setting = settings.find(s => s.settingKey === key);
    return setting?.settingValue || '';
  };

  // Helper function to get boolean setting
  const getBooleanSetting = (key: string): boolean => {
    const value = getSetting(key);
    return value === 'true';
  };

  // Helper function to get number setting
  const getNumberSetting = (key: string): number => {
    const value = getSetting(key);
    return parseInt(value, 10) || 0;
  };

  // Group settings by category
  const settingsByCategory = useMemo(() => {
    return settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push(setting);
      return acc;
    }, {} as Record<string, SystemSetting[]>);
  }, [settings]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleRefresh = async () => {
    await refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <BaseScreen scrollable>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton}>
              <Icon name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>System Settings</Text>
            <TouchableOpacity style={styles.headerButton}>
              <Icon name="more-vert" size={24} color="#1E293B" />
            </TouchableOpacity>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors?.primary?.[500] ?? '#4A90E2'} />
            <Text style={styles.loadingText}>Loading system settings...</Text>
          </View>
        </View>
      </BaseScreen>
    );
  }

  // Error state
  if (error) {
    return (
      <BaseScreen scrollable>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton}>
              <Icon name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>System Settings</Text>
            <TouchableOpacity style={styles.headerButton}>
              <Icon name="more-vert" size={24} color="#1E293B" />
            </TouchableOpacity>
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load settings</Text>
            <Text style={styles.errorSubtext}>{error.message}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen scrollable>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>System Settings</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="more-vert" size={24} color="#1E293B" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* General Settings */}
          <CollapsibleSection
            title="General Settings"
            icon="tune"
            isOpen={openSections.general}
            onToggle={() => toggleSection('general')}
          >
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Site Title <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter site title"
                placeholderTextColor="#94A3B8"
                value={getSetting('site_title')}
                editable={false}
              />
            </View>

            <View style={styles.uploadRow}>
              <View style={styles.uploadLeft}>
                <View style={styles.uploadIconContainer}>
                  <Icon name="image" size={24} color="#64748B" />
                </View>
                <Text style={styles.uploadLabel}>Site Logo</Text>
              </View>
              <TouchableOpacity style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Upload</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.colorRow}>
              <Text style={styles.rowLabel}>Primary Color</Text>
              <View style={styles.colorRight}>
                <Text style={styles.colorValue}>{getSetting('primary_color')}</Text>
                <View style={[styles.colorPreview, { backgroundColor: getSetting('primary_color') }]} />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Default Language</Text>
              <View style={styles.languageSelector}>
                {['English', 'Spanish', 'French'].map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    style={[
                      styles.languageOption,
                      getSetting('default_language') === lang && styles.languageOptionSelected,
                    ]}
                    onPress={() => {}}
                  >
                    <Text
                      style={[
                        styles.languageOptionText,
                        getSetting('default_language') === lang && styles.languageOptionTextSelected,
                      ]}
                    >
                      {lang}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </CollapsibleSection>

          {/* Security Settings */}
          <CollapsibleSection
            title="Security Settings"
            icon="security"
            isOpen={openSections.security}
            onToggle={() => toggleSection('security')}
          >
            <View style={styles.switchRow}>
              <Text style={styles.rowLabel}>Enable 2-Factor Auth</Text>
              <Switch
                value={getBooleanSetting('two_factor_enabled')}
                onValueChange={() => {}}
                trackColor={{ false: '#CBD5E1', true: Colors?.primary?.[500] ?? '#4A90E2' }}
                thumbColor="#FFFFFF"
                disabled
              />
            </View>

            <View style={styles.sliderGroup}>
              <View style={styles.sliderHeader}>
                <Text style={styles.label}>Session Timeout</Text>
                <Text style={styles.sliderValue}>{getNumberSetting('session_timeout')} minutes</Text>
              </View>
              <View style={styles.sliderControls}>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => {}}
                >
                  <Icon name="remove" size={20} color="#64748B" />
                </TouchableOpacity>
                <View style={styles.sliderTrack}>
                  <View
                    style={[
                      styles.sliderFill,
                      { width: `${((getNumberSetting('session_timeout') - 15) / (120 - 15)) * 100}%` },
                    ]}
                  />
                </View>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => {}}
                >
                  <Icon name="add" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
          </CollapsibleSection>

          {/* Email Configuration */}
          <CollapsibleSection
            title="Email Configuration"
            icon="mail"
            isOpen={openSections.email}
            onToggle={() => toggleSection('email')}
            hasWarning
          >
            <View style={styles.warningBox}>
              <Icon name="warning" size={16} color="#D97706" />
              <Text style={styles.warningText}>
                Changing these settings may affect system email delivery.
              </Text>
            </View>
          </CollapsibleSection>

          {/* Payment Gateway */}
          <CollapsibleSection
            title="Payment Gateway"
            icon="credit-card"
            isOpen={openSections.payment}
            onToggle={() => toggleSection('payment')}
          >
            <Text style={styles.sectionDescription}>
              Configure your payment provider.
            </Text>
          </CollapsibleSection>

          {/* Notification Settings */}
          <CollapsibleSection
            title="Notification Settings"
            icon="notifications"
            isOpen={openSections.notifications}
            onToggle={() => toggleSection('notifications')}
          >
            <Text style={styles.sectionDescription}>
              Manage push and email notifications.
            </Text>
          </CollapsibleSection>

          {/* Backup & Restore */}
          <CollapsibleSection
            title="Backup & Restore"
            icon="backup"
            isOpen={openSections.backup}
            onToggle={() => toggleSection('backup')}
          >
            <Text style={styles.sectionDescription}>
              Create or restore system backups.
            </Text>
          </CollapsibleSection>

          {/* API Configuration */}
          <CollapsibleSection
            title="API Configuration"
            icon="api"
            isOpen={openSections.api}
            onToggle={() => toggleSection('api')}
          >
            <Text style={styles.sectionDescription}>
              Manage external service API keys.
            </Text>
          </CollapsibleSection>

          {/* AI Services */}
          <CollapsibleSection
            title="AI Services"
            icon="smart-toy"
            isOpen={openSections.ai}
            onToggle={() => toggleSection('ai')}
          >
            <Text style={styles.sectionDescription}>
              Configure AI-powered features.
            </Text>
          </CollapsibleSection>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Fixed Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing?.base ?? 16,
    paddingVertical: Spacing?.base ?? 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing?.base ?? 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius?.xl ?? 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: Spacing?.base ?? 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing?.base ?? 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  warningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors?.primary?.[500] ?? '#4A90E2',
  },
  cardContent: {
    padding: Spacing?.base ?? 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  formGroup: {
    marginBottom: Spacing?.base ?? 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  required: {
    color: '#DC2626',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: BorderRadius?.lg ?? 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  uploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing?.base ?? 16,
  },
  uploadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  uploadIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius?.lg ?? 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadLabel: {
    fontSize: 16,
    color: '#1E293B',
    flex: 1,
  },
  uploadButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: BorderRadius?.lg ?? 8,
    minWidth: 84,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing?.base ?? 16,
  },
  rowLabel: {
    fontSize: 16,
    color: '#1E293B',
  },
  colorRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorValue: {
    fontSize: 16,
    color: '#64748B',
  },
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius?.lg ?? 8,
  },
  languageSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  languageOption: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: BorderRadius?.lg ?? 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageOptionSelected: {
    borderColor: Colors?.primary?.[500] ?? '#4A90E2',
    backgroundColor: Colors?.primary?.[50] ?? '#EBF5FB',
  },
  languageOptionText: {
    fontSize: 14,
    color: '#64748B',
  },
  languageOptionTextSelected: {
    color: Colors?.primary?.[500] ?? '#4A90E2',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing?.base ?? 16,
  },
  sliderGroup: {
    marginBottom: Spacing?.base ?? 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  sliderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius?.lg ?? 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#CBD5E1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors?.primary?.[500] ?? '#4A90E2',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: BorderRadius?.lg ?? 8,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#D97706',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  bottomSpacing: {
    height: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: Spacing?.base ?? 16,
  },
  saveButton: {
    backgroundColor: Colors?.primary?.[500] ?? '#4A90E2',
    height: 48,
    borderRadius: BorderRadius?.xl ?? 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing?.xl ?? 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: Spacing?.base ?? 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing?.xl ?? 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: Spacing?.lg ?? 24,
  },
  retryButton: {
    backgroundColor: Colors?.primary?.[500] ?? '#4A90E2',
    paddingHorizontal: Spacing?.xl ?? 32,
    paddingVertical: Spacing?.base ?? 12,
    borderRadius: BorderRadius?.xl ?? 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

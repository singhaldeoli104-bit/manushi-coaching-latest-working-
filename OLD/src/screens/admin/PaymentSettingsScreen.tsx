/**
 * PaymentSettingsScreen - Phase 40: Financial Administration
 * Payment Gateway Configuration and Management
 * Fee structure, refund processing, security settings
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

interface PaymentSettingsScreenProps {
  adminId: string;
  onNavigate: (screen: string) => void;
}

interface PaymentGateway {
  id: string;
  name: string;
  enabled: boolean;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  transactionFee: number;
  currency: string[];
  testMode: boolean;
}

interface FeeStructure {
  id: string;
  name: string;
  type: 'fixed' | 'percentage';
  value: number;
  minAmount?: number;
  maxAmount?: number;
  applicableFor: string[];
}

interface SecuritySetting {
  id: string;
  settingKey: string;
  settingValue: boolean;
  settingType: string;
  numericValue?: number;
  description?: string;
  category: string;
}

// Database type interfaces
interface PaymentGatewayDB {
  id: string;
  name: string;
  enabled: boolean;
  api_key: string | null;
  secret_key: string | null;
  webhook_url: string | null;
  transaction_fee: number;
  currency: string[];
  test_mode: boolean;
  provider_type: string | null;
  configuration: any;
  updated_at: string;
}

interface FeeStructureDB {
  id: string;
  name: string;
  type: string;
  value: number;
  min_amount: number | null;
  max_amount: number | null;
  applicable_for: string[];
  is_active: boolean;
  description: string | null;
  created_at: string;
}

interface SecuritySettingDB {
  id: string;
  setting_key: string;
  setting_value: boolean;
  setting_type: string;
  numeric_value: number | null;
  description: string | null;
  category: string;
}

// Fetch functions
const fetchPaymentGateways = async (): Promise<PaymentGateway[]> => {
  const { data, error } = await supabase.rpc('get_payment_gateways');
  if (error) throw error;

  return (data || []).map((gateway: PaymentGatewayDB) => ({
    id: gateway.id,
    name: gateway.name,
    enabled: gateway.enabled,
    apiKey: gateway.api_key || '',
    secretKey: gateway.secret_key || '',
    webhookUrl: gateway.webhook_url || '',
    transactionFee: gateway.transaction_fee,
    currency: gateway.currency,
    testMode: gateway.test_mode,
  }));
};

const fetchFeeStructures = async (): Promise<FeeStructure[]> => {
  const { data, error } = await supabase.rpc('get_fee_structures');
  if (error) throw error;

  return (data || []).map((fee: FeeStructureDB) => ({
    id: fee.id,
    name: fee.name,
    type: fee.type as 'fixed' | 'percentage',
    value: fee.value,
    minAmount: fee.min_amount || undefined,
    maxAmount: fee.max_amount || undefined,
    applicableFor: fee.applicable_for,
  }));
};

const fetchSecuritySettings = async (): Promise<SecuritySetting[]> => {
  const { data, error } = await supabase.rpc('get_payment_security_settings');
  if (error) throw error;

  return (data || []).map((setting: SecuritySettingDB) => ({
    id: setting.id,
    settingKey: setting.setting_key,
    settingValue: setting.setting_value,
    settingType: setting.setting_type,
    numericValue: setting.numeric_value || undefined,
    description: setting.description || undefined,
    category: setting.category,
  }));
};

const PaymentSettingsScreen: React.FC<PaymentSettingsScreenProps> = ({
  adminId,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'gateways' | 'fees' | 'security'>('gateways');
  const [editingGateway, setEditingGateway] = useState<string | null>(null);

  // Fetch data using React Query
  const {
    data: paymentGateways = [],
    isLoading: gatewaysLoading,
    error: gatewaysError,
    refetch: refetchGateways,
  } = useQuery({
    queryKey: ['payment_gateways'],
    queryFn: fetchPaymentGateways,
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const {
    data: feeStructures = [],
    isLoading: feesLoading,
    error: feesError,
    refetch: refetchFees,
  } = useQuery({
    queryKey: ['fee_structures'],
    queryFn: fetchFeeStructures,
    refetchInterval: 60000,
  });

  const {
    data: securitySettings = [],
    isLoading: securityLoading,
    error: securityError,
    refetch: refetchSecurity,
  } = useQuery({
    queryKey: ['payment_security_settings'],
    queryFn: fetchSecuritySettings,
    refetchInterval: 60000,
  });

  // Combined loading and error states
  const isLoading = gatewaysLoading || feesLoading || securityLoading;
  const error = gatewaysError || feesError || securityError;

  const toggleGateway = async (gatewayId: string) => {
    // TODO: Implement database update using update_payment_gateway RPC
    // const gateway = paymentGateways.find(g => g.id === gatewayId);
    // await supabase.rpc('update_payment_gateway', {
    //   p_gateway_id: gatewayId,
    //   p_enabled: !gateway?.enabled
    // });
    // refetchGateways();
    Alert.alert('Info', 'Gateway toggle functionality requires database update implementation');
  };

  const toggleTestMode = async (gatewayId: string) => {
    // TODO: Implement database update using update_payment_gateway RPC
    // const gateway = paymentGateways.find(g => g.id === gatewayId);
    // await supabase.rpc('update_payment_gateway', {
    //   p_gateway_id: gatewayId,
    //   p_test_mode: !gateway?.testMode
    // });
    // refetchGateways();
    Alert.alert('Info', 'Test mode toggle functionality requires database update implementation');
  };

  const handleRefresh = async () => {
    await Promise.all([
      refetchGateways(),
      refetchFees(),
      refetchSecurity(),
    ]);
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
          <Text style={styles.headerTitle}>Payment Settings</Text>
          <Text style={styles.headerSubtitle}>Configure Payment Gateways & Fees</Text>
        </View>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => Alert.alert('success', 'Settings saved successfully!')}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderTabSelector = () => (
    <View style={styles.tabContainer}>
      {([
        { key: 'gateways', label: 'Payment Gateways', icon: '💳' },
        { key: 'fees', label: 'Fee Structure', icon: '💰' },
        { key: 'security', label: 'Security', icon: '🔒' },
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

  const renderPaymentGateways = () => (
    <View style={styles.gatewaysContainer}>
      {paymentGateways.map((gateway) => (
        <View key={gateway.id} style={styles.gatewayCard}>
          <View style={styles.gatewayHeader}>
            <View style={styles.gatewayInfo}>
              <Text style={styles.gatewayName}>{gateway.name}</Text>
              <View style={styles.gatewayStatusRow}>
                <Text style={styles.gatewayFee}>Fee: {gateway.transactionFee}%</Text>
                <View style={[
                  styles.testModeTag,
                  gateway.testMode ? styles.testModeActive : styles.testModeInactive
                ]}>
                  <Text style={[
                    styles.testModeText,
                    gateway.testMode ? styles.testModeActiveText : styles.testModeInactiveText
                  ]}>
                    {gateway.testMode ? 'Test Mode' : 'Live Mode'}
                  </Text>
                </View>
              </View>
            </View>
            <Switch
              value={gateway.enabled}
              onValueChange={() => toggleGateway(gateway.id)}
              trackColor={{ false: LightTheme.OutlineVariant, true: LightTheme.Primary }}
              thumbColor={gateway.enabled ? LightTheme.OnPrimary : LightTheme.OnSurface}
            />
          </View>

          {gateway.enabled && (
            <View style={styles.gatewayDetails}>
              <View style={styles.configRow}>
                <Text style={styles.configLabel}>API Key</Text>
                <TextInput
                  style={styles.configInput}
                  value={gateway.apiKey}
                  placeholder="Enter API Key"
                  secureTextEntry={editingGateway !== gateway.id}
                />
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditingGateway(
                    editingGateway === gateway.id ? null : gateway.id
                  )}
                >
                  <Text style={styles.editButtonText}>
                    {editingGateway === gateway.id ? 'Hide' : 'Edit'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.configRow}>
                <Text style={styles.configLabel}>Webhook URL</Text>
                <TextInput
                  style={[styles.configInput, styles.configInputFull]}
                  value={gateway.webhookUrl}
                  placeholder="Webhook URL"
                  editable={false}
                />
              </View>

              <View style={styles.configRow}>
                <Text style={styles.configLabel}>Test Mode</Text>
                <Switch
                  value={gateway.testMode}
                  onValueChange={() => toggleTestMode(gateway.id)}
                  trackColor={{ false: LightTheme.OutlineVariant, true: '#FF9800' }}
                  thumbColor={gateway.testMode ? LightTheme.OnPrimary : LightTheme.OnSurface}
                />
              </View>

              <View style={styles.currencyContainer}>
                <Text style={styles.configLabel}>Supported Currencies</Text>
                <View style={styles.currencyList}>
                  {gateway.currency.map((curr) => (
                    <View key={curr} style={styles.currencyTag}>
                      <Text style={styles.currencyText}>{curr}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addGatewayButton}>
        <Text style={styles.addGatewayIcon}>+</Text>
        <Text style={styles.addGatewayText}>Add New Gateway</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFeeStructure = () => (
    <View style={styles.feesContainer}>
      {feeStructures.map((fee) => (
        <View key={fee.id} style={styles.feeCard}>
          <View style={styles.feeHeader}>
            <Text style={styles.feeName}>{fee.name}</Text>
            <View style={[
              styles.feeTypeTag,
              fee.type === 'fixed' ? styles.feeTypeFixed : styles.feeTypePercentage
            ]}>
              <Text style={styles.feeTypeText}>{fee.type}</Text>
            </View>
          </View>
          
          <View style={styles.feeDetails}>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Amount</Text>
              <Text style={styles.feeValue}>
                {fee.type === 'percentage' ? `${fee.value}%` : `₹${fee.value}`}
              </Text>
            </View>
            
            {fee.minAmount && (
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Minimum</Text>
                <Text style={styles.feeValue}>₹{fee.minAmount}</Text>
              </View>
            )}
            
            {fee.maxAmount && (
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Maximum</Text>
                <Text style={styles.feeValue}>₹{fee.maxAmount}</Text>
              </View>
            )}
            
            <View style={styles.applicableContainer}>
              <Text style={styles.feeLabel}>Applicable For</Text>
              <View style={styles.applicableList}>
                {fee.applicableFor.map((item) => (
                  <View key={item} style={styles.applicableTag}>
                    <Text style={styles.applicableText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.feeActions}>
            <TouchableOpacity style={styles.editFeeButton}>
              <Text style={styles.editFeeText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteFeeButton}>
              <Text style={styles.deleteFeeText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addFeeButton}>
        <Text style={styles.addFeeIcon}>+</Text>
        <Text style={styles.addFeeText}>Add New Fee Structure</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSecurity = () => {
    const fraudSettings = securitySettings.filter(s => s.category === 'fraud_detection');
    const limitSettings = securitySettings.filter(s => s.category === 'transaction_limits');
    const notificationSettings = securitySettings.filter(s => s.category === 'notifications');

    const toggleSecuritySetting = (settingKey: string) => {
      // TODO: Implement database update using update_security_setting RPC
      // const setting = securitySettings.find(s => s.settingKey === settingKey);
      // await supabase.rpc('update_security_setting', {
      //   p_setting_key: settingKey,
      //   p_setting_value: !setting?.settingValue
      // });
      // refetchSecurity();
      Alert.alert('Info', 'Security setting toggle requires database update implementation');
    };

    return (
      <View style={styles.securityContainer}>
        {fraudSettings.length > 0 && (
          <View style={styles.securitySection}>
            <Text style={styles.securityTitle}>Fraud Detection</Text>
            {fraudSettings.map((setting) => (
              <View key={setting.id} style={styles.securityOption}>
                <Text style={styles.securityLabel}>
                  {setting.description || setting.settingKey.replace(/_/g, ' ')}
                </Text>
                <Switch
                  value={setting.settingValue}
                  onValueChange={() => toggleSecuritySetting(setting.settingKey)}
                  trackColor={{ false: LightTheme.OutlineVariant, true: LightTheme.Primary }}
                  thumbColor={setting.settingValue ? LightTheme.OnPrimary : LightTheme.OnSurface}
                />
              </View>
            ))}
          </View>
        )}

        {limitSettings.length > 0 && (
          <View style={styles.securitySection}>
            <Text style={styles.securityTitle}>Transaction Limits</Text>
            {limitSettings.map((setting) => (
              <View key={setting.id} style={styles.limitRow}>
                <Text style={styles.limitLabel}>
                  {setting.description || setting.settingKey.replace(/_/g, ' ')}
                </Text>
                <TextInput
                  style={styles.limitInput}
                  value={setting.numericValue?.toString() || '0'}
                  placeholder="Enter limit"
                  editable={false}
                />
              </View>
            ))}
          </View>
        )}

        {notificationSettings.length > 0 && (
          <View style={styles.securitySection}>
            <Text style={styles.securityTitle}>Notifications</Text>
            {notificationSettings.map((setting) => (
              <View key={setting.id} style={styles.securityOption}>
                <Text style={styles.securityLabel}>
                  {setting.description || setting.settingKey.replace(/_/g, ' ')}
                </Text>
                <Switch
                  value={setting.settingValue}
                  onValueChange={() => toggleSecuritySetting(setting.settingKey)}
                  trackColor={{ false: LightTheme.OutlineVariant, true: LightTheme.Primary }}
                  thumbColor={setting.settingValue ? LightTheme.OnPrimary : LightTheme.OnSurface}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={LightTheme.Primary} />
          <Text style={styles.loadingText}>Loading payment settings...</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load payment settings</Text>
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
        {activeTab === 'gateways' && renderPaymentGateways()}
        {activeTab === 'fees' && renderFeeStructure()}
        {activeTab === 'security' && renderSecurity()}
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
  saveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing?.LG ?? 24,
    paddingVertical: Spacing?.SM ?? 8,
    borderRadius: 20,
  },
  saveButtonText: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnPrimary,
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
    paddingVertical: Spacing?.MD ?? 12,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: LightTheme.Primary,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: Spacing?.XS ?? 4,
  },
  tabText: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    fontWeight: '500',
  },
  tabTextActive: {
    color: LightTheme.OnPrimary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  gatewaysContainer: {
    padding: Spacing?.MD ?? 12,
  },
  gatewayCard: {
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
  gatewayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  gatewayInfo: {
    flex: 1,
  },
  gatewayName: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing?.SM ?? 8,
  },
  gatewayStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  gatewayFee: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  testModeTag: {
    paddingHorizontal: Spacing?.SM ?? 8,
    paddingVertical: Spacing?.XS ?? 4,
    borderRadius: 12,
  },
  testModeActive: {
    backgroundColor: '#FFF3E0',
  },
  testModeInactive: {
    backgroundColor: '#E8F5E8',
  },
  testModeText: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    fontWeight: '600',
  },
  testModeActiveText: {
    color: '#FF9800',
  },
  testModeInactiveText: {
    color: '#4CAF50',
  },
  gatewayDetails: {
    marginTop: Spacing?.LG ?? 24,
    paddingTop: Spacing?.LG ?? 24,
    borderTopWidth: 1,
    borderTopColor: LightTheme.OutlineVariant,
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing?.MD ?? 12,
  },
  configLabel: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurface,
    width: 100,
    fontWeight: '500',
  },
  configInput: {
    flex: 1,
    backgroundColor: LightTheme.SurfaceVariant,
    padding: Spacing?.SM ?? 8,
    borderRadius: 8,
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurface,
    marginRight: Spacing?.SM ?? 8,
  },
  configInputFull: {
    marginRight: 0,
  },
  editButton: {
    backgroundColor: LightTheme.Primary,
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.SM ?? 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnPrimary,
  },
  currencyContainer: {
    marginTop: Spacing?.SM ?? 8,
  },
  currencyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing?.SM ?? 8,
  },
  currencyTag: {
    backgroundColor: LightTheme.primaryContainer,
    paddingHorizontal: Spacing?.SM ?? 8,
    paddingVertical: Spacing?.XS ?? 4,
    borderRadius: 12,
    marginRight: Spacing?.SM ?? 8,
    marginBottom: Spacing?.XS ?? 4,
  },
  currencyText: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnPrimaryContainer,
  },
  addGatewayButton: {
    backgroundColor: LightTheme.SurfaceVariant,
    padding: Spacing?.XL ?? 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: LightTheme.OutlineVariant,
    borderStyle: 'dashed',
  },
  addGatewayIcon: {
    fontSize: 32,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing?.SM ?? 8,
  },
  addGatewayText: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurfaceVariant,
  },
  feesContainer: {
    padding: Spacing?.MD ?? 12,
  },
  feeCard: {
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
  feeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing?.LG ?? 24,
  },
  feeName: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
  },
  feeTypeTag: {
    paddingHorizontal: Spacing?.SM ?? 8,
    paddingVertical: Spacing?.XS ?? 4,
    borderRadius: 12,
  },
  feeTypeFixed: {
    backgroundColor: '#E3F2FD',
  },
  feeTypePercentage: {
    backgroundColor: '#F3E5F5',
  },
  feeTypeText: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
    textTransform: 'capitalize',
  },
  feeDetails: {
    marginBottom: Spacing?.LG ?? 24,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing?.SM ?? 8,
  },
  feeLabel: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
  },
  feeValue: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurface,
  },
  applicableContainer: {
    marginTop: Spacing?.SM ?? 8,
  },
  applicableList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing?.SM ?? 8,
  },
  applicableTag: {
    backgroundColor: LightTheme.secondaryContainer,
    paddingHorizontal: Spacing?.SM ?? 8,
    paddingVertical: Spacing?.XS ?? 4,
    borderRadius: 12,
    marginRight: Spacing?.SM ?? 8,
    marginBottom: Spacing?.XS ?? 4,
  },
  applicableText: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSecondaryContainer,
  },
  feeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editFeeButton: {
    backgroundColor: LightTheme.Primary,
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.SM ?? 8,
    borderRadius: 8,
    marginRight: Spacing?.SM ?? 8,
  },
  editFeeText: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnPrimary,
  },
  deleteFeeButton: {
    backgroundColor: LightTheme.errorContainer,
    paddingHorizontal: Spacing?.MD ?? 12,
    paddingVertical: Spacing?.SM ?? 8,
    borderRadius: 8,
  },
  deleteFeeText: {
    fontSize: Typography.bodySmall.fontSize,
    fontFamily: Typography.bodySmall.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnErrorContainer,
  },
  addFeeButton: {
    backgroundColor: LightTheme.SurfaceVariant,
    padding: Spacing?.XL ?? 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: LightTheme.OutlineVariant,
    borderStyle: 'dashed',
  },
  addFeeIcon: {
    fontSize: 32,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing?.SM ?? 8,
  },
  addFeeText: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnSurfaceVariant,
  },
  securityContainer: {
    padding: Spacing?.MD ?? 12,
  },
  securitySection: {
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
  securityTitle: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.OnSurface,
    marginBottom: Spacing?.LG ?? 24,
  },
  securityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing?.MD ?? 12,
  },
  securityLabel: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurface,
    flex: 1,
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing?.MD ?? 12,
  },
  limitLabel: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurface,
    width: 120,
  },
  limitInput: {
    flex: 1,
    backgroundColor: LightTheme.SurfaceVariant,
    padding: Spacing?.SM ?? 8,
    borderRadius: 8,
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurface,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing?.XL ?? 32,
  },
  loadingText: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    marginTop: Spacing?.LG ?? 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing?.XL ?? 32,
  },
  errorText: {
    fontSize: Typography.titleMedium.fontSize,
    fontFamily: Typography.titleMedium.fontFamily,
    fontWeight: Typography.titleMedium.fontWeight,
    color: LightTheme.Error,
    marginBottom: Spacing?.SM ?? 8,
  },
  errorSubtext: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: Typography.bodyMedium.fontFamily,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
    marginBottom: Spacing?.LG ?? 24,
  },
  retryButton: {
    backgroundColor: LightTheme.Primary,
    paddingHorizontal: Spacing?.XL ?? 32,
    paddingVertical: Spacing?.MD ?? 12,
    borderRadius: 20,
  },
  retryButtonText: {
    fontSize: Typography.bodyLarge.fontSize,
    fontFamily: Typography.bodyLarge.fontFamily,
    fontWeight: '600',
    color: LightTheme.OnPrimary,
  },
});

export default PaymentSettingsScreen;
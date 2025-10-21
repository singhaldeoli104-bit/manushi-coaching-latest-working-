/**
 * Admin Navigation
 * Stack navigator with comprehensive admin screens - CORRECTED VERSION
 * Uses actual existing screen files from migration
 * NOTE: Drawer navigation removed due to react-native-reanimated incompatibility with RN 0.80.2
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';

// Actual Screen Imports (verified to exist)
import Phase90AdminDashboard from '../screens/admin/Phase90AdminDashboard';
import AdminDashboard from '../screens/admin/AdminDashboard';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import OrganizationManagementScreen from '../screens/admin/OrganizationManagementScreen';
import OperationsManagementScreen from '../screens/admin/OperationsManagementScreen';
import AdvancedAnalyticsScreen from '../screens/admin/AdvancedAnalyticsScreen';
import RealTimeMonitoringDashboard from '../screens/admin/RealTimeMonitoringDashboard';
import FinancialReportsScreen from '../screens/admin/FinancialReportsScreen';
import KPIDetailScreen from '../screens/admin/KPIDetailScreen';
import PaymentSettingsScreen from '../screens/admin/PaymentSettingsScreen';
import ContentManagementScreen from '../screens/admin/ContentManagementScreen';
import SupportCenterScreen from '../screens/admin/SupportCenterScreen';
import AlertDetailScreen from '../screens/admin/AlertDetailScreen';
import SystemSettingsScreen from '../screens/admin/SystemSettingsScreen';
import BusinessConfigurationScreen from '../screens/admin/BusinessConfigurationScreen';
import SystemOptimizationScreen from '../screens/admin/SystemOptimizationScreen';
import SecurityComplianceScreen from '../screens/admin/SecurityComplianceScreen';
import ComplianceAuditScreen from '../screens/admin/ComplianceAuditScreen';
import ComprehensiveAuditSystemScreen from '../screens/admin/ComprehensiveAuditSystemScreen';
import QualityAssuranceTestingScreen from '../screens/admin/QualityAssuranceTestingScreen';
import EnterpriseIntelligenceSuite from '../screens/admin/EnterpriseIntelligenceSuite';
import AIAgentEcosystem from '../screens/admin/AIAgentEcosystem';
import PlatformScalabilityDashboard from '../screens/admin/PlatformScalabilityDashboard';
import StrategicPlanningScreen from '../screens/admin/StrategicPlanningScreen';
import ProductionDeploymentLaunchScreen from '../screens/admin/ProductionDeploymentLaunchScreen';
import MobileOptimizationPWAScreen from '../screens/admin/MobileOptimizationPWAScreen';
import UIUXEnhancementPolishScreen from '../screens/admin/UIUXEnhancementPolishScreen';
import CrossRoleIntegrationTestingScreen from '../screens/admin/CrossRoleIntegrationTestingScreen';

const Stack = createNativeStackNavigator();

// Main Admin Navigator (Stack-based)
export default function AdminNavigator() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.Surface },
        headerTintColor: theme.OnSurface,
        headerShadowVisible: false,
      }}
    >
      {/* Dashboards */}
      <Stack.Screen
        name="Phase90Dashboard"
        component={Phase90AdminDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{ title: 'Admin Dashboard' }}
      />

      {/* Management Screens */}
      <Stack.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{ title: 'User Management' }}
      />
      <Stack.Screen
        name="OrganizationManagement"
        component={OrganizationManagementScreen}
        options={{ title: 'Organization' }}
      />
      <Stack.Screen
        name="OperationsManagement"
        component={OperationsManagementScreen}
        options={{ title: 'Operations' }}
      />

      {/* Analytics & Monitoring */}
      <Stack.Screen
        name="AdvancedAnalytics"
        component={AdvancedAnalyticsScreen}
        options={{ title: 'Advanced Analytics' }}
      />
      <Stack.Screen
        name="RealTimeMonitoring"
        component={RealTimeMonitoringDashboard}
        options={{ title: 'Real-time Monitoring' }}
      />
      <Stack.Screen
        name="EnterpriseIntelligence"
        component={EnterpriseIntelligenceSuite}
        options={{ title: 'Enterprise Intelligence' }}
      />
      <Stack.Screen
        name="KPIDetail"
        component={KPIDetailScreen}
        options={{ title: 'KPI Details' }}
      />

      {/* Financial */}
      <Stack.Screen
        name="FinancialReports"
        component={FinancialReportsScreen}
        options={{ title: 'Financial Reports' }}
      />
      <Stack.Screen
        name="PaymentSettings"
        component={PaymentSettingsScreen}
        options={{ title: 'Payment Settings' }}
      />

      {/* Content & Support */}
      <Stack.Screen
        name="ContentManagement"
        component={ContentManagementScreen}
        options={{ title: 'Content Management' }}
      />
      <Stack.Screen
        name="SupportCenter"
        component={SupportCenterScreen}
        options={{ title: 'Support Center' }}
      />
      <Stack.Screen
        name="AlertDetail"
        component={AlertDetailScreen}
        options={{ title: 'Alert Details' }}
      />

      {/* System Configuration */}
      <Stack.Screen
        name="SystemSettings"
        component={SystemSettingsScreen}
        options={{ title: 'System Settings' }}
      />
      <Stack.Screen
        name="BusinessConfiguration"
        component={BusinessConfigurationScreen}
        options={{ title: 'Business Config' }}
      />
      <Stack.Screen
        name="SystemOptimization"
        component={SystemOptimizationScreen}
        options={{ title: 'System Optimization' }}
      />

      {/* Security & Compliance */}
      <Stack.Screen
        name="SecurityCompliance"
        component={SecurityComplianceScreen}
        options={{ title: 'Security & Compliance' }}
      />
      <Stack.Screen
        name="ComplianceAudit"
        component={ComplianceAuditScreen}
        options={{ title: 'Compliance Audit' }}
      />
      <Stack.Screen
        name="ComprehensiveAudit"
        component={ComprehensiveAuditSystemScreen}
        options={{ title: 'Comprehensive Audit' }}
      />

      {/* Quality & Testing */}
      <Stack.Screen
        name="QualityAssurance"
        component={QualityAssuranceTestingScreen}
        options={{ title: 'Quality Assurance' }}
      />
      <Stack.Screen
        name="CrossRoleIntegration"
        component={CrossRoleIntegrationTestingScreen}
        options={{ title: 'Integration Testing' }}
      />

      {/* Advanced Features */}
      <Stack.Screen
        name="AIAgentEcosystem"
        component={AIAgentEcosystem}
        options={{ title: 'AI Agent Ecosystem' }}
      />
      <Stack.Screen
        name="PlatformScalability"
        component={PlatformScalabilityDashboard}
        options={{ title: 'Platform Scalability' }}
      />
      <Stack.Screen
        name="StrategicPlanning"
        component={StrategicPlanningScreen}
        options={{ title: 'Strategic Planning' }}
      />

      {/* Deployment & Launch */}
      <Stack.Screen
        name="ProductionDeployment"
        component={ProductionDeploymentLaunchScreen}
        options={{ title: 'Production Deployment' }}
      />
      <Stack.Screen
        name="MobileOptimization"
        component={MobileOptimizationPWAScreen}
        options={{ title: 'Mobile Optimization' }}
      />
      <Stack.Screen
        name="UIUXEnhancement"
        component={UIUXEnhancementPolishScreen}
        options={{ title: 'UI/UX Enhancement' }}
      />
    </Stack.Navigator>
  );
}

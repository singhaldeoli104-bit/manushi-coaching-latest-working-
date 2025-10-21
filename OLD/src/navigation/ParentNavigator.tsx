/**
 * Parent Navigation
 * Bottom tab navigator with nested stacks - CORRECTED VERSION
 * Uses actual existing screen files from migration
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary';

// Actual Screen Imports (verified to exist)
import EnhancedParentDashboardScreen from '../screens/parent/EnhancedParentDashboardScreen';
import ChildProgressMonitoringScreen from '../screens/parent/ChildProgressMonitoringScreen';
import PerformanceAnalyticsScreen from '../screens/parent/PerformanceAnalyticsScreen';
import AcademicScheduleScreen from '../screens/parent/AcademicScheduleScreen';
import TeacherCommunicationScreen from '../screens/parent/TeacherCommunicationScreen';
import CommunityEngagementScreen from '../screens/parent/CommunityEngagementScreen';
import BillingInvoiceScreen from '../screens/parent/BillingInvoiceScreen';
import PaymentProcessingScreen from '../screens/parent/PaymentProcessingScreen';
import InformationHubScreen from '../screens/parent/InformationHubScreen';

// NEW: Modern dashboard with real Supabase integration
import NewParentDashboard from '../screens/parent/NewParentDashboard';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Error Fallback Component
const ErrorFallback = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.errorContainer, { backgroundColor: theme.Background }]}>
      <Icon name="error-outline" size={64} color={theme.Error} />
      <Text style={[styles.errorTitle, { color: theme.OnSurface }]}>
        Something went wrong
      </Text>
      <Text style={[styles.errorMessage, { color: theme.OnSurfaceVariant }]}>
        We're sorry for the inconvenience. Please try again or contact support if the problem persists.
      </Text>
      <TouchableOpacity
        style={[styles.errorButton, { backgroundColor: theme.Primary }]}
        onPress={() => {
          // In a real app, this would trigger navigation or reload
          console.log('Error fallback - Try Again pressed');
        }}
      >
        <Text style={[styles.errorButtonText, { color: theme.OnPrimary }]}>
          Try Again
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Home Stack (Dashboard)
function HomeStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.Surface },
        headerTintColor: theme.OnSurface,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="NewDashboard"
        options={{
          headerShown: true,
          title: 'Parent Dashboard (NEW ✨)',
          headerStyle: { backgroundColor: theme.Primary },
          headerTintColor: '#fff',
        }}
      >
        {(props) => (
          <ErrorBoundary fallback={<ErrorFallback />}>
            <NewParentDashboard {...props} />
          </ErrorBoundary>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Dashboard"
        options={{ headerShown: false, title: 'Dashboard (Old)' }}
      >
        {(props) => (
          <ErrorBoundary fallback={<ErrorFallback />}>
            <EnhancedParentDashboardScreen {...props} />
          </ErrorBoundary>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="InformationHub"
        options={{ title: 'Information Hub' }}
      >
        {(props) => (
          <ErrorBoundary fallback={<ErrorFallback />}>
            <InformationHubScreen {...props} />
          </ErrorBoundary>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Children Progress Stack
function ChildrenStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.Surface },
        headerTintColor: theme.OnSurface,
      }}
    >
      <Stack.Screen
        name="ChildProgress"
        options={{ title: 'Child Progress' }}
      >
        {(props) => (
          <ErrorBoundary fallback={<ErrorFallback />}>
            <ChildProgressMonitoringScreen {...props} />
          </ErrorBoundary>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="PerformanceAnalytics"
        options={{ title: 'Performance' }}
      >
        {(props) => (
          <ErrorBoundary fallback={<ErrorFallback />}>
            <PerformanceAnalyticsScreen {...props} />
          </ErrorBoundary>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="AcademicSchedule"
        options={{ title: 'Schedule' }}
      >
        {(props) => (
          <ErrorBoundary fallback={<ErrorFallback />}>
            <AcademicScheduleScreen {...props} />
          </ErrorBoundary>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Communication Stack
function CommunicationStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.Surface },
        headerTintColor: theme.OnSurface,
      }}
    >
      <Stack.Screen
        name="TeacherCommunication"
        options={{ title: 'Teachers' }}
      >
        {(props) => (
          <ErrorBoundary fallback={<ErrorFallback />}>
            <TeacherCommunicationScreen {...props} />
          </ErrorBoundary>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="CommunityEngagement"
        options={{ title: 'Community' }}
      >
        {(props) => (
          <ErrorBoundary fallback={<ErrorFallback />}>
            <CommunityEngagementScreen {...props} />
          </ErrorBoundary>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Billing Stack
function BillingStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.Surface },
        headerTintColor: theme.OnSurface,
      }}
    >
      <Stack.Screen
        name="BillingInvoice"
        options={{ title: 'Billing & Invoices' }}
      >
        {(props) => (
          <ErrorBoundary fallback={<ErrorFallback />}>
            <BillingInvoiceScreen {...props} />
          </ErrorBoundary>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="PaymentProcessing"
        options={{ title: 'Make Payment' }}
      >
        {(props) => (
          <ErrorBoundary fallback={<ErrorFallback />}>
            <PaymentProcessingScreen {...props} />
          </ErrorBoundary>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Main Parent Tab Navigator
export default function ParentNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.Primary,
        tabBarInactiveTintColor: theme.OnSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.Surface,
          borderTopWidth: 1,
          borderTopColor: theme.Outline,
          maxWidth: 500,
          alignSelf: 'center',
          width: '100%',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          fontFamily: 'System',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name="home" size={focused ? 28 : 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Children"
        component={ChildrenStack}
        options={{
          tabBarLabel: 'Children',
          tabBarAccessibilityLabel: 'Children progress tab',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name="child-care" size={focused ? 28 : 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Communication"
        component={CommunicationStack}
        options={{
          tabBarLabel: 'Messages',
          tabBarAccessibilityLabel: 'Communication tab',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name="chat" size={focused ? 28 : 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Billing"
        component={BillingStack}
        options={{
          tabBarLabel: 'Billing',
          tabBarAccessibilityLabel: 'Billing and payments tab',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name="payment" size={focused ? 28 : 24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

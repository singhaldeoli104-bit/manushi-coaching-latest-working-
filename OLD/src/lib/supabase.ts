/**
 * Supabase Configuration
 * Manushi Coaching Platform - Database Integration
 */

import 'react-native-url-polyfill/auto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase configuration. Please check your .env file and ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.'
  );
}

// Create Supabase client with minimal configuration
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'x-application-name': 'Manushi-Coaching-Platform',
    },
  },
});

// Connection status tracking
let connectionStatus: 'connected' | 'disconnected' | 'connecting' = 'disconnected';

// Auth state listener with detailed logging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔐 [Supabase] Auth state changed:', {
    event,
    hasSession: !!session,
    userId: session?.user?.id,
    email: session?.user?.email,
    role: session?.user?.user_metadata?.role,
  });

  if (event === 'SIGNED_IN') {
    connectionStatus = 'connected';
    console.log('✅ [Supabase] User signed in successfully');
  } else if (event === 'SIGNED_OUT') {
    connectionStatus = 'disconnected';
    console.log('👋 [Supabase] User signed out');
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('🔄 [Supabase] Token refreshed');
  } else if (event === 'USER_UPDATED') {
    console.log('👤 [Supabase] User profile updated');
  }
});

// Test connection on startup
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    connectionStatus = 'connecting';

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      connectionStatus = 'disconnected';
      return false;
    }

    console.log('✅ Supabase connected successfully');
    connectionStatus = 'connected';
    return true;
  } catch (err) {
    console.error('❌ Supabase connection error:', err);
    connectionStatus = 'disconnected';
    return false;
  }
};

// Export connection status
export const getConnectionStatus = () => connectionStatus;

// Initialize connection test
testSupabaseConnection();

export default supabase;

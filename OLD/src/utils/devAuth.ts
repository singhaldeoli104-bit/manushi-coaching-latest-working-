/**
 * Development Authentication Helper
 * Auto-login for testing without going through login flow
 * ⚠️ FOR DEVELOPMENT ONLY - REMOVE IN PRODUCTION
 */

import { supabase } from '../lib/supabase';

/**
 * Auto-login as test parent for development
 * This bypasses login screen and sets up proper auth session
 */
export const devAutoLogin = async (): Promise<boolean> => {
  try {
    console.log('🔐 [DevAuth] Attempting auto-login...');

    // Check if already logged in
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      console.log('✅ [DevAuth] Already logged in:', session.user.email);
      return true;
    }

    // Try to sign in with test parent credentials
    // You'll need to create this user in Supabase if it doesn't exist
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test.parent@example.com',
      password: 'TestParent123!', // Change this to your actual test password
    });

    if (error) {
      console.error('❌ [DevAuth] Auto-login failed:', error.message);
      console.log('💡 [DevAuth] Please create test user: test.parent@example.com');
      return false;
    }

    console.log('✅ [DevAuth] Auto-login successful:', data.user.email);
    console.log('👤 [DevAuth] User ID:', data.user.id);

    return true;
  } catch (err) {
    console.error('❌ [DevAuth] Exception:', err);
    return false;
  }
};

/**
 * Set auth session manually using the test parent ID
 * This creates a mock session for testing RLS policies
 */
export const devSetMockSession = async (): Promise<void> => {
  try {
    console.log('🔧 [DevAuth] Setting mock session for testing...');

    // Note: This won't actually work for RLS because Supabase validates JWT tokens
    // We need real authentication or service role key
    console.warn('⚠️ [DevAuth] Mock sessions don\'t bypass RLS - use real login');
  } catch (err) {
    console.error('❌ [DevAuth] Failed to set mock session:', err);
  }
};

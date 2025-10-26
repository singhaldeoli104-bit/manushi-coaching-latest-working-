// Run this script once to clear Supabase auth cache
// node clear_auth.js

const AsyncStorage = require('@react-native-async-storage/async-storage').default;

async function clearAuth() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const authKeys = keys.filter(key => key.includes('auth') || key.includes('supabase'));

    console.log('Found auth keys:', authKeys);

    if (authKeys.length > 0) {
      await AsyncStorage.multiRemove(authKeys);
      console.log('✅ Cleared auth cache successfully');
    } else {
      console.log('No auth keys found');
    }
  } catch (error) {
    console.error('Error clearing auth:', error);
  }
}

clearAuth();

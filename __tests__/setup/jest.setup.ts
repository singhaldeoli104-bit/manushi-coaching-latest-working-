/**
 * Jest Setup File
 * Runs before all tests
 *
 * - Loads environment variables
 * - Configures test database
 * - Sets up global test utilities
 */

import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.test
const envPath = path.resolve(process.cwd(), '.env.test');
config({ path: envPath });

// Ensure required environment variables are set
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set in .env.test`);
  }
}

// Set test timeout
jest.setTimeout(30000);

// Global test utilities
global.TEST_USER_IDS = {
  admin: process.env.TEST_ADMIN_ID || '',
  teacher: process.env.TEST_TEACHER_ID || '',
  parent: process.env.TEST_PARENT_ID || '',
  student: process.env.TEST_STUDENT_ID || '',
};

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(), // Suppress console.log in tests
  warn: jest.fn(), // Suppress console.warn in tests
  // Keep error and info for debugging
};

// Add custom matchers if needed
expect.extend({
  toBeValidUUID(received: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);

    return {
      pass,
      message: () => pass
        ? `Expected ${received} not to be a valid UUID`
        : `Expected ${received} to be a valid UUID`,
    };
  },

  toBeISO8601(received: string) {
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
    const pass = iso8601Regex.test(received);

    return {
      pass,
      message: () => pass
        ? `Expected ${received} not to be an ISO 8601 date`
        : `Expected ${received} to be an ISO 8601 date`,
    };
  },
});

// Extend Jest matchers type definitions
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidUUID(): R;
      toBeISO8601(): R;
    }
  }

  var TEST_USER_IDS: {
    admin: string;
    teacher: string;
    parent: string;
    student: string;
  };
}

console.info('Jest setup complete');

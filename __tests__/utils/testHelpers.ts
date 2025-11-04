/**
 * Test Utilities and Helpers
 * Common functions used across all tests
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ==================== SUPABASE TEST CLIENTS ====================

/**
 * Create a Supabase client for testing
 * @param accessToken - Optional JWT token for authenticated client
 */
export function createTestSupabaseClient(accessToken?: string): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  // If access token provided, set it
  if (accessToken) {
    client.auth.setSession({
      access_token: accessToken,
      refresh_token: '',
    } as any);
  }

  return client;
}

/**
 * Create authenticated Supabase client for specific user role
 * @param userId - User UUID
 */
export async function createAuthenticatedClient(userId: string): Promise<SupabaseClient> {
  // This is a simplified version. In production, you'd sign in with real credentials
  // For testing, you might use service role key or create test tokens

  const client = createTestSupabaseClient();

  // TODO: Implement actual authentication for test users
  // For now, return unauthenticated client
  return client;
}

// ==================== DATA GENERATORS ====================

/**
 * Generate random UUID (v4)
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generate random student data
 * Matches actual students table structure: id, student_id, full_name, email, phone, parent_id, batch_id, enrollment_date, status
 */
export function generateTestStudent(overrides: Partial<any> = {}) {
  return {
    student_id: `STU-TEST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    full_name: 'Test Student',
    email: `test.student.${Date.now()}@test.com`,
    phone: '1234567890',
    enrollment_date: new Date().toISOString().split('T')[0],
    status: 'active',
    ...overrides,
  };
}

/**
 * Generate random teacher data
 */
export function generateTestTeacher(overrides: Partial<any> = {}) {
  return {
    teacher_id: `TCH${Date.now()}${Math.floor(Math.random() * 1000)}`,
    first_name: 'Test',
    last_name: 'Teacher',
    email: `test.teacher.${Date.now()}@test.com`,
    phone: '1234567890',
    date_of_birth: '1990-01-01',
    gender: 'female',
    qualification: 'M.Sc.',
    subject_specialization: 'Mathematics',
    hire_date: new Date().toISOString().split('T')[0],
    employment_status: 'active',
    ...overrides,
  };
}

/**
 * Generate random parent data
 */
export function generateTestParent(overrides: Partial<any> = {}) {
  return {
    first_name: 'Test',
    last_name: 'Parent',
    email: `test.parent.${Date.now()}@test.com`,
    phone: '1234567890',
    relationship: 'father',
    occupation: 'Engineer',
    ...overrides,
  };
}

/**
 * Generate random assignment data
 */
export function generateTestAssignment(teacherId: string, overrides: Partial<any> = {}) {
  return {
    title: `Test Assignment ${Date.now()}`,
    description: 'Test assignment description',
    teacher_id: teacherId,
    subject: 'Mathematics',
    class_level: '10',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    total_marks: 100,
    status: 'active',
    ...overrides,
  };
}

// ==================== CLEANUP UTILITIES ====================

/**
 * Clean up test data after test execution
 */
export class TestDataCleanup {
  private static cleanupTasks: Array<() => Promise<void>> = [];

  /**
   * Register cleanup task
   */
  static register(task: () => Promise<void>) {
    this.cleanupTasks.push(task);
  }

  /**
   * Execute all cleanup tasks
   */
  static async executeAll() {
    for (const task of this.cleanupTasks) {
      try {
        await task();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }
    this.cleanupTasks = [];
  }

  /**
   * Delete test record from database
   */
  static async deleteRecord(
    client: SupabaseClient,
    table: string,
    id: string,
    idColumn: string = 'id'
  ) {
    await client.from(table).delete().eq(idColumn, id);
  }
}

// ==================== ASSERTION HELPERS ====================

/**
 * Wait for condition to be true
 * @param condition - Function that returns boolean
 * @param timeout - Timeout in milliseconds
 * @param interval - Check interval in milliseconds
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const result = await condition();
    if (result) return;

    await sleep(interval);
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Assert database record exists
 */
export async function assertRecordExists(
  client: SupabaseClient,
  table: string,
  id: string,
  idColumn: string = 'id'
): Promise<void> {
  const { data, error } = await client
    .from(table)
    .select('*')
    .eq(idColumn, id)
    .single();

  if (error || !data) {
    throw new Error(`Record not found in ${table} with ${idColumn}=${id}`);
  }
}

/**
 * Assert database record does not exist
 */
export async function assertRecordNotExists(
  client: SupabaseClient,
  table: string,
  id: string,
  idColumn: string = 'id'
): Promise<void> {
  const { data } = await client
    .from(table)
    .select('*')
    .eq(idColumn, id);

  if (data && data.length > 0) {
    throw new Error(`Record unexpectedly found in ${table} with ${idColumn}=${id}`);
  }
}

// ==================== PERFORMANCE HELPERS ====================

/**
 * Measure execution time of async function
 */
export async function measureExecutionTime<T>(
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;

  return { result, duration };
}

/**
 * Assert execution time is within threshold
 */
export async function assertExecutionTime<T>(
  fn: () => Promise<T>,
  maxDuration: number,
  label: string = 'Operation'
): Promise<T> {
  const { result, duration } = await measureExecutionTime(fn);

  if (duration > maxDuration) {
    throw new Error(
      `${label} took ${duration}ms, expected < ${maxDuration}ms`
    );
  }

  console.log(`${label} completed in ${duration}ms`);
  return result;
}

// ==================== MOCK DATA ====================

/**
 * Mock cache data for testing
 */
export const mockCacheData = {
  student: {
    id: 'mock-student-id',
    student_id: 'STU001',
    first_name: 'Mock',
    last_name: 'Student',
  },
  teacher: {
    id: 'mock-teacher-id',
    teacher_id: 'TCH001',
    first_name: 'Mock',
    last_name: 'Teacher',
  },
};

/**
 * Mock notification template
 */
export const mockNotificationTemplate = {
  type: 'test_notification',
  title_template: 'Test: {{title}}',
  message_template: 'Message: {{message}}',
  priority: 'medium' as const,
  category: 'test',
  is_active: true,
};

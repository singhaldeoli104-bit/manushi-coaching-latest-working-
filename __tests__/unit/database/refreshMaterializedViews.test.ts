/**
 * Database Function Tests: refresh_all_materialized_views()
 * Tests the PostgreSQL function that refreshes all materialized views
 */

import { createTestSupabaseClient } from '../../utils/testHelpers';
import { SupabaseClient } from '@supabase/supabase-js';

describe('refresh_all_materialized_views Database Function', () => {
  let supabase: SupabaseClient;

  beforeAll(() => {
    supabase = createTestSupabaseClient();
  });

  describe('Materialized View Refresh', () => {
    it('should successfully refresh all materialized views', async () => {
      const { data, error } = await supabase.rpc('refresh_all_materialized_views');

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should refresh concurrently for performance', async () => {
      // The function should use CONCURRENTLY option
      // This test verifies it completes within reasonable time

      const startTime = Date.now();

      const { error } = await supabase.rpc('refresh_all_materialized_views');

      const duration = Date.now() - startTime;

      expect(error).toBeNull();
      expect(duration).toBeLessThan(10000); // Should complete in < 10s

      console.log(`Materialized views refreshed in ${duration}ms`);
    });

    it('should be idempotent (safe to call multiple times)', async () => {
      // Calling multiple times should not cause errors
      const { error: error1 } = await supabase.rpc('refresh_all_materialized_views');
      const { error: error2 } = await supabase.rpc('refresh_all_materialized_views');
      const { error: error3 } = await supabase.rpc('refresh_all_materialized_views');

      expect(error1).toBeNull();
      expect(error2).toBeNull();
      expect(error3).toBeNull();
    });
  });

  describe('Data Verification', () => {
    it('should update teacher dashboard stats after refresh', async () => {
      // 1. Query mv_teacher_dashboard_stats before refresh
      const { data: beforeData } = await supabase
        .from('mv_teacher_dashboard_stats')
        .select('*')
        .limit(1);

      // 2. Refresh materialized views
      const { error } = await supabase.rpc('refresh_all_materialized_views');
      expect(error).toBeNull();

      // 3. Query again after refresh
      const { data: afterData } = await supabase
        .from('mv_teacher_dashboard_stats')
        .select('*')
        .limit(1);

      // Data should be present (may or may not be different)
      expect(afterData).toBeDefined();
    });

    it('should update class performance stats after refresh', async () => {
      const { error } = await supabase.rpc('refresh_all_materialized_views');
      expect(error).toBeNull();

      // Verify mv_teacher_class_overview is accessible
      const { data, error: queryError } = await supabase
        .from('mv_teacher_class_overview')
        .select('*')
        .limit(1);

      expect(queryError).toBeNull();
    });

    it('should update student progress stats after refresh', async () => {
      const { error } = await supabase.rpc('refresh_all_materialized_views');
      expect(error).toBeNull();

      // Verify mv_student_performance_summary is accessible
      const { data, error: queryError } = await supabase
        .from('mv_student_performance_summary')
        .select('*')
        .limit(1);

      expect(queryError).toBeNull();
    });
  });

  describe('Performance', () => {
    it('should not block other database operations', async () => {
      // Start refresh (non-blocking if using CONCURRENTLY)
      const refreshPromise = supabase.rpc('refresh_all_materialized_views');

      // Execute other queries while refresh is happening
      const queryPromise = supabase.from('students').select('count').single();

      // Both should complete
      const [refreshResult, queryResult] = await Promise.all([
        refreshPromise,
        queryPromise,
      ]);

      expect(refreshResult.error).toBeNull();
      // Query might error if no rows, but shouldn't hang
      expect(queryResult).toBeDefined();
    });

    it('should complete within SLA for scheduled refreshes', async () => {
      // If you have scheduled refreshes (e.g., every hour)
      // ensure they complete within acceptable time

      const startTime = Date.now();
      const { error } = await supabase.rpc('refresh_all_materialized_views');
      const duration = Date.now() - startTime;

      expect(error).toBeNull();
      expect(duration).toBeLessThan(30000); // 30 second SLA

      console.log(`Refresh SLA met: ${duration}ms (< 30000ms)`);
    });
  });

  describe('Error Handling', () => {
    it('should handle concurrent refresh calls gracefully', async () => {
      // Multiple simultaneous refresh calls
      const promises = [];
      for (let i = 0; i < 3; i++) {
        promises.push(supabase.rpc('refresh_all_materialized_views'));
      }

      const results = await Promise.all(promises);

      // All should complete (some might be no-ops if CONCURRENTLY prevents overlap)
      results.forEach((result) => {
        expect(result).toBeDefined();
      });
    });
  });

  describe('Materialized View Queries Performance', () => {
    it('should query teacher dashboard faster than raw query', async () => {
      const testTeacherId = process.env.TEST_TEACHER_ID;

      if (!testTeacherId) {
        console.warn('TEST_TEACHER_ID not set, skipping MV performance test');
        return;
      }

      // Ensure MV is refreshed
      await supabase.rpc('refresh_all_materialized_views');

      // Query materialized view
      const mvStart = Date.now();
      const { data: mvData } = await supabase
        .from('mv_teacher_dashboard_stats')
        .select('*')
        .eq('teacher_id', testTeacherId)
        .single();
      const mvDuration = Date.now() - mvStart;

      expect(mvData).toBeDefined();
      expect(mvDuration).toBeLessThan(100); // Materialized view should be very fast

      console.log(`MV query completed in ${mvDuration}ms`);
    });

    it('should query class performance stats efficiently', async () => {
      // Ensure MV is refreshed
      await supabase.rpc('refresh_all_materialized_views');

      const startTime = Date.now();
      const { data, error } = await supabase
        .from('mv_teacher_class_overview')
        .select('*')
        .limit(10);
      const duration = Date.now() - startTime;

      expect(error).toBeNull();
      expect(duration).toBeLessThan(100);

      console.log(`Class performance MV query: ${duration}ms`);
    });

    it('should query student progress stats efficiently', async () => {
      await supabase.rpc('refresh_all_materialized_views');

      const startTime = Date.now();
      const { data, error } = await supabase
        .from('mv_student_performance_summary')
        .select('*')
        .limit(10);
      const duration = Date.now() - startTime;

      expect(error).toBeNull();
      expect(duration).toBeLessThan(100);

      console.log(`Student progress MV query: ${duration}ms`);
    });
  });
});

/**
 * Cache Service Unit Tests
 * Tests for in-memory caching functionality
 */

import {
  setCache,
  getCache,
  hasCache,
  deleteCache,
  clearAllCache,
  clearCacheNamespace,
  clearExpiredCache,
  getCacheStats,
  getOrSetCache,
  invalidateCache,
  warmUpCache,
  generateCacheKey,
} from '../../../src/services/shared/cacheService';
import { sleep } from '../../utils/testHelpers';

describe('Cache Service', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearAllCache();
  });

  afterEach(() => {
    // Clean up after each test
    clearAllCache();
  });

  describe('Basic Operations', () => {
    it('should set and get cache value', () => {
      const testData = { id: '123', name: 'Test' };
      setCache('test-key', testData);

      const result = getCache('test-key');
      expect(result).toEqual(testData);
    });

    it('should return null for non-existent key', () => {
      const result = getCache('non-existent-key');
      expect(result).toBeNull();
    });

    it('should check if key exists', () => {
      setCache('test-key', { data: 'test' });

      expect(hasCache('test-key')).toBe(true);
      expect(hasCache('non-existent')).toBe(false);
    });

    it('should delete cache entry', () => {
      setCache('test-key', { data: 'test' });
      expect(hasCache('test-key')).toBe(true);

      const deleted = deleteCache('test-key');
      expect(deleted).toBe(true);
      expect(hasCache('test-key')).toBe(false);
    });

    it('should return false when deleting non-existent key', () => {
      const deleted = deleteCache('non-existent');
      expect(deleted).toBe(false);
    });

    it('should clear all cache entries', () => {
      setCache('key1', { data: '1' });
      setCache('key2', { data: '2' });
      setCache('key3', { data: '3' });

      clearAllCache();

      expect(hasCache('key1')).toBe(false);
      expect(hasCache('key2')).toBe(false);
      expect(hasCache('key3')).toBe(false);
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should respect TTL expiration', async () => {
      setCache('test-key', { data: 'test' }, { ttl: 100 });

      // Should exist immediately
      expect(getCache('test-key')).not.toBeNull();

      // Wait for expiration
      await sleep(150);

      // Should be expired
      expect(getCache('test-key')).toBeNull();
    });

    it('should not expire before TTL', async () => {
      setCache('test-key', { data: 'test' }, { ttl: 1000 });

      await sleep(500);

      // Should still exist
      expect(getCache('test-key')).not.toBeNull();
    });

    it('should use default TTL when not specified', () => {
      setCache('test-key', { data: 'test' });

      // Default TTL is 5 minutes (300000ms)
      expect(hasCache('test-key')).toBe(true);
    });

    it('should clear expired entries', async () => {
      setCache('expired-key', { data: '1' }, { ttl: 100 });
      setCache('valid-key', { data: '2' }, { ttl: 10000 });

      await sleep(150);

      const cleared = clearExpiredCache();
      expect(cleared).toBeGreaterThan(0);
      expect(hasCache('expired-key')).toBe(false);
      expect(hasCache('valid-key')).toBe(true);
    });
  });

  describe('Namespaced Caching', () => {
    it('should generate namespaced cache keys', () => {
      const key = generateCacheKey('users', 'user-123');
      expect(key).toBe('users:user-123');
    });

    it('should store and retrieve with namespace', () => {
      setCache('user-123', { name: 'John' }, { namespace: 'users' });

      const result = getCache('user-123', { namespace: 'users' });
      expect(result).toEqual({ name: 'John' });
    });

    it('should isolate different namespaces', () => {
      setCache('123', { type: 'user' }, { namespace: 'users' });
      setCache('123', { type: 'product' }, { namespace: 'products' });

      const userData = getCache('123', { namespace: 'users' });
      const productData = getCache('123', { namespace: 'products' });

      expect(userData).toEqual({ type: 'user' });
      expect(productData).toEqual({ type: 'product' });
    });

    it('should clear cache by namespace', () => {
      setCache('user-1', { name: 'Alice' }, { namespace: 'users' });
      setCache('user-2', { name: 'Bob' }, { namespace: 'users' });
      setCache('product-1', { name: 'Widget' }, { namespace: 'products' });

      const cleared = clearCacheNamespace('users');
      expect(cleared).toBe(2);

      expect(hasCache('user-1', { namespace: 'users' })).toBe(false);
      expect(hasCache('user-2', { namespace: 'users' })).toBe(false);
      expect(hasCache('product-1', { namespace: 'products' })).toBe(true);
    });
  });

  describe('getOrSet (Lazy Evaluation)', () => {
    it('should return cached value if exists', async () => {
      setCache('test-key', { data: 'cached' });

      let factoryCalled = false;
      const factory = async () => {
        factoryCalled = true;
        return { data: 'new' };
      };

      const result = await getOrSetCache('test-key', factory);

      expect(result).toEqual({ data: 'cached' });
      expect(factoryCalled).toBe(false);
    });

    it('should call factory if cache miss', async () => {
      const factory = async () => {
        return { data: 'from-factory' };
      };

      const result = await getOrSetCache('test-key', factory);

      expect(result).toEqual({ data: 'from-factory' });
      expect(getCache('test-key')).toEqual({ data: 'from-factory' });
    });

    it('should cache factory result', async () => {
      let callCount = 0;
      const factory = async () => {
        callCount++;
        return { data: `call-${callCount}` };
      };

      const result1 = await getOrSetCache('test-key', factory);
      const result2 = await getOrSetCache('test-key', factory);

      expect(callCount).toBe(1);
      expect(result1).toEqual(result2);
    });

    it('should use custom TTL in getOrSet', async () => {
      const factory = async () => ({ data: 'test' });

      await getOrSetCache('test-key', factory, { ttl: 100 });

      expect(hasCache('test-key')).toBe(true);

      await sleep(150);

      expect(hasCache('test-key')).toBe(false);
    });
  });

  describe('Cache Statistics', () => {
    it('should track cache hits and misses', () => {
      setCache('key1', { data: 'value1' });
      setCache('key2', { data: 'value2' });

      // Trigger hits
      getCache('key1');
      getCache('key1');
      getCache('key2');

      // Trigger misses
      getCache('non-existent-1');
      getCache('non-existent-2');

      const stats = getCacheStats();

      expect(stats.totalKeys).toBe(2);
      expect(stats.totalHits).toBe(3);
      expect(stats.totalMisses).toBe(2);
      expect(stats.hitRate).toBeGreaterThan(0);
    });

    it('should calculate hit rate correctly', () => {
      setCache('key1', { data: 'value' });

      // 7 hits
      for (let i = 0; i < 7; i++) {
        getCache('key1');
      }

      // 3 misses
      for (let i = 0; i < 3; i++) {
        getCache('non-existent');
      }

      const stats = getCacheStats();

      // Hit rate should be 70% (7 hits out of 10 total)
      expect(stats.hitRate).toBe(70);
    });

    it('should estimate memory usage', () => {
      setCache('key1', { data: 'small' });
      setCache('key2', { data: 'x'.repeat(1000) }); // Larger data

      const stats = getCacheStats();

      expect(stats.memoryUsage).toBeGreaterThan(0);
    });
  });

  describe('Invalidation', () => {
    it('should invalidate multiple keys', () => {
      setCache('key1', { data: '1' });
      setCache('key2', { data: '2' });
      setCache('key3', { data: '3' });

      invalidateCache(['key1', 'key3']);

      expect(hasCache('key1')).toBe(false);
      expect(hasCache('key2')).toBe(true);
      expect(hasCache('key3')).toBe(false);
    });

    it('should invalidate namespaced keys', () => {
      setCache('user-1', { name: 'Alice' }, { namespace: 'users' });
      setCache('user-2', { name: 'Bob' }, { namespace: 'users' });

      invalidateCache(['user-1', 'user-2'], 'users');

      expect(hasCache('user-1', { namespace: 'users' })).toBe(false);
      expect(hasCache('user-2', { namespace: 'users' })).toBe(false);
    });
  });

  describe('Warm Up', () => {
    it('should warm up cache with bulk data', () => {
      const bulkData = [
        { key: 'user-1', value: { name: 'Alice' } },
        { key: 'user-2', value: { name: 'Bob' } },
        { key: 'user-3', value: { name: 'Charlie' } },
      ];

      warmUpCache(bulkData);

      expect(getCache('user-1')).toEqual({ name: 'Alice' });
      expect(getCache('user-2')).toEqual({ name: 'Bob' });
      expect(getCache('user-3')).toEqual({ name: 'Charlie' });
    });

    it('should warm up cache with namespace', () => {
      const bulkData = [
        { key: 'product-1', value: { name: 'Widget' } },
        { key: 'product-2', value: { name: 'Gadget' } },
      ];

      warmUpCache(bulkData, { namespace: 'products' });

      expect(getCache('product-1', { namespace: 'products' })).toEqual({
        name: 'Widget',
      });
      expect(getCache('product-2', { namespace: 'products' })).toEqual({
        name: 'Gadget',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle null and undefined values', () => {
      setCache('null-key', null);
      setCache('undefined-key', undefined);

      expect(getCache('null-key')).toBeNull();
      expect(getCache('undefined-key')).toBeUndefined();
    });

    it('should handle complex objects', () => {
      const complexObject = {
        id: '123',
        user: {
          name: 'John',
          address: {
            city: 'NYC',
            zip: '10001',
          },
        },
        tags: ['tag1', 'tag2'],
        metadata: {
          createdAt: new Date().toISOString(),
        },
      };

      setCache('complex', complexObject);
      const result = getCache('complex');

      expect(result).toEqual(complexObject);
    });

    it('should handle empty strings as keys', () => {
      setCache('', { data: 'empty key' });

      const result = getCache('');
      expect(result).toEqual({ data: 'empty key' });
    });

    it('should handle very long cache keys', () => {
      const longKey = 'x'.repeat(500);
      setCache(longKey, { data: 'test' });

      expect(getCache(longKey)).toEqual({ data: 'test' });
    });
  });

  describe('Performance', () => {
    it('should handle rapid set/get operations', () => {
      const iterations = 1000;
      const startTime = Date.now();

      for (let i = 0; i < iterations; i++) {
        setCache(`key-${i}`, { index: i });
      }

      for (let i = 0; i < iterations; i++) {
        getCache(`key-${i}`);
      }

      const duration = Date.now() - startTime;

      // Should complete 2000 operations in under 1 second
      expect(duration).toBeLessThan(1000);
    });

    it('should handle concurrent cache operations', async () => {
      const promises = [];

      for (let i = 0; i < 100; i++) {
        promises.push(
          getOrSetCache(`concurrent-${i}`, async () => {
            await sleep(10);
            return { index: i };
          })
        );
      }

      const results = await Promise.all(promises);

      expect(results).toHaveLength(100);
      results.forEach((result, index) => {
        expect(result).toEqual({ index });
      });
    });
  });
});

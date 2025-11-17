/**
 * Simple in-memory cache for optimizing repeated data access
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 60000; // 1 minute default

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string, ttl?: number): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    const maxAge = ttl || this.defaultTTL;

    if (age > maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string, ttl?: number): boolean {
    return this.get(key, ttl) !== null;
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  size(): number {
    return this.cache.size;
  }
}

// Export singleton instance
export const cache = new SimpleCache();

// Helper function for memoization
export function memoize<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl?: number
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args);
    
    const cached = cache.get(key, ttl);
    if (cached !== null) {
      return cached;
    }

    const result = await fn(...args);
    cache.set(key, result, ttl);
    return result;
  }) as T;
}

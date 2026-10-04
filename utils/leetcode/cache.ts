/**
 * Simple in-memory cache for LeetCode data
 * In production, Next.js ISR (Incremental Static Regeneration) will handle caching
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

const cache = new Map<string, CacheEntry<any>>();

/**
 * Get cached data if available and not expired
 */
export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

/**
 * Set cached data with timestamp
 */
export function setCached<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Clear cache for a specific key
 */
export function clearCache(key: string): void {
  cache.delete(key);
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
  cache.clear();
}

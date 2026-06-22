// ============================================
// CACHING LAYER — Upstash Redis (serverless)
// Handles: response caching, rate limiting state,
// session tokens, and AI result dedup.
// Falls back to in-memory LRU when Redis unavailable.
// ============================================

import { config } from '../config';
import { rootLogger } from './logger';

const logger = rootLogger.child({ service: 'cache' });

// In-memory fallback (LRU with TTL)
class MemoryCache {
  private store = new Map<string, { value: string; expiry: number }>();
  private maxSize = 500;

  get(key: string): string | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) { this.store.delete(key); return null; }
    return entry.value;
  }

  set(key: string, value: string, ttlSeconds: number): void {
    // Evict oldest if at capacity
    if (this.store.size >= this.maxSize) {
      const oldest = this.store.keys().next().value;
      if (oldest) this.store.delete(oldest);
    }
    this.store.set(key, { value, expiry: Date.now() + ttlSeconds * 1000 });
  }

  del(key: string): void { this.store.delete(key); }
  
  async incr(key: string, ttlSeconds: number): Promise<number> {
    const current = parseInt(this.get(key) || '0', 10);
    const next = current + 1;
    this.set(key, String(next), ttlSeconds);
    return next;
  }
}

const memoryCache = new MemoryCache();

// Upstash Redis HTTP client (works in serverless, no TCP)
async function redisCommand(command: string[]): Promise<any> {
  if (!config.redis.url || !config.redis.token) return null;

  try {
    const res = await fetch(`${config.redis.url}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.redis.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });

    if (!res.ok) {
      logger.warn('Redis command failed', { status: res.status, command: command[0] });
      return null;
    }

    const data = await res.json();
    return data.result;
  } catch (err) {
    logger.warn('Redis unavailable, using memory fallback', { error: (err as Error).message });
    return null;
  }
}

export const cache = {
  /**
   * Get a cached value (Redis → memory fallback)
   */
  async get(key: string): Promise<string | null> {
    const redisResult = await redisCommand(['GET', key]);
    if (redisResult !== null) return redisResult;
    return memoryCache.get(key);
  },

  /**
   * Set a cached value with TTL
   */
  async set(key: string, value: string, ttlSeconds: number = 300): Promise<void> {
    memoryCache.set(key, value, ttlSeconds);
    await redisCommand(['SET', key, value, 'EX', String(ttlSeconds)]);
  },

  /**
   * Delete a cached value
   */
  async del(key: string): Promise<void> {
    memoryCache.del(key);
    await redisCommand(['DEL', key]);
  },

  /**
   * Increment a counter (for rate limiting)
   */
  async incr(key: string, ttlSeconds: number = 60): Promise<number> {
    const redisResult = await redisCommand(['INCR', key]);
    if (redisResult !== null) {
      // Set expiry on first increment
      if (redisResult === 1) {
        await redisCommand(['EXPIRE', key, String(ttlSeconds)]);
      }
      return parseInt(redisResult, 10);
    }
    // Fallback to memory
    return memoryCache.incr(key, ttlSeconds);
  },

  /**
   * Get remaining TTL for a key
   */
  async ttl(key: string): Promise<number> {
    const result = await redisCommand(['TTL', key]);
    return result || 0;
  },

  /**
   * Cache AI results with content-based key
   */
  async getCachedAIResult(inputHash: string): Promise<any | null> {
    const cached = await this.get(`ai:result:${inputHash}`);
    if (cached) {
      logger.debug('AI cache hit', { hash: inputHash });
      return JSON.parse(cached);
    }
    return null;
  },

  async setCachedAIResult(inputHash: string, result: any, ttlSeconds: number = 3600): Promise<void> {
    await this.set(`ai:result:${inputHash}`, JSON.stringify(result), ttlSeconds);
  },
};

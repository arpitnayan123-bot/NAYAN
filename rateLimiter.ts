// ============================================
// RATE LIMITER — Sliding window with Redis
// Prevents abuse, ensures fair usage, protects AI costs.
// Returns headers for client-side retry logic.
// ============================================

import { config } from '../config';
import { cache } from './cache';
import { rootLogger } from './logger';

const logger = rootLogger.child({ service: 'rate-limiter' });

export interface RateLimitResult {
  allowed: boolean;
  current: number;
  limit: number;
  remaining: number;
  resetInSeconds: number;
  retryAfter?: number;
}

type Tier = 'free' | 'care' | 'premium' | 'unlimited';

// Tier multipliers (premium users get higher limits)
const TIER_MULTIPLIERS: Record<Tier, number> = {
  free: 1,
  care: 3,
  premium: 10,
  unlimited: 100,
};

export async function checkRateLimit(
  userId: string,
  endpoint: string,
  windowSeconds: number,
  maxRequests: number,
  tier: Tier = 'free'
): Promise<RateLimitResult> {
  const effectiveLimit = Math.ceil(maxRequests * TIER_MULTIPLIERS[tier]);
  const key = `rl:${endpoint}:${userId}`;

  try {
    const current = await cache.incr(key, windowSeconds);
    const remaining = Math.max(0, effectiveLimit - current);
    const ttl = await cache.ttl(key);

    const allowed = current <= effectiveLimit;

    if (!allowed) {
      logger.warn('Rate limit exceeded', {
        userId,
        endpoint,
        current,
        limit: effectiveLimit,
        tier,
      });
    }

    return {
      allowed,
      current,
      limit: effectiveLimit,
      remaining,
      resetInSeconds: ttl > 0 ? ttl : windowSeconds,
      retryAfter: allowed ? undefined : (ttl > 0 ? ttl : windowSeconds),
    };
  } catch (err) {
    logger.error('Rate limit check failed, allowing request', err as Error);
    // Fail open — don't block users if rate limiter is down
    return { allowed: true, current: 0, limit: effectiveLimit, remaining: effectiveLimit, resetInSeconds: windowSeconds };
  }
}

// Preset rate limit checks for each endpoint
export const rateLimits = {
  symptom: (userId: string, tier?: Tier) =>
    checkRateLimit(userId, 'symptom', 3600, config.rateLimit.symptomPerHour, tier),

  labReport: (userId: string, tier?: Tier) =>
    checkRateLimit(userId, 'lab-report', 3600, config.rateLimit.labReportPerHour, tier),

  chat: (userId: string, tier?: Tier) =>
    checkRateLimit(userId, 'chat', 60, config.rateLimit.chatPerMinute, tier),

  xray: (userId: string, tier?: Tier) =>
    checkRateLimit(userId, 'xray', 86400, config.rateLimit.xrayPerDay, tier),

  global: (userId: string) =>
    checkRateLimit(userId, 'global', 60, config.rateLimit.globalPerMinute),
};

// Set rate limit headers on response
export function setRateLimitHeaders(res: any, result: RateLimitResult): void {
  res.setHeader('X-RateLimit-Limit', result.limit);
  res.setHeader('X-RateLimit-Remaining', result.remaining);
  res.setHeader('X-RateLimit-Reset', result.resetInSeconds);
  if (result.retryAfter) {
    res.setHeader('Retry-After', result.retryAfter);
  }
}

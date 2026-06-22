// ============================================
// API MIDDLEWARE — Auth, CORS, validation, errors
// Composable middleware for Vercel serverless functions.
// ============================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { config } from '../config';
import { Logger, rootLogger } from './logger';
import { rateLimits, setRateLimitHeaders, RateLimitResult } from './rateLimiter';
import { supabaseClient } from '../services/database';
import crypto from 'crypto';

// ============================================
// TYPES
// ============================================

export interface AuthenticatedRequest extends VercelRequest {
  user: { id: string; email: string; tier: 'free' | 'care' | 'premium' | 'unlimited' };
  logger: Logger;
  traceId: string;
  startTime: number;
}

type Handler = (req: AuthenticatedRequest, res: VercelResponse) => Promise<void | VercelResponse>;

// ============================================
// CORS MIDDLEWARE
// ============================================

function applyCors(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin || '*';
  const allowed = config.env === 'development' ? '*' : config.frontendUrl;

  res.setHeader('Access-Control-Allow-Origin', allowed);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Access-Control-Expose-Headers', 'X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After, X-Trace-ID');

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

// ============================================
// AUTH MIDDLEWARE
// ============================================

async function authenticate(req: VercelRequest): Promise<AuthenticatedRequest['user'] | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  if (!token || token.length < 10) return null;

  try {
    const { data: { user }, error } = await supabaseClient(token).auth.getUser(token);
    if (error || !user) return null;

    // Determine tier (would come from a subscription table in production)
    const tier: AuthenticatedRequest['user']['tier'] = 'free';

    return { id: user.id, email: user.email || '', tier };
  } catch {
    return null;
  }
}

// ============================================
// INPUT SANITIZATION
// ============================================

export function sanitizeInput(input: string): string {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\s\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0B00-\u0B7F\u0C00-\u0C7F\u0D00-\u0D7F.,;:!?@#$%&*()[\]{}\-+=<>/'"°²³µ\n\r\t]/g, '')
    .trim();
}

// ============================================
// TRACE ID GENERATOR
// ============================================

function generateTraceId(req: VercelRequest): string {
  return (req.headers['x-request-id'] as string) || `aarogya-${crypto.randomBytes(8).toString('hex')}`;
}

// ============================================
// COMPOSABLE MIDDLEWARE WRAPPER
// ============================================

interface MiddlewareOptions {
  methods?: string[];
  requireAuth?: boolean;
  rateLimit?: keyof typeof rateLimits;
  maxBodySize?: number;
}

export function createHandler(handler: Handler, options: MiddlewareOptions = {}) {
  const { methods = ['POST'], requireAuth = true, rateLimit, maxBodySize = 10_000_000 } = options;

  return async (req: VercelRequest, res: VercelResponse) => {
    const startTime = Date.now();
    const traceId = generateTraceId(req);
    const logger = rootLogger.child({ traceId, endpoint: req.url });

    res.setHeader('X-Trace-ID', traceId);

    // 1. CORS
    if (applyCors(req, res)) return;

    // 2. Method check
    if (!methods.includes(req.method || '')) {
      logger.warn('Method not allowed', { method: req.method });
      return res.status(405).json({ error: 'Method not allowed', allowed: methods });
    }

    // 3. Body size check
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    if (contentLength > maxBodySize) {
      logger.warn('Body too large', { size: contentLength, max: maxBodySize });
      return res.status(413).json({ error: 'Request body too large' });
    }

    // 4. Auth
    let user: AuthenticatedRequest['user'] | null = null;
    if (requireAuth) {
      user = await authenticate(req);
      if (!user) {
        logger.warn('Authentication failed');
        return res.status(401).json({ error: 'Unauthorized. Provide a valid Bearer token.' });
      }
      logger.info('Authenticated', { userId: user.id, tier: user.tier });
    }

    // 5. Rate limiting
    if (rateLimit && user) {
      const limitFn = rateLimits[rateLimit];
      if (limitFn) {
        const result: RateLimitResult = await limitFn(user.id, user.tier);
        setRateLimitHeaders(res, result);

        if (!result.allowed) {
          logger.warn('Rate limit exceeded', { userId: user.id, endpoint: rateLimit });
          return res.status(429).json({
            error: 'Rate limit exceeded. Please slow down.',
            retryAfter: result.retryAfter,
            limit: result.limit,
            remaining: 0,
          });
        }
      }
    }

    // 6. Global rate limit
    if (user) {
      const globalLimit = await rateLimits.global(user.id);
      if (!globalLimit.allowed) {
        return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
      }
    }

    // 7. Execute handler
    try {
      const authReq = req as AuthenticatedRequest;
      authReq.user = user!;
      authReq.logger = logger;
      authReq.traceId = traceId;
      authReq.startTime = startTime;

      await handler(authReq, res);

      const duration = Date.now() - startTime;
      logger.info('Request completed', {
        method: req.method,
        status: res.statusCode,
        duration_ms: duration,
        userId: user?.id,
      });
    } catch (err) {
      const duration = Date.now() - startTime;
      const error = err instanceof Error ? err : new Error(String(err));

      logger.error('Unhandled error', error, {
        method: req.method,
        duration_ms: duration,
        userId: user?.id,
      });

      // Don't leak internal errors
      if (!res.headersSent) {
        res.status(500).json({
          error: config.env === 'production'
            ? 'An internal error occurred. Please try again.'
            : error.message,
          traceId,
        });
      }
    }
  };
}

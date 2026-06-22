import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbHealthCheck } from '../backend/services/database';
import { groqProvider } from '../backend/services/ai/providers/groq';
import { config, validateConfig } from '../backend/config';
import { cache } from '../backend/core/cache';

// ============================================
// GET /api/health-check
// System health check — database, AI, cache, config
// Public endpoint (no auth required)
// ============================================

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-cache');

  const start = Date.now();
  const configValidation = validateConfig();

  const checks = await Promise.allSettled([
    dbHealthCheck(),
    groqProvider.healthCheck(),
    cache.get('health-check-ping'),
  ]);

  const [dbResult, aiResult, cacheResult] = checks;

  const dbHealth = dbResult.status === 'fulfilled' ? dbResult.value : { ok: false, latency_ms: 0 };
  const aiHealth = aiResult.status === 'fulfilled' ? aiResult.value : { ok: false, latency_ms: 0 };
  const cacheHealth = cacheResult.status === 'fulfilled' ? { ok: true } : { ok: false };

  const allHealthy = configValidation.valid && dbHealth.ok && aiHealth.ok;

  const response = {
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: config.env,
    version: '1.0.0',
    uptime_ms: Date.now() - start,
    checks: {
      config: { ok: configValidation.valid, errors: configValidation.errors },
      database: { ok: dbHealth.ok, latency_ms: dbHealth.latency_ms },
      ai: { ok: aiHealth.ok, latency_ms: aiHealth.latency_ms, model: config.ai.fastModel },
      cache: { ok: cacheHealth.ok, type: config.redis.url ? 'redis' : 'memory' },
    },
  };

  res.status(allHealthy ? 200 : 503).json(response);
}

// ============================================
// AAROGYA AI — CENTRALIZED CONFIGURATION
// Secure secrets management: reads from env vars at boot,
// validates all required values, freezes the config object.
// In production, use Vercel/AWS Secrets Manager, NOT .env files.
// ============================================

interface DatabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

interface AIConfig {
  groqApiKey: string;
  fastModel: string;
  visionModel: string;
  embeddingModel: string;
  maxTokensSymptom: number;
  maxTokensLab: number;
  maxTokensChat: number;
  maxTokensXray: number;
  temperatureAnalysis: number;
  temperatureChat: number;
}

interface RedisConfig {
  url: string;
  token: string;
}

interface RateLimitConfig {
  symptomPerHour: number;
  labReportPerHour: number;
  chatPerMinute: number;
  xrayPerDay: number;
  globalPerMinute: number;
}

interface ObservabilityConfig {
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableTracing: boolean;
  serviceName: string;
  environment: string;
}

interface AppConfig {
  env: 'development' | 'staging' | 'production';
  frontendUrl: string;
  db: DatabaseConfig;
  ai: AIConfig;
  redis: RedisConfig;
  rateLimit: RateLimitConfig;
  observability: ObservabilityConfig;
}

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (!value) {
    // In development, warn but don't crash for optional services
    if (process.env.NODE_ENV !== 'production' && !['UPSTASH_REDIS_URL', 'UPSTASH_REDIS_TOKEN'].includes(key)) {
      console.warn(`⚠️  Missing env: ${key} — using fallback or empty`);
    }
    return fallback || '';
  }
  return value;
}

const env = (process.env.NODE_ENV || 'development') as AppConfig['env'];

export const config: AppConfig = Object.freeze({
  env,
  frontendUrl: requireEnv('FRONTEND_URL', 'http://localhost:5173'),

  db: Object.freeze({
    url: requireEnv('NEXT_PUBLIC_SUPABASE_URL', ''),
    anonKey: requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', ''),
    serviceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY', ''),
  }),

  ai: Object.freeze({
    groqApiKey: requireEnv('GROQ_API_KEY', ''),
    fastModel: requireEnv('AI_FAST_MODEL', 'llama-3.3-70b-versatile'),
    visionModel: requireEnv('AI_VISION_MODEL', 'llama-3.2-11b-vision-preview'),
    embeddingModel: requireEnv('AI_EMBEDDING_MODEL', 'nomic-embed-text-v1.5'),
    maxTokensSymptom: 2500,
    maxTokensLab: 4000,
    maxTokensChat: 1500,
    maxTokensXray: 2000,
    temperatureAnalysis: 0.2,
    temperatureChat: 0.7,
  }),

  redis: Object.freeze({
    url: requireEnv('UPSTASH_REDIS_URL', ''),
    token: requireEnv('UPSTASH_REDIS_TOKEN', ''),
  }),

  rateLimit: Object.freeze({
    symptomPerHour: parseInt(requireEnv('RATE_LIMIT_SYMPTOM', '20'), 10),
    labReportPerHour: parseInt(requireEnv('RATE_LIMIT_LAB', '10'), 10),
    chatPerMinute: parseInt(requireEnv('RATE_LIMIT_CHAT', '30'), 10),
    xrayPerDay: parseInt(requireEnv('RATE_LIMIT_XRAY', '5'), 10),
    globalPerMinute: parseInt(requireEnv('RATE_LIMIT_GLOBAL', '60'), 10),
  }),

  observability: Object.freeze({
    logLevel: (requireEnv('LOG_LEVEL', 'info') as ObservabilityConfig['logLevel']),
    enableTracing: requireEnv('ENABLE_TRACING', 'false') === 'true',
    serviceName: 'aarogya-ai-backend',
    environment: env,
  }),
});

// Validate critical configs at boot
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!config.db.url) errors.push('NEXT_PUBLIC_SUPABASE_URL is required');
  if (!config.db.serviceRoleKey) errors.push('SUPABASE_SERVICE_ROLE_KEY is required');
  if (!config.ai.groqApiKey) errors.push('GROQ_API_KEY is required');
  return { valid: errors.length === 0, errors };
}

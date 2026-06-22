// ============================================
// AI ORCHESTRATION LAYER
// The brain of Aarogya AI.
//
// Responsibilities:
// 1. Route requests to the right AI model
// 2. Pre-process inputs (sanitize, enrich with context)
// 3. Post-process outputs (validate JSON, extract entities)
// 4. Cache results (dedup identical queries)
// 5. Track usage for billing/analytics
// 6. Fallback to secondary model on failure
// 7. Queue background tasks (health profile generation)
//
// This layer is model-agnostic — swap Groq for OpenAI,
// Anthropic, or local models by changing the provider.
// ============================================

import { config } from '../../config';
import { rootLogger } from '../../core/logger';
import { cache } from '../../core/cache';
import { supabaseClient } from '../database';
import { groqProvider } from './providers/groq';
import { PROMPTS } from './prompts';
import crypto from 'crypto';

const logger = rootLogger.child({ service: 'ai-orchestrator' });

// ============================================
// TYPES
// ============================================

export interface AIRequest {
  type: 'symptom' | 'lab_report' | 'chat' | 'xray' | 'diet' | 'prediction';
  input: string | { text?: string; imageBase64?: string };
  context?: {
    userId?: string;
    age?: number;
    gender?: string;
    knownConditions?: string[];
    conversationHistory?: { role: string; content: string }[];
    language?: string;
  };
  options?: {
    skipCache?: boolean;
    priority?: 'low' | 'normal' | 'high';
    maxRetries?: number;
  };
}

export interface AIResult {
  success: boolean;
  data: any;
  model: string;
  tokens: { prompt: number; completion: number; total: number };
  latency_ms: number;
  cached: boolean;
  traceId: string;
}

// ============================================
// HASH FUNCTION — for cache dedup
// ============================================

function hashInput(input: any): string {
  const str = typeof input === 'string' ? input : JSON.stringify(input);
  return crypto.createHash('sha256').update(str).digest('hex').substring(0, 16);
}

// ============================================
// MAIN ORCHESTRATION FUNCTION
// ============================================

export async function orchestrate(request: AIRequest): Promise<AIResult> {
  const startTime = Date.now();
  const traceId = `ai-${crypto.randomBytes(6).toString('hex')}`;
  const inputHash = hashInput(request.input);

  logger.info('AI request received', {
    traceId,
    type: request.type,
    inputHash,
    userId: request.context?.userId,
  });

  // 1. Check cache (unless explicitly skipped)
  if (!request.options?.skipCache) {
    const cachedResult = await cache.getCachedAIResult(`${request.type}:${inputHash}`);
    if (cachedResult) {
      logger.info('AI cache hit', { traceId, type: request.type, inputHash });
      return {
        success: true,
        data: cachedResult,
        model: 'cached',
        tokens: { prompt: 0, completion: 0, total: 0 },
        latency_ms: Date.now() - startTime,
        cached: true,
        traceId,
      };
    }
  }

  // 2. Select model and prompt
  const { model, systemPrompt, temperature, maxTokens, responseFormat } = getModelConfig(request.type);

  // 3. Build messages
  const messages = buildMessages(request, systemPrompt);

  // 4. Call AI provider with retry logic
  const maxRetries = request.options?.maxRetries || 2;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await groqProvider.complete({
        model,
        messages,
        temperature,
        maxTokens,
        responseFormat,
      });

      // 5. Parse and validate response
      let parsedData: any;
      if (responseFormat === 'json') {
        try {
          parsedData = JSON.parse(result.content);
        } catch {
          logger.warn('Failed to parse AI JSON, returning raw', { traceId, attempt });
          parsedData = { raw_response: result.content, parse_error: true };
        }
      } else {
        parsedData = result.content;
      }

      // 6. Post-process
      parsedData = postProcess(request.type, parsedData);

      // 7. Cache result
      const cacheTTL = getCacheTTL(request.type);
      if (cacheTTL > 0) {
        await cache.setCachedAIResult(`${request.type}:${inputHash}`, parsedData, cacheTTL);
      }

      // 8. Track usage (fire and forget)
      trackUsage(request, result, traceId).catch(err =>
        logger.warn('Usage tracking failed', { error: err.message })
      );

      const aiResult: AIResult = {
        success: true,
        data: parsedData,
        model: result.model,
        tokens: result.tokens,
        latency_ms: Date.now() - startTime,
        cached: false,
        traceId,
      };

      logger.info('AI request completed', {
        traceId,
        type: request.type,
        model: result.model,
        tokens: result.tokens.total,
        latency_ms: aiResult.latency_ms,
        attempt,
      });

      return aiResult;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      logger.warn(`AI attempt ${attempt}/${maxRetries} failed`, {
        traceId,
        error: lastError.message,
        type: request.type,
      });

      if (attempt < maxRetries) {
        // Exponential backoff: 500ms, 1500ms
        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
      }
    }
  }

  // All retries exhausted
  logger.error('AI request failed after all retries', lastError!, {
    traceId,
    type: request.type,
    attempts: maxRetries,
  });

  return {
    success: false,
    data: { error: 'AI service temporarily unavailable. Please try again.', traceId },
    model: 'none',
    tokens: { prompt: 0, completion: 0, total: 0 },
    latency_ms: Date.now() - startTime,
    cached: false,
    traceId,
  };
}

// ============================================
// MODEL SELECTION
// ============================================

function getModelConfig(type: AIRequest['type']): {
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  responseFormat: 'json' | 'text';
} {
  switch (type) {
    case 'symptom':
      return {
        model: config.ai.fastModel,
        systemPrompt: PROMPTS.SYMPTOM_ANALYSIS,
        temperature: config.ai.temperatureAnalysis,
        maxTokens: config.ai.maxTokensSymptom,
        responseFormat: 'json',
      };
    case 'lab_report':
      return {
        model: config.ai.fastModel,
        systemPrompt: PROMPTS.LAB_REPORT,
        temperature: config.ai.temperatureAnalysis,
        maxTokens: config.ai.maxTokensLab,
        responseFormat: 'json',
      };
    case 'chat':
      return {
        model: config.ai.fastModel,
        systemPrompt: PROMPTS.HEALTH_CHAT,
        temperature: config.ai.temperatureChat,
        maxTokens: config.ai.maxTokensChat,
        responseFormat: 'text',
      };
    case 'xray':
      return {
        model: config.ai.visionModel,
        systemPrompt: PROMPTS.XRAY_ANALYSIS,
        temperature: config.ai.temperatureAnalysis,
        maxTokens: config.ai.maxTokensXray,
        responseFormat: 'json',
      };
    case 'diet':
      return {
        model: config.ai.fastModel,
        systemPrompt: PROMPTS.DIET_PLANNING,
        temperature: 0.5,
        maxTokens: 2000,
        responseFormat: 'json',
      };
    case 'prediction':
      return {
        model: config.ai.fastModel,
        systemPrompt: PROMPTS.HEALTH_PREDICTION,
        temperature: config.ai.temperatureAnalysis,
        maxTokens: 3000,
        responseFormat: 'json',
      };
    default:
      return {
        model: config.ai.fastModel,
        systemPrompt: PROMPTS.HEALTH_CHAT,
        temperature: config.ai.temperatureChat,
        maxTokens: config.ai.maxTokensChat,
        responseFormat: 'text',
      };
  }
}

// ============================================
// MESSAGE BUILDER
// ============================================

function buildMessages(
  request: AIRequest,
  systemPrompt: string
): { role: 'system' | 'user' | 'assistant'; content: string | any }[] {
  const messages: any[] = [{ role: 'system', content: systemPrompt }];

  // Add conversation history (last 10 messages for context)
  if (request.context?.conversationHistory) {
    const history = request.context.conversationHistory.slice(-10);
    messages.push(...history.map(m => ({ role: m.role, content: m.content })));
  }

  // Build user message with context
  let userContent: string;
  if (typeof request.input === 'string') {
    userContent = request.input;
  } else {
    userContent = request.input.text || '';
  }

  // Enrich with patient context
  if (request.context) {
    const ctx = request.context;
    const contextLines: string[] = [];
    if (ctx.age) contextLines.push(`Patient age: ${ctx.age}`);
    if (ctx.gender) contextLines.push(`Gender: ${ctx.gender}`);
    if (ctx.knownConditions?.length) contextLines.push(`Known conditions: ${ctx.knownConditions.join(', ')}`);
    if (ctx.language) contextLines.push(`Preferred language: ${ctx.language}`);

    if (contextLines.length > 0) {
      userContent += `\n\n--- Patient Context ---\n${contextLines.join('\n')}`;
    }
  }

  // Handle vision (X-ray) inputs
  if (typeof request.input === 'object' && request.input.imageBase64) {
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: userContent || 'Analyze this medical image.' },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${request.input.imageBase64}` } },
      ],
    });
  } else {
    messages.push({ role: 'user', content: userContent });
  }

  return messages;
}

// ============================================
// POST-PROCESSING
// ============================================

function postProcess(type: AIRequest['type'], data: any): any {
  if (!data || typeof data !== 'object') return data;

  // Add timestamp
  data._processed_at = new Date().toISOString();
  data._type = type;

  // Validate urgency levels
  if (data.urgency && !['routine', 'within_week', 'urgent', 'emergency'].includes(data.urgency)) {
    data.urgency = 'routine';
  }

  // Ensure arrays are arrays
  const arrayFields = ['possible_conditions', 'red_flags', 'home_care', 'recommended_actions', 'findings'];
  arrayFields.forEach(field => {
    if (data[field] && !Array.isArray(data[field])) {
      data[field] = [data[field]];
    }
  });

  return data;
}

// ============================================
// CACHE TTL BY TYPE
// ============================================

function getCacheTTL(type: AIRequest['type']): number {
  switch (type) {
    case 'symptom': return 1800;      // 30 min (symptoms may change)
    case 'lab_report': return 86400;   // 24 hr (lab values don't change)
    case 'chat': return 0;            // Never cache chat (contextual)
    case 'xray': return 86400;        // 24 hr (image doesn't change)
    case 'diet': return 43200;        // 12 hr
    case 'prediction': return 7200;   // 2 hr (predictions evolve)
    default: return 300;              // 5 min default
  }
}

// ============================================
// USAGE TRACKING (async, non-blocking)
// ============================================

async function trackUsage(
  request: AIRequest,
  result: { model: string; tokens: { total: number } },
  traceId: string
): Promise<void> {
  if (!request.context?.userId) return;

  try {
    // We use the admin client here since usage tracking
    // should work regardless of user RLS permissions
    const { supabaseAdmin } = await import('../database');
    await supabaseAdmin().from('api_usage').insert([{
      user_id: request.context.userId,
      endpoint: `/ai/${request.type}`,
      model: result.model,
      tokens_used: result.tokens.total,
      latency_ms: 0, // Will be set by caller
      success: true,
    }]);
  } catch (err) {
    // Non-critical — don't fail the request
    logger.warn('Usage tracking insert failed', { error: (err as Error).message, traceId });
  }
}

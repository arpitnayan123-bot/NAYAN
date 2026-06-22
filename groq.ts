// ============================================
// GROQ AI PROVIDER — Llama 3.3 inference
// Abstracted provider layer — swap to OpenAI,
// Anthropic, or local models by implementing
// the same interface.
// ============================================

import Groq from 'groq-sdk';
import { config } from '../../../config';
import { rootLogger } from '../../../core/logger';

const logger = rootLogger.child({ service: 'groq-provider' });

interface CompletionRequest {
  model: string;
  messages: { role: string; content: any }[];
  temperature: number;
  maxTokens: number;
  responseFormat: 'json' | 'text';
}

interface CompletionResult {
  content: string;
  model: string;
  tokens: { prompt: number; completion: number; total: number };
  finishReason: string;
}

let _client: Groq | null = null;

function getClient(): Groq {
  if (!_client) {
    if (!config.ai.groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }
    _client = new Groq({ apiKey: config.ai.groqApiKey });
  }
  return _client;
}

export const groqProvider = {
  async complete(req: CompletionRequest): Promise<CompletionResult> {
    const client = getClient();

    const startTime = Date.now();

    try {
      const response = await client.chat.completions.create({
        model: req.model,
        messages: req.messages as any,
        temperature: req.temperature,
        max_tokens: req.maxTokens,
        ...(req.responseFormat === 'json' ? { response_format: { type: 'json_object' } } : {}),
      });

      const content = response.choices[0]?.message?.content || '';
      const usage = response.usage;

      logger.debug('Groq completion success', {
        model: response.model,
        tokens: usage?.total_tokens,
        latency_ms: Date.now() - startTime,
        finishReason: response.choices[0]?.finish_reason,
      });

      return {
        content,
        model: response.model,
        tokens: {
          prompt: usage?.prompt_tokens || 0,
          completion: usage?.completion_tokens || 0,
          total: usage?.total_tokens || 0,
        },
        finishReason: response.choices[0]?.finish_reason || 'unknown',
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Groq completion failed', error, {
        model: req.model,
        latency_ms: Date.now() - startTime,
      });
      throw error;
    }
  },

  async healthCheck(): Promise<{ ok: boolean; latency_ms: number }> {
    const start = Date.now();
    try {
      const client = getClient();
      await client.chat.completions.create({
        model: config.ai.fastModel,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5,
      });
      return { ok: true, latency_ms: Date.now() - start };
    } catch {
      return { ok: false, latency_ms: Date.now() - start };
    }
  },
};

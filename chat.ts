import { createHandler, sanitizeInput } from '../../backend/core/middleware';
import { orchestrate } from '../../backend/services/ai/orchestrator';

// POST /api/ai/chat — Conversational health companion
export default createHandler(
  async (req, res) => {
    const { message, conversationHistory } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message required' });
    }

    const result = await orchestrate({
      type: 'chat',
      input: sanitizeInput(message),
      context: {
        userId: req.user.id,
        conversationHistory: conversationHistory?.slice(-12),
      },
      options: { skipCache: true }, // Chat should never be cached
    });

    if (!result.success) {
      return res.status(503).json({ error: result.data.error, traceId: result.traceId });
    }

    return res.status(200).json({
      success: true,
      data: { reply: result.data },
      meta: { model: result.model, tokens: result.tokens, latency_ms: result.latency_ms, traceId: result.traceId },
    });
  },
  { methods: ['POST'], requireAuth: true, rateLimit: 'chat' }
);

import { createHandler, sanitizeInput } from '../../backend/core/middleware';
import { orchestrate } from '../../backend/services/ai/orchestrator';
import { supabaseClient } from '../../backend/services/database';

// POST /api/ai/symptom — AI symptom analysis with full middleware stack
export default createHandler(
  async (req, res) => {
    const { message, conversationHistory, context } = req.body || {};

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({ error: 'message required (min 5 chars)' });
    }

    const cleanMessage = sanitizeInput(message);

    // Orchestrate AI call
    const result = await orchestrate({
      type: 'symptom',
      input: cleanMessage,
      context: {
        userId: req.user.id,
        age: context?.age,
        gender: context?.gender,
        knownConditions: context?.knownConditions,
        conversationHistory: conversationHistory?.slice(-10),
      },
    });

    if (!result.success) {
      return res.status(503).json({ error: result.data.error, traceId: result.traceId });
    }

    // Persist session + messages (fire and forget)
    const token = req.headers.authorization!.split(' ')[1];
    supabaseClient(token)
      .from('symptom_sessions')
      .insert([{
        user_id: req.user.id,
        title: cleanMessage.substring(0, 80),
        summary: result.data.summary_en,
        ai_model: result.model,
        risk_level: result.data.urgency === 'emergency' ? 'urgent' : result.data.urgency === 'urgent' ? 'high' : 'moderate',
        suggested_specialty: result.data.recommended_specialty,
      }])
      .then(({ data: session }) => {
        if (session) {
          return supabaseClient(token).from('symptom_messages').insert([
            { session_id: session.id, role: 'user', content: cleanMessage },
            { session_id: session.id, role: 'assistant', content: JSON.stringify(result.data), metadata: { model: result.model, tokens: result.tokens } },
          ]);
        }
      })
      .catch(err => req.logger.warn('Session persist failed', { error: err.message }));

    return res.status(200).json({
      success: true,
      data: result.data,
      meta: { model: result.model, tokens: result.tokens, latency_ms: result.latency_ms, cached: result.cached, traceId: result.traceId },
    });
  },
  { methods: ['POST'], requireAuth: true, rateLimit: 'symptom' }
);

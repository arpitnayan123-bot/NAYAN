import { createHandler } from '../../backend/core/middleware';
import { orchestrate } from '../../backend/services/ai/orchestrator';
import { supabaseClient } from '../../backend/services/database';

// POST /api/ai/xray — X-ray vision analysis
export default createHandler(
  async (req, res) => {
    const { imageBase64, scanType = 'chest' } = req.body || {};

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'imageBase64 required' });
    }
    if (imageBase64.length > 5_000_000) {
      return res.status(413).json({ error: 'Image too large (max ~5MB)' });
    }

    const result = await orchestrate({
      type: 'xray',
      input: { text: `Analyze this ${scanType} X-ray/scan.`, imageBase64 },
      context: { userId: req.user.id },
    });

    if (!result.success) {
      return res.status(503).json({ error: result.data.error, traceId: result.traceId });
    }

    // Persist analysis
    const token = req.headers.authorization!.split(' ')[1];
    const { data: analysis } = await supabaseClient(token)
      .from('xray_analyses')
      .insert([{
        user_id: req.user.id,
        image_url: null,
        scan_type: scanType,
        findings: result.data?.findings || [],
        summary_en: result.data?.impression_en,
        summary_hi: result.data?.impression_hi,
        recommended_actions: result.data?.recommendations || [],
        ai_model: result.model,
        confidence: result.data?.findings?.reduce((s: number, f: any) => s + (f.confidence || 0), 0) / (result.data?.findings?.length || 1) || 0,
      }])
      .select()
      .single();

    return res.status(200).json({
      success: true,
      data: result.data,
      analysis_id: analysis?.id,
      meta: { model: result.model, tokens: result.tokens, latency_ms: result.latency_ms, cached: result.cached, traceId: result.traceId },
    });
  },
  { methods: ['POST'], requireAuth: true, rateLimit: 'xray', maxBodySize: 6_000_000 }
);

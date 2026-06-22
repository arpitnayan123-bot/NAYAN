import { createHandler, sanitizeInput } from '../../backend/core/middleware';
import { orchestrate } from '../../backend/services/ai/orchestrator';
import { supabaseClient } from '../../backend/services/database';
import { jobQueue } from '../../backend/jobs/queue';

// POST /api/ai/lab-report — AI lab report analysis
export default createHandler(
  async (req, res) => {
    const { text, metadata } = req.body || {};

    if (!text || typeof text !== 'string' || text.length < 20) {
      return res.status(400).json({ error: 'Lab report text required (min 20 chars)' });
    }

    const cleanText = sanitizeInput(text);

    const result = await orchestrate({
      type: 'lab_report',
      input: cleanText,
      context: {
        userId: req.user.id,
        age: metadata?.age,
        gender: metadata?.gender,
        language: metadata?.language || 'both',
      },
    });

    if (!result.success) {
      return res.status(503).json({ error: result.data.error, traceId: result.traceId });
    }

    // Persist report
    const token = req.headers.authorization!.split(' ')[1];
    const { data: report } = await supabaseClient(token)
      .from('lab_reports')
      .insert([{
        user_id: req.user.id,
        source: 'text_paste',
        source_text: cleanText,
        parsed_biomarkers: result.data?.biomarkers || [],
        overall_status: result.data?.overall_status,
        ai_summary_en: result.data?.summary_en,
        ai_summary_hi: result.data?.summary_hi,
        recommendations: result.data?.lifestyle_recommendations,
        risk_factors: result.data?.top_concerns,
        ai_model: result.model,
        confidence: 0.85,
        lab_name: metadata?.labName,
        patient_age: metadata?.age,
        patient_gender: metadata?.gender,
      }])
      .select()
      .single();

    // Queue health profile generation in background
    if (report?.id) {
      jobQueue.enqueue('generate_health_profile', {
        userId: req.user.id,
        reportIds: [report.id],
      }).catch(err => req.logger.warn('Profile generation queue failed', { error: err.message }));
    }

    return res.status(200).json({
      success: true,
      data: result.data,
      report_id: report?.id,
      meta: { model: result.model, tokens: result.tokens, latency_ms: result.latency_ms, cached: result.cached, traceId: result.traceId },
    });
  },
  { methods: ['POST'], requireAuth: true, rateLimit: 'labReport' }
);

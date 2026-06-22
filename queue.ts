// ============================================
// BACKGROUND JOB QUEUE
// Serverless-compatible job queue using Upstash QStash
// or simple deferred execution patterns.
//
// For full BullMQ/Celery, deploy on a persistent runtime
// (Railway, Render, EC2). For Vercel, we use:
// 1. QStash for scheduled/delayed jobs
// 2. Vercel Cron for periodic tasks
// 3. Fire-and-forget patterns for non-critical work
// ============================================

import { config } from '../config';
import { rootLogger } from '../core/logger';
import { supabaseAdmin } from '../services/database';

const logger = rootLogger.child({ service: 'job-queue' });

// ============================================
// JOB TYPES
// ============================================

export type JobType =
  | 'generate_health_profile'
  | 'send_medication_reminder'
  | 'cleanup_expired_sessions'
  | 'aggregate_daily_metrics'
  | 'send_report_notification'
  | 'reanalyze_lab_report';

interface Job<T = any> {
  id: string;
  type: JobType;
  payload: T;
  priority: 'low' | 'normal' | 'high';
  scheduledFor?: Date;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
}

// ============================================
// JOB HANDLERS
// ============================================

const handlers: Record<JobType, (payload: any) => Promise<void>> = {
  /**
   * Generate a comprehensive AI health profile from lab reports
   */
  generate_health_profile: async (payload: { userId: string; reportIds: string[] }) => {
    logger.info('Generating health profile', { userId: payload.userId });

    // 1. Fetch all lab reports
    const { data: reports } = await supabaseAdmin()
      .from('lab_reports')
      .select('parsed_biomarkers, ai_summary_en, recommendations')
      .in('id', payload.reportIds);

    if (!reports?.length) {
      logger.warn('No reports found for health profile', { userId: payload.userId });
      return;
    }

    // 2. Aggregate biomarkers
    const allBiomarkers = reports.flatMap(r => r.parsed_biomarkers || []);

    // 3. Generate profile (would call AI orchestrator in production)
    const healthScore = calculateHealthScore(allBiomarkers);

    // 4. Save profile
    await supabaseAdmin().from('health_profiles').insert([{
      user_id: payload.userId,
      based_on_report_ids: payload.reportIds,
      health_score: healthScore,
      overall_status: healthScore >= 80 ? 'excellent' : healthScore >= 60 ? 'good' : healthScore >= 40 ? 'fair' : 'needs_attention',
      biomarkers_analysis: allBiomarkers,
      is_current: true,
      valid_until: new Date(Date.now() + 90 * 86400000).toISOString(), // 90 days
    }]);

    // 5. Mark previous profiles as non-current
    await supabaseAdmin()
      .from('health_profiles')
      .update({ is_current: false })
      .eq('user_id', payload.userId)
      .neq('is_current', false)
      .order('generated_at', { ascending: false })
      .range(1, 100);

    logger.info('Health profile generated', { userId: payload.userId, score: healthScore });
  },

  /**
   * Send medication reminder (would integrate with push/SMS)
   */
  send_medication_reminder: async (payload: { userId: string; medication: string; time: string }) => {
    logger.info('Medication reminder', { userId: payload.userId, med: payload.medication });
    // In production: integrate with OneSignal, FCM, or Twilio SMS
  },

  /**
   * Clean up expired symptom sessions
   */
  cleanup_expired_sessions: async () => {
    const cutoff = new Date(Date.now() - 30 * 86400000).toISOString(); // 30 days ago
    const { count } = await supabaseAdmin()
      .from('symptom_sessions')
      .update({ status: 'completed' })
      .eq('status', 'active')
      .lt('updated_at', cutoff);

    logger.info('Cleaned up expired sessions', { count });
  },

  /**
   * Aggregate daily health metrics into summary
   */
  aggregate_daily_metrics: async () => {
    logger.info('Aggregating daily metrics');
    // In production: calculate averages, trends, anomalies
  },

  /**
   * Notify user when report analysis is ready
   */
  send_report_notification: async (payload: { userId: string; reportId: string }) => {
    logger.info('Report notification', payload);
    // In production: push notification, email, SMS
  },

  /**
   * Re-analyze a lab report with updated AI model
   */
  reanalyze_lab_report: async (payload: { reportId: string }) => {
    logger.info('Re-analyzing lab report', payload);
    // In production: call AI orchestrator with new model version
  },
};

// ============================================
// SIMPLE HEALTH SCORE CALCULATOR (used by profile generation)
// ============================================

function calculateHealthScore(biomarkers: any[]): number {
  if (!biomarkers.length) return 50;

  let score = 70;
  const normalCount = biomarkers.filter((b: any) => b.status === 'normal').length;
  const criticalCount = biomarkers.filter((b: any) => b.status?.startsWith('critical')).length;
  const highCount = biomarkers.filter((b: any) => b.status === 'high').length;
  const lowCount = biomarkers.filter((b: any) => b.status === 'low').length;

  score += (normalCount / biomarkers.length) * 30;
  score -= criticalCount * 10;
  score -= highCount * 3;
  score -= lowCount * 2;

  return Math.max(0, Math.min(100, Math.round(score)));
}

// ============================================
// QUEUE INTERFACE
// ============================================

export const jobQueue = {
  /**
   * Enqueue a job for immediate execution (fire-and-forget)
   */
  async enqueue<T>(type: JobType, payload: T, options?: { priority?: Job['priority'] }): Promise<void> {
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    logger.info('Job enqueued', { jobId, type, priority: options?.priority || 'normal' });

    const handler = handlers[type];
    if (!handler) {
      logger.error('Unknown job type', undefined, { type });
      return;
    }

    // Execute immediately in serverless (no persistent queue)
    // In production with BullMQ: bull.add(type, payload, { priority, attempts: 3 })
    try {
      await handler(payload);
      logger.info('Job completed', { jobId, type });
    } catch (err) {
      logger.error('Job failed', err as Error, { jobId, type });
      // In production: retry with backoff, dead letter queue
    }
  },

  /**
   * Schedule a job for later (via QStash in production)
   */
  async schedule<T>(type: JobType, payload: T, delaySeconds: number): Promise<void> {
    logger.info('Job scheduled', { type, delaySeconds });

    // In production with QStash:
    // await qstash.publishJSON({
    //   url: `${config.frontendUrl}/api/jobs/${type}`,
    //   body: payload,
    //   delay: delaySeconds,
    // });

    // Serverless fallback: setTimeout (lost on function timeout)
    setTimeout(() => {
      const handler = handlers[type];
      if (handler) handler(payload).catch(err =>
        logger.error('Scheduled job failed', err as Error, { type })
      );
    }, delaySeconds * 1000);
  },
};

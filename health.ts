// ============================================
// HEALTH SERVICE — Health metrics & appointments domain
// ============================================

import { supabaseClient } from './database';
import { rootLogger } from '../core/logger';
import { cache } from '../core/cache';

const logger = rootLogger.child({ service: 'health' });

// ============================================
// METRICS
// ============================================

export interface HealthMetric {
  user_id: string;
  recorded_at?: string;
  weight_kg?: number;
  height_cm?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  heart_rate?: number;
  blood_oxygen?: number;
  steps?: number;
  water_ml?: number;
  calories_consumed?: number;
  calories_target?: number;
  sleep_hours?: number;
  sleep_quality?: number;
  mood?: string;
  stress_level?: number;
  energy_level?: number;
  notes?: string;
  source?: string;
}

export async function getMetrics(userId: string, token: string, days: number = 30) {
  const cacheKey = `metrics:${userId}:${days}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    logger.debug('Metrics cache hit', { userId, days });
    return JSON.parse(cached);
  }

  const cutoff = new Date(Date.now() - days * 86400000).toISOString();
  const { data, error } = await supabaseClient(token)
    .from('health_metrics')
    .select('*')
    .eq('user_id', userId)
    .gte('recorded_at', cutoff)
    .order('recorded_at', { ascending: false })
    .limit(200);

  if (error) {
    logger.error('Failed to fetch metrics', error as any, { userId });
    throw error;
  }

  // Cache for 2 minutes
  await cache.set(cacheKey, JSON.stringify(data), 120);
  return data;
}

export async function saveMetric(userId: string, token: string, metric: HealthMetric) {
  const { data, error } = await supabaseClient(token)
    .from('health_metrics')
    .insert([{ ...metric, user_id: userId, source: metric.source || 'api' }])
    .select()
    .single();

  if (error) {
    logger.error('Failed to save metric', error as any, { userId });
    throw error;
  }

  // Invalidate cache
  await cache.del(`metrics:${userId}:7`);
  await cache.del(`metrics:${userId}:30`);
  await cache.del(`metrics:${userId}:90`);

  logger.info('Metric saved', { userId, id: data.id });
  return data;
}

// ============================================
// APPOINTMENTS
// ============================================

export interface AppointmentInput {
  doctor_name: string;
  doctor_specialty: string;
  doctor_image_url?: string;
  appointment_date: string;
  appointment_time: string;
  consultation_type?: string;
  reason_for_visit?: string;
  fee_inr?: number;
}

export async function getAppointments(userId: string, token: string) {
  const { data, error } = await supabaseClient(token)
    .from('appointments')
    .select('*')
    .eq('user_id', userId)
    .order('appointment_date', { ascending: false })
    .limit(100);

  if (error) {
    logger.error('Failed to fetch appointments', error as any, { userId });
    throw error;
  }
  return data;
}

export async function bookAppointment(userId: string, token: string, input: AppointmentInput) {
  const { data, error } = await supabaseClient(token)
    .from('appointments')
    .insert([{
      user_id: userId,
      ...input,
      consultation_type: input.consultation_type || 'video',
      fee_inr: input.fee_inr || 0,
      status: 'scheduled',
      payment_status: 'pending',
    }])
    .select()
    .single();

  if (error) {
    logger.error('Failed to book appointment', error as any, { userId });
    throw error;
  }

  logger.info('Appointment booked', { userId, id: data.id, doctor: input.doctor_name });
  return data;
}

export async function updateAppointment(userId: string, token: string, id: string, updates: Record<string, any>) {
  const { data, error } = await supabaseClient(token)
    .from('appointments')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update appointment', error as any, { userId, id });
    throw error;
  }

  logger.info('Appointment updated', { userId, id, updates: Object.keys(updates) });
  return data;
}

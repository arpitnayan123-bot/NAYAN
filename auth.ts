// ============================================
// AUTH SERVICE — User management domain
// ============================================

import { supabaseClient, supabaseAdmin } from './database';
import { rootLogger } from '../core/logger';

const logger = rootLogger.child({ service: 'auth' });

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  city?: string;
  state?: string;
  blood_group?: string;
  language_preference: string;
}

export async function getProfile(userId: string, token: string): Promise<UserProfile | null> {
  const { data, error } = await supabaseClient(token)
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    logger.error('Failed to fetch profile', error as any, { userId });
    return null;
  }
  return data;
}

export async function updateProfile(userId: string, token: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
  const { data, error } = await supabaseClient(token)
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update profile', error as any, { userId });
    return null;
  }

  logger.info('Profile updated', { userId, fields: Object.keys(updates) });
  return data;
}

export async function getHealthScore(userId: string, token: string): Promise<number> {
  try {
    const { data } = await supabaseClient(token).rpc('calculate_health_score', { user_id_param: userId });
    return data || 50;
  } catch {
    return 50;
  }
}

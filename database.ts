// ============================================
// DATABASE SERVICE — Supabase connection layer
// Provides admin client (bypasses RLS) and
// user-scoped client (respects RLS via JWT).
// ============================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

let _adminClient: SupabaseClient | null = null;

/**
 * Admin client — bypasses Row-Level Security.
 * Use ONLY for background jobs, migrations, and admin tasks.
 */
export function supabaseAdmin(): SupabaseClient {
  if (!_adminClient && config.db.url && config.db.serviceRoleKey) {
    _adminClient = createClient(config.db.url, config.db.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  if (!_adminClient) throw new Error('Supabase admin client not initialized');
  return _adminClient;
}

/**
 * User-scoped client — respects RLS via JWT.
 * Use for all user-facing queries.
 */
export function supabaseClient(accessToken: string): SupabaseClient {
  return createClient(config.db.url, config.db.anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

/**
 * Health check — verifies database connectivity.
 */
export async function dbHealthCheck(): Promise<{ ok: boolean; latency_ms: number }> {
  const start = Date.now();
  try {
    const { error } = await supabaseAdmin().from('profiles').select('id').limit(1);
    return { ok: !error, latency_ms: Date.now() - start };
  } catch {
    return { ok: false, latency_ms: Date.now() - start };
  }
}

import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

let _instance: SupabaseClient<Database, 'public'> | null = null;

function getSupabaseAdmin(): SupabaseClient<Database, 'public'> {
  if (!_instance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
    }
    _instance = createClient<Database, 'public'>(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return _instance;
}

/** Server-only Supabase client. Lazy-initialized so build can run without env vars. */
export const supabaseAdmin = new Proxy({} as SupabaseClient<Database, 'public'>, {
  get(_, prop) {
    return (getSupabaseAdmin() as unknown as Record<string, unknown>)[prop as string];
  },
});

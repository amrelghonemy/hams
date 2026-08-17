import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    _supabase = createClient(url, key);
  }
  return _supabase;
}

function getAdminClient(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceKey) {
      _supabaseAdmin = createClient(url, serviceKey);
    } else {
      _supabaseAdmin = getClient();
    }
  }
  return _supabaseAdmin;
}

// Use getters so they're lazily initialized (safe during build)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getClient() as any)[prop];
  },
});

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getAdminClient() as any)[prop];
  },
});

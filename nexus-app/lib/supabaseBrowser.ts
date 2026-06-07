"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./supabase";

let client: SupabaseClient | null | undefined;

/**
 * Singleton browser client with a persisted session (for auth). Returns null
 * when env vars are missing so callers can fall back to demo behaviour.
 */
export function browserSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  if (!isSupabaseConfigured) {
    client = null;
    return client;
  }
  client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: true, autoRefreshToken: true } }
  );
  return client;
}

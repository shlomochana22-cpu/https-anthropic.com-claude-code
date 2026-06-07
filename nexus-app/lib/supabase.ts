import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True once both env vars are present — gates real DB access vs. mock fallback. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Returns a Supabase client, or null when env vars are missing so callers can
 * fall back to mock data. Keeps the app runnable before credentials are added.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  return createClient(url!, anonKey!);
}

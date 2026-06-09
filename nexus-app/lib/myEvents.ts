"use client";

import { browserSupabase } from "./supabaseBrowser";
import { rowToEvent, SELECT, type EventRow } from "./queries";
import type { NexusEvent } from "./events";

/**
 * The signed-in producer's own events only. Resolves the producer profile via
 * the validated session (getUser refreshes the token if needed) and a direct
 * owner-readable profile lookup — robust against RPC/grant edge cases.
 */
export async function getMyEvents(): Promise<NexusEvent[]> {
  const sb = browserSupabase();
  if (!sb) return [];

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];

  // Resolve (or create) the producer profile id.
  let pid: string | null = null;
  const { data: prof } = await sb.from("producer_profiles").select("id").eq("user_id", user.id).maybeSingle();
  pid = (prof?.id as string) ?? null;
  if (!pid) {
    const { data: ensured } = await sb.rpc("ensure_my_producer");
    pid = (ensured as string) ?? null;
  }
  if (!pid) return [];

  const { data, error } = await sb
    .from("events")
    .select(SELECT)
    .eq("producer_id", pid)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as EventRow[]).map(rowToEvent);
}

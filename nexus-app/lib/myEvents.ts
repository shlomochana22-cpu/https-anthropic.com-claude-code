"use client";

import { browserSupabase } from "./supabaseBrowser";
import { rowToEvent, SELECT, type EventRow } from "./queries";
import type { NexusEvent } from "./events";

/**
 * The signed-in producer's own events only — in a SINGLE query. Filters events
 * by the embedded producer_profiles.user_id (inner join), so there's no extra
 * round-trip to resolve the profile first. Scoped per producer via RLS.
 */
export async function getMyEvents(): Promise<NexusEvent[]> {
  const sb = browserSupabase();
  if (!sb) return [];

  const { data: { session } } = await sb.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) return [];

  const { data, error } = await sb
    .from("events")
    .select(`${SELECT}, producer_profiles!inner(user_id)`)
    .eq("producer_profiles.user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as EventRow[]).map(rowToEvent);
}

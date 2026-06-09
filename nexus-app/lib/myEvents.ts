"use client";

import { browserSupabase } from "./supabaseBrowser";
import { rowToEvent, SELECT, type EventRow } from "./queries";
import type { NexusEvent } from "./events";

/**
 * The signed-in producer's own events only (scoped by producer_id via their
 * session). Empty in demo / when not a producer. Each producer sees only theirs.
 */
export async function getMyEvents(): Promise<NexusEvent[]> {
  const sb = browserSupabase();
  if (!sb) return [];
  const { data: pid } = await sb.rpc("ensure_my_producer");
  if (!pid) return [];
  const { data, error } = await sb
    .from("events")
    .select(SELECT)
    .eq("producer_id", pid as string)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as EventRow[]).map(rowToEvent);
}

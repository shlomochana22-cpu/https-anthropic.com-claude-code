"use client";

import { browserSupabase } from "./supabaseBrowser";

export type BuyerRow = { name: string; phone: string | null; eventId: string };

/** Paying customers (incl. guests) for the producer's customer database. */
export async function getBuyers(): Promise<BuyerRow[]> {
  const sb = browserSupabase();
  if (!sb) return [];
  const { data, error } = await sb.rpc("get_buyers");
  if (error || !data) return [];
  return (data as { name: string; phone: string | null; event_id: string }[]).map((r) => ({
    name: r.name,
    phone: r.phone,
    eventId: r.event_id,
  }));
}

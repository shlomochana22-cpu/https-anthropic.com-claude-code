"use client";

import { getMyEvents } from "./myEvents";
import { getEventSales, getGuestCounts, type EventSales } from "./queries";
import type { NexusEvent } from "./events";

export type ProducerSnapshot = {
  events: NexusEvent[];
  sales: Record<string, EventSales>;
  guests: Record<string, number>;
};

const TTL = 30_000; // 30s — navigations within this window are instant
let cache: { data: ProducerSnapshot; at: number } | null = null;
let inflight: Promise<ProducerSnapshot> | null = null;

/**
 * Loads (and caches) the producer's events + sales + guest counts. Subsequent
 * navigations reuse the cache, so moving between dashboard/events/stats doesn't
 * re-fetch. Concurrent callers share one in-flight request.
 */
export async function loadProducerData(force = false): Promise<ProducerSnapshot> {
  if (!force && cache && Date.now() - cache.at < TTL) return cache.data;
  if (!force && inflight) return inflight;
  inflight = (async () => {
    const [events, sales, guests] = await Promise.all([getMyEvents(), getEventSales(), getGuestCounts()]);
    const data: ProducerSnapshot = { events, sales, guests };
    cache = { data, at: Date.now() };
    inflight = null;
    return data;
  })();
  return inflight;
}

/** Drop the cache so the next load is fresh (after a new event / purchase). */
export function invalidateProducerData(): void {
  cache = null;
  inflight = null;
}

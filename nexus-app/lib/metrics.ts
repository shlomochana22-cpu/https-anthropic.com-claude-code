import type { NexusEvent } from "./events";
import type { EventSales } from "./queries";

// Single source of truth for producer metrics. Used by the dashboard, events
// list, per-event dashboard and the stats page so every surface shows the same
// numbers — real Supabase sales when available, a deterministic estimate
// otherwise (so demo data is consistent everywhere too).

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export type EventMetrics = {
  capacity: number;
  sold: number;
  avgPrice: number;
  revenue: number;
  orders: number;
  occupancy: number; // 0-100
  isReal: boolean;
};

export function eventMetrics(e: NexusEvent, real?: EventSales | null): EventMetrics {
  const seed = hash(e.id);
  const capacity = 600 + (seed % 1400);
  const prices = e.tiers.map((t) => t.price).filter((p) => p > 0);
  const avgPriceEst = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : e.fromPrice;

  // Real once the event has paid orders.
  if (real && real.revenue > 0) {
    const sold = real.tickets;
    return {
      capacity,
      sold,
      avgPrice: sold ? Math.round(real.revenue / sold) : avgPriceEst,
      revenue: real.revenue,
      orders: real.orders,
      occupancy: Math.min(100, Math.round((sold / capacity) * 100)),
      isReal: true,
    };
  }

  const sold = Math.round((capacity * e.occupancy) / 100);
  return {
    capacity,
    sold,
    avgPrice: avgPriceEst,
    revenue: sold * avgPriceEst,
    orders: Math.max(1, Math.round(sold / 2.2)),
    occupancy: e.occupancy,
    isReal: false,
  };
}

export type AggMetrics = { capacity: number; sold: number; revenue: number; orders: number; avgPrice: number; occupancy: number; anyReal: boolean };

export function aggregateMetrics(events: NexusEvent[], salesByEvent: Record<string, EventSales> = {}): AggMetrics {
  const ms = events.map((e) => eventMetrics(e, salesByEvent[e.id]));
  const a = ms.reduce(
    (acc, m) => ({ capacity: acc.capacity + m.capacity, sold: acc.sold + m.sold, revenue: acc.revenue + m.revenue, orders: acc.orders + m.orders }),
    { capacity: 0, sold: 0, revenue: 0, orders: 0 }
  );
  return {
    ...a,
    avgPrice: a.sold ? Math.round(a.revenue / a.sold) : 0,
    occupancy: a.capacity ? Math.round((a.sold / a.capacity) * 100) : 0,
    anyReal: ms.some((m) => m.isReal),
  };
}

export const shekel = (n: number) => `₪${n.toLocaleString("he-IL")}`;

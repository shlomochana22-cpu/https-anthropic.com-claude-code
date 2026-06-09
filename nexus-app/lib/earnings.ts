"use client";

import { browserSupabase } from "./supabaseBrowser";

export type MyEarnings = {
  revenue: number;    // ticket sales (subtotal) of my events
  commission: number; // platform commission taken from me
  withdrawn: number;  // already requested/approved/paid
  available: number;  // withdrawable now
  tickets: number;
  orders: number;
};

/** The signed-in producer's real, withdrawable earnings. null in demo / no DB. */
export async function getMyEarnings(): Promise<MyEarnings | null> {
  const sb = browserSupabase();
  if (!sb) return null;
  const { data, error } = await sb.rpc("my_earnings");
  if (error || !data || !data[0]) return null;
  const r = data[0] as Record<string, number>;
  return {
    revenue: Number(r.revenue) || 0,
    commission: Number(r.commission) || 0,
    withdrawn: Number(r.withdrawn) || 0,
    available: Number(r.available) || 0,
    tickets: Number(r.tickets) || 0,
    orders: Number(r.orders) || 0,
  };
}

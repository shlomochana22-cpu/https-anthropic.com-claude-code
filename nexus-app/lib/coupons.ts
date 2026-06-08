"use client";

import { browserSupabase } from "./supabaseBrowser";

export type CouponKind = "percent" | "flat";

/** Persist a new coupon; returns its id (a local id in demo / no-DB mode). */
export async function createCoupon(input: {
  code: string;
  kind: CouponKind;
  amount: number;
  cap: number | null;
  expires: string | null;
}): Promise<{ id: string; demo: boolean }> {
  const localId = `local-${Date.now()}`;
  const sb = browserSupabase();
  if (!sb) return { id: localId, demo: true };
  try {
    const { data, error } = await sb
      .from("coupons")
      .insert({ code: input.code, kind: input.kind, amount: input.amount, cap: input.cap, expires: input.expires })
      .select("id")
      .single();
    if (error || !data) return { id: localId, demo: true };
    return { id: data.id as string, demo: false };
  } catch {
    return { id: localId, demo: true };
  }
}

export async function setCouponActive(id: string, active: boolean): Promise<void> {
  const sb = browserSupabase();
  if (!sb || id.startsWith("local-")) return;
  await sb.from("coupons").update({ active }).eq("id", id);
}

export async function removeCoupon(id: string): Promise<void> {
  const sb = browserSupabase();
  if (!sb || id.startsWith("local-")) return;
  await sb.from("coupons").delete().eq("id", id);
}

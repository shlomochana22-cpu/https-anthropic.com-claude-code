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

export type CouponValid =
  | { ok: true; id: string; used: number; discount: number; label: string }
  | { ok: false; message: string };

/** Validate a coupon code against the DB and compute the discount for a subtotal. */
export async function validateCoupon(code: string, subtotal: number): Promise<CouponValid> {
  const sb = browserSupabase();
  if (!sb) return { ok: false, message: "אימות קופונים זמין רק עם חיבור למסד" };
  const { data, error } = await sb
    .from("coupons")
    .select("id,code,kind,amount,cap,used,expires,active")
    .ilike("code", code.trim())
    .limit(1)
    .maybeSingle();
  if (error || !data) return { ok: false, message: "קוד קופון לא קיים" };
  if (!data.active) return { ok: false, message: "הקופון אינו פעיל" };
  if (data.expires && new Date(data.expires) < new Date(new Date().toDateString())) return { ok: false, message: "הקופון פג תוקף" };
  if (data.cap != null && data.used >= data.cap) return { ok: false, message: "הקופון מוצה (הגיע למגבלת השימוש)" };
  const discount = data.kind === "percent" ? Math.round((subtotal * data.amount) / 100) : Math.min(data.amount, subtotal);
  const label = data.kind === "percent" ? `${data.amount}%` : `₪${data.amount}`;
  return { ok: true, id: data.id, used: data.used, discount, label };
}

/** Increment a coupon's usage count (after a successful order). */
export async function bumpCouponUsage(id: string, newUsed: number): Promise<void> {
  const sb = browserSupabase();
  if (!sb || id.startsWith("local-")) return;
  await sb.from("coupons").update({ used: newUsed }).eq("id", id);
}

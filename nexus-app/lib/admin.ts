"use client";

import { browserSupabase } from "./supabaseBrowser";
import type { PayoutKind } from "./withdrawals";

export type PayoutStatus = "pending" | "approved" | "paid" | "rejected";

export type PayoutRow = {
  id: string;
  user_id: string | null;
  kind: PayoutKind;
  amount: number;
  holder: string;
  idnum: string | null;
  bank: string | null;
  branch: string | null;
  account: string | null;
  contact: string | null;
  status: PayoutStatus;
  receipt_url: string | null;
  admin_note: string | null;
  created_at: string;
  paid_at: string | null;
};

export type AdminOverview = { paidRevenue: number; fees: number; orders: number; tickets: number; pendingPayouts: number; pendingAmount: number };

export type AdminOrder = {
  id: string; createdAt: string; eventId: string; eventTitle: string | null; producer: string | null;
  buyerName: string | null; buyerPhone: string | null; subtotal: number; fee: number; total: number; status: string; participants: number;
};

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const sb = browserSupabase();
  if (!sb) return [];
  const { data, error } = await sb.rpc("admin_orders");
  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map((r) => ({
    id: String(r.id), createdAt: (r.created_at as string) ?? "", eventId: (r.event_id as string) ?? "",
    eventTitle: (r.event_title as string) ?? null, producer: (r.producer as string) ?? null,
    buyerName: (r.buyer_name as string) ?? null, buyerPhone: (r.buyer_phone as string) ?? null,
    subtotal: Number(r.subtotal) || 0, fee: Number(r.fee) || 0, total: Number(r.total) || 0,
    status: (r.status as string) ?? "paid", participants: Number(r.participants) || 0,
  }));
}

/** Demo payouts so the admin UI is populated when there's no DB. */
const demoPayouts: PayoutRow[] = [
  { id: "demo-1", user_id: null, kind: "withdrawal", amount: 4200, holder: "אבי כהן", idnum: "302999111", bank: "בנק לאומי (10)", branch: "800", account: "45219", contact: "0521234567", status: "pending", receipt_url: null, admin_note: null, created_at: new Date().toISOString(), paid_at: null },
  { id: "demo-2", user_id: null, kind: "promoter", amount: 750, holder: "דנה לוי", idnum: "204888222", bank: "בנק הפועלים (12)", branch: "600", account: "112233", contact: "0539876543", status: "pending", receipt_url: null, admin_note: null, created_at: new Date(Date.now() - 86400000).toISOString(), paid_at: null },
];

/** True when the signed-in user is a platform admin (or in demo mode). */
export async function amIAdmin(): Promise<boolean> {
  const sb = browserSupabase();
  if (!sb) return true; // demo
  const { data, error } = await sb.rpc("am_i_admin");
  if (error) return false;
  return data === true;
}

export async function getAdminPayouts(): Promise<PayoutRow[]> {
  const sb = browserSupabase();
  if (!sb) return demoPayouts;
  const { data, error } = await sb.rpc("admin_payouts");
  if (error || !data) return [];
  return data as PayoutRow[];
}

export async function setPayoutStatus(id: string, status: PayoutStatus, receipt?: string, note?: string): Promise<boolean> {
  const sb = browserSupabase();
  if (!sb) return true; // demo
  const { error } = await sb.rpc("admin_set_payout_status", { p_id: id, p_status: status, p_receipt: receipt ?? "", p_note: note ?? "" });
  return !error;
}

export async function getAdminOverview(): Promise<AdminOverview | null> {
  const sb = browserSupabase();
  if (!sb) return null; // caller falls back to client-side estimate
  const { data, error } = await sb.rpc("admin_overview");
  if (error || !data || !data[0]) return null;
  const r = data[0] as { paid_revenue: number; fees: number; orders: number; tickets: number; pending_payouts: number; pending_amount: number };
  return { paidRevenue: Number(r.paid_revenue) || 0, fees: Number(r.fees) || 0, orders: Number(r.orders) || 0, tickets: Number(r.tickets) || 0, pendingPayouts: Number(r.pending_payouts) || 0, pendingAmount: Number(r.pending_amount) || 0 };
}

"use client";

import { browserSupabase } from "./supabaseBrowser";

export type WithdrawalRequest = {
  amount: number;
  holder: string;   // שם בעל החשבון (מוטב)
  idnum: string;    // ת.ז / ח.פ
  bank: string;     // שם הבנק
  branch: string;   // מספר סניף
  account: string;  // מספר חשבון
  contact?: string; // טלפון / אימייל ליצירת קשר
};

export type WithdrawalResult = { ok: boolean; demo: boolean; error?: string };

/**
 * Submits a producer withdrawal request to the platform admin. Stored with
 * status 'pending'; the admin later marks it paid and attaches a receipt
 * (אסמכתא). No INSERT...RETURNING so guest/owner RLS never blocks the write.
 */
export async function createWithdrawalRequest(req: WithdrawalRequest): Promise<WithdrawalResult> {
  const sb = browserSupabase();
  if (!sb) return { ok: true, demo: true };

  const userId = (await sb.auth.getUser()).data.user?.id ?? null;
  const { error } = await sb.from("withdrawal_requests").insert({
    user_id: userId,
    amount: Math.round(req.amount),
    holder: req.holder.trim(),
    idnum: req.idnum.trim(),
    bank: req.bank.trim(),
    branch: req.branch.trim(),
    account: req.account.trim(),
    contact: req.contact?.trim() || null,
    status: "pending",
  });
  if (error) {
    console.error("withdrawal request failed:", error.message);
    return { ok: false, demo: false, error: error.message };
  }
  return { ok: true, demo: false };
}

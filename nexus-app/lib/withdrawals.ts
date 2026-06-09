"use client";

import { browserSupabase } from "./supabaseBrowser";
import { notify } from "./notify";

const KIND_HE: Record<string, string> = { withdrawal: "משיכה", friend: "העברה לחבר", promoter: "העברה ליחצן", supplier: "העברה לספק" };

export type PayoutKind = "withdrawal" | "friend" | "promoter" | "supplier";

export type WithdrawalRequest = {
  kind: PayoutKind; // משיכה / העברה לחבר / יחצן / ספק
  amount: number;
  holder: string;   // שם בעל החשבון (מוטב / מקבל)
  idnum: string;    // ת.ז / ח.פ
  bank: string;     // שם הבנק
  branch: string;   // מספר סניף
  account: string;  // מספר חשבון
  contact?: string; // טלפון / אימייל ליצירת קשר
};

export type WithdrawalResult = { ok: boolean; demo: boolean; error?: string };

/**
 * Submits a producer payout request (withdrawal or transfer) to the platform
 * admin. Stored with status 'pending'; the admin later marks it paid and
 * attaches a receipt (אסמכתא). No INSERT...RETURNING so owner-only RLS never
 * blocks the write.
 */
export async function createWithdrawalRequest(req: WithdrawalRequest): Promise<WithdrawalResult> {
  const sb = browserSupabase();
  if (!sb) return { ok: true, demo: true };

  const userId = (await sb.auth.getUser()).data.user?.id ?? null;
  const { error } = await sb.from("withdrawal_requests").insert({
    user_id: userId,
    kind: req.kind,
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
    console.error("payout request failed:", error.message);
    return { ok: false, demo: false, error: error.message };
  }
  // Notify the platform admin of the new request (best-effort).
  void notify({
    toAdmin: true,
    subject: `בקשת ${KIND_HE[req.kind] || "תשלום"} חדשה · ₪${Math.round(req.amount).toLocaleString()}`,
    html: `<div dir="rtl"><h2>בקשת ${KIND_HE[req.kind] || "תשלום"} חדשה</h2>
      <p>מוטב: <b>${req.holder}</b><br>סכום: <b>₪${Math.round(req.amount).toLocaleString()}</b><br>
      בנק: ${req.bank} · סניף ${req.branch} · חשבון ${req.account}<br>ת.ז/ח.פ: ${req.idnum}</p>
      <p>היכנס למרכז הניהול לאישור וצירוף אסמכתא.</p></div>`,
  });
  return { ok: true, demo: false };
}

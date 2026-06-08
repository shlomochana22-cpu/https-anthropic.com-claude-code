"use client";

import { browserSupabase } from "./supabaseBrowser";

export type InviteType = "free" | "discount";

function randomCode() {
  return `NX-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/** Producer: persist a one-time invite link and return its token. */
export async function createInvite(eventId: string, qty: number, type: InviteType): Promise<{ token: string; demo: boolean }> {
  const token = Math.random().toString(36).slice(2, 10);
  const sb = browserSupabase();
  if (!sb) return { token, demo: true };
  const { error } = await sb.from("invites").insert({ token, event_id: eventId, qty, type });
  return { token, demo: !!error };
}

/** Producer: add a guest manually (full details). */
export async function addGuest(input: {
  eventId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dob?: string;
  gender?: string;
  entryType: InviteType;
  qty: number;
}): Promise<{ demo: boolean; error?: string }> {
  const sb = browserSupabase();
  if (!sb) return { demo: true };
  const { error } = await sb.from("guests").insert({
    event_id: input.eventId,
    first_name: input.firstName,
    last_name: input.lastName,
    phone: input.phone || null,
    dob: input.dob || null,
    gender: input.gender || null,
    entry_type: input.entryType,
    qty: input.qty,
    source: "manual",
  });
  return { demo: false, error: error?.message };
}

/** Customer: redeem a one-time invite link. Atomic & single-use server-side. */
export async function redeemInvite(
  token: string,
  input: { firstName: string; lastName: string; phone?: string; dob?: string; gender?: string }
): Promise<{ ok: boolean; code?: string; message?: string }> {
  const sb = browserSupabase();
  if (!sb) return { ok: true, code: randomCode() }; // demo mode (no DB configured)
  const { data, error } = await sb.rpc("redeem_invite", {
    p_token: token,
    p_first: input.firstName,
    p_last: input.lastName,
    p_phone: input.phone || null,
    p_dob: input.dob || null,
    p_gender: input.gender || null,
  });
  if (error) return { ok: false, message: error.message };
  const row = Array.isArray(data) ? data[0] : data;
  return { ok: !!row?.ok, code: row?.code ?? undefined, message: row?.message };
}

"use client";

import { browserSupabase } from "./supabaseBrowser";

export type CartItem = { tierSlug: string; qty: number };

export type MyTicket = {
  id: string;
  qrCode: string;
  status: string;
  eventId: string;
  eventTitle: string;
  date: string;
  time: string;
};

/** Fetches the signed-in user's tickets (with event details). Empty when not authed. */
export async function getMyTickets(): Promise<MyTicket[]> {
  const sb = browserSupabase();
  if (!sb) return [];
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return [];

  const { data } = await sb
    .from("tickets")
    .select("id, qr_code, status, event_id, events(title, date, time)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data ?? []).map((t) => {
    const ev = t.events as unknown as { title: string; date: string; time: string } | null;
    return {
      id: t.id as string,
      qrCode: t.qr_code as string,
      status: t.status as string,
      eventId: t.event_id as string,
      eventTitle: ev?.title ?? "NEXUS EVENT",
      date: ev?.date ?? "",
      time: ev?.time ?? "",
    };
  });
}

export type CreatedOrder = { orderId: string; demo: boolean; error?: string };
export type Buyer = { name?: string; phone?: string; email?: string };
export type Participant = { name: string; dob?: string; gender?: string; idnum?: string; phone?: string; email?: string; instagram?: string };

/** RFC4122 v4 id, generated client-side so we never need INSERT ... RETURNING. */
function uuid(): string {
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    const v = ch === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Creates an order + one ticket row per seat (for a signed-in user or a guest).
 * Buyer + per-participant details are stored so the producer's customer DB is
 * populated for every ticket holder. Falls back to a demo id when no DB.
 */
export async function createOrder(
  eventId: string,
  items: CartItem[],
  subtotal: number,
  buyer?: Buyer,
  participants?: Participant[]
): Promise<CreatedOrder> {
  const sb = browserSupabase();
  const demoId = `NX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  if (!sb) return { orderId: demoId, demo: true };

  // Persist even for guests (user_id null) so the producer sees the sale.
  const userId = (await sb.auth.getUser()).data.user?.id ?? null;

  const fee = 15;
  // We generate the order id ourselves and DON'T use `.select()` (INSERT ...
  // RETURNING). A guest row (user_id null) isn't readable under the owner-only
  // SELECT RLS, so RETURNING would fail with 42501 and block the whole insert —
  // even though the INSERT itself is allowed. Supplying the id avoids the
  // read-back entirely and keeps guest orders private.
  const orderId = uuid();
  const core = {
    id: orderId,
    user_id: userId,
    event_id: eventId,
    subtotal,
    fee,
    total: subtotal + fee,
  };
  const buyerFields = {
    buyer_name: buyer?.name?.trim() || null,
    buyer_phone: buyer?.phone?.trim() || null,
    buyer_email: buyer?.email?.trim() || null,
  };
  // Insert the full row first, but if buyer_*/participants columns are missing
  // on this DB, degrade gracefully so the SALE STILL PERSISTS for the producer.
  const attempts = [
    { ...core, ...buyerFields, participants: (participants ?? []).filter((p) => p.name?.trim()) },
    { ...core, ...buyerFields },
    core,
  ];

  let persisted = false;
  let lastError: string | undefined;
  for (const payload of attempts) {
    const { error } = await sb.from("orders").insert(payload);
    if (!error) {
      persisted = true;
      break;
    }
    lastError = error.message;
    console.error("createOrder insert failed:", error.message);
    // Retry with fewer columns only on a schema/column mismatch; otherwise stop.
    if (!/column|schema cache|participants|buyer_/i.test(error.message)) break;
  }
  if (!persisted) return { orderId: demoId, demo: true, error: lastError };

  // Resolve tier ids and create one ticket per seat (no RETURNING needed).
  const { data: tiers } = await sb
    .from("ticket_tiers")
    .select("id, slug")
    .eq("event_id", eventId);
  const bySlug = new Map((tiers ?? []).map((t) => [t.slug, t.id]));

  const tickets = items
    .filter((i) => i.qty > 0)
    .flatMap((i) =>
      Array.from({ length: i.qty }, () => ({
        order_id: orderId,
        event_id: eventId,
        tier_id: bySlug.get(i.tierSlug) ?? null,
        user_id: userId,
      }))
    );
  if (tickets.length) await sb.from("tickets").insert(tickets);

  return { orderId, demo: false };
}

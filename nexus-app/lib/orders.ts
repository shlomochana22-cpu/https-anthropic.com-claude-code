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

export type CreatedOrder = { orderId: string; demo: boolean };
export type Buyer = { name?: string; phone?: string; email?: string };
export type Participant = { name: string; dob?: string; gender?: string; idnum?: string; phone?: string; email?: string; instagram?: string };

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
  const { data: order, error } = await sb
    .from("orders")
    .insert({
      user_id: userId,
      event_id: eventId,
      subtotal,
      fee,
      total: subtotal + fee,
      buyer_name: buyer?.name?.trim() || null,
      buyer_phone: buyer?.phone?.trim() || null,
      buyer_email: buyer?.email?.trim() || null,
      participants: (participants ?? []).filter((p) => p.name?.trim()),
    })
    .select("id")
    .single();
  if (error || !order) return { orderId: demoId, demo: true };

  // Resolve tier ids and create one ticket per seat.
  const { data: tiers } = await sb
    .from("ticket_tiers")
    .select("id, slug")
    .eq("event_id", eventId);
  const bySlug = new Map((tiers ?? []).map((t) => [t.slug, t.id]));

  const tickets = items
    .filter((i) => i.qty > 0)
    .flatMap((i) =>
      Array.from({ length: i.qty }, () => ({
        order_id: order.id,
        event_id: eventId,
        tier_id: bySlug.get(i.tierSlug) ?? null,
        user_id: userId,
      }))
    );
  if (tickets.length) await sb.from("tickets").insert(tickets);

  return { orderId: order.id, demo: false };
}

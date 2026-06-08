import { getSupabase } from "./supabase";
import { events as mockEvents, type NexusEvent, type TicketTier } from "./events";

/**
 * Data access layer. Each function queries Supabase when configured, and
 * otherwise falls back to the in-memory mock so the app runs without keys.
 */

type EventRow = {
  id: string;
  title: string;
  subtitle: string | null;
  venue: string | null;
  city: string | null;
  date: string | null;
  time: string | null;
  image: string | null;
  badge: string | null;
  genre: string | null;
  occupancy: number;
  from_price: number;
  description?: string | null;
  age?: string | null;
  age_visible?: boolean | null;
  ticket_tiers: {
    slug: string;
    name: string;
    description: string | null;
    price: number;
    sold_out: boolean;
    exclusive: boolean;
    sort_order: number;
    benefits?: string[] | null;
  }[];
};

function rowToEvent(row: EventRow): NexusEvent {
  const tiers: TicketTier[] = [...(row.ticket_tiers ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((t) => ({
      id: t.slug,
      name: t.name,
      description: t.description ?? "",
      price: t.price,
      soldOut: t.sold_out,
      exclusive: t.exclusive,
      benefits: t.benefits ?? [],
    }));
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? "",
    venue: row.venue ?? "",
    city: row.city ?? "",
    date: row.date ?? "",
    time: row.time ?? "",
    image: row.image ?? "",
    badge: row.badge ?? undefined,
    genre: row.genre ?? "",
    occupancy: row.occupancy,
    fromPrice: row.from_price,
    description: row.description ?? "",
    age: row.age ?? undefined,
    ageVisible: row.age_visible ?? true,
    tiers,
  };
}

const SELECT = "*, ticket_tiers(slug,name,description,price,sold_out,exclusive,sort_order,benefits)";

export async function getEvents(): Promise<NexusEvent[]> {
  const sb = getSupabase();
  if (!sb) return mockEvents;
  const { data, error } = await sb.from("events").select(SELECT).order("created_at");
  if (error || !data) return mockEvents;
  return (data as EventRow[]).map(rowToEvent);
}

export async function getEventById(id: string): Promise<NexusEvent | undefined> {
  const sb = getSupabase();
  if (!sb) return mockEvents.find((e) => e.id === id);
  const { data, error } = await sb.from("events").select(SELECT).eq("id", id).single();
  if (error || !data) return mockEvents.find((e) => e.id === id);
  return rowToEvent(data as EventRow);
}

export type DBGuest = {
  id: string;
  event_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  dob: string | null;
  gender: string | null;
  entry_type: string;
  qty: number;
  status: string;
  source: string;
  code: string | null;
};

/** Registered/invited guests (free/discounted entry). Empty when no DB. */
export async function getGuests(): Promise<DBGuest[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("guests")
    .select("id,event_id,first_name,last_name,phone,dob,gender,entry_type,qty,status,source,code")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as DBGuest[];
}

export type DBCoupon = {
  id: string;
  code: string;
  kind: string;
  amount: number;
  cap: number | null;
  used: number;
  expires: string | null;
  active: boolean;
};

/** Producer discount coupons. Empty when no DB (page falls back to demo seed). */
export async function getCoupons(): Promise<DBCoupon[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("coupons")
    .select("id,code,kind,amount,cap,used,expires,active")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as DBCoupon[];
}

/** Invited-guest counts per event (free/discounted entry). {} when no DB. */
export async function getGuestCounts(): Promise<Record<string, number>> {
  const sb = getSupabase();
  if (!sb) return {};
  const { data, error } = await sb.from("guests").select("event_id");
  if (error || !data) return {};
  const map: Record<string, number> = {};
  for (const r of data as { event_id: string }[]) map[r.event_id] = (map[r.event_id] || 0) + 1;
  return map;
}

export type EventSales = { tickets: number; orders: number; revenue: number };

/**
 * Real sales aggregates per event from the event_sales() function (paid orders
 * + tickets). Returns {} when no DB / function — dashboards then use estimates.
 */
export async function getEventSales(): Promise<Record<string, EventSales>> {
  const sb = getSupabase();
  if (!sb) return {};
  const { data, error } = await sb.rpc("event_sales");
  if (error || !data) return {};
  const map: Record<string, EventSales> = {};
  for (const r of data as { event_id: string; tickets: number; orders: number; revenue: number }[]) {
    map[r.event_id] = { tickets: Number(r.tickets) || 0, orders: Number(r.orders) || 0, revenue: Number(r.revenue) || 0 };
  }
  return map;
}

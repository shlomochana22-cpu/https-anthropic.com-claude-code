"use client";

import { browserSupabase } from "./supabaseBrowser";

export type ProducerStatus = "active" | "suspended" | "blocked";
export type ContractType = "standard" | "vip" | "special";

export type ProducerSummary = {
  id: string;
  userId: string | null;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  status: ProducerStatus;
  commissionRate: number;
  contractType: ContractType;
  contractStart: string | null;
  contractEnd: string | null;
  contractNotes: string | null;
  createdAt: string;
  // financials
  eventsCount: number;
  revenue: number;   // ticket price (subtotal)
  tickets: number;
  commission: number;
  paidOut: number;
  fees: number;      // buyer fees collected on this producer's sales
  orders: number;
};

export type ProducerEventRow = { eventId: string; title: string; date: string; tickets: number; revenue: number };

export type ProducerPatch = {
  status?: ProducerStatus;
  commissionRate?: number;
  contractType?: ContractType;
  contractStart?: string | null;
  contractEnd?: string | null;
  contractNotes?: string | null;
};

const demo: ProducerSummary[] = [
  { id: "dp-1", userId: null, name: "עומר ספקטור", company: "Spoons Production", email: "omer@spoons.co.il", phone: "0521234567", whatsapp: "0521234567", status: "active", commissionRate: 12, contractType: "vip", contractStart: "2024-01-01", contractEnd: null, contractNotes: "חוזה VIP — עדיפות לאולמות מרכז.", createdAt: "2024-01-01T00:00:00Z", eventsCount: 8, revenue: 482000, tickets: 3120, commission: 57840, paidOut: 410000, fees: 46800, orders: 2200 },
  { id: "dp-2", userId: null, name: "דנה לוי", company: "Unity Events", email: "dana@unity.co.il", phone: "0539876543", whatsapp: "0539876543", status: "active", commissionRate: 15, contractType: "standard", contractStart: "2024-03-15", contractEnd: null, contractNotes: "", createdAt: "2024-03-15T00:00:00Z", eventsCount: 5, revenue: 268000, tickets: 1740, commission: 40200, paidOut: 190000, fees: 26100, orders: 1230 },
  { id: "dp-3", userId: null, name: "רון אבני", company: "Boombox Crew", email: "ron@boombox.co.il", phone: "0501112233", whatsapp: "0501112233", status: "suspended", commissionRate: 18, contractType: "special", contractStart: "2024-05-01", contractEnd: "2024-12-31", contractNotes: "מושהה עד הסדרת תשלום פתוח.", createdAt: "2024-05-01T00:00:00Z", eventsCount: 3, revenue: 96000, tickets: 640, commission: 17280, paidOut: 60000, fees: 9600, orders: 470 },
];

const demoEvents: Record<string, ProducerEventRow[]> = {
  "dp-1": [
    { eventId: "e1", title: "Cyber Rave", date: "12.06", tickets: 1200, revenue: 186000 },
    { eventId: "e2", title: "Neon Jungle", date: "28.05", tickets: 980, revenue: 152000 },
    { eventId: "e3", title: "Block Party", date: "10.05", tickets: 940, revenue: 144000 },
  ],
};

function rowToSummary(r: Record<string, unknown>): ProducerSummary {
  const n = (v: unknown) => Number(v) || 0;
  return {
    id: String(r.id), userId: (r.user_id as string) ?? null,
    name: (r.name as string) ?? "מפיק", company: (r.company as string) ?? null,
    email: (r.email as string) ?? null, phone: (r.phone as string) ?? null, whatsapp: (r.whatsapp as string) ?? null,
    status: (r.status as ProducerStatus) ?? "active", commissionRate: n(r.commission_rate),
    contractType: (r.contract_type as ContractType) ?? "standard",
    contractStart: (r.contract_start as string) ?? null, contractEnd: (r.contract_end as string) ?? null,
    contractNotes: (r.contract_notes as string) ?? null, createdAt: (r.created_at as string) ?? "",
    eventsCount: n(r.events_count), revenue: n(r.revenue), tickets: n(r.tickets), commission: n(r.commission), paidOut: n(r.paid_out),
    fees: n(r.fees), orders: n(r.orders),
  };
}

export async function getProducers(): Promise<ProducerSummary[]> {
  const sb = browserSupabase();
  if (!sb) return demo;
  const { data, error } = await sb.rpc("admin_producers");
  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map(rowToSummary);
}

export async function getProducerEvents(id: string): Promise<ProducerEventRow[]> {
  const sb = browserSupabase();
  if (!sb) return demoEvents[id] ?? [];
  const { data, error } = await sb.rpc("admin_producer_events", { p_id: id });
  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map((r) => ({
    eventId: String(r.event_id), title: (r.title as string) ?? "אירוע", date: (r.date as string) ?? "",
    tickets: Number(r.tickets) || 0, revenue: Number(r.revenue) || 0,
  }));
}

export async function updateProducer(id: string, patch: ProducerPatch): Promise<boolean> {
  const sb = browserSupabase();
  if (!sb) return true;
  const { error } = await sb.rpc("admin_update_producer", {
    p_id: id,
    p_status: patch.status ?? null,
    p_rate: patch.commissionRate ?? null,
    p_ctype: patch.contractType ?? null,
    p_cstart: patch.contractStart ?? null,
    p_cend: patch.contractEnd ?? null,
    p_notes: patch.contractNotes ?? null,
  });
  return !error;
}

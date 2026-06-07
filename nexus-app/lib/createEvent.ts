"use client";

import { browserSupabase } from "./supabaseBrowser";

export type NewTier = { name: string; price: number; qty: number; exclusive?: boolean };

export type NewEventInput = {
  title: string;
  genre: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  image?: string;
  tiers: NewTier[];
};

export type CreateResult = { id: string; demo: boolean };

function slugify(s: string) {
  const base = s
    .trim()
    .toLowerCase()
    .replace(/[^\w֐-׿]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${base || "event"}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Persists a producer-created event + its ticket tiers to Supabase.
 * Falls back to a demo id when Supabase/auth is unavailable.
 */
export async function createEvent(input: NewEventInput): Promise<CreateResult> {
  const id = slugify(input.title);
  const sb = browserSupabase();
  if (!sb) return { id, demo: true };

  const fromPrice = Math.min(...input.tiers.map((t) => t.price).filter((n) => n > 0), 0) || input.tiers[0]?.price || 0;

  const { error } = await sb.from("events").insert({
    id,
    title: input.title,
    subtitle: "",
    venue: input.venue,
    city: input.city,
    date: input.date,
    time: input.time,
    image: input.image ?? "",
    genre: input.genre,
    occupancy: 0,
    from_price: fromPrice,
  });
  if (error) return { id, demo: true };

  const tierRows = input.tiers
    .filter((t) => t.name && t.price > 0)
    .map((t, i) => ({
      event_id: id,
      slug: `tier-${i}`,
      name: t.name,
      description: "",
      price: t.price,
      sold_out: false,
      exclusive: !!t.exclusive,
      sort_order: i,
    }));
  if (tierRows.length) await sb.from("ticket_tiers").insert(tierRows);

  return { id, demo: false };
}

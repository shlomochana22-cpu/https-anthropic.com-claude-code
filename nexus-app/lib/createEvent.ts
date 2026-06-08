"use client";

import { browserSupabase } from "./supabaseBrowser";

export type NewTier = { name: string; price: number; qty: number; exclusive?: boolean; benefits?: string[] };

export type NewEventInput = {
  title: string;
  genre: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  image?: string;
  description?: string;
  age?: string;
  ageVisible?: boolean;
  tiers: NewTier[];
};

export type CreateResult = { id: string; demo: boolean; error?: string };

// Fallback covers (until real image upload via Storage) so created events
// never render a broken image in the feed.
const DEFAULT_COVERS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC9BlsJh1ytbzdu948Nc8Sn0VY-Ghf0fkYIoFWbHp2aFnJ00sd35yRN5V-4HLogSecis1WUi9n3fHcxmVyBFHvjwLZ7y2qB4RKS9y7oUPClK2xOt8tNNnjDw9J5zMKnhJsAiqhqEKTYNc505RUcEXlp5X1d1-J5RhNp-GRCerDjjXT3a0k4BRViY4TNsjKMo1F5THcUDwuAyYi0sKtih9OR-44M_SLC0DzjBryx5h6lIWsd9VAze-kyq7BvIRF6fDJZVKHCvaqaOg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuABC4XLqjQb3v4mF80E1HS794ltzLAAVOLui9YOijYzGyWZy3va6v6bQYVzOhkOorLCbmbNzX2R4vyiupSY6nK907GJEuTeLx43D_z-DJJVZ9Ryy7H1cWmcyLu18O3WyPihGs8MRV4kyc-POrqr_Oo1CV1Afbv3Bq-hyNSg5l-_BaXWVob8_y5rl5KQMIO6njp31_8FoLpdBQ_N9uuTXFLAfafz6_r92RzXI9QT6QjJzpyx4sBJAWlBqG4DdWe9nRGznMl2nO0cSA",
];

function slugify(s: string) {
  // Keep Hebrew letters in the slug (ids may be Hebrew); strip only unsafe chars.
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

  const prices = input.tiers.map((t) => t.price).filter((n) => n > 0);
  const fromPrice = prices.length ? Math.min(...prices) : input.tiers[0]?.price || 0;

  const { error } = await sb.from("events").insert({
    id,
    title: input.title,
    subtitle: "",
    venue: input.venue,
    city: input.city,
    date: input.date,
    time: input.time,
    image: input.image || DEFAULT_COVERS[Math.floor(Math.random() * DEFAULT_COVERS.length)],
    genre: input.genre,
    occupancy: 0,
    from_price: fromPrice,
    description: input.description ?? "",
    age: input.age ?? null,
    age_visible: input.ageVisible ?? true,
  });
  // Real failure (e.g. missing INSERT policy / columns) — surface it, don't fake success.
  if (error) return { id, demo: false, error: error.message };

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
      benefits: t.benefits ?? [],
    }));
  if (tierRows.length) {
    const { error: tierError } = await sb.from("ticket_tiers").insert(tierRows);
    if (tierError) return { id, demo: false, error: tierError.message };
  }

  return { id, demo: false };
}

export type EventEditFields = {
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  genre: string;
  occupancy: number;
  description: string;
};

/** Updates an existing event's core fields in Supabase. */
export async function updateEvent(id: string, fields: EventEditFields): Promise<{ ok: boolean; error?: string }> {
  const sb = browserSupabase();
  if (!sb) return { ok: true }; // demo
  const { error } = await sb
    .from("events")
    .update({
      title: fields.title,
      date: fields.date,
      time: fields.time,
      venue: fields.venue,
      city: fields.city,
      genre: fields.genre,
      occupancy: Math.max(0, Math.min(100, Math.round(fields.occupancy))),
      description: fields.description,
    })
    .eq("id", id);
  return { ok: !error, error: error?.message };
}

-- 0012_participants.sql
-- Per-ticket participant details (Zigo-style): each buyer fills name, DOB,
-- gender, ID number (ת.ז), phone, email, instagram. Stored as a JSONB array on
-- the order; get_buyers() returns one row per participant so EVERY ticket
-- holder flows into the producer's customer database. Safe to re-run.

alter table public.orders add column if not exists participants jsonb not null default '[]'::jsonb;

create or replace function public.get_buyers()
returns table (name text, phone text, email text, event_id text, total int, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  -- one row per participant when present
  select p->>'name', p->>'phone', p->>'email', o.event_id, o.total, o.created_at
  from public.orders o, lateral jsonb_array_elements(o.participants) p
  where o.status = 'paid'
    and jsonb_array_length(o.participants) > 0
    and coalesce(p->>'name', '') <> ''
  union all
  -- fallback: orders without participants use the legacy buyer fields
  select o.buyer_name, o.buyer_phone, o.buyer_email, o.event_id, o.total, o.created_at
  from public.orders o
  where o.status = 'paid'
    and jsonb_array_length(o.participants) = 0
    and coalesce(o.buyer_name, '') <> ''
  order by created_at desc;
$$;

grant execute on function public.get_buyers() to anon, authenticated;

-- 0011_buyer_details.sql
-- Capture the buyer's contact details on each order so paying customers
-- (incl. guests) flow into the producer's customer database.
--
-- get_buyers() is SECURITY DEFINER and exposes only buyer name/phone/event
-- (no auth ids), so the producer area can read them despite owner-only RLS.
-- Safe to re-run.

alter table public.orders add column if not exists buyer_name  text;
alter table public.orders add column if not exists buyer_phone text;
alter table public.orders add column if not exists buyer_email text;

create or replace function public.get_buyers()
returns table (name text, phone text, email text, event_id text, total int, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select buyer_name, buyer_phone, buyer_email, event_id, total, created_at
  from public.orders
  where status = 'paid' and coalesce(buyer_name, '') <> ''
  order by created_at desc;
$$;

grant execute on function public.get_buyers() to anon, authenticated;

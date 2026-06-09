-- 0021_earnings_orders.sql
-- my_earnings(): the signed-in producer's real withdrawable balance, derived
-- from their events' paid orders (ticket subtotal only) minus their commission
-- and minus amounts already requested/paid out.
-- admin_orders(): every paid order across the platform for the admin data view.
-- Safe to re-run.

create or replace function public.my_earnings()
returns table (revenue bigint, commission bigint, withdrawn bigint, available bigint, tickets bigint, orders bigint)
language sql stable security definer set search_path = public as $$
  with me as (select id, commission_rate from public.producer_profiles where user_id = auth.uid()),
  o as (
    select coalesce(sum(ord.subtotal), 0) sub, count(*) cnt
    from public.orders ord join public.events e on e.id = ord.event_id
    where e.producer_id = (select id from me) and ord.status = 'paid'
  ),
  t as (
    select count(*) cnt from public.tickets tk join public.events e on e.id = tk.event_id
    where e.producer_id = (select id from me)
  ),
  w as (
    select coalesce(sum(amount), 0) req from public.withdrawal_requests
    where user_id = auth.uid() and status in ('pending', 'approved', 'paid')
  )
  select
    (select sub from o)::bigint,
    round((select sub from o) * coalesce((select commission_rate from me), 10) / 100.0)::bigint,
    (select req from w)::bigint,
    ((select sub from o) - round((select sub from o) * coalesce((select commission_rate from me), 10) / 100.0) - (select req from w))::bigint,
    (select cnt from t)::bigint,
    (select cnt from o)::bigint;
$$;
grant execute on function public.my_earnings() to authenticated;

create or replace function public.admin_orders()
returns table (
  id uuid, created_at timestamptz, event_id text, event_title text, producer text,
  buyer_name text, buyer_phone text, subtotal int, fee int, total int, status text, participants int
) language sql stable security definer set search_path = public as $$
  select o.id, o.created_at, o.event_id, e.title, pp.name,
         o.buyer_name, o.buyer_phone, o.subtotal, o.fee, o.total, o.status,
         jsonb_array_length(coalesce(o.participants, '[]'::jsonb))
  from public.orders o
  left join public.events e on e.id = o.event_id
  left join public.producer_profiles pp on pp.id = e.producer_id
  where public.is_admin(auth.uid())
  order by o.created_at desc;
$$;
grant execute on function public.admin_orders() to anon, authenticated;

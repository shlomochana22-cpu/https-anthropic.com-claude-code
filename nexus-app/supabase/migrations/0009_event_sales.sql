-- 0009_event_sales.sql
-- Real per-event sales aggregates for the producer dashboards.
--
-- orders/tickets are protected by owner-only RLS, so the producer (anon key)
-- can't read other users' rows directly. This SECURITY DEFINER function exposes
-- ONLY aggregate counts/sums per event (no PII), safe for the producer area.
-- Safe to re-run.

create or replace function public.event_sales()
returns table (event_id text, tickets bigint, orders bigint, revenue bigint)
language sql stable security definer set search_path = public as $$
  select
    e.id,
    coalesce(t.cnt, 0)::bigint as tickets,
    coalesce(o.cnt, 0)::bigint as orders,
    coalesce(o.rev, 0)::bigint as revenue
  from public.events e
  left join (
    select event_id, count(*)::bigint as cnt
    from public.tickets
    group by event_id
  ) t on t.event_id = e.id
  left join (
    select event_id, count(*)::bigint as cnt, sum(total)::bigint as rev
    from public.orders
    where status = 'paid'
    group by event_id
  ) o on o.event_id = e.id;
$$;

grant execute on function public.event_sales() to anon, authenticated;

-- 0017_fees_split.sql
-- Split ticket revenue (orders.subtotal) from the buyer fee (orders.fee).
-- Producers must only ever see the original ticket amount; the admin sees the
-- buyer-fee income separately. Re-creates the aggregate functions so `revenue`
-- now means TICKET revenue (subtotal) and `fees` is the buyer fee. Safe to re-run.

-- These two change their return type (added `fees`), so they must be dropped
-- before re-create (CREATE OR REPLACE can't change a function's output columns).
drop function if exists public.event_sales();
drop function if exists public.admin_overview();

create or replace function public.event_sales()
returns table (event_id text, tickets bigint, orders bigint, revenue bigint, fees bigint)
language sql stable security definer set search_path = public as $$
  select
    e.id,
    coalesce(t.cnt, 0)::bigint as tickets,
    coalesce(o.cnt, 0)::bigint as orders,
    coalesce(o.sub, 0)::bigint as revenue,   -- ticket price only (no buyer fee)
    coalesce(o.fee, 0)::bigint as fees       -- buyer fee collected
  from public.events e
  left join (select event_id, count(*) cnt from public.tickets group by event_id) t on t.event_id = e.id
  left join (
    select event_id, count(*) cnt, sum(subtotal) sub, sum(fee) fee
    from public.orders where status = 'paid' group by event_id
  ) o on o.event_id = e.id;
$$;
grant execute on function public.event_sales() to anon, authenticated;

create or replace function public.admin_overview()
returns table (paid_revenue bigint, fees bigint, orders bigint, tickets bigint, pending_payouts bigint, pending_amount bigint)
language sql stable security definer set search_path = public as $$
  select
    coalesce((select sum(subtotal) from public.orders where status = 'paid'), 0)::bigint,
    coalesce((select sum(fee)      from public.orders where status = 'paid'), 0)::bigint,
    coalesce((select count(*)      from public.orders where status = 'paid'), 0)::bigint,
    coalesce((select count(*)      from public.tickets), 0)::bigint,
    coalesce((select count(*)      from public.withdrawal_requests where status = 'pending'), 0)::bigint,
    coalesce((select sum(amount)   from public.withdrawal_requests where status = 'pending'), 0)::bigint
  where public.is_admin(auth.uid());
$$;
grant execute on function public.admin_overview() to anon, authenticated;

-- Producer revenue in the admin producer card = ticket price (subtotal) only.
create or replace function public.admin_producers()
returns table (
  id uuid, user_id uuid, name text, company text, email text, phone text, whatsapp text,
  status text, commission_rate int, contract_type text, contract_start date, contract_end date,
  contract_notes text, created_at timestamptz,
  events_count bigint, revenue bigint, tickets bigint, commission bigint, paid_out bigint
) language sql stable security definer set search_path = public as $$
  select p.id, p.user_id, p.name, p.company, p.email, p.phone, p.whatsapp,
         p.status, p.commission_rate, p.contract_type, p.contract_start, p.contract_end,
         p.contract_notes, p.created_at,
         coalesce(ec.cnt, 0)::bigint,
         coalesce(oc.sub, 0)::bigint,
         coalesce(oc.tickets, 0)::bigint,
         round(coalesce(oc.sub, 0) * p.commission_rate / 100.0)::bigint,
         coalesce(po.paid, 0)::bigint
  from public.producer_profiles p
  left join (select producer_id, count(*) cnt from public.events group by producer_id) ec on ec.producer_id = p.id
  left join (
    select e.producer_id, sum(o.subtotal) sub, count(t.id) tickets
    from public.orders o
    join public.events e on e.id = o.event_id
    left join public.tickets t on t.order_id = o.id
    where o.status = 'paid'
    group by e.producer_id
  ) oc on oc.producer_id = p.id
  left join (select user_id, sum(amount) paid from public.withdrawal_requests where status = 'paid' group by user_id) po on po.user_id = p.user_id
  where public.is_admin(auth.uid())
  order by coalesce(oc.sub, 0) desc;
$$;
grant execute on function public.admin_producers() to anon, authenticated;

-- Producer card events table also reflects ticket-only revenue.
create or replace function public.admin_producer_events(p_id uuid)
returns table (event_id text, title text, date text, tickets bigint, revenue bigint)
language sql stable security definer set search_path = public as $$
  select e.id, e.title, e.date,
         coalesce(count(t.id), 0)::bigint,
         coalesce(sum(o.subtotal), 0)::bigint
  from public.events e
  left join public.orders o on o.event_id = e.id and o.status = 'paid'
  left join public.tickets t on t.order_id = o.id
  where e.producer_id = p_id and public.is_admin(auth.uid())
  group by e.id, e.title, e.date
  order by 5 desc;
$$;
grant execute on function public.admin_producer_events(uuid) to anon, authenticated;

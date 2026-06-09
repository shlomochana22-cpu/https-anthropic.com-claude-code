-- 0018_producer_breakdown.sql
-- Per-producer income breakdown for the admin: adds buyer `fees` and `orders`
-- to admin_producers, and fixes the ticket-join double counting (joining
-- tickets multiplied subtotal/fee by the ticket count). Money is summed from
-- orders only; tickets are counted separately. Safe to re-run.

drop function if exists public.admin_producers();

create or replace function public.admin_producers()
returns table (
  id uuid, user_id uuid, name text, company text, email text, phone text, whatsapp text,
  status text, commission_rate int, contract_type text, contract_start date, contract_end date,
  contract_notes text, created_at timestamptz,
  events_count bigint, revenue bigint, tickets bigint, commission bigint, paid_out bigint,
  fees bigint, orders bigint
) language sql stable security definer set search_path = public as $$
  select p.id, p.user_id, p.name, p.company, p.email, p.phone, p.whatsapp,
         p.status, p.commission_rate, p.contract_type, p.contract_start, p.contract_end,
         p.contract_notes, p.created_at,
         coalesce(ec.cnt, 0)::bigint,
         coalesce(oc.sub, 0)::bigint,
         coalesce(tc.cnt, 0)::bigint,
         round(coalesce(oc.sub, 0) * p.commission_rate / 100.0)::bigint,
         coalesce(po.paid, 0)::bigint,
         coalesce(oc.fee, 0)::bigint,
         coalesce(oc.orders, 0)::bigint
  from public.producer_profiles p
  left join (select producer_id, count(*) cnt from public.events group by producer_id) ec on ec.producer_id = p.id
  left join (
    select e.producer_id, sum(o.subtotal) sub, sum(o.fee) fee, count(*) orders
    from public.orders o join public.events e on e.id = o.event_id
    where o.status = 'paid' group by e.producer_id
  ) oc on oc.producer_id = p.id
  left join (
    select e.producer_id, count(t.id) cnt
    from public.tickets t join public.events e on e.id = t.event_id
    group by e.producer_id
  ) tc on tc.producer_id = p.id
  left join (select user_id, sum(amount) paid from public.withdrawal_requests where status = 'paid' group by user_id) po on po.user_id = p.user_id
  where public.is_admin(auth.uid())
  order by coalesce(oc.sub, 0) desc;
$$;
grant execute on function public.admin_producers() to anon, authenticated;

-- Per-event breakdown (revenue from orders only; tickets counted separately).
create or replace function public.admin_producer_events(p_id uuid)
returns table (event_id text, title text, date text, tickets bigint, revenue bigint)
language sql stable security definer set search_path = public as $$
  select e.id, e.title, e.date,
         coalesce((select count(*) from public.tickets t where t.event_id = e.id), 0)::bigint,
         coalesce((select sum(o.subtotal) from public.orders o where o.event_id = e.id and o.status = 'paid'), 0)::bigint
  from public.events e
  where e.producer_id = p_id and public.is_admin(auth.uid())
  order by 5 desc;
$$;
grant execute on function public.admin_producer_events(uuid) to anon, authenticated;

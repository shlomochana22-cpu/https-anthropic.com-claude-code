-- 0016_producers.sql
-- Producer profiles (the admin "customer card"): contact, contract, commission,
-- status. Events gain producer_id so per-producer financials can be computed.
-- Admin SECURITY DEFINER functions expose the cross-tenant producer data only
-- to admins. Safe to re-run.

create table if not exists public.producer_profiles (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid unique references auth.users(id) on delete set null,
  name           text not null default 'מפיק',
  company        text,
  avatar_url     text,
  logo_url       text,
  phone          text,
  email          text,
  whatsapp       text,
  status         text not null default 'active'   check (status in ('active','suspended','blocked')),
  commission_rate int  not null default 10,
  contract_type  text not null default 'standard' check (contract_type in ('standard','vip','special')),
  contract_start date,
  contract_end   date,
  contract_notes text,
  created_at     timestamptz not null default now()
);

alter table public.producer_profiles enable row level security;
drop policy if exists "pp read own" on public.producer_profiles;
create policy "pp read own"   on public.producer_profiles for select using (auth.uid() = user_id);
drop policy if exists "pp insert own" on public.producer_profiles;
create policy "pp insert own" on public.producer_profiles for insert with check (auth.uid() = user_id);
drop policy if exists "pp update own" on public.producer_profiles;
create policy "pp update own" on public.producer_profiles for update using (auth.uid() = user_id);

-- Event ownership.
alter table public.events add column if not exists producer_id uuid references public.producer_profiles(id) on delete set null;
create index if not exists events_producer_idx on public.events(producer_id);

-- Ensure (and return) the current user's producer profile id — used at event
-- creation so events attribute to their owner.
create or replace function public.ensure_my_producer()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if auth.uid() is null then return null; end if;
  select id into v_id from public.producer_profiles where user_id = auth.uid();
  if v_id is null then
    insert into public.producer_profiles (user_id, name, email)
    values (auth.uid(), coalesce((select raw_user_meta_data->>'full_name' from auth.users where id = auth.uid()), 'מפיק'),
            (select email from auth.users where id = auth.uid()))
    returning id into v_id;
  end if;
  return v_id;
end; $$;
grant execute on function public.ensure_my_producer() to authenticated;

-- Admin: producers list with real-time financials.
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
         coalesce(oc.rev, 0)::bigint,
         coalesce(oc.tickets, 0)::bigint,
         round(coalesce(oc.rev, 0) * p.commission_rate / 100.0)::bigint,
         coalesce(po.paid, 0)::bigint
  from public.producer_profiles p
  left join (select producer_id, count(*) cnt from public.events group by producer_id) ec on ec.producer_id = p.id
  left join (
    select e.producer_id, sum(o.total) rev, count(t.id) tickets
    from public.orders o
    join public.events e on e.id = o.event_id
    left join public.tickets t on t.order_id = o.id
    where o.status = 'paid'
    group by e.producer_id
  ) oc on oc.producer_id = p.id
  left join (select user_id, sum(amount) paid from public.withdrawal_requests where status = 'paid' group by user_id) po on po.user_id = p.user_id
  where public.is_admin(auth.uid())
  order by coalesce(oc.rev, 0) desc;
$$;
grant execute on function public.admin_producers() to anon, authenticated;

-- Admin: one producer's events with sales.
create or replace function public.admin_producer_events(p_id uuid)
returns table (event_id text, title text, date text, tickets bigint, revenue bigint)
language sql stable security definer set search_path = public as $$
  select e.id, e.title, e.date,
         coalesce(count(t.id), 0)::bigint,
         coalesce(sum(o.total), 0)::bigint
  from public.events e
  left join public.orders o on o.event_id = e.id and o.status = 'paid'
  left join public.tickets t on t.order_id = o.id
  where e.producer_id = p_id and public.is_admin(auth.uid())
  group by e.id, e.title, e.date
  order by 5 desc;
$$;
grant execute on function public.admin_producer_events(uuid) to anon, authenticated;

-- Admin: update a producer's contract / commission / status / notes.
create or replace function public.admin_update_producer(
  p_id uuid, p_status text default null, p_rate int default null, p_ctype text default null,
  p_cstart date default null, p_cend date default null, p_notes text default null
) returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin(auth.uid()) then raise exception 'not authorized'; end if;
  update public.producer_profiles
     set status         = coalesce(p_status, status),
         commission_rate = coalesce(p_rate, commission_rate),
         contract_type  = coalesce(p_ctype, contract_type),
         contract_start = coalesce(p_cstart, contract_start),
         contract_end   = coalesce(p_cend, contract_end),
         contract_notes = coalesce(p_notes, contract_notes)
   where id = p_id;
end; $$;
grant execute on function public.admin_update_producer(uuid, text, int, text, date, date, text) to anon, authenticated;

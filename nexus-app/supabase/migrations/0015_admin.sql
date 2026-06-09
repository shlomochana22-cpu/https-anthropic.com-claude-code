-- 0015_admin.sql
-- Platform-admin layer. Admins are listed in public.admins; SECURITY DEFINER
-- functions expose cross-tenant data (all payout requests) ONLY to admins, so
-- the admin dashboard works with the anon key without weakening owner-only RLS.
-- Safe to re-run.

create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
drop policy if exists "admins read own" on public.admins;
create policy "admins read own" on public.admins for select using (auth.uid() = user_id);

-- Is the given user a platform admin?
create or replace function public.is_admin(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = uid);
$$;

-- Convenience for the client: am I an admin?
create or replace function public.am_i_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin(auth.uid());
$$;
grant execute on function public.am_i_admin() to anon, authenticated;

-- All payout requests (withdrawals + transfers) — admins only.
create or replace function public.admin_payouts()
returns setof public.withdrawal_requests
language sql stable security definer set search_path = public as $$
  select * from public.withdrawal_requests
  where public.is_admin(auth.uid())
  order by created_at desc;
$$;
grant execute on function public.admin_payouts() to anon, authenticated;

-- Approve / reject / mark-paid a payout and attach a receipt (אסמכתא) — admins only.
create or replace function public.admin_set_payout_status(
  p_id uuid, p_status text, p_receipt text default null, p_note text default null
) returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;
  update public.withdrawal_requests
     set status      = p_status,
         receipt_url = coalesce(nullif(p_receipt, ''), receipt_url),
         admin_note  = coalesce(nullif(p_note, ''), admin_note),
         paid_at     = case when p_status = 'paid' then now() else paid_at end
   where id = p_id;
end;
$$;
grant execute on function public.admin_set_payout_status(uuid, text, text, text) to anon, authenticated;

-- Platform totals for the admin overview (no PII) — admins only.
create or replace function public.admin_overview()
returns table (paid_revenue bigint, orders bigint, tickets bigint, pending_payouts bigint, pending_amount bigint)
language sql stable security definer set search_path = public as $$
  select
    coalesce((select sum(total) from public.orders where status = 'paid'), 0)::bigint,
    coalesce((select count(*) from public.orders where status = 'paid'), 0)::bigint,
    coalesce((select count(*) from public.tickets), 0)::bigint,
    coalesce((select count(*) from public.withdrawal_requests where status = 'pending'), 0)::bigint,
    coalesce((select sum(amount) from public.withdrawal_requests where status = 'pending'), 0)::bigint
  where public.is_admin(auth.uid());
$$;
grant execute on function public.admin_overview() to anon, authenticated;

-- 0013_withdrawals.sql
-- Producer withdrawal requests. The producer submits full bank-transfer details
-- + agrees to the terms; the request lands here with status 'pending'. The
-- platform admin later marks it paid and attaches a receipt (אסמכתא) via
-- receipt_url. Owner-only read; admin tooling will use the service_role key.
-- Safe to re-run.

create table if not exists public.withdrawal_requests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  amount      int  not null,
  holder      text not null,   -- account holder / מוטב
  idnum       text,            -- ת.ז / ח.פ
  bank        text,            -- bank name
  branch      text,            -- branch number
  account     text,            -- account number
  contact     text,            -- phone / email
  status      text not null default 'pending' check (status in ('pending','approved','paid','rejected')),
  receipt_url text,            -- proof of transfer attached by the admin
  admin_note  text,
  created_at  timestamptz not null default now(),
  paid_at     timestamptz
);

create index if not exists withdrawal_user_idx on public.withdrawal_requests(user_id);

alter table public.withdrawal_requests enable row level security;

-- Producer may submit (own row, or guest null pre-auth) and read only their own.
drop policy if exists "wr insert" on public.withdrawal_requests;
create policy "wr insert" on public.withdrawal_requests
  for insert with check (user_id is null or auth.uid() = user_id);

drop policy if exists "wr read own" on public.withdrawal_requests;
create policy "wr read own" on public.withdrawal_requests
  for select using (auth.uid() = user_id);

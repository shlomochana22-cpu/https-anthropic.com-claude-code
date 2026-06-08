-- 0008_coupons.sql
-- Persisted discount coupons for the producer area. Safe to re-run.
-- Open write policies match the current no-auth producer area.

create extension if not exists pgcrypto;

create table if not exists public.coupons (
  id          uuid primary key default gen_random_uuid(),
  code        text not null,
  kind        text not null default 'percent' check (kind in ('percent','flat')),
  amount      int  not null,
  cap         int,                 -- usage limit; null = unlimited
  used        int  not null default 0,
  expires     date,                -- null = no expiry
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.coupons enable row level security;

drop policy if exists "coupons read"   on public.coupons;
create policy "coupons read"   on public.coupons for select using (true);
drop policy if exists "coupons insert" on public.coupons;
create policy "coupons insert" on public.coupons for insert with check (true);
drop policy if exists "coupons update" on public.coupons;
create policy "coupons update" on public.coupons for update using (true) with check (true);
drop policy if exists "coupons delete" on public.coupons;
create policy "coupons delete" on public.coupons for delete using (true);

-- 0003_producer_writes.sql
-- Lets the producer area create & manage events from the app.
-- Migration 0001 enabled RLS but only added SELECT policies, so every
-- event/tier INSERT was being rejected — which is why "create event"
-- looked successful but never actually published.
--
-- Also (re)adds the 0002 columns idempotently in case that migration
-- wasn't applied yet. Safe to run multiple times.
--
-- ⚠️ These write policies are intentionally open (with check (true)) to match
-- the current no-auth producer area. When real producer accounts exist,
-- tighten them to e.g. `with check (auth.uid() = owner_id)`.

-- Columns surfaced on the event page
alter table public.events        add column if not exists description  text;
alter table public.events        add column if not exists age          text;
alter table public.events        add column if not exists age_visible  boolean not null default true;
alter table public.ticket_tiers  add column if not exists benefits     jsonb   not null default '[]'::jsonb;

-- events: allow insert / update / delete
drop policy if exists "events insert" on public.events;
create policy "events insert" on public.events for insert with check (true);
drop policy if exists "events update" on public.events;
create policy "events update" on public.events for update using (true) with check (true);
drop policy if exists "events delete" on public.events;
create policy "events delete" on public.events for delete using (true);

-- ticket_tiers: allow insert / update / delete
drop policy if exists "tiers insert" on public.ticket_tiers;
create policy "tiers insert" on public.ticket_tiers for insert with check (true);
drop policy if exists "tiers update" on public.ticket_tiers;
create policy "tiers update" on public.ticket_tiers for update using (true) with check (true);
drop policy if exists "tiers delete" on public.ticket_tiers;
create policy "tiers delete" on public.ticket_tiers for delete using (true);

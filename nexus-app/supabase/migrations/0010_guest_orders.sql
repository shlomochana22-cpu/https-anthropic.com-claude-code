-- 0010_guest_orders.sql
-- Let purchases persist even when the buyer isn't logged in (guest checkout),
-- so producers see the sale in their dashboards (via event_sales()).
-- 0001 only allowed inserts where auth.uid() = user_id; this also permits
-- guest rows (user_id null). Owner-only READ stays unchanged.
--
-- ⚠️ Mock-checkout stage: orders are created client-side. With real payments,
-- move order creation server-side and tighten this. Safe to re-run.

drop policy if exists "own orders insert" on public.orders;
drop policy if exists "orders insert" on public.orders;
create policy "orders insert" on public.orders
  for insert with check (user_id is null or auth.uid() = user_id);

drop policy if exists "own tickets insert" on public.tickets;
drop policy if exists "tickets insert" on public.tickets;
create policy "tickets insert" on public.tickets
  for insert with check (user_id is null or auth.uid() = user_id);

-- 0020_purchase_realtime.sql
-- Real-time purchase alerts for producers: a producer may read orders for
-- events they own (so Realtime delivers INSERTs), and orders join the realtime
-- publication. Owner/guest read policies stay unchanged. Safe to re-run.

drop policy if exists "orders producer read" on public.orders;
create policy "orders producer read" on public.orders
  for select using (
    exists (
      select 1
      from public.events e
      join public.producer_profiles p on p.id = e.producer_id
      where e.id = orders.event_id and p.user_id = auth.uid()
    )
  );

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
end $$;

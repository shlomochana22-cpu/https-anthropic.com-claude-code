-- 0019_payout_realtime.sql
-- Real-time payout alerts for the admin. Realtime respects RLS, so admins need
-- a SELECT policy on withdrawal_requests to receive INSERT events; and the table
-- must be in the supabase_realtime publication. Safe to re-run.

-- Admins may read all payout requests (consistent with admin_payouts()).
drop policy if exists "wr admin read" on public.withdrawal_requests;
create policy "wr admin read" on public.withdrawal_requests
  for select using (public.is_admin(auth.uid()));

-- Add the table to the realtime publication (idempotent).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'withdrawal_requests'
  ) then
    alter publication supabase_realtime add table public.withdrawal_requests;
  end if;
end $$;

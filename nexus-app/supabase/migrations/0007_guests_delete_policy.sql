-- 0007_guests_delete_policy.sql
-- Lets the producer remove a guest from the list (kebab → מחיקה).
-- 0004 added read/insert/update policies on guests but not delete.
-- Open policy to match the current no-auth producer area. Safe to re-run.

drop policy if exists "guests delete" on public.guests;
create policy "guests delete" on public.guests for delete using (true);

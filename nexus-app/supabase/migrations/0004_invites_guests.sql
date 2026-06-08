-- 0004_invites_guests.sql
-- Free / discounted guest invites with a real one-time link.
--
-- • invites: one row per generated link (token). The producer creates it; the
--   public page reads it; it can only be redeemed ONCE.
-- • guests:  the registered person (manual entry or via a redeemed link).
-- • redeem_invite(): SECURITY DEFINER function that atomically locks the invite
--   and creates the guest — so a link cannot be reused, even from the client.
--
-- Safe to run multiple times.

create extension if not exists pgcrypto;

create table if not exists public.invites (
  token       text primary key,
  event_id    text not null references public.events(id) on delete cascade,
  qty         int  not null default 1 check (qty >= 1),
  type        text not null default 'free' check (type in ('free','discount')),
  status      text not null default 'open' check (status in ('open','used')),
  created_at  timestamptz not null default now(),
  used_at     timestamptz
);

create table if not exists public.guests (
  id           uuid primary key default gen_random_uuid(),
  event_id     text not null references public.events(id) on delete cascade,
  invite_token text references public.invites(token),
  first_name   text not null,
  last_name    text not null,
  phone        text,
  dob          date,
  gender       text,
  entry_type   text not null default 'free' check (entry_type in ('free','discount')),
  qty          int  not null default 1,
  code         text not null default ('NX-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8))),
  source       text not null default 'link' check (source in ('manual','link')),
  status       text not null default 'registered' check (status in ('registered','scanned')),
  created_at   timestamptz not null default now()
);

create index if not exists guests_event_idx on public.guests(event_id);

-- ─────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────
alter table public.invites enable row level security;
alter table public.guests  enable row level security;

-- invites: readable (public page needs event/qty/type) and creatable by the
-- producer area. No UPDATE policy on purpose — the only way to mark an invite
-- 'used' is the redeem_invite() function below, so it cannot be un-used/bypassed.
drop policy if exists "invites read"   on public.invites;
create policy "invites read"   on public.invites for select using (true);
drop policy if exists "invites insert" on public.invites;
create policy "invites insert" on public.invites for insert with check (true);

-- guests: readable by the producer list; insertable for manual entries.
drop policy if exists "guests read"   on public.guests;
create policy "guests read"   on public.guests for select using (true);
drop policy if exists "guests insert" on public.guests;
create policy "guests insert" on public.guests for insert with check (true);
drop policy if exists "guests update" on public.guests;
create policy "guests update" on public.guests for update using (true) with check (true);

-- ─────────────────────────────────────────────────────────────
-- Atomic one-time redemption
-- ─────────────────────────────────────────────────────────────
create or replace function public.redeem_invite(
  p_token  text,
  p_first  text,
  p_last   text,
  p_dob    date,
  p_gender text
) returns table (ok boolean, code text, message text)
language plpgsql security definer set search_path = public as $$
declare
  v_invite public.invites%rowtype;
  v_code   text;
begin
  select * into v_invite from public.invites where token = p_token for update;
  if not found then
    return query select false, null::text, 'הלינק אינו קיים'; return;
  end if;
  if v_invite.status = 'used' then
    return query select false, null::text, 'הלינק כבר נוצל'; return;
  end if;

  v_code := 'NX-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
  insert into public.guests (event_id, invite_token, first_name, last_name, dob, gender, entry_type, qty, code, source)
    values (v_invite.event_id, p_token, p_first, p_last, p_dob, p_gender, v_invite.type, v_invite.qty, v_code, 'link');
  update public.invites set status = 'used', used_at = now() where token = p_token;

  return query select true, v_code, 'נרשמת בהצלחה';
end; $$;

grant execute on function public.redeem_invite(text, text, text, date, text) to anon, authenticated;

-- NEXUS — initial schema (Phase 3)
-- Run in the Supabase SQL editor, or via `supabase db push`.

-- ─────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────

create table if not exists public.events (
  id          text primary key,
  title       text not null,
  subtitle    text,
  venue       text,
  city        text,
  date        text,             -- display string e.g. "24.08"
  time        text,             -- display string e.g. "23:00"
  image       text,
  badge       text,
  genre       text,
  occupancy   int  not null default 0 check (occupancy between 0 and 100),
  from_price  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.ticket_tiers (
  id          uuid primary key default gen_random_uuid(),
  event_id    text not null references public.events(id) on delete cascade,
  slug        text not null,    -- e.g. "regular", "vip"
  name        text not null,
  description text,
  price       int  not null,
  sold_out    boolean not null default false,
  exclusive   boolean not null default false,
  sort_order  int not null default 0,
  unique (event_id, slug)
);

-- mirrors auth.users; created on signup via trigger below
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  avatar_url  text,
  genres      text[] default '{}',
  created_at  timestamptz not null default now()
);

create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  event_id    text not null references public.events(id),
  subtotal    int not null,
  fee         int not null default 15,
  total       int not null,
  status      text not null default 'paid' check (status in ('pending','paid','refunded')),
  created_at  timestamptz not null default now()
);

create table if not exists public.tickets (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  event_id    text not null references public.events(id),
  tier_id     uuid references public.ticket_tiers(id),
  user_id     uuid references auth.users(id) on delete set null,
  qr_code     text not null default encode(gen_random_bytes(12), 'hex'),
  status      text not null default 'valid' check (status in ('valid','scanned','void')),
  scanned_at  timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists tickets_user_idx on public.tickets(user_id);
create index if not exists orders_user_idx  on public.orders(user_id);
create index if not exists tiers_event_idx  on public.ticket_tiers(event_id);

-- ─────────────────────────────────────────────────────────────
-- New-user trigger: copy auth.users into profiles
-- ─────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email,
          new.raw_user_meta_data->>'full_name',
          new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────

alter table public.events       enable row level security;
alter table public.ticket_tiers enable row level security;
alter table public.profiles     enable row level security;
alter table public.orders       enable row level security;
alter table public.tickets      enable row level security;

-- Public catalogue: anyone may read events & tiers
create policy "events are public"  on public.events       for select using (true);
create policy "tiers are public"   on public.ticket_tiers for select using (true);

-- Profiles: a user can see/update only their own row
create policy "own profile read"   on public.profiles for select using (auth.uid() = id);
create policy "own profile write"  on public.profiles for update using (auth.uid() = id);

-- Orders & tickets: owner-only
create policy "own orders read"    on public.orders  for select using (auth.uid() = user_id);
create policy "own orders insert"  on public.orders  for insert with check (auth.uid() = user_id);
create policy "own tickets read"   on public.tickets for select using (auth.uid() = user_id);
create policy "own tickets insert" on public.tickets for insert with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- Seed data (matches lib/events.ts mock)
-- ─────────────────────────────────────────────────────────────

insert into public.events (id, title, subtitle, venue, city, date, time, image, badge, genre, occupancy, from_price) values
  ('electric-night','Electric Night at Block Club','לילה בלתי נשכח במועדון הבלוק','מועדון הבלוק','תל אביב','24.05.24','23:00','https://lh3.googleusercontent.com/aida-public/AB6AXuC1O4Fan1VztsSOvfbIhXajsSec9GmEu_MpVC8Ay_in3OabYFsN4Pq5_TZAUMQ2DqeeaW1LsF2D3zZEKMl_1oQ-1RYt4zF2RA4xzHLBLvL9AhPis8p7WAiKmWJF9UFCLw0rRcjhI7GsKgfC0FmL9qlsn_okfvAsiDN3tSb3nAH88YFIGAaoOESpYSAlPNMTqVPjlXZ66LugA8HEgygOKJ4GaGTaUm_pfAiJp7iDqzOKm4mf42cRpB9UKW2RGz9r6oPFGiHVR0TwZg','Fast Selling','טכנו',85,120),
  ('summer-odyssey','SUMMER ODYSSEY 2024','פסטיבל הטכנו הגדול של הקיץ','האומן 17','תל אביב','24.08','23:00','https://lh3.googleusercontent.com/aida-public/AB6AXuC9BlsJh1ytbzdu948Nc8Sn0VY-Ghf0fkYIoFWbHp2aFnJ00sd35yRN5V-4HLogSecis1WUi9n3fHcxmVyBFHvjwLZ7y2qB4RKS9y7oUPClK2xOt8tNNnjDw9J5zMKnhJsAiqhqEKTYNc505RUcEXlp5X1d1-J5RhNp-GRCerDjjXT3a0k4BRViY4TNsjKMo1F5THcUDwuAyYi0sKtih9OR-44M_SLC0DzjBryx5h6lIWsd9VAze-kyq7BvIRF6fDJZVKHCvaqaOg','TOP PICK','מיינסטרים',72,180),
  ('neon-rooftop','NEON ROOFTOP SESSIONS','מסיבת גג עם נוף לים','גג העיר','חיפה','30.08','22:00','https://lh3.googleusercontent.com/aida-public/AB6AXuAIlzh3o2VP_QjZh01MoZyKagfZFyu3Xi3pComMnjIXI1n8so1N0eVXCz3ig3Ijo-9lnrp4yCY6pq38wUblaZc0FDAc93LosPuezVyfI82-9v7pC1W9XPSjSStgwQC8007ceN55uz6cxD4ufZCbik4-J2bhJxwQHfKuy6OTzr7ch-IuufE2tA5UDKOV-CJ4Eadb0cqsWje3v9kjbok2eqmdsIKorNkSWPPzTiX4E4gq5t9d1gndDz0t7J3lr2aYsv8UE0OIPeHZlg','מכירה אחרונה','פופ',91,120),
  ('secret-forest-rave','SECRET FOREST RAVE','ריב בלב היער, עד הזריחה','יער בן שמן','מרכז','01.09','22:00','https://lh3.googleusercontent.com/aida-public/AB6AXuA5Hjff4EH-F3Sdbz5y4o-3DyDv6jG0pN4rOEg9Xg7ctZdGYb44Zz7XnyRoUT3Sk9Btq2TH8MWl7_93NK_7ufmI6cabBXkvglwP9sV14SIylNZDhtUBNSp5QXZ44LKG_mpFRHuuedcag0MbXMKov5zZ72SwQzIiq6RDo8D5NS9A6yrNz0F7Bu1mD-QhaYT4YHUeEWWi6-DNL_MNALsJST5jPD80G94s_ZTq_EKHe6dvmIUZPdWC_IiWOu4ZfIXFHQiQH1r1kBZ9Gg','מיקום סודי','פסייטראנס',64,90),
  ('industrial-techno','INDUSTRIAL TECHNO NIGHT','טכנו תעשייתי כבד עד הבוקר','מועדון הבלוק','תל אביב','02.09','23:30','https://lh3.googleusercontent.com/aida-public/AB6AXuB3QYWUZ9Wkli9oW7XrIte6wVWldOFyGnnrPwefTnGKayQNRA6sgcxnRTw6lBxKqDbzDcH0BK2Rp8KoA3uNmNkmm_e11Efa6bJkHKwUXKvWqu5eRUUKUbf9M_r7qY5LTnJyYpFlK2HQQ8hD6dDysDpvWszcpE_JkRvQHkFCNLeGT2BkxY1ERrErBUIEMTMa7x868pymI-bfbqpeVutQIegIUTSf9hTawyZFVX0uVAnL9G7jTdzx9nOjDpKqaQWsr0LnmUoru9akBQ','Fast Selling','טכנו',78,150),
  ('pool-vibes-eilat','POOL VIBES: EILAT EDITION','מסיבת בריכה על שפת הים האדום','מלון רויאל','אילת','03.09','14:00','https://lh3.googleusercontent.com/aida-public/AB6AXuAINH71GmXS2WnTmrT0lyQPuH9ZrX1x2j75V5wGowNSTrJeHASXGF144chc3k--crgfN7nSSPzZSSx-14Jf1_jgmVfGeQJF4m9vcpI1g-iOxNtALobYBrLYzQ7Wpb5XOmYnxsR8qi1M_pYWGVyXIpEY3gU61cf7yZ820AkZTzVlxMcTUQODkI0qN4BF_Ukgil9NVTdYhvtpCAx4LhXVmN3wxIIcvEZ_KBma-eh1QyRjHDKhgBAXVSeTZIpolF1Y61z12oPsu94_oQ','TOP PICK','מיינסטרים',55,220)
on conflict (id) do nothing;

insert into public.ticket_tiers (event_id, slug, name, description, price, sold_out, exclusive, sort_order) values
  ('electric-night','early','Early Bird','מכירה מוקדמת - סבב א''',80,true,false,0),
  ('electric-night','regular','Regular Ticket','כניסה רגילה לכל המתחמים',120,false,false,1),
  ('electric-night','vip','VIP Experience','כניסה מהירה + מתחם VIP + דרינק ראשון',250,false,true,2),
  ('summer-odyssey','regular','Regular Ticket','כניסה רגילה',180,false,false,0),
  ('summer-odyssey','vip','VIP','מתחם VIP',320,false,true,1),
  ('neon-rooftop','regular','Regular Ticket','כניסה רגילה',120,false,false,0),
  ('secret-forest-rave','regular','כניסה רגילה','כולל חניה',90,false,false,0),
  ('secret-forest-rave','transport','כרטיס + הסעה','הסעות מהמרכז',140,false,true,1),
  ('industrial-techno','regular','Regular','כניסה רגילה',150,false,false,0),
  ('industrial-techno','vip','VIP Bunker','מתחם VIP + בר פתוח שעה',290,false,true,1),
  ('pool-vibes-eilat','regular','כניסה לבריכה','כולל מגבת',220,false,false,0),
  ('pool-vibes-eilat','cabana','Cabana VIP','קבנה פרטית + שירות',480,false,true,1)
on conflict (event_id, slug) do nothing;

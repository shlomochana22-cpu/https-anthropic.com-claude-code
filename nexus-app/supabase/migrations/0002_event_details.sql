-- 0002_event_details.sql
-- Adds producer-authored event details surfaced on the customer event page:
--   • events.description     — the "סיפור האירוע" narrative (incl. AI-written copy)
--   • events.age             — minimum entry age (e.g. "18+")
--   • events.age_visible     — whether to show the age on the public page
--   • ticket_tiers.benefits  — list of VIP perks (standard + custom free-text)
-- Idempotent: safe to run multiple times.

alter table public.events        add column if not exists description  text;
alter table public.events        add column if not exists age          text;
alter table public.events        add column if not exists age_visible  boolean not null default true;
alter table public.ticket_tiers  add column if not exists benefits     jsonb   not null default '[]'::jsonb;

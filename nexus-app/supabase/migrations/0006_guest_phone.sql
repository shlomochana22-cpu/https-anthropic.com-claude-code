-- 0006_guest_phone.sql
-- Adds a phone number to guests + threads it through redeem_invite().
-- Safe to run multiple times.

alter table public.guests add column if not exists phone text;

-- The signature changes (adds p_phone), so drop the old one first.
drop function if exists public.redeem_invite(text, text, text, date, text);

create or replace function public.redeem_invite(
  p_token  text,
  p_first  text,
  p_last   text,
  p_phone  text,
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
  insert into public.guests (event_id, invite_token, first_name, last_name, phone, dob, gender, entry_type, qty, code, source)
    values (v_invite.event_id, p_token, p_first, p_last, p_phone, p_dob, p_gender, v_invite.type, v_invite.qty, v_code, 'link');
  update public.invites set status = 'used', used_at = now() where token = p_token;

  return query select true, v_code, 'נרשמת בהצלחה';
end; $$;

grant execute on function public.redeem_invite(text, text, text, text, date, text) to anon, authenticated;

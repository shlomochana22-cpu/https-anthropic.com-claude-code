-- 0014_payout_kind.sql
-- withdrawal_requests now also carries producer transfers (to friend / promoter
-- / supplier), not just self-withdrawals. `kind` distinguishes them; `holder`
-- holds the recipient's account holder for transfers. Safe to re-run.

alter table public.withdrawal_requests
  add column if not exists kind text not null default 'withdrawal';

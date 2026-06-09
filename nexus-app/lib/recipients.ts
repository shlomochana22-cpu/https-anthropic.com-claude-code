"use client";

import type { PayoutKind } from "./withdrawals";

export type Recipient = {
  kind: PayoutKind;
  holder: string;
  idnum: string;
  bank: string;
  branch: string;
  account: string;
  contact?: string;
};

const KEY = "nexus_recipients";

/** Saved transfer recipients so repeat payouts only need an amount + terms. */
export function getRecipients(kind?: PayoutKind): Recipient[] {
  if (typeof window === "undefined") return [];
  try {
    const all = JSON.parse(localStorage.getItem(KEY) || "[]") as Recipient[];
    return kind ? all.filter((r) => r.kind === kind) : all;
  } catch {
    return [];
  }
}

/** Upserts a recipient (deduped by kind + branch + account). Returns the list. */
export function saveRecipient(r: Recipient): Recipient[] {
  if (typeof window === "undefined") return [];
  const all = getRecipients();
  const sig = (x: Recipient) => `${x.kind}|${x.branch}|${x.account}`;
  const next = [r, ...all.filter((x) => sig(x) !== sig(r))].slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

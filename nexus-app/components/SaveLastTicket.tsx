"use client";

import { useEffect } from "react";

export type StoredTicket = { id: string; eventTitle: string; date: string; time: string; tier: string; qty: number; code: string };

/** Persists the just-purchased ticket to localStorage so guests (not logged in)
 *  can see their real ticket in 'הכרטיסים שלי'. Renders nothing. */
export function SaveLastTicket(t: Omit<StoredTicket, "id">) {
  useEffect(() => {
    if (!t.code) return;
    try {
      const raw = localStorage.getItem("nexus_tickets");
      const list: StoredTicket[] = raw ? JSON.parse(raw) : [];
      if (!list.some((x) => x.code === t.code)) {
        list.unshift({ id: t.code, ...t });
        localStorage.setItem("nexus_tickets", JSON.stringify(list.slice(0, 20)));
      }
    } catch {
      /* ignore storage errors */
    }
  }, [t.code, t.eventTitle, t.date, t.time, t.tier, t.qty]);
  return null;
}

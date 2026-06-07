"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import type { NexusEvent } from "@/lib/events";

const NAMES = [
  "איתי לוי", "דנה כהן", "נועם אברהם", "שירה פרץ", "יואב מזרחי", "טל ביטון",
  "רוני דהן", "עומר שלום", "ליהי אבני", "גיא רוזן", "מאיה לוין", "אורי גל",
];
const STATUSES = ["Approved", "Scanned", "Pending"] as const;
const TONES: Record<string, string> = { Approved: "primary", Scanned: "cyan", Pending: "error" };

// Deterministic per-event guest derivation so each event shows its own list.
function guestsFor(event: NexusEvent) {
  const seed = event.id.length + Math.round(event.occupancy);
  const count = 6 + (seed % 6);
  return Array.from({ length: count }, (_, i) => {
    const name = NAMES[(seed + i) % NAMES.length];
    const status = STATUSES[(seed + i) % STATUSES.length];
    const tier = i % 4 === 0 ? "מוזמן VIP" : i % 3 === 0 ? "מוזמן הפקה" : "רשימה רגילה";
    const phone = `05${(2 + (i % 6))}-${String(1000000 + ((seed * 7919 + i * 31) % 8999999)).slice(0, 7)}`;
    return { initial: name[0], name, phone: `${phone} • ${tier}`, status, tone: TONES[status] };
  });
}

export function GuestManager({ events }: { events: NexusEvent[] }) {
  const [activeId, setActiveId] = useState(events[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const event = events.find((e) => e.id === activeId) ?? events[0];

  const guests = useMemo(() => (event ? guestsFor(event) : []), [event]);
  const filtered = guests.filter((g) => g.name.includes(query) || g.phone.includes(query));

  const stats = useMemo(() => {
    const total = guests.length;
    const approved = guests.filter((g) => g.status === "Approved").length;
    const scanned = guests.filter((g) => g.status === "Scanned").length;
    const pending = guests.filter((g) => g.status === "Pending").length;
    return [
      { label: "סך הכל מוזמנים", value: String(total), tone: "text-white" },
      { label: "אושרו", value: String(approved), tone: "text-primary-fixed" },
      { label: "נסרקו בקופה", value: String(scanned), tone: "text-secondary-fixed" },
      { label: "ממתינים", value: String(pending), tone: "text-error" },
    ];
  }, [guests]);

  if (!event) {
    return (
      <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop">
        <h2 className="text-headline-lg-mobile text-primary-fixed mb-1">ניהול רשימות מוזמנים</h2>
        <p className="text-on-surface-variant/80">אין אירועים עדיין — צרו אירוע כדי לנהל רשימת מוזמנים.</p>
      </main>
    );
  }

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop">
      <h2 className="text-headline-lg-mobile text-primary-fixed mb-1">ניהול רשימות מוזמנים</h2>
      <p className="text-on-surface-variant/80 mb-md">בחרו אירוע כדי לנהל את רשימת המוזמנים שלו · {events.length} אירועים</p>

      {/* Event selector — all the producer's events */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-lg">
        {events.map((e) => {
          const on = e.id === activeId;
          return (
            <button
              key={e.id}
              onClick={() => setActiveId(e.id)}
              className={`shrink-0 px-4 py-2.5 rounded-xl border text-right transition-all ${on ? "border-primary-fixed bg-primary-container/15" : "border-white/10 bg-white/5 hover:border-primary-fixed/40"}`}
            >
              <p className={`text-label-md ${on ? "text-primary-fixed font-bold" : "text-on-surface"}`}>{e.title}</p>
              <p className="text-[10px] text-on-surface-variant">{e.date} • {e.occupancy}% נמכר</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-lg">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-md rounded-xl flex flex-col justify-between">
            <span className="text-label-sm text-on-surface-variant">{s.label}</span>
            <span className={`text-headline-md mt-1 ${s.tone}`}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="relative mb-md">
        <Icon name="search" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full glass border border-white/10 rounded-xl py-3 pr-12 pl-4 text-on-surface focus:border-primary-fixed outline-none" placeholder="חיפוש לפי שם, טלפון או קוד..." />
      </div>

      <div className="space-y-gutter">
        {filtered.map((g, i) => (
          <div key={`${g.name}-${i}`} className={`glass-card p-md rounded-xl flex items-center justify-between ${g.tone === "error" ? "border-error/20" : ""}`}>
            <div className="flex items-center gap-md">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl ${
                g.tone === "error" ? "bg-error-container/40 text-error" : "bg-gradient-to-br from-primary-fixed to-secondary-fixed text-on-primary-fixed"
              }`}>
                {g.initial}
              </div>
              <div className="flex flex-col">
                <span className="text-label-md text-white">{g.name}</span>
                <span className="text-label-sm text-on-surface-variant">{g.phone}</span>
              </div>
            </div>
            <div className="flex items-center gap-md">
              <span className={`px-3 py-1 rounded-lg text-label-sm border ${
                g.tone === "primary" ? "bg-primary-container/20 text-primary-fixed border-primary-fixed/30"
                : g.tone === "cyan" ? "bg-secondary-fixed/10 text-secondary-fixed border-secondary-fixed/30"
                : "bg-error-container/20 text-error border-error/30"
              }`}>{g.status}</span>
              <button className="text-on-surface-variant hover:text-white transition-colors"><Icon name="more_vert" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-on-surface-variant/60 py-8">לא נמצאו מוזמנים תואמים</p>}
      </div>

      <button className="fixed bottom-24 left-6 md:bottom-8 w-16 h-16 bg-primary-fixed text-on-primary-fixed rounded-full shadow-neon-primary flex items-center justify-center active:scale-90 transition-all z-50">
        <Icon name="person_add" className="text-[32px]" />
      </button>
    </main>
  );
}

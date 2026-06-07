"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "./Icon";
import type { NexusEvent } from "@/lib/events";

export function EventDetail({ event }: { event: NexusEvent }) {
  const router = useRouter();
  const [qty, setQty] = useState<Record<string, number>>(
    Object.fromEntries(event.tiers.map((t) => [t.id, t.id === "regular" ? 1 : 0]))
  );

  const total = useMemo(
    () => event.tiers.reduce((sum, t) => sum + (qty[t.id] || 0) * t.price, 0),
    [qty, event.tiers]
  );
  const count = Object.values(qty).reduce((a, b) => a + b, 0);

  const setTier = (id: string, delta: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] || 0) + delta) }));

  return (
    <>
      <main className="pt-16 pb-32">
        {/* Hero */}
        <section className="relative w-full h-[360px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="w-full h-full object-cover" src={event.image} alt={event.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 w-full px-margin-mobile pb-sm">
            {event.badge && (
              <span className="bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {event.badge}
              </span>
            )}
            <h1 className="text-headline-lg-mobile text-primary drop-shadow-md mt-1">
              {event.title}
            </h1>
          </div>
        </section>

        {/* Quick info */}
        <section className="px-margin-mobile mt-md grid grid-cols-3 gap-sm">
          {[
            { icon: "calendar_today", label: "תאריך", value: event.date },
            { icon: "schedule", label: "שעה", value: event.time },
            { icon: "location_on", label: "מיקום", value: event.city },
          ].map((it) => (
            <div key={it.label} className="glass-card rounded-xl p-sm flex flex-col items-center text-center">
              <Icon name={it.icon} className="text-primary-fixed-dim mb-1" />
              <span className="text-label-sm opacity-60">{it.label}</span>
              <span className="text-label-md">{it.value}</span>
            </div>
          ))}
        </section>

        {/* Live + map shortcuts */}
        <section className="px-margin-mobile mt-md grid grid-cols-2 gap-sm">
          <Link href={`/events/${event.id}/live`} className="glass-card rounded-xl p-sm flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
            <span className="w-2 h-2 bg-error rounded-full animate-pulse" />
            <span className="text-label-md text-error font-bold">עדכונים חיים</span>
          </Link>
          <Link href={`/events/${event.id}/map`} className="glass-card rounded-xl p-sm flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
            <Icon name="map" className="text-primary-fixed" />
            <span className="text-label-md text-primary-fixed">מפת המתחם</span>
          </Link>
        </section>

        {/* Occupancy */}
        <section className="px-margin-mobile mt-md">
          <div className="glass-card rounded-2xl p-md">
            <div className="flex justify-between items-center mb-sm">
              <div className="flex items-center gap-2">
                <Icon name="group" className="text-primary-container" fill />
                <h3 className="text-[18px]">מד תפוסה</h3>
              </div>
              <span className="text-primary-container font-bold text-lg">{event.occupancy}%</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-container shadow-[0_0_15px_#bff520]"
                style={{ width: `${event.occupancy}%` }}
              />
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section className="px-margin-mobile mt-lg">
          <h3 className="text-headline-md text-primary mb-md">סוגי כרטיסים</h3>
          <div className="space-y-sm">
            {event.tiers.map((t) => (
              <div
                key={t.id}
                className={`glass-card rounded-2xl p-md border-white/10 ${
                  t.soldOut ? "opacity-50 grayscale" : ""
                } ${t.exclusive ? "border-primary-container/40" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`text-[20px] ${t.exclusive ? "text-primary-container" : "text-white"}`}>
                      {t.name}
                    </h4>
                    <p className="text-label-sm text-white/60">{t.description}</p>
                  </div>
                  <span className="text-[20px]">₪{t.price}</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  {t.soldOut ? (
                    <span className="text-error font-bold uppercase text-[10px] tracking-widest border border-error px-2 py-0.5 rounded">
                      Sold Out
                    </span>
                  ) : (
                    <span className="text-secondary-fixed-dim text-[11px] font-bold">זמין כעת</span>
                  )}
                  <div className="flex items-center gap-4">
                    <button
                      disabled={t.soldOut}
                      onClick={() => setTier(t.id, -1)}
                      className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center active:scale-90 transition-transform disabled:opacity-30"
                    >
                      <Icon name="remove" />
                    </button>
                    <span className="font-bold text-lg w-4 text-center">{qty[t.id] || 0}</span>
                    <button
                      disabled={t.soldOut}
                      onClick={() => setTier(t.id, 1)}
                      className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center active:scale-90 transition-transform disabled:opacity-30"
                    >
                      <Icon name="add" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky buy bar */}
      <div className="fixed bottom-0 left-0 w-full z-[60]">
        <div className="bg-surface-container-lowest/90 backdrop-blur-2xl px-margin-mobile py-4 border-t border-white/5 shadow-[0_-8px_24px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between gap-md max-w-lg mx-auto">
            <div className="flex flex-col">
              <span className="text-label-sm opacity-60">סה"כ לתשלום</span>
              <span className="text-headline-md font-bold text-primary">₪{total}</span>
            </div>
            <button
              disabled={count === 0}
              onClick={() => {
                const items = event.tiers
                  .filter((t) => (qty[t.id] || 0) > 0)
                  .map((t) => `${t.id}:${qty[t.id]}`)
                  .join(",");
                router.push(`/checkout?event=${event.id}&total=${total}&items=${items}`);
              }}
              className="flex-1 bg-primary-container text-on-primary-container h-14 rounded-xl text-[18px] flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 transition-all disabled:opacity-40"
            >
              רכישה מהירה <Icon name="bolt" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

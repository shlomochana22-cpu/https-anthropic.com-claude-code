"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import type { NexusEvent } from "@/lib/events";

type Producer = { name: string; on: boolean; verified?: boolean };

export function FavoritesView({ events }: { events: NexusEvent[] }) {
  const [producers, setProducers] = useState<Producer[]>([
    { name: "Space Echo", on: true, verified: true },
    { name: "Cyber Riff", on: false },
    { name: "The Haunt", on: true },
  ]);
  const [toast, setToast] = useState(false);

  const toggle = (name: string) => setProducers((p) => p.map((x) => (x.name === name ? { ...x, on: !x.on } : x)));

  return (
    <main className="pt-20 pb-32 px-margin-mobile max-w-2xl mx-auto space-y-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-lg-mobile text-primary tracking-tight">המועדפים שלי</h2>
          <p className="text-on-surface-variant opacity-70">נבחרו במיוחד עבורך</p>
        </div>
        <Icon name="tune" className="text-primary-fixed" />
      </div>

      {/* Followed producers */}
      <section className="space-y-md">
        <div className="flex items-center justify-between">
          <h3 className="text-label-md uppercase tracking-widest text-on-surface-variant">מפיקים במעקב</h3>
          <Link href="/" className="text-primary-fixed text-label-sm hover:underline">הצג הכל</Link>
        </div>
        <div className="flex overflow-x-auto gap-gutter pb-4 hide-scrollbar -mx-2 px-2">
          {producers.map((p) => (
            <div key={p.name} className="flex-shrink-0 w-44 glass-card p-md rounded-xl space-y-sm text-center">
              <div className="relative inline-block">
                <div className={`w-20 h-20 rounded-full mx-auto bg-surface-container-highest flex items-center justify-center border-2 ${p.on ? "border-primary-fixed/40 shadow-neon-primary" : "border-primary-fixed/10"}`}>
                  <Icon name="album" className="text-primary-fixed text-3xl" />
                </div>
                {p.verified && (
                  <div className="absolute -bottom-1 -left-1 bg-primary-fixed text-black rounded-full p-0.5 border-2 border-background">
                    <Icon name="verified" className="text-[16px] block" fill />
                  </div>
                )}
              </div>
              <div>
                <p className="text-label-md text-primary">{p.name}</p>
                <span className={`text-[10px] font-bold uppercase ${p.on ? "text-primary-fixed" : "text-on-surface-variant/50"}`}>{p.on ? "עוקב" : "לא עוקב"}</span>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button onClick={() => toggle(p.name)} className={`w-9 h-5 rounded-full relative transition-colors ${p.on ? "bg-primary-fixed" : "bg-surface-container-highest"}`} aria-label="עקוב/בטל מעקב">
                  <span className={`absolute top-[2px] w-4 h-4 bg-white rounded-full transition-all ${p.on ? "right-[2px]" : "right-4"}`} />
                </button>
                <Icon name="notifications" className={`text-sm ${p.on ? "text-primary-fixed/60" : "text-on-surface-variant/40"}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-md">
        <h3 className="text-label-md uppercase tracking-widest text-on-surface-variant">אירועים שאהבתי</h3>
        <div className="grid grid-cols-2 gap-gutter">
          {events.map((e) => (
            <Link key={e.id} href={`/events/${e.id}`} className="group relative bg-surface-container rounded-xl overflow-hidden border border-white/5 transition-transform active:scale-95">
              <div className="h-40 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={e.image} alt={e.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-primary-fixed shadow-neon-primary">
                  <Icon name="favorite" className="text-[18px]" fill />
                </div>
              </div>
              <div className="p-sm space-y-xs text-right">
                <p className="text-label-md text-primary truncate">{e.title}</p>
                <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
                  <Icon name="calendar_today" className="text-[12px]" />
                  <span>{e.date} • {e.city}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-primary-fixed font-bold text-label-sm">₪{e.fromPrice}</span>
                  <span className="bg-primary-fixed/10 text-primary-fixed px-2 py-0.5 rounded text-[10px] font-bold">{e.badge ?? "זמין"}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Nexus Pass upsell */}
      <button onClick={() => { setToast(true); setTimeout(() => setToast(false), 2500); }} className="w-full text-right glass-card p-md rounded-2xl flex items-center gap-4 relative overflow-hidden group">
        <div className="flex-1 space-y-1 z-10">
          <p className="text-headline-md font-bold text-primary">נקסוס פאס</p>
          <p className="text-on-surface-variant text-label-sm">פתיחת גישה ללא הגבלה לאירועים סודיים וכניסה מועדפת.</p>
          <div className="pt-2 flex items-center text-primary-fixed font-bold text-sm">
            <Icon name="arrow_back" className="mr-1" /> שדרגו עכשיו
          </div>
        </div>
        <div className="w-20 h-20 bg-primary-fixed/20 rounded-xl flex items-center justify-center shrink-0 group-hover:-rotate-12 transition-transform">
          <Icon name="stars" className="text-4xl text-primary-fixed" fill />
        </div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-primary-fixed/20 blur-[60px] rounded-full" />
      </button>

      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[90] glass-card border border-primary-fixed/30 rounded-full px-5 py-3 flex items-center gap-2 shadow-neon-primary">
          <Icon name="stars" className="text-primary-fixed" fill />
          <span className="text-on-surface text-label-md">נקסוס פאס יושק בקרוב 🎉</span>
        </div>
      )}
    </main>
  );
}

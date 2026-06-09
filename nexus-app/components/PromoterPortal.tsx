"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import type { NexusEvent } from "@/lib/events";

const DAYS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

/**
 * Public, promoter-facing portal opened from the approval link.
 * Shows the promoter's sales status, graph, events and personal links —
 * deliberately WITHOUT any commission / earnings figures.
 */
export function PromoterPortal({ name, events }: { name: string; events: NexusEvent[] }) {
  const [approved, setApproved] = useState(false);

  const seed = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const tickets = 20 + (seed % 60);
  const customers = tickets + (seed % 15);
  const salesValue = tickets * (110 + (seed % 40));
  const conversion = 6 + (seed % 6);
  const week = DAYS.map((_, i) => 25 + ((seed * (i + 3)) % 75));
  const myEvents = events.slice(0, 4);

  return (
    <main className="min-h-screen pb-16">
      {/* Header */}
      <header className="px-margin-mobile pt-10 pb-6 bg-gradient-to-b from-primary-fixed/10 to-transparent">
        <Link href="/" className="block mb-6">
          <span className="text-headline-md font-extrabold tracking-tighter text-primary-fixed neon-text">NEXUS</span>
          <span className="text-on-surface-variant text-xs"> · פורטל יחצן</span>
        </Link>
        <p className="text-on-surface-variant text-label-md">שלום,</p>
        <h1 className="text-headline-xl text-primary-fixed">{name} 👋</h1>
      </header>

      {/* Approval banner */}
      <section className="px-margin-mobile -mt-2 mb-lg">
        {approved ? (
          <div className="glass-card rounded-xl p-4 flex items-center gap-3 border border-primary-fixed/30">
            <Icon name="verified" className="text-primary-fixed" fill />
            <p className="text-on-surface">הצטרפת לצוות! הלינקים האישיים שלך פעילים — קדימה למכור 🚀</p>
          </div>
        ) : (
          <div className="glass-card rounded-xl p-4 border border-secondary-fixed/30">
            <p className="text-on-surface mb-3">הוזמנת להצטרף כיחצן/ית של ההפקה. אשרו כדי להפעיל את הלינקים האישיים שלכם.</p>
            <button onClick={() => setApproved(true)} className="w-full bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 transition-all">
              <Icon name="how_to_reg" /> אשר הצטרפות לצוות
            </button>
          </div>
        )}
      </section>

      {/* Sales status — no commissions */}
      <section className="px-margin-mobile mb-lg">
        <h2 className="text-headline-md text-primary mb-md">סטטוס המכירות שלי</h2>
        <div className="grid grid-cols-3 gap-sm">
          <div className="glass-card p-md rounded-xl text-center">
            <Icon name="confirmation_number" className="text-primary-fixed mb-1" />
            <p className="text-headline-md text-primary">{tickets}</p>
            <p className="text-label-sm text-on-surface-variant">כרטיסים שמכרת</p>
          </div>
          <div className="glass-card p-md rounded-xl text-center">
            <Icon name="group" className="text-secondary-fixed mb-1" />
            <p className="text-headline-md text-secondary-fixed">{customers}</p>
            <p className="text-label-sm text-on-surface-variant">לקוחות שהבאת</p>
          </div>
          <div className="glass-card p-md rounded-xl text-center">
            <Icon name="trending_up" className="text-tertiary-fixed-dim mb-1" />
            <p className="text-headline-md text-tertiary-fixed-dim">{conversion}%</p>
            <p className="text-label-sm text-on-surface-variant">יחס המרה</p>
          </div>
        </div>
        <div className="glass-card p-md rounded-xl mt-sm flex items-center justify-between">
          <span className="text-label-md text-on-surface-variant">שווי המכירות שהבאת</span>
          <span className="text-headline-md text-primary">₪{salesValue.toLocaleString()}</span>
        </div>
      </section>

      {/* Sales graph */}
      <section className="px-margin-mobile mb-lg">
        <h2 className="text-headline-md text-primary mb-md">מכירות השבוע</h2>
        <div className="glass-card p-md rounded-xl">
          <div className="flex items-end gap-2 h-36">
            {week.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary-fixed/20 rounded-t relative overflow-hidden" style={{ height: `${h}%` }}>
                  <div className="absolute inset-x-0 bottom-0 bg-primary-fixed" style={{ height: "100%" }} />
                </div>
                <span className="text-[10px] text-on-surface-variant">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events they work on + personal links */}
      <section className="px-margin-mobile">
        <h2 className="text-headline-md text-primary mb-md">האירועים שאני עובד עליהם</h2>
        <div className="space-y-md">
          {myEvents.map((e) => (
            <div key={e.id} className="glass-card rounded-xl overflow-hidden">
              <div className="h-28 w-full relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img loading="lazy" className="w-full h-full object-cover opacity-70" src={e.image} alt={e.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent" />
                <h3 className="absolute bottom-2 right-3 text-[18px] text-primary drop-shadow">{e.title}</h3>
              </div>
              <div className="p-md">
                <p className="text-on-surface-variant text-label-sm mb-3">{e.venue}, {e.city} • {e.date}</p>
                <CopyLinkButton eventId={e.id} promoter={name} />
              </div>
            </div>
          ))}
          {myEvents.length === 0 && <p className="text-center text-on-surface-variant/60 py-8">עדיין אין אירועים פעילים</p>}
        </div>
      </section>
    </main>
  );
}

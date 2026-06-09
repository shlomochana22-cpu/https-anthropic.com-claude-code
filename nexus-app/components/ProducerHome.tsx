"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { getMyEvents } from "@/lib/myEvents";
import { getEventSales, type EventSales } from "@/lib/queries";
import { aggregateMetrics, shekel, type AggMetrics } from "@/lib/metrics";
import type { NexusEvent } from "@/lib/events";

/** Dashboard home: KPI cards + the producer's own events — loaded once. */
export function ProducerHome() {
  const [events, setEvents] = useState<NexusEvent[] | null>(null);
  const [agg, setAgg] = useState<AggMetrics | null>(null);

  useEffect(() => {
    (async () => {
      const [evs, sales] = await Promise.all([getMyEvents(), getEventSales()]);
      const scoped: Record<string, EventSales> = {};
      for (const e of evs) if (sales[e.id]) scoped[e.id] = sales[e.id];
      setEvents(evs);
      setAgg(aggregateMetrics(evs, scoped));
    })();
  }, []);

  const a = agg ?? ({ revenue: 0, sold: 0, orders: 0, occupancy: 0, anyReal: false } as AggMetrics);
  const ready = agg !== null;
  const val = (s: string) => (ready ? s : "…");

  return (
    <>
      <div className="grid grid-cols-2 gap-sm mb-lg">
        <Link href="/producer/stats" className="glass-card p-3 rounded-xl shadow-neon-primary">
          <div className="flex justify-between items-center mb-1">
            <Icon name="payments" className="text-primary-fixed-dim bg-primary-fixed-dim/10 p-1.5 rounded-lg text-[18px]" />
            <span className="text-[10px] text-primary-fixed-dim bg-primary-fixed-dim/20 px-1.5 py-0.5 rounded-full">{a.anyReal ? "LIVE" : "הערכה"}</span>
          </div>
          <p className="text-label-sm text-on-surface-variant">סך הכנסות</p>
          <p className="text-headline-md text-primary">{val(shekel(a.revenue))}</p>
        </Link>
        <Link href="/producer/events" className="glass-card p-3 rounded-xl">
          <Icon name="confirmation_number" className="text-secondary-fixed-dim bg-secondary-fixed-dim/10 p-1.5 rounded-lg mb-1 inline-block text-[18px]" />
          <p className="text-label-sm text-on-surface-variant">כרטיסים שנמכרו</p>
          <p className="text-headline-md text-primary">{val(a.sold.toLocaleString())}</p>
        </Link>
        <Link href="/producer/stats" className="glass-card p-3 rounded-xl">
          <Icon name="receipt_long" className="text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 p-1.5 rounded-lg mb-1 inline-block text-[18px]" />
          <p className="text-label-sm text-on-surface-variant">הזמנות</p>
          <p className="text-headline-md text-primary">{val(a.orders.toLocaleString())}</p>
        </Link>
        <Link href="/producer/events" className="glass-card p-3 rounded-xl">
          <Icon name="event_seat" className="text-primary-fixed bg-primary-fixed/10 p-1.5 rounded-lg mb-1 inline-block text-[18px]" />
          <p className="text-label-sm text-on-surface-variant">{events?.length ?? 0} אירועים שלך</p>
          <p className="text-headline-md text-primary">{val(`${a.occupancy}%`)}</p>
        </Link>
      </div>

      <div className="mb-lg">
        <div className="flex justify-between items-center mb-md">
          <h3 className="text-headline-md text-primary">האירועים שלך</h3>
          <Link href="/producer/events" className="text-label-md text-primary-fixed hover:underline">הצג הכל</Link>
        </div>
        {events === null ? (
          <div className="text-center py-8 text-on-surface-variant"><Icon name="progress_activity" className="animate-spin text-primary-fixed text-2xl" /></div>
        ) : events.length === 0 ? (
          <Link href="/producer/create" className="glass-card rounded-xl p-md flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary-fixed border border-dashed border-white/10 transition-colors">
            <Icon name="add_circle" className="text-primary-fixed" /> עדיין אין לך אירועים — צור אירוע ראשון
          </Link>
        ) : (
          <div className="space-y-sm">
            {events.map((e) => (
              <Link key={e.id} href={`/producer/events/${e.id}`} className="glass-card rounded-xl p-sm flex items-center gap-md hover:bg-white/5 transition-all border border-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img loading="lazy" className="w-16 h-16 rounded-lg object-cover" src={e.image} alt={e.title} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-label-md text-primary truncate">{e.title}</h4>
                  <p className="text-label-sm text-on-surface-variant">{e.venue} • {e.date}</p>
                </div>
                <Icon name="chevron_left" className="text-on-surface-variant/40" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

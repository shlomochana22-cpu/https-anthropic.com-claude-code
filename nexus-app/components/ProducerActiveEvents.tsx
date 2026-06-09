"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { getMyEvents } from "@/lib/myEvents";
import type { NexusEvent } from "@/lib/events";

/** The producer's own events list on the dashboard (scoped to them). */
export function ProducerActiveEvents() {
  const [events, setEvents] = useState<NexusEvent[] | null>(null);
  useEffect(() => { getMyEvents().then(setEvents); }, []);

  return (
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
                <div className="flex items-center gap-xs mt-1">
                  <div className="h-1.5 w-32 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary-fixed" style={{ width: `${e.occupancy}%` }} />
                  </div>
                  <span className="text-[10px] text-primary-fixed font-bold">{e.occupancy}% נמכר</span>
                </div>
              </div>
              <Icon name="chevron_left" className="text-on-surface-variant/40" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

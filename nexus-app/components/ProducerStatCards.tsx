"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { getMyEvents } from "@/lib/myEvents";
import { getEventSales, type EventSales } from "@/lib/queries";
import { aggregateMetrics, shekel, type AggMetrics } from "@/lib/metrics";

/** Dashboard KPI cards scoped to the signed-in producer's own events (real data). */
export function ProducerStatCards() {
  const [agg, setAgg] = useState<AggMetrics | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    (async () => {
      const [events, sales] = await Promise.all([getMyEvents(), getEventSales()]);
      const scoped: Record<string, EventSales> = {};
      for (const e of events) if (sales[e.id]) scoped[e.id] = sales[e.id];
      setCount(events.length);
      setAgg(aggregateMetrics(events, scoped));
    })();
  }, []);

  const a = agg ?? { revenue: 0, sold: 0, orders: 0, occupancy: 0, anyReal: false } as AggMetrics;

  return (
    <div className="grid grid-cols-2 gap-sm mb-lg">
      <Link href="/producer/stats" className="glass-card p-3 rounded-xl shadow-neon-primary">
        <div className="flex justify-between items-center mb-1">
          <Icon name="payments" className="text-primary-fixed-dim bg-primary-fixed-dim/10 p-1.5 rounded-lg text-[18px]" />
          <span className="text-[10px] text-primary-fixed-dim bg-primary-fixed-dim/20 px-1.5 py-0.5 rounded-full">{a.anyReal ? "LIVE" : "הערכה"}</span>
        </div>
        <p className="text-label-sm text-on-surface-variant">סך הכנסות</p>
        <p className="text-headline-md text-primary">{agg ? shekel(a.revenue) : "…"}</p>
      </Link>
      <Link href="/producer/events" className="glass-card p-3 rounded-xl">
        <Icon name="confirmation_number" className="text-secondary-fixed-dim bg-secondary-fixed-dim/10 p-1.5 rounded-lg mb-1 inline-block text-[18px]" />
        <p className="text-label-sm text-on-surface-variant">כרטיסים שנמכרו</p>
        <p className="text-headline-md text-primary">{agg ? a.sold.toLocaleString() : "…"}</p>
      </Link>
      <Link href="/producer/stats" className="glass-card p-3 rounded-xl">
        <Icon name="receipt_long" className="text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 p-1.5 rounded-lg mb-1 inline-block text-[18px]" />
        <p className="text-label-sm text-on-surface-variant">הזמנות</p>
        <p className="text-headline-md text-primary">{agg ? a.orders.toLocaleString() : "…"}</p>
      </Link>
      <Link href="/producer/events" className="glass-card p-3 rounded-xl">
        <Icon name="event_seat" className="text-primary-fixed bg-primary-fixed/10 p-1.5 rounded-lg mb-1 inline-block text-[18px]" />
        <p className="text-label-sm text-on-surface-variant">{count} אירועים שלך</p>
        <p className="text-headline-md text-primary">{agg ? `${a.occupancy}%` : "…"}</p>
      </Link>
    </div>
  );
}

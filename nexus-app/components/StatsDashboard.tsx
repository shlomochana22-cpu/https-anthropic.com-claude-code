"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import type { NexusEvent } from "@/lib/events";

function hash(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

type Metrics = { capacity: number; sold: number; avgPrice: number; revenue: number; orders: number };
function metricsFor(e: NexusEvent): Metrics {
  const seed = hash(e.id);
  const capacity = 600 + (seed % 1400);
  const sold = Math.round((capacity * e.occupancy) / 100);
  const prices = e.tiers.map((t) => t.price).filter((p) => p > 0);
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : e.fromPrice;
  return { capacity, sold, avgPrice, revenue: sold * avgPrice, orders: Math.max(1, Math.round(sold / 2.2)) };
}
const shekel = (n: number) => `₪${n.toLocaleString("he-IL")}`;

export function StatsDashboard({ events }: { events: NexusEvent[] }) {
  const [selectedId, setSelectedId] = useState("all");
  const sel = selectedId === "all" ? null : events.find((e) => e.id === selectedId);

  const perEvent = useMemo(() => events.map((e) => ({ e, m: metricsFor(e) })), [events]);

  const agg = useMemo(() => {
    const src = sel ? [{ e: sel, m: metricsFor(sel) }] : perEvent;
    const a = src.reduce((acc, { m }) => ({ capacity: acc.capacity + m.capacity, sold: acc.sold + m.sold, revenue: acc.revenue + m.revenue, orders: acc.orders + m.orders }), { capacity: 0, sold: 0, revenue: 0, orders: 0 });
    return { ...a, avgPrice: a.sold ? Math.round(a.revenue / a.sold) : 0, occupancy: a.capacity ? Math.round((a.sold / a.capacity) * 100) : 0 };
  }, [sel, perEvent]);

  // Ticket-tier breakdown for a single event.
  const tierBreakdown = useMemo(() => {
    if (!sel) return [];
    const m = metricsFor(sel);
    const n = sel.tiers.length || 1;
    const sorted = [...sel.tiers].sort((a, b) => a.price - b.price);
    const weights = sel.tiers.map((t) => n - sorted.findIndex((x) => x === t));
    const wsum = weights.reduce((a, b) => a + b, 0) || 1;
    return sel.tiers.map((t, i) => {
      const share = weights[i] / wsum;
      const total = Math.max(1, Math.round(m.capacity * share));
      const sold = Math.min(total, Math.round(m.sold * share));
      return { name: t.name, price: t.price, sold, total, revenue: sold * t.price, exclusive: t.exclusive };
    });
  }, [sel]);

  const maxRev = Math.max(1, ...perEvent.map(({ m }) => m.revenue));

  const kpis = [
    { label: "סה\"כ הכנסות", value: shekel(agg.revenue), icon: "payments", tone: "text-primary-fixed" },
    { label: "כרטיסים שנמכרו", value: agg.sold.toLocaleString(), icon: "confirmation_number", tone: "text-secondary-fixed" },
    { label: "הזמנות", value: agg.orders.toLocaleString(), icon: "receipt_long", tone: "text-tertiary-fixed-dim" },
    { label: "מחיר ממוצע", value: shekel(agg.avgPrice), icon: "sell", tone: "text-primary-fixed" },
    { label: "תפוסה", value: `${agg.occupancy}%`, icon: "event_seat", tone: "text-secondary-fixed" },
  ];

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop space-y-md">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75 animate-ping" /><span className="relative inline-flex rounded-full h-2 w-2 bg-primary-fixed" /></span>
          <span className="text-xs font-bold text-primary-fixed tracking-widest uppercase">Live Analytics</span>
        </div>
        <h2 className="text-3xl md:text-[32px] font-black text-white">סטטיסטיקה מפורטת</h2>
        <p className="text-on-surface-variant mt-1">{sel ? <>ניתוח לאירוע: <span className="text-secondary-fixed">{sel.title}</span></> : <>ניתוח <span className="text-secondary-fixed">כל האירועים</span> · {events.length} הפקות</>}</p>
      </div>

      {/* Event filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <button onClick={() => setSelectedId("all")} className={`shrink-0 px-4 py-2 rounded-full text-label-md transition-all ${selectedId === "all" ? "bg-primary-container text-on-primary-container font-bold shadow-lg" : "bg-surface-container text-on-surface-variant border border-white/5 hover:text-white"}`}>כל האירועים</button>
        {events.map((e) => (
          <button key={e.id} onClick={() => setSelectedId(e.id)} className={`shrink-0 px-4 py-2 rounded-full text-label-md whitespace-nowrap transition-all ${selectedId === e.id ? "bg-primary-container text-on-primary-container font-bold shadow-lg" : "bg-surface-container text-on-surface-variant border border-white/5 hover:text-white"}`}>{e.title}</button>
        ))}
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-gutter">
        {kpis.map((k) => (
          <div key={k.label} className="glass-card rounded-xl p-md">
            <Icon name={k.icon} className={`${k.tone} mb-2`} />
            <p className={`text-2xl font-extrabold ${k.tone}`}>{k.value}</p>
            <p className="text-label-sm text-on-surface-variant mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue by event + attendance gauge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="md:col-span-2 glass-card rounded-2xl p-md">
          <div className="flex items-center justify-between mb-md">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Icon name="bar_chart" className="text-primary-fixed" /> הכנסות לפי אירוע</h3>
            <span className="text-label-sm text-on-surface-variant">סה"כ {shekel(perEvent.reduce((s, { m }) => s + m.revenue, 0))}</span>
          </div>
          <div className="space-y-3">
            {perEvent.map(({ e, m }) => {
              const on = !sel || sel.id === e.id;
              return (
                <button key={e.id} onClick={() => setSelectedId(e.id)} className="w-full text-right group">
                  <div className="flex justify-between text-label-sm mb-1">
                    <span className={on ? "text-white" : "text-on-surface-variant/50"}>{e.title}</span>
                    <span className={on ? "text-primary-fixed font-bold" : "text-on-surface-variant/50"}>{shekel(m.revenue)}</span>
                  </div>
                  <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${on ? "bg-primary-fixed" : "bg-primary-fixed/20"}`} style={{ width: `${(m.revenue / maxRev) * 100}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-md flex flex-col items-center justify-center text-center">
          <span className="text-xs text-on-surface-variant uppercase tracking-widest mb-4">תפוסה {sel ? "לאירוע" : "כוללת"}</span>
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle className="text-white/5" cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" />
              <circle className="text-primary-fixed" cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - agg.occupancy / 100)} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px rgba(191,245,32,0.8))", transition: "stroke-dashoffset .4s" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-primary-fixed">{agg.sold.toLocaleString()}</span>
              <span className="text-xs text-on-surface-variant">מתוך {agg.capacity.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" /><span className="text-label-md text-primary-fixed">{agg.occupancy}% מלא</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Ticket breakdown (single event) OR per-event table (all) */}
        <div className="glass-card rounded-2xl p-md">
          <h3 className="text-xl font-bold text-white mb-md flex items-center gap-2"><Icon name="confirmation_number" className="text-primary-fixed" /> {sel ? "פילוח כרטיסים" : "פירוט לפי אירוע"}</h3>
          {sel ? (
            <div className="space-y-5">
              {tierBreakdown.map((t) => (
                <div key={t.name} className="space-y-2">
                  <div className="flex justify-between text-label-md">
                    <span className="text-white flex items-center gap-1.5">{t.exclusive && <Icon name="stars" className="text-primary-fixed text-[16px]" fill />}{t.name}</span>
                    <span className="text-primary-fixed">{t.sold}/{t.total}</span>
                  </div>
                  <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden"><div className="h-full bg-primary-fixed" style={{ width: `${(t.sold / t.total) * 100}%` }} /></div>
                  <div className="flex justify-between text-[10px] text-on-surface-variant uppercase"><span>₪{t.price} לכרטיס</span><span>{shekel(t.revenue)}</span></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {[...perEvent].sort((a, b) => b.m.revenue - a.m.revenue).map(({ e, m }) => (
                <Link key={e.id} href="#" onClick={(ev) => { ev.preventDefault(); setSelectedId(e.id); }} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-primary-fixed/30 transition-colors">
                  <div className="flex-1 min-w-0"><p className="text-label-md text-white truncate">{e.title}</p><p className="text-label-sm text-on-surface-variant">{m.sold.toLocaleString()} כרטיסים · {e.occupancy}% תפוסה</p></div>
                  <span className="text-primary-fixed font-bold text-label-md">{shekel(m.revenue)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Demographics */}
        <div className="glass-card rounded-2xl p-md">
          <h3 className="text-xl font-bold text-white mb-md">דמוגרפיה</h3>
          <div className="mb-gutter">
            <div className="flex justify-between mb-2 text-label-md">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary-fixed-dim" /><span className="text-white">גברים 58%</span></div>
              <div className="flex items-center gap-2"><span className="text-white">נשים 42%</span><span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" /></div>
            </div>
            <div className="w-full h-8 flex rounded-xl overflow-hidden"><div className="h-full bg-secondary-fixed-dim w-[58%] border-r border-black/20" /><div className="h-full bg-tertiary-fixed-dim w-[42%]" /></div>
          </div>
          <p className="text-label-md text-on-surface-variant mb-2">התפלגות גילאים</p>
          <div className="flex items-end justify-between h-28 gap-2">
            {[{ label: "18-21", h: 40 }, { label: "22-25", h: 85 }, { label: "26-30", h: 100 }, { label: "31-35", h: 30 }, { label: "35+", h: 15 }].map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-2 w-full">
                <div className={`w-full rounded-t-md ${a.h === 100 ? "bg-primary-fixed" : "bg-primary-fixed/30"}`} style={{ height: `${a.h}%` }} />
                <span className={`text-[10px] ${a.h === 100 ? "text-primary-fixed font-bold" : "text-on-surface-variant"}`}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic sources */}
      <div className="glass-card rounded-2xl p-md overflow-hidden">
        <h3 className="text-xl font-bold text-white mb-md">מקורות תנועה מובילים</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead><tr className="text-on-surface-variant text-label-sm border-b border-white/5"><th className="pb-3 font-medium">מקור / קמפיין</th><th className="pb-3 font-medium">הקלקות</th><th className="pb-3 font-medium">המרה</th><th className="pb-3 font-medium">הכנסה</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: "Instagram Ads", sub: "קמפיין סטורי", icon: "ads_click", clicks: "12,450", conv: "4.2%", rev: shekel(Math.round(agg.revenue * 0.37)), tone: "text-primary-fixed bg-primary-fixed/20" },
                { name: "יח\"צ ויחצנים", sub: "לינקים אישיים", icon: "group", clicks: "3,120", conv: "8.1%", rev: shekel(Math.round(agg.revenue * 0.2)), tone: "text-secondary-container bg-secondary-container/20" },
                { name: "כניסה ישירה", sub: "אפליקציה / אורגני", icon: "bolt", clicks: "8,900", conv: "2.5%", rev: shekel(Math.round(agg.revenue * 0.16)), tone: "text-white bg-white/10" },
              ].map((t) => (
                <tr key={t.name} className="hover:bg-white/5 transition-colors">
                  <td className="py-4"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded flex items-center justify-center ${t.tone}`}><Icon name={t.icon} className="text-[18px]" /></div><div><div className="text-white font-medium">{t.name}</div><div className="text-[10px] text-on-surface-variant">{t.sub}</div></div></div></td>
                  <td className="py-4 text-on-surface-variant">{t.clicks}</td>
                  <td className="py-4 text-primary-fixed font-bold">{t.conv}</td>
                  <td className="py-4 text-white">{t.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

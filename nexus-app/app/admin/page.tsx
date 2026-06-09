"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getEvents, getEventSales, type EventSales } from "@/lib/queries";
import { aggregateMetrics, eventMetrics, shekel } from "@/lib/metrics";
import { getBuyers } from "@/lib/buyers";
import { amIAdmin, getAdminPayouts, getAdminOverview, setPayoutStatus, type PayoutRow, type PayoutStatus } from "@/lib/admin";
import { AdminProducers } from "@/components/AdminProducers";
import { notify } from "@/lib/notify";
import type { NexusEvent } from "@/lib/events";

const KIND_LABEL: Record<string, string> = { withdrawal: "משיכה", friend: "העברה לחבר", promoter: "העברה ליחצן", supplier: "העברה לספק" };
const STATUS: Record<PayoutStatus, { label: string; cls: string }> = {
  pending: { label: "ממתין", cls: "bg-secondary-fixed/10 text-secondary-fixed border-secondary-fixed/30" },
  approved: { label: "אושר", cls: "bg-primary-fixed/10 text-primary-fixed border-primary-fixed/30" },
  paid: { label: "שולם", cls: "bg-primary-container/15 text-primary-container border-primary-container/40" },
  rejected: { label: "נדחה", cls: "bg-error/10 text-error border-error/30" },
};
type Tab = "overview" | "producers" | "payouts" | "events" | "users";
type Buyer = { name: string; phone?: string };

export default function AdminPage() {
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");

  const [events, setEvents] = useState<NexusEvent[]>([]);
  const [sales, setSales] = useState<Record<string, EventSales>>({});
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [realRevenue, setRealRevenue] = useState<number | null>(null);

  const [commission, setCommission] = useState(10);
  const [suspended, setSuspended] = useState<Set<string>>(new Set());

  // Payout action state
  const [actId, setActId] = useState<string | null>(null);
  const [receipt, setReceipt] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [uQuery, setUQuery] = useState("");

  useEffect(() => {
    setCommission(Number(localStorage.getItem("nexus_commission")) || 10);
    (async () => {
      const ok = await amIAdmin();
      setIsAdmin(ok);
      if (ok) {
        const [evs, sl, po, by, ov] = await Promise.all([getEvents(), getEventSales(), getAdminPayouts(), getBuyers(), getAdminOverview()]);
        setEvents(evs); setSales(sl); setPayouts(po);
        setBuyers(by.map((b) => ({ name: b.name, phone: b.phone ?? undefined })));
        setRealRevenue(ov?.paidRevenue ?? null);
      }
      setReady(true);
    })();
  }, []);

  const agg = useMemo(() => aggregateMetrics(events, sales), [events, sales]);
  const revenue = realRevenue && realRevenue > 0 ? realRevenue : agg.revenue;
  const platformCut = Math.round((revenue * commission) / 100);
  const producerNet = revenue - platformCut;
  const pendingPayouts = payouts.filter((p) => p.status === "pending");

  const setRate = (v: number) => { const r = Math.max(0, Math.min(50, v)); setCommission(r); localStorage.setItem("nexus_commission", String(r)); };

  const act = async (id: string, status: PayoutStatus) => {
    setBusy(true);
    const ok = await setPayoutStatus(id, status, receipt, note);
    setBusy(false);
    if (ok) {
      const row = payouts.find((p) => p.id === id);
      // Notify the producer when their payout is paid (best-effort).
      if (status === "paid" && row?.contact && row.contact.includes("@")) {
        void notify({
          to: row.contact,
          subject: `התשלום שלך בוצע · ₪${row.amount.toLocaleString()}`,
          html: `<div dir="rtl"><h2>התשלום בוצע ✅</h2><p>בקשתך על סך <b>₪${row.amount.toLocaleString()}</b> אושרה ושולמה.${receipt ? ` <a href="${receipt}">צפייה באסמכתא</a>` : ""}</p></div>`,
        });
      }
      setPayouts((list) => list.map((p) => (p.id === id ? { ...p, status, receipt_url: receipt || p.receipt_url, admin_note: note || p.admin_note } : p)));
      setActId(null); setReceipt(""); setNote("");
    }
  };

  const filteredBuyers = useMemo(() => buyers.filter((b) => !uQuery || b.name?.includes(uQuery) || (b.phone || "").includes(uQuery)), [buyers, uQuery]);

  if (!ready) {
    return <main className="min-h-screen flex items-center justify-center text-on-surface-variant"><Icon name="progress_activity" className="animate-spin text-primary-fixed text-3xl" /></main>;
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center px-margin-mobile">
        <div className="glass-card rounded-2xl p-lg max-w-md text-center border border-error/20">
          <Icon name="lock" className="text-error text-4xl mb-3" />
          <h1 className="text-headline-md text-primary mb-2">אזור מנהל הפלטפורמה</h1>
          <p className="text-on-surface-variant text-body-md mb-4">אין לך הרשאת מנהל. כדי לקבל גישה, הוסף את המשתמש שלך לטבלת <span className="font-mono text-primary-fixed">admins</span> ב-Supabase.</p>
          <Link href="/" className="text-primary-fixed text-label-md hover:underline">← חזרה ל-NEXUS</Link>
        </div>
      </main>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "סקירה", icon: "dashboard" },
    { id: "producers", label: "מפיקים", icon: "badge" },
    { id: "payouts", label: `בקשות תשלום${pendingPayouts.length ? ` (${pendingPayouts.length})` : ""}`, icon: "request_quote" },
    { id: "events", label: "אירועים", icon: "confirmation_number" },
    { id: "users", label: "משתמשים", icon: "group" },
  ];

  return (
    <main className="px-margin-mobile md:px-margin-desktop pt-10 pb-32 min-h-screen">
      <header className="mb-lg flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon name="shield_person" className="text-primary-fixed" />
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Platform Owner · Admin</span>
          </div>
          <h1 className="text-headline-lg">מרכז ניהול הפלטפורמה</h1>
          <p className="text-on-surface-variant">תצוגת-על: הכנסות, עמלות, מפיקים ובקשות תשלום</p>
        </div>
        <Link href="/" className="text-on-surface-variant/60 text-sm hover:text-primary-fixed">← חזרה ל-NEXUS</Link>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-lg overflow-x-auto hide-scrollbar">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all border ${tab === t.id ? "bg-primary-fixed text-on-primary-fixed font-bold border-primary-fixed" : "glass border-white/10 text-on-surface-variant hover:text-primary-fixed"}`}>
            <Icon name={t.icon} className="text-[18px]" /> <span className="text-label-md">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <>
          <section className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-lg">
            {[
              { label: "מחזור מכירות", value: shekel(revenue), icon: "payments", note: realRevenue ? "נתוני אמת" : "הערכה" },
              { label: `עמלה מהמפיקים (${commission}%)`, value: shekel(platformCut), icon: "account_balance", accent: true, note: "ההכנסה שלך" },
              { label: "נטו למפיקים", value: shekel(producerNet), icon: "savings", note: "אחרי העמלה" },
              { label: "כרטיסים שנמכרו", value: agg.sold.toLocaleString(), icon: "confirmation_number" },
            ].map((s) => (
              <div key={s.label} className={`glass-card p-md rounded-xl flex flex-col justify-between h-32 ${s.accent ? "border border-primary-fixed/30" : ""}`}>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant text-sm">{s.label}</span>
                  <Icon name={s.icon} className="text-primary-fixed-dim text-[18px]" />
                </div>
                <span className="text-2xl md:text-3xl font-extrabold text-primary-fixed neon-text">{s.value}</span>
                {s.note && <span className="text-[10px] text-on-surface-variant">{s.note}</span>}
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-lg">
            <div className="glass-card p-md rounded-xl"><p className="text-on-surface-variant text-sm mb-1">אירועים פעילים</p><p className="text-2xl font-bold text-primary">{events.length - suspended.size}</p></div>
            <div className="glass-card p-md rounded-xl"><p className="text-on-surface-variant text-sm mb-1">הזמנות</p><p className="text-2xl font-bold text-primary">{agg.orders.toLocaleString()}</p></div>
            <div className="glass-card p-md rounded-xl border border-secondary-fixed/20"><p className="text-on-surface-variant text-sm mb-1">בקשות תשלום ממתינות</p><p className="text-2xl font-bold text-secondary-fixed">{pendingPayouts.length} · {shekel(pendingPayouts.reduce((s, p) => s + p.amount, 0))}</p></div>
          </section>

          {/* Commission control */}
          <section className="glass-card p-md rounded-xl mb-lg max-w-md">
            <h3 className="text-label-md text-primary-fixed mb-3 flex items-center gap-2"><Icon name="percent" className="text-[18px]" /> עמלה שאתה גובה מהמפיקים</h3>
            <div className="flex items-center gap-3">
              <input type="range" min={0} max={30} value={commission} onChange={(e) => setRate(Number(e.target.value))} className="flex-1 accent-primary-fixed" />
              <div className="flex items-center gap-1">
                <input type="number" min={0} max={50} value={commission} onChange={(e) => setRate(Number(e.target.value))} className="w-16 bg-surface-container-low border border-white/10 rounded-lg px-2 py-1.5 text-center text-on-surface focus:border-primary-fixed outline-none" />
                <span className="text-on-surface-variant">%</span>
              </div>
            </div>
            <p className="text-label-sm text-on-surface-variant mt-2">ממחזור של {shekel(revenue)} — אתה גובה {shekel(platformCut)} עמלה מהמפיקים, והם מקבלים {shekel(producerNet)} נטו.</p>
          </section>

          {/* Top events */}
          <section className="glass-card p-md rounded-xl">
            <h3 className="text-label-md text-primary-fixed mb-md uppercase tracking-wider">אירועים מובילים</h3>
            <div className="space-y-2">
              {[...events].map((e) => ({ e, m: eventMetrics(e, sales[e.id]) })).sort((a, b) => b.m.revenue - a.m.revenue).slice(0, 5).map(({ e, m }) => (
                <div key={e.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon name="local_activity" className="text-primary-fixed-dim shrink-0" />
                    <div className="min-w-0"><p className="text-label-md text-on-surface truncate">{e.title}</p><p className="text-[10px] text-on-surface-variant">{e.city} · {m.sold} כרטיסים</p></div>
                  </div>
                  <span className="text-label-md font-bold text-primary-fixed shrink-0">{shekel(m.revenue)}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ── PRODUCERS ── */}
      {tab === "producers" && <AdminProducers payouts={payouts} />}

      {/* ── PAYOUTS ── */}
      {tab === "payouts" && (
        <section className="space-y-3">
          {payouts.length === 0 && <div className="glass-card rounded-xl p-lg text-center text-on-surface-variant"><Icon name="inbox" className="text-3xl mb-2 opacity-40" /><p>אין בקשות תשלום עדיין.</p></div>}
          {payouts.map((p) => (
            <div key={p.id} className="glass-card rounded-xl p-md">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-fixed shrink-0"><Icon name={p.kind === "withdrawal" ? "account_balance" : "send"} /></div>
                  <div>
                    <p className="text-label-md text-on-surface">{p.holder} <span className="text-on-surface-variant text-label-sm">· {KIND_LABEL[p.kind] || p.kind}</span></p>
                    <p className="text-[11px] text-on-surface-variant font-mono" dir="ltr">{p.bank} · {p.branch}-{p.account} · ת.ז {p.idnum}</p>
                    {p.contact && <p className="text-[11px] text-on-surface-variant" dir="ltr">{p.contact}</p>}
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-headline-md text-primary-fixed font-bold">{shekel(p.amount)}</p>
                  <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border ${STATUS[p.status].cls}`}>{STATUS[p.status].label}</span>
                </div>
              </div>

              {p.receipt_url && <a href={p.receipt_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-label-sm text-primary-fixed hover:underline"><Icon name="receipt_long" className="text-[16px]" /> אסמכתא מצורפת</a>}
              {p.admin_note && <p className="text-label-sm text-on-surface-variant mt-1">הערה: {p.admin_note}</p>}

              {p.status === "pending" && (
                actId === p.id ? (
                  <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                    <input value={receipt} onChange={(e) => setReceipt(e.target.value)} placeholder="קישור לאסמכתא (צילום העברה)" dir="ltr" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-on-surface text-sm focus:border-primary-fixed outline-none" />
                    <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="הערת מנהל (אופציונלי)" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-on-surface text-sm focus:border-primary-fixed outline-none" />
                    <div className="flex gap-2">
                      <button disabled={busy} onClick={() => act(p.id, "paid")} className="flex-1 bg-primary-fixed text-on-primary-fixed font-bold py-2 rounded-lg text-label-md active:scale-95 disabled:opacity-50">סומן כשולם + אסמכתא</button>
                      <button disabled={busy} onClick={() => act(p.id, "approved")} className="px-4 bg-surface-container-highest text-on-surface py-2 rounded-lg text-label-md active:scale-95 disabled:opacity-50">אשר</button>
                      <button onClick={() => { setActId(null); setReceipt(""); setNote(""); }} className="px-3 text-on-surface-variant"><Icon name="close" /></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => { setActId(p.id); setReceipt(""); setNote(""); }} className="flex-1 bg-primary-fixed/10 text-primary-fixed border border-primary-fixed/30 py-2 rounded-lg text-label-md font-bold active:scale-95">טפל בבקשה</button>
                    <button disabled={busy} onClick={() => act(p.id, "rejected")} className="px-4 text-error border border-error/30 py-2 rounded-lg text-label-md active:scale-95 disabled:opacity-50">דחה</button>
                  </div>
                )
              )}
            </div>
          ))}
        </section>
      )}

      {/* ── EVENTS ── */}
      {tab === "events" && (
        <section className="space-y-2">
          {events.map((e) => {
            const m = eventMetrics(e, sales[e.id]);
            const off = suspended.has(e.id);
            return (
              <div key={e.id} className={`glass-card rounded-xl p-md flex items-center justify-between gap-3 ${off ? "opacity-50" : ""}`}>
                <div className="min-w-0">
                  <Link href={`/producer/events/${e.id}`} className="text-label-md text-on-surface hover:text-primary-fixed truncate block">{e.title}</Link>
                  <p className="text-[11px] text-on-surface-variant">{e.city} · {e.date} · {m.sold} כרטיסים · {shekel(m.revenue)}</p>
                </div>
                <button onClick={() => setSuspended((s) => { const n = new Set(s); n.has(e.id) ? n.delete(e.id) : n.add(e.id); return n; })} className={`text-label-sm px-3 py-1.5 rounded-lg border shrink-0 ${off ? "border-primary-fixed/30 text-primary-fixed" : "border-error/30 text-error"}`}>
                  {off ? "הפעל" : "השהה"}
                </button>
              </div>
            );
          })}
        </section>
      )}

      {/* ── USERS ── */}
      {tab === "users" && (
        <section>
          <div className="relative mb-md max-w-md">
            <Icon name="search" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input value={uQuery} onChange={(e) => setUQuery(e.target.value)} placeholder="חיפוש לפי שם או טלפון…" className="w-full bg-surface-container-low border border-white/10 rounded-xl py-3 pr-11 pl-4 text-on-surface focus:border-primary-fixed outline-none" />
          </div>
          {filteredBuyers.length === 0 ? (
            <div className="glass-card rounded-xl p-lg text-center text-on-surface-variant"><Icon name="group_off" className="text-3xl mb-2 opacity-40" /><p>אין רוכשים עדיין (או שאין התאמה לחיפוש).</p></div>
          ) : (
            <div className="glass-card rounded-xl overflow-hidden divide-y divide-white/5">
              {filteredBuyers.map((b, i) => (
                <div key={i} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant"><Icon name="person" /></div>
                    <div><p className="text-label-md text-on-surface">{b.name}</p>{b.phone && <p className="text-[11px] text-on-surface-variant" dir="ltr">{b.phone}</p>}</div>
                  </div>
                  <Icon name="confirmation_number" className="text-primary-fixed-dim text-[18px]" />
                </div>
              ))}
            </div>
          )}
          <p className="text-[11px] text-on-surface-variant mt-3">מוצגים רוכשים אמיתיים מתוך מאגר ההזמנות. מודל פרופילי-מפיק מלא (אישור/חסימה/עמלה אישית) יתווסף בשלב הבא.</p>
        </section>
      )}
    </main>
  );
}

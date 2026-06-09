"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getEvents, getEventSales, type EventSales } from "@/lib/queries";
import { aggregateMetrics, eventMetrics, shekel } from "@/lib/metrics";
import { getBuyers } from "@/lib/buyers";
import { browserSupabase } from "@/lib/supabaseBrowser";
import { amIAdmin, getAdminPayouts, getAdminOverview, setPayoutStatus, type PayoutRow, type PayoutStatus } from "@/lib/admin";
import { AdminProducers } from "@/components/AdminProducers";
import { EnableNotifications } from "@/components/EnableNotifications";
import { getProducers, type ProducerSummary } from "@/lib/producers";
import { notify } from "@/lib/notify";
import { nativeNotify } from "@/lib/pushNotify";
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

/** Short two-tone alert chime (best-effort; ignored if audio is blocked). */
function chime() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [880, 1320].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = f;
      o.connect(g); g.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.start(t); o.stop(t + 0.18);
    });
  } catch { /* audio blocked — visual popup still shows */ }
}

export default function AdminPage() {
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");

  const [events, setEvents] = useState<NexusEvent[]>([]);
  const [sales, setSales] = useState<Record<string, EventSales>>({});
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [realRevenue, setRealRevenue] = useState<number | null>(null);
  const [buyerFees, setBuyerFees] = useState(0);
  const [producers, setProducers] = useState<ProducerSummary[]>([]);
  const [selProducer, setSelProducer] = useState<string>("all");

  const [suspended, setSuspended] = useState<Set<string>>(new Set());

  // Payout action state
  const [actId, setActId] = useState<string | null>(null);
  const [receipt, setReceipt] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [uQuery, setUQuery] = useState("");
  const [expEvent, setExpEvent] = useState<string | null>(null);
  const [incoming, setIncoming] = useState<PayoutRow | null>(null);

  useEffect(() => {
    (async () => {
      const ok = await amIAdmin();
      setIsAdmin(ok);
      if (ok) {
        const [evs, sl, po, by, ov, prods] = await Promise.all([getEvents(), getEventSales(), getAdminPayouts(), getBuyers(), getAdminOverview(), getProducers()]);
        setEvents(evs); setSales(sl); setPayouts(po);
        setBuyers(by.map((b) => ({ name: b.name, phone: b.phone ?? undefined })));
        setRealRevenue(ov?.paidRevenue ?? null);
        setBuyerFees(ov?.fees ?? 0);
        setProducers(prods);
      }
      setReady(true);
    })();
  }, []);

  // Real-time alert: pop a window the moment a producer submits a payout request.
  useEffect(() => {
    if (!isAdmin) return;
    const sb = browserSupabase();
    if (!sb) return;
    const ch = sb
      .channel("admin-payout-alerts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "withdrawal_requests" }, (payload) => {
        const row = payload.new as PayoutRow;
        setPayouts((list) => (list.some((p) => p.id === row.id) ? list : [row, ...list]));
        setIncoming(row);
        chime();
        nativeNotify("בקשת תשלום חדשה 💸", `${row.holder} · ₪${row.amount.toLocaleString()}`);
      })
      .subscribe();
    return () => { sb.removeChannel(ch); };
  }, [isAdmin]);

  const agg = useMemo(() => aggregateMetrics(events, sales), [events, sales]);
  const pendingPayouts = payouts.filter((p) => p.status === "pending");

  // Income breakdown — platform-wide, or scoped to one selected producer.
  const sp = selProducer === "all" ? null : producers.find((p) => p.id === selProducer) ?? null;
  const revenue = sp ? sp.revenue : (realRevenue && realRevenue > 0 ? realRevenue : agg.revenue);
  const platformCut = sp ? sp.commission : producers.reduce((s, p) => s + p.commission, 0);
  const totalFees = sp ? sp.fees : (realRevenue !== null ? buyerFees : agg.fees);
  const producerNet = revenue - platformCut;
  const platformTotal = platformCut + totalFees; // your total income: producer commission + buyer fees
  const soldCount = sp ? sp.tickets : agg.sold;
  const ordersCount = sp ? sp.orders : agg.orders;
  const scopedPending = sp ? pendingPayouts.filter((p) => sp.userId && p.user_id === sp.userId) : pendingPayouts;

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
        <div className="flex items-center gap-3">
          <EnableNotifications />
          <Link href="/" className="text-on-surface-variant/60 text-sm hover:text-primary-fixed">← חזרה ל-NEXUS</Link>
        </div>
      </header>

      {/* Persistent pending-payouts banner — stays until every request is handled */}
      {pendingPayouts.length > 0 && tab !== "payouts" && (
        <button onClick={() => setTab("payouts")} className="w-full mb-lg glass-card rounded-xl p-4 border-2 border-secondary-fixed/50 flex items-center justify-between gap-3 animate-pulse hover:animate-none transition-all text-right">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed/15 flex items-center justify-center shrink-0"><Icon name="notifications_active" className="text-secondary-fixed" fill /></div>
            <div>
              <p className="text-label-md text-secondary-fixed font-bold">{pendingPayouts.length} בקשות תשלום ממתינות לטיפול</p>
              <p className="text-[11px] text-on-surface-variant">סך {shekel(pendingPayouts.reduce((s, p) => s + p.amount, 0))} · לחץ לטיפול מיידי</p>
            </div>
          </div>
          <Icon name="arrow_back" className="text-secondary-fixed shrink-0" />
        </button>
      )}

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
          {/* Producer scope selector */}
          <section className="glass-card rounded-xl p-md mb-gutter flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-label-md text-primary-fixed flex items-center gap-2 shrink-0"><Icon name="filter_alt" className="text-[18px]" /> פירוט הכנסות לפי מפיק</span>
            <select value={selProducer} onChange={(e) => setSelProducer(e.target.value)} className="flex-1 bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:border-primary-fixed outline-none appearance-none">
              <option value="all">כל המפיקים (יחד)</option>
              {producers.map((p) => <option key={p.id} value={p.id}>{p.name}{p.company ? ` · ${p.company}` : ""}</option>)}
            </select>
            {sp && <button onClick={() => { setTab("producers"); }} className="shrink-0 text-label-sm text-primary-fixed border border-primary-fixed/30 rounded-lg px-3 py-2 hover:bg-primary-fixed/10 transition-colors flex items-center gap-1"><Icon name="open_in_full" className="text-[16px]" /> כרטיס מלא</button>}
          </section>

          {sp && (
            <p className="text-label-sm text-on-surface-variant mb-gutter">מוצג: <span className="text-primary-fixed font-bold">{sp.name}</span> · עמלה {sp.commissionRate}% · {sp.eventsCount} אירועים · סטטוס {sp.status === "active" ? "פעיל" : sp.status === "suspended" ? "מושהה" : "חסום"}</p>
          )}

          <section className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-gutter">
            {[
              { label: "מחזור כרטיסים", value: shekel(revenue), icon: "confirmation_number", note: sp ? "סכום מקורי" : (realRevenue ? "סכום מקורי · נתוני אמת" : "הערכה") },
              { label: "עמלה מהמפיקים", value: shekel(platformCut), icon: "account_balance", note: "סכום העמלות הפר-מפיק" },
              { label: "עמלת גבייה מרוכשים", value: shekel(totalFees), icon: "sell", note: "נגבית בצ'קאאוט" },
              { label: "סך הכנסות הפלטפורמה", value: shekel(platformTotal), icon: "savings", accent: true, note: "עמלת מפיקים + עמלת רוכשים" },
            ].map((s) => (
              <div key={s.label} className={`glass-card p-md rounded-xl flex flex-col justify-between h-32 ${s.accent ? "border border-primary-fixed/40 shadow-neon-primary" : ""}`}>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant text-sm">{s.label}</span>
                  <Icon name={s.icon} className="text-primary-fixed-dim text-[18px]" />
                </div>
                <span className="text-2xl md:text-3xl font-extrabold text-primary-fixed neon-text">{s.value}</span>
                {s.note && <span className="text-[10px] text-on-surface-variant">{s.note}</span>}
              </div>
            ))}
          </section>

          <section className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-lg">
            <div className="glass-card p-md rounded-xl"><p className="text-on-surface-variant text-sm mb-1">נטו למפיק{sp ? "" : "ים"}</p><p className="text-xl font-bold text-primary">{shekel(producerNet)}</p></div>
            <div className="glass-card p-md rounded-xl"><p className="text-on-surface-variant text-sm mb-1">כרטיסים שנמכרו</p><p className="text-xl font-bold text-primary">{soldCount.toLocaleString()}</p></div>
            <div className="glass-card p-md rounded-xl"><p className="text-on-surface-variant text-sm mb-1">הזמנות</p><p className="text-xl font-bold text-primary">{ordersCount.toLocaleString()}</p></div>
            <div className="glass-card p-md rounded-xl border border-secondary-fixed/20"><p className="text-on-surface-variant text-sm mb-1">תשלום ממתין</p><p className="text-xl font-bold text-secondary-fixed">{scopedPending.length} · {shekel(scopedPending.reduce((s, p) => s + p.amount, 0))}</p></div>
          </section>

          {/* Commission note — the rate itself is set per producer in their card */}
          {!sp && (
            <section className="glass-card p-md rounded-xl mb-lg flex items-start gap-3 border border-primary-fixed/15">
              <Icon name="info" className="text-primary-fixed-dim text-[20px] shrink-0 mt-0.5" fill />
              <p className="text-label-sm text-on-surface-variant">אחוז העמלה נקבע <span className="text-primary-fixed">בנפרד לכל מפיק</span> בתוך כרטיס המפיק (לשונית "מפיקים"), כי הוא משתנה ממפיק למפיק. הסכום למעלה הוא צירוף כל העמלות שגבית.</p>
            </section>
          )}

          {/* Top events (platform-wide). For a selected producer, the full
              breakdown — events, top-5, payments — lives in their card. */}
          {sp ? (
            <section className="glass-card p-md rounded-xl flex items-center justify-between gap-3">
              <p className="text-label-sm text-on-surface-variant">לפירוט מלא של {sp.name} — אירועים, טופ 5, חוזה ותשלומים — פתח את כרטיס המפיק.</p>
              <button onClick={() => setTab("producers")} className="shrink-0 text-label-sm text-primary-fixed border border-primary-fixed/30 rounded-lg px-3 py-2 hover:bg-primary-fixed/10 transition-colors">לכרטיס</button>
            </section>
          ) : (
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
          )}
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
          {/* Payments breakdown summary */}
          <div className="glass-card rounded-xl p-md mb-2 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div><p className="text-[11px] text-on-surface-variant">סכום כרטיסים (מקורי)</p><p className="text-lg font-bold text-on-surface">{shekel(agg.revenue)}</p></div>
            <div><p className="text-[11px] text-on-surface-variant">עמלת גבייה מרוכשים</p><p className="text-lg font-bold text-secondary-fixed">{shekel(agg.fees)}</p></div>
            <div><p className="text-[11px] text-on-surface-variant">כרטיסים שנמכרו</p><p className="text-lg font-bold text-on-surface">{agg.sold.toLocaleString()}</p></div>
            <div className="md:border-r md:border-white/10 md:pr-3"><p className="text-[11px] text-on-surface-variant">סך הכל (כרטיסים + גבייה)</p><p className="text-lg font-bold text-primary-fixed neon-text">{shekel(agg.revenue + agg.fees)}</p></div>
          </div>
          {events.map((e) => {
            const m = eventMetrics(e, sales[e.id]);
            const off = suspended.has(e.id);
            const open = expEvent === e.id;
            return (
              <div key={e.id} className={`glass-card rounded-xl overflow-hidden ${off ? "opacity-50" : ""}`}>
                <div className="p-md flex items-center justify-between gap-3">
                  <button onClick={() => setExpEvent(open ? null : e.id)} className="min-w-0 text-right flex-1">
                    <span className="text-label-md text-on-surface flex items-center gap-1.5">
                      <Icon name={open ? "expand_less" : "expand_more"} className="text-on-surface-variant text-[18px]" />
                      <span className="truncate">{e.title}</span>
                    </span>
                    <span className="text-[11px] text-on-surface-variant block pr-6">{e.city} · {e.date} · {m.sold} כרטיסים · {shekel(m.revenue)} <span className="text-secondary-fixed">+ גבייה {shekel(m.fees)}</span></span>
                  </button>
                  <button onClick={() => setSuspended((s) => { const n = new Set(s); n.has(e.id) ? n.delete(e.id) : n.add(e.id); return n; })} className={`text-label-sm px-3 py-1.5 rounded-lg border shrink-0 ${off ? "border-primary-fixed/30 text-primary-fixed" : "border-error/30 text-error"}`}>
                    {off ? "הפעל" : "השהה"}
                  </button>
                </div>
                {open && (
                  <div className="px-md pb-md pt-0 border-t border-white/5">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                      {[
                        { l: "כרטיסים שנרכשו", v: m.sold.toLocaleString() },
                        { l: "סכום כרטיסים (מקורי)", v: shekel(m.revenue) },
                        { l: "עמלת גבייה מרוכש", v: shekel(m.fees), accent: true },
                        { l: "הזמנות", v: m.orders.toLocaleString() },
                        { l: "מחיר ממוצע לכרטיס", v: shekel(m.avgPrice) },
                        { l: "סך הכל (כרטיס + גבייה)", v: shekel(m.revenue + m.fees) },
                      ].map((s) => (
                        <div key={s.l} className={`rounded-lg p-2.5 ${s.accent ? "bg-secondary-fixed/10 border border-secondary-fixed/20" : "bg-surface-container-low"}`}>
                          <p className="text-[10px] text-on-surface-variant">{s.l}</p>
                          <p className={`font-bold ${s.accent ? "text-secondary-fixed" : "text-on-surface"}`}>{s.v}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${m.isReal ? "bg-primary-fixed/10 text-primary-fixed border-primary-fixed/30" : "bg-white/5 text-on-surface-variant border-white/10"}`}>{m.isReal ? "מכירות אמיתיות" : "הערכה"}</span>
                      <a href={`/events/${e.id}`} target="_blank" rel="noreferrer" className="text-[11px] text-primary-fixed-dim hover:underline flex items-center gap-1"><Icon name="open_in_new" className="text-[13px]" /> תצוגה מקדימה של עמוד האירוע</a>
                    </div>
                  </div>
                )}
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

      {/* Real-time new-payout alert */}
      {incoming && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIncoming(null)} />
          <div className="relative glass-card w-full max-w-sm rounded-2xl p-6 border-2 border-primary-fixed shadow-neon-primary text-center animate-[pulse_1.2s_ease-in-out_2]">
            <div className="w-16 h-16 rounded-full bg-primary-fixed/15 flex items-center justify-center mx-auto mb-4">
              <Icon name="notifications_active" className="text-primary-fixed text-4xl" fill />
            </div>
            <p className="text-[11px] text-primary-fixed-dim uppercase tracking-widest mb-1">בקשת תשלום חדשה</p>
            <h3 className="text-headline-md text-primary mb-2">{incoming.holder}</h3>
            <p className="text-3xl font-extrabold text-primary-fixed neon-text mb-1">{shekel(incoming.amount)}</p>
            <p className="text-label-md text-on-surface-variant mb-4">{KIND_LABEL[incoming.kind] || incoming.kind} · {incoming.bank} {incoming.branch}-{incoming.account}</p>
            <div className="flex gap-2">
              <button onClick={() => { setTab("payouts"); setActId(incoming.id); setReceipt(""); setNote(""); setIncoming(null); }} className="flex-1 bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg active:scale-95 shadow-neon-primary">טפל עכשיו</button>
              <button onClick={() => setIncoming(null)} className="px-4 py-3 rounded-lg glass border border-white/10 text-on-surface-variant">סגור</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

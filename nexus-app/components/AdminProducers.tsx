"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "./Icon";
import { shekel } from "@/lib/metrics";
import { getProducers, getProducerEvents, updateProducer, type ProducerSummary, type ProducerEventRow, type ProducerStatus, type ContractType } from "@/lib/producers";
import type { PayoutRow } from "@/lib/admin";

const STATUS: Record<ProducerStatus, { label: string; cls: string }> = {
  active: { label: "פעיל", cls: "bg-primary-fixed/10 text-primary-fixed border-primary-fixed/30" },
  suspended: { label: "מושהה", cls: "bg-secondary-fixed/10 text-secondary-fixed border-secondary-fixed/30" },
  blocked: { label: "חסום", cls: "bg-error/10 text-error border-error/30" },
};
const CONTRACT: Record<ContractType, string> = { standard: "סטנדרטי", vip: "VIP", special: "מיוחד" };
const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString("he-IL") : "—");

export function AdminProducers({ payouts }: { payouts: PayoutRow[] }) {
  const [list, setList] = useState<ProducerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState<"all" | ProducerStatus>("all");
  const [sel, setSel] = useState<ProducerSummary | null>(null);

  useEffect(() => { getProducers().then((p) => { setList(p); setLoading(false); }); }, []);

  const filtered = useMemo(() => list.filter((p) => {
    if (statusF !== "all" && p.status !== statusF) return false;
    if (q && !((p.name || "").includes(q) || (p.company || "").includes(q) || (p.email || "").includes(q))) return false;
    return true;
  }), [list, q, statusF]);

  if (sel) return <ProducerCard producer={sel} payouts={payouts} onBack={() => setSel(null)} onSaved={(p) => { setSel(p); setList((l) => l.map((x) => (x.id === p.id ? p : x))); }} />;

  return (
    <section>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-md">
        <div className="relative flex-1">
          <Icon name="search" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש מפיק / חברה / אימייל…" className="w-full bg-surface-container-low border border-white/10 rounded-xl py-2.5 pr-11 pl-4 text-on-surface focus:border-primary-fixed outline-none" />
        </div>
        <div className="flex gap-2">
          {([["all", "הכל"], ["active", "פעיל"], ["suspended", "מושהה"], ["blocked", "חסום"]] as const).map(([k, lbl]) => (
            <button key={k} onClick={() => setStatusF(k)} className={`px-3 py-2 rounded-lg text-label-sm border whitespace-nowrap transition-all ${statusF === k ? "bg-primary-fixed text-on-primary-fixed border-primary-fixed font-bold" : "glass border-white/10 text-on-surface-variant"}`}>{lbl}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-on-surface-variant"><Icon name="progress_activity" className="animate-spin text-primary-fixed text-2xl" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-lg text-center text-on-surface-variant"><Icon name="badge" className="text-3xl mb-2 opacity-40" /><p>אין מפיקים להצגה.</p><p className="text-[11px] mt-1">מפיקים מתווספים אוטומטית כשהם נרשמים ויוצרים אירוע.</p></div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <button key={p.id} onClick={() => setSel(p)} className="w-full glass-card rounded-xl p-md flex items-center justify-between gap-3 hover:bg-white/5 transition-colors text-right">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-fixed font-bold shrink-0">{(p.name || "?").charAt(0)}</div>
                <div className="min-w-0">
                  <p className="text-label-md text-on-surface truncate">{p.name}{p.company ? <span className="text-on-surface-variant"> · {p.company}</span> : ""}</p>
                  <p className="text-[11px] text-on-surface-variant">{p.eventsCount} אירועים · {p.tickets.toLocaleString()} כרטיסים · עמלה {p.commissionRate}%</p>
                </div>
              </div>
              <div className="text-left shrink-0">
                <p className="text-label-md font-bold text-primary-fixed">{shekel(p.revenue)}</p>
                <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border ${STATUS[p.status].cls}`}>{STATUS[p.status].label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function ProducerCard({ producer, payouts, onBack, onSaved }: { producer: ProducerSummary; payouts: PayoutRow[]; onBack: () => void; onSaved: (p: ProducerSummary) => void }) {
  const [events, setEvents] = useState<ProducerEventRow[]>([]);
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [f, setF] = useState({
    status: producer.status, commissionRate: producer.commissionRate, contractType: producer.contractType,
    contractStart: producer.contractStart ?? "", contractEnd: producer.contractEnd ?? "", contractNotes: producer.contractNotes ?? "",
  });

  useEffect(() => { getProducerEvents(producer.id).then(setEvents); }, [producer.id]);

  const commission = Math.round((producer.revenue * f.commissionRate) / 100);
  const producerNet = producer.revenue - commission;
  const owed = producerNet - producer.paidOut;
  const avgCommission = producer.eventsCount ? Math.round(commission / producer.eventsCount) : 0;
  const myPayments = payouts.filter((p) => producer.userId && p.user_id === producer.userId);
  const topEvents = [...events].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const maxRev = Math.max(1, ...events.map((e) => e.revenue));

  const save = async () => {
    setSaving(true);
    const ok = await updateProducer(producer.id, { status: f.status, commissionRate: f.commissionRate, contractType: f.contractType, contractStart: f.contractStart || null, contractEnd: f.contractEnd || null, contractNotes: f.contractNotes });
    setSaving(false);
    if (ok) { onSaved({ ...producer, ...f, contractStart: f.contractStart || null, contractEnd: f.contractEnd || null, commission }); setEdit(false); }
  };

  const changeStatus = async (status: ProducerStatus) => {
    setF((x) => ({ ...x, status }));
    await updateProducer(producer.id, { status });
    onSaved({ ...producer, status });
  };

  const exportCsv = () => {
    const lines = [["אירוע", "תאריך", "כרטיסים", "מחזור", "עמלה שנגבתה"], ...events.map((e) => [e.title, e.date, String(e.tickets), String(e.revenue), String(Math.round((e.revenue * f.commissionRate) / 100))])];
    const csv = "﻿" + lines.map((l) => l.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a"); a.href = url; a.download = `producer-${producer.name}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const rows = events.map((e) => `<tr><td>${e.title}</td><td>${e.date}</td><td>${e.tickets}</td><td>₪${e.revenue.toLocaleString()}</td><td>₪${Math.round((e.revenue * f.commissionRate) / 100).toLocaleString()}</td></tr>`).join("");
    const html = `<!doctype html><html dir="rtl" lang="he"><head><meta charset="utf-8"><title>דוח מפיק — ${producer.name}</title>
      <style>body{font-family:Arial,Helvetica,sans-serif;color:#111;padding:32px;direction:rtl}h1{color:#3a4d00;margin:0}h2{border-bottom:2px solid #bff520;padding-bottom:4px;margin-top:28px;font-size:16px}.muted{color:#666}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:8px}.box{border:1px solid #ddd;border-radius:8px;padding:10px}.box b{display:block;font-size:18px}table{width:100%;border-collapse:collapse;margin-top:8px;font-size:13px}th,td{border:1px solid #ddd;padding:6px 8px;text-align:right}th{background:#f4f7e6}</style></head>
      <body>
        <h1>${producer.name}${producer.company ? ` · ${producer.company}` : ""}</h1>
        <p class="muted">דוח מפיק NEXUS · ${new Date().toLocaleDateString("he-IL")} · ${producer.email || ""} ${producer.phone || ""}</p>
        <h2>חוזה ועמלה</h2>
        <p>אחוז עמלה: <b>${f.commissionRate}%</b> · סוג חוזה: ${({ standard: "סטנדרטי", vip: "VIP", special: "מיוחד" } as Record<string, string>)[f.contractType]} · ${fmtDate(f.contractStart || null)} – ${fmtDate(f.contractEnd || null)}</p>
        ${f.contractNotes ? `<p class="muted">${f.contractNotes}</p>` : ""}
        <h2>סיכום פיננסי</h2>
        <div class="grid">
          <div class="box">סך הכנסות<b>₪${producer.revenue.toLocaleString()}</b></div>
          <div class="box">עמלות שנגבו<b>₪${commission.toLocaleString()}</b></div>
          <div class="box">נטו למפיק<b>₪${producerNet.toLocaleString()}</b></div>
          <div class="box">אירועים<b>${producer.eventsCount}</b></div>
          <div class="box">כרטיסים<b>${producer.tickets.toLocaleString()}</b></div>
          <div class="box">יתרה לתשלום<b>₪${owed.toLocaleString()}</b></div>
        </div>
        <h2>אירועים (${events.length})</h2>
        <table><thead><tr><th>אירוע</th><th>תאריך</th><th>כרטיסים</th><th>מחזור</th><th>עמלה שנגבתה</th></tr></thead><tbody>${rows || '<tr><td colspan="5">—</td></tr>'}</tbody></table>
      </body></html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html); w.document.close(); w.focus();
    setTimeout(() => w.print(), 350);
  };

  const fieldCls = "w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-on-surface text-sm focus:border-primary-fixed outline-none";

  return (
    <section className="space-y-4">
      <button onClick={onBack} className="text-on-surface-variant hover:text-primary-fixed flex items-center gap-1 text-label-md"><Icon name="arrow_forward" className="text-[18px]" /> חזרה לרשימת המפיקים</button>

      {/* Header */}
      <div className="glass-card rounded-2xl p-md">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-fixed/15 flex items-center justify-center text-primary-fixed text-2xl font-bold">{(producer.name || "?").charAt(0)}</div>
            <div>
              <h2 className="text-headline-md text-primary">{producer.name}</h2>
              {producer.company && <p className="text-on-surface-variant text-label-md">{producer.company}</p>}
              <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full border ${STATUS[f.status].cls}`}>{STATUS[f.status].label}</span>
            </div>
          </div>
          <div className="text-label-sm text-on-surface-variant text-left">
            <p>הצטרף: {fmtDate(producer.createdAt)}</p>
            {producer.phone && <a href={`tel:${producer.phone}`} className="block hover:text-primary-fixed" dir="ltr">{producer.phone}</a>}
            {producer.email && <a href={`mailto:${producer.email}`} className="block hover:text-primary-fixed" dir="ltr">{producer.email}</a>}
            {producer.whatsapp && <a href={`https://wa.me/972${producer.whatsapp.replace(/^0/, "")}`} target="_blank" rel="noreferrer" className="block text-primary-fixed-dim">WhatsApp</a>}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mt-md">
          <button onClick={() => setEdit((v) => !v)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-fixed/10 text-primary-fixed border border-primary-fixed/30 text-label-sm"><Icon name="edit" className="text-[16px]" /> עריכת חוזה ועמלה</button>
          <button onClick={exportPdf} className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass border border-white/10 text-on-surface-variant text-label-sm"><Icon name="picture_as_pdf" className="text-[16px]" /> ייצוא PDF</button>
          <button onClick={exportCsv} className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass border border-white/10 text-on-surface-variant text-label-sm"><Icon name="table_view" className="text-[16px]" /> ייצוא Excel</button>
          {producer.email && <a href={`mailto:${producer.email}?subject=NEXUS — עדכון מפיק`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass border border-white/10 text-on-surface-variant text-label-sm"><Icon name="mail" className="text-[16px]" /> שליחת מייל</a>}
          {f.status !== "active" && <button onClick={() => changeStatus("active")} className="px-3 py-2 rounded-lg text-label-sm border border-primary-fixed/30 text-primary-fixed">הפעל</button>}
          {f.status !== "suspended" && <button onClick={() => changeStatus("suspended")} className="px-3 py-2 rounded-lg text-label-sm border border-secondary-fixed/30 text-secondary-fixed">השהה</button>}
          {f.status !== "blocked" && <button onClick={() => changeStatus("blocked")} className="px-3 py-2 rounded-lg text-label-sm border border-error/30 text-error">חסום</button>}
        </div>
      </div>

      {/* Contract & commission */}
      <div className="glass-card rounded-2xl p-md">
        <h3 className="text-label-md text-primary-fixed uppercase tracking-wider mb-3 flex items-center gap-2"><Icon name="contract" className="text-[18px]" /> חוזה ועמלה</h3>
        {edit ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[11px] text-on-surface-variant block mb-1">אחוז עמלה (%)</label><input type="number" min={0} max={50} value={f.commissionRate} onChange={(e) => setF((x) => ({ ...x, commissionRate: Number(e.target.value) }))} className={fieldCls} /></div>
              <div><label className="text-[11px] text-on-surface-variant block mb-1">סוג חוזה</label><select value={f.contractType} onChange={(e) => setF((x) => ({ ...x, contractType: e.target.value as ContractType }))} className={`${fieldCls} appearance-none`}>{Object.entries(CONTRACT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label className="text-[11px] text-on-surface-variant block mb-1">תחילת חוזה</label><input type="date" value={f.contractStart} onChange={(e) => setF((x) => ({ ...x, contractStart: e.target.value }))} className={`${fieldCls} [color-scheme:dark]`} /></div>
              <div><label className="text-[11px] text-on-surface-variant block mb-1">סיום חוזה</label><input type="date" value={f.contractEnd} onChange={(e) => setF((x) => ({ ...x, contractEnd: e.target.value }))} className={`${fieldCls} [color-scheme:dark]`} /></div>
            </div>
            <div><label className="text-[11px] text-on-surface-variant block mb-1">הערות / תנאים מיוחדים</label><textarea value={f.contractNotes} onChange={(e) => setF((x) => ({ ...x, contractNotes: e.target.value }))} rows={2} className={fieldCls} /></div>
            <div className="flex gap-2">
              <button disabled={saving} onClick={save} className="bg-primary-fixed text-on-primary-fixed font-bold px-5 py-2 rounded-lg text-label-md disabled:opacity-50">{saving ? "שומר…" : "שמירה"}</button>
              <button onClick={() => setEdit(false)} className="px-4 py-2 text-on-surface-variant">ביטול</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><p className="text-[11px] text-on-surface-variant">אחוז עמלה</p><p className="text-primary-fixed font-bold text-lg">{f.commissionRate}%</p></div>
            <div><p className="text-[11px] text-on-surface-variant">סוג חוזה</p><p className="text-on-surface">{CONTRACT[f.contractType]}</p></div>
            <div><p className="text-[11px] text-on-surface-variant">תחילת חוזה</p><p className="text-on-surface">{fmtDate(f.contractStart || null)}</p></div>
            <div><p className="text-[11px] text-on-surface-variant">סיום חוזה</p><p className="text-on-surface">{fmtDate(f.contractEnd || null)}</p></div>
            {f.contractNotes && <div className="col-span-2 md:col-span-4"><p className="text-[11px] text-on-surface-variant">הערות</p><p className="text-on-surface-variant">{f.contractNotes}</p></div>}
          </div>
        )}
      </div>

      {/* Financial summary */}
      <div className="glass-card rounded-2xl p-md">
        <h3 className="text-label-md text-primary-fixed uppercase tracking-wider mb-3 flex items-center gap-2"><Icon name="monitoring" className="text-[18px]" /> סיכום פיננסי</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { l: "סך הכנסות", v: shekel(producer.revenue) },
            { l: "עמלות שגבית", v: shekel(commission), accent: true },
            { l: "עמלה ממוצעת/אירוע", v: shekel(avgCommission) },
            { l: "אירועים", v: String(producer.eventsCount) },
            { l: "כרטיסים שנמכרו", v: producer.tickets.toLocaleString() },
            { l: "יתרה לתשלום למפיק", v: shekel(owed) },
          ].map((m) => (
            <div key={m.l} className={`rounded-xl p-3 ${m.accent ? "bg-primary-fixed/10 border border-primary-fixed/20" : "bg-surface-container-low"}`}>
              <p className="text-[11px] text-on-surface-variant">{m.l}</p>
              <p className={`text-lg font-bold ${m.accent ? "text-primary-fixed" : "text-on-surface"}`}>{m.v}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-on-surface-variant mt-2">נטו למפיק: {shekel(producerNet)} · שולם עד היום: {shekel(producer.paidOut)}</p>
      </div>

      {/* Events table + chart */}
      <div className="glass-card rounded-2xl p-md">
        <h3 className="text-label-md text-primary-fixed uppercase tracking-wider mb-3 flex items-center gap-2"><Icon name="event" className="text-[18px]" /> אירועים ({events.length})</h3>
        {events.length === 0 ? <p className="text-on-surface-variant text-label-sm">אין אירועים משויכים עדיין.</p> : (
          <div className="space-y-2">
            {events.map((e) => (
              <div key={e.eventId} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-label-sm mb-1"><span className="text-on-surface truncate">{e.title} <span className="text-on-surface-variant">· {e.date}</span></span><span className="text-primary-fixed font-bold shrink-0">{shekel(e.revenue)}</span></div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-primary-fixed" style={{ width: `${(e.revenue / maxRev) * 100}%` }} /></div>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">{e.tickets} כרטיסים · עמלה {shekel(Math.round((e.revenue * f.commissionRate) / 100))}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top 5 + payments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-md">
          <h3 className="text-label-md text-primary-fixed uppercase tracking-wider mb-3 flex items-center gap-2"><Icon name="trophy" className="text-[18px]" /> טופ 5 אירועים</h3>
          {topEvents.length === 0 ? <p className="text-on-surface-variant text-label-sm">—</p> : topEvents.map((e, i) => (
            <div key={e.eventId} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
              <span className="text-label-sm text-on-surface flex items-center gap-2"><span className="text-primary-fixed-dim font-bold">{i + 1}</span> {e.title}</span>
              <span className="text-label-sm text-primary-fixed font-bold">{shekel(e.revenue)}</span>
            </div>
          ))}
        </div>
        <div className="glass-card rounded-2xl p-md">
          <h3 className="text-label-md text-primary-fixed uppercase tracking-wider mb-3 flex items-center gap-2"><Icon name="receipt_long" className="text-[18px]" /> דוח תשלומים</h3>
          {myPayments.length === 0 ? <p className="text-on-surface-variant text-label-sm">לא בוצעו תשלומים דרך המערכת.</p> : myPayments.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
              <div><p className="text-label-sm text-on-surface">{shekel(p.amount)} · {p.status === "paid" ? "שולם" : p.status}</p><p className="text-[10px] text-on-surface-variant">{new Date(p.created_at).toLocaleDateString("he-IL")}</p></div>
              {p.receipt_url && <a href={p.receipt_url} target="_blank" rel="noreferrer" className="text-primary-fixed text-label-sm hover:underline">אסמכתא</a>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

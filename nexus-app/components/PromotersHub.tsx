"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SafeImage } from "@/components/SafeImage";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import type { NexusEvent } from "@/lib/events";

type Promoter = { id: string; name: string; phone: string; img?: string; tickets: number; revenue: number; commissionPct: number; active: boolean; pending?: boolean; top?: boolean; line: string };

// A producer runs several "lines" (event brands), each with its own promoter team.
const LINES = ["Techno Underground", "Beach Vibes", "VIP Nights"];

const initialTeam: Promoter[] = [
  { id: "1", name: "נועה ארגמן", phone: "054-9988776", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcZpBGodozfR-K6jQjy5ONySeDIlCPbdZIi1GtBo0KTpBzYa7FvKCaBjWN3gnB23tU53uDben_yfjouXC0CpljugpXA7DVdsfNMCWuwsZvuuf5lNKS3X3AdHSZ2eS0hI5kl6WuJOTQTK_3aySA8f7vtAS3Tic-i0Zt72BD3YggGPPtr79NCCN2D8b0Qpvm_MRZVEO3Ug5OGwGqbQlUD0AHu3hY6rIBAeAtm410EA_-d2g91HomHUGzDCOKBMVxfR3IEqpYQrEecQ", tickets: 248, revenue: 28900, commissionPct: 10, active: true, top: true, line: "Techno Underground" },
  { id: "2", name: "עידן כהן", phone: "052-1122334", tickets: 112, revenue: 12450, commissionPct: 10, active: true, line: "Techno Underground" },
  { id: "3", name: "רועי לוי", phone: "058-5544332", tickets: 84, revenue: 9120, commissionPct: 8, active: true, line: "Beach Vibes" },
  { id: "4", name: "מאיה גרין", phone: "050-7788990", tickets: 142, revenue: 7400, commissionPct: 10, active: true, line: "VIP Nights" },
  { id: "5", name: "דניאל מזרחי", phone: "053-2211009", tickets: 0, revenue: 0, commissionPct: 10, active: false, pending: true, line: "Beach Vibes" },
];

const podium = [
  { rank: 2, name: "עידן כהן", amount: "₪12,450", tickets: 112, h: "h-24", color: "border-on-tertiary-container", fill: "bg-on-tertiary-container/25" },
  { rank: 1, name: "נועה ארגמן", amount: "₪28,900", tickets: 248, h: "h-32", color: "border-primary-fixed-dim", fill: "bg-primary-fixed-dim/25", big: true },
  { rank: 3, name: "רועי לוי", amount: "₪9,120", tickets: 84, h: "h-20", color: "border-secondary-fixed-dim", fill: "bg-secondary-fixed-dim/25" },
];
const ranking = [
  { rank: 4, name: "מאיה גרין", tickets: 142, amount: "₪7,400" },
  { rank: 5, name: "דניאל מזרחי", tickets: 118, amount: "₪6,250" },
];

type Competition = { title: string; prize: string; ends: string; progress: number; note: string };
const initialComps: Competition[] = [
  { title: "אלוף יולי", prize: "₪2,000 בונוס", ends: "12 ימים", progress: 72, note: "אתה במקום 3" },
  { title: "ספרינט סופ\"ש", prize: "כרטיסי VIP ×4", ends: "3 ימים", progress: 45, note: "מכור 20 כדי לזכות" },
];

const TABS = [
  { id: "overview", label: "סקירה" },
  { id: "team", label: "צוות" },
  { id: "assign", label: "שיבוץ" },
  { id: "leaderboard", label: "דירוג" },
  { id: "links", label: "לינקים" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function PromotersHub({ events, initialTab = "overview" }: { events: NexusEvent[]; initialTab?: TabId }) {
  const [tab, setTab] = useState<TabId>(initialTab);
  const [team, setTeam] = useState<Promoter[]>(initialTeam);
  const [comps, setComps] = useState<Competition[]>(initialComps);
  const [linkPromoter, setLinkPromoter] = useState(initialTeam[0].name);

  // Invite (full details) + approval link
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [lastInvite, setLastInvite] = useState<{ name: string; link: string } | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // AI share message
  const [promoName, setPromoName] = useState("");
  const [promoMsg, setPromoMsg] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [msgCopied, setMsgCopied] = useState(false);

  // Create-challenge
  const [cTitle, setCTitle] = useState("");
  const [cPrize, setCPrize] = useState("");
  const [cTarget, setCTarget] = useState("");
  const [cDays, setCDays] = useState("7");

  // Lines & event assignment
  const [lineFilter, setLineFilter] = useState<string>("all");
  const [inviteLine, setInviteLine] = useState<string>(LINES[0]);
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const moveLine = (id: string, line: string) => setTeam((t) => t.map((p) => (p.id === id ? { ...p, line } : p)));
  const assignToEvent = (eventId: string, pid: string) =>
    setAssignments((a) => ({ ...a, [eventId]: (a[eventId] || []).includes(pid) ? a[eventId] : [...(a[eventId] || []), pid] }));
  const unassignFromEvent = (eventId: string, pid: string) =>
    setAssignments((a) => ({ ...a, [eventId]: (a[eventId] || []).filter((x) => x !== pid) }));
  const rosterByLine = lineFilter === "all" ? team : team.filter((p) => p.line === lineFilter);

  const toggle = (id: string) => setTeam((t) => t.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  const invite = () => {
    if (!first.trim() || !last.trim() || !phone.trim()) return;
    const name = `${first.trim()} ${last.trim()}`;
    setTeam((t) => [...t, { id: String(Date.now()), name, phone: phone.trim(), tickets: 0, revenue: 0, commissionPct: 10, active: false, pending: true, line: inviteLine }]);
    setLastInvite({ name, link: `https://nexusevents.co.il/p/${encodeURIComponent(name)}` });
    setFirst(""); setLast(""); setPhone("");
  };
  const copyInviteLink = () => {
    if (!lastInvite) return;
    navigator.clipboard?.writeText(lastInvite.link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1500);
  };

  const genPromo = async () => {
    setPromoLoading(true);
    try {
      const res = await fetch("/api/ai/copy", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind: "promo", promoterName: promoName.trim() || undefined, title: "האירוע הקרוב שלך", city: "תל אביב" }) });
      const data = await res.json();
      if (data?.text) setPromoMsg(data.text);
    } catch {
      setPromoMsg(`🔥 ${promoName ? promoName + ", " : ""}אל תפספסו את האירוע הקרוב!\nכרטיסים דרך הלינק האישי שלי 👇`);
    } finally {
      setPromoLoading(false);
    }
  };
  const copyPromo = () => { navigator.clipboard?.writeText(promoMsg); setMsgCopied(true); setTimeout(() => setMsgCopied(false), 1500); };

  const createChallenge = () => {
    if (!cTitle.trim() || !cPrize.trim()) return;
    setComps((l) => [{ title: cTitle.trim(), prize: cPrize.trim(), ends: `${cDays || "7"} ימים`, progress: 0, note: cTarget ? `יעד: ${cTarget} כרטיסים` : "אתגר חדש — קדימה!" }, ...l]);
    setCTitle(""); setCPrize(""); setCTarget(""); setCDays("7");
  };

  const activeCount = team.filter((p) => p.active).length;
  const totalTickets = team.reduce((s, p) => s + p.tickets, 0);
  const totalCommission = team.reduce((s, p) => s + Math.round((p.revenue * p.commissionPct) / 100), 0);

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop max-w-2xl">
      <header className="mb-md">
        <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary-fixed">יחצנים · ביצועים</h1>
        <p className="text-body-md text-on-surface-variant">צוות, דאשבורד, דירוג ותחרויות — הכל במקום אחד.</p>
      </header>

      <div className="flex gap-1.5 mb-lg p-1 bg-surface-container rounded-xl">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 py-2 rounded-lg text-label-sm md:text-label-md transition-all ${tab === t.id ? "bg-primary-fixed-dim text-on-primary-fixed shadow-lg font-bold" : "text-on-surface-variant hover:bg-white/5"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ───── Overview ───── */}
      {tab === "overview" && (
        <section className="space-y-gutter">
          <div className="grid grid-cols-2 gap-gutter">
            <div className="glass-card p-md rounded-xl"><span className="text-on-surface-variant text-label-sm block mb-1">רווחים היום</span><div className="text-headline-md text-primary-fixed-dim">₪1,420</div></div>
            <div className="glass-card p-md rounded-xl"><span className="text-on-surface-variant text-label-sm block mb-1">כרטיסים שנמכרו</span><div className="text-headline-md text-primary-fixed-dim">42</div></div>
          </div>
          <div className="grid grid-cols-3 gap-gutter">
            {[
              { icon: "ads_click", value: "1,204", label: "קליקים", tone: "text-secondary-fixed-dim" },
              { icon: "leaderboard", value: "8.4%", label: "יחס המרה", tone: "text-primary-fixed-dim" },
              { icon: "link", value: "6", label: "לינקים פעילים", tone: "text-tertiary-fixed-dim" },
            ].map((s) => (
              <div key={s.label} className="glass-card p-sm rounded-xl flex flex-col items-center text-center">
                <Icon name={s.icon} className={`${s.tone} mb-1`} /><span className="text-headline-md">{s.value}</span><span className="text-on-surface-variant text-label-sm">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="glass-card p-md rounded-xl">
            <div className="flex items-center justify-between mb-md">
              <h3 className="text-headline-md text-primary">פירוט מכירות יחצנים</h3>
              <Link href="/producer/wallet" className="text-label-sm text-primary-fixed flex items-center gap-1 hover:underline"><Icon name="account_balance_wallet" className="text-[16px]" /> פעולות כסף בארנק</Link>
            </div>
            <div className="space-y-2">
              {[...team].filter((p) => !p.pending).sort((a, b) => b.revenue - a.revenue).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <span className="w-6 text-center text-on-surface-variant font-bold">{i + 1}</span>
                  <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant shrink-0"><Icon name="person" /></div>
                  <div className="flex-1 min-w-0"><p className="text-label-md text-white truncate">{p.name}</p><p className="text-label-sm text-on-surface-variant">{p.tickets} כרטיסים</p></div>
                  <span className="text-label-md text-primary-fixed-dim font-bold">₪{p.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-md pt-md border-t border-white/5">
              <span className="text-label-md text-on-surface-variant">סך מכירות היחצנים</span>
              <span className="text-headline-md text-primary">₪{team.reduce((s, p) => s + p.revenue, 0).toLocaleString()}</span>
            </div>
          </div>
        </section>
      )}

      {/* ───── Team management ───── */}
      {tab === "team" && (
        <section className="space-y-gutter">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {[
              { label: "יחצנים פעילים", value: String(activeCount), tone: "text-primary-fixed" },
              { label: "כרטיסים שמכרו", value: totalTickets.toLocaleString(), tone: "text-secondary-fixed" },
              { label: "עמלות ששולמו", value: `₪${totalCommission.toLocaleString()}`, tone: "text-tertiary-fixed-dim" },
              { label: "סך הצוות", value: String(team.length), tone: "text-on-surface" },
            ].map((s) => (
              <div key={s.label} className="glass-card p-md rounded-xl flex flex-col justify-between"><span className="text-label-sm text-on-surface-variant">{s.label}</span><span className={`text-headline-md mt-1 ${s.tone}`}>{s.value}</span></div>
            ))}
          </div>

          {/* Invite — full details */}
          <div className="glass-card p-md rounded-xl">
            <h3 className="text-label-md text-primary-fixed uppercase tracking-wider mb-3">הזמנת יחצן חדש</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="שם פרטי" className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary-fixed outline-none" />
              <input value={last} onChange={(e) => setLast(e.target.value)} placeholder="שם משפחה" className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary-fixed outline-none" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" placeholder="טלפון" className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary-fixed outline-none" />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-label-sm text-on-surface-variant whitespace-nowrap">שייך לליין</span>
              <select value={inviteLine} onChange={(e) => setInviteLine(e.target.value)} className="flex-1 bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none">
                {LINES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button onClick={invite} disabled={!first.trim() || !last.trim() || !phone.trim()} className="w-full mt-3 bg-primary-container text-on-primary-container font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-neon-primary disabled:opacity-40 disabled:shadow-none">
              <Icon name="person_add" /> שלח הזמנה
            </button>
            <p className="text-[10px] text-on-surface-variant/60 mt-2">היחצן יקבל לינק אישור — בפתיחתו בדפדפן ייפתחו לו סטטוס המכירות, הגרף והלינקים שלו.</p>

            {lastInvite && (
              <div className="mt-3 p-3 bg-primary-container/10 border border-primary-fixed/30 rounded-lg">
                <p className="text-label-sm text-primary-fixed mb-1 flex items-center gap-1"><Icon name="link" className="text-[16px]" /> לינק האישור של {lastInvite.name}</p>
                <div className="flex items-center gap-2">
                  <input readOnly value={lastInvite.link} className="flex-1 bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-label-sm text-on-surface-variant font-mono outline-none" dir="ltr" />
                  <button onClick={copyInviteLink} className="shrink-0 w-9 h-9 rounded-lg bg-surface-container-high border border-white/10 flex items-center justify-center text-primary active:scale-95"><Icon name={linkCopied ? "check" : "content_copy"} className={`text-[18px] ${linkCopied ? "text-primary-fixed" : ""}`} /></button>
                </div>
              </div>
            )}
          </div>

          {/* AI share message */}
          <div className="glass-card p-md rounded-xl border border-primary-fixed/20">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
              <h3 className="text-label-md text-primary-fixed uppercase tracking-wider flex items-center gap-2"><Icon name="auto_awesome" fill /> הודעת שיתוף ליחצנים</h3>
              <button onClick={genPromo} disabled={promoLoading} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-primary-fixed/20 to-secondary-fixed/20 border border-primary-fixed/40 text-primary-fixed text-label-sm hover:from-primary-fixed/30 hover:to-secondary-fixed/30 transition-all active:scale-95 disabled:opacity-60"><Icon name="auto_awesome" className={promoLoading ? "animate-spin text-[16px]" : "text-[16px]"} fill /> {promoLoading ? "יוצר…" : "צור עם AI"}</button>
            </div>
            <input value={promoName} onChange={(e) => setPromoName(e.target.value)} placeholder="שם היחצן (אופציונלי, לפנייה אישית)" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:border-primary-fixed outline-none mb-3" />
            {promoMsg ? (
              <div className="flex items-start gap-2">
                <textarea value={promoMsg} onChange={(e) => setPromoMsg(e.target.value)} rows={4} className="flex-1 bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-body-md text-on-surface resize-none focus:border-primary-fixed outline-none" />
                <button onClick={copyPromo} className="shrink-0 w-10 h-10 rounded-lg bg-surface-container-high border border-white/10 flex items-center justify-center text-primary active:scale-95"><Icon name={msgCopied ? "check" : "content_copy"} className={`text-[18px] ${msgCopied ? "text-primary-fixed" : ""}`} /></button>
              </div>
            ) : (
              <p className="text-[11px] text-on-surface-variant/60 flex items-center gap-1"><Icon name="tips_and_updates" className="text-[14px]" /> צור הודעת וואטסאפ מוכנה שהיחצנים ישלחו ללקוחות.</p>
            )}
          </div>

          {/* Team list */}
          <div>
            <h3 className="text-headline-md text-primary mb-md">הצוות שלי</h3>
            <div className="space-y-md">
              {team.map((p) => {
                const commission = Math.round((p.revenue * p.commissionPct) / 100);
                return (
                  <div key={p.id} className={`glass-card rounded-2xl p-md ${p.pending ? "border-secondary-fixed/20" : "hover:border-primary-fixed/30"} transition-colors`}>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4 min-w-[180px]">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary-fixed/30">
                            {p.img ? <SafeImage className="w-full h-full object-cover" src={p.img} alt={p.name} /> : <div className="w-full h-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant"><Icon name="person" /></div>}
                          </div>
                          {p.top && <div className="absolute -bottom-1 -left-1 bg-primary-fixed text-black rounded-full p-0.5 border-2 border-background"><Icon name="star" className="text-[14px] block" fill /></div>}
                        </div>
                        <div>
                          <p className="text-label-md text-white flex items-center gap-2">{p.name}{p.top && <span className="text-[10px] text-primary-fixed font-bold">מוביל</span>}</p>
                          <p className="text-label-sm text-on-surface-variant">{p.phone}</p>
                          {p.pending && <span className="inline-block mt-1 text-[10px] bg-secondary-fixed/10 text-secondary-fixed px-2 py-0.5 rounded border border-secondary-fixed/20">ממתין לאישור</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-center">
                        <div><p className="text-[10px] text-on-surface-variant uppercase">כרטיסים</p><p className="text-label-md text-white font-bold">{p.tickets}</p></div>
                        <div><p className="text-[10px] text-on-surface-variant uppercase">הכנסה</p><p className="text-label-md text-secondary-fixed font-bold">₪{p.revenue.toLocaleString()}</p></div>
                        <div><p className="text-[10px] text-on-surface-variant uppercase">עמלה ({p.commissionPct}%)</p><p className="text-label-md text-primary-fixed font-bold">₪{commission.toLocaleString()}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <a href={`/p/${encodeURIComponent(p.name)}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-surface-container-high border border-white/10 text-primary px-3 py-2 rounded-lg text-label-sm hover:border-primary-fixed/40 transition-colors"><Icon name="open_in_new" className="text-[18px]" /> הפורטל שלו</a>
                        <button onClick={() => toggle(p.id)} className={`w-11 h-6 rounded-full relative shrink-0 ${p.active ? "bg-primary-fixed" : "bg-surface-container-highest"}`} aria-label="פעיל"><span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${p.active ? "right-0.5" : "right-[22px]"}`} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ───── Lines & event assignment ───── */}
      {tab === "assign" && (
        <section className="space-y-gutter">
          {/* Line filter */}
          <div className="glass-card p-md rounded-xl">
            <p className="text-label-md text-on-surface-variant mb-2 flex items-center gap-1.5"><Icon name="filter_list" className="text-primary-fixed text-[18px]" /> סינון לפי ליין</p>
            <div className="flex flex-wrap gap-2">
              {["all", ...LINES].map((l) => {
                const on = lineFilter === l;
                return (
                  <button key={l} onClick={() => setLineFilter(l)} className={`px-3 py-1.5 rounded-full border text-label-sm transition-all flex items-center gap-1 ${on ? "border-primary-fixed bg-primary-container/15 text-primary-fixed font-bold" : "border-white/10 bg-white/5 text-on-surface-variant hover:border-primary-fixed/40"}`}>
                    {on && <Icon name="check" className="text-[14px]" />}{l === "all" ? "כל הליינים" : l}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Roster — move promoters between lines */}
          <div className="glass-card p-md rounded-xl">
            <h3 className="text-headline-md text-primary mb-md">הצוות {lineFilter !== "all" && <span className="text-on-surface-variant text-label-md">· {lineFilter}</span>}</h3>
            <div className="space-y-2">
              {rosterByLine.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant shrink-0 overflow-hidden">
                    {p.img ? <SafeImage className="w-full h-full object-cover" src={p.img} alt={p.name} /> : <Icon name="person" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-label-md text-white truncate">{p.name}</p>
                    <p className="text-label-sm text-on-surface-variant">{p.tickets} כרטיסים</p>
                  </div>
                  <select value={p.line} onChange={(e) => moveLine(p.id, e.target.value)} className="bg-surface-container-low border border-white/10 rounded-lg px-2 py-1.5 text-label-sm text-primary focus:border-primary-fixed outline-none" aria-label="העבר לליין">
                    {LINES.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              ))}
              {rosterByLine.length === 0 && <p className="text-center text-on-surface-variant/60 py-4">אין יחצנים בליין זה</p>}
            </div>
          </div>

          {/* Event assignment — tag promoters onto each event */}
          <div>
            <h3 className="text-headline-md text-primary mb-md">שיבוץ יחצנים לאירועים</h3>
            <div className="space-y-md">
              {events.map((e) => {
                const assigned = assignments[e.id] || [];
                const assignedPromoters = team.filter((p) => assigned.includes(p.id));
                const available = rosterByLine.filter((p) => !assigned.includes(p.id));
                return (
                  <div key={e.id} className="glass-card rounded-xl p-md">
                    <div className="flex items-center gap-3 mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="w-12 h-12 rounded-lg object-cover" src={e.image} alt={e.title} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-label-md text-primary truncate">{e.title}</h4>
                        <p className="text-label-sm text-on-surface-variant">{e.venue} • {e.date} · {assignedPromoters.length} יחצנים</p>
                      </div>
                    </div>

                    {/* Tagged promoters */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {assignedPromoters.map((p) => (
                        <span key={p.id} className="inline-flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full bg-primary-fixed/15 border border-primary-fixed/40 text-primary-fixed text-label-sm">
                          {p.name}
                          <button onClick={() => unassignFromEvent(e.id, p.id)} className="hover:text-error" aria-label="הסר"><Icon name="close" className="text-[15px] block" /></button>
                        </span>
                      ))}
                      {assignedPromoters.length === 0 && <span className="text-label-sm text-on-surface-variant/50">אין יחצנים משובצים עדיין</span>}
                    </div>

                    {/* Add promoter */}
                    <select
                      value=""
                      onChange={(ev) => { if (ev.target.value) assignToEvent(e.id, ev.target.value); }}
                      className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-label-md text-on-surface focus:border-primary-fixed outline-none"
                    >
                      <option value="">＋ שבץ יחצן{lineFilter !== "all" ? ` מ-${lineFilter}` : ""}…</option>
                      {available.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.line}</option>)}
                    </select>
                  </div>
                );
              })}
              {events.length === 0 && <p className="text-center text-on-surface-variant/60 py-8">אין אירועים עדיין</p>}
            </div>
          </div>
        </section>
      )}

      {/* ───── Leaderboard + competitions ───── */}
      {tab === "leaderboard" && (
        <section className="space-y-lg">
          <div>
            <div className="flex items-end justify-between gap-2 mb-6">
              {podium.map((p) => (
                <div key={p.rank} className={`flex flex-col items-center ${p.big ? "flex-[1.2] -mb-2" : "flex-1"}`}>
                  <div className={`relative mb-2 rounded-full overflow-hidden border-2 ${p.color} ${p.big ? "w-16 h-16" : "w-14 h-14"} bg-surface-container-highest`}><div className="w-full h-full flex items-center justify-center text-on-surface-variant"><Icon name="person" /></div></div>
                  <span className={`text-label-md truncate w-full text-center ${p.big ? "text-primary-fixed-dim font-bold" : "text-white"}`}>{p.name}</span>
                  <span className="text-label-sm text-on-surface-variant mb-2">{p.amount} · {p.tickets} כרט׳</span>
                  <div className={`w-full ${p.h} rounded-t-xl border-t-2 ${p.color} ${p.fill} flex flex-col items-center justify-start pt-2 gap-0.5`}>
                    <span className="text-[12px] font-bold text-white">#{p.rank}</span>
                    <span className="text-[10px] text-on-surface-variant">{p.tickets} כרטיסים</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {ranking.map((r) => (
                <div key={r.rank} className="glass-card rounded-xl p-4 flex items-center gap-4">
                  <span className="w-6 text-on-surface-variant font-bold">{r.rank}</span>
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant"><Icon name="person" /></div>
                  <div className="flex-1"><p className="text-label-md text-white">{r.name}</p><p className="text-label-sm text-on-surface-variant">{r.tickets} כרטיסים</p></div>
                  <p className="text-label-md text-white">{r.amount}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-md rounded-xl border-primary-fixed/20">
            <h3 className="text-headline-md text-primary mb-md flex items-center gap-2"><Icon name="emoji_events" className="text-primary-fixed" fill /> השק תחרות יחצנים</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={cTitle} onChange={(e) => setCTitle(e.target.value)} placeholder="שם התחרות (אלוף אוגוסט)" className="bg-surface-container-low border border-white/10 rounded-lg p-3 text-on-surface focus:border-primary-fixed outline-none" />
              <input value={cPrize} onChange={(e) => setCPrize(e.target.value)} placeholder="פרס (₪2,000 בונוס)" className="bg-surface-container-low border border-white/10 rounded-lg p-3 text-on-surface focus:border-primary-fixed outline-none" />
              <input type="number" value={cTarget} onChange={(e) => setCTarget(e.target.value)} placeholder="יעד כרטיסים" className="bg-surface-container-low border border-white/10 rounded-lg p-3 text-on-surface focus:border-primary-fixed outline-none" />
              <div className="flex items-center gap-2"><span className="text-label-sm text-on-surface-variant whitespace-nowrap">נמשכת</span><input type="number" value={cDays} onChange={(e) => setCDays(e.target.value)} className="w-20 bg-surface-container-low border border-white/10 rounded-lg p-3 text-center text-on-surface focus:border-primary-fixed outline-none" /><span className="text-label-sm text-on-surface-variant">ימים</span></div>
            </div>
            <button onClick={createChallenge} disabled={!cTitle.trim() || !cPrize.trim()} className="w-full mt-3 bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 transition-all disabled:opacity-40 disabled:shadow-none"><Icon name="rocket_launch" /> השק תחרות</button>
          </div>

          <div className="space-y-gutter">
            <h3 className="text-headline-md text-primary">תחרויות פעילות</h3>
            {comps.map((c, i) => (
              <div key={i} className="glass-card p-md rounded-xl border-secondary-fixed-dim/20">
                <div className="flex justify-between items-start mb-3">
                  <div><h4 className="text-headline-md text-primary flex items-center gap-2"><Icon name="emoji_events" className="text-primary-fixed-dim" fill /> {c.title}</h4><p className="text-label-sm text-secondary-fixed-dim mt-1">פרס: {c.prize}</p></div>
                  <span className="text-[10px] bg-error/10 text-error px-2 py-1 rounded-full border border-error/20">נותרו {c.ends}</span>
                </div>
                <div className="flex items-center gap-3"><div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-primary-fixed-dim" style={{ width: `${c.progress}%` }} /></div><span className="text-label-sm text-primary-fixed-dim font-bold">{c.progress}%</span></div>
                <p className="text-label-sm text-on-surface-variant mt-2">{c.note}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ───── Personal links ───── */}
      {tab === "links" && (
        <section className="space-y-gutter">
          <h3 className="text-headline-md text-primary">לינקים אישיים לכל אירוע</h3>
          <div className="glass-card p-md rounded-xl">
            <p className="text-label-md text-on-surface-variant mb-2 flex items-center gap-1.5"><Icon name="person_pin" className="text-primary-fixed text-[18px]" /> בחר יחצן להפקת הלינק</p>
            <div className="flex flex-wrap gap-2">
              {team.map((p) => {
                const on = linkPromoter === p.name;
                return <button key={p.id} onClick={() => setLinkPromoter(p.name)} className={`px-3 py-1.5 rounded-full border text-label-sm transition-all flex items-center gap-1 ${on ? "border-primary-fixed bg-primary-container/15 text-primary-fixed font-bold" : "border-white/10 bg-white/5 text-on-surface-variant hover:border-primary-fixed/40"}`}>{on && <Icon name="check" className="text-[14px]" />}{p.name}</button>;
              })}
            </div>
          </div>
          {events.map((e) => (
            <div key={e.id} className="glass-card rounded-xl overflow-hidden">
              <div className="h-28 w-full relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover opacity-60" src={e.image} alt={e.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent" />
              </div>
              <div className="p-md">
                <div className="flex justify-between items-start mb-sm">
                  <div><h4 className="text-[18px] text-primary">{e.title}</h4><p className="text-on-surface-variant text-label-sm">{e.venue}, {e.city}</p></div>
                  <div className="text-left"><div className="text-label-md text-primary-fixed-dim">₪2,400</div><div className="text-[10px] text-on-surface-variant">עמלה שנצברה</div></div>
                </div>
                <CopyLinkButton eventId={e.id} promoter={linkPromoter} />
              </div>
            </div>
          ))}
          {events.length === 0 && <p className="text-center text-on-surface-variant/60 py-8">אין אירועים עדיין</p>}
        </section>
      )}
    </main>
  );
}

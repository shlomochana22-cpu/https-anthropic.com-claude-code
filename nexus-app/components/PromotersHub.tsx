"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import type { NexusEvent } from "@/lib/events";

const podium = [
  { rank: 2, name: "עידן כהן", amount: "₪12,450", h: "h-32", color: "border-on-tertiary-container" },
  { rank: 1, name: "נועה ארגמן", amount: "₪28,900", h: "h-44", color: "border-primary-fixed-dim", big: true },
  { rank: 3, name: "רועי לוי", amount: "₪9,120", h: "h-24", color: "border-secondary-fixed-dim" },
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
  { id: "leaderboard", label: "לידרבורד ותחרויות" },
  { id: "links", label: "לינקים אישיים" },
] as const;

export function PromotersHub({ events }: { events: NexusEvent[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("overview");
  const [comps, setComps] = useState<Competition[]>(initialComps);

  // Create-challenge form (the new feature tying dashboard + leaderboard together)
  const [cTitle, setCTitle] = useState("");
  const [cPrize, setCPrize] = useState("");
  const [cTarget, setCTarget] = useState("");
  const [cDays, setCDays] = useState("7");

  const createChallenge = () => {
    if (!cTitle.trim() || !cPrize.trim()) return;
    setComps((l) => [
      { title: cTitle.trim(), prize: cPrize.trim(), ends: `${cDays || "7"} ימים`, progress: 0, note: cTarget ? `יעד: ${cTarget} כרטיסים` : "אתגר חדש — קדימה!" },
      ...l,
    ]);
    setCTitle(""); setCPrize(""); setCTarget(""); setCDays("7");
  };

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop max-w-2xl">
      <header className="mb-md">
        <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary-fixed">יחצנים · ביצועים</h1>
        <p className="text-body-md text-on-surface-variant">דאשבורד, דירוג ותחרויות — הכל במקום אחד.</p>
      </header>

      <div className="flex gap-2 mb-lg p-1 bg-surface-container rounded-xl">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-label-sm md:text-label-md transition-all ${tab === t.id ? "bg-primary-fixed-dim text-on-primary-fixed shadow-lg font-bold" : "text-on-surface-variant hover:bg-white/5"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ───── Overview (the former promoter dashboard) ───── */}
      {tab === "overview" && (
        <section className="space-y-gutter">
          <div className="grid grid-cols-2 gap-gutter">
            <div className="glass-card p-md rounded-xl">
              <span className="text-on-surface-variant text-label-sm block mb-1">רווחים היום</span>
              <div className="text-headline-md text-primary-fixed-dim">₪1,420</div>
            </div>
            <div className="glass-card p-md rounded-xl">
              <span className="text-on-surface-variant text-label-sm block mb-1">כרטיסים שנמכרו</span>
              <div className="text-headline-md text-primary-fixed-dim">42</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-gutter">
            {[
              { icon: "ads_click", value: "1,204", label: "קליקים", tone: "text-secondary-fixed-dim" },
              { icon: "leaderboard", value: "8.4%", label: "יחס המרה", tone: "text-primary-fixed-dim" },
              { icon: "link", value: "6", label: "לינקים פעילים", tone: "text-tertiary-fixed-dim" },
            ].map((s) => (
              <div key={s.label} className="glass-card p-sm rounded-xl flex flex-col items-center text-center">
                <Icon name={s.icon} className={`${s.tone} mb-1`} />
                <span className="text-headline-md">{s.value}</span>
                <span className="text-on-surface-variant text-label-sm">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="glass-card p-md rounded-xl border-primary-fixed-dim/20">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-label-md text-on-surface-variant uppercase tracking-wider mb-1">יתרה לתשלום</h2>
                <div className="text-headline-xl text-primary neon-glow">₪12,850</div>
              </div>
              <Link href="/producer/wallet" className="bg-primary-fixed-dim text-on-primary-fixed px-md py-sm rounded-full text-label-md active:scale-95 transition-transform shadow-neon-primary">
                משיכה
              </Link>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 text-center border-primary-fixed-dim/30">
            <p className="text-label-md text-on-surface-variant mb-1">הדירוג שלי השבוע</p>
            <p className="text-5xl font-extrabold text-primary-fixed-dim neon-glow">#12</p>
            <p className="text-label-sm text-on-surface-variant mt-1">מתוך 86 יחצנים פעילים · חסרים 5 כרטיסים למקום ה-11</p>
          </div>
        </section>
      )}

      {/* ───── Leaderboard + competitions (with the new challenge creator) ───── */}
      {tab === "leaderboard" && (
        <section className="space-y-lg">
          <div>
            <div className="flex items-end justify-between gap-2 mb-8">
              {podium.map((p) => (
                <div key={p.rank} className={`flex flex-col items-center ${p.big ? "flex-[1.2] -mb-2" : "flex-1"}`}>
                  <div className={`relative mb-3 rounded-full overflow-hidden border-2 ${p.color} ${p.big ? "w-20 h-20" : "w-16 h-16"} bg-surface-container-highest`}>
                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant"><Icon name="person" /></div>
                  </div>
                  <span className={`text-label-md mb-1 truncate w-full text-center ${p.big ? "text-primary-fixed-dim font-bold" : "text-white"}`}>{p.name}</span>
                  <span className="text-label-sm text-on-surface-variant mb-4">{p.amount}</span>
                  <div className={`w-full ${p.h} glass-card rounded-t-xl border-t-2 ${p.color}`} />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {ranking.map((r) => (
                <div key={r.rank} className="glass-card rounded-xl p-4 flex items-center gap-4">
                  <span className="w-6 text-on-surface-variant font-bold">{r.rank}</span>
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant"><Icon name="person" /></div>
                  <div className="flex-1">
                    <p className="text-label-md text-white">{r.name}</p>
                    <p className="text-label-sm text-on-surface-variant">{r.tickets} כרטיסים</p>
                  </div>
                  <p className="text-label-md text-white">{r.amount}</p>
                </div>
              ))}
              <div className="bg-surface-container-high border-2 border-primary-fixed-dim/30 rounded-xl p-4 flex items-center gap-4">
                <span className="w-6 text-primary-fixed-dim font-extrabold">12</span>
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-fixed-dim border-2 border-primary-fixed-dim"><Icon name="person" /></div>
                <div className="flex-1">
                  <p className="text-label-md text-primary-fixed-dim font-bold">אני (יוסי)</p>
                  <p className="text-label-sm text-primary-fixed-dim/60">48 כרטיסים</p>
                </div>
                <p className="text-label-md text-primary-fixed-dim font-bold">₪3,120</p>
              </div>
            </div>
          </div>

          {/* New feature: create a challenge */}
          <div className="glass-card p-md rounded-xl border-primary-fixed/20">
            <h3 className="text-headline-md text-primary mb-md flex items-center gap-2"><Icon name="emoji_events" className="text-primary-fixed" fill /> השק תחרות יחצנים</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={cTitle} onChange={(e) => setCTitle(e.target.value)} placeholder="שם התחרות (אלוף אוגוסט)" className="bg-surface-container-low border border-white/10 rounded-lg p-3 text-on-surface focus:border-primary-fixed outline-none" />
              <input value={cPrize} onChange={(e) => setCPrize(e.target.value)} placeholder="פרס (₪2,000 בונוס)" className="bg-surface-container-low border border-white/10 rounded-lg p-3 text-on-surface focus:border-primary-fixed outline-none" />
              <input type="number" value={cTarget} onChange={(e) => setCTarget(e.target.value)} placeholder="יעד כרטיסים" className="bg-surface-container-low border border-white/10 rounded-lg p-3 text-on-surface focus:border-primary-fixed outline-none" />
              <div className="flex items-center gap-2">
                <span className="text-label-sm text-on-surface-variant whitespace-nowrap">נמשכת</span>
                <input type="number" value={cDays} onChange={(e) => setCDays(e.target.value)} className="w-20 bg-surface-container-low border border-white/10 rounded-lg p-3 text-center text-on-surface focus:border-primary-fixed outline-none" />
                <span className="text-label-sm text-on-surface-variant">ימים</span>
              </div>
            </div>
            <button onClick={createChallenge} disabled={!cTitle.trim() || !cPrize.trim()} className="w-full mt-3 bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 transition-all disabled:opacity-40 disabled:shadow-none">
              <Icon name="rocket_launch" /> השק תחרות
            </button>
          </div>

          {/* Active competitions */}
          <div className="space-y-gutter">
            <h3 className="text-headline-md text-primary">תחרויות פעילות</h3>
            {comps.map((c, i) => (
              <div key={i} className="glass-card p-md rounded-xl border-secondary-fixed-dim/20">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-headline-md text-primary flex items-center gap-2"><Icon name="emoji_events" className="text-primary-fixed-dim" fill /> {c.title}</h4>
                    <p className="text-label-sm text-secondary-fixed-dim mt-1">פרס: {c.prize}</p>
                  </div>
                  <span className="text-[10px] bg-error/10 text-error px-2 py-1 rounded-full border border-error/20">נותרו {c.ends}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-primary-fixed-dim" style={{ width: `${c.progress}%` }} /></div>
                  <span className="text-label-sm text-primary-fixed-dim font-bold">{c.progress}%</span>
                </div>
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
          {events.map((e) => (
            <div key={e.id} className="glass-card rounded-xl overflow-hidden">
              <div className="h-28 w-full relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover opacity-60" src={e.image} alt={e.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent" />
              </div>
              <div className="p-md">
                <div className="flex justify-between items-start mb-sm">
                  <div>
                    <h4 className="text-[18px] text-primary">{e.title}</h4>
                    <p className="text-on-surface-variant text-label-sm">{e.venue}, {e.city}</p>
                  </div>
                  <div className="text-left">
                    <div className="text-label-md text-primary-fixed-dim">₪2,400</div>
                    <div className="text-[10px] text-on-surface-variant">עמלה שנצברה</div>
                  </div>
                </div>
                <CopyLinkButton eventId={e.id} />
              </div>
            </div>
          ))}
          {events.length === 0 && <p className="text-center text-on-surface-variant/60 py-8">אין אירועים עדיין</p>}
        </section>
      )}
    </main>
  );
}

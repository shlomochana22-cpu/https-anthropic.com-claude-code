"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

const podium = [
  { rank: 2, name: "עידן כהן", amount: "₪12,450", h: "h-32", color: "border-on-tertiary-container", chip: "bg-on-tertiary-container" },
  { rank: 1, name: "נועה ארגמן", amount: "₪28,900", h: "h-44", color: "border-primary-fixed-dim", chip: "bg-primary-fixed-dim text-on-primary-fixed", big: true },
  { rank: 3, name: "רועי לוי", amount: "₪9,120", h: "h-24", color: "border-secondary-fixed-dim", chip: "bg-secondary-fixed-dim" },
];
const rows = [
  { rank: 4, name: "מאיה גרין", tickets: 142, amount: "₪7,400" },
  { rank: 5, name: "דניאל מזרחי", tickets: 118, amount: "₪6,250" },
];
const competitions = [
  { title: "אלוף יולי", prize: "₪2,000 בונוס", ends: "12 ימים", progress: 72, note: "אתה במקום 3" },
  { title: "ספרינט סופ\"ש", prize: "כרטיסי VIP ×4", ends: "3 ימים", progress: 45, note: "מכור 20 כדי לזכות" },
];

const TABS = ["דירוג יחצנים", "הביצועים שלי", "תחרויות"] as const;

export default function LeaderboardPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("דירוג יחצנים");

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop max-w-2xl">
      <div className="flex gap-2 mb-8 p-1 bg-surface-container rounded-xl">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-label-md transition-all ${tab === t ? "bg-primary-fixed-dim text-on-primary-fixed shadow-lg font-bold" : "text-on-surface-variant hover:bg-white/5"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "דירוג יחצנים" && (
        <>
          <section className="flex items-end justify-between gap-2 mb-10">
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
          </section>

          <h3 className="text-headline-md text-white mb-4">דירוג מלא</h3>
          <div className="space-y-3">
            {rows.map((r) => (
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
            <div className="relative bg-surface-container-high border-2 border-primary-fixed-dim/30 rounded-xl p-4 flex items-center gap-4">
              <span className="w-6 text-primary-fixed-dim font-extrabold">12</span>
              <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-fixed-dim border-2 border-primary-fixed-dim"><Icon name="person" /></div>
              <div className="flex-1">
                <p className="text-label-md text-primary-fixed-dim font-bold">אני (יוסי)</p>
                <p className="text-label-sm text-primary-fixed-dim/60">48 כרטיסים</p>
              </div>
              <div className="text-left">
                <p className="text-label-md text-primary-fixed-dim font-bold">₪3,120</p>
                <span className="text-[10px] text-primary-fixed-dim/50 font-bold uppercase tracking-widest">אתה כאן</span>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === "הביצועים שלי" && (
        <section className="space-y-gutter">
          <div className="glass-card rounded-2xl p-6 text-center border-primary-fixed-dim/30">
            <p className="text-label-md text-on-surface-variant mb-1">הדירוג שלי השבוע</p>
            <p className="text-6xl font-extrabold text-primary-fixed-dim neon-glow">#12</p>
            <p className="text-label-sm text-on-surface-variant mt-1">מתוך 86 יחצנים פעילים</p>
          </div>
          <div className="grid grid-cols-2 gap-gutter">
            {[
              { label: "כרטיסים שמכרתי", value: "48", icon: "confirmation_number" },
              { label: "עמלות שצברתי", value: "₪3,120", icon: "payments" },
              { label: "יחס המרה", value: "8.4%", icon: "leaderboard" },
              { label: "לינקים פעילים", value: "6", icon: "link" },
            ].map((s) => (
              <div key={s.label} className="glass-card p-md rounded-xl">
                <Icon name={s.icon} className="text-primary-fixed-dim mb-2" />
                <p className="text-headline-md text-primary">{s.value}</p>
                <p className="text-label-sm text-on-surface-variant">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="glass-card p-md rounded-xl">
            <p className="text-label-md text-on-surface mb-2">עד למקום ה-11 חסרים לך</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-primary-fixed-dim w-[80%]" /></div>
              <span className="text-label-md text-primary-fixed-dim font-bold">5 כרטיסים</span>
            </div>
          </div>
        </section>
      )}

      {tab === "תחרויות" && (
        <section className="space-y-gutter">
          {competitions.map((c) => (
            <div key={c.title} className="glass-card p-md rounded-xl border-secondary-fixed-dim/20">
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
        </section>
      )}
    </main>
  );
}

"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

const segments = [
  { label: "חובבי טכנו", members: "1.2k", icon: "hub" },
  { label: "גילאי 24-35", members: "3.8k", icon: "groups" },
  { label: "מחזיקי VIP Pass", members: "420", icon: "workspace_premium" },
];

export default function CampaignsPage() {
  const [channel, setChannel] = useState<"PUSH" | "SMS">("PUSH");
  const [selected, setSelected] = useState<string[]>(["חובבי טכנו"]);

  const toggle = (l: string) =>
    setSelected((s) => (s.includes(l) ? s.filter((x) => x !== l) : [...s, l]));

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop max-w-2xl space-y-gutter">
      <div>
        <h2 className="text-headline-lg-mobile text-primary-fixed mb-1">סטודיו קמפיינים</h2>
        <p className="text-on-surface-variant/80">עצבו והפיצו את השידור הממוקד שלכם.</p>
      </div>

      <section className="space-y-sm">
        <label className="text-label-md text-primary-fixed uppercase tracking-wider">מקטעי קהל יעד</label>
        <div className="grid grid-cols-2 gap-sm">
          {segments.map((s) => {
            const on = selected.includes(s.label);
            return (
              <button
                key={s.label}
                onClick={() => toggle(s.label)}
                className={`glass-card p-md rounded-xl text-right transition-all ${on ? "border-primary-fixed bg-primary-container/10" : "hover:border-white/20"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <Icon name={s.icon} className={on ? "text-primary-fixed" : "text-on-surface-variant/40"} />
                  {on && <Icon name="check_circle" className="text-primary-fixed" fill />}
                </div>
                <div className="text-label-md text-on-background">{s.label}</div>
                <div className="text-[10px] text-on-surface-variant/60">{s.members} חברים</div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="glass-card rounded-xl p-md space-y-md">
        <div className="flex items-center justify-between border-b border-white/5 pb-sm">
          <label className="text-label-md text-primary-fixed uppercase">עורך הודעות</label>
          <div className="flex bg-surface-container-highest p-1 rounded-full text-[10px]" dir="ltr">
            {(["PUSH", "SMS"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setChannel(c)}
                className={`px-3 py-1 rounded-full ${channel === c ? "bg-primary-fixed text-on-primary-fixed font-bold" : "text-on-surface-variant/60"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <textarea
          rows={5}
          defaultValue="הערב: Nexus Underground חוזר. הציגו את כרטיס החבר לכניסה עד 00:00. לינק בביו."
          className="w-full bg-surface-container-low border border-white/10 rounded-xl p-md text-on-surface focus:border-primary-fixed/50 outline-none transition-colors"
        />
      </section>

      <button className="w-full bg-primary-fixed text-on-primary-fixed text-2xl py-md rounded-xl font-bold flex items-center justify-center gap-sm shadow-neon-primary active:scale-95 transition-transform">
        <Icon name="bolt" fill /> שליחת קמפיין ({selected.length} מקטעים)
      </button>

      <div className="p-md bg-secondary-container/5 rounded-xl border border-secondary-container/10">
        <div className="flex items-center gap-sm mb-2">
          <Icon name="auto_graph" className="text-secondary-fixed-dim" />
          <span className="text-label-md text-secondary-fixed">תובנות אסטרטגיות</span>
        </div>
        <p className="text-on-surface-variant/80 italic">
          &quot;להודעות שנשלחות ב-21:00 עבור אירועי מועדונים יש שיעור המרה גבוה ב-35% באזור שלך.&quot;
        </p>
      </div>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import type { NexusEvent } from "@/lib/events";

const AGE_BANDS = ["18-21", "22-25", "26-30", "31-35", "35+"];
const GENDERS = ["נשים", "גברים"];
const BIRTHDAY_DAYS = Array.from({ length: 15 }, (_, i) => i + 1); // 1..15

export function CampaignStudio({ events }: { events: NexusEvent[] }) {
  const [channel, setChannel] = useState<"PUSH" | "SMS" | "WhatsApp">("PUSH");
  const [eventIds, setEventIds] = useState<string[]>([]);
  const [ages, setAges] = useState<string[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [bdayOn, setBdayOn] = useState(false);
  const [bdayDays, setBdayDays] = useState(7);
  const [msg, setMsg] = useState("הערב: Nexus Underground חוזר. הציגו את כרטיס החבר לכניסה עד 00:00. לינק בביו.");

  const toggleIn = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  // Deterministic estimated reach so the UI reacts to the chosen filters.
  const reach = useMemo(() => {
    let r = 5000;
    if (eventIds.length) r = eventIds.length * 850;
    if (ages.length) r = Math.round(r * (ages.length / AGE_BANDS.length));
    if (genders.length === 1) r = Math.round(r * 0.52);
    if (bdayOn) r = Math.min(r, bdayDays * 18);
    return Math.max(r, bdayOn ? 8 : 50);
  }, [eventIds, ages, genders, bdayOn, bdayDays]);

  const activeFilters =
    eventIds.length + ages.length + genders.length + (bdayOn ? 1 : 0);

  const sendWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop max-w-2xl space-y-gutter">
      <div>
        <h2 className="text-headline-lg-mobile text-primary-fixed mb-1">סטודיו קמפיינים</h2>
        <p className="text-on-surface-variant/80">עצבו והפיצו את השידור הממוקד שלכם.</p>
      </div>

      {/* Audience filter builder */}
      <section className="glass-card rounded-xl p-md space-y-md">
        <div className="flex items-center justify-between">
          <label className="text-label-md text-primary-fixed uppercase tracking-wider">סינון קהל היעד</label>
          <span className="text-label-sm text-on-surface-variant">{activeFilters} פילטרים פעילים</span>
        </div>

        {/* By event attended */}
        <div className="space-y-2">
          <p className="text-label-sm text-on-surface-variant flex items-center gap-1.5"><Icon name="confirmation_number" className="text-[16px]" /> לקוחות שהגיעו מאירוע</p>
          <div className="flex flex-wrap gap-2">
            {events.map((e) => {
              const on = eventIds.includes(e.id);
              return (
                <button key={e.id} onClick={() => toggleIn(eventIds, setEventIds, e.id)} className={`px-3 py-1.5 rounded-full border text-label-sm transition-all flex items-center gap-1 ${on ? "border-primary-fixed bg-primary-container/15 text-primary-fixed font-bold" : "border-white/10 bg-white/5 text-on-surface-variant hover:border-primary-fixed/40"}`}>
                  {on && <Icon name="check" className="text-[14px]" />}{e.title}
                </button>
              );
            })}
            {events.length === 0 && <span className="text-label-sm text-on-surface-variant/50">אין אירועים עדיין</span>}
          </div>
        </div>

        {/* By age */}
        <div className="space-y-2">
          <p className="text-label-sm text-on-surface-variant flex items-center gap-1.5"><Icon name="cake" className="text-[16px]" /> טווח גילאים</p>
          <div className="flex flex-wrap gap-2">
            {AGE_BANDS.map((a) => {
              const on = ages.includes(a);
              return (
                <button key={a} onClick={() => toggleIn(ages, setAges, a)} className={`px-4 py-1.5 rounded-full border text-label-sm transition-all ${on ? "border-secondary-fixed bg-secondary-fixed/15 text-secondary-fixed font-bold" : "border-white/10 bg-white/5 text-on-surface-variant hover:border-secondary-fixed/40"}`}>{a}</button>
              );
            })}
          </div>
        </div>

        {/* By gender */}
        <div className="space-y-2">
          <p className="text-label-sm text-on-surface-variant flex items-center gap-1.5"><Icon name="wc" className="text-[16px]" /> מגדר</p>
          <div className="flex gap-2">
            {GENDERS.map((g) => {
              const on = genders.includes(g);
              return (
                <button key={g} onClick={() => toggleIn(genders, setGenders, g)} className={`flex-1 px-4 py-2 rounded-lg border text-label-md transition-all ${on ? "border-primary-fixed bg-primary-container/15 text-primary-fixed font-bold" : "border-white/10 bg-white/5 text-on-surface-variant hover:border-primary-fixed/40"}`}>{g}</button>
              );
            })}
          </div>
        </div>

        {/* Upcoming birthday */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-label-sm text-on-surface-variant flex items-center gap-1.5"><Icon name="celebration" className="text-[16px]" /> יום הולדת קרוב</p>
            <button onClick={() => setBdayOn((v) => !v)} className={`w-11 h-6 rounded-full relative shrink-0 transition-colors ${bdayOn ? "bg-primary-fixed" : "bg-surface-container-highest"}`} aria-label="סינון יום הולדת">
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${bdayOn ? "right-0.5" : "right-[22px]"}`} />
            </button>
          </div>
          {bdayOn && (
            <div className="space-y-2">
              <p className="text-label-sm text-primary-fixed">מי שיום ההולדת שלו בתוך <span className="font-bold">{bdayDays}</span> {bdayDays === 1 ? "יום" : "ימים"}</p>
              {/* Tappable 1..15 day scale, 1 on the right (RTL) */}
              <div className="flex flex-row-reverse gap-1.5 overflow-x-auto pb-1">
                {BIRTHDAY_DAYS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setBdayDays(d)}
                    className={`shrink-0 w-9 h-9 rounded-lg text-label-sm font-bold transition-all ${d <= bdayDays ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"} ${d === bdayDays ? "ring-2 ring-primary-fixed ring-offset-2 ring-offset-background scale-110" : ""}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-on-surface-variant/50"><span>15 ימים</span><span>היום</span></div>
            </div>
          )}
        </div>

        {/* Estimated reach */}
        <div className="flex items-center justify-between p-3 bg-primary-container/10 rounded-lg border border-primary-fixed/20">
          <span className="text-label-md text-on-surface flex items-center gap-2"><Icon name="groups" className="text-primary-fixed" /> קהל יעד מוערך</span>
          <span className="text-headline-md text-primary-fixed">{reach.toLocaleString()}</span>
        </div>
      </section>

      {/* Message editor */}
      <section className="glass-card rounded-xl p-md space-y-md">
        <div className="flex items-center justify-between border-b border-white/5 pb-sm flex-wrap gap-2">
          <label className="text-label-md text-primary-fixed uppercase">עורך הודעות</label>
          <div className="flex bg-surface-container-highest p-1 rounded-full text-[10px]" dir="ltr">
            {(["PUSH", "SMS", "WhatsApp"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setChannel(c)}
                className={`px-3 py-1 rounded-full transition-colors ${channel === c ? (c === "WhatsApp" ? "bg-[#25D366] text-black font-bold" : "bg-primary-fixed text-on-primary-fixed font-bold") : "text-on-surface-variant/60"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <textarea
            rows={5}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            maxLength={channel === "SMS" ? 160 : 1000}
            className="w-full bg-surface-container-low border border-white/10 rounded-xl p-md text-on-surface focus:border-primary-fixed/50 outline-none transition-colors"
          />
          <span className="absolute bottom-3 left-3 text-[10px] font-mono text-on-surface-variant/40" dir="ltr">
            {msg.length}/{channel === "SMS" ? 160 : 1000}
          </span>
        </div>
        <div className="flex items-center gap-sm">
          <button className="flex-1 flex items-center justify-center gap-2 py-sm bg-surface-container-highest rounded-lg text-label-md text-on-surface hover:bg-surface-variant transition-colors"><Icon name="image" className="text-[18px]" /> הוספת מדיה</button>
          <button className="flex-1 flex items-center justify-center gap-2 py-sm bg-surface-container-highest rounded-lg text-label-md text-on-surface hover:bg-surface-variant transition-colors"><Icon name="link" className="text-[18px]" /> לינק חכם</button>
        </div>
        {/* Send to WhatsApp */}
        <button onClick={sendWhatsApp} className="w-full flex items-center justify-center gap-2 py-sm bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] rounded-lg text-label-md font-bold hover:bg-[#25D366]/25 transition-colors active:scale-95">
          <Icon name="chat" className="text-[18px]" fill /> שליחה לוואטסאפ
        </button>
      </section>

      {/* Scheduling */}
      <section className="glass-card rounded-xl p-md space-y-sm">
        <label className="text-label-md text-primary-fixed uppercase">לו&quot;ז הפצה</label>
        <div className="flex items-center gap-sm">
          <div className="flex-1 bg-surface-container-low border border-white/10 rounded-lg p-sm flex items-center gap-2">
            <Icon name="calendar_month" className="text-primary-fixed/60" />
            <span className="text-body-md text-on-surface">הערב, 24 באוק&apos;</span>
          </div>
          <div className="flex-1 bg-surface-container-low border border-white/10 rounded-lg p-sm flex items-center gap-2">
            <Icon name="schedule" className="text-primary-fixed/60" />
            <span className="text-body-md text-on-surface">21:00</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-label-sm text-on-surface-variant/60">מסירה משוערת: מיידי</span>
          <span className="text-label-sm text-primary-fixed/80">ערוץ: {channel}</span>
        </div>
      </section>

      <button className="w-full bg-primary-fixed text-on-primary-fixed text-2xl py-md rounded-xl font-bold flex items-center justify-center gap-sm shadow-neon-primary active:scale-95 transition-transform">
        <Icon name="bolt" fill /> שליחת קמפיין · {reach.toLocaleString()} נמענים
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

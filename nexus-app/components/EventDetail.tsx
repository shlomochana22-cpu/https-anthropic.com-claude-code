"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "./Icon";
import { SafeImage } from "./SafeImage";
import { DEFAULT_ENTRY_POLICY, DEFAULT_FAQ, type NexusEvent } from "@/lib/events";

export function EventDetail({ event }: { event: NexusEvent }) {
  const router = useRouter();
  const [qty, setQty] = useState<Record<string, number>>(
    Object.fromEntries(event.tiers.map((t) => [t.id, t.id === "regular" ? 1 : 0]))
  );
  const [descOpen, setDescOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const entryPolicy = event.entryPolicy?.length ? event.entryPolicy : DEFAULT_ENTRY_POLICY(event.age);
  const faq = event.faq?.length ? event.faq : DEFAULT_FAQ;

  const total = useMemo(
    () => event.tiers.reduce((sum, t) => sum + (qty[t.id] || 0) * t.price, 0),
    [qty, event.tiers]
  );
  const count = Object.values(qty).reduce((a, b) => a + b, 0);

  const setTier = (id: string, delta: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] || 0) + delta) }));

  return (
    <>
      <main className="pt-16 pb-32">
        {/* Hero */}
        <section className="relative w-full h-[360px] overflow-hidden">
          <SafeImage className="w-full h-full object-cover" src={event.image} alt={event.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 w-full px-margin-mobile pb-sm">
            {event.badge && (
              <span className="bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {event.badge}
              </span>
            )}
            <h1 className="text-headline-lg-mobile text-primary drop-shadow-md mt-1">
              {event.title}
            </h1>
          </div>
        </section>

        {/* Quick info */}
        <section className="px-margin-mobile mt-md grid grid-cols-3 gap-sm">
          {[
            { icon: "calendar_today", label: "תאריך", value: event.date },
            { icon: "schedule", label: "שעה", value: event.time },
            { icon: "location_on", label: "מיקום", value: event.city },
          ].map((it) => (
            <div key={it.label} className="glass-card rounded-xl p-sm flex flex-col items-center text-center">
              <Icon name={it.icon} className="text-primary-fixed-dim mb-1" />
              <span className="text-label-sm opacity-60">{it.label}</span>
              <span className="text-label-md">{it.value}</span>
            </div>
          ))}
        </section>

        {/* Age (only when the producer chose to show it) */}
        {event.ageVisible && event.age && (
          <section className="px-margin-mobile mt-md">
            <div className="glass-card rounded-xl p-sm flex items-center justify-center gap-2">
              <Icon name="badge" className="text-primary-fixed-dim" />
              <span className="text-label-md text-on-surface">כניסה מגיל <span className="text-primary-fixed font-bold">{event.age}</span> · חובה ת"ז</span>
            </div>
          </section>
        )}

        {/* Live + map shortcuts */}
        <section className="px-margin-mobile mt-md grid grid-cols-2 gap-sm">
          <Link href={`/events/${event.id}/live`} className="glass-card rounded-xl p-sm flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
            <span className="w-2 h-2 bg-error rounded-full animate-pulse" />
            <span className="text-label-md text-error font-bold">עדכונים חיים</span>
          </Link>
          <Link href={`/events/${event.id}/map`} className="glass-card rounded-xl p-sm flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
            <Icon name="map" className="text-primary-fixed" />
            <span className="text-label-md text-primary-fixed">מפת המתחם</span>
          </Link>
        </section>

        {/* Occupancy */}
        <section className="px-margin-mobile mt-md">
          <div className="glass-card rounded-2xl p-md">
            <div className="flex justify-between items-center mb-sm">
              <div className="flex items-center gap-2">
                <Icon name="group" className="text-primary-container" fill />
                <h3 className="text-[18px]">מד תפוסה</h3>
              </div>
              <span className="text-primary-container font-bold text-lg">{event.occupancy}%</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-container shadow-[0_0_15px_#bff520]"
                style={{ width: `${event.occupancy}%` }}
              />
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="px-margin-mobile mt-lg">
          <h3 className="text-headline-md text-primary mb-sm">על האירוע</h3>
          <p className={`text-on-surface-variant text-body-md leading-relaxed whitespace-pre-line ${descOpen ? "" : "line-clamp-3"}`}>
            {event.description?.trim()
              ? event.description
              : `הצטרפו אלינו ל${event.title} — לילה בלתי נשכח עם ${event.subtitle}. חווית סאונד טוטאלית עם המערכת הטובה בעולם, תאורה שתשאב אתכם למימד אחר וליינאפ שישאיר אתכם על הרגליים עד אור הבוקר. שימו לב: הכניסה מותנית בבדיקת גיל והצגת תעודת זהות פיזית בלבד. מומלץ להצטייד בכרטיסים מראש עקב ביקוש שיא.`}
          </p>
          <button onClick={() => setDescOpen((v) => !v)} className="text-primary-fixed-dim font-bold text-label-md mt-2 flex items-center gap-1">
            {descOpen ? "סגור" : "קרא עוד"}
            <Icon name={descOpen ? "expand_less" : "expand_more"} className="text-sm" />
          </button>
        </section>

        {/* Lineup */}
        {event.lineup && event.lineup.length > 0 && (
          <section className="px-margin-mobile mt-lg">
            <h3 className="text-headline-md text-primary mb-sm flex items-center gap-2">
              <Icon name="queue_music" className="text-primary-fixed-dim" /> ליינאפ
            </h3>
            <div className="space-y-2">
              {event.lineup.map((act, i) => (
                <div key={i} className={`glass-card rounded-xl p-md flex items-center justify-between ${act.headliner ? "border border-primary-container/40" : ""}`}>
                  <div className="flex items-center gap-3">
                    <Icon name={act.headliner ? "star" : "music_note"} className={act.headliner ? "text-primary-container" : "text-on-surface-variant"} fill={act.headliner} />
                    <div>
                      <p className={`text-label-md ${act.headliner ? "text-primary-container font-bold" : "text-on-surface"}`}>{act.name}</p>
                      {act.headliner && <p className="text-[11px] text-primary-container/70">Headliner</p>}
                    </div>
                  </div>
                  {act.time && <span className="text-label-md text-on-surface-variant font-mono" dir="ltr">{act.time}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tiers */}
        <section className="px-margin-mobile mt-lg">
          <h3 className="text-headline-md text-primary mb-md">סוגי כרטיסים</h3>
          <div className="space-y-sm">
            {event.tiers.map((t) => (
              <div
                key={t.id}
                className={`glass-card rounded-2xl p-md border-white/10 ${
                  t.soldOut ? "opacity-50 grayscale" : ""
                } ${t.exclusive ? "border-primary-container/40" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`text-[20px] ${t.exclusive ? "text-primary-container" : "text-white"} flex items-center gap-2`}>
                      {t.name}
                      {t.exclusive && <Icon name="stars" className="text-primary-container text-[18px]" fill />}
                    </h4>
                    {t.description && <p className="text-label-sm text-white/60">{t.description}</p>}
                  </div>
                  <span className="text-[20px]">₪{t.price}</span>
                </div>

                {/* VIP benefits */}
                {t.benefits && t.benefits.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {t.benefits.map((b, bi) => (
                      <li key={bi} className="flex items-center gap-1.5 bg-primary-container/10 border border-primary-container/30 text-primary-container text-[12px] px-2.5 py-1 rounded-full">
                        <Icon name="check_circle" className="text-[14px]" fill /> {b}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex justify-between items-center">
                  {t.soldOut ? (
                    <span className="text-error font-bold uppercase text-[10px] tracking-widest border border-error px-2 py-0.5 rounded">
                      Sold Out
                    </span>
                  ) : (
                    <span className="text-secondary-fixed-dim text-[11px] font-bold">זמין כעת</span>
                  )}
                  <div className="flex items-center gap-4">
                    <button
                      disabled={t.soldOut}
                      onClick={() => setTier(t.id, -1)}
                      className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center active:scale-90 transition-transform disabled:opacity-30"
                    >
                      <Icon name="remove" />
                    </button>
                    <span className="font-bold text-lg w-4 text-center">{qty[t.id] || 0}</span>
                    <button
                      disabled={t.soldOut}
                      onClick={() => setTier(t.id, 1)}
                      className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center active:scale-90 transition-transform disabled:opacity-30"
                    >
                      <Icon name="add" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Entry policy */}
        <section className="px-margin-mobile mt-lg">
          <h3 className="text-headline-md text-primary mb-sm flex items-center gap-2">
            <Icon name="policy" className="text-primary-fixed-dim" /> מדיניות כניסה
          </h3>
          <ul className="glass-card rounded-2xl p-md space-y-3">
            {entryPolicy.map((rule, i) => (
              <li key={i} className="flex items-start gap-3 text-body-md text-on-surface-variant">
                <Icon name="check_circle" className="text-primary-fixed-dim text-[18px] mt-0.5 shrink-0" fill />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="px-margin-mobile mt-lg">
          <h3 className="text-headline-md text-primary mb-sm flex items-center gap-2">
            <Icon name="help" className="text-primary-fixed-dim" /> שאלות נפוצות
          </h3>
          <div className="space-y-2">
            {faq.map((item, i) => {
              const isOpen = faqOpen === i;
              return (
                <div key={i} className="glass-card rounded-xl overflow-hidden">
                  <button onClick={() => setFaqOpen(isOpen ? null : i)} className="w-full flex items-center justify-between p-md text-right">
                    <span className="text-label-md text-on-surface">{item.q}</span>
                    <Icon name={isOpen ? "expand_less" : "expand_more"} className="text-on-surface-variant shrink-0" />
                  </button>
                  {isOpen && <p className="px-md pb-md text-body-md text-on-surface-variant leading-relaxed">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Directions */}
        <section className="px-margin-mobile mt-lg mb-8">
          <h3 className="text-headline-md text-primary mb-sm">איך מגיעים</h3>
          <Link href={`/events/${event.id}/map`} className="block h-40 rounded-2xl overflow-hidden glass-card relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img loading="lazy"
              alt="מפה"
              className="w-full h-full object-cover opacity-50 grayscale contrast-125"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjO6McQiHvw1lDmliN6f8Rn3o-mGiOjUYhLFDzTd0Luxi10fml4UXi47l7PMcZ3qDao8Z9bIF3ysUMcWBdarDCQOPgPmRbtKZJylSOsURejUQ1FQPI0S2iSuqb1wps4dCIdqOPWJJKdmdRlYxbnzdbCOGjI1bDPAjVens2ybZzbktYH2ApPTyw5wB4dmyP9LzUcofS6J7LDNgBgVUkqkERnx-gceoTYroRVFLCvFeNfe_KtG3HgDiEEpfJHdzTtDwcQp_2fjzolg"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(191,245,32,0.6)]">
                <Icon name="directions" className="text-sm" /> נווט ליעד
              </div>
            </div>
          </Link>
        </section>
      </main>

      {/* Sticky buy bar */}
      <div className="fixed bottom-0 left-0 w-full z-[60]">
        <div className="bg-surface-container-lowest/90 backdrop-blur-2xl px-margin-mobile py-4 border-t border-white/5 shadow-[0_-8px_24px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between gap-md max-w-lg mx-auto">
            <div className="flex flex-col">
              <span className="text-label-sm opacity-60">{count > 0 ? 'סה"כ לתשלום' : "מחיר החל מ-"}</span>
              <span className="text-headline-md font-bold text-primary">₪{count > 0 ? total : Math.min(...event.tiers.filter((t) => !t.soldOut).map((t) => t.price), event.fromPrice)}</span>
            </div>
            <button
              onClick={() => {
                let items = event.tiers.filter((t) => (qty[t.id] || 0) > 0).map((t) => `${t.id}:${qty[t.id]}`).join(",");
                let totalVal = total;
                if (!items) {
                  // Always-active: default to 1 of the cheapest available tier.
                  const cheapest = [...event.tiers].filter((t) => !t.soldOut).sort((a, b) => a.price - b.price)[0] ?? event.tiers[0];
                  if (cheapest) { items = `${cheapest.id}:1`; totalVal = cheapest.price; }
                }
                router.push(`/checkout?event=${event.id}&total=${totalVal}&items=${items}`);
              }}
              className="flex-1 bg-primary-container text-on-primary-container h-14 rounded-xl text-[18px] flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 transition-all"
            >
              רכישה מהירה <Icon name="bolt" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

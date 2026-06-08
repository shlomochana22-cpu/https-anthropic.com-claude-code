"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Icon } from "@/components/Icon";

const reviews = [
  { name: "שרה לוי", when: "אתמול בבלוק", stars: 5, text: "הויז'ואל היה מעולם אחר! ההפקה הכי טובה של NEXUS העונה." },
  { name: "דן כהן", when: "לפני יומיים בהאומן 17", stars: 4, text: "אווירה מטורפת אבל התור לבר היה קצת מוגזם. המוזיקה הייתה אש." },
];

export default function RatingPage() {
  const [rating, setRating] = useState(0);
  const [aspects, setAspects] = useState<Record<string, number>>({ "מערכת סאונד": 4, "אנרגיית קהל": 5, "ארגון": 3 });
  const [sent, setSent] = useState(false);
  const setAspect = (label: string, value: number) => setAspects((a) => ({ ...a, [label]: value }));

  return (
    <>
      <Header back="/tickets" />
      <main className="pt-24 pb-32 px-margin-mobile max-w-2xl mx-auto space-y-gutter">
        <section className="text-center space-y-sm mb-lg">
          <h2 className="text-headline-lg-mobile text-primary-fixed neon-glow">איך הייתה המסיבה?</h2>
          <p className="text-on-surface-variant/80">שתפו את האנרגיה שלכם עם קהילת נקסוס.</p>
        </section>

        <section className="glass-card rounded-xl p-md space-y-md">
          <div className="flex flex-col items-center space-y-sm">
            <span className="text-sm text-primary-fixed uppercase tracking-widest">אווירה כללית</span>
            <div className="flex flex-row-reverse justify-center gap-2">
              {[5, 4, 3, 2, 1].map((s) => (
                <button
                  key={s}
                  onMouseEnter={() => setRating(s)}
                  onClick={() => setRating(s)}
                  className="active:scale-125 transition-all"
                >
                  <Icon
                    name="star"
                    fill
                    className={`text-[40px] ${rating >= s ? "text-primary-fixed drop-shadow-[0_0_10px_rgba(191,245,32,0.8)]" : "text-on-surface-variant/30"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-sm pt-sm border-t border-white/5">
            {[
              { label: "מערכת סאונד", icon: "volume_up" },
              { label: "אנרגיית קהל", icon: "groups" },
              { label: "ארגון", icon: "event_seat" },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between">
                <span className="text-label-md text-on-surface-variant">{m.label}</span>
                <div className="flex flex-row-reverse gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button key={i} onClick={() => setAspect(m.label, i)} className="active:scale-110 transition-transform" aria-label={`${m.label} ${i}`}>
                      <Icon name={m.icon} className={`text-md ${i <= aspects[m.label] ? "text-primary-fixed/80 hover:text-primary-fixed" : "text-on-surface-variant/20 hover:text-on-surface-variant/40"}`} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-sm">
            <label className="block text-xs text-primary-fixed uppercase tracking-widest mb-2 px-1">כתבו ביקורת</label>
            <textarea
              rows={4}
              className="w-full bg-surface-container-low rounded-lg border border-white/10 focus:border-primary-fixed text-on-surface p-md placeholder:text-on-surface-variant/30 outline-none transition-colors"
              placeholder="מה הפך את הלילה למיוחד?"
            />
          </div>
          <button
            onClick={() => setSent(true)}
            className="w-full h-14 bg-primary-container text-on-primary-fixed text-headline-md rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-neon-primary"
          >
            {sent ? (
              <>נשלח! <Icon name="check_circle" /></>
            ) : (
              <>שליחת ביקורת <Icon name="send" /></>
            )}
          </button>
        </section>

        <section className="space-y-md pt-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-headline-md text-on-surface">ביקורות אחרונות</h3>
            <span className="text-sm text-primary-fixed bg-primary-fixed/10 px-sm py-1 rounded-full">128 ביקורות</span>
          </div>
          {reviews.map((r) => (
            <div key={r.name} className="glass-card rounded-xl p-md space-y-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-on-surface">{r.name}</p>
                  <p className="text-[10px] text-on-surface-variant/50 uppercase">{r.when}</p>
                </div>
                <div className="flex flex-row-reverse text-primary-fixed">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Icon key={i} name="star" fill className={`text-sm ${i <= r.stars ? "" : "text-on-surface-variant/20"}`} />
                  ))}
                </div>
              </div>
              <p className="text-on-surface-variant/90 leading-relaxed italic">&quot;{r.text}&quot;</p>
            </div>
          ))}
        </section>
      </main>
      <BottomNav />
    </>
  );
}

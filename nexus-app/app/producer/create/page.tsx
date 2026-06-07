"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { createEvent } from "@/lib/createEvent";

const steps = ["פרטים כלליים", "כרטיסים", "פרסום"];
const genres = ["טכנו", "מיינסטרים", "היפ הופ", "פסייטראנס", "פופ"];

type TierState = { name: string; price: string; qty: string };

export default function CreateEventPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("טכנו");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("23:00");
  const [city, setCity] = useState("");
  const [venue, setVenue] = useState("");
  const [tiers, setTiers] = useState<TierState[]>([
    { name: "מכירה מוקדמת", price: "80", qty: "150" },
    { name: "רגיל", price: "120", qty: "800" },
    { name: "VIP", price: "350", qty: "250" },
  ]);

  const setTier = (i: number, key: keyof TierState, v: string) =>
    setTiers((t) => t.map((row, idx) => (idx === i ? { ...row, [key]: v } : row)));

  const next = async () => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    setSaving(true);
    const { id } = await createEvent({
      title: title || "אירוע ללא שם",
      genre,
      city: city || "תל אביב",
      venue: venue || "",
      date: date || "בקרוב",
      time,
      tiers: tiers.map((t, i) => ({ name: t.name, price: Number(t.price) || 0, qty: Number(t.qty) || 0, exclusive: i === 2 })),
    });
    router.push(`/producer?created=${id}`);
  };

  const back = () => step > 0 && setStep(step - 1);
  const pct = Math.round(((step + 1) / 3) * 100);

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop max-w-4xl">
      {/* Progress */}
      <section className="mb-lg">
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-primary-fixed text-label-md uppercase tracking-widest opacity-70">יצירת אירוע</span>
            <h2 className="text-headline-lg text-primary">שלב {step + 1} מתוך 3: {steps[step]}</h2>
          </div>
          <div className="text-on-surface-variant text-label-md">{pct}% הושלמו</div>
        </div>
        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
          <div className="h-full bg-primary-fixed neon-glow transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </section>

      {/* Step 1 */}
      {step === 0 && (
        <div className="glass-card p-md rounded-xl space-y-6">
          <h3 className="text-headline-md text-primary flex items-center gap-2"><Icon name="info" className="text-primary-fixed" /> פרטים כלליים</h3>
          <div className="flex flex-col gap-2">
            <label className="text-primary-fixed text-label-md uppercase tracking-wider">שם האירוע</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="לדוגמה: Midnight Echoes" className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-4 text-body-lg text-primary focus:border-primary-fixed outline-none" />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-primary-fixed text-label-md uppercase tracking-wider">ז'אנר</label>
            <div className="flex flex-wrap gap-3">
              {genres.map((g) => (
                <button key={g} onClick={() => setGenre(g)} className={`px-6 py-2 rounded-full border transition-all ${genre === g ? "border-primary-fixed bg-primary-fixed text-on-primary-fixed font-bold shadow-neon-primary" : "border-white/10 bg-white/5 text-on-surface-variant hover:border-primary-fixed/50"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-primary-fixed text-label-md uppercase tracking-wider">תאריך</label>
              <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="24.08" className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-4 text-body-md text-primary focus:border-primary-fixed outline-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-primary-fixed text-label-md uppercase tracking-wider">שעה</label>
              <input value={time} onChange={(e) => setTime(e.target.value)} className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-4 text-body-md text-primary focus:border-primary-fixed outline-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-primary-fixed text-label-md uppercase tracking-wider">עיר</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="תל אביב" className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-4 text-body-md text-primary focus:border-primary-fixed outline-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-primary-fixed text-label-md uppercase tracking-wider">מקום / Venue</label>
              <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="האומן 17" className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-4 text-body-md text-primary focus:border-primary-fixed outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {tiers.map((t, i) => (
            <div key={i} className="glass-card rounded-xl p-md">
              <div className="flex items-center gap-3 mb-md">
                <div className="p-2 rounded-lg bg-surface-container-high text-primary-fixed"><Icon name={i === 2 ? "stars" : "confirmation_number"} /></div>
                <input value={t.name} onChange={(e) => setTier(i, "name", e.target.value)} className="bg-transparent text-headline-md text-primary outline-none border-b border-white/10 focus:border-primary-fixed w-full" />
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-1">
                  <label className="text-label-sm text-on-surface-variant uppercase">מחיר ₪</label>
                  <input type="number" value={t.price} onChange={(e) => setTier(i, "price", e.target.value)} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary focus:border-primary-fixed outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-label-sm text-on-surface-variant uppercase">כמות</label>
                  <input type="number" value={t.qty} onChange={(e) => setTier(i, "qty", e.target.value)} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary focus:border-primary-fixed outline-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 3 — review */}
      {step === 2 && (
        <div className="glass-card p-md rounded-xl space-y-4">
          <h3 className="text-headline-md text-primary flex items-center gap-2"><Icon name="rocket_launch" className="text-primary-fixed" /> סקירה ופרסום</h3>
          <div className="grid grid-cols-2 gap-4 text-body-md">
            <div><span className="text-on-surface-variant">שם:</span> <span className="text-primary">{title || "—"}</span></div>
            <div><span className="text-on-surface-variant">ז'אנר:</span> <span className="text-primary-fixed">{genre}</span></div>
            <div><span className="text-on-surface-variant">מתי:</span> <span className="text-primary">{date || "—"} {time}</span></div>
            <div><span className="text-on-surface-variant">איפה:</span> <span className="text-primary">{venue || "—"}, {city || "—"}</span></div>
          </div>
          <div className="border-t border-white/10 pt-4 space-y-2">
            {tiers.filter((t) => Number(t.price) > 0).map((t, i) => (
              <div key={i} className="flex justify-between text-body-md">
                <span className="text-on-surface">{t.name} ({t.qty})</span>
                <span className="text-primary-fixed">₪{t.price}</span>
              </div>
            ))}
          </div>
          <p className="text-label-sm text-on-surface-variant">בלחיצה על "פרסם" האירוע יישמר. אם Supabase מחובר — הוא נכתב למסד הנתונים; אחרת נשמר במצב דמו.</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-lg flex gap-gutter">
        <button onClick={next} disabled={saving} className="flex-[2] md:flex-none md:w-64 bg-primary-fixed text-on-primary-fixed px-lg py-4 rounded-xl text-headline-md shadow-neon-primary hover:scale-[1.02] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60">
          {saving ? "שומר..." : step < 2 ? `הבא: ${steps[step + 1]}` : "פרסם אירוע"}
          {!saving && <Icon name={step < 2 ? "arrow_back" : "rocket_launch"} />}
        </button>
        {step > 0 && !saving && (
          <button onClick={back} className="flex-1 md:flex-none md:w-40 bg-surface-container-high text-primary border border-white/10 px-lg py-4 rounded-xl text-label-md hover:bg-surface-container-highest transition-all active:scale-95">
            חזרה
          </button>
        )}
      </div>
    </main>
  );
}

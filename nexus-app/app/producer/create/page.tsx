"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

const steps = ["פרטים כלליים", "כרטיסים", "מדיה ויח״צ"];
const categories = ["מועדון", "פסטיבל", "הופעה", "פרטי"];

export default function CreateEventPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [cat, setCat] = useState("מועדון");

  const next = () => (step < 2 ? setStep(step + 1) : router.push("/producer"));
  const back = () => step > 0 && setStep(step - 1);

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop max-w-4xl">
      {/* Progress */}
      <section className="mb-lg">
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-primary-fixed text-label-md uppercase tracking-widest opacity-70">יצירת אירוע</span>
            <h2 className="text-headline-lg text-primary">שלב {step + 1} מתוך 3: {steps[step]}</h2>
          </div>
          <div className="text-on-surface-variant text-label-md">{Math.round(((step + 1) / 3) * 100)}% הושלמו</div>
        </div>
        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
          <div className="h-full bg-primary-fixed neon-glow transition-all duration-500" style={{ width: `${((step + 1) / 3) * 100}%` }} />
        </div>
      </section>

      {/* Step 1 */}
      {step === 0 && (
        <div className="space-y-gutter">
          <div className="glass-card p-md rounded-xl">
            <h3 className="text-headline-md text-primary mb-6 flex items-center gap-2">
              <Icon name="info" className="text-primary-fixed" /> פרטים כלליים
            </h3>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-primary-fixed text-label-md uppercase tracking-wider">שם האירוע</label>
                <input defaultValue="Midnight Echoes: Cyberpunk Rave" className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-4 text-body-lg text-primary focus:border-primary-fixed outline-none" />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-primary-fixed text-label-md uppercase tracking-wider">קטגוריה</label>
                <div className="flex flex-wrap gap-3">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCat(c)}
                      className={`px-6 py-2 rounded-full border transition-all ${
                        cat === c
                          ? "border-primary-fixed bg-primary-fixed text-on-primary-fixed font-bold shadow-neon-primary"
                          : "border-white/10 bg-white/5 text-on-surface-variant hover:border-primary-fixed/50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-primary-fixed text-label-md uppercase tracking-wider">תאריך ושעה</label>
                  <input type="datetime-local" className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-4 text-body-md text-primary focus:border-primary-fixed outline-none [color-scheme:dark]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-primary-fixed text-label-md uppercase tracking-wider">מיקום</label>
                  <input placeholder="חפש כתובת..." className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-4 text-body-md text-primary focus:border-primary-fixed outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          {[
            { name: "מכירה מוקדמת", price: 80, qty: 150 },
            { name: "רגיל", price: 120, qty: 800 },
            { name: "VIP", price: 350, qty: 250 },
          ].map((t) => (
            <div key={t.name} className="glass-card rounded-xl p-md">
              <div className="flex items-center gap-3 mb-md">
                <div className="p-2 rounded-lg bg-surface-container-high text-primary-fixed"><Icon name="confirmation_number" /></div>
                <h3 className="text-headline-md text-primary">{t.name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-1">
                  <label className="text-label-sm text-on-surface-variant uppercase">מחיר</label>
                  <input type="number" defaultValue={t.price} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary focus:border-primary-fixed outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-label-sm text-on-surface-variant uppercase">כמות</label>
                  <input type="number" defaultValue={t.qty} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary focus:border-primary-fixed outline-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 3 */}
      {step === 2 && (
        <div className="space-y-gutter">
          <div className="glass-card p-md rounded-xl">
            <h3 className="text-headline-md text-primary mb-6 flex items-center gap-2"><Icon name="image" className="text-primary-fixed" /> ויזואליה</h3>
            <div className="h-48 w-full border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <Icon name="add_a_photo" className="text-4xl text-primary-fixed mb-2" />
              <p className="text-on-surface-variant">לחץ להעלאת תמונת קאבר (16:9)</p>
            </div>
          </div>
          <div className="glass-card p-md rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icon name="visibility" className="text-on-tertiary-container text-3xl" />
              <div>
                <p className="text-label-md text-primary">נראות ציבורית</p>
                <p className="text-body-md text-on-surface-variant">הצג את האירוע בפיד של נקסוס</p>
              </div>
            </div>
            <span className="w-14 h-7 bg-on-tertiary-container rounded-full relative"><span className="absolute top-0.5 right-0.5 w-6 h-6 bg-white rounded-full" /></span>
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="mt-lg flex gap-gutter">
        <button
          onClick={next}
          className="flex-[2] md:flex-none md:w-64 bg-primary-fixed text-on-primary-fixed px-lg py-4 rounded-xl text-headline-md shadow-neon-primary hover:scale-[1.02] transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          {step < 2 ? `הבא: ${steps[step + 1]}` : "פרסם אירוע"}
          <Icon name={step < 2 ? "arrow_back" : "rocket_launch"} />
        </button>
        {step > 0 && (
          <button onClick={back} className="flex-1 md:flex-none md:w-40 bg-surface-container-high text-primary border border-white/10 px-lg py-4 rounded-xl text-label-md hover:bg-surface-container-highest transition-all active:scale-95">
            חזרה
          </button>
        )}
      </div>
    </main>
  );
}

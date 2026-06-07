"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { createEvent } from "@/lib/createEvent";

const steps = ["פרטים כלליים", "כרטיסים", "מדיה ויח״צ"];
const categories = ["מועדון", "פסטיבל", "הופעה", "פרטי"];
const genres = ["טכנו", "מיינסטרים", "היפ הופ", "פסייטראנס", "פופ"];
const MAP_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAYP-WgF_VDGgbiBAo-MV_BtEUdRrYXINf2EhUxPw3k4YppbY9zUtqgKXEC_LIFTd22NzxCfaNQ4oRFW3DtfEy4zK43eFebqF8E_ueAG9UDtVQ9xEn2OXmFGxnTKng6Rf9ax6QuMBmHSn4B9Rs2IK1CH3RNrbKdFAbelohDzd3_V0h0towExi7jofbqu1KimAoDCadVxTIuU_Hyh4yi0nAeklbJZcHxxHB5D5XNZQM7b9uIP7sGJ0--d2IHL2cYYSUFrYGi6mii7g";

type Tier = { name: string; price: string; qty: string; saleEnd?: string; benefits?: Record<string, boolean> };

export default function CreateEventPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // step 1
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("מועדון");
  const [genre, setGenre] = useState("טכנו");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("23:00");
  const [age, setAge] = useState("18+");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // step 2
  const [venueCapacity, setVenueCapacity] = useState("1500");
  const [tiers, setTiers] = useState<Tier[]>([
    { name: "מכירה מוקדמת", price: "80", qty: "150", saleEnd: "" },
    { name: "רגיל", price: "120", qty: "800" },
    { name: "VIP", price: "350", qty: "250", benefits: { backstage: true, fastEntry: true, table: false } },
  ]);

  // step 3
  const [commission, setCommission] = useState(10);
  const [visible, setVisible] = useState(true);
  const [terms, setTerms] = useState(false);

  const setTier = (i: number, key: keyof Tier, v: string) =>
    setTiers((t) => t.map((row, idx) => (idx === i ? { ...row, [key]: v } : row)));
  const toggleBenefit = (i: number, key: string) =>
    setTiers((t) => t.map((row, idx) => (idx === i ? { ...row, benefits: { ...row.benefits, [key]: !row.benefits?.[key] } } : row)));
  const addTier = () => setTiers((t) => [...t, { name: "כרטיס חדש", price: "0", qty: "0" }]);

  const allocated = useMemo(() => tiers.reduce((s, t) => s + (Number(t.qty) || 0), 0), [tiers]);
  const capacity = Number(venueCapacity) || 1;
  const capacityPct = Math.min(100, Math.round((allocated / capacity) * 100));

  const pct = Math.round(((step + 1) / 3) * 100);
  const fromPrice = Math.min(...tiers.map((t) => Number(t.price)).filter((n) => n > 0), Number.MAX_SAFE_INTEGER);

  const next = async () => {
    if (step < 2) return setStep(step + 1);
    if (!terms) return;
    setSaving(true);
    const { id } = await createEvent({
      title: title || "אירוע ללא שם",
      genre,
      city: city || location || "תל אביב",
      venue: location || "",
      date: date || "בקרוב",
      time,
      tiers: tiers.map((t, i) => ({ name: t.name, price: Number(t.price) || 0, qty: Number(t.qty) || 0, exclusive: i === 2 })),
    });
    router.push(`/producer?created=${id}`);
  };
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
          <div className="text-on-surface-variant text-label-md">{pct}% הושלמו</div>
        </div>
        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
          <div className="h-full bg-primary-fixed neon-glow transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </section>

      {/* ─────────── STEP 1 ─────────── */}
      {step === 0 && (
        <div className="grid gap-gutter">
          {/* Cover dropzone */}
          <div className="relative h-48 w-full rounded-xl overflow-hidden glass-card border-dashed border-2 border-white/10 flex items-center justify-center cursor-pointer hover:border-primary-fixed/40 transition-all group">
            <div className="flex flex-col items-center text-center p-6">
              <Icon name="add_a_photo" className="text-primary-fixed text-4xl mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-label-md text-primary">הוסף תמונת קאבר לאירוע</p>
              <p className="text-xs text-on-surface-variant mt-1">מומלץ: 1920x1080</p>
            </div>
          </div>

          {/* Identity */}
          <div className="glass-card p-md rounded-xl space-y-6">
            <h3 className="text-headline-md text-primary flex items-center gap-2"><Icon name="info" className="text-primary-fixed" /> פרטים כלליים</h3>
            <div className="flex flex-col gap-2">
              <label className="text-primary-fixed text-label-md uppercase tracking-wider">שם האירוע</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="לדוגמה: Midnight Echoes: Cyberpunk Rave" className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-4 text-body-lg text-primary focus:border-primary-fixed outline-none" />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-primary-fixed text-label-md uppercase tracking-wider">קטגוריה</label>
              <div className="flex flex-wrap gap-3">
                {categories.map((c) => (
                  <button key={c} onClick={() => setCategory(c)} className={`px-6 py-2 rounded-full border transition-all ${category === c ? "border-primary-fixed bg-primary-fixed text-on-primary-fixed font-bold shadow-neon-primary" : "border-white/10 bg-white/5 text-on-surface-variant hover:border-primary-fixed/50"}`}>{c}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-primary-fixed text-label-md uppercase tracking-wider">ז'אנר מוזיקלי</label>
              <div className="flex flex-wrap gap-3">
                {genres.map((g) => (
                  <button key={g} onClick={() => setGenre(g)} className={`px-5 py-2 rounded-full border transition-all ${genre === g ? "border-secondary-fixed bg-secondary-fixed/20 text-secondary-fixed font-bold" : "border-white/10 bg-white/5 text-on-surface-variant hover:border-secondary-fixed/50"}`}>{g}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Logistics */}
          <div className="glass-card p-md rounded-xl">
            <h3 className="text-headline-md text-primary mb-6 flex items-center gap-2"><Icon name="schedule" className="text-primary-fixed" /> זמן ומיקום</h3>
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
                <label className="text-primary-fixed text-label-md uppercase tracking-wider">גיל מינימלי</label>
                <select value={age} onChange={(e) => setAge(e.target.value)} className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-4 text-body-md text-primary focus:border-primary-fixed outline-none appearance-none">
                  <option>18+</option><option>21+</option><option>23+</option><option>לכל הגילאים</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-primary-fixed text-label-md uppercase tracking-wider">עיר</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="תל אביב" className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-4 text-body-md text-primary focus:border-primary-fixed outline-none" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-primary-fixed text-label-md uppercase tracking-wider">מיקום האירוע (כתובת)</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="חפש מיקום או כתובת..." className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-4 text-body-md text-primary focus:border-primary-fixed outline-none" />
                <div className="mt-2 h-40 w-full rounded-lg overflow-hidden border border-white/5 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="מפה" className="w-full h-full object-cover grayscale contrast-125 opacity-60" src={MAP_IMG} />
                  <div className="absolute inset-0 bg-primary-fixed/5" />
                </div>
              </div>
            </div>
          </div>

          {/* Narrative */}
          <div className="glass-card p-md rounded-xl">
            <h3 className="text-headline-md text-primary mb-6 flex items-center gap-2"><Icon name="description" className="text-primary-fixed" /> סיפור האירוע</h3>
            <div className="flex flex-col gap-2">
              <label className="text-primary-fixed text-label-md uppercase tracking-wider">תיאור</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="תאר את האווירה, הליינאפ, ולמה לצפות..." className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-4 text-body-md text-primary placeholder:text-on-surface-variant/30 resize-none focus:border-primary-fixed outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* ─────────── STEP 2 ─────────── */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Early bird */}
          <div className="lg:col-span-2 glass-card rounded-xl p-md relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <span className="absolute top-4 left-4 bg-secondary-container/10 text-secondary-fixed px-3 py-1 rounded-full text-xs font-bold border border-secondary-fixed/30 uppercase tracking-widest">מוגבל</span>
            <div>
              <div className="flex items-center gap-3 mb-md">
                <div className="p-2 rounded-lg bg-surface-container-high text-primary-fixed"><Icon name="bolt" /></div>
                <input value={tiers[0].name} onChange={(e) => setTier(0, "name", e.target.value)} className="bg-transparent text-headline-md text-primary outline-none border-b border-white/10 focus:border-primary-fixed" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
                <div className="space-y-1"><label className="text-label-sm text-on-surface-variant uppercase">מחיר ₪</label><input type="number" value={tiers[0].price} onChange={(e) => setTier(0, "price", e.target.value)} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary focus:border-primary-fixed outline-none" /></div>
                <div className="space-y-1"><label className="text-label-sm text-on-surface-variant uppercase">כמות</label><input type="number" value={tiers[0].qty} onChange={(e) => setTier(0, "qty", e.target.value)} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary focus:border-primary-fixed outline-none" /></div>
                <div className="space-y-1 col-span-2 md:col-span-1"><label className="text-label-sm text-on-surface-variant uppercase">סיום מכירה</label><input type="date" value={tiers[0].saleEnd} onChange={(e) => setTier(0, "saleEnd", e.target.value)} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary focus:border-primary-fixed outline-none [color-scheme:dark]" /></div>
              </div>
            </div>
          </div>

          {/* Capacity meter */}
          <div className="lg:col-span-1 glass-card rounded-xl p-md flex flex-col justify-center items-center text-center gap-3 bg-gradient-to-br from-surface-container-low to-black">
            <h3 className="text-label-md text-on-surface-variant uppercase">תפוסה כוללת</h3>
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle className="text-surface-container-highest" cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="8" />
                <circle className="text-secondary-container" cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray={2 * Math.PI * 70} strokeDashoffset={2 * Math.PI * 70 * (1 - capacityPct / 100)} style={{ filter: "drop-shadow(0 0 8px rgba(0,238,252,0.5))", transition: "stroke-dashoffset .4s" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-headline-xl text-primary leading-none">{allocated.toLocaleString()}</span>
                <span className="text-label-sm text-secondary-container">הוקצו ({capacityPct}%)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-body-md text-on-surface-variant">
              תפוסת מקום:
              <input type="number" value={venueCapacity} onChange={(e) => setVenueCapacity(e.target.value)} className="w-20 bg-surface-container-low border border-white/10 rounded p-1 text-center text-primary outline-none focus:border-primary-fixed" />
            </div>
          </div>

          {/* Regular */}
          <div className="lg:col-span-1 glass-card rounded-xl p-md flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center gap-3 mb-md">
                <div className="p-2 rounded-lg bg-surface-container-high text-primary-fixed"><Icon name="confirmation_number" /></div>
                <input value={tiers[1].name} onChange={(e) => setTier(1, "name", e.target.value)} className="bg-transparent text-headline-md text-primary outline-none border-b border-white/10 focus:border-primary-fixed w-full" />
              </div>
              <div className="space-y-4">
                <div className="space-y-1"><label className="text-label-sm text-on-surface-variant uppercase">מחיר ₪</label><input type="number" value={tiers[1].price} onChange={(e) => setTier(1, "price", e.target.value)} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary focus:border-primary-fixed outline-none" /></div>
                <div className="space-y-1"><label className="text-label-sm text-on-surface-variant uppercase">כמות</label><input type="number" value={tiers[1].qty} onChange={(e) => setTier(1, "qty", e.target.value)} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary focus:border-primary-fixed outline-none" /></div>
              </div>
            </div>
          </div>

          {/* VIP + benefits */}
          <div className="lg:col-span-2 glass-card rounded-xl p-md border-primary-fixed/20 flex flex-col md:flex-row gap-md">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-md">
                <div className="p-2 rounded-lg bg-primary-container/20 text-primary-fixed"><Icon name="stars" /></div>
                <input value={tiers[2].name} onChange={(e) => setTier(2, "name", e.target.value)} className="bg-transparent text-headline-md text-primary outline-none border-b border-white/10 focus:border-primary-fixed w-full" />
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-1"><label className="text-label-sm text-on-surface-variant uppercase">מחיר ₪</label><input type="number" value={tiers[2].price} onChange={(e) => setTier(2, "price", e.target.value)} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary focus:border-primary-fixed outline-none" /></div>
                <div className="space-y-1"><label className="text-label-sm text-on-surface-variant uppercase">כמות</label><input type="number" value={tiers[2].qty} onChange={(e) => setTier(2, "qty", e.target.value)} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary focus:border-primary-fixed outline-none" /></div>
              </div>
            </div>
            <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-label-md text-primary-fixed mb-3 uppercase tracking-wider">הטבות VIP</p>
              <div className="space-y-2">
                {[
                  { key: "backstage", label: "גישה לבקסטייג׳" },
                  { key: "fastEntry", label: "כניסה מהירה" },
                  { key: "table", label: "שולחן פרטי" },
                ].map((b) => (
                  <label key={b.key} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={!!tiers[2].benefits?.[b.key]} onChange={() => toggleBenefit(2, b.key)} className="w-5 h-5 rounded border-white/20 bg-transparent text-primary-fixed focus:ring-0" />
                    <span className="text-body-md group-hover:text-primary transition-colors">{b.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Extra dynamic tiers */}
          {tiers.slice(3).map((t, idx) => (
            <div key={idx + 3} className="lg:col-span-1 glass-card rounded-xl p-md flex flex-col justify-between min-h-[220px]">
              <div className="flex items-center gap-3 mb-md">
                <div className="p-2 rounded-lg bg-surface-container-high text-primary-fixed"><Icon name="local_activity" /></div>
                <input value={t.name} onChange={(e) => setTier(idx + 3, "name", e.target.value)} className="bg-transparent text-headline-md text-primary outline-none border-b border-white/10 focus:border-primary-fixed w-full" />
              </div>
              <div className="space-y-4">
                <div className="space-y-1"><label className="text-label-sm text-on-surface-variant uppercase">מחיר ₪</label><input type="number" value={t.price} onChange={(e) => setTier(idx + 3, "price", e.target.value)} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary focus:border-primary-fixed outline-none" /></div>
                <div className="space-y-1"><label className="text-label-sm text-on-surface-variant uppercase">כמות</label><input type="number" value={t.qty} onChange={(e) => setTier(idx + 3, "qty", e.target.value)} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary focus:border-primary-fixed outline-none" /></div>
              </div>
            </div>
          ))}

          {/* Add tier */}
          <button onClick={addTier} className="lg:col-span-3 border-2 border-dashed border-white/10 rounded-xl p-lg flex flex-col items-center justify-center gap-2 hover:border-primary-fixed/50 hover:bg-white/5 transition-all group">
            <Icon name="add_circle" className="text-4xl text-on-surface-variant group-hover:text-primary-fixed transition-colors" />
            <span className="text-label-md text-on-surface-variant uppercase group-hover:text-primary tracking-widest">הוסף סוג כרטיס +</span>
          </button>
        </div>
      )}

      {/* ─────────── STEP 3 ─────────── */}
      {step === 2 && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
          <div className="xl:col-span-7 space-y-gutter">
            {/* Media uploads */}
            <section className="glass-card p-md rounded-xl space-y-md">
              <h3 className="text-headline-md text-primary flex items-center gap-2"><Icon name="image" className="text-primary-fixed" /> ויזואליה של האירוע</h3>
              <div>
                <p className="text-label-md text-on-surface-variant mb-2 uppercase tracking-tighter">קאבר לאירוע (16:9)</p>
                <div className="h-40 w-full border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  <Icon name="add_a_photo" className="text-4xl text-primary-fixed mb-2" />
                  <p className="text-body-md text-on-surface-variant">לחץ להעלאת תמונת קאבר</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-label-md text-on-surface-variant mb-2 uppercase tracking-tighter">פלאייר לרשתות (1:1)</p>
                  <div className="aspect-square w-full border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                    <Icon name="grid_view" className="text-3xl text-primary-fixed mb-2" />
                    <p className="text-label-md text-on-surface-variant text-center px-4">העלה פלאייר ריבועי</p>
                  </div>
                </div>
                <div className="bg-surface-container rounded-xl p-4 flex flex-col justify-center border border-white/5">
                  <h4 className="text-label-md text-primary mb-2">הנחיות העלאה</h4>
                  <ul className="text-body-md text-on-surface-variant space-y-1">
                    <li className="flex items-center gap-2"><Icon name="check_circle" className="text-sm" /> עד 5MB</li>
                    <li className="flex items-center gap-2"><Icon name="check_circle" className="text-sm" /> JPG, PNG, WebP</li>
                    <li className="flex items-center gap-2"><Icon name="check_circle" className="text-sm" /> רזולוציה גבוהה בלבד</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* PR + visibility */}
            <section className="glass-card p-md rounded-xl space-y-md border-on-tertiary-container/30">
              <h3 className="text-headline-md text-on-tertiary-container flex items-center gap-2"><Icon name="campaign" className="text-on-tertiary-container" fill /> יח״צ ונראות</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-label-md text-primary uppercase">עמלת יח״צ</p>
                    <p className="text-body-md text-on-surface-variant">תגמל את צוות היח״צ עבור כל מכירת כרטיס</p>
                  </div>
                  <span className="text-headline-md text-on-tertiary-container">{commission}%</span>
                </div>
                <input type="range" min={0} max={20} value={commission} onChange={(e) => setCommission(Number(e.target.value))} className="w-full accent-[#b300b3]" />
                <div className="flex justify-between text-label-sm text-on-surface-variant"><span>20%</span><span>10%</span><span>0%</span></div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-4">
                  <Icon name="visibility" className="text-on-tertiary-container text-3xl" />
                  <div>
                    <p className="text-label-md text-primary">נראות ציבורית</p>
                    <p className="text-body-md text-on-surface-variant">הצג את האירוע בפיד של נקסוס</p>
                  </div>
                </div>
                <button onClick={() => setVisible((v) => !v)} className={`w-14 h-7 rounded-full relative transition-colors ${visible ? "bg-on-tertiary-container" : "bg-surface-container-highest"}`}>
                  <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all ${visible ? "right-0.5" : "right-7"}`} />
                </button>
              </div>
            </section>
          </div>

          {/* Live preview + publish */}
          <div className="xl:col-span-5 space-y-gutter">
            <div className="sticky top-24 space-y-gutter">
              <div className="bg-surface-container rounded-2xl overflow-hidden border border-white/10">
                <div className="relative h-48 bg-surface-container-high flex items-center justify-center">
                  <Icon name="image" className="text-on-surface-variant/30 text-5xl" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-primary-fixed text-on-primary-fixed text-label-md px-3 py-1 rounded-full uppercase">{genre}</span>
                    {visible && <span className="bg-on-tertiary-container text-white text-label-md px-3 py-1 rounded-full uppercase">Live</span>}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-headline-md text-primary mb-1">{title || "שם האירוע"}</h2>
                    <p className="text-body-md text-on-surface-variant flex items-center gap-2"><Icon name="calendar_today" className="text-sm" /> {date || "תאריך"} • {time}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2"><Icon name="location_on" className="text-primary-fixed" /><span className="text-label-md text-on-surface">{location || "מיקום"}, {city || "עיר"}</span></div>
                    <span className="text-headline-md text-primary-fixed">₪{fromPrice === Number.MAX_SAFE_INTEGER ? 0 : fromPrice}</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer">
                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="w-5 h-5 mt-0.5 rounded border-white/20 bg-surface-container-highest text-on-tertiary-container focus:ring-0" />
                <span className="text-body-md text-on-surface-variant">אני מאשר כי פרטי האירוע נכונים ואני מסכים לתנאי השימוש למפיקים</span>
              </label>

              <button onClick={next} disabled={!terms || saving} className="w-full py-6 bg-primary-container text-on-primary-container text-headline-md rounded-2xl shadow-neon-primary active:scale-95 transition-all hover:brightness-110 flex items-center justify-center gap-3 disabled:opacity-40 disabled:shadow-none group">
                {saving ? "מפרסם..." : "פרסם אירוע"}
                {!saving && <Icon name="rocket_launch" className="group-hover:-translate-x-2 transition-transform" />}
              </button>
              <button className="w-full py-4 border border-white/20 text-on-surface-variant text-label-md rounded-2xl hover:bg-white/5 transition-all active:scale-95">
                שמור כטיוטה
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer nav (steps 1-2) */}
      {step < 2 && (
        <div className="mt-lg flex gap-gutter">
          <button onClick={next} className="flex-[2] md:flex-none md:w-64 bg-primary-fixed text-on-primary-fixed px-lg py-4 rounded-xl text-headline-md shadow-neon-primary hover:scale-[1.02] transition-all flex items-center justify-center gap-2 active:scale-95">
            הבא: {steps[step + 1]} <Icon name="arrow_back" />
          </button>
          {step > 0 && (
            <button onClick={back} className="flex-1 md:flex-none md:w-40 bg-surface-container-high text-primary border border-white/10 px-lg py-4 rounded-xl text-label-md hover:bg-surface-container-highest transition-all active:scale-95">חזרה</button>
          )}
        </div>
      )}
      {step === 2 && (
        <button onClick={back} className="mt-lg text-on-surface-variant hover:text-primary text-label-md flex items-center gap-1">
          <Icon name="arrow_forward" /> חזרה לכרטיסים
        </button>
      )}
    </main>
  );
}

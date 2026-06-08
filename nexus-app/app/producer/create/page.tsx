"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { createEvent } from "@/lib/createEvent";

const steps = ["פרטים כלליים", "כרטיסים", "מדיה ויח״צ"];
const categories = ["מועדון", "פסטיבל", "הופעה", "פרטי"];
const genrePresets = ["טכנו", "מיינסטרים", "היפ הופ", "פסייטראנס", "פופ", "האוס", "טראפ", "אפרו", "דיסקו", " R&B"];
const MAP_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAYP-WgF_VDGgbiBAo-MV_BtEUdRrYXINf2EhUxPw3k4YppbY9zUtqgKXEC_LIFTd22NzxCfaNQ4oRFW3DtfEy4zK43eFebqF8E_ueAG9UDtVQ9xEn2OXmFGxnTKng6Rf9ax6QuMBmHSn4B9Rs2IK1CH3RNrbKdFAbelohDzd3_V0h0towExi7jofbqu1KimAoDCadVxTIuU_Hyh4yi0nAeklbJZcHxxHB5D5XNZQM7b9uIP7sGJ0--d2IHL2cYYSUFrYGi6mii7g";

type Tier = {
  name: string;
  price: string;
  qty: string;
  saleEnd?: string;
  isVip?: boolean;
  benefits?: Record<string, boolean>;
  customBenefits?: string[];
};

const VIP_BENEFITS = [
  { key: "backstage", label: "גישה לבקסטייג׳" },
  { key: "fastEntry", label: "כניסה מהירה" },
  { key: "table", label: "שולחן פרטי" },
];

/** A single, uniform ticket card. Name sits above the card; VIP unlocks benefits. */
function TicketCard({
  tier,
  index,
  total,
  onChange,
  onToggleVip,
  onToggleBenefit,
  onAddBenefit,
  onRemoveBenefit,
  onRemove,
}: {
  tier: Tier;
  index: number;
  total: number;
  onChange: (i: number, patch: Partial<Tier>) => void;
  onToggleVip: (i: number) => void;
  onToggleBenefit: (i: number, key: string) => void;
  onAddBenefit: (i: number, text: string) => void;
  onRemoveBenefit: (i: number, bi: number) => void;
  onRemove: (i: number) => void;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    onAddBenefit(index, draft);
    setDraft("");
  };
  return (
    <div className="space-y-2">
      {/* Ticket name — above the card */}
      <div className="flex items-center gap-2 px-1">
        <Icon name={tier.isVip ? "stars" : "confirmation_number"} className="text-primary-fixed" />
        <input
          value={tier.name}
          onChange={(e) => onChange(index, { name: e.target.value })}
          placeholder="שם הכרטיס"
          className="flex-1 bg-transparent text-headline-md text-primary outline-none border-b border-white/10 focus:border-primary-fixed py-1"
        />
        {total > 1 && (
          <button onClick={() => onRemove(index)} className="text-on-surface-variant hover:text-error transition-colors p-1" aria-label="מחק כרטיס">
            <Icon name="delete" />
          </button>
        )}
      </div>

      {/* Card body */}
      <div className={`glass-card rounded-xl p-md transition-colors ${tier.isVip ? "border-primary-fixed/30" : ""}`}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
          <div className="space-y-1">
            <label className="text-label-sm text-on-surface-variant uppercase">מחיר ₪</label>
            <input type="number" value={tier.price} onChange={(e) => onChange(index, { price: e.target.value })} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary focus:border-primary-fixed outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-label-sm text-on-surface-variant uppercase">כמות</label>
            <input type="number" value={tier.qty} onChange={(e) => onChange(index, { qty: e.target.value })} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary focus:border-primary-fixed outline-none" />
          </div>
          <div className="space-y-1 col-span-2 md:col-span-1">
            <label className="text-label-sm text-on-surface-variant uppercase">סיום מכירה</label>
            <input type="date" value={tier.saleEnd || ""} onChange={(e) => onChange(index, { saleEnd: e.target.value })} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary focus:border-primary-fixed outline-none [color-scheme:dark]" />
          </div>
        </div>

        {/* VIP toggle */}
        <div className="mt-md flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2">
            <Icon name="stars" className={tier.isVip ? "text-primary-fixed" : "text-on-surface-variant"} fill={tier.isVip} />
            <div>
              <p className="text-label-md text-primary">כרטיס VIP</p>
              <p className="text-[11px] text-on-surface-variant">הפעלה פותחת בחירת הטבות</p>
            </div>
          </div>
          <button onClick={() => onToggleVip(index)} className={`w-12 h-6 rounded-full relative shrink-0 transition-colors ${tier.isVip ? "bg-primary-fixed" : "bg-surface-container-highest"}`} aria-label="כרטיס VIP">
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${tier.isVip ? "right-0.5" : "right-[26px]"}`} />
          </button>
        </div>

        {/* Benefits — only for VIP */}
        {tier.isVip && (
          <div className="mt-md bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="text-label-md text-primary-fixed mb-3 uppercase tracking-wider">הטבות VIP</p>
            <div className="space-y-2">
              {VIP_BENEFITS.map((b) => (
                <label key={b.key} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={!!tier.benefits?.[b.key]} onChange={() => onToggleBenefit(index, b.key)} className="w-5 h-5 rounded border-white/20 bg-transparent text-primary-fixed focus:ring-0" />
                  <span className="text-body-md group-hover:text-primary transition-colors">{b.label}</span>
                </label>
              ))}
              {/* Custom free-text benefits */}
              {tier.customBenefits?.map((b, bi) => (
                <div key={bi} className="flex items-center gap-3 group">
                  <Icon name="check_circle" className="text-primary-fixed text-[20px]" fill />
                  <span className="text-body-md flex-1">{b}</span>
                  <button onClick={() => onRemoveBenefit(index, bi)} className="text-on-surface-variant hover:text-error transition-colors" aria-label="הסר הטבה">
                    <Icon name="close" className="text-[18px]" />
                  </button>
                </div>
              ))}
            </div>
            {/* Add custom benefit */}
            <div className="flex gap-2 mt-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
                placeholder="הוסף הטבה משלך (מלל חופשי)…"
                maxLength={40}
                className="flex-1 bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-body-md text-primary focus:border-primary-fixed outline-none"
              />
              <button onClick={add} className="px-4 py-2 rounded-lg bg-surface-container-high border border-white/10 text-primary-fixed hover:border-primary-fixed/50 transition-colors flex items-center gap-1 shrink-0">
                <Icon name="add" /> הוסף
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateEventPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // step 1
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("מועדון");
  const [genreList, setGenreList] = useState<string[]>(["טכנו"]);
  const [customGenre, setCustomGenre] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("23:00");
  const [age, setAge] = useState("18+");
  const [ageVisible, setAgeVisible] = useState(true);
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const genre = genreList.join(" · ") || "טכנו";
  const toggleGenre = (g: string) =>
    setGenreList((l) => (l.includes(g) ? l.filter((x) => x !== g) : [...l, g]));
  const addCustomGenre = () => {
    const v = customGenre.trim();
    if (!v || genreList.includes(v)) return setCustomGenre("");
    setGenreList((l) => [...l, v]);
    setCustomGenre("");
  };

  const [aiSource, setAiSource] = useState<"ai" | "local" | null>(null);
  const [aiAction, setAiAction] = useState<"write" | "rewrite" | "shorten" | "lengthen" | null>(null);
  const [hashtags, setHashtags] = useState("");
  const [hashtagsLoading, setHashtagsLoading] = useState(false);
  const [cover, setCover] = useState("");

  const onCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCover(String(reader.result));
    reader.readAsDataURL(file);
  };

  const aiCopy = async (kind: "hashtags") => {
    const res = await fetch("/api/ai/copy", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, title, genres: genreList, category, city, location, time, date }),
    });
    const data = await res.json();
    return (data?.text as string) || "";
  };

  const genHashtags = async () => {
    setHashtagsLoading(true);
    try {
      const t = await aiCopy("hashtags");
      if (t) setHashtags(t.trim());
    } catch {
      setHashtags(["#נקסוס", ...(genreList.map((g) => `#${g.replace(/\s/g, "")}`))].join(" "));
    } finally {
      setHashtagsLoading(false);
    }
  };

  const runAI = async (action: "write" | "rewrite" | "shorten" | "lengthen") => {
    setAiLoading(true);
    setAiAction(action);
    try {
      const res = await fetch("/api/ai/describe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, genres: genreList, category, city, location, time, age, ageVisible, action, current: description }),
      });
      const data = await res.json();
      if (data?.text) {
        setDescription(data.text);
        setAiSource(data.source === "ai" ? "ai" : "local");
      }
    } catch {
      // network/route failure — last-resort local draft so the button never dead-ends
      setDescription(
        `${title || "האירוע"} מגיע ל${location || city || "המקום החם בעיר"} לערב אחד בלתי נשכח. ` +
          `${category} שכולו ${genreList.join(", ") || "מוזיקה אלקטרונית"} — סאונד עוצמתי, הפקה ויזואלית מטורפת ועד הזריחה. ` +
          `דלתות נפתחות ב-${time}${age && ageVisible ? `, כניסה מגיל ${age}` : ""}. אל תישארו בחוץ. 🔥`
      );
      setAiSource("local");
    } finally {
      setAiLoading(false);
      setAiAction(null);
    }
  };

  // step 2 — starts with a single ticket; producer adds more
  const [venueCapacity, setVenueCapacity] = useState("1500");
  const [tiers, setTiers] = useState<Tier[]>([
    { name: "כרטיס רגיל", price: "120", qty: "200", saleEnd: "", benefits: {}, customBenefits: [] },
  ]);

  // step 3
  const [commissionEnabled, setCommissionEnabled] = useState(true);
  const [commissionMode, setCommissionMode] = useState<"percent" | "fixed">("percent");
  const [commission, setCommission] = useState(10); // percent
  const [commissionFixed, setCommissionFixed] = useState(20); // ₪ per ticket
  const [visible, setVisible] = useState(true);
  const [terms, setTerms] = useState(false);

  const setTier = (i: number, patch: Partial<Tier>) =>
    setTiers((t) => t.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const toggleVip = (i: number) =>
    setTiers((t) => t.map((row, idx) => (idx === i ? { ...row, isVip: !row.isVip } : row)));
  const toggleBenefit = (i: number, key: string) =>
    setTiers((t) => t.map((row, idx) => (idx === i ? { ...row, benefits: { ...row.benefits, [key]: !row.benefits?.[key] } } : row)));
  const addBenefit = (i: number, text: string) => {
    const v = text.trim();
    if (!v) return;
    setTiers((t) => t.map((row, idx) => (idx === i ? { ...row, customBenefits: [...(row.customBenefits || []), v] } : row)));
  };
  const removeBenefit = (i: number, bi: number) =>
    setTiers((t) => t.map((row, idx) => (idx === i ? { ...row, customBenefits: (row.customBenefits || []).filter((_, x) => x !== bi) } : row)));
  const removeTier = (i: number) => setTiers((t) => (t.length > 1 ? t.filter((_, idx) => idx !== i) : t));
  const addTier = () => setTiers((t) => [...t, { name: "כרטיס חדש", price: "0", qty: "0", benefits: {}, customBenefits: [] }]);

  const allocated = useMemo(() => tiers.reduce((s, t) => s + (Number(t.qty) || 0), 0), [tiers]);
  const capacity = Number(venueCapacity) || 1;
  const capacityPct = Math.min(100, Math.round((allocated / capacity) * 100));

  const pct = Math.round(((step + 1) / 3) * 100);
  const fromPrice = Math.min(...tiers.map((t) => Number(t.price)).filter((n) => n > 0), Number.MAX_SAFE_INTEGER);

  const scrollTop = () => { if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };

  const next = async () => {
    if (step < 2) { setStep(step + 1); scrollTop(); return; }
    if (!terms) return;
    setSaving(true);
    const { id } = await createEvent({
      title: title || "אירוע ללא שם",
      genre,
      city: city || location || "תל אביב",
      venue: location || "",
      date: date || "בקרוב",
      time,
      description,
      age,
      ageVisible,
      image: cover || undefined,
      tiers: tiers.map((t) => ({
        name: t.name,
        price: Number(t.price) || 0,
        qty: Number(t.qty) || 0,
        exclusive: !!t.isVip,
        benefits: t.isVip
          ? [...VIP_BENEFITS.filter((b) => t.benefits?.[b.key]).map((b) => b.label), ...(t.customBenefits || [])]
          : [],
      })),
    });
    router.push(`/producer?created=${id}`);
  };
  const back = () => { if (step > 0) { setStep(step - 1); scrollTop(); } };

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
              <label className="text-primary-fixed text-label-md uppercase tracking-wider">ז'אנר מוזיקלי <span className="text-on-surface-variant/50 normal-case tracking-normal">(אפשר לבחור כמה)</span></label>
              <div className="flex flex-wrap gap-3">
                {genrePresets.map((g) => {
                  const on = genreList.includes(g);
                  return (
                    <button key={g} onClick={() => toggleGenre(g)} className={`px-5 py-2 rounded-full border transition-all flex items-center gap-1.5 ${on ? "border-secondary-fixed bg-secondary-fixed/20 text-secondary-fixed font-bold" : "border-white/10 bg-white/5 text-on-surface-variant hover:border-secondary-fixed/50"}`}>
                      {on && <Icon name="check" className="text-[16px]" />}{g.trim()}
                    </button>
                  );
                })}
              </div>
              {/* custom free-text genres */}
              {genreList.some((g) => !genrePresets.includes(g)) && (
                <div className="flex flex-wrap gap-2">
                  {genreList.filter((g) => !genrePresets.includes(g)).map((g) => (
                    <span key={g} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-fixed/15 border border-primary-fixed/40 text-primary-fixed text-label-sm">
                      {g}
                      <button onClick={() => toggleGenre(g)} className="hover:text-error"><Icon name="close" className="text-[15px] block" /></button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  value={customGenre}
                  onChange={(e) => setCustomGenre(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomGenre())}
                  placeholder="הוסף ז'אנר משלך (מלל חופשי)…"
                  className="flex-1 bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-body-md text-primary focus:border-secondary-fixed outline-none"
                />
                <button onClick={addCustomGenre} className="px-5 py-3 rounded-lg bg-surface-container-high border border-white/10 text-secondary-fixed hover:border-secondary-fixed/50 transition-colors flex items-center gap-1 shrink-0">
                  <Icon name="add" /> הוסף
                </button>
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
                <label className="text-primary-fixed text-label-md uppercase tracking-wider flex items-center gap-1.5"><Icon name="door_front" className="text-[16px]" /> שעה · פתיחת דלתות</label>
                <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="23:00" className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-4 text-body-md text-primary focus:border-primary-fixed outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-primary-fixed text-label-md uppercase tracking-wider">גיל מינימלי</label>
                <select value={age} onChange={(e) => setAge(e.target.value)} className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-4 text-body-md text-primary focus:border-primary-fixed outline-none appearance-none">
                  <option>18+</option><option>21+</option><option>23+</option><option>לכל הגילאים</option>
                </select>
                <label className="flex items-center gap-2 cursor-pointer mt-1 group">
                  <input type="checkbox" checked={ageVisible} onChange={(e) => setAgeVisible(e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-transparent text-primary-fixed focus:ring-0" />
                  <span className="text-label-sm text-on-surface-variant group-hover:text-on-surface transition-colors flex items-center gap-1">
                    <Icon name={ageVisible ? "visibility" : "visibility_off"} className="text-[16px]" />
                    {ageVisible ? "הצג גיל בעמוד האירוע" : "הגיל מוסתר מהלקוחות"}
                  </span>
                </label>
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
            <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
              <h3 className="text-headline-md text-primary flex items-center gap-2"><Icon name="description" className="text-primary-fixed" /> סיפור האירוע</h3>
              <button
                onClick={() => runAI("write")}
                disabled={aiLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-fixed/20 to-secondary-fixed/20 border border-primary-fixed/40 text-primary-fixed text-label-md hover:from-primary-fixed/30 hover:to-secondary-fixed/30 transition-all active:scale-95 disabled:opacity-60"
              >
                <Icon name="auto_awesome" className={aiLoading && aiAction === "write" ? "animate-spin" : "animate-pulse"} fill />
                {aiLoading && aiAction === "write" ? "כותב…" : "כתוב עם AI"}
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-primary-fixed text-label-md uppercase tracking-wider">תיאור</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="תאר את האווירה, הליינאפ, ולמה לצפות... או תן ל-AI לכתוב עבורך ✨" className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-4 text-body-md text-primary placeholder:text-on-surface-variant/30 resize-none focus:border-primary-fixed outline-none" />

              {/* AI refine toolbar — appears once there's text to work on */}
              {description.trim() && (
                <div className="flex flex-wrap gap-2">
                  {[
                    { action: "rewrite" as const, icon: "refresh", label: "שכתב" },
                    { action: "shorten" as const, icon: "compress", label: "קצר" },
                    { action: "lengthen" as const, icon: "expand", label: "הארך" },
                  ].map((b) => (
                    <button
                      key={b.action}
                      onClick={() => runAI(b.action)}
                      disabled={aiLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-white/10 text-secondary-fixed text-label-sm hover:border-secondary-fixed/50 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Icon name={b.icon} className={`text-[16px] ${aiLoading && aiAction === b.action ? "animate-spin" : ""}`} />
                      {aiLoading && aiAction === b.action ? "…" : b.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-[11px] text-on-surface-variant/60 flex items-center gap-1">
                  <Icon name="tips_and_updates" className="text-[14px]" /> ה-AI מנסח טקסט שיווקי על בסיס שם האירוע, הז'אנרים והמיקום שמילאת. אפשר לערוך אחר כך.
                </p>
                {aiSource === "ai" && (
                  <span className="text-[10px] text-primary-fixed flex items-center gap-1 bg-primary-fixed/10 border border-primary-fixed/30 px-2 py-0.5 rounded-full">
                    <Icon name="auto_awesome" className="text-[12px]" fill /> נוצר ע"י AI
                  </span>
                )}
                {aiSource === "local" && (
                  <span className="text-[10px] text-on-surface-variant flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                    <Icon name="draft" className="text-[12px]" /> טיוטה מקומית
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────── STEP 2 ─────────── */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Tickets column */}
          <div className="lg:col-span-2 space-y-gutter">
            {tiers.map((t, i) => (
              <TicketCard
                key={i}
                tier={t}
                index={i}
                total={tiers.length}
                onChange={setTier}
                onToggleVip={toggleVip}
                onToggleBenefit={toggleBenefit}
                onAddBenefit={addBenefit}
                onRemoveBenefit={removeBenefit}
                onRemove={removeTier}
              />
            ))}

            {/* Add ticket */}
            <button onClick={addTier} className="w-full border-2 border-dashed border-white/10 rounded-xl p-lg flex flex-col items-center justify-center gap-2 hover:border-primary-fixed/50 hover:bg-white/5 transition-all group">
              <Icon name="add_circle" className="text-4xl text-on-surface-variant group-hover:text-primary-fixed transition-colors" />
              <span className="text-label-md text-on-surface-variant uppercase group-hover:text-primary tracking-widest">הוסף סוג כרטיס +</span>
            </button>
          </div>

          {/* Capacity meter */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl p-md flex flex-col justify-center items-center text-center gap-3 bg-gradient-to-br from-surface-container-low to-black lg:sticky lg:top-24">
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
          </div>
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
                <label className="block h-40 w-full border-2 border-dashed border-white/20 rounded-xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  <input type="file" accept="image/*" onChange={onCoverFile} className="hidden" />
                  {cover ? (
                    <span className="relative block w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cover} alt="קאבר האירוע" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 right-2 bg-black/60 text-primary-fixed text-[11px] px-2 py-1 rounded-full flex items-center gap-1"><Icon name="check_circle" className="text-[14px]" fill /> הקאבר הועלה · החלף</span>
                    </span>
                  ) : (
                    <span className="h-full flex flex-col items-center justify-center">
                      <Icon name="add_a_photo" className="text-4xl text-primary-fixed mb-2" />
                      <span className="text-body-md text-on-surface-variant">לחץ להעלאת תמונת קאבר</span>
                    </span>
                  )}
                </label>
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
              {/* Commission enable */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <p className="text-label-md text-primary">הפעל עמלת יח״צ</p>
                  <p className="text-body-md text-on-surface-variant">תגמל את צוות היח״צ עבור כל מכירת כרטיס</p>
                </div>
                <button onClick={() => setCommissionEnabled((v) => !v)} className={`w-14 h-7 rounded-full relative shrink-0 transition-colors ${commissionEnabled ? "bg-on-tertiary-container" : "bg-surface-container-highest"}`} aria-label="הפעל עמלת יח״צ">
                  <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all ${commissionEnabled ? "right-0.5" : "right-7"}`} />
                </button>
              </div>

              {commissionEnabled && (
                <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  {/* Mode switch: percentage vs per-ticket */}
                  <div className="flex gap-2">
                    {[
                      { mode: "percent" as const, icon: "percent", label: "אחוזים" },
                      { mode: "fixed" as const, icon: "sell", label: "סכום פר כרטיס" },
                    ].map((m) => (
                      <button
                        key={m.mode}
                        onClick={() => setCommissionMode(m.mode)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-label-md transition-all ${commissionMode === m.mode ? "border-on-tertiary-container bg-on-tertiary-container/15 text-on-tertiary-container font-bold" : "border-white/10 bg-surface-container-low text-on-surface-variant hover:border-on-tertiary-container/40"}`}
                      >
                        <Icon name={m.icon} className="text-[18px]" /> {m.label}
                      </button>
                    ))}
                  </div>

                  {commissionMode === "percent" ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <p className="text-body-md text-on-surface-variant">אחוז מכל מכירה</p>
                        <span className="text-headline-md text-on-tertiary-container">{commission}%</span>
                      </div>
                      <input type="range" min={0} max={20} value={commission} onChange={(e) => setCommission(Number(e.target.value))} className="w-full accent-[#b300b3]" />
                      <div className="flex justify-between text-label-sm text-on-surface-variant"><span>20%</span><span>10%</span><span>0%</span></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-body-md text-on-surface-variant">סכום קבוע (₪) ליחצן עבור כל כרטיס שנמכר</p>
                      <div className="flex items-center gap-2">
                        <span className="text-headline-md text-on-tertiary-container">₪</span>
                        <input type="number" min={0} value={commissionFixed} onChange={(e) => setCommissionFixed(Number(e.target.value))} className="flex-1 bg-surface-container-low border border-white/10 rounded-lg p-3 text-primary text-headline-md focus:border-on-tertiary-container outline-none" />
                        <span className="text-body-md text-on-surface-variant whitespace-nowrap">לכרטיס</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
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

              {/* AI hashtags for social */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Icon name="tag" className="text-on-tertiary-container" />
                    <p className="text-label-md text-primary">האשטגים לרשתות</p>
                  </div>
                  <button onClick={genHashtags} disabled={hashtagsLoading} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-primary-fixed/20 to-secondary-fixed/20 border border-primary-fixed/40 text-primary-fixed text-label-sm hover:from-primary-fixed/30 hover:to-secondary-fixed/30 transition-all active:scale-95 disabled:opacity-60">
                    <Icon name="auto_awesome" className={hashtagsLoading ? "animate-spin text-[16px]" : "text-[16px]"} fill /> {hashtagsLoading ? "יוצר…" : "צור עם AI"}
                  </button>
                </div>
                {hashtags && (
                  <div className="flex items-start gap-2">
                    <p className="flex-1 text-body-md text-secondary-fixed leading-relaxed break-words">{hashtags}</p>
                    <button onClick={() => navigator.clipboard?.writeText(hashtags)} className="shrink-0 w-9 h-9 rounded-lg bg-surface-container-high border border-white/10 flex items-center justify-center text-primary active:scale-95 transition-transform" aria-label="העתק">
                      <Icon name="content_copy" className="text-[18px]" />
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Live preview + publish */}
          <div className="xl:col-span-5 space-y-gutter">
            <div className="sticky top-24 space-y-gutter">
              <div className="bg-surface-container rounded-2xl overflow-hidden border border-white/10">
                <div className="relative h-48 bg-surface-container-high flex items-center justify-center overflow-hidden">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt="קאבר" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <Icon name="image" className="text-on-surface-variant/30 text-5xl" />
                  )}
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
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

            </div>
          </div>
        </div>
      )}

      {/* Footer nav (steps 1-2) */}
      {step < 2 && (
        <div className="mt-lg flex gap-3">
          <button onClick={next} className="flex-[2] md:flex-none md:w-56 bg-primary-fixed text-on-primary-fixed px-5 py-2.5 rounded-lg text-label-md font-bold shadow-neon-primary hover:scale-[1.02] transition-all flex items-center justify-center gap-2 active:scale-95">
            הבא: {steps[step + 1]} <Icon name="arrow_back" className="text-[18px]" />
          </button>
          {step > 0 && (
            <button onClick={back} className="flex-1 md:flex-none md:w-32 bg-surface-container-high text-primary border border-white/10 px-5 py-2.5 rounded-lg text-label-md hover:bg-surface-container-highest transition-all active:scale-95">חזרה</button>
          )}
        </div>
      )}
      {step === 2 && (
        <div className="mt-lg space-y-3">
          {/* Terms */}
          <label className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="w-5 h-5 mt-0.5 rounded border-white/20 bg-surface-container-highest text-on-tertiary-container focus:ring-0" />
            <span className="text-body-md text-on-surface-variant">אני מאשר כי פרטי האירוע נכונים ואני מסכים לתנאי השימוש למפיקים</span>
          </label>
          <button onClick={next} disabled={!terms || saving} className="w-full py-4 bg-primary-container text-on-primary-container text-label-md font-bold rounded-xl shadow-neon-primary active:scale-95 transition-all hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-40 disabled:shadow-none group">
            {saving ? "מפרסם..." : "פרסם אירוע"}
            {!saving && <Icon name="rocket_launch" className="text-[20px] group-hover:-translate-x-1 transition-transform" />}
          </button>
          <div className="flex gap-3">
            <button className="flex-1 py-2.5 border border-white/20 text-on-surface-variant text-label-md rounded-lg hover:bg-white/5 transition-all active:scale-95">שמור כטיוטה</button>
            <button onClick={back} className="flex-1 py-2.5 text-on-surface-variant hover:text-primary text-label-md flex items-center justify-center gap-1">
              <Icon name="arrow_forward" className="text-[18px]" /> חזרה לכרטיסים
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { SafeImage } from "@/components/SafeImage";
import { getMyProducer, updateMyProducer } from "@/lib/producerProfile";

export default function ProducerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [f, setF] = useState({ name: "", company: "", phone: "", email: "", whatsapp: "", avatar: "", logo: "" });

  useEffect(() => {
    getMyProducer().then((p) => {
      if (p) setF({ name: p.name || "", company: p.company || "", phone: p.phone || "", email: p.email || "", whatsapp: p.whatsapp || "", avatar: p.avatarUrl || "", logo: p.logoUrl || "" });
      setLoading(false);
    });
  }, []);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => { setF((x) => ({ ...x, [k]: e.target.value })); setSaved(false); };

  const save = async () => {
    setSaving(true);
    const ok = await updateMyProducer({
      name: f.name.trim() || "מפיק", company: f.company.trim() || null,
      phone: f.phone.trim() || null, email: f.email.trim() || null, whatsapp: f.whatsapp.trim() || null,
      avatar_url: f.avatar.trim() || null, logo_url: f.logo.trim() || null,
    });
    setSaving(false);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  const field = "w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none";

  if (loading) return <main className="min-h-screen flex items-center justify-center"><Icon name="progress_activity" className="animate-spin text-primary-fixed text-3xl" /></main>;

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop max-w-2xl">
      <h1 className="text-lg font-bold text-primary-fixed mb-1">פרופיל המפיק</h1>
      <p className="text-on-surface-variant text-label-md mb-lg">הפרטים שיופיעו אצל מנהל הפלטפורמה ובאזורים הציבוריים.</p>

      {/* Avatar + logo preview */}
      <section className="flex items-center gap-4 mb-lg">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary-fixed/40 bg-surface-container-highest flex items-center justify-center shrink-0">
          {f.avatar ? <SafeImage src={f.avatar} alt="פרופיל" className="w-full h-full object-cover" /> : <span className="text-primary-fixed text-2xl font-bold">{(f.name || "?").charAt(0)}</span>}
        </div>
        <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-surface-container-highest flex items-center justify-center shrink-0">
          {f.logo ? <SafeImage src={f.logo} alt="לוגו" className="w-full h-full object-contain" /> : <Icon name="image" className="text-on-surface-variant" />}
        </div>
        <div className="text-label-sm text-on-surface-variant">תמונת פרופיל ולוגו — הדבק/י קישור לתמונה בשדות למטה.</div>
      </section>

      <section className="space-y-3">
        <div><label className="text-[11px] text-on-surface-variant block mb-1">שם מפיק</label><input value={f.name} onChange={set("name")} placeholder="שם מלא" className={field} /></div>
        <div><label className="text-[11px] text-on-surface-variant block mb-1">שם חברה</label><input value={f.company} onChange={set("company")} placeholder="שם החברה / ההפקה" className={field} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[11px] text-on-surface-variant block mb-1">טלפון</label><input value={f.phone} onChange={set("phone")} inputMode="tel" placeholder="05X-XXXXXXX" className={field} dir="ltr" /></div>
          <div><label className="text-[11px] text-on-surface-variant block mb-1">וואטסאפ</label><input value={f.whatsapp} onChange={set("whatsapp")} inputMode="tel" placeholder="05X-XXXXXXX" className={field} dir="ltr" /></div>
        </div>
        <div><label className="text-[11px] text-on-surface-variant block mb-1">אימייל</label><input value={f.email} onChange={set("email")} type="email" placeholder="name@company.co.il" className={field} dir="ltr" /></div>
        <div><label className="text-[11px] text-on-surface-variant block mb-1">קישור לתמונת פרופיל</label><input value={f.avatar} onChange={set("avatar")} placeholder="https://…" className={field} dir="ltr" /></div>
        <div><label className="text-[11px] text-on-surface-variant block mb-1">קישור ללוגו</label><input value={f.logo} onChange={set("logo")} placeholder="https://…" className={field} dir="ltr" /></div>
      </section>

      <button onClick={save} disabled={saving} className="mt-lg w-full sm:w-auto bg-primary-fixed text-on-primary-fixed font-bold px-8 py-3 rounded-lg flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 transition-all disabled:opacity-50">
        {saving ? <>שומר… <Icon name="sync" className="animate-spin text-[18px]" /></> : saved ? <><Icon name="check_circle" fill className="text-[18px]" /> נשמר!</> : <><Icon name="save" className="text-[18px]" /> שמירת פרופיל</>}
      </button>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { SafeImage } from "@/components/SafeImage";
import { EnableNotifications } from "@/components/EnableNotifications";
import { getMyProducer, updateMyProducer } from "@/lib/producerProfile";

export default function ProducerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [f, setF] = useState({ name: "", company: "", phone: "", email: "", whatsapp: "", avatar: "", logo: "" });

  useEffect(() => {
    getMyProducer().then((p) => {
      if (p) setF({ name: p.name || "", company: p.company || "", phone: p.phone || "", email: p.email || "", whatsapp: p.whatsapp || "", avatar: p.avatarUrl || "", logo: p.logoUrl || "" });
      setLoading(false);
    });
  }, []);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((x) => ({ ...x, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    const ok = await updateMyProducer({
      name: f.name.trim() || "מפיק", company: f.company.trim() || null,
      phone: f.phone.trim() || null, email: f.email.trim() || null, whatsapp: f.whatsapp.trim() || null,
      avatar_url: f.avatar.trim() || null, logo_url: f.logo.trim() || null,
    });
    setSaving(false);
    if (ok) setEditing(false);
  };

  const field = "w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none";

  if (loading) return <main className="min-h-screen flex items-center justify-center"><Icon name="progress_activity" className="animate-spin text-primary-fixed text-3xl" /></main>;

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop max-w-2xl">
      <h1 className="text-lg font-bold text-primary-fixed mb-1">פרופיל המפיק</h1>
      <p className="text-on-surface-variant text-label-md mb-md">הפרטים שיופיעו אצל מנהל הפלטפורמה ובאזורים הציבוריים.</p>

      {/* Mobile notifications */}
      <div className="glass-card rounded-xl p-md mb-lg flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Icon name="notifications_active" className="text-primary-fixed-dim" />
          <div>
            <p className="text-label-md text-on-surface">התראות על רכישות</p>
            <p className="text-[11px] text-on-surface-variant">קבל התראה לנייד בכל פעם שנמכר כרטיס לאירוע שלך.</p>
          </div>
        </div>
        <EnableNotifications />
      </div>

      {editing ? (
        /* ───────── Edit mode ───────── */
        <>
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

          <div className="mt-lg flex gap-2">
            <button onClick={save} disabled={saving} className="flex-1 sm:flex-none bg-primary-fixed text-on-primary-fixed font-bold px-8 py-3 rounded-lg flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 transition-all disabled:opacity-50">
              {saving ? <>שומר… <Icon name="sync" className="animate-spin text-[18px]" /></> : <><Icon name="save" className="text-[18px]" /> שמירה</>}
            </button>
            <button onClick={() => setEditing(false)} className="px-6 py-3 rounded-lg glass border border-white/10 text-on-surface-variant">ביטול</button>
          </div>
        </>
      ) : (
        /* ───────── View mode ───────── */
        <section className="glass-card rounded-2xl p-md">
          <div className="flex items-center gap-4 mb-md">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary-fixed/40 bg-surface-container-highest flex items-center justify-center shrink-0">
              {f.avatar ? <SafeImage src={f.avatar} alt="פרופיל" className="w-full h-full object-cover" /> : <span className="text-primary-fixed text-3xl font-bold">{(f.name || "?").charAt(0)}</span>}
            </div>
            <div className="min-w-0">
              <h2 className="text-headline-md text-primary truncate">{f.name || "מפיק"}</h2>
              {f.company && <p className="text-on-surface-variant text-label-md truncate">{f.company}</p>}
            </div>
            {f.logo && (
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-surface-container-highest flex items-center justify-center shrink-0 mr-auto">
                <SafeImage src={f.logo} alt="לוגו" className="w-full h-full object-contain" />
              </div>
            )}
          </div>

          <div className="space-y-2 border-t border-white/5 pt-md">
            {[
              { icon: "call", label: "טלפון", value: f.phone, href: f.phone ? `tel:${f.phone}` : undefined },
              { icon: "chat", label: "וואטסאפ", value: f.whatsapp, href: f.whatsapp ? `https://wa.me/972${f.whatsapp.replace(/^0/, "")}` : undefined },
              { icon: "mail", label: "אימייל", value: f.email, href: f.email ? `mailto:${f.email}` : undefined },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between py-1.5">
                <span className="text-on-surface-variant text-label-sm flex items-center gap-2"><Icon name={r.icon} className="text-[18px] text-primary-fixed-dim" /> {r.label}</span>
                {r.value ? (
                  r.href ? <a href={r.href} target="_blank" rel="noreferrer" className="text-on-surface hover:text-primary-fixed" dir="ltr">{r.value}</a> : <span className="text-on-surface" dir="ltr">{r.value}</span>
                ) : <span className="text-on-surface-variant/50">—</span>}
              </div>
            ))}
          </div>

          <button onClick={() => setEditing(true)} className="mt-md w-full sm:w-auto bg-primary-fixed text-on-primary-fixed font-bold px-8 py-3 rounded-lg flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 transition-all">
            <Icon name="edit" className="text-[18px]" /> עריכת פרופיל
          </button>
        </section>
      )}
    </main>
  );
}

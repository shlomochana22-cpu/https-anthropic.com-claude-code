"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { SafeImage } from "@/components/SafeImage";

type Promoter = {
  id: string;
  name: string;
  phone: string;
  img?: string;
  tickets: number;
  revenue: number;
  commissionPct: number;
  active: boolean;
  pending?: boolean;
  top?: boolean;
};

const initial: Promoter[] = [
  { id: "1", name: "נועה ארגמן", phone: "054-9988776", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcZpBGodozfR-K6jQjy5ONySeDIlCPbdZIi1GtBo0KTpBzYa7FvKCaBjWN3gnB23tU53uDben_yfjouXC0CpljugpXA7DVdsfNMCWuwsZvuuf5lNKS3X3AdHSZ2eS0hI5kl6WuJOTQTK_3aySA8f7vtAS3Tic-i0Zt72BD3YggGPPtr79NCCN2D8b0Qpvm_MRZVEO3Ug5OGwGqbQlUD0AHu3hY6rIBAeAtm410EA_-d2g91HomHUGzDCOKBMVxfR3IEqpYQrEecQ", tickets: 248, revenue: 28900, commissionPct: 10, active: true, top: true },
  { id: "2", name: "עידן כהן", phone: "052-1122334", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXPf4XYyIKFe-XEIR1ykn25fdKVLxSRNAjnA-qX_tht2Oa6KkK0rqFwBCiJmtReFVZyebj67ba441U6UQkGfQH3AADDYIPs00fvO3c6vc8eWrbFA9JVTV8fPwVLlbMYOxtyN5XLvVJTixnjsrzfxxfD8yd39khZrjFajPHuDmp8jHRHkL6kMvOK4P9H5DLlgl_tqcOgJeYKT7vE1bAwfseT6GGBRvqkMGeLwZcJrcQFsEFKAkETu4nVpvxj6uz6wr9B1RdLI_LjA", tickets: 112, revenue: 12450, commissionPct: 10, active: true },
  { id: "3", name: "רועי לוי", phone: "058-5544332", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuARaJexLkN5Q_MpBNY2w5Hv0_5brtGDBkP-VN7aX2NyKKE3JoxvfGxRzvT-TJufNyWdqpNm5I7lHsOpF4QsYXZSlr_uQc4dCegoDKjntGzdUQ2EPtjwDiVuLSdVvUrVrnxI0y78c7qPm2RxrLXhyg_D5y4ma-ZXyoZPoksmS5XgoCIOP7UqOwevMupBMPW0Wn2UdNgfLz0gq0ltTYmVDUBQJH0O44eE_Ih6jFv1fpM2rxsfxCAPhGlHqoHPZgA8Xum8HYtGl-Fbew", tickets: 84, revenue: 9120, commissionPct: 8, active: true },
  { id: "4", name: "מאיה גרין", phone: "050-7788990", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3_bJxWnbx4NaczQX2QRF7Cn60T8r13oNnHpOip828Frg_7uMP4FAOxdU8ZTHtd2hwH1vgt7dc11gv0nTXxkHtpJpq8wz4vm5-0u_aIRBSYck4kvIkX997m8d1xxpqDzqfELLZ5AtkuCyKYc8B5n2uZqpJS-lpfMB7nrRFLy8ixbtcXR3ONAvBbTIBObqBhgGOwm15MCImSefORNSyiLV5kl16JiVvPPsjRjgPUlYQyU9J9DjeYyBaAC2KOGheRC7n4FgrKECepg", tickets: 142, revenue: 7400, commissionPct: 10, active: true },
  { id: "5", name: "דניאל מזרחי", phone: "053-2211009", tickets: 0, revenue: 0, commissionPct: 10, active: false, pending: true },
];

export default function TeamPage() {
  const [team, setTeam] = useState<Promoter[]>(initial);
  const [invite, setInvite] = useState("");
  const [promoName, setPromoName] = useState("");
  const [promoMsg, setPromoMsg] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const genPromo = async () => {
    setPromoLoading(true);
    try {
      const res = await fetch("/api/ai/copy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "promo", promoterName: promoName.trim() || undefined, title: "האירוע הקרוב שלך", city: "תל אביב" }),
      });
      const data = await res.json();
      if (data?.text) setPromoMsg(data.text);
    } catch {
      setPromoMsg(`🔥 ${promoName ? promoName + ", " : ""}אל תפספסו את האירוע הקרוב!\nכרטיסים דרך הלינק האישי שלי 👇`);
    } finally {
      setPromoLoading(false);
    }
  };
  const copyPromo = () => {
    navigator.clipboard?.writeText(promoMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const toggle = (id: string) => setTeam((t) => t.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  const addInvite = () => {
    const v = invite.trim();
    if (!v) return;
    setTeam((t) => [...t, { id: String(Date.now()), name: v, phone: "ממתין…", tickets: 0, revenue: 0, commissionPct: 10, active: false, pending: true }]);
    setInvite("");
  };

  const totalTickets = team.reduce((s, p) => s + p.tickets, 0);
  const totalCommission = team.reduce((s, p) => s + Math.round((p.revenue * p.commissionPct) / 100), 0);
  const activeCount = team.filter((p) => p.active).length;

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop">
      <div className="mb-lg">
        <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary-fixed">ניהול צוות</h1>
        <p className="text-on-surface-variant">היחצנים שלך · ביצועים, עמלות והזמנות</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-lg">
        {[
          { label: "יחצנים פעילים", value: String(activeCount), tone: "text-primary-fixed" },
          { label: "כרטיסים שמכרו", value: totalTickets.toLocaleString(), tone: "text-secondary-fixed" },
          { label: "עמלות ששולמו", value: `₪${totalCommission.toLocaleString()}`, tone: "text-tertiary-fixed-dim" },
          { label: "סך הצוות", value: String(team.length), tone: "text-on-surface" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-md rounded-xl flex flex-col justify-between">
            <span className="text-label-sm text-on-surface-variant">{s.label}</span>
            <span className={`text-headline-md mt-1 ${s.tone}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Invite */}
      <div className="glass-card p-md rounded-xl mb-lg">
        <h3 className="text-label-md text-primary-fixed uppercase tracking-wider mb-3">הזמנת יחצן חדש</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={invite}
            onChange={(e) => setInvite(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addInvite()}
            placeholder="שם / טלפון / אימייל של היחצן"
            className="flex-1 bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary-fixed outline-none transition-colors"
          />
          <button onClick={addInvite} className="bg-primary-container text-on-primary-container font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-neon-primary">
            <Icon name="person_add" /> שלח הזמנה
          </button>
        </div>
        <p className="text-[10px] text-on-surface-variant/60 mt-2">היחצן יקבל לינק אישי ייחודי לכל אירוע, ועמלה אוטומטית על כל מכירה.</p>
      </div>

      {/* AI share-message generator for promoters */}
      <div className="glass-card p-md rounded-xl mb-lg border border-primary-fixed/20">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <h3 className="text-label-md text-primary-fixed uppercase tracking-wider flex items-center gap-2">
            <Icon name="auto_awesome" fill /> הודעת שיתוף ליחצנים
          </h3>
          <button onClick={genPromo} disabled={promoLoading} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-primary-fixed/20 to-secondary-fixed/20 border border-primary-fixed/40 text-primary-fixed text-label-sm hover:from-primary-fixed/30 hover:to-secondary-fixed/30 transition-all active:scale-95 disabled:opacity-60">
            <Icon name="auto_awesome" className={promoLoading ? "animate-spin text-[16px]" : "text-[16px]"} fill /> {promoLoading ? "יוצר…" : "צור עם AI"}
          </button>
        </div>
        <input
          value={promoName}
          onChange={(e) => setPromoName(e.target.value)}
          placeholder="שם היחצן (אופציונלי, לפנייה אישית)"
          className="w-full bg-surface-container-low border border-white/10 rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:border-primary-fixed outline-none mb-3"
        />
        {promoMsg ? (
          <div className="flex items-start gap-2">
            <textarea value={promoMsg} onChange={(e) => setPromoMsg(e.target.value)} rows={4} className="flex-1 bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-body-md text-on-surface resize-none focus:border-primary-fixed outline-none" />
            <button onClick={copyPromo} className="shrink-0 w-10 h-10 rounded-lg bg-surface-container-high border border-white/10 flex items-center justify-center text-primary active:scale-95 transition-transform" aria-label="העתק">
              <Icon name={copied ? "check" : "content_copy"} className={`text-[18px] ${copied ? "text-primary-fixed" : ""}`} />
            </button>
          </div>
        ) : (
          <p className="text-[11px] text-on-surface-variant/60 flex items-center gap-1">
            <Icon name="tips_and_updates" className="text-[14px]" /> צור הודעת וואטסאפ מוכנה שהיחצנים ישלחו ללקוחות, עם קריאה ללחוץ על הלינק האישי שלהם.
          </p>
        )}
      </div>

      {/* Team list */}
      <h3 className="text-headline-md text-primary mb-md">הצוות שלי</h3>
      <div className="space-y-md">
        {team.map((p) => {
          const commission = Math.round((p.revenue * p.commissionPct) / 100);
          return (
            <div key={p.id} className={`glass-card rounded-2xl p-md ${p.pending ? "border-secondary-fixed/20" : "hover:border-primary-fixed/30"} transition-colors`}>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* identity */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary-fixed/30">
                      {p.img ? (
                        <SafeImage className="w-full h-full object-cover" src={p.img} alt={p.name} />
                      ) : (
                        <div className="w-full h-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant"><Icon name="person" /></div>
                      )}
                    </div>
                    {p.top && (
                      <div className="absolute -bottom-1 -left-1 bg-primary-fixed text-black rounded-full p-0.5 border-2 border-background">
                        <Icon name="star" className="text-[14px] block" fill />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-label-md text-white flex items-center gap-2">
                      {p.name}
                      {p.top && <span className="text-[10px] text-primary-fixed font-bold">מוביל</span>}
                    </p>
                    <p className="text-label-sm text-on-surface-variant">{p.phone}</p>
                    {p.pending && <span className="inline-block mt-1 text-[10px] bg-secondary-fixed/10 text-secondary-fixed px-2 py-0.5 rounded border border-secondary-fixed/20">ממתין לאישור</span>}
                  </div>
                </div>

                {/* metrics */}
                <div className="flex items-center gap-6 text-center">
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase">כרטיסים</p>
                    <p className="text-label-md text-white font-bold">{p.tickets}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase">הכנסה</p>
                    <p className="text-label-md text-secondary-fixed font-bold">₪{p.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase">עמלה ({p.commissionPct}%)</p>
                    <p className="text-label-md text-primary-fixed font-bold">₪{commission.toLocaleString()}</p>
                  </div>
                </div>

                {/* actions */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 bg-surface-container-high border border-white/10 text-primary px-3 py-2 rounded-lg text-label-sm hover:border-primary-fixed/40 transition-colors">
                    <Icon name="link" className="text-[18px]" /> לינקים
                  </button>
                  <button className="w-9 h-9 bg-surface-container-high border border-white/10 rounded-lg flex items-center justify-center text-primary active:scale-95 transition-transform">
                    <Icon name="chat" className="text-[18px]" />
                  </button>
                  <button onClick={() => toggle(p.id)} className={`w-11 h-6 rounded-full relative shrink-0 ${p.active ? "bg-primary-fixed" : "bg-surface-container-highest"}`} aria-label="פעיל">
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${p.active ? "right-0.5" : "right-[22px]"}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

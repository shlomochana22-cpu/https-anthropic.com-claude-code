"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import type { DBCoupon } from "@/lib/queries";
import { createCoupon, setCouponActive, removeCoupon } from "@/lib/coupons";

type Coupon = { id: string; code: string; value: string; off: string; used: number; cap: number; expires: string; active: boolean };

const DEMO: Coupon[] = [
  { id: "seed-1", code: "NEXUS20", value: "20%", off: "OFF", used: 142, cap: 500, expires: "24.08.2024", active: true },
  { id: "seed-2", code: "VIP_ONLY", value: "₪50", off: "FLAT", used: 48, cap: 100, expires: "30.12.2024", active: true },
  { id: "seed-3", code: "EARLYBIRD", value: "10%", off: "OFF", used: 200, cap: 200, expires: "01.07.2024", active: false },
];

const fmtDate = (d: string | null) => (d ? d.split("-").reverse().join(".") : "ללא הגבלה");
const fromDb = (c: DBCoupon): Coupon => ({
  id: c.id,
  code: c.code,
  value: c.kind === "percent" ? `${c.amount}%` : `₪${c.amount}`,
  off: c.kind === "percent" ? "OFF" : "FLAT",
  used: c.used,
  cap: c.cap ?? 9999,
  expires: fmtDate(c.expires),
  active: c.active,
});

export function CouponsBoard({ dbCoupons }: { dbCoupons: DBCoupon[] }) {
  const [coupons, setCoupons] = useState<Coupon[]>(dbCoupons.length ? dbCoupons.map(fromDb) : DEMO);
  const [code, setCode] = useState("");
  const [kind, setKind] = useState<"percent" | "flat">("percent");
  const [amount, setAmount] = useState("");
  const [cap, setCap] = useState("");
  const [expires, setExpires] = useState("");
  const [justCreated, setJustCreated] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const create = async () => {
    const c = code.trim().toUpperCase();
    if (!c || !amount.trim()) {
      setError("יש למלא קוד קופון וגם סכום/אחוז הנחה");
      return;
    }
    setError(null);
    setSaving(true);
    const { id } = await createCoupon({
      code: c,
      kind,
      amount: Number(amount) || 0,
      cap: cap.trim() ? Number(cap) : null,
      expires: expires || null,
    });
    setCoupons((list) => [
      { id, code: c, value: kind === "percent" ? `${amount}%` : `₪${amount}`, off: kind === "percent" ? "OFF" : "FLAT", used: 0, cap: Number(cap) || 9999, expires: fmtDate(expires || null), active: true },
      ...list,
    ]);
    setCode(""); setAmount(""); setCap(""); setExpires("");
    setSaving(false);
    setJustCreated(c);
    setTimeout(() => setJustCreated(null), 3500);
    setTimeout(() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };
  const toggle = (id: string) => {
    setCoupons((l) => l.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
    const c = coupons.find((x) => x.id === id);
    if (c) void setCouponActive(id, !c.active);
  };
  const remove = (id: string) => {
    setCoupons((l) => l.filter((c) => c.id !== id));
    void removeCoupon(id);
  };

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop">
      <header className="mb-lg">
        <h2 className="text-headline-lg text-primary-fixed mb-2">ניהול קופונים</h2>
        <p className="text-on-surface-variant">צור והפץ קודי הנחה בלעדיים לאירועי הלילה שלך.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-5 space-y-gutter">
          <div className="glass-card p-md rounded-xl">
            <h3 className="text-2xl font-bold mb-md text-on-surface flex items-center gap-2"><Icon name="add_circle" className="text-primary-fixed" /> יצירת קופון חדש</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-primary-fixed uppercase tracking-wider block mr-1">קוד קופון</label>
                <input value={code} onChange={(e) => { setCode(e.target.value); setError(null); }} placeholder="SUMMER2024" className={`w-full bg-surface-container-lowest border rounded-lg p-3 text-on-surface outline-none focus:border-primary-fixed font-mono uppercase transition-colors ${error && !code.trim() ? "border-error" : "border-white/10"}`} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-primary-fixed uppercase tracking-wider block mr-1">סוג הנחה</label>
                <div className="flex gap-2">
                  <button onClick={() => setKind("percent")} className={`flex-1 py-2.5 rounded-lg border text-label-md transition-all ${kind === "percent" ? "border-primary-fixed bg-primary-container/15 text-primary-fixed font-bold" : "border-white/10 bg-white/5 text-on-surface-variant"}`}>אחוז %</button>
                  <button onClick={() => setKind("flat")} className={`flex-1 py-2.5 rounded-lg border text-label-md transition-all ${kind === "flat" ? "border-primary-fixed bg-primary-container/15 text-primary-fixed font-bold" : "border-white/10 bg-white/5 text-on-surface-variant"}`}>סכום ₪</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-primary-fixed uppercase tracking-wider block mr-1">{kind === "percent" ? "אחוז הנחה" : "סכום הנחה ₪"}</label>
                  <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setError(null); }} placeholder={kind === "percent" ? "15" : "50"} className={`w-full bg-surface-container-lowest border rounded-lg p-3 text-on-surface outline-none focus:border-primary-fixed transition-colors ${error && !amount.trim() ? "border-error" : "border-white/10"}`} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-primary-fixed uppercase tracking-wider block mr-1">מגבלת שימוש</label>
                  <input type="number" value={cap} onChange={(e) => setCap(e.target.value)} placeholder="ללא הגבלה" className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 text-on-surface outline-none focus:border-primary-fixed transition-colors" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-primary-fixed uppercase tracking-wider block mr-1">תאריך תפוגה</label>
                <input type="date" value={expires} onChange={(e) => setExpires(e.target.value)} className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 text-on-surface outline-none focus:border-primary-fixed transition-colors [color-scheme:dark]" />
              </div>
              <button onClick={create} disabled={saving} className="w-full mt-lg bg-primary-fixed text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-neon-primary disabled:opacity-60">
                <Icon name="rocket_launch" /> {saving ? "שומר..." : "צור קופון עכשיו"}
              </button>
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-error/10 border border-error/30 text-error text-label-md">
                  <Icon name="error" fill /> {error}
                </div>
              )}
              {justCreated && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary-fixed/10 border border-primary-fixed/30 text-primary-fixed text-label-md">
                  <Icon name="check_circle" fill /> הקופון <span className="font-mono font-bold">{justCreated}</span> נשמר ונוסף לרשימה ✓
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface-container-low border border-white/5 p-md rounded-xl flex items-center justify-between">
            <div>
              <p className="text-on-surface-variant text-label-sm">חיסכון מצטבר ללקוחות</p>
              <h4 className="text-headline-md font-bold text-secondary-fixed-dim">₪12,450</h4>
            </div>
            <div className="w-12 h-12 bg-secondary-fixed/10 rounded-full flex items-center justify-center text-secondary-fixed-dim"><Icon name="trending_up" /></div>
          </div>
        </div>

        <div ref={listRef} className="lg:col-span-7 space-y-3 scroll-mt-20">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-bold text-on-surface">קופונים פעילים</h3>
            <span className="bg-primary-fixed/10 text-primary-fixed px-3 py-1 rounded-full text-xs font-bold border border-primary-fixed/20">{coupons.filter((c) => c.active).length} פעילים</span>
          </div>
          {coupons.map((c) => (
            <div key={c.id} className={`glass-card p-md rounded-xl flex items-center justify-between gap-md ${c.active ? "" : "opacity-60 grayscale"}`}>
              <div className="flex items-center gap-md">
                <div className="w-14 h-14 rounded-lg bg-surface-container-highest flex flex-col items-center justify-center border border-white/10">
                  <span className={`font-bold text-lg ${c.active ? "text-primary-fixed" : "text-on-surface-variant"}`}>{c.value}</span>
                  <span className="text-[10px] text-on-surface-variant uppercase">{c.off}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-on-surface tracking-widest font-mono">{c.code}</h4>
                    <span className={`w-2 h-2 rounded-full ${c.active ? "bg-primary-fixed shadow-[0_0_8px_#bff520]" : "bg-error/40"}`} />
                  </div>
                  <p className={`text-xs ${c.active ? "text-on-surface-variant/60" : "text-error/60 font-bold"}`}>{c.active ? `פג תוקף ב: ${c.expires}` : `הסתיים: ${c.expires}`}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase text-on-surface-variant mb-1">שימושים</p>
                <span className="text-on-surface font-bold">{c.used}</span>
                <span className="text-on-surface-variant/40 text-xs"> / {c.cap}</span>
                <div className="w-20 h-1 bg-surface-container-highest rounded-full mt-1 overflow-hidden">
                  <div className={`h-full ${c.active ? "bg-primary-fixed" : "bg-error"}`} style={{ width: `${Math.min(100, (c.used / c.cap) * 100)}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggle(c.id)} className={`w-11 h-6 rounded-full relative shrink-0 transition-colors ${c.active ? "bg-primary-fixed" : "bg-surface-container-highest"}`} aria-label="הפעל/כבה">
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${c.active ? "right-0.5" : "right-[22px]"}`} />
                </button>
                <button onClick={() => remove(c.id)} className="text-on-surface-variant hover:text-error transition-colors"><Icon name="delete_outline" /></button>
              </div>
            </div>
          ))}
          {coupons.length === 0 && <p className="text-center text-on-surface-variant/60 py-8">אין קופונים — צור את הראשון משמאל</p>}
        </div>
      </div>
    </main>
  );
}

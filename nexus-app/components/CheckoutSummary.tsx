"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { PayButton } from "./PayButton";
import { PhoneInput } from "./PhoneInput";
import { validateCoupon } from "@/lib/coupons";
import type { Participant } from "@/lib/orders";

const GENDERS = ["אישה", "גבר", "אחר"];
const emptyParticipant = (): Participant => ({ name: "", dob: "", gender: "", idnum: "", phone: "", email: "", instagram: "" });

export function CheckoutSummary({ eventId, subtotal: urlSubtotal, fee, items }: { eventId: string; subtotal: number; fee: number; items: string }) {
  const primarySlug = items.split(",")[0]?.split(":")[0] || "";
  const initialQty = items.split(",").filter(Boolean).reduce((s, p) => s + (Number(p.split(":")[1]) || 0), 0) || 1;
  const pricePerTicket = initialQty > 0 ? Math.round(urlSubtotal / initialQty) : urlSubtotal;

  const [qty, setQty] = useState(initialQty);
  const subtotal = qty * pricePerTicket;

  const [participants, setParticipants] = useState<Participant[]>(Array.from({ length: initialQty }, emptyParticipant));
  const [open, setOpen] = useState(0);

  // Keep one participant form per ticket.
  useEffect(() => {
    setParticipants((prev) => {
      if (qty === prev.length) return prev;
      if (qty < prev.length) return prev.slice(0, qty);
      return [...prev, ...Array.from({ length: qty - prev.length }, emptyParticipant)];
    });
  }, [qty]);

  const setP = (i: number, patch: Partial<Participant>) => setParticipants((list) => list.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  // Coupon
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{ id: string; used: number; discount: number; label: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const discount = applied?.discount ?? 0;
  const total = Math.max(0, subtotal + fee - discount);

  const apply = async () => {
    const c = code.trim();
    if (!c) return;
    setChecking(true); setError(null);
    const res = await validateCoupon(c, subtotal);
    setChecking(false);
    if (res.ok) setApplied({ id: res.id, used: res.used, discount: res.discount, label: res.label });
    else { setApplied(null); setError(res.message); }
  };

  const p0 = participants[0];
  const canPay = !!(p0 && p0.name.trim() && (p0.phone ?? "").trim());
  const filledCount = participants.filter((p) => p.name.trim()).length;

  return (
    <>
      {/* Quantity */}
      <div className="glass-card p-md rounded-2xl mb-md flex items-center justify-between">
        <div>
          <p className="text-label-md text-on-surface">כמות כרטיסים</p>
          <p className="text-label-sm text-on-surface-variant">₪{pricePerTicket} לכרטיס</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center active:scale-90 transition-transform"><Icon name="remove" /></button>
          <span className="font-bold text-xl w-6 text-center text-primary">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(10, q + 1))} className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center active:scale-90 transition-transform"><Icon name="add" /></button>
        </div>
      </div>

      {/* Summary */}
      <div className="glass-card p-6 rounded-2xl space-y-4 mb-md">
        <div className="flex justify-between text-label-md text-on-surface-variant"><span>סיכום ביניים ({qty})</span><span>₪{subtotal}</span></div>
        <div className="flex justify-between text-label-md text-on-surface-variant"><span>דמי טיפול ואבטחה</span><span>₪{fee}</span></div>
        {applied && <div className="flex justify-between text-label-md text-primary-fixed"><span>קופון {applied.label}</span><span>− ₪{discount}</span></div>}
        <div className="h-px bg-white/10" />
        <div className="flex justify-between items-center">
          <span className="text-headline-md text-white">סה"כ לתשלום</span>
          <span className="text-headline-md text-primary-fixed neon-text">₪{total}</span>
        </div>
      </div>

      {/* Coupon */}
      <div className="glass-card p-md rounded-2xl mb-md">
        {applied ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary-fixed"><Icon name="check_circle" fill /><span className="text-label-md">קופון {applied.label} הוחל · חסכת ₪{discount}</span></div>
            <button onClick={() => { setApplied(null); setCode(""); }} className="text-on-surface-variant hover:text-error text-label-sm">הסר</button>
          </div>
        ) : (
          <>
            <label className="text-label-sm text-on-surface-variant mb-2 flex items-center gap-1.5"><Icon name="local_offer" className="text-primary-fixed text-[16px]" /> קוד קופון</label>
            <div className="flex gap-2">
              <input value={code} onChange={(e) => { setCode(e.target.value); setError(null); }} onKeyDown={(e) => e.key === "Enter" && apply()} placeholder="הזן קוד" className="flex-1 bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface font-mono uppercase focus:border-primary-fixed outline-none" />
              <button onClick={apply} disabled={!code.trim() || checking} className="px-5 py-2.5 rounded-lg bg-primary-fixed text-on-primary-fixed font-bold active:scale-95 disabled:opacity-40">{checking ? "בודק…" : "החל"}</button>
            </div>
            {error && <p className="text-error text-label-sm mt-2 flex items-center gap-1"><Icon name="error" className="text-[14px]" fill /> {error}</p>}
          </>
        )}
      </div>

      {/* Participants */}
      <div className="space-y-3 mb-md">
        <h3 className="text-label-md text-primary-fixed uppercase tracking-wider flex items-center gap-1.5"><Icon name="group" className="text-[18px]" /> פרטי המשתתפים ({filledCount}/{qty})</h3>
        {participants.map((p, i) => {
          const isOpen = open === i;
          const done = p.name.trim() && (p.phone ?? "").trim();
          return (
            <div key={i} className="glass-card rounded-2xl overflow-hidden">
              <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full flex items-center justify-between p-4">
                <span className="text-label-md text-on-surface flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${done ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container-highest text-on-surface-variant"}`}>{done ? "✓" : i + 1}</span>
                  משתתף {i + 1}{p.name.trim() ? ` · ${p.name}` : ""}
                </span>
                <Icon name={isOpen ? "expand_less" : "expand_more"} className="text-on-surface-variant" />
              </button>
              {isOpen && (
                <div className="p-4 pt-0 space-y-3">
                  <input value={p.name} onChange={(e) => setP(i, { name: e.target.value })} placeholder="שם מלא" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-on-surface-variant block mb-1">תאריך לידה</label>
                      <input value={p.dob} onChange={(e) => setP(i, { dob: e.target.value })} type="date" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none [color-scheme:dark]" />
                    </div>
                    <div>
                      <label className="text-[10px] text-on-surface-variant block mb-1">מגדר</label>
                      <select value={p.gender} onChange={(e) => setP(i, { gender: e.target.value })} className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none appearance-none">
                        <option value="">בחר/י</option>
                        {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                  <input value={p.idnum} onChange={(e) => setP(i, { idnum: e.target.value })} inputMode="numeric" placeholder="תעודת זהות (ת.ז)" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none" />
                  <PhoneInput value={p.phone ?? ""} onChange={(v) => setP(i, { phone: v })} />
                  <input value={p.email} onChange={(e) => setP(i, { email: e.target.value })} type="email" placeholder="אימייל" dir="ltr" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none" />
                  <input value={p.instagram} onChange={(e) => setP(i, { instagram: e.target.value })} placeholder="אינסטגרם (@username)" dir="ltr" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Points */}
      <div className="flex items-center gap-3 p-4 bg-primary-fixed/5 rounded-xl border border-primary-fixed/20">
        <Icon name="bolt" className="text-primary-fixed" />
        <p className="text-label-sm text-on-surface-variant">ברכישה זו תצברו <span className="text-primary-fixed font-bold">{Math.max(1, Math.round(total / 7))} נקודות NEXUS</span> להטבות עתידיות.</p>
      </div>

      {/* Sticky pay bar */}
      <div className="fixed bottom-0 left-0 w-full p-margin-mobile bg-gradient-to-t from-background via-background/95 to-transparent pt-8">
        <div className="max-w-md mx-auto">
          {!canPay && <p className="text-center text-label-sm text-on-surface-variant mb-2">מלאו שם וטלפון של משתתף 1 להמשך</p>}
          <PayButton
            eventId={eventId}
            items={`${primarySlug}:${qty}`}
            subtotal={subtotal - discount}
            coupon={applied ? { id: applied.id, used: applied.used } : null}
            buyer={{ name: p0?.name, phone: p0?.phone, email: p0?.email }}
            participants={participants}
            disabled={!canPay}
          />
        </div>
      </div>
    </>
  );
}

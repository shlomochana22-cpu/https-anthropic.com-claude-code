"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { PayButton } from "./PayButton";
import { PhoneInput } from "./PhoneInput";
import { validateCoupon } from "@/lib/coupons";

export function CheckoutSummary({ eventId, subtotal, fee, items }: { eventId: string; subtotal: number; fee: number; items: string }) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{ id: string; used: number; discount: number; label: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  // Buyer details — flow into the producer's customer database.
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const canPay = buyerName.trim().length > 1 && buyerPhone.trim().length > 0;

  const discount = applied?.discount ?? 0;
  const total = Math.max(0, subtotal + fee - discount);

  const apply = async () => {
    const c = code.trim();
    if (!c) return;
    setChecking(true);
    setError(null);
    const res = await validateCoupon(c, subtotal);
    setChecking(false);
    if (res.ok) {
      setApplied({ id: res.id, used: res.used, discount: res.discount, label: res.label });
    } else {
      setApplied(null);
      setError(res.message);
    }
  };
  const removeCoupon = () => { setApplied(null); setCode(""); setError(null); };

  return (
    <>
      {/* Summary */}
      <div className="glass-card p-6 rounded-2xl space-y-4 mb-md">
        <div className="flex justify-between text-label-md text-on-surface-variant"><span>סיכום ביניים</span><span>₪{subtotal}</span></div>
        <div className="flex justify-between text-label-md text-on-surface-variant"><span>דמי טיפול ואבטחה</span><span>₪{fee}</span></div>
        {applied && (
          <div className="flex justify-between text-label-md text-primary-fixed"><span>קופון {applied.label}</span><span>− ₪{discount}</span></div>
        )}
        <div className="h-px bg-white/10" />
        <div className="flex justify-between items-center">
          <span className="text-headline-md text-white">סה"כ לתשלום</span>
          <div className="text-left">
            {applied && <span className="block text-label-sm text-on-surface-variant line-through">₪{subtotal + fee}</span>}
            <span className="text-headline-md text-primary-fixed neon-text">₪{total}</span>
          </div>
        </div>
      </div>

      {/* Coupon */}
      <div className="glass-card p-md rounded-2xl mb-md">
        {applied ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary-fixed">
              <Icon name="check_circle" fill /> <span className="text-label-md">קופון {applied.label} הוחל · חסכת ₪{discount}</span>
            </div>
            <button onClick={removeCoupon} className="text-on-surface-variant hover:text-error text-label-sm">הסר</button>
          </div>
        ) : (
          <>
            <label className="text-label-sm text-on-surface-variant block mb-2 flex items-center gap-1.5"><Icon name="local_offer" className="text-primary-fixed text-[16px]" /> יש לך קוד קופון?</label>
            <div className="flex gap-2">
              <input value={code} onChange={(e) => { setCode(e.target.value); setError(null); }} onKeyDown={(e) => e.key === "Enter" && apply()} placeholder="הזן קוד" className="flex-1 bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface font-mono uppercase focus:border-primary-fixed outline-none" />
              <button onClick={apply} disabled={!code.trim() || checking} className="px-5 py-2.5 rounded-lg bg-primary-fixed text-on-primary-fixed font-bold active:scale-95 transition-transform disabled:opacity-40">{checking ? "בודק…" : "החל"}</button>
            </div>
            {error && <p className="text-error text-label-sm mt-2 flex items-center gap-1"><Icon name="error" className="text-[14px]" fill /> {error}</p>}
          </>
        )}
      </div>

      {/* Buyer details */}
      <div className="glass-card p-md rounded-2xl mb-md space-y-3">
        <h3 className="text-label-md text-primary-fixed uppercase tracking-wider flex items-center gap-1.5"><Icon name="person" className="text-[16px]" /> פרטי הרוכש</h3>
        <input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="שם מלא" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none" />
        <PhoneInput value={buyerPhone} onChange={setBuyerPhone} />
        <p className="text-[10px] text-on-surface-variant/60">הפרטים משמשים להנפקת הכרטיס ולעדכונים על האירוע.</p>
      </div>

      {/* Points */}
      <div className="flex items-center gap-3 p-4 bg-primary-fixed/5 rounded-xl border border-primary-fixed/20">
        <Icon name="bolt" className="text-primary-fixed" />
        <p className="text-label-sm text-on-surface-variant">
          ברכישה זו תצברו <span className="text-primary-fixed font-bold">{Math.max(1, Math.round(total / 7))} נקודות NEXUS</span> להטבות עתידיות.
        </p>
      </div>

      {/* Sticky pay bar */}
      <div className="fixed bottom-0 left-0 w-full p-margin-mobile bg-gradient-to-t from-background via-background/95 to-transparent pt-8">
        <div className="max-w-md mx-auto">
          {!canPay && <p className="text-center text-label-sm text-on-surface-variant mb-2">מלאו שם וטלפון להמשך</p>}
          <PayButton
            eventId={eventId}
            items={items}
            subtotal={subtotal - discount}
            coupon={applied ? { id: applied.id, used: applied.used } : null}
            buyer={{ name: buyerName, phone: buyerPhone }}
            disabled={!canPay}
          />
        </div>
      </div>
    </>
  );
}

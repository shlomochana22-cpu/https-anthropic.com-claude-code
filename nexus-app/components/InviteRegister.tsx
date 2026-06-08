"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { redeemInvite } from "@/lib/guests";
import { PhoneInput } from "@/components/PhoneInput";

/**
 * Public one-time guest registration. The customer fills their details and
 * receives a ticket. Redemption is atomic & single-use server-side via the
 * redeem_invite() function (falls back to a local code with no DB).
 */
export function InviteRegister({ token, eventTitle, qty, type }: { token: string; eventTitle: string; qty: number; type: "free" | "discount" }) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("נקבה");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");

  const submit = async () => {
    if (!first.trim() || !last.trim()) return;
    setBusy(true);
    setError(null);
    const res = await redeemInvite(token, { firstName: first.trim(), lastName: last.trim(), phone: phone.trim(), dob, gender });
    setBusy(false);
    if (res.ok) {
      setCode(res.code || `NX-${Math.random().toString(36).slice(2, 6).toUpperCase()}`);
      setDone(true);
    } else {
      setError(res.message || "הלינק כבר נוצל או אינו תקין");
    }
  };

  const entryLabel = type === "free" ? "כניסה חינם" : "כניסה מוזלת";

  if (done) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-margin-mobile text-center">
        <div className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(191,245,32,0.6)]">
          <Icon name="check" className="text-black text-5xl" />
        </div>
        <h1 className="text-headline-lg text-primary-fixed mb-1">הכרטיס שלך מוכן! 🎉</h1>
        <p className="text-on-surface-variant mb-6">{first} {last} · {eventTitle}</p>
        <div className="glass-card rounded-2xl p-6 w-full max-w-xs border border-primary-fixed/30">
          <div className="w-32 h-32 mx-auto bg-white rounded-xl flex items-center justify-center mb-4">
            <Icon name="qr_code_2" className="text-black text-8xl" />
          </div>
          <p className="font-mono text-primary tracking-widest mb-2">{code}</p>
          <div className="flex items-center justify-center gap-2 text-label-md text-primary-fixed">
            <Icon name="confirmation_number" className="text-[18px]" />
            <span>{entryLabel} · {qty} כרטיס{qty > 1 ? "ים" : ""}</span>
          </div>
        </div>
        <p className="text-[11px] text-on-surface-variant/60 mt-6 max-w-xs">הציגו את הקוד בכניסה. לינק ההזמנה הזה הוא חד-פעמי וכבר נוצל.</p>
        <Link href="/" className="mt-6 text-primary-fixed text-label-md hover:underline">לאתר NEXUS ←</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-16">
      <header className="px-margin-mobile pt-10 pb-6 bg-gradient-to-b from-primary-fixed/10 to-transparent">
        <Link href="/" className="block mb-6">
          <span className="text-headline-md font-extrabold tracking-tighter text-primary-fixed neon-text">NEXUS</span>
        </Link>
        <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-primary-fixed/15 text-primary-fixed border border-primary-fixed/30 px-2 py-0.5 rounded-full mb-2">{entryLabel} · {qty} כרטיס{qty > 1 ? "ים" : ""}</span>
        <h1 className="text-headline-lg text-primary">הוזמנת ל{eventTitle}</h1>
        <p className="text-on-surface-variant text-label-md mt-1">מלאו פרטים כדי לקבל את הכרטיס שלכם.</p>
      </header>

      <section className="px-margin-mobile space-y-4 mt-2">
        <div className="grid grid-cols-2 gap-3">
          <input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="שם פרטי" className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary-fixed outline-none" />
          <input value={last} onChange={(e) => setLast(e.target.value)} placeholder="שם משפחה" className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary-fixed outline-none" />
        </div>
        <PhoneInput value={phone} onChange={setPhone} />
        <div>
          <label className="text-label-sm text-on-surface-variant block mb-1">תאריך לידה</label>
          <input value={dob} onChange={(e) => setDob(e.target.value)} type="date" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary-fixed outline-none [color-scheme:dark]" />
        </div>
        <div>
          <label className="text-label-sm text-on-surface-variant block mb-1">מין</label>
          <div className="flex gap-2">
            {["נקבה", "זכר", "אחר"].map((g) => (
              <button key={g} onClick={() => setGender(g)} className={`flex-1 py-2.5 rounded-lg border text-label-md transition-all ${gender === g ? "border-primary-fixed bg-primary-container/15 text-primary-fixed font-bold" : "border-white/10 bg-white/5 text-on-surface-variant"}`}>{g}</button>
            ))}
          </div>
        </div>
        {error && (
          <div className="glass-card border border-error/40 rounded-xl p-3 flex items-center gap-2">
            <Icon name="error" className="text-error" fill />
            <p className="text-on-surface text-label-md">{error}</p>
          </div>
        )}
        <button onClick={submit} disabled={!first.trim() || !last.trim() || busy} className="w-full bg-primary-fixed text-on-primary-fixed font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 transition-all disabled:opacity-40 disabled:shadow-none">
          <Icon name="confirmation_number" /> {busy ? "רושם…" : "קבל את הכרטיס שלי"}
        </button>
        <p className="text-[11px] text-on-surface-variant/50 text-center">בלחיצה אתם מאשרים את תנאי השימוש. הלינק תקף לרישום אחד בלבד.</p>
      </section>
    </main>
  );
}

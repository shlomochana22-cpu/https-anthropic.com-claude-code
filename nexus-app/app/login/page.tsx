"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { browserSupabase } from "@/lib/supabaseBrowser";

/**
 * Customer / בליין entry — the default login. Phone + SMS code (OTP), with
 * social shortcuts. Falls straight through in demo mode (no Supabase env).
 */
export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullPhone = () => "+972" + phone.replace(/\D/g, "").replace(/^0+/, "");

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (phone.replace(/\D/g, "").length < 7) {
      setError("מספר טלפון לא תקין");
      return;
    }
    setBusy(true);
    const sb = browserSupabase();
    try {
      if (!sb) {
        // Demo mode — skip straight in.
        router.push("/");
        return;
      }
      const { error } = await sb.auth.signInWithOtp({ phone: fullPhone() });
      if (error) {
        setError(error.message);
        return;
      }
      setStep("code");
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const sb = browserSupabase();
    try {
      if (!sb) {
        router.push("/");
        return;
      }
      const { error } = await sb.auth.verifyOtp({ phone: fullPhone(), token: code.trim(), type: "sms" });
      if (error) {
        setError(error.message);
        return;
      }
      router.push("/");
    } finally {
      setBusy(false);
    }
  }

  async function social(provider: "google" | "apple") {
    const sb = browserSupabase();
    if (!sb) {
      router.push("/");
      return;
    }
    await sb.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/` } });
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-margin-mobile relative">
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-fixed-dim/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-container/10 blur-[120px] rounded-full" />
      </div>

      {/* Branding */}
      <header className="mb-xl text-center">
        <h1 className="text-headline-xl text-primary-fixed-dim tracking-tighter mb-xs neon-text">NEXUS</h1>
        <p className="text-body-md text-on-surface-variant opacity-80">הכרטיס שלך ללילות הכי חמים</p>
      </header>

      <div className="w-full max-w-md glass-card rounded-xl p-md flex flex-col gap-md shadow-2xl">
        <div className="text-center mb-1">
          <h2 className="text-headline-md text-primary mb-xs">ברוכים השבים</h2>
          <p className="text-label-md text-on-surface-variant">
            {step === "phone" ? "התחברו כדי להמשיך לחגוג" : `שלחנו קוד אימות ל־${fullPhone()}`}
          </p>
        </div>

        {step === "phone" ? (
          <>
            {/* Social logins */}
            <div className="flex flex-col gap-sm">
              <button onClick={() => social("google")} className="w-full h-14 bg-surface-container-high rounded-lg flex items-center justify-center gap-sm text-label-md text-primary hover:bg-surface-bright transition-all border border-outline-variant/10">
                <span className="text-[18px] font-bold text-primary-fixed-dim">G</span>
                <span>התחברות עם Google</span>
              </button>
              <button onClick={() => social("apple")} className="w-full h-14 bg-primary text-background rounded-lg flex items-center justify-center gap-sm text-label-md hover:opacity-90 transition-all">
                <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                <span>התחברות עם Apple</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-sm my-1">
              <div className="h-px flex-1 bg-outline-variant/30" />
              <span className="text-label-sm text-on-surface-variant uppercase tracking-widest">או</span>
              <div className="h-px flex-1 bg-outline-variant/30" />
            </div>

            {/* Phone form */}
            <form onSubmit={sendCode} className="flex flex-col gap-md">
              <div className="flex flex-col gap-xs">
                <label className="text-label-sm text-primary-fixed-dim uppercase mr-xs">מספר טלפון</label>
                <div className="relative flex items-center rounded-lg bg-surface-container-low border border-outline-variant/20 focus-within:border-primary-fixed-dim focus-within:shadow-neon-primary transition-all" dir="ltr">
                  <div className="flex items-center gap-xs px-4 border-l border-outline-variant/20 self-stretch">
                    <span className="text-[20px]">🇮🇱</span>
                    <span className="text-body-md text-primary">+972</span>
                  </div>
                  <input
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setError(null); }}
                    type="tel"
                    inputMode="tel"
                    placeholder="50-000-0000"
                    className="w-full bg-transparent border-none py-4 px-4 focus:ring-0 text-primary text-body-md outline-none"
                  />
                </div>
              </div>
              {error && <p className="text-error text-label-md text-center">{error}</p>}
              <button type="submit" disabled={busy} className="w-full h-14 bg-primary-fixed-dim text-on-primary-fixed text-headline-md rounded-lg neon-pulse hover:opacity-90 transition-all mt-1 disabled:opacity-60">
                {busy ? "שולח…" : "שלח קוד אימות"}
              </button>
            </form>
          </>
        ) : (
          /* Code verification */
          <form onSubmit={verify} className="flex flex-col gap-md">
            <input
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(null); }}
              inputMode="numeric"
              placeholder="הקוד מה-SMS"
              dir="ltr"
              className="w-full text-center tracking-[0.5em] text-headline-md bg-surface-container-low border border-outline-variant/20 rounded-lg py-4 text-primary focus:border-primary-fixed-dim outline-none"
            />
            {error && <p className="text-error text-label-md text-center">{error}</p>}
            <button type="submit" disabled={busy || code.trim().length < 4} className="w-full h-14 bg-primary-fixed-dim text-on-primary-fixed text-headline-md rounded-lg hover:opacity-90 transition-all disabled:opacity-60">
              {busy ? "מאמת…" : "אישור וכניסה"}
            </button>
            <button type="button" onClick={() => { setStep("phone"); setCode(""); setError(null); }} className="text-label-md text-on-surface-variant hover:text-primary-fixed-dim transition-colors">
              שינוי מספר טלפון
            </button>
          </form>
        )}

        <div className="text-center mt-1">
          <p className="text-label-md text-on-surface-variant">
            רוצה להפיק אירועים?{" "}
            <Link href="/producer/login" className="text-primary-fixed-dim font-bold hover:underline">כניסת מפיקים</Link>
          </p>
        </div>
      </div>

      {/* Micro feature row */}
      <div className="mt-xl flex flex-wrap justify-center gap-md opacity-40 grayscale pointer-events-none">
        {[
          { icon: "confirmation_number", label: "כרטיסים דיגיטליים" },
          { icon: "celebration", label: "אירועים בלעדיים" },
          { icon: "verified_user", label: "אבטחה מלאה" },
        ].map((f) => (
          <div key={f.label} className="text-center">
            <Icon name={f.icon} className="text-[32px] text-primary-fixed-dim" />
            <p className="text-label-sm mt-xs">{f.label}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

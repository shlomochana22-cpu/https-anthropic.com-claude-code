"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { browserSupabase } from "@/lib/supabaseBrowser";

/**
 * Producer (PRO) entry — email + password. Reached from inside the app
 * ("כניסת מפיקים"). Falls straight through to the dashboard in demo mode.
 */
export default function ProducerLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    const sb = browserSupabase();
    try {
      if (!sb) {
        router.push("/producer");
        return;
      }
      if (mode === "login") {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) { setError(error.message); return; }
        router.push("/producer");
      } else {
        const { data, error } = await sb.auth.signUp({ email, password });
        if (error) { setError(error.message); return; }
        if (data.session) router.push("/producer");
        else { setInfo("נרשמת! שלחנו מייל אימות — אשר אותו ואז התחבר."); setMode("login"); }
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-margin-mobile relative">
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-fixed/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-fixed/5 blur-[120px] rounded-full" />
      </div>

      {/* Top brand */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-center py-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Icon name="bolt" className="text-primary-fixed text-3xl group-hover:drop-shadow-[0_0_8px_rgba(191,245,32,0.8)] transition-all" />
          <span className="text-headline-md font-extrabold tracking-tighter text-primary-fixed drop-shadow-[0_0_10px_rgba(191,245,32,0.4)]">NEXUS</span>
          <span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-widest mr-1 mt-1">PRO</span>
        </Link>
      </header>

      <div className="relative z-10 w-full max-w-[480px] flex flex-col items-center">
        <div className="text-center mb-lg space-y-3">
          <h1 className="text-headline-xl text-primary tracking-tight">{mode === "login" ? "כניסת מפיקים" : "הרשמת מפיקים"}</h1>
          <p className="text-body-lg text-on-surface-variant max-w-[320px] mx-auto leading-relaxed">נהל את האירועים, המכירות והקהל שלך במקום אחד.</p>
        </div>

        <form onSubmit={submit} className="w-full glass-card rounded-xl p-md flex flex-col gap-md">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-label-sm uppercase tracking-widest text-on-surface-variant mr-1">כתובת אימייל</label>
            <div className="relative border border-outline-variant/40 bg-surface-container-lowest rounded-lg focus-within:border-primary-fixed focus-within:shadow-neon-primary transition-all">
              <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} placeholder="name@nexus.co.il" dir="ltr" className="w-full bg-transparent border-none focus:ring-0 py-4 px-md text-body-md text-primary outline-none" />
              <Icon name="alternate_email" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" />
            </div>
          </div>
          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-label-sm uppercase tracking-widest text-on-surface-variant">סיסמה</label>
              <Link href="/help" className="text-label-sm text-primary-fixed hover:text-primary-fixed-dim transition-colors">שכחתי סיסמה?</Link>
            </div>
            <div className="relative border border-outline-variant/40 bg-surface-container-lowest rounded-lg focus-within:border-primary-fixed focus-within:shadow-neon-primary transition-all">
              <input type="password" required value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }} placeholder="••••••••" dir="ltr" className="w-full bg-transparent border-none focus:ring-0 py-4 px-md text-body-md text-primary outline-none" />
              <Icon name="lock" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" />
            </div>
          </div>

          {error && <p className="text-error text-label-md text-center">{error}</p>}
          {info && <p className="text-primary-fixed text-label-md text-center">{info}</p>}

          <button type="submit" disabled={busy} className="w-full bg-primary-fixed text-on-primary-fixed py-4 rounded-lg text-headline-md shadow-neon-primary mt-2 hover:bg-primary-fixed-dim transition-colors disabled:opacity-60">
            {busy ? "..." : mode === "login" ? "כניסה למערכת" : "צור חשבון"}
          </button>

          <div className="text-center mt-2">
            <p className="text-body-md text-on-surface-variant">
              {mode === "login" ? "עדיין אין לך חשבון מפיק? " : "כבר רשום? "}
              <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary-fixed font-bold mr-1 hover:underline decoration-2 underline-offset-4">
                {mode === "login" ? "הגש בקשה להצטרפות" : "כניסה"}
              </button>
            </p>
          </div>
        </form>

        {/* Trust badges */}
        <div className="mt-xl w-full flex flex-wrap justify-center items-center gap-md opacity-60">
          {[
            { icon: "verified_user", label: "SSL SECURE" },
            { icon: "encrypted", label: "ENCRYPTED DATA" },
            { icon: "shield_person", label: "NEXUS PROTECTION" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
              <Icon name={b.icon} className="text-secondary-fixed text-xl" />
              <span className="text-label-sm uppercase tracking-widest">{b.label}</span>
            </div>
          ))}
        </div>

        <Link href="/login" className="mt-lg text-label-md text-on-surface-variant hover:text-primary-fixed transition-colors flex items-center gap-1">
          <Icon name="arrow_forward" className="text-[18px]" /> חזרה לכניסת לקוחות
        </Link>
      </div>
    </main>
  );
}

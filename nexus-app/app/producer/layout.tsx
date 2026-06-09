"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ProducerSidebar, ProducerBottomNav } from "@/components/ProducerNav";
import { ProducerPurchaseAlerts } from "@/components/ProducerPurchaseAlerts";
import { browserSupabase } from "@/lib/supabaseBrowser";

export default function ProducerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/producer/login";
  const [ready, setReady] = useState(false);

  // Auth guard: when Supabase is configured, the dashboard requires a logged-in
  // producer — otherwise redirect to /producer/login. In demo mode (no Supabase
  // env) the area stays open so the app runs without credentials.
  useEffect(() => {
    if (isLogin) { setReady(true); return; }
    const sb = browserSupabase();
    if (!sb) { setReady(true); return; }
    let active = true;
    sb.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (!data.session) router.replace("/producer/login");
      else setReady(true);
    });
    return () => { active = false; };
  }, [isLogin, pathname, router]);

  // Standalone producer login — no dashboard chrome.
  if (isLogin) return <div className="min-h-screen">{children}</div>;

  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin text-primary-fixed text-3xl">progress_activity</span>
        <p className="text-label-md">מאמת הרשאות…</p>
      </div>
    );
  }

  return (
    <>
      <ProducerSidebar />
      <div className="md:mr-[280px] min-h-screen">{children}</div>
      <ProducerBottomNav />
      <ProducerPurchaseAlerts />
    </>
  );
}

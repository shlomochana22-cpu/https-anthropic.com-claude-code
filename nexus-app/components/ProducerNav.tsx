"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { browserSupabase } from "@/lib/supabaseBrowser";

async function signOut(router: ReturnType<typeof useRouter>) {
  const sb = browserSupabase();
  if (sb) await sb.auth.signOut();
  router.push("/");
}

const links = [
  { href: "/producer", icon: "dashboard", label: "דאשבורד" },
  { href: "/producer/events", icon: "confirmation_number", label: "ניהול אירועים" },
  { href: "/producer/create", icon: "add_circle", label: "יצירת אירוע" },
  { href: "/producer/guests", icon: "group", label: "רשימות מוזמנים" },
  { href: "/producer/scanner", icon: "qr_code_scanner", label: "סורק כרטיסים" },
  { href: "/producer/stats", icon: "analytics", label: "סטטיסטיקות" },
  { href: "/producer/wallet", icon: "account_balance_wallet", label: "ארנק והכנסות" },
  { href: "/producer/team", icon: "groups", label: "ניהול צוות" },
  { href: "/producer/promoters", icon: "leaderboard", label: "יחצנים · ביצועים" },
  { href: "/producer/coupons", icon: "local_offer", label: "קופונים" },
  { href: "/producer/campaigns", icon: "ads_click", label: "קמפיינים" },
  { href: "/producer/customers", icon: "contacts", label: "מאגר לקוחות" },
];

/** Desktop sidebar for the producer (Pro) area. */
export function ProducerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <aside className="hidden md:flex fixed right-0 top-0 h-full w-[280px] z-40 bg-surface-container-high border-l border-white/5 shadow-2xl flex-col p-md">
      <Link href="/" className="mb-lg px-2 block">
        <span className="text-headline-md font-extrabold tracking-tighter text-primary-fixed neon-text">NEXUS</span>
        <p className="text-on-surface-variant text-xs mt-1">Producer · Pro</p>
      </Link>
      <nav className="space-y-1">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? "bg-primary-container text-on-primary-container font-bold"
                  : "text-on-surface-variant hover:bg-white/5"
              }`}
            >
              <Icon name={l.icon} />
              <span className="text-label-md">{l.label}</span>
            </Link>
          );
        })}
      </nav>
      <button onClick={() => signOut(router)} className="mt-auto flex items-center gap-3 px-4 py-3 text-error hover:bg-error/10 rounded-lg transition-all w-full text-right">
        <Icon name="logout" />
        <span className="text-label-md">יציאה</span>
      </button>
    </aside>
  );
}

/** Mobile bottom nav for the producer area. */
export function ProducerBottomNav() {
  const pathname = usePathname();
  const items = [
    { href: "/producer", icon: "dashboard", label: "דאשבורד" },
    { href: "/producer/events", icon: "confirmation_number", label: "אירועים" },
    { href: "/producer/scanner", icon: "qr_code_scanner", label: "סורק" },
    { href: "/producer/wallet", icon: "account_balance_wallet", label: "ארנק" },
    { href: "/", icon: "exit_to_app", label: "יציאה לאתר" },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-[env(safe-area-inset-bottom)] h-20 bg-surface-container-lowest/90 backdrop-blur-2xl border-t border-white/5 shadow-[0_-8px_24px_rgba(0,0,0,0.5)] rounded-t-xl">
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`flex flex-col items-center justify-center transition-all ${
              active ? "text-primary-fixed drop-shadow-[0_0_8px_rgba(191,245,32,0.6)] scale-110" : "text-on-surface-variant/60"
            }`}
          >
            <Icon name={it.icon} fill={active} />
            <span className="text-label-sm mt-1">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

const items = [
  { href: "/", icon: "explore", label: "גילוי" },
  { href: "/tickets", icon: "confirmation_number", label: "כרטיסים" },
  { href: "/favorites", icon: "favorite", label: "מועדפים" },
  { href: "/notifications", icon: "notifications", label: "התראות" },
  { href: "/profile", icon: "person", label: "פרופיל" },
];

/** Shared bottom navigation shell. Highlights the active route. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-[env(safe-area-inset-bottom)] h-20 bg-surface-container-lowest/90 backdrop-blur-2xl border-t border-white/5 shadow-[0_-8px_24px_rgba(0,0,0,0.5)] rounded-t-xl">
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`flex flex-col items-center justify-center transition-all duration-200 ${
              active
                ? "text-primary-fixed drop-shadow-[0_0_8px_rgba(191,245,32,0.6)] scale-110"
                : "text-on-surface-variant/60 hover:text-primary-fixed"
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

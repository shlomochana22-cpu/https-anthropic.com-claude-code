"use client";

import { usePathname } from "next/navigation";
import { ProducerSidebar, ProducerBottomNav } from "@/components/ProducerNav";

export default function ProducerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The producer login is standalone — no sidebar margin / nav chrome.
  const isLogin = pathname === "/producer/login";
  return (
    <>
      <ProducerSidebar />
      <div className={isLogin ? "min-h-screen" : "md:mr-[280px] min-h-screen"}>{children}</div>
      <ProducerBottomNav />
    </>
  );
}

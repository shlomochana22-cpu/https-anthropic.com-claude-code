"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { amIAdmin } from "@/lib/admin";

/** Link into the platform-admin center — rendered only for admins. */
export function AdminEntry() {
  const [show, setShow] = useState(false);
  useEffect(() => { amIAdmin().then(setShow); }, []);
  if (!show) return null;

  return (
    <Link href="/admin" className="mb-md block glass-card rounded-2xl p-4 border border-secondary-fixed/30 hover:bg-white/5 transition-colors relative overflow-hidden">
      <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-secondary-fixed/10 blur-3xl rounded-full" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary-fixed/15 flex items-center justify-center"><Icon name="shield_person" className="text-secondary-fixed" /></div>
          <div>
            <p className="font-bold text-secondary-fixed">מרכז ניהול הפלטפורמה</p>
            <p className="text-sm text-on-surface-variant">סקירה גלובלית · בקשות תשלום · עמלות · אירועים</p>
          </div>
        </div>
        <Icon name="arrow_back" className="text-secondary-fixed" />
      </div>
    </Link>
  );
}

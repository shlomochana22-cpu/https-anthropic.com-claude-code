"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { notifPermission, requestNotifPermission, nativeNotify } from "@/lib/pushNotify";

/** A policy-compliant button to enable browser/mobile notifications. */
export function EnableNotifications({ className = "" }: { className?: string }) {
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">("default");
  useEffect(() => { setPerm(notifPermission()); }, []);

  if (perm === "unsupported") return null;

  if (perm === "granted") {
    return (
      <div className={`flex items-center gap-2 text-label-sm text-primary-fixed ${className}`}>
        <Icon name="notifications_active" className="text-[18px]" fill /> התראות נייד מופעלות
      </div>
    );
  }

  const enable = async () => {
    const p = await requestNotifPermission();
    setPerm(p);
    if (p === "granted") nativeNotify("NEXUS", "התראות הופעלו בהצלחה — תקבל עדכונים על רכישות ובקשות.");
  };

  return (
    <button onClick={enable} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-fixed/10 text-primary-fixed border border-primary-fixed/30 text-label-md font-bold active:scale-95 transition-all ${className}`}>
      <Icon name="notifications" className="text-[18px]" />
      {perm === "denied" ? "התראות חסומות — אפשר בהגדרות הדפדפן" : "הפעל התראות לנייד"}
    </button>
  );
}

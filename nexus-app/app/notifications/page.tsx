"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Icon } from "@/components/Icon";

type Note = {
  icon: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  tone?: "primary" | "magenta" | "muted";
};

const initial: Note[] = [
  { icon: "confirmation_number", title: "הכרטיס שלך אושר!", body: "הכרטיס ל-Solomon בחוות רונית מוכן. נתראה ברחבה!", time: "לפני 2 דק׳", unread: true },
  { icon: "local_offer", title: "הטבה בלעדית ל-VIP", body: "20% הנחה על שולחנות לאירועי סוף השבוע. המלאי מוגבל.", time: "לפני שעה", unread: false, tone: "magenta" },
  { icon: "notifications_active", title: "תזכורת: המכירה נפתחת", body: "מכירת ה-Early Bird ל-Nexus Festival מתחילה בעוד 15 דקות.", time: "לפני 3 שעות", unread: true },
  { icon: "security", title: "אבטחת חשבון", body: "התחברות חדשה לחשבון שלך ממכשיר iPhone 15 Pro.", time: "לפני יומיים", unread: false, tone: "muted" },
];

export default function NotificationsPage() {
  const [notes, setNotes] = useState<Note[]>(initial);
  const markAll = () => setNotes((n) => n.map((x) => ({ ...x, unread: false })));
  const markOne = (i: number) => setNotes((n) => n.map((x, idx) => (idx === i ? { ...x, unread: false } : x)));
  const unreadCount = notes.filter((n) => n.unread).length;

  return (
    <>
      <Header />
      <main className="pt-20 pb-32 px-margin-mobile max-w-2xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-headline-lg-mobile text-white mb-1">התראות</h2>
            <p className="text-on-surface-variant/70">{unreadCount > 0 ? `${unreadCount} עדכונים שלא נקראו` : "הכל מעודכן ✓"}</p>
          </div>
          <button onClick={markAll} disabled={unreadCount === 0} className="text-primary-fixed text-sm hover:underline disabled:opacity-40 disabled:no-underline">סמן הכל כנקרא</button>
        </div>
        <div className="space-y-4">
          {notes.map((n, i) => (
            <button
              key={i}
              onClick={() => markOne(i)}
              className={`w-full text-right glass-card p-4 rounded-xl flex gap-4 relative overflow-hidden hover:bg-white/5 transition-all ${n.tone === "muted" ? "opacity-70" : ""} ${!n.unread ? "opacity-60" : ""}`}
            >
              {n.unread && <div className="absolute left-0 top-0 h-full w-1 bg-primary-fixed shadow-[0_0_12px_rgba(191,245,32,0.8)]" />}
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                n.tone === "magenta" ? "bg-tertiary-container/10 text-tertiary-fixed-dim"
                : n.tone === "muted" ? "bg-surface-container-highest text-on-surface-variant"
                : "bg-primary-container/20 text-primary-fixed"
              }`}>
                <Icon name={n.icon} fill={n.tone !== "muted"} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm text-white font-bold flex items-center gap-2">{n.title}{n.unread && <span className="w-2 h-2 rounded-full bg-primary-fixed" />}</h3>
                  <span className="text-[10px] text-on-surface-variant/60">{n.time}</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">{n.body}</p>
              </div>
            </button>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  );
}

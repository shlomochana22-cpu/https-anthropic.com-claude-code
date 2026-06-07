import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Icon } from "@/components/Icon";

type Note = {
  icon: string;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
  tone?: "primary" | "magenta" | "muted";
};

const notes: Note[] = [
  { icon: "confirmation_number", title: "הכרטיס שלך אושר!", body: "הכרטיס ל-Solomon בחוות רונית מוכן. נתראה ברחבה!", time: "לפני 2 דק׳", unread: true },
  { icon: "local_offer", title: "הטבה בלעדית ל-VIP", body: "20% הנחה על שולחנות לאירועי סוף השבוע. המלאי מוגבל.", time: "לפני שעה", tone: "magenta" },
  { icon: "notifications_active", title: "תזכורת: המכירה נפתחת", body: "מכירת ה-Early Bird ל-Nexus Festival מתחילה בעוד 15 דקות.", time: "לפני 3 שעות", unread: true },
  { icon: "security", title: "אבטחת חשבון", body: "התחברות חדשה לחשבון שלך ממכשיר iPhone 15 Pro.", time: "לפני יומיים", tone: "muted" },
];

export default function NotificationsPage() {
  return (
    <>
      <Header />
      <main className="pt-20 pb-32 px-margin-mobile max-w-2xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-headline-lg-mobile text-white mb-1">התראות</h2>
            <p className="text-on-surface-variant/70">העדכונים החמים מהלילה שלך</p>
          </div>
          <button className="text-primary-fixed text-sm hover:underline">סמן הכל כנקרא</button>
        </div>
        <div className="space-y-4">
          {notes.map((n, i) => (
            <div
              key={i}
              className={`glass-card p-4 rounded-xl flex gap-4 relative overflow-hidden hover:bg-white/5 transition-all ${
                n.tone === "muted" ? "opacity-70" : ""
              }`}
            >
              {n.unread && (
                <div className="absolute left-0 top-0 h-full w-1 bg-primary-fixed shadow-[0_0_12px_rgba(191,245,32,0.8)]" />
              )}
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  n.tone === "magenta"
                    ? "bg-tertiary-container/10 text-tertiary-fixed-dim"
                    : n.tone === "muted"
                    ? "bg-surface-container-highest text-on-surface-variant"
                    : "bg-primary-container/20 text-primary-fixed"
                }`}
              >
                <Icon name={n.icon} fill={n.tone !== "muted"} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm text-white font-bold">{n.title}</h3>
                  <span className="text-[10px] text-on-surface-variant/60">{n.time}</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  );
}

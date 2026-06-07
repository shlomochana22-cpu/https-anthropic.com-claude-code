import { Icon } from "@/components/Icon";

const stats = [
  { label: "סך הכל מוזמנים", value: "1,248", tone: "text-white" },
  { label: "אושרו", value: "892", tone: "text-primary-fixed" },
  { label: "נסרקו בקופה", value: "412", tone: "text-secondary-fixed" },
  { label: "ממתינים", value: "356", tone: "text-error" },
];
const guests = [
  { initial: "א", name: "איתי לוי", phone: "054-1234567 • מוזמן VIP", status: "Approved", tone: "primary" },
  { initial: "ד", name: "דנה כהן", phone: "052-8889900 • מוזמן הפקה", status: "Scanned", tone: "cyan" },
  { initial: "נ", name: "נועם אברהם", phone: "050-5556677 • רשימה רגילה", status: "Pending", tone: "error" },
];

export default function GuestsPage() {
  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop">
      <h2 className="text-headline-lg-mobile text-primary-fixed mb-1">ניהול רשימות מוזמנים</h2>
      <p className="text-on-surface-variant/80 mb-lg">ניהול של 1,248 מוזמנים</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-lg">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-md rounded-xl flex flex-col justify-between">
            <span className="text-label-sm text-on-surface-variant">{s.label}</span>
            <span className={`text-headline-md mt-1 ${s.tone}`}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="relative mb-md">
        <Icon name="search" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input className="w-full glass border border-white/10 rounded-xl py-3 pr-12 pl-4 text-on-surface focus:border-primary-fixed outline-none" placeholder="חיפוש לפי שם, טלפון או קוד..." />
      </div>

      <div className="space-y-gutter">
        {guests.map((g) => (
          <div key={g.name} className={`glass-card p-md rounded-xl flex items-center justify-between ${g.tone === "error" ? "border-error/20" : ""}`}>
            <div className="flex items-center gap-md">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl ${
                g.tone === "error" ? "bg-error-container/40 text-error" : "bg-gradient-to-br from-primary-fixed to-secondary-fixed text-on-primary-fixed"
              }`}>
                {g.initial}
              </div>
              <div className="flex flex-col">
                <span className="text-label-md text-white">{g.name}</span>
                <span className="text-label-sm text-on-surface-variant">{g.phone}</span>
              </div>
            </div>
            <div className="flex items-center gap-md">
              <span className={`px-3 py-1 rounded-lg text-label-sm border ${
                g.tone === "primary" ? "bg-primary-container/20 text-primary-fixed border-primary-fixed/30"
                : g.tone === "cyan" ? "bg-secondary-fixed/10 text-secondary-fixed border-secondary-fixed/30"
                : "bg-error-container/20 text-error border-error/30"
              }`}>{g.status}</span>
              <button className="text-on-surface-variant hover:text-white transition-colors"><Icon name="more_vert" /></button>
            </div>
          </div>
        ))}
      </div>

      <button className="fixed bottom-24 left-6 md:bottom-8 w-16 h-16 bg-primary-fixed text-on-primary-fixed rounded-full shadow-neon-primary flex items-center justify-center active:scale-90 transition-all z-50">
        <Icon name="person_add" className="text-[32px]" />
      </button>
    </main>
  );
}

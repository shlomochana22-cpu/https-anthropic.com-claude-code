import { Icon } from "@/components/Icon";

const tiers = [
  { name: "Early Bird", sold: 450, total: 450, color: "bg-primary-fixed", note: "סולד אאוט" },
  { name: "Regular Entry", sold: 820, total: 1000, color: "bg-primary-fixed/80", note: "נמכר מהר" },
  { name: "VIP Nexus Lounge", sold: 125, total: 350, color: "bg-secondary-container", note: "נותרו כרטיסים" },
];
const ages = [
  { label: "18-21", h: 40 },
  { label: "22-25", h: 85 },
  { label: "26-30", h: 100 },
  { label: "31-35", h: 30 },
  { label: "35+", h: 15 },
];

export default function StatsPage() {
  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop space-y-md">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-fixed" />
          </span>
          <span className="text-xs font-bold text-primary-fixed tracking-widest uppercase">Live Analytics</span>
        </div>
        <h2 className="text-4xl font-black text-white">Cyber Rave 2024</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="glass-card rounded-xl p-6 h-48 flex flex-col justify-between">
          <div>
            <p className="text-on-surface-variant text-sm">סך הכנסות</p>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-4xl font-bold text-white">₪142,500</span>
              <span className="text-primary-fixed text-sm font-bold flex items-center gap-1">
                <Icon name="trending_up" className="text-xs" /> 12.5%+
              </span>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 h-48 flex items-center justify-between gap-4">
          <div>
            <p className="text-on-surface-variant text-sm mb-1">נוכחות בזמן אמת</p>
            <div className="text-3xl font-bold text-white">1,240</div>
            <div className="text-on-surface-variant/60 text-xs">מתוך 1,800 נסרקו</div>
          </div>
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle className="text-white/5" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeWidth="8" />
              <circle className="text-primary-fixed" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeDasharray="301.59" strokeDashoffset="90" strokeWidth="8" />
            </svg>
            <span className="absolute text-xl font-bold text-white">69%</span>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Icon name="confirmation_number" className="text-primary-fixed" /> סטטוס כרטיסים</h3>
        <div className="space-y-6">
          {tiers.map((t) => (
            <div key={t.name}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-white">{t.name} <span className="text-primary-fixed/60 font-normal mr-2">{t.note}</span></span>
                <span className="text-on-surface-variant">{t.sold} / {t.total}</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${t.color}`} style={{ width: `${(t.sold / t.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">התפלגות גילאים</h3>
        <div className="flex items-end justify-between h-32 gap-2">
          {ages.map((a) => (
            <div key={a.label} className="flex flex-col items-center gap-2 w-full">
              <div className={`w-full rounded-t-sm ${a.h === 100 ? "bg-primary-fixed" : "bg-primary-fixed/30"}`} style={{ height: `${a.h}%` }} />
              <span className={`text-[10px] ${a.h === 100 ? "text-primary-fixed font-bold" : "text-on-surface-variant"}`}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

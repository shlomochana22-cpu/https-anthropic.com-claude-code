import { Icon } from "@/components/Icon";

const podium = [
  { rank: 2, name: "עידן כהן", amount: "₪12,450", h: "h-32", color: "border-on-tertiary-container", chip: "bg-on-tertiary-container" },
  { rank: 1, name: "נועה ארגמן", amount: "₪28,900", h: "h-44", color: "border-primary-fixed-dim", chip: "bg-primary-fixed-dim text-on-primary-fixed", big: true },
  { rank: 3, name: "רועי לוי", amount: "₪9,120", h: "h-24", color: "border-secondary-fixed-dim", chip: "bg-secondary-fixed-dim" },
];
const rows = [
  { rank: 4, name: "מאיה גרין", tickets: 142, amount: "₪7,400" },
  { rank: 5, name: "דניאל מזרחי", tickets: 118, amount: "₪6,250" },
];

export default function LeaderboardPage() {
  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop max-w-2xl">
      <div className="flex gap-2 mb-8 p-1 bg-surface-container rounded-xl">
        <button className="flex-1 py-2 rounded-lg text-label-md bg-primary-fixed-dim text-on-primary-fixed shadow-lg">דירוג יחצנים</button>
        <button className="flex-1 py-2 rounded-lg text-label-md text-on-surface-variant hover:bg-white/5">הביצועים שלי</button>
        <button className="flex-1 py-2 rounded-lg text-label-md text-on-surface-variant hover:bg-white/5">תחרויות</button>
      </div>

      <section className="flex items-end justify-between gap-2 mb-10">
        {podium.map((p) => (
          <div key={p.rank} className={`flex flex-col items-center ${p.big ? "flex-[1.2] -mb-2" : "flex-1"}`}>
            <div className={`relative mb-3 rounded-full overflow-hidden border-2 ${p.color} ${p.big ? "w-20 h-20" : "w-16 h-16"} bg-surface-container-highest`}>
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                <Icon name="person" />
              </div>
            </div>
            <span className={`text-label-md mb-1 truncate w-full text-center ${p.big ? "text-primary-fixed-dim font-bold" : "text-white"}`}>{p.name}</span>
            <span className="text-label-sm text-on-surface-variant mb-4">{p.amount}</span>
            <div className={`w-full ${p.h} glass-card rounded-t-xl border-t-2 ${p.color}`} />
          </div>
        ))}
      </section>

      <h3 className="text-headline-md text-white mb-4">דירוג מלא</h3>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.rank} className="glass-card rounded-xl p-4 flex items-center gap-4">
            <span className="w-6 text-on-surface-variant font-bold">{r.rank}</span>
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
              <Icon name="person" />
            </div>
            <div className="flex-1">
              <p className="text-label-md text-white">{r.name}</p>
              <p className="text-label-sm text-on-surface-variant">{r.tickets} כרטיסים</p>
            </div>
            <p className="text-label-md text-white">{r.amount}</p>
          </div>
        ))}
        <div className="relative bg-surface-container-high border-2 border-primary-fixed-dim/30 rounded-xl p-4 flex items-center gap-4">
          <span className="w-6 text-primary-fixed-dim font-extrabold">12</span>
          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-fixed-dim border-2 border-primary-fixed-dim">
            <Icon name="person" />
          </div>
          <div className="flex-1">
            <p className="text-label-md text-primary-fixed-dim font-bold">אני (יוסי)</p>
            <p className="text-label-sm text-primary-fixed-dim/60">48 כרטיסים</p>
          </div>
          <div className="text-left">
            <p className="text-label-md text-primary-fixed-dim font-bold">₪3,120</p>
            <span className="text-[10px] text-primary-fixed-dim/50 font-bold uppercase tracking-widest">אתה כאן</span>
          </div>
        </div>
      </div>
    </main>
  );
}

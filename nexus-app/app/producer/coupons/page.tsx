import { Icon } from "@/components/Icon";

const coupons = [
  { code: "NEXUS20", value: "20%", off: "OFF", used: 142, cap: 500, expires: "24.08.2024", active: true },
  { code: "VIP_ONLY", value: "₪50", off: "FLAT", used: 48, cap: 100, expires: "30.12.2024", active: true },
  { code: "EARLYBIRD", value: "10%", off: "OFF", used: 200, cap: 200, expires: "01.07.2024", active: false },
];

export default function CouponsPage() {
  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop">
      <header className="mb-lg">
        <h2 className="text-headline-lg text-primary-fixed mb-2">ניהול קופונים</h2>
        <p className="text-on-surface-variant">צור והפץ קודי הנחה בלעדיים לאירועי הלילה שלך.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-5">
          <div className="glass-card p-md rounded-xl">
            <h3 className="text-2xl font-bold mb-md text-on-surface flex items-center gap-2"><Icon name="add_circle" className="text-primary-fixed" /> יצירת קופון חדש</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-primary-fixed uppercase tracking-wider block mr-1">קוד קופון</label>
                <input placeholder="SUMMER2024" className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 text-on-surface outline-none focus:border-primary-fixed font-mono uppercase transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-primary-fixed uppercase tracking-wider block mr-1">אחוז הנחה</label>
                  <input type="number" placeholder="15" className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 text-on-surface outline-none focus:border-primary-fixed transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-primary-fixed uppercase tracking-wider block mr-1">מגבלת שימוש</label>
                  <input type="number" placeholder="ללא הגבלה" className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 text-on-surface outline-none focus:border-primary-fixed transition-colors" />
                </div>
              </div>
              <button className="w-full mt-lg bg-primary-fixed text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-neon-primary">
                <Icon name="rocket_launch" /> צור קופון עכשיו
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-bold text-on-surface">קופונים פעילים</h3>
            <span className="bg-primary-fixed/10 text-primary-fixed px-3 py-1 rounded-full text-xs font-bold border border-primary-fixed/20">
              {coupons.filter((c) => c.active).length} פעילים
            </span>
          </div>
          {coupons.map((c) => (
            <div key={c.code} className={`glass-card p-md rounded-xl flex items-center justify-between gap-md ${c.active ? "" : "opacity-60 grayscale"}`}>
              <div className="flex items-center gap-md">
                <div className="w-14 h-14 rounded-lg bg-surface-container-highest flex flex-col items-center justify-center border border-white/10">
                  <span className={`font-bold text-lg ${c.active ? "text-primary-fixed" : "text-on-surface-variant"}`}>{c.value}</span>
                  <span className="text-[10px] text-on-surface-variant uppercase">{c.off}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-on-surface tracking-widest font-mono">{c.code}</h4>
                    <span className={`w-2 h-2 rounded-full ${c.active ? "bg-primary-fixed shadow-[0_0_8px_#bff520]" : "bg-error/40"}`} />
                  </div>
                  <p className={`text-xs ${c.active ? "text-on-surface-variant/60" : "text-error/60 font-bold"}`}>
                    {c.active ? `פג תוקף ב: ${c.expires}` : `הסתיים: ${c.expires}`}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase text-on-surface-variant mb-1">שימושים</p>
                <span className="text-on-surface font-bold">{c.used}</span>
                <span className="text-on-surface-variant/40 text-xs"> / {c.cap}</span>
                <div className="w-20 h-1 bg-surface-container-highest rounded-full mt-1 overflow-hidden">
                  <div className={`h-full ${c.active ? "bg-primary-fixed" : "bg-error"}`} style={{ width: `${(c.used / c.cap) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

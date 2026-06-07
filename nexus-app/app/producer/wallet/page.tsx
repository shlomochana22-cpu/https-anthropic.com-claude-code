import { Icon } from "@/components/Icon";

const txns = [
  { icon: "confirmation_number", label: "מכירת כרטיסים - Cyber Rave", date: "12 יוני, 2024", amount: "+₪4,250.00", positive: true },
  { icon: "share", label: "עמלת יח\"צ - Summer Fest", date: "10 יוני, 2024", amount: "+₪840.00", positive: true },
  { icon: "outbound", label: "משיכה לחשבון בנק", date: "08 יוני, 2024", amount: "-₪2,500.00", positive: false },
  { icon: "confirmation_number", label: "מכירת כרטיסים - Neon Jungle", date: "05 יוני, 2024", amount: "+₪1,120.00", positive: true },
];

export default function ProducerWalletPage() {
  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop">
      <h1 className="text-headline-md font-bold text-primary-fixed mb-6">הארנק שלי · הכנסות מפיק</h1>

      <section className="mb-10 text-center rounded-3xl p-8 glass-card border-primary-fixed/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] max-w-2xl">
        <h2 className="text-headline-md text-on-surface-variant mb-2">יתרה זמינה למשיכה</h2>
        <div className="text-6xl font-extrabold text-primary-fixed neon-glow mb-8">₪14,582.40</div>
        <button className="bg-primary-fixed text-on-primary-fixed text-headline-md px-10 py-4 rounded-full shadow-neon-primary active:scale-95 transition-transform flex items-center justify-center gap-3 mx-auto w-full max-w-xs">
          <Icon name="payments" /> בקשת משיכה
        </button>
      </section>

      {/* Quick actions — transfers */}
      <section className="mb-8 max-w-2xl overflow-x-auto">
        <div className="flex gap-gutter min-w-max">
          {[
            { icon: "send", label: "העברה לחבר" },
            { icon: "campaign", label: "העברה ליחצן" },
            { icon: "local_shipping", label: "העברה לספק" },
            { icon: "account_balance", label: "הוספת חשבון" },
            { icon: "description", label: "הפקת דוחות" },
          ].map((a) => (
            <button key={a.label} className="flex flex-col items-center justify-center p-4 rounded-2xl glass-card w-28 h-28 hover:border-primary-fixed/50 transition-all active:scale-90 shrink-0">
              <Icon name={a.icon} className="text-primary-fixed mb-2 text-3xl" />
              <span className="text-label-sm text-on-surface text-center">{a.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-8 max-w-2xl">
        <h3 className="text-headline-md text-on-surface mb-4">חשבונות בנק למשיכה</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl glass-card flex items-center justify-between border-r-4 border-r-primary-fixed">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-fixed">
                <Icon name="account_balance" className="text-3xl" />
              </div>
              <div>
                <p className="text-body-md text-on-surface">בנק לאומי (10)</p>
                <p className="text-label-sm text-on-surface-variant font-mono">•••• 8291</p>
              </div>
            </div>
            <Icon name="chevron_left" className="text-on-surface-variant" />
          </div>
          <button className="p-5 rounded-2xl border border-dashed border-outline/30 flex items-center justify-center gap-3 hover:bg-white/5 transition-colors">
            <Icon name="add_circle" className="text-primary-fixed" />
            <span className="text-label-md text-on-surface-variant">הוספת חשבון בנק חדש</span>
          </button>
        </div>
      </section>

      <section className="max-w-2xl">
        <h3 className="text-headline-md text-on-surface mb-4">פעולות אחרונות</h3>
        <div className="space-y-3">
          {txns.map((t, i) => (
            <div key={i} className="glass-card p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.positive ? "bg-primary-fixed/10 text-primary-fixed" : "bg-surface-container-highest text-on-surface-variant"}`}>
                  <Icon name={t.icon} />
                </div>
                <div>
                  <p className="text-label-md text-on-surface">{t.label}</p>
                  <p className="text-label-sm text-on-surface-variant">{t.date}</p>
                </div>
              </div>
              <p className={`text-headline-md ${t.positive ? "text-primary-fixed" : "text-on-surface-variant"}`}>{t.amount}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

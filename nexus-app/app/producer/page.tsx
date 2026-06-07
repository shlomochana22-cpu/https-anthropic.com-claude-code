import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProducerGreeting } from "@/components/ProducerGreeting";
import { getEvents } from "@/lib/queries";

export default async function ProducerDashboard({
  searchParams,
}: {
  searchParams: { created?: string };
}) {
  const events = await getEvents();
  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop">
      {searchParams.created && (
        <div className="mb-md glass-card border border-primary-fixed/30 rounded-xl p-4 flex items-center gap-3">
          <Icon name="check_circle" className="text-primary-fixed" fill />
          <p className="text-on-surface">
            האירוע נוצר בהצלחה ונשמר{" "}
            <span className="text-on-surface-variant text-label-sm font-mono">({searchParams.created})</span>
          </p>
        </div>
      )}
      <header className="mb-lg">
        <h1 className="text-headline-xl text-primary-fixed mb-xs">שלום <ProducerGreeting /></h1>
        <p className="text-body-lg text-on-surface-variant">הנה סקירה של הביצועים שלך להיום.</p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-lg">
        <Link href="/producer/stats" className="glass-card p-md rounded-xl shadow-neon-primary">
          <div className="flex justify-between items-start mb-sm">
            <Icon name="trending_up" className="text-primary-fixed-dim bg-primary-fixed-dim/10 p-2 rounded-lg" />
            <span className="text-label-sm text-primary-fixed-dim bg-primary-fixed-dim/20 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <p className="text-label-md text-on-surface-variant mb-xs">מכירות היום</p>
          <p className="text-headline-lg text-primary">₪14,250</p>
        </Link>
        <div className="glass-card p-md rounded-xl">
          <Icon name="confirmation_number" className="text-secondary-fixed-dim bg-secondary-fixed-dim/10 p-2 rounded-lg mb-sm inline-block" />
          <p className="text-label-md text-on-surface-variant mb-xs">סה"כ כרטיסים</p>
          <p className="text-headline-lg text-primary">1,240</p>
        </div>
        <Link href="/producer/wallet" className="glass-card p-md rounded-xl">
          <Icon name="payments" className="text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 p-2 rounded-lg mb-sm inline-block" />
          <p className="text-label-md text-on-surface-variant mb-xs">הכנסות החודש</p>
          <p className="text-headline-lg text-primary">₪84,300</p>
        </Link>
      </div>

      {/* Quick navigation — all producer tools */}
      <div className="mb-lg">
        <h3 className="text-headline-md text-primary mb-md">ניהול מהיר</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-gutter">
          {[
            { href: "/producer/create", icon: "add_circle", label: "יצירת אירוע" },
            { href: "/producer/wallet", icon: "account_balance_wallet", label: "ארנק והעברות" },
            { href: "/producer/leaderboard", icon: "leaderboard", label: "לידרבורד יחצנים" },
            { href: "/producer/promoter", icon: "campaign", label: "דאשבורד יחצן" },
            { href: "/producer/scanner", icon: "qr_code_scanner", label: "סורק כרטיסים" },
            { href: "/producer/guests", icon: "group", label: "רשימות מוזמנים" },
            { href: "/producer/stats", icon: "analytics", label: "סטטיסטיקות" },
            { href: "/producer/coupons", icon: "local_offer", label: "קופונים" },
            { href: "/producer/campaigns", icon: "ads_click", label: "קמפיינים" },
            { href: "/producer/customers", icon: "contacts", label: "מאגר לקוחות" },
          ].map((t) => (
            <Link key={t.href} href={t.href} className="glass-card rounded-xl p-md flex flex-col items-center justify-center text-center gap-2 hover:bg-white/5 hover:border-primary-fixed/30 transition-all aspect-square">
              <Icon name={t.icon} className="text-primary-fixed text-3xl" />
              <span className="text-label-sm text-on-surface leading-tight">{t.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* AI insights */}
      <div className="glass-card p-md rounded-xl mb-lg border border-primary-fixed/20">
        <div className="flex items-center gap-xs mb-md">
          <Icon name="auto_awesome" className="text-primary-fixed animate-pulse" />
          <h3 className="text-headline-md text-primary">תובנות בינה מלאכותית</h3>
        </div>
        <p className="text-body-lg leading-relaxed mb-md">
          הקהל שלך מגיע בעיקר מ<span className="text-primary-fixed">תל אביב (70%)</span> בגילי{" "}
          <span className="text-secondary-fixed">22-28</span>.
        </p>
        <div className="flex flex-wrap gap-sm">
          <div className="flex-1 min-w-[140px] bg-white/5 p-sm rounded-lg border border-white/5">
            <p className="text-label-sm text-on-surface-variant mb-xs">יעילות שיווק</p>
            <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden"><div className="h-full bg-primary-fixed w-[85%]" /></div>
            <p className="text-right text-label-sm text-primary-fixed mt-1">85% גבוהה</p>
          </div>
          <div className="flex-1 min-w-[140px] bg-white/5 p-sm rounded-lg border border-white/5">
            <p className="text-label-sm text-on-surface-variant mb-xs">שימור לקוחות</p>
            <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden"><div className="h-full bg-secondary-fixed w-[42%]" /></div>
            <p className="text-right text-label-sm text-secondary-fixed mt-1">42% יציב</p>
          </div>
        </div>
      </div>

      {/* Audience demographics */}
      <div className="mb-lg">
        <h3 className="text-headline-md text-primary mb-md">דמוגרפיית קהל</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="glass-card p-md rounded-xl">
            <p className="text-label-md text-on-surface-variant mb-md">פילוח לפי גיל</p>
            <div className="flex items-end gap-sm h-32">
              {[25, 100, 75, 50, 30].map((h, i) => (
                <div key={i} className="flex-1 bg-primary-fixed/20 rounded-t relative group" style={{ height: `${h}%` }}>
                  <div className="absolute inset-0 bg-primary-fixed opacity-0 group-hover:opacity-100 transition-opacity rounded-t" />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-on-surface-variant mt-2"><span>18-21</span><span>22-25</span><span>26-30</span><span>31-35</span><span>35+</span></div>
          </div>
          <div className="glass-card p-md rounded-xl flex flex-col justify-center gap-md">
            <p className="text-label-md text-on-surface-variant">מגדר</p>
            <div className="flex items-center gap-md"><div className="w-full h-4 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-secondary-fixed w-[55%]" /></div><span className="text-label-md text-secondary-fixed min-w-[5rem]">נשים 55%</span></div>
            <div className="flex items-center gap-md"><div className="w-full h-4 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-primary-fixed w-[45%]" /></div><span className="text-label-md text-primary-fixed min-w-[5rem]">גברים 45%</span></div>
          </div>
        </div>
      </div>

      {/* Active events */}
      <div className="mb-lg">
        <div className="flex justify-between items-center mb-md">
          <h3 className="text-headline-md text-primary">אירועים פעילים</h3>
          <Link href="/producer/guests" className="text-label-md text-primary-fixed hover:underline">הצג הכל</Link>
        </div>
        <div className="space-y-sm">
          {events.map((e) => (
            <Link key={e.id} href="/producer/stats" className="glass-card rounded-xl p-sm flex items-center gap-md hover:bg-white/5 transition-all border border-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-16 h-16 rounded-lg object-cover" src={e.image} alt={e.title} />
              <div className="flex-1">
                <h4 className="text-label-md text-primary">{e.title}</h4>
                <p className="text-label-sm text-on-surface-variant">{e.venue} • {e.date}</p>
                <div className="flex items-center gap-xs mt-1">
                  <div className="h-1.5 w-32 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary-fixed" style={{ width: `${e.occupancy}%` }} />
                  </div>
                  <span className="text-[10px] text-primary-fixed font-bold">{e.occupancy}% נמכר</span>
                </div>
              </div>
              <Icon name="chevron_left" className="text-on-surface-variant/40" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

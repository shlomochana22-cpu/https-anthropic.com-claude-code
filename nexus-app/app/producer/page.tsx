import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getEvents } from "@/lib/queries";

export default async function ProducerDashboard() {
  const events = await getEvents();
  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop">
      <header className="mb-lg">
        <h1 className="text-headline-xl text-primary-fixed mb-xs">שלום אלי</h1>
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
        <Link href="/wallet" className="glass-card p-md rounded-xl">
          <Icon name="payments" className="text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 p-2 rounded-lg mb-sm inline-block" />
          <p className="text-label-md text-on-surface-variant mb-xs">הכנסות החודש</p>
          <p className="text-headline-lg text-primary">₪84,300</p>
        </Link>
      </div>

      {/* AI insights */}
      <div className="glass-card p-md rounded-xl mb-lg border border-primary-fixed/20">
        <div className="flex items-center gap-xs mb-md">
          <Icon name="auto_awesome" className="text-primary-fixed animate-pulse" />
          <h3 className="text-headline-md text-primary">תובנות בינה מלאכותית</h3>
        </div>
        <p className="text-body-lg leading-relaxed">
          הקהל שלך מגיע בעיקר מ<span className="text-primary-fixed">תל אביב (70%)</span> בגילי{" "}
          <span className="text-secondary-fixed">22-28</span>.
        </p>
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

import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Icon } from "@/components/Icon";
import { getEvents } from "@/lib/queries";

export default async function ResalePage() {
  const events = await getEvents();
  return (
    <>
      <Header />
      <main className="pt-20 pb-32 px-margin-mobile max-w-3xl mx-auto">
        <section className="mb-lg">
          <h1 className="text-headline-lg-mobile text-white mb-2">זירת המכירה החוזרת</h1>
          <p className="text-on-surface-variant opacity-80">קנו ומכרו כרטיסים בצורה בטוחה ומאובטחת.</p>
        </section>

        <div className="grid grid-cols-2 gap-sm mb-lg">
          <div className="glass-card p-md rounded-xl flex items-center gap-3 border-r-4 border-primary-fixed">
            <Icon name="verified_user" className="text-primary-fixed" fill />
            <div>
              <div className="text-sm text-white">מאומת NEXUS</div>
              <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">אימות כרטיס מיידי</div>
            </div>
          </div>
          <div className="glass-card p-md rounded-xl flex items-center gap-3 border-r-4 border-secondary-fixed">
            <Icon name="security" className="text-secondary-fixed" fill />
            <div>
              <div className="text-sm text-white">הגנת Escrow</div>
              <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">הגנה מלאה על הכסף</div>
            </div>
          </div>
        </div>

        <div className="space-y-md">
          {events.map((e) => (
            <Link key={e.id} href={`/events/${e.id}`} className="block glass-card rounded-2xl overflow-hidden group">
              <div className="relative h-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover" src={e.image} alt={e.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute top-4 left-4 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-primary-fixed/30">
                  <Icon name="verified" className="text-primary-fixed text-sm" fill />
                  <span className="text-white text-[10px] font-bold">מאומת</span>
                </div>
              </div>
              <div className="p-md flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-headline-md text-white">{e.title}</h3>
                    <div className="flex items-center gap-2 text-on-surface-variant text-label-sm mt-1">
                      <Icon name="location_on" className="text-sm" />
                      <span>{e.venue}, {e.city}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-primary-fixed text-headline-md">₪{e.fromPrice}</div>
                  </div>
                </div>
                <span className="self-end bg-white/5 text-primary-fixed px-md py-2 rounded-lg text-label-md font-bold border border-primary-fixed/20">
                  קנייה מהירה
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-lg glass-card p-lg rounded-3xl border-2 border-primary-fixed/20 bg-primary-fixed/5 text-center">
          <Icon name="shield_with_heart" className="text-primary-fixed text-5xl mb-4" fill />
          <h3 className="text-white text-headline-md mb-2">מערכת ה-Escrow שלנו</h3>
          <p className="text-on-surface-variant mb-lg">התשלום מוחזק בנאמנות ומועבר למוכר רק 24 שעות לאחר סיום האירוע.</p>
        </div>
      </main>
      <BottomNav />
    </>
  );
}

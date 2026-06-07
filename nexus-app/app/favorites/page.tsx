import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Icon } from "@/components/Icon";
import { getEvents } from "@/lib/queries";

export default async function FavoritesPage() {
  const events = await getEvents();
  return (
    <>
      <Header />
      <main className="pt-20 pb-32 px-margin-mobile max-w-2xl mx-auto space-y-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-headline-lg-mobile text-primary tracking-tight">המועדפים שלי</h2>
            <p className="text-on-surface-variant opacity-70">נבחרו במיוחד עבורך</p>
          </div>
          <Icon name="tune" className="text-primary-fixed" />
        </div>

        <section className="space-y-md">
          <h3 className="text-label-md uppercase tracking-widest text-on-surface-variant">
            אירועים שאהבתי
          </h3>
          <div className="grid grid-cols-2 gap-gutter">
            {events.map((e) => (
              <Link
                key={e.id}
                href={`/events/${e.id}`}
                className="group relative bg-surface-container rounded-xl overflow-hidden border border-white/5 transition-transform active:scale-95"
              >
                <div className="h-40 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={e.image}
                    alt={e.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-primary-fixed shadow-neon-primary">
                    <Icon name="favorite" className="text-[18px]" fill />
                  </div>
                </div>
                <div className="p-sm space-y-xs text-right">
                  <p className="text-label-md text-primary truncate">{e.title}</p>
                  <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
                    <Icon name="calendar_today" className="text-[12px]" />
                    <span>
                      {e.date} • {e.city}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-primary-fixed font-bold text-label-sm">₪{e.fromPrice}</span>
                    <span className="bg-primary-fixed/10 text-primary-fixed px-2 py-0.5 rounded text-[10px] font-bold">
                      {e.badge ?? "זמין"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}

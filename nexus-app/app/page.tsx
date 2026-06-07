import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { EventCard } from "@/components/EventCard";
import { Icon } from "@/components/Icon";
import { getEvents } from "@/lib/queries";

const categories = ["הכל", "טכנו", "מיינסטרים", "היפ הופ", "פסייטראנס", "פופ"];

export default async function HomePage() {
  const events = await getEvents();
  const featured = events[0];
  return (
    <>
      <Header />
      <main className="pt-20 pb-28 px-margin-mobile max-w-2xl mx-auto">
        {/* Search */}
        <section className="mb-lg">
          <div className="relative flex items-center bg-surface-container-high rounded-xl px-4 py-3 border border-white/5 focus-within:border-primary-fixed/50 transition-all">
            <Icon name="search" className="text-outline ml-3" />
            <input
              className="bg-transparent border-none text-on-surface focus:ring-0 w-full text-body-lg placeholder:text-outline/50 outline-none"
              placeholder="חיפוש מסיבות, מועדונים או אמנים..."
            />
            <Icon name="tune" className="text-primary-fixed cursor-pointer" />
          </div>
        </section>

        {/* Category chips */}
        <section className="mb-lg overflow-x-auto hide-scrollbar">
          <div className="flex gap-3 whitespace-nowrap py-2">
            {categories.map((c, i) => (
              <button
                key={c}
                className={`px-6 py-2 rounded-full text-label-md transition-all active:scale-95 ${
                  i === 0
                    ? "bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(191,245,32,0.3)]"
                    : "bg-surface-container-high text-on-surface-variant border border-white/5"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section className="mb-lg">
          <h2 className="text-headline-lg-mobile text-primary mb-md">אירועים מומלצים</h2>
          <Link
            href={`/events/${featured.id}`}
            className="block relative rounded-xl overflow-hidden group cursor-pointer border border-white/10 aspect-[16/10]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              src={featured.image}
              alt={featured.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-0 p-6 w-full">
              <span className="bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest mb-3 inline-block">
                {featured.badge}
              </span>
              <h3 className="text-headline-lg text-white mb-1">{featured.title}</h3>
              <p className="text-on-surface-variant text-body-md">{featured.subtitle}</p>
            </div>
          </Link>
        </section>

        {/* Upcoming list */}
        <section>
          <div className="flex justify-between items-center mb-md">
            <h2 className="text-headline-lg-mobile text-primary">אירועים קרובים</h2>
            <button className="text-primary-fixed text-label-md hover:underline">הכל</button>
          </div>
          <div className="space-y-gutter">
            {events.slice(1).map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}

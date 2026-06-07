import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { DiscoverFeed } from "@/components/DiscoverFeed";
import { getEvents } from "@/lib/queries";

export default async function HomePage() {
  const events = await getEvents();
  const featured = events[0];

  return (
    <>
      <Header />
      <main className="pt-20 pb-28 px-margin-mobile max-w-2xl mx-auto">
        {/* Featured */}
        {featured && (
          <section className="mb-lg">
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
                  {featured.badge ?? "מומלץ"}
                </span>
                <h3 className="text-headline-lg text-white mb-1">{featured.title}</h3>
                <p className="text-on-surface-variant text-body-md">{featured.subtitle}</p>
              </div>
            </Link>
          </section>
        )}

        {/* Interactive search + genre filter + results */}
        <DiscoverFeed events={events} />
      </main>
      <BottomNav />
    </>
  );
}

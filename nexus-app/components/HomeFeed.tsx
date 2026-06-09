"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { SafeImage } from "./SafeImage";
import type { NexusEvent } from "@/lib/events";

const categories = [
  { label: "Techno", icon: "speaker", genre: "טכנו" },
  { label: "Mainstream", icon: "star", genre: "מיינסטרים" },
  { label: "Trance", icon: "psychology", genre: "פסייטראנס" },
  { label: "Hip Hop", icon: "music_note", genre: "היפ הופ" },
  { label: "Pop", icon: "wb_sunny", genre: "פופ" },
];

export function HomeFeed({ events }: { events: NexusEvent[] }) {
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState<"city" | "genre" | null>(null);

  const cities = useMemo(() => Array.from(new Set(events.map((e) => e.city).filter(Boolean))), [events]);
  const genres = useMemo(() => Array.from(new Set(events.map((e) => e.genre).filter(Boolean))), [events]);

  // countdown for the early-bird banner
  const [t, setT] = useState(12 * 3600 + 4 * 60 + 55);
  useEffect(() => {
    const id = setInterval(() => setT((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const fmt = (n: number) => String(n).padStart(2, "0");
  const clock = `${fmt(Math.floor(t / 3600))}:${fmt(Math.floor((t % 3600) / 60))}:${fmt(t % 60)}`;

  const featured = events.filter((e) => e.badge).slice(0, 3);
  const hot = events.slice(0, 4);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const mq = !q || e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q) || e.city.toLowerCase().includes(q);
      const mg = !activeGenre || e.genre === activeGenre;
      const mc = !activeCity || e.city === activeCity;
      return mq && mg && mc;
    });
  }, [events, query, activeGenre, activeCity]);

  const searching = query.trim() !== "" || activeGenre !== null || activeCity !== null;
  const clearAll = () => { setQuery(""); setActiveGenre(null); setActiveCity(null); setOpenFilter(null); };

  return (
    <>
      {/* Search + filter chips */}
      <section className="mb-lg">
        <div className="relative mb-sm">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface-container-low border border-white/10 rounded-xl py-4 pr-12 pl-4 text-on-surface focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all"
            placeholder="חיפוש מסיבות ואירועים..."
          />
          <Icon name="search" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        </div>
        <div className="flex gap-sm overflow-x-auto hide-scrollbar py-2">
          {/* City filter */}
          <button
            onClick={() => setOpenFilter((f) => (f === "city" ? null : "city"))}
            className={`flex items-center gap-xs px-4 py-2 rounded-full glass whitespace-nowrap active:scale-95 transition-transform border ${
              activeCity ? "border-primary-fixed text-primary-fixed" : "border-white/10 text-on-surface-variant"
            }`}
          >
            <Icon name="location_on" className="text-[18px]" />
            <span className="text-label-md">{activeCity ?? "עיר"}</span>
            <Icon name={openFilter === "city" ? "expand_less" : "expand_more"} className="text-[16px]" />
          </button>
          {/* Genre filter */}
          <button
            onClick={() => setOpenFilter((f) => (f === "genre" ? null : "genre"))}
            className={`flex items-center gap-xs px-4 py-2 rounded-full glass whitespace-nowrap active:scale-95 transition-transform border ${
              activeGenre ? "border-primary-fixed text-primary-fixed" : "border-white/10 text-on-surface-variant"
            }`}
          >
            <Icon name="theater_comedy" className="text-[18px]" />
            <span className="text-label-md">{activeGenre ?? "ז'אנר"}</span>
            <Icon name={openFilter === "genre" ? "expand_less" : "expand_more"} className="text-[16px]" />
          </button>
          {(activeCity || activeGenre) && (
            <button onClick={clearAll} className="flex items-center gap-xs px-4 py-2 rounded-full glass whitespace-nowrap border border-white/10 text-error active:scale-95 transition-transform">
              <Icon name="close" className="text-[18px]" />
              <span className="text-label-md">נקה</span>
            </button>
          )}
        </div>

        {/* Filter dropdown panel */}
        {openFilter && (
          <div className="glass-card rounded-xl p-sm mt-1 flex flex-wrap gap-2">
            {(openFilter === "city" ? cities : genres).map((opt) => {
              const active = openFilter === "city" ? activeCity === opt : activeGenre === opt;
              return (
                <button
                  key={opt}
                  onClick={() => {
                    if (openFilter === "city") setActiveCity(active ? null : opt);
                    else setActiveGenre(active ? null : opt);
                    setOpenFilter(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-label-md transition-all ${
                    active ? "bg-primary-container text-on-primary-container font-bold" : "glass text-on-surface-variant hover:text-primary-fixed"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {searching ? (
        /* ── Search / filter results ── */
        <section className="mb-lg">
          <div className="flex justify-between items-center mb-md">
            <h2 className="text-headline-lg-mobile text-primary">תוצאות</h2>
            <button
              onClick={clearAll}
              className="text-primary-fixed text-label-md flex items-center gap-1"
            >
              <Icon name="close" className="text-[18px]" /> נקה
            </button>
          </div>
          {filtered.length ? (
            <div className="space-y-gutter">
              {filtered.map((e) => (
                <EventRow key={e.id} e={e} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-xl p-lg text-center">
              <Icon name="search_off" className="text-on-surface-variant/40 text-4xl mb-3" />
              <p className="text-on-surface-variant">לא נמצאו אירועים תואמים.</p>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* ── Featured hero carousel ── */}
          <section className="mb-lg">
            <h2 className="text-headline-lg-mobile text-primary mb-md">אירועים מומלצים</h2>
            <div className="flex gap-gutter overflow-x-auto hide-scrollbar -mx-margin-mobile px-margin-mobile">
              {featured.map((e) => (
                <Link
                  key={e.id}
                  href={`/events/${e.id}`}
                  className="min-w-[85vw] md:min-w-[400px] aspect-[4/5] relative rounded-xl overflow-hidden glass group shrink-0"
                >
                  <SafeImage className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={e.image} alt={e.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-fixed text-on-primary-fixed text-label-sm px-3 py-1 rounded-full neon-glow">{e.badge}</span>
                  </div>
                  <div className="absolute bottom-0 p-md w-full">
                    <p className="text-secondary-fixed-dim text-label-md mb-xs">{e.date} • {e.venue}, {e.city}</p>
                    <h3 className="text-headline-md text-white mb-sm">{e.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-fixed text-headline-md">₪{e.fromPrice}</span>
                      <span className="bg-primary-fixed text-on-primary-fixed px-6 py-2 rounded-lg text-label-md">הזמן עכשיו</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Early-bird availability countdown ── */}
          <section className="mb-lg">
            <div className="glass p-md rounded-xl border-primary-fixed/20">
              <div className="flex justify-between items-end mb-sm">
                <div>
                  <h4 className="text-headline-md text-white mb-xs">מכירה מוקדמת מסתיימת</h4>
                  <p className="text-on-surface-variant text-body-md">נשארו כרטיסים בודדים במחיר מוזל</p>
                </div>
                <span className="text-error text-label-md font-mono">{clock}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-error shadow-[0_0_10px_rgba(255,180,171,0.6)] w-[85%]" />
              </div>
            </div>
          </section>

          {/* ── Upcoming list ── */}
          <section className="mb-lg">
            <div className="flex justify-between items-center mb-md">
              <h2 className="text-headline-lg-mobile text-primary">אירועים קרובים</h2>
              <span className="text-primary-fixed text-label-md">{events.length}</span>
            </div>
            <div className="space-y-gutter">
              {events.map((e) => (
                <EventRow key={e.id} e={e} />
              ))}
            </div>
          </section>

          {/* ── Popular categories ── */}
          <section className="mb-lg">
            <h2 className="text-headline-lg-mobile text-primary mb-md">קטגוריות פופולריות</h2>
            <div className="flex gap-md overflow-x-auto hide-scrollbar -mx-margin-mobile px-margin-mobile py-2">
              {categories.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setActiveGenre(c.genre)}
                  className="flex flex-col items-center gap-2 shrink-0"
                >
                  <div className="w-16 h-16 rounded-full glass flex items-center justify-center border-white/10 text-on-surface-variant hover:border-primary-fixed/40 hover:text-primary-fixed transition-colors">
                    <Icon name={c.icon} />
                  </div>
                  <span className="text-label-md">{c.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* ── Hot right now ── */}
          <section className="mb-lg">
            <h2 className="text-headline-lg-mobile text-primary mb-md">חם עכשיו 🔥</h2>
            <div className="grid grid-cols-2 gap-gutter">
              {hot.map((e) => (
                <Link key={e.id} href={`/events/${e.id}`} className="glass rounded-xl overflow-hidden flex flex-col group">
                  <div className="relative aspect-square overflow-hidden">
                    <SafeImage className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={e.image} alt={e.title} />
                    <div className="absolute top-2 right-2 bg-background/60 backdrop-blur-md px-2 py-1 rounded text-[10px]">{e.date} • {e.city}</div>
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-label-md text-white mb-2 line-clamp-1">{e.title}</h3>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-primary-fixed text-label-md">₪{e.fromPrice}</span>
                      <span className="text-[12px] text-primary-fixed">רכוש עכשיו</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Personalized discovery banner ── */}
          <section className="mb-lg">
            <div className="relative rounded-xl overflow-hidden p-lg flex flex-col items-center text-center glass border-primary-fixed/20">
              <div className="absolute inset-0 bg-primary-fixed/5 animate-pulse" />
              <h3 className="text-headline-md text-white mb-sm relative z-10">מחפשים משהו ספציפי?</h3>
              <p className="text-on-surface-variant mb-md relative z-10">תנו לנו לעזור לכם למצוא את האירוע המושלם עבורכם</p>
              <Link href="/favorites" className="bg-primary-fixed text-on-primary-fixed px-xl py-4 rounded-full text-label-md neon-glow relative z-10 active:scale-95 transition-transform">
                מצאו לי מסיבה
              </Link>
            </div>
          </section>
        </>
      )}
    </>
  );
}

function EventRow({ e }: { e: NexusEvent }) {
  return (
    <Link href={`/events/${e.id}`} className="flex gap-md glass p-sm rounded-xl hover:bg-white/5 transition-all group border-white/5">
      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
        <SafeImage className="w-full h-full object-cover" src={e.image} alt={e.title} />
      </div>
      <div className="flex flex-col justify-between flex-1 py-1">
        <div>
          <h3 className="text-[18px] text-white group-hover:text-primary-fixed transition-colors">{e.title}</h3>
          <p className="text-on-surface-variant text-label-sm mt-1">{e.venue}, {e.city} • {e.date}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-secondary-fixed text-label-md">החל מ-₪{e.fromPrice}</span>
          <Icon name="arrow_back_ios" className="text-primary-fixed group-hover:translate-x-[-4px] transition-transform" />
        </div>
      </div>
    </Link>
  );
}

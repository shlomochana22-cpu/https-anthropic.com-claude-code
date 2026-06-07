"use client";

import { useMemo, useState } from "react";
import { Icon } from "./Icon";
import { EventCard } from "./EventCard";
import type { NexusEvent } from "@/lib/events";

const categories = ["הכל", "טכנו", "מיינסטרים", "היפ הופ", "פסייטראנס", "פופ"];

/** Searchable, genre-filterable event feed (client-side, instant). */
export function DiscoverFeed({ events }: { events: NexusEvent[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("הכל");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const matchCat = cat === "הכל" || e.genre === cat;
      const matchQ =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [events, query, cat]);

  return (
    <>
      {/* Search */}
      <section className="mb-lg">
        <div className="relative flex items-center bg-surface-container-high rounded-xl px-4 py-3 border border-white/5 focus-within:border-primary-fixed/50 transition-all">
          <Icon name="search" className="text-outline ml-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent border-none text-on-surface w-full text-body-lg placeholder:text-outline/50 outline-none"
            placeholder="חיפוש מסיבות, מועדונים או ערים..."
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-outline hover:text-primary-fixed">
              <Icon name="close" />
            </button>
          )}
        </div>
      </section>

      {/* Category chips */}
      <section className="mb-lg overflow-x-auto hide-scrollbar">
        <div className="flex gap-3 whitespace-nowrap py-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-6 py-2 rounded-full text-label-md transition-all active:scale-95 flex items-center gap-2 ${
                cat === c
                  ? "bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(191,245,32,0.3)]"
                  : "bg-surface-container-high text-on-surface-variant border border-white/5 hover:bg-surface-variant"
              }`}
            >
              {c === "הכל" && <Icon name="flash_on" className="text-[18px]" fill={cat === c} />}
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Results */}
      <section>
        <div className="flex justify-between items-center mb-md">
          <h2 className="text-headline-lg-mobile text-primary">
            {cat === "הכל" && !query ? "אירועים קרובים" : "תוצאות"}
          </h2>
          <span className="text-label-md text-on-surface-variant">{filtered.length} אירועים</span>
        </div>

        {filtered.length > 0 ? (
          <div className="space-y-gutter">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-lg text-center">
            <Icon name="search_off" className="text-on-surface-variant/40 text-4xl mb-3" />
            <p className="text-on-surface-variant">לא נמצאו אירועים. נסה חיפוש או קטגוריה אחרת.</p>
          </div>
        )}
      </section>
    </>
  );
}

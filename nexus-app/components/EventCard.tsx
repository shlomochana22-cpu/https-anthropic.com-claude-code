import Link from "next/link";
import { Icon } from "./Icon";
import { SafeImage } from "./SafeImage";
import type { NexusEvent } from "@/lib/events";

/** Horizontal list-style event card that links to the event page. */
export function EventCard({ event }: { event: NexusEvent }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="flex gap-md glass p-sm rounded-xl hover:bg-white/5 transition-all group border-white/5"
    >
      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
        <SafeImage className="w-full h-full object-cover" src={event.image} alt={event.title} />
      </div>
      <div className="flex flex-col justify-between flex-1 py-1">
        <div>
          <h3 className="text-[18px] text-white group-hover:text-primary-fixed transition-colors">
            {event.title}
          </h3>
          <p className="text-on-surface-variant text-label-sm mt-1">
            {event.venue}, {event.city} • {event.date}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-secondary-fixed text-label-md">החל מ-₪{event.fromPrice}</span>
          <Icon name="arrow_back_ios" className="text-primary-fixed" />
        </div>
      </div>
    </Link>
  );
}

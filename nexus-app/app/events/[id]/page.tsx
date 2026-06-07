import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { EventDetail } from "@/components/EventDetail";
import { getEvent, events } from "@/lib/events";

export function generateStaticParams() {
  return events.map((e) => ({ id: e.id }));
}

export default function EventPage({ params }: { params: { id: string } }) {
  const event = getEvent(params.id);
  if (!event) notFound();
  return (
    <>
      <Header back="/" />
      <EventDetail event={event} />
    </>
  );
}

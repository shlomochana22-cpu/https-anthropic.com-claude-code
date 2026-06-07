import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { EventDetail } from "@/components/EventDetail";
import { getEvents, getEventById } from "@/lib/queries";

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ id: e.id }));
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);
  if (!event) notFound();
  return (
    <>
      <Header back="/" />
      <EventDetail event={event} />
    </>
  );
}

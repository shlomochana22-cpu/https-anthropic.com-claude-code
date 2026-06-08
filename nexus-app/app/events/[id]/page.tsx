import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { EventDetail } from "@/components/EventDetail";
import { getEventById } from "@/lib/queries";

export const dynamic = "force-dynamic";

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

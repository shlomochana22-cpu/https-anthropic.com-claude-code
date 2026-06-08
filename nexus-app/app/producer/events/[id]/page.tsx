import { notFound } from "next/navigation";
import { EventDashboard } from "@/components/EventDashboard";
import { getEventById } from "@/lib/queries";

export default async function ProducerEventPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);
  if (!event) notFound();
  return <EventDashboard event={event} />;
}

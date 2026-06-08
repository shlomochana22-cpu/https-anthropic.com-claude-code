import { notFound } from "next/navigation";
import { EventDashboard } from "@/components/EventDashboard";
import { getEventById, getEventSales } from "@/lib/queries";

export default async function ProducerEventPage({ params }: { params: { id: string } }) {
  const [event, sales] = await Promise.all([getEventById(params.id), getEventSales()]);
  if (!event) notFound();
  return <EventDashboard event={event} sales={sales[params.id] ?? null} />;
}

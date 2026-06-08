import { notFound } from "next/navigation";
import { EventDashboard } from "@/components/EventDashboard";
import { getEventById, getEventSales, getGuestCounts } from "@/lib/queries";

export default async function ProducerEventPage({ params }: { params: { id: string } }) {
  const [event, sales, guestCounts] = await Promise.all([getEventById(params.id), getEventSales(), getGuestCounts()]);
  if (!event) notFound();
  return <EventDashboard event={event} sales={sales[params.id] ?? null} guests={guestCounts[params.id] ?? 0} />;
}

import { notFound } from "next/navigation";
import { EventDashboard } from "@/components/EventDashboard";
import { getEventById, getEventSales, getGuestCounts } from "@/lib/queries";

export default async function ProducerEventPage({ params }: { params: { id: string } }) {
  const [event, sales, guestCounts] = await Promise.all([getEventById(params.id), getEventSales(), getGuestCounts()]);
  if (!event) notFound();
  // Look up sales by the resolved canonical id (params.id can differ for Hebrew
  // slugs / URL encoding), so producer numbers match the admin's.
  return <EventDashboard event={event} sales={sales[event.id] ?? null} guests={guestCounts[event.id] ?? 0} />;
}

export const dynamic = "force-dynamic";

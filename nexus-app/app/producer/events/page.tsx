import { EventsManager } from "@/components/EventsManager";
import { getEvents, getEventSales } from "@/lib/queries";

export default async function EventManagerPage() {
  const [events, salesByEvent] = await Promise.all([getEvents(), getEventSales()]);
  return <EventsManager events={events} salesByEvent={salesByEvent} />;
}

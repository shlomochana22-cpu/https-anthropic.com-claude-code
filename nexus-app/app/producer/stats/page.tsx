import { StatsDashboard } from "@/components/StatsDashboard";
import { getEvents, getEventSales, getGuestCounts } from "@/lib/queries";

export default async function StatsPage() {
  const [events, salesByEvent, guestsByEvent] = await Promise.all([getEvents(), getEventSales(), getGuestCounts()]);
  return <StatsDashboard events={events} salesByEvent={salesByEvent} guestsByEvent={guestsByEvent} />;
}

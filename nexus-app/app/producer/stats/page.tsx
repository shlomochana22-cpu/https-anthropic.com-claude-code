import { StatsDashboard } from "@/components/StatsDashboard";
import { getEvents, getEventSales } from "@/lib/queries";

export default async function StatsPage() {
  const [events, salesByEvent] = await Promise.all([getEvents(), getEventSales()]);
  return <StatsDashboard events={events} salesByEvent={salesByEvent} />;
}

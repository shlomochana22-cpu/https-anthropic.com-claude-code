import { StatsDashboard } from "@/components/StatsDashboard";
import { getEvents } from "@/lib/queries";

export default async function StatsPage() {
  const events = await getEvents();
  return <StatsDashboard events={events} />;
}

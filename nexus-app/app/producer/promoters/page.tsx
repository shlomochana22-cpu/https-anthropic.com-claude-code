import { PromotersHub } from "@/components/PromotersHub";
import { getEvents } from "@/lib/queries";

export default async function PromotersHubPage() {
  const events = await getEvents();
  return <PromotersHub events={events} />;
}

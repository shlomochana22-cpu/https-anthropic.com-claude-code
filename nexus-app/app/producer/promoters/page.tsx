import { PromotersHub } from "@/components/PromotersHub";
import { getEvents } from "@/lib/queries";

const TABS = ["overview", "team", "leaderboard", "links"] as const;
type TabId = (typeof TABS)[number];

export default async function PromotersHubPage({ searchParams }: { searchParams: { tab?: string } }) {
  const events = await getEvents();
  const initialTab = (TABS.includes(searchParams.tab as TabId) ? searchParams.tab : "overview") as TabId;
  return <PromotersHub events={events} initialTab={initialTab} />;
}

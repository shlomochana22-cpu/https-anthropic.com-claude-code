import { CampaignStudio } from "@/components/CampaignStudio";
import { getEvents } from "@/lib/queries";

export default async function CampaignsPage() {
  const events = await getEvents();
  return <CampaignStudio events={events} />;
}

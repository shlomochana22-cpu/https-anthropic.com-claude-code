import { GuestManager } from "@/components/GuestManager";
import { getEvents } from "@/lib/queries";

export default async function GuestsPage() {
  const events = await getEvents();
  return <GuestManager events={events} />;
}

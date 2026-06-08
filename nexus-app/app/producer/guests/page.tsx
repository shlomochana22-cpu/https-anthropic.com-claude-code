import { GuestManager } from "@/components/GuestManager";
import { getEvents, getGuests } from "@/lib/queries";

export default async function GuestsPage() {
  const [events, dbGuests] = await Promise.all([getEvents(), getGuests()]);
  return <GuestManager events={events} dbGuests={dbGuests} />;
}

export const dynamic = "force-dynamic";

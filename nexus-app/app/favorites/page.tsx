import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FavoritesView } from "@/components/FavoritesView";
import { getEvents } from "@/lib/queries";

export default async function FavoritesPage() {
  const events = await getEvents();
  return (
    <>
      <Header />
      <FavoritesView events={events} />
      <BottomNav />
    </>
  );
}

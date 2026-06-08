import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ResaleBoard } from "@/components/ResaleBoard";
import { getEvents } from "@/lib/queries";

export default async function ResalePage() {
  const events = await getEvents();
  return (
    <>
      <Header />
      <ResaleBoard events={events} />
      <BottomNav />
    </>
  );
}

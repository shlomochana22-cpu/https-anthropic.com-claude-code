import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { HomeFeed } from "@/components/HomeFeed";
import { getEvents } from "@/lib/queries";

export default async function HomePage() {
  const events = await getEvents();
  return (
    <>
      <Header />
      <main className="pt-20 pb-28 px-margin-mobile max-w-2xl mx-auto">
        <HomeFeed events={events} />
      </main>
      <BottomNav />
    </>
  );
}

export const dynamic = "force-dynamic";

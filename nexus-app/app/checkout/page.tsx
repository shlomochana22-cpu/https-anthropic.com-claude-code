import { Header } from "@/components/Header";
import { CheckoutSummary } from "@/components/CheckoutSummary";
import { Countdown } from "@/components/Countdown";
import { getEventById } from "@/lib/queries";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { event?: string; total?: string; items?: string };
}) {
  const event = searchParams.event ? await getEventById(searchParams.event) : undefined;
  const subtotal = Number(searchParams.total ?? 0);
  const items = searchParams.items ?? "";
  const fee = 15;

  return (
    <>
      <Header back={event ? `/events/${event.id}` : "/"} />
      <main className="pt-24 pb-40 px-margin-mobile max-w-md mx-auto">
        <Countdown minutes={10} />
        <h1 className="text-headline-lg-mobile mb-md text-white">סיכום הזמנה</h1>

        {event && (
          <div className="glass-card rounded-xl p-md mb-gutter flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={event.image} alt={event.title} className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <h2 className="text-headline-md text-white">{event.title}</h2>
              <p className="text-label-sm text-on-surface-variant">
                {event.date} • {event.time} • {event.city}
              </p>
            </div>
          </div>
        )}

        <CheckoutSummary eventId={event?.id ?? ""} subtotal={subtotal} fee={fee} items={items} />
      </main>
    </>
  );
}

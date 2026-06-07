import { Header } from "@/components/Header";
import { PayButton } from "@/components/PayButton";
import { getEvent } from "@/lib/events";

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: { event?: string; total?: string };
}) {
  const event = searchParams.event ? getEvent(searchParams.event) : undefined;
  const subtotal = Number(searchParams.total ?? 0);
  const fee = 15;
  const total = subtotal + fee;

  return (
    <>
      <Header back={event ? `/events/${event.id}` : "/"} />
      <main className="pt-24 pb-40 px-margin-mobile max-w-md mx-auto">
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

        <div className="glass-card p-6 rounded-2xl space-y-4 mb-md">
          <div className="flex justify-between text-label-md text-on-surface-variant">
            <span>סיכום ביניים</span>
            <span>₪{subtotal}</span>
          </div>
          <div className="flex justify-between text-label-md text-on-surface-variant">
            <span>דמי טיפול ואבטחה</span>
            <span>₪{fee}</span>
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex justify-between items-center">
            <span className="text-headline-md text-white">סה"כ לתשלום</span>
            <span className="text-headline-md text-primary-fixed neon-text">₪{total}</span>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-margin-mobile bg-gradient-to-t from-background via-background/95 to-transparent pt-8">
        <div className="max-w-md mx-auto">
          <PayButton eventId={event?.id ?? ""} />
        </div>
      </div>
    </>
  );
}

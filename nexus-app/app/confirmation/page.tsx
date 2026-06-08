import Link from "next/link";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { Confetti } from "@/components/Confetti";
import { AddToCalendarButton } from "@/components/AddToCalendarButton";
import { SaveLastTicket } from "@/components/SaveLastTicket";
import { getEventById } from "@/lib/queries";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: { event?: string; order?: string; items?: string };
}) {
  const event = searchParams.event ? await getEventById(searchParams.event) : undefined;
  const orderId = searchParams.order;

  // Build a readable ticket label from the cart (slug → tier name).
  const cart = (searchParams.items ?? "").split(",").filter(Boolean).map((p) => {
    const [slug, qty] = p.split(":");
    return { slug, qty: Number(qty) || 0 };
  });
  const tierLabel = event
    ? cart.filter((c) => c.qty > 0).map((c) => `${event.tiers.find((t) => t.id === c.slug)?.name ?? "כרטיס"} ×${c.qty}`).join(" · ")
    : "";
  const qty = cart.reduce((s, c) => s + c.qty, 0) || 1;

  return (
    <>
      <Confetti />
      {orderId && <SaveLastTicket eventTitle={event?.title ?? "NEXUS EVENT"} date={event?.date ?? ""} time={event?.time ?? ""} tier={tierLabel} qty={qty} code={orderId} />}
      <Header back="/tickets" />
      <main className="pt-24 pb-32 px-margin-mobile max-w-lg mx-auto flex flex-col items-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-primary-fixed/10 flex items-center justify-center neon-glow mb-4">
            <Icon name="check" className="text-primary-fixed text-6xl" />
          </div>
          <h1 className="text-headline-lg-mobile text-primary-fixed text-center">
            התשלום עבר בהצלחה!
          </h1>
          <p className="text-on-surface-variant text-center mt-2">הכרטיס שלך ממתין ב-NEXUS PASS</p>
        </div>

        <div className="w-full glass-card rounded-3xl overflow-hidden mb-10 border border-primary-fixed/30">
          <div className="p-6 border-b border-white/5 bg-surface-container flex justify-between items-start">
            <div>
              <h2 className="text-headline-md text-white mb-1">{event?.title ?? "NEXUS EVENT"}</h2>
              {tierLabel && <p className="text-label-md text-primary-fixed mb-1">{tierLabel}</p>}
              <div className="flex items-center gap-2 text-primary-fixed">
                <Icon name="calendar_today" className="text-[18px]" />
                <span className="text-label-md">
                  {event ? `${event.date} | ${event.time}` : ""}
                </span>
              </div>
            </div>
            <div className="px-3 py-1 bg-primary-fixed/20 rounded-full flex items-center gap-1 border border-primary-fixed/30">
              <span className="w-2 h-2 bg-primary-fixed rounded-full animate-pulse" />
              <span className="text-label-sm text-primary-fixed">LIVE PASS</span>
            </div>
          </div>
          <div className="p-8 flex flex-col items-center">
            <div className="bg-white p-4 rounded-xl mb-6 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="QR"
                className="w-48 h-48"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA86E_hL_KcjHLgJWG7bT8FD3dq7wgCK5xEvOukW28f3O4XjSbjjdd7mQDLlofE7g_lh4XOILOGzq1eBVgG_fvrmtnLumLCwao3Mf0sKy99ZZjZHqWlyXP26ZGSe_CtShFMKjWRWBvTVFDS4ZykuPUsgURKZDVEtUmV5Xc6Tx-t0LHNEX_H55_bg5zKcqUScfTgyR0_vSfYe-zuxWL0lvO5t9Vb2Fzdzb9_cwL_k_XXzuhJpeEjy0m2JqpImzeOxGhKCdFxWzZLpg"
              />
            </div>
            <p className="text-label-sm text-center text-on-surface-variant opacity-60">
              נא להציג את קוד ה-QR בכניסה לאירוע. הכרטיס אישי ואינו ניתן להעברה.
            </p>
            {orderId && (
              <p className="text-label-sm text-center text-primary-fixed/60 mt-2 font-mono">
                הזמנה #{orderId}
              </p>
            )}
          </div>
        </div>

        <div className="w-full space-y-4">
          <Link
            href="/tickets"
            className="w-full py-4 bg-primary-fixed text-on-primary-fixed text-headline-md rounded-xl shadow-neon-primary active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            צפה בכרטיסים שלי <Icon name="confirmation_number" />
          </Link>
          <AddToCalendarButton title={event?.title ?? "NEXUS EVENT"} dateStr={event?.date} time={event?.time} venue={event?.venue} />
        </div>
      </main>
    </>
  );
}

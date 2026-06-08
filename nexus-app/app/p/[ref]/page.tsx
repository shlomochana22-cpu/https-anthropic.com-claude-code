import { PromoterPortal } from "@/components/PromoterPortal";
import { getEvents } from "@/lib/queries";

export default async function PromoterPortalPage({ params }: { params: { ref: string } }) {
  const events = await getEvents();
  const name = decodeURIComponent(params.ref);
  return <PromoterPortal name={name} events={events} />;
}

import { InviteRegister } from "@/components/InviteRegister";
import { getEvents } from "@/lib/queries";

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { event?: string; qty?: string; type?: string };
}) {
  const events = await getEvents();
  const event = events.find((e) => e.id === searchParams.event);
  const qty = Math.max(1, Number(searchParams.qty) || 1);
  const type = searchParams.type === "discount" ? "discount" : "free";
  return <InviteRegister token={params.token} eventTitle={event?.title ?? "האירוע"} qty={qty} type={type} />;
}

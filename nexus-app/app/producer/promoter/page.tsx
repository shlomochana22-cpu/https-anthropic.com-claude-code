import { redirect } from "next/navigation";

// Merged into the unified promoters hub.
export default function PromoterRedirect() {
  redirect("/producer/promoters");
}

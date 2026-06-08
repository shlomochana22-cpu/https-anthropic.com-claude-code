import { redirect } from "next/navigation";

// Merged into the unified promoters hub.
export default function LeaderboardRedirect() {
  redirect("/producer/promoters");
}

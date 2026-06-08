import { redirect } from "next/navigation";

// Merged into the unified promoters hub (team tab).
export default function TeamRedirect() {
  redirect("/producer/promoters?tab=team");
}

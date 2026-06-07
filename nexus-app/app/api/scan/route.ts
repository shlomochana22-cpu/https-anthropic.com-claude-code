import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/**
 * Ticket validation endpoint. POST { code } → looks the ticket up by qr_code,
 * marks it scanned on first valid scan, and reports duplicates / invalids.
 * Falls back to a demo response when Supabase is not configured.
 */
export async function POST(req: Request) {
  const { code } = await req.json().catch(() => ({ code: "" }));

  const sb = getSupabase();
  if (!sb) {
    // Demo mode — alternate success/duplicate so the UI is exercisable.
    const ok = !String(code).toLowerCase().includes("dup");
    return NextResponse.json(
      ok
        ? { status: "valid", name: "עידן אטיאס", tier: "VIP Experience", gate: "דלת אחורית" }
        : { status: "duplicate", name: "כניסה כפולה", scannedAt: "23:12" }
    );
  }

  const { data: ticket } = await sb
    .from("tickets")
    .select("id, status, scanned_at, user_id, event_id, tier_id")
    .eq("qr_code", code)
    .single();

  if (!ticket) {
    return NextResponse.json({ status: "invalid", name: "כרטיס לא קיים" });
  }
  if (ticket.status === "scanned") {
    return NextResponse.json({
      status: "duplicate",
      name: "כניסה כפולה",
      scannedAt: ticket.scanned_at,
    });
  }
  if (ticket.status === "void") {
    return NextResponse.json({ status: "invalid", name: "כרטיס מבוטל" });
  }

  await sb
    .from("tickets")
    .update({ status: "scanned", scanned_at: new Date().toISOString() })
    .eq("id", ticket.id);

  return NextResponse.json({ status: "valid", name: "כניסה אושרה", tier: ticket.tier_id });
}

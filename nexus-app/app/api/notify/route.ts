export const runtime = "edge";

/**
 * Transactional email via Resend. No-ops gracefully when RESEND_API_KEY is
 * absent, so the app runs without an email provider. Set in Vercel:
 *   RESEND_API_KEY  — your Resend key
 *   NOTIFY_FROM     — e.g. "NEXUS <noreply@yourdomain.com>" (defaults to Resend sandbox)
 *   ADMIN_EMAIL     — platform-owner inbox (used when { toAdmin: true })
 */
export async function POST(req: Request) {
  let body: { to?: string; toAdmin?: boolean; subject?: string; html?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ sent: false, reason: "bad request" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const recipient = body.toAdmin ? process.env.ADMIN_EMAIL : body.to;
  if (!key || !recipient) {
    return Response.json({ sent: false, reason: key ? "no recipient" : "no provider configured" });
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || "NEXUS <onboarding@resend.dev>",
        to: recipient,
        subject: body.subject || "עדכון מ-NEXUS",
        html: body.html || "",
      }),
    });
    return Response.json({ sent: r.ok });
  } catch {
    return Response.json({ sent: false, reason: "send failed" }, { status: 502 });
  }
}

"use client";

/**
 * Fire-and-forget transactional email through /api/notify. Silently no-ops if
 * the provider isn't configured, so callers never need to handle email errors.
 */
export async function notify(opts: { to?: string; toAdmin?: boolean; subject: string; html: string }): Promise<void> {
  try {
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(opts),
      keepalive: true,
    });
  } catch {
    /* ignore — email is best-effort */
  }
}

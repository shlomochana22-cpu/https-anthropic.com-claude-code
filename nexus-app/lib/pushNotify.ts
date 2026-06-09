"use client";

/** Browser-notification helpers (foreground). Background push needs a service
 *  worker + PWA install — a later step for the native mobile app. */

export function notifSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notifPermission(): NotificationPermission | "unsupported" {
  return notifSupported() ? Notification.permission : "unsupported";
}

/** Must be called from a user gesture (browser policy). */
export async function requestNotifPermission(): Promise<NotificationPermission> {
  if (!notifSupported()) return "denied";
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

/** Fires a native system notification when permission was granted. */
export function nativeNotify(title: string, body: string): void {
  try {
    if (notifSupported() && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico", lang: "he", dir: "rtl" });
    }
  } catch {
    /* ignore */
  }
}

/** Short two-tone alert chime (best-effort; ignored if audio is blocked). */
export function chime(): void {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [880, 1320].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = f;
      o.connect(g); g.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.start(t); o.stop(t + 0.18);
    });
  } catch {
    /* audio blocked */
  }
}

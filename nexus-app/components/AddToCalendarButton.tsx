"use client";

import { Icon } from "./Icon";

/** Downloads an .ics calendar file for the event — a real, working "add to wallet/calendar". */
export function AddToCalendarButton({ title, dateStr, time, venue }: { title: string; dateStr?: string; time?: string; venue?: string }) {
  const download = () => {
    // Best-effort parse of a "DD.MM" / "DD.MM.YY" display date → an ICS date.
    const now = new Date();
    let y = now.getFullYear(), mo = now.getMonth() + 1, d = now.getDate();
    const m = (dateStr || "").match(/(\d{1,2})\.(\d{1,2})(?:\.(\d{2,4}))?/);
    if (m) {
      d = Number(m[1]); mo = Number(m[2]);
      if (m[3]) y = Number(m[3].length === 2 ? "20" + m[3] : m[3]);
      if (mo < now.getMonth() + 1 || (mo === now.getMonth() + 1 && d < now.getDate())) y += 1; // next occurrence
    }
    const [hh, mm] = (time || "23:00").split(":").map((n) => Number(n) || 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    const start = `${y}${pad(mo)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
    const endH = (hh + 4) % 24;
    const end = `${y}${pad(mo)}${pad(d)}T${pad(endH)}${pad(mm)}00`;

    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//NEXUS//Events//HE", "BEGIN:VEVENT",
      `UID:${Date.now()}@nexusevents.co.il`,
      `DTSTART:${start}`, `DTEND:${end}`,
      `SUMMARY:${title}`,
      venue ? `LOCATION:${venue}` : "",
      "END:VEVENT", "END:VCALENDAR",
    ].filter(Boolean).join("\r\n");

    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = `${title.replace(/\s+/g, "-")}.ics`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={download} className="w-full py-4 glass-card text-white text-headline-md rounded-xl border border-white/20 active:scale-95 transition-all flex items-center justify-center gap-3">
      <Icon name="event" /> הוסף ליומן / Wallet
    </button>
  );
}

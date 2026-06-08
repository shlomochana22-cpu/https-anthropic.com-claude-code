"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Icon } from "@/components/Icon";
import { getMyTickets, type MyTicket } from "@/lib/orders";

function qrUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=${encodeURIComponent(data)}`;
}

const history = [
  { name: "Summer Closing Party", date: "28 באוגוסט, 2024" },
  { name: "Underground Session #4", date: "12 ביולי, 2024" },
];

type StoredTicket = { id: string; eventTitle: string; date: string; time: string; tier: string; qty: number; code: string };

export default function TicketsPage() {
  const [tickets, setTickets] = useState<MyTicket[] | null>(null);
  const [local, setLocal] = useState<StoredTicket[]>([]);
  const [tab, setTab] = useState<"active" | "history">("active");

  useEffect(() => {
    getMyTickets().then(setTickets);
    try {
      const raw = localStorage.getItem("nexus_tickets");
      if (raw) setLocal(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const shareTicket = async (title: string) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/tickets` : "https://nexusevents.co.il/tickets";
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: "הכרטיס שלי ב-NEXUS", text: title, url }); } catch { /* cancelled */ }
    } else {
      navigator.clipboard?.writeText(url);
    }
  };

  const real = tickets && tickets.length > 0;

  return (
    <>
      <Header />
      <main className="pt-20 pb-32 px-margin-mobile max-w-2xl mx-auto">
        <h2 className="text-headline-lg text-primary-fixed mb-md">הכרטיסים שלי</h2>

        {/* Tabs */}
        <div className="relative flex border-b border-white/10 mb-lg">
          {(["active", "history"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-sm text-sm font-semibold transition-colors ${tab === t ? "text-primary-fixed" : "text-on-surface-variant/60"}`}
            >
              {t === "active" ? "פעילים" : "היסטוריה"}
            </button>
          ))}
          <div
            className="absolute bottom-[-1px] h-0.5 bg-primary-fixed transition-all"
            style={{ width: "50%", right: tab === "active" ? "0%" : "50%" }}
          />
        </div>

        {tab === "active" ? (
          <>
            {real ? (
              <div className="space-y-md">
                {tickets!.map((t) => (
                  <div key={t.id} className="glass-card rounded-xl overflow-hidden p-6">
                    <div className="flex justify-between items-start mb-md">
                      <div>
                        <span className="text-xs text-primary-fixed/60 uppercase tracking-widest block mb-1">LIVE TICKET</span>
                        <h3 className="text-2xl text-primary">{t.eventTitle}</h3>
                        <p className="text-on-surface-variant">{t.date} | {t.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full border text-xs ${t.status === "scanned" ? "bg-error-container/20 text-error border-error/30" : "bg-primary-container/10 text-primary-fixed border-primary-container/20"}`}>
                        {t.status === "scanned" ? "נסרק" : "תקף"}
                      </span>
                    </div>
                    <div className="bg-white p-4 rounded-lg flex items-center justify-center mb-md mx-auto w-fit">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="QR" className="w-48 h-48" src={qrUrl(t.qrCode)} />
                    </div>
                    <p className="text-center text-xs text-on-surface-variant font-mono">קוד: {t.qrCode}</p>
                  </div>
                ))}
              </div>
            ) : local.length > 0 ? (
              <div className="space-y-md">
                {local.map((t) => (
                  <div key={t.id} className="glass-card rounded-xl overflow-hidden p-6">
                    <div className="flex justify-between items-start mb-md gap-3">
                      <div>
                        <span className="text-xs text-primary-fixed/60 uppercase tracking-widest block mb-1">LIVE TICKET</span>
                        <h3 className="text-2xl text-primary">{t.eventTitle}</h3>
                        <p className="text-on-surface-variant">{t.date}{t.time ? ` | ${t.time}` : ""}</p>
                      </div>
                      {t.tier && <div className="bg-primary-container/10 px-3 py-1 rounded-full border border-primary-container/20 shrink-0"><span className="text-xs text-primary-fixed">{t.tier}</span></div>}
                    </div>
                    <div className="bg-white p-4 rounded-lg flex items-center justify-center mb-md mx-auto w-fit">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="QR" className="w-48 h-48" src={qrUrl(t.code)} />
                    </div>
                    <p className="text-center text-xs text-on-surface-variant font-mono mb-lg">קוד: {t.code}</p>
                    <div className="grid grid-cols-2 gap-sm">
                      <button onClick={() => shareTicket(t.eventTitle)} className="bg-primary-container text-on-primary-container py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-1 active:scale-95 transition-transform">
                        <Icon name="share" className="text-[18px]" /> שיתוף
                      </button>
                      <a href="/resale" className="border-2 border-primary-container text-primary-container py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-1">
                        <Icon name="sell" className="text-[18px]" /> מכירה חוזרת
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-8 text-center">
                <Icon name="confirmation_number" className="text-on-surface-variant/40 text-5xl mb-3" />
                <p className="text-on-surface mb-1">{tickets === null ? "טוען כרטיסים..." : "אין כרטיסים פעילים"}</p>
                <p className="text-label-sm text-on-surface-variant mb-4">כרטיסים שתרכוש יופיעו כאן.</p>
                <a href="/" className="inline-block bg-primary-fixed text-on-primary-fixed font-bold px-6 py-2.5 rounded-full">גלה אירועים</a>
              </div>
            )}

            {/* Additional tickets */}
            <h4 className="text-sm font-semibold text-on-surface-variant/80 mt-lg mb-sm">כרטיסים נוספים</h4>
            <a href="/events/neon-rooftop" className="glass-card p-4 rounded-xl flex items-center gap-md hover:bg-white/5 transition-colors">
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdIJ9VJe06FpklCJ3G_pCoE0HV_9Q0BNKLYgoHpG6xjeFeenQ1Cg9mMuLd11bYxOuXUUrn1F5jrigdQOrAIbCVBSsd-iux2MOgQ_TThXcp1Wt74eE8sNxlDJsE8JckLfxYet5cvtcyrD9xPc2Pul8LizyQXTgZWlK2iXCcX6nwwzjlTjoOwJv26GTzVo37AG1WLOdHRKjX3ZYUw5MoyQLfboCebxH3vhxkMVHJIJE1oudrS2YfOyD7oCanJj4qSxwazQm3LLsqsg" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-semibold text-primary">Desert Ray: Open Air</h5>
                <p className="text-xs font-medium text-on-surface-variant">02 בנובמבר, 2024</p>
              </div>
              <Icon name="chevron_left" className="text-on-surface-variant" />
            </a>
          </>
        ) : (
          /* History */
          <div className="space-y-sm">
            {history.map((h) => (
              <a key={h.name} href="/rating" className="glass-card p-4 rounded-xl flex items-center gap-md opacity-70 hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0 grayscale">
                  <Icon name="celebration" className="text-on-surface-variant" />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-semibold text-primary">{h.name}</h5>
                  <p className="text-xs font-medium text-on-surface-variant">{h.date} · דרגו אותנו ★</p>
                </div>
                <span className="text-xs font-medium text-primary-fixed/40">הסתיים</span>
              </a>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
}

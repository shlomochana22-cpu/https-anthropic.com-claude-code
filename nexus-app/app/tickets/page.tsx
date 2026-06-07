"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Icon } from "@/components/Icon";
import { getMyTickets, type MyTicket } from "@/lib/orders";

const DEMO_QR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAuooIxIo-zY2BwPOKjgVoJ_o0CWyab3PK9UtZNdAtOzT2_zv3BoYDtU7PyUzGroVFNV5DKspTT-CAIMxV9iuIhWlEhW2yM1vkl1ytvgdUu4Gcn0CDptNGMHwjMwRgdBymhekwDHtzI6Qiugi3A8yxBuwbMODvrHT10eis5kGVl-gWcu804wYJC9mVraZQF-YE_LfRb2Kh-xgJpnIevGW1uj-MCff9z3lvBfTqUE3CVF_cJgrqp0F7PpiqG3qctWLVD7ITqlE9DFg";

function qrUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=${encodeURIComponent(data)}`;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<MyTicket[] | null>(null);

  useEffect(() => {
    getMyTickets().then(setTickets);
  }, []);

  const real = tickets && tickets.length > 0;

  return (
    <>
      <Header />
      <main className="pt-20 pb-32 px-margin-mobile max-w-2xl mx-auto">
        <h2 className="text-headline-lg text-primary-fixed mb-md">הכרטיסים שלי</h2>

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
                  <span className={`px-3 py-1 rounded-full border text-xs ${
                    t.status === "scanned"
                      ? "bg-error-container/20 text-error border-error/30"
                      : "bg-primary-container/10 text-primary-fixed border-primary-container/20"
                  }`}>
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
        ) : (
          /* Demo pass (not signed in / no Supabase) */
          <div className="glass-card rounded-xl overflow-hidden p-6">
            <div className="flex justify-between items-start mb-md">
              <div>
                <span className="text-xs text-primary-fixed/60 uppercase tracking-widest block mb-1">LIVE TICKET</span>
                <h3 className="text-2xl text-primary">Cyber City: The Warehouse</h3>
                <p className="text-on-surface-variant">חמישי, 24 באוקטובר | 23:00</p>
              </div>
              <div className="bg-primary-container/10 px-3 py-1 rounded-full border border-primary-container/20">
                <span className="text-xs text-primary-fixed">VIP</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg flex items-center justify-center mb-md mx-auto w-fit">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="QR" className="w-48 h-48" src={DEMO_QR} />
            </div>
            <p className="text-center text-sm text-on-surface-variant">
              {tickets === null ? "טוען כרטיסים..." : "התחבר כדי לראות את הכרטיסים האמיתיים שלך"}
            </p>
            <div className="mt-md grid grid-cols-2 gap-sm">
              <button className="bg-primary-container text-on-primary-container py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-1">
                <Icon name="share" className="text-[18px]" /> שיתוף
              </button>
              <button className="border-2 border-primary-container text-primary-container py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-1">
                <Icon name="sell" className="text-[18px]" /> מכירה חוזרת
              </button>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { browserSupabase } from "@/lib/supabaseBrowser";
import { chime, nativeNotify } from "@/lib/pushNotify";

const shekel = (n: number) => `₪${n.toLocaleString("he-IL")}`;
type Alert = { buyer: string; amount: number; event: string; qty: number };

/** Pops an alert (+ chime + system notification) the moment a ticket is bought
 *  on one of the signed-in producer's events. Realtime RLS scopes it to them. */
export function ProducerPurchaseAlerts() {
  const [alert, setAlert] = useState<Alert | null>(null);

  useEffect(() => {
    const sb = browserSupabase();
    if (!sb) return;
    const ch = sb
      .channel("producer-purchase-alerts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, async (payload) => {
        const row = payload.new as { buyer_name?: string; subtotal?: number; event_id?: string; participants?: unknown[] };
        let event = "האירוע שלך";
        if (row.event_id) {
          const { data } = await sb.from("events").select("title").eq("id", row.event_id).maybeSingle();
          if (data?.title) event = data.title as string;
        }
        const qty = Array.isArray(row.participants) && row.participants.length ? row.participants.length : 1;
        const a: Alert = { buyer: row.buyer_name || "רוכש", amount: row.subtotal || 0, event, qty };
        setAlert(a);
        chime();
        nativeNotify("כרטיס נמכר! 🎫", `${a.buyer} רכש ${a.qty} כרטיס ל${event} · ${shekel(a.amount)}`);
      })
      .subscribe();
    return () => { sb.removeChannel(ch); };
  }, []);

  if (!alert) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setAlert(null)} />
      <div className="relative glass-card w-full max-w-sm rounded-2xl p-6 border-2 border-primary-fixed shadow-neon-primary text-center">
        <div className="w-16 h-16 rounded-full bg-primary-fixed/15 flex items-center justify-center mx-auto mb-4">
          <Icon name="confirmation_number" className="text-primary-fixed text-4xl" fill />
        </div>
        <p className="text-[11px] text-primary-fixed-dim uppercase tracking-widest mb-1">כרטיס נמכר עכשיו</p>
        <h3 className="text-headline-md text-primary mb-1">{alert.event}</h3>
        <p className="text-3xl font-extrabold text-primary-fixed neon-text mb-1">{shekel(alert.amount)}</p>
        <p className="text-label-md text-on-surface-variant mb-4">{alert.buyer} · {alert.qty} כרטיס</p>
        <button onClick={() => setAlert(null)} className="w-full bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg active:scale-95 shadow-neon-primary">מעולה!</button>
      </div>
    </div>
  );
}

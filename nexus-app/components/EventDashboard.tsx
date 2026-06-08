import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SafeImage } from "@/components/SafeImage";
import type { NexusEvent } from "@/lib/events";

function hash(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
const shekel = (n: number) => `₪${n.toLocaleString("he-IL")}`;

export function EventDashboard({ event: e }: { event: NexusEvent }) {
  const seed = hash(e.id);
  const capacity = 600 + (seed % 1400);
  const sold = Math.round((capacity * e.occupancy) / 100);
  const prices = e.tiers.map((t) => t.price).filter((p) => p > 0);
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : e.fromPrice;
  const revenue = sold * avgPrice;
  const orders = Math.max(1, Math.round(sold / 2.2));
  const fees = Math.round(revenue * 0.08);
  const net = revenue - fees;
  const womenPct = 38 + (seed % 25);
  const menPct = 100 - womenPct;

  // Ticket-tier breakdown
  const n = e.tiers.length || 1;
  const sorted = [...e.tiers].sort((a, b) => a.price - b.price);
  const weights = e.tiers.map((t) => n - sorted.findIndex((x) => x === t));
  const wsum = weights.reduce((a, b) => a + b, 0) || 1;
  const tiers = e.tiers.map((t, i) => {
    const share = weights[i] / wsum;
    const total = Math.max(1, Math.round(capacity * share));
    const tSold = Math.min(total, Math.round(sold * share));
    return { name: t.name, price: t.price, sold: tSold, total, revenue: tSold * t.price, exclusive: t.exclusive };
  });

  const kpis = [
    { label: "הכנסות", value: shekel(revenue), icon: "payments", tone: "text-primary-fixed" },
    { label: "כרטיסים שנמכרו", value: sold.toLocaleString(), icon: "confirmation_number", tone: "text-secondary-fixed" },
    { label: "הזמנות", value: orders.toLocaleString(), icon: "receipt_long", tone: "text-tertiary-fixed-dim" },
    { label: "תפוסה", value: `${e.occupancy}%`, icon: "event_seat", tone: "text-primary-fixed" },
  ];
  const actions = [
    { href: "/producer/guests", icon: "group", label: "מוזמנים" },
    { href: "/producer/scanner", icon: "qr_code_scanner", label: "סריקה" },
    { href: `/events/${e.id}`, icon: "visibility", label: "תצוגת לקוח" },
    { href: "/producer/stats", icon: "analytics", label: "סטטיסטיקות מלאות" },
  ];

  const C = 2 * Math.PI * 40;

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop space-y-md">
      <Link href="/producer/events" className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary text-label-md"><Icon name="arrow_forward" className="text-[18px]" /> חזרה לאירועים</Link>

      {/* Hero */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="relative h-40">
          <SafeImage className="w-full h-full object-cover" src={e.image} alt={e.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent" />
          <span className="absolute top-3 right-3 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-2 py-0.5 rounded uppercase">{e.badge ?? "פעיל"}</span>
          <div className="absolute bottom-3 right-4 left-4">
            <h1 className="text-headline-lg-mobile text-primary drop-shadow">{e.title}</h1>
            <p className="text-label-sm text-on-surface-variant flex items-center gap-1"><Icon name="location_on" className="text-sm" /> {e.venue}, {e.city} • {e.date} {e.time}</p>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        {kpis.map((k) => (
          <div key={k.label} className="glass-card rounded-xl p-md">
            <Icon name={k.icon} className={`${k.tone} mb-2`} />
            <p className={`text-2xl font-extrabold ${k.tone}`}>{k.value}</p>
            <p className="text-label-sm text-on-surface-variant mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Payment / revenue */}
        <div className="glass-card rounded-2xl p-md">
          <h3 className="text-xl font-bold text-white mb-md flex items-center gap-2"><Icon name="account_balance_wallet" className="text-primary-fixed" /> תשלום והכנסות</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><span className="text-on-surface-variant">סך מכירות (ברוטו)</span><span className="text-white font-bold">{shekel(revenue)}</span></div>
            <div className="flex justify-between items-center"><span className="text-on-surface-variant">עמלת פלטפורמה (8%)</span><span className="text-error">- {shekel(fees)}</span></div>
            <div className="flex justify-between items-center pt-3 border-t border-white/5"><span className="text-primary-fixed font-bold">לתשלום למפיק (נטו)</span><span className="text-primary-fixed text-headline-md font-extrabold">{shekel(net)}</span></div>
            <div className="flex justify-between items-center text-label-sm pt-1"><span className="text-on-surface-variant">מחיר ממוצע לכרטיס</span><span className="text-on-surface">{shekel(avgPrice)} · {orders} הזמנות</span></div>
          </div>
          <div className="mt-md grid grid-cols-2 gap-2">
            <Link href="/producer/wallet" className="bg-primary-fixed text-on-primary-fixed font-bold py-2.5 rounded-lg text-center text-label-md active:scale-95 transition-transform">לארנק</Link>
            <Link href="/producer/coupons" className="bg-surface-container-high border border-white/10 text-primary py-2.5 rounded-lg text-center text-label-md hover:border-primary-fixed/40 transition-colors">קופונים</Link>
          </div>
        </div>

        {/* Demographics: gender donut */}
        <div className="glass-card rounded-2xl p-md flex flex-col">
          <h3 className="text-xl font-bold text-white mb-md">מגדר הקהל</h3>
          <div className="flex items-center justify-center flex-1">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle className="text-secondary-fixed" cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="16" strokeDasharray={`${(womenPct / 100) * C} ${C}`} />
                <circle className="text-primary-fixed" cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="16" strokeDasharray={`${(menPct / 100) * C} ${C}`} strokeDashoffset={-(womenPct / 100) * C} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center"><Icon name="wc" className="text-on-surface-variant text-2xl" /></div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-md text-label-sm mt-2">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-secondary-fixed" /> נשים {womenPct}%</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary-fixed" /> גברים {menPct}%</span>
          </div>
        </div>
      </div>

      {/* Ticket breakdown */}
      <div className="glass-card rounded-2xl p-md">
        <h3 className="text-xl font-bold text-white mb-md flex items-center gap-2"><Icon name="confirmation_number" className="text-primary-fixed" /> פילוח מכירות כרטיסים</h3>
        <div className="space-y-5">
          {tiers.map((t) => (
            <div key={t.name} className="space-y-2">
              <div className="flex justify-between text-label-md">
                <span className="text-white flex items-center gap-1.5">{t.exclusive && <Icon name="stars" className="text-primary-fixed text-[16px]" fill />}{t.name}</span>
                <span className="text-primary-fixed">{t.sold}/{t.total}</span>
              </div>
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden"><div className="h-full bg-primary-fixed" style={{ width: `${(t.sold / t.total) * 100}%` }} /></div>
              <div className="flex justify-between text-[10px] text-on-surface-variant uppercase"><span>₪{t.price} לכרטיס</span><span>{shekel(t.revenue)}</span></div>
            </div>
          ))}
          {tiers.length === 0 && <p className="text-on-surface-variant/60 text-center py-4">אין סוגי כרטיסים</p>}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        {actions.map((a) => (
          <Link key={a.href} href={a.href} className="glass-card rounded-xl p-md flex flex-col items-center justify-center gap-2 hover:border-primary-fixed/30 hover:bg-white/5 transition-all text-center">
            <Icon name={a.icon} className="text-primary-fixed text-2xl" />
            <span className="text-label-sm text-on-surface">{a.label}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SafeImage } from "@/components/SafeImage";
import { getEvents } from "@/lib/queries";

export default async function EventManagerPage() {
  const events = await getEvents();

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop">
      <div className="flex items-center justify-between mb-lg flex-wrap gap-4">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary-fixed">ניהול אירועים</h1>
          <p className="text-on-surface-variant">כל ההפקות שלך במקום אחד · {events.length} אירועים</p>
        </div>
        <Link href="/producer/create" className="flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-3 rounded-xl font-bold shadow-neon-primary active:scale-95 transition-all">
          <Icon name="add_circle" /> אירוע חדש
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-lg">
        {[
          { label: "אירועים פעילים", value: String(events.length), tone: "text-primary-fixed" },
          { label: "כרטיסים שנמכרו", value: "1,240", tone: "text-secondary-fixed" },
          { label: "הכנסה כוללת", value: "₪84,300", tone: "text-primary-fixed" },
          { label: "תפוסה ממוצעת", value: `${Math.round(events.reduce((s, e) => s + e.occupancy, 0) / (events.length || 1))}%`, tone: "text-tertiary-fixed-dim" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-md rounded-xl flex flex-col justify-between">
            <span className="text-label-sm text-on-surface-variant">{s.label}</span>
            <span className={`text-headline-md mt-1 ${s.tone}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Event cards */}
      <div className="space-y-md">
        {events.map((e) => {
          const revenue = Math.round((e.fromPrice * e.occupancy * 12) / 10) * 10;
          return (
            <div key={e.id} className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary-fixed/30 transition-colors">
              <div className="flex flex-col md:flex-row">
                <Link href={`/producer/events/${e.id}`} className="md:w-48 h-40 md:h-auto shrink-0 relative block group">
                  <SafeImage className="w-full h-full object-cover" src={e.image} alt={e.title} />
                  <span className="absolute top-3 right-3 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-2 py-0.5 rounded uppercase">{e.badge ?? "פעיל"}</span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><Icon name="dashboard" className="text-[14px]" /> דאשבורד</span>
                  </div>
                </Link>
                <div className="flex-1 p-md">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Link href={`/producer/events/${e.id}`} className="text-headline-md text-primary hover:text-primary-fixed transition-colors">{e.title}</Link>
                      <p className="text-label-sm text-on-surface-variant mt-1 flex items-center gap-1">
                        <Icon name="location_on" className="text-sm" /> {e.venue}, {e.city} • {e.date} {e.time}
                      </p>
                      <span className="inline-block mt-2 text-[10px] bg-secondary-fixed/10 text-secondary-fixed px-2 py-0.5 rounded border border-secondary-fixed/20">{e.genre}</span>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="text-headline-md text-primary-fixed">₪{revenue.toLocaleString()}</p>
                      <p className="text-[10px] text-on-surface-variant">סך הכנסה</p>
                    </div>
                  </div>

                  {/* Occupancy */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-on-surface-variant">תפוסה</span>
                      <span className="text-primary-fixed font-bold">{e.occupancy}% נמכר</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary-fixed" style={{ width: `${e.occupancy}%` }} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/producer/events/${e.id}`} className="flex items-center gap-1 bg-primary-container text-on-primary-container px-3 py-2 rounded-lg text-label-sm font-bold active:scale-95 transition-transform">
                      <Icon name="dashboard" className="text-[18px]" /> דאשבורד אירוע
                    </Link>
                    <Link href="/producer/guests" className="flex items-center gap-1 bg-surface-container-high border border-white/10 text-primary px-3 py-2 rounded-lg text-label-sm hover:border-primary-fixed/40 transition-colors">
                      <Icon name="group" className="text-[18px]" /> מוזמנים
                    </Link>
                    <Link href="/producer/scanner" className="flex items-center gap-1 bg-surface-container-high border border-white/10 text-primary px-3 py-2 rounded-lg text-label-sm hover:border-primary-fixed/40 transition-colors">
                      <Icon name="qr_code_scanner" className="text-[18px]" /> סריקה
                    </Link>
                    <Link href={`/events/${e.id}`} className="flex items-center gap-1 text-primary-fixed px-3 py-2 rounded-lg text-label-sm hover:underline">
                      <Icon name="visibility" className="text-[18px]" /> תצוגת לקוח
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

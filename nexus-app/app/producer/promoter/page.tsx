import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getEvents } from "@/lib/queries";

export default async function PromoterPage() {
  const events = await getEvents();
  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop max-w-2xl">
      <section className="mb-lg">
        <h1 className="text-headline-lg-mobile mb-1 text-primary">דשבורד יחצן · המשך ככה!</h1>
        <p className="text-on-surface-variant text-label-md">סיכום ביצועים להיום</p>
        <div className="grid grid-cols-2 gap-gutter mt-md">
          <div className="glass-card p-md rounded-xl">
            <span className="text-on-surface-variant text-label-sm block mb-1">רווחים היום</span>
            <div className="text-headline-md text-primary-fixed-dim">₪1,420</div>
          </div>
          <div className="glass-card p-md rounded-xl">
            <span className="text-on-surface-variant text-label-sm block mb-1">כרטיסים שנמכרו</span>
            <div className="text-headline-md text-primary-fixed-dim">42</div>
          </div>
        </div>
      </section>

      <section className="mb-lg grid grid-cols-3 gap-gutter">
        {[
          { icon: "ads_click", value: "1,204", label: "קליקים", tone: "text-secondary-fixed-dim" },
          { icon: "leaderboard", value: "8.4%", label: "יחס המרה", tone: "text-primary-fixed-dim" },
          { icon: "link", value: "6", label: "לינקים פעילים", tone: "text-tertiary-fixed-dim" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-sm rounded-xl flex flex-col items-center text-center">
            <Icon name={s.icon} className={`${s.tone} mb-1`} />
            <span className="text-headline-md">{s.value}</span>
            <span className="text-on-surface-variant text-label-sm">{s.label}</span>
          </div>
        ))}
      </section>

      <section className="mb-lg">
        <div className="glass-card p-md rounded-xl border-primary-fixed-dim/20">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-label-md text-on-surface-variant uppercase tracking-wider mb-1">יתרה לתשלום</h2>
              <div className="text-headline-xl text-primary neon-glow">₪12,850</div>
            </div>
            <Link href="/producer/wallet" className="bg-primary-fixed-dim text-on-primary-fixed px-md py-sm rounded-full text-label-md active:scale-95 transition-transform shadow-neon-primary">
              משיכה
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-md">
          <h3 className="text-headline-md text-primary">לינקים אישיים</h3>
          <Link href="/producer/leaderboard" className="text-primary-fixed-dim text-label-md flex items-center gap-1">
            דירוג <Icon name="chevron_left" />
          </Link>
        </div>
        <div className="space-y-gutter">
          {events.slice(0, 2).map((e) => (
            <div key={e.id} className="glass-card rounded-xl overflow-hidden">
              <div className="h-32 w-full relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover opacity-60" src={e.image} alt={e.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent" />
              </div>
              <div className="p-md">
                <div className="flex justify-between items-start mb-sm">
                  <div>
                    <h4 className="text-[18px] text-primary">{e.title}</h4>
                    <p className="text-on-surface-variant text-label-sm">{e.venue}, {e.city}</p>
                  </div>
                  <div className="text-left">
                    <div className="text-label-md text-primary-fixed-dim">₪2,400</div>
                    <div className="text-[10px] text-on-surface-variant">עמלה שנצברה</div>
                  </div>
                </div>
                <button className="w-full bg-surface-container-high border border-white/10 text-primary py-sm rounded-lg text-label-md flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  <Icon name="content_copy" className="text-[18px]" /> העתק לינק
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

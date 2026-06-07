import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { getEventById } from "@/lib/queries";

const markers = [
  { top: "20%", right: "25%", icon: "album", label: "סוניק דום", tone: "text-primary-fixed border-primary-fixed/40" },
  { top: "62%", right: "70%", icon: "graphic_eq", label: "באס באנקר", tone: "text-primary-fixed border-primary-fixed/40" },
  { top: "40%", right: "15%", icon: "local_bar", label: "בר ראשי", tone: "text-secondary-fixed-dim border-secondary-fixed-dim/40" },
  { top: "78%", right: "42%", icon: "medical_services", label: "עזרה ראשונה", tone: "text-error border-error/40" },
  { top: "16%", right: "58%", icon: "wc", label: "שירותים", tone: "text-on-surface-variant border-white/20" },
];

export default async function EventMapPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);
  if (!event) notFound();
  return (
    <>
      <Header back={`/events/${event.id}`} />
      <main className="pt-16 min-h-screen">
        <div className="px-margin-mobile pt-4 pb-2">
          <h1 className="text-headline-md text-primary-fixed">מפת המתחם · {event.title}</h1>
          <p className="text-label-sm text-on-surface-variant">{event.venue}, {event.city}</p>
        </div>

        <div className="relative mx-margin-mobile rounded-2xl overflow-hidden border border-white/10 h-[70vh] bg-[#050505]">
          {/* base map */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 grayscale"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC56FS7bP2zVrNN-L6YhTffLr-GESF_XDtODyQzpz_KMYUaazxNpndHNmRHB1ldFhv6ZqTwmZWe6b-bz6cpo3gsHaP25-kPLNpzWFHIgeE60WPhEcCdvpmtS9ExCmhjghQwFYXplyWr-S54smy9u7AIqEsgZ7q8WdQHBoRqPoPMSg7-Xtn5hB_xtZplBFP1j0cMERIIr7AmmHQes4ZHZsD5icIaNwIiyRtFhZK8ZIzv1HMW5VdlBVODlMawVtbZB5xzu_B5yPCgwQ')",
            }}
          />
          {/* heat blobs */}
          <div className="absolute top-[20%] right-[30%] w-64 h-64 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(191,245,32,0.3), transparent 70%)" }} />
          <div className="absolute top-[60%] right-[70%] w-72 h-72 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(191,245,32,0.25), transparent 70%)" }} />

          {/* you are here */}
          <div className="absolute top-[45%] right-[48%] z-20">
            <div className="relative">
              <div className="w-6 h-6 bg-primary-fixed rounded-full shadow-[0_0_20px_rgba(191,245,32,0.8)] border-2 border-white flex items-center justify-center animate-pulse">
                <Icon name="person" className="text-black text-xs" fill />
              </div>
              <div className="absolute -top-8 right-1/2 translate-x-1/2 bg-surface-container-high px-2 py-1 rounded text-[10px] font-bold text-primary-fixed border border-primary-fixed/30 whitespace-nowrap">
                אתה כאן
              </div>
            </div>
          </div>

          {/* markers */}
          {markers.map((m) => (
            <div key={m.label} className="absolute group" style={{ top: m.top, right: m.right }}>
              <div className={`w-11 h-11 glass rounded-xl flex items-center justify-center border hover:scale-110 transition-all ${m.tone}`}>
                <Icon name={m.icon} className="text-2xl" fill />
              </div>
              <p className="mt-1 text-center text-[10px] font-bold uppercase tracking-tight text-on-surface-variant whitespace-nowrap">{m.label}</p>
            </div>
          ))}
        </div>

        {/* legend */}
        <div className="px-margin-mobile mt-4 grid grid-cols-2 gap-2 pb-10">
          {[
            { icon: "festival", label: "במות" },
            { icon: "local_fire_department", label: "עומס קהל" },
            { icon: "wine_bar", label: "ברים ואוכל" },
            { icon: "medical_services", label: "מוקדי בטיחות" },
          ].map((l) => (
            <div key={l.label} className="glass-card rounded-lg p-3 flex items-center gap-3">
              <Icon name={l.icon} className="text-primary-fixed" />
              <span className="text-label-md text-on-surface">{l.label}</span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

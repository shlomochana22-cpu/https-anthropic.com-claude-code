import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { getEventById } from "@/lib/queries";

const stories = [
  { label: "מפיק", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAf_eieuNljSdZEPg_WM_HfPhMhOyImYD6ehsHeH_TG0KOtrWPNVVyAKeDVyHbNOE5Gr1piS20NrFIBpCfLYSzsduAsz9ViRwLH04yTSJiiqzRVlWujELfp8BEm_w0mIi0_V1eWgF8jRWyafaUAcy-623Y7lSKcvidpoY9prR2J1gHc38uwRwfHQEXovDUq1GtaTFUijqfaOEij7eTWZVNgI7929CAYICrCFLHriZskTisDbVQXIfRlXYjgqOyG_HvzKLxd5HzUsQ", live: true },
  { label: "VIBE_01", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCt-Evp_kXkCWtrpY1HueutHMPHgvJVlFrGxTsMBiUU9YR1CNh-wug9yba7S0cVS2_ToakyoZY3KNWmLMRW2Ov7P-GWtyT85c6x17njY6H2DykC72LEWvS4mdZobHbGA-rlIY_BJhsACnimPIdR9F0XzEa4aSASs0vKAfAWYVAlJo4IQZkH8-bfxZyP4dV9z7tg_6RwcQBA_dVbRmpZr-vAFczo-Q1bGVad1sMQj5Y88EMDIG10703VSkKJknaJ4alwak73B3fHJg" },
  { label: "DJ_SET", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1bOpzvzXrwjy6pdwG4QPzO_0ai32pgkv9nkwL0YC_F4PMMOJ2uioCKknk2IG7fc0_QrGmd-Bq1B-MRBpIvZTySov3hv_j9D7AWpbIIAqvHffuN5Y-WYCDzEA60Ls580-XxIsnPF4mlOth2Flh7hWqXeXQwm-fj_XQMMFaAiBERGjAuNre4agJIzLQidB6a1tHo6kn9H_d2r6ULZdHwRB9CMIOPGLGfcL8ogNULF51Ph-QwEH9vh8a_lblmyfjMikI17uyZe07Tg" },
];
const lineup = [
  { name: "Boris Brejcha", slot: "אמן מרכזי", highlight: true },
  { name: "Ann Clue", slot: "02:00 - 03:30" },
  { name: "Deniz Bul", slot: "00:30 - 02:00" },
];

export default async function EventLivePage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);
  if (!event) notFound();
  return (
    <>
      <Header back={`/events/${event.id}`} />
      <main className="pt-20 pb-32">
        {/* Live stories */}
        <section className="mb-6">
          <div className="px-margin-mobile mb-4 flex justify-between items-end">
            <h2 className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest">עדכונים חיים</h2>
            <span className="flex items-center gap-1.5 bg-error-container/20 text-error px-3 py-1 rounded-full border border-error/30 animate-pulse">
              <span className="w-2 h-2 bg-error rounded-full" />
              <span className="text-xs font-bold uppercase">חי מהעמדה</span>
            </span>
          </div>
          <div className="flex overflow-x-auto gap-4 px-margin-mobile hide-scrollbar">
            {stories.map((s) => (
              <div key={s.label} className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className={`rounded-full p-[3px] w-20 h-20 ${s.live ? "bg-gradient-to-tr from-primary-fixed to-secondary-fixed shadow-[0_0_15px_rgba(191,245,32,0.4)]" : "border-2 border-primary-fixed/30"}`}>
                  <div className="w-full h-full rounded-full border-2 border-background overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className={`w-full h-full object-cover ${s.live ? "" : "grayscale"}`} src={s.img} alt={s.label} />
                  </div>
                </div>
                <span className={`text-xs ${s.live ? "font-bold text-primary-fixed" : "text-on-surface-variant"}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured clip */}
        <section className="px-margin-mobile mb-8">
          <div className="relative w-full aspect-[9/16] max-h-[500px] rounded-3xl overflow-hidden border-2 border-primary-fixed shadow-[0_0_10px_rgba(191,245,32,0.4)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-full h-full object-cover" src={event.image} alt={event.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute bottom-0 right-0 w-full p-6 flex justify-between items-end gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded uppercase">בלעדי</span>
                  <span className="text-white/80 text-xs">לפני 2 דק'</span>
                </div>
                <p className="text-white font-bold text-lg leading-tight">הדרופ מגיע... אתם מוכנים? 🎹🔥</p>
              </div>
              <div className="w-14 h-14 rounded-full glass flex flex-col items-center justify-center">
                <span className="text-2xl">🔥</span>
                <span className="text-[10px] font-bold text-white">4.2k</span>
              </div>
            </div>
            <div className="absolute top-4 left-4 right-4 flex flex-row-reverse gap-1">
              <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"><div className="h-full bg-primary-fixed w-[65%]" /></div>
              <div className="h-1 flex-1 bg-white/20 rounded-full" />
              <div className="h-1 flex-1 bg-white/20 rounded-full" />
            </div>
          </div>
        </section>

        {/* Lineup + actions */}
        <section className="px-margin-mobile space-y-6">
          <div>
            <h1 className="text-headline-lg text-primary-fixed tracking-tight">{event.title}</h1>
            <div className="flex items-center gap-4 text-on-surface-variant text-sm font-medium mt-1">
              <span className="flex items-center gap-1"><Icon name="schedule" className="text-sm" /> {event.time}</span>
              <Link href={`/events/${event.id}/map`} className="flex items-center gap-1 text-primary-fixed">
                <Icon name="location_on" className="text-sm" /> {event.venue}, {event.city}
              </Link>
            </div>
          </div>
          <div className="glass-card p-5 rounded-2xl">
            <h3 className="text-label-md font-bold text-primary-fixed mb-3 uppercase tracking-wider">ליינאפ</h3>
            <div className="space-y-3">
              {lineup.map((a) => (
                <div key={a.name}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{a.name}</span>
                    {a.highlight ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-primary-container/20 text-primary-fixed border border-primary-fixed/30">{a.slot}</span>
                    ) : (
                      <span className="text-xs text-on-surface-variant">{a.slot}</span>
                    )}
                  </div>
                  <div className="h-px bg-white/5 mt-3" />
                </div>
              ))}
            </div>
          </div>
          <Link href={`/events/${event.id}`} className="w-full bg-primary-container text-on-primary-container font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 transition-all">
            רכישת כרטיסים <Icon name="arrow_back" />
          </Link>
        </section>
      </main>
    </>
  );
}

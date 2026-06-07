import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Icon } from "@/components/Icon";
import { getEvents } from "@/lib/queries";

export default async function TicketsPage() {
  const events = await getEvents();
  const e = events[0];
  return (
    <>
      <Header />
      <main className="pt-20 pb-32 px-margin-mobile max-w-2xl mx-auto">
        <h2 className="text-headline-lg text-primary-fixed mb-md">הכרטיסים שלי</h2>

        <div className="glass-card rounded-xl overflow-hidden p-6 relative">
          <div className="flex justify-between items-start mb-md">
            <div>
              <span className="text-xs text-primary-fixed/60 uppercase tracking-widest block mb-1">
                LIVE TICKET
              </span>
              <h3 className="text-2xl text-primary">{e.title}</h3>
              <p className="text-on-surface-variant">
                {e.date} | {e.time}
              </p>
            </div>
            <div className="bg-primary-container/10 px-3 py-1 rounded-full border border-primary-container/20">
              <span className="text-xs text-primary-fixed">VIP</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg flex items-center justify-center mb-md mx-auto w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="QR"
              className="w-48 h-48"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuooIxIo-zY2BwPOKjgVoJ_o0CWyab3PK9UtZNdAtOzT2_zv3BoYDtU7PyUzGroVFNV5DKspTT-CAIMxV9iuIhWlEhW2yM1vkl1ytvgdUu4Gcn0CDptNGMHwjMwRgdBymhekwDHtzI6Qiugi3A8yxBuwbMODvrHT10eis5kGVl-gWcu804wYJC9mVraZQF-YE_LfRb2Kh-xgJpnIevGW1uj-MCff9z3lvBfTqUE3CVF_cJgrqp0F7PpiqG3qctWLVD7ITqlE9DFg"
            />
          </div>
          <p className="text-center text-sm text-on-surface-variant">נא לסרוק את הקוד בכניסה לאירוע</p>
        </div>

        <div className="mt-md grid grid-cols-2 gap-sm">
          <button className="bg-primary-container text-on-primary-container py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-1">
            <Icon name="share" className="text-[18px]" /> שיתוף
          </button>
          <button className="border-2 border-primary-container text-primary-container py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-1">
            <Icon name="sell" className="text-[18px]" /> מכירה חוזרת
          </button>
        </div>
      </main>
      <BottomNav />
    </>
  );
}

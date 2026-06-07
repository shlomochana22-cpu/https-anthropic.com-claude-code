import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Icon } from "@/components/Icon";

const genres = [
  { label: "טכנו", on: true },
  { label: "טראנס", on: false },
  { label: "היפ הופ", on: false },
  { label: "האוס", on: true },
  { label: "מיינסטרים", on: false },
];

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-32 px-margin-mobile max-w-2xl mx-auto">
        <section className="flex flex-col items-center text-center mb-lg">
          <div className="w-28 h-28 rounded-full border-4 border-primary-fixed p-1 shadow-[0_0_20px_rgba(191,245,32,0.3)] mb-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover rounded-full"
              alt="פרופיל"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxZCrrTo9SKjwne2y89SE9CBssiyHrw_vYmr8wnI9aKiVdMCHzPBmgoBU_cXGGd2Flq3R6LS_jGivUNRnmztMms9H0-0v1yae_kyP7Rkt47Hp9nUtjP2_mo-HjLXMOQcAeiWxQ4AcXCOqPICrfbw057_H0gmme6yo-ZYqHuFrsDrEWZe4pLGaIqg29E5Xhm8rEnBNmoTyx5DB-vJjoQlCI-WYyczTfecNsqAWVslWQkrkdBDVinM2WqIM0dpV8V9OPFwb1ZM1MBw"
            />
          </div>
          <h2 className="text-headline-md font-bold text-primary-fixed mb-1">עידו לוי</h2>
          <p className="text-on-surface-variant">ido.levi@nexus.com</p>
          <button className="mt-md px-8 py-2 bg-primary-fixed text-on-primary-fixed font-bold rounded-full shadow-neon-primary hover:scale-105 active:scale-95 transition-all">
            עריכת פרופיל
          </button>
        </section>

        <section className="mb-lg">
          <h3 className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest mb-md border-r-4 border-primary-fixed pr-3">
            העדפות מוזיקה
          </h3>
          <div className="flex flex-wrap gap-3">
            {genres.map((g) => (
              <button
                key={g.label}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  g.on
                    ? "bg-primary-container text-on-primary-container font-bold border border-primary-fixed/30"
                    : "glass text-on-surface-variant"
                }`}
              >
                <span>{g.label}</span>
                {g.on && <Icon name="check_circle" className="text-[18px]" />}
              </button>
            ))}
          </div>
        </section>

        <section className="pt-6 border-t border-white/5 space-y-2">
          <Link href="/wallet" className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <Icon name="account_balance_wallet" className="text-on-surface-variant" />
              <span className="font-bold">הארנק שלי</span>
            </div>
            <Icon name="chevron_left" className="text-on-surface-variant" />
          </Link>
          <Link href="/help" className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <Icon name="support_agent" className="text-on-surface-variant" />
              <span className="font-bold">עזרה ותמיכה</span>
            </div>
            <Icon name="chevron_left" className="text-on-surface-variant" />
          </Link>
          <Link href="/login" className="w-full p-4 text-error font-bold flex items-center justify-center gap-2 hover:bg-error/10 rounded-xl transition-colors mt-4">
            <Icon name="logout" />
            התנתקות
          </Link>
        </section>
      </main>
      <BottomNav />
    </>
  );
}

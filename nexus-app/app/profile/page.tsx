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

const customerLinks = [
  { href: "/tickets", icon: "confirmation_number", label: "הכרטיסים שלי" },
  { href: "/favorites", icon: "favorite", label: "מועדפים" },
  { href: "/resale", icon: "sell", label: "מכירה חוזרת" },
  { href: "/help", icon: "support_agent", label: "עזרה ותמיכה" },
];

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-32 px-margin-mobile max-w-2xl mx-auto">
        {/* Identity */}
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

        {/* Quick customer links */}
        <section className="grid grid-cols-2 gap-sm mb-lg">
          {customerLinks.map((l) => (
            <Link key={l.href} href={l.href} className="glass-card rounded-xl p-4 flex items-center gap-3 hover:bg-white/5 transition-colors">
              <Icon name={l.icon} className="text-primary-fixed" />
              <span className="font-bold text-sm">{l.label}</span>
            </Link>
          ))}
        </section>

        {/* Music preferences */}
        <section className="mb-lg">
          <h3 className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest mb-md border-r-4 border-primary-fixed pr-3">
            העדפות מוזיקה
          </h3>
          <div className="flex flex-wrap gap-3">
            {genres.map((g) => (
              <button key={g.label} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${g.on ? "bg-primary-container text-on-primary-container font-bold border border-primary-fixed/30" : "glass text-on-surface-variant"}`}>
                <span>{g.label}</span>
                {g.on && <Icon name="check_circle" className="text-[18px]" />}
              </button>
            ))}
          </div>
        </section>

        {/* Payment methods (customer) */}
        <section className="mb-lg">
          <h3 className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest mb-md border-r-4 border-primary-fixed pr-3">
            אמצעי תשלום
          </h3>
          <div className="space-y-3">
            <div className="glass-card p-4 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-on-surface-variant/20 rounded flex items-center justify-center">
                  <Icon name="credit_card" className="text-on-surface-variant" />
                </div>
                <div>
                  <p className="font-bold text-on-surface">Visa •••• 4242</p>
                  <p className="text-xs text-on-surface-variant">בתוקף עד 12/26</p>
                </div>
              </div>
              <Icon name="verified" className="text-primary-fixed" />
            </div>
            <button className="w-full p-4 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary-fixed hover:border-primary-fixed/50 transition-all">
              <Icon name="add_card" /> <span className="font-bold">הוספת כרטיס חדש</span>
            </button>
          </div>
        </section>

        {/* Purchase history (customer) */}
        <section className="mb-lg">
          <h3 className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest mb-md border-r-4 border-primary-fixed pr-3">
            היסטוריית רכישות
          </h3>
          <Link href="/tickets" className="glass-card p-4 rounded-xl flex gap-4 items-center hover:bg-white/5 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-16 h-16 rounded-lg object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAweRiT64uwBnVi3a8oZEd5opcl_RJ91-_Wl_kktToa_fcCAZzoqw_eG68D75SwOJNIcTJoU7MPIKbAp-q-blg5K-bpA0-8wCPkhetNqWmOKnot_5imQQOfbBSRCKAGBl8-SGS4SCAi_8ONLeyw1way-ceUF-n32TNxQNMENlKQaxf-3F-HTnkIO_IgmgAANt91hFDZnpMXjQIy8rMWTMriQvCaHRK2riaHeVSCXlNLgqKz-kBI8NJB-VHc_-IpllCHpLICPVdbww" />
            <div className="flex-grow">
              <div className="flex justify-between">
                <h4 className="font-bold text-on-surface">Warehouse Rave: Tel Aviv</h4>
                <span className="text-primary-fixed font-bold">₪150</span>
              </div>
              <p className="text-sm text-on-surface-variant">14 במרץ, 2024 • 2 כרטיסים</p>
            </div>
            <Icon name="chevron_left" className="text-on-surface-variant" />
          </Link>
        </section>

        {/* Producer area entry — clear separation between the two faces */}
        <section className="mb-lg">
          <Link href="/producer" className="block glass-card rounded-2xl p-5 border border-primary-fixed/20 hover:bg-white/5 transition-colors relative overflow-hidden">
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-primary-fixed/10 blur-3xl rounded-full" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed/15 flex items-center justify-center">
                  <Icon name="dashboard" className="text-primary-fixed" />
                </div>
                <div>
                  <p className="font-bold text-primary">מפיק אירועים?</p>
                  <p className="text-sm text-on-surface-variant">כניסה לאזור הניהול — הקמת אירועים, מכירות, דאטא</p>
                </div>
              </div>
              <Icon name="arrow_back" className="text-primary-fixed" />
            </div>
          </Link>
        </section>

        {/* Account */}
        <section className="pt-2 border-t border-white/5">
          <Link href="/help" className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <Icon name="security" className="text-on-surface-variant" />
              <span className="font-bold">אבטחה ופרטיות</span>
            </div>
            <Icon name="chevron_left" className="text-on-surface-variant" />
          </Link>
          <Link href="/" className="w-full p-4 text-error font-bold flex items-center justify-center gap-2 hover:bg-error/10 rounded-xl transition-colors mt-2">
            <Icon name="logout" /> התנתקות
          </Link>
        </section>
      </main>
      <BottomNav />
    </>
  );
}

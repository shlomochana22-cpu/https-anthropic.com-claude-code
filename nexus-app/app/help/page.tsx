import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Icon } from "@/components/Icon";

const cats = [
  { icon: "confirmation_number", title: "כרטיסים", body: "רכישה, ביטולים, והעברת כרטיסים לחברים." },
  { icon: "payments", title: "תשלומים", body: "אמצעי תשלום, חשבוניות ופתרון בעיות סליקה." },
  { icon: "account_circle", title: "חשבון", body: "ניהול פרופיל, אבטחה והגדרות פרטיות." },
];
const topics = [
  "איך מבטלים כרטיס שנקנה?",
  "מה עושים אם ה-QR לא נסרק בכניסה?",
  "שינוי שם על כרטיס קיים",
  "איך הופכים למפיק מאושר ב-NEXUS?",
];

export default function HelpPage() {
  return (
    <>
      <Header back="/profile" />
      <main className="pt-24 pb-32 px-margin-mobile max-w-3xl mx-auto">
        <section className="mb-lg">
          <h2 className="text-headline-lg-mobile text-primary-fixed mb-sm">מרכז התמיכה של NEXUS</h2>
          <p className="text-on-surface-variant mb-md">איך אנחנו יכולים לעזור לך היום?</p>
          <div className="relative">
            <Icon name="search" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-fixed" />
            <input
              className="w-full h-14 glass border border-white/10 rounded-xl pr-12 pl-4 text-on-surface focus:outline-none focus:border-primary-fixed transition-all"
              placeholder="חיפוש מאמרים, שאלות נפוצות או פתרונות..."
            />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-lg">
          {cats.map((c) => (
            <div key={c.title} className="glass p-md rounded-xl hover:bg-white/5 transition-all cursor-pointer group border-r-2 border-r-primary-fixed/20">
              <div className="w-12 h-12 rounded-lg bg-primary-fixed/10 flex items-center justify-center mb-sm group-hover:scale-110 transition-transform">
                <Icon name={c.icon} className="text-primary-fixed" />
              </div>
              <h3 className="text-headline-md mb-xs">{c.title}</h3>
              <p className="text-on-surface-variant">{c.body}</p>
            </div>
          ))}
        </section>

        <section className="mb-lg">
          <h4 className="text-label-md text-primary-fixed uppercase tracking-wider mb-md">נושאים חמים</h4>
          <div className="space-y-sm">
            {topics.map((t) => (
              <div key={t} className="glass p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <Icon name="description" className="text-on-surface-variant" />
                  <span>{t}</span>
                </div>
                <Icon name="chevron_left" className="text-on-surface-variant group-hover:translate-x-[-4px] transition-transform" />
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl p-lg text-center bg-gradient-to-br from-primary-fixed/20 to-transparent border border-primary-fixed/20">
          <h3 className="text-headline-lg mb-sm">עדיין צריכים עזרה?</h3>
          <p className="text-on-surface-variant mb-md max-w-md mx-auto">נציגי התמיכה זמינים בצ'אט חי 24/7.</p>
          <button className="bg-primary-fixed text-on-primary-fixed font-bold py-4 px-8 rounded-full inline-flex items-center gap-2 hover:shadow-neon-primary active:scale-95 transition-all">
            <Icon name="chat" fill /> דבר עם נציג עכשיו
          </button>
        </section>
      </main>
      <BottomNav />
    </>
  );
}

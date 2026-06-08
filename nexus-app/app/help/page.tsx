"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Icon } from "@/components/Icon";

const cats = [
  { key: "tickets", icon: "confirmation_number", title: "כרטיסים", body: "רכישה, ביטולים, והעברת כרטיסים לחברים." },
  { key: "payments", icon: "payments", title: "תשלומים", body: "אמצעי תשלום, חשבוניות ופתרון בעיות סליקה." },
  { key: "account", icon: "account_circle", title: "חשבון", body: "ניהול פרופיל, אבטחה והגדרות פרטיות." },
];

const topics = [
  { q: "איך מבטלים כרטיס שנקנה?", cat: "tickets", a: "בעמוד 'הכרטיסים שלי' בחרו בכרטיס ולחצו על 'בקשת ביטול'. החזר מלא ניתן עד 7 ימים לפני האירוע." },
  { q: "מה עושים אם ה-QR לא נסרק בכניסה?", cat: "tickets", a: "ודאו בהירות מסך מלאה. אם עדיין לא נסרק, הציגו לאיש הסלקציה את מספר ההזמנה — הוא יכול לאמת ידנית." },
  { q: "שינוי שם על כרטיס קיים", cat: "account", a: "כרטיסים אישיים ניתנים להעברה דרך 'מכירה חוזרת'. השם מתעדכן אוטומטית לקונה החדש." },
  { q: "איך הופכים למפיק מאושר ב-NEXUS?", cat: "account", a: "פנו אלינו בצ'אט עם פרטי ההפקה. לאחר אימות תקבלו גישה מלאה לאזור המפיק." },
  { q: "התשלום נכשל — מה עכשיו?", cat: "payments", a: "ודאו שהכרטיס בתוקף ושיש מסגרת. אם הבעיה נמשכת נסו אמצעי תשלום אחר או פנו לתמיכה." },
];

const WHATSAPP = "https://wa.me/972500000000?text=" + encodeURIComponent("היי NEXUS, אני צריך/ה עזרה עם...");

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const filtered = topics.filter((t) => (!cat || t.cat === cat) && (t.q.includes(query) || t.a.includes(query)));

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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 glass border border-white/10 rounded-xl pr-12 pl-4 text-on-surface focus:outline-none focus:border-primary-fixed transition-all"
              placeholder="חיפוש מאמרים, שאלות נפוצות או פתרונות..."
            />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-lg">
          {cats.map((c) => {
            const on = cat === c.key;
            return (
              <button key={c.key} onClick={() => { setCat(on ? null : c.key); setOpen(null); }} className={`text-right glass p-md rounded-xl hover:bg-white/5 transition-all group border-r-2 ${on ? "border-r-primary-fixed bg-primary-fixed/5" : "border-r-primary-fixed/20"}`}>
                <div className="w-12 h-12 rounded-lg bg-primary-fixed/10 flex items-center justify-center mb-sm group-hover:scale-110 transition-transform">
                  <Icon name={c.icon} className="text-primary-fixed" />
                </div>
                <h3 className="text-headline-md mb-xs flex items-center gap-2">{c.title}{on && <Icon name="check_circle" className="text-primary-fixed text-[18px]" fill />}</h3>
                <p className="text-on-surface-variant">{c.body}</p>
              </button>
            );
          })}
        </section>

        <section className="mb-lg">
          <h4 className="text-label-md text-primary-fixed uppercase tracking-wider mb-md">{cat ? "נושאים בקטגוריה" : "נושאים חמים"}</h4>
          <div className="space-y-sm">
            {filtered.map((t) => {
              const idx = topics.indexOf(t);
              const isOpen = open === idx;
              return (
                <div key={t.q} className="glass rounded-xl overflow-hidden">
                  <button onClick={() => setOpen(isOpen ? null : idx)} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors group text-right">
                    <div className="flex items-center gap-4">
                      <Icon name="description" className="text-on-surface-variant" />
                      <span>{t.q}</span>
                    </div>
                    <Icon name={isOpen ? "expand_less" : "chevron_left"} className="text-on-surface-variant" />
                  </button>
                  {isOpen && <p className="px-4 pb-4 pr-12 text-on-surface-variant text-body-md leading-relaxed">{t.a}</p>}
                </div>
              );
            })}
            {filtered.length === 0 && <p className="text-center text-on-surface-variant/60 py-6">לא נמצאו נושאים — נסו ניסוח אחר או דברו עם נציג.</p>}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl p-lg text-center bg-gradient-to-br from-primary-fixed/20 to-transparent border border-primary-fixed/20">
          <h3 className="text-headline-lg mb-sm">עדיין צריכים עזרה?</h3>
          <p className="text-on-surface-variant mb-md max-w-md mx-auto">נציגי התמיכה זמינים בצ'אט חי 24/7.</p>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="bg-primary-fixed text-on-primary-fixed font-bold py-4 px-8 rounded-full inline-flex items-center gap-2 hover:shadow-neon-primary active:scale-95 transition-all">
            <Icon name="chat" fill /> דבר עם נציג עכשיו
          </a>
        </section>
      </main>
      <BottomNav />
    </>
  );
}

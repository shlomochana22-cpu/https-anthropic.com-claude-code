"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Icon } from "@/components/Icon";

const customerLinks = [
  { href: "/tickets", icon: "confirmation_number", label: "הכרטיסים שלי" },
  { href: "/favorites", icon: "favorite", label: "מועדפים" },
  { href: "/resale", icon: "sell", label: "מכירה חוזרת" },
  { href: "/help", icon: "support_agent", label: "עזרה ותמיכה" },
];
const ALL_GENRES = ["טכנו", "טראנס", "היפ הופ", "האוס", "מיינסטרים"];
type Card = { brand: string; last4: string; exp: string };

export default function ProfilePage() {
  const [name, setName] = useState("עידו לוי");
  const [email, setEmail] = useState("ido.levi@nexus.com");
  const [genres, setGenres] = useState<string[]>(["טכנו", "האוס"]);
  const [cards, setCards] = useState<Card[]>([{ brand: "Visa", last4: "4242", exp: "12/26" }]);

  const [editOpen, setEditOpen] = useState(false);
  const [tName, setTName] = useState(name);
  const [tEmail, setTEmail] = useState(email);

  const [cardOpen, setCardOpen] = useState(false);
  const [cNum, setCNum] = useState("");
  const [cExp, setCExp] = useState("");

  const toggleGenre = (g: string) => setGenres((l) => (l.includes(g) ? l.filter((x) => x !== g) : [...l, g]));
  const saveProfile = () => { if (tName.trim()) setName(tName.trim()); setEmail(tEmail.trim()); setEditOpen(false); };
  const addCard = () => {
    const digits = cNum.replace(/\D/g, "");
    if (digits.length < 4) return;
    setCards((c) => [...c, { brand: digits.startsWith("4") ? "Visa" : "Mastercard", last4: digits.slice(-4), exp: cExp || "—" }]);
    setCNum(""); setCExp(""); setCardOpen(false);
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-32 px-margin-mobile max-w-2xl mx-auto">
        {/* Identity */}
        <section className="flex flex-col items-center text-center mb-lg">
          <div className="w-28 h-28 rounded-full border-4 border-primary-fixed p-1 shadow-[0_0_20px_rgba(191,245,32,0.3)] mb-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-full h-full object-cover rounded-full" alt="פרופיל" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxZCrrTo9SKjwne2y89SE9CBssiyHrw_vYmr8wnI9aKiVdMCHzPBmgoBU_cXGGd2Flq3R6LS_jGivUNRnmztMms9H0-0v1yae_kyP7Rkt47Hp9nUtjP2_mo-HjLXMOQcAeiWxQ4AcXCOqPICrfbw057_H0gmme6yo-ZYqHuFrsDrEWZe4pLGaIqg29E5Xhm8rEnBNmoTyx5DB-vJjoQlCI-WYyczTfecNsqAWVslWQkrkdBDVinM2WqIM0dpV8V9OPFwb1ZM1MBw" />
          </div>
          <h2 className="text-headline-md font-bold text-primary-fixed mb-1">{name}</h2>
          <p className="text-on-surface-variant">{email}</p>
          <button onClick={() => { setTName(name); setTEmail(email); setEditOpen(true); }} className="mt-md px-8 py-2 bg-primary-fixed text-on-primary-fixed font-bold rounded-full shadow-neon-primary hover:scale-105 active:scale-95 transition-all">
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
          <h3 className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest mb-md border-r-4 border-primary-fixed pr-3">העדפות מוזיקה</h3>
          <div className="flex flex-wrap gap-3">
            {ALL_GENRES.map((g) => {
              const on = genres.includes(g);
              return (
                <button key={g} onClick={() => toggleGenre(g)} className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${on ? "bg-primary-container text-on-primary-container font-bold border border-primary-fixed/30" : "glass text-on-surface-variant"}`}>
                  <span>{g}</span>
                  {on && <Icon name="check_circle" className="text-[18px]" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Payment methods */}
        <section className="mb-lg">
          <h3 className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest mb-md border-r-4 border-primary-fixed pr-3">אמצעי תשלום</h3>
          <div className="space-y-3">
            {cards.map((card, i) => (
              <div key={i} className="glass-card p-4 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-on-surface-variant/20 rounded flex items-center justify-center"><Icon name="credit_card" className="text-on-surface-variant" /></div>
                  <div>
                    <p className="font-bold text-on-surface">{card.brand} •••• {card.last4}</p>
                    <p className="text-xs text-on-surface-variant">בתוקף עד {card.exp}</p>
                  </div>
                </div>
                <Icon name="verified" className="text-primary-fixed" />
              </div>
            ))}
            <button onClick={() => setCardOpen(true)} className="w-full p-4 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary-fixed hover:border-primary-fixed/50 transition-all">
              <Icon name="add_card" /> <span className="font-bold">הוספת כרטיס חדש</span>
            </button>
          </div>
        </section>

        {/* Producer area entry */}
        <section className="mb-lg">
          <Link href="/producer/login" className="block glass-card rounded-2xl p-5 border border-primary-fixed/20 hover:bg-white/5 transition-colors relative overflow-hidden">
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-primary-fixed/10 blur-3xl rounded-full" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed/15 flex items-center justify-center"><Icon name="dashboard" className="text-primary-fixed" /></div>
                <div>
                  <p className="font-bold text-primary">מפיק אירועים?</p>
                  <p className="text-sm text-on-surface-variant">כניסת מפיקים — הקמת אירועים, מכירות, דאטא</p>
                </div>
              </div>
              <Icon name="arrow_back" className="text-primary-fixed" />
            </div>
          </Link>
        </section>

        {/* Account */}
        <section className="pt-2 border-t border-white/5">
          <Link href="/help" className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors">
            <div className="flex items-center gap-3"><Icon name="security" className="text-on-surface-variant" /><span className="font-bold">אבטחה ופרטיות</span></div>
            <Icon name="chevron_left" className="text-on-surface-variant" />
          </Link>
          <Link href="/login" className="w-full p-4 text-error font-bold flex items-center justify-center gap-2 hover:bg-error/10 rounded-xl transition-colors mt-2">
            <Icon name="logout" /> התנתקות
          </Link>
        </section>
      </main>
      <BottomNav />

      {/* Edit profile modal */}
      {editOpen && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
          <div className="relative glass-card w-full max-w-sm rounded-2xl p-5 border border-primary-fixed/20">
            <div className="flex items-center justify-between mb-4"><h3 className="text-base font-bold text-primary">עריכת פרופיל</h3><button onClick={() => setEditOpen(false)} className="text-on-surface-variant hover:text-on-surface"><Icon name="close" /></button></div>
            <div className="space-y-3">
              <input value={tName} onChange={(e) => setTName(e.target.value)} placeholder="שם מלא" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none" />
              <input value={tEmail} onChange={(e) => setTEmail(e.target.value)} type="email" placeholder="אימייל" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none" dir="ltr" />
              <button onClick={saveProfile} className="w-full bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg active:scale-95 shadow-neon-primary">שמירה</button>
            </div>
          </div>
        </div>
      )}

      {/* Add card modal */}
      {cardOpen && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCardOpen(false)} />
          <div className="relative glass-card w-full max-w-sm rounded-2xl p-5 border border-primary-fixed/20">
            <div className="flex items-center justify-between mb-4"><h3 className="text-base font-bold text-primary">הוספת כרטיס</h3><button onClick={() => setCardOpen(false)} className="text-on-surface-variant hover:text-on-surface"><Icon name="close" /></button></div>
            <div className="space-y-3">
              <input value={cNum} onChange={(e) => setCNum(e.target.value)} inputMode="numeric" placeholder="מספר כרטיס" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface font-mono focus:border-primary-fixed outline-none" dir="ltr" />
              <input value={cExp} onChange={(e) => setCExp(e.target.value)} placeholder="תוקף MM/YY" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface font-mono focus:border-primary-fixed outline-none" dir="ltr" />
              <button onClick={addCard} disabled={cNum.replace(/\D/g, "").length < 4} className="w-full bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg active:scale-95 shadow-neon-primary disabled:opacity-40 disabled:shadow-none">הוסף כרטיס</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

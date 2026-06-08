"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";

const stats = [
  { label: "סה\"כ לקוחות", value: "124,502", chip: "+12%" },
  { label: "ז'אנר מוביל", value: "Techno", note: "32,104 העדפות" },
  { label: "רכישות אקטיביות", value: "8,912", note: "24 שעות אחרונות" },
  { label: "מפיקים פעילים", value: "342", chip: "+8%" },
];

type User = { name: string; email: string; age: number; gender: string; genre: string; online: boolean };
const initialUsers: User[] = [
  { name: "עידן רייכלר", email: "idan@nexus.io", age: 24, gender: "זכר", genre: "Techno", online: true },
  { name: "מאיה בר", email: "maya.b@gmail.com", age: 22, gender: "נקבה", genre: "Mainstream", online: false },
  { name: "יוסי לוי", email: "yossi.levy@outlook.com", age: 31, gender: "זכר", genre: "Trance", online: true },
  { name: "נועה גל", email: "noa.g@nexus.io", age: 27, gender: "נקבה", genre: "Melodic", online: true },
  { name: "רון אבני", email: "ron.a@gmail.com", age: 29, gender: "זכר", genre: "Techno", online: false },
];
const allProducers = [
  { letter: "S", name: "Spoons Production", v: "15.2k" },
  { letter: "U", name: "Unity Events", v: "12.8k" },
  { letter: "M", name: "Music First", v: "9.4k" },
  { letter: "B", name: "Boombox Crew", v: "8.1k", dim: true },
  { letter: "N", name: "Neon Collective", v: "6.7k", dim: true },
  { letter: "A", name: "Afterdark", v: "5.3k", dim: true },
];

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [gender, setGender] = useState("הכל");
  const [genres, setGenres] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState<string | null>(null);
  const [showAllProducers, setShowAllProducers] = useState(false);

  const toggleGenre = (g: string) => setGenres((l) => (l.includes(g) ? l.filter((x) => x !== g) : [...l, g]));
  const removeUser = (email: string) => { setUsers((u) => u.filter((x) => x.email !== email)); setMenu(null); };
  const toggleOnline = (email: string) => { setUsers((u) => u.map((x) => (x.email === email ? { ...x, online: !x.online } : x))); setMenu(null); };

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        if (ageMin && u.age < Number(ageMin)) return false;
        if (ageMax && u.age > Number(ageMax)) return false;
        if (gender !== "הכל" && u.gender !== gender) return false;
        if (genres.length && !genres.includes(u.genre)) return false;
        if (query && !(u.name.includes(query) || u.email.toLowerCase().includes(query.toLowerCase()))) return false;
        return true;
      }),
    [users, ageMin, ageMax, gender, genres, query]
  );
  const producers = showAllProducers ? allProducers : allProducers.slice(0, 4);

  return (
    <main className="px-margin-mobile md:px-margin-desktop pt-10 pb-32 min-h-screen">
      <header className="mb-lg flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon name="shield_person" className="text-primary-fixed" />
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Superuser · Admin</span>
          </div>
          <h1 className="text-headline-lg">ניהול דאטא גלובלי</h1>
          <p className="text-on-surface-variant">סקירה מלאה של תנועת המשתמשים בפלטפורמה</p>
        </div>
        <Link href="/" className="text-on-surface-variant/60 text-sm hover:text-primary-fixed">← חזרה ל-NEXUS</Link>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-lg">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-md rounded-xl flex flex-col justify-between h-32">
            <span className="text-on-surface-variant text-sm">{s.label}</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-extrabold text-primary-fixed neon-text">{s.value}</span>
              {s.chip && <span className="text-primary-fixed-dim text-xs bg-primary-fixed/10 px-1.5 py-0.5 rounded">{s.chip}</span>}
            </div>
            {s.note && <span className="text-[10px] text-on-surface-variant">{s.note}</span>}
          </div>
        ))}
      </section>

      {/* Advanced filtering */}
      <section className="glass-card p-md rounded-xl mb-gutter">
        <div className="flex items-center justify-between mb-md">
          <div className="flex items-center gap-2 text-primary-fixed"><Icon name="filter_list" /><h3 className="text-label-md">סינון מתקדם</h3></div>
          <span className="text-label-sm text-on-surface-variant">{filtered.length} תוצאות</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block">טווח גילאים</label>
            <div className="flex gap-2">
              <input type="number" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} placeholder="מ-" className="w-full bg-surface-container-low border border-white/10 rounded-lg p-2 text-sm focus:border-primary-fixed outline-none" />
              <input type="number" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} placeholder="עד" className="w-full bg-surface-container-low border border-white/10 rounded-lg p-2 text-sm focus:border-primary-fixed outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block">מגדר</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-surface-container-low border border-white/10 rounded-lg p-2 text-sm focus:border-primary-fixed outline-none appearance-none"><option>הכל</option><option>זכר</option><option>נקבה</option><option>אחר</option></select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block">ז'אנר מוזיקלי</label>
            <div className="flex flex-wrap gap-2">
              {["Techno", "Trance", "Mainstream", "Melodic"].map((g) => {
                const on = genres.includes(g);
                return <button key={g} onClick={() => toggleGenre(g)} className={`px-3 py-1 rounded-full text-xs transition-all ${on ? "bg-primary-fixed text-on-primary-fixed font-bold border border-primary-fixed" : "bg-transparent text-on-surface-variant border border-white/10 hover:border-primary-fixed"}`}>{g}</button>;
              })}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block">חיפוש משתמש</label>
            <div className="relative">
              <Icon name="search" className="absolute right-2 top-2 text-on-surface-variant text-sm" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="שם, מייל או טלפון..." className="w-full bg-surface-container-low border border-white/10 rounded-lg p-2 pr-8 text-sm focus:border-primary-fixed outline-none text-right" />
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-xl overflow-hidden">
        {menu && <div className="fixed inset-0 z-[55]" onClick={() => setMenu(null)} />}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-white/5 text-on-surface-variant border-b border-white/5 text-sm">
                <th className="p-md">משתמש</th><th className="p-md">גיל</th><th className="p-md">מגדר</th><th className="p-md">ז'אנר מועדף</th><th className="p-md">סטטוס</th><th className="p-md text-center">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((u) => (
                <tr key={u.email} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/10 text-on-surface-variant"><Icon name="person" /></div>
                      <div className="flex flex-col"><span className="text-label-md">{u.name}</span><span className="text-[10px] text-on-surface-variant">{u.email}</span></div>
                    </div>
                  </td>
                  <td className="p-md">{u.age}</td>
                  <td className="p-md text-on-surface-variant">{u.gender}</td>
                  <td className="p-md"><span className="bg-secondary-fixed/10 text-secondary-fixed px-2 py-0.5 rounded text-xs font-bold border border-secondary-fixed/20">{u.genre}</span></td>
                  <td className="p-md">
                    <div className={`flex items-center gap-2 ${u.online ? "" : "text-on-surface-variant opacity-50"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${u.online ? "bg-primary-fixed shadow-[0_0_8px_rgba(191,245,32,0.8)]" : "bg-on-surface-variant"}`} />
                      <span className="text-xs">{u.online ? "מחובר כעת" : "לא מחובר"}</span>
                    </div>
                  </td>
                  <td className="p-md text-center">
                    <div className="relative inline-block">
                      <button onClick={() => setMenu(menu === u.email ? null : u.email)} className="text-on-surface-variant hover:text-primary-fixed transition-colors"><Icon name="more_vert" /></button>
                      {menu === u.email && (
                        <div className="absolute left-0 top-full mt-1 w-40 glass-card border border-white/10 rounded-xl py-1 z-[60] shadow-2xl text-right">
                          <button onClick={() => toggleOnline(u.email)} className="w-full px-3 py-2 flex items-center gap-2 text-label-sm text-on-surface hover:bg-white/5"><Icon name="toggle_on" className="text-[18px] text-primary-fixed" /> {u.online ? "סמן כלא מחובר" : "סמן כמחובר"}</button>
                          <button onClick={() => removeUser(u.email)} className="w-full px-3 py-2 flex items-center gap-2 text-label-sm text-error hover:bg-error/10"><Icon name="delete" className="text-[18px]" /> מחיקת משתמש</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="p-md text-center text-on-surface-variant/60 py-8">לא נמצאו משתמשים תואמים</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="p-md border-t border-white/5 text-xs text-on-surface-variant text-left">מציג {filtered.length} מתוך 124,502 משתמשים</div>
      </section>

      {/* Growth chart + top producers */}
      <section className="mt-xl grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="glass-card p-md rounded-xl md:col-span-2">
          <div className="flex justify-between items-center mb-md">
            <h3 className="text-label-md text-primary-fixed uppercase tracking-wider">צמיחת משתמשים (חודשי)</h3>
            <div className="flex gap-4 text-[10px] text-on-surface-variant"><div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-fixed" /> 2024</div><div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/20" /> 2023</div></div>
          </div>
          <div className="h-44 w-full flex items-end gap-2 relative">
            <div className="absolute inset-x-0 bottom-0 border-b border-white/10 h-px" />
            {[40, 60, 55, 80, 70, 95, 85].map((h, i) => (
              <div key={i} className={`flex-1 bg-primary-fixed/20 border-t-2 border-primary-fixed transition-all hover:brightness-150 ${h === 95 ? "shadow-[0_0_20px_rgba(191,245,32,0.3)]" : ""}`} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-on-surface-variant"><span>ינו'</span><span>פבר'</span><span>מרץ</span><span>אפר'</span><span>מאי</span><span>יוני</span><span>יולי</span></div>
        </div>
        <div className="glass-card p-md rounded-xl flex flex-col">
          <h3 className="text-label-md text-primary-fixed mb-md">הפקות מבוקשות</h3>
          <div className="space-y-4 flex-1">
            {producers.map((p) => (
              <div key={p.name} className={`flex items-center justify-between ${p.dim ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-2"><div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center font-bold text-xs">{p.letter}</div><span className="text-sm">{p.name}</span></div>
                <span className="text-xs font-bold text-primary-fixed">{p.v}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setShowAllProducers((v) => !v)} className="w-full mt-4 py-2 text-xs border border-white/10 rounded-lg hover:border-primary-fixed/50 hover:text-primary-fixed transition-all">{showAllProducers ? "הצג פחות" : "צפה בכל המפיקים"}</button>
        </div>
      </section>
    </main>
  );
}

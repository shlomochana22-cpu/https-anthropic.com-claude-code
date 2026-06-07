import Link from "next/link";
import { Icon } from "@/components/Icon";

const stats = [
  { label: "סה\"כ לקוחות", value: "124,502", chip: "+12%" },
  { label: "ז'אנר מוביל", value: "Techno", note: "32,104 העדפות" },
  { label: "רכישות אקטיביות", value: "8,912", note: "24 שעות אחרונות" },
  { label: "מפיקים פעילים", value: "342", chip: "+8%" },
];
const users = [
  { name: "עידן רייכלר", email: "idan@nexus.io", age: 24, genre: "Techno", online: true },
  { name: "מאיה בר", email: "maya.b@gmail.com", age: 22, genre: "Mainstream", online: false },
  { name: "יוסי לוי", email: "yossi.levy@outlook.com", age: 31, genre: "Trance", online: true },
];

export default function AdminPage() {
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

      <section className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-white/5 text-on-surface-variant border-b border-white/5 text-sm">
                <th className="p-md">משתמש</th>
                <th className="p-md">גיל</th>
                <th className="p-md">ז'אנר מועדף</th>
                <th className="p-md">סטטוס</th>
                <th className="p-md text-center">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.email} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/10 text-on-surface-variant">
                        <Icon name="person" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-label-md">{u.name}</span>
                        <span className="text-[10px] text-on-surface-variant">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-md">{u.age}</td>
                  <td className="p-md">
                    <span className="bg-secondary-fixed/10 text-secondary-fixed px-2 py-0.5 rounded text-xs font-bold border border-secondary-fixed/20">{u.genre}</span>
                  </td>
                  <td className="p-md">
                    <div className={`flex items-center gap-2 ${u.online ? "" : "text-on-surface-variant opacity-50"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${u.online ? "bg-primary-fixed shadow-[0_0_8px_rgba(191,245,32,0.8)]" : "bg-on-surface-variant"}`} />
                      <span className="text-xs">{u.online ? "מחובר כעת" : "לא מחובר"}</span>
                    </div>
                  </td>
                  <td className="p-md text-center">
                    <button className="text-on-surface-variant hover:text-primary-fixed transition-colors"><Icon name="more_vert" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-md border-t border-white/5 text-xs text-on-surface-variant text-left">
          מציג 1-10 מתוך 124,502 משתמשים
        </div>
      </section>
    </main>
  );
}

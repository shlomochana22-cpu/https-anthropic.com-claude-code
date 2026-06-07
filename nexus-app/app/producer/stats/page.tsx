"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

const periods = ["היום", "השבוע", "החודש", "הכל"];

const tiers = [
  { name: "Early Bird", sold: 450, total: 450, color: "bg-primary-fixed", note: "סולד אאוט", rev: "₪25,000" },
  { name: "Regular Entry", sold: 820, total: 1000, color: "bg-primary-fixed/80", note: "נמכר מהר", rev: "₪82,000" },
  { name: "VIP Nexus Lounge", sold: 125, total: 350, color: "bg-secondary-container", note: "נותרו כרטיסים", rev: "₪35,500" },
];
const ages = [
  { label: "18-21", h: 40 },
  { label: "22-25", h: 85 },
  { label: "26-30", h: 100 },
  { label: "31-35", h: 30 },
  { label: "35+", h: 15 },
];
const traffic = [
  { name: "Instagram Ads", sub: "קמפיין סטורי מרץ", icon: "ads_click", clicks: "12,450", conv: "4.2%", rev: "₪52,290", tone: "text-primary-fixed bg-primary-fixed/20" },
  { name: "PR: רונן לוי", sub: "לינק אישי יח\"צ", icon: "group", clicks: "3,120", conv: "8.1%", rev: "₪28,400", tone: "text-secondary-container bg-secondary-container/20" },
  { name: "כניסה ישירה", sub: "כניסה ישירה לאפליקציה", icon: "bolt", clicks: "8,900", conv: "2.5%", rev: "₪22,250", tone: "text-white bg-white/10" },
];

export default function StatsPage() {
  const [period, setPeriod] = useState("היום");

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop space-y-md">
      {/* Header + period tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-fixed" />
            </span>
            <span className="text-xs font-bold text-primary-fixed tracking-widest uppercase">Live Analytics</span>
          </div>
          <h2 className="text-3xl md:text-[32px] font-black text-white">סטטיסטיקה מפורטת</h2>
          <p className="text-on-surface-variant mt-1">ניתוח לאירוע: <span className="text-secondary-fixed">Cyber Rave 2024</span></p>
        </div>
        <div className="flex bg-surface-container-low p-1 rounded-xl border border-white/5">
          {periods.map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-6 py-2 rounded-lg text-label-md transition-all ${period === p ? "bg-primary-container text-on-primary-container shadow-lg" : "text-on-surface-variant hover:text-white"}`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Revenue */}
        <div className="md:col-span-2 glass-card rounded-2xl p-md flex flex-col justify-between overflow-hidden relative">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-on-surface-variant uppercase tracking-widest">סה"כ הכנסות</span>
              <h3 className="text-5xl font-extrabold text-primary-fixed leading-none mt-2">₪142,500</h3>
            </div>
            <span className="flex items-center gap-1 text-primary-fixed text-label-md bg-primary-container/10 px-2 py-1 rounded-md"><Icon name="trending_up" className="text-[18px]" /> 12.5%+</span>
          </div>
          <div className="h-40 mt-md">
            <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs><linearGradient id="cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#c8ff2e" stopOpacity="0.6" /><stop offset="100%" stopColor="#c8ff2e" stopOpacity="0" /></linearGradient></defs>
              <path d="M0,80 Q50,75 100,40 T200,50 T300,20 T400,30" fill="none" stroke="#c8ff2e" strokeWidth="3" style={{ filter: "drop-shadow(0 0 5px #c8ff2e)" }} />
              <path d="M0,80 Q50,75 100,40 T200,50 T300,20 T400,30 L400,100 L0,100 Z" fill="url(#cg)" />
            </svg>
          </div>
        </div>
        {/* Attendance gauge */}
        <div className="glass-card rounded-2xl p-md flex flex-col items-center justify-center text-center">
          <span className="text-xs text-on-surface-variant uppercase tracking-widest mb-4">כרגע באירוע</span>
          <div className="relative w-44 h-44">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle className="text-white/5" cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" />
              <circle className="text-primary-fixed" cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="78" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px rgba(191,245,32,0.8))" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-primary-fixed">1,240</span>
              <span className="text-xs text-on-surface-variant">מתוך 1,800</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" /><span className="text-label-md text-primary-fixed">עדכון חי</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Ticket breakdown */}
        <div className="glass-card rounded-2xl p-md">
          <h3 className="text-2xl font-bold text-white mb-md flex items-center gap-2"><Icon name="confirmation_number" className="text-primary-fixed" /> פילוח כרטיסים</h3>
          <div className="space-y-5">
            {tiers.map((t) => (
              <div key={t.name} className="space-y-2">
                <div className="flex justify-between text-label-md"><span className="text-white">{t.name}</span><span className="text-primary-fixed">{t.sold}/{t.total}</span></div>
                <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden"><div className={`h-full ${t.color}`} style={{ width: `${(t.sold / t.total) * 100}%` }} /></div>
                <div className="flex justify-between text-[10px] text-on-surface-variant uppercase"><span>{t.note}</span><span>{t.rev}</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* Demographics: gender + age */}
        <div className="glass-card rounded-2xl p-md">
          <h3 className="text-2xl font-bold text-white mb-md">דמוגרפיה</h3>
          {/* gender split */}
          <div className="mb-gutter">
            <div className="flex justify-between mb-2 text-label-md">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary-fixed-dim" /><span className="text-white">גברים 58%</span></div>
              <div className="flex items-center gap-2"><span className="text-white">נשים 42%</span><span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" /></div>
            </div>
            <div className="w-full h-8 flex rounded-xl overflow-hidden"><div className="h-full bg-secondary-fixed-dim w-[58%] border-r border-black/20" /><div className="h-full bg-tertiary-fixed-dim w-[42%]" /></div>
          </div>
          {/* age distribution */}
          <p className="text-label-md text-on-surface-variant mb-2">התפלגות גילאים</p>
          <div className="flex items-end justify-between h-28 gap-2">
            {ages.map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-2 w-full">
                <div className={`w-full rounded-t-md ${a.h === 100 ? "bg-primary-fixed" : "bg-primary-fixed/30"}`} style={{ height: `${a.h}%` }} />
                <span className={`text-[10px] ${a.h === 100 ? "text-primary-fixed font-bold" : "text-on-surface-variant"}`}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic sources */}
      <div className="glass-card rounded-2xl p-md overflow-hidden">
        <h3 className="text-2xl font-bold text-white mb-md">מקורות תנועה מובילים</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-on-surface-variant text-label-sm border-b border-white/5">
                <th className="pb-3 font-medium">מקור / קמפיין</th>
                <th className="pb-3 font-medium">הקלקות</th>
                <th className="pb-3 font-medium">המרה</th>
                <th className="pb-3 font-medium">הכנסה</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {traffic.map((t) => (
                <tr key={t.name} className="hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${t.tone}`}><Icon name={t.icon} className="text-[18px]" /></div>
                      <div><div className="text-white font-medium">{t.name}</div><div className="text-[10px] text-on-surface-variant">{t.sub}</div></div>
                    </div>
                  </td>
                  <td className="py-4 text-on-surface-variant">{t.clicks}</td>
                  <td className="py-4 text-primary-fixed font-bold">{t.conv}</td>
                  <td className="py-4 text-white">{t.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

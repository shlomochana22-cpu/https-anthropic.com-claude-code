"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";

type Customer = { name: string; age: number; gender: string; birth: string; last: string; status: string; tone: string };

const rows: Customer[] = [
  { name: "נירה שמואלי", age: 28, gender: "נקבה", birth: "15/08/1995", last: "12/05/2024", status: "פעיל מאוד", tone: "primary" },
  { name: "אבי כהן", age: 31, gender: "זכר", birth: "02/11/1992", last: "28/04/2024", status: "VIP", tone: "cyan" },
  { name: "מיה לוין", age: 24, gender: "נקבה", birth: "21/01/2000", last: "10/05/2024", status: "חדש", tone: "muted" },
  { name: "דניאל אזולאי", age: 27, gender: "זכר", birth: "09/03/1997", last: "01/05/2024", status: "פעיל מאוד", tone: "primary" },
  { name: "שני ברק", age: 22, gender: "נקבה", birth: "30/06/2002", last: "18/04/2024", status: "חדש", tone: "muted" },
  { name: "יוסי פרץ", age: 35, gender: "זכר", birth: "12/12/1988", last: "05/05/2024", status: "VIP", tone: "cyan" },
];

export default function CustomersPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => rows.filter((r) => r.name.includes(query) || r.status.includes(query)), [query]);

  const exportCsv = () => {
    const header = ["שם", "גיל", "מגדר", "תאריך לידה", "אירוע אחרון", "סטטוס"];
    const lines = [header, ...filtered.map((r) => [r.name, r.age, r.gender, r.birth, r.last, r.status])];
    const csv = "﻿" + lines.map((l) => l.join(",")).join("\n"); // BOM for Hebrew in Excel
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexus-customers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop">
      <div className="flex items-center justify-between mb-lg flex-wrap gap-4">
        <h2 className="text-headline-md font-bold text-primary-fixed">מאגר לקוחות</h2>
        <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-neon-primary">
          <Icon name="download" className="text-lg" /> ייצוא לאקסל
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-lg">
        <div className="md:col-span-3 glass-card rounded-2xl p-md flex items-center">
          <div className="relative w-full">
            <Icon name="search" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-fixed" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-surface-container-low border border-white/10 rounded-xl py-4 pr-12 pl-4 text-on-surface outline-none focus:border-primary-fixed transition-colors" placeholder="חיפוש לפי שם או סטטוס..." />
          </div>
        </div>
        <div className="glass-card rounded-2xl p-md flex flex-col items-center justify-center border-primary-fixed/20">
          <span className="text-on-surface-variant text-sm mb-1">סה"כ לקוחות</span>
          <span className="text-4xl font-extrabold text-primary-fixed neon-glow">12,482</span>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-surface-container-highest/50 border-b border-white/5 text-on-surface-variant text-sm">
                <th className="px-md py-4">לקוח</th>
                <th className="px-md py-4">גיל</th>
                <th className="px-md py-4">מגדר</th>
                <th className="px-md py-4">תאריך לידה</th>
                <th className="px-md py-4">אירוע אחרון</th>
                <th className="px-md py-4">סטטוס</th>
                <th className="px-md py-4">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((r) => (
                <tr key={r.name} className="hover:bg-white/5 transition-colors group">
                  <td className="px-md py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant border border-white/10">
                        <Icon name="person" />
                      </div>
                      <span className="font-bold text-on-surface">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-md py-4 text-on-surface-variant">{r.age}</td>
                  <td className="px-md py-4 text-on-surface-variant">{r.gender}</td>
                  <td className="px-md py-4 text-on-surface-variant">{r.birth}</td>
                  <td className="px-md py-4 text-on-surface-variant">{r.last}</td>
                  <td className="px-md py-4">
                    <span className={`px-3 py-1 text-xs rounded-full border ${
                      r.tone === "primary" ? "bg-primary-fixed/10 text-primary-fixed border-primary-fixed/20"
                      : r.tone === "cyan" ? "bg-secondary-container/10 text-secondary-fixed border-secondary-fixed/20"
                      : "bg-surface-container-highest/50 text-on-surface-variant border-white/5"
                    }`}>{r.status}</span>
                  </td>
                  <td className="px-md py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-surface-container-low rounded-lg hover:text-primary-fixed transition-colors"><Icon name="edit" className="text-sm" /></button>
                      <button className="p-2 bg-surface-container-low rounded-lg hover:text-error transition-colors"><Icon name="delete" className="text-sm" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-md py-8 text-center text-on-surface-variant/60">לא נמצאו לקוחות תואמים</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-lg flex justify-center items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-on-surface-variant hover:border-primary-fixed hover:text-primary-fixed transition-all"><Icon name="chevron_right" /></button>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-container text-on-primary-container font-bold">1</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-on-surface-variant hover:border-primary-fixed">2</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-on-surface-variant hover:border-primary-fixed">3</button>
          <span className="flex items-center px-2 text-on-surface-variant">...</span>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-on-surface-variant hover:border-primary-fixed">42</button>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-on-surface-variant hover:border-primary-fixed hover:text-primary-fixed transition-all"><Icon name="chevron_left" /></button>
      </div>
    </main>
  );
}

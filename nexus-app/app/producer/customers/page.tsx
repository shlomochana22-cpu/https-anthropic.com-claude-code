"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";

type Customer = { name: string; age: number | string; gender: string; birth: string; last: string; status: string; tone: string };

const seed: Customer[] = [
  { name: "נירה שמואלי", age: 28, gender: "נקבה", birth: "15/08/1995", last: "12/05/2024", status: "פעיל מאוד", tone: "primary" },
  { name: "אבי כהן", age: 31, gender: "זכר", birth: "02/11/1992", last: "28/04/2024", status: "VIP", tone: "cyan" },
  { name: "מיה לוין", age: 24, gender: "נקבה", birth: "21/01/2000", last: "10/05/2024", status: "חדש", tone: "muted" },
  { name: "דניאל אזולאי", age: 27, gender: "זכר", birth: "09/03/1997", last: "01/05/2024", status: "פעיל מאוד", tone: "primary" },
  { name: "שני ברק", age: 22, gender: "נקבה", birth: "30/06/2002", last: "18/04/2024", status: "חדש", tone: "muted" },
  { name: "יוסי פרץ", age: 35, gender: "זכר", birth: "12/12/1988", last: "05/05/2024", status: "VIP", tone: "cyan" },
];

const FIELD_LABELS: { key: string; label: string }[] = [
  { key: "name", label: "שם" },
  { key: "age", label: "גיל" },
  { key: "gender", label: "מגדר" },
  { key: "birth", label: "תאריך לידה" },
  { key: "phone", label: "טלפון" },
  { key: "status", label: "סטטוס" },
];

function parseTable(text: string): { headers: string[]; rows: string[][] } | null {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return null;
  const delim = lines[0].includes("\t") ? "\t" : ",";
  const cells = lines.map((l) => l.split(delim).map((c) => c.trim().replace(/^"|"$/g, "")));
  return { headers: cells[0], rows: cells.slice(1) };
}

// Days until a customer's next birthday from a "DD/MM/YYYY" (or .,- separated) string.
function daysToBirthday(birth: string): number | null {
  const m = birth.match(/(\d{1,2})[./-](\d{1,2})/);
  if (!m) return null;
  const day = Number(m[1]);
  const mon = Number(m[2]) - 1;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let next = new Date(now.getFullYear(), mon, day);
  if (next < today) next = new Date(now.getFullYear() + 1, mon, day);
  return Math.round((next.getTime() - today.getTime()) / 86400000);
}

export default function CustomersPage() {
  const [query, setQuery] = useState("");
  const [imported, setImported] = useState<Customer[]>([]);

  // Filters
  const [gender, setGender] = useState<"all" | "נקבה" | "זכר">("all");
  const [ageAll, setAgeAll] = useState(true);
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(60);
  const [bdayOn, setBdayOn] = useState(false);
  const [bdayFrom, setBdayFrom] = useState(0);
  const [bdayTo, setBdayTo] = useState(14);

  const all = useMemo(() => [...imported, ...seed], [imported]);
  const filtered = useMemo(
    () =>
      all.filter((r) => {
        if (query && !(r.name.includes(query) || r.status.includes(query))) return false;
        if (gender !== "all" && r.gender !== gender) return false;
        if (!ageAll) {
          const age = Number(r.age);
          if (!Number.isFinite(age) || age < ageMin || age > ageMax) return false;
        }
        if (bdayOn) {
          const d = daysToBirthday(r.birth);
          if (d == null || d < bdayFrom || d > bdayTo) return false;
        }
        return true;
      }),
    [all, query, gender, ageAll, ageMin, ageMax, bdayOn, bdayFrom, bdayTo]
  );
  const clearFilters = () => { setGender("all"); setAgeAll(true); setBdayOn(false); setQuery(""); };
  const filtersActive = gender !== "all" || !ageAll || bdayOn || !!query;

  // Import flow
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"input" | "map">("input");
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [mapping, setMapping] = useState<Record<string, number | null>>({});
  const [mapLoading, setMapLoading] = useState(false);
  const [aiSource, setAiSource] = useState<"ai" | "local" | null>(null);

  const exportCsv = () => {
    const header = ["שם", "גיל", "מגדר", "תאריך לידה", "אירוע אחרון", "סטטוס"];
    const lines = [header, ...filtered.map((r) => [r.name, r.age, r.gender, r.birth, r.last, r.status])];
    const csv = "﻿" + lines.map((l) => l.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url; a.download = "nexus-customers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const openImport = () => { setOpen(true); setStep("input"); setRaw(""); setParsed(null); setMapping({}); setAiSource(null); };
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setRaw(String(reader.result));
    reader.readAsText(f);
  };
  const proceed = async () => {
    const p = parseTable(raw);
    if (!p) return;
    setParsed(p);
    setMapLoading(true);
    try {
      const res = await fetch("/api/ai/map-columns", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ headers: p.headers, sample: p.rows[0] }) });
      const data = await res.json();
      setMapping(data.mapping || {});
      setAiSource(data.source === "ai" ? "ai" : "local");
    } catch {
      setMapping({});
      setAiSource("local");
    } finally {
      setMapLoading(false);
      setStep("map");
    }
  };
  const val = (row: string[], field: string) => {
    const i = mapping[field];
    return i != null && i >= 0 ? (row[i] ?? "").trim() : "";
  };
  const previewCount = parsed ? parsed.rows.filter((r) => val(r, "name")).length : 0;
  const doImport = () => {
    if (!parsed) return;
    const customers: Customer[] = parsed.rows
      .filter((r) => val(r, "name"))
      .map((r) => ({ name: val(r, "name"), age: Number(val(r, "age")) || "—", gender: val(r, "gender") || "—", birth: val(r, "birth") || "—", last: "—", status: val(r, "status") || "חדש", tone: "muted" }));
    setImported((prev) => [...customers, ...prev]);
    setOpen(false);
  };

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop">
      <div className="flex items-center justify-between mb-lg flex-wrap gap-4">
        <h2 className="text-headline-md font-bold text-primary-fixed">מאגר לקוחות</h2>
        <div className="flex items-center gap-2">
          <button onClick={openImport} className="flex items-center gap-2 px-4 py-2 bg-surface-container-high border border-primary-fixed/40 text-primary-fixed rounded-lg font-bold text-sm hover:bg-white/5 active:scale-95 transition-all">
            <Icon name="upload_file" className="text-lg" /> ייבוא דאטא
          </button>
          <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-neon-primary">
            <Icon name="download" className="text-lg" /> ייצוא
          </button>
        </div>
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
          <span className="text-4xl font-extrabold text-primary-fixed neon-glow">{(12482 + imported.length).toLocaleString()}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-md mb-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-label-md text-primary-fixed uppercase tracking-wider flex items-center gap-1.5"><Icon name="filter_list" className="text-[18px]" /> סינון</h3>
          {filtersActive && <button onClick={clearFilters} className="text-label-sm text-on-surface-variant hover:text-error flex items-center gap-1"><Icon name="close" className="text-[15px]" /> נקה</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gender */}
          <div className="space-y-2">
            <p className="text-label-sm text-on-surface-variant flex items-center gap-1.5"><Icon name="wc" className="text-[16px]" /> מגדר</p>
            <div className="flex gap-2">
              {([{ k: "all", l: "הכל" }, { k: "נקבה", l: "נשים" }, { k: "זכר", l: "גברים" }] as const).map((g) => (
                <button key={g.k} onClick={() => setGender(g.k)} className={`flex-1 py-2 rounded-lg border text-label-sm transition-all ${gender === g.k ? "border-primary-fixed bg-primary-container/15 text-primary-fixed font-bold" : "border-white/10 bg-white/5 text-on-surface-variant hover:border-primary-fixed/40"}`}>{g.l}</button>
              ))}
            </div>
          </div>

          {/* Age range */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-label-sm text-on-surface-variant flex items-center gap-1.5"><Icon name="cake" className="text-[16px]" /> טווח גילאים</p>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <span className="text-label-sm text-on-surface-variant">הכל</span>
                <button onClick={() => setAgeAll((v) => !v)} className={`w-9 h-5 rounded-full relative shrink-0 transition-colors ${ageAll ? "bg-primary-fixed" : "bg-surface-container-highest"}`} aria-label="כל הגילאים"><span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${ageAll ? "right-0.5" : "right-[18px]"}`} /></button>
              </label>
            </div>
            <div className={`flex items-center gap-2 ${ageAll ? "opacity-40 pointer-events-none" : ""}`}>
              <span className="text-label-sm text-on-surface-variant">מגיל</span>
              <input type="number" min={0} max={120} value={ageMin} onChange={(e) => setAgeMin(Number(e.target.value))} className="w-14 bg-surface-container-low border border-white/10 rounded-lg p-2 text-center text-primary focus:border-primary-fixed outline-none" />
              <span className="text-on-surface-variant">—</span>
              <span className="text-label-sm text-on-surface-variant">עד</span>
              <input type="number" min={0} max={120} value={ageMax} onChange={(e) => setAgeMax(Number(e.target.value))} className="w-14 bg-surface-container-low border border-white/10 rounded-lg p-2 text-center text-primary focus:border-primary-fixed outline-none" />
            </div>
          </div>

          {/* Upcoming birthday */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-label-sm text-on-surface-variant flex items-center gap-1.5"><Icon name="celebration" className="text-[16px]" /> יום הולדת קרוב</p>
              <button onClick={() => setBdayOn((v) => !v)} className={`w-9 h-5 rounded-full relative shrink-0 transition-colors ${bdayOn ? "bg-primary-fixed" : "bg-surface-container-highest"}`} aria-label="יום הולדת קרוב"><span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${bdayOn ? "right-0.5" : "right-[18px]"}`} /></button>
            </div>
            <div className={`flex items-center gap-2 ${bdayOn ? "" : "opacity-40 pointer-events-none"}`}>
              <span className="text-label-sm text-on-surface-variant">מיום</span>
              <input type="number" min={0} max={365} value={bdayFrom} onChange={(e) => setBdayFrom(Number(e.target.value))} className="w-14 bg-surface-container-low border border-white/10 rounded-lg p-2 text-center text-primary focus:border-primary-fixed outline-none" />
              <span className="text-on-surface-variant">—</span>
              <span className="text-label-sm text-on-surface-variant">עד</span>
              <input type="number" min={0} max={365} value={bdayTo} onChange={(e) => setBdayTo(Number(e.target.value))} className="w-14 bg-surface-container-low border border-white/10 rounded-lg p-2 text-center text-primary focus:border-primary-fixed outline-none" />
              <span className="text-label-sm text-on-surface-variant">ימים</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-label-sm text-on-surface-variant">{filtered.length.toLocaleString()} לקוחות תואמים</span>
          <button onClick={exportCsv} className="flex items-center gap-1.5 text-label-sm text-primary-fixed hover:underline"><Icon name="download" className="text-[16px]" /> ייצוא התוצאות לאקסל</button>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-surface-container-highest/50 border-b border-white/5 text-on-surface-variant text-sm">
                <th className="px-md py-4">לקוח</th><th className="px-md py-4">גיל</th><th className="px-md py-4">מגדר</th><th className="px-md py-4">תאריך לידה</th><th className="px-md py-4">אירוע אחרון</th><th className="px-md py-4">סטטוס</th><th className="px-md py-4">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((r, i) => (
                <tr key={`${r.name}-${i}`} className="hover:bg-white/5 transition-colors group">
                  <td className="px-md py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant border border-white/10"><Icon name="person" /></div><span className="font-bold text-on-surface">{r.name}</span></div></td>
                  <td className="px-md py-4 text-on-surface-variant">{r.age}</td>
                  <td className="px-md py-4 text-on-surface-variant">{r.gender}</td>
                  <td className="px-md py-4 text-on-surface-variant">{r.birth}</td>
                  <td className="px-md py-4 text-on-surface-variant">{r.last}</td>
                  <td className="px-md py-4"><span className={`px-3 py-1 text-xs rounded-full border ${r.tone === "primary" ? "bg-primary-fixed/10 text-primary-fixed border-primary-fixed/20" : r.tone === "cyan" ? "bg-secondary-container/10 text-secondary-fixed border-secondary-fixed/20" : "bg-surface-container-highest/50 text-on-surface-variant border-white/5"}`}>{r.status}</span></td>
                  <td className="px-md py-4"><div className="flex items-center gap-2"><button className="p-2 bg-surface-container-low rounded-lg hover:text-primary-fixed transition-colors"><Icon name="edit" className="text-sm" /></button><button className="p-2 bg-surface-container-low rounded-lg hover:text-error transition-colors"><Icon name="delete" className="text-sm" /></button></div></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-md py-8 text-center text-on-surface-variant/60">לא נמצאו לקוחות תואמים</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import modal */}
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative glass-card w-full max-w-lg rounded-2xl p-5 border border-primary-fixed/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-primary flex items-center gap-2"><Icon name="upload_file" className="text-primary-fixed" /> ייבוא לקוחות מאקסל</h3>
              <button onClick={() => setOpen(false)} className="text-on-surface-variant hover:text-on-surface"><Icon name="close" /></button>
            </div>

            {step === "input" ? (
              <div className="space-y-3">
                <p className="text-label-md text-on-surface-variant">העתיקו את הטבלה מאקסל והדביקו כאן (כולל שורת כותרות), או העלו קובץ CSV. ה-AI יזהה את העמודות אוטומטית.</p>
                <textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={7} placeholder={"שם\tגיל\tמין\tטלפון\nישראל ישראלי\t27\tזכר\t050-1234567"} className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface font-mono text-sm focus:border-primary-fixed outline-none" dir="ltr" />
                <label className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-white/20 text-on-surface-variant hover:border-primary-fixed/50 transition-colors cursor-pointer">
                  <input type="file" accept=".csv,text/csv,text/plain" onChange={onFile} className="hidden" />
                  <Icon name="attach_file" /> או העלאת קובץ CSV
                </label>
                <button onClick={proceed} disabled={!parseTable(raw) || mapLoading} className="w-full bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 disabled:opacity-40 disabled:shadow-none">
                  <Icon name="auto_awesome" className={mapLoading ? "animate-spin" : ""} fill /> {mapLoading ? "מזהה עמודות…" : "המשך · זיהוי עמודות עם AI"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-label-md text-on-surface-variant">התאמת עמודות {parsed?.headers.length} → שדות המערכת</p>
                  {aiSource === "ai" && <span className="text-[10px] text-primary-fixed flex items-center gap-1 bg-primary-fixed/10 border border-primary-fixed/30 px-2 py-0.5 rounded-full"><Icon name="auto_awesome" className="text-[12px]" fill /> מופה ע"י AI</span>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {FIELD_LABELS.map((f) => (
                    <div key={f.key}>
                      <label className="text-label-sm text-on-surface-variant block mb-1">{f.label}</label>
                      <select value={mapping[f.key] ?? ""} onChange={(e) => setMapping((m) => ({ ...m, [f.key]: e.target.value === "" ? null : Number(e.target.value) }))} className="w-full bg-surface-container-low border border-white/10 rounded-lg px-2 py-2 text-label-md text-on-surface focus:border-primary-fixed outline-none">
                        <option value="">— ללא —</option>
                        {parsed?.headers.map((h, i) => <option key={i} value={i}>{h || `עמודה ${i + 1}`}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                {/* Preview */}
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-label-sm text-on-surface-variant mb-2">תצוגה מקדימה ({previewCount} לקוחות לייבוא):</p>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {parsed?.rows.filter((r) => val(r, "name")).slice(0, 4).map((r, i) => (
                      <div key={i} className="text-label-sm text-on-surface flex items-center gap-2 flex-wrap">
                        <span className="font-bold">{val(r, "name")}</span>
                        {val(r, "age") && <span className="text-on-surface-variant">· {val(r, "age")}</span>}
                        {val(r, "gender") && <span className="text-on-surface-variant">· {val(r, "gender")}</span>}
                        {val(r, "phone") && <span className="text-secondary-fixed">· {val(r, "phone")}</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep("input")} className="px-4 py-3 rounded-lg border border-white/10 text-on-surface-variant hover:bg-white/5 transition-colors">חזרה</button>
                  <button onClick={doImport} disabled={previewCount === 0} className="flex-1 bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 disabled:opacity-40 disabled:shadow-none">
                    <Icon name="library_add" /> ייבא {previewCount} לקוחות
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import type { NexusEvent } from "@/lib/events";
import type { DBGuest } from "@/lib/queries";
import { createInvite, addGuest, updateGuestStatus, deleteGuest } from "@/lib/guests";
import { PhoneInput } from "@/components/PhoneInput";

const NAMES = [
  "איתי לוי", "דנה כהן", "נועם אברהם", "שירה פרץ", "יואב מזרחי", "טל ביטון",
  "רוני דהן", "עומר שלום", "ליהי אבני", "גיא רוזן", "מאיה לוין", "אורי גל",
];
const STATUSES = ["Approved", "Scanned", "Pending"] as const;
const TONES: Record<string, string> = { Approved: "primary", Scanned: "cyan", Pending: "error" };
const STATUS_CYCLE = [
  { label: "מאושר", tone: "primary" },
  { label: "נסרק", tone: "cyan" },
  { label: "ממתין", tone: "error" },
];

type Guest = { id: string; initial: string; name: string; phone: string; status: string; tone: string; tel?: string; code?: string; dbId?: string };

function guestsFor(event: NexusEvent): Guest[] {
  const seed = event.id.length + Math.round(event.occupancy);
  const count = 6 + (seed % 6);
  return Array.from({ length: count }, (_, i) => {
    const name = NAMES[(seed + i) % NAMES.length];
    const status = STATUSES[(seed + i) % STATUSES.length];
    const tier = i % 4 === 0 ? "מוזמן VIP" : i % 3 === 0 ? "מוזמן הפקה" : "רשימה רגילה";
    const phone = `05${2 + (i % 6)}-${String(1000000 + ((seed * 7919 + i * 31) % 8999999)).slice(0, 7)}`;
    return { id: `mock-${event.id}-${i}`, initial: name[0], name, phone: `${phone} • ${tier}`, status, tone: TONES[status], tel: phone };
  });
}

function dbGuestToDisplay(g: DBGuest): Guest {
  const name = `${g.first_name} ${g.last_name}`.trim();
  const entry = g.entry_type === "free" ? "כניסה חינם" : "כניסה מוזלת";
  return {
    id: `db-${g.id}`,
    dbId: g.id,
    initial: name[0] || "?",
    name,
    phone: `${g.phone ? g.phone + " • " : ""}${g.gender ?? ""}${g.dob ? " • " + g.dob : ""} · ${entry}${g.qty > 1 ? ` ×${g.qty}` : ""} · ${g.source === "link" ? "לינק" : "ידני"}`,
    status: g.status === "scanned" ? "Scanned" : g.entry_type === "free" ? "חינם" : "מוזל",
    tone: g.status === "scanned" ? "cyan" : g.entry_type === "free" ? "primary" : "cyan",
    tel: g.phone ?? undefined,
    code: g.code ?? undefined,
  };
}

export function GuestManager({ events, dbGuests = [] }: { events: NexusEvent[]; dbGuests?: DBGuest[] }) {
  const [activeId, setActiveId] = useState(events[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState<Record<string, Guest[]>>({});
  const event = events.find((e) => e.id === activeId) ?? events[0];

  const dbByEvent = useMemo(() => {
    const map: Record<string, Guest[]> = {};
    for (const g of dbGuests) (map[g.event_id] ||= []).push(dbGuestToDisplay(g));
    return map;
  }, [dbGuests]);

  // Add-guest modal
  const [modal, setModal] = useState(false);
  const [mode, setMode] = useState<"manual" | "link">("manual");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("נקבה");
  const [entryType, setEntryType] = useState<"free" | "discount">("free");
  const [qty, setQty] = useState(1);
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://nexusevents.co.il";

  // Row actions (kebab menu)
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [statusOverride, setStatusOverride] = useState<Record<string, { label: string; tone: string }>>({});
  const [deleted, setDeleted] = useState<Set<string>>(new Set());

  const changeStatus = (g: Guest) => {
    const curr = statusOverride[g.id]?.label;
    const idx = STATUS_CYCLE.findIndex((s) => s.label === curr);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    setStatusOverride((o) => ({ ...o, [g.id]: next }));
    if (g.dbId) void updateGuestStatus(g.dbId, next.label === "נסרק");
  };
  const removeGuest = (g: Guest) => {
    setDeleted((d) => new Set(d).add(g.id));
    if (g.dbId) void deleteGuest(g.dbId);
  };
  const waDigits = (tel?: string) => {
    if (!tel) return "";
    let d = tel.replace(/[^\d]/g, "");
    if (d.startsWith("0")) d = "972" + d.slice(1);
    return d;
  };
  const openWa = (g: Guest) => { const d = waDigits(g.tel); if (d) window.open(`https://wa.me/${d}`, "_blank"); };
  const resendTicket = async (g: Guest) => {
    const text = `🎟️ הכרטיס שלך ל${event?.title ?? "האירוע"}${g.code ? ` · קוד כניסה: ${g.code}` : ""}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: "NEXUS", text }); } catch { /* cancelled */ }
    } else { navigator.clipboard?.writeText(text); }
  };

  const guests = useMemo(
    () => (event ? [...(added[activeId] || []), ...(dbByEvent[activeId] || []), ...guestsFor(event)] : []),
    [event, added, dbByEvent, activeId]
  );
  const filtered = guests
    .filter((g) => !deleted.has(g.id))
    .filter((g) => g.name.includes(query) || g.phone.includes(query))
    .map((g) => (statusOverride[g.id] ? { ...g, status: statusOverride[g.id].label, tone: statusOverride[g.id].tone } : g));

  const stats = useMemo(() => [
    { label: "סך הכל מוזמנים", value: String(guests.length), tone: "text-white" },
    { label: "אושרו", value: String(guests.filter((g) => g.status === "Approved").length), tone: "text-primary-fixed" },
    { label: "נסרקו בקופה", value: String(guests.filter((g) => g.status === "Scanned").length), tone: "text-secondary-fixed" },
    { label: "ממתינים", value: String(guests.filter((g) => g.status === "Pending").length), tone: "text-error" },
  ], [guests]);

  const openModal = () => { setModal(true); setMode("manual"); setFirst(""); setLast(""); setPhone(""); setDob(""); setGender("נקבה"); setEntryType("free"); setQty(1); setGenerated(""); };

  const addManual = () => {
    if (!first.trim() || !last.trim()) return;
    const name = `${first.trim()} ${last.trim()}`;
    const entry = entryType === "free" ? "כניסה חינם" : "כניסה מוזלת";
    const g: Guest = {
      id: `added-${Date.now()}`,
      initial: name[0],
      name,
      phone: `${phone.trim() ? phone.trim() + " • " : ""}${gender}${dob ? " • " + dob : ""} · ${entry}${qty > 1 ? ` ×${qty}` : ""}`,
      status: entryType === "free" ? "חינם" : "מוזל",
      tone: entryType === "free" ? "primary" : "cyan",
      tel: phone.trim() || undefined,
    };
    setAdded((a) => ({ ...a, [activeId]: [g, ...(a[activeId] || [])] }));
    // persist (no-op in demo / when DB isn't configured)
    void addGuest({ eventId: activeId, firstName: first.trim(), lastName: last.trim(), phone: phone.trim(), dob, gender, entryType, qty });
    setModal(false);
  };

  const [genBusy, setGenBusy] = useState(false);
  const genLink = async () => {
    setGenBusy(true);
    const { token } = await createInvite(activeId, qty, entryType);
    setGenerated(`${origin}/invite/${token}?event=${activeId}&qty=${qty}&type=${entryType}`);
    setGenBusy(false);
  };
  const copyLink = () => { navigator.clipboard?.writeText(generated); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const shareLink = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: "הזמנה ל-NEXUS", text: "מלא/י פרטים וקבל/י כרטיס", url: generated }); } catch { /* cancelled */ }
    } else copyLink();
  };

  if (!event) {
    return (
      <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop">
        <h2 className="text-headline-lg-mobile text-primary-fixed mb-1">ניהול רשימות מוזמנים</h2>
        <p className="text-on-surface-variant/80">אין אירועים עדיין — צרו אירוע כדי לנהל רשימת מוזמנים.</p>
      </main>
    );
  }

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop">
      <h2 className="text-headline-lg-mobile text-primary-fixed mb-1">ניהול רשימות מוזמנים</h2>
      <p className="text-on-surface-variant/80 mb-md">הזמנות לכניסה חינם או מוזלת · בחרו אירוע · {events.length} אירועים</p>

      {/* Event selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-lg">
        {events.map((e) => {
          const on = e.id === activeId;
          return (
            <button key={e.id} onClick={() => setActiveId(e.id)} className={`shrink-0 px-4 py-2.5 rounded-xl border text-right transition-all ${on ? "border-primary-fixed bg-primary-container/15" : "border-white/10 bg-white/5 hover:border-primary-fixed/40"}`}>
              <p className={`text-label-md ${on ? "text-primary-fixed font-bold" : "text-on-surface"}`}>{e.title}</p>
              <p className="text-[10px] text-on-surface-variant">{e.date} • {e.occupancy}% נמכר</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-lg">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-md rounded-xl flex flex-col justify-between">
            <span className="text-label-sm text-on-surface-variant">{s.label}</span>
            <span className={`text-headline-md mt-1 ${s.tone}`}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="relative mb-md">
        <Icon name="search" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full glass border border-white/10 rounded-xl py-3 pr-12 pl-4 text-on-surface focus:border-primary-fixed outline-none" placeholder="חיפוש לפי שם, טלפון או קוד..." />
      </div>

      {menuOpen && <div className="fixed inset-0 z-[55]" onClick={() => setMenuOpen(null)} />}
      <div className="space-y-gutter">
        {filtered.map((g) => (
          <div key={g.id} className={`glass-card p-md rounded-xl flex items-center justify-between ${g.tone === "error" ? "border-error/20" : ""}`}>
            <div className="flex items-center gap-md">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl ${g.tone === "error" ? "bg-error-container/40 text-error" : "bg-gradient-to-br from-primary-fixed to-secondary-fixed text-on-primary-fixed"}`}>{g.initial}</div>
              <div className="flex flex-col">
                <span className="text-label-md text-white">{g.name}</span>
                <span className="text-label-sm text-on-surface-variant">{g.phone}</span>
              </div>
            </div>
            <div className="flex items-center gap-md">
              <span className={`px-3 py-1 rounded-lg text-label-sm border ${
                g.tone === "primary" ? "bg-primary-container/20 text-primary-fixed border-primary-fixed/30"
                : g.tone === "cyan" ? "bg-secondary-fixed/10 text-secondary-fixed border-secondary-fixed/30"
                : "bg-error-container/20 text-error border-error/30"
              }`}>{g.status}</span>
              <div className="relative">
                <button onClick={() => setMenuOpen(menuOpen === g.id ? null : g.id)} className="text-on-surface-variant hover:text-white transition-colors" aria-label="פעולות"><Icon name="more_vert" /></button>
                {menuOpen === g.id && (
                  <div className="absolute left-0 top-full mt-1 w-48 glass-card border border-white/10 rounded-xl py-1 z-[60] shadow-2xl">
                    <button onClick={() => { changeStatus(g); setMenuOpen(null); }} className="w-full text-right px-3 py-2.5 flex items-center gap-2 text-label-md text-on-surface hover:bg-white/5 transition-colors">
                      <Icon name="published_with_changes" className="text-[18px] text-primary-fixed" /> שינוי סטטוס
                    </button>
                    <button onClick={() => { openWa(g); setMenuOpen(null); }} disabled={!g.tel} className="w-full text-right px-3 py-2.5 flex items-center gap-2 text-label-md text-on-surface hover:bg-white/5 transition-colors disabled:opacity-40">
                      <Icon name="chat" className="text-[18px] text-[#25D366]" fill /> וואטסאפ
                    </button>
                    <button onClick={() => { resendTicket(g); setMenuOpen(null); }} className="w-full text-right px-3 py-2.5 flex items-center gap-2 text-label-md text-on-surface hover:bg-white/5 transition-colors">
                      <Icon name="send" className="text-[18px] text-secondary-fixed" /> שלח כרטיס מחדש
                    </button>
                    <div className="h-px bg-white/5 my-1" />
                    <button onClick={() => { removeGuest(g); setMenuOpen(null); }} className="w-full text-right px-3 py-2.5 flex items-center gap-2 text-label-md text-error hover:bg-error/10 transition-colors">
                      <Icon name="delete" className="text-[18px]" /> מחיקה
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-on-surface-variant/60 py-8">לא נמצאו מוזמנים תואמים</p>}
      </div>

      <button onClick={openModal} className="fixed bottom-24 left-6 md:bottom-8 w-16 h-16 bg-primary-fixed text-on-primary-fixed rounded-full shadow-neon-primary flex items-center justify-center active:scale-90 transition-all z-50">
        <Icon name="person_add" className="text-[32px]" />
      </button>

      {/* Add-guest modal */}
      {modal && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative glass-card w-full max-w-md rounded-2xl p-5 border border-primary-fixed/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-primary">הוספת מוזמן · {event.title}</h3>
              <button onClick={() => setModal(false)} className="text-on-surface-variant hover:text-on-surface"><Icon name="close" /></button>
            </div>

            {/* Mode switch */}
            <div className="flex gap-2 mb-4 p-1 bg-surface-container rounded-xl">
              <button onClick={() => setMode("manual")} className={`flex-1 py-2 rounded-lg text-label-md transition-all ${mode === "manual" ? "bg-primary-fixed text-on-primary-fixed font-bold" : "text-on-surface-variant"}`}>מילוי ידני</button>
              <button onClick={() => setMode("link")} className={`flex-1 py-2 rounded-lg text-label-md transition-all ${mode === "link" ? "bg-primary-fixed text-on-primary-fixed font-bold" : "text-on-surface-variant"}`}>יצירת לינק</button>
            </div>

            {/* Shared: entry type + quantity */}
            <div className="space-y-3 mb-3">
              <div>
                <label className="text-label-sm text-on-surface-variant block mb-1">סוג כניסה</label>
                <div className="flex gap-2">
                  <button onClick={() => setEntryType("free")} className={`flex-1 py-2 rounded-lg border text-label-md transition-all ${entryType === "free" ? "border-primary-fixed bg-primary-container/15 text-primary-fixed font-bold" : "border-white/10 bg-white/5 text-on-surface-variant"}`}>כניסה חינם</button>
                  <button onClick={() => setEntryType("discount")} className={`flex-1 py-2 rounded-lg border text-label-md transition-all ${entryType === "discount" ? "border-secondary-fixed bg-secondary-fixed/15 text-secondary-fixed font-bold" : "border-white/10 bg-white/5 text-on-surface-variant"}`}>כניסה מוזלת</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-label-sm text-on-surface-variant">כמות כרטיסים</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center active:scale-90"><Icon name="remove" className="text-[18px]" /></button>
                  <span className="w-6 text-center font-bold text-lg text-primary">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center active:scale-90"><Icon name="add" className="text-[18px]" /></button>
                </div>
              </div>
            </div>

            {mode === "manual" ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="שם פרטי" className="bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none" />
                  <input value={last} onChange={(e) => setLast(e.target.value)} placeholder="שם משפחה" className="bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none" />
                </div>
                <PhoneInput value={phone} onChange={setPhone} />
                <div>
                  <label className="text-label-sm text-on-surface-variant block mb-1">תאריך לידה</label>
                  <input value={dob} onChange={(e) => setDob(e.target.value)} type="date" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none [color-scheme:dark]" />
                </div>
                <div>
                  <label className="text-label-sm text-on-surface-variant block mb-1">מין</label>
                  <div className="flex gap-2">
                    {["נקבה", "זכר", "אחר"].map((g) => (
                      <button key={g} onClick={() => setGender(g)} className={`flex-1 py-2 rounded-lg border text-label-md transition-all ${gender === g ? "border-primary-fixed bg-primary-container/15 text-primary-fixed font-bold" : "border-white/10 bg-white/5 text-on-surface-variant"}`}>{g}</button>
                    ))}
                  </div>
                </div>
                <button onClick={addManual} disabled={!first.trim() || !last.trim()} className="w-full mt-1 bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 transition-all disabled:opacity-40 disabled:shadow-none">
                  <Icon name="person_add" /> הוסף לרשימת המוזמנים
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {!generated ? (
                  <>
                    <p className="text-label-sm text-on-surface-variant/70 flex items-center gap-1"><Icon name="link" className="text-[16px]" /> צרו לינק חד-פעמי — הלקוח ממלא פרטים ומקבל {qty > 1 ? `${qty} כרטיסים` : "כרטיס"}. לאחר שימוש הלינק מתבטל.</p>
                    <button onClick={genLink} disabled={genBusy} className="w-full bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 transition-all disabled:opacity-50">
                      <Icon name="add_link" /> {genBusy ? "יוצר…" : "צור לינק רישום"}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <input readOnly value={generated} dir="ltr" className="flex-1 bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-label-sm text-on-surface-variant font-mono outline-none" />
                      <button onClick={copyLink} className="shrink-0 w-9 h-9 rounded-lg bg-surface-container-high border border-white/10 flex items-center justify-center text-primary active:scale-95"><Icon name={copied ? "check" : "content_copy"} className={`text-[18px] ${copied ? "text-primary-fixed" : ""}`} /></button>
                    </div>
                    <p className="text-[11px] text-on-surface-variant/60 flex items-center gap-1"><Icon name="info" className="text-[14px]" /> לינק חד-פעמי · {entryType === "free" ? "כניסה חינם" : "כניסה מוזלת"} · {qty} כרטיס{qty > 1 ? "ים" : ""}</p>
                    <button onClick={shareLink} className="w-full bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"><Icon name="share" className="text-[18px]" /> שלח ללקוח</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

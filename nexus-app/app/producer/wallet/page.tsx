"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { createWithdrawalRequest } from "@/lib/withdrawals";

type Txn = { icon: string; label: string; date: string; amount: string; positive: boolean; pending?: boolean };
type Account = { bank: string; last4: string };
type Modal = { type: "withdraw" | "transfer" | "account"; title: string };

const initialTxns: Txn[] = [
  { icon: "confirmation_number", label: "מכירת כרטיסים - Cyber Rave", date: "12 יוני, 2024", amount: "+₪4,250.00", positive: true },
  { icon: "share", label: "עמלת יח\"צ - Summer Fest", date: "10 יוני, 2024", amount: "+₪840.00", positive: true },
  { icon: "outbound", label: "משיכה לחשבון בנק", date: "08 יוני, 2024", amount: "-₪2,500.00", positive: false },
  { icon: "confirmation_number", label: "מכירת כרטיסים - Neon Jungle", date: "05 יוני, 2024", amount: "+₪1,120.00", positive: true },
];

const BANKS = [
  "בנק לאומי (10)", "בנק הפועלים (12)", "בנק דיסקונט (11)", "מזרחי טפחות (20)",
  "הבינלאומי הראשון (31)", "בנק מרכנתיל דיסקונט (17)", "בנק יהב (04)", "בנק אגוד (13)",
  "בנק ירושלים (54)", "וואן זירו (18)", "אחר",
];

const shekel = (n: number) => `₪${n.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ProducerWalletPage() {
  const [balance] = useState(14582.4);
  const [txns, setTxns] = useState<Txn[]>(initialTxns);
  const [accounts, setAccounts] = useState<Account[]>([{ bank: "בנק לאומי (10)", last4: "8291" }]);
  const [modal, setModal] = useState<Modal | null>(null);

  // Shared (transfer / account) fields
  const [amount, setAmount] = useState("");
  const [party, setParty] = useState("");
  const [last4, setLast4] = useState("");

  // Withdrawal request form
  const [wAmount, setWAmount] = useState("");
  const [holder, setHolder] = useState("");
  const [idnum, setIdnum] = useState("");
  const [bank, setBank] = useState(BANKS[0]);
  const [branch, setBranch] = useState("");
  const [account, setAccount] = useState("");
  const [contact, setContact] = useState("");
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [wError, setWError] = useState<string | null>(null);

  const open = (type: Modal["type"], title: string) => {
    setModal({ type, title });
    setAmount(""); setParty(""); setLast4("");
    setWAmount(""); setHolder(""); setIdnum(""); setBank(BANKS[0]); setBranch(""); setAccount(""); setContact("");
    setTerms(false); setSent(false); setWError(null);
  };
  const close = () => setModal(null);
  const today = new Date().toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" });

  // Transfer / add-account confirm (immediate, demo)
  const confirm = () => {
    if (!modal) return;
    if (modal.type === "account") {
      if (!party.trim()) return;
      setAccounts((a) => [...a, { bank: party.trim(), last4: last4.trim().slice(-4) || "0000" }]);
      return close();
    }
    const amt = Number(amount);
    if (!amt || amt <= 0) return;
    const label = `${modal.title}${party.trim() ? " · " + party.trim() : ""}`;
    setTxns((t) => [{ icon: "send", label, date: today, amount: `-${shekel(amt)}`, positive: false }, ...t]);
    close();
  };

  // Withdrawal request validation
  const wAmt = Number(wAmount);
  const wValid =
    wAmt > 0 && wAmt <= balance &&
    holder.trim().length > 1 &&
    idnum.trim().length >= 5 &&
    branch.trim().length >= 2 &&
    account.trim().length >= 3 &&
    terms;

  const submitWithdrawal = async () => {
    if (!wValid) return;
    setSubmitting(true); setWError(null);
    const res = await createWithdrawalRequest({ amount: wAmt, holder, idnum, bank, branch, account, contact });
    setSubmitting(false);
    if (!res.ok) { setWError(res.error || "שליחת הבקשה נכשלה. נסו שוב."); return; }
    // Pending entry in the activity feed (balance only drops once the admin pays).
    setTxns((t) => [{ icon: "hourglass_top", label: `בקשת משיכה · ${bank}`, date: today, amount: `−${shekel(wAmt)}`, positive: false, pending: true }, ...t]);
    setSent(true);
  };

  const exportReport = () => {
    const lines = [["תיאור", "תאריך", "סכום"], ...txns.map((t) => [t.label, t.date, t.amount])];
    const csv = "﻿" + lines.map((l) => l.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url; a.download = "nexus-wallet-report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const actions = [
    { icon: "send", label: "העברה לחבר", onClick: () => open("transfer", "העברה לחבר") },
    { icon: "campaign", label: "העברה ליחצן", onClick: () => open("transfer", "העברה ליחצן") },
    { icon: "local_shipping", label: "העברה לספק", onClick: () => open("transfer", "העברה לספק") },
    { icon: "account_balance", label: "הוספת חשבון", onClick: () => open("account", "הוספת חשבון בנק") },
    { icon: "description", label: "הפקת דוחות", onClick: exportReport },
  ];

  const field = "w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none";

  return (
    <main className="pt-10 md:pt-12 pb-32 px-margin-mobile md:px-margin-desktop">
      <h1 className="text-lg font-bold text-primary-fixed mb-4">הארנק שלי · הכנסות מפיק</h1>

      <section className="mb-6 text-center rounded-2xl p-5 glass-card border-primary-fixed/20 max-w-2xl">
        <h2 className="text-label-md text-on-surface-variant mb-1">יתרה זמינה למשיכה</h2>
        <div className="text-3xl font-extrabold text-primary-fixed neon-glow mb-4">{shekel(balance)}</div>
        <button onClick={() => open("withdraw", "בקשת משיכה")} className="bg-primary-fixed text-on-primary-fixed text-label-md font-bold px-8 py-2.5 rounded-full shadow-neon-primary active:scale-95 transition-transform flex items-center justify-center gap-2 mx-auto w-full max-w-xs">
          <Icon name="payments" className="text-[18px]" /> בקשת משיכה
        </button>
      </section>

      {/* Quick actions — transfers */}
      <section className="mb-6 max-w-2xl overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          {actions.map((a) => (
            <button key={a.label} onClick={a.onClick} className="flex flex-col items-center justify-center p-3 rounded-xl glass-card w-24 h-24 hover:border-primary-fixed/50 transition-all active:scale-90 shrink-0">
              <Icon name={a.icon} className="text-primary-fixed mb-1.5 text-2xl" />
              <span className="text-label-sm text-on-surface text-center">{a.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-6 max-w-2xl">
        <h3 className="text-base font-bold text-on-surface mb-3">חשבונות בנק למשיכה</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {accounts.map((acc, i) => (
            <button key={i} onClick={() => open("withdraw", "בקשת משיכה")} className="p-4 rounded-xl glass-card flex items-center justify-between border-r-4 border-r-primary-fixed text-right hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-fixed">
                  <Icon name="account_balance" className="text-2xl" />
                </div>
                <div>
                  <p className="text-label-md text-on-surface">{acc.bank}</p>
                  <p className="text-label-sm text-on-surface-variant font-mono">•••• {acc.last4}</p>
                </div>
              </div>
              <Icon name="chevron_left" className="text-on-surface-variant" />
            </button>
          ))}
          <button onClick={() => open("account", "הוספת חשבון בנק")} className="p-4 rounded-xl border border-dashed border-outline/30 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
            <Icon name="add_circle" className="text-primary-fixed text-xl" />
            <span className="text-label-md text-on-surface-variant">הוספת חשבון בנק חדש</span>
          </button>
        </div>
      </section>

      <section className="max-w-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-on-surface">פעולות אחרונות</h3>
          <button onClick={exportReport} className="text-label-sm text-primary-fixed flex items-center gap-1 hover:underline"><Icon name="download" className="text-[16px]" /> ייצוא</button>
        </div>
        <div className="space-y-2">
          {txns.map((t, i) => (
            <div key={i} className="glass-card p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${t.pending ? "bg-secondary-fixed/10 text-secondary-fixed" : t.positive ? "bg-primary-fixed/10 text-primary-fixed" : "bg-surface-container-highest text-on-surface-variant"}`}>
                  <Icon name={t.icon} className="text-[18px]" />
                </div>
                <div>
                  <p className="text-label-md text-on-surface">{t.label}</p>
                  <p className="text-label-sm text-on-surface-variant">{t.date}{t.pending ? " · ממתין לאישור" : ""}</p>
                </div>
              </div>
              <p className={`text-label-md font-bold ${t.pending ? "text-secondary-fixed" : t.positive ? "text-primary-fixed" : "text-on-surface-variant"}`}>{t.amount}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Action modal */}
      {modal && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
          <div className="relative glass-card w-full max-w-md rounded-2xl p-5 border border-primary-fixed/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-primary">{modal.title}</h3>
              <button onClick={close} className="text-on-surface-variant hover:text-on-surface"><Icon name="close" /></button>
            </div>

            {/* ── Withdrawal request form ── */}
            {modal.type === "withdraw" ? (
              sent ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-primary-fixed/15 flex items-center justify-center mx-auto mb-4">
                    <Icon name="task_alt" className="text-primary-fixed text-4xl" fill />
                  </div>
                  <h4 className="text-headline-md text-primary mb-2">הבקשה נשלחה!</h4>
                  <p className="text-body-md text-on-surface-variant mb-4 leading-relaxed">
                    בקשת המשיכה על סך <span className="text-primary-fixed font-bold">{shekel(wAmt)}</span> נשלחה למנהל הפלטפורמה.
                    לאחר אישור וביצוע ההעברה תצורף אסמכתא ותעודכן ב"פעולות אחרונות".
                  </p>
                  <button onClick={close} className="w-full bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg active:scale-95 shadow-neon-primary">סגירה</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-label-sm text-on-surface-variant leading-relaxed">
                    מלא/י את פרטי החשבון להעברה בנקאית. הבקשה תישלח למנהל הפלטפורמה לאישור וביצוע ההעברה.
                  </p>

                  {/* Amount */}
                  <div>
                    <label className="text-[11px] text-on-surface-variant block mb-1">סכום למשיכה</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xl text-primary-fixed">₪</span>
                      <input value={wAmount} onChange={(e) => setWAmount(e.target.value)} type="number" min={1} max={balance} placeholder="0.00" className={`${field} text-lg`} />
                    </div>
                    <p className="text-label-sm text-on-surface-variant mt-1">יתרה זמינה: {shekel(balance)}</p>
                  </div>

                  <div className="h-px bg-white/10 my-1" />
                  <p className="text-label-sm text-primary-fixed-dim uppercase tracking-wider flex items-center gap-1.5"><Icon name="account_balance" className="text-[16px]" /> פרטי החשבון להעברה</p>

                  <div>
                    <label className="text-[11px] text-on-surface-variant block mb-1">שם בעל החשבון (מוטב)</label>
                    <input value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="שם מלא כפי שמופיע בבנק" className={field} />
                  </div>
                  <div>
                    <label className="text-[11px] text-on-surface-variant block mb-1">ת.ז / ח.פ</label>
                    <input value={idnum} onChange={(e) => setIdnum(e.target.value)} inputMode="numeric" placeholder="מספר זהות או חברה" className={field} />
                  </div>
                  <div>
                    <label className="text-[11px] text-on-surface-variant block mb-1">בנק</label>
                    <select value={bank} onChange={(e) => setBank(e.target.value)} className={`${field} appearance-none`}>
                      {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-on-surface-variant block mb-1">מספר סניף</label>
                      <input value={branch} onChange={(e) => setBranch(e.target.value)} inputMode="numeric" placeholder="000" className={`${field} font-mono`} dir="ltr" />
                    </div>
                    <div>
                      <label className="text-[11px] text-on-surface-variant block mb-1">מספר חשבון</label>
                      <input value={account} onChange={(e) => setAccount(e.target.value)} inputMode="numeric" placeholder="000000" className={`${field} font-mono`} dir="ltr" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-on-surface-variant block mb-1">טלפון / אימייל ליצירת קשר (אופציונלי)</label>
                    <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="להבהרות לפני ביצוע ההעברה" className={field} />
                  </div>

                  {/* Terms checkbox */}
                  <label className="flex items-start gap-3 p-3 rounded-lg bg-primary-fixed/5 border border-primary-fixed/20 cursor-pointer">
                    <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-0.5 w-5 h-5 accent-primary-fixed shrink-0" />
                    <span className="text-label-sm text-on-surface-variant leading-relaxed">
                      אני מאשר/ת שפרטי החשבון נכונים ומדויקים, ומסכים/ה ל<span className="text-primary-fixed">תנאי המשיכה</span> — ההעברה תבוצע לחשבון שצוין בלבד, בכפוף לאימות מנהל הפלטפורמה, תוך עד 3 ימי עסקים.
                    </span>
                  </label>

                  {wAmt > balance && <p className="text-error text-label-sm flex items-center gap-1"><Icon name="error" className="text-[14px]" fill /> הסכום עולה על היתרה הזמינה</p>}
                  {wError && <p className="text-error text-label-sm flex items-center gap-1"><Icon name="error" className="text-[14px]" fill /> {wError}</p>}

                  <button onClick={submitWithdrawal} disabled={!wValid || submitting} className="w-full mt-1 bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 transition-all disabled:opacity-40 disabled:shadow-none">
                    {submitting ? <>שולח… <Icon name="sync" className="animate-spin text-[18px]" /></> : <><Icon name="send" className="text-[18px]" /> שליחת בקשת משיכה</>}
                  </button>
                </div>
              )
            ) : (
              /* ── Transfer / add-account ── */
              <>
                <div className="space-y-3">
                  {modal.type === "account" ? (
                    <>
                      <input value={party} onChange={(e) => setParty(e.target.value)} placeholder="שם הבנק (לדוגמה: בנק הפועלים)" className={field} />
                      <input value={last4} onChange={(e) => setLast4(e.target.value)} inputMode="numeric" placeholder="4 ספרות אחרונות" maxLength={4} className={`${field} font-mono`} />
                    </>
                  ) : (
                    <>
                      <input value={party} onChange={(e) => setParty(e.target.value)} placeholder="שם המקבל" className={field} />
                      <div className="flex items-center gap-2">
                        <span className="text-xl text-primary-fixed">₪</span>
                        <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min={1} placeholder="סכום" className={`${field} text-lg`} />
                      </div>
                      <p className="text-label-sm text-on-surface-variant">יתרה זמינה: {shekel(balance)}</p>
                    </>
                  )}
                </div>
                <button onClick={confirm} className="w-full mt-4 bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 transition-all">
                  <Icon name="check_circle" className="text-[18px]" fill /> אישור
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

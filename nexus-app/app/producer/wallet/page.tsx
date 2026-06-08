"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

type Txn = { icon: string; label: string; date: string; amount: string; positive: boolean };
type Account = { bank: string; last4: string };
type Modal = { type: "withdraw" | "transfer" | "account"; title: string };

const initialTxns: Txn[] = [
  { icon: "confirmation_number", label: "מכירת כרטיסים - Cyber Rave", date: "12 יוני, 2024", amount: "+₪4,250.00", positive: true },
  { icon: "share", label: "עמלת יח\"צ - Summer Fest", date: "10 יוני, 2024", amount: "+₪840.00", positive: true },
  { icon: "outbound", label: "משיכה לחשבון בנק", date: "08 יוני, 2024", amount: "-₪2,500.00", positive: false },
  { icon: "confirmation_number", label: "מכירת כרטיסים - Neon Jungle", date: "05 יוני, 2024", amount: "+₪1,120.00", positive: true },
];

const shekel = (n: number) => `₪${n.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ProducerWalletPage() {
  const [balance, setBalance] = useState(14582.4);
  const [txns, setTxns] = useState<Txn[]>(initialTxns);
  const [accounts, setAccounts] = useState<Account[]>([{ bank: "בנק לאומי (10)", last4: "8291" }]);
  const [modal, setModal] = useState<Modal | null>(null);
  const [amount, setAmount] = useState("");
  const [party, setParty] = useState("");
  const [last4, setLast4] = useState("");

  const open = (type: Modal["type"], title: string) => { setModal({ type, title }); setAmount(""); setParty(""); setLast4(""); };
  const close = () => setModal(null);
  const today = new Date().toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" });

  const confirm = () => {
    if (!modal) return;
    if (modal.type === "account") {
      if (!party.trim()) return;
      setAccounts((a) => [...a, { bank: party.trim(), last4: last4.trim().slice(-4) || "0000" }]);
      return close();
    }
    const amt = Number(amount);
    if (!amt || amt <= 0) return;
    setBalance((b) => b - amt);
    const label = modal.type === "withdraw" ? "משיכה לחשבון בנק" : `${modal.title}${party.trim() ? " · " + party.trim() : ""}`;
    setTxns((t) => [{ icon: modal.type === "withdraw" ? "outbound" : "send", label, date: today, amount: `-${shekel(amt)}`, positive: false }, ...t]);
    close();
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
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${t.positive ? "bg-primary-fixed/10 text-primary-fixed" : "bg-surface-container-highest text-on-surface-variant"}`}>
                  <Icon name={t.icon} className="text-[18px]" />
                </div>
                <div>
                  <p className="text-label-md text-on-surface">{t.label}</p>
                  <p className="text-label-sm text-on-surface-variant">{t.date}</p>
                </div>
              </div>
              <p className={`text-label-md font-bold ${t.positive ? "text-primary-fixed" : "text-on-surface-variant"}`}>{t.amount}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Action modal */}
      {modal && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
          <div className="relative glass-card w-full max-w-sm rounded-2xl p-5 border border-primary-fixed/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-primary">{modal.title}</h3>
              <button onClick={close} className="text-on-surface-variant hover:text-on-surface"><Icon name="close" /></button>
            </div>

            <div className="space-y-3">
              {modal.type === "account" ? (
                <>
                  <input value={party} onChange={(e) => setParty(e.target.value)} placeholder="שם הבנק (לדוגמה: בנק הפועלים)" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none" />
                  <input value={last4} onChange={(e) => setLast4(e.target.value)} inputMode="numeric" placeholder="4 ספרות אחרונות" maxLength={4} className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface font-mono focus:border-primary-fixed outline-none" />
                </>
              ) : (
                <>
                  {modal.type === "transfer" && (
                    <input value={party} onChange={(e) => setParty(e.target.value)} placeholder="שם המקבל" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none" />
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xl text-primary-fixed">₪</span>
                    <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min={1} placeholder="סכום" className="flex-1 bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface text-lg focus:border-primary-fixed outline-none" />
                  </div>
                  <p className="text-label-sm text-on-surface-variant">יתרה זמינה: {shekel(balance)}</p>
                </>
              )}
            </div>

            <button onClick={confirm} className="w-full mt-4 bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 transition-all">
              <Icon name="check_circle" className="text-[18px]" fill /> אישור
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

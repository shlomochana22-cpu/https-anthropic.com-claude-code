"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

type ScanResult = {
  status: "valid" | "duplicate" | "invalid";
  name: string;
  tier?: string;
  gate?: string;
  scannedAt?: string;
};

export default function ScannerPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function scan(input: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: input }),
      });
      setResult(await res.json());
    } finally {
      setBusy(false);
    }
  }

  const ok = result?.status === "valid";

  return (
    <main className="relative min-h-screen flex flex-col pt-10 md:pt-12 pb-32 px-margin-mobile">
      <h1 className="text-headline-md font-extrabold text-primary-fixed neon-text mb-1">NEXUS Scanner</h1>
      <p className="text-[10px] text-on-surface-variant/80 uppercase tracking-widest mb-8">Main Event 2024</p>

      {/* Scan frame */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-primary-fixed/20 rounded-xl" />
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-fixed rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-fixed rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-fixed rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-fixed rounded-br-lg" />
          <div className="text-center">
            <Icon name="qr_code_scanner" className="text-primary-fixed/40 text-6xl animate-pulse" />
            <p className="text-label-md text-primary-fixed/60 mt-4 tracking-widest">Scanning...</p>
          </div>
        </div>

        {/* Manual entry */}
        <div className="w-full max-w-xs mt-12">
          <label className="text-[10px] font-bold text-primary-fixed uppercase tracking-tighter mb-1 block">Manual Ticket ID</label>
          <div className="relative">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && code && scan(code)}
              placeholder="NX-XXXX-XXXX"
              className="w-full bg-surface-container-high border-b-2 border-outline/30 text-white px-4 py-3 rounded-t-lg focus:outline-none focus:border-primary-fixed transition-all text-center font-mono tracking-widest"
            />
            <button
              onClick={() => code && scan(code)}
              disabled={busy || !code}
              className="absolute left-2 bottom-2 text-primary-fixed hover:bg-primary-fixed/10 p-1 rounded-full transition-colors disabled:opacity-40"
            >
              <Icon name="send" />
            </button>
          </div>
          <button
            onClick={() => scan("NX-DEMO-0001")}
            className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white flex items-center justify-center gap-2"
          >
            <Icon name="bolt" /> סריקת דמו
          </button>
        </div>
      </div>

      {/* Result overlay */}
      {result && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="text-center p-8">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div
                className={`flex items-center justify-center w-full h-full rounded-full ${
                  ok ? "bg-primary-fixed shadow-[0_0_30px_rgba(191,245,32,0.6)]" : "bg-error shadow-[0_0_30px_rgba(255,180,171,0.6)]"
                }`}
              >
                <Icon name={ok ? "check" : "close"} className={`text-6xl font-bold ${ok ? "text-black" : "text-on-error"}`} />
              </div>
            </div>
            <h2 className={`text-headline-lg mb-2 ${ok ? "text-primary-fixed" : "text-error"}`}>
              {ok ? "כניסה אושרה" : result.status === "duplicate" ? "כניסה כפולה" : "כרטיס לא תקין"}
            </h2>
            <p className="text-headline-md text-white font-extrabold mb-1">{result.name}</p>
            {result.tier && (
              <div className="flex items-center justify-center gap-1 text-label-md text-on-surface-variant">
                <Icon name="star" className="text-[16px] text-primary-fixed" fill />
                <span>{result.tier}{result.gate ? ` • ${result.gate}` : ""}</span>
              </div>
            )}
            {result.scannedAt && <p className="text-label-md text-on-surface-variant">נסרק לאחרונה: {result.scannedAt}</p>}
            <button
              onClick={() => { setResult(null); setCode(""); }}
              className={`mt-8 px-10 py-3 font-bold rounded-full hover:scale-105 active:scale-95 transition-all ${ok ? "bg-primary-fixed text-black" : "bg-error text-on-error"}`}
            >
              סריקה הבאה
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

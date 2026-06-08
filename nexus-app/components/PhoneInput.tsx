"use client";

import { useEffect, useState } from "react";

const CODES = [
  { flag: "🇮🇱", dial: "+972", label: "ישראל" },
  { flag: "🇺🇸", dial: "+1", label: "ארה״ב" },
  { flag: "🇬🇧", dial: "+44", label: "בריטניה" },
  { flag: "🇫🇷", dial: "+33", label: "צרפת" },
  { flag: "🇩🇪", dial: "+49", label: "גרמניה" },
  { flag: "🇪🇸", dial: "+34", label: "ספרד" },
  { flag: "🇮🇹", dial: "+39", label: "איטליה" },
  { flag: "🇷🇺", dial: "+7", label: "רוסיה" },
  { flag: "🇺🇦", dial: "+380", label: "אוקראינה" },
  { flag: "🇦🇪", dial: "+971", label: "איחוד האמירויות" },
  { flag: "🇹🇷", dial: "+90", label: "טורקיה" },
  { flag: "🇬🇷", dial: "+30", label: "יוון" },
];

/** Phone input with a country-code selector (defaults to +972). Emits "<dial> <number>". */
export function PhoneInput({
  value,
  onChange,
  placeholder = "מספר טלפון",
  inputClassName = "",
}: {
  value: string;
  onChange: (full: string) => void;
  placeholder?: string;
  inputClassName?: string;
}) {
  const [dial, setDial] = useState("+972");
  const [num, setNum] = useState("");

  // Allow parents to reset the field by clearing `value`.
  useEffect(() => { if (!value) setNum(""); }, [value]);

  const emit = (d: string, n: string) => onChange(n.trim() ? `${d} ${n.trim()}` : "");

  return (
    <div className="flex gap-2" dir="ltr">
      <select
        value={dial}
        onChange={(e) => { setDial(e.target.value); emit(e.target.value, num); }}
        aria-label="קידומת מדינה"
        className="shrink-0 bg-surface-container-low border border-white/10 rounded-lg px-2 py-2.5 text-on-surface focus:border-primary-fixed outline-none"
      >
        {CODES.map((c) => (
          <option key={c.dial} value={c.dial}>{c.flag} {c.dial}</option>
        ))}
      </select>
      <input
        value={num}
        onChange={(e) => { setNum(e.target.value); emit(dial, e.target.value); }}
        type="tel"
        inputMode="tel"
        placeholder={placeholder}
        className={`flex-1 min-w-0 bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none ${inputClassName}`}
      />
    </div>
  );
}

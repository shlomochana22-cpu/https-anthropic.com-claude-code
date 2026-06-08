"use client";

import { useState } from "react";
import { Icon } from "./Icon";

/** Copies a promoter's personal referral link for an event, with feedback. */
export function CopyLinkButton({ eventId }: { eventId: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const link = `https://nexusevents.co.il/events/${eventId}?ref=promoter`;
    navigator.clipboard?.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="w-full bg-surface-container-high border border-white/10 text-primary py-sm rounded-lg text-label-md flex items-center justify-center gap-2 active:scale-95 transition-transform hover:border-primary-fixed/40">
      <Icon name={copied ? "check" : "content_copy"} className={`text-[18px] ${copied ? "text-primary-fixed" : ""}`} />
      {copied ? "הלינק הועתק!" : "העתק לינק"}
    </button>
  );
}

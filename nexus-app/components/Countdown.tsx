"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

/** "Tickets reserved for you" countdown banner. */
export function Countdown({ minutes = 10 }: { minutes?: number }) {
  const [t, setT] = useState(minutes * 60 - 1);
  useEffect(() => {
    const id = setInterval(() => setT((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(t / 60)).padStart(2, "0");
  const ss = String(t % 60).padStart(2, "0");
  return (
    <div className="mb-md flex flex-col items-center justify-center p-4 rounded-xl glass-card border-primary-fixed/20">
      <p className="text-label-sm text-on-surface-variant mb-2">הכרטיסים שמורים עבורך למשך</p>
      <div className="flex items-center gap-2 text-primary-fixed animate-pulse">
        <Icon name="alarm" className="text-2xl" />
        <span className="text-headline-md font-mono">{mm}:{ss}</span>
      </div>
    </div>
  );
}

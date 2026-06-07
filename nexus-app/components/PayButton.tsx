"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";

export function PayButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "processing">("idle");

  const pay = () => {
    setState("processing");
    setTimeout(() => router.push(`/confirmation?event=${eventId}`), 1500);
  };

  return (
    <button
      onClick={pay}
      disabled={state === "processing"}
      className="w-full h-16 bg-primary-fixed text-on-primary-fixed text-headline-md font-bold rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_30px_rgba(191,245,32,0.4)] disabled:opacity-70"
    >
      {state === "processing" ? (
        <>
          מעבד תשלום... <Icon name="sync" className="animate-spin" />
        </>
      ) : (
        <>
          בצע תשלום מאובטח <Icon name="lock" />
        </>
      )}
    </button>
  );
}

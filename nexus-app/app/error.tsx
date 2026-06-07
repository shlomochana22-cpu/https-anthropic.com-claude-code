"use client";

import { Icon } from "@/components/Icon";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-margin-mobile text-center">
      <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center mb-6">
        <Icon name="error" className="text-error text-4xl" />
      </div>
      <h1 className="text-headline-md text-white mb-2">משהו השתבש</h1>
      <p className="text-on-surface-variant max-w-xs mb-8">
        נתקלנו בתקלה זמנית. נסה שוב — ואם זה חוזר, רענן את העמוד.
      </p>
      <button
        onClick={reset}
        className="bg-primary-fixed text-on-primary-fixed font-bold py-4 px-8 rounded-full inline-flex items-center gap-2 shadow-neon-primary active:scale-95 transition-all"
      >
        <Icon name="refresh" /> נסה שוב
      </button>
    </main>
  );
}

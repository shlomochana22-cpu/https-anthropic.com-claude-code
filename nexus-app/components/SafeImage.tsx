"use client";

import { useState } from "react";

/**
 * Image with a branded gradient fallback. Protects the app if a remote image
 * (e.g. the Google aida-public CDN) ever fails to load or is empty.
 */
export function SafeImage({
  src,
  alt = "",
  className = "",
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`${className} bg-gradient-to-br from-surface-container-high via-surface-container to-black flex items-center justify-center`}
      >
        <span className="material-symbols-outlined text-primary-fixed/40 text-4xl">celebration</span>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img src={src} alt={alt} className={className} onError={() => setFailed(true)} loading="lazy" />
  );
}

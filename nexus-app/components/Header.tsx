import Link from "next/link";
import { Icon } from "./Icon";

/** Shared top app bar. `back` shows an arrow that links to a given href. */
export function Header({ back }: { back?: string }) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-3">
        {back ? (
          <Link href={back} className="text-primary-fixed active:scale-95 transition-transform">
            <Icon name="arrow_forward" />
          </Link>
        ) : (
          <Link href="/" className="text-primary-fixed active:scale-95 transition-transform">
            <Icon name="menu" />
          </Link>
        )}
      </div>
      <Link
        href="/"
        className="text-headline-md font-extrabold tracking-tighter text-primary-fixed neon-text"
      >
        NEXUS
      </Link>
      <Link
        href="/profile"
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed/30"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="פרופיל"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDCsm1aAO_urDc-jXRS8c0WVRHSbicgoVzGJJYMHJI0T_NySw-u-JILhRpFPawiex4Yiy0PoH9x3Qn3FAywMdQgCZ1s6mSEMEo-fKpOnzJBer-gOgpW1rUZjRoS7IChASa3pWjrpKNuBLTLMO3LHTfFkawTnFTFJfR1V1THMMnz_6z1_s--ASMj_NnQNF5CPtHluJ3UF8X0gcqWj_i6pxOluMk33zmbfrJSKvemj2tvV27UfiUUC4xPUuZ171DPnAuE9IlrIjb0Q"
        />
      </Link>
    </header>
  );
}

import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-margin-mobile text-center relative">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-primary-fixed/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-fixed/6 blur-[120px] rounded-full" />
      </div>
      <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center mb-6">
        <Icon name="wrong_location" className="text-primary-fixed text-4xl neon-glow" />
      </div>
      <h1 className="text-headline-xl text-primary-fixed neon-text mb-2">404</h1>
      <p className="text-headline-md text-white mb-2">הדף לא נמצא</p>
      <p className="text-on-surface-variant max-w-xs mb-8">
        כנראה שהמסיבה עברה למקום אחר. בוא נחזיר אותך לרחבה.
      </p>
      <Link
        href="/"
        className="bg-primary-fixed text-on-primary-fixed font-bold py-4 px-8 rounded-full inline-flex items-center gap-2 shadow-neon-primary active:scale-95 transition-all"
      >
        <Icon name="explore" /> חזרה לגילוי
      </Link>
    </main>
  );
}

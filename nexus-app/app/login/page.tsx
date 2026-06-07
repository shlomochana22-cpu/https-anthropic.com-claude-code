import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-margin-mobile relative">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-fixed/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-fixed/5 blur-[120px] rounded-full" />
      </div>

      <div className="flex items-center gap-2 mb-lg">
        <Icon name="bolt" className="text-primary-fixed text-3xl" />
        <span className="text-headline-md font-extrabold tracking-tighter text-primary-fixed neon-text">NEXUS</span>
        <span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-widest">PRO</span>
      </div>

      <div className="text-center mb-lg">
        <h1 className="text-headline-xl text-primary tracking-tight">כניסת מפיקים</h1>
        <p className="text-body-lg text-on-surface-variant max-w-[320px] mx-auto mt-2">
          נהל את האירועים, המכירות והקהל שלך במקום אחד.
        </p>
      </div>

      <form className="w-full max-w-[440px] glass rounded-xl p-md flex flex-col gap-md">
        <div className="space-y-2">
          <label className="block text-label-sm uppercase tracking-widest text-on-surface-variant mr-1">כתובת אימייל</label>
          <div className="relative border border-outline-variant/40 bg-surface-container-lowest rounded-lg focus-within:border-primary-fixed focus-within:shadow-neon-primary transition-all">
            <input type="email" required placeholder="name@nexus.co.il" className="w-full bg-transparent border-none focus:ring-0 py-4 px-md text-body-md text-primary outline-none" />
            <Icon name="alternate_email" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-label-sm uppercase tracking-widest text-on-surface-variant">סיסמה</label>
            <a className="text-label-sm text-primary-fixed hover:underline" href="#">שכחתי סיסמה?</a>
          </div>
          <div className="relative border border-outline-variant/40 bg-surface-container-lowest rounded-lg focus-within:border-primary-fixed focus-within:shadow-neon-primary transition-all">
            <input type="password" required placeholder="••••••••" className="w-full bg-transparent border-none focus:ring-0 py-4 px-md text-body-md text-primary outline-none" />
            <Icon name="lock" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" />
          </div>
        </div>
        <Link
          href="/producer"
          className="w-full bg-primary-fixed text-on-primary-fixed py-4 rounded-lg text-headline-md text-center shadow-neon-primary mt-2 hover:bg-primary-fixed-dim transition-colors"
        >
          כניסה למערכת
        </Link>
        <p className="text-center text-body-md text-on-surface-variant mt-2">
          עדיין אין לך חשבון מפיק?{" "}
          <a className="text-primary-fixed font-bold hover:underline" href="#">הגש בקשה</a>
        </p>
      </form>
    </main>
  );
}

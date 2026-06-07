import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { Icon } from "./Icon";

/** Temporary placeholder for screens not yet converted from the static mockups. */
export function StubPage({ title, icon }: { title: string; icon: string }) {
  return (
    <>
      <Header />
      <main className="pt-20 pb-32 px-margin-mobile max-w-2xl mx-auto min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center mb-6">
          <Icon name={icon} className="text-primary-fixed text-4xl neon-glow" />
        </div>
        <h1 className="text-headline-lg text-primary-fixed mb-2">{title}</h1>
        <p className="text-on-surface-variant max-w-xs">
          המסך הזה בהמרה ל-React. הגרסה הסטטית המלאה זמינה בתיקיית{" "}
          <code className="text-primary-fixed">screens/</code>.
        </p>
      </main>
      <BottomNav />
    </>
  );
}

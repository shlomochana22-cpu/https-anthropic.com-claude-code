export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-primary-fixed/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-fixed animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary-fixed">bolt</span>
        </div>
      </div>
      <span className="text-primary-fixed font-extrabold tracking-tighter neon-text">NEXUS</span>
    </div>
  );
}

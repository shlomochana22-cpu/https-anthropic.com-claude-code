import { ProducerSidebar, ProducerBottomNav } from "@/components/ProducerNav";

export default function ProducerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProducerSidebar />
      <div className="md:mr-[280px] min-h-screen">{children}</div>
      <ProducerBottomNav />
    </>
  );
}

export const dynamic = "force-dynamic";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileHeader } from "@/components/dashboard/MobileHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <MobileHeader />
      <main className="lg:pl-60 pt-14 lg:pt-0">{children}</main>
    </div>
  );
}

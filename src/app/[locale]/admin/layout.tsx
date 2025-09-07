// src/app/[locale]/admin/layout.tsx - NEW FILE
import AdminGate from "@/components/AdminGate";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminGate>{children}</AdminGate>;
}

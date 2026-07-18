import AdminShell from "@/components/admin/AdminShell";

export const metadata = { title: "Admin — Veritas by IQgrads" };

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}

import AdminDashboard from "@/components/admin/AdminDashboard";

// The parent password gate intentionally defers this page until entry.
export const instant = false;

export default function AdminPage() {
  return <AdminDashboard />;
}

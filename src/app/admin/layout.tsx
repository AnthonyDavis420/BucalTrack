import type { ReactNode } from "react";
import AdminSidebar from "@components/sidebars/AdminSidebar"; // adjust path if needed

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar on the left */}
      <AdminSidebar />

      {/* Page content on the right */}
      <main className="flex-1 bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}

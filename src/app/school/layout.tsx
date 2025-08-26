// src/app/school/layout.tsx
import type { ReactNode } from "react";
import SchoolSidebar from "@components/sidebars/SchoolSidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar on the left */}
      <SchoolSidebar />

      {/* Page content on the right */}
      <main className="flex-1 bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}

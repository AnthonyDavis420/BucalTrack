// src/components/sidebars/AdminSidebar.tsx
"use client";

import { useRouter } from "next/navigation";
import BaseSidebar from "./BaseSidebar";
import { NAV_BY_ROLE, NAV_ITEMS } from "@lib/nav.config";

export default function AdminSidebar() {
  const router = useRouter();

  // Get the nav keys for admin role
  const keys = NAV_BY_ROLE?.admin ?? [];

  // Map the keys to full nav item objects
  const items = keys.map((k) => NAV_ITEMS[k]).filter(Boolean);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return <BaseSidebar items={items as any} onLogout={handleLogout} />;
}

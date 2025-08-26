// components/sidebars/StaffSidebar.tsx
"use client";

import { useRouter } from "next/navigation";
import BaseSidebar from "./BaseSidebar";
import { NAV_BY_ROLE, NAV_ITEMS } from "@lib/nav.config";

export default function StaffSidebar() {
  const router = useRouter();
  const items = NAV_BY_ROLE.staff.map((k) => NAV_ITEMS[k]);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  return <BaseSidebar items={items} onLogout={handleLogout} />;
}

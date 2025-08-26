// components/sidebars/CoachSidebar.tsx
"use client";

import { useRouter } from "next/navigation";
import BaseSidebar from "./BaseSidebar";
import { NAV_BY_ROLE, NAV_ITEMS } from "@lib/nav.config";

export default function CoachSidebar() {
  const router = useRouter();
  const items = NAV_BY_ROLE.coach.map((k) => NAV_ITEMS[k]);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  return <BaseSidebar items={items} onLogout={handleLogout} />;
}

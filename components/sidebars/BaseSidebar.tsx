"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@lib/nav.config";
import {
  Megaphone,
  CalendarDays,
  Users2,
  BarChart3,
  Archive,
  LifeBuoy,
  Shield,
  LogOut,
  Home,
  UserCheck,
  ClipboardList,
  Trophy,   // 👈 add this
} from "lucide-react";


type Item = (typeof NAV_ITEMS)[keyof typeof NAV_ITEMS];

const ICONS: Record<string, React.ElementType> = {
  home_admin: Home,
  events_admin: CalendarDays,
  sports_admin: Trophy,        // 👈 add this line
  teams_admin: Users2,
  analytics_admin: BarChart3,
  seasons_admin: Archive,
  user_management_admin: Shield,
  player_screening_admin: UserCheck,
  support_admin: LifeBuoy,

  announcements_school: Megaphone,
  events_school: CalendarDays,
  teams_school: ClipboardList,
  support_school: LifeBuoy,
};


export default function BaseSidebar({
  items,
  greeting = "Hello, Admin!",
  seasonLabel = "Season 7",
  onLogout,
}: {
  items: Item[];
  greeting?: string;
  seasonLabel?: string;
  onLogout?: () => void;
}) {
  const pathname = usePathname();

  // 👇 Hydration-safe guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return null; // or return a skeleton sidebar if you want SSR fallback
  }

  return (
    <aside className="w-56 md:w-64 h-screen border-r bg-white flex flex-col">
      {/* Top: logo + greeting */}
      <div className="px-4 pt-6 pb-3">
        <div className="flex justify-center">
          <Image
            src="/BucalLeagueLogo.png"
            alt="BUCAL League"
            width={88}
            height={88}
            className="h-40 w-40 object-contain"
            priority
          />
        </div>

        <div className="mt-3 text-center">
          <p className="text-xl font-semibold">{greeting}</p>
          <p className="text-xs text-gray-500">{seasonLabel}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-2 md:px-3 space-y-1 overflow-y-auto">
        {items.map((it) => {
          // find icon by key (falls back to a dot)
          const Icon =
            ICONS[
              (Object.keys(NAV_ITEMS) as string[]).find(
                (k) => NAV_ITEMS[k as keyof typeof NAV_ITEMS] === it
              ) ?? ""
            ] ??
            (() => (
              <span className="inline-block h-2 w-2 rounded-full bg-gray-400" />
            ));

          const active =
            pathname === it.href ||
            (it.href !== "/admin" && pathname?.startsWith(it.href + "/"));

          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                active
                  ? "bg-gray-100 font-medium"
                  : "hover:bg-gray-50 text-gray-700",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{it.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Logout */}
      <div className="mt-auto px-2 md:px-3 pb-4 pt-3">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

"use client";

import { useState } from "react";
import { ShieldCheck, Users, GraduationCap, Trophy, type LucideIcon } from "lucide-react";
import type { Role } from "@lib/nav.config";

// Strongly-typed items array (no 'as Role' needed)
const items: ReadonlyArray<{ key: Role; label: string; Icon: LucideIcon }> = [
  { key: "admin",  label: "Admin",  Icon: ShieldCheck },
  { key: "staff",  label: "Staff",  Icon: Users },
  { key: "school", label: "School", Icon: GraduationCap },
  { key: "coach",  label: "Coach",  Icon: Trophy },
];

export type { Role }; // re-export for parent forms

export default function RoleToggle({
  value,
  onChange,
}: {
  value?: Role;
  onChange?: (r: Role) => void;
}) {
  const [role, setRole] = useState<Role>(value ?? "admin");

  function handleClick(r: Role) {
    setRole(r);
    onChange?.(r);
  }

  return (
    <div
      className="inline-flex w-full rounded-xl bg-gray-200 p-1 overflow-hidden"
      role="tablist"
      aria-label="Select role"
    >
      {items.map(({ key, label, Icon }) => {
        const active = role === key;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => handleClick(key)}
            className={[
              "flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium transition",
              // let the container handle the rounding; prevents clipping/overlap
              active ? "bg-white text-gray-900" : "text-gray-600 hover:text-gray-800",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
            ].join(" ")}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2 : 1.5} />
            <span className="whitespace-nowrap">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

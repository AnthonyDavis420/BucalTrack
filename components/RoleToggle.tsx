'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Trophy,
} from 'lucide-react';

const items = [
  { key: 'Admin', label: 'Admin', Icon: ShieldCheck },
  { key: 'Staff', label: 'Staff', Icon: Users },
  { key: 'School', label: 'School', Icon: GraduationCap },
  { key: 'Coach', label: 'Coach', Icon: Trophy },
] as const;

type Role = (typeof items)[number]['key'];
export type { Role };              // export for parent forms

export default function RoleToggle({
  value,
  onChange,
}: {
  value?: Role;
  onChange?: (r: Role) => void;
}) {
  const [role, setRole] = useState<Role>(value ?? 'Admin');

  function handleClick(r: Role) {
    setRole(r);
    onChange?.(r);
  }

  return (
    <div className="flex rounded-xl bg-gray-200 p-1">
      {items.map(({ key, label, Icon }) => {
        const active = role === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => handleClick(key)}
            className={`flex items-center gap-1.5 whitespace-nowrap
              px-4 py-2 rounded-lg text-sm font-medium transition
              ${active
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-800'}`}
          >
            <Icon size={16} strokeWidth={active ? 2 : 1.5} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

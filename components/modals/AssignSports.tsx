"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Sport = string;

export default function AssignSports({
  open,
  title = "Select Sports",
  options,
  selected: selectedIn,
  onChange,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  options: Sport[];
  selected: Sport[];
  onChange: (next: Sport[]) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [local, setLocal] = useState<Sport[]>([]);

  // Seed local only when modal (re)opens
  useEffect(() => {
    if (open) setLocal(selectedIn);
  }, [open]); // <-- IMPORTANT: do not depend on selectedIn here

  const toggle = (s: Sport) => {
    const next = local.includes(s) ? local.filter(x => x !== s) : [...local, s];
    setLocal(next);
    onChange(next); // notify parent without causing an effect loop
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[95%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-50" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <ul className="space-y-2">
            {options.map((s) => (
              <li key={s}>
                <button
                  onClick={() => toggle(s)}
                  className="w-full text-left px-1 py-2 border-b border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={local.includes(s)} readOnly className="h-4 w-4" />
                    <span className="text-sm">{s}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <div className="pt-6 flex justify-center">
            <button
              onClick={onConfirm}
              className="rounded-md bg-[#071689] text-white px-5 py-2 text-sm hover:opacity-90"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
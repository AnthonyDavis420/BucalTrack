"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

export type AddCoachPayload = {
  name: string;
  email: string;
  accessCode: string;
};

type Mode = "add" | "edit";

export default function AddCoach({
  open,
  mode = "add",
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode?: Mode; // "add" | "edit"
  initial?: Partial<AddCoachPayload> | null; // prefill for edit
  onClose: () => void;
  onSubmit: (payload: AddCoachPayload) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setEmail(initial?.email ?? "");
      setAccessCode((initial?.accessCode ?? generate(8)).toUpperCase());
      setError(null);
    }
  }, [open, initial]);

  function generate(len = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let out = "";
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  const canSubmit = useMemo(() => {
    const validEmail = /.+@.+\..+/.test(email);
    return name.trim().length > 0 && validEmail && accessCode.trim().length === 8;
  }, [name, email, accessCode]);

  const submit = () => {
    if (!canSubmit) {
      setError("Please complete all required fields correctly.");
      return;
    }
    onSubmit({ name: name.trim(), email: email.trim(), accessCode: accessCode.trim().toUpperCase() });
  };

  if (!open) return null;
  const title = mode === "edit" ? "Add New Coach" : "Add New Coach"; // label per screenshot
  const cta = mode === "edit" ? "Create Coach" : "Create Coach"; // keep same per mock

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal card */}
      <div className="absolute left-1/2 top-1/2 w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-50" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-[120px,1fr] items-center gap-3">
            <label className="text-sm text-gray-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#071689]"
            />

            <label className="text-sm text-gray-700">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#071689]"
            />

            <label className="text-sm text-gray-700">Access Code :</label>
            <div className="flex items-center gap-2">
              <input
                value={accessCode}
                maxLength={8}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#071689]"
              />
              <button
                onClick={() => setAccessCode(generate(8))}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Generate
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        <div className="flex items-center justify-center gap-4 px-6 pb-6 pt-2">
          <button onClick={onClose} className="rounded-md border border-gray-300 px-5 py-2 text-sm hover:bg-gray-50">Cancel</button>
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="rounded-md bg-[#071689] text-white px-5 py-2 text-sm hover:opacity-90 disabled:opacity-50"
          >
            {cta}
          </button>
        </div>
      </div>
    </div>
  );
}
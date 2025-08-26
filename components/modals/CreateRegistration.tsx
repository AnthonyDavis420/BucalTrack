"use client";

import { X, CalendarClock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function CreateRegistrationModal({
  open,
  sports,
  onClose,
  onCreate,
}: {
  open: boolean;
  sports: string[];
  onClose: () => void;
  onCreate: (payload: { sport: string; deadlineISO: string }) => void;
}) {
  const [sport, setSport] = useState<string>("");
  const [deadline, setDeadline] = useState<string>(""); // HTML date value

  useEffect(() => {
    if (open) {
      setSport((prev) => prev || sports[0] || "");
      setDeadline("");
    }
  }, [open, sports]);

  const canSubmit = useMemo(() => {
    return Boolean(sport && deadline);
  }, [sport, deadline]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-black/30"
        aria-hidden
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="w-[560px] max-w-[95%] bg-white shadow-2xl border rounded-xl animate-in zoom-in duration-200 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Create Team Registration</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 overflow-y-auto">
            {/* Sport */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wide text-gray-500">
                Sport
              </label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#071689]"
              >
                {sports.length === 0 && <option value="">No sports available</option>}
                {sports.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wide text-gray-500">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#071689]"
              />
              <p className="text-xs text-gray-500">
                Teams can submit until this date.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={() =>
                onCreate({
                  sport,
                  // parse as midnight UTC ISO for consistency
                  deadlineISO: new Date(deadline).toISOString(),
                })
              }
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                canSubmit
                  ? "bg-[#071689] hover:bg-[#1A2DB3]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

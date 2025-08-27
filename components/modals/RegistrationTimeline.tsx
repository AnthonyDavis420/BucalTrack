"use client";

import { X, Clock } from "lucide-react";

/* ========= Types ========= */
type TimelineEntry = {
  status: "Draft" | "Pending" | "Approved" | "Rejected";
  timestamp: string; // e.g. "2025-08-11 09:05"
  actor: string; // e.g. "Coach Ana Lim"
  remarks?: string;
};

type RegistrationTimelineProps = {
  teamName: string;
  sport: string;
  timeline: TimelineEntry[];
  onClose: () => void;
};

/* ========= Status Colors ========= */
const statusColors: Record<string, string> = {
  Draft: "bg-gray-100 text-gray-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

/* ========= Modal ========= */
export default function RegistrationTimeline({
  teamName,
  sport,
  timeline,
  onClose,
}: RegistrationTimelineProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Submission Timeline
            </h2>
            <p className="text-sm text-gray-500">
              {teamName} – {sport}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Timeline */}
        <div className="mt-6 space-y-6">
          {timeline.length === 0 && (
            <p className="text-sm text-gray-500">
              No submission history available yet.
            </p>
          )}

          {timeline.map((entry, idx) => (
            <div key={idx} className="relative pl-8">
              {/* Line indicator */}
              {idx !== timeline.length - 1 && (
                <span className="absolute left-3.5 top-4 h-full w-px bg-gray-300"></span>
              )}

              {/* Dot (cleaner, outlined) */}
              <span className="absolute left-2 top-2 h-4 w-4 rounded-full border-2 border-[#071689] bg-white"></span>

              {/* Content */}
              <div>
                <span
                  className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${statusColors[entry.status]}`}
                >
                  {entry.status}
                </span>
                <div className="mt-1 text-sm text-gray-700">
                  {entry.actor}
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {entry.timestamp}
                </div>
                {entry.remarks && (
                  <p className="mt-1 text-xs text-gray-600">
                    Remarks: {entry.remarks}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#071689] px-4 py-2 text-sm font-medium text-white hover:bg-[#1A2DB3]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

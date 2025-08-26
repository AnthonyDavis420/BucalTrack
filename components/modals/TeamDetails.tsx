"use client";

import { ArrowLeft, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

/* ========= Tiny Toast (white, auto-hide after 6s, close on outside click) ========= */
function Toast({
  open,
  title,
  description,
  variant = "info",
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
  onClose: () => void;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    // Auto-close after 6 seconds
    const autoCloseTimer = setTimeout(() => {
      onClose();
    }, 6000);

    const onDocClick = (e: MouseEvent) => {
      const box = boxRef.current;
      if (!box) return;
      // Close only if the *click* happens outside the toast box.
      if (!box.contains(e.target as Node)) onClose();
    };

    document.addEventListener("click", onDocClick, true);

    return () => {
      clearTimeout(autoCloseTimer);
      document.removeEventListener("click", onDocClick, true);
    };
  }, [open, onClose]);

  if (!open) return null;

  let classes = "bg-white text-gray-900 border border-gray-200";
  if (variant === "error") classes = "bg-red-50 text-red-700 border border-red-200";
  if (variant === "success") classes = "bg-green-50 text-green-700 border border-green-200";

  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      <div
        ref={boxRef}
        className={`${classes} rounded-lg shadow-lg px-4 py-3 min-w-[260px]`}
      >
        <div className="font-semibold">{title}</div>
        {description && <div className="text-sm mt-1">{description}</div>}
        <button
          onClick={onClose}
          className="mt-2 text-xs underline underline-offset-2 text-gray-500"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

/* ========= Types ========= */
type ReviewStatus = "Pending" | "Under Review" | "Approved" | "Rejected";

type Player = {
  id: string;
  name: string;
  yearCourse: string;
  birthdate: string;
  jerseyNumber: number | null;
  position: string;
  isBicolano: boolean;
  isTransferee: boolean;
  lastSchool?: string;
  yearsPlayed: number;
};

type Team = {
  id: string;
  teamName: string;
  schoolName: string;
  schoolPresident: string;
  athleticsDirector: string;
  headCoach: string;
  assistantCoach?: string;
  headCoachESignUrl?: string;
  players: Player[];
  submittedAt: string;
  status: ReviewStatus;
};

/* ========= Small UI bits ========= */
function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-sm text-gray-900">{value ?? "—"}</div>
    </div>
  );
}

/* ========= 2:3 Placeholder (SVG data URI) ========= */
const PLACEHOLDER_2X3 =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200">
      <defs>
        <pattern id="p" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#f3f4f6"/>
          <path d="M0 24 L24 0 M-6 6 L6 -6 M18 30 L30 18" stroke="#e5e7eb" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="800" height="1200" fill="url(#p)"/>
      <rect x="2" y="2" width="796" height="1196" fill="none" stroke="#d1d5db" stroke-width="4"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="600">2:3</text>
    </svg>`
  );

export function TeamDetails({
  team,
  sport,
  onClose,
  onSetStatus,
}: {
  team: Team;
  sport: string;
  onClose: () => void;
  onSetStatus: (teamId: string, status: ReviewStatus, reason?: string) => void | Promise<void>;
}) {
  if (!team) return null;

  const [showDeclineInput, setShowDeclineInput] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const [toast, setToast] = useState<{
    open: boolean;
    title: string;
    desc?: string;
    variant?: "success" | "error" | "info";
  }>({ open: false, title: "" });

  const showToast = (
    title: string,
    desc?: string,
    variant: "success" | "error" | "info" = "info"
  ) => setToast({ open: true, title, desc, variant });

  const declineRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (showDeclineInput) {
      declineRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => declineRef.current?.focus(), 150);
    }
  }, [showDeclineInput]);

  const trimmed = declineReason.trim();
  const declineTooShort = trimmed.length < 10;
  const declineTooLong = trimmed.length > 300;
  const declineInvalid = declineTooShort || declineTooLong;

  const handleSubmitDecline = () => {
    if (declineInvalid) return;
    const res = onSetStatus(team.id, "Rejected", trimmed);
    Promise.resolve(res)
      .then(() => {
        showToast("Team Declined", "Coach will receive your note.", "info");
        setShowDeclineInput(false);
        setDeclineReason("");
      })
      .catch(() =>
        showToast("Failed to decline team", "Please try again.", "error")
      );
  };

  const handleApprove = () => {
    const res = onSetStatus(team.id, "Approved");
    Promise.resolve(res)
      .then(() => {
        showToast("Team Approved", undefined, "success");
      })
      .catch(() =>
        showToast("Failed to approve team", "Please try again.", "error")
      );
  };

  return (
    <div className="fixed inset-0 z-40">
      <button className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="w-[860px] max-w-[95%] bg-white shadow-2xl border rounded-xl animate-in zoom-in duration-200 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{team.teamName}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {sport} • {team.schoolName}
              </p>
              <div className="mt-2 text-xs">
                Status: <strong>{team.status}</strong>
              </div>
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
          <div className="p-6 space-y-8 overflow-y-auto grow">
            {/* Registration Info */}
            <section className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900">Registration Info</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="School Name" value={team.schoolName} />
                <Field label="School Pres" value={team.schoolPresident} />
                <Field label="Athletics Director" value={team.athleticsDirector} />
                <Field label="Head Coach" value={team.headCoach} />
                <Field label="Assistant Coach" value={team.assistantCoach || "—"} />
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-gray-500">
                    Head Coach E-sign
                  </div>
                  <div className="mt-1">
                    {team.headCoachESignUrl ? (
                      <img
                        src={team.headCoachESignUrl}
                        alt="Head Coach E-sign"
                        className="h-16 w-auto rounded-md border object-contain bg-white"
                      />
                    ) : (
                      <div className="text-sm text-gray-400">No e-sign provided</div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Players */}
            <section className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900">Players</h4>
              <div className="space-y-3">
                {team.players.map((p) => (
                  <div key={p.id} className="rounded-xl border p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      {/* 2:3 image (placeholder) */}
                      <div className="w-full sm:w-56">
                        <div className="relative w-full rounded-md border bg-gray-50 overflow-hidden pt-[150%]">
                          <img
                            src={PLACEHOLDER_2X3}
                            alt={`${p.name} (2:3)`}
                            className="absolute inset-0 h-full w-full object-cover"
                            draggable={false}
                          />
                        </div>
                        <div className="mt-2 text-[11px] text-gray-500 text-center">
                          Placeholder • 2:3 (e.g., 800×1200)
                        </div>
                      </div>

                      {/* Name + years */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="text-base font-semibold text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-500">
                            Years in BUCAL:{" "}
                            <span className="font-medium text-gray-800">{p.yearsPlayed}</span>
                          </div>
                        </div>

                        {/* Fields */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <Field label="Year & Course" value={p.yearCourse} />
                          <Field label="Birthdate" value={p.birthdate} />
                          <Field label="Jersey #" value={p.jerseyNumber ?? "—"} />
                          <Field label="Position" value={p.position || "—"} />
                          <Field label="Is Bicolano" value={p.isBicolano ? "Yes" : "No"} />
                          <Field
                            label="Transferee"
                            value={
                              p.isTransferee
                                ? `Yes — ${p.lastSchool ?? "Last school not specified"}`
                                : "No"
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {!team.players.length && (
                  <div className="rounded-xl border p-4 text-sm text-gray-500">
                    No players submitted yet.
                  </div>
                )}
              </div>
            </section>

            {/* Decline Reason Input */}
            {showDeclineInput && (
              <section className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Reason for Declining
                </label>
                <textarea
                  ref={declineRef}
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  rows={3}
                  maxLength={350}
                  className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring ${
                    declineInvalid ? "border-red-400 focus:ring-red-200" : "focus:ring-red-200"
                  }`}
                  placeholder="Enter reason here (10–300 characters)"
                  aria-invalid={declineInvalid}
                />
                <div className="text-xs">
                  <span className={declineTooShort ? "text-red-600" : "text-gray-500"}>
                    {Math.max(0, 10 - trimmed.length)} more characters required
                  </span>
                  <span className="text-gray-400"> • </span>
                  <span className={declineTooLong ? "text-red-600" : "text-gray-500"}>
                    {Math.max(0, 300 - trimmed.length)} remaining (max 300)
                  </span>
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Teams
            </button>
            <div className="flex items-center gap-2">
              {!showDeclineInput ? (
                <button
                  onClick={() => setShowDeclineInput(true)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Decline
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowDeclineInput(false);
                      setDeclineReason("");
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    aria-label="Cancel Decline"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleSubmitDecline}
                    disabled={declineInvalid}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Submit Decline
                  </button>
                </>
              )}
              <button
                onClick={handleApprove}
                disabled={showDeclineInput}
                className="rounded-lg bg-[#071689] px-4 py-2 text-sm font-medium text-white hover:bg-[#1A2DB3] disabled:opacity-50"
              >
                Accept
              </button>
            </div>
          </div>

          {/* Toast */}
          <Toast
            open={toast.open}
            title={toast.title}
            description={toast.desc}
            variant={toast.variant}
            onClose={() => setToast((s) => ({ ...s, open: false }))}
          />
        </div>
      </div>
    </div>
  );
}

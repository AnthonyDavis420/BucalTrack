"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { X, FileText } from "lucide-react";

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

    const autoCloseTimer = setTimeout(() => {
      onClose();
    }, 6000);

    const onDocClick = (e: MouseEvent) => {
      const box = boxRef.current;
      if (!box) return;
      if (!box.contains(e.target as Node)) onClose();
    };

    document.addEventListener("click", onDocClick, true);

    return () => {
      clearTimeout(autoCloseTimer);
      document.removeEventListener("click", onDocClick, true);
    };
  }, [open, onClose]);

  if (!open) return null;

  // Neutral white by default; subtle color for success/error
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
type DocStatus = "Pending" | "Verified" | "Flagged" | "Not Submitted";
type DocType =
  | "Birth Certificate"
  | "School Matriculation"
  | "School ID"
  | "Transcript of Grades"
  | "Medical Certificate";

type PlayerDoc = { type: DocType; url?: string; status: DocStatus };

type ReviewStatus = "Pending" | "Approved" | "Rejected";

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
  docs: PlayerDoc[];
};

type Team = {
  id: string;
  teamName: string;
  sport: string;
  schoolCode: string;
  schoolName: string;
  players: Player[];
};

/* ========= UI bits ========= */
function DocPill({ status }: { status: DocStatus }) {
  const cls =
    status === "Verified"
      ? "bg-green-100 text-green-700"
      : status === "Flagged"
      ? "bg-red-100 text-red-700"
      : status === "Pending"
      ? "bg-amber-100 text-amber-700"
      : "bg-gray-100 text-gray-600";
  return <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${cls}`}>{status}</span>;
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-sm text-gray-900">{value ?? "—"}</div>
    </div>
  );
}

function StatusPill({ s }: { s: ReviewStatus }) {
  const map: Record<ReviewStatus, string> = {
    Pending: "bg-gray-100 text-gray-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${map[s]}`}>{s}</span>
  );
}

/* ========= Player Detail ========= */
function PlayerDetail({
  player,
  teamMeta,
  status,
  note,
  showDeclineInput,
  declineReason,
  setDeclineReason,
  declineTooShort,
  declineTooLong,
  declineInvalid,
}: {
  player: Player;
  teamMeta: string;
  status: ReviewStatus;
  note?: string;
  showDeclineInput: boolean;
  declineReason: string;
  setDeclineReason: (v: string) => void;
  declineTooShort: boolean;
  declineTooLong: boolean;
  declineInvalid: boolean;
}) {
  const declineRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (showDeclineInput) {
      declineRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => declineRef.current?.focus(), 120);
    }
  }, [showDeclineInput]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{player.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{teamMeta}</p>
          <div className="mt-2">
            <StatusPill s={status} />
          </div>
          {status === "Rejected" && note && (
            <div className="mt-2 text-xs text-red-600">Reason: {note}</div>
          )}
        </div>
      </div>

      {/* Player info */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Year & Course" value={player.yearCourse} />
        <Field label="Birthdate" value={player.birthdate} />
        <Field label="Jersey #" value={player.jerseyNumber ?? "—"} />
        <Field label="Position" value={player.position || "—"} />
        <Field label="Is Bicolano" value={player.isBicolano ? "Yes" : "No"} />
        <Field
          label="Transferee"
          value={player.isTransferee ? `Yes — ${player.lastSchool ?? "N/A"}` : "No"}
        />
        <Field label="Years in BUCAL" value={player.yearsPlayed} />
      </section>

      {/* Documents */}
      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900">Submitted Documents</h4>
        <div className="space-y-2">
          {player.docs.map((d, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border p-3">
              <div className="text-sm text-gray-800">{d.type}</div>
              <div className="flex items-center gap-3">
                <DocPill status={d.status} />
                {d.url ? (
                  <Link
                    href={d.url}
                    target="_blank"
                    className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                  >
                    View
                  </Link>
                ) : (
                  <span className="text-xs text-gray-400">No file</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Decline reason */}
      {showDeclineInput && (
        <section className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Reason for Declining</label>
          <textarea
            ref={declineRef}
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            rows={3}
            maxLength={350}
            className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:ring ${
              declineInvalid ? "border-red-400 focus:ring-red-200" : "focus:ring-red-200"
            }`}
            placeholder="Enter message here (10–300 characters)"
            aria-invalid={declineInvalid}
          />
          <div className="text-xs">
            <span className={declineTooShort ? "text-red-600" : "text-gray-500"}>
              {Math.max(0, 10 - declineReason.trim().length)} more characters required
            </span>
            <span className="text-gray-400"> • </span>
            <span className={declineTooLong ? "text-red-600" : "text-gray-500"}>
              {Math.max(0, 300 - declineReason.trim().length)} remaining (max 300)
            </span>
          </div>
        </section>
      )}
    </div>
  );
}

/* ========= Main Modal ========= */
interface TeamPlayersModalProps {
  team: Team;
  isOpen: boolean;
  onClose: () => void;
  reviews: Record<string, { status: ReviewStatus; note?: string }>;
  onApprovePlayer: (playerId: string) => void | Promise<void>;
  onDeclinePlayer: (playerId: string, note: string) => void | Promise<void>;
}

export default function TeamPlayersModal({
  team,
  isOpen,
  onClose,
  reviews,
  onApprovePlayer,
  onDeclinePlayer,
}: TeamPlayersModalProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
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

  useEffect(() => {
    setShowDeclineInput(false);
    setDeclineReason("");
  }, [selectedPlayer]);

  if (!isOpen) return null;

  const getPlayerStatus = (id: string): ReviewStatus => reviews[id]?.status ?? "Pending";
  const getPlayerNote = (id: string): string | undefined => reviews[id]?.note;

  const handleSubmitDecline = () => {
    if (!selectedPlayer) return;
    const trimmed = declineReason.trim();
    if (trimmed.length < 10 || trimmed.length > 300) return;

    Promise.resolve(onDeclinePlayer(selectedPlayer.id, trimmed))
      .then(() => {
        showToast("Declined", "Coach will receive your note.", "info");
        setShowDeclineInput(false);
        setDeclineReason("");
      })
      .catch(() => showToast("Failed to decline", "Please try again.", "error"));
  };

  const handleApprove = () => {
    if (!selectedPlayer) return;
    Promise.resolve(onApprovePlayer(selectedPlayer.id))
      .then(() => showToast("Approved", "Player marked as approved.", "success"))
      .catch(() => showToast("Failed to approve", "Please try again.", "error"));
  };

  const trimmed = declineReason.trim();
  const declineTooShort = trimmed.length < 10;
  const declineTooLong = trimmed.length > 300;
  const declineInvalid = declineTooShort || declineTooLong;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-[940px] max-w-[95%] bg-white shadow-2xl border rounded-xl animate-in zoom-in duration-200 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b">
            <div>
              <div className="text-sm text-gray-500">
                {team.schoolName} • {team.sport}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{team.teamName}</h3>
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
          <div className="p-6 overflow-y-auto grow">
            {!selectedPlayer ? (
              team.players.length === 0 ? (
                <div className="rounded-xl border bg-white p-5 text-sm text-gray-500">
                  No players submitted yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {team.players.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => setSelectedPlayer(player)}
                      className="w-full text-left rounded-xl border bg-white shadow-sm p-5 hover:shadow-md transition"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-base font-semibold text-gray-900">
                              {player.name}
                            </div>
                            <StatusPill s={getPlayerStatus(player.id)} />
                          </div>
                          <div className="mt-1 text-sm text-gray-500">{player.yearCourse}</div>
                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                            <FileText className="h-4 w-4" />
                            {player.docs.filter((d) => d.status === "Verified").length}/
                            {player.docs.length} verified
                          </div>
                          {getPlayerStatus(player.id) === "Rejected" &&
                            getPlayerNote(player.id) && (
                              <div className="mt-2 text-xs text-red-600">
                                Reason: {getPlayerNote(player.id)}
                              </div>
                            )}
                        </div>
                        <div className="md:min-w-[220px]">
                          <div className="inline-flex w-full items-center justify-center rounded-lg bg-[#071689] px-4 py-2.5 text-sm font-medium text-white">
                            View Documents
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )
            ) : (
              <PlayerDetail
                player={selectedPlayer}
                teamMeta={`${team.teamName} • ${team.schoolName} • ${team.sport}`}
                status={getPlayerStatus(selectedPlayer.id)}
                note={getPlayerNote(selectedPlayer.id)}
                showDeclineInput={showDeclineInput}
                declineReason={declineReason}
                setDeclineReason={setDeclineReason}
                declineTooShort={declineTooShort}
                declineTooLong={declineTooLong}
                declineInvalid={declineInvalid}
              />
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex flex-col sm:flex-row sm:justify-between gap-3">
            {!selectedPlayer ? (
              <span />
            ) : (
              <button
                onClick={() => setSelectedPlayer(null)}
                className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Back to Players
              </button>
            )}
            {!selectedPlayer ? (
              <button
                onClick={onClose}
                className="rounded-lg bg-[#071689] px-4 py-2 text-sm font-medium text-white"
              >
                Done
              </button>
            ) : (
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
                  Approve
                </button>
              </div>
            )}
          </div>

          {/* Toast (white, auto-closes after 6s; closes on outside click) */}
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
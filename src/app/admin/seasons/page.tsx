"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import CreateSeasonModal, { CreateSeasonInput } from "@components/modals/CreateSeason";

/* ---------- Types ---------- */
type SeasonStatus = "active" | "ended" | "upcoming";

type Season = {
  id: number;
  slug: string;
  title: string;
  img: string;
  status: SeasonStatus;
  startDate?: string;
  endDate?: string;
};

/* ---------- Seed ---------- */
const SEED: Season[] = [
  { id: 4, slug: "s4", title: "Season 4", img: "/bucals4.png", status: "ended",    startDate: "2022-01-10", endDate: "2022-09-20" },
  { id: 5, slug: "s5", title: "Season 5", img: "/bucals5.png", status: "ended",    startDate: "2023-01-12", endDate: "2023-09-22" },
  { id: 6, slug: "s6", title: "Season 6", img: "/bucals6.png", status: "ended",    startDate: "2024-01-12", endDate: "2024-09-22" },
  { id: 7, slug: "s7", title: "Season 7", img: "/bucals7.png", status: "active",   startDate: "2025-01-15" },
];

/* ---------- Small UI bits ---------- */
function StatusPill({ s }: { s: SeasonStatus }) {
  const map: Record<SeasonStatus, string> = {
    active:   "bg-blue-100 text-blue-700",
    ended:    "bg-gray-100 text-gray-700",
    upcoming: "bg-amber-100 text-amber-700",
  };
  const label = s === "active" ? "Active" : s === "ended" ? "Ended" : "Upcoming";
  return <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${map[s]}`}>{label}</span>;
}

/* ---------- Main Page ---------- */
export default function PastSeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>(SEED);

  // menus / modals
  const [menuFor, setMenuFor] = useState<number | null>(null);
  const [editing, setEditing] = useState<Season | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const setSeason = (id: number, patch: Partial<Season>) =>
    setSeasons(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));

  const removeSeason = (id: number) => setSeasons(prev => prev.filter(s => s.id !== id));

  const handleCreate = (data: CreateSeasonInput) => {
    setSeasons(prev => {
      const nextId = (prev.reduce((max, s) => Math.max(max, s.id), 0) || 0) + 1;

      // If new season is Active, end any currently active one (visual only)
      const normalizedPrev =
        data.status === "active"
          ? prev.map(s => (s.status === "active" ? { ...s, status: "ended" } : s))
          : prev;

      // derive a simple slug: "s{nextId}" OR from title like "Season 8" -> "s8"
      const match = data.title.trim().match(/season\s*(\d+)/i);
      const slug = match ? `s${match[1]}` : `s${nextId}`;

      const newSeason: Season = {
        id: nextId,
        slug,
        title: data.title.trim(),
        img: data.img || "/bucals7.png",
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
      };

      return [newSeason, ...normalizedPrev];
    });

    setShowCreate(false);
  };

  return (
    <div className="space-y-6 pt-8">
      {/* Header — matches other pages */}
      <header>
        <h1 className="text-3xl font-semibold text-gray-900">Past Seasons</h1>
        <p className="mt-2 text-sm text-gray-500">Select a season or use the menu to manage it.</p>
      </header>

      {/* Subheader row — like “All Events / All Sports” */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700">All Seasons</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-md bg-[#071689] px-4 py-2 text-sm font-medium text-white hover:opacity-95"
        >
          + Create Season
        </button>
      </div>

      {/* Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {seasons.map((s) => (
          <div
            key={s.id}
            className="group relative flex flex-col items-center rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300 transition p-6"
          >
            {/* Kebab (shows on hover) */}
            <button
              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition rounded-md p-1.5 hover:bg-gray-50"
              onClick={() => setMenuFor(menuFor === s.id ? null : s.id)}
              aria-label="Season actions"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" className="text-gray-600"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>
            </button>

            {/* Actions menu */}
            {menuFor === s.id && (
              <div className="absolute right-2 top-9 z-10 w-44 rounded-lg border border-gray-200 bg-white shadow-md p-1">
                <button
                  className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50"
                  onClick={() => { setEditing(s); setMenuFor(null); }}
                >
                  Edit details…
                </button>
                <button
                  className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50"
                  onClick={() => { 
                    const next = s.status === "ended" ? "upcoming" : "ended";
                    setSeason(s.id, { status: next }); 
                    setMenuFor(null); 
                  }}
                >
                  {s.status === "ended" ? "Mark as Upcoming" : "Mark as Ended"}
                </button>
                {s.status !== "active" && (
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50"
                    onClick={() => {
                      // ensure only this becomes active (visual only)
                      setSeasons(prev =>
                        prev.map(p =>
                          p.id === s.id
                            ? { ...p, status: "active" }
                            : { ...p, status: p.status === "active" ? "ended" : p.status }
                        )
                      );
                      setMenuFor(null);
                    }}
                  >
                    Set as Active (Current)
                  </button>
                )}
                <button
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  onClick={() => { if (confirm(`Delete ${s.title}?`)) removeSeason(s.id); setMenuFor(null); }}
                >
                  Delete
                </button>
              </div>
            )}

            {/* Logo */}
            <div className="w-40 h-40 flex items-center justify-center">
              <Image src={s.img} alt={s.title} width={160} height={160} className="object-contain" />
            </div>

            {/* Title + status */}
            <div className="mt-3 text-base font-semibold text-[#071689]">{s.title}</div>
            <div className="mt-1">
              <StatusPill s={s.status} />
            </div>
          </div>
        ))}
      </section>

      {/* Edit Modal (existing) */}
      {editing && (
        <EditSeasonModal
          season={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => {
            setSeason(editing.id, updated);
            if (updated.status === "active") {
              setSeasons(prev =>
                prev.map(p =>
                  p.id === editing.id
                    ? { ...p, status: "active" }
                    : { ...p, status: p.status === "active" ? "ended" : p.status }
                )
              );
            }
            setEditing(null);
          }}
        />
      )}

      {/* Create Modal (new component) */}
      {showCreate && (
        <CreateSeasonModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

/* ---------- Edit Modal (unchanged) ---------- */
function EditSeasonModal({
  season,
  onClose,
  onSave,
}: {
  season: Season;
  onClose: () => void;
  onSave: (patch: Partial<Season>) => void;
}) {
  const [title, setTitle] = useState(season.title);
  const [status, setStatus] = useState<SeasonStatus>(season.status);
  const [startDate, setStartDate] = useState(season.startDate || "");
  const [endDate, setEndDate] = useState(season.endDate || "");
  const [img, setImg] = useState(season.img);
  const fileRef = useRef<HTMLInputElement>(null);

  const invalidDates = useMemo(
    () => Boolean(startDate && endDate && startDate > endDate),
    [startDate, endDate]
  );

  const pickImage = () => fileRef.current?.click();
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImg(url);
  };

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      {/* Panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-[520px] max-w-[95%] rounded-xl border border-gray-200 bg-white shadow-2xl">
          <div className="border-b border-gray-200 px-5 py-4">
            <h3 className="text-base font-semibold text-gray-900">Edit Season</h3>
            <p className="mt-1 text-xs text-gray-500">Update details for {season.title}</p>
          </div>

          <div className="p-5 space-y-4">
            {/* Logo picker */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-md border border-gray-200 flex items-center justify-center bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="Season logo" className="max-h-full max-w-full object-contain" />
              </div>
              <div>
                <button
                  onClick={pickImage}
                  className="rounded-md border border-gray-200 hover:border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Change logo
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
                <div className="mt-1 text-xs text-gray-500">PNG/JPG/SVG</div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-gray-600">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Season 8"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-600">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SeasonStatus)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
              >
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
              </select>
              {status === "active" && (
                <div className="mt-1 text-[11px] text-blue-600">
                  Setting this as <b>Active</b> will end the currently active season (visual only).
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">Start date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">End date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            {invalidDates && (
              <div className="text-xs text-red-600">End date should be after start date.</div>
            )}
          </div>

          <div className="border-t border-gray-200 px-5 py-4 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-200 hover:border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave({ title, status, startDate, endDate, img })}
              disabled={invalidDates}
              className="rounded-md bg-[#071689] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

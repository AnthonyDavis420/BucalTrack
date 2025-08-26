"use client";

import { useMemo, useRef, useState } from "react";

type SeasonStatus = "active" | "ended" | "upcoming";

export type CreateSeasonInput = {
  title: string;
  img: string;
  status: SeasonStatus;
  startDate?: string;
  endDate?: string;
};

export default function CreateSeasonModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: CreateSeasonInput) => void;
}) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<SeasonStatus>("upcoming");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [img, setImg] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const invalidDates = useMemo(
    () => Boolean(startDate && endDate && startDate > endDate),
    [startDate, endDate]
  );

  const disabled =
    !title.trim() || invalidDates; // keep simple for now; image optional

  const pickImage = () => fileRef.current?.click();
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImg(url); // preview only (front-end)
  };

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      {/* Panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-[520px] max-w-[95%] rounded-xl border border-gray-200 bg-white shadow-2xl">
          <div className="border-b border-gray-200 px-5 py-4">
            <h3 className="text-base font-semibold text-gray-900">Create Season</h3>
            <p className="mt-1 text-xs text-gray-500">Add a new BUCAL season.</p>
          </div>

          <div className="p-5 space-y-4">
            {/* Logo picker */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-md border border-gray-200 flex items-center justify-center bg-white overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {img ? (
                  <img src={img} alt="Season logo" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-[11px] text-gray-500">No image</span>
                )}
              </div>
              <div>
                <button
                  onClick={pickImage}
                  className="rounded-md border border-gray-200 hover:border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Upload logo
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
              onClick={() =>
                onCreate({
                  title: title.trim(),
                  status,
                  startDate: startDate || undefined,
                  endDate: endDate || undefined,
                  img: img || "/bucals7.png", // fallback preview path
                })
              }
              disabled={disabled}
              className="rounded-md bg-[#071689] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Create season
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

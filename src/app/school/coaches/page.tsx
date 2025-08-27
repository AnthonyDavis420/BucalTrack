"use client";

import { useMemo, useState } from "react";
import { Plus, Edit, Trash2, Search, Clipboard, ClipboardCheck } from "lucide-react";
import AddCoach from "@components/modals/AddCoach";
import AssignSports from "@components/modals/AssignSports";

/* ========= Types ========= */
type Sport = string;

type Coach = {
  id: number;
  name: string;
  email: string;
  accessCode: string;
  sports: Sport[];
};

const ALL_SPORTS: Sport[] = ["Basketball - Junior", "Basketball - Senior's", "Volleyball Men"];

export default function Page() {
  const [coaches, setCoaches] = useState<Coach[]>([
    {
      id: 1,
      name: "Juan Dela Cruz",
      email: "juan@school.edu",
      accessCode: "AB12CD34",
      sports: ["Basketball - Junior"],
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@school.edu",
      accessCode: "EF56GH78",
      sports: ["Volleyball Men"],
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeCoach, setActiveCoach] = useState<Coach | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return coaches.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.accessCode.toLowerCase().includes(q) ||
        c.sports.some((s) => s.toLowerCase().includes(q));
      const matchesSport = !sportFilter || c.sports.some((s) => s.toLowerCase() === sportFilter);
      return matchesQuery && matchesSport;
    });
  }, [coaches, query, sportFilter]);

  const handleAddCoach = (data: { name: string; email: string; accessCode: string }) => {
    const newCoach: Coach = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      accessCode: data.accessCode,
      sports: [],
    };
    setCoaches([...coaches, newCoach]);
    setShowAddModal(false);
  };

  const handleEditCoach = (data: { name: string; email: string; accessCode: string }) => {
    if (!activeCoach) return;
    setCoaches(
      coaches.map((c) =>
        c.id === activeCoach.id ? { ...c, name: data.name, email: data.email, accessCode: data.accessCode } : c
      )
    );
    setShowEditModal(false);
    setActiveCoach(null);
  };

  const confirmDelete = () => {
    if (!activeCoach) return;
    setCoaches(coaches.filter((c) => c.id !== activeCoach.id));
    setShowDeleteModal(false);
    setActiveCoach(null);
  };

  const handleAssign = (coach: Coach) => {
    setActiveCoach(coach);
    setShowAssignModal(true);
  };

  const handleSaveSports = (sports: Sport[]) => {
    if (!activeCoach) return;
    setCoaches(coaches.map((c) => (c.id === activeCoach.id ? { ...c, sports } : c)));
    setShowAssignModal(false);
    setActiveCoach(null);
  };

  const copyCode = async (id: number, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch (_) {
      alert("Failed to copy");
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="pt-8">
        <h1 className="text-3xl font-semibold text-gray-900">Coaches</h1>
        <p className="mt-2 text-sm text-gray-500">Manage the coaches and assign them to sports.</p>
      </header>

      {/* Subheader row */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700">All Coaches</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#071689] text-white text-sm rounded-lg hover:bg-[#0a2099]"
        >
          <Plus className="h-4 w-4" />
          Add Coach
        </button>
      </div>

      {/* Search + Filter */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, access code, sport…"
            className="w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#071689]"
          />
        </div>
        <div className="relative w-full sm:w-56">
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="w-full appearance-none rounded-md border border-gray-300 bg-white pr-8 pl-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#071689]"
          >
            <option value="">All Sports</option>
            {ALL_SPORTS.map((s) => (
              <option key={s} value={s.toLowerCase()}>
                {s}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
        </div>
      </div>

      {/* Coaches Table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Access Code</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Sports</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filtered.map((coach) => (
              <tr key={coach.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{coach.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{coach.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-mono tracking-wider">{coach.accessCode}</span>
                    <button
                      onClick={() => copyCode(coach.id, coach.accessCode)}
                      className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50"
                      title="Copy access code"
                    >
                      {copiedId === coach.id ? (
                        <ClipboardCheck className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Clipboard className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex flex-wrap gap-2">
                    {coach.sports.length === 0 && <span className="text-gray-400 text-xs">No sports assigned</span>}
                    {coach.sports.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-1 text-xs"
                      >
                        {s}
                      </span>
                    ))}
                    <button
                      onClick={() => handleAssign(coach)}
                      className="inline-flex items-center rounded-full border border-dashed border-gray-300 px-2 py-0.5 text-xs hover:bg-gray-50"
                      title="Assign more sports"
                    >
                      + Add
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setActiveCoach(coach);
                        setShowEditModal(true);
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600"
                      title="Edit coach"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveCoach(coach);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-gray-600 hover:text-red-600"
                      title="Delete coach"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddCoach open={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddCoach} />

      <AddCoach
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditCoach}
        initial={
          activeCoach
            ? { name: activeCoach.name, email: activeCoach.email, accessCode: activeCoach.accessCode }
            : undefined
        }
      />

      <AssignSports
        open={showAssignModal}
        options={ALL_SPORTS}
        selected={activeCoach?.sports || []}
        onChange={(sports) => activeCoach && setActiveCoach({ ...activeCoach, sports })}
        onConfirm={() => handleSaveSports(activeCoach?.sports || [])}
        onClose={() => setShowAssignModal(false)}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && activeCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDeleteModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-lg">
            <div className="px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Coach</h3>
            </div>
            <div className="px-6 py-4 text-sm text-gray-700">
              Are you sure you want to delete <span className="font-medium">{activeCoach.name}</span>? This action cannot be undone.
            </div>
            <div className="flex justify-end gap-3 px-6 py-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

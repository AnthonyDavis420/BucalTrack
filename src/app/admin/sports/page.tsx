"use client";

import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import CreateSportModal from "@components/modals/CreateSport";
import EditSportModal from "@components/modals/EditSport";

interface Sport {
  id: number;
  name: string;
  description: string;
  requireJerseyNumber: boolean;
  requirePosition: boolean;
}

export default function SportsPage() {
  const [sports, setSports] = useState<Sport[]>([
    { 
      id: 1, 
      name: "Basketball", 
      description: "5v5 indoor sport",
      requireJerseyNumber: true,
      requirePosition: true
    },
    { 
      id: 2, 
      name: "Volleyball", 
      description: "6v6 court sport",
      requireJerseyNumber: true,
      requirePosition: true
    },
    { 
      id: 3, 
      name: "Cheer & Dance", 
      description: "Performance-based event",
      requireJerseyNumber: false,
      requirePosition: false
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSport, setEditingSport] = useState<Sport | null>(null);

  const handleCreateSport = (data: {
    name: string;
    description: string;
    requireJerseyNumber: boolean;
    requirePosition: boolean;
  }) => {
    const newSport: Sport = {
      id: Date.now(),
      name: data.name,
      description: data.description,
      requireJerseyNumber: data.requireJerseyNumber,
      requirePosition: data.requirePosition
    };

    setSports([...sports, newSport]);
    setShowCreateModal(false);
  };

  const handleEditSport = (data: {
    name: string;
    description: string;
    requireJerseyNumber: boolean;
    requirePosition: boolean;
  }) => {
    if (!editingSport) return;

    setSports(sports.map(sport => 
      sport.id === editingSport.id
        ? { 
            ...sport, 
            name: data.name, 
            description: data.description,
            requireJerseyNumber: data.requireJerseyNumber,
            requirePosition: data.requirePosition
          }
        : sport
    ));

    setShowEditModal(false);
    setEditingSport(null);
  };

  const openEditModal = (sport: Sport) => {
    setEditingSport(sport);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingSport(null);
  };

  const handleDelete = (id: number) => {
    setSports(sports.filter((s) => s.id !== id));
  };

  return (
    <div>
      {/* Header — match Player Screening */}
      <header className="pt-8">
        <h1 className="text-3xl font-semibold text-gray-900">Sports</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage the sports created by the admin.
        </p>
      </header>

      {/* Subheader row */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700">All Sports</h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#071689] text-white text-sm rounded-lg hover:bg-[#0a2099]"
        >
          <Plus className="h-4 w-4" />
          Add Sport
        </button>
      </div>

      {/* Sports Table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Description
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {sports.map((sport) => (
              <tr key={sport.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {sport.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {sport.description}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => openEditModal(sport)}
                      className="p-2 text-gray-600 hover:text-blue-600"
                      title="Edit sport"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sport.id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                      title="Delete sport"
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
      <CreateSportModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSport}
      />

      <EditSportModal
        isOpen={showEditModal}
        onClose={closeEditModal}
        onSubmit={handleEditSport}
        sport={editingSport}
      />
    </div>
  );
}

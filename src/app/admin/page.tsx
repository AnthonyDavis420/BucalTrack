"use client";

import { useState } from "react";
import CreateAnnouncementModal from "@components/modals/CreateAnnouncement";
import EditAnnouncementModal from "@components/modals/EditAnnouncement";

interface Announcement {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  audience: "all" | "schools_coaches";
  isPinned?: boolean;
}

export default function Page() {
  const canCreate = true; // just front-end toggle for now
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [filter, setFilter] = useState<"all" | "schools_coaches" | "show_all">("show_all");

  // Sample announcements data
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Document Submission Deadline",
      description:
        "All player documents must be submitted by December 8, 2024. Teams with incomplete documents will not be allowed to participate.",
      author: "Admin",
      createdAt: "2 days ago",
      audience: "schools_coaches",
      isPinned: true,
    },
    {
      id: "2",
      title: "Basketball Tournament Schedule Update",
      description:
        "The basketball tournament schedule has been updated. Please check the new dates and venues on the official tournament page.",
      author: "Admin",
      createdAt: "5 days ago",
      audience: "all",
      isPinned: false,
    },
  ]);

  const handleCreateAnnouncement = (data: {
    title: string;
    description: string;
    audience: "all" | "schools_coaches";
  }) => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      author: "Admin",
      createdAt: "Just now",
      audience: data.audience,
      isPinned: false,
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setShowCreateModal(false);
  };

  const handleEditAnnouncement = (data: {
    title: string;
    description: string;
    audience: "all" | "schools_coaches";
    isPinned: boolean;
  }) => {
    if (!editingAnnouncement) return;

    setAnnouncements(
      announcements.map((ann) =>
        ann.id === editingAnnouncement.id
          ? {
              ...ann,
              title: data.title,
              description: data.description,
              audience: data.audience,
              isPinned: data.audience !== "all" ? data.isPinned : false,
            }
          : ann
      )
    );

    setShowEditModal(false);
    setEditingAnnouncement(null);
  };

  const openEditModal = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingAnnouncement(null);
  };

  const pinnedAnnouncements = announcements.filter((ann) => ann.isPinned && ann.audience !== "all");
  
  // Filter announcements based on selected filter
  const filteredAnnouncements = filter === "show_all" 
    ? announcements 
    : announcements.filter(ann => ann.audience === filter);

  return (
    <div className="flex gap-8">
      {/* Left Column - Announcements */}
      <section className="flex-1">
        {/* Header (consistent with Player Screening) */}
        <header className="pt-8">
          <h1 className="text-3xl font-semibold text-gray-900">Announcements</h1>
          <p className="mt-2 text-sm text-gray-500">View announcements from BUCAL!</p>
        </header>

        {/* Filter Dropdown (placed below header for spacing consistency) */}
        <div className="mt-6 flex items-center justify-end">
          <span className="text-sm font-medium text-gray-600 mr-3">Filter by:</span>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | "schools_coaches" | "show_all")}
              className="appearance-none bg-white border-1 border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm"
            >
              <option value="show_all">All Announcements</option>
              <option value="all">For Everyone</option>
              <option value="schools_coaches">Schools & Coaches</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Create Announcement Button */}
        {canCreate && (
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-[#071689] hover:bg-[#0A1C9C] text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Create Announcement +
            </button>
          </div>
        )}

        {/* Announcement Cards */}
        <div className="mt-6 space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-sm font-medium">A</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{announcement.author}</p>
                      <p className="text-xs text-gray-500">{announcement.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        announcement.audience === "all"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {announcement.audience === "all" ? "All" : "Schools & Coaches"}
                    </span>
                    {announcement.isPinned && (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Pinned
                      </span>
                    )}
                    <button onClick={() => openEditModal(announcement)} className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                <p className="text-gray-600 text-sm">{announcement.description}</p>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 text-center">No announcements found for the selected filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Right Column - Pinned */}
      <aside className="w-80 pt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pinned Announcements</h2>
        {pinnedAnnouncements.length > 0 ? (
          <div className="space-y-3">
            {pinnedAnnouncements.map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-blue-600 text-xs font-medium">A</span>
                    </div>
                    <span className="text-xs text-gray-500">Admin - Pinned</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">{announcement.title}</h4>
                <p className="text-xs text-gray-600">
                  {announcement.description.length > 100
                    ? `${announcement.description.substring(0, 100)}...`
                    : announcement.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 text-center">No pinned announcements</p>
          </div>
        )}
      </aside>

      {/* Modals */}
      <CreateAnnouncementModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateAnnouncement}
      />

      <EditAnnouncementModal
        isOpen={showEditModal}
        onClose={closeEditModal}
        onSubmit={handleEditAnnouncement}
        announcement={editingAnnouncement}
      />
    </div>
  );
}

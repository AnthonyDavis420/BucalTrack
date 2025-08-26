import { useState, useEffect } from "react";

interface Announcement {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  audience: "all" | "schools_coaches";
  isPinned?: boolean;
}

interface EditAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    audience: "all" | "schools_coaches";
    isPinned: boolean;
  }) => void;
  announcement: Announcement | null;
}

export default function EditAnnouncementModal({
  isOpen,
  onClose,
  onSubmit,
  announcement,
}: EditAnnouncementModalProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    audience: "all" as "all" | "schools_coaches",
    isPinned: false,
  });

  useEffect(() => {
    if (announcement) {
      setForm({
        title: announcement.title,
        description: announcement.description,
        audience: announcement.audience,
        isPinned: announcement.isPinned || false,
      });
    }
  }, [announcement]);

  const handleSubmit = () => {
    if (!form.title.trim() || !form.description.trim()) return;
    
    onSubmit(form);
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={handleClose}
      />

      {/* Modal content */}
      <div className="relative z-10 bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Announcement</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter announcement title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter announcement description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
            <select
              value={form.audience}
              onChange={(e) =>
                setForm({ ...form, audience: e.target.value as "all" | "schools_coaches" })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="schools_coaches">Schools & Coaches Only</option>
            </select>
          </div>

          {form.audience !== "all" && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pin-announcement-edit"
                checked={form.isPinned}
                onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="pin-announcement-edit" className="ml-2 block text-sm text-gray-700">
                Pin this announcement
              </label>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-[#071689] hover:bg-[#0A1C9C] text-white rounded-md transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
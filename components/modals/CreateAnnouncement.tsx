import { useState } from "react";

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    audience: "all" | "schools_coaches";
  }) => void;
}

export default function CreateAnnouncementModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateAnnouncementModalProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    audience: "all" as "all" | "schools_coaches",
  });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.description.trim()) return;
    
    onSubmit(form);
    setForm({ title: "", description: "", audience: "all" });
  };

  const handleClose = () => {
    setForm({ title: "", description: "", audience: "all" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={handleClose}
      />

      {/* Modal content */}
      <div className="relative z-10 bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create Announcement</h2>

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
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
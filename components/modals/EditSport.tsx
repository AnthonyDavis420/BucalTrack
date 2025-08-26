import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Sport {
  id: number;
  name: string;
  description: string;
  requireJerseyNumber: boolean;
  requirePosition: boolean;
}

interface EditSportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    requireJerseyNumber: boolean;
    requirePosition: boolean;
  }) => void;
  sport: Sport | null;
}

export default function EditSportModal({
  isOpen,
  onClose,
  onSubmit,
  sport,
}: EditSportModalProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    requireJerseyNumber: false,
    requirePosition: false
  });

  useEffect(() => {
    if (sport) {
      setForm({
        name: sport.name,
        description: sport.description,
        requireJerseyNumber: sport.requireJerseyNumber,
        requirePosition: sport.requirePosition
      });
    }
  }, [sport]);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.description.trim()) return;
    
    onSubmit(form);
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !sport) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Sport</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sport Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Basketball"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Brief description of the sport"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Optional Player Attributes</label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit-jersey-number"
                  checked={form.requireJerseyNumber}
                  onChange={(e) => setForm({ ...form, requireJerseyNumber: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="edit-jersey-number" className="ml-2 text-sm text-gray-700">
                  Require Jersey Number
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit-position"
                  checked={form.requirePosition}
                  onChange={(e) => setForm({ ...form, requirePosition: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="edit-position" className="ml-2 text-sm text-gray-700">
                  Require Position
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-[#071689] hover:bg-[#0A1C9C] text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";

interface EventRow {
  id: string;
  name: string;
  date: string;
  time: string;
  sport: string;
  venue: string;
  status: "Active" | "Upcoming" | "Completed";
  result?: string;
}

interface ChangeVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    venueName: string;
    location: string;
  }) => void;
  event: EventRow | null;
}

export default function ChangeVenueModal({
  isOpen,
  onClose,
  onSubmit,
  event,
}: ChangeVenueModalProps) {
  const [formData, setFormData] = useState({
    venueName: "",
    location: "",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        venueName: event.venue,
        location: "",
      });
    }
  }, [event]);

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/60">
          <h2 className="text-xl font-semibold text-gray-900">Change Venue</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Venue Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name</label>
                <input
                  type="text"
                  value={formData.venueName}
                  onChange={(e) => setFormData({...formData, venueName: e.target.value})}
                  placeholder="e.g. UNC Dome"
                  className="w-full px-3 py-2 border border-gray-200/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Set Venue Location</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Select a location</option>
                  <option>ADNU Gym</option>
                  <option>NCF Court</option>
                  <option>UNC Dome</option>
                </select>
              </div>
            </div>

            {/* Right Column - Venue Layout */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Venue Layout</h3>
              
              <div className="border-2 border-dashed border-gray-200/60 rounded-xl p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Upload Image</p>
                  <p className="text-xs text-gray-400">PNG / JPG / SVG — drag & drop or click to select</p>
                </div>
                <button className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                  Replace Image
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200/60">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200/60 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-medium text-white bg-[#071689] rounded-lg hover:bg-[#1A2DB3] transition-colors"
          >
            Update Venue
          </button>
        </div>
      </div>
    </div>
  );
}
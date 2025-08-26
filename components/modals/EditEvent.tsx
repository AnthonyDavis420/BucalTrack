import { useState, useEffect } from "react";
import { X } from "lucide-react";

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

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    sport: string;
    date: string;
    time: string;
    teamA: string;
    teamB: string;
    venue: string;
    location: string;
    sections: Array<{
      name: string;
      side: string;
      maxTickets: string;
      price: string;
    }>;
  }) => void;
  event: EventRow | null;
}

export default function EditEventModal({
  isOpen,
  onClose,
  onSubmit,
  event,
}: EditEventModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    date: "",
    time: "",
    teamA: "NCF",
    teamB: "UNC",
    venue: "",
    location: "",
    sections: [{ name: "Courtside A", side: "A", maxTickets: "120", price: "150" }]
  });

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        sport: event.sport,
        date: event.date,
        time: event.time,
        teamA: "NCF",
        teamB: "UNC",
        venue: event.venue,
        location: "",
        sections: [{ name: "Courtside A", side: "A", maxTickets: "120", price: "150" }]
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

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { name: "", side: "A", maxTickets: "", price: "" }]
    });
  };

  const updateSection = (index: number, field: string, value: string) => {
    const newSections = [...formData.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setFormData({ ...formData, sections: newSections });
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/60">
          <h2 className="text-xl font-semibold text-gray-900">Edit Event</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Set Event Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Event Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Opening Game / Pep Rally"
                    className="w-full px-3 py-2 border border-gray-200/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Event</label>
                  <select
                    value={formData.sport}
                    onChange={(e) => setFormData({...formData, sport: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Basketball</option>
                    <option>Volleyball</option>
                    <option>Football</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Event Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Event Time</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    placeholder="--:-- --"
                    className="w-full px-3 py-2 border border-gray-200/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Team A</label>
                  <select
                    value={formData.teamA}
                    onChange={(e) => setFormData({...formData, teamA: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>NCF</option>
                    <option>UNC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Team B</label>
                  <select
                    value={formData.teamB}
                    onChange={(e) => setFormData({...formData, teamB: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>UNC</option>
                    <option>NCF</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Available Tickets */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Set Available Tickets</h3>
              
              <div className="space-y-3">
                {formData.sections.map((section, index) => (
                  <div key={index} className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Name of Section</label>
                      <input
                        type="text"
                        value={section.name}
                        onChange={(e) => updateSection(index, 'name', e.target.value)}
                        placeholder="e.g. Courtside A"
                        className="w-full px-3 py-2 border border-gray-200/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Team Side</label>
                      <select 
                        value={section.side}
                        onChange={(e) => updateSection(index, 'side', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Max Ticket</label>
                      <input
                        type="text"
                        value={section.maxTickets}
                        onChange={(e) => updateSection(index, 'maxTickets', e.target.value)}
                        placeholder="e.g. 120"
                        className="w-full px-3 py-2 border border-gray-200/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Ticket Price</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-200/60 bg-gray-50 text-gray-500 text-sm rounded-l-lg">₱</span>
                        <input
                          type="text"
                          value={section.price}
                          onChange={(e) => updateSection(index, 'price', e.target.value)}
                          placeholder="e.g. 150"
                          className="w-full px-3 py-2 border border-gray-200/60 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                          onClick={addSection}
                          className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200/60">
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
              Update Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
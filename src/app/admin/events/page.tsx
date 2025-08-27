"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Pencil, Calendar, Clock, MapPin, Trophy, Edit2, MoreVertical, MapPinIcon } from "lucide-react";
import EditEventModal from "@components/modals/EditEvent";
import ChangeVenueModal from "@components/modals/ChangeVenue";

type EventRow = {
  id: string;
  name: string;
  date: string;
  time: string;
  sport: string;
  venue: string;
  status: "Active" | "Upcoming" | "Completed";
  result?: string;
};

const data: EventRow[] = [
  {
    id: "1",
    name: "NCF vs UNC",
    date: "2024-12-15",
    time: "9:00AM - 12:00PM",
    sport: "Basketball",
    venue: "ADNU",
    status: "Active",
  },
  {
    id: "2",
    name: "NCF vs UNC",
    date: "2024-12-20",
    time: "2:00PM - 4:00PM",
    sport: "Volleyball",
    venue: "NCF",
    status: "Upcoming",
  },
  {
    id: "3",
    name: "NCF vs UNC",
    date: "2024-12-20",
    time: "4:30PM - 6:30PM",
    sport: "Basketball",
    venue: "UNC",
    status: "Completed",
    result: "NCF | 95-102",
  },
  // NEW: Cheer & Dance sample
  {
    id: "4",
    name: "Cheer & Dance Showcase",
    date: "2024-12-22",
    time: "1:00PM - 4:00PM",
    sport: "Cheer & Dance",
    venue: "ADNU Gym",
    status: "Upcoming",
  },
];

function StatusBadge({ s }: { s: EventRow["status"] }) {
  const styles =
    s === "Active"
      ? "bg-green-100 text-green-700 border-green-200"
      : s === "Upcoming"
      ? "bg-gray-100 text-gray-700 border-gray-200"
      : "bg-blue-100 text-blue-700 border-blue-200";
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${styles}`}>
      {s}
    </span>
  );
}

function EventCard({
  event,
  activeMenu,
  setActiveMenu,
}: {
  event: EventRow;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
}) {
  const isMenuOpen = activeMenu === event.id;

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(isMenuOpen ? null : event.id);
  };

  return (
    <div className="rounded-xl border border-gray-200/60 bg-white shadow-sm hover:shadow-md transition-shadow p-6 relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Trophy className="h-4 w-4" />
            <span>{event.sport}</span>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center gap-2">
          <StatusBadge s={event.status} />

          {/* Actions Menu */}
          <div className="relative">
            <button onClick={handleMenuToggle} className="p-1 rounded-md hover:bg-gray-100 transition-colors">
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200/60 rounded-lg shadow-lg z-10">
                <div className="py-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(`edit-${event.id}`);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Event
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(`venue-${event.id}`);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                  >
                    <MapPinIcon className="h-4 w-4" />
                    Change Venue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{event.venue}</span>
        </div>
      </div>

      {/* Result or Add Result */}
      <div className="pt-4 border-t border-gray-100">
        {event.result ? (
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Result</span>
            <p className="text-sm font-medium text-gray-900 mt-1">{event.result}</p>
          </div>
        ) : (
          <Link
            href={`/admin/events/${event.id}/result`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            title="Add result"
          >
            <Pencil className="h-4 w-4" />
            <span>Add result</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventRow[]>(data);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Sport filter
  const [sportFilter, setSportFilter] = useState<string>("all");

  // Ensure "Cheer & Dance" always appears in options
  const sportOptions = useMemo(() => {
    const set = new Set<string>(["Cheer & Dance"]);
    events.forEach((e) => set.add(e.sport));
    return ["all", ...Array.from(set)];
  }, [events]);

  // Reset to "all" if current filter disappears after edits
  useEffect(() => {
    if (sportFilter !== "all" && !sportOptions.includes(sportFilter)) {
      setSportFilter("all");
    }
  }, [sportOptions, sportFilter]);

  const filteredEvents = useMemo(
    () => (sportFilter === "all" ? events : events.filter((e) => e.sport === sportFilter)),
    [events, sportFilter]
  );

  const handleEditEvent = (
    eventId: string,
    data: {
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
    }
  ) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? { ...event, name: data.name, sport: data.sport, date: data.date, time: data.time, venue: data.venue }
          : event
      )
    );
    setActiveMenu(null);
  };

  const handleChangeVenue = (eventId: string, data: { venueName: string; location: string }) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, venue: data.venueName } : event)));
    setActiveMenu(null);
  };

  const getEventById = (id: string) => events.find((event) => event.id === id) || null;

  // Close menu when clicking outside
  const handleClickOutside = () => {
    setActiveMenu(null);
  };

  return (
    <div className="space-y-6 pt-8" onClick={handleClickOutside}>
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Event Management</h1>
        <p className="mt-2 text-sm text-gray-500">Create and manage sports events</p>
      </header>

      {/* Card Header with Create + Sport Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">All Events</h2>

        <div className="flex items-center gap-3">
          {/* Sport Filter */}
          <div className="relative">
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm"
              title="Filter by sport"
            >
              {sportOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "all" ? "All Sports" : opt}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <Link
            href="create"
            className="inline-flex items-center justify-center rounded-lg bg-[#071689] px-4 py-2 text-sm font-medium text-white hover:bg-[#1A2DB3] transition-colors"
          >
            + Create Event
          </Link>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        ))}
      </div>

      {/* Empty state */}
      {filteredEvents.length === 0 && (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center text-sm text-gray-500">
          No events found for this sport.
        </div>
      )}

      {/* Modals */}
      <EditEventModal
        isOpen={activeMenu?.startsWith("edit-") || false}
        onClose={() => setActiveMenu(null)}
        onSubmit={(data) => {
          const eventId = activeMenu?.replace("edit-", "") || "";
          handleEditEvent(eventId, data);
        }}
        event={activeMenu?.startsWith("edit-") ? getEventById(activeMenu.replace("edit-", "")) : null}
      />

      <ChangeVenueModal
        isOpen={activeMenu?.startsWith("venue-") || false}
        onClose={() => setActiveMenu(null)}
        onSubmit={(data) => {
          const eventId = activeMenu?.replace("venue-", "") || "";
          handleChangeVenue(eventId, data);
        }}
        event={activeMenu?.startsWith("venue-") ? getEventById(activeMenu.replace("venue-", "")) : null}
      />
    </div>
  );
}

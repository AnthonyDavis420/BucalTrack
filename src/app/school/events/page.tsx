"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Trophy } from "lucide-react";

interface User {
  email: string;
  role: string;
  isAuthenticated: boolean;
}

type Status = "Active" | "Upcoming" | "Completed";
type EventRow = {
  id: string;
  name: string;
  date: string;
  time: string;
  sport: "Basketball" | "Volleyball" | "Cheer & Dance";
  venue: string;
  status: Status;
};

const myEventsSeed: EventRow[] = [
  {
    id: "101",
    name: "ADNU vs NCF",
    date: "2024-12-15",
    time: "9:00AM - 12:00PM",
    sport: "Basketball",
    venue: "ADNU Gym",
    status: "Active",
  },
  {
    id: "102",
    name: "UNC vs ADNU",
    date: "2024-12-20",
    time: "2:00PM - 4:00PM",
    sport: "Volleyball",
    venue: "UNC Arena",
    status: "Upcoming",
  },
  {
    id: "103",
    name: "Cheer & Dance Showcase",
    date: "2024-12-22",
    time: "1:00PM - 4:00PM",
    sport: "Cheer & Dance",
    venue: "NCF Coliseum",
    status: "Upcoming",
  },
  {
    id: "104",
    name: "ADNU vs UNC",
    date: "2024-12-08",
    time: "4:30PM - 6:30PM",
    sport: "Basketball",
    venue: "UNC Arena",
    status: "Completed",
  },
];

function StatusBadge({ s }: { s: Status }) {
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

function EventCardSchool({ event }: { event: EventRow }) {
  return (
    <div className="rounded-xl border border-gray-200/60 bg-white shadow-sm hover:shadow-md transition-shadow p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Trophy className="h-4 w-4" />
            <span>{event.sport}</span>
          </div>
        </div>

        {/* Status (same look as admin) */}
        <StatusBadge s={event.status} />
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

      {/* Action (school can only view) */}
      <div className="pt-4 border-t border-gray-100">
        <Link
          href={`/school/events/${event.id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          title="View details"
        >
          <span>View details</span>
        </Link>
      </div>
    </div>
  );
}

export default function SchoolEventsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // Sport filter (fixed options to keep parity with admin)
  const [sportFilter, setSportFilter] = useState<"all" | "Basketball" | "Volleyball" | "Cheer & Dance">("all");

  // Load auth (same behavior as your previous file)
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (!raw) {
        router.push("/");
        return;
      }
      const parsed = JSON.parse(raw) as User;
      if (parsed?.isAuthenticated && parsed?.role === "school") {
        setUser(parsed);
      } else {
        router.push("/");
        return;
      }
    } finally {
      setReady(true);
    }
  }, [router]);

  const [events] = useState<EventRow[]>(myEventsSeed);

  const filtered = useMemo(
    () => (sportFilter === "all" ? events : events.filter((e) => e.sport === sportFilter)),
    [events, sportFilter]
  );

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="space-y-6 pt-8">
      {/* Header (matches admin spacing/typography) */}
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">My Events</h1>
        <p className="mt-2 text-sm text-gray-500">Events your school is participating in</p>
      </header>

      {/* Card Header with Sport Filter (mirrors admin layout) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">All My Events</h2>

        <div className="flex items-center gap-3">
          {/* Sport Filter */}
          <div className="relative">
            <select
              value={sportFilter}
              onChange={(e) =>
                setSportFilter(e.target.value as "all" | "Basketball" | "Volleyball" | "Cheer & Dance")
              }
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm"
              title="Filter by sport"
            >
              <option value="all">All Sports</option>
              <option value="Basketball">Basketball</option>
              <option value="Volleyball">Volleyball</option>
              <option value="Cheer & Dance">Cheer &amp; Dance</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid (same grid as admin) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((event) => (
          <EventCardSchool key={event.id} event={event} />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center text-sm text-gray-500">
          No events found for this sport.
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

/* Replace with real data later */
const TEAM_OPTIONS = ["UNC", "ADNU", "USI", "NCF"];
const EVENT_OPTIONS = [
  "Basketball",
  "Volleyball",
  "Cheer and Dance",
  "Futsal",
  "Table Tennis",
];

type TeamSelect = { id: string; value: string };
type TicketRow = { id: string; section: string; side: "A" | "B" | ""; max: string; price: string };

export default function CreateEventPage() {
  /* -------- Event details -------- */
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState<string>("Basketball");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Match-up (non-cheer) */
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");

  /* Participating teams (cheer) */
  const [teams, setTeams] = useState<TeamSelect[]>([
    { id: crypto.randomUUID(), value: "" },
    { id: crypto.randomUUID(), value: "" },
  ]);
  
  const addTeam = () => {
    if (teams.length < 10) {
      setTeams((p) => [...p, { id: crypto.randomUUID(), value: "" }]);
    }
  };
  
  const removeTeam = (id: string) => {
    if (teams.length > 2) {
      setTeams((p) => p.filter((t) => t.id !== id));
    }
  };
  
  const updateTeam = (id: string, value: string) =>
    setTeams((p) => p.map((t) => (t.id === id ? { ...t, value } : t)));

  /* -------- Venue details -------- */
  const [venueName, setVenueName] = useState("");
  const [venueLocation, setVenueLocation] = useState("");

  const [tickets, setTickets] = useState<TicketRow[]>([
    { id: crypto.randomUUID(), section: "", side: "", max: "", price: "" },
  ]);
  const addTicketRow = () =>
    setTickets((p) => [...p, { id: crypto.randomUUID(), section: "", side: "", max: "", price: "" }]);
  const updateTicket = (id: string, patch: Partial<TicketRow>) =>
    setTickets((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const removeTicket = (id: string) => setTickets((p) => p.filter((r) => r.id !== id));

  const isCheer = eventType === "Cheer and Dance";

  // Form validation
  const validateForm = () => {
    if (!eventName) return "Event name is required";
    if (!eventDate) return "Event date is required";
    if (!eventTime) return "Event time is required";
    if (!venueName) return "Venue name is required";
    if (!venueLocation) return "Venue location is required";
    
    if (!isCheer) {
      if (!teamA) return "Team A is required";
      if (!teamB) return "Team B is required";
    } else {
      const validTeams = teams.filter(t => t.value);
      if (validTeams.length < 2) return "At least 2 teams are required";
    }
    
    const validTickets = tickets.filter(t => t.section && t.max && t.price);
    if (validTickets.length === 0) return "At least one ticket section is required";
    
    return null;
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare data for backend
    const eventData = {
      event: {
        name: eventName,
        type: eventType,
        date: eventDate,
        time: eventTime,
        venue: {
          name: venueName,
          location: venueLocation
        }
      },
      matchup: !isCheer ? {
        teamA,
        teamB
      } : null,
      participants: isCheer ? teams
        .filter(t => t.value)
        .map(t => t.value) : null,
      tickets: tickets
        .filter(t => t.section && t.max && t.price)
        .map(t => ({
          section: t.section,
          side: t.side,
          max_tickets: parseInt(t.max),
          price: parseFloat(t.price)
        }))
    };
    
    try {
      // This is where you would integrate with your backend API
      console.log("Submitting event data:", eventData);
      
      // Example API call (replace with your actual endpoint)
      /*
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      
      const result = await response.json();
      */
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert("Event created successfully!");
      
      // Reset form after successful submission
      setEventName("");
      setEventDate("");
      setEventTime("");
      setTeamA("");
      setTeamB("");
      setVenueName("");
      setVenueLocation("");
      setTeams([
        { id: crypto.randomUUID(), value: "" },
        { id: crypto.randomUUID(), value: "" },
      ]);
      setTickets([
        { id: crypto.randomUUID(), section: "", side: "", max: "", price: "" },
      ]);
      
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Header */}
      <header className="flex items-center gap-3">
        <Link
          href="/admin/events"
          className="rounded-md border border-gray-200 px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          ← Back
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Create Event</h1>
          <p className="mt-1 text-xs text-gray-500">Upload Venue Layout and Modify the venue</p>
        </div>
      </header>

      {/* ===== Card ===== */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Set Event Details */}
          <section className="border-b border-gray-200 p-6">
            <h3 className="mb-4 text-base font-semibold text-gray-900">Set Event Details</h3>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Event Name */}
              <div className="md:col-span-1">
                <label className="text-xs font-medium text-gray-600">Event Name</label>
                <input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. Opening Game / Pep Rally"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>

              {/* Event type */}
              <div className="md:col-span-1">
                <label className="text-xs font-medium text-gray-600">Event</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  required
                >
                  {EVENT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Date */}
              <div className="md:col-span-1">
                <label className="text-xs font-medium text-gray-600">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>

              {/* Event Time */}
              <div className="md:col-span-1">
                <label className="text-xs font-medium text-gray-600">Event Time</label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>

              {/* Match-up (hidden for Cheer and Dance) */}
              {!isCheer && (
                <>
                  <div className="md:col-span-1">
                    <label className="text-xs font-medium text-gray-600">Team A</label>
                    <select
                      value={teamA}
                      onChange={(e) => setTeamA(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select team</option>
                      {TEAM_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-xs font-medium text-gray-600">Team B</label>
                    <select
                      value={teamB}
                      onChange={(e) => setTeamB(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select team</option>
                      {TEAM_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Participating Teams (Cheer and Dance) - IMPROVED */}
              {isCheer && (
                <div className="md:col-span-3">
                  <label className="text-xs font-medium text-gray-600">Participating Teams</label>
                  <div className="mt-2 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {teams.map((t) => (
                        <div key={t.id} className="flex items-center gap-1">
                          <select
                            value={t.value}
                            onChange={(e) => updateTeam(t.id, e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
                            required={teams.filter(team => team.value).length < 2}
                          >
                            <option value="">Select team</option>
                            {TEAM_OPTIONS.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                          {teams.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeTeam(t.id)}
                              className="text-gray-400 hover:text-red-500 text-xs p-1"
                              title="Remove team"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addTeam}
                      disabled={teams.length >= 10}
                      className="mt-2 flex items-center text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      + Add team
                    </button>
                    {teams.length >= 10 && (
                      <p className="text-xs text-gray-500 mt-1">Maximum of 10 teams reached</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Venue + Tickets */}
          <section className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
            {/* Left: Venue form */}
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-gray-900">Venue Details</h3>

              {/* Venue Name */}
              <div>
                <label className="text-xs font-medium text-gray-600">Venue Name</label>
                <input
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g. UNC Dome"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>

              {/* Set Venue Location (select look) */}
              <div>
                <label className="text-xs font-medium text-gray-600">Set Venue Location</label>
                <div className="relative mt-1">
                  <select
                    value={venueLocation}
                    onChange={(e) => setVenueLocation(e.target.value)}
                    className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm pr-9"
                    required
                  >
                    <option value="">Select a location</option>
                    <option value="UNC Dome">UNC Dome</option>
                    <option value="ADNU Gym">ADNU Gym</option>
                    <option value="USI Arena">USI Arena</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    ▾
                  </span>
                </div>
              </div>

              {/* Set Available Tickets - IMPROVED */}
              <div>
                <label className="text-xs font-medium text-gray-600">Set Available Tickets:</label>
                
                {/* Header row */}
                <div className="mt-2 grid grid-cols-12 gap-2 text-xs text-gray-500 mb-1">
                  <div className="col-span-4 pl-2">Name of Section</div>
                  <div className="col-span-2">Team Side</div>
                  <div className="col-span-2">Max Ticket</div>
                  <div className="col-span-3">Ticket Price</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Ticket rows */}
                {tickets.map((ticket, index) => (
                  <div key={ticket.id} className="grid grid-cols-12 gap-2 mb-2">
                    {/* Name of Section */}
                    <div className="col-span-4">
                      <input
                        value={ticket.section}
                        onChange={(e) => updateTicket(ticket.id, { section: e.target.value })}
                        className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                        placeholder="e.g. Courtside A"
                        required={index === 0}
                      />
                    </div>

                    {/* Team Side */}
                    <div className="col-span-2">
                      <div className="relative">
                        <select
                          value={ticket.side}
                          onChange={(e) =>
                            updateTicket(ticket.id, { side: e.target.value as "A" | "B" | "" })
                          }
                          className="w-full appearance-none rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm pr-7"
                        >
                          <option value="">—</option>
                          <option value="A">Team A</option>
                          <option value="B">Team B</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                          ▾
                        </span>
                      </div>
                    </div>

                    {/* Max Ticket */}
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={ticket.max}
                        onChange={(e) => updateTicket(ticket.id, { max: e.target.value })}
                        className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                        placeholder="e.g. 120"
                        required={index === 0}
                        min="1"
                      />
                    </div>

                    {/* Ticket Price */}
                    <div className="col-span-3">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-sm">₱</span>
                        </div>
                        <input
                          type="number"
                          value={ticket.price}
                          onChange={(e) => updateTicket(ticket.id, { price: e.target.value })}
                          className="w-full rounded-md border border-gray-300 pl-6 pr-2 py-1.5 text-sm"
                          placeholder="e.g. 150"
                          required={index === 0}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="col-span-1 flex items-center">
                      {index === tickets.length - 1 ? (
                        <button
                          type="button"
                          onClick={addTicketRow}
                          title="Add ticket row"
                          className="h-7 w-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                        >
                          +
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeTicket(ticket.id)}
                          title="Remove ticket row"
                          className="h-7 w-7 flex items-center justify-center rounded-full border border-gray-300 text-red-500 hover:bg-gray-50 text-sm"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="mt-4 w-full rounded-lg bg-[#071689] px-4 py-3 text-sm font-medium text-white hover:bg-[#0a1a9f] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating Event..." : "Create Event"}
                </button>
              </div>
            </div>

            {/* Right: Upload Image placeholder (always) */}
            <div>
              <h3 className="mb-3 text-base font-semibold text-gray-900">Venue Layout</h3>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex h-72 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-700">Upload Image</div>
                    <div className="mt-1 text-xs text-gray-500">
                      PNG / JPG / SVG — drag &amp; drop or click to select
                    </div>
                  </div>
                </div>
                <button type="button" className="mt-3 w-full rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Replace Image
                </button>
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
"use client";

import { useState } from "react";

type TicketStatus = "Open" | "Pending" | "Resolved" | "Closed";

type Ticket = {
  id: string;
  subject: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
  status: TicketStatus;
  priority: "Normal" | "High";
  sport?: string;
  messages: { sender: "User" | "Admin"; time: string; text: string }[];
};

/* === Mock Data === */
const MOCK_TICKETS: Ticket[] = [
  {
    id: "T-1001",
    subject: "Cannot access my ticket QR",
    userEmail: "juan@example.com",
    createdAt: "2025-08-12 09:10",
    updatedAt: "2025-08-12 10:02",
    status: "Open",
    priority: "Normal",
    sport: "Basketball",
    messages: [
      { sender: "User", time: "2025-08-12 09:10", text: "Hi, I bought a ticket but can't view the QR." },
      { sender: "Admin", time: "2025-08-12 09:38", text: "Hello! Can you confirm your order number?" },
    ],
  },
  {
    id: "T-1002",
    subject: "Refund request - event reschedule",
    userEmail: "maria@example.com",
    createdAt: "2025-08-12 08:15",
    updatedAt: "2025-08-12 08:20",
    status: "Pending",
    priority: "Normal",
    messages: [{ sender: "User", time: "2025-08-12 08:15", text: "Event rescheduled, I want a refund." }],
  },
];

export default function SupportPage() {
  const [tickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [selected, setSelected] = useState<Ticket | null>(MOCK_TICKETS[0]);

  const openTickets = tickets.filter((t) => t.status === "Open");

  return (
    <div className="space-y-6 pt-6">
      {/* HEADER */}
      <header className="rounded-xl bg-gradient-to-r from-[#071689] to-blue-600 p-6 text-white shadow">
        <h1 className="text-2xl font-semibold">Support</h1>
        <p className="mt-1 text-sm text-blue-100">View and respond to customer support tickets.</p>
      </header>


      {/* MAIN CONTENT */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="col-span-1 rounded-xl border bg-white shadow-sm">
          <div className="p-4 border-b text-sm font-medium text-gray-700">
            Tickets <span className="text-gray-400">({tickets.length} results)</span>
          </div>
          <ul className="divide-y">
            {tickets.map((t) => (
              <li
                key={t.id}
                onClick={() => setSelected(t)}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selected?.id === t.id ? "bg-gray-50" : ""
                }`}
              >
                <div className="text-sm font-semibold text-gray-900">{t.subject}</div>
                <div className="text-xs text-gray-500">{t.userEmail} • {t.id}</div>
                <div className="mt-1 text-xs text-gray-400">Updated {t.updatedAt}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Ticket Detail */}
        {selected && (
          <div className="col-span-2 rounded-xl border bg-white shadow-sm flex flex-col">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">{selected.subject}</h2>
                <p className="text-sm text-gray-500">
                  {selected.userEmail} • {selected.createdAt} • {selected.sport || "General"}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selected.messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                    m.sender === "User"
                      ? "bg-gray-100 text-gray-900 self-start"
                      : "bg-[#071689] text-white self-end ml-auto"
                  }`}
                >
                  <div className="text-xs opacity-70">{m.sender} • {m.time}</div>
                  <div>{m.text}</div>
                </div>
              ))}
            </div>

            <div className="border-t p-4">
              <textarea
                placeholder="Reply via email..."
                className="w-full rounded-lg border p-3 text-sm"
                rows={3}
              />
              <div className="mt-3 flex justify-end">
                <button className="rounded-lg bg-[#071689] px-4 py-2 text-sm font-medium text-white">
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
